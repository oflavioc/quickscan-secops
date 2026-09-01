---
name: feedback-t004-ratificacao-mecanica
description: Ratificar contrato de catálogo = derivar o domínio do source e medir a regra, nunca conferir a prosa da tabela linha a linha
metadata:
  type: feedback
---

Ao ratificar tabela de equivalência/contrato de catálogo, **derive o domínio do
source você mesmo e meça a regra implícita**, em vez de conferir as linhas que a
prosa já escreveu. Concretamente: extrair as chaves do próprio `MAP`, contar
existência **e unicidade** do alvo em todos os registros do engine, e medir por
execução (`resolveCandidates`, `serviceEligibility`) o que a tabela apenas
*declara*.

**Why:** foi assim que a 010 saiu de "9 linhas óbvias + 2 duvidosas" para "uma
regra única (`name` idêntico a `PRODUCTS[k].n`) total e injetora nas 11" — e foi
a medição por execução, não a leitura da tabela, que revelou a divergência de
forma do contrato. O orquestrador pediu isso nominalmente ("chave que o plano não
previu é achado bloqueante"; "só aparece quando alguém olha o catálogo em vez da
tabela").

**How to apply:** vale para qualquer T00x de ratificação de catálogo/schema.
Script descartável no scratchpad + `require("./engine_v32.js")` (o engine é IIFE
com `module.exports`, roda em node puro). Cuidado: o Bash desta ferramenta come
`\\` mesmo entre aspas simples — escrever o script com a ferramenta Write, nunca
por heredoc, senão toda `RegExp` construída por string sai corrompida.
Relacionado: [[010-equivalencia-catalogo-divergencia]]
