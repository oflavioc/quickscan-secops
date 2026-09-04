---
name: enumerar-por-nome-deixa-o-terceiro-estado
description: Gate que assere sobre os estados NOMEADOS herda o ponto cego do seletor que enumera — a cura é a varredura de fechamento sobre o conjunto completo
metadata:
  type: feedback
---

Quando um artefato distingue N estados, asserção escrita estado a estado mede
N−1 e não avisa. Toda alínea que cite um valor de marcador precisa vir com uma
**varredura de fechamento**: *todo nó do conjunto ou está no caso permitido, ou
satisfaz a regra* — sem nomear os casos.

**Why:** na 011 (2026-08-31) `data-d011` tem três valores (`atalho`, `estado`,
`mudo`). A regra de print casava só `atalho`; a justificativa escrita ao lado
dela dizia "preservar o estado de seleção no papel" — o que exige excluir
`estado` e **não** exige excluir `mudo`. O terceiro estado caiu fora por o
seletor ter sido escrito **pela positiva**. E `visibility:hidden` apaga o
elemento inteiro, inclusive a borda herdada: "não escondido" não era "sem
efeito", era **moldura vazia impressa** — justo nos 6 itens que o cliente
apontou, e a legenda que os explicaria some por desenho. Meu gate tinha o mesmo
ponto cego: as alíneas (c) e (e) nomeavam `atalho` e `estado` e nunca
perguntavam pelo terceiro. Quem pegou foi o `product-owner`, lendo — não o
gate.

**How to apply:** (1) antes de escrever alínea sobre marcador, **cense os
valores** que o artefato produz na fixture (`querySelectorAll` + agrupamento) e
confirme que a soma bate com o total; (2) derive os nós do **oráculo**, não do
atributo — módulo que parasse de marcar escaparia da asserção por atributo;
(3) feche com a varredura anônima, que também pega um QUARTO valor que ninguém
previu; (4) prove com **controle inverso** que as alíneas são independentes —
na 011, seletor largo demais reprova em (e) e estreito demais reprova em (f),
e é isso que mostra que nenhuma subsume a outra. Relacionado:
[[cenario-sem-mutante-e-cenario-nao-medido]] e [[universo-de-tamanho-um]].
