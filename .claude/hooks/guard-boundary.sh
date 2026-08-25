#!/usr/bin/env bash
# Hook PreToolUse (matcher: Write|Edit) — BLOQUEANTE (exit 2).
#
# A change boundary deixa de ser prosa (achado E2: arquivos protegidos pela
# §29.4 foram editados em 5.1/5.2 sem revisão de spec — regra em prosa não
# segurou). Este hook nega a edição direta de qualquer path listado em
# .claude/verify/boundary.json, explicando o RITO que autoriza a mudança.
set -uo pipefail
. "$(dirname "$0")/lib/common.sh"

PAYLOAD="$(cat)"
ARQ="$(payload_get '.tool_input.file_path')"
[ -z "$ARQ" ] && exit 0

cd "$(project_root)" 2>/dev/null || exit 0

RES=$(PAYLOAD="" ARQ="$ARQ" "$PYBIN" - <<'PY'
import json, os, sys
arq = os.environ["ARQ"].replace("\\", "/")
try:
    b = json.load(open(".claude/verify/boundary.json", encoding="utf-8"))
except Exception:
    sys.exit(0)   # sem manifesto, não bloqueia (compliance-audit acusa a ausência)
for classe, spec in b["classes"].items():
    for p in spec["paths"]:
        if arq == p or arq.endswith("/" + p):
            print(f"{classe}|{p}|{spec['rito']}")
            sys.exit(0)
PY
)
[ -z "$RES" ] && exit 0

CLASSE="${RES%%|*}"; RESTO="${RES#*|}"; ALVO="${RESTO%%|*}"; RITO="${RESTO#*|}"
{
  echo "guard-boundary: edição direta de '$ALVO' BLOQUEADA (classe: $CLASSE)."
  echo "Rito autorizado: $RITO"
  echo "Referência: .claude/verify/boundary.json · documento 'Estrutura Agêntica QuickScan' (R6, D2)."
} >&2
exit 2
