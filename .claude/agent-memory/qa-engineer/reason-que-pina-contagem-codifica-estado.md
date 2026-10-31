---
name: reason-que-pina-contagem-codifica-estado
description: Um `reason` que pina "N alínea(s)" é asserção de isolamento E fotografia do registro — mover o pin que uma alínea compara (E14 fixou `arvore.contagem`) muda N e o par sobrevive por "motivo diferente" sem ninguém tocar no mutante; `run.sh --light` pula `mutation` e não vê. Medido no fecho do EA-32 (D014-M8 → errata E15, 2026-09-04)
metadata:
  type: feedback
---

Quando mover um valor do registro que uma ALÍNEA compara, reexecute no mesmo
commit a campanha que lê o gate dessa alínea — `run.sh --light` pula o stage
`mutation`, e o trigger por path não dispara para `regra_morta.json` (lacuna já
declarada na E12 da 014). E nunca pine no `reason` o número que vive no
registro: pine a alínea e a FORMA da mensagem (`contagem pinada = \d+ ×
observada = \d+`), porque o número muda por razão legítima e o par sobreviveria
à primeira mudança da árvore.

**Why:** a E14 (fix-finding do EA-32) fixou `indecidiveis.arvore.contagem = 21`
e verificou só `tests_014_regra_morta.js` (7/7) — a campanha `d014` não rodou.
No CI, `D014-M8` saiu SOBREVIVENTE "por motivo/alínea diferente": o `reason`
pinava `2 alínea(s)` e o comentário dizia "as da árvore seguem conservadas com
lista vazia" — verdade só enquanto `contagem` era `null` (pendência
bem-formada, `C6(cont-arvore)` nem comparava). Com o inteiro pinado, a lista
encolhida sob a mutação dispara a terceira alínea. Classe: **mutante obsoleto**
(o `reason` codificava um estado do registro que a E14 moveu legitimamente) —
não gate frouxo (sint/cont-sint continuaram disparando), não defeito do reparo
(21 é a contagem limpa por execução).

**How to apply — as execuções que distinguem as três classes, sem Chromium:**
1. Mesmo mutante sobre a árvore PRÉ-mudança (worktree efêmera na base do PR) ×
   PÓS: 2 alíneas × 3. Se a alínea esperada sumisse do bloco pós, seria gate
   frouxo; se o controle sem mutante reprovasse, defeito do reparo.
2. Readicione o que o reparo REMOVEU (a exclusão, do blob) mantendo o que ele
   FIXOU: continuam 3 → a causa é o pin, não a remoção.
3. Liste o observável sob o mutante pela API (`varrerArvore()`), nunca suponha:
   "lista vazia" era falso desde o nascimento — o `find` só cobre a dúvida de
   COMPETIÇÃO (`regra_morta.js:269-270`); os sítios PRÉ-laço (`:217` gramática
   do próprio seletor, `:220` contexto do próprio @media) emitem indecidível
   por fora, e 4 de 21 sobrevivem (`21 × 4`, não `21 × 0`).
4. Prove que o pin antigo não ficou redundante com uma variante que só ele vê:
   trocar apenas a RAZÃO da dúvida morre em `C6(cont-sint)` sozinha (21 = 21).
5. Valide o `reason` novo contra os blocos salvos ANTES de escrevê-lo: casa o
   pós, NÃO casa o pré, o controle nem a variante.

O log da campanha trunca o bloco em 220 chars: o bloco inteiro só sai por
reprodução manual (find/repl do harness, suíte, restauração por SHA) — ver
[[prova-de-carga-da-excecao]] §2. O stage `mutation` recusa árvore suja: o
pipeline completo com as edições se mede em efêmera com commit descartável,
[[medir-red-do-proprio-julgador]]. Família de [[mutante-que-morre-em-dois-lugares]]
(aqui os dois carrascos estão no MESMO gate e o `reason` pina os três) e de
[[guarda-de-vacuidade-preempta-a-alinea]] (leia a linha inteira, não o relato).
