---
name: mutante-preemptado-pelo-julgador-de-estado
description: Mutante que perturba um campo DECLARADO pelo assert de fixture reprova os gates todos pelo assert, não pela alínea — e o censo de não-vacuidade que só conta quando a comparação bate faz o mesmo estrago
metadata:
  type: feedback
---

Dois instrumentos da própria suíte roubam o kill do mutante, e os dois só
aparecem se você **rodar a bateria negativa gate a gate**:

**1. O assert de estado da fixture.** Ele roda dentro do censo, logo antes de
julgar. Mutante que mexe em campo que a fixture DECLARA (`gapSupportQids`,
`ramos`, presença de nó) faz o assert lançar primeiro — e como todo gate passa
pelo censo, os **cinco** falham juntos. Veredito vermelho, atribuição errada,
matriz poluída com kills falsos.

**2. O censo de não-vacuidade contado do lado errado.** Se a alínea (e) só
registra "medi este conjunto" **quando a comparação bateu**, ela confunde
*conjunto vazio* com *conjunto divergente*: sob qualquer remoção real, (e) fecha
vermelha por vacuidade e **mascara** a alínea que de fato reprova.

**Why:** medido na Fase 4 da 015 (2026-08-31). `M15` na forma ingênua (anular o
bloco do qid) foi morto pelo assert da fixture — os cinco gates caíram. E o
`(e)` de `D015-NOSUB1`, escrito com `else if`, disparava "conjunto vazio em TODOS
os estados" exatamente quando havia remoção. Os dois defeitos são invisíveis no
red (tudo já é vermelho) e invisíveis no green (nada foi removido): só a bateria
com mutante os revela.

**How to apply:** escreva o mutante na **forma isolante** — que remove o que o
critério proíbe **preservando tudo que a fixture declara**. Para "nada é
removido", suprimir as opções listadas isola; anular o nó inteiro não. E tire o
censo de não-vacuidade **do lado da âncora**, incondicional à comparação: a
pergunta de (e) é "havia o que medir?", não "bateu?". Confirme rodando a suíte
**inteira** sob o mutante: se mais de um gate cair, ainda há pré-empção.

Terceiro achado do mesmo passe: `M15` isolante mata `(b)` mas **não** `(d)` —
numa entrega aditiva o nó novo compensa o texto perdido e o comprimento não
diminui. `(d)` só tem carrasco com remoção grande o bastante para saldo negativo
(provado: suprimir as opções dos quatro qids derruba `#pr-findings` em ~1.100
chars). Par gate↔mutante se confere com o **número**, não com a intenção.

Família de [[guarda-de-vacuidade-preempta-a-alinea]] e
[[fixture-que-pina-o-pre-fix]]; o instrumento que revela é
[[controle-verde-na-bateria-negativa]].

**O estado isolante precisa de um SOBREVIVENTE.** Não basta criar a fixture que
dá caso ao mutante: se o sujeito que ele remove for o **único** daquele conjunto,
o nó pai deixa de ser emitido e a fixture volta a reprovar pelo assert. Medido na
015 (2026-08-31): `E8` nasceu com a capability de card neutro **sozinha** em
`prioCaps`; `M14` a removeu, `#v32prio` sumiu inteiro, o assert (que declara
`v32prio: true`) disparou e os **cinco** gates caíram. Acrescentar uma segunda
prioridade que sobrevive ao mutante devolveu o kill a `NOSUB1(a)`, com o bloco
existindo e apenas o **conjunto** encolhendo — que é o que a alínea mede.

Regra prática: o estado que dá caso a um mutante de remoção precisa de **pelo
menos um item que o mutante não remove**. Sem isso, "remover um" vira "remover
tudo", e a alínea que mede subtração parcial nunca é exercida.
