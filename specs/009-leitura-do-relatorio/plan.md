# Plano — 009-leitura-do-relatorio

> Fase 2 · dono: tech-lead · consome a spec aprovada no portão de 2026-08-27
> ("Aprova a spec com C13"). Referencia [spec.md](spec.md) e
> [refinement.md](refinement.md) por caminho e **não os repete** (R12): critérios,
> âncora de ordem, quatro estados do card e casos de borda vivem lá; aqui vivem
> camadas, donos, contratos, boundary, waves e riscos.

## Desenho

**Camada e superfície.** Nenhuma camada nova e nenhum módulo novo. A demanda vive
em três camadas já existentes, e a escolha é ditada por onde o dado já mora:

- **Camada 5.2 (workspace)** — a ordem canônica é constante do owner de layout
  (`P52_SECTIONS`) e o glossário canônico é `P52_CAP_HELP`, ambos em
  `ui_p52_workspace_v32.js`. Mover qualquer um dos dois para fora criaria bridge
  novo (R9 §2) e quebraria a âncora de varredura de `P52-HOME1`
  (`tests_p52_layout.js:678` usa `js.split("P52_CAP_HELP")[0]`).
- **Camada 4.x (journey e target)** — a narrativa, a nota da jornada e o card de
  prática-alvo são renderizados por `ui_journey_v32.js` e `ui_target_v32.js`. A
  marcação de domínio e o bloco de ausência nascem **no renderizador**, nunca no
  construtor determinístico (INV-7).
- **Camada 3 (`ui_v32.js`)** — é quem monta `#v32decl` (tela, `renderBlocks`,
  linha 217) e `#pr-landscape` (papel, `buildPrintReport`, linhas 1100-1112). A
  frase de glossário entra aí, **consumindo** o bridge da 5.2.

Nenhuma decisão de negócio, limiar, contagem ou veredito nasce nesta demanda:
score, suficiência, tiers e alvos continuam nos owners de sempre.

### Módulos tocados — um dono por arquivo

| Arquivo | Dono único | O que muda | O que explicitamente **não** muda |
|---|---|---|---|
| `ui_p52_workspace_v32.js` | `ui-engineer` | (a) ordem do literal `P52_SECTIONS` (linhas 550-559) para a âncora da spec; (b) método `capHelpLine(capId)` no bridge `__P52` já registrado | `p52OrderFor()` (a exceção de gate fechado é preservada como está, linhas 584-592); `p52Classify` e o roteamento de nós por balde (linhas 609-638); `p52EvidenceBase` e o anexo do `#p52-evbase` a `actions` (linha 2244); `P52_CAP_HELP` (nenhum verbete é editado); o popover do editor de contexto (linhas 1115-1132); `data-p52-order` (raiz e por seção) |
| `ui_p52_workspace_v32.css` | `ui-engineer` | a régua de 78ch deixa de alcançar `.jn-note` — **um único ponto**, a linha 52 | as outras três linhas da régua (`.p52-sec p`, `.arq-tag`, `.banner-ok`); `.p52-sec-lead`; todas as demais declarações em `ch` (57, 95, 98, 516, 909, 938, 1185, 1914, 1934); o confinamento em `@media screen` |
| `ui_journey_v32.js` | `ui-engineer` | (a) `narrativeHTML` (linha 214) passa a marcar ocorrências de `DOMS[i].pt`; (b) o P3 (linhas 138-142) aponta para "Para avançar" em vez de reenumerar | `buildExecutiveNarrative` continua devolvendo strings puras — `paragraphs`/`trace` sem markup (INV-7); `evolutionThemes` (linha 74); `themesHTML` (linha 208) continua a única enumeração; a classe `ux-micro` da `.jn-note` (linha 209) **permanece**; os ramos de suficiência fechada e de zero temas; `journeyHTML`/régua de estágios |
| `ui_ux_v32.css` | `ui-engineer` | regra nova `.jn-dom` — cor por `var(--dom-accent)` **e** `font-weight` | o mapa único `[data-dom="N"] → --dom-accent` (linhas 68-72) é **lido**, não alterado; nenhum token novo; nenhum hex novo |
| `ui_target_v32.js` | `ui-engineer` | `tgtEnablersHTML(qid)` (linha 166) passa de 1 para 4 estados; nó único `[data-ux-absence="target-enablers"]` no card de comparação, na tela (linha 134) e no papel (linha 267) | S1 intocado (linha 172, lista de habilitadores); a fonte do habilitador — `V32.buildRecommendationContext()` continua sendo lida como hoje, byte-idêntica; `TGT_DISCLAIMER`; o overlay do radar; `setTarget`/`revalidateTargets` |
| `ui_v32.js` | `ui-engineer` | `.v32-caphelp` dentro da `.v32-decl-row` (linha 217) e dentro do `.pr-card` de `#pr-landscape` (linha 1112), sempre sob guarda `typeof` | a **contagem** de `.v32-decl-row` (consumida por `p52ContextSummary`); a lista de declaradas continua derivada de `V32.TECH_LANDSCAPE` (linhas 210-211), nunca do DOM; o ramo `legacyMode` do relatório (linhas 1100-1104); a ordem das seções do relatório impresso |

### Owner do estado (R9 §5) — para cada dado novo

| Dado novo | Owner do estado | Natureza |
|---|---|---|
| Ordem canônica de leitura | `ui_p52_workspace_v32.js` (`P52_SECTIONS`) | constante de apresentação; recomputada a cada render, nunca serializada (INV-8) |
| Frase de glossário por capability | `ui_p52_workspace_v32.js` (`P52_CAP_HELP` é a **única** fonte do texto; `capHelpLine` é transformação pública e declarada, precedente `__P52.copyMap()`) | derivado puro, sem efeito colateral e sem DOM |
| `.jn-dom[data-dom="i"]` | `ui_journey_v32.js` — publica; o índice `i` é do `DOMS` do runtime congelado, que continua sendo a fonte | atributo de apresentação; nenhum consumidor decide nada por ele além do CSS e do gate |
| `[data-ux-absence="target-enablers"]` (contagem + lista) | `ui_target_v32.js` | derivado **no mesmo passe** que a lista de práticas-alvo (B5); nunca persistido |

**Nenhum dado entra no schema de sessão.** `data-engineer` não tem tarefa nesta
demanda; `core-engineer` também não — o engine é apenas lido.

### Restrições de implementação que só o source revela

Estas quatro não estão na spec porque são consequência do código atual. Viajam no
prompt de delegação:

1. **`capHelpLine` depois do literal.** `P52-HOME1` (`tests_p52_layout.js:678`)
   usa `js.split("P52_CAP_HELP")[0]` como prefixo de varredura. Definir a função
   **antes** da linha 204 encolheria esse prefixo e enfraqueceria o gate sem que
   ninguém visse — R10 §1 proíbe. A função entra **depois** do literal.
2. **`.jn-note` não está na régua.** A régua de 78ch
   (`ui_p52_workspace_v32.css:51-54`) não nomeia `.jn-note`: ela a alcança por
   `.p52-sec .ux-micro`, porque o nó nasce como `class="ux-micro jn-note"`
   (`ui_journey_v32.js:209`). "Sair da lista de seletores" (spec §6) significa
   **estreitar a linha 52** — `.p52-sec .ux-micro:not(.jn-note)` —, jamais criar
   `max-width: none` em outro lugar. Nenhuma outra regra em `ch` alcança o nó
   (conferidas as 11 ocorrências do arquivo).
3. **Alinhamento do literal `P52_SECTIONS`.** O `find` de `P52-M3`
   (`tests_p52_mutants.js:123-131`) casa as duas linhas de `target`/`context`
   byte a byte, com as colunas alinhadas do arquivo. Na ordem nova elas continuam
   adjacentes (5ª e 6ª posições do literal de 9); reformatar o array faz o
   mutante deixar de aplicar.
4. **`data-p52-order` é dois atributos com o mesmo nome.** Na raiz
   `#p52-workspace` é enum (`canonical` | `gate-blocked`, linha 2208); em cada
   `.p52-sec` é número (linha 2218). `D009-ORD2` afirma sobre o **primeiro**.

## Contratos e registros

- **Bridges — nenhum novo.** Conferido contra `.claude/verify/bridges.json`: 15
  entradas, `__P52` já registrado com owner `ui_p52_workspace_v32.js`. A demanda
  adiciona um **método** ao objeto já publicado; `check_lint_arch.py` varre nomes
  `window.__*`, e nenhum nome novo nasce. **`bridges.json` não muda.**
- **Patch-points — nenhum.** Nenhum monkey-patch de função global; nenhuma
  extensão via `__P50.registerDecor`. O registro de patch-points desta demanda é
  **vazio**, e é assim que ele fica registrado (R9 §4).
- **Ordem de injeção no builder — relevante e inalterada.** JS:
  engine → adapter → icons → **ui_v32** → ux → **target** → ref → build_meta →
  **journey** → session → p50_shell → p50_suff → p50_results → **p52_workspace**
  (`build_v32_html.py:69-71`). CSS: ui → **ux** → p50 → **p52** (linha 80).
  Isto significa que `ui_v32.js` é injetado **antes** do owner do bridge que
  passa a consumir. É legítimo porque a chamada é de **runtime**, não de carga —
  precedente idêntico e vivo em `ui_v32.js:1160-1162` (`__uxJourneyPrintHTML` e
  irmãos, sempre sob `typeof`). Nenhuma reordenação é necessária e **nenhuma é
  autorizada** por este plano.
- **CSS por prefixo (R9 §6) — duas exceções, aprovadas aqui pelo TL:**
  (a) `.jn-dom` entra em `ui_ux_v32.css` e não num arquivo de prefixo `jn-*`
  porque o arquivo já é o dono de fato de `.jn-themes`/`.jn-note`/`.jn-narrative`
  (linhas 191-194) **e** porque o mapa `[data-dom] → --dom-accent` vive nele
  (68-72); colocar a regra em outro arquivo criaria dependência de token entre
  camadas sem ganho. (b) `ui_p52_workspace_v32.css` continua alcançando seletor
  alheio (`.ux-micro`) — mas a mudança desta demanda **reduz** esse alcance com
  `:not(.jn-note)`. Exceção que encolhe não precisa de allowlist nova.
- **Pins (R8) — 15 arquivos + 3 novos.** Lista canônica na spec §Contratos. Aos
  15 de lá somam-se os arquivos que este plano cria: `fixtures_009_leitura.js`,
  `tests_009_leitura.js`, `tests_009_mutants.js` (arquivo rastreado sem pin =
  FAIL no `baseline`), e o registro `mutation-matrix.json`. Regeneração por
  `gen_pins.py`, **uma única vez**, na Wave 7 — justificativa na seção Waves.
  `declared.m41_payload_sha256` **não muda**; se mudar, PARADA por Porta B.
- **Registros de gate — quem entra, quando:**
  `expected_suites.json` (suíte `d009`) no **mesmo commit** que cria
  `tests_009_leitura.js`; `mutation_map.json` (harness `d009`, `requires: [node,
  python]`) no **mesmo commit** que cria `tests_009_mutants.js`. Motivo mecânico:
  `check_suites.py:44-56` falha em qualquer `tests_*.js` fora dos registros. As
  fixtures novas ficam em `fixtures_009_leitura.js` — o glob é `tests_*.js`, e
  fixture não é suíte.
- **Namespace dos mutantes.** `mutation-matrix.json` já tem um par global `M1`
  (demanda 003, marker-lint). Os mutantes desta demanda registram-se como
  **`D009-M1`…`D009-M19`** (R10 §1: namespace da fase corrente, nunca continuar
  numeração alheia). O `M3` da spec **não** é um mutante `d009`: ele permanece
  `P52-M3`, no harness `p52`, com `find`/`repl` byte-idênticos e `desc`/`reason`
  reescritos (C3). Logo `tests_009_mutants.js` carrega **18** mutantes
  (`D009-M1`, `D009-M2`, `D009-M4`…`D009-M19`).
- **Alvos do harness `d009`:** os 6 módulos de produto + `tests_009_mutants.js`.
  `ui_ux_v32.css` passa a ser alvo de campanha pela primeira vez (hoje não é alvo
  de nenhum harness) — ganho colateral declarado.

## Boundary

Classe mais alta tocada: **`generated` + `registry`, ambas pelo rito.**
**Nenhum protegido é tocado. Nenhuma PARADA por R6; nenhum rito de Porta A/B é
aberto.** Declarado item a item:

- `frozen` — `engine_v32.js` e `quickscan_secops_soccmm_v3_1_3.html` são
  **apenas lidos**: `V32.CAPABILITIES` / `V32.TECH_LANDSCAPE` / `DOMS` /
  `buildRecommendationContext()` são consumidos como hoje, sem alteração de
  payload. `harness_m41_v313.js` e `v3_1_3_functional_snapshot.json`: intocados.
  O `beforeprint` da Camada 1 que expande `<details>`
  (`quickscan_secops_soccmm_v3_1_3.html:1065`) permanece como está — B15 é
  registro, não mudança. O `.why` sempre visível do `apoioBlock` congelado não é
  suprimido (P7).
- `generated` — `quickscan_secops_soccmm_v3_2_dev.html` **nunca é editado à
  mão**: é rebuildado por `python build_v32_html.py` (Wave 5) e o stage `build`
  prova a identidade byte a byte. `ui_icons_v32.js` não é tocado.
- `legacy` — `MANIFEST.sha256` e `specs/PHASE_5_0_REV_A.md`: intocados.
- `registry` — `pins.json` só por `gen_pins.py`, no mesmo PR, com motivo no
  commit.

A substituição da §8 da diretriz da 5.2 é **normativa e já ratificada**
(2026-08-27, registrada na spec) — não é mudança de classe de proteção, e
`docs_phase5/PHASE_5_2_DESKTOP_WORKSPACE_REPORT.md` **não é editado** por esta
demanda: a §8 continua citável como histórico.

## Checklist R9 (módulo novo)

**N/A — nenhum módulo novo é criado.** Item a item: IIFE + `__installed` N/A ·
um bridge registrado N/A (nenhum bridge nasce; `__P52` ganha método) · CSS por
prefixo **aplicável e tratado** em Contratos (duas exceções, uma delas encolhendo)
· zero `innerHTML=` **aplicável parcialmente**: `check_lint_arch.py:31-38` cobre
`ui_p5*`, então `ui_p52_workspace_v32.js` continua obrigado a `textContent`/
`setAttribute` (a ordem e o `capHelpLine` não introduzem HTML); `ui_target_v32.js`,
`ui_journey_v32.js` e `ui_v32.js` são camadas 3/4.x e permanecem no padrão de
template literal com `esc32`, que é o estado herdado — **nenhuma delas passa a
usar `innerHTML` onde hoje não usa** · helper único de invariante N/A.

**Orçamento de ~600 linhas (R9 §7) — justificativa registrada.**
`ui_p52_workspace_v32.js` tem 2.689 linhas e cresce ~15 com `capHelpLine`. O
excesso é legado documentado (o próprio texto da R9 cita este arquivo como
contraexemplo). Extrair o glossário para módulo novo **não** é a saída: quebraria
a âncora `js.split("P52_CAP_HELP")` de `P52-HOME1` e criaria bridge novo. Fica
registrado como dívida, **não** corrigido de passagem (R13).

## Waves

Dependência real, não conveniência. `[P]` = paralelizável dentro da wave
(delegações na mesma mensagem). Nenhum arquivo aparece com dois donos na mesma
wave; nenhum arquivo aparece com donos distintos em waves diferentes.

| Wave | Tarefas (resumo) | Depende de |
|---|---|---|
| **0 — ambiente** (`build-engineer`) | `npm ci --no-audit` na raiz. **Sem isso a Fase 4 não executa red nenhum**: `node_modules` não existe nesta worktree e toda suíte jsdom faz `require("jsdom")` (`tests_p52_layout.js:20`). `node_modules/` está no `.gitignore`, então a árvore permanece limpa — pré-condição de `check_mutation.py:41-46`. Nenhum arquivo versionado muda; `package-lock.json` não é reescrito por `npm ci`. | portão da Fase 3 |
| **1 — fixtures** (`qa-engineer`) | `fixtures_009_leitura.js` (novo): a fixture **S3** (prática-alvo sobre capability sem gap, com contexto declarado) e a fixture **B9** (uma capability declarada, outra UNSET, alvo em ambas). Montadas pelos owners canônicos (`p50ApplyPresence`, `p50ApplyTargets`), no padrão de `fixtures_p52.js`; **`fixtures_p52.js` não é alterado**. Verificar por execução que cada fixture alcança o estado pretendido — é o que justifica a Wave 0 vir antes. | 0 |
| **2 — gates e red** (`qa-engineer`) | **2a [P]** `tests_009_leitura.js` com `D009-ORD1`, `ORD2`, `DOM1`, `DOM2`, `NXT1`, `NXT2`, `GLO1`, `GLO2`, `UNS1`, `UNS2`, `UNS3`, `UNS4`, `ABS1`, `LEG1`, `EVB1` **+** entrada `d009` em `expected_suites.json` **no mesmo commit**. **2b [P]** `tests_p52_layout.js`: reancorar `P52_CANONICAL_ORDER`, `P52_RELEASED_ORDER`, `P52_BLOCKED_ORDER` (linhas 56-64) e trocar a asserção de `P52-TGT1` (`:236-240`) por `iT > iE` **e** `iC === iT + 1`, preservando a cláusula `evidence === iE + 1` do gate fechado. **2c [P]** `tests_p52_chromium.js`: reancorar `CANON` (:239) e `BLOCKED` (:298). **2d [P]** `tests_p52_mutants.js`: reescrever `desc` e `reason` de `P52-M3` (`find`/`repl` **byte-idênticos**). **2e** prova de red: executar, nomear o FAIL de cada gate, **commitar o red**, registrar `red.commit` + `red.status: proven` no planning-state (R3 §4). | 1 |
| **3 — implementação** (`ui-engineer`, cinco delegações, um módulo cada) | **3a [P]** `ui_p52_workspace_v32.js` — ordem nova em `P52_SECTIONS` com o alinhamento de colunas preservado + `capHelpLine` **depois** do literal `P52_CAP_HELP`. **3b [P]** `ui_journey_v32.js` — marcação `.jn-dom` no renderizador + ponteiro no P3. **3c [P]** `ui_ux_v32.css` — regra `.jn-dom` (cor por token + `font-weight`). **3d [P]** `ui_p52_workspace_v32.css` — `:not(.jn-note)` na linha 52. **3e [P]** `ui_target_v32.js` — quatro estados + `[data-ux-absence]` na tela e no papel. 3b e 3c são paralelos porque ambos codificam contra o contrato **declarado na spec** (`.jn-dom[data-dom="i"]`), não um contra o outro. | 2 (red provado) |
| **4 — consumidor e docs** | **4a [P]** `ui_v32.js` (`ui-engineer`) — `.v32-caphelp` em `#v32decl` e em `#pr-landscape`, sob guarda `typeof`; **depende de 3a**, que publica o método. **4b [P]** `USER_GUIDE.md` §8.1 (`doc-writer`) — a ordem nova, nas duas variantes. **4c [P]** comentário de `fixtures_p52.js:16-22` (`doc-writer`) — só o comentário de `P52-F1`; nenhuma mudança funcional na fixture. | 3 |
| **5 — build** (`build-engineer`) | `python build_v32_html.py`. **Não é acabamento, é pré-condição do verde:** as suítes jsdom bootam `quickscan_secops_soccmm_v3_2_dev.html` (`tests_p52_layout.js:25-26`), não os módulos-fonte. Sem o rebuild, nenhuma implementação das Waves 3-4 é visível para gate algum. (Simetricamente: o red da Wave 2 é medido contra o HTML **ainda não** rebuildado, e é isso que o torna um red honesto.) | 4 |
| **6 — verde e campanha** (`qa-engineer`) | **6a** executar `d009` + as suítes 5.2 e fixar a contagem de `d009` em `expected_suites.json` no verde. **6b** `tests_009_mutants.js` (18 mutantes) **+** harness `d009` em `mutation_map.json` no mesmo commit — os `find` só podem ser escritos agora, porque ancoram no código que as Waves 3-4 acabaram de produzir. **6c** executar a campanha `d009` (e `core`, que é node+python) e registrar os pares `D009-M1..D009-M19` em `mutation-matrix.json`, cada um com `harness`, `gate` e `ultima_prova.resultado` — o stage `tdd` exige os três (`check_tdd.py:47-52`). | 5 |
| **7 — repin** (`build-engineer`) | `gen_pins.py` **uma única vez**, depois que fonte, testes, fixtures, registros, docs e HTML gerado estão todos commitados — `gen_pins.py` lê blobs de HEAD (R8), então repin antecipado não capturaria as Waves 6. Motivo no commit; conferir que `declared.m41_payload_sha256` permanece `9794b267…`. | 6 |
| **8 — validação** (`qa-engineer`, `build-engineer`, `product-owner`) | Pipeline completo (`.claude/verify/run.sh`): `baseline`, `boundary`, `build`, `m41`, `lint-arch`, `marker-lint`, `icons-check`, `state`, `tdd`, `suites`, `suites-heavy`, `mutation`. Job `visual` do CI para `p52chromium` (55/0) e para as campanhas `p51`/`p52`, que exigem Chromium. `spec-validate`. Por último, **aceite de intenção do PO**, conferindo os dois achados que este plano devolve em vez de absorver. | 7 |

**Por que o repin é uma wave só, e no fim.** R8 exige o mesmo **PR**, não o mesmo
commit. Um repin único deixa **uma** janela declarada de `baseline` vermelho —
abre no commit red da Wave 2 e fecha na Wave 7 — em vez de três ou quatro
transições de identidade para a mesma demanda. O head do PR é integralmente
verde.

## Riscos e rollback

| Risco | Detecção (gate) | Resposta / rollback |
|---|---|---|
| **Colisão com a 010 em `tgtEnablersHTML`** — a 010 altera a mesma função para os itens 4 e 8 | Conflito de merge, ou perda silenciosa dos gates `D009-UNS*`/`ABS1` se a 010 reescrever a função | Regra declarada na spec §Contratos e reafirmada aqui: a 010 **nasce depois da 009 mergeada em `develop`**, ou herda explicitamente os quatro estados, o nó `[data-ux-absence]` e os cinco gates como piso. Nenhuma tarefa desta demanda antecipa decisão da 010 (fonte do habilitador, `MAP` congelado, aviso global) |
| **C15 depende de `Element.matches` porque jsdom não faz cascata** — `getComputedStyle` não resolve `max-width` herdado de folha injetada | `D009-LEG1` | Desenho já é esse: o gate extrai do CSS os seletores com `max-width` em `ch` e os aplica ao nó real. **Instrução dura ao `qa-engineer`:** seletor que o `matches` não suportar deve **propagar exceção como FAIL**, nunca ser engolido como "não casou" — senão `:not(.jn-note)` não suportado viraria verde falso. Isso torna desnecessário um `prototype/`: a dúvida é respondida na primeira execução do gate |
| **Buraco na numeração visível das seções** — `data-p52-order` e o número no título usam o índice na ordem **completa** (`ui_p52_workspace_v32.js:2218, 2221`), e a seção ausente deixa vão | nenhum gate hoje | **Pré-existente e verificado**: com gate aberto o `evidence` já é pulado com `continue` enquanto `i` avança, e a contagem hoje é 1,2,3,5,6,7,8,9. A ordem nova **move** o vão de 4 para 8; não o cria. Achado devolvido ao `product-owner`, **não absorvido** (R13). Nenhuma tarefa deste plano altera a semântica de `data-p52-order`, e nenhum gate `D009-*` afirma sobre o número por seção |
| **Realinhar `P52_SECTIONS` faz `P52-M3` deixar de aplicar** | `check_mutation.py` reporta o mutante não aplicado | Restrição de forma já declarada; custo se escapar é uma rodada. Conferir o diff do literal antes do commit da Wave 3a |
| **`capHelpLine` definido antes do literal encolhe o prefixo de `P52-HOME1`** | nenhum — é exatamente o ponto cego | Restrição 1 do Desenho viaja no prompt de 3a; revisão do diff confere a posição |
| **Rebuild esquecido entre implementação e medição** | `build` (divergência rebuild×HEAD) e, antes dele, o verde que não chega | Wave 5 é wave própria e bloqueante. Qualquer verde medido sem ela é inválido por construção |
| **Campanhas `p51`/`p52` disparadas sem Chromium** — `ui_v32.js` dispara `core` (node+python) **e** `p51`; os outros cinco módulos disparam `p52`; ambos declaram `requires: [chromium]` | stage `mutation` — FAIL **nomeado**, nunca SKIP (R10 §2) | Verificado nesta worktree: não há `%LOCALAPPDATA%\ms-playwright` nem `CHROME_PATH`, e `known_issues.json` está com `issues: []` (nenhuma exceção nominal viva). Portanto: localmente a demanda roda `run.sh --light` (o stage `mutation` é `heavy`), e as campanhas `p51`/`p52` são executadas **no job de CI** da Wave 8. Isso é agendamento, não dispensa — o resultado entra em `mutation-matrix.json` |
| **Suíte nova fora do registro** | `suites` (`check_suites.py:53-56`) | Registro no mesmo commit da criação, como escrito nas Waves 2a e 6b. Não postergar "até o verde" |
| **Registrar `d009` com contagem antes do verde deixa `suites` vermelho no red** | `suites` | **Esperado e declarado**: no commit de red a suíte é vermelha por definição; a contagem é fixada na Wave 6a. Ninguém deve "consertar" isso adiando o registro — adiar troca um vermelho esperado por um FAIL de cobertura |
| **`P52_CANONICAL_ORDER` sem consumidor** — única ocorrência é a própria definição (`tests_p52_layout.js:56`) | nenhum | Reancorar mesmo assim (C3 a nomeia): deixar a ordem antiga viva ao lado da nova seria duas âncoras contraditórias no mesmo arquivo — exatamente o que C15 proíbe por analogia no CSS |
| **`m41` muda após o rebuild** | stage `m41` | **PARAR e reportar** — virou Porta B, que a spec não autoriza. Rollback por `git revert` da Wave 5 |
| **Contagem de `p52layout`/`p52chromium` muda** (45/0 e 55/0) | `suites` e job `visual` | C3 declara que nenhum gate 5.2 nasce ou morre. Contagem diferente = a reancoragem virou reescrita: parar e reabrir a análise |

Rollback geral: cada wave é commit atômico e reversível por `git revert`, em
ordem inversa (8→0). A identidade anterior do HTML gerado permanece recuperável
pelo pin registrado em `pins.json` antes da Wave 7.

## Protótipo

**Nenhum.** As três questões candidatas foram fechadas por leitura de source
nesta fase, sem executar código:

- *A ordem nova é alcançável com `P52_F1`?* Sim — `#ux-target` é renderizado
  **sempre** (`ui_target_v32.js:96-101` emite o bloco "Nenhum cenário-alvo foi
  definido" quando não há override) e `#v32panel` é criado incondicionalmente
  (`ui_v32.js:153-156`), então os baldes `target` e `context` nunca ficam vazios
  e as 8 seções da variante aberta existem.
- *`landscapeEnabled: false` existe mesmo no runtime congelado?* Sim —
  `engine_v32.js:41` (fábrica `CAP`) e `:43-45`: `soc-governance`
  (`mandate`, `governance`, `policies`), `soc-staffing` (`team-capacity`),
  `soc-skills` (`training`). C13 / `D009-UNS4` / `D009-M15` estão ancorados.
- *`:not()` no `matches` do jsdom?* Tratado como risco com resposta fail-safe
  (tabela acima), não como protótipo.

Se alguma delas se mostrar falsa na execução, o achado volta ao plano — o
protótipo continua proibido de virar produção.

---

ARQUIVOS_TOCADOS: specs/009-leitura-do-relatorio/plan.md (criado — único artefato desta fase)
RESUMO: Plano da Fase 2 pelo template, referenciando a spec por caminho sem repeti-la. Desenho com dono único por arquivo para os 6 módulos (todos `ui-engineer`, uma delegação cada), com o que muda e o que explicitamente não muda, e owner do estado para os 4 dados novos — nenhum entra no schema de sessão. Contratos: nenhum bridge novo (conferido contra bridges.json: `__P52` já registrado ganha método), registro de patch-points vazio, ordem de injeção do builder declarada e inalterada com a justificativa de runtime (precedente ui_v32.js:1160-1162), duas exceções de CSS por prefixo aprovadas pelo TL (uma delas encolhendo alcance alheio). Boundary: classe mais alta é generated + registry, ambas pelo rito; engine e Camada 1 apenas lidos; nenhuma PARADA. Nove waves por dependência real: 0-ambiente (`npm ci`) → 1-fixtures → 2-gates+red → 3-implementação (5 módulos [P]) → 4-consumidor+docs → 5-rebuild (pré-condição do verde, não acabamento) → 6-verde+campanha → 7-repin único → 8-validação. Quatro restrições que só o source revela viajam no prompt: `capHelpLine` depois do literal (senão encolhe o prefixo de P52-HOME1), `.jn-note` sai da régua estreitando `.p52-sec .ux-micro` com `:not()` (ela nunca esteve nomeada na regra), alinhamento de colunas de P52_SECTIONS preservado para P52-M3 aplicar, e `data-p52-order` sendo dois atributos homônimos. Mutantes namespaced `D009-M1..M19` porque `M1` já existe globalmente (demanda 003); `M3` da spec continua sendo `P52-M3` no harness p52, então `tests_009_mutants.js` carrega 18.
EVIDÊNCIA: nenhum gate executado — Fase 2 é desenho, e `node_modules` continua ausente nesta worktree (é a Wave 0 do próprio plano). Leituras desta fase, todas só-leitura: templates/plan.md e tasks.md; rules orchestration/modularity/boundary/tdd/gates/pins; spec.md da demanda na íntegra (454 linhas, com as duas ratificações); planning-state 009 e o schema; memória do tech-lead; specs/003-marcador-duplicado/plan.md (precedente de formato). Registros conferidos: bridges.json (15 entradas, `__P52` presente, owner `ui_p52_workspace_v32.js` — nenhum bridge novo nasce), boundary.json (4 classes), expected_suites.json (p52layout 45/0, p52chromium 55/0), mutation_map.json (4 harnesses; `ui_v32.js` é alvo de core/p51/p52 e `ui_ux_v32.css` de nenhum), mutation-matrix.json (7 pares, colisão de nome `M1` confirmada), pins.json (195 arquivos, `declared.m41_payload_sha256` = 9794b267…), pipeline.yaml, known_issues.json (`issues: []`). Verificadores lidos: check_suites.py:44-56 (cobertura por glob `tests_*.js`), check_mutation.py:1-60 (árvore limpa + `have("chromium")` por cache ms-playwright/CHROME_PATH — ambos ausentes aqui), check_tdd.py:47-52 (pares completos), check_lint_arch.py (innerHTML/IIFE só em `ui_p5*`). Source: ui_p52_workspace_v32.js (P52_SECTIONS 550-559, p52OrderFor 584-592, p52Classify 609-638, P52_CAP_HELP 204+, uso 1115-1132, render 2186-2250, bridge 2669-2687), ui_p52_workspace_v32.css (régua 51-54 e as 11 declarações em `ch`), ui_journey_v32.js (P3 138-142, journeyHTML 208-209, narrativeHTML 214-218, `__DEV` 236), ui_ux_v32.css (mapa 68-72, jn-* 191-194), ui_target_v32.js (tgtSection 95-101, tgtEnablersHTML 166-173, papel 267), ui_v32.js (renderBlocks 196-251, print 1100-1112, guardas `typeof` 1160-1162), engine_v32.js:41-45 e 285 (landscapeEnabled), build_v32_html.py:55-82 (ordem de injeção JS e CSS), tests_p52_layout.js (constantes 56-67, P52-TGT1 226-245, P52-HOME1 623-690 com o split anchor em :678, P52-DOC1 1141-1190), tests_p52_chromium.js:239 e :298, tests_p52_mutants.js:123-131, fixtures_p52.js:1-115, USER_GUIDE.md:265-325. Contagem por regex dos temas de P52-DOC1 sobre USER_GUIDE.md (script descartável, sem escrita no repo): "navegação da tela de resultados" só existe em 267 e 269, ambas dentro do §8.1; "suficiência de evidência" (306) e "Base de evidência" (312) são **ocorrência única no arquivo**; "cenário-alvo" tem 10 ocorrências e não corre risco.
DEPENDÊNCIAS: (1) **Portão da Fase 2 com o usuário** antes da Fase 3 (`tasks.md`), que é minha e sai deste plano — tipagem prevista: W0 `chore`/build, W1 `chore`/QA, W2 `feature`-red/QA, W3-W4a `feature`/UI, W4b-4c `doc`, W5 `chore`/build, W6 `feature`/QA, W7 `chore`/build, W8 `chore`-validação. A execução é do orquestrador; eu proponho e não delego. (2) **`doc-writer`** — ao reescrever `USER_GUIDE.md` §8.1, os temas de `P52-DOC1` sob risco real são três, e só um deles está dentro do §8.1: **"navegação da tela de resultados"** (regex `navega(r|ção)…(seç|resultado)`, casa apenas nas linhas 267 e 269, as duas dentro do bloco a reescrever — se o título deixar de dizer "navegar a tela de resultados", o gate cai); e, no raio adjacente que a ordem nova obriga a mexer, **"suficiência de evidência"** (linha 306) e **"Base de evidência"** (linha 312), ambas **ocorrência única no arquivo inteiro**. "cenário-alvo" aparece 10 vezes e não corre risco. O guia também não pode passar a citar `ui_p52_workspace_v32.js/css` (vira documentação de implementação = FAIL) nem ganhar promessa de resultado. (3) **`qa-engineer`** — a reancoragem dos oráculos 5.2 é **dele, nunca do `ui-engineer`**: as 5 constantes (`P52_CANONICAL_ORDER`/`P52_RELEASED_ORDER`/`P52_BLOCKED_ORDER` em `tests_p52_layout.js:56-64`; `CANON` em `tests_p52_chromium.js:239`; `BLOCKED` em `:298`), a asserção de `P52-TGT1` e o registro de `P52-M3` estão nas Waves 2b/2c/2d com dono `qa-engineer`, e nenhuma tarefa de `ui-engineer` toca arquivo `tests_*`. (4) **`build-engineer`** — Wave 0 (`npm ci --no-audit`), Wave 5 (rebuild) e Wave 7 (`gen_pins.py` único); confirmar ambiente de rebuild determinístico e que `declared.m41_payload_sha256` não muda. (5) **`product-owner`** — dois achados devolvidos, **não absorvidos**: (a) o buraco na numeração visível das seções é **pré-existente** e verificado no código (`ui_p52_workspace_v32.js:2214-2221`: com gate aberto o `evidence` já é pulado enquanto `i` avança, contagem atual 1,2,3,5,6,7,8,9); a ordem nova apenas **move** o vão de 4 para 8 — decisão de corrigir exige refinamento próprio; (b) distinguir S3 de S4 por texto próprio segue fora de escopo. (6) **Achado novo desta fase, para `product-owner` + `qa-engineer`**: a prosa de B4 na spec §5 diz "sem cenário-alvo não há seção e não há aviso", mas `ui_target_v32.js:96-101` renderiza `#ux-target` **sempre** — o que não existe sem override é o card de comparação `#ux-tgt-cmp`. Nenhum gate `D009-*` exercita B4 (C10 exige ≥1 prática-alvo), então **nenhum gate muda e a spec aprovada não é alterada por mim**; registro para que ninguém escreva um gate futuro sobre a ausência da seção. (7) **Demanda 010** herda o patch de `tgtEnablersHTML` e os gates `D009-UNS1..4`/`ABS1` como piso. (8) **Nota de trilha**: esta execução rodou em **Opus**, não no modelo pinado (`fable`), por indisponibilidade de créditos — mesmo desvio já registrado nas Fases 0 e 1.
