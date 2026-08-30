---
name: project-quickscan-duas-doutrinas-recomendacao
description: O QuickScan tem DUAS doutrinas de recomendação convivendo — a Camada 1 congelada recomenda produto só a partir do gap, o engine V3.2 exige contexto declarado; toda demanda de recomendação tropeça nisso
metadata:
  type: project
---

O relatório do QuickScan carrega duas regras de recomendação incompatíveis, e a
documentação só descreve a segunda:

- **Camada 1 (`quickscan_secops_soccmm_v3_1_3.html`, `frozen`)** — `MAP` +
  `PRODUCTS` nomeiam produto **a partir só do gap**, sem contexto tecnológico
  algum, no bloco `apoioBlock`. Só para gap ALTO (`sev===2`).
- **Engine V3.2 (`engine_v32.js`, `frozen`)** — candidato DIRECT exige
  `TECHNOLOGY_WHITESPACE` (gap + NONE declarado + suficiência). Sob UNSET devolve
  `CONTEXT_NOT_INFORMED` e nenhum candidato. É a doutrina que o texto do produto
  promete ("nenhum produto é inferido sem contexto").

**Why:** na demanda 009 o cliente reclamou de "falta recomendação para
FortiSOAR/FortiEndpoint/FortiNDR/FortiRecon". A leitura óbvia era "precisa mexer
no engine — Porta B". Errado: os quatro vínculos já existem no `MAP` congelado, e
a superfície que o cliente olhava (card de prática-alvo) simplesmente não
consulta essa fonte. A rota barata era ler a Camada 1, não tocar o engine.

**How to apply:** em qualquer demanda sobre recomendação/habilitador, checar as
DUAS fontes antes de concluir que falta catálogo ou que o rito D2 é inevitável.
Perguntar sempre: em QUAL superfície o cliente estava? A resposta muda a rota.
Corolário recorrente: "falta recomendação" e "aparece bloco de contexto não
informado" costumam ser a MESMA causa — suprimir o segundo apaga a pista do
primeiro. Ver [[project-gates-ancora-normativa]].
