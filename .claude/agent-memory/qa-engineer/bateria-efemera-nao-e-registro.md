---
name: bateria-efemera-nao-e-registro
description: Mutante provado só na bateria negativa do scratchpad evapora quando o registro que o citava é substituído — todo mutante que a spec declara termina no harness ou em dividas_declaradas com causa
metadata:
  type: feedback
---

A bateria negativa é **instrumento de desenho**, não registro. Ela existe para
escolher a forma do mutante e provar que o gate não é constante-vermelho —
e depois some. Todo mutante que a **spec declara como carrasco** tem de aterrissar
num dos dois lugares consultáveis: o **harness** da campanha, ou
`dividas_declaradas` **com causa**. Não há terceira gaveta.

**Why:** na 015 (2026-09-01) o `spec-validate` achou o que nem eu nem o
coordenador tínhamos visto: `M17` e `M18` — declarados carrascos na `spec.md`,
sendo `M18` o **único** de `C1(h1)` — não estavam no harness, não tinham par na
matriz e não constavam de dívida. Foram provados só na bateria da Fase 4, e o
registro que os mencionava foi **substituído** por uma versão posterior. A prova
existiu e evaporou: passou a viver apenas no histórico do git.

O agravante é a segunda ordem: minha própria entrada em `dividas_declaradas`
—a que classifica `(h2)` como sentinela— **afirmava** que "`M18` é o único
carrasco de `(h1)`". Um registro alegando prova que a campanha nunca executou.
E havia dependência: a partição sentinela de `(h2)` só se sustenta **porque**
`(h1)` tem carrasco. Sem o par, a decisão do PO perdia o pé.

**How to apply:** ao fechar a Fase 4, faça o censo pelo lado da **spec**: liste
todo `M*` que ela nomeia e case um a um contra `mutation_map`/harness e contra
`pares`. O que sobrar decide-se ali — entra ou vira dívida com causa —, nunca
fica. E quando escrever numa dívida que "X é o carrasco de Y", **verifique que X
tem par executado**; se não tiver, a frase certa é "X está declarado e não
executado", que é uma dívida diferente e mais cara.

Parente de [[cenario-sem-mutante-e-cenario-nao-medido]] (lá o cenário sem
mutante; aqui o mutante sem registro) e de
[[controle-verde-na-bateria-negativa]], que é o uso legítimo da bateria.
