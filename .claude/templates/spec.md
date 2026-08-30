# Spec — <NNN-slug>

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Uma frase. Link: [refinement.md](refinement.md).

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|

## Comportamento especificado

Por superfície: entrada → saída esperada, incluindo os casos de borda do
refinamento. UNSET/NA/suficiência tratados explicitamente quando tocados.

## Contratos

Bridge/payload/estado novo: shape, owner do estado (R9 §5), consumidores.

## Cross-check (obrigatório)

- [ ] Invariantes R1 — nenhuma violada
- [ ] design-decisions.md — nenhum conflito
- [ ] Specs validadas anteriores — nenhuma contradição
- [ ] **Specs de fase seladas — por leitura, não por memória.** Abrir as de
  `current_phase.json → specs_normativas` e citar `arquivo:linha` do que toca o
  escopo — inclusive o resultado negativo ("nada sobre <tema> em <arquivo>"),
  que também é leitura. Spec selada nunca é editada aqui (rito de promoção).
- [ ] **Boundary (R6) — as três fontes cruzadas**, nesta ordem:
  `.claude/verify/boundary.json` (classes), `PROTECTED` e `frozenSuites`
  (`tests_p50_core.js`) e `.claude/verify/pins.json` (identidade de HEAD, stage
  `baseline`). Toca protegido? Rito nomeado e autorização PARADA aqui.
  **Precedência**: onde a prosa de spec selada divergir do executável, vale o
  regime de pins (R8; `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`,
  Disposição §2) — e a divergência vira **achado** em `.claude/BACKLOG.md`,
  nunca edição de spec selada.

## Fora de escopo

Herdado do refinamento + o que a spec exclui.
