---
name: fecho-retroativo-da-013
description: A 013 foi mesclada (PR #29) com a wave 9 incompleta; o aceite do PO é retroativo (2026-09-01), a fase ficou em validate, e a KI-4 é uma tripwire amarrada ao merge da 014
metadata:
  type: project
---

A demanda **013-integridade-da-campanha** foi mesclada na develop (PR #29) com
`validate.status: in_progress` — o orquestrador mesclou sob delegação sem fechar a
Fase 6. O fechamento foi retroativo (R4 §Violação detectada): meu veredito
**"não encontrei objeção"** está gravado em
`.claude/project-memory/planning-state/013-integridade-da-campanha.json → validate.notes`
(2026-09-01), com a fase **mantida em `validate`** de propósito.

**O que ainda falta da wave 9** (registrado como dependência no próprio veredito):
relatorio-final.md (doc-writer) · spec-validate.md (qa-engineer — a metade QA da
Fase 6 não tem artefato) · consolidação T028 dos M-IC1..M-IC31 na matriz ·
linhas de IC-9/IC-10 na spec.md (PO+TL, spec pinada → repin) · IC-10 fora de
`red.gates` · e **nenhuma evidência na árvore de que o job visual do PR #29 rodou
as campanhas delegadas** — as provas (b)/(c) de M51-16, V322-M3 e P50::M51 "fecham
no job visual" só como dívida declarada na mutation-matrix.json.

**A tripwire que vai morder sozinha**: a exceção nominal `KI-4`
(`known_issues.json`, perdoa `p51/M51-01` SOBREVIVENTE por EA-7) tem
`remocao_prevista` amarrada ao **merge da demanda 014**. `IC-9.3` reprova o stage
`mutation` no dia em que a `mutation-matrix.json` voltar a dizer `KILL` para
M51-01 — quem fechar a 014 e esquecer de remover a KI-4 recebe `EXCEÇÃO OBSOLETA`.
Não é defeito: é o desenho ratificado pelo proprietário (2026-08-30).

**Why:** aceite retroativo que só pode dizer "sim" não mede nada (argumento da
própria delegação, e da 014); o veredito precisou nomear o que faltou para não
virar carimbo — e a fase em `validate` mantém a pendência visível à máquina.

**How to apply:** quando o relatorio-final da 013 for escrito, ele deve citar o
run do CI do PR #29 (job visual) — cobrar isso na revisão. Quando a 014 mesclar,
esperar o vermelho de IC-9.3 como sinal correto, não como regressão. Ver
[[gate-verde-nao-e-protecao]] e [[gatilho-de-campanha-e-cego]].
