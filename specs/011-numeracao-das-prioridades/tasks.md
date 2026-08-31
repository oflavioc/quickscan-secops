# Tarefas — 011-numeracao-das-prioridades

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Derivadas de [plan.md](plan.md) (camadas, patch-point, ordem e restrições já
> resolvidos lá) e julgadas pelos critérios de [spec.md](spec.md), com a errata da
> Fase 2 já aplicada. Nenhum conteúdo dos dois é repetido aqui (R12).
> Eu proponho; a execução das waves é do orquestrador (R5).
> Produzido sob a delegação do proprietário de 2026-08-29.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | `build-engineer` | chore | | **Repin R0 — dívida aberta, medida agora.** `python .claude/verify/check_baseline.py` responde hoje `264/264 pins conferem · 0 divergentes · 0 ausentes · **3 sem pin**`: `refinement.md`, `spec.md` e `plan.md` desta demanda entraram rastreados e nenhum commit de repin os seguiu. Com o commit da Fase 3 são **quatro**. Executar `gen_pins.py` **depois** de `tasks.md` commitado. Mensagem: `chore(011): gen_pins — R0 (artefatos das fases 0-3 sem pin)` | stage `baseline` |
| T002 | 0 | `build-engineer` | chore | | `npm ci --no-audit` na raiz da worktree. **Esta worktree está sem `node_modules`** — sem ele nenhuma suíte jsdom executa e nenhum red é provável. `node_modules/` está no `.gitignore`: a árvore permanece limpa, pré-condição de `check_mutation.py`. **Nenhum arquivo versionado muda → sem repin** | nenhum — habilita todos |
| T003 | 1 | `build-engineer` | chore | [P] | `.claude/verify/check_lint_arch.py` — estender o conjunto varrido pelas regras 2 e 3 (`innerHTML=` e IIFE) para incluir os módulos de demanda: hoje o glob é **só** `ui_p5*_v32.js`, e `ui_d011_*` **não casa**. Acrescentar `ui_d0*_v32.js` **sem** alargar para `ui_*_v32.js` — os módulos 4.x não são IIFE e são protegidos: um glob largo transformaria o stage em FAIL permanente. Regra 4 (bridges) já varre `ui_*.js` e não muda. **Por que é wave 1 e não acabamento**: sem esta linha o C8 passa **por ausência de alvo** e o mutante `D011-M7` (escrever a legenda com `innerHTML =`) sobrevive — o critério ficaria verde sem nunca ter podido reprovar. Não é polimento: é o que dá poder discriminante ao C8 | `C8` · stage `lint-arch` · habilita `D011-M7` |
| T004 | 1 | `build-engineer` | chore | [P] | `.claude/verify/bridges.json` — entrada `"__D011"` com `owner: "ui_d011_prioridade_v32.js"` e nota. Shape fechado e **sem `decorate()`**: `{ __installed, diag() }`. Contrato antes do consumidor (R5): sem esta entrada o `lint-arch` reprova o módulo assim que ele existir | `C8` · stage `lint-arch` |
| T005 | 1 | `build-engineer` | chore | | **Repin R1** — depois de T003+T004 commitados. Mensagem: `chore(011): gen_pins — R1 da tabela de repins (cobertura do lint e registro do bridge)` | stage `baseline` |
| T006 | 2 | `qa-engineer` | feature | | `tests_011_prioridade.js` (**novo**) — `D011-KEY1` `KEY2` `ACC1` `LEG1` `IDEM1` `PRT1`, namespace exclusivo `D011-*`. **Suíte assíncrona por desenho**: o patch-point é um `MutationObserver` e a entrega é de microtarefa — `render()` → `await Promise.resolve()` → medir (medido na Fase 2: 0 entregas síncronas, 1 após o flush). **Nenhum gate chama a decoração à mão** — `__D011` não expõe `decorate()` de propósito; medir sem passar por um `render()` real destruiria o poder de `D011-M11`. O oráculo de C1 recalcula a ordem **do vetor da fixture** (sev desc → lvl asc → k asc), sem chamar `computeFindings()`. Última linha no formato `N PASS · M FAIL` (regex de `check_suites.py`) | `C1` `C2` `C3` `C4` `C5` `C11` |
| T007 | 2 | `qa-engineer` | feature | [P] | `tests_011_chromium.js` (**novo**) — `D011-CON1`: razão WCAG recalculada sobre as cores resolvidas, no padrão de `V322C_CONTRASTE` (`tests_p52_chromium.js:6030-6072`), medida na tela de prioridade. **Não** entra em `tests_p52_chromium.js`: gate de uma demanda não vive em arquivo de outra fase (R10 §1), e a contagem de `p52chromium` (55/0) não pode mudar por esta demanda | `C10` |
| T008 | 2 | `qa-engineer` | chore | | `.claude/verify/expected_suites.json` — chaves `d011` (bloco `suites`) e `d011chromium` (bloco `visual`, `requires:["chromium"]`). **No MESMO commit de T006/T007**: `check_suites.py` reprova qualquer `tests_*.js` fora do registro. A contagem entra **declarada**, com `_trilha` nomeando a janela vermelha e por que ela não é rebaixada (R10 §1) — a fixação **por execução** é T024 | `C9` · stage `suites` |
| T009 | 2 | `qa-engineer` | chore | | **Prova de red.** Executar as suítes, **nomear o FAIL de cada gate** e commitar o vermelho; registrar `red.status: proven`, `red.commit` e `red.gates` no planning-state (`check_tdd.py` confere que o commit existe). Declarar, sem omitir: **`D011-KEY1` nasce VERDE** (critério de preservação — a dívida está na spec) e **`D011-CON1` NÃO EXECUTADO por ausência de Chromium** (R10 §2: não executado se declara, nunca se pula em silêncio). `.claude/project-memory/**` é excluído do registry → **commit de planning-state não pede repin** | stage `tdd` |
| T010 | 2 | `build-engineer` | chore | | **Repin R2** — depois do commit red. Mensagem: `chore(011): gen_pins — R2 da tabela de repins (suítes D011-* e registro de contagens)` | stage `baseline` |
| T011 | 3 | `ui-engineer` | feature | | `ui_d011_prioridade_v32.js` (**novo**). O gate viaja no prompt: critérios em `specs/011-numeracao-das-prioridades/spec.md`, desenho em `specs/011-numeracao-das-prioridades/plan.md` (§Desenho, §Registro de patch-points, §Checklist R9) — **nunca implementação inline**. Restrições não negociáveis: IIFE + `__installed`; `MutationObserver` sobre `#app` com `childList+subtree` e **`attributes:false`**, guarda `busy` e **write-if-different** (estado estável = zero mutação, é o que fecha o laço); decisão derivada **só** de `computeFindings()`, `businessPriority` e `step === PRIORITY_STEP` — **proibido ler `.key.textContent`, `.sel` ou `aria-pressed` como canal de decisão** (R9 §3); identidade do nó por `data-id`; **marcar cada `.key` decorado com a classe própria `d011-key`** e o estado em `data-d011` (`atalho`/`estado`/`mudo`), que é o que permite a regra de print de C11 ser escrita **contra seletor do próprio módulo**; uma função pura `estadoDoGlifo(i, sel)` como helper único; zero `innerHTML =`; nenhum `render()`, nenhuma escrita em estado canônico | `D011-KEY2` `ACC1` `LEG1` `IDEM1` · preserva `KEY1` |
| T012 | 3 | `ui-engineer` | feature | | `ui_d011_prioridade_v32.css` (**novo**). **Zero seletor alheio** — a allowlist de R9 §6 fica vazia por desenho: tudo pende de `.d011-legenda` e `.d011-key`, classes que o próprio módulo aplica. Regra de print com **duas cláusulas indivisíveis** (errata da spec): `.d011-key[data-d011="atalho"]{visibility:hidden}` — `visibility`, não `display`, porque `.opt .key{flex:0 0 26px}` (`quickscan_...v3_1_3.html:68`) é caixa de base fixa e a calha preserva o alinhamento no papel — **e** `.d011-legenda{display:none}`. Cor da legenda `var(--muted)`: 8,17:1 na tela e 10,86:1 no papel, calculados na Fase 2; o juiz é `D011-CON1`. Sem `!important`; o bloco é injetado por último e vence empate por cascata | `D011-PRT1` (duas cláusulas) · `D011-CON1` |
| T013 | 3 | `build-engineer` | chore | | **Repin R3** — depois de T011+T012. Mensagem: `chore(011): gen_pins — R3 da tabela de repins (módulo novo da demanda)` | stage `baseline` |
| T014 | 4 | `build-engineer` | chore | | `build_v32_html.py` — injetar o módulo **por último** nas duas cadeias: JS entre `V32_P52_WORKSPACE_END` e a âncora (`:70`), CSS depois de `V32_P52CSS_END` (`:76`). Marcadores `V32_D011_BEGIN/END` e `V32_D011CSS_BEGIN/END`, **exatamente 1× cada** (`check_markers.py` varre por regex, sem registro adicional). Arquivo **pinado e não protegido** (`pins.json:145`): repin normal, nunca rito | stage `marker-lint` · stage `build` |
| T015 | 4 | `build-engineer` | chore | | `python build_v32_html.py` — rebuild de `quickscan_secops_soccmm_v3_2_dev.html` (classe `generated`, **nunca editado à mão**). **Pré-condição do verde, não acabamento**: as suítes jsdom bootam o HTML gerado, não os módulos-fonte — **contagem medida antes do rebuild não vale** e não pode ser registrada | stage `build` |
| T016 | 4 | `build-engineer` | chore | | **Repin R4** — depois de T014+T015. Mensagem: `chore(011): gen_pins — R4 da tabela de repins (injeção no builder e rebuild do gerado)` | stage `baseline` |
| T017 | 5 | `qa-engineer` | chore | | **Verificação de verde, antes de escrever mutante.** Executar `tests_011_prioridade.js` e a regressão congelada, nomeando as contagens: `ux41` 56/0, `ref` 28/0, `p50core` 64/0, `p52layout` 45/0. Contagem congelada diferente = o diff saiu do escopo: **parar e reabrir a análise**, não ajustar o registro. **Nenhum arquivo tocado → sem commit e sem repin** | `C6` `C7` · stage `suites` |
| T018 | 5 | `qa-engineer` | chore | | `tests_011_mutants.js` (**novo**) — **10 mutantes** no harness `d011`: `M1` `M2` `M3` `M4` `M5` `M7` `M8` `M10` `M11` `M12` (o `M6` é T021 e o `M9` é T030 — ver "Onde cada campanha fecha"). Shape copiado de `tests_009_mutants.js` (cópia de shape, nunca extração de runner comum): âncora textual que casa **exatamente 1×**, mutação in-place → **rebuild** → gate correspondente **filtrado** → exige FAIL **com motivo compatível** (detecção incidental não conta como kill) → restauração byte a byte provada por SHA-256, do fonte **e** do HTML. Interpretador por fonte única (`MUTATION_PY` ou padrão da plataforma) e caminhos **entre aspas** (R10 §7). Modo `--preflight` em `argv` emitindo **um** objeto JSON em stdout com as chaves de C1 — `harness`, `arquivo`, `interpretador`, `arquivos_mutados`, `mutantes` — sem mutar, sem reconstruir e sem escrever nada | R3 §5 |
| T019 | 5 | `qa-engineer` | chore | | `.claude/verify/mutation_map.json` — harness `d011`: `cmd: "node tests_011_mutants.js"`, `"preflight": true` **no MESMO commit de T018** (a guarda de fonte do julgador recusa a chave sem o modo), `requires: ["node","python"]` — **sem Chromium**, porque nenhum gate de `tests_011_prioridade.js` mede geometria. Alvos: os dois arquivos do módulo, `build_v32_html.py`, `tests_011_prioridade.js` e o próprio harness (a suíte é o **oráculo** da campanha — mexer nela muda o que a campanha prova; precedente do `d009`) | stage `mutation` |
| T020 | 5 | `qa-engineer` | chore | | Executar a campanha `d011` com **árvore limpa** (`check_mutation.py` exige) e registrar o resultado por mutante. `d011` é **node+python e roda LOCAL** — não é deferida. Se não rodar, é falha, não adiamento | stage `mutation` |
| T021 | 5 | `qa-engineer` | chore | | **`D011-M6` em worktree efêmera — nunca no harness, nunca na árvore da demanda.** O mutante edita um byte de `ui_ux_v32.js`, que é **protegido** (§29.4, `tests_p50_core.js:159`). `git worktree add` → mutar → provar que `P50-GOV1` e o stage `baseline` reprovam → `git worktree remove`. **Foi exatamente aqui que a 009 deixou um mutante aplicado em arquivo protegido**; o harness automatizado não pode tocar `PROTECTED`. Precedente de forma na matriz: `harness: "manual (worktree efêmera)"` | `C7` · `P50-GOV1` · stage `baseline` |
| T022 | 5 | `qa-engineer` | chore | | `.claude/verify/mutation-matrix.json` — **um par por mutante** (12), cada um com `harness`, `gate` e `ultima_prova.resultado`, que `check_tdd.py` exige. Campanha nova nasce **expandida, nunca agregada** (contrato C3 da 013). `D011-M9` entra **declarado como deferido ao job `visual`**, com o motivo escrito — nunca par vazio nem omissão | stage `tdd` · stage `mutation` |
| T023 | 5 | `build-engineer` | chore | | **Repin R5** — depois de T018+T019+T022. Mensagem: `chore(011): gen_pins — R5 da tabela de repins (campanha d011 e matriz gate-mutante)` | stage `baseline` |
| T024 | 6 | `qa-engineer` | chore | | `.claude/verify/expected_suites.json` — **fixar por execução** a contagem de `d011`, com o rebuild de T015 já commitado. A contagem deixa de ser o total declarado pela spec e passa a ser **medida** (C9). Manter no `_trilha` o histórico da janela vermelha, sem reescrevê-lo | `C9` · stage `suites` |
| T025 | 6 | `build-engineer` | chore | | **Repin R6a** — depois de T024. Mensagem: `chore(011): gen_pins — R6a da tabela de repins (contagem de d011 fixada por execução)` | stage `baseline` |
| T026 | 6 | `qa-engineer` | chore | [P] | Pipeline completo local (`bash .claude/verify/run.sh`): `env-doctor`, `baseline`, `boundary`, `marker-lint`, `icons-check`, `build`, `lint-arch`, `state`, `tdd`, `m41`, `suites`, `suites-heavy`, `evidence-bridge`, `mutation`. Conferir que `declared.m41_payload_sha256` **não mudou** — se mudou, **PARAR** (Porta B, não autorizada). Depois, `spec-validate`. **Nenhum arquivo tocado** | todos os stages locais |
| T027 | 6 | `doc-writer` | doc | [P] | `specs/011-numeracao-das-prioridades/relatorio-final.md` — pelo template. Registrar nominalmente: o patch-point escolhido e as três rotas recusadas com o custo; a série de repins **executada**, incluindo o R0 de dívida e **qualquer repin fora de R0–R6c** (desvio se registra, nunca se silencia); o que ficou deferido ao CI, com o número do run; e que a demanda correu **sob delegação**, não sob ratificação nominal | — |
| T028 | 6 | `doc-writer` | doc | [P] | `.claude/BACKLOG.md` — dois achados desta jornada, com a cadeia `arquivo:linha→efeito`: (a) **`UX14` constante** (`tests_ux_m41.js:127-134`, duas razões independentes + código morto em `:131`); (b) **lista vazia na tela de prioridade** (P9 do portão). **Id `EA-*` NÃO é alocado aqui** — a série está em EA-7 nesta worktree e a 010 corre em branch paralela que esta não enxerga (R12: números citados nunca renumeram). **Tarefa deferida**: executa depois que as demandas irmãs chegarem à `develop` | — |
| T029 | 6 | `build-engineer` | chore | | **Repin R6b** — depois de T027 (+T028, se já executada). Mensagem: `chore(011): gen_pins — R6b da tabela de repins (relatório final e backlog)` | stage `baseline` |
| T030 | 6 | `build-engineer` | chore | | Job `visual` do CI: suíte `d011chromium` (**`D011-CON1`**) e o mutante **`D011-M9`** (cor calculada para ~3,9:1 sobre o fundo resolvido — por medição, nunca por palpite de paleta). Não há Chromium nesta worktree: é **agendamento por desenho (KI-3), não pendência de execução**. Colher o resultado e devolvê-lo ao `qa-engineer` | `C10` · job `visual` |
| T031 | 6 | `qa-engineer` | chore | | `.claude/verify/mutation-matrix.json` — registrar o retorno de T030 nos pares de `D011-CON1`/`D011-M9`. **Dono único do arquivo em todas as waves é o `qa-engineer`**; o `build-engineer` executa o job e reporta, não escreve na matriz | stage `tdd` |
| T032 | 6 | `build-engineer` | chore | | **Repin R6c — condicional**: só existe se T031 alterar a matriz. Mensagem: `chore(011): gen_pins — R6c da tabela de repins (retorno do job visual)` | stage `baseline` |
| T033 | 6 | `product-owner` | chore | | Aceite de intenção. Conferir o eixo da demanda (o glifo lê como atalho, não como índice) e os quatro itens que a spec declarou **não mensuráveis** — a percepção residual, o accname computado, o efeito real da regra de print no PDF e a leitura por leitor de tela — que se resolvem no rito visual do proprietário, não por asserção disfarçada | aceite |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

**Contagem por wave**: W0 = 2 · W1 = 3 · W2 = 5 · W3 = 3 · W4 = 3 · W5 = 7 · W6 = 10
— **33 tarefas**.

## Tipagem — as escolhas que não são óbvias

- **T006/T007 são `feature`** porque carregam o tipo da demanda e são as tarefas que
  **produzem** o red; o red delas é o commit de T009. Não é auto-referência: quem
  escreve o gate e quem prova o vermelho são passos distintos, e o autor do gate
  nunca é o implementador (R3 §2).
- **T011/T012 são `feature`** e recebem o gate pronto no prompt (R3 §3). São as
  únicas duas tarefas de produto da demanda.
- **T018 é `chore`, não `feature`.** Campanha de mutação é instrumento de
  verificação, não comportamento de produto: sua prova não é um red, é o **KILL**
  registrado em T020/T022. Tipá-la `feature` exigiria um `red.commit` que não existe
  semanticamente para ela.
- **T003 é `chore`** apesar de ser pré-condição de um critério: estende a cobertura
  de um lint existente, não cria comportamento. O que ela habilita (`D011-M7`) é que
  é medido — e por isso ela é wave 1, não wave 6.
- **Nenhuma tarefa é `fix`.** Esta demanda é aditiva: nenhum arquivo pré-existente
  muda de comportamento. O único defeito encontrado (`UX14`) é **registrado**, não
  corrigido — corrigir suíte congelada de outra fase está fora da delegação.
- **Nenhum `tdd_waiver` é previsto.** Waiver aqui seria sinal de tipagem errada, e a
  conversa acontece sobre o dado (R3, válvula 2).

## Um arquivo, um dono — as atribuições, e por que estas

| Arquivo | Dono único | Waves |
|---|---|---|
| `ui_d011_prioridade_v32.js` · `ui_d011_prioridade_v32.css` | `ui-engineer` | 3 |
| `build_v32_html.py` · `quickscan_secops_soccmm_v3_2_dev.html` | `build-engineer` | 4 |
| `check_lint_arch.py` · `bridges.json` | `build-engineer` | 1 |
| `tests_011_*.js` · `expected_suites.json` · `mutation_map.json` · `mutation-matrix.json` | `qa-engineer` | 2, 5, 6 |
| `.claude/verify/pins.json` | `build-engineer` (só via `gen_pins.py`) | todas |
| `relatorio-final.md` · `.claude/BACKLOG.md` | `doc-writer` | 6 |

Nenhum arquivo tem dois donos em wave alguma. O caso que exigiu decisão é a
**matriz de mutantes**: o `build-engineer` roda o job do CI (T030), mas quem
**escreve** o resultado é o `qa-engineer` (T031) — o arquivo tem um dono só, em
todas as waves. `check_baseline.py` reprova arquivo rastreado sem pin, então
`gen_pins.py` é do `build-engineer` sempre, e de mais ninguém.

## Série de repins — a regra, no `tasks.md` e não só no plano

`gen_pins.py` calcula os hashes com `git show HEAD:<path>`. **Rodá-lo antes de
commitar pina o conteúdo antigo.** Logo, repin **nunca** viaja dentro do commit que
altera o arquivo: é sempre um commit `chore` **imediatamente posterior**, um por
commit de conteúdo. "No mesmo PR" (R8 §1) **não** é "no mesmo commit".

| Repin | Tarefa | Depois do commit de conteúdo |
|---|---|---|
| **R0** | T001 | `tasks.md` — fecha a dívida de `refinement.md` + `spec.md` + `plan.md` |
| **R1** | T005 | `check_lint_arch.py` + `bridges.json` |
| **R2** | T010 | suítes `D011-*` + `expected_suites.json` (commit red) |
| **R3** | T013 | `ui_d011_prioridade_v32.js` + `.css` |
| **R4** | T016 | `build_v32_html.py` + HTML gerado |
| **R5** | T023 | `tests_011_mutants.js` + `mutation_map.json` + `mutation-matrix.json` |
| **R6a** | T025 | `expected_suites.json` com a contagem medida |
| **R6b** | T029 | relatório final (+ backlog) |
| **R6c** | T032 | retorno do job `visual` na matriz — **condicional** |

Wave que fechar em dois commits de conteúdo vira `R<n>a`/`R<n>b`: é granularidade,
não desvio. **Desvio de verdade** — repin fora desta tabela, como o que um merge de
`develop` exige — vai **registrado no relatório final** (T027), nunca silenciado.
`.claude/project-memory/**`, `docs_phase5/**` e `*.zip` estão fora do registry:
commit de `planning-state` **não** pede repin. Conferir a cada repin que
`declared.m41_payload_sha256` não mudou.

## Matriz gate↔mutante prevista (T022)

| Mutante | O que faz | Carrasco | Onde roda |
|---|---|---|---|
| `D011-M1` | restaura o `·` nos itens sem atalho | `D011-KEY2` | `d011` (local) |
| `D011-M2` | renumera o glifo pela posição visual pós-agrupamento | `D011-KEY1` | `d011` (local) |
| `D011-M3` | remove `aria-keyshortcuts` do selecionado (ou aplica a todos) | `D011-ACC1` | `d011` (local) |
| `D011-M4` | guarda global `__done` (aplica uma vez só) | `D011-IDEM1` | `d011` (local) |
| `D011-M5` | legenda ausente; e variante que afirma ordem no texto | `D011-LEG1` | `d011` (local) |
| `D011-M6` | edita um byte de `ui_ux_v32.js` sem repin | `P50-GOV1` + stage `baseline` | **worktree efêmera** (T021) |
| `D011-M7` | escreve a legenda com `innerHTML =` | stage `lint-arch` | `d011` (local) |
| `D011-M8` | altera o mapeamento tecla→finding | **`D011-KEY1`** (único; **não** o `UX14`) | `d011` (local) |
| `D011-M9` | cor calculada para ~3,9:1 sobre o fundo resolvido | `D011-CON1` | **job `visual` do CI** (T030) |
| `D011-M10` | estende a regra de print ao `✓`/`.sel` | `D011-PRT1` (1ª cláusula) | `d011` (local) |
| `D011-M11` | **não instala o observador** | `D011-IDEM1` (primário) — e derruba `KEY2`/`ACC1`/`LEG1` | `d011` (local) |
| `D011-M12` | remove a cláusula da legenda do `@media print` | `D011-PRT1` (2ª cláusula) | `d011` (local) |

`D011-M11` é a contraprova de que a suíte não tem atalho: como nenhum gate chama a
decoração à mão, remover o observador derruba tudo o que é comportamento. Se ele
sobreviver, existe um caminho de teste que não passa pelo patch-point — e o defeito
está na suíte, não no módulo.

## Onde cada campanha fecha — para ninguém marcar como pendente o que é deferido

- **Campanha `d011` (10 mutantes)**: `requires: [node, python]`, **roda local** no
  stage `mutation`. Nada nela é deferido.
- **`D011-M6`**: **worktree efêmera**, manual, na wave 5. Fecha local.
- **`D011-CON1` e `D011-M9`**: exigem Chromium → **job `visual` do CI e rito do
  proprietário**. É KI-3, registrado em `design-decisions.md`: **desenho, não
  lacuna**. O relatório final os declara como deferidos **com o número do run**,
  nunca como "pendente".
- **Campanhas `p50`/`p51`/`p52`**: **não são disparadas** por esta demanda — nenhum
  dos alvos delas entra no diff. Foi essa a razão medida para recusar o patch-point
  que editaria `ui_p50_shell_v32.js` (ver `plan.md`, seção "Rotas recusadas").

## Decisões pendentes

1. **T028 é deferida por dependência externa.** A alocação do id `EA-*` para os dois
   achados espera as demandas irmãs chegarem à `develop`; até lá a série não é
   observável desta worktree. Se o orquestrador preferir, T028 sai desta demanda e
   vira tarefa da consolidação — o que **não** pode é alocar um número aqui.
2. **`R6c` é condicional** e só nasce se o retorno do CI alterar a matriz. Se o job
   `visual` não fechar dentro da janela da demanda, o `product-owner` decide em T033
   se aceita com `D011-CON1` deferido e registrado, ou se segura o aceite.
3. **A ordem interna de W6 depende de T026.** Se o `spec-validate` pedir iteração, o
   relatório (T027) é reescrito e o `R6b` desloca — foi assim na 008, onde o
   `spec-validate` obrigou uma terceira execução de `gen_pins.py` não prevista. É
   desvio previsível: registrar, não esconder.
4. **A varredura de gates constantes não é desta demanda.** O `UX14` é o terceiro
   caso seguido (EA-7 → E17 da 010 → `UX14`), e a spec já recomenda demanda própria.
   Aqui ele só é registrado.
