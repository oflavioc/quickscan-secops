# Plano — 011-numeracao-das-prioridades

> Fase 2 · dono: tech-lead · consome a [spec.md](spec.md) aprovada. Não repete
> spec nem refinamento (R12): aqui só há decisão de desenho.
> **Produzido sob a delegação do proprietário de 2026-08-29** — decisão delegada,
> não ratificação nominal. Nenhum item deste plano consome autorização de
> boundary; onde uma rota exigiria ratificação, ela está recusada com o custo
> medido, e a rota escolhida é a que não exige.

## Desenho

**Rota A2 da spec, sem desvio.** A demanda nasce como **módulo novo da fase**, em
decoração pós-render — o caminho que a spec selada autoriza por escrito para esta
exata superfície (UI-004, `PHASE_5_0_REV_B.md:385-388`). `ui_ux_v32.js` e
`ui_ux_v32.css` permanecem **apenas lidos**.

| Artefato | Classe | Dono |
|---|---|---|
| `ui_d011_prioridade_v32.js` (**novo**, ≤ 600 linhas) | produto, não protegido | `ui-engineer` |
| `ui_d011_prioridade_v32.css` (**novo**) | produto, não protegido | `ui-engineer` |
| `build_v32_html.py` | pinado, **não** protegido (`pins.json:145`) | `build-engineer` |
| `quickscan_secops_soccmm_v3_2_dev.html` | `generated` — só via builder | `build-engineer` |
| `.claude/verify/{bridges,expected_suites,mutation_map,mutation-matrix}.json` · `check_lint_arch.py` | config de verificação, pinada | ver waves |
| `tests_011_prioridade.js` · `tests_011_chromium.js` · `tests_011_mutants.js` (**novos**) | suítes da demanda | `qa-engineer` |
| `.claude/verify/pins.json` | `registry` — só `gen_pins.py` | `build-engineer` |

**Nomenclatura.** Prefixo `d011` em arquivo, classe CSS (`.d011-*`), bridge
(`window.__D011`) e namespace de gate (`D011-*`) — um só radical para o
`lint-arch`, para o `grep` e para o auditor. **Não** se usa `p5x`: a fase 5.3 não
está aberta (`current_phase.json:12-16`) e batizar de 5.x um módulo de demanda
mentiria sobre a fase.

### Owner do estado (R9 §5)

**Nenhum dado novo. Nenhum estado novo.** A demanda é apresentação pura:

| Dado que o módulo consome | Owner canônico | Onde |
|---|---|---|
| ordem e identidade dos findings | Camada 1 (`frozen`) | `computeFindings()`, `:522-533` — ordena `sev` desc → `lvl` asc → `k` asc |
| seleção de prioridade | Camada 1 (`frozen`) | `businessPriority` / `togglePriority()`, `:708-713` |
| tela corrente | Camada 1 (`frozen`) | `step === PRIORITY_STEP`, `:471` / `:604` |
| limite de 9 atalhos | Camada 1 (`frozen`) | handler de teclado, `:1056-1060` |

O módulo **não escreve** em nenhum deles. Os únicos campos que ele possui são
contadores de diagnóstico do próprio módulo (`diag()`), que não são estado de
produto e não entram em sessão (INV-8 intocada).

### A fonte de decisão × a fonte de identidade (R9 §3 — a armadilha)

Esta é a restrição mais fácil de violar sem que nada quebre, e por isso é
**normativa** neste plano:

- **Decisão** — que glifo cada botão carrega, quais têm atalho, se há legenda —
  deriva **exclusivamente** de `computeFindings().findings`, de
  `businessPriority` e da constante `9`. É a mesma fonte que a Camada 1 usa em
  `:727-728` e que `uxPriority` usa em `ui_ux_v32.js:156`.
- **Identidade do nó** — qual botão é qual finding — usa `data-id`, a mesma chave
  que `uxPriority` usa em `ui_ux_v32.js:157` e que o `REV_B_REANCHOR_MAP` registra
  como âncora VERIFICADA (`tests_p50_core.js:429`).
- **Proibido**: ler `.key.textContent` (ou qualquer texto renderizado) como
  entrada de decisão; ler `.opt.sel` / `aria-pressed` para decidir o glifo;
  regex sobre DOM. **Ler o glifo para decidir sobre o glifo funcionaria** — e é
  exatamente o anti-pattern que a R9 §3 nomeia.
- **Exceção declarada, e só esta**: o módulo lê o valor atual do **próprio**
  marcador (`data-d011`) e o próprio nó de legenda **apenas para não reescrever
  o que já está correto** (write-if-different, ver idempotência). Isso é
  comparação, não decisão: o valor-alvo já foi calculado do canônico antes da
  leitura.
- **Decidir a tela por `step === PRIORITY_STEP`**, não por
  `document.body.dataset.uxscreen` (escrito por `ui_ux_v32.js:7`). A spec descreve
  a superfície pelo `dataset` porque é o observável do leitor; o **canal de
  decisão** é o global canônico. Gate pode asserir o `dataset`; o módulo não o lê.

### Tabela de decisão do glifo — a única regra do módulo

Para cada finding de índice `i` (0-based, ordem de `computeFindings`) e
`sel = businessPriority.has(f.id)`:

| Caso | `.key` (texto) | `data-d011` | `aria-keyshortcuts` | `aria-hidden` no `.key` |
|---|---|---|---|---|
| `i < 9`, não selecionado | `String(i+1)` — **inalterado pela Camada 1** | `"atalho"` | `String(i+1)` | `"true"` |
| `i < 9`, selecionado | `"✓"` — **inalterado** | `"estado"` | `String(i+1)` — **permanece** (C3) | `"true"` |
| `i ≥ 9`, não selecionado | `""` (o `·` de `:728` some) | `"mudo"` | **ausente** (remove se houver) | `"true"` |
| `i ≥ 9`, selecionado | `"✓"` — **inalterado** | `"estado"` | **ausente** | `"true"` |

**Medido, e importante**: `.opt .key{flex:0 0 26px; height:26px; …}`
(`quickscan_secops_soccmm_v3_1_3.html:68`) é caixa de **base fixa, independente do
conteúdo**. Esvaziar o `textContent` **não colapsa o alinhamento** — o módulo não
precisa de CSS de largura, e a preocupação de alinhamento de C2 está resolvida
pela regra congelada, não por regra nova.

**Consequência para quem escreve o gate de C2**: a asserção
`.key.textContent.trim() === ""` para os índices 9..14 vale **na fixture sem
seleção**. Selecionar um item de índice ≥ 9 é alcançável (o clique funciona sem
atalho) e nesse caso o `.key` legitimamente exibe `✓`. O gate não pode medir
"vazio" depois de selecionar um item mudo — mediria a tabela acima ao contrário.

### Legenda (C4)

- Nó próprio, `<p class="d011-legenda">`, criado pelo módulo, texto por
  **`textContent`** com a string canônica literal de C4. Zero `innerHTML =`.
- **Ponto de montagem**: primeiro filho de `.ux-priolayout`
  (`ui_ux_v32.js:160`), com `grid-column:1 / -1` na regra do próprio módulo —
  `.ux-priolayout` é `display:grid` (`ui_ux_v32.css:16-18`), então o nó ocupa uma
  faixa inteira acima da grade e da coluna-resumo, sem deslocar nenhum dos dois.
  Isso satisfaz "ancestral comum com a grade" sem entrar como célula da grade.
- **Existe se e somente se** `findings.length > 0`. Com `N = 0` o
  `.ux-priolayout` existe mas sem `.opt` (`ui_ux_v32.js:162` pula grupos vazios):
  o módulo remove a legenda, se houver, e não cria. **O caso negativo é
  alcançável** — todas as 15 respostas em nível 2 ou 3 dão `m.s === 0` e
  `computeFindings` devolve zero findings (`:522-533`); com `__DEV.showPriority()`
  a tela renderiza mesmo assim. A alínea de C4 tem caso, não nasce vácua.
- Se `.ux-priolayout` não existir, o módulo **não inventa ponto de montagem**:
  no-op, com o motivo em `diag()`.

### Cor da legenda e contraste (C10)

`color: var(--muted)` — token da Camada 1, consumido como token (não é seletor
alheio). Razões WCAG 2.x recalculadas pela mesma fórmula de `V322C_CONTRASTE`
(`tests_p52_chromium.js:6030-6052`):

| Superfície | Par | Razão |
|---|---|---|
| tela | `--muted #ADADB4` sobre `--surface #151517` | **8,17:1** |
| papel | `--muted #3d3d3d` sobre `--surface #fff` (`:205`) | **10,86:1** |

Fundo efetivo mais escuro (`--bg #0B0B0C`) só **aumenta** a razão. `--faint` daria
4,92:1 na tela — passa, mas sem folga; não é a escolha. **O juiz continua sendo
`D011-CON1` sobre as cores resolvidas**: os números acima são a referência de
projeto, não a evidência (Chromium está fora do agregado local, KI-3).

### Impressão (C11)

Regra `@media print` **no CSS do próprio módulo**, escopada aos nós que o próprio
módulo marcou — **zero seletor alheio**:

```css
@media print{
  .d011-key[data-d011="atalho"]{ visibility:hidden; }
  .d011-legenda{ display:none; }
}
```

- `visibility:hidden` e não `display:none`: preserva a calha de 26px, mantendo o
  alinhamento das linhas no papel — o mesmo motivo pelo qual C2 mantém o `.key` no
  DOM.
- O seletor **casa só com `data-d011="atalho"`**, que por construção exclui o
  selecionado (`"estado"`) e o mudo (`"mudo"`). É o que faz `D011-M10` (estender a
  regra ao `✓`/`.sel`) ser matável em vez de indistinguível.
- **Zero contato com o pipeline de print**: nada em `buildPrintReport`,
  `preparePrint`, `beforeprint`/`afterprint` (`:1069-1075`). A §29.6 não é
  disparada — a regra vive em arquivo novo e alcança só `.d011-*`.
- A segunda linha (esconder a legenda no papel) é **decisão deste plano** e
  **extrapola o texto literal de C11**: se o glifo some do papel, a frase que o
  explica perde referente e vira o mesmo ruído que a demanda existe para tirar.
  Está registrada em DEPENDÊNCIAS como item de errata de uma linha, para o gate
  `D011-PRT1` nascer com a redação certa.

## Registro de patch-points (R9 §4 — artefato deste plano)

### PP-011-1 · observador de mutação estreito sobre `#app` — **APROVADO**

| Campo | Registro |
|---|---|
| **Id** | `PP-011-1` |
| **Tipo** | Observação (`MutationObserver`). **Não** é monkey-patch: nenhum binding global é lido-e-reatribuído, nenhuma função alheia é substituída, nenhum evento é capturado ou cancelado |
| **Owner** | `ui_d011_prioridade_v32.js` (bridge `window.__D011`) |
| **Alvo** | `document.getElementById("app")`, `{childList:true, subtree:true}`. **`attributes:false`** — as escritas de atributo do próprio módulo não reentram |
| **Instalação** | Uma vez, na IIFE, sob guarda `__installed`. O bloco injetado roda **antes** do primeiro `render()` (âncora do builder em `:1092`, `render()` em `:1095`), e `#app` já existe no load |
| **Guardas** | (a) `busy` reentrante, no padrão de `ui_p52_workspace_v32.js:1700-1710`; (b) write-if-different, que leva o estado estável a **zero mutações** e fecha o laço; (c) `try/catch` por passada, com contador de erro em `diag()` — falha do módulo nunca derruba o render congelado |
| **O que NÃO faz** | não reordena, não cria botão, não move nó, não escreve estado canônico, não chama `render()`, não toca `window.__uxDecor` nem `__P50` |
| **Prova de que dispara** | **nenhum gate `D011-*` chama a decoração diretamente** — todos medem depois de um `render()` real. `window.__D011` expõe `__installed` e `diag()`, e **não** expõe `decorate()`, justamente para que não exista atalho que faça um gate passar com o observador morto |

**Disponibilidade provada, não suposta** (protótipo descartável, ver seção
própria): sob `jsdom` 30 / node 24, com o HTML publicado real, o observador
entrega **1 vez** por render da tela de prioridade, `#app` é **o mesmo nó** ao
longo de todos os renders, e **um** `await Promise.resolve()` basta para o
flush. Consequência de desenho para o QA: **a suíte `D011-*` é assíncrona** —
um tick de microtarefa entre `render()` e a medição. Custo declarado, não
descoberto na Fase 4.

### Rotas recusadas — com o custo medido

**PP-A · 5º wrapper do binding global `render`.** Precedentes reais:
`ui_ux_v32.js:5`, `ui_refinement_v32.js:46`, `ui_p50_shell_v32.js:262-269`
("AMB-1, aprovado pelo proprietário") e `ui_p52_workspace_v32.js:2553-2556`.
**Recusada por três razões, nesta ordem:**
1. **R9 §4 proíbe literalmente** monkey-patch de função global, e a R9 é
   *bloqueante para módulo NOVO*. Os quatro wrappers existentes são o estado
   herdado que o achado E12 documenta — são o custo que a regra existe para
   parar, não licença para o quinto.
2. O precedente que mais se parece com o nosso caso (AMB-1) foi **aprovado
   nominalmente pelo proprietário** e registrado no comentário do próprio módulo.
   Repetir a rota sob delegação seria consumir uma autorização que não foi dada.
3. Não é necessária: `PP-011-1` entrega o mesmo ponto de execução — depois de
   toda a cadeia congelada — com robustez **maior** a mudança de ordem de injeção.

**PP-C · estender a API de registro existente** (`__P50.registerScreenHook` dentro
de `p50AfterRender`, `ui_p50_shell_v32.js:271-291`). É a forma que a R9 §4
prescreve em abstrato, e é síncrona. **Recusada pelo custo medido**:
`ui_p50_shell_v32.js` é alvo declarado de **três** campanhas de mutação —
`p50`, `p51` e `p52` (`mutation_map.json`) — e **as três exigem `chromium`**.
Tocá-lo dispara, pelo trigger de path, três campanhas que não rodam nesta
worktree: a verificação da demanda passaria a depender do job visual do CI para
fechar. Some-se que a composição da 5.0 é medida por `P50-UX13`
(`tests_p50_core.js:777-975`, contadores de predecessor, ordem, reentrância) e
que o footprint aprovado da rota A2 na spec não inclui módulo de fase selada.
Custo desproporcional para um gancho de decoração.

**PP-D · captura de evento / delegação de clique.** Fora de cogitação: o
refinamento já a recusou por anular o congelado por fora, e ela não cobre os
renders que não vêm de clique (`__DEV.showPriority`, navegação por teclado,
`#ref-skip-all` → `tests_ref_m44.js:72-76`).

**PP-E · editar `ui_ux_v32.js`.** Não foi preciso. **A demanda NÃO para** — o
gancho não exige tocar arquivo protegido. Se `PP-011-1` fosse indisponível (não é:
está provado), esta seria a única rota restante e o plano pararia aqui, com o rito
nomeado: §29.4 + `P50-GOV1` (`tests_p50_core.js:159`, `:346`, `:396`) exigem
**autorização nominal do proprietário, por demanda**, e a autorização da 009 é
textualmente "exclusivamente no escopo da demanda 009" e nunca cobriu este arquivo.

## Contratos e registros

### Bridge (R9 §2)

Entrada nova em `.claude/verify/bridges.json`:

```json
"__D011": { "owner": "ui_d011_prioridade_v32.js",
            "nota": "decoração de atalhos da tela de prioridade (demanda 011): guarda de instalação e diagnóstico" }
```

Shape mínimo e fechado: `{ __installed: true, diag(): { decoracoes, reentranciasBloqueadas, erros, observadorInstalado, montagemAusente } }`.
**Sem `decorate()`, sem setter, sem estado de produto.** A spec previa "nenhum
bridge necessário"; este plano conclui o contrário e paga o preço declarado ali:
registro no mesmo PR. A razão é anti-vacuidade — sem `__installed` observável, a
guarda de instalação única de R9 §1 não é assegurável por gate.

### Injeção no builder — ordem declarada

JS: bloco novo **por último**, entre `V32_P52_WORKSPACE_END` e a âncora
(`build_v32_html.py:70`), com marcadores `V32_D011_BEGIN` / `V32_D011_END`.
CSS: **por último**, depois de `V32_P52CSS_END` (`:76`), com
`V32_D011CSS_BEGIN` / `V32_D011CSS_END`.

Por quê último em ambos: (i) o observador deve existir antes do primeiro
`render()` mas depois de toda a cadeia de wrappers, para nunca disputar ordem com
ela; (ii) no CSS, a última regra vence empate de especificidade — a regra de print
do módulo não precisa de `!important`, que é o que `ui_ux_v32.css` e a Camada 1
usam para esconder `.kbd-tip` (`:207`) e que este plano evita deliberadamente.
`check_markers.py` deriva os marcadores por varredura: cada um tem de aparecer
**exatamente 1×**, sem registro adicional.

### Cobertura do `lint-arch` — sem isto, C8 é vácuo

`check_lint_arch.py` aplica as regras de `innerHTML=` e IIFE ao glob
**`ui_p5*_v32.js`**. Um arquivo `ui_d011_*` **não casa** — C8 passaria por
ausência de alvo e **`D011-M7` (escrever a legenda com `innerHTML =`)
sobreviveria**. O plano exige, **antes da implementação**, estender o conjunto
para incluir `ui_d0*_v32.js` (módulos de demanda), preservando o glob 5.x. A
regra 4 (bridges) já varre `ui_*.js` e alcança o módulo novo sem mudança.

### Registros de suíte e de mutação

| Registro | Conteúdo | Momento |
|---|---|---|
| `expected_suites.json → suites.d011` | `node tests_011_prioridade.js` — no commit de criação da suíte (R10 §3), com `_trilha` declarando a janela vermelha; contagem **fixada por execução** na última wave (C9) | W2 e W6 |
| `expected_suites.json → visual.d011chromium` | `node tests_011_chromium.js`, `requires:["chromium"]` — `D011-CON1` fora do agregado local (KI-3) | W2 |
| `mutation_map.json → harnesses.d011` | `node tests_011_mutants.js`, `"preflight": true` (contrato C2 da 013 — declarado **no mesmo commit** em que o harness lê `--preflight` em `argv`), `requires:["node","python"]`, alvos = os dois arquivos do módulo + `build_v32_html.py` + a suíte + o harness | W5 |
| `mutation-matrix.json → pares` | um par por mutante, com `harness`, `gate` e `ultima_prova.resultado` — `check_tdd.py:47-52` exige os três | W5 |

**`D011-CON1` e `D011-PRT1` não moram em `tests_p52_chromium.js`** (R10 §1: gate de
uma fase/demanda não vive em arquivo de outra). Suíte Chromium própria; e a
contagem canônica de `p52chromium` (55/0) não muda por esta demanda.

### Pins (R8) — e a correção do precedente

Todo arquivo rastreado é pinado; as exclusões são `docs_phase5/**`,
`.claude/project-memory/**`, `*.zip` e o próprio `pins.json`. Portanto **os
commits de `planning-state` não pedem repin**, e todos os demais pedem.

**`gen_pins.py` lê os blobs de HEAD** — repin embutido no commit de conteúdo pina
o estado anterior. Logo: **um commit `chore` de repin imediatamente depois de cada
commit de conteúdo**. O `plan.md` da demanda 009 (`T020`: "`gen_pins.py` uma única
vez", wave 7) é **precedente errado neste ponto** e não é seguido aqui — copiá-lo
abre uma janela de `baseline` vermelho por meia demanda. Série prevista:

| Repin | Depois do commit de conteúdo | Motivo na mensagem |
|---|---|---|
| **R1** | `check_lint_arch.py` + `bridges.json` | cobertura do lint e registro do bridge |
| **R2** | suítes `D011-*` + `expected_suites.json` (red commitado) | suítes novas da demanda |
| **R3** | `ui_d011_prioridade_v32.js` + `.css` | módulo novo da demanda |
| **R4** | `build_v32_html.py` + HTML gerado | injeção e rebuild |
| **R5** | `tests_011_mutants.js` + `mutation_map.json` + `mutation-matrix.json` | campanha `d011` |
| **R6** | `expected_suites.json` (contagem medida) + relatório final | fechamento |

Mensagem no padrão `chore(011): gen_pins — R<n> da tabela de repins (<motivo>)`.
Wave de dois commits de conteúdo vira `R<n>a`/`R<n>b` — granularidade, não desvio.
**Desvio de verdade** (repin fora de R1–R6, p. ex. após merge de `develop`) vai
**registrado no relatório final**, nunca silenciado. Conferir a cada repin que
`declared.m41_payload_sha256` **não muda**; se mudar, **PARAR** (Porta B).

## Boundary

**Classe mais alta tocada: produto (não protegido)**, mais `generated` via builder
e `registry` via `gen_pins.py`. **Nada `frozen`. Nada da §29.4. Nenhum rito. O
plano NÃO para.**

As três fontes, cruzadas outra vez na Fase 2 (a spec já o fizera; repito porque a
escolha do patch-point poderia ter movido o resultado):

1. `boundary.json:9-14` — `frozen` = engine, Camada 1, harness M41, snapshot.
   Nenhum deles é tocado; a Camada 1 é **apenas lida** (`computeFindings`,
   `businessPriority`, `step`).
2. `PROTECTED` / `frozenSuites` em `tests_p50_core.js` — `ui_ux_v32.js:159` e
   `ui_ux_v32.css:346` seguem pinados byte a byte e **não entram no diff**;
   `tests_ux_m41.js` e `tests_ref_m44.js` seguem presentes e **não são editadas**.
   `ui_p50_shell_v32.js` **não** está em `PROTECTED` — poderia ser editado com
   repin —, e mesmo assim está fora do diff, pelo custo medido em PP-C.
3. `pins.json` — `build_v32_html.py` (`:145`) é **pinado e não protegido**:
   editá-lo é repin normal, não rito, e a §29.3 já foi conciliada com o regime de
   pins (`RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2).

**Superfícies visuais congeladas da §29.5**: a tela de prioridade não está na
lista nominal (negativo registrado na spec) — a decoração não colide com ela.

## Checklist R9 (módulo novo)

- [x] **IIFE + `__installed`** — guarda de instalação única, exposta em `__D011`;
      dupla injeção é inofensiva e observável.
- [x] **Um bridge registrado** — `__D011`, entrada nova em `bridges.json`, shape
      fechado (diagnóstico), sem estado de produto.
- [x] **CSS por prefixo** — **zero seletor alheio**. Tudo pende de classes que o
      próprio módulo aplica (`.d011-legenda`, `.d011-key`); `.ux-priolayout` é
      usado só como **ponto de montagem em JS**, nunca como seletor de regra.
      **A allowlist de exceções de R9 §6 fica vazia** — e é decisão de desenho, não
      acaso: marcar o nó antes de estilizá-lo custa uma linha e elimina a
      dependência de um seletor que pertence a `ui_ux_v32.css`.
- [x] **Zero `innerHTML =`** — `textContent` e `setAttribute`, e o `lint-arch`
      passa a cobrir o arquivo (ver "Cobertura do lint-arch").
- [x] **≤ 600 linhas** — estimativa 120–180; o orçamento não é pressionado.
- [x] **Helper único de invariante** — a tabela de decisão do glifo vive em **uma**
      função pura `estadoDoGlifo(i, sel) → {texto, marcador, atalho}`, chamada
      pelos três consumidores (texto, atributo, marcador de print). Nenhuma
      comparação literal a `9` ou a `"·"` duplicada fora dela.

**Idempotência (C5), como requisito de desenho e não observação de rodapé:**
1. **Proibida guarda global `__done`** — é literalmente o mutante `D011-M4`.
2. A legenda é reconstruída pelo padrão de `uxResultsDecor`
   (`ui_ux_v32.js:188`, "idempotente: refaz após edits"): localizar o próprio nó
   e **só** remover/criar quando o alvo diverge do que está lá.
3. Cada passada é **função pura do canônico**: mesma entrada → mesmo DOM. Duas
   passadas seguidas produzem **zero mutação** na segunda — é isso que fecha o
   laço do observador, e é isso que `D011-IDEM1` mede ao comparar as três
   propriedades antes e depois de um `click` num `.opt`.

## Waves

| Wave | Tarefas (resumo) | Dono | Tipo | Depende de |
|---|---|---|---|---|
| **W0** | `npm ci --no-audit` — sem `node_modules` **nenhuma suíte executa** e nenhum red é provável (esta worktree está sem) | `build-engineer` | `chore` | — |
| **W1** | Cobertura do `lint-arch` para `ui_d0*_v32.js`; entrada `__D011` em `bridges.json`. **Contrato e lint antes do consumidor** | `build-engineer` | `chore` | W0 |
| **W2** | `tests_011_prioridade.js` (`D011-KEY1` `KEY2` `ACC1` `LEG1` `IDEM1` `PRT1`) + `tests_011_chromium.js` (`D011-CON1`) + registro em `expected_suites.json` **no mesmo commit**; executar, **nomear o FAIL de cada gate**, commitar o vermelho, `red.status: proven` no planning-state | `qa-engineer` | `feature` (gates) + `chore` (prova de red) | W1 |
| **W3** | `ui_d011_prioridade_v32.js` + `ui_d011_prioridade_v32.css` — **uma só delegação**, mesmo módulo, mesmo dono. Gate no prompt (R3 §3) | `ui-engineer` | `feature` | W2 |
| **W4** | Injeção no `build_v32_html.py` (JS e CSS, marcadores) + rebuild do HTML gerado. **Pré-condição do verde**: as suítes bootam o HTML publicado, não os fontes | `build-engineer` | `chore` | W3 |
| **W5** | `tests_011_mutants.js` (`D011-M1`…`M10` + `M11`) com `--preflight` + harness `d011` em `mutation_map.json` **no mesmo commit** + pares em `mutation-matrix.json`; executar a campanha com árvore limpa | `qa-engineer` | `chore` | W4 |
| **W6** | Pipeline local completo + `spec-validate`; **fixar por execução** a contagem de `d011`; agendar no CI o job `visual` (`D011-CON1`); relatório final; aceite de intenção do PO | `qa-engineer` · `build-engineer` · `doc-writer` · `product-owner` | `chore` / `doc` | W5 |

Cada wave de conteúdo é seguida do seu commit de repin (R1–R6 acima).
`[P]` e ids `[TNNN]` permanentes são da Fase 3 (`tasks.md`).

**Por que esta ordem, e não outra**: o julgador nasce antes do julgado (W2 antes
de W3, R3); o lint que dá poder a C8 nasce antes do arquivo que ele julga (W1
antes de W3); o registro de bridge nasce antes do consumidor (W1 antes de W3); o
builder só pode injetar um arquivo que já existe (W3 antes de W4); os `find` dos
mutantes só podem ser escritos contra código que já existe (W4 antes de W5); a
última wave é sempre a validação.

**Um módulo por delegação**: nenhum arquivo tem dois donos em wave alguma.
`expected_suites.json` é tocado só pelo `qa-engineer` (W2 e W6);
`build_v32_html.py` e a configuração de verificação, só pelo `build-engineer`;
os dois arquivos do módulo, só pelo `ui-engineer`.

## Achado que a Fase 2 mediu e que muda o C6 — **UX14 é tautológico**

A spec pede, em C6, que `D011-M8` (alterar o mapeamento tecla→finding) **morra em
`UX14`** (`tests_ux_m41.js:127-134`), e trata isso como prova cruzada forte.
**`UX14` não pode reprovar.** A expressão de retorno é:

```js
return selected.length===1 && d.querySelector(".opt.sel .key") &&
       selected[0]===firstGlobal.sort((a,b)=>0)[0]===selected[0]
  ? selected[0]===Array.from(d.querySelectorAll(".opt")).map(x=>x.dataset.id)[0] || true
  : true;
```

`a === b === c` avalia como `(a === b) === c` — um **booleano** comparado a uma
**string**, sempre `false`. A condição do ternário é, portanto, sempre falsa, e o
ramo tomado é o literal `true`. O ramo alternativo termina em `|| true` e também
não pode ser falso. **Executado fora do repositório com quatro entradas**
(verde real; nada selecionado; tecla selecionou o item errado; dois selecionados),
o retorno foi `true` nas quatro.

Consequências, e nenhuma delas para a demanda:

1. **`D011-M8` precisa de outro carrasco.** O killer real é `D011-KEY1`, que
   afirma, para `N = 1..9`, que `keydown N` alterna **exatamente** o id previsto
   pelo oráculo recalculado do vetor da fixture. Um mutante do mapeamento morre
   ali, de verdade.
2. **A frase "UX14 tem de matar" sai da célula de C6 por errata** — item de fato,
   não de escopo: corrige uma afirmação sobre um gate existente, não enfraquece
   asserção nenhuma e não reabre critério ratificado.
3. **`tests_ux_m41.js` NÃO é editada nesta demanda.** É suíte de fase selada;
   consertar `UX14` mudaria o que a 4.1 afirma e está fora da delegação
   (é fortalecimento, mas de critério alheio). Vira **achado de backlog**, com a
   cadeia `tests_ux_m41.js:127-134 → condição sempre falsa → retorno constante
   true`, no mesmo lote e pelo mesmo dono (`doc-writer`) do achado da lista vazia
   (P9), depois que as demandas irmãs chegarem à `develop` — **id `EA-*` não é
   alocado aqui** (a série está em EA-7 nesta worktree e a 010 corre em branch que
   esta não enxerga; R12: números citados nunca renumeram).
4. **C6 continua verdadeiro no que importa**: `tests_ux_m41.js` e
   `tests_ref_m44.js` seguem nas contagens de `expected_suites.json` (56/0 e 28/0)
   e `UX8`–`UX13`, `UX15`, `R16` (`:72-76`) e `R35` (`:218-226`) continuam sendo a
   regressão que prova que o agrupamento, a renumeração de `Prioridade N`, o
   limite de 3 e a rota refinamento→prioridade não foram tocados.

**Mutante novo proposto — `D011-M11`: não instalar o observador** (remover a
chamada de `observe()`). Ele existe para provar que o patch-point é testado, e não
apenas o efeito. Como nenhum gate `D011-*` chama a decoração diretamente, `M11`
mata **todos** os gates de C2/C3/C4/C5 — é a contraprova de que a suíte não
depende de um atalho de teste. Entra na matriz por errata da tabela de mutantes
(item que **fortalece**, portanto cabe sob delegação).

## Riscos e rollback

| Risco | Como se detecta | Como se reverte / mitiga |
|---|---|---|
| Observador não entrega em algum ambiente (browser real, print) | `D011-IDEM1` e todos os gates de comportamento; `diag().decoracoes === 0` | **Provado sob jsdom 30/node 24**; `MutationObserver` é universal em navegador. Se falhasse, **PARADA** e escalada: as rotas restantes são PP-A (R9 §4) ou PP-E (§29.4), ambas com ratificação |
| Laço de mutação (o módulo redispara a si mesmo) | `diag().reentranciasBloqueadas` crescendo sem limite; `D011-IDEM1` | `busy` + `attributes:false` + write-if-different; estado estável produz zero mutação |
| Módulo escreve estado canônico por engano | `UX15` (`:135-140`), `UX11`, `R35`, e a suíte de sessão (INV-8) | O módulo só escreve `textContent`/atributo; nenhuma chamada a `togglePriority`, `businessPriority.*` ou `ans[]` |
| C8 verde por vácuo (lint não alcança `ui_d011_*`) | `D011-M7` sobrevive na campanha | W1 estende o glob **antes** de W3; se `M7` sobreviver, o lint não cobriu |
| Contraste reprova só no CI | `D011-CON1` no job visual | Margem de projeto grande (8,17:1 tela / 10,86:1 papel com `--muted`); reversão é trocar um token no CSS do módulo |
| Regressão congelada muda de contagem | stage `suites` (56/0 `ux41`, 28/0 `ref`, 64/0 `p50core`, 45/0 `p52layout`) | Contagem diferente = o diff saiu do escopo: parar e reabrir a análise |
| Repin pinando o estado anterior | stage `baseline` vermelho no ponto auditável | Série R1–R6, um repin **depois** de cada commit de conteúdo |

**Rollback**: a demanda inteira é aditiva. Reverter = remover os dois arquivos do
módulo, desfazer a injeção no builder, rebuild, e regenerar os pins. Nenhum
arquivo pré-existente muda de comportamento; nenhum arquivo protegido é tocado;
nenhuma migração de dado ocorre.

## Protótipo

**Pergunta que só código respondia**: o `MutationObserver` é um patch-point viável
aqui — ele entrega, sob `jsdom`, quando a tela de prioridade renderiza; `#app`
sobrevive aos renders; e quanto custa o flush num gate?

**Executado** (script descartável, fora da árvore do projeto, em diretório
temporário de sessão; **nada foi commitado e nada vira produção**), carregando o
HTML publicado real e as 15 respostas em nível 1:

| Aprendizado | Consequência no plano |
|---|---|
| `MutationObserver` existe e entrega: **0** entregas síncronas, **1** após o flush | O patch-point é viável; PP-A e PP-E deixam de ser necessários |
| **`await Promise.resolve()` basta** (não precisa de `setTimeout`) | A suíte `D011-*` é assíncrona por **um tick** — custo declarado na Fase 2, não descoberto na Fase 4 |
| `#app` é **o mesmo nó** depois de vários renders e de um toggle | Observar `#app` é estável; não é preciso observar `document.body` (mais largo e mais ruidoso) |
| A fixture de 15 respostas em nível 1 dá **15 findings**, glifos `1..9` + seis `·`, 5 grupos | Os casos de C1/C2 são alcançáveis com o mesmo `answerAll(w,1)` de `tests_ux_m41.js:11`; nível 2/3 zera os findings e alcança o caso negativo de C4 |
| O toggle por clique dispara **1** entrega nova | `D011-IDEM1` mede o caminho real de reconstrução |

Segundo protótipo, também descartável: a expressão de retorno de `UX14`
reproduzida fora do repositório, com quatro entradas — base do achado registrado
acima.
