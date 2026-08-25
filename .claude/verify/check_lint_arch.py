#!/usr/bin/env python3
"""Stage lint-arch — regras de arquitetura como lint executável (Onda 1, R9).

  1. Pureza do engine: zero document./window./innerHTML em engine_v32.js —
     protege a INV-1 contra o vetor mais provável de contaminação;
  2. innerHTML proibido (atribuição) nos módulos das fases 5.x (ui_p5*);
  3. Módulos 5.x são IIFE (escopo próprio — E12: 115 declarações top-level
     nos módulos 4.x é o estado herdado, não o padrão);
  4. Bridge global window.__* só com entrada no registro bridges.json.
"""
import json, re, sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

fails = 0
def fail(msg):
    global fails
    fails += 1
    print("[FAIL]", msg)

# 1 · pureza do engine
eng = open("engine_v32.js", encoding="utf-8").read()
dom = re.findall(r"\b(?:document|window)\s*\.|\binnerHTML\b", eng)
if dom:
    fail(f"engine_v32.js contém {len(dom)} token(s) de DOM — INV-1 em risco")
else:
    print("[OK]   engine puro: zero tokens de DOM")

# 2 e 3 · módulos das fases 5.x
novos = sorted(str(p) for p in Path(".").glob("ui_p5*_v32.js"))
for m in novos:
    src = open(m, encoding="utf-8").read()
    if re.search(r"\.innerHTML\s*=", src):
        fail(f"{m}: atribuição .innerHTML= (proibido em módulo 5.x)")
    if "(function" not in src:
        fail(f"{m}: sem IIFE — escopo compartilhado é proibido em módulo novo")
print(f"[OK]   {len(novos)} módulos 5.x: zero innerHTML= e IIFE presente" if fails == 0 else "")

# 4 · bridges registrados
reg = set(json.load(open(".claude/verify/bridges.json", encoding="utf-8"))["bridges"].keys())
found = set()
for m in Path(".").glob("ui_*.js"):
    found |= set(re.findall(r"window\.(__[A-Za-z0-9_]+)", open(m, encoding="utf-8").read()))
extra = found - reg
for b in sorted(extra):
    fail(f"bridge fora do registro: window.{b} — registre em bridges.json com owner e shape")
if not extra:
    print(f"[OK]   {len(found)} bridges em uso, todos registrados")

print("----")
print(f"lint-arch: {fails} problema(s)")
sys.exit(1 if fails else 0)
