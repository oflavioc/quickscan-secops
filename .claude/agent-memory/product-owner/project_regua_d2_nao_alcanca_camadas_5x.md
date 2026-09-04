---
name: regua-d2-nao-alcanca-camadas-5x
description: O harness M41 lê só a Camada 1 — rota que vive em ui_*_v32.js está provadamente fora da régua D2 da INV-1, mesmo quando decora uma tela congelada
metadata:
  type: project
---

A régua da INV-1 (payload M41) só alcança o que o harness carrega, e
`harness_m41_v313.js:16`/`:24` carrega **um único arquivo**: o default
`quickscan_secops_soccmm_v3_1_3.html`. Nenhuma camada `ui_*_v32.js` entra no
payload. Logo: decorar por fora uma tela que a Camada 1 desenha **não** abre rito
D2 — o que abre é editar o arquivo `frozen` (`.claude/verify/boundary.json`).

**Why:** no refinamento da 011 (2026-08-31) a pergunta decisiva era o custo de
rito de cada rota, e a intuição natural ("é tela da Camada 1, logo é Porta B")
teria matado a rota barata e correta. A distinção certa não é *qual tela*, é
*qual arquivo*: `frozen` = rito; camada 5.x que só lê e decora = nenhum rito.

**How to apply:** ao costear rotas na Fase 0, separar sempre "a superfície é
congelada" de "o arquivo que vou editar é congelado" — e citar
`harness_m41_v313.js:16` como prova de que a camada 5.x está fora da régua.
Verificar antes de reusar: se um dia o harness passar a carregar o HTML
construído (`_v3_2_dev.html`), esta memória morre. Cuidado com o inverso — anular
comportamento congelado por fora (listener em captura com `stopPropagation`,
reescrita de string congelada via DOM) é pior que pedir o rito: passa sem gate e
deixa o congelado mentindo. Relacionado: [[gates-com-ancora-normativa-externa]].
