# Plano — 021-cobertura-do-apoio

> Fase 2 · dono: tech-lead · consome a spec aprovada.
>
> **Quem escreveu**: o orquestrador, no contrato do `tech-lead` — os agentes de
> papel existem em `.claude/agents/` mas não estão disponíveis como subagentes
> nesta sessão (precedente da 018 e da 019).

## Desenho

**Uma função, um `if`.** A mudança de produto cabe em `qsGapSupportHTML()`
(`ui_v32.js:1127`), que hoje começa com:

```js
const m = QS_GAP_SUPPORT[f.id];
if (!m) return "";                    // ← o silêncio dos 11
```

O desenho C troca esse `return ""` por uma segunda fonte. Nada de módulo novo,
nada de estado novo, nada de bridge novo — **esta demanda não cria dado, ela lê
dois que já existem**.

### Por que em `ui_v32.js` e não numa camada 5.x

Porque é lá que o **relatório** é montado (`buildPrintReport()`), e o `EA-56`
mediu que o problema é pior **no papel**: o ponteiro que o `EA-55` entregou vive
na camada 5.2, que compõe a tela, e **não alcança o PDF**. Resolver na 5.2
repetiria o mesmo erro com outro nome.

`ui_v32.js` é **§29.4 PROTEGIDO** — autorização nominal do proprietário e repin
inline com trilha, o rito de sempre. Não é `frozen`: **não há Porta B aqui**.

### As duas fontes, e a forma da derivação

| origem | leitura | quando |
|---|---|---|
| curada | `QS_GAP_SUPPORT[qid].opts` → `{n, w}` | qid está na tabela |
| derivada | `MAP[qid].lv[f.lvl].c` → `{p, w}` | qid **não** está na tabela |
| nenhuma | — | sem candidato no nível ⇒ **sem bloco** |

A derivação normaliza `{p, w}` para a mesma forma `{n, w}` que o renderizador já
consome, e daí para a frente **o caminho é o mesmo** — mesma marcação, mesma
ressalva de contexto, mesmo `data-pr-gap-cap`. Um só renderizador: dois caminhos
de renderização divergiriam em silêncio, que é o `EA-58` pelo outro lado.

### Owner do estado (R9 §5)

**Nenhum dado novo.** Não há owner a nomear. O `MAP` é da Camada 1 e é lido em
modo somente-leitura; a tabela curada continua de `ui_v32.js`.

## Contratos e registros

- **Bridges**: nenhum novo, nenhum alterado. `bridges.json` intocado.
- **Patch-points**: nenhum. A mudança é dentro da própria função, não decoração.
- **Ordem de injeção no builder**: irrelevante — `MAP` é da Camada 1 e já está
  disponível quando `ui_v32.js` roda.
- **Superfície DOM**: um atributo novo, `data-pr-gap-ancora`, observável do `C6`.
- **Pins que mudam** (repin no mesmo PR — R8):

| arquivo | por quê |
|---|---|
| `ui_v32.js` | a mudança de produto · **§29.4: pin inline em `tests_p50_core.js` também** |
| `tests_p50_core.js` | emenda da §UAT-07 (`QIDS_AUTORIZADOS`) + o repin inline acima |
| `quickscan_secops_soccmm_v3_2_dev.html` | `generated` — sai do builder |
| `tests_021_cobertura.js` · `tests_021_mutants.js` | nascem |
| `.claude/verify/expected_suites.json` · `mutation_map.json` · `mutation-matrix.json` | suíte e campanha novas |

## Boundary

**Classe tocada mais alta: `produto` + `generated` (via builder).**

`ui_v32.js` é §29.4 protegido — rito de autorização nominal, **não** D2.
`quickscan_secops_soccmm_v3_1_3.html` e `engine_v32.js` **não são tocados**: o
`MAP` é lido. **Nenhuma Porta B; nenhum repin de `declared.m41_payload_sha256`.**

> Se em algum momento a implementação precisar **escrever** no `MAP`, ela saiu do
> desenho aprovado e **para** (R6 §5).

## Checklist R9 (módulo novo)

**Não se aplica** — nenhum módulo novo. A mudança vive em função existente de
arquivo existente. Os itens que ainda valem:

- [x] zero `innerHTML =` no que eu escrever — a função monta string de template,
      padrão do arquivo, e **isso não muda**;
- [x] helper único: a normalização `{p,w}` → `{n,w}` vive em **um** lugar;
- [x] orçamento: a função cresce ~25 linhas, muito abaixo do teto.

## Waves

| Wave | Tarefas (resumo) | Depende de |
|---|---|---|
| **W1** | `qa-engineer`: escreve `tests_021_cobertura.js` com os 9 gates e **prova o RED commitado** (R3 §4) | spec aprovada |
| **W2** | `qa-engineer`: escreve `tests_021_mutants.js` com M1–M9 e o preflight C1 da 013 | W1 |
| **W3** | `ui-engineer`: a derivação em `qsGapSupportHTML()` + `data-pr-gap-ancora` | W1 (gates no prompt) |
| **W4** | `build-engineer`: emenda da §UAT-07 em `tests_p50_core.js` + repin inline §29.4 | W3 |
| **W5** | fecho: `expected_suites.json`, `mutation_map.json`, `gen_pins.py`, `USER_GUIDE.md` | W3, W4 |

**W3 e W4 não são paralelas de propósito**: a emenda da §UAT-07 só pode ser
medida contra a cobertura nova, e fazê-la antes deixaria o `P51-REC1` verde por
vacuidade — autorizando qids que ainda não recebem apoio nenhum.

## Riscos e rollback

| risco | como se detecta | como se reverte |
|---|---|---|
| estreitar um dos 4 curados | `D021-CUR1` — mede os quatro nominalmente | a tabela é consultada **primeiro**; inverter a ordem é o `M1` |
| bloco derivado sem ressalva de contexto | `D021-CTX1` | ramo único de renderização; a ressalva é anterior à bifurcação |
| aviso de ancoragem repetido em tudo | `D021-ANC1` + `M6` | atributo declarado, não inferido |
| apoio na tela e não no papel | `D021-PAR1`, medido **após `beforeprint`** | a função é a mesma nas duas superfícies — é o motivo de estar em `ui_v32.js` |
| `P51-REC1` verde por vacuidade | ordem W3→W4, e o `M9` | reintroduzir os quatro literais tem de dar vermelho |

**Rollback**: a mudança é uma função e um atributo. Reverter é um `git revert` do
commit de produto; a tabela curada e a Camada 1 ficam como estão.

## Protótipo

**Não é necessário.** A questão que só código responderia — *"o `MAP` tem
candidato e justificativa para os 11?"* — **já foi respondida por sonda na Fase
0**, com o resultado na tabela do refinamento. Abrir `prototype/` aqui seria
repetir medição feita.
