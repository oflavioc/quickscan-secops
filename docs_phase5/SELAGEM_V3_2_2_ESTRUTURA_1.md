# Registro de selagem — consolidação v3.2.2-estrutura.1 (2026-08-26)

> Rito R14: release develop→main sob pedido explícito do proprietário no chat
> (2026-08-26, "Pode selar"). Commit de selagem doc-only, separado; merge
> fast-forward (sem squash); tag anotada com os hashes abaixo.

## O que esta selagem consolida (main estava 39 commits atrás, em 6dbe377)

- **Produto INALTERADO**: v3.2.2 permanece a produção — diff vazio em engine,
  Camada 1, módulos ui_*, builders desde a última selagem. SHA-256 do HTML de
  produção: `913440adc157e850e100c98a706ad6e6793e3556981bb78a4736500cd1c02879`
  (conferido em 2026-08-26 nas três cópias: release_prep, deploy e asset do
  GitHub Release v3.2.2 — byte-idênticas).
- **Demanda 007 — migração de evidência (PR #20, CI verde)**: 4 acervos
  (406 arquivos, ~105 MB) fora do índice, publicados como Releases nominais
  (evidence-p50/p51/p52/unset, tags apontando para o commit-âncora
  `62590b5927496a61ab31dd476d46b03624546560`); manifesto-ponte
  `.claude/verify/evidence_bridge.json` pinado; gate `evidence-bridge`
  (stage 14). Validação: pipeline 14/14 · spec-validate 24/24 · mutantes 6/6
  mortos · aceite do PO "não encontrei objeção". Registro completo em
  `specs/007-migracao-evidencia/relatorio-final.md`.
- **Organização do repositório**: rename para `oflavioc/quickscan-secops`
  (público por decisão), About/topics, LICENSE proprietária, README (badge,
  seção Desenvolvimento, mapa), 4 docs históricas para `docs/`, actions do CI
  em v7 (PR #18), repo do release v3.2.0 arquivado no GitHub.
- **Estrutura Agêntica**: divisão de modelos por papel no frontmatter dos
  agentes; follow-ups da 007 aplicados (R11/R13); drift da linha do tempo do
  CLAUDE.md corrigido (estado de onda aponta `current_phase.json`).

## Estado de verificação no momento da selagem

- CI `verify` verde na develop até `22dee24` (runs 32914326438 e 32914582602
  cobrem o merge da 007 e o follow-up; prova canônica do EB-7 em clone limpo).
- Baseline local: 187/187 pins · boundary 9/9 · state 0 problemas.
- Fase de produto: **5.2 SELADA** (inalterada por esta selagem — este registro
  consolida trabalho de estrutura/organização, não abre nem fecha fase de
  produto; `current_phase.json` intocado).

## Pendências que ATRAVESSAM a selagem (registradas, sem ação em aberto)

- Migração dos 3 `visual_print_evidence_*.zip` da raiz — demanda futura
  (exige refatorar os oráculos S64/S74/S113 com red).
- Harness de mutação scriptado (KI-2) e entrada do `evidence-bridge` no
  `mutation_map.json` — Onda 3.
- Emagrecimento do histórico git — rewrite, decisão exclusiva do proprietário.
