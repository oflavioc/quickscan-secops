#!/usr/bin/env bash
# Hook PreToolUse (matcher: Write|Edit) — BLOQUEANTE (exit 2). Decisão D1.
#
# Módulo de PRODUTO só é editado com red provado (ou waiver auditável) na
# demanda em curso. Hook que só avisa é a versão nova do gate morto — este
# bloqueia, e as válvulas são explícitas: tipagem de tarefa (R3, granularidade
# demanda nesta onda — conservador: bloqueia mais, nunca menos) e tdd_waiver
# no planning-state (listado pelo compliance a cada execução).
#
# Fora do alcance deste guard: docs, specs, .claude/**, testes (escrever teste
# É a fase red), fixtures. Frozen/generated já são do guard-boundary.
set -uo pipefail
. "$(dirname "$0")/lib/common.sh"

PAYLOAD="$(cat)"
ARQ="$(payload_get '.tool_input.file_path')"
[ -z "$ARQ" ] && exit 0

cd "$(project_root)" 2>/dev/null || exit 0

# módulo de produto? (ui_*.js/.css e builders; caminhos com / ou \)
BASE="${ARQ##*/}"; BASE="${BASE##*\\}"
case "$BASE" in
  ui_*.js|ui_*.css|build_v32_html.py|generate_icons_v32.py) ;;
  *) exit 0;;
esac

VER=$("$PYBIN" - <<'PY'
import json
from pathlib import Path
DIR = Path(".claude/project-memory/planning-state")
ativos = []
for f in (sorted(DIR.glob("*.json")) if DIR.is_dir() else []):
    try:
        d = json.load(open(f, encoding="utf-8"))
    except Exception:
        continue
    if d.get("phase") in ("red", "implement", "validate"):
        red = d.get("red") or {}
        ok = (red.get("status") == "proven" and red.get("commit")) or ("tdd_waiver" in d)
        ativos.append((d.get("demanda", f.stem), ok))
if not ativos:
    print("SEM_DEMANDA")
elif any(ok for _, ok in ativos):
    print("LIBERADO")
else:
    print("SEM_RED|" + ", ".join(n for n, _ in ativos))
PY
)

case "$VER" in
  LIBERADO) exit 0;;
  SEM_DEMANDA)
    {
      echo "guard-tdd: edição de módulo de produto ('$BASE') BLOQUEADA — nenhuma demanda ativa."
      echo "Rito: abra a demanda (skill new-demand) ou, para correção de achado, um planning-state"
      echo "de fix-finding com red provado (R3). Tarefas doc/refactor/chore: registre tdd_waiver."
    } >&2
    exit 2;;
  SEM_RED*)
    {
      echo "guard-tdd: edição de módulo de produto ('$BASE') BLOQUEADA — demanda ativa sem red provado."
      echo "Demanda(s): ${VER#SEM_RED|}"
      echo "Rito (R3): o qa-engineer prova e COMMITA o red primeiro (fase 4); ou registre"
      echo "tdd_waiver {motivo, data} no planning-state — o compliance-audit lista todos."
    } >&2
    exit 2;;
  *) exit 0;;
esac
