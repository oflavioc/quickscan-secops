---
name: guard-tdd-outra-worktree
description: guard-tdd bloqueia Edit em ui_*.js quando a delegação aponta outra worktree ou demanda fora de red/implement/validate — parar e reportar, nunca editar por Bash
metadata:
  type: feedback
---

O `guard-tdd` (PreToolUse Write|Edit) resolve `project_root()` por
`git rev-parse --show-toplevel` a partir da **pasta primária da sessão**
(`phase5-009`), não da worktree que o orquestrador mandou usar. E só libera
demanda em fase `red`/`implement`/`validate` com red provado ou `tdd_waiver`:
demanda refutada na Fase 0 (fica em `refinement` com waiver) **não libera**.
Medido em 2026-10-19 na 024: Edit de comentário em `ui_p52_workspace_v32.js`
bloqueado com "nenhuma demanda ativa" pelas duas razões ao mesmo tempo.

**Why:** o hook é guarda bloqueante da R3; editar o mesmo arquivo por `sed`/heredoc
no Bash passaria por fora do matcher, e isso é contornar o guarda — o mesmo
pecado de afrouxar gate. Mesmo comentário-only não é exceção: o guarda decide
por caminho de módulo, não por conteúdo do diff.

**How to apply:** ao receber delegação para `ui_*.js` em worktree ≠ pasta
primária, checar ANTES o planning-state ativo (fase + red/waiver) nas duas
árvores. Bloqueou: não tocar o arquivo, entregar o texto exato proposto e o rito
em DEPENDÊNCIAS (planning-state de fix-finding/chore em `implement` com waiver,
na árvore que o hook lê). Ver [[workflow-verificacao-sem-rebuild]] e
[[project-wave-paralela-worktree-unica]].
