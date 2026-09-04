"""Instrumento do GATE D016-PROT1 — leitura e classificação da proteção de `develop`.

Demanda 016-registro-contra-execucao · P16.b · T031 (build-engineer). Consumido
por `check_branch_protection.py` (o gate; não decide, só orquestra CLI/sonda/
relato — o contrato completo está no docstring de lá, sob
"CONTRATO DO INSTRUMENTO"). Este arquivo é PURO em `classificar` — só
`ler_api` toca rede/processo (R7: o gate que o chama é o único não-puro por
construção do pipeline; aqui a impureza fica isolada nesta única função).

Resumo do modelo (a fonte normativa é o docstring do gate, não este resumo):

  Um contexto de `checks_obrigatorios` está coberto se EXIGIDO por ≥ 1
  mecanismo — o ruleset (regra `required_status_checks`, lida em
  `rules/branches/{ref}`) OU a proteção clássica ATIVA (`branches/{ref}`,
  `protection.enabled=true` e `enforcement_level != "off"`). "Up-to-date"
  só é comprovadamente satisfeito quando o PRÓPRIO ruleset declara
  `strict_required_status_checks_policy=true` — a proteção clássica nunca
  prova strict (T7 e): se só ela cobre os contextos, o resultado é PROTEGIDA
  com aviso e severidade WARN, nunca uma prova de up-to-date.

  Um contexto só conta como FALTANDO (prova de DESPROTEGIDA) quando os DOIS
  endpoints responderam 200 e nenhum dos dois o cobre. Se um dos dois não
  respondeu 200 (erro de transporte, 401/403, outro status) e o contexto não
  está coberto pelo que SOBROU, o veredito é NÃO DETERMINÁVEL — o endpoint
  ausente poderia tê-lo coberto. Mas se o lado que RESPONDEU já cobre tudo
  sozinho, o lado ausente não derruba o veredito (armadilha `hoje`/`classic_off`
  incluída: `protected: true` com `enabled=false`/`enforcement_level="off"` e
  ruleset sem `required_status_checks` é DESPROTEGIDA, não PROTEGIDA).
"""
from __future__ import annotations

import json
import os
import socket
import subprocess
import urllib.error
import urllib.parse
import urllib.request

VEREDITOS = ("PROTEGIDA", "DESPROTEGIDA", "NÃO DETERMINÁVEL")
TIMEOUT_S = 10
API = "https://api.github.com"


# ============================================================== classificar
def _readable(resp):
    return resp.get("status") == 200 and resp.get("erro") is None


def _parse_ruleset(body):
    """Lê a resposta de GET /repos/{repo}/rules/branches/{ref} (lista de regras)."""
    tem_regra = False
    contextos = set()
    strict = None
    ids = set()
    outras = []
    for regra in body or []:
        tipo = regra.get("type")
        rid = regra.get("ruleset_id")
        if rid is not None:
            ids.add(rid)
        if tipo == "required_status_checks":
            tem_regra = True
            parametros = regra.get("parameters") or {}
            for c in parametros.get("required_status_checks") or []:
                ctx = c.get("context")
                if ctx:
                    contextos.add(ctx)
            s = parametros.get("strict_required_status_checks_policy")
            if s is not None:
                strict = bool(s)
        elif tipo:
            outras.append(tipo)
    return tem_regra, contextos, strict, sorted(ids), outras


def _parse_classic(body):
    """Lê a resposta de GET /repos/{repo}/branches/{ref} (proteção clássica)."""
    protecao = (body or {}).get("protection") or {}
    habilitada = bool(protecao.get("enabled"))
    rsc = protecao.get("required_status_checks") or {}
    enforcement = rsc.get("enforcement_level")
    ativa = bool(habilitada and enforcement not in (None, "off"))
    contextos = set(rsc.get("contexts") or [])
    for c in rsc.get("checks") or []:
        ctx = c.get("context")
        if ctx:
            contextos.add(ctx)
    return ativa, contextos, enforcement


def _mensagem(resp):
    corpo = resp.get("body")
    return corpo.get("message") if isinstance(corpo, dict) else None


def _causa_de_resposta(resp):
    erro = resp.get("erro")
    if erro:
        return erro.get("classe"), erro.get("detalhe")
    status = resp.get("status")
    if status in (401, 403):
        return f"permissão {status}", _mensagem(resp)
    return f"resposta {status}", _mensagem(resp)


def _mecanismo(rules_ok, tem_regra, ruleset_ids, outras_regras, branch_ok, classic_ativa):
    partes = []
    if rules_ok:
        rid = ruleset_ids[0] if ruleset_ids else None
        if tem_regra:
            partes.append(f"ruleset {rid}" if rid is not None else "ruleset")
        elif rid is not None:
            tipos = ", ".join(sorted(set(outras_regras))) if outras_regras else "sem regras lidas"
            partes.append(f"ruleset {rid} ({tipos})")
    if branch_ok:
        partes.append(f"classic enabled={'true' if classic_ativa else 'false'}")
    return " + ".join(partes) if partes else "não determinável"


def _nao_determinavel(causa, causa_detalhe, modo_ci):
    return {
        "veredito": "NÃO DETERMINÁVEL",
        "causa": causa,
        "causa_detalhe": causa_detalhe,
        "faltam": [],
        "mecanismo": "não determinável",
        "contextos": [],
        "strict": None,
        "outras_regras": [],
        "avisos": [],
        "severidade": "FAIL" if modo_ci else "WARN",
    }


def classificar(rules, branch, esperado, modo_ci):
    """PURO — nenhuma chamada de rede/processo. Ver o contrato completo no
    docstring de check_branch_protection.py."""
    necessarios = set(esperado.get("checks_obrigatorios") or [])
    up_to_date_esperado = bool(esperado.get("up_to_date"))

    rules_ok = _readable(rules)
    branch_ok = _readable(branch)

    tem_regra, contextos_ruleset, strict, ruleset_ids, outras_regras = (
        _parse_ruleset(rules.get("body")) if rules_ok else (False, set(), None, [], [])
    )
    classic_ativa, contextos_classic, _enforcement = (
        _parse_classic(branch.get("body")) if branch_ok else (False, set(), None)
    )

    # 1. cobertura por contexto — "faltando" só quando os DOIS lados falaram
    desconhecido = False
    faltam_ctx = []
    for ctx in necessarios:
        coberto = (rules_ok and ctx in contextos_ruleset) or (branch_ok and classic_ativa and ctx in contextos_classic)
        if coberto:
            continue
        if rules_ok and branch_ok:
            faltam_ctx.append(ctx)
        else:
            desconhecido = True

    if desconhecido:
        if not rules_ok:
            causa, causa_detalhe = _causa_de_resposta(rules)
        else:
            causa, causa_detalhe = _causa_de_resposta(branch)
        return _nao_determinavel(causa, causa_detalhe, modo_ci)

    faltam_ctx.sort()

    # 2. up-to-date — só o ruleset prova strict; a clássica nunca prova (T7 e)
    strict_provado_true = rules_ok and tem_regra and strict is True
    strict_provado_false = rules_ok and tem_regra and strict is False

    faltam = list(faltam_ctx)
    avisos = []
    if up_to_date_esperado:
        if strict_provado_false:
            faltam.append("up-to-date")
        elif not strict_provado_true:
            if faltam_ctx:
                faltam.append("up-to-date")  # fail-closed: contextos já faltam
            else:
                avisos.append("up-to-date: não determinável (classic)")
    faltam = sorted(set(faltam))

    mecanismo = _mecanismo(rules_ok, tem_regra, ruleset_ids, outras_regras, branch_ok, classic_ativa)
    contextos_provados = sorted(necessarios - set(faltam_ctx))
    strict_relatado = True if strict_provado_true else (False if strict_provado_false else None)

    if faltam:
        return {
            "veredito": "DESPROTEGIDA",
            "causa": None,
            "causa_detalhe": None,
            "faltam": faltam,
            "mecanismo": mecanismo,
            "contextos": contextos_provados,
            "strict": strict_relatado,
            "outras_regras": sorted(set(outras_regras)),
            "avisos": avisos,
            "severidade": "FAIL",
        }
    return {
        "veredito": "PROTEGIDA",
        "causa": None,
        "causa_detalhe": None,
        "faltam": [],
        "mecanismo": mecanismo,
        "contextos": contextos_provados,
        "strict": strict_relatado,
        "outras_regras": sorted(set(outras_regras)),
        "avisos": avisos,
        "severidade": "WARN" if avisos else "PASS",
    }


# ==================================================================== ler_api
class _SemRedirectDeToken(urllib.request.HTTPRedirectHandler):
    """Não vaza o Authorization para host de redirect (forma de check_evidence_bridge.py)."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        novo = super().redirect_request(req, fp, code, msg, headers, newurl)
        if novo is not None:
            de = urllib.parse.urlsplit(req.full_url).netloc
            para = urllib.parse.urlsplit(newurl).netloc
            if de != para:
                novo.headers.pop("Authorization", None)
        return novo


def _repo_do_remote():
    try:
        r = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            capture_output=True, text=True, timeout=TIMEOUT_S,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    if r.returncode != 0:
        return None
    url = r.stdout.strip()
    if url.endswith(".git"):
        url = url[: -len(".git")]
    for prefixo in ("git@github.com:", "ssh://git@github.com/", "https://github.com/", "http://github.com/"):
        if url.startswith(prefixo):
            return url[len(prefixo):]
    return url or None


def _repo_atual():
    return os.environ.get("GITHUB_REPOSITORY") or _repo_do_remote()


def _token():
    t = os.environ.get("GITHUB_TOKEN")
    if t:
        return t, "GITHUB_TOKEN"
    try:
        r = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, timeout=TIMEOUT_S)
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip(), "gh auth token"
    except (OSError, subprocess.SubprocessError):
        pass
    return None, "nenhum (anônimo)"


def _get(url, token):
    cabecalhos = {"User-Agent": "quickscan-branch-protection", "Accept": "application/vnd.github+json"}
    if token:
        cabecalhos["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=cabecalhos)
    abridor = urllib.request.build_opener(_SemRedirectDeToken())
    try:
        with abridor.open(req, timeout=TIMEOUT_S) as resp:
            corpo = resp.read().decode("utf-8", errors="replace")
            status = getattr(resp, "status", None) or resp.getcode()
            return {"status": status, "body": json.loads(corpo) if corpo else None, "erro": None}
    except urllib.error.HTTPError as e:
        try:
            corpo = e.read().decode("utf-8", errors="replace") if e.fp else ""
        except (OSError, AttributeError):
            corpo = ""
        try:
            body = json.loads(corpo) if corpo else None
        except json.JSONDecodeError:
            body = {"message": corpo} if corpo else None
        return {"status": e.code, "body": body, "erro": None}
    except (urllib.error.URLError, socket.timeout, TimeoutError, OSError) as e:
        motivo = getattr(e, "reason", e)
        return {"status": None, "body": None, "erro": {"classe": "rede", "detalhe": str(motivo)}}


def ler_api(esperado):
    """I/O (rede) — a única função impura deste módulo. Ver contrato no
    docstring de check_branch_protection.py."""
    token, token_fonte = _token()
    repo = _repo_atual()
    repo_fonte = "GITHUB_REPOSITORY" if os.environ.get("GITHUB_REPOSITORY") else "git remote get-url origin"

    if repo != esperado.get("repo"):
        erro = {"classe": "repositório não identificado",
                "detalhe": f"esperado {esperado.get('repo')}, remote {repo}"}
        vazio_rules = {"status": None, "body": None, "erro": dict(erro)}
        vazio_branch = {"status": None, "body": None, "erro": dict(erro)}
        return {"rules": vazio_rules, "branch": vazio_branch, "token_fonte": token_fonte,
                "repo": repo, "repo_fonte": repo_fonte}

    ref = urllib.parse.quote(str(esperado.get("ref")))
    rules = _get(f"{API}/repos/{repo}/rules/branches/{ref}", token)
    branch = _get(f"{API}/repos/{repo}/branches/{ref}", token)
    return {"rules": rules, "branch": branch, "token_fonte": token_fonte, "repo": repo, "repo_fonte": repo_fonte}
