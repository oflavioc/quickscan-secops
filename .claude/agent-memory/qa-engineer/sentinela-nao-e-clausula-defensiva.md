---
name: sentinela-nao-e-clausula-defensiva
description: Alínea que não falha hoje tem DUAS classes, e confundi-las mata a alínea de abandono — "inalcançável por construção" diz não reporte; "sentinela" diz reavalie quando o gatilho nomeado disparar
metadata:
  type: feedback
---

Antes de arquivar uma alínea que nenhum estado falsifica, pergunte **se alguma
mudança poderia falsificá-la**. A resposta parte a categoria em duas, e a
diferença é operacional:

- **Cláusula defensiva inalcançável por construção** (classe registrada em
  `design-decisions.md` pela 010): **nenhuma** mudança pode torná-la falsa — só
  pode deixar o produto mais conservador. O que ela diz ao leitor é
  **NÃO REPORTE**.
- **Cláusula sentinela**: é **falsificável**, e o **gatilho tem nome**. O que ela
  diz ao leitor é **REAVALIE QUANDO O GATILHO DISPARAR**.

**Why:** na 015 (2026-08-31) eu propus arquivar `D015-TIT1(h2)` — "o nó nunca
recebe `.v32-hidden`" — como classe-da-010, porque eu havia medido que a varredura
não alcança o nó. O `product-owner` manteve a decisão e **recusou a etiqueta**: o
gatilho existe e tem nome — mudar o escopo de varredura de
`hideLegacyRecommendation` —, e **já disparou uma vez**, quando a 5.2 moveu o
escopo de `section.screen` para a seção de apoio. Arquivar como "não reporte"
faria a alínea morrer de abandono exatamente no dia em que ela voltasse a medir.

**How to apply:** ao declarar alínea sem mutante, escreva a classe **e**, se for
sentinela, o gatilho em uma linha — na matriz e no corpo do gate. Se as duas
classes coexistirem na mesma demanda (na 015, `(h2)` sentinela e `GOV1(d)`
defensiva), registre o **contraste explícito** numa delas: é o que impede o
próximo leitor de reunificá-las por descuido. E note que o gatilho da sentinela
costuma ser desarmado por *outra* alínea, no fonte — em `(h2)` quem desarma é
`(h1)`, a pertinência à lista, e é ela que tem carrasco.

Parente de [[escopo-do-varredor-torna-clausula-inerte]] (que explica *por que*
`(h2)` não falha hoje) e de [[clausula-inerte-e-a-sonda-de-variantes]].
