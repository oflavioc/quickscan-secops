---
name: deriva-em-doc-irma
description: Ao mudar uma afirmação de produto em um doc, varrer os docs irmãos (README/USER_GUIDE) na mesma passada, corrigir tudo o que a mudança tornou falso e listar o que foi corrigido
metadata:
  type: feedback
---

Quando uma demanda torna falsa uma afirmação de um doc, não basta corrigir o
arquivo da tarefa e **reportar** a deriva irmã: varrer os outros docs de produto
(`README.md`, `USER_GUIDE.md`) na mesma passada, corrigir tudo o que a mudança
tornou falso e **listar item a item** o que foi corrigido.

**Why:** na 009 eu reportei que `README.md:130` repetia uma frase de UI obsoleta,
mas não varri o resto do arquivo — o README enumerava a **ordem antiga inteira**
das seções (linhas 124-127), deriva que a própria 009 criou. O coordenador
respondeu: "não quero descobrir a terceira em outra wave".

**How to apply:** achou uma deriva num doc → `grep` do mesmo tema em todos os
docs de produto antes de fechar o relatório. Corrigir no mesmo passe e enumerar.
O limite continua sendo o escopo da demanda: **não** ampliar para assunto que a
demanda não tocou, e conteúdo de invariante/glossário segue do `product-owner`.
Ver [[trilha-modelo-opus]] para a nota de trilha que todo relatório carrega.
