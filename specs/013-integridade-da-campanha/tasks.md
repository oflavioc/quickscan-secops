# Tarefas — 013-integridade-da-campanha

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Consome [plan.md](plan.md) (aprovado sob delegação em 2026-08-29, `3888cc0` + repin
> `f0aba70`) e [spec.md](spec.md) (`a052617` + repin `fa9ffb9`, com errata); referencia
> [refinement.md](refinement.md). **Não redecide nada** — as 9 waves, a ordem, o dono por
> arquivo, os dois commits da W4 e a marca `[P]` única vêm do plano.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 1 | build-engineer | chore | | **Repin R2** — `gen_pins.py` em commit chore próprio, logo após o commit do portão desta Fase 3, cobrindo `specs/013-integridade-da-campanha/tasks.md`. Mensagem: `chore(013): gen_pins — R2 da tabela de repins (Fase 3, tasks.md)` | stage `baseline` · IC-7 |
| T002 | 1 | qa-engineer | **feature** | | **RED do julgador** — único arquivo tocado: `.claude/verify/check_mutation.py` (bloco aditivo; nenhum patch-point, nenhum stage novo — T7). Escrever a seção de integridade: **IC-1** (varredura **por propriedade**, classe `[A-Za-z_][A-Za-z0-9_]*=` **com dígito**, e literal de comando `python3`), **consumidor de C1** + **IC-4**, **IC-5** e **IC-6** (ambas **nominais à `p51`**, sem laço genérico — T11/borda 10), e o cenário adversarial de **IC-2** (`MUTATION_PY=<inexistente>`). Relato **por asserção** (`[OK] IC-n: …` / `[FAIL] IC-n: <mutante> · <causa>`), nunca agregado — D2. Roda **depois** da pré-condição de árvore limpa (`check_mutation.py:39-44`) e **antes** do laço de trigger, independente de `requires` (T7). **Auto-exclusão nominal por path (R10 §10)**: `check_mutation.py` **e `specs/013-integridade-da-campanha/**` inteiro** — `plan.md`, este `tasks.md` e a futura `matriz-gate-mutante.md` também carregam os literais proibidos; excluir só a `spec.md` faz o gate falhar em si mesmo na wave seguinte. Executar e registrar os FAIL nomeados (esperado: **46** prefixos — 20 na `p51` + 26 na `p50` — mais os **4** literais `python3` em 3 arquivos · os **três** harnesses sem C1 · `targets` da `p51` divergentes nas duas direções) **e** o cenário **IC-3(a)** em worktree efêmera contra as três harnesses de hoje (veredito + razão `D/T` impressos com interpretador ausente) — IC-3 é **cenário executado**, não asserção nova dentro do `check_mutation.py`. Artefato de red: `specs/013-integridade-da-campanha/red-integridade.md`, no mesmo commit (é o "artefato de red" da tabela R3 do plano). Commit red + `planning-state.red.status: proven` com o SHA. **AVISO**: daqui à W6 o stage `mutation` fica legitimamente vermelho — esse vermelho **é** o red, declarado no PR (R14; precedente 012/008); `run.sh --light` segue verde | **IC-1 · IC-2 · IC-4 · IC-5 · IC-6** (red) · IC-3(a) medido |
| T003 | 1 | build-engineer | chore | | **Repin R3** — commit chore próprio após o red, cobrindo `check_mutation.py` + `red-integridade.md`. Mensagem: `chore(013): gen_pins — R3 da tabela de repins (commit red, secao de integridade)`. Push da branch | stage `baseline` · IC-7 |
| T004 | 2 | qa-engineer | **fix** | | **GREEN de IC-2** — mesmo arquivo, mesmo dono: `have("python")` passa a resolver de verdade (`shutil.which(<nome de T1>)`), com o seam **`MUTATION_PY`** (T1/T2/C4) honrado igualmente aqui e nas harnesses. `DEFER` (`:69-71`) e `FAIL` (`:72-74`) **byte-equivalentes em semântica** — R10 §1, nada enfraquecido. Imprimir a **dívida do `core`** (T8): `[DÍVIDA] core: sem preflight declarado — âncora podre só aparece na execução da campanha`. Provas: adversarial ⇒ exit ≠ 0 + `[FAIL] … ambiente sem python`; mesma execução com `MUTATION_DEFER_MISSING=1` ⇒ `[DEFER]` nomeado, exit 0; execução normal **inalterada** (regressão). Commit: `fix(013): green — IC-2 (have python resolve o binario de T1, seam MUTATION_PY)` | **IC-2** (green) · regressão de `:69-75` |
| T005 | 2 | build-engineer | chore | | **Repin R4** + push. Mensagem: `chore(013): gen_pins — R4 da tabela de repins (green de IC-2)` | stage `baseline` · IC-7 |
| T006 | 3 | build-engineer | **feature** | | **E1 `p51` — o crítico, um único commit** (`tests_p51_mutants.js` + `.claude/verify/mutation_map.json`): **T1** (interpretador de T1 + caminho do script **entre aspas**, R10 §7) · **T3** — **cria** a plumbing `SUPPRESS`/`envOverride` no *shape* de `tests_p52_mutants.js:86-91,1374`, e os **20** prefixos saem dos `cmd` (4 `P50_NO_EVIDENCE=` + 16 `P50_ONLY=`), com a supressão aplicada **por construção a toda execução** (borda 11 / lição B-AUD-503-1) · **T4/T5** (três estados, causa do conjunto fechado, **sem razão `D/T` quando `U>0`**, exit ≠ 0; linha histórica preservada **literalmente** quando `U==0`) · **T6** (`--preflight` **em argv** — D6, JSON único em stdout conforme **C1**, texto humano em stderr, **não muta, não reconstrói, não executa gate, não escreve nada**) · **D1** · e, no **mesmo commit**, `"preflight": true` **e** os `targets` da `p51` reconciliados nominalmente (**T11**: entram `ui_p50_v32.css`, `ui_p50_shell_v32.js`, `ui_journey_v32.js`, `ui_p50_results_v32.js`, `USER_GUIDE.md` + o próprio harness; sai `ui_session_v32.js`). **Sem runner compartilhado** (R9) — cópia de *shape*, nunca extração. Medir **depois do commit**, em árvore limpa (D3). Mensagem: `feat(013): E1 p51 — preflight (C1), interpretador de T1, env sem prefixo, tres estados` | **IC-1 · IC-3 · IC-4 · IC-6** · C1/C2 |
| T007 | 3 | build-engineer | chore | | **Repin R5** (`tests_p51_mutants.js` + `mutation_map.json`) + **push** — o push é o que torna a `p51` "exigida" e faz a campanha dela rodar no job `visual` deste commit. Mensagem: `chore(013): gen_pins — R5 da tabela de repins (E1 p51)` | stage `baseline` · IC-7 |
| T008 | 3 | qa-engineer | chore | | **Medição da W3 (revalidação independente — R3 §2; nada é escrito)**: (i) local, árvore limpa, `MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py` (D3) — os prefixos de IC-1 caem de 46 para 26 (só a `p50`), IC-6 fica verde, e **IC-4 passa a nomear as quatro âncoras podres**: esse FAIL é o **red da W6**, e a saída integral é o insumo de T017; (ii) campanha `p51` no job `visual` do commit pushado, classificada no vocabulário de T4. **Não "consertar" o vermelho de IC-4** — ele é a entrega funcionando | IC-1 · IC-4 (red da W6) · IC-8 (campanha) |
| T009 | 4 | build-engineer | **feature** | | **E1 `p50`, commit (a)** (`tests_p50_mutants.js` + `mutation_map.json`): **T1** · **T4/T5** · **T6** (`--preflight`, C1 — cobre os **53** mutantes) · **D1** · `"preflight": true` no mapa, no mesmo commit (D4). Referência viva do *shape*: a `p51` da W3. **Não** tocar nos 26 filtros aqui — é T011. Medir depois do commit (D3). Mensagem: `feat(013): E1 p50 — preflight (C1), interpretador de T1, tres estados` | **IC-1 · IC-3 · IC-4** · C1/C2 |
| T010 | 4 | build-engineer | chore | | **Repin R6a** (commit (a) da W4). Mensagem: `chore(013): gen_pins — R6a da tabela de repins (E1 p50, commit a)` | stage `baseline` · IC-7 |
| T011 | 4 | build-engineer | **fix** | | **E1 `p50`, commit (b) — o maior diff mecânico da demanda, isolado de propósito**: os **26** filtros `P50_ONLY=` saem dos `cmd` e passam pelo `envOverride` que o runner **já aceita** (`tests_p50_mutants.js:99-101`) e que o laço principal **não usa** (`:793` chama `run(m.cmd)` puro). `P50_NO_EVIDENCE` continua aplicado **por construção**, não por lembrança de autor (borda 11). Cada filtro migrado é conferido por **D1**: se a saída não traz a linha (`PASS`/`FAIL`) do **gate esperado**, o mutante é `NÃO EXECUTADO · gate não pôde ser executado` — **nunca** `SOBREVIVENTE`. Isolado num commit próprio porque a reversão prevista é `git revert` **deste** commit. Mensagem: `fix(013): E1 p50 — 26 filtros P50_ONLY migram do cmd para envOverride` | **IC-1** (zero `cmd` casando `^[A-Za-z_][A-Za-z0-9_]*=`) · **IC-3** (causa `gate não pôde ser executado`) |
| T012 | 4 | build-engineer | chore | | **Repin R6b** (commit (b)) + **push**. Mensagem: `chore(013): gen_pins — R6b da tabela de repins (E1 p50, commit b)` | stage `baseline` · IC-7 |
| T013 | 4 | qa-engineer | chore | | **Medição da W4** (nada escrito): local (D3) — os prefixos de IC-1 vão a **0** (o eixo do interpretador só zera na W5, com a `p52`); preflight da `p50` sobre os 53, com **rot fora das quatro** (se houver) **classificada e registrada, nunca reancorada** (spec §Riscos 1 — escalar ao orquestrador com a lista). Campanha `p50` no job `visual` do commit (b): é ela que prova a migração dos 26 filtros; qualquer id digitado errado aparece como `NÃO EXECUTADO`, não como sobrevivente | IC-1 · IC-3 · IC-4 · IC-8 |
| T014 | 5 | build-engineer | **feature** | | **E1 `p52`** (`tests_p52_mutants.js` + `mutation_map.json`, commit único): **T1** · **T4/T5** · **T6** (`--preflight`, C1) · `"preflight": true`. **T3 já cumprida** (0 prefixos; `envOverride` em uso, `:1374`) — conferir e **não mexer**; o filtro por mutante aqui é `P52_MUT_ONLY` (`:1348`), divergente de propósito. Medir depois do commit (D3). Mensagem: `feat(013): E1 p52 — preflight (C1) e interpretador de T1 (T3 ja cumprida)` | **IC-1 · IC-3 · IC-4** · C1/C2 |
| T015 | 5 | build-engineer | chore | | **Repin R7** + **push**. Mensagem: `chore(013): gen_pins — R7 da tabela de repins (E1 p52)` | stage `baseline` · IC-7 |
| T016 | 5 | qa-engineer | chore | | **Medição da W5** (nada escrito): local (D3) + campanha `p52` no job `visual`. Não-detectado residual da `p52`, se confirmado, **não** vira reancoragem: é insumo de T13 (dívida declarada, sem expandir a matriz da P52) | IC-1 · IC-3 · IC-4 · IC-8 |
| T017 | 6 | qa-engineer | doc | | **E2, passo 1 — triagem escrita ANTES de qualquer edição** (`specs/013-integridade-da-campanha/matriz-gate-mutante.md`, arquivo nasce aqui): as **três perguntas** do refinamento respondidas por escrito para `M51-03`, `M51-16`, `M51-18` e `M51-20`, com a saída integral de **IC-4** medida na T008 como **red**. Para `M51-18` a unicidade é o ponto: o texto natural existe **idêntico** em `ui_v32.js:131` e `:1026` — o recorte candidato tem de incluir contexto que só exista em `:1026`, **provado por `ocorrencias == 1` no preflight**, nunca por inspeção. Resposta "a propriedade mudou de forma" ⇒ **não editar**: voltar ao plano (plan.md §Protótipo). Resposta "a propriedade morreu" ⇒ aposentadoria com razão, nunca reancoragem oportunista (T9). Commit red (mensagem exata na §Reds commitados) | **IC-4** (red registrado) · T9 |
| T018 | 6 | build-engineer | chore | | **Repin R8a** (triagem). Mensagem: `chore(013): gen_pins — R8a da tabela de repins (triagem de E2)` | stage `baseline` · IC-7 |
| T019 | 6 | qa-engineer | **fix** | | **E2, passo 2 — reancoragem das quatro** (`tests_p51_mutants.js`; **segundo dono do arquivo, wave diferente da T006** — R5 §waves). Cada âncora carrega as **três provas cumulativas** de T9: **(a)** `ocorrencias == 1` pelo preflight (IC-4); **(b)** morte pelo **gate e motivo esperados** (IC-8), nunca incidental (`tests_p51_mutants.js:9`); **(c)** **sobrevivência** com a asserção do gate neutralizada, em **worktree efêmera** (T10) — `tests_p50_core.js` **não é tocado na árvore real**. Locais (D5), com `MUT_ONLY` (`:191`; no PowerShell, `$env:MUT_ONLY=…`): `M51-03` (`P51-UX2`, `tests_p50_core.js:2689`, asserção `:2723-2724`), `M51-18` (`P51-RPT6`, `:3000`), `M51-20` (`P51-DOC13`, `:3648`, asserções `:3713-3731`). `M51-16` (`P51-PDF1`, `tests_p50_chromium.js:3500`) é declarado **`NÃO EXECUTADO` local com causa** e medido no job `visual` — honestidade do relato > paridade de execução (KI-3). **Zero byte de produto**: nenhuma edição em `ui_*`, `USER_GUIDE.md` ou suíte de gate (IC-7). Mensagem: `fix(013): E2 — reancoragem das quatro ancoras da p51 com as tres provas de T9` | **IC-4 · IC-8** (green) · IC-7 |
| T020 | 6 | build-engineer | chore | | **Repin R8b** (`tests_p51_mutants.js` + matriz) + **push**. Mensagem: `chore(013): gen_pins — R8b da tabela de repins (E2, reancoragem)` | stage `baseline` · IC-7 |
| T021 | 6 | qa-engineer | chore | | **Medição da W6** (nada escrito): local (D3) — **IC-4 verde pela primeira vez desde a W3** — e **campanha `p51` completa no job `visual`** do commit pushado: zero `NÃO EXECUTADO`, zero `SOBREVIVENTE` entre as quatro, cada uma com a linha `FAIL <gate esperado>` casando o `reason`. É aqui que `M51-16` fecha. Sobrevivente remanescente é insumo da W7, não conserto | **IC-8** · IC-4 |
| T022 | 7 | qa-engineer | doc | | **E3 — classificação** (`matriz-gate-mutante.md`): todo mutante que terminar `SOBREVIVENTE` sob o instrumento honesto entra no **vocabulário fechado** — `rot semântica` · `propriedade aposentada` · `gate sem poder discriminante (achado <id>)`. Insumo: campanhas de T013/T016/T021 + preflights. **`rot semântica` ⇒ o par é re-derivado da mensagem atual** (pergunta 2 da triagem) e isso é conserto desta demanda. **`gate sem poder discriminante` PARA a demanda**: achado `EA-*` próprio + escalonamento ao orquestrador; **não se escreve asserção nova sobre produto aqui** (spec §Fora de escopo). Contagem **não é critério de aceite** — pode ser 0, 1, 2 ou mais (spec §Riscos 2). Mensagem: `doc(013): E3 — classificacao dos sobreviventes no vocabulario fechado` | classificação (vocabulário fechado) · IC-5 (insumo) |
| T023 | 7 | build-engineer | chore | | **Repin R9a** (matriz) **e, em seguida, a sincronização que destrava a W8**: `git merge origin/develop` (**`acc9c21`**, R14 — merge de `develop` na feature é autonomia livre), resolvendo `pins.json` **por regeneração** (`gen_pins.py`), jamais por edição manual, + repin próprio do merge. **Verificado nesta Fase 3**: `acc9c21` **não** é ancestral de `f0aba70` — hoje a árvore só tem `EA-1` e `EA-2`, e escrever EA-4/5/6 sem o `EA-3` presente daria **quatro** abertos e um conflito de merge no arquivo em que esta demanda menos pode ter um. Conferir depois do merge: `bash .claude/verify/compliance-audit.sh --rule=backlog` ⇒ exit 0, **dois** abertos (`EA-1`, `EA-3`). Este repin é **fora da previsão R1–R10** e vai **registrado** no relatório final (T031), não silenciado. Mensagens: `chore(013): gen_pins — R9a da tabela de repins (E3, classificacao)` · `chore(013): sincroniza a feature com develop (acc9c21) — EA-3 no BACKLOG` · `chore(013): gen_pins — repin do merge de develop (fora da previsao R1-R10)` | stage `baseline` · IC-7 · `--rule=backlog` |
| T024 | 8 | qa-engineer | doc | **[P]** | **E4 — declaração verdadeira** (`.claude/verify/mutation-matrix.json`): a linha agregada `"campanhas P51 (múltiplos)"` (`:62-72`) é substituída por **um par por mutante** da `p51` (**C3**) — `propriedade`, `ancora {arquivo, ocorrencias, reancorada_em, razao}`, `classificacao` obrigatória quando `ultima_prova.resultado != "KILL"`, `ultima_prova.registro` apontando para **arquivo existente** (a `matriz-gate-mutante.md`). Aposentado (se houver) **sai** dos pares e **entra** em `dividas_declaradas` com razão. Também em `dividas_declaradas`: **T13** (residual da `p52` classificado, **sem** expandir a P52), **T8** (`core` sem preflight) e a **borda 8** com a cadeia fechada (spec §Riscos 4). **Nenhuma entrada em `receipts`** para caminho ignorado (T12/R11). Commitar **só este arquivo** (`git add` nominal — a delegação irmã escreve em paralelo). Mensagem: `doc(013): E4 — mutation-matrix com um par por mutante da p51 (C3)` | **IC-5** (+ `check_tdd.py`, estrutura) |
| T025 | 8 | doc-writer | doc | **[P]** | **EA-4 · EA-5 · EA-6 no `.claude/BACKLOG.md`**, escritos **juntos** (condição do plano satisfeita: PR #28 mesclado, `EA-3` na `develop`, presente na árvore desde T023). Rito de forma, sob pena de reprovar no gate: `**Status**: ` + valor entre crases na **primeira linha não vazia após o heading**, sem ponto final; o prefixo `**Status` é **reservado** — nenhuma prosa em coluna 0 pode começar assim dentro de um bloco, e o risco cresce com **três** blocos novos. **EA-6 registra explicitamente que habilita o EA-5** (`have("python") → True` incondicional é a raiz do colapso de estados) — cadeia causal no arquivo, não no raciocínio de quem escreveu. Rodar `bash .claude/verify/compliance-audit.sh --rule=backlog` **antes** de commitar, esperando **cinco** abertos (`EA-1`, `EA-3`, `EA-4`, `EA-5`, `EA-6`) — a maior listagem que o gate já produziu. Commitar **só este arquivo**. Mensagem: `doc(013): EA-4/EA-5/EA-6 no BACKLOG (EA-6 habilita o EA-5)` | `compliance-audit.sh --rule=backlog` (INV-10/R12) |
| T026 | 8 | build-engineer | chore | | **Repin R9b** (`mutation-matrix.json` + `BACKLOG.md`) + **push**, depois que **as duas** delegações de T024/T025 fecharem. Mensagem: `chore(013): gen_pins — R9b da tabela de repins (E4: matriz P51 + BACKLOG)` | stage `baseline` · IC-7 |
| T027 | 8 | qa-engineer | chore | | **Medição da W8** em árvore limpa (nada escrito): `--rule=backlog` ⇒ **cinco** abertos; **IC-5** verde (conjunto de ids do preflight ≡ conjunto de `mutante` dos pares `p51`; todo `registro` resolvido no disco); `check_tdd.py` verde. **Nenhuma campanha é disparada nesta wave** — `mutation-matrix.json` e `BACKLOG.md` não estão em `targets` de ninguém | **IC-5** · `check_tdd.py` · `--rule=backlog` |
| T028 | 9 | qa-engineer | chore | | **Campanha dos mutantes do gate novo (R3 §5)**: `M-IC1`…`M-IC9` sobre **cópias efêmeras** (T10 — nada na árvore real), cada um matando a asserção correspondente; **`M-IC5`** é o adversarial da borda 4 (âncora ambígua real de `M51-18`, `ui_v32.js:131` × `:1026`) e **`M-IC4`** o retorno do `run()` que engole exceção. Redigir a seção na `matriz-gate-mutante.md`; **não commita aqui** — entra no fechamento (T032), preservando a granularidade prevista de repins | `M-IC1`…`M-IC9` (spec §Critérios) |
| T029 | 9 | qa-engineer | chore | | **Validação executável**: skill `verify` (pipeline completo, contagens **citadas**); **campanha das três harnesses no job `visual`** do commit final (IC-8 + IC-3/IC-4 verdes; o que não rodar local é declarado `NÃO EXECUTADO` com causa, nunca omitido); **regressão nomeada** — `DEFER`/`FAIL` de `check_mutation.py:69-75` intactos, pré-condição de árvore limpa (`:39-44`) e pós (`:92-96`) intactas, restauração por SHA (`p51:206-207`, `p50:808`, `p52:1384`) **não enfraquecida** (borda 12), guarda de acervo de evidência da `p50`/`p52` intacta, `expected_suites.json` byte-idêntico; **IC-7** (`git diff --stat 077282f..HEAD` sem nenhum path de produto + `P50-GOV1`). Depois, skill `spec-validate` → `specs/013-integridade-da-campanha/spec-validate.md` (score item a item; commitado no fechamento) | **IC-3 · IC-4 · IC-5 · IC-7 · IC-8** · pipeline completo |
| T030 | 9 | product-owner | chore | | **Aceite de intenção (Fase 6)**: parecer sobre o resultado (spec-validate + matriz + classificação da E3) — reprova ou declara "não encontrei objeção" (R4/D3; agente nunca escreve em registro de aceitação) | portão da Fase 6 (usuário no chat) |
| T031 | 9 | doc-writer | doc | | **Relatório final PT-BR** (`specs/013-integridade-da-campanha/relatorio-final.md`): o que mudou, gates e mutantes **com contagens**, os quatro reancorados com as três provas de T9 (e o que ficou `NÃO EXECUTADO` local, com causa), a classificação da E3, **os desvios da previsão de repins** — R6/R8/R9 executados em **dois** commits cada e o **repin extra do merge de `develop`** (T023) — e a **linha de base de campanha pré-edição declarada como não obtenível**, com a razão (plan.md §Riscos), nunca apresentada como medida | R12 (revisão humana) |
| T032 | 9 | build-engineer | chore | | **Fechamento + Repin R10**: commit dos artefatos finais (matriz com a seção de mutantes de T028, `spec-validate.md`, `relatorio-final.md`) + repin em commit chore próprio; **push**. Asserção final: stage `baseline` **0 divergências · 0 rastreado-sem-pin**. Mensagens: `doc(013): fechamento — matriz, spec-validate e relatorio final` · `chore(013): gen_pins — R10 da tabela de repins (fechamento)` | stage `baseline` · IC-7 |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## O gate que viaja no prompt (R3 §3)

Todo `IC-*` está definido em **`specs/013-integridade-da-campanha/spec.md`**,
§*Critérios de aceite → gates* (tabela `IC-1`…`IC-8`, com mutante previsto). O
prompt de cada tarefa de implementação leva o **id** e **esse caminho**, nunca a
asserção transcrita:

| Tarefa | Gate no prompt | Onde ler |
|---|---|---|
| T002 (RED) | IC-1 · IC-2 · IC-4 · IC-5 · IC-6 (+ cenário IC-3(a)) | `specs/013-integridade-da-campanha/spec.md` §Critérios de aceite → gates |
| T004 | IC-2 (green) + regressão de `check_mutation.py:69-75` | idem |
| T006 | IC-1 · IC-3 · IC-4 · IC-6 · contratos C1/C2 | idem (+ §Contratos) |
| T009 | IC-1 · IC-3 · IC-4 · C1/C2 | idem |
| T011 | IC-1 · IC-3 (causa `gate não pôde ser executado`, D1) | idem (+ `plan.md` §D1) |
| T014 | IC-1 · IC-3 · IC-4 · C1/C2 | idem |
| T019 | IC-4 · IC-8 · IC-7 (produto byte-intacto) | idem (+ §As quatro âncoras) |
| T024 | IC-5 · contrato C3 | idem (+ §Contratos C3) |
| T025 | `compliance-audit.sh --rule=backlog` (rito no cabeçalho do `.claude/BACKLOG.md`) | `.claude/BACKLOG.md` §rito |

## Reds commitados (mensagem exata)

Dois — e só dois. Nenhum outro `feature`/`fix` desta demanda cria red novo: todos
consomem o red da W1 ou o que ele produziu na W3.

| Tarefa | Mensagem exata do commit | O que o red mede |
|---|---|---|
| T002 | `test(013): red — IC-1/IC-2/IC-4/IC-5/IC-6 (secao de integridade do stage mutation)` | 46 prefixos (20 `p51` + 26 `p50`) + 4 literais `python3` em 3 arquivos; os **três** harnesses sem responder a C1; `targets` da `p51` divergentes nas duas direções; adversarial de IC-2 passando por causa de `have("python") → True` |
| T017 | `test(013): red — IC-4 (as quatro ancoras da p51 nomeadas pelo preflight)` | o FAIL medido na T008: `M51-03`/`M51-16`/`M51-18`/`M51-20` com `ocorrencias != 1`, nomeados pelo instrumento que a W3 produziu |

O `planning-state` recebe `red.status: proven` com o SHA em ambos (commit chore
próprio, no padrão `chore(013): planning-state — red.status proven em <sha>`;
`.claude/project-memory/**` é excluído do registry, não pede repin).

## Onde a campanha roda, e por quem

**As três harnesses declaram `chromium` em `requires`** (`mutation_map.json`) —
campanha local **não existe** nesta máquina (D3: `env_doctor.py`, 1 WARN nominal).
O que roda local é o **preflight + a seção de integridade**; a campanha roda no
**job `visual`** do CI, no commit pushado da wave. **Uma campanha por correção,
nunca uma auditoria acumulada no fim** — foi assim que duas âncoras apodreceram
sem ninguém ver.

| Wave | Quem mede | Local (node + python) | Job `visual` (Chromium) |
|---|---|---|---|
| W3 | T008 · qa-engineer | `MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py` — IC-1/IC-4/IC-6 | campanha **`p51`** do commit de T007 |
| W4 | T013 · qa-engineer | idem — IC-1 a 0, preflight da `p50` (53 mutantes) | campanha **`p50`** do commit **(b)** de T012 — é ela que prova os 26 filtros |
| W5 | T016 · qa-engineer | idem — **IC-1 verde nos dois eixos** (prefixo e interpretador) pela primeira vez; preflight da `p52` | campanha **`p52`** do commit de T015 |
| W6 | T019 (provas) e T021 (veredito) · qa-engineer | provas (a)/(b)/(c) de `M51-03`, `M51-18`, `M51-20` com `MUT_ONLY` + `node tests_p50_core.js` (D5); neutralização em worktree efêmera (T10) | campanha **`p51`** completa (IC-8) — **`M51-16`/`P51-PDF1` fecha aqui** |
| W9 | T029 · qa-engineer | pipeline completo (skill `verify`) + `M-IC1`…`M-IC9` em cópias efêmeras (T028) | campanha das **três** harnesses no commit final |

W1, W2, W7 e W8 **não disparam campanha**: `check_mutation.py`,
`mutation_map.json`, `mutation-matrix.json` e `BACKLOG.md` não estão em `targets`
de harness nenhum (plan.md §O que dispara campanha).

**Serialização é estrutural, não pedida**: `check_mutation.py:39-44` recusa rodar
com `git status` sujo. Quem tentar medir enquanto outra delegação escreve recebe
`[FAIL] árvore suja` — nunca um número errado. Por isso toda medição vem **depois**
do commit, e por isso nenhuma wave paraleliza escrita com medição.

## Notas de tipagem (auditáveis — R3 §Tipagem)

- **T002 `feature`**: gate novo em executável do `pipeline.yaml` (R10 §9) → red
  real, medido contra a árvore como está e **commitado** (R3 §4). Autor do gate =
  `qa-engineer`; quem produz o green é **outro agente, em outro arquivo** (T006,
  T009, T011, T014) — separação de poderes preservada (R3 §2).
- **T004 `fix`**: red em T002 (cenário adversarial de IC-2, `M-IC3` é o código de
  hoje). Mesmo dono e mesmo arquivo da T002, wave seguinte — o `check_mutation.py`
  é do `qa-engineer` porque é o **julgador** (R10).
- **T006/T009/T014 `feature`**: carregam `fix` (T1/T3/T4/T5 — portabilidade,
  prefixos, três estados) **e** `feature` (T6, `--preflight`: capacidade nova).
  Tipadas pelo mais exigente; ambos exigem red e o red é o mesmo — T002. Separar
  em duas tarefas criaria dois commits por wave, e o plano fixa **um** commit em
  W3 e W5 e **dois** em W4 (a tabela de repins R5/R6/R7 depende disso).
- **T011 `fix`, tarefa própria**: é o maior diff mecânico da demanda (26 filtros) e
  o único ponto com reversão nominal prevista (`git revert`). Misturá-lo ao
  conserto do interpretador na mesma harness tornaria a reversão impossível sem
  desfazer o resto.
- **T017 `doc`**: escreve prosa e **registra** medição; não cria comportamento nem
  gate — o gate que produz esse red (IC-4) nasceu na T002. O prefixo
  `test(013): red —` marca o commit como **artefato de red** (R3 §4); não muda a
  tipagem.
- **T019 `fix`**: red = IC-4 medido na T008 e commitado em T017. Aqui o
  `qa-engineer` implementa e isso **não** fura R3 §2: o critério de aceite é
  **externo** — os gates `P51-UX2`/`P51-RPT6`/`P51-DOC13`/`P51-PDF1`, que já
  existem em `tests_p50_core.js`/`tests_p50_chromium.js` e que **ninguém desta
  demanda escreve ou edita** (spec §Separação de poderes).
- **T022/T024/T031 `doc`**: classificam, declaram e narram; nenhuma asserção nova
  sobre produto. O que **fixa** os `targets` (`fix`) já foi na T006.
- **T025 `doc`**: registro de achado, provado pelo gate de forma que já existe
  (`--rule=backlog`, entregue pela 012) e que viaja no prompt.
- **T008/T013/T016/T021/T027/T028/T029 `chore`**: medição e revalidação, sem
  escrita na árvore (T028 redige, mas quem commita é o fechamento).
- **Repins `chore`**: rito R8 §1; o esquecimento é FAIL automático do stage
  `baseline`, não depende de disciplina.
- **Nenhum `tdd_waiver` previsto.** Se algum for necessário, entra no
  `planning-state` com motivo e data, e o `compliance-audit` o lista (R3 §waiver).

## Sequência e paralelismo

Waves **1→9 estritamente sequenciais**, na ordem do plano. `[P]` aparece **uma
única vez** — T024 × T025, na W8, entre dois arquivos que **não medem nada**
(`mutation-matrix.json` × `.claude/BACKLOG.md`), donos distintos, commits
nominais (`git add <path>`), com a medição (T027) só **depois** que as duas
fecharem. Todo o resto é dependência real:

- gate antes de implementação (T002 → T004/T006/T009/T011/T014);
- registro antes do consumo (`preflight: true` e `targets` **no mesmo commit** do
  harness — D4);
- **contrato antes do consumidor invertido de propósito**: o consumidor (C1 em
  `check_mutation.py`) nasce na W1 e **reprova nomeando os três**; o green da W3
  **produz** o red seguinte (IC-4, as quatro âncoras) — cadeia causal em commits,
  não em prosa;
- `tests_p51_mutants.js` tem **dois donos** (T006 `build-engineer` na W3, T019
  `qa-engineer` na W6) e **nunca aparece na mesma wave** — coincide com a ordem
  obrigatória E1 → E2 → E3 → E4;
- E1 completa (W3+W4+W5) antes de E2 (W6): o critério é **de família**;
- T023 sincroniza com `develop` **antes** da W8, para que o `BACKLOG.md` tenha um
  único autor por wave (o merge traz o `EA-3`; o `doc-writer` escreve depois).

Falha de uma tarefa não derruba as anteriores; máx. 3 tentativas → escalar
(R5 §Waves).

## Mapa de cobertura (para o portão — nenhum critério órfão)

| Critério / decisão | Tarefa que o prova |
|---|---|
| IC-1 (portabilidade por propriedade, 46 → 0) | T002 (red) · T006 · T009 · **T011** · T014 · T008/T013/T016 (medição) |
| IC-2 (requisito com dentes) | T002 (red adversarial) · T004 (green) · T029 (regressão) |
| IC-3 (três estados + causa; nada mutado ao abortar) | T002 (cenário (a) medido) · T006/T009/T014 · T011 (D1) · T029 |
| IC-4 (âncora única provada antes de mutar) | T002 (consumidor) · T006 (produtor) · T008 (red das quatro) · T017 · T019 · T021 |
| IC-5 (matriz da P51 verdadeira) | T002 (red) · T024 · T027 |
| IC-6 (`targets` da `p51`, nominal) | T002 (red) · T006 (T11) · T008 |
| IC-7 (identidade coerente, produto byte-intacto) | T001/T003/T005/T007/T010/T012/T015/T018/T020/T023/T026/T032 · T029 |
| IC-8 (campanha conclui; as quatro morrem pelo gate/motivo) | T019 (provas a/b/c) · T021 (`p51` completa) · T029 |
| T1/T2 · C4 (`MUTATION_PY`) | T004 · T006 · T009 · T014 |
| T3 (nenhum prefixo POSIX em `cmd`) | T006 (cria plumbing, 20) · **T011** (usa a existente, 26) · T014 (confere: 0) |
| T4/T5 (vocabulário fechado; sem razão `D/T` com `U>0`) | T006 · T009 · T014 · T022 (classificação) |
| T6 · C1 (preflight) | T006 · T009 · T014 · T002 (consumidor) |
| T7 (preflight no stage existente, sem tocar `pipeline.yaml`) | T002 |
| T8 (dívida do `core` impressa) | T004 · T024 (dívida declarada) |
| T9 (três provas cumulativas) · T10 (worktree efêmera) | T017 (triagem escrita antes) · T019 (provas) · T028 (`M-IC*` em cópias) |
| T11 (`targets` reconciliados) | T006 |
| T12/T13 · C3 (registro durável, aposentadoria, dívidas) | T024 · T022 (narrativa) |
| D1 (gate que não roda ⇒ não executado) | T011 · T013 (campanha `p50` do commit (b)) |
| D2 (relato por asserção) · D3 (rito local) | T002 · T008/T013/T016/T021 |
| D4 (`preflight: true` no mesmo commit) · D6 (argv) | T006 · T009 · T014 |
| D5 (3 de 4 provas locais) | T019 · T021 |
| `M-IC1`…`M-IC9` (mutante obrigatório do gate novo) | T028 |
| EA-4 · EA-5 · EA-6 (condicional, satisfeita) | T023 (sincroniza) · T025 (escreve) · T027 (mede: cinco abertos) |

## Escalonamentos previstos (o executor para, não improvisa)

1. **Rot fora das quatro** revelada pelo preflight em `p50`/`p52` (T013/T016):
   classificar e registrar, **nunca** reancorar — E2 é nominal às quatro. Escalar
   ao orquestrador com a lista (spec §Riscos 1).
2. **`gate sem poder discriminante`** na classificação (T022): a demanda **para**,
   vira achado `EA-*` + `fix-finding` próprio (spec §Fora de escopo).
3. **Triagem responde "a propriedade mudou de forma"** (T017): não editar —
   voltar ao `plan.md` antes de qualquer reancoragem (plan.md §Protótipo).
4. **Repin fora da previsão R1–R10**: repin no próprio commit do desvio +
   registro no relatório final (T031). Já há um previsto e nomeado: o merge de
   `develop` em T023.
