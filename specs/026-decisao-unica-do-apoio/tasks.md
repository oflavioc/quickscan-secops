# Tarefas — 026-decisao-unica-do-apoio

> Fase 3 · dono: tech-lead · ids `[TNNN]` são permanentes; wave final é sempre
> validação. Consome o [plan.md](plan.md) e a [spec.md](spec.md); o desenho é
> [`anexos/desenho-sintese.md`](anexos/desenho-sintese.md). Nada dos portões se
> reabre aqui: nenhum critério, gate, mutante, texto, dono de módulo ou decisão
> muda — este artefato fixa **ordem, commit, repin, o que cada tarefa deixa
> medível e onde a Fase 6 vai olhar**. O tech-lead **propõe**; quem delega é o
> orquestrador (R5).
>
> **Quem escreveu**: o `tech-lead`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-10-31, sob delegação do orquestrador, na branch
> `feature/026-decisao-unica-do-apoio` (base `develop @ 9509e4b`). Só leitura;
> nada commitado, repinado ou alterado fora de `spec.md`/`plan.md`/`tasks.md`.
>
> **Portões F1/F2/F3: pendentes** — aprovação literal do usuário no chat (R4).
> D-1..D-9: *decididas pelo orquestrador sob a instrução do proprietário de
> 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR*.
> Nenhuma tarefa abaixo escreve "aprovado pelo usuário" onde não houve
> aprovação do usuário.
>
> **Regras transversais** (valem para toda tarefa que executa algo):
> 1. **Campanhas de mutação sequenciais — d019 → d022 → d023 → d025 → d026 —
>    nunca em paralelo**: mutam in place; duas juntas corrompem a árvore e o
>    veredito contaminado parece achado.
> 2. **Saída de verificação gravada em arquivo, nunca truncada**:
>    `<scratchpad>/026-<tarefa>-<etapa>.log` (fora da árvore); o relatório da
>    tarefa cita a linha do arquivo. `| tail -3` apaga o nome do estágio que
>    falhou.
> 3. **Verificar com os dois comandos**: `bash .claude/verify/run.sh` verde não
>    basta; `bash .claude/verify/compliance-audit.sh` é separado e o CI roda os
>    dois.
> 4. **Preflight de âncoras antes de qualquer campanha** (E14): `ocorrencias == 1`
>    em d019/d022/d023/d025/d026; mutante sobrevivente acusa o gate, não só o
>    código.
> 5. **Repin em commit separado**, por `gen_pins.py` (árvore limpa), motivo na
>    mensagem; `[P]` só onde ninguém escreve o mesmo arquivo rastreado — e o
>    HTML gerado e o `pins.json` **são** arquivos.
> 6. **Portão que barra costuma estar certo**: reportar o bloqueio ao
>    proprietário; nunca contornar pela letra da regex nem por comentário.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | `product-owner` | doc | | **`refinement.md` pelo template** (`.claude/templates/refinement.md`), consolidando os anexos (desenho §0–§11, `contrato-motor.md`, `custo-identidade.md`, `anatomia-apresentacao.md`, `refutacao-reproducoes.json`): Necessidade (QS-01/QS-02/EA-76), Enquadramento (INV-1/2/3/7/8/9 tangenciadas; conflito com decisões registradas: nenhum — `design-decisions.md:15/:17/:18` lidas), Sistema real (matriz §3 do desenho, medida pela sonda), Casos de borda (C1..C10, C3b, C7-UNSET, F2-placeholder, GF ×2), Vocabulário, **Rodadas**: D-1..D-9 registradas com a frase canônica *"decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR"*, Fora de escopo. Não reabre decisão | R4 Fase 0 |
| T002 | 0 | `product-owner` | doc | | **`CONTEXT.md` — verbetes por critério** (EA-47, formato `**Termo**: / definição / _Evitar_`): *Registro de decisão de apoio*; *Hipótese condicionada* (decidir: verbete novo com remissiva **ou** emenda de *Habilitador a validar* `:153-158` — um critério, um verbete); *Veto do motor*; *Linha de produto*. Referenciar `__CURATION.oferta()`/`vetos()` como fonte executável, nunca copiar enum. **Depende de:** T001 | `compliance-audit` (R12) |
| T003 | 0 | `tech-lead` | doc | | **`spec.md` + `plan.md` + `tasks.md`** (este conjunto) pelos templates — feito nesta delegação; o orquestrador leva cada um ao seu portão | R4 Fases 1–3 |
| T004 | 0 | orquestrador (skill `new-demand`) | chore | | **planning-state** `026-decisao-unica-do-apoio.json`: `refinement.status: done` → `specify` → `plan` → `tasks`, cada portão com a aprovação **literal** do usuário citada (nunca de agente); commit próprio, sem repin. `python .claude/verify/check_state.py` ⇒ `0 problema(s)`. **Depende de:** T001–T003 e dos portões | stage `state` |
| T005 | 0 | `build-engineer` | chore | | **Repin R0** — `gen_pins.py` após os commits de T001/T002/T003 (fecha também `anexos/*`, hoje sem pin). `chore(026): gen_pins — R0 (refinement + CONTEXT + spec + plan + tasks + anexos)`. `python .claude/verify/check_baseline.py` ⇒ `N/N pins conferem · 0 divergentes · 0 ausentes · 0 sem pin`. **Depende de:** T004 | stage `baseline` |
| T010 | 1 | `qa-engineer` | **feature** | | **`tests_026_contrato.js` nasce — e nasce vermelho.** Três gates `D026-REC1`/`D026-PAP1`/`D026-LEG1` com **todas** as alíneas da spec §Critérios (tabela + *Nascem vermelhos*), oráculos independentes (motor público; pareamento **reimplementado no teste** pelas regras §Pareamento; `computeFindings()+MAP` como oráculo de hipótese; DOM; papel após `beforeprint`), fixtures C1/C2/C3/C3b/C4/C5/C6/C7/C7-UNSET/C8/C9/C10/F2-placeholder/GF×2 construídas por `__DEV` + escrita em `V32.TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT`/`SESSION_SIGNALS` (padrão `anexos/sonda-leitura.js:33-39`; valores de `anexos/cenarios/*.json`); `vac()` para vacuidade; `D026_HTML_OVERRIDE`/`D026_ONLY`; ausência do contrato falha **nomeando** (`bridge(w)` de `tests_022_escalonamento.js:133-137`). **Red executado e gravado**: `node tests_026_contrato.js > <scratchpad>/026-T010-red.log` ⇒ última linha `D026 CONTRATO: 0 PASS · 3 FAIL de 3`; `red-026.md` com a leitura **por alínea** (o que cai por bridge ausente, o que cai por atributo ausente, o que **nasceria verde** sem os atributos novos — `LEG1 (b)`, `LEG1 (d)` — declarado). Commit: `test(026): red — D026-REC1/PAP1/LEG1 (0/3)`. **Nunca** toca `ui_*.js` | `D026-*` (R3 §4) |
| T011 | 1 | `data-engineer` | doc | `[P]` | **`anexos/pareamento.md` — tabela de pré-imagens do pareamento §1.4**, só leitura do catálogo (`engine_v32.js:78-250` `OFFERINGS`/`SERVICES`/`SERVICE_FAMILIES`; `v3_1_3.html:262-275` `PRODUCTS`): para cada id de `OFFERINGS ∪ SERVICES` a chave resultante e a **regra** (1–5) que decidiu; para cada chave de `PRODUCTS` (13) o conjunto de pré-imagens; os casos que a regra 3 resolve por unicidade (`endpoint-family` → `FortiEndpoint`; `soc-platform-family` → `null` porque três pareiam) e os `null` (lista fechada da regra 5). Nenhuma constraint nova; nenhum toque em catálogo. É o insumo de `REC1 (g)` (QA) e do `chaveDe` (core). `[P]` com T010: arquivos distintos, ninguém reconstrói HTML; commit por **caminho nominal** | `D026-REC1 (g)` |
| T012 | 1 | `build-engineer` | chore | | **Repin R1** — fecha T010 (+ T011). `chore(026): gen_pins — R1 (red: tests_026_contrato + red-026 + pareamento)`. **Depende de:** T010, T011 | stage `baseline` |
| T013 | 1 | orquestrador | chore | | planning-state `red.status: proven`, `red.commit: <sha de T010>`, `red.gates: ["D026-REC1","D026-PAP1","D026-LEG1"]`; commit próprio. `python .claude/verify/check_tdd.py` ⇒ `[OK] 026-…: red provado e commitado`. **Depende de:** T012 | stage `tdd` |
| T020 | 2 | `core-engineer` | **feature** | | **`ui_curation_v32.js` — a derivação única nasce no dono do estado** (spec §Contratos → *Funções*, *Shape*, *Pareamento*, *Bridge*; §Comportamento → portas de saída, veredito, serviço, tier/título, fusão, C3): `entradaViva()`; `reconciliar(entrada)` **pura**; `chaveDe`/`idsDaLinha`/`tipoDaLinha` por critério com a única constante `LINHA_DA_FAMILIA_DE_SERVICO`; `temVoz(ctx)` (comentário-trilha citando `ui_v32.js:750-752`); `veredictoDeServico` com a exceção D-6; fusão por `chave \|\| itemId` com precedência veto > hipótese e a linha-âncora do `D022-M10` **verbatim** (`            if (capNome && reg2.caps.indexOf(capNome) < 0) reg2.caps.push(capNome);` — 12 espaços, `reg2`, `capNome`, campo `caps`); `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false`; `ofertados()` vira leitor; bridge `oferta`/`vetos`/`reconcile` + `contract()` com `{oferta, vetos}`; cabeçalho com a trilha 026. **Byte-iguais**: `valido` (`:154-159`), `decidir` (`:162-165`), `publicados` (`:170-179`), `escolhaDoOperador`, `inclusoesSemLastro`, `paraSessao` (`:199-204`), `validar` (`:218-247`), `daSessao` (`:253-263`), `set`/`unset`/`clear`. Rebuild do HTML (`python build_v32_html.py`) no **mesmo commit**. Medir e gravar: `node tests_026_contrato.js` (esperado 0/3 ainda — `LEG1 (f)`/`REC1 (g)` verdes por alínea, declarado em `red-026.md` §W2 pelo QA, não pelo core), `node tests_019_curadoria.js` 14/14, `node tests_022_escalonamento.js` 14/14, `node tests_023_leitura.js` 9/9, `node tests_025_curadoria_sessao.js` 16/16, `node tests_0NN_mutants.js --preflight` (d019 17/17, d022 13/13, d023 11/11, d025 23/23) **antes e depois**, `python .claude/verify/check_build.py` idêntico, `python .claude/verify/check_lint_arch.py` OK. Gates no prompt: `D026-REC1 (g)(h)`, `D026-LEG1 (b)(c)(f)`, `D026-REC1 (d)(f)` (lógica), por id e caminho | `D026-REC1`, `D026-LEG1`; `D019-M1/M2`, `D025-M2/M3/M5/M9/M23` intactos |
| T021 | 2 | `build-engineer` | chore | | **Repin R2** — fecha T020 (`ui_curation_v32.js` + HTML). `chore(026): gen_pins — R2 (ui_curation + HTML)`. **Depende de:** T020 | stage `baseline` |
| T030 | 3 | `ui-engineer` (A) | **feature** | `[P]` | **`ui_p52_support_v32.js` + `ui_p52_support_v32.css` — tela e papel consomem o registro** (plan §*onde cada linha entra*; spec §Tela, §Papel): `ofertaDoMotor()` leitor de `oferta()` (nome e literal `var produtos = ofertaDoMotor();` `:721` preservados; comentário `:317-323` reescrito; `catch` nomeando); `cardDoProduto`: atributos `data-p53-sol-chave/-item-id/-variantes/-acao/-origem/-condicao` (condição **só** quando não nula), `h4 = p.titulo`, linhas `.p53-sol-variante/-acao/-condicao/-elig`, `corpoDoMotor(p)`, `corpoDoCatalogo(id, nome, escopo)` com `.scope.p53-sol-escopo`; `cardAcrescentado` + `origem="operador"`/`acao="hipotese"`; `declararVetos(sec, vetos)` (`div.p53-sol-vetos[data-p53-vetos][role=note]`, `li[data-p53-veto-item][data-p53-veto-classe]`, "Tecnologia declarada: …", `span[data-p53-sol-extensao]`, "Serviço elegível nesta capability: …"; depois dos cards, antes do botão do editor; fora de `CLASSES_CONTIGUAS`; nunca `.apoio-block`; idempotente nos dois ramos de `decorar()`); `papelHTML`: guarda `if (!cards.length && !aviso && !vetos) return "";`, atributos copiados, `<b>` = `txt(h4)`, `.p53-pr-tier/-variante/-acao/-condicao/-elig/-escopo`, `.p53-pr-vetos[data-p53-vetos]`; `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` fixados **depois** de `grep -n "<literal>" tests_*.js` = 0 e de conferir `P52_COPY` (`ui_p52_workspace_v32.js:128-236`); CSS só `p53-*`, sem hex. **Byte-iguais**: as 10 linhas `find:` de `tests_019_mutants.js` (`:100,115,160,179,214,230,240,248,256,261`), `tests_023_mutants.js:95,135`, `TIER` `:240`, textos de tier/`PROV_TXT`/`h2`/`declararSupressao`. **Em worktree própria** (`git worktree add ../phase5-026a feature/026-…`), commit **só** dos dois arquivos (sem HTML, sem repin). Medir e gravar: `node tests_026_contrato.js` sobre HTML **efêmero** construído em tmp (`D026_HTML_OVERRIDE`) ⇒ esperado 3/3 (com T020 já na base); `tests_019` 14/14; `tests_022` 14/14; `tests_023` 9/9; preflight d019/d022/d023 — **d022 `D022-M10` com `ocorrencias: 0` é esperado e declarado** (reancorado em T040). Gates no prompt: `D026-REC1 (a)(b)(c)(d)(e)(h)`, `D026-PAP1`, `D026-LEG1 (a)(c)(d)(e)(g)` | `D026-REC1`, `D026-PAP1`, `D026-LEG1`; `D019-M4/M5/M7/M9/M13/M14/M15/M16/M17/M18`, `D023-M2/M6` intactos |
| T031 | 3 | `ui-engineer` (B) | **feature** | `[P]` | **`ui_curation_edit_v32.js` — D-9, "apresentado como <variante>"** (plan §editor): `linhaProduto` `:78-105` ganha `span.p53-cur-item-var` lido de `b.oferta()` quando `reg.titulo !== reg.nome`; `data-p53-cur-item`/`.p53-cur-item-nome` continuam a **linha** (`D025-UNS1`); sem CSS (B não escreve `ui_p52_support_v32.css`). **Byte-iguais**: `gateFechado()` `:62-65` (`D019-M10`), handler `:86-93` (`D025-M18`), `decorar()`, lista de acréscimos `:200-208`. **Em worktree própria** (`../phase5-026b`), commit só deste arquivo. Medir e gravar: `tests_019` 14/14, `tests_025` 16/16 sobre HTML efêmero; preflight d019/d025. Gate no prompt: `D026-LEG1 (g)` (parte do editor) + `D025-UNS1` | `D026-LEG1 (g)`; `D019-M10`, `D025-M18` intactos |
| T032 | 3 | orquestrador | chore | | **Junção das worktrees** (A e B em ordem; `git merge --no-ff` ou cherry-pick por caminho nominal), remoção das worktrees. Nenhum conflito esperado (arquivos distintos). **Depende de:** T030, T031 | — |
| T033 | 3 | `build-engineer` | chore | | **Um rebuild + Repin R3** — `python build_v32_html.py` (commit `build(026): HTML — W3 (support + css + editor)`), depois `gen_pins.py` (`chore(026): gen_pins — R3 (W3 + HTML)`). Medir e gravar na árvore real: `node tests_026_contrato.js` ⇒ **`3 PASS · 0 FAIL de 3`**; `check_build.py` idêntico; `check_lint_arch.py` OK. **Depende de:** T032 | stage `build`, `baseline` |
| T040 | 4 | `qa-engineer` | chore | | **Reancorar `D022-M10` — quatro toques em `tests_022_mutants.js`** (spec §Reancoragens): (i) mapa `F` `:45-49` ganha `estado: P("ui_curation_v32.js")`; (ii) `:109` `file: F.apoio` → `file: F.estado`; (iii) `precisaBuild` `:241` ganha `\|\| m.file === F.estado`; (iv) comentário-trilha com data e motivo (a linha-âncora mudou de arquivo; ataque e `reason` idênticos). `find`/`repl`/`reason` **byte-iguais**. Tipo `chore` porque **nenhuma asserção de gate muda** (`D022-PROD1` intacto); a prova é a campanha. Medir e gravar: `node tests_022_mutants.js --preflight` ⇒ 13/13 `ok` (âncora `ocorrencias: 1` em `ui_curation_v32.js`); campanha **d022** ⇒ `D022-M10` DETECTADO pelo motivo nominal, contra o HTML reconstruído | `D022-PROD1` · d022 |
| T041 | 4 | `build-engineer` | chore | | **Repin R4a** — fecha T040. `chore(026): gen_pins — R4a (tests_022_mutants: D022-M10 → F.estado)`. **Depende de:** T040 | stage `baseline` |
| T042 | 4 | `qa-engineer` | doc | | **Comentário-trilha E13 em `tests_019_curadoria.js`** — `D019-SOL1` (`:372`), `D019-SOL3 (b)` (`:502`), `D019-MED1` (`:326`): *"oráculo `computeFindings()+MAP` vale em modo legado/hipótese; com voz do motor o oráculo é `D026-REC1`"*; em `MED1`: *"`reconciliar()` é insensível ao estado do operador"*. **Corpo byte-idêntico** (prova mecânica: diff só em linhas de comentário — `git diff -U0 \| grep '^[+-]' \| grep -v '^[+-]\s*/\?\*'` vazio). Se qualquer asserção mudar, a tarefa vira `fix` e exige red: **PARADA**. Medir: `node tests_019_curadoria.js` 14/14; preflight d019 17/17 | `D019-SOL1/SOL3/MED1` (asserções intactas) |
| T043 | 4 | `build-engineer` | chore | | **Repin R4b** — fecha T042. `chore(026): gen_pins — R4b (tests_019_curadoria: trilha E13)`. **Depende de:** T042 | stage `baseline` |
| T044 | 4 | `qa-engineer` | chore | | **Harness + registros — UM commit** (D4 da 013: `preflight: true` nasce no mesmo commit em que o harness lê `--preflight`; `check_suites.py` reprova suíte fora do registro desde T010 — o vermelho nomeado fecha aqui). (1) **`tests_026_mutants.js`**: `D026-M1..M6` da spec (coluna *Mutante previsto* + §Estado do mundo abaixo), âncoras por **texto estável** (nunca nº de linha), runner no padrão `tests_025_mutants.js` (mutação em cópia, rebuild em `os.tmpdir`, `D026_HTML_OVERRIDE`, restauração byte a byte em `finally`, `--preflight` com `ocorrencias == 1`, `reason` **nominal por gate** `/FAIL {2}D026-REC1\b/`…, `D026_MUT_LOG` opcional fora da árvore); (2) **`expected_suites.json → suites.d026`**: `{ cmd: "node tests_026_contrato.js", pass: 3, fail: 0, _trilha }` — contagem **medida** em T033; `_trilha` registra a janela vermelha (T010 0/3 → T020 0/3 → T033 3/3) e o que nasceu verde por alínea; (3) **`mutation_map.json → harnesses.d026`**: `cmd`, `preflight: true`, `targets: [tests_026_contrato.js, tests_026_mutants.js, ui_curation_v32.js, ui_p52_support_v32.js, ui_p52_support_v32.css, ui_curation_edit_v32.js]`, `insumos: { oraculo: [tests_026_contrato.js] }`, `requires: [node, python]`, `_trilha`; **`harnesses.d022.insumos.populacao`**: `ui_curation_v32.js` passou a alvo **mutado** (T040) — conferir pela semântica do gatilho (`check_mutation.py`) se a entrada sai; (4) **`mutation-matrix.json`**: 6 pares + `dividas_declaradas`: `LEG1 (d)` (porta de saída de suficiência, sem carrasco), `LEG1 (f)` (pureza, sem carrasco), D-9 (sem gate), constante C3 (pinada por alínea, sem mutante). Então: **preflight de todas** (d019/d022/d023/d025/d026) e **campanhas sequenciais** d019 → d022 → d023 → d025 → d026, cada uma gravada em `<scratchpad>/026-T044-<harness>.log`; veredito esperado **17 · 13 · 11 · 23 · 6 DETECTADO, 0 SOBREVIVENTE, 0 NÃO EXECUTADO**; sobrevivente ⇒ acusa o gate (R10 §1: nunca afrouxar) ⇒ reportar, não contornar. Por fim `bash .claude/verify/run.sh > <scratchpad>/026-T044-run.log` **e** `bash .claude/verify/compliance-audit.sh > <scratchpad>/026-T044-audit.log`. Commit: `test(026): harness d026 + registros (expected_suites, mutation_map, matrix)` | `D026-M1..M6` · IC-4 · stages `suites`, `mutation` |
| T045 | 4 | `build-engineer` | chore | | **Repin R4c** — fecha T044. `chore(026): gen_pins — R4c (harness d026 + registros)`. **Depende de:** T044 | stage `baseline` |
| T050 | 5 | `build-engineer` | chore | | **`.claude/verify/bridges.json`** — nota `[026]` do `__CURATION` com o texto do plan §bridges.json; `owner` intactos; `__P53SOL`/`__P53CUR` intactos. `python .claude/verify/check_lint_arch.py` ⇒ bridges em uso todos registrados. Commit `chore(026): bridges.json — nota __CURATION (oferta/vetos/reconcile)` | stage `lint-arch` |
| T051 | 5 | `build-engineer` | chore | | **Repin R5** — fecha T050. `chore(026): gen_pins — R5 (bridges.json)`. **Depende de:** T050 | stage `baseline` |
| T052 | 5 | `build-engineer` | chore | | **CI do PR — `verify` + `visual`** (push da branch; PR abre só em T066, mas um **PR de rascunho** ou `workflow_dispatch` dispara o job `visual` — decisão do orquestrador): medir `playwright P8` (`tests_visual/print.spec.js:100-104`, 12 páginas) e `P52-PDF5/PDF6` (`tests_p52_chromium.js`). Verde ⇒ registrar. Divergente ⇒ **PARADA** (plan §Boundary): primeiro a alternativa de layout (T030 reaberta: condensar tier + condição numa linha do `pr-card`, nova rodada T030→T033→T044), e **só** se persistir, repin de BASELINE declarado **com autorização nominal do proprietário no chat** (`tests_visual/`/`tests_p52_chromium.js` são §29.4). Nunca afrouxar | `P8`, `P52-PDF5/6` (job `visual`) |
| T060 | 6 | `doc-writer` | doc | | **`.claude/BACKLOG.md`** (uma vez, aqui): `EA-76` → `resolvido` (cadeia: `ui_curation_v32.js` `reconciliar()`/`oferta()`; `ui_p52_support_v32.js` `ofertaDoMotor()` leitor; gates `D026-REC1 (h)`; PR); **achado novo** com id permanente (próximo livre — `EA-121` é o último em HEAD; o doc-writer confere): *lacuna do engine — `suppressedByPlatform().caps` não consultada no ramo `CONTEXT_NOT_INFORMED` (`engine_v32.js:573`, `:584`, `:636` vs `:601-602`); `violated` descartado em silêncio (`:448`); serviço inelegível descartado em silêncio (`:659`)* — status `aberto`, classe engine (Porta B futura), cadeia arquivo:linha→efeito (C3 vira hipótese em vez de "plataforma cobre"); **candidato** a achado: `exclude` obsoleto sem sujeito no arquivo de sessão (`ui_curation_v32.js:170-179 → :312`). Nenhum achado riscado | R12 §Achados |
| T061 | 6 | `product-owner` | doc | | **`.claude/rules/design-decisions.md`** — D-1 (sem card de aquisição em C2/C4; veto visível), D-2 (`CONTEXT_NOT_INFORMED` = hipótese condicionada, tier por `sev`) e D-7 (título do card = item resolvido; `data-p53-sol-produto` = linha) entram na tabela *Confirmadas* **somente após a ratificação literal do proprietário no PR** (fonte: a frase dele, data, onde); até lá, ficam em *Candidatas* com a nota *"decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR"*. Cada entrada com "Não reportar como defeito: …" | R13 |
| T062 | 6 | `build-engineer` | chore | | **Repin R6** — fecha T060 + T061 (dois commits, um repin). `chore(026): gen_pins — R6 (BACKLOG + design-decisions)`. **Depende de:** T060, T061 | stage `baseline` |
| T063 | 6 | `qa-engineer` | doc | | **`spec-validate.md`** (skill `spec-validate`, **somente leitura**): itens = 8 critérios (C1–C8) + 3 gates por alínea + 6 mutantes + reancoragem `D022-M10` (4 toques) + trilha E13 + contratos (bridge, shape, pareamento, `bridges.json`) + registros (suites, map, matrix, pins) + *O que NÃO muda* (engine/Camada 1 — `check_m41.py` verde; `D019-MED1` verde; `valido`/`decidir`/`publicados`/`validar`/`daSessao` byte-iguais por `git diff`; `TIER`; textos de tier; `D025-*` 16/16) + D-9 por leitura (`.p53-cur-item-var`) + dívidas declaradas (`LEG1 (d)(f)`, D-9, constante C3) + R9 §7 (contagem de linhas real de `ui_p52_support_v32.js` e `ui_curation_v32.js` contra a justificativa do plano). Cada item conferido por **execução ou leitura do fonte**, nunca pelo relatório de quem implementou. Gaps classificados (`spec-errada` / `codigo-errado` / `registro`) — gap de spec vira errata classe (c) **sem** reescrever a redação original (R2 §5) | R4 Fase 6 |
| T064 | 6 | `product-owner` | doc | `[P]` | **Aceite de intenção** contra o `refinement.md` (T001), a matriz §3 do desenho (antes/depois medidos pela sonda **re-executada** sobre o HTML final: `node anexos/sonda-leitura.js anexos/cenarios/C<n>.json` para C1..C10 e C3b, saída em arquivo) e os aceites do plano do proprietário §2 (*C1–C4 em tela e relatório; NDR e serviço gerenciado; contexto ausente = hipótese condicionada; terceiro em produção = ação operacional sem produto novo; sinal adjacente mantém origem; acréscimo mantém marcador; retirado não reaparece; A→B não contamina; identidade/variante/status/motivo/escopo entre superfícies*) — **lê; não escreve**. Veredito nos termos da R4: *"não encontrei objeção"* ou reprova nomeada. `[P]` com T063 (um escritor por vez na worktree: o PO só lê). **Depende de:** T052 | R4 Fase 6 |
| T065 | 6 | `build-engineer` | chore | | **Repin R7** — fecha T063. `chore(026): gen_pins — R7 (spec-validate)`. **Depende de:** T063 | stage `baseline` |
| T066 | 6 | `doc-writer` | doc | | **`relatorio-final.md`**: problema e causa (QS-01/QS-02/EA-76); contrato adotado e por quê (B com enxertos; placar dos juízes); arquivos alterados e limites; **matriz antes/depois C1–C10 + C3b + fidelidade do PDF** (sonda re-executada, T064); **delta visível declarado** (o que o cliente passa a ver: vetos com razão; título por variante; condição visível; tier/escopo no papel); série de repins executada × prevista (R0–R8; desvios por classe (a)–(e), nomeados); janela medida × esperada (plan §Janela vermelha, coluna a coluna); custo medido das campanhas; o que **não** foi executado e por quê; impacto sobre as invariantes; decisões pendentes (D-1..D-9 ratificação; D-3 constante; D-5 serviços sem linha; residuais `chave:null` e `include` pré-025 sobre linha vetada); veredito do PO (T064); as três correções da conferência ao desenho (precedência, D-4 retirada, C3 desligada) e as três do instrumento (harness na W4; `D022-M10` 4 toques; M4 não é julgado pela 025). **Depende de:** T064 | R12 |
| T067 | 6 | `build-engineer` | chore | | **Repin R8** — fecha T066. `chore(026): gen_pins — R8 (relatorio-final)`. **Depende de:** T066 | stage `baseline` |
| T068 | 6 | orquestrador (skill `new-demand`) | chore | | **Push + PR + fecho de estado — antes do merge** (precedente 023/025): `git push -u origin feature/026-decisao-unica-do-apoio`; `gh pr create --base develop` com o corpo contendo **o pedido de ratificação literal de D-1..D-9** (lista do desenho §10, uma linha cada, com a recomendação) e a atribuição exigida; planning-state `pr_url`, `validate.conformance` (T063), `validate.status`, **`phase: done`** — commit próprio, sem repin; push. CI do PR: `verify` verde; `visual` verde (T052); `fecho` (`check_fecho.py --pr`, com `GITHUB_*_REF` exportadas se rodado localmente — memória do projeto). **Depende de:** T067 | `D016-PR1` · checks obrigatórios |
| T069 | 6 | **`usuário`** | chore | | **Ratificação literal de D-1..D-9 no PR** (comentário ou revisão) e **merge** `feature/026-decisao-unica-do-apoio → develop` no GitHub — *"Create a merge commit"*, nunca squash (R14) — só depois de T068 verde. Se a ratificação **inverter** qualquer decisão: T061 **não** promove a entrada; a demanda reabre na fase correspondente (D-1/D-2 invertidas ⇒ parar e escalar — desenho §10, 35 gates da 010 por vácuo). Ato humano fora do repositório, por isso tarefa nomeada. Deploy em `127.0.0.1:1337` **não** é desta demanda | R14 · `check_fecho` (pós-merge) |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## Tipagem auditável — por que cada tipo é o que é

| Tipo | Tarefas | Red que as cobre / por que não precisam |
|---|---|---|
| `feature` | T010 (a suíte nasce), T020, T030, T031 | **T010** (`red.commit` = SHA de T010): `REC1 (d)(f)(g)(h)`, `LEG1 (b)(c)(f)` → T020; `REC1 (a)(b)(c)(e)`, `PAP1`, `LEG1 (a)(d)(e)(g)` → T030; `LEG1 (g)` (editor) → T031. O gate viaja no prompt pelo **id e caminho**, nunca transcrito |
| `fix` | nenhuma | a reancoragem do `D022-M10` **não muda o que o gate mede** (`D022-PROD1` byte-igual; muda onde o mutante vive) — é `chore` de harness, provada pela campanha; se a W4 descobrir que uma asserção precisa mudar, vira `fix` e exige red: PARADA |
| `doc` | T001, T002, T003, T011, T042, T060, T061, T063, T064, T066 | nenhuma asserção executável muda; T042 muda só comentário (prova mecânica no corpo); T011 é leitura de catálogo; T061 depende de ratificação do usuário |
| `chore` | T004, T005, T012, T013, T021, T032, T033, T040, T041, T043, T044, T045, T050–T052, T062, T065, T067, T068, T069 | repins (`gen_pins` é gerador), estado de processo, junção de worktrees, rebuild (builder), harness + registro de contagem **verde** (T044: o oráculo de contagem nasce depois do green por desenho — spec 019 E2), medição no CI, atos humanos. Nenhum `tdd_waiver` previsto |

## Um módulo por delegação — conferido wave a wave

| Wave | Arquivo escrito | Dono único |
|---|---|---|
| 0 | `refinement.md` + `CONTEXT.md` (T001/T002) · `spec.md`/`plan.md`/`tasks.md` (T003) · planning-state (T004) · `pins.json` (T005) | `product-owner` · `tech-lead` · orquestrador · `build-engineer` |
| 1 | `tests_026_contrato.js` + `red-026.md` (T010) · `anexos/pareamento.md` (T011) · `pins.json` (T012) · planning-state (T013) | `qa-engineer` · `data-engineer` · `build-engineer` · orquestrador — T010 ∥ T011 por caminho nominal |
| 2 | `ui_curation_v32.js` + HTML (T020) · `pins.json` (T021) | `core-engineer` · `build-engineer` |
| 3 | `ui_p52_support_v32.js` + `.css` (T030, worktree A) · `ui_curation_edit_v32.js` (T031, worktree B) · HTML + `pins.json` (T033) | `ui-engineer` A · `ui-engineer` B · `build-engineer` — **o HTML é escrito uma vez, por um dono, depois da junção** |
| 4 | `tests_022_mutants.js` (T040) · `tests_019_curadoria.js` (T042) · `tests_026_mutants.js` + `expected_suites.json` + `mutation_map.json` + `mutation-matrix.json` (T044) · `pins.json` (T041/T043/T045) | `qa-engineer` ×3 (commits distintos, seriais pelo repin) · `build-engineer` |
| 5 | `bridges.json` (T050) · `pins.json` (T051) | `build-engineer` |
| 6 | `BACKLOG.md` (T060) · `design-decisions.md` (T061) · `spec-validate.md` (T063) · `relatorio-final.md` (T066) · planning-state (T068) · `pins.json` (T062/T065/T067) | `doc-writer` ×2 · `product-owner` (escreve T061; **só lê** em T064) · `qa-engineer` · orquestrador · `build-engineer` |

**`[P]` só em T011 (com T010) e em T030/T031 (worktrees distintas) e em T064
(o PO lê ao lado de T063).** T030/T031 são módulos distintos sem dependência
lógica entre si, mas o HTML gerado e o `pins.json` são um arquivo só — por isso
cada um commita **só o seu módulo** na própria worktree e o rebuild + repin
fecham a wave uma vez (T033). A delegação diz **"commit do módulo, volte;
rebuild e repin são de T033"**. O orquestrador atualiza `implement.waves_done`
após cada wave em commit próprio (sem repin), nunca junto com conteúdo.

## O gate que viaja no prompt (R3 §3)

O prompt leva o **id** e **estes caminhos** — nunca a asserção transcrita, nunca
implementação inline (R5 anti-patterns).

| Tarefa | Gates no prompt | Onde ler |
|---|---|---|
| T010 | `D026-REC1 (a)–(h)`, `REC1 (i)`, `D026-PAP1`, `D026-LEG1 (a)–(g)` | spec §Critérios (tabela, *Nascem vermelhos*, oráculos, fixtures), §Reancoragens, §Comportamento (tabelas), §Contratos (shape, pareamento, bridge); `anexos/cenarios/*.json`, `anexos/sonda-leitura.js:33-39`; aqui §Estado do mundo |
| T011 | `D026-REC1 (g)` | spec §Contratos → *Pareamento*; `anexos/contrato-motor.md` §4 (tabela de identidade); `anexos/custo-identidade.md` §6 |
| T020 | `D026-REC1 (d)(f)(g)(h)`, `D026-LEG1 (b)(c)(f)` | spec §Contratos (funções, shape com `caps`, pareamento, bridge, *o que a conferência mudou*), §Comportamento (portas, veredito, serviço, tier/título, fusão, C3); plan §Contratos (precedências, instrumentabilidade, **restrições de âncora**); `anexos/pareamento.md` (T011); aqui M1/M3/M5/M6 |
| T030 | `D026-REC1 (a)(b)(c)(e)(h)`, `REC1 (i)`, `D026-PAP1`, `D026-LEG1 (a)(d)(e)(g)` | plan §*`ui_p52_support_v32.js` — onde cada linha entra* (tabela com os literais a preservar); spec §Tela, §Papel, §Contratos → *Regra de ouro* (rótulos só na apresentação); `anexos/anatomia-apresentacao.md` §1.4, §4.2, §5.5; aqui M2/M4 |
| T031 | `D026-LEG1 (g)` (editor), `D025-UNS1` | plan §editor; spec §Editor |
| T040 · T042 | `D022-PROD1` · `D019-SOL1/SOL3/MED1` | spec §Reancoragens (os 4 toques; a trilha E13); plan §Janela vermelha |
| T044 | `D026-M1..M6`; IC-4; `suites`/`mutation` | spec §Critérios (coluna *Mutante previsto*); plan §*Quando o harness nasce*, §Tabela de gatilho; aqui §Estado do mundo (uma linha por mutante) |
| T050 | stage `lint-arch` | plan §bridges.json (texto da nota) |
| T052 | `P8`, `P52-PDF5/6` | plan §Boundary (PARADA), §Riscos |
| T060 · T061 | — | spec §Fora de escopo (engine); desenho §10/§11; R12/R13 |
| T063 · T064 · T066 | todos | spec, plan, este arquivo; desenho §3 (matriz); plano do proprietário §2 (aceites) |

## O estado do mundo que reprova cada gate — produzido e medido, nunca raciocinado

Uma linha por mutante da spec (ids permanentes `D026-M1…M6`). Coluna **hoje?**:
se o produto de hoje **é** esse estado, o red (T010) o mede **na árvore real**;
se **não**, o único carrasco é a campanha (T044) e isso fica dito. Precedente:
`specs/025-curadoria-transacional/tasks.md` §Estado do mundo.

| Mutante | Gate · alínea | O que muta (arquivo · âncora prevista, por texto) | Fixture que reprova · forma esperada da falha | Hoje? | Produzido em | Medido em |
|---|---|---|---|---|---|---|
| **M1** | `REC1 (a)(b)(c)` | `ui_curation_v32.js`: `temVoz` devolve `false` sempre (todo `ctx` tratado como `CONTEXT_NOT_INFORMED`) | **C2/C4**: cards `FortiEndpoint`/`FortiAnalyzer`+`FortiSIEM` reaparecem (`[data-p53-sol-produto]` > 0) e `[data-p53-vetos]` ausente — `FAIL  D026-REC1` (b); **C1/C6**: `h4` = linha, sem `item-id` — (a)/(c); **C7**: some só o veto do `FortiEndpoint` (produto); o veto do MDR e o card SOCaaS `servico` permanecem — o veredito de serviço não lê `temVoz`; (d) e `LEG1 (e)` seguem com sujeito | **sim** — é o produto de hoje (`ofertaDoMotor()` deriva só do MAP; sonda: C1/C2/C4/C7) | árvore real (T010); cópia (T044) | T010 `red-026.md`; T044; T063 |
| **M2** | `PAP1` | `ui_p52_support_v32.js`: `papelHTML` deixa de copiar `data-p53-sol-tier` e de emitir `.p53-pr-tier` (**só no papel**, padrão `D019-M4`) | **C5**: 0/9 `pr-card` com `data-p53-sol-tier` (esperado 9/9); **C1/C7/C9/C10**: atributo do `pr-card` ≠ atributo do card homônimo — `FAIL  D026-PAP1`; tela intacta (o mutante não a toca — é assim que as duas superfícies divergem, EA-58) | **sim** — é o QS-02 (sonda: `papel.cards[].tierAttr === null` em C1–C7; C5 0/9) | árvore real; cópia | T010; T044; T063 |
| **M3** | `REC1 (a)(c)(e)(i)`; `LEG1 (g)`; `REC1 (h)` | `ui_curation_v32.js`: `chaveDe` pareia **só por nome exato** (regras 2 — `variantOf` — e 3 — representante único — removidas) | **C1**: `fortiedr` sem chave ⇒ registro `chave:null`, `data-p53-sol-produto="FortiEDR"` ≠ "FortiEndpoint" — (a); `set("FortiEndpoint","exclude")` não retira `[data-p53-sol-item-id="fortiedr"]` — `LEG1 (g)`; `published()` (vazio de `fortiedr`) ≠ tela — (h); **C6**: `fortindr-onprem` sem chave ⇒ linha ≠ `FortiNDR` — (c); **C10**: `fortisiem-cloud` vira card "FortiSIEM Cloud" — (e); **F2-placeholder**: `endpoint-family` sem chave ⇒ `cards ≠ published()` ⇒ `D023-REG1 (c)` cai (carrasco em suíte alheia, declarado — a d023 roda `tests_023_leitura.js`) | **≈ sim** — hoje `ofertados()` `:136-142` e `idDoNome` pareiam só por nome; o estado é o de hoje **sem** as regras 2–3 | árvore real (T010 mede as alíneas por ausência); cópia (T044) | T010; T044; T063 |
| **M4** | `REC1 (b)`; `PAP1` (vetos); `LEG1 (e)` | `ui_p52_support_v32.js`: `declararVetos` escreve `data-p53-suprimido` (e `.p53-sol-suprimido`) em vez de `data-p53-vetos` | **C2/C4/C7/C3b**: `[data-p53-vetos]` ausente — `FAIL  D026-REC1` (b); `[data-p53-suprimido]` **presente sem curadoria** — `FAIL  D026-LEG1` (e); papel sem `.p53-pr-vetos` — `PAP1`. **Conferido**: `D025-AUS1 (b)` **não** é carrasco (as fixtures da 025, `tests_025_curadoria_sessao.js:238-262`, não têm veto — legado/`contexto:true` sem landscape operacional); o desenho §7 o listava — corrigido aqui, declarado | **não** — hoje não existe bloco de vetos (REC1 (b) é vermelho hoje por **ausência** de `[data-p53-vetos]`, outro estado) | **só cópia** (T044) | T044; T063 |
| **M5** | ~~`REC1 (d)(f)`~~ **`REC1 (j)`** (errata E12) | `ui_curation_v32.js`: fusão sem a precedência veto > hipótese (`vetos.length > 0` deixa de derrubar `hipoteses[]` da mesma chave) | ~~**C7**: card `[data-p53-sol-produto="FortiGuard MDR"]` prioritária nasce da hipótese de `team-capacity` apesar do veto de elegibilidade — `FAIL  D026-REC1` (f) e (d) ("sem card FortiGuard MDR")~~ **Corrigido (errata E12, W4b)**: em C7 o MDR é vetado por inelegibilidade em **toda** linha da chave, `hipoteses[]` nasce vazio e `REC1 (d)(f)` são garantidas pelo veto por linha — M5 sobreviveu na primeira execução da campanha (5 DETECTADO · 1 SOBREVIVENTE). O estado vive no lado produto: **C4-DL** (C4 + `detection-lifecycle: 0`) — `FortiSIEM` com hipótese por `detection-engineering` e veto por `security-analytics`; sob M5, card `[data-p53-sol-produto="FortiSIEM"]` prioritária ao lado do próprio veto — `FAIL  D026-REC1` (j) | **não** — a alínea (j) nasce verde por desenho (produto correto) e tem poder exclusivamente em M5 (precedente `D025-INV8 (c)`, aqui com carrasco); a leitura anterior ("é C7 de hoje") foi desmentida por medição | cópia (T044; remedido na W4b) | T044; W4b (`993e371`: preflight 6/6, campanha `d026` 6 DETECTADO); T063 |
| **M6** | `LEG1 (b)` | `ui_curation_v32.js`: `veredictoDeServico` sem a exceção D-6 ("base requerida ausente" vira veto também com `presence ∈ {UNSET, UNKNOWN}`) | **C7-UNSET**: `li[data-p53-veto-item="FortiGuard MDR"]` presente e card MDR ausente — `FAIL  D026-LEG1` (b): *não informado ≠ ausente* (INV-2). Nenhuma outra fixture muda — **conferido no MAP**: `FortiGuard-MDR-Service` só é ofertado por `team-capacity` (`v3_1_3.html:431`) e `monitoring-coverage` (`:458-459`); C1/C2/C10 (`endpoint` 0) não o ofertam, C7 declara a base — C7-UNSET é o único sujeito, e a alínea `vac()` se ele faltar | **não** — hoje nada veta (`LEG1 (b)` **nasce verde** sem os atributos novos; vermelho hoje só por `acao`/`condicao` ausentes) | **só cópia** (T044) | T044; T063 |

**Nota de execução — d023 tem 12 mutantes, não 11 (errata E10 da spec).** O harness `d023` declara 12 mutantes e o preflight e a campanha fecham 12/12 (`mutation_map.json`; campanha da W4). Onde esta tabela e o T020/T044 dizem `11` (e o `plan.md` §Janela vermelha, `d023 11`), lê-se `12`: a contagem registrada é a do harness, não a da prosa. A redação original permanece (R2 §5).

**Vácuos declarados para o portão**: `LEG1 (d)` (porta de saída de suficiência
— variante *terceiro em produção*) e `LEG1 (f)` (pureza) **não têm carrasco**
entre M1–M6 — alíneas de regressão, dívidas declaradas na matriz (precedente
`D025-INV8 (c)`); a constante C3 é pinada por `LEG1 (c)` sem mutante; D-9 não
tem gate. Os dois "só cópia" (M4, M6) dependem **exclusivamente** da campanha
T044 — por isso T044 é indivisível. Nenhum mutante novo além dos seis sem
pedido do proprietário (diretriz de 2026-09-13).

**Nota de execução — iteração única da Fase 6 (F6): D-3 passa a `true` (errata E15 da
spec).** O aceite de intenção do `product-owner` reprovou nomeando a objeção O-1 (com
a constante em `false`, o C3 declarado da forma natural seguia «FortiSOAR · indicação
prioritária» em tela e PDF); o orquestrador a acolheu — *decidido pelo orquestrador sob
a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal
pendente no PR*. Executada em dois commits, no padrão red → green: **red `6122bb7`**
(`test(026)`: `D026-LEG1 (c)` reancorada — `D026 CONTRATO` **2 PASS · 1 FAIL de 3**,
condição `capability-nao-informada` ≠ `plataforma-declarada-cobre`) e **green
`860735a`** (`feat(026)`: `ui_curation_v32.js` `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA =
true`, comentário reescrito, HTML regenerado — `D026 CONTRATO` **3 PASS · 0 FAIL de 3**;
números citados dos corpos dos commits). **A constante continua sem mutante próprio**
(diretriz de 2026-09-13: produto antes de instrumento; nenhum gate ou mutante novo sem
pedido): a alínea `LEG1 (c)` reancorada a pina, agora em `true`, e a matriz mantém a
dívida «`D026 · CONSTANTE C3`». Onde esta tabela e o T033/T044 dizem que a alínea pina
`false`, lê-se `true` (redação original preservada, R2 §5). O `EA-122` segue com a lacuna
do engine.

## O que cada tarefa deixa medível — comando → linha

Ao fim da tarefa, o comando imprime a linha **gravada em arquivo**; divergência
é **declarada**, nunca ajustada.

| Id | Comando (raiz da worktree, árvore limpa) | Linha esperada |
|---|---|---|
| T005 · T012 · T021 · T033 · T041 · T043 · T045 · T051 · T062 · T065 · T067 | `python .claude/verify/check_baseline.py` | `N/N pins conferem · 0 divergentes · 0 ausentes · 0 sem pin` (N cresce com refinement, spec, plan, tasks, anexos, suíte, red-026, pareamento, harness, spec-validate, relatorio-final) |
| T004 · T013 · T068 | `python .claude/verify/check_state.py` · `python .claude/verify/check_tdd.py` | `0 problema(s)`; em T013 `[OK]   026-decisao-unica-do-apoio.json: red provado e commitado (<sha12>…)`; em T068 `done` **com** `validate.conformance` |
| T010 | `node tests_026_contrato.js` | última linha `D026 CONTRATO: 0 PASS · 3 FAIL de 3`; cada `FAIL` nomeando `__CURATION.oferta` ausente ou o atributo ausente |
| T020 | `node tests_026_contrato.js` · `node tests_019_curadoria.js` · `node tests_022_escalonamento.js` · `node tests_023_leitura.js` · `node tests_025_curadoria_sessao.js` · `node tests_0NN_mutants.js --preflight` ×4 · `python .claude/verify/check_build.py` | `0 PASS · 3 FAIL de 3` (alíneas `LEG1 (f)`/`REC1 (g)` verdes, declaradas) · `14 PASS · 0 FAIL de 14` · `14 PASS · 0 FAIL` · `9 PASS · 0 FAIL` · `16 PASS · 0 FAIL` · `ok == total` em 17/13/11/23 · build idêntico |
| T030 · T031 | idem sobre HTML efêmero (`D026_HTML_OVERRIDE`, `D019_HTML_OVERRIDE`…) | T030: `3 PASS · 0 FAIL de 3` (com T020 na base); d022 preflight `D022-M10: ocorrencias 0` **declarado** |
| T033 | `node tests_026_contrato.js` · `python .claude/verify/check_build.py` · `python .claude/verify/check_lint_arch.py` · `wc -l ui_curation_v32.js ui_p52_support_v32.js` | **`3 PASS · 0 FAIL de 3`** · idêntico · `[OK]` · contagens reais contra ≈ 495 / ≈ 940 (declaradas) |
| T040 | `node tests_022_mutants.js --preflight` · campanha d022 | `13/13 ok` · `D022-M10 DETECTADO` |
| T042 | `node tests_019_curadoria.js` · diff só em comentários | `14 PASS · 0 FAIL de 14` · vazio fora de comentário |
| T044 | preflight ×5 · campanhas d019 → d022 → d023 → d025 → d026 · `bash .claude/verify/run.sh` · `bash .claude/verify/compliance-audit.sh` | `ok == total` ×5 · `17 · 13 · 11 · 23 · 6 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO` · todos os stages `[OK]` (`suites` com `d026 3/3`) · auditoria `[OK]` |
| T050 | `python .claude/verify/check_lint_arch.py` | `[OK]   <n> bridges em uso, todos registrados` |
| T052 | job `visual` do CI | `playwright` 67/37 · `P50` 27/27 · `P52` 44/44 (contagens do bloco `visual` de `expected_suites.json`) — `P8` 12 páginas |
| T064 | `node anexos/sonda-leitura.js anexos/cenarios/C<n>.json` ×11 (saída em arquivo) | matriz §3 "depois" reproduzida: C2/C4 `tela.cards = []` + vetos; C1 `h4` FortiEDR; C5 `papel.cards[].tierAttr` 9/9; C7 1 card + 2 vetos |

## Pontos de PARADA — a execução para e o orquestrador leva ao usuário

1. **Ratificação de D-1..D-9 inverte uma decisão** (T069): D-1/D-2 invertidas
   derrubam o oráculo declarado `substituto:true` de `D010-F1/F1b/F4` (35 gates
   por vácuo) — parar e escalar, nunca reancorar por conta; D-3 ligada por veto
   devolve a Camada 1 (spec §C3) — só a forma segura (condição + tier 2);
   D-7 invertida muda `h4`/`<b>` e a alínea `REC1 (a)(c)`; D-5 alargada é
   demanda própria.
2. **Queda de oráculo declarado de outra demanda** na W4/W5
   (`D010_DECLARED.substituto`, `V10`/`D010-INV7`, `D019-MED1` payload M41,
   `D015-TIT1`): parar; nunca reancorar.
3. **`P8`/`P52-PDF5/6` divergentes** (T052): layout primeiro; repin de baseline
   só com autorização nominal (§29.4 `tests_visual/`).
4. **Qualquer wave precisar de `ui_v32.js`, `engine_v32.js`, Camada 1,
   `ui_session_v32.js` ou schema**: parar (R6 §5 / D2).
5. **T042 acusar corpo de asserção diferente**: a tarefa vira `fix`, exige red —
   parar.
6. **Mutante SOBREVIVENTE** em qualquer campanha: acusa o gate; reportar, nunca
   afrouxar (R10 §1) nem contornar pela letra da regex.
7. **Âncora com `ocorrencias ≠ 1`** fora da janela declarada (W3a→W4 para
   `D022-M10`): parar.
8. **Contagem de linhas** de `ui_p52_support_v32.js` acima de ≈ 940 ou de
   `ui_curation_v32.js` acima de 600: não é parada — é registro no relatório
   final com a justificativa R9 §7 do plano; acima de 600 em `ui_curation`
   exige justificativa **nova** no plano (errata classe (c)).

## Onde o `spec-validate` da Fase 6 vai olhar — critério → tarefa → artefato → como se confere

| Critério | Tarefa(s) | Artefato | Como se confere |
|---|---|---|---|
| C1 veto visível | T020, T030 | `ui_curation_v32.js` (`reconciliar`), `ui_p52_support_v32.js` (`declararVetos`, papel) | `D026-REC1 (b)` verde; M1/M4 DETECTADO; sonda C2/C4 |
| C2 variante/identidade | T011, T020, T030 | `chaveDe`, `anexos/pareamento.md`, `cardDoProduto` | `REC1 (a)(c)(e)(g)`; M3 DETECTADO |
| C3 serviço/precedência | T020 | `veredictoDeServico`, fusão | `REC1 (d)(f)`; M5 DETECTADO |
| C4 hipótese condicionada | T020, T030 | exceção D-6, ~~`CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false`~~ `= true` desde a F6 (E15), `.p53-sol-condicao` | `LEG1 (a)(b)(c)`; M6 DETECTADO; constante lida no fonte |
| C5 gate fechado / congelada | T020, T030 | portas de saída, `temVoz`, `declararVetos` | `LEG1 (d)(e)`; M4; dívida (d) na matriz |
| C6 papel | T030 | `papelHTML` | `PAP1`; M2 DETECTADO; sonda C5 9/9 |
| C7 três superfícies | T020, T030, T031 | `ofertados()` leitor, `decisaoDe`, editor D-9 | `REC1 (h)`, `LEG1 (g)`; M3; `.p53-cur-item-var` por leitura |
| C8 pureza / isolamento | T020 | `reconcile`, `toSession` intacto | `LEG1 (f)`; `D025-*` 16/16; `D022-INV1`; diff vazio em `:199-263` |
| Reancoragem `D022-M10` | T040 | `tests_022_mutants.js` (4 toques) | preflight d022 13/13; campanha d022 |
| Trilha E13 | T042 | `tests_019_curadoria.js` | diff só comentário; 14/14 |
| Registros | T044, T050 | `expected_suites`, `mutation_map` (d026 + d022 `insumos`), `mutation-matrix`, `bridges.json` | stages `suites`, `mutation`, `lint-arch` |
| Pins | T005…T067 | `pins.json` | `check_baseline` `0 sem pin` |
| O que NÃO muda | T063 | engine, Camada 1, `ui_v32.js`, `ui_session_v32.js`, schema, `tests_025_*`, `TIER`, textos | `check_m41.py`; `git diff develop..HEAD -- <protegidos>` vazio; `D019-MED1` verde |
| Fora de escopo registrado | T060 | `BACKLOG.md` (achado novo do engine; `EA-76` resolvido) | leitura; id permanente; cadeia arquivo:linha |

### O que já nasce defasado — declarado aqui para não virar gap

- O **desenho §5.2** põe `tests_026_mutants.js` e os registros na **W1**; este
  arquivo os põe na **W4** (plan §*Quando o harness nasce*: IC-4 exige
  `ocorrencias == 1` no mesmo commit de `preflight: true`, e as âncoras são
  texto que só existe depois do green). Classe (c), registrada aqui e no
  relatório final — não é gap do `spec-validate`.
- O **desenho §5.1** estima "2 linhas" para a reancoragem do `D022-M10`; a
  conferência no harness deu **4 toques** (spec §Reancoragens). Idem.
- O **desenho §7** lista `D025-AUS1 (b)` como carrasco de `D026-M4`; a
  conferência nas fixtures da 025 mostrou que nenhuma tem veto — `M4` é julgado
  por `REC1 (b)`/`LEG1 (e)`/`PAP1` (§Estado do mundo). Idem.
- `refinement.md` nasce **depois** da spec (T001 na W0, mesma wave): a ordem
  dos portões (F0 antes de F1) é respeitada pelo orquestrador ao levar os
  artefatos ao usuário **nessa ordem**, não pela ordem em que foram escritos.
  Declarado.
- A sonda `anexos/sonda-leitura.js` lê `QS_REPO` do ambiente (`:6`): T064 a
  executa com `QS_REPO=<raiz>` e grava a saída — nunca na árvore.

## Notas de execução que o orquestrador precisa

- **Prompts de delegação** referenciam spec/plan/tasks por caminho (anti-pattern
  R5: implementação inline → drift). O core recebe também
  `anexos/contrato-motor.md` (§1–§4) e `anexos/pareamento.md`; o ui-engineer A
  recebe `anexos/anatomia-apresentacao.md` (§1.4, §4.2, §5).
- **Worktrees** (T030/T031): `git worktree add ../phase5-026a feature/026-…` e
  `../phase5-026b` sobre o mesmo commit (após R2); cada agente commita só o seu
  arquivo; T032 junta; `git worktree remove` ao fim. Se o orquestrador preferir
  serial (A → rebuild+repin → B → rebuild+repin), `[P]` cai e a série ganha um
  repin (R3a/R3b) — custo: um ciclo.
- **Commits por caminho nominal** enquanto houver delegação em voo (nunca
  `git add -A`).
- **Nada de "aprovado pelo usuário"** em commit, trilha ou registro sem a frase
  literal dele; D-1..D-9 levam a frase canônica até a ratificação no PR.
- **Mensagens de commit** terminam com a atribuição exigida pela sessão.
