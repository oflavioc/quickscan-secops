---
name: sobrevivente-por-lacuna-x-equivalente-por-spec
description: Antes de reforçar um gate para matar um mutante sobrevivente, leia o que a spec RATIFICA — mutante que preserva a propriedade ratificada é equivalente, e matá-lo é o gate exigindo mais que o critério
metadata:
  type: feedback
---

Quando uma sonda devolve vários sobreviventes sobre o mesmo ramo, eles **não são
a mesma coisa**, e a triagem é textual: vá à cláusula da spec e leia o que ela
**ratifica**, não o que o código faz hoje.

Caso da 010 (2026-08-30, ramo "sem equivalente V3.2" de `tgtValidateHTML`). Sete
mutantes simulados sobre o item sem equivalência; quatro sobreviventes. Triagem:

- **`data-eid` CRU** (a chave do `MAP` sem o prefixo `map:`) → **equivalente
  declarado**. A spec §C10 (b) ratifica "sem equivalência, com `PRODUCTS[c.p].n`
  e `data-eid` **estável**"; o prefixo literal está no comentário do produto,
  não no critério. A chave crua é estável, própria e não colide com id do engine
  (medido: 0 dos 45 ids contêm ":"), então satisfaz o critério ratificado. Pinar
  o prefixo seria o gate exigindo mais que a spec — R10 §1 ao contrário. Foi para
  o registro de vacuidades como equivalente, no mesmo padrão de A5;
- **item DESCARTADO em silêncio**, **ORDEM invertida**, **rótulo do modo trocado**
  → sobreviventes de verdade, por falta de caso. Morreram com a extensão da
  alínea de contagem/ordem à fixture que tinha a rota.

**Why:** os quatro apareciam iguais na saída da sonda ("SOBREVIVENTE"). Tratar
todos como lacuna teria enfiado no gate uma asserção que o `product-owner` nunca
ratificou; tratar todos como equivalentes teria deixado três defeitos reais
passarem. A coluna que separa é a spec, e ela custa uma leitura.

**O ciclo fecha, e fechar faz parte da regra.** Na mesma demanda, horas depois,
o coordenador ratificou a errata **E15**: o prefixo `map:` virou normativo e
C10 (b) passou de "`data-eid` estável" para "`data-eid` da forma
`map:<chave do MAP>`". O mutante deixou de ser equivalente **sem que nenhuma
medição mudasse** — mudou a cláusula. Aí sim o gate pina, e o pino matou 5
formas de uma vez (chave crua, `map-`, chave errada, `MAP:`, prefixo sem chave),
todas SOBREVIVENTES contra o gate pré-errata, com zero movimento nos outros 9
mutantes da matriz. Três coisas a repetir nessa segunda metade:

- **transcreva o literal do critério, nunca do módulo sob teste** — derivar o
  prefixo do source faria o oráculo concordar com qualquer prefixo que o produto
  passasse a emitir, que é o contrário do que a errata pede;
- **a entrada de equivalente não se apaga, se risca** (R2 §5): a razão pela qual
  o mutante era equivalente é o que explica por que hoje ele morre;
- **re-meça a subsunção depois da errata.** Eu havia recusado pinar o eid numa
  segunda alínea por subsunção; com o critério novo a pergunta volta, e a
  resposta tinha de ser medida de novo (continuou subsumida — o pino ficou num
  gate só). E pergunte se a cláusula vizinha não virou inerte: aqui a checagem
  de colisão passou a só poder disparar se o catálogo invadisse o namespace, e
  só continuou no gate porque uma sonda provou que ela ainda vira o valor.

**How to apply:** para cada sobrevivente, escreva a frase "o mutante viola
_qual_ cláusula, literalmente?". Se a resposta for uma propriedade do código
(prefixo, formato, nome de variável) e não da cláusula, é equivalente: registre
com a citação da spec e o motivo, para ninguém reescrever o mutante esperando
morte. Se o gate DEVE passar a exigir a propriedade, isso é **mudança de
critério** e sobe ao `product-owner` — nunca se resolve fortalecendo o gate por
conta própria. Irmão de [[cenario-sem-mutante-e-cenario-nao-medido]] pelo lado do
mutante; complementa [[universo-de-tamanho-um]], que decide se a alínea nova
acrescenta poder, enquanto esta decide se ela pode existir.
