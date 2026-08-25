#!/usr/bin/env python3
"""Stage evidence-bridge — oráculos EB-1…EB-6 da demanda 007 (migração de evidência).

Leitor INDEPENDENTE do manifesto-ponte (`evidence_bridge.json`): nunca re-executa
a geração (Observação 1 do parecer do PO). Padrão de relatório: `env_doctor.py`
(listas FAILS/WARNS, [FAIL]/[WARN]/[OK] por item, linha final
`evidence-bridge: N FAIL · N WARN`, exit 1 se FAILS não-vazio). SKIP silencioso
é FAIL (R10 §2, E6): todo não-verificado aparece NOMEADO no relatório.

Parte offline (roda sempre; só stdlib + git de leitura — R2 §2):
  - shape do manifesto (4 acervos; `commit_ancora` = 40 hex, SHA-1 de commit git);
  - EB-1: lista autoritativa por `git ls-tree -r <ancora>` dos 4 acervos e hash
    SHA-256 dos blobs (`git cat-file --batch`, em streaming) — oráculo
    independente do manifesto; a mais/a menos/divergente = FAIL nomeando o path;
  - EB-6: `git ls-files` vazio nos 4 diretórios; as 4 entradas no `.gitignore` +
    `git check-ignore` confirmando; contraprova `evidence_v322` rastreado.
  FAIL offline é FAIL em qualquer ambiente.

Parte online (EB-2/3/4 — existência e integridade dos assets dos releases):
  - download via urllib (stdlib; timeout; `GITHUB_TOKEN` opcional vira header —
    robustez, nunca requisito: repo público) com hash SHA-256 EM STREAMING, sem
    escrita em disco (R7 §3, R10 §8);
  - classificação (política EB-5): rede inalcançável (timeout/DNS/URLError) →
    local: WARN nomeado por pacote não verificado, exit 0; CI: FAIL.
    HTTP 404/release ausente → FAIL em qualquer ambiente ("pacote AUSENTE").
    Hash divergente → FAIL em qualquer ambiente ("pacote ADULTERADO").
  - modo CI quando `GITHUB_ACTIONS` está no ambiente; nenhuma outra heurística.

O gate não escreve nada — nem na árvore, nem fora dela.
"""
import hashlib
import json
import os
import re
import socket
import subprocess
import sys
import threading
import urllib.error
import urllib.parse
import urllib.request

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

MANIFESTO = ".claude/verify/evidence_bridge.json"
CONTRAPROVA = "docs_phase5/evidence_v322"
TIMEOUT_S = 60
CHUNK = 1024 * 1024
SHA40 = re.compile(r"^[0-9a-f]{40}$")
SHA64 = re.compile(r"^[0-9a-f]{64}$")

# Inventário congelado pela spec 007 (§Inventário): tag do release → diretório
# rastreado no commit-âncora. NÃO é contagem (R10 §3) — contagens derivam do
# manifesto (len(arquivos) por acervo) e do oráculo git; isto é o domínio fixo.
ACERVOS = (
    ("evidence-p50", "docs_phase5/evidence_p50"),
    ("evidence-p51", "docs_phase5/evidence_p51"),
    ("evidence-p52", "docs_phase5/evidence_p52"),
    ("evidence-unset", "docs_phase5/evidence_unset"),
)

MODO_CI = "GITHUB_ACTIONS" in os.environ

FAILS, WARNS = [], []


def ok(msg):
    print("[OK]  ", msg)


def warn(msg):
    WARNS.append(msg)
    print("[WARN]", msg)


def fail(msg):
    FAILS.append(msg)
    print("[FAIL]", msg)


def encerra():
    print("----")
    print(f"evidence-bridge: {len(FAILS)} FAIL · {len(WARNS)} WARN")
    sys.exit(1 if FAILS else 0)


def git(*args):
    """git de leitura; devolve (rc, stdout bytes)."""
    r = subprocess.run(["git", *args], capture_output=True)
    return r.returncode, r.stdout


# ---------------------------------------------------------------- shape
def carrega_manifesto():
    try:
        with open(MANIFESTO, encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        fail(f"manifesto-ponte ausente: {MANIFESTO}")
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        fail(f"manifesto-ponte ilegível ({MANIFESTO}): {e}")
    return None


def valida_shape(man):
    """Shape da spec §Contratos (emenda A2). Devolve (ancora, acervos_ok)."""
    meta = man.get("_meta") or {}
    ancora = meta.get("commit_ancora") or ""
    if not SHA40.match(ancora):
        fail(f"shape: _meta.commit_ancora não é SHA-1 de 40 hex: {ancora!r}")
        ancora = None
    if not meta.get("repo"):
        fail("shape: _meta.repo ausente")
    acervos = man.get("acervos")
    if not isinstance(acervos, dict):
        fail("shape: bloco `acervos` ausente ou inválido")
        return ancora, {}
    esperadas = [tag for tag, _ in ACERVOS]
    if sorted(acervos.keys()) != sorted(esperadas):
        fail(f"shape: acervos esperados {esperadas}, encontrados {sorted(acervos.keys())}")
    validos = {}
    dirs = dict(ACERVOS)
    for tag, dir_ in ACERVOS:
        a = acervos.get(tag)
        if not isinstance(a, dict):
            continue
        completo = True
        if a.get("release_tag") != tag:
            fail(f"shape: {tag}: release_tag {a.get('release_tag')!r} ≠ chave do acervo")
            completo = False
        if not a.get("pacote"):
            fail(f"shape: {tag}: campo `pacote` ausente")
            completo = False
        if not SHA64.match(a.get("sha256_pacote") or ""):
            fail(f"shape: {tag}: `sha256_pacote` não é SHA-256 de 64 hex")
            completo = False
        arquivos = a.get("arquivos")
        if not isinstance(arquivos, dict) or not arquivos:
            fail(f"shape: {tag}: bloco `arquivos` ausente ou vazio")
            completo = False
        else:
            for path in arquivos:
                if not path.startswith(dirs[tag] + "/"):
                    fail(f"shape: {tag}: arquivo fora do acervo: {path}")
        if completo:
            validos[tag] = a
    if len(validos) == len(ACERVOS) and not any(m.startswith("shape:") for m in FAILS):
        ok(f"shape: 4 acervos · commit_ancora {ancora} · repo {meta.get('repo')}")
    return ancora, validos


# ---------------------------------------------------------------- EB-1
def hashes_dos_blobs(ancora, paths):
    """SHA-256 de cada blob `<ancora>:<path>` via `git cat-file --batch` (streaming)."""
    pedido = "".join(f"{ancora}:{p}\n" for p in paths).encode("utf-8")
    proc = subprocess.Popen(["git", "cat-file", "--batch"],
                            stdin=subprocess.PIPE, stdout=subprocess.PIPE)

    def _alimenta():  # em thread: evita deadlock de pipe (git bloqueado no stdout)
        try:
            proc.stdin.write(pedido)
            proc.stdin.close()
        except OSError:
            pass

    escritor = threading.Thread(target=_alimenta, daemon=True)
    escritor.start()
    resultado = {}
    for path in paths:
        cab = b""
        while not cab.endswith(b"\n"):
            c = proc.stdout.read(1)
            if not c:
                raise RuntimeError(f"cat-file --batch truncado em {path}")
            cab += c
        partes = cab.decode("utf-8", "replace").split()
        if partes[-1] == "missing":
            resultado[path] = None
            continue
        restante = int(partes[2])
        h = hashlib.sha256()
        while restante:
            bloco = proc.stdout.read(min(CHUNK, restante))
            if not bloco:
                raise RuntimeError(f"cat-file --batch truncado em {path}")
            h.update(bloco)
            restante -= len(bloco)
        proc.stdout.read(1)  # \n final do registro
        resultado[path] = h.hexdigest()
    proc.stdout.close()
    proc.wait()
    return resultado


def eb1(ancora, acervos_validos):
    if not ancora:
        fail("EB-1: sem commit-âncora válido no manifesto — oráculo impossível")
        return
    rc, saida = git("cat-file", "-t", ancora)
    if rc != 0 or saida.decode("utf-8", "replace").strip() != "commit":
        fail(f"EB-1: commit-âncora {ancora} inalcançável no repositório "
             "(clone raso? exigido fetch-depth completo)")
        return
    # lista autoritativa: git ls-tree do commit-âncora — independente do manifesto
    oraculo_paths = []
    for _, dir_ in ACERVOS:
        rc, saida = git("ls-tree", "-r", "--name-only", "-z", ancora, "--", dir_)
        if rc != 0:
            fail(f"EB-1: git ls-tree falhou para {dir_} @ {ancora}")
            return
        oraculo_paths += [p for p in saida.decode("utf-8").split("\0") if p]
    oraculo = hashes_dos_blobs(ancora, sorted(oraculo_paths))

    manifesto_map = {}
    for tag, a in acervos_validos.items():
        for path, h in a["arquivos"].items():
            if path in manifesto_map:
                fail(f"EB-1: path duplicado no manifesto: {path}")
            manifesto_map[path] = h

    divergencias = 0
    for path in sorted(set(oraculo) - set(manifesto_map)):
        fail(f"EB-1: arquivo a menos no manifesto: {path}")
        divergencias += 1
    for path in sorted(set(manifesto_map) - set(oraculo)):
        fail(f"EB-1: arquivo a mais no manifesto (não rastreado no commit-âncora): {path}")
        divergencias += 1
    conferidos = 0
    for path in sorted(set(oraculo) & set(manifesto_map)):
        blob = oraculo[path]
        if blob is None:
            fail(f"EB-1: blob inacessível no commit-âncora: {path}")
            divergencias += 1
        elif blob != manifesto_map[path]:
            fail(f"EB-1: hash divergente: {path} (manifesto {manifesto_map[path]} "
                 f"≠ blob {blob})")
            divergencias += 1
        else:
            conferidos += 1
    if divergencias == 0 and len(manifesto_map) == len(oraculo):
        ok(f"manifesto-ponte: {conferidos}/{len(oraculo)} arquivos conferidos contra "
           f"o commit-âncora {ancora} · 0 divergência(s)")


# ---------------------------------------------------------------- EB-6
def eb6():
    rastreados_total = 0
    ignoradas = 0
    try:
        with open(".gitignore", encoding="utf-8") as fh:
            linhas = {l.strip() for l in fh}
    except OSError as e:
        linhas = set()
        fail(f"EB-6: .gitignore ilegível: {e}")
    for _, dir_ in ACERVOS:
        rc, saida = git("ls-files", "-z", "--", dir_)
        n = len([p for p in saida.decode("utf-8").split("\0") if p]) if rc == 0 else -1
        if n != 0:
            fail(f"EB-6: índice: {n} arquivo(s) ainda rastreado(s) em {dir_}")
            rastreados_total += max(n, 0)
        if not ({dir_, dir_ + "/"} & linhas):
            fail(f"EB-6: .gitignore sem entrada para {dir_}/")
        rc, _ = git("check-ignore", "-q", f"{dir_}/__sonda__")
        if rc == 0:
            ignoradas += 1
        else:
            fail(f"EB-6: git check-ignore não confirma {dir_}/ como ignorado")
    rc, saida = git("ls-files", "-z", "--", CONTRAPROVA)
    v322 = len([p for p in saida.decode("utf-8").split("\0") if p]) if rc == 0 else 0
    if v322 == 0:
        fail(f"EB-6: contraprova violada: {CONTRAPROVA} não está mais rastreado")
    if rastreados_total == 0 and ignoradas == 4 and v322 > 0:
        ok("índice: 0 arquivo(s) rastreado(s) nos acervos migrados · "
           "ignore ativo 4/4 · evidence_v322 rastreado")


# ---------------------------------------------------------------- EB-2/3/4 (online)
class _RedirectSemToken(urllib.request.HTTPRedirectHandler):
    """Não vaza o Authorization para host de redirect (assets saem do CDN)."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        novo = super().redirect_request(req, fp, code, msg, headers, newurl)
        if novo is not None:
            de = urllib.parse.urlsplit(req.full_url).netloc
            para = urllib.parse.urlsplit(newurl).netloc
            if de != para:
                novo.headers.pop("Authorization", None)
        return novo


def baixa_e_hasheia(url, token):
    """SHA-256 dos bytes recebidos, em streaming — nada é escrito em disco."""
    cab = {"User-Agent": "quickscan-evidence-bridge"}
    if token:
        cab["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=cab)
    abridor = urllib.request.build_opener(_RedirectSemToken())
    h = hashlib.sha256()
    with abridor.open(req, timeout=TIMEOUT_S) as resp:
        for bloco in iter(lambda: resp.read(CHUNK), b""):
            h.update(bloco)
    return h.hexdigest()


def parte_online(man, acervos_validos):
    repo = (man.get("_meta") or {}).get("repo") or ""
    token = os.environ.get("GITHUB_TOKEN", "")
    nao_verificados = []  # (tag, motivo) — rede inalcançável, nunca 404/hash
    for tag, _ in ACERVOS:
        a = acervos_validos.get(tag)
        if not a:
            fail(f"pacote NÃO VERIFICÁVEL: acervo `{tag}` sem entrada válida no manifesto")
            continue
        pacote, release = a["pacote"], a["release_tag"]
        url = (f"https://github.com/{repo}/releases/download/"
               f"{urllib.parse.quote(release)}/{urllib.parse.quote(pacote)}")
        try:
            obtido = baixa_e_hasheia(url, token)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                fail(f"pacote AUSENTE: `{pacote}` @ `{release}` (HTTP 404)")
            else:
                nao_verificados.append((tag, f"HTTP {e.code}"))
            continue
        except (urllib.error.URLError, socket.timeout, TimeoutError, OSError) as e:
            motivo = getattr(e, "reason", e)
            nao_verificados.append((tag, str(motivo)))
            continue
        if obtido != a["sha256_pacote"]:
            fail(f"pacote ADULTERADO: `{pacote}` esperado `{a['sha256_pacote']}` "
                 f"obtido `{obtido}`")
        else:
            ok(f"pacote `{pacote}` @ release `{release}`: sha256 confere")
    if nao_verificados:
        nomes = ", ".join(tag for tag, _ in nao_verificados)
        detalhe = "; ".join(f"{tag}: {mot}" for tag, mot in nao_verificados)
        texto = f"NÃO EXECUTADO — sem rede: {nomes} ({detalhe})"
        if MODO_CI:
            fail(texto + " — CI exige a parte online (política EB-5)")
        else:
            warn(texto)


if __name__ == "__main__":
    print(f"modo: {'CI (GITHUB_ACTIONS presente)' if MODO_CI else 'local'}")
    man = carrega_manifesto()
    if man is None:
        encerra()
    ancora, acervos_validos = valida_shape(man)
    eb1(ancora, acervos_validos)
    eb6()
    parte_online(man, acervos_validos)
    encerra()
