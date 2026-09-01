---
name: declaracao-opcional-some-em-silencio
description: Conferência guardada por `if (dec.bloco)` desaparece quando alguém apaga a declaração — exige lista de blocos obrigatórios por fixture, e amarra entre os campos declarados
metadata:
  type: feedback
---

Tabela de estados declarados cresce por blocos opcionais (`if (dec.colisao)`,
`if (dec.diferencial)`) porque nem toda fixture carrega todo cenário. O preço:
**apagar a declaração apaga a asserção, e a suíte fica verde**. É a vacuidade
mais difícil de ver, porque não há erro, não há SKIP e não há linha vermelha.

Duas amarras fecham isso, e as duas nasceram de bateria negativa na 010
(2026-08-30):

1. **Lista de blocos obrigatórios por fixture**, no módulo, conferida ANTES de
   tudo: `{"D010-F3": [...], "D010-F4": [...]}`. Bloco exigido e ausente = FAIL
   nomeado. Oito casos de deleção viraram oito reprovações; sem a lista, oito
   PASS vacuosos.
2. **Amarra entre campos da mesma declaração.** Um bloco que declara `qid` e
   `capability` lado a lado precisa assertar `capOf(qid) === capability`. Sem
   isso, trocar só o `qid` fazia o bloco inteiro medir OUTRO cartão e passar —
   no QuickScan, `team-capacity` e `monitoring-coverage` trazem exatamente as
   mesmas chaves no `MAP`, então todo o resto do bloco (chaves no nó, nomes
   renderizados, serviço anexado) continuava batendo.

O caso (2) é o [[julgador-que-concorda-com-a-fixture]] por outra porta: os campos
declarados concordavam entre si porque nenhum deles era conferido contra a
estrutura que os relaciona.

**Why:** a tabela declarada é o único ponto fixo do julgador; se ela pode encolher
sem consequência, ela não é ponto fixo — é sugestão.

**How to apply:** ao acrescentar bloco opcional a uma tabela de estados, escreva
no mesmo commit (a) a entrada na lista de obrigatórios das fixtures que o exigem
e (b) o caso negativo que APAGA o bloco. Se o caso não reprovar, o bloco é
decorativo. E para cada par de campos que se referem ao mesmo objeto por chaves
diferentes, assertar a relação entre eles — senão a bateria negativa vai achar,
como achou.
