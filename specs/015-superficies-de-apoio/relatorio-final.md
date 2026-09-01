# Relatório final — 015-superficies-de-apoio

> Fase 6 · T031 · dono: `doc-writer` · 2026-09-01.
> Branch `feature/015-superficies-de-apoio` · HEAD `9c88ac8` · PR
> [#34](https://github.com/oflavioc/quickscan-secops/pull/34) · worktree
> `phase5-015`.
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
| 6a · "remover o bloco de apoio das prioridades, que repete a 7ª seção" | **Três dos quatro estados de `#v32prio` são únicos no relatório** (`refinement.md` §M3): só o card sem payload é redundante, e é exatamente a classe que a errata E18 da 010 já colapsou em `#v32base` e que **não pode** ser colapsada aqui. Remover custaria, além disso, gates congelados nomeados em quatro suítes (`refinement.md` §M4) e a propriedade *prioridade declarada nunca desaparece* |
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

## Cadeia da demanda — 21 commits, waves 0 a 4

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
| stage `baseline` (`check_baseline.py`) | **290/290 pins conferem · 0 divergentes · 0 ausentes · 0 sem pin** | execução própria, 2026-09-01 |
| `declared.m41_payload_sha256` | `9794b267…4365b` — **idêntico ao da `develop`**, medido entrada a entrada. **Porta B fechada** | comparação própria `pins.json` × `origin/develop:pins.json` |
| Campanha `d015` | **13/13 mutantes detectados pelo gate e motivo esperados** · `não-KILL: nenhum` · restauração source e html **byte a byte OK** | execução própria do stage `mutation`, 2026-09-01 |
| Campanhas do mesmo passe | `d010` **24/24** (3 em dívida declarada: `D010-M3`/`M4` sem caso nas fixtures, `D010-M11` equivalente por construção) · `d009` **19 KILL de 19** · `core` **3 KILL de 3** — **4 campanhas executadas, zero sobreviventes**. `p50` e `d011` **não exigidas** (nenhum alvo mudou) | execução própria do stage `mutation`, 2026-09-01 |
| stage `suites` | **PASS** (execução própria); a contagem **18 de 18 · 0 problema(s)** — as 17 congeladas no canônico mais a `d015` — é a medição do `qa-engineer` registrada em `351de95` | execução própria + `351de95` |
| `bash .claude/verify/run.sh` (pipeline completo) | **13 PASS · 1 FAIL de 14 stages**. Verdes: `env-doctor`, `baseline`, `boundary`, `marker-lint`, `icons-check`, `build`, `lint-arch`, `state`, `tdd`, `m41`, `suites`, `suites-heavy`, `evidence-bridge`. O **FAIL é o stage `mutation`**, e a **causa foi isolada por execução, não suposta**: `mutation: 4 campanha(s) executada(s) · 2 problema(s)`, os dois sendo `[FAIL] p51` e `[FAIL] p52` — *"campanha EXIGIDA (alvo mudou) mas ambiente sem chromium"*. É a KI-3, declarada, nunca SKIP (R10 §2) | execução própria, 2026-09-01 |

**As duas medidas de orçamento do `C3(b)`, emitidas pelo próprio gate em cada um
dos oito estados** (execução própria de 2026-09-01):

| Métrica | Suíte que a mede | Antes | Depois | Teto |
|---|---|---|---|---|
| **crua** — `textContent.trim().length` | `P51-DOC12` (`tests_p50_core.js:3827-3828`) — **é a que reprova primeiro** | 585 | **752** (Δ 167) | 900 |
| **normalizada** — `replace(/\s+/g," ").trim().length` | gate de PDF (`tests_p50_chromium.js:3570-3571`, `:3597`) | 544 | **705** (Δ 161) | 900 |

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

O verbete candidato para o `CONTEXT.md` está escrito na `spec.md` §E2.1 e **não
foi gravado**: glossário é do `product-owner`, e o portão da Fase 0 estava fechado.

## A unicidade de título no papel não tinha cobertura congelada

`C1(g)` nasceu como suposta **redundância com o acervo**: `N40`
(`tests_journey_m45.js:220-225`) exige título único entre `#app .eyebrow, #app h3`,
e `N41` repetiria a propriedade no print. **Medido pelo `qa-engineer`: não
repete.** `N41` tem escopo `#pr-journey` — irmão de `#pr-support`, com **zero**
`<h3>` dentro —, e `N40` varre `#app`, enquanto o relatório impresso é filho de
`body` (`ui_v32.js:786-789`). **Nenhum gate congelado alcança o `<h3>` novo.**

Consequência registrada e agida: a metade-papel de `(g)` deixou de ser redundância
e virou **obrigação nova**, e por isso ganhou carrasco próprio — **`M19`**,
nascido na errata E2. `M17`, que ataca a metade de **tela**, é **prova fraca
declarada**: `N40` também o mataria, e mutante que morre em dois lugares não
demonstra poder do gate novo. **Sem `M19`, `(g)` entraria na família "gate verde
que não pode reprovar"** — a mesma que o backlog já cataloga em `EA-20` e que três
demandas seguidas instanciaram.

Detalhe de forma que o `qa-engineer` registrou e importa: `M19` **duplica** o
título no papel, não o renomeia — renomear encurtaria `#pr-support` em 14
caracteres e derrubaria `D015-NOSUB1(d)` junto, o que seria **kill incidental num
gate alheio**, não prova de `(g)`.

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
**nove** repins (`R0`…`R8`) e **os rótulos deixaram de significar o que o
`tasks.md` diz**. Registro o mapa real, porque desvio se registra e nunca se
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

**Saldo:** dois repins **nasceram fora da série** (ambos filhos da errata E2) e
seis previstos foram **fundidos em dois commits**. Nenhum arquivo pinado ficou sem
repin — o stage `baseline` fecha **290/290 · 0 divergentes · 0 sem pin** no HEAD
atual. Continuam pendentes o **R11 condicional** (só existe se o retorno do CI
alterar arquivo rastreado, T030) e o **R12** (este relatório, T032).

## O que fica aberto — declarado, não maquiado

1. **`p51` e `p52` — campanhas e suítes Chromium — deferidas ao CI.** É
   agendamento por desenho (KI-3), não pendência de qualidade: não há Chromium
   nesta worktree, medido pelo `env-doctor` — e reconfirmado hoje pela minha
   própria execução do stage `mutation` (`[FAIL] p51`/`[FAIL] p52`: *"campanha
   EXIGIDA (alvo mudou) mas ambiente sem chromium"*). **Conferido no runner,
   passo a passo, e não presumido**: PR
   [#34](https://github.com/oflavioc/quickscan-secops/pull/34), workflow
   `verify`, **run `33464353689`**:
   - job **`verify`** (`99720999259`) — **success**, concluído em
     2026-09-01T03:10:26Z, com os passos *"Pipeline de verificação (completo)"*
     e *"Auditoria de conformidade da configuração agêntica"* ambos **success**.
     É a plataforma canônica (Linux) confirmando o que fechou local;
   - job **`visual`** (`99720999212`) — **`in_progress`** quando este relatório
     foi escrito, com o passo 7 *"Suítes visuais (playwright + chromium
     P50/P52/D011)"* **completed success** e o passo 9 *"Campanhas de mutação com
     Chromium (deferidas pelo job verify)"* **`in_progress`**.
   **O que ainda não tem veredito citável**: as campanhas `p51` (20 mutantes) e
   `p52` (107 mutantes), que `ui_v32.js` dispara. As contagens das suítes
   Chromium (`p50chromium`, que mede `#pr-howto` no **PDF real**, e
   `p52chromium`, que inclui `P52-SUP3` — o gate cujo payload de evidência
   carrega o título mudado, restrição R-4) **estão dentro de um passo que saiu
   verde**, mas o número por suíte só é citável quando o run concluir e o log
   ficar disponível. O registro do retorno é a T029, do `qa-engineer`.
2. **`D015-TIT1(h2)` — alínea sentinela, sem mutante.** Falsificável, gatilho
   nomeado, **reavaliar quando o gatilho disparar**. Não é "não reporte".
3. **`D015-NOSUB1(d)` é rede, não guarda.** Em entrega aditiva **não detecta
   subtração menor que a própria adição** — o espelho da E18 da 010, onde a
   contagem de caracteres *revelou* uma subtração de 31%; aqui ela pode
   *mascarar* uma. As guardas de não-subtração são `(a)`, `(b)` e `(c)`, que
   comparam **conjuntos**. **`(d)` não pode ser citada como prova de que nada
   sumiu.**
4. **O que a `spec.md` declarou não mensurável por gate** — os três são **leitura
   humana na Fase 6** (T033, `product-owner`), e a spec já dispôs que a fase **não
   fecha só com gate verde**: (a) se a **redação** escolhida para o título é boa —
   o gate impede o título falso, não produz o título bom; (b) o nó de ancoragem no
   **PDF real**; (c) se tela e papel ficaram **poluídos** — a ressalva que o
   próprio cliente escreveu, e que já derrubou o C4 uma vez.
5. **`M17` e `M18` não estão na campanha executada** — achado desta validação,
   registrado em [spec-validate.md](spec-validate.md) como gap **G2**. A `spec.md`
   diz que `M18` é o **único carrasco** de `C1(h1)` e que `M17` é o (fraco) da
   metade-tela de `C1(g)`; nenhum dos dois vive no harness `d015` (13 entradas),
   nenhum tem par na `mutation-matrix.json` (14 pares) e nenhum consta de
   `dividas_declaradas`. **Foram provados uma vez** — a bateria negativa da Fase 4
   registrou 15/15 incluindo os dois —, mas esse registro **foi substituído** no
   `_trilha` de `d015` em `351de95` e hoje sobrevive **só no histórico do git**,
   sem trigger de path que o re-execute. Raiz: o `tasks.md` é **anterior à errata
   E1**, que criou os dois, e nunca foi emendado (gap **G1**). Correção é do
   `qa-engineer` (R3 §2); a direção recomendada está no registro do
   `spec-validate`.
6. **O planning-state ainda registra `phase: "red"`**, sem as seções `implement` e
   `validate`, embora implementação, rebuild e campanha estejam commitados. O
   stage `state` passa (as seções são opcionais no schema), mas o `state-eval` lê
   a demanda como se ela estivesse no red. Dono: `qa-engineer` (T029) /
   orquestrador.
7. **O `tasks.md` não foi emendado depois das erratas E1 e E2** e por isso
   registra números que o executado superou: T018 fala em **12 mutantes** (são
   13, com `M19`), T023 em **13 pares** (são 14, com `M16`), e a §"Matriz
   gate↔mutante prevista" **não conhece `M17`, `M18` nem `M19`**. A `spec.md`
   está correta — quem envelheceu foi o `tasks.md`. É o gap **G1** do
   `spec-validate`, e **exige decisão do usuário**: emendar artefato aprovado é
   aprovação do usuário (R4).

## Achados — ids `EA-*` que eu **proponho**, sem alocar

Alocação de id é minha por regra, mas escrever em `.claude/BACKLOG.md` está
**fora do escopo desta demanda** (`spec.md` §Fora de escopo 10; `tasks.md` T031).
**Conferido antes de propor**, hoje: a série vai até **`EA-20`** na `develop` e a
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
  discriminante*) ganhou **mais uma instância, encontrada antes de virar dívida**:
  a metade-papel de `C1(g)`, que teria nascido verde sem poder reprovar. **Foi
  resolvida dentro da demanda**, com `M19`.

## Dependências deixadas para outros

| Para | O quê |
|---|---|
| `qa-engineer` | **Gap G2 do `spec-validate`**: decidir e executar o destino de `M17` e `M18` — harness ou dívida declarada na matriz, nunca omissão. A correção é dele por R3 §2; o `doc-writer` não escreve gate. Registrar o retorno do run `33464353689` na `mutation-matrix.json` e no planning-state (T029), diagnosticando **causa** antes de atribuir ao produto se algo sair vermelho (R2 §3). Avaliar se `ultima_prova` dos pares `core`/`d009`/`d010` deve ser atualizada: os três harnesses foram **re-executados nesta demanda** (`ui_v32.js` é alvo dos três) e a matriz ainda registra 2026-08-28 para `core`/`d009` — o precedente da 009 (T019) atualizou o `registro` nesse caso. Confirmar por execução os candidatos `EA-22` e `EA-24` |
| `build-engineer` | `R11` (condicional, T030) e `R12` (após este relatório, T032). O título mudado entra no **payload de evidência pinado** de `P52-SUP3` (restrição R-4): o retorno do job `visual` decide se há promoção de evidência (R11 §2) e/ou repin de artefato **no mesmo PR** |
| `product-owner` | Aceite de intenção (T033): os três itens não mensuráveis. E a decisão sobre gravar no `CONTEXT.md` o verbete **cláusula sentinela**, escrito na `spec.md` §E2.1 e deliberadamente **não gravado** — glossário é dele |
| `product-owner` | **Deriva de número no próprio refinamento**, achada nesta escrita: o título de `refinement.md` §M4 diz *"seis gates congelados em três suítes"*; a tabela logo abaixo tem **sete linhas, oito ids de gate e quatro suítes** (`tests_ui_m32.js`, `tests_ui_m332.js`, `tests_010_vao.js`, `tests_p52_chromium.js`); e o `brief` do planning-state diz *"sete gates em quatro suítes"*. Os três não podem estar certos. A tabela é a fonte; a prosa do refinamento é do PO e só ele a emenda |
| orquestrador | Decidir sobre os dois gaps de classe **spec-errada** do `spec-validate` (registro em [spec-validate.md](spec-validate.md)) e sobre a alocação dos ids `EA-21`…`EA-27` propostos acima |
| usuário (proprietário) | Merge do PR #34 e, se for o caso, a palavra sobre §29.6 — a spec registrou o **precedente** (009 e 010 editaram caminho de print sob autorização nominal de mesma natureza) **e o limite**: se o proprietário entender que §29.6 exige palavra própria para o papel, isso é decisão dele, não suposição da spec |

## Fontes citadas

- `specs/015-superficies-de-apoio/refinement.md` — §M3 (três dos quatro estados
  únicos), §M4 (gates congelados), §M5 (3 de 7 combinações), §P13, §P14
- `specs/015-superficies-de-apoio/spec.md` — erratas E1 e E2, critérios C1–C6,
  guarda de tautologia, restrições R-1…R-4, §"O que NÃO é mensurável por gate"
- `specs/015-superficies-de-apoio/plan.md` · `tasks.md` — waves, série de repins,
  donos por tarefa
- `.claude/verify/expected_suites.json` → `d015` (`_trilha` com as medidas antes e
  depois, e a divergência do 667)
- `.claude/verify/mutation-matrix.json` — 14 pares `D015-*` e as duas dívidas
  declaradas (sentinela × defensiva)
- `.claude/verify/mutation_map.json` → harness `d015` (`preflight: true`, alvos)
- `.claude/verify/pins.json` — `declared.m41_payload_sha256` e
  `files/ui_v32.js`
- `tests_p50_core.js:192` — repin inline de `PROTECTED`, com trilha R8 §2
- `tests_015_apoio.js` · `tests_015_mutants.js` · `fixtures_015_apoio.js`
- Commits: `22ad24d` `723a7c3` `b2ec1c4` `3bc9c8b` `8396a4c` `9c83a07` `f084c02`
  `7265432` `de30308` `351de95` `9c88ac8`
- PR [#34](https://github.com/oflavioc/quickscan-secops/pull/34) · run
  [`33464353689`](https://github.com/oflavioc/quickscan-secops/actions/runs/33464353689)
