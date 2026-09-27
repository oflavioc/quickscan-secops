# Tarefas — 021-cobertura-do-apoio

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
>
> **Quem escreveu**: o orquestrador, no contrato do `tech-lead` — os agentes de
> papel existem em `.claude/agents/` mas não estão disponíveis como subagentes
> nesta sessão. **Consequência declarada (R3 §2)**: autor do gate e implementador
> são o mesmo sujeito. A separação de poderes que a regra desenha **não existe
> aqui**, e isso é dívida da estrutura, não licença — a mitigação é a ordem
> (gate escrito e **red commitado** antes da implementação) e o mutante por gate,
> que é o que resta de independente. Precedente: 018, 019.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 1 | qa-engineer | feature | | `tests_021_cobertura.js` nasce com os 9 gates da spec, todos vermelhos | D021-CUR1 · COB1 · VAZ1 · FON1 · NIV1 · ANC1 · PAR1 · CTX1 |
| T002 | 1 | qa-engineer | chore | | Executa a suíte e **commita o FAIL** — red inauditável é red que não existe (E3) | — |
| T003 | 2 | qa-engineer | feature | | `tests_021_mutants.js` com M1–M9, um por critério, e o `--preflight` do contrato C1 da 013 | M1–M9 |
| T004 | 3 | ui-engineer | feature | | A derivação em `qsGapSupportHTML()`: tabela primeiro, `MAP[qid].lv[f.lvl].c` depois, silêncio se nenhum | D021-CUR1 · COB1 · VAZ1 · FON1 · NIV1 |
| T005 | 3 | ui-engineer | feature | | `data-pr-gap-ancora` nos dois caminhos; o aviso do `EA-48` **só** em `capability` | D021-ANC1 |
| T006 | 4 | build-engineer | fix | | Emenda da §UAT-07: `QIDS_AUTORIZADOS` derivado da fonte congelada, não quatro literais | P51-REC1 · M9 |
| T007 | 4 | build-engineer | chore | | Repin inline §29.4 de `ui_v32.js` em `tests_p50_core.js`, com trilha (motivo, data, identidade anterior) | P50-GOV1 |
| T008 | 5 | build-engineer | chore | [P] | `expected_suites.json`: contagem da suíte nova, **medida por execução** | stage `suites` |
| T009 | 5 | build-engineer | chore | [P] | `mutation_map.json` + `mutation-matrix.json`: campanha `d021` por gatilho de path | stage `mutation` |
| T010 | 5 | doc-writer | doc | [P] | `USER_GUIDE.md`: a seção de apoio passa a cobrir os quinze; dizer o que mudou para quem lê | — |
| T011 | 5 | build-engineer | chore | | `gen_pins.py` — **depois** de T004–T010, no mesmo PR (R8) | stage `baseline` |
| T012 | 6 | qa-engineer + product-owner | doc | | `spec-validate.md` + aceite de intenção; relatório final | — |

## Ordem que não é negociável

**T002 antes de T004.** O red precisa estar **commitado** antes da implementação
existir. Sem isso não há prova de que o gate discrimina — é a lição que o `EA-70`
cobrou nesta mesma semana, quando um gate escrito depois da correção teria nascido
sem nunca ter sido visto falhar.

**W3 (T004–T005) antes de W4 (T006).** Emendar a §UAT-07 antes da cobertura
existir deixaria o `P51-REC1` **verde por vacuidade**: autorizando qids que ainda
não recebem apoio nenhum. O portão perderia o sujeito.

**T011 por último.** Pin regenerado antes da última mudança de arquivo pinado é
pin que nasce velho.

## Um módulo por delegação

| wave | arquivo | dono único |
|---|---|---|
| 1, 2 | `tests_021_cobertura.js`, `tests_021_mutants.js` | qa-engineer |
| 3 | `ui_v32.js` | ui-engineer |
| 4 | `tests_p50_core.js` | build-engineer |
| 5 | registros e docs | build-engineer / doc-writer |

Nenhum arquivo tem dois donos na mesma wave. `ui_v32.js` é tocado **só** na W3;
`tests_p50_core.js` **só** na W4 — e é por isso que elas são sequenciais também
por higiene, não apenas por medição.

## O que NÃO está aqui, e é proposital

- **Nenhuma tarefa toca `quickscan_secops_soccmm_v3_1_3.html` ou `engine_v32.js`.**
  Se aparecer uma, o desenho foi violado e a demanda para (R6 §5).
- **Nenhuma tarefa mexe na lista "pode fazer sentido"** — decisão confirmada da
  020, e esta demanda não a agrava nem a resolve.
- **Nenhuma tarefa acrescenta produto ao catálogo** — é o item 2 da partição do
  `EA-58`, com rito próprio.
