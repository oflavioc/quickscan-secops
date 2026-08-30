---
name: defeito-de-mecanismo-x-clausula-nova
description: Como classificar comportamento novo de gate — se ele só faz uma cláusula JÁ ratificada virar verdade, é defeito do mecanismo e não precisa de ratificação nova; o proprietário me corrigiu nisso
metadata:
  type: feedback
---

Regra: antes de escalar "isto é comportamento de gate novo, precisa de ratificação
do proprietário", pergunte se a mudança **acrescenta** uma cláusula ou se apenas
**faz cumprir** uma que já foi ratificada. Se for a segunda, é **defeito do
mecanismo** — corrige-se com red + green, sem gastar uma rodada de ratificação.

**Why:** na demanda 013 (2026-08-30) classifiquei a guarda de leitura parcial como
cláusula nova, fora das quatro do `IC-9`. O proprietário discordou e decidiu o
contrário, com o argumento que eu deveria ter feito sozinho: a primeira cláusula
ratificada é *"nominal, nunca abrangente"*, e um perdão aplicado sobre leitura
parcial **não é nominal** — logo o mecanismo não cumpria a cláusula que já existia.
Escalar aqui não era prudência, era atraso: a doença (verde escondendo campanha
que não terminou) é a razão de ser da demanda inteira.

A distinção também muda o **regime de prova**, e é por isso que ela não é
burocracia: correção de defeito nasce com red próprio e não depende de aprovação
nova; cláusula nova depende. Classificar errado ou trava o trabalho ou dá ao gate
uma exigência que ninguém ratificou.

**How to apply:** ao encontrar um furo num mecanismo ratificado, releia as
cláusulas ratificadas **uma a uma** contra o furo antes de escrever "precisa de
ratificação". Se alguma delas já cobre o caso, escreva o red e diga na resposta
que classificou como defeito e por quê — nomeando a cláusula. Registre a
divergência de classificação no artefato de red quando ela existir: ela é o
rastro de que a direção foi **decidida**, não afrouxada (R10 §1). Ver
[[perdao-sobre-leitura-parcial]] para o caso concreto e
[[excecao-que-morre-com-a-razao]] para as quatro cláusulas em questão.

Protocolo desta rodada, que mudou em relação às anteriores: **o proprietário
commita** (red e green em commits separados) e o `qa-engineer` deixa a árvore suja
com o red pronto. Consequência que precisa ser dita na resposta: sem SHA não há
`planning-state → red.commit` honesto para atualizar, e o passo do rito
"reconferir em árvore limpa **depois** do commit" é substituído pela igualdade de
`sha256` entre o arquivo da árvore real e o que foi commitado e medido na efêmera.
