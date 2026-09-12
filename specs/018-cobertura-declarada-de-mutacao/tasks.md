# Tarefas — 018-cobertura-declarada-de-mutacao

> Fase 3 · dono: tech-lead · ids `[TNNN]` são permanentes; wave final é sempre
> validação. Consome a [spec.md](spec.md) e o [plan.md](plan.md) aprovados em
> 2026-09-11.
>
> **Nota de condução** (herdada): agentes de papel indisponíveis como subagentes
> nesta sessão — o orquestrador executa cada tarefa no contrato do dono nomeado, e
> a separação de poderes da **R3 §2** é mantida por **commit e artefato
> distintos**, não por processo distinto. Isso vai dito em vez de simulado, e é a
> maior fragilidade desta demanda: quem escreve o julgador e quem escreve a dívida
> são o mesmo agente. **Mitigação**: o `qa-engineer` entrega o julgador **e o
> red** antes de qualquer dívida existir (T006/T007); o `build-engineer` só então
> escreve as dívidas (T009). A ordem dos commits é a prova de que o critério não
> foi ajustado ao resultado.

| Id | Wave | Dono | Tipo | [P] | Descrição | Gate |
|---|---|---|---|---|---|---|
| **T001** | 0 | `build-engineer` | chore | | **Repin R1 da série.** `python .claude/verify/check_baseline.py` **antes** (medir a dívida, não supor zero) e `gen_pins.py` **depois** do commit de `tasks.md`. Mensagem: `chore(018): gen_pins — R1 da serie (tasks.md)` | stage `baseline` |
| **T002** | 0 | `product-owner` | doc | | **ESCALAR — o prazo das seis dívidas.** A spec exige que exista e seja cobrado (`C4`); **o valor é decisão do proprietário**, no chat. Sem ele a T009 não tem o que escrever. Registrar a resposta aqui e no planning-state | `D018-PRAZO1` |
| **T003** | 1 | `qa-engineer` | feature | | **`.claude/verify/mutation_population.json` (novo) — só a REGRA.** Forma: `regra` (todo `check_*.py` referenciado por stage do `pipeline.yaml`), `excecoes: []`, `dividas: []`. **Sem dívidas de propósito** — é o que faz o red existir. A regra é **dado, não código** (plan.md §Riscos) | pré-condição de todos |
| **T004** | 1 | `qa-engineer` | feature | | **`.claude/verify/check_mutation_coverage.py` (novo) — os 7 gates.** `D018-POP1`, `POP1(b)`, `ORF1`, `ORF1(b)`, `PRAZO1`, `COB1`, `MORTO1`, conforme `spec.md` §Critérios. Restrições **não negociáveis**: leitura pura, **não escreve na árvore** (R7 §3); caminhos **entre aspas** (R10 §7); **não spawna suíte** (R10 §6); **auto-exclusão nominal** (R10 §10); última linha na forma `mutation-coverage: N na população · M órfão(s) · K lacuna(s) · D dívida(s)`. **Não toca `check_mutation.py`** | `C1`…`C7` |
| **T005** | 1 | `qa-engineer` | chore | [P] | **Conferir a regra contra o previsto**: a população tem de sair com **14** `check_*.py` (medido na Fase 0). Divergência ⇒ **parar e reabrir a análise**, nunca ajustar o número no registro (R10 §1) | `D018-POP1` |
| **T006** | 1 | `qa-engineer` | chore | | **PROVA DE RED.** Executar o julgador, **nomear o FAIL de cada gate** e **commitar o vermelho** (`test(018): red — D018-*`). Declarar sem omitir: `POP1`, `POP1(b)`, `PRAZO1`, `MORTO1` e **`COB1` nascem VERDES** — nada os viola hoje, e o poder deles vem dos mutantes, não do red (precedente `D015-NOSUB1`/`GOV1`). O vermelho real é **`ORF1`, nomeando os seis órfãos** | stage `tdd` · R3 §4 |
| **T007** | 1 | `qa-engineer` | chore | | **Registrar o red no planning-state**: `red.status: proven`, `red.commit`, `red.gates`. **Este é o commit que o `EA-3` nunca teve**: o defeito dele como linha vermelha nomeando arquivo, em vez de silêncio | stage `state` |
| **T008** | 1 | `build-engineer` | chore | | **Repin R2** — depois do red. Mensagem: `chore(018): gen_pins — R2 da serie (julgador e populacao, janela vermelha aberta)` | stage `baseline` |
| **T009** | 2 | `build-engineer` | fix | | **As seis dívidas, com `motivo` e `prazo`** (prazo vindo da T002) em `mutation_population.json`. Dono **diferente** do autor do julgador, por R3 §2 — e só agora, com o red já commitado. Os seis: `check_evidence_bridge.py`, `gen_evidence_bridge.py`, `evidence_bridge.json`, `tests_session_m48.js`, `compliance-audit.sh`, `.claude/BACKLOG.md` | fecha `ORF1(b)` |
| **T010** | 2 | `build-engineer` | chore | | **Stage `mutation-coverage` no `pipeline.yaml`** (R10 §9): `parallel`/`mutates`/`heavy` declarados; **não** `heavy` — é node+python, sem chromium, roda no `verify`. `pipeline.yaml` é **pinado** ⇒ repin | stage `baseline` |
| **T011** | 2 | `qa-engineer` | chore | | **Medição autoritativa pós-dívidas**: `bash .claude/verify/run.sh --stage=mutation-coverage` → esperado **7 PASS · 0 FAIL**, com os seis em `[DÍVIDA]` e zero `[FAIL]`. Regressão congelada: `run.sh --light` **13 PASS · 0 FAIL** e `compliance-audit` **17 PASS · 0 FAIL** | `C1`…`C7` |
| **T012** | 2 | `build-engineer` | chore | | **Repin R3** — depois de T009+T010. Mensagem: `chore(018): gen_pins — R3 da serie (dividas, stage no pipeline)` | stage `baseline` |
| **T013** | 3 | `qa-engineer` | chore | | **`tests_018_mutants.js` (novo) — `M1`…`M7`**, um por gate. **Shape copiado de `tests_ea41_instrumento.js`** (cópia de shape, nunca extração de runner comum): âncora casando **1×**, mutação em **cópia efêmera** sob `os.tmpdir()`, SHA-256 do rastreado conferido **antes e depois**, kill exigindo o **sinal declarado** (detecção incidental não é kill). Modo `--preflight` emitindo **um** JSON | R3 §5 |
| **T014** | 3 | `qa-engineer` | chore | | **Entrada `d018` no `mutation_map.json`, no MESMO commit de T013** (`check_mutation.py` recusa a chave sem `preflight`). `cmd: "node tests_018_mutants.js"`, `preflight: true`, `requires: ["node","python"]`, **sem chromium**. `targets`: o julgador, o arquivo de população e o próprio harness. **Sem `insumos`** — o julgador é o **sujeito mutado**, não insumo-oráculo; declarar o contrário é o que o `D017-INS1` recusa (custou uma reprovação no `EA-42`) | stage `mutation` |
| **T015** | 3 | `qa-engineer` | chore | | **Executar a campanha `d018`** com árvore limpa e registrar **por mutante**. Conferir no `--preflight` que **todas** as âncoras casam 1×. Registrar os 7 pares em `mutation-matrix.json`, **expandida e nunca agregada** | stage `mutation` |
| **T016** | 3 | `build-engineer` | chore | | **Repin R4** — depois de T013+T014+T015. Mensagem: `chore(018): gen_pins — R4 da serie (harness d018 e matriz)` | stage `baseline` |
| **T017** | 4 | `qa-engineer` | chore | | **Contagem fixada por execução** em `expected_suites.json` (deixa de ser declarada). Manter o `_trilha` da janela vermelha **sem reescrevê-lo** | stage `suites` |
| **T018** | 4 | `qa-engineer` | chore | [P] | **Pipeline completo local** (`run.sh`) + **`compliance-audit.sh`** — os dois, nunca só o pipeline (lição de 2026-09-11: `compliance-audit` não é stage do `run.sh` e pegou o que o `--light` não pegou) | todos os stages locais |
| **T019** | 4 | `qa-engineer` | chore | | **`spec-validate`** — score; <100% ⇒ classificar e iterar (máx. 2) | Fase 6 |
| **T020** | 4 | `build-engineer` | chore | | **Push + abertura do PR** para `develop` (livre, R14; **merge é do usuário**). Colher do CI os checks obrigatórios `verify`/`visual`/`fecho` e registrar o número do run | job `verify` |
| **T021** | 4 | `doc-writer` | doc | | **`relatorio-final.md`** + `planning-state` para `done` (Fase 6 completa + PR aberto, regra C8 da 016). **Reconferir o `EA-3` por execução** e registrar: o achado fecha **se e só se** o instrumento o nomear | R4 §Fecho |

## Ordem e paralelismo

Serial por medição, salvo `[P]`. A dependência real dita: **regra antes do
julgador** (T003→T004), **julgador antes do red** (T004→T006), **red antes das
dívidas** (T006→T009 — é o que sustenta a R3 §2 nesta demanda), **dívidas antes da
campanha** (T009→T013), **campanha antes da contagem fixada** (T015→T017).

## O que estas tarefas NÃO fazem

Herdado da spec e do plano: não escrevem campanha para os órfãos (cada adoção é
`fix-finding` próprio), não estendem a população a `tests_*.js`, não tocam
`check_mutation.py`, e **não fecham o `EA-3`** — a T021 o reconfere e registra o
veredito, que é do `qa-engineer`, nunca deste documento.
