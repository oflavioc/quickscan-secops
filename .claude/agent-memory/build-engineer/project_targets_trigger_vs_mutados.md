---
name: project-targets-trigger-vs-mutados
description: d009 é o único harness cujos targets do mutation_map contêm arquivos que ele não muta — o "precedente p52" citado na trilha é falso, e um IC-6 genérico reprovaria d009
metadata:
  type: project
---

`targets` no `mutation_map.json` é gatilho de re-execução; `arquivos_mutados` do
preflight (C1) é o que o harness de fato muta. **IC-6 exige que os dois coincidam
(∪ o próprio harness), mas hoje só é nominal à `p51`** — o laço genérico é do
EA-3 e vive em outra branch.

Medido em 2026-08-30 (preflight de d009 e de p52):

- **`d009` tem 2 excedentes**: `tests_009_leitura.js` e `fixtures_009_leitura.js`
  entram em `targets` como ORÁCULO e FIXTURE da campanha, não como alvo de
  mutação. Zero faltante.
- **O "precedente" que a trilha do d009 invoca é falso**: `p52` lista
  `tests_p52_chromium.js` porque **muta** o arquivo (`P52-FC3`, `V322-M13`,
  `V322-M14`). Medido: `p52` tem excedente 0 e faltante 0.
- **`d009` também invoca `tests_p52_layout.js`** na prova de desenho de
  `D009-M1` (`sobrevive.cmd`) sem declará-lo em `targets` — pela mesma lógica
  que pôs o oráculo lá, é um alvo de trigger faltando.

**Why:** quando o IC-6 genérico do EA-3 aterrissar, `d009` reprova por "alvo
declarado que o harness não muta" — e o desvio é DELIBERADO (endurece o trigger,
nunca o afrouxa). Sem uma noção de "alvo de trigger que não é alvo de mutação",
o gate força a escolha entre mentir no mapa e perder re-execução.

**How to apply:** ao tocar o `mutation_map.json` ou ao revisar o EA-3, levar isto
como requisito de desenho do gate — não como conserto do mapa. Reportar ao
`qa-engineer` (dono do critério), nunca resolver sozinho apagando target. Ver
[[project-013-e1-harnesses]].
