---
name: evidencia-de-hook-le-se-na-pasta-primaria
description: Antes de registrar qualquer evidência sobre hook (rodou, bloqueou, logou), conferir a cópia da PASTA PRIMÁRIA e a branch dela — não a da worktree onde se trabalha
metadata:
  type: feedback
---

Toda afirmação sobre hook — "o guarda rodou", "não bloqueou", "o log não
existe" — se confere na cópia da **pasta primária**, e na **branch em que ela
está parada**. O `settings.json` invoca
`bash "$CLAUDE_PROJECT_DIR"/.claude/hooks/<guarda>.sh`: configuração **e**
código vêm da primária, não da worktree da demanda. Dois corolários que já
mordem:

- `project_root()` (`.claude/hooks/lib/common.sh`) é `git rev-parse
  --show-toplevel` **sem argumento** — resolve do cwd do processo do hook, isto
  é, da primária. Índice medido, e `dispatch.log` escrito, caem no clone
  primário (achados `EA-84`, `EA-87`, registrados em 2026-10-11).
- a branch da primária pode ser mais antiga que a de trabalho: em 2026-10-11 a
  primária estava em `chore/fecho-013-done`, que **não tem** `guard-add.sh` nem
  `log_dispatch` — o commit `58372d6` não é ancestral dela. "Log ausente" ali
  prova falta de instrumento, não falta de despacho.

**Why:** registrar "o guarda não disparou" lendo o código da worktree é
registrar veredito sobre um arquivo que ninguém executou — verde falso ou
vermelho falso, os dois inauditáveis. O `EA-83` existe justamente porque
ausência de bloqueio não distingue "despachou e aprovou" de "não despachou".

**How to apply:** ao registrar evidência de hook, dizer **qual cópia** foi lida
e em **qual branch** (`cd` na primária, `git rev-parse --abbrev-ref HEAD`,
`grep` no arquivo do disco e `git cat-file -e HEAD:<path>`); e, se a medição foi
feita a partir da worktree, declarar isso como limite da medição. Ver
[[status-do-achado-contra-o-fonte]] e [[prova-aditiva-mede-forma-nao-sentido]].
