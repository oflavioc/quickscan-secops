# spec-validate — 019-curadoria-do-relatorio

> Fase 6 · executor: `qa-engineer` · **somente leitura**. Cada item conferido na
> implementação REAL (source + execução), nunca no relatório de quem implementou
> (R2 §4). Iteração 1.

## Itens verificáveis extraídos da [spec.md](spec.md)

| # | Exigência | Conferido em | Veredito |
|---|---|---|---|
| 1 | `C1`/`D019-CUR1` — estado só com ids e enum fechado; nenhum texto do relatório nasce dele | `ui_curation_v32.js` §`valido`/`set`; o gate TENTA redigir em `set` e em `setArchitectureNote` e exige recusa; `M1` desliga a validação do enum ⇒ DETECTADO | **conforme** |
| 2 | `C2`/`D019-CUR2` — ausência ≠ supressão; relatório **byte-idêntico** ao construído sem a demanda | publicado × ofertado iguais, medidos na ponte; `missing ≠ null ≠ {}`; `M2` converte missing em exclude ⇒ DETECTADO. **A cláusula de byte-identidade não é medida — gap 1** | **spec-errada** |
| 3 | `C3`/`D019-INV8` — sexta chave canônica; import recomputa; derivado recusado | `ui_session_v32.js` §`captureCanonicalInputs`/`validateSessionDocument`; ausência medida ANTES de presença; id fora do catálogo recusado; `M3` ⇒ DETECTADO; `S4-S5` reancorado com `M11` provando que a alínea ainda discrimina | **conforme** |
| 4 | `C4`/`D019-PROV1` — proveniência nas DUAS superfícies, para item cuja **presença** é decisão do operador | `ui_p52_support_v32.js` §`cardDoProduto`/`papelHTML`; a fixture do gate foi corrigida (gap 3) e ganhou a alínea inversa — item OFERTADO **não** leva selo; `M4` remove só no papel ⇒ DETECTADO | **conforme** |
| 5 | `C5`/`D019-MED1` — derivados idênticos com e sem curadoria; **payload M41 byte-idêntico ao pinado** | `derivado()` + alínea nova comparando a OFERTA do motor; stage `m41` **PASS** em todas as execuções do pipeline; `M5` poda o `MAP` ⇒ DETECTADO | **conforme** |
| 6 | `C6`/`D019-SOL1` — conjunto de produtos igual ao da visão por gap, menções curtas incluídas | oráculo trocado do DOM para o MOTOR (`computeFindings` + `MAP` + `PRODUCTS`); mede o **par** (produto × capability), 20 × 20; `M6` descarta a menção curta ⇒ DETECTADO | **conforme, medindo mais do que o pedido** |
| 7 | `C7`/`D019-SOL2` — todo produto num grupo; o desconhecido é explícito e listado | selo `[data-p53-sol-grupo-nome]` por card; alínea nova exige que **todo** grupo presente se nomeie; `M7` remove a nomeação ⇒ DETECTADO | **conforme, medindo mais do que o pedido** |
| 8 | `C8`/`D019-PAR1` — tela e papel publicam o mesmo conjunto, medido após `beforeprint` | papel DERIVADO dos cards da tela, não recalculado; sonda com curadoria real: 9 × 9 idênticos; `M8` desliga o consumo do hook ⇒ DETECTADO | **conforme** |
| 9 | `C9`/`D019-VAZ1` — supressão total declara a supressão | `declararSupressao()`; a supressão **parcial** também se declara; `M9` remove o marcador ⇒ DETECTADO | **conforme, com comportamento a mais** |
| 10 | `C10`/`D019-SUF1` — gate fechado ⇒ controle não existe **e o estado não é lido** | `ui_curation_edit_v32.js` §`decorar`: o `return` por gate fechado vem ANTES de qualquer chamada ao bridge; `M10` inverte o predicado ⇒ DETECTADO | **conforme** |
| 11 | Unidade de curadoria = **produto**, nunca par (capability × produto) | `estado.decisions` chaveado por id de catálogo | **conforme** |
| 12 | Owner do estado (R9 §5): renderização consome, nunca escreve | `__CURATION` é a única porta de escrita; editor e apresentação só leem | **conforme** |
| 13 | Um bridge por módulo (R9 §2), registrado | `__CURATION`, `__P53SOL`, `__P53CUR` — três módulos, três bridges, todos em `bridges.json`; o hook de impressão entrou DENTRO do bridge, e não como quarto global | **conforme** |
| 14 | Contagem declarada entra em `expected_suites.json` **no mesmo commit** dos gates (R10 §3) | a suíte entrou no registro só na W7 — **gap 2** | **spec-errada** |
| 15 | Boundary: classe tocada mais alta = `frozen` (§29.4), autorizada em 2026-09-17 | `ui_session_v32.js`, `ui_v32.js` (repinados com trilha inline, duas vezes) e `tests_session_m48.js`; `P50-GOV1` verde | **conforme** |
| 16 | **Aceite de intenção** (refinement §P4): a **leitura arquitetural** é curável | não estava entregue — ver gap 4. Entregue e medida na iteração 2 | **lacuna de implementação, fechada** |

**Score da iteração 1: 13/16 = 81,3%.** Dois dos três não conformes são
**defeitos da spec** e se resolvem por errata, sem tocar em código. O terceiro
— item 16 — era lacuna real de comportamento, e foi **fechado na iteração 2**.

**Score da iteração 2: 14/16 = 87,5%**, com os dois restantes classificados como
`spec-errada` e as erratas propostas abaixo, pendentes de ratificação do
proprietário.

## Gaps, classificados

### Gap 1 — item 2, `spec-errada`: a byte-identidade ficou impossível por decisão do proprietário

A C2 exige que a sessão sem curadoria produza relatório **"byte-idêntico ao
construído sem a demanda"**. Isso era verdade quando a spec foi escrita, e deixou
de ser em **2026-09-18**, quando o proprietário decidiu, no chat, consolidar os
15 blocos de apoio em 9 cards de produto na seção de apoio.

Consolidar **é** mudar o relatório. A exigência de byte-identidade e a decisão de
consolidação são incompatíveis por construção, e a decisão é posterior e do
proprietário — logo é a asserção que cede, nunca o contrário.

**O que a C2 protege continua medido, e com mais dentes do que antes:** ausência
de curadoria não suprime nada. O `D019-CUR2` compara o conjunto **publicado** com
o **ofertado** na ponte e exige igualdade, além de `missing ≠ null ≠ {}`. A
primeira redação do gate só conferia que o relatório não estava vazio — e foi por
isso que o `D019-M2` sobreviveu na W3. A alínea nova é o que o critério sempre
quis dizer.

> **Errata E1 proposta**: substituir *"relatório byte-idêntico ao construído sem
> a demanda"* por *"o conjunto publicado é exatamente o ofertado pelo motor, e a
> chave de curadoria está ausente — nunca `null` nem `{}`"*.
> **Ratificação é do proprietário**, no chat. Escrita sob a delegação de
> 2026-08-29, que cobre portões de fase e não invariante nem critério selado.

### Gap 2 — item 14, `spec-errada`: "mesmo commit" é incompatível com janela vermelha visível

A spec manda a contagem entrar em `expected_suites.json` **no mesmo commit** dos
gates. Cumprir isso ao pé da letra significaria registrar, na W1, a contagem de
uma suíte que nascia com **3 PASS · 7 FAIL** — o red do TDD. O registro é um
oráculo de contagem VERDE: ou ele registraria o vermelho como esperado (e o stage
deixaria de discriminar durante toda a implementação), ou reprovaria a cada
commit por divergência contra um alvo que só se cumpre no fim.

A **R10 §3**, que é a regra, diz *"no mesmo PR"* — e isso foi cumprido: registro e
gates estão no mesmo PR. A spec foi mais estrita que a regra que cita, e o mais
estrito aqui é inexequível.

**Consequência assumida e declarada:** o stage `suites` ficou vermelho da W1 até a
W7, nomeando as duas suítes fora do registro. Considerei declarar exceção nominal
em `known_issues.json` para apagar esse vermelho e **não fiz**: o arquivo está
vazio, nenhuma demanda deste repositório usou essa porta, e a janela vermelha do
TDD é visível de propósito. Apagá-la seria silenciar em vez de medir.

> **Errata E2 proposta**: alinhar a frase da spec à R10 §3 — *"no mesmo PR"* —, e
> registrar que a entrada acontece na wave de fecho, depois do green.
> **Ratificação é do proprietário.**

### Gap 3 — não é gap: a fixture do `D019-PROV1` foi corrigida durante a W6

Registrado aqui porque um leitor do diff vai encontrá-lo e merece a razão.

A C4 diz *"todo item cuja **presença** é decisão do operador"*. A fixture original
marcava como `include` um produto que o motor **já havia oferecido** — cuja
presença, portanto, não é decisão de ninguém. Satisfazer o gate como estava
significaria carimbar *"incluído por decisão do engenheiro"* em item derivado da
avaliação: **o produto passaria a mentir para caber no critério.**

A correção não afrouxa. A alínea (a) passou a usar produto fora da oferta, que é o
caso que a C4 nomeia, e nasceu a alínea (c): o selo **não** pode aparecer em item
ofertado. Sem ela, uma implementação que carimbasse tudo passaria — e rótulo que
aparece em tudo não distingue nada.

### Gap 4 — item 16, `lacuna de implementação`: a leitura arquitetural não estava curável

**É o achado que justifica a existência desta fase.** A tabela do portão da Fase 0
põe a **leitura arquitetural** na coluna *curável*, ao lado de "formas de apoio e
recomendações". A spec da Fase 1 não a levou para nenhum dos dez critérios, e as
sete waves seguintes seguiram a spec.

Resultado medido na Fase 6: o estado a suportava (`architectureNote`, com enum
fechado e `setArchitectureNote`), **nenhuma superfície a honrava** e o editor não
a oferecia. A demanda teria fechado com dez gates verdes e um item combinado por
entregar — invisível para toda a máquina, porque nenhuma máquina o observava.

**Fechado na iteração 2**, com o comportamento e a medição no mesmo passo:

- **um único ponto de consulta** (`v32CuradoriaPublica()`), de propósito: tela e
  papel não podem divergir por esquecimento de um dos dois lados, que é
  exatamente o `EA-58`;
- as duas guardas devolvem `true` na ausência do módulo, na ausência da chave e
  em erro — a curadoria **suprime**, nunca é pré-condição para publicar;
- o controle só aparece quando a leitura EXISTE na sessão, pela mesma razão pela
  qual o editor inteiro não existe com o gate de suficiência fechado;
- alínea (c) no `D019-PAR1`, com **fixture própria** — a sessão de referência não
  declara contexto tecnológico e sem contexto a leitura arquitetural não existe;
  medir ali seria medir o vazio. A alínea confere que excluir a retira das DUAS
  superfícies **e que reincluir a devolve**: exclusão irreversível não é
  curadoria, é destruição.

> **Errata E3 proposta**: acrescentar à spec o critério `C11` — *"a leitura
> arquitetural é curável, e a decisão vale nas duas superfícies"* —, com o
> `D019-PAR1 (c)` como gate. **Ratificação é do proprietário.**

## O que esta validação encontrou e não estava previsto

Cinco gates desta demanda **mudaram de conteúdo sem mudar de nome**, sempre para
medir mais. É a família do `EA-20` — gate que promete asserção e entrega
tautologia — e ela apareceu **cinco vezes**:

| gate | o que media | o que passou a medir | quem denunciou |
|---|---|---|---|
| `D019-PAR1` | igualdade entre dois conjuntos **vazios** | não-vacuidade antes da igualdade | execução da W2 |
| `D019-CUR1` | um estado **intocado** | tenta redigir e exige recusa | `M1` SOBREVIVENTE |
| `D019-CUR2` | que o relatório não estava vazio | publicado × ofertado na ponte | `M2` SOBREVIVENTE |
| `D019-SOL1` | o DOM consolidado **contra ele mesmo** | o par produto × capability contra o MOTOR | `M6` SOBREVIVENTE |
| `D019-SOL2` | um balde `nao-classificado` **vazio** | todo grupo presente se nomeia | leitura do gate |
| `D019-MED1` | derivados que não passam por `MAP` | também a oferta do motor | `M5` SOBREVIVENTE |

**Quatro foram denunciados por mutante sobrevivente, dois por leitura do gate
contra a spec.** Nenhum foi afrouxado: onde havia uma asserção, passou a haver
duas. A leitura canônica desta suíte é **por alínea, nunca por veredito** — a
contagem `10 PASS` significa coisas diferentes na W1 e hoje.

## Execução que sustenta este documento

```
D019 CURADORIA: 10 PASS · 0 FAIL de 10
D019 MUTATION:  11 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 11
PREFLIGHT d019: 11 âncoras, todas com ocorrencias == 1
suites:         0 problema(s)      ·  suites-heavy: session 97 PASS · 0 FAIL
m41:            PASS (payload byte-idêntico ao pinado — critério C5)
P50 CORE + P51: 65 PASS · 0 FAIL   ·  d010: 13 PASS · 0 FAIL  ·  d014: 7 PASS · 0 FAIL
```

**Pendente de CI, e declarado como pendente:** as campanhas `p51` e `p52` exigem
Chromium e ficaram `[FAIL] campanha EXIGIDA (alvo mudou) mas ambiente sem
chromium`. É a **KI-3** — execução canônica no job `visual` do CI. A T023 já
condiciona o fecho a esse job verde, e **a geometria da visão por solução é o
único risco que esta máquina não julga**.
