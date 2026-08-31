# Refinamento — 011-numeracao-das-prioridades

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.

Pedido do cliente (item 1 dos nove levantados na sessão de 2026-08-27), verbatim:

> *"Observe que algumas questões dentro das prioridades ficaram sem numeração."*

Origem do enquadramento: `specs/009-leitura-do-relatorio/refinement.md:142-147` e
`:194-196` separaram este item numa demanda própria. Este documento **não herda
aceite** daquele — abre e se sustenta por medição própria.

## Necessidade

**Quem usa é o facilitador, ao vivo, com o cliente olhando a tela.** Este é o
único dos nove itens que **não** é sobre o relatório: a superfície é a tela de
prioridade do negócio, um passo do wizard que o leitor do relatório nunca vê. O
que muda para ele: hoje, no momento em que precisa dizer "a maturidade identifica
o gap; quem define a prioridade é o negócio" (`quickscan_...v3_1_3.html:724`), a
tela apresenta uma lista que **parece numerada e parece quebrada** — e ele gasta a
credibilidade do instrumento explicando um artefato de interface em vez de
conduzir a conversa. Foi exatamente o que aconteceu em 2026-08-27: o cliente
interrompeu para apontar o defeito.

Por que agora: é o item de menor custo dos nove e o último que ainda estava sem
demanda aberta junto do 6a/8. Fechá-lo encerra a leitura da sessão de 2026-08-27
com a superfície de facilitação incluída, não só a de leitura.

## Enquadramento de produto

### A pergunta que vem antes de qualquer rota: essa lista deve ser numerada?

**Não.** Três razões, em ordem de peso:

1. **Numerar afirmaria a hierarquia que a própria tela nega.** A ordem subjacente
   é severidade decrescente (`computeFindings`, `:531`: `sev desc, lvl asc,
   k asc`) — é o **ranking de maturidade**. A tela existe para que o negócio
   escolha livremente, e diz isso em voz alta na `hint` (`:724`). Pôr 1..N sobre
   a ordem de severidade, na tela em que o negócio deve decidir, é um dispositivo
   de ancoragem: puxa a escolha para a ordem que o produto já calculou. É a mesma
   doutrina da INV-5 — declarado nunca deriva de produto —, aplicada à prioridade
   em vez do cenário-alvo.
2. **Já existe uma numeração legítima nessa tela, com outro significado.** O item
   selecionado ganha o badge `Prioridade 1..3` (`ui_ux_v32.js:176-177`), na ordem
   de **declaração**, replicado no resumo lateral (`:171-173`), nas fichas do
   relatório (`quickscan_...v3_1_3.html:893-896`, `prio` = ordem de seleção,
   `:825`) e nos chips do resultado (`ui_ux_v32.js:213-214`). Numerar a lista
   criaria **dois sistemas numéricos contraditórios na mesma tela**: um "3" que
   significa severidade ao lado de um "Prioridade 1" que significa escolha do
   negócio.
3. **O número exibido nem sequer é a posição visual.** A camada UX reagrupa os
   botões por domínio (`ui_ux_v32.js:154-168`); o glifo viaja com o nó original.
   Numerar por posição quebraria o atalho; numerar por severidade produz uma
   escada invisível, sem ladeira à vista.

Conclusão de produto: **o `·` não é o defeito — o defeito é o glifo numérico ler
como índice.** A demanda certa não é "numerar"; é **desambiguar**.

### O `·` desenha uma ausência como se fosse um valor

`${sel?"✓":(i<9? i+1 : "·")}` (`:728`): o `·` significa "este item **não tem**
atalho". É ausência renderizada como glifo, dentro da mesma caixa 26×26 com borda
que abriga os valores (`:68-70`). Não é violação da INV-2 — o eixo da INV-2 é
score, e esta tela declaradamente não pontua (`:722`, "não altera o score"). Mas é
**o mesmo erro de categoria** que o produto trata como defeito em toda parte onde
mede: ausência não se desenha como valor. Essa é a razão de mérito para suprimir o
glifo mudo, não apenas explicá-lo.

### Invariantes tangenciadas (R1)

| Inv. | Situação | Consequência para a demanda |
|---|---|---|
| **INV-1** | O harness M41 lê **só** a Camada 1 (`harness_m41_v313.js:16` e `:24` — `htmlPath` default `quickscan_secops_soccmm_v3_1_3.html`), sem carregar camadas 5.x | Qualquer rota que viva em `ui_ux_v32.*` está **provadamente fora da régua D2**. Rota na Camada 1 é Porta B (Porta A pendente de ratificação) |
| **INV-2** | Não tocada: nada aqui produz score | Registrar explicitamente para a Fase 6 não medir a demanda contra ela. O princípio ("ausência ≠ valor") é argumento, não gate |
| **INV-5** | Não tocada literalmente (fala do cenário-alvo) | A doutrina "declarado nunca deriva de produto" é o que sustenta a recusa de numerar |
| **INV-6** | Prioridade declarada **não** altera score: `buildTiers` só concatena a razão `" (prioridade declarada pelo negócio)"` (`:544-546`) | A demanda não pode criar caminho novo para scoring. Restrição, não entrega |
| **INV-9** | `quickscan_secops_soccmm_v3_1_3.html` é `frozen` (`.claude/verify/boundary.json:9-14`) | Rota (b) abre rito D2 Porta B — dito na cara, não em rodapé |
| **INV-10** | Nada renomeia: `.key`, `.opt`, `togglePriority`, `businessPriority` permanecem | Prosa PT-BR; CSS novo com prefixo `ux-` (R9 §6) |

### Conflito com decisão registrada

| Decisão | Relação | Encaminhamento |
|---|---|---|
| `design-decisions.md` — "Severidade uniforme no MAP: `[2,1,0,0]`" (candidata) | **Confirmada no source**: 15 entradas `{s:2,…}` em `MAP` (`:420-419+`), `{s:1,…}` no nível 1, `{s:0}` nos níveis 2 e 3 | É o que faz a ordem de findings ser, dentro de cada bloco de severidade, a ordem do questionário. Esta demanda **não reabre** a decisão |
| `CONTEXT.md:91-95` — verbete **Tecla de atalho (priorização)**, criado na 009 | Diz que o glifo "indica o ATALHO DE TECLADO daquele item, **não a sua posição numa lista**" e que "itens além do nono não recebem atalho" | O verbete é **neutro à rota (a)** e continua verdadeiro depois dela. A rota (b) obrigaria a **reescrever vocabulário canônico** — mais um custo dela |
| `tests_ux_m41.js:127` (UX14) — "atalho de teclado continua atingindo o finding global correto após regroup" | Qualquer rota que remapeie teclas mata este gate | Restrição dura: o mapeamento tecla↔finding é intocável |
| `tests_p52_chromium.js:6053-6072` (V322C-CON1) — contraste WCAG medido em `#next` **nesta tela** | Já existe gate de contraste na tela de prioridade | Texto novo nasce com contraste conferido; `.ux-micro`/`--faint` não é escolha segura por default |

### Rotas, com o rito de cada uma

| # | Rota | Toca | Rito / custo | Parecer |
|---|---|---|---|---|
| **a** | **Desambiguar na camada UX**: suprimir o glifo mudo (caixa preservada, sem conteúdo), legenda própria dizendo que os números são atalho de teclado, e semântica de acessibilidade (`aria-hidden` no glifo + `aria-keyshortcuts` no botão) | `ui_ux_v32.js` (`uxPriority`, `:154-178`), `ui_ux_v32.css` — **nenhuma classe protegida** | **Nenhum rito de boundary.** Gate novo com mutante (R10/R3) em namespace da demanda (`tests_011_*.js`, padrão da 009); contraste conferido | **Recomendada** |
| **b** | **Numerar de fato / estender atalhos na Camada 1** | `quickscan_secops_soccmm_v3_1_3.html` — **`frozen`** | **Rito D2, Porta B**: spec + **auditoria independente humana** (R4/D3) + regressão M41 + repin (R8) + rebuild do gerado | **Recusada — por mérito antes do custo.** Afirma hierarquia que a tela nega e colide com "Prioridade 1..3" |
| **b'** | Remapear 1–9 para a ordem visual pós-agrupamento, pela camada UX | `ui_ux_v32.js` | Sem rito formal, mas exige listener em **captura** com `stopPropagation` para engolir o handler congelado (`:1036`, `:1058`) — anular comportamento congelado por fora é pior que pedir o rito | **Recusada.** Mata UX14 (`tests_ux_m41.js:127`) |
| **b''** | Dar atalho ao 10º item com a tecla `0` (o handler congelado ignora `n=0`, `:1058`, então não há conflito) | `ui_ux_v32.js` | Baixo | **Recusada.** Move a fronteira de 9 para 10 e deixa até 5 itens sem atalho: cria caso especial sem fechar o vão |
| **a-** | Só a legenda, sem mexer no glifo | `ui_ux_v32.css`/`.js` | Mínimo | Disponível como recuo. Deixa de pé o `·` — o token que o cliente efetivamente apontou |
| **a+** | Suprimir **todo** glifo numérico da tela | `ui_ux_v32.js` | Baixo | **Recusada.** A `kbd-tip` congelada continuaria prometendo "1–9 seleciona" sem nada na tela a que se referir |
| **c** | **Não fazer nada** e responder ao cliente por escrito que o glifo é atalho | nenhum | Zero | **Legítima e disponível** (ver P2). Fecha este cliente; não fecha o próximo facilitador, e deixa o nome acessível poluído |

### Alternativa mais simples considerada

A rota (c) — explicar — é a mais simples e **está na mesa de verdade**: se o
comportamento está certo, "não há demanda" é resultado válido. Não a recomendo por
duas razões medidas, não estéticas: (i) o cenário em que o sintoma aparece não é
raro, é o **típico** do público do instrumento (ver Casos de borda 2 e 3); (ii) o
glifo entra no **nome acessível** do botão, e nenhuma explicação verbal ao cliente
conserta isso para quem usa leitor de tela.

## Sistema real

Tudo abaixo foi **lido no source desta worktree** (`phase5-011`, nascida de
`origin/develop` em `c51e60f`). Classes conferidas em
`.claude/verify/boundary.json`: `quickscan_secops_soccmm_v3_1_3.html` é `frozen`;
`quickscan_secops_soccmm_v3_2_dev.html` é `generated`; `ui_ux_v32.js` e
`ui_ux_v32.css` **não** são protegidos.

**O glifo e o handler.**
`renderPriority` (`:715-747`) monta um botão por finding; o glifo é
`${sel?"✓":(i<9? i+1 : "·")}` (`:728`), dentro de `<span class="key">` — caixa
26×26 com borda e raio (`:68-70`), que vira vermelha sólida quando selecionado
(`:70`). O handler está em `:1056-1061`: `if(n>=1 && n<=9 && findings[n-1])`. A
`kbd-tip` do rodapé (`:738`) diz "1–9 seleciona os primeiros itens". **Confirmado:
é teclado, não índice.**

**Quantos itens a lista pode ter.**
`QS` tem **15 perguntas**, 3 por domínio, contíguas por domínio (`:297-409`;
`validateConfig:1081` exige exatamente 3 por domínio). `MAP` (`:420-433` e
seguintes) tem severidade uniforme `[2,1,0,0]` — 15 ocorrências de `{s:2,` no
arquivo, amostra legível em `:421-432`.
`computeFindings` (`:522-533`) emite um finding por resposta **confirmada** cujo
nível tenha `s>0` — ou seja, níveis 0 e 1. Logo **N ∈ [0, 15]**, e o `·` aparece
a partir de **N ≥ 10**, em até **6** itens.

**Por que o cliente leu "algumas questões".**
`uxPriority` (`ui_ux_v32.js:154-178`) **move os nós originais** (`:166`,
comentário "handlers/aria intactos") para grupos por domínio, na ordem de `DOMS`,
preservando a ordem global dentro de cada grupo (garantido por UX10,
`tests_ux_m41.js:91-99`). Como a ordem global é severidade-primeiro, o glifo
1..9 aparece **espalhado** e o `·` cai onde o domínio daquele finding estiver.
No cenário de referência das suítes — `answerAll(w,1)`, 15 findings nível 1
(`tests_ux_m41.js:88`) — a ordem global é a ordem do questionário, e a tela fica
assim:

| Grupo | Glifos |
|---|---|
| Negócio | `1` `2` `3` |
| Pessoas | `4` `5` `6` |
| Processos | `7` `8` `9` |
| Tecnologia | `·` `·` `·` |
| Serviços | `·` `·` `·` |

Ou seja: **dois grupos inteiros sem glifo numérico**. A leitura "a lista perde a
numeração no meio" não é desatenção do cliente — é a descrição exata do que a tela
desenha. Derivado do source; **não executado** (ver DEPENDÊNCIAS).

**Terceira causa de "número faltando".** Item selecionado troca o número por `✓`
(`:728`). Com 3 seleções entre os 9 primeiros e 15 findings, **9 dos 15 botões**
ficam sem número.

**O relatório não tem o problema.** Leitura concorrente descartada por medição: as
fichas de prioridade do resultado (`.prio-decl`, `:893-899`) são no máximo 3, na
ordem de declaração (`prio` em `:825`), e **todas** trazem "Prioridade N ·
declarada na sessão". Não existe caso sem número lá.

**Impressão.** O `@media print` da Camada 1 esconde `.kbd-tip` (`:207`) e **não**
esconde `.opt .key`. Quem imprimir esta tela leva os números e os `·` para o
papel **sem** a única frase que os explica.

**Acessibilidade.** O `<span class="key">` é o primeiro filho do `<button>`, sem
`aria-hidden`; portanto entra no **nome acessível**: "3 Cobertura de logs
TECNOLOGIA Evidência: … Capability: …". O botão tem `aria-pressed` (`:727`), então
o `✓` também é redundância falada. Não há `aria-keyshortcuts` em lugar nenhum.

**Regressão que a demanda tem de respeitar.** `tests_ux_m41.js` UX8/UX9/UX10
(agrupamento, unicidade, ordem), UX11 (limite de 3), UX12/UX13 (badges
`Prioridade N` e renumeração ao desmarcar), **UX14** (atalho continua acertando o
finding global após o regroup); `tests_ref_m44.js:76` e `:224` dependem de
`.ux-priogroup`; `tests_p52_chromium.js:5512` (K11, tela `priority`) e
`:6053-6072` (V322C-CON1, contraste na mesma tela). **Nenhum gate afirma o
conteúdo do `.key` nesta tela** — verificado por busca em `tests_*.js`.

**Restrição de desenho (R9 §3).** O decorador **não** pode decidir lendo o texto
já renderizado do `.key`; ele já possui `findings` (`ui_ux_v32.js:156`) e deve
derivar o índice dali — a mesma fonte que a Camada 1 usou. Barato e imune a drift.

**Idempotência.** `render` é reconstruído a cada toggle (`ui_ux_v32.js:5` decora
`render`; `:10` chama `uxPriority` no passo de prioridade; a guarda `ux-grouped`
em `:155` só protege dentro do mesmo ciclo). Qualquer ajuste tem de ser
reaplicável a cada render, e o passo pode ser interceptado antes pelo ramo de
refinamento operacional (`ui_refinement_v32.js:50`).

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | **N ≤ 9 findings** | Todos numerados; o sintoma não aparece. A demanda não pode alterar nada visível aqui além da legenda e da semântica de acessibilidade |
| 2 | **N = 10** (piso de suficiência atingido com todas as respostas em nível 0/1) | Exatamente **1** item sem atalho. É o menor caso em que o cliente vê o sintoma |
| 3 | **N = 15** (cenário `answerAll(w,1)`) | Grupos **Tecnologia** e **Serviços** inteiramente sem glifo numérico. Depois da rota (a): sem glifo algum, com a legenda explicando |
| 4 | **Item selecionado entre os 9 primeiros** | O `✓` **permanece** — é estado, não índice. A "falta de número" causada por seleção não é defeito e não se corrige |
| 5 | **N = 0** (todas as confirmadas em nível 2/3, ou todas "A validar") | Hoje: a pergunta "quais gaps mais impactam?" fica sobre uma **lista vazia**, com "0 de 3 selecionadas". Ver P9 — escopo secundário proposto |
| 6 | **Impressão da tela de prioridade** | O glifo de atalho não tem função no papel e a `kbd-tip` já some (`:207`); o **estado de seleção** (`✓`/`.sel` + badge `Prioridade N`) tem de continuar legível |
| 7 | **Leitor de tela** | O glifo sai do nome acessível (`aria-hidden`), o atalho é declarado em `aria-keyshortcuts`, e o item sem atalho simplesmente não declara nada |
| 8 | **Marcar/desmarcar em sequência** | `render()` reconstrói tudo; o ajuste tem de ser idempotente por reconstrução, nunca acumulativo |
| 9 | **"Pular · não priorizar agora"** (`:737`, `:746`) | Nada muda: a demanda não toca relatório nem `businessPriority` |
| 10 | **Ramo de refinamento operacional intercepta o passo** (`ui_refinement_v32.js:50`) | A tela de prioridade só renderiza depois; o decorador tolera hoje e tem de continuar tolerando |
| 11 | **Grupo com um único finding** | Um grupo pode ter 1 item, numerado ou não; a legenda é única para a grade, nunca por grupo |

## Vocabulário

**Nenhum termo novo é necessário.** O verbete que governa esta demanda já existe e
foi criado na Fase 0 da 009:

- **Tecla de atalho (priorização)** — `CONTEXT.md:91-95`. Confere com o source
  (`:728`, `:1058`) e é **neutro à rota (a)**: continua verdadeiro depois dela.
  Governa a redação da legenda nova e de toda prosa desta demanda.
- O verbete já lista **"numeração"** entre os termos a evitar — e "numeração" é
  justamente a palavra do slug desta demanda (`011-numeracao-das-prioridades`).
  Ver P10: o slug preserva a fala do cliente; a prosa usa o termo canônico.
- **"Bloco de ausência"** (`CONTEXT.md:72-76`) **não se estende** à tela de
  prioridade: o verbete fala de *bloco de resultado*, e esta é uma tela do wizard.
  O caso 5 aplica o **princípio** já acordado (a ausência vira aviso único e
  acionável), sem esticar o termo. Registrado aqui para não virar ambiguidade na
  Fase 1.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| R0 | Item 1 é sobre o relatório? | **Não** — é a tela de prioridade, superfície de facilitação ao vivo. Medido, não suposto |
| R0 | A worktree é exclusiva? | Sim — `phase5-011`; a 010 corre em `phase5-010` com agente ativo |
| R1 | P1–P11 abaixo, **uma recomendação cada** | *(pendente do portão)* |

### Perguntas do portão — P1 a P11

Cada pergunta carrega recomendação e motivo; a aprovação pode ser em bloco.

- **P1 · A lista da tela de prioridade deve ser numerada?**
  **Recomendação: não.** Numerar afirma uma hierarquia que a própria tela nega
  (`:724`) e colide com a numeração legítima "Prioridade 1..3", que é a ordem
  **declarada** pelo negócio. O pedido do cliente se atende desambiguando, não
  numerando.

- **P2 · Existe demanda aqui, ou basta explicar ao cliente?**
  **Recomendação: existe demanda, pequena, na camada 5.x (rota a).** "Explicar"
  (rota c) fecha este cliente e não fecha o próximo facilitador; e não conserta o
  nome acessível do botão, que é defeito objetivo. Se o usuário preferir a rota
  (c), ela está desenhada e é legítima — a decisão é dele.

- **P3 · O que fazer com o glifo mudo (`·`)?**
  **Recomendação: suprimir o conteúdo, preservar a caixa.** Preservar mantém o
  alinhamento dos rótulos dentro do grupo (se a caixa sumir, os textos passam a
  começar em x diferentes); suprimir o conteúdo tira da tela o token que lê como
  "a numeração quebrou". A forma final da caixa vazia é decisão de
  `ui-engineer` na Fase 2, com a restrição de não parecer defeito de renderização.

- **P4 · Legenda explícita na tela?**
  **Recomendação: sim, uma linha, acima da grade de grupos**, na camada UX, com o
  termo canônico — algo como "Os números são atalhos de teclado (1–9), não a
  ordem de prioridade." Motivo: os números 1–9 continuam existindo e continuam
  lendo como ranking; sem a legenda, a rota (a) resolve metade. A `kbd-tip`
  congelada fica no rodapé e some na impressão, então não serve como legenda.

- **P5 · Impressão desta tela.**
  **Recomendação: o glifo de atalho não se imprime; o estado de seleção sim.**
  No papel não há teclado, e a única frase que explicava o glifo já é escondida
  pela Camada 1 (`:207`). O `✓`/`.sel` e o badge `Prioridade N` permanecem.

- **P6 · Semântica de acessibilidade.**
  **Recomendação: adotar `aria-hidden="true"` no `.key` e `aria-keyshortcuts`
  no botão que tem atalho.** É o primitivo ARIA exato para o caso: declara o
  atalho à tecnologia assistiva sem poluir o nome acessível. Item sem atalho não
  ganha atributo nenhum — ausência não se declara como valor.

- **P7 · Remapear 1–9 para a ordem visual pós-agrupamento?**
  **Recomendação: não.** Exigiria um listener em captura com `stopPropagation`
  para anular o handler congelado — pior que pedir o rito, porque o congelado
  ficaria mentindo. E mata UX14 (`tests_ux_m41.js:127`).

- **P8 · Estender o atalho além do nono (ex.: tecla `0` para o décimo)?**
  **Recomendação: não.** É tecnicamente possível sem conflito (`:1058` ignora
  `n=0`), mas move a fronteira de 9 para 10 e deixa até 5 itens sem atalho:
  adiciona caso especial sem fechar o vão.

- **P9 · Lista vazia (caso 5) entra no escopo?**
  **Recomendação: sim, como escopo secundário declarado.** Mesma superfície,
  mesmo módulo, mesma wave, mesmo arquivo de gate — o custo marginal é baixo e a
  segunda visita a esta tela custaria mais que a inclusão. E o conteúdo do estado
  vazio **não é decisão nova**: aplica o princípio já aceito na 009 (a ausência
  vira aviso único e acionável). A spec tem de separar os dois escopos para a
  Fase 6 medir cada um.

- **P10 · O slug `011-numeracao-das-prioridades` usa termo que o glossário evita.
  Renomear?**
  **Recomendação: manter.** Renomear implica branch e worktree novas, e o slug
  preserva a rastreabilidade ao pedido verbatim do cliente. O título da spec e
  toda a prosa usam "tecla de atalho"; fica registrado que "numeração", no nome,
  é o **sintoma relatado**, não vocabulário canônico.

- **P11 · Achado do caso 5 no BACKLOG: alocar id agora?**
  **Recomendação: não alocar na Fase 0.** A série `EA-*` chega a **EA-7** nesta
  worktree, e a 010 corre em branch paralela que esta não enxerga — id alocado
  agora vira conflito de merge no arquivo onde renumerar é proibido (R12). A
  cadeia arquivo:linha→efeito fica registrada neste refinamento como insumo; a
  escrita no BACKLOG é tarefa da demanda, pelo `doc-writer`, depois que as
  branches irmãs chegarem à develop.

## Fora de escopo (explícito)

- **A Camada 1 permanece apenas lida.** Nenhum rito D2 é aberto por este
  refinamento — nem Porta A nem Porta B.
- **O mapeamento tecla↔finding não muda.** `1–9` continua atingindo
  `findings[n-1]` (`:1058`); UX14 continua verde por construção.
- **A ordem dos findings não muda** (`computeFindings:531`) — nem a de severidade,
  nem o agrupamento por domínio da camada UX.
- **O relatório não é tocado.** Fichas `.prio-decl`, chips `Prioridade N`,
  narrativa e tiers ficam como estão.
- **Scoring, suficiência e catálogo intocados**; a demanda não cria caminho novo
  para score (INV-6 como restrição).
- **A frase congelada da `kbd-tip` (`:738`) não é reescrita pela camada UX.**
  Texto congelado não se corrige por fora; a legenda nova é aditiva e própria.
- **Os itens 6a e 8 do cliente** seguem em demanda própria, ainda não aberta.
