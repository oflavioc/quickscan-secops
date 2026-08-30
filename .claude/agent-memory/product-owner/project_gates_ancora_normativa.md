---
name: project-gates-ancora-normativa
description: No QuickScan, vários gates têm âncora normativa EXTERNA (diretriz de fase selada) escrita dentro do próprio teste — mudar o comportamento reabre a diretriz, e esse é o custo real da demanda
metadata:
  type: project
---

Ao estimar o custo de uma demanda no QuickScan, o rito D2 do engine **não é o
único portão caro**. Vários gates da camada de UI declaram, dentro do próprio
arquivo de teste, um **oráculo independente ancorado numa diretriz de fase já
selada**. Mudar o comportamento exige declarar a âncora nova na spec ANTES do
código — não basta editar o teste.

Exemplares encontrados (conferir se ainda existem antes de citar):

- `tests_p50_core.js` → `QIDS_AUTORIZADOS` (4 qids), ancorado na diretriz
  §UAT-07 da Phase 5.1. Barra estender a tabela `QS_GAP_SUPPORT`.
- `tests_p52_layout.js` → `P52_CANONICAL_ORDER`, ancorado na §7 / P52-RES2.
  Barra reordenar as seções do resultado.
- `tests_p52_layout.js` → P52-REC1 proíbe **nome de produto embutido no owner de
  layout** (`/Forti[A-Z]/` no módulo P52). Determina ONDE uma feature de
  recomendação pode ser implementada.

**Corolário descoberto na 009 (wave 3): existem DUAS listas de proteção, e a
legível por máquina é a MENOR.** `.claude/verify/boundary.json` (R6/INV-9) cobre
engine, Camada 1, harness M41 e snapshot. A **§29.4** de
`specs/PHASE_5_0_REV_B.md` é normativa, imutável, exigida por `P50-GOV2`, e cobre
tudo aquilo **mais** `ui_v32.js`, `ui_ux_v32.js`, `ui_target_v32.js`,
`ui_journey_v32.js`, `ui_v32.css`, `ui_ux_v32.css`. Um cross-check feito só
contra `boundary.json` devolve **falso negativo** — foi o que aconteceu na spec da
009, e quem acusou foi o gate vivo `P50-GOV1`, já na implementação.

**Why:** descobri isso refinando a demanda 009 (2026-08-27). A triagem inicial
tratava "UI-only" como sinônimo de "barato"; não é. O custo estava no processo,
não no diff — e teria virado errata na Fase 4/5.

**How to apply:** na Fase 0, antes de classificar uma rota como barata, procurar
o oráculo do gate correspondente e verificar se ele cita uma diretriz de fase.
Se citar, a rota precisa de âncora normativa na spec e entra no enquadramento
como conflito com decisão registrada. Ver [[project-quickscan-duas-doutrinas-recomendacao]].
