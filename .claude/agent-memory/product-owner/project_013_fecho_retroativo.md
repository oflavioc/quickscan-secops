---
name: fecho-retroativo-da-013
description: A 013 foi mesclada (PR #29) com a wave 9 incompleta; aceite do PO retroativo (2026-09-01), fase mantida em validate até os artefatos existirem e movida a done em 2026-09-04 — o padrão virou EA-33 e a demanda 016
metadata:
  type: project
---

A demanda **013-integridade-da-campanha** foi mesclada na develop (PR #29) com
`validate.status: in_progress` — o orquestrador mesclou sob delegação sem fechar a
Fase 6. O fechamento foi retroativo (R4 §Violação detectada): meu veredito
**"não encontrei objeção"** (2026-09-01) está em
`planning-state/013-integridade-da-campanha.json → validate.notes`, com a fase
**mantida em `validate` de propósito** até existirem `relatorio-final.md` e
`spec-validate.md`. Os dois passaram a existir (PR #37) e a fase foi movida a
**`done` em 2026-09-04** (`validate.fecho`), sob delegação. A recusa de mover
antes foi correta e é o caso-modelo da válvula "fecho pendente declarado" que o
refinamento da 016 propõe.

**O deferimento do PR #29 fechou 65 s antes do merge** (job visual 06:40:17Z,
merge 06:41:22Z — `validate.spec_validate.ci_pr29`) e só se soube indo ao log à
mão. Isso e a 009 (run 33298658338) são o custo medido da borda 8.

**A tripwire KI-4 foi desarmada sem disparar**: a 014 aposentou `M51-01` com
substituição nominal `D014-M10 × P52-LAY2` e removeu a KI-4 no mesmo commit
(`known_issues.json → issues: []`). O par substituto nasceu SOBREVIVENTE na forma
`:77` (run 33516136516), foi reancorado em `:86` (E13) e fechou KILL no run
33834890154.

**Why:** aceite retroativo que só pode dizer "sim" não mede nada; manter a fase
aberta foi o único jeito de a pendência ficar visível à máquina — e mesmo assim o
hook anunciou a 013 "em voo" por quatro dias depois de mesclada (EA-33).

**How to apply:** a pergunta "o job visual do PR rodou as campanhas delegadas?"
nunca é respondida por gate nenhum hoje — cobrar o run no relatorio-final até a
016 entrar. Ver [[refinamento-016-registro-contra-execucao]],
[[gate-verde-nao-e-protecao]] e [[gatilho-de-campanha-e-cego]].
