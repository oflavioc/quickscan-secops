---
name: trilha-de-modelo-opus-nao-fable
description: Desde 2026-08-29 as delegações desta pasta rodam na trilha Opus, não no modelo `fable` pinado — decisão de créditos do orquestrador, a declarar em DEPENDÊNCIAS
metadata:
  type: project
---

As delegações de desenho (Fase 2/3) desta pasta vêm sendo roteadas para a
**trilha Opus**, e **não** para o modelo `fable` pinado. O orquestrador pede que a
troca de trilha seja **declarada em `DEPENDÊNCIAS`** no contrato de resposta
(R5), para ficar rastreável no encadeamento.

**Why:** consumo de créditos do `fable` pinado. É decisão operacional do
orquestrador, tomada em 2026-08-29 na demanda 013 — não é regra do repositório e
não está em `.claude/rules/`.

**How to apply:** ao devolver `plan.md`/`tasks.md`, incluir uma linha em
`DEPENDÊNCIAS` registrando em que trilha o artefato foi produzido. Fato
volátil: confirmar no pedido corrente antes de assumir que ainda vale — se a
mensagem da vez não disser nada sobre trilha, não invente a declaração.
