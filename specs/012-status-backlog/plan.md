# Plano — 012-status-backlog

> Fase 2 · dono: tech-lead · consome a spec aprovada (portão de 2026-08-28,
> commit `1c06644`). Referencia [spec.md](spec.md) (T1–T9, BS-1…BS-5) e
> [refinement.md](refinement.md); não os repete.

## Desenho

**Camada e superfície**: processo de auditoria, exclusivamente — nenhum byte de
produto (engine, Camada 1, HTML, módulos de UI, suítes `tests_*.js`). Dois
arquivos de governança mudam, cada um com **um dono**:

| Arquivo | Mudança | Dono |
|---|---|---|
| `.claude/verify/compliance-audit.sh` | seção `backlog` (parser T3–T5, saída T9) + enumeração da linha 7 | `qa-engineer` (é gate — R10) |
| `.claude/BACKLOG.md` | rito no cabeçalho (T6) + migração da linha 52 (T7) | `doc-writer` (mantenedor declarado, `BACKLOG.md:3`) |

Nenhum módulo novo, nenhum arquivo novo fora de `specs/012-status-backlog/`.
A seção `backlog` segue a anatomia das 7 seções irmãs: bloco `if secao backlog`,
parser em heredoc Python (padrão das seções `deny`/`invariantes`/`suites`),
`ok`/`falha` da lib do próprio script, exit code inalterado (= contagem de FAIL,
linha 136).

**Dado novo e owner do estado (R9 §5, por analogia — não é estado de runtime)**:
a linha de status é dado durável cujo dono é o `doc-writer`, que a escreve
apenas nos eventos do rito (abertura → `aberto`; fix-finding §4 → `resolvido`;
fix-finding §1 → `refutado`; migração R12/R13 → `transferido`). O
`compliance-audit` é o **único leitor de máquina** (R7 §3 — só lê) e nenhum
outro consumidor nasce nesta demanda (fora de escopo da spec).

### Cobertura adicional da Fase 4 — os 4 não-bloqueantes do parecer do PO

Rota escolhida: **absorver aqui e no tasks.md** (a spec aprovada não é
emendada). O `qa-engineer` recebe estes cenários **nomeados**, somados aos 4 de
BS-2; nenhum altera a gramática nem o conjunto fechado de falhas — só fecham
cobertura de execução:

| id | Cenário (cópia mutada em worktree efêmera, exceto PO-4b) | Asserção |
|---|---|---|
| **PO-1** | Achado com ``**Status**: `resolvido` `` | audit **exit 0**; achado NÃO listado (só abertos listam — T9). Fecha a aceitação positiva de `resolvido`, que nenhum BS-\* exercitava |
| **PO-2** | Achado com ``**Status**: `transferido` `` | idem — fecha o 4.º valor do vocabulário. Com BS-1 (`aberto` real) e a contraprova do refutado em BS-2, os **4 estados têm aceitação provada** — um typo na alternância do `fullmatch` deixa de passar despercebido |
| **PO-3** | A contraprova do refutado de BS-2 (EA-1 riscado, status `refutado` → zero abertos) passa a **asserir também a saída** `ok "achados abertos: nenhum"` | o ramo da borda 3 executa e é conferido — não fica ramo morto |
| **PO-4a** | Linha de status **canônica porém deslocada**: prosa como primeira linha não vazia do bloco, status válido mais abaixo | **FAIL** T5-(a) nomeando o id — fecha a segunda metade da asserção de posição |
| **PO-4b** | **Contrato da mensagem de erro** (detalhe de implementação fixado aqui, a pedido do PO): toda `falha` da seção cita id (quando há) e causa; a de T5-(b) e a de T5-(c) **ensinam a regra do prefixo reservado**. Textos normativos abaixo | o cenário (b) de BS-2 assere que a mensagem contém o vocabulário e a menção ao prefixo reservado |

Mensagens normativas da seção (INV-10: valores exatamente como no source):

- T5-(a): `EA-x: sem linha de status na posição canônica (primeira linha não vazia após o heading)`
- T5-(b): ``EA-x: linha de status fora da forma/vocabulário: "<linha encontrada>" — vocabulário: `aberto`|`resolvido`|`refutado`|`transferido`; dentro de bloco de achado, linha iniciando com **Status é reservada à gramática (rito no cabeçalho do BACKLOG.md)``
- T5-(c): `EA-x: linha de status duplicada — **Status em coluna 0 dentro de bloco é reservado; mova a prosa ou indente o exemplo (rito no cabeçalho)`
- arquivo: `BACKLOG.md ausente — arquivo pinado, pré-condição da R12`

Racional do PO-4b, registrado: a armadilha do prefixo `^\*\*Status` é real — o
estilo da casa usa `**Decisão**:`/`**Efeito**:` em coluna 0 — e foi aceita por
desenho ("entre incomodar o escritor e silenciar o registro, incomodar o
escritor"); quem cair nela aprende a regra **pelo erro**, não por arqueologia.

## Contratos e registros

- **Bridges**: nenhuma entrada nova/alterada em `bridges.json` — não há módulo
  de runtime.
- **Patch-points**: nenhum. Nenhum monkey-patch; a seção nova é bloco aditivo no
  script, sem tocar as seções irmãs (regressão asserida em BS-1).
- **Ordem de injeção no builder**: não se aplica (builder não é tocado).
- **Pins (R8 §1)** — política desta demanda, com previsão **nominal** do número
  de repins (aprendizado da 008, onde 3 execuções contra 1 prevista viraram
  ressalva em `design-decisions.md`): *todo commit que altera pinado ou
  adiciona arquivo rastreado novo leva `gen_pins.py` no próprio commit*, para o
  stage `baseline` ficar verde em cada ponto auditável do PR — exceto o estado
  intermediário deliberado do red, que é vermelho **no passo compliance, não no
  baseline**. Previsão:

| # | Commit | Repin cobre |
|---|---|---|
| R1 | portão da Fase 2 (este `plan.md`) | `specs/012-status-backlog/plan.md` |
| R2 | portão da Fase 3 (`tasks.md`) | `specs/012-status-backlog/tasks.md` |
| R3 | commit **RED** (seção `backlog` no audit) | `.claude/verify/compliance-audit.sh` + artefato de red |
| R4 | commit **GREEN** (rito + linha 52 do `BACKLOG.md`) | `.claude/BACKLOG.md` |
| R5 | fechamento (matriz de mutantes, spec-validate, relatório) — **é o repin de entrega do BS-5** | artefatos finais de `specs/012-status-backlog/` |

  Desvio dessa previsão (commit extra, iteração de validação) repete a regra —
  repin no próprio commit — e é registrado no relatório final, não silenciado.
  Nota de estado: a divergência de baseline herdada da Fase 0
  (`CONTEXT.md`/`refinement.md`) está sendo sanada pelo `build-engineer` em
  repin próprio na branch — **fora deste plano**; BS-5 segue asserindo o estado
  final (0 divergências · 0 rastreado-sem-pin).

## Boundary

**Classe tocada mais alta: nenhuma.** Confirmado por leitura do
`boundary.json` nesta Fase 2: `frozen` (4 paths de produto), `generated` (2),
`legacy` (2) e `registry` (1) não contêm `BACKLOG.md`, `compliance-audit.sh`,
`CONTEXT.md` nem `specs/**`. O fato de `compliance-audit.sh` ser o gate da
INV-10 (`invariants.json:55`) não o torna protegido — a proteção que incide é a
R10 §1 (nada enfraquecido; asserida como regressão em BS-1), e o mapa
invariante→gate fica byte-idêntico. `pins.json` (classe `registry`) é tocado
**exclusivamente pelo seu próprio rito** — `gen_pins.py`, mesmo PR, motivo no
commit (tabela acima) — o que é cumprimento, não PARADA.

## Checklist R9 (módulo novo)

Não se aplica — nenhum módulo de produto é criado ou tocado (sem IIFE, bridge,
CSS, innerHTML ou orçamento de linhas em questão). Registrado para auditoria do
checkpoint.

## Waves

Red antes da implementação (R3 §1-§4); um módulo por delegação (dois donos,
nunca no mesmo arquivo na mesma wave); última wave é validação.

| Wave | Tarefas (resumo) | Dono | Depende de |
|---|---|---|---|
| 1 | **RED**: escrever a seção `backlog` (T3–T5, T9, mensagens PO-4b); executar `--rule=backlog` contra a árvore **real** → FAIL nomeando EA-1 (BS-3 red, mecânica T8 — `BACKLOG.md` intocado, fixture nenhuma); registrar a saída (R2 §1); rodar os 4 cenários adversariais de BS-2 + PO-1/PO-2/PO-3/PO-4a em worktree efêmera; **commit red + repin R3**; planning-state `red.status: proven` | `qa-engineer` | aprovação do plano e do tasks.md (portões) |
| 2 | **GREEN**: rito no cabeçalho do `BACKLOG.md` (T6 — exemplos indentados, acima do 1.º achado) + migração da linha 52 (T7 — única linha do bloco EA-1); `--rule=backlog` → exit 0 com `EA-1 — …` listado; `git diff` do bloco restrito a 1 linha; **commit green + repin R4** | `doc-writer` | wave 1 (o gate viaja no prompt — R3 §3) |
| 3 | **Mutantes** (R3 §5): M-BS1…M-BS4 sobre cópias efêmeras do script/arquivo; matriz registrada em `specs/012-status-backlog/matriz-gate-mutante.md` (precedente 003/007/008); revalidação green + regressão (7 seções irmãs e exit code inalterados; audit completo verde) | `qa-engineer` | wave 2 |
| 4 | **Validação e entrega**: skill `verify` (pipeline + audit completos); `spec-validate` (Fase 6); aceite de intenção do PO; relatório final PT-BR; **repin R5 = BS-5** (0 divergências · 0 sem-pin) | QA + PO + `doc-writer` + `build-engineer` (repin) | wave 3 |

Waves 1→4 são estritamente sequenciais (dependência real: gate → green →
mutante → validação); não há paralelismo interno que justifique `[P]` — a
matriz final é do `tasks.md` (Fase 3).

## Riscos e rollback

| Risco | Detecção (gate) | Reversão |
|---|---|---|
| CI vermelho no commit red (passo compliance, `verify.yml:44`) ser lido como quebra | É o **red nomeado** no PR (T8; precedente 008 M-ZB3/M-ZB5); `run.sh --light`/`post-turn-verify` ficam verdes (audit não é stage do `pipeline.yaml`) | `git revert` do commit red (seção é bloco aditivo; reverte limpo) |
| Regex reprovar/aceitar errado um achado futuro legítimo | Cenários BS-2 + PO-1…PO-4a cobrem os 4 estados, near-miss, posição e duplicata; M-BS2 mata o parser frouxo | Ajuste de parser é demanda/fix próprio — gatilho de reabertura já registrado no refinamento (parse quebrado em uso real) |
| Escritor futuro tropeçar no prefixo reservado (`**Status` em prosa) | O próprio FAIL ensina a regra (mensagens PO-4b) — desenho aceito pelo PO | Nenhuma — comportamento desejado |
| Repin fora da previsão R1–R5 | Stage `baseline` FAIL (divergência ou rastreado-sem-pin) — impossível de silenciar (R8 §1) | Repin no próprio commit do desvio + registro no relatório final |
| Seção nova alterar comportamento das 7 irmãs | Regressão de BS-1 (execução completa, PASS das demais inalterado) + M-BS1 | Revert do commit red/ajuste na wave 1 — nunca afrouxar (R10 §1) |

## Protótipo

Nenhum. A única questão "que só código responde" — as regexes T3 casarem
exatamente o arquivo real e reprovarem a linha 52 atual — é respondida pelo
próprio **red da wave 1** contra o `BACKLOG.md` verdadeiro, sem custo de branch
`prototype/*`; qualquer surpresa ali volta a este plano antes do green.
