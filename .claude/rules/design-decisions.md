# R13 — Decisões de projeto que não são defeitos

**Não reportar como achado, não "corrigir de passagem".** Reapresentar decisão
confirmada como defeito gera ruído e desgasta a confiança nos achados reais.

## Confirmadas (com a fonte da confirmação)

| Tema | Decisão |
|---|---|
| **MANIFEST.sha256 divergente** | Legado congelado (classe `legacy`), substituído por `pins.json` como fonte de identidade desde a Onda 0. As divergências são conhecidas e documentadas; reconciliação histórica é a Onda 4. Não é um baseline quebrado — é um artefato aposentado aguardando arquivamento formal. |
| **Evidência binária (~103 MB) versionada** | Herança das fases 5.0–5.2, pinada pelos manifestos de fase. Decisão original — permanecer até a migração desenhada (Onda 4/R11) — registrada aqui e superada — migração executada pela demanda 007 (PR #20, 2026-08-25) (`specs/007-migracao-evidencia/`): os 4 acervos (`evidence_p50`/`evidence_p51`/`evidence_p52`/`evidence_unset`, 406 arquivos) migraram para Releases nominais (`evidence-p50`/`evidence-p51`/`evidence-p52`/`evidence-unset`) em `oflavioc/quickscan-secops`, com verificabilidade preservada por manifesto-ponte pinado (`.claude/verify/evidence_bridge.json`) e pelo gate `evidence-bridge`. `evidence_v322` (gate V322-DOC3) e os 3 ZIPs da raiz (gates S64/S74/S113, migração de escopo posterior) ficam versionados. Trilha: decisão original permanece citável acima; a consumação plena (publicação + desindexação + repin) está registrada no relatório final da demanda 007 (`relatorio-final.md`). Evidência NOVA segue R11. |
| **Suítes visuais fora do agregado local** | KI-3: exigem Chromium; execução canônica é o job `visual` do CI (em calibração) e o rito manual do proprietário. O `env-doctor` reporta a ausência — isso é o desenho, não uma lacuna. |
| **Exceção UG8 no oráculo do p50_core** | Errata test-only autorizada pelo proprietário na microfase 5.0.4, registrada em comentário no próprio gate. |
| **Fases 5.0–5.2 seladas sob o processo antigo** | Os registros históricos em `docs_phase5/` não são retro-ajustados pela estrutura nova; valem como foram selados. A estrutura governa DAQUI para frente. |
| **planning-state/project-memory fora do registry de pins** | Estado de processo muda a cada fase por desenho: validado pelo stage `state`, trilha é o git — pinado nunca (commit `b7a10f6`; fix-finding anexo em `specs/003-marcador-duplicado/`). Fonte: ratificação nominal do usuário no portão da demanda 003, 2026-08-25. |

## Candidatas — observadas no exame, pendentes de confirmação do PO/proprietário

Comportamentos do produto que *parecem* anomalia mas aparentam ser desenho
metodológico. Até confirmação, **não são achados nem defeitos** — são perguntas:

- Limiar global de suficiência (≥10) é matematicamente redundante com ≥2/domínio
  (5 domínios × 2 = 10).
- Severidade uniforme no MAP: todas as 15 perguntas seguem `[2,1,0,0]` por nível.
- `SCORES = [0, 1.7, 3.3, 5]` combinado às bandas de `stageOf` faz nível 1 uniforme
  ler como "Managed", nunca "Initial".
- `setTarget` aceita alvo igual ao atual; `revalidateTargets` o remove depois
  (assimetria criação/revalidação).

Confirmada qualquer uma como intencional → sobe para a tabela acima com a fonte.
