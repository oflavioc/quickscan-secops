# Tarefas — 008-migracao-zips

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Consome o [plan.md](plan.md) aprovado (portão de 2026-08-26, commit `53af3d1`).
> Eu proponho; o orquestrador roteia. Mapeamento de waves: plano W1→wave 1 ·
> W2→wave 2 · W3→wave 3 (RED) · **W4∥W5a∥W5b∥W5c→wave 4 (paralelismo resolvido:
> arquivos disjuntos; nomeação O3 final abaixo)** · W6→wave 5 (GREEN) ·
> W7→wave 6 (validação).

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 1 | build-engineer | chore | | Generalizar `.claude/verify/gen_evidence_bridge.py` para `tipo: "arquivo"` conforme plano §Desenho e spec T3 (sem tar: o "pacote" é o próprio blob extraído para diretório efêmero; `path` explícito; `release_tag` compartilhado `evidence-v32`) e embutir a **conferência TRIPLA** (O2): SHA-256(blob `62590b5…:<zip>`) == SHA-256(blob `HEAD:<zip>`) == `MANIFEST.sha256` linhas 39/40/87 — divergência = PARAR nomeando ZIP e os 3 hashes (`MANIFEST.sha256` só lido, nunca editado). Único arquivo. Commit `chore(008): gen_evidence_bridge generalizado p/ acervo-arquivo + conferencia tripla` | ZB-1 (indireto: fidelidade do que gera é provada pelo gate na wave 3); pin capturado em T011 |
| T002 | 2 | doc-writer | chore¹ | | Executar a ferramenta de T001 com a âncora **`62590b5927496a61ab31dd476d46b03624546560`** (T2 — reuso, nenhum commit-âncora novo); **conferência de forma**: 7 acervos, as 4 entradas da 007 textualmente intactas, 3 acervos-arquivo (`evidence-47/48/487` → `evidence-v32`), tripla verde ×3 registrada; commitar `.claude/verify/evidence_bridge.json` com `docs(008): manifesto-ponte +3 acervos-arquivo (ancora 62590b5, release evidence-v32)`. Cópias dos blobs permanecem no diretório efêmero para T006 — **nunca commitadas** | ZB-1/ZB-2 (a fidelidade é decidida pelo gate¹); stage `state` |
| T003 | 3 | qa-engineer | feature² | | Generalizar `.claude/verify/check_evidence_bridge.py` conforme plano: `valida_shape` com `tipo` default `"diretorio"`, domínio fixo de 7 acervos, coerência `pacote == basename(path)` e `sha256_pacote == arquivos[path]` para tipo arquivo; EB-1 sobre 409 entradas (mesma mecânica ls-tree/cat-file); EB-6 generalizado (T4: ls-files vazio no path, entrada **literal** no `.gitignore`, `check-ignore -q` direto, contraprova v322 herdada); parte online sobre o release compartilhado (política EB-5 inalterada). Único arquivo desta tarefa — asserções de ZB-1…ZB-4 viajam no prompt (R3 §3) | ZB-1, ZB-2, ZB-3, ZB-4 |
| T004 | 3 | qa-engineer | feature² | | Executar e **commitar o RED triplo** (R3 §4): (a) gate de T003 → **ZB-3 "pacote AUSENTE" ×3** (release `evidence-v32` inexistente, 404 real) + **ZB-4/EB-6 FAIL** (3 ZIPs no índice; `.gitignore` sem as entradas) — shape e EB-1 já verdes (7 acervos, 409/409); (b) **M-ZB5 red**: worktree efêmera (`.claude/worktrees/`) sem os 3 ZIPs no disco → suíte de sessão **FAIL ×3** (S64 `false`, S74+S75 `false`, S113 `throw`), log da execução registrado no commit; (c) **M-ZB6 red**: grep `unzip` em `env_doctor.py` = 0 + execução comprovando o silêncio atual. Commit `test(008): red — ZB-3 (3 assets ausentes, 404) + ZB-4 (ZIPs no indice) + M-ZB5 (suite FAIL x3 sem os ZIPs) + M-ZB6 (env-doctor silente)` (o commit carrega T003) | Red da Fase 4 — ZB-3, ZB-4, M-ZB5, M-ZB6 |
| T005 | 3 | qa-engineer | chore | | Registrar `red.status: proven` + `red.commit: <sha de T004>` em `.claude/project-memory/planning-state/008-migracao-zips.json` — único arquivo desta tarefa | stage `state` (fases pós-red exigem red provado) |
| T006 | 4 | build-engineer | chore | [P] | Criar o release **`evidence-v32`** em `oflavioc/quickscan-secops` com os 3 assets **diretos** (nomes originais `visual_print_evidence_{47,48,487}.zip`, blobs de T002); **conferência pós-upload obrigatória**: baixar de volta e conferir SHA-256 == manifesto ×3 ANTES de declarar publicado. Nenhum arquivo da árvore muda (sem commit); hashes e execução registrados para o relatório. **Pré-condição: confirmação operacional do proprietário (dependência nomeada no plano da 007, herdada)** | ZB-3 (o green nasce aqui) |
| T007 | 4 | core-engineer | refactor³ | [P] | Refatorar S64/S74+S75/S113 em `tests_session_m48.js` conforme plano §Técnica O4: helper memoizado único (1 extração por ZIP por execução) com `spawnSync("git", ["show", ancora+":"+zip], {maxBuffer: 64*1024*1024})` — args em array, stdout **Buffer** —, escrita em `mkdtempSync(os.tmpdir())`, `unzip` com caminho **entre aspas**, remoção em `finally`; âncora lida de `evidence_bridge.json → _meta.commit_ancora` validada 40-hex (T5), inválida/blob ausente → `throw` nomeando (FAIL, nunca SKIP); dependência cruzada S113→`_48` vira `git cat-file -s` > 0 (paridade exata com `existsSync && size>0`). **Asserções byte-equivalentes em semântica — régua INV-8: muda a fonte, nunca a asserção.** Prova local: suíte **97/0** na árvore normal E em worktree efêmera sem os ZIPs. Único arquivo desta tarefa; gate ZB-5 no prompt. Commit `refactor(008): S64/S74+S75/S113 leem o blob do commit-ancora (fonte, nao assercao)` | ZB-5, ZB-7 |
| T008 | 4 | build-engineer | feature³ | [P] | Acrescentar checagem de `unzip` em `.claude/verify/env_doctor.py` (política T6): presente → `[OK] unzip`; ausente → **WARN nomeado** citando que a suíte de sessão (S64/S74+S75/S113) reprova sem ele — nunca silêncio, nunca FAIL do stage. Único arquivo desta tarefa; gate ZB-6 no prompt (red provado em T004c). Commit `feat(008): env-doctor declara unzip (R10 §7, ZB-6)` | ZB-6 |
| T009 | 4 | doc-writer | doc | [P] | Atualizar `.claude/rules/design-decisions.md` (linha "Evidência binária versionada": os 3 ZIPs da raiz deixam de ser "migração de escopo posterior" — migrados pela 008 para o release `evidence-v32`; trilha preservada) e `.claude/rules/evidence-intake.md` (abertura: os ZIPs saíram do índice; gates S64/S74/S113 leem da âncora). SEM repin nesta wave (consolidado em T011). Commit `docs(008): decisoes atualizadas — ZIPs migrados (R13/R11)` | spec-validate + aceite do PO em T015; pins em T011 |
| T010 | 5 | build-engineer | chore | | `git rm --cached` dos 3 ZIPs + **3 entradas literais** (nome exato de arquivo, nunca glob) no `.gitignore` + desc do stage `evidence-bridge` em `pipeline.yaml` atualizada para os 7 acervos (decisão do plano); conferir no diff a **contraprova** (nenhum path além dos 3; `evidence_v322` e `MANIFEST.sha256` intactos; working tree preserva os bytes). Commit `chore(008): ZIPs 47/48/487 fora do indice + .gitignore + desc do stage (historico intacto)` | ZB-4 (vira verde aqui); ZB-7 |
| T011 | 5 | build-engineer | chore | | Executar `gen_pins.py` **ÚNICO** da demanda (captura: T001, T002, T003, T007, T008, T009, T010 + `specs/008-migracao-zips/*.md`; `declared.*` intactos) e commitar `pins.json` com `chore(008): gen_pins — repin unico (gen/check evidence_bridge, manifesto, tests_session_m48, env_doctor, rules, .gitignore, pipeline)` — fecha a janela de `baseline` vermelho declarada no plano (R8 §1: mesmo PR). Rodar local: `baseline` verde; `evidence-bridge` verde (shape 7 acervos · EB-1 409/409 · ignore 7/7 · online 7/7 ou WARN nomeado); `suites-heavy` **97/0** | stage `baseline`; ZB-1…ZB-4, ZB-7 (head do PR verde) |
| T012 | 6 | qa-engineer | chore | | Pipeline completo (`run.sh`) e reporte COM contagens: `evidence-bridge` (409/409, 7/7 pacotes), `baseline`, `boundary`, `suites`+`suites-heavy` == `expected_suites.json` **byte-idêntico** (ZB-7); prova canônica no **CI** (checkout pós-migração sem os ZIPs no disco, `fetch-depth: 0`, 97/0 + evidence-bridge verde); rodar `spec-validate`; qualquer desvio = PARAR e reportar | ZB-1…ZB-7 |
| T013 | 6 | qa-engineer | chore | | Campanha de mutantes **manual** em cópias efêmeras (stash/tmp; mutação NUNCA commitada; `git status --porcelain` antes×depois): **M-ZB1…M-ZB6** (spec §Critérios — incl. M-ZB5 pós-refatoração: âncora trocada por SHA sem os ZIPs → reprova; ZIP truncado no tmp → reprova) + **re-execução integral de M1–M6 da 007** (obrigação R3 §5 — os alvos mudaram). Registrar `matriz-gate-mutante.md` da 008 com os 3 blocos do plano, incluindo a **linha de transferência O1** ("garantia `permanece publicado` de S113 → ZB-3, coberta por M-ZB3"); propor ou descartar entrada permanente em `mutation_map.json` (registrar em DEPENDÊNCIAS — fora desta demanda, pendência Onda 3/KI-2) | M-ZB1…M-ZB6 + M1–M6 (mutantes mortos) |
| T014 | 6 | doc-writer | doc | | Relatório final da demanda (template; PT-BR) com os avisos obrigatórios herdados: **o pack/histórico NÃO emagrece** (rewrite é decisão separada e exclusiva do proprietário) e **imutabilidade do release é convenção+gate** (par EB-2/EB-4 sobre `evidence-v32`); inclui os 3 hashes, o commit-âncora reutilizado, a cadeia de commits e a referência à linha O1 da matriz de T013. Contagens vêm de T012 — doc-writer nunca decide PASS/FAIL | — (documental; conferido em T015) |
| T015 | 6 | product-owner | chore | | Aceite de intenção: necessidade do refinement cumprida (raiz limpa; E10 encerrado por inteiro; verificabilidade preservada por manifesto+gate+oráculos da âncora; 007 intacta; contagem 97 intacta); conferir T009 (docs) e os avisos de T014. NÃO declara fase concluída/selada — isso é do auditor | Portão de aceite (fecha o ciclo R3) |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

**[P] definitivo: T006∥T007∥T008∥T009 (wave 4)** — arquivos totalmente disjuntos
(release externo × `tests_session_m48.js` × `env_doctor.py` × rules), zero colisão
possível; T006 e T008 têm o mesmo dono (`build-engineer`) e podem ir na mesma
delegação ou em sequência dentro da wave. Todas as demais tarefas são sequenciais
(dependência real em cadeia: T010 exige T006+T007 — desindexar antes do oráculo
novo e do release seria janela vermelha não declarada na suíte).

¹ **Execução da W2 pelo doc-writer** — mesma decisão ratificada na 007 (nota ¹ do
`tasks.md` da 007): executar o gerador é ato mecânico de registro (âncora fixada
pela spec T2, zero decisão); a conferência do doc-writer é **de forma** (7 chaves,
entradas 007 intactas, tripla verde), nunca veredito — fidelidade é do gate ZB-1
do QA na wave 3. O orquestrador fornece no prompt o SHA `62590b5…` literal.

² **Tipagem da wave 3 (feature) e referência de red (R3):** a generalização do
gate `evidence-bridge` é comportamento novo de verificação — `feature` conforme
spec §Tipagem. O red é o **natural da própria wave** (T004a: AUSENTE ×3 + índice
sujo, commitado) — não circular: antecede TODA a implementação que o torna verde
(T006 publicação, T010 desindexação, T011 repin), e autor do gate (`qa-engineer`)
≠ implementadores (`build-engineer`/`core-engineer`), R3 §2 satisfeita.

³ **Nomeação FINAL da separação O3 e tipagem da wave 4:**
- **T007 (`refactor`, `core-engineer`)**: a régua INV-8 tipifica — a asserção não
  muda, só a fonte dos bytes; R3 não exige red para `refactor`, mas esta demanda
  TEM red real amparando (T004b: FAIL ×3 provado e commitado ANTES), e o mutante
  pós-refatoração (T013/M-ZB5) prova que a reprova sobrevive. **Implementador
  (`core-engineer`) ≠ QA que provou o red e executa os mutantes (`qa-engineer`,
  T004/T013)** — O3 cumprida nominalmente.
- **T008 (`feature`, `build-engineer`)**: checagem nova no env-doctor; red = T004c
  (silêncio atual provado e commitado). Autor da prova (`qa-engineer`) ≠
  implementador (`build-engineer`).

Sequência de commits do PR (auditável): `chore(008): gen_evidence_bridge …`
(T001) → `docs(008): manifesto-ponte …` (T002) → `test(008): red — …` (T004,
carrega T003) → `refactor(008): S64/… ` (T007) ∥ `feat(008): env-doctor …`
(T008) ∥ `docs(008): decisoes …` (T009) → `chore(008): ZIPs … fora do indice …`
(T010) → `chore(008): gen_pins — repin unico …` (T011). T005 compõe com T004 ou
commit próprio de estado; T006 não gera commit (ação no evidence store, registrada
em relatório). Janelas vermelhas declaradas no plano: `baseline` de T001 a T011;
`evidence-bridge` de T004 a T006 (AUSENTE) e a T010 (índice); a suíte de sessão
**nunca vermelha na árvore do PR**. **Head do PR integralmente verde.**
