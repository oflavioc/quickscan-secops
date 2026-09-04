---
name: criterio-ratificado-de-demanda-anterior
description: Critério/gate de demanda já aprovada (D0NN-*) está fora da delegação — desenhe para mantê-lo byte-idêntico em vez de reinterpretá-lo
metadata:
  type: feedback
---

Desenho que faria um gate de demanda anterior (`D009-*`, `D0NN-*`) mudar de
veredito **não** é decisão de execução: aquele critério foi aprovado
pessoalmente pelo proprietário no portão daquela demanda. Trate como rota que
exige ratificação e procure a alternativa que mantém o gate intacto.

**Why:** a delegação de 2026-08-29 ([[autoridade-delegada-2026-08-29]]) cobre
decisão de produto, não a reabertura de critério ratificado; e R10 §1 proíbe
enfraquecer gate para passar. Na 010, o refinamento previa que o `MAP` no card
migraria práticas de S2 para S1 e esvaziaria o aviso único da 009 — o que faria
`D009-UNS1` falhar e obrigaria a reescrever o oráculo da 009.

**How to apply:** antes de aceitar "o gate anterior vai ter que mudar",
verifique **de onde o oráculo dele deriva o estado**. Quando ele lê o modelo
canônico (na 009: `fixtures_009_leitura.js` deriva S1–S4 do payload do engine,
não do DOM), quase sempre existe um desenho aditivo que preserva o veredito:
emitir nó novo com marcador próprio em vez de reusar a classe medida, e deixar
a função de estado byte-idêntica. Escreva essa escolha como **restrição de
desenho** na spec, com o porquê — senão o plano a desfaz na primeira
conveniência. Mesma lógica vale para não precisar tocar suíte congelada da
§29.4, que exigiria autorização nominal nova.
