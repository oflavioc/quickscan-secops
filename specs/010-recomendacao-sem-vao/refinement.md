# Refinamento — 010-recomendacao-sem-vao

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.

Origem: itens **4, 6 e 8** do feedback do cliente de 2026-08-27, encaminhados pela
`specs/009-leitura-do-relatorio/refinement.md:522` ("Fora de escopo · item 6"), mais
o parecer do analista independente. Nada deste documento aprova fase, dispensa
invariante ou autoriza edição de superfície protegida. Data: **2026-08-30**.

**Estado do portão: ABERTO.** Este documento levanta e recomenda; as respostas de
P1–P13 são recomendações, não decisões. Duas delas (**P11** e **P12**) exigem
ratificação do proprietário e estão marcadas como **ESCALAR**.

---

## Necessidade

**Quem usa.** O *leitor do relatório* (executivo do cliente, lê uma vez, não conhece
a metodologia) e o *facilitador* que conduziu a sessão e vai defender o documento.

**O que muda — e a correção de enquadramento.** O pedido chegou como "faltam
recomendações". Não é isso. O relatório do cliente estava num **estado intermediário
que ninguém desenhou**: declarar *qualquer* contexto tecnológico faz o produto
**apagar** as recomendações da Camada 1 congelada sem que a camada V3.2 produza
substituto, porque as capabilities continuam `UNSET`. O leitor não recebeu poucas
recomendações — recebeu **menos do que receberia se o facilitador não tivesse
declarado nada**. E recebeu, no lugar delas, um card que afirma literalmente
"Leitura V3.1.3 preservada" (`ui_v32.js:615`) apontando para blocos que estão
`display:none` na mesma tela (`ui_v32.css:2`).

**A necessidade real, em uma frase:** *o relatório não pode ter um estado em que
declarar contexto subtrai conteúdo, nem afirmar que preserva uma leitura que ele
mesmo oculta.* "Recomendar mais" é consequência possível; **não** é a necessidade.

**Por que agora.** Enquanto o vão existir, qualquer trabalho sobre itens 6 e 8 é
cosmética sobre um defeito estrutural: suprimir blocos (item 6) num relatório que já
subtrai conteúdo, e dissolver a seção de apoio (item 8) num relatório onde ela é a
última superfície visível de produto, pioram exatamente o que o cliente reclamou.

---

## Enquadramento de produto

### O achado que muda o enquadramento — cadeia arquivo:linha → efeito

**A1 · A arbitragem entre as duas doutrinas é tudo-ou-nada e o critério é
"contexto ZERO".**

- `engine_v32.js:305` — `isLegacyModeV32()` exige **quatro** condições simultâneas:
  landscape inteiro `UNSET` **e** arquitetura toda default **e** sinais todos
  `unset` **e** `declaredPlatforms` vazio.
- `ui_v32.js:235-237` — legado ⇒ `hideLegacyRecommendation(app, false)`: a
  recomendação congelada fica **visível**.
- `ui_v32.js:277` — não-legado ⇒ `hideLegacyRecommendation(app, true)`: os três
  títulos de `HIDE_EYEBROWS` (`ui_v32.js:109-110`) e o conteúdo contíguo deles são
  **ocultados**.
- `engine_v32.js:401` — mas, capability a capability, `classify()` sob `UNSET`
  devolve `CONTEXT_NOT_INFORMED`; `engine_v32.js:601-602` traduz para
  `supportMode:"LEGACY-LABELLED"`, sem candidatos. `resolveCandidates()`
  (`engine_v32.js:436`) só é chamado sob `TECHNOLOGY_WHITESPACE`
  (`engine_v32.js:570-572`).

**Efeito:** uma única resposta de arquitetura, ou um único sinal marcado, tira a
sessão do legado e **desliga** a doutrina que produzia conteúdo, sem **ligar** a que
o substituiria. O predicado da supressão ("há contexto?") não é o predicado do
substituto ("há candidato?").

**A2 · O que exatamente some — e o que sobra, que é pior.**
Ocultados no vão: "Como a Fortinet pode apoiar nas prioridades declaradas",
"Como a Fortinet pode apoiar agora" e "Pode fazer sentido — após validação"
(T2), com seus `.apoio-block`/`.t-list` (`ui_v32.js:109-110`, `:189-192`).
**Permanecem visíveis**: o `<details>` "Possíveis formas de apoio aos demais gaps
altos" (`quickscan_secops_soccmm_v3_1_3.html:910`, roteado ao balde `gaps` por
`ui_p52_workspace_v32.js:677` via `RE_GAPS`) e o `<details>` "Não priorizados neste
screening" (T3). Ou seja: **sobrevivem visíveis justamente os produtos ligados ao
que a sessão NÃO priorizou**, e somem os ligados ao que ela priorizou. É a inversão
exata que o cliente descreveu.

**A3 · E o que sobrevive, sobrevive mutilado.**
`apoioBlock` (`quickscan_secops_soccmm_v3_1_3.html:860-879`) usa o `Set` `renderedP`
(`:859`) para deduplicar: quem renderiza primeiro leva o card completo. As
prioridades renderizam **antes** (`:901-902`), depois os "demais gaps altos"
(`:909-911`). Logo, no vão, o card completo de FortiSOAR é consumido pelo bloco
**oculto**, e o `<details>` visível exibe só o `.prod-mini` — "*também* relacionado a
esta capability" — referindo um card que o leitor nunca vê.

**A4 · O card V3.2 afirma o que a tela desmente.**
`baseCardHTML` (`ui_v32.js:611-622`) imprime, para as capabilities prioritárias sob
`CONTEXT_NOT_INFORMED`: "**Leitura V3.1.3 preservada** (…) — nenhum produto é
inferido sem contexto" (`:615`). No vão, a leitura V3.1.3 daquelas mesmas
capabilities está oculta duas seções acima. **A frase é falsa no momento em que é
impressa.** Isto é defeito de INV-7, não de catálogo.

**A5 · A assimetria produto × serviço.**
`buildRecommendationContext` anexa **serviços** fora do `switch`
(`engine_v32.js:653-665`), condicionados só a `hasGap` — inclusive sob
`CONTEXT_NOT_INFORMED`. Produto exige contexto; serviço não. Por isso o card de
prática-alvo pode exibir serviço e nunca produto, e por isso o cliente listou
**quatro produtos** (FortiSOAR, FortiEndpoint, FortiNDR/FortiNAC, FortiRecon) e
nenhum serviço como ausente.

**A6 · Vazamento do escopo de ocultação (achado adjacente, derivado do source,
NÃO executado).** A varredura de `hideLegacyRecommendation` mantém `hiding=true` por
todos os nós "permitidos" contíguos (`ui_v32.js:189-193`). No template congelado, o
`<details>` T3 (`:1005-1007`) vem depois do bloco "Capabilities a validar"
(`:1002-1004`), que **só existe se houver resposta NA**. Sem nenhuma resposta
"não sei", o T3 fica contíguo ao `.t-list` do T2 (oculto) e é ocultado junto.
**Consequência:** a visibilidade de "Não priorizados neste screening" passa a
depender de haver, ou não, uma resposta "não sei" na sessão — acoplamento acidental,
sem regra de produto que o justifique.

### Invariantes tangenciadas (R1)

| INV | Tangenciada? | Como — e o limite |
|---|---|---|
| **INV-7** narrativa determinística e derivada de evidência | **SIM — é a invariante governante** | A4 é violação viva: texto afirma preservação de uma leitura oculta. Toda saída desta demanda tem de ser função determinística de evidência confirmada (nível respondido + catálogo declarado), nunca de suposição sobre posse de tecnologia |
| **INV-2** UNSET ≠ NONE | **SIM, na apresentação** | Listar habilitador sob `UNSET` não pode ler como "você não tem". Sob `UNSET` o texto declara *não-informação* e rotula o item como **a validar**; sob `NONE` declarado (+ suficiência) o item é whitespace e pode ser apoio direto (`engine_v32.js:402-404`) |
| **INV-5** target declarado, nunca deriva de produto | **SIM** | Confirmo P3 da 009: o habilitador ancora no **nível ATUAL confirmado** (`MAP[qid].lv[ans[k]]`). Ancorar no nível-alvo faria o produto virar função da ambição e inverteria a seta |
| **INV-3** suficiência antes de qualquer score | **SIM, por importação** | A Camada 1 nomeia produto **sem** gate de suficiência: `computeFindings()` (`quickscan_…:522`) não consulta `suff`, e `apoioAgora` (`:933`) renderiza produto com gate fechado. O engine, ao contrário, exige `ENV.assessmentSufficient()` (`engine_v32.js:402`). Ler o `MAP` sem replicar o gate importa a propriedade mais fraca da Camada 1 para uma superfície nova |
| **INV-4** tecnologia isolada nunca aumenta score | **NÃO — no cálculo. SIM — na leitura** | Nenhuma rota altera score, domínio, estágio ou suficiência. **Mas** pôr habilitador dentro do card de prática-alvo cria a leitura "adotar o produto = atingir o nível". O antídoto já existe e é congelado: `TGT_DISCLAIMER` (`ui_target_v32.js:4`) — "A adoção de tecnologia, isoladamente, não altera a maturidade". Requisito: o disclaimer permanece **na mesma superfície** que os habilitadores, e o habilitador nunca é apresentado como o caminho para o delta |
| **INV-9** boundary legível por máquina | **SIM — e é o portão caro** | Ver "Cross-check das specs seladas" |
| **INV-8** derivados nunca serializados | Guarda-corpo | Nenhum habilitador, rótulo ou lista de ausência entra na sessão; tudo recomputa no import |
| **INV-1** engine byte-idêntico | **NÃO — se P2 for adotada** | Nenhuma rota recomendada toca `engine_v32.js`. Ver P2 |
| **INV-6**, **INV-10** | Rotina | Refinamento operacional intocado; PT-BR em doc, nomes de código exatos |

### Cross-check das specs seladas (5º item obrigatório) — **primeira aplicação**

Fonte: `.claude/verify/current_phase.json:18-25` → `specs_normativas` tem **uma**
entrada: `specs/PHASE_5_0_REV_B.md`, sha `4f1583c7…04619b`, escopo "superfícies 5.0
congeladas". Fase corrente 5.2 `SELADA`; `proxima_fase` `NAO_ABERTA`.

**Resultado positivo — a spec selada NOMEIA os dois arquivos que esta demanda toca:**

- `specs/PHASE_5_0_REV_B.md:1613-1620` — §29.4 "Protegidos (lista nominal; edição
  proibida nesta fase)" inclui, textualmente, `ui_v32.js` e `ui_target_v32.js`
  (`:1616`), além de `engine_v32.js` e da Camada 1 (`:1615`).
- `specs/PHASE_5_0_REV_B.md:1629` — §29.5: "**Nenhuma superfície de print/PDF**
  (protegidas; §23)". O item 8 no card atinge `__uxTargetPrintHTML`
  (`ui_target_v32.js:336-377`), que é print.
- `specs/PHASE_5_0_REV_B.md:1638-1641` — o rito declarado para requisito que toque
  protegido: `STOP → classificar → abrir microfase dedicada → revisão independente`.

**Resultado negativo — o que o cross-check NÃO encontrou:**

- A §29.4 **não** nomeia `ui_p52_workspace_v32.js`, `ui_journey_v32.js` como
  criados depois, nem qualquer módulo P52 — eles nasceram fora da lista fechada
  (`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md:31`).
- Nenhuma spec selada trata de **recomendação, catálogo, `MAP`, `OFFERINGS`,
  habilitador ou modo legado**. A §UAT-07 (Phase 5.1) que governa
  `QS_GAP_SUPPORT` **não é spec selada em `specs_normativas`**: vive apenas como
  âncora citada dentro do oráculo (`tests_p50_core.js:3339-3344`). Registro o
  resultado negativo porque ele importa: **não há diretriz normativa que arbitre as
  duas doutrinas de recomendação.** O vão não contraria nenhuma spec — ele existe
  porque nenhuma spec o cobriu.

**Reconciliação (o que torna a demanda possível):**
`.claude/verify/boundary.json:9-14` — a lista legível por máquina (autoridade da
INV-9) contém **apenas** `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`,
`harness_m41_v313.js`, `v3_1_3_functional_snapshot.json`. `ui_v32.js` e
`ui_target_v32.js` **não** estão lá.
`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md:5,18-19,29` registra que 5.1 e 5.2
já editaram esses arquivos sem revisão de spec, e que o documento existe para tornar
"a boundary REAL legível".

**Mas há um terceiro portão, vivo e executável, que decide na prática:**
`tests_p50_core.js:82` — o mapa `PROTECTED` (gate `P50-GOV1`) pina o SHA-256 de
`ui_v32.js` (`:158`) e de `ui_target_v32.js` (`:256`). Editar qualquer um **falha o
gate** até que o pin seja atualizado com autorização declarada no próprio comentário.
E o precedente imediato é explícito: `tests_p50_core.js:132-141` registra que a 009
só pôde editar porque **o proprietário autorizou nominalmente no chat em 2026-08-28**
("Autorizo nominalmente a edição dos quatro arquivos para a 009"), e que a
autorização "é NOMINAL, por arquivo, e vale **só para a 009**: não amplia a boundary
para outra demanda nem para outro arquivo" (`:137-139`).

> **ESCALAR (P11).** A 010 **não tem** autorização nominal §29.4. A delegação do
> proprietário de 2026-08-29 cobre decisões de produto; **não consta** que cubra
> conceder autorização nominal de boundary — e o texto do precedente diz o
> contrário, ao restringir a anterior à 009. Recomendação: **parar antes da Fase 1**
> e obter do proprietário, no chat, autorização nominal para `ui_v32.js` e
> `ui_target_v32.js` na 010. Sem ela, a demanda não passa da spec.

### Desafio ao pedido

**Item 4 — "não há nenhuma recomendação para automação / endpoint / visibilidade de
rede / superfície externa".** A premissa de que o catálogo não cobre está errada e a
009 já registrou: `MAP` (`quickscan_secops_soccmm_v3_1_3.html:420-467`) liga
`automation`→FortiSOAR (`:445-447`), `endpoint`→FortiEndpoint (`:451-453`),
`network-visibility`→FortiNDR (`:454-456`), `external-surface`→FortiRecon
(`:460-462`) — **os quatro pedidos nominais, e para os DOIS níveis de severidade**
(`s:2` e `s:1`), em **15 de 15** qids. O catálogo do engine também tem os quatro
(`fortisoar`, `fortiendpoint`, `ndr-family`, `fortirecon`).
O que falta não é catálogo: é **a superfície certa consultar uma fonte que esteja
ligada naquele estado de sessão**.
**Limite honesto mantido (P5 da 009): FortiNAC não existe em nenhuma camada** e
FortiSIEM não está vinculado a `network-visibility` (está em `logs` e
`detection-lifecycle`, `:442-450`). Cobrir essas duas menções exigiria Camada 1
(Porta B) ou tabela curada nova — **fora**.

**A rota UI-only ainda vale? A Porta B continua recusada?** Sim para as duas —
e o vão **fortalece** a recusa, não a enfraquece:

1. O engine está **certo**. `CONTEXT_NOT_INFORMED` sob `UNSET` é a doutrina que o
   produto promete ao leitor, na própria string congelada: "nenhum produto é
   inferido sem contexto" (`ui_v32.js:615`). Fazer `classify()` emitir candidato sob
   `UNSET` destruiria a definição de *Whitespace* do `CONTEXT.md:44-47` e faria o
   relatório mentir em todas as superfícies de uma vez, para consertar uma de.
2. O defeito **não é do engine nem da Camada 1**: é da **arbitragem** entre os dois,
   que vive em `ui_v32.js` — camada editável (sob P11). Porta B seria pagar o rito
   mais caro do projeto para consertar código que não é o culpado.
3. **O que mudou desde a 009**: a 009 recomendou R1 (ler o `MAP` no card) tratando o
   problema como *ausência*. O problema é de *subtração*. R1 sozinha **não fecha o
   vão** — ela adiciona conteúdo ao card de prática-alvo e deixa intactas a supressão
   indevida das prioridades, a frase falsa de `:615` e a mutilação do `renderedP`.
   R1 continua **necessária** (o card é mudo), mas deixa de ser **suficiente**.

**A rota nova que a 009 não tinha como enxergar — e a terceira doutrina.**
Existe, já no produto, uma regra que resolve exatamente "como nomear produto quando
o contexto não foi declarado": `qsGapSupportHTML` (`ui_v32.js:978-1002`, Phase 5.1
§UAT-07). Sob contexto não declarado ela **lista** as opções e diz
"exigem **validar aderência** antes de qualquer recomendação" (`:994`); sob contexto
declarado, muda o texto e explica de onde veio (`:1000`). **É a doutrina correta**, e
está viva — só que **apenas no PDF** e **apenas em 4 dos 15 qids**, travada pelo
oráculo `QIDS_AUTORIZADOS` (`tests_p50_core.js:3344`, que **lança** para qid fora da
lista, `:3348-3349`).
Não proponho estender a **tabela** (isso reabre §UAT-07). Proponho **reusar a
regra**: `MAP` como catálogo (cobertura 15/15, já congelado e já publicado na mesma
tela) + o vocabulário de UAT-07 (**a validar**, nunca *apoio direto*) quando o
contexto não foi declarado.

#### Rotas — custo real, revisado

| Rota | O que faz | Toca | Rito | Parecer |
|---|---|---|---|---|
| **V1 · predicado da supressão passa a ser "há substituto"** | `renderBlocks` deixa de decidir por `isLegacyModeV32()` e passa a ocultar a recomendação congelada só quando a camada V3.2 tem, de fato, o que pôr no lugar | `ui_v32.js` (`:235`, `:277`) | §29.4 nominal (P11) + repin `P50-GOV1` + gate novo | **Recomendada.** Fecha o vão na origem, sem catálogo novo, sem casamento de texto, sem engine. Deixa de existir estado em que declarar contexto subtrai conteúdo |
| **V2 · `MAP` como fonte do habilitador no card, rotulado "a validar" sob UNSET** | `tgtEnablersHTML` soma, aos candidatos do engine, os itens de `MAP[qid].lv[nível ATUAL].c`, com rótulo derivado do estado de contexto (UAT-07) | `ui_target_v32.js` (só **lê** a Camada 1) | §29.4 nominal (P11) + repin + gate novo | **Recomendada.** É a R1 da 009 com a doutrina de rótulo corrigida. Atende os 4 pedidos nominais e cobre 15/15 |
| **V3 · `#v32base` vira aviso único (bloco de ausência)** | "Leitura base — contexto tecnológico não informado" (`ui_v32.js:669-672`) deixa de ser N cards e vira um aviso com a lista das capabilities afetadas | `ui_v32.js` | idem | **Recomendada.** Aplicação direta do verbete *Bloco de ausência* já canônico (`CONTEXT.md:72-76`) e do precedente já entregue pela 009 (`tgtAbsenceHTML`, `ui_target_v32.js:227-248`) |
| **V4 · dissolver `#p52-sec-support`** | A seção "Formas de apoio" deixa de existir; tudo migra para o card | `ui_p52_workspace_v32.js` + 3 gates | Âncora normativa nova + ratificação | **Recuso nesta demanda.** Ver P12 |
| **V5 · estender `QS_GAP_SUPPORT` para os 11 qids restantes** | Paridade de apoio-junto-ao-gap no PDF | `ui_v32.js:937` + `tests_p50_core.js:3344` | Reabre §UAT-07 (fase 5.1 selada) | **Recuso.** Reusar a *regra* (V2) custa zero; estender a *tabela* reabre diretriz |
| **V6 · engine, Porta B** | `classify()` emite candidato sob `UNSET` | `engine_v32.js` (`frozen`) | Porta B: spec + auditoria independente humana + repin M41 | **Recuso, com mais convicção que a 009.** Ver desafio, pontos 1–2 |

**Recomendação: V1 + V2 + V3, na mesma demanda. V4, V5 e V6 fora.**

### Os itens 6 e 8 são a mesma decisão que o 4? — confirmação e refutação

A 009 registrou (`refinement.md:118-122`) que **dissolver "Formas de apoio" cancela
o item 4**. **Confirmo o mecanismo e refino em três pontos:**

1. **Confirmado, e mais forte do que a 009 sabia.** `#p52-sec-support` não é só
   "onde os produtos apareceriam": no vão ela é a **única** seção que ainda poderia
   voltar a mostrá-los, porque é para lá que `p52Classify` (`ui_p52_workspace_v32.js:677`)
   manda todo `.section-title` que não seja de prioridades nem de gaps. Dissolvê-la
   antes de fechar o vão remove a superfície e o conserto de uma vez.
2. **Refutação parcial — dissolver custa mais do que o item 4.** A seção também
   abriga "Capabilities a validar" (`quickscan_…:1002-1004`, as respostas NA) e
   "Não priorizados neste screening" (T3, `:1005-1007`) — conteúdo que **não é
   recomendação de produto** e que o cliente não pediu para remover. E colide com
   **três gates**: `P52-REC1` (`tests_p52_layout.js:512-515`, que lança
   "seção de apoio ausente"), `P52_RELEASED_ORDER` e `P52_BLOCKED_ORDER`
   (`tests_p52_layout.js:68-71`), ambas com `support` na lista.
3. **Refutação nova — o item 8, lido ao pé da letra, colide com §UAT-07.** O cliente
   pediu convergência entre "**Gaps de maturidade**" e "formas de apoio". Se
   "convergir" significar pendurar o apoio no card `.finding` do gap, isso é
   exatamente o que `[data-pr-gap-support]` faz no PDF — e o oráculo lança para
   qualquer qid fora dos quatro autorizados (`tests_p50_core.js:3348-3349`). A
   releitura do analista ("no card de prática-alvo, não em seção") é a **única**
   forma de convergência que não reabre diretriz de fase selada. Vale registrar que
   isso **muda o pedido**: prática-alvo ≠ gap.

**Item 6 — separo em dois, porque não são a mesma decisão:**

- **6a · "Apoio nas prioridades declaradas · contexto V3.2"** (`ui_v32.js:661`) —
  **não decidir agora, é a jusante do vão.** Hoje esse bloco renderiza
  `baseCardHTML` (o card da frase falsa, A4) para as capabilities prioritárias. A
  redundância que o cliente sentiu **é sintoma**: ele leu duas vezes a mesma
  prioridade porque a segunda vez não trazia conteúdo, só a promessa de uma leitura
  oculta. Com V1 aplicada, o mesmo bloco passa a conviver com a recomendação
  congelada visível — e a decisão "remover ou manter" muda de premissa. Recomendo
  **manter os cards que acrescentam (VALIDATE e CONTEXTUAL) e remover o sufixo de
  versão do título** (P7 da 009, adotada), e reavaliar a remoção total **depois** de
  V1, com evidência de tela.
- **6b · "Leitura base — contexto tecnológico não informado"** (`ui_v32.js:671`) —
  **decidir agora, e é V3.** É um *bloco de ausência* clássico: N cards cujo único
  conteúdo possível é dizer que não houve declaração. A regra já é canônica
  (`CONTEXT.md:72-76`) e o precedente de execução já existe, entregue pela 009
  (`tgtAbsenceHTML`). O corolário da 009 continua valendo e fica **atendido**:
  suprimir sem substituir apagaria a pista; o aviso único **com a lista** preserva
  a pista e devolve o espaço.

**Conclusão da pergunta:** os itens 4, 6b e 8 são **a mesma decisão de produto**
(onde e como o habilitador aparece) e ficam juntos. O item 6a é **consequência** do
item 4 e deve ser reavaliado depois dele, na mesma demanda. E o item 8 só é
executável na sua metade **aditiva** (habilitador no card); a metade **subtrativa**
(dissolver a seção) é outra decisão, com outro portão — P12.

### Alternativa mais simples considerada

**"Só V2" (a R1 da 009 pura): pôr o `MAP` no card e não mexer em mais nada.**
Mais barata, e **não basta**. Deixa viva a frase falsa de `ui_v32.js:615`, deixa as
prioridades sem apoio congelado, deixa o `prod-mini` órfão (A3) e deixa intacto o
fato de que declarar contexto ainda subtrai conteúdo. Entregaria mais texto num
relatório que continua se contradizendo — que é a pior combinação para um documento
cuja tese é "diagnóstico honesto".

**"Só V1": fechar o vão e não tocar o card.** Também não basta: devolve a
recomendação congelada, mas o card de prática-alvo — a superfície onde o cliente
estava, e o único lugar prospectivo do relatório — continua mudo, que é o item 4
literal.

### Conflito com decisão registrada

| Decisão registrada | Item | Encaminhamento |
|---|---|---|
| **§29.4** `specs/PHASE_5_0_REV_B.md:1613-1620` — `ui_v32.js` e `ui_target_v32.js` protegidos; e o precedente de autorização nominal restrita à 009 (`tests_p50_core.js:132-141`) | V1, V2, V3 | **ESCALAR (P11)** — autorização nominal própria da 010, do proprietário, no chat, antes da Fase 1 |
| **§29.5** `:1629` — nenhuma superfície de print/PDF | V2 (o card também imprime, `ui_target_v32.js:364`) | A 009 já imprimiu por esta via (`tgtAbsenceHTML(semCtx,false)`, `:365`) sob autorização nominal. Mesmo rito, mesma escalação |
| **Ordem canônica de leitura**, âncora ratificada pelo proprietário em **2026-08-27** e residente em `specs/009-leitura-do-relatorio/spec.md` (`ui_p52_workspace_v32.js:578-587`; oráculos em `tests_p52_layout.js:63-71`) | V4 | Remover `support` da ordem **substitui uma âncora que o proprietário ratificou há três dias**. **ESCALAR (P12)** — e a recomendação é não fazer |
| **P52-REC1** `tests_p52_layout.js:512-539` — a seção existe, é íntegra, e **nenhum nome de produto pode estar embutido no owner de layout** (`:538-539`, `/Forti[A-Z]/`) | V2, V4 | Consequência dura e **inalterada**: o habilitador não pode ser implementado em `ui_p52_workspace_v32.js`. Vive em `ui_target_v32.js` (card) e `ui_v32.js` (arbitragem) |
| **§UAT-07 / `QIDS_AUTORIZADOS`** `tests_p50_core.js:3339-3349` | V5, item 8 literal | Não reabrir. Reusar a regra de rótulo, não a tabela |
| **`CONTEXT.md:44-47`** definição de *Whitespace* (gap + NONE + suficiência) | V6 | V6 recusada; a definição permanece intacta |
| **Gates D009-*** entregues pela 009 (aviso único de ausência, S1–S4 de `tgtEnablerState`, `ui_target_v32.js:199-206`) | V2 | V2 **altera o insumo** de `tgtEnablerState`: se o `MAP` passa a alimentar `items`, práticas hoje em S2 migram para S1 e **saem do aviso único**. O aviso não pode virar órfão nem contradizer o card. Regressão obrigatória sobre D009-UNS1/C14 |
| **`design-decisions.md`** | — | **Não existe** neste worktree (verificado). O corpus de decisões vive em `.claude/rules/design-decisions.md` (R-rule) e nas specs. Registro o resultado negativo para que a Fase 1 não cite arquivo inexistente |

---

## Sistema real

Tudo abaixo foi lido no source desta worktree (`phase5-010`, de `origin/develop`
`c51e60f`, com a 009 já mergeada). Classes de proteção conferidas em
`.claude/verify/boundary.json`.

**Arbitragem e vão** — `engine_v32.js:305-311` (`isLegacyModeV32`, quatro condições);
`engine_v32.js:552` (legado ⇒ `contexts:{}`); `ui_v32.js:235-237` e `:277`
(as duas chamadas de `hideLegacyRecommendation`); `ui_v32.js:164-194` (a varredura);
`ui_v32.js:109-110` (`HIDE_EYEBROWS`, os três títulos); `ui_v32.css:2`
(`.v32-hidden{display:none !important}` — logo, some **também no papel**).

**Catálogo congelado** — `quickscan_secops_soccmm_v3_1_3.html:262-276` (`PRODUCTS`,
13 itens, com `u:` de página oficial); `:420-467` (`MAP`, 15 qids × 4 níveis, `s:2`
e `s:1` com candidatos, `s:0` vazio nos níveis 2–3); `:519` (`candidatesOf`, dedup
por produto entre níveis 0 e 1); `:860-879` (`apoioBlock`); `:859` + `:868`
(`renderedP` e o `.prod-mini`); `:522-533` (`computeFindings` — **não consulta
suficiência**); `:534-571` (`buildTiers`, T2/T3).

**Motor V3.2** — `engine_v32.js:392-418` (`classify`); `:436-469`
(`resolveCandidates`, só sob whitespace); `:551-674` (`buildRecommendationContext`);
`:653-665` (serviços anexados fora do `switch`, só por `hasGap` — a assimetria A5);
`:402-404` (whitespace exige `assessmentSufficient()`).

**Card de prática-alvo (já com a 009)** — `ui_target_v32.js:249-263`
(`tgtEnablersHTML`; a frase de S3/S4 agora em `:260`, o defeito de `:166` **está
corrigido**); `:199-206` (`tgtEnablerState`, S1–S4); `:227-248` (`tgtAbsenceHTML`,
aviso único com dois ramos de alcance); `:133-139` (o passe único que deriva
`semCtx`); `:362-365` (o mesmo no papel); `:4` (`TGT_DISCLAIMER`).

**Terceira doutrina** — `ui_v32.js:921-936` (o cabeçalho normativo de UAT-07, que já
escreve as regras que esta demanda precisa: "quando falta contexto declarado, diz
'validar aderência' em vez de recomendar", `:930-931`); `:937-969`
(`QS_GAP_SUPPORT`, 4 qids); `:978-1002` (`qsGapSupportHTML`, os dois ramos);
`:1013-1022` (`qsHowToReadHTML` — a caixa "Como interpretar" já promete ao leitor
que "as **recomendações são possibilidades** condicionadas ao contexto informado").

**Identidade dos dois catálogos — divergência que a 009 não registrou.**
`PRODUCTS` é chaveado por nome (`"FortiSOAR"`, `quickscan_…:265`); `OFFERINGS` é
chaveado por id minúsculo (`fortisoar`, `engine_v32.js:113`). `iconFor`
(`ui_v32.js:533-540`) resolve por `ICON_MAP_V32[itemId]`, que mapeia **id do
offering → chave de ícone** (`ui_icons_v32.js:3`: `"fortisoar": "FortiSOAR"`). Logo,
um habilitador vindo do `MAP` com `itemId="FortiSOAR"` **cai no fallback de
iniciais** (`ui_v32.js:538-540`), enquanto o mesmo produto vindo do engine mostra o
ícone real. **Consequência de produto:** sem uma tabela de equivalência declarada, o
mesmo produto pode aparecer duas vezes no mesmo card, com dois nomes e dois
tratamentos visuais. É requisito, não detalhe: *um habilitador aparece no máximo uma
vez por card, com um nome só*.

**Layout** — `ui_p52_workspace_v32.js:594-604` (`P52_SECTIONS`, ordem pós-009:
exec, priorities, detail, gaps, target, context, **support**, evidence, actions);
`:633-642` (`p52OrderFor`, exceção de gate fechado); `:658-688` (`p52Classify`;
`:667` manda `#v32panel` para `context`; `:677` manda todo título não-reconhecido
para `support`). Divergência menor registrada: `tests_p52_layout.js:63-64`
(`P52_CANONICAL_ORDER`) tem `evidence` antes de `support`, ordem inversa à de
`P52_SECTIONS`; o literal **não é usado** pelos gates — quem julga é
`expectedOrder()` (`:72-75`) com `P52_RELEASED_ORDER`/`P52_BLOCKED_ORDER`. É
divergência doc×código inerte, mas confunde quem lê o oráculo. **Insumo para o
`qa-engineer`, não escopo desta demanda.**

**Pendência da 009 (P15) — o estado do vão é reproduzível sem a sessão perdida.**
A sessão real de 2026-08-27 continua não localizada. **Mas ela deixou de ser
necessária**: o vão é atingido deterministicamente por *landscape inteiro `UNSET` +
qualquer um de* {uma resposta de arquitetura fora do default, um sinal `true`, uma
plataforma declarada} (`engine_v32.js:305-311`), com prioridades declaradas e gap
alto nas capabilities pedidas. Recomendo fechar a pendência por **fixture
sintética** desse estado exato, e considerar o relatório do cliente como
corroboração, não como fonte. Ver P10.

---

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| **C1** | **Legacy puro** (nada declarado: `isLegacyModeV32()===true`) | Recomendação congelada **visível** — como hoje. Com V2, o card de prática-alvo passa a listar habilitadores do `MAP`, rotulados **a validar**. Risco a resolver na spec: o mesmo produto aparece no card **e** no `.apoio-block` visível. Não é duplicação ilegítima (superfícies e funções distintas), mas exige texto que a explique, ou o leitor conta duas recomendações onde há uma |
| **C2** | **Contexto parcial — o vão** (algo declarado, capabilities do gap ainda `UNSET`) | **O estado que esta demanda existe para eliminar.** Com V1: se a camada V3.2 não tem substituto para apresentar, a recomendação congelada **permanece visível**. Nunca mais existe estado em que declarar contexto reduz o conteúdo do relatório. E a frase "Leitura V3.1.3 preservada" (`ui_v32.js:615`) volta a ser verdadeira, ou é reescrita |
| **C3** | **Contexto parcial assimétrico** (capability A com `NONE`+whitespace, capability B `UNSET`) | O predicado de sessão de V1 dá "há substituto" ⇒ oculta o congelado ⇒ **B volta a ficar muda**. É o resíduo conhecido de V1. Fechado por V2 (o card de B lista o `MAP` rotulado *a validar*) e sinalizado por V3 (B aparece nominalmente no aviso único). **A spec deve declarar este resíduo, não escondê-lo** |
| **C4** | **Contexto completo com `NONE` declarado + suficiência** | Whitespace: candidato DIRECT do engine (`engine_v32.js:570-572`). O `MAP` **não** deve somar item novo aqui — a fonte com contexto ganha. Regra: *quando há candidato do engine para a capability, o `MAP` só pode deduplicar, nunca acrescentar*. Sem isso, a rota mais informada produz mais ruído que a menos informada |
| **C5** | **`NONE` declarado SEM suficiência** | `classify` devolve `NEEDS_VALIDATION` com `insufficientEvidence` (`engine_v32.js:404`). Nada de apoio direto. O card, se listar `MAP`, lista **a validar** — nunca apoio direto. UNSET e NONE-sem-suficiência **não podem** produzir o mesmo texto: o primeiro é "você não informou", o segundo é "você informou e falta evidência de maturidade" |
| **C6** | **Suficiência FECHADA** | Nenhum habilitador publicado no card — mantém a decisão B2 da 009 e o `gateNote` de `ui_target_v32.js:129` ("nenhum score, estágio, valor por domínio ou delta é publicado"). **Atenção dura:** a Camada 1 nomeia produto com gate fechado (`quickscan_…:933`, `computeFindings` sem `suff`). V1 **não pode** ampliar essa exposição, e V2 **não pode** importá-la. O gate de suficiência é da metodologia; a Camada 1 é precedente congelado, não licença |
| **C7** | **Sem prioridades declaradas** (`hasPrio===false`) | A Camada 1 troca para "Gaps observados na sessão" + "Como a Fortinet pode apoiar agora" (`quickscan_…:991-996`). O título de apoio **também** está em `HIDE_EYEBROWS` — logo o vão atinge igualmente a sessão sem prioridades. V1 tem de cobrir os dois ramos, não só o de prioridades |
| **C8** | **Sem cenário-alvo** | `tgtSection` renderiza "Nenhum cenário-alvo foi definido" (`ui_target_v32.js:96-101`) e **não há card**. Se o habilitador viver **só** no card (item 8 na forma subtrativa), esta sessão fica sem nenhum habilitador em lugar nenhum. **É o argumento decisivo contra V4** |
| **C9** | **`target == current`** | `setTarget` aceita igual (`:12-21`); `revalidateTargets` remove depois (`:38-48`). A prática pode desaparecer entre dois renders. O habilitador não pode virar órfão nem deixar o aviso único citando prática que já saiu — a 009 resolveu isso com o passe único (`:130-133`); V2 tem de **preservar** esse passe, não criar um segundo |
| **C10** | **Zero gaps, com suficiência** | Banner "Nenhum gap relevante identificado" (`quickscan_…:926-928`). Nenhum habilitador, nenhum aviso de contexto pendente: sem gap, o contexto não faria diferença. `MAP[qid].lv[2|3].c` é vazio, então V2 não produz nada por construção — confirmar como propriedade, não como acaso |
| **C11** | **Zero gaps, sem suficiência** | Banner distinto (`:930-931`). Nunca colapsar com C10 |
| **C12** | **Resposta NA ("a validar")** | Não é gap, não gera habilitador (`computeFindings:526`). A capability vai para `NEEDS_VALIDATION`. **E é aqui que mora o achado A6**: hoje a existência de uma resposta NA decide, por contiguidade de DOM, se o T3 aparece. Comportamento esperado: a visibilidade de T3 **não** depende de haver resposta NA |
| **C13** | **Gap moderado (`sev===1`)** | O `MAP` **tem** candidatos para `s:1` em todos os 15 qids, e o bloco congelado **não** os renderiza (só `sev===2`, `:901`/`:933`), remetendo ao T2 (`:904-906`) — que o vão oculta. Mantida a decisão P4 da 009 (habilitador no card cobre alto **e** moderado), com o custo declarado: passa a haver, no card, produto que a seção congelada cala. Com V1 aplicada, o T2 volta a ser visível e a assimetria diminui |
| **C14** | **Capability com `landscapeEnabled:false`** (`soc-governance`, `soc-staffing`, `soc-skills`) | Estado S4 da 009 (`ui_target_v32.js:203`): mantém a frase substantiva e **nunca** entra no aviso — não há contexto a informar. V2 não pode empurrá-las para o aviso ao mudar o insumo de `tgtEnablerState` |
| **C15** | **Impressão / PDF** | `beforeprint` expande **todos** os `<details>` (`quickscan_…:1065`), mas `.v32-hidden` é `display:none !important` (`ui_v32.css:2`) — logo **a supressão do vão vale também no papel**, e o `<details>` T3, se ocultado por A6, não reaparece na impressão. Toda decisão desta demanda precisa dizer o que acontece no papel |
| **C16** | **Um produto em duas fontes** | Divergência de namespace (`PRODUCTS` por nome × `OFFERINGS` por id): sem tabela de equivalência declarada, FortiSOAR pode aparecer duas vezes no mesmo card, com ícone real numa e iniciais na outra. Requisito: **um habilitador, uma vez, um nome** |
| **C17** | **Serviço sob `UNSET`** | Serviços continuam anexados (`engine_v32.js:653-665`) e hoje disparam S1, mantendo a prática **fora** do aviso de ausência. Com V2, o card passa a ter serviço **e** produto-a-validar. A frase do card não pode tratar os dois como o mesmo tipo de item |
| **C18** | **Limpar contexto tecnológico** | `#v32clear` chama `resetLandscapeToUnset()` + `renderBlocks` (`ui_v32.js:299`) e o gate U7 (`tests_ui_m31.js:129-141`) exige que o apoio congelado volte visível. **V1 altera o predicado que esse gate observa** — U7 tem de continuar verde, e é regressão obrigatória |

---

## Vocabulário

**Proposto, não gravado.** Os quatro verbetes abaixo entram no `CONTEXT.md` (R12) no
fechamento do portão, ao fim da seção "Metodologia (produto)", sem reordenar nem
reescrever verbete existente. Enquanto não entrarem, a Fase 1 não pode usá-los.

```md
**Habilitador a validar**:
Habilitador listado a partir do gap e do catálogo congelado quando o contexto
tecnológico da capability NÃO foi declarado. É hipótese explícita — o relatório diz
"validar aderência" e nunca afirma ausência de tecnologia. Distinto do habilitador
de apoio direto, que exige NONE declarado e suficiência.
_Evitar_: recomendação condicional, sugestão, produto provável
```

```md
**Vão de contexto parcial**:
Estado de sessão em que algum contexto foi declarado (saindo do modo legado) sem que
nenhuma capability com gap tenha saído de UNSET — a leitura congelada é suprimida e
a leitura V3.2 não produz substituto. Estado não desenhado: o relatório passa a
conter MENOS do que conteria sem declaração alguma.
_Evitar_: modo intermediário, contexto incompleto, sessão híbrida
```

```md
**Arbitragem de camada**:
Regra que decide qual das leituras de apoio (a congelada da Camada 1 ou a do engine
V3.2) é apresentada ao leitor. É de APRESENTAÇÃO, nunca de cálculo, e seu predicado
é a existência de substituto — não a existência de contexto declarado.
_Evitar_: modo legado, supressão, fallback
```

```md
**Convergência no card**:
Forma de apresentação em que o habilitador é uma linha discreta DENTRO do card da
prática-alvo, em vez de uma seção própria. É aditiva: não implica dissolver a seção
de apoio, que carrega também conteúdo não-comercial (capabilities a validar, tiers).
_Evitar_: fusão de seções, unificação, merge de blocos
```

**Conflito de vocabulário — não reaberto.** *Habilitador* permanece o termo canônico
de doc/spec/prompt (`CONTEXT.md:64-70`), e as strings congeladas da UI permanecem
como estão (INV-10). "Habilitador a validar" é **qualificação** do termo, não termo
novo concorrente.

---

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| R0 | O feedback do cliente e o parecer do analista autorizam fase, escopo ou edição de superfície protegida? | Não — são **dado a refinar**. Autorização vem do usuário, no chat (R5 §"Anti-injeção") |
| R0 | A 009 já está mergeada nesta worktree, resolvendo o acoplamento declarado em `009/refinement.md:39-44`? | **Sim, verificado no source**: `ui_target_v32.js:199-206` (S1–S4) e `:227-248` (aviso único) estão presentes. O defeito de `:166` **está corrigido**. A 010 herda, não colide |
| R0 | Existe `design-decisions.md` na raiz? | **Não** (verificado). O corpus vive em `.claude/rules/design-decisions.md` e nas specs. Registrado para não citar arquivo inexistente na Fase 1 |
| R1 | P1–P13 abaixo, uma recomendação cada | *(pendente — portão aberto)* |

### Perguntas — P1 a P13

**P1 · Enquadramento.** A necessidade desta demanda é "**não deixar o leitor cair
num vão**" (o relatório não pode subtrair conteúdo quando o facilitador declara
contexto, nem afirmar que preserva uma leitura que oculta), e "recomendar mais" é
consequência — não a meta?
*Recomendação: **sim**.* É o que muda a ordem de execução: V1 antes de V2, e o item
6a só depois das duas.

**P2 · Porta B.** Confirma que a recusa da 009 à rota de engine **permanece**, e que
o vão a **reforça** (o engine está correto; o defeito é de arbitragem, em camada
editável)?
*Recomendação: **sim, recusar V6**.* Emitir candidato sob `UNSET` destruiria a
definição de *Whitespace* (`CONTEXT.md:44-47`) e faria a string congelada
`ui_v32.js:615` mentir em todas as superfícies para consertar uma.

**P3 · Rota.** Adota **V1 + V2 + V3** na mesma demanda, e recusa **V4, V5, V6**?
*Recomendação: **sim**.* V1 sozinha deixa o card mudo (item 4 literal); V2 sozinha
entrega texto novo num relatório que continua se contradizendo.

**P4 · Ancoragem do habilitador.** O habilitador do card lê `MAP[qid].lv[**nível
ATUAL confirmado**]`, nunca o nível-alvo?
*Recomendação: **nível atual** — confirma P3 da 009.* Ler o alvo faz o produto virar
função da ambição e tensiona a INV-5; e o `TGT_DISCLAIMER` (`ui_target_v32.js:4`)
ficaria contraditado na mesma superfície.

**P5 · Rótulo sob UNSET.** Sob contexto não declarado, o habilitador aparece como
**"a validar"** (regra já viva em `ui_v32.js:990-995`), nunca como "apoio direto"?
*Recomendação: **sim**.* É a única forma de listar produto sem violar
"nenhum produto é inferido sem contexto" — reusa a **regra** de §UAT-07 sem tocar a
**tabela** que a diretriz selou.

**P6 · Precedência entre fontes.** Quando o engine já produziu candidato para a
capability (C4), o `MAP` **só deduplica, nunca acrescenta**?
*Recomendação: **sim**.* Caso contrário a sessão mais bem informada gera mais ruído
que a menos informada — inversão que destrói o incentivo a declarar contexto, que é
justamente o que o produto quer estimular.

**P7 · Suficiência.** O habilitador do card é suprimido sob gate de suficiência
FECHADO, mesmo que a Camada 1 congelada nomeie produto nesse estado
(`quickscan_…:933`)?
*Recomendação: **sim, suprimir**.* A Camada 1 é precedente congelado, não licença
para importar sua propriedade mais fraca para superfície nova. Mantém B2 da 009 e a
coerência com `ui_target_v32.js:129`.

**P8 · Item 6a.** "Apoio nas prioridades declaradas · contexto V3.2"
(`ui_v32.js:661`): remove-se a seção inteira, remove-se só o sufixo de versão do
título, ou adia-se?
*Recomendação: **remover só o sufixo de versão e manter os cards que acrescentam
(VALIDATE, CONTEXTUAL), reavaliando a remoção total após V1 com evidência de
tela**.* A redundância que o cliente sentiu é sintoma do vão; decidir antes de V1 é
decidir sobre outra tela.

**P9 · Item 6b.** "Leitura base — contexto tecnológico não informado"
(`ui_v32.js:671`) vira **aviso único com a lista nominal** das capabilities
afetadas?
*Recomendação: **sim**.* Aplicação direta do verbete *Bloco de ausência*
(`CONTEXT.md:72-76`) e do precedente entregue pela 009. Sem a lista, some a pista de
por que o relatório ficou pobre — o corolário da 009 continua valendo.

**P10 · Pendência P15 da 009.** Fecha-se a lacuna "vão não reproduzido em caso real"
por **fixture sintética** do estado exato, em vez de perseguir a sessão perdida?
*Recomendação: **sim, fixture**.* O estado é deterministicamente atingível
(`engine_v32.js:305-311`) e uma fixture é reexecutável para sempre; a sessão de
2026-08-27 vale como corroboração, não como fonte. A spec deve nomear a fixture como
critério de aceite.

**P11 · ESCALAR — autorização nominal §29.4.** `ui_v32.js` e `ui_target_v32.js` são
protegidos por `specs/PHASE_5_0_REV_B.md:1616` e pinados por `P50-GOV1`
(`tests_p50_core.js:158`, `:256`). A autorização da 009 é explicitamente restrita à
009 (`tests_p50_core.js:137-139`).
*Recomendação: **parar antes da Fase 1 e obter do proprietário, no chat,
autorização nominal para a 010**.* A delegação de 2026-08-29 cobre decisão de
produto; conceder boundary é outra natureza de ato, e o precedente registrado
restringe expressamente o alcance. **Não recomendo prosseguir sem ela.**

**P12 · ESCALAR — dissolver "Formas de apoio" (item 8, metade subtrativa).** Dissolver
`#p52-sec-support` remove também "Capabilities a validar" e o tier T3, quebra
`P52-REC1` (`tests_p52_layout.js:512-515`), exige nova ordem canônica
(`:68-71`) e **substitui uma âncora que o proprietário ratificou em 2026-08-27**.
*Recomendação: **não dissolver nesta demanda**; entregar o item 8 na sua metade
aditiva (*convergência no card*) e reavaliar a seção depois de V1, com evidência de
tela e com o proprietário presente.* Se ainda assim for para dissolver, **escalar** —
é troca de âncora ratificada, não decisão de execução.

**P13 · Achados para o backlog.** Os defeitos A4 (frase falsa sob vão), A3
(`prod-mini` órfão) e A6 (T3 oculto por contiguidade quando não há resposta NA)
viram achados `EA-*`?
*Recomendação: **sim, os três — com a alocação de id feita pelo `doc-writer` depois
de conferir a `develop`**, nunca aqui.* A série vai até `EA-7` nesta worktree
(`.claude/BACKLOG.md`), mas ids são alocados em branches que não se enxergam. A
cadeia arquivo:linha→efeito de cada um está na seção "O achado que muda o
enquadramento" e é o insumo suficiente. **A6 é derivado de leitura de source e
precisa de confirmação por execução pelo `qa-engineer` antes de virar achado.**

---

## Fora de escopo (explícito)

1. **Qualquer alteração em `engine_v32.js`** (`frozen`). V6 recusada; `classify()`,
   `resolveCandidates()` e `buildRecommendationContext()` permanecem byte-idênticos.
2. **Qualquer alteração em `quickscan_secops_soccmm_v3_1_3.html`** (`frozen`). A
   Camada 1 é apenas **lida** — `MAP`, `PRODUCTS`, `apoioBlock` e o `.why` sempre
   visível (`:865`) permanecem exatamente como estão. Nenhum rito de superfície
   congelada é aberto por esta demanda.
3. **Score, suficiência, limiar, tier, estágio e cenário-alvo.** Nenhum número muda;
   nenhuma regra de publicação muda; `computeTargetProfile` permanece puro.
4. **Recomendar produto a partir de ausência não declarada.** Sob `UNSET` o
   relatório continua sem afirmar que o cliente não tem tecnologia. Nenhuma rota
   adotada infere posse.
5. **FortiNAC** (inexistente em qualquer camada do catálogo) e o vínculo
   **FortiSIEM ↔ `network-visibility`** — mantidos fora, por P5 da 009.
6. **Estender `QS_GAP_SUPPORT`** além dos quatro qids de §UAT-07 — V5 recusada.
7. **Dissolver `#p52-sec-support`** e alterar a ordem canônica de leitura — V4
   recusada nesta demanda (P12).
8. **Reordenação do relatório impresso/PDF.** O papel **acompanha** as decisões de
   conteúdo (é a mesma função, `ui_target_v32.js:336-377`), mas nenhuma reordenação
   de seções de print entra aqui.
9. **Item 1 do cliente (tela de prioridade)** — demanda **011**.
10. **Mudança de invariante.** Nenhuma das dez é proposta para alteração.
11. **Escrever no `.claude/BACKLOG.md`.** A alocação de id `EA-*` é do `doc-writer`,
    depois de conferir a `develop` (P13).
