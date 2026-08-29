# Spec — 013-integridade-da-campanha

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Fazer a campanha de mutação **dizer a verdade**: portabilidade real nas três
harnesses defeituosas (`p50`, `p51`, `p52`), **três estados distintos** no
relatório (detectado · sobrevivente · **não executado**, este com causa nomeada),
**triagem** das quatro âncoras podres da `p51` pelo critério de três saídas,
**classificação** (não correção) dos não-detectados residuais, e **declaração
verdadeira** (`targets` da `p51` reconciliados + `mutation-matrix.json` da P51
expandida por par).
Link: [refinement.md](refinement.md). As 8 decisões da rodada 1 estão fechadas no
portão de 2026-08-29 (**sob delegação do proprietário**, não por ratificação
pessoal — `.claude/project-memory/planning-state/013-integridade-da-campanha.json`)
e **não se reabrem aqui**. Esta spec fixa apenas o que o refinamento delegou à
Fase 1: o vocabulário fechado dos estados, a mecânica do relatório honesto, o
seam de interpretador, e os gates que transformam cada critério em asserção
executável com mutante previsto.

**Nenhum byte de produto muda.** Engine, Camada 1, HTML gerado, módulos `ui_*` e
`USER_GUIDE.md` ficam byte-intactos — INV-1 não é acionada, nem Porta A nem
Porta B. As âncoras se movem para acompanhar o produto; o produto não se move
para acomodar âncora.

## Decisões técnicas fixadas (delegadas pelo refinamento à Fase 1)

| id | Decisão | Justificativa (curta) |
|---|---|---|
| **T1** | **Resolução do interpretador, uma única fonte**: `MUTATION_PY` (nome do binário, override explícito) senão o padrão da referência da casa — `process.platform === "win32" ? "python" : "python3"` (`tests_core_mutants.js:22`). A **mesma** regra vale nas três harnesses e em `check_mutation.py`; o caminho do script vai **entre aspas** (`tests_core_mutants.js:66-68`, R10 §7). | Hoje a declaração (`mutation_map.json:47`, `"python"`) e a invocação (`python3` fixo) são coisas diferentes, e por isso o requisito nunca reprova. Uma fonte só elimina a divergência por construção. `MUTATION_PY` tem precedente direto no repositório: `CHROME_PATH` já é esse seam em `check_mutation.py:33` e `env_doctor.py:72` — é recurso de operador, não hook de teste. |
| **T2** | **`have("python")` passa a resolver de verdade**: `shutil.which(<nome de T1>)`. `DEFER` sob `MUTATION_DEFER_MISSING=1` (`check_mutation.py:69-71`) e `FAIL` nomeado local (`:72-74`) ficam **byte-equivalentes em semântica** — só param de ser inalcançáveis para `python`. | Borda 9: "ou passa a verificar de verdade o interpretador que o harness realmente invoca, ou o requisito sai do mapa". Verificar é estritamente melhor: mantém a declaração e a torna capaz de reprovar. R10 §1 — a mudança **fortalece**, nunca afrouxa. |
| **T3** | **Nenhum `cmd` de mutante carrega prefixo POSIX de variável** — em harness nenhuma, presente ou futura. As variáveis passam pela opção `env` de `execSync`, no *shape* já provado em `tests_p52_mutants.js:86-91` + `:1374`: constante `SUPPRESS` aplicada **por construção a toda execução** do runner + campo `only` por mutante, entregue como `envOverride`. Estado **medido nesta Fase 1** (§Correção de fato): `p51` **20/20** inline (4 `P50_NO_EVIDENCE=` + 16 `P50_ONLY=`) e **sem** opção `env` no `run()` (`:185-188`); `p50` **26/53** inline (`P50_ONLY=`), com a plumbing já existente (`:99-101`) mas **não usada** pelo filtro (o laço chama `run(m.cmd)` em `:793`, sem override); `p52` **0**; `core` **0**. A `p51` **cria** a plumbing; a `p50` passa a **usar** a que já tem; a `p52` já cumpre T3. | Borda 11. A supressão de evidência é contrato do `cmd`, não decoração: aplicá-la por construção é a lição B-AUD-503-1 (`tests_p50_mutants.js:88-97` — M20 perdeu a flag por esquecimento e o produto mutado regravou o acervo). `tests_p52_mutants.js` é a implementação de referência **deste** eixo, como `tests_core_mutants.js` é a do interpretador. Escrever o critério por **propriedade** (nenhum `cmd` com prefixo) e não por lista nominal é o que impede este gate de apodrecer do mesmo jeito que as âncoras que a demanda conserta. |
| **T4** | **Três estados, vocabulário fechado**: `DETECTADO` · `SOBREVIVENTE` · `NÃO EXECUTADO`. Todo `NÃO EXECUTADO` carrega **uma** causa do conjunto fechado: `interpretador ausente` · `âncora não encontrada` · `âncora ambígua` · `rebuild falhou` · `gate não pôde ser executado`. Falha fora do conjunto é impressa como `NÃO EXECUTADO · falha não classificada: <mensagem>` e **também** reprova — nunca vira detectado nem sobrevivente. | O termo do glossário é normativo (`CONTEXT.md:117-126`): "mutante não executado" e "mutante sobrevivente" são estados distintos, "nunca somado a nenhum dos dois". Conjunto fechado + escape nomeado é o padrão que impede o retorno do rótulo ambíguo por uma causa nova (a doença que a INV-2 combate no produto: três estados colapsados em um). |
| **T5** | **Sem agregado quando há não executado**: se `U > 0`, o harness **não imprime razão** (`ok/total`); imprime `CAMPANHA NÃO CONCLUÍDA · D detectados · S sobreviventes · U não executados (de T)`, a lista dos não executados com causa, e sai com código ≠ 0. Com `U == 0`, a linha final histórica é preservada literalmente (`MUTATION TESTING (Phase 5.x)…: D/T mutantes detectados pelo gate e motivo esperados`). | Borda 1: "um número que não foi medido não é impresso". Contagens absolutas do que foi medido continuam sendo medição; a **razão** `D/T` é a alegação falsa, e é ela que some. Preservar a linha histórica quando a campanha conclui mantém a comparabilidade com a evidência das fases 5.0-5.2 (R13: registros selados não são retro-ajustados). |
| **T6** | **Preflight**: `<cmd> --preflight` (argv, não env) em cada harness com `"preflight": true` no `mutation_map.json`. Resolve o interpretador e, para **cada** mutante, conta as ocorrências da âncora no arquivo-alvo — **sem mutar, sem reconstruir, sem executar gate, sem escrever nada**. Emite **um objeto JSON em stdout** (contrato em §Contratos); texto humano vai para stderr. Exit 0 sse interpretador resolvido e toda âncora com `ocorrencias == 1`. | É o que torna a rot **visível sem Chromium, em qualquer plataforma** — e portanto o que torna o red desta demanda provável localmente, no Windows, sem confiar cegamente no CI (decisão 1.1). JSON em stdout evita o oráculo proibido por R10 §6 (regex sobre stdout PT-BR); não escrever nada honra R7 §3. |
| **T7** | **O preflight roda no stage `mutation` que já existe** (`pipeline.yaml`), **depois** da pré-condição de árvore limpa e **antes** do laço de trigger, **independentemente** de `requires` e de qualquer alvo ter mudado. Nenhum stage novo, nenhuma linha em `pipeline.yaml`, nenhuma mudança em `verify.yml`. | Menor superfície possível para o mesmo efeito: o stage `mutation` já é o dono das campanhas e já roda em todo PR (job `verify` e job `visual`). Consequência aceita e declarada: **âncora podre reprova o stage mesmo quando nenhum alvo mudou** — é a semântica pretendida ("a campanha diz a verdade"), não efeito colateral. Promover o preflight a stage leve sempre-ligado (visível em `run.sh --light`) fica como candidata para o `plan.md`, fora do escopo desta spec. |
| **T8** | **`core` fica de fora das edições** (é a referência, `tests_core_mutants.js:22`), e sua ausência de preflight é impressa pelo stage como **dívida nomeada** (`[DÍVIDA] core: sem preflight declarado — âncora podre só aparece na execução da campanha`), nunca omitida. | Decisão 1.4 escopa a correção às três defeituosas. Assimetria silenciosa seria a mesma doença um nível acima (R10 §2); dívida declarada é o remédio que o próprio `_meta` da `mutation-matrix.json` prescreve. |
| **T9** | **Regra dura da reancoragem** (R10 §1 aplicada a mutante): a âncora nova é escolhida pela **propriedade que o `desc` documenta**, nunca por "casa e passa". As três perguntas do refinamento são respondidas **por escrito antes da edição**, em `specs/013-integridade-da-campanha/matriz-gate-mutante.md`, e cada âncora reancorada carrega **três provas cumulativas**: (a) `ocorrencias == 1` (IC-4); (b) morte **pelo gate e motivo esperados** (IC-8); (c) **sobrevivência** com a asserção correspondente do gate neutralizada. Propriedade morta → **aposentadoria com razão registrada**, nunca reancoragem oportunista. | É o critério central do refinamento virado gate: sem (c) não há prova de que foi *aquela* asserção que matou (borda 7); sem (a) a mutação pode cair no lugar errado (borda 4); sem (b) a morte pode ser incidental (borda 6, já excluída por `tests_p51_mutants.js:9`). |
| **T10** | **A prova (c) — neutralização — é executada em worktree efêmera**, nunca na árvore: a asserção do gate é neutralizada numa **cópia**, o mutante é aplicado lá, e a saída é registrada. Nada é escrito em arquivo versionado (R7 §3; precedente 012 T8 e 003). | `tests_p50_core.js` não está em `boundary.json` nem na lista `PROTECTED` (`tests_p50_core.js:82-229`) nem em `frozenSuites` (`:235-238`), mas a prosa da §29.4 (`specs/PHASE_5_0_REV_B.md:1618-1619`) o alcança — é a tensão **EA-1 Face B**, com `fix-finding` já encomendado. Fazer a prova em cópia **dispensa** a discussão inteira: R13 proíbe re-litigar, e esta demanda não depende da resolução. |
| **T11** | **`targets` da `p51` reconciliados nominalmente**: o conjunto passa a ser exatamente os arquivos que o harness muta (`tests_p51_mutants.js:17-24`: `ui_p50_v32.css`, `ui_p50_shell_v32.js`, `ui_journey_v32.js`, `ui_v32.js`, `ui_p50_results_v32.js`, `USER_GUIDE.md`) **mais** o próprio harness; `ui_session_v32.js` (alvo fantasma) sai. A asserção IC-6 é **nominal à `p51`** — implementada sem laço sobre harnesses. | Decisão 1.5 + borda 10. A checagem **genérica** de órfão (`check_mutation.py:58`) é do EA-3, que vive em branch que este worktree não enxerga; escrever o laço genérico aqui é conflito de merge no pior lugar possível — o mesmo risco que fez a decisão 1.6 adiar o EA-4. |
| **T12** | **Registro durável**: a linha agregada `"campanhas P51 (múltiplos)"` (`mutation-matrix.json:62-72`) é **substituída por um par por mutante** da `p51`, com `propriedade`, `ancora` e `ultima_prova` datada desta demanda; mutante aposentado sai dos pares e o gate órfão entra em `dividas_declaradas` com a razão. O recibo `docs_phase5/evidence_p51/P51-mutation.json` continua sendo escrito onde é hoje (caminho **gitignorado** desde a 007, `.gitignore:15`) e **não** é declarado em `receipts` — nenhum byte de evidência volta ao índice (R11 / decisão Q1). A prova narrada vive em `specs/013-.../matriz-gate-mutante.md` (precedente 012). | Decisão 1.8. Declarar `receipts` para um caminho ignorado faria o runner tentar `git checkout` de algo que o git não rastreia — vestigial por construção (`check_mutation.py:86-90`). O registro vivo é a matriz; a narrativa é a spec. |
| **T13** | **Classificação do não-detectado residual da `p52`** (se confirmado) entra como entrada nomeada em `dividas_declaradas` + narrativa na `matriz-gate-mutante.md`. A linha agregada `"campanhas P52 (múltiplos)"` **não** é expandida. | 1.8 autoriza a expansão **da P51**. Expandir a P52 (dezenas de pares) é outra demanda; registrar o achado classificado não é. |

## Correção de fato ao refinamento (constatada nesta Fase 1)

O `refinement.md` (§Sistema real) afirma que `p50` e `p52` "já passam variáveis
pela opção `env` …, que é portável" e que "a `p51` é a única que erra nas duas
frentes". **Medido neste worktree, isso não se sustenta para a `p50`** — e a
correção muda o escopo de E1, não só uma frase:

| harness | `cmd` com prefixo POSIX | total de `cmd` | opção `env` no runner | frentes defeituosas |
|---|---|---|---|---|
| `tests_p50_mutants.js` | **26** (todos `P50_ONLY=`) | 53 | existe (`:99-101`) mas o filtro **não** a usa (`:793` chama `run(m.cmd)` sem override) | **duas** — interpretador **e** prefixo |
| `tests_p51_mutants.js` | **20** (4 `P50_NO_EVIDENCE=` + 16 `P50_ONLY=`) | 20 | **não existe** (`:185-188`) | **duas** |
| `tests_p52_mutants.js` | **0** | 107 | usa de fato (`:1374`, `P52_ONLY: m.only`) | **uma** — só o interpretador |
| `tests_core_mutants.js` | **0** | 3 | n/a (sem filtro por gate) | **nenhuma** — é a referência |

Consequência: **a `p50` entra em E1 nas duas frentes**. Se o critério de aceite
dissesse que a `p50` precisa só do interpretador, ela sairia da entrega ainda
quebrada no Windows — e o critério da família ("nenhuma campanha reporta número
sem ter executado") ficaria falso justamente na harness com **mais mutantes**
(53). A `p52` continua precisando só de T1; a `p51` é a única sem plumbing
alguma. `tests_p52_mutants.js` passa a ser a **referência do eixo do prefixo**,
como `tests_core_mutants.js` é a do eixo do interpretador.

**Por que a medição anterior errou, e por que isso vira desenho de gate**: a
varredura usou a classe `[A-Z_]*=`, que **não casa dígito** — `P50_ONLY=` falha
no `5` e some da contagem. É a mesma família de defeito que a demanda conserta:
um instrumento que reporta zero sem ter medido. Por isso IC-1 fixa a classe
`[A-Za-z_][A-Za-z0-9_]*=` **no texto do critério** e é escrita por propriedade,
nunca por lista nominal de harness.

Registro (R2 §5 / R12): a afirmação do refinamento fica **citável como
levantada e corrigida aqui** — não se apaga, e não se re-litiga o resto da
§Sistema real, cujas demais medições foram reconferidas e batem.

## Vocabulário fechado (normativo)

**Estados do mutante numa campanha** (glossário: `CONTEXT.md:117-126`):

| Estado | Condição |
|---|---|
| `DETECTADO` | mutação aplicada, HTML reconstruído, gate esperado executado e **reprovado com o motivo esperado**; restauração byte-idêntica |
| `SOBREVIVENTE` | mutação aplicada e gate esperado **executado**, mas não reprovado pelo gate/motivo esperados (inclui `reprovou por motivo diferente do esperado`) |
| `NÃO EXECUTADO` | o mutante **não chegou a ser medido** — nunca somado aos outros dois |

**Causas de `NÃO EXECUTADO`** (conjunto fechado — T4):
`interpretador ausente` · `âncora não encontrada` · `âncora ambígua` ·
`rebuild falhou` · `gate não pôde ser executado`; qualquer outra falha é
`falha não classificada: <mensagem>`, que **também** reprova.

**Classificação de par não-KILL na matriz** (conjunto fechado — E3):
`rot semântica` (o `reason` não casa mais a mensagem atual do gate) ·
`propriedade aposentada` (o comportamento-alvo deixou de existir) ·
`gate sem poder discriminante (achado <id>)` — **este último não é corrigido
aqui** (§Fora de escopo).

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).
Namespace da demanda: **IC-\*** (integridade da campanha) — série nova,
verificada sem colisão com `EA-*`/`EB-*`/`ZB-*`/`BS-*`/`P5x-*`/`CM*`/`UG*`/`M41`
(R10: nunca continuar numeração de fase alheia). Os IC-1..IC-6 são asserções do
stage **`mutation`** (`.claude/verify/check_mutation.py`, já em `pipeline.yaml`);
IC-7 é o stage `baseline`; IC-8 é a execução da campanha, canônica no job
`visual` do CI.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| **IC-1** | **Portabilidade estrutural, por propriedade e não por lista**: nenhum harness de mutação invoca interpretador por nome fixo em comando, e **nenhum `cmd` de mutante começa com prefixo de variável de ambiente** — vale para todo harness declarado em `mutation_map.json`, hoje e depois. A resolução é a de T1, com o caminho do script entre aspas | `mutation` · `check_mutation.py` (seção de integridade, roda antes do trigger) · varredura de **todo** harness do mapa (hoje 4): zero literal de comando casando `"python3? `; zero `cmd` casando `^[A-Za-z_][A-Za-z0-9_]*=` — a classe **inclui dígitos**, senão `P50_ONLY=` escapa (foi exatamente esse erro de classe que produziu a medição errada corrigida na §Correção de fato); **auto-exclusão nominal** (R10 §10) de `check_mutation.py` e desta spec, por path literal | **M-IC1**: restaurar `execSync("python3 build_v32_html.py"…)` em qualquer harness → FAIL nomeando arquivo e linha. **M-IC2**: devolver um `cmd: "P50_ONLY=… node …"` a **qualquer** mutante de **qualquer** harness → FAIL nomeando harness e mutante. **Red natural e medido**: hoje são **46** ocorrências (20 na `p51` + 26 na `p50`) |
| **IC-2** | **Requisito declarado que reprova**: com o interpretador ausente, a campanha exigida **não roda e é nomeada** — `FAIL` local, `DEFER` nomeado sob `MUTATION_DEFER_MISSING=1` (comportamento de `check_mutation.py:69-75` preservado). Com o interpretador presente, nada muda | `mutation` · `check_mutation.py` · execução adversarial `MUTATION_PY=py-inexistente python .claude/verify/check_mutation.py --all` ⇒ exit ≠ 0 e `[FAIL] <harness>: … ambiente sem python`; a mesma execução com `MUTATION_DEFER_MISSING=1` ⇒ `[DEFER]` nomeado, exit 0; execução normal ⇒ inalterada | **M-IC3**: `have("python") → True` incondicional (`check_mutation.py:30-31`, o **estado de hoje**) → a execução adversarial deixa de reprovar. É o **red natural** deste gate |
| **IC-3** | **Três estados com causa nomeada, e nenhum número não medido**: relatório com `DETECTADO`/`SOBREVIVENTE`/`NÃO EXECUTADO`+causa; com `U > 0` não há razão `D/T` impressa e o exit é ≠ 0; abortando no preflight **nada é mutado** (árvore limpa) | `mutation` · as três harnesses, em **worktree efêmera** · (a) `MUTATION_PY=py-inexistente node tests_pXX_mutants.js` ⇒ `NÃO EXECUTADO · interpretador ausente` para todos, sem razão `D/T`, exit ≠ 0, `git status --porcelain` vazio; (b) uma âncora corrompida na cópia ⇒ `NÃO EXECUTADO · âncora não encontrada` nomeando o mutante | **M-IC4**: reintroduzir o `run()` que engole a exceção (`tests_p51_mutants.js:186-187`, `code:-1`) e rotula `NÃO DETECTADO` (`:209`) → o cenário (a) volta a imprimir veredito e razão → morto pelos dois cenários |
| **IC-4** | **Âncora única, provada antes de mutar**: para todo mutante de harness com preflight, `ocorrencias == 1` no arquivo-alvo; `0` ⇒ `âncora não encontrada`, `≥2` ⇒ `âncora ambígua`; ambos reprovam o stage, nomeando mutante, arquivo e contagem | `mutation` · `check_mutation.py` + `<cmd> --preflight` de cada harness · JSON com `mutantes[].ocorrencias`; stage FAIL se qualquer `!= 1`. Cobre os 20 da `p51`, os 53 da `p50` e os da `p52` | **M-IC5**: apontar a `find` de `M51-18` para `const overall = suff && scored.length ? Math.round(…)` — texto **idêntico** em `ui_v32.js:131` (`legacySnapshot`) e `:1026` (relatório) → `âncora ambígua (n=2)`. É a prova executável da borda 4 e a **contraprova da reancoragem ingênua** |
| **IC-5** | **Matriz da P51 verdadeira**: todo mutante declarado pelo harness `p51` tem **um par** em `mutation-matrix.json`; par com `ultima_prova.resultado != "KILL"` tem `classificacao` do vocabulário fechado; `ultima_prova.registro` aponta para **arquivo existente**; mutante aposentado **não** está nos pares e **está** em `dividas_declaradas` com razão | `mutation` · `check_mutation.py` (asserção **nominal à `p51`**) + `check_tdd.py` (estrutura dos pares, gate existente) · conjunto de ids do preflight ≡ conjunto de `mutante` dos pares `p51`; caminhos de `registro` resolvidos no disco | **M-IC6**: remover um par (ou devolver a linha agregada `"campanhas P51 (múltiplos)"`, `mutation-matrix.json:62-72`) → FAIL `mutante sem par na matriz`. **M-IC7**: `registro` apontando para caminho inexistente → FAIL |
| **IC-6** | **Alvo declarado verdadeiro (`p51`, nominal)**: `mutation_map.json → harnesses.p51.targets` ≡ arquivos que o harness realmente muta **∪** `{tests_p51_mutants.js}` | `mutation` · `check_mutation.py` · comparação de conjuntos entre `targets` e `arquivos_mutados` do preflight da `p51`; divergência em qualquer direção ⇒ FAIL nomeando o excedente e o faltante | **M-IC8**: remover `USER_GUIDE.md` dos `targets` (o **estado de hoje**, causa direta do apodrecimento de `M51-20`) → FAIL `alvo mutado ausente de targets`. **M-IC9**: devolver `ui_session_v32.js` → FAIL `alvo declarado que o harness não muta`. **Red natural** |
| **IC-7** | **Identidade coerente e produto byte-intacto**: `gen_pins.py` no mesmo PR cobrindo todo arquivo pinado alterado (R8 §1); zero rastreado-sem-pin; engine, Camada 1, HTML gerado, módulos `ui_*` e `USER_GUIDE.md` byte-idênticos ao base `077282f` | `baseline` · `check_baseline.py` · 0 divergência, exit 0. Reforço: `build` (HTML reproduzido byte a byte), `P50-GOV1` (`tests_p50_core.js:231`, protegidos byte-a-byte) e `git diff --stat 077282f..HEAD` sem nenhum path de produto | — (gates existentes; o esquecimento **é** o FAIL do stage — R8 §1) |
| **IC-8** | **Campanha `p51` conclui e as quatro reancoradas morrem pelo gate e motivo esperados**: zero `NÃO EXECUTADO`, zero `SOBREVIVENTE` entre `M51-03`/`M51-16`/`M51-18`/`M51-20`, cada uma com a linha `FAIL <gate esperado>` casando o `reason` | campanha `p51` · `node tests_p51_mutants.js` no job `visual` do CI (requer Chromium: `P51-VIS1`/`VIS2`/`PDF1` usam `tests_p50_chromium.js`) · saída por mutante + exit 0. Fora do CI, o relato honesto é `NÃO EXECUTADO` nomeado — nunca um número | **Os quatro mutantes de hoje são o red natural**: com as âncoras como estão, a campanha reporta `NÃO EXECUTADO · âncora não encontrada` para as quatro. Prova (c) de T9 por âncora: neutralizada a asserção do gate em worktree efêmera, o mutante **sobrevive** — sem isso a morte é coincidência |

**Nascimento de gate (R10)**: **positivo** = IC-8 (campanha conclui, quatro
mortes pelo gate/motivo esperados) e IC-4 em árvore sã; **negativo** = IC-2
(ambiente ausente reprova nomeando), IC-3(a)/(b), IC-6 no estado de hoje;
**adversarial** = M-IC5 (âncora ambígua, borda 4) e M-IC4 (retorno do `run()`
que engole exceção); **regressão** = comportamento de `DEFER`/`FAIL` de
`check_mutation.py:69-75` intacto, pré-condição de árvore limpa (`:39-44`)
intacta, restauração por SHA (`tests_p51_mutants.js:206-207`, `tests_p50_mutants.js:808`,
`tests_p52_mutants.js:1384`) intacta, guarda de acervo de evidência da `p50`/`p52`
intacta. **Oráculo independente da implementação**: o preflight emite **JSON**
consumido por outro executável — nunca regex sobre stdout PT-BR (R10 §6); os
cenários adversariais rodam sobre **cópia** em worktree efêmera, entrada→saída
(R7 §3). **Nenhuma asserção existente é enfraquecida** (R10 §1): tudo o que
muda em `check_mutation.py` é acréscimo, e `have("python")` deixa de ser
tautologia — fortalecimento.

## Comportamento especificado

Superfície única: o **instrumento de prova** (harnesses de mutação + stage
`mutation` + declaração canônica). Nenhuma superfície de produto é tocada;
UNSET/NA/suficiência **não** são tocados — aparecem apenas como as propriedades
que os gates `P51-*` já defendem e que os mutantes atacam.

### Entrada → saída, por cenário

| Cenário | Saída esperada |
|---|---|
| Árvore sã, ambiente completo (CI Linux, job `visual`) | preflight de `p50`/`p51`/`p52` verde; campanhas exigidas rodam; relatório com `D detectados · 0 sobreviventes · 0 não executados`; razão `D/T` impressa; exit 0 |
| Ambiente sem Chromium (Windows local) | preflight roda e reprova/aprova **ancoragem**; campanha exigida com `requires` faltando ⇒ `[FAIL] p51: campanha EXIGIDA … ambiente sem chromium` (ou `[DEFER]` sob a env do CI). **Nenhum número de campanha é impresso** |
| Interpretador ausente | preflight ⇒ `interpretador ausente`, exit ≠ 0; harness invocado diretamente aborta **antes de mutar**, imprime `NÃO EXECUTADO · interpretador ausente` para todos, sem razão `D/T`, árvore limpa |
| Âncora com 0 ocorrências | `NÃO EXECUTADO · âncora não encontrada`, nomeando mutante e arquivo; stage FAIL; nada mutado |
| Âncora com ≥2 ocorrências | `NÃO EXECUTADO · âncora ambígua (n=<k>)`; stage FAIL; nada mutado — a mutação **nunca** é aplicada "na primeira ocorrência" |
| Rebuild falha no meio da campanha | mutante marcado `NÃO EXECUTADO · rebuild falhou`; source restaurado e SHA conferido; campanha segue e reprova ao final |
| Gate não pôde ser lançado (spawn) | `NÃO EXECUTADO · gate não pôde ser executado` — nunca `SOBREVIVENTE` |
| Gate rodou e não reprovou (ou reprovou por motivo diferente) | `SOBREVIVENTE`, com a linha observada; entra na classificação da E3 |

### As quatro âncoras — o que a triagem tem de responder (E2)

Ordem obrigatória das três perguntas do refinamento, resposta **escrita antes da
edição** em `matriz-gate-mutante.md`. O estado verificado nesta Fase 1 (leitura
direta do worktree, R2 §4) é o insumo, não a conclusão:

| mutante | propriedade que o `desc` documenta | gate (vivo, verificado) | o que a Fase 5 tem de provar |
|---|---|---|---|
| `M51-03` | exemplo de MSSP/SLA **não** vaza para um `qid` incorreto | `P51-UX2` (`tests_p50_core.js:2689`; asserção em `:2723-2724`, mensagem `exemplo de MSSP aparece em <qid>`) | âncora nova única (o `ex:` de `mandate` vive em `ui_p50_shell_v32.js:577`, ocorrência única verificada); morte por `P51-UX2` com o `reason` atual; sobrevivência com `:2723-2724` neutralizada |
| `M51-16` | a capa vem **antes** do cabeçalho e não colide no PDF | `P51-PDF1` (`tests_p50_chromium.js:3500`) | o par `let h = qsCoverHTML();` (`ui_v32.js:1036`) + `h += \`<div class="pr-head"…` (`:1041`) deixou de ser contíguo (comentário da REV B §11.2 no meio) e o segundo ganhou `data-pr-band="wide"`; ambas as linhas são **únicas** no arquivo (verificado) |
| `M51-18` | o agregado do relatório é **arredondado antes** de nomear o estágio (regresso do blocker B1) | `P51-RPT6` (`tests_p50_core.js:3000`) | **unicidade é o ponto**: o texto natural existe idêntico em `ui_v32.js:131` (`legacySnapshot`) e `:1026` (relatório). A âncora nova tem de incluir contexto que só exista em `:1026` — provado por `ocorrencias == 1` (IC-4), não por inspeção |
| `M51-20` | o manual **não** lista régua e legenda como seções próprias, e a lista de §12 reproduz a ordem realmente emitida | `P51-DOC13` (`tests_p50_core.js:3648`; asserções em `:3713-3731`) | a §12 foi renumerada na REV B (`USER_GUIDE.md:423-427`: o item virou **2**, com dois-pontos no lugar do travessão). Contraprova de que o defeito é da âncora e não do gate: `M51-19`, no mesmo gate, tem âncora **intacta** (`USER_GUIDE.md:291-293`, verificado). **Nenhum byte do manual muda** |

Aposentadoria (se e só se a pergunta 1 responder "não existe mais"): remoção com
a razão registrada + gate órfão em `dividas_declaradas` (T12). Nenhuma das
quatro é candidata pelo que se lê hoje — o refinamento verificou as quatro
propriedades vivas —, mas a saída existe e é a única alternativa legítima à
reancoragem.

### Casos de borda do refinamento — tratamento nesta spec

| Caso (refinement) | Tratamento |
|---|---|
| 1 — harness roda numa plataforma e não em outra | T4/T5; gates IC-2, IC-3(a) |
| 2 — alvo migrou de arquivo | Rebase do par: âncora + `F.*` + `targets` mudam juntos (IC-6 os mantém consistentes); triagem cumprida integralmente (T9) |
| 3 — comportamento-alvo deixou de existir | Aposentadoria com razão + dívida declarada (T12); IC-5 assere que o par sumiu **e** a dívida entrou |
| 4 — âncora casa mais de uma vez | **FAIL** (`âncora ambígua`); T6/IC-4, com M-IC5 provando sobre o caso real de `M51-18` |
| 5 — gate mudou a mensagem e o `reason` não casa | `SOBREVIVENTE` (o gate rodou), classificado como `rot semântica` na E3 — e, sendo rot semântica, o par é **re-derivado da mensagem atual** (pergunta 2 da triagem), o que é conserto desta demanda |
| 6 — detecção incidental | Não conta: regra preservada (`tests_p51_mutants.js:9`); IC-8 exige gate **e** motivo esperados |
| 7 — o gate falharia de qualquer jeito | Prova (c) de T9: mutante **sobrevive** com a asserção neutralizada, em worktree efêmera (T10) |
| 8 — campanha exigida sem ambiente sob `MUTATION_DEFER_MISSING=1` | `DEFER` nomeado **preservado** (IC-2, cenário do CI). O fechamento da borda — vincular o `DEFER` do job `verify` à execução no job `visual` — **não** entra: exige mudar `verify.yml`/proteção de branch, que é ampliação de escopo. Fica em §Riscos como escalonamento nomeado |
| 9 — requisito que nunca reprova | T1/T2; IC-2, com o código de hoje como M-IC3 |
| 10 — arquivo mutado ausente dos `targets` | T11; IC-6 **nominal à `p51`**. A checagem genérica permanece do EA-3 |
| 11 — perder `P50_NO_EVIDENCE=1` na migração | T3: supressão **por construção**, não por lembrança de autor. Regressão coberta pela guarda de acervo da `p50`/`p52` e por `check_mutation.py:92-96` |
| 12 — crash entre mutar e restaurar | Preservado sem enfraquecer: árvore limpa como pré-condição (`check_mutation.py:39-44`) e restauração conferida por SHA (`tests_p51_mutants.js:206-207`). O preflight **reduz** a exposição: aborta antes de mutar |
| 13 — campanha verde sem registro durável | T12: matriz por par + `matriz-gate-mutante.md`; **zero** byte de evidência de volta ao índice |

## Contratos

Nenhum bridge de runtime, payload de sessão ou estado de módulo de produto —
**R9 §5 não se aplica** (nenhum dado novo vive no produto). Os contratos desta
demanda são de **instrumento**:

### C1 · JSON do preflight (stdout, objeto único)

```json
{
  "harness": "p51",
  "arquivo": "tests_p51_mutants.js",
  "interpretador": { "nome": "python3", "origem": "MUTATION_PY|padrão", "resolvido": true },
  "arquivos_mutados": ["USER_GUIDE.md", "ui_journey_v32.js", "ui_p50_results_v32.js",
                       "ui_p50_shell_v32.js", "ui_p50_v32.css", "ui_v32.js"],
  "mutantes": [
    { "id": "M51-03", "arquivo": "ui_p50_shell_v32.js", "ocorrencias": 1, "estado": "ok" },
    { "id": "M51-18", "arquivo": "ui_v32.js", "ocorrencias": 2, "estado": "nao_executavel",
      "causa": "âncora ambígua" }
  ]
}
```

- **Dono**: cada harness (escreve). **Consumidor único**: `check_mutation.py`.
- `estado` ∈ `ok` · `nao_executavel`; `causa` obrigatória quando `nao_executavel`,
  do conjunto fechado de T4. Exit 0 sse `resolvido == true` e todo `estado == "ok"`.
- **Não escreve arquivo, não muta, não reconstrói, não executa gate** (R7 §3).
- Texto humano vai para **stderr**; stdout carrega **só** o JSON.

### C2 · `mutation_map.json`

Chave nova `"preflight": true` em `p50`/`p51`/`p52` (contrato: `<cmd> --preflight`
emite C1); ausente/`false` em `core` ⇒ dívida impressa (T8). `targets` da `p51`
reconciliados (T11). `receipts` **não** ganha entrada para a `p51` (T12).
Dono: `build-engineer`; consumidor: `check_mutation.py`.

### C3 · `mutation-matrix.json` — par expandido da P51

Campos por par, além dos já validados por `check_tdd.py:49-52`
(`mutante`/`harness`/`gate`/`ultima_prova.resultado`):
`propriedade` (o que o mutante ataca, em uma frase), `ancora`
(`{arquivo, ocorrencias, reancorada_em, razao}` quando houve reancoragem),
`classificacao` (obrigatória quando `ultima_prova.resultado != "KILL"`,
vocabulário fechado), `ultima_prova.registro` (caminho existente).
Dono: `qa-engineer`; consumidores: `check_tdd.py` (estrutura) e
`check_mutation.py` (cobertura nominal da `p51`, IC-5).

### C4 · Seam de ambiente

`MUTATION_PY` — nome do binário do interpretador, honrado **igualmente** por
`check_mutation.py` e pelas três harnesses (T1). Precedente de forma:
`CHROME_PATH` (`check_mutation.py:33`, `env_doctor.py:72`). `MUTATION_DEFER_MISSING`
permanece com a semântica atual, intocada.

### Arquivos rastreados que mudam (pinados → `gen_pins.py` no MESMO PR)

| Arquivo | Mudança | Pin |
|---|---|---|
| `tests_p51_mutants.js` | T1/T3/T4/T5/T6 (E1) + reancoragem das quatro (E2) | `pins.json:185` |
| `tests_p50_mutants.js` | T1/**T3**/T4/T5/T6 (E1) — os **26** filtros inline migram para o `envOverride` que o runner já aceita (`:99`) | `pins.json:184` |
| `tests_p52_mutants.js` | T1/T4/T5/T6 (E1) — T3 **já cumprida** (0 prefixos; `envOverride` em uso, `:1374`) | `pins.json:188` |
| `.claude/verify/check_mutation.py` | T2/T7 + asserções IC-1..IC-6 | `pins.json:69` |
| `.claude/verify/mutation_map.json` | C2 (preflight + `targets` da `p51`) | `pins.json:83` |
| `.claude/verify/mutation-matrix.json` | C3 (pares da P51 + dívidas) | fora do registry (`_meta.exclusoes`) — conferir no repin |
| `specs/013-integridade-da-campanha/*.md` | artefatos da demanda | entram no repin (precedente 007/008/012) |
| `.claude/BACKLOG.md` | **condicional** — EA-4, EA-5 e EA-6 escritos **juntos** pelo `doc-writer`, só depois que o PR #28 (EA-3) chegar a `develop` (decisão 1.6 + decisão de escopo de 2026-08-29) | `pins.json:18` |
| `.claude/verify/pins.json` | regenerado (classe `registry`, motivo no commit) | — |

**Não mudam**: `pipeline.yaml`, `run.sh`, `.github/workflows/verify.yml`,
`expected_suites.json` (nenhuma suíte nova — os harnesses não são suítes
registradas), `check_tdd.py`, `env_doctor.py`, `boundary.json`,
`known_issues.json`, `invariants.json`, `CONTEXT.md` (glossário fechado na
Fase 0), `tests_core_mutants.js`, **qualquer byte de produto**, **qualquer suíte
`tests_*.js` de gate**.

## Tipagem prevista das tarefas (R3 — a matriz final é do `tasks.md`)

| Trabalho | Tipo | Red? |
|---|---|---|
| IC-1..IC-6 em `check_mutation.py` (o **gate**) + prova de red | **feature** | **Sim** — red natural: hoje IC-2 (M-IC3), IC-4 e IC-6 (M-IC8/M-IC9) reprovam sem tocar nada |
| E1 nas três harnesses (o **julgado**) — `p51`: T1+T3 (cria plumbing) +T4/T5/T6; `p50`: T1+T3 (usa a plumbing que já tem, 26 filtros) +T4/T5/T6; `p52`: T1+T4/T5/T6 (T3 já cumprida) | **fix** | Sim (o red é o do gate acima, commitado antes) |
| E2 reancoragem das quatro + as três provas de T9 | **fix** | Sim (IC-4/IC-8; as âncoras podres de hoje são o red) |
| E3 classificação dos sobreviventes residuais | **doc** | Não (classifica e registra; não escreve asserção nova) |
| E4 `targets` + matriz por par | **fix** (targets) / **doc** (matriz) | Sim para `targets` (M-IC8/M-IC9 são o red) |
| `matriz-gate-mutante.md` + relatório final | doc | Não |
| `gen_pins.py` no mesmo PR | chore | Não (rito R8; o stage `baseline` prova) |
| EA-4 · EA-5 · EA-6 no `BACKLOG.md` (condicional) | doc | Não |

**Separação de poderes (R3 §2)** — nota ao `plan.md`, não decisão do `tasks.md`:
o **julgador** é `check_mutation.py`, escrito pelo `qa-engineer` com red provado
**antes**; o **julgado** (as três harnesses, E1) é implementado pelo
`build-engineer`; a **reancoragem** (E2) e a **classificação** (E3) são do
`qa-engineer`, e seu critério de aceite é **externo** — os gates `P51-*` já
existentes em `tests_p50_core.js`/`tests_p50_chromium.js`, que ninguém desta
demanda escreve nem edita. `tests_p51_mutants.js` recebe dois donos diferentes
(E1 e E2) e por isso **nunca na mesma wave** (R5 §waves) — o que coincide com a
ordem obrigatória E1 → E2 → E3 → E4 do refinamento.

## Achados que esta demanda fecha (ids reservados, escrita condicionada)

Decisão de escopo tomada **sob delegação** em 2026-08-29 e registrada no
`planning-state`: a família de mecanismos passa de três para **quatro**, com
cadeia causal explícita.

| id | Mecanismo | Fecha por qual gate | Nasce |
|---|---|---|---|
| **EA-5** | a campanha reporta `NÃO DETECTADO` para mutantes que **não rodaram** — três estados colapsados num rótulo (`tests_p51_mutants.js:186-187`, `:202`, `:209`) | IC-3 (três estados + causa nomeada) e IC-4 (âncora provada antes de mutar) | `aberto` → `resolvido` no mesmo PR (decisão 1.7: a entrega **inclui** a asserção que reprova) |
| **EA-6** | o requisito declarado **não tem dentes**: `have("python") → True` incondicional (`check_mutation.py:30-31`); os **quatro** harnesses declaram `python` e nenhum pode reprovar por isso — R7 §4 furada por dentro do mecanismo criado para aplicá-la | IC-2 (execução adversarial com interpretador ausente reprova nomeando) | idem |

**EA-6 é a raiz de EA-5**: se o requisito tivesse dentes, o Windows teria
reprovado no portão (`ambiente sem python`), a campanha nunca teria rodado e
nunca teria reportado um veredito para 20 mutantes que não rodaram. O achado
**não morde hoje** (o CI Linux tem `python3`), o que o torna mais perigoso —
gate que nunca falhou é gate de que ninguém desconfia. Essa é a razão de IC-2
existir como **execução adversarial**, e não como leitura de código.

**Escrita**: EA-4, EA-5 e EA-6 são escritos **juntos**, pelo `doc-writer`,
**depois** que o PR #28 (EA-3) chegar a `develop` — ids em branches paralelas
que "nunca renumeram" (R12) é conflito de merge no pior lugar possível.

## Riscos nomeados e escalonamentos previstos

1. **Rot fora das quatro.** O preflight varre `p50` (53 mutantes) e `p52` (~72)
   pela primeira vez. Se revelar âncora podre ou ambígua fora da `p51`, a rota é
   **classificar e registrar** (achado + dívida declarada), **não** reancorar por
   conta própria: reancoragem exige a triagem de três saídas com dono e
   julgamento de propriedade (T9), e ampliar a E2 para outras campanhas é
   ampliação de escopo. Escalar ao orquestrador com a lista.
2. **"1 não-detectado na `p51` e 1 na `p52`" não é medição desta fase.** O número
   vem da execução do PR #24 e **não é verificável neste worktree** (o recibo cai
   em caminho gitignorado, `.gitignore:15`). A spec **não pina esse número**: a E3
   classifica **todo** mutante que terminar em `SOBREVIVENTE` depois de E1+E2 —
   podem ser dois, um, nenhum ou mais. Contagem que não foi medida não vira
   critério de aceite (R2 §1).
3. **Sobrevivente = gate sem poder discriminante.** Se a classificação chegar a
   essa saída, esta demanda **para**: registra achado `EA-*` (id alocado pelo
   `doc-writer`, sem colidir com o EA-3/EA-4 da branch invisível) e a correção é
   demanda/`fix-finding` próprio. A 009 espera a decisão do proprietário — não o
   contrário.
4. **Borda 8 (deferimento sem contrapartida).** Vincular o `DEFER` do job
   `verify` à execução efetiva no job `visual` exige mexer em `verify.yml` e/ou em
   proteção de branch. **Fora do escopo desta spec**; entra em `dividas_declaradas`
   com a cadeia fechada, para virar demanda própria.
5. **Colisão de id no `BACKLOG.md`.** O EA-3 vive no **PR #28**, em branch que
   este worktree não enxerga (verificado na Fase 0: `Grep` por `EA-3`/`EA-4` na
   árvore inteira não retorna nada). EA-4/EA-5/EA-6 são a **última** tarefa e só
   ocorrem se o PR #28 já estiver em `develop`; caso contrário, saem como
   `DEPENDÊNCIAS` do relatório final, com a cadeia completa preservada aqui e no
   `refinement.md`. A entrega **não** fica bloqueada por isso — o registro do
   achado é doc, e o que fecha o defeito é o gate, não o id.
6. **Achados de vizinhança já observados, deliberadamente não corrigidos**
   (R5: "corrigir de passagem" é mudança sem rastro): `tests_p50_mutants.js`
   grava `P50-5.0.3-mutation.json` enquanto o `mutation_map.json:35` declara
   `P50-5.0.5-mutation.json` (recibo declarado que nunca casa, e em caminho
   gitignorado); e o `process.exit` da `p50` compara com `MUTANTS.length` em vez
   de `SELECTED.length`, o que faz toda execução parcial sair ≠ 0. Vão para
   `DEPENDÊNCIAS`/backlog, não para o diff.

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** Nenhum byte de produto muda
  (IC-7 assere). INV-1 **não é acionada**: nem Porta A nem Porta B. As
  invariantes tangenciadas (INV-2/INV-3 via `P51-PDF1`, INV-7 via
  `P51-RPT6`/`P51-UX2`, INV-10 via `P51-DOC13`) são **tangenciadas pela prova**,
  não pelo comportamento: nenhum gate é reescrito, nenhuma asserção enfraquecida.
  `invariants.json` fica byte-idêntico — nenhuma entrada nova, nenhum gate
  removido do mapa.
- [x] **`design-decisions.md` (R13) — nenhum conflito.** "Suítes visuais fora do
  agregado local" é **reforçada**: a demanda não faz Chromium rodar no Windows,
  faz a campanha **dizer por que não rodou**. "Fases 5.0-5.2 seladas" é honrada:
  nenhum registro de `docs_phase5/**` é retro-ajustado, e a linha final histórica
  do relatório é preservada quando a campanha conclui (T5). "Evidência migrada
  (007/008)" é honrada: zero byte de evidência volta ao índice (T12). Nenhuma
  candidata pendente é tangenciada.
- [x] **Specs validadas anteriores — nenhuma contradição.** 003/007/008/012 não
  normatizam campanha de mutação além de exigir o pipeline verde; a 012 é
  **precedente de forma** (namespace próprio, auto-exclusão nominal, adversarial
  em worktree efêmera, repin no mesmo PR) e é seguida.
- [x] **Specs de fase seladas — verificado por leitura, não por memória.**
  `specs/PHASE_5_0_REV_B.md` (normativa, SHA registrado em
  `current_phase.json`) cita mutante em `:416-417` e `:1288` e `:1834` — todos
  sobre `P50-UX13`/UX 4.1, **nada** sobre a campanha `p51`, nenhuma contagem de
  mutante pinada em prosa. `specs/PHASE_5_0_REV_A.md` é histórica (REPROVADA,
  classe `legacy`) e **não menciona** mutante. A §29.4 (`:1613-1621`) é a única
  tensão e está **fora de litígio** (EA-1 Face B, `fix-finding` encomendado,
  R13): T10 a contorna fazendo a prova de neutralização em cópia, sem editar
  suíte de gate. `current_phase.json` **não muda** — nenhuma âncora normativa é
  trocada, nenhuma fase é aberta.
- [x] **Boundary (R6) — nada protegido tocado; nenhuma PARADA.** Os quatro
  harnesses não estão em `boundary.json` (classes `frozen`/`generated`/`legacy`/
  `registry`), não estão em `PROTECTED` (`tests_p50_core.js:82-229`) e não estão
  em `frozenSuites` (`:235-238`) — verificado nesta fase. `check_mutation.py`,
  `mutation_map.json` e `mutation-matrix.json` também não. Edição livre **com
  repin no mesmo PR** (R8 §1). `pins.json` é classe `registry`: só via
  `gen_pins.py`, com motivo no commit — **rito cumprido, não exceção**. Nenhuma
  superfície protegida precisa de autorização, e por isso **esta spec não pede
  ratificação de proprietário em ponto nenhum**.
- [x] **R10 — as 10 proibições respeitadas por desenho.** §1 nada enfraquecido
  (`have("python")` deixa de ser tautologia; a razão `D/T` só some quando é
  falsa); §2 zero SKIP silencioso — ambiente ausente é FAIL/DEFER **nomeado** e
  âncora podre é FAIL nomeado; §3 nenhuma contagem pinada muda
  (`expected_suites.json` intocado — harness de mutação não é suíte registrada);
  §4 nenhum pin inline novo; §5 nenhuma âncora de regressão em `HEAD:`/branch;
  §6 o oráculo é **JSON entre executáveis**, e a orquestração fica no stage, não
  dentro de gate; §7 processo externo com caminho **entre aspas** e dependência
  declarada e **verificada** (T1/T2); §8 nada escrito em arquivo versionado —
  adversariais em worktree efêmera, preflight não escreve; §9 a checagem nova
  entra em executável do `pipeline.yaml` (stage `mutation`), nunca em prompt de
  agente; §10 **auto-exclusão nominal** do scanner de IC-1 (o próprio
  `check_mutation.py` e esta spec carregam os literais proibidos, e são excluídos
  por path).
- [x] **R11 / decisão Q1 — entrada de evidência.** Nenhum byte de evidência volta
  ao índice; `receipts` não ganha entrada para caminho ignorado; o registro
  durável é a matriz + `matriz-gate-mutante.md` (T12).
- [x] **R9 — nenhum runner compartilhado.** Três edições paralelas do mesmo
  *shape*, com `tests_core_mutants.js` como referência (decisão 1.4). Nenhum
  módulo novo, nenhum bridge, nenhum `window.__*`, nenhum estado canônico novo.

## Fora de escopo

Herdado integralmente do refinamento (§Fora de escopo), em especial: corrigir
gate sem poder discriminante; a checagem **genérica** de arquivo órfão
(`check_mutation.py:58`, EA-3); a tensão §29.4/EA-1; fazer as suítes Chromium
rodarem no Windows; **qualquer byte de produto** — incluindo qualquer edição do
`USER_GUIDE.md` para fazer `M51-19`/`M51-20` casarem; extrair runner
compartilhado; desbloquear o PR #24 por atalho; reintroduzir bytes de evidência
no índice.

Acrescentado por esta spec:

- **Expandir a matriz da P50 ou da P52 por par** — só a P51 (decisão 1.8; T13).
- **Editar `tests_core_mutants.js`** — é a referência; sua falta de preflight é
  **dívida declarada** (T8), não tarefa.
- **Stage novo no `pipeline.yaml`, mudança em `run.sh` ou em `verify.yml`** —
  incluindo o fechamento da borda 8 (vincular `DEFER` à execução no job
  `visual`), que fica registrado como dívida com cadeia fechada (Risco 4).
- **Reancorar mutante de `p50`/`p52`** que o preflight venha a revelar podre —
  classificar e registrar; reancorar é E2 e a E2 é nominal às quatro (Risco 1).
- **Corrigir o recibo declarado da `p50` e o `exit` de execução parcial** —
  achados de vizinhança, vão para `DEPENDÊNCIAS`/backlog (Risco 6).
- **Fixar a contagem de sobreviventes** ("1 na `p51`, 1 na `p52`") como critério
  de aceite — número não medido nesta fase (Risco 2).
