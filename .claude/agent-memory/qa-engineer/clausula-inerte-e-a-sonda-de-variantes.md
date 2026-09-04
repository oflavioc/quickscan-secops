---
name: clausula-inerte-e-a-sonda-de-variantes
description: Antes de aceitar que uma cláusula de predicado é load-bearing, meça o predicado COM e SEM ela nos mesmos cenários — cláusula inerte não tem mutante matável
metadata:
  type: feedback
---

O plano da 010 registrava, como aprendizado de protótipo, que a cláusula
"classificação ≠ `CONTEXT_NOT_INFORMED`" era **load-bearing**: sem ela, uma sessão
com serviços anexados por `hasGap` desligaria a Camada 1 sem substituir nada.

Sonda de variantes em T002 (2026-08-30): calculei o predicado em quatro variantes
(completo · sem a cláusula · sem a cláusula de payload · só apresentação) sobre
seis sessões. **Completo e sem-a-cláusula deram o mesmo valor nas seis** — o
resultado final (`false`) estava certo, a atribuição causal estava errada. Quem
sustenta é a cláusula de apresentação, uma camada antes. A cláusula que de fato
carrega peso era outra ("candidato/serviço/nota"), e só **uma** fixture a torna
load-bearing.

**Why:** o plano tinha medido o *valor* do predicado, não a *independência* das
cláusulas. Cláusula inerte não é inofensiva: ela não tem mutante que morra, ela
faz o revisor achar que aquele risco está coberto, e ela envelhece como se fosse
regra viva. É o mesmo defeito de [[ancora-viva-em-regra-morta]], do lado do
predicado.

**How to apply:** quando a spec descreve um predicado com N cláusulas, escreva o
oráculo como N+1 variantes e imprima a tabela cenário × variante antes de declarar
o cenário. Cláusula cuja coluna nunca difere do completo: ou se acha o cenário que
a vira, ou se registra como guarda redundante — nunca se deixa passar como
"medida". Complemento pelo lado do gate:
[[cenario-sem-mutante-e-cenario-nao-medido]].
