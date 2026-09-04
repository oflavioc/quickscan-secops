# Spec-validate — 014-gate-sem-poder-discriminante

> Fase 6 · T082 (artefato) · **somente leitura sobre o produto e o instrumento**
> · escrito em **2026-09-04** · executor: `qa-engineer`.
> **Este artefato nasce DEPOIS do merge, e diz isso na primeira linha.** O PR
> [#36](https://github.com/oflavioc/quickscan-secops/pull/36)
> (`feature/014-gate-sem-poder-discriminante` → `develop`, head `f9bf7fb`,
> merge `09f4342` em 2026-09-04T09:06:13Z) foi mesclado pelo orquestrador, sob
> delegação, com o `planning-state` em `phase: "implement"` e `pr_url` vazio, e
> **sem este arquivo** — a conformidade **19/19** da T082 (executada em
> 2026-09-01) vivia só numa linha do `planning-state`. É a **quinta instância**
> do achado `EA-33` (fase da demanda × histórico do git), criada no mesmo ciclo
> em que o achado foi aberto, e pelo mesmo papel que o abriu. Pelo critério
> aplicado à 013 e à 009 — *toda demanda em `done` neste repositório tem o seu
> `spec-validate.md`; mover com metade da Fase 6 sem artefato é o carimbo
> retroativo que a 014 combate* —, a 014 não vai a `done` sem esta metade QA.
> **Este documento não finge ter sido escrito na época**: o que a execução de
> 2026-09-01 sustenta está citado como executado então; tudo o mais foi
> **remedido hoje**, na árvore mesclada, que mudou desde a T082 (errata **E13**,
> fecho da **T081**, vereditos do `EA-32`, `EA-34`, merge da `develop`).
> Medido no HEAD **`09f4342f7c48505b52904403820b271da07bc964`** (branch
> `chore/fecho-013-done`, idêntico a `origin/develop`), contra a
> [spec.md](spec.md) aprovada sob delegação, **com as erratas E1–E13
> incorporadas**.

## O que a T082 deixou, e o que não deixou

**Deixou** (e é tudo o que existe dela):

- a linha `validate.conformance` do `planning-state` — *"100% (spec-validate
  T082: 19/19 conformes, qa-engineer, 2026-09-01; erratas E10-E12 registradas
  na spec)"* — e a partição declarada na delegação: *7 critérios, 7 contratos,
  disposições de `M51-01`/`KI-4`, fora de escopo*;
- o commit **`ca38462`** (2026-09-01T14:13:36Z): erratas **E10–E12** na
  `spec.md`, com os três kills que a arbitragem exigiu **descritos como
  reproduzidos** na própria mensagem (`D014-M4` → `C2(zero)`, `(1, 20)`,
  `mortas p51/M51-08`, `D014-CEN1` verde; `D014-M5` → `D014-EXC1` PASS e
  `D014-DISC1` FAIL nomeando `bateria[19]`/`C3(b)`; retirada a exceção
  `achado-aberto`, `mortas` volta de 0 a 1) e o terceiro desvio da wave 6
  (`d014.targets`) arbitrado **conforme sem errata**;
- o commit **`57392a3`** (14:20:51Z): duas correções de registro achadas pela
  validação — `red.gates` citava `D014-ANC1`/`D014-CENSO1`, ids que nunca
  existiram (lista anterior preservada, R2 §5), e o `_trilha` de
  `expected_suites.d014` trazia a população da wave 5 (48/45) como corrente
  (adendo com 50/47).

**Não deixou** a lista item a item. A numeração abaixo é **desta medição** e não
pretende reconstituir a de então.

**O que a T082 não podia saber, e que muda a leitura do 19/19**: o critério
**C4** foi dado como conforme com o par `D014-M10`×`P52-LAY2` **`NÃO
EXECUTADO`** (causa `ambiente sem chromium`, fecho deferido ao job `visual`,
como a spec permitia). O run **33516136516** já estava **em voo** quando a T082
foi commitada (criado 13:53:30Z; a T082 é de 14:13:36Z) e terminou às
14:52:23Z com **`SOBREVIVENTE D014-M10 · gate P52-LAY2 · o gate esperado NÃO
reprovou — sem poder discriminante`** — lido hoje do log do job `99883514179`,
não de registro. A forma `:77` do mutante era CSS raciocinado, não medido; a
errata **E13** (2026-09-04) reancorou em `:86`, e o run **33834890154** fechou
**KILL**. Um `spec-validate` que reproduzisse hoje o "conforme" da T082 para o
C4 sem dizer isso seria falso.

## Método

Cada exigência verificável da `spec.md` (C1–C7 com alíneas, os sete contratos,
as disposições de `M51-01`/`KI-4`, §Onde a varredura roda, §Fora de escopo,
§Comportamento, §Guarda de tautologia, §Não mensurável, cross-check, erratas
E7–E13) foi conferida **na implementação real e por execução própria** — nunca
no relatório de quem implementou (R2 §2/§4). Onde a prova canônica é o CI, o
**log do run foi baixado e lido** (`gh run view --job … --log`), não a cor do
badge. Onde a alegação era "kill reproduzido", o kill foi **reproduzido de novo**.

Ambiente: Windows 11 · node **v24.19.0** · Python **3.14.7** · jsdom **30.0.1**
(dependência declarada) · Playwright 1.62.1 **sem** Chromium gerenciado
(`CHROME_PATH` vazia, KI-3). A árvore real carregava dois arquivos modificados
alheios a esta validação (fecho da 013 pelo orquestrador; memória de agente);
como o stage `mutation` recusa árvore suja (`check_mutation.py:57-61`), tudo o
que muta ou exige árvore limpa rodou numa **worktree efêmera no mesmo HEAD**
(`git worktree add --detach`, `node_modules` do clone via `NODE_PATH`,
removida ao fim). Nenhuma execução escreveu em arquivo versionado da árvore
real (R7 §3); toda sonda na efêmera terminou com `git status --porcelain` vazio.

### Execuções desta validação (todas em 2026-09-04)

| execução | resultado |
|---|---|
| `node tests_014_regra_morta.js` (árvore real) | **7 PASS · 0 FAIL de 7** · `D014-DISC1`: **7** controles verdes · **44** casos de bateria negativa · **31** alíneas cobertas · 3,0 s |
| `--preflight` dos **9** harnesses com `preflight: true` (árvore real) | exit 0 nos 9 · **266 âncoras, todas `ocorrencias == 1`** (`d009` 19 · `d010` 24 · `d011` 19 · `d014` 9 · `d014vis` 1 · `d015` 15 · `p50` 53 · `p51` **19** · `p52` 107) · `find`/`repl` emitidos para **50** mutantes de CSS (`p50` 4 · `p51` 1 · `p52` 36 · `d009` 2 · `d010` 0 · `d011` 5 · `d014` 1 · `d014vis` 1 · `d015` 0) · `M51-01` **ausente** da `p51` · `D014-M10` emitido na forma **`:86`** (`grid-column: 2` → `1`) |
| Sonda de leitura pela API do instrumento (`varrerArvore`, árvore real) | `API 1` · `censo_ok true` · harnesses consultados 9, `core` em `sem_preflight` · **população 50** (7 harnesses com mutante de CSS) · excluídos **3** (`d009/D009-M5`, `p50/M8`, `p52/P52-RA8`) · avaliados **47** · **mortas 0** · **indecidíveis 21** (`gramatica-de-seletor-recusada` 16 · `contexto-de-midia-nao-relacionado` 5) em **15** mutantes — o 15º é `d014vis/D014-M10` na forma `:86` (combinador `>`) · 6 folhas na ordem do builder · censo idêntico ao pinado |
| `python .claude/verify/check_mutation.py` (efêmera, limpa; HEAD ≡ `origin/develop`) | `---- integridade: 0 ----` (IC-1 nos 10 harnesses · IC-2 OK · `[DÍVIDA] core` · IC-4 **9 harnesses / 266 âncoras** · IC-6 7 caminhos · IC-5 19 pares `p51`) · `---- exceção nominal: 0 ----` (`[OK] IC-9: nenhuma exceção mutation-sobrevivente declarada` + sonda 7 cenários) · `---- guarda de leitura parcial: 0 ----` · 10 campanhas *não exigidas* · `mutation: 0 campanha(s) executada(s) · 0 problema(s)` · exit 0 · 1,2 s |
| Campanha **`d014`** (`node tests_014_mutants.js`, efêmera) | **9/9 DETECTADO** · `restauração: source byte a byte OK · porcelain dos alvos limpo` · 25,8 s |
| Sonda **E10**: `D014-M4` aplicado à mão (`find`/`repl` do preflight em `ui_p50_v32.css`), suíte, restauração | `FAIL D014-VARR1` com **exatamente 1 alínea** — `C2(zero): veredito (mortas, indecidíveis) = (1, 21) · mortas: p51/M51-08` — e **`D014-CEN1` PASS sob a mutação** (censo-neutralidade provada) · 6 PASS · 1 FAIL · restaurado |
| Sonda **"a exceção é carga"**: `exclusoes[2]` (`p52/P52-RA8`, `achado-aberto`) retirada do `regra_morta.json`, suíte, restauração | **5 PASS · 2 FAIL**: `C2(zero)` → `(1, 21) · mortas: p52/P52-RA8`; e `C3(*)` → conjunto `["d009/D009-M5","p50/M8"]` ≠ declarado — a lista é fechada nas duas direções. A exclusão é **carga**, não afrouxamento |
| Sonda **carrasco de C7 (`IC-9.2`)**: `KI-4` histórica (`8b5be3e`) de volta em `known_issues.json`, commit efêmero, `check_mutation.py`, `reset --hard` | `[FAIL] IC-9: known_issues/KI-4 · o harness p51 não declara o mutante 'M51-01' [oráculo: preflight (C1)] — a exceção nomeia um fantasma` · `exceção nominal: 1 problema` · exit 1 |
| `check_baseline.py` · `check_state.py` · `check_tdd.py` (árvore real, **antes** dos commits desta validação) | **384/384 · 0 divergentes · 0 sem pin** · `state: 10 demanda(s) · 0 problema(s)` · `tdd: 10 demanda(s) · 0 waiver(s) · 0 problema(s)` (`014 … red provado e commitado (71b4347…)`) |
| `bash .claude/verify/compliance-audit.sh` (árvore real) | **14 PASS · 0 FAIL** · `known-issues: 0 exceção(ões)` · `regra-morta: 4 exceção(ões) nominal(is), todas com dono e remoção prevista` · 29 achados abertos listados (`EA-32`, `EA-33`, `EA-34` entre eles) |
| `git diff --name-status 09f4342^1 09f4342` (o diff exato do PR #36 sobre a `develop`) | **28** arquivos: 12 `A` (os 5 de `specs/014-…/`, `regra_morta.js`, `regra_morta.json`, `regra_morta_seletor.js`, `fixtures_014_regra_morta.js`, os 3 `tests_014_*.js`, o planning-state) + 16 `M` (`BACKLOG.md`, `compliance-audit.sh`, `expected_suites.json`, `known_issues.json`, `mutation-matrix.json`, `mutation_map.json`, `pins.json`, `pipeline.yaml`, `CONTEXT.md`, `tests_009/010/011/p50/p51/p52_mutants.js`). **Nenhum** `ui_*.js`, `.css`, `engine_v32.js`, HTML, `build_v32_html.py`, `tests_p52_chromium.js`, `tests_p50_chromium.js`, `package*.json`, `bridges.json`, `invariants.json`, `boundary.json`, `gates.md` |
| CI · run **33834890154** (`workflow_dispatch` sobre `51e6c69`, 2026-09-04T03:54:37Z → 04:47:36Z, `verify` e `visual` **success**) — job `visual` **100905257457**, log lido | `P50 CHROMIUM + P51: 27 PASS · 0 FAIL de 27` · `PASS P52-LAY2` · `PASS P52-ICON2` · `P52 CHROMIUM: 55 PASS · 0 FAIL de 55` · `D011 CHROMIUM: 1/1` · `IC-4: d014 9 · d014vis 1 · p51 19 · p52 107` · `integridade: 0` · `IC-9: nenhuma exceção` · `exceção nominal: 0` · `p50` 53/53 · `p51` **19/19** · `p52` **107/107** · `d014` 9/9 · `d011` 19/19 · `d010` 24/24 · `d009` 19 KILL · **`D014VIS MUTATION: 1/1` · `não-KILL: nenhum`** · **`mutation: 8 campanha(s) executada(s) · 0 problema(s)`** |
| CI · run **33516136516** (`workflow_dispatch` sobre `5cf7c82`, 2026-09-01T13:53:30Z → 14:52:24Z, `visual` **failure**) — job **99883514179**, log lido | `D014VIS MUTATION: 0/1` · `não-KILL: 1 de 1` · **`SOBREVIVENTE D014-M10 · gate P52-LAY2 · o gate esperado NÃO reprovou — sem poder discriminante`** · `mutation: 8 campanha(s) · 1 problema(s)` — a forma `:77`, falsificada |
| CI · run **33856672733** (push do merge em `develop`, `09f4342`, ambos os jobs **success**) — logs lidos | job `verify`: `[PASS] regra-morta` · **`verify: 15 PASS · 0 FAIL`** · `compliance: 14 PASS · 0 FAIL`; job `visual`: 27/27 · 55/55 · 1/1 · `integridade: 0` · `exceção nominal: 0` · 10× *nenhum alvo mudou desde a base — campanha não exigida* · `mutation: 0 campanha(s) · 0 problema(s)` (push na `develop` tem diff vazio contra a base — borda 7 da matriz, dívida `[7]`, não desta demanda) |
| `git` — ordem e atomicidade | red `71b4347` (06:09:46 -03:00) é ancestral da 1ª implementação `3741ed0` (06:42:49); **T050 `49f5bec`** toca num commit só `tests_p51_mutants.js` + `known_issues.json` + `mutation-matrix.json` + `regra_morta.json` + `tests_014_regra_morta.js` + `expected_suites.json`; **T060 `40f8b89`** = `mutation_map.json` + `tests_014_mutants.js`; **T061+T062 `7c93899`** = `mutation_map.json` + `tests_014_mutants_visual.js` + `mutation-matrix.json` |

**Não executado, declarado (R2 §1 / R10 §2)**: campanhas `p50`/`p51`/`p52`/
`d014vis` e suítes Chromium **localmente** (Chromium ausente — KI-3; a prova
canônica são os três logs de CI lidos acima); `bash .claude/verify/run.sh
--light` **só depois** dos commits desta validação (contagem no relatório da
sessão — o `baseline` ficará vermelho para este arquivo até o `gen_pins.py`, que
é commit próprio do orquestrador).

## Itens — veredito um a um

| # | Exigência (spec) | Verificação | Veredito |
|---|---|---|---|
| 1 | **C1 · `D014-CASC1`** (a)–(e) sobre folhas sintéticas: morta por especificidade · morta por ordem com empate · viva por especificidade menor posterior · viva por `!important` anterior · **viva por prefixo NÃO-vácuo** (E5) | PASS hoje (suíte 7/7); os quatro carrascos da célula **mortos hoje** na campanha: `D014-M1` (`1 alínea` · `C1(d)`), `D014-M2` (`2 alíneas` · `C1(a)`+`C1(c)`), `D014-M3` (`C1(b)` sai `indecidivel`), `D014-M9` (`1 alínea` · `C1(e)`, com (a) — prefixo `html`, vácuo de verdade — continuando `morta` e passando) | **conforme** |
| 2 | **C2 · `D014-VARR1`** — população **e** âncora do `--preflight` (E3), censo conferido **antes** do veredito (E6), veredito sempre o **par** (E9), zero mortas com lista de avaliados e excluídos | Alíneas `C2(pref)`/`(pop)`/`(anc)`/`(cen)`/`(zero)`/`(cob)`/`(auto)` PASS; hoje **(0, 21)** sobre população **50**, excluídos 3, avaliados 47, `core` nomeado em `sem_preflight`. `D014-M4` **morto hoje** duas vezes — na campanha e à mão: `C2(zero) = (1, 21) · mortas: p51/M51-08`, `D014-CEN1` verde (E10). Sonda "exceção é carga": sem `achado-aberto`, `(1, 21) · mortas: p52/P52-RA8` | **conforme** (com E7/E9/E10) |
| 3 | **C3 · `D014-EXC1`** (a) vocabulário fechado `oraculo-de-fonte` \| `fallback-declarado` \| `achado-aberto` · (b) curinga/vazio/não-texto não excluem · (c) órfã reprova (oráculo: preflight) · (d) `oraculo-de-fonte` registra propriedade e arquivos lidos · **(e)** `achado-aberto` exige id **e** `remocao_prevista` | Registro com **3** exclusões (`regra_morta.json`), conjunto nominal fechado (`C3(*)`), motivos no vocabulário; `(d)` exige também `gate` e `cegueira` — **mais forte que a spec**, nas duas exclusões `oraculo-de-fonte` e na `achado-aberto`; `(e)`: `achado_id: EA-32` (`achado_id_alocado: true`), `remocao_prevista` (reescrita em 2026-09-04 com o texto original preservado), `evento_de_remocao` bem-formado e **não ocorrido** — conferido hoje: **nenhum** par `P52-RA8` em `mutation-matrix.json → pares` (123 pares; `p50`/`p52` seguem agregadas). `D014-M5`/`M6` **mortos hoje** em `D014-DISC1` (`bateria[19]`/`C3(b)`, `bateria[20]`/`C3(c)`) — E11 | **conforme** (com E7/E11) |
| 4 | **C4 · `P52-LAY2` × `D014-M10`** — gate **existente**, suíte **invocada, nunca editada**; mutação de `ui_p52_workspace_v32.css:86` (`grid-column: 2` → `1`, **E13**); motivo esperado inalterado; harness `d014vis` (E1) | Preflight hoje: 1/1 âncora, `find`/`repl` na forma `:86`; `reason` = `/a pergunta não está à esquerda do mapa\|as colunas se sobrepõem\|colunas desalinhadas no topo/` (`tests_014_mutants_visual.js:142`); `tests_p52_chromium.js` **fora** do diff do PR. **KILL canônico lido do log** do run 33834890154: `D014VIS MUTATION: 1/1 … não-KILL: nenhum`; par na matriz com `ultima_prova: KILL, 2026-09-04` e a forma `:77` **refutada com a causa** (R2 §5). A forma `:77` — a que a T082 validou como deferida — foi **SOBREVIVENTE** no run 33516136516 (log lido hoje). **Não executado localmente** (Chromium, KI-3) | **conforme — por E13**, não pela forma de 2026-09-01 |
| 5 | **C5 · `D014-COB1`** — lista **e ordem** das folhas derivadas de `build_v32_html.py`; folha injetada e não lida reprova; ordem casa `specs/PHASE_5_0_REV_B.md:1606` como subsequência | PASS hoje (`C5(*)`/`(lista)`/`(ordem)`/`(spec)`); 6 folhas na ordem do builder (`#style` da Camada 1 + `ui_v32` → `ui_ux` → `ui_p50` → `ui_p52_workspace` → `ui_d011_prioridade`); a âncora selada é conferida no texto (1 ocorrência) antes de julgar. `D014-M7` **morto hoje**: `FAIL D014-COB1 … ENOENT` nomeando `ui_d014_m7_fantasma.css` | **conforme** |
| 6 | **C6 · `D014-IND1`** — indecidível nomeado e contado; **duas contagens, dois prazos** (E9): a sintética pinada **como (veredito, razão)** do caso (f) (E12) e oráculo de `D014-M8`; a da árvore entra quando o achado da E7 fechar | PASS hoje: `C6(sint)` = `indecidivel` · `C6(cont-sint)` = `("indecidivel", "contexto-de-midia-nao-relacionado")` × pinado idêntico · `C6(nome)` 21/21 com `{harness,id,folha,seletor,propriedade,razao}` no vocabulário · `C6(cons)` conservação nos 47 avaliados · `C6(cont-arvore)`: `contagem: null` com **pendência bem-formada** (`achado-aberto`, `EA-32`, `remocao_prevista`, `evento_de_remocao` não ocorrido) e observado hoje **21** — registrado em `indecidiveis.arvore.nota_veredito_2026_09_04` (21 em 15), o `20` de 2026-09-01 preservado como trilha. `D014-M8` **morto hoje** com `2 alíneas` (`C6(sint)` + `C6(cont-sint)`) | **conforme** (com E9/E12) |
| 7 | **C7 · `KI-4` fecha no mesmo PR** — sem gate novo; carrasco `IC-9.2` (`check_mutation.py:895`) e `IC-9.3` (`:912`), por E2 | `known_issues.json → issues: []`, trilha da remoção no `_meta` (T050); hoje `IC-9` imprime *nenhuma exceção declarada* + sonda de 7 cenários; **carrasco provado hoje** na direção "exceção viva + mutante aposentado": `IC-9.2` reprova *a exceção nomeia um fantasma* (sonda acima); a direção "exceção removida + sobrevivente sem perdão" fecha no CI: `p51` **19/19** sem `[EXCEÇÃO]` no run 33834890154 | **conforme** |
| 8 | **Contrato C1 do preflight, estendido** (E3/E8): `find`/`repl` para mutante de CSS, nos harnesses que **declaram preflight**, derivados do registro; `core` fora, impresso com a razão | Hoje **50** mutantes com `find`/`repl` em 7 harnesses (tabela de execuções), coincidindo com a população da varredura (`C2(pop)`); `d010`/`d015` emitem 0 por não terem mutante de CSS; `core` sai em `sem_preflight` e `[DÍVIDA] core` no stage; a extensão é aditiva — IC-4 verde nos 9 harnesses, 266 âncoras | **conforme** |
| 9 | **Dois harnesses em `mutation_map.json`** (E1), `preflight: true` **no mesmo commit** em que o harness lê `--preflight`; `d014` `[node, python]` `D014-M1…M9`, alvos 5 folhas + builder + suíte + harness; `d014vis` `[node, python, chromium]` `D014-M10`, alvos folha + harness | `40f8b89` (map + `tests_014_mutants.js`) e `7c93899` (map + `tests_014_mutants_visual.js` + matriz) — conferido por `git show --stat`; `requires` conferidos; `d014.targets` = os 8 da spec **+ `regra_morta.js` + `regra_morta_seletor.js`** (o que `M1/M2/M3/M8/M9` mutam — `arquivos_mutados` do preflight de hoje confirma), desvio que **endurece** o trigger, arbitrado conforme sem errata na T082 e mantido (ver O4); `d014vis.targets` = os 2 da spec | **conforme** |
| 10 | **Parser e especificidade** (E4): CSSOM do `jsdom`, dependência **declarada**; especificidade **interna**, sem dependência nova | `package.json → dependencies.jsdom: "30.0.1"`; `@bramus/specificity` **0** ocorrências em `package.json` (3 no lock, como transitiva do jsdom — esperado); especificidade em `regra_morta_seletor.js` (220 linhas) + `regra_morta.js` (543) — a divisão prevista no plan para >600 linhas, com o motivo no commit `3741ed0` | **conforme** |
| 11 | **Censo de parse pinado** (E6) por folha, conferido **antes** do veredito; divergência reprova; nunca rebaixado | `regra_morta.json → censo[]` (6 folhas; regra de contagem declarada em `_meta.regra_de_contagem_do_censo`, divergência 158/1175 × 157/1170 registrada com causa `@page`); `D014-CEN1` PASS hoje em `CEN(folhas)`/`(valores)`/`(nao-vac)`; sentinela `importante_com_var = 0` nas 6; ordem provada por `C2(cen)` (`mortas` é `null` enquanto `censo_ok !== true`) | **conforme** |
| 12 | **Registro de exclusões nominais** — arquivo próprio, legível por máquina, `harness`·`mutante`·`motivo`·`propriedade_afirmada`·`arquivos_lidos`; owner `qa-engineer`; nunca prosa | `regra_morta.json → exclusoes[]` com os campos exigidos **mais** `gate` e `cegueira` em todas; owner declarado no `_meta`; consumido por `D014-EXC1`; conjunto fechado por `C3(*)` | **conforme** |
| 13 | **Registro da contagem de indecidíveis** — chave própria no mesmo arquivo, "contagem pinada, divergência reprova" | `regra_morta.json → indecidiveis` com `sintetico` (pin **(veredito, razão)**, E12), `arvore` (`contagem: null` + pendência bem-formada + observações datadas) e `medicao_pre_instrumento`. A frase literal do bullet ("contagem pinada") foi **superada por E9/E12 na própria spec** (ver O5); o que vale é o par pinado, e ele tem carrasco (`D014-M8`) | **conforme** (com E9/E12) |
| 14 | **Nenhum estado novo de produto** — nenhum bridge, nada renderiza, nada toca sessão | Diff do PR #36: **zero** arquivo de produto, `bridges.json` intocado; `lint-arch` PASS no CI do merge (`verify: 15 PASS`) | **conforme** |
| 15 | **Disposição 1** — `M51-01` **aposentado** de `tests_p51_mutants.js`, razão na matriz, **substituição nominal** apontando `D014-M10` | Preflight `p51` hoje: **19** mutantes, `M51-01` ausente; bloco-comentário `tests_p51_mutants.js:125-149` com a razão, a substituição e o **adendo E13** (`85377a3`); `mutation-matrix.json → dividas_declaradas[27]` (aposentado, `EA-7`, veredito por declaração: `grid-template-columns` morta por prefixo vácuo `html`, `grid-template-areas` viva); IC-5 hoje: 19 pares `p51`, todos resolvendo no disco | **conforme** |
| 16 | **Disposição 2** — `P51-VIS1` sem mutante → **dívida declarada com causa**; propriedade medida por `D014-M10`/`P52-LAY2`; `P51-VIS1` como segunda medição independente; nunca mutante sintético | `dividas_declaradas[28]` com essa linguagem exata (precedente `D011-IDEM1(d)`); a alegação "medida pelo par" — **falsa** na forma `:77`, como a E13 registra — é **verdadeira hoje** pelo KILL canônico do item 4 | **conforme** (verdadeiro desde 2026-09-04) |
| 17 | **Disposição 3** — `KI-4` removida **no mesmo commit-par**; a demanda não encerra com `M51-01` aposentado e `KI-4` viva nem com `KI-4` removida e sem carrasco novo | **T050 `49f5bec`** faz os três atos num commit só (aposentadoria + matriz + `known_issues.json`), conferido por `git show --stat` — fecha a pendência que o `product-owner` deixou como "conferível só por git log"; as duas direções do juiz provadas (item 7) | **conforme** |
| 18 | **Onde a varredura roda** — stage próprio no `pipeline.yaml` (R10 §9), `heavy: false`, **sem Chromium**, gatilhado por qualquer `.css`; o par C4 deferido ao job `visual`, declarado | `pipeline.yaml:59-64` (`regra-morta`, `run: node tests_014_regra_morta.js`, `parallel: true`, `mutates: false`, `heavy: false`, após `lint-arch`); `[PASS] regra-morta` no job `verify` do merge; entra no `--light`; `d014vis` sai **nomeada** como deferida no stage local e executada no job `visual` (log lido) | **conforme** |
| 19 | **Fora de escopo** (refinamento + spec): não alterar a R10; `EA-16`/`UX14`/E17-010; `EA-17`; três provas vencidas → achado próprio; não expandir matriz `p50`/`p52`; não reordenar folhas; **não corrigir `P52-RA8`**; nada em `package*.json`; não editar suítes de fase selada; nada em engine/Camada 1; não reancorar `M51-01` na 5.2; nada em `docs_phase5/` | Diff do PR: `gates.md`, `tests_ux_m41.js`, `build_v32_html.py`, `package*.json`, `tests_p5*_chromium.js`, `engine_v32.js`, `docs_phase5/**` **ausentes**; provas vencidas = **`EA-30`** (`BACKLOG.md:1543`); matriz mantém `campanhas P50/P52 (múltiplos)` e nenhum par `P52-RA8`; `P52-RA8` segue excluído por `achado-aberto` — o reparo está **em curso hoje** em worktree própria (`phase5-014`, branch `fix/ea32-particao-do-p52-ra8`), **não tocado por esta validação**; `D014-M10` nasce no namespace `D014-*` | **conforme** |
| 20 | **§Comportamento especificado** — predicado estreito (mesma propriedade · mesmo contexto de mídia **semântico** · relação decidível) · **prefixo vácuo** `html`/`body`/`:root` e só · vencedora importância→especificidade→ordem · regra morta = perde em todos os contextos · fora da relação ⇒ indecidível, nunca "provavelmente viva" · **classe aditiva** medida pela diferença, nunca pela âncora | Cada régua tem carrasco morto hoje (`M1` importância, `M2` especificidade/ordem, `M3` mídia por texto, `M9` vácuo); os dois casos reais separam-se como a spec prevê (`M51-08` **viva** — só morre sob `D014-M4`; a forma `M51-01` era **morta**); a classe aditiva **foi avaliada**: `p52/P52-M8`, `P52-ER5`, `P52-ER6` aparecem hoje na lista de indecidíveis — só a diferença (não a âncora) os alcança; fora da relação decidível saem nomeados (21) | **conforme** |
| 21 | **§Guarda de tautologia** — para cada alínea, estado alcançável de falha, dito onde não se sabe | Tornada **executável** por `D014-DISC1`: hoje **7** controles verdes · **44** casos de bateria negativa · **31** alíneas cobertas (o red tinha 6/38/29); a linha C4 da tabela foi **riscada e reescrita** pela E13 com a medição (`~~empilharia~~ — falso`); a linha C6 saiu de "NÃO SEI" para "20 em 14, medido" (hoje 21 em 15) | **conforme** |
| 22 | **§Não mensurável nesta fase** — 6 itens declarados, cada um com quem mede | (1) C6 árvore: **medido** (21 hoje, guarda sintética preservada); (2) morte de `D014-M10`: **riscado pela E13**, medido SOBREVIVENTE na forma velha e KILL na nova; (3) sem execução pelo PO — honrado (aceite "por leitura da fonte, sem execução"); (4) intra-arquivo: a varredura **achou** `P52-RA8` (E7 → `EA-32`), como previsto "se aparecer, é achado novo"; (5) `M51-08`/`M51`/`M52`/`M53`: vivos hoje, vigiados por C2; (6) fidelidade do jsdom: sustentada pelo censo, `CEN` PASS hoje, sentinela `!important`+`var()` em 0 | **conforme** (declarações honradas, não omitidas) |
| 23 | **Erratas E10–E12** (arbitragem da T082) — `D014-M4` censo-neutro morre por `C2(zero)`, não por `C2(cen)`; `D014-M5`/`M6` morrem em `D014-DISC1`; pin sintético de C6 é (veredito, razão) | Os três kills **reproduzidos hoje**: E10 à mão (`(1, 21) · mortas: p51/M51-08`, `CEN1` verde) e na campanha; E11 na campanha (`bateria[19]`/`[20]`); E12 na campanha (`M8` → `2 alíneas`, `C6(sint)` + `C6(cont-sint)`) e por leitura do pin | **conforme** |
| 24 | **Errata E13** — `D014-M10` reancorado em `:86`; `reason` inalterado; `tests_p52_chromium.js` não editado; forma `:77` refutada com causa e datação (`4aa1f12` → `c1e3649` → `7c93899`); par renasce `NÃO EXECUTADO` e fecha no job `visual`; sonda diagnóstica no não-KILL; proveniência da delegação citada | Coerência entre **seis** registros conferida hoje: célula C4 e §Não mensurável da spec · cabeçalho e `find`/`repl` do harness · adendo do `_trilha` de `d014vis` no map · par `D014-M10` na matriz (`KILL 2026-09-04`, refutação no par) · adendo em `tests_p51_mutants.js` · relatório final. KILL canônico no run 33834890154; SOBREVIVENTE da forma velha relido no run 33516136516. A forma `:77` **permanece** em `tasks.md:31` e `plan.md:74` (ver O1) | **conforme** |
| 25 | **Cross-check / boundary** — nenhuma invariante tocada (`P51-VIS1`/`P52-LAY2` fora de `invariants.json`); nenhum path `frozen`; `tests_p52_chromium.js` fora de `frozenSuites`; sem rito D2; repin no mesmo PR; precedência do regime de pins | `invariants.json`/`boundary.json` **fora** do diff; nenhum dos 4 paths `frozen` tocado; `m41` PASS no CI do merge (`verify: 15 PASS`) e `P50-GOV1` dentro do `suites` do mesmo job; a divergência `RECONCILIACAO_BOUNDARY_5_1_5_2.md` × `boundary.json` foi para achado (T084) e não para edição de spec selada | **conforme** |
| 26 | **R3** — red provado e **commitado** antes da implementação; autor do gate ≠ implementador; mutante obrigatório | `71b4347` (**2 PASS · 5 FAIL de 7**, 49/49 sem âncora) é **ancestral** de `3741ed0` (instrumento, `build-engineer`); `check_tdd` OK hoje; gates: `qa-engineer`; instrumento: `build-engineer`; 10 pares `D014-*` na matriz, **10/10 KILL** (9 hoje localmente + `M10` no CI); `red.gates` corrigido pela T082 (`57392a3`) com a lista errada preservada | **conforme** |
| 27 | **R8 / R10 §3** — `gen_pins.py` no mesmo PR; `expected_suites.json → d014` fixado **por execução** (T070), nunca rebaixado | **19** execuções de `gen_pins.py` no PR (R0–R16, dois "R10", mais o repin do merge `f9bf7fb` — mapa em O2); `baseline` 384/384 hoje e `[PASS] baseline` no CI do merge; `d014: 7/0` com `_trilha` que registra a janela vermelha (2/5 → 5/2 → 7/0, "leitura por alínea, nunca por veredito") e o adendo da T082 (48/45 → 50/47) | **conforme** |
| 28 | **Achados e glossário** — `EA-32`/`EA-33` alocados pelo `doc-writer` contra a `develop`; `EA-30` para as provas vencidas (P5); `EA-34` (E13); 4 termos do refinamento no `CONTEXT.md` (P4); citação `:76` → `:80` (P6) | `BACKLOG.md`: `EA-30 :1543`, `EA-31 :1595`, `EA-32`, `EA-33`, `EA-34` (34 seções `## EA-`); `regra_morta.json` com o marcador `014-P52-RA8` **substituído** por `EA-32` nas duas posições, com a razão original preservada; `CONTEXT.md:199-223` — *Regra morta*, *Poder discriminante*, *Prova de discriminância vencida*, *Varredura de regra morta*; a spec cita `build_v32_html.py:80` | **conforme** (o termo *mutante parcialmente inerte* segue fora do glossário — O3) |

## Score

**28 de 28 itens conformes — 100 %, medido em 2026-09-04.** Zero gap nas três
classes (`spec-errada` · `implementação-divergente` · `faltando`). **Nada foi
afrouxado**: nenhuma asserção de gate, `reason` ou pin foi tocada por esta
validação, e todo "conforme" acima cita a execução ou o log que o sustenta.

**Isto não é o 19/19 da T082 carimbado de novo.** É medição nova, sobre a
árvore mesclada, com a E13 incorporada. A diferença de substância entre as
duas: em 2026-09-01 o C4 estava conforme **por deferimento declarado** de um
par cuja forma nunca tinha sido executada; em 2026-09-04 está conforme **por
KILL canônico** de uma forma medida. O verde de então e o de hoje têm a mesma
cor e não a mesma prova — e é exatamente o tipo de diferença que um
`spec-validate` existe para escrever.

## Observações — o que não virou gap, e por quê

**O1 · `tasks.md:31` (T061) e `plan.md:74` ainda descrevem a forma `:77`.** São
artefatos aprovados das Fases 2/3 que não foram emendados após a E13. Não
contam como gap porque o objeto desta validação é a `spec.md`, que está
coerente (célula C4 reescrita, §Não mensurável riscado com a causa), e porque
a refutação está **registrada com a razão** em três lugares vivos (par da
matriz, harness, `relatorio-final.md` §"Citações da forma antiga"), o que é o
que a R2 §5 exige. Registro a leitura mais dura, para que ela possa ser
escolhida: pelo precedente da 015 (gap G1, *tasks.md anterior às erratas*),
isto seria classificado `spec-errada` e pediria **errata mínima** no `tasks.md`
(uma célula, sem renumerar), do `tech-lead`, com aprovação do usuário e repin.
A diferença que me faz não contar: na 015 o `tasks.md` desatualizado
**escondia** dois mutantes prometidos pela spec e ausentes do harness — um gap
de substância que só apareceu por ele; aqui harness, map, matriz, spec e
relatório concordam, e a linha velha descreve uma forma já marcada como
refutada.

**O2 · A série de repins executada não é a prevista, e o mapa não estava
escrito em lugar nenhum.** O `plan.md` prevê R3–R11 e manda que *"repin fora
desta previsão vai registrado no relatório final, nunca silenciado"*; o
relatório cita commits por fase, mas não o mapa, e os quatro últimos repins
nasceram **depois** dele. Fica aqui, por `git log`:

| repin | commit | fecha |
|---|---|---|
| R0 · R1 · R2 | `7f8c250` · `2f41e69` · `a5b2688` | refinamento · planning-state · spec |
| R3 · R4 | `7527c39` · `4bdc873` | plano+tarefas · erratas E1–E6 |
| R5 | `90c4279` | **red** (`71b4347` trouxe fixtures + registro + suíte + `expected_suites` num commit — waves 1 e 2 juntas; o R5/R6 do plano viraram um) |
| R6 · R7 | `d4bba3e` · `b027ce2` | instrumento + stage · contrato C1 estendido |
| R8 | `58b2fe4` | erratas E7–E9 (**não previsto**) |
| R9 | `dfd2551` | fecho indivisível (T050) |
| "R10 da série (auditoria)" · "R10 da wave 6" | `d04baea` · `5cf7c82` | `compliance-audit.sh` enxerga a exceção nova (**não previsto**) · harnesses + map + matriz — **dois repins com o mesmo rótulo** |
| R11 | `26d0b05` | backlog, `regra_morta.json`, E10–E12 (o R11 do plano era "fixação + relatório") |
| R12 · R13 | `a65c19d` · `51e6c69` | `CONTEXT.md` + aceite · E13 |
| R14 · R15 · R16 | `c08acc9` · `927a0ef` · `87fd2ec` | `EA-34` + relatório · T081 fechada + `EA-32` · adendos dos vereditos (**todos posteriores ao relatório**) |
| merge | `f9bf7fb` | repin do merge da `develop` |

Dezenove execuções, uma por commit de conteúdo, como a R8 §1 manda — o desvio
é de **previsão**, não de disciplina. O que estava por fazer era escrever o
mapa; está escrito.

**O3 · *Mutante parcialmente inerte* continua fora do `CONTEXT.md`.** Classe
nomeada pela E7 e registrada em `regra_morta.json → classes_de_achado`; a spec
não a exige no glossário (o refinamento fixou quatro termos, e os quatro estão
lá). O `product-owner` recomendou registrá-la no fecho; é do domínio dele
(R12), não desta validação.

**O4 · `d014.targets` é superconjunto do conjunto estrito.** A doutrina do
IC-6 (nominal à `p51`) é `targets ≡ mutados ∪ {harness}`; `d014` declara, por
tese da própria demanda, também as quatro folhas que **não** muta (o gatilho
vigia o que decide o resultado). Se o IC-6 for generalizado um dia, terá de
admitir superconjunto declarado — a nota fica para quem o generalizar.

**O5 · O bullet de §Contratos "contagem pinada, divergência reprova" foi
superado por E9/E12 dentro da mesma spec.** As erratas dizem "o que passa a
valer"; o texto do bullet não foi reescrito. Leitura isolada do bullet engana;
leitura da spec inteira, não. Emendar é do `product-owner` e é cosmético.

**O6 · O número de indecidíveis da árvore é 21 hoje, e o registro diz 20 e
21.** `indecidiveis.arvore.observado_em_2026_09_01: 20` é trilha; a
`nota_veredito_2026_09_04` registra 21 em 15 com a forma `:86`; o pin segue
`null` com pendência bem-formada e o gate reprova se o evento vencer. Nenhuma
divergência silenciosa.

**O7 · O `compliance-audit` lista 29 achados abertos; o relatório final dizia
19.** O merge da `develop` trouxe os achados das outras branches para este
`BACKLOG.md`. Contagem, não conteúdo.

## Estado da Fase 6, hoje

- **Aceite de intenção do `product-owner`** (T083, `bdda9a1`): *"não encontrei
  objeção"*, **condicionado por escrito** — *KILL de `D014-M10` por `P52-LAY2`
  fecha C4 e o desenho está aceito; SOBREVIVENTE reabre a análise do desenho
  do par*. A condição foi **exercida nos dois ramos**: o run 33516136516 tomou o
  ramo SOBREVIVENTE (reabriu a análise → E13), e o run 33834890154 tomou o
  ramo KILL sobre o par reancorado. O cumprimento está registrado pelo
  `doc-writer` por adendo (`2854fdb`), **sem aceite novo** — e este artefato
  também não produz nenhum.
- **`EA-32`**: veredito dado (P52-ICON2 mata sob a mutação parcial; par
  válido; metade SOCaaS inerte por ordem; `desc` promete demais). O
  `qa-engineer` recusou disparar o `evento_de_remocao` até o reparo entrar no
  mesmo commit. **Reparo em curso** em worktree própria (`phase5-014`, branch
  `fix/ea32-particao-do-p52-ra8`) — esta validação não tocou
  `tests_p52_mutants.js`, `regra_morta.json`, `mutation-matrix.json` nem a
  `spec.md`.
- **`EA-34`** aberto (limite do instrumento: "declaração viva" não implica
  "mutação observável pelo gate"); remédio não decidido aqui.
- Pendências do `relatorio-final.md`: **1** e **2** fechadas pelo adendo; **3**
  (`EA-34`) aberta, do orquestrador; **4** (aceite) cumprida; **5** (termo no
  glossário) do `product-owner`; **6** (waves 7–8 sem registro no
  `planning-state`) **fechada no fecho desta validação**, no próprio
  `planning-state`, por `git log`.

## Encaminhamento

- **Iteração 1 de 2** (limite da skill): não há gap a devolver. O score sustenta
  mover a fase para **`done`** — com `pr_url` do PR #36, `validate.status:
  done`, nota de fecho retroativo datada de 2026-09-04 e o texto anterior
  preservado (R2 §5). A transição é a troca de campo que a T082 deixou
  preparada (`validate.conformance` existe; `check_tdd.py:37` e
  `check_state.py:52` satisfeitos).
- Este arquivo é **rastreado e não pinado** até o `gen_pins.py` do
  orquestrador: o stage `baseline` local fica vermelho **para este path** até
  lá — esperado, reportado, não regressão.
- O que fica aberto e com quem: `EA-32` (reparo — `qa-engineer` com
  `tech-lead`, confirmação do `product-owner`); `EA-34` (orquestrador, R4); O1
  (errata mínima em `tasks.md`, `tech-lead`, aprovação do usuário, repin); O3 e
  O5 (`product-owner`).
