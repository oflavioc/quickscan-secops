# REV_B_PHASE_OPENING_RECORD.md
## Registro de abertura formal · PHASE 5.0 (sob a REV B normativa)

**Natureza:** registro documental externo do ato de **abertura formal da Phase 5.0**. Não é
especificação e não introduz requisito: a fonte normativa é `specs/PHASE_5_0_REV_B.md`. Em qualquer
divergência, vence a spec.

**Data da abertura:** 2026-08-19
**Ato:** abertura formal da fase, declarada pelo proprietário (Flávio Costa). Quinto e último ato da
cadeia da §1 antes da implementação.

**Escopo autorizado nesta rodada:** **somente preparar e registrar a abertura documental.**
A Wave 1A **não** foi iniciada. Nenhum runtime, teste, builder, pacote ou lockfile foi tocado.

---

## 1. Identidade normativa sob a qual a fase abre

```text
especificação normativa:
specs/PHASE_5_0_REV_B.md

SHA-256:
4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b
```

Este é o mesmo SHA nomeado na aprovação do proprietário, o mesmo declarado em
`docs_phase5/REV_B_PROMOTION_RECORD.md` e no `CLAUDE.md`. **A spec não foi alterada por este ato** —
ver §5 (RQ-OPEN-1). Portanto `P50-GOV2` permanece fechado e inalterado:

```text
SHA observado de specs/PHASE_5_0_REV_B.md
  == SHA em docs_phase5/REV_B_PROMOTION_RECORD.md
  == SHA em CLAUDE.md
  == 4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b
```

---

## 2. Cadeia da §1 — completa

```text
1. AUTORIA DA CANDIDATA                                              ✔
2. AUDITORIA INDEPENDENTE — PASS, zero blockers                      ✔  2026-08-19
   docs_phase5/AUDITORIA_INDEPENDENTE_PHASE_5_0_REV_B.md · dfa80018…88c237c6
3. ACEITE DO PROPRIETÁRIO + APROVAÇÃO FORMAL DA CHANGE BOUNDARY §29  ✔  2026-08-19
4. PROMOÇÃO NORMATIVA (data + SHA-256 + CLAUDE.md simultâneo)        ✔  2026-08-19
   docs_phase5/REV_B_PROMOTION_RECORD.md · commit dda35b4b
   auditoria estreita do delta: PASS com ressalvas não bloqueantes
   docs_phase5/AUDITORIA_INDEPENDENTE_PROMOCAO_PHASE_5_0_REV_B.md · 373157c9…03112bee
5. ABERTURA FORMAL DA PHASE 5.0                                      ✔  2026-08-19 · este registro
6. IMPLEMENTAÇÃO (por microfases, §5/§33)          ← habilitada, NÃO iniciada nesta rodada
```

### 2.1 Declaração do proprietário

```text
Aprovo formalmente a abertura da Phase 5.0 sob a especificação normativa
specs/PHASE_5_0_REV_B.md, SHA-256
4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b.

A implementação fica autorizada exclusivamente dentro da change boundary
da §29 e do protocolo de microfases da REV B.

Autorizo nesta rodada somente preparar e registrar a abertura documental.
Não iniciar ainda a Wave 1A.
```

---

## 3. O que a abertura autoriza

Implementação **exclusivamente** dentro da change boundary da §29 e do protocolo de microfases
(§5/§33). Reprodução não normativa das listas fechadas, para conveniência do executor — **a spec é a
fonte**:

### 3.1 Microfases (§5) — numeração final

```text
5.0.1  Assessment Shell & Answer Semantics
5.0.2  Evidence Capture & Progress UX
5.0.3  Sufficiency-Aware Results
5.0.4  Target & Heat Map Visualizations        (framework views REMOVIDAS — §15)
5.0.5  Accessibility, Responsive & Visual Closure
```

Cada microfase segue o protocolo de fase do projeto:

```text
spec → baseline → boundary → implementação → gates → regressão → relatório → PARADA
```

### 3.2 Módulos novos autorizados (§29.2 — lista nominal e fechada)

```text
ui_p50_shell_v32.js      shell de assessment · owner único da composição de window.__uxDecor
ui_p50_suff_v32.js       camada derivada de suficiência (contrato UI-012A)
ui_p50_results_v32.js    results tabs, heat map, drill-down, executive cards, Current×Target
ui_p50_v32.css           estilos das superfícies novas (consome --ftnt-*; zero hex de domínio)
tests_p50_core.js        gates P50-UX*, P50-SUF*, P50-SESUX* estruturais, P50-COR1..3,
                         P50-IC1..3, P50-GOV*
tests_p50_chromium.js    gates P50-VIS*, P50-ACC*, P50-SESUX1B (não toca tests_visual/)
fixtures_p50.js          fixtures P50-F1..P50-F10
```

Módulo não listado nominalmente = criação/edição **proibida**, exigindo revisão da spec.

### 3.3 Arquivos existentes com edição permitida (§29.3 — limites nominais)

```text
build_v32_html.py    somente as entradas de injeção dos quatro módulos novos, na ordem
                     declarada; nenhuma outra linha
package.json         somente os scripts test:p50 / test:p50vis (+ inclusão em test:all) e a
                     devDependency "@axe-core/playwright": "4.13.0" em versão exata;
                     version intocado; nenhuma dependência de runtime
package-lock.json    somente o delta resolvido dessa devDependency e sua transitiva
```

### 3.4 Protegidos (§29.4 — edição proibida nesta fase)

```text
engine_v32.js · quickscan_secops_soccmm_v3_1_3.html · ui_v32.js · ui_ux_v32.js ·
ui_target_v32.js · ui_refinement_v32.js · ui_journey_v32.js · ui_session_v32.js ·
ui_icons_v32.js · ui_v32.css · ui_ux_v32.css · generate_icons_v32.py ·
harness_m41_v313.js · v3_1_3_functional_snapshot.json · todas as suítes congeladas
(tests_*.js existentes, incluindo tests_unset_ug.js) · tests_visual/ ·
MANIFEST.sha256 do core 4.8.0.7 (imutável) · question bank · schema de sessão ·
qualquer conteúdo metodológico
```

Nenhuma coluna do mapa tela × print da §29.1 é editada nesta fase: a implementação decora pós-render
e usa os setters congelados (D1/DL-3, UI-004). Print/PDF permanece **fora de escopo** (§29.6).

Se um requisito exigir tocar arquivo/símbolo protegido:

```text
STOP → classificar o requisito → abrir microfase dedicada → revisão independente
```

### 3.5 Baseline de trabalho da implementação (§0.A)

```text
HTML de trabalho     787cd3ab33188eee75a82590ab08d4240b6016a21329f899fd597050e3dde85a
engine_v32.js        9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
payload M41          9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
Camada 1             d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82
ui_v32.js            094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038
ui_target_v32.js     cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0
package.json         8654fc09d178f750ffcf1d87f8e1aaa1037d829ece698b01baab5d316586b599
tests_unset_ug.js    d2a3f804bb14e9156978407710a7a680f8dc4b71929546c28a719fbde1bae2e9
```

Manifesto de delta da fase: `MANIFEST_PHASE5_P50.sha256` (precedente: `MANIFEST_PHASE5_UNSET.sha256`),
estendido a cada entrega. Mapa de reancoragem `docs_phase5/REV_B_REANCHOR_MAP.md`: 33/33 verificadas,
0 pendentes — `P50-GOV3` materialmente satisfazível.

---

## 4. O que a abertura NÃO autoriza

```text
NÃO AUTORIZADO   iniciar a Wave 1A nesta rodada (vedação explícita do proprietário)
NÃO AUTORIZADO   qualquer edição de runtime, teste, builder, package ou lockfile nesta rodada
NÃO AUTORIZADO   instalação de dependências nesta rodada
NÃO AUTORIZADO   commit ou push desta abertura sem autorização expressa
NÃO AUTORIZADO   Wave 3 / Caminho B (exige microfase de conteúdo — contrato separado)
NÃO AUTORIZADO   Basic/Advanced Modelo 2 · novas perguntas condicionais · taxonomia nova de
                 evidence-status (UI-021) · reabertura de Print/Render (UI-045) · datasets de
                 framework mapping NIST/CIS (D4) · UI-010/estimativa de tempo (DL-5) ·
                 revisão de ICON_ASSET_DECISIONS_V32.md
NÃO AUTORIZADO   tag, freeze, release, deployment
```

**Freeze da Phase 5.0** permanece vedado até auditoria independente explícita (§32). **O agente nunca
declara abertura, conclusão ou freeze por conta própria** — este registro documenta ato do
proprietário.

---

## 5. Ressalva não bloqueante desta abertura

### RQ-OPEN-1 — a spec normativa conserva as declarações do estado promovido

`specs/PHASE_5_0_REV_B.md` permanece **byte-idêntica** em
`4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b`. Em consequência, suas linhas
`Phase 5.0 NÃO ABERTA`, `Implementação: NÃO AUTORIZADA` e `Wave 1A: NÃO INICIADA` (cabeçalho, §0.A,
§1, §35) descrevem o **estado no momento da promoção** e passam a ser **históricas**.

A preservação é deliberada e tem três razões:

1. a aprovação do proprietário está ancorada literalmente neste SHA;
2. este SHA é o objeto de dois pareceres independentes (candidata e delta de promoção);
3. alterá-lo mudaria o hash normativo, exigiria reabrir `P50-GOV2` e uma nova auditoria estreita.

Segue o mesmo padrão já aceito em `RQ-PROM-1` e `RQ-PROM-2`. **A autoridade corrente é:**

```text
spec normativa + REV_B_PROMOTION_RECORD.md + REV_B_PHASE_OPENING_RECORD.md + CLAUDE.md
```

Sessões e ferramentas futuras **não** devem tomar as linhas de status internas da spec, nem os
cabeçalhos dos artefatos de assurance byte-congelados, nem a linha RB-14.1 da §36, como fonte do
status corrente do projeto.

---

## 6. Obrigações que passam a valer na implementação

Evidence package da fase (§30) e Definition of Done (§31) permanecem integralmente exigíveis, com
destaque para:

```text
engine byte-idêntico (9a4a2e67…) · payload M41 byte-idêntico (9794b267…)
UNSET != NONE preservado (UG1–UG13 integrais; §12.2)
regressão de print INTEGRAL — ausência de escopo novo de print não autoriza redução
suítes congeladas em contagens integrais · UG13 PASS em Chromium real (SKIP ≠ PASS)
build determinístico (duas execuções → mesmo SHA)
gates novos com casos positivos, negativos, adversariais e mutation testing
primeira execução com FAIL declarada, nunca escondida
```

Ao final de cada microfase e da fase: **STOP** (§32). Não iniciar a microfase seguinte
automaticamente.

---

## 7. Estado após este registro

```text
Phase 5.0                ABERTA (2026-08-19)
especificação normativa  specs/PHASE_5_0_REV_B.md · 4f1583c7…f004619b
implementação            AUTORIZADA, restrita à change boundary §29 e ao protocolo §5/§33
Wave 1A                  NÃO INICIADA
runtime                  intocado
dependências             nenhuma instalação
commit/push desta abertura  PENDENTE de autorização expressa do proprietário
freeze / release / tag   vedados
```

## 8. Próximo ato

```text
AUDITORIA INDEPENDENTE ESTREITA DESTE REGISTRO DE ABERTURA
                    ↓
AUTORIZAÇÃO EXPRESSA DE COMMIT/PUSH
                    ↓
INÍCIO DA WAVE 1A (microfase 5.0.1), em ato separado
```
