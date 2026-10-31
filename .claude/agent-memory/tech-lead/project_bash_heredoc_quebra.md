---
name: bash-heredoc-quebra-neste-ambiente
description: Na ferramenta Bash deste ambiente (Git Bash/Windows), heredoc quotado com `\\`, `\"` ou regex com barra invertida quebra ("unexpected EOF while looking for matching `''", ou a regex chega mastigada) — scripts de edição/medição vão pelo Write para o scratchpad e rodam com `python <caminho>`
metadata:
  type: project
---

Heredoc `<<'PYEOF'` com corpo contendo `\\|`, `\"` ou `r"(?<!\\)\|"` falhou duas
vezes na sessão de 2026-09-06 (uma com erro de aspas no shell, outra com a regex
chegando ao Python sem a barra). Heredocs simples (sem barra invertida, sem aspas
escapadas) funcionaram.

**Why:** custou duas chamadas e uma substituição de 11 âncoras que precisou ser
refeita via Write; o `sys.stdout.reconfigure(encoding="utf-8")` também é
necessário em qualquer script cuja saída tenha `·`/`…`/acentos, senão o console
imprime `�` (R7 §2 já manda stdout UTF-8 explícito nos geradores).

**How to apply:** script com mais de meia dúzia de linhas ou com qualquer barra
invertida → `Write` no scratchpad e `python "<scratchpad>/x.py"`; medições de
uma linha continuam em Bash. Substituição em massa no `tasks.md`: Python lendo e
escrevendo com `encoding="utf-8", newline=""`, assert de âncora única **antes**
de escrever, e `assert "\r" not in s` ao final.
