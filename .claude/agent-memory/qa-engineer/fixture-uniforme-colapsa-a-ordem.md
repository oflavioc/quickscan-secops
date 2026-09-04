---
name: fixture-uniforme-colapsa-a-ordem
description: Na tela de prioridade, answerAll(w,1) faz a ordem do DOM pós-agrupamento coincidir com a ordem global — e o mutante de renumeração vira equivalente
metadata:
  type: project
---

Medido em 2026-08-31 sobre `quickscan_secops_soccmm_v3_2_dev.html` em jsdom 30:
com `answerAll(w, 1)` (as 15 respostas no mesmo nível) a ordem dos `.opt` no DOM
depois do reagrupamento por domínio de `uxPriority` (`ui_ux_v32.js:154-168`) é
**idêntica** à ordem global de `computeFindings()`. A razão é estrutural: `QS`
já está ordenada por domínio (k0-2 dom0, k3-5 dom1, …), a severidade é uniforme
`[2,1,0,0]` nas 15 perguntas, e com um nível único o desempate cai todo em
`k asc`. O agrupamento vira permutação identidade.

Fixture que quebra a coincidência: três respostas em **nível 0** (sev 2) em
domínios diferentes — `{training:0, logs:0, "vulnerability-management":0}`, resto
em nível 1. Ordem global resultante:
`training, logs, vulnerability-management, mandate, governance, policies,
team-capacity, knowledge, incident-response, detection-lifecycle, automation,
endpoint, network-visibility, monitoring-coverage, external-surface`;
no DOM o glifo `1` cai na 4ª posição visual. Casos negativos vizinhos, também
medidos: nível 2 ou 3 em todas zera os findings (`.ux-priolayout` existe, zero
`.opt`) e alcança o "se e somente se" da legenda; item de índice ≥ 9 selecionado
exibe `✓`, então gate de "glifo vazio" não pode medir depois de selecionar mudo.

**Why:** o mutante "renumerar o glifo pela posição visual pós-agrupamento"
(`D011-M2`) é **equivalente ao código correto** sob fixture uniforme — morreria
zero vezes e o gate nasceria vacuoso sem que nada denunciasse. `tests_ux_m41.js`
usa `answerAll(w,1)` em toda a família UX8–UX15, então copiar o setup do
precedente é o caminho natural para o vácuo.

**How to apply:** todo gate desta tela que afirme correspondência entre índice
global e apresentação usa fixture mista, e leva uma **alínea explícita de
não-vacuidade** que reprova se as duas ordens voltarem a coincidir — a guarda é
o único ponto que sobrevive a alguém "simplificando" a fixture e o literal
declarado ao mesmo tempo (medido: nesse caso a alínea de ordem canônica passa a
concordar e só a guarda dispara). Ver [[universo-de-tamanho-um]] e
[[cenario-sem-mutante-e-cenario-nao-medido]].
