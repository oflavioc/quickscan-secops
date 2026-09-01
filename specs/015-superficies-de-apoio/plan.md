# Plano — 015-superficies-de-apoio

> Fase 2 · dono: tech-lead · consome a [spec.md](spec.md) aprovada e o
> [refinement.md](refinement.md); não repete nenhum dos dois (R12).
> Eu proponho; a execução é do orquestrador (R5) — este artefato não delega.
> Produzido sob a delegação do proprietário de 2026-08-29, com a **autorização
> nominal §29.4 de 2026-08-31** (arquivo `ui_v32.js`) e a confirmação da mesma
> data de que ela **cobre o caminho de impressão dentro do arquivo**
> (`buildPrintReport`, `:1152`) — precedente das demandas 009 e 010.

## 0 · A queda do C4 — registrada, não apagada

**Decisão do orquestrador, 2026-08-31, antes da Fase 2.** O critério **C4**
(resíduo `C × I` declarado na tela, `[data-v32-relacao="catalogo-unico"]` em
`#v32panel`) e seu gate **`D015-RES1`** **caem**. Razão, nas três partes que a
decisão nomeou: acrescentaria texto a uma tela que o cliente já chamou de
carregada; o faria numa seção (Contexto tecnológico) que já fala de outras duas; e
o `product-owner` classificou como **fraca** a evidência que sustentava a linha.
A própria spec previa esse desfecho por escrito (§Superfície 5, *"Se o
proprietário julgar a linha ruído, C4 cai e o resíduo volta a ficar aberto e
declarado"*) — logo isto é **execução de uma cláusula da spec**, não emenda contra
ela.

Consequências mecânicas, todas rastreáveis:

| O que cai | Efeito |
|---|---|
| **C4 / `D015-RES1`** (5 alíneas) | A demanda passa a ter **5 critérios** (C1, C2, C3, C5, C6) e **5 gates** |
| **Mutantes `M11`, `M12`, `M13`** | Saem junto — inclusive o `M13`, que a tabela de tautologia marcava **"não sei"**. Os três ids ficam **aposentados**: nunca reutilizados, nunca renumerados (R12) |
| **Superfície 5 · `#v32panel`** | `renderBlocks` (`ui_v32.js:233-312`) **não é tocada**. As superfícies caem de cinco para **quatro**, e a demanda deixa de escrever qualquer coisa na **tela de contexto** |
| **A linha do resíduo `C × I`** | Volta a ser **resíduo aberto e declarado**, pela doutrina ratificada em P5 do refinamento. Não vira achado novo, não vira dívida silenciosa |
| **A tabela de tautologia** | Perde a única linha que dizia "o mais forte da spec" (`D015-RES1(a)(b)(e)`) — **consequência que o plano nomeia e não disfarça**: dos 5 gates restantes só `D015-ANC1(c)(e)`, `D015-HOWTO1(d)`, `D015-NOSUB1` e `D015-GOV1(a)(b)` têm discriminante de estado; o resto é discriminado **só por mutante** |

**Isso exige errata na `spec.md` ANTES do red** (T004): o `spec-validate` da Fase 6
extrai os critérios da spec e classificaria `C4`/`D015-RES1` como **"faltando"** —
a classe mais cara. A errata segue a forma já praticada nesta jornada: bloco
próprio de errata, **a célula do critério também é emendada**, e **nenhuma
ratificação anterior é reescrita**.

---

## 1 · Desenho

Camada única: **`ui_v32.js`** — a camada de interface V3.2, IIFE desde `:8`.
Nenhum módulo novo, nenhuma camada nova, nenhuma superfície nova. Quatro sítios,
**um só dono** (`ui-engineer`), **uma só delegação**, **um só commit de produto**.

| # | Sítio | Função | O que muda | Superfície |
|---|---|---|---|---|
| **S1** | `ui_v32.js:749-750` | `buildSupportHTML` | O literal do `eyebrow` do bloco `#v32prio` — **só o texto do título** | tela |
| **S2** | `ui_v32.js:1275` | `buildPrintReport` (seção G) | O literal do `<h3>` que precede `#pr-sup-prio` — **só o texto** | papel |
| **S3** | `ui_v32.js:1075-1099` | `qsGapSupportHTML` | **Um nó novo** `[data-pr-gap-fonte]`, irmão de `[data-pr-gap-why]`, nos **dois** ramos (`:1090-1094` não declarado · `:1096-1099` declarado) | papel |
| **S4** | `ui_v32.js:1110-1121` | `qsHowToReadHTML` | **Um `<li>` novo** (o 7º), literal estático | papel |

**Owner do estado (R9 §5): nenhum dado novo nasce.** Os quatro sítios são função
pura de coisa já calculada — `prioCaps` (S1/S2), `f.id`/`MAP` (S3), nada (S4).
Não há estado, não há cache, não há leitura de DOM alheio, não há serialização
(INV-8 intacta).

### O que explicitamente NÃO muda — a lista é parte do desenho

`renderBlocks` · `hideLegacyRecommendation` · `HIDE_EYEBROWS` (`:109-110`) ·
`SUPPORT_TITLES` (`:107-108`) · `presentationOf` · `temPayloadV32` ·
`baseAbsenceHTML` · `neutralPrioCardHTML` · `capCardHTML` · `baseCardHTML` ·
`prCards` · `whyHTMLOf`/`prWhy` · `publishableStats` · `qsCoverHTML` ·
`QS_GAP_SUPPORT`/`MAP`/`OFFERINGS`/`PRODUCTS` · a **ordem e os ids das seções do
papel** (`pr-*`, ordem canônica ratificada pela 009) · **todo o CSS** ·
`engine_v32.js` e a Camada 1 (apenas lidos) · `ui_target_v32.js` (**não
autorizado**; ver §3).

`D015-NOSUB1` é a prova executável dessa lista, e `D015-GOV1` a da última linha.

### As decisões de forma que o implementador recebe prontas

- **S3 é irmão, nunca herdeiro.** `class="pr-gapsup-why"` (classe do próprio
  módulo, já estilizada em `ui_v32.css:192`, **sem CSS novo**) + atributo
  **próprio** `data-pr-gap-fonte`. Reusar `data-pr-gap-why` quebraria `P51-REC1`
  sem tocar em código dele — é o mutante `M7`.
- **S3 vai entre o `[data-pr-gap-why]` e o `<ul>`**, e **termina em ponto final**
  (§2.4).
- **S4 é literal constante**, sem interpolação de `ans`/`suff`/`stats` — a caixa é
  estática por exigência de `P51-DOC12` (`outerHTML` comparado entre duas sessões).
- **S1/S2 dizem a mesma oração principal**; só S1 leva o sufixo `· contexto V3.2`
  (ratificado, permanece). O literal candidato da spec **não é vinculante**: quem
  redige é o `ui-engineer`, quem julga a redação é o `product-owner` na Fase 6.

---

## 2 · Restrições medidas — orçamento, não sugestão

Tudo abaixo foi **medido nesta worktree em 2026-08-31**, não estimado. Onde a
medição contradiz a spec, a medição vale e está dito.

### 2.1 · A caixa "Como interpretar" (S4) — o orçamento real

| Métrica | Hoje | Limite | Folga |
|---|---|---|---|
| `li` | **6** | 5–8 (`tests_p50_core.js:3826` · `tests_p50_chromium.js:3595`) | **+1** — o 7º item cabe; o 8º fecharia a porta |
| `txt(#pr-howto).length` **cru** (jsdom; `txt = textContent.trim()`, `:66`) | **585** | ≤ 900 (`:3828`) | **315** |
| `textContent` **normalizado** (`replace(/\s+/g," ")`, `tests_p50_chromium.js:3570`) | **544** | ≤ 900 (`:3597`) | 356 |

**Os dois gates medem coisas diferentes com o mesmo número.** O jsdom conta a
indentação do literal; o Chromium a colapsa. O orçamento vinculante é o **cru**:
**315**. Um `<li>` novo custa `L + 7` (6 espaços de indentação + `\n`), logo o
texto visível cabe em **~308 caracteres** — larguíssimo para uma frase de ~180.
Os 6 itens de hoje medem 79/82/96/78/78/94 caracteres (média 85).

A estimativa de ~540 do `product-owner` **corresponde à métrica normalizada**
(544), não à que reprova primeiro. Diferença de 41 caracteres: irrelevante para a
decisão, relevante para o registro — e é por isso que a **medição autoritativa é
tarefa** (T017), **depois do rebuild**, nunca antes.

### 2.2 · O título (S1/S2) — três restrições que a spec não podia conhecer

1. **Substring proibida: `"Como a Fortinet pode apoiar"`.** `tests_ui_m31.js`
   (**suíte congelada**) varre `.section-title` por *includes* dessa oração em
   três gates: `:38` (visível em legado), `:60` (**oculto** havendo contexto),
   `:137` (visível de novo após `#v32clear`). Um eyebrow V3.2 que a contivesse
   seria contado como título congelado **visível quando deveria estar oculto** →
   `U2` vermelho. Isto é **mais forte** que `C1(e)`, que só proíbe igualdade e
   substring do título inteiro. **Restrição dura para o `ui-engineer`.**
2. **Unicidade dentro da seção de apoio.** `tests_p52_layout.js:530-532` exige que
   os `.section-title` da seção de apoio do workspace sejam **distintos**. O novo
   eyebrow não pode colidir com `SUPPORT_TITLES` nem com
   `"Leitura base — contexto tecnológico não informado"` / `"Apoio baseado na
   maturidade"` / `"Leitura arquitetural"`.
3. **Fora de `HIDE_EYEBROWS`/`D010_HIDE_EYEBROWS`.** As duas listas
   (`ui_v32.js:109-110` e `fixtures_010_vao.js:675-676`) contêm **só** títulos da
   Camada 1. O eyebrow V3.2 está fora hoje e tem de continuar fora — entrar nelas
   faria `d010FrozenTitles` colher um título a mais e `d010AssertFixtureStates`
   reprovar por censo, **antes** de qualquer alínea.

**Resultado negativo, medido e registrado:** o literal
`"Apoio nas prioridades declaradas"` aparece em **exatamente dois lugares**
(`ui_v32.js:749` e `:1275`) e no HTML gerado — **nenhuma suíte e nenhum mutante o
pina como texto**. A retitulação não apodrece âncora nenhuma.

### 2.3 · `P52-SUP3` sobrevive à retitulação — com uma ressalva

`tests_p52_chromium.js:1549-1609` colhe `#v32support > .section-title` e assere
**só a contagem** (`blocos.length >= 2`), nunca o conteúdo — a retitulação passa.
**Ressalva:** o texto do título **entra no payload de evidência**
`docs_phase5/evidence_p52/P52-SUP3-cards.json`, pinado em
`evidence_bridge.json:387`. O job `visual` do CI já tem o passo
`git checkout -- docs_phase5/` exatamente para isso. Não é decisão desta demanda;
é risco nomeado ao `build-engineer` (§9).

### 2.4 · `P51-REC1` (S3) — quatro cláusulas, todas duras

`tests_p50_core.js:3336-3437`, **não editado**, regressão obrigatória:

- **ponto final obrigatório** — o scanner de FortiClient fatia
  `host.textContent` por `"."` (`:3418`); frase sem ponto se funde à vizinha e
  pode arrastar `FortiClient` para fora do escopo de endpoint;
- **sem `Forti[A-Z]`** no nó (C2(d)) — e sem repetir a lista de opções;
- **sem overclaim** (`:3429`): `é obrigatório` · `requisito obrigatório` ·
  `solução completa` · `compra recomendada` só passam com negação nas 60 posições
  anteriores. O caminho seguro é **não usar nenhuma delas**;
- **todas as `opts` continuam listadas** (`:3380-3383`) — o nó é **aditivo**.

---

## 3 · Boundary (R6)

**Classe mais alta tocada: `frozen`/§29.4 — `ui_v32.js`, sob autorização nominal
do proprietário de 2026-08-31, por arquivo, válida só para a 015.**

| Alvo | Classe | Rito |
|---|---|---|
| `ui_v32.js` | protegido §29.4 · pinado em `PROTECTED` (`tests_p50_core.js:192`) **e** em `pins.json:300` (`d594dafe…9bb85`; as duas fontes em acordo, conferido nesta escrita) | **Autorizado nominalmente.** Exige **repin inline** com comentário-trilha (R8 §2) **e** `gen_pins.py` no mesmo PR (R8 §1) |
| `quickscan_secops_soccmm_v3_2_dev.html` | `generated` | Só via `build_v32_html.py` (T015) |
| `pins.json` | `registry` | Só via `gen_pins.py`, motivo no commit |
| `tests_p50_core.js` | suíte congelada (§29.4, `:1618-1619`) | **Única escrita permitida: o repin inline de `PROTECTED`.** Nenhuma asserção é tocada |
| `ui_target_v32.js` | protegido §29.4 · **NÃO autorizado** | **Não é tocado.** Ver abaixo |
| `engine_v32.js`, Camada 1 | `frozen` | Apenas lidos. Porta B **não** é aberta; `declared.m41_payload_sha256` inalterado |

### `ui_target_v32.js` — a pergunta que o orquestrador mandou responder

**NÃO é necessário. Não há PARADA a declarar por este eixo.** A demonstração, em
três passos:

1. O único critério que flertava com ele era **C4**, pelo predicado "onde houver
   prática-alvo declarada" — e **C4 caiu**. Com ele, cai o motivo.
2. `D015-GOV1` **lê** `#pr-target` do HTML construído (produto), nunca o fonte —
   ler não é tocar, e é justamente o instrumento que prova que a autorização não
   foi excedida.
3. O mutante **`D015-M16`** (mover a declaração de S3 para o card-alvo) **muta**
   aquele arquivo — e por isso roda em **worktree efêmera, manual, fora da árvore
   da demanda**, no rito ratificado na 011 (`T021`). O harness automatizado
   **nunca** toca `PROTECTED`: foi exatamente aí que a 009 se queimou.

**O contrabando recusado permanece recusado.** Condicionar qualquer texto a
`TARGET_PROFILE`/`tgtHasOverrides()` seria acoplamento inter-módulo fora de bridge
(R9 §3) para dentro do arquivo vedado — e aquele módulo **não é IIFE** (`:1-11`),
expondo os símbolos no escopo global, o que torna o acoplamento fácil e por isso
mais perigoso. **Este plano não o reintroduz nem por conveniência de fraseado**: o
remédio continua sendo o **condicional**, e com a queda do C4 nem isso é mais
necessário — nenhum dos cinco critérios restantes fala do cenário-alvo.

### Paradas condicionais — nomeadas, não assumidas

- **§29.6 (semântica nova em PDF).** Três dos quatro sítios são de papel. A
  autorização é **por arquivo** e o proprietário confirmou em 2026-08-31 que
  **cobre `buildPrintReport`**; 009 e 010 são precedente vivo. Fica registrado o
  **limite**: se o proprietário entender que a §29.6 exige palavra própria para o
  papel, a Fase 4 **para**. Está em DEPENDÊNCIAS como confirmação de uma linha —
  não como suposição deste plano.
- **Sufixo `· contexto V3.2`.** Ratificado. Se a redação ficar intragável com ele,
  o rito é **parar e devolver**, nunca decidir (spec §Fora de escopo 3).
- **Qualquer necessidade de editar asserção de suíte congelada** → parar. O único
  byte que muda em `tests_p50_core.js` é o hash de `PROTECTED["ui_v32.js"]`.

---

## 4 · Contratos e registros

- **Bridges:** nenhum novo, nenhum alterado. `bridges.json` **não é tocado**.
- **Patch-points:** **nenhum**. Não há monkey-patch, não há observador, não há API
  de registro nova — a demanda escreve dentro das funções que já emitem as quatro
  superfícies. O registro de patch-points desta demanda é, literalmente, **vazio**,
  e isso é desenho: as superfícies são alcançáveis de dentro do arquivo autorizado.
- **Ordem de injeção no builder:** irrelevante — nenhum módulo novo entra na
  cadeia. `build_v32_html.py` **não é editado**; só é **executado** (T015).
- **Pins que mudam:** `ui_v32.js` (conteúdo), `tests_p50_core.js` (repin inline),
  `quickscan_secops_soccmm_v3_2_dev.html` (rebuild), mais os artefatos novos e os
  registros — todos cobertos pela série de repins do `tasks.md`.
- **Registros que ganham entrada:** `expected_suites.json` (`d015`),
  `mutation_map.json` (harness `d015`), `mutation-matrix.json` (**13 pares** —
  12 do harness + `M16` manual — mais as dívidas declaradas),
  `.claude/project-memory/planning-state/015-superficies-de-apoio.json`
  (**hoje inexistente** — medido; sem ele o `red.commit` não tem onde morar e o
  `state-eval` lê a demanda como ausente).

### Checklist R9 — módulo novo

**Não se aplica: a demanda não cria módulo.** Item a item, para não passar por
omissão: IIFE — já existe (`:8`), nada fora dele · bridge — nenhum novo, nenhum
`window.__*` novo · CSS por prefixo — **zero CSS**, allowlist de exceções vazia ·
`innerHTML =` — nenhuma atribuição nova (os quatro sítios são literais dentro de
templates que já existem; a proibição da R9 §9 vale para módulo 5.x+, e este é
arquivo 3.x herdado) · orçamento de ~600 linhas — `ui_v32.js` tem **1.408** e a
demanda acrescenta **~6**: o excesso é **herdado e documentado**, não criado aqui,
e reduzi-lo exigiria fatiar arquivo protegido (fora de escopo e fora da
autorização) · helper único de invariante — nenhuma semântica de invariante nova.

---

## 5 · Fixtures, âncora e o contrato do assert

### 5.1 · Arquivo novo, e por quê

**`fixtures_015_apoio.js` (novo). `fixtures_010_vao.js` NÃO é emendado.** Ele
ancora censos (`d010AssertFixtureStates`: `titulosCongelados`, contagens de
`.v32-card`, de `.v32-decl-row`) que a 010 mediu por execução; emendá-lo obrigaria
a recalcular censo alheio e a reabrir asserção que já passa. Reuso por `require`
também é recusado: tornaria `fixtures_010_vao.js` alvo da campanha `d015` e
acoplaria duas demandas pelo arquivo mais frágil que existe — o que declara estado.

Os **sete estados** da spec (E1–E7) nascem no arquivo próprio. **E3 perdeu o papel
original** (era a contraprova de `D015-RES1(b)`, que caiu) e **permanece** como
estado da varredura E1–E7 de `D015-NOSUB1`/`D015-GOV1` — encolher a varredura
seria reduzir cobertura ratificada na Fase 1 para economizar uma fixture.

### 5.2 · O contrato do assert de fixture

O assert **não vigia o produto** — prova que a fixture **alcança o estado que
declara**. Linha divisória: ele só declara o que **esta demanda não escreve**.

**Proibido declarar no assert** (apodreceria no verde e abortaria os 5 gates antes
de qualquer alínea): o texto do eyebrow ou do `<h3>`; a existência do
`[data-pr-gap-fonte]`; a contagem de `li` ou o comprimento de `#pr-howto`.
**Permitido e exigido**: presença/ausência de `#v32prio` por estado; qids de gap
presentes em `#pr-findings`; visibilidade da Camada 1; presença de `#pr-target`
(e sua ausência legítima em E6); gate de suficiência fechado em E7.

Cada alínea que dependa de caso **declara ela mesma a pré-condição de
não-vacuidade e falha nomeando o estado** — é o que `C1(f)`, `C2(e)`, `C5(e)` e
`C6(c)` já exigem, e é a lição do `D010-INV7`/`EA-11`.

### 5.3 · A âncora imutável de `D015-NOSUB1`/`D015-GOV1`

**Forma já viva no repositório:** `p52BaselineRef()`/`baselineFile()`
(`tests_p52_chromium.js:1233-1265`) — `git cat-file -e <commit>^{commit}` para
separar "commit ausente" de "caminho ausente", `git show <commit>:<path>` para
tmp, conferência de **bytes** e **sha256** antes de usar. **Nunca `HEAD:`, nunca
branch** (R10 §5 — o `P52-PR1` morreu permanentemente vermelho por isso).

- **Objeto da âncora:** `quickscan_secops_soccmm_v3_2_dev.html` — o HTML
  construído, que é o que as suítes jsdom bootam.
- **Commit:** o **tip da branch imediatamente anterior à primeira edição de
  `ui_v32.js`** — na prática o commit red (T009), imutável e já contendo a Fase 3.
- **Custo medido em desenho:** 7 estados × 2 boots (âncora + HEAD) = **14 boots**
  de jsdom. Mitigação obrigatória: **bootar a âncora uma vez por estado e reusar**
  entre `D015-NOSUB1` e `D015-GOV1` — dois gates, um boot.

---

## 6 · Campanhas de mutação — a medição que a 011 cobrou

`ui_v32.js` é alvo declarado de **cinco** campanhas (`mutation_map.json`), e o
trigger de `check_mutation.py` é
`git diff --name-only <merge-base origin/develop> HEAD`:

| Campanha | `requires` | Mutantes | Fecha nesta máquina? |
|---|---|---|---|
| `core` | node, python | 3 (1 em `ui_v32.js`) | **Sim** |
| `d009` | node, python | 19 | **Sim** |
| `d010` | node, python | 24 | **Sim** |
| `d015` (nova) | node, python | 12 no harness (o 13º, `M16`, é worktree efêmera) | **Sim** |
| **`p51`** | **chromium** | **20** (10 em `ui_v32.js`) | **NÃO** |
| **`p52`** | **chromium** | **107** (13 em `ui_v32.js`) | **NÃO** |

**Medido hoje nesta worktree:** `env_doctor.py` responde
`[WARN] Chromium indisponível (sem CHROME_PATH e sem cache ms-playwright)`.
`check_mutation.py:1291-1303` transforma isso em
`[FAIL] p51/p52: campanha EXIGIDA (alvo mudou) mas ambiente sem chromium` —
**FAIL nomeado, nunca SKIP** (R10 §2).

**Consequência aceita, e ela é a forma do `tasks.md`:** a 011 conseguiu *evitar*
tocar arquivo que dispara campanha chromium; **esta demanda não consegue** — a
autorização nominal aponta exatamente para o arquivo que é alvo de `p51` e `p52`,
e os quatro sítios não existem em outro lugar. Não há rota alternativa a desenhar;
há um caminho de fechamento a **agendar**:

1. **Local**: `run.sh` com `MUTATION_DEFER_MISSING=1` → `[DEFER] p51/p52` nomeado
   e o resto do stage verde. Sem a variável, o FAIL é legítimo e **se declara**.
2. **CI**: o job `verify` já exporta `MUTATION_DEFER_MISSING: "1"`
   (`verify.yml:42`); o job `visual` roda `check_mutation.py` **com** Chromium
   (`:81`), depois de `p50chromium`/`p52chromium`.
3. **Gatilho**: o workflow dispara em `pull_request`/`push` para `develop`/`main`
   — **não** em push de `feature/*`. Logo o fechamento exige **abrir o PR**
   (livre, R14) ou `workflow_dispatch` com `visual: true`. É wave 4, com o número
   do run colhido e registrado.

**Também só fecham no CI** (regressão, não campanha): `p50chromium` (27 gates —
inclui a medição de `#pr-howto` no **PDF real**, `:3595-3597`) e `p52chromium`
(55 gates — inclui `P52-SUP3`).

**Resultado negativo que vale ouro, medido nos cinco harnesses:** nenhuma âncora
de mutante existente cai sobre os quatro sítios (busca por `pr-gapsup`,
`pr-howto`, `pr-sup-prio` e `prioridades declaradas` nos cinco arquivos:
**zero ocorrências**, exceto uma *descrição* em `tests_010_mutants.js:128`). As
edições **não apodrecem âncora nenhuma** — o `--preflight` de cada campanha deve
continuar reportando `ocorrências == 1` em todos os pares. Se não continuar, o
diff saiu do escopo: **parar**, jamais retranscrever âncora alheia.

---

## 7 · Janelas vermelhas — declaradas, com quem fecha

| # | Janela | Abre em | Fecha em | Quem fecha |
|---|---|---|---|---|
| **JV1** | `P50-GOV1` + `P50-IC4(a)` (`tests_p50_core.js:442` e `:2752`) — os dois leem o **mesmo** `PROTECTED["ui_v32.js"]`, logo **um repin inline fecha os dois** | commit de `ui_v32.js` (T011) | **repin inline** de `PROTECTED` (T013) | `build-engineer` — nunca o QA que valida o gate (R3 §2) |
| **JV2** | stage `build` (gerado ≠ construído dos fontes) | mesmo commit (T011) | **rebuild** (T015) | `build-engineer` |
| **JV3** | stage `baseline` (pin ≠ blob de HEAD) | cada commit de conteúdo | o `gen_pins.py` **seguinte** | `build-engineer` |
| **JV4** | stage `mutation` — `p51`/`p52` | commit de `ui_v32.js` | **job `visual` do CI** (T027) | `build-engineer` executa · `qa-engineer` registra |

JV1–JV3 duram **um commit cada** e vivem inteiras na wave 2. JV4 é estrutural
(KI-3): **agendamento por desenho, não pendência de execução**.

---

## 8 · Waves

| Wave | Conteúdo | Depende de |
|---|---|---|
| **0** | Repin da dívida das fases 2–3 · `npm ci` · planning-state · **errata da queda do C4** | portão da Fase 3 |
| **1** | Fixtures E1–E7 → suíte `tests_015_apoio.js` (5 gates) + registro em `expected_suites` → **prova de red commitada** | W0 (errata primeiro: o QA escreve 5 gates, não 6) |
| **2** | `ui_v32.js` (4 sítios) → repin inline de `PROTECTED` → rebuild | W1 (o gate viaja no prompt, R3 §3) |
| **3** | Verde medido → harness `d015` → campanha local → `M16` em worktree efêmera → matriz | W2 (rebuild feito: contagem antes dele não vale) |
| **4** | Contagem fixada por execução · pipeline completo · `spec-validate` · **CI visual** · relatório · **aceite de intenção** | W3 |

Regra de ouro entre W2 e W3, herdada da 011: **as suítes jsdom bootam o HTML
gerado, não os fontes.** Qualquer contagem medida antes do rebuild é inválida e
não pode ser registrada.

---

## 9 · Riscos e rollback

| Risco | Como se detecta | Resposta |
|---|---|---|
| Título novo contém `"Como a Fortinet pode apoiar"` | `tests_ui_m31.js` U2 vermelho | Redigir fora dessa oração — restrição no prompt do implementador (§2.2) |
| Título novo colide com outro título da seção | `tests_p52_layout.js:530-532` | idem |
| Nó de S3 sem ponto final | `P51-REC1` acusa FortiClient "sem escopo de endpoint" | Ponto final é cláusula do prompt |
| 7º item estoura 900 | `P51-DOC12` / gate de PDF | Folga medida: **315** crus; mutante `M10` prova o poder do gate |
| Item de S4 vira função da sessão | `P51-DOC12` compara `outerHTML` entre duas sessões | Literal constante; mutante `M8` |
| Repin inline com hash errado | `P50-GOV1` continua vermelho | Recalcular sobre o arquivo **em disco** normalizado LF (R2 §2) |
| Contagem medida antes do rebuild | Divergência `expected_suites` × execução | T017 só existe **depois** de T015 |
| Campanha `p51`/`p52` vermelha no CI | Job `visual` | **Diagnosticar causa antes de culpar o produto** (R2 §3) — 23 mutantes chromium tocam `ui_v32.js` |
| `P52-SUP3-cards.json` regravado com o título novo | stage `evidence-bridge` | O job `visual` já restaura `docs_phase5/`; risco nomeado ao `build-engineer` |
| `spec-validate` acusa `C4` "faltando" | Fase 6 | A **errata de T004** é a resposta — por isso ela é wave 0 |

**Rollback:** a demanda é aditiva e cabe em `git revert` de três commits de
conteúdo (produto, repin inline, rebuild) mais os repins correspondentes. Nenhum
dado de sessão, nenhum contrato, nenhum estado — nada a migrar de volta.

## 10 · Protótipo

**Nenhum.** Não sobrou pergunta que só código responda: as quatro incógnitas reais
— orçamento da caixa, substring proibida, unicidade do título e ambiente das
campanhas — foram **medidas por leitura e por ferramenta de diagnóstico** nesta
Fase 2, sem escrever uma linha de produto. Protótipo aqui seria cerimônia.
