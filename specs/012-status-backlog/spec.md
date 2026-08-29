# Spec — 012-status-backlog

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Fixar no `.claude/BACKLOG.md` uma linha de status em **gramática fechada** (4
estados: `aberto` · `resolvido` · `refutado` · `transferido`), migrar o EA-1
para ela, e criar a seção **`backlog`** no `compliance-audit.sh` que **lista os
achados abertos com `ok`** e dá **`fail` só por violação de forma** — com o rito
de escrita documentado no cabeçalho do próprio arquivo.
Link: [refinement.md](refinement.md). As 4 decisões da rodada 1 (Markdown
canônico; 4 estados; ok-lista/fail-forma; pacote completo) estão fechadas no
portão de 2026-08-28 e **não se reabrem aqui** — esta spec só fixa o que o
refinamento delegou à Fase 1: a gramática exata e a mecânica de parse.

## Decisões técnicas fixadas (delegadas pelo refinamento à Fase 1)

| id | Decisão | Justificativa (curta) |
|---|---|---|
| **T1** | **Forma literal da linha de status** (linha inteira, coluna 0, sem espaço à direita): `**Status**: `+ crase +`estado`+ crase — p.ex. ``**Status**: `aberto` `` (sem o espaço final). Rótulo em negrito fechado (`**Status**`), dois-pontos FORA do negrito, um espaço, valor entre **crases**, sem ponto final. Estados em minúsculas, case-sensitive. | Legível por humano (negrito + código, padrão visual do glossário `CONTEXT.md`) e inequívoco para máquina (crase marca o valor como token, não prosa). Deliberadamente **diferente** da prosa atual `**Status: aberto.**` (dois-pontos e ponto dentro do negrito, sem crases) — a diferença é o que torna o EA-1 atual o red natural (borda 9). |
| **T2** | **Posição**: a linha de status é a **primeira linha não vazia após o heading do achado** — e o parser **assere** a posição, não só a presença. | Parse determinístico (um lugar onde olhar) e leitura humana idem (status sempre visível no topo do bloco). O EA-1 já tem essa geometria (heading linha 50, branco 51, status 52) — a migração é diff de 1 linha. |
| **T3** | **Regexes de parse** (Python `re`, linha a linha, após remover só o `\n` — espaço à direita reprova): · **heading de achado**: `^## (?:~~)?(EA-\d+[a-z]?)\b` (tolera título riscado de refutado — R2 §5; captura o id, com sufixo de letra da inserção tardia); · **candidata a status**: `^\*\*Status` ; · **linha canônica** (`re.fullmatch`): ``^\*\*Status\*\*: `(aberto|resolvido|refutado|transferido)`$`` | A regex de **candidata** é o que impede o silêncio por near-miss: `**Status: aberto.**` e ``**Status**: `abertto` `` são candidatas que NÃO casam a canônica → FAIL nomeado, nunca "não vi nada". Prosa que *menciona* um estado no meio da linha ("o achado ficou aberto até…") jamais casa a candidata — ela é ancorada em `**Status` na coluna 0. |
| **T4** | **O que conta como "um achado"**: cada linha que casa o heading de achado (T3) abre um bloco; o bloco termina na próxima linha `^## ` (qualquer heading nível 2) ou no EOF. Subheadings `###` NÃO fecham bloco. As seções do cabeçalho (`## Por que este arquivo…`, `## Namespace de id…`) não casam o heading de achado e ficam fora de qualquer bloco. | Delimitação pelo que já existe no arquivo (EA-1 usa `###` internamente, `##` só para achados e seções de cabeçalho); nenhuma marcação nova inventada. |
| **T5** | **Semântica do parser por bloco**: exatamente **1** linha candidata, ela é a primeira linha não vazia após o heading, e casa a canônica. Violações (cada uma FAIL nomeando o id e a causa): **(a)** zero candidatas ou primeira linha não vazia não-candidata → "sem linha de status na posição canônica"; **(b)** candidata que não casa a canônica → "status fora da forma/vocabulário", citando a linha encontrada; **(c)** 2+ candidatas no bloco → "linha de status duplicada". Nível de arquivo: `.claude/BACKLOG.md` ausente → FAIL (borda 6 — sem ramo gracioso: o arquivo é pinado e pré-condição da R12). | Implementa fechado o conjunto de falhas da decisão 1.3 (sem status · fora do vocabulário · duplicado · arquivo ausente) — nem mais, nem menos. O valor está em **reprovar o que não parseia** (refinamento, §alternativa rejeitada). |
| **T6** | **Auto-exclusão nominal (R10 §10)**, em três camadas: **(i)** escopo de arquivo — o parser lê exclusivamente `.claude/BACKLOG.md` (path literal no script); o próprio `compliance-audit.sh`, esta spec, regras e templates citam exemplos livremente por estarem fora do arquivo varrido, por nome; **(ii)** escopo de bloco — candidatas só contam DENTRO de bloco de achado (T4); os exemplos canônicos do rito vivem no cabeçalho, ANTES do primeiro heading de achado; **(iii)** disciplina de exemplo no cabeçalho — todo exemplo do rito em **código indentado (4 espaços)**, nunca em coluna 0 nem em fence: indentação tira o `^` de heading e de candidata, então nem um exemplo de heading `## EA-*` nem de linha de status pode virar bloco ou candidata fantasma. Dentro de bloco de achado, o prefixo de linha `**Status` é **reservado à gramática** — regra documentada no rito. | Sem (i)-(iii), o scanner reprovaria o próprio rito que o documenta — exatamente o modo de falha que a R10 §10 nomeia. A camada (ii) é provada executável pelo mutante M-BS4. |
| **T7** | **Migração do EA-1**: a linha 52 (`**Status: aberto.**`) é a **única linha alterada no bloco EA-1** — vira ``**Status**: `aberto` `` (sem o espaço final). Título, cadeia, duas faces, tensão, precedente e encaminhamento (~110 linhas) ficam **byte-intactos**. O diff total do `BACKLOG.md` = essa linha + o rito novo no cabeçalho (acima do primeiro achado). | Decisão 1.4: a correção do EA-1 em si está fora; só a gramática do status muda. Byte-intacto é asserção de BS-3 (via `git diff`), não promessa de prosa. |
| **T8** | **Prova do red sem fixture e sem quebrar o `BACKLOG.md`**: o red é a execução da seção nova contra o arquivo **real, como está** — a seção entra no script (commit red), `bash .claude/verify/compliance-audit.sh --rule=backlog` reprova nomeando o EA-1 (a linha 52 atual é candidata que não casa a canônica — T3), saída registrada (R2 §1) e FAIL commitado (R3 §4). O `BACKLOG.md` **não é tocado no red**. Efeito nos demais stages: o audit **não é stage do `pipeline.yaml`** (roda por `verify.yml:44` e pela skill `verify`) → `run.sh --light`/`post-turn-verify` ficam verdes; o CI reprova no passo compliance do commit intermediário — esse vermelho **É** o red, nomeado no PR (precedente 008: M-ZB3/M-ZB5). Cenários adversariais e mutantes rodam sobre **cópia mutada em worktree efêmera** (o audit faz `cd $(git rev-parse --show-toplevel)`, então executa dentro dela) — nada escrito na árvore real (R7 §3; precedente M-ZB4). | Red natural (borda 9) exigido pelo portão; a distinção red-real × adversarial-efêmero mantém a R7 §3 e o backlog íntegro para todos os outros consumidores durante a Fase 4. |
| **T9** | **Saída da seção `backlog`** (padrão das seções vizinhas): sem violação de forma e ≥1 aberto → `ok "achados abertos (N), listados para revisão:"` + linhas `EA-x — <título>` indentadas (mesmo `sed 's/^/       /'` dos waivers, linha 128); zero abertos → `ok "achados abertos: nenhum"` (simetria com waivers:127, borda 3); violação → `falha` única agregando as causas nomeadas (padrão deny/invariantes). `resolvido`/`refutado`/`transferido` **não são listados** — só validados na forma. Enumeração da **linha 7** ganha `backlog` ao final: `hooks, deny, invariantes, suites, paths, known-issues, waivers, backlog`; o filtro `--rule=backlog` funciona automaticamente via `secao()` (linhas 18-21). Exit code continua = contagem de FAIL (linha 136). O total de PASS do audit cresce em 1 — não é contagem pinada em lugar nenhum (verificado: `expected_suites.json` só cobre suítes `tests_*.js`). | Decisão 1.3 fechada; aderência aos precedentes internos do próprio script (waivers = lista-com-ok; known-issues = fail estruturado). |

## Gramática fixada (normativa)

Forma canônica da linha de status, documentada também no rito do cabeçalho do
`BACKLOG.md` (T6-iii — lá, em código indentado):

    **Status**: `aberto`
    **Status**: `resolvido`
    **Status**: `refutado`
    **Status**: `transferido`

- Posição: primeira linha não vazia após o heading `## EA-*` do achado (T2).
- Aceitação: ``re.fullmatch(r"^\*\*Status\*\*: `(aberto|resolvido|refutado|transferido)`$", linha)`` (T3).
- Detecção de near-miss: `re.match(r"^\*\*Status", linha)` (T3) — candidata que
  não casa a aceitação é FAIL, nunca silêncio.
- Um achado = um bloco delimitado por `^## (?:~~)?EA-\d+[a-z]?\b` até o próximo
  `^## ` ou EOF (T4).
- Eventos que escrevem a linha (rito, executado pelo `doc-writer` — mantenedor
  declarado em `BACKLOG.md:3`): abertura de achado → `aberto`; fix-finding §4
  ("o que foi feito", com PR/commit na prosa) → `resolvido`; fix-finding §1
  ("se não reproduz: risque com a razão") → `refutado` (título/corpo riscados,
  linha de status **limpa** — borda 4); migração para `design-decisions.md`
  (R12/R13) → `transferido`, com ponteiro na prosa (borda 8). Fix-finding **em
  curso não muda estado** (decisão 1.2, fechada).

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).
Namespace da demanda: **BS-\*** (backlog-status) — série nova, sem colisão com
EB-\*/ZB-\*/P50-\*/S\*/M-\* existentes (R10: nunca continuar numeração de fase
alheia). Todos os BS-\* executam `bash .claude/verify/compliance-audit.sh
--rule=backlog` (real ou em worktree efêmera — T8), exceto BS-5 (stage
`baseline`).

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| BS-1 | **Seção `backlog` existe, enumerada e lista abertos com `ok`**: enumeração da linha 7 contém `backlog`; `--rule=backlog` executa só ela; na árvore migrada a saída é `[PASS] achados abertos (1), listados para revisão:` + `EA-1 — <título>`, exit 0; as 7 seções preexistentes permanecem com comportamento idêntico (regressão) | `backlog` · `.claude/verify/compliance-audit.sh` · execução completa e filtrada na árvore migrada: seção presente, EA-1 listado, exit 0; execução completa: PASS das demais seções inalterado | **M-BS1**: mutante que suprime o corpo da listagem (ok sem os ids) → caso positivo reprova por saída (EA-1 ausente da listagem); mutante que remove `backlog` do fluxo `secao()` → `--rule=backlog` não emite nada → detectado |
| BS-2 | **Forma fechada reprova — e só ela**: 4 cenários adversariais em worktree efêmera com `BACKLOG.md` mutado: (a) bloco sem linha de status; (b) candidata fora da forma/vocabulário (`abertto`, `pendente`, `Aberto`, prosa antiga); (c) linha de status duplicada no bloco; (d) arquivo ausente — cada um exit ≥1 com `[FAIL]` nomeando id (quando há) e causa (T5). Contraprova: achado `refutado` com título riscado e status limpo → parse verde (borda 4) | `backlog` · `compliance-audit.sh` · 4 execuções adversariais reprovando nomeadamente + 1 contraprova verde, em worktree efêmera (nada escrito na árvore real — R7 §3) | **M-BS2**: afrouxar o vocabulário do parser para `` `(\w+)` `` → cenário (b) `abertto` deixaria de reprovar → morto pelo adversarial; remover a checagem de duplicata → cenário (c) passaria → morto |
| BS-3 | **Red natural provado e migração mínima**: no HEAD pré-migração, a seção reprova o EA-1 (`**Status: aberto.**` é candidata que não casa a canônica) — FAIL executado, registrado e **commitado** (R3 §4) sem tocar o `BACKLOG.md` (T8); green: linha 52 migrada para ``**Status**: `aberto` `` e `git diff` do bloco EA-1 restrito a essa única linha (T7) | `backlog` · `compliance-audit.sh` + `git diff` · red: exit ≥1 nomeando EA-1 no commit red; green: exit 0 e diff do EA-1 = 1 linha | **M-BS3**: reverter a linha 52 para a prosa antiga em cópia efêmera → a seção reprova de novo (o red é reprodutível, não acidente do estado) |
| BS-4 | **Rito no cabeçalho com auto-exclusão executável**: o cabeçalho do `BACKLOG.md` documenta gramática, vocabulário (4 estados), eventos de escrita e a regra do prefixo reservado, com exemplos **só acima do primeiro achado e em código indentado** (T6); o audit passa (exit 0) com esses exemplos literais presentes | `backlog` · `compliance-audit.sh` + leitura do `BACKLOG.md` · árvore migrada exit 0 com o rito instalado; revisão confirma os 5 itens do rito | **M-BS4**: copiar um exemplo de linha de status para dentro do bloco EA-1 (cópia efêmera) → FAIL de duplicata — prova que a exclusão é **escopo de bloco** (T6-ii), não cegueira do parser |
| BS-5 | **Identidade coerente**: `gen_pins.py` no mesmo PR cobrindo `.claude/BACKLOG.md` (pins.json:18), `.claude/verify/compliance-audit.sh` (pins.json:73), `CONTEXT.md` (pins.json:91 — **já divergente desde a Fase 0**, ver seção de pins) e os artefatos `specs/012-status-backlog/*.md` (precedente 007/008: specs são pinadas; o `refinement.md` está rastreado-sem-pin hoje) | `baseline` · `.claude/verify/check_baseline.py` · 0 divergência · 0 rastreado-sem-pin · exit 0 | — (gate existente; o esquecimento é o próprio FAIL do stage — R8 §1) |

**Nascimento de gate (R10)**: positivo = BS-1 (lista na árvore migrada);
negativo = BS-2 (4 reprovas nomeadas); adversarial = M-BS2/M-BS4; regressão =
BS-1 (7 seções preexistentes inalteradas) + contraprova do refutado em BS-2.
Oráculo: entrada-saída sobre arquivo mutado em worktree efêmera — independente
da implementação do parser. Nenhuma asserção existente é enfraquecida (R10 §1):
a mudança fora da seção nova é a enumeração-comentário da linha 7. R10 §9: a
checagem entra num executável versionado e rodado automaticamente
(`compliance-audit.sh`, invocado por `.github/workflows/verify.yml:44` e pela
skill `verify`) — nunca em prompt de agente; o local exato (audit, não
`pipeline.yaml`) é a decisão 1.3 do refinamento, fechada, e é onde as 7 seções
irmãs já vivem.

## Comportamento especificado

Superfície única: o **processo de auditoria** (`compliance-audit.sh` + formato
do `BACKLOG.md` + glossário). Nenhum byte de produto muda (engine, Camada 1,
HTML, módulos, suítes `tests_*.js` — intactos). UNSET/NA/suficiência: não
tocados.

### Casos de borda do refinamento — tratamento nesta spec

| Caso (refinement) | Tratamento |
|---|---|
| 1 — achado sem linha de status | FAIL T5-(a); gate BS-2(a) |
| 2 — fora do vocabulário (`abertto`, `pendente`) | FAIL T5-(b) citando a linha; BS-2(b); case-sensitive (`Aberto` reprova — M-BS3 da 1.ª família coberto em BS-2) |
| 3 — nenhum aberto | `ok "achados abertos: nenhum"` (T9) |
| 4 — refutado riscado | Heading tolera `~~` (T3); linha de status limpa; razão na prosa cobrada por revisão humana, não por regex (R10 §6) — contraprova verde em BS-2 |
| 5 — sufixo de letra (`EA-1a`) | `EA-\d+[a-z]?` no heading (T3) — achado normal |
| 6 — `BACKLOG.md` ausente | FAIL de arquivo (T5), sem ramo gracioso; BS-2(d) |
| 7 — status duplicado | FAIL T5-(c); BS-2(c); prefixo `**Status` reservado dentro de bloco (T6) |
| 8 — transferido | Estado `transferido` na linha; ponteiro para `design-decisions.md` na prosa (revisão humana) |
| 9 — EA-1 atual | Red natural: candidata que não casa a canônica (T1/T3/T8); gate BS-3 |
| 10 — série `E1–E12` | Fora do arquivo, fora do parse (T6-i: escopo nominal é só `.claude/BACKLOG.md`) |

## Contratos

Nenhum bridge de runtime, payload de sessão ou estado de módulo — R9 §5 não se
aplica (nenhum dado vive em produto). O contrato desta demanda é a **gramática
da linha de status** (seção normativa acima): escrita pelo `doc-writer` nos
eventos nomeados do rito (fix-finding §1/§4, migração R12/R13), lida
exclusivamente pela seção `backlog` do `compliance-audit.sh`. Dono do dado: o
próprio `.claude/BACKLOG.md`, mantido pelo `doc-writer` (`BACKLOG.md:3`);
auditor: `compliance-audit` (só leitura — R7 §3). Vocabulário canônico já
registrado no glossário (`CONTEXT.md:140-152`, Fase 0) — esta spec não o altera.

### Arquivos rastreados que mudam (pinados → `gen_pins.py` no MESMO PR)

| Arquivo | Mudança | Pin |
|---|---|---|
| `.claude/BACKLOG.md` | rito no cabeçalho + linha 52 migrada (T6/T7) | `pins.json:18` |
| `.claude/verify/compliance-audit.sh` | seção `backlog` + enumeração linha 7 (T5/T9) | `pins.json:73` |
| `specs/012-status-backlog/*.md` | artefatos da demanda (este arquivo, refinement, e os das fases seguintes) | entram no repin (precedente 007/008) |
| `.claude/verify/pins.json` | regenerado (classe `registry` — só via `gen_pins.py`, motivo no commit) | — |

**Estado já divergente (constatado nesta Fase 1, por hash sobre blobs de
HEAD — R2 §2)**: o commit da Fase 0 (`97cd350`) alterou `CONTEXT.md` e criou
`specs/012-status-backlog/refinement.md` **sem repin** — `CONTEXT.md` em HEAD
tem SHA-256 `51757d57…` contra `bd6c8595…` em `pins.json:91`, e o
`refinement.md` está rastreado-sem-pin. O stage `baseline` está vermelho na
branch por isso, antes de qualquer trabalho da 012. O repin desta demanda
(BS-5), no mesmo PR, sana as duas pendências — R8 §1 é cumprida na letra
("mesmo PR"), e o plan.md decide se cada commit que toca pinado leva repin
próprio (precedente 008: três execuções) ou um repin por wave. `CONTEXT.md`
**não muda mais nesta demanda** (glossário fechado na Fase 0) — só o pin é
atualizado.

**Não mudam**: `expected_suites.json` (o audit não é suíte `tests_*.js`; T9),
`invariants.json` (o mapa INV-10 → `compliance-audit.sh` já aponta para o
arquivo que ganha a seção — nenhuma entrada nova), `boundary.json`,
`known_issues.json` e a seção `known-issues` (natureza distinta — decisão do
refinamento), `pipeline.yaml`/`run.sh` (T8), `.github/workflows/verify.yml`
(já invoca o audit na linha 44), qualquer byte de produto, qualquer suíte.

## Tipagem prevista das tarefas (R3 — a matriz final é do tasks.md)

| Trabalho | Tipo | Red? |
|---|---|---|
| Seção `backlog` no `compliance-audit.sh` (BS-1/BS-2) | **feature** | **Sim** — red natural BS-3 (seção commitada reprova o EA-1 atual), + adversariais em worktree efêmera |
| Migração da linha 52 + rito no cabeçalho do `BACKLOG.md` (BS-3 green/BS-4) | doc (é o green da feature acima — o red já foi provado pelo gate) | Não (provada por BS-3) |
| `gen_pins.py` no mesmo PR (BS-5, incl. pendência da Fase 0) | chore | Não (rito R8; stage `baseline` prova) |
| Matriz de mutantes M-BS1…M-BS4 + relatório | doc/chore | Não |

Separação de poderes (R3 §2): `qa-engineer` escreve a seção-gate e prova o red;
a migração do `BACKLOG.md` (green) é do `doc-writer` (mantenedor declarado);
`build-engineer` executa o repin. **Autor do gate ≠ autor do green** — a divisão
exata é do tasks.md. Nota ao plan: a seção `backlog` é simultaneamente gate e
implementação (é código de auditoria, como as 7 seções irmãs); o red/green
separa-se por **arquivo** (script × BACKLOG.md), preservando a régua "o
implementador nunca escreve o próprio critério".

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** Nenhum byte de produto muda. Única
  tangência: `compliance-audit.sh` é o gate da **INV-10**
  (`invariants.json:55`, verificado por leitura) — o arquivo ganha uma seção,
  nenhuma existente é enfraquecida (R10 §1); o mapa invariante→gate fica
  byte-idêntico. INV-9 intocada (nenhuma classe de boundary tocada).
- [x] **design-decisions.md — nenhum conflito.** Nenhuma linha das confirmadas
  toca `BACKLOG.md`/audit; "planning-state fora do registry" não alcança o
  backlog (que é registro durável pinado por decisão do PR #23, reafirmada no
  refinamento). Nenhuma candidata pendente é tangenciada.
- [x] **Specs validadas anteriores — nenhuma contradição.** 003/007/008 não
  normatizam `BACKLOG.md` nem o audit além de exigi-lo verde
  (`specs/008-migracao-zips/spec-validate.md:26`) — verde permanece o estado
  final pós-green. `PHASE_5_0_REV_B.md` normatiza superfícies de produto, não
  tocadas. Registros selados não são retro-ajustados (R13).
- [x] **Boundary (R6) — nada protegido tocado; nenhuma PARADA.** Nem
  `BACKLOG.md` nem `compliance-audit.sh` nem `CONTEXT.md` pertencem a classe do
  `boundary.json` (frozen/generated/legacy/registry) — edição livre com repin
  (R8 §1). `pins.json` (classe `registry`) só via `gen_pins.py` no mesmo PR,
  motivo no commit — rito seguido, não exceção.
- [x] **R10 — as 10 proibições respeitadas por desenho.** §1 nada enfraquecido;
  §2 sem SKIP silencioso (arquivo ausente = FAIL, borda 6; near-miss = FAIL,
  T3); §3 nenhuma contagem pinada muda (T9); §4 nenhum pin inline; §5 sem
  âncora de regressão nova; §6 o parser lê **dado em gramática fechada de um
  arquivo**, não stdout de suíte nem prosa PT-BR como oráculo (a razão de
  refutação fica com a revisão humana — borda 4); §7 sem processo externo
  novo; §8 adversariais em worktree efêmera, nada escrito em versionado (T8);
  §9 checagem em executável versionado rodado pelo CI, não em prompt; §10
  auto-exclusão nominal em três camadas (T6), provada por M-BS4.

## Fora de escopo

Herdado integralmente do refinamento: a correção do EA-1 em si (fix-finding
próprio, após a 009; as ~110 linhas byte-intactas — T7); `known_issues.json` e
seção `known-issues`; `docs_phase5/REVB_BACKLOG.md` (selado, R13); série
`E1–E12` (documento fundador, externo — T6-i); geração de índice/render
(gatilho de reabertura registrado: ~20 achados ou parse quebrado em uso real);
qualquer byte de produto.

Acrescentado pela spec:

- **Prazo obrigatório e fail-by-age** — rejeitados na decisão 1.3, fechada;
  data de abertura na prosa é recomendação ao `doc-writer`, não asserção.
- **Unicidade de id `EA-*` entre blocos e convenção do título (` — `)** — fora
  do conjunto fechado de falhas da 1.3; ficam com a revisão humana (R12), como
  a razão de refutação e o ponteiro do transferido.
- **Estado para fix-finding em curso** — rejeitado na decisão 1.2, fechada.
- **Qualquer mudança em `pipeline.yaml`, `run.sh`, `verify.yml`,
  `invariants.json`, `expected_suites.json`** (seção "Não mudam").
- **Parse de status por qualquer outro consumidor** — a seção `backlog` é o
  único leitor de máquina; um segundo leitor seria demanda própria.
