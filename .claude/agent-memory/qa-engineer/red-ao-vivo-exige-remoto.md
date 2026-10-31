---
name: red-ao-vivo-exige-remoto
description: "Red ao vivo no PR" e "vermelho do job X sobre esta branch" são alegações sobre o REMOTO — confira `git ls-remote --heads origin`, `gh pr list --state all` e `gh run list --branch` antes de escrevê-las; na 016 a branch nunca tinha sido enviada (33 commits à frente, sem PR, sem run) enquanto tasks/planning davam T041/T043 como feitas e o orquestrador falava do "job fecho sobre esta branch"
metadata:
  type: feedback
---

Na Fase 6 da 016 (2026-09-04) a delegação dizia "job `fecho` sobre esta branch
→ FECHO PENDENTE" e a `tasks.md` previa T041 (push + PR + primeiro run) e T043
(segundo run, medição do token) na wave 4. Medido: `git ls-remote --heads
origin` só tinha `develop` e `feature/007`; `gh pr list --head … --state all`
⇒ `[]`; `gh run list --branch …` ⇒ `[]`; planning-state sem `pr_url`. Os
"vermelhos esperados" existiam **só localmente** (`GITHUB_HEAD_REF=… --pr` e
`compliance-audit.sh`). Consequências em cadeia que só apareceram por isso:
§Não mensurável 1 (permissão do `GITHUB_TOKEN`) continua não medida; T050
(P2) depende de o contexto `fecho` ter reportado uma vez; `check_state.py:52`
exige `pr_url` em `done` — T084 é impossível sem T041; e a pré-condição de
T080 ("PARAR sem P2") não podia ser cumprida.

**Why:** R2 §4 — alegação checável de outro agente se verifica antes de agir.
"Vermelho esperado" é a alegação mais fácil de aceitar sem olhar, porque a cor
bate com a expectativa; a trilha do commit 541771a mostrou no mesmo ciclo um
vermelho pela razão errada passando por vermelho certo.

**How to apply:** antes de escrever "red ao vivo", "run N" ou "check vermelho
no PR" em spec-validate/relatório: (1) `git status -sb` (upstream?),
(2) `git ls-remote --heads origin | grep <branch>`, (3) `gh pr list --head
<branch> --state all`, (4) `gh run list --branch <branch>`. Se algum vier
vazio, o red é LOCAL e o texto diz isso; a lacuna vai a DEPENDÊNCIAS com a
tarefa que a fecha (aqui T041), e a pré-condição de parada da tarefa é
declarada como não cumprida mesmo quando se prossegue por instrução do
orquestrador. Ver [[conforme-por-deferimento-tem-prazo]] (o verde que muda de
prova) e [[verde-com-excecao-impressa]].
