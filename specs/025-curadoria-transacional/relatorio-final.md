# Relatório final — 025-curadoria-transacional

> Fase 6 · T093 · dono: `doc-writer` · 2026-10-30.
> Branch `feature/025-curadoria-transacional` · HEAD de partida `b24534e`
> (47 commits à frente de `origin/develop`, 0 atrás; merge-base `da71759`) ·
> pasta primária `phase5-009` · **sem PR aberto** (T095 pendente) · remoto ainda em
> `3741ebd`.
> **Aceite de intenção do `product-owner`: "não encontrei objeção"** (Fable 5.1,
> 2026-10-30, `planning-state → implement.notes`), **condicionado à prova verde** —
> os números dessa prova estão neste relatório; **ele não emite veredito de
> PASS/FAIL**. Todo número vem de execução citável ou de registro canônico, com a
> fonte ao lado: "medido por mim" é execução desta escrita (HEAD `b24534e`, árvore
> limpa onde dito); "citado de `<fonte>`" é número que li e não reexecutei. O que
> depende do CI ou de ato do usuário está declarado como tal.

## Objetivo cumprido

A curadoria do relatório — a sexta chave canônica da sessão, nascida na demanda 019
— passou a obedecer o ciclo de vida que os outros dez owners já tinham. Antes, a
importação **aplicava ao validar** (`ui_session_v32.js:237-242` chamava
`__CURATION.fromSession`), a chave ausente **herdava** a sessão anterior, o
snapshot nascia **depois** da mutação e "Nova sessão" e "Reiniciar avaliação" não a
limpavam (`EA-91`, `EA-92`, mais os adjacentes `EA-105`…`EA-114`). Depois da 025:
validar é puro (`__CURATION.validate`); a curadoria — inclusive a **ausência** — é a
11ª chave do candidato e do commit; o snapshot é a primeira instrução de
`commitCanonicalOwners`; Nova sessão e Reiniciar a limpam e descartam o `draft` do
editor; a prévia e o aviso de substituição falam dela; o editor volta a "ausente" no
toggle-back. Dezesseis gates `D025-*` (suíte `tests_025_curadoria_sessao.js`), quatro
reancoragens na m48 e vinte e três mutantes (`tests_025_mutants.js`) sustentam o
conjunto. Engine, Camada 1, harness M41, snapshot funcional, `build_v32_html.py` e
`tests_ux_m41.js`: **zero linha** (`git diff --stat da71759 HEAD -- <os seis>` vazio,
medido por mim).

Pegada medida por mim (`git diff --stat da71759 HEAD`, antes dos dois commits desta
tarefa): 28 arquivos, +5260 −187. Produto: `ui_curation_v32.js`, `ui_session_v32.js`,
`ui_ux_v32.js`, `ui_curation_edit_v32.js`, `ui_v32.js` e o HTML dev regenerado.
Doc: `SESSION_SCHEMA_V32.md`, `USER_GUIDE.md`, `synthetic_session_examples/
exemplo-completo.json`, `specs/019-curadoria-do-relatorio/spec.md` (erratas),
`CONTEXT.md` (verbetes da Fase 0). Gates e registros: as duas suítes novas,
`tests_session_m48.js`, `tests_p50_core.js`, `tests_019_curadoria.js`,
`bridges.json`, `mutation_map.json`, `expected_suites.json`, `mutation-matrix.json`,
`pins.json`. Os 47 commits: 24 `chore`, 14 `doc`, 5 `feat` (W2–W6), 4 `test`.

## Série de repins — executada × prevista

O `tasks.md` previu **17** (`R0`…`R16`, mais `R0a` só se E0). A execução, até
`b24534e`, fez **15** `gen_pins.py` (`git log --oneline da71759..HEAD | grep -c
gen_pins`, medido por mim) — o 16º, `R16`, é o desta tarefa e é do orquestrador. A
conta fecha assim: −4 por **fusão declarada** (R1+R2, R8+R9+R10, R12+R13), +3 por
repins de errata/iteração que o plano não numerou (`R15a`, `R15b`, `R15c`).

| Previsto | Executado | Commit | Pins depois | Classe do desvio |
|---|---|---|---|---|
| R0 | R0 | `2bec2c1` | 524 | — (absorve R0, R0b, R0′ do plano: refinamento de granularidade, tasks nota (j)) |
| R1 · R2 | **R1+R2** | `1de96ec` | 526 | **fusão**: os dois commits do red já estavam em sequência; reordenar exigiria rebase (PARADA 9) |
| R3 | R3 | `56b43f1` | 526 | — |
| R4 | R4 | `388d3d5` | 526 | — |
| R5 | R5 | `0edbb7d` | 526 | — (ver régua T010 em §Prosa defasada) |
| R6 | R6 | `b761125` | 526 | — |
| R7 | R7 | `5c57cfd` | 526 | — |
| R8 · R9 · R10 | **R8+R9+R10** | `8db76c6` | 526 | **fusão**: três commits `doc` seguidos, sem conteúdo entre eles |
| R11 | R11 | `336a667` | 526 | — |
| R12 · R13 | **R12+R13** | `f8f753a` | 526 | **fusão** (precedente R1+R2) |
| R14 | R14 | `1159435` | 527 | — (+1: `tests_025_mutants.js` novo) |
| R15 | **R15a** | `91a57e7` | 527 | classe **(c)** do tasks — errata de spec depois do red (E9–E11) |
| — | **R15** | `017ed5d` | 528 | classe **(b)** — iteração 1 do `spec-validate` (+ dívida `INV8(c)` na matriz, `af41f72`) |
| — | **R15b** | `6a6899d` | 528 | classe **(c)** — errata E12 |
| — | **R15c** | `b24534e` | 528 | classe **(b)** — iteração 2 do `spec-validate` |
| R16 | **pendente** | — | 529 (previsto) | do orquestrador, T094 |

Classes previstas pelo `tasks.md` que **não** ocorreram: **(a)** merge de `develop`
depois do rebase (`git rev-list --count HEAD..origin/develop` = 0, medido por mim);
**(d)** segunda edição comentário-only de julgador; **(e)** E0/R0a (P5 mantido
inteiro, T005 inerte). Quem executou: os 15 commits `gen_pins` levam trailer
**Fable 5.1** — o orquestrador, por convenção desta estrutura (declarado no corpo do
R0: *"o tasks.md o atribuía ao build-engineer — refinamento de granularidade
declarado, não desvio"*).

`check_baseline.py`, medido por mim em `b24534e` com a árvore limpa: **`528/528 pins
conferem · 0 divergentes · 0 ausentes · 0 sem pin`**. Os dois commits desta tarefa
abrem a dívida do R16 de propósito (§Estado da Fase 6).

## O rebase de 2026-10-27 e o mapa de SHAs

Durante a escrita do `tasks.md` (Fase 3) a branch foi **rebaseada** sobre
`origin/develop` em `da71759` (merge do #113), reflog `2026-10-27 18:29:17 -0300`,
oito *picks* sem conflito; **W0.2 e W0.3 já estavam executadas** (#112 = `6933179`,
#113 = `da71759`, ambos *merge commits* — R14). `pins.json` não conflitou porque
nenhum repin da 025 existia. Mapa antigo → novo (citado de `plan.md`, *Nota aditiva
da Fase 3*, item (e); byte-idênticos, os antigos vivem só no reflog):

| Antigo | Novo | Papel |
|---|---|---|
| `cee02e9` | `da71759` | base (`origin/develop`) |
| `d695dbb` | `989b2b9` | portão da Fase 0 |
| `2c47545` | `31e60b9` | spec |
| `b0c5703` | `79d0c26` | revisão de intenção do PO |
| `520f20d` | `dbf0059` | portão da Fase 1 |
| `2a06ef3` | `29be723` | plan |
| `e734810` | `395942a` | portão da Fase 2 |

O rebase foi **anterior** ao `red.commit` (`b20b20b`, 2026-10-30): a PARADA 9
(nenhum rebase depois do red, `check_tdd.py:32`) nunca esteve em risco.

## A mudança de pasta primária

A demanda nasceu e foi desenhada em `phase5-sel`. O `guard-tdd` resolve a raiz pelo
cwd do processo do hook (`project_root()`, `.claude/hooks/lib/common.sh:15`) e lê o
`planning-state` **da pasta primária** — a família que o `EA-84` e o `EA-87`
registram (`EA-84`, nota de 2026-10-20: *"o `guard-tdd` leu a worktree errada"*). Com
a sessão ancorada em `phase5-sel`, a edição de `ui_curation_v32.js` (T020) foi
**negada três vezes** pelo guard (citado do briefing da T093, sem registro em
arquivo) e **não foi contornada**: a pasta primária passou a ser `phase5-009`, a
worktree da demanda, em 2026-10-30. Evidência no repositório: `git worktree list`
mostra `phase5-sel` parada em `1de96ec` (HEAD solto, o R1+R2), e o
`spec-validate.md` (*"pasta primária `phase5-009`"*) e a campanha da T084
(`_meta.execucao_demanda_025`) registram `phase5-009` como a pasta de execução da
retomada de 2026-10-30 (não conferi commit a commit em qual pasta cada um nasceu). Nenhum
`tdd_waiver` foi usado: `check_tdd.py` lista **2 waivers** no repositório e nenhum é
da 025 (`tdd: 20 demanda(s) · 2 waiver(s) · 0 problema(s)`, medido por mim).

## Janela vermelha — esperada × medida

Esperado: `tasks.md` §*A janela vermelha, commit a commit*. Medido: corpo do commit
(onde dito) ou execução minha. Colunas: suíte `d025` (PASS de 16), m48 (PASS de 97),
`p50core` (PASS de 65).

| Após o commit | `d025` esp → med | m48 esp → med | `p50core` esp → med | Fonte do medido |
|---|---|---|---|---|
| `755b8e2` red da suíte (T013) | 1 → **1** (só `GAT1`) | 97 → não medida aqui | 65 → — | corpo do commit; `red-025.md` §d025 |
| `b20b20b` red da m48 (T015) = `red.commit` | 1 → **1** | 94 → **94** (FAIL `S50`, `S30`, `S31-S32`; `S69` PASS) | 65 → **65** | `red-025.md` §m48 e §Pós-red; reexecutado em 2026-10-30, vereditos byte-idênticos |
| `e11fd05` W2 | 3 → **3** (`VAL2`, `CAN1`, `GAT1`) | 94 → **94** | 65 → não registrado | corpo do commit |
| `d8518e0` W3 | 10 → **10** | 96 → **96** (`S31-S32`) | 64 → **64** (`P50-GOV1`) | corpo do commit |
| `17683b6` W4 | 12 → **12** | 97 → **97** | 64 → **64** | corpo do commit (`tests_ux_m41.js` 56/56) |
| `a0a879a` W5 | 13 → **13** | 97 → não medida por mim | 64 → **64** | **medido por mim** em `git archive a0a879a` (o corpo do commit não traz medição): FAIL `INV8`, `TRN2`, `DOC1`; `P50-GOV1` |
| `4ef94ba` W6 | 14 → **14** (`INV8(d)`, `DOC1`) | 97 | 63 → **63** (`GOV1` + `IC4`) | corpo do commit |
| `01e7067` T070 (E4+E5) | 15 → **15** (derivado: `INV8` PASS, `DOC1` só por (e)) | 97 → **97** | 63 | corpo do commit (`D025_ONLY=D025-INV8,D025-DOC1`) |
| `6cace4c` T072 (E6) | 16 → **16** | 97 | 63 → **63** (sem `P51-DOC*`) | corpo do commit |
| `97f08d8` T080 | 16 | 97 | 65 → **65** | corpo do commit |
| `f892db1` W8 | 16 → **16** | 97 **refixado** por execução | 65 | corpo do commit; `check_suites.py` ⇒ 24 `[OK]` |

Esperado e medido **coincidem** em todas as células com medição. A coluna `suites`
(stage) ficou **vermelha nomeada** (`suíte fora do registro e das exceções nominais:
tests_025_curadoria_sessao.js`, `check_suites.py:50-56`) de `755b8e2` a `f892db1`, como
a nota (a) do plano corrigiu; **não medida commit a commit** (o hook Stop não vê os
stages `heavy`) — citado de `plan.md` nota (a) e de `spec-validate.md` §defasado (f).
O falso sobrevivente de `CM1` entre T030 e T040 (nota (c) do plano) **não foi
medido**, conforme a recomendação ("não medir `core` entre T030 e T040"): a campanha
`core` só rodou depois de a m48 fechar em 97/97 (`3/3` na T084).

## Campanha e pipeline — custo medido

| Item | Medido | Fonte |
|---|---|---|
| Campanha `d025` | `23 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 23`, **534 s**; 5 execuções da m48 = 455,0 s (M6 93,5 · M11 100,6 · M12 92,2 · M16 88,1 · M20 80,6); 22 execuções da `d025` filtradas, 1,9–5,2 s | corpo de `f892db1`; matriz `_meta.execucao_demanda_025` |
| Estimativa do plano para a mesma campanha | 20–25 min (5 × m48 ≈ 9 min) → medido 8 min 54 s | `tasks.md` §Notas de execução |
| Campanha `d025` dentro do stage `mutation` | 574 s e 535 s (duas execuções do stage) | corpo de `f892db1`; `spec-validate.md` |
| Stage `mutation` local, `python` 3.14.7 | **11 campanhas · 1 problema**, 3411 s (T084, `MUTATION_DEFER_MISSING=1`) e 3318 s (T090, direto) | corpo de `f892db1`; `spec-validate.md` |
| `p52` local | **95/108** — 13 não-KILL: 12 falsos sobreviventes por `poppler-utils` ausente (`P52-PDF4/5/6`, `P52-TGT4`: ER7, ER8, ER9, EX5, EX6, FT1…FT7) + `ER5` | idem; controle A/B sem mutação em `f8f753a` e `da71759` |
| `run.sh` completo em `91a57e7` (`python3` = alias da Store) | **17 PASS · 1 FAIL** (`mutation`: `9 campanha(s) executada(s) · 2 problema(s)`, p51/p52 "EXIGIDA … ambiente sem chromium"), 1857 s | `spec-validate.md` §Pipeline inteiro |
| `compliance-audit.sh` completo | **17 PASS · 0 FAIL · 0 WARN** | medido por mim em `b24534e` |
| `check_m41.py` | comparação com o snapshot funcional **PASS**; payload `9794b267e4225d8f…` == pin (régua D2) | medido por mim |
| `check_suites.py` | 24 `[OK]` incl. `d025: 16 PASS · 0 FAIL`; nenhuma suíte fora do registro | corpo de `f892db1` (345 s) — citado |
| `heavy.session` | `97 PASS · 0 FAIL` (83 s) | corpo de `f892db1`; `spec-validate.md` — citado |
| `d025` direto | `D025 CURADORIA SESSAO: 16 PASS · 0 FAIL de 16` | medido por mim em `b24534e` |
| `check_tdd.py` / `check_state.py` | `red provado e commitado (b20b20b1e2e3…)` · `201 pares completos` / `20 demanda(s) · 0 problema(s)` | medido por mim |

**O `FAIL` do `run.sh` não é da 025** — o diagnóstico é do `qa-engineer` e está
registrado em `mutation-matrix.json → _meta.execucao_demanda_025` e em
`spec-validate.md`: (1) sob `python3` — o alias da Microsoft Store — o
`os.path.isdir(%LOCALAPPDATA%\ms-playwright)` devolve `False`, e `have("chromium")`
nega as campanhas Chromium (p51/p52 viram "EXIGIDA … sem chromium"); sob `python`
(3.14.7) o mesmo teste devolve `True` e elas executam. Reproduzi o sintoma: `python3`
→ 3.12.10, `isdir` = **False**; `python` → 3.14.7, `isdir` = **True**. (2) Executadas,
a p52 fecha 95/108 por `poppler-utils` ausente (12) mais `P52-ER5`, que sobrevive
**também na base `da71759`** (controle A/B). Controle idêntico na base `da71759` ⇒
nada disto nasce da 025. As campanhas **não deferidas** que fecharam são as que
importam à 025: `core` 3/3, `d009` 19/19, `d015` 15/15, `d019` 17/17, `d021` 8/8,
`d022` 13/13, `d023` 12/12, `d010` 23/24 (`D010-M20` perdoado por KI-5) e `p51` 19/19
(citado de `spec-validate.md`). O diagnóstico virou os achados novos `EA-117`,
`EA-118` e `EA-119` (§Achados novos).

## Protótipos P1 e P2

Executados na T011/T012, em worktree efêmera destacada de `2bec2c1`, removida ao fim
(`red-025.md` §Protótipos; citado):

- **P1 — o seletor real é instrumentável? SIM.** `#ses-import` + `File` sintético +
  `change` chega ao `#ux-modal` em **1 tick** de microtask (critério ≤ 3), sem
  fallback; o fallback `file.text` na instância também funcionou (3 ticks). A parte
  "contador = 0" do critério do plano não era satisfazível por construção: a escrita
  medida (1, `fromSession`) era o validador aplicando — exatamente o vermelho de
  `VAL1(b)`/M1. A premissa da PARADA 8 estava defasada: `openImportPicker` **está** em
  `__DEV` (`ui_session_v32.js:760`).
- **P2 — "aplica e lança uma vez" é instrumentável? SIM.** Contadores `1 · 1 · 0`
  (embrulho por propriedade em `fromSession`: 1 chamada na falha, 1 em
  `restoreCanonicalOwners`, 0 na foto "nada declarado" — a contrafactual que M22
  reintroduz). `TRX2(b)`/`(b′)` usam o embrulho e exigem `vezes === 1`.

## O red lido por alínea e as divergências D1–D7

Medido em 2026-10-27 e reexecutado em 2026-10-30 com vereditos byte-idênticos:
`D025 CURADORIA SESSAO: 1 PASS · 15 FAIL de 16` e `SESSION 4.8: 94 PASS · 3 FAIL de
97` (`red-025.md`; `red.commit` = `b20b20b`). Nove dos 16 gates nasceram vermelhos
exatamente pelo estado que o mutante reproduz em cópia; três nasceram vermelhos por
**outro** estado (`AUS1` por herança, `TRX2(b)(b′)` porque o commit nem chamava o
bridge, `TRN2` por ausência da função); `GAT1` e `S69(b)` nasceram **verdes,
declarados**. Divergências declaradas no próprio red, nunca ajustadas:

| # | O que divergiu | Destino |
|---|---|---|
| D1 | `grep -c "  if (draft !== null){" ui_v32.js` = **2**, não 1 | nota; a unicidade real é o par `function safePrint(){` + `if (draft !== null){` do p52 (preflight 108/108). Medido por mim: base e HEAD têm **2** (o diff de `ui_v32.js` não acrescenta a forma) |
| D2 | contagem do red confere (`1 PASS · 15 FAIL`) | nenhuma PARADA 3 |
| D3 | `INV8(a)(b)(c)` **verdes** hoje; o gate reprova só por (d) | **errata E9** (autorizada 2026-10-30) + **dívida `INV8(c)`** na matriz (`af41f72`) |
| D4 | o erro de `F-tardio` é `Valor de aprofundamento inválido: ref-hunting`, não "Resposta inválida" | **errata E10**; o gate assere só `/aprofundamento/i` |
| D5 | `openImportPicker` está em `__DEV` | prosa defasada do plano §P1; não é gap |
| D6 | `suites` "17 → 18" | são **23 → 24** chaves (`expected_suites.json`) |
| D7 | linha-resumo `D025 CURADORIA SESSAO:` vs `CURADORIA-SESSAO` do prompt | prevalece a forma do artefato aprovado |

## Erratas nascidas da execução — E9 a E12 — e a dívida `INV8(c)`

Todas **depois** do red e **a pedido do usuário**, no chat, em 2026-10-30
(`refinement.md` rodadas 7 e 8; `spec.md` §Erratas tardias). Nenhuma toca gate,
mutante ou contagem; nenhuma redação original foi apagada.

| Errata | Commit | O que diz | Decisão |
|---|---|---|---|
| E9 | `2943d28` | C7 "Nascem vermelhos" listava `INV8(b)(c)(d)`; o red mediu só (d) | *"Autorizo a errata (Recomendada)"* |
| E10 | `2943d28` | literal do erro de `F-tardio` | idem |
| E11 | `2943d28` | `validate(undefined) → []`, interpretação até então só em comentário de código | *"Ratifico (Recomendada)"* |
| E12 | `42daddc` | §Registro listava 8 `targets` para `harnesses.d025`; o registro tem **9** (o nono é `SESSION_SCHEMA_V32.md`, mutado em cópia por M21 e exigido por `D017-REL1`) | *"Autorizo a E12 (Recomendada)"*; gap **G1** do `spec-validate` (classe `spec-errada`) |

**A dívida `INV8(c)`.** A E9 afirmava que a idempotência sem carrasco estava em
`mutation-matrix.json → dividas_declaradas` desde a T084. O `qa-engineer`, antes de
pontuar, mediu `grep -n INV8` = 2 ocorrências, **ambas no par `D025-M9`**, nenhuma em
`dividas_declaradas`: **não estava**. Entrou em commit próprio (`af41f72`, classe
(b)) com o fato medido na campanha: sob `D025-M9` o gate reprova só por (b) e a (c)
passa (A∪A = A); sob `D025-M4` o kill é em `TRX1` e a (c) também passa. Classe
*sentinela/regressão* com gatilho nomeado (escrita que passe a **somar** em
`commitCanonicalOwners`/`restoreCanonicalOwners`/`fromSession`), como `D015-TIT1(h2)`;
não é tautologia (`EA-20`) nem a classe "inalcançável por construção" da R13.
`check_tdd.py` lista a dívida (medido por mim).

**Spec-validate.** Iteração 1 (`f965100`): **41/42, 97,6 %**, um gap (G1,
`spec-errada`). Iteração 2 (`ce0628a`): **42/42, 100 %** — denominador mantido em 42
(a E12 corrige o G1, não acrescenta exigência); classes de gap: 0. Os 42 itens: 16
critérios + 4 reancoragens + 10 erratas (E1–E7, E9–E11; **E8 fora do denominador**,
nasce aqui) + 3 contratos + 5 registros + *O que NÃO muda* + boundary + protótipos +
âncoras alheias. Provas mecânicas das erratas aditivas, conferidas pelo QA sobre os
commits reais: `aditiva_025.py` (E1·E2, `19f4d45`) ⇒ *"2 linha(s) alterada(s) por UMA
inserção [42, 49] · 40 linha(s) nova(s) · 0 removida(s)/alterada(s) fora de UMA
inserção"*; `corpo_019_inv8.py` (E3, `8ce520a`) ⇒ *"corpo + resto idênticos (638
linhas) · título E3 presente"*. O limite delas: provam a forma do diff, não a
verdade do texto inserido (leitura minha).

## O aceite do `product-owner` — O1 a O10

O aceite (T092, Fable 5.1, 2026-10-30) foi *"não encontrei objeção"*, **condicionado
à prova verde** (`planning-state → implement.notes`: *"O1-O10 para o relatório
final"*). O repositório registra o **destino** das observações que viraram artefato;
o **texto** das dez observações vive na mensagem do PO ao orquestrador, não em
arquivo — o que não consta de arquivo está marcado.

| Obs. | Destino | Fonte |
|---|---|---|
| O1 | célula "Nascem vermelhos" de C7 larga em `INV8(b)(c)` ⇒ **E9**; pergunta (1) da rodada 7 | `spec.md` E9; `refinement.md` rodada 7 |
| O2 | `validate(undefined) → []` decidido por agente ⇒ **E11**, ratificado pelo usuário; pergunta (2) da rodada 7 | `spec.md` E11 |
| O3 | idempotência `INV8(c)` sem carrasco ⇒ **dívida declarada** na matriz (`af41f72`) | `spec.md` E9; matriz `dividas_declaradas` |
| — | literal do erro de `F-tardio` ⇒ **E10** (o número da observação não está registrado em arquivo) | `spec.md` E10 |
| O6 | **refutada**: a linha de `USER_GUIDE.md:467-470` que o PO apontou é **anterior à 025** — `git blame` (medido por mim): `:467` = `f10f60b` (2026-09-28, demanda 022), `:468-470` = `4400b2e` (2026-09-18); `git diff --stat da71759 HEAD -- USER_GUIDE.md` = 6 inserções, 1 remoção, todas em §11 | `git blame -L 467,470 USER_GUIDE.md` |
| O8 | a prova de Chromium (casos 26 do refinamento) é o **job `visual` do PR**, não o jsdom | `spec.md` §Cobertura (caso 26); `verify.yml` job `visual` |
| O4, O5, O7, O9, O10 | **texto não registrado em arquivo do repositório nem no briefing** — o orquestrador completa a partir da mensagem do PO | — |
| (G1) | gap de `targets` do `spec-validate` ⇒ **E12** — não é observação do aceite, vem da validação | `spec-validate.md` |

## Pendências que atravessam

- **Caso 26 do refinamento (papel no Chromium).** jsdom cobre `AUS1(d)`, `NOP1`,
  `INV8(a)`; o Chromium canônico é o job `visual` do PR. **Conferido o runner**, pela
  lição da 011: o job `visual` de `.github/workflows/verify.yml` roda
  `npm run test:visual`, `node tests_p50_chromium.js`, `node tests_p52_chromium.js`,
  `node tests_011_chromium.js` e, no passo seguinte, `python
  .claude/verify/check_mutation.py` **sem** `MUTATION_DEFER_MISSING` — é esse passo
  que executa p51 (disparada por `ui_v32.js` e `USER_GUIDE.md`) e p52 (por
  `ui_v32.js`). **Não existe run**: `gh pr list --head
  feature/025-curadoria-transacional --state all` ⇒ `[]`. Até haver, "deferido ao CI"
  é pendência, não prova.
- **Caso 27 (gate fechado: o editor não lê o bridge).** Só a **redação** de C10 entrou
  (E2, `19f4d45`). `EA-115` **permanece `aberto`**, baixa.
- **O conflito de nomes do papel** (facilitador/operador/engenheiro): fora de escopo
  declarado; passe próprio do `product-owner`.
- **`EA-112`, resíduo declarado** (§EA fechados): duas das cinco documentações da
  alínea (d) e as fixtures curadas nas suítes congeladas ficaram de fora.

## EA fechados no `BACKLOG.md` (E8) e achados novos

E8 escrita uma vez, por acréscimo (R2 §5), em commit próprio **seguinte a este**;
cada fecho no bloco do achado cita gate, carrascos e commits. `corrigido na branch`:
nenhum PR aberto.

| Achado | Status | Gate que o mede | Carrasco(s) | Commit(s) |
|---|---|---|---|---|
| `EA-91` | `resolvido` | `D025-VAL1`, `VAL2`, `TRX1`, `TRX2`, `AUS1`, `NOP1` | M1, M2, M4–M8, M10, M22 | `e11fd05`, `d8518e0` |
| `EA-92` | `resolvido` | `D025-NEW1`, `RST1` | M11, M12, M13 | `17683b6` |
| `EA-105` | `resolvido` | `D025-VAL1(c)` | M1 | `d8518e0` |
| `EA-106` | `resolvido` | `D025-CAN1`, `AUS1` | M3, M23, M5 | `e11fd05`, `d8518e0` |
| `EA-107` | `resolvido` | `D025-TRN2` | M15 | `4ef94ba`, `d8518e0`, `17683b6` |
| `EA-108` | `resolvido` | `D025-TRN1` | M14 | `d8518e0` |
| `EA-109` | `resolvido` | `D025-PRV1` + `S30(b)` | M16, M17 | `d8518e0`, `b20b20b` |
| `EA-110` | `resolvido` | `D025-UNS1` (P3) — decisão do usuário, Fase 0, 2026-10-27; **não** riscado, **não** em `design-decisions.md` | M18 | `e11fd05`, `a0a879a` |
| `EA-111` | `resolvido` | `D025-INV8` + E3 | mutC=M5, mutD=M9, mutB=M6; **`INV8(c)` sem carrasco, dívida** | `8ce520a`, `af41f72` |
| `EA-112` | `resolvido` **com resíduo declarado** | reancoragens `S50`/`S69(b)`/`S30(b)`/`S31-S32` + E4–E6 + `NEW1`/`RST1`/`INV8`/`DOC1` | M6, M11, M12, M16, M20, M21 | `b20b20b`, `01e7067`, `6cace4c` |
| `EA-113` | `resolvido` | `S50` | M20 | `b20b20b` |
| `EA-114` | `resolvido` | `S69(b)` | M6 (sob a m48) | `b20b20b` |
| `EA-115` | **`aberto`** (baixa), com nota | — | — | só a redação de C10, `19f4d45` |
| `EA-116` | intocado | — | — | — |

**Confronto com o briefing.** (1) `EA-91` ganhou `D025-VAL2` além dos cinco do
briefing: o critério C2 da spec o cita como *"sub-caso E do `EA-91`"*. (2) O
`EA-106` ficou com `CAN1` + `AUS1` (a decisão P1 e o que a ausência faz). (3) O
`EA-112` é o único em que a leitura literal do achado **não** está inteira: a spec
excluiu as fixtures curadas dentro das suítes congeladas S29/S49/S67/S77/S6/S7/S37/
S41/S112 (§Fora de escopo) e a 025 não tocou `exemplo-minimo.json` nem
`session_roundtrip_report.md` (0 ocorrências, `grep -c -i`, medido por mim). O bloco
diz isso com todas as letras; a decisão de manter `resolvido` ou reabrir é do
orquestrador.

**Contagem de abertos** (`compliance-audit.sh --rule=backlog`, medido por mim):
**58 antes** (árvore limpa em `b24534e`) → **50 depois** (58 − 12 + 4), `1 PASS · 0
FAIL · 0 WARN` nos dois. O briefing esperava 59 → 51; a base real tinha 58 (a conta de
−12/+4 está certa, o ponto de partida é que estava um acima).

**Achados novos — `EA-117` a `EA-120`** (ids conferidos: nenhum `EA-117`+ em
`.claude/BACKLOG.md` de nenhuma das 202 refs locais/remotas; o maior existente é
`EA-116`; `git grep -a` por `EA-11[7-9]|EA-12[0-9]` nas mesmas refs só acha uma memória de agente, em
outra branch, que diz "próximo livre: `EA-117`" — não é reserva de conteúdo). Todos `aberto`, instrumento, com cadeia e "medido por":

| Id | Achado | Medido por |
|---|---|---|
| `EA-117` | `harnesses.p52.requires` declara só `chromium`; `P52-PDF4/5/6` e `TGT4` exigem `poppler-utils` ⇒ 12 falsos sobreviventes (classe `EA-72`) | `qa-engineer`, controle A/B em `f8f753a` e `da71759`; eu: `pdftoppm` ausente do PATH, `pdftotext` presente |
| `EA-118` | `run.sh` usa `PYBIN=python3` = alias da Store; `have("chromium")` diverge por interpretador; `env-doctor` e `check_mutation` discordam (KI-3 cresce) | `qa-engineer` (duas execuções do stage); eu: `python3` 3.12.10 ⇒ `False`, `python` 3.14.7 ⇒ `True` |
| `EA-119` | `run.sh` apaga o log do stage reprovado no `EXIT` (`mktemp` + `trap`); 101 linhas perdidas na T090 (146 − 30 − 15); família `EA-15` | `qa-engineer` (T090); eu: `run.sh:52-85` |
| `EA-120` | `harnesses.d011` não lista `check_lint_arch.py` (carrasco de `D011-M7`, `tests_011_mutants.js:70`) em `targets`/`insumos.oraculo`; classe `EA-72` | leitura minha; o vão já estava em prosa no item 6 do fecho do `EA-101` |

## Divergência de granularidade — dois commits, não um

O `tasks.md` (T093) previa **um** commit para relatório + `BACKLOG.md`
(`doc(025): Fase 6 — relatorio final e fecho dos EA-91/92/105..114 no BACKLOG
(E8)`). A delegação mandou **dois, um por arquivo**: este relatório
(`doc(025): Fase 6 — relatorio final`) e, depois, o `BACKLOG.md` (mensagem do
`tasks.md`). Razão de leitura: o relatório cita o fecho, não o contém — e, desfeitos
em commits separados, cada um é revertível sem o outro. É a mesma classe das fusões
da série de repins, no sentido inverso: **divergência de granularidade declarada, não
desvio**.

## Prosa defasada registrada — não é gap

Números e réguas do `tasks.md`/`plan.md` que a execução desmentiu. Nenhuma altera
gate, contagem canônica ou veredito.

| Prosa | Medido |
|---|---|
| "17 → 18 suítes" | **23 → 24** chaves em `expected_suites.json` (D6 do red; `check_suites.py` ⇒ 24 `[OK]`) |
| `PROTECTED` com 15 entradas (T080) | **16** — conferido por mim com `eval` do literal de `tests_p50_core.js`; o corpo de `97f08d8` diz "os 16 pinos" |
| `git diff -U0` do T080 "três hunks" | **2 hunks** (pinos adjacentes), conteúdo o esperado — medido por mim: `git show 97f08d8 -U0 -- tests_p50_core.js \| grep -c '^@@'` = 2 |
| régua "`grep` Respostas, observa = 0 arquivos" | passou a **2 arquivos**, ambos da família `d025`: `tests_025_curadoria_sessao.js` (`RST1(b)`) e `tests_025_mutants.js` (M13 muta o texto). O risco vigiado — suíte **alheia** pinando o texto antigo — segue em 0. Lê-se "0 fora da família d025" (`0edbb7d`; medido por mim) |
| régua "`grep` `draft !== null` = 1" | **2, inalterado** (base `da71759` e HEAD) + preflight p52 108/108 (D1 do red) |
| Linhas de `ui_session_v32.js` (`:240`, `:533-541`, `:585-586`, `:602`, `:606-628`, `:641-654`, `:718-736`) | movem após T030; localizadas por texto. Lidas hoje: validador `:242`, snapshot `:624`, restore `:620`, escrita da curadoria `:637`, `prioLimitHit` `:640`, `discardDraft` `:641`, `sessionHasContent` `:677`, prévia `:756` |
| `spec-validate.md` cita o snapshot em `:626` | a linha lida hoje é **`:624`** (`const snap = snapshotCanonicalOwners();`; o arquivo não mudou depois de `91a57e7`); sem efeito de veredito |

## Lição

**O verde que a errata promete precisa de uma linha que o torne verificável.** A E9
afirmou que a dívida `INV8(c)` estava na matriz desde a T084; a medição do
`qa-engineer`, antes de pontuar, achou que não estava (`grep -n INV8` = 2, nenhuma em
`dividas_declaradas`). A E12 repetiu a forma ao contrário: a spec enumerava 8
`targets` onde o próprio mutante M21 exigia 9. Duas vezes, a **prosa** de uma spec
descreveu um registro executável que a máquina, ao conferir, mostrou diferente — e nas
duas quem pegou foi a conferência contra o fonte, não a leitura do relato (R2 §4).
Regra que fica, já escrita na E12: o `targets` de um harness **deriva do conjunto
mutado** (todo arquivo que algum `M*` toca, inclusive documento mutado em cópia) ∪
{harness}; e dívida declarada em errata só existe quando `grep` a acha em
`dividas_declaradas`.

## Trilha de modelos

Medida pelos trailers `Co-Authored-By` dos 47 commits (`git log --format=...
da71759..HEAD`): **Fable 5.1 × 37**, **Opus 5.5 × 4**, **Sonnet 5.5 × 6**. Por agente
(trailer do commit confrontado com `model:` em `.claude/agents/*.md`):

| Agente | Modelo declarado | Modelo do trailer | Commits |
|---|---|---|---|
| `core-engineer` | `opus` | Opus 5.5 | `e11fd05`, `d8518e0`, `17683b6`, `4ef94ba` |
| `ui-engineer` | `sonnet` | Sonnet 5.5 | `a0a879a` |
| `doc-writer` | `sonnet` | Sonnet 5.5 | `01e7067`, `6cace4c`, `19f4d45`; este relatório e o `BACKLOG.md` |
| `build-engineer` | `sonnet` | Sonnet 5.5 | `97f08d8`, `5f2b99a` |
| `product-owner`, `tech-lead`, `qa-engineer`, orquestrador | `fable` (PO/TL/QA) | Fable 5.1 | o resto, inclusive os 15 `gen_pins` e o `8ce520a` (E3, em arquivo de teste: QA) |

**Sem desvio do modelo declarado nos agentes.** A nota de trilha que relatórios
antigos carregavam ("rodou em Opus, não no modelo pinado") **não se aplica** a esta
demanda.

## Estado da Fase 6 — o que falta, e quem fecha

| Condição | Estado nesta data | Quem fecha |
|---|---|---|
| `spec-validate.md` | **iteração 2, 42/42 (100 %)** | `qa-engineer` (feito) |
| Aceite de intenção | **"não encontrei objeção"**, condicionado à prova verde | `product-owner` (feito); o cumprimento da condição é do orquestrador/PO |
| `relatorio-final.md` | este arquivo | `doc-writer` (feito) |
| E8 no `BACKLOG.md` | commit seguinte a este; `--rule=backlog` 0 FAIL, 58 → 50 abertos | `doc-writer` (feito) |
| Repin R16 (T094) | **pendente** — o `baseline` acusará `BACKLOG.md` divergente e `relatorio-final.md` sem pin até lá; previsto 529 | orquestrador |
| Push | **não feito** — remoto em `3741ebd`, local 11 commits à frente depois desta tarefa | orquestrador (T095) |
| PR + CI (`verify`, `visual`, `fecho`) | **não existem** — `gh pr list` ⇒ `[]` | orquestrador (T095) |
| `phase: done` + `validate.conformance` | **não** — `phase` ainda `implement` no planning-state | orquestrador, depois do PR |
| "Pronto" | job `visual` verde (KI-3); p51/p52 não fecham local | CI do PR |
| Merge (T096) | do usuário, *"Create a merge commit"*, nunca squash | usuário |

## Dependências deixadas para outros

| Para | O quê |
|---|---|
| orquestrador | `gen_pins.py` R16 (`chore(025): gen_pins — R16 (relatorio-final + BACKLOG)`); push de `feature/025-curadoria-transacional`; PR contra `develop`; planning-state `done` depois do `visual`; decidir se o `EA-112` fica `resolvido` com resíduo ou reabre; completar O4/O5/O7/O9/O10 neste relatório se quiser o texto |
| `build-engineer` | `EA-117`, `EA-118`, `EA-119`, `EA-120` (dono nomeado em cada Encaminhamento) |
| `qa-engineer` | confirmar a severidade dos quatro; `P52-ER5` sobrevive na base — achado da p52, a canônica é o job `visual` |
| `product-owner` | conflito de nomes do papel (passe próprio); `EA-115` (redação de C10 feita; falta a metade que instrumentaria o bridge sob gate fechado) |
| `tech-lead` | nada pendente; a regra do `targets` derivado do conjunto mutado (E12) entra no próximo `tasks.md` |

## Fontes citadas

- `.claude/project-memory/planning-state/025-curadoria-transacional.json` —
  `refinement`, `specify`, `plan`, `tasks`, `red`, `implement`
- `specs/025-curadoria-transacional/{refinement,spec,plan,tasks,red-025,spec-validate}.md`
- `.claude/verify/mutation-matrix.json` — `_meta.execucao_demanda_025`, pares
  `D025-M1`…`M23`, `dividas_declaradas` (`D025-INV8(c)`)
- `.claude/verify/mutation_map.json` — `harnesses.d025`, `harnesses.p52`,
  `harnesses.d011`; `expected_suites.json`; `bridges.json`
- `.claude/BACKLOG.md` — `EA-84`, `EA-87`, `EA-91`, `EA-92`, `EA-101` (item 6),
  `EA-105`…`EA-120`
- `.github/workflows/verify.yml` — jobs `verify`, `visual`, `fecho`
- Commits (série real, `git log --oneline da71759..HEAD`): `31af3f5` `eeee301`
  `989b2b9` `31e60b9` `79d0c26` `dbf0059` `29be723` `395942a` `de068cb` `efe2872`
  `d903126` `2bec2c1` `755b8e2` `b20b20b` `21e4241` `1de96ec` `e11fd05` `56b43f1`
  `d8518e0` `388d3d5` `17683b6` `0edbb7d` `a0a879a` `b761125` `4ef94ba` `5c57cfd`
  `01e7067` `6cace4c` `19f4d45` `8db76c6` `8ce520a` `336a667` `97f08d8` `5f2b99a`
  `f8f753a` `f892db1` `1159435` `3741ebd` `2943d28` `91a57e7` `af41f72` `f965100`
  `017ed5d` `42daddc` `6a6899d` `ce0628a` `b24534e`
- Medições diretas desta escrita (2026-10-30, `phase5-009`): `git rev-list --count`;
  `git ls-remote origin`; `git worktree list`; `git diff --stat da71759 HEAD`;
  `git blame -L 467,470 USER_GUIDE.md`; `git show 97f08d8 -U0`; `git archive a0a879a`
  + `node tests_025_curadoria_sessao.js` + `node tests_p50_core.js`; `node
  tests_025_curadoria_sessao.js` em `b24534e`; `python .claude/verify/check_baseline.py`
  (528/528), `check_tdd.py`, `check_state.py`, `check_m41.py`; `bash
  .claude/verify/compliance-audit.sh` (17/0/0) e `--rule=backlog` (58 → 50);
  `python3 -c` × `python -c` sobre `os.path.isdir(%LOCALAPPDATA%\ms-playwright)`;
  `gh pr list --head feature/025-curadoria-transacional --state all`
- **Não executado, com o motivo**: `run.sh` completo, campanhas, `check_suites.py` e
  m48 — número citado de `spec-validate.md` e dos corpos de commit (execuções do
  `qa-engineer`); reexecutar custa ≈ 1 h e esta tarefa é de registro. Job `visual`
  do CI e p51/p52 canônicas — não existe run (nenhum PR).
