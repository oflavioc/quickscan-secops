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
| **C1** | Sem contexto declarado, **com** produto publicado, a leitura congelada é **oculta** | `D023-OCU1` · `tests_023_leitura.js` · o caso do relato: os nós da Camada 1 saem com `v32-hidden`, e a seção passa a ter **uma** leitura | `M1` · manter o predicado antigo |
| **C2** | **Nada piora com contexto declarado** | `D023-REG1` · idem · censo idêntico ao de hoje: 3 nós ocultos, cards intactos | `M2` · o predicado novo deixar de valer com contexto |
| **C3** | Curadoria suprime **tudo** ⇒ o substituto some ⇒ a congelada **volta visível** | `D023-SUP1` · idem · exclui os ofertados; cards = 0; Camada 1 **visível**; aviso de supressão presente | `M3` · ignorar a curadoria no predicado — o vão da 010 de volta |
| **C4** | Tudo-ou-nada preservado | `D023-ARB1` · idem · o conjunto oculto é **∅ ou exatamente** a Camada 1, nunca parcial | `M4` · ocultar o título e parar |
| **C5** | O `D010-ARB1` segue com **sujeito alcançável** | `D023-SUJ1` · idem · a fixture nova de "substituto suprimido" produz `hasSubstitute === false` **e** Camada 1 presente e visível | `M5` · tornar o predicado sempre verdadeiro |
| **C6** | O papel acompanha a tela | `D023-PAP1` · idem · tudo de C1–C4 medido no relatório montado por `beforeprint` | `M6` · arbitrar só na tela |
| **C7** | **Nada é removido** — a lista continua no DOM, apenas oculta | `D023-DOM1` · idem · o título congelado e os itens **existem** em todos os cenários; o que muda é `v32-hidden` | `M7` · remover em vez de ocultar |
| **C8** | Nenhum `frozen` tocado e a régua D2 imóvel | `D023-BND1` · idem · identidade dos 4 `frozen` + payload M41 == pinado | — (coberto por `baseline`/`m41`) |
| **C9** | Modo legado intacto | `D023-LEG1` · idem · sob `isLegacyModeV32()`, a V3.2 não governa e a congelada permanece | `M8` · arbitrar em modo legado |

**C3 e C5 são o par que sustenta a demanda.** Sem eles, alargar o predicado seria
exatamente o que o refinamento mediu como custo inaceitável: um gate sem sujeito.

## Comportamento especificado

**O predicado passa a ser**: existe substituto quando há **pelo menos um produto
publicado** na visão por produto — isto é, ofertado pelo motor **e não suprimido
pela curadoria**.

| cenário | substituto | Camada 1 | o que o cliente vê |
|---|---|---|---|
| sem contexto, com produto | **sim** | oculta | **uma** leitura: os cards |
| com contexto, com produto | sim | oculta | igual a hoje |
| curadoria suprimiu tudo | **não** | **visível** | a leitura congelada, com o aviso de supressão |
| sem gap algum | não | — | nada a arbitrar |
| modo legado | — | visível | a V3.2 não governa |

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

## Fora de escopo

Herdado do refinamento, e a spec acrescenta:

- **Não reescreve a `C1` da 010 do zero** — ela é emendada no sujeito, não
  substituída. O invariante continua sendo *"a Camada 1 não desaparece sem
  substituto"*.
- **Não mexe no que a curadoria decide**, só passa a **ler** o que ela publicou.
- **Não altera a visão por produto** — nem conteúdo, nem ordem, nem agrupamento.
