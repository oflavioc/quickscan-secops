---
name: verificacao-em-clone-alinhar-refs
description: Rodar run.sh/compliance-audit num clone limpo para "refazer na develop atual" falha por ambiente do clone (origin/develop velho, remote local) — alinhar as refs antes de crer no FAIL; e três gotchas de shell do Windows
metadata:
  type: feedback
---

Ao refazer o pipeline numa cópia limpa (clone local de um SHA, para não
sujar a worktree), o resultado só vale depois de alinhar o que o pipeline lê
de **refs**, não só do commit:

- `check_mutation.py` toma por base `origin/develop` (merge-base). Num clone
  feito de uma worktree, `origin` é o repositório local, cuja `develop` pode
  estar velha. Medido em 2026-10-19: base em `1c6a363` → `USER_GUIDE.md`
  (alvo do harness `p51`) contou como alterado → a campanha `p51` dispara →
  `run.sh` deu **17 PASS · 1 FAIL** (`mutation`). Com
  `git update-ref refs/remotes/origin/develop <SHA>` → **18 PASS · 0 FAIL**.
- `compliance-audit.sh` (seção `branch-protection`) precisa do remote GitHub:
  com `origin` = caminho local dá **WARN** "NÃO DETERMINÁVEL". Com
  `git remote set-url origin https://github.com/oflavioc/quickscan-secops.git`
  → 17 PASS · 0 FAIL · 0 WARN.

**Why:** a R2 §3 manda isolar ambiente antes de culpar código; aqui o FAIL
era do clone, e o primeiro resultado precisa ficar registrado (R2 §1), com a
causa. O `run.sh` trunca a saída do stage (EA-15) — a linha do "problema" cai
no trecho omitido; reproduzir o stage sozinho com `python -u` mostra o que
disparou.

**How to apply:** clone em `scratchpad`, `node_modules` copiado de uma
worktree irmã (47 MB, evita `npm ci`), `git checkout --detach <SHA>`, alinhar
`origin/develop` e o remote **antes** do primeiro `run.sh`; o pipeline
completo leva ~8 min. Matar uma campanha no meio deixa o clone mutado
(`git checkout -- .` restaura — só vale em clone descartável).

Gotchas de shell (Git Bash via ferramenta, Windows): `$'\r'` não é
interpretado — `grep -c $'\r'` devolve o total de linhas (falso positivo de
CRLF); medir com `tr -cd '\r' < arquivo | wc -c`. Heredoc longo com `cat >`
falhou com "unexpected EOF" — para arquivo grande usar a ferramenta Write
(que grava LF). Ver [[status-do-achado-contra-o-fonte]] para a mesma disciplina
de conferir o fonte antes de transcrever.
