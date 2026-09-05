#!/usr/bin/env python3
"""Seção `branch-protection` do compliance-audit — o GATE D016-PROT1.

Demanda 016-registro-contra-execucao · P16.b · critérios C6 e C7. A proteção de
`develop` é dado, não prosa (R6): `.claude/verify/branch_protection.json` diz o
que tem de valer (checks obrigatórios `verify`, `visual`, `fecho` + up-to-date,
decisão P2/E1 do usuário) e este gate compara a configuração AO VIVO com isso a
cada auditoria. Dono: qa-engineer. R3 §2: quem implementa o instrumento NÃO
edita este arquivo — mudança necessária volta por DEPENDÊNCIAS.

ESTE ARQUIVO NÃO DECIDE. Classificação e leitura da API vivem em
`branch_protection.py` (o INSTRUMENTO, do build-engineer). Aqui: CLI, sonda
pinada (C7 — 9 pares de respostas enlatadas, cada um classificado em modo local
E em modo CI), leitura → classificação → relato, política T7 como RELATO da
severidade que o classificador devolve, e o exit.

ESTE GATE LÊ O MUNDO (R7): é o único não-puro por construção — dois GETs na API
do GitHub, e a primeira linha da saída diz isso. A sonda, porém, NUNCA toca a
rede. Imprime a FONTE do token (GITHUB_TOKEN | gh auth token | nenhum), nunca o
token. Nada escreve (R7 §3).

POLÍTICA T7 (relatada, decidida pelo classificador): DESPROTEGIDA ⇒ [FAIL] em
qualquer ambiente; NÃO DETERMINÁVEL (rede | permissão <status> | repositório
não identificado | resposta <status>) ⇒ [WARN] nomeado localmente, [FAIL] sob
GITHUB_ACTIONS; strict sob proteção clássica ⇒ [WARN] permanente, declarado.
WARN nomeado não é SKIP (R10 §2).

USO
  python .claude/verify/check_branch_protection.py            # sonda + API ao vivo
  python .claude/verify/check_branch_protection.py --sonda    # só a sonda; JSON em stdout
  python .claude/verify/check_branch_protection.py --json     # objeto completo em stdout
  python .claude/verify/check_branch_protection.py --fixture <arquivo.json>
        diagnóstico LOCAL: substitui a leitura da API pelo par {rules, branch} do
        arquivo; a saída diz `modo: fixture`; RECUSADO sob GITHUB_ACTIONS (exit 2)
        — ao vivo nenhum parâmetro substitui o que o gate lê do mundo (spec §CLI).

RED (Fase 4): o instrumento não existe ⇒ os 9 casos saem `INSTRUMENTO AUSENTE`,
a leitura ao vivo não acontece, exit 1.

===================== CONTRATO DO INSTRUMENTO (branch_protection.py) =========
Importado por caminho (.claude/verify/branch_protection.py). Símbolos exigidos:

  VEREDITOS   conjunto FECHADO: "PROTEGIDA" · "DESPROTEGIDA" · "NÃO DETERMINÁVEL"

  classificar(rules, branch, esperado, modo_ci) -> dict          PURO
    rules   resposta de GET /repos/{repo}/rules/branches/{ref}  {status, body, erro}
    branch  resposta de GET /repos/{repo}/branches/{ref}        {status, body, erro}
            status int|null · body JSON|null · erro null | {classe, detalhe} (falha de
            transporte, sem resposta HTTP; classe "rede" ou "repositório não identificado")
    esperado {repo, ref, checks_obrigatorios, up_to_date}        (branch_protection.json)
    modo_ci  bool (GITHUB_ACTIONS presente)
    devolve {"veredito": <VEREDITOS>,
             "causa": null | "rede" | "permissão <status>" | "repositório não identificado"
                      | "resposta <status>",           # não vazia sse NÃO DETERMINÁVEL (T10)
             "causa_detalhe": str|null,
             "faltam": [<contexto de checks_obrigatorios>… , "up-to-date"],  # vazio se PROTEGIDA
             "mecanismo": str,          # ex. "ruleset 21381133" · "classic" · "ruleset 21381133 (deletion, non_fast_forward) + classic enabled=false"
             "contextos": [str],        # contextos exigidos encontrados (qualquer mecanismo)
             "strict": true|false|null, # null = não legível (classic, T7 e)
             "outras_regras": [str],    # impressas, não julgadas (C6 f)
             "avisos": [str],           # ex. "up-to-date: não determinável (classic)"
             "severidade": "PASS"|"FAIL"|"WARN"}
    PROTEGIDA sse cada contexto de checks_obrigatorios é exigido por ≥ 1 mecanismo — ruleset
    com regra required_status_checks (parameters.required_status_checks[].context) ou classic
    com protection.enabled true e required_status_checks.enforcement_level ≠ "off" (contexts /
    checks[].context) — E, quando up_to_date é esperado, strict_required_status_checks_policy
    true no ruleset; se só o classic satisfaz os contextos, strict é null ⇒ PROTEGIDA com aviso
    e severidade WARN (T7 e). DESPROTEGIDA quando os dois endpoints permitem decidir e algo
    falta (`protected: true` com enabled false / enforcement_level off e ruleset sem
    required_status_checks é DESPROTEGIDA — o estado de 2026-09-04, fixture `hoje`).
    NÃO DETERMINÁVEL quando um endpoint NECESSÁRIO para decidir não respondeu 200 (erro de
    transporte ⇒ "rede"; 401/403 ⇒ "permissão <status>"; outro ⇒ "resposta <status>") ou o
    repositório não foi identificado — se o ruleset sozinho já prova PROTEGIDA, o classic
    ilegível não derruba o veredito. O veredito e `faltam` não dependem de modo_ci; só a
    severidade: PROTEGIDA ⇒ PASS (WARN se há avisos); DESPROTEGIDA ⇒ FAIL; NÃO DETERMINÁVEL
    ⇒ WARN se modo_ci false, FAIL se true.

  ler_api(esperado) -> {rules, branch, token_fonte, repo, repo_fonte}     I/O (rede)
    repo: GITHUB_REPOSITORY → `git remote get-url origin` (normalizado para owner/repo, sem
    .git); repo ≠ esperado["repo"] ⇒ NENHUMA chamada e os dois lados voltam {status null,
    body null, erro {classe "repositório não identificado", detalhe "esperado X, remote Y"}}.
    token: GITHUB_TOKEN → `gh auth token` → nenhum; urllib com timeout; redirect sem token
    (forma de check_evidence_bridge.py). token_fonte ∈ {"GITHUB_TOKEN", "gh auth token",
    "nenhum (anônimo)"} — o token nunca sai da função.
==============================================================================
"""
import importlib.util
import json
import os
import sys
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

AQUI = Path(__file__).resolve().parent
INSTRUMENTO = AQUI / "branch_protection.py"
REGISTRO = Path(".claude/verify/branch_protection.json")
GATE = "D016-PROT1"
MODO_CI = "GITHUB_ACTIONS" in os.environ
VOCABULARIO = frozenset({"PROTEGIDA", "DESPROTEGIDA", "NÃO DETERMINÁVEL"})
SEVERIDADES = frozenset({"PASS", "FAIL", "WARN"})
API_EXIGIDA = ("VEREDITOS", "classificar", "ler_api")
INSTRUMENTO_AUSENTE = "INSTRUMENTO AUSENTE"
CAMPOS = ("veredito", "causa", "faltam", "severidade_local", "severidade_ci")
TAG = {"PASS": "[PASS] ", "FAIL": "[FAIL] ", "WARN": "[WARN] ", "INFO": "[INFO] "}


def carrega_instrumento():
    if not INSTRUMENTO.is_file():
        return None, f"{INSTRUMENTO_AUSENTE}: {INSTRUMENTO.name} não existe em .claude/verify/"
    try:
        spec = importlib.util.spec_from_file_location("branch_protection", INSTRUMENTO)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
    except Exception as e:
        return None, f"{INSTRUMENTO_AUSENTE}: import falhou ({type(e).__name__}: {e})"
    faltam = [n for n in API_EXIGIDA if not hasattr(mod, n)]
    if faltam:
        return None, f"INSTRUMENTO INCOMPLETO: sem {', '.join(faltam)}"
    return mod, None


def _conjunto(enum):
    return set(enum.values()) if isinstance(enum, dict) else set(enum)


def esperado_de(registro):
    return {k: registro[k] for k in ("repo", "ref", "checks_obrigatorios", "up_to_date")}


# ---------------------------------------------------------------------- sonda
def executa_caso(instr, causa_instr, caso, pasta, esperado_cfg):
    cid = caso.get("id")
    pin = {"veredito": caso.get("esperado"), "causa": caso.get("causa"),
           "faltam": sorted(caso.get("faltam") or []),
           "severidade_local": caso.get("severidade_local"), "severidade_ci": caso.get("severidade_ci")}
    r = {"id": cid, "esperado": pin, "obtido": None, "ok": False, "divergencias": []}
    try:
        with open(pasta / f"{cid}.json", encoding="utf-8") as fh:
            fx = json.load(fh)
    except FileNotFoundError:
        r["obtido"], r["divergencias"] = "FIXTURE AUSENTE", [f"fixture {cid}.json ausente"]
        return r
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        r["obtido"], r["divergencias"] = "FIXTURE ILEGÍVEL", [f"{type(e).__name__}: {e}"]
        return r
    if fx.get("id") != cid or "rules" not in fx or "branch" not in fx:
        r["obtido"] = "FIXTURE INCOERENTE"
        r["divergencias"] = [f"fixture declara id={fx.get('id')!r}; precisa de rules e branch"]
        return r
    if instr is None:
        r["obtido"], r["divergencias"] = INSTRUMENTO_AUSENTE, [causa_instr]
        return r
    try:
        local = instr.classificar(fx["rules"], fx["branch"], esperado_cfg, False)
        ci = instr.classificar(fx["rules"], fx["branch"], esperado_cfg, True)
    except Exception as e:
        r["obtido"] = f"EXCEÇÃO {type(e).__name__}: {e}"
        r["divergencias"] = [r["obtido"]]
        return r
    obtido = {"veredito": local.get("veredito"), "causa": local.get("causa"),
              "faltam": sorted(local.get("faltam") or []),
              "severidade_local": local.get("severidade"), "severidade_ci": ci.get("severidade")}
    difs = [f"{k}: esperado {pin[k]!r} · obtido {obtido[k]!r}" for k in CAMPOS if pin[k] != obtido[k]]
    # contrato de saída (não é veredito): enum fechado, T10, modo_ci só mexe na severidade
    voc = _conjunto(instr.VEREDITOS)
    if voc != VOCABULARIO:
        difs.append(f"VEREDITOS do instrumento ≠ vocabulário: {sorted(voc)}")
    if local.get("veredito") not in voc:
        difs.append(f"veredito fora de VEREDITOS: {local.get('veredito')!r}")
    if local.get("veredito") == "NÃO DETERMINÁVEL" and not (local.get("causa") or "").strip():
        difs.append("NÃO DETERMINÁVEL sem causa (T10)")
    if local.get("veredito") != "NÃO DETERMINÁVEL" and local.get("causa"):
        difs.append(f"causa {local.get('causa')!r} em veredito determinável")
    if (ci.get("veredito"), sorted(ci.get("faltam") or [])) != (local.get("veredito"), obtido["faltam"]):
        difs.append("modo_ci alterou veredito/faltam — só a severidade pode mudar (T7)")
    if local.get("severidade") not in SEVERIDADES or ci.get("severidade") not in SEVERIDADES:
        difs.append(f"severidade fora de PASS/FAIL/WARN: {local.get('severidade')!r}/{ci.get('severidade')!r}")
    r["obtido"], r["divergencias"], r["ok"] = obtido, difs, not difs
    return r


def sonda(instr, causa_instr, registro):
    cfg = registro["sonda"]
    pasta, casos, pin = Path(cfg["fixtures"]), cfg["casos"], cfg["total"]
    guarda = []
    arquivos = sorted(p.name for p in pasta.glob("*.json")) if pasta.is_dir() else []
    ids = [c.get("id") for c in casos]
    dup = sorted({i for i in ids if ids.count(i) > 1})
    if dup:
        guarda.append(f"id duplicado na sonda: {', '.join(map(str, dup))}")
    esperados = {f"{i}.json" for i in ids}
    guarda += [f"fixture sem caso no registro: {a}" for a in arquivos if a not in esperados]
    guarda += [f"caso sem fixture: {i}" for i in ids if f"{i}.json" not in arquivos]
    if not (len(arquivos) == len(casos) == pin):
        guarda.append(f"contagem: {len(arquivos)} fixture(s) · {len(casos)} caso(s) · total pinado {pin}")
    fora = sorted({str(c.get("esperado")) for c in casos} - VOCABULARIO)
    if fora:
        guarda.append(f"registro cita veredito fora do vocabulário: {fora}")
    esperado_cfg = esperado_de(registro)
    resultados = [executa_caso(instr, causa_instr, c, pasta, esperado_cfg) for c in casos]
    if len(resultados) != pin:   # sonda muda (D016-M16): o censo executado é que se compara ao pin
        guarda.append(f"executados {len(resultados)} ≠ total pinado {pin} — a sonda não rodou inteira (C7)")
    falhas = [r["id"] for r in resultados if not r["ok"]]
    return {"gate": GATE, "casos": resultados, "total": len(resultados), "total_pinado": pin,
            "falhas": len(falhas), "divergentes": falhas, "guarda": guarda,
            "ok": not falhas and not guarda and len(resultados) == pin,
            "instrumento": {"presente": instr is not None, "causa": causa_instr}}


def relata_sonda(s, out):
    p = lambda t: print(t, file=out)
    p(f"[SONDA] branch-protection: {s['total']} caso(s) · {s['falhas']} divergência(s) (total pinado: {s['total_pinado']})")
    if s["instrumento"]["causa"]:
        p(f"[FAIL]  {s['instrumento']['causa']}")
    for g in s["guarda"]:
        p(f"[FAIL]  sonda/guarda: {g}")
    for r in s["casos"]:
        if not r["ok"]:
            p(f"        ✗ {r['id']}: " + " · ".join(r["divergencias"]))


# ---------------------------------------------------------------------- vivo
def le_mundo(instr, registro, fixture):
    esperado_cfg = esperado_de(registro)
    if fixture:
        with open(fixture, encoding="utf-8") as fh:
            fx = json.load(fh)
        return {"rules": fx["rules"], "branch": fx["branch"], "token_fonte": "fixture (sem rede)",
                "repo": registro["repo"], "repo_fonte": f"fixture {fixture}"}
    return instr.ler_api(esperado_cfg)


def texto_faltam(faltam, registro):
    ctx = [f for f in faltam if f in registro["checks_obrigatorios"]]
    partes = []
    if ctx:
        partes.append(", ".join(ctx) + " (checks obrigatórios)")
    if "up-to-date" in faltam:
        partes.append("up-to-date")
    return "faltam: " + ", ".join(partes) if partes else "nada falta"


def relata_vivo(cl, lido, registro, out, fixture):
    p = lambda t: print(t, file=out)
    sev = cl.get("severidade") if cl.get("severidade") in SEVERIDADES else "FAIL"
    ref = registro["ref"]
    p(f"{TAG['INFO']} repo {lido.get('repo')} (origem: {lido.get('repo_fonte')}) · token: {lido.get('token_fonte')}"
      + (" · modo: fixture — NÃO é leitura do mundo" if fixture else ""))
    v = cl.get("veredito")
    if v == "PROTEGIDA":
        p(f"{TAG[sev]} {ref} PROTEGIDA · {cl.get('mecanismo')} · checks obrigatórios: {', '.join(cl.get('contextos') or [])}"
          f" · up-to-date: {'sim' if cl.get('strict') else ('não determinável (classic)' if cl.get('strict') is None else 'não')}")
    elif v == "DESPROTEGIDA":
        p(f"{TAG[sev]} {ref} DESPROTEGIDA · {texto_faltam(cl.get('faltam') or [], registro)} · mecanismo lido: {cl.get('mecanismo')}")
    else:
        p(f"{TAG[sev]} branch-protection: {v} ({cl.get('causa')}"
          + (f": {cl.get('causa_detalhe')}" if cl.get("causa_detalhe") else "")
          + ") — rito: gh auth login && bash .claude/verify/compliance-audit.sh --rule=branch-protection")
    if cl.get("outras_regras"):
        p("        outras regras ativas: " + " · ".join(cl["outras_regras"]))
    for a in cl.get("avisos") or []:
        p(f"        aviso: {a}")
    return sev


# ----------------------------------------------------------------------- CLI
def main(argv):
    args, fixture = [], None
    it = iter(argv[1:])
    for a in it:
        if a == "--fixture":
            fixture = next(it, None)
            if not fixture:
                print("check_branch_protection: --fixture exige um arquivo", file=sys.stderr)
                return 2
        elif a in ("--sonda", "--json"):
            args.append(a)
        else:
            print(f"check_branch_protection: argumento não aceito: {a} — uso: [--sonda] [--fixture <arquivo>] [--json]",
                  file=sys.stderr)
            return 2
    if fixture and MODO_CI:
        print("check_branch_protection: --fixture é diagnóstico local; recusado sob GITHUB_ACTIONS (spec §CLI)",
              file=sys.stderr)
        return 2
    so_sonda, em_json = "--sonda" in args, "--json" in args
    out = sys.stderr if (so_sonda or em_json) else sys.stdout

    def emite(obj):
        if so_sonda or em_json:
            print(json.dumps(obj, ensure_ascii=False, indent=2, default=str))

    print(f"{TAG['INFO']} branch-protection LÊ O MUNDO: GET /repos/{{repo}}/rules/branches/{{ref}} + "
          f"/repos/{{repo}}/branches/{{ref}} (R7 — único gate não-puro por construção) · modo: {'CI' if MODO_CI else 'local'}",
          file=out)
    try:
        with open(REGISTRO, encoding="utf-8") as fh:
            registro = json.load(fh)
    except (FileNotFoundError, json.JSONDecodeError, UnicodeDecodeError) as e:
        print(f"[FAIL]  registro {REGISTRO} ausente ou ilegível: {e}", file=out)
        emite({"gate": GATE, "le_o_mundo": True, "modo_ci": MODO_CI, "sonda": None, "vivo": None,
               "severidade": "FAIL", "exit": 1, "erro": str(e)})
        return 1

    instr, causa = carrega_instrumento()
    s = sonda(instr, causa, registro)            # 1. sonda — sempre, sem rede
    relata_sonda(s, out)
    if so_sonda:
        emite(s)
        return 0 if s["ok"] else 1
    if not s["ok"]:
        print("[FAIL]  API não consultada: o classificador reprovou na própria sonda (C7)", file=out)
        print("----", file=out)
        print(f"branch-protection: FAIL · sonda com {s['falhas']} divergência(s) e {len(s['guarda'])} falha(s) de guarda", file=out)
        emite({"gate": GATE, "le_o_mundo": True, "modo_ci": MODO_CI, "sonda": s, "vivo": None,
               "severidade": "FAIL", "exit": 1})
        return 1
    try:                                          # 2. leitura → 3. classificação → 4. relato
        lido = le_mundo(instr, registro, fixture)
        cl = instr.classificar(lido["rules"], lido["branch"], esperado_de(registro), MODO_CI)
    except Exception as e:
        print(f"[FAIL]  leitura/classificação estourou: {type(e).__name__}: {e}", file=out)
        print("----", file=out)
        print("branch-protection: FAIL · exceção", file=out)
        emite({"gate": GATE, "le_o_mundo": True, "modo_ci": MODO_CI, "sonda": s, "vivo": None,
               "severidade": "FAIL", "exit": 1, "erro": f"{type(e).__name__}: {e}"})
        return 1
    sev = relata_vivo(cl, lido, registro, out, fixture)
    rc = 1 if sev == "FAIL" else 0
    print("----", file=out)
    print(f"branch-protection: {sev} · {cl.get('veredito')}", file=out)
    vivo = dict(cl)
    vivo.update({"token_fonte": lido.get("token_fonte"), "repo": lido.get("repo"),
                 "repo_fonte": lido.get("repo_fonte"), "fixture": fixture})
    emite({"gate": GATE, "le_o_mundo": True, "modo_ci": MODO_CI, "sonda": s, "vivo": vivo,
           "severidade": sev, "exit": rc})
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv))
