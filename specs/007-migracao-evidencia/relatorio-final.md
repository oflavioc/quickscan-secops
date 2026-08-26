# Relatório final — 007-migração-evidência

> Fase 6 (T014) · dono: doc-writer · registro do que os gates decidiram, com os
> números que eles emitiram. **Este documento não decide PASS/FAIL** — quem
> decide é o gate citado em cada linha. Fontes: `refinement.md`, `spec.md`,
> `plan.md`, `tasks.md`, `spec-validate.md`, `matriz-gate-mutante.md`,
> `parecer-po-fase1.md` (todos em `specs/007-migracao-evidencia/`), o
> planning-state (`.claude/project-memory/planning-state/007-migracao-evidencia.json`),
> `.claude/verify/evidence_bridge.json` e o `git log` da branch
> `feature/007-migracao-evidencia` (âncora `62590b5` … HEAD `29a9671`).

## Objetivo cumprido

Os quatro acervos de evidência legados (`docs_phase5/evidence_p50`,
`evidence_p51`, `evidence_p52`, `evidence_unset`) saíram do índice git e foram
publicados como GitHub Releases nominais em `oflavioc/quickscan-secops`, com a
verificabilidade preservada por um manifesto-ponte pinado
(`.claude/verify/evidence_bridge.json`) e por um gate contínuo
(`evidence-bridge`, stage no `pipeline.yaml`). `evidence_v322` e os 3 ZIPs da
raiz ficam — por desenho, fora desta demanda (ver §O que não migrou).

## Cadeia da migração

| Passo | Registro |
|---|---|
| Commit-âncora (SHA imutável, 40 hex) | `62590b5927496a61ab31dd476d46b03624546560` (commit `chore(007): ferramenta gen_evidence_bridge.py`, T001) |
| Inventário congelado no manifesto-ponte | 406 arquivos = 82 (`evidence-p50`) + 20 (`evidence-p51`) + 300 (`evidence-p52`) + 4 (`evidence-unset`), re-medidos por `git ls-tree -r` na âncora e conferidos byte a byte contra o manifesto (spec-validate item 1) |
| Releases nominais publicados (T007, `oflavioc/quickscan-secops`) | `evidence-p50` — https://github.com/oflavioc/quickscan-secops/releases/tag/evidence-p50 · `evidence-p51` — https://github.com/oflavioc/quickscan-secops/releases/tag/evidence-p51 · `evidence-p52` — https://github.com/oflavioc/quickscan-secops/releases/tag/evidence-p52 · `evidence-unset` — https://github.com/oflavioc/quickscan-secops/releases/tag/evidence-unset |
| SHA-256 dos 4 pacotes (registrados no manifesto-ponte, conferidos após o upload) | `evidence_p50.tar` = `f3ea7d3f480082d676ee7d0968dbce5158b8e1a2ac2a7fd503234c3ee3e566fc` · `evidence_p51.tar` = `e903d92566373897ef96361a7931d923028479a7bf726078ba1ee6da7d4a188a` · `evidence_p52.tar` = `4bffd15fcf7bee8503401bdcb90c7da88053dbb690159ded0c029c3f2a5552ab` · `evidence_unset.tar` = `123097e6d8e0562d0b2d41bf262bfb5e4f8d6a7aaf061103803463cd82e0d522` |
| Conferência pós-upload (download de volta × manifesto, antes de declarar publicado) | 4/4 confere (T007; reconfirmado por execução própria do EB-2 em rede real — spec-validate item 7 e item 16) |
| Desindexação (`git rm -r --cached` + `.gitignore`) | 406 arquivos exatos fora do índice; contraprova: `docs_phase5/evidence_v322/` permanece rastreado (54 arquivos); os 3 ZIPs da raiz seguem rastreados; working tree íntegro (T010, commit `c46016e`) |
| Registry de pins | 176 → 184 (repin único T011, commit `d82c89d`: +3 `.claude/verify/*` novos, +5 `specs/007-migracao-evidencia/*.md`) → 186 (repin da wave 6, commit `29a9671`: +2 `spec-validate.md`/`matriz-gate-mutante.md`) |
| Red provado e commitado (R3 §4) | `9adf41d` — EB-3 FAIL ×4 ("pacote AUSENTE", 404 real, nenhum release existia) + EB-6 FAIL (406 arquivos ainda no índice, `.gitignore` sem as 4 entradas) |
| Green após publicação/desindexação/repin | `evidence-bridge: 0 FAIL · 0 WARN`, exit 0 — 406/406 arquivos, 4/4 pacotes (execução própria em rede real, `GITHUB_ACTIONS=1`, spec-validate item 8/EB-7) |
| Pipeline completo (`run.sh`, sem `--light`) | **14 PASS · 0 FAIL**, exit 0 (env-doctor, baseline, boundary, marker-lint, icons-check, build, lint-arch, state, tdd, mutation, m41, suites, suites-heavy, evidence-bridge — spec-validate §EB-7) |
| `spec-validate` (conformidade spec × implementação) | **24/24 (100%) · 0 gap** (`specs/007-migracao-evidencia/spec-validate.md`) |
| Campanha de mutantes (M1–M6, modalidade manual autorizada pela spec) | **6/6 mortos** — nenhum sobrevivente, nenhum gate enfraquecido (`specs/007-migracao-evidencia/matriz-gate-mutante.md`) |

## Os dois avisos obrigatórios ao proprietário

1. **O pack/histórico git NÃO emagrece com esta demanda.** `git rm -r --cached`
   remove os 406 arquivos do **índice**, não dos **blobs** — o histórico segue
   carregando-os (é exatamente essa alcançabilidade que sustenta o oráculo EB-1
   via `git show <âncora>:<path>`). Reduzir o tamanho do pack exigiria um
   rewrite de histórico (ex.: `git filter-repo`) ou um fresh-start de
   repositório — **decisão separada e exclusiva do proprietário**, fora do
   escopo desta demanda (borda 6 do refinamento; spec §Fora de escopo).

2. **A imutabilidade dos releases publicados é convenção + gate, não
   propriedade da plataforma.** O GitHub permite substituir o asset de um
   release existente sem aviso — a garantia real não vem do GitHub, vem do
   par EB-2/EB-4 do gate `evidence-bridge`: o SHA-256 de cada pacote está
   pinado no manifesto-ponte, e qualquer bytes divergente nos assets baixados
   (mesmo nome, conteúdo trocado) faz o gate falhar nomeando o pacote e os
   dois hashes (Observação 3 do parecer do PO na Fase 1, `parecer-po-fase1.md`;
   mutante M4 da matriz prova a detecção por execução).

## Pendência nomeada para o PR

- **Prova canônica de EB-7 em clone limpo, no CI.** A regressão congelada
  (`expected_suites.json`) e a guarda de mutação com acervo ausente
  (`tests_p50_mutants.js`, borda 5) foram confirmadas por execução local —
  worktree efêmera sem os acervos e renomeio temporário de `evidence_p50`,
  ambas verdes — mas essa simulação **não substitui** o CI Linux com checkout
  pós-migração (sem os acervos no disco) e `fetch-depth: 0`. Registrar como
  item de conferência do PR antes do merge (spec-validate §Pendências).

## Proposta registrada fora da demanda

- **Entrada permanente em `mutation_map.json` para o gate `evidence-bridge`**
  — proposta e não executada nesta demanda (a matriz M1–M6 foi manual,
  modalidade autorizada pela spec; o arquivo `mutation_map.json` não foi
  tocado). Condicionada a um harness scriptado de mutação
  (`tests_evidence_bridge_mutants.py` ou equivalente) que hoje não existe —
  pré-requisito é o harness formal da **Onda 3** (KI-2). Sem essa entrada,
  edição futura de `check_evidence_bridge.py`, `evidence_bridge.json`,
  `gen_evidence_bridge.py` ou `.gitignore` não re-dispara nenhuma campanha
  automaticamente; até lá o rastro canônico é `matriz-gate-mutante.md`, com
  re-execução manual obrigatória quando qualquer alvo mudar (R3 §5).

## O que não migrou por desenho

| Acervo | Fica porque | Gate/referência que exige |
|---|---|---|
| `docs_phase5/evidence_v322/` (54 arquivos) | Referenciado por `README.md:13` como imagem local de abertura | `V322-DOC3` (`tests_p52_layout.js:1688-1709`) |
| `visual_print_evidence_47.zip`, `_48.zip`, `_487.zip` (raiz) | Lidos via `unzip` pelos oráculos de sessão; demanda posterior com red próprio | Gates `S64`, `S74`+`S75`, `S113` (`tests_session_m48.js`) |

## Fontes citadas

`specs/007-migracao-evidencia/{refinement,spec,plan,tasks,spec-validate,matriz-gate-mutante,parecer-po-fase1}.md`;
`.claude/project-memory/planning-state/007-migracao-evidencia.json`;
`.claude/verify/evidence_bridge.json`; commits `62590b5` (T001, âncora),
`312fb36` (T002, manifesto), `9adf41d` (T005, red), `d82c89d` (T011, repin
único), `c46016e` (T010, desindexação), `2eaab82` (T012/T013, validação e
mutantes), `29a9671` (repin da wave 6, HEAD desta demanda no momento deste
relatório).
