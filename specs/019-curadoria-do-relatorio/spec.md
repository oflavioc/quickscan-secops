# Spec — 019-curadoria-do-relatorio

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md), não o repete.
>
> **Quem escreveu**: o orquestrador, **nos contratos do `product-owner` e do
> `tech-lead`** — os agentes de papel existem em `.claude/agents/` mas não estão
> disponíveis como subagentes nesta sessão (precedente da 018).

## Objetivo

Dar ao operador o último passo antes do relatório: **escolher, entre o que o
motor inferiu, o que de fato vai ao cliente** — na tela e no PDF — e apresentar
o apoio **por solução** em vez de por gap.

Fronteira, decidida no portão da Fase 0: **seleção, nunca redação.**

## Critérios de aceite → gates

Namespace `D019-*`. Suíte nova `tests_019_curadoria.js`; mutantes em
`tests_019_mutants.js`. Contagem declarada a entrar em `expected_suites.json`
**no mesmo commit** dos gates (R10 §3).

| # | Critério | Gate · arquivo · asserção | Mutante previsto |
|---|---|---|---|
| C1 | **Curadoria é seleção, nunca redação.** Nenhum texto do relatório tem origem no estado de curadoria | `D019-CUR1` · o estado só contém **ids** e valores de **enum fechado**; nenhuma chave de texto livre; e nenhum texto impresso casa com valor vindo do estado | **M1**: acrescentar campo de texto livre ao estado e imprimi-lo ⇒ CUR1 vermelho |
| C2 | **Ausência ≠ supressão.** Sessão sem curadoria declarada produz relatório **idêntico** ao de hoje | `D019-CUR2` · relatório com a chave **ausente** é byte-idêntico ao construído sem a demanda; `missing ≠ null ≠ {}` | **M2**: ausência passa a significar "excluir tudo" ⇒ CUR2 vermelho |
| C3 | **Entrada canônica (INV-8).** Export só inputs; import recomputa | `D019-INV8` · a sexta chave entra em `captureCanonicalInputs()`; roundtrip preserva; injeção de campo derivado é recusada | **M3**: serializar a lista de recomendações resultante junto ⇒ INV8 vermelho |
| C4 | **Proveniência, nas DUAS superfícies.** Todo item cuja presença é decisão do operador leva rótulo, na tela **e** no papel | `D019-PROV1` · para cada item curado, existe marcador de proveniência no DOM da tela **e** em `#v32-print-report` | **M4**: remover o rótulo **só no papel** ⇒ PROV1 vermelho (é assim que isso quebra de verdade) |
| C5 | **A curadoria não alcança medição nem declaração.** | `D019-MED1` · score, estágio, suficiência, gaps, prioridades e cenário-alvo **idênticos** com e sem curadoria; **payload M41 byte-idêntico** ao pinado | **M5**: deixar a curadoria filtrar a lista de `findings` ⇒ MED1 vermelho |
| C6 | **Apoio por solução: nada some, nada nasce.** | `D019-SOL1` · o **conjunto** de produtos da visão por solução é **igual** ao da visão por gap — incluídas as menções curtas (`.prod-mini`) | **M6**: descartar produto que só aparece como menção curta ⇒ SOL1 vermelho |
| C7 | **Agrupamento declarado, e o desconhecido é nomeado.** | `D019-SOL2` · todo produto cai em um grupo do portfólio; o que não tiver categoria conhecida vai para um grupo **explícito** e é **listado**, nunca descartado | **M7**: descartar em silêncio produto sem categoria ⇒ SOL2 vermelho |
| C8 | **Tela e papel exibem a MESMA seleção.** | `D019-PAR1` · o conjunto publicado na tela é igual ao de `#v32-print-report`, medido **após `beforeprint`** | **M8**: aplicar a curadoria só na tela ⇒ PAR1 vermelho |
| C9 | **Supressão total não produz vazio mudo.** | `D019-VAZ1` · curadoria que exclui tudo produz seção **com declaração da supressão**, nunca seção vazia nem seção ausente | **M9**: renderizar seção vazia ⇒ VAZ1 vermelho |
| C10 | **Gate de suficiência fechado ⇒ curadoria indisponível.** | `D019-SUF1` · com o gate `blocked`, o controle de curadoria não existe e o estado não é lido | **M10**: oferecer curadoria com resultado bloqueado ⇒ SUF1 vermelho |

> **C5 é o critério de aceite mais duro da demanda.** Se o payload M41 divergir,
> a demanda **para** — não se negocia Porta B para uma mudança de apresentação.

## Comportamento especificado

### Superfície nova — o editor de curadoria

**Não cria `step` novo.** A Camada 1 é dona de `step` e `render()`, e é
`frozen`. A curadoria adota o padrão **já provado** do editor de contexto
tecnológico (`#v32editor`): um editor de tela cheia, aberto por controle
explícito a partir da tela de resultados, que escreve em estado próprio e
devolve o leitor de onde veio.

| entrada | saída |
|---|---|
| operador abre a curadoria | lista dos produtos **inferidos** para esta sessão, agrupados por portfólio, cada um marcável |
| operador desmarca um produto | ele deixa de aparecer no relatório — tela e papel |
| operador marca um produto **não ofertado** | ele passa a aparecer, **com rótulo de proveniência** |
| operador fecha sem mexer | nada muda (C2) |
| operador exclui tudo | seção declara a supressão (C9) |

### O que é curável, e o que não é

Herdado do portão da Fase 0, e é **regra de produto**, não de implementação:

> A curadoria age sobre o que o motor **inferiu** — nunca sobre o que foi
> **declarado** ou **medido**.

| curável | não curável |
|---|---|
| formas de apoio e recomendações | respostas · score · estágio · suficiência |
| leitura arquitetural | gaps observados |
| "pode fazer sentido — após validação" | prioridades declaradas · cenário-alvo |

### Apoio por solução

A seção de apoio passa a agrupar por **produto**, listando as capabilities que
ele atende. Medido na sessão de referência: **15 blocos → 9 cards**, com
`Serviços FortiGuard` deixando de aparecer 5 vezes.

Agrupamento pela divisão oficial do portfólio, com **três regras de borda**:

1. produto fora de `Security Operations` usa a **categoria de topo**
   (ex.: FortiGate → *Network Security*);
2. **serviços** (MDR, resposta a incidentes, capacitação) têm **grupo próprio** —
   eles não estão em *Products*, e sem isso sumiriam;
3. produto sem categoria conhecida vai para grupo explícito e **é listado** (C7).

### UNSET · NA · suficiência

- **Suficiência fechada**: curadoria indisponível (C10). Não há resultado
  publicado para curar.
- **`NA` e `UNSET`** não são tocados: eles vivem em respostas e contexto, que a
  curadoria não alcança (C5).
- **Ausência de curadoria ≠ curadoria vazia** (C2) — é a mesma disciplina que a
  INV-8 já exige para o resto da sessão.

## Contratos

### Estado novo — sexta chave canônica

```
reportCuration: {
  offerings: { "<offeringId>": "include" | "exclude" },
  architectureNote: "include" | "exclude"
}
```

- **Owner do estado** (R9 §5): `core-engineer`, exposto por bridge; a
  renderização apenas consome.
- **Só ids e enum fechado** — é o que sustenta C1 e a INV-8.
- **Unidade = produto**, e não par (capability × produto), porque o P5 fez da
  visão por solução a apresentação: curar por produto e apresentar por produto
  são a mesma decisão vista uma vez.
- **Consumidores**: a seção de apoio da tela (Camada 5.2) e
  `buildPrintReport()` (`ui_v32.js`).

### Degradação quando a sessão muda

Caso de borda 4/5 do refinamento. Com estado por produto, a degradação é
natural: exclusão de produto que deixou de ser ofertado é inócua; inclusão de
produto que nada na avaliação sustenta **é mantida e sinalizada no editor** —
nunca descartada em silêncio, nunca ressuscitada em silêncio.

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** As dez conferidas.
  **INV-7** preservada porque determinismo é propriedade de `(entradas) → saída`
  e a curadoria é entrada. **INV-8** preservada porque o estado é seleção, e C1
  a protege por gate. **INV-1** protegida por C5 (payload byte-idêntico).
  **INV-3** respeitada por C10. INV-2, 4, 5, 6, 9, 10 não são tocadas — a
  demanda não alcança score, target, refinamento nem boundary.
- [x] **`design-decisions.md` — nenhum conflito.** Lido: não trata de curadoria
  nem de apresentação de apoio. As candidatas pendentes (limiar de suficiência,
  severidade uniforme, `SCORES`) são de **medição**, que esta demanda não toca.
- [x] **Specs validadas anteriores — nenhuma contradição.**
  A **015** decidiu a *partição* das superfícies de apoio; esta acrescenta um
  filtro **depois** dela e não reabre a partição. Medido: os gates `D015-*`
  afirmam o **título** de `#v32prio` e a **ancoragem** de
  `[data-pr-gap-support]` — nenhum deles afirma o agrupamento interno dos
  `.apoio-block`. A **009** fixa a ordem canônica de leitura; esta demanda **não
  cria seção nova**, logo não a toca.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `current_phase.json → specs_normativas` aponta **uma**:
  `specs/PHASE_5_0_REV_B.md`. **SHA-256 medido**
  `4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b` — **confere**
  com o registrado. Lida: **zero ocorrências** de "curadoria"/"curar" e nenhuma
  cláusula sobre formas de apoio ou recomendação. **Resultado negativo
  registrado como leitura.**
- [x] **Boundary (R6) — as três fontes cruzadas.**
  - `boundary.json`: a demanda **não toca** `frozen`, `generated`, `legacy` nem
    `registry`. `step`/`render()` permanecem intocados por desenho.
  - `PROTECTED` / `frozenSuites` (`tests_p50_core.js`): **toca dois** —
    `ui_session_v32.js` (a sexta chave) e `ui_v32.js` (proveniência no papel).
    Toca ainda `tests_session_m48.js`, que é §29.4 e cujo gate `S4-S5`
    (`:115`) afirma a lista de chaves canônicas **por igualdade exata**.
  - `pins.json`: os três são pinados; `gen_pins` no mesmo PR (R8 §1).

> **AUTORIZAÇÃO PARADA AQUI (R6 §5).** A demanda exige rito §29.4 sobre
> **três arquivos**: `ui_session_v32.js`, `ui_v32.js` e `tests_session_m48.js`.
> Nenhuma linha deles é escrita antes da autorização nominal do proprietário.
> O `S4-S5` é reancoragem de **lista**, não afrouxamento: a sexta chave é
> entrada canônica e os 13 nomes de campo derivado proibidos permanecem
> proibidos.

## Fora de escopo

Herdado do refinamento, mais:

- **Texto livre de recomendação** — decidido em P1(c): *"esse é desnecessário"*.
- **Curadoria de gaps, prioridades e cenário-alvo** — P4, por princípio.
- **Ampliar o catálogo** (`FortiNAC`, `FortiEDR`, `FortiClient`). **Medido na
  Fase 0**: acrescentar qualquer produto ao `PRODUCTS` altera o payload M41 —
  é Porta B, e é o `EA-56`/`EA-58`. A curadoria **lê o catálogo**, então os três
  aparecem no dia seguinte à Porta B, sem código novo.
- **Mudar a política de severidade.** Ela decide o que é **oferecido**; a
  curadoria decide o que é **publicado**.
