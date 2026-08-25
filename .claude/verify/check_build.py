#!/usr/bin/env python3
"""Stage build — o builder reproduz o HTML publicado byte a byte (Onda 0).

Constrói em diretório EFÊMERO e compara com o blob de HEAD do artefato
publicado. É a invariante "derivado = função(fonte)" como gate mecânico:
pega tanto edição manual do HTML commitado quanto builder dessincronizado.

Também prova que a execução não sujou a árvore (git status antes × depois):
o gerador de ícones regrava ui_icons_v32.js com bytes idênticos por
construção — qualquer diferença de conteúdo aqui é FAIL.
"""
import hashlib, subprocess, sys, tempfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PUBLISHED = "quickscan_secops_soccmm_v3_2_dev.html"

def porcelain():
    return subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True).stdout

before = porcelain()

with tempfile.TemporaryDirectory() as tmp:
    out = Path(tmp) / "rebuild.html"
    r = subprocess.run([sys.executable, "build_v32_html.py", str(out)], capture_output=True, text=True)
    if r.returncode != 0:
        print("[FAIL] builder retornou erro:")
        print((r.stderr or r.stdout).strip()[-2000:])
        sys.exit(1)
    got = hashlib.sha256(out.read_bytes()).hexdigest()

blob = subprocess.run(["git", "show", f"HEAD:{PUBLISHED}"], capture_output=True).stdout
want = hashlib.sha256(blob).hexdigest()

fails = 0
if got == want:
    print(f"[OK]   rebuild byte-idêntico ao publicado ({got[:16]}…)")
else:
    print(f"[FAIL] rebuild {got[:16]}… ≠ publicado em HEAD {want[:16]}…")
    fails += 1

after = porcelain()
if before == after:
    print("[OK]   árvore de trabalho inalterada pela execução")
else:
    print("[FAIL] a execução sujou a árvore de trabalho:")
    for line in sorted(set(after.splitlines()) - set(before.splitlines())):
        print("       ", line)
    fails += 1

sys.exit(fails)
