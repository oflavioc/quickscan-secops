# Plano — 013-integridade-da-campanha

> Fase 2 · dono: tech-lead · consome a spec aprovada (portão de 2026-08-29 sob
> delegação, commit `a052617` + repin `fa9ffb9`). Referencia
> [spec.md](spec.md) (T1–T13, IC-1…IC-8, C1–C4) e [refinement.md](refinement.md);
> não os repete. Nada aqui redecide o que a Fase 1 fixou.

## Desenho

**Camada e superfície**: o **instrumento de prova**, exclusivamente — harnesses
de mutação, o stage `mutation` e a declaração canônica. **Zero byte de produto**
(engine, Camada 1, HTML gerado, módulos `ui_*`, `USER_GUIDE.md`), zero suíte de
gate editada, nenhum módulo novo. Nenhum arquivo novo fora de
`specs/013-integridade-da-campanha/`.

### Um dono por arquivo

| Arquivo | Mudança | Dono | Waves |
|---|---|---|---|
| `.claude/verify/check_mutation.py` | seção de integridade (IC-1/IC-4/IC-5/IC-6 + consumidor de C1) e, depois, o green de IC-2 (`have()` real + seam `MUTATION_PY`, T1/T2) | `qa-engineer` (é o **julgador** — R10) | W1, W2 |
| `tests_p51_mutants.js` | E1: T1 + T3 (**cria** a plumbing `env`) + T4/T5 + T6 | `build-engineer` | W3 |
| `tests_p51_mutants.js` | E2: reancoragem das quatro âncoras (T9) | `qa-engineer` | W6 |
| `tests_p50_mutants.js` | E1: T1 + T4/T5 + T6 e, em commit próprio, T3 (**26** filtros) | `build-engineer` | W4 |
| `tests_p52_mutants.js` | E1: T1 + T4/T5 + T6 (T3 já cumprida) | `build-engineer` | W5 |
| `.claude/verify/mutation_map.json` | `preflight: true` por harness (no commit do próprio harness) + `targets` da `p51` (T11) | `build-engineer` | W3, W4, W5 |
| `.claude/verify/mutation-matrix.json` | pares da P51 (C3) + dívidas declaradas (T12/T13) | `qa-engineer` | W8 |
| `specs/013-…/matriz-gate-mutante.md` | triagem escrita **antes** da edição (T9), provas, classificação | `qa-engineer` | W6, W7 |
| `.claude/BACKLOG.md` | EA-4/EA-5/EA-6 — **condicional** ao PR #28 em `develop` | `doc-writer` | W8 |
| `.claude/verify/pins.json` | regenerado por `gen_pins.py`, no commit que altera pinado | `build-engineer` | todas |

`tests_p51_mutants.js` tem **dois donos** e por isso aparece em **W3 (build)** e
**W6 (qa)** — nunca na mesma wave (R5 §waves, fixado na Fase 1).

### Owner do estado (R9 §5)

Nenhum dado de runtime nasce (nenhum bridge, nenhum `window.__*`, nada em
`bridges.json`). Por analogia, os três dados novos e seus donos:

| Dado | Owner (quem escreve) | Consumidor único |
|---|---|---|
| JSON do preflight (C1) | cada harness, no seu próprio arquivo | `check_mutation.py` (só lê — R7 §3) |
| `preflight: true` no mapa (C2) | `build-engineer` | `check_mutation.py` |
| pares da P51 e `classificacao` (C3) | `qa-engineer` | `check_mutation.py` (IC-5) e `check_tdd.py` (estrutura) |

### Onde o preflight nasce, e por que aí

O preflight é a peça que troca "confiar no CI" por "medir localmente". Ele nasce
**na W3**, na `p51` — a primeira wave que toca harness. A partir desse commit,
com **node e python apenas**, o comando

    MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py

mede as asserções de integridade e **nomeia** as quatro âncoras podres, enquanto
delega a campanha Chromium por nome (o seam já existe, `check_mutation.py:69-71`
— não se inventa mecanismo). É esse comando que torna o red de E2 **local e
medido**, e não uma alegação sobre o CI.

Ordem deliberada: **o consumidor nasce antes do produtor**. A W1 escreve em
`check_mutation.py` a asserção "os harnesses `p50`/`p51`/`p52` devem declarar
`preflight: true` e responder ao contrato C1" — que hoje **reprova nomeando os
três**, porque nenhum responde. A ausência do instrumento honesto é, ela mesma,
o defeito; e o green da W3 (o preflight da `p51`) **produz** imediatamente o red
seguinte (IC-4 acusando as quatro âncoras). É a cadeia causal do refinamento —
"E1 é pré-condição de medir E2" — realizada em commits, não em prosa.

### Decisões de desenho que esta fase acrescenta (sem redecidir a spec)

| id | Decisão | Por quê |
|---|---|---|
| **D1** | **Filtro que não seleciona gate nenhum é `NÃO EXECUTADO · gate não pôde ser executado`** — nunca `SOBREVIVENTE`. Ao migrar `P50_ONLY=<gate>` para `envOverride`, o harness confere que a saída traz uma linha (`PASS` ou `FAIL`) do gate esperado; se não traz, o gate não rodou. | É o modo de falha real da migração dos 26 filtros: um id digitado errado faz a suíte rodar zero gates, sair 0, e o mutante ser lido como sobrevivente. A causa já está no vocabulário fechado de T4 — esta decisão diz **onde** ela se aplica. Sem D1, a W4 dependeria de uma linha de base de campanha que **não é obtenível** (ver Riscos). |
| **D2** | **A seção de integridade reporta por asserção** (`[OK] IC-1: …` / `[FAIL] IC-4: M51-03 · âncora não encontrada em ui_p50_shell_v32.js`), nunca um agregado. | Entre W3 e W6 o stage fica legitimamente vermelho por IC-4. Sem relato por asserção, esse vermelho esconde o verde das outras — o colapso de estados que a demanda existe para matar, um nível acima. |
| **D3** | **Rito de medição local**: `MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py`. Verificado nesta fase: **não há Chromium nesta máquina** (`env_doctor.py`, 1 WARN nominal). | Sem a env, a ausência de Chromium vira `[FAIL]` de ambiente e mistura-se ao FAIL das asserções. Com ela, campanha vira `[DEFER]` **nomeado** e as asserções ficam legíveis. É uso previsto do seam (`:65-71`), não atalho. |
| **D4** | **`preflight: true` é registrado no MESMO commit** em que o harness ganha o modo. | Registro antes/junto do consumo (R5 §waves). Registrar os três no fim atrasaria a medição de `p50`/`p52` até a última wave de E1 — exatamente o "chegar tarde" que o portão desta fase proíbe. |
| **D5** | **Três das quatro provas de E2 são locais.** `M51-03` (`P51-UX2`), `M51-18` (`P51-RPT6`) e `M51-20` (`P51-DOC13`) invocam `node tests_p50_core.js` — node+python bastam, e o harness já filtra por mutante (`MUT_ONLY`, `tests_p51_mutants.js:191`). Só `M51-16` (`P51-PDF1`, `tests_p50_chromium.js`) depende de Chromium. | Confirma que a reancoragem não é ato de fé: 3/4 das provas (b) e (c) de T9 são medidas na W6, na worktree local; a de `M51-16` é declarada `NÃO EXECUTADO` local e medida no job `visual`. Honestidade do relato > paridade de execução (KI-3). |
| **D6** | **`--preflight` é argv**, não env. Verificado: **nenhum** dos quatro harnesses lê `process.argv` — zero risco de colisão. | O espaço de env já está ocupado pelo filtro por mutante, com nomes divergentes entre harnesses (`MUT_ONLY` em p50/p51, `P52_MUT_ONLY` em p52, `:1348`); argv não herda de processo pai nem é ambíguo. |

### Disciplina de execução (o que a 009 pagou, escrito como regra)

1. **Um escritor por vez na worktree.** Nenhuma wave deste plano tem duas
   delegações de escrita simultâneas. `[P]` aparece **uma única vez** (W8), entre
   dois arquivos que **não medem nada** (matriz × `BACKLOG.md`).
2. **Medição só em árvore limpa, depois do commit.** Não é disciplina pedida a um
   agente: `check_mutation.py:39-44` **recusa** rodar com `git status` sujo. Quem
   tentar medir enquanto alguém escreve recebe `[FAIL] árvore suja`, não um
   número errado. É a garantia estrutural contra o modo de falha da 009 — e mais
   uma razão para nunca paralelizar escrita e medição.
3. **Campanha depois de cada correção, não uma vez no fim.** Cada wave que toca
   harness fecha com: (i) preflight + seção de integridade **locais** (D3) e
   (ii) push, que torna aquele harness "exigido" (cada harness está nos próprios
   `targets`) e faz o job `visual` rodar **a campanha daquele harness** naquele
   commit. Quatro medições de campanha ao longo do PR (W3, W4, W5, W6), nunca uma
   auditoria acumulada no fim.
4. **Adversariais e neutralização em worktree efêmera** (T10) — a árvore real
   nunca é mutada por prova, e `git stash` não é mecanismo de isolamento.

## Contratos e registros

- **Bridges**: nenhuma entrada nova ou alterada em `bridges.json` — não há módulo
  de runtime.
- **Patch-points**: nenhum. Nenhum monkey-patch; a seção de integridade é bloco
  aditivo em `check_mutation.py`, e o `--preflight` é modo novo dentro de cada
  harness, sem alterar o caminho da campanha.
- **Ordem de injeção no builder**: não se aplica — `build_v32_html.py` não é
  tocado; é **invocado** pelos harnesses, com o nome do interpretador resolvido
  por T1 e o caminho entre aspas (R10 §7).
- **Pins (R8 §1)** — política: *todo commit que altera arquivo pinado ou adiciona
  rastreado novo leva `gen_pins.py` no próprio commit*, para o stage `baseline`
  ficar verde em cada ponto auditável do PR (precedente 012; a 008 virou ressalva
  por prever um repin e executar três).

| # | Commit | Repin cobre |
|---|---|---|
| R1 | portão da Fase 2 (este `plan.md`) | `specs/013-…/plan.md` |
| R2 | portão da Fase 3 (`tasks.md`) | `specs/013-…/tasks.md` |
| R3 | **RED** (W1) | `.claude/verify/check_mutation.py` + artefato de red |
| R4 | green de IC-2 (W2) | `.claude/verify/check_mutation.py` |
| R5 | E1 `p51` (W3) | `tests_p51_mutants.js` + `.claude/verify/mutation_map.json` |
| R6 | E1 `p50` — **dois** commits (W4) | `tests_p50_mutants.js` (×2) + `mutation_map.json` |
| R7 | E1 `p52` (W5) | `tests_p52_mutants.js` + `mutation_map.json` |
| R8 | E2 (W6) | `tests_p51_mutants.js` + `matriz-gate-mutante.md` |
| R9 | E3/E4 (W7–W8) | `.claude/verify/mutation-matrix.json` + `matriz-gate-mutante.md` + (condicional) `.claude/BACKLOG.md` |
| R10 | fechamento (W9) | artefatos finais de `specs/013-…/` |

  Desvio da previsão repete a regra — repin no próprio commit — e é **registrado
  no relatório final**, não silenciado.

  **Correção à tabela de pins da spec** (constatada nesta Fase 2, por leitura):
  a spec registra `.claude/verify/mutation-matrix.json` como "fora do registry";
  ela **é pinada**, em `pins.json:82`. As exclusões declaradas em
  `_meta.exclusoes` são `docs_phase5/**`, `.claude/project-memory/**`, `*.zip` e
  o próprio `pins.json`. Consequência operacional: **R9 cobre a matriz**. Nenhuma
  decisão muda; o executor segue esta tabela.

- **O que dispara campanha (trigger por path)**: cada harness está nos próprios
  `targets`, então **tocar um harness exige a campanha dele** naquele commit.
  `check_mutation.py`, `mutation_map.json` e `mutation-matrix.json` **não** estão
  em `targets` de ninguém — W1, W2 e W8 não disparam campanha. O `core` nunca é
  exigido nesta demanda: seus alvos (`ui_session_v32.js`, `ui_v32.js`,
  `ui_refinement_v32.js`, `tests_core_mutants.js`) não são tocados — e é por isso
  que a dívida de T8 é **impressa**, e não presumida.

## Boundary

**Classe tocada mais alta: nenhuma.** Reconferido nesta Fase 2 por leitura de
`boundary.json`: `frozen` (4 paths de produto), `generated` (2), `legacy` (2) e
`registry` (1) não contêm nenhum harness, nem `check_mutation.py`, nem
`mutation_map.json`, nem `mutation-matrix.json`, nem `BACKLOG.md`, nem
`specs/**`. Os quatro harnesses também não estão em `PROTECTED`
(`tests_p50_core.js:82-229`) nem em `frozenSuites` (`:235-238`). Edição livre
**com repin no mesmo PR**. `pins.json` (classe `registry`) é tocado
exclusivamente pelo seu próprio rito — `gen_pins.py`, mesmo commit, motivo na
mensagem — o que é **cumprimento, não exceção**.

A prova (c) de T9 exige neutralizar uma asserção de `tests_p50_core.js`, que a
prosa da §29.4 alcança (tensão EA-1, `fix-finding` já encomendado, R13). O plano
**não a toca**: a neutralização acontece em **worktree efêmera** (T10). Nenhuma
PARADA, e **nenhum ponto deste plano pede ratificação do proprietário**.

## Checklist R9 (módulo novo)

**Não se aplica** — nenhum módulo de produto é criado ou tocado; o `--preflight`
é modo novo dentro de arquivo existente, não módulo. Registrado para auditoria do
checkpoint: sem IIFE/bridge/CSS/`innerHTML`/orçamento de linhas em questão.
A proibição de R9 que **incide** é a de não extrair runner compartilhado: três
edições paralelas do mesmo *shape*, com `tests_core_mutants.js:22,66-68` como
referência do eixo do interpretador e `tests_p52_mutants.js:86-91,1374` como
referência do eixo do prefixo.

## Waves

Dependência real dita a ordem: gate antes de implementação; registro antes do
consumo; contrato antes do consumidor. Waves **estritamente sequenciais** — a
única marca `[P]` está na W8. Última wave é validação.

| Wave | Tarefas (resumo) | Dono | Depende de |
|---|---|---|---|
| **W1** | **RED do julgador**: seção de integridade em `check_mutation.py` — IC-1 (varredura por propriedade, classe `[A-Za-z_][A-Za-z0-9_]*=`, auto-exclusão nominal R10 §10), consumidor de C1 + IC-4, IC-5, IC-6, e o cenário adversarial de IC-2 (`MUTATION_PY=<inexistente>`); relato **por asserção** (D2). Executar e registrar os FAIL nomeados; **commit red + R3**; `planning-state.red.status: proven` | `qa-engineer` | portões do plano e do `tasks.md` |
| **W2** | **Green de IC-2**: `have("python")` resolve de verdade o binário de T1, com o seam `MUTATION_PY`; `DEFER`/`FAIL` de `:69-75` preservados; dívida do `core` impressa (T8) | `qa-engineer` | W1 (red commitado) |
| **W3** | **E1 `p51`** (o crítico): T1 (PY + aspas) · T3 — **cria** a plumbing `SUPPRESS`/`envOverride`, os 20 prefixos saem dos `cmd` · T4/T5 (três estados, causa nomeada, sem razão `D/T` quando `U>0`) · T6 (`--preflight`, C1) · D1 · `preflight: true` **e** `targets` reconciliados (T11) no mesmo commit | `build-engineer` | W2 |
| **W4** | **E1 `p50`**, dois commits: (a) T1 · T4/T5 · T6 · D1 · flag no mapa; (b) **tarefa própria** — os **26** filtros `P50_ONLY=` migram para o `envOverride` que o runner já aceita (`:99`, hoje chamado puro em `:793`) | `build-engineer` | W3 (o *shape* da `p51` é a referência viva) |
| **W5** | **E1 `p52`**: T1 · T4/T5 · T6 · flag no mapa (T3 já cumprida — 0 prefixos, `envOverride` em uso) | `build-engineer` | W4 |
| **W6** | **E2 — triagem e reancoragem das quatro**: as 3 perguntas respondidas **por escrito antes de editar** em `matriz-gate-mutante.md`; reancoragem com as 3 provas de T9 — (a) `ocorrencias == 1` pelo preflight; (b) morte pelo gate e motivo esperados; (c) **sobrevivência** com a asserção neutralizada, em worktree efêmera. `M51-03`/`M51-18`/`M51-20` medidos **localmente** (D5); `M51-16` declarado `NÃO EXECUTADO` local e medido no job `visual` | `qa-engineer` | W5 (E1 completa — o critério é de família) |
| **W7** | **E3 — classificação**: todo mutante que terminar `SOBREVIVENTE` sob o instrumento honesto é classificado no vocabulário fechado (`rot semântica` · `propriedade aposentada` · `gate sem poder discriminante`). O terceiro caso **para a demanda** e vira achado próprio (§Riscos) | `qa-engineer` | W6 + campanhas `p51`/`p52` do job `visual` das waves anteriores |
| **W8** | **E4 — declaração verdadeira**: `mutation-matrix.json` com um par por mutante da P51 (C3), aposentadoria e dívidas registradas (T12/T13). **`[P]`** com: EA-4/EA-5/EA-6 no `BACKLOG.md` — **só se** o PR #28 já estiver em `develop` | `qa-engineer` · `[P]` `doc-writer` | W7 |
| **W9** | **Validação**: skill `verify` (pipeline completo); campanha das três harnesses no job `visual`; `spec-validate` (Fase 6); aceite de intenção do PO; relatório final PT-BR; **repin R10** | QA + PO + `doc-writer` + `build-engineer` | W8 |

**Tipagem prevista** (R3 — a matriz final é do `tasks.md`): W1 `feature` (o red é
provado nela mesma); W2 `fix` (red em W1/IC-2); W3/W4/W5 — `feature` para o
`--preflight` (capacidade nova; red em W1: hoje os três não respondem a C1) e
`fix` para portabilidade, prefixos e três estados (red em W1: IC-1 com **46**
ocorrências medidas + 4 literais `python3` em 3 arquivos); W6 `fix` (red = IC-4
medido na W3); W7 `doc`; W8 `doc` (a matriz **declara**; os `targets`, que são
`fix`, já foram na W3); repins `chore`; W9 `chore`/`doc`. **Nenhum `tdd_waiver`
previsto** — se algum for necessário, entra no `planning-state` com motivo e
data, e o `compliance-audit` o lista (R3 §waiver).

## Riscos e rollback

| Risco | Detecção (gate) | Reversão |
|---|---|---|
| **Vermelho legítimo e prolongado**: da W3 à W6 o stage `mutation` reprova por IC-4 (as quatro âncoras). Ser lido como quebra | Relato **por asserção** (D2) nomeia IC-4 e os mutantes; `run.sh --light` segue verde (o stage é `heavy`); o vermelho é **declarado no PR** — precedente 012/008 | Nenhuma: é o red. Reverter seria apagar a medição |
| **Migração dos 26 filtros com id errado**: gate filtrado não roda e o mutante é lido como sobrevivente | **D1**: sem linha do gate esperado na saída ⇒ `NÃO EXECUTADO · gate não pôde ser executado`. Reforço: campanha `p50` no job `visual` ao fim da W4 | `git revert` do commit (b) da W4 — isolado exatamente para isso |
| **Linha de base de campanha pré-edição não é obtenível**: o job `visual` roda `check_mutation.py` sem `--all` e, antes da edição, nenhum harness é "exigido" (nada em `targets` mudou); localmente falta Chromium; o rito manual depende do proprietário, **ausente** | Registrado, não contornado: a proteção contra regressão é **estrutural** (D1), não comparativa. A primeira campanha honesta de cada harness é a da sua própria wave | — (obter a linha de base exigiria mudar `verify.yml`, **fora de escopo**) |
| **Rot fora das quatro** revelada pelo preflight em `p50`/`p52` | IC-4 nomeia mutante, arquivo e contagem | **Classificar e registrar**, nunca reancorar: E2 é nominal às quatro. Escalar ao orquestrador com a lista (spec §Riscos 1) |
| **Sobrevivente = gate sem poder discriminante** (W7) | Classificação do vocabulário fechado | A demanda **para** nesse ponto: achado `EA-*` + demanda/`fix-finding` próprio. Não se escreve asserção nova sobre produto aqui |
| **PR #28 não chega a `develop` a tempo** | W8 verifica antes de escrever | EA-4/5/6 saem como `DEPENDÊNCIAS` do relatório final; a entrega **não** bloqueia — o que fecha o defeito é o gate, não o id |
| **Repin fora da previsão R1–R10** | Stage `baseline` FAIL (divergência ou rastreado-sem-pin) — impossível de silenciar | Repin no próprio commit do desvio + registro no relatório final |
| **Árvore suja / restauração incompleta** durante campanha | `check_mutation.py:39-44` (pré-condição) e `:92-96` (pós); SHA de restauração nos três harnesses (`p51:206-207`, `p50:808`, `p52:1384`) — **nenhum enfraquecido** (borda 12) | `git checkout --` dos arquivos mutados; a campanha seguinte reprova até a árvore voltar |

## Protótipo

**Nenhum.** A única questão que "só código responde" — se existe recorte único
para a âncora de `M51-18`, dado que o texto natural aparece em `ui_v32.js:131`
**e** `:1026` — é respondida pelo **próprio preflight** (IC-4,
`ocorrencias == 1`) na W6, sem custo de branch `prototype/*` e já no formato que
a entrega consome. Se a W6 descobrir que **não** existe recorte único para alguma
das quatro, isso não é caso de protótipo: é a pergunta 1 da triagem devolvendo
"a propriedade mudou de forma", e o caminho é **voltar a este plano** antes de
qualquer edição.
