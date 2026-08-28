# Relatório final — 008-migração-zips

> Fase 6 (T014) · dono: doc-writer · registro do que os gates decidiram, com os
> números que eles emitiram. **Este documento não decide PASS/FAIL** — quem
> decide é o gate citado em cada linha. Fontes: `refinement.md`, `spec.md`,
> `plan.md`, `tasks.md`, `spec-validate.md`, `matriz-gate-mutante.md` (todos em
> `specs/008-migracao-zips/`), o planning-state
> (`.claude/project-memory/planning-state/008-migracao-zips.json`),
> `.claude/verify/evidence_bridge.json` e o `git log` da branch
> `feature/008-migracao-zips` (âncora `62590b5927496a61ab31dd476d46b03624546560`
> … HEAD `1c26861`).

## Objetivo cumprido

Os 3 ZIPs de evidência da raiz (`visual_print_evidence_47.zip`, `_48.zip`,
`_487.zip` — pacotes de auditoria da era V3.2) saíram do índice git e foram
publicados como um release único nominal (`evidence-v32`) em
`oflavioc/quickscan-secops`, encerrando a "migração de escopo posterior" que a
demanda 007 havia declarado e deferido para esta demanda. O manifesto-ponte
(`.claude/verify/evidence_bridge.json`) e o gate `evidence-bridge` foram
generalizados para acervo-arquivo, e os oráculos vivos de sessão
(S64/S74+S75/S113 em `tests_session_m48.js`) foram refatorados para lerem o
blob do commit-âncora em vez do arquivo local — asserções semanticamente
intactas (régua INV-8), só a fonte dos bytes muda. `evidence_v322` fica
versionado por decisão distinta, fora desta demanda (ver §O que não migrou).

## Cadeia da migração

| Passo | Registro |
|---|---|
| Commit-âncora (SHA imutável, 40 hex, reutilizado da 007 — decisão T2) | `62590b5927496a61ab31dd476d46b03624546560` |
| Ferramenta generalizada (`gen_evidence_bridge.py`, `tipo: "arquivo"` + conferência TRIPLA O2) | commit `314f466` (T001) |
| Manifesto-ponte estendido (7 acervos: 4 diretório + 3 arquivo, 409 arquivos) | commit `fcbe5e5` (T002) — verificado nesta escrita: `evidence_bridge.json → acervos` contém `evidence-47`/`evidence-48`/`evidence-487`, todos `release_tag: "evidence-v32"` |
| Gate `evidence-bridge` generalizado (shape T3, EB-1 sobre 409, EB-6 generalizado T4) | commit `fcbe5e5` (T002/T003 no mesmo commit, nota¹ do tasks.md) |
| Red provado e commitado (R3 §4) | `5bafacd` — ZB-3 "pacote AUSENTE" ×3 (404 real, release inexistente) + ZB-4/EB-6 FAIL (3 ZIPs no índice, `.gitignore` sem as entradas) + M-ZB5 red (suíte de sessão FAIL ×3 em worktree sem os ZIPs: S64/S74+S75 `false`, S113 `throw`) + M-ZB6 red (silêncio do env-doctor sobre `unzip`) |
| Release **`evidence-v32`** publicado (3 assets diretos, nomes originais) | `oflavioc/quickscan-secops`, 2026-08-27, autorização do proprietário no chat ("Pode") — https://github.com/oflavioc/quickscan-secops/releases/tag/evidence-v32 (URL verificada nesta escrita: HTTP 200); conferência pós-upload (download de volta × manifesto ×3) + digest da API do GitHub como quarta fonte, ANTES de declarar publicado (T006) |
| SHA-256 dos 3 pacotes (registrados no manifesto-ponte) | `visual_print_evidence_47.zip` = `b89ea12a0c69…` · `_48.zip` = `24736aeec12f…` · `_487.zip` = `4f822d213c38…` (mesmos hashes do `MANIFEST.sha256` legado, linhas 39/40/87 — conferência TRIPLA verde ×3 na geração, O2) |
| Oráculos de sessão refatorados (fonte âncora→tmp→`unzip`, técnica O4) | commit `7cd3182` (T007, `core-engineer`) — verificado nesta escrita: `tests_session_m48.js` lê `_meta.commit_ancora`, usa `spawnSync` com args em array e stdout Buffer, `mkdtempSync`, remoção em `finally`; suíte **97/0** na árvore normal E em worktree efêmera sem os ZIPs |
| `unzip` declarado no env-doctor (WARN nomeado — T6) | commit `dbe5b18` (T008, `build-engineer`) — verificado nesta escrita: `[OK] unzip presente` / WARN nomeando os 3 gates que reprovam sem ele |
| Desindexação (`git rm --cached` ×3 + `.gitignore` literal ×3 + desc do stage) | commit `4bd22c1` (T010) — verificado nesta escrita: `git ls-files` vazio para os 3 ZIPs; `.gitignore:22-24` com as 3 entradas literais; contraprova `docs_phase5/evidence_v322/` permanece rastreado; bytes seguem no working tree |
| Registry de pins | repin único (R8 §1, mesmo PR) — commit `1465258` (T011): **191 pins**, `baseline` 191/191 · 0 divergente · 0 sem pin |
| Documentação de estado (R11/R13) | wave 4: commit `1eefdb6` (T009, prosa "em migração" — correta no momento da escrita, antes de T006/T007/T010/T011 aterrissarem); correção pós-consumação: commit `1c26861` (spec-validate G1/G2 — prosa atualizada para o estado consumado, acréscimo sobre a anterior, nenhuma trilha apagada) |
| Pipeline completo (`run.sh`, sem `--light`) | **14 PASS · 0 FAIL** (env-doctor, baseline, boundary, marker-lint, icons-check, build, lint-arch, state, tdd, mutation, m41, suites, suites-heavy, evidence-bridge) |
| `evidence-bridge` (rede real) | **0 FAIL · 0 WARN** — shape 7 acervos · EB-1 **409/409 · 0 divergência(s)** · índice 0 · ignore ativo 7/7 · v322 rastreado · **online 7/7** `sha256 confere` (incl. os 3 assets de `evidence-v32`) |
| `suites-heavy` | **97 PASS · 0 FAIL**, na árvore principal E em worktree efêmera sem os 3 ZIPs; `expected_suites.json` **byte-idêntico** (`git diff develop..HEAD` = 0 linhas) |
| Prova canônica no CI (ZB-7) | workflow `verify`, run **33189161042** (`workflow_dispatch` sobre `feature/008-migracao-zips` @ `9b7c6dd`) — **success**: 14 PASS · 0 FAIL em ubuntu, checkout pós-migração (sem os ZIPs no disco), `fetch-depth: 0`, modo CI (parte online obrigatória) |
| `spec-validate` (conformidade spec × implementação) | **22/24 (91,7%)** na primeira iteração (`spec-validate.md`, executor `qa-engineer`, HEAD `9b7c6dd`) — 2 gaps classe implementação-divergente (itens 19/20, prosa de R11/R13 desatualizada) corrigidos nesta wave (commit `1c26861`, ver linha acima); 1 item ⚠️ spec-errada (formulação) já resolvido por veredito registrado (ver §Ponto com nome próprio abaixo), não conta como gap. **Reconferência dos itens 19–20 (iteração 2) e repin subsequente são dependência do `qa-engineer`/`build-engineer`** — este relatório não afirma 24/24 porque a segunda iteração ainda não foi executada por quem audita |
| Campanha de mutantes (M-ZB1…M-ZB6 + re-execução integral M1–M6 da 007) | **17/17 execuções mortas, 0 sobreviventes** (`matriz-gate-mutante.md`, modalidade manual em worktree efêmera; árvore intacta antes×depois de cada mutante) |

## Pontos com nome próprio (não diluídos)

### Transferência declarada de garantia (observação O1 do parecer do PO)

A asserção viva de S113 "o arquivo de evidência anterior (`_48.zip`) permanece
**publicado** e íntegro" (pré-refatoração) tinha duas metades: *presença
local* e *publicação*. Pós-migração, a metade "publicado" **transferiu-se,
declarada e nomeada, para a parte online do `evidence-bridge`** (ZB-3/EB-2/EB-4
sobre os assets de `evidence-v32`, política EB-5 herdada da 007 sem mudança);
S113 retém a metade blob-local (`git cat-file -s <âncora>:visual_print_evidence_48.zip`
> 0 — presença + não-vazio na âncora). É **transferência declarada, não
afrouxamento de R10 §1**: nenhuma verificação deixou de existir — mudou de
gate, com rastro registrado no Bloco 3 de `matriz-gate-mutante.md`, coberta
pelo mutante **M-ZB3** (asset ausente → FAIL do stage, executado no red
`5bafacd`: 404 real ×3).

### M-ZB5 — formulação da spec não construtível (classe spec-errada)

O mutante como redigido na spec aprovada ("`_meta.commit_ancora` trocado por
**SHA de commit sem os ZIPs**") **não é construtível neste repositório**: os 3
ZIPs entram no commit raiz `e5ccd42`, logo todo commit alcançável os contém —
apontar a âncora para qualquer commit real dá 97/0 por vacuidade, não por
falha do oráculo. Achado do `core-engineer` na T007, confirmado pelo
`qa-engineer`. **Forma canônica registrada** (`matriz-gate-mutante.md`,
"Veredito do QA"): SHA 40-hex sintaticamente válido e inalcançável
(M-ZB5·i, mata 94/3), com M-ZB5·ii (âncora adulterada, 39-hex) e M-ZB5·iii
(ZIP truncado no tmp) como formas complementares. A spec aprovada **não foi
reescrita retroativamente** (R13) — este relatório leva o veredito à ciência
do PO/proprietário no portão de aceite (T015); nenhum gate foi enfraquecido.

## Os dois avisos obrigatórios ao proprietário (herdados da demanda 007)

1. **O pack/histórico git NÃO emagrece com esta demanda.** `git rm --cached`
   remove os 3 ZIPs do **índice**, não dos **blobs** — o histórico segue
   carregando-os (é exatamente essa alcançabilidade que sustenta os oráculos
   via `git show <âncora>:<path>`). Reduzir o tamanho do pack exigiria um
   rewrite de histórico ou um fresh-start de repositório — **decisão separada
   e exclusiva do proprietário**, fora do escopo desta demanda.
2. **A imutabilidade do release `evidence-v32` publicado é convenção + gate,
   não propriedade da plataforma.** O GitHub permite substituir o asset de um
   release existente sem aviso — a garantia real vem do par EB-2/EB-4 do gate
   `evidence-bridge`: o SHA-256 de cada pacote está pinado no manifesto-ponte,
   e bytes divergentes nos assets baixados (mesmo nome, conteúdo trocado) fazem
   o gate falhar nomeando o pacote e os dois hashes.

## Pendência nomeada para o portão de aceite (T015)

- **Reconferência dos itens 19–20 do `spec-validate.md` (iteração 2) e o repin
  subsequente sobre os arquivos corrigidos nesta wave** (`design-decisions.md`,
  `evidence-intake.md`, commit `1c26861`) — ação do `qa-engineer` (reconferir)
  e do `build-engineer` (`gen_pins.py`, rito R8 §1). Sem isso, o `baseline`
  fica com pin desatualizado para os dois arquivos até o próximo repin.
- **Veredito do M-ZB5 (classe spec-errada de formulação)** — ciência do
  PO/proprietário, sem necessidade de reabrir a spec (R13); ver §Pontos com
  nome próprio acima.

## Proposta registrada fora da demanda

- **Entrada permanente em `mutation_map.json`** para o gate `evidence-bridge`
  (inventário ampliado: M1–M6 ∪ M-ZB1…M-ZB6, alvo adicional
  `tests_session_m48.js`) — mantida a proposta da 007, não executada aqui
  (arquivo não editado). Pré-requisito segue sendo o harness scriptado da
  Onda 3 (KI-2). Até lá, o rastro canônico é `matriz-gate-mutante.md` desta
  demanda + a da 007; re-execução manual obrigatória quando qualquer alvo
  mudar (R3 §5).

## O que não migrou por desenho

| Acervo | Fica porque | Gate/referência que exige |
|---|---|---|
| `docs_phase5/evidence_v322/` (54 arquivos) | Referenciado por `README.md:13` como imagem local de abertura | `V322-DOC3` (`tests_p52_layout.js:1688-1709`) |
| Os 4 acervos/releases da demanda 007 (`evidence-p50/p51/p52/unset`) | Fora de escopo desta demanda — nenhuma mudança de conteúdo, release ou hash (spec §Fora de escopo, item herdado da 007 §Fora de escopo) | `evidence-bridge` (EB-1…EB-7, ZB-2 prova byte-equivalência) |

## Fontes citadas

`specs/008-migracao-zips/{refinement,spec,plan,tasks,spec-validate,matriz-gate-mutante}.md`;
`.claude/project-memory/planning-state/008-migracao-zips.json`;
`.claude/verify/evidence_bridge.json`; commits `314f466` (T001, ferramenta),
`fcbe5e5` (T002/T003, manifesto+gate), `5bafacd` (T004/T005, red),
`7cd3182` (T007, oráculos), `dbe5b18` (T008, env-doctor), `1eefdb6` (T009,
prosa da wave 4), `4bd22c1` (T010, desindexação), `1465258` (T011, repin
único), `e700452` (T012/T013, validação e mutantes), `1c26861` (correção
G1/G2 desta wave, HEAD desta demanda no momento deste relatório).
