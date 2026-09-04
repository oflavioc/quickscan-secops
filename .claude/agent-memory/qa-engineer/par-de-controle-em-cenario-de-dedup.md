---
name: par-de-controle-em-cenario-de-dedup
description: Cenário de deduplicação só mede se tiver, no MESMO nó, o par que colide E um homônimo que NÃO deve fundir — sem o controle, só a direção "deduplica de menos" morre
metadata:
  type: feedback
---

Todo cenário de **deduplicação/fusão por identidade** precisa de DOIS pares no
mesmo nó observado: o par que **colide** (tem de fundir) e um par de **controle**
— homônimo que existe no catálogo mas **não está anexado** ao estado corrente, e
que portanto tem de **sobreviver**.

**Why:** um cenário só com o par que colide mata apenas o mutante que deduplica
**de menos** (deixa o item duplicado). O mutante que deduplica **demais** — que
consulta a tabela de equivalência sem olhar o que está de fato anexado — passa
verde, porque não há nada que ele possa apagar indevidamente. Medido na emenda da
010 (2026-08-30): `MAP["monitoring-coverage"].lv[0].c` traz `SOCaaS` e
`FortiGuard-MDR-Service`; o catálogo congelado tem **exatamente dois** pares
homônimos (`fortiguard-socaas`≡`SOCaaS` e `fortiguard-mdr`≡`FortiGuard-MDR-Service`,
mesmo `name`/`n` renderizado, ids distintos); e só o primeiro serviço está anexado
por `hasGap`. Colocar o alvo naquele qid dá as duas direções de uma vez, sem
inventar estado.

Dois corolários que vieram junto:

- **A tabela de equivalência é oráculo, não constante.** Re-derive-a do catálogo a
  cada execução (varrer serviços × chaves do `MAP` comparando o nome renderizado) e
  compare contra a lista declarada. Renome de um lado faz o gate cair e alguém
  decidir a direção (R10 §1) em vez de a tabela envelhecer calada — mutante de
  renome morre por essa cláusula e por nenhuma outra.
- **A colisão se prova nominalmente.** `fortiguard-socaas` e `SOCaaS` parecem o
  mesmo pela grafia; o que os torna colisão é `SERVICES[sid].name === PRODUCTS[chave].n`.
  Assertar por semelhança de string é adivinhar.

**How to apply:** ao desenhar a fixture de qualquer requisito de dedup/merge,
pergunte primeiro "qual é o homônimo que NÃO pode fundir, e ele está no mesmo nó?".
Se não estiver, o cenário nasce medindo meia direção — é o caso do
[[cenario-sem-mutante-e-cenario-nao-medido]] visto pelo lado do mutante que
ninguém escreveu. Declare os dois lados na tabela e confira também a negativa (o
serviço de controle **não** anexado): se um dia ele for anexado, o controle deixou
de ser controle e o cenário perdeu a direção sem avisar.
