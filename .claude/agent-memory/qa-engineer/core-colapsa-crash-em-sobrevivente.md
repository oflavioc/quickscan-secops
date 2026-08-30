---
name: core-colapsa-crash-em-sobrevivente
description: tests_core_mutants.js não tem os três estados de T4/T5 — oracle que morre por dependência ausente vira "gate sem poder discriminante", e worktree sem node_modules produz 3 falsos sobreviventes
metadata:
  type: project
---

`tests_core_mutants.js` decide com `dead = code !== 0 && m.reason.test(out)` e
imprime, no `else`, `NÃO matou — gate sem poder discriminante`. **Não existe
NÃO EXECUTADO ali**: qualquer motivo para o oracle não emitir a linha esperada —
inclusive `Error: Cannot find module 'jsdom'` — é contado como sobrevivente.

Consequência prática medida (2026-08-29): rodar `check_mutation.py --all` numa
worktree efêmera (que **não tem `node_modules`**) devolve
`CORE MUTATION: 0 KILL · 3 escaparam de 3 (CM1, CM2, CM3)` — três falsos
sobreviventes, contra `mutation-matrix.json` que registra os três como KILL.
As âncoras dos três estão íntegras (`ocorrencias == 1`), então não é rot: é o
colapso de estados.

**Why:** `core` é a REFERÊNCIA do interpretador e está declarado FORA das edições
da 013 (T8 / `IC_SEM_PREFLIGHT`), então não recebeu o vocabulário fechado de
T4/T5 que p50/p51/p52 receberam. Ele também nunca roda no CI: seus alvos não
mudam, e o trigger por path não o exige.

**How to apply:** antes de reportar sobrevivente vindo de `core`, rode o oracle
dele isolado (`node tests_ref_m44.js`, `node tests_unset_ug.js`,
`node --max-old-space-size=4608 tests_session_m48.js`) na MESMA árvore e confira
que ele passa no baseline. Em worktree efêmera, `npm ci` primeiro — ou não
interprete o resultado. Ver [[medir-red-do-proprio-julgador]].
