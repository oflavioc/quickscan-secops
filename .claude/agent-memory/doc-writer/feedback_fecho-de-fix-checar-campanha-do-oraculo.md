---
name: fecho-de-fix-checar-campanha-do-oraculo
description: Ao fechar fix em arquivo de gate/lint, procurar mutante de OUTRA campanha que o usa como carrasco — o gatilho por path (mutation_map targets) pode não listá-lo
metadata:
  type: feedback
---

No fecho de um fix-finding que mexeu num **arquivo de verificação** (lint, check),
antes de escrever "prova executada", conferir se algum mutante de outra campanha o
usa como oráculo — e declarar a campanha como **não executada** se não rodou.

**Why:** no fecho do `EA-101` (2026-10-25) o fix inverteu o conjunto varrido de
`.claude/verify/check_lint_arch.py`. O mutante `D011-M7` (`tests_011_mutants.js:338-345`,
`LINT_PY` em `:70`) usa exatamente esse lint como carrasco, mas
`mutation_map.json → harnesses.d011.targets` não lista `check_lint_arch.py`: o stage
`mutation` (gatilho por path) **não dispara** a campanha com essa mudança, e o
arquivo consta em `mutation_population.json:42-45` como dívida ("Sem harness desde que
nasceu"). O fix passou limpo por uma razão que o pipeline não exige provar. Achado só
com `grep check_lint_arch` na árvore — o commit do fix não o mencionava.

**How to apply:** `grep -rn <arquivo-tocado>` em `tests_*mutants*.js`,
`mutation_map.json` e `mutation_population.json`. Registrar no fecho: quem é o
carrasco, se está em `targets`, e que a reexecução é decisão do `qa-engineer` (não
minha, nem a rodo: a campanha muta fontes). Sem id novo na hora: vai em
`DEPENDÊNCIAS`; alocação de `EA-*` é do orquestrador ([[alocacao-ids-ea]]).
Ligado a [[status-do-achado-contra-o-fonte]] (a mesma disciplina de ler o fonte, não o
resumo).
