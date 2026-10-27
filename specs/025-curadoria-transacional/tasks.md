# Tarefas — 025-curadoria-transacional

> Fase 3 · dono: tech-lead · ids `[TNNN]` são permanentes; wave final é sempre
> validação. Consome o [plan.md](plan.md) (portão da Fase 2: *"Aprovado
> (Recomendada)"*, usuário, 2026-10-27, `refinement.md:424`) e a [spec.md](spec.md)
> (portão da Fase 1: *"Aprovado, com a extensão (Recomendada)"*, `refinement.md:423`).
> Nada dos portões se reabre aqui: nenhum critério, gate, mutante, texto, dono de
> módulo ou autorização muda — este artefato fixa **ordem, commit, repin, o que cada
> tarefa deixa medível e onde a Fase 6 vai olhar**. O tech-lead **propõe**; quem
> delega é o orquestrador (R5).
>
> **Quem escreveu**: o `tech-lead`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-10-27, sob delegação do orquestrador, na worktree
> `phase5-sel`, branch `feature/025-curadoria-transacional`. Só leitura e medição;
> nada commitado, repinado ou alterado fora deste arquivo.
>
> **Árvore medida — e ela mudou durante a Fase 3.** A delegação chegou com HEAD
> `e734810`; durante a escrita a branch foi **rebaseada** sobre `origin/develop`
> (reflog: `rebase (start): checkout origin/develop` em **`da71759`** = merge do
> **#113**, `2026-10-27 18:29:17 -0300`; oito *picks*, nenhum conflito). HEAD agora é
> **`395942a`**, merge-base `da71759`, **8 à frente · 0 atrás**. Ou seja: **W0.2 e W0.3
> do plano já foram executadas** (#112 = `6933179`, #113 = `da71759`, ambos *merge
> commits* — R14 satisfeita; `pins.json` **não conflitou** porque nenhum repin da 025
> existia) e entram abaixo como **registro medido**, não como pendência. Os SHAs
> citados nos cabeçalhos da spec/plano e no planning-state (`d695dbb`, `2c47545`,
> `b0c5703`, `520f20d`, `2a06ef3`, `e734810`) vivem só no reflog; os equivalentes
> byte-idênticos são `31af3f5`, `eeee301`, `989b2b9`, **`31e60b9`** (spec),
> **`79d0c26`** (revisão do PO), **`dbf0059`** (portão F1), **`29be723`** (plan),
> **`395942a`** (portão F2). Medido no HEAD novo: `check_baseline.py` →
> `519/520 pins conferem · 1 divergentes (CONTEXT.md) · 0 ausentes · 3 sem pin`
> (refinement, spec, plan); `check_lint_arch.py` → `[OK]   9 módulos novos
> (ui_*_v32.js menos 6 legados 4.x): zero innerHTML= e IIFE presente` (o #113 já
> alcança `ui_curation*`); `git diff --name-only origin/develop HEAD` = planning-state,
> `CONTEXT.md`, `specs/025/*` — **interseção com `targets` de todo harness = ∅**
> (nenhuma campanha dispara hoje); `git status --short` vazio. `tests_session_m48.js`,
> `tests_p50_core.js`, `ui_session_v32.js`, `ui_ux_v32.js`, `ui_v32.js`,
> `ui_curation*_v32.js` e `tests_019_curadoria.js` são byte-idênticos a `cee02e9` —
> toda linha citada pelo plano continua válida.
>
> **Duas correções ao plano, medidas aqui e declaradas em DEPENDÊNCIAS** (o plano
> aprovado recebe nota `*(Fase 3 …)*` pelo orquestrador; nenhum dono, wave ou
> critério muda): (1) `check_suites.py:50-56` **reprova `tests_*.js` fora do
> registro** — o stage `suites` fica **vermelho, nomeado,** do commit do red (T013)
> até o registro (T084), como a `d019` ficou da W1 à W7 (`expected_suites.json →
> d019._trilha`; spec 019 E2): a coluna *"suites: verde (d025 não registrada → não
> roda)"* da tabela do plano está errada; o stage é `heavy` e o hook Stop não o vê;
> (2) `D025-INV8(d)` lê `exemplo-completo.json`, que só ganha `reportCuration` em
> T070 — INV8 fecha na W7, não na W3 (10/16 após a W3, não 11/16). Mais um fato que
> o plano não previa: `tests_core_mutants.js:59` mata `CM1` por `/1 FAIL/` sobre a
> m48 inteira — entre T030 e T040, com a m48 em 96/97, a campanha `core` reporta
> **CM1 falso SOBREVIVENTE** (`2 FAIL`); fecha em T040. Está na janela abaixo.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | `build-engineer` | chore | | **Repin R0 — fecha a dívida dos portões** (R0, R0b e R0′ do plano **fundidos num só**, declarado: o R0 do portão da Fase 2 não foi executado e o rebase não conflitou `pins.json`). **Depende de:** commit do `tasks.md` pelo orquestrador no portão. Medido hoje: `519/520 · 1 divergente (CONTEXT.md, editado na Fase 0) · 3 sem pin`; o commit deste arquivo deixa **4 sem pin**. Pré-condição mecânica: porcelain vazio — `gen_pins.py:72-79` recusa **qualquer** pendência fora de `pins.json`, inclusive planning-state e `??`; nunca `--force`. Mensagem: `chore(025): gen_pins — R0 (CONTEXT.md, refinement, spec, plan, tasks; R0b/R0′ absorvidos — o rebase de 18:29 não conflitou pins.json)` | stage `baseline` |
| T002 | 0 | orquestrador (skill `new-demand`) | chore | | Planning-state: `tasks.status: approved` + `approved_at` (aprovação **literal** do usuário no chat) + `phase: red`; em `tasks.notes`, o registro de que W0.2/W0.3 foram executadas antes deste artefato (`6933179`, `da71759`, rebase 18:29:17 -0300, sem conflito). **Commit próprio, depois de T001** (a edição suja a árvore que o R0 exige limpa); sem repin (`.claude/project-memory/**` fora do registry). **Depende de:** T001 | stage `state` |
| T003 | 0 | **`usuário`** | chore | | **EXECUTADA antes deste artefato — registro, não pendência.** Mesclar #112 (`chore/registro-auditoria-codex`) e #113 (`fix/EA-101-lint-arch-modulos-novos`) em `develop` **sem squash** (R14). Medido em `origin/develop`: `6933179 Merge pull request #112`, `da71759 Merge pull request #113` — *merge commits*, histórico dos dois PRs preservado (`433a9d2`, `ecbd23b`, `1def6a9`… alcançáveis). Nada a fazer; a linha existe porque ato humano fora do repositório é tarefa nomeada | R14 · pré-condição de T004 |
| T004 | 0 | `build-engineer` | chore | | **EXECUTADA antes deste artefato (rebase); resta a conferência.** `git rebase origin/develop` em `da71759`, oito *picks* limpos (reflog 18:29:17); os commits do #112 que a branch carregava saíram por identidade; `pins.json` não conflitou ⇒ **R0′ não existe**. Conferir (nada escrito): `git merge-base HEAD origin/develop` = `da71759…`; `git rev-list --count HEAD..origin/develop` = `0`; `python .claude/verify/check_lint_arch.py` imprime `[OK]   9 módulos novos (ui_*_v32.js menos 6 legados 4.x): zero innerHTML= e IIFE presente`; `bash .claude/verify/run.sh --light` todos PASS **exceto** `baseline` até T001. Se a `develop` voltar a mover antes do PR (T095), o rebase repete-se **antes** de qualquer commit de red e vai ao relatório como desvio classe (a) — depois do red, só *merge* (o SHA do red tem de sobreviver: `check_tdd.py:32`) | stage `baseline` · `lint-arch` |
| T005 | 0 | `tech-lead` (PO lê) | doc | | **CONDICIONAL — só se o usuário cortar P5-`draft`** (não cortou: o plano foi aprovado *com* o `draft`; "severável" é a forma do corte, não licença — spec §Erratas). Se cortar: errata **E0** na spec (retira `D025-TRN2`, aposenta **M15** — id nunca reutilizado —, retira `discardDraft`/`hasDraft`, `ui_v32.js` sai de `targets` de `harnesses.d025`, da lista de repins e da nota E7; `EA-107` fica `aberto`, alínea "não executada") **e** este `tasks.md` consolidado **no mesmo commit** (T060/T061 riscadas com a razão, R7 some, 16 → 15 em toda contagem, M15 riscado em §Estado do mundo e §Medível, T084 com 22 mutantes) + repin **R0a**. **Antes do red** (T013): o `spec-validate` extrai critérios da spec e classificaria TRN2 ausente como *faltando*; o QA precisa saber que escreve 15 gates. Se não cortar, esta linha fica como registro de que a condição não ocorreu. **Depende de:** T002 | `D025-TRN2` (saída) · stage `baseline` |
| T010 | 1 | `qa-engineer` | chore | `[P]` | **Medir antes — a régua das âncoras alheias** (nada escrito na árvore rastreada). `node tests_0NN_mutants.js --preflight` para **d009, d010, d015, d019, d021, d022, d023** ⇒ `ok == total` em todos (19 · 24 · 15 · 17 · 8 · 13 · 12); `core` não tem preflight: as 3 âncoras contam-se por `grep -c` no fonte (`CM1` ⇒ `ui_session_v32.js:231`; `CM2` ⇒ `publishableStats` em `ui_v32.js`; `CM3` ⇒ `ui_refinement_v32.js`). Mais três réguas desta demanda: `grep -c "  if (draft !== null){" ui_v32.js` = **1** (âncora de `tests_p52_mutants.js:1172`); `grep -rln "Respostas, observa" tests_*.js tests_visual/` = **0 arquivos** (medido hoje; mitigação `EA-62`); `grep -n "hasDraft\|discardDraft" ui_*.js` = só `ui_p52_workspace_v32.js:2015` (comentário). Saída → `red-025.md` §0 (nasce em T013). **Depende de:** T002 (T005 se houver) | `IC-4`/C1 da 013 (régua) |
| T011 | 1 | `qa-engineer` | chore | `[P]` | **Protótipo P1** — `prototype/025-seletor-file-text`, pergunta e critério **exatos** do plano §Protótipo P1. Clone efêmero (`git clone -q --no-hardlinks -b feature/025-curadoria-transacional <git-common-dir> <tmp>`; `git update-ref refs/remotes/origin/develop da71759`; `NODE_PATH` → `node_modules` da worktree — receita de `red-017.md`); nada vira produção; `git status` da worktree limpo ao fim. Resposta registrada como **número**: SIM/NÃO, nº de *ticks* até `#ux-modal` com `Importar sessão`, contador de escritas = 0; se NÃO, qual fallback respondeu (`file.text = () => Promise.resolve(json)` na instância). Resultado → `red-025.md` §Protótipos; decide a forma de **VAL1(b)** e **NOP1** (prévia real) em T013. **PARADA**: se o fallback também der NÃO, expor `openImportPicker` em `__DEV` é edição de produto para fins de teste — decisão do orquestrador/usuário, não do QA. **Depende de:** T002 | `D025-VAL1(b)` · `D025-NOP1` (forma) |
| T012 | 1 | `qa-engineer` | chore | `[P]` | **Protótipo P2** — `prototype/025-falha-sintetica-fromsession`, pergunta e critério do plano §Protótipo P2, mesmo clone efêmero. Números a registrar: contador do embrulho em (a) `validateSessionDocument(F-A)` = **1**; em (b) `restoreCanonicalOwners(snap)` = **1** e `state()` = o do `snap`; **(b′)** chamadas ao bridge com `snap.curadoria === undefined` hoje = **0** (é a contrafactual que `M22` reintroduz — registrada como número). Se o contador der **0** (referência capturada no topo do módulo), o *contrato de instrumentabilidade* do plano vai como **asserção** no prompt de T030/T040; se a propriedade não for gravável, **PARADA** (a hipótese "objeto literal" do plano cai). Resultado → `red-025.md` §Protótipos; decide a forma de **TRX2(b)(b′)**. **Depende de:** T002 | `D025-TRX2(b)(b′)` (forma) |
| T013 | 1 | `qa-engineer` | **feature** | | **RED — `tests_025_curadoria_sessao.js` (novo): os 16 gates `D025-*`** exatamente como spec §Critérios (VAL1, VAL2, CAN1, TRX1, TRX2, AUS1, INV8, NOP1, NEW1, RST1, TRN1, TRN2, PRV1, UNS1, GAT1, DOC1), fixtures `F-*` da spec (construídas na suíte; nenhuma sessão real — R11), oráculos **independentes** (bridge, DOM, papel após `beforeprint`, `captureCanonicalInputs` entre janelas; contador de chamadas por **embrulho de propriedade lida na chamada**), `vac()` para vacuidade nomeada (AUS1(c) ≥ 9 cards; GAT1 `data-p50-gate==="blocked"`; INV8 `offered()[0]`), padrão `tests_019_curadoria.js:50-70` (`T()`, `boot(opts)`, `D025_HTML_OVERRIDE`, `D025_ONLY`, **`D025_DOC_OVERRIDE`** para as alíneas documentais); **última linha** no formato que `check_suites.py:23` lê: `D025 CURADORIA SESSAO: <n> PASS · <m> FAIL de 16`. Restrições não negociáveis: não escreve na árvore (R7 §3); caminhos entre aspas (R10 §7); **não spawna suíte** (R10 §6); nenhum hash inline (R10 §4); janelas fechadas por gate (`w.close()`) — **medir a duração** e registrá-la. Também **`red-025.md`** (novo; §0 réguas de T010, §Protótipos P1/P2, §d025 saída integral, por alínea; `git hash-object` da suíte). Executar `node tests_025_curadoria_sessao.js` ⇒ esperado **1 PASS (GAT1, verde declarado) · 15 FAIL de 16** — leitura canônica **por alínea**: o QA nomeia quais alíneas de cada gate estão vermelhas (INV8 certamente em (d); (b)/(c) **a medir** — o produto de hoje aplica A sobre B pelo validador e pode deixá-las verdes; isso não muda a contagem por gate). **Divergência de contagem: declarar, nunca ajustar** (R10 §1) ⇒ **PARADA** para o orquestrador decidir (errata tardia de W0 ou achado). **Commit do red**: `test(025): red — D025-* (16 gates; GAT1 verde declarado) + red-025.md`. **Depende de:** T010, T011, T012 (as respostas decidem a forma de VAL1(b)/NOP1/TRX2(b)) | `D025-*` (16) · R3 §4 |
| T014 | 1 | `build-engineer` | chore | | **Repin R1** — fecha T013 (`tests_025_curadoria_sessao.js`, `red-025.md`). `chore(025): gen_pins — R1 (red: suíte d025 + red-025.md)`. **Depende de:** T013 | stage `baseline` |
| T015 | 1 | `qa-engineer` | **fix** | | **`tests_session_m48.js` (§29.4, autorizado 2026-10-27) — as quatro reancoragens** da spec §Reancoragens: **S50(b)** (lista de **11** chaves `ans,arch,arq,curadoria,landscape,notes,platforms,priorities,refinement,signals,targetOverrides` **e** `"curadoria" in cand` com valor `undefined` quando o documento não traz a chave), **S69(b)** (comportamental: `richLandscape` + curadoria A → `snap` → zerar **cada** owner inclusive `__CURATION.clear()` e `step` → `restore` → `captureCanonicalInputs()` + `derivedModel()` + `state()` + `step` iguais ao pré), **S30(b)** (janela virgem com **só** curadoria por bridge ⇒ `sessionHasContent()===true`, modal `substituirá a sessão atual`, botão `Importar e substituir`), **S31-S32 curada** (`richSession` + `__CURATION.set` antes de `buildSessionDocument`; `afterRestart`/`afterNew` ganham `toSession()===undefined` e `decisions` vazio) e **uma linha** em `:3`: `process.env.M48_HTML_OVERRIDE || path.join(__dirname, …)`. **Nenhuma alínea antiga afrouxada; literais intactos**; regra "onde havia UMA asserção passa a haver DUAS" (T012 da 019). Heap: `node --max-old-space-size=6144`; se estourar (`Ineffective mark-compacts`), as alíneas novas **fecham janela**, não sobem o heap (subir é último recurso, declarado na `_trilha` em T084). `red-025.md` ganha §m48 (saída integral; `git hash-object` da suíte). Executar ⇒ esperado **94 PASS · 3 FAIL de 97** — FAIL **S50, S30, S31-S32**; **S69(b) verde declarado** (poder vem de M6 sob m48). Divergência ⇒ PARADA (R10 §1). Commit: `test(025): red — reancoragens S50/S69/S30/S31-S32 na m48 (§29.4 autorizado 2026-10-27) + M48_HTML_OVERRIDE`. **Nenhum commit toca este arquivo depois** (R3 §2, modelo 017: os greens vêm de `ui_session`/`ui_ux`, por outro agente). **Depende de:** T014 | `S50` · `S69` · `S30` · `S31-S32` · R3 §4 |
| T016 | 1 | `build-engineer` | chore | | **Repin R2** — fecha T015 (`tests_session_m48.js`, `red-025.md`). `chore(025): gen_pins — R2 (reancoragens m48)`. **Depende de:** T015 | stage `baseline` |
| T017 | 1 | orquestrador (skill `new-demand`) | chore | | Planning-state: `red.status: proven`, **`red.commit: <SHA completo de T015>`** (a árvore nele contém os 19 vermelhos; `notes` cita o SHA de T013 e separa **vermelho na árvore** de **verde declarado** — GAT1, S69(b)), `red.gates`: os 16 `D025-*` + `S50`, `S30`, `S31-S32`; `phase: implement`. Commit próprio; sem repin. `python .claude/verify/check_tdd.py` ⇒ `[OK]   025-curadoria-transacional.json: red provado e commitado (<sha>…)`. **A W2 só começa depois deste commit.** **Depende de:** T016 | stage `state` · `tdd` |
| T020 | 2 | `core-engineer` | **feature** | | **`ui_curation_v32.js` — o bridge valida sem aplicar.** Nasce **`validate(obj)`** (puro: não lê nem escreve `estado`; precedência das recusas = plano §Contratos 1→6; as **oito mensagens** com o texto exato de spec §Mensagens; chave desconhecida ⇒ `reportCuration: campos não reconhecidos: <k1>, <k2>` na ordem de `Object.keys` — M23), **`unset(id)`** (`delete decisions[id]`, devolve `true`, lança `curadoria: id fora do catálogo: <id>`), **`unsetArchitectureNote()`**; **`fromSession`** revisto (`undefined` ⇒ zera e devolve `[]`; `erros = validate(obj)`; não vazio ⇒ devolve **sem tocar o estado**; vazio ⇒ substitui o estado inteiro, nunca merge). `valido()` `:133-138`, `paraSessao` `:178-183`, `set`/`setArchitectureNote`/`clear`/`contract` **inalterados**. **Contrato de instrumentabilidade**: o bridge continua objeto literal com propriedades graváveis, `__installed` como hoje. IIFE + `__installed`; zero `innerHTML=`; 243 → ≈ 300 linhas; helper único da validade (R9 §8). **Rebuild no mesmo commit** (`python build_v32_html.py`; o HTML dev viaja com o módulo — rito `aef6ff3`/`f10f60b`/`7e75cce`). **Gate no prompt**: `D025-VAL2`, `D025-CAN1`, `D025-UNS1(e)` + §Estado do mundo M2/M3/M5/M9/M23 ("o que não fazer"). Medir antes do commit: `D025_ONLY=D025-VAL2,D025-CAN1 node tests_025_curadoria_sessao.js` ⇒ `2 PASS · 0 FAIL de 2`; UNS1 FAIL nomeando só (a)–(d); `node tests_019_curadoria.js` ⇒ `14 PASS · 0 FAIL`; `--preflight` de **d019 17/17 · d022 13/13 · d023 12/12** `ok`; `python .claude/verify/check_build.py` verde; `check_lint_arch.py` ⇒ `9 módulos novos … IIFE presente`; m48 ainda **94/97**. Commit: `feat(025): W2 — __CURATION.validate puro, unset, unsetArchitectureNote; fromSession recusa sem tocar o estado`. **Depende de:** T017 | `D025-VAL2` · `D025-CAN1` · `D025-UNS1(e)` |
| T021 | 2 | `build-engineer` | chore | | **Repin R3** — fecha T020 (`ui_curation_v32.js` + HTML). `chore(025): gen_pins — R3 (ui_curation + HTML)`. **Depende de:** T020 | stage `baseline` |
| T030 | 3 | `core-engineer` | **feature** | | **`ui_session_v32.js` (§29.4, autorizado 2026-10-27) — a sexta chave nos quatro lugares onde as outras dez já estão**, exatamente a tabela *onde cada linha entra* do plano: `validateSessionDocument` `:237-242` → `window.__CURATION.validate(I.reportCuration)` (o `err("…modulo de curadoria nao esta disponivel")` `:238-239` **permanece**; comentário `:232-236` reescrito); `normalizeSessionDocument` `:533-541` → `curadoria` **sempre própria** (`undefined` ou cópia profunda); `snapshotCanonicalOwners` `:585-586` → `toSession()`; `restoreCanonicalOwners` `:601-602` → `fromSession(snap.curadoria)` **sem** a guarda `&& snap.curadoria` (ERR-1, confirmado pelo PO); `commitCanonicalOwners` → dentro do `try`, **após** `:619` (`OPERATIONAL_REFINEMENT`) e **antes** de `:620` (`tgtNotices = []`): `if (window.__CURATION) window.__CURATION.fromSession(cand.curadoria);`; transientes: `prioLimitHit = false;` e `if (window.__V32UI && typeof window.__V32UI.discardDraft === "function") window.__V32UI.discardDraft();`; `sessionPreview` → `curation: doc.inputs.reportCuration !== undefined`; `showImportPreview` → `<li>Curadoria do relatório: ${yn(p.curation)}</li>` **após** *Aprofundamento*, no template existente (não é `innerHTML =` novo); `sessionHasContent` → `|| (typeof window !== "undefined" && window.__CURATION && window.__CURATION.toSession() !== undefined)`; comentários `:3`, `:565-569`, `:582-584` passam a descrever o código. **Preservar byte a byte**: `:231` (âncora `CM1`, `tests_core_mutants.js:55`), `:76` (`out.reportCuration = cur;`, âncora `D019-M3`); `snapshotCanonicalOwners()` continua a **primeira** instrução do commit; literais `substituirá a sessão atual`/`Importar e substituir`. Toda chamada ao bridge **por propriedade no momento da chamada** (nunca `const { fromSession } = …`) — se P2 (T012) deu contador 0, isto é **asserção** do prompt. Rebuild no mesmo commit. **Gate no prompt**: VAL1, VAL2(c), CAN1, TRX1, TRX2, AUS1, INV8(a)(b)(c), NOP1, TRN1, PRV1, GAT1 + **S50, S30** + §Estado do mundo M1/M4/M6/M7/M8/M10/M14/M16/M17/M19/M22. Medir antes do commit: `node tests_025_curadoria_sessao.js` ⇒ esperado **10 PASS · 6 FAIL de 16** (FAIL: INV8 **só por (d)**, NEW1, RST1, TRN2, UNS1, DOC1); `node --max-old-space-size=6144 tests_session_m48.js` ⇒ **96 PASS · 1 FAIL** (só S31-S32); `node tests_p50_core.js` ⇒ **64 PASS · 1 FAIL** (P50-GOV1 nomeando `ui_session_v32.js` — janela prevista, fecha em T080); `grep -c 'if (hasReservedDerived(I,0)) return err(' ui_session_v32.js` = 1; `node tests_019_mutants.js --preflight` 17/17; `check_build.py` verde. Commit: `feat(025): W3 — a curadoria entra no candidato, no snapshot, no commit e no rollback (ui_session, §29.4)`. **Depende de:** T021 | `D025-VAL1` · `TRX1` · `TRX2` · `AUS1` · `INV8(a)(b)(c)` · `NOP1` · `TRN1` · `PRV1` · `GAT1` · `S50` · `S30` |
| T031 | 3 | `build-engineer` | chore | | **Repin R4** — fecha T030 (`ui_session_v32.js` + HTML). `chore(025): gen_pins — R4 (ui_session + HTML)`. **Depende de:** T030 | stage `baseline` |
| T040 | 4 | `core-engineer` | **feature** | | **`ui_ux_v32.js` (§29.4, autorizado 2026-10-27) — ciclo de vida.** `uxResetAssessment` `:17-22`: depois de `arq=null;` e antes de `step=-1; render();` → `if (window.__CURATION) window.__CURATION.clear(); if (window.__V32UI && typeof window.__V32UI.discardDraft === "function") window.__V32UI.discardDraft();`; `uxNewSession` `:23-30`: idem, depois de `V32.resetLandscapeToUnset();`. `:55` → **exatamente** `Respostas, observações, prioridades e a curadoria do relatório serão limpas. O contexto tecnológico declarado será preservado.`; **`:61` não muda** (UX21, `tests_ux_m41.js:203`). Zero CSS/layout/a11y — a mudança é ciclo de vida do estado (por isso `core-engineer`, R5). **Antes do commit**: `grep -rln "Respostas, observa" tests_*.js tests_visual/` = 0 arquivos. Rebuild no mesmo commit. **Gate no prompt**: `D025-NEW1`, `D025-RST1` + **S31-S32** + M11/M12/M13. Medir: d025 ⇒ **12 PASS · 4 FAIL** (TRN2, UNS1, INV8(d), DOC1); m48 ⇒ **97 PASS · 0 FAIL** (fecha a janela da m48); `node tests_ux_m41.js` ⇒ **56 PASS · 0 FAIL**; p50core **64/65** (GOV1 nomeia agora `ui_session_v32.js` **e** `ui_ux_v32.js`; IC4 lê só `ui_v32.js`). Commit: `feat(025): W4 — Nova sessão e Reiniciar limpam a curadoria e descartam o draft; o diálogo de Reiniciar a nomeia (ui_ux, §29.4)`. **Depende de:** T031 (independe de W3 em lógica; serial pelo repin — `gen_pins.py` recusa pendência alheia) | `D025-NEW1` · `D025-RST1` · `S31-S32` · UX21 (intacto) |
| T041 | 4 | `build-engineer` | chore | | **Repin R5** — fecha T040 (`ui_ux_v32.js` + HTML). `chore(025): gen_pins — R5 (ui_ux + HTML)`. **Depende de:** T040 | stage `baseline` |
| T050 | 5 | `ui-engineer` | **feature** | | **`ui_curation_edit_v32.js` — o editor escreve só a divergência** (tabela fechada do plano §editor): handler de `:86-88` → ofertado (`ofertado === true`, `:78`): marcado ⇒ `b.unset(id)`, desmarcado ⇒ `b.set(id,"exclude")`; não ofertado: marcado ⇒ `b.set(id,"include")`, desmarcado ⇒ `b.unset(id)`; handler de `:181` → marcado ⇒ `b.unsetArchitectureNote()`, desmarcado ⇒ `b.setArchitectureNote("exclude")`. **Não mudam**: `gateFechado()` `:62-65` (âncora `D019-M10`), `decorar()` `:216-217`, `try/catch` + `redesenhar()` dos handlers; zero `innerHTML=`; zero CSS. A tabela vem da spec — o handler só a aplica (não é decisão de estado). Rebuild no mesmo commit. **Gate no prompt**: `D025-UNS1(a)(b)(c)(d)` + M18. Medir: d025 ⇒ **13 PASS · 3 FAIL** (TRN2, INV8(d), DOC1); `node tests_019_curadoria.js` 14/14; `node tests_019_mutants.js --preflight` 17/17 (M10 intacta); `check_lint_arch.py` verde. Commit: `feat(025): W5 — o editor escreve só a divergência: toggle-back volta a ausente (ui_curation_edit)`. **Depende de:** T041 (precisa de `unset`, T020; serial pelo repin) | `D025-UNS1(a)(b)(c)(d)` · `d019` 14/14 |
| T051 | 5 | `build-engineer` | chore | | **Repin R6** — fecha T050 (`ui_curation_edit_v32.js` + HTML). `chore(025): gen_pins — R6 (ui_curation_edit + HTML)`. **Depende de:** T050 | stage `baseline` |
| T060 | 6 | `core-engineer` | **feature** | | **`ui_v32.js` (§29.4, autorizado 2026-10-27) — acessores do `draft`, wave própria e severável** (último conteúdo de produto: o corte, se vier, é truncamento). `function discardDraft(){ const had = draft !== null; draft = null; return had; }` e `function hasDraft(){ return draft !== null; }`; `:1688` → `window.__V32UI = { openEditor, esc32, iconFor, ARCH_FIELDS, publishableStats, discardDraft, hasDraft };`. **Nenhum outro símbolo**; os 9 `innerHTML=` legados ficam; **não repetir a forma `  if (draft !== null){`** (âncora `P52-…`, `tests_p52_mutants.js:1172`, `ocorrencias == 1`); `hasDraft()` tem zero chamadores (só a citação em `ui_p52_workspace_v32.js:2015`, que passa a ser verdadeira). Rebuild no mesmo commit. **Gate no prompt**: `D025-TRN2(a)(b)(c)` + M15. Medir: d025 ⇒ **14 PASS · 2 FAIL** (INV8(d), DOC1); `grep -c "  if (draft !== null){" ui_v32.js` = **1**; `--preflight` de **core (grep 3), d009, d010, d015, d019, d021, d022, d023, p51, p52** ⇒ `ok == total` (o preflight não exige Chromium; só âncoras); p50core ⇒ **63 PASS · 2 FAIL** (GOV1 + IC4 — previsto, fecha em T080); `check_build.py` verde. Commit: `feat(025): W6 — __V32UI.discardDraft()/hasDraft(): o draft morre com o commit, Nova sessão e Reiniciar (ui_v32, §29.4)`. **Depende de:** T051 (W2–W5 concluídas) | `D025-TRN2` |
| T061 | 6 | `build-engineer` | chore | | **Repin R7** — fecha T060 (`ui_v32.js` + HTML). `chore(025): gen_pins — R7 (ui_v32 + HTML; severável)`. **Depende de:** T060 | stage `baseline` |
| T070 | 7 | `doc-writer` | doc | | **E4 + E5, um commit.** `SESSION_SCHEMA_V32.md`: §4 (`:221`) *"cinco blocos"* + `reportCuration` **opcional**; §5 (`:226-241`) linha da sexta chave `curadoria do relatório · __CURATION (ui_curation_v32.js) · inputs.reportCuration · não` com o **mesmo número de células** das demais (S82); §8.4 (`:416`, `:428-430`) "snapshot antes de qualquer escrita **vale para a curadoria**" e a cobertura de rollback do item 5 nomeia `__CURATION`; §9 (`:436-442`) validação da curadoria (pura; formas recusadas; ausência legítima **e substitutiva** — a regex `ausên[cs]ia[\s\S]{0,160}substitu` de DOC1(b) tem de casar). Restrições: regexes S80/S81 (`:904-915`) e S82 (`:916-931`) satisfeitas; o bloco JSON de §3 continua **igual** a `exemplo-minimo.json` (S110); a curadoria entra como **fragmento** JSON ou prosa, nunca como 2º documento completo antes dele (S79). `synthetic_session_examples/exemplo-completo.json`: `reportCuration` válido — uma exclusão de ofertado + `architectureNote:"exclude"`; `toolVersion`/`engineSha256` **inalterados** (S109). Sem palavra do papel. Medir: `D025_ONLY=D025-INV8,D025-DOC1 node tests_025_curadoria_sessao.js` ⇒ INV8 **PASS**, DOC1 FAIL **só em (e)**; m48 ⇒ 97/97 (S79–S82, S109, S110). Commit: `doc(025): W7 — SESSION_SCHEMA_V32.md ganha a sexta chave (E4); exemplo-completo.json declara reportCuration (E5)`. **Depende de:** T061 (em lógica só de T017: DOC1(a)-(d)/INV8(d) não dependem de código; serial pelo repin) | `D025-INV8(d)` · `D025-DOC1(a)(b)(c)(d)` · S79–S82 · S109 · S110 |
| T071 | 7 | `build-engineer` | chore | | **Repin R8** — fecha T070. `chore(025): gen_pins — R8 (SESSION_SCHEMA + exemplo-completo)`. **Depende de:** T070 | stage `baseline` |
| T072 | 7 | `doc-writer` | doc | | **E6 — `USER_GUIDE.md` §11** (`:404-432`): `:417` *"Importar substitui a sessão ativa por inteiro"* ganha *"— inclusive a curadoria do relatório; o que o arquivo não declara volta a 'nada declarado'"*; nota de que **Nova sessão** e **Reiniciar avaliação** limpam a curadoria. O guia tem **0** ocorrências de `curadoria`/`Nova sessão`/`Reiniciar avaliação` (medido pela spec): a nota **abre pela definição do verbete** (`CONTEXT.md:210`, *Curadoria do relatório*), **sem a palavra do papel** (facilitador/operador/engenheiro); checklist A→B→A (`:419-426`) **inalterado**. Medir: `node tests_025_curadoria_sessao.js` ⇒ **16 PASS · 0 FAIL de 16**; `node tests_p50_core.js` ⇒ 63/65 com FAIL **só** GOV1/IC4 (nenhum `P51-DOC*`). Dispara **p51** (Chromium) — fecha no job `visual` (T095). Commit: `doc(025): W7 — USER_GUIDE §11: importar substitui também a curadoria; Nova sessão e Reiniciar a limpam (E6)`. **Depende de:** T071 | `D025-DOC1(e)` · `P51-DOC*` |
| T073 | 7 | `build-engineer` | chore | | **Repin R9** — fecha T072. `chore(025): gen_pins — R9 (USER_GUIDE)`. **Depende de:** T072 | stage `baseline` |
| T074 | 7 | `doc-writer` | doc | | **E1 + E2 — `specs/019-curadoria-do-relatorio/spec.md`**, molde da 009 (§Erratas da spec 025): seção nova `## Erratas da demanda 025 (2026-10-<dd>)` com cabeçalho de trilha (**quem decidiu**: o usuário, portão da Fase 1 da 025, 2026-10-27 — nunca "o TL"; **o que NÃO é reaberto**: C1–C2, C4–C9, C11, autorizações §29.4 da 019, todos os `D019-*`; **nenhuma redação original apagada**), `### E1` e `### E2` em tabela `Campo | Registro` (*O que estava escrito / Fato medido / O que passa a valer / Onde o gate afirma / Classe*); **e** nota inline na **célula do critério**: C3 (`:42`) *(Errata E1 · demanda 025: C3 medido pela metade — `spec-validate.md:13` apontou o restauro em `validateSessionDocument`, que é validador; a metade "import recomputa" passa a ser medida por `D025-INV8`/`D025-AUS1`; `D019-INV8` reduzido ao que mede)*; C10 (`:49`) *(Errata E2 · demanda 025: "o controle não existe e **o editor** não lê o estado" — `ui_curation_edit_v32.js:216-217`, `D019-SUF1`; `showResults` lê sob gate fechado — `EA-115`, fora)*. `spec-validate.md` da 019 **não** se reescreve (registro retrospectivo, R2 §5). **Prova mecânica antes do commit** (§Provas mecânicas, script `aditiva_025.py` copiado para tmp — nunca para a árvore): `python <tmp>/aditiva_025.py HEAD WORKTREE specs/019-curadoria-do-relatorio/spec.md` ⇒ `aditiva-025: 2 linha(s) alterada(s) por UMA inserção [42, 49] · <n> linha(s) nova(s) · 0 removida(s)/alterada(s) fora de UMA inserção [] · 0 inserção(ões) fora da forma []` e **exit 0**. Commit: `doc(025): W7 — erratas E1/E2 na spec da 019 (C3 medido pela metade; C10: o editor não lê)`. **Depende de:** T073 | E1 · E2 (leitura no `spec-validate`) |
| T075 | 7 | `build-engineer` | chore | | **Repin R10** — fecha T074. `chore(025): gen_pins — R10 (spec da 019)`. **Depende de:** T074 | stage `baseline` |
| T076 | 7 | `qa-engineer` | doc | | **E3 — `tests_019_curadoria.js:218-219`**: o título do `D019-INV8` passa a **`a sexta chave é ENTRADA canônica: exportada; id desconhecido recusado; nenhum derivado viaja`** (o texto exato da spec entra na string; o prefixo pode ficar) e o comentário de cabeçalho `/* ===== C3 … */` pode ganhar uma linha remetendo a `D025-INV8`/`D025-AUS1`. **Corpo byte-idêntico**; `D019-M3` continua o carrasco; contagem `d019` continua 14. Tipo `doc` porque **nenhuma asserção muda** (R3 §tipagem) — a prova é mecânica, não a palavra: `python <tmp>/corpo_019_inv8.py HEAD WORKTREE` ⇒ `corpo-019-inv8: janela de edição base :218-:219 → nova :218-:<219|220> · 217 linha(s) antes idênticas · corpo + resto idênticos (638 linhas) · título E3 presente` e exit 0; `node tests_019_curadoria.js` ⇒ 14/14; `node tests_019_mutants.js --preflight` ⇒ 17/17 `ok`. Commit: `doc(025): W7 — E3: título do D019-INV8 reduzido ao que o corpo mede`. **Depende de:** T075 | `d019` 14/14 · `D019-M3` (KILL em T084) |
| T077 | 7 | `build-engineer` | chore | | **Repin R11** — fecha T076. `chore(025): gen_pins — R11 (tests_019_curadoria, E3)`. **Depende de:** T076 | stage `baseline` |
| T080 | 8 | `build-engineer` | chore | | **Repin inline §29.4 em `tests_p50_core.js`** — conferir **os 15** de `PROTECTED` (`:82-642`) um a um contra `git show HEAD:<path>` (R2 §2, sha256 sobre o blob) e repinar **só os que divergirem** — esperados exatamente três: `ui_v32.js` (`:382`), `ui_ux_v32.js` (`:383`), `ui_session_v32.js` (`:550`) —, cada um com comentário-trilha no padrão `:85-103`: demanda 025, **autorização nominal do proprietário no chat, 2026-10-27, rodada 3 do refinamento** (*"Autorizo os quatro"*), o que mudou em uma linha, **`Identidade anterior: <hash>`** (precedente `0535775`, 022). Nenhuma asserção muda; `frozenSuites` `:648-651` intacto. Medir: `node tests_p50_core.js` ⇒ **65 PASS · 0 FAIL**; `git diff HEAD~1 -- tests_p50_core.js` só em três valores + três blocos de comentário. Commit: `chore(025): repin §29.4 inline de ui_v32.js, ui_ux_v32.js e ui_session_v32.js em tests_p50_core.js, com a autorizacao no proprio pin`. **Depende de:** T077 (último conteúdo dos três módulos foi T060; repin no meio seria trilha falsa) | `P50-GOV1` · `P50-IC4` · `p50core` 65/65 |
| T081 | 8 | `build-engineer` | chore | | **Repin R12** — fecha T080. `chore(025): gen_pins — R12 (tests_p50_core inline ×3)`. **Depende de:** T080 | stage `baseline` |
| T082 | 8 | `build-engineer` | chore | | **E7 — `.claude/verify/bridges.json`**: notas de `__V32UI` (`:7-10`) e `__CURATION` (`:71-74`) com o texto do plano §bridges.json (`[025] discardDraft()/hasDraft(): acessores do draft … nenhum outro modulo escreve draft` · `[025] validate(obj) e PURO e e a unica verdade sobre curadoria valida (R9 §8); fromSession recusa SEM tocar o estado … unset()/unsetArchitectureNote() devolvem ao ausente (toggle-back, D025-UNS1)`). Nenhum bridge novo; `owner` intactos. Medir: `python .claude/verify/check_lint_arch.py` ⇒ `[OK]   20 bridges em uso, todos registrados`; JSON válido. Commit: `chore(025): bridges.json — notas de __CURATION e __V32UI (E7)`. **Depende de:** T081 | stage `lint-arch` |
| T083 | 8 | `build-engineer` | chore | | **Repin R13** — fecha T082. `chore(025): gen_pins — R13 (bridges.json)`. **Depende de:** T082 | stage `baseline` |
| T084 | 8 | `qa-engineer` | chore | | **Harness + registros — UM commit (D4 da 013; `check_mutation.py:283-298` reprova `preflight: true` sem `--preflight` lido; `check_suites.py:50-56` reprova suíte fora do registro).** (1) **`tests_025_mutants.js`** (novo): os **23** mutantes `D025-M1…M23` da spec (coluna *Mutante previsto* + §Estado do mundo abaixo), âncoras por **texto estável** (nunca nº de linha — `EA-4`), runner no padrão `tests_019_mutants.js:272-440`: mutação em **cópia**, rebuild em `os.tmpdir`, gate apontado por `D025_HTML_OVERRIDE`, restauração conferida byte a byte, `--preflight` → JSON C1 com `ocorrencias == 1` **23/23**, três estados (DETECTADO · SOBREVIVENTE · NÃO EXECUTADO), `MUTATION_PY`/python resolvido como `:283-345`; **M20/M6/M11/M12/M16** com `suite: "tests_session_m48.js"`, `nodeArgs: ["--max-old-space-size=6144"]`, `M48_HTML_OVERRIDE` apontando o HTML mutado, `skipBuild: true` **só** no M20; **M21** muta cópia de `SESSION_SCHEMA_V32.md` num diretório tmp apontado por `D025_DOC_OVERRIDE`; **`reason` nominal por gate** (`/FAIL {2}D025-VAL1/`, `/FAIL {2}S50/`, `/FAIL {2}S69/`, `/FAIL {2}S30/`, `/FAIL {2}S31-S32/`…) — **nunca `/N FAIL/`** (é a regex de `CM1` que produz o falso sobrevivente da janela); última linha `D025 MUTATION [tests_025_mutants.js]: <d> DETECTADO · <s> SOBREVIVENTE · <x> NÃO EXECUTADO de 23`. (2) **`mutation_map.json → harnesses.d025`**: `cmd: "node tests_025_mutants.js"`, `preflight: true`, `targets` explícitos: `tests_025_curadoria_sessao.js`, `tests_025_mutants.js`, `tests_session_m48.js` (mutado por M20 ⇒ **não** insumo), `ui_curation_v32.js`, `ui_curation_edit_v32.js`, `ui_session_v32.js`, `ui_ux_v32.js`, `ui_v32.js`; `insumos.oraculo: ["tests_025_curadoria_sessao.js"]`; `requires: ["node","python"]`; `_trilha` com a medição (duração, heap, os cinco m48). (3) **`expected_suites.json`**: `suites.d025` `{cmd: "node tests_025_curadoria_sessao.js", pass: <fixado por execução — esperado 16>, fail: 0, _trilha}` e **`heavy.session` 97 refixado por execução** (`_trilha` datada: a janela 94→96→97, nunca rebaixada). (4) **`mutation-matrix.json`**: 23 pares `D025-M*` (harness `d025`, gate, `ultima_prova` com data medida) + `ultima_prova` das campanhas **re-executadas** (core, d019, d021, d022, d023, d009, d010, d015). **Campanha** (árvore limpa — `check_mutation.py:57-61`): `node tests_025_mutants.js --preflight` ⇒ 23/23 `ok`; `node tests_025_mutants.js` ⇒ **`23 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 23`** (≈ 20–25 min estimados; **medir**); **a primeira execução é registrada mesmo com sobrevivente** (R2 §1) — sobrevivente ⇒ diagnóstico de causa (gate ou hipótese), **nunca afrouxar** (precedente 023 M2/M2b); `MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py` ⇒ `d025` + as oito campanhas node KILL, `p51`/`p52` `[DEFER]`, `---- integridade: 0 problema(s) nomeado(s) ----`; `python .claude/verify/check_suites.py` ⇒ **18** `[OK]` incluindo `d025: 16 PASS · 0 FAIL` e **sem** `[FAIL] suíte fora do registro`; `check_suites.py --heavy` ⇒ `[OK]   session: 97 PASS · 0 FAIL`; `check_mutation_coverage.py` inalterado. Commit: `test(025): W8 — campanha d025 (23 mutantes), harnesses.d025, suites.d025 fixada por execução, heavy.session refixada, matriz`. **Depende de:** T083 (todos os greens; as 23 âncoras existem) | `D025-M1…M23` · `IC-4` · stage `suites` · `suites-heavy` · `mutation` · `tdd` (matriz) |
| T085 | 8 | `build-engineer` | chore | | **Repin R14** — fecha T084 (harness, `mutation_map.json`, `expected_suites.json`, `mutation-matrix.json`). `chore(025): gen_pins — R14 (harness d025 + registros)`. **Depende de:** T084 | stage `baseline` |
| T090 | 9 | `qa-engineer` | doc | | **`spec-validate.md`** (skill `spec-validate`, **somente leitura**; executor QA): itens = 16 critérios (C1–C16) + 4 reancoragens + erratas E1–E8 (E0 só se ocorreu) + contratos (bridge, `ui_session`, `__V32UI`) + registros (bridges, map, suites, matriz, pins) + *O que NÃO muda* (`SESSION_SCHEMA_VERSION = 1`, `paraSessao`, UX21, literais de S30, `err(…nao esta disponivel)`, engine/Camada 1 — `python .claude/verify/check_m41.py` verde; `D019-MED1` verde); cada item conferido por **execução ou leitura do fonte**, nunca pelo relatório de quem implementou (R2); gaps em UMA de três classes (**`spec-errada` ⇒ errata com aprovação do usuário, nunca gate afrouxado**). Com §Onde o spec-validate olha abaixo (o que já nasce defasado **não é gap**). `bash .claude/verify/run.sh` completo (local: `mutation` acusa `requires chromium` para p51/p52 — KI-3 — ou `[DEFER]` com `MUTATION_DEFER_MISSING=1`; tudo o mais verde) e `bash .claude/verify/compliance-audit.sh` 0 FAIL. Score < 100% ⇒ **uma** iteração (máx. 2; a 3ª escala ao usuário) — cada iteração é commit + repin classe (b). Commit: `doc(025): Fase 6 — spec-validate <n>/<N>`. **Depende de:** T085 | skill `spec-validate` · pipeline inteiro |
| T091 | 9 | `build-engineer` | chore | | **Repin R15** — fecha T090. `chore(025): gen_pins — R15 (spec-validate)`. **Depende de:** T090 | stage `baseline` |
| T092 | 9 | `product-owner` | doc | `[P]` | **Aceite de intenção** contra o `refinement.md` (casos 1–28, P1–P6 *adotadas como recomendadas*, ERR-1/ERR-2) e contra as 12 emendas `[PO 2026-10-27]` da spec — **lê; não escreve**. Veredito nos termos da R4: *"não encontrei objeção"* ou reprova nomeada; vai ao relatório final (T093) e ao planning-state (T095). `[P]` com T090 **ou** T093 — um escritor por vez na worktree. **Depende de:** T085 | R4 Fase 6 |
| T093 | 9 | `doc-writer` | doc | | **`relatorio-final.md`** (template): série de repins **executada × prevista** (R0–R16; desvios por classe (a)–(e), nomeados), **janela medida × esperada** (tabela abaixo, coluna a coluna, com os números reais), custo medido das campanhas, P1/P2 (respostas), o rebase de 18:29 e o mapa de SHAs antigos→novos, a leitura por alínea do red, o veredito do PO (T092). **`.claude/BACKLOG.md` — E8, só aqui, uma vez**: `EA-91`, `EA-92`, `EA-105`, `EA-106`, `EA-107`, `EA-108`, `EA-109`, `EA-111`, `EA-112`, `EA-113`, `EA-114` ⇒ `corrigido pela 025 (<gate>)` com o gate que o mede; **`EA-110`** ⇒ `corrigido pela 025 (P3, D025-UNS1)` **com a decisão citada** — não riscado (não foi refutado), não em `design-decisions.md`; **`EA-115`** permanece `aberto`, baixa; `EA-116` intocado. `bash .claude/verify/compliance-audit.sh --rule=backlog` ⇒ 0 FAIL **antes** do commit. Commit: `doc(025): Fase 6 — relatorio final e fecho dos EA-91/92/105..114 no BACKLOG (E8)`. **Depende de:** T091, T092 | relatório final · `--rule=backlog` |
| T094 | 9 | `build-engineer` | chore | | **Repin R16** — fecha T093. `chore(025): gen_pins — R16 (relatorio-final + BACKLOG)`. **Depende de:** T093 | stage `baseline` |
| T095 | 9 | orquestrador (skill `new-demand`) | chore | | **Push + PR + fecho de estado — antes do merge** (precedente `cdc8c0f`/`36c5774`, 023). `git push -u origin feature/025-curadoria-transacional`; `gh pr create --base develop` (o PR abre **só agora**, sobre o green — nenhum run de CI vê a janela); planning-state `pr_url`, `validate.conformance` (score de T090), `validate.status`, **`phase: done`** — commit próprio, sem repin; push. CI do PR: job **`verify`** verde (`mutation` com `[DEFER]` p51/p52 por `MUTATION_DEFER_MISSING=1`); job **`visual`** verde — **p51** (disparada por `ui_v32.js` e `USER_GUIDE.md`) e **p52** (por `ui_v32.js`) campanhas + suítes Chromium; job **`fecho`** verde depois do `done`. Medir: `gh pr checks <n>` ⇒ os três verdes; registrar o nº do run no planning-state `validate.notes`. **"Pronto" = job `visual` verde** (KI-3). **Depende de:** T094 | CI `verify` · `visual` · `fecho` · stage `state` |
| T096 | 9 | **`usuário`** | chore | | **Merge do PR `feature/025-curadoria-transacional → develop`** no GitHub — *"Create a merge commit"*, **nunca squash** (R14; E3: selagem squashed é inauditável) — só depois de T095 verde. Ato humano fora do repositório, por isso tarefa nomeada. Selagem/release da v3.2.11 **não** é desta demanda. **Depende de:** T095 | R14 · `check_fecho` FEC1 (pós-merge) |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## Tipagem auditável — por que cada tipo é o que é

| Tipo | Tarefas | Red que as cobre / por que não precisam |
|---|---|---|
| `feature` | T013 (a suíte nasce), T020, T030, T040, T050, T060 | **T013 + T015** (`red.commit` = SHA de T015): VAL2/CAN1/UNS1(e) → T020; VAL1/TRX1/TRX2/AUS1/INV8(a-c)/NOP1/TRN1/PRV1/GAT1 + S50/S30 → T030; NEW1/RST1 + S31-S32 → T040; UNS1(a-d) → T050; TRN2 → T060. O gate viaja no prompt pelo **id e caminho** (§O gate que viaja no prompt), nunca transcrito |
| `fix` | T015 | reancoragem **muda o que o gate mede** (S50 passa a exigir 11 chaves; S69 ganha alínea comportamental; S30/S31-S32 ganham sujeito) — exige red: é o próprio red (executado e commitado vermelho em S50/S30/S31-S32; S69(b) verde declarado com carrasco M6). Tratar reancoragem como inócua produziu o `M51-07` da 021 |
| `doc` | T005 (condicional), T070, T072, T074, T076, T090, T092, T093 | nenhuma asserção executável muda: T070/T072 são medidas por DOC1/INV8(d) **já existentes no red**; T074 é errata aditiva com prova mecânica; **T076 muda título e comentário com corpo byte-idêntico (prova mecânica)** — se o `corpo_019_inv8.py` acusar corpo diferente, a tarefa vira `fix` e exige red: PARADA |
| `chore` | T001–T004, T010–T012, T014, T016, T017, T021, T031, T041, T051, T061, T071, T073, T075, T077, T080–T085, T091, T094–T096 | repins (`gen_pins` é gerador), estado de processo, medições sem escrita, protótipos descartáveis, registro de contagem **verde** (T084: o oráculo de contagem nasce depois do green por desenho — spec 019 E2), repin inline §29.4 (só o **valor**, nunca a asserção — T080), atos humanos. Nenhum `tdd_waiver` previsto |

## Um módulo por delegação — conferido wave a wave

| Wave | Arquivo escrito | Dono único |
|---|---|---|
| 0 | `pins.json` · planning-state · (spec + `tasks.md`, só se E0) | `build-engineer` · orquestrador · `tech-lead` |
| 1 | `tests_025_curadoria_sessao.js` + `red-025.md` (T013) · `tests_session_m48.js` + `red-025.md` §m48 (T015) · `pins.json` (T014, T016) · planning-state (T017) | `qa-engineer` (os dois commits; `red-025.md` é registro do QA nos dois) · `build-engineer` · orquestrador |
| 2–6 | um módulo + HTML por wave (T020 · T030 · T040 · T050 · T060); `pins.json` a seguir | `core-engineer` ×4, `ui-engineer` ×1; `build-engineer` nos repins |
| 7 | `SESSION_SCHEMA_V32.md` + `exemplo-completo.json` (T070) · `USER_GUIDE.md` (T072) · `specs/019/spec.md` (T074) · `tests_019_curadoria.js` (T076) | `doc-writer` ×3, `qa-engineer` ×1 — **arquivos distintos, commits distintos, seriais pelo repin** |
| 8 | `tests_p50_core.js` (T080) · `bridges.json` (T082) · harness + `mutation_map` + `expected_suites` + `mutation-matrix` (T084) | `build-engineer` ×2, `qa-engineer` ×1 — `mutation_map.json`/`expected_suites.json`/matriz são **só do QA** nesta demanda (D4 da 013; precedentes 019 T022, 021, 022, 023); divergência do brief da Fase 2 (que previa `build-engineer`) já declarada no plano |
| 9 | `spec-validate.md` (T090) · `relatorio-final.md` + `BACKLOG.md` (T093) · planning-state (T095) | `qa-engineer` · `doc-writer` · orquestrador; `product-owner` **só lê** (T092) |

**`[P]` só em T010/T011/T012** (medição e protótipos em clone efêmero — ninguém escreve
arquivo rastreado) **e em T092** (o PO lê; um escritor por vez ao lado dele). W4/W5/W6
são módulos distintos sem dependência lógica entre si, mas `gen_pins.py:72-79` recusa
pendência alheia: dois escritores na mesma worktree tornam "um repin por commit de
conteúdo" mecanicamente impossível (017: reset + cherry-pick para desfundir). A
delegação diz **"commit, volte, repin, próxima"**. O orquestrador atualiza
`implement.waves_done` após cada wave em commit próprio (sem repin), nunca junto com
conteúdo.

## O gate que viaja no prompt (R3 §3)

O prompt leva o **id** e **estes caminhos** — nunca a asserção transcrita, nunca
implementação inline (R5 anti-patterns).

| Tarefa | Gates no prompt | Onde ler |
|---|---|---|
| T013 · T015 | todos os `D025-*`; S50(b), S69(b), S30(b), S31-S32 | spec §Critérios (tabela + *Nascem vermelhos*), §Reancoragens, §Mensagens, §Fixtures; plan §Contratos (precedência das recusas, contrato de instrumentabilidade), §Protótipo (P1/P2 — e as respostas em `red-025.md`); aqui §Estado do mundo |
| T020 | `D025-VAL2`, `D025-CAN1`, `D025-UNS1(e)` | spec §Contratos → *Bridge `__CURATION`*, §Mensagens; plan §Contratos → *Precedência das recusas* 1→6; aqui §Estado do mundo M2/M3/M5/M9/M23 |
| T030 | `D025-VAL1`, `TRX1`, `TRX2`, `AUS1`, `INV8(a)(b)(c)`, `NOP1`, `TRN1`, `PRV1`, `GAT1`, `VAL2(c)`, `CAN1` · S50 · S30 | plan §*`ui_session_v32.js` — onde cada linha entra* (tabela) + *por que a escrita fica depois dos owners e antes dos transientes*; spec §Comportamento → *Importar*; aqui M1/M4/M6/M7/M8/M10/M14/M16/M17/M19/M22 |
| T040 | `D025-NEW1`, `D025-RST1` · S31-S32 | plan §`ui_ux_v32.js`; spec §Comportamento → *Nova sessão · Reiniciar* (texto exato de `:55`); aqui M11/M12/M13 |
| T050 | `D025-UNS1(a)(b)(c)(d)` | plan §*`ui_curation_edit_v32.js` — tabela fechada do handler*; spec §Comportamento → *Editor*; aqui M18 |
| T060 | `D025-TRN2(a)(b)(c)` | plan §`__V32UI` (as duas funções, a restrição de âncora); spec §Contratos → *`ui_ux_v32.js` · `ui_v32.js` · `__V32UI`*; aqui M15 |
| T070 · T072 | `D025-DOC1(a)-(e)`, `D025-INV8(d)` | spec §Erratas E4/E5/E6 (restrições S79–S82, S109, S110); `CONTEXT.md:210` (verbete) |
| T074 · T076 | E1 · E2 · E3 | spec §Erratas E1/E2/E3; `specs/009-leitura-do-relatorio/spec.md` §Errata de fidelidade (molde); aqui §Provas mecânicas |
| T080 · T082 | `P50-GOV1`/`P50-IC4` · stage `lint-arch` | plan §Boundary (os três inline; `0535775`); plan §bridges.json (texto das notas) |
| T084 | `D025-M1…M23`; `IC-4`; `suites`/`suites-heavy` | spec §Critérios (coluna *Mutante previsto*) + §Reancoragens (coluna *Carrasco*); plan §*Quando o harness nasce*, §Tabela de gatilho; aqui §Estado do mundo (uma linha por mutante) |

## O estado do mundo que reprova cada gate — produzido e medido, nunca raciocinado

Uma linha por mutante da spec (ids permanentes `D025-M1…M23`). Coluna **hoje?**: se o
produto de hoje **é** esse estado, o red (T013/T015) o mede **na árvore real** — é a
metade do red que não depende de cópia; se **não**, o único carrasco é a campanha
(T084) e isso fica dito. Nenhum gate ficou sem estado produzível; dois nascem verdes
(GAT1, S69(b)) e o poder deles está **só** na coluna da direita — declarado, como em
`D015-NOSUB1`/019 T004.

| Mutante | Gate · alínea | O que muta (arquivo) | Estado que reprova — forma esperada da falha | Hoje? | Produzido em | Medido em |
|---|---|---|---|---|---|---|
| M1 | VAL1 (a)(b)(c) | `ui_session_v32.js`: `validate` → `fromSession` no validador | contador de escritas ≥ 1 durante `validateSessionDocument`/prévia/`prepareSessionExport`; `state()` muda ao olhar o arquivo | **sim** (`:240`) | árvore real (T013); cópia (T084) | T013 `red-025.md`; T084; T090 |
| M2 | VAL2 (b)(c) | `ui_curation_v32.js`: `daSessao` zera **antes** de validar | `fromSession(F-inv-*)` devolve erros **e** `state()` ≠ pré; `importSessionDocument(F-inv-*)` apaga a seleção | **sim** (`:188`) | árvore real; cópia | T013; T084; T090 |
| M3 | CAN1 | `ui_curation_v32.js`: `validate` aceita `null`/`{}`/`{decisions:{}}`/`decisions` sem chaves como "vazio" | `validate(F-null…)` = `[]`; `importSessionDocument` ⇒ `ok:true` e curadoria A apagada | **sim** (`:189`, N2 da refutação) | árvore real; cópia | T013; T084; T090 |
| M23 | CAN1 (`F-extra`) | `ui_curation_v32.js`: `validate` ignora chave fora de `{decisions, architectureNote}` | `validate(F-extra.reportCuration)` = `[]`; import ⇒ `ok:true` | **sim** (`daSessao` lê só duas chaves) | árvore real; cópia | T013; T084; T090 |
| M4 | TRX1 (a)(b); (c)(d) | `ui_session_v32.js`: `curadoria` fora do `cand` (lista de 10) e do commit | `"curadoria" in cand` = `false`; `commitCanonicalOwners(cand)` não altera `state()` | **sim** (`:533-541`, `:609-621`) | árvore real; cópia | T013; T084; T090 |
| M5 | AUS1 (a) | `ui_curation_v32.js`: `daSessao` devolve `[]` **sem aplicar** (mutC) | nas três janelas sujas, `importSessionDocument(F-0)` ⇒ `ok:true` e `state()` **não** vazio | não (hoje aplica; AUS1 é vermelho hoje por **herança**, outro estado) | **só cópia** (T084) | T084; T090 |
| M6 | TRX2 (b) · **S69(b)** | `ui_session_v32.js`: snapshot `curadoria: null` + restore sem `fromSession` (mutB) | após falha sintética, `state()` ≠ B; S69(b): `state()` ≠ pré após `restore` — `FAIL  S69` sob `M48_HTML_OVERRIDE` | não | **só cópia** (T084, inclusive sob m48) | T084; T090 |
| M7 | TRX2 (a)(b) | `ui_session_v32.js`: `snapshotCanonicalOwners()` **depois** da primeira escrita | primeira escrita ocorre **antes** de qualquer `toSession`; rollback devolve o arquivo | **≈ sim** (a escrita de `:240` precede o snapshot de `:607`) | árvore real; cópia | T013; T084; T090 |
| M8 | TRX2 (a)(b) | `ui_session_v32.js`: `fromSession(cand.curadoria)` **fora** do `try` | idem M7; falha dela não desfaz os dez owners | **≈ sim** (aplicação em `:240`, fora da transação) | árvore real; cópia | T013; T084; T090 |
| M9 | INV8 (b) | `ui_curation_v32.js`: `daSessao` sem reset (merge, mutD) | `state().decisions` contém chave de B após importar A | não (hoje zera) — **INV8(b) pode nascer verde**; o QA declara em `red-025.md` | **só cópia** (T084) | T084; T090 |
| M10 | NOP1 (`F-engine`) | `ui_session_v32.js`: aplica a curadoria **antes** de `sessionCompatibility` | `importSessionDocument(F-engine)` ⇒ `ok:false` com `compat` **e** assinatura ≠ `pre` | **sim** (`:693` aplica, `:695` compat) | árvore real; cópia | T013; T084; T090 |
| M11 | NEW1 (a)(b) · **S31-S32** | `ui_ux_v32.js`: `clear()` ausente em `uxNewSession` | `toSession() !== undefined` após Nova sessão; `FAIL  S31-S32` (afterNew) sob m48 | **sim** | árvore real (T013, T015); cópia (T084, m48) | T013; T015; T084; T090 |
| M12 | RST1 (a) · **S31-S32** | `ui_ux_v32.js`: `clear()` ausente em `uxResetAssessment` | idem após Reiniciar; `FAIL  S31-S32` (afterRestart) | **sim** | idem | idem |
| M13 | RST1 (b) | `ui_ux_v32.js`: texto antigo de `:55` | modal sem o literal exato | **sim** | árvore real; cópia | T013; T084; T090 |
| M14 | TRN1 | `ui_session_v32.js`: `prioLimitHit = false` ausente do commit | `w.eval("prioLimitHit") === true` após import com `priorities: []`; aviso `Limite de 3 prioridades atingido` na tela | **sim** (`EA-108`) | árvore real; cópia | T013; T084; T090 |
| M15 | TRN2 (a) | `ui_v32.js`: `discardDraft` no-op | `hasDraft() === true` após commit/Nova sessão/Reiniciar; `preparePrint().blocked === true` | não — hoje a função **não existe** (TRN2 vermelho por `TypeError`, outro estado) | **só cópia** (T084) | T084; T090 |
| M16 | PRV1 (c) · **S30(b)** | `ui_session_v32.js`: `sessionHasContent` sem a curadoria | `false` com só curadoria declarada; botão `Importar` em vez de `Importar e substituir`; `FAIL  S30` sob m48 | **sim** (`EA-109`) | árvore real (T013, T015); cópia (T084, m48) | T013; T015; T084; T090 |
| M17 | PRV1 (a)(b) | `ui_session_v32.js`: `sessionPreview` sem `curation` / `<li>` ausente | `sessionPreview(F-A).curation !== true`; modal sem `Curadoria do relatório: sim` | **sim** | árvore real; cópia | T013; T084; T090 |
| M18 | UNS1 (a) | `ui_curation_edit_v32.js`: remarcar grava `include` explícito (`:87`) | `state().decisions[id] === "include"` em vez de ausente; export carrega a decisão | **sim** (`EA-110`) | árvore real; cópia | T013; T084; T090 |
| M19 | GAT1 | `ui_session_v32.js`: commit aplica a curadoria só com `data-p50-gate === "released"` | `state()` vazio após `importSessionDocument(F-insuf)` em janela `blocked`; export sem a chave | não — **GAT1 nasce verde** (hoje `:240` já retém) | **só cópia** (T084) | T084; T090 |
| M20 | **S50** | `tests_session_m48.js`: lista de **10** chaves ressuscitada | `FAIL  S50` com o produto verde (`skipBuild`, heap 6144) — prova que a reancoragem discrimina | não (muta o próprio julgador) | **só cópia** (T084, sob m48) | T084; T090 |
| M21 | DOC1 (a) | cópia de `SESSION_SCHEMA_V32.md` (`D025_DOC_OVERRIDE`): linha da sexta chave removida | DOC1(a) vermelho na cópia | **sim** na árvore (a linha não existe hoje — `EA-112` d) | árvore real (T013); cópia (T084) | T013; T084; T090 |
| M22 | TRX2 (b′) | `ui_session_v32.js`: guarda `&& snap.curadoria` reintroduzida em `restoreCanonicalOwners` | em janela "nada declarado", após falha sintética `toSession() !== undefined` (a curadoria do arquivo fica) — TRX2(b) e S69(b) **sobrevivem** a M22; só (b′) o mata | não alcançável hoje (o snapshot guarda `state()`, sempre truthy) — T012 mede **0** chamadas | **só cópia** (T084) | T012 (contrafactual = 0); T084; T090 |

Vácuos declarados para o portão: **nenhum gate sem carrasco**. Os dois verdes de
nascença (GAT1 ← M19; S69(b) ← M6) e os sete "só cópia" (M5, M6, M9, M15, M19, M20,
M22) dependem **exclusivamente** da campanha T084 — por isso T084 é indivisível e a
`ultima_prova` de cada par entra na matriz com data medida. Se o red (T013) mostrar
**INV8(b)/(c) verdes** hoje, isso vai dito em `red-025.md` e **não** muda o veredito
do gate (INV8 reprova por (d)) nem a contagem 1/16.

## O que cada tarefa deixa medível — comando → linha

Ao fim da tarefa, o comando imprime a linha; divergência é **declarada**, nunca ajustada.

| Id | Comando (raiz da worktree, árvore limpa) | Linha esperada |
|---|---|---|
| T001 | `python .claude/verify/check_baseline.py` | `baseline: 524/524 pins conferem · 0 divergentes · 0 ausentes · 0 sem pin` (520 hoje + refinement, spec, plan, tasks) |
| T002 · T017 · T095 | `python .claude/verify/check_state.py` · `python .claude/verify/check_tdd.py` | `state: <n> demanda(s) · 0 problema(s)` (nenhum `[FAIL] 025-…`); em T017 o `tdd` imprime `[OK]   025-curadoria-transacional.json: red provado e commitado (<sha12>…)`; em T095, `done` **com** `validate.conformance` (sem `done sem validate.conformance`) |
| T004 | `git merge-base HEAD origin/develop` · `git rev-list --count HEAD..origin/develop` · `python .claude/verify/check_lint_arch.py` | `da71759e31f0454bf8e08b403da538e4019568a8` · `0` · `[OK]   9 módulos novos (ui_*_v32.js menos 6 legados 4.x): zero innerHTML= e IIFE presente` |
| T010 | `node tests_0NN_mutants.js --preflight` (7 harnesses) · os três `grep` | `ok == total` em 19/24/15/17/8/13/12 · `1` · `0 arquivos` · só `ui_p52_workspace_v32.js:2015` |
| T011 · T012 | protótipos no clone efêmero; `git -C <worktree> status --short` | resposta SIM/NÃO + ticks (P1); contadores `1 · 1 · 0` (P2); worktree **vazia** |
| T013 | `node tests_025_curadoria_sessao.js` | última linha `D025 CURADORIA SESSAO: 1 PASS · 15 FAIL de 16`; `PASS  D025-GAT1 …` único verde |
| T014 · T016 · T021 · T031 · T041 · T051 · T061 · T071 · T073 · T075 · T077 · T081 · T083 · T085 · T091 · T094 | `python .claude/verify/check_baseline.py` | `N/N pins conferem · 0 divergentes · 0 ausentes · 0 sem pin` (N = 526 após R1 — suíte + `red-025.md` —, 527 após R14, 528 após R15, 529 após R16; os demais mantêm N) |
| T015 | `node --max-old-space-size=6144 tests_session_m48.js` | `SESSION 4.8: 94 PASS · 3 FAIL de 97`; `FAIL  S50 …`, `FAIL  S30 …`, `FAIL  S31-S32 …`; `PASS  S69 …` |
| T020 | `D025_ONLY=D025-VAL2,D025-CAN1 node tests_025_curadoria_sessao.js` · `node tests_019_curadoria.js` · `node tests_019_mutants.js --preflight` · `python .claude/verify/check_build.py` | `… 2 PASS · 0 FAIL de 2` · `D019 CURADORIA: 14 PASS · 0 FAIL de 14` · 17/17 `ok` · build idêntico |
| T030 | `node tests_025_curadoria_sessao.js` · m48 · `node tests_p50_core.js` · `grep -c 'if (hasReservedDerived(I,0)) return err(' ui_session_v32.js` | `10 PASS · 6 FAIL de 16` (FAIL: INV8, NEW1, RST1, TRN2, UNS1, DOC1) · `96 PASS · 1 FAIL` (S31-S32) · `64 PASS · 1 FAIL` (P50-GOV1) · `1` |
| T040 | d025 · m48 · `node tests_ux_m41.js` · `grep -rln "Respostas, observa" tests_*.js tests_visual/` | `12 PASS · 4 FAIL` (TRN2, UNS1, INV8, DOC1) · `97 PASS · 0 FAIL` · `56 PASS · 0 FAIL` · nenhum arquivo |
| T050 | d025 · `node tests_019_curadoria.js` · `node tests_019_mutants.js --preflight` | `13 PASS · 3 FAIL` (TRN2, INV8, DOC1) · 14/14 · 17/17 |
| T060 | d025 · `grep -c "  if (draft !== null){" ui_v32.js` · `--preflight` ×10 · `node tests_p50_core.js` | `14 PASS · 2 FAIL` (INV8, DOC1) · `1` · `ok == total` em todos · `63 PASS · 2 FAIL` (GOV1, IC4) |
| T070 | `D025_ONLY=D025-INV8,D025-DOC1 node tests_025_curadoria_sessao.js` · m48 | `1 PASS · 1 FAIL de 2` (DOC1 só por (e)) · `97 PASS · 0 FAIL` |
| T072 | `node tests_025_curadoria_sessao.js` · `node tests_p50_core.js` | **`16 PASS · 0 FAIL de 16`** · `63 PASS · 2 FAIL` (só GOV1/IC4) |
| T074 | `python <tmp>/aditiva_025.py HEAD WORKTREE specs/019-curadoria-do-relatorio/spec.md` (antes do commit); `… <SHA-T074>~1 <SHA-T074> <path>` (depois) | `aditiva-025: 2 linha(s) alterada(s) por UMA inserção [42, 49] · <n> linha(s) nova(s) · 0 removida(s)/alterada(s) fora de UMA inserção [] · 0 inserção(ões) fora da forma []` · `[OK]` · exit 0 |
| T076 | `python <tmp>/corpo_019_inv8.py HEAD WORKTREE` · `node tests_019_curadoria.js` · `--preflight` d019 | `corpo-019-inv8: janela de edição base :218-:219 → nova :218-:<219\|220> · 217 linha(s) antes idênticas · corpo + resto idênticos (638 linhas) · título E3 presente` · 14/14 · 17/17 |
| T080 | `node tests_p50_core.js` · `git diff --stat HEAD~1 -- tests_p50_core.js` | **`65 PASS · 0 FAIL`** · um arquivo, três hunks |
| T082 | `python .claude/verify/check_lint_arch.py` | `[OK]   20 bridges em uso, todos registrados` · `lint-arch: 0 problema(s)` |
| T084 | `node tests_025_mutants.js --preflight` · `node tests_025_mutants.js` · `python .claude/verify/check_suites.py` · `… --heavy` · `MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py` | JSON com 23 `"estado": "ok"` · `D025 MUTATION [tests_025_mutants.js]: 23 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 23` · `[OK]   d025: 16 PASS · 0 FAIL` + `suites[suites]: 0 problema(s)` · `[OK]   session: 97 PASS · 0 FAIL` · `d025` + 8 campanhas KILL, `[DEFER]` p51/p52, `---- integridade: 0 problema(s) nomeado(s) ----` |
| T090 | `bash .claude/verify/run.sh` · `bash .claude/verify/compliance-audit.sh` · `python .claude/verify/check_m41.py` | todos PASS exceto `mutation` local por `requires chromium` (nomeado; ou `[DEFER]`) · `0 FAIL` · payload M41 == pin |
| T093 | `bash .claude/verify/compliance-audit.sh --rule=backlog` | `0 FAIL` |
| T095 | `gh pr checks <n>` | `verify ✓ · visual ✓ · fecho ✓` |

## A janela vermelha, commit a commit — esperado; vira medido no relatório final

Vive **só na branch**: o hook Stop roda `--light --no-mutate` e **não vê** `suites`,
`suites-heavy`, `mutation`, `evidence-bridge` (os quatro `heavy`); `build` ele vê, e
fica verde porque o HTML viaja no commit do módulo; o CI roda em `pull_request`/
`push` para `develop`/`main` e o PR abre em T095. **Correções ao plano** marcadas ★.

| Após o commit de | `baseline` | `suites` (17 → 18) | `suites-heavy` m48 | `p50core` | `d025` direto | `mutation` local (campanhas exigidas) | `lint-arch`/`build`/`boundary`/`tdd`/`state` |
|---|---|---|---|---|---|---|---|
| hoje `395942a` | **FAIL** 1 div + 3 sem pin | verde (17) | 97/97 | 65/65 | — | nenhuma | verde |
| T001 R0 (+T002) | verde | verde | 97 | 65 | — | nenhuma | verde |
| T013 red + T014 R1 | verde | ★ **FAIL** `suíte fora do registro e das exceções nominais: tests_025_curadoria_sessao.js` (`check_suites.py:50-56`; rito da d019 W1–W7; `known_issues` **não** se usa — a janela é visível de propósito) | 97 | 65 | **1/16** | nenhuma (nada no diff é alvo) | verde; `tdd` verde após T017 |
| T015 m48 + T016 R2 | verde | FAIL idem | **94/97** (S50, S30, S31-S32) | 65 | 1/16 | **d019** exigida (alvo `tests_session_m48.js`) → 17/17 KILL (M11 lê `FAIL  S4-S5`, nominal) | verde |
| T020 W2 + R3 | verde | FAIL idem | 94/97 | 65 | **3/16** (VAL2, CAN1, GAT1) | d019, **d022**, **d023** | verde |
| T030 W3 + R4 | verde | FAIL idem | **96/97** (S31-S32) | **64/65** (GOV1) | ★ **10/16** (INV8 fecha só em T070) | + **core** — ★ **CM1 falso SOBREVIVENTE**: `tests_core_mutants.js:59` mata por `/1 FAIL/` e a m48 tem 1 FAIL próprio ⇒ `2 FAIL`. **Não medir `core` entre T030 e T040; se medido, declarar** — nunca tocar o harness alheio | verde |
| T040 W4 + R5 | verde | FAIL idem | **97/97** | 64/65 | **12/16** | core: CM1 **KILL** (m48 limpa) | verde |
| T050 W5 + R6 | verde | FAIL idem | 97 | 64/65 | **13/16** | d019 (alvo `ui_curation_edit`) | verde |
| T060 W6 + R7 | verde | FAIL idem | 97 | **63/65** (GOV1 + IC4) | **14/16** | + **d009, d010, d015, d021**; **p51/p52**: local `FAIL nomeado requires chromium` (KI-3) ou `[DEFER]` — fecham no CI `visual` | verde |
| T070 R8 (E4+E5) | verde | FAIL idem | 97 (S79–S82, S109, S110) | 63/65 | **15/16** | idem | verde |
| T072 R9 (E6) | verde | FAIL idem | 97 | 63/65 (sem `P51-DOC*`) | **16/16** | + **p51** por `USER_GUIDE.md` → CI | verde |
| T074 R10 · T076 R11 | verde | FAIL idem | 97 | 63/65 | 16/16 | d019, d023 (alvo `tests_019_curadoria.js`) | verde |
| T080 R12 (inline ×3) | verde | FAIL idem | 97 | **65/65** | 16/16 | d021 (alvo `tests_p50_core.js`) | verde |
| T082 R13 | verde | FAIL idem | 97 | 65 | 16/16 | idem | verde (`lint-arch` com as notas) |
| T084 R14 (registro) | verde | **verde — 18 suítes, `d025: 16 PASS · 0 FAIL`** | 97 **refixado** | 65 | 16/16 | **d025 23/23** + 8 re-executadas KILL; p51/p52 `[DEFER]` | verde; `mutation-coverage` inalterado |
| T090–T095 | verde | verde | verde | verde | 16/16 | local tudo node verde; p51/p52 só CI | `fecho`: `FECHO PENDENTE` até `done` (sinal próprio, D016-PR1) |

Os números de `d025`/m48/p50core são **esperados** e viram **medidos** em cada tarefa
(coluna *Medível*) e no relatório final; a contagem canônica **nunca** é rebaixada
durante o vermelho (R10 §1; `_trilha` de d009/d010/d011/d015). Custo residual a partir
de T015: toda medição completa re-executa d019 (≈ 6 min) e, de T060 em diante, oito
campanhas node (≈ 1 h) — é R3 §5, e o relatório final registra os tempos reais.

## Série de repins — 17, cada um amarrado ao commit que o precede

| Repin | Tarefa | Fecha o commit de | Arquivos pinados que mudam | Pins depois |
|---|---|---|---|---|
| R0 | T001 | `tasks.md` (portão da Fase 3) — **absorve R0, R0b, R0′ do plano** | `CONTEXT.md` (divergente desde a Fase 0), `refinement.md`, `spec.md`, `plan.md`, `tasks.md` | 524 |
| (R0a) | T005 | só se E0 | `spec.md`, `tasks.md` | 524 |
| R1 | T014 | T013 (red) | `tests_025_curadoria_sessao.js`, `red-025.md` (ambos novos) | 526 |
| R2 | T016 | T015 (m48) | `tests_session_m48.js`, `red-025.md` | 526 |
| R3 | T021 | T020 | `ui_curation_v32.js`, HTML dev | 526 |
| R4 | T031 | T030 | `ui_session_v32.js`, HTML | 526 |
| R5 | T041 | T040 | `ui_ux_v32.js`, HTML | 526 |
| R6 | T051 | T050 | `ui_curation_edit_v32.js`, HTML | 526 |
| R7 | T061 | T060 | `ui_v32.js`, HTML | 526 |
| R8 | T071 | T070 | `SESSION_SCHEMA_V32.md`, `synthetic_session_examples/exemplo-completo.json` | 526 |
| R9 | T073 | T072 | `USER_GUIDE.md` | 526 |
| R10 | T075 | T074 | `specs/019-curadoria-do-relatorio/spec.md` | 526 |
| R11 | T077 | T076 | `tests_019_curadoria.js` | 526 |
| R12 | T081 | T080 | `tests_p50_core.js` | 526 |
| R13 | T083 | T082 | `.claude/verify/bridges.json` | 526 |
| R14 | T085 | T084 | `tests_025_mutants.js`, `mutation_map.json`, `expected_suites.json`, `mutation-matrix.json` | 527 |
| R15 | T091 | T090 | `spec-validate.md` | 528 |
| R16 | T094 | T093 | `relatorio-final.md`, `.claude/BACKLOG.md` | 529 |

Classes de desvio **previstas** (vão ao relatório final, nunca silenciadas): **(a)**
merge/rebase de `develop` — o de 18:29 **não gerou repin** (pins não conflitaram); um
segundo, se a `develop` mover antes de T095, gera-o; **(b)** iteração do
`spec-validate`; **(c)** errata de spec **depois** do red (017 R2a) — a leitura por
alínea do red (INV8(b)/(c)) é a candidata mais provável; **(d)** segunda edição
comentário-only de um julgador (017 R8a); **(e)** E0/R0a, se o usuário cortar P5.
`planning-state` está fora do registry — nenhum commit de estado pede repin. O
conferível é o par (commit, arquivos pinados) — 008 previu 1 e gastou 3; 015 previu
R2–R12 e executou 13.

## Pontos de PARADA — a execução para e o orquestrador leva ao usuário

1. **Quinto arquivo §29.4**, `tests_ux_m41.js`, `build_v32_html.py`, qualquer linha
   de `engine_v32.js`/Camada 1/harness M41/snapshot, `MANIFEST.sha256`, REV A/REV B:
   parar na tarefa; rito R6 §5 / D2 (hoje tudo é Porta B). A autorização de
   2026-10-27 cobre **exatamente** `ui_session_v32.js`, `ui_ux_v32.js`,
   `tests_session_m48.js`, `ui_v32.js` — e nada mais.
2. **FAIL em suíte PROTECTED/congelada não previsto.** Previstos **só**: S50, S30,
   S31-S32 (T015 → T040, pela razão certa) e P50-GOV1/P50-IC4 (T030 → T080). Qualquer
   outro — UX21, S4-S5, S69, S62+S68, qualquer `tests_ui_*`/`tests_target`/`tests_ref`/
   `tests_journey`, `d019` ≠ 14/14, `tests_unset_ug` — é PARADA com diagnóstico de
   **causa** antes de culpa (R2 §3: env-doctor, path, ordem; mesmo gate no commit base).
   `p51`/`p52` locais por `requires chromium` **não** são isto (KI-3).
3. **Divergência de contagem no red** (T013 ≠ `1 PASS · 15 FAIL de 16`; T015 ≠
   `94 PASS · 3 FAIL de 97`, ou FAIL fora de {S50, S30, S31-S32}): declarar em
   `red-025.md`, **nunca ajustar** gate nem registro (R10 §1); o orquestrador decide
   entre errata tardia de W0 (classe (c)) e achado.
4. **Payload M41 muda** (stage `m41` ou `D019-MED1`): não há rota — a demanda para
   (C5 da 019, INV-1).
5. **`--preflight` de harness alheio sai de `ocorrencias == 1`** depois de uma wave
   (CM1 `:231`, D019-M3 `:76`, D019-M10 `editor:65`, P52 `ui_v32.js:1587`, os 108 do
   p52): parar; reancoragem de harness alheio é commit **próprio do QA**, declarada —
   nunca "confere depois".
6. **Heap da m48** estoura em T015 ou T084: fechar janelas nas alíneas novas; subir o
   heap só como último recurso, **declarado** na `_trilha` de `heavy.session`.
7. **`gen_pins.py` recusa pendência**: commitar o conteúdo primeiro; **nunca `--force`**.
   **`check_mutation.py:57-61` recusa porcelain sujo**: medir só com árvore limpa.
8. **Protótipos**: P1 NÃO nos dois caminhos (seletor real e `file.text` na instância)
   ⇒ expor `openImportPicker` em `__DEV` é edição de produto para teste — decisão do
   usuário; P2 com propriedade **não gravável** ⇒ a hipótese "objeto literal" do plano
   cai e o plano volta ao TL.
9. **Rebase com conflito fora de `pins.json`**, ou qualquer rebase **depois** de T015
   (invalidaria `red.commit` no clone do CI — `check_tdd.py:32`): parar; depois do red
   só *merge* de `develop`, classe (a).
10. **`corpo_019_inv8.py` acusa corpo diferente** em T076: a tarefa deixa de ser `doc`
    e passa a exigir red — parar, não "ajustar o título por dentro".
11. **Sobrevivente em T084** não é PARADA: é diagnóstico (gate ou hipótese — 023 M2/M2b)
    com a primeira execução registrada; **vira PARADA** se a correção exigir afrouxar
    asserção ou tocar `tests_session_m48.js` (R3 §2: nenhum commit toca a m48 depois
    de T015).

## Provas mecânicas (T074, T076) — testadas antes de entrar

Os dois scripts vivem **aqui** (bloco fenced) e o executor os copia para `tmp` — nunca
para a árvore (R7 §3). Identidade: `git hash-object` = **`c3c22e926cabac8e8c855d1558841993001819ba`**
(`aditiva_025.py`) e **`e7b718825bdcb2e4a0abd4f5506de352bf0032b7`** (`corpo_019_inv8.py`).
Medidos em 2026-10-27 num repo git efêmero no scratchpad sobre cópias de
`specs/019-curadoria-do-relatorio/spec.md` e `tests_019_curadoria.js` do HEAD `395942a`:

| Script · caso | Saída (1ª linha, truncada) | exit |
|---|---|---|
| aditiva · **P** duas notas (fim de `:42`, **meio** de `:49`) + seção nova de 6 linhas | `aditiva-025: 2 linha(s) alterada(s) por UMA inserção [42, 49] · 6 linha(s) nova(s) · 0 removida(s)… · 0 inserção(ões) fora da forma []` | **0** |
| aditiva · N1 linha `:45` removida (com as notas legítimas) | `… 1 removida(s)/alterada(s) fora de UMA inserção [45] …` | 1 |
| aditiva · N2 palavra apagada em `:42` + nota | `… [42] …` (byte do base não sobreviveu) | 1 |
| aditiva · N3 duas notas na mesma linha `:49` | `… [49] …` | 1 |
| aditiva · N4 linha `:45` movida para o fim | `… 1 removida(s)… [45] …` | 1 |
| aditiva · N5 CRLF | `[FAIL] CR presente (R7 §1) — base: False · nova: True` | 1 |
| aditiva · N6 inserção inline fora da forma | `… 1 inserção(ões) fora da forma [42]` | 1 |
| aditiva · N7 nota com a forma mas `demanda 017` | `… 1 inserção(ões) fora da forma [42]` | 1 |
| aditiva · P2 nada mudou | `0 · 0 · 0 · 0` | 0 — **limite declarado**: aditividade trivial; "a errata existe" é conferida por leitura no `spec-validate` |
| corpo · **P** título E3 + comentário do cabeçalho | `corpo-019-inv8: janela de edição base :218-:219 → nova :218-:219 · 217 linha(s) antes idênticas · corpo + resto idênticos (638 linhas) · título E3 presente` | **0** |
| corpo · P′ comentário cresce uma linha dentro da janela | `… → nova :218-:220 · … (638 linhas) · título E3 presente` | **0** |
| corpo · N1 linha do corpo alterada | `[FAIL] CORPO ou resto do arquivo difere a partir de base :221 / nova :221` | 1 |
| corpo · N2 título fora do texto exato | `[FAIL] título novo não contém o texto exato da E3: …` | 1 |
| corpo · N3 nada mudou | `[FAIL] título novo não contém …` | 1 |
| corpo · N4 linha `:11` (fora da janela) alterada | `[FAIL] linhas ANTES da janela diferem (base :1-:217 × nova :1-:217)` | 1 |
| corpo · N5 âncora duplicada | `[FAIL] âncora 'T("D019-INV8",' ocorre 2× (esperado 1)` | 1 |

**Limites declarados**: `aditiva_025.py` prova **estrutura** (nenhum byte do base
apagado; toda inserção inline é uma nota na forma; linha nova livre) — o **sentido**
da nota e da seção nova é leitura do `spec-validate`; `corpo_019_inv8.py` prova que
**só** a janela comentário+título mudou — a adequação do texto do título é a própria
string da spec (conferida), o comentário é leitura.

### `aditiva_025.py`

```python
#!/usr/bin/env python3
"""aditiva_025.py — prova mecânica de errata ADITIVA (demanda 025: E1/E2 na spec da 019).

Uso:  python aditiva_025.py <rev_base> <rev_nova|WORKTREE> <path> [--nota-regex=REGEX]

Compara blob × blob (`git show <rev>:<path>`) ou blob × árvore (WORKTREE).
Para TODA linha do base: ou é idêntica na nova, ou é ela mesma + EXATAMENTE UMA
inserção contígua (prefixo comum + sufixo comum cobrem a linha inteira do base)
cujo trecho inserido casa a forma da nota  *(Errata E<n> · demanda 025: …)*.
Linha nova (sem par no base) é livre. Linha removida, movida, alterada com byte
apagado, dois trechos na mesma linha ou trecho fora da forma ⇒ FAIL nomeado.
CR em qualquer dos lados ⇒ FAIL (R7 §1). Não escreve na árvore. Exit 0 só sem FAIL.
"""
import difflib, re, subprocess, sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

NOTA = r"\*\(Errata E\d+ · demanda 025: [^()]*\)\*"


def blob(rev, path):
    if rev == "WORKTREE":
        with open(path, "rb") as fh:
            return fh.read().decode("utf-8")
    r = subprocess.run(["git", "show", f"{rev}:{path}"], capture_output=True)
    if r.returncode != 0:
        print(f"[FAIL] git show {rev}:{path}: {r.stderr.decode('utf-8', 'replace').strip()}")
        sys.exit(2)
    return r.stdout.decode("utf-8")


def uma_insercao(a, b):
    """b == a + um trecho contíguo inserido? devolve o trecho; senão None."""
    if len(b) <= len(a):
        return None
    i = 0
    while i < len(a) and a[i] == b[i]:
        i += 1
    j = 0
    while j < len(a) - i and a[len(a) - 1 - j] == b[len(b) - 1 - j]:
        j += 1
    if i + j < len(a):
        return None
    return b[i:len(b) - j]


def main():
    pos = [x for x in sys.argv[1:] if not x.startswith("--")]
    if len(pos) != 3:
        print(__doc__)
        sys.exit(2)
    base_rev, nova_rev, path = pos
    nota = NOTA
    for x in sys.argv[1:]:
        if x.startswith("--nota-regex="):
            nota = x.split("=", 1)[1]
    forma = re.compile(r"\s*" + nota + r"\s*")

    A, B = blob(base_rev, path), blob(nova_rev, path)
    if "\r" in A or "\r" in B:
        print(f"[FAIL] CR presente (R7 §1) — base: {'\r' in A} · nova: {'\r' in B}")
        sys.exit(1)
    a, b = A.split("\n"), B.split("\n")

    alteradas, removidas, fora, novas = [], [], [], 0
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        if tag == "insert":
            novas += j2 - j1
            continue
        if tag == "delete":
            removidas += [i + 1 for i in range(i1, i2)]
            continue
        # replace: casa cada linha velha com a primeira nova compatível, em ordem
        news, k = list(range(j1, j2)), 0
        for oi in range(i1, i2):
            hit = None
            for nj in range(k, len(news)):
                cand = b[news[nj]]
                if cand == a[oi] or uma_insercao(a[oi], cand) is not None:
                    hit = nj
                    break
            if hit is None:
                removidas.append(oi + 1)
                continue
            novas += hit - k
            k = hit + 1
            frag = uma_insercao(a[oi], b[news[hit]])
            if frag is not None:
                if forma.fullmatch(frag):
                    alteradas.append(oi + 1)
                else:
                    fora.append(oi + 1)
        novas += len(news) - k

    print(f"aditiva-025: {len(alteradas)} linha(s) alterada(s) por UMA inserção {alteradas} · "
          f"{novas} linha(s) nova(s) · {len(removidas)} removida(s)/alterada(s) fora de UMA inserção {removidas} · "
          f"{len(fora)} inserção(ões) fora da forma {fora}")
    if removidas or fora:
        print("[FAIL] errata NÃO é aditiva — toda linha do base tem de sobreviver byte a byte, "
              "com no máximo UMA nota inserida na forma *(Errata E<n> · demanda 025: …)*")
        sys.exit(1)
    print("[OK]   aditiva — nenhuma linha do base perdeu um byte; toda inserção inline é uma nota na forma")
    sys.exit(0)


if __name__ == "__main__":
    main()
```

### `corpo_019_inv8.py`

```python
#!/usr/bin/env python3
"""corpo_019_inv8.py — prova mecânica da errata E3 (demanda 025): só título e comentário
do `D019-INV8` mudam em tests_019_curadoria.js; o CORPO e o resto do arquivo são
byte-idênticos.

Uso:  python corpo_019_inv8.py <rev_base> <rev_nova|WORKTREE> [path]

Janela de edição permitida: do cabeçalho de comentário imediatamente anterior
(linha que começa por `/*`, procurada para cima a partir da linha `T("D019-INV8"`)
até a própria linha `T("D019-INV8", …`. Fora dela, toda linha tem de ser idêntica
(antes e depois, inclusive o corpo da função e o `});` de fecho). A linha `T(`
nova tem de conter o título exato da spec 025 (E3). CR ⇒ FAIL. Exit 0 só sem FAIL.
"""
import subprocess, sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

TITULO = "exportada; id desconhecido recusado; nenhum derivado viaja"
ANCORA = 'T("D019-INV8",'


def blob(rev, path):
    if rev == "WORKTREE":
        with open(path, "rb") as fh:
            return fh.read().decode("utf-8")
    r = subprocess.run(["git", "show", f"{rev}:{path}"], capture_output=True)
    if r.returncode != 0:
        print(f"[FAIL] git show {rev}:{path}: {r.stderr.decode('utf-8', 'replace').strip()}")
        sys.exit(2)
    return r.stdout.decode("utf-8")


def janela(linhas):
    idx = [i for i, l in enumerate(linhas) if l.startswith(ANCORA)]
    if len(idx) != 1:
        return None, None, f"âncora {ANCORA!r} ocorre {len(idx)}× (esperado 1)"
    t = idx[0]
    h = t
    while h > 0 and not linhas[h].lstrip().startswith("/*"):
        h -= 1
    return h, t, None


def main():
    pos = [x for x in sys.argv[1:] if not x.startswith("--")]
    if len(pos) not in (2, 3):
        print(__doc__)
        sys.exit(2)
    base_rev, nova_rev = pos[0], pos[1]
    path = pos[2] if len(pos) == 3 else "tests_019_curadoria.js"
    A, B = blob(base_rev, path), blob(nova_rev, path)
    if "\r" in A or "\r" in B:
        print("[FAIL] CR presente (R7 §1)")
        sys.exit(1)
    a, b = A.split("\n"), B.split("\n")
    ha, ta, ea = janela(a)
    hb, tb, eb = janela(b)
    fails = []
    if ea or eb:
        fails.append(ea or eb)
    else:
        if a[:ha] != b[:hb]:
            fails.append(f"linhas ANTES da janela diferem (base :1-:{ha} × nova :1-:{hb})")
        if a[ta + 1:] != b[tb + 1:]:
            # localizar a primeira divergência do corpo/resto
            k = 0
            while k < min(len(a) - ta - 1, len(b) - tb - 1) and a[ta + 1 + k] == b[tb + 1 + k]:
                k += 1
            fails.append(f"CORPO ou resto do arquivo difere a partir de base :{ta + 2 + k} / nova :{tb + 2 + k}")
        if TITULO not in b[tb]:
            fails.append(f"título novo não contém o texto exato da E3: {TITULO!r}")
        if a[ta] == b[tb]:
            fails.append("linha T(…) idêntica — a errata de título não foi aplicada")
    if fails:
        for f in fails:
            print("[FAIL]", f)
        sys.exit(1)
    corpo = len(a) - ta - 1
    print(f"corpo-019-inv8: janela de edição base :{ha + 1}-:{ta + 1} → nova :{hb + 1}-:{tb + 1} · "
          f"{ha} linha(s) antes idênticas · corpo + resto idênticos ({corpo} linhas) · título E3 presente")
    print("[OK]   só título e comentário do D019-INV8 mudaram")
    sys.exit(0)


if __name__ == "__main__":
    main()
```

## Onde o `spec-validate` da Fase 6 vai olhar — e o que já nasce defasado

### Critério → tarefa → artefato → como se confere

| Critério / exigência da spec | Tarefa(s) | Artefato onde está | Como o `spec-validate` confere |
|---|---|---|---|
| C1 `D025-VAL1` | T013 (gate) · T030 (green) · T020 (`validate`) | `tests_025_curadoria_sessao.js`; `ui_session_v32.js` validador; `ui_curation_v32.js` | execução da suíte (`PASS  D025-VAL1`); leitura: nenhum `fromSession` em `validateSessionDocument`/`prepareSessionExport`; M1 KILL na matriz |
| C2 `D025-VAL2` | T013 · T020 | `ui_curation_v32.js` (`validate`, `fromSession`) | execução; leitura: `fromSession` chama `validate` **antes** de qualquer escrita em `estado`; M2 KILL |
| C3 `D025-CAN1` (+ `F-extra`) | T013 · T020 | idem (as oito mensagens) | execução; leitura das oito strings **exatas** da spec §Mensagens; M3 e M23 KILL |
| C4 `D025-TRX1` | T013 · T030 | `normalizeSessionDocument`, `commitCanonicalOwners` | execução; leitura: `curadoria:` no literal `cand` + atribuição condicional; `fromSession(cand.curadoria)` dentro do `try`; M4 KILL |
| C5 `D025-TRX2` (a)(b)(b′)(c)(d) | T012 (P2) · T013 · T030 | `snapshotCanonicalOwners`/`restoreCanonicalOwners`/`commitCanonicalOwners` | execução; leitura: `toSession()` no snapshot, restore **sem** `&& snap.curadoria`, snapshot **primeira** instrução, escrita após `OPERATIONAL_REFINEMENT` e antes de `tgtNotices`; M6/M7/M8/M22 KILL; `red-025.md` §P2 (contrafactual 0) |
| C6 `D025-AUS1` | T013 · T020 · T030 | `fromSession(undefined)` zera; commit escreve `undefined` | execução (quatro janelas); M5 KILL |
| C7 `D025-INV8` (a)(b)(c)(d) | T013 · T030 · **T070 (d)** | código + `exemplo-completo.json` | execução; leitura do JSON (`reportCuration` válido); M9 KILL; `red-025.md` diz quais alíneas nasceram vermelhas |
| C8 `D025-NOP1` | T011 (P1) · T013 · T030 | caminho real do seletor; `importSessionDocument` | execução; `red-025.md` §P1 (ticks, fallback); M10 KILL |
| C9 `D025-NEW1` | T013 · T040 | `uxNewSession` | execução; leitura: `clear()`/`discardDraft()` guardados **antes** de `render()`; `:61` byte-idêntico; `tests_ux_m41.js` 56/56; M11 KILL |
| C10 `D025-RST1` | T013 · T040 | `uxResetAssessment`, `:55` | execução; leitura do literal **exato**; M12/M13 KILL |
| C11 `D025-TRN1` | T013 · T030 | commit (`prioLimitHit = false`) | execução; M14 KILL |
| C12 `D025-TRN2` | T013 · T030 (chamada) · T040 (chamadas) · **T060 (funções)** | `ui_v32.js:1688` + as duas funções | execução; leitura: `__V32UI` com 7 chaves; `grep -c "  if (draft !== null){"` = 1; M15 KILL. **Se E0**: critério ausente **por errata registrada** (T005), não *faltando* |
| C13 `D025-PRV1` | T013 · T030 | `sessionPreview`, `showImportPreview`, `sessionHasContent` | execução; leitura: `<li>Curadoria do relatório:` após *Aprofundamento*; literais de S30 intactos; M16/M17 KILL |
| C14 `D025-UNS1` | T013 · T020 (e) · T050 (a-d) | bridge `unset`/`unsetArchitectureNote`; handlers do editor | execução; leitura da tabela fechada nos dois handlers; `gateFechado`/`decorar` byte-idênticos; M18 KILL |
| C15 `D025-GAT1` | T013 (verde declarado) · T030 | commit sem condição de gate | execução (verde); **M19 KILL é a única prova de poder** — conferir na matriz, não só o PASS |
| C16 `D025-DOC1` (a)-(e) | T013 · **T070 (a-d)** · **T072 (e)** | `SESSION_SCHEMA_V32.md` §4/§5/§8.4/§9; `USER_GUIDE.md` §11 | execução (inclusive regex (b)); leitura: sem palavra do papel; verbete `CONTEXT.md:210` citado; M21 KILL (em cópia) |
| Reancoragens S50/S69/S30/S31-S32 + `M48_HTML_OVERRIDE` | **T015** | `tests_session_m48.js` | execução 97/97; leitura: diff de T015 **é o único** no arquivo (`git log --oneline <SHA-T015>..HEAD -- tests_session_m48.js` vazio); M20/M6/M11/M12/M16 KILL **sob m48** na matriz |
| E1 · E2 | T074 | `specs/019-curadoria-do-relatorio/spec.md` | `aditiva_025.py <SHA-T074>~1 <SHA-T074>` exit 0; leitura da seção nova e das duas notas; `spec-validate.md` da 019 **intacto** (`git log` vazio) |
| E3 | T076 | `tests_019_curadoria.js:218-219` | `corpo_019_inv8.py <SHA-T076>~1 <SHA-T076>` exit 0; `d019` 14/14; `D019-M3` KILL |
| E4 · E5 | T070 | schema + exemplo | DOC1(a)-(d), INV8(d); m48 S79–S82/S109/S110 |
| E6 | T072 | `USER_GUIDE.md` §11 | DOC1(e); `P51-DOC*` (p50core); p51 no CI `visual` |
| E7 | T082 | `bridges.json` | leitura das duas notas; `lint-arch` |
| E8 | T093 | `BACKLOG.md` | leitura dos 13 status (`EA-110` com a decisão P3 citada; `EA-115` aberto); `--rule=backlog` |
| Registro e identidade (spec §Registro) | T084 · T080 · T001–R16 | `expected_suites.json`, `mutation_map.json`, `mutation-matrix.json`, `tests_p50_core.js`, `pins.json` | `check_suites.py` (18 OK), `check_mutation.py` (`d025` com `preflight: true`, `targets` com os **oito** nomes, `insumos.oraculo`), `check_tdd.py` (23 pares completos), `check_baseline.py` (0 sem pin), `tests_p50_core.js` 65/65 |
| Âncoras alheias preservadas (spec §Registro, `EA-4`) | T010 (régua) · T020/T030/T050/T060 (medível) · T084 (re-execução) | — | `--preflight` de core/d009/d010/d011/d014/d015/d021/d022/d023/p51/p52 = `ok == total`; matriz com `ultima_prova` re-datada |
| *O que NÃO muda* | T090 | — | `SESSION_SCHEMA_VERSION = 1` (grep); `paraSessao` `:178-183` byte-idêntico; `decide()`/`published()`/`contract()` intactos; `tests_ux_m41.js` byte-idêntico a `da71759`; `err("…nao esta disponivel")` presente; `check_m41.py` verde; `D019-MED1` PASS |
| Cross-check boundary (spec) | T080 · T090 | `tests_p50_core.js` PROTECTED; `boundary.json` | 15 entradas conferidas, **3** repinadas; `boundary.json` byte-idêntico; `check_boundary.py` verde |
| Protótipos P1/P2 (plan) | T011 · T012 | `red-025.md` §Protótipos | leitura dos números; nenhum arquivo `prototype/*` na árvore |

### O que já nasce defasado — declarado aqui para não virar gap

(a) **SHAs** citados em `spec.md` (HEAD `d695dbb`), `plan.md` (HEAD `520f20d`, `origin/develop`
`cee02e9`, "14 à frente") e no planning-state (`2c47545`, `b0c5703`) deixaram de existir
na branch com o rebase de 2026-10-27 18:29 — equivalentes byte-idênticos: `31e60b9`,
`79d0c26`, `dbf0059`, `29be723`, `395942a`; merge-base agora `da71759`. Prosa histórica,
não gap. **(b)** Linhas de `pins.json` (`:536/:534/:531`, `:499`, `:492`, `:514-515`) são
endereço instável por construção — conferir **pela chave**. **(c)** Linhas de
`ui_session_v32.js` citadas pela spec/plano (`:240`, `:533-541`, `:585-586`, `:602`,
`:606-628`, `:641-654`, `:718-736`) **movem** depois de T030; `ui_v32.js:1688` move se
as funções entrarem antes; localizar por **texto**. **(d)** `tests_p50_core.js`: a spec
§Registro diz `ui_v32.js:383`/`ui_ux_v32.js:384`; medido hoje `:382`/`:383` (o plano
acerta); os três movem após T080 (três blocos de trilha). **(e)** A **tabela de gatilho**
do plano rotula arquivos com a numeração antiga de waves (`tests_p50_core.js (W7)`,
`USER_GUIDE.md (W6/E6)`, `tests_019_curadoria.js (W6/E3)`); a tabela de **waves** do
plano governa, e este arquivo segue-a (W7 docs, W8 fecho). **(f)** A tabela *janela
vermelha* do plano diz `suites` **verde** de W1.2 a W8.1 — **errado**, corrigido acima
(★): `check_suites.py:50-56` reprova suíte fora do registro. **(g)** O plano lista
`INV8` entre os greens da W3 — INV8(d) depende de E5 (T070): corrigido (10/16).
**(h)** `core`/CM1 falso sobrevivente entre T030 e T040 — não previsto no plano,
previsto aqui. **(i)** O brief da Fase 3 descreveu "W5 ui_v32 · W6 editor"; o plano
aprovado tem **W5 editor · W6 draft** (o `draft` é o último conteúdo de produto para
que o corte seja truncamento) — este arquivo segue o plano. **(j)** R0b e R0′ do plano
não existem como repins separados (R0 único — refinamento de granularidade, não
desvio). **(k)** `tests_019_mutants.js:267`: `D019-M11` roda a m48 a **4608** enquanto
`heavy.session` está em 6144 desde `EA-65`; `S4-S5` imprime antes de qualquer estouro,
logo o KILL continua válido — se a campanha d019 acusar OOM depois de T015, é
**achado** (não ajuste, não desta demanda). **(l)** `ui_p52_workspace_v32.js:2015` cita
`hasDraft()` como contrato antes de existir — passa a ser verdadeiro em T060; não se
edita. **(m)** `red-025.md` nasce em T013 e ganha §m48 em T015 — o plano o previa só em
R1; aqui cobre R1 **e** R2 (mesmo autor, registro, não julgador). **(n)** Se o red
mostrar INV8(b)/(c) verdes hoje, a célula de C7 da spec (*"nascem vermelhos … INV8(b)
(c)(d)"*) fica larga em duas alíneas — candidata a errata classe (c), decidida pelo
orquestrador em T013, nunca pelo QA sozinho.

## Notas de execução que o orquestrador precisa

- **O red é dois commits e um `red.commit`**: T013 (suíte) e T015 (m48); `red.commit`
  aponta T015 — a árvore nele contém os 19 vermelhos; `notes` cita T013. Nenhum rebase
  depois de T015 (`check_tdd.py:32` confere por `git cat-file -e` no clone do CI).
- **Sequência rígida de W0**: commit do `tasks.md` → T001 (R0) → T002 (planning-state)
  → [T005 se E0 → R0a] → W1. Planning-state **nunca** `[P]` com repin.
- **W1**: T010/T011/T012 numa mensagem (nada escrito); depois T013 → T014 → T015 → T016
  → T017, seriais. T015 **depende das respostas** de P1/P2 só indiretamente (a forma
  das alíneas da m48 é fixa); T013 depende delas diretamente.
- **W2–W6**: cada delegação é "um módulo + rebuild + commit"; o `build-engineer` repina
  logo após; medições da coluna *Medível* antes do commit, com a árvore ainda suja só
  do próprio módulo (as suítes leem o HTML construído — rebuild antes de medir).
- **Entre T030 e T040 não se roda a campanha `core`** (CM1 falso sobrevivente); o
  `run.sh` completo nesse intervalo dispara-a — rodar `--light`, ou rodar e declarar.
- **W7**: quatro commits, três do `doc-writer` e um do QA, cada um seguido do seu
  repin — nunca dois conteúdos antes de um repin (a primeira execução do `gen_pins`
  cobriria os dois e o segundo repin sairia vazio).
- **T080 antes de T084**: o harness `d025` roda `tests_p50_core.js`? Não — mas a
  campanha `d021` (disparada por `ui_v32.js`) roda `P50-…` (M9 da 021 roda p50core):
  com GOV1/IC4 vermelhos, a `d021` poderia acusar pela razão errada. Por isso T080
  (inline) precede T084 (registro e campanhas).
- **T084 mede e registra, nunca "arredonda"**: `suites.d025` e `heavy.session` entram
  com o número que a execução imprimiu; a duração da campanha e da suíte vão à
  `_trilha`. Sobrevivente ⇒ causa, nunca afrouxar; se a causa for o gate, o conserto
  do gate é do QA, em commit próprio, **na suíte da 025** (nunca na m48).
- **T095**: o PR abre sobre o green; `pr_url` + `done` antes do merge; o job `fecho`
  do CI é vermelho até o `done` (D016-PR1 fazendo o trabalho dele). "Pronto" é o job
  `visual` verde — p51/p52 não fecham local (KI-3).
- **Tempos de referência medidos (plano)**: m48 107 s (heap 6144); `tests_019_curadoria.js`
  10 s; `tests_p50_core.js` 51 s; rebuild ≈ 3 s; campanha `d025` **estimada** 20–25 min
  (5 × m48 ≈ 9 min); sessão de fecho local ≈ 1 h de campanhas node — números a medir
  em T084/T090 e a registrar em T093.
