---
name: armadilha-oraculo-de-texto-copymap
description: Todo oráculo de TEXTO de tela neste repo tem de aplicar __P52.copyMap(); sem isso as asserções NEGATIVAS viram PASS vacuoso
metadata:
  type: project
---

A camada 5.2 reescreve nós de texto da TELA por um mapa de apresentação
(`p52Copy`, exposto em `window.__P52.copyMap()`). O caso que morde:
`"Mandato e objetivos"` chega ao leitor como `"Direcionamento e objetivos"`.
`buildPrintReport().html` medido em host destacado **ainda não passou** pelo
mapa — só o rito de impressão o aplica.

**Why:** em 2026-08-28, na fase red da demanda 009, três gates
(`D009-UNS1/UNS3/UNS4`) procuravam o rótulo canônico da prática dentro do texto
do aviso para afirmar que ele **não** estava lá. Como o rótulo cru nunca casa na
tela, as três asserções negativas passariam em silêncio — vacuosas, que é pior
que gate ausente. O mesmo mapa também fez `D009-DOM2` falhar por motivo alheio
à demanda (comparação byte a byte de `.jn-narrative` com `paragraphs`).

**How to apply:** ao escrever qualquer gate que compare string canônica com
`textContent` de tela, aplique o mapa lendo `__P52.copyMap()` e reimplementando
o loop de substituição no próprio gate (nunca chamando `applyCopy` do módulo sob
teste — o precedente público é o mesmo que a spec da 009 cita em C8). Lado
PAPEL: compare com a string crua. Vale tanto para asserções positivas quanto —
principalmente — para as negativas. Ver [[trilha-e-ambiente-quickscan]].

**Reincidência (011, 2026-08-31)**: `D011-ACC1` comparou `QS[k].lbl` cru com o
texto do botão e nasceu **constante vermelho**. Nenhuma execução do red o teria
denunciado — quem pegou foi o cenário de CONTROLE da bateria negativa
([[controle-verde-na-bateria-negativa]]). A pergunta a fazer antes de rodar
qualquer gate de texto de tela: *já apliquei o `copyMap()`?*
