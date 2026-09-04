---
name: vacuidade-que-expira-no-green
description: "A guarda ali é vacuosa" quase sempre é uma propriedade do PRÉ-FIX — meça o censo que ela protege no pós-fix antes de aceitar a dispensa, e cabeie a guarda antes do green
metadata:
  type: feedback
---

Ao triar cobertura faltante, o argumento "não vale cabear ali, o censo é zero e a
guarda ficaria vacuosa" tem de ser datado. **Zero hoje** é medida do pré-fix; a
pergunta é qual é o censo **depois** da implementação.

Caso da 010 (2026-08-30): a guarda de agrupamento não rodava sob `D010-F1`,
`F1b` e `F3`, e o parecer inicial dispensou F1/F1b por censo zero de chip. Mas o
item que T008 publica **é** `.ux-tgt-enabler` — logo é no green que aquele render
passa a ter chip, e `D010-CARD6` (b) é justamente uma asserção de AUSÊNCIA por
qid (`cartao(d,qid).engine.length === 0`). Provado por sabotagem: com o pós-fix
simulado e uma `.ux-tgt-en` emitida FORA do `li[data-qid]`, o juiz de HEAD
**passa** com R-1 violada na tela. A guarda não era supérflua ali; era a única
coisa entre a alínea e um verde falso.

Critério que ficou:

- **asserção de ausência por chave exige guarda de totalidade na MESMA fixture**
  (total do documento × soma por chave). Guarda que roda em outra fixture não
  protege esta;
- guarda cabeada **depois** do green é indistinguível de guarda que sempre esteve
  lá — é a mesma razão pela qual o red é commitado (R3 §4);
- dispensa legítima existe e se ESCREVE: sob `D010-F1b` nenhuma alínea lê o
  cartão-alvo, então a guarda ali não protegeria asserção alguma. Não-cobertura
  declarada é R10 §2; não-cobertura por esquecimento é o achado.

**O caso inverso: guarda cujo REFERENTE envelheceu.** Na 010 T019 (2026-08-30) as
alíneas (a)/(b) de `D010-INV7` guardavam a não-vacuidade com o conjunto que
alimentava `#v32base` — que era, antes do fix, quem podia carregar a frase. Depois
que a implementação trocou N cards por UM aviso, `#v32base` passou a ter **zero**
`.v32-card` nas cinco fixtures: a guarda apontava para um conjunto que já não
podia produzir sujeito nenhum. As alíneas ainda discriminavam, e é isso que torna
o defeito difícil — a guarda dava 2 sob as duas fixturas usadas, o mesmo número do
sujeito real, por coincidência.

**O que transforma a hipótese em medição: procure a fixture onde os dois números
já divergem.** `D010-F1b` tinha guarda=4 e sujeito real=0. Com esse par na mão o
argumento deixa de ser "poderia acontecer" e vira "já acontece no acervo, só não
naquela fixture". Sem ele, o parecer é opinião.
Corrigir uma guarda dessas **não muda o veredito de hoje** — e isso tem de ser
dito, senão parece conserto de bug. O que ela remove é o verde futuro sem sujeito.
Prove que o poder discriminante sobreviveu simulando o mutante que a alínea
existe para matar (ali, `M6`): se ele deixar de morrer, a guarda nova está errada.

**Why:** é a irmã temporal de [[cenario-sem-mutante-e-cenario-nao-medido]] — lá o
cenário não mata ninguém, aqui a guarda não tem sujeito *ainda*. Nos dois casos o
verde futuro parece idêntico ao verde que sempre valeu, e é isso que a auditoria
perde.

**How to apply:** ao receber ou emitir um parecer de cobertura com "é vacuoso
ali", peça o censo pós-fix (a simulação no DOM é barata e não toca produto) antes
de aceitar. Prove com [[red-nao-testemunha-conte-alineas]].
