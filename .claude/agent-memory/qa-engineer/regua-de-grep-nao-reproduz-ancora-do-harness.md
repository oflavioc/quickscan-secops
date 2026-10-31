---
name: regua-de-grep-nao-reproduz-ancora-do-harness
description: Régua "grep -c = 1" de um tasks.md mediu 2 porque a âncora real do harness alheio é um `find` MULTI-LINHA (função + if); quem prova unicidade de âncora é o `--preflight` do harness, não um grep de linha única — declare a régua errada, não ajuste nada
metadata:
  type: feedback
---

Regra: a unicidade de uma âncora de mutante alheio se mede com o instrumento do dono
(`node tests_0NN_mutants.js --preflight`, `ocorrencias == 1`), nunca com um `grep -c`
de linha única copiado de um plano/tasks. Se a régua de prosa e o preflight divergirem,
registre os dois números e declare a régua como "número do artefato", sem tocar gate.

**Why:** na W1 da 025 (2026-10-27) o tasks.md T010/T060 fixava
`grep -c "  if (draft !== null){" ui_v32.js` = 1 como "âncora de
`tests_p52_mutants.js:1172`". Medido: **2** (`:1587` em `preparePrint`, `:1626` em
`safePrint`). A âncora real do p52 (`V322-M11`) é o par de linhas
`function safePrint(){` + `  if (draft !== null){` — e o preflight do p52 dava 108/108 `ok`.
A régua estava mal medida pelo TL; o produto estava certo. Ajustar a régua para "2" sem
dizer por quê, ou pedir ao implementador que "não repita a forma", seria copiar o erro.

**How to apply:** em qualquer T0xx "medir antes" com `grep -c` sobre âncora alheia, rode
também o `--preflight` do harness dono e compare; quando um `find` do harness tem mais de
uma linha, o grep de UMA linha não o reproduz — leia o `find` inteiro no arquivo do
harness antes de aceitar a régua. Registre no red-NNN.md como divergência de medição
(classe "número do tasks.md"), nunca como achado do produto.
