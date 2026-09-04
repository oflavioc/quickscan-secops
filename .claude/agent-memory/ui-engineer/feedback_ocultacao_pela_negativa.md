---
name: feedback-ocultacao-pela-negativa
description: Regra de ocultação se escreve pela NEGATIVA (o valor a preservar), nunca enumerando os positivos; e a forma do seletor se decide pelo custo de âncora de mutante, não por estética
metadata:
  type: feedback
---

Ao esconder algo (impressão, tema, estado), escreva o seletor contra **o que se
quer preservar**, não contra a lista do que se quer esconder. Se a justificativa
da regra é "preservar X", o seletor tem de excluir X — enumerar os positivos
deixa fora todo valor que ninguém lembrou de listar, e o esquecido some do
raciocínio junto com a linha.

**Why:** na 011 a regra de impressão casava só `data-d011="atalho"`, com a
justificativa escrita "preservar o estado de seleção no papel". Essa razão exige
excluir `"estado"` e não diz nada sobre `"mudo"` — os seis itens `mudo`
imprimiam. Pior: `visibility:hidden` **não remove a caixa herdada** — o
`border:1px solid var(--line)` de `.opt .key` continuou desenhando molduras
vazias no papel, exatamente nos seis itens que o cliente havia apontado, e sem a
legenda que os explicaria, porque a legenda some por desenho na mesma regra.
"O elemento sumiu" é falso quando a borda vem de outra camada. O PO reprovou, e
a pista estava no próprio comentário: a razão escrita não cobria o seletor
escrito.

**How to apply:** (a) ao escrever regra de ocultação, releia a justificativa e
confira se ela **implica** o seletor — divergência entre as duas é o defeito,
antes de qualquer medição; (b) `visibility:hidden` preserva a calha (é o que se
quer para alinhamento) mas preserva **borda e fundo** junto: para "sumir de
verdade" confira o que a camada congelada pinta no mesmo nó; (c) escolhida a
semântica, a **forma** do seletor não é estética — na 011 a forma `:not([...])`
numa linha só e a forma de duas regras passavam o mesmo gate, mas a primeira
SUBSTITUI a linha em que três mutantes ancoravam, levando-os a `ocorrencias=0`,
reprovando o `IC-4` e derrubando o stage `mutation` inteiro. Antes de reescrever
uma linha de CSS, `grep` do literal em `tests_*_mutants.js` e em
`mutation-matrix.json`: âncora preservada byte a byte é requisito, não cortesia.
Ver [[feedback-ancora-de-mutante-apodrece]] e [[feedback-css-regua-estreitar]].
