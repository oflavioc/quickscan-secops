---
name: universo-de-tamanho-um
description: Como julgar alínea PROPOSTA — cense o universo em que ela pode falhar e compare com o da alínea que já existe; universo de tamanho 1 e coincidente = alínea que não nasce
metadata:
  type: feedback
---

Antes de aceitar alínea nova num gate, **meça o universo em que ela pode falhar**
e compare, elemento a elemento, com o universo da alínea que já está lá. Alínea
cujo universo é do mesmo tamanho e composto pelos **mesmos** elementos não
acrescenta poder discriminante — acrescenta um nome.

**Why:** na 010, propuseram (d) para `D010-CARD2` ("nenhum card traz ao mesmo
tempo chip de CANDIDATO do engine e nó `a-validar`"). O universo de (d) — cards
com chip de origem candidato — foi medido nas 5 fixtures: **1 elemento,
`D010-F2/logs`**. O universo de (a) — capability com candidato do engine — é
**o mesmo 1 elemento**. Pior: (d) exige as DUAS coisas (chip *e* nó), então um
mutante que publicasse o nó em `logs` **suprimindo** os chips passaria por (d) e
morreria em (a). (d) não era só subsumida: era **estritamente mais fraca** sobre
o mesmo caso. A propriedade foi para a errata; a alínea não nasceu.

**How to apply:** o teste de subsunção tem três perguntas, nesta ordem —
(1) qual é o conjunto de casos em que a alínea nova pode dar vermelho? conte-o;
(2) esse conjunto é diferente do da alínea existente? se for igual, siga para (3);
(3) existe mutante que a nova mata e a existente não? Se a nova pede uma
**conjunção** onde a existente pede um termo só, a resposta costuma ser o
contrário — a existente é mais forte. Cense sobre o PAYLOAD, não sobre o DOM,
quando o nó ainda não existe: o universo dessas alíneas é decidido pelo engine
(`frozen`), que a implementação não muda, então o censo é estável do red ao
green — é a resposta concreta ao alerta de [[vacuidade-que-expira-no-green]].
Relacionado: [[cenario-sem-mutante-e-cenario-nao-medido]],
[[clausula-inerte-e-a-sonda-de-variantes]].
