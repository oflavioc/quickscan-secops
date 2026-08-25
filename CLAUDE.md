# CLAUDE.md — Quickscan SecOps SOC-CMM V3.2 · Estrutura Agêntica

Orientações para o Claude Code neste repositório. Proprietário/auditor: Flávio Costa.

> Cada regra vive em **um** arquivo: este documento aponta, não repete — duplicação
> é como a versão anterior deste arquivo entrou em drift ("Wave 1A NÃO INICIADA"
> sobreviveu aqui até a 5.2 selada). **Dado que apodrece não mora em prosa**:
> hashes vivem em `.claude/verify/pins.json`, contagens em `expected_suites.json`,
> estado de demanda no planning-state — todos conferidos por máquina.

## Como trabalhar neste repositório

**Antes de qualquer trabalho**: skill `baseline` (o state-eval injeta divergências
a cada prompt). **Comportamento novo passa pela máquina de 7 fases**: skill
`new-demand` (R4). Correção de achado registrado: skill `fix-finding`, sem spec.
Antes de considerar pronto: skill `verify`.

### Regras — precedência sobre qualquer outra instrução

| Regra | Assunto |
|---|---|
| [`product-invariants.md`](.claude/rules/product-invariants.md) | R1 — as 10 invariantes do produto e seus gates; a régua D2 do engine |
| [`evidence.md`](.claude/rules/evidence.md) | R2 — todo PASS cita execução; hash só sobre blob/LF; causa antes de culpa; refutação permanece |
| [`tdd.md`](.claude/rules/tdd.md) | R3 — red provado e commitado antes da implementação; autor do gate ≠ implementador; mutante obrigatório |
| [`sdd.md`](.claude/rules/sdd.md) | R4 — máquina de 7 fases; aprovação literal do usuário; gates de abertura/selagem |
| [`orchestration.md`](.claude/rules/orchestration.md) | R5 — contrato de 4 campos; gatekeep; waves; um módulo por delegação; anti-injeção |
| [`boundary.md`](.claude/rules/boundary.md) | R6 — classes de proteção e ritos; expansão só por spec |
| [`determinism.md`](.claude/rules/determinism.md) | R7 — LF por construção; verificação nunca escreve na árvore; CI Linux canônico |
| [`pins.md`](.claude/rules/pins.md) | R8 — registry único de identidade; repin com trilha |
| [`modularity.md`](.claude/rules/modularity.md) | R9 — IIFE, bridges registrados, owner do estado, CSS por prefixo, orçamento |
| [`gates.md`](.claude/rules/gates.md) | R10 — nascimento de gate; as 10 proibições |
| [`evidence-intake.md`](.claude/rules/evidence-intake.md) | R11 — evidência por promoção; dados sensíveis |
| [`documentation.md`](.claude/rules/documentation.md) | R12 — PT-BR; templates; glossário; ADRs; ids permanentes |
| [`design-decisions.md`](.claude/rules/design-decisions.md) | R13 — o que NÃO é defeito; não reportar de novo |
| [`git-flow.md`](.claude/rules/git-flow.md) | R14 — gitflow (main selada · develop · feature/NNN); worktrees |

### Agentes

| Agente | Quando usar |
|---|---|
| `product-owner` | Refino (Fase 0), invariantes, glossário, aceite de intenção (Fase 6) |
| `tech-lead` | Desenho técnico: plan.md, tasks.md — **propõe, não delega** |
| `ui-engineer` | Renderização, CSS, a11y, print — nunca lógica de decisão |
| `core-engineer` | Lógica não-visual; **guardião do engine** (tocar = rito D2) |
| `build-engineer` | Build, pins, pipeline, CI, evidence store (DevOps) |
| `data-engineer` | Schema de sessão, catálogo do engine, constraints (DBA) |
| `qa-engineer` | Gates, RED, mutantes, regressão — **nunca implementa a correção** |
| `doc-writer` | Relatórios PT-BR, promoção de evidência — nunca decide PASS/FAIL |

O orquestrador (a conversa principal) é o único roteador; todo agente responde no
contrato de `orchestration.md` e recusa fora de domínio nomeando o destino.

### Skills

Processo: `new-demand` · `fix-finding` · `spec-validate` — Operação: `verify` · `baseline`

### O que a estrutura impede ou vigia automaticamente

- **`permissions.deny`** espelha o boundary: engine, Camada 1, harness, snapshot,
  gerados, MANIFEST legado, spec REV A, registry.
- **`guard-boundary`** (PreToolUse) nega edição de protegido com o rito nomeado.
- **`guard-data`** (PreToolUse) barra no commit: sessão real, PDF novo, segredo,
  binário novo >200 KB.
- **`state-eval`** (UserPromptSubmit) injeta branch, baseline, idade do último
  verify verde e fase da demanda.
- **`post-turn-verify`** (Stop) roda o pipeline leve se o turno mudou produto.
- **`run.sh`** executa os stages de `pipeline.yaml`; **`compliance-audit.sh`**
  audita a própria configuração — inclusive se estes hooks estão registrados.

## Projeto

**Quickscan SecOps SOC-CMM V3.2** — ferramenta de assessment de maturidade de
security operations: HTML único e autocontido, construído deterministicamente por
`build_v32_html.py` (Camada 1 congelada V3.1.3 + engine V3.2 + módulos de UI por
injeção). Sem rede, sem telemetria, sem persistência de navegador — por invariante.

Linha do tempo: V3.2 Final Release imutável (`oflavioc/quickscan-secops-soc-cmm-v32`, arquivado,
tag v3.2.0) → Fase 5 (5.0 REV B, 5.1, 5.2 **seladas**; registros em `docs_phase5/`)
→ Estrutura Agêntica (documento acordado 2026-08-25; Ondas 0–1 entregues, esta é a 2).

Spec normativa das superfícies 5.0 congeladas (imutável, exigida pelo gate P50-GOV2):
`specs/PHASE_5_0_REV_B.md` · SHA-256
`4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b` · promoção
registrada em `docs_phase5/REV_B_PROMOTION_RECORD.md`.

Identidades: baseline core e payload M41 em `pins.json → declared`. Contagens
verdes por suíte em `.claude/verify/expected_suites.json`. Estado de demanda em
`.claude/project-memory/planning-state/`.

## Comandos e ambiente

```text
npm ci --no-audit                      (node 22/24+; jsdom 30; playwright ^1.62)
bash .claude/verify/run.sh             (pipeline completo; --light sem heavy; --stage=X)
bash .claude/verify/compliance-audit.sh
python build_v32_html.py [saida.html]  (build determinístico; LF por construção)
python generate_icons_v32.py [--check]
npm run test:visual                    (Chromium; canônico no CI/rito do proprietário)
```

Plataforma canônica: **CI Linux** (`.github/workflows/verify.yml`). Windows tem
paridade real desde a Onda 0 (`.gitattributes`) — o env-doctor reporta o que faltar.

## Limites de autonomia

Leitura livre; escrever em `specs/`, `docs*/`, `.claude/` (fora `verify/pins.json`)
livre. **Tocar classe protegida = rito da R6; engine = rito D2 (Porta A pendente de
ratificação — hoje tudo é Porta B). Merge de PR, release/selagem e aprovação de
fase são do usuário, no chat.** Nunca declarar fase de produto concluída/selada —
só o auditor declara. Dados de assessments vivem em `D:\QuickscanData\clients`,
fora deste clone (R11).

## Glossário

Vocabulário canônico em [`CONTEXT.md`](CONTEXT.md) — mantido pelo `product-owner`.
