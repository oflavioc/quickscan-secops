---
name: ramo-morto-instrumente-antes-de-classificar
description: Ramo com zero hits quase nunca é "inalcançável" — instrumente e tente o caminho sintético; a pergunta que decide o mutante é se o OBSERVÁVEL já tem carrasco
metadata:
  type: feedback
---

Ramo de código que nenhuma fixture alcança tem **três** classes, não duas, e a
diferença decide quem paga:

1. **inalcançável, provado** — nenhum estado, nem sintético, o alcança. Ninguém tenta.
2. **falta cenário** — o produto o alcança e nenhuma fixture o exercita. Alguém paga com fixture.
3. **alcançável só pelo teste** — a fixture chega lá, o **produto não**. É a mais
   comum, é a que costuma ser classificada errado como (1), e a decisão sobre
   escrever ou não o mutante **não** sai da classe: sai da pergunta abaixo.

Na 011 (2026-08-31) o `ui-engineer` reportou dois ramos com 0 hits e leu-os como
defensivos-mortos. Instrumentando os ramos dentro do HTML construído e contando:
0 hits nas três fixtures reais **e** hits sob "mudar `ans` por `__DEV` **sem
render** + cutucão de `childList` no `#app`" — 2 hits no ramo de remoção de
atributo, 1 no de remoção da legenda, 1 num terceiro ramo que ninguém tinha
reportado. Classe (3), não (1). E um deles, medido, virou mutante de verdade
(`D011-M17`, direção **criação** do "se e somente se").

**A pergunta que decide:** *o OBSERVÁVEL que o critério pede já tem carrasco?*
Se sim, o que ficou sem mutante é o **mecanismo**, e mecanismo não é critério —
um mutante mirado só nele **sobreviveria por desenho**, então não se escreve, e
a dívida vai declarada com a medição junto. Se não, o mutante nasce.

**Why:** "inalcançável" fecha a conversa e vira licença para não medir;
"alcançável só pelo teste" mantém o fato visível e ainda separa o que tem
carrasco do que não tem. Sem instrumentar, a classificação é palpite — e três
demandas seguidas já mostraram que gate verde não é evidência de proteção.

**How to apply:** instrumente o ramo (contador dentro do artefato construído,
em cópia efêmera), rode as fixtures reais **e** o caminho sintético, e registre
os dois números na dívida. Nunca aceite "zero hits" de outro agente sem repetir
a medição — R2 §4. Ver [[cenario-sem-mutante-e-cenario-nao-medido]] e
[[clausula-inerte-e-a-sonda-de-variantes]].
