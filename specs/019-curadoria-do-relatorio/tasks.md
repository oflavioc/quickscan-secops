# Tarefas — 019-curadoria-do-relatorio

> Fase 3 · dono: tech-lead · ids `[TNNN]` são permanentes; wave final é sempre
> validação. Consome a [spec.md](spec.md) e o [plan.md](plan.md), aprovados em
> 2026-09-17.
>
> **Nota de condução** (herdada da 018): agentes de papel indisponíveis como
> subagentes nesta sessão — o orquestrador executa cada tarefa **no contrato do
> dono nomeado**, e a separação de poderes da **R3 §2** é mantida por **commit e
> artefato distintos**, não por processo distinto. Isso vai dito em vez de
> simulado, e **é a maior fragilidade desta demanda**: quem escreve o critério e
> quem o satisfaz são o mesmo agente.
>
> **Mitigação, e ela é estrutural**: o `qa-engineer` entrega **os dez gates e os
> dez mutantes, e prova o red, ANTES de existir uma linha de implementação**
> (T002–T005). A ordem dos commits é a prova de que o critério não foi ajustado
> ao resultado. A tarefa mais perigosa é a **T012** — reancorar o `S4-S5` — e ela
> tem tratamento próprio, descrito nela.

| Id | Wave | Dono | Tipo | [P] | Descrição | Gate |
|---|---|---|---|---|---|---|
| **T001** | 0 | `build-engineer` | chore | | **Repin R1 da série.** `check_baseline.py` **antes** (medir a dívida, não supor zero) e `gen_pins.py` depois do commit de `tasks.md` | stage `baseline` |
| **T002** | 1 | `qa-engineer` | feature | | **`tests_019_curadoria.js` (novo) — os dez gates** `D019-CUR1`, `CUR2`, `INV8`, `PROV1`, `MED1`, `SOL1`, `SOL2`, `PAR1`, `VAZ1`, `SUF1`, conforme `spec.md` §Critérios. Restrições **não negociáveis**: não escreve na árvore (R7 §3); caminhos entre aspas (R10 §7); **não spawna suíte** (R10 §6); auto-exclusão nominal (R10 §10). O `PAR1` mede o papel **depois de `beforeprint`**, nunca `buildPrintReport()` cru | `C1`…`C10` |
| **T003** | 1 | `qa-engineer` | feature | | **`tests_019_mutants.js` (novo) — os dez mutantes.** Âncoras pelo **texto estável**, nunca por número de linha (lição do `EA-4`). O **M4** remove a proveniência **só no papel** e o **M6** descarta produto que só aparece como `.prod-mini` — são os dois que medem o modo real de quebra | um por gate |
| **T004** | 1 | `qa-engineer` | chore | | **PROVA DE RED.** Executar, **nomear o FAIL de cada gate** e **commitar o vermelho** (`test(019): red — D019-*`). Declarar sem omitir quais **nascem verdes**: `CUR2`, `MED1` e `SUF1` — nada os viola hoje, e o poder deles vem dos mutantes (precedente `D015-NOSUB1`). O vermelho real é `CUR1`, `INV8`, `PROV1`, `SOL1`, `SOL2`, `PAR1`, `VAZ1` | stage `tdd` · R3 §4 |
| **T005** | 1 | `qa-engineer` | chore | | Registrar `red.status: proven`, `red.commit` e `red.gates` no planning-state | stage `state` |
| **T006** | 1 | `build-engineer` | chore | | **Repin R2** — depois do red, janela vermelha aberta | stage `baseline` |
| **T007** | 2 | `core-engineer` | feature | | **`ui_curation_v32.js` (novo) — o owner do estado.** `reportCuration` com `offerings` (id → enum fechado) e `architectureNote`. **Só getters/setters de bridge**; nenhum módulo de renderização escreve (R9 §5). IIFE + `__installed`; ≤ 600 linhas | `D019-CUR1` |
| **T008** | 2 | `build-engineer` | chore | | Registrar **`__CURATION`** em `.claude/verify/bridges.json` — **um** bridge, e só no módulo de estado (R9 §2) | stage `lint-arch` |
| **T009** | 2 | `build-engineer` | chore | | Ordem de injeção em `build_v32_html.py`: os três novos **depois** de `ui_v32.js` e **antes** de `ui_p52_workspace_v32.js` | stage `build` |
| **T010** | 3 | `data-engineer` | feature | [P] | **Sexta chave em `captureCanonicalInputs()`** e restauro na importação. **`ui_session_v32.js` é §29.4 — autorizado em 2026-09-17**; repin com trilha inline | `D019-INV8` |
| **T011** | 3 | `data-engineer` | feature | [P] | **Validação na importação**: `missing ≠ null ≠ {}`; id desconhecido e valor fora do enum são **recusados com mensagem**, nunca ignorados | `D019-INV8` · `S27` |
| **T012** | 3 | `qa-engineer` | fix | | **Reancorar a lista do `S4-S5`** (`tests_session_m48.js`, §29.4, autorizado). **Tarefa de maior risco da demanda** — é ajustar o critério que me julga. Três condições, e nenhuma é negociável: (i) os **13 nomes de campo derivado** proibidos permanecem proibidos, conferidos por execução; (ii) a reancoragem entra **com mutante próprio** que ressuscite a lista antiga, provando que a alínea ainda discrimina; (iii) commit **separado** do T010, e **depois** dele, para que o diff mostre a chave existindo antes do critério aceitá-la | `S4-S5` · `S27` |
| **T013** | 4 | `ui-engineer` | feature | [P] | **`ui_p52_support_v32.js` (novo) — reagrupamento por produto.** Os `.apoio-block` são **transformados, nunca ocultados** (plan §Desenho). **Movimento de nós**, zero `innerHTML =` (R9 §9). Cada produto entra uma vez, com as capabilities que atende | `D019-SOL1` |
| **T014** | 4 | `ui-engineer` | feature | [P] | **Agrupamento pelo portfólio**: subgrupo de *Security Operations* quando existir, categoria de topo quando não, **balde próprio para serviços** (MDR, IR, capacitação — não estão em *Products*) e grupo explícito para o não classificado, que é **listado** | `D019-SOL2` |
| **T015** | 4 | `ui-engineer` | chore | [P] | CSS com **prefixo próprio**; nenhum seletor alheio (R9 §6). **Sem hex literal** — só tokens (lição do `P50-COR1`) | `P52-ACC1` |
| **T016** | 5 | `ui-engineer` | feature | | **`ui_curation_edit_v32.js` (novo) — o editor**, no padrão do editor de contexto tecnológico. **Não cria `step`**; a Camada 1 não é tocada | `D019-CUR1` |
| **T017** | 5 | `ui-engineer` | feature | | **Gate de suficiência fechado ⇒ curadoria indisponível**: o controle não existe e o estado não é lido | `D019-SUF1` |
| **T018** | 5 | `ui-engineer` | feature | | **Supressão total declara a supressão** — nunca seção vazia, nunca seção ausente | `D019-VAZ1` |
| **T019** | 5 | `ui-engineer` | feature | | **Sinalização no editor** de inclusão que a avaliação já não sustenta (caso de borda 4/5): mantida e **avisada**, nunca descartada nem ressuscitada em silêncio | `D019-CUR2` |
| **T020** | 6 | `ui-engineer` | feature | | **Seleção aplicada no papel**, em `buildPrintReport()`. **`ui_v32.js` é §29.4 — autorizado**; repin com trilha inline | `D019-PAR1` |
| **T021** | 6 | `ui-engineer` | feature | | **Proveniência no papel**, no padrão de `Observações da sessão`. **Antes de qualquer entrada de cópia de apresentação: `grep` do literal em `tests_*.js`** (mitigação do `EA-62`) | `D019-PROV1` |
| **T022** | 7 | `build-engineer` | chore | | `expected_suites.json` com a contagem de `tests_019_curadoria.js` e `pipeline.yaml` com o harness `d019` (R10 §3, §9) | stage `suites` |
| **T023** | 7 | `qa-engineer` | chore | | **Campanha de mutação verde** (10/10) + pipeline completo, com as contagens canônicas. **A W4 não se declara pronta sem o job `visual` verde** — a geometria é o único risco que esta máquina não julga (KI-3) | stage `mutation` |
| **T024** | 7 | `qa-engineer` | doc | | `spec-validate.md` — score; < 100% ⇒ classificar e iterar (máx. 2) | skill `spec-validate` |
| **T025** | 7 | `product-owner` | doc | | **Aceite de intenção** contra o `refinement.md`, e `relatorio-final.md` | R4 Fase 6 |
| **T026** | 7 | `build-engineer` | chore | | `gen_pins` final e **PR `feature/019` → `develop`**. Merge é do usuário, e só depois do `done` | stage `fecho` |

## Ordem que não pode inverter

1. **T002–T005 antes de T007.** O red existe antes da implementação, e o commit
   prova isso. Sem essa ordem, a R3 §3 vira encenação.
2. **T010 antes de T012.** A chave existe antes de o critério aceitá-la — o diff
   precisa mostrar que a reancoragem respondeu a um fato, não o contrário.
3. **T013 antes de T016.** O editor oferece o que a visão por solução agrupa; sem
   ela, ele ofereceria a lista velha e seria refeito.
4. **T023 depois de tudo**, e ele **espera o CI**. A wave 4 não fecha local.

## Um módulo por delegação

Nenhuma wave tem dois donos no mesmo arquivo. As paralelas:

- **W3** (`[P]`): T010/T011 em `ui_session_v32.js` — **mesmo dono**, sequenciais
  entre si e paralelas à W4.
- **W4** (`[P]`): T013/T014/T015 em `ui_p52_support_v32.js` e seu CSS — **mesmo
  dono**, e sem interseção com a W3.

> **T012 fica FORA do paralelo** de propósito: ela toca `tests_session_m48.js`,
> que a W3 depende de ver **estável** enquanto implementa.
