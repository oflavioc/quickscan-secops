---
name: numero-esperado-diferente-do-medido
description: Quando o instrumento devolve N e a spec prevê M, a §"Não mensurável" da spec costuma já trazer a classificação — leia antes de tratar como defeito, e nunca calibre para bater
metadata:
  type: feedback
---

Instrumento novo devolvendo número diferente do previsto: **isole a causa e
procure a pré-classificação na spec antes de qualquer outra coisa.** Nunca
ajuste o gate, a exclusão ou o pin para bater com o número esperado.

**Why:** na 014 (2026-09-01) a varredura acusou **2** regras mortas, e a spec
previa **1** (`M51-01`). A tentação é excluir o segundo caso ou afrouxar a
alínea — seria R10 §1 ao contrário, e mataria o único achado real da execução.
Isolado o caso (`p52/P52-RA8`, sobreposição **intra-arquivo** criada pelo
próprio mutante), a classificação **já estava escrita na spec**, em
§"Não mensurável nesta fase", item 4: *"Sobreposição intra-arquivo … a varredura
a mede de graça quando existir, mas não é critério de aceite aqui — se aparecer,
é achado novo."* O número 2 é `1 previsto + 1 achado pré-classificado`, e o gate
está certo nos dois.

**How to apply:**
- Ordem: (1) despeje o relatório completo do instrumento, não só o veredito;
  (2) confira o caso no FONTE, linha a linha; (3) só então classifique.
- Procure a pré-classificação em §"Não mensurável", §"Fora de escopo" e
  `design-decisions.md` antes de abrir achado novo — spec bem escrita costuma
  ter antecipado.
- Reporte e **pare**. Excluir o caso é calibrar; e exclusão nova sem mudança de
  spec reprova na alínea de conjunto declarado (ver
  [[oraculo-independente-do-instrumento]]).
- Corolário de leitura de vermelho: o **veredito** da suíte pode não se mover
  enquanto a substância muda. Na mesma execução a contagem ficou 5 PASS · 2 FAIL
  antes e depois da wave, mas três alíneas trocaram de lado — é
  [[red-nao-testemunha-conte-alineas]] aplicado ao green, não ao red.
