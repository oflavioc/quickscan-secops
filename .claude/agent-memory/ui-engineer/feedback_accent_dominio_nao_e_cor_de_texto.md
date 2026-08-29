---
name: feedback-accent-dominio-nao-e-cor-de-texto
description: Accent de domínio (--dom-accent / --ftnt-*) nunca vira color de texto direto; use variante derivada com valor próprio para tela e para papel
metadata:
  type: feedback
---

Os cinco accents de domínio foram desenhados para **borda, chip, trilho e eixo de
radar**. Aplicá-los como `color` de texto corrido reprova WCAG AA (4.5:1). Sempre
que a demanda pedir "nome do domínio colorido no texto", entregue uma **variante
derivada** do token (tint na tela, shade no papel), nunca o token cru.

**Why:** já reprovou **duas vezes**. Na microfase 5.0.5 (`--p50-dom-text`, ver
`docs_phase5/AUDITORIA_INDEPENDENTE_FECHAMENTO_PHASE_5_0.md`) e de novo na 009
(`.jn-dom{ color:var(--dom-accent) }`), que derrubou `P52-ACC1` e `V322-NI1` no
job `visual` do PR #24. As duas superfícies são **assimétricas**: tela
`--surface:#151517` e papel `:root{--surface:#fff}` no `@media print` da Camada 1
(`quickscan_secops_soccmm_v3_1_3.html:205`). Nenhuma cor única serve às duas —
para 5:1 sobre preto é preciso L≥0.24, sobre branco L≤0.16. E **o axe só mede a
tela**: em 2026-08-28, quatro dos cinco accents reprovavam só no papel e nenhum
gate via. O papel precisa ser calculado à mão.

**How to apply:** regra base com o tom de tela + override dos mesmos seletores
dentro de `@media print`. Derive por `color-mix(in srgb, var(--ftnt-*) N%,
var(--ftnt-white|black))` em vez de hex novo — a identidade fica provável a
partir do token congelado, e `P50-COR2` alínea (e) não quebra porque `var(--tok)`
não tem os dois-pontos que o contador de declarações procura. Mire ≥5.5:1 (o
proprietário rejeita entregar 4.52) e devolva a tabela de contraste calculada:
sem Chromium local, a prova é aritmética. O canal não-cromático (`font-weight`)
**permanece** — é ele que `D009-DOM1` exige. Ver
[[pins-duplos-bloqueiam-modulos-de-produto]] e [[feedback-css-regua-estreitar]].
