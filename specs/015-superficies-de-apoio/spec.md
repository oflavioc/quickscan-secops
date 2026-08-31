# Spec — 015-superficies-de-apoio

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md), não o repete.

Rotas aprovadas no portão de 2026-08-31: **S3** (retitular o bloco V3.2 pela
função, nas duas superfícies) · **T3** (declarar a relação entre as curadorias) ·
**P14** (fechar o resíduo `C × I` que a 010 declarou e nunca escreveu). Duas
ratificações do proprietário governam tudo abaixo: **nada é removido** e **o
sufixo "· contexto V3.2" fica**.

## Objetivo

Fazer cada superfície de apoio do relatório dizer o que entrega e de onde vem, sem
remover um byte de conteúdo — atacando a *redundância de promessa* entre os dois
títulos adjacentes e a divergência silenciosa entre as três *curadorias de
habilitadores*.

## Autorização nominal §29.4 — registro

O proprietário autorizou nominalmente, **no chat, em 2026-08-31**, a edição de
**`ui_v32.js`** para esta demanda. A autorização é **NOMINAL, por arquivo, e vale
só para a 015**: não amplia a boundary para outra demanda nem para outro arquivo.

**`ui_target_v32.js` NÃO está autorizado.** Consequência vinculante: nenhum
critério desta spec pode ser satisfeito por edição daquele arquivo, e `D015-GOV1`
existe para provar que ele não foi tocado. Se a Fase 2 concluir que ele é
necessário, o rito é **PARAR e devolver ao orquestrador**, que reabre a pergunta
com o proprietário — nunca assumir cobertura por analogia com a 009 ou a 010.

Consequência mecânica: `ui_v32.js` é pinado por **dois** gates —
`P50-GOV1` (mapa `PROTECTED`, `tests_p50_core.js:192`) e `P50-IC4` — e o registry
`.claude/verify/pins.json:300` carrega a mesma identidade
(`d594dafec00d11efa2c25d6fe3183f1d5177343f09c925dfcc7055b17df9bb85`, conferida
nesta escrita: as duas fontes em acordo). Toda entrega que altere o arquivo exige
**repin inline** com comentário-trilha (R8 §2: motivo, data, "Identidade
anterior") **e** `gen_pins.py` no mesmo PR (R8 §1).

---

## Critérios de aceite → gates

Namespace `tests_015_*.js`; ids `D015-*`. Todo gate abaixo é definido **aqui**,
antes do plano (R3 §1), e é escrito pelo `qa-engineer` — nunca pelo implementador.

| # | Critério | Gate (id · asserção) | Mutante previsto |
|---|---|---|---|
| **C1** | **O título do bloco de prioridades V3.2 deixa de prometer apoio e passa a nomear a leitura que entrega** — porque a promessa é falsa em 2 dos 4 estados do bloco (refinamento, M3). Vale nas **duas** superfícies, com a assimetria do sufixo declarada em C1(d) | **`D015-TIT1`** · (a) o eyebrow de `#v32prio` **não contém** `/apoi(o\|ar\|a)/i`; (b) **contém** a substring exata `· contexto V3.2`; (c) o `<h3>` que precede `#pr-sup-prio` no papel tem **oração principal idêntica** à do eyebrow após remover o sufixo; (d) o `<h3>` do papel **não** contém o sufixo; (e) o eyebrow ≠ e não é substring do título congelado `"Como a Fortinet pode apoiar nas prioridades declaradas"`; (f) **não-vacuidade**: `#v32prio` e `#pr-sup-prio` existem nas fixtures usadas, e a alínea nomeia o estado se não existirem | **M1** restaurar o literal antigo do eyebrow ⇒ (a) morre · **M2** apagar o sufixo ⇒ (b) morre · **M3** editar só a tela ⇒ (c) morre · **M4** copiar o sufixo para o papel ⇒ (d) morre |
| **C2** | **O bloco de apoio junto do gap declara a própria ancoragem** — que a lista parte da *capability* do gap, não do nível respondido. É a metade alcançável de T3 com `ui_v32.js` (a outra metade vive em arquivo não autorizado; ver "Resíduo declarado") | **`D015-ANC1`** · (a) todo `[data-pr-gap-support]` traz **exatamente 1** nó `[data-pr-gap-fonte]`, atributo **próprio** (nunca outro valor de `data-pr-gap-why`, que `P51-REC1` já mede); (b) o texto casa a **propriedade** — ancoragem por capability **e** negação explícita de ancoragem por nível — por duas expressões independentes, nunca pela frase inteira; (c) presente nos **dois** ramos de `qsGapSupportHTML` (contexto declarado e não declarado), medido em duas fixtures; (d) o nó **não** nomeia produto (`!/Forti[A-Z]/`) nem repete a lista; (e) **não-vacuidade**: o conjunto de `[data-pr-gap-support]` é não vazio e a contagem é a esperada em cada fixture, declarada no gate | **M5** emitir só no ramo "não declarado" ⇒ (c) morre · **M6** trocar o texto por afirmação de ancoragem por nível ⇒ (b) morre · **M7** reusar `data-pr-gap-why` em vez do atributo próprio ⇒ (a) morre |
| **C3** | **A regra geral entra na caixa "Como interpretar este relatório"** — um 7º item, **estático**, dizendo que o relatório pode apresentar mais de uma lista de possibilidades para o mesmo gap, que elas partem de catálogos e ancoragens diferentes, e que **não se somam** como recomendação | **`D015-HOWTO1`** · (a) `#pr-howto li` = **7**, dentro da faixa 5–8 que `P51-DOC12` (`tests_p50_core.js:3825-3826`) e o gate de PDF (`tests_p50_chromium.js:3595`) exigem; (b) `txt(#pr-howto).length ≤ 900`, com o valor **medido antes e depois** registrado no gate (limite em `:3828` e `:3597`); (c) o novo item casa a propriedade (duas expressões: "mais de uma lista" + "não se somam"), nunca a frase; (d) a caixa continua **estática** — `outerHTML` idêntico entre duas sessões de dados diferentes; (e) os 6 conteúdos exigidos por `P51-DOC12:3831-3837` continuam casando | **M8** tornar o item função da sessão ⇒ (d) morre · **M9** remover o item ⇒ (a) e (c) morrem · **M10** escrever o item longo o bastante para estourar 900 ⇒ (b) morre |
| **C4** | **O resíduo `C × I` é declarado na tela, e só onde ele existe** — quando a leitura congelada da Camada 1 está visível, uma linha diz que o cenário-alvo pode listar os mesmos itens porque as duas partem do mesmo catálogo congelado, ancorados de formas diferentes | **`D015-RES1`** · (a) com a Camada 1 **visível** (estados E1 e E2), `#v32panel` traz **exatamente 1** `[data-v32-relacao="catalogo-unico"]`; (b) com a Camada 1 **oculta** (estado E3), o nó **não existe** — contraprova que impede a linha de virar decoração permanente; (c) o texto é **condicional** ("onde houver prática-alvo declarada") e **não afirma** a existência do cenário-alvo — asserção: ausência de `/o cenário-alvo (traz\|lista\|apresenta)/i` sem antecedente condicional; (d) o nó não nomeia produto e a contagem de `.v32-decl-row` consumida por `p52ContextSummary` fica **inalterada**; (e) **não-vacuidade**: em E1 e E2 o gate mede que a Camada 1 está de fato visível — nenhum título de `HIDE_EYEBROWS` com `.v32-hidden` | **M11** emitir incondicionalmente ⇒ (b) morre · **M12** nunca emitir ⇒ (a) morre · **M13** trocar a frase condicional por afirmativa ⇒ (c) morre |
| **C5** | **Nada é removido** — a ratificação do proprietário, como asserção. É o instrumento que a 010 só construiu depois da reprovação (E18) | **`D015-NOSUB1`** · contra **âncora de commit imutável + SHA** (R10 §5, nunca `HEAD:`), nos estados E1–E7: (a) o conjunto de `data-cap` de `#v32prio` é **idêntico**; (b) o conjunto de nomes em `[data-pr-gap-opt]` é **idêntico**; (c) os conjuntos de `data-cap` de `#pr-sup-prio`, `#pr-sup-base` e `#pr-sup-maturity` são **idênticos**; (d) `txt(#pr-support).length` e `txt(#pr-findings).length` **não diminuem**; (e) **não-vacuidade**: cada conjunto comparado é não vazio em ao menos uma fixture, nomeada no gate | **M14** colapsar em aviso o card de prioridade sem payload (a rota S4, recusada) ⇒ (a) morre · **M15** suprimir o `pr-gapsup` do qid que é prática-alvo (rota T5, recusada) ⇒ (b) e (d) morrem |
| **C6** | **A autorização não foi excedida** — `ui_target_v32.js` intocado, provado pelo **produto**, não só pelo hash | **`D015-GOV1`** · (a) `#pr-target` **byte-idêntico** entre a âncora imutável e HEAD, nos estados E1–E7 — inclui `.ux-tgt-en`, `[data-ux-enablers="a-validar"]` e `[data-ux-absence="target-enablers"]`; (b) o conjunto de `data-eid` do card-alvo é idêntico; (c) **não-vacuidade**: ao menos uma fixture com `#pr-target` presente e com `[data-ux-enablers]` não vazio, nomeada no gate; (d) o gate **nomeia** o estado E6 (sem cenário-alvo) como o caso em que `#pr-target` legitimamente não existe, e não o confunde com regressão | **M16** mover a declaração de C2 para o card-alvo ⇒ (a) morre — é o mutante que guarda a boundary, não o comportamento |

### Guarda de tautologia — por critério

O coordenador pediu, e a 010 pagou sete vezes por não ter: *existe estado
alcançável em que o critério falha?* Onde a resposta for "não" ou "não sei", está
escrito.

| Alínea | Existe estado alcançável de falha? | Consequência declarada |
|---|---|---|
| `D015-TIT1` (a)–(e) | **Não, por sessão.** O eyebrow e o `<h3>` são **literais constantes**: uma vez implementados, nenhuma sessão os faz variar | **Dívida declarada, não disfarçada:** o discriminante destas alíneas é **exclusivamente o mutante** (M1–M4), nunca a fixture. Rodar mais fixtures não aumenta o poder do gate. Registrar assim na matriz; contagem de fixtures aqui é ruído |
| `D015-TIT1` (f) | **Sim** — E5 (sem prioridades) não produz `#v32prio` | A alínea tem de **nomear o estado**, não fechar verde por ausência de sujeito (lição do `D010-INV7`, achado `EA-11`) |
| `D015-ANC1` (a)(b)(d) | **Não, por sessão** — texto constante nos dois ramos | Mesma dívida de C1: discriminante é M6/M7 |
| `D015-ANC1` (c) | **Sim** — os dois ramos dependem de `TECH_LANDSCAPE[cap].presence` | Discriminante real por fixture; M5 o prova |
| `D015-ANC1` (e) | **Sim** — E6/E7 e sessões sem gap nos 4 qids esvaziam o conjunto | É a guarda que impede (a)–(d) de fecharem verdes sobre conjunto vazio |
| `D015-HOWTO1` (a)(b)(c)(e) | **Não, por sessão** — a caixa é estática por exigência de `P51-DOC12` | Discriminante é M8–M10 |
| `D015-HOWTO1` (d) | **Sim** — basta o item passar a depender de `ans`/`suff` | Único ponto do C3 com discriminante de estado |
| `D015-RES1` (a)(b)(e) | **Sim** — E1/E2 × E3 são estados distintos e alcançáveis por construção (`hasSubstituteV32`) | Critério com discriminante real; é o mais forte da spec |
| `D015-RES1` (c) | **Não sei.** A asserção é uma regex de ausência sobre texto constante; se a frase for reescrita mantendo a condicionalidade, a regex pode passar a não medir nada | **Declarado como incerto.** O `qa-engineer` decide na Fase 4 se M13 morre de fato; se não morrer, a alínea vira dívida com causa, nunca é afrouxada (R10 §1) |
| `D015-NOSUB1` (a)–(d) | **Sim** — qualquer remoção reprova; M14/M15 são as duas remoções que o portão recusou | Discriminante real |
| `D015-NOSUB1` (e) | **Sim** — fixture mal escolhida esvazia o conjunto | Guarda contra a vacuidade que a 010 encontrou em 4 alíneas (errata `a43d6f4`) |
| `D015-GOV1` (a)(b) | **Sim** — M16 o prova, e qualquer edição de `ui_target_v32.js` reprova | Discriminante real |
| `D015-GOV1` (d) | **Não** — é uma cláusula defensiva sobre E6 | **Cláusula inalcançável por construção, declarada, sem mutante** — classe já registrada em `design-decisions.md` §Candidatas pela 010. Não reportar como código morto |

---

## Comportamento especificado

### Estados de sessão exigidos pelas fixtures

Reuso de `D010-F1`…`F4` onde couber é decisão da Fase 2; o que a spec exige é
**cobertura de estado**, nomeada:

| Id | Estado | Por que existe |
|---|---|---|
| **E1** | Legado puro — nada declarado (`isLegacyModeV32()` verdadeiro) | Camada 1 visível, `#v32support` inexistente. É onde o resíduo `C × I` nasce e onde `#v32prio` **não tem sujeito** |
| **E2** | Vão de contexto parcial **sem** substituto | Camada 1 visível **e** `#v32prio` presente — o pior caso da redundância de promessa, e o estado do cliente pós-010 |
| **E3** | Vão **com** substituto | Camada 1 oculta — a contraprova de `D015-RES1(b)` |
| **E4** | Contexto completo, prioridade com gap | `#v32prio` com card cheio: o estado em que o título tem de continuar verdadeiro |
| **E5** | Sem prioridades declaradas | `#v32prio` não nasce; a Camada 1 troca para "Como a Fortinet pode apoiar agora". Sujeito ausente, nomeado |
| **E6** | Sem cenário-alvo declarado | `#pr-target` não existe (`ui_target_v32.js:426`). Guarda de `D015-GOV1(d)` |
| **E7** | Suficiência **fechada** | Nenhuma decisão desta demanda pode ampliar publicação sob gate fechado (INV-3) |

### Superfície 1 · `#v32prio` — tela (`ui_v32.js:749-750`)

**Entrada:** há ao menos uma capability com prioridade declarada e a sessão não é
legada. **Saída esperada:** o eyebrow nomeia a **leitura** que o bloco entrega, e
não o apoio que ele nem sempre entrega; o sufixo `· contexto V3.2` permanece,
porque é o único desambiguador em relação ao título congelado da 7ª seção.

Literal **candidato, não vinculante**: `Leitura das prioridades declaradas ·
contexto V3.2`. O gate assere **propriedades** (C1 a–e), nunca o literal — o
oráculo não pode ser equivalente por construção à spec. A escolha da redação é do
`ui-engineer`; o julgamento da redação é do `product-owner` na Fase 6.

Os quatro estados do bloco (refinamento, M3) permanecem **intactos**: card
completo, card com serviços, card de encaminhamento e card neutro de prioridade.
Nenhum é colapsado, nenhum muda de conteúdo — `D015-NOSUB1(a)` é a prova.

### Superfície 2 · `#pr-sup-prio` — papel (`ui_v32.js:1275`)

Mesma oração principal do eyebrow, **sem** o sufixo. A assimetria é **declarada,
não acidental**: o sufixo existe para desambiguar de um bloco que só existe na
tela — a Camada 1 nunca é impressa (`ui_v32.css:77`). Isso converte a divergência
tela×papel que o refinamento registrou em decisão escrita.

### Superfície 3 · `[data-pr-gap-support]` — papel (`ui_v32.js:1075-1099`)

**Entrada:** finding cujo qid está em `QS_GAP_SUPPORT` (4 de 15). **Saída
esperada:** além do que já existe, um nó `[data-pr-gap-fonte]` declarando que a
lista parte da **capability** do gap e **não** do nível respondido — a diferença
de ancoragem que produz as listas divergentes medidas no refinamento (M5, 3 de 7
combinações em que nenhuma lista contém a outra).

Restrições duras, todas vindas de `P51-REC1` (`tests_p50_core.js:3336-3437`), que
**não é editado** e é regressão obrigatória:

- o nó é **irmão** de `[data-pr-gap-why]`, com atributo próprio — herdar o
  atributo alheio quebraria o gate da 5.1 sem tocar em código dele;
- todas as opções de `QS_GAP_SUPPORT[qid].opts` continuam listadas (`:3380-3383`);
- o texto **termina em ponto final** — o scanner de FortiClient fatia
  `host.textContent` por `"."` (`:3418`), e uma frase sem ponto se funde à
  vizinha e pode arrastar "FortiClient" para fora do escopo de endpoint;
- o texto não introduz nenhuma das expressões de overclaim (`:3429`) sem negação
  nas 60 posições anteriores.

### Superfície 4 · `#pr-howto` — papel (`ui_v32.js:1110-1121`)

Um 7º item, **estático**, com a regra geral. É a superfície canônica de "como
ler" e já promete ao leitor que "as recomendações são possibilidades" — a regra
nova é a continuação natural, e entra sem criar bloco novo em nenhuma tela.

### Superfície 5 · `#v32panel` — tela (`ui_v32.js:238-243` e `:294-304`)

Uma linha, `[data-v32-relacao="catalogo-unico"]`, emitida **apenas quando a
leitura congelada da Camada 1 está visível** — nos dois ramos de `renderBlocks`.
Predicado: `legacy || !haSubstituto`, calculado **uma vez por render**, do mesmo
veredito que a 010 já usa (`:253`). Sem estado novo, sem cache, sem leitura de
DOM alheio.

**O trade-off, escrito porque o cliente o nomeou.** O item 8 termina com *"a não
ser que isso torne a tela muito poluída"*. Esta linha **acrescenta texto a uma
tela que o cliente já achou carregada**, e o faz numa seção (Contexto tecnológico)
que fala sobre outras duas (Cenário-alvo e Formas de apoio) — arquitetura de
informação fraca, adotada porque é a única superfície de tela que `ui_v32.js`
possui. O host **certo** seria dentro das duas superfícies que efetivamente
duplicam, e as duas estão fora do alcance: uma é `ui_target_v32.js` (não
autorizado), a outra é a Camada 1 (`frozen`). Se o proprietário julgar a linha
ruído, **C4 cai** e o resíduo volta a ficar aberto e declarado — o que é resultado
legítimo, pela doutrina ratificada em P5 do refinamento.

---

## Contratos

**Nenhum bridge novo, nenhum `window.__*` novo, nenhum módulo novo, nenhum CSS
novo.** Tudo vive dentro do IIFE de `ui_v32.js` (`:8`).

| Item | Shape | Owner do estado (R9 §5) | Consumidores |
|---|---|---|---|
| `[data-pr-gap-fonte]` | nó de texto dentro de `[data-pr-gap-support]` | **nenhum estado novo** — função pura de `f.id` e do literal | `D015-ANC1`; leitor do PDF |
| `[data-v32-relacao="catalogo-unico"]` | nó de texto dentro de `#v32panel` | **nenhum estado novo** — função do veredito `haSubstituto`, já calculado por `renderBlocks` e já owner de `ui_v32.js` | `D015-RES1`; leitor da tela |
| 7º `<li>` de `#pr-howto` | literal estático | **nenhum** | `D015-HOWTO1`, `P51-DOC12` |

**Serialização (INV-8):** nada acima entra na sessão; tudo recomputa no import.

**Acoplamento recusado, com a razão.** Condicionar a linha de C4 à existência de
prática-alvo exigiria ler `TARGET_PROFILE` ou chamar `tgtHasOverrides()` — símbolos
de `ui_target_v32.js`, que não é IIFE (`:1-11`) e portanto os expõe no escopo
global. **Recusado**: seria acoplamento inter-módulo novo fora de bridge (R9 §3),
para dentro do arquivo que esta demanda está proibida de tocar. O remédio é o
**fraseado condicional** de C4(c), que torna a linha verdadeira sem consultar o
estado alheio.

---

## O que NÃO é mensurável por gate — declarado, não disfarçado

O coordenador pediu explicitamente: *"a asserção tem de ser sobre observável; se
não der para medir sem inspeção humana, declare"*.

| O que se quer | O que o gate mede | O que fica fora |
|---|---|---|
| Que a relação entre as curadorias foi **declarada** | Presença do nó, no estado certo, com atributo próprio, casando **duas expressões independentes** sobre a propriedade (ancoragem por capability × por nível), sem nomear produto e sem afirmar o que a sessão não sustenta | **Se o leitor entende.** Nenhum gate mede compreensão |
| Que os títulos deixaram de competir | Ausência do token de promessa no eyebrow, presença do sufixo, paridade de oração principal entre tela e papel, distinção do título congelado | **Se a redação escolhida é boa.** O gate impede o título falso; não produz o título bom |
| Que a tela não ficou poluída | Nada | **Integralmente humano.** É julgamento do proprietário sobre tela/PDF real — e é a ressalva que o próprio cliente escreveu |

**Consequência de processo:** a Fase 6 desta demanda **não fecha só com gate
verde**. O aceite de intenção precisa de leitura humana da redação e do PDF real.
Onde o `spec-validate` acusar "critério sem asserção", a resposta correta é esta
seção — não uma regex inventada para dar aparência de medida.

**Escolha de forma, com o custo.** As asserções de texto usam **atributo
declarado + duas expressões sobre a propriedade**, nunca a frase inteira. Custo
aceito: uma reescrita que preserve a propriedade passa no gate sem reexecução —
é o preço de não repetir o padrão "prova manual apodrece" (errata E16 da 010) e
de não pinar prosa PT-BR num oráculo (R10 §6).

---

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** INV-7 é a governante e é o que a
  demanda serve: título e nó novos são funções determinísticas de estado já
  calculado, e nenhum afirma mais do que a sessão sustenta. INV-2 preservada — a
  oração "nenhum produto é inferido sem contexto" (`ui_v32.js:635-636`, pinada por
  `V10`) fica intacta, e nenhum texto novo converte "não informado" em "não tem".
  INV-3: nenhuma publicação nova sob gate fechado (estado E7 é fixture obrigatória).
  INV-1: `engine_v32.js` e a Camada 1 apenas **lidos**;
  `declared.m41_payload_sha256` (`pins.json:14`,
  `9794b267e4225d8f…4365b`) permanece inalterado — Porta B fechada.
  INV-8: nenhum derivado serializado. INV-10: PT-BR na doc, literais de código
  exatos.
- [x] **`design-decisions.md` — nenhum conflito.** O arquivo canônico é
  `.claude/rules/design-decisions.md` (na raiz **não existe** — resultado
  negativo, já registrado pela 010 e reconfirmado nesta escrita). A entrada
  "cláusula defensiva inalcançável por construção, declarada, sem mutante"
  cobre `D015-GOV1(d)`.
- [x] **Specs validadas anteriores — nenhuma contradição.** `specs/009` (ordem
  canônica de leitura, ratificada 2026-08-27): **intocada**, esta demanda não
  altera chave nem ordem de seção. `specs/010`: esta spec **consome** a §"Fora de
  escopo" item 1 (item 6a adiado por desenho, "reavaliar com evidência de tela,
  depois de V1" — `spec.md:588-594`) e a fecha; e **fecha** o resíduo do caso C1
  do refinamento da 010 ("exige texto que a explique"), que nunca foi escrito.
  `specs/011`: outra superfície, sem interseção.

### Specs de fase seladas — por leitura, com resultado negativo

Fonte: `.claude/verify/current_phase.json:18-25` — **uma** entrada em
`specs_normativas`: `specs/PHASE_5_0_REV_B.md`, sha
`4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b`. Fase corrente
**5.2 SELADA**; `proxima_fase` `NAO_ABERTA`. Aberta e lida nesta escrita:

**Positivo — o que toca o escopo:**

- `specs/PHASE_5_0_REV_B.md:1613-1620` — §29.4 "Protegidos (lista nominal; edição
  proibida nesta fase)" nomeia **textualmente** `ui_v32.js` (`:1616`), junto de
  `engine_v32.js` e da Camada 1 (`:1615`), e inclui **"todas as suítes congeladas
  (`tests_*.js` existentes)"** (`:1618-1619`). Consequência direta:
  `tests_p50_core.js`, `tests_ui_m32.js`, `tests_ui_m332.js` e
  `tests_p50_chromium.js` — os quatro que esta spec cita como regressão — **não
  podem ser editados**; a única escrita permitida em `tests_p50_core.js` é o
  **repin inline** de `PROTECTED` pelo rito da R8 §2.
- `specs/PHASE_5_0_REV_B.md:1625-1629` — §29.5 encerra com **"Nenhuma superfície
  de print/PDF (protegidas; §23)"**. Três dos cinco alvos desta demanda são de
  papel.
- `specs/PHASE_5_0_REV_B.md:1631-1636` — §29.6: novas semânticas em PDF exigem
  "microfase explicitamente autorizada de Print/Render UX" e **"não recebe
  autorização implícita"**.
- `specs/PHASE_5_0_REV_B.md:1638-1641` — o rito: `STOP → classificar o requisito →
  abrir microfase dedicada → revisão independente`.

**Encaminhamento da §29.5/§29.6, sem assumir cobertura:** a autorização nominal de
2026-08-31 é **por arquivo** (`ui_v32.js`), e o caminho de print vive dentro dele
(`buildPrintReport`, `:1152`). As demandas **009** e **010** editaram o caminho de
print dos arquivos §29.4 sob autorização nominal de mesma natureza, e os dois
registros de aceitação a trataram como coberta. Registro o precedente **e o
limite**: se o proprietário entender que §29.6 exige palavra própria para o papel,
a Fase 4 **para** — isso está em DEPENDÊNCIAS como confirmação de uma linha, não
como suposição desta spec.

**Negativo — o que a leitura NÃO encontrou, e importa:**

- **Nada** em `specs/PHASE_5_0_REV_B.md` sobre **título de bloco de apoio,
  redundância entre superfícies, reconciliação de curadorias de habilitadores ou
  arquitetura de informação do resultado.** A spec selada governa *quais arquivos*
  e *quais superfícies visuais*; não governa *o que os títulos dizem*.
- **Nada** sobre `QS_GAP_SUPPORT`, `MAP`, `PRODUCTS`, `OFFERINGS` ou modo legado.
  A §UAT-07, que governa a tabela de 4 qids, **não é spec normativa**: não consta
  de `specs_normativas` e vive apenas como âncora citada dentro do oráculo
  (`tests_p50_core.js:3385-3390`). Registro o negativo porque ele delimita o que
  esta demanda pode fazer sem reabrir diretriz: **reusar a regra é livre; tocar a
  tabela, não**.
- **Nada** em `specs_normativas` sobre a propriedade "prioridade declarada nunca
  desaparece". Ela é real e vinculante, mas vive **só** nos gates
  (`V10`/`V15`/`V21`/`V22`/`P5`/`P7`/`D010-ABS1`) e em comentário de código
  (`ui_v32.js:722`, `:738`) — **invariante de fato sem âncora normativa escrita**.
  Vai para o backlog como achado (ver "Referenciado, não absorvido").

### Boundary (R6) — as três fontes cruzadas

| Ordem | Fonte | O que diz sobre `ui_v32.js` | O que diz sobre `ui_target_v32.js` |
|---|---|---|---|
| 1ª | `.claude/verify/boundary.json:6-36` (classes) | **Ausente.** `frozen` lista só `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json` (`:9-14`) | **Ausente** |
| 2ª | `PROTECTED` / `frozenSuites` (`tests_p50_core.js:82`, `:192`, `:446-449`) | **Presente e pinado** — `d594dafe…9bb85`; guardado por `P50-GOV1` **e** `P50-IC4` | **Presente e pinado** — `81adcb21…c8f5c` (`:302`) |
| 3ª | `.claude/verify/pins.json:300` / `:296` | `d594dafe…9bb85` — **em acordo** com a 2ª | `81adcb21…c8f5c` — **em acordo** |
| — | `specs/PHASE_5_0_REV_B.md:1616` (§29.4) | **Protegido, nominal** | **Protegido, nominal** |

**Resultado negativo declarado:** um cross-check feito **só** contra
`boundary.json` devolveria "`ui_v32.js` é livre" — **falso negativo**, o mesmo que
a 009 cometeu e que só o gate vivo `P50-GOV1` pegou, já na implementação. A lista
legível por máquina é a **menor** das três. Precedência aplicada: onde a prosa
selada divergir do executável, vale o regime de pins (R8;
`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2) — e aqui **não há
divergência**: as três fontes concordam que `ui_v32.js` é protegido e pinado.

**Rito nomeado, autorização PARADA aqui:**

- `ui_v32.js` — **protegido**; autorização nominal §29.4 concedida em 2026-08-31,
  registrada acima. Exige **repin inline** (R8 §2) + `gen_pins.py` no mesmo PR
  (R8 §1). `P50-GOV1` e `P50-IC4` vão reprovar até o repin, e essa janela vermelha
  é **declarada** no `tasks.md`, nunca silenciada.
- `ui_target_v32.js` — **protegido e NÃO autorizado**. Qualquer necessidade dele
  é `STOP` e devolução ao orquestrador.
- `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html` — **`frozen`**, apenas
  lidos. Porta B não é aberta.
- Suítes congeladas — **não editadas**; a única escrita é o repin inline.
- `.claude/verify/pins.json` — classe `registry`: só via `gen_pins.py`, no mesmo
  PR, com motivo no commit.

---

## Fora de escopo

Herdado do refinamento (itens 1–14) e, adicionalmente:

1. **Editar `ui_target_v32.js`** — não autorizado. Consequência aceita: a metade
   simétrica de T3 (o card-alvo declarando a própria ancoragem) **não é entregue**
   nesta demanda. Fica como resíduo declarado, não como omissão.
2. **Editar qualquer suíte congelada** — inclusive `tests_p50_core.js`,
   `tests_ui_m32.js`, `tests_ui_m332.js` e `tests_p50_chromium.js`, que são
   regressão obrigatória e permanecem verdes **sem alteração**. Única escrita: o
   repin inline de `PROTECTED` (R8 §2).
3. **Remover o sufixo "· contexto V3.2"** — ratificação do proprietário. Se a
   implementação concluir que o título ficou intragável com ele, o rito é **parar
   e devolver**, não decidir.
4. **Renomear seção de `P52_SECTIONS`** — apodrece âncora de mutante em duas
   campanhas (`tests_009_mutants.js:127-135`, `tests_p52_mutants.js:244-245`).
5. **Alterar `QS_GAP_SUPPORT`, `QIDS_AUTORIZADOS` ou `MAP`** — a demanda reusa a
   regra e **não** toca tabela nem catálogo.
6. **Reconciliar as curadorias numa fonte única** — demanda própria (P9 do
   refinamento), exige decisão do proprietário sobre reabrir a §UAT-07.
7. **Reconciliar os nomes de capability** entre Camada 1 e engine — achado.
8. **Score, suficiência, tier, estágio, cenário-alvo** — nenhum número muda.
9. **CSS, bridge, módulo, `window.__*`** novos.
10. **Escrever em `.claude/BACKLOG.md`** — alocação de id `EA-*` é do `doc-writer`.

---

## Referenciado, não absorvido

Roteado pelo orquestrador; esta spec **não** os executa nem os transforma em
critério de aceite:

| Item | Dono | Onde vive |
|---|---|---|
| Os 5 itens de medição do `qa-engineer` (pin do literal do eyebrow; `P52-SUP3` pós-S3; contagem de cards sem payload em `#v32prio`; confirmação por execução dos achados **B** e **D**) | `qa-engineer` | `refinement.md` §"O que ficou por medir" |
| Evidência de tela do estado **C2**/E2, pós-E18 | `qa-engineer` | idem |
| Os 4 achados `EA-*` (curadorias divergentes · `P51-REC1` promete "sem duplicação" e não mede · dois nomes para a mesma capability · `neutralPrioCardHTML` sob capability madura) | `doc-writer`, **depois** de conferir a `develop` | `refinement.md` P13 |
| **Achado novo desta escrita:** "prioridade declarada nunca desaparece" é invariante de fato **sem âncora normativa escrita** — vive só em gates e comentário de código | `doc-writer` (id) · `product-owner` (redação) | esta spec, §Cross-check |
