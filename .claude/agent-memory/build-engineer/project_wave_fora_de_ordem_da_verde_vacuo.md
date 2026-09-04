---
name: wave-fora-de-ordem-da-verde-vacuo
description: Instrumento cuja entrada vem de um contrato ainda não implementado responde "zero" com sinceridade — ausência de insumo parece resultado limpo, não vermelho
metadata:
  type: project
---

Quando me delegam a wave do **consumidor** antes de a wave do **contrato** estar
no HEAD, o sintoma não é o gate reprovar: é ele **passar por vácuo**. Medido na
014 (wave 4 antes da wave 3): sem `find`/`repl` no preflight, a varredura não
tinha o que diferenciar e devolveu `0 regras mortas` — número correto para a
entrada que recebeu, e completamente sem valor. A alínea que expôs isso
(`C2(anc)`) só funcionou porque é julgada **no oráculo independente**, não no
relatório do meu instrumento.

**Why:** verde por ausência de insumo é indistinguível de verde por saúde. Na
014 isso é literalmente a doença que a demanda combate, e o `tech-lead` já havia
caído nela uma vez (contador que engolia regras e devolvia números plausíveis).

**How to apply:** antes de aceitar um número da minha própria ferramenta,
perguntar *quantos itens da população tinham insumo completo*. Se a resposta for
zero, o número não é veredito — é "não medi", e vai no relatório com esse nome e
com a wave/tarefa que falta nomeada. E emitir sempre uma lista nominal do que
ficou sem insumo (`sem_ancora` e afins): o balde de conservação sozinho aceita
"declaracoes: 0" sem reclamar. Ver [[escopo-de-scanner-nos-dois-sentidos]] e
[[013-sonda-de-fiacao]].
