# Spec-validate — 013-integridade-da-campanha

> Fase 6 · T029 (parte `spec-validate`) · **somente leitura sobre o produto e o
> instrumento** · 2026-09-04 · executor: `qa-engineer`.
> **Retroativo**: o PR #29 (`feature/013-integridade-da-campanha` → `develop`,
> head `a774c3689e5473c89a7f9d94ea0fb452ce895f8d`, merge `2426582` em
> 2026-08-30T06:41:22Z) foi mesclado sem este artefato — padrão registrado como
> `EA-33` (alocado na branch da 014). O `product-owner` deu o aceite de intenção
> em 2026-09-01 ("não encontrei objeção") e **recusou** mover a fase para `done`
> sem a metade QA da Fase 6. Esta é a metade QA.
> Medido no HEAD **`7bf1c300a8364c0ac854849ad4ecd3e1b602c5ab`** (branch
> `chore/fecho-009-013`), contra a [spec.md](spec.md) aprovada sob delegação
> (`a052617`, errata da Fase 2 em `3888cc0`). O que só está conforme **por
> trabalho posterior** à 013 está dito como tal, item a item.

## Método

Cada exigência verificável da spec (T1–T13, IC-1..IC-8, C1–C4, listas de
arquivos, riscos, cross-check) foi conferida **na implementação real e por
execução própria** — nunca no relatório de quem implementou (R2 §2/§4). Onde a
prova canônica é o CI, o **log do run foi lido** (`gh run view … --log`), não a
cor do badge.

Ambiente desta validação: Windows 11 · node **v24.19.0** · Python **3.14.7** ·
Playwright 1.62.1 **sem** Chromium gerenciado (KI-3; `CHROME_PATH` vazia);
árvore limpa no início. Durante a sessão, **outra sessão de `qa-engineer`**
(diagnóstico da 014, compartilhando este clone) gravou três arquivos de memória
de agente na árvore de trabalho; a partir daí o stage `mutation` recusou a árvore
real (`[FAIL] árvore suja`, pré-condição `:57-61` — **a regressão da borda 12
observada ao vivo**), e todas as execuções do stage passaram a ser feitas numa
**worktree efêmera no mesmo HEAD** (`git worktree add --detach`, árvore limpa,
descartada ao fim). Nenhuma execução escreveu em arquivo versionado da árvore
real (R7 §3).

### Execuções desta validação (todas em 2026-09-04)

| execução | resultado |
|---|---|
| `node <harness> --preflight` para os **7** harnesses com `preflight: true` (`d009`, `d010`, `d011`, `d015`, `p50`, `p51`, `p52`), na árvore real ainda limpa | exit 0 nos 7 · **um** objeto JSON por stdout (1 linha), texto humano em stderr · chaves de C1 completas · `interpretador = {python, padrão, resolvido: true}` · **257 âncoras, todas `ocorrencias == 1`** (19 + 24 + 19 + 15 + 53 + 20 + 107) · 0,1–0,3 s cada (nenhum rebuild) · `git status --porcelain` vazio antes e depois |
| Varredura **própria** de IC-1 (regex independente do julgador, classe `^[A-Za-z_][A-Za-z0-9_]*=` e literal `["'\`]python3?[ \t]`) sobre os 8 harnesses do mapa | **185 `cmd`** (0 + 2 + 3 + 53 + 20 + 107 + 0 + 0) · **0** com prefixo POSIX · **0** literais de interpretador (o red media 46 e 4) |
| `python .claude/verify/check_mutation.py` na efêmera (controle, árvore sã) | `---- integridade: 0 ----` · `---- exceção nominal: 0 ----` · `---- guarda de leitura parcial: 0 ----` · `[DÍVIDA] core` impressa · IC-4 verde nos 7 harnesses · IC-5 20 pares + 20 registros · IC-6 7 caminhos · IC-9 KI-4 ×2 + sonda 7 cenários · IC-10 acordo + sonda 8 cenários + regressão · `mutation: 0 campanha(s) executada(s) · 0 problema(s)` · 0,9 s |
| IC-2 ponta-a-ponta (a): `MUTATION_PY=py-inexistente-qa013 python check_mutation.py --all` | exit **1** · `[OK] IC-2` · **7** `[FAIL] IC-4: <h> · preflight não resolveu o interpretador ('py-inexistente-qa013', origem 'MUTATION_PY')` · **8** `[FAIL] <h>: campanha EXIGIDA (alvo mudou) mas ambiente sem python[/chromium]` · `15 problema(s)` · árvore limpa |
| IC-2 ponta-a-ponta (b): idem com `MUTATION_DEFER_MISSING=1` | **8** `[DEFER] <h>: exigida (alvo mudou) — delegada ao job com python[/chromium] (job visual)` nomeados · mas exit **1** pelos 7 `[FAIL] IC-4` · `7 problema(s)` — ver gap G1 |
| IC-3 (a), harnesses **de hoje**, `MUTATION_PY=py-inexistente-qa013`, sem filtro | `p50`: **53/53** `NÃO EXECUTADO` com `causa: interpretador ausente` · `p51`: **20/20** · `p52`: **107/107` · razão `D/T` impressa: **0** nos três · `CAMPANHA NÃO CONCLUÍDA · 0 detectados · 0 sobreviventes · N não executados (de N)` · exit 1 · porcelain vazio · 0,1 s cada (aborta antes de mutar) |
| IC-3 (b), âncora de `M51-03` corrompida na cópia | `--preflight`: exit 1, `M51-03 = {ocorrencias: 0, estado: nao_executavel, causa: âncora não encontrada}`, demais 19 `ok` · `MUT_ONLY=M51-03 node tests_p51_mutants.js`: `NÃO EXECUTADO  M51-03 … gate esperado: P51-UX2 · causa: âncora não encontrada · ocorrencias=0 em ui_p50_shell_v32.js` + `CAMPANHA NÃO CONCLUÍDA · 0 · 0 · 1 (de 1)`, exit 1, **nada mutado** (porcelain vazio) · stage: `[FAIL] IC-4: p51/M51-03 · âncora não encontrada — ocorrencias=0 em ui_p50_shell_v32.js` |
| Campanha **`M-IC1`…`M-IC9`** (T028), cada mutante commitado na efêmera e medido pelo próprio stage | **9 de 9 mortos** — tabela em [matriz-gate-mutante.md §20](matriz-gate-mutante.md) |
| `node tests_p50_core.js` (IC-7 · `P50-GOV1`) | **64 PASS · 0 FAIL de 64** · `PASS P50-GOV1 — nenhuma superfície protegida da §29.4 foi alterada` · 36,7 s |
| `git diff --name-only 2426582^1 a774c36` (o diff exato do PR #29) | 24 arquivos; **nenhum** path de produto, engine, Camada 1, HTML gerado, `USER_GUIDE.md`, `tests_core_mutants.js`, suíte de gate, `pipeline.yaml`, `run.sh`, `verify.yml`, `expected_suites.json`, `check_tdd.py`, `env_doctor.py`, `boundary.json`, `invariants.json` |
| CI do PR #29 — `gh run list --commit a774c36…` → run **33295007844** (`pull_request`, criado 2026-08-30T05:34:53Z, success) | job `verify` **99213050930**: `verify: 14 PASS · 0 FAIL` · `compliance: 13 PASS · 0 FAIL` · `[PASS] mutation` sob `MUTATION_DEFER_MISSING=1` (é o defer, não a prova). Job `visual` **99213051082** (1h05m25s): `P50 CHROMIUM + P51: 27 PASS · 0 FAIL de 27` · `P52 CHROMIUM: 55 PASS · 0 FAIL de 55` · depois `check_mutation.py` com Chromium: seção de integridade **0 problemas** (IC-1 sobre 4 harnesses · IC-2 OK · `[DÍVIDA] core` · IC-4 `p50` 53, `p51` 20, `p52` 107 · IC-6 7 caminhos · IC-5 20 pares · IC-9 KI-4 + sonda 7 · IC-10 acordo + sonda 8 + regressão) · `[RUN] p50` → `53/53` · `[RUN] p51` → `19/20 … 1 sobrevivente(s): M51-01` → `SOBREVIVENTE M51-01 · gate P51-VIS1 · o gate esperado NÃO reprovou` → **`[EXCEÇÃO] KI-4: p51/M51-01 SOBREVIVENTE perdoado · gate P51-VIS1`** · `[RUN] p52` → `107/107` · **`mutation: 3 campanha(s) executada(s) · 0 problema(s)`** às 06:40:17Z — **65 segundos antes do merge** |
| Pós-merge: `git log 2426582..HEAD` sobre os artefatos da 013 | `check_mutation.py`, `tests_p50_mutants.js`, `tests_p51_mutants.js`, `known_issues.json`: **0 commits** — o que se mede hoje neles é a entrega da 013. `tests_p52_mutants.js`: 2 commits posteriores, ambos da **009** (`3950288`, entrado na `develop` pelo PR #24 depois da 013): `desc` e `reason` de `P52-M3` re-derivados para o `P52-TGT1` reancorado — `find`/`repl` **intactos**, logo sem efeito sobre IC-4. `mutation_map.json`: 13 commits posteriores (registro de `d009`/`d010`/`d011`/`d015` e trilhas) |

**Não executado, declarado (R2 §1 / R10 §2)**: campanhas `p50`/`p51`/`p52`
localmente (Chromium ausente — KI-3; a prova canônica é o log do run acima);
prova **(c)** de T9 para `M51-16` (`P51-PDF1`) e `p52/V322-M3` (`V322-CTXPAR1`),
e para o `reason` re-derivado de `P50::M51` (`P50-PR1`) — exigem Chromium e
ficaram como `dividas_declaradas` [8], [9] e [13] da `mutation-matrix.json`;
`bash .claude/verify/run.sh --light` só depois dos commits desta validação
(contagem no relatório da sessão).

## Itens — veredito um a um

| # | Exigência (spec) | Verificação | Veredito |
|---|---|---|---|
| 1 | **T1** · interpretador com UMA fonte (`MUTATION_PY` senão `win32 ? python : python3`), a mesma nas três harnesses e em `check_mutation.py`; caminho do script entre aspas | `tests_p50_mutants.js:125-126`, `tests_p51_mutants.js:54-55`, `tests_p52_mutants.js:125-126`, `check_mutation.py:27-36` — literalmente a mesma expressão; `build()` invoca `` `"${PY}" "${BUILD_PY}"` `` (p51 `:100`, p50/p52 idem); o preflight dos 7 harnesses reporta `origem: "padrão"` sem a env e `origem: "MUTATION_PY"` com ela (execução IC-2) | **conforme** |
| 2 | **T2** · `have("python")` resolve de verdade (`shutil.which`); `DEFER`/`FAIL` nomeados de `:69-75` preservados | `check_mutation.py:39-47`; IC-2 em processo `[OK]`; ponta-a-ponta: 8 `[FAIL] … ambiente sem python` sem a env e 8 `[DEFER] … delegada ao job com python` com ela — o vocabulário do laço está intacto | **conforme** |
| 3 | **T3** · nenhum `cmd` com prefixo POSIX; supressão de evidência **por construção** (`SUPPRESS` no `run()`) + `only` via `envOverride`; `p50` migra os 26 filtros, `p51` cria a plumbing, `p52` já cumpria | varredura própria: **0 de 185** `cmd`; `p51:81-83` (`SUPPRESS = {P50_NO_EVIDENCE:"1"}`, `run(cmd, envOverride)`), `p50:172-174`, `p52:164-166` (`P52_/P50_/V322_NO_EVIDENCE`); IC-1 `[OK]` nos 8 harnesses (CI e local); red de 46 registrado em `red-integridade.md` | **conforme** |
| 4 | **T4** · três estados, vocabulário fechado; toda `NÃO EXECUTADO` com UMA causa do conjunto fechado; falha fora do conjunto impressa como `falha não classificada: …` e reprovando | `p51:112-122` (`DETECTADO`/`SOBREVIVENTE`/`NÃO EXECUTADO`, `CAUSA` com as 5 causas, `naoClassificada`), `p50:207-210`, `p52:199-202`; IC-3 (a)/(b) executados hoje imprimem exatamente esse vocabulário; `check_mutation.py:110-113` consome o mesmo conjunto fechado (`IC_CAUSAS_FECHADAS`) | **conforme** |
| 5 | **T5** · com `U > 0` nenhuma razão `D/T`; `CAMPANHA NÃO CONCLUÍDA · D · S · U (de T)` + lista com causa + exit ≠ 0; com `U == 0` a linha histórica literal | `p51:418-427`, `p50:990-999`, `p52:1547-1556`; IC-3 (a): razão `D/T` impressa **0 vezes** nos três (53/20/107 não executados); linha histórica preservada no CI: `MUTATION TESTING (Phase 5.1): 19/20 mutantes detectados pelo gate e motivo esperados` | **conforme** |
| 6 | **T6** · `<cmd> --preflight` (argv): resolve o interpretador, conta ocorrências por mutante, **não muta, não reconstrói, não executa gate, não escreve**; JSON único em stdout; exit 0 sse resolvido e todo `ocorrencias == 1` | execução própria nos 7 harnesses (tabela acima): 0,1–0,3 s, porcelain vazio, 1 linha em stdout, exit 0; com `MUTATION_PY` inexistente: `resolvido: false`, exit ≠ 0 (7×, execução IC-2); com âncora corrompida: `nao_executavel` + causa, exit 1 (IC-3 b). `p51:296-329`, `p50:855-884`, `p52:1489-1518` | **conforme** — e adotado por 4 harnesses **posteriores** (`d009` em `0d4a329` "exigido pela 013", `d010`, `d011`, `d015`): extensão, não a razão da conformidade |
| 7 | **T7** · preflight roda no stage `mutation` existente, **depois** da pré-condição de árvore limpa e **antes** do laço de trigger, independente de `requires`; nenhum stage novo, nenhuma linha em `pipeline.yaml`/`run.sh`/`verify.yml` | `check_mutation.py:57-61` (árvore) → `:64-476` (integridade) → `:1240+` (laço); observado ao vivo: com a árvore suja o stage parou **antes** da integridade; na efêmera a integridade rodou com todas as campanhas "não exigidas"; o diff do PR não contém `pipeline.yaml`, `run.sh` nem `verify.yml` | **conforme** (o `verify.yml:74` de hoje é da 011 — posterior e alheio ao critério) |
| 8 | **T8** · `core` fora das edições; ausência de preflight impressa como dívida nomeada, nunca omitida | `[DÍVIDA] core: sem preflight declarado — âncora podre só aparece na execução da campanha` (local e CI); `tests_core_mutants.js` fora do diff; `dividas_declaradas[10]`; `IC_SEM_PREFLIGHT = ("core",)` por propriedade | **conforme** |
| 9 | **T9** · reancoragem pela **propriedade** do `desc`; três perguntas respondidas **por escrito antes** da edição; **três provas cumulativas** por âncora — (a) `ocorrencias == 1`, (b) morte pelo gate **e** motivo, (c) sobrevivência com a asserção neutralizada | Triagem escrita no commit red `8181f05` (matriz §3), edição no commit `6d0a581` — ordem provada pelo git; matriz por par: as 4 da `p51` com `ancora.reancorada_em = 2026-08-29` e `razao`. **(a)**: 8/8 (preflight, CI e local). **(b)**: 8/8 — `p51` 19/20 com o único não-KILL sendo `M51-01` (logo `M51-03/16/18/20` DETECTADOS pelo gate e motivo), `p50` 53/53 (`M13`, `M23`, `M35`), `p52` 107/107 (`V322-M3`), tudo no run 33295007844. **(c)**: **6/8** executadas em cópia efêmera (matriz §3, §11) — `M51-16` e `V322-M3` **não** (Chromium; `dividas_declaradas[8]` e `[9]`), idem o `reason` re-derivado de `P50::M51` (`[13]`) | **não conforme — `faltando` (declarado, com causa)**: a spec exige as três provas em cada âncora reancorada; duas das oito carregam só (a)+(b). Ver gap G3 |
| 10 | **T10** · prova (c) em **worktree efêmera**, nunca na árvore; nada escrito em arquivo versionado | matriz §3/§11 (cópias efêmeras, conferência byte a byte); `tests_p50_core.js` e `tests_p50_chromium.js` **fora do diff** do PR; `P50-GOV1` PASS hoje | **conforme** |
| 11 | **T11** · `targets` da `p51` ≡ arquivos que o harness muta ∪ `{tests_p51_mutants.js}`; `ui_session_v32.js` sai; IC-6 nominal | comparação própria: `mutation_map.json → p51.targets` (7) == `arquivos_mutados` do preflight (`USER_GUIDE.md`, `ui_journey_v32.js`, `ui_p50_results_v32.js`, `ui_p50_shell_v32.js`, `ui_p50_v32.css`, `ui_v32.js`) ∪ harness; IC-6 `[OK] … (7 caminhos)` local e CI | **conforme** |
| 12 | **T12** · linha agregada `"campanhas P51 (múltiplos)"` substituída por **um par por mutante**, com `propriedade`, `ancora`, `ultima_prova` datada; aposentado sai e entra em dívida; nenhum `receipts` para a `p51`; narrativa na `matriz-gate-mutante.md` | `mutation-matrix.json`: **20** pares `p51`, todos com `propriedade` e `ancora`, `registro` resolvendo no disco; `M51-01` com `classificacao` e `prova_anterior`; agregados restantes: só `P50` e `P52`; `p51` sem chave `receipts`; `_meta.expansao_p51` registra "nenhum aposentado" | **conforme** |
| 13 | **T13** · residual da `p52` classificado em `dividas_declaradas` + narrativa; `"campanhas P52 (múltiplos)"` **não** expandida | `dividas_declaradas[9]` (`V322-M3`: âncora podre **de nascença**, `ocorrencias=0` já em `df5d9f6` — o `106/107` do CI explicado), matriz §10.4; a linha agregada da P52 permanece | **conforme** |
| 14 | **Vocabulário fechado normativo** · estados e causas; classificação de par não-KILL (`rot semântica` · `propriedade aposentada` · `gate sem poder discriminante (achado <id>)`); glossário fechado na Fase 0 | `check_mutation.py:110-116` (`IC_CAUSAS_FECHADAS`, `IC_CLASSIFICACOES`); matriz: `M51-01 → gate sem poder discriminante (achado EA-7)`, `_meta.classificacao_e3` com `P50::M51 → rot semântica`; `CONTEXT.md` com os verbetes de mutação (`:161-193`: âncora, reancoragem, aposentadoria, não executado, sobrevivente, alvo declarado), alterado **só** no commit da Fase 0 (`dae68d0`) | **conforme** |
| 15 | **IC-1** · gate por propriedade, classe com dígito, auto-exclusão nominal por path | `check_mutation.py:187-252`; red `f89ab95` (46 prefixos + 4 literais); verde no CI e local; `M-IC1` (literal `python3` em `build()`) → `[FAIL] IC-1: p51/tests_p51_mutants.js:100 · interpretador por nome fixo…`; `M-IC2` (um `cmd` com `P50_ONLY=`) → `[FAIL] IC-1: p51/tests_p51_mutants.js · 1 de 20 cmd … P50_ONLY=` | **conforme** |
| 16 | **IC-2** · execução adversarial com interpretador ausente ⇒ exit ≠ 0 e `[FAIL] <harness>: … ambiente sem python`; **a mesma execução com `MUTATION_DEFER_MISSING=1` ⇒ `[DEFER]` nomeado, exit 0**; execução normal inalterada | Sem DEFER: **conforme** (exit 1, 8 FAIL nomeados). Com DEFER: os 8 `[DEFER]` saem nomeados, mas o stage sai **1** porque IC-4 reprova `preflight não resolveu o interpretador` (7×) — exatamente o que **T6** ("exit 0 sse interpretador resolvido") e a tabela de cenários ("Interpretador ausente → preflight ⇒ `interpretador ausente`, exit ≠ 0") mandam. A spec contradiz a si mesma; a implementação seguiu a cláusula mais forte. `M-IC3` → `[FAIL] IC-2: M-IC3 · have("python")` | **não conforme — `spec-errada`** (gap G1) |
| 17 | **IC-3** · três estados com causa, sem número não medido, nada mutado ao abortar: cenário (a) interpretador ausente; cenário (b) âncora corrompida | (a) e (b) **executados hoje** sobre as três harnesses pós-correção (tabela de execuções); `M-IC4` (laço de dois estados reintroduzido: sem aborto por interpretador, sem contagem de âncora, sem checagem de rebuild/spawn/linha) **morto pelos dois cenários** — imprime `SOBREVIVENTE M51-02` + `0/1 mutantes detectados` sob (a) e `SOBREVIVENTE M51-03` sob (b) | **conforme** |
| 18 | **IC-4** · consumidor de C1: `ocorrencias == 1` para todo mutante; 0 ⇒ `âncora não encontrada`, ≥2 ⇒ `âncora ambígua`, nomeando mutante, arquivo e contagem | `check_mutation.py:279-374`; red `8181f05` (as quatro da `p51`); hoje **257/257** em 7 harnesses (CI do PR: **180/180** nos 3 da 013); `M-IC5` (find de `M51-18` apontado para o texto que existe em `ui_v32.js:131` **e** `:1164`) → `[FAIL] IC-4: p51/M51-18 · âncora ambígua — ocorrencias=2 em ui_v32.js` | **conforme** — as 107 âncoras da `p52` de hoje são as mesmas do PR #29: o único toque **posterior** no harness (`3950288`, 009) re-derivou `desc`/`reason` de `P52-M3` sem mover `find`/`repl` |
| 19 | **IC-5** · matriz da P51 verdadeira (par por mutante; `classificacao` quando não-KILL; `registro` existente; aposentado em dívida) | `check_mutation.py:414-461`; `[OK]` ×2 local e CI; `M-IC6` (par `M51-07` removido) → `[FAIL] IC-5: p51 · 1 mutante(s) do harness sem par na matriz … M51-07`; `M-IC7` (`registro` inexistente) → `[FAIL] IC-5: p51/M51-07 · ultima_prova.registro não resolve no disco` | **conforme** |
| 20 | **IC-6** · `p51.targets` ≡ mutados ∪ harness, divergência nas duas direções nomeada | `check_mutation.py:395-412`; `M-IC8` (`USER_GUIDE.md` fora) → `[FAIL] IC-6: p51.targets · alvo mutado ausente de targets: USER_GUIDE.md`; `M-IC9` (`ui_session_v32.js` de volta) → `[FAIL] IC-6: p51.targets · alvo declarado que o harness não muta: ui_session_v32.js` | **conforme** |
| 21 | **IC-7** · `gen_pins.py` no mesmo PR; zero rastreado-sem-pin; produto byte-intacto | **19** commits `gen_pins` no PR; `[PASS] baseline` no job `verify` do run; `P50-GOV1` PASS hoje; diff do PR sem path de produto | **conforme** (o `baseline` local ficará vermelho **após** os commits desta validação até o repin, que é do proprietário — esperado, não regressão) |
| 22 | **IC-8** · campanha `p51` conclui no job `visual`; zero `NÃO EXECUTADO`; zero `SOBREVIVENTE` entre `M51-03/16/18/20`, cada uma morta pelo gate e motivo | run 33295007844, job `visual`: `p51` **19/20**, `não-KILL: 1 de 20` = `M51-01` (KI-4, alheio à reancoragem), portanto os 19 restantes — as quatro inclusive — **DETECTADOS** (por definição do harness, `DETECTADO` = gate esperado **e** motivo); `p50` 53/53 e `p52` 107/107 fecham a E2 estendida; `mutation: 3 campanhas · 0 problemas` **antes** do merge | **conforme** — responde à pendência (6) do `product-owner`: **há** evidência, e ela é anterior ao merge |
| 23 | **C1** · JSON do preflight | chaves `harness`, `arquivo`, `interpretador{nome, origem, resolvido}`, `arquivos_mutados`, `mutantes[{id, arquivo, ocorrencias, estado, causa?}]`; `estado ∈ {ok, nao_executavel}`; exit conforme; stdout só JSON — conferido nos 7 objetos salvos desta sessão | **conforme** |
| 24 | **C2** · `mutation_map.json`: `preflight: true` em `p50`/`p51`/`p52`, ausente em `core`; `targets` da `p51`; sem `receipts` para `p51` | conferido por leitura estruturada (python): 7 harnesses com `preflight: true`, `core` sem; `p51` sem `receipts`; `p50`/`p52` mantêm os seus | **conforme** |
| 25 | **C3** · campos do par expandido da P51 | 20/20 com `propriedade` e `ancora{arquivo, ocorrencias, …}`; 4/20 com `reancorada_em` + `razao`; `classificacao` presente no único não-KILL; 20/20 `registro` existente | **conforme** |
| 26 | **C4** · `MUTATION_PY` honrado igualmente por julgador e harnesses; `MUTATION_DEFER_MISSING` intocada | execução IC-2: a env chega aos 7 preflights (`origem: MUTATION_PY`) e ao `have()`; `[DEFER]` preservado | **conforme** |
| 27 | **Arquivos rastreados que mudam / Não mudam** (spec §Contratos) | "Mudam": confere com o diff. "Não mudam": `pipeline.yaml`, `run.sh`, `verify.yml`, `expected_suites.json`, `check_tdd.py`, `env_doctor.py`, `boundary.json`, `invariants.json`, `tests_core_mutants.js`, produto, suítes de gate — **intocados**; `CONTEXT.md` mudou **só** na Fase 0 (`dae68d0`, antes da spec). Mas **`known_issues.json` mudou** (`8b5be3e`, KI-4) pelo addendum IC-9/IC-10 ratificado nominalmente pelo proprietário em 2026-08-30, e a **E2 estendida** (`5d06cd1`, `p50`/`p52`) contraria o §Fora de escopo ("reancorar mutante de `p50`/`p52` … classificar e registrar") — extensão feita **sob delegação do proprietário** (matriz §8, cabeçalho), pelo caminho que o Risco 1 previa (escalar). Em ambos os casos o **texto da spec não foi emendado** | **não conforme — `spec-errada`** (gap G2): a spec descreve um escopo e uma lista que decisões posteriores ratificadas tornaram falsos |
| 28 | **R3** · red provado e **commitado** antes da implementação; autor do gate ≠ implementador; tipagem | reds `f89ab95` (2026-08-29, IC-1/2/4/5/6, 14 problemas) → green `d126753`; `8181f05` (IC-4, as quatro) → `6d0a581`; `2f60e2c` (IC-9) → `8b5be3e`; `bab7e35` (IC-10) → `95dfc0c` — ordem provada pelo git; `check_tdd` confere `red.commit`; julgador (`qa-engineer`) ≠ harnesses (`build-engineer`). O `planning-state` não listava IC-10 nem o SHA do quarto red — **completado nesta validação** | **conforme** |
| 29 | **R8** · repin no mesmo PR | 19 execuções de `gen_pins.py`; `[PASS] baseline` no CI do PR | **conforme** |
| 30 | **R10 §3** · `expected_suites.json` byte-idêntico (harness não é suíte registrada) | fora do diff do PR | **conforme** |
| 31 | **R3 §5 / T028** · mutantes do gate novo (`M-IC1`…`M-IC9`) matando a asserção correspondente | antes desta validação a prova vivia **dispersa** (red-integridade.md §Falsificação, P1–P6, contra um *stub* de C1; `M-IC1/2/3` como "estado de hoje"); **hoje executados formalmente**, sobre a implementação real, na efêmera: **9/9 mortos**, cada um pela linha do seu gate (matriz §20) | **conforme** (fechado nesta validação — era a pendência (3) do PO) |
| 32 | **Achados** · EA-4, EA-5, EA-6 escritos juntos pelo `doc-writer` depois do EA-3 na `develop`; EA-6 habilita EA-5; EA-7 nascido na E3 | `.claude/BACKLOG.md`: EA-4 `:474`, EA-5 `:554`, EA-6 `:629` com a seção "EA-6 habilita o EA-5" `:663`, EA-7 `:707`; commits `0c3f752` (W8) e `b566d9c` (E3) | **conforme** |
| 33 | **Cross-check** · nenhuma invariante tocada; `invariants.json` byte-idêntico; nenhum protegido; INV-1 não acionada | `invariants.json`/`boundary.json` fora do diff; `m41` `[PASS]` no CI do PR; `P50-GOV1` PASS hoje; nenhuma PARADA pedida | **conforme** |
| 34 | **Fora de escopo** (demais itens) · sem byte de produto; sem editar `tests_core_mutants.js`; sem stage/pipeline; sem expandir P50/P52; recibo da `p50` e `exit` parcial não corrigidos (Risco 6); contagem de sobreviventes não pinada (Risco 2) | tudo conferido no diff e na matriz (agregados P50/P52 intactos; `receipts` da `p50` segue `P50-5.0.5-mutation.json`; a spec não pina "1 e 1" — a E3 classificou **o que apareceu**: dois não-KILL, com saídas distintas) | **conforme** |
| 35 | **Riscos** · 3 (sobrevivente = gate sem poder discriminante ⇒ **parar**, achado, correção fora) · 4 (borda 8 em dívida com cadeia) · 5 (colisão de id) | `M51-01` ⇒ EA-7 + KI-4 com remoção auto-executável (IC-9.3), correção **não** feita (é a 014); `dividas_declaradas[11]` (borda 8); EA-4/5/6 só depois do EA-3 (T023/T025) | **conforme** |

## Score

**32 conformes de 35 — 91,4 %.** Três gaps: **dois de classe `spec-errada`**
(G1, G2) e **um de classe `faltando`, declarado com causa** (G3). **Nenhum gap de
classe `implementação-divergente`**: nada do que a 013 entregou diverge do que a
spec pede; o que diverge é o texto da spec em relação a decisões que a superaram,
e duas provas que o ambiente não deixou executar.

### G1 — IC-2, cláusula "exit 0" sob `MUTATION_DEFER_MISSING=1` (spec-errada)

A spec diz, no mesmo documento: (i) IC-2 — "a mesma execução com
`MUTATION_DEFER_MISSING=1` ⇒ `[DEFER]` nomeado, **exit 0**"; (ii) T6 — "exit 0
**sse** interpretador resolvido e toda âncora com `ocorrencias == 1`"; (iii)
§Comportamento especificado — "Interpretador ausente: preflight ⇒ `interpretador
ausente`, **exit ≠ 0**". Com interpretador ausente, (ii) e (iii) obrigam IC-4 a
reprovar o stage, e é o que acontece — os `[DEFER]` saem nomeados (a semântica de
`:69-75` está intacta), mas o **exit do stage** é 1. A cláusula (i) foi escrita
com o laço de trigger em mente, antes de o preflight passar a resolver o
interpretador. **Direção**: manter o comportamento (é o mais forte; afrouxar IC-4
para "deferir interpretador ausente" seria R10 §1 ao contrário) e emendar o texto
de IC-2 para "`[DEFER]` nomeado no laço; o exit do stage segue ≠ 0 por IC-4
enquanto o interpretador não resolver". Errata é do `product-owner` +
`tech-lead`, com aprovação do usuário; a spec é pinada (repin).

### G2 — escopo e lista "Não mudam" desatualizados por decisões ratificadas (spec-errada)

Duas decisões posteriores à spec, ambas com trilha, não voltaram ao texto:
o **addendum IC-9/IC-10** (ratificação nominal do proprietário em 2026-08-30,
registrada nos reds `2f60e2c`/`bab7e35` e no `planning-state`), que fez
`known_issues.json` mudar e criou dois gates sem linha na tabela de critérios; e
a **E2 estendida** às quatro âncoras de `p50`/`p52` (delegação de 2026-08-29,
matriz §8), que o §Fora de escopo proibia. A spec de hoje, lida sozinha, descreve
um instrumento **menor** do que o entregue — é a divergência que "engana o leitor
da spec" (skill, passo 4), ainda que na direção do fortalecimento. **Direção**:
errata única com as linhas IC-9/IC-10 (asserção, mutante previsto, ratificação),
`known_issues.json` movido para "mudam", e a E2 estendida registrada como escopo
delegado com a razão dura da matriz §8 ("sem elas o IC-4 fica vermelho para
sempre"). Dono: `product-owner` + `tech-lead`; aprovação do usuário; repin.

### G3 — T9, prova (c) não executada em 2 das 8 reancoragens (faltando, declarado)

`M51-16` (`P51-PDF1`) e `p52/V322-M3` (`V322-CTXPAR1`) têm (a) e (b) fechadas
— (b) no job `visual` do PR — mas a **sobrevivência com a asserção neutralizada**
exige rodar o gate Chromium sobre uma cópia neutralizada, o que o CI não faz e a
máquina da demanda não podia. Está declarado com causa em `dividas_declaradas`
[8] e [9] (e [13] para o `reason` de `P50::M51`), como a spec manda fazer com o
que não roda fora do CI. Conta como gap porque a exigência é "três provas
cumulativas por âncora" e o registro honesto não a substitui. **Direção**:
executável agora — nesta sessão ficou provado que **Chrome estável 152 sob
Playwright 1.62.1** reproduz o veredito do CI (controle de `D011-CON1` deu
**8,82:1**, o mesmo número do run 33426062475), e `tests_p50_chromium.js`
(3 ocorrências de `CHROME_PATH`) e `tests_p52_chromium.js` (1) honram
`CHROME_PATH`; `pdftotext` existe no PATH. Rota não-canônica em worktree efêmera,
registrada na matriz como tal; a canônica segue sendo o rito do proprietário.
Dono: `qa-engineer`. Não feito aqui: é E2, não validação.

## Fora da spec — medidos, ratificados nominalmente

| gate | o que mede | prova hoje | mutantes |
|---|---|---|---|
| **IC-9** · exceção nominal de mutante sobrevivente (`known_issues.json`, `lint: mutation-sobrevivente`) — nominal a harness+mutante+gate, com prazo; objeto vivo; obsolescência por registro (IC-9.3) e por execução (laço); perdão **impresso** | `[OK] IC-9: KI-4: p51/M51-01 existe no harness … prazo: Merge da demanda 014…` · `[OK] IC-9: KI-4 … segue não-KILL no registro (SOBREVIVENTE, 2026-08-29) · gate P51-VIS1 · classificação: gate sem poder discriminante (achado EA-7)` · `[OK] IC-9: mut_perdao discrimina nos 7 cenários da sonda`; no CI do PR o perdão saiu **impresso** (`[EXCEÇÃO] KI-4 …`) e a campanha `p51` fechou `0 problema(s)` | `M-IC10`…`M-IC18` mortos no red `2f60e2c` (tabela em `red-excecao-nominal.md`); `M-IC19` (laço que não consome o perdão) declarado — morre só na fiação |
| **IC-10** · guarda de leitura parcial no perdão (contrato C6): campanha truncada cujo único não-KILL é o perdoado **não** sai verde; recusa impressa com os números; relato `LEITURA PARCIAL` preservado | `[OK] IC-10: acordo de forma C5→C6` · `[OK] IC-10: mut_guarda_leitura discrimina nos 8 cenários da sonda` · `[OK] IC-10: regressão: mut_relata segue emitindo LEITURA PARCIAL (2 lidos × 5 declarados)` | `M-IC23`…`M-IC28`, `M-IC30` mortos no red `bab7e35`; `M-IC29`/`M-IC31` (fiação) declarados |

Os dois blocos são **aditivos** (contadores e fechos próprios) e não tocaram
IC-1…IC-6. Falta-lhes a linha na spec — é o G2.

## O ponto do deferimento fechou — no CI do próprio PR #29

A pendência que o `product-owner` deixou nominalmente para o `qa-engineer` —
*"não há na árvore evidência de que o job `visual` do PR #29 executou as
campanhas delegadas"* — está respondida por leitura de log, não por presunção:

- o job `verify` do run **33295007844** passou com `MUTATION_DEFER_MISSING=1`
  (`[PASS] mutation`) — **é o defer**, e sozinho não prova nada;
- o job `visual` do **mesmo run** (id **99213051082**, 1h05m) executou a seção de
  integridade com **0 problemas**, `p50` **53/53**, `p51` **19/20** com o
  perdão da KI-4 **impresso** para `M51-01` e `p52` **107/107**, fechando
  `mutation: 3 campanha(s) executada(s) · 0 problema(s)` às **06:40:17Z**;
- o merge (`2426582`) aconteceu às **06:41:22Z** — o deferimento fechou
  favoravelmente **antes** do merge, no head exato do PR (`a774c36`);
- o push resultante na `develop` (run **33297472877**) também passou.

O que **não** fechou — e continua como dívida com dono — é a **borda 8**
estrutural (`dividas_declaradas[11]`): nada no `verify.yml` vincula o `[DEFER]`
do job `verify` à execução do job `visual`; a conferência acima foi **manual**
(`gh run view … --log`), e é isso que a borda pede que deixe de ser necessário.

## Observações que não são gaps de spec

1. **A fase não pode ir a `done` nesta escrita**, e a razão está toda acima:
   G1/G2 exigem errata de spec com aprovação do usuário (skill: gap
   `spec-errada` nunca se resolve afrouxando o gate; corrigir a spec exige
   aprovação); G3 tem dono e rota; e a condição **(1)** do aceite do
   `product-owner` — `relatorio-final.md` (T031, `doc-writer`) — segue não
   atendida, sendo que **toda** demanda em `done` neste repositório (009, 010,
   011, 012, 015) tem o seu. Mover agora seria o carimbo que a 014 combate.
   O `planning-state` recebe `validate.conformance` (o que `check_tdd.py:37`
   cobra em `done`) para que a transição, quando autorizada, seja a troca de um
   campo.
2. **Iteração 1 de 2** (limite da skill). G1 e G2 não se resolvem por conserto
   de engenheiro; G3 não se resolve por texto.
3. `red.gates` do `planning-state` omitia `IC-10` e o SHA `bab7e35` — completado
   nesta escrita por execução de `git log`, com o texto anterior preservado
   (R2 §5).
4. A auto-exclusão nominal de IC-1 cobre `specs/013-integridade-da-campanha/`
   inteiro — este arquivo carrega os literais proibidos e por isso não reprova o
   gate (R10 §10, decisão T002).
5. Os arquivos pinados tocados pelo fecho (`mutation-matrix.json`,
   `expected_suites.json`, `matriz-gate-mutante.md`, este arquivo novo) deixam o
   `baseline` local vermelho até o `gen_pins.py`, que é commit próprio do
   proprietário — esperado, reportado, não regressão.
