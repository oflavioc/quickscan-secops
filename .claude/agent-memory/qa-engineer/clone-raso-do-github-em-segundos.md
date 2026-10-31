---
name: clone-raso-do-github-em-segundos
description: Bateria de I/O sobre histórico raso se mede em clones efêmeros com origin = GitHub — `git init` + `remote add` + `fetch --depth=N origin develop` leva 2–3 s (árvore de 19 MB) e `--unshallow` 9 s; clone completo vira raso com `fetch --depth=1 origin <sha>` de qualquer commit reachable; branch NÃO enviada entra no clone raso por `git fetch <worktree> +branch:refs/heads/x` sem tocar `.git/shallow` (pré-fix e pós-fix no mesmo clone); `--depth=N` marca a fronteira do BFS (depth=10 ⇒ 7 linhas, 10 first-parent lidos); o protótipo com origin = worktree "restaurou" para o develop LOCAL; e `gate | tail; echo $?` devolve o exit do tail
metadata:
  type: project
---

Receita medida em 2026-09-05 (T092 do fix-finding EA-39, `prova-de-carga.md`
§12.1) para provar o que o leitor de histórico faz sob `.git/shallow` — sem
tocar a worktree e sem depender do `develop` local:

```
git init A && cd A && git remote add origin https://github.com/oflavioc/quickscan-secops.git
git fetch --depth=1 origin +refs/heads/develop:refs/remotes/origin/develop   # 2 s (depth=3: 3 s)
git checkout --detach refs/remotes/origin/develop
# raso ACIMA do piso (depth=1) ⇒ piso-invalido com detalhe falso; NO piso (depth=3) ⇒ leitor mudo, só a guarda acusa
git fetch origin +refs/heads/develop:refs/remotes/origin/develop   # sem --depth: .git/shallow PERSISTE
git fetch --unshallow origin                                        # 9 s contra o GitHub: 69 commits, 39 (ok)
```

Para o cenário "raso irrelevante" (flag `true`, cadeia íntegra): clone local
completo (`git clone --no-hardlinks -b <branch> C:/…/phase5`) + `git remote
set-url origin <GitHub>` + `git fetch --prune origin`, depois `git fetch
--depth=1 origin <sha> --no-tags` com um commit **fora** da cadeia first-parent
(`ec74d6f^2` serviu; o GitHub aceita SHA cru reachable) ⇒ `is-shallow-repository
= true`, 69 commits até a raiz, gate `exit 0`, `--json` byte-idêntico. É a
testemunha de que um impedimento disparado só pelo flag acusaria falso.

**Why:** o protótipo do `tech-lead` usou a worktree como `origin`; o
`--unshallow` "restaurou" para `origin/develop = acc9c21` (55 commits, piso
fora) porque o branch **local** `develop` estava atrás do remoto — a medição
do remédio ficou inválida. Quando a pergunta é "o que um fetch restaura", o
`origin` do clone efêmero tem de ser o remoto de registro, nunca um clone
irmão ([[clone-efemero-para-refs-remotas]] já tinha a metade "o develop local
está atrás"). Custo real: segundos, não minutos — a árvore tem 19 MB; o pack
de 205 MiB só pesa no `--unshallow`.

**How to apply:** (1) cite em cada clone `git ls-tree HEAD` dos arquivos que o
gate lê — se são os mesmos blobs de HEAD, o clone de `origin/develop` mede o
código de HEAD sem checkout da branch; (2) grave `.git/shallow` (linhas), o
fim da cadeia com `%P` e `cat-file -p | grep -c parent`, e o `_leitura` do
`--json`, não só o exit; (3) **nunca leia `$?` depois de um pipe** — `python
gate | tail -4; echo $?` imprimiu `0` para um gate vermelho (era o exit do
`tail`); meça sem pipe ou por `${PIPESTATUS[0]}`. Ver
[[playwright-torna-o-clone-raso-sob-pr]] (o vetor) e
[[leitor-mudo-sobrevive-ao-gate-nu]] (o que a guarda cobre).

## 2026-09-05 (T096, §12.2) — a branch do fix não está no remoto: traga-a do local

O código pós-fix só existia na branch local (sem push, sem PR). O que
funcionou, sem quebrar o "origin = GitHub": no clone raso já com
`origin/develop` rasa, `git fetch <worktree local>
+refs/heads/fix/…:refs/heads/fix-x` traz só os commits do fix (descendentes da
ponta rasa) e **não toca `.git/shallow`** — conferido byte a byte antes/depois
em A (1 linha), B (3) e G (7). `git checkout --detach fix-x` põe o código novo
sobre a **mesma** `origin/develop` rasa, então o mesmo clone dá o controle
pré-fix (checkout de `origin/develop`, blobs de §12.1) e a medição pós-fix.
Bateria inteira (A, B, G, C, D, E) em 57 s; `--unshallow` 10 s. Dois fatos
laterais: (1) `--depth=N` é fronteira de BFS sobre todos os pais — `depth=10`
deixou 7 linhas em `.git/shallow` e 10 commits first-parent lidos; o leitor
usa o **fim da caminhada**, não o arquivo, logo o número de linhas não importa
ao gate, mas registre-o para ninguém "corrigir" a tabela; (2) o `--pr --json`
cresceu de 15 485 para 16 401 bytes entre §12.1 e §12.2 porque o objeto inclui
a sonda (35 → 37 casos) — a comparação que vale é raso × completo no mesmo
código, não pré × pós.
