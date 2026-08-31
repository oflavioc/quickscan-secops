# Relatório final — 011-numeracao-das-prioridades

> Fase 6 · T027 · dono: `doc-writer` · 2026-08-31.
> Branch `feature/011-numeracao-das-prioridades` · HEAD `27aabe9` · PR
> [#32](https://github.com/oflavioc/quickscan-secops/pull/32).
> Demanda conduzida **sob a delegação do proprietário de 2026-08-29** — nenhuma
> ratificação nominal nova foi pedida nem dada; onde uma seria exigida, a rota foi
> recusada e está nomeada abaixo.
> Este relatório **não emite veredito**. Todo número aqui vem de execução citável
> ou de registro canônico; o que não foi executado está declarado como não
> executado, com o motivo (R2 §1).

## Objetivo cumprido

O item 1 do cliente (2026-08-27) dizia *"algumas questões dentro das prioridades
ficaram sem numeração"*. **Não era numeração — era o atalho de teclado**, e o `·`
é a ausência dele, desenhada a partir do décimo item.

O `product-owner` mediu **três** causas para "número faltando", não uma, e decidiu
que **a lista não deve ser numerada**: a ordem subjacente é severidade calculada
pelo produto, e numerá-la ancoraria a escolha do negócio nela — a doutrina da
INV-5 ao contrário —, além de colidir com a numeração legítima de
`Prioridade 1..3`, que é por ordem de **declaração**. O defeito real, aquele que a
demanda corrigiu, é **o glifo numérico ler como índice**.

O remédio foi um módulo novo (`ui_d011_prioridade_v32.js` + `ui_d011_prioridade_v32.css`)
que decora a tela depois do render congelado: glifo mudo sem conteúdo textual,
`aria-hidden` no glifo, `aria-keyshortcuts` no botão, legenda em português dizendo
o que o número é — e uma regra de impressão do próprio módulo. Zero byte em
arquivo protegido.

| Causa medida no refinamento | Veredito executado |
|---|---|
| 1 · `·` a partir do décimo (Camada 1, `:728`) | **Mudou de forma**: o `.key` permanece no DOM e fica textualmente vazio (`D011-KEY2`); o fato migra de glifo para a legenda |
| 2 · reagrupamento por domínio espalha o `1..9` (`ui_ux_v32.js:154-168`) | **Permanece, declarada**: nenhum critério exige sequência contígua — exigir mataria UX10 |
| 3 · `✓` substitui o número no selecionado | **Permanece, inalterada**: é estado, não índice, e `aria-pressed` já o entrega |

## Cadeia da demanda — 29 commits, waves 0 a 6

| Fase | Commits | O que entregou |
|---|---|---|
| 0 Refinamento | `b377da6` `068ac36` | três causas separadas; rota (a); P9 (lista vazia) fora do escopo |
| 1 Spec | `5b529c9` | o cross-check derrubou a premissa do próprio refinamento (ponto 1 abaixo) |
| 2 Plano + errata | `5c556dc` `4db6583` | `PP-011-1`; `UX14` medido tautológico; par de print declarado indivisível |
| 3 Tarefas | `30d63bd` `f5d9230` `c90e189` | 33 tarefas em 7 waves; repin R0 fecha dívida de 3 artefatos sem pin |
| W0–W1 | `84c92a1` `0915b52` | glob do `lint-arch` estendido para `ui_d0*_v32.js`; bridge `__D011` registrado |
| 4 Red | `5bf4731` `6beddf5` `b42c7de` | **1 PASS · 5 FAIL de 6**, commitado |
| W3 | `0a814db` `5140032` | módulo (297 linhas) + CSS (86 linhas) |
| W4 | `b37c8e8` `8857b55` | injeção no builder + rebuild → **6 PASS · 0 FAIL** |
| W5 | `43128ed` `8a80fb8` | campanha 18 DETECTADO; `D011-M6`/`D011-M8` em worktree efêmera |
| merge | `fff9888` `a9aab93` | `develop` com a 010 dentro; repin fora da tabela (declarado abaixo) |
| Reprovação do PO | `9e9274d` `0b35632` | 3ª cláusula de print: **5 PASS · 1 FAIL** |
| Correção | `39e8785` `eb96be8` `1d83a7f` `5641090` | forma B, uma linha; rebuild → **6 PASS · 0 FAIL** |
| W5 (fecho) | `a7330fb` `27aabe9` | `D011-M20` armado; **19 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO** |

## Números — o que cada gate emitiu

Execução própria do `doc-writer` em 2026-08-31, worktree `phase5-011`, HEAD
`27aabe9`, **árvore limpa antes e depois**, node v24.19.0 · python 3.14.7 ·
jsdom 30.

| Stage / suíte | Emitiu |
|---|---|
| `env-doctor` | **0 FAIL · 1 WARN** — WARN nomeado: Chromium indisponível (KI-3) |
| `baseline` | **281/281 pins conferem · 0 divergentes · 0 ausentes · 0 sem pin** |
| `boundary` | **9/9 paths protegidos coerentes** |
| `marker-lint` | **38 marcadores distintos · 0 problema(s)** |
| `icons-check` | `ui_icons_v32.js` check OK · 26 assets · `32aabc3445571d44` |
| `build` | rebuild **byte-idêntico** ao publicado (`ad62b2e501c02f85…`); árvore inalterada pela execução |
| `lint-arch` | **0 problema(s)** — 5 módulos novos sem `innerHTML=` e com IIFE; 16 bridges registrados |
| `state` | **8 demanda(s) · 0 problema(s)** |
| `tdd` | **8 demanda(s) · 0 waiver(s) · 0 problema(s)** (dívidas listadas em voz alta) |
| `m41` | comparação com o snapshot **PASS**; payload `9794b267e4225d8f…` **== pin declarado** — **inalterado** |
| `suites` | 17 suítes nas contagens canônicas: **d011 6/0**, d010 13/0, d009 15/0, ux41 56/0, ref 28/0, p50core 64/0, p52layout 45/0, engine 105/0, target 30/0, journey 31/0, unset 12/0, icons46 12/0, ui31/ui32/ui33/ui332/ui333 19/25/11/23/26 |
| `suites-heavy` | session **97 PASS · 0 FAIL** |
| `evidence-bridge` | **0 FAIL · 0 WARN** |
| `mutation` | **1 campanha executada · 0 problema(s)** — `d011`: **19 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 19**; restauração do source e do HTML byte a byte OK; `IC-4`: **19 âncoras com `ocorrencias == 1`** |
| `compliance-audit.sh` | **13 PASS · 0 FAIL** |
| `tests_011_prioridade.js` (direto) | **6 PASS · 0 FAIL de 6** |

**Matriz gate↔mutante**: **22 pares** `D011-*` — 19 na campanha local, `D011-M6` e
`D011-M8` em raia efêmera (arquivo protegido nunca entra no harness automatizado),
`D011-M9` deferido ao job `visual`.

**Não executado, declarado**: `tests_011_chromium.js` (`D011-CON1`, C10) e
`D011-M9` — sem Chromium nesta worktree. Executada aqui, a suíte terminou
**0 PASS · 1 FAIL** com o motivo nomeado (`Executable doesn't exist … npx
playwright install`), nunca em SKIP silencioso (R10 §2). Ver "O que fica aberto".

**Zero byte em arquivo protegido**, conferido por diff contra o merge-base
`86a4f1e`: os 19 arquivos do diff não incluem `engine_v32.js`,
`quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`,
`v3_1_3_functional_snapshot.json`, `ui_ux_v32.js`, `ui_ux_v32.css`,
`MANIFEST.sha256` nem `specs/PHASE_5_0_REV_A.md`.
`quickscan_secops_soccmm_v3_2_dev.html` mudou como classe `generated` — identidade
provada no stage `build`; `pins.json` mudou só por `gen_pins.py`.

## As duas janelas vermelhas — e a contagem que não foi rebaixada em nenhuma

O registro canônico das duas vive no `_trilha` da chave `d011` em
`.claude/verify/expected_suites.json`, escrito pelo `qa-engineer` no mesmo commit
de cada janela (R10 §3). Nenhuma das duas rebaixou a contagem: rebaixar teria
**enshrinado o vermelho como alvo**, que é exatamente o enfraquecimento que a
R10 §1 proíbe (precedente `d009`).

| | Janela 1 — o red da Fase 4 | Janela 2 — a reprovação do PO |
|---|---|---|
| Abertura | `5bf4731`, 2026-08-31 | `9e9274d`, 2026-08-31 |
| Execução real | **1 PASS · 5 FAIL de 6** | **5 PASS · 1 FAIL de 6** |
| Verde declarado | `D011-KEY1` — critério de **preservação**, nasce verde por desenho; a dívida está escrita na linha de C1 da spec | os cinco gates anteriores |
| Vermelhos, com motivo nomeado | `D011-KEY2` (6 itens sem atalho ainda exibem `·`) · `D011-ACC1` (15/15 `.key` sem `aria-hidden`) · `D011-LEG1` (0 nós com o texto canônico) · `D011-IDEM1` (divergência do oráculo) · `D011-PRT1` (bloco CSS ausente no HTML construído) | `D011-PRT1(f)`: **6/6 itens SEM ATALHO continuam visíveis no papel** |
| Contagem canônica durante o vermelho | **6/0**, nunca 1/5 | **6/0**, nunca 5/1 |
| Fecho | rebuild da wave 4 (`b37c8e8`) e fixação por execução em T024 | correção forma B (`39e8785`) + rebuild (`1d83a7f`) |

A contagem `6` é **medida por execução** ("de 6" na saída real), nunca derivada dos
11 critérios: C6/C7/C9 são critérios de processo sem gate próprio nesta suíte e
C10 vive em `tests_011_chromium.js`.

## As duas expansões de escopo do `qa-engineer` — ratificadas, e declaradas

O `plan.md`/`tasks.md` previa **12 mutantes**; a matriz tem **22 pares** `D011-*`.
O desvio é do artefato aprovado e vai escrito, como o próprio QA exigiu. **Todas
as adições fortalecem; nenhuma enfraquece asserção** — nenhum gate foi afrouxado
para acomodar mutante algum.

| Momento | Delta | Ids | Razão medida |
|---|---|---|---|
| Wave 5 (`43128ed`, matriz em 21 pares) | +9 | `D011-M3B` e `D011-M5B` (2ª variante que a spec já nomeava **dentro** de `D011-M3` e `D011-M5`, promovida a par próprio porque as alíneas `ACC1(d)` e `LEG1(b)` não tinham carrasco algum); `D011-M13` (metade simétrica do `D011-M12` — as cláusulas "indivisíveis" da errata); e **seis pares propostos**: `D011-M14` `M15` `M16` `M17` `M18` `M19` | sete alíneas ficariam sem carrasco. O critério que o QA usou é melhor que a taxonomia que lhe foi oferecida: *"o observável que o critério pede já tem carrasco?"* — mutante mirado no mecanismo, e não no observável, sobreviveria por desenho |
| Fecho da wave 5 (`a7330fb`) | +1 | `D011-M20` | a 3ª cláusula de print, nascida da reprovação do PO, ficaria sem carrasco próprio |

Duas propriedades medidas no mesmo passe, e é por elas que os pares novos não são
redundância: **`D011-M12` e `D011-M13` morrem em alíneas DIFERENTES do mesmo
gate** — prova de que as duas cláusulas indivisíveis não se subsumem; e a
**simetria completa** do print, **seis mutantes, seis alíneas**: `D011-M18`(a)
`M19`(b) `M13`(c) `M12`(d) `M10`(e) `M20`(f).

Duas **provas de desenho** valem aqui tanto quanto os kills, porque medem que dois
gates não medem a mesma coisa: sob `D011-M1`, o `D011-KEY1` **sobreviveu** (PASS),
como exigido — o ponto médio não é dígito e o C1 só fala de glifo numérico; sob
`D011-M20`, o `D011-KEY2` **sobreviveu** (PASS) — `KEY2` é a cláusula de **tela**
(o `.key` fica textualmente vazio) e a alínea (f) é a de **papel** (o `.key` some
inteiro, com a moldura).

## Pontos com nome próprio

### 1 · O cross-check derrubou a premissa do próprio refinamento

O refinamento aprovou a rota (a) — desambiguar na camada UX — sob a premissa de
que `ui_ux_v32.js`/`.css` eram **classe não protegida, rito nenhum**. O
cross-check da Fase 1 mediu as três fontes e a premissa caiu: os dois arquivos
**estão** em `PROTECTED` (`tests_p50_core.js:159` e `:346`), asseridos por
`P50-GOV1` e pinados (`pins.json:277-278`) — **verdadeiro contra a §29.4 da spec
selada, falso contra `boundary.json`**, que silencia sobre eles. E a autorização
nominal da 009 **não cobre**: ela é, textualmente, "exclusivamente no escopo da
demanda 009", e `ui_ux_v32.js` nunca esteve entre os quatro arquivos autorizados
lá.

**Isto é o `EA-1` se pagando**: o item de cross-check que o `fix-finding` do EA-1
acrescentou ao template de spec pegou **na Fase 1** o que a demanda 010 só
descobriu no meio da implementação — quando mudar de rota já custava outro preço.

E a saída estava na mesma spec selada que impõe a proteção: **UI-004**
(`PHASE_5_0_REV_B.md:378-397`) autoriza, por escrito, "superfície nova da Camada 5
e/ou **decoração pós-render** a partir de **módulo novo da fase**", proibindo
reescrever markup dentro da Camada 1. A demanda seguiu a rota **A2** e **não
consumiu autorização de boundary alguma**.

**Patch-point escolhido — `PP-011-1`**: `MutationObserver` estreito sobre `#app`,
`{childList:true, subtree:true, attributes:false}`, com guarda `busy`,
write-if-different e `try/catch` por passada. Owner nomeado
(`ui_d011_prioridade_v32.js`), bridge `__D011` de shape fechado
`{ __installed, diag() }` — **sem `decorate()`, de propósito**: gate que chamasse
a decoração à mão passaria com o observador morto, e é isso que `D011-M11` existe
para provar (sob ele, `KEY2`, `ACC1` e `LEG1` reprovaram as três, e `KEY1`
sobreviveu, como exigido).

| Rota recusada | Custo medido da recusa |
|---|---|
| `PP-A` · 5º wrapper do binding global `render` | R9 §4 proíbe monkey-patch para módulo **novo**; o precedente mais próximo (AMB-1) foi aprovado **nominalmente pelo proprietário** — autorização que a delegação não dá |
| `PP-C` · estender `p50AfterRender` / `registerScreenHook` | `ui_p50_shell_v32.js` é alvo de **três** campanhas (`p50`, `p51`, `p52`), **todas exigindo Chromium**: tocá-lo jogaria o fechamento da demanda para o job `visual` do CI |
| `PP-D` · captura de evento / delegação de clique | anula o congelado por fora e não cobre os renders que não vêm de clique |
| `PP-E` · editar `ui_ux_v32.js` | **não foi preciso**. Se `PP-011-1` fosse indisponível, a demanda pararia aqui e escalaria: §29.4 + `P50-GOV1` exigem autorização nominal do proprietário, por demanda |

### 2 · O mesmo ponto cego, no CSS e no gate que deveria vigiá-lo

A primeira regra de impressão casava só `data-d011="atalho"`, e a justificativa
escrita ao lado dela era "preservar o estado de seleção no papel". Essa razão
exige excluir `"estado"` — e **não implica nada** sobre o terceiro valor,
`"mudo"`. O seletor tinha sido escrito **pela positiva**, e o valor que ninguém
enumerou continuou imprimindo: `visibility:hidden` apaga o conteúdo, mas não a
borda herdada de `.opt .key` (`border:1px solid var(--line)`, e `--line` vira
`#c9c9c9` dentro do `@media print`).

Censo medido na fixture com um item selecionado: **8 `atalho` escondidos, 1
`estado` visível (correto), 6 `mudo` VISÍVEIS** — molduras vazias **exatamente nos
seis itens que o cliente apontou**, e sem a legenda que os explicaria, porque ela
some no papel por desenho (alínea `d`). A troca de categoria que a demanda existe
para desfazer sobrevivia na superfície onde ninguém pode corrigi-la lendo.

**E o gate tinha o mesmo ponto cego que o CSS**: as alíneas (c) e (e) do
`D011-PRT1` nomeavam "atalho" e "estado" e **nunca perguntavam pelo terceiro
valor**. Nenhum dos dois pegou o outro. Quem pegou foi uma **leitura do
`product-owner`** — e a alínea nova, por isso, **não enumera**: os nós vêm do
oráculo (índice canônico ≥ 9 e não selecionado).

### 3 · A forma da correção foi decidida por medição, não por gosto

Duas formas passam no gate **igualmente**:

- **forma A** — `.d011-key:not([data-d011="estado"])`, uma linha só, elegante;
- **forma B** — uma linha nova para `"mudo"`, preservando a linha de `"atalho"`
  **byte a byte**.

A forma A **substituiria** a linha de `atalho` e levaria as âncoras de
`D011-M10`, `D011-M13` e `D011-M19` a `ocorrencias = 0`: o `IC-4` reprovaria e o
stage `mutation` cairia inteiro **mesmo com a campanha correta**. Escolheu-se a
forma B, conferida por preflight no working tree — `ocorrencias = 1` nas três
âncoras antigas e na linha nova, o que também tornou `D011-M20` ancorável, no
literal que a matriz já deixara pronto. O comentário do bloco foi reescrito **pela
negativa**, com o censo, a razão da forma e o controle inverso: esconder de menos
reprova em `D011-PRT1(f)`; esconder demais, em `D011-PRT1(e)`.

### 4 · A regressão de auditabilidade que o QA causou e corrigiu

Ao alongar o rótulo do `D011-PRT1` para a terceira cláusula, a alínea passou a ser
**cortada pelo `slice(0,240)` do log** da campanha. O **veredito continuava
certo** — a `reason` casa a linha inteira, antes do corte —, mas **o log deixara
de provar por si**. O QA ampliou o corte para 420 e **reexecutou a campanha
inteira**, para que log e artefato voltassem a ser coerentes. É a diferença entre
"o gate está certo" e "o gate é auditável", e ninguém teria notado até alguém
precisar da linha inteira.

### 5 · Série de repins — o previsto, a dívida e os desvios

`gen_pins.py` calcula sobre **blobs de HEAD**: repin nunca viaja no commit que
altera o arquivo, é sempre um `chore` imediatamente posterior. "No mesmo PR"
(R8 §1) não é "no mesmo commit".

- **R0 (`f5d9230`) fechou dívida aberta antes da demanda**: `refinement.md`,
  `spec.md` e `plan.md` haviam entrado rastreados sem repin — o `tech-lead` achou o
  baseline vermelho com **3 sem pin** e transformou o achado na T001.
- **Executados: 11 `gen_pins.py`** — R0, R1, R2, R3, R4, R5, o repin do merge, R6,
  R7, R8 e R9. O `tasks.md` previa **9** (R0–R6c, o último condicional).
- **Desvio 1, declarado**: `a9aab93` — repin **fora da tabela**, exigido pelo merge
  de `develop` (com a 010 dentro) para dentro da branch. O `tasks.md` antecipava
  exatamente esta classe de desvio e mandava registrá-la aqui.
- **Desvio 2, declarado**: depois do merge a série foi **renumerada** R6/R7/R8/R9
  em vez de R6a/R6b/R6c. É granularidade e nomenclatura, não pin faltando — o
  `baseline` fecha em **281/281 · 0 sem pin**.
- **Desvio 3, declarado**: `.claude/verify/pipeline.yaml` entrou no diff da wave 1
  (a `desc` do stage `lint-arch` passou a dizer `ui_p5* + ui_d0*`). O `tasks.md`
  nomeava só `check_lint_arch.py` e `bridges.json`; a mensagem do commit `0915b52`
  já declarava os três. Adjunto em escopo, registrado para não ficar silencioso.

## O que fica aberto — declarado, não maquiado

| # | Item | Estado, com a causa medida |
|---|---|---|
| 1 | **Três ramos alcançáveis só pelo teste** — `attr-removido`, `remocao-legenda`, `legenda-excedente` | Categoria criada pelo `qa-engineer` e ratificada pelo `product-owner` pelo lado do produto. Medida por instrumentação: **0 hits nas três fixtures reais**, hits só sob cenário sintético (`__DEV` sem render + cutucão de `childList`). Causa fechada: `renderPriority` reconstrói `app.innerHTML` a cada render e todo caminho de produto que muda o estado canônico passa por `render()`. **O observável que cada critério pede tem carrasco**; o que fica sem mutante é o **mecanismo**, e mecanismo não é critério. Registrado em `mutation-matrix.json → dividas_declaradas` |
| 2 | **Duas alíneas sem mutante plausível** — `D011-KEY2(b)` (o `.key` permanece no DOM em 15/15) e `D011-IDEM1(d)` (desfazer devolve o estado inicial byte a byte) | Nenhuma mutação de âncora única deste módulo produz o defeito: o `.key` pertence ao owner congelado e o módulo não tem caminho que o remova; cada render reconstrói `#app`, então não há resíduo assimétrico possível. As alíneas **não são vácuas** — guardam um módulo futuro que passe a criar, remover ou cachear nós —, mas fechá-las exigiria modelar um defeito que ninguém escreveria |
| 3 | **`EA-17`** — a cláusula "CSS com prefixo próprio" do C8 **não tem verificador** | `check_lint_arch.py` faz quatro checagens e **nenhuma abre arquivo `.css`**; nenhum stage do `pipeline.yaml` lê `.css` para verificar prefixo ou allowlist. Para este módulo, "zero seletor alheio" é coberto **só dentro do `@media print`**, por `D011-PRT1(b)`/`D011-M19`. Ampliar o lint é do `build-engineer` com o `qa-engineer` e entra no `pipeline.yaml` (R10 §9), nunca no prompt de um agente |
| 4 | **Contraste (C10) deferido ao CI** — `D011-CON1` e `D011-M9` | KI-3: agendamento por desenho, não pendência de execução. **Obstáculo medido nesta leitura, que muda o tamanho da T030**: o job `visual` (`verify.yml:71-73`) roda `npm run test:visual` (Playwright sobre `tests_visual/`), `tests_p50_chromium.js` e `tests_p52_chromium.js` — **`tests_011_chromium.js` não é invocado por runner algum**, nem local nem no CI. A suíte está registrada em `expected_suites.json → visual.d011chromium` (1/0, `requires: ["chromium"]`), mas **registro não é execução**. Ver `spec-validate.md`, item 10 |
| 5 | **Rito visual do proprietário** | Pergunta que nenhum oráculo responde: **a moldura vazia na tela lê como "casa faltando"?** No papel ela some (cláusula f); na tela o `.key` permanece no DOM, vazio, por decisão de alinhamento (C2). Junto dela ficam os outros não mensuráveis que a spec declarou: a percepção residual "lê como índice", o accname computado, o efeito real da regra de print no PDF e a leitura por leitor de tela real |
| 6 | **Aceite de intenção do `product-owner` (T033)** | Não executado nesta wave |

## Achados devolvidos — ids já alocados na `develop`

A T028 previa alocar os ids **depois** que as demandas irmãs chegassem à
`develop`, e proibia alocar um número nesta worktree (R12: números citados nunca
renumeram). **A alocação já aconteceu fora desta branch**: o `.claude/BACKLOG.md`
de `origin/develop` (PR #33, mesclado em 2026-08-31) já traz os cinco, cada um com
`**Status**: aberto` e a cadeia `arquivo:linha→efeito`:

| Id | Achado | Origem nesta demanda |
|---|---|---|
| `EA-16` | `UX14` é constante por duas razões independentes: o gate não pode reprovar | achado colateral medido na Fase 2 |
| `EA-17` | R9 §6 (CSS com prefixo do próprio módulo) não tem verificador em lugar nenhum do pipeline | dívida do C8 |
| `EA-18` | gate que lê a árvore e gate que lê HEAD medem objetos diferentes: mutação só no disco passa no `baseline` | nuance medida ao armar `D011-M6` |
| `EA-19` | a tela de prioridade pergunta por gaps sobre uma lista vazia | decisão P9 do portão da Fase 0 |
| `EA-20` | o padrão que três demandas seguidas instanciaram: gate sem poder discriminante | `EA-7` → errata E17 da 010 → `UX14` |

**Nesta branch o `BACKLOG.md` ainda para em `EA-7`** — o `compliance-audit` local
lista 5 achados abertos (`EA-3` … `EA-7`). Os cinco ids acima entram aqui pelo
merge da `develop`, não por escrita minha: reescrevê-los criaria duplicata de id,
que é o que a R12 proíbe.

`tests_ux_m41.js` **não foi emendada**: é suíte congelada (§29.4 + `frozenSuites`);
o defeito fica registrado, não corrigido de passagem.

## O que o CI cobriu — e o que ele ainda não viu

- **Run `33410267738`** (evento `pull_request`, 2026-08-31T15:45Z, head
  **`a9aab93`**): job `verify` **success** e job `visual` **success**. No job
  `visual`, a campanha `d011` rodou em Linux: **18 DETECTADO · 0 SOBREVIVENTE ·
  0 NÃO EXECUTADO de 18**.
- **O head atual (`27aabe9`) não tem execução de CI**: em 2026-08-31,
  `gh pr view 32` devolve `statusCheckRollup: []` e `gh run list` não traz run
  algum para este SHA. O run citado acima está **8 commits atrás** — antes da
  terceira cláusula de print, da correção forma B, do rebuild e do `D011-M20`.
  Tudo o que veio depois está provado **localmente, em Windows**; a plataforma
  canônica é o **CI Linux** (R7 §5). **Isto não é um veredito meu: é a ausência
  de um.**
- **`D011-CON1` não foi executado em lugar nenhum** — nem local (sem Chromium) nem
  no job `visual` (que não invoca a suíte). É o item 4 de "O que fica aberto".

## Dependências deixadas para outros

1. **Orquestrador** — o `planning-state` de `011-numeracao-das-prioridades` está em
   `phase: "red"` e **sem `pr_url`**, com as waves 3 a 6 executadas. As irmãs 009 e
   010 estão em `validate`. O `state-eval` injeta esse campo a cada prompt: fase
   velha desinforma toda delegação seguinte. O stage `state` passa (o schema
   aceita), então o desvio **não é pego por máquina** — é por leitura.
2. **`build-engineer`** — repin depois do commit deste relatório e do
   `spec-validate.md`; e a decisão sobre o item 4 dos abertos, que é mudança em
   `verify.yml`/`pipeline.yaml`, não em prosa.
3. **`qa-engineer`** — o `_trilha` de `mutation_map.json → d011` ainda diz
   **"18 mutantes LOCAIS"** e enumera 18 ids sem `D011-M20`; o harness tem 19 e o
   `IC-4` mediu 19. Nenhum gate reprova (o `_trilha` é prosa, não dado lido pelo
   stage), mas o registro contradiz a execução, e o arquivo tem **um dono só**.
4. **`product-owner`** — aceite de intenção (T033) e o rito visual do item 5.
5. **Proprietário** — merge do PR #32 e, antes dele, uma execução de CI no head.

## Fontes citadas

- `specs/011-numeracao-das-prioridades/`: `refinement.md`, `spec.md` (+ errata da
  Fase 2), `plan.md` (§Registro de patch-points, §Rotas recusadas), `tasks.md`,
  `spec-validate.md`
- `.claude/verify/expected_suites.json` → `suites.d011._trilha` (as duas janelas
  vermelhas) e `visual.d011chromium._trilha`
- `.claude/verify/mutation-matrix.json` → os 22 pares `D011-*` e
  `dividas_declaradas`
- `.claude/verify/mutation_map.json` → harness `d011`
- `.claude/BACKLOG.md` de `origin/develop` → `EA-16` … `EA-20`
- `specs/PHASE_5_0_REV_B.md`: UI-004 (`:378-397`), §29.4 (`:1613-1620`),
  §29.6 (`:1631-1641`)
- Mensagens de commit `43128ed`, `9e9274d`, `39e8785` e `a7330fb` — a trilha das
  medições que este relatório resume
