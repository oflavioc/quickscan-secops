#!/usr/bin/env bash
# Auditoria de conformidade: a PRÓPRIA configuração agêntica está íntegra?
#
#   bash .claude/verify/compliance-audit.sh            # todas as seções
#   bash .claude/verify/compliance-audit.sh --rule=X   # uma seção
#
# Seções: hooks, deny, invariantes, suites, paths, known-issues, waivers
#
# Diferente do run.sh (que verifica artefatos), isto audita o CUMPRIMENTO das
# regras — inclusive da própria configuração: a referência que inspirou esta
# estrutura tinha 3 hooks soltos no disco, desligados, e ninguém percebeu.
# A seção `hooks` existe para isso não acontecer aqui.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
PYBIN=python3; command -v python3 >/dev/null 2>&1 || PYBIN=python

FILTRO=""
for arg in "$@"; do case "$arg" in --rule=*) FILTRO="${arg#--rule=}";; esac; done

PASS=0; FAIL=0
secao() { [ -z "$FILTRO" ] || [ "$FILTRO" = "$1" ]; }
ok()    { PASS=$((PASS+1)); echo "[PASS] $1"; }
falha() { FAIL=$((FAIL+1)); echo "[FAIL] $1"; shift; printf '%s\n' "$@" | sed 's/^/       /'; }

# ---------------------------------------------------------------- hooks
if secao hooks; then
  for h in guard-boundary guard-tdd guard-data state-eval post-turn-verify; do
    F=".claude/hooks/$h.sh"
    if [ ! -f "$F" ]; then falha "hook ausente no disco: $F"; continue; fi
    if ! grep -q "$h.sh" .claude/settings.json 2>/dev/null; then
      falha "hook existe mas NÃO está registrado em settings.json: $h"
    elif ! grep -q 'PAYLOAD="\$(cat)"' "$F"; then
      falha "hook fora do contrato stdin-uma-vez (lib/common.sh): $h"
    else
      ok "hook registrado e no contrato: $h"
    fi
  done
  grep -q 'lib/common.sh' .claude/hooks/guard-boundary.sh && ok "hooks usam a lib comum" \
    || falha "guard-boundary não usa lib/common.sh"
fi

# ----------------------------------------------------------------- deny
if secao deny; then
  MISS=$("$PYBIN" - <<'PY'
import json
b = json.load(open(".claude/verify/boundary.json", encoding="utf-8"))
deny = json.load(open(".claude/settings.json", encoding="utf-8"))["permissions"]["deny"]
falta = []
for classe, spec in b["classes"].items():
    for p in spec["paths"]:
        for tool in ("Edit", "Write"):
            if f"{tool}({p})" not in deny:
                falta.append(f"{tool}({p})")
print("\n".join(falta))
PY
)
  if [ -z "$MISS" ]; then ok "permissions.deny cobre TODOS os paths do boundary.json (Edit+Write)"
  else falha "boundary sem deny correspondente:" "$MISS"; fi
fi

# ----------------------------------------------------------- invariantes
if secao invariantes; then
  MISS=$("$PYBIN" - <<'PY'
import json, os
inv = json.load(open(".claude/verify/invariants.json", encoding="utf-8"))["invariantes"]
falta = []
for i in inv:
    if not i.get("gates"):
        falta.append(f"{i['id']} sem gate associado")
    for g in i.get("gates", []):
        if not os.path.exists(g):
            falta.append(f"{i['id']}: gate inexistente: {g}")
print("\n".join(falta))
PY
)
  if [ -z "$MISS" ]; then ok "10/10 invariantes de produto com gate executável existente"
  else falha "invariante sem gate real:" "$MISS"; fi
fi

# ---------------------------------------------------------------- suites
if secao suites; then
  MISS=$("$PYBIN" - <<'PY'
import json
from pathlib import Path
reg = json.load(open(".claude/verify/expected_suites.json", encoding="utf-8"))
known = set()
for issue in json.load(open(".claude/verify/known_issues.json", encoding="utf-8"))["issues"]:
    if issue.get("lint") == "suites-no-agregado":
        known |= set(issue["excecao"]["arquivos"])
registered = {s["cmd"].split()[-1] for b in ("suites", "heavy") for s in reg[b].values()}
falta = [str(f) for f in Path(".").glob("tests_*.js")
         if str(f) not in registered and str(f) not in known]
print("\n".join(falta))
PY
)
  if [ -z "$MISS" ]; then ok "toda suíte tests_*.js está no registro canônico ou em exceção nominal"
  else falha "suíte fora do registro e das exceções:" "$MISS"; fi
fi

# ----------------------------------------------------------------- paths
if secao paths; then
  HITS=$(grep -rlE '[A-Z]:\\\\|[A-Z]:/Users/|/home/[a-z]' .claude/hooks .claude/verify --include="*.sh" --include="*.py" --include="*.json" --include="*.yaml" 2>/dev/null | grep -v pins.json || true)
  if [ -z "$HITS" ]; then ok "nenhum caminho absoluto em arquivos de governança (.claude/)"
  else falha "caminho absoluto em governança:" "$HITS"; fi
fi

# ----------------------------------------------------------- known-issues
if secao known-issues; then
  MISS=$("$PYBIN" - <<'PY'
import json
issues = json.load(open(".claude/verify/known_issues.json", encoding="utf-8"))["issues"]
falta = [i["id"] for i in issues if not i.get("remocao_prevista")]
print("\n".join(falta))
PY
)
  N=$("$PYBIN" -c "import json;print(len(json.load(open('.claude/verify/known_issues.json',encoding='utf-8'))['issues']))")
  if [ -z "$MISS" ]; then ok "known-issues: $N exceção(ões) nominal(is), todas com remoção prevista"
  else falha "exceção nominal SEM remoção prevista:" "$MISS"; fi
fi

# ---------------------------------------------------------------- waivers
if secao waivers; then
  if [ -d ".claude/project-memory/planning-state" ]; then
    W=$(grep -l "tdd_waiver" .claude/project-memory/planning-state/*.json 2>/dev/null || true)
    if [ -z "$W" ]; then ok "waivers TDD: nenhum ativo"
    else ok "waivers TDD ativos (listados para revisão):"; printf '%s\n' "$W" | sed 's/^/       /'; fi
  else
    ok "waivers TDD: máquina SDD ainda não instalada (Onda 2) — nada a listar"
  fi
fi

echo "----"
echo "compliance: $PASS PASS · $FAIL FAIL"
exit "$FAIL"
