---
name: mutante-que-morre-em-dois-lugares
description: Mutante que um gate CONGELADO também mataria não prova poder do gate novo — parta a alínea pela cobertura e dê à metade descoberta um carrasco próprio
metadata:
  type: feedback
---

Quando a alínea tem **duas metades** (dois escopos, duas superfícies), meça
**para cada metade** se algum gate congelado já a cobre. A metade coberta ganha um
mutante que morre em dois lugares — **prova fraca**, porque o verde do gate novo
não demonstra poder próprio. A metade descoberta é a que precisa de carrasco, e é
justamente a que costuma ficar sem nenhum.

**Why:** `D015-TIT1(g)` exigia unicidade do título na **tela** e no **papel**. Eu
armei `M17` na tela e dei a alínea por coberta. O `product-owner` tirou a
consequência que eu não tirei: `N40` exige unicidade por igualdade trimada **no
mesmo escopo `#app`**, logo mataria `M17` também — enquanto a metade-papel **não
tinha carrasco algum**, porque `N41` tem escopo `#pr-journey` (irmão de
`#pr-support`, zero `<h3>` dentro, casa `<h2>` por regex) e o relatório impresso é
filho de `body`, fora do `#app` que `N40` varre. Sem `M19` — duplicar no papel o
título de outra seção — a metade-papel entraria na família "gate verde que não
pode reprovar" **pela porta da frente, com mutante declarado e tudo**.

**How to apply:** para cada metade, rode o cenário do gate congelado candidato e
**confirme por execução** que ele alcança (ou não) o sujeito — "N41 cobre o papel"
é o tipo de alegação que só o `git`/o runtime respondem. Nomeie as metades nas
**mensagens de falha** (`(g) metade TELA` / `(g) metade PAPEL`): sem isso o kill
do mutante novo é indistinguível do antigo na saída. E deixe a fraqueza **escrita**
no gate — mutante fraco que fica sem etiqueta vira, na revisão seguinte, prova de
que a alínea está coberta.

**Forma do mutante importa: DUPLIQUE, não renomeie.** `M19` renomeando o `<h3>`
de outra seção encurtava `#pr-support` em 14 chars e derrubava `D015-NOSUB1(d)`
junto — kill incidental num gate alheio. Duplicando, o papel passa a ter o título
duas vezes (a propriedade que `(g)` mede) e o comprimento só cresce: o mutante
isola.

Família de [[mutante-preemptado-pelo-julgador-de-estado]] e
[[cenario-sem-mutante-e-cenario-nao-medido]].

**CORREÇÃO MEDIDA (2026-09-01) — a tese vale, o exemplo estava errado.** Eu
escrevi acima que `N40` "mataria `M17` também, no mesmo escopo". **Falso, e a
razão importa mais que o erro:** o cenário de `N40`
(`tests_journey_m45.js:220-224`) é **legado** — `isLegacyModeV32()` verdadeiro,
`#v32prio` não nasce —, então `N40` não enxerga aquele eyebrow **em forma
nenhuma**. Sob as duas formas de `M17`, `journey` fechou 31/0.

Eu deduzi a cobertura pelo **escopo do seletor** (`#app .eyebrow, #app h3` contém
o nó) e esqueci a **fixture**: seletor que alcança o sujeito não serve de nada se
o estado do gate nunca produz o sujeito. Cobertura é escopo **∩** estado.

Consequência boa: as duas metades de `(g)` eram obrigação do gate novo, sem
cobertura congelada — o que **reforça** a conclusão que motivou `M19` em vez de
enfraquecê-la. Consequência de método: antes de rotular um mutante de "prova
fraca porque o gate congelado Y também mata", **rode Y sob a mutação**. Custa uma
execução e evita arquivar como redundante uma alínea que é a única guarda.

**PROPAGAR A REFUTAÇÃO É PARTE DA REFUTAÇÃO (2026-09-01).** Corrigir a spec e o
par do mutante não fechou o assunto: a frase refutada continuou **viva** em três
lugares. O `doc-writer` achou a nota do par vizinho (`D015-M19`), que dizia o
oposto do par `D015-M17` **no mesmo arquivo** — registro que apodrece dentro de
si mesmo é pior que registro ausente, porque quem lê um par conclui o contrário
de quem lê o outro. E um `grep` atrás disso achou a pior de todas: o **comentário
do próprio gate**, que é onde o próximo leitor olha primeiro.

**How to apply:** ao refutar, faça o censo por **string**, não por memória:
`grep` da frase (e de duas variantes suas) em registros, specs, relatório,
harness e **no gate**. Cada ocorrência recebe uma decisão explícita — riscar com
a razão (R2 §5) ou reescrever —, e o critério é se aquele texto **afirma** a
frase ou apenas a **cita para refutá-la**. Só depois se declara a correção feita.
