# spec-validate — 018-cobertura-declarada-de-mutacao

> Fase 6 · executor: `qa-engineer` · **somente leitura**. Cada item conferido na
> implementação REAL (source + execução), nunca no relatório de quem implementou
> (R2 §4). Iteração 1.

## Itens verificáveis extraídos da [spec.md](spec.md)

| # | Exigência | Conferido em | Veredito |
|---|---|---|---|
| 1 | `C1`/`D018-POP1` — declaração existe, casa a forma, **toda** exceção e dívida com `motivo` e `prazo`, sem duplicata | `check_mutation_coverage.py` §`julgar` + execução: 11 dívidas, nenhuma acusada | **conforme** |
| 2 | `C2`/`D018-ORF1` — arquivo na população e fora de todo gatilho é `[FAIL]` **com nome** | red `2e5c4e2`: 11 arquivos nomeados um a um | **conforme** |
| 3 | `C3`/`D018-ORF1(b)` — órfão com dívida viva vira `[DÍVIDA]`; sem dívida, `[FAIL]` | execução pós-T009: 11 `[DÍVIDA]`, 0 `[FAIL]`; mutante `D018-M3` prova o discriminante | **conforme** |
| 4 | `C4`/`D018-PRAZO1` — dívida vencida reprova, nomeando entrada e prazo | mutante `D018-M4` sobre cenário com prazo `2000-01-01`: KILL | **conforme** |
| 5 | `C5`/`D018-COB1` — gatilho sem conjunto mutado, em severidade própria | **errata E1**: entregue `[NÃO MEDIDO]`, com causa, credor e gatilho de reavaliação | **spec-errada** (ver abaixo) |
| 6 | `C6`/`D018-MORTO1` — declaração apontando arquivo inexistente reprova | mutante `D018-M5`: KILL | **conforme** |
| 7 | `C7`/`D018-POP1(b)` — julgador na população; exclusão, se houver, nominal | execução: julgador na população (14); mutante `D018-M6`: KILL | **conforme** |
| 8 | Contagem declarada **7 gates**, com mutante previsto cada | 7 gates implementados; 7 pares na matriz; `M5` cai junto com a errata E1 | **conforme com ressalva** |
| 9 | População por **regra + exceções**, nunca enumeração (P1) | `mutation_population.json → regra` (fonte + padrão + raiz); `excecoes: []` | **conforme** |
| 10 | População inicial = `check_*.py` do `pipeline.yaml` (P4) | 14 na população, derivados do `pipeline.yaml` | **conforme** |
| 11 | Os órfãos conhecidos nascem em dívida; vermelho só para órfão novo (P5) | 11 dívidas; `0 problema(s)` na árvore | **conforme com divergência de escopo** |
| 12 | Stage próprio no `pipeline.yaml`, sem tocar `check_mutation.py` | `pipeline.yaml → mutation-coverage`; `git diff` não toca `check_mutation.py` | **conforme** |
| 13 | Julgador não escreve na árvore, não spawna suíte, caminhos entre aspas | leitura pura de JSON/YAML; zero `spawn`; SHA do gate conferido pela campanha | **conforme** |
| 14 | Boundary: classe tocada mais alta = **nenhuma** | três fontes cruzadas na Fase 1 e reconferidas: nada protegido | **conforme** |

## Gaps, classificados

**Item 5 — `spec-errada`.** A exigência estava **mal formulada**: mandava comparar
contra um conjunto que a matriz não publica em forma legível por máquina. Não é
implementação divergente nem ausência — é a spec pedindo o impossível com os dados
existentes. Tratada pela **errata E1**, com as duas alternativas recusadas por
escrito e gatilho de reavaliação nomeado. **Correção da spec aprovada por**: a
errata foi escrita durante a Fase 5 sob a delegação de 2026-08-29 e o proprietário
não a ratificou no chat — **fica declarada como pendência de ratificação**, não
como aprovada.

**Item 8 — ressalva.** O `M5` previsto para o `C5` não existe, pela mesma razão do
item 5. Registrado na matriz como dívida `D018-COB1`, com credor, **nunca como par
vazio**.

**Item 11 — divergência de escopo, e é a mais importante.** A P5 falava nos *seis
órfãos conhecidos*; medido, apenas **um** deles cai na população da P4. As dívidas
entregues são **11**, cobrindo os órfãos reais desta população, e os **cinco**
restantes do `EA-3` seguem invisíveis a este instrumento. Não é falha de
implementação: é a P4 e a P5 não comporem, o que só ficou visível ao medir.
Registrado no dado (`_dividas_nota`) e no relatório.

## Score

**11 conformes · 2 conformes com ressalva · 1 spec-errada = 14 itens.**

**Score de conformidade: 13/14 ≈ 92,9%** — contando o item 5 como não conforme,
que é a leitura conservadora (divergência pesa mais que ausência, §4 da skill).

Abaixo de 100% ⇒ classificado e **não iterado**: as três lacunas são de **spec**,
não de implementação, e iterar a implementação não as fecharia. As três estão
declaradas com credor, gatilho e razão escrita — nenhuma é silêncio.

## O que este documento não decide

Se a errata E1 é ratificada, se o limite da regra vira achado próprio e se o prazo
provisório de `2026-12-31` fica: **decisões do proprietário**. O `qa-engineer`
mede e declara; não ratifica a própria spec.
