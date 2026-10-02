# Tarefas — 023-leitura-unica-do-apoio

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.

Consome a [spec](spec.md) (C1–C9) e o [plano](plan.md) (W0–W4).

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | `qa-engineer` | feature | | Suíte `tests_023_leitura.js` com os 9 gates; fixtures dos cinco cenários da §Comportamento. **Executar e commitar o FAIL** | `D023-*` (todos) |
| T002 | 1 | `core-engineer` | feature | | `hasSubstituteV32` (`ui_v32.js`, §29.4 autorizado em 2026-10-01) ganha a segunda fonte, sob guarda de `typeof` — sem `__CURATION`, comportamento de hoje | `D023-OCU1` · `D023-REG1` · `D023-SUP1` |
| T003 | 1 | `qa-engineer` | fix | | Fixture nova de **substituto suprimido** em `fixtures_010_vao.js` e o oráculo `d010HasSubstitute` emendado — a reimplementação da spec §1 acompanha a emenda, senão o gate mede uma regra que o produto não segue mais | `D010-ARB1` · `D023-SUJ1` |
| T004 | 1 | `qa-engineer` | fix | | `D010-ARB1` reancorado na fixture nova; as outras quatro alíneas da 010 conferidas **por execução**, não por leitura | `d010` inteiro |
| T005 | 1 | `product-owner` | doc | `[P]` | Errata no `specs/010-recomendacao-sem-vao/spec.md` §1: o predicado muda de sujeito, com a ratificação de 2026-10-01 citada | `compliance` |
| T006 | 2 | `qa-engineer` | feature | | Campanha `tests_023_mutants.js` com M1–M8; `--preflight` provando `ocorrencias == 1` por âncora | contrato C1 da 013 |
| T007 | 2 | `qa-engineer` | chore | `[P]` | Entrada `d023` em `mutation_map.json` — targets incluem `ui_curation_v32.js` como insumo de classe `populacao`, porque é ele que define o que `published()` devolve | `D017` |
| T008 | 2 | `build-engineer` | chore | `[P]` | `d023` em `expected_suites.json`, na contagem medida | `suites` (R10 §3) |
| T009 | 3 | `qa-engineer` | fix | | Regressão medida nas suítes que tocam a seção de apoio: `d010`, `d015`, `d019`, `d021`, `d022`, `p52layout` | `suites` |
| T010 | 3 | `qa-engineer` | chore | `[P]` | `IC-4` em todas as campanhas: o predicado muda uma linha de `ui_v32.js`, que é alvo de `d010`, `d022`, `p52` e `core` | `IC-4` (preflight) |
| T011 | 3 | `build-engineer` | chore | | `gen_pins.py` + repin `§29.4` de `ui_v32.js` em `tests_p50_core.js`, com a autorização de 2026-10-01 registrada no próprio pin | `baseline` · `boundary` · `P50-GOV1` |
| T012 | 4 | `qa-engineer` | chore | | `run.sh` completo + `compliance-audit.sh` + campanha `d023` verde + `spec-validate.md` | pipeline inteiro |
| T013 | 4 | `product-owner` | doc | `[P]` | Aceite de intenção contra o `refinement.md`; `relatorio-final.md` | Fase 6 |
| T014 | 4 | `doc-writer` | doc | `[P]` | `CONTEXT.md`: verbete **substituto**, por critério e nunca por lista (R12 / `EA-47`) | `compliance-audit` |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## Notas de sequenciamento

**T002, T003 e T004 entram juntas, e é decisão de desenho.** Trocar o predicado sem
reancorar o `D010-ARB1` deixaria a árvore com um gate de outra demanda vermelho por
motivo certo. Os três arquivos têm donos distintos e não colidem (R5 §3). **T005 é
`[P]`** por ser documento.

**T003 é `fix` e não `doc`**: `d010HasSubstitute` é a reimplementação da spec §1 na
fixture, e existe para o gate não virar tautologia. Emendá-la **muda o que o gate
mede** e exige red provado. Foi tratar reancoragem como mexida inócua que produziu
o `M51-07` sobrevivente na 021.

**T004 confere as outras quatro alíneas por EXECUÇÃO.** A 020 mediu que cinco gates
da 010 dependem daquele título; esta demanda não o remove, mas muda quando ele é
ocultado — e "não deve afetar" é hipótese até rodar.

**T010 não é zelo**: o predicado muda uma linha de `ui_v32.js`, que é alvo declarado
de quatro campanhas. Mudar linha em arquivo-alvo apodrece âncora — aconteceu duas
vezes nesta sessão, com o `P52-RB6` e com o par `D011-M18`/`D014-M7`.

**T011 é a última antes da validação**: repin no meio vira trilha falsa.

## O que NÃO está aqui, e por quê

- **`EA-76`** (a derivação em duas cópias) e **`EA-77`** (dono errado no registro de
  bridges): continuam abertos. Esta demanda **lê** `published()` em vez de criar uma
  terceira cópia, o que não agrava o `EA-76` — e não o resolve.
- **Itens 2 e 3 do lote `EA-58`**: fora de escopo desde o refinamento.
