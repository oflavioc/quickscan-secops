---
name: patches-por-arquivo-nao-heredoc
description: Patches em Python com escapes (\n, \x00) devem ir por script escrito com Write no scratchpad — o heredoc do Bash tool mangla o escape e quebra o arquivo
metadata:
  type: feedback
---

Patch de código que contenha sequências de escape (`"\n"`, `"\x00"`, `"\\"`) **não**
vai por heredoc do Bash tool: escrever o script no scratchpad com o Write tool e
executá-lo por caminho absoluto.

**Why:** em 2026-09-05, no fix EA-39 (`.claude/verify/fecho.py`), um
`python - <<'PY'` com `obj.stdout.split("\\n\\n", 1)` chegou ao disco com quebras
de linha **reais** dentro do literal — `SyntaxError: unterminated string literal`.
O heredoc supostamente literal (`<<'PY'`) não preservou o escape neste ambiente
(Git Bash no Windows). Um `git diff` desatento passaria isso adiante; só o
`py_compile` pegou.

**How to apply:** heredoc serve para comandos curtos sem escapes. Para qualquer
edição byte-sensível — e neste repo quase toda é, porque mutantes ancoram em
linhas byte-idênticas (`tests_016_mutants.js` → `find`) — usar Write + execução,
com `assert conteudo.count(velho) == 1` em cada troca e `py_compile` no fim.
Relacionado: [[ancoras-de-mutante-sao-bytes]].
