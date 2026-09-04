---
name: delegacao-proprietario-2026-08-29
description: Desde 2026-08-29 o proprietário está ausente e delegou decisões e merges de PR ao orquestrador; release e selagem continuam dele — o que exigir ratificação pessoal manda parar e escalar
metadata:
  type: project
---

O proprietário se ausentou em **2026-08-29** e delegou as decisões ao
orquestrador ("tome as decisões por mim"). Os **merges de PR** passaram a ser do
orquestrador; **release e selagem continuam do proprietário**. Aprovações de
portão feitas nesse regime são registradas nos planning-states com a fórmula
"DECIDIDO SOB DELEGAÇÃO DO PROPRIETÁRIO de 2026-08-29, não aprovado por ele
pessoalmente" — ver `.claude/project-memory/planning-state/013-*.json`.

**Why:** decisão sob delegação e decisão pessoal do proprietário têm peso
diferente numa auditoria; colapsar as duas é o tipo de meia-verdade que o
processo existe para impedir.

**How to apply:** (1) nunca escreva "aprovado pelo proprietário" quando foi
delegação — use a fórmula acima; (2) se a tarefa exigir ratificação pessoal
dele (release, selagem, conteúdo de invariante/glossário, **editar spec de
fase selada** — mexer na §29.4 de `specs/PHASE_5_0_REV_B.md` é promoção de
REV C, não conserto de texto), **pare e escale** em
vez de decidir; (3) o desvio segue em DEPENDÊNCIAS junto com
[[trilha-modelo-opus]].
