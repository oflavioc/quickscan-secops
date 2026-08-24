# Phase 5.2 — Errata final de UAT: eliminação da página final residual do PDF

**Errata aplicada sobre a candidata corrente da Phase 5.2**, depois da errata de escala, popovers e
paginação. Escopo fechado em um único objetivo: **nenhuma página de PDF pode existir apenas por
rodapé, cabeçalho, número de página, URL ou decoração** — inclusive a última.

Documento aplicado: `ERRATA_FINAL_UAT_PHASE_5_2_PAGINA_FINAL_RESIDUAL.md`
· SHA-256 `ec92a5e14f7139c0d8cd7ec5c337db24755083138b6c4f6bb1bf76fc651774d7` · 5.621 bytes ·
161 linhas · UTF-8 sem BOM · zero CRLF — conferido antes de qualquer edição.

**Nada dos itens aceitos foi reaberto:** escala ultrawide, proporção 7+5, escalas 1,22/1,10,
popovers dos domínios, jornada horizontal/atômica, lógica, score, estágio, Target, contexto,
recomendações e sessão permanecem exatamente como aceitos. Este relatório **não declara a fase
concluída** e **não contém autoauditoria**.

---

## 0 · Preflight (§1)

| verificação | resultado |
|---|---|
| branch | `feat/phase5-5-2-desktop-workspace` |
| commits da candidata · staged | **0** · **0** |
| HTML de entrada | `1c51810eca4786483826e7f1592965833758e864a9ead97373923ecd7c5f6dca` · **912.961 bytes** — confere |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` — confere |
| manifesto de entrada | `edd21e5830bb3de073c41a4745eec81ac7fafc541be71b9b122525b6ee769007` — confere |
| M41 (payload canônico) | `9794b267…3ed4365b` · exit **0** — confere |
| produção `127.0.0.1:1337` | `200` · 744.179 B · `12bb950f…eebbf9d9` — os mesmos bytes de antes da rodada |

Nenhuma divergência material. Edição iniciada só depois disso.

---

## 1 · O defeito, medido no papel

Um único cenário produzia a folha residual — e produzia de verdade:

| cenário | páginas antes | última página antes |
|---|---|---|
| `P52-pdf-bloqueado` | **7** | somente `Quickscan SecOps · SOC-CMM · Fortinet — relatório contextual V3.2` |
| `P52-pdf-fronteira` | 12 | anexo, perguntas 14–15 (material) |
| `P52-pdf-suficiente-3prioridades` | 11 | anexo, perguntas 14–15 (material) |
| `P52-pdf-suficiente-sem-prioridade` | 12 | anexo, perguntas 14–15 (material) |

**Causa raiz, medida e não suposta.** Na penúltima página do cenário bloqueado sobravam **~29pt**
(o texto terminava em 769,8pt de uma área útil que vai até 808,9pt). O rodapé custava, somados:
`margin-bottom` de 14px da última seção + `margin-top` de 16px do próprio rodapé + a caixa de
~20,8px = **~51px ≈ 38pt**. Faltavam poucos pontos — e o rodapé abria uma folha inteira só para si.
Era exatamente o item "margem, padding ou altura mínima no último bloco" da §3.

---

## 2 · A correção, na origem

Duas camadas, ambas em CSS de impressão da camada 5.2, escopo `#v32-print-report` (o print legado
não é tocado):

1. **a margem residual de fim de documento sai** — `#v32-print-report .pr-sec:last-of-type
   { margin-bottom: 0 }` e o rodapé com `margin-top: 6px; padding-top: 4px`. O que encolhe é
   **espaço vazio**: nenhum texto muda de tamanho, nenhuma seção é comprimida;
2. **o rodapé fica atado ao último conteúdo material** — `break-before: avoid` no rodapé e
   `break-after: avoid` no último cartão do anexo. Se um dia não couber mesmo, o rodapé desce
   **acompanhado** do último cartão; sozinho, nunca.

A camada 1 é a otimização que elimina a folha nos cenários medidos; a camada 2 é a **garantia
estrutural** que impede a reincidência quando o conteúdo mudar de tamanho.

**Nada foi apagado depois de gerado** e **nenhuma tipografia foi reduzida** — o número de páginas
dos outros três cenários não mudou, o que por si só mostra que não houve compressão global.

---

## 3 · Gate material (§4) — `P52-PDF6`

O gate novo classifica **todas** as páginas dos quatro PDFs, inclusive a última, separando
**conteúdo material** de **decorador**:

- o texto do decorador é lido do **próprio relatório** (`.pr-foot`), não digitado no gate;
- as palavras do decorador são removidas antes de contar caracteres materiais e antes de calcular
  a caixa do conteúdo;
- a **tinta material** é medida na página rasterizada **apenas acima da faixa decorada** — porque,
  como a errata observa, linha, rodapé e URL também produzem tinta e uma contagem bruta de pixels
  seria enganosa.

Uma página é **residual** se: não tiver conteúdo material; tiver só decorador; tiver conteúdo
material abaixo do limiar (**< 120 caracteres materiais E < 1,5% de tinta material**); ou contiver
**somente o título de uma seção** sem o primeiro conteúdo. Qualquer página residual — intermediária
ou final — reprova o gate.

Registro por página, em `docs_phase5/evidence_p52/P52-pdf-paginacao.json`: número, primeiro e
último texto material, caracteres materiais, caixa do conteúdo material, tinta material,
classificação `material`/`residual` e o motivo da classificação.

---

## 4 · Não vacuidade (§6) — `P52-ER9`

Mutante novo: `break-before: page` no rodapé do relatório, reintroduzindo a folha só de rodapé.

Detectado pelo `P52-PDF6`, com o motivo exigido — o gate **nomeia o PDF e a página**, declara
**"página FINAL residual"** e mostra os números observados:

```text
P52-pdf-suficiente-3prioridades p12 de 12: página FINAL residual —
página sem qualquer conteúdo material [0 caracteres materiais, 0% de tinta material]
```

Restauração de fontes e do acervo byte a byte ao final da campanha. A detecção é do gate, não do
manifesto.

---

## 5 · Resultado nos quatro cenários (§5)

| cenário | páginas antes → depois | última página | caracteres materiais | tinta material | início do conteúdo material | SHA-256 do PDF |
|---|---|---|---|---|---|---|
| `P52-pdf-suficiente-3prioridades.pdf` | 11 → **11** | p11 · **material** | 323 | 9.84% | 14. A superfície externa é monitorada — cred… | `84b48e57246c96d86a8c80b205d7360bb0c411411a1552fed86f38911fecd0b8` |
| `P52-pdf-suficiente-sem-prioridade.pdf` | 12 → **12** | p12 · **material** | 323 | 9.84% | 14. A superfície externa é monitorada — cred… | `c6dc784de1bf34763b7a11015f224fcdc3afa73b487cf75ff10d6b5fdb46c2e9` |
| `P52-pdf-fronteira.pdf` | 12 → **12** | p12 · **material** | 323 | 9.84% | 14. A superfície externa é monitorada — cred… | `8521a72f379c2aa898c0cc680d8dd7b34e177afe49441769c1041df3cccc6197` |
| `P52-pdf-bloqueado.pdf` | 7 → **6** | p6 · **material** | 1979 | 10.68% | Anexo — respostas da sessão 1. A operação de… | `e8711fde55ae7190d223d3be0caeb5b24119b6842ae0b3aa22cb0761b795f9bc` |

**Zero página residual em qualquer posição**, nos quatro cenários: nenhuma página intermediária e
nenhuma página final classificada como residual pelo censo material. O cenário que continha a folha
residual passou de **7 para 6 páginas**; os outros três mantiveram a contagem — prova direta de que
não houve compressão nem redução tipográfica para forçar o resultado.

Continuam válidos e reexecutados no mesmo lote: jornada íntegra numa página com os seis estágios
(`P52-PDF4`), zero título órfão e nada fora da área imprimível (`P52-PDF5`), primeira página com
abertura, orientação, resumo e régua (`P52-PDF1`/`P52-PDF2`), ícones sem distorção (`P52-PDF3`).

**Rasterizações** — `docs_phase5/evidence_p52/pdf/`, 19 páginas em PNG a 100dpi: páginas 1 e 2, a
página da jornada, a página de abertura das prioridades e, como esta errata exige, **a penúltima e
a última** de cada cenário.

---

## 6 · Testes — execução serial, com códigos de saída próprios

| suíte | comando | exit | resultado |
|---|---|---|---|
| build | `python3 build_v32_html.py` | **0** | determinístico — duas execuções, mesmo SHA |
| **P52 Chromium** | `node tests_p52_chromium.js` | **0** | **34 PASS · 0 FAIL** (33 + `P52-PDF6`) |
| **P52 layout** | `node tests_p52_layout.js` | **0** | 35 PASS · 0 FAIL |
| UI 3.3.2 (PDF) | `node tests_ui_m332.js` | **0** | 23 PASS · 0 FAIL |
| Jornada 4.5 | `node tests_journey_m45.js` | **0** | 31 PASS · 0 FAIL |
| P50/P51 core · Chromium | `tests_p50_core.js` · `tests_p50_chromium.js` | **0** · **0** | 64 · 27 |
| Sessão 4.8 | `node --max-old-space-size=4608 tests_session_m48.js` | **0** | 97 PASS · 0 FAIL |
| M41 | `node harness_m41_v313.js … --compare` | **0** | PASS — payload idêntico ao baseline |
| Visual congelado | `npx playwright test` | **0** | 67 passed · 0 failed · 37 skipped |
| **Mutação P52** | `node tests_p52_mutants.js` | **0** | **48/48** detectados pelo gate **e** pelo motivo esperados |

Campanha de mutação executada sozinha e em série; restauração byte-idêntica dos fontes e do HTML,
com o acervo de evidência conferido arquivo a arquivo (138 arquivos).

---

## 7 · Hashes da entrega

| artefato | SHA-256 |
|---|---|
| **HTML candidato** (914.648 bytes) | `70d91eb252f6b5238ec048724f329ffd172f3b42d9e0b70a0e78f8b04739c2cf` |
| **`engine_v32.js`** | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` — byte-idêntico ao core |
| **payload funcional M41** | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` — byte-idêntico ao core |
| `ui_p52_workspace_v32.css` | `8bd2d3e14468d225064c418729860a44420689949d11cf17e2bc090d66fa1eec` |
| `tests_p52_chromium.js` | `d3b340e873d5253d569ce92c141eeae3c1e1c90c00828747f6d9845625dd524d` |
| `tests_p52_mutants.js` | `fec61fe3305358be92d7cb3891e24961b9be57448bd706dbf72b19137dbc2710` |

---

## 8 · Arquivos alterados nesta errata

| arquivo | natureza |
|---|---|
| `ui_p52_workspace_v32.css` | bloco de print da errata final: margem residual de fim de documento e rodapé atado ao último conteúdo material |
| `tests_p52_chromium.js` | `P52-PDF6` (censo material de todas as páginas), medida de tinta por região e leitura do decorador a partir do próprio relatório |
| `tests_p52_mutants.js` | mutante `P52-ER9` |
| `docs_phase5/evidence_p52/` | PDFs regenerados, 19 rasterizações e censo material |
| `docs_phase5/PHASE_5_2_ERRATA_FINAL_PAGINA_RESIDUAL_REPORT.md` | este relatório |
| `docs_phase5/MANIFEST_PHASE5_P52.sha256` | regenerado por último |
| `quickscan_secops_soccmm_v3_2_dev.html` | derivado do build determinístico |

**Não foram tocados:** `engine_v32.js`, `ui_v32.js`, `ui_v32.css`, `ui_ux_v32.css`,
`ui_p52_workspace_v32.js`, `ui_p50_*`, `ui_journey_v32.js`, question bank, scoring, schema, Target,
contexto, recomendações, sessão, `build_v32_html.py`, `package.json`, `deploy/`, `AGENTS.md`,
`MANIFEST.sha256` e o acervo histórico `docs_phase5/evidence_p50/`.

---

## 9 · Onde ver

**Preview local: <http://127.0.0.1:1338/>** — serve exatamente o HTML candidato acima.
**Produção `127.0.0.1:1337` intacta:** `200` · 744.179 bytes · `12bb950f…eebbf9d9`.
**Branch `feat/phase5-5-2-desktop-workspace` · 0 commits · 0 staged.** Nenhum commit, push, PR,
merge, tag, release, freeze, deployment, promoção ou auditoria independente foi realizado.
