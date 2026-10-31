---
name: peca-sem-consumidor-nao-tem-mutante
description: Cego que vive em peça sem consumidor não tem conserto verificável — prove a inalcançabilidade com cópia INSTRUMENTADA do gate num run verde e entregue dívida com gatilho, não remendo
metadata:
  type: feedback
---

EA-46: `ic_estatico` (`check_mutation.py`) devolve tupla e os **dois** pontos cegos
de regex vivem só no **segundo** elemento. Medido no HEAD: `ic_estatico` tem 3
ocorrências no repositório — a definição e dois chamadores —, e **ambos consomem
`[0]`**. Logo regex generalizada e regex cega produzem saída **idêntica em todo
lugar**: o conserto é inverificável (R3 §5 não admite gate novo sem mutante que ele
mate) e qualquer mutante em `:181-182` é **equivalente por construção**.

**A decisão é "não consertar", e a entrega é a dívida declarada com a razão medida**
(`mutation-matrix.json → dividas_declaradas`, o destino que `design-decisions.md`
nomeia; precedente direto: o 4º parâmetro de `prCards`). Remover a metade morta é
igualmente inobservável, mexe em arquivo pinado + dois chamadores, e deixa a
descrição **ratificada** da spec (017 §Bordas 5 / §Fora de escopo) mentindo sobre o
código — família EA-31 ao contrário. Generalizar é comportamento NOVO de
instrumento: R4, não `fix-finding`.

**Prove, não deduza — cópia INSTRUMENTADA do gate:** `git show`/cópia do
`check_*.py` no scratchpad com um contador dentro da função suspeita + `atexit`
imprimindo o total, rodada **da raiz do repo** num estado verde. Saiu
`ic_estatico chamada 0 vez(es)` com `integridade: 0 problema(s)` e
`mutation: 1 campanha(s) · 0 problema(s)` — inalcançabilidade **medida**, não lida.
As duas portas da reserva ficaram nomeadas: IC-5 responde por `preflight (C1)`
(a linha o diz: `[oráculo dos ids: preflight (C1)]`) e o laço do IC-9 tem
`known_issues.json → issues` = **0**; a única entrada restante é o preflight não
responder, estado que o `IC-4` já reprova com nome.

**Cense pelo predicado que importa, e pine a regra junto do número.** A cadeia do
achado dizia "sete dos onze harnesses"; o censo do que decide (2º elemento vazio,
por harness do `mutation_map.json`) dá **10 de 12**, COMPLETO em 1 (p51, a forma
para a qual o regex foi escrito) e PARCIAL em 1 (d014, 3 de 5) — **idêntico** no
commit que escreveu o achado e no HEAD, logo defeito estável, não crescente. O
"sete" contava só a forma de declaração e incluía um arquivo que não é fonte de
harness.

**Gatilho nominal na dívida, senão é silêncio:** o dia em que nascer o **primeiro
consumidor** do segundo elemento, generalizar as regexes é **pré-requisito** dele,
no mesmo PR e com par na matriz — senão a reserva mente por **omissão** em 10 dos
12 harnesses, devolvendo `[]` indistinguível de "harness não muta nada". Consumir
sem generalizar reabre o achado **com efeito observável**, e aí é FAIL.

**Why:** "o cego é real" é verdadeiro e insuficiente; sem consumidor não há
veredito que mude, e remendo sem mutante é teatro — exatamente o que eu recusaria
de um engenheiro.

**How to apply:** antes de aceitar ou recusar conserto em instrumento, conte os
consumidores de **cada peça** do retorno, instrumente para provar zero chamadas no
verde, e só então escolha entre dívida (com gatilho) e demanda. Ver
[[ramo-morto-instrumente-antes-de-classificar]],
[[sobrevivente-por-lacuna-x-equivalente-por-spec]] e
[[numero-esperado-diferente-do-medido]].
