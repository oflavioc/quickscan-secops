# Plano — 010-recomendacao-sem-vao

> Fase 2 · dono: tech-lead · consome a spec aprovada em 2026-08-30 sob a delegação
> do proprietário de 2026-08-29. Referencia [spec.md](spec.md) e
> [refinement.md](refinement.md) **por caminho e não os repete** (R12): critérios
> `D010-*`, restrições `R-1..R-6`, fixtures, rotas V1–V6 e casos de borda vivem
> lá. Aqui vivem camadas, donos, contratos, boundary, waves, riscos e o que só a
> leitura do source (e a execução do engine) revelou.

## Desenho

**Camada e superfície.** Nenhuma camada nova, nenhum módulo novo, nenhum bridge
novo, nenhum CSS novo. A demanda vive nos **dois** módulos autorizados
nominalmente, e a escolha é ditada por onde o dado já mora:

- **`ui_v32.js` (Camada 3)** — é quem chama `hideLegacyRecommendation` (`:277`),
  quem monta `#v32base`/`#pr-sup-base` (`:669-672`, `:1183`) e quem imprime a
  frase de preservação (`:615`). As três mudanças de tela/papel de V1, V2 e INV-7
  são internas a esse arquivo, no mesmo passe em que `lastCtx` já é calculado
  (`:245`).
- **`ui_target_v32.js` (Camada 4.3.1)** — é quem renderiza o card de prática-alvo
  na tela (`:131-132`) e no papel (`:363-364`), e — decisivo — **não é IIFE**:
  suas funções são top-level no mesmo escopo da Camada 1 congelada, de onde
  enxerga `MAP`, `PRODUCTS`, `QS`, `ans` e `SCORES` **sem bridge nenhum**
  (`quickscan_secops_soccmm_v3_1_3.html:262` e `:420`). É o único lugar de onde a
  tabela de equivalência pode nascer sem inventar canal (R9 §3).

`ui_v32.js` é injetado **antes** de `ui_target_v32.js` (`build_v32_html.py:69-71`),
mas nenhuma das duas mudanças depende da outra em carga: a única travessia é
`window.__V32UI.iconFor`, chamada em **runtime** e já usada hoje
(`ui_target_v32.js:263`). Nada é serializado (INV-8) e nenhum estado canônico
novo nasce.

### Módulos tocados — um dono por arquivo

| Arquivo | Dono único | O que muda | O que explicitamente **não** muda |
|---|---|---|---|
| `ui_v32.js` | `ui-engineer` | predicado de arbitragem (puro) + argumento de `hideLegacyRecommendation`; `#v32base`/`#pr-sup-base` viram bloco de ausência; 4º parâmetro de veredito em `baseCardHTML`/`renderCap`/`prCards`; duas chaves novas em `window.__DEV` | `HIDE_EYEBROWS` (`:109-110`) e a **regra** da varredura (`:164-194`) byte-idênticas (R-5); `presentationOf` (`:624-634`); `#v32prio`; `#v32maturity`; `QS_GAP_SUPPORT` e `qsGapSupportHTML`; `window.__V32UI` (R-3, P50-IC4 alínea b) |
| `ui_target_v32.js` | `ui-engineer` | tabela de equivalência (constante) + `tgtValidateHTML()` novo, chamado nos dois sítios do card; exposição por `__DEV` | `tgtEnablerState` (`:199`), `tgtAbsenceHTML` (`:227`) **e também `tgtEnablersHTML` (`:249`)** byte-idênticas; `TGT_DISCLAIMER` (`:4`); `gateNote` (`:129`); ordem do card |
| `fixtures_010_vao.js`, `tests_010_vao.js`, `tests_010_mutants.js` | `qa-engineer` | criados | `fixtures_p52.js`, `fixtures_p50.js`, `tests_009_*` intocados |
| `expected_suites.json`, `mutation_map.json`, `mutation-matrix.json` | `qa-engineer` | entradas novas `d010` | contagens alheias |
| `tests_p50_core.js` (repin inline de `PROTECTED`) | `build-engineer` | **só** os dois hashes + comentário-trilha (R8 §2) | toda asserção; nenhum gate nasce ou morre |
| `quickscan_secops_soccmm_v3_2_dev.html`, `.claude/verify/pins.json` | `build-engineer` | regerados pelo builder / `gen_pins.py` | nunca editados à mão |

Dois donos no mesmo arquivo: **nunca**, em wave nenhuma. `ui-engineer` é dono dos
dois módulos de produto, em **duas delegações separadas e serializadas** (waves 4
e 7) — ver §Waves para por que a serialização é dura aqui.

### Owner do estado (R9 §5) — os quatro dados novos

| Dado novo | Forma | **Owner** | Consumidores |
|---|---|---|---|
| Predicado "há substituto?" | função **pura** de `lastCtx.contexts`; sem cache, sem campo, sem atributo DOM | `ui_v32.js` | `hideLegacyRecommendation`, `baseCardHTML`; e, como **dado de teste**, `window.__DEV` |
| Veredito da arbitragem no card base | parâmetro de chamada, calculado **uma vez por render** | `ui_v32.js` | `buildSupportHTML`, `renderCap`, `prCards`, sítio inline `:1178` |
| Tabela de equivalência `PRODUCTS` ↔ `OFFERINGS`/`SERVICES` | constante declarada, **total** sobre as 11 chaves de produto do `MAP` | `ui_target_v32.js` (**helper único** por semântica — R9 §8; proibido replicar ou reimplementar por normalização de nome) | `tgtValidateHTML`; o oráculo a lê por `__DEV` como **dado** e reimplementa a checagem |
| Conjunto de práticas com habilitador a validar | derivado no **mesmo passe** da lista renderizada | `ui_target_v32.js` | o próprio card (tela e papel) |

Nenhum deles entra na sessão, no schema, no `fullStateJSON` ou no
`legacySnapshot` (INV-8). Nenhum estado canônico novo nasce (R9 §5).

### Como cada peça nasce

**V1 · arbitragem de camada (`ui_v32.js`, tela).** Um helper puro
`hasSubstituteV32(ctxRes)` com as três cláusulas da spec §1, calculado **uma vez**
no ramo não-legado de `renderBlocks`, entre `:245` (onde `lastCtx` nasce) e `:277`
(onde hoje há a constante `true`). O ramo legado (`:237`, `hide=false`) não é
tocado.

**V2 · habilitador a validar (`ui_target_v32.js`, tela e papel).** Função nova
`tgtValidateHTML(qid, cmpPub)`, chamada **imediatamente depois** de
`tgtEnablersHTML(qid, semCtx)` nos dois templates (`:132` e `:363`). Emite um nó
irmão `[data-ux-enablers="a-validar"]`, **sem** a classe `.ux-tgt-en` (R-1), com
itens `.ux-tgt-enabler` no mesmo markup do irmão do engine. O veredito de
suficiência **chega como argumento** (`cmpPub`, calculado em `:116` na tela e
`:347` no papel): a UI consome a decisão canônica, nunca a recalcula — é o que
`D010-CARD3` (c) mede.

**V3 · bloco de ausência (`ui_v32.js`, tela e papel).** Helper único
`baseAbsenceHTML(ids, ctxs, isScreen)` — uma semântica, um dono (R9 §8) —, no
padrão de duas superfícies que `tgtAbsenceHTML(qids, isScreen)` já estabeleceu.
Substitui os N `baseCardHTML` **apenas** dentro de `#v32base` (`:669-672`) e
`#pr-sup-base` (`:1183`).

**INV-7 · a frase (`ui_v32.js`).** `baseCardHTML(id, c, kind, afirmaPreservacao)`
— quarto parâmetro, **default falsy de propósito**: sítio que esquecer de passar
o veredito deixa de afirmar a preservação, nunca passa a afirmá-la à toa. O papel
passa `false` sempre (a Camada 1 nunca é impressa — spec §5); a tela passa
`!haSubstituto`. `renderCap` e `prCards` ganham o mesmo parâmetro por repasse.

### Restrições que só o source (e a execução) revelam

Cada uma viaja no prompt de delegação da wave correspondente.

1. **`tgtEnablerState(qid, 0)` é o predicado de contexto — e é assim que serviço
   não bloqueia.** `tgtEnablerState(qid, nItems)` (`:199-206`) devolve `S1` sempre
   que `nItems > 0`; chamá-la com o número **real** de itens faria uma prática com
   serviço do engine cair em S1 e nunca receber o nó a validar, contradizendo C8
   ("serviço do engine não bloqueia o `MAP`"). Chamada com **`0`**, ela responde
   só a pergunta de contexto — capability canônica única, `landscapeEnabled`,
   `presence === "UNSET"` —, que é o "S2" de C7. A função continua
   **byte-idêntica** (R-1): muda o argumento, não o corpo.
2. **A precedência de C8 tem dois níveis, e sem o segundo C10(c) falha.**
   Candidato do engine bloqueia a **prática inteira**; serviço não bloqueia a
   prática, mas bloqueia o **item equivalente**. Provado por execução: numa sessão
   com os 15 níveis em 0, `monitoring-coverage` recebe o serviço
   `fortiguard-socaas` e `MAP["monitoring-coverage"].lv[0].c` traz `SOCaaS` — que
   é o **mesmo** `fortiguard-socaas`. Sem deduplicação por `data-eid`, dois
   `.ux-tgt-enabler` idênticos no mesmo card ⇒ `D010-CARD4` (c1) FAIL. A ordem do
   catálogo é preservada entre os itens que sobram.
   **Precisão de 2026-08-30 (errata de vacuidade, E9 — medido pelo `qa-engineer`
   na W1):** a fusão é contra o **conjunto efetivamente anexado naquele card**,
   **nunca** contra o domínio da tabela de equivalência. O catálogo congelado tem
   **dois** pares homônimos — `SOCaaS ≡ fortiguard-socaas` e
   `FortiGuard-MDR-Service ≡ fortiguard-mdr` —, e os **dois** vivem no mesmo
   `MAP["monitoring-coverage"].lv[0].c`; só o primeiro é anexado (`fortiguard-mdr`
   é inelegível sob 100% UNSET). Deduplicar pela tabela apagaria "FortiGuard MDR"
   do nó — perda silenciosa de conteúdo. As duas direções são mortas por **M18**
   (não fundir) e **M19** (fundir pela tabela), no mesmo card de `D010-F4`.
3. **`data-ux-enablers` ≠ `data-ux-absence`.** O aviso único da 009 é
   `[data-ux-absence="target-enablers"]` e `D009-ABS1`/`D009-UNS1` contam
   **exatamente 1** nó desse seletor. O nó novo usa outro **atributo**
   (`data-ux-enablers`), não outro valor do mesmo atributo. Um deslize de uma
   letra no seletor quebra dois gates da 009 sem tocar em código deles.
4. **`D009-UNS1` mede `.ux-tgt-en` dentro do `<li>` da prática**
   (`tests_009_leitura.js:583-584`). Por isso o nó novo é irmão e não pode herdar
   a classe — nem por "reuso de estilo". A apresentação vem de `.ux-mut`,
   `.ux-tgt-enabler`, `.ux-tgt-enablers` e `.ux-tgt-mode`, que já existem (R-2).
5. **`N45` e `N46+K` (`tests_journey_m45.js:275-294`) varrem `.ux-tgt-enabler` no
   documento inteiro** — os itens novos entram no raio delas. Verificado: a
   fixture `iconRich()` (`:257-268`) declara `security-analytics`,
   `knowledge-management` e `endpoint-detection` como `NONE` (⇒ candidatos ⇒ S1) e
   o 4º alvo é `mandate` (⇒ S4), de modo que **nenhum nó a validar nasce lá** e as
   duas suítes congeladas seguem verdes sem edição. O que as mantém verdes no
   futuro é a alínea (d) de `D010-CARD4`: ícone pelo **mesmo** `iconFor` com o id
   equivalente, nunca com `c.p` cru.
6. **`A17-A19` (`tests_icons_m46.js:69-80`) compara o censo de `data-eid` entre
   renders** numa sessão em **modo legado** — onde o nó a validar **passa a
   existir** (S2, resposta confirmada, `MAP` não vazio, suficiência aberta). O
   gate exige idempotência, não ausência: continua verde porque o nó é derivado,
   determinístico e sem estado. Nenhuma edição.
7. **A varredura de `hideLegacyRecommendation` interrompe em nó não permitido**
   (`:193`, `if (hiding && !allowed) hiding = false;`) e em `#v32panel` (`:183`).
   É o que sustenta `D010-ARB3` (b) e o mutante `M3`. Reordenar, reindentar ou
   "limpar" esse laço é proibido: `U15` (`tests_ui_m31.js:268`) mede o alcance.
8. **O oráculo de comparação de `D010-ARB1` (d) tem ordem obrigatória:** censo
   V3.2 **primeiro**, depois `V32.resetLandscapeToUnset()` (rota canônica para o
   modo legado, `engine_v32.js:296-304`) e novo render. Invertida, a declaração é
   destruída antes de ser medida.
9. **`D010-CARD4` (e) — o scanner de normalização de nome precisa de escopo e de
   auto-exclusão nominal (R10 §10).** `iconFor` (`ui_v32.js:538`) faz
   `replace(/^Forti/i,"")` para o **fallback de iniciais**, e o próprio arquivo do
   gate carrega os literais proibidos. O scanner varre `ui_target_v32.js` e
   declara suas exclusões por path, impressas — senão reprova a si mesmo ou um
   sítio inocente.
10. **`tgtComparisonPublishable` já é global** (`ui_target_v32.js:88`, declaração
    top-level em arquivo sem IIFE): `D010-CARD3` (a) a alcança por
    `w.tgtComparisonPublishable(w.__DEV.tgtCurrentProfile())` **sem** exposição
    nova. ~~`MAP` e `PRODUCTS` idem~~ — **errado, corrigido em 2026-08-30
    (errata, E7)**: `tgtComparisonPublishable` é **declaração de função** e por
    isso vira propriedade do objeto global; `MAP` (`quickscan_…:420`), `PRODUCTS`
    (`:262`), `QS` (`:296`) e `ans` (`:475`) são **`const` de topo de script** —
    vivem no escopo de script e **não** existem em `window` (`w.MAP` é
    `undefined`). O oráculo de `D010-CARD4` (a) deriva as 11 chaves pelo helper da
    fixture (**`d010MapKeys(w)`**) e continua **sem** ler a tabela do produto.
    Expor o `MAP` por bridge exigiria editar arquivo `frozen`: Porta B, PARADA.
11. **O nó a validar só nasce com item.** Lista vazia ⇒ **nenhum nó**, em nenhuma
    superfície: contêiner vazio não é publicação, é defeito (errata, **E11** —
    achado por sonda do `qa-engineer`, que fechou um verde falso antes do red).
12. **Âncora de fixture não vigia produto.** `d010AssertFixtureStates` declara só
    o que esta demanda **não pode escrever**; a saída de `ui_v32.js` e
    `ui_target_v32.js` é objeto de gate (errata, **E10**). O critério é o **diff**.

## Contratos e registros

### Tabela de equivalência de catálogo — o contrato

Contrato **declarado e total** sobre as **11 chaves distintas** de `c.p` do `MAP`
(contadas no source: `FortiAI-Assist`, `FortiAnalyzer`, `FortiEndpoint`,
`FortiGuard-MDR-Service`, `FortiGuard-Service-Bundle`, `FortiNDR`, `FortiRecon`,
`FortiSIEM`, `FortiSOAR`, `FortiXDR`, `SOCaaS`). Nasce como **constante** em
`ui_target_v32.js`, é exposta como **dado** por `window.__DEV.TGT_EQUIV` (nome
fixado aqui para que QA e UI codifiquem contra o plano, nunca um contra o outro) e
**nunca** é derivada por heurística de nome.

| # | Chave `PRODUCTS` | Equivalente V3.2 | Fonte | Nota |
|---|---|---|---|---|
| 1 | `FortiAnalyzer` | `fortianalyzer` | OFFERINGS | direta |
| 2 | `FortiSIEM` | `fortisiem` | OFFERINGS | direta |
| 3 | `FortiSOAR` | `fortisoar` | OFFERINGS | direta |
| 4 | `FortiEndpoint` | `fortiendpoint` | OFFERINGS | direta |
| 5 | `FortiRecon` | `fortirecon` | OFFERINGS | direta |
| 6 | `FortiXDR` | `fortixdr` | OFFERINGS | direta |
| 7 | `FortiAI-Assist` | `fortiai-assist` | OFFERINGS | direta |
| 8 | `SOCaaS` | `fortiguard-socaas` | SERVICES | direta |
| 9 | `FortiGuard-MDR-Service` | `fortiguard-mdr` | SERVICES | direta |
| 10 | `FortiNDR` | **`ndr-family`** | OFFERINGS | **a ratificar** — o catálogo V3.2 tem três nós (`ndr-family`, `fortindr-onprem`, `fortindr-cloud`); só o de família tem `name` igual a `PRODUCTS["FortiNDR"].n` ("FortiNDR"), e escolher variante afirmaria uma modalidade que a sessão não declarou |
| 11 | `FortiGuard-Service-Bundle` | **sem equivalente V3.2** (valor explícito) | — | **a ratificar** — o bundle do V3.1.3 não corresponde a nenhum item de `SERVICES`, que traz os serviços FortiGuard **discretos** (`soc-assessment`, `ir-*`, `ttx`, …). Item exibido com `PRODUCTS[c.p].n` e `data-eid="map:FortiGuard-Service-Bundle"` — prefixo que **não pode colidir** com id do engine e mantém o `data-eid` estável |

**Onde nasce e quem valida.** Nasce no plano (acima) como contrato; é **ratificada
pelo `data-engineer`** contra o catálogo do engine (leitura, sem escrita — wave 2)
e só então transcrita pelo `ui-engineer` (wave 4). Quem a **valida por execução**
é o `qa-engineer` em `D010-CARD4` (a), com oráculo independente: as 11 chaves são
derivadas de `w.MAP`, não da tabela — chave nova sem entrada = FAIL nomeando a
órfã. Divergência do `data-engineer` volta ao plano **antes** da wave 4; não é
resolvida dentro da implementação.

**Consequência de forma:** o item com equivalência é exibido com o nome do
catálogo V3.2 e `iconFor(idEquivalente, nome)`; o item sem equivalência cai no
fallback de iniciais do próprio `iconFor` — e a alínea (d) de `D010-CARD4` é
vacuosa para ele por construção (item sem equivalente nunca vem do engine).

### Registros

- **Bridges — nenhum novo.** Conferido contra `.claude/verify/bridges.json` (15
  entradas): `__DEV` já é registrado. `ui_v32.js:1285` **cria** o objeto e
  `ui_target_v32.js:378` faz `Object.assign` — ambos ganham chaves, nenhum nome
  `window.__*` nasce, e `check_lint_arch.py` varre **nomes**. **`bridges.json` não
  muda.** `__V32UI` **não** cresce (R-3): `P50-IC4` (b) casa
  `/window\.__V32UI\s*=\s*\{[^}]*\biconFor\b/` (`tests_p50_core.js:2710`) e
  qualquer chave nova antes de `iconFor` que contenha `}` quebra o regex.
  Chaves novas em `__DEV`: `TGT_EQUIV` (dado, `ui_target_v32.js`) e
  `hasSubstitute` (função pura, `ui_v32.js`).
- **Patch-points — nenhum.** Registro de patch-points desta demanda é **vazio**
  (R9 §4): sem monkey-patch, sem decorador, sem `registerDecor`. Módulo novo foi
  considerado e recusado na spec (só poderia agir por monkey-patch ou lendo DOM
  alheio).
- **Ordem de injeção do builder — relevante e inalterada.** JS: engine → adapter
  → icons → **ui_v32** → ux → **target** → ref → build_meta → journey → session →
  p50_shell → p50_suff → p50_results → p52_workspace (`build_v32_html.py:69-71`).
  CSS inalterado (nenhum arquivo novo). Nenhuma reordenação é necessária e
  **nenhuma é autorizada** por este plano.
- **Registros de gate — quem entra, quando.** `expected_suites.json` (suíte
  `d010`) no **mesmo commit** que cria `tests_010_vao.js` (wave 3), com a contagem
  fixada no verde (wave 9) — `check_suites.py` reprova qualquer `tests_*.js` fora
  do registro. `mutation_map.json` (harness `d010`) no **mesmo commit** que cria
  `tests_010_mutants.js` (wave 9). Fixture não é suíte: `fixtures_010_vao.js` não
  entra em registro nenhum.
- **Harness `d010` — `preflight` é obrigatório, não opcional.**
  `check_mutation.py:283-296` roda o preflight de **todo** harness que não esteja
  em `IC_SEM_PREFLIGHT` (hoje só `core`), **independente de trigger e de
  ambiente**. Um `d010` sem `"preflight": true` **reprova IC-4 e derruba o stage
  inteiro**, mesmo com a campanha verde. Logo: `tests_010_mutants.js` lê
  `--preflight` em argv e emite o objeto JSON do contrato C1 (`harness`,
  `arquivo`, `interpretador{nome,origem,resolvido}`, `arquivos_mutados`,
  `mutantes[{id,estado,causa?,ocorrencias,arquivo}]`, exit 0 sse resolvido e todo
  estado `ok`) **no mesmo commit** em que a chave é declarada (D4 da 013).
  Referência estrutural: `tests_009_mutants.js:430-472`.
- **Vocabulário de três estados no relato.** `d010` emite `DETECTADO` /
  `SOBREVIVENTE` / `NÃO EXECUTADO` no formato de `emitir()`
  (`tests_p52_mutants.js:1526`), e **não** herda a dívida do `d009`, que declara
  preflight mas não emite o vocabulário — por isso `check_mutation.py` nunca
  consegue nomear um não-KILL dele. Se o custo se mostrar alto na execução, a
  saída é **declarar a dívida** em `mutation-matrix.json → dividas_declaradas`,
  nunca omiti-la.
- **Alvos do harness `d010`:** `ui_v32.js`, `ui_target_v32.js`,
  `tests_010_vao.js`, `fixtures_010_vao.js`, `tests_010_mutants.js` (spec
  §Critérios). Oráculo e fixture entram como alvo pelo precedente do `d009`.
- **Namespace dos mutantes:** `D010-M1..M20`, na correspondência 1:1 com
  `M1..M20` da spec (R10 §1 — nunca continuar numeração alheia; `M1` global já
  existe desde a 003). *`M18`/`M19`/`M20` acrescidos em 2026-08-30 pela errata
  (E9 e a disposição de `D010-ARB3`), sobre gates que já existiam — nenhum gate
  novo.* **`M3` e `M4` não entram na campanha**: medidos sem caso nas fixtures e
  registrados como **dívida declarada com causa** em `mutation-matrix.json`, com a
  execução que os dispõe escrita na célula de C3. Campanha executa **18** pares. Cada par entra em `mutation-matrix.json` com `harness`,
  `gate` e `ultima_prova.resultado` — os três são exigidos por
  `check_tdd.py:47-52`.
- **Pins (R8).** Arquivos rastreados que mudam nesta demanda: `ui_v32.js`,
  `ui_target_v32.js`, `tests_p50_core.js`,
  `quickscan_secops_soccmm_v3_2_dev.html`, `expected_suites.json`,
  `mutation_map.json`, `mutation-matrix.json`, mais os três criados
  (`fixtures_010_vao.js`, `tests_010_vao.js`, `tests_010_mutants.js`) — arquivo
  rastreado **sem** pin também é FAIL no `baseline`. Regra de execução em
  §Waves ("Ordem de repin"): **um commit `chore` de `gen_pins.py` por commit de
  conteúdo que toque pinado**, sempre depois dele.
  `declared.m41_payload_sha256` **não muda**; se mudar, PARADA por Porta B.

## Boundary

**Classe mais alta tocada: `produto protegido` (§29.4), com autorização nominal
consumada — mais `generated` e `registry`, ambas pelo rito.** Item a item:

- **`frozen`** (`.claude/verify/boundary.json:9-14`) — `engine_v32.js`,
  `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js` e
  `v3_1_3_functional_snapshot.json` são **apenas lidos** (R-6). `MAP` e `PRODUCTS`
  são consumidos como dado; nenhum byte escrito.
- **`§29.4` (`specs/PHASE_5_0_REV_B.md:1613-1620`)** — `ui_v32.js` e
  `ui_target_v32.js` são editados **sob a autorização nominal do proprietário de
  2026-08-30**, registrada na spec §"Autorização nominal §29.4". A autorização é
  restrita a **estes dois arquivos e a esta demanda**.
  **PARADA declarada:** qualquer desenho que alcance `ui_v32.css`,
  `ui_ux_v32.css`, `ui_p52_workspace_v32.js` ou **asserção** de suíte congelada
  **para aqui e exige nova frase do proprietário**, pelo rito de
  `specs/PHASE_5_0_REV_B.md:1638-1641`. Este plano foi desenhado para não precisar
  de nenhuma: zero CSS novo (R-2), `ui_p52_workspace_v32.js` intocado (R-4),
  nenhuma suíte congelada muda de asserção.
- **Repin inline de `PROTECTED`** (`tests_p50_core.js:158` e `:256`) — é
  **manutenção de registry** (R8 §2), com comentário-trilha, motivo, data e
  "Identidade anterior", no precedente vivo das erratas de 5.1, 5.2 e da 009 no
  próprio mapa. Consumidores: `P50-GOV1` (`:397`, mapa inteiro), `P50-SUF0`
  (`:1314`) e `P50-SUF8` (`:1965`) para `ui_target_v32.js`; `P50-GOV1` e
  `P50-IC4` (`:2707`, alínea a) para `ui_v32.js`. `frozenSuites` (`:400-403`)
  exige a **presença** de cinco suítes — todas preservadas sem edição.
- **`generated`** — `quickscan_secops_soccmm_v3_2_dev.html` **nunca é editado à
  mão**: é rebuildado por `python build_v32_html.py` e o stage `build` prova a
  identidade byte a byte. `ui_icons_v32.js` não é tocado.
- **`legacy`** — `MANIFEST.sha256` e `specs/PHASE_5_0_REV_A.md`: intocados.
- **`registry`** — `pins.json` só por `gen_pins.py`, no mesmo PR, com motivo no
  commit.

## Checklist R9 (módulo novo)

**N/A — nenhum módulo novo é criado.** Item a item: IIFE + `__installed` N/A · um
bridge registrado N/A (nenhum nasce; `__DEV` ganha duas chaves) · CSS por prefixo
**N/A por construção** (R-2: zero CSS novo, zero seletor alheio novo) · zero
`innerHTML=` **aplicável parcialmente**: `check_lint_arch.py` cobre `ui_p5*`, e
nem `ui_v32.js` nem `ui_target_v32.js` passam a usar `innerHTML` onde hoje não
usam — o padrão herdado de template literal com `esc32`/`escAttr` é preservado e
**todo** texto novo passa por `esc32` · helper único de invariante **aplicável e
tratado**: a equivalência de catálogo e o bloco de ausência têm cada um **um**
dono e **um** helper (R9 §8).

**Orçamento de ~600 linhas (R9 §7) — justificativa registrada.** `ui_v32.js` tem
1.304 linhas e cresce ~40; `ui_target_v32.js` tem 381 e cresce ~35 (a tabela
responde por ~13). O excesso de `ui_v32.js` é **legado documentado** das camadas
3.x/4.x, não licença: extrair para módulo novo foi considerado e **recusado na
spec** (só poderia agir por monkey-patch ou lendo DOM alheio — R9 §3/§4) e, pior,
tiraria o código de dentro do arquivo que a autorização nominal cobre, o que
exigiria **nova ratificação**. Fica registrado como dívida, não corrigido de
passagem (R13).

## Waves

Dependência real, não conveniência. **Nenhuma wave roda em paralelo com outra que
escreva em arquivo de produto ou de teste** — a contaminação da 009 veio de dois
agentes na mesma worktree com campanha em curso, e o preço foi mutante aplicado
sobrevivendo num commit. `[P]` só aparece onde a wave **não escreve nada**.

| Wave | Tarefas (resumo) | Dono | Tipo (R3) | Depende de |
|---|---|---|---|---|
| **0 — ambiente** | `npm ci --no-audit` (`node_modules` **não existe** nesta worktree e toda suíte jsdom faz `require("jsdom")`; `node_modules/` está no `.gitignore`, então a árvore segue limpa) | `build-engineer` | `chore` | portão da Fase 3 |
| **1 — fixtures** | `fixtures_010_vao.js` com `D010-F1`, `F1b`, `F2`, `F3` **e `F4`** (a quinta nasceu na própria wave, pela errata de vacuidade de 2026-08-30 — spec §E3/E4; `F1`/`F1b`/`F2` ficam **byte-idênticas** e `F3` ganha `vulnerability-management` = 0 com alvo, spec §E5) + `d010AssertFixtureStates` e os helpers `d010MapKeys(w)`/`d010EquivalenciaNome` no padrão da 009. Estado aplicado **só** por owners canônicos (`__DEV.setAnswerById`, `setPriorities`, `setTarget`, editor + `#v32save`) | `qa-engineer` | `chore` | 0 |
| **2 — equivalência** | Ratificar a tabela contra `OFFERINGS`/`SERVICES`/`ICON_MAP_V32`, decidindo as duas linhas marcadas "a ratificar". **Leitura pura: não escreve arquivo nenhum** — a decisão volta na resposta e o orquestrador a registra no planning-state | `data-engineer` | `chore` `[P]` com 1 | — |
| **3 — gates e RED** | `tests_010_vao.js` com os 13 gates (`D010-ARB1..4`, `INV7`, `ABS1`, `CARD1..6`, `PAPEL1`) **+** entrada `d010` em `expected_suites.json` no mesmo commit; executar, nomear o FAIL de cada gate, **commitar o red**, registrar `red.commit` + `red.status: proven` no planning-state (R3 §4) | `qa-engineer` | `feature` (produz o red de 4 e 7) | 1, 2 |
| **4 — `ui_target_v32.js`** | **Antes da implementação**, a emenda do `d010AssertFixtureStates` (errata E10): sai `titulosCongelados[].oculto`, entra o payload do engine por alvo no lugar do censo de chips — âncora de fixture não vigia produto, e sem isso o green aborta no assert em vez de medir critério. Depois: tabela de equivalência + `tgtValidateHTML` + as duas chamadas + `__DEV.TGT_EQUIV`. **Dois arquivos, dois donos, em série** (`fixtures_010_vao.js` pelo `qa-engineer`, `ui_target_v32.js` pelo `ui-engineer`) — nunca na mesma delegação | `qa-engineer` → `ui-engineer` | `chore` → `feature` | 3 |
| **5 — rebuild** | `python build_v32_html.py`. **Pré-condição do verde, não acabamento**: as suítes jsdom bootam o HTML gerado, não os módulos-fonte | `build-engineer` | `chore` | 4 |
| **6 — medição isolada** | Suítes `target`, `journey`, `icons46`, `ux41`, `d009`, `ui31`, `ui32`, `p52layout` + campanha **`d009`** (node+python), com árvore limpa. Um único arquivo de produto mudou: se `D009-*` cair, a causa é inequívoca | `qa-engineer` | `chore` | 5 |
| **7 — `ui_v32.js`** | Predicado + bloco de ausência (duas superfícies) + 4º parâmetro do card base + `__DEV.hasSubstitute`. Um módulo, uma delegação | `ui-engineer` | `feature` | 6 |
| **8 — rebuild** | `python build_v32_html.py` | `build-engineer` | `chore` | 7 |
| **9 — verde e campanha nova** | Fixar a contagem de `d010` no verde; `tests_010_mutants.js` (**18** mutantes executados de **20** declarados — `M3`/`M4` em dívida declarada —, **com `--preflight`**) **+** harness `d010` em `mutation_map.json` no mesmo commit; executar `d010`, `d009` e `core`; registrar os 17 pares em `mutation-matrix.json` | `qa-engineer` | `chore` (instrumento de medição; sem red próprio — o aceite é 100% KILL, R10 §5) | 8 |
| **10 — repin de `PROTECTED`** | Dois hashes inline em `tests_p50_core.js` + comentário-trilha citando a §"Autorização nominal §29.4" da spec, com "Identidade anterior" — e o `gen_pins.py` correspondente logo depois. **Dono é o `build-engineer`, não o QA**: quem escreve o hash não pode ser quem valida o gate que o consome (R3 §2) | `build-engineer` | `chore` | 9 |
| **11 — validação** | `run.sh` completo; `p50core` de volta a 64/0; job `visual` do CI para `p51`/`p52`; `spec-validate`; aceite de intenção do PO | `qa-engineer`, `build-engineer`, `product-owner` | `chore` | 10 |

**O que dispara campanha — medido no `mutation_map.json`, não de memória.**
`ui_v32.js` é alvo de **`core`, `p51`, `p52` e `d009`**; `ui_target_v32.js` é alvo
de **`p52` e `d009`**. Ou seja: `d009` e `p52` são disparados pelos **dois**
arquivos, `core` e `p51` só pelo primeiro, e `d010` passa a ser disparado pelos
dois a partir da wave 9. `p50` não é disparado (nenhum alvo seu muda).

**Onde cada campanha fecha.** `check_mutation.py:1287` deriva o gatilho do diff
**commitado** contra `merge-base(HEAD, origin/develop)` — a partir da wave 4 as
campanhas ficam exigidas em **toda** execução do stage. `core`, `d009` e `d010`
exigem só `node`+`python` e rodam aqui. `p51` e `p52` exigem **Chromium**, ausente
nesta worktree (sem `CHROME_PATH`, sem `%LOCALAPPDATA%\ms-playwright` — verificado
nesta fase), e por isso o stage local sai `[FAIL] campanha EXIGIDA … ambiente sem
chromium` (`:1300`) — **FAIL nomeado, nunca SKIP** (R10 §2). Elas fecham no job
`visual` do CI (`.github/workflows/verify.yml:76-80`), que roda
`check_mutation.py` com Chromium; o job `verify` as delega por `[DEFER]` via
`MUTATION_DEFER_MISSING=1`. Isso é **agendamento nomeado, não dispensa**: o
resultado volta para `mutation-matrix.json` na wave 11. Precedente idêntico e já
registrado nas `dividas_declaradas` da 009.

**Campanha depois de cada correção, não uma vez no fim.** As waves 6, 9 e 11
executam campanha; e **toda** correção posterior a uma delas re-executa as
campanhas que o ambiente suporta antes de seguir. Protocolo obrigatório, porque
`check_mutation.py:56-61` recusa árvore suja e campanha **abandonada** deixa
mutante aplicado:

1. `git status --porcelain` **vazio** antes de invocar qualquer harness;
2. campanha nunca é interrompida, e nenhum outro agente atua na worktree enquanto
   ela roda;
3. `git status --porcelain` **vazio** de novo depois — se não estiver,
   `git checkout --` no arquivo mutado e **reportar**, nunca commitar por cima.
   O stage tem a mesma guarda no fim (`:1362-1366`), mas ela só protege quem
   chegou ao fim.

**Ordem de repin — natureza, nunca contagem.** O repin do registry **não é uma
wave**: é uma tarefa `chore` do `build-engineer` **por commit que altere arquivo
pinado**, imediatamente depois dele. É o rito vivo do repositório, não uma
preferência — `git log` desta própria branch traz `chore(010): gen_pins — repin da
fase 0` e `… da fase 1`, e a série `chore(013): gen_pins — R<n>` faz o mesmo.
`gen_pins.py` calcula sobre os blobs de **HEAD**: rodá-lo antes de commitar pina o
estado **anterior**, e por isso ele nunca cabe dentro do commit que descreve.
Quantos repins esta demanda terá é **estimativa** — três demandas seguidas
erraram a contagem —, então este plano prevê a **natureza** e deixa a
granularidade (R1, R2, …) para o `tasks.md`. Commit de `planning-state` **não**
pede repin: `.claude/project-memory/**` está nas exclusões declaradas em
`pins.json → _meta.exclusoes`.

Com essa regra, as janelas vermelhas ficam curtas e nomeadas:

| Stage | Fica vermelho a partir de | Fecha em |
|---|---|---|
| `baseline` / `boundary` | cada commit de conteúdo que toque pinado (inclusive o arquivo novo sem pin, wave 3) | o commit de repin imediatamente seguinte — janela de **um** commit |
| `suites` (`p50core`) | wave 4 (`P50-GOV1`, `P50-SUF0`, `P50-SUF8`) e wave 7 (+`P50-IC4`) | wave 10 |
| `build` | wave 4 (fonte ≠ HTML publicado) | wave 5; de novo 7→8 |
| `mutation` | wave 4 (`p51`/`p52` sem Chromium) | job `visual` do CI |

Vermelho **previsto e declarado** não é vermelho tolerado: quem "consertar"
adiando um registro troca um vermelho esperado por um buraco de cobertura. Se uma
correção depois da wave 10 tocar `ui_v32.js` ou `ui_target_v32.js`, o repin inline
de `PROTECTED` **e** o `gen_pins.py` se repetem — nesta ordem.

## Riscos e rollback

| Risco | Detecção (gate) | Resposta / rollback |
|---|---|---|
| **`D010-F2` não alcança o estado declarado.** Provado por execução nesta fase: com `logs` respondido em nível 2, declarar `security-analytics` como `NONE` produz `POSSIBLE_CONTEXT_DIVERGENCE`/`VALIDATE` com **zero** candidatos — `D010-CARD2` (a) ficaria vacuoso e `D010-ARB2` (b) falharia | `d010AssertFixtureStates` | A fixture **fixa `logs` em nível 0**; aí sim `TECHNOLOGY_WHITESPACE`/`DIRECT` com `fortianalyzer`, `fortisiem`, `fortisiem-cloud`. Restrição viaja no prompt da wave 1 |
| **Âncora de fixture que descreve o produto sob conserto** (o assert declarava `titulosCongelados[].oculto: true` e o censo de chips do DOM) | `d010AssertFixtureStates` aborta **antes** de qualquer alínea e converte os 12 gates em falha de fixture — visto na W3, ao projetar o green | Regra da errata **E10**: o assert só declara o que a demanda **não pode escrever**, e o critério é o **diff**. A emenda entra na wave 4, **antes** da implementação; nada é removido sem migrar para o gêmeo canônico ou para a alínea que já mede. Se algum veredito do vermelho mudar por causa dela, é **achado**, não conserto |
| **Nó de habilitador vazio passando por publicação** | `D010-CARD1` (a), `CARD6` (b), `PAPEL1` (a) — todas exigem nó **com item** (**E11**) | Achado por sonda do `qa-engineer` **antes** do commit do red, e fechado lá: "publicar" passou a exigir item. As alíneas negativas proíbem **o nó**, vazio ou não — a assimetria é de propósito |
| **Nó a validar com a classe `.ux-tgt-en`** | `D009-UNS1` **e** `D010-CARD6` (b) — prova cruzada por desenho (mutante `M16`) | R-1 é dura: se acontecer, é reversão da wave 4, não conserto no gate |
| **Item duplicado no card** (`fortiguard-socaas` do serviço × `SOCaaS` do `MAP`) | `D010-CARD4` (c1), sob `D010-F4` | Fusão por `data-eid` **contra o que está anexado** já é regra do desenho (restrição 2). Sem ela o defeito é silencioso na maioria das sessões e aparece **só em `monitoring-coverage`** — *corrigido em 2026-08-30: `incident-response` não tem `SOCaaS` no `MAP`, e `team-capacity` é S4; medido, não inferido* |
| **Fusão apaga item legítimo** (`FortiGuard-MDR-Service` some porque tem equivalente na tabela, ainda que `fortiguard-mdr` **não** esteja anexado) | `D010-CARD4` (c2), sob `D010-F4` | Risco **oposto** ao de cima e igualmente silencioso — o único lugar do produto onde a perda seria invisível. A regra escrita (spec §4 · E9) manda olhar o conjunto anexado; o mutante `M19` a guarda |
| **Heurística de nome reaparece "por conveniência"** ao faltar uma entrada | `D010-CARD4` (a) e (e) | A tabela é total por gate, com a órfã nomeada; o scanner (e) tem escopo e auto-exclusão declarados |
| **`m41` muda após o rebuild** | stage `m41` | **PARAR e reportar** — virou Porta B, que ninguém autorizou. `git revert` da wave de rebuild |
| **Contagens congeladas mudam** (`ui31` 19 · `ui32` 25 · `target` 30 · `journey` 31 · `icons46` 12 · `ux41` 56 · `d009` 15 · `p52layout` 45 · `engine` 105) | `suites` | Qualquer alteração ≠ `p50core` significa que o desenho vazou para superfície alheia: **parar e reabrir a análise**, nunca ajustar o registro |
| **Campanha abandonada deixa mutante aplicado e alguém commita por cima** | `git status` no protocolo acima + `check_mutation.py:1362` | Serialização total das waves que escrevem; `git checkout --` e relato. Foi o custo real da 009 |
| **Harness `d010` sem `--preflight`** | `IC-4` no stage `mutation` — derruba o stage **mesmo com a campanha verde** | Flag e modo no mesmo commit (D4). Está escrito no contrato do harness, acima |
| **Ler não-KILL da campanha `d009`** para decidir alguma coisa | — | **Não funciona hoje**: `d009` declara preflight mas não emite o vocabulário de três estados (dívida declarada da 009). Quem precisar do detalhe lê o stdout do harness, não o relato do stage |
| **Predicado conta como "substituto" um card que não substitui nada** | `D010-ARB3` (c) sob `D010-F3` | Verificado por execução: sob `F3` **todo** card `VALIDATE` tem 0 candidatos, 0 serviços e **0 notas** (`engine_v32.js:599` não empurra nota, ao contrário de `:597` e `:630`), então "há substituto" é `false` e a Camada 1 permanece visível. O que o gate mede é essa **propriedade**, não uma contagem: *o número escrito aqui era 12 e são 10 (medido na W1); ele sai da prosa em vez de ser corrigido, porque muda de novo quando `F3` ganha `vulnerability-management` = 0 — errata de vacuidade, E8, e R10 §3* |
| **Sessão com sinal ligado e nada declarado** entra por `UNASSESSED_CAPABILITY` com candidatos e desliga a Camada 1 | `D010-ARB3` | Caminho **inalcançável por qid de prática**: `UNASSESSED_CAPABILITY` exige `assessmentCoverage === "none"`, logo a capability não tem `questionIds`. Registrado como borda conhecida, não como defeito; nenhum gate novo é criado por decisão de agente (R4) |
| **Duplicação de leitura no papel**: `automation` recebe o nó a validar em `#pr-target` e já aparece em `pr-gapsup` (`ui_v32.js:978-996`, 4 dos 15 qids) | nenhum gate mede | Pré-existente ao desenho e **fora do escopo**: `D010-CARD4` (c) é por card. Devolvido ao `product-owner` como observação de leitura, não absorvido (R13) |
| **Duas leituras coexistindo na tela** quando não há substituto (item 6a) | — | Decisão **adiada por desenho** na spec; a frase verdadeira de `D010-INV7` é o que a demanda entrega. Reavaliar com evidência de tela **depois** de V1 |

Rollback geral: cada wave é commit atômico e reversível por `git revert`, em ordem
inversa (11→0). A identidade anterior de cada arquivo pinado permanece recuperável
por `pins.json` (o repin anterior de cada arquivo) e pelos comentários-trilha do
`PROTECTED`.

## Protótipo

**Nenhum protótipo em branch — e nenhum código de protótipo existe.** As quatro
perguntas que só código responderia foram respondidas por **sonda descartável fora
do repositório** (scripts no scratchpad da sessão, que apenas fazem
`require("engine_v32.js")` — o engine é DOM-free por `lint-arch` — e não escrevem
nada). O aprendizado entra aqui; a sonda não vira produção e não é versionada:

1. **`D010-F1` alcança o estado declarado.** Com `saasAllowed:"yes"` e landscape
   100% UNSET: `isLegacyModeV32() === false`, **"há substituto" = `false`**,
   apresentação `base` para as capabilities com gap, e as quatro práticas-alvo com
   **zero** itens do engine (⇒ S2). Vale para os demais 11 níveis em 2, 1 ou 0.
2. **`D010-F2` exige `logs` em nível 0** — ver §Riscos. Achado que teria custado
   uma rodada inteira de red inútil.
3. ~~**A cláusula "classificação ≠ `CONTEXT_NOT_INFORMED`" é load-bearing.**~~
   **Refutado em 2026-08-30** pela sonda de variantes do `qa-engineer` (errata de
   vacuidade, **E1** da spec) e corrigido aqui em vez de silenciado (R2 §5). O fato
   observado continua verdadeiro: numa sessão com os 15 níveis em 0 e nada
   declarado, o engine anexa serviços (`fortiguard-socaas`,
   `ir-readiness-subscription`, `ir-plan-development`, `ir-playbook-development`,
   `ttx`, `vulnerability-assessment`, `ir-training`) fora do `switch`, por `hasGap`
   (achado A5). **O efeito atribuído não.** `CONTEXT_NOT_INFORMED` ⇒
   `supportMode = "LEGACY-LABELLED"` (`engine_v32.js:601-602`), que `presentationOf`
   nunca promove a `card`: a **primeira** conjunção do predicado já exclui essas
   capabilities, e predicado completo × predicado sem a cláusula dão o **mesmo**
   valor em seis sessões (inclui 15×0 e 15×1), reconfirmado sobre `D010-F4`. A
   cláusula **fica** como defesa contra mudança futura no engine, **sem mutante**:
   removê-la é equivalente por construção.
4. **A colisão de identidade de `monitoring-coverage` é real** (restrição 2), e é
   o que obriga a precedência de dois níveis. **São duas** (2026-08-30, E4/E9): o
   par que funde e o par de controle, no mesmo `MAP` da mesma capability.

---

ARQUIVOS_TOCADOS: specs/010-recomendacao-sem-vao/plan.md (criado — único artefato desta fase)
RESUMO: Plano da Fase 2 pelo template, referenciando spec e refinement por caminho sem repeti-los. Dois módulos de produto, um dono por arquivo (`ui-engineer`, duas delegações serializadas), owner do estado dos quatro dados novos, tabela de equivalência declarada e total sobre as 11 chaves do `MAP` com as duas linhas ambíguas marcadas para ratificação do `data-engineer`. Doze waves (0–11) por dependência real, com o julgador antes do julgado (gates + red na wave 3) e a validação por último. Dez restrições que só o source revela viajam no prompt — a principal é `tgtEnablerState(qid, 0)` como predicado de contexto, que mantém a função congelada byte-idêntica e é a única leitura que satisfaz C7 e C8 ao mesmo tempo.
EVIDÊNCIA: nenhum gate executado — Fase 2 é desenho e `node_modules` não existe nesta worktree (é a Wave 0 do próprio plano). Sonda descartável fora do repositório (scratchpad, sem escrita no repo, apenas `require("engine_v32.js")`): quatro cenários executados — F1 com os demais níveis em 2/1/0 (há substituto = false, quatro práticas em S2), F2 com `logs` em 2 (POSSIBLE_CONTEXT_DIVERGENCE/VALIDATE, zero candidatos — a fixture da spec **não** alcança o estado declarado) e com `logs` em 0 (TECHNOLOGY_WHITESPACE/DIRECT, três candidatos), sessão com os 15 níveis em 0 (serviços anexados e há substituto = false — a cláusula A5 provada **[correção de 2026-08-30: o cenário confirma que serviços são anexados, mas NÃO prova a cláusula A5 — o mesmo `false` sai sem ela, porque `LEGACY-LABELLED` nunca vira `card`; sonda de variantes do `qa-engineer`, errata de vacuidade E1]**) e F3 (12 cards VALIDATE com 0 candidatos/serviços/notas ⇒ há substituto = false **[correção de 2026-08-30: são 10 cards, medidos na W1 — errata E8; a propriedade relatada, payload vazio em todos, permanece verdadeira]**). Leituras só-leitura: spec.md íntegra; templates/plan.md; rules orchestration/modularity/tdd/gates/boundary/pins/sdd; specs/009/plan.md como precedente de formato; planning-state 010. Registros conferidos: bridges.json (15 entradas, `__DEV` registrado), boundary.json (4 classes, `ui_v32.js`/`ui_target_v32.js` fora de `frozen`), expected_suites.json, mutation_map.json (5 harnesses; `ui_v32.js` alvo de core/p51/p52/**d009**, `ui_target_v32.js` alvo de p52/**d009**), mutation-matrix.json (46 pares, 13 dívidas declaradas), known_issues.json (KI-4 viva), pipeline.yaml, verify.yml. Verificadores lidos: check_mutation.py (árvore suja :56-61, IC-4/preflight :283-296, trigger :1287-1302, guarda final :1362-1366), check_tdd.py:47-52, check_boundary.py, check_suites.py, check_baseline.py. Source: ui_v32.js (109-110, 164-194, 233-300, 533-541, 611-646, 648-680, 736-742, 930-1000, 1170-1200, 1273, 1284-1303), ui_target_v32.js (4, 37, 88, 110-176, 199-263, 340-381), engine_v32.js (296-311, 388-401, 552-670), quickscan_secops_soccmm_v3_1_3.html (262-275 PRODUCTS, 420-450 MAP), build_v32_html.py:40-100, tests_p50_core.js (82-160, 250-262, 396-404, 1314, 1965, 2703-2726), tests_009_leitura.js (556-640), tests_journey_m45.js (250-294), tests_icons_m46.js (65-80), ui_icons_v32.js:3. Contagens medidas por script descartável: 11 chaves distintas de `c.p` no `MAP` sobre 15 qids; 29 ids em OFFERINGS e 16 em SERVICES.
DEPENDÊNCIAS: (1) **Portão da Fase 2 com o usuário** antes da Fase 3 (`tasks.md`), que é minha e sai deste plano — tipagem já prevista na tabela de waves. Eu proponho e não delego; a execução é do orquestrador. (2) **`data-engineer`** — wave 2, leitura pura: ratificar `FortiNDR → ndr-family` (contra `fortindr-onprem`/`fortindr-cloud`) e `FortiGuard-Service-Bundle → sem equivalente V3.2`; divergência volta ao plano **antes** da wave 4, nunca é resolvida dentro da implementação. (3) **`qa-engineer`** — a fixture `D010-F2` **precisa** de `logs` em nível 0 (provado por execução; com nível 2 o gate morre vacuoso), o oráculo de `D010-ARB1` (d) tem ordem obrigatória (censo V3.2 antes do `resetLandscapeToUnset`), o harness `d010` nasce com `--preflight` no mesmo commit da chave e com o vocabulário de três estados, e `D010-CARD4` (e) precisa de escopo + auto-exclusão nominal. (4) **`build-engineer`** — waves 0, 5, 8, 10 e 11; o repin inline de `PROTECTED` é dele, não do QA (R3 §2), e o `gen_pins.py` é sempre commit separado. (5) **`product-owner`** — dois achados devolvidos, não absorvidos: a duplicação de leitura no papel entre `pr-gapsup` e `#pr-target` para os 4 qids de `QS_GAP_SUPPORT`, e a borda `UNASSESSED_CAPABILITY` + sinal (hoje inalcançável por qid de prática). (6) **PARADA declarada** se o desenho alcançar `ui_v32.css`, `ui_ux_v32.css`, `ui_p52_workspace_v32.js` ou asserção de suíte congelada — exige nova frase do proprietário, pelo rito de `specs/PHASE_5_0_REV_B.md:1638-1641`. (7) **Nota de trilha**: esta execução rodou em **Opus**, não no modelo pinado (`fable`), por decisão de créditos do orquestrador — mesmo desvio já registrado nas Fases 0 e 1.
