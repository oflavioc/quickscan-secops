---
name: linha-citada-pela-auditoria-reler-no-sha-alvo
description: cadeias arquivo:linha vindas de auditoria apontam para o SHA auditado, nao para o alvo do registro; reler no alvo e conferir se o claim existe no arquivo de evidencia entregue
metadata:
  type: feedback
---

Linha citada por auditoria/briefing vale no SHA que ela mediu (1c6a363), nao no SHA em que o registro fecha (0bd677c): `if (!chave) return;` estava em `ui_curation_v32.js:116` na auditoria e em `:121` no alvo. Citações do próprio BACKLOG também deslizam quando se insere nota acima (EA-65 `:6034` virou `:6046`).

**Why:** registro de selagem com linha errada é palpite (R12); e o claim do EA-65 do briefing não constava de `auditoria_evidencias.md` — só dava para escrever pela cadeia estática lida no código, declarando "não reproduzido por mim".

**How to apply:** reler cada linha no SHA-alvo antes de citar; inserir todas as notas do BACKLOG ANTES de medir números de linha para os outros docs; se o claim do briefing não está no arquivo de evidência, escrever só o que a leitura estática sustenta e declarar o resto. Heredoc com aspas/apóstrofos longos falha no parser do Bash tool: escrever arquivos de texto/commit message com Write e usar `git commit -F`.
