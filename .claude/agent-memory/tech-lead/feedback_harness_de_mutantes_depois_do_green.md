---
name: harness-de-mutantes-nasce-depois-do-green
description: O harness tests_NNN_mutants.js nasce na wave de fecho, depois do green, junto com a chave do mutation_map (D4 da 013) — as âncoras são strings do código que ainda não existe; no red viaja a tabela estado-do-mundo, não o harness
metadata:
  type: feedback
---

**O harness de mutação não entra no commit do red.** As âncoras (`find:`) dos
mutantes são trechos do código **pós-implementação** (a chamada nova, a guarda
removida, o texto novo); o `--preflight` exige `ocorrencias == 1` antes de
qualquer mutação, e a D4 da 013 exige a chave `preflight` no mesmo commit em
que o harness a lê. Um harness no red teria quase todas as âncoras
`nao_executavel`. Precedentes: 019 T022, 021, 022 (`a79fa36 test(022): W4 —
campanha`), 023 (`a6ffcb2 test(023): W2 — campanha`) — todos depois do green,
pelo `qa-engineer`, com `mutation_map` + `expected_suites` no **mesmo** commit.

**Why:** o brief da Fase 2 da 025 pedia "W1 red (gates + mutantes + red
commitado)". Segui o mecanismo em vez do brief e declarei a divergência em
DEPENDÊNCIAS — o que viaja no red e no prompt dos implementadores é a tabela
"estado do mundo que reprova cada gate" (M1…Mn da spec), não o runner.

**How to apply:** no `plan.md`, seção própria "Quando o harness nasce";
tarefa `chore` do `qa-engineer` na wave de fecho: harness + `harnesses.<d>` +
`suites.<d>` fixado por execução + `mutation-matrix.json`, um commit, um repin.
Também: o rebase que mude SHAs tem de vir **antes** do red — `check_tdd.py:32`
confere `red.commit` por `git cat-file -e`, e no clone do CI o SHA antigo não
existe. Ver [[r3-gate-e-implementacao-no-mesmo-arquivo]] e
[[medir-gatilho-de-campanha-e-onde-fecha]].
