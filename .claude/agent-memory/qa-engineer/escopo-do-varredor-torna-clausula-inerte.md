---
name: escopo-do-varredor-torna-clausula-inerte
description: Alínea do tipo "o nó nunca recebe a classe X" é inerte quando o nó está FORA do escopo de travessia de quem atribui X — meça a travessia e a ancestralidade, não a regra
metadata:
  type: feedback
---

Antes de aceitar uma alínea da forma *"o nó nunca recebe `.classe`"* como
discriminante, meça **o escopo de travessia** de quem atribui a classe contra a
**ancestralidade** do nó. Se o atribuidor varre só filhos diretos de um escopo, ou
retorna cedo num container, todo nó abaixo daquele container é **inalcançável** — e
a alínea não tem mutante matável, por mais que a regra citada pareça governá-lo.

**Why:** na Fase 4 da 015 (2026-08-31) a spec dava `C1(h)` como "discriminante
real por estado do DOM" e afirmava que `M18` (pôr o eyebrow novo em
`HIDE_EYEBROWS`) "derruba `U15` junto". Medido: o `.section-title` de `#v32prio`
vive em `#v32support` < `#v32panel`, e `hideLegacyRecommendation` varre
`scope.children` retornando em `#v32panel` — o nó **nunca** é visitado. Simulação
direta de `M18` sobre o HTML construído: zero diferença observável
(`.v32-hidden` do nó, censo de ocultos e o `noOverreach` de `U15`, todos
idênticos). A regra existe, é citável, e não alcança o sujeito.

**How to apply:** parta a alínea em duas. A metade **estática** — pertinência do
literal às listas que governam o comportamento, extraída por leitura do artefato
construído — costuma ser a que o mutante mata de fato, e aqui matou `M18` sozinha.
A metade de **runtime** fica como cláusula defensiva declarada **sem mutante**
(mesma classe de `GOV1(d)`), porque passa a ter estado alcançável no dia em que o
escopo do varredor mudar — que é exatamente quando alguém precisa saber. Não
apague: declare. E não aceite "a suíte congelada Y pega isso" sem rodar o cenário
de Y: `U15` renderiza o bloco novo e mesmo assim nunca o vê oculto.

Complementa [[clausula-inerte-e-a-sonda-de-variantes]] (lá a inércia é do
predicado; aqui é do alcance) e [[ancora-viva-em-regra-morta]].
