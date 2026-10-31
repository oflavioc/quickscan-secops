---
name: owner-canonico-seis-perguntas
description: Checklist de Fase 0 — todo owner canônico novo da sessão responde às seis perguntas do ciclo de vida antes do portão; a 019 omitiu e a 025 pagou
metadata:
  type: feedback
---

Todo owner canônico NOVO (chave nova em `captureCanonicalInputs`) responde, no
refinement, às **seis perguntas do ciclo de vida**: exportar · importar presente ·
importar AUSENTE · cancelar/recusar/falhar · Nova sessão · Reiniciar. Cada resposta
vira linha na tabela de casos de borda e gate que IMPORTA de verdade.

**Why:** a 019 (curadoria, sexta chave) respondeu só "exportar" e "importar
presente"; a importação ausente HERDAVA a sessão aberta (contaminação entre
clientes — EA-91/92), Nova sessão e Reiniciar não limpavam, e o "restauro" vivia
dentro do validador (olhar o arquivo já mutava). Nenhum gate importava
(`D019-INV8` usava `b.set`). A 025 inteira existiu para pagar essa omissão
(`specs/025-curadoria-transacional/refinement.md` §"Por que a 019 falhou").

**How to apply:** na Fase 0 de qualquer demanda que crie ou toque owner de estado
serializado, exigir a tabela com as seis linhas e um oráculo ENTRE JANELAS (o
mesmo documento sobre dois estados prévios distintos). Se a demanda cala sobre
uma das seis, é omissão a nomear no portão, não detalhe de implementação.
Relacionado: [[cobertura-de-mutante-por-alinea]], [[025-aceite-intencao]].
