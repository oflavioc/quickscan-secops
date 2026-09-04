---
name: guarda-de-vacuidade-preempta-a-alinea
description: Mutante que ESVAZIA o sujeito de uma alínea faz a guarda de não-vacuidade disparar antes dela — o gate reprova, mas nunca pela asserção que a spec lhe atribui, e alargar o `reason` petrifica a atribuição errada
metadata:
  type: feedback
---

Quando a mutação **remove o sujeito** da alínea em vez de corromper o sujeito, a
guarda de não-vacuidade dispara **antes** do laço que faria a asserção. O gate
vai a vermelho — a propriedade está guardada —, mas a razão emitida é
"vacuidade", nunca a alínea que a spec nomeia no par gate↔mutante.

Medido na 010 T021 (2026-08-30). `D010-M19` (deduplicar pelo DOMÍNIO da tabela)
deveria morrer em C10 (c2), a alínea que diz "o homônimo não anexado SOBREVIVE".
Os **dois** homônimos daquele card têm equivalente declarado, então a mutação
esvazia o nó inteiro; o produto deixa de publicá-lo (`if (!items.length) return
""`), e a guarda `if (!card.engine.length || !card.aValidar.length) vac(...)`
reprova antes do laço por par. Na linha real (913 chars) não aparecem nem `(c2)`
nem `FortiGuard MDR`. O harness classificou SOBREVIVENTE por
"reprovou por motivo diferente do esperado" — corretamente.

**A tentação é alargar o `reason` para casar a mensagem de vacuidade.** Não faça:
isso torna o par verde e **petrifica na matriz uma atribuição que a medição
contradiz**. Quem decide a direção — corrigir a atribuição da spec, ou fortalecer
a alínea para nomear o item perdido — é R10 §1, e é do PO/coordenador.

**Como distinguir de regex genuinamente estreita:** leia a linha **inteira** do
gate, não o relato do harness — o `emitir()` trunca em ~220 chars e o começo da
linha traz a razão que disparou primeiro, que quase nunca é a esperada. Se a
assinatura da alínea não estiver em lugar nenhum da linha completa, não é a regex:
é a alínea que não rodou. Simular a saída do mutante no DOM devolve a linha
inteira de graça, sem mutar produto.

**Why:** é [[red-nao-testemunha-conte-alineas]] aplicado ao veredito de um
mutante: a soma (gate vermelho) não distingue a parcela (qual alínea). E é o
espelho de [[cenario-sem-mutante-e-cenario-nao-medido]] — aqui a alínea existe e
tem mutante declarado, mas o mutante nunca a alcança.

**How to apply:** ao escrever o par, pergunte se a mutação **corrompe** ou
**apaga** o sujeito. Se apaga, a alínea atribuída provavelmente não vai rodar, e
o par precisa ou de outro mutante (que corrompa) ou de outra alínea (que meça a
perda pelo nome). Decidir isso antes da campanha é barato; depois vira achado.

**A terceira saida, que foi a escolhida (010, 2026-08-30).** Nem alargar o
`reason`, nem corrigir a atribuicao da spec: **o gate passa a nomear o que
sumiu, antes de ceder a vacuidade**. A condicao e precisa — no VAZIO **e**
conjunto esperado NAO vazio (esperado = catalogo do nivel atual menos a fusao
legitima, lido de fonte `frozen`) — e o veredito nao muda: continua FAIL, muda a
RAZAO, que passa a ser re-atribuivel ao criterio. Corrigir a spec teria
ENFRAQUECIDO o gate, porque a guarda de vacuidade dispara igual para qualquer
mutacao que esvazie o no, e a alinea deixaria de distinguir "o no esvaziou" de
"o item X sumiu".

**A bateria que prova que a emenda nao engoliu a vacuidade legitima e o CONTROLE
INVERTIDO:** sabote a OUTRA fonte (no caso, os chips do engine) deixando o no
intacto — ali a resposta certa continua sendo VACUIDADE, e se virar a mensagem
nova a emenda foi longe demais. Sem esse caso, "o gate agora nomeia" e
indistinguivel de "o gate parou de reconhecer vacuidade".

**E cheque subsuncao com a mensagem, nao com o veredito:** outro gate ja
reprovava sob o mesmo mutante, mas parava numa fixture anterior e nunca alcancava
o card do item perdido. Veredito igual, informacao diferente.
