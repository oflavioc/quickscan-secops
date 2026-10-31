# Relatório final — 026-decisao-unica-do-apoio

> Fase 6 · T066 · dono: `doc-writer` · escrito em 2026-10-31 sobre HEAD `fc5874f`.
> Branch `feature/026-decisao-unica-do-apoio` (base `develop @ 9509e4b`) · 18
> commits à frente · PR <<PR>>.
> **Aceite de intenção do `product-owner`: <<aceite-PO>>**; ele não emite PASS/FAIL.
> **Ratificação de D-1..D-9: pendente do proprietário, no PR** — as decisões foram
> *decididas pelo orquestrador sob a instrução do proprietário de 2026-10-31
> (prompt da microfase 01); ratificação literal pendente no PR*.
> Marcadores deixados de propósito, a preencher quando o número existir:
> `<<spec-validate>>`, `<<aceite-PO>>`, `<<pipeline-final>>`, `<<PR>>`. Todo número
> vem de execução citável ou de registro canônico, com a fonte ao lado: «medido por
> mim» é leitura desta escrita; «citado de <fonte>» é número que li e não reexecutei.

## Objetivo cumprido

**Problema.** A auditoria externa de 2026-10-31 sobre a v3.2.12 mediu dois defeitos:
`QS-01` — os cards por produto contradizem o motor contextual (C1: o motor veta o
`FortiEndpoint` e a tela o chama de «indicação prioritária»; C2/C4: o motor diz
«apoio em operacionalização (nunca substituição)» e há `FortiEndpoint`/
`FortiAnalyzer`/`FortiSIEM` prioritários ao lado; C7: `FortiGuard MDR` prioritário
com `serviceEligibility().eligible === false`); `QS-02` — o PDF perde os
qualificadores (C5: 9 cards na tela, **0/9** com tier no papel).

**Causa confirmada.** A derivação de «o que o motor ofereceu» existia em dois
módulos que nunca consultam o motor para decidir: `ofertados()` em
`ui_curation_v32.js` (1ª fonte = `computeFindings()+MAP`, a Camada 1) e
`ofertaDoMotor()` em `ui_p52_support_v32.js` (cópia, mais uma 2ª fonte por sinal
chaveada por **nome exibido**). `classify`, `resolveCandidates`, `archSatisfied`,
`serviceEligibility` e `suppressedByPlatform` nunca eram lidos pela oferta; o papel
copiava os cards da tela menos `data-p53-sol-tier`. É o `EA-76`, aberto desde
2026-09-29 e selado como «declarar e selar» nas v3.2.11 e v3.2.12. Refutação
(`anexos/refutacao-reproducoes.json`): C1, C2, C4, C7 (uma raiz) e C5 (papel) são
defeito; C3 é abstenção do motor, C6 e C8 são decisão registrada.

**O que a 026 fez.** A decisão de apoio por linha de produto nasce **uma vez**, em
`ui_curation_v32.js` (`reconciliar(entrada)`, pura), como *registro de decisão de
apoio* + *vetos do motor*; tela, editor e papel **consomem**. Onde o motor tem voz, o
card diz o que o motor resolveu (título `FortiEDR`, curável pela linha
`FortiEndpoint`) e a linha vetada não ganha card — ganha uma entrada no bloco
«Não indicado nesta leitura», com a razão literal do motor e a tecnologia
declarada. Onde o motor se abstém, a oferta da Camada 1 passa inteira como
*hipótese condicionada*, com a condição visível e o tier da severidade. O papel
copia do card tier, ação, condição, variante, escopo e vetos. Zero linha em engine,
Camada 1, `ui_v32.js`, `ui_session_v32.js` e schema.

**Pegada** (medida por mim, `git diff --stat 9509e4b..HEAD`, HEAD `fc5874f`): 44
arquivos, +8661 −340. Produto: `ui_curation_v32.js`, `ui_p52_support_v32.js`,
`ui_p52_support_v32.css`, `ui_curation_edit_v32.js` e o HTML dev regenerado. Gates:
`tests_026_contrato.js` (1055 linhas) e `tests_026_mutants.js` (324). Doc:
`refinement.md`, `spec.md`, `plan.md`, `tasks.md`, `red-026.md`, 11 anexos mais 11
cenários, `CONTEXT.md` (+60). Os 18 commits: 3 `feat`, 3 `test`, 3 `docs`, 9 `chore`
(medido por `git log --format=%s 9509e4b..HEAD`). Falta: o pipeline final, o repin
de fecho, o CI e o PR (<<pipeline-final>>).

## Contrato adotado, e por quê

Três desenhos independentes (A, B, C) julgados por três lentes (PO, QA, core).
**Vencedor B por placar 3/3** (39/37/37 contra C 38/35/36 e A 21/31/32), com 17
enxertos (E1–E17 do desenho §0.1) e **três correções que a conferência no código
impôs** ao B:

1. **Precedência veto > hipótese** (enxerto E4): sem ela, C7 publicava «FortiGuard
   MDR · indicação prioritária» via a hipótese de `team-capacity`. *Ressalva medida
   na W4 (errata E12 da spec): em C7 o veto por inelegibilidade já vale em toda
   linha da chave e a precedência não é exercida ali; o estado que ela decide é o
   do lado produto (C4-DL), hoje coberto por `D026-REC1 (j)`.*
2. **D-4 do B retirada** (enxerto E2): levar id do motor a `decisions` mudava o
   contrato do schema v1 sem bump. `decisions` continua `{ chave → include|exclude }`.
3. **C3 nasce desligada** (`CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false`, enxerto E6):
   retirar o `FortiSOAR` esvazia `published()` e, como `presentationOf` nunca promove
   `CONTEXT_NOT_INFORMED` a `card` (`ui_v32.js:693-696`) e `hasSubstituteV32` exige
   classificação ≠ `CONTEXT_NOT_INFORMED` (`:751`), a Camada 1 voltaria à tela com o
   produto que o veto negou.

Por que não A: deixa as duas cópias discordando por desenho (o editor lista o
vetado) e falha o aceite literal do `QS-01` («mesma decisão na tela, no editor e no
PDF»). Por que não C: paga 7 gates e 8 mutantes contra a diretriz de 2026-09-13
(produto antes de instrumento). Três correções do **instrumento** (spec/plan):
harness de mutantes nasce na W4 e não no red (IC-4); `D022-M10` muda de arquivo em
**quatro** toques, não dois; `D025-AUS1 (b)` não julga `D026-M4`.

## Arquivos alterados e limites

| arquivo | classe | linhas (HEAD `fc5874f`) | mudança |
|---|---|---|---|
| `ui_curation_v32.js` | produto | 316 → **597** (+333 −52) | `coletar`/`entradaViva`, `reconciliar` pura, `pareamento` por critério, `temVoz`, `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA`; `ofertados()` leitor; bridge `oferta`/`vetos`/`reconcile`; `contract()` +2 campos |
| `ui_p52_support_v32.js` | produto | 872 → **1105** (+339 −106) | `ofertaDoMotor()` leitor; card com atributos novos e linhas `variante`/`acao`/`condicao`/`elig`/`escopo`; `declararVetos`; `papelHTML` copia tier, ação, condição, variante, escopo e vetos; `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` |
| `ui_p52_support_v32.css` | produto | 220 → **291** (+71) | só prefixo `p53-*`, sem hex |
| `ui_curation_edit_v32.js` | produto | +8 (286) | `span.p53-cur-item-var` «apresentado como <variante>» (D-9) |
| `quickscan_secops_soccmm_v3_2_dev.html` | gerado | +751 −158 | só via `build_v32_html.py` |
| `tests_026_contrato.js` | gate novo | 1055 | `D026-REC1` (a)…(j), `D026-PAP1`, `D026-LEG1` |
| `tests_026_mutants.js` | gate novo | 324 | `D026-M1`…`M6`, padrão d025 (mutação em cópia, rebuild efêmero, `--preflight`, `reason` nominal por gate) |
| `tests_022_mutants.js`, `tests_019_curadoria.js` | gate (trilha) | +16 −3 · +11 | `D022-M10` reancorado em `ui_curation_v32.js` (`F.estado`, `precisaBuild`); comentários-trilha E13 em `D019-SOL1`, `D019-SOL3 (b)`, `D019-MED1` (corpo byte-idêntico) |
| `expected_suites.json`, `mutation_map.json`, `mutation-matrix.json`, `regra_morta.json`, `bridges.json`, `pins.json` | registro | +6 · +28 −2 · +90 −1 · +5 −5 · +1 −1 · +41 −12 | `d026` 3/0; harness `d026` e população do `d022`; 6 pares + 5 dívidas na matriz (207 pares); censo do CSS 52/298/5; nota `__CURATION`; repins R0–R3 |
| `.claude/BACKLOG.md` | doc | +240 −1 | `EA-76` → `resolvido`; `EA-122` e `EA-123` novos |
| `.claude/rules/design-decisions.md` | doc | **não tocado** | D-1/D-2/D-7 **só após ratificação** |

**Limites.** O orçamento de R9 §7 (~600 linhas) foi estourado pelos dois módulos
(`ui_curation` 597 contra ≈495 previstos; `ui_p52_support` 1105 contra ≈940; o de
apoio já estava acima, 872) — errata E9 da spec; justificativa do `plan.md`: a
demanda retira derivação do módulo; o split é rota futura. `lint-arch`: 0
problema(s). Zero `innerHTML=` novo. Nenhum bridge novo.

## Matriz antes/depois — C1…C10, C3b, C7-UNSET, F2, GF

«Antes» = HEAD `9509e4b`, medido pelo refutador e pela sonda
(`anexos/refutacao-reproducoes.json`, `red-026.md`). «Depois» = sonda da W3a sobre
o HTML de `816d605` (`anexos/sonda-leitura.js`, log da T030) para os casos que a
sonda cobre; **C7-UNSET, F2 e GF são medidos pelas alíneas do gate**, não pela
sonda. A sonda sobre o HTML **final** (T064) fica para o pipeline final
(<<pipeline-final>>).

| caso | antes | depois | prova |
|---|---|---|---|
| **C1** endpoint `NONE`, `saasAllowed:"no"` | card `FortiEndpoint` prioritário; papel sem tier | card linha `FortiEndpoint`, `h4` **FortiEDR**, `item-id=fortiedr`, `acao=avaliar-aquisicao`, prioritária, «Variante resolvida pelo contexto declarado — linha de produto: FortiEndpoint»; zero veto; papel igual, com tier | `REC1 (a)`, `PAP1`, `LEG1 (g)` |
| **C2** EDR de terceiro em produção | card `FortiEndpoint` prioritário | **zero card**; 1 veto `operacional` «tecnologia operacional — apoio em operacionalização (nunca substituição)» · «Tecnologia declarada: CrowdStrike Falcon (production, saas)»; papel imprime a seção só com o bloco | `REC1 (b)`, `LEG1 (e)`, `PAP1` |
| **C3** FortiSOC só em `soc-platform` | card `FortiSOAR` prioritário | card `FortiSOAR` prioritário + `condicao=capability-nao-informada` visível; zero veto (hipótese condicionada; lacuna do engine → `EA-122`) | `LEG1 (c)` |
| **C3b** FortiSOC na própria `security-automation` | card `FortiSOAR` (defeito classe C2) | zero card; veto `operacional` com «(M75)» · «Tecnologia declarada: FortiSOC (production, saas)» | `LEG1 (c)(e)` |
| **C4** Sentinel em produção | `FortiAnalyzer` + `FortiSIEM` prioritários | zero card; `data-p53-vetos="2"` (FortiAnalyzer, FortiSIEM) · «Tecnologia declarada: Microsoft Sentinel (production, saas)» | `REC1 (b)`, `LEG1 (e)` |
| **C4-DL** C4 + `detection-lifecycle: 0` | `FortiSIEM` prioritário ao lado do veto (estado alcançável só por fusão) | zero card `FortiSIEM`, `li[data-p53-veto-item="FortiSIEM"]` presente, `published()` sem `FortiSIEM` | `REC1 (j)` (nasce verde; poder só em `D026-M5`) |
| **C5** legado, sessão de referência | 9 cards (7 validação · 2 prioritária); papel **0/9** com qualificador, sem «Escopo» | mesmos 9 cards e tiers, cada um com `condicao=sem-contexto`; papel **9/9** com tier e condição; «Escopo: cobre a camada de endpoint…» no `FortiEndpoint` e o escopo do mapa no `FortiRecon` | `PAP1` |
| **C6** NDR `NONE`, `saasAllowed:"no"` | card `FortiNDR` prioritário | card linha `FortiNDR`, `h4` **FortiNDR (On-Premises)**, `item-id=fortindr-onprem`, prioritária; curável como `FortiNDR` | `REC1 (c)` |
| **C7** FortiEDR on-prem, staffing gap | `FortiEndpoint` (validação) + `SOCaaS` (prio) + **`MDR` (prio)** | **1 card** `FortiGuard SOCaaS` (`servico`, prioritária, «Elegível: sem restrições»); vetos: `FortiGuard MDR` («…— OG oficial» literal) e `FortiEndpoint` («nunca substituição» · FortiEDR production, on-prem · extensão contextual `FortiXDR`, M50); `data-p53-vetos="2"` | `REC1 (d)(f)(h)`, `LEG1 (e)`, `PAP1` |
| **C7-UNSET** `endpoint-detection` não declarado | MDR hipótese, zero veto | igual: MDR permanece hipótese (D-6), zero veto | `LEG1 (b)` (nasce verde, declarado; poder em `D026-M6`) |
| **C8** legado, endpoint lv0 | `FortiEndpoint` prioritário | igual + `condicao=sem-contexto` visível em tela e papel | `LEG1 (a)` |
| **C9** sinal `dataLeakageConcern` | `FortiDLP` validação, sinal preservado | igual (`conversa-por-sinal`, `origem=sinal`, 2 capabilities) + qualificador e origem no papel | `PAP1`; `D022-PROD1` |
| **C10** `saasAllowed:"yes"` | 3 cards prioritários | iguais, modo motor; `FortiSIEM` com `variantes="fortisiem, fortisiem-cloud"` e «Disponível também como FortiSIEM Cloud»; sem card Cloud | `REC1 (e)(h)` |
| **F2-placeholder** | card `FortiEndpoint` · validação | card `FortiEndpoint` · `modalidade-a-definir` · após validação · `cards == published()` | `REC1 (i)`; `D023-REG1` |
| **GF** (gate fechado, 2 variantes) | cards de hipótese | cards de hipótese com `contexto-a-validar`, zero veto | `LEG1 (d)` (sem carrasco próprio, dívida declarada) |

**Delta visível declarado** (o que o cliente passa a ver): vetos com a razão do
motor e a tecnologia declarada; título pela variante resolvida; condição da
hipótese visível; tier, ação, variante, escopo e vetos no PDF. **Não muda**: o
número de cards por si (C5 mantém 9; o 9 não é requisito), os textos de tier, o
aviso de supressão, a ordem do relatório, `decisions`, o payload M41.

## Testes executados — contagens literais

Cada linha: o que, onde, resultado, fonte. «Citado» = li no corpo do commit, no
registro canônico ou no log da W4/W4b e não reexecutei; esta escrita **não
reexecutou suíte**.

| quando | execução | resultado | fonte |
|---|---|---|---|
| red `7678222` | `node tests_026_contrato.js` | `D026 CONTRATO: 0 PASS · 3 FAIL de 3` (REC1 cai em (a) por `__CURATION.oferta` ausente; PAP1 em (a) C5 0/9; LEG1 em (a)) | `red-026.md`; planning-state `red` |
| red | regressão `d019` · `d022` · `d023` · `d025` | 14/14 · 14/14 · 9/9 · 16/16 | corpo de `7678222` |
| W2 `6ace994` | `d019` · `d022` · `d023` · `d025` | 14/14 · 14/14 · 9/9 · 16/16 | corpo do commit |
| W2 | `m48` · `engine` | 97/97 · 105/105 | idem |
| W2 | preflights `d019`/`d022`/`d023`/`d025` | íntegros (d023: 12 mutantes — errata E10) | idem; planning-state |
| W2 | `node tests_026_contrato.js` | ainda `0/3` (alíneas de DOM são da W3) | idem |
| W3a `816d605` | `D026 CONTRATO` | **3 PASS · 0 FAIL de 3** | corpo do commit |
| W3a | `d019` · `d022` · `d023` · `d025` | 14/14 · 14/14 · 9/9 · 16/16 | idem |
| W3a | `d010` · `d015` · `d021` | 13/13 · 5/5 · 8/8 | idem |
| W3a | `p52layout` · `p50core` | 45/45 · 65/65 | idem |
| W3a | âncoras de mutante · `lint-arch` | 13 byte-iguais · 0 problema(s) | idem |
| W3a | `d014 regra_morta` | **4 PASS · 3 FAIL de 7** — censo do CSS 33 → 52 regras; repin por execução na W4 | idem; log da T030 |
| W3a | `d022` preflight | `D022-M10` com `ocorrencias ≠ 1` neste arquivo até a W4 (janela prevista) | idem |
| W3b `dc5b633` | `D026 CONTRATO` · `d019` · `d025` | 3/3 (`LEG1 (g)` mede «apresentado como FortiEDR») · 14/14 · 16/16 | corpo do commit |
| W3b | preflights `d019`/`d025` · `gateFechado` e handler | íntegros · byte-iguais (`D019-M10`, `D025-M18`) | idem |
| W4 `3560ba6` | reancoragem `D022-M10` em `ui_curation_v32.js` | preflight `d022` 13/13; campanha `d022` 13 DETECTADO (`D022-M10` pelo motivo nominal, contra HTML reconstruído); `find`/`repl`/`reason` byte-iguais | corpo do commit; log da campanha `d022` |
| W4 `6182ef6` | trilha E13 em `D019-SOL1`, `D019-SOL3 (b)`, `D019-MED1` | corpo byte-idêntico (diff fora de comentário vazio); `d019` 14/14; preflight `d019` 17/17 | corpo do commit |
| W4 `5a99293` | harness `d026`, registros, censo | campanhas sequenciais `d019` **17/17** · `d022` **13/13** · `d023` **12/12** · `d025` **23/23** DETECTADO; `d026` 5 DETECTADO · **1 SOBREVIVENTE** (`D026-M5`, gate cego — errata E12) | corpo do commit; logs `026-W4-campanha-*.log` |
| W4 | `d014 regra_morta` após censo remedido | **7 PASS · 0 FAIL de 7** (CSS da camada 6: 33/205/3 → **52/298/5**) | corpo do commit; log `026-W4-d014.log` |
| W4 | `bash .claude/verify/run.sh` | 17 PASS · 1 FAIL — o FAIL é o stage `mutation` por **árvore suja** (campanhas exigem working tree limpo), antes do commit; os demais verdes (`baseline`, `boundary`, `build`, `lint-arch`, `regra-morta`, `state`, `tdd`, `fecho`, `m41`, `suites`) | log `026-W4-run.log` |
| W4 | `bash .claude/verify/compliance-audit.sh` | **17 PASS · 0 FAIL · 0 WARN** | log `026-W4-compliance.log` |
| W4b `993e371` | `D026 CONTRATO` (com `REC1 (j)`) | **3 PASS · 0 FAIL de 3** | corpo do commit; log `026-W4b-d026.log` |
| W4b | preflight `d026` · campanha `d026` | 6/6 âncoras · **6 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO** (27 s, 9 execuções da suíte; M5 cai em `REC1 (j)`) | `mutation_map.json → harnesses.d026._trilha`; logs `026-W4b-*` |
| W4b | stage `suites` · `check_tdd` · matriz | 0 problemas · 21 demandas, 2 waivers, 0 problema(s) · **207 pares** completos | logs `026-W4b-suites-stage.log`, `026-W4b-tdd.log`; commit |
| Fecho | `bash .claude/verify/run.sh` **e** `compliance-audit.sh` na árvore limpa, CI `verify` · `visual` · `fecho` | <<pipeline-final>> | — |
| Fase 6 | `spec-validate` | <<spec-validate>> | — |

Placar do red por alínea (`red-026.md`): nasceram verdes, declarados, `REC1 (h)`,
`LEG1 (b)`, `LEG1 (d)` e as metades puras de `REC1 (g)`, `LEG1 (a)`, `LEG1 (c)`-C3
e `LEG1 (f)`; o poder de `LEG1 (b)` está em `D026-M6`, o de `LEG1 (d)` é dívida
declarada. `REC1 (j)` nasceu verde por desenho na W4b e tem poder em `D026-M5`.

## Série de repins — executada × prevista

O plano previu a série `R0`…`R8` (com `R4a/b/c`); o planning-state registra a
consolidação (após o red, após o rebuild da W3, no fecho) em lugar dos «nove
previstos» — errata E11 da spec; R8 pede o mesmo PR, não um commit por wave.

| Previsto | Executado | Commit | Observação |
|---|---|---|---|
| R0 | R0 | `96369af` | `CONTEXT.md` e `specs/026` novos |
| R1 | R1 | `a02d411` | `tests_026_contrato.js`, `red-026.md`, `pareamento.md` |
| R2 · R3 | **R2** (fusão) | `102decc` | `ui_curation`, `ui_p52_support` `.js`/`.css`, editor e HTML, depois de W2–W3 |
| R4a · R4b · R4c · R5 | **R3** | `3f13100` | harness `d026`, registros, censo do CSS, trilhas (T040/T042/T044) |
| R6 · R7 · R8 | pendente | — | `993e371` (W4b), `fc5874f` (nota `__CURATION`) e os documentos desta entrega esperam o repin de fecho (<<pipeline-final>>) |

Classe do desvio: **fusão declarada**. Janela de `baseline` vermelho entre `6ace994`
e `102decc`: aceita.

## Janela vermelha — esperada × medida

| Após | `tests_026_contrato.js` esperado | medido | `suites` | `mutation` |
|---|---|---|---|---|
| W1 (red) | 0 PASS · 3 FAIL de 3 | **0 PASS · 3 FAIL de 3** | vermelho nomeado (fora do registro) | verde |
| W2 | 0/3 (alíneas de DOM caem) | **0/3** (citado do corpo de `6ace994`) | vermelho nomeado | d019/d022/d023/d025 DETECTADO esperado |
| W3 | 3/3 | **3/3** (`816d605`, `dc5b633`) | vermelho nomeado | `D022-M10` com `ocorrencias: 0` até a W4 (prevista) |
| W4 | 3/3 | **3/3** (`993e371`, com `REC1 (j)`) | verde (stage `suites`: 0 problemas) | **verde**: d019 17 · d022 13 · d023 12 · d025 23 · d026 6, todos DETECTADO |

## Campanha e pipeline — custo medido

Cinco campanhas sequenciais, nunca em paralelo (mutam in place):

| campanha | mutantes | DETECTADO · SOBREVIVENTE · NÃO EXECUTADO | custo |
|---|---|---|---|
| `d019` | 17 | 17 · 0 · 0 | duração não registrada no log lido; o log traz, antes da lista, um traço de `heap out of memory` do stderr de um processo filho (origem não investigada por mim; o veredito é 17/17) |
| `d022` | 13 | 13 · 0 · 0 (`D022-M10` DETECTADO no arquivo novo) | idem |
| `d023` | 12 | 12 · 0 · 0 | idem |
| `d025` | 23 | 23 · 0 · 0 | 619 s; 5 execuções da `m48` |
| `d026` (1ª, W4) | 6 | 5 · **1** · 0 (`D026-M5`) | 27 s; 9 execuções da suíte |
| `d026` (W4b, após `REC1 (j)`) | 6 | **6 · 0 · 0** | 27 s; 9 execuções da suíte |

Alíneas que derrubam cada mutante da `d026` (`D026_MUT_LOG`): `M1` `REC1 (a)`; `M2`
`PAP1 (a)` 0/9; `M3` `REC1 (a)` + `LEG1 (g)` (vácuo nomeado); `M4` `REC1 (b)` C2 +
`PAP1 (c)` C7 + `LEG1 (c)` C3b; `M5` `REC1 (j)`; `M6` `LEG1 (b)` (fonte:
`mutation_map.json → harnesses.d026._trilha`). Mutante que sobreviveu acusou o
**gate**, não o código (lição de rename e de controle em árvore inteira): nada foi
afrouxado, uma alínea foi acrescentada. `mutation` local pode acusar por
`poppler-utils`/Playwright ausentes (KI-3); a canônica é o job `visual`. Pipeline
completo e `compliance-audit` finais: <<pipeline-final>>.

## Erratas nascidas da execução — E1 a E12

Registradas no fim de `spec.md` §Erratas. Nenhuma afrouxa gate, alínea ou mutante; a
E12 acrescenta uma alínea e nenhuma contagem de gate muda:

| # | tema | classe |
|---|---|---|
| E1 | `entradaViva()` traz `solucoes` | aditiva |
| E2 | veto ganha `notas[]` | aditiva |
| E3 | «sinal requerido ausente» é abstenção | divergência declarada |
| E4 | laço por sinal roda sob suficiência fechada | divergência declarada |
| E5 | `veto.itemId` = primeira oferta relacionada não-família | registro |
| E6 | `__P50SUFF` ausente ⇒ `suficiente=false` | registro |
| E7 | entrada nula ⇒ `coletar(true)` + `console.error` | registro |
| E8 | «Ação sugerida:» (não «Próximo passo») | registro |
| E9 | orçamentos medidos (597 · 1105) | registro |
| E10 | preflight d023 = 12 mutantes | registro |
| E11 | repins consolidados (R0 a R3), não nove | registro |
| E12 | `D026-M5`: mecanismo de C7 e alínea `REC1 (j)` (fixture C4-DL) | divergência declarada — o gate ganhou uma alínea, nenhuma foi afrouxada |

A E10 também corrige a prosa de `tasks.md` (nota sob a matriz de mutantes) e do
`plan.md` §Janela vermelha («d023 11»): lê-se 12. A E12 corrige a linha C3 da
spec e a linha M5 de `tasks.md`.

## Invariantes — impacto

| INV | efeito | prova |
|---|---|---|
| INV-1 engine byte-idêntico | zero linha; `V32.*` só lido | `D022-BND1`/`D023-BND1`; `baseline`/`build`/`m41` verdes na `run.sh` da W4; confirmação final: <<pipeline-final>> |
| INV-2 `UNSET` ≠ `NONE` | **reforçada**: base `UNSET`/`UNKNOWN` e «sinal requerido ausente» são abstenção, nunca veto | `D026-LEG1 (b)`, `D026-M6` |
| INV-3 suficiência; UI nunca dona | gate fechado = porta de saída, zero veto | `D010-F3`, `D026-LEG1 (d)` |
| INV-7 narrativa determinística | `reconciliar()` pura; texto = literal do engine + rótulo fixo | `D026-LEG1 (f)`, `D025-INV8` |
| INV-8 derivado nunca serializado | `oferta()`/`vetos()` fora de `toSession()`; `decisions` inalterado | `S4-S5`, `D019-INV8`, `D025-INV8` |
| INV-9 boundary | só classes `produto`/`generated` | stage `boundary` verde na `run.sh` da W4; final: <<pipeline-final>> |
| INV-10 PT-BR/nomes exatos | enums sem acento; ids do engine literais | `compliance-audit` 17/0/0 (W4); final: <<pipeline-final>> |

## Decisões pendentes — D-1..D-9 e residuais

Ratificação literal do proprietário, **por item**, no PR (T069):

| id | decisão | se invertida |
|---|---|---|
| D-1 | C2/C4 sem card de aquisição; veto visível com a nota literal | card da linha sem tier — **escalar** |
| D-2 | `CONTEXT_NOT_INFORMED` = hipótese condicionada, tier por `sev` | **parar e escalar** (35 gates da 010 por vácuo) |
| D-3 | `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false`; lacuna do engine ao backlog | `true` pela forma segura (`plataforma-declarada-cobre`, tier 2, nunca veto) |
| D-4 | vetos visíveis em tela e papel, por linha, razão literal | só no `diag()` |
| D-5 | serviços do motor e `fortixdr` não viram card sem linha no mapa | demanda própria |
| D-6 | condição da hipótese visível nos dois modos (inclusive legado) | só fora do legado |
| D-7 | título do card = item resolvido; `data-p53-sol-produto` = linha | `h4` = linha + sub-linha |
| D-8 | «condições» do acréscimo manual não existem no estado | demanda própria |
| D-9 | editor mostra «apresentado como <variante>» | zero linha no editor |

**Residuais declarados**: item sem par na Camada 1 (`chave:null`) publicável e
**incurável** — status quo, declarado no fecho do `EA-76`; os seis nomes de
2026-10-19 (`FortiMail`…, `FortiPAM`, `FortiAIGate`) seguem sem exclusão pelo
operador; `include` pré-025 sobre linha que o motor passa a vetar vira «escolha do
engenheiro» com selo; serviços do motor sem linha do mapa (D-5); `exclude` obsoleto
sem sujeito no arquivo de sessão (agora `EA-123`); `LEG1 (d)` e `LEG1 (f)` sem
carrasco próprio, a constante C3 pinada sem mutante e D-9 sem gate (as cinco dívidas
da matriz, junto de `D026-M3 → D023-REG1 (c)`, carrasco em suíte alheia); a exceção
do sinal (E3) sem alínea.

## EA no `BACKLOG.md`

| Achado | Status | Observação |
|---|---|---|
| `EA-76` | `aberto` → `resolvido` | fecho: fonte única, as duas direções, resíduo `chave:null` (itens sem par na Camada 1 publicáveis e incuráveis), medidas das campanhas |
| `EA-122` (novo) | `aberto` | lacuna do engine: `suppressedByPlatform()` não consultada em `CONTEXT_NOT_INFORMED` (`buildRecommendationContext()`, não `classify()`); dois descartes silenciosos; Porta B futura |
| `EA-123` (novo) | `aberto` | `exclude` obsoleto sem sujeito no arquivo de sessão (`ui_curation_v32.js`: `decidir`/`publicados`; `inclusoesSemLastro` cobre só `include`); fora da 026 |

Nenhum achado riscado. Conferência do backlog (`--rule=backlog` do
`compliance-audit`): execução final em <<pipeline-final>>.

## O aceite do `product-owner` e o `spec-validate`

`spec-validate`: <<spec-validate>>. Aceite de intenção: <<aceite-PO>>, contra o
`refinement.md`, a matriz acima (sonda re-executada sobre o HTML final) e os
aceites do plano do proprietário. Observações do PO e destino de cada uma:
<<aceite-PO>>.

## O que não foi executado, e por quê

- Job `visual` do CI, `playwright P8` e `P52-PDF5/6`: dependem de PR e de
  Chromium canônico. Se divergirem, é **PARADA**: primeiro layout (tier + condição
  numa linha do `pr-card`), repin de BASELINE só com autorização nominal do
  proprietário (§29.4).
- Pipeline final (`run.sh` e `compliance-audit.sh` sobre a árvore limpa depois do
  repin de fecho): <<pipeline-final>>. A `run.sh` da W4 tem 1 FAIL conhecido (stage
  `mutation`, árvore suja).
- Execuções das waves citadas aqui são das mensagens de commit, do planning-state e
  dos logs da W4/W4b; esta escrita **não reexecutou suíte**.
- Deploy em `127.0.0.1:1337`: do proprietário.

## Lição

1. A conferência no código antes da spec valeu três correções ao desenho vencedor
   (precedência, D-4, C3 desligada) — nenhuma apareceu em juízo, todas em leitura de
   `ui_v32.js` e do `engine_v32.js`.
2. O mesmo método falhou uma vez, e a campanha de mutação o pegou: a spec e o
   `tasks.md` narraram, sem medir, que C7 exercia a precedência da fusão. Mutante
   que sobrevive acusa o gate; o mecanismo certo estava no lado produto (C4-DL) e
   foi achado por diagnóstico, não por raciocínio. Registrado pelo `doc-writer` como
   proposta; a escolha da lição que fica é do `product-owner`.

## Trilha de modelos

O orquestrador e os agentes `general-purpose` rodaram em Fable 5.1
(`claude-fable-5-1`); a W3b rodou em Sonnet. Os 18 commits trazem
`Co-Authored-By: Claude Fable 5.1` (trailer do orquestrador, medido por mim; **não**
identifica o agente que escreveu cada alteração).

**Desvio declarado, não achado**: os papéis declarados em `.claude/agents/*.md`
(por exemplo `core-engineer` → `opus`, `ui-engineer` → `sonnet`) **não** foram usados
como `agentType`. Os papéis foram exercidos **por lente** em agentes
`general-purpose`: o `model:` do arquivo do papel não governou a execução.

## Estado da Fase 6 — o que falta, e quem fecha

| Condição | Estado | Quem fecha |
|---|---|---|
| W4 (reancoragens, harness, registros, campanhas) | **fechada** (`3560ba6`, `6182ef6`, `5a99293`, `993e371`, `3f13100`) | `qa-engineer` |
| W5 (nota do `__CURATION` em `bridges.json`) | feita em `fc5874f`; repin de fecho, pipeline e CI pendentes (<<pipeline-final>>) | `build-engineer` |
| `spec-validate.md` | <<spec-validate>> | `qa-engineer` |
| Aceite de intenção | <<aceite-PO>> | `product-owner` |
| `BACKLOG.md` (EA-76, EA-122, EA-123) | **inserido** (aguarda repin) | `doc-writer` |
| Erratas E1–E12 em `spec.md`; M5 em `tasks.md` | **inseridas** (aguardam repin) | `doc-writer` |
| `design-decisions.md` (D-1, D-2, D-7) | **só após ratificação literal** | `product-owner` |
| Push + PR + `phase: done` | PR <<PR>> | orquestrador |
| Ratificação D-1..D-9 e merge (*Create a merge commit*, nunca squash) | pendente | proprietário |
| Deploy | fora desta demanda | proprietário |

## Fontes citadas

`.claude/project-memory/planning-state/026-decisao-unica-do-apoio.json`;
`specs/026-decisao-unica-do-apoio/{refinement,spec,plan,tasks,red-026}.md`;
`anexos/{desenho-sintese,refutacao-reproducoes,pareamento}`; `.claude/BACKLOG.md`
(`EA-76`, `EA-121`, `EA-122`, `EA-123`); `.claude/verify/mutation_map.json →
harnesses.d026._trilha` e `harnesses.d022._trilha`; `expected_suites.json → suites.d026`;
commits `2cc513a` `96369af` `4041ec7` `7678222` `a02d411` `193ee84` `6ace994`
`7c95f31` `816d605` `dc5b633` `102decc` `ab666e2` `3560ba6` `6182ef6` `5a99293`
`3f13100` `993e371` `fc5874f`; logs da W4/W4b no scratchpad do orquestrador
(`026-W4-campanha-*.log`, `026-W4-d014.log`, `026-W4-run.log`,
`026-W4-compliance.log`, `026-W4b-*`); medições diretas desta escrita: `git log
--oneline 9509e4b..HEAD`, `git diff --stat`/`--numstat 9509e4b..HEAD`, `git show
HEAD:<arquivo> | wc -l`, leitura de `engine_v32.js`, `ui_curation_v32.js`,
`ui_p52_support_v32.js` em `HEAD`.
