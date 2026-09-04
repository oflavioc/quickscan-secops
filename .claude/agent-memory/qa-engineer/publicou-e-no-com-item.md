---
name: publicou-e-no-com-item
description: alínea que só conta o NÓ fecha verde contra uma casca vazia; "publicou" tem de ser nó COM item — false green achado por sabotagem antes do commit
metadata:
  type: feedback
---

Alínea que afirma "a prática **publica** X" nunca deve se satisfazer com
`querySelectorAll(seletor).length`. Exija **item dentro do nó**. A direção negativa
("não publica") continua contando a casca vazia como violação — assimetria de
propósito.

**Why:** medido no red da 010 (T006, 2026-08-30). Sabotagem na forma de `M12`
(publicar o nó ignorando o gate) injetou um `[data-ux-enablers="a-validar"]`
**vazio** em todo cartão; `D010-CARD6` **virou PASS** — (b) achou o nó e declarou
que o órfão sumiu, (d) não achou a palavra proibida num nó sem texto. `CARD2` (b) e
`CARD3` (c) teriam caído no mesmo engano. Um mutante que emita a casca sem conteúdo
é plausível justamente porque a casca é o que se escreve primeiro.

**How to apply:** derive um helper único (`publicaItens(nos, qid)`) e use-o em toda
alínea de direção positiva e em todo **controle** de não-vacuidade — o controle é o
mais perigoso, porque é ele que decide se a alínea "mediu alguma coisa". Rode a
sabotagem da casca vazia como item fixo da bateria: ela é barata e pega uma classe
de verde falso que a leitura do código não mostra. Ver
[[bateria-negativa-que-mata-a-si-mesma]] e [[armadilha-oraculo-de-texto-copymap]].
