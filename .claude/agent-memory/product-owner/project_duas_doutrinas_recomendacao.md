---
name: project-quickscan-duas-doutrinas-recomendacao
description: O QuickScan tem TRÊS doutrinas de recomendação convivendo (Camada 1 por gap, engine V3.2 por contexto, UAT-07 por gap com rótulo "a validar") e um vão entre elas quando o contexto é parcial
metadata:
  type: project
---

O relatório do QuickScan carrega **três** regras de recomendação incompatíveis, e a
documentação só descreve a segunda:

- **Camada 1 (`quickscan_secops_soccmm_v3_1_3.html`, `frozen`)** — `MAP` (`:420-467`)
  + `PRODUCTS` (`:262-276`) nomeiam produto **só a partir do gap**, sem contexto e
  **sem gate de suficiência** (`computeFindings` não consulta `suff`). Renderiza em
  `apoioBlock` (`:860`), só para gap ALTO. Cobre 15/15 qids, nos níveis `s:2` e `s:1`.
- **Engine V3.2 (`engine_v32.js`, `frozen`)** — candidato DIRECT exige
  `TECHNOLOGY_WHITESPACE` (gap + NONE declarado + suficiência). Sob UNSET devolve
  `CONTEXT_NOT_INFORMED`. É a doutrina que o texto do produto promete. **Assimetria:**
  SERVIÇOS são anexados mesmo sob UNSET (`:653-665`, só `hasGap`) — produto exige
  contexto, serviço não.
- **UAT-07 (`ui_v32.js:937-1002`, Phase 5.1)** — `QS_GAP_SUPPORT` nomeia produto a
  partir do gap **mas rotula "validar aderência"** quando o contexto não foi
  declarado. É a doutrina *correta* para o caso UNSET — e vive só no PDF, só em 4 dos
  15 qids, travada pelo oráculo `QIDS_AUTORIZADOS` (`tests_p50_core.js:3344`).

**O vão — achado da 010, e FECHADO por ela (2026-08-31).** Quem arbitra entre a 1ª e
a 2ª é `isLegacyModeV32()` (`engine_v32.js:305`), que exige contexto **ZERO**. Até a
010, o argumento de `hideLegacyRecommendation` era a constante `true`: uma única
resposta de arquitetura desligava a doutrina que produzia conteúdo sem ligar a que
substituiria. Hoje o argumento é `hasSubstituteV32(lastCtx)` — predicado puro sobre
`ctxRes.contexts`. **Não cite mais o vão como defeito vivo**; cite-o como o estado
que a 010 eliminou. A frase falsa "Leitura V3.1.3 preservada" também foi corrigida:
virou função do mesmo veredito (`baseCardHTML`, 4º parâmetro `afirmaPreservacao`,
default falsy de propósito). Números de linha desta seção mudaram com a 010 e a
errata E18 — **reler antes de citar**.

**Efeito colateral que a 010 CRIOU e ninguém pediu:** ao devolver a Camada 1 quando
não há substituto, os dois títulos de apoio passaram a ser **co-visíveis** —
"Apoio nas prioridades declaradas · contexto V3.2" (6ª seção) logo acima de "Como a
Fortinet pode apoiar nas prioridades declaradas" (7ª seção). O incômodo que o
cliente chamou de redundância no item 6a ficou **mais frequente**, não menos.
Ver [[superficies-de-apoio-e-persistencia-da-prioridade]].

**Why:** na 009 a queixa "falta recomendação para FortiSOAR/FortiEndpoint/FortiNDR/
FortiRecon" parecia problema de catálogo (Porta B). Não era: os quatro vínculos já
existem no `MAP`. Na 010 descobriu-se que também não era problema de *ausência* — era
de *subtração*. O cliente recebeu MENOS do que receberia se nada tivesse declarado.

**How to apply:** em demanda sobre recomendação/habilitador, checar as TRÊS fontes e
perguntar **em qual estado de sessão** o cliente estava, não só em qual superfície.
Reusar a *regra* de rótulo de UAT-07 custa zero; estender sua *tabela* reabre diretriz
selada. Ver [[project-gates-ancora-normativa]] e [[autorizacao-nominal-29-4-por-demanda]].
