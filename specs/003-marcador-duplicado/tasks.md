# Tarefas — 003-marcador-duplicado

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Consome o [plan.md](plan.md) aprovado (ordenação doc-antes-do-green, repin único)
> e a [spec.md](spec.md) com a emenda G2. Eu proponho; o orquestrador roteia.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 1 | qa-engineer | chore¹ | | Remover a entrada KI-1 de `.claude/verify/known_issues.json` (KI-2/KI-3 byte-idênticas; `_meta` intocado) — único arquivo desta tarefa | G1 (rearma o marker-lint) |
| T002 | 1 | qa-engineer | chore¹ | | Executar o stage `marker-lint` e registrar o FAIL esperado (`[FAIL] marcador V32_UI_END: 2 ocorrência(s), esperado 1`, exit ≠ 0); **commitar o red** com mensagem `test(003): red — marker-lint rearmado, V32_UI_END 2x` (o commit carrega a edição de T001) | G1 (red provado e commitado — R3 §4) |
| T003 | 1 | qa-engineer | chore¹ | | Registrar `red.status: proven` + `red.commit: <sha de T002>` em `.claude/project-memory/planning-state/003-marcador-duplicado.json` — único arquivo desta tarefa | stage `state` (fases pós-red exigem red provado) |
| T004 | 2 | doc-writer | doc | | Remover a linha "Marcador `V32_UI_END` duplicado no HTML" da tabela de confirmadas de `.claude/rules/design-decisions.md` (caso de borda 5; SEM repin nesta wave — consolidado em T007) | spec-validate + aceite do PO em T010 (observação 2); pin capturado por T007 |
| T005 | 3 | build-engineer | fix² | | Aplicar em `build_v32_html.py:70` o diff exato da spec §Comportamento: remover SOMENTE o segundo `+ "\n/* V32_UI_END */\n"` terminal da string `inject` (entre `V32_P52_WORKSPACE_END` e `anchor`); nenhuma outra parte da linha muda; ordem de injeção inalterada | G2 (marker-lint 1×, linha final `34 marcadores distintos · 0 problema(s)`) |
| T006 | 3 | build-engineer | fix² | | Rebuild oficial em WSL/Linux: `python3 build_v32_html.py` regrava `quickscan_secops_soccmm_v3_2_dev.html` (classe `generated` — a regravação É a entrega); inspecionar o diff do HTML (só a 2ª ocorrência sai); **commitar T005+HTML juntos** (pré-condição de T007: gen_pins lê blobs de HEAD) | G3 (`check_build.py` byte-idêntico) + G4 (`check_m41.py` payload == pin `9794b267…`; divergir = PARAR, Porta B) |
| T007 | 3 | build-engineer | chore | | Executar `gen_pins.py` (captura de uma vez os 4 pins: known_issues de T001, design-decisions de T004, builder e HTML de T005/T006; `declared.*` intactos) e commitar `.claude/verify/pins.json` com motivo + trilha "Identidade anterior: `fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79`" — fecha a janela de baseline vermelho declarada no plano; head do PR verde | stage `baseline` (registry × blobs de HEAD) |
| T008 | 4 | qa-engineer | chore | | Executar o pipeline completo (`run.sh`) e reportar G2–G5 COM contagens: marker-lint (linha final exata da emenda G2), build, m41 (payload == pin), suites + suites-heavy (== `expected_suites.json`), baseline, boundary, lint-arch, state; rodar spec-validate; qualquer desvio = PARAR e reportar | G2 · G3 · G4 · G5 |
| T009 | 4 | qa-engineer | chore | | Executar o mutante **M1** manualmente: em cópia efêmera/stash, reintroduzir `+ "\n/* V32_UI_END */\n"` na linha da `inject`, rebuild efêmero, provar o FAIL do marker-lint sobre o artefato mutado, **reverter com reversão provada** (`git status --porcelain` limpo antes×depois) e registrar execução+resultado no relatório da fase (harness formal é Onda 3 — KI-2) | M1 (mutante morto — R3 §5, modalidade manual autorizada pela spec) |
| T010 | 4 | product-owner | chore | | Aceite de intenção: conferir a necessidade cumprida (KI-1 removida, marker-lint sem exceções, garantia "cada marcador 1×" restaurada) e **conferir a linha removida de `design-decisions.md`** (observação 2 do parecer); registrar o aceite. NÃO declara fase concluída/congelada — isso é do auditor | Portão de aceite (fecha o ciclo R3) |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).
**Nenhuma tarefa é [P]**: a cadeia é estritamente sequencial (red → doc → fix →
rebuild → repin → validação) e, dentro de cada wave, há um único dono — nada
ganha paralelismo e o risco de colisão de arquivo/árvore é zero.

¹ **Tipagem da Wave 1 (justificativa pedida pelo desenho):** T001–T003 são
tipadas `chore` porque são **tarefas de gate, não de produto** — o ato delas é
PRODUZIR o red da demanda (R3 §2: o QA escreve/rearma o gate; §4: o FAIL é
commitado), não alterar comportamento do sistema. Tipá-las `fix` exigiria red
provado ANTES delas (R3, tabela de tipagem) — circular, pois o red da demanda
nasce exatamente aqui. A demanda como um todo é `fix`, e o red que os tipos
`fix` de T005/T006 exigem é o produzido por T002 e registrado por T003.

² **Referência de red (R3):** T005 e T006 são `fix` e o red provado que as
autoriza é o commit de T002 (`red.commit` no planning-state via T003) — o gate
viajará no prompt de delegação: asserções de G2 (com a linha final pinada da
emenda), G3 e G4 conforme spec §Critérios.

Sequência de commits do PR (auditável): `test(003): red — …` (T002) →
commit doc (T004) → commit fix+HTML (T006) → commit pins com trilha (T007).
Reds intermediários esperados e nomeados no plano (marker-lint desde T002;
baseline até T007); **head do PR integralmente verde**.

---

ARQUIVOS_TOCADOS: specs/003-marcador-duplicado/tasks.md (criado — único artefato desta fase)
RESUMO: Fase 3 concluída pelo template. 10 tarefas em 4 waves, derivadas 1:1 das waves do plano aprovado: W1 red pelo qa-engineer (T001 remoção KI-1 · T002 FAIL registrado + commit red · T003 planning-state red.status proven — um arquivo por tarefa); W2 doc pelo doc-writer (T004, sem repin); W3 green pelo build-engineer em três tarefas sequenciais respeitando gen_pins-lê-HEAD (T005 diff exato do builder · T006 rebuild WSL/Linux + commit fix+HTML · T007 gen_pins único + commit pins com trilha fb906462…); W4 validação (T008 pipeline completo + G2–G5 + spec-validate · T009 mutante M1 em cópia efêmera com reversão provada · T010 aceite de intenção do PO conferindo a linha removida). Tipagem justificada em rodapé: W1 é chore (tarefa de gate — tipá-la fix seria circular; o red da demanda nasce nela), T005/T006 fix referenciando o red de T002, T007–T010 chore, T004 doc. Nenhuma [P] (cadeia estritamente sequencial, dono único por wave). Sequência de commits do PR declarada, com reds intermediários nomeados e head verde.
EVIDÊNCIA: lido nesta fase — .claude/templates/tasks.md:1-12; reutilizados (já lidos integralmente nesta sessão): specs/003-marcador-duplicado/plan.md e spec.md (com emenda G2), .claude/rules/tdd.md (R3 §2/§4/§5 e tabela de tipagem), orchestration.md (R5: um módulo por delegação, waves, tabela de domínios), pins.md (R8: blobs de HEAD, mesmo PR), boundary.md, gates.md, verify/check_markers.py, check_build.py, check_m41.py, known_issues.json, pipeline.yaml, pins.json, build_v32_html.py:60-79. Nenhuma execução nesta fase (nem de leitura — nada novo a verificar); nenhum gate executado (fase de desenho).
DEPENDÊNCIAS: portão da Fase 3 com o usuário; após o portão, a EXECUÇÃO é do orquestrador (eu proponho, não delego): delegar T001–T003 ao qa-engineer com o gate G1 no prompt, T004 ao doc-writer, T005–T007 ao build-engineer com G2/G3/G4 (asserções da spec, incluindo a linha final pinada da emenda) no prompt, T008–T009 ao qa-engineer, T010 ao product-owner; build-engineer confirma ambiente WSL/Linux antes de T006 (risco de plataforma do plano); o auditor — nunca esta máquina — declara conclusão/freeze.
