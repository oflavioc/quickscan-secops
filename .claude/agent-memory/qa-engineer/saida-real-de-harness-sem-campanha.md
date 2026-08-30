---
name: saida-real-de-harness-sem-campanha
description: MUTATION_PY apontando para binário inexistente devolve a saída REAL de p50/p51/p52 com todos os mutantes, em segundos, sem mutar, sem construir e sem Chromium
metadata:
  type: project
---

Para exercitar qualquer leitor da saída das campanhas (parser, relato, agregador)
sem pagar horas de campanha nem exigir Chromium:

```
MUTATION_PY=mutation-py-inexistente-013 node tests_p51_mutants.js
```

As três harnesses (`tests_p50_mutants.js`, `tests_p51_mutants.js`,
`tests_p52_mutants.js`) abortam em `resolvePy()` **antes** de construir e antes de
mutar, e emitem TODOS os mutantes como `NÃO EXECUTADO · interpretador ausente` no
formato canônico do `emitir()`. Rende 53 / 20 / 107 blocos reais em segundos, com
árvore limpa e zero recibo escrito (a escrita do JSON é guardada por
`BASE_HTML_SHA` / `binario`, que ficam nulos).

O bloco por mutante é idêntico nas três:

```
<ESTADO>␣␣<id>␣·␣<desc>
␣×14      gate esperado: <gate>[ · causa: <causa>][ · <nota>]
```

**Why:** é a única forma de obter formato REAL (não sintético) em escala sem
Chromium — e o formato sintético escrito à mão erra o número de espaços, que é
justamente o que um parser posicional lê. Descoberto no E3 passo 0 da 013
(2026-08-29), onde virou insumo dos cenários de falsificação.

**How to apply:** use como fonte dos fixtures; para os estados que o abort não
produz (DETECTADO, SOBREVIVENTE), reescreva o estado dos blocos reais em vez de
inventar linhas. Confira `git status --porcelain` depois — deve sair limpo. Ver
[[medir-red-do-proprio-julgador]] para o A/B do próprio stage.
