# Spec — 010-recomendacao-sem-vao

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Eliminar o **vão de contexto parcial**: o relatório não pode ter estado em que
declarar contexto **subtrai** conteúdo, nem afirmar que preserva uma leitura que
ele mesmo oculta. A arbitragem de camada passa a perguntar *"há substituto?"*, o
card de prática-alvo passa a nomear **habilitador a validar** a partir do catálogo
congelado, e a leitura base sem contexto vira **bloco de ausência**.
Link: [refinement.md](refinement.md) — enquadramento, cadeia arquivo:linha→efeito
(A1–A6), rotas V1–V6 e casos de borda C1–C18 são vinculantes e **não** são
repetidos aqui. Vocabulário obrigatório em [CONTEXT.md](../../CONTEXT.md)
(verbetes *Habilitador*, *Habilitador a validar*, *Vão de contexto parcial*,
*Arbitragem de camada*, *Convergência no card*, *Bloco de ausência*).

## Autorização nominal §29.4 — registro (consumada)

**Trilha de auditoria.** `ui_v32.js` e `ui_target_v32.js` são protegidos por
`specs/PHASE_5_0_REV_B.md:1616` e pinados por quatro gates vivos (abaixo). A
autorização da 009 é explicitamente intransferível (`tests_p50_core.js:137-139`),
e o `refinement.md` parou nesse ponto (P11, ESCALAR).

| Campo | Registro |
|---|---|
| **O que foi autorizado** | Edição, **exclusivamente no escopo da demanda 010**, de `ui_v32.js` e `ui_target_v32.js` |
| **Quem autorizou** | O proprietário |
| **Quando** | 2026-08-30 |
| **Onde** | No chat, em resposta à escalação P11 do refinamento |
| **Precedente do rito** | As autorizações nominais já registradas no mapa `PROTECTED` (`tests_p50_core.js:82-141`), com trilha e "Identidade anterior" |
| **Consequência de identidade (R8)** | Os hashes inline de `PROTECTED` são repinados **depois** de os dois arquivos alcançarem o estado final, citando esta seção; o mapa é consumido por **quatro** gates: `P50-GOV1` (`tests_p50_core.js:397`), `P50-SUF0` (`:1314`), `P50-SUF8` (`:1965`) e `P50-IC4` (`:2707`, alínea (a), que pina `ui_v32.js`). O registry `.claude/verify/pins.json` é regenerado por `gen_pins.py` em **commit separado**, porque ele pina blobs de `HEAD` |

Esta autorização **não** amplia a boundary para outras demandas nem para outros
arquivos. **Qualquer outro arquivo da §29.4 exige nova frase do proprietário** — e
o desenho abaixo foi escolhido, entre as rotas possíveis, justamente por não
precisar de nenhum: nenhuma suíte congelada muda de asserção, nenhum CSS novo
nasce, e `ui_p52_workspace_v32.js` não é tocado.

## Restrições de desenho — o que torna esta rota livre de nova ratificação

Cada restrição abaixo existe porque a alternativa exigiria autorização nova ou
enfraqueceria gate alheio (R10 §1). Elas são vinculantes para o plano.

| # | Restrição | Por quê |
|---|---|---|
| **R-1** | `tgtEnablerState()` e `tgtAbsenceHTML()` (`ui_target_v32.js:199-248`) permanecem **byte-idênticos**, e o habilitador a validar **nunca** é emitido com a classe `.ux-tgt-en` | O oráculo da 009 deriva S1–S4 do payload do engine (`fixtures_009_leitura.js:110-125`), não do DOM. Preservando o estado e a classe, `D009-UNS1/UNS2/UNS3/UNS4/ABS1` continuam verdes **sem editar `tests_009_leitura.js`** — e os critérios C10/C14 da 009, ratificados pelo proprietário em 2026-08-27, não são reabertos |
| **R-2** | **Zero CSS novo.** Toda apresentação reusa classes já existentes (`.ux-tgt-en*`, `.ux-mut`, `.pr-mut`, `.v32-block`, `.v32-neutral`, `.section-title`/`.eyebrow`) | `ui_v32.css` e `ui_ux_v32.css` são §29.4 e **não** estão autorizados |
| **R-3** | Nenhum `window.__*` novo. A tabela de equivalência e o predicado de arbitragem são expostos **só** por `window.__DEV` (superfície de teste já registrada em `bridges.json`), pelo padrão que `ui_target_v32.js:378-381` já usa | Bridge novo exigiria entrada em `bridges.json` (R9 §2); `__V32UI` não pode crescer sem risco ao regex de `P50-IC4` (`tests_p50_core.js:2710`) |
| **R-4** | `ui_p52_workspace_v32.js` **não é tocado** | `P52-REC1` (`tests_p52_layout.js:538-539`) reprova qualquer `/Forti[A-Z]/` no owner de layout. O habilitador vive no card (`ui_target_v32.js`) e a arbitragem em `ui_v32.js` |
| **R-5** | `HIDE_EYEBROWS` (`ui_v32.js:109-110`) e a **regra** de varredura de `hideLegacyRecommendation` (`:164-194`) permanecem byte-idênticas: muda **só** o valor do argumento `hide` | `U15` (`tests_ui_m31.js:268`) mede o alcance da varredura; ampliar ou reduzir o alcance é outra demanda |
| **R-6** | `engine_v32.js` e `quickscan_secops_soccmm_v3_1_3.html` são **lidos**, nunca escritos | `frozen` em `boundary.json:9-14`; V6 recusada no portão |

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).
Suíte nova: `tests_010_vao.js`, namespace exclusivo `D010-*` (R10 §1), jsdom, sem
Chromium. Registro em `.claude/verify/expected_suites.json` no MESMO PR (R10 §3),
com a contagem fixada pelo `qa-engineer` no verde. Campanha nova:
`tests_010_mutants.js`, harness `d010` em `.claude/verify/mutation_map.json`
(`requires: [node, python]`; alvos: `ui_v32.js`, `ui_target_v32.js`,
`tests_010_vao.js`, `fixtures_010_vao.js`, `tests_010_mutants.js`).

**Fixtures.** Locais à demanda, em `fixtures_010_vao.js` — `fixtures_p52.js` e
`fixtures_p50.js` são artefatos de outra fase e não são alterados. Todo estado é
aplicado pelos **owners canônicos** (`__DEV.setAnswerById`, `__DEV.setPriorities`,
`__DEV.setTarget`, editor de contexto + `#v32save`), nunca por escrita direta de
derivado. Fixture que não alcança o estado declarado faz o gate morrer **vacuoso**
e por isso cada uma declara seus estados, no padrão `d009AssertFixtureStates`.

| Fixture | Estado declarado |
|---|---|
| **D010-F1 · vão canônico** | 15 respostas confirmadas (suficiência **ABERTA**), nível 0 em `automation`, `endpoint`, `network-visibility`, `external-surface`; landscape **100% UNSET**; **única** declaração de contexto: `#v32-arch-saasAllowed = "yes"` (tira do legado sem anexar serviço nem candidato — `engine_v32.js:305-311`); prioridades `["automation","endpoint"]`; alvos nos quatro qids. Reproduz o estado do relatório do cliente (P10) |
| **D010-F1b · vão sem prioridades** | D010-F1 sem `setPriorities` — exercita o ramo `!hasPrio` (`quickscan_…:991-996`) |
| **D010-F2 · substituto presente** | D010-F1 + `security-analytics` declarada `NONE` **com `logs` no nível 0** (⇒ `TECHNOLOGY_WHITESPACE`, candidatos DIRECT: `fortianalyzer`, `fortisiem`, `fortisiem-cloud`) + alvo em `logs`. É o par de C8. *(Errata de 2026-08-30, achada por sonda do `tech-lead` na Fase 2: a redação original não fixava o nível de `logs`. Com `logs` em 2, o estado é `POSSIBLE_CONTEXT_DIVERGENCE`/`VALIDATE` com **zero** candidatos — `D010-CARD2`(a) ficaria vacuoso e `D010-ARB2`(b) falharia. Medido no engine, não inferido.)* |
| **D010-F3 · gate fechado** | Vetor de `fixtures_p50.js · P50_F2` (4 confirmadas + 1 "NA" ⇒ suficiência **FECHADA**) + `saasAllowed="yes"` + 1 alvo com `MAP` não vazio |

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| C1 | **O vão deixa de existir.** Sem substituto da camada V3.2, a recomendação congelada permanece **visível**: declarar contexto nunca subtrai conteúdo | `D010-ARB1` · `tests_010_vao.js` · fixture `D010-F1`. Confere: (a) `V32.isLegacyModeV32() === false` (pré-condição da fixture, senão gate vacuoso); (b) nenhum `.section-title` cujo `.eyebrow` esteja em `HIDE_EYEBROWS` carrega `.v32-hidden`; (c) os `.apoio-block` e `.t-list` contíguos a eles também não; (d) o censo de nós visíveis da Camada 1 é **item a item idêntico** ao de um segundo render da MESMA sessão em modo legado (oráculo por comparação, montado pela suíte — não lê o predicado do produto) | **M1**: em `ui_v32.js`, devolver o argumento de `hideLegacyRecommendation` ao predicado antigo (`V32.isLegacyModeV32()` ⇒ `true` no ramo não-legado) → `D010-ARB1` DEVE falhar em (b), nomeando os títulos ocultos |
| C2 | **Com substituto, a supressão vigente é preservada.** Quando a camada V3.2 tem o que pôr no lugar, a leitura congelada é ocultada como hoje | `D010-ARB2` · `tests_010_vao.js` · fixture `D010-F2`. Confere: (a) os títulos de `HIDE_EYEBROWS` **presentes** estão todos com `.v32-hidden`; (b) `#v32support` traz ≥1 `.v32-card` com candidato ou serviço; (c) nenhum outro `.section-title` da tela ficou oculto (sem transbordo) | **M2**: o predicado devolver sempre `false` (nunca ocultar) → `D010-ARB2` DEVE falhar em (a). Mutante escolhido de propósito: ele **passa** em `D010-ARB1`, provando que fechar o vão e preservar a supressão são propriedades distintas e precisam de gates distintos |
| C3 | **A arbitragem é tudo-ou-nada, com alcance inalterado.** O conjunto visível da Camada 1 é ou o do modo legado, ou vazio — nunca um terceiro; e nenhum nó fora dos três títulos e de seus blocos contíguos é atingido | `D010-ARB3` · `tests_010_vao.js` · fixtures `D010-F1`, `D010-F2`, `D010-F3`. Confere, nas três: (a) o conjunto de nós com `.v32-hidden` na seção de apoio é ∅ **ou** exatamente {três títulos presentes} ∪ {`.apoio-block`/`.t-list`/`.t-details` contíguos}; (b) `#review`, `#restart`, "Capabilities a validar" e o `<details>` de "demais gaps altos" **nunca** recebem `.v32-hidden`; (c) sob `D010-F3` (gate FECHADO) o conjunto visível é **idêntico** ao do modo legado — V1 nunca amplia a exposição da Camada 1 | **M3**: remover a interrupção `hiding=false` no nó não-permitido (`ui_v32.js:193`) → FAIL em (a)/(b). **M4**: acrescentar `banner-ok` à lista de permitidos → FAIL em (b) |
| C4 | **Os dois ramos seguem a mesma arbitragem.** Sessão sem prioridades declaradas ("Como a Fortinet pode apoiar agora") não fica de fora | `D010-ARB4` · `tests_010_vao.js` · fixture `D010-F1b`. Confere: (a) o título "Como a Fortinet pode apoiar agora" está presente e **visível**; (b) o `apoioAgora` contíguo está visível; (c) a mesma sessão com prioridades (`D010-F1`) dá o mesmo veredito de arbitragem | **M5**: arbitrar apenas quando `hasPrio` (condicionar o argumento à existência de prioridades) → FAIL em (a) |
| C5 | **INV-7 · nenhuma superfície afirma preservação de leitura oculta.** A frase de `ui_v32.js:615` só pode ser impressa quando a leitura que ela cita está de fato visível — e no papel, onde a Camada 1 nunca é impressa, ela nunca aparece | `D010-INV7` · `tests_010_vao.js` · (a) sob `D010-F2` (congelado oculto): **nenhum** nó da tela casa `/Leitura V3\.1\.3 preservada/`; (b) sob `D010-F1` (congelado visível): se a afirmação existir, os blocos citados estão visíveis no MESMO render; (c) em `#v32-print-report`, sob **qualquer** fixture, a afirmação **nunca** ocorre; (d) regressão da frase pinada por `V10` (`tests_ui_m32.js:150`): o card de prioridade continua trazendo "nenhum produto é inferido sem contexto" e nenhum `/Forti[A-Z]/` | **M6**: emitir a afirmação de preservação incondicionalmente em `baseCardHTML` → FAIL em (a) e (c) |
| C6 | **Leitura base vira bloco de ausência** (V3, verbete canônico): um aviso único com contagem e **lista nominal** das capabilities afetadas, nas duas superfícies | `D010-ABS1` · `tests_010_vao.js` · fixture `D010-F1`. Confere: (a) `#v32base` contém **exatamente 1** nó `[data-v32-absence="base-context"]` e **zero** `.v32-card`; (b) o texto declara que o contexto **não foi informado**, traz a contagem e nomeia **exatamente** o conjunto de capabilities cuja apresentação é `base` no mesmo render (conjunto derivado pelo oráculo a partir de `V32.buildRecommendationContext()`, nunca do DOM); (c) não afirma ausência de tecnologia (`/(ausência de\|não (há\|possui\|existe\|tem))\s+(tecnologia\|ferramenta)/i`) e não conclui sobre processo/pessoas/governança; (d) o mesmo censo após dois renders consecutivos (idempotência); (e) no papel, `#pr-sup-base` traz o mesmo aviso, sem controle; (f) o bloco de prioridades (`#v32prio`) **não** é alterado | **M7**: emitir o aviso sem a lista nominal → FAIL em (b). **M8**: manter os N cards e apenas somar o aviso → FAIL em (a) |
| C7 | **Habilitador a validar no card, ancorado no nível ATUAL confirmado.** Existe **se e somente se**: prática-alvo em **S2** (contexto não declarado, landscape aplicável), resposta atual **confirmada** (0..3), `MAP[qid].lv[atual].c` não vazio e gate de suficiência ABERTO | `D010-CARD1` · `tests_010_vao.js` · fixture `D010-F1`. Confere, por prática-alvo: (a) as quatro práticas em S2 trazem um nó `[data-ux-enablers="a-validar"]` cujos itens são **exatamente** `MAP[qid].lv[ans[k]].c`, na ordem do catálogo; (b) o rótulo de cada item é "a validar" (`.ux-tgt-mode`) e o nó traz a fórmula de §UAT-07 "validar aderência" (`ui_v32.js:994`), sem "apoio direto"; (c) o nó nomeia a origem (gap + catálogo da sessão) e **não** afirma que o item foi identificado pelo contexto declarado; (d) prática com resposta `null`/`"NA"` **não** produz o nó; (e) prática em **S3** ou **S4** **não** produz o nó; (f) serviço e produto-a-validar não são apresentados como o mesmo tipo de item (C17 do refinamento) | **M9**: ler `MAP[qid].lv[TARGET_PROFILE.overrides[qid]]` (nível-alvo) → FAIL em (a), com os itens do nível errado nomeados (**INV-5**). **M10**: emitir o nó quando `ans[k]` é `null`/`"NA"` → FAIL em (d) |
| C8 | **Precedência de fonte: a fonte com contexto ganha.** Capability com candidato do engine **nunca** recebe item do `MAP`; serviço do engine não bloqueia o `MAP` | `D010-CARD2` · `tests_010_vao.js` · fixture `D010-F2`. Confere: (a) a prática `logs` (capability com candidatos DIRECT) traz **só** a linha `.ux-tgt-en` do engine, sem `[data-ux-enablers="a-validar"]`, ainda que `MAP["logs"].lv[0].c` seja não vazio; (b) prática cuja capability tem **apenas serviços** (nenhum candidato) e está em S2 continua recebendo o nó a validar; (c) nenhum nome de produto aparece duas vezes no mesmo card | **M11**: concatenar `MAP` aos candidatos do engine sem a precedência → FAIL em (a) e (c) |
| C9 | **INV-3 não é importada mais fraca.** Sob gate de suficiência **FECHADO** nenhum habilitador a validar é publicado, em nenhuma superfície — mesmo que a Camada 1 nomeie produto nesse estado (`quickscan_…:933`) | `D010-CARD3` · `tests_010_vao.js` · fixture `D010-F3`. Confere: (a) `tgtComparisonPublishable(tgtCurrentProfile()) === false` (pré-condição declarada); (b) **zero** `[data-ux-enablers="a-validar"]` na tela e em `#v32-print-report`; (c) a decisão é **consumida** da fonte canônica já usada pelo card, não recalculada: o oráculo prova que alterar `dataSufficiency` altera o veredito do card (a UI não é dona da decisão — moeda UI-009A); (d) o `gateNote` de `ui_target_v32.js:129` permanece | **M12**: publicar o habilitador a validar ignorando o gate → FAIL em (b) |
| C10 | **Um habilitador, uma vez, um nome, um ícone.** A equivalência `PRODUCTS` (chave por nome) ↔ `OFFERINGS`/`SERVICES` (id minúsculo) é **declarada**, total sobre as 11 chaves de produto do `MAP`, e nunca derivada por heurística sobre o nome | `D010-CARD4` · `tests_010_vao.js` · (a) a tabela, lida como **dado** por `window.__DEV`, cobre as 11 chaves distintas de `c.p` do `MAP` — cada uma com um id de `OFFERINGS`/`SERVICES` **ou** o valor explícito de "sem equivalente V3.2"; chave nova sem entrada = FAIL nomeando a órfã; (b) todo item com equivalência é exibido com o **nome do catálogo V3.2** e `data-eid` igual ao id equivalente; sem equivalência, com `PRODUCTS[c.p].n` e `data-eid` estável; (c) em nenhum card há dois `.ux-tgt-enabler` com o mesmo `data-eid` ou o mesmo nome; (d) o markup de ícone de um item a validar é **idêntico** ao do mesmo item vindo do engine (regressão viva de `N46+K`, `tests_journey_m45.js:280`); (e) o código não casa nenhuma normalização de nome (`toLowerCase()`/`replace` sobre `c.p`) como fonte de equivalência | **M13**: remover uma entrada da tabela → FAIL em (a). **M14**: emitir o item com `data-eid = c.p` cru quando há equivalência → FAIL em (b)/(d) |
| C11 | **INV-4 na leitura.** O `TGT_DISCLAIMER` permanece na **mesma superfície** que os habilitadores, e o habilitador nunca é apresentado como o caminho para o delta | `D010-CARD5` · `tests_010_vao.js` · fixtures `D010-F1` e papel. Confere: (a) na tela, `.ux-tgt-disc` existe **dentro** do mesmo `#ux-tgt-cmp` que contém os `.ux-tgt-enabler`, e **depois** da lista de práticas; (b) no papel, o `.pr-card` com o disclaimer existe dentro de `#pr-target`, depois de `ovs`; (c) o texto do disclaimer é byte-idêntico a `TGT_DISCLAIMER` (`ui_target_v32.js:4`); (d) o nó do habilitador a validar **não** cita nível, score, delta nem estágio | **M15**: mover o disclaimer para fora do bloco de comparação (ou suprimi-lo quando há habilitador) → FAIL em (a)/(b) |
| C12 | **Coexistência com o aviso único da 009: sem órfão e sem contradição.** A prática em S2 continua nomeada no aviso e passa a exibir a linha a validar | `D010-CARD6` · `tests_010_vao.js` · fixture `D010-F1`. Confere: (a) existe **exatamente 1** `[data-ux-absence="target-enablers"]` e ele nomeia **exatamente** as práticas em S2 (mesmo conjunto que `D009-UNS1` mede); (b) essas mesmas práticas exibem `[data-ux-enablers="a-validar"]` e **nenhuma** `.ux-tgt-en` (R-1); (c) o texto do aviso é byte-idêntico ao produzido antes desta demanda para a mesma sessão (`tgtAbsenceHTML` intocada); (d) o nó a validar não contém "identificados", e o aviso não contém "validar aderência" — cada um diz a sua coisa | **M16**: emitir o nó a validar com a classe `.ux-tgt-en` → FAIL em (b), e também em `D009-UNS1` (prova cruzada de que o gate da 009 continua com poder discriminante) |
| C13 | **O papel fecha o vão por V2 + V3, e isso está escrito.** A arbitragem de camada é de **tela** por construção: `body.v32-print-mode .wrap{display:none}` (`ui_v32.css:77`) e `window.addEventListener("beforeprint", preparePrint)` (`ui_v32.js:1273`) fazem o papel ser sempre `#v32-print-report`, onde a Camada 1 nunca entra | `D010-PAPEL1` · `tests_010_vao.js` · fixture `D010-F1`, sobre `preparePrint()`. Confere: (a) `#pr-target` traz ≥1 habilitador a validar, com o mesmo conjunto de itens da tela; (b) `#pr-sup-base` é o aviso único de C6; (c) a ordem pinada do relatório impresso por `P51-DOC13` (`tests_p50_core.js:3857-3868`) permanece; (d) `#pr-support` continua ausente em modo legado (regressão de `P1`, `tests_ui_m332.js:60`) | **M17**: emitir o habilitador a validar só na tela (retorno vazio no ramo de papel) → FAIL em (a) |
| C14 | **Regressão congelada e fronteira intactas** | stages `suites` (`ui31` 19/0 · `ui32` 25/0 · `ui332` 23/0 · `ui333` 26/0 · `ux41` 56/0 · `target` 30/0 · `journey` 31/0 · `icons46` 12/0 · `engine` 105/0 · `p52layout` 45/0 · `d009` 15/0 · `p50core` 64/0 **após o repin**), `build` (rebuild byte-idêntico), `m41` (payload == pin declarado), `baseline` (repin coerente), `boundary`, `lint-arch`, `state`; campanha `d009` re-executada por gatilho de path (19 KILL / 19) | — (oráculos independentes já existentes; qualquer toque em `engine_v32.js` faria `m41` falhar, e isso é PARADA por Porta B) |

Gate sem mutante previsto não está pronto: **C14** apoia-se em oráculos
independentes já existentes e por isso não recebe mutante próprio.

## Comportamento especificado

### 1 · Arbitragem de camada — `ui_v32.js` (tela)

Entrada: `lastCtx = V32.buildRecommendationContext()` no ramo não-legado de
`renderBlocks` (`ui_v32.js:245`).
Saída: o argumento `hide` de `hideLegacyRecommendation` (`:277`) deixa de ser a
constante `true` e passa a ser **"há substituto?"** — predicado derivado, puro,
sobre `lastCtx.contexts`:

> **Há substituto** quando existe ao menos uma capability cuja apresentação é
> `card` (`presentationOf` ⇒ `"card"`, `ui_v32.js:624-634`) **e** cujo contexto
> traz ao menos um candidato, serviço ou nota, **e** cuja classificação **não** é
> `CONTEXT_NOT_INFORMED`.

- O ramo legado (`:237`) permanece intocado: `hide = false`, como hoje.
- A cláusula "classificação ≠ `CONTEXT_NOT_INFORMED`" existe porque serviços são
  anexados fora do `switch`, só por `hasGap` (`engine_v32.js:653-665`, achado A5):
  sem ela, um serviço sob `UNSET` desligaria a Camada 1 sem substituir nada.
- A cláusula "candidato/serviço/nota" existe porque `presentationOf` devolve
  `card` incondicionalmente para `supportMode === "VALIDATE"` (`:626`): uma
  capability em `NEEDS_VALIDATION` por resposta "não sei" produz card vazio, que
  não é substituto de recomendação nenhuma.
- **Resíduo declarado (C3 do refinamento).** O predicado é de **sessão**: numa
  sessão assimétrica (capability A com `NONE` + whitespace, capability B `UNSET`),
  há substituto, o congelado é ocultado e **B volta a ficar muda na seção de
  apoio**. O resíduo é fechado no card (C7) e sinalizado no aviso único (C6) — e
  fica **escrito aqui**, não escondido.
- Nada é serializado (INV-8) e nenhum estado novo nasce: o predicado é função da
  mesma estrutura que a tela já consome no mesmo passe.

### 2 · Bloco de ausência do contexto — `ui_v32.js` (tela e papel)

Entrada: `baseIds` em `buildSupportHTML` (`:669-672`) e em `buildPrintReport`
(`:1183`).
Saída: onde hoje há N `baseCardHTML`, passa a haver **um** aviso
(`[data-v32-absence="base-context"]`) com a contagem e a lista nominal das
capabilities afetadas, dentro do mesmo `#v32base` / `#pr-sup-base`.

- O bloco de prioridades (`#v32prio`, `:661-662`) **não muda**: prioridade nunca
  desaparece (`V10`/`V15`, `tests_ui_m32.js:142`/`:197`), e o card de prioridade
  continua sendo `baseCardHTML`.
- O bloco `#v32maturity` (`landscapeEnabled: false`) **não muda**: não há contexto
  a informar, logo não é bloco de ausência (`V16`/`V17`).
- O aviso declara **não-informação**; nunca ausência de tecnologia (INV-2).

### 3 · A frase do card base — `ui_v32.js` (INV-7)

Entrada: `baseCardHTML(id, c, "base")` (`:611-622`).
Saída: o trecho que hoje afirma *"Leitura V3.1.3 preservada"* passa a ser função
do **mesmo** veredito da arbitragem, no mesmo render:

- congelado **visível** (não há substituto) → o texto pode afirmar a preservação e
  apontar para ela; é verdade, e é o que distingue as duas leituras coexistentes
  na tela;
- congelado **oculto** (há substituto) → o texto **não** afirma preservação;
- **papel** → nunca afirma preservação, porque a Camada 1 nunca é impressa (C13).

A segunda oração — "nenhum produto é inferido sem contexto" — é preservada em
todas as variantes: ela é a promessa que o produto faz ao leitor e está pinada por
`V10`.

### 4 · Habilitador a validar — `ui_target_v32.js` (tela e papel)

Entrada: `tgtEnablersHTML(qid, semCtx)` (`:249-263`), o mesmo passe único que
deriva `semCtx` (`:133`) e que o papel repete (`:362-364`).
Saída: quando — e **somente** quando — a prática está em **S2**, a resposta atual
é confirmada, `MAP[qid].lv[ans[k]].c` é não vazio e a suficiência está ABERTA,
nasce um nó irmão `[data-ux-enablers="a-validar"]`, com os itens do catálogo
congelado rotulados **a validar**.

- **Ancoragem**: nível **ATUAL confirmado**, nunca o alvo (INV-5, P4 da 009).
- **Precedência**: capability com candidato do engine não recebe item do `MAP`
  (C4/P6 do refinamento) — a sessão mais bem informada nunca produz mais ruído
  que a menos informada. Serviços não bloqueiam.
- **Suficiência**: gate FECHADO ⇒ nada publicado (P7; B2 da 009).
- **Identidade**: um item, um nome, um ícone — pela tabela de equivalência
  declarada (C10).
- **S1 intocado**: a linha `.ux-tgt-en` de hoje não muda de forma, de texto nem de
  condição. **S3 e S4 intocados**: sob contexto declarado a autoridade é o engine,
  e listar produto do catálogo congelado ali contradiria a leitura informada; onde
  não há landscape aplicável não há contexto a validar.
- **Casos de borda já cobertos por construção**: nível atual 2 ou 3 ⇒ `lv[a].c`
  vazio ⇒ nada (C10 do refinamento, propriedade e não acaso); `revalidateTargets`
  remove a prática ⇒ o nó desaparece com ela, porque nasce no mesmo passe (C9).

### 5 · O que acontece no papel

O relatório impresso é **sempre** `#v32-print-report`: `preparePrint()` é chamado
em `beforeprint` (`ui_v32.js:1273`) e `body.v32-print-mode .wrap` é
`display:none !important` (`ui_v32.css:77`). Logo:

- a arbitragem de camada (V1) é decisão de **tela**, por construção;
- no papel, o vão é fechado por **V2** (`#pr-target`, via
  `__uxTargetPrintHTML`) e por **V3** (`#pr-sup-base`);
- os tiers T2/T3 da Camada 1 nunca foram impressos nesta build — `ui_v32.js` não
  os reproduz.

**Divergência com o refinamento, registrada e não corrigida em silêncio** (R2 §4):
o caso C15 do `refinement.md` afirma que "a supressão do vão vale também no
papel", com base em `quickscan_…:1065` + `ui_v32.css:2`. Isso descreve a Camada 1
isolada; na build V3.2 o `beforeprint` de `ui_v32.js` prevalece e a tela inteira
sai do papel. A consequência prática **fortalece** a demanda (sem V2/V3 o papel
não teria conserto algum) e corrige a cadeia do achado A6, que é de tela.

## Contratos

Nenhum estado canônico novo nasce nesta demanda; nada entra na sessão (INV-8).

| Dado novo | Forma | **Owner do estado** (R9 §5) | Consumidores |
|---|---|---|---|
| Predicado de arbitragem ("há substituto?") | Função **pura** de `lastCtx.contexts`; sem cache, sem campo, sem atributo DOM | `ui_v32.js` (mesmo módulo que já é dono de `renderBlocks` e de `buildSupportHTML`) | `hideLegacyRecommendation` (mesmo módulo) e, como **dado de teste**, `window.__DEV` |
| Veredito da arbitragem no card base | Parâmetro de chamada de `baseCardHTML`, calculado uma vez por render | `ui_v32.js` | `buildSupportHTML`, `prCards` |
| Tabela de equivalência `PRODUCTS` ↔ `OFFERINGS`/`SERVICES` | Constante declarada, total sobre as 11 chaves de produto do `MAP`, com valor explícito para "sem equivalente V3.2" | `ui_target_v32.js` (único consumidor) — **helper único** por semântica (R9 §8); é proibido replicá-la ou reimplementá-la por normalização de nome | `tgtEnablersHTML` (tela e papel); o oráculo a lê por `window.__DEV` como **dado** e reimplementa a checagem |
| Conjunto de práticas com habilitador a validar | Derivado no **mesmo passe** de `semCtx` e da lista renderizada | `ui_target_v32.js` | o próprio card e o aviso único da 009 |

**Superfícies e marcadores.** `[data-v32-absence="base-context"]` (novo, dono
`ui_v32.js`) e `[data-ux-enablers="a-validar"]` (novo, dono `ui_target_v32.js`).
Nenhum bridge `window.__*` novo (R-3). Nenhuma classe CSS nova (R-2).

**Patch-points.** Nenhum: as duas mudanças são internas aos módulos autorizados,
sem monkey-patch e sem decorador (R9 §4). Ordem de injeção do builder inalterada.

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** INV-7 é a **governante** e passa de
  violada (A4) a medida (C5). INV-2: o aviso e o rótulo declaram não-informação,
  nunca ausência (C6/C7). INV-3: C9 impede que a propriedade mais fraca da Camada
  1 (`computeFindings` sem `suff`, `quickscan_…:522-533`) seja importada para
  superfície nova. INV-4: no cálculo nada muda; na leitura, C11 mantém o
  `TGT_DISCLAIMER` na mesma superfície. INV-5: C7 ancora no nível atual. INV-8:
  nada serializado. INV-1/INV-9: `engine_v32.js` e a Camada 1 apenas lidos.
  INV-10: nomes de código citados exatamente como no source.
- [x] **design-decisions.md — nenhum conflito.** O arquivo **não existe** na raiz
  (verificado); o corpus normativo é `.claude/rules/design-decisions.md` (R13),
  que nada registra sobre recomendação, modo legado ou catálogo. Resultado
  negativo registrado para que ninguém cite arquivo inexistente.
- [x] **Specs validadas anteriores — nenhuma contradição.** `specs/009-leitura-do-relatorio/spec.md`
  é a demanda adjacente e a única que toca estas superfícies: a âncora da ordem
  canônica de leitura (§"Âncora normativa") não é tocada — `support` permanece na
  7ª posição e `ui_p52_workspace_v32.js` não é editado (R-4); os quatro estados
  S1–S4 (§5) são **preservados byte a byte** (R-1); o aviso único (C14 da 009)
  ganha um vizinho, não um substituto (C12). Nenhum critério da 009 é reaberto —
  o que evita tocar decisão que o proprietário ratificou pessoalmente em
  2026-08-27. `specs/003`, `007`, `008`, `012`, `013`: sem interseção de escopo.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `.claude/verify/current_phase.json:18-25` declara **uma** entrada em
  `specs_normativas`: `specs/PHASE_5_0_REV_B.md`, sha `4f1583c7…04619b`
  (fase corrente 5.2 `SELADA`, `proxima_fase` `NAO_ABERTA`). Aberta e lida:
  - **positivo** — `specs/PHASE_5_0_REV_B.md:1613-1620` (§29.4) nomeia
    textualmente `ui_v32.js` e `ui_target_v32.js` como protegidos; `:1629` (§29.5)
    exclui superfícies de print/PDF; `:1638-1641` declara o rito
    `STOP → classificar → abrir microfase dedicada → revisão independente`;
  - **negativo, e é o que sustenta a demanda** — **nada** sobre recomendação,
    catálogo, `MAP`, `OFFERINGS`, habilitador, tier ou modo legado em
    `specs/PHASE_5_0_REV_B.md`. A §UAT-07 que governa `QS_GAP_SUPPORT` **não** é
    spec normativa: vive apenas como âncora citada dentro do oráculo
    (`tests_p50_core.js:3339-3344`). **Não há diretriz selada que arbitre as duas
    doutrinas de recomendação** — o vão não contraria spec alguma; ele existe
    porque nenhuma spec o cobriu. Spec selada não é editada aqui.
- [x] **Boundary (R6) — as três fontes cruzadas**, nesta ordem:
  1. `.claude/verify/boundary.json:9-14` — classe `frozen` contém **apenas**
     `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`
     e `v3_1_3_functional_snapshot.json`. `ui_v32.js` e `ui_target_v32.js`
     **não** estão lá; os quatro paths `frozen` são apenas **lidos** por esta
     demanda (R-6).
  2. `PROTECTED` + `frozenSuites` (`tests_p50_core.js:82` e `:400-403`) — o mapa
     pina `ui_v32.js` (`:158`) e `ui_target_v32.js` (`:256`); é este o portão que
     **decide na prática**, e ele é consumido por quatro gates (P50-GOV1,
     P50-SUF0, P50-SUF8, P50-IC4). `frozenSuites` exige a presença de
     `tests_ui_m31.js`, `tests_ui_m32.js`, `tests_journey_m45.js`,
     `tests_icons_m46.js`, `tests_target_m431.js` — todas **preservadas sem
     edição** pelo desenho (R-1 a R-6).
  3. `.claude/verify/pins.json:277,281` — identidade de HEAD (stage `baseline`)
     de `ui_target_v32.js` e `ui_v32.js`, coerente com o mapa `PROTECTED`.
  **Toca protegido? Sim — e a autorização está registrada acima** (§"Autorização
  nominal §29.4"), concedida pelo proprietário no chat em 2026-08-30, nominal e
  restrita a estes dois arquivos e a esta demanda. **Qualquer outro arquivo da
  §29.4 é PARADA**, com o rito de `:1638-1641`.
  **Precedência**: onde a prosa da spec selada divergir do executável, vale o
  regime de pins (R8; `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição
  §2 — "o freeze acumulativo parte do estado REAL"). É por essa precedência que o
  repin inline de `PROTECTED` é **manutenção de registry** (R8 §2, com
  comentário-trilha e "Identidade anterior"), não edição de superfície protegida —
  o precedente vivo são as erratas de 5.1, 5.2 e da 009 no próprio mapa. A
  divergência prosa×executável já é achado registrado (E2) e não é resolvida aqui.

## Achados a registrar — não corrigidos nesta demanda

Alocação de id da série `EA-*` é do `doc-writer`, **depois de conferir a
`develop`** (P13); a cadeia arquivo:linha→efeito de cada um está no
`refinement.md` e é o insumo suficiente.

| Achado | Cadeia | Estado após esta demanda |
|---|---|---|
| **A3 · `.prod-mini` órfão** | `quickscan_…:859`, `:868`, `:901-902`, `:909-911` — `renderedP` dá o card completo a quem renderiza primeiro (o bloco de prioridades) e deixa o `<details>` visível com um mini que remete a card não exibido | O dano prático **desaparece no vão** (com V1 os dois blocos ficam visíveis), mas o acoplamento **permanece** sob contexto declarado, quando o congelado é ocultado. Registrar assim |
| **A6 · T3 oculto por contiguidade** | `ui_v32.js:189-193` + `quickscan_…:1002-1007` — sem resposta "NA" o `<details>` T3 fica contíguo ao `.t-list` do T2 e é ocultado junto | **Correção da cadeia**: o efeito é **de tela apenas** — os tiers nunca são impressos nesta build (`ui_v32.js` não os reproduz e `.wrap` sai do papel). Continua exigindo **confirmação por execução** do `qa-engineer` antes de virar achado |
| **A4 · frase falsa** | `ui_v32.js:615` × `hideLegacyRecommendation` | **Corrigido nesta demanda** (C5). Registrar como achado **resolvido pela 010**, com o gate que o mede |
| **Divergência doc×código inerte** | `tests_p52_layout.js:63-64` — `P52_CANONICAL_ORDER` tem `evidence` antes de `support`, ordem inversa à de `P52_SECTIONS`; o literal não é usado pelos gates | Insumo para o `qa-engineer`; fora do escopo |

## Fora de escopo

Herdado do `refinement.md` (seção "Fora de escopo (explícito)", itens 1–11) e,
adicionalmente:

1. **Item 6a** — "Apoio nas prioridades declaradas · contexto V3.2"
   (`ui_v32.js:661`): remoção da seção **ou** do sufixo de versão do título.
   Decisão **adiada por desenho**: com V1 as duas leituras passam a coexistir na
   tela e a premissa muda; decidir agora seria decidir sobre outra tela. O
   desconforto de leitura que a coexistência cria é atendido, nesta demanda, pela
   frase verdadeira de C5 — não por remoção. Reavaliar com evidência de tela,
   depois de V1.
2. **Estender o habilitador a validar aos estados S3 e S4.** Sob contexto
   declarado a autoridade é o engine; onde não há landscape aplicável não há
   contexto a validar.
3. **Alterar `tgtEnablerState`, `tgtAbsenceHTML` ou qualquer gate `D009-*`** (R-1).
4. **Qualquer edição em suíte congelada** — inclusive `tests_ui_m31.js` e
   `tests_ui_m32.js`, que observam a arbitragem (`U1`, `U2`, `U7`, `U15`, `V10`,
   `V15`–`V17`) e permanecem verdes **sem alteração**. A única escrita em suíte
   congelada é o **repin** de `PROTECTED`, pelo rito da R8 §2.
5. **CSS novo, bridge novo, módulo novo.** Módulo novo foi considerado e recusado:
   ele só poderia atuar por monkey-patch ou por leitura do DOM alheio como canal
   de decisão, os dois proibidos (R9 §3 e §4).
6. **FortiNAC** e o vínculo **FortiSIEM ↔ `network-visibility`** — inexistentes no
   catálogo em qualquer camada (P5 da 009).
7. **Escrever em `.claude/BACKLOG.md`** — a alocação de id `EA-*` é do
   `doc-writer`.
