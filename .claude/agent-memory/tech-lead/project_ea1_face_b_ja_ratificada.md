---
name: ea1-face-b-ja-ratificada-onda-4
description: A tensão "§29.4 congela todas as tests_*.js" já foi disposta em 2026-08-25 pela reconciliação da Onda 4 — o regime vigente é pins.json + repin, não byte-freeze; não re-litigar nem editar a §29.4
metadata:
  type: project
---

`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, seção **Disposição**, item 2,
já decidiu em 2026-08-25 o que o achado EA-1 (Face B) trata como pergunta em
aberto: *"o freeze acumulativo da estrutura parte do estado REAL: a identidade
vigente de todos esses arquivos está pinada em `.claude/verify/pins.json` e
protegida por `boundary.json` + `guard-boundary` + stage `boundary`"*. O mesmo
documento registra que 5.1/5.2 editaram `tests_ui_m31.js`, `tests_ui_m332.js`,
`tests_session_m48.js` e `tests_unset_ug.js` — todas alcançadas pela prosa da
§29.4 — e que as selagens valem como foram seladas (R13).

**Why:** a hipótese "a distinção é proposital, byte-identidade só para o oráculo
da INV-2 e presença para as demais" não precisa ser decidida de novo: já é
decisão registrada. E a §29.4 vive em `specs/PHASE_5_0_REV_B.md`, cujo SHA-256
(`4f1583c7…`) está registrado em **cinco** lugares (`current_phase.json`,
`CLAUDE.md`, `pins.json`, `docs_phase5/REV_B_PROMOTION_RECORD.md` e as auditorias
independentes) e é asserido por `P50-GOV2` — editá-la é promoção de REV C (rito
R4/R6), nunca `fix-finding`.

**How to apply:** ao desenhar contra a §29.4, trate-a como **prosa superada pelo
regime executável**, cite a Disposição §2 como a decisão que a supera e desenhe a
rota que não a toca — coerente com [[autoridade-delegada-2026-08-29]] e com R13.
Corrija também dois erros de fato que circulam no registro do EA-1:
`tests_icons_m46.js` **também** é pinada byte a byte (por
`FROZEN_VISUAL_AUTHORITY`, gate `P50-COR4`), e as 13 suítes congeladas **não**
são editáveis "sem que nenhuma máquina reclame" — o stage `baseline` reprova
divergência de pin sem repin. Ver [[crosscheck-inclui-specs-seladas]] e
[[repin-e-sempre-commit-separado]].
