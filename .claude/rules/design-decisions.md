# R13 — Decisões de projeto que não são defeitos

**Não reportar como achado, não "corrigir de passagem".** Reapresentar decisão
confirmada como defeito gera ruído e desgasta a confiança nos achados reais.

## Confirmadas (com a fonte da confirmação)

| Tema | Decisão |
|---|---|
| **MANIFEST.sha256 divergente** | Legado congelado (classe `legacy`), substituído por `pins.json` como fonte de identidade desde a Onda 0. As divergências são conhecidas e documentadas; reconciliação histórica é a Onda 4. Não é um baseline quebrado — é um artefato aposentado aguardando arquivamento formal. |
| **Evidência binária (~103 MB) versionada** | Herança das fases 5.0–5.2, pinada pelos manifestos de fase. Decisão original — permanecer até a migração desenhada (Onda 4/R11) — registrada aqui e superada — migração dos 4 acervos executada pela demanda 007 (PR #20, 2026-08-25) (`specs/007-migracao-evidencia/`): `evidence_p50`/`evidence_p51`/`evidence_p52`/`evidence_unset` (406 arquivos) migraram para Releases nominais em `oflavioc/quickscan-secops`, com verificabilidade preservada por manifesto-ponte pinado (`.claude/verify/evidence_bridge.json`) e pelo gate `evidence-bridge`. `evidence_v322` (gate V322-DOC3) fica versionado por decisão distinta. Os 3 ZIPs da raiz (gates S64/S74/S113) — que a 007 registrou como "migração de escopo posterior" — **foram migrados pela demanda 008** (PR #21, mesclado 2026-08-28) (`specs/008-migracao-zips/`): manifesto-ponte estendido para acervo-arquivo (`evidence-47`/`evidence-48`/`evidence-487`, mesma âncora `62590b5927496a61ab31dd476d46b03624546560`, commits `314f466`/`fcbe5e5`), release **`evidence-v32`** publicado em `oflavioc/quickscan-secops` em 2026-08-27 com os 3 assets diretos (conferência pós-download ×3 + digest da API do GitHub — https://github.com/oflavioc/quickscan-secops/releases/tag/evidence-v32), os 3 ZIPs desindexados com contraprova (`4bd22c1`), os oráculos S64/S74+S75/S113 refatorados para lerem o blob da âncora — asserções intactas, só a fonte muda (`7cd3182`) — e três execuções de `gen_pins.py` fechando o PR: `1465258` (T011, o previsto), `5db4639` (wave 6 — matriz de mutantes, spec-validate e relatório final nasceram depois do repin) e `f8b59e1` (iteração 2 do spec-validate); o `tasks.md` previa um repin único. Trilha: decisão original permanece citável acima; a consumação da 007 está registrada em `relatorio-final.md`; a consumação da 008 está registrada no relatório final próprio da demanda (`specs/008-migracao-zips/relatorio-final.md`). Evidência NOVA segue R11. |
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
- **Cláusula defensiva inalcançável por construção** — disposição do
  `product-owner` na demanda 010, na forma dada por ele: *cláusula defensiva
  inalcançável por construção, declarada, sem mutante — **não reportar como código
  morto***. Três instâncias vivas, todas baratas e todas capazes apenas de deixar o
  produto mais conservador:
  - a cláusula **A5** do predicado de arbitragem — `ui_v32.js:679`, documentada
    como defensiva em `:662-666` (errata **E1**,
    `specs/010-recomendacao-sem-vao/spec.md:74-82`);
  - `if (temCandidato) return "";` de `tgtValidateHTML` — `ui_target_v32.js:341`
    (errata **E17**, `specs/010-recomendacao-sem-vao/spec.md:243-255`);
  - o **4º parâmetro** de `prCards` (`afirmaPreservacao`) — `ui_v32.js:833`, lido
    em `:836` e nunca passado truthy pelos quatro sítios de chamada (`:1275`,
    `:1278`, `:1282`, `:1284`), por desenho de C13.

  A durabilidade **não é sorte de catálogo**: está ancorada em `engine_v32.js:696`
  + `validateConfigV32` — capability com `questionIds` não pode ser
  `assessmentCoverage: "none"` —, que é a metade estática da prova de
  inalcançabilidade. Mutante que remova qualquer uma delas é **equivalente por
  construção** e entra em `dividas_declaradas` como *"inalcançável, provado"*,
  nunca como par vazio na coluna de mutantes. O que **é** achado, e vive no
  backlog, é o inverso: gate que promete asserção e entrega tautologia (`EA-20`).

Confirmada qualquer uma como intencional → sobe para a tabela acima com a fonte.
