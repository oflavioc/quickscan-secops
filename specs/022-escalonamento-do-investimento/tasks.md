# Tarefas — 022-escalonamento-do-investimento

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.

Consome a [spec](spec.md) (C1–C14) e o [plano](plan.md) (W1–W4).

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | `qa-engineer` | feature | | Suíte `tests_022_escalonamento.js` com os 14 gates da spec; fixtures dos oito casos de borda (B1–B8). **Executar e commitar o FAIL** | `D022-*` (todos) |
| T002 | 0 | `qa-engineer` | feature | `[P]` | Campanha `tests_022_mutants.js` com M1–M13; `--preflight` provando `ocorrencias == 1` por âncora | contrato C1 da 013 |
| T003 | 0 | `qa-engineer` | chore | `[P]` | Entrada `d022` em `mutation_map.json` — targets: o módulo novo, `ui_v32.js`, `ui_p52_support_v32.js`, a suíte e o harness | `D017` (semântica do gatilho) |
| T004 | 1 | `core-engineer` | feature | | `ui_ondas_v32.js`: IIFE, `__installed`, `__QS22.ondas()` **puro**. Teto pelo `__QS_STAGE_RULER` (índice da banda), nunca por `Math.round` próprio | `D022-TETO1` · `D022-SUFI1` |
| T005 | 1 | `core-engineer` | feature | | Seleção da primeira onda: prioridades sem teto (C2), acréscimo até `teto − |prioridades|` nunca negativo, `sev 2` antes de `sev 1`, exclusão por alvo == atual antes do acréscimo | `D022-PRIO1` · `D022-ALVO1` · `D022-ALVO2` |
| T006 | 1 | `build-engineer` | chore | `[P]` | Registrar `__QS22` em `bridges.json`; injetar `ui_ondas_v32.js` no builder **depois** de `ui_v32.js` e **antes** de `ui_p52_support_v32.js`; bloco CSS próprio | `lint-arch` · `build` |
| T007 | 2 | `ui-engineer` | feature | | Apresentação das ondas na seção de apoio — **tela e papel no mesmo caminho** (`ui_v32.js`, §29.4 autorizado em 2026-09-28). Onda legível sem cor (C11) e com proveniência (C12) | `D022-COB1` · `D022-CRIT1` · `D022-PAP1` · `D022-A11Y1` · `D022-PROV1` |
| T008 | 2 | `ui-engineer` | feature | | Ressalvas: tensão prioridades × teto (C3) e ausência de suficiência (C4), ambas com os dois números e o estágio pelo nome | `D022-TENS1` · `D022-SUFI1` |
| T009 | 2 | `ui-engineer` | feature | `[P]` | `ui_ondas_v32.css`, prefixo `.qs22-` — a onda nunca depende de cor para ser distinguida | `D022-A11Y1` |
| T010 | 3 | `ui-engineer` | feature | | `EA-75`: contexto tecnológico indexado por produto; produto que serve N capabilities sai **uma** vez, com capabilities e sinais **unidos** | `D022-PROD1` |
| T011 | 4 | `qa-engineer` | fix | | Reancorar as asserções que dependem das âncoras da seção de apoio (55 medidas em 5 suítes) — por **tradução da agulha**, nunca afrouxando o critério | `suites` · `d010` · `d015` · `p50core` |
| T012 | 4 | `qa-engineer` | chore | `[P]` | Re-executar a campanha `p52` e conferir `IC-4`: reestruturar `buildSupportHTML` tende a apodrecer âncora, como no `P52-RB6` | `IC-4` (preflight) |
| T013 | 4 | `build-engineer` | chore | | `gen_pins.py` + repin `§29.4` de `ui_v32.js` em `tests_p50_core.js`, com a autorização de 2026-09-28 registrada no próprio pin | `baseline` · `boundary` · `P50-GOV1` |
| T014 | 5 | `qa-engineer` | chore | | `run.sh` completo + `compliance-audit.sh` + campanha `d022` verde + `spec-validate.md` | pipeline inteiro |
| T015 | 5 | `product-owner` | doc | `[P]` | Aceite de intenção contra o `refinement.md`; `relatorio-final.md` | Fase 6 |
| T016 | 5 | `doc-writer` | doc | `[P]` | `CONTEXT.md`: verbetes **frente de investimento**, **onda**, **teto de frentes** — por critério, nunca por lista (R12 / `EA-47`) | `compliance-audit` |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## Notas de sequenciamento

**Wave 0 é o Red** (Fase 4 da R4), e vem antes de qualquer implementação: o gate
nasce na spec e o FAIL é commitado (R3 §4). T001 e T002 são do mesmo dono e do
mesmo assunto, mas arquivos distintos — daí o `[P]` só no T002.

**T007 e T010 tocam `ui_v32.js` e estão em waves diferentes de propósito** (R5 §3):
dois donos no mesmo arquivo na mesma wave é colisão silenciosa. T009 é `[P]` com
T008 por ser arquivo novo e distinto.

**T011 é `fix` e não `refactor`**: reancorar asserção muda o que o gate mede, então
exige red provado. A distinção importa — foi tratar reancoragem como mexida inócua
que produziu o `M51-07` sobrevivente na 021.

**T013 é a última antes da validação** porque o repin só vale sobre o conteúdo
final; repin no meio vira trilha falsa.

## O que NÃO está aqui, e por quê

- **Conserto do `owner` errado de `__QS_STAGE_RULER`** em `bridges.json` (achado do
  plano): é de outra demanda. Vai ao backlog.
- **Itens 2 e 3 do lote `EA-58`**: fora de escopo desde o refinamento.
