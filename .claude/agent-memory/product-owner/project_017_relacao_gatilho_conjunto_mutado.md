---
name: 017-relacao-gatilho-conjunto-mutado
description: Fase 0 da demanda 017 (2026-09-05) — a relação targets ⊇ arquivos_mutados é inclusão com razão de classe, não identidade; IC-6 generalizado nasce 7/11 vermelho (semântico) e pior por forma de path; ponto cego do grep `file:` e do oráculo de reserva ic_estatico
metadata:
  type: project
---

**Decisão recomendada na Fase 0 da 017** (`specs/017-semantica-do-gatilho/refinement.md`,
worktree `phase5-014`, HEAD `9d617d0`): a relação entre gatilho
(`mutation_map.json → targets`) e conjunto mutado (`arquivos_mutados` do C1) é
**inclusão com razão de classe legível por máquina** — faltante FAIL sem exceção,
excedente sem razão FAIL (fantasma), excedente com razão de classe OK nomeado.
O argumento mais curto: R3 §5 (`tdd.md:17`) exige o **gate** no gatilho; a
identidade do meu verbete de 2026-08-29 proibia isso. A identidade não foi erro
da 013 (remédio mais barato para a p51 com 4 harnesses na develop); quem a
promoveu a doutrina foi o glossário que eu escrevi.

**Números medidos (estático, sem shell)**: 11 harnesses com preflight, **7
vermelhos** sob IC-6 generalizado (d010, d009, d014, d011, d015, d016, ea41),
todos por insumo com razão na `_trilha`; **faltante zero em todos** — a doença
original está curada. `core` seria 8º por "oráculo nenhum". Divergência contra a
análise anterior: era "6 de 11"; vale 7.

**O defeito de forma que só a medição literal mostra**: 10 harnesses emitem
`arquivos_mutados` em basename; `ea41` em path repo-relativo; `targets` são
repo-relativos. C1 não fixa a forma. A expressão literal de IC-6 acusaria
**faltante falso** em d014 (6/2) e d016 (55/10). Toda comparação futura precisa
de forma canônica antes.

**Why (método):** dois pontos cegos que quase me fizeram errar a contagem:
(1) grep por `file: F.*` não vê arquivo passado por helper — `em(F.ps016, …)`
em `tests_016_mutants.js:396` faz o planning-state da 016 ser MUTADO, não
insumo; (2) o oráculo de reserva `ic_estatico` (`check_mutation.py:171-182`) tem
os mesmos pontos cegos e só casa a forma `chave: path.join(HERE, …)` da p51 —
não serve para generalizar. E o "precedente p52" da `_trilha` d009 é falsa
analogia: a p52 MUTA `tests_p52_chromium.js` (P52-FC3, V322-M13, V322-M14).

**How to apply:** ao ler conjunto mutado de um harness, varrer `file:`,
`remover:`, `criar:` E os helpers que recebem `F.*` posicionalmente; nunca
confiar na `_trilha` para a contagem (a da d016 cita `:1287` para o laço que
hoje está em `:1333`). Em Fase 1 da 017: cobrar mutante para a direção
"faltante" (nasce verde) e critério "próximo harness não precisa de parágrafo de
desvio". Ver [[gatilho-de-campanha-e-cego]] e [[vocabulario-fechado-nao-e-congelado]]
(nomes de classe de razão são identificadores — não entram no CONTEXT.md).
