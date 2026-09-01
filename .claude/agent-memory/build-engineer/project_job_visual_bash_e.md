---
name: job-visual-bash-e
description: No job `visual` do CI as suítes Chromium vivem num único `run: |` sob `bash -e` — a suíte acrescentada por último só executa se as anteriores passarem, e um vermelho pula os passos seguintes
metadata:
  type: project
---

O passo "Suítes visuais" de `.github/workflows/verify.yml` roda várias suítes como
**comandos literais dentro de um único `run: |`**, sem `shell:` declarado — logo
`bash -e` (default do runner Linux). Isso tem duas consequências que não aparecem
lendo o YAML:

1. **Ordem = precedência de execução.** A suíte na última linha só roda se todas
   as anteriores saírem 0. As legadas (`tests_p50_chromium.js`, `tests_p52_chromium.js`,
   `npm run test:visual`) são justamente as sensíveis a infra — a calibração levou
   6 rodadas. Suíte nova no fim herda essa fragilidade: o gate fica *registrado e
   condicionalmente executado*, versão mais branda do defeito "registro não é
   execução".
2. **Vermelho pula os passos seguintes** (sem `if: always()`): "Restaurar árvore" e
   "Campanhas de mutação com Chromium" não rodam. Acrescentar suíte ao passo acopla
   a campanha de mutação ao veredito dela.

**Why:** levantado ao fechar o gap C10 da 011 (2026-08-31), quando
`tests_011_chromium.js` foi acrescentado ao passo. O proprietário pediu
explicitamente para não inventar passo novo nem mexer na estrutura — então a
posição dentro do passo é a única variável, e o trade-off é real: primeiro
garante execução nomeada mas condiciona ~82 gates legados a 1 gate novo; último
preserva os legados mas deixa o novo à mercê deles.

**How to apply:** ao acrescentar suíte ali, **não decida sozinho a posição** —
apresente o trade-off e implemente o que foi pedido. Se algum dia a estrutura
puder mudar, o desenho que remove o dilema é um passo por suíte com
`if: always()`, e isso é mudança de workflow que se testa no próprio PR (a
primeira execução real é a evidência). Ver [[stage-build-contra-head]] para o
outro caso de "verde/vermelho que é do arranjo, não do produto".
