# Spec — 018-cobertura-declarada-de-mutacao

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md), não o repete.
>
> **Nota de condução** (herdada da Fase 0): os agentes de papel existem em
> `.claude/agents/` mas não estão disponíveis como subagentes nesta sessão. Este
> artefato foi escrito pelo orquestrador nos contratos do `product-owner` e do
> `tech-lead`, e isso vai dito em vez de simulado.

## Objetivo

Dar ao stage `mutation` a capacidade de **nomear o que ele não está checando**,
declarando a população de arquivos que devem estar sob campanha e medindo a
diferença contra os gatilhos reais. Link: [refinement.md](refinement.md).

## Decisões do portão da Fase 0

Aprovadas pelo proprietário no chat em **2026-09-11**, na forma "segue com as
recomendações":

| | decisão |
|---|---|
| **P1** | população por **regra + exceções**, nunca enumeração nominal |
| **P2** | gatilho **sem** mutante é lacuna **de severidade própria**, distinta do órfão |
| **P3** | válvula da janela de trabalho = **dívida declarada com prazo** |
| **P4** | população inicial = **só os `check_*.py` declarados no `pipeline.yaml`** |
| **P5** | os seis órfãos conhecidos **nascem em dívida**; vermelho só para órfão **novo** |

## Critérios de aceite → gates

Todo critério é gate executável, definido AQUI (R3 §1). Namespace da demanda:
`D018-*`. Arquivo do julgador: **`.claude/verify/check_mutation_coverage.py`**
(novo), stage próprio **`mutation-coverage`** no `pipeline.yaml` (R10 §9).

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| **C1** | A população é **declarada**, não inferida: existe arquivo de declaração com regra, exceções e, em cada exceção, motivo e prazo | `D018-POP1` · `check_mutation_coverage.py` · o arquivo de população existe, casa o schema, **toda** exceção tem `motivo` e `prazo` não vazios, e nenhuma entrada duplica outra | `M1` — remover `motivo` de uma exceção ⇒ o gate tem de reprovar nomeando a exceção |
| **C2** | Arquivo **na população e fora de todo gatilho** é nomeado como órfão | `D018-ORF1` · idem · para cada arquivo da população, existe ≥1 harness cujo `targets` o contém; ausência ⇒ `[FAIL]` **com o nome do arquivo** | `M2` — remover um arquivo dos `targets` do harness que o cobre ⇒ FAIL nomeando exatamente esse arquivo |
| **C3** | Órfão **conhecido** não reprova enquanto a dívida estiver viva; órfão **novo** reprova sempre | `D018-ORF1(b)` · idem · órfão coberto por dívida com prazo **não vencido** ⇒ `[DÍVIDA]`, não `[FAIL]`; órfão sem dívida ⇒ `[FAIL]` | `M3` — apagar a entrada de dívida de um dos seis ⇒ o mesmo arquivo vira `[FAIL]` |
| **C4** | Dívida **vencida** reprova — a válvula não vira silêncio permanente | `D018-PRAZO1` · idem · dívida com `prazo` < data corrente ⇒ `[FAIL]` nomeando a entrada e o prazo | `M4` — recuar o prazo de uma dívida para o passado ⇒ FAIL nomeando a entrada |
| **C5** | **Ser gatilho não é ser coberto**: gatilho sem mutante é reportado em severidade **própria** | `D018-COB1` · idem · arquivo que é `targets` de algum harness e não aparece no conjunto mutado de par algum da `mutation-matrix.json` ⇒ `[LACUNA]`, com id distinto do órfão | `M5` — remover o par que muta `check_fecho.py` ⇒ `[LACUNA]` nomeando `check_fecho.py`, e **sem** virar órfão |
| **C6** | Declaração que aponta para arquivo inexistente reprova (registro podre, família `EA-31`) | `D018-MORTO1` · idem · toda entrada de população/exceção/dívida resolve para caminho existente no disco; senão `[FAIL]` | `M6` — trocar um caminho de exceção por inexistente ⇒ FAIL nomeando o caminho |
| **C7** | O julgador **não se auto-exclui em silêncio** (R10 §10) | `D018-POP1(b)` · idem · `check_mutation_coverage.py` está na população **e** sua exclusão, se houver, é nominal e declarada como as demais | `M7` — excluir o próprio julgador sem entrada nominal ⇒ FAIL |

**Contagem declarada**: 7 gates, `7 PASS · 0 FAIL` quando verde. Entra em
`.claude/verify/expected_suites.json` **no mesmo commit** dos gates (R10 §3) —
declarada na Fase 4, fixada por execução na Fase 6.

## Comportamento especificado

### Superfície 1 — a declaração de população

Arquivo novo `.claude/verify/mutation_population.json`, classe **não protegida**
(dado de verificação, como `mutation_map.json`). Forma, por P1:

- **regra** — a população é derivada de uma regra sobre o disco, não de lista:
  *todo `check_*.py` referenciado por um stage do `pipeline.yaml`*. A regra é
  dado, não código, para que mudá-la seja decisão visível em diff.
- **exceções** — cada uma com `arquivo`, `motivo` e `prazo`. Exceção sem motivo
  não é exceção: é omissão (C1).
- **dívidas** — os seis órfãos de 2026-09-05, cada um com `motivo` e `prazo`
  (P5). Forma copiada de `known_issues.json`, que já é o precedente da casa.

### Superfície 2 — o julgador

`check_mutation_coverage.py`, stage `mutation-coverage`, **ao lado** do laço de
trigger e nunca no lugar dele (fora de escopo do refinamento). Lê a população, o
`mutation_map.json` e a `mutation-matrix.json`, e emite, por arquivo:

| estado | linha | efeito no exit |
|---|---|---|
| na população, tem gatilho, tem par mutante | `[OK]` | — |
| na população, tem gatilho, **sem** par | `[LACUNA]` (C5) | reprova, id próprio |
| na população, **sem** gatilho, com dívida viva | `[DÍVIDA]` (C3) | não reprova |
| na população, **sem** gatilho, sem dívida | `[FAIL]` (C2) | reprova |
| dívida com prazo vencido | `[FAIL]` (C4) | reprova |
| fora da população | **silêncio** (caso B2) | — |

A última linha segue a forma do repositório:
`mutation-coverage: N na população · M órfão(s) · K lacuna(s) · D dívida(s)`.

### Casos de borda do refinamento, resolvidos

`B1`→C2 · `B2`→silêncio, especificado acima · `B3`→C5 · `B5`→C3 · `B6`→sem ação
(a diferença diminui sozinha) · `B7`→C6 · `B8`→C7.

**`B4` (equivalente por construção) não vira gate**: a R13 já dispõe sobre a
classe e a forma é `dividas_declaradas` na `mutation-matrix.json`. O julgador lê
essa dívida e a trata como par presente — reinventá-la aqui criaria dois lugares
para a mesma decisão, que é a doença da família `EA-31`.

## Contratos

- **Estado novo**: nenhum estado de produto. O dado novo é o arquivo de
  população; **owner: `build-engineer`** (R9 §5 por analogia — quem mantém pins e
  pipeline), com a **regra** sob decisão do `product-owner` e as **exceções** sob
  decisão de quem as pede, sempre com motivo e prazo.
- **Consumidores**: só o stage novo. Nenhum gate existente muda de comportamento.
- **Bridges**: nenhum (não há superfície de UI).

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** Conferido em
  `.claude/rules/product-invariants.md`: as dez tratam de engine, score, UNSET,
  suficiência, alvo, refinamento, narrativa, sessão, boundary e idioma. Esta
  demanda não toca produto — toca instrumento de verificação.
- [x] **`design-decisions.md` — nenhum conflito.** Conferido: nenhuma decisão
  confirmada ou candidata trata de cobertura de mutação. **Encosta** na
  disposição *"cláusula defensiva inalcançável por construção… não reportar como
  código morto"*: absorvida pelo caso `B4` acima, que a delega à
  `dividas_declaradas` em vez de reinventá-la.
- [x] **Specs validadas anteriores — nenhuma contradição.** A **017**
  (`semantica-do-gatilho`) é a mais próxima e é **pré-condição cumprida**, não
  conflito: foi ela que separou `targets` (gatilho) de `arquivos_mutados`
  (conjunto mutado). Esta spec adota esse vocabulário e acrescenta o terceiro
  termo, **população**.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `current_phase.json → specs_normativas` declara **uma**:
  `specs/PHASE_5_0_REV_B.md` (sha256 `4f1583c7…04619b`, **medido nesta data sobre
  o arquivo normalizado LF e conferido contra o declarado — confere**; ler spec
  selada sem provar que é a selada seria ler outra coisa). Lida nesta data:
  **nada sobre mutação, cobertura de mutação ou população de campanha em
  `specs/PHASE_5_0_REV_B.md`** — busca por "mutação/mutacao/cobertura de mut"
  retornou zero ocorrência. Resultado negativo registrado como leitura, conforme
  o template exige. A §29.4 daquela spec trata de **arquivos protegidos**, e
  nenhum arquivo desta demanda está na lista nominal.
- [x] **Boundary (R6) — as três fontes cruzadas.**
  1. `.claude/verify/boundary.json`: os arquivos desta demanda
     (`mutation_population.json`, `check_mutation_coverage.py`, `pipeline.yaml`)
     **não** pertencem a `frozen`, `generated`, `legacy` nem `registry`.
  2. `PROTECTED` e `frozenSuites` (`tests_p50_core.js`): nenhum dos três consta.
  3. `pins.json`: `pipeline.yaml` **é pinado** → `gen_pins.py` no mesmo PR (R8
     §1); os dois arquivos novos entram no registry ao nascer.
  **Nenhum arquivo protegido é tocado; nenhum rito de autorização é acionado.**

## Fora de escopo

Herdado do refinamento — escrever campanha para os órfãos; estender a população a
`tests_*.js`; `EA-4`/âncora podre; mudar o laço de trigger; fechar o `EA-3` — mais
o que esta spec exclui:

- **Não altera `check_mutation.py`.** O stage novo mede ao lado. Tocar o julgador
  existente arrastaria a campanha `d017` e a sonda, sem necessidade.
- **Não cria classe de boundary** para o arquivo de população. Ele é dado de
  verificação editável; protegê-lo é decisão separada, se algum dia fizer falta.
- **Não decide o prazo das seis dívidas iniciais.** O valor é escolha do
  proprietário na Fase 2 ou 3; a spec exige apenas que exista e seja cobrado (C4).
