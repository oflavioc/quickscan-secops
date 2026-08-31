# Refinamento — 015-superficies-de-apoio

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.

Origem: itens **6a** e **8** do feedback do cliente de 2026-08-27 — os dois últimos
dos nove; os outros sete foram entregues pelas demandas 009, 010 e 011. Reunidos
por recomendação do `product-owner` no aceite da 010 ("são a mesma decisão —
quantas superfícies de apoio o relatório tem e quem nomeia produto em cada uma"),
mais o **achado nº 1** da devolutiva da 010 (duplicação de leitura no papel entre
`pr-gapsup` e `#pr-target` nos 4 qids de `QS_GAP_SUPPORT`), que a própria 010
criou. Data: **2026-08-31**. Worktree `phase5-015`, branch
`feature/015-superficies-de-apoio`, nascida de `origin/develop` `4f7c140`.

**Estado do portão: ABERTO.** Este documento levanta e recomenda; P1–P14 são
recomendações, não decisões. Duas (**P11**, **P12**) exigem ratificação do
proprietário e estão marcadas **ESCALAR**. Nada aqui aprova fase, dispensa
invariante ou autoriza edição de superfície protegida.

**Verbatim do cliente, preservado:**

- **6a** — *"A parte 'Apoio nas prioridades declaradas · contexto V3.2' me parece
  um pouco redundante e podemos avaliar se pode ser removida dos resultados."*
- **8** — *"Avaliar uma forma de convergência entre 'Gaps de maturidade' e 'formas
  de apoio', a não ser que isso torne a tela muito poluída."*

---

## Necessidade

**Quem usa.** O *leitor do relatório* — executivo do cliente, lê uma vez, não
conhece a metodologia — e o *facilitador* que vai defender o documento.

**O que muda.** Hoje o relatório tem **onze superfícies de apoio na tela**,
espalhadas por **quatro das nove seções canônicas**, alimentadas por **três
curadorias diferentes** que nunca foram reconciliadas entre si. O leitor não tem
como saber que "Apoio nas prioridades declaradas · contexto V3.2" e "Como a
Fortinet pode apoiar nas prioridades declaradas" — dois títulos **adjacentes**, em
seções consecutivas — são coisas diferentes; nem por que, no PDF, o mesmo gap de
`logs` recebe **duas listas de produtos com pertinência divergente**, a páginas de
distância. Depois desta demanda cada superfície diz o que entrega, e nenhuma
promete o que outra cumpre.

**O que NÃO muda, e é preciso dizer alto.** Nenhum conteúdo sai do relatório.
A medição abaixo mostra que as duas remoções pedidas — a seção do 6a e a fusão do
item 8 — **subtraem conteúdo** e **derrubam propriedades congeladas**. O pedido
do cliente é legítimo; a leitura literal dele, não.

**Por que agora.** A 010 exigiu que a decisão de 6a fosse tomada com evidência de
tela **pós-E18** (`specs/010-recomendacao-sem-vao/spec.md:588-594`), porque a V1
da 010 fez as duas leituras **coexistirem** na tela do vão. É a primeira vez que a
decisão pode ser tomada sobre a tela que o cliente terá — e não sobre a que ele
teve.

---

## Enquadramento de produto

### O que a medição diz, antes das rotas

**M1 · A redundância do 6a existe — e é de PROMESSA, não de conteúdo.**
Na ordem canônica (`ui_p52_workspace_v32.js:594-604`), `context` é a 6ª seção e
`support` a 7ª. `p52Classify` manda `#v32panel` inteiro para `context`
(`:667`) e todo `.section-title` não reconhecido para `support` (`:677`). O leitor
encontra, **em seções consecutivas e nesta ordem**:

| Ordem | Seção | Título do bloco | Fonte | O que entrega **sem contexto declarado** |
|---|---|---|---|---|
| 6ª | Contexto tecnológico | "**Apoio nas prioridades declaradas** · contexto V3.2" (`ui_v32.js:749`) | engine | estado de maturidade + *"Informe o contexto desta capability"* (`:636`) |
| 7ª | Formas de apoio | "Como a Fortinet pode **apoiar nas prioridades declaradas**" (`quickscan_secops_soccmm_v3_1_3.html:988`) | `MAP` + `PRODUCTS` | cards completos de produto (`:860-879`) |

Quatro palavras em comum, dois títulos seguidos, e — no estado do cliente — **só o
segundo entrega habilitador**. É exatamente "me parece um pouco redundante": ele
leu a primeira promessa, não recebeu nada, e recebeu na segunda.

**M2 · E a co-visibilidade dos dois títulos foi CRIADA pela 010.** Antes da V1, o
argumento de `hideLegacyRecommendation` era a constante `true`: declarar qualquer
contexto ocultava o bloco da 7ª seção, e o leitor via **um** dos dois. Hoje o
argumento é `hasSubstituteV32(lastCtx)` (`ui_v32.js:284`, `:674-682`) — e quando
não há substituto os **dois** ficam visíveis. A 010 corrigiu a subtração e, no
mesmo movimento, tornou o incômodo do 6a **mais frequente**, não menos. Este é o
dado novo que a evidência pós-E18 traz.

**M3 · Mas a seção do 6a NÃO é redundante — o que é redundante é um subconjunto
dos seus cards.** `#v32prio` (`ui_v32.js:750`) rende, por capability priorizada,
uma de quatro coisas (`renderCap`, `:730-733`):

| Estado | O que o card traz | Alguma outra superfície traz? |
|---|---|---|
| contexto declarado + gap | `capCardHTML` (`:593-616`): classificação, **ofertas** com escopo/elegibilidade/programa comercial, **serviços**, motivo declarado, "Por que apareceu" | **Não.** Os blocos por modo (`:751-756`) excluem as priorizadas por construção (`rest`, `:746`); o card-alvo só cobre prática **declarada como alvo** e só em chips de nome |
| `CONTEXT_NOT_INFORMED` **com** payload (serviços anexados por `hasGap`, `engine_v32.js:652-665`) | `baseCardHTML` com a lista de serviços | **Não** — pela mesma exclusão |
| `CONTEXT_NOT_INFORMED` **sem** payload | estado de maturidade + *"Informe o contexto…"* | **Sim**: o estado de maturidade está no card de gap e no `prio-decl`; o convite a declarar contexto está no `#v32cta` e no aviso único do card-alvo (`ui_target_v32.js:227-247`) |
| sem oferta mapeada | `neutralPrioCardHTML` (`:721-729`): *"A prioridade permanece registrada para o aprofundamento"* | **Não** |

**Três de quatro estados são únicos no relatório.** Remover a seção apaga a
superfície **mais rica** do documento justamente quando o facilitador fez o que o
produto pede (declarar contexto). O único card redundante é o quarto da lista — e
ele é precisamente a classe que a E18 já colapsou em `#v32base`, e que **não pode**
ser colapsada aqui (M4).

**M4 · A remoção pedida no 6a custa seis gates congelados em três suítes, e uma
propriedade de produto.** Medido no source:

| Gate | Suíte | O que exige de `#v32prio` / `#pr-sup-prio` |
|---|---|---|
| `V10` | `tests_ui_m32.js:142-152` | card de `security-analytics` **dentro de `#v32prio`**, com "prioridade declarada" e "nenhum produto é inferido sem contexto" |
| `V15 (A)` | `tests_ui_m32.js:197-209` | priority-first: a priorizada em `#v32prio`, antes das demais, e **não** duplicada em `#v32base` |
| `V21 (B)` | `tests_ui_m32.js:259-271` | card em `#v32prio` com whitespace, sem "aquisição candidata" |
| `V22 (B/C)` | `tests_ui_m32.js:272-283` | idem, contraprova |
| `P5`, `P7` | `tests_ui_m332.js:90-95`, `:102-107` | **no papel**, `#pr-sup-prio` na ordem declarada e nomeando FortiSIEM |
| `D010-ABS1 (f)` | `tests_010_vao.js:825-831` | `#v32prio` nunca recebe bloco de ausência e nunca fica sem `.v32-card` |
| `P52-SUP3` | `tests_p52_chromium.js:1593-1606` | ≥ 2 `.section-title` em `#v32support` — *"as variantes de apoio deixaram de ser distinguidas por função"* |

Por trás dos gates há uma **propriedade**, não um detalhe de teste: *prioridade
declarada nunca desaparece do resultado* (3.2.2-A / 3.2.3-B, comentários em
`ui_v32.js:722` e `:738`). Ela é o que impede aplicar o *Bloco de ausência* a
`#v32prio`. Revogá-la é decisão de produto do proprietário — não é "UI-only", e
enfraquecer os gates para passar é proibido (R10 §1).

**M5 · A duplicação do papel nos 4 qids é OUTRA, e tem outro remédio.** Ela não
toca `#v32prio` nem a Camada 1. É entre duas **curadorias** distintas, ambas
impressas, ambas dizendo "validar aderência", com **pertinência divergente**:

| qid · nível | `#pr-findings` → `[data-pr-gap-support]` (`ui_v32.js:1215`, tabela `QS_GAP_SUPPORT`, `:1034-1066`) | `#pr-target` → `[data-ux-enablers="a-validar"]` (`ui_target_v32.js:453`, `MAP[qid].lv[atual].c`) | Divergência |
|---|---|---|---|
| `logs` · 0 e 1 | FortiAnalyzer · FortiSIEM · **FortiSOC** | FortiAnalyzer · FortiSIEM | gapsup é superconjunto |
| `detection-lifecycle` · 0 | FortiSIEM · **FortiAnalyzer** · **FortiSOAR** · **FortiSOC** | FortiSIEM | gapsup é superconjunto |
| `detection-lifecycle` · 1 | os mesmos 4 | FortiSIEM · **FortiAI-Assist** | **cada lista tem item que a outra não tem** |
| `automation` · 0 | FortiSOAR · **"Automação nativa de FortiAnalyzer/FortiSIEM"** | FortiSOAR | gapsup é superconjunto |
| `automation` · 1 | os mesmos 2 | FortiSOAR · **FortiXDR** | **cada lista tem item que a outra não tem** |
| `vulnerability-management` · 0 | **"FortiClient administrado por EMS"** · FortiRecon | FortiRecon · **FortiEndpoint** | **cada lista tem item que a outra não tem** |
| `vulnerability-management` · 1 | os mesmos 2 | FortiRecon | gapsup é superconjunto |

Em **3 das 7** combinações alcançáveis, **nenhuma das duas listas contém a outra**.
O leitor recebe, no mesmo PDF, duas respostas diferentes para "o que pode apoiar
este gap" — sem que nada explique por quê. A causa é estrutural e está declarada
no source: `QS_GAP_SUPPORT` é curada **por capability, sem nível**
(`ui_v32.js:1034-1066`); `MAP` é curado **por qid × nível respondido**
(`quickscan_…:420-467`). Duas regras de ancoragem diferentes produzem listas
diferentes por construção.

Consequência dura, que fecha rota: **suprimir uma das duas perde conteúdo**. Nas 3
combinações acima, apagar o card-alvo tira FortiAI-Assist, FortiXDR e
FortiEndpoint do relatório; apagar o `pr-gapsup` tira FortiSOC, FortiSOAR,
FortiAnalyzer e FortiClient-EMS. Subtração dentro da jornada cujo enunciado é
"declarar contexto nunca subtrai conteúdo".

**M6 · O item 8 pede convergência que já existe em dois lugares — e não onde ele
pensa.** A convergência gap↔apoio está viva:

- **no papel**, `qsGapSupportHTML` pendura o apoio **dentro** do card do gap, em
  `#pr-findings` (`ui_v32.js:1215`) — para 4 dos 15 qids;
- **na tela**, o `<details>` "Possíveis formas de apoio aos demais gaps altos"
  (`quickscan_…:909-912`) vive **dentro** da seção "Gaps observados", porque
  `RE_GAPS` (`ui_p52_workspace_v32.js:656`) mantém o balde;
- **no card-alvo**, entregue pela 010 (`tgtValidateHTML`), que é a
  *Convergência no card* já canônica (`CONTEXT.md:117-121`).

O que **não** existe é coerência entre elas. E o que o item 8 aponta sem nomear é
que **"Formas de apoio" não é a seção onde o apoio mora**: das 11 superfícies de
apoio da tela, **4 vivem lá** e **7 vivem em outras três seções**. É esse o
descasamento que o cliente sentiu ao ler gaps e apoio como coisas separadas.

**M7 · A "poluição" que o cliente antecipou já está no relatório — medida.**
Para uma sessão comum (gap alto em `logs`, `logs` priorizado, `logs` declarado
como prática-alvo, contexto da capability `UNSET`, suficiência aberta), o **mesmo
assunto** aparece:

- na **tela**, em 4 seções: `priorities` (`prio-decl`), `target` (chips
  FortiAnalyzer · FortiSIEM), `context` (card de `security-analytics` em modo
  ponteiro), `support` (cards completos FortiAnalyzer · FortiSIEM);
- no **papel**, em 4 `pr-sec`: `#pr-prios`, `#pr-findings` (com 3 nomes de
  produto), `#pr-support` (`#pr-sup-prio`), `#pr-target` (com 2 nomes);
- e sob **dois nomes diferentes**: *"Análise centralizada, correlação e retenção
  de eventos"* (`MAP["logs"].cap`, `quickscan_…:448`) e *"Analytics de segurança
  (SIEM/data lake)"* (`CAPABILITIES["security-analytics"].name`,
  `engine_v32.js:49`).

Converger **mais** (estender `QS_GAP_SUPPORT` aos 15 qids) multiplica blocos e
reabre diretriz selada. Converger **menos** (fundir seções) subtrai conteúdo e
quebra gates. A saída que respeita a ressalva do cliente é **declarativa**.

### Invariantes tangenciadas (R1)

| INV | Tangenciada? | Como — e o limite |
|---|---|---|
| **INV-7** narrativa determinística e derivada de evidência | **SIM — é a invariante governante** | Título que promete "apoio" sobre um bloco que entrega "informe o contexto" é narrativa que afirma mais do que a evidência sustenta — a mesma classe do defeito A4 que a 010 corrigiu, um degrau acima. E duas listas divergentes para o mesmo gap, sem explicação, não são leitura determinística **para o leitor**, ainda que sejam funções puras do estado |
| **INV-2** UNSET ≠ NONE | **SIM, na apresentação** | Qualquer retitulação tem de continuar declarando **não-informação**. Nenhum título novo pode deixar o leitor concluir "não tenho tecnologia" a partir de um card `CONTEXT_NOT_INFORMED` |
| **INV-3** suficiência antes de qualquer score | **SIM, como piso** | `tgtValidateHTML` já exige gate ABERTO (`ui_target_v32.js:328`); `#v32prio`, `#v32base` e o `apoioBlock` da Camada 1 **não** exigem. Esta demanda **não pode ampliar** publicação sob gate fechado — e o desalinhamento entre as três é achado a medir, não escopo |
| **INV-9** boundary legível por máquina | **SIM — é o portão caro** | `ui_v32.js` e `ui_target_v32.js` são §29.4 e pinados por `P50-GOV1`/`P50-IC4`. Ver P11 |
| **INV-10** nomes de código exatamente como no source | **SIM** | Toda string de UI citada aqui é literal; a única mudança proposta é de **texto exibido**, e o vocabulário canônico é *habilitador* (`CONTEXT.md:64-70`) |
| **INV-1** engine byte-idêntico | **NÃO** | Nenhuma rota recomendada toca `engine_v32.js` nem a Camada 1 |
| **INV-4**, **INV-5**, **INV-6**, **INV-8** | Guarda-corpo | Nenhum número muda; nenhuma ancoragem de habilitador muda (continua no nível ATUAL); nada novo é serializado |

### Cross-check das specs seladas

Fonte: `.claude/verify/current_phase.json:18-25` — **uma** spec normativa,
`specs/PHASE_5_0_REV_B.md` (sha `4f1583c7…04619b`), escopo "superfícies 5.0
congeladas". Fase corrente 5.2 `SELADA`; `proxima_fase` `NAO_ABERTA`.

**Positivo:** a §29.4 nomeia `ui_v32.js` e `ui_target_v32.js` como protegidos
(`:1613-1620`), e a §29.5 (`:1629`) exclui superfície de print/PDF — que é
metade do alcance desta demanda.

**Negativo, registrado porque importa:** nenhuma spec selada trata de **título de
bloco de apoio, arquitetura de informação do resultado ou reconciliação de
curadorias**. A §UAT-07, que governa `QS_GAP_SUPPORT`, **não** é spec normativa em
`specs_normativas`: vive apenas como âncora citada dentro do oráculo
(`tests_p50_core.js:3385-3390`). E a *ordem canônica de leitura* é âncora
ratificada pelo proprietário em 2026-08-27, residente em
`specs/009-leitura-do-relatorio/spec.md` — **não** é tocada por nenhuma rota
recomendada aqui.

**Terceiro portão, vivo e executável:** `tests_p50_core.js:82` — o mapa
`PROTECTED` pina `ui_v32.js` (`:192`) e `ui_target_v32.js` (`:302`). O precedente
é explícito e restritivo: a autorização da 009 vale **só para a 009**
(`:137-139`); a da 010 é registrada como "restrita a estes dois arquivos e a esta
demanda" (`specs/010-recomendacao-sem-vao/relatorio-final.md:46`). **A 015 não
tem autorização nominal.** Ver **P11**.

**Custo escondido que só o source revela:** os títulos de `P52_SECTIONS`
("Contexto tecnológico", "Formas de apoio") são **âncora de mutante byte a byte**
em `tests_009_mutants.js:127-135` e `tests_p52_mutants.js:244-245`, e o próprio
literal carrega a "RESTRIÇÃO DE FORMA" declarada
(`ui_p52_workspace_v32.js:589-592`). Renomear seção **apodrece âncora** em duas
campanhas — e âncora podre conta como *mutante não executado*
(`CONTEXT.md:161-180`), não como falha visível.

### Desafio ao pedido

**Ao 6a — "pode ser removida?"** Não, e a medição é dura: M3 mostra que 3 dos 4
estados do bloco são únicos no relatório; M4 mostra 7 gates em 4 suítes e uma
propriedade congelada no caminho. O que existe é redundância de **promessa**, e
ela vive no **título**, não no bloco.

**Ao 6a — e à minha própria recomendação anterior.** A P8 da 010 (herdada da P7 da
009) recomendou *"remover só o sufixo de versão do título"*. **Refuto essa
recomendação, com a razão** (R2 §5 — refutação registrada permanece): o sufixo
"· contexto V3.2" é jargão de versão de ferramenta num documento de cliente, **e é
hoje o único elemento que distingue os dois títulos adjacentes de M1**. Removê-lo
isoladamente produz "Apoio nas prioridades declaradas" logo acima de "Como a
Fortinet pode apoiar nas prioridades declaradas" — e **piora** exatamente o que o
cliente reclamou. O sufixo tem de ser **substituído** por um desambiguador
funcional, nunca apagado.

**Ao item 8 — a leitura literal continua refutada, e por três razões novas.** A
010 já refutou dissolver a seção (`refinement.md:256-269`, P12). Acrescento:
(i) o `pr-gapsup` **já é** a convergência pedida, e cobre 4 de 15 qids no papel —
o que falta não é convergir, é reconciliar (M5/M6); (ii) fundir "Gaps de
maturidade" com "formas de apoio" na tela colidiria com o fato de que a seção de
apoio abriga também **"Capabilities a validar"** (`quickscan_…:1002-1004`) e o
tier T3 (`:1005-1011`), que não são apoio a gap; (iii) o próprio cabeçalho
normativo da §UAT-07 já promete *"o bloco final de apoio continua existindo …
**sem duplicar o mesmo card**"* (`ui_v32.js:1029-1030`) — a promessa existe, o
produto a violou no papel, e **nenhum gate a mede** (ver achado B).

**A rota UI-only continua valendo? A Porta B continua recusada?** Sim para as
duas, e com folga: nenhuma rota recomendada toca `engine_v32.js` nem
`quickscan_secops_soccmm_v3_1_3.html`. As duas curadorias congeladas (`MAP`,
`OFFERINGS`) são apenas **lidas**; o que muda é texto exibido e, no máximo, uma
frase de ligação.

#### Rotas — item 6a

| Rota | O que faz | Toca | Rito | Parecer |
|---|---|---|---|---|
| **S1 · remover a seção** (leitura literal) | `#v32prio` e `#pr-sup-prio` deixam de existir | `ui_v32.js` | §29.4 nominal + repin + **revogação de propriedade congelada** + reescrita de 7 gates em 4 suítes | **Recuso.** Apaga a superfície mais rica do relatório e derruba "prioridade nunca desaparece" |
| **S2 · remover só o sufixo "· contexto V3.2"** | um literal | `ui_v32.js:749` | §29.4 nominal + repin | **Recuso isolada** — piora M1 (ver "Desafio"). Só sobrevive dentro de S3 |
| **S3 · retitular pela FUNÇÃO** | o título do bloco V3.2 passa a dizer o que ele entrega (leitura por capability do contexto declarado), e não a versão; o título da 7ª seção é **imutável** (Camada 1, `frozen`) — logo a desambiguação acontece obrigatoriamente do lado V3.2, nas duas superfícies (`:749` tela, `:1275` papel) | `ui_v32.js` | §29.4 nominal + repin + gate novo | **Recomendada.** Resolve a redundância de promessa sem remover um byte de conteúdo, e o custo é 2 literais |
| **S4 · colapsar em aviso o card de prioridade sem payload** | aplicar a partição da E18 a `prioCaps` | `ui_v32.js` | §29.4 + revogação de V10/V15 | **Recuso** — e nomeio a autoria: é a **mesma premissa** que me custou a reprovação no aceite da 010 ("N cards cujo único conteúdo possível…"), agora contra uma propriedade explícita |
| **S5 · nada, e registrar a decisão** | o título fica; entra em `design-decisions.md` §Confirmadas com a razão | doc | nenhum | **Saída legítima.** Se o proprietário considerar o título aceitável, o 6a fecha aqui — e é **resultado, não omissão** |
| **S6 · remover a `.section-title` mantendo os cards** | funde `#v32prio` visualmente ao bloco seguinte | `ui_v32.js` | §29.4 + repin | **Recuso.** É exatamente a propriedade que `P52-SUP3` assere ("variantes de apoio distinguidas por função") |

**Recomendação: S3, com S5 como alternativa explícita na mesa.**

#### Rotas — item 8 / achado nº 1

| Rota | O que faz | Toca | Rito | Parecer |
|---|---|---|---|---|
| **T1 · fonte única, `pr-gapsup` passa a ler `MAP`** | uma curadoria só no papel | `ui_v32.js` | **Reabre §UAT-07**: `P51-REC1` exige que **toda** opção de `QS_GAP_SUPPORT` apareça (`tests_p50_core.js:3380-3383`) | **Recuso** — mesma razão da V5 da 010: reusar regra é grátis, mexer na tabela reabre diretriz selada |
| **T2 · fonte única, o card-alvo passa a ler `QS_GAP_SUPPORT`** | idem, no outro sentido | `ui_target_v32.js` | quebra os gates `D010-*` (medem `MAP[qid].lv[atual].c`) e perde a ancoragem por nível | **Recuso** — a tabela §UAT-07 não tem nível; adotá-la desancoraria o habilitador da resposta confirmada (roça INV-5/INV-7) |
| **T3 · declarar a relação, sem fundir as listas** | cada uma das duas superfícies do papel diz, em uma frase, **de onde vem** e **por que difere** — a do gap é por capability, a do alvo é pelo nível respondido; e uma remete à outra | `ui_v32.js` (e/ou `ui_target_v32.js`) | §29.4 nominal + repin + gate novo | **Recomendada.** Zero subtração, zero reabertura de diretriz, e ataca o que o leitor sente |
| **T4 · suprimir o card-alvo nos 4 qids que já têm `pr-gapsup`** | acaba a duplicação | `ui_target_v32.js` | — | **Recuso.** `pr-gapsup` é **só papel**: a tela ficaria muda para os 4 qids. E perde FortiAI-Assist/FortiXDR/FortiEndpoint (M5) |
| **T5 · suprimir `pr-gapsup` no qid que é prática-alvo** | idem | `ui_v32.js` | quebra `P51-REC1` (`:3406-3411`) | **Recuso** |
| **T6 · dissolver "Formas de apoio"** (item 8 literal) | a seção deixa de existir | `ui_p52_workspace_v32.js` + 3 gates + ordem canônica | âncora normativa nova + ratificação | **Recuso** — já recusada pela 010 (P12) e a razão só ficou mais forte com M6 |
| **T7 · nada, e registrar** | a divergência vira decisão de projeto | doc | nenhum | **Não recomendo**: o relatório continuaria imprimindo duas respostas divergentes para o mesmo gap. Mas registro como saída disponível |

**Recomendação: T3. E o "uma curadoria só" é demanda própria e maior** — exige
decisão do proprietário sobre reabrir a §UAT-07, e não cabe aqui.

### Alternativa mais simples considerada

**"Só S5 + T7": não fazer nada nos dois e explicar no guia.** É a alternativa mais
barata e **não a descarto** — o orquestrador pediu explicitamente que "não há
demanda" fosse um resultado admissível, e para o 6a ela é defensável (o bloco
entrega, o título é que engana). Para o item 8 **não basta**: a divergência de
pertinência de M5 é um defeito de coerência que chega ao cliente no PDF, não uma
preferência de leitura. Guia não conserta duas listas que se contradizem.

**"Só S3": retitular e não tocar no papel.** Não basta — resolve M1 e deixa M5
inteiro, que é o achado nº 1 e a metade aproveitável do item 8.

### Conflito com decisão registrada

| Decisão registrada | Rota | Encaminhamento |
|---|---|---|
| **§29.4** (`specs/PHASE_5_0_REV_B.md:1613-1620`) + precedentes nominais restritos à 009 (`tests_p50_core.js:137-139`) e à 010 (`relatorio-final.md:46`) | S3, T3 | **ESCALAR (P11)** — autorização nominal própria da 015, do proprietário, no chat, antes da Fase 1 |
| **§29.5** (`:1629`) — nenhuma superfície de print/PDF | S3 (`:1275`), T3 | Mesma escalação; há precedente de duas demandas sob autorização nominal |
| **Propriedade "prioridade nunca desaparece"** (3.2.2-A/3.2.3-B; `V10`, `V15`, `V21`, `V22`, `D010-ABS1(f)`) | S1, S4 | Recusadas. Se o proprietário quiser revogá-la, é frase dele — não é execução |
| **§UAT-07 / `QIDS_AUTORIZADOS`** (`tests_p50_core.js:3385-3390`) | T1, e "uma curadoria só" | Não reabrir nesta demanda |
| **Ordem canônica de leitura**, ratificada em 2026-08-27 (`specs/009-leitura-do-relatorio/spec.md`) | T6 | Recusada. Nenhuma rota recomendada altera chaves nem ordem |
| **`P52-REC1`** (`tests_p52_layout.js:512-541`) — a seção de apoio é íntegra e **nenhum nome de produto no owner de layout** (`:538-539`) | todas | Consequência inalterada: nada desta demanda pode ser implementado em `ui_p52_workspace_v32.js` |
| **Títulos de `P52_SECTIONS` como âncora de mutante** (`tests_009_mutants.js:127-135`, `tests_p52_mutants.js:244-245`, restrição declarada em `ui_p52_workspace_v32.js:589-592`) | qualquer renomeação de seção | **Fora de escopo.** Renomear seção apodrece âncora em duas campanhas |
| **`CONTEXT.md:117-121`** (*Convergência no card*, aditiva por definição) | item 8 | Confirmada e reforçada: a convergência já foi entregue; o que falta é coerência |
| **Errata E18 / partição por payload** (`ui_v32.js:757-766`) | S4 | A premissa da E18 vale **só para o card vazio** e **só fora de `prioCaps`** — o próprio código o declara (`:705-710`) |

---

## Sistema real

Tudo abaixo foi **lido no source desta worktree** (`phase5-015`, de
`origin/develop` `4f7c140`, com 009, 010 e 011 dentro). Nada foi executado — o que
depender de execução está nomeado em "O que ficou por medir".

### As superfícies de apoio — TELA (11 superfícies, 4 seções)

| # | Seção (ordem) | Superfície | O que ENTREGA | FONTE dos itens | Existe quando |
|---|---|---|---|---|---|
| **A** | gaps (4ª) | `<details class="t-details">` "Possíveis formas de apoio aos demais gaps altos" (`quickscan_…:909-912`; roteada por `RE_GAPS`, `ui_p52_workspace_v32.js:656`) | cards completos de produto: nome, descrição, "Neste contexto:", escopo, link oficial (`:860-879`) | `MAP[qid].lv[nível respondido].c` + `PRODUCTS` | há prioridades **e** há gap alto fora delas |
| **B** | target (5ª) | `.ux-tgt-en` (`ui_target_v32.js:249-262`) | chips nome + modalidade | catálogo do **engine** (`OFFERINGS`/`SERVICES`) | prática-alvo declarada e engine anexou item |
| **C** | target (5ª) | `[data-ux-enablers="a-validar"]` (`ui_target_v32.js:327-351`) | chips nome + "a validar" | `MAP[qid].lv[**atual**].c`, nomes por `TGT_EQUIV` (`:289-301`) | S2 + gate ABERTO + resposta confirmada + sem candidato do engine |
| **D** | context (6ª) | `#v32prio` sob "Apoio nas prioridades declaradas · contexto V3.2" (`ui_v32.js:749-750`) | ver M3 — 4 estados distintos | engine | há prioridade declarada e a sessão não é legada |
| **E** | context (6ª) | `#v32direct` / `#v32contextual` / `#v32validate` (`:751-756`) | mesmo card, para as **não** priorizadas | engine | idem |
| **F** | context (6ª) | `#v32base` "Leitura base — contexto tecnológico não informado" (`:765-766`) | cards das capabilities **com** payload + UM aviso nominal das **sem** (E18) | engine | idem |
| **G** | context (6ª) | `#v32maturity` (`:767-770`) | card de capability sem landscape aplicável | engine | idem |
| **H** | context (6ª) | `#v32arch-note` (`:772-780`) | Rota A / Rota B (nomeia FortiSOC) | `architectureNote` | `an.show` |
| **I** | support (7ª) | "Como a Fortinet pode apoiar nas prioridades declaradas" + `.apoio-block` (`quickscan_…:988-989`) | cards completos de produto | `MAP` + `PRODUCTS` | `hasPrio`; **oculto** quando `hasSubstituteV32` (`ui_v32.js:284`) |
| **I′** | support (7ª) | "Como a Fortinet pode apoiar agora" (`:994-995`) | idem, sem prioridades | `MAP` + `PRODUCTS` | `!hasPrio`; mesma ocultação |
| **J** | support (7ª) | "Pode fazer sentido — após validação" `.t-list` (`:998-1001`) | tier T2 por produto, com os sinais | `buildTiers` | `tiers.t2.length`; mesma ocultação |
| **K** | support (7ª) | "Não priorizados neste screening" `<details>` (`:1005-1011`) | tier T3 | `buildTiers` | `tiers.t3.length` |

"Capabilities a validar" (`quickscan_…:1002-1004`) vive na seção de apoio e **não
é superfície de apoio**: não nomeia item de catálogo. Vale registrar porque é
metade do argumento contra dissolver a seção.

### As superfícies de apoio — PAPEL (8 superfícies)

| Superfície | O que ENTREGA | FONTE |
|---|---|---|
| `[data-pr-gap-support]` **dentro** de `#pr-findings` "Gaps de maturidade observados" (`ui_v32.js:1204`, `:1215`, `:1075-1099`) | "Possíveis caminhos de apoio" + capability canônica (`MAP[qid].cap`, `:1085`) + lista nome — justificativa | **`QS_GAP_SUPPORT`** (`:1034-1066`), tabela própria de 4 qids |
| `#pr-sup-prio` sob `<h3>Apoio nas prioridades declaradas</h3>` (`:1275`) | espelho de **D** — **sem** o sufixo "· contexto V3.2" | engine |
| `#pr-sup-direct` / `-contextual` / `-validate` (`:1276-1278`) | espelho de **E** | engine |
| `#pr-sup-base` (`:1282`) | espelho de **F** | engine |
| `#pr-sup-maturity` (`:1284`) | espelho de **G** | engine |
| `#pr-arch` (`:1288-1291`) | espelho de **H** | engine |
| `.ux-tgt-en` em `#pr-target` (`ui_target_v32.js:453`, `:455`) | espelho de **B** | engine |
| `[data-ux-enablers="a-validar"]` em `#pr-target` (`:453`) | espelho de **C** | `MAP` |

**A, I, I′, J e K não existem no papel.** `preparePrint()` monta o relatório do
zero (`ui_v32.js:1344-1346`) e `body.v32-print-mode .wrap{display:none!important}`
(`ui_v32.css:77`) tira a superfície de aplicação. Consequência de produto, nunca
registrada em spec: **a única curadoria da Camada 1 que chega ao papel é a que o
card-alvo carrega (C)** — os cards completos de produto do `apoioBlock`, com
descrição, escopo e link oficial, **nunca são impressos**.

### As três curadorias

| Curadoria | Onde vive | Ancorada em | Vocabulário | Alcance |
|---|---|---|---|---|
| `MAP` + `PRODUCTS` (Camada 1) | `quickscan_…:262-276`, `:420-467` | **qid × nível respondido** (`s:2` e `s:1`; `s:0` vazio nos níveis 2–3) | "Neste contexto: …" | 15/15 qids |
| `OFFERINGS` / `SERVICES` (engine) | `engine_v32.js:73-…`, `:551-677` | **capability × contexto declarado**; serviços por `hasGap` (`:652-665`) | modo de apoio (DIRECT/CONTEXTUAL/VALIDATE) | 25 capabilities |
| `QS_GAP_SUPPORT` (§UAT-07) | `ui_v32.js:1034-1066` | **qid, sem nível** | "validar aderência" / "caminhos possíveis" | 4/15 qids, **papel apenas** |

Nomes divergem entre curadorias por construção: `PRODUCTS` é chaveado por nome
(`"FortiSOAR"`), `OFFERINGS` por id minúsculo (`fortisoar`), e a ponte declarada é
`TGT_EQUIV` (`ui_target_v32.js:289-301`), criada pela 010 e **local ao card-alvo**
— `QS_GAP_SUPPORT` não a usa e escreve nomes livres ("FortiClient administrado por
EMS", "Automação nativa de FortiAnalyzer/FortiSIEM", "FortiSOC").

### Divergências doc × código encontradas

- **`P51-REC1` promete no título o que não mede.** O nome do gate é
  *"recomendações acionáveis junto do gap, sem overclaim nem duplicação"*
  (`tests_p50_core.js:3336`) e o cabeçalho normativo da §UAT-07 promete "sem
  duplicar o mesmo card" (`ui_v32.js:1029-1030`). Nenhuma asserção do gate compara
  `pr-gapsup` com **qualquer outra superfície** — as verificações de duplicação
  são todas internas a `#pr-findings` (`:3362-3411`). A duplicação de M5 nasceu e
  passou por baixo do gate que leva "duplicação" no nome.
- **Dois nomes para a mesma capability no mesmo relatório** (M7): `MAP["logs"].cap`
  = "Análise centralizada, correlação e retenção de eventos" (`quickscan_…:448`)
  × `CAPABILITIES["security-analytics"].name` = "Analytics de segurança (SIEM/data
  lake)" (`engine_v32.js:49`). `qsGapSupportHTML` já escolheu a da Camada 1 como
  canônica, com a razão escrita (`ui_v32.js:1081-1085`); `#v32prio` e `#pr-sup-*`
  usam a do engine.
- **Paridade tela × papel quebrada no próprio título do 6a**: a tela diz "…·
  contexto V3.2" (`:749`), o papel diz só "Apoio nas prioridades declaradas"
  (`:1275`). O sufixo é assimetria, não desenho declarado.
- **`neutralPrioCardHTML` sob capability madura**: prioridade declarada sem gap e
  sem contexto cai em `presentationOf → null` (`:645-655`, pela flag de
  prioridade, com `classification` nula) e renderiza *"Não há oferta direta
  mapeada para esta capability nesta etapa"* (`:727`) — o leitor pode ler lacuna
  de catálogo onde há **ausência de gap**.

---

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| **C1** | **Sessão legada pura** (nada declarado): `renderBlocks` toma o ramo legado (`ui_v32.js:236-243`) — não há `#v32support`, não há `#v32prio` | O 6a **não tem sujeito**. Nenhuma rota pode presumir que o bloco existe. E a duplicação **C × I** já existe aqui (as duas leem `MAP`, em duas seções da mesma tela) — resíduo declarado e **nunca fechado** pela 010 (caso C1 do seu refinamento: *"exige texto que a explique"*; o texto não foi escrito) |
| **C2** | **Vão de contexto parcial sem substituto**: Camada 1 visível **e** `#v32prio` em modo ponteiro | **É o estado do cliente, pós-010, e o pior caso de M1**: os dois títulos co-visíveis, um promete e não entrega. É sobre esta tela que a decisão de 6a tem de ser tomada |
| **C3** | **Vão assimétrico** (uma capability declarada, a priorizada ainda `UNSET`): `hasSubstituteV32` verdadeiro ⇒ Camada 1 oculta | Um título só, entrega parcial: card completo para a declarada, ponteiro para a `UNSET`. A retitulação de S3 tem de ser verdadeira **nos dois** sub-estados do mesmo bloco |
| **C4** | **Contexto completo declarado** | `#v32prio` é a superfície mais rica do relatório e a Camada 1 está oculta. **Remover a seção aqui apaga o melhor conteúdo do documento** — é o argumento decisivo contra S1 |
| **C5** | **Prioridade declarada sem gap** (capability madura, contexto `UNSET`) | Card neutro dizendo "Não há oferta direta mapeada". Nenhuma rota pode piorar isso; e o texto **não pode** sugerir lacuna de catálogo onde há maturidade (achado D) |
| **C6** | **Sem prioridades declaradas** (`prioCaps` vazio) | `#v32prio` não nasce; o 6a não tem sujeito. A redundância de promessa **se desloca** para "Gaps observados na sessão" × "Como a Fortinet pode apoiar agora" (`quickscan_…:992`, `:994`). S3 tem de cobrir os dois ramos, não só o de prioridades |
| **C7** | **Suficiência FECHADA** | `tgtValidateHTML` devolve "" (`ui_target_v32.js:328`) — o card-alvo cala. Mas `#v32prio` continua podendo nomear serviço/candidato contextual, e a Camada 1 nomeia produto (`quickscan_…:933`). **Nenhuma rota desta demanda pode ampliar publicação sob gate fechado** (INV-3); o desalinhamento entre as três superfícies sob gate fechado é **achado**, não escopo |
| **C8** | **Papel × tela** | `pr-gapsup` é papel-only; A/I/I′/J/K são tela-only. Logo a duplicação **C × I** é só de tela e a **A′ × C** é só de papel. Toda decisão desta demanda tem de declarar o que faz nas **duas** superfícies |
| **C9** | **qid dos 4 de §UAT-07 que também é prática-alvo, nível 0 × nível 1** | As duas listas divergem, e a divergência **muda com o nível** (M5). Requisito: nenhuma rota pode apagar item que existe em uma só das listas — o alcance foi medido em 7 combinações |
| **C10** | **Mesmo qid sob dois nomes** (`logs` = "Análise centralizada…" × "Analytics de segurança…") | Se a demanda tocar títulos, não pode **aumentar** a divergência de nomes. Reconciliá-la exigiria tocar Camada 1 ou engine — fora |
| **C11** | **`target == current`** / prática removida por `revalidateTargets` | O card-alvo some entre renders. Nenhuma frase de ligação de T3 pode remeter a uma prática que já saiu — a 009 resolveu com passe único (`ui_target_v32.js:451-454`); T3 tem de **usar** esse passe, não criar um segundo |
| **C12** | **Sem cenário-alvo declarado** | `#pr-target` não existe (`ui_target_v32.js:426`). **A duplicação A′ × C some sozinha** — o que estreita o alcance do achado nº 1 às sessões com alvo. Também: sem alvo, C não existe em lugar nenhum, e a única curadoria da Camada 1 no papel desaparece |
| **C13** | **Zero gaps** (`computeFindings` vazio) | Sem `#pr-findings`, sem `pr-gapsup`, sem `apoioBlock`. `#v32prio` pode existir se houver prioridade (C5). Nenhuma das duas redundâncias tem sujeito — confirmar como propriedade, não como acaso |
| **C14** | **UNSET ≠ NONE na retitulação** | Nenhum título novo pode deixar o leitor concluir ausência de tecnologia a partir de card `CONTEXT_NOT_INFORMED`. A oração "nenhum produto é inferido sem contexto" (`ui_v32.js:635-636`, pinada por `V10`) permanece **em todas as variantes** |
| **C15** | **Impressão** | `beforeprint` dispara `preparePrint` (`ui_v32.js:1372`) e o relatório é remontado. Qualquer texto novo tem gêmeo no papel ou uma razão declarada para não ter — o precedente é o 4º parâmetro `afirmaPreservacao`, que o papel nunca passa (`:618-628`) |

---

## Vocabulário

**Proposto, não gravado.** Entram no `CONTEXT.md` (R12, ao fim de "Metodologia
(produto)") no fechamento do portão, sem reordenar nem reescrever verbete
existente. Enquanto não entrarem, a Fase 1 não pode usá-los.

```md
**Superfície de apoio**:
Bloco do resultado que apresenta habilitador ao leitor. Identifica-se pela FONTE
dos itens e pela seção em que vive — nunca pelo título: duas superfícies podem ter
títulos quase iguais e fontes distintas, e a mesma fonte pode alimentar superfícies
em seções diferentes.
_Evitar_: bloco de apoio, seção de apoio (é UMA delas), recomendação
```

```md
**Curadoria de habilitadores**:
Conjunto declarado que liga evidência a itens de catálogo, com fonte, vocabulário e
regra de ancoragem próprios. Três coexistem no produto: o `MAP` da Camada 1 (por
qid × nível respondido), o catálogo do engine (por capability × contexto declarado)
e a tabela de §UAT-07 (por qid, sem nível). Divergência de pertinência entre elas é
esperada; chegar ao leitor sem explicação, não.
_Evitar_: catálogo (ambíguo entre os três), tabela, lista de produtos
```

```md
**Redundância de promessa**:
Repetição em que dois títulos anunciam a mesma entrega e só um entrega. Distinta da
redundância de conteúdo (dois blocos dizem a mesma coisa) e da repetição de rótulo
(mesmo nome, conteúdos distintos). Mede-se pelo que cada superfície ENTREGA em cada
estado de sessão, nunca pelo que o título diz.
_Evitar_: duplicação, redundância (sem qualificador)
```

```md
**Persistência da prioridade declarada**:
Propriedade congelada desde a 3.2.2/3.2.3 — toda capability com prioridade
declarada mantém card próprio no resultado, ainda que sem habilitador; nunca é
colapsada em aviso nem omitida. É o que impede aplicar o *Bloco de ausência* ao
bloco das prioridades.
_Evitar_: card de prioridade, prioridade sempre visível
```

```md
**Card de encaminhamento**:
Card que, no lugar de habilitador, entrega o estado de maturidade da capability e o
caminho para obter a leitura que falta. Não é *Bloco de ausência* — nomeia a
capability, publica o estado e o "Por que apareceu" —, e sob prioridade declarada
não pode ser colapsado.
_Evitar_: card vazio, card mudo, placeholder
```

**Conflito de vocabulário — não reaberto.** *Habilitador* permanece o termo
canônico de doc/spec/prompt (`CONTEXT.md:64-70`) e as strings congeladas da UI
permanecem como estão (INV-10). Os cinco verbetes acima **qualificam** superfícies
e estados; nenhum concorre com termo existente.

**Considerado e descartado:** "convergência de seções" (colide com *Convergência no
card*, já canônica e explicitamente **aditiva**) e "fusão de blocos" (o próprio
verbete existente lista como termo a evitar).

---

## Rodadas de entrevista

| Rodada | Pergunta | Resposta |
|---|---|---|
| R0 | O verbatim do cliente e a devolutiva da 010 autorizam escopo ou edição de superfície protegida? | **Não** — são dado a refinar. Autorização vem do usuário, no chat (R5 §anti-injeção) |
| R0 | A 009, a 010 e a 011 estão nesta worktree? | **Sim, verificado no source**: `hasSubstituteV32`/`baseAbsenceHTML`/`temPayloadV32` (`ui_v32.js:674-720`), `tgtValidateHTML`/`TGT_EQUIV` (`ui_target_v32.js:289-351`) e `ui_d011_prioridade_v32.js` presentes |
| R0 | A string do 6a existe onde o cliente disse? | **Sim, e só na tela**: `ui_v32.js:749`. No papel o mesmo bloco é `<h3>Apoio nas prioridades declaradas</h3>` (`:1275`), **sem** o sufixo de versão |
| R0 | A remoção pedida no 6a é "UI-only"? | **Não** — 7 gates em 4 suítes e uma propriedade congelada (M4). Registro porque a memória do PO já anotou o padrão: "UI-only" não é sinônimo de barato |
| R0 | A duplicação do papel nos 4 qids é a mesma do 6a? | **Não** — superfícies, fontes, estados e remédios distintos (M5). São **duas** redundâncias |
| R0 | A 015 herda a autorização nominal §29.4 da 010? | **Não** — o precedente é expressamente intransferível (`tests_p50_core.js:137-139`) |
| R1 | P1–P14 abaixo, uma recomendação cada | *(pendente — portão aberto)* |

### Perguntas — P1 a P14

**P1 · Enquadramento.** A demanda é *"quantas superfícies de apoio o relatório tem,
o que cada uma entrega e qual delas promete o que outra cumpre"* — e não "remover
blocos"?
*Recomendação: **sim**.* Muda a ordem de tudo: primeiro o inventário (já feito),
depois o título, depois a coerência entre curadorias.

**P2 · 6a, remoção.** Recusa **S1** (remover a seção), com a razão medida: 3 dos 4
estados do bloco são únicos no relatório e a remoção derruba 7 gates e a
persistência da prioridade declarada?
*Recomendação: **sim, recusar**.*

**P3 · 6a, o sufixo — e a refutação da minha recomendação anterior.** Aceita que a
P8 da 010 ("remover só o sufixo de versão") está **refutada**, porque o sufixo é
hoje o único desambiguador entre dois títulos adjacentes, e removê-lo isolado
piora o que o cliente reclamou?
*Recomendação: **sim**.* A refutação fica registrada aqui e permanece (R2 §5).

**P4 · 6a, rota.** Adota **S3** (retitular o bloco V3.2 pela função, nas duas
superfícies), recusando S2, S4 e S6?
*Recomendação: **sim**.* O título da 7ª seção é Camada 1 congelada — a
desambiguação **só pode** acontecer do lado V3.2.

**P5 · 6a, saída sem demanda.** Se, com a evidência de tela do estado C2 na mesa, o
proprietário considerar o título aceitável, o 6a fecha por **S5** (registro em
`design-decisions.md`, sem código)?
*Recomendação: **manter S5 explicitamente na mesa**.* É resultado legítimo, não
omissão — e o orquestrador pediu que fosse dito.

**P6 · 6a, o card sem payload.** Confirma que **não** se colapsa em aviso o card de
prioridade sem payload (S4), mesmo sendo a mesma classe que a E18 colapsou em
`#v32base`?
*Recomendação: **sim, não colapsar**.* E nomeio a autoria: a premissa "N cards cujo
único conteúdo possível é dizer que não houve declaração" é minha, do refinamento
da 010, e já foi falsificada uma vez por execução. Aqui ela esbarra numa
propriedade **explícita**, não só num payload.

**P7 · Item 8, o que sobrevive.** A metade aproveitável do item 8 é **coerência
entre curadorias**, não fusão de seções — porque a convergência gap↔apoio já
existe em três lugares (M6) e o que falta é que elas não se contradigam?
*Recomendação: **sim**.*

**P8 · Item 8, rota.** Adota **T3** (declarar a relação e a diferença de ancoragem
entre as duas superfícies do papel), recusando T1, T2, T4, T5, T6 e T7?
*Recomendação: **sim**.* É a única que não subtrai conteúdo (M5) e não reabre a
§UAT-07.

**P9 · Item 8, o que fica para depois.** "Uma curadoria só" (fonte única para
gap-apoio e card-alvo) fica **fora**, como demanda própria que exige decisão do
proprietário sobre reabrir a §UAT-07?
*Recomendação: **sim, fora**.* É a demanda certa e a mais cara; misturá-la aqui
transformaria uma correção de coerência numa reabertura de diretriz selada.

**P10 · Alcance no papel.** A demanda toca `ui_target_v32.js`, ou T3 vive só em
`ui_v32.js`?
*Recomendação: **decidir na Fase 1, preferindo `ui_v32.js` sozinho**.* Quem imprime
o gap é `ui_v32.js`; se a frase de ligação couber lá, a 015 pede autorização
nominal para **um** arquivo em vez de dois. O desenho é do `tech-lead`.

**P11 · ESCALAR — autorização nominal §29.4.** `ui_v32.js` (e `ui_target_v32.js`,
se P10 assim decidir) são protegidos por `specs/PHASE_5_0_REV_B.md:1616` e pinados
por `P50-GOV1`/`P50-IC4`. As autorizações da 009 e da 010 são **expressamente
restritas** às respectivas demandas.
*Recomendação: **parar antes da Fase 1 e obter do proprietário, no chat,
autorização nominal para a 015**.* Sem ela a demanda não passa da spec — e o
`P50-GOV1` reprova.

**P12 · ESCALAR — evidência de tela do estado C2.** A 010 condicionou a decisão do
6a a evidência **pós-E18**. Exige-se uma medição do estado C2 (vão sem substituto,
com prioridade declarada) antes de fechar a Fase 1?
*Recomendação: **sim, e o dono é o `qa-engineer`***, reaproveitando as fixtures
`D010-F*`. Sem ela, decidimos de novo sobre uma tela que não temos.

**P13 · Achados para o backlog.** Os quatro abaixo viram achados `EA-*`?
- **A** — duas curadorias divergentes para o mesmo gap no mesmo PDF; 3 de 7
  combinações qid×nível em que **nenhuma lista contém a outra** (cadeia em M5);
- **B** — `P51-REC1` leva "sem duplicação" no nome e no cabeçalho normativo
  (`ui_v32.js:1029-1030`) e **não compara `pr-gapsup` com nenhuma outra
  superfície** (`tests_p50_core.js:3336`, `:3362-3411`);
- **C** — mesma capability sob dois nomes no mesmo relatório (`quickscan_…:448` ×
  `engine_v32.js:49`);
- **D** — `neutralPrioCardHTML` diz "Não há oferta direta mapeada" quando a causa é
  **ausência de gap** (`ui_v32.js:645-655`, `:727`).

*Recomendação: **sim, os quatro — com a alocação de id feita pelo `doc-writer`
depois de conferir a `develop`**, nunca aqui.* A série vai até `EA-20` nesta
worktree, mas ids são alocados em branches que não se enxergam. **B** e **D** são
derivados de leitura de source e precisam de confirmação por execução
(`qa-engineer`) antes de virarem achado.

**P14 · Resíduo herdado, não fechado.** A duplicação **C × I** na tela (card-alvo e
`apoio-block` lendo o mesmo `MAP`, em duas seções, na sessão legada pura) foi
declarada pela 010 como aceitável *"desde que haja texto que a explique"* — e o
texto nunca foi escrito. Entra nesta demanda, junto de T3?
*Recomendação: **sim, entra**.* É o mesmo remédio (declarar a relação), na outra
superfície, e deixá-lo fora faria a 015 consertar o papel e ignorar a tela — que é
onde o cliente estava.

---

## Fora de escopo (explícito)

1. **Qualquer alteração em `engine_v32.js`** (`frozen`). `classify`,
   `resolveCandidates` e `buildRecommendationContext` permanecem byte-idênticos;
   Porta B não é aberta.
2. **Qualquer alteração em `quickscan_secops_soccmm_v3_1_3.html`** (`frozen`).
   `MAP`, `PRODUCTS`, `apoioBlock`, `buildTiers` e os três títulos de
   `HIDE_EYEBROWS` são apenas **lidos**.
3. **Remover `#v32prio` / `#pr-sup-prio`** e **revogar a persistência da prioridade
   declarada** — S1 e S4 recusadas (P2, P6).
4. **Dissolver `#p52-sec-support`** e **alterar a ordem canônica de leitura** — já
   recusado pela 010 (P12) e reforçado por M6.
5. **Renomear seção de `P52_SECTIONS`** — apodrece âncora de mutante em duas
   campanhas (`tests_009_mutants.js:127-135`, `tests_p52_mutants.js:244-245`).
6. **Estender ou alterar `QS_GAP_SUPPORT` / `QIDS_AUTORIZADOS`** (§UAT-07, fase 5.1
   selada) — T1 recusada.
7. **"Uma curadoria só"** — fonte única para gap-apoio e card-alvo: demanda própria
   (P9).
8. **Reconciliar os nomes de capability** entre Camada 1 e engine — achado C, não
   demanda (exigiria superfície congelada).
9. **Score, suficiência, limiar, tier, estágio, cenário-alvo.** Nenhum número muda;
   nenhuma regra de publicação muda; nenhuma publicação nova sob gate fechado.
10. **Recomendar produto a partir de ausência não declarada.** Sob `UNSET` o
    relatório continua sem afirmar que o cliente não tem tecnologia (INV-2).
11. **CSS novo, bridge novo, módulo novo.**
12. **Item 6b** ("Leitura base — contexto tecnológico não informado") — entregue
    pela 010 e corrigido pela errata E18. Não se reabre.
13. **Escrever em `.claude/BACKLOG.md`** — a alocação de id `EA-*` é do
    `doc-writer`, depois de conferir a `develop` (P13).
14. **Mudança de invariante.** Nenhuma das dez é proposta para alteração.

---

## O que ficou por medir (dono nomeado)

| # | O que | Por que não medi | Dono |
|---|---|---|---|
| 1 | Se algum gate pina o **texto literal** do eyebrow `ui_v32.js:749` (varri `tests_*.js` e não achei; `P52-SUP3` conta `.section-title`, não compara texto) | Exige execução das suítes, não só leitura | `qa-engineer` |
| 2 | Se `P52-SUP3` continua com ≥ 2 blocos na sua fixture depois de S3 | Depende de rodar Chromium (KI-3) | `qa-engineer` |
| 3 | Quantos cards de `#v32prio` ficam **sem payload** numa sessão típica (o análogo do "10 baseIds, 3 com serviço" que a 010 mediu para `rest`) | Exige execução | `qa-engineer` |
| 4 | Achados **B** e **D** de P13 — confirmação por execução antes de virarem `EA-*` | Derivados de leitura de source | `qa-engineer` |
| 5 | Evidência de tela do estado **C2**, pós-E18 (P12) | Exige render | `qa-engineer` |
| 6 | Ids `EA-*` dos quatro achados de P13 — conferência da `develop` e das branches vivas | Ids são alocados em branches que não se enxergam | `doc-writer` |
| 7 | Se T3 cabe só em `ui_v32.js` (P10) e o patch-point exato | É desenho técnico | `tech-lead` |
