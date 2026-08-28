---
name: pins-duplos-bloqueiam-modulos-de-produto
description: Mudar ui_target_v32.js, ui_journey_v32.js ou ui_ux_v32.css deixa p50core vermelho por pin inline em tests_p50_core.js, além do repin de pins.json
metadata:
  type: project
---

Existem **duas** superfícies de identidade sobre os módulos de produto, não uma:
`.claude/verify/pins.json` (repin por `gen_pins.py`, R8) **e** um mapa `PROTECTED`
inline em `tests_p50_core.js`, consumido por `P50-GOV1`, `P50-SUF0` e `P50-SUF8`.
Qualquer mudança em `ui_target_v32.js` / `ui_journey_v32.js` / `ui_ux_v32.css`
derruba esses três gates por hash, mesmo com a demanda perfeitamente implementada.

**Why:** o pin inline é legado anterior à R8 (R10 §4 proíbe pin inline **novo**),
e nenhuma spec/tasks de demanda o cita — então ele aparece como surpresa na wave
de implementação, depois que o red já foi provado.

**How to apply:** ao entregar tarefa de UI que toque esses arquivos, reportar em
DEPENDÊNCIAS que `p50core` fica fora do 64/0 do `expected_suites.json` até alguém
com domínio de teste resolver o pin — nunca tocar `tests_p50_core.js` (é do
`qa-engineer`) e nunca tratar isso como regressão do próprio patch. A prova de
não-atribuição é rodar a mesma suíte com a versão de HEAD do módulo, ver
[[workflow-verificacao-sem-rebuild]].
