# Tarefas — 017-semantica-do-gatilho

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Consome o [plan.md](plan.md) (portão da Fase 2: *"Prossiga"*, 2026-09-06, commit
> `4b74e3a`; **R0** executado no mesmo portão, `f790a20`) e a [spec.md](spec.md)
> (portão da Fase 1, `36073dd`, com D4). As decisões dos portões estão no
> planning-state (`specify`, `plan`) e **não se reabrem aqui**. O tech-lead
> **propõe**; quem delega é o orquestrador (R5).
>
> Árvore medida: worktree `phase5-014`, branch `feature/017-semantica-do-gatilho`,
> HEAD `f790a20`, base `9d617d0` (= `origin/develop` = merge-base).
> `check_baseline.py`: `462/462 pins conferem · 0 divergentes · 0 ausentes · 0 sem
> pin`. `pipeline.yaml`: 17 stages, 4 `heavy` (`mutation`, `suites`,
> `suites-heavy`, `evidence-bridge`) ⇒ `--light` = **13 PASS**. Os quatro arquivos
> que a demanda edita (`check_mutation.py`, `mutation_map.json`, os dois harnesses)
> e os três que registra (matriz, spec da 013, `BACKLOG.md`) são **byte-idênticos
> de `9d617d0` a `f790a20`** (`git diff --stat` vazio nos sete) — toda linha de
> fonte citada pelo plano continua válida, e a âncora `abdddd0` da regressão C8
> equivale a `f790a20` para eles. **Derivou uma coisa**: os pins dos dois
> harnesses em `pins.json` saíram de `:425`/`:430` (plano e spec) para
> **`:428`/`:433`** — o R0 inseriu `plan.md`/`refinement.md`/`spec.md` em
> `:414-416` — e vão derivar de novo a cada repin desta série (R1 insere
> `tasks.md`, R2 insere `red-017.md`). Linha de `pins.json` é endereço instável por
> construção: **confere-se pela chave**, nunca pela linha.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | build-engineer | chore | | **Repin R1** — fecha o commit deste `tasks.md` (o commit é do orquestrador, no portão). Medido: `462/462 · 0 sem pin` em `f790a20`; o commit do `tasks.md` deixa **1 rastreado sem pin**. **Pré-condição mecânica**: porcelain vazio — `gen_pins.py:72-79` recusa **qualquer** pendência fora do próprio `pins.json`, **inclusive o planning-state** (hoje pendente com `phase: tasks`, `tasks.status: in_progress`): ele entra commitado antes (no commit do portão ou em commit próprio), nunca `--force`. Mensagem: `chore(017): gen_pins — R1 (tasks.md)` | stage `baseline` |
| T002 | 0 | orquestrador (skill `new-demand`) | chore | | Planning-state: `tasks.status: approved` + `approved_at` (aprovação **literal** do usuário no chat) + `phase: red`; **commit próprio, imediato** (`chore(017): planning-state — portão da Fase 3`). Sem repin (`gen_pins.py:29` exclui `.claude/project-memory/`). **Depois** de T001, não junto nem em paralelo: a edição suja a árvore que o R1 exige limpa | stage `state` |
| T010 | 1 | qa-engineer | **feature** | | **RED do julgador — um commit, três arquivos, um autor** (P1/P2/P3 do plano). (1) `.claude/verify/check_mutation.py`, patch-points PP-1…PP-8: retirada **cirúrgica** do `IC-6` — `:388` sai, `:392` vira `_ids51 = ic_estatico(_f51[0])[0] if _f51 else []`, `:395-412` sai inteiro, rótulo de `:382` → `"IC-5"` com mensagem no singular, comentários `:64-67`/`:172-176`/`:376-379` atualizados; bloco `---- semântica do gatilho (017) ----` **entre `:463` e `:465`**, com `D017_FAILS` e `d017_fail(gate, alvo, causa)` próprios (**nunca `ic_fail`** — C8 exige `---- integridade: 0 ----` byte-idêntico), `mut_relacao(...)` pura (spec §Contratos C5), `D017_CENARIOS` i–xv (spec §Os 15 cenários), sonda contra `_meta.sonda_relacao.total` lido da **raiz** do JSON (`:22` não muda), laço sobre `sorted(MAP.items())` com as saídas de spec §Comportamento, fecho `---- semântica do gatilho: <n> problema(s) nomeado(s) ----`; `:1328` → `fails = IC_FAILS + D017_FAILS + EX_FAILS + GP_FAILS`. Restrições: PP-9 (`{fontes}` = token do `cmd`, nunca `basename`), **PP-10 (`ic_path` proibida no bloco — os conjuntos comparam-se crus)**, PP-11 (`IC_SEM_PREFLIGHT`/`IC_PREFLIGHT` só leitura; a `[DÍVIDA] core: sem preflight declarado …` de `:337-338` fica byte-idêntica). (2) `.claude/verify/mutation_map.json`: **só** `_meta.sonda_relacao: {"total": 15, "descricao": …}` — nenhum `insumos`, nenhum byte em `harnesses.*` (**TRAVA**: a W2 deste arquivo é do `build-engineer`, T020). (3) `specs/017-semantica-do-gatilho/red-017.md`: saída integral do stage no estado A e a tabela dos mutantes (abaixo), com a tabela `D017-M1`/`M2` **com saída** (C8). **Prova em cópia efêmera, nunca na árvore**: o stage recusa porcelain sujo (`:57-61`), logo o red é medido **antes do commit** em clone efêmero da branch com **commit efêmero de conteúdo idêntico** (receita do plano §Protótipo e da `_trilha` do EA-41, `d4163d3`), `origin/develop` pinado em `9d617d0`, `MUTATION_DEFER_MISSING=1`; o `red-017.md` cita o `git hash-object` dos dois arquivos para a identidade com o commit real ser conferível. Esperado no estado A (plano §Janela): `---- integridade: 0 problema(s) nomeado(s) ----` e as linhas IC-1/2/4/5/9/10 **idênticas** à linha de base; **nenhuma** linha `IC-6`; `[DÍVIDA] core: relação gatilho × conjunto mutado NÃO MEDIDA — sem preflight (credor: EA-44)`; `[OK] D017-SONDA1: mut_relacao discrimina nos 15 cenários …`; `[FAIL] D017-REL1` em `d014` (2 paths) e `d016` (10), ambas com ` [forma do path? mesmo basename nos dois lados: … — C1 exige path relativo à raiz]`; `[FAIL] D017-REL2` em 7 harnesses (70 paths), as de `d014`/`d016` com o mesmo diagnóstico; INS1 e FORM1(a) **verdes por vácuo — ditos, não maquiados**; exit 1. Mutantes em cópia (cada um = commit efêmero no clone, `git reset --hard` entre eles): `D017-M1` (= `M-IC8`: `USER_GUIDE.md` fora de `p51.targets` ⇒ `[FAIL] D017-REL1: p51 · …: USER_GUIDE.md`), `M2` (= `M-IC9`: `ui_session_v32.js` de volta ⇒ `[FAIL] D017-REL2: p51 · …: ui_session_v32.js`), `M5`/`M6`/`M7` (blocos `insumos` malformados acrescentados à cópia do mapa ⇒ INS1 (a)/(d)/(c) com a causa fechada), `M9` (emissão da `d014` com `\` ⇒ `[FAIL] D017-FORM1: d014/arquivos_mutados · …`), `M10`–`M16`, `M18` (julgador/sonda mutados ⇒ `[FAIL] D017-SONDA1: cenário <n> · …` ou `14 ≠ 15`), `M14` (⇒ sonda ix); **`M17` sobrevive à sonda — registrado assim** — e sob `M17` o `M2` deixa de ser acusado: é esse par que o mata. `M3`, `M4`, `M8` ficam para a W2 (exigem `insumos`/D1). ~~Observação sem id (ver §Vácuos): harness da cópia com `--preflight` saindo 1 ⇒ `[FAIL] IC-4` **e** `[NOTA] D017: <h> · não medida — …`.~~ *(Riscado na W0, 2026-09-06 — Errata `D017-M19`, spec §Erratas da Fase 3: a observação sem id foi recusada e o enunciado do estado estava errado.)* **`D017-M19`** — mutante de **fiação** do ramo `[NOTA]` de C1, em cópia, com id na tabela de `red-017.md` como os demais. **Estado NOTA** (alimenta o mutante; não é mutante): `tests_p50_mutants.js:896` `process.exit(preflight(selecionar().sel));` → `process.exit(1);` — **stdout vazio** (no caminho `--preflight` a única escrita em stdout é `:878`, dentro de `preflight()` `:847`; os `console.log` da campanha, `:963+`, não são alcançados — medido: sob a variante A o IC-4 acusa exatamente isso), `ic_preflight` devolve `None` (`check_mutation.py:310-312` → `:341`) e IC-4 acusa `preflight não emitiu nada em stdout …`. **Correção de fato**: "`--preflight` saindo 1" **não** alcança o ramo — exit 1 com JSON válido em stdout mantém `IC_PREFLIGHT["p50"]` como `dict` (`:326` guarda o `returncode`; a reprova de IC-4 vem de `:354-356`) e o bloco 017 **mede** a `p50` normalmente (medido em clone efêmero de `f56d4fd`, tabela da errata). Sob o estado NOTA, gate íntegro ⇒ `[NOTA] D017: p50 · não medida …` **uma** vez, nenhum `[OK] D017: p50`, nenhum `[FAIL] D017-*: p50`, fecho `<n>` igual ao do estado A (não medido contribui zero). `M19` = o laço perde a distinção "`None` com nome presente" (PP-7): `IC_PREFLIGHT.get(nome) or []` ou a forma alternativa da errata — **o QA registra qual** — ⇒ `[NOTA]` ×0 e forma proibida (na forma `or []`: `[FAIL] D017-REL2: p50 · alvo fantasma (sem razão de classe): ui_p50_results_v32.js, ui_p50_shell_v32.js, ui_p50_suff_v32.js, ui_p50_v32.css` — os quatro `targets` que não são o harness, na ordem que o gate imprimir). **Sobrevive à sonda por desenho, como `M17`** — registrado assim; run à parte da regressão C8 (com o estado NOTA, `---- integridade: 1 ----`). Mensagem: `test(017): red — D017-REL1/REL2/INS1/FORM1/CORE1/SONDA1 (bloco 017 no stage mutation; IC-6 substituído)` | `D017-REL1` `REL2` `INS1` `FORM1` `CORE1` `SONDA1` · C8 |
| T011 | 1 | build-engineer | chore | | **Repin R2** — fecha o commit red (`check_mutation.py`, `mutation_map.json`, `red-017.md`). Mensagem: `chore(017): gen_pins — R2 (commit red)` | stage `baseline` |
| T012 | 1 | qa-engineer | chore | | **Medição do red na árvore real** (nada escrito; porcelain vazio): `MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py` no HEAD ⇒ saída **linha a linha igual** à de `red-017.md` (estado A fora de cópia); `git diff f790a20 HEAD -- .claude/verify/check_mutation.py` ⇒ hunks **só** em PP-1…PP-8 (C8 iv), `:1332-1421` intactos; `git diff f790a20 HEAD -- .claude/verify/mutation_map.json` ⇒ só `_meta.sonda_relacao`; `bash .claude/verify/run.sh --light` ⇒ **13 PASS** (a janela é invisível ao `--light`). O resultado vai ao planning-state (T013, `red.notes`) e ao relatório final — **não** ao `red-017.md`, que exigiria outro repin | `D017-*` (red, árvore real) |
| T013 | 1 | orquestrador (skill `new-demand`) | chore | | Planning-state: `red.status: proven`, `red.commit: <SHA completo de T010>`, `red.gates` com os seis ids e `notes` separando **vermelho na árvore** (REL1, REL2, FORM1 b) de **vermelho só por mutante em cópia** (INS1, FORM1 a, CORE1, SONDA1 — vácuo declarado), `phase: implement`; commit próprio, sem repin. **A W2 só começa depois deste commit** (árvore limpa para T020 e T022) | stage `state` · `tdd` |
| T020 | 2 | build-engineer | **fix** | | **`mutation_map.json` — green de C7. TRAVA: segundo autor do arquivo, wave distinta; não começa antes de T013.** Acrescentar `insumos` nos 7 harnesses **exatamente** como spec §Contratos C7: `d010` `oraculo: [tests_010_vao.js]` · `fixture: [fixtures_010_vao.js]`; `d009` `oraculo: [tests_009_leitura.js]` · `fixture: [fixtures_009_leitura.js]`; `d011` `oraculo: [tests_011_prioridade.js]`; `d015` `oraculo: [tests_015_apoio.js]` · `fixture: [fixtures_015_apoio.js]`; `d014` `populacao: [ui_v32.css, ui_ux_v32.css, ui_p52_workspace_v32.css, ui_d011_prioridade_v32.css]`; `d016` `fixture:` = `git ls-files .claude/verify/fixtures_016/` **menos** `fecho/F5.json` e `protecao/sem_fecho.json` (**derivada no commit, nunca digitada** — P7; hoje 46 − 2 = **44**) · `declaracao: [.claude/verify/branch_protection.json]`; `ea41` `oraculo: [.claude/verify/check_eol_text.py]` · `declaracao: [.gitattributes]`. `p50`/`p51`/`p52`/`d014vis`/`core`: **nada**. Uma frase sobre `insumos` em `_meta.descricao`; **nota datada de uma linha, anexada** (nunca reescrita, R2 §5) à `_trilha` de `d009` ("precedente p52" é falsa analogia — a p52 muta `tests_p52_chromium.js`) e de `d016` (`:1287` → `:1333`) — localizar **pela chave** (`harnesses.d009._trilha`, `harnesses.d016._trilha`): os endereços `:41`/`:246` da spec são de antes das inserções. **Não tocar**: `targets`, `_meta.sonda_relacao`, `preflight`, `receipts`, `requires`. Mensagem: `fix(017): mutation_map — insumos nos sete harnesses (C7, D2), frase em _meta, notas datadas d009/d016` | `D017-REL2` `INS1` (green) · C7 |
| T021 | 2 | build-engineer | chore | | **Repin R3** — fecha T020. `chore(017): gen_pins — R3 (insumos no mapa)` | stage `baseline` |
| T022 | 2 | qa-engineer | chore | | **Medição do estado C** (nada escrito; porcelain vazio): stage ⇒ **9** linhas `[OK] D017: <h> · gatilho ⊇ conjunto mutado ∪ {harness} (<n>)` — `p50`/`p51`/`p52`/`d014vis` sem sufixo, `d010`/`d009`/`d011`/`d015`/`ea41` com `· insumos: …`; **só `d014` e `d016` vermelhos**, cada um com REL1 **e** REL2 e o diagnóstico de forma **na árvore real** (`d014`: faltantes `regra_morta.js`, `regra_morta_seletor.js` × fantasmas `.claude/verify/regra_morta.js`, `.claude/verify/regra_morta_seletor.js`; `d016`: 10 × 10); INS1 0; `mutation: 0 campanha(s) executada(s) · <n> problema(s)`, exit 1. **`D017-M4`** em cópia: classe `fixture` retirada da `d010` ⇒ `[FAIL] D017-REL2: d010 · alvo fantasma (sem razão de classe): fixtures_010_vao.js`. É a prova de carga de C4(b) **fora de cópia** (plano P4) — saída guardada para o relatório final | `D017-REL2` (green em 9) · `FORM1(b)` (vermelho pela razão certa) · `M4` |
| T023 | 2 | build-engineer | **fix** | | `tests_014_mutants.js:303` — `path.basename(m.file)` → `path.relative(HERE, m.file).split(path.sep).join("/")` (`HERE = __dirname`, `:92`; `F.*` são absolutos por `path.join(HERE, …)`, `:121`). **Nenhuma outra linha de código**: mutantes, âncoras, restauração por SHA, `--preflight` intactos; o comentário `:301-302` ("desvio declarado que ENDURECE o trigger") pode ganhar uma linha dizendo que, sob D1, os dois paths são conjunto mutado na forma canônica — mesmo commit, mesmo dono, opcional. Conferir **antes do commit**: `node tests_014_mutants.js --preflight` ⇒ `arquivos_mutados` com `.claude/verify/regra_morta.js` e `.claude/verify/regra_morta_seletor.js`, **sem `\`** (Windows: o `split(path.sep)` é o que garante — FORM1(a) reprovaria localmente, R7 §5). Mensagem: `fix(017): d014 — arquivos_mutados na forma canônica D1 (C4 c)` | `D017-REL1` `FORM1(b)(c)` em `d014` (green) |
| T024 | 2 | build-engineer | chore | | **Repin R4** — fecha T023. `chore(017): gen_pins — R4 (emissão da d014)` | stage `baseline` |
| T025 | 2 | qa-engineer | chore | | **Medição do estado C′** (nada escrito): stage ⇒ **10** `[OK] D017`, `d014` agora com `· insumos: populacao 4`; **só `d016` vermelho** (REL1 10 / REL2 10 + diagnóstico); campanha **`d014` re-executada pelo gatilho** (`[RUN]  d014: node tests_014_mutants.js` … `não-KILL: nenhum — os 9 mutante(s) lidos estão DETECTADO`, ~35 s); `mutation: 1 campanha(s) executada(s) · <n> problema(s)`, exit 1. Em cópia: **`D017-M3`** (`.claude/verify/regra_morta.js` fora de `d014.targets` ⇒ `[FAIL] D017-REL1: d014 · …: .claude/verify/regra_morta.js` — path **aninhado**, **sem** diagnóstico de forma) e **`D017-M8`** (emissão da `d014` revertida a `path.basename` ⇒ REL1 `regra_morta.js` + REL2 `.claude/verify/regra_morta.js` **com** o diagnóstico) | `M3` `M8` · `d014` 9/9 |
| T026 | 2 | build-engineer | **fix** | | `tests_016_mutants.js:555` — `path.basename(f)` → `path.relative(HERE, f).split(path.sep).join("/")` sobre `MUTABLE.concat(CRIAVEIS)` (`HERE`, `:114`; `F.*` absolutos, `:140-150`, inclusive `ps999`, que não existe no disco — existência não é exigida, borda 2). Nenhuma outra linha. Antes do commit: `node tests_016_mutants.js --preflight` ⇒ os 10 paths com diretório (`.claude/verify/fecho.py`, …, `.claude/project-memory/planning-state/999-sintetica-d016.json`, `.claude/verify/fixtures_016/fecho/F5.json`, `.claude/verify/fixtures_016/protecao/sem_fecho.json`), sem `\`. Mensagem: `fix(017): d016 — arquivos_mutados na forma canônica D1 (C4 c)` | `D017-REL1` `FORM1(b)(c)` em `d016` (green) |
| T027 | 2 | build-engineer | chore | | **Repin R5** — fecha T026. `chore(017): gen_pins — R5 (emissão da d016)` | stage `baseline` |
| T028 | 2 | qa-engineer | chore | | **Medição do estado B — o green** (nada escrito): stage ⇒ **11/11** `[OK] D017: …`, sufixos exatamente `d010`/`d009`/`d015` `· insumos: oraculo 1, fixture 1` · `d011` `oraculo 1` · `d014` `populacao 4` · `d016` `fixture 44, declaracao 1` · `ea41` `oraculo 1, declaracao 1`; `[DÍVIDA] core …` presente; `---- semântica do gatilho: 0 problema(s) nomeado(s) ----`; campanhas **`d014` (9/9) e `d016` (35 mutantes + 3 controles, todos DETECTADO, ~22 s+)** re-executadas; `mutation: 2 campanha(s) executada(s) · 0 problema(s)`; **exit 0**. `run.sh --light` 13 PASS. Registrar os números da janela (7 → 2 → 1 → 0) contra a tabela do plano — divergência é achado, não ajuste | todos os `D017-*` verdes · `d014` · `d016` |
| T029 | 2 | build-engineer | chore | | **Push + abrir o PR** `feature/017-semantica-do-gatilho → develop` (`gh pr create --base develop`; P5: o PR abre **só agora**, sobre o estado B — nenhum run de CI vê a janela). Orquestrador grava `pr_url` e `implement.waves_done: [1, 2]` (commit próprio, sem repin). Primeiro run — registrar o número: job `verify` verde com `mutation: 2 campanha(s) executada(s) · 0 problema(s)` e **zero `[DEFER]`** (node + python no job; `verify.yml:42`); job `fecho` **vermelho** com `FECHO PENDENTE da demanda 017 (fase implement)` — é o `D016-PR1` da 016 fazendo o trabalho dele, **não um FAIL da 017**; fica vermelho até T046 | CI (`verify`) |
| T030 | 3 | qa-engineer | chore | | `.claude/verify/mutation-matrix.json` → `dividas_declaradas` (strings, no molde da entrada `EA41-EOL0/EOL1`, `:2216`; hoje **36 dívidas · 163 pares** — **nada entra em `pares`**: nenhum `D017-M*` é mutante de harness, como os `M-IC*` da 013 nunca foram): (i) `D017-M17, D017-M19 · FIAÇÃO` — **uma** entrada, a família (§Medível abaixo continua a contar três linhas `[DÍVIDA]`): sobrevivem à sonda por desenho; `M17` morto pelo par `D017-M2`, `M19` morto sob o **estado NOTA** (`p50` com stdout vazio no `--preflight`), ambos em cópia no red `<SHA de T010>` (precedente `M-IC19`; `M19` por Errata `D017-M19`, spec §Erratas da Fase 3, W0); (ii) `D017-M1…M9 · MUTANTES DE ÁRVORE one-shot` — mortos em cópia (red e W2, SHAs), **não re-executados por campanha**, credor `EA-42`; carrasco enquanto isso: reexecução da bateria pelo `qa-engineer` quando `check_mutation.py` ou `mutation_map.json` mudarem; (iii) `D017-M10…M16, M18 · MUTANTES DE INSTRUMENTO em cópia` — idem, credor `EA-42`; a metade permanente é `D017-SONDA1`. (Refinamento de granularidade sobre o plano, que nomeia M17 e M1…M9: a família de instrumento é a "bateria efêmera de instrumento" que o próprio `EA-42` nomeia — declará-la é dizer o que se fez.) Mensagem: `chore(017): matriz — dívidas declaradas D017 (M17 fiação; famílias one-shot, credor EA-42)` | stage `tdd` |
| T031 | 3 | build-engineer | chore | | **Repin R6** — fecha T030. `chore(017): gen_pins — R6 (matriz)` | stage `baseline` |
| T032 | 3 | doc-writer | doc | | `specs/013-integridade-da-campanha/spec.md` — **erratas aditivas** (spec 017 §Erratas a aplicar na 013): nota inline em `:116` (célula IC-6), `:194` (borda 10), `:231-232` (C2) e `:205-226` (C1), com os SHAs reais (red = T010; `d014` = T023; `d016` = T026); seção única nova `## Erratas da demanda 017 (2026-09-<dd>)` na forma da `:462-495` da própria 013, cabeçalho dizendo **quem decidiu** (o usuário, no portão da Fase 1 da 017, 2026-09-06 — nunca "o TL"), **o que não é reaberto** (E1–E4, G1–G3, T1–T12, IC-1…IC-5, IC-7…IC-10) e que **nenhuma redação original é apagada**. ~~Prova mecânica de "aditiva", antes do commit: `git diff -- specs/013-integridade-da-campanha/spec.md \| grep -c '^-[^-]'` ⇒ **0** (nenhuma linha removida).~~ *(Riscado na W0, 2026-09-06, decisão do orquestrador: **inatingível e cego** — medido em §Prova mecânica de T032. Nota inline numa linha de tabela (`:116`, `:194` são `\| … \|`) ou de prosa (`:231-232`) sai no diff como par `-linha`/`+linha` e o grep conta a reescrita como remoção: a errata legítima simulada dá **3**, nunca 0. E bullet removido — `:222-226` são `- …`, dentro do bloco C1 que a tarefa toca — sai como `-- …`, que `^-[^-]` **não** casa: **0** com a `:226` apagada.)* **Prova mecânica que vale** (§Prova mecânica de T032; script `aditiva_013.py` copiado para tmp — nunca para a árvore, R7 §3): antes do commit `python <tmp>/aditiva_013.py HEAD` (blob de HEAD × árvore); em T033/T040 `python <tmp>/aditiva_013.py <SHA-T032>~1 <SHA-T032>` (blob × blob) ⇒ `aditiva-013: <a> linha(s) alterada(s) por UMA inserção [116, 194, 231 ou 232, …] · <n> linha(s) nova(s) · 0 removida(s) [] · 0 inserção(ões) fora da forma *(Errata IC-6\|C1 · demanda 017: …)* []` e **exit 0** — cada linha alterada é a original mais **exatamente um** trecho inserido, e o trecho é uma nota `*(Errata IC-6 · demanda 017: …)*`/`*(Errata C1 · demanda 017: …)*`; linha nova (a seção) é livre; `<a>` ≥ 3. Limites declarados na seção. Mensagem: `doc(017): erratas aditivas IC-6 (×3) e C1 na spec da 013 (C9)` | C9 (leitura no `spec-validate`) |
| T033 | 3 | build-engineer | chore | | **Repin R7** — fecha T032. `chore(017): gen_pins — R7 (spec da 013)` | stage `baseline` |
| T034 | 3 | doc-writer | doc | | `.claude/BACKLOG.md` (C9): nota datada em **`EA-3`** (`:393`; status `:395` `aberto` — o que a 017 deixou pronto: os três itens de D3 da spec) e em **`EA-44`** (`:3409`; `:3411` `aberto` — credor nomeado pela linha `[DÍVIDA] core …` do bloco 017); **achado novo** para os dois pontos cegos de `ic_estatico` (`check_mutation.py:171-182`: a regex `(\w+)\s*:\s*path\.join\(HERE, …)` não casa `const X = path.join(HERE, …)` — forma de `core`/`p50`/`p52`/`d009`/`d010`/`d011`/`d015`/`d014vis` — e `file\s*:\s*F\.(\w+)` não vê arquivo passado por helper, `em(F.ps016, …)`, `tests_016_mutants.js:396`), id = **próximo livre da série** (hoje o maior é `EA-45` ⇒ `EA-46`; medir no commit), status `aberto`, cadeia arquivo:linha→efeito; correção da citação em `EA-44` (hoje `:3421`: `spec.md:441-442` → `:440-441`, medido). Forma do cabeçalho: `bash .claude/verify/compliance-audit.sh --rule=backlog` **antes** do commit ⇒ `0 FAIL`. Mensagem: `doc(017): BACKLOG — notas EA-3/EA-44, achado ic_estatico, correção de citação (C9)` | C9 · `--rule=backlog` |
| T035 | 3 | build-engineer | chore | | **Repin R8 + push** — fecha T034. `chore(017): gen_pins — R8 (BACKLOG)` | stage `baseline` |
| T036 | 3 | orquestrador (skill `new-demand`) | chore | | Planning-state: `implement.waves_done: [1, 2, 3]`, `phase: validate`; commit próprio, sem repin. **A W4 só começa depois** (árvore limpa para T040) | stage `state` |
| T040 | 4 | qa-engineer | chore | | **Validação executável** — ordem interna obrigatória: **medir tudo, escrever por último** (`spec-validate.md` novo é `??` no porcelain e o próprio stage recusaria). (i) `bash .claude/verify/run.sh` completo ⇒ `verify: 17 PASS · 0 FAIL` (contagens **citadas** por stage; `--light` = 13); FAIL de ambiente, se houver, nomeado com causa antes de atribuir (R2 §3), nunca somado à 017. (ii) `bash .claude/verify/compliance-audit.sh` ⇒ `0 FAIL`. (iii) **Regressão C8 por diff**: stage em clone efêmero de `f790a20` (≡ `abdddd0` nos quatro arquivos — medido) e no HEAD; extrair as linhas `IC-*` e os fechos `---- integridade …`, `---- exceção …`, `---- guarda …`; `diff` após remover a única linha `IC-6` da base ⇒ **vazio**; `IC-5` `19/19` e `19 par(es)` nos dois. (iv) `git diff f790a20 HEAD -- .claude/verify/check_mutation.py` ⇒ hunks só em PP-1…PP-8. (v) CI do PR: job `verify` do último run com `mutation: 2 campanha(s) · 0 problema(s)`, zero `[DEFER]` — run citado por número. (vi) Skill `spec-validate` contra a spec → `specs/017-semantica-do-gatilho/spec-validate.md` (C1–C8 por execução citada; C9 por leitura; forma final das linhas **extraída do executável**, lição E016-5). **< 100 %** ⇒ classificar e devolver ao orquestrador para **uma** iteração (T044/T045); uma segunda ⇒ escalar ao usuário com o quadro completo | pipeline · `spec-validate` |
| T041 | 4 | product-owner | doc | [P] | **Aceite de intenção (Fase 6)** contra o `refinement.md` — as **duas cobranças** escritas em §"Como cobrar esta demanda": (1) nenhum harness precisa de parágrafo de "desvio declarado" sob a regra nova — as sete razões viraram `insumos` e a `_trilha` da `d016` ganhou nota, não parágrafo; (2) fantasma não passa — `D017-M2` morto no red (`red-017.md`) e `M4` na W2 (T022). Mais D3 (nada de população entrou) e D4 (`IC-6` substituído, carrascos vivos). Reprova ou declara *"não encontrei objeção"* — nunca escreve em registro de aceitação (D3). **Não escreve arquivo** — por isso é `[P]` com T042 | portão da Fase 6 |
| T042 | 4 | doc-writer | doc | [P] | `specs/017-semantica-do-gatilho/relatorio-final.md` (PT-BR, R12; molde: 016): **repins executados × previstos** (R0…R9 + qualquer extra, pelo par commit → arquivos, nunca só o rótulo — lição da 016); a **janela vermelha medida × prevista** (7 → 2 → 1 → 0, com as saídas de T012/T022/T025/T028); runs de CI por número (T029, T040); custo residual (campanhas `d014`/`d016` em toda medição pós-W2); a deriva de endereços (`pins.json`, `mutation_map.json`) e a regra "por chave"; candidatas com cadeia: ~~o ramo `[NOTA] D017` sem carrasco (§Vácuos)~~ *(riscada na W0, 2026-09-06: o ramo ganhou carrasco com id — `D017-M19`, spec §Erratas da Fase 3; se `red-017.md` não trouxer a linha de `M19` com saída, é gap de T010, não candidata)*, `EA-3` como próxima demanda sobre o dado que a 017 deixou (D3). **Único arquivo que escreve** | R12 |
| T043 | 4 | build-engineer | chore | | **Fechamento + Repin R9 + push**: um commit de conteúdo com `spec-validate.md` + `relatorio-final.md` (`doc(017): fechamento — spec-validate e relatório final`; `git add` **nominal** dos dois — nunca `-A`) e o repin em chore próprio (`chore(017): gen_pins — R9 (fechamento)`). Asserção: `baseline: 466/466 · 0 divergentes · 0 sem pin` (462 + `tasks.md` + `red-017.md` + `spec-validate.md` + `relatorio-final.md`, se nenhum outro rastreado nascer) | stage `baseline` |
| T044 | 4 | dono do arquivo do gap (nunca `qa-engineer`) | fix / doc | | **Condicional** — só se T040 fechar < 100 %: **uma** iteração de correção, um commit por arquivo, roteada pelo orquestrador pela classe do gap (`spec-errada` ⇒ errata na spec, TL/PO, **com aprovação do usuário**; `implementação-divergente`/`faltando` ⇒ dono do arquivo). Gate **nunca** afrouxado (R10 §1). Se o arquivo for `check_mutation.py`, o dono é o `qa-engineer` **como julgador** — e isso é registrado como segunda edição do gate, com red próprio se a asserção mudar. O `spec-validate.md` ganha iteração 2 (QA) | conforme o gap |
| T045 | 4 | build-engineer | chore | | **Condicional — Repin R10** (rótulo **novo**, nunca reuso de R9: a 016 duplicou "R7" e pagou em trilha) — um por commit de correção de T044; registrado no relatório final | stage `baseline` |
| T046 | 4 | orquestrador (skill `new-demand`) | chore | | Planning-state → **`done`** (Fase 6 completa: `spec-validate.md` e `relatorio-final.md` em disco, `pr_url` presente; CI verde é condição do **merge**, não do `done`); commit sem repin; push. O check `fecho` do PR reexecuta ⇒ `LIBERADO · feature/017-semantica-do-gatilho → develop · 017 em done · artefatos presentes`. **Merge é do usuário**, no GitHub (R14) | `D016-PR1` (verde vivo) |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## Tipagem auditável (R3 §Tipagem) — a previsão do plano, confirmada com a razão

| Tarefa | Tipo | Red que a sustenta (onde está provado) | Por que não é outro tipo |
|---|---|---|---|
| T010 | `feature` | Ela própria: o gate **é** o instrumento; red provado no estado A e commitado com `red-017.md` (R3 §4) | Não é `fix`: nenhuma asserção existente muda de veredito (C8) — nasce um bloco |
| T020 | `fix` | `D017-REL2` 70 fantasmas em 7 harnesses (estado A, `red-017.md`; reconfirmado em T012) | Não é `chore`: o commit muda o veredito de um gate vermelho para verde em 7 harnesses; não é `feature`: nenhum comportamento nasce, dado passa a cumprir contrato (C2 estendido) |
| T023 · T026 | `fix` | `D017-REL1` falso + `FORM1(b)` em `d014`/`d016` (estados A e C, **medidos na árvore real** em T012 e T022) | Não é `feature`: o emissor passa a cumprir um contrato que já existia (C1) na forma que a errata fixa; não é `refactor`: o valor emitido muda |
| T030 | `chore` | — | Nenhum executável julga o conteúdo: `check_tdd.py:49-56` só lê a forma dos `pares` (que não mudam) e imprime `dividas_declaradas` |
| T032 · T034 · T042 | `doc` | — | Prosa e registro (C9); o `spec-validate` lê, não executa |
| T041 | `doc` | — | Aceite de intenção; não escreve no repositório |
| T001 T011 T021 T024 T027 T031 T033 T035 T043 T045 | `chore` | — | Repins: `gen_pins.py` regenera dado; o stage `baseline` é o juiz |
| T012 T022 T025 T028 T040 | `chore` | — | Medições: nada escrito (T040 escreve só o `spec-validate.md`, ao fim) |
| T002 T013 T036 T046 | `chore` | — | Planning-state: estado de processo validado pelo stage `state`, fora do registry |

Nenhum `tdd_waiver` previsto; nenhuma tarefa `refactor`. A tipagem coincide com
a prevista no plano (§Waves, "Tipagem prevista") e na spec (§Tipagem prevista) em
**todas** as linhas — com uma diferença de **dono**, não de tipo, já decidida no
plano (P2): `_meta.sonda_relacao` nasce pelo `qa-engineer` no red (T010), não pelo
`build-engineer` como a spec §Contratos C2 previa para "o mapa". Ver §Onde o
`spec-validate` vai olhar, item (a). *(W0, 2026-09-06: a diferença deixou de
existir — a spec recebeu a Errata `_meta.sonda_relacao`, §Erratas da Fase 3; o
item (a) está riscado com a razão.)*

## Um arquivo, um dono por wave — e a TRAVA do `mutation_map.json`

| Arquivo | W0 | W1 | W2 | W3 | W4 |
|---|---|---|---|---|---|
| `.claude/verify/check_mutation.py` | — | **qa-engineer** (T010) — único commit que o toca na demanda | — | — | — (T044 só se gap o exigir; segunda edição declarada) |
| `.claude/verify/mutation_map.json` | — | **qa-engineer** (T010) — **só** `_meta.sonda_relacao` | **build-engineer** (T020) — `insumos`, `_meta.descricao`, notas em `_trilha` | — | — |
| `tests_014_mutants.js` | — | — | **build-engineer** (T023) | — | — |
| `tests_016_mutants.js` | — | — | **build-engineer** (T026) — outra delegação, outro commit | — | — |
| `.claude/verify/mutation-matrix.json` | — | — | — | **qa-engineer** (T030) | — |
| `specs/013-integridade-da-campanha/spec.md` | — | — | — | **doc-writer** (T032) | — |
| `.claude/BACKLOG.md` | — | — | — | **doc-writer** (T034) | — |
| `specs/017-…/red-017.md` | — | **qa-engineer** (T010) | — | — | — |
| `specs/017-…/spec-validate.md` · `relatorio-final.md` | — | — | — | — | **qa-engineer** (T040) · **doc-writer** (T042) — arquivos distintos, mesmo commit (T043) |
| `.claude/verify/pins.json` | build-engineer | build-engineer | build-engineer | build-engineer | build-engineer — sempre via `gen_pins.py`, commit próprio |
| planning-state da 017 | orquestrador | orquestrador | orquestrador | orquestrador | orquestrador — commit próprio, sem repin |

**TRAVA (o caso difícil, marcado para não ser paralelizado por engano)**: o
`mutation_map.json` tem **dois autores em duas waves**. O `qa-engineer` escreve
`_meta.sonda_relacao` **dentro do commit red** (T010, W1) — pin e gate que o lê
juntos (P2). O `build-engineer` escreve `insumos` (T020, W2) e **não começa antes
de T013** (red commitado, repinado e registrado). Nenhuma tarefa da W2 é `[P]`
com nenhuma outra; T020 é a primeira da wave e é sequencial por construção. Se
alguém precisar mudar o julgador depois do red, **não edita**: volta por
`DEPENDÊNCIAS` ao `qa-engineer` (P1, plano) — e isso é o escalonamento 4 abaixo.

## `[P]` — onde é verdade (uma vez) e por que não é nas outras

**Só T041 ∥ T042** (W4): o `product-owner` não escreve arquivo; o `doc-writer`
escreve um. Podem ser despachadas na mesma mensagem sem pensar.

Por que nada mais é `[P]`, medido, não por cautela:

- **`gen_pins.py:72-79` recusa qualquer pendência fora de `pins.json`** —
  inclusive planning-state e arquivo não rastreado. Um repin por commit de
  conteúdo (R8 §1; rito vivo do repositório) só existe se, entre o commit de
  conteúdo e o seu repin, **nenhum outro agente tiver arquivo pendente na
  worktree**. Escrita paralela de três arquivos na W3 com três repins
  interleaved é mecanicamente impossível; a alternativa — um repin só para os
  três — funde R6/R7/R8, que é o desvio que a 015 e a 016 pagaram e que o plano
  desta demanda promete não repetir. Logo a W3 é **sequencial** (T030 → T031 →
  T032 → T033 → T034 → T035): custo de minutos, trilha limpa.
- **`check_mutation.py:57-61` recusa porcelain sujo**, e a W2 é medição depois
  de cada commit: qualquer segundo agente escrevendo derruba a medição com
  `[FAIL] árvore suja` e sem razão visível no `run.sh` (EA-15 trunca a saída) —
  a 016 registrou **duas** ocorrências exatamente assim (spec-validate O16).
- **W0**: T002 edita o planning-state que T001 exige commitado — sequencial.
- **W1**: uma delegação (T010); T011/T012/T013 dependem do commit anterior.

## O estado do mundo que reprova cada gate — produzido e medido, nunca raciocinado

| Gate | Estado que o reprova | Produzido em | Medido em |
|---|---|---|---|
| `D017-REL1` | conjunto mutado fora do gatilho | **árvore real hoje**, por forma (falso, com diagnóstico): `d014` 2, `d016` 10 — estados A e C; `D017-M1` em cópia (`USER_GUIDE.md` fora de `p51.targets`, T010); `D017-M3` em cópia (`.claude/verify/regra_morta.js` fora de `d014.targets` — path aninhado, exige D1, T025); sonda ii/viii (T010) | T010 (`red-017.md`), T012 (HEAD real), T022 (C), T025 (C′ + M3), T028 (0), T040 (regressão) |
| `D017-REL2` | alvo fantasma | **árvore real hoje**: 70 em 7 (A), 12 em 2 (C), 10 em 1 (C′); `D017-M2` em cópia (`ui_session_v32.js` de volta, T010); `D017-M4` em cópia (classe `fixture` retirada da `d010`, T022); sonda iii | T010, T012, T022, T025, T028, T040 |
| `D017-INS1` (a)–(e) | `insumos` malformado | **vácuo na árvore — declarado** (nenhum `insumos` hoje; após C7, todos válidos); `D017-M5`/`M6`/`M7` em cópia (T010); sonda v/vi/vii/xii/xiii | T010, T012, T040 — carrasco é **exclusivamente** sonda + mutante |
| `D017-FORM1` (a) | `\`, `./`, `..`, `/` inicial | **vácuo — declarado**; `D017-M9` em cópia (emissão com `\`, T010); sonda xiv; razão de existir: Windows, que o CI nunca vê | T010, T012, T040 |
| `D017-FORM1` (b)(c) | basename × repo-relativo | **árvore real hoje** (`d014` 6/2 literal, `d016` 55/10) — estados A e C; `D017-M8` em cópia (emissão da `d014` revertida, T025) | T010, T012, T022, T025 (M8), T028 (0), T040 |
| `D017-CORE1` | `core` como `[OK]` ou em silêncio | a **linha** é alcançada pela árvore sempre (o `core` existe); a **falha** só por `D017-M14` em cópia (julgador devolve `ok` para `None`, T010) + sonda ix | T010, T012, T028, T040 |
| `D017-SONDA1` | julgador mente / `len ≠ total` | `D017-M10`–`M16`, `M18` em cópia (T010); `M17` sobrevive → morto pelo par `M2` | T010, T012, T040 |
| C1 · ramo `[NOTA]` (preflight fracassou) *(Errata `D017-M19`, W0)* | harness não medido que **não** é nomeado **uma** vez: linha `[NOTA]` ausente, `[OK] D017` falso ou `[FAIL] D017-*` duplicado | **não alcançado na árvore** (11/11 preflights válidos, Medição A) — vácuo declarado, mesmo tratamento de INS1/FORM1(a); **estado NOTA** em cópia: `tests_p50_mutants.js:896` → `process.exit(1);` (stdout vazio ⇒ `None`, `check_mutation.py:310-312` → `:341`; **não** "exit 1 com JSON", que fica `dict` e é medido, `:326`/`:354-356`); a **falha** só por `D017-M19` em cópia (fiação, T010) — fora da sonda por desenho: a distinção é do laço (PP-7) | T010 (`red-017.md`, os quatro greps de §Medível), T012 (ausência na árvore real: `grep -c '^\[NOTA\] D017'` = **0**), T040 (leitura) |
| C7 | razões ausentes | estados A e C da árvore; `M4` | T022, T028 |
| C8 | `IC-6` enfraquecido / outra asserção muda | `M1`/`M2` re-mortos contra o gate novo; diff das linhas IC contra `f790a20` | T010, T012 (hunks), T040 (iii)(iv) |
| C9 | — (prosa) | — | T040 (leitura), T041 |

### Vácuos declarados — para o portão, não para depois

1. `INS1` e `FORM1(a)` nascem verdes por vácuo (spec §Guarda de tautologia) — os
   dentes são sonda + mutantes em cópia; nenhum estado real de hoje os reprova.
   Dito na tabela; nada a decidir.
2. ~~**O ramo `[NOTA] D017: <h> · não medida — preflight fracassou e IC-4 já o
   nomeou` não tem carrasco**: não é caso da sonda (é fiação, não `mut_relacao`)
   e nenhum `D017-M1…M18` o cobre; só é alcançável com `IC-4` já em FAIL. Proposta:
   o `qa-engineer` **produz o estado em cópia** (harness da cópia com `--preflight`
   saindo 1) e registra as duas linhas em `red-017.md` como **observação sem id**
   (a 013 fez o mesmo com P6). Se o orquestrador quiser id, é errata da spec com
   `D017-M19` **na W0, antes do red** — decisão a tomar neste portão, não na W1.~~
   **Resolvido na W0 (2026-09-06), decisão (2) do portão da Fase 3 — Errata
   `D017-M19`** (`spec.md` §Erratas da Fase 3). A observação sem id foi
   **recusada**: é a forma de `EA-28`/`EA-30`/`EA-42` (prova que só viveu num
   relatório), dentro da demanda que instrumenta registro contra execução
   (`EA-31`). O ramo tem carrasco com id — `D017-M19`, mutante de fiação em
   cópia, família de `M17` — e o vácuo na árvore fica declarado como o de INS1.
   **Correção de fato ao estado** (medida em clone efêmero de `f56d4fd`, tabela
   da errata): *"`--preflight` saindo 1"* **não** alcança o ramo. Exit 1 com
   JSON válido em stdout mantém `IC_PREFLIGHT[h]` como `dict`
   (`check_mutation.py:326` guarda o `returncode`; a reprova de IC-4 vem de
   `:354-356`, e o bloco 017 mede o harness normalmente); só stdout **vazio**
   (`:310-312`) ou inválido (`:313-325`) devolve `None` (`:341`). O **estado
   NOTA** canônico é a variante A da errata: `tests_p50_mutants.js:896` →
   `process.exit(1);` (nada em stdout no caminho `--preflight` — a única escrita
   é `:878`, dentro de `preflight()`, `:847`; os `console.log` da campanha,
   `:963+`, não são alcançados — medido pela errata). Consolidado em T010, T030 (i), T042, §O estado do mundo e
   §O que cada tarefa deixa medível (T010) — nada renumerado.
3. A spec traz **duas redações** para essa mesma NOTA (célula de C1: *"não medida
   — IC-4 já o nomeou"*; §Comportamento: *"não medida — preflight fracassou e IC-4
   já o nomeou"*). O QA implementa a de §Comportamento (mais específica); a forma
   final é extraída do executável no `spec-validate` (E016-5) — não é gap se
   declarado aqui.

## A janela vermelha, tarefa a tarefa (R3 §4 — vive só na branch)

| Depois do commit de | Harnesses vermelhos | Linhas `[FAIL]` do bloco (uma por harness × gate, forma da spec) | Paths nomeados (REL1 / REL2) | Medido em |
|---|---|---|---|---|
| T010 (red) | **7** | 9 (REL1 ×2, REL2 ×7) | 12 / 70 | T010 (cópia), T012 (real) |
| T020 (`insumos`) | **2** (`d014`, `d016`) | 4 | 12 / 12 | T022 |
| T023 (`d014`) | **1** (`d016`) | 2 | 10 / 10 | T025 |
| T026 (`d016`) | **0** | 0 | 0 / 0 | T028 |

**Monotonicidade 7 → 2 → 1 → 0: nenhuma tarefa a quebra.** Os commits que se
interpõem (R2…R5, os planning-states de T013 e de T029) não tocam nada que o
bloco leia nem nada que esteja em `targets` de harness algum — `pins.json`,
`specs/**` e o planning-state da 017 **não aparecem** em `mutation_map.json`
(grep vazio; os únicos planning-states em `targets` são os da 015 e da 016, na
`d016`). A contagem de "linhas" acima assume `d017_fail` chamado uma vez por
harness × gate (a forma `<paths>` no plural das linhas da spec); se o QA
implementar de outro modo dentro da spec, os números que valem são os que o gate
imprimir e o `red-017.md` fixar (R2 §1) — o que **não pode** mudar são as colunas
"harnesses" e "paths". Invisível ao hook Stop (`--light` não roda `mutation`) e ao
CI (PR abre em T029, estado B). Custo residual a partir de T023: `d014` (~35 s) e,
de T026 em diante, `d016` (~22 s+) re-executam em **toda** medição — é R3 §5.

## Série de repins — dez, cada um amarrado ao commit que o precede

| Repin | Tarefa | Fecha o commit de | Arquivos pinados que mudam | Pins depois |
|---|---|---|---|---|
| R0 | **executado** (`f790a20`, portão da Fase 2) | `plan.md` | `CONTEXT.md` (divergente desde `abdddd0`), `refinement.md`, `spec.md`, `plan.md` | 462 |
| R1 | T001 | `tasks.md` (portão da Fase 3) | `tasks.md` | 463 |
| R2 | T011 | T010 (red) | `check_mutation.py`, `mutation_map.json`, `red-017.md` | 464 |
| R3 | T021 | T020 | `mutation_map.json` | 464 |
| R4 | T024 | T023 | `tests_014_mutants.js` | 464 |
| R5 | T027 | T026 | `tests_016_mutants.js` | 464 |
| R6 | T031 | T030 | `mutation-matrix.json` | 464 |
| R7 | T033 | T032 | `specs/013-integridade-da-campanha/spec.md` | 464 |
| R8 | T035 | T034 | `.claude/BACKLOG.md` | 464 |
| R9 | T043 | T040 + T042 (fechamento, um commit) | `spec-validate.md`, `relatorio-final.md` | 466 |
| R10… | T045 (condicional) | cada commit de correção de T044 | conforme o gap | — |
| (classe a) | — | merge de `develop` na feature, se ela andar antes do merge | `pins.json` **por regeneração**, nunca à mão (013 T023) | — |

Repin fora desta tabela vai **nomeado no relatório final** (T042) com o par
(commit, arquivos) — nunca silenciado, nunca com rótulo reaproveitado.

## O que cada tarefa deixa medível — comando → linha esperada

| Tarefa | Ao terminar, este comando… | …imprime |
|---|---|---|
| T001 | `python .claude/verify/check_baseline.py` | `baseline: 463/463 pins conferem · 0 divergentes · 0 ausentes · 0 sem pin` (e o `gen_pins.py` terá impresso `pins.json: 463 arquivos pinados de HEAD <sha>`) |
| T002 | `python .claude/verify/check_state.py` · `git status --short` | `state: <n> demanda(s) · 0 problema(s)` · vazio |
| T010 | (em cópia, antes do commit) `MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py` | `---- integridade: 0 problema(s) nomeado(s) ----` · `grep -c 'IC-6'` = **0** · `[OK] D017-SONDA1: … 15 cenários …` · `[DÍVIDA] core: relação gatilho × conjunto mutado NÃO MEDIDA — sem preflight (credor: EA-44)` · `[FAIL] D017-REL1: d014 · …` · `[FAIL] D017-REL2: d010 · …` (e mais 6) · exit 1; `python -c "import json;print(json.load(open('.claude/verify/mutation_map.json',encoding='utf-8'))['_meta']['sonda_relacao']['total'])"` ⇒ `15` · **estado NOTA + `M19`** (run à parte, `p50` com `:896` → `process.exit(1);`): pré-condição **nos dois lados** `grep -c '^\[FAIL\] IC-4: p50 ·'` = **1**; gate íntegro `grep -c '^\[NOTA\] D017: p50 · não medida'` = **1** · `grep -c '^\[OK\] *D017: p50'` = **0** · `grep -c '^\[FAIL\] D017-[A-Z0-9]*: p50'` = **0** · fecho `<n>` = o do estado A; sob `M19`: `[NOTA]` = **0** e a forma proibida registrada (`or []` ⇒ `[FAIL] D017-REL2: p50 · alvo fantasma (sem razão de classe): …`), com a saída em `red-017.md` |
| T011 | `check_baseline.py` | `464/464 … 0 sem pin` |
| T012 | o mesmo stage, na worktree, porcelain vazio | as **mesmas** linhas de `red-017.md`; `git diff f790a20 HEAD --stat -- .claude/verify/check_mutation.py .claude/verify/mutation_map.json` ⇒ só esses dois; `run.sh --light` ⇒ `verify: 13 PASS · 0 FAIL` |
| T013 | `python .claude/verify/check_tdd.py` | `[OK]   017-semantica-do-gatilho.json: red provado e commitado (<sha>…)` |
| T020 | `python -c "import json;m=json.load(open('.claude/verify/mutation_map.json',encoding='utf-8'))['harnesses'];print(sorted(k for k,h in m.items() if 'insumos' in h), len(m['d016']['insumos']['fixture']))"` | `['d009', 'd010', 'd011', 'd014', 'd015', 'd016', 'ea41'] 44` |
| T022 | stage | `[OK] D017: d010 · … · insumos: oraculo 1, fixture 1` (e mais 8 `[OK] D017`) · `[FAIL] D017-REL1: d014 · … [forma do path? …]` · `[FAIL] D017-REL2: d014 · … [forma do path? …]` · idem `d016` · `mutation: 0 campanha(s) executada(s) · <n> problema(s)` · exit 1 |
| T023 | `node tests_014_mutants.js --preflight` | JSON com `"arquivos_mutados"` contendo `".claude/verify/regra_morta.js"` e `".claude/verify/regra_morta_seletor.js"`, nenhuma `\` |
| T025 | stage | `[RUN]  d014: node tests_014_mutants.js` · `não-KILL: nenhum — os 9 mutante(s) lidos estão DETECTADO` · `[FAIL] D017-REL1: d016 · …` · `mutation: 1 campanha(s) executada(s) · <n> problema(s)` · exit 1 |
| T026 | `node tests_016_mutants.js --preflight` | JSON com os 10 paths com diretório (`.claude/verify/fecho.py` … `.claude/verify/fixtures_016/protecao/sem_fecho.json`), nenhuma `\` |
| T028 | stage | 11 × `[OK] D017: …` · `---- semântica do gatilho: 0 problema(s) nomeado(s) ----` · `[RUN]  d014` e `[RUN]  d016` com `não-KILL: nenhum` · `mutation: 2 campanha(s) executada(s) · 0 problema(s)` · exit 0 |
| T029 | `gh pr checks <n>` / log do job `verify` | `verify` **pass** com a linha `mutation: 2 campanha(s) executada(s) · 0 problema(s)` e sem `[DEFER]`; `fecho` **fail** com `FECHO PENDENTE da demanda 017 (fase implement)` |
| T030 | `python .claude/verify/check_tdd.py` | `[OK]   matriz gate↔mutante: 163 pares completos` · três linhas `[DÍVIDA] D017-…` novas · `tdd: … · 0 problema(s)` |
| T032 | `grep -c 'Errata IC-6 · demanda 017' specs/013-integridade-da-campanha/spec.md` · `grep -c 'Errata C1 · demanda 017' …` · `grep -c '^## Erratas da demanda 017' …` · ~~`git diff HEAD~1 -- … \| grep -c '^-[^-]'`~~ `python <tmp>/aditiva_013.py <SHA-T032>~1 <SHA-T032>` (§Prova mecânica de T032; antes do commit, `… HEAD`) | `≥ 3` · `≥ 1` · `1` · ~~**`0`**~~ `aditiva-013: <a≥3> linha(s) alterada(s) por UMA inserção [116, 194, …] · <n> linha(s) nova(s) · 0 removida(s) [] · 0 inserção(ões) fora da forma … []` · exit **0** *(W0: o grep antigo era inatingível e cego — riscado com a razão na T032)* |
| T034 | `bash .claude/verify/compliance-audit.sh --rule=backlog` · `grep -n '^## EA-46' .claude/BACKLOG.md` · `grep -c 'spec.md:441-442' .claude/BACKLOG.md` | `0 FAIL` · uma linha · `0` |
| T036 | `check_state.py` | `0 problema(s)`; `state-eval` passa a mostrar `validate` |
| T040 | `bash .claude/verify/run.sh` · `bash .claude/verify/compliance-audit.sh` · diff C8 | `verify: 17 PASS · 0 FAIL` · `compliance: <n> PASS · 0 FAIL · <w> WARN` · diff **vazio** após remover a linha `IC-6` da base |
| T043 | `check_baseline.py` | `baseline: 466/466 … 0 sem pin` |
| T046 | `gh pr checks <n>` | `fecho` **pass** com `LIBERADO · feature/017-semantica-do-gatilho → develop · 017 em done · artefatos presentes` |

### Prova mecânica de T032 — "aditiva" por comando, com os limites declarados

*(W0, 2026-09-06 — substitui o `grep -c '^-[^-]' = 0` da T032, por decisão do
orquestrador ao consolidar as DEPENDÊNCIAS do portão da Fase 3. Tudo abaixo foi
medido no scratchpad sobre o blob `HEAD:specs/013-integridade-da-campanha/spec.md`
(622 linhas), nunca na árvore.)*

**Por que o grep antigo saiu** (`git diff --no-index`, mesma forma do `git diff`):

| Caso | `git diff … \| grep -c '^-[^-]'` | O que significa |
|---|---|---|
| Errata legítima simulada (nota inline em `:116`, `:194`, `:232`; linha nova após `:226`; seção nova no fim) | **3** | **Inatingível**: toda linha reescrita sai como par `-…`/`+…`; o critério `0` reprovaria a errata correta |
| Só o bullet `:226` (`- Texto humano vai para **stderr**…`) apagado | **0** | **Cego**: a remoção sai como `-- Texto humano…` e `^-[^-]` não casa — passaria uma remoção real dentro do bloco C1 que a T032 toca (`:222-226` são bullets) |
| Bullet `:226` movido quatro linhas abaixo (sobre a errata simulada) | **3** (só as reescritas) | Cego do mesmo modo |

**O que vale.** A definição executável de "aditiva": *para toda linha do blob
base, ou ela reaparece idêntica, ou reaparece como ela mesma mais **exatamente
um** trecho inserido — e esse trecho é uma nota `*(Errata IC-6 · demanda 017:
…)*` ou `*(Errata C1 · demanda 017: …)*`; linha nova é livre; linha removida ou
movida reprova.* Compara **blobs** (`git show <rev>:<path>`, R2 §2) ou blob ×
árvore de trabalho; **não escreve nada** (R7 §3); `difflib` linha a linha com
`autojunk=False`. O `doc-writer` copia o bloco abaixo para tmp — `git
hash-object <tmp>/aditiva_013.py` = `9cc9857f3445ff47b4cf7d771617ec5d4301a08b` —, roda antes do commit e cita a
linha impressa em `EVIDÊNCIA`; T033/T040/`spec-validate` repetem sobre os dois
blobs.

```python
# aditiva_013.py — prova mecânica de T032 (demanda 017): a spec da 013 só recebeu
# acréscimos. Lê blobs (git show) ou arquivos; nunca escreve na árvore (R7 §3).
# uso: python aditiva_013.py [BASE=HEAD] [NOVO=<árvore>]   (rev git ou caminho de arquivo)
import difflib, os, re, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8")
P = "specs/013-integridade-da-campanha/spec.md"
NOTA = re.compile(r"^\s*\*\(Errata (IC-6|C1) · demanda 017:.*\)\*\s*$")

def ler(ref):
    if os.path.isfile(ref):
        return open(ref, encoding="utf-8", newline="").read()
    return subprocess.run(["git", "show", f"{ref}:{P}"], capture_output=True,
                          check=True).stdout.decode("utf-8")

def insercoes(a, b):
    """b == a[:k] + ins + a[k:] com ins não vazio? devolve os `ins` possíveis (rotações)."""
    if len(b) <= len(a):
        return []
    p = 0
    while p < len(a) and a[p] == b[p]:
        p += 1
    s = 0
    while s < len(a) and a[len(a) - 1 - s] == b[len(b) - 1 - s]:
        s += 1
    return [b[k:len(b) - (len(a) - k)] for k in range(max(0, len(a) - s), min(p, len(a)) + 1)]

base = sys.argv[1] if len(sys.argv) > 1 else "HEAD"
novo = sys.argv[2] if len(sys.argv) > 2 else P
old, new = ler(base).split("\n"), ler(novo).split("\n")
alteradas, removidas, ruins, novas = [], [], [], 0
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, old, new, autojunk=False).get_opcodes():
    if tag == "equal":
        continue
    if tag == "insert":
        novas += j2 - j1
        continue
    if tag == "delete":
        removidas += list(range(i1 + 1, i2 + 1))
        continue
    j = j1                       # replace: cada linha antiga reaparece, em ordem, como ela + UM trecho
    for i in range(i1, i2):
        cands = None
        while j < j2:
            cands = insercoes(old[i], new[j]); j += 1
            if cands:
                break
            novas += 1
        if not cands:
            removidas.append(i + 1)
            continue
        alteradas.append(i + 1)
        if not any(NOTA.match(c) for c in cands):
            ruins.append((i + 1, cands[0][:60]))
    novas += j2 - j
print(f"aditiva-013: {len(alteradas)} linha(s) alterada(s) por UMA inserção {alteradas} · "
      f"{novas} linha(s) nova(s) · {len(removidas)} removida(s) {removidas} · "
      f"{len(ruins)} inserção(ões) fora da forma *(Errata IC-6|C1 · demanda 017: …)* {ruins}")
sys.exit(1 if removidas or ruins else 0)
```

Uso: `python <tmp>/aditiva_013.py [BASE=HEAD] [NOVO=<árvore>]` — cada argumento é
rev git **ou** caminho de arquivo. Esperado na T032: `0 removida(s) []`,
`0 inserção(ões) fora da forma`, `<a> ≥ 3` alteradas, exit 0.

**Medido** (base = o blob de HEAD; casos construídos em cópia):

| Caso | Saída (campos relevantes) | exit |
|---|---|---|
| Árvore intacta (`python aditiva_013.py HEAD`) | `0 alterada(s) [] · 0 nova(s) · 0 removida(s) [] · 0 fora da forma []` | 0 |
| Errata legítima simulada | `3 alterada(s) [116, 194, 232] · 10 nova(s) · 0 removida(s) [] · 0 fora da forma []` | **0** |
| Bullet `:226` apagado | `1 removida(s) [226]` | 1 |
| Bullet `:226` movido | `1 removida(s) [226]` | 1 |
| `não` inserido em `:230` (linha sem nota) | `1 inserção(ões) fora da forma [(230, ' não')]` | 1 |
| `não` inserido em `:232`, a mesma linha que recebe a nota | `1 removida(s) [232]` — dois trechos ⇒ não é "ela + um" | 1 |
| Duas notas na mesma `:194` | `1 removida(s) [194]` | 1 |
| Arquivo inteiro em CRLF | `621 removida(s) […] · 1 fora da forma [(1, '\r')]` | 1 |

**Limites — declarados agora, não descobertos na W3:**

1. **Prova estrutura, não sentido.** "Nada removido e todo trecho inline é uma
   nota" não prova que a nota diz a verdade nem que a seção nova não contradiz
   o original — isso é C9 **por leitura** (T040 vi, T041). A posição da nota na
   linha não é restringida (no meio da frase passa, desde que seja uma nota).
2. **Linha nova é livre** por definição — a seção `## Erratas da demanda 017`
   só é inspecionada pelo `grep -c '^## Erratas da demanda 017'` = 1 ao lado.
3. **Conservador em dois casos**: dois trechos numa linha e linha movida saem
   como `removida` — a mensagem diz "removida" quando o conteúdo está lá,
   partido ou deslocado. Remédio na T032: **uma** nota por linha, nada movido.
   Não é ponto cego: é FAIL com nome.
4. **CRLF reprova aqui** como efeito colateral (cada linha vira "ela + `\r`").
   O juiz de EOL é `.gitattributes`/`check_eol_text.py`; este só não silencia.
5. **Cegueira a remoção: nenhuma que eu conheça** — toda linha do base tem de
   reaparecer, idêntica ou com um trecho, ou é `removida`; não há heurística
   que descarte linha. Se a W3 encontrar uma, é achado sobre este check, não
   licença para voltar ao grep.

## Onde o `spec-validate` da Fase 6 vai olhar — e o que já nasce defasado

O `spec-validate` extrai exigências da **`spec.md`**
(`.claude/skills/spec-validate/SKILL.md`, passo 1) e confere na implementação
real; a 015 perdeu um item por "coerência `spec.md` × `tasks.md`" (item 36, gap
G1) porque o `tasks.md` era anterior às erratas. Aqui o `tasks.md` nasce
**depois** do plano e não há errata pendente. Por critério:

| Critério | Onde o validador vai olhar | Por execução ou leitura |
|---|---|---|
| C1 `REL1` · C2 `REL2` · C3 `INS1` · C4 `FORM1` · C5 `CORE1` · C6 `SONDA1` | `check_mutation.py` (bloco 017) no HEAD; `red-017.md` (estado A + mutantes em cópia); saídas de T022/T025/T028 no relatório final | execução do stage; a **forma das linhas** sai do executável |
| C7 | `mutation_map.json` (7 `insumos`, 44 `fixture` na `d016`, `_meta.sonda_relacao`, notas datadas); linha `[OK] D017` com sufixo em 7 e sem em 4 | execução (T028) + leitura do JSON |
| C8 | `red-017.md` (tabela `M1`/`M2` com saída); diff das linhas IC contra `f790a20` (≡ `abdddd0`); `git diff` restrito a PP-1…PP-8 | execução (T040 iii–iv) |
| C9 | spec da 013 (`Errata IC-6 · demanda 017` ×3, `Errata C1 · demanda 017`, seção única); `BACKLOG.md` (notas, achado `EA-46`, citação corrigida); `pins.json` regenerado | leitura |
| §Contratos (C1 errata, C2 estendido, C5) | `--preflight` de `d014`/`d016`; shape do retorno de `mut_relacao` lido no fonte; `_meta.sonda_relacao` | execução + leitura |
| §Arquivos rastreados que mudam · §Não mudam | `git diff --stat 9d617d0..HEAD` — só os sete + os artefatos de `specs/017-…/` + `pins.json`; **nenhum** path de produto, `expected_suites.json`, `pipeline.yaml`, `CONTEXT.md`, `boundary.json` | execução |

**O que já sei que nasce defasado ou pode ser lido como gap — declarado agora:**

- ~~**(a) Dono de `_meta.sonda_relacao`.** A spec §Contratos C2 diz "Dono:
  `build-engineer`" para o mapa e a §Tipagem prevista põe `_meta.sonda_relacao`
  na linha do `build-engineer`; o plano aprovado (P2) e este `tasks.md` (T010)
  dão o **pin** ao `qa-engineer`, no red. A spec diz, na própria tabela, que "a
  matriz final é do `tasks.md`" — não é gap; se o validador o pontuar, classe
  `spec-errada` de uma célula, e o remédio é nota, não errata.~~
  **Riscado na W0 (2026-09-06), decisão (3) do portão da Fase 3**: a defasagem
  deixou de existir — a spec recebeu a **Errata `_meta.sonda_relacao`**
  (`spec.md` §Erratas da Fase 3), que dá o pin ao `qa-engineer` no commit red e
  mantém `insumos`/notas com o `build-engineer` na W2; a razão é estrutural (a
  contagem pinada tem de existir quando o gate que a lê nasce), não burocrática.
  (b)–(g) **não renumeram**; nenhuma tarefa, dono, tipo ou wave muda.
- **(b) Linhas de `pins.json`.** A spec e o plano citam `:425`/`:430` para os
  harnesses; hoje são `:428`/`:433` e mudam a cada repin. Conferir **pela chave**.
  Não se emenda spec por endereço instável — o relatório final registra.
- **(c) `mutation_map.json:41` e `:246`.** Endereços das `_trilha`s de `d009` e
  `d016` **antes** de T020; depois das inserções de `insumos` movem-se. As notas
  são localizadas pela chave; o validador deve fazer o mesmo.
- **(d) A NOTA com duas redações** (§Vácuos 3): forma do executável vale.
- **(e) Âncora da regressão C8.** A spec diz `abdddd0`; o plano mediu em
  `36073dd`; o HEAD do portão é `f790a20`. Os quatro arquivos são
  **byte-idênticos nos três** (medido) — T040 usa `f790a20` e cita a equivalência.
- **(f) Contagem de "problemas" no fecho do bloco.** A spec não fixa se
  `D017_FAILS` conta por linha ou por path; a tabela da janela assume por linha
  (harness × gate). O `red-017.md` fixa; nenhum critério depende do número.
- **(g) `EA-46`** é o id **previsto** do achado novo; o id real é o próximo livre
  no momento do commit de T034 — se outro achado entrar antes, muda, e a
  tabela de medição acima passa a valer com o id real.

## O gate que viaja no prompt (R3 §3)

Todo `D017-*` está definido em `spec.md` §Critérios de aceite → gates (com o
mutante previsto), os contratos em `spec.md` §Contratos e os patch-points em
`plan.md` §Patch-points. O prompt de cada delegação leva **ids e caminhos**, nunca
a asserção transcrita — e **nunca o protótipo do TL** (plano §Protótipo).

| Tarefa | Gate no prompt | Onde ler |
|---|---|---|
| T010 | `D017-REL1`…`SONDA1`, C8; PP-1…PP-11 | spec §Critérios · §Comportamento · §Os 15 cenários · §Contratos C5 · plan §Patch-points · plan §Janela (esperado do estado A) |
| T020 | `D017-REL2`/`INS1` (green), C7 | spec §Contratos C2 (tabela C7) · §Vocabulário fechado · plan P7 |
| T023 · T026 | `D017-REL1`/`FORM1(b)(c)` (green) | spec D1 · C4(c) · §Contratos C1 (errata) |
| T012 · T022 · T025 · T028 | os esperados por estado | plan §Janela (tabela commit → veredito) · esta tabela da janela |
| T030 | dívidas | spec D5 · plan §Um dono por arquivo (linha da matriz) · molde `EA41-EOL0/EOL1` |
| T032 · T034 | C9 | spec §Erratas a aplicar na 013 · refinamento §Divergências 4 e 5 · **T032**: §Prova mecânica de T032 deste arquivo (o comando que prova "aditiva" e os seus limites) |
| T040 · T041 · T042 | C1–C9 | spec inteira · refinamento §"Como cobrar esta demanda" |

## Sequência de despacho (quase toda serial — é o desenho, não falta de coragem)

W0: commit do `tasks.md` (portão) → T001 → T002.
W1: T010 → T011 → T012 → T013.
W2: T020 → T021 → T022 → T023 → T024 → T025 → T026 → T027 → T028 → T029.
W3: T030 → T031 → T032 → T033 → T034 → T035 → T036.
W4: T040 → **(T041 ∥ T042)** → T043 → [T044 → T045]* → T046 → merge (usuário).

## Notas de execução que o orquestrador precisa

- **Porcelain vazio é pré-condição de três coisas**: todo repin (`gen_pins.py`),
  toda medição do stage `mutation` (`check_mutation.py:57-61`) e o `run.sh`
  completo. Planning-state editado ⇒ **commit imediato**, sempre. Arquivo novo
  não rastreado (`??`) também suja — por isso T040 mede antes de escrever.
- **Clone efêmero** (receita do plano §Protótipo): `git clone -q --no-hardlinks -b
  feature/017-semantica-do-gatilho "<git rev-parse --git-common-dir>" <tmp>`,
  `git update-ref refs/remotes/origin/develop 9d617d0` (sem isso o stage roda
  **todas** as campanhas), junção de `node_modules`, `MUTATION_DEFER_MISSING=1`.
  Mutantes de árvore e de instrumento vivem **só** aí (R7 §3).
- **`git add` nominal, sempre** — nunca `-A`/`.`/`--all`: a 016 perdeu um
  `spec-validate.md` não rastreado para um commit alheio.
- **O PR abre em T029** (estado B) e o check `fecho` fica **vermelho por
  desenho** até T046 — é a 016 cobrando o `done`, não a 017 falhando. O job
  `verify` do PR é onde `d014`/`d016` rodam no CI (node + python; sem `[DEFER]`).
- **Windows**: `FORM1(a)` é o gate que reprova **aqui** se um harness emitir `\`
  — T023/T026 conferem o `--preflight` antes de commitar; se acusar depois, é
  `git revert` do commit do harness, não afrouxamento.
- **Nunca `--force` no `gen_pins.py`**; nunca editar `pins.json` à mão.

## Escalonamentos previstos (o executor para, não improvisa)

1. **Lista de 44 da `d016` diverge** no commit de T020 (fixture entrou entre W1 e
   W2): recompor por `git ls-files`, nunca copiar da spec; `REL2` nomeia se faltar.
2. **Estado C/C′/B não bate com a tabela da janela** (harnesses ou paths): é
   achado sobre o julgador ou sobre o dado — reportar em `EVIDÊNCIA`, não ajustar
   número nem gate; a correção volta ao dono do arquivo certo.
3. **`spec-validate` < 100 %** duas vezes: escalar ao usuário com o quadro.
4. **Qualquer necessidade de tocar `check_mutation.py` depois de T010**: PARAR e
   devolver por `DEPENDÊNCIAS` ao `qa-engineer`; a edição, se autorizada pelo
   orquestrador, é commit próprio + repin com rótulo novo + nota no relatório —
   e, se a asserção mudar, red próprio (R3 §4).
5. **CI mostra `[DEFER]` para `d014`/`d016`** no job `verify`: ambiente do job, não
   a 017 — investigar `verify.yml:42` antes de qualquer mudança.
6. **Merge de `develop` na feature** exigido antes do merge do PR: repin próprio
   (classe a), `pins.json` resolvido por regeneração.
