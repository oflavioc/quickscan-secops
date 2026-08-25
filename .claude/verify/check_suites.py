#!/usr/bin/env python3
"""Stage suites — contagens reais × registro canônico (Onda 1, revogação 2).

'Qualquer desvio = parar e reportar' deixa de ser prosa: cada suíte roda e a
contagem final é comparada com expected_suites.json. FAIL != 0, PASS fora do
esperado, ou suíte que não emite contagem = FAIL do stage (mata o padrão
'exit 0 sem executar nada' — E6).

Uso:  check_suites.py            # bloco "suites"
      check_suites.py --heavy    # bloco "heavy" (session)
Também FALHA se existir tests_*.js fora do registro e das exceções nominais
(known_issues) — suíte nova entra no registro no mesmo PR.
"""
import json, re, subprocess, sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

reg = json.load(open(".claude/verify/expected_suites.json", encoding="utf-8"))
block = "heavy" if "--heavy" in sys.argv else "suites"
LINE = re.compile(r"(\d+)\s+PASS\s*·\s*(\d+)\s+FAIL")

fails = 0
for name, spec in reg[block].items():
    r = subprocess.run(spec["cmd"], shell=True, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    tail = [l for l in (r.stdout or "").splitlines() if l.strip()][-1:] or ["(sem saída)"]
    m = LINE.search(tail[0])
    if not m:
        print(f"[FAIL] {name}: sem contagem na última linha: {tail[0][:100]}")
        fails += 1
        continue
    got_pass, got_fail = int(m.group(1)), int(m.group(2))
    want = spec["pass"]
    ok_pass = (want[0] <= got_pass <= want[1]) if isinstance(want, list) else got_pass == want
    if got_fail != spec["fail"] or not ok_pass:
        print(f"[FAIL] {name}: {got_pass} PASS · {got_fail} FAIL (esperado {want} PASS · {spec['fail']} FAIL)")
        fails += 1
    else:
        print(f"[OK]   {name}: {got_pass} PASS · {got_fail} FAIL")

# cobertura: toda suíte do repo está no registro ou nas exceções nominais
if block == "suites":
    known = set()
    for issue in json.load(open(".claude/verify/known_issues.json", encoding="utf-8"))["issues"]:
        if issue.get("lint") == "suites-no-agregado":
            known |= set(issue["excecao"]["arquivos"])
    registered = {s["cmd"].split()[-1] for b in ("suites", "heavy") for s in reg[b].values()}
    for f in sorted(str(p) for p in Path(".").glob("tests_*.js")):
        if f not in registered and f not in known and not any(f.startswith(k) for k in known):
            print(f"[FAIL] suíte fora do registro e das exceções nominais: {f}")
            fails += 1

print("----")
print(f"suites[{block}]: {fails} problema(s)")
sys.exit(1 if fails else 0)
