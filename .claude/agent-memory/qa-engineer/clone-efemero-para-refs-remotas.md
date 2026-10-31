---
name: clone-efemero-para-refs-remotas
description: Worktrees compartilham refs/remotes — `git update-ref -d refs/remotes/origin/develop` numa delas apaga o ref para TODAS; bateria que mexe em ref remoto roda num `git clone` local no scratchpad, com `update-ref` fixando origin/develop no SHA do remoto real (o `develop` local pode estar atrás)
metadata:
  type: project
---

Para provar C1(e) da 016 ("`origin/develop` ausente ⇒ FAIL `NÃO DETERMINÁVEL`,
nunca SKIP") a receita da worktree efêmera **não serve**: `refs/remotes/*`
vive no repositório comum, e apagá-lo em qualquer worktree apaga em todas
(recuperável só por `git fetch`). O que funcionou (2026-09-04):

```
git clone -q --no-hardlinks -b <branch> C:/…/phase5 <scratchpad>/clone
cd clone && git update-ref refs/remotes/origin/develop <sha do remoto real>
# controle: gate nu ⇒ 0 problema(s)
git update-ref -d refs/remotes/origin/develop   # só no clone
# gate nu ⇒ global origin-develop-ausente, 11/11 NÃO DETERMINÁVEL, exit 1
git checkout -q -- . ; cd / ; rm -rf <scratchpad>/clone
```

Duas armadilhas medidas: (1) no clone, `origin/develop` nasce apontando para
o **`develop` local** do repositório-fonte, que estava **atrás** do remoto
(`acc9c21` contra `921977c`) — sem o `update-ref` o piso ficaria fora da
cadeia e o gate abortaria por `piso-invalido`, um falso cenário; confira
`git ls-remote origin refs/heads/develop` antes e fixe o SHA. (2) `PATH=""`
com o interpretador por caminho absoluto simula `git` ausente sem tocar nada;
o gate respondeu FAIL nomeado pelo `protegido()` (`ler_data_commit` não
classifica `FileNotFoundError` — observação levada ao core-engineer).

**Why:** mexer no ref compartilhado teria deixado as oito worktrees do clone
sem `origin/develop` no meio de outras sessões; o clone isola por construção,
e o controle antes da sabotagem prova que o FAIL veio dela.

**How to apply:** qualquer bateria que apague/mova ref remoto, reescreva
`.git/config` ou precise de `origin` diferente vai para clone efêmero no
scratchpad, com controle verde antes da sabotagem e `rm -rf` ao fim. Worktree
efêmera continua sendo a forma certa para sabotagem de ÁRVORE (arquivos) —
ver [[trilha-e-ambiente-quickscan]] item 2.
