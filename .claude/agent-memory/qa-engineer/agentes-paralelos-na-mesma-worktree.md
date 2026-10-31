---
name: agentes-paralelos-na-mesma-worktree
description: Com outros agentes commitando na MESMA worktree, o HEAD de partida não é o do documento que você está corrigindo — confira `git log`/`git status` antes de medir e antes de "limpar" a árvore movendo um arquivo não rastreado; na 016 o spec-validate.md que deixei untracked foi varrido por um commit alheio ("errata E4", d130a04) e o meu `mv` virou deleção, derrubando o stage mutation
metadata:
  type: feedback
---

Antes de qualquer medição e de qualquer commit, `git log --oneline -3` e
`git status --short`; e prove a identidade dos arquivos que você julga contra o
SHA citado no documento (`git rev-parse <sha>:<path>` nos dois lados), em vez
de escrever "HEAD 76fd9dc" de memória.

**Why:** na iteração de correção da 016 (2026-09-04) o spec-validate citava
HEAD `76fd9dc`, mas a árvore já estava em `d130a04` — um commit "doc(016):
errata E4" de outro agente que também levou o schema do planning-state,
`design-decisions.md`, o ADR e o meu `spec-validate.md` não rastreado (mensagem
que diz menos do que o commit contém, o padrão da trilha de `541771a`). Duas
consequências práticas: (1) escrevi "clone de HEAD 76fd9dc" em quatro lugares e
tive de corrigir para "d130a04, arquivos julgados byte-idênticos"; (2) para
rodar o stage `mutation` (exige porcelain vazio) movi o spec-validate.md para o
scratchpad achando que era untracked — ele já era rastreado, o `mv` virou ` D`
e o stage recusou "árvore suja". O baseline vermelho passou a listar arquivos
que não eram meus, e isso precisa ser dito na EVIDÊNCIA, não somado ao meu.

**Segunda ocorrência (iteração 2, mesmo dia):** o `run.sh` completo saiu
`15 PASS · 1 FAIL — mutation` porque a T082 (doc-writer) gravava três arquivos
na worktree durante a execução; o stage recusa árvore suja, e o `run.sh` trunca
a saída em 30 linhas (EA-15), então o log só mostrava as linhas `[OK] IC-1…` e
nenhuma razão. Minutos depois a árvore estava limpa (commits alheios) e o HEAD
tinha andado três commits. O número que vale veio do stage isolado
(`check_mutation.py`, árvore limpa: 33/33) e do clone efêmero; a segunda
execução completa reprovou `baseline` pelos arquivos alheios sem repin — outro
FAIL que não é meu e vai declarado como tal.

**How to apply:** trate a worktree como compartilhada: HEAD antes/depois,
`git show --stat` de commits que apareceram no meio, e separe na evidência o que
é seu do que entrou por terceiros. Nunca mova/apague arquivo para limpar a
árvore sem `git ls-files --error-unmatch <path>` antes. Se um commit alheio
carregar artefatos de outros gaps sob mensagem menor, isso vai em DEPENDÊNCIAS
ao orquestrador — não é seu para reescrever. Ver também
[[medir-red-do-proprio-julgador]] e [[clone-efemero-para-refs-remotas]].
