---
name: trilha-modelo-opus
description: A trilha da demanda 009 (e das fases 0-3) roda em Opus, não no modelo pinado `fable`, por falta de créditos — precisa constar em DEPENDÊNCIAS de todo relatório
metadata:
  type: project
---

Todas as fases da demanda `009-leitura-do-relatorio` rodaram em **Opus**, não no
modelo pinado (`fable`), por indisponibilidade de créditos. O desvio está
registrado nas DEPENDÊNCIAS das Fases 0, 1, 2 e 3 (`specs/009-leitura-do-relatorio/plan.md`
e `tasks.md`, item "Nota de trilha").

**Why:** é desvio de trilha declarada; auditoria posterior precisa saber que o
artefato não saiu do modelo pinado. Registrar é obrigação de quem executa, não
opção.

**How to apply:** ao devolver contrato de R5/orchestration em qualquer tarefa
desta demanda, repetir a nota em `DEPENDÊNCIAS` com a mesma redação ("rodou em
Opus, não no modelo pinado (`fable`), por indisponibilidade de créditos").
