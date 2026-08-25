#!/usr/bin/env python3
"""Stage 0 do pipeline — env-doctor (Onda 0 da Estrutura Agêntica).

Valida a toolchain ANTES de qualquer suíte, com relatório explícito.
Mata a classe de falha "SKIP silencioso por ambiente ausente" (achado E6):
ambiente incompleto é reportado aqui, com nome, nunca descoberto no meio
de uma suíte — e nunca mascarado por um exit 0.

FAIL (exit != 0): python < 3.10 · git ausente · node ausente.
WARN (exit 0)   : node fora do range de package.json · Chromium ausente
                  (suítes visuais declararão NÃO EXECUTADO) · autocrlf=true
                  (inócuo com .gitattributes, mas informado).
"""
import json, os, re, shutil, subprocess, sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

FAILS, WARNS = [], []
def ok(msg):   print("[OK]  ", msg)
def warn(msg): WARNS.append(msg); print("[WARN]", msg)
def fail(msg): FAILS.append(msg); print("[FAIL]", msg)

# python
if sys.version_info >= (3, 10):
    ok(f"python {sys.version.split()[0]}")
else:
    fail(f"python {sys.version.split()[0]} < 3.10")

# git
if shutil.which("git"):
    autocrlf = subprocess.run(["git", "config", "--get", "core.autocrlf"],
                              capture_output=True, text=True).stdout.strip()
    ok("git presente")
    if autocrlf == "true":
        warn("core.autocrlf=true — inócuo com o .gitattributes (eol=lf), mas registrado")
else:
    fail("git ausente do PATH")

# node vs engines do package.json
node = shutil.which("node")
if not node:
    fail("node ausente do PATH")
else:
    v = subprocess.run([node, "--version"], capture_output=True, text=True).stdout.strip()
    try:
        engines = json.load(open("package.json", encoding="utf-8")).get("engines", {}).get("node", "")
    except Exception:
        engines = ""
    ok(f"node {v}")
    def _tuple(s):
        m = re.match(r"v?(\d+)\.(\d+)\.(\d+)", s)
        return tuple(int(x) for x in m.groups()) if m else None
    cur = _tuple(v)
    satisfied = False
    for clause in [c.strip() for c in engines.split("||") if c.strip()]:
        base = _tuple(clause.lstrip("^>=~"))
        if not (cur and base):
            continue
        if clause.startswith("^") and cur[0] == base[0] and cur >= base:
            satisfied = True
        elif clause.startswith(">=") and cur >= base:
            satisfied = True
        elif clause[0].isdigit() and cur == base:
            satisfied = True
    if engines and not satisfied:
        warn(f"node {v} fora do range de package.json ({engines}) — npm ci --engine-strict falhará")

# chromium (suítes visuais)
chrome = os.environ.get("CHROME_PATH")
if chrome and os.path.exists(chrome):
    ok(f"CHROME_PATH: {chrome}")
else:
    cache = os.path.join(os.environ.get("LOCALAPPDATA", os.path.expanduser("~/.cache")), "ms-playwright")
    if os.path.isdir(cache) and any("chromium" in d for d in os.listdir(cache)):
        ok("Chromium do Playwright presente no cache")
    else:
        warn("Chromium indisponível (sem CHROME_PATH e sem cache ms-playwright) — "
             "suítes visuais devem declarar NÃO EXECUTADO, nunca passar em silêncio")

# stdout
enc = getattr(sys.stdout, "encoding", "") or ""
if "utf" in enc.lower():
    ok(f"stdout {enc}")
else:
    warn(f"stdout {enc or 'desconhecido'} — scripts do projeto reconfiguram para UTF-8")

print("----")
print(f"env-doctor: {len(FAILS)} FAIL · {len(WARNS)} WARN")
sys.exit(1 if FAILS else 0)
