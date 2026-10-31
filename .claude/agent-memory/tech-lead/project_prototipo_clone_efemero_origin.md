---
name: prototipo-clone-efemero-origin-local
description: Protótipo em clone efêmero que aponta `origin` para a worktree local herda o branch LOCAL `develop` (atrás do remoto) em `--unshallow`/fetch padrão — pine a refspec `refs/remotes/origin/develop` ou use o GitHub como origin; e o `--pr` do check_fecho nunca lê histórico (única chamada de ler_merges é vivo_pos)
metadata:
  type: project
---

Em protótipos descartáveis de `check_fecho.py` sob clone raso (EA-39,
2026-09-05), `git init` + `remote add origin <worktree local>` + `fetch --depth=N
+refs/remotes/origin/develop:refs/remotes/origin/develop` reproduz fielmente o
raso (acima do piso, no piso, raso irrelevante). Mas `git fetch --unshallow
origin` usa a refspec padrão `+refs/heads/*:refs/remotes/origin/*` e sobrescreve
`origin/develop` com o branch **local** `develop` da máquina (worktree `phase5`,
`acc9c21`, atrás do remoto e anterior ao piso) — o resultado "piso fora da
cadeia" após o reparo é artefato do protótipo, não achado.

**Why:** custou uma linha de medição inválida na nota `ea39-desenho.md`; a
§11.3 da prova de carga da 016 mediu o `--unshallow` contra o GitHub e ele
restaura (`39 (ok)`).

**How to apply:** em bateria adversarial de I/O (clone efêmero), `origin` =
GitHub ou refspec pinada em `refs/remotes/origin/develop` em TODO fetch,
inclusive no reparo. Lembrete que decide desenho: `ler_merges` tem um único
chamador vivo (`check_fecho.py:vivo_pos`); o caminho `--pr` lê só planning-state
e disco — impedimento novo no leitor de histórico não alcança o job `fecho` do CI
(raso por desenho). Verifique por grep antes de citar: a nota descreve a árvore
de 2026-09-05. Ver [[medir-gatilho-de-campanha-e-onde-fecha]].

**Receita que funcionou para rodar o stage `mutation` inteiro com a worktree
suja (Fase 2 da 017, 2026-09-06)** — `check_mutation.py` recusa `git status`
sujo, e o planning-state do orquestrador suja a árvore por desenho: `git clone
-q --no-hardlinks -b <feature> "<git rev-parse --git-common-dir>"` (na máquina, o
common-dir das worktrees é `C:/Projetos/QuickScan-SOC-CMM/phase5/.git`) para o
scratchpad; `git update-ref refs/remotes/origin/develop <sha da base>` (o clone
local não traz remote-tracking refs, e sem `origin/develop` o stage roda TODAS
as campanhas); `cmd //c "mklink /J node_modules <worktree>\node_modules"`
(junção — `node_modules` é ignorado, o porcelain fica limpo); `PYTHONIOENCODING=utf-8
MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py`. Preflights e
sondas rodam em ~1 min; campanhas locais (`d014` 35 s) também, in-place com
restauração — na cópia, nunca na árvore. R7 §3 satisfeita: nada escreve na
árvore versionada.

**Red de gate que recusa árvore suja (017, Fase 3, 2026-09-06).** As duas
demandas anteriores puseram gate e relatório do red **no mesmo commit**
(`f89ab95` na 013, `d1ae3c7` na 016). Como `check_mutation.py:57-61` recusa
porcelain sujo, o red é medido **antes** do commit em clone efêmero com **commit
efêmero de conteúdo idêntico** (a `_trilha` do EA-41 cita `d4163d3`); o
`red-NNN.md` cita o `git hash-object` dos arquivos para a identidade com o
commit real ser conferível, e uma tarefa `chore` do QA reexecuta na árvore real
depois do repin — o resultado vai a `red.notes` do planning-state, nunca ao
`red-NNN.md` (exigiria outro repin). Cada mutante em cópia = commit efêmero +
`git reset --hard`; nada disso toca a worktree.

