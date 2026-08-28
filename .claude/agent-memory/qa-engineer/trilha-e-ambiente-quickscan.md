---
name: trilha-e-ambiente-quickscan
description: Nesta worktree o Chromium não existe (p52chromium/playwright são NÃO EXECUTADOS declarados) e o qa-engineer roda em Opus, não no modelo pinado
metadata:
  type: project
---

Dois fatos de ambiente que se repetem a cada fase e precisam ser **declarados**,
nunca presumidos nem inventados:

1. **Chromium ausente.** `playwright` resolve
   `C:\Users\usuario\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe`
   e o binário **não existe** (conferido por `fs.existsSync` em 2026-08-28).
   Logo `p52chromium` (55/0), `p50chromium` (27/0) e `playwright` (67/37) são
   **não executados, declarados com motivo** — o resultado vem do job `visual`
   no CI. `known_issues.json` está com `issues: []`: é agendamento, não dispensa.
2. **Desvio de trilha.** As definições dos agentes pinam `model: fable`; as
   execuções vêm ocorrendo em **Opus** por indisponibilidade de créditos. O
   desvio é registrado em `DEPENDÊNCIAS` de cada relatório e em `red.notes` do
   planning-state.

**Why:** R2 §1 e R10 §2 — SKIP silencioso é FAIL e PASS não executado é
alegação, não evidência. Já houve um incidente (E6) com 23 gates visuais
"passando" com exit 0 sem executar nada.

**How to apply:** ao fechar qualquer fase, separe o relatório em EXECUTADO
(com contagem) e NÃO EXECUTADO (com motivo nomeado). Nunca escreva a contagem
canônica de uma suíte Chromium a partir do registro — cite o registro como
*esperado*, não como *medido*. Ver [[armadilha-oraculo-de-texto-copymap]].
