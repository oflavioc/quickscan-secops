---
name: ids-ea-entre-branches
description: Ids EA-* do BACKLOG.md são alocados em branches paralelas que não se enxergam — conferir a develop antes de reservar ou recomendar um id novo
metadata:
  type: project
---

Sessões rodam em worktrees paralelos (`phase5-009`, `phase5-013`, …) e cada uma
enxerga só a própria branch. Ids `EA-*` reservados ou citados no chat podem não
existir na `develop` — na Fase 0 da 013 (2026-08-28) o orquestrador citou EA-3 e
a reserva de EA-4 como fato; `Grep` na árvore inteira do worktree (nascido de
`origin/develop` em `077282f`) não achou nenhum dos dois: viviam só na branch da
sessão irmã.

**Why:** R12 manda que "números citados nunca renumeram". Duas branches escrevendo
o mesmo `.claude/BACKLOG.md` com o mesmo id novo dá conflito de merge no arquivo
onde renumerar é proibido — o custo é arqueologia, não um rebase.

**How to apply:** antes de recomendar que uma demanda escreva um achado novo,
verificar por Grep se os ids anteriores da série existem no worktree. Se não
existirem, recomendar que a escrita do achado seja **tarefa da demanda, depois
que a branch irmã chegar à develop** — nunca alocar o id na Fase 0. O achado não
se perde no intervalo: a cadeia arquivo:linha→efeito fica no `refinement.md` como
insumo para o `doc-writer`, que é quem escreve o BACKLOG (`BACKLOG.md:3`).
Relacionado: [[pergunta-sempre-com-recomendacao]].
