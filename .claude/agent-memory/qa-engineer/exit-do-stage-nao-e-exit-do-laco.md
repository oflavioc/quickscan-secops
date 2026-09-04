---
name: exit-do-stage-nao-e-exit-do-laco
description: Cláusula de spec que promete "exit 0" para um cenário adversarial pode contradizer outra cláusula da mesma spec quando um bloco novo (preflight/IC-4) passa a reprovar antes do laço — meça o exit do processo inteiro e classifique como spec-errada, nunca afrouxe o bloco mais forte
metadata:
  type: feedback
---

No spec-validate retroativo da 013 (2026-09-04), IC-2 prometia: com
`MUTATION_PY` inexistente **e** `MUTATION_DEFER_MISSING=1`, "`[DEFER]` nomeado,
exit 0". Medido: os 8 `[DEFER]` saem nomeados, mas o stage sai **1**, porque IC-4
reprova `preflight não resolveu o interpretador` (7×) — exatamente o que T6
("exit 0 sse interpretador resolvido") e a tabela de cenários ("interpretador
ausente ⇒ exit ≠ 0") da **mesma** spec exigem. A cláusula de IC-2 foi escrita
olhando só o laço de trigger (`:69-75`), antes de o preflight existir.

Regra: **cláusula de exit se mede no processo inteiro**, não na seção que a
motivou. Quando duas cláusulas da mesma spec divergem, a implementação que
seguiu a **mais forte** está certa; o gap é `spec-errada` (errata do PO/TL com
aprovação do usuário), e a direção nunca é fazer o bloco forte "deferir" para
honrar a frase fraca (R10 §1).

Segundo padrão da mesma sessão: decisões **ratificadas depois da spec** (addendum
IC-9/IC-10 que mudou `known_issues.json`; E2 estendida sob delegação) deixam a
lista "Não mudam"/"Fora de escopo" falsa. Também é `spec-errada` — a spec lida
sozinha descreve um instrumento menor que o entregue — e vale um único item de
gap com errata única, não um item por arquivo.

**Why:** classificar isso como "implementação divergente" mandaria o engenheiro
enfraquecer IC-4; classificar como "conforme" esconderia que a spec mente para
quem a lê. A classe certa muda quem age e o que faz.

**How to apply:** em todo spec-validate, para cada cláusula com exit/veredito,
rode o comando literal da spec e leia o exit do processo; cruze com as outras
cláusulas antes de atribuir a classe. Ver [[arbitragem-de-desvio-declarado]] e
[[verde-com-excecao-impressa]].
