---
name: feedback-ancora-de-mutante-apodrece
description: Correção que reescreve a linha onde um mutante ancora apodrece a âncora — declarar em DEPENDÊNCIAS com o id do mutante, nunca editar o arquivo de mutantes
metadata:
  type: feedback
---

As campanhas desta base (`tests_0NN_mutants.js`) ancoram por **texto literal do
fonte** (`find`/`repl`), não por AST. Toda vez que eu reescrever uma linha de
produto que já é âncora, o mutante correspondente passa a ter **0 ocorrências** e
a campanha reprova por "âncora podre". Antes de fechar a entrega: `grep` do
`find` de cada mutante que cita o meu arquivo e contar ocorrências (0 = podre,
≥2 = ambígua — as duas reprovam).

**Why:** o arquivo de mutantes é do `qa-engineer` (R3 §2) e re-transcrever a
âncora eu mesmo seria o implementador mexendo no critério. Medido na 010/E18: a
partição de `baseIds` reescreveu a linha de `#v32base` e apodreceu `D010-M8`,
cuja intenção ("manter os N cards e apenas somar o aviso") continua matável — só
precisa da âncora nova. Sem aviso, isso só apareceria na campanha, depois.

**How to apply:** na entrega, `DEPENDÊNCIAS` nomeia o id do mutante, a linha
antiga, a linha nova e se a intenção do mutante sobrevive à correção. Se o meu
diff criar duas linhas parecidas (o mesmo cálculo na tela e no papel), dizer que
elas diferem textualmente e que a âncora de linha inteira continua única. Ver
[[feedback-gate-verde-por-razao-errada]] e
[[pins-duplos-bloqueiam-modulos-de-produto]].
