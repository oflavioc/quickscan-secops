---
name: gate-compoe-o-scale-duas-vezes
description: P52-ICON2 multiplica por --p52-icon-scale um rect que JÁ inclui o transform — a "altura aparente" impressa varia com o quadrado do scale; previsão de 52% virou 34,9% medido. Nunca escreva número previsto de gate visual em spec/errata sem rodar o gate no Chrome local
metadata:
  type: project
---

Medido em 2026-09-04 (fix-finding do EA-32, Chrome estável local, worktree
efêmera): com `--p52-icon-scale: 0.70` sobre MDR (base 1.053, altura aparente
78,96%) a análise previa ≈52,5% (`0.7896 × 0.70/1.053`); o gate imprimiu
**34,9%**. SOCaaS: previsto ≈52,5%, impresso **36,5%**.

A causa está no emissor, `tests_p52_chromium.js:1131-1132`:

```js
const ir = img.getBoundingClientRect();          // já inclui transform: scale(var(--p52-icon-scale))
const drawn = Math.min(ir.width, ir.height) * scale;   // × scale de novo
hApparent = (fh * drawn) / tileSide;
```

`getBoundingClientRect()` devolve a caixa **transformada**; multiplicar por
`scale` outra vez faz o número reportado seguir `scale²`:
`0.7896 × (0.70/1.053)² = 0.349` ✓ e `0.7543 × (0.70/1.006)² = 0.365` ✓.

**Why:** na base os `scale` ficam entre 0.989 e 1.089, então o erro é pequeno
(até ~9% relativo no FortiNDR) e a faixa [67,5%, 82,5%] absorve; sob mutação
forte o número se afasta muito do previsto. O veredito (KILL) não muda — mas
qualquer frase de spec/errata/matriz que cite "deve levar a ~52%" fica falsa, e
a E13 já cobrou o preço de pinar CSS raciocinado. Aqui a previsão foi escrita
só na análise do achado, e a medição a corrigiu antes de virar registro.

**How to apply:**
- Número de gate visual entra em registro **só depois de lido do gate** — no
  CI, ou no Chrome local declarado como não-canônico
  ([[trilha-e-ambiente-quickscan]], [[reproducao-nao-canonica-por-shim]]).
- Mutante de `--p52-icon-scale`/`--p52-v32icon-scale`: a margem real contra o
  limiar é maior do que a linear sugere (P52-ICON3 usa a mesma família de
  medição — conferir antes de dimensionar um mutante "no limite").
- É candidato a achado de fidelidade do oráculo (gate congelado, não editável
  aqui): repassado em DEPENDÊNCIAS ao fechar o EA-32; se virar id de backlog,
  atualizar esta nota com ele.
