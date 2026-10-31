---
name: classe-de-boundary-confere-em-boundary-json
description: Rótulo de classe (frozen/generated/legacy/registry) se confere em boundary.json, nunca no rascunho de fatos de quem delegou; linha de script citada em prompt se relê no arquivo; contagem de abertos tem base intermediária
metadata:
  type: feedback
---

Três correções feitas no registro da selagem v3.2.12 (2026-10-31) contra o rascunho de
fatos do orquestrador:

- O rascunho rotulava `build_v32_html.py` como `frozen`; pelo `boundary.json` ele não
  está em nenhuma das quatro classes (aparece só no texto do rito de `generated`) e não
  está em `PROTECTED`. **Classe se confere na fonte executável**, complementando
  [status do achado contra o fonte](feedback_status-do-achado-contra-o-fonte.md).
- O prompt citava `preparar_release.py:62-64` e `:104`; no arquivo eram `:64-66` e `:106`.
  **Linha de script citada em prompt se relê no arquivo** antes de entrar num verbete.
- A contagem de abertos 59 → 58 → 50 → 51 tem base intermediária (o PR #113 fechou o
  `EA-101`); citar a contagem sempre com o commit em que foi medida.

(Nota parqueada em 2026-10-31 pelo orquestrador; materializada no mesmo dia.)
