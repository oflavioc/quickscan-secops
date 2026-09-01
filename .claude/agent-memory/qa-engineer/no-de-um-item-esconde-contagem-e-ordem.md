---
name: no-de-um-item-esconde-contagem-e-ordem
description: Alínea que afirma "os itens são exatamente X, na ordem do catálogo" é cega quando toda fixture rende nós de UM item — a degenerescência é de FORMA, não de tamanho do universo
metadata:
  type: feedback
---

Alínea que promete **contagem** e **ordem** precisa de um caso com **2+ itens no
mesmo nó**. Se todas as fixtures rendem nós de um item só, ela está verde por
forma degenerada: "sumiu um item" é indistinguível de "o nó não nasceu", e
"ordem violada" não tem como acontecer.

Medido na 010 (2026-08-30). `D010-CARD1` (a) — "itens = `MAP[qid].lv[atual].c`,
na ordem do catálogo" — rodava só sob `D010-F1`, onde os quatro qids têm **um**
item cada. Três mutantes simulados no DOM sobreviviam a **toda** a suíte:

- item do `MAP` descartado em silêncio — e `D010-CARD4` (b), que audita
  identidade, só sabe julgar item **renderizado**: item que não existe não é
  auditado por ninguém;
- ordem do catálogo invertida — sem 2 itens não há o que inverter;
- rótulo trocado no único item sem equivalência do produto, que vivia num qid
  fora de qualquer fixture.

Estender (a)/(b) à fixture com nós de 2 itens matou os três. A pré-condição de
não-vacuidade da extensão é explícita e falha alto: *"nenhum nó com 2+ itens
esperados — a ORDEM não é mensurável em fixture alguma"*.

**Duas armadilhas da extensão**, as duas medidas:

- **regra vizinha ratificada muda o esperado.** Na fixture nova, um item do
  catálogo é removido por FUSÃO (critério E9/C10-c1). Comparar contra o catálogo
  cru reprovaria o produto CORRETO por cumprir outro critério. O esperado vira
  "catálogo menos fundidos", com as duas fontes lidas **fora do módulo sob
  teste** (payload do engine `frozen` + tabela servida por `__DEV`), e o
  julgamento da fusão continua com quem é dono dele;
- **checar o mesmo campo em dois gates costuma ser nome, não poder.** Pinar o
  `data-eid` também nesta alínea foi recusado por subsunção: a fixture que o
  outro gate varre contém **todas as formas de item** da primeira, então nenhum
  mutante de código morre aqui e sobrevive lá.

**Why:** [[universo-de-tamanho-um]] cense o universo pelo **tamanho**; este cega
por **forma**. O universo de (a) tinha 4 qids — nada pequeno — e ainda assim não
sabia reprovar contagem nem ordem. Contar casos não basta: é preciso perguntar
qual é a menor estrutura em que a asserção pode falhar.

**How to apply:** ao herdar ou revisar alínea que fala em "exatamente", "na
ordem", "sem sobra nem falta", pergunte qual fixture tem a **forma** que a torna
falseável (2+ itens, 2+ nós, 2+ chaves) e imprima o censo dessa forma como nota.
Se nenhuma tiver, a alínea é decorativa — ver
[[cenario-sem-mutante-e-cenario-nao-medido]]. Ao classificar os sobreviventes
resultantes, passe por [[sobrevivente-por-lacuna-x-equivalente-por-spec]].
