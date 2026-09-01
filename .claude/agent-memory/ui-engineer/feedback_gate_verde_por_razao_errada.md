---
name: feedback-gate-verde-por-razao-errada
description: Ao implementar até o green, nomear na entrega toda alínea que fecharia verde sem medir nada — reportar ao qa-engineer, nunca editar o gate
metadata:
  type: feedback
---

Quando o green chega, conferir **por que** cada alínea minha ficou verde. Alínea
que fecharia verde sem sujeito — nó vazio contando como publicação, ramo do meu
código que nenhuma fixture alcança, disjunção cujo segundo termo é inalcançável
por construção — vai no relatório como achado nomeado. **Não consertar**: o gate
é do `qa-engineer` (R3 §2), e editar critério de aceite pelo implementador é a
violação que a separação de poderes existe para impedir.

**Why:** as três últimas execuções da 010 acharam, cada uma, um gate que passava
sem medir nada (a cláusula que nenhum mutante podia matar, a alínea cujo sujeito
não existia, a guarda que só ganharia sujeito depois do fix). Verde comprado
assim é exatamente o defeito que a demanda existe para não repetir, e quem
implementa é quem tem o código na mão para enxergá-lo.

**How to apply:** ao fechar wave de implementação, varrer o próprio diff
perguntando "que ramo daqui nenhuma fixture executa?" e medir a resposta no
runtime (boot jsdom + helper da fixture), em vez de deduzir. O achado entra em
DEPENDÊNCIAS com a cadeia medida — qual chave/qid/estado seria preciso para
alcançar o ramo e por que nenhuma fixture chega lá. Ver
[[workflow-verificacao-sem-rebuild]].
