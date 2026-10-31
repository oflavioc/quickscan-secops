---
name: context-md-e-pinado
description: Gravar verbete no CONTEXT.md na Fase 0 exige gen_pins.py no mesmo PR (o arquivo é pinado) — e há precedente nominal para resolver na Fase 0 e gravar depois
metadata:
  type: project
---

`CONTEXT.md` está em `.claude/verify/pins.json` (entrada `"CONTEXT.md"`). Logo
**editá-lo é alterar arquivo pinado**: R8 §1 exige `gen_pins.py` no MESMO PR,
com o motivo no commit, e o stage `baseline` fica vermelho até o repin.

**Why:** a R12 me manda resolver vocabulário "ANTES do portão do refinamento", e
isso se lê naturalmente como "gravar no `CONTEXT.md` na Fase 0". Mas em delegação
que proíbe rodar `gen_pins.py` (o caso comum: o orquestrador committa, não eu),
gravar na Fase 0 deixa a árvore com divergência de pin **antes de o proprietário
ter aprovado o refinamento** — e se ele recusar o enquadramento, os termos mudam
e o repin foi gasto à toa.

**Resolvido ≠ gravado, e há precedente nominal.** O cabeçalho do próprio
`CONTEXT.md` registra o desvio da demanda **016**: os três termos foram
*"resolvidos na Fase 0 (`refinement.md` §Vocabulário, decisão P6 do portão)"* e
*"gravados na Fase 5, no mesmo PR"*. Há também o desvio da 015 (Fase 4) e a
emenda por `fix-finding` da 017.

**How to apply:** na Fase 0, escrever o **texto final do verbete** no
`refinement.md` §Vocabulário, em bloco ```md pronto para colar, e declarar a
gravação + repin como **condição do portão**, com o PR que a executa. Se a
delegação permitir rodar `gen_pins.py`, gravar direto é melhor. Citar o
precedente da 016 explicitamente — senão o diferimento parece atraso. Ver
[[homonimo-no-glossario]] e [[verbete-define-criterio-nao-lista]] para a forma
do verbete em si.
