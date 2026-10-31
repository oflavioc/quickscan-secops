---
name: playwright-torna-o-clone-raso-sob-pr
description: Causa do A1 da 016 — sob GITHUB_ACTIONS + evento pull_request, o runner do @playwright/test faz `git fetch origin <pull_request.base.sha> --depth=1` (runner/index.js:762) e grava .git/shallow; se base.sha é o piso, ler_merges devolve 0 com piso_na_cadeia true; PR × dispatch não são amostras comparáveis; o par de controle é o job verify do MESMO run; `git status --porcelain` não vê .git/shallow
metadata:
  type: project
---

Diagnóstico de 2026-09-05 (A1 do `spec-validate.md` da 016; registro em
`prova-de-carga.md` §11, EA-38/EA-39). Quatro runs `pull_request` do PR #40
com o `visual` vermelho (`C0-fecho · FALHOU · ÁRVORE · censo 0/39
(divergente) · 0 problema(s) · origin/develop 921977c`), dois
`workflow_dispatch` verdes no mesmo head — e o job `verify` do mesmo run
`pull_request`, checkout idêntico, `[PASS] fecho`.

**O vetor**: `node_modules/playwright/lib/runner/index.js` — `ciInfo()`
(`:679-693`) lê `GITHUB_EVENT_PATH` e devolve `prBaseHash =
pull_request.base.sha`; `gitDiff()` (`:762`) executa `git fetch origin
<base.sha> --depth=1 --no-auto-maintenance --no-auto-gc --no-tags
--no-recurse-submodules`; condição `captureGitInfo.diff === undefined && ci`
(`:669`). `git fetch --depth=1` de um commit já presente **grava
`.git/shallow`** com ele: se `base.sha` é o piso, a cadeia first-parent de
`origin/develop` vira `[piso]` sem pais, `%P` vazio, e `ler_merges` acha o
piso na posição 0 com 0 merges e `causa: null`. `git status --porcelain`
(guarda de "árvore limpa" do `check_mutation.py`) **não vê** `.git/shallow`.

**Como se prova em minutos**: réplica do checkout do CI (`git init`, o `fetch`
literal da linha 101 do log, `checkout --force refs/remotes/pull/N/merge`),
gate nu ⇒ `39 (ok)`; depois `CI=true GITHUB_ACTIONS=true
GITHUB_EVENT_NAME=pull_request GITHUB_EVENT_PATH=event.json` (com
`pull_request.base.sha`) e UM teste do `playwright test` ⇒ `.git/shallow`,
`%P` vazio, gate `0/39 (divergente)`, nota do C0 byte-idêntica à do CI. Sem
Playwright, o comando à mão (`git fetch origin <sha> --depth=1 …`) faz o
mesmo em Windows e Linux. `git fetch` simples de `develop` **não** repara;
`git fetch --unshallow` repara; `captureGitInfo: { commit: false, diff:
false }` no `playwright.config.js` evita (medido).

**Why:** a hipótese "checkout de `refs/pull/N/merge` quebra a caminhada" era
plausível e estava errada; quem a refutou foi o **job `verify` do mesmo
run** (mesmo checkout, sem Playwright, verde). E "não reincidiu" no
`workflow_dispatch` não dizia nada: o `event.json` do dispatch não tem
`pull_request`, logo o vetor nem dispara.

**How to apply:** (1) ao comparar runs do CI, pareie por **evento + head +
job**: dispatch × PR diferem em checkout, em `GITHUB_*` e no `event.json`;
o controle de um job vermelho é o job irmão do mesmo run, não outro run.
(2) Se um gate que lê histórico dá número menor que o esperado com a ref
presente, confira `git rev-parse --is-shallow-repository` e `cat
.git/shallow` antes de qualquer hipótese sobre o leitor. (3) Ferramenta de
terceiros que roda `git` dentro do job (Playwright, npm com deps git,
reporters) é ator de mutação do `.git` — liste-a ao procurar "quem mexeu
entre o checkout e o gate". (4) Não leia "porcelain limpo" como "repositório
intacto". Ver [[vermelho-de-controle-sem-nota-no-stage]],
[[deducao-nao-e-leitura-no-log-do-ci]], [[leitor-mudo-sobrevive-ao-gate-nu]].
