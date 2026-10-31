---
name: observacao-sem-id-nunca
description: Ramo/alínea sem carrasco nunca vira "observação sem id" num relatório de red — ou ganha mutante com id (errata de W0, antes do red) ou vira dívida declarada com a razão da inalcançabilidade; e o estado que alimenta o mutante define-se pelo valor de retorno do instrumento, medido em cópia
metadata:
  type: feedback
---

**Nunca proponha "observação sem id em `red-017.md`" para uma alínea que nenhum
mutante cobre.** As duas saídas aceitas são: (a) errata da spec **na W0, antes
do red**, com o próximo id da série (`D0NN-M<n+1>`), disciplina igual à dos
outros — o que o mutante faz, contra qual alínea, como se prova que morre; ou
(b) se ao escrevê-lo a alcançabilidade der **negativo**, cláusula defensiva
declarada com a razão demonstrada (padrão `design-decisions.md` §Candidatas /
015 E2). Par vazio na coluna de mutantes é pior que dívida com razão.

**Why:** recusa do orquestrador na W0 da 017 (2026-09-06), com razão do
repositório: `EA-28`, `EA-30` e `EA-42` são três achados abertos cujo conteúdo
inteiro é "prova que viveu só num relatório evaporou" — observação sem id tem
exatamente essa forma. Custa uma linha antes do red; depois custa errata +
explicação.

**How to apply:** no `tasks.md` §Vácuos, quando encontrar ramo de **fiação**
(decisão do laço, invisível à sonda pura — ex.: `[NOTA]` de preflight fracassado
× `[DÍVIDA]` do `core`, distinguidos só pela pertença a `IC_SEM_PREFLIGHT`),
proponha diretamente o id e a errata de W0; o mutante de fiação morre em cópia
sob um **estado** produzido no harness (par estado × mutante, precedente
`M-IC19`/`D017-M17`), entra em `dividas_declaradas` (família fiação, credor
`EA-42`) e **não** move o total pinado da sonda. Defina o estado pelo **valor de
retorno do instrumento** (ex.: "`ic_preflight` devolve `None`"), não pelo
sintoma ("`--preflight` saindo 1") — na 017, exit 1 com JSON válido mantinha os
dados e não alcançava o ramo; só stdout vazio alcançava. Prove em clone efêmero
com `origin/develop` pinado no HEAD do clone (nenhuma campanha dispara) antes de
escrever a errata. Ver [[vacuidade-medida-antes-do-gate-nascer]],
[[erratas-de-spec-forma-e-precedente]] e
[[r3-gate-e-implementacao-no-mesmo-arquivo]].

**Depois da errata, o `tasks.md` é consolidado — nunca "o prompt leva a spec".**
Na W0 da 017 ofereci a alternativa sem edição ("R3 §3: o prompt de T010 leva
`spec §Erratas`") e o orquestrador recusou: `tasks.md` dizendo "observação sem id"
enquanto a spec diz `D017-M19` é registro contra execução (família `EA-31`) dentro
da demanda que existe para instrumentar isso. Consolide todos os pontos que a
errata lista (tarefa, §Vácuos, matriz de dívidas, relatório final, §Estado do
mundo, §Medível), riscando com a razão (R2 §5) o enunciado antigo quando ele é
citado pela spec — e leve junto a correção de fato que a medição revelou.
Ver [[prova-mecanica-testada-contra-negativo]].
