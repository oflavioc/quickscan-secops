# CLAUDE.md — Quickscan SecOps SOC-CMM V3.2 · Fase 5.0 (Assessment Experience)

Workspace: `C:\Projetos\QuickScan SOC-CMM\phase5` · Papel deste agente: engenheiro sênior, arquiteto e
auditor técnico sob o protocolo faseado do projeto. O proprietário/auditor é Flávio Costa.

## Baseline congelado (fonte da Fase 5)

```text
core:                quickscan_v32_audit_package_4807.zip
core SHA-256:        625079c462be7d44ffd69b1cd85f256382322bd0555ae4b548f21bf30ee5b89d
core MANIFEST:       74/74 obrigatório antes de qualquer trabalho
engine_v32.js:       9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
HTML congelado:      8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb (578152 bytes)
M41 canonical:       9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
runtimeToolVersion:  3.4.0-dev.4.8.0.7 (baseline)
```

A V3.2 Final Release (repo `oflavioc/quickscan-secops-soc-cmm-v32`, tag `v3.2.0`) é **imutável**.
A Fase 5 é uma nova linha de desenvolvimento a partir do core; nunca modifica release, assurance,
wrapper 4.9 ou control.4.

## Invariantes metodológicas — INEGOCIÁVEIS

1. **Engine byte-idêntico** salvo autorização explícita da spec corrente (a Fase 5.0 é de
   experiência de avaliação/UI; qualquer necessidade de tocar o engine é BLOCKER: parar e reportar).
2. **UNSET ≠ NONE** — não respondido nunca renderiza como score zero; o anti-pattern do heat map
   (UNSET como L0) é falha de design documentada.
3. **Sufficiency gate**: ≥10 respostas confirmadas e ≥2 por domínio antes de qualquer score.
   A UI nunca é dona da decisão de suficiência (GOV1/SUF0); moeda canônica de suficiência é
   UI-009A.
4. **Tecnologia, isoladamente, nunca aumenta o maturity score.**
5. **Target nunca deriva de produto**; alvo é declarado, estritamente > current confirmado.
6. **Refinamento operacional nunca afeta scoring.**
7. **Narrativa determinística e derivada de evidência.**
8. **Derivados nunca serializados como fonte de verdade**; sessão exporta somente inputs canônicos
   e o import recomputa tudo. missing ≠ null ≠ [] ≠ "unset" — completude de owners conforme
   SESSION_SCHEMA_V32.md §8.2.1.
9. **Superfícies 4.x congeladas** não são modificadas por trabalho de UI 5.0 sem autorização
   explícita da spec (fronteira print/render é superfície de governança distinta).
10. **PT-BR** em documentação/relatórios; nomes de código, funções, IDs e enums exatamente como no
    source. Baseline de idioma da UI: UI-033A.

## Governança de fase — obrigatória

- Especificação normativa: `specs/PHASE_5_0_REV_B.md`
  · SHA-256 `4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b`
  · promovida em 2026-08-19 · registro `docs_phase5/REV_B_PROMOTION_RECORD.md`.
  Auditoria independente da REV B: **PASS**, zero blockers (2026-08-19, Codex/OpenAI) —
  `docs_phase5/AUDITORIA_INDEPENDENTE_PHASE_5_0_REV_B.md`
  · SHA-256 `dfa8001844085ad1da09db1c858581e7b1bcb3283ed0c5dbf4155b1188c237c6`.
  Conteúdo auditado (identidade histórica da candidata): SHA-256
  `0f31900e8ad608c8a5825d9d5fa9e2d7a4fd3d68f8efbf23c7fc937a16950925`.
  **Phase 5.0 ABERTA em 2026-08-19** por ato do proprietário — registro
  `docs_phase5/REV_B_PHASE_OPENING_RECORD.md`. Implementação **AUTORIZADA**, restrita à change
  boundary da §29 e ao protocolo de microfases §5/§33. **Wave 1A NÃO INICIADA.**
  Módulos novos permitidos (§29.2, lista fechada): `ui_p50_shell_v32.js` · `ui_p50_suff_v32.js` ·
  `ui_p50_results_v32.js` · `ui_p50_v32.css` · `tests_p50_core.js` · `tests_p50_chromium.js` ·
  `fixtures_p50.js`. Edição limitada e nominal (§29.3): `build_v32_html.py` (só injeção),
  `package.json`/`package-lock.json` (só scripts P50 + `@axe-core/playwright` 4.13.0 exata).
  Todo o resto permanece protegido (§29.4); print/PDF fora de escopo (§29.6).
  Freeze continua vedado até auditoria independente explícita (§32).
  A `specs/PHASE_5_0_REV_A.md` permanece no repositório apenas como histórico (REPROVADA em
  auditoria independente, 2026-08-18); não é fonte normativa.
- Precedência: spec corrente → HANDOFF/START mais recente → source do baseline → testes/invariantes
  congelados → docs → estas instruções. Nunca combinar requisitos de versões diferentes.
- Ler a spec integralmente antes de editar; validar baseline; respeitar a change boundary; se uma
  correção exigir arquivo fora da boundary: PARAR, explicar, aguardar autorização.
- **Evidence-first**: todo PASS cita teste/gate/hash executado; o não executado é declarado como
  não executado; primeira execução com FAIL é registrada, nunca escondida.
- Gates novos: casos positivos canônicos + negativos + adversariais + regressão; oracle
  independente da implementação sempre que possível; não enfraquecer gate para passar.
- Numeração de gates da Fase 5: namespace próprio (não continuar S114+, RCE5+, CDx, FRx).
- **Nunca declarar fase concluída ou congelada** — só o auditor declara. Ao concluir a tarefa
  autorizada: PARAR e entregar relatório com PASS/FAIL e evidência. Não iniciar a fase seguinte.
- Suítes congeladas sempre verdes: `npm run test:all` + `npm run test:visual` + M41.
- Proibido sem autorização de fase: telemetry, rede, persistência de navegador, autosave, resume,
  assinatura, criptografia, cross-engine migration, schemaVersion 2.
- Nunca commitar dados reais de cliente, `*.session.json` reais, PDFs de cliente ou credenciais.
  Dados de assessments vivem em `D:\QuickscanData\clients`, fora deste clone.

## Comandos e ambiente

```text
npm ci --engine-strict          (Node ^22.22.2; jsdom 30.0.1; @playwright/test ^1.62.1)
npm run test:all                (build + engine + UI/UX/Target/Ref/Journey/Icons/Session + M41)
npm run test:visual             (Chromium; Linux canônico usa /opt/google/chrome/chrome;
                                 no Windows definir CHROME_PATH — determinismo de build é
                                 comprovado APENAS em Linux; builds oficiais via WSL/Linux)
npm run test:session            (heap 3072 MB já configurado)
python3 build_v32_html.py       (build determinístico; nunca editar o builder sem autorização)
```

Contagens verdes do baseline 4.8.0.7 (qualquer desvio = parar e reportar):
engine 105 · UI 19+25+11+23+26 · UX 56 · Target 30 · Ref 28 · Journey 31 · Icons 12 ·
Session 97/97 · M41 PASS · visual 67 passed / 0 failed / 37 skipped.
