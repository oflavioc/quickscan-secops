---
name: mutante-de-arvore-sob-censo-pinado
description: Wave 6 da 014 — sob censo pinado (E6), mutante de folha que ADICIONA mata pelo censo, não pelo veredito; a forma isolante é a troca censo-neutra; e mutante de CSS do próprio harness entra na população da varredura e não pode introduzir declaração morta
metadata:
  type: project
---

Três restrições que decidiram a forma de `D014-M4`/`D014-M7` (wave 6 da 014), medidas em 2026-09-01:

1. **Censo pinado pré-empta mutante de árvore.** Com `regra_morta.json → censo[]` conferido ANTES do veredito, QUALQUER adição/remoção de declaração numa folha real derruba `C2(cen)`/`CEN(valores)` — o kill vira "a folha mudou", nunca "há regra morta". A forma isolante é a **troca censo-neutra**: 1 regra de 1 longhand → 1 regra de 1 longhand, sem `!important`, sem `var()` importante, mesmo contexto de mídia em contagem. Só assim o kill chega em `C2(zero)` com `mortas: p51/M51-08`. É o mesmo padrão de [[guarda-de-vacuidade-preempta-a-alinea]] e [[mutante-preemptado-pelo-julgador-de-estado]], com o censo no papel do pré-emptor. Cuidado com shorthand: `border-color` conta 4 longhands no CSSOM; a troca 4→1 já diverge o censo.

2. **A população da varredura inclui o harness novo — auto-referência.** Quando `d014` declara `preflight: true`, os mutantes de CSS DELE entram na população de `D014-VARR1` e a folha mutada é avaliada EM MEMÓRIA na árvore LIMPA. Mutante cujo `find`→`repl` introduz declaração morta (a leitura literal da célula C2, "acrescenta declaração que a p52 já sobrepõe") deixa o gate **permanentemente vermelho** — e a exclusão não socorre, porque `C3(*)` pina o conjunto em 3 pares. A saída: a declaração INTRODUZIDA pelo mutante é VIVA (dominadora plantada), e quem morre é a declaração-alvo de um mutante JÁ EXISTENTE na população (M51-08). Verificar por execução antes do commit que a introduzida é viva.

3. **Contrato C1 tem UM `find` — adição no builder exige âncora contígua.** `folhasInjetadas` só vê identificador na linha de injeção que resolva via constante (`reConst`/`reVar`); uma adição de verdade precisa de constante + `open()` + identificador na linha do `replace`, e a única forma com um `find` é ancorar no trecho contíguo (última var + linha gigante do replace) e transcrever byte a byte com `String.raw`. O preflight (`ocorrencias == 1`) é o verificador da transcrição.

**Bônus de forma**: quando o runner da suíte imprime `FAIL <id>` numa linha e as alíneas nas linhas INDENTADAS seguintes, `gateLine` não discrimina alínea — use `gateBlock` (linha + bloco indentado) e pine no `reason` também a CONTAGEM (`N alínea(s) reprovada(s)`): matar pela alínea errada é sobrevivente disfarçado ([[bateria-negativa-que-mata-a-si-mesma]]).

**Como aplicar:** toda campanha futura cujos alvos incluam folha varrida por `tests_014_regra_morta.js` herda as três restrições. E `mutation_map.targets` deve conter TUDO que a campanha muta (na 014 a spec omitia `.claude/verify/regra_morta*.js`; incluí como desvio declarado que endurece — campanha que não re-executa quando o próprio arquivo mutado muda é o EA-7 dentro do remédio).

**Status (T082, 2026-09-01):** os três desvios foram ARBITRADOS na validação — forma do M4 e local do kill de M5/M6 viraram erratas E10/E11 da spec (mais E12, o pin sintético veredito+razão); os targets ficaram conforme sem errata. Protocolo em [[arbitragem-de-desvio-declarado]].
