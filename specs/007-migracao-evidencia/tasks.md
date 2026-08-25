# Tarefas — 007-migracao-evidencia

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Consome o [plan.md](plan.md) aprovado. Eu proponho; o orquestrador roteia.
> Mapeamento de waves: plano W1→wave 1 · W2→wave 2 · W3→wave 3 · **W4∥W5→wave 4
> (paralelismo resolvido: donos e arquivos disjuntos, mesma mensagem)** ·
> W6→wave 5 · W7→wave 6.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 1 | build-engineer | chore | | Criar `.claude/verify/gen_evidence_bridge.py` conforme plano §Ferramenta: âncora por argumento obrigatório 40 hex (recusa `HEAD`/branch), pacotes `evidence_<acervo>.tar` em diretório efêmero/ignorado, SHA-256 por blob e por pacote, manifesto LF/UTF-8 no shape da spec (emenda A2); SEM requisito de tar determinístico (Obs. 5); a ferramenta NUNCA entra no pipeline (Obs. 1). Commit `chore(007): ferramenta gen_evidence_bridge.py (o SHA deste commit é o commit-âncora)` — **o SHA deste commit é o commit-âncora da demanda** | EB-1 (indireto: a fidelidade do que ela gera é provada pelo gate na wave 3); pin capturado em T011 |
| T002 | 2 | doc-writer | chore¹ | | Executar `gen_evidence_bridge.py` com a âncora = SHA do commit de T001; **conferência de forma** (4 acervos, contagem re-medida na âncora — esperada 406 —, shape com `commit_ancora` 40 hex); commitar `.claude/verify/evidence_bridge.json` com `docs(007): manifesto-ponte evidence_bridge.json (âncora <sha-T001>, <N> arquivos, 4 pacotes)`. Pacotes `.tar` permanecem no diretório efêmero para T007 — **nunca commitados** | EB-1 (a fidelidade é decidida pelo gate, não pelo doc-writer¹); stage `state` |
| T003 | 3 | qa-engineer | feature² | | Escrever `.claude/verify/check_evidence_bridge.py` conforme plano §Desenho do gate: padrão `env_doctor.py` (FAILS/WARNS, linha final `evidence-bridge: N FAIL · N WARN`); parte offline (shape + EB-1 por `git ls-tree`/`git cat-file` da âncora + EB-6 índice/ignore/contraprova v322); parte online (urllib stdlib, hash em streaming sem escrita, `GITHUB_TOKEN` opcional); classificação rede-inalcançável ≠ 404 ≠ hash divergente; CI por `GITHUB_ACTIONS` — único arquivo desta tarefa | EB-1…EB-6 (asserções da spec viajam no prompt — R3 §3) |
| T004 | 3 | qa-engineer | feature² | | Registrar o stage `evidence-bridge` em `.claude/verify/pipeline.yaml` com os campos EXATOS do plano (`desc`/`run`/`parallel: false`/`mutates: false`/`heavy: true`) — checagem nova entra no pipeline, nunca em prompt (R10 §9); único arquivo desta tarefa | R10 §9; pin capturado em T011 |
| T005 | 3 | qa-engineer | feature² | | Executar o gate e registrar o **red esperado**: EB-3 FAIL ×4 ("pacote AUSENTE", 404 real — nenhum release existe) + EB-6 FAIL (acervos ainda no índice; `.gitignore` sem as entradas); provar EB-5: sem rede simulada → parte online WARN nomeado (4 pacotes listados) + exit 0, e com `GITHUB_ACTIONS=1` → exit ≠ 0. **Commitar o red**: `test(007): red — evidence-bridge: EB-3 (4 pacotes ausentes, 404) + EB-6 (acervos no índice) FAIL provado` (o commit carrega T003+T004) | Red da Fase 4 (R3 §4; FAIL commitado) |
| T006 | 3 | qa-engineer | chore | | Registrar `red.status: proven` + `red.commit: <sha de T005>` em `.claude/project-memory/planning-state/007-migracao-evidencia.json` — único arquivo desta tarefa | stage `state` (fases pós-red exigem red provado) |
| T007 | 4 | build-engineer | chore | [P] | Criar os 4 releases nominais (`evidence-p50`, `evidence-p51`, `evidence-p52`, `evidence-unset`) em `oflavioc/quickscan-secops`, um asset `.tar` cada (os pacotes de T002); **conferência pós-upload obrigatória**: baixar de volta e conferir SHA-256 == manifesto ANTES de declarar publicado. Nenhum arquivo da árvore muda (sem commit); execução e hashes registrados para o relatório. **Pré-condição: confirmação operacional do proprietário (dependência nomeada no plano)** | EB-2/EB-3/EB-4 (o green delas nasce aqui) |
| T008 | 4 | doc-writer | doc | [P] | Atualizar `.claude/rules/design-decisions.md` (linha "Evidência binária (~103 MB) versionada" — a migração desenhada foi executada por esta demanda; evidência agora em Releases + manifesto-ponte) e `.claude/rules/evidence-intake.md` (parágrafo de abertura sobre o legado). SEM repin nesta wave (consolidado em T011) | spec-validate + aceite do PO em T015; pins capturados em T011 |
| T009 | 4 | doc-writer | doc | [P] | Atualizar o status de `docs_phase5/PLANO_MIGRACAO_EVIDENCIA.md` ("DESENHADO, não executado" → executado pela demanda 007, com data e referência) — arquivo não pinado (exclusão `docs_phase5/**`); único arquivo desta tarefa | — (documental; conferido em T015) |
| T010 | 5 | build-engineer | chore | | `git rm -r --cached` dos 4 diretórios `docs_phase5/evidence_{p50,p51,p52,unset}` + 4 entradas no `.gitignore`; conferir no diff a **contraprova** (nenhum path de `evidence_v322` afetado; working tree intacto). Commit `chore(007): acervos p50/p51/p52/unset fora do índice + .gitignore — migrados para Releases (histórico intacto)` | EB-6 (vira verde aqui); EB-7 |
| T011 | 5 | build-engineer | chore | | Executar `gen_pins.py` **único** da demanda (captura: T001, T002, T003, T004, T008, T010; `declared.*` intactos) e commitar `pins.json` com `chore(007): gen_pins — repin único (novos: gen_evidence_bridge, evidence_bridge.json, check_evidence_bridge; alterados: pipeline.yaml, design-decisions, evidence-intake, .gitignore)` — fecha a janela de `baseline` vermelho declarada no plano. Rodar local: stage `baseline` verde + `evidence-bridge` com EB-1/EB-6 verdes e parte online verde (rede) ou WARN nomeado | stage `baseline`; EB-1…EB-6 (head do PR verde) |
| T012 | 6 | qa-engineer | chore | | Pipeline completo (`run.sh`) e reporte COM contagens: `evidence-bridge` (EB-1 N/N arquivos, 4/4 pacotes), `baseline`, `boundary`, `suites`+`suites-heavy` == `expected_suites.json` (EB-7; a prova canônica é o CI em clone limpo, sem os acervos no disco), demais stages; **confirmar por execução a guarda de `tests_p50_mutants.js` com `evidence_p50` ausente** (borda 5 do refinement); rodar `spec-validate`; qualquer desvio = PARAR e reportar | EB-1…EB-7 |
| T013 | 6 | qa-engineer | chore | | Executar **M1–M6 manualmente** (spec §Critérios) em cópias efêmeras do manifesto/ambiente (stash/tmp; mutação NUNCA commitada; reversão provada por `git status --porcelain` antes×depois): M1 hash de arquivo adulterado · M2 `sha256_pacote` adulterado · M3 asset inexistente · M4 asset de conteúdo divergente · M5 SKIP silencioso e detecção de CI mutados no gate · M6 re-add forçado + linha do `.gitignore` removida. Registrar execução+resultado no relatório da fase; **propor ou descartar** entrada permanente em `mutation_map.json` (registrar em DEPENDÊNCIAS — fora desta demanda) | M1–M6 (mutantes mortos — R3 §5, modalidade manual autorizada pela spec) |
| T014 | 6 | doc-writer | doc | | Relatório final da demanda (template de relatório; PT-BR) com os DOIS avisos obrigatórios: **o pack/histórico NÃO emagrece** (borda 6 — rewrite é decisão separada do proprietário) e **imutabilidade dos releases é convenção+gate, não propriedade da plataforma** (Observação 3 do parecer); inclui hashes dos 4 pacotes e o commit-âncora | — (doc-writer nunca decide PASS/FAIL; contagens vêm de T012) |
| T015 | 6 | product-owner | chore | | Aceite de intenção: necessidade do refinement cumprida (verificabilidade preservada por manifesto+gate; acervos fora do índice; v322 e ZIPs intactos); conferir T008/T009 (docs atualizadas) e os avisos de T014. NÃO declara fase concluída/selada — isso é do auditor | Portão de aceite (fecha o ciclo R3) |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).
**[P] definitivo: T007∥T008∥T009 (wave 4)** — donos distintos (build-engineer ×
doc-writer) em arquivos disjuntos (releases externos × rules × docs_phase5), zero
colisão possível; T008 e T009 têm o mesmo dono e podem ir na mesma delegação.
Todas as demais tarefas são sequenciais (dependência real em cadeia).

¹ **Decisão da W2 (pendência da Fase 2, resolvida):** o `doc-writer` EXECUTA a
ferramenta e commita o manifesto — não o orquestrador. Razões: (a) R11 §2 dá ao
doc-writer o registro do manifesto, e executar o gerador é ato mecânico de
registro (âncora fixada, zero decisão); (b) dono único do arquivo preservado;
(c) a conferência do doc-writer é **de forma** (shape/contagem), nunca veredito —
quem decide fidelidade é o gate EB-1 do QA na wave 3 (doc-writer nunca decide
PASS/FAIL). O orquestrador apenas fornece no prompt o SHA-âncora de T001.

² **Tipagem da wave 3 (feature) e referência de red (R3):** o gate
`evidence-bridge` é O comportamento novo da demanda — tipagem `feature` conforme
spec §Tipagem. O red que a tipagem exige é o **red natural produzido dentro da
própria wave** (T005: EB-3+EB-6 FAIL commitado) — não é circular: o red antecede
TODA a implementação que o torna verde (T007 publicação, T010/T011 desindexação
e repin), e autor do gate (qa-engineer) ≠ implementador (build-engineer),
R3 §2 satisfeita. T007/T010/T011 são `chore` (operação de processo/infra, não
código de produto); o red que as ampara é o de T005, referenciado no
planning-state via T006 e citado nos prompts de delegação.

Sequência de commits do PR (auditável): `chore(007): ferramenta …` (T001, o
commit-âncora) → `docs(007): manifesto-ponte …` (T002) → `test(007): red — …`
(T005) → `docs(007): decisões atualizadas …` (T008; T009 pode compor o mesmo
commit doc) → `chore(007): acervos … fora do índice …` (T010) →
`chore(007): gen_pins — repin único …` (T011). Janelas vermelhas esperadas e
nomeadas no plano: `baseline` de T001 a T011; `evidence-bridge` de T005 a
T007/T010. **Head do PR integralmente verde.** T007 não gera commit (ação no
evidence store, registrada em relatório).
