#!/usr/bin/env python3
"""Stage mutation — campanhas re-executadas por trigger de path (Onda 3, E7).

A prova de mutação deixa de ser one-shot: sempre que um módulo-alvo (ou o
próprio harness) muda em relação à base, a campanha correspondente re-executa.
Base do diff: origin/develop (merge-base) quando existe; senão, o pin do
último verde (.last_green); senão, executa tudo.

Harness cujo `requires` não está disponível no ambiente é reportado POR NOME
como NÃO EXECUTADO e conta como FAIL do stage apenas se seus alvos mudaram —
nunca silêncio (R10 §2). Pré-condição: árvore limpa (os harnesses da casa
mutam in-place com restauração provada; crash no meio deixa rastro no
porcelain e o stage seguinte acusa).

Uso: check_mutation.py [--all]  (--all ignora o trigger e roda tudo que der)
"""
import json, os, shutil, subprocess, sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

MAP = json.load(open(".claude/verify/mutation_map.json", encoding="utf-8"))["harnesses"]

def sh(args):
    return subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")

def have(req):
    if req == "node":
        return shutil.which("node") is not None
    if req == "python":
        return True
    if req == "chromium":
        if os.environ.get("CHROME_PATH") and os.path.exists(os.environ["CHROME_PATH"]):
            return True
        cache = os.path.join(os.environ.get("LOCALAPPDATA", os.path.expanduser("~/.cache")), "ms-playwright")
        return os.path.isdir(cache) and any("chromium" in d for d in os.listdir(cache))
    return False

# árvore limpa é pré-condição (harnesses mutam in-place com restauração)
dirty = sh(["git", "status", "--porcelain"]).stdout.strip()
if dirty:
    print("[FAIL] árvore suja — campanhas de mutação exigem working tree limpo:")
    print("       " + dirty.splitlines()[0] + (" …" if len(dirty.splitlines()) > 1 else ""))
    sys.exit(1)

# arquivos mudados em relação à base
changed = None
if "--all" not in sys.argv:
    mb = sh(["git", "merge-base", "HEAD", "origin/develop"])
    base = mb.stdout.strip() if mb.returncode == 0 else None
    if base:
        changed = set(sh(["git", "diff", "--name-only", base, "HEAD"]).stdout.split())
    else:
        print("[WARN] sem origin/develop para diff — executando todas as campanhas disponíveis")

fails = 0
ran = 0
for name, h in MAP.items():
    due = changed is None or any(t in changed for t in h["targets"])
    if not due:
        print(f"[OK]   {name}: nenhum alvo mudou desde a base — campanha não exigida")
        continue
    missing = [r for r in h["requires"] if not have(r)]
    if missing:
        # [Onda-4] MUTATION_DEFER_MISSING=1 (job verify do CI): a campanha exigida
        # sem ambiente é DELEGADA por nome ao job visual, que roda check_mutation
        # com Chromium presente. Sem a env (execução local): FAIL nomeado — o
        # operador decide conscientemente onde rodar. Nunca silêncio (R10 §2).
        if os.environ.get("MUTATION_DEFER_MISSING") == "1":
            print(f"[DEFER] {name}: exigida (alvo mudou) — delegada ao job com {'/'.join(missing)} (job visual)")
            continue
        print(f"[FAIL] {name}: campanha EXIGIDA (alvo mudou) mas ambiente sem {'/'.join(missing)} — "
              "execute onde o requisito exista (job visual do CI / rito do proprietário) e registre")
        fails += 1
        continue
    print(f"[RUN]  {name}: {h['cmd']}")
    r = subprocess.run(h["cmd"], shell=True, capture_output=True, text=True, encoding="utf-8", errors="replace")
    tail = [l for l in (r.stdout or "").splitlines() if l.strip()][-2:]
    for l in tail:
        print("       " + l)
    ran += 1
    if r.returncode != 0:
        fails += 1
    # recibos declarados: o harness legado grava seu registro em arquivo rastreado
    # por design — restauramos após capturar (o registro vivo é a matriz)
    for rec in h.get("receipts", []):
        st = sh(["git", "status", "--porcelain", "--", rec]).stdout.strip()
        if st:
            sh(["git", "checkout", "--", rec])
            print(f"       recibo restaurado (declarado em mutation_map): {rec}")

after = sh(["git", "status", "--porcelain"]).stdout.strip()
if after:
    print("[FAIL] campanha sujou a árvore (restauração incompleta):")
    print("       " + after.splitlines()[0])
    fails += 1

print("----")
print(f"mutation: {ran} campanha(s) executada(s) · {fails} problema(s)")
sys.exit(1 if fails else 0)
