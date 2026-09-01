# Relatório final — 015-superficies-de-apoio

> Fase 6 · T031 · dono: `doc-writer` · **2ª edição, 2026-09-01** (a 1ª saiu em
> `573a7d5`, no HEAD `9c88ac8`).
> Branch `feature/015-superficies-de-apoio` · HEAD `643a0a6` · PR
> [#34](https://github.com/oflavioc/quickscan-secops/pull/34) · worktree
> `phase5-015`.
> **Aceite de intenção do `product-owner`: "não encontrei objeção"** (2026-09-01,
> `bf4ecb5`) — agente reprova ou declara que não encontrou objeção; **nenhum
> agente escreve em registro de aceitação** (R4/D3).
> **O gap que a 1ª edição abriu está fechado**: `M17` e `M18` entraram no harness
> e a campanha fechou **15/15** (`5724fbd`). O que mudou entre as duas edições
> está marcado **[2ª ed.]**.
> Demanda conduzida **sob a delegação do proprietário de 2026-08-29**, com **uma**
> ratificação nominal própria: a autorização §29.4 de 2026-08-31, **por arquivo**
> (`ui_v32.js`, incluindo o caminho de impressão dentro dele) e **válida só para a
> 015**.
> Este relatório **não emite veredito**. Todo número aqui vem de execução citável
> ou de registro canônico; o que não foi executado está declarado como não
> executado, com o motivo (R2 §1).

## Objetivo cumprido

Os itens **6a** e **8** do cliente (2026-08-27) — os dois últimos dos nove.
**As duas leituras literais caem, por medição, e a medição está no refinamento:**

| Leitura literal do pedido | O que a medição devolveu |
|---|---|
| 6a · "remover o bloco de apoio das prioridades, que repete a 7ª seção" | **Três dos quatro estados de `#v32prio` são únicos no relatório** (`refinement.md` §M3): só o card sem payload é redundante, e é exatamente a classe que a errata E18 da 010 já colapsou em `#v32base` e que **não pode** ser colapsada aqui. Remover custaria, além disso, **oito** gates congelados em **quatro** suítes (`refinement.md` §M4, com a tabela partida em **um id por linha** para que a contagem seja derivável do artefato — ver §"A deriva de número") e a propriedade *prioridade declarada nunca desaparece* |
| 8 · "as listas de apoio deviam convergir" | **Suprimir qualquer uma das duas listas perde produto real em 3 das 7 combinações `qid × nível` alcançáveis** (`refinement.md` §M5): apagar o card-alvo tira FortiAI-Assist, FortiXDR e FortiEndpoint; apagar o `pr-gapsup` tira FortiSOC, FortiSOAR, FortiAnalyzer e FortiClient-EMS. Subtração dentro da jornada cujo enunciado é "declarar contexto nunca subtrai conteúdo" |

**O que o cliente sentiu é real, e a causa é outra.** São **dois títulos
adjacentes com quatro palavras em comum** — `"Como a Fortinet pode apoiar nas
prioridades declaradas"` (Camada 1, congelada) e `"Apoio nas prioridades
declaradas · contexto V3.2"` (V3.2) — e **três curadorias** de habilitadores, com
regras de ancoragem diferentes, que se contradizem **sem que a tela diga que
existem**: `MAP` por `qid × nível`, engine por `capability × contexto`,
`QS_GAP_SUPPORT` por `qid` sem nível.

O remédio entregue: **retitular pela função** (rota S3, nas duas superfícies) e
**declarar a relação entre as curadorias** (rota T3, na metade alcançável), sem
remover um byte. **Nada foi removido** — é o que `D015-NOSUB1` prova contra âncora
de commit imutável, e `D015-GOV1` prova que o arquivo não autorizado ficou
intocado.

### Os quatro sítios, todos em `ui_v32.js`

| # | Sítio | O que mudou |
|---|---|---|
| 1 | `ui_v32.js:749` — eyebrow de `#v32prio` (tela) | `Apoio nas prioridades declaradas · contexto V3.2` → `Leitura das prioridades declaradas · contexto V3.2`. O sufixo **fica**: é o único desambiguador em relação ao título congelado, e a Camada 1 nunca é impressa |
| 2 | `ui_v32.js:1278` — `<h3>` de `#pr-sup-prio` (papel) | `Apoio nas prioridades declaradas` → `Leitura das prioridades declaradas`, **sem** o sufixo — assimetria **declarada** (`C1(d)`), não acidental |
| 3 | `ui_v32.js:1092` e `:1099` — `[data-pr-gap-fonte]` nos **dois** ramos de `qsGapSupportHTML` | nó novo, irmão de `[data-pr-gap-why]`, com atributo próprio: *"Esta lista parte da **capability** associada ao gap, não do nível respondido na pergunta — por isso pode não coincidir com outras listas deste relatório."* |
| 4 | `ui_v32.js:1122` — 7º `<li>` de `#pr-howto` | item estático com a regra geral: o relatório pode trazer **mais de uma lista** para o mesmo gap, elas partem de catálogos e ancoragens diferentes e **não se somam** como recomendação |

`renderBlocks` ficou **intocada** e **nenhum nó novo entrou na tela** além do
título retitulado — consequência da queda do C4 (errata E1), abaixo.

## Cadeia da demanda — 29 commits, da wave 0 ao aceite

| Fase | Commits | O que entregou |
|---|---|---|
| 0 Refinamento | `22ad24d` `92e3692` | inventário que ninguém tinha feito: 11 superfícies de apoio na tela, 8 no papel, **três** curadorias; as duas leituras literais caem por medição; o PO **refuta a própria proposta da 010** (tirar o sufixo pioraria o que o cliente reclamou) |
| 1 Spec | `723a7c3` `a5ab9d6` | seis critérios, guarda de tautologia por alínea, e a recusa de um **contrabando de boundary** (ler `TARGET_PROFILE` do módulo vedado pelo escopo global) |
| 2+3 Plano e tarefas | `b2ec1c4` `fdcd222` | `ui_target_v32.js` demonstrado **não necessário** em três passos; orçamento do `#pr-howto` medido **menor** que a estimativa; 33 tarefas em 5 waves |
| W0 | `69277bb` `3bc9c8b` `382338b` | ambiente e planning-state; **errata E1 — o C4 cai** |
| 4 Red | `8396a4c` `c0fe75e` `733019d` | **2 PASS · 3 FAIL de 5**, commitado; três divergências medidas e **devolvidas**, não acomodadas |
| Errata E2 | `9c83a07` `5c4d77e` `f084c02` `7265432` `a9088b2` | cláusula sentinela; `M19` nasce; `M14`/`M15` corrigidos; **red reancorado** |
| 5 Implementação | `de30308` `aab5dc7` | os quatro sítios, um diff, um dono; rebuild do gerado |
| 5 Campanha + fecho | `351de95` `9c88ac8` | campanha 13/13, repin inline de `PROTECTED`, contagem fixada por execução |
| 6 Relatório + validação | `573a7d5` `e450582` | 1ª edição deste relatório e o `spec-validate` (34 de 36) — **abriu o gap `M17`/`M18`** |
| 6 Fecho do gap **[2ª ed.]** | `5724fbd` `5ede3fe` | `M17` e `M18` entram no harness; campanha **15/15**; duas afirmações da spec caem por medição |
| 6 Emenda E3 + verbete **[2ª ed.]** | `7a6a572` `f371723` | E3 risca a frase do carrasco concorrente; contagem do §M4 corrigida na raiz; verbete *cláusula sentinela* no `CONTEXT.md` |
| 6 Aceite **[2ª ed.]** | `bf4ecb5` `643a0a6` | "não encontrei objeção"; §29.6 vira registro citável |

A **queda do C4** (errata E1, `3bc9c8b`) é o ponto de produto da wave 0: o critério
declararia o resíduo `C × I` **na tela**, e acrescentaria texto a uma tela que o
próprio cliente chamou de carregada — no item cuja ressalva literal é *"a não ser
que isso torne a tela muito poluída"* —, num host que não é o certo. O texto
original permanece **citável e riscado** na `spec.md`; `M11`–`M13` foram
**aposentados** e os ids **não são reutilizados**.

## Números — o que cada gate emitiu

Execução própria do `doc-writer` em **2026-09-01**, worktree `phase5-015`, HEAD
`9c88ac8`, **árvore limpa antes e depois**, node v24.19.0.

| O que | Resultado | Fonte |
|---|---|---|
| `d015` (`node tests_015_apoio.js`) | **5 PASS · 0 FAIL de 5** | execução própria, 2026-09-01 |
| `p50core` (`node tests_p50_core.js`) | **64 PASS · 0 FAIL de 64** — inclui `P50-GOV1`, `P50-IC4`, `P51-REC1` e `P51-DOC12` | execução própria, 2026-09-01 |
| stage `baseline` (`check_baseline.py`) | **292/292 pins conferem · 0 divergentes · 0 ausentes · 0 sem pin** no HEAD atual (eram 290 antes dos dois artefatos da Fase 6) | execução própria, 2026-09-01 |
| `declared.m41_payload_sha256` | `9794b267…4365b` — **idêntico ao da `develop`**, medido entrada a entrada. **Porta B fechada** | comparação própria `pins.json` × `origin/develop:pins.json` |
| Campanha `d015` **[2ª ed.]** | **15/15 mutantes detectados pelo gate e motivo esperados** · `não-KILL: nenhum` · restauração source e html **byte a byte OK** · exit 0. Era 13/13 na 1ª edição; `M17` e `M18` entraram depois (§"O gap que este relatório abriu") | execução própria de `node tests_015_mutants.js`, 2026-09-01, no HEAD `643a0a6` |
| Campanhas do mesmo passe | `d010` **24/24** (3 em dívida declarada: `D010-M3`/`M4` sem caso nas fixtures, `D010-M11` equivalente por construção) · `d009` **19 KILL de 19** · `core` **3 KILL de 3** — **4 campanhas executadas, zero sobreviventes**. `p50` e `d011` **não exigidas** (nenhum alvo mudou) | execução própria do stage `mutation`, 2026-09-01 |
| stage `suites` | **PASS** (execução própria); a contagem **18 de 18 · 0 problema(s)** — as 17 congeladas no canônico mais a `d015` — é a medição do `qa-engineer` registrada em `351de95` | execução própria + `351de95` |
| `bash .claude/verify/run.sh` (pipeline completo) | **13 PASS · 1 FAIL de 14 stages**. Verdes: `env-doctor`, `baseline`, `boundary`, `marker-lint`, `icons-check`, `build`, `lint-arch`, `state`, `tdd`, `m41`, `suites`, `suites-heavy`, `evidence-bridge`. O **FAIL é o stage `mutation`**, e a **causa foi isolada por execução, não suposta**: `mutation: 4 campanha(s) executada(s) · 2 problema(s)`, os dois sendo `[FAIL] p51` e `[FAIL] p52` — *"campanha EXIGIDA (alvo mudou) mas ambiente sem chromium"*. É a KI-3, declarada, nunca SKIP (R10 §2) | execução própria, 2026-09-01 |

**As duas medidas de orçamento do `C3(b)`, emitidas pelo próprio gate em cada um
dos oito estados** (execução própria de 2026-09-01):

| Métrica | Suíte que a mede | Antes | Depois | Teto |
|---|---|---|---|---|
| **crua** — `textContent.trim().length` | `P51-DOC12` (`tests_p50_core.js:3827-3828`) — **é a que reprova primeiro** | 585 | **752** (Δ 167) | 900 |
| **normalizada** — `replace(/\s+/g," ").trim().length` | gate de PDF (`tests_p50_chromium.js:3570-3571`, `:3597`) | 544 | **705** (Δ 161) | 900 |

### O que o CI fechou **[2ª ed.]** — lido do log, não inferido

O que a 1ª edição declarou como **deferido e sem veredito citável** fechou no run
**`33464353689`** (head `9c88ac8`), job **`visual`** (`99720999212`), **success**
em 2026-09-01T03:34:54Z:

| Deferido | Resultado no CI |
|---|---|
| `p50chromium` — mede `#pr-howto` no **PDF real** | **27 PASS · 0 FAIL de 27** (`P50 CHROMIUM + P51`) |
| `p52chromium` — inclui `P52-SUP3`, cujo payload de evidência carrega o título mudado (restrição R-4) | **55 PASS · 0 FAIL de 55** (`P52 CHROMIUM`) · `D011 CHROMIUM: 1 PASS · 0 FAIL de 1` |
| campanha `p51` (20 mutantes) | **19/20**, e o único não-KILL é a **exceção nominal KI-4** já registrada: `[EXCEÇÃO] KI-4: p51/M51-01 SOBREVIVENTE perdoado · gate P51-VIS1` (achado `EA-7`) — não é achado desta demanda |
| campanha `p52` (107 mutantes) | **107/107**, `não-KILL: nenhum` |
| agregado do stage | **6 campanhas executadas · 0 problemas** (`mutation`) (inclui `d010` 24/24, `d009` 19/19, `core` 3/3 e `d015` 13/13 — 13 porque aquele head é anterior a `M17`/`M18`) |

**O veredito ainda vale para o produto de hoje**, e isso é medido, não suposto:
entre `9c88ac8` e o HEAD `643a0a6` os bytes de produto são **idênticos** —
`git diff 9c88ac8..HEAD -- ui_v32.js quickscan_secops_soccmm_v3_2_dev.html
ui_target_v32.js` sai **vazio**; o que mudou depois foi registro, spec e
documentação.

**O que ainda não fechou**: o run **`33468032409`** (head `643a0a6`, o atual) tem
o job `verify` **success** e o job `visual` **`in_progress`** no momento desta
escrita — é ele que reexecutará a campanha `d015` já com **15** mutantes no CI.

## O número que não reproduz — 667 contra 752

**Este é o parágrafo que justifica o relatório existir.** A mensagem do commit de
implementação (`de30308`) anuncia *"667 crus contra o teto de 900"*. O número foi
medido com script próprio e **não reproduz**. Duas medições independentes do
`qa-engineer` — uma com o **instrumento exato do gate congelado**, outra por
extração do literal no HTML construído — devolvem **752 crus** e **705
normalizados**; a minha execução de 2026-09-01 reproduz os dois valores nos oito
estados, como a tabela acima mostra.

E a aritmética fecha: **585 + 160 + 7 = 752**, onde 585 é a medida "antes", 160 são
os caracteres **visíveis** do 7º item e os **7** são a quebra de linha e o recuo do
`<li>` novo — custo estrutural que a métrica **crua** conta e a **normalizada**
colapsa.

**Nenhum gate reprova**: as duas medidas estão sob 900. O dano seria **só no
registro** — e é exatamente por isso que ninguém perceberia. **A folga real é 148,
não 233**: quem dimensionasse a próxima adição contra 667 gastaria 85 caracteres
que não existem. A mensagem de `de30308` é **imutável** e continuará dizendo 667;
o número correto vive em dois lugares conferíveis — o `_trilha` de `d015` em
`expected_suites.json` (com a conta ao lado) e a saída do próprio
`D015-HOWTO1`, que emite antes **e** depois, por estado.

É a mesma família de erro que a 010 pagou três vezes: **medir com o instrumento
errado, ou com instrumento próprio, em vez do instrumento da suíte**. Aqui foi o
orquestrador quem cometeu, e quem o pegou foi o `qa-engineer` — sem que gate algum
pudesse pegá-lo.

## "Cláusula sentinela" — uma classe nova, e por que não é a da 010

O `qa-engineer` propôs arquivar `D015-TIT1(h2)` — *o `.section-title` de `#v32prio`
nunca recebe `.v32-hidden` em E1–E8* — como **"cláusula defensiva inalcançável por
construção"**, a classe que a 010 registrou. **O `product-owner` recusou a
etiqueta e manteve a decisão**, batizando a alínea de **cláusula sentinela**.

A distinção é **operacional, não cosmética**:

| Classe | Definição | O que diz ao leitor |
|---|---|---|
| **Defensiva inalcançável por construção** (010) | **Nenhuma** mudança pode torná-la falsa; só reconhece uma ausência legítima | **Não reporte** |
| **Sentinela** (nasce aqui) | É **falsificável**; o **gatilho tem nome** | **Reavalie quando o gatilho disparar** |

O gatilho de `(h2)` é nomeado: **mudança do escopo de varredura de
`hideLegacyRecommendation`** — e **já disparou uma vez**, quando a 5.2 moveu o
escopo de `section.screen` para a seção de apoio (`ui_v32.js:171-177`). Hoje o nó
é neto (`#v32panel > #v32support > .section-title`) e a varredura retorna em
`#v32panel` (`:181`), então nada a falsifica; um título dentro de `HIDE_EYEBROWS`
é **bomba armada** para a próxima vez que alguém mexer no escopo. Quem desarma a
bomba hoje é `(h1)`, no fonte, e `M18` é o **único** carrasco dela.

As duas classes convivem **na mesma demanda e na mesma matriz**, como dívidas
**distintas**: `D015-TIT1(h2)` sentinela, `D015-GOV1(d)` defensiva. Antes desta
demanda estavam confundidas numa só. *Arquivar sentinela como classe-da-010 mata a
alínea de abandono.*

O verbete candidato ficou escrito na `spec.md` §E2.1 e, na 1ª edição deste
relatório, **ainda não estava gravado** — glossário é do `product-owner` e o portão
da Fase 0 estava fechado. **[2ª ed.] Foi gravado** no `CONTEXT.md` (`7a6a572`),
com o **desvio de fase declarado no cabeçalho do arquivo** — nunca dentro do
verbete, para não quebrar a regra "só glossário" (R12). A razão do desvio está
escrita: o termo já estava em uso em três artefatos e no registro de mutantes, e
deixá-lo indefinido custava mais que o desvio.

## A unicidade de título não tinha cobertura congelada — **nas duas** superfícies

`C1(g)` nasceu como suposta **redundância com o acervo**: `N40`
(`tests_journey_m45.js:220-225`) exige título único entre `#app .eyebrow, #app h3`,
e `N41` repetiria a propriedade no print. **Medido pelo `qa-engineer`: não
repete.** `N41` tem escopo `#pr-journey` — irmão de `#pr-support`, com **zero**
`<h3>` dentro —, e `N40` varre `#app`, enquanto o relatório impresso é filho de
`body` (`ui_v32.js:786-789`). **Nenhum gate congelado alcança o `<h3>` novo.**

Consequência registrada e agida na errata E2: a metade-papel de `(g)` deixou de
ser redundância e virou **obrigação nova**, com carrasco próprio — **`M19`**.

**[2ª ed.] A errata E3 (2026-09-01) foi mais longe, e na direção que reforça a
conclusão.** A E2 dizia que a metade-**tela** era **prova fraca** porque *"`N40`
também mataria `M17`"*. **Falso, medido**: o cenário de `N40`
(`tests_journey_m45.js:220-224`) é `boot()` + `answerAll` + `showResults()` **sem
salvar landscape** — `isLegacyModeV32()` é verdadeiro, `renderBlocks` toma o ramo
legado e **`#v32prio` não nasce**. `N40` não enxerga aquele eyebrow em forma
alguma; sob as duas formas do mutante, `journey` fechou **31/0**. E `p52layout`
também não o vê: varre **filhos diretos**, e o nó é **neto**.

Três consequências, todas registradas na spec:

1. **As duas metades de `C1(g)` são obrigação exclusiva deste gate**, sem cobertura
   congelada. `M19` nasceu de uma descoberta pela metade: as duas estavam
   descobertas.
2. **A qualificação "prova fraca" sai** — ela nascia de um carrasco concorrente
   que não existe. `M17` é o carrasco da metade-tela **pela razão certa: nada
   mais alcança aquele nó**.
3. **A simetria de DOM que ninguém tinha visto**: o gate de layout não vê o nó
   porque ele é **neto** — a mesma inalcançabilidade estrutural que sustenta a
   cláusula sentinela `C1(h2)`. Duas alíneas desta spec, **uma que assere e outra
   que se abstém, apoiam-se no mesmo fato do DOM**.

Detalhe de forma que o `qa-engineer` registrou e importa: `M19` **duplica** o
título no papel, não o renomeia — renomear encurtaria `#pr-support` em 14
caracteres e derrubaria `D015-NOSUB1(d)` junto, o que seria **kill incidental num
gate alheio**, não prova de `(g)`.

## O gap que este relatório abriu — e como ele fechou **[2ª ed.]**

A 1ª edição achou, no `spec-validate`, que **`M17` e `M18` não existiam**: a
`spec.md` os declarava carrascos — `M18` o **único** de `C1(h1)` — e nenhum dos
dois estava no harness, na matriz ou em `dividas_declaradas`. **A entrada de
dívida da cláusula sentinela chegava a afirmar que `M18` era o único carrasco de
`(h1)`: registro alegando prova que a campanha nunca executou.**

**Fechou assim**, e cada peça tem razão escrita:

- **`M18` entrou no harness e fechou KILL.** Mutação de fonte trivial — o eyebrow
  novo entra em `HIDE_EYEBROWS` (`ui_v32.js:109-110`) — e **isolada**: só `(h1)`
  dispara; `p52layout` 45/0, `journey` 31/0 e `ui31` 19/0 seguem verdes sob a
  mutação. Com ele, **a cláusula sentinela `(h2)` volta a ter pé**: a partição da
  errata E2 dependia de a outra metade ter carrasco.
- **`M17` entrou também, e a razão é de CATEGORIA** — vale mais que o caso:
  *`dividas_declaradas` é para mutante que **não pode** rodar* — equivalente por
  construção, sem caso na fixture, sem ambiente. **Este tinha caso e rodava em
  segundos.** Declará-lo dívida seria **usar a gaveta errada para esconder
  trabalho barato**. A fraqueza, quando existe, é propriedade **do par** e vai na
  nota do par, onde quem lê o par a vê.
- **A campanha passou de 13 para 15 mutantes locais** (16 pares na matriz, com o
  `M16` manual) e fechou **15 DETECTADOS de 15**, zero sobreviventes, zero não
  executados — reproduzido por mim no HEAD atual.

### Duas coisas que a medição corrigiu na spec

1. **A forma literal do `M17` não isolava.** Trocar o texto do eyebrow pelo de
   outro título **leva junto o sufixo ratificado**, e o gate reprova primeiro por
   `(b)`. **Detecção incidental não é kill**: o par morreria pela razão errada e
   `(g)` continuaria sem prova. A forma adotada ataca a mesma propriedade
   **emitindo o `section-title` duas vezes** — o literal fica intacto, `(b)`
   permanece satisfeita, e dispara **só** a alínea certa.
2. **A E2 afirmava um carrasco concorrente que não existe** (acima). A frase fica
   **riscada com a razão**, não apagada (R2 §5), e a conclusão da E2.4 **não cai:
   fica mais forte**.

E o `product-owner` nomeou o padrão dos **três** erros dele nesta demanda —
`M15`, `M18` e agora `M17`: **atribuir a cadeia mutante→gate por leitura de
NOME, em vez de leitura de CENÁRIO.** A formulação que faltava, e que ele
registrou: **cobertura é escopo ∩ estado** — deduzir cobertura pelo escopo do
seletor e esquecer a fixture é como três afirmações falsas entraram em spec.

### A lição de processo, porque é nova na jornada

**Prova que vive só na bateria efêmera evapora.** `M17` e `M18` **tinham sido
provados**: a bateria negativa da Fase 4 registrou 15/15 incluindo os dois. Esse
registro morava num `_trilha` de `expected_suites.json` que foi **substituído**
em `351de95` pelo `_trilha` da contagem fixada — e passou a viver apenas no
histórico do git, sem par na matriz e **sem trigger de path que o re-executasse**.

As oito ocorrências anteriores da família "gate verde que não pode reprovar" eram
**ausência de prova**. Esta é diferente e é o motivo de ela ficar escrita: foi
**prova que existiu e saiu do registro** — a versão em registro vivo do
"prova manual apodrece" (errata E16 da 010). O critério prático que sobra:
**prova que não tem par na matriz e não tem trigger que a re-execute não é prova
— é lembrança.**

## Dois mutantes que quebravam invisíveis

**`M14` — o mutante que matava tudo, e por isso não provava nada.** Colapsar em
aviso o card de prioridade sem payload (rota S4, recusada) **nascia
SOBREVIVENTE**: nenhum dos sete estados originais tinha capability de prioridade
com `presentationOf === null`. O `qa-engineer` varreu **120 combinações**, achou o
caso e o acrescentou à fixture como estado **E8** — a borda C5 que o refinamento
levantou e a `spec.md` não levou à tabela; a falta foi assumida pelo PO. Mas o E8
precisou de um **sobrevivente** (`automation`): com a capability neutra sozinha, o
mutante esvazia `#v32prio` inteiro, o **assert da fixture reprova antes dos
gates** e os **cinco** caem juntos — **detecção incidental, não kill**. Um mutante
que mata tudo não prova nada.

E o `qa-engineer` **não declarou o conjunto no assert** da fixture, porque
declará-lo **preemptaria** a alínea `(a)`. O PO endossou e registrou como
precedente da demanda: *fixture declara estado; gate declara expectativa. Quem
escreve os dois no mesmo lugar não tem oráculo, tem eco.*

**`M15` — o mutante que matava a alínea errada, por efeito colateral de
comprimento.** A `spec.md` afirmava, **sem medição**, que a forma estreita (um
único qid) mataria `(b)` e `(d)`. Medido: numa entrega **aditiva** o nó novo
compensa o texto suprimido e `(d)` **não dispara**. A errata E2 adotou a **forma
ampla** — os quatro qids, queda medida de **1.139 caracteres** em `#pr-findings`
no estado E2 (`mutation-matrix.json`, par `D015-M15`; a spec, escrita antes da
medição fina, diz "~1.100") — e
`(b)` e `(d)` morrem juntas. Na forma estreita, `(d)` ficaria **sem carrasco**.

## O red foi reancorado — e a razão é auditabilidade, não capricho

O red original (`8396a4c`, **2 PASS · 3 FAIL de 5**) deixou de corresponder aos
arquivos em disco: a suíte e a fixture foram emendadas depois dele pela errata E2
(E8 novo, `M19` armado, `M14`/`M15` corrigidos, as duas classes separadas). O
**veredito é idêntico** — 2 PASS · 3 FAIL de 5, nenhum se moveu —, mas o
**artefato não**. O red foi reprovado sobre os arquivos emendados e `red.commit`
passou a apontar `f084c02` (`7265432`).

*`red.commit` que cita um red diferente do que roda é red inauditável* (E3, R3 §4).
O achado foi levantado **pelo próprio `qa-engineer`**, sobre o próprio trabalho.

## A queda de autenticação no meio da implementação

A delegação da wave de implementação **caiu por expiração de autenticação** depois
de o agente escrever o diff e **antes** de ele reportar. Em vez de assumir
integridade, o orquestrador **inspecionou os quatro sítios um a um** e **refez as
medições**. O precedente que justifica o rigor é da 009: campanha abandonada no
meio deixou **mutante aplicado** na árvore.

## Desvio de dono do repin inline — registrado, não absorvido

O `tasks.md` (T013) atribui o **repin inline de `PROTECTED`** ao `build-engineer`,
com a razão nomeada: **quem escreve o hash não pode ser quem valida o gate que o
consome** (R3 §2). Foi executado pelo **`qa-engineer`**, sob **exceção nominal do
orquestrador** — tarefa mecânica, mesmo precedente da 010 (T023).

**Mitigação que o próprio executor apontou e exerceu**, e que é conferível:

- as **15 entradas** de `PROTECTED` foram medidas **uma a uma contra o disco antes
  de repinar** — e **só `ui_v32.js` divergiu**. As outras 14, inclusive
  `ui_target_v32.js`, `ui_v32.css` e `engine_v32.js`, saíram byte-idênticas e
  **não foram tocadas**: repinar por simetria seria repin sem motivo;
- as **três fontes de identidade concordam** no valor novo — disco normalizado LF,
  `pins.json → files/ui_v32.js` e `git show HEAD:ui_v32.js`;
- comentário-trilha no padrão da R8 §2 (`tests_p50_core.js:192`), abrindo com a
  declaração de que é **asserção de pin, não de comportamento**, com motivo, data,
  citação da autorização §29.4 e **"Identidade anterior:
  `d594dafe…9bb85`"**. Identidade nova: `9d31fef9…72b6`;
- **nenhuma asserção foi tocada**, nenhum gate nasceu ou morreu, `frozenSuites`
  segue intacto — e `P50-IC4` **reexecuta** a suíte ICONS 4.6, que fechou verde na
  mesma bateria: a prova de que a queda era de hash e não de comportamento.

## Série de repins — o previsto, o executado, e a numeração que deslizou

O `tasks.md` previu **R2…R12** com significado fixo por tarefa. O executado tem
**treze** repins (`R0`…`R12`) e **os rótulos deixaram de significar o que o
`tasks.md` diz** — o `R12` executado é o *aceite*, não o relatório final que o
`tasks.md` lhe atribui. Registro o mapa real, porque desvio se registra e nunca se
silencia (a 008 pagou três execuções não previstas):

| Rótulo executado | Commit | O que cobriu | Correspondência com o `tasks.md` |
|---|---|---|---|
| `R0` | `92e3692` | refinamento | fora da série prevista (anterior a ela) |
| `R1` | `a5ab9d6` | spec | fora da série prevista (anterior a ela) |
| `R2` | `fdcd222` | plano + tarefas | **= R2 previsto** (T001) |
| `R3` | `382338b` | errata E1 (queda do C4) | **= R3 previsto** (T005) |
| `R4` | `733019d` | red (suíte, fixture, `expected_suites`) | **= R4 previsto** (T010) |
| `R5` | `5c4d77e` | **errata E2** | **fora da série prevista** — a E2 nasceu depois do `tasks.md` |
| `R6` | `a9088b2` | `M19` e as duas classes (suíte, fixture, matriz) | **fora da série prevista** — mesma origem |
| `R7` | `aab5dc7` | implementação **+** rebuild | funde os previstos **R5** (T012) e **R7** (T016) |
| `R8` | `9c88ac8` | campanha + `mutation_map` + repin inline + matriz + contagem fixada | funde os previstos **R6**, **R8**, **R9** e **R10** |
| `R9` | `e450582` | 1ª edição do relatório final + `spec-validate` | = o previsto **R12** (T032), com rótulo diferente |
| `R10` **[2ª ed.]** | `5ede3fe` | `M17`, `M18` e as datas de `ultima_prova` | **fora da série prevista** — nasce do gap achado na Fase 6 |
| `R11` **[2ª ed.]** | `f371723` | emenda E3, contagem do §M4, verbete do `CONTEXT.md` | **fora da série prevista** — o `R11` previsto era o condicional do CI |
| `R12` **[2ª ed.]** | `643a0a6` | aceite + registro da §29.6 | **fora da série prevista** |

**Saldo:** **cinco** repins nasceram **fora da série prevista** — dois filhos da
errata E2, três filhos da Fase 6 (o gap, a emenda E3 e o aceite) — e seis
previstos foram **fundidos em dois commits**. Nenhum arquivo pinado ficou sem
repin: o stage `baseline` fecha **292/292 · 0 divergentes · 0 sem pin** no HEAD
atual, medido por mim. **Fica pendente um repin a mais**, criado por esta 2ª
edição — o `tasks.md` não tem rótulo para ele, e é do `build-engineer` decidir se
o chama `R13` ou fecha a série de outro modo.

**A lição que a série deixa, e que é a mesma do 667:** rótulo de repin é **prosa
sobre um dado**. Enquanto o significado de cada `RN` viver só no `tasks.md`, toda
errata o desalinha em silêncio; o que é conferível é o **par (commit, arquivos
pinados)**, e é por isso que este mapa existe.

## O aceite — "não encontrei objeção", e a medição que o sustenta **[2ª ed.]**

O `product-owner` declarou **"não encontrei objeção"** em 2026-09-01 (`bf4ecb5`),
depois de ler as três frases **no fonte** antes de julgar. A forma importa e é a
do rito: agente **reprova** ou **declara não ter encontrado objeção** — quem
escreve em registro de aceitação é o auditor humano (R4/D3).

**A medição que ninguém tinha feito, e que é o ponto mais forte da entrega: na
tela, texto novo é ZERO.** O título trocou de palavras — e nada mais foi
acrescentado, porque as outras duas frases vivem em funções que só existem no
papel. **Todo o texto novo foi para a superfície onde o defeito está**, e a
superfície de que o cliente reclamou não recebeu nada. **Isso só ficou disponível
porque o C4 caiu**: a errata E1 é o que comprou esse resultado.

**Sobre o título:** os dois agora diferem **no verbo**, que é o eixo da queixa. O
cliente não disse "dois blocos sobre prioridades" — disse *"parece redundante"*,
isto é, *li um e depois o outro e recebi a mesma coisa*. Agora o primeiro diz o
que **apresenta** e o segundo o que **oferece**.

**E o que o título não conserta, dito com honestidade** (palavras do PO, não
minhas): no estado do próprio cliente, o bloco continua entregando pouco para as
capabilities sem payload. A demanda converteu uma **promessa falsa** numa
**afirmação modesta e verdadeira**; não engordou o conteúdo — e **não podia**,
porque o conteúdo é pinado por quatro gates e protegido pela propriedade de que
*prioridade declarada nunca desaparece*.

### Três resíduos declarados no aceite — nenhum bloqueante

1. **A declaração é incondicional, e a divergência que ela explica é
   condicional.** É **consequência declarada da autorização estreita**:
   condicioná-la exigiria ler o estado do arquivo vedado — o contrabando de
   boundary que a spec recusou desde a Fase 1.
2. **"nível respondido" é vocabulário nosso, não do leitor.**
3. **A frase local avisa que as listas divergem, sem avisar que não se somam** —
   quem lê só o card não recebe a regra geral, que está na caixa "Como
   interpretar". O PO **recusou reprovar por isso, com a razão certa**: a spec
   atribuiu a regra geral à caixa e a ancoragem ao card, a entrega cumpriu o
   especificado, e mudar isso no portão seria ele **reescrever a spec no aceite**.

### Duas perguntas formuladas para o rito visual — não "está bom?"

1. Sobre o **nó de ancoragem no PDF real**: se ele lê como explicação ou como
   ruído no meio do bloco de gap.
2. **Devolvendo o item 6a ao autor da queixa**: *"ainda parecem a mesma coisa, ou
   já parecem dois blocos com funções distintas?"* — quem abriu o item é quem
   pode dizer se ele fechou.

## A deriva de número — corrigida na raiz, não na prosa **[2ª ed.]**

A 1ª edição achou três números incompatíveis para o custo da remoção do 6a: o
título do `refinement.md` §M4 dizia *"seis gates em três suítes"*, o `brief` do
planning-state dizia *"sete gates em quatro suítes"* e a tabela tinha sete linhas.

**Medido e corrigido: são oito ids de gate em quatro suítes.** O `brief` acertava
as suítes e errava os gates porque **contava linhas** — e uma linha carregava
dois ids (`P5`, `P7`) na mesma célula.

**O conserto não foi trocar o número: a tabela foi partida em um id por linha**,
para que a contagem seja **derivável do artefato**. Foi reafirmar o número em
prosa que o fez driftar — a mesma doutrina do CLAUDE.md ("dado que apodrece não
mora em prosa") aplicada a um artefato de refinamento.

**Duas ressalvas que o número sozinho esconde**, e que o PO registrou junto: o
item 7 é **uma alínea** (`D010-ABS1(f)`), não um gate inteiro; e o item 8
(`P52-SUP3`) é **Chromium** — logo, das quatro suítes, **uma não roda no agregado
local**.

## Dois registros que saíram da memória de conversa **[2ª ed.]**

- **§29.6 · print/render.** A pergunta atravessou quatro fases em DEPENDÊNCIAS: a
  autorização nominal **por arquivo** cobre o caminho de impressão dentro dele? A
  resposta do proprietário existia desde **2026-08-31** — *sim, cobre* —, mas
  vivia em mensagem de commit e prompt de delegação, **nunca chegou ao
  `product-owner`**, que a citou como pendente em quatro relatórios seguidos. A
  citação estava correta *de onde ele olhava*: a falha foi de **propagação**, não
  de rito. Agora é registro citável na `spec.md` §29.6, com data, forma e
  **alcance** (vale para `ui_v32.js` nesta demanda; não amplia a §29.6 para
  nenhum outro arquivo ou demanda).
- **Verbete *cláusula sentinela* gravado no `CONTEXT.md`.** Com a distinção no
  corpo (falsificável · gatilho nomeado · "reavalie quando o gatilho disparar",
  contra a classe da 010, que é para o que **nenhuma** mudança pode tornar falso e
  dispõe "não reporte"). O **desvio de fase** — verbete gravado na Fase 4, fora da
  Fase 0 — está declarado **no cabeçalho do arquivo, não dentro do verbete**, para
  não quebrar a regra "só glossário" (R12).

## O que fica aberto — declarado, não maquiado

1. **[2ª ed. · em grande parte FECHADO] `p51`/`p52` e as suítes Chromium.** O que
   a 1ª edição declarou sem veredito **fechou no run `33464353689`**, com os
   números lidos do log e transcritos em §"O que o CI fechou" — `p50chromium`
   27/0, `p52chromium` 55/0, `p51` 19/20 (o não-KILL é a exceção nominal **KI-4**,
   achado `EA-7`, alheio a esta demanda), `p52` 107/107, agregado
   `6 campanhas · 0 problemas`. **Continua aberto** só o run **`33468032409`**
   (head atual), cujo job `visual` estava **`in_progress`** nesta escrita e que
   reexecutará a `d015` já com **15** mutantes. Localmente, `p51`/`p52` seguem
   saindo `[FAIL] … ambiente sem chromium` — **KI-3, agendamento por desenho**,
   declarado e nunca SKIP. O registro do retorno é a T029, do `qa-engineer`.
2. **`D015-TIT1(h2)` — alínea sentinela, sem mutante.** Falsificável, gatilho
   nomeado, **reavaliar quando o gatilho disparar**. Não é "não reporte".
3. **`D015-NOSUB1(d)` é rede, não guarda.** Em entrega aditiva **não detecta
   subtração menor que a própria adição** — o espelho da E18 da 010, onde a
   contagem de caracteres *revelou* uma subtração de 31%; aqui ela pode
   *mascarar* uma. As guardas de não-subtração são `(a)`, `(b)` e `(c)`, que
   comparam **conjuntos**. **`(d)` não pode ser citada como prova de que nada
   sumiu.**
4. **O que a `spec.md` declarou não mensurável por gate** — os três são **leitura
   humana**, e a spec já dispôs que a fase **não fecha só com gate verde**: (a) se
   a **redação** escolhida para o título é boa — o gate impede o título falso, não
   produz o título bom; (b) o nó de ancoragem no **PDF real**; (c) se tela e papel
   ficaram **poluídos** — a ressalva que o próprio cliente escreveu, e que já
   derrubou o C4 uma vez. **[2ª ed.]** O aceite do PO cobriu **(a)** por leitura do
   fonte e **(c)** por medição (*texto novo na tela é zero*); **(b) permanece
   aberto** e virou uma das **duas perguntas formuladas para o rito visual** do
   proprietário — junto com a devolução do item 6a ao autor da queixa (§"O
   aceite"). Perguntas, não "está bom?".
5. **[2ª ed. · FECHADO] `M17` e `M18` na campanha.** Era o gap **G2** do
   `spec-validate`. Fechado em `5724fbd`: os dois entraram no harness, a campanha
   foi de 13 para **15/15**, a matriz passou a ter **16 pares** e a dívida da
   cláusula sentinela — que **afirmava** um carrasco nunca executado — foi
   corrigida na própria entrada. Fica a lição de processo em §"O gap que este
   relatório abriu". **Nenhum resíduo**, exceto o registro de G1 abaixo.
6. **O planning-state ainda registra `phase: "red"`** — conferido no arquivo hoje,
   depois do aceite: sem `implement`, sem `validate.conformance`, sem `pr_url`.
   Implementação, rebuild, campanha 15/15, `spec-validate` e **aceite** estão
   todos commitados, e o estado canônico da demanda continua dizendo *red*. O
   stage `state` passa (as seções são opcionais no schema), mas o `state-eval` lê
   a demanda como se ela estivesse na Fase 4. **É o único registro da demanda que
   está atrasado em relação ao que aconteceu.** Dono: `qa-engineer` (T029) /
   orquestrador.
7. **[2ª ed. · ainda ABERTO, e mais distante] O `tasks.md` não foi emendado.**
   Conferido: o arquivo não é tocado desde `b2ec1c4` (Fase 3). Ele registra
   T018 **12 mutantes** (são **15**), T023 **13 pares** (são **16**), a §"Matriz
   gate↔mutante prevista" **não conhece `M17`, `M18` nem `M19`**, e a série de
   repins **R2–R12** não corresponde à executada **R0–R12** (mapa acima). A
   `spec.md` está correta — quem envelheceu foi o `tasks.md`. É o gap **G1** do
   `spec-validate`, e **exige decisão do usuário**: emendar artefato aprovado é
   aprovação do usuário (R4). Recomendação inalterada: **errata mínima**, sem
   renumerar tarefas, apontando E1/E2/E3 e anexando o mapa real de repins.

## Achados — ids `EA-*` que eu **proponho**, sem alocar

Alocação de id é minha por regra, mas escrever em `.claude/BACKLOG.md` está
**fora do escopo desta demanda** (`spec.md` §Fora de escopo 10; `tasks.md` T031).
**Conferido antes de propor, e reconferido na 2ª edição**: a série vai até
**`EA-20`** na `develop`, o `.claude/BACKLOG.md` não é tocado desde `18284fd`, e a
**única** branch remota não mesclada é a desta demanda, que também para em
`EA-20`. Logo, o próximo id livre é **`EA-21`** — e a proposta abaixo só vale se
nenhuma outra demanda alocar antes.

| Id proposto | Achado | Cadeia |
|---|---|---|
| `EA-21` | **Duas curadorias divergentes para o mesmo gap, no mesmo PDF.** Em 3 das 7 combinações `qid × nível` alcançáveis, **nenhuma lista contém a outra** | `ui_v32.js:1034-1066` (`QS_GAP_SUPPORT`, por capability, sem nível) × `quickscan_secops_soccmm_v3_1_3.html:420-467` (`MAP`, por qid × nível) → `refinement.md` §M5 |
| `EA-22` | **`P51-REC1` leva "sem duplicação" no nome e no cabeçalho normativo e não compara `pr-gapsup` com nenhuma outra superfície** | `ui_v32.js:1029-1030` × `tests_p50_core.js:3336`, `:3362-3411` — **pendente de confirmação por execução** (`qa-engineer`, item 4 de §"O que ficou por medir") |
| `EA-23` | **Mesma capability sob dois nomes no mesmo relatório** | `quickscan_secops_soccmm_v3_1_3.html:448` × `engine_v32.js:49` — fechar exigiria superfície congelada, por isso é achado e não demanda |
| `EA-24` | **`neutralPrioCardHTML` diz "Não há oferta direta mapeada" quando a causa é ausência de gap** | `ui_v32.js:645-655`, `:727` — **pendente de confirmação por execução** (`qa-engineer`) |
| `EA-25` | **"Prioridade declarada nunca desaparece" é invariante de fato sem âncora normativa escrita** — vive só em gates (`V10`/`V15`/`V21`/`V22`/`P5`/`P7`/`D010-ABS1`) e em comentário de código | `ui_v32.js:722`, `:738`; `spec.md` §Cross-check — redação de invariante é do `product-owner` |
| `EA-26` | **Resíduo `C × I` na tela** — card-alvo e `apoio-block` lendo o mesmo `MAP` em duas seções, sem texto que explique. Declarado pela 010, **não fechado** por ela nem por esta demanda; host certo bloqueado (`ui_target_v32.js` não autorizado, Camada 1 `frozen`) | `spec.md` §E1 e §Referenciado, não absorvido |
| `EA-27` | **`HIDE_EYEBROWS` existe em três cópias sem dono único.** Efeito **medido, não hipotético**: mutar o array do produto **não alcança `U15`**, porque o oráculo lê a própria cópia — foi o que fez `M18` parecer ter dois carrascos e ter um só | produto `ui_v32.js:109-110` · oráculo `tests_ui_m31.js:279-280` · fixture da 010 `fixtures_010_vao.js:675-676` |

**Dois achados desta demanda NÃO ganham id novo — são instâncias de achados que já
têm um:**

- **`EA-18`** (*gate que lê a árvore e gate que lê HEAD medem objetos
  diferentes*) foi **reconfirmado por execução** aqui: dentro da worktree efêmera
  do `M16`, com `ui_target_v32.js` mutado **em disco**, o stage `baseline` fechou
  **289/289**, porque compara pins contra os **blobs de HEAD**. Quem pegou a
  edição foram `P50-GOV1` (que hasheia o arquivo) e `D015-GOV1` (que lê o
  **produto**). Registrado no par `D015-M16` da matriz.
- **`EA-20`** (*o padrão que três demandas seguidas instanciaram: gate sem poder
  discriminante*) ganhou **duas** instâncias — e **[2ª ed.]** a segunda é de uma
  espécie que o achado ainda não descrevia: (i) a metade-**papel** de `C1(g)`,
  encontrada antes de virar dívida e resolvida com `M19`; (ii) `C1(h1)` e a
  metade-**tela** de `C1(g)`, que passaram por **verdes com carrasco declarado na
  spec e ausente da campanha** — *prova que existiu e saiu do registro*, não
  ausência de prova. Se o `EA-20` for reescrito algum dia, esta segunda espécie
  merece uma linha própria: **o gate não fica sem poder por falta de mutante, fica
  sem poder por falta de mutante *executável e re-executado***.

## Dependências deixadas para outros

| Para | O quê |
|---|---|
| `qa-engineer` | **[2ª ed. · achado novo, conferido no arquivo hoje] A nota do par `D015-M19` ainda carrega a frase que a errata E3 refutou** — *"a metade de TELA, atacada por M17, é PROVA FRACA … N40 mataria M17 também"* —, e ela contradiz, **no mesmo arquivo**, a nota do par `D015-M17` e a spec. Refutação registrada tem de ficar **riscada com a razão** (R2 §5), e aqui ela está viva num registro consultável. A matriz é dele; eu registro, não corrijo. Também: registrar na matriz e no planning-state o retorno do run `33468032409` quando o `visual` fechar (T029). Menor, nomeado: os pares `d010` seguem com `ultima_prova` 2026-08-31 embora a campanha tenha sido re-executada em 2026-09-01 (local e no CI) — `core`/`d009` já foram atualizados. Confirmar por execução os candidatos `EA-22` e `EA-24` |
| `build-engineer` | **Um repin a mais**, criado por esta 2ª edição do relatório — o `tasks.md` não tem rótulo para ele (§"Série de repins"). O título mudado entra no **payload de evidência pinado** de `P52-SUP3` (restrição R-4): com `p52chromium` fechando **55/0** no CI, decidir se há promoção de evidência (R11 §2) e/ou repin de artefato **no mesmo PR** |
| `product-owner` | **[2ª ed.] Nada pendente do aceite** — ele saiu com "não encontrei objeção", e os três resíduos estão declarados como não bloqueantes. Fica com ele a redação de invariante do candidato `EA-25`, se o achado for aberto |
| orquestrador | **Gap G1 do `spec-validate`** — o `tasks.md` anterior às erratas — que **exige decisão do usuário** (emendar artefato aprovado, R4). E a alocação dos ids `EA-21`…`EA-27` propostos acima. **G2 está fechado** |
| usuário (proprietário) | **Rito visual**: as duas perguntas de §"O aceite" — o nó de ancoragem no PDF real, e se os dois blocos ainda parecem a mesma coisa. Merge do PR #34. **A §29.6 deixou de ser pendência**: a resposta de 2026-08-31 virou registro citável na `spec.md`, com data, forma e alcance |

## Fontes citadas

- `specs/015-superficies-de-apoio/refinement.md` — §M3 (três dos quatro estados
  únicos), §M4 (gates congelados), §M5 (3 de 7 combinações), §P13, §P14
- `specs/015-superficies-de-apoio/spec.md` — erratas **E1, E2 e E3**, §29.4 e
  **§29.6**, critérios C1–C6, guarda de tautologia, restrições R-1…R-4, §"O que
  NÃO é mensurável por gate"
- `specs/015-superficies-de-apoio/plan.md` · `tasks.md` — waves, série de repins,
  donos por tarefa
- `.claude/verify/expected_suites.json` → `d015` (`_trilha` com as medidas antes e
  depois, e a divergência do 667)
- `.claude/verify/mutation-matrix.json` — **16 pares** `D015-*` (15 do harness +
  `M16` manual) e as três dívidas declaradas (sentinela · defensiva · rede)
- `CONTEXT.md` — verbete **cláusula sentinela**, com o desvio de fase no cabeçalho
- `.claude/verify/mutation_map.json` → harness `d015` (`preflight: true`, alvos)
- `.claude/verify/pins.json` — `declared.m41_payload_sha256` e
  `files/ui_v32.js`
- `tests_p50_core.js:192` — repin inline de `PROTECTED`, com trilha R8 §2
- `tests_015_apoio.js` · `tests_015_mutants.js` · `fixtures_015_apoio.js`
- Commits: `22ad24d` `723a7c3` `b2ec1c4` `3bc9c8b` `8396a4c` `9c83a07` `f084c02`
  `7265432` `de30308` `351de95` `9c88ac8` · **[2ª ed.]** `573a7d5` `5724fbd`
  `7a6a572` `bf4ecb5` `643a0a6`
- PR [#34](https://github.com/oflavioc/quickscan-secops/pull/34) · runs
  [`33464353689`](https://github.com/oflavioc/quickscan-secops/actions/runs/33464353689)
  (head `9c88ac8`, `verify` e `visual` **success**) e
  [`33468032409`](https://github.com/oflavioc/quickscan-secops/actions/runs/33468032409)
  (head `643a0a6`, `verify` **success**, `visual` em curso)
