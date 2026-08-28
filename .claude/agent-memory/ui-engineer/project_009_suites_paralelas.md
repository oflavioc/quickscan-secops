---
name: project-009-suites-paralelas
description: Na demanda 009 vários ui-engineers editam módulos irmãos em paralelo; falhas de P52-GOV1 e de suítes vizinhas costumam ser de outro dono
metadata:
  type: project
---

A demanda 009 (`specs/009-leitura-do-relatorio/`) é executada por várias delegações
`ui-engineer` **em paralelo**, uma por arquivo, na mesma árvore de trabalho.

**Why:** o plano (wave 3) despacha cinco módulos `[P]` de uma vez e só reconstrói o HTML na
wave 5. Entre a wave 3 e a 5, `P52-GOV1` ("bloco CSS/JS injetado difere do arquivo-fonte")
fica vermelho por construção, e `tests_p52_mutants.js` fica instável porque seus baselines
apontam para hashes dos módulos-fonte ainda em movimento.

**How to apply:** ao rodar suítes de regressão, confirme a autoria de uma falha isolando
só o seu arquivo (`git stash push -- <meu-arquivo>` e rodar de novo) antes de reportar —
o `git status` vai mostrar arquivos modificados que não são seus e isso é esperado, não
contaminação. Falha de rebuild/pin é do `build-engineer`; gate errado é do `qa-engineer`.
Ver [[feedback-css-regua-estreitar]].
