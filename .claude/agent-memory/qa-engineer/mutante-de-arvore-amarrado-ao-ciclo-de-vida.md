---
name: mutante-de-arvore-amarrado-ao-ciclo-de-vida
description: Mutante de árvore cujo sujeito é a demanda EM VOO muda de veredito/código quando ela passa a done e depois é mesclada — pinar só o estado de hoje planta um sobrevivente no CI dentro da própria demanda; acople a expectativa à fase/posição e dê à alínea um carrasco permanente separado
metadata:
  type: feedback
---

Quando o único sujeito possível de um mutante de árvore é a demanda **em
curso** (caso `D016-M21`: "válvula em demanda não mesclada ⇒ prematura"), o
estado que o gate produz **muda por evento legítimo dentro da mesma demanda**:
`EM VOO + prematura` (fase aberta) → `EM VOO + obsoleta` (done sem merge —
decisão "done pré-empta" do instrumento) → `CONFORME + obsoleta` (mesclada).
Um `reason` que pina o estado de hoje sai SOBREVIVENTE no push do `done`
(T084), com o `verify` obrigatório bloqueando o próprio merge.

Forma que funcionou (2026-09-04, 016): o julgador do harness aceita **só** as
combinações acopladas à fase/posição do sujeito (fase≠done ⇒ prematura; done ⇒
obsoleta, `EM VOO` ou `CONFORME`) — não é afrouxamento, porque a propriedade
provada é "uma válvula nesta demanda nunca é legítima": se um dia o par
sobreviver, a árvore passou a ADMITIR a válvula (demanda mesclada com fase
aberta), que é exatamente o sinal. E a alínea (c) ganhou carrasco
**permanente** em sujeito estável (`D016-M28`: válvula na 015, done e mesclada
antes do piso). Declare o ciclo no cabeçalho do harness, na `_trilha` e no par.

**Why:** sem isso a demanda entregaria um par que morre hoje e apodrece amanhã
por desenho — "mutante obsoleto" construído de propósito, classe de
[[reason-que-pina-contagem-codifica-estado]]. Escolher um sujeito estável
(demanda done) para a alínea da demanda em voo não é opção: não existe demanda
permanentemente não mesclada na árvore.

**How to apply:** para todo mutante de árvore, pergunte "o que este sujeito
será depois do done, depois do merge, depois do próximo PR?" antes de pinar;
se o estado muda por evento legítimo, ou o julgador acopla a expectativa ao
evento (e diz por quê), ou o mutante vai para sujeito estável. Rejeite a
alternativa "reancorar depois": é o trap que a 014 pagou. Ver
[[bateria-negativa-do-julgador-do-harness]] para provar que o acoplamento não
virou vácuo.

## 2026-09-04 (Fase 6) — o que o acoplamento custa, medido

1. A 3ª combinação foi **executada** no clone com a 016 `done` + mesclada por
   `#99` simulado ([[simulacao-de-merge-em-clone-efemero]]): `D016_MUT_ONLY=
   D016-M21` ⇒ DETECTADO `CONFORME [fecho_pendente-obsoleta] · #99 (fase
   done)`. Tabela-verdade da `regra` em node: aceita 3 combos, rejeita 7
   (inclusive `FECHO PENDENTE DECLARADO` nas duas fases).
2. A frase do cabeçalho "se um dia sobreviver, a árvore admitiu a válvula" **não
   é alcançável como SOBREVIVENTE**: o mundo que a produziria (016 mesclada com
   fase aberta) já derruba o controle `C0-fecho` (1 problema) e M21 sai `NÃO
   EXECUTADO · baseline vermelho`. O sinal existe, com outro nome.
3. Negativo "instrumento ignora válvula em `done`" **não mede a regra**: a sonda
   (F9) pega o instrumento antes (C7), o baseline fica vermelho e M21 nem
   roda — para provar a `regra` do harness, use tabela-verdade ou splice da
   expectativa, nunca o instrumento ([[guarda-de-vacuidade-preempta-a-alinea]]).
4. O custo real do acoplamento: a partir do `done`, M21 passa a medir **C4(c)**
   (obsoleta), a mesma alínea de M28 — e **C4(d)** (prematura) fica sem
   carrasco de árvore para sempre (só F10 na sonda). A matriz registra "C4 d
   hoje; C4 c depois" mas não nomeia a perda. Alternativa que a fecha: mutante
   que CRIA um planning-state sintético nunca mesclado (`9NN-*.json`, restauração
   = unlink) — sujeito estável para C4(d). Levada como candidata, não decidida.

## 2026-09-04 (Fase 6, iteração J4) — a candidata virou D016-M32

Decidido pelo orquestrador ("se houver forma barata, faça"). O harness ganhou
`criar: {file, conteudo}` ao lado de `edicoes`/`remover`: a **âncora é a
AUSÊNCIA do arquivo** (preflight `ocorrencias` = 1 sse não existe; existindo, 0 =
"âncora não encontrada" — nunca escreve por cima, provado com o planning-state
016 como alvo: NÃO EXECUTADO e sha intacto); restauração = unlink + asserção de
ausência no fecho; o caminho entra em `targets` mesmo sem existir, para que um
commit que o crie redispare a campanha. O negativo obrigatório: o mesmo arquivo
**sem** a válvula tem de SOBREVIVER (EM VOO legítimo, 0 problemas). A alínea
ficou partida por cobertura: M21 (sujeito em voo, acoplado ao ciclo) e M32
(sujeito estável, permanente) — e a perda de M21 está nomeada no par, no
cabeçalho do harness e na matriz.
