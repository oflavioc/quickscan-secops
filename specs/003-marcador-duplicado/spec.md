# Spec — 003-marcador-duplicado

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Remover a segunda emissão do marcador `/* V32_UI_END */` na string `inject` do
`build_v32_html.py`, rebuildar o HTML, repinar o registry e retirar a exceção
nominal KI-1 — cumprindo a remoção prevista registrada em `known_issues.json` e
`design-decisions.md`. Link: [refinement.md](refinement.md).

## Critérios de aceite → gates

Esta demanda **não cria suíte nova**: os gates são os stages já existentes do
`pipeline.yaml` (fonte única — R10 §9), rearmados pela remoção da exceção KI-1.
O red natural (R3 §4) nasce da remoção da exceção ANTES da correção do builder.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| G1 | **Red natural provado e commitado**: com a entrada KI-1 REMOVIDA de `known_issues.json` e o builder AINDA bugado, o marker-lint DEVE falhar acusando `V32_UI_END` 2× | stage `marker-lint` · `.claude/verify/check_markers.py` · saída contém `[FAIL] marcador V32_UI_END: 2 ocorrência(s), esperado 1` e exit ≠ 0. Este FAIL é **commitado** (red inauditável = E3); planning-state registra `red.status: proven` com a referência do commit | — (G1 É a prova de que o gate detecta o defeito; ver M1 em G2) |
| G2 | **Green pós-correção**: após correção do builder + rebuild, marker-lint verde com `V32_UI_END` exatamente 1× e **nenhum outro marcador alterado** — cláusula mecanizada pela contagem pinada: linha final do stage igual a `marker-lint: 34 marcadores distintos · 0 problema(s)` (34 = 13 pares JS, incluindo `V32_BUILD_META`, + 4 pares CSS — contado no builder real, `build_v32_html.py:64-76`, e confirmado no HTML publicado; a correção remove uma OCORRÊNCIA de nome já contado, não um nome — o conjunto de 34 permanece) | stage `marker-lint` · `.claude/verify/check_markers.py` · exit 0, linha final exata `marker-lint: 34 marcadores distintos · 0 problema(s)`, sem linha `[OK] ... exceção nominal` (KI-1 não existe mais); pares BEGIN/END coerentes | **M1**: reintroduzir `+ "\n/* V32_UI_END */\n"` na linha da `inject` do builder (antes de `anchor`) + rebuild efêmero → marker-lint DEVE falhar. Executado **manualmente pelo qa-engineer** nas Fases 4/6 (harness formal de mutação é Onda 3 — KI-2); resultado registrado no relatório da fase |
| G3 | **Identidade do derivado**: HTML rebuilded commitado no MESMO PR é byte-idêntico ao que o builder corrigido reproduz (rebuild + repin fazem parte da entrega, não de PR posterior) | stage `build` · `.claude/verify/check_build.py` · `[OK] rebuild byte-idêntico ao publicado` + árvore de trabalho inalterada, exit 0 | — (coberto por M1: com o mutante, o HTML de HEAD divergiria do rebuild e o stage `build` também falharia) |
| G4 | **Só comentário mudou**: payload funcional canonicalizado do HTML rebuilded == pin declarado `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b`. Se o payload mudar, a demanda **PARA** — virou Porta B, que esta demanda não autoriza | stage `m41` · `.claude/verify/check_m41.py` · `COMPARAÇÃO: PASS` + `payload … == pin declarado (régua D2)`, exit 0 | — (oracle independente da implementação — padrão-ouro R10) |
| G5 | **Regressão congelada intacta**: todas as suítes node com as contagens canônicas inalteradas (nenhum teste depende do marcador duplicado — verificado por Grep no refinamento, caso de borda 2) | stages `suites` + `suites-heavy` · `.claude/verify/check_suites.py` (e `--heavy`) · execução real == `expected_suites.json`, exit 0 | — (registro canônico `expected_suites.json` não muda nesta demanda) |

Complementares (rodam de qualquer forma no pipeline, citados por completude):
stage `baseline` prova o repin coerente (R8 §1 — arquivo pinado alterado sem
regenerar registry = FAIL) e stage `boundary` prova que nenhum protegido foi
tocado fora do rito.

## Comportamento especificado

Superfície única: o builder (`build_v32_html.py`), e por derivação o HTML gerado.
Nenhuma superfície de UI, sessão, UNSET/NA ou suficiência é tocada — o marcador é
comentário JS dentro do HTML, invisível a facilitador e leitor de relatório.

### Diff pretendido no builder (linha ~70, string `inject` iniciada na linha 68)

A linha hoje termina com (trecho final, defeito em destaque):

```python
... + "\n/* V32_P52_WORKSPACE_BEGIN */\n" + p52wsjs + "\n/* V32_P52_WORKSPACE_END */\n" + "\n/* V32_UI_END */\n" + anchor)
```

O diff é remover **exclusivamente** o segundo `+ "\n/* V32_UI_END */\n"` terminal
(a emissão espúria entre `V32_P52_WORKSPACE_END` e a âncora), SEM tocar em
nenhuma outra parte da linha:

```python
... + "\n/* V32_P52_WORKSPACE_BEGIN */\n" + p52wsjs + "\n/* V32_P52_WORKSPACE_END */\n" + anchor)
```

O par correto do bloco UI (`"\n/* V32_UI_BEGIN */\n" + uijs + "\n/* V32_UI_END */\n"`,
no meio da mesma linha) permanece byte-idêntico. A **ordem de injeção permanece
inalterada** (engine → adapter → icons → ui → ux → target → ref → build_meta →
journey → session → p50_shell → p50_suff → p50_results → p52_workspace → anchor);
a injeção de CSS (linha 76) não é tocada.

### Efeito observável no HTML rebuilded

- `/* V32_UI_END */` passa de 2 ocorrências (linhas 6270 e 11974 do HTML atual)
  para exatamente 1 (a do fechamento real do bloco UI).
- Todos os demais marcadores `V32_*` permanecem 1× cada, pares BEGIN/END coerentes.
- Nenhuma outra diferença de bytes além da linha removida (a segunda ocorrência e
  suas quebras de linha adjacentes emitidas pela string).

### Casos de borda do refinamento — tratamento nesta spec

| Caso (refinement) | Tratamento |
|---|---|
| 1 — hash do HTML muda | G3 + repin via `gen_pins.py` no MESMO PR (ver Contratos) |
| 2 — testes que asserem `V32_UI_END` | Nenhum existe (Grep = 0 hits); G5 prova contagens intactas |
| 3 — remoção da KI-1 antes da correção | É o desenho: G1, o red natural da Fase 4 |
| 4 — payload M41 pós-rebuild | G4; payload ≠ pin = PARAR (Porta B não autorizada) |
| 5 — entrada obsoleta em `design-decisions.md` | A linha "Marcador `V32_UI_END` duplicado no HTML" da tabela de decisões confirmadas SAI junto, no mesmo PR (senão reinstala divergência doc×código) |
| 6 — contagens verdes do baseline | G5 (`expected_suites.json` inalterado) |

## Contratos

Nenhum bridge, payload ou estado novo (R9 §5 não se aplica — não há dado novo nem
owner de estado). O contrato desta demanda é de **identidade de artefatos**:

Arquivos pinados que mudam (`.claude/verify/pins.json → files`) e exigem
regeneração do registry via `gen_pins.py` **no mesmo PR**, com motivo no commit
(R8 §1; classe `registry` — R6):

| Arquivo | Pin atual (pins.json) | Como muda |
|---|---|---|
| `build_v32_html.py` | `beda6ecb…` (linha 88) | edição direta (classe editável): remoção da segunda emissão |
| `quickscan_secops_soccmm_v3_2_dev.html` | `fb906462…` (linha 127) | **só via rebuild** pelo builder (classe `generated`); trilha "Identidade anterior: `fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79`" |
| `.claude/verify/known_issues.json` | `004cff79…` (linha 72) | remoção da entrada KI-1 (KI-2 e KI-3 byte-idênticas) |
| `.claude/rules/design-decisions.md` | `8cc03ea7…` (linha 32) | remoção da linha da tabela sobre o marcador duplicado (caso de borda 5) |

Pin declarativo `declared.m41_payload_sha256 = 9794b267…` **NÃO muda** — mudá-lo
seria ato de governança (R8 §3) e esta demanda não o autoriza (G4 é a prova).
`check_markers.py` e `expected_suites.json` **não mudam** (a regra 1× já é o
default do lint; nenhuma contagem de suíte se altera).

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** INV-1 intocada: `engine_v32.js` não é
  tocado (a correção vive na string `inject` do builder) e G4 prova payload == pin
  — engine byte-idêntico E comportamento idêntico. A identidade do HTML muda
  **conscientemente** via rebuild+repin: classe `generated`, rito respeitado
  (mudança só via builder, stage `build` prova identidade). UNSET≠NONE,
  suficiência, target, narrativa: superfícies não tocadas.
- [x] **design-decisions.md — nenhum conflito.** O oposto: a entrada "Marcador
  `V32_UI_END` duplicado no HTML" registra exatamente esta demanda como rota de
  remoção ("demanda própria via máquina SDD"). Executá-la é cumprimento; a linha
  sai da tabela no mesmo PR (caso de borda 5).
- [x] **Specs validadas anteriores — nenhuma contradição.** Nenhuma spec anterior
  assere a duplicidade; a §29 (REV B) não protege o builder para injeção
  (`build_v32_html.py` é edição limitada nominal) e nenhum módulo §29.2 muda.
- [x] **Boundary (R6) — nada `frozen` tocado.** `frozen` (engine, Camada 1, M41,
  snapshot): intocados. `generated` (HTML): muda só via builder — rito cumprido.
  `registry` (pins.json): só via `gen_pins.py`, mesmo PR, motivo no commit — rito
  cumprido. `legacy` (MANIFEST.sha256): intocado. **Nenhuma PARADA por
  autorização necessária** — nenhum arquivo exige rito de Porta A/B.

## Fora de escopo

Herdado integralmente do refinamento:

- **Nenhum outro marcador `V32_*`** — só a segunda emissão de `V32_UI_END`;
  ordem de injeção e demais pares BEGIN/END byte-idênticos.
- **Nenhuma outra exceção nominal** — KI-2 e KI-3 permanecem intocadas (remoções
  previstas próprias: Onda 3 e calibração do job visual do CI).
- **Nenhum módulo de produto** — engine, Camada 1, ui_*/ux_*/p50/p52, sessão,
  ícones, CSS: nada muda.
- **Nenhuma mudança no lint** `check_markers.py` — a regra 1× já é o default;
  não se escreve gate novo nem se altera o existente (não enfraquecer, não
  fortalecer: rearmar por remoção da exceção).
- **MANIFEST legado** (`MANIFEST.sha256`) — classe `legacy`, reconciliação é
  Onda 4; não é tocado nem reconciliado aqui.
- Print/PDF, superfícies 4.x, release v3.2.0: intocados (fora da change boundary).

Acrescentado pela spec:

- **Nenhum harness de mutação novo** — o mutante M1 é executado manualmente pelo
  qa-engineer (Fases 4/6) e registrado no relatório da fase; a matriz gate-mutante
  formal é Onda 3 (KI-2).
- **Nenhuma alteração em `pipeline.yaml` ou `expected_suites.json`** — os stages
  existentes já são os gates; nenhuma checagem nova nasce aqui.
- **Nenhuma mudança no pin declarativo** `declared.m41_payload_sha256` — se o
  rebuild o exigir, a demanda PARA (Porta B).

---

ARQUIVOS_TOCADOS: specs/003-marcador-duplicado/spec.md (criado — único artefato desta fase)
RESUMO: Spec da Fase 1 produzida pelo template, referenciando o refinement aprovado. Critérios fixados como gates JÁ EXISTENTES do pipeline (G1 red natural do marker-lint com KI-1 removida e FAIL commitado; G2 marker-lint verde 1×; G3 stage build byte-idêntico no mesmo PR; G4 stage m41 payload == pin 9794b267… senão PARAR/Porta B; G5 suites+suites-heavy com contagens canônicas), mutante M1 manual pelo qa-engineer (harness formal é Onda 3). Diff exato especificado: remover só o segundo `+ "\n/* V32_UI_END */\n"` terminal da string inject (build_v32_html.py:70), ordem de injeção inalterada. Repins no mesmo PR via gen_pins.py: builder, HTML (rebuild, trilha fb906462…), known_issues.json e design-decisions.md (linha da tabela sai — caso de borda 5). Cross-check completo: nada frozen tocado, nenhuma parada por autorização.
EVIDÊNCIA: lidos — specs/003-marcador-duplicado/refinement.md:1-128 (íntegra), .claude/templates/spec.md:1-35, .claude/rules/tdd.md:1-43, .claude/rules/gates.md:1-34, .claude/rules/pins.md:1-25, .claude/rules/boundary.md:1-27, .claude/rules/orchestration.md:1-71, .claude/rules/design-decisions.md:1-31 (entrada do marcador na linha 11), .claude/verify/check_markers.py:1-47, .claude/verify/known_issues.json:1-29 (KI-1 em 8-13), .claude/verify/check_build.py:1-53, .claude/verify/check_m41.py:1-45, build_v32_html.py:60-79 (inject na linha 68-70, defeito no final da 70), .claude/agents/tech-lead.md:1-39. Execuções (só leitura): cat .claude/verify/pipeline.yaml (stages marker-lint/build/m41/suites/suites-heavy confirmados) e grep em .claude/verify/pins.json (pins beda6ecb… l.88, fb906462… l.127, 004cff79… l.72, 8cc03ea7… l.32, declared 9794b267… l.13). Nenhum gate executado (fase de spec — nada a executar).
DEPENDÊNCIAS: aprovação de portão da Fase 1 pelo usuário; Fase 2 (plan.md) e Fase 3 (tasks.md) pelo tech-lead após o portão; qa-engineer executa o red G1 na Fase 4 (remoção da KI-1 + FAIL commitado + planning-state red.status: proven); build-engineer é o dono natural da correção do builder + rebuild + repin (Fase 5); doc-writer/PO para a remoção da linha em design-decisions.md pode ser tipada como parte da mesma entrega (decisão de dono fica para o tasks.md).

Emenda de portão (Fase 1): G2 pina a contagem de marcadores distintos — ajuste do cross-check do PO.
