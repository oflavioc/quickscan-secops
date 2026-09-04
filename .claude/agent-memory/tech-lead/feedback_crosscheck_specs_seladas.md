---
name: crosscheck-inclui-specs-seladas
description: O cross-check obrigatório da spec tem de varrer também as specs de fase seladas (PHASE_5_0_REV_A/REV_B), em item PRÓPRIO — foi a lacuna que custou três interrupções à 009
metadata:
  type: feedback
---

O cross-check do template `spec.md` precisa cobrir as **specs de fase seladas**
(`specs/PHASE_5_0_REV_A.md`, `specs/PHASE_5_0_REV_B.md` e o que
`.claude/verify/current_phase.json → specs_normativas` apontar), não apenas as
specs de demanda (`specs/NNN-slug/`).

**Forma confirmada pelo precedente:** item **próprio**, não sub-cláusula do
"Specs validadas anteriores". A spec da demanda **013**
(`specs/013-integridade-da-campanha/spec.md`, bullet *"Specs de fase seladas —
verificado por leitura, não por memória"*) já pratica assim e passou pelo
`spec-validate`; e o item de Boundary ganha valor quando nomeia as **três**
fontes a cruzar — `boundary.json`, `PROTECTED` e `frozenSuites`
(`tests_p50_core.js`) —, como a mesma spec fez.

**Why:** a demanda 009 foi interrompida por contradição com prosa que vivia numa
spec de fase selada e não tinha sido lida — o desfecho está em
[[demanda-009-secao8-substituida]]. Seu cross-check afirmou "nada `frozen`
tocado", verdadeiro contra `boundary.json` e falso contra a §29.4; quem acusou
foi o gate `P50-GOV1` já na implementação, e custou uma autorização nominal do
proprietário no meio do caminho. Prosa selada não aparece em `boundary.json` nem
em `pins.json`; só aparece se alguém abrir o arquivo. R6 §4 (freeze acumulativo)
já obriga isso — o template é que não operacionalizava.

**How to apply:** antes de fechar a Fase 1, `grep` os termos do domínio da
demanda nas specs normativas **e** na REV A histórica, e escreva o resultado no
cross-check citando `arquivo:linha` — inclusive quando o resultado é "nada
encontrado", que é evidência tanto quanto um achado. Quando a prosa selada colide
com o desenho, verifique antes se ela é **executável** (lista em código, entrada
de manifesto) ou só prosa: se for prosa já superada por decisão registrada (a
§29.4 vs. `PROTECTED`/`frozenSuites` — ver [[ea1-face-b-ja-ratificada-onda-4]]),
R13 proíbe re-litigar — desenhe a rota que a contorna em vez de reabrir a
discussão.
