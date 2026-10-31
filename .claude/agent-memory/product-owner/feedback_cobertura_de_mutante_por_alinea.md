---
name: cobertura-de-mutante-por-alinea
description: Na Fase 6 conferir carrasco por ALÍNEA, não por gate — gate com 4 alíneas e 1 mutante deixa promessas sem prova (INV8(c) da 025)
metadata:
  type: feedback
---

No aceite de intenção, cruzar cada **alínea** do gate com o mutante que a mata —
não aceitar "o gate tem carrasco" como prova de que cada promessa do título tem
prova. Alínea sem carrasco é de regressão e precisa ser DECLARADA assim (na célula
da spec ou em `dividas_declaradas`), nunca ficar implícita sob o verde do gate.

**Why:** na 025, `D025-INV8` tem quatro alíneas; a célula "nascem vermelhos"
listava (b)(c)(d), o red mostrou só (d) vermelha (D3 do `red-025.md`), e ao cruzar
os 23 mutantes vi que (c) idempotência não tem carrasco algum — M9 (merge) e M4
(curadoria fora do candidato) sobrevivem a "importar o mesmo doc duas vezes". A
spec e o red não o notaram porque olhavam por gate. Virou errata E9 (classe (c)),
autorizada pelo usuário em 2026-10-30.

**How to apply:** na Fase 6, montar a matriz alínea × mutante antes do veredito;
alínea órfã → observação para errata classe (c) + `dividas_declaradas`; se a
alínea órfã é a ÚNICA prova de um critério, aí é reprovação (classe `EA-20`).
Relacionado: [[gate-verde-nao-e-protecao]], [[025-aceite-intencao]].
