#!/usr/bin/env bash
# Hook PreToolUse (matcher: Bash) — BLOQUEANTE (exit 2) em `git add -A`/`.`/`--all`.
#
# EA-37: dois commits reais (`541771a`, `d130a04`, mesmo turno, quatro horas de
# intervalo) empacotaram trabalho de agente em voo porque o orquestrador correu
# `git add -A` enquanto build-engineer/data-engineer/doc-writer ainda escreviam
# na mesma worktree. `.claude/rules/orchestration.md` §Anti-patterns registra a
# regra em prosa — este hook é a metade mecânica.
#
# Decisão de desenho (medida, não suposta — ver relatório do fix-finding):
#   - NÃO existe sinal técnico confiável de "delegação ativa" no payload do
#     hook nem no disco. Um marcador ligado/desligado por PreToolUse/PostToolUse
#     do Task teria uma corrida exatamente no cenário que causou o incidente:
#     `-A` disparado na MESMA leva paralela que despacha os agentes (a ordem
#     entre hooks de chamadas irmãs na mesma mensagem não é garantida).
#   - Por isso: bloqueio INCONDICIONAL, sem válvula. Custo medido é ~zero —
#     nenhum script/pipeline deste repo roda `git add -A`/`.`/`--all`
#     (varredura de `git grep` na árvore inteira); o único uso histórico é o
#     bootstrap único da Fase 5 (`docs/PHASE_5_KICKOFF.md`), doc-only, já no
#     passado. Caminho nominal cobre 100% do caso legítimo — inclusive many
#     paths de uma vez (`git add a b c`).
#
# Auto-exclusão (R10 §10): a detecção tokeniza o comando (shlex) em vez de
# casar substring — "git add -A" dentro de uma mensagem de commit, de um
# `grep`, ou em PROSA de doc/comentário escrita via heredoc não aciona o
# guard (heredocs são removidos do texto antes da análise; conteúdo entre
# aspas vira um token único, não os três tokens soltos "git"/"add"/"-A").
# Limite aceito e documentado: um heredoc que canaliza para OUTRO interpretador
# de shell (`bash <<'EOF' ... git add -A ... EOF`) não é inspecionado — esse
# padrão não existe hoje neste repo (hooks/heredocs daqui vão para `python -`,
# nunca para `bash -`), e cobri-lo exigiria um parser de shell completo.
set -uo pipefail
. "$(dirname "$0")/lib/common.sh"

PAYLOAD="$(cat)"
CMD="$(payload_get '.tool_input.command')"
[ -z "$CMD" ] && exit 0
case "$CMD" in *git*add*) ;; *) exit 0;; esac

ACHADO=$(CMD="$CMD" "$PYBIN" - <<'PY'
import os, re, shlex

cmd = os.environ.get("CMD", "")

# 1) remove corpo de heredocs (<<'DELIM', <<DELIM, <<-DELIM) — texto ali é
#    dado, não comando; evita autoacusação por prosa/comentário/geração de
#    arquivo que MENCIONA "git add -A" sem executá-lo.
HEREDOC = re.compile(r"<<-?\s*(['\"]?)(\w+)\1")
linhas = cmd.split("\n")
saida, i, n = [], 0, len(linhas)
while i < n:
    m = HEREDOC.search(linhas[i])
    if m:
        delim = m.group(2)
        saida.append(linhas[i][:m.start()])
        i += 1
        while i < n and linhas[i].rstrip() != delim:
            i += 1
        i += 1
        continue
    saida.append(linhas[i])
    i += 1
sem_heredoc = "\n".join(saida)

try:
    tokens = shlex.split(sem_heredoc, posix=True)
except ValueError:
    # aspas não fecham (comum quando o comando real é só o INÍCIO de um
    # heredoc multi-linha do próprio Bash tool) — nada de comando git para
    # tokenizar com segurança; não bloqueia às cegas.
    print("")
    raise SystemExit

# 2) parte em "statements" nos operadores de controle que sobraram como
#    tokens soltos (aspas já protegem o que está dentro de string).
statements, atual = [], []
for t in tokens:
    if t in ("&&", "||", ";", "|"):
        statements.append(atual)
        atual = []
    else:
        atual.append(t)
statements.append(atual)

achados = []
for s in statements:
    for idx, t in enumerate(s):
        if t == "git" or t.endswith("/git"):
            resto = s[idx + 1:]
            if "add" in resto:
                pos = resto.index("add")
                args = resto[pos + 1:]
                if any(a in ("-A", "--all", ".") for a in args):
                    achados.append(" ".join(s))
            break
print("\n".join(achados))
PY
)

[ -z "$ACHADO" ] && exit 0
{
  echo "guard-add: BLOQUEADO — 'git add' de escopo amplo (-A / . / --all)."
  printf '%s\n' "$ACHADO" | sed 's/^/  · /'
  echo "Regra (EA-37, orchestration.md §Anti-patterns): commit por CAMINHO NOMINAL"
  echo "sempre — git add -A/./--all pode empacotar escrita de agente em voo na mesma"
  echo "worktree (541771a, d130a04). Liste os arquivos: git add <caminho1> <caminho2> ..."
} >&2
exit 2
