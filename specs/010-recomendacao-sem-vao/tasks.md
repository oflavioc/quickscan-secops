# Tarefas — 010-recomendacao-sem-vao

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Derivadas de [plan.md](plan.md) — camadas, donos, ordem das 12 waves, boundary,
> restrições de source e protocolo de campanha já resolvidos lá — e julgadas pelos
> critérios de [spec.md](spec.md). Nenhum conteúdo dos dois é repetido aqui (R12).
> Eu proponho; a execução das waves é do orquestrador (R5).

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | `build-engineer` | chore | | `npm ci --no-audit` na raiz. `node_modules/` **não existe** nesta worktree e toda suíte jsdom faz `require("jsdom")` — sem isso nenhum red é provável. `node_modules/` está no `.gitignore`: a árvore segue limpa, pré-condição de `check_mutation.py:56-61`. **Nenhum arquivo versionado muda, nenhum commit, nenhum repin** | nenhum — habilita todos |
| T002 | 1 | `qa-engineer` | chore | [P] | `fixtures_010_vao.js` (**novo**): `D010-F1`, `F1b`, `F2`, `F3` **e `F4`** + `d010AssertFixtureStates` e os helpers `d010MapKeys(w)` / `d010EquivalenciaNome`, no padrão de `fixtures_009_leitura.js`. **Alteração de 2026-08-30 (errata de vacuidade da spec, E3/E4/E5/E7):** `MAP`/`PRODUCTS`/`QS`/`ans` **não existem em `window`** — são `const` de topo de script clássico —, e o acesso é isolado nos helpers, **sem bridge novo** (R-3; expor pelo `__DEV` exigiria editar arquivo `frozen`). A quinta fixture **`D010-F4`** carrega os casos que faltavam: `vulnerability-management` e `monitoring-coverage` respondidos em **nível 0**, com alvo nos dois, suficiência **ABERTA** — é o par de `D010-CARD2` (b), de `D010-CARD4` (c1)/(c2) e a metade ABERTA do diferencial de `D010-CARD3` (c). Ela é **fixture nova, não emenda de `F1`/`F2`**, porque as duas respostas movem o vetor e com ele os censos (`basePresented` 4 → 6, `baseInV32Base` 2 → 4 em `F1`): `F1`, `F1b` e `F2` ficam **byte-idênticas**. **`D010-F3` ganha `vulnerability-management` = 0 com alvo** — `confirmedCount()` 4 → 5, gate **ainda FECHADO** (`5 < 10`), sem o qual `D010-CARD3` (b) é verdadeiro por estado e não por gate. Estado aplicado **só** por owners canônicos (`__DEV.setAnswerById`, `setPriorities`, `setTarget`, editor de contexto + `#v32save`), nunca por escrita direta de derivado. **`D010-F2` fixa `logs` no nível 0** — com nível 2 o estado é `POSSIBLE_CONTEXT_DIVERGENCE`/`VALIDATE` com **zero** candidatos e `D010-CARD2` (a) fica vacuoso enquanto `D010-ARB2` (b) falha (errata de 2026-08-30, medida no engine, não inferida). Cada fixture **declara e prova por execução** o estado que alcança. `fixtures_p52.js` e `fixtures_p50.js` **não** são alterados | pré-requisito dos 13 gates |
| T003 | 1 | `build-engineer` | chore | | **Repin R1** — `gen_pins.py` **depois** do commit de T002. `fixtures_010_vao.js` é rastreado novo e, sem pin, `check_baseline.py:53-61` sai `[FAIL] rastreado sem pin`. Motivo no commit | stage `baseline` |
| T004 | 2 | `data-engineer` | chore | [P] | Ratificar a tabela de equivalência contra `OFFERINGS`, `SERVICES` e `ICON_MAP_V32`, decidindo as **duas** linhas marcadas "a ratificar" em [plan.md](plan.md) §"Tabela de equivalência de catálogo": `FortiNDR → ndr-family` (contra `fortindr-onprem`/`fortindr-cloud`) e `FortiGuard-Service-Bundle → sem equivalente V3.2`. **Leitura pura: não escreve arquivo nenhum e não commita.** A decisão volta na resposta e o orquestrador a registra no planning-state. **Divergência volta ao plano antes de T008** — nunca é resolvida dentro da implementação | pré-requisito de `D010-CARD4` (a) |
| T005 | 3 | `qa-engineer` | feature | | `tests_010_vao.js` (**novo**) com os **13** gates — `D010-ARB1`, `ARB2`, `ARB3`, `ARB4`, `INV7`, `ABS1`, `CARD1`, `CARD2`, `CARD3`, `CARD4`, `CARD5`, `CARD6`, `PAPEL1` — **+** entrada `d010` em `.claude/verify/expected_suites.json` **no mesmo commit** (`check_suites.py:53-56` reprova `tests_*.js` fora do registro). Restrições que viajam no prompt: o oráculo de `ARB1` (d) faz o censo V3.2 **antes** de `V32.resetLandscapeToUnset()` (invertido, destrói a declaração antes de medi-la); `CARD3` (a) alcança `tgtComparisonPublishable` **sem** exposição nova (já é global, `ui_target_v32.js:88`); `CARD4` (a) deriva as 11 chaves por **`d010MapKeys(w)`**, **nunca** da tabela do produto e **nunca** de `w.MAP`, que não existe (errata, E7); `CARD4` (c) tem **duas** direções no mesmo card de `D010-F4` — (c1) o homônimo **anexado** funde, (c2) o homônimo **não anexado** (`FortiGuard-MDR-Service`) **sobrevive** —, com os nomes re-derivados por `d010EquivalenciaNome`; `CARD3` (c) é **diferencial entre fixtures** (`D010-F4` ABERTO × `D010-F3` FECHADO, mesmo par qid+nível) e o oráculo **não** altera nem reimplementa `dataSufficiency`; `CARD4` (e) é scanner com escopo (`ui_target_v32.js`) e **auto-exclusão nominal impressa** (R10 §10). O commit é o de T006 | os 13 `D010-*` |
| T006 | 3 | `qa-engineer` | chore | | **Prova de red.** Executar a suíte, **nomear o FAIL de cada gate** e nomear igualmente os que **nascem verdes**, commitar o vermelho com a mensagem exata de §"O red" e registrar `red.status: proven`, `red.commit` e `red.gates` no planning-state. `check_tdd.py:29-35` confere por `git cat-file` que o commit existe | stage `tdd` |
| T007 | 3 | `build-engineer` | chore | | **Repin R2** — depois do commit do red. Entram `tests_010_vao.js` (novo) e `expected_suites.json` (alterado) | stage `baseline` |
| T008 | 4 | `ui-engineer` | feature | | `ui_target_v32.js` — **uma delegação, um módulo, um diff**: tabela de equivalência (constante, **total** sobre as 11 chaves, com a decisão de T004) + `tgtValidateHTML(qid, cmpPub)` novo, chamado **imediatamente depois** de `tgtEnablersHTML` nos dois sítios do card (tela `:131-132`, papel `:363-364`) + `__DEV.TGT_EQUIV`. `tgtEnablerState` é chamada com **`0`** — predicado de contexto, e é assim que serviço do engine não bloqueia o `MAP` — e permanece **byte-idêntica**, como `tgtEnablersHTML` e `tgtAbsenceHTML`. Nó **irmão** `[data-ux-enablers="a-validar"]`: atributo novo, **nunca** outro valor de `data-ux-absence`, e **sem** a classe `.ux-tgt-en` (R-1). **Fusão por `data-eid` contra o conjunto EFETIVAMENTE ANEXADO no card** — candidatos e serviços do engine no mesmo passe —, **nunca** contra o domínio da tabela de equivalência (errata, E9): `SOCaaS` funde com o serviço `fortiguard-socaas` anexado, e `FortiGuard-MDR-Service` **sobrevive** no mesmo card porque `fortiguard-mdr` **não** está anexado (inelegível sob 100% UNSET). Deduplicar pela tabela apagaria "FortiGuard MDR" do relatório — é o que `M19` mata, e `M18` mata a direção oposta. Ordem do catálogo preservada entre os itens que sobram. Ícone por `window.__V32UI.iconFor(idEquivalente, nome)`, nunca `c.p` cru. `__V32UI` **não** cresce (R-3). Zero CSS, zero bridge novo | `D010-CARD1` `CARD2` `CARD3` `CARD4` `CARD5` `CARD6` · `PAPEL1` (a) · regressão `D009-UNS1` `D009-ABS1` `N45` `N46+K` `A17-A19` |
| T009 | 4 | `build-engineer` | chore | | **Repin R3** — depois do commit de T008. `ui_target_v32.js` é pinado | stage `baseline` |
| T010 | 5 | `build-engineer` | chore | | `python build_v32_html.py`. **Pré-condição do verde, não acabamento**: as suítes jsdom bootam o HTML gerado, não os módulos-fonte. `quickscan_secops_soccmm_v3_2_dev.html` é classe `generated` e **nunca** é editado à mão. Conferir que `declared.m41_payload_sha256` **não** mudou; se mudou, **PARAR** (Porta B, não autorizada) e `git revert` desta wave | stage `build` · stage `m41` |
| T011 | 5 | `build-engineer` | chore | | **Repin R4** — depois do commit de T010 (o HTML gerado é pinado) | stage `baseline` |
| T012 | 6 | `qa-engineer` | chore | | **Medição isolada do primeiro módulo.** Suítes `target`, `journey`, `icons46`, `ux41`, `d009`, `ui31`, `ui32`, `p52layout` **+ campanha `d009`** (node+python), sob o protocolo de árvore limpa de [plan.md](plan.md) §Waves (os três passos). Um único arquivo de produto mudou: **qualquer queda de `D009-*` tem causa inequívoca**. Vermelhos **declarados, não achados**: `p50core` (pins de `PROTECTED`, fecha em T023) e `p52` (`[FAIL] campanha EXIGIDA … ambiente sem chromium`, fecha no CI). Resultado no planning-state; **sem commit de conteúdo, sem repin** | stage `suites` · stage `mutation` (`d009`) |
| T013 | 7 | `ui-engineer` | feature | | `ui_v32.js` — **uma delegação, um módulo, um diff**: (a) `hasSubstituteV32(ctxRes)` **puro**, com as três cláusulas da spec §1, calculado **uma vez** no ramo não-legado entre `:245` e `:277` e passado a `hideLegacyRecommendation` no lugar da constante `true`; (b) `baseAbsenceHTML(ids, ctxs, isScreen)` — **helper único**, duas superfícies — substituindo os N `baseCardHTML` **apenas** em `#v32base` (`:669-672`) e `#pr-sup-base` (`:1183`); (c) 4º parâmetro `afirmaPreservacao` em `baseCardHTML`/`renderCap`/`prCards`, **default falsy de propósito** (papel passa `false` sempre); (d) `__DEV.hasSubstitute`. Byte-idênticos: `HIDE_EYEBROWS` (`:109-110`) e a **regra** da varredura (`:164-194`) — a interrupção `hiding=false` no nó não permitido (`:193`) não pode ser reordenada, reindentada nem "limpa", porque `U15` mede o alcance. Intocados: `presentationOf`, `#v32prio`, `#v32maturity`, `QS_GAP_SUPPORT`, `qsGapSupportHTML`, `__V32UI` e o ramo legado (`:237`). Zero CSS | `D010-ARB1` `ARB2` `ARB3` `ARB4` `INV7` `ABS1` · `PAPEL1` (b) · regressão `U1` `U2` `U7` `U15` `V10` `V15`–`V17` `P1` |
| T014 | 7 | `build-engineer` | chore | | **Repin R5** — depois do commit de T013 | stage `baseline` |
| T015 | 8 | `build-engineer` | chore | | `python build_v32_html.py` (segundo rebuild). Mesma conferência de `m41` de T010 | stage `build` · stage `m41` |
| T016 | 8 | `build-engineer` | chore | | **Repin R6** — depois do commit de T015 | stage `baseline` |
| T017 | 9 | `qa-engineer` | chore | | **Verde e medição isolada do segundo módulo.** Executar `tests_010_vao.js` **e** as suítes congeladas que `ui_v32.js` alcança (`ui31`, `ui32`, `ui332`, `ux41`, `target`, `journey`, `icons46`, `d009`, `p52layout`, `engine`) — a simetria com T012 é o que dá sentido à serialização das duas waves de produto — e **fixar a contagem de `d010` no verde** em `expected_suites.json`, por execução, nunca pelo total declarado na spec. Contagem congelada que mude ≠ `p50core` significa vazamento para superfície alheia: **parar e reabrir a análise**, nunca ajustar o registro | stage `suites` |
| T018 | 9 | `build-engineer` | chore | | **Repin R7** — depois do commit de T017 | stage `baseline` |
| T019 | 9 | `qa-engineer` | chore | | `tests_010_mutants.js` (**novo**, **18** mutantes executados de **20** declarados na spec — `D010-M1..M20` menos `M3`/`M4` —, em correspondência 1:1 com os ids da spec. `M18`/`M19` (as duas direções da fusão, no card de `monitoring-coverage` sob `D010-F4`) e `M20` (arbitragem parcial: título sem os blocos contíguos, sob `D010-F2`) foram acrescidos em 2026-08-30 pela errata; **`M3`/`M4` NÃO são implementados** — medidos sem caso nas fixtures e registrados como dívida em T021, nunca como mutante sintético) **+** harness `d010` em `mutation_map.json` (`requires: [node, python]`; alvos `ui_v32.js`, `ui_target_v32.js`, `tests_010_vao.js`, `fixtures_010_vao.js`, `tests_010_mutants.js`) **no mesmo commit**. **`"preflight": true` e a leitura de `--preflight` em argv nascem nesse mesmo commit** (D4 da 013): `check_mutation.py:283-296` roda o preflight de todo harness fora de `IC_SEM_PREFLIGHT` **independente de trigger e de ambiente**, então um `d010` sem ele **reprova IC-4 e derruba o stage inteiro mesmo com a campanha verde**. O relato emite o vocabulário de três estados (`DETECTADO`/`SOBREVIVENTE`/`NÃO EXECUTADO`) no formato de `emitir()`; se o custo se mostrar alto, a saída é **declarar a dívida** em `mutation-matrix.json → dividas_declaradas`, nunca omiti-la. Os `find` só podem ser escritos agora: ancoram no código de T008 e T013 | R3 §5 · IC-4 |
| T020 | 9 | `build-engineer` | chore | | **Repin R8** — depois do commit de T019 | stage `baseline` |
| T021 | 9 | `qa-engineer` | chore | | Executar as campanhas **`d010`, `d009` e `core`** (as três são node+python) com **árvore limpa**, sob os três passos do protocolo, e registrar os **18 pares** executados em `mutation-matrix.json` com `harness`, `gate` e `ultima_prova.resultado` — **mais** duas entradas em `dividas_declaradas`, cada uma com causa nomeada e nenhuma silenciosa: (i) a cláusula **A5** do predicado como **equivalente declarado** (removê-la é equivalente por construção, spec §E1); (ii) **`M3`/`M4`**, mutantes **sem caso nas fixtures** (a varredura, sob o workspace da 5.2, não alcança o nó que atacam; sabotagem nas duas formas não mudou veredito). Para `M3`/`M4` a dívida traz a **disposição de uma execução**: sabotar e rodar `ui31` (`U15`, `tests_ui_m31.js:268`, dono do alcance da varredura por R-5) — `U15` morrendo, a propriedade é medida fora do `d010` e a dívida fica com dono; `U15` sobrevivendo também, é **achado `EA-*`** para o `doc-writer`, não dívida — `check_tdd.py:47-52` exige os três. Aceite é **100% KILL** (R10 §5); sobrevivente é achado, não estatística. Depende de T017 e T019 já commitados **e repinados** | stage `mutation` · stage `tdd` |
| T022 | 9 | `build-engineer` | chore | | **Repin R9** — depois do commit de T021 | stage `baseline` |
| T023 | 10 | `build-engineer` | chore | | **Repin inline de `PROTECTED`** em `tests_p50_core.js`: **só** os dois hashes (`ui_v32.js` `:158`, `ui_target_v32.js` `:256`) + comentário-trilha com motivo, data, citação da §"Autorização nominal §29.4" da spec e **"Identidade anterior"**, no precedente vivo das erratas de 5.1, 5.2 e da 009 no próprio mapa. **Nenhuma asserção é tocada; nenhum gate nasce ou morre**; `frozenSuites` (`:400-403`) segue exigindo a presença das cinco suítes. Dono é o `build-engineer`, **não o QA**: quem escreve o hash não pode ser quem valida o gate que o consome (R3 §2) | `P50-GOV1` `P50-SUF0` `P50-SUF8` `P50-IC4` (a) |
| T024 | 10 | `build-engineer` | chore | | **Repin R10** — depois do commit de T023 (`tests_p50_core.js` é pinado) | stage `baseline` |
| T025 | 11 | `build-engineer` | chore | [P] | Job `visual` do CI (`.github/workflows/verify.yml:76-80`): campanhas **`p51`** e **`p52`**, disparadas por `ui_v32.js` e `ui_target_v32.js`, mais as suítes Chromium. Não há Chromium nesta worktree (sem `CHROME_PATH`, sem `%LOCALAPPDATA%\ms-playwright`): é **agendamento nomeado, não dispensa** — o job `verify` as delega por `[DEFER]` via `MUTATION_DEFER_MISSING=1` e o resultado volta em T027 | stage `mutation` (`p51`/`p52`) |
| T026 | 11 | `qa-engineer` | chore | [P] | `.claude/verify/run.sh` completo — `env-doctor`, `baseline`, `boundary`, `marker-lint`, `icons-check`, `build`, `lint-arch`, `state`, `tdd`, `m41`, `suites`, `suites-heavy`, `evidence-bridge`, `mutation` — e depois `spec-validate`. Confere **`p50core` de volta a 64/0** (fechamento da janela aberta em T008) e as contagens congeladas de [plan.md](plan.md) §Riscos. O stage `mutation` sai com **FAIL nomeado** para `p51`/`p52` (ambiente sem chromium): declarado, nunca SKIP (R10 §2) | todos os stages locais |
| T027 | 11 | `qa-engineer` | chore | | Registrar em `mutation-matrix.json` o resultado que o job `visual` devolveu para `p51`/`p52` — ou, se o job não fechar dentro do PR, a **dívida declarada** em `dividas_declaradas`, com precedente idêntico já registrado pela 009. `mutation-matrix.json` não é alvo de `p51`/`p52`: registrar não invalida a medição | stage `mutation` · stage `tdd` |
| T028 | 11 | `build-engineer` | chore | | **Repin R11** — depois do commit de T027 — e re-executar `baseline` + `boundary` para provar a janela de pin fechada. Se T027 tiver tocado qualquer coisa além do registro, T026 **repete** | stage `baseline` · stage `boundary` |
| T029 | 11 | `product-owner` | chore | | Aceite de intenção. Confere o reenquadramento (o relatório do cliente continha **menos** do que conteria se nada tivesse sido declarado) e recebe os achados **devolvidos e não absorvidos**: a duplicação de leitura no papel entre `pr-gapsup` e `#pr-target` nos 4 qids de `QS_GAP_SUPPORT`, a borda `UNASSESSED_CAPABILITY` + sinal (hoje inalcançável por qid de prática) e o item 6a, cuja decisão a spec **adiou por desenho** | aceite |
| T030 | 4 | `qa-engineer` | chore | | **Emenda do `d010AssertFixtureStates`** (errata **E10**), **antes** de T008 e depois do red `4d2d49d` — nesta ordem, senão o vermelho informativo é destruído. Duas migrações, nada apagado: (i) item 12, `titulosCongelados` mantém `texto` (presença da Camada 1, produzida por arquivo `frozen` — é a guarda anti-vacuidade) e **perde `oculto`**, que é saída de `ui_v32.js` e já é medida por `D010-ARB1` (b)/(d), `ARB2` (a) e `ARB3` (a)/(c); (ii) item 14, o censo de chips do DOM vira **payload do engine por alvo** (candidatos + serviços de `buildRecommendationContext()` por qid) — o `nItems` do discriminador S2-payload × S2-contexto (E2), estável no green porque o engine é `frozen`. `d010TargetEnablers(d)` **fica no arquivo** como helper dos gates de C10, com a guarda de agrupamento intacta. **Vetor de estado de nenhuma fixture muda**, logo nenhum censo se move. Ao fim, re-executar `d010` e **confirmar 1 PASS · 12 FAIL**: veredito diferente é achado, volta para decisão e não segue | `d010` (os 12 seguem vermelhos pelo critério, não pelo assert) |
| T031 | 4 | `build-engineer` | chore | | **Repin** de `fixtures_010_vao.js` depois do commit de T030 — próximo número da **série viva** (`git log`), pela regra que se autocorrige | stage `baseline` |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## Tipagem — as escolhas que não são óbvias

- **T005 é `feature`** porque carrega o tipo da demanda e é a tarefa que **produz**
  o red; o commit do red é T006. Mesmo par da 003 e da 009 (tarefa que escreve o
  gate + tarefa que prova o vermelho), não auto-referência.
- **T008 e T013 são `feature`, e o óbvio seria `fix`.** A leitura de defeito é
  legítima — o cliente recebeu zero recomendações — mas `fix` afirma que houve
  regressão contra um contrato declarado, e o cross-check da Fase 0 deu
  **resultado negativo**: nenhuma spec selada trata de recomendação ou de modo
  legado. O vão não contraria spec alguma; existe porque nenhuma o cobriu. O que
  as duas tarefas entregam é **comportamento novo** com marcadores novos
  (`[data-v32-absence="base-context"]`, `[data-ux-enablers="a-validar"]`), não
  restauração de comportamento anterior. A única violação de contrato real,
  INV-7 (`A4`), é corrigida **como consequência** e tem gate próprio
  (`D010-INV7`) dentro de T013. Em rigor a escolha é neutra — `feature` e `fix`
  exigem igualmente red provado —, então ela é só sobre nomear honestamente.
- **T019 é `chore`, não `feature`.** Campanha de mutação é instrumento de
  verificação, não comportamento de produto: sua prova não é um red, é o **KILL**
  registrado em T021. Tipá-la `feature` exigiria um `red.commit` que não existe
  semanticamente para ela — seria burocracia, não auditoria.
- **T017 é `chore`, não `refactor` nem `feature`.** Fixar contagem no registro é
  medição registrada; nenhum gate nasce, morre ou muda de asserção.
- **T023 é `chore` e é do `build-engineer`.** É manutenção de registry pelo rito
  da R8 §2, e o dono não é o QA por separação de poderes (R3 §2).
- **T004 é `chore`** porque não escreve arquivo nenhum: é ratificação de contrato
  por leitura, e o artefato que ela altera (se alterar) é o **plano**, não o código.
- **Nenhum `tdd_waiver` é previsto.** Se alguém precisar de um, é sinal de tipagem
  errada e a conversa acontece sobre o dado (R3, válvula 2).

## O red — quais tarefas o produzem, e a mensagem exata

**T005 escreve; T006 executa e commita.** É o **único** red desta demanda: as duas
tarefas `feature` de implementação (T008 e T013) consomem esse mesmo vermelho, cada
uma com o subconjunto de gates que a julga. Não há segundo red — o que separa as
duas implementações é a medição isolada (T012 e T017), não um novo ciclo.

Mensagem exata do commit de T006:

```
test(010): red — D010-ARB1..PAPEL1 (13 gates) e registro de d010 em expected_suites
```

**Gate que nasce verde é declarado, não escondido.** Três são candidatos, e a
medição é de T006, não minha: `D010-ARB2` (a supressão sob `F2` já é o
comportamento de hoje), `D010-ARB3` (c) e `D010-CARD3` (nenhum nó `a-validar`
existe hoje, então a alínea (b) passa vacuosamente — (a) e (d) são reais). O
relatório de T006 **nomeia** cada um; gate nascido verde sem mutante que o mate é
buraco de cobertura, não economia, e é T021 quem prova o poder discriminante deles.
Precedente vivo: 4 dos 15 gates da 009 nasceram verdes e só os mutantes os
qualificaram.

**Consequência declarada, para ninguém "consertar":** a partir do commit de T006 o
stage `suites` fica vermelho **por definição** até T017, e o `baseline` fica
vermelho na janela de **um** commit entre cada conteúdo e o seu repin. Vermelho
previsto não é vermelho tolerado — quem adiar um registro para "ficar verde" troca
um vermelho esperado por um buraco de cobertura.

## O gate viaja no prompt de cada implementação (R3 §3)

Quem implementa **não escreve o próprio critério de aceite** e recebe tudo pronto,
por caminho de arquivo, sem reescrita:

| Tarefa | Gates que a julgam | O que mais viaja no prompt |
|---|---|---|
| **T008** (`ui_target_v32.js`) | `D010-CARD1`, `CARD2`, `CARD3`, `CARD4`, `CARD5`, `CARD6` e **`PAPEL1` (a)** | `specs/010-recomendacao-sem-vao/spec.md` → §"Critérios de aceite → gates" (C7–C12, C13) e §4 "Habilitador a validar"; `specs/010-recomendacao-sem-vao/plan.md` → §"Restrições que só o source (e a execução) revelam" itens **1, 2, 3, 4, 5, 9, 10** e a linha de `ui_target_v32.js` da tabela de módulos, com a coluna **"o que explicitamente não muda"**; a tabela de equivalência **com a decisão de T004**; o commit do red (T006) |
| **T013** (`ui_v32.js`) | `D010-ARB1`, `ARB2`, `ARB3`, `ARB4`, `INV7`, `ABS1` e **`PAPEL1` (b)** | `spec.md` → §"Critérios de aceite → gates" (C1–C6, C13) e §§1, 2, 3, 5 de "Comportamento especificado"; `plan.md` → §"Restrições…" itens **7 e 8** e a linha de `ui_v32.js` da tabela de módulos, com **"o que explicitamente não muda"**; o commit do red (T006) |

`D010-PAPEL1` é o **único gate de autoridade dividida**: a alínea (a) depende de
T008 e a (b) de T013, e ele só fecha depois da wave 7. Viaja nos dois prompts com a
alínea nomeada — quem receber o gate inteiro e vir a outra alínea vermelha vai
tentar consertar arquivo que não é dele.

## Campanha — onde roda, por quem, disparada por quê

Medido no `mutation_map.json`, não de memória. `check_mutation.py:1287` deriva o
gatilho do diff **commitado** contra `merge-base(HEAD, origin/develop)`: a partir de
T008 as campanhas ficam exigidas em **toda** execução do stage.

| Momento | Harness disparado | Roda aqui? | Tarefa · dono | Onde fecha |
|---|---|---|---|---|
| depois de T008 + T010 (waves 4–5) | `p52` e `d009` — os dois têm `ui_target_v32.js` como alvo | `d009` **sim**; `p52` **não** (chromium ausente) | **T012** · `qa-engineer` | `p52` no job `visual` do CI (T025) |
| depois de T013 + T015 (waves 7–8) | `core`, `p51`, `p52`, `d009` — os quatro têm `ui_v32.js` como alvo — mais `d010`, que passa a existir em T019 | `core`, `d009` e `d010` **sim**; `p51`/`p52` **não** | **T021** · `qa-engineer` | `p51`/`p52` no job `visual` (T025); resultado registrado por **T027** |
| — | `p50` | **não é disparado**: nenhum alvo seu muda nesta demanda | — | — |

**Protocolo obrigatório** (`check_mutation.py:56-61` recusa árvore suja, e campanha
abandonada deixa mutante aplicado — foi o custo real da 009): `git status
--porcelain` vazio **antes**; campanha nunca interrompida e **nenhum outro agente
atuando na worktree enquanto ela roda**; `git status --porcelain` vazio **depois** —
se não estiver, `git checkout --` no arquivo mutado e **reportar**, nunca commitar
por cima. A guarda de `check_mutation.py:1362-1366` só protege quem chegou ao fim.

**Campanha depois de cada correção, não uma vez no fim.** Toda correção posterior a
T012, T021 ou T026 re-executa as campanhas que o ambiente suporta **antes** de
seguir, e o repin correspondente se repete. Se a correção tocar `ui_v32.js` ou
`ui_target_v32.js` depois de T023, o repin inline de `PROTECTED` **e** o
`gen_pins.py` se repetem, nesta ordem.

**Ler não-KILL da campanha `d009` não funciona hoje**: ela declara preflight mas não
emite o vocabulário de três estados (dívida declarada da 009), então
`check_mutation.py` nunca consegue nomear um não-KILL dela. Quem precisar do
detalhe lê o stdout do harness, não o relato do stage. É exatamente a dívida que
T019 não repete.

## Repin — a granularidade decidida aqui

O plano fixou a **natureza** (um `chore` de `gen_pins.py` por commit de conteúdo que
toque arquivo pinado, sempre **depois** dele, porque `gen_pins.py` calcula sobre os
blobs de **HEAD**) e deixou a granularidade para esta fase. Ela é **derivada**, não
estimada: um repin por commit de conteúdo desta decomposição.

| Repin | Tarefa | Vem depois do commit de | Entra no registry |
|---|---|---|---|
| R1 | T003 | T002 | `fixtures_010_vao.js` (novo) |
| R2 | T007 | T006 (o red) | `tests_010_vao.js` (novo), `expected_suites.json` |
| R3 | T009 | T008 | `ui_target_v32.js` |
| R4 | T011 | T010 | `quickscan_secops_soccmm_v3_2_dev.html` |
| R5 | T014 | T013 | `ui_v32.js` |
| R6 | T016 | T015 | `quickscan_secops_soccmm_v3_2_dev.html` |
| R7 | T018 | T017 | `expected_suites.json` |
| R8 | T020 | T019 | `tests_010_mutants.js` (novo), `mutation_map.json` |
| R9 | T022 | T021 | `mutation-matrix.json` |
| R10 | T024 | T023 | `tests_p50_core.js` |
| R11 | T028 | T027 | `mutation-matrix.json` |
| R\<viva\> | T031 | T030 (emenda do assert, errata E10) | `fixtures_010_vao.js` |

**Regra que se autocorrige** (três demandas seguidas erraram a contagem): a série
R1..R11 é a previsão **desta** decomposição; commit de conteúdo extra que toque
pinado herda o **próximo** número da série e ganha uma tarefa `[TNNN]` própria ao
fim da lista — os ids são permanentes, a contagem não é sagrada. Mensagem no rito
vivo desta branch: `chore(010): gen_pins — repin R<n> (<motivo em uma linha>)`.

**Commit de planning-state não pede repin**: `.claude/project-memory/**` está em
`pins.json → _meta.exclusoes`. **T001 não gera commit nenhum** (`node_modules/` é
ignorado) e **T004 e T012 tampouco** (leitura e medição).

## Colisão de arquivo — as decisões, com o motivo

- **`ui_target_v32.js` (T008) e `ui_v32.js` (T013) têm o mesmo dono** e **nunca**
  aparecem na mesma wave. Três waves os separam, com rebuild e medição isolada
  entre eles. O critério não é conveniência: `ui_target_v32.js` é o que arrisca a
  009, e isolá-lo torna qualquer queda de `D009-*` inequívoca. Fundi-los numa
  delegação faria a causa virar adivinhação.
- **`expected_suites.json`** aparece em T005 (registro) e T017 (contagem verde):
  waves 3 e 9, nunca `[P]` entre si. **`mutation_map.json`** só em T019.
  **`mutation-matrix.json`** em T021 e T027, waves 9 e 11.
- **`pins.json` é escrito por onze tarefas**, todas do `build-engineer`, todas
  serializadas, sempre com um commit de conteúdo entre duas delas. Mesmo dono,
  nunca `[P]`.
- **`tests_p50_core.js`** é tocado só por T023, e pelo `build-engineer`. O
  `qa-engineer` que valida `P50-GOV1`/`P50-IC4` nunca abre esse arquivo.
- **Nenhuma tarefa de `ui-engineer` abre `tests_*`, `fixtures_*` ou registro
  `.json`; nenhuma tarefa de `qa-engineer` abre módulo de produto.**
- **Zero CSS: nenhuma tarefa desta demanda abre um `.css`.** Se alguma precisar,
  isso é PARADA — ver a seção seguinte.

## Wave 2 é a única paralela entre waves

`[P]` significa "paralelizável dentro da wave". **T004 é a exceção nomeada**: o
plano aprovado a marca `[P]` **com a wave 1**, e isso é seguro por um motivo
verificável, não por conveniência — T004 **não escreve arquivo nenhum**. As duas
delegações (T002 e T004) saem na mesma mensagem, para donos diferentes, em
domínios que não se tocam. **Nenhuma outra wave roda em paralelo com outra que
escreva em arquivo de produto ou de teste**: a contaminação da 009 veio de dois
agentes na mesma worktree com campanha em curso, e o preço foi mutante aplicado
sobrevivendo num commit.

Dentro da wave 11, T025 (CI) e T026 (local) são `[P]` porque nenhuma das duas
escreve; T027 e T028 são serializadas depois delas.

## Registros no mesmo PR — tarefa e wave de cada um

| Registro | Tarefa | Wave | Por que ali |
|---|---|---|---|
| `expected_suites.json` — entrada `d010` | T005 | 3 | mesmo commit da criação de `tests_010_vao.js`: `check_suites.py:53-56` reprova suíte fora do registro |
| `expected_suites.json` — contagem verde | T017 | 9 | a contagem só existe depois do verde, e é medida, não declarada |
| `mutation_map.json` — harness `d010` com `preflight: true` | T019 | 9 | mesmo commit em que o harness passa a ler `--preflight` (D4 da 013); sem isso IC-4 derruba o stage mesmo com a campanha verde |
| `mutation-matrix.json` — **18** pares executados (de `D010-M1..M20`) + duas dívidas declaradas (A5 equivalente; `M3`/`M4` sem caso) | T021 | 9 | o par exige `ultima_prova.resultado`, que só existe após a campanha; dívida entra com causa e disposição, nunca como par vazio |
| `mutation-matrix.json` — `p51`/`p52` do CI, ou dívida declarada | T027 | 11 | o resultado volta do job `visual`, não da worktree |
| `PROTECTED` inline em `tests_p50_core.js` | T023 | 10 | manutenção de registry (R8 §2), depois que os dois módulos pararam de mudar |
| `pins.json` | R1–R11 | várias | um por commit de conteúdo que toque pinado |
| `bridges.json` | — | — | **não muda**: `__DEV` já é registrado e ganha duas chaves (`TGT_EQUIV`, `hasSubstitute`); nenhum nome `window.__*` nasce e `check_lint_arch.py` varre **nomes** |
| Patch-points | — | — | registro **vazio** por desenho (R9 §4): sem monkey-patch, sem decorador, sem `registerDecor` |
| Ordem de injeção do builder | — | — | **inalterada e nenhuma reordenação é autorizada** |
| `.claude/BACKLOG.md` | — | — | **fora de escopo** (spec §"Fora de escopo", item 7): a alocação de id `EA-*` é do `doc-writer`, depois de conferir a `develop` |

## PARADA — o que nenhuma tarefa pode resolver por dentro

1. **Qualquer desenho que alcance `ui_v32.css`, `ui_ux_v32.css`,
   `ui_p52_workspace_v32.js` ou uma asserção de suíte congelada.** A autorização
   nominal §29.4 do proprietário cobre **apenas** `ui_v32.js` e `ui_target_v32.js`,
   **nesta demanda**. Desvio para aqui e exige nova frase do proprietário, pelo
   rito de `specs/PHASE_5_0_REV_B.md:1638-1641`. Nenhum agente abre esses arquivos
   por conta própria, nem "para reusar estilo".
2. **`declared.m41_payload_sha256` mudar depois do rebuild** (T010 ou T015): virou
   Porta B, que ninguém autorizou — `git revert` da wave de rebuild e reportar.
3. **Contagem congelada mudar em suíte que não seja `p50core`** (T012 ou T017): o
   desenho vazou para superfície alheia. Parar e reabrir a análise, nunca ajustar o
   registro.
4. **Divergência do `data-engineer` em T004**: volta ao **plano**, antes de T008.
5. **Nó a validar nascer com a classe `.ux-tgt-en`**: é reversão de T008, não
   conserto no gate. R-1 é dura, e `D009-UNS1` mede junto com `D010-CARD6` (b).

---

ARQUIVOS_TOCADOS: specs/010-recomendacao-sem-vao/tasks.md (criado — único artefato desta fase)
RESUMO: 29 tarefas [T001–T029] derivadas do plan.md aprovado, nas 12 waves já ratificadas **[atualizado em 2026-08-30: 31 tarefas, com T030 (emenda do assert, errata E10) e T031 (seu repin) acrescidas na wave 4 pela regra que se autocorrige — ids permanentes, contagem não sagrada]**, cada linha com as sete colunas. Um único red, escrito em T005 e commitado em T006 com mensagem exata, consumido pelas duas implementações. Gate viaja no prompt por tarefa, com PAPEL1 declarado como o único de autoridade dividida entre T008 (alínea a) e T013 (alínea b). Campanha tabelada por momento, harness disparado, se roda aqui e onde fecha. Repin virou série derivada R1–R11, uma tarefa por commit de conteúdo que toca pinado, com regra de autocorreção para commit extra.
EVIDÊNCIA: nenhum gate executado — Fase 3 é desenho e não escrevo código nem executo suíte. Verificações só-leitura desta fase, feitas para decidir granularidade e não repetir citação do plano: `git log` (Fase 2 em b74dab0, repin em 21b5db7, árvore limpa); planning-state 010 em `phase: tasks` com `plan.status: approved`; `.claude/templates/tasks.md`; `specs/009-leitura-do-relatorio/tasks.md` como precedente de formato. Confirmadas por leitura direta, porque decidem tarefa: `mutation_map.json` — `ui_v32.js` é alvo de `core`, `p51`, `p52` e `d009`; `ui_target_v32.js` é alvo de `p52` e `d009`; `p50` não tem alvo tocado; `d009` e `p50`/`p51`/`p52` já têm `preflight: true` e `core` não. `expected_suites.json` — `d009` 15/0, `p50core` 64/0, `p52layout` 45/0, `engine` 105/0 e as demais contagens que T012/T017 conferem. `check_baseline.py:53-61` — `[FAIL] rastreado sem pin (regenere o registry no mesmo PR)`, que é o que torna R1 e R2 obrigatórios e não decorativos. `check_suites.py:53-56` — o registro aceito vem de `expected_suites.json` **e** dos `cmd` de `mutation_map.json`, o que confirma que `tests_010_mutants.js` só é legal a partir de T019 e que `fixtures_010_vao.js` não entra em registro nenhum. `check_tdd.py:29-35` (`git cat-file -e` sobre `red.commit`) e `:47-52` (par incompleto = FAIL). `pins.json → _meta.exclusoes` — `.claude/project-memory/**` excluído, o que dispensa repin nos commits de planning-state. `tests_p50_core.js:150-170` e `:250-262` — os dois pins inline de T023, com o formato de comentário-trilha e "Identidade anterior" já em uso. `pipeline.yaml` — os 14 stages que T026 executa. Contagem conferida: 13 gates `D010-*` e 17 mutantes `M1..M17` na spec, em correspondência 1:1. **[Atualizado em 2026-08-30: 20 mutantes declarados `M1..M20`, 18 executados — `M18`/`M19` nasceram da errata (E9) sobre `D010-CARD4` e `M20` da disposição de `D010-ARB3`, gates que já existiam; nenhum gate novo. `M3`/`M4` viraram dívida declarada. As fixtures passaram de 4 a 5, com `D010-F4`, e as tarefas de T029 a T031, com a emenda do assert (E10).]**
DEPENDÊNCIAS: (1) **Portão da Fase 3 com o usuário** antes de qualquer delegação; a execução das waves é do orquestrador — eu proponho e não delego. (2) **`data-engineer`** detém T004 e é bloqueante para T008; a resposta dele **não** é escrita em arquivo — o orquestrador a registra no planning-state, e divergência reabre o plano. (3) **`qa-engineer`** detém T002, T005, T006, T012, T017, T019, T021, T026 e T027; nenhuma tarefa dele abre módulo de produto. (4) **`ui-engineer`** detém T008 e T013, em duas delegações separadas por três waves; nenhuma delas abre `.css`, `tests_*` ou registro. (5) **`build-engineer`** detém T001, os onze repins, os dois rebuilds, o repin inline de `PROTECTED` (T023) e o job `visual` (T025) — único caminho para `p51`/`p52`, que exigem Chromium ausente nesta worktree. (6) **`product-owner`** em T029. (7) **Achado da spec que NÃO virou tarefa, e por quê**: a spec §"Achados a registrar" diz que **A6** ("T3 oculto por contiguidade") "continua exigindo confirmação por execução do `qa-engineer` antes de virar achado", e o plano aprovado **não** tem wave para isso. Não criei tarefa: seria ampliação do plano ratificado. É confirmação por execução, só-leitura, e cabe naturalmente ao lado de T012 ou T017 — **o orquestrador decide se roteia agora ou devolve ao backlog junto com A3 e A4**. Igualmente fora: escrever em `.claude/BACKLOG.md` e alocar ids `EA-*`, que a spec põe explicitamente fora de escopo e atribui ao `doc-writer` depois de conferir a `develop` — por isso não há tarefa de `doc-writer` nesta demanda. (8) **PARADA declarada**, repetida aqui porque é o risco que a delegação nomeou: a autorização §29.4 cobre **apenas** `ui_v32.js` e `ui_target_v32.js`; `ui_v32.css`, `ui_ux_v32.css`, `ui_p52_workspace_v32.js` e asserção de suíte congelada exigem nova frase do proprietário. (9) **Nota de trilha**: esta execução rodou em **Opus**, não no modelo pinado (`fable`), por decisão de créditos do orquestrador — mesmo desvio já registrado nas Fases 0, 1 e 2.
