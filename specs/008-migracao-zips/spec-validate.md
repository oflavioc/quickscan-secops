# spec-validate — 008-migracao-zips

> Fase 6 (T012) · executor: qa-engineer · somente leitura (validação ≠ correção).
> Método: cada exigência verificável da spec conferida na implementação REAL
> (source + execução de gate), nunca no relatório de quem implementou (R2).
> Data: 2026-08-28 · HEAD `9b7c6dd` (branch `feature/008-migracao-zips`).

## Evidência de execução usada (canônica)

- Pipeline completo local (`run.sh`): **14 PASS · 0 FAIL** (env-doctor, baseline,
  boundary, marker-lint, icons-check, build, lint-arch, state, tdd, mutation,
  m41, suites, suites-heavy, evidence-bridge).
- `baseline`: **191/191 pins conferem · 0 divergentes · 0 ausentes · 0 sem pin**.
- `evidence-bridge` (rede real, local): **0 FAIL · 0 WARN** — shape 7 acervos
  (4 diretorio + 3 arquivo) · **EB-1 409/409 · 0 divergência(s)** · índice 0 ·
  **ignore ativo 7/7** · v322 rastreado · **online 7/7** `sha256 confere`
  (incl. os 3 assets de `evidence-v32`).
- `suites`: 14 suítes · 0 problema(s) (engine 105/0 … p52layout 45/0).
- `suites-heavy`: **97 PASS · 0 FAIL** na árvore principal **e** em worktree
  efêmera SEM os 3 ZIPs no disco (checkout pós-migração).
- **CI (prova canônica ZB-7)**: workflow `verify` run **33189161042**
  (`workflow_dispatch` sobre `feature/008-migracao-zips` @ `9b7c6dd` — o push de
  `feature/*` não dispara `on: push`, restrito a develop/main): **success** —
  `verify: 14 PASS · 0 FAIL` em ubuntu, checkout sem os ZIPs, `fetch-depth: 0`,
  modo CI (parte online obrigatória) + compliance-audit verde.

## Score item a item

| # | Exigência (spec) | Verificação | Status |
|---|---|---|---|
| 1 | ZB-1 manifesto estendido (3 acervos-arquivo) + EB-1 sobre 409 entradas contra a âncora | execução: `409/409 … 0 divergência(s)`, exit 0; mutantes M-ZB1a/b mortos | ✅ conforme |
| 2 | ZB-2 generalização sem regressão 007 (domínio 7, coerências, 4 entradas byte-equivalentes) | execução shape OK; diff das 4 entradas 007 vs `develop` = **idênticas**; M-ZB2a/b + M1–M6 mortos | ✅ conforme |
| 3 | ZB-3 release `evidence-v32` com 3 assets diretos conferidos | online 7/7 `sha256 confere` (local rede real E CI); red 404 provado em `5bafacd` | ✅ conforme |
| 4 | ZB-4 desindexação + 3 entradas literais + contraprova | `git ls-files` = 0 ×3; `.gitignore:22-24` literais; check-ignore 7/7; v322 rastreado; bytes no disco (29 569 192 / 6 543 368 / 8 841 491) | ✅ conforme |
| 5 | ZB-5 oráculos S64/S74+S75/S113: fonte âncora→tmp→unzip, asserções intactas, FAIL nunca SKIP | source conferido (spawnSync array+Buffer+maxBuffer 64 MB, mkdtemp, aspas, `finally` rm, memoização, `cat-file -s`>0 p/ dependência cruzada S113); 97/0 com e sem ZIPs no disco; M-ZB5·i/ii/iii mortos | ✅ conforme |
| 6 | ZB-6 `unzip` no env-doctor (WARN nomeado, nunca silêncio/FAIL do stage) | `[OK] unzip presente`; PATH sem unzip → WARN nomeado exit 0 (M-ZB6a); mutante sem checagem detectado (M-ZB6b) | ✅ conforme |
| 7 | ZB-7 `expected_suites.json` byte-idêntico, 97 fixo, prova no CI | `git diff develop..HEAD` = 0 linhas; 97/0 local (2 árvores) + CI success | ✅ conforme |
| 8 | T1 tag `evidence-v32`, 1 release, 3 assets nomes originais | online: os 3 pacotes @ `evidence-v32` conferem | ✅ conforme |
| 9 | T2 âncora reutilizada `62590b5…`, UM `_meta.commit_ancora` | manifesto conferido; idêntico ao de `develop` | ✅ conforme |
| 10 | T3 shape `tipo` opcional default `diretorio`; acervo-arquivo com `path`/`pacote`/1 entrada/coerência | source `valida_shape` + execução + M-ZB2b | ✅ conforme |
| 11 | T4 EB-6 generalizado: ls-files vazio, entrada LITERAL, `check-ignore -q` direto, contraprova herdada | source `eb6()` + execução + M-ZB4a/b, M6a/b | ✅ conforme |
| 12 | T5 âncora lida do manifesto nos oráculos node (nunca hardcode/HEAD) | source: `ZIP_BRIDGE→_meta.commit_ancora` + validação 40-hex; nenhum SHA hardcodeado no arquivo | ✅ conforme |
| 13 | T6 política do WARN (quem reprova é `suites-heavy`, contagem fixa) | env-doctor exit 0 com WARN; suíte FAIL provado no red e em M-ZB5 | ✅ conforme |
| 14 | Contrato §Contratos (shape JSON do manifesto) | inspeção do `evidence_bridge.json` real — campos exatos | ✅ conforme |
| 15 | Repin ÚNICO no mesmo PR (R8 §1) capturando os arquivos mudados | commit `1465258`; `baseline` 191/191 verde no head | ✅ conforme |
| 16 | Não-mudam: `expected_suites.json`, `pins.json→declared`, `boundary.json`, `verify.yml`, `MANIFEST.sha256`, `VISUAL_GATES_V32.md`, `CHANGELOG_v32.md`, `session_roundtrip_report.md` | `git diff develop..HEAD` = 0 linhas em todos; `declared` com as 2 chaves originais | ✅ conforme |
| 17 | Red R3 provado e commitado ANTES da implementação | `5bafacd` (ZB-3 404 ×3 + ZB-4 + M-ZB5 red 94/3 + M-ZB6 silêncio); planning-state `red.status: proven` | ✅ conforme |
| 18 | `pipeline.yaml` desc do stage menciona os 7 acervos (decisão do plano) | linha da desc conferida | ✅ conforme |
| 19 | `design-decisions.md`: linha "Evidência binária versionada" — "os 3 ZIPs **deixam de ser** 'migração de escopo posterior' — **migrados** pela 008; trilha preservada" | a linha atual diz "**estão em migração**" e afirma, sob "Estado nesta escrita (2026-08-27, wave 4)", que o release **não foi publicado**, os ZIPs **não foram desindexados** e os oráculos **ainda leem o arquivo local** — as três afirmações são **falsas no HEAD atual** (T006/T007/T010/T011 aterrissaram depois da escrita) | ❌ **implementação-divergente** |
| 20 | `evidence-intake.md`: abertura — "os ZIPs **saíram do índice**; gates S64/S74/S113 **leem da âncora**" | mesma prosa de wave 4 ("ainda não foi publicado… ainda leem o arquivo local") — desatualizada em relação ao próprio HEAD | ❌ **implementação-divergente** |
| 21 | Sequência de commits auditável do tasks.md | `314f466→fcbe5e5→5bafacd→7cd3182∥dbe5b18∥1eefdb6→4bd22c1→1465258`; head verde | ✅ conforme |
| 22 | Matriz de mutantes: M-ZB1…M-ZB6 + re-execução M1–M6 + linha de transferência O1 | `matriz-gate-mutante.md` desta demanda — 17/17 execuções mortas, 3 blocos, linha O1 registrada | ✅ conforme |
| 23 | M-ZB5 conforme redigido ("SHA de commit sem os ZIPs") | **não construtível** — ZIPs no commit raiz `e5ccd42`; veredito do QA registrado na matriz: forma canônica = SHA 40-hex inalcançável (morto 94/3) | ⚠️ **spec-errada (formulação)** — resolvida por veredito registrado, sem gate enfraquecido; ciência do PO/usuário no portão T015 |
| 24 | Fora-de-escopo respeitado (histórico não emagrece; releases 007 intactos; nenhuma âncora nova; nenhum stage novo) | pack intacto (blobs seguem no histórico — é o que sustenta ZB-1/ZB-5); releases 007 conferem online; 1 âncora; `pipeline.yaml` sem stage novo | ✅ conforme |

## Score

**22/24 conformes → 91,7%** (2 gaps classe **implementação-divergente**, mesmo
tipo e causa raiz — prosa de estado escrita na wave 4 e tornada obsoleta pelas
waves 5–6; 1 item ⚠️ spec-errada já resolvido por veredito registrado, não conta
como gap de implementação).

## Gaps — classificação e rota (iteração 1 de 2)

- **G1** (`design-decisions.md`, item 19) e **G2** (`evidence-intake.md`, item
  20): **implementação-divergente** — divergência pesa mais que ausência: o
  leitor das rules é informado de que a migração está pendente quando o HEAD já
  a consumou. A própria linha prometia registro da consumação ao fechar a
  demanda; o fechamento é agora. Correção: atualizar as duas prosas para o
  estado consumado (release publicado + conferido, ZIPs desindexados, oráculos
  lendo da âncora, repin feito), com trilha. **Dono: `doc-writer`** (arquivos
  da W5c/R11) — ambos pinados ⇒ **repin no mesmo PR** (`gen_pins.py`,
  `build-engineer` ou rito equivalente), idealmente junto do commit de T014.
  Nenhum gate é tocado; nenhuma asserção muda.

Após a correção: re-executar `baseline` (repin) e re-conferir os itens 19–20
(iteração 2, se necessária). Demais 22 itens não são afetados pela correção.
