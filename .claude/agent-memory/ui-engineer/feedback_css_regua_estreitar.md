---
name: feedback-css-regua-estreitar
description: Em gates que leem o CSS-fonte (régua de 78ch etc.), tirar um nó de uma regra = estreitar o seletor existente; override posterior é proibido
metadata:
  type: feedback
---

Para tirar um nó do alcance de uma regra de CSS nas camadas do QuickScan, **estreite o
seletor existente** (`:not(.x)`) em vez de escrever uma regra posterior que anule a
declaração (`max-width: none`, `all: unset`, etc.).

**Why:** os gates de legibilidade não fazem cascata — jsdom não resolve `getComputedStyle`
de folha injetada. O oráculo lê o **arquivo-fonte**, extrai os seletores cujas declarações
casam um padrão (ex.: `max-width` em `ch`) e aplica cada um ao nó real com
`Element.matches`. Duas declarações contraditórias vivas deixam o seletor antigo casando →
o gate reprova mesmo com o efeito visual correto. Ver `D009-LEG1` em `tests_009_leitura.js`
e o critério C15 da demanda 009.

**How to apply:** vale para qualquer regra medida por leitura de fonte, não só a régua de
78ch. Dois corolários: (a) a alteração precisa permanecer dentro do mesmo `@media screen`
da camada — sair dele leva a restrição ao papel e o gate acusa "regra de régua fora do
@media screen"; (b) o gate costuma exigir um controle positivo (um irmão que continua
casando), então nunca resolva removendo o seletor inteiro. Ver [[project-009-suites-paralelas]].
