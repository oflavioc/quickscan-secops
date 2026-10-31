---
name: guard-tdd-cego-entre-worktrees
description: guard-tdd lê o planning-state da pasta primária da sessão, não da worktree delegada — edição de ui_*.js em outra worktree é negada com "nenhuma demanda ativa"; não contornar, parar e reportar
metadata:
  type: project
---

O hook `guard-tdd` (PreToolUse Write|Edit) roda de `$CLAUDE_PROJECT_DIR` e faz
`cd "$(project_root)"` — lê `.claude/project-memory/planning-state/*.json` da
**pasta primária da sessão**. Medido em 2026-10-30 (demanda 025, T020): sessão com
primária `phase5-009` (sem demanda ativa), trabalho delegado em `phase5-sel`
(025 em `implement`, red proven `b20b20b`) ⇒ todo Edit em `ui_curation_v32.js` negado:
`guard-tdd: edição de módulo de produto ('ui_curation_v32.js') BLOQUEADA — nenhuma demanda ativa.`

**Why:** o rito R3 só é satisfeito no planning-state da worktree certa; o hook não
o vê. Editar por Bash (sed/python) seria contornar um guarda bloqueante — proibido.

**How to apply:** antes de implementar em worktree ≠ pasta primária, esperar a
negação; ao recebê-la, PARAR sem editar, diagnosticar (primária vs worktree,
fase/red das duas) e reportar como BLOCKER em DEPENDÊNCIAS — a saída é a sessão
ser aberta com a worktree como pasta primária (decisão do orquestrador/usuário).
Ver [[hooks-rodam-do-project-dir]] (memória do build-engineer, mesmo mecanismo).
