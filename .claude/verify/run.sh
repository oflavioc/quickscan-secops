#!/usr/bin/env bash
# Executor do pipeline declarado em pipeline.yaml (Onda 0).
#
#   bash .claude/verify/run.sh                   # todos os stages
#   bash .claude/verify/run.sh --stage=baseline  # um stage
#   bash .claude/verify/run.sh --no-mutate       # pula stages que regeneram arquivos
#
# Onda 0: execução sequencial na ordem declarada (o campo parallel é honrado a
# partir da Onda 1). env-doctor com FAIL aborta o pipeline — os demais stages
# não fazem sentido sobre toolchain quebrada.
# Saída: [PASS]/[FAIL] por stage + resumo. Exit = número de stages que falharam.
set -uo pipefail
cd "$(dirname "$0")/../.." || exit 1

PYBIN=python3; command -v python3 >/dev/null 2>&1 || PYBIN=python

FILTRO=""; NO_MUTATE=0
for arg in "$@"; do
  case "$arg" in
    --stage=*)   FILTRO="${arg#--stage=}";;
    --no-mutate) NO_MUTATE=1;;
  esac
done

# pipeline.yaml -> linhas "nome|parallel|mutates|comando" (parser do subset usado)
STAGES=$("$PYBIN" - <<'PY'
import re, sys
if hasattr(sys.stdout, "reconfigure"): sys.stdout.reconfigure(encoding="utf-8")
stage, fields, order = None, {}, []
data = {}
for raw in open(".claude/verify/pipeline.yaml", encoding="utf-8"):
    line = raw.rstrip("\n")
    if not line.strip() or line.lstrip().startswith("#") or line.startswith("stages:"):
        continue
    m = re.match(r"^  (\S+):\s*$", line)
    if m:
        stage = m.group(1); data[stage] = {}; order.append(stage); continue
    m = re.match(r"^    (\w+):\s*(.+?)\s*$", line)
    if m and stage:
        k, v = m.groups()
        data[stage][k] = v.strip('"')
for s in order:
    d = data[s]
    par = "1" if d.get("parallel") == "true" else "0"
    mut = "1" if d.get("mutates") == "true" else "0"
    print(f"{s}|{par}|{mut}|{d['run']}")
PY
) || { echo "pipeline.yaml inválido" >&2; exit 1; }

PASS=0; FAIL=0
while IFS='|' read -r nome par mut cmd; do
  [ -n "$FILTRO" ] && [ "$nome" != "$FILTRO" ] && continue
  [ "$NO_MUTATE" = "1" ] && [ "$mut" = "1" ] && { echo "[SKIP] $nome (mutates, --no-mutate)"; continue; }
  cmd="${cmd/#python /$PYBIN }"
  SAIDA=$(eval "$cmd" 2>&1); RC=$?
  if [ "$RC" = "0" ]; then
    PASS=$((PASS+1)); echo "[PASS] $nome"
  else
    FAIL=$((FAIL+1)); echo "[FAIL] $nome"
    echo "$SAIDA" | sed 's/^/       /' | head -30
    if [ "$nome" = "env-doctor" ]; then
      echo "env-doctor FAIL — pipeline abortado (toolchain quebrada)"; break
    fi
  fi
done <<< "$STAGES"

echo "----"
echo "verify: $PASS PASS · $FAIL FAIL"
exit "$FAIL"
