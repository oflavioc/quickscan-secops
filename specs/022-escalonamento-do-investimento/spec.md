# Spec — 022-escalonamento-do-investimento

> Fase 1 · donos: product-owner + tech-lead · referencia o [refinement.md](refinement.md), não o repete.

## Objetivo

O relatório passa a encenar **quais frentes de investimento se ataca agora** —
derivado do que a organização já declarou —, mantendo todo gap observado e nomeado.

## Critérios de aceite → gates

Suíte nova: `tests_022_escalonamento.js`. Campanha: `tests_022_mutants.js`.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| **C1** | O teto é `max(1, round(overall))` e nada mais | `D022-TETO1` · `tests_022_escalonamento.js` · para os seis estágios (`0.4 / 1.0 / 2.0 / 3.0 / 4.0 / 4.8`), o teto observado é `1/1/2/3/4/5`; o oráculo recomputa de `stageOf`, nunca de tabela transcrita | `M1` · teto fixo em 3 |
| **C2** | Prioridade declarada nunca é cortada pelo teto | `D022-PRIO1` · idem · com 3 prioridades e teto 2, as **três** aparecem na primeira onda | `M2` · aplicar o teto também à prioridade |
| **C3** | Prioridade acima do teto é **nomeada**, nunca podada | `D022-TENS1` · idem · o relatório traz os **dois números** (declaradas × teto) e o estágio pelo nome; ausência do nó reprova | `M3` · emitir a onda sem a ressalva |
| **C4** | Sem suficiência não há escalonamento, e isso é dito | `D022-SUFI1` · idem · `suff === false` ⇒ nenhuma frente acrescentada pelo motor **e** nó de ausência presente | `M4` · escalonar com `overall === null` (teto viraria 1 silencioso) |
| **C5** | Nada sai do relatório: o que excede o teto vira onda seguinte declarada | `D022-COB1` · idem · a união (primeira onda ∪ ondas seguintes) é **igual** ao conjunto de gaps com caminho de apoio da 021 — igualdade, não inclusão | `M5` · descartar o excedente em vez de declará-lo |
| **C6** | A onda seguinte declara o **critério** em uma linha | `D022-CRIT1` · idem · o nó da onda seguinte cita o estágio e o teto que a produziram | `M6` · rotular sem dizer por quê |
| **C7** | Alvo igual ao atual sai do enquadramento, **nomeadamente** | `D022-ALVO1` · idem · prática com override explícito == atual não recebe frente **e** a exclusão é dita; sem override, comportamento inalterado | `M7` · excluir em silêncio |
| **C8** | O alvo não abre frente nova nem aumenta o teto | `D022-ALVO2` · idem · com alvo declarado em prática não priorizada, o número de frentes é **idêntico** ao cenário sem alvo | `M8` · somar alvo ao teto |
| **C9** | Vale no papel, não só na tela | `D022-PAP1` · idem · tudo de C2–C7 medido no relatório montado por `beforeprint` | `M9` · emitir onda só na tela |
| **C10** | (`EA-75`) Contexto tecnológico indexado por produto | `D022-PROD1` · idem · produto que serve N capabilities aparece **uma** vez, com capabilities e sinais **unidos** (nenhum perdido) | `M10` · deduplicar escolhendo a primeira capability |
| **C11** | A distinção de onda não depende de cor (UX-P7 selada) | `D022-A11Y1` · idem · a onda é distinguível por **texto**; remover todo estilo mantém a leitura | `M11` · marcar onda só por classe de cor |
| **C12** | A onda é visão derivada e se declara como tal (UX-P6 selada) | `D022-PROV1` · idem · o nó de onda carrega proveniência (de que declaração deriva) | `M12` · emitir onda sem proveniência |
| **C13** | Escalonar não altera score, suficiência nem estado canônico (UX-P8 selada) | `D022-INV1` · idem · `legacySnapshot()` byte-idêntico antes e depois de montar as ondas | `M13` · escrever no estado canônico ao escalonar |
| **C14** | Nenhum arquivo `frozen` é tocado e a régua D2 não se move | `D022-BND1` · idem · payload M41 == `pins.json → declared.m41_payload_sha256`; identidade dos 4 `frozen` inalterada | — (coberto por `baseline`/`m41`) |

**Por que C5 exige igualdade e não inclusão**: inclusão passaria com o produto
escondendo gap, que é exatamente o que a D5 proíbe. O oráculo do conjunto sai de
`computeFindings()`, não do DOM — lição da 021.

## Errata E1 (2026-09-28) — o sinal de exclusão muda, e o C5 muda junto

Ratificada pelo proprietário no chat (*"Segue com a A"*), depois de medição na
Fase 5 · W1.

**O que foi medido.** O `C7` original dizia: *prática com alvo explícito igual ao
atual sai do enquadramento*. Esse estado **não existe** depois de um render:

```
setTarget("network-visibility", 1)  -> true
overrides logo após                 : {"network-visibility":1}
overrides após showResults()        : {}            <- revalidateTargets apagou
overrides com alvo ACIMA do atual   : {"vulnerability-management":3}   <- sobrevive
```

É a candidata de `design-decisions.md` — *"`setTarget` aceita alvo igual ao atual;
`revalidateTargets` o remove depois"* — agora com consequência: ela invalidava um
critério aprovado.

**C7 emendado.** O sinal passa a ser a **ausência declarada**:

> Quando a organização declarou um cenário-alvo e **deixou uma prática de fora**,
> é essa ausência que diz *"não vou subir esta"*. A prática sai do enquadramento
> de **investimento do motor**, nomeadamente.

Três razões pelas quais a forma nova é melhor que a original, e não só possível:
**persiste** ao render; é **mais barata** de declarar (omitir, em vez de registrar
alvo igual ao atual); e **não depende** de uma assimetria que segue candidata não
ratificada.

**A exclusão não alcança prioridade declarada.** Prioridade e ausência de alvo são
duas declarações do mesmo cliente que apontam para lados opostos; a prioridade
vence, e não há contradição a narrar porque a exclusão governa apenas **o que o
motor acrescenta** — que é exatamente o alcance do teto (D2/D6).

**Borda explícita**: sem nenhum alvo declarado, **ninguém é excluído**. Ausência de
cenário não é declaração de nada.

**C5 emendado junto, e esta metade eu só enxerguei ao escrever a errata.** A
redação original — *união(primeira, seguintes) == cobertura da 021* — só se
sustenta quando não há exclusão alguma. Com o `C7` vivo, a união ficaria menor que
a cobertura e o gate reprovaria o produto certo; ou, pior, passaria na fixture sem
alvos e calaria sobre as demais. Passa a ser:

> união(**primeira** ∪ **seguintes** ∪ **excluidas**) == conjunto de gaps com
> caminho de apoio.

Continua sendo **igualdade**, e agora cobre o caso que a original não via: nada
sai do relatório, nem o que foi excluído do investimento.

## Errata E2 (2026-09-28) — o EA-75 se resolve onde a visão por produto JÁ existe

Ratificada pelo proprietário no chat (*"Vamos de B"*), depois de medição na W3.

**O que foi medido.** A seção *"Formas de apoio, por produto"* (`pr-sup-solucao`,
da demanda 019) **já existe e já lista cada produto uma vez**. Mas:

```
FortiDLP em pr-sup-solucao    : 0 ocorrências
FortiDLP em pr-interp/support : 2 ocorrências   <- a duplicata relatada
```

A causa: `ofertaDoMotor()` (`ui_p52_support_v32.js`) deriva de
`computeFindings() + MAP` — **só produto puxado por gap**. Produto habilitado por
**sinal declarado** vem dos contextos do motor e nunca chegava lá.

**C10 emendado.** Deixa de exigir a reindexação da seção por capability e passa a
exigir:

> Todo produto aparece **exatamente uma vez** na visão por produto, com
> capabilities e sinais **unidos** — inclusive o habilitado por sinal declarado.
> Medido em `pr-sup-solucao`.

Três razões, e a primeira não é custo: a seção por capability **responde outra
pergunta** — *por que este produto apareceu para esta necessidade* —, e vista assim
a repetição não é duplicata, é a mesma resposta dada a duas perguntas. Segunda:
`design-decisions.md` já registra que a visão por solução **convive** com a leitura
por gap; reindexar contrariaria decisão confirmada sem que ninguém tenha pedido.
Terceira: o `pr-sup-solucao` estar incompleto **é, ele mesmo, um defeito** — a
seção que se chama "por produto" não listava todos —, e esta rota o corrige.

O custo evitado está medido: reindexar a seção por capability exigiria reancorar
**55 asserções em 5 suítes**, uma `§29.4` e outra selada por errata própria.

## Comportamento especificado

**Entrada** (tudo já declarado, nada inferido): respostas (`ans`), prioridades
declaradas (`businessPriority`), overrides de alvo (`TARGET_PROFILE.overrides`),
suficiência e `overall` (`legacySnapshot`/`computeTargetProfile`).

**Saída**, por superfície:

| superfície | o que passa a existir |
|---|---|
| tela · seção de apoio | frentes da primeira onda, depois as ondas seguintes com o critério |
| papel (`beforeprint`) | idem, íntegro (C9) |
| tela · contexto tecnológico | indexado por produto (C10) |
| ambas | ressalva de tensão (C3) e de ausência de suficiência (C4) quando aplicáveis |

**Seleção da primeira onda**, nesta ordem:

1. todas as **prioridades declaradas** (C2), sem teto;
2. o motor acrescenta até `teto − |prioridades|` frentes, e **nunca menos que zero**;
3. o acréscimo prefere `sev 2` sobre `sev 1` (B3/B4);
4. práticas com **alvo igual ao atual** são removidas da elegibilidade antes de 2 (C7).

**Casos de borda** — os oito do refinamento (B1–B8) são os casos canônicos dos
gates; `suff === false` e `overall === null` estão em C4; `NA` e `UNSET` não mudam
de tratamento nesta demanda (o motor os resolve antes, e nada aqui os reinterpreta).

## Contratos

**Estado novo: nenhum.** Esta demanda **deriva** — não é dona de dado algum. O
owner do estado (R9 §5) continua sendo quem já é: `ans`/`businessPriority` na
Camada 1, `TARGET_PROFILE` em `ui_target_v32.js`.

**Bridge novo**: `window.__QS22` (a registrar em `.claude/verify/bridges.json`, R9 §2),
com uma função pura e sem I/O:

```
__QS22.ondas({ findings, prioridades, alvos, overall, suff }) -> {
  teto:      number | null,        /* null quando nao ha suficiencia */
  estagio:   string | null,        /* nome do estagio, para a frase */
  primeira:  [qid…],
  seguintes: [qid…],
  excluidas: [{ qid, motivo }],    /* alvo == atual (C7) */
  tensao:    { declaradas, teto } | null   /* C3 */
}
```

Função **pura**: mesma entrada, mesma saída; não lê DOM, não escreve estado, não
consulta `window`. É o que torna C13 mensurável e o que permite ao gate ter oráculo
independente da renderização (R10).

**Consumidores**: a camada de apresentação da seção de apoio (tela e papel).

## Cross-check (obrigatório)

- [x] **Invariantes R1** — nenhuma violada. INV-4/INV-6 protegidas por **C13**;
  INV-5 protegida por **C7/C8** (o alvo é lido, nunca inferido de produto);
  INV-1 por **C14**; INV-7 pela pureza do contrato.
- [x] **design-decisions.md** — nenhum conflito. A candidata *"`SCORES` + bandas
  de `stageOf` fazem nível 1 uniforme ler como Managed"* é **herdada de propósito**
  pelo teto (refinement §Enquadramento): se for ratificada um dia, o teto se move
  junto, e isso fica escrito. A decisão confirmada sobre a lista *"Pode fazer
  sentido"* (020) **permanece**: esta demanda não remove lista alguma (C5).
- [x] **Specs validadas anteriores** — a 021 é **estendida, não contradita**: C5
  exige que a união das ondas seja igual ao conjunto que a 021 passou a cobrir.
- [x] **Specs de fase seladas — por leitura.** `specs/PHASE_5_0_REV_B.md`,
  identidade conferida contra `current_phase.json` (`4f1583c7…`, confere). Três
  cláusulas tocam o escopo, e **as três viraram critério**:
  - `:267` **UX-P6 — Derived views are labeled as derived**: *"Target/Journey e
    qualquer visão derivada explicitam provenance e natureza derivada"* → **C12**;
  - `:270` **UX-P7 — Accessible without color alone**: *"Estado, prioridade,
    maturidade, insuficiência e seleção não dependem exclusivamente de cor"* →
    **C11**;
  - `:274` **UX-P8 — No hidden methodological side effects**: *"Trocar aba, modo,
    filtro ou visualização não altera score ou canonical state"* → **C13**.
  Resultado negativo, que também é leitura: **nada** sobre teto, onda de
  investimento ou escalonamento em `PHASE_5_0_REV_B.md` — a `§33` usa "ondas" para
  o roadmap de microfases, sentido não relacionado.
- [x] **Boundary (R6) — três fontes cruzadas.** `boundary.json`: os `frozen` são
  `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`,
  `v3_1_3_functional_snapshot.json` — **nenhum é tocado** (D7). `PROTECTED`
  (`tests_p50_core.js`): `ui_v32.js` **será** tocado na Fase 5 pela apresentação
  das ondas — **autorização §29.4 PARADA AQUI**, a pedir no portão desta spec, nunca
  depois de editar. `pins.json`: identidade de HEAD conferida pelo stage `baseline`,
  repin no mesmo PR (R8). **Precedência**: nenhuma divergência prosa×executável
  encontrada nesta leitura.

## Fora de escopo

Herdado do refinamento (§Fora de escopo), e a spec acrescenta:

- **Não reordena a seção de apoio** além do que a onda impõe: o priority-first de
  `buildSupportHTML` continua válido dentro de cada onda.
- **Não cria preferência entre produtos** da mesma capability — o motor decide isso
  e continua decidindo sozinho.
- **Não persiste onda em sessão.** Onda é derivada; serializá-la violaria INV-8.
