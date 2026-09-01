---
name: vacuidade-com-folga-no-limiar
description: Antes de declarar uma vacuidade "não fechável por fixture", meça a FOLGA do limiar do gate — mudar o estado costuma caber sem virar o veredito
metadata:
  type: feedback
---

Ao registrar uma vacuidade como impossível de fechar, o argumento quase sempre
tem a forma "mexer no estado para criar o caso destruiria o cenário". **Meça a
folga antes de acreditar nisso.**

Medido na 010 (2026-08-30). A T002 registrou: "não é falta de fixture:
acrescentar alvo em S2 a este vetor exigiria mudar o vetor, e um vetor com
suficiência ABERTA deixa de ser o cenário de gate fechado que C9 mede". Falso. O
limiar era `confirmedCount() >= 10`; a fixture tinha **4**. Acrescentar uma
resposta levava a 5 — o estado necessário nascia e o gate continuava fechado com
folga de cinco respostas. A vacuidade era fechável desde o primeiro dia, e a
frase quase a tornou permanente.

O custo total do acréscimo também se mede, e cabe num parágrafo: uma capability
mudou de apresentação (`card` → `base`), as outras onze saíram idênticas campo a
campo, zero cards novos, predicado de substituto intacto, censo de títulos
congelados intacto. Envelope previsto pelo `tech-lead`, conferido por execução —
e é essa conferência, não a previsão, que autoriza a emenda.

**Why:** vacuidade registrada como "não fechável" sai do radar e ninguém tenta de
novo; ela vira dívida permanente com aparência de decisão. O registro é caro
justamente porque é acreditado.

**How to apply:** toda entrada de vacuidade cujo motivo seja "mudaria o cenário"
tem de trazer o **número**: qual é o limiar, qual é o valor atual, quanta folga
existe. Se a folga couber, a vacuidade é fechável e o registro está errado. E
quando ela cair, **risque e refute a afirmação anterior no lugar onde ela vivia**
— nunca apague: foi ela que quase custou a medição. Ver
[[cenario-sem-mutante-e-cenario-nao-medido]] para a mesma pergunta feita do lado
do gate, e [[defeito-de-mecanismo-x-clausula-nova]] para quando a divergência
justifica escalar em vez de emendar.
