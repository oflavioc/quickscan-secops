#!/usr/bin/env python3
"""Stage m41 — payload funcional canônico contra o pin declarado (Onda 1).

Roda o harness congelado (oracle independente da implementação) e exige:
  1. COMPARAÇÃO PASS contra o snapshot funcional da V3.1.3;
  2. SHA-256 do payload canonicalizado == pin declarado no registry
     (a régua da decisão D2: este hash é o que separa Porta A de Porta B).

Usa arquivo temporário real (no Windows, `--out /dev/null` cria um arquivo
chamado `nul` na árvore — bug de ambiente já observado).
"""
import json, os, re, subprocess, sys, tempfile

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

declared = json.load(open(".claude/verify/pins.json", encoding="utf-8"))["declared"]["m41_payload_sha256"]

with tempfile.TemporaryDirectory() as tmp:
    out = os.path.join(tmp, "m41_payload.json")
    r = subprocess.run(["node", "harness_m41_v313.js", "quickscan_secops_soccmm_v3_2_dev.html",
                        "--compare", "v3_1_3_functional_snapshot.json", "--out", out],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")

txt = (r.stdout or "") + (r.stderr or "")
fails = 0
if "COMPARAÇÃO: PASS" in txt:
    print("[OK]   comparação com o snapshot funcional: PASS")
else:
    print("[FAIL] harness não reportou COMPARAÇÃO: PASS")
    print("\n".join(txt.splitlines()[-6:]))
    fails += 1

m = re.search(r"SHA-256 \(payload funcional canonicalizado\): ([0-9a-f]{64})", txt)
if m and m.group(1) == declared:
    print(f"[OK]   payload {m.group(1)[:16]}… == pin declarado (régua D2)")
elif m:
    print(f"[FAIL] payload {m.group(1)[:16]}… ≠ pin declarado {declared[:16]}… — "
          "mudança de COMPORTAMENTO do engine: rito da Porta B (spec + auditoria)")
    fails += 1
else:
    print("[FAIL] harness não emitiu o SHA-256 do payload")
    fails += 1

sys.exit(1 if fails or r.returncode != 0 else 0)
