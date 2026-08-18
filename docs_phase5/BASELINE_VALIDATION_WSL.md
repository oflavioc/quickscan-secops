# BASELINE_VALIDATION_WSL.md — Phase 5 workspace · Quickscan SecOps V3.2

**Data:** 2026-08-18 · **Workspace:** `/mnt/c/Projetos/QuickScan-SOC-CMM/phase5`
**Propósito:** registrar, com valores realmente observados, a validação do baseline congelado
4.8.0.7 no ambiente de desenvolvimento da Fase 5, incluindo as condições de ambiente encontradas
na primeira execução. Nenhum artefato congelado foi alterado.

## Ambiente observado

```text
host:        Windows 11 Pro (FLAVIO-DESKTOP) · WSL2
distro:      Ubuntu 26.04 (resolute)
node:        v22.23.2
npm:         10.9.8
python3:     3.14.3
chromium:    Playwright-managed (npx playwright install chromium)
utilitários: unzip 6.0 · zip 3.0 · poppler-utils 26.01.0
```

Nota: difere do ambiente canônico documentado (Ubuntu 24.04.4 · Node 22.22.2 · npm 10.9.7 ·
Chrome 141 via /opt/google/chrome/chrome). Aceitável para desenvolvimento e validação de baseline;
builds oficiais e clean-rooms da Fase 5 devem seguir o ambiente canônico declarado
(BUILD_ENVIRONMENT.md do wrapper 4.9; backlog B3).

## Identidade do baseline (fatos observados)

```text
core:      quickscan_v32_audit_package_4807.zip
           625079c462be7d44ffd69b1cd85f256382322bd0555ae4b548f21bf30ee5b89d
           (verificado na fonte, pós-cópia e pré-extração)
MANIFEST:  74/74 OK
build:     python3 build_v32_html.py → sha256(engine) 9a4a2e674389a115… (byte-idêntico)
```

## Condições de ambiente encontradas na primeira execução (todas corrigidas)

| # | sintoma | gates afetados | causa | correção | classificação |
|---|---|---|---|---|---|
| 1 | `python3: can't open file '/mnt/c/Projetos/QuickScan'`; pdftotext com caminho partido | P2.1-16 (reprodutibilidade do builder) · SE3 · preflight PDF (+6 did not run) | espaço em `QuickScan SOC-CMM` quebrando shell-out sem aspas em testes congelados | pasta renomeada para `QuickScan-SOC-CMM` (sem espaço) | condição de ambiente — testes congelados não alterados |
| 2 | preflight ferramentas de PDF FAIL | print.spec preflight · SE3 | `poppler-utils` ausente no WSL recém-configurado | `apt-get install poppler-utils` | condição de ambiente |
| 3 | `unzip: not found` → SESSION 94/97 | S64 · S74+S75 (evidence archive) | `unzip` ausente | `apt-get install unzip` | condição de ambiente — precedente idêntico registrado na auditoria independente final (94/97 → 97/97) |

Nenhuma das três tocou runtime, suítes ou artefatos congelados; o ambiente foi adaptado à suíte,
nunca o contrário. Nenhum gate foi enfraquecido.

## Resultados por execução

```text
Execução 1 (pré-correções):
  engine/MATRIZ: 104 PASS · 1 FAIL (P2.1-16, causa #1)
  visual:        58 passed · 3 failed · 37 skipped · 6 did not run (causas #1 e #2)
  SESSION 4.8:   94 PASS · 3 FAIL (S64, S74+S75, causa #3)

Pós-correções (observado):
  SESSION 4.8:   97 PASS · 0 FAIL de 97
```

## Execução consolidada final (preencher com os valores observados)

Comandos:

```bash
cd /mnt/c/Projetos/QuickScan-SOC-CMM/phase5
npm run test:all
sha256sum quickscan_secops_soccmm_v3_2_dev.html
npm run test:visual
```

Valores esperados (baseline 4.8.0.7): MATRIZ 105/105 · UI 19+25+11+23+26 · UX 56 · Target 30 ·
Refinement 28 · Journey 31 · Icons 12 · Session 97/97 · M41 PASS (payload 9794b267…) ·
HTML `8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb` ·
visual 67 passed / 0 failed / 37 skipped.

Observado em ____-__-__:

```text
MATRIZ:    ___/105
UI/UX/…:   ____________________
Session:   ___/97
M41:       ______
HTML:      ________________________________
visual:    __ passed · __ failed · __ skipped
```

**Veredito do baseline:** VALIDADO quando todos os campos acima coincidirem com o esperado.
Qualquer desvio: parar, registrar e investigar como condição de ambiente antes de suspeitar do
produto (precedentes #1–#3 e o episódio do unzip na auditoria final).
