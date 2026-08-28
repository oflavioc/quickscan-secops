# Tarefas — 012-status-backlog

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Consome [plan.md](plan.md) (aprovado no portão de 2026-08-28, `92b9a68`) e
> [spec.md](spec.md) (`1c06644`); referencia, não repete.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | build-engineer | chore | | **Repin R2** — `gen_pins.py` em commit chore próprio, imediatamente após o commit do portão desta Fase 3 (padrão observado em `0246dfd`/R1), cobrindo `specs/012-status-backlog/tasks.md`. Mensagem: `chore(012): gen_pins — R2 da tabela de repins (Fase 3, tasks.md)` | stage `baseline` (0 divergências · 0 sem pin) |
| T002 | 1 | qa-engineer | **feature** | | **RED — seção `backlog` no `compliance-audit.sh`** (único arquivo tocado): parser T3–T5, saída T9, enumeração da linha 7, mensagens normativas do plan.md §PO-4b (o texto do FAIL ensina a regra do prefixo reservado). Provar o red **contra a árvore real** — `bash .claude/verify/compliance-audit.sh --rule=backlog` → FAIL nomeando EA-1 (`BACKLOG.md` intocado, fixture nenhuma; mecânica T8 da spec). Executar e registrar os cenários nomeados: **BS-2(a-d)** (sem status · fora da forma/vocabulário incl. `abertto`/`pendente`/`Aberto` · duplicado · arquivo ausente), **PO-1** (`resolvido` aceito, não listado), **PO-2** (`transferido` aceito, não listado), **PO-3** (contraprova do refutado assere também `ok "achados abertos: nenhum"`), **PO-4a** (status canônico deslocado → FAIL de posição) — todos em worktree efêmera (R7 §3); saídas viram insumo da matriz (T006). Commit: `test(012): red — BS-3 (secao backlog reprova o EA-1 em prosa)`; planning-state `red.status: proven` com o SHA. **AVISO T8 — não "consertar" o vermelho**: o CI deste commit reprova NO PASSO compliance (`verify.yml:44`) e esse vermelho É o red, referenciado no PR (R14; precedente 008 M-ZB3/M-ZB5); `run.sh --light`/`post-turn-verify` permanecem verdes; o green é exclusivo da wave 2 | BS-1 · BS-2 (+PO-1…PO-4b) · BS-3 (red) |
| T003 | 1 | build-engineer | chore | | **Repin R3** — commit chore próprio imediatamente após o commit red, cobrindo `.claude/verify/compliance-audit.sh`. Mensagem: `chore(012): gen_pins — R3 da tabela de repins (commit red, secao backlog)` | stage `baseline` |
| T004 | 2 | doc-writer | doc | | **GREEN — `.claude/BACKLOG.md`** (único arquivo tocado; o gate viaja no prompt — R3 §3): rito no cabeçalho (T6 — vocabulário, eventos de escrita, regra do prefixo reservado, exemplos **em código indentado, acima do 1.º achado**) + migração da linha 52 para ``**Status**: `aberto` `` (T7 — única linha alterada no bloco EA-1). Conferências: `--rule=backlog` → exit 0 com `EA-1 — …` listado; `git diff` do bloco EA-1 restrito a 1 linha. Commit: `doc(012): green — BS-3/BS-4 — rito no cabecalho + migracao da linha 52` | BS-3 (green) · BS-4 |
| T005 | 2 | build-engineer | chore | | **Repin R4** — commit chore próprio imediatamente após o green, cobrindo `.claude/BACKLOG.md`. Mensagem: `chore(012): gen_pins — R4 da tabela de repins (commit green, BACKLOG.md)` | stage `baseline` |
| T006 | 3 | qa-engineer | chore | | **Campanha de mutantes (R3 §5)**: M-BS1…M-BS4 da spec sobre cópias efêmeras (script mutado/arquivo mutado — nada na árvore real); redigir `specs/012-status-backlog/matriz-gate-mutante.md` (precedente 003/007/008) consolidando mutantes + evidência dos cenários adversariais de T002; revalidar green e regressão: audit **completo** verde, 7 seções irmãs e exit code inalterados. O arquivo da matriz **não é commitado aqui** — entra no commit de fechamento (T010), mantendo a previsão nominal de 5 repins do plano | M-BS1…M-BS4 · regressão de BS-1 |
| T007 | 4 | qa-engineer | chore | | **Validação executável**: skill `verify` (pipeline completo + compliance-audit, contagens citadas) e skill `spec-validate` → `specs/012-status-backlog/spec-validate.md` (score item a item contra a spec; commit junto ao fechamento T010) | pipeline completo · spec-validate |
| T008 | 4 | product-owner | chore | | **Aceite de intenção (Fase 6)**: parecer sobre o resultado (spec-validate + matriz) — reprova ou declara "não encontrei objeção" (R4/D3; agente nunca escreve em registro de aceitação) | portão da Fase 6 (usuário no chat) |
| T009 | 4 | doc-writer | doc | | **Relatório final PT-BR** (`specs/012-status-backlog/relatorio-final.md`, precedente 007/008): o que mudou, gates e mutantes com contagens, os 4 não-bloqueantes do PO fechados (PO-1…PO-4b), desvios da previsão de repins **se houver** (nunca silenciados — plano §Pins) | R12 (revisão humana) |
| T010 | 4 | build-engineer | chore | | **Fechamento + Repin R5 (= BS-5, repin de entrega)**: commit dos artefatos finais (matriz T006, spec-validate T007, relatório T009) seguido do repin em commit chore próprio cobrindo-os. Mensagem: `chore(012): gen_pins — R5 da tabela de repins (fechamento; BS-5)`. Asserção final: stage `baseline` **0 divergências · 0 rastreado-sem-pin** | **BS-5** · stage `baseline` |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## Notas de tipagem (auditáveis — R3 §Tipagem)

- **T002 `feature`**: a seção `backlog` é **gate novo** (R10 §9 — checagem em
  executável versionado rodado pelo CI; o audit é o gate da INV-10) → red real
  obrigatório, provado contra o EA-1 como está e **commitado** (R3 §4). Autor do
  gate = `qa-engineer`; quem produz o green é outro agente em outro arquivo
  (T004) — separação de poderes preservada (R3 §2; nota do plan.md §Waves).
- **T004 `doc`**, defendido: não cria comportamento nem gate — edita um documento
  de governança Markdown (rito + 1 linha migrada) cuja correção é provada pelo
  gate **já red-provado** de T002 (BS-3), que viaja no prompt. `doc` não exige
  red (R3), e o red desta demanda existe e cobre exatamente esta mudança — a
  tipagem não abre válvula nenhuma. Análogo ao green-por-publicação da 008
  (tarefa chore provada por ZB-3).
- **T006 `chore`**: campanha da feature T002 (R3 §5), não gate novo próprio.
- **Repins (T001/T003/T005/T010) `chore`**: rito R8 §1; o esquecimento é FAIL
  automático do stage `baseline`, não depende de disciplina.

## Sequência e paralelismo

Nenhuma tarefa recebe `[P]`: as dependências são reais e lineares — repin depende
do commit que o motiva; green depende do red (R3 §1); mutantes dependem do green;
T007→T008→T009→T010 encadeiam (aceite consome spec-validate; relatório consome o
aceite; fechamento consome tudo). Waves 0→4 estritamente sequenciais, como no
plan.md §Waves. Falha de uma tarefa não derruba as anteriores; máx. 3 tentativas
→ escalar (R5 §Waves).

## Mapa de cobertura (para o portão — nenhum critério órfão)

| Critério/cenário | Tarefa que o prova |
|---|---|
| BS-1 (seção lista abertos; regressão das 7 irmãs) | T002 (nasce) · T006 (regressão) · T007 (pipeline) |
| BS-2 (4 violações de forma) + PO-1/PO-2/PO-3/PO-4a | T002 (execução) · T006 (registro na matriz) |
| BS-3 (red natural + green de 1 linha) | T002 (red) · T004 (green) |
| BS-4 (rito com auto-exclusão) | T004 (instala) · T006 (M-BS4 prova o escopo de bloco) |
| BS-5 (identidade coerente no fechamento) | T010 (+ T001/T003/T005 ponto a ponto) |
| PO-4b (mensagens que ensinam a regra) | T002 (implementa os textos do plan.md) · T006 (assere na matriz) |
| M-BS1…M-BS4 | T006 |
