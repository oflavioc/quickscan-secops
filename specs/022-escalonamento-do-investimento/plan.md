# Plano — 022-escalonamento-do-investimento

> Fase 2 · dono: tech-lead · consome a [spec](spec.md) aprovada.

## Desenho

**Camada**: módulo novo, puro, **acima** do motor — D7 da spec, no precedente
declarado do `ui_target_v32.js` (*"camada prospectiva; engine intocado"*). O motor
segue respondendo *"o que serve aqui?"* sozinho e auditável; o módulo novo responde
*"quanto cabe agora?"*.

### O teto NÃO usa `Math.round` — usa a régua que o cliente já vê

A spec escreveu `teto = max(1, Math.round(overall))`. Medindo o código para o
plano, achei o remédio pronto: **`window.__QS_STAGE_RULER`** já é bridge
registrado, com `bands()` (as faixas de estágio, em ordem) e `stageAt(v)`. É a
mesma régua que `qsStageRulerHTML` desenha no relatório com o marcador *"Você está
aqui"*.

```
teto = max(1, índice da banda que contém `overall`)
```

Ganho que não é só elegância: **o teto passa a ser literalmente o mesmo objeto que
a figura impressa**. Um `Math.round` próprio seria a quarta cópia literal de um
valor com dono nesta semana — o heap do `SESSION 4.8`, os dois pré-filtros do
caminhador e a âncora do `P52-RB6` custaram exatamente isso. A regra da spec fica
válida como *especificação*; a implementação a obtém da fonte única.

### Módulos

| módulo | dono | papel |
|---|---|---|
| `ui_ondas_v32.js` (**novo**) | `core-engineer` | `__QS22.ondas()` — função pura; seleção, teto, tensão, exclusões |
| `ui_v32.js` (**§29.4**) | `ui-engineer` | apresentação das ondas na seção de apoio (tela e papel) + C10 (`EA-75`) |
| `ui_p52_support_v32.js` | `ui-engineer` | visão por solução: eixo passa a ser produto (C10) |
| `ui_ondas_v32.css` (**novo**) | `ui-engineer` | prefixo `.qs22-`; a onda é legível sem cor (C11) |

**Owner do estado (R9 §5): ninguém novo.** A demanda **deriva**. `ans` e
`businessPriority` seguem na Camada 1; `TARGET_PROFILE` segue em
`ui_target_v32.js`. `__QS22.ondas()` não lê DOM, não escreve estado, não consulta
`window` — é o que torna o **C13** mensurável.

## Contratos e registros

- **Bridges**: entrada nova `__QS22` em `.claude/verify/bridges.json`
  (owner `ui_ondas_v32.js`, nota *"escalonamento de investimento — derivado, puro"*).
- **ACHADO ENCONTRADO NESTE PLANO, não corrigido aqui**: `bridges.json` declara
  `__QS_STAGE_RULER` com `owner: "ui_ux_v32.js"`, e a implementação vive em
  `ui_v32.js:991`. O registro está errado desde que nasceu. **Não se conserta de
  dentro desta demanda** (R10 §1 / escopo); vai ao backlog e é reportado ao
  proprietário.
- **Patch-points**: nenhum. Nenhum monkey-patch; o módulo é consumido por chamada
  direta ao bridge.
- **Ordem de injeção no builder**: `ui_ondas_v32.js` entra **depois** de
  `ui_v32.js` (que expõe `__QS_STAGE_RULER`) e **antes** de
  `ui_p52_support_v32.js` (consumidor). CSS entra no bloco próprio, no mesmo
  padrão de `P53SOLCSS`.
- **Pins**: mudam `ui_v32.js`, `ui_p52_support_v32.js`, `build_v32_html.py`,
  `bridges.json`, o HTML gerado, mais os arquivos novos. Repin no mesmo PR (R8).

## Boundary

**Classe tocada mais alta: `produto` — com um protegido `§29.4` dentro.**

- `frozen`: **nenhum**. `engine_v32.js`, a Camada 1, o harness e o snapshot ficam
  intactos (C14). Medido na Fase 0: a régua D2 não mede o motor V3.2.
- `generated`: o HTML muda **via builder**, como sempre.
- `§29.4 PROTEGIDO`: **`ui_v32.js`** é tocado nas waves W2 e W3.

> **PARADO AQUI.** A autorização nominal `§29.4` para `ui_v32.js` **não foi
> obtida**: o proprietário aprovou a spec (*"Aprovado, prossiga"*), e eu não trato
> aprovação de fase como autorização de boundary — são ritos diferentes, e a R6 §5
> manda parar e aguardar. As waves W1 e o Red (Fase 4) **não dependem dela** e
> seguem; **W2 e W3 não começam sem ela**.

## Checklist R9 (módulo novo)

Módulo: `ui_ondas_v32.js`.

- [ ] IIFE + `__installed` · [ ] um bridge registrado (`__QS22`) · [ ] CSS por prefixo `.qs22-`
- [ ] zero `innerHTML=` · [ ] ≤600 linhas (estimativa: ~180) · [ ] helper único de invariante

## Waves

| Wave | Tarefas (resumo) | Depende de |
|---|---|---|
| **W1** | `ui_ondas_v32.js` + `__QS22.ondas()` puro + registro do bridge + injeção no builder | Red da Fase 4 |
| **W2** | Apresentação das ondas na seção de apoio, tela e papel (C2–C9, C11–C13) | W1 · **autorização §29.4** |
| **W3** | `EA-75` — contexto tecnológico indexado por produto (C10) | W2 · **autorização §29.4** |
| **W4** | Reancoragem das 55 asserções que dependem das âncoras atuais + campanha | W3 |

W1 é paralelizável com o Red por ser módulo novo e isolado; W2 e W3 tocam o mesmo
arquivo e **não** vão na mesma wave (R5 §3).

## Riscos e rollback

| risco | como se detecta | rollback |
|---|---|---|
| A onda esconde gap sem que ninguém veja | **C5** exige igualdade entre a união das ondas e o conjunto coberto pela 021, com oráculo do motor | reverter W2; W1 é inerte sem consumidor |
| Reestruturar `buildSupportHTML` derruba as 55 asserções | `suites` + `d010`/`d015`/`p50core` no `run.sh` | W4 é a wave de reancoragem; se estourar, W3 volta e o `EA-75` sai desta demanda |
| Escalonar tocar score ou estado canônico | **C13** — `legacySnapshot()` byte-idêntico antes e depois | reverter a wave; o contrato puro torna isso improvável por construção |
| O teto divergir da régua desenhada | **C1** recomputa de `stageOf`; a implementação lê do bridge — divergência vira FAIL | — |
| Âncora de mutante apodrecer com a reestruturação | `IC-4` no preflight da campanha | reancorar, como no `P52-RB6` |

**Rollback geral**: o módulo novo é aditivo e a apresentação é a única coisa que
muda comportamento visível. Reverter W2/W3 devolve o produto ao estado da v3.2.9.

## Protótipo

**Não é necessário.** As duas perguntas que só código responderia já foram
respondidas por medição na Fase 0 (a régua D2 não mede o motor V3.2) e nesta fase
(a régua de estágios já é bridge registrado). Não há questão aberta que exija
branch `prototype/`.
