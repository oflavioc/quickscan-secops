# spec-validate — 007-migracao-evidencia

> Fase 6 (T012) · executor: qa-engineer · somente leitura + execução de gates.
> Base: `spec.md` aprovada × implementação real no HEAD `d82c89d` (branch
> `feature/007-migracao-evidencia`). Toda conferência abaixo é por execução
> própria ou leitura de fonte (R2 — nunca por relatório de quem implementou).

## Veredito

**Score de conformidade: 24/24 (100%) · 0 gap.**
Classes de gap (spec-errada / implementação-divergente / faltando): nenhuma
ocorrência. Pendências nomeadas (não são gaps — são a prova canônica que só o
CI pode dar e etapas de outras tarefas da wave): ver §Pendências.

## Itens verificados

| # | Exigência da spec | Conferência (executada por mim) | Veredito |
|---|---|---|---|
| 1 | Inventário: 4 acervos, 82/20/300/4 = 406 arquivos, re-medidos no commit-âncora | `git ls-tree -r <âncora> -- docs_phase5/evidence_{p50,p51,p52,unset}` → 82/20/300/4 = 406; manifesto: 82/20/300/4 = 406 | conforme |
| 2 | Manifesto-ponte `.claude/verify/evidence_bridge.json` rastreado e **pinado** no mesmo PR (R8 §1) | pin `0ef5b5acf9e60452…` presente em `pins.json` (repin `d82c89d`) | conforme |
| 3 | Gate `.claude/verify/check_evidence_bridge.py` rastreado e pinado | pin `4fcac67b79f64072…` presente | conforme |
| 4 | Stage `evidence-bridge` no `pipeline.yaml` (`parallel: false` · `mutates: false` · `heavy: true`), checagem no pipeline e nunca em prompt (R10 §9) | lido em `pipeline.yaml:95-100`; executou no pipeline completo (14 PASS) | conforme |
| 5 | Pacotes `.tar` nunca commitados; nenhum binário novo (R11 §1) | `git ls-files '*.tar'` → vazio | conforme |
| 6 | EB-1: manifesto completo e fiel, oráculo independente (`ls-tree`/blobs da âncora) | execução: `manifesto-ponte: 406/406 arquivos conferidos contra o commit-âncora 62590b5… · 0 divergência(s)`; mutante M1 morto | conforme |
| 7 | EB-2: `sha256_pacote` por acervo, download + hash em streaming == registrado | execução (modo CI, rede real): `sha256 confere` 4/4; mutante M2 morto | conforme |
| 8 | EB-3: pacote ausente → FAIL nomeando pacote | mutante M3: `pacote AUSENTE: evidence_unset_inexistente.tar @ evidence-unset (HTTP 404)`, exit 1; red histórico commitado (`9adf41d`, 4×404 reais) | conforme |
| 9 | EB-4: pacote adulterado → FAIL nomeando pacote e ambos os hashes | mutante M4: `pacote ADULTERADO: … esperado <h> obtido <h>`, exit 1 | conforme |
| 10 | EB-5: local sem rede → exit 0 + WARN nomeado por pacote; `GITHUB_ACTIONS` presente → exit ≠ 0; nunca SKIP silencioso | execução nos DOIS modos com rede bloqueada: local exit 0 + `NÃO EXECUTADO — sem rede: evidence-p50, …-p51, …-p52, …-unset`; CI exit 1; mutantes M5a/M5b mortos pelo caso adversarial | conforme |
| 11 | EB-6: `ls-files` vazio ×4 · 4 entradas no `.gitignore` + `check-ignore` · contraprova `evidence_v322` rastreado | execução: `índice: 0 arquivo(s) … · ignore ativo 4/4 · evidence_v322 rastreado` (v322 = 54 arquivos); mutantes M6a/M6b mortos | conforme |
| 12 | EB-7: regressão congelada intacta, contagens == `expected_suites.json`, tolerância a acervo ausente | `suites`+`suites-heavy` PASS no pipeline; contagens por suíte re-executadas (§EB-7 abaixo); guarda de `tests_p50_mutants.js` confirmada por execução com `evidence_p50` ausente (borda 5) | conforme |
| 13 | Shape do manifesto == contrato §Contratos (emenda A2) | gate: `shape: 4 acervos · commit_ancora 62590b5… · repo oflavioc/quickscan-secops`; leitura do JSON: `_meta` completo, 4 chaves com `release_tag`/`pacote`/`sha256_pacote`/`arquivos` | conforme |
| 14 | Commit-âncora = SHA imutável 40 hex no `_meta`, nunca HEAD/branch (R10 §5) | `commit_ancora = 62590b5927496a61ab31dd476d46b03624546560` = commit de T001; `git cat-file -t` → `commit` | conforme |
| 15 | Ferramenta geradora recusa `HEAD`/branch/SHA curto; pacotes em diretório efêmero; manifesto LF/UTF-8 | leitura de `gen_evidence_bridge.py` (regex `^[0-9a-f]{40}$`, recusa nomeada; `newline="\n"`) | conforme |
| 16 | Publicação: 4 releases nominais, 1 asset cada, conferência pós-upload | provada pelo green EB-2 por execução própria (4/4 `sha256 confere` contra o manifesto) | conforme |
| 17 | Histórico intacto: blobs alcançáveis no commit-âncora | EB-1 leu os 406 blobs da âncora via `cat-file --batch`; pack não emagrece (aviso é do T014) | conforme |
| 18 | `expected_suites.json` byte-idêntico (nenhuma suíte nova) | `git diff --quiet 967293c..HEAD` → inalterado | conforme |
| 19 | `.github/workflows/verify.yml` inalterado | idem → inalterado | conforme |
| 20 | `boundary.json` inalterado; nenhuma expansão de boundary | idem → inalterado; proteção do manifesto é o pin (R8) | conforme |
| 21 | `pins.json → declared` intacto | comparado contra `967293c`: `declared` idêntico (176→184 pins de `files`: +3 verify novos, +5 specs/007) | conforme |
| 22 | `design-decisions.md` e `evidence-intake.md` atualizados no mesmo PR | lidos: linha "Evidência binária versionada" superada por cumprimento com trilha; abertura da R11 descreve a migração em execução | conforme |
| 23 | Red provado e commitado antes da implementação; autor do gate ≠ implementador (R3) | commit `9adf41d` (test(007): red…); `planning-state.red.status = proven`; gate do qa-engineer, publicação/desindexação do build-engineer | conforme |
| 24 | Nenhum byte de produto tocado; namespace `EB-*` novo | diff da demanda (`967293c..d82c89d`): só processo/doc (10 arquivos) + 406 saídas de índice; nenhum módulo/engine/HTML | conforme |

## EB-7 — contagens re-executadas (registro literal)

`bash .claude/verify/run.sh` (completo, sem `--light`): **14 PASS · 0 FAIL**, exit 0
(env-doctor, baseline, boundary, marker-lint, icons-check, build, lint-arch,
state, tdd, mutation, m41, suites, suites-heavy, evidence-bridge).

`check_suites.py` (por suíte, == `expected_suites.json`): engine 105 · ui31 19 ·
ui32 25 · ui33 11 · ui332 23 · ui333 26 · ux41 56 · target 30 · ref 28 ·
journey 31 · icons46 12 · unset 12 (intervalo [12,13]) · p50core 64 ·
p52layout 45 — todas 0 FAIL. `--heavy`: session 97 · 0 FAIL.

`GITHUB_ACTIONS=1 python .claude/verify/check_evidence_bridge.py` (execução
própria, rede real): `evidence-bridge: 0 FAIL · 0 WARN`, exit 0 — 406/406
arquivos, 4/4 pacotes.

Borda 5 (guarda com acervo ausente): `docs_phase5/evidence_p50` renomeado para
fora → `MUT_ONLY=M1 node tests_p50_mutants.js` → `acervo sob guarda: 0
artefato(s)`, campanha dirigida `1/1 mutantes detectados`, restauração dos 4
fontes OK, `0/0 byte-idênticos · zero arquivo escrito`. Exit 1 diagnosticado
(R2 §3): `tests_p50_mutants.js:846` compara com o inventário COMPLETO (53) —
semântica da campanha parcial, invariante à presença do acervo (experimento de
controle COM o diretório presente: mesmo exit 1, mesma linha `1/1`). Diretório
restaurado: 82 arquivos, `git status --porcelain` vazio.

## Pendências (nomeadas, não são gaps)

- **EB-7 em clone limpo**: a prova canônica é o CI Linux (checkout pós-migração
  sem os acervos + `fetch-depth: 0`) — registrar como item de conferência do PR.
  A simulação local (worktree efêmera sem acervos + renomeio do `evidence_p50`)
  foi executada e está verde, mas não substitui o CI.
- **T014/T015**: relatório final com os dois avisos obrigatórios (pack não
  emagrece; imutabilidade de release é convenção+gate) e aceite de intenção do
  PO — fora do escopo deste artefato.
