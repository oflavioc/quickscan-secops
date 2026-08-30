---
name: project-013-rito-de-medicao
description: Como medir o stage mutation antes do commit — worktree efêmera com commit descartável, porque o julgador aborta em árvore suja
metadata:
  type: project
---

O stage `mutation` (`.claude/verify/check_mutation.py`) tem **árvore limpa como
pré-condição** e sai 1 antes de qualquer asserção se o porcelain não estiver
vazio. Quando o commit da tarefa é do orquestrador (e eu não posso commitar), a
medição gate a gate se faz assim: `git worktree add --detach <tmp> HEAD`, aplicar
`git diff` como patch lá, commit descartável **na worktree efêmera**, rodar, e
`git worktree remove --force` no fim. O rito local é
`MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py` (D3) — sem a
env a ausência de Chromium vira `[FAIL]` de ambiente e se mistura ao FAIL das
asserções.

**Why:** medir depois do commit é o que o `tasks.md` pede, mas o commit é do
orquestrador; a worktree efêmera dá a árvore limpa sem tocar o branch nem o
índice, e não deixa rastro depois do `remove`.

**How to apply:** vale para qualquer tarefa em que eu entregue diff sem commitar e
precise devolver "estado gate a gate". Confirmar sempre, depois: `git worktree
list` sem a temporária e `git status --porcelain` com exatamente os arquivos da
demanda. Ver [[project-013-e1-harnesses]].

**Limite do ambiente local (verificado 2026-08-29):** a worktree `phase5-013`
**não tem `node_modules`** — as suítes de gate (`tests_p50_core.js` e afins)
morrem em `Cannot find module 'jsdom'` antes de emitir qualquer linha PASS/FAIL.
Somando à ausência de Chromium, **nenhuma campanha de mutação roda ali**, nem
parcial: o que se mede localmente é o julgador (`check_mutation.py`) e o
`--preflight` dos harnesses, que não executam gate nenhum. Prova de plumbing de
`env` se faz com sonda (`node -e "console.log(process.env.X)"`), nunca com a
suíte real.

**Quando a worktree TEM `node_modules` (verificado em `phase5-009`, 2026-08-30):**
o limite acima se inverte e vira risco. Com node+python presentes, o laço de
trigger DISPARA de verdade a campanha de qualquer harness cujo `requires` esteja
satisfeito e cujos alvos tenham mudado contra a base (`d009` é o caso: node +
python, sem Chromium). `MUTATION_DEFER_MISSING=1` não protege — ele só cobre
`requires` AUSENTE. Para medir IC-1…IC-10 sem disparar campanha: driver que lê
`check_mutation.py`, corta no marcador `\nran = 0\n` (primeira linha do laço,
ocorrência única) e faz `exec` só do cabeçalho. Tudo acima do corte roda com os
bytes REAIS do julgador, incluindo os três fechos nomeados; o que fica de fora é
o laço de trigger, a execução de campanha e a checagem final de árvore suja.
Declarar sempre quantos bytes de quantos foram executados.

**Quando a entrega são DOIS commits e eu não posso commitar:** carregar a divisão
no **índice** — `git apply --cached <patch-do-commit-a>`, deixando o working tree
com (a)+(b). `git diff --cached` vira o commit (a) e `git diff` vira o (b), sem eu
commitar nada. Mais durável que deixar patches no scratchpad da sessão; avisar o
orquestrador para **não** rodar `git add -A` antes do primeiro commit.
