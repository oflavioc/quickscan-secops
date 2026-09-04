# Tarefas — 015-superficies-de-apoio

> Fase 3 · dono: tech-lead · ids `[TNNN]` são permanentes; a última wave é sempre
> validação. Derivadas de [plan.md](plan.md) (sítios, restrições medidas, janelas
> vermelhas e boundary já resolvidos lá) e julgadas pelos critérios de
> [spec.md](spec.md), **com a queda do C4 já aplicada**. Nenhum conteúdo dos dois
> é repetido aqui (R12). Eu proponho; a execução das waves é do orquestrador (R5).
> Produzido sob a delegação do proprietário de 2026-08-29, com autorização
> nominal §29.4 de 2026-08-31 para `ui_v32.js`.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | `build-engineer` | chore | | **Repin R2** — a série começa aqui (R0 refinamento e R1 spec já saíram: `92e3692` e `a5ab9d6`). Executar `python .claude/verify/check_baseline.py` **antes**, para medir a dívida em vez de supor que é zero, e `gen_pins.py` **depois** do commit de `tasks.md`. Cobre `plan.md` + `tasks.md`; se o portão da Fase 2 já tiver repinado o `plan.md`, cobre só o `tasks.md` e **continua sendo R2**. Mensagem: `chore(015): gen_pins — R2 da serie (artefatos das fases 2 e 3)` | stage `baseline` |
| T002 | 0 | `build-engineer` | chore | [P] | `npm ci --no-audit` na raiz desta worktree. **Medido: `node_modules/` não existe aqui** — é por isso que `run.sh --light` fecha 10 PASS (pula `suites`/`mutation`, ambos `heavy`) e nenhuma suíte jsdom rodaria. `node_modules/` é ignorado pelo git: a árvore continua limpa, pré-condição de `check_mutation.py`. **Nenhum arquivo versionado muda → sem repin** | nenhum — habilita todos |
| T003 | 0 | `build-engineer` | chore | [P] | `.claude/project-memory/planning-state/015-superficies-de-apoio.json` — **medido: não existe**. Criar pelo schema (`.claude/templates/planning-state.schema.json`), `phase: tasks`, registrando a **autorização nominal de 2026-08-31** e que a demanda corre **sob delegação**, não sob ratificação pessoal. Sem ele o `red.commit` de T009 não tem onde morar (`check_tdd.py:29-35`) e o `state-eval` lê a demanda como inexistente. `.claude/project-memory/**` está fora do registry → **sem repin** | stage `state` · stage `tdd` |
| T004 | 0 | `product-owner` | doc | | **Errata na `spec.md`: a queda do C4.** Bloco próprio de errata (data, quem decidiu, as três razões) **e emenda da célula do critério** — `C4`/`D015-RES1` marcados como **retirados**, `M11`/`M12`/`M13` **aposentados** (ids nunca reutilizados), a linha da tabela de tautologia riscada com a razão, e a §Superfície 5 remetendo à cláusula que a própria spec escreveu. **Nenhuma ratificação anterior é reescrita** (o sufixo e o "nada é removido" continuam como foram ratificados). **É wave 0 e não acabamento**: o `spec-validate` da Fase 6 classificaria `C4` como "faltando", a classe mais cara — e o `qa-engineer` precisa escrever **5** gates, não 6 | Fase 6 · `spec-validate` |
| T005 | 0 | `build-engineer` | chore | | **Repin R3** — depois do commit de T004. Mensagem: `chore(015): gen_pins — R3 da serie (errata da spec: queda do C4)` | stage `baseline` |
| T006 | 1 | `qa-engineer` | feature | | `fixtures_015_apoio.js` (**novo**) — os sete estados `E1`…`E7` da spec e o `d015AssertFixtureStates`. **Arquivo próprio: `fixtures_010_vao.js` NÃO é emendado nem importado** (plan.md §5.1). O assert obedece ao contrato de plan.md §5.2 — declara **só** o que esta demanda não escreve (presença de `#v32prio`, qids de gap, visibilidade da Camada 1, `#pr-target` e sua ausência legítima em E6, gate fechado em E7) e **nunca** o eyebrow, o `[data-pr-gap-fonte]` ou a contagem/comprimento de `#pr-howto`. Fixture não casa com `tests_*.js` → não entra em registro nenhum (`check_suites.py:53`) | pré-condição de todos os `D015-*` |
| T007 | 1 | `qa-engineer` | feature | | `tests_015_apoio.js` (**novo**) — **cinco** gates: `D015-TIT1`, `D015-ANC1`, `D015-HOWTO1`, `D015-NOSUB1`, `D015-GOV1`. Namespace exclusivo `D015-*`; **nenhuma suíte congelada é tocada**. Âncora de `NOSUB1`/`GOV1` na forma de `p52BaselineRef()`/`baselineFile()` (`tests_p52_chromium.js:1233-1265`): commit **imutável** + path + bytes + sha256, conferidos antes do uso, **nunca `HEAD:`** (R10 §5); **um boot de âncora por estado, reusado pelos dois gates** (14 boots viram 7). Asserções de texto por **propriedade e duas expressões independentes**, jamais pela frase inteira. Última linha no formato `N PASS · M FAIL` (regex de `check_suites.py`) | `C1` `C2` `C3` `C5` `C6` |
| T008 | 1 | `qa-engineer` | chore | | `.claude/verify/expected_suites.json` — chave `d015` no bloco `suites`, **no MESMO commit de T006/T007**: `check_suites.py:53-56` reprova qualquer `tests_*.js` fora do registro. Contagem entra **declarada** (5/0), com `_trilha` nomeando a janela vermelha e por que ela não é rebaixada (R10 §1); a fixação **por execução** é T025 | `C6` · stage `suites` |
| T009 | 1 | `qa-engineer` | chore | | **Prova de red.** Executar a suíte, **nomear o FAIL de cada gate** e **commitar o vermelho**; registrar `red.status: proven`, `red.commit` e `red.gates` no planning-state. Declarar sem omitir: **`D015-NOSUB1` e `D015-GOV1` nascem VERDES** — são critérios de preservação e nada foi removido ainda; o poder deles é provado por `M14`/`M15`/`M16`, não pelo red. Registrar também a medição **"antes"** de `C3(b)`: `txt(#pr-howto).length` medido no HTML de HEAD. Commit de planning-state **não pede repin** | stage `tdd` · R3 §4 |
| T010 | 1 | `build-engineer` | chore | | **Repin R4** — depois do commit red. Mensagem: `chore(015): gen_pins — R4 da serie (suite e fixture D015-*, registro de contagem)` | stage `baseline` |
| T011 | 2 | `ui-engineer` | feature | | **`ui_v32.js` — os quatro sítios, uma delegação, um commit.** O gate viaja no prompt: critérios em `spec.md`, desenho em `plan.md` §1 — **nunca implementação inline**. Restrições **não negociáveis**, todas medidas na Fase 2: o título **não pode conter** `"Como a Fortinet pode apoiar"` (`tests_ui_m31.js:38`/`:60`/`:137`) e tem de ser **único** entre os `.section-title` da seção de apoio (`tests_p52_layout.js:530-532`); o sufixo `· contexto V3.2` **fica** na tela e **não** vai ao papel; o nó de S3 é **irmão** de `[data-pr-gap-why]` com atributo **próprio**, **termina em ponto final** (`tests_p50_core.js:3418`), **não nomeia produto** (`!/Forti[A-Z]/`) e não usa expressão de overclaim (`:3429`); o 7º `<li>` é **literal constante** e cabe em **~308 caracteres visíveis** (folga medida: 315 crus). **Zero CSS, zero bridge, zero estado, zero `innerHTML =` novo, nenhuma outra função tocada.** Abre a **JV1** (`P50-GOV1`/`P50-IC4`) e a **JV2** (stage `build`) | `D015-TIT1` `ANC1` `HOWTO1` · preserva `NOSUB1` `GOV1` |
| T012 | 2 | `build-engineer` | chore | | **Repin R5** — depois de T011. Mensagem: `chore(015): gen_pins — R5 da serie (ui_v32.js: titulos, ancoragem do apoio e 7o item)` | stage `baseline` |
| T013 | 2 | `build-engineer` | chore | | **Repin inline de `PROTECTED`** em `tests_p50_core.js:192`: **só** o hash de `ui_v32.js`, mais comentário-trilha no padrão vivo do mapa (motivo, data, citação da §"Autorização nominal §29.4" da spec e **"Identidade anterior: `d594dafec00d11efa2c25d6fe3183f1d5177343f09c925dfcc7055b17df9bb85`"**). **Nenhuma asserção é tocada; nenhum gate nasce ou morre**; `frozenSuites` (`:446-449`) segue intacto. Hash calculado sobre o arquivo **em disco**, normalizado LF (R2 §2). Um repin fecha **os dois** gates (`P50-GOV1` e `P50-IC4(a)` leem a mesma entrada) → **fecha a JV1**. Dono é o `build-engineer`, **não o QA**: quem escreve o hash não pode ser quem valida o gate que o consome (R3 §2) | `P50-GOV1` `P50-IC4` |
| T014 | 2 | `build-engineer` | chore | | **Repin R6** — depois de T013. Mensagem: `chore(015): gen_pins — R6 da serie (repin inline de PROTECTED)` | stage `baseline` |
| T015 | 2 | `build-engineer` | chore | | `python build_v32_html.py` — rebuild de `quickscan_secops_soccmm_v3_2_dev.html` (classe `generated`, **nunca editado à mão**) → **fecha a JV2**. **Pré-condição do verde, não acabamento**: as suítes jsdom bootam o HTML gerado, não os fontes — **contagem medida antes do rebuild não vale e não pode ser registrada** | stage `build` |
| T016 | 2 | `build-engineer` | chore | | **Repin R7** — depois de T015. Mensagem: `chore(015): gen_pins — R7 da serie (rebuild do gerado)` | stage `baseline` |
| T017 | 3 | `qa-engineer` | chore | | **Medição autoritativa, pós-rebuild.** Executar `d015` e a regressão congelada nomeando contagens: `p50core` 64/0 (inclui `P51-REC1` e `P51-DOC12`), `ui31` 19/0, `ui32` 25/0, `ui332` 23/0, `ux41` 56/0, `p52layout` 45/0, `d009` 15/0, `d010` 13/0, `engine` 105/0. Registrar a medição **"depois"** de `C3(b)` (o gate exige antes **e** depois). Contagem congelada diferente = o diff saiu do escopo: **parar e reabrir a análise**, nunca ajustar o registro (R10 §1). **Nenhum arquivo tocado → sem commit, sem repin** | `C1` `C2` `C3` `C5` `C6` · stage `suites` |
| T018 | 3 | `qa-engineer` | chore | | `tests_015_mutants.js` (**novo**) — **12 mutantes** no harness `d015`: `M1`–`M10`, `M14`, `M15`. O `M16` é T022; `M11`–`M13` **não existem** (aposentados com o C4 — a matriz registra a causa). Shape copiado de `tests_010_mutants.js` (cópia de shape, nunca extração de runner comum): âncora textual que casa **exatamente 1×**, mutação in-place → **rebuild** → gate correspondente **filtrado** → exige FAIL **com motivo compatível** (detecção incidental não é kill) → restauração byte a byte provada por SHA-256, do fonte **e** do HTML. Modo `--preflight` em `argv` emitindo **um** JSON (`harness`, `arquivo`, `interpretador`, `arquivos_mutados`, `mutantes`) sem mutar nem reconstruir, e o **vocabulário de três estados** no relato (DETECTADO/SOBREVIVENTE/NÃO EXECUTADO com causa) — o `d015` nasce sem a dívida do `d009`. Caminhos **entre aspas** (R10 §7) | R3 §5 |
| T019 | 3 | `qa-engineer` | chore | | `.claude/verify/mutation_map.json` — harness `d015`: `cmd: "node tests_015_mutants.js"`, `"preflight": true` **no MESMO commit de T018** (a guarda de fonte de `check_mutation.py` recusa a chave sem o modo, e sem ela o IC-4 derruba o stage inteiro mesmo com a campanha verde), `requires: ["node","python"]` — **sem chromium**, porque nenhum gate `D015-*` mede geometria. Alvos: `ui_v32.js`, `tests_015_apoio.js` e `fixtures_015_apoio.js` (o **oráculo** e a **fixture** da campanha) e o próprio harness — precedente `d009`/`d010`, desvio que **endurece** o trigger | stage `mutation` |
| T020 | 3 | `build-engineer` | chore | | **Repin R8** — depois de T018+T019. Mensagem: `chore(015): gen_pins — R8 da serie (campanha d015 e registro do harness)` | stage `baseline` |
| T021 | 3 | `qa-engineer` | chore | | Executar a campanha `d015` com **árvore limpa** (`check_mutation.py` exige) e registrar o resultado **por mutante**. `d015` é node+python e **roda local**: se não rodar, é falha, não adiamento. Conferir no `--preflight` que **todas** as âncoras casam 1× — inclusive as dos harnesses `core`/`d009`/`d010`, que a edição de `ui_v32.js` também dispara e cujas âncoras a Fase 2 mediu como **intactas** | stage `mutation` |
| T022 | 3 | `qa-engineer` | chore | | **`D015-M16` em worktree efêmera — nunca no harness, nunca na árvore da demanda.** O mutante move a declaração de S3 para o card-alvo, o que exige mutar `ui_target_v32.js`, **protegido e não autorizado**. `git worktree add` a partir do HEAD da demanda → mutar → rebuild **lá dentro** → provar que `D015-GOV1(a)` reprova (e que `P50-GOV1`/stage `baseline` reprovam) → `git worktree remove`. **O harness automatizado nunca toca `PROTECTED`** — foi exatamente aí que a 009 se queimou. Forma na matriz: `harness: "manual (worktree efêmera)"` (precedente `D011-M6`) | `D015-GOV1` · `P50-GOV1` |
| T023 | 3 | `qa-engineer` | chore | | `.claude/verify/mutation-matrix.json` — **13 pares** (12 do harness + `M16` manual), cada um com `harness`, `gate` e `ultima_prova.resultado`, que `check_tdd.py:47-52` exige. Campanha nova nasce **expandida, nunca agregada**. Em `dividas_declaradas`, com causa escrita: (a) **`M11`–`M13` aposentados** pela queda do C4 — ids não reutilizados; (b) as alíneas cujo discriminante é **só o mutante**, nunca a fixture (`TIT1(a)`–`(e)`, `ANC1(a)(b)(d)`, `HOWTO1(a)(b)(c)(e)`) — rodar mais fixtures ali é ruído; (c) **`GOV1(d)`** como **cláusula inalcançável por construção, sem mutante**, classe já registrada em `design-decisions.md` — não é código morto | stage `tdd` · stage `mutation` |
| T024 | 3 | `build-engineer` | chore | | **Repin R9** — depois de T023. Mensagem: `chore(015): gen_pins — R9 da serie (matriz gate-mutante)` | stage `baseline` |
| T025 | 4 | `qa-engineer` | chore | | `.claude/verify/expected_suites.json` — **fixar por execução** a contagem de `d015`, com o rebuild de T015 já commitado. A contagem deixa de ser a declarada e passa a ser **medida**. Manter o `_trilha` da janela vermelha, sem reescrevê-lo | stage `suites` |
| T026 | 4 | `build-engineer` | chore | | **Repin R10** — depois de T025. Mensagem: `chore(015): gen_pins — R10 da serie (contagem de d015 fixada por execucao)` | stage `baseline` |
| T027 | 4 | `qa-engineer` | chore | [P] | Pipeline completo local: `bash .claude/verify/run.sh`. **Declarar, não esconder**: `mutation` traz `[FAIL] p51/p52 … ambiente sem chromium` (ou `[DEFER]` com `MUTATION_DEFER_MISSING=1`) — o que fecha é T028. Conferir que `declared.m41_payload_sha256` **não mudou**: se mudou, **PARAR** (Porta B, não autorizada). Depois, `spec-validate` — a §"O que NÃO é mensurável por gate" da spec é a resposta legítima onde ele acusar "critério sem asserção". **Nenhum arquivo tocado** | todos os stages locais |
| T028 | 4 | `build-engineer` | chore | [P] | **CI — o único caminho para o que exige Chromium.** Push da branch e **abertura do PR** para `develop` (livre, R14; o merge é do usuário): o workflow dispara em `pull_request`/`push` para `develop`/`main`, **não** em push de `feature/*` — alternativa é `workflow_dispatch` com `visual: true`. Colher do job `visual`: `p50chromium` 27/0 (mede `#pr-howto` no **PDF real**), `p52chromium` 55/0 (inclui `P52-SUP3`) e as campanhas **`p51` (20 mutantes)** e **`p52` (107 mutantes)**, que `ui_v32.js` dispara. Registrar o **número do run**. Não há Chromium nesta worktree (medido pelo `env-doctor`): é **agendamento por desenho (KI-3), não pendência**. Devolver o resultado ao `qa-engineer` | job `visual` · stage `mutation` |
| T029 | 4 | `qa-engineer` | chore | | Registrar o retorno de T028 na `mutation-matrix.json` e no planning-state. **Dono único da matriz em todas as waves é o `qa-engineer`**: o `build-engineer` executa o job e reporta, não escreve na matriz. Campanha chromium **vermelha** = diagnosticar **causa** antes de atribuir ao produto (R2 §3) | stage `tdd` |
| T030 | 4 | `build-engineer` | chore | | **Repin R11 — condicional**: só existe se T029 alterar arquivo rastreado. Mensagem: `chore(015): gen_pins — R11 da serie (retorno do job visual)` | stage `baseline` |
| T031 | 4 | `doc-writer` | doc | | `specs/015-superficies-de-apoio/relatorio-final.md`, pelo template. Registrar nominalmente: a **queda do C4** e sua errata; as quatro janelas vermelhas e quando cada uma fechou; a **série de repins executada** e **qualquer repin fora de R2–R12** (desvio se registra, nunca se silencia — a 008 pagou três execuções não previstas); o que ficou deferido ao CI **com o número do run**; e que a demanda correu **sob delegação**, com autorização nominal **por arquivo**. **Não** escrever em `.claude/BACKLOG.md` nem alocar id `EA-*` (spec §Fora de escopo 10) | — |
| T032 | 4 | `build-engineer` | chore | | **Repin R12** — depois de T031. Mensagem: `chore(015): gen_pins — R12 da serie (relatorio final)` | stage `baseline` |
| T033 | 4 | `product-owner` | chore | | **Aceite de intenção.** A spec já dispôs que a Fase 6 **não fecha só com gate verde**: julgar a **redação** escolhida para o título (o gate impede o título falso; não produz o título bom), o nó de ancoragem no **PDF real** e se a tela/papel ficaram poluídos — os três itens que a spec declarou **não mensuráveis**. Se a redação com o sufixo ficar intragável, o rito é **parar e devolver**, nunca decidir | aceite |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

**Contagem por wave**: W0 = 5 · W1 = 5 · W2 = 6 · W3 = 8 · W4 = 9 — **33 tarefas**.

## Tipagem — as escolhas que não são óbvias

- **T006/T007 são `feature`** porque carregam o tipo da demanda e **produzem** o
  red; o red delas é o commit de T009. Não é auto-referência: escrever o gate e
  provar o vermelho são passos distintos, e o autor do gate nunca é o
  implementador (R3 §2).
- **T011 é `feature`** e é a **única** tarefa de produto da demanda. Recebe o gate
  pronto no prompt (R3 §3).
- **T004 é `doc`, não `fix`.** Errata de spec corrige o **registro** de uma decisão
  do orquestrador, não comportamento: não há red possível para ela.
- **T013 é `chore`.** Repin inline é manutenção de registry (R8 §2). Tipá-la
  `feature`/`fix` exigiria um red que não existe semanticamente — o que ela fecha
  é uma janela vermelha declarada, não um defeito.
- **T018 é `chore`, não `feature`.** Campanha de mutação é instrumento de
  verificação; sua prova não é um red, é o **KILL** registrado em T021/T023.
- **Nenhuma tarefa é `fix`.** A demanda é **aditiva**: nenhum comportamento
  existente muda — dois títulos são reescritos e dois nós nascem. Nada é removido,
  e `D015-NOSUB1` existe para provar isso.
- **Nenhum `tdd_waiver` é previsto.** Waiver aqui seria sinal de tipagem errada, e
  a conversa acontece sobre o dado (R3, válvula 2).

## Um arquivo, um dono

| Arquivo | Dono único | Waves |
|---|---|---|
| `ui_v32.js` | `ui-engineer` | 2 |
| `quickscan_secops_soccmm_v3_2_dev.html` · `tests_p50_core.js` (só o hash inline) | `build-engineer` | 2 |
| `tests_015_apoio.js` · `fixtures_015_apoio.js` · `tests_015_mutants.js` · `expected_suites.json` · `mutation_map.json` · `mutation-matrix.json` | `qa-engineer` | 1, 3, 4 |
| `spec.md` (errata) | `product-owner` | 0 |
| `relatorio-final.md` | `doc-writer` | 4 |
| `.claude/verify/pins.json` | `build-engineer` (só via `gen_pins.py`) | todas |
| `planning-state/015-*.json` | `build-engineer` cria (T003) · `qa-engineer` escreve `red`/`validate` (T009, T029) | 0, 1, 4 |

Nenhum arquivo tem dois donos na mesma wave. Os dois casos que exigiram decisão:
**`tests_p50_core.js`** — o `build-engineer` escreve o hash, o `qa-engineer` que
valida `P50-GOV1`/`P50-IC4` **nunca abre o arquivo**; e a **matriz de mutantes** —
o `build-engineer` roda o job do CI (T028), quem **escreve** o resultado é o
`qa-engineer` (T029).

## Série de repins — a regra, no `tasks.md` e não só no plano

`gen_pins.py` calcula os hashes com `git show HEAD:<path>`. **Rodá-lo antes de
commitar pina o conteúdo antigo.** Logo o repin **nunca** viaja dentro do commit
que altera o arquivo: é sempre um commit `chore` **imediatamente posterior**, um
por commit de conteúdo. "No mesmo PR" (R8 §1) **não** é "no mesmo commit" — e o
`plan.md` da 009, que concentra `gen_pins.py` numa wave final, é **precedente
errado** neste ponto.

| Repin | Tarefa | Depois do commit de conteúdo |
|---|---|---|
| R0 · R1 | — | **já executados**: `refinement.md` (`92e3692`) e `spec.md` (`a5ab9d6`) |
| **R2** | T001 | `plan.md` + `tasks.md` |
| **R3** | T005 | errata da spec (queda do C4) |
| **R4** | T010 | suíte + fixture + `expected_suites` (commit **red**) |
| **R5** | T012 | `ui_v32.js` |
| **R6** | T014 | repin inline de `PROTECTED` |
| **R7** | T016 | HTML gerado (rebuild) |
| **R8** | T020 | `tests_015_mutants.js` + `mutation_map.json` |
| **R9** | T024 | `mutation-matrix.json` |
| **R10** | T026 | `expected_suites` com a contagem medida |
| **R11** | T030 | retorno do job `visual` — **condicional** |
| **R12** | T032 | relatório final |

Wave que fechar em dois commits de conteúdo vira `R<n>a`/`R<n>b`: é granularidade,
não desvio. **Desvio de verdade** — repin fora desta tabela, como o que um merge
de `develop` exige — vai **registrado no relatório final** (T031), nunca
silenciado. `.claude/project-memory/**`, `docs_phase5/**` e `*.zip` estão fora do
registry: commit de planning-state **não** pede repin. Conferir a cada repin que
`declared.m41_payload_sha256` não mudou.

## Matriz gate↔mutante prevista (T023)

| Mutante | O que faz | Carrasco | Onde roda |
|---|---|---|---|
| `M1` | restaura o literal antigo do eyebrow | `D015-TIT1(a)` | `d015` (local) |
| `M2` | apaga o sufixo `· contexto V3.2` | `D015-TIT1(b)` | `d015` (local) |
| `M3` | edita só a tela, deixando o papel para trás | `D015-TIT1(c)` | `d015` (local) |
| `M4` | copia o sufixo para o `<h3>` do papel | `D015-TIT1(d)` | `d015` (local) |
| `M5` | emite a ancoragem só no ramo "não declarado" | `D015-ANC1(c)` | `d015` (local) |
| `M6` | troca o texto por afirmação de ancoragem **por nível** | `D015-ANC1(b)` | `d015` (local) |
| `M7` | reusa `data-pr-gap-why` em vez do atributo próprio | `D015-ANC1(a)` | `d015` (local) |
| `M8` | torna o 7º item função da sessão | `D015-HOWTO1(d)` | `d015` (local) |
| `M9` | remove o 7º item | `D015-HOWTO1(a)(c)` | `d015` (local) |
| `M10` | escreve o item longo o bastante para estourar 900 | `D015-HOWTO1(b)` | `d015` (local) |
| `M11` `M12` `M13` | — | — | **aposentados com o C4** (dívida declarada, id nunca reutilizado) |
| `M14` | colapsa em aviso o card de prioridade sem payload (rota S4, recusada) | `D015-NOSUB1(a)` | `d015` (local) |
| `M15` | suprime o `pr-gapsup` do qid que é prática-alvo (rota T5, recusada) | `D015-NOSUB1(b)(d)` | `d015` (local) |
| `M16` | move a declaração de S3 para o card-alvo (**muta `ui_target_v32.js`**) | `D015-GOV1(a)` | **worktree efêmera** (T022) |

`M16` é o mutante que guarda a **boundary**, não o comportamento: se ele
sobreviver, `D015-GOV1` não está provando que a autorização não foi excedida.

## Onde cada campanha fecha — para ninguém marcar como pendente o que é deferido

- **`d015` (12 mutantes)**: `requires: [node, python]`, **roda local** no stage
  `mutation`. Nada nela é deferido.
- **`M16`**: worktree efêmera, manual, wave 3. **Fecha local.**
- **`core`, `d009`, `d010`**: **disparadas** pela edição de `ui_v32.js` (o arquivo
  é alvo declarado das três) e **fecham local** — node+python. A Fase 2 mediu que
  **nenhuma âncora delas cai sobre os quatro sítios**: espera-se `KILL` inalterado
  e `--preflight` com `ocorrências == 1`. Divergência = parar.
- **`p51` (20 mutantes) e `p52` (107 mutantes)**: exigem **Chromium**, ausente
  nesta worktree (medido pelo `env-doctor`). Localmente saem como
  `[FAIL] campanha EXIGIDA … ambiente sem chromium` — **declaração, não conserto**.
  Fecham no **job `visual` do CI** (T028), que roda `check_mutation.py` com
  Chromium instalado. **Diferente da 011, isto não era evitável**: a autorização
  nominal aponta para o arquivo que é alvo das duas.
- **`p50chromium` (27) e `p52chromium` (55)**: regressão de tela/PDF, mesmo
  caminho — CI (T028) e rito do proprietário (T033).
- **`p50` e `d011`**: **não são disparadas** — nenhum alvo delas entra no diff.

## Decisões pendentes

1. **§29.6 do PDF.** A autorização de 2026-08-31 é por arquivo e o proprietário
   confirmou que cobre `buildPrintReport`; 009 e 010 são precedente. Se ele
   entender que a §29.6 exige palavra própria para o papel, **T011 para** e a
   demanda devolve. É confirmação de **uma linha**, não suposição.
2. **T004 pode ser do `tech-lead` em vez do `product-owner`** — a spec é dos dois
   (R4). Atribuí ao PO porque escopo de critério é intenção de produto; se o
   orquestrador preferir o TL, a tarefa não muda de conteúdo nem de wave.
3. **Quando abrir o PR (T028).** Abrir cedo dá retorno de CI a cada push, mas
   também colhe as janelas vermelhas de W2 como vermelho no CI. A recomendação é
   abrir **quando W3 fechar verde local**; se o orquestrador quiser retorno
   antecipado do CI, abrir antes é legítimo desde que os vermelhos de JV1–JV3
   sejam lidos como o que são.
4. **`R11` é condicional** e só nasce se T029 alterar arquivo rastreado. Se o job
   `visual` não fechar dentro da janela da demanda, o `product-owner` decide em
   T033 se aceita com `p51`/`p52` deferidos e registrados, ou se segura o aceite.
5. **O achado da spec não vira tarefa aqui.** "Prioridade declarada nunca
   desaparece" é invariante de fato **sem âncora normativa escrita** — a spec o
   roteia ao `doc-writer` (id) e ao `product-owner` (redação), **depois** de
   conferir a `develop`, e põe `.claude/BACKLOG.md` fora de escopo. Criar tarefa
   seria ampliar o plano aprovado.

---

## Errata — o que a execução mudou neste artefato

Decidida pelo orquestrador sob a delegação do proprietário de 2026-08-29, e
escrita **sem renumerar tarefa alguma** (R12): id é permanente, contagem não é.

Este `tasks.md` foi escrito **antes** das erratas **E1**, **E2** e **E3** da
spec, e a execução o ultrapassou em quatro pontos. Deixá-lo como está faria o
próximo leitor herdar os números errados — que é exatamente o custo que a
demanda mediu no `667` de um commit imutável.

| O que o artefato diz | O que a execução mediu |
|---|---|
| "12 mutantes" | **15** no harness `d015` (`M1`–`M10`, `M14`, `M15` ampla, `M17`, `M18`, `M19`) |
| "13 pares" | **16** — os 15 acima mais `M16`, que roda em worktree efêmera |
| matriz prevista sem `M17`/`M18`/`M19` | os três existem: `M19` nasceu da **E2** e `M17`/`M18` do gap que o `spec-validate` achou |
| série de repins `R2`–`R12` | executada **`R0`–`R12`** — a série começa em `R0` porque artefato de fase também é pinado, lição da 011 |
| `D015-RES1` como gate a escrever | **não foi escrito**: o `C4` caiu pela **E1**, e os mutantes `M11`–`M13` estão **aposentados com causa, ids não reusados** |

**O que NÃO muda**: nenhuma tarefa foi renumerada, nenhuma foi removida, e a
tipagem e os donos permanecem. O único desvio de dono está registrado no
`relatorio-final.md` — o repin inline de `PROTECTED`, que o T013 atribui ao
`build-engineer` e que foi executado pelo `qa-engineer` sob exceção nominal do
orquestrador, com a mitigação nomeada.
