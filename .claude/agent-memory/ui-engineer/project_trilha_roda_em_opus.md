---
name: project-trilha-roda-em-opus
description: Toda a demanda 009 roda em Opus, não no modelo pinado `fable` (créditos indisponíveis) — desvio a declarar em DEPENDÊNCIAS a cada entrega
metadata:
  type: project
---

As fases 0, 1, 2 e 3 da demanda 009 e as delegações da wave 3 rodaram em **Opus**,
não no modelo pinado da trilha (`fable`), por indisponibilidade de créditos.

**Why:** o modelo pinado faz parte da reprodutibilidade da trilha. Rodar fora dele
é um desvio real, e o registro existe para que a auditoria saiba que o artefato não
foi produzido sob o pin declarado — não é detalhe de infraestrutura.

**How to apply:** registrar o desvio no campo DEPENDÊNCIAS de toda entrega desta
demanda, mesmo quando o orquestrador não pedir de novo. O `tech-lead` já o registra
nas fases de desenho (spec.md/plan.md/tasks.md, item final de DEPENDÊNCIAS); a
implementação repete o registro em vez de assumir que já está coberto.
Ver [[project-wave-paralela-worktree-unica]].
