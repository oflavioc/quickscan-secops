---
name: trilha-modelo-opus
description: As trilhas das demandas do QuickScan (009 e 013 confirmadas) rodam em Opus, não no modelo pinado `fable`, por falta de créditos — precisa constar em DEPENDÊNCIAS de todo relatório
metadata:
  type: project
---

As trilhas rodam em **Opus**, não no modelo pinado (`fable`), por
indisponibilidade de créditos. Confirmado na demanda `009-leitura-do-relatorio`
(fases 0-3, registrado em `specs/009-leitura-do-relatorio/plan.md` e `tasks.md`,
item "Nota de trilha") e na demanda `013-integridade-da-campanha` (W8,
2026-08-29). Trate como o padrão vigente até que alguém diga o contrário.

**Exceção observada (2026-10-19, registro de selagem v3.2.11):** a delegação
pediu "registre o modelo em que roda" e o modelo era **Sonnet 5.5**
(`claude-sonnet-5-5`, lido do ambiente da sessão), não Opus. Não repetir a
frase de Opus por hábito: ler o modelo do ambiente e declarar o real.

**Segunda observação (2026-10-25, emendas da refutação adversarial):** de novo
**Sonnet 5.5** (`claude-sonnet-5-5`), lido do ambiente — a delegação pediu "declare o
modelo real". Dois de dois dessa fase foram Sonnet, não Opus.

**Correção de premissa (2026-10-25, fecho do `EA-101`):** "modelo pinado =
`fable`" não vale para todos os agentes. `.claude/agents/*.md:5` fixa `model: sonnet`
em `doc-writer`, `build-engineer` e `ui-engineer`; `opus` em `core-engineer` e
`data-engineer`; `fable` só em `product-owner`, `qa-engineer` e `tech-lead`. Rodar
como `doc-writer` em Sonnet 5.5 é **o modelo declarado**, não desvio — conferir o
`model:` do próprio agente antes de escrever "desvio de trilha" (no fecho do
`EA-101` escrevi "sem desvio do modelo declarado nos agentes", com a linha citada).
O desvio por créditos continua real para quem pina `fable`.

**Why:** é desvio de trilha declarada; auditoria posterior precisa saber que o
artefato não saiu do modelo pinado. Registrar é obrigação de quem executa, não
opção.

**How to apply:** ao devolver contrato de R5/orchestration em qualquer demanda
deste repositório, repetir a nota em `DEPENDÊNCIAS` com a mesma redação ("rodou
em Opus, não no modelo pinado (`fable`), por indisponibilidade de créditos").
Ligado a [[delegacao-proprietario-2026-08-29]], que é o outro item recorrente de
DEPENDÊNCIAS.
