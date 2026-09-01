---
name: baseline-so-ve-o-commit
description: check_baseline.py compara pins contra BLOBS DE HEAD — mutante de arquivo protegido no disco é invisível ao stage baseline; quem pega é P50-GOV1
metadata:
  type: project
---

Medido em 2026-08-31, em worktree efêmera, com o mutante `D011-M6` (um byte
trocado dentro de um comentário de `ui_ux_v32.js`):

| Momento | `P50-GOV1` | stage `baseline` |
|---|---|---|
| mutação só no disco | **FAIL** — "protegidos alterados: ui_ux_v32.js" | **PASSA** (272/272 pins) |
| mutação commitada sem repin | FAIL | **FAIL** — "pin diverge: ui_ux_v32.js (registry a050401145a5 ≠ HEAD 8d9a954f3726)" |

A causa está no próprio `check_baseline.py`: ele resolve cada pin por
`git show HEAD:<path>` (é o desenho de R2 §2, à prova de CRLF). A árvore de
trabalho não entra na conta. `P50-GOV1`, ao contrário, lê os arquivos com
`fs.readFileSync` e por isso enxerga o disco.

**Why:** planos e matrizes escrevem "carrasco: P50-GOV1 + stage baseline" como
se os dois pegassem a mesma coisa ao mesmo tempo. Não pegam: o `baseline` é
carrasco **pós-commit**. Um par de mutante de superfície protegida registrado só
contra o `baseline` deixaria o mutante não commitado sobreviver — e a campanha
registraria um KILL que não existe.

**How to apply:** ao provar mutante que edita arquivo protegido, meça os DOIS
momentos e registre qual gate pega qual. Na escolha do carrasco de um par: gate
que lê a árvore pega a edição; gate que lê HEAD pega o commit. Vale para
qualquer gate novo apoiado em `git show`. Relacionado:
[[preflight-prova-unicidade-nao-sitio]].

**Confirmado de novo, com outro mutante e outro arquivo (015, 2026-08-31).**
`D015-M16` move a declaração de C2 para o card-alvo, editando `ui_target_v32.js`
no disco de uma worktree efêmera. Medido lá dentro: `check_baseline.py` fecha
**289/289 pins conferindo, 0 divergentes** — cego ao mutante —, enquanto
`P50-GOV1` reprova com "protegidos alterados: ui_v32.js, ui_target_v32.js" e
`D015-GOV1(a)` reprova pelo **produto** ("#pr-target DIVERGE: âncora 45898 bytes,
HEAD 46113"). Dois carrascos que leem o disco, um que lê HEAD e não vê nada. A
regra não é sobre um arquivo: é sobre a fonte que cada gate consulta.
