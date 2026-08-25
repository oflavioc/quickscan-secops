#!/usr/bin/env python3
"""Stage marker-lint — cada marcador V32_* aparece exatamente 1× no HTML (Onda 1).

A ordem de injeção do builder é o grafo de dependências implícito dos módulos;
marcador duplicado ou ímpar quebra a extração de blocos usada pelos gates de
sync. Exceções nominais vivem em known_issues.json, cada uma com remoção
prevista. [Onda-3 · fix A3] A exceção histórica KI-1 (V32_UI_END 2×) foi
CUMPRIDA e removida pela demanda 003 — o lint hoje roda sem exceção alguma.
"""
import json, re, sys
from collections import Counter

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HTML = "quickscan_secops_soccmm_v3_2_dev.html"
html = open(HTML, encoding="utf-8").read()

allowed = {}
try:
    for issue in json.load(open(".claude/verify/known_issues.json", encoding="utf-8"))["issues"]:
        if issue.get("lint") == "marker-lint":
            exc = issue["excecao"]
            allowed[exc["marcador"]] = (exc["ocorrencias_permitidas"], issue["id"])
except FileNotFoundError:
    pass

marks = Counter(re.findall(r"/\* (V32_[A-Z0-9_]+_(?:BEGIN|END)) \*/", html))
fails = 0
for name, n in sorted(marks.items()):
    want, ki = allowed.get(name, (1, None))
    if n != want:
        print(f"[FAIL] marcador {name}: {n} ocorrência(s), esperado {want}")
        fails += 1
    elif ki:
        print(f"[OK]   {name}: {n}x — exceção nominal {ki} (remoção prevista registrada)")

# pares BEGIN/END coerentes
begins = {m[:-6] for m in marks if m.endswith("_BEGIN")}
ends = {m[:-4] for m in marks if m.endswith("_END")}
for orphan in sorted(begins ^ ends):
    print(f"[FAIL] marcador sem par: {orphan}")
    fails += 1

print("----")
print(f"marker-lint: {len(marks)} marcadores distintos · {fails} problema(s)")
sys.exit(1 if fails else 0)
