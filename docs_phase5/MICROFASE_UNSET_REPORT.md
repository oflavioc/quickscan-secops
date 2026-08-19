# MICROFASE_UNSET_REPORT.md — UNSET Geometry Correction (pré-5.0)

**Data:** 2026-08-18 · **Workspace:** `/mnt/c/Projetos/QuickScan-SOC-CMM/phase5`
**Autorização:** instrução do proprietário desta sessão (decision log B-3/D3), decorrente de
`docs_phase5/AUDITORIA_REV_A.md` §B-3, §A-8 e §7 (D3).
**Objetivo:** eliminar os 5 pontos em que UNSET era desenhado como **zero geométrico**, preservando
byte a byte o rótulo canônico `n/d` e o desenho existente quando não há UNSET.
**Status:** implementação concluída e verificada. **Nada é declarado congelado.** A REV B **não** foi
iniciada.

---

## 1 · Resultado

```text
5 pontos corrigidos           · 5/5
engine_v32.js                 · BYTE-IDÊNTICO (9a4a2e67…2b5d247a)
payload funcional M41         · BYTE-IDÊNTICO (9794b267…3ed4365b) · COMPARAÇÃO PASS
rótulo canônico "n/d"         · PRESERVADO byte a byte (gate UG9)
gates novos (UG1–UG13)        · 13 PASS · 0 FAIL
mutation testing dos gates    · 9/13 falham contra a mutação correspondente (poder discriminante provado)
regressão congelada           · test:all 0 FAIL · test:visual 67 passed / 0 failed / 37 skipped
build determinístico          · duas execuções → mesmo SHA
```

---

## 2 · Passo empírico exigido pelo protocolo (executado ANTES de qualquer edição)

### 2.1 Método

Montou-se um clean-room em scratchpad com as entradas de build copiadas do workspace. O build de
controle reproduziu **exatamente** o baseline (`8d0932e1…1fd85ddb`), provando fidelidade do
ambiente de prova. Em seguida, aplicou-se aos 5 pontos uma **mutação-surrogate** de geometria
(omissão de vértice / supressão de fill), rebuildou-se e rodou-se a bateria completa.

### 2.2 Achado — o payload M41 é insensível à geometria

| artefato | controle | mutado |
|---|---|---|
| SHA do HTML construído | `8d0932e145d8a8f8…1fd85ddb` | `1b90927df84e2f88…86865682` |
| **payload funcional M41** | `9794b267…3ed4365b` | **`9794b267…3ed4365b` · COMPARAÇÃO PASS** |

Causa raiz verificada no source: o snapshot do harness (`harness_m41_v313.js`, função `snapshot`)
é composto exclusivamente de valores funcionais — `answers`, `priorities`, `confirmed`,
`toValidate`, `domains{score,conf,basis,n,nNA}`, `sufficiency`, `overall`, `stage`, `findings`,
`validate`, `tiers`. Nenhuma saída de render entra no contrato. `radarSVG`, a régua de domínio e o
módulo de alvo **não são exercitados** pelo harness.

Ressalva registrada: o harness executa o bloco `<script>` inteiro (engine + UI injetada) em `vm`.
Erro de sintaxe ou efeito colateral de topo **quebraria** M41 — a insensibilidade é de dados, não
de execução. Por isso M41 foi reexecutado após cada build real.

### 2.3 Achado — nenhum gate congelado assere geometria de UNSET

Bateria completa contra o build mutado, no clean-room:

```text
MATRIZ 105/105 · UI 19+25+11+23+26 · UX 56 · Target 30 · Ref 28 · Journey 31 · Session 97/97
VISUAL: 67 passed · 0 failed · 37 skipped
```

Motivo: **todas** as fixtures dos gates que tocam radar respondem as 15 práticas
(`answerAll`, `base()`, `F4_legacy`, `answers(page,1,…)`), portanto não possuem domínio UNSET.
Isso significa que a *equivalência visual sem UNSET* já era exigida pelo runtime congelado — a
correção foi desenhada para caber nessa restrição, e não o contrário.

### 2.4 Restrições extraídas do source e respeitadas no desenho

| origem | restrição | como foi respeitada |
|---|---|---|
| `tests_ux_m41.js:453` (UX55) | `.radar .shape` deve existir e ter **5 pontos** sem UNSET | polígono mantido; vértices omitidos **apenas** quando `score===null` |
| `tests_ux_m41.js:456` + `ui_ux_v32.js:190` | exatamente 5 `svg.radar text[data-dom]`; o decor casa por **prefixo** do nome do domínio | nenhum `<text>` novo no SVG; a nota é um `<div>` fora do SVG |
| `tests_ui_m332.js:231` (P22 C) | `.pr-radar` deve ter **exatamente 5** `<text>` | marcadores de UNSET são `<circle>`; nota é `<div>` irmão do SVG |
| `tests_target_m431.js:114` (T14), `screen.spec.js:201` (V9) | **tracejado + `#3CB17E` é encoding exclusivo do cenário-alvo** | UNSET usa eixo **pontilhado neutro** (`3 3`, cor `--faint`/`#999`) + marcador **vazado**; nunca verde |
| `tests_target_m431.js:172`, `print.spec.js:46` | `#pr-target svg.pr-radar polygon[stroke-dasharray]` deve existir; ≥5 labels | polígono do alvo intocado no encoding; só a lista de vértices muda |
| `ui_target_v32.js:113` | `tgtRadarOverlay` exige `line.axis` com `length===5` | os 5 eixos permanecem; UNSET só adiciona a classe `unset` |
| N3, S9, T10/T11, P11 | rótulo literal `n/d` | emissão do rótulo **não foi tocada** (gate UG9 prova) |

**Veredito do passo empírico:** nenhuma condição de PARADA ocorreu — M41 não quebra e `n/d` é
preservável. Autorizado a prosseguir pelo próprio protocolo.

---

## 3 · Mapa antes/depois dos 5 pontos

### P1 · Radar de tela — `quickscan_secops_soccmm_v3_1_3.html` (Camada 1)

```diff
- const shape = stats.map((s,i)=>pt(i, R*Math.max(s.score??0,0.15)/5).join(",")).join(" ");
+ const shape = stats.map((s,i)=>s.score===null ? null : pt(i, R*Math.max(s.score,0.15)/5).join(","))
+                    .filter(p=>p!==null).join(" ");
```

Acréscimos: eixo do domínio UNSET recebe `class="axis unset"` (pontilhado neutro); marcador vazado
`<circle class="unset-mark" data-unsetdom="i">` no centro; `aria-label` do SVG nomeia os domínios
sem avaliação; nova função `radarUnsetNote(stats)` emite nota textual **fora** do SVG.
O piso legado `0.15` foi **mantido** para scores reais (equivalência byte a byte, gate UG10) e deixa
de ser aplicado a UNSET — que agora simplesmente não existe como vértice.

### P2 · Régua de domínio — `quickscan_secops_soccmm_v3_1_3.html` (Camada 1)

```diff
- <div class="ruler"><div class="fill" style="width:${(s.score??0)/5*100}%"></div>
+ <div class="ruler${s.score===null?" unset":""}">${s.score===null
+   ? `<span class="ruler-na" role="img" aria-label="não avaliado">—</span>`
+   : `<div class="fill" style="width:${s.score/5*100}%"></div>`}
```

UNSET deixa de produzir `.fill` (barra de 0%) e passa a produzir trilho tracejado vazio com
marcador `—` e nome acessível `não avaliado`.

### P3 · Radar do PDF — `ui_v32.js:652`

```diff
- const poly = stats.map((s,i)=>P(i, R*((s.score===null?0:s.score)/5))).join(" ");
+ const poly = stats.map((s,i)=>s.score===null ? null : P(i, R*(s.score/5)))
+                   .filter(p=>p!==null).join(" ");
```

Mais: eixo UNSET com `stroke-dasharray="3 3"`, marcador `<circle>` vazado, `aria-label` honesto e
nota `.pr-radar-nd` **fora** do SVG (para não violar P22 C).

### P4 · Overlay de alvo na tela — `ui_target_v32.js:120`

```diff
- const s=tgt.stats[i].score===null?0:tgt.stats[i].score/5;
+ if(tgt.stats[i].score===null) return null;
+ const s=tgt.stats[i].score/5;
```

### P5 · Radar atual × alvo no PDF — `ui_target_v32.js:179`

```diff
- const poly=st=>st.map((s,i)=>P(i,Rp*((s.score===null?0:s.score)/5))).join(" ");
+ const poly=st=>st.map((s,i)=>s.score===null?null:P(i,Rp*(s.score/5))).filter(p=>p!==null).join(" ");
```

Aplicado aos **dois** polígonos (atual e alvo) + nota textual dos domínios sem ponto.

### Busca de exaustividade

Varredura por `??0`, `?? 0`, `===null?0`, `=== null ? 0`, `||0` e `Math.max(s.score` em
`quickscan_secops_soccmm_v3_1_3.html`, `ui_v32.js`, `ui_target_v32.js`, `ui_journey_v32.js`,
`ui_refinement_v32.js`, `ui_ux_v32.js`, `ui_session_v32.js`, `ui_icons_v32.js`: **nenhum sexto
ponto**. As demais ocorrências (`ARQ[arq ?? 0]`) são default de arquétipo, sem relação com
geometria. Journey já filtra por `d.n>=2 && d.score!==null` e nunca preenche com zero.

---

## 4 · Gates novos — namespace UG (`tests_unset_ug.js`)

Oracle independente da implementação: a geometria esperada é recalculada dentro do teste a partir de
`DOMS`/`SCORES`/vetor de respostas, **sem** chamar `radarSVG`/`prRadarSVG`.

| gate | classe | o que prova | resultado |
|---|---|---|---|
| UG1 | positivo | radar de tela: vértice UNSET **omitido**; nenhum vértice colapsado no centro | PASS |
| UG2 | positivo | eixo UNSET pontilhado + marcador vazado; **não** usa o encoding do alvo | PASS |
| UG3 | positivo | régua: UNSET sem `.fill`, com `.ruler.unset`, marcador `—` e nome acessível | PASS |
| UG4 | positivo | radar do PDF: vértice omitido **e** exatamente 5 `<text>` (invariante P22 C) | PASS |
| UG5 | positivo | overlay de alvo: eixo sem alvo efetivo omitido do polígono | PASS |
| UG6 | positivo | radar de alvo no PDF: ambos os polígonos omitem UNSET; tracejado preservado | PASS |
| UG7 | **negativo** | nível 0 (ausência confirmada) continua plotado: 5 vértices, score 0.0, `.fill` presente | PASS |
| UG8 | **adversarial** | sessão **suficiente** com 5 práticas UNSET: 5 vértices, score 3.3 sem diluição por zero fantasma | PASS |
| UG9 | **regressão** | `n/d` byte-idêntico em radar, rótulo de domínio e PDF | PASS |
| UG10 | **equivalência** | sem UNSET, `points` é **byte-idêntico** à fórmula legada; sem nota; aria original | PASS |
| UG11 | limite | assessment em branco: 0 vértices, 5 marcadores, nota presente, **zero erro de console** | PASS |
| UG12 | acessibilidade | a nota nomeia **exatamente** os domínios não avaliados (sem depender de cor) | PASS |
| UG13 | **layout (Chromium)** | com UNSET, a nota **não sobrepõe** nenhum `text[data-dom]` nem `text.v` do radar (bounding boxes disjuntos, tolerância 0 px); sem UNSET, a nota não existe | PASS |

```text
UNSET GEOMETRY (UG): 13 PASS · 0 FAIL de 13
```

**UG13 — nota de implementação.** Bounding box exige layout real, que o jsdom não produz. O gate
roda **dentro de `tests_unset_ug.js`**, dirigindo o Chromium diretamente e espelhando a ordem de
resolução de browser congelada (`CHROME_PATH` → `/opt/google/chrome/chrome` se existir → Chromium
gerenciado), justamente para **não** tocar `tests_visual/` — fora da boundary autorizada. Sem browser
resolvível o gate imprime `SKIP … NÃO EXECUTADO` e **nunca** conta como PASS, preservando o
invariante congelado de que `npm run test:all` passa sem browser instalado
(`VISUAL_GATES_V32.md`). Nesta execução o browser estava disponível e o gate foi realmente medido.

### 4.1 Mutation testing dos gates

A suíte UG foi executada contra o build **pré-correção** (`probe_control.html`, byte-idêntico ao
baseline `8d0932e1…`):

```text
UNSET GEOMETRY (UG): 4 PASS · 8 FAIL de 12      (UG13 ainda não existia nesta rodada)
FAIL: UG1 UG2 UG3 UG4 UG5 UG6 UG11 UG12     ← um por superfície corrigida + limites
PASS: UG7 UG8 UG9 UG10                      ← gates de invariância (devem valer antes E depois)
```

**UG13 · mutação dedicada.** O gate de layout não é sensível à geometria, e sim à regra de CSS que o
sustenta. Mutação aplicada: remoção de `.radar-box{flex-wrap:wrap;}` sobre o build **já corrigido**.

```text
UNSET GEOMETRY (UG): 12 PASS · 1 FAIL de 13
FAIL: UG13
```

Medida no Chromium com a regra removida: a nota assume `420×405 px` em `left=908.8` e invade o
rótulo `Pessoas` (`right=910.9`) — exatamente o defeito capturado por inspeção visual e descrito no
§8.3. Com a regra presente, todos os 10 bounding boxes (5 rótulos + 5 valores) são disjuntos da nota.

Leitura: cada gate positivo tem poder discriminante comprovado sobre a superfície que governa; os
quatro que passam nos dois lados são exatamente os que existem para detectar **dano colateral**
(zero legítimo, diluição, rótulo, equivalência) — se a correção tivesse quebrado algo, teriam caído.

---

## 5 · Regressão completa

```text
npm run test:all
  MATRIZ (M1–M40 + M42–M86 + P2.1): 105 PASS · 0 FAIL de 105
  UI M3.1 19/19 · UI 3.2 25/25 · UI 3.3.1 11/11 · UI 3.3.2 (PDF) 23/23 · UI 3.3.3 26/26
  UX 4.1 56/56 · TARGET 4.3.1 30/30 · REF 4.4 28/28 · JOURNEY 4.5 31/31 · ICONS 4.6 12/12
  SESSION 4.8 97/97
  UNSET GEOMETRY (UG) 13/13
  M41: COMPARAÇÃO PASS — payload 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b

npm run test:visual
  67 passed · 0 failed · 37 skipped
```

Todas as contagens coincidem com o baseline 4.8.0.7. Nenhum gate foi enfraquecido, reescrito ou
removido; a suíte UG é puramente aditiva.

Ambas as suítes foram **reexecutadas integralmente após a inclusão do UG13**; as contagens acima são
as dessa última execução. O SHA do HTML permaneceu `787cd3ab…` — UG13 alterou apenas a suíte de
testes, nunca o produto.

### 5.1 Build determinístico

```text
python3 build_v32_html.py  (execução 1) → 787cd3ab33188eee75a82590ab08d4240b6016a21329f899fd597050e3dde85a
python3 build_v32_html.py  (execução 2) → 787cd3ab33188eee75a82590ab08d4240b6016a21329f899fd597050e3dde85a
```

---

## 6 · SHAs pré e pós

| arquivo | pré (baseline 4.8.0.7) | pós (novo baseline phase5) |
|---|---|---|
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | **inalterado — byte-idêntico** |
| `quickscan_secops_soccmm_v3_1_3.html` | `3e24ff9dc18ec3c8005a75820e2828f801a8013a0e3945396c215b26c36f87bb` | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| `ui_v32.js` | `be47f50062b45a3b382f72be8cfe3d8c39f00568f2990ebf2f660cb132c4b426` | `094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038` |
| `ui_target_v32.js` | `f391346d54c3406fb73f554285a74f263c3517b03e2ad78bd70b006269584be9` | `cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0` |
| `quickscan_secops_soccmm_v3_2_dev.html` | `8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb` | **`787cd3ab33188eee75a82590ab08d4240b6016a21329f899fd597050e3dde85a`** |
| `package.json` | `(4807)` | `8654fc09d178f750ffcf1d87f8e1aaa1037d829ece698b01baab5d316586b599` |
| `tests_unset_ug.js` | — (novo) | `d2a3f804bb14e9156978407710a7a680f8dc4b71929546c28a719fbde1bae2e9` |
| payload funcional M41 | `9794b267…3ed4365b` | **inalterado — byte-idêntico** |

**Novo baseline de HTML da Fase 5:**
`787cd3ab33188eee75a82590ab08d4240b6016a21329f899fd597050e3dde85a`

### 6.1 Estado do MANIFEST

`MANIFEST.sha256` — o registro de identidade do **core 4.8.0.7 congelado** — **não foi alterado**.
Ele agora acusa, corretamente, 5 divergências e apenas elas:

```text
sha256sum -c MANIFEST.sha256  →  69 OK · 5 FAILED
FAILED: quickscan_secops_soccmm_v3_1_3.html · ui_v32.js · ui_target_v32.js
        quickscan_secops_soccmm_v3_2_dev.html · package.json
```

Isso é o delta esperado e auditável desta microfase, não corrupção: o core 4807 permanece congelado
na pasta-mãe e o delta vive somente neste workspace. O registro novo está em
`docs_phase5/MANIFEST_PHASE5_UNSET.sha256` (6 entradas, todas conferidas OK).

---

## 7 · Evidência

`docs_phase5/evidence_unset/`:

| artefato | conteúdo |
|---|---|
| `UG-screen-radar-unset.png` | radar com Serviços UNSET: polígono de 4 vértices, eixo pontilhado, marcador vazado, `Serviços n/d`, nota textual centralizada |
| `UG-screen-ruler-unset.png` | painel por domínio: 4 réguas preenchidas + Serviços com trilho tracejado vazio, marcador `—` e `n/d` |
| `UG-print-unset.pdf` | relatório impresso com a mesma semântica (paridade tela/PDF na geometria) |
| `UG-geometry.json` | geometria medida no Chromium + `pageErrors: []` |

Geometria medida (fixture: 12 respostas, Serviços inteiro UNSET):

```json
"screenShape": "170,122.6 205.56951370943875,148.44276441037698 191.9831684357385,190.25723558962304 148.0168315642615,190.25723558962304",
"screenMarks": 1,
"screenNote": "Domínio não avaliado (n/d, sem ponto no radar): Serviços",
"aria": "Radar indicativo de maturidade por domínio. Sem avaliação, portanto fora do polígono: Serviços.",
"rulerUnset": 1,
"printShape": "150.0,89.4 177.2,109.2 166.8,141.1 133.2,141.1",
"printTexts": 5,
"pageErrors": []
```

Quatro vértices para quatro domínios avaliados, em ambas as superfícies. Nenhum vértice no centro.

---

## 8 · Desvios e ressalvas declarados

1. **`package.json` fora da lista literal de arquivos autorizados.** A instrução autorizou "suíte de
   gates nova" e exigiu "regressão completa (test:all + test:visual)". Sem registrar a suíte em
   `package.json`, os gates UG ficariam fora da regressão — as duas exigências seriam incompatíveis.
   A alteração é mínima e aditiva: `"test:unset"` e sua inclusão em `test:all`. **Nenhum script
   existente foi modificado.**
   **Status: edição fora de boundary divulgada e autorizada a posteriori pelo proprietário em
   2026-08-18**, após parecer do auditor independente. O registro permanece nesta seção como desvio
   divulgado — **não** é reclassificado como escopo original da microfase.
2. **CSS novo vive no bloco `<style>` da base HTML** (arquivo autorizado). `ui_v32.css` e
   `ui_ux_v32.css` **não foram tocados** — as regras congeladas asseridas por UX55/T14 permanecem
   byte-idênticas. O marcador do PDF usa atributos SVG inline, sem CSS novo.
3. **Regra aditiva no `<style>` da base HTML — DENTRO da boundary (ratificado pelo proprietário em
   2026-08-18):** `.radar-box{flex-wrap:wrap;}` foi adicionada
   como **regra separada** (a linha original `.radar-box{display:flex; justify-content:center;}`
   está intacta) para que a nota textual desça para a linha seguinte em vez de disputar espaço com o
   SVG. Sem isso a nota renderizava espremida sobre os rótulos do radar — defeito capturado por
   inspeção visual da evidência, não por gate. **Essa lacuna foi fechada:** o gate UG13 agora mede o
   layout no Chromium e falha se a regra for removida (§4.1).
4. **`SESSION_SCHEMA_V32.md`, `CHANGELOG_v32.md` e demais docs não foram atualizados** — fora do
   escopo autorizado desta microfase.
5. **Dívida herdada não tocada:** `ui_target_v32.js:32` continua espelhando o gate de suficiência
   (achado B-2 da auditoria). Está fora do escopo desta microfase e permanece coberto pela decisão
   B-1/D2 do proprietário (gate de equivalência na fase 5.0).
6. **`n/d` continua sendo o token canônico.** Esta microfase corrigiu **somente geometria**,
   conforme a estratégia preferencial da decisão B-3/D3. O achado A-8 (proposta de trocar `n/d` por
   `—`/`Não avaliado` em UI-002/UI-014) **permanece aberto** para a REV B.

---

## 9 · Estado final

```text
microfase:          UNSET Geometry Correction (pré-5.0) — IMPLEMENTADA E VERIFICADA
engine:             INTOCADO (9a4a2e67…)
M41:                PRESERVADO (9794b267…)
novo baseline HTML: 787cd3ab33188eee75a82590ab08d4240b6016a21329f899fd597050e3dde85a
gates novos:        UG1–UG13 · 13 PASS · 0 FAIL · mutation-tested (inclui UG13/layout)
regressão:          test:all 0 FAIL · test:visual 67/0/37
REV B:              NÃO INICIADA
declaração de freeze: NENHUMA — cabe ao auditor/proprietário
```

**PARADA.** Aguardando decisão do proprietário.
