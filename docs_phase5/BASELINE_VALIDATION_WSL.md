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

## Execução consolidada final — registro do proprietário

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

**Proveniência:** execução consolidada conduzida pelo proprietário (Flávio Costa) no host descrito
em "Ambiente observado", após as correções #1–#3. Registro completo, incluindo a suíte visual.

Observado em 2026-08-18:

```text
MATRIZ:    105/105
UI/UX/…:   UI 19+25+11+23+26 · UX 56 · Target 30 · Ref 28 · Journey 31 · Icons 12
Session:   97/97
M41:       PASS · payload 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
HTML:      8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb
visual:    67 passed · 0 failed · 37 skipped   (Chromium Playwright-managed)
```

**Veredito do baseline:** VALIDADO — todos os campos coincidem com o esperado.

---

## Revalidação na sessão de auditoria REV A

**Proveniência:** medição independente realizada durante a auditoria da PHASE 5.0 Candidate Spec
REV A (relatório em `docs_phase5/AUDITORIA_REV_A.md`), na mesma máquina, sob modo de trabalho
read-only. **Registro separado e não substitutivo** do anterior: existe para atestar que o baseline
continuava íntegro no momento da auditoria, não para reescrever a execução consolidada.

Observado em 2026-08-18:

```text
MANIFEST:  74/74 OK · 0 FAIL
engine:    9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
HTML dev:  8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb · 578152 bytes
HTML base: 3e24ff9dc18ec3c8005a75820e2828f801a8013a0e3945396c215b26c36f87bb
MATRIZ:    105/105
UI/UX/…:   UI 19+25+11+23+26 · UX 56 · Target 30 · Ref 28 · Journey 31
Session:   97/97
M41:       COMPARAÇÃO PASS · payload 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
spec REV A: 22e729174c6a3c5dd620da5330b03eb96d9eb6fc6e64eba097c2bde55eb0a510
```

**Não executado nesta sessão** (declarado, não omitido):

```text
npm run test:visual      NÃO EXECUTADO — Playwright/Chromium; escreve visual_evidence/ e print_evidence/
node tests_icons_m46.js  NÃO EXECUTADO — a suíte escreve arquivos (writeFileSync)
python3 build_v32_html.py / npm run build
                         NÃO EXECUTADO — reescreveria o HTML construído; identidade já conferida por hash
```

Consequência: as contagens Icons 12 e visual 67/0/37 desta revalidação **não** foram remedidas —
valem exclusivamente pelo registro do proprietário acima.

**Veredito da revalidação:** baseline ÍNTEGRO no momento da auditoria, nas suítes executadas.
Qualquer desvio futuro: parar, registrar e investigar como condição de ambiente antes de suspeitar
do produto (precedentes #1–#3 e o episódio do unzip na auditoria final).
