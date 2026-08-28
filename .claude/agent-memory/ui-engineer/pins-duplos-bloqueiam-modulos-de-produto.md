---
name: pins-duplos-bloqueiam-modulos-de-produto
description: Mudar ui_target_v32.js, ui_journey_v32.js, ui_ux_v32.css ou ui_v32.js deixa p50core vermelho por pin inline em tests_p50_core.js, além do repin de pins.json
metadata:
  type: project
---

Existem **duas** superfícies de identidade sobre os módulos de produto, não uma:
`.claude/verify/pins.json` (repin por `gen_pins.py`, R8) **e** um mapa `PROTECTED`
inline em `tests_p50_core.js`, consumido por **quatro** gates: `P50-GOV1`,
`P50-SUF0`, `P50-SUF8` e — descoberto na wave 4 da 009 — `P50-IC4`.
Qualquer mudança em `ui_target_v32.js` / `ui_journey_v32.js` / `ui_ux_v32.css`
derruba os três primeiros por hash, mesmo com a demanda perfeitamente
implementada. **`ui_v32.js` derruba `P50-GOV1` e `P50-IC4`**: o `IC4` verifica
`sha(ui_v32.js)` na alínea (a) *antes* de reexecutar ICONS 4.6 (alínea c), então
ele acusa "ui_v32.js alterado" mesmo com os ícones 12/12 — a falha é de pin, não
de regressão de ícone, e a distinção precisa ser dita na entrega.

**Why:** o pin inline é legado anterior à R8 (R10 §4 proíbe pin inline **novo**),
e nenhuma spec/tasks de demanda o cita — então ele aparece como surpresa na wave
de implementação, depois que o red já foi provado.

**How to apply:** ao entregar tarefa de UI que toque esses arquivos, reportar em
DEPENDÊNCIAS que `p50core` fica fora do 64/0 do `expected_suites.json` até alguém
com domínio de teste resolver o pin — nunca tocar `tests_p50_core.js` (é do
`qa-engineer`) e nunca tratar isso como regressão do próprio patch. A prova de
não-atribuição é rodar a mesma suíte com a versão de HEAD do módulo, ver
[[workflow-verificacao-sem-rebuild]].

**Registro da 009 (2026-08-28):** a seção "Autorização nominal §29.4" do
`spec.md` lista, na linha *Consequência*, só `P50-GOV1`, `P50-SUF0` e `P50-SUF8`
como gates a voltar ao verde após o repin — **`P50-IC4` ficou de fora**. Quem
repinar precisa incluí-lo, senão `p50core` não fecha 64/0.
