---
name: 025-aceite-intencao
description: Fecho da 025 (curadoria transacional) — aceite "não encontrei objeção" em 2026-10-30 condicionado a green + matriz; erratas E9–E11 escritas por mim; pendências O4–O10 a conferir no relatório final
metadata:
  type: project
---

Aceite de intenção da 025 dado em 2026-10-30 (HEAD `f8f753a`, worktree
`phase5-009`) como **"não encontrei objeção"**, condicionado a evidência que eu não
podia inspecionar: green de `tests_025_curadoria_sessao.js` (16/16), m48 97/97,
d019 14/14, UX 56, P50 65, stage `m41`, e a matriz M1–M23 (T084 fechou depois:
23 DETECTADO · 0 SOBREVIVENTE, baseline 527/527 — segundo o orquestrador, HEAD
`3741ebd`; não executado por mim).

**Why:** produto e docs conferidos linha a linha contra refinement/spec: mensagens
exatas, ordem do commit, guarda `&& snap.curadoria` caída (ERR-1), chave
desconhecida recusada (ERR-2), textos de P2/P4, tabela do toggle (P3), docs e
glossário fiéis. Nenhuma divergência de negócio. O que ficou em aberto era prova,
não intenção.

**How to apply:** O1/O2 **resolvidas em 2026-10-30** — usuário: *"Autorizo a
errata (Recomendada)"* e *"Ratifico (Recomendada)"*; eu escrevi E9 (INV8 nasce
vermelho só por (d); (c) idempotência sem carrasco), E10 (literal de F-tardio) e
E11 (`validate(undefined) → []`) em `spec.md` §Erratas tardias + rodada 7 do
refinement. Ao ler o `relatorio-final.md`, conferir ainda: (O4) E5 "exclusão de
ofertado" não medida por INV8(d); (O5) planning-state estava
`implement/in_progress, waves_done [0,1]` no aceite — T095 atualiza; (O6)
`USER_GUIDE.md:467-470` usa "o engenheiro" fora do §11 — confirmar por git se é
pré-025; (O8) caso 26 (papel no Chromium) é job `visual`, não da suíte; (O9)
BACKLOG E8 ainda `aberto` para EA-110/EA-115 no aceite — doc-writer depois de mim.
Lição de processo: a árvore da worktree foi LIMPA entre meu handback e a rodada
seguinte — memória escrita antes de um commit do orquestrador pode sumir; reler
`MEMORY.md` no início de cada rodada e regravar se preciso.
Dívida de vocabulário que a 025 NÃO resolveu e segue minha: o nome do papel
(facilitador/operador/engenheiro) — passe próprio do PO, ainda pendente.
Relacionado: [[owner-canonico-seis-perguntas]], [[cobertura-de-mutante-por-alinea]],
[[014-fecho-e-pendencias]].

**E12 (2026-10-30, HEAD `017ed5d`):** `targets` de `harnesses.d025` = 9 (a spec dizia 8; faltava `SESSION_SCHEMA_V32.md`, mutado em cópia pelo M21); o G1 do spec-validate `f965100` (41/42) fechou na direção spec-corrigida, errata autorizada pelo proprietário; iteração 2 = 42/42. Regra derivada: [targets derivam do conjunto mutado](feedback_targets_derivam_do_conjunto_mutado.md).
