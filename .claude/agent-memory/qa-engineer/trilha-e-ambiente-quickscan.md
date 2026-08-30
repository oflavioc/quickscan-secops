---
name: trilha-e-ambiente-quickscan
description: Nesta worktree o Chromium não existe e as worktrees de feature não têm node_modules (jsdom via NODE_PATH); o qa-engineer roda em Opus, não no modelo pinado
metadata:
  type: project
---

Dois fatos de ambiente que se repetem a cada fase e precisam ser **declarados**,
nunca presumidos nem inventados:

1. **Chromium ausente.** `playwright.chromium.executablePath()` resolve para o
   cache local do Playwright e o binário **não existe** (conferido por
   `fs.existsSync` em 2026-08-28); `CHROME_PATH` vazio.
   *Descreva o caminho, nunca o cole:* em 2026-08-28 o `compliance-audit`
   reprovou o PR #24 com "caminho absoluto em governança" porque o literal
   dessa resolução — com nome de usuário — tinha ficado em
   `mutation-matrix.json`. Arquivo de governança versionado não aceita caminho
   de máquina; e o scanner (`compliance-audit.sh`) varre apenas
   `*.sh|*.py|*.json|*.yaml` sob `.claude/hooks` e `.claude/verify` — `*.md` é
   **ponto cego**, então aqui a disciplina é minha, não do gate.
   Logo `p52chromium` (55/0), `p50chromium` (27/0) e `playwright` (67/37) são
   **não executados, declarados com motivo** — o resultado vem do job `visual`
   no CI. `known_issues.json` está com `issues: []`: é agendamento, não dispensa.
2. **`node_modules` pode não existir na worktree de feature — confira, não
   presuma.** Em 2026-08-29 (T019 da 013) `phase5-013` estava sem instalação e
   `require("jsdom")` estourava `MODULE_NOT_FOUND`, deixando **toda** suíte
   `node tests_*.js` inexecutável ali; na E3 do mesmo dia a worktree **já
   tinha** `node_modules` (inclusive `playwright` e `@bramus/specificity`) e as
   suítes rodavam. O estado muda entre waves; `ls <worktree>/node_modules` antes
   de concluir qualquer coisa. Quando faltar, o provisionamento que funciona sem
   tocar a árvore é exportar
   `NODE_PATH=<…>/phase5-009/node_modules` (o `run()` dos harnesses herda
   `process.env`, então propaga ao filho). Confira antes que o `jsdom` da origem
   bate o `package-lock` do destino — em 2026-08-29 os dois pinavam `30.0.1`.
   Isso **não** é dispensa de declarar: um `MODULE_NOT_FOUND` lido às pressas
   vira "gate não pôde ser executado" e se confunde com ambiente de verdade
   ausente (foi o que aconteceu na primeira sonda de `M51-03`).
3. **Desvio de trilha.** As definições dos agentes pinam `model: fable`/`max`;
   as execuções vêm ocorrendo em **Opus** por indisponibilidade de créditos —
   confirmado de novo em 2026-08-29 (T002 da demanda 013, worktree
   `phase5-013`), com o orquestrador pedindo explicitamente o registro. O desvio
   vai em `DEPENDÊNCIAS` de cada relatório; não vale a pena repetir a pergunta a
   cada wave.

**Why:** R2 §1 e R10 §2 — SKIP silencioso é FAIL e PASS não executado é
alegação, não evidência. Já houve um incidente (E6) com 23 gates visuais
"passando" com exit 0 sem executar nada.

**How to apply:** ao fechar qualquer fase, separe o relatório em EXECUTADO
(com contagem) e NÃO EXECUTADO (com motivo nomeado). Nunca escreva a contagem
canônica de uma suíte Chromium a partir do registro — cite o registro como
*esperado*, não como *medido*. Ver [[armadilha-oraculo-de-texto-copymap]].
