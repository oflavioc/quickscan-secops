---
name: escopo-p52-esvazia-a-varredura
description: sob o workspace 5.2 a varredura de hideLegacyRecommendation só alcança a Camada 1 — M3/M4 ficam sem caso e as âncoras de não-transbordo estão fora do escopo
metadata:
  type: project
---

`hideLegacyRecommendation` varre `screen.querySelector('[data-p52-legacy-scope="support"]') || screen`.
Sob o workspace 5.2 — que é o que as fixtures da 010 alcançam em jsdom — esse escopo
contém **só** a Camada 1: um `H2.p52-sec-title` inicial e os títulos/blocos
congelados. Medido em `D010-F1/F2/F3` (T006, 2026-08-30).

**Why:** consequências que decidem a matriz gate↔mutante da 010:

- **`M4` (acrescentar `banner-ok` aos permitidos) não tem caso**: não existe
  `.banner-ok` no escopo, em nenhuma profundidade, nas três fixturas — sob o vetor
  do vão `prioSev2` nunca fica vazio;
- **`M3` (remover a interrupção `hiding=false` de `ui_v32.js:193`) não tem caso**:
  o único nó não-permitido do escopo é o `H2` inicial, que vem **antes** de qualquer
  título; depois dele só há títulos (que já resetam `hiding`) e nós permitidos.
  Sabotagem aplicada: nenhum gate mudou de veredito;
- as quatro âncoras de não-transbordo de `C3` (b) — `#review`, `#restart`,
  "Capabilities a validar", `<details>` "demais gaps altos" — estão **fora** do
  escopo varrido (0/3 em F1 e F2; 1/3 em F3, onde o título "Capabilities a validar"
  entra). `D010-ARB3` (b) é, portanto, **guarda de alcance**: só falha se a
  varredura voltar a alcançar a tela inteira.

Quem tem poder discriminante sobre a varredura é a cláusula **tudo-ou-nada** de
`D010-ARB3` (a): sabotar `toggle("v32-hidden", hide)` para `false` produz
"arbitragem parcial — 1 ocultos de 3" e mata.

**How to apply:** em T019/T021 não registre `M3`/`M4` como pares comuns — ou o
cenário muda (fixture que ponha `banner-ok` ou um nó não-permitido depois de um
título dentro do escopo), ou eles entram como **dívida declarada** com este
motivo. `D010-ARB3` (b) imprime o alcance a cada execução, para que ninguém leia o
verde como cobertura. Ver [[cenario-sem-mutante-e-cenario-nao-medido]] e
[[clausula-inerte-e-a-sonda-de-variantes]].
