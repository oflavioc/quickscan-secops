# Spec — 023-leitura-unica-do-apoio

> Fase 1 · donos: product-owner + tech-lead · referencia o [refinement.md](refinement.md), não o repete.

## Objetivo

A leitura congelada some quando **existe substituto publicado** — e volta quando ele
deixa de existir, inclusive quando é o operador que o remove.

## A quarta rota, e por que ela não esvazia o gate

O refinamento mediu três rotas, todas custando invariante. Esta spec propõe a
quarta, e ela nasce de uma medição feita na Fase 1:

```
ofertados: 11 → curadoria exclui os 11 → cards por produto: 0 → aviso de supressão: presente
```

**"Sem substituto" continua alcançável.** Não pela ausência de contexto declarado —
que hoje é o caso comum e não deveria significar ausência de substituto —, mas pela
**supressão**: quando a curadoria remove tudo, ou quando não há produto a publicar.

O `D010-ARB1` é **reancorado, não esvaziado**: troca de sujeito, de *"contexto não
declarado"* para *"substituto suprimido"*. E o sujeito novo é mais forte, porque
cobre o caso em que o operador desfaz o substituto deliberadamente — exatamente o
vão que a demanda 010 existe para impedir.

**Isto amenda a demanda 010**: o predicado da §1 e a fixture do `D010-ARB1`. É
oráculo declarado de outra demanda, e a emenda precisa de **ratificação do
proprietário** — precedente da errata `E19` da 015.

## Critérios de aceite → gates

Suíte nova: `tests_023_leitura.js`. Campanha: `tests_023_mutants.js`.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| **C1** | Sem contexto declarado, **com** produto publicado, a leitura congelada é **oculta** — **inclusive em modo legado** (errata **E1**) | `D023-OCU1` · `tests_023_leitura.js` · o caso do relato: os nós da Camada 1 saem com `v32-hidden`, os cards por produto **permanecem visíveis**, e a seção passa a ter **uma** leitura | `M1` · manter o predicado antigo · `M1b` · restaurar a imunidade do ramo legado |
| **C2** | **Nada piora com contexto declarado**, e a segunda fonte é **aditiva** | `D023-REG1` · idem · censo idêntico ao de hoje, cards intactos, e — alínea (d), nascida da campanha — com contexto declarado E produto suprimido a congelada **continua oculta**, porque os cards de capability seguem sendo substituto | `M2b` · a segunda fonte substituir a primeira em vez de somar |
| **C3** | Curadoria suprime **tudo** ⇒ o substituto some ⇒ a congelada **volta visível** | `D023-SUP1` · idem · exclui os ofertados; cards = 0; Camada 1 **visível**; aviso de supressão presente | `M3` · ignorar a curadoria no predicado — o vão da 010 de volta |
| **C4** | Tudo-ou-nada preservado | `D023-ARB1` · idem · o conjunto oculto é **∅ ou exatamente** a Camada 1, nunca parcial | `M4` · ocultar o título e parar |
| **C5** | O `D010-ARB1` segue com **sujeito alcançável** | `D023-SUJ1` · idem · a fixture nova de "substituto suprimido" produz `hasSubstitute === false` **e** Camada 1 presente e visível | `M5` · tornar o predicado sempre verdadeiro |
| **C6** | O papel acompanha a tela **no que o papel carrega** (errata **E2**) | `D023-PAP1` · idem · coerência entre o conjunto publicado, os cards impressos e o aviso de supressão; a ocultação da Camada 1 **não é medível no papel** e fica declarada, com contraprova | `M6` · arbitrar só na tela |
| **C7** | **Nada é removido** — a lista continua no DOM, apenas oculta | `D023-DOM1` · idem · o título congelado e os itens **existem** em todos os cenários; o que muda é `v32-hidden` | `M7` · remover em vez de ocultar |
| **C8** | Nenhum `frozen` tocado e a régua D2 imóvel | `D023-BND1` · idem · identidade dos 4 `frozen` + payload M41 == pinado | — (coberto por `baseline`/`m41`) |
| **C9** | Em modo legado a arbitragem atravessa, e **nada mais** (errata **E1**) | `D023-LEG1` · idem · sob `isLegacyModeV32()` **sem produto publicado** a congelada permanece; e em modo legado `#v32support` continua **ausente** e o convite ao editor continua **presente** | `M8` · ocultar em modo legado **sem substituto** · `M8b` · fazer a V3.2 governar o resto |

**C3 e C5 são o par que sustenta a demanda.** Sem eles, alargar o predicado seria
exatamente o que o refinamento mediu como custo inaceitável: um gate sem sujeito.

## Comportamento especificado

**O predicado passa a ser**: existe substituto quando há **pelo menos um produto
publicado** na visão por produto — isto é, ofertado pelo motor **e não suprimido
pela curadoria**.

| cenário | substituto | Camada 1 | o que o cliente vê |
|---|---|---|---|
| **modo legado, com produto** (errata **E1**) | **sim** | **oculta** | **uma** leitura: os cards — **é o caso do relato** |
| sem contexto de capability, fora do legado, com produto | **sim** | oculta | **uma** leitura: os cards |
| com contexto, com produto | sim | oculta | igual a hoje |
| curadoria suprimiu tudo | **não** | **visível** | a leitura congelada, com o aviso de supressão |
| sem gap algum | não | — | nada a arbitrar |
| modo legado, **sem** produto publicado | não | visível | a leitura congelada, e o convite ao editor |

**O que NÃO muda**: a ordem das seções, o conteúdo dos cards, o escalonamento da
022, o motor e o que ele recomenda.

## Contratos

**Estado novo: nenhum.** O predicado continua derivando do que já existe:
`computeFindings()`, o `MAP`, os sinais declarados e `__CURATION.published()`.

**Owner do estado (R9 §5)**: inalterado. A curadoria segue dona das decisões do
operador; o predicado é **leitor**, nunca escritor.

**Dependência nova**: `hasSubstituteV32` passa a consultar a curadoria. Isso cria
acoplamento entre o módulo de decisão da 010 e o de curadoria — declarado aqui, e
medido pelo `C5`, que é quem garante que o acoplamento não apaga o sujeito do gate.

## Cross-check (obrigatório)

- [x] **Invariantes R1** — **INV-9** tangenciada e preservada: nada de `frozen` é
  tocado (C8), e a Camada 1 **não é removida**, só ocultada (C7). INV-4/INV-6
  intactas: o predicado não toca score nem suficiência.
- [x] **design-decisions.md** — **conflito declarado e emendado**: a entrada da 020
  registra a refutação; a emenda de 2026-10-01 registra a reversão do proprietário
  e aponta para esta demanda. Não há contradição em silêncio.
- [x] **Specs validadas anteriores** — **a 019 também é emendada (errata `E1`)**:
  a alínea **(c)** do `D019-CTX1` afirma que a `fronteira()` não existe em modo
  legado, e o motivo declarado nela é proteger o sujeito do `D010-ARB1 (c)` —
  sujeito que esta demanda reancora. Medido: a fixture de controle dela publica
  11 produtos, logo sob `E1` a fronteira passa a existir ali. Emenda ratificada
  pelo proprietário em 2026-10-02, no mesmo portão da escolha da rota B.
- [x] **Specs validadas anteriores** — **a 010 é EMENDADA, não contradita**: o
  predicado da §1 e a fixture do `D010-ARB1` mudam de sujeito, e o invariante que
  ela protege fica **mais forte** (cobre a supressão pelo operador). A emenda
  precisa de ratificação do proprietário — precedente da `E19` da 015. A 022 não é
  tocada: ondas, teto e tensão seguem como estão.
- [x] **Specs de fase seladas — por leitura.** `specs/PHASE_5_0_REV_B.md`,
  identidade conferida (`4f1583c7…`). Duas cláusulas tocam o escopo:
  - `:274` **UX-P8** — *"trocar aba, modo, filtro ou visualização não altera score
    ou canonical state"*: ocultar a Camada 1 é visualização, e o **C8** mede que
    nada canônico se move;
  - `:270` **UX-P7** — não depender só de cor: a ocultação é estrutural
    (`v32-hidden`), não cromática; nada a acrescentar.
  Resultado negativo, que também é leitura: **nada** sobre substituto, arbitragem
  ou visão por produto em `PHASE_5_0_REV_B.md` — aquelas superfícies nasceram
  depois da 5.0.
- [x] **Boundary (R6) — três fontes cruzadas.** `boundary.json`: os quatro `frozen`
  **não são tocados**. `PROTECTED` (`tests_p50_core.js`): **`ui_v32.js` será
  tocado** (o predicado vive em `:702`) — **autorização §29.4 PARADA AQUI**, a
  pedir neste portão. `pins.json`: repin no mesmo PR (R8). Nenhuma divergência
  prosa×executável encontrada nesta leitura.

## Erratas

### E1 · 2026-10-02 — o modo legado entra no escopo, e por quê

**A Fase 4 mediu que "sem contexto declarado" são DOIS mundos**, e que a spec
original só alcançava o segundo:

| o que foi declarado | `isLegacyModeV32` | substituto (antigo) | ocultos | cards |
|---|---|---|---|---|
| **nada** | **`true`** | false | 0 | 11 |
| só `saasAllowed=yes` | `false` | false | 0 | 11 |
| capability `NONE` | `false` | true | 3 | 11 |

Sessão em que **nada** foi declarado é modo legado: `renderBlocks` toma o ramo
legado e chama `hideLegacyRecommendation(app, false)`
**incondicionalmente** (`ui_v32.js:249`), e o predicado **não é consultado**. Alargá-lo não muda nada
ali.

**O proprietário confirmou, no chat de 2026-10-02, que a sessão real que
originou o relato NÃO usou o editor de contexto tecnológico** — era o primeiro
mundo. A spec como estava **não corrigiria o caso relatado**. Posta a escolha
entre (A) entregar o mundo vizinho, (B) estender a arbitragem ao modo legado e
(C) fazer a visão por produto desaparecer em modo legado, a decisão foi
**B** (*"Não usei o contexto tecnológico na última sessão. Vamos com a B"*).

**A cláusula que B revoga já era parcialmente falsa.** *"Em modo legado a V3.2
não governa"* descrevia o produto antes de o `EA-65`/`EA-68` tornarem a visão
por produto independente de contexto declarado: medido, ela renderiza os **11
cards em modo legado** hoje. B não abre uma exceção nova — torna coerente uma
que o produto já tinha. O que fica proibido, e o `D023-LEG1` passa a medir, é a
V3.2 governar **qualquer outra coisa** em modo legado: `#v32support` continua
ausente e o convite ao editor continua presente.

**E `published()` é idêntico nos dois modos** — medido nas cinco fixtures da
010: 4/4, 4/4, 6/6, 5/5, 7/7 antes e depois de `resetLandscapeToUnset()`. O
substituto existe igual nos dois modos, e é isso que torna a extensão coerente
em vez de arbitrária.

**CUSTO MEDIDO, e ele é maior do que o da spec original.** Sob o predicado novo
as **cinco** fixtures da 010 passam a ter substituto (`published()` ≥ 4 em
todas, inclusive a `D010-F3` de gate de suficiência **fechado**, que publica 5).
Duas consequências:

1. **A reancoragem do `D010-ARB1` deixa de ser opcional** — era o risco já
   declarado no plano, agora medido: em `D010-F1` o predicado novo é verdadeiro.
2. **Um TERCEIRO oráculo tem de ser emendado**: a alínea **(c)** do
   `D019-CTX1` afirma que a `fronteira()` **não existe em modo legado**, e o
   motivo que ela dá é proteger o sujeito do `D010-ARB1 (c)`. Medido: a fixture
   de controle dela tem **11 produtos publicados**, logo sob B a fronteira passa
   a existir ali e a alínea fica vermelha — por motivo certo. E o motivo dela
   **evapora**: o sujeito que ela protegia é justamente o que esta demanda
   reancora. Emenda com a mesma natureza da emenda à 010, **ratificada pelo
   proprietário no mesmo portão**.

`D010-ARB3 (c)` e `D010-ARB1 (d)` comparam o censo V3.2 contra o censo do
**mesmo estado** em modo legado. Como `published()` não muda entre os modos, os
dois lados passam a ser arbitrados juntos e a igualdade se mantém — **medido
como previsão, confirmado por execução na T004**, nunca presumido.

### E2 · 2026-10-02 — o C6 não podia medir o que prometia

Medido: **zero** dos três títulos de `HIDE_EYEBROWS` aparecem em
`#v32-print-report`, em **todas** as fixtures. A Camada 1 nunca é impressa — é
desenho selado da 010 (C13, `afirmaPreservacao` falsy em todo sítio de
`buildPrintReport`). *"Tudo de C1–C4 medido no relatório"* era portanto
**inalcançável ao pé da letra**, e o gate escrito assim fecharia verde por
ausência de sujeito — o `EA-20` do lado de dentro. O C6 passa a medir a
**coerência** que o papel carrega, e o que ele não pode medir fica **declarado
na alínea**, com contraprova que falha se a Camada 1 um dia passar a ser
impressa.

### E3 · 2026-10-02 — "uma função muda" deixou de ser verdade

O plano afirmava que a mudança era **uma expressão booleana**. Com E1 ela é
**duas**: o predicado e o **argumento do ramo legado** de `renderBlocks`
(`ui_v32.js:249`), hoje a constante `false`. Ambas em `ui_v32.js`, sob a mesma
autorização §29.4 de 2026-10-01 — a classe tocada não muda, a contagem sim.

**E há uma dependência estrutural que o plano não tinha visto**: os cards por
produto são `.apoio-block` **contíguos ao título congelado**, e `.apoio-block`
é classe permitida na varredura de `hideLegacyRecommendation`. O `D023-OCU1` mede
por isso as **duas** metades — congelada oculta **e** cards visíveis — e mede
também a **segunda** passagem de render.

> **CORREÇÃO DE 2026-10-02, pela campanha de mutação.** A primeira redação deste
> parágrafo afirmava que ligar a arbitragem sem mais nada *"ocultaria os cards
> junto com a lista"*, e que o que os protegia era a `fronteira()`
> (`ui_p52_support_v32.js:639`). **Medido, é falso.** O mutante `D023-M2` remove a
> fronteira; com o artefato reconstruído e sondado em **três renders
> consecutivos, nas duas fixtures**, o resultado foi `cards=11 ocultos=0` nas
> seis medições. A ocultação nunca alcança os cards porque o decorador da 5.2 os
> **repõe** depois da varredura, e `colocar()` não devolve nó com `v32-hidden`.
>
> O que a `fronteira()` protege é o **censo** — é o que o comentário do autor
> dela diz (`:617-638`): encerrar a contagem antes dos cards para que o grupo
> contíguo não seja lido como meio oculto e meio visível. É oráculo, não
> apresentação, e pertence à demanda **019**. Por isso o carrasco do `D023-M2` é
> o `D019-CTX1`, descoberto quando ele saiu **sobrevivente** contra o gate que eu
> lhe havia atribuído.
>
> A asserção do `D023-OCU1` **não muda**: a hipótese ter sido falsa não a torna
> desnecessária — um gate que só medisse a ocultação passaria com a seção vazia.
> O que muda é a razão declarada, que agora é a medida.

## Fora de escopo

Herdado do refinamento, e a spec acrescenta:

- **Não reescreve a `C1` da 010 do zero** — ela é emendada no sujeito, não
  substituída. O invariante continua sendo *"a Camada 1 não desaparece sem
  substituto"*.
- **Não mexe no que a curadoria decide**, só passa a **ler** o que ela publicou.
- **Não altera a visão por produto** — nem conteúdo, nem ordem, nem agrupamento.
