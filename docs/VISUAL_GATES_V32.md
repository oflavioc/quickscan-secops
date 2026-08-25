# Visual & Print Gates · Phase 4.7

Automação Chromium que substitui os roteiros manuais acumulados (`screenshot_audit_43.md`, mantido apenas como
registro histórico). **Gate canônico: execução no host do mantenedor.**

## Como rodar
```bash
npm ci --engine-strict                     # devDependency @playwright/test
npx playwright install chromium            # se o host não tiver Chrome/Chromium do sistema
npm run test:visual                        # 4 breakpoints
QS_CANONICAL_HOST=1 npm run test:visual    # gates rígidos do host (page count)
npm run test:full                          # test:all + test:visual
```

### Resolução de browser [4.7.0.1]
Ordem: **1)** `CHROME_PATH`, se informado · **2)** `/opt/google/chrome/chrome`, **somente se o arquivo existir** ·
**3)** caso contrário `executablePath` NÃO é definido e o Playwright usa o Chromium que ele gerencia
(`npx playwright install chromium`). Nenhum caminho Windows/macOS é hardcodado. Sem browser algum, o preflight
falha com instrução explícita — nunca passa em silêncio.

Nesta rodada os dois caminhos foram exercitados: **explícito** (`CHROME_PATH=/opt/google/chrome/chrome`) → PASS;
**gerenciado** → a config resolve para `playwright-managed` e omite `executablePath` corretamente, mas o download
do binário está **bloqueado neste container** (`cdn.playwright.dev` fora da allowlist, HTTP 403) — limitação de
ambiente declarada; no host canônico esse caminho é o esperado.
`npm run test:all` **não** inclui a suíte visual: o clean-room congelado precisa passar sem browser instalado.

## Ambiente
Executado nesta rodada com **Chromium 141.0.7390.37** (`/opt/google/chrome/chrome`) + Playwright 1.62.1.
`CHROME_PATH` sobrescreve o executável. `pdftoppm`/`pdftotext`/`pdfinfo` são exigidos pelo preflight — ausência é
declarada e, com `QS_CANONICAL_HOST=1`, impede PASS do raster gate. **Nunca há fallback para outro motor de print.**

## Fixtures (só inputs canônicos)
`__DEV` preenche apenas respostas, ponto de partida, prioridades, landscape (via editor real), target overrides e
refinement. Score, findings, recommendations, Journey e Narrative **sempre** vêm do recompute/render normal.
F1 questions · F2 priority · F3 rich · F4 sem contexto · F5 insufficient · F6 target mesmo estágio ·
F7 target superior · F8 refinement · F9 top stage. `V12` percorre o fluxo real por interação, sem `__DEV`.

## Gates de tela — 11 por breakpoint (1920×1080 · 1440×900 · 1366×768 · 390×844)
V1 radar por `getBoundingClientRect()` (460/420/largura útil, ±8px) · V2 zero overflow horizontal em 9 telas **reais, incluindo `arq` e `branch` por navegação** (nenhum DOM fabricado) ·
V3 zero console/pageerror (allowlist vazia) · V11 zero requisição externa (só file/data/blob/about) ·
V4+V5 progress com **cor de cada domínio assertada contra os custom properties congelados do runtime** (`--ftnt-purple/green/teal/blue/silver`, lidos em tempo de execução — sem hex duplicado no teste), Prioridade futura na branch, progress oculto no refinement ·
V6 teclado, `:focus-visible` real após Tab e **restauração de foco ao trigger** após Escape (básico; não é auditoria WCAG) · V7 DIRECT/CONTEXTUAL/VALIDATE legíveis com cor
neutralizada · V8 Journey com 6 nós sem sobreposição, labels ATUAL/**PRÓXIMO**/ALVO, top stage sem próximo fabricado, ladder mobile com ordem vertical e bboxes disjuntas — expectativa derivada de `journeyModel`/`stageOf` congelados ·
V9 overlay verde tracejado só com override, polígono atual inalterado · V10 evidência nomeada das 9 fixtures ·
V12 jornada real ponta a ponta.

## Gates de impressão — 7 (breakpoint canônico)
PDF canônico: `emulateMedia('print')` → assertions DOM/bbox → `page.pdf({preferCSSPageSize:true, printBackground:true})`.
P1+P2 Journey com bboxes disjuntas e radar contido, A4 validado (595×842pt) · P3+P4+P5 seções condicionais,
títulos únicos e disclaimers (metodológico completo + refinement) · P6 rota sem contexto tecnológico preservada ·
P7 anexo com NA e observações · P8 page count (baseline **12 páginas** para a fixture F7+refinement; **rígido só com `QS_CANONICAL_HOST=1`, review signal fora dele**) ·
P9 sem placeholders (`undefined`/`NaN`/`[object`) · P10 raster de evidência · P11 legibilidade com
`printBackground:false` como gate adicional de robustez.

## Evidências
`visual_evidence/` — screenshots `{gate}-{fixture}-{width}.png` (evidência de inspeção, **não** pixel-regression).
`print_evidence/` — PDFs por gate + rasters `P10-*`.

## Evidência da execução canônica
`visual_print_evidence_47.zip` (no audit package) contém `visual_evidence/` e `print_evidence/` **produzidos pelo
run declarado PASS** desta rodada: 51 passed · 0 failed · 21 skipped, `QS_CANONICAL_HOST=1`, Chromium 141.
Screenshots longos foram truncados a 4000px de altura apenas para caber no archive; continuam sendo **evidência de
inspeção, nunca baseline de pixel-regression**.
