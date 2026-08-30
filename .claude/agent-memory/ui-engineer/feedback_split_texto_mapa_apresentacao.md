---
name: feedback-split-texto-mapa-apresentacao
description: Antes de partir um parágrafo em <span> (marcação por domínio etc.), conferir que nenhuma origem de P52_COPY contém o termo marcado — o mapa de apresentação roda por NÓ DE TEXTO
metadata:
  type: feedback
---

Ao introduzir marcação inline que **parte um texto renderizado em vários nós**
(`<span class="jn-dom">`, badges, realces), confira antes que nenhuma string de
ORIGEM do mapa de apresentação (`P52_COPY`, em `ui_p52_workspace_v32.js`) contenha
o termo que você vai envolver.

**Why:** `p52Copy()` percorre `TreeWalker(SHOW_TEXT)` e substitui **nó de texto por
nó de texto**. Uma substituição cuja origem atravesse a fronteira do `<span>` deixa
de casar no DOM, enquanto o oráculo (`copyMap()` aplicado à string inteira) continua
casando — e o gate byte-a-byte de texto (`D009-DOM2`) acusa divergência de posição
sem que nada esteja visivelmente errado. Na 009 isso passou porque nenhum
`DOMS[i].pt` ("Negócio", "Pessoas", "Processos", "Tecnologia", "Serviços") aparece
dentro de origem alguma de `P52_COPY`, e nenhum rótulo de `QS[].lbl` também — foi
sorte verificada, não garantia estrutural.

**How to apply:** o par a checar é sempre (termo que vira `<span>`) × (coluna 0 de
`P52_COPY`) e, de quebra, o guarda de gatilho `/[Mm]andato|charter|—/`: um fragmento
que fique só com o travessão perde o gatilho e não é reescrito. Se houver colisão,
a marcação tem de acontecer **depois** do mapa de apresentação, não antes — o que na
prática significa decorar o DOM, não montar string. Ver
[[project-009-suites-paralelas]] e [[feedback-css-regua-estreitar]].
