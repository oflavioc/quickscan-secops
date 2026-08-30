---
name: crosscheck-inclui-specs-seladas
description: O cross-check obrigatório da spec tem de varrer também as specs de fase seladas (PHASE_5_0_REV_A/REV_B), não só as specs de demanda — foi a lacuna que custou três interrupções à 009
metadata:
  type: feedback
---

No item *"Specs validadas anteriores — nenhuma contradição"* do template de
`spec.md`, incluir explicitamente as **specs de fase seladas**
(`specs/PHASE_5_0_REV_A.md`, `specs/PHASE_5_0_REV_B.md` e o que
`.claude/verify/current_phase.json → specs_normativas` apontar), não apenas as
specs de demanda (`specs/NNN-slug/`).

**Why:** a demanda 009 foi interrompida **três vezes** por contradição com prosa
que vivia numa spec de fase selada e não tinha sido lida — o desfecho está em
[[demanda-009-secao8-substituida]]. Prosa selada não aparece em `boundary.json`
nem em `pins.json`; só aparece se alguém abrir o arquivo.

**How to apply:** antes de fechar a Fase 1, `grep` os termos do domínio da
demanda nas specs normativas **e** na REV A histórica, e escreva o resultado no
cross-check citando `arquivo:linha` — inclusive quando o resultado é "nada
encontrado", que é evidência tanto quanto um achado. Quando a prosa selada colide
com o desenho, verifique antes se ela é **executável** (lista em código, entrada
de manifesto) ou só prosa: se for prosa já registrada como achado (ex.: a §29.4
vs. `PROTECTED`/`frozenSuites`, achado EA-1), R13 proíbe re-litigar — desenhe a
rota que a contorna em vez de reabrir a discussão.
