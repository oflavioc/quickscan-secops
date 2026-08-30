---
name: autoridade-delegada-2026-08-29
description: Desde 2026-08-29 o proprietário está ausente e delegou as decisões; quem aprova portões usa autoridade emprestada — desenhos que exigem ratificação devem ser evitados ou escalados
metadata:
  type: project
---

O proprietário **se ausentou e delegou as decisões** ao interlocutor a partir de
**2026-08-29**. Corroborado fora do chat: o commit da Fase 0 da demanda 013
(`dae68d0`) abre com *"DECIDIDO SOB DELEGAÇÃO do proprietário ('tome as decisões
por mim, preciso me ausentar'), NÃO aprovado por ele pessoalmente"*, e o
`planning-state` da 013 repete a distinção em `refinement.notes`.

**Why:** delegação genérica não é ratificação nominal. O rito D2/Porta B (R1/R6),
a troca de âncora normativa (precedente da 009, ver
[[demanda-009-secao8-substituida]]) e a expansão de boundary (R6 §3) pressupõem
decisão de quem detém a autoridade — e um auditor futuro precisa conseguir
distinguir as duas coisas na trilha.

**How to apply:** ao desenhar sob delegação, **prefira sempre a rota que não
precisa de ratificação** (ex.: provar neutralização de gate em worktree efêmera
em vez de editar suíte alcançada por prosa de §29.4; usar stage existente em vez
de abrir stage novo; corrigir nominalmente em vez de generalizar uma checagem que
pertence a outro achado). Se **só existir** um caminho e ele exigir ratificação,
**pare e escale** com as opções lado a lado — não presuma concessão. Registre no
artefato que a decisão veio de delegação, com a data, para a trilha ficar
auditável.

Sinal de que a memória expirou: um portão aprovado com "ok" do próprio
proprietário no chat, ou commit sem a cláusula de delegação.
