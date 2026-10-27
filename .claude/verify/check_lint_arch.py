#!/usr/bin/env python3
"""Stage lint-arch — regras de arquitetura como lint executável (Onda 1, R9).

  1. Pureza do engine: zero document./window./innerHTML em engine_v32.js —
     protege a INV-1 contra o vetor mais provável de contaminação;
  2. innerHTML proibido (atribuição) nos módulos novos — todo ui_*_v32.js
     que não seja legado 4.x nominal (LEGADOS_4X, abaixo);
  3. Módulos novos são IIFE (escopo próprio — E12: 115 declarações top-level
     nos módulos 4.x é o estado herdado, não o padrão). O conjunto varrido é
     ui_*_v32.js MENOS a allowlist nominal dos legados 4.x (ui_ux, ui_target,
     ui_session, ui_refinement, ui_journey, ui_icons — não são IIFE e usam
     innerHTML; varrê-los tornaria o stage FAIL permanente sobre arquivos
     protegidos, e não é isto que a regra pede). A exclusão é nominal e
     fechada; a inclusão é o resto — módulo novo entra por construção,
     qualquer que seja o prefixo do nome (EA-101);
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

# 2 e 3 · módulos novos: todo ui_*_v32.js MENOS os legados 4.x (allowlist nominal)
#
# EA-101 (2026-10-25): o conjunto era por PREFIXO (ui_p5*, ui_d0*), e os módulos de
# demanda que nasceram fora dessa convenção (ui_curation, ui_curation_edit,
# ui_ondas — demandas 019/022) ficavam sem IIFE/innerHTML= conferidos: lacuna de
# sensor, zero violação à época (R9, cabeçalho: bloqueante para módulo NOVO). O
# sentido da lista foi invertido: o EXCLUÍDO é nominal e fechado (legado); o
# incluído é o resto. A 011 (84c92a1) recusou o glob largo sem allowlist por 11
# FAILs em 6 módulos 4.x — a lista abaixo é exatamente esses 6.
#
# LEGADOS_4X: legado 4.x documentado, não licença (R9 cabeçalho). Entrada nova é
# ato de governança, nunca conveniência — módulo novo cumpre a R9, e a regra
# nunca se afrouxa para passar (R10 §1). Todos: sem IIFE e/ou com innerHTML=.
#   ui_ux_v32.js, ui_target_v32.js, ui_session_v32.js, ui_refinement_v32.js,
#   ui_journey_v32.js — módulos 4.x herdados (E12: estado herdado, não padrão);
#   ui_icons_v32.js — gerado por generate_icons_v32.py (classe generated).
# ui_v32.js (o monólito 4.x) não casa o glob ui_*_v32.js (falta o "_" antes de
# "v32"): já está fora da varredura e não precisa de entrada.
LEGADOS_4X = frozenset({
    "ui_ux_v32.js",
    "ui_target_v32.js",
    "ui_session_v32.js",
    "ui_refinement_v32.js",
    "ui_journey_v32.js",
    "ui_icons_v32.js",
})
novos = sorted(str(p) for p in Path(".").glob("ui_*_v32.js") if p.name not in LEGADOS_4X)
for m in novos:
    src = open(m, encoding="utf-8").read()
    if re.search(r"\.innerHTML\s*=", src):
        fail(f"{m}: atribuição .innerHTML= (proibido em módulo novo)")
    if "(function" not in src:
        fail(f"{m}: sem IIFE — escopo compartilhado é proibido em módulo novo")
print(f"[OK]   {len(novos)} módulos novos (ui_*_v32.js menos {len(LEGADOS_4X)} legados 4.x): zero innerHTML= e IIFE presente" if fails == 0 else "")

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
