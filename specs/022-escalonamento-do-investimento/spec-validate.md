# Conformidade — 022-escalonamento-do-investimento

> Fase 6 · executor: qa-engineer · somente leitura.
> Conferido na implementação REAL (fonte + execução de gate), nunca no relato de
> quem implementou (R2 §4).

## Score

**14 de 14 critérios conformes · 100%** — com **uma nota de letra** no C1, tratada
como errata E3 abaixo e não como divergência mascarada.

## Item a item

| # | critério | conforme | evidência (executada) |
|---|---|---|---|
| C1 | teto = índice do estágio, piso 1 | sim* | `D022-TETO1` PASS · varre os seis estágios e exige ≥ 4 tetos distintos |
| C2 | prioridade não é cortada pelo teto | sim | `D022-PRIO1` PASS · 3 prioridades sob teto 2, as três na primeira onda |
| C3 | tensão nomeada, nunca podada | sim | `D022-TENS1` PASS · nó `[data-qs22-tensao]` com os dois números e o estágio |
| C4 | sem suficiência não há escalonamento | sim | `D022-SUFI1` PASS · `teto === null`, zero acréscimo, nó `[data-qs22-sem-teto]` |
| C5 | união == cobertura da 021 (E1: inclui excluídas) | sim | `D022-COB1` PASS · igualdade, oráculo do motor |
| C6 | a onda seguinte declara o critério | sim | `D022-CRIT1` PASS · o nó cita teto e estágio |
| C7 | exclusão pela ausência declarada (E1) | sim | `D022-ALVO1` PASS · seis alíneas, incluindo a borda "sem cenário, ninguém excluído" |
| C8 | o alvo não abre frente nem infla o teto | sim | `D022-ALVO2` PASS · quatro alvos, contagem idêntica |
| C9 | vale no papel | sim | `D022-PAP1` PASS · conjunto impresso == contrato |
| C10 | produto uma vez, sinais unidos (E2) | sim | `D022-PROD1` PASS · em `pr-sup-solucao`, com o habilitado por sinal presente |
| C11 | distinguível por texto, não cor (UX-P7) | sim | `D022-A11Y1` PASS |
| C12 | proveniência declarada (UX-P6) | sim | `D022-PROV1` PASS |
| C13 | não altera estado canônico (UX-P8) | sim | `D022-INV1` PASS · snapshot tomado ANTES do primeiro render |
| C14 | nenhum `frozen` tocado, régua imóvel | sim | `D022-BND1` PASS · 4 identidades `OK` · payload M41 `9794b267…` idêntico ao pinado |

```
D022 ESCALONAMENTO: 14 PASS · 0 FAIL de 14
D022 MUTATION:      13 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 13
```

## Errata E3 (2026-09-30) — a letra do C1, alinhada ao que foi aprovado

**Classe: `implementação-divergente` na LETRA, equivalente no VALOR.** Registrada
em vez de calada, porque quem lê a spec daqui a um ano não deve encontrar uma
fórmula que o código não usa.

A spec escreveu `teto = max(1, Math.round(overall))`. A implementação usa **o
índice da banda de `__QS_STAGE_RULER`** que contém o `overall`. Os dois são
numericamente idênticos — as fronteiras de `stageOf` (`0.5 / 1.5 / 2.5 / 3.5 /
4.5`) são exatamente as de `Math.round`, e foi essa medição que sustentou o D1 do
refinamento.

A troca foi **proposta no plano e aprovada com ele** (*"Aprovado, e autorizo o
ui_v32.js"*, 2026-09-28), com o motivo escrito: um `Math.round` próprio seria a
quarta cópia literal de um valor com dono na mesma semana. O que faltou foi
propagar a letra para a spec — o que esta errata faz.

**Não se resolve afrouxando o gate** (R10 §1), e não foi: o `D022-TETO1` recomputa
o esperado a partir de `stageOf` lido do artefato, nunca de tabela transcrita, e
exige **≥ 4 tetos distintos** na varredura. Um teto constante não passa.

## O que esta validação NÃO certifica

- **Que a leitura ficou boa.** Os gates provam que as ondas existem, que o teto sai
  da régua, que nada some do relatório e que o estado canônico não se move. Nenhum
  deles prova que o texto ajuda o facilitador — isso é o aceite de intenção, e
  depois dele uma sessão real.
- **O item 2 e o 3 do lote `EA-58`**, fora de escopo desde o refinamento.
- **O `EA-76`** (a derivação "o que o motor ofereceu" existindo em duas cópias),
  achado durante a W3 e registrado no backlog — não é desta demanda corrigir.
