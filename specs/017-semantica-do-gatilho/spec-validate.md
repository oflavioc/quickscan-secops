# Spec-validate — 017-semantica-do-gatilho

> Fase 6 · T040 · `qa-engineer` · 2026-09-08 · **somente leitura**, iteração
> **1 de 2**. Valida a [spec.md](spec.md) aprovada — com as **três erratas**
> incorporadas (`D017-M19` e `_meta.sonda_relacao`, Fase 3; `INS1(f)`, Fase 4) —
> contra a implementação **real** (source + execução, R2), no HEAD
> **`5818b1cd8a9b624403b6e7b419b0de345e5e2030`** (= `d643d8d` + repin R8b),
> worktree `phase5-014`, branch `feature/017-semantica-do-gatilho`, base
> `9d617d0` (= `origin/develop` = merge-base, medido). Porcelain vazio antes,
> durante e depois de toda medição; este arquivo foi escrito **por último**
> (o stage `mutation` recusa árvore suja, `check_mutation.py:57-61`).
> **Este registro não emite veredito de aceite**: cada linha cita o que foi
> executado ou lido. Gap de classe `spec-errada` é decisão do usuário (R4).

## Resultado

**69 de 73 exigências conformes — 94,5 %.** Quatro não conformes, em dois
arquivos, nenhuma no gate:

| Gap | Item | Classe | Arquivo | Dono da correção |
|---|---|---|---|---|
| **G1** | 51 · Errata `C1` na spec da 013 diz *"a forma deste JSON não muda … não há nova obrigação de quem escreve o preflight"* — o oposto do que a 017 §Contratos C1 fixa (forma canônica de `arquivos_mutados`, que `d014`/`d016` tiveram de migrar) | **implementação-divergente** (registro escrito diz outra coisa que a spec) | `specs/013-integridade-da-campanha/spec.md:226`, `:680-686` | `doc-writer` (T044), repin R10 |
| **G2** | 50 · Errata `IC-6` em `:232` omite a frase que a spec exige como conteúdo mínimo: *"desde a 017 `targets` pode conter insumos de prova com razão de classe na chave `insumos` — C2 estendido"* | **faltando** (a nota existe; a extensão de C2 não está nela) | `specs/013-…/spec.md:232` | `doc-writer`, mesmo commit de G1 |
| **G3** | 49 · Errata `IC-6` em `:194` e a seção (`:651-652`, `:664`) dizem que os gates cobrem *"os sete harnesses com preflight"* / *"todo harness com preflight (hoje sete)"* — são **onze** com preflight; sete têm `insumos` | **implementação-divergente** (número errado num registro) | `specs/013-…/spec.md:194`, `:651-652`, `:664` | `doc-writer`, mesmo commit de G1 |
| **G4** | 6 · D3 (i) e §O que fica pronto: *"o julgador puro devolve, por harness, a classificação de cada path em `mutado` / `harness` / `insumo(classe)`"* — o retorno real (C5, honrado) devolve `insumos_ok`, `faltante`, `fantasma`, `forma`; **não** devolve as posições `mutado`/`harness` (deriváveis dos argumentos, não devolvidas) | **spec-errada** (prosa de D3 descreve um retorno que o contrato C5 não define) | `spec.md:33`, `:237-241`; a nota de `EA-3` no BACKLOG (`:539-547`) herda a frase | usuário decide: errata de uma frase (TL) + ajuste da nota (doc-writer), **ou** aceitar "derivável" como bastante |

Nenhum gap toca `check_mutation.py`, `mutation_map.json` ou os harnesses;
nenhum veredito de gate muda; nada é enfraquecido. G1–G3 são um único commit
de correção no mesmo arquivo (a correção tem de continuar **aditiva** contra o
blob pré-017 — `aditiva_013.py 9d617d0 HEAD` ⇒ `0 removida(s)`, exit 0 —, o que
a forma `*(Errata … · demanda 017: …)*` permite: reescrever o texto **dentro**
da nota da 017 não toca redação original da 013). Divergência pesa mais que
ausência: G1 é o gap que engana — quem ler o C1 da 013 depois da errata concluirá
que basename continua válido, exatamente o defeito que a 017 fechou.

**As quatro alíneas que nascem verdes têm carrasco citável no repositório**
(a lacuna que a 015 pagou no G2): `REL1` → `M1` (`red-017.md:188`, `:213`) e
`M3` (`mutation-matrix.json`, entrada (ii)); `INS1` → `M5`/`M6`/`M7`
(`red-017.md:190-192`) e `M20` (matriz (ii)); `FORM1(a)` → `M9`
(`red-017.md:193`) e `M21` (matriz (ii)); `CORE1` → `M14` (`red-017.md:198`,
matriz (iii)). Os onze mutantes de árvore foram **re-executados por mim sobre o
HEAD** nesta validação (§Bateria), com kill isolado.

## Método

- **Exigências extraídas da `spec.md`** (skill `spec-validate`, passo 1):
  D1–D5, C1–C9 alínea por alínea (com as três erratas), §Contratos, as dez
  formas de §Comportamento, os 15 cenários, as 12 bordas, §Arquivos rastreados
  e §Não mudam, §Tipagem, §Nascimento de gate, §Riscos, §Cross-check, §Fora de
  escopo — **73 linhas**. A forma final de cada linha de saída foi **extraída do
  executável** (lição `E016-5`), nunca redigida a partir da spec.
- **Executado nesta validação** (2026-09-08, HEAD `5818b1c`; `MUTATION_DEFER_MISSING=1`
  como no job `verify`, `verify.yml:42`; `NODE_PATH` da worktree nos clones):
  - `bash .claude/verify/run.sh` **completo, na worktree** ⇒ 17 × `[PASS]`
    (`env-doctor` · `baseline` · `eol-text` · `boundary` · `marker-lint` ·
    `icons-check` · `build` · `lint-arch` · `regra-morta` · `state` · `tdd` ·
    `fecho` · `mutation` · `m41` · `suites` · `suites-heavy` · `evidence-bridge`)
    · **`verify: 17 PASS · 0 FAIL`** · exit 0 · porcelain vazio ao fim.
  - `bash .claude/verify/compliance-audit.sh` ⇒ **`compliance: 17 PASS · 0 FAIL · 0 WARN`**, exit 0.
  - `check_baseline.py` ⇒ `baseline: 464/464 pins conferem · 0 divergentes · 0 ausentes · 0 sem pin`
    (462 + `tasks.md` + `red-017.md`; este arquivo entra no R9). `check_tdd.py` ⇒
    `[OK] 017-semantica-do-gatilho.json: red provado e commitado (adb883f9bc27…)` ·
    `waivers TDD: nenhum ativo` · `matriz gate↔mutante: 163 pares completos` · três
    linhas `[DÍVIDA] D017-…` · `tdd: 12 demanda(s) · 0 waiver(s) · 0 problema(s)`.
    `check_state.py` ⇒ `state: 12 demanda(s) · 0 problema(s)`.
  - **Stage `mutation` em clone efêmero do HEAD** (`git clone --no-hardlinks -b
    feature/017-… <git-common-dir>`, `origin/develop` pinado em `9d617d0`) — o
    **estado B com as campanhas**: 89 linhas, exit 0 (§Estado B).
  - **Stage `mutation` em clone efêmero de `f790a20`** (`origin/develop` em
    `9d617d0`): 65 linhas, exit 0, `[OK] IC-6 … (7 caminhos)`, `0 campanha(s)` —
    a **linha de base de C8**. `git diff --stat abdddd0 f790a20` nos quatro
    arquivos que o bloco lê = **vazio** (defasagem (e) do `tasks.md`: `f790a20 ≡
    abdddd0`, confirmado).
  - **Regressão C8 por máquina** (`difflib` sobre as linhas `IC-*`, `[DÍVIDA]
    core` de T8 e os fechos `integridade`/`exceção`/`guarda`): base **sem** a
    única linha `IC-6` × HEAD = **50 linhas de cada lado, diff VAZIO**; `IC-6`
    no texto do HEAD = **0**; `IC-5` = `os 19 mutantes da p51 têm um par cada
    na matriz [oráculo dos ids: preflight (C1)]` e `registro de 19 par(es) p51
    resolve no disco` nos dois lados.
  - **Bateria de mutantes de árvore sobre o HEAD** (§Bateria): controle + 11
    mutantes, um commit efêmero por mutante, `origin/develop` pinado no próprio
    commit (nenhuma campanha; ~1,2 s por run), `reset --hard` entre runs; clone
    restaurado a `5818b1c`, porcelain vazio, `origin/develop` de volta a `9d617d0`.
  - **Janela vermelha re-medida nos quatro commits** (`adb883f`, `e26ee90`,
    `9306d40`, `4f2dc6c`) em clone efêmero (§Janela).
  - `node tests_014_mutants.js --preflight` e `node tests_016_mutants.js
    --preflight` no clone do HEAD, **neste Windows** (§C4 c).
  - `git diff -U0 f790a20 HEAD -- .claude/verify/check_mutation.py | grep '^@@'`
    ⇒ 10 hunks; `git diff -U0 126dc61~1 126dc61 …` ⇒ 1 hunk; `so_docstring.py
    126dc61~1 126dc61` ⇒ `IDÊNTICA (20 → 20 docstrings)`, exit 0; controle
    `36073dd × adb883f` ⇒ `DIVERGENTE (14 → 20)`, exit 1; `ast.get_docstring`
    de `ex_ids_do_harness` ⇒ `False True`. `aditiva_013.py 4f605c1~1 4f605c1` e
    `9d617d0 HEAD` ⇒ `4 linha(s) alterada(s) por UMA inserção [116, 194, 226,
    232] · 74 linha(s) nova(s) · 0 removida(s) [] · 0 inserção(ões) fora da
    forma`, exit 0. Os dois scripts foram **extraídos do `tasks.md`** e conferidos
    por `git hash-object` contra os hashes lá declarados (`9cc9857f…`,
    `c9267d27…`): idênticos.
  - Leituras por chave (nunca por linha — defasagens (b)/(c)): `mutation_map.json`
    (python: `insumos` por harness, 44 `fixture` × `git ls-files
    .claude/verify/fixtures_016/` = 46 − `fecho/F5.json` − `protecao/sem_fecho.json`,
    `_trilha` **anexada** em `d009`/`d016` e intacta nos demais, `_meta.descricao`
    **anexada**, `targets`/`preflight`/`receipts`/`requires`/`cmd` **iguais a
    `9d617d0` nos 12**); `pins.json → files` (14 chaves conferidas);
    `mutation-matrix.json` (39 dívidas · 163 pares; as três entradas `D017-*`
    lidas por extenso).
  - **CI**: PR **#48** (`develop ← feature/017-semantica-do-gatilho`, `OPEN`,
    `MERGEABLE`, head `5818b1c`); **único run da branch**: `34066877538`
    (`pull_request`, head `5818b1c`) — `verify` **success** (9m11s), `visual`
    **success** (9m19s), `fecho` **failure** (8 s). Logs dos três jobs lidos
    (352 + 871 + 191 linhas).
- **Não executado, com motivo**: `M10`–`M16`, `M18` (mutantes de instrumento),
  `M14`, `M17`+`M2` e o **estado NOTA + `M19`** — provados no red (`red-017.md`
  §6/§8/§9) e **re-medidos** pelo `qa-engineer` da W3 sobre `3d8fa70`
  (`mutation-matrix.json`, entradas (i) e (iii), com as linhas literais); entre
  `3d8fa70` e o HEAD nenhuma linha executável de `check_mutation.py` mudou
  (`so_docstring.py` — PP-12 é docstring) e `mutation_map.json` é byte-idêntico
  (`git diff --stat 3d8fa70 HEAD -- .claude/verify/mutation_map.json` vazio),
  logo a re-medição vale para o HEAD; não repeti a família de instrumento nesta
  iteração porque o carrasco permanente (a sonda) rodou verde em todos os runs
  acima. Suítes com Chromium: canônicas no job `visual` (KI-3), verdes no run
  citado — não reproduzidas localmente.

## Estado B — o stage no HEAD, com as campanhas (clone efêmero, `origin/develop = 9d617d0`)

Linhas do bloco 017 e do fecho, **literais** (as mesmas, byte a byte, que o job
`visual` do run `34066877538` imprimiu, linhas 790–836 do log):

```text
---- semântica do gatilho (017) ----
[OK]   D017-SONDA1: mut_relacao discrimina nos 15 cenários da sonda (pinado: _meta.sonda_relacao.total = 15)
[DÍVIDA] core: relação gatilho × conjunto mutado NÃO MEDIDA — sem preflight (credor: EA-44)
[OK]   D017: d009 · gatilho ⊇ conjunto mutado ∪ {harness} (7) · insumos: oraculo 1, fixture 1
[OK]   D017: d010 · gatilho ⊇ conjunto mutado ∪ {harness} (3) · insumos: oraculo 1, fixture 1
[OK]   D017: d011 · gatilho ⊇ conjunto mutado ∪ {harness} (4) · insumos: oraculo 1
[OK]   D017: d014 · gatilho ⊇ conjunto mutado ∪ {harness} (6) · insumos: populacao 4
[OK]   D017: d014vis · gatilho ⊇ conjunto mutado ∪ {harness} (2)
[OK]   D017: d015 · gatilho ⊇ conjunto mutado ∪ {harness} (2) · insumos: oraculo 1, fixture 1
[OK]   D017: d016 · gatilho ⊇ conjunto mutado ∪ {harness} (11) · insumos: fixture 44, declaracao 1
[OK]   D017: ea41 · gatilho ⊇ conjunto mutado ∪ {harness} (2) · insumos: oraculo 1, declaracao 1
[OK]   D017: p50 · gatilho ⊇ conjunto mutado ∪ {harness} (5)
[OK]   D017: p51 · gatilho ⊇ conjunto mutado ∪ {harness} (7)
[OK]   D017: p52 · gatilho ⊇ conjunto mutado ∪ {harness} (9)
---- semântica do gatilho: 0 problema(s) nomeado(s) ----
[RUN]  d014: node tests_014_mutants.js
       restauração: source byte a byte OK · porcelain dos alvos limpo
       não-KILL: nenhum — os 9 mutante(s) lidos estão DETECTADO
[RUN]  d016: node tests_016_mutants.js
       restauração: arquivos mutados byte a byte OK · criados removidos OK · porcelain dos alvos limpo
       D016 MUTATION [tests_016_mutants.js]: 35/35 mutantes detectados pelo gate e motivo esperados · controles: 3 ok · 0 falho(s)
       não-KILL: nenhum — os 35 mutante(s) lidos estão DETECTADO
mutation: 2 campanha(s) executada(s) · 0 problema(s)
```

`---- integridade: 0 problema(s) nomeado(s) ----` acima do bloco; a `[DÍVIDA]
core: sem preflight declarado — âncora podre só aparece na execução da campanha`
de T8 permanece no bloco da 013; nenhuma linha `[NOTA] D017`, nenhum `[DEFER]`;
exit 0. Nenhuma campanha além de `d014`/`d016` foi exigida — Medição C da spec
confirmada por execução.

## Tabela de conformidade (73 exigências)

Legenda: ✓ conforme · ✓° conforme com observação (nada falso; registrado) · ✗ não
conforme (classe na coluna). "HEAD" = medido nesta validação sobre `5818b1c`;
"red" = `red-017.md` (commit `adb883f`); "matriz" = `mutation-matrix.json →
dividas_declaradas` (`1aaccbe`, re-medição sobre `3d8fa70`).

### Decisões técnicas (D1–D5)

| # | Exigência (fonte) | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 1 | D1 · emissores `d014`/`d016` migram para path relativo à raiz, POSIX (`spec.md:31`) | `git diff 9d617d0 HEAD -- tests_014_mutants.js tests_016_mutants.js`; `--preflight` dos dois no clone do HEAD (Windows) | `tests_014_mutants.js:305` e `tests_016_mutants.js:555`: `path.relative(HERE, …).split(path.sep).join("/")`; `d014` emite 5 paths (`.claude/verify/regra_morta.js`, `.claude/verify/regra_morta_seletor.js`, `build_v32_html.py`, `tests_014_regra_morta.js`, `ui_p50_v32.css`), `d016` emite 10 com diretório (inclui `…/999-sintetica-d016.json` criado, `…/F5.json` e `…/sem_fecho.json` removidos); **zero** barra invertida nos 15 | ✓ |
| 2 | D1 · os oito harnesses de raiz, `ea41` e `tests_core_mutants.js` **não são tocados** (`spec.md:31`, `:326`) | `git diff --stat 9d617d0..HEAD -- <os dez>` | vazio; `git diff --stat 9d617d0..HEAD` = 15 arquivos, nenhum deles | ✓ |
| 3 | D1 · o consumidor **não normaliza**: rejeita forma fora do contrato (`spec.md:31`; plano PP-10) | grep de `ic_path(` no fonte; leitura de `d017_forma_ok` | todas as 25 chamadas de `ic_path(`/`ic_fail(` estão em linhas < 484 (o bloco 017 vai de `:484` a `:813`); `d017_forma_ok` (`:501-509`) devolve `False` para não-string, vazia, `\`, `./`, `/` inicial e segmento `..`; `d017_base` parte só por `/` | ✓ |
| 4 | D2 · `insumos` chave irmã de `targets`, objeto classe → [paths], quatro classes fechadas, ausente ≡ `{}` (`spec.md:32`) | fonte `:487` + mapa por chave | `D017_CLASSES = ("oraculo", "fixture", "populacao", "declaracao")`; `ins = {} if insumos is None` (`:564`); os quatro harnesses de identidade sem chave e verdes sem sufixo | ✓ |
| 5 | D3 · a população do `EA-3` **não entra**; nenhuma das três uniões é calculada (`spec.md:33`, `:235-241`) | leitura do bloco `:484-813` | nenhum `git ls-files`, nenhuma união entre harnesses; o bloco só julga harness a harness | ✓ |
| 6 | D3 (i) · *"o julgador puro devolve, por harness, a classificação de cada path em `mutado` / `harness` / `insumo(classe)`"* (`spec.md:33`); *"O retorno de `mut_relacao` classifica cada path do gatilho em exatamente uma de três posições"* (`:237-238`) | leitura de `mut_relacao` `:518-627` × contrato C5 (`:306-311`) | o retorno é `{estado, faltante, fantasma, insumos_ok, problemas, forma, credor?}` — exatamente C5; a posição `insumo(classe)` sai em `insumos_ok`; as posições `mutado` e `harness` **não são devolvidas** (são deriváveis de `arquivos_mutados` e `fontes`, que são argumentos). A nota de `EA-3` no BACKLOG (`:539-547`) repete a frase | **✗ spec-errada** (G4) |
| 7 | D4 · `IC-6` **substituído**: bloco nominal sai, `[OK]/[FAIL] IC-6` deixa de existir, id reservado (`spec.md:34`) | estado B; `grep -c 'IC-6'` no fonte e nas saídas | 0 linhas `IC-6` em qualquer saída do HEAD (estados A, C, C′, B e os 11 mutantes); no fonte, 7 ocorrências, **todas em comentário** (`:65`, `:379`, `:381`, `:456`, `:458`, `:961`, `:1453`), `IC-5/IC-6` = 0 | ✓ |
| 8 | D5 · sonda pinada em dado + mutantes de árvore one-shot com credor `EA-42` + `core` como dívida `EA-44` (`spec.md:35`) | `_meta.sonda_relacao` no mapa; matriz; estado B | `_meta.sonda_relacao = {total: 15, descricao: …}` (lido da raiz do JSON, `:742-746`); três entradas `D017-*` em `dividas_declaradas` citando `EA-42`; `[DÍVIDA] core … (credor: EA-44)` impressa | ✓ |

### C1 · `D017-REL1` — conjunto mutado contido no gatilho

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 9 | Nasce verde 11/11 (nenhum faltante real) — **dito, não maquiado** (`spec.md:136`, `:165`) | estado B; janela | 11 × `[OK] D017` no HEAD; no estado A os únicos faltantes eram os 12 **falsos por forma** (`d014` 2, `d016` 10), com diagnóstico | ✓ |
| 10 | `D017-M1` (= `M-IC8`): `USER_GUIDE.md` fora de `p51.targets` ⇒ FAIL nomeando `p51` e o path | red `:188`, `:213`; **HEAD** (commit efêmero `72aa28c`) | `[FAIL] D017-REL1: p51 · conjunto mutado fora do gatilho: USER_GUIDE.md` · 0 linhas `[OK] D017: p51` · fecho `1` · exit 1 | ✓ |
| 11 | `D017-M3`: `.claude/verify/regra_morta.js` fora de `d014.targets` ⇒ FAIL com o path **aninhado**, sem diagnóstico (pós-D1) | matriz (ii); **HEAD** (`2b40708`) | `[FAIL] D017-REL1: d014 · conjunto mutado fora do gatilho: .claude/verify/regra_morta.js` · sem ` [forma do path?` · 0 `[OK] D017: d014` · fecho `1` | ✓ |
| 12 | Ramo `[NOTA]` — preflight fracassado é nomeado **uma** vez, nunca `[OK]` nem FAIL duplicado; carrasco `D017-M19` sob o estado NOTA (Errata Fase 3, `spec.md:501-566`) | fonte `:790-793`; red §8; matriz (i); `grep -c '^\[NOTA\] D017'` nos cinco estados medidos | forma no executável: `[NOTA] D017: <h> · não medida — preflight fracassou e IC-4 já o nomeou` (a de §Comportamento, defasagem (d)); **0** ocorrências em A/C/C′/B/HEAD (11/11 preflights válidos — vácuo declarado); red §8: estado NOTA ⇒ `[NOTA]` = 1, `[OK] D017: p50` = 0, `[FAIL] D017-*: p50` = 0, fecho igual ao de A; sob `M19` ⇒ `[NOTA]` = 0 e `[FAIL] D017-REL2: p50 · alvo fantasma (sem razão de classe): ui_p50_results_v32.js, ui_p50_shell_v32.js, ui_p50_suff_v32.js, ui_p50_v32.css`, fecho +1 | ✓ |
| 13 | Forma da linha extraída do executável | fonte `:614`; mutantes | `[FAIL] D017-REL1: <h> · conjunto mutado fora do gatilho: <paths>[ diagnóstico]` — paths ordenados, separados por `, ` | ✓ |

### C2 · `D017-REL2` — excedente sem razão é alvo fantasma

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 14 | Red natural: 7 de 11 vermelhos, 70 fantasmas literais (`spec.md:137`, `:166`) | **janela re-medida** em `adb883f` (clone, `origin/develop` = o próprio commit) | 7 linhas `[FAIL] D017-REL2` (`d009`, `d010`, `d011`, `d014`, `d015`, `d016`, `ea41`) com **70** paths; + 2 `REL1` com 12; fecho `9`; `[OK]` só nos quatro de identidade; `---- integridade: 0 ----`; exit 1 | ✓ |
| 15 | `D017-M2` (= `M-IC9`): `ui_session_v32.js` de volta a `p51.targets` ⇒ FAIL `alvo fantasma` | red `:189`, `:214`; **HEAD** (`26a29f4`) | `[FAIL] D017-REL2: p51 · alvo fantasma (sem razão de classe): ui_session_v32.js` · fecho `1` · exit 1 | ✓ |
| 16 | `D017-M4`: classe `fixture` retirada de `d010.insumos` ⇒ `fixtures_010_vao.js` fantasma (carrasco da migração C7) | matriz (ii); **HEAD** (`c5ece24`) | `[FAIL] D017-REL2: d010 · alvo fantasma (sem razão de classe): fixtures_010_vao.js` · fecho `1` | ✓ |
| 17 | Excedente **com** razão passa e é nomeado por classe e contagem na linha `[OK]` | estado B | sete sufixos `· insumos: <classe> <k>[, …]`, na ordem do vocabulário (`d016`: `fixture 44, declaracao 1`; `ea41`: `oraculo 1, declaracao 1`) | ✓ |

### C3 · `D017-INS1` — razão de classe bem formada (a)–(f)

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 18 | (a) classe ∈ vocabulário — `D017-M5` + sonda v | red `:190`; **HEAD** (`69102b7`) | `[FAIL] D017-INS1: d010 · classe fora do vocabulário: endurece_trigger (tests_010_vao.js)`; **nenhuma** REL2 da `d010` (o path inválido fica fora do cômputo de C2 — um FAIL por causa); fecho `1` | ✓ |
| 19 | (b) lista não vazia — sonda xii (`classe sem membros`) | fonte `:709-711`; sonda 15/15 em todos os runs; `M12` (red `:196`) prova que a sonda tem dentes | cenário xii presente com `problemas=[INS1 "classe sem membros"]` | ✓ |
| 20 | (c) todo path de `insumos` ∈ `targets` — `D017-M7` + sonda vii | red `:192`; **HEAD** (`9b11674`) | `[FAIL] D017-INS1: p51 · razão sem gatilho: oraculo (tests_p50_core.js)` · 0 `[OK] D017: p51` · fecho `1` | ✓ |
| 21 | (d) nenhum path de `insumos` ∈ mutados ∪ fontes — `D017-M6` + sonda vi | red `:191`; **HEAD** (`35defe7`) | `[FAIL] D017-INS1: d015 · insumo que é conjunto mutado: populacao (ui_v32.js)` · fecho `1` | ✓ |
| 22 | (e) um path em uma só classe — sonda xiii; precedência (e) > (d) > (c) | fonte `:574-582`, `:709-713` | cenário xiii `path em duas classes`; `invalidos` alimentado antes das causas (c)/(d) — a mais forte vence, cada path nomeado uma vez (red §4 item 8) | ✓ |
| 23 | (f) `insumos` presente e não-objeto ⇒ FAIL com o **tipo**, tratado como `{}`; excedentes reaparecem em REL2; `null` ≡ ausente (Errata Fase 4, `spec.md:737-738`) | fonte `:564-570`; **HEAD** `D017-M20` (`28f228f`); errata mediu `null` | `[FAIL] D017-INS1: d010 · insumos malformado — não é objeto classe → [paths]: list` **e** `[FAIL] D017-REL2: d010 · alvo fantasma (sem razão de classe): fixtures_010_vao.js, tests_010_vao.js` · fecho `2` | ✓ |
| 24 | Nasce verde **por vácuo** e depois de C7 todos os `insumos` são válidos — declarado; carrasco é exclusivamente sonda + mutante (`spec.md:167`) | estado B (0 INS1 nos 11); mapa (python: nenhum path de `insumos` fora de `targets`, nenhum fora da forma) | verde por mérito no HEAD; vácuo declarado no red `:134`; seis causas com carrasco executado (18–23) | ✓ |

### C4 · `D017-FORM1` — forma canônica antes de comparar

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 25 | (a) `\`, `./`, `/`, `..`, não-string, vazio ⇒ FAIL nomeando `<h>/<conjunto>` e o path, fora da comparação — `D017-M9`, `D017-M21`, sonda xiv | red `:193`; **HEAD** `M9` (`be63e9e`) e `M21` (`9f5f6cf`) | `M9`: `[FAIL] D017-FORM1: d014/arquivos_mutados · path fora da forma canônica: .claude\verify\regra_morta.js` e idem `…_seletor.js`, **0** `REL1` da `d014` (os dois paths saem da comparação) e `REL2` da `d014` **sem** diagnóstico — fecho `3`. `M21`: `[FAIL] D017-FORM1: d010/targets · path fora da forma canônica: 7` e `[FAIL] D017-FORM1: d010/targets · path fora da forma canônica: ` (vazio — nada após `: `, a candidata de forma de T042), 0 `[OK] D017: d010`, 0 `REL2` da `d010` — fecho `2` | ✓ |
| 26 | (b) faltante e fantasma com mesmo basename ⇒ diagnóstico ` [forma do path? mesmo basename nos dois lados: <nome> — C1 exige path relativo à raiz]` nas duas linhas — `D017-M8` = o estado de ontem | janela A/C/C′; **HEAD** `M8` (`3be0e08`) | diagnóstico presente em **4/4** linhas de `d014`/`d016` nos estados A e C e em **2/2** em C′; sob `M8` no HEAD: `[FAIL] D017-REL1: d014 · conjunto mutado fora do gatilho: regra_morta.js, regra_morta_seletor.js [forma do path? mesmo basename nos dois lados: regra_morta.js, regra_morta_seletor.js — C1 exige path relativo à raiz]` + a REL2 com os dois paths aninhados e o mesmo diagnóstico — fecho `2` | ✓ |
| 27 | (c) `--preflight` da `d014` contém os dois `.claude/verify/regra_morta*.js`; o da `d016` os 10 com diretório; REL1 = ∅ nos dois | preflights no clone do HEAD (Windows); estado B | item 1; `[OK] D017: d014 … (6) · insumos: populacao 4` e `[OK] D017: d016 … (11) · insumos: fixture 44, declaracao 1` | ✓ |

### C5 · `D017-CORE1` — `core` sem preflight é dívida com credor

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 28 | `[DÍVIDA] core: relação gatilho × conjunto mutado NÃO MEDIDA — sem preflight (credor: EA-44)` **no bloco 017**; nenhuma `[OK] D017: core` | estado B; fonte `:797-800` | linha presente em todos os runs; a dívida passa pelo julgador (`estado: nao_medido`, `credor: EA-44`) | ✓ |
| 29 | A `[DÍVIDA] core: sem preflight declarado …` de T8 permanece **byte-idêntica** no bloco da 013 | diff C8 | idêntica entre `f790a20` e HEAD (uma das 50 linhas comparadas) | ✓ |
| 30 | Lista fechada por construção: harness novo sem `preflight: true` já reprova em IC-4 | fonte `:285-289` | `if not h.get("preflight"): return None, (…)` ⇒ `ic_fail("IC-4", …)` em `:342` | ✓ |
| 31 | `D017-M14` (julgador devolve `ok` para `None`) ⇒ sonda ix FAIL **e** `[OK] D017: core` falso na árvore | red `:198`; matriz (iii) (re-medido sobre `3d8fa70`: fecho 2) | `[FAIL] D017-SONDA1: cenário ix · … esperado estado = 'nao_medido' · obtido 'ok'` + `[OK]   D017: core · gatilho ⊇ conjunto mutado ∪ {harness} (1)` + dívida ausente — não re-executado por mim (declarado em §Método) | ✓ |

### C6 · `D017-SONDA1` — o julgador não mente

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 32 | `mut_relacao` **pura** (sem I/O), retorno do contrato C5 | leitura `:518-627` | nenhum `open`/`subprocess`/`os.path` dentro da função; retorno = C5 | ✓ |
| 33 | 15 cenários i–xv; `len(cenários)` × `_meta.sonda_relacao.total`; `total ≠ pinado` ⇒ FAIL nomeando as duas contagens | `grep -c 'd017_cen("'` = **15**; pin = **15**; fonte `:746-753`; `M18` (red `:201`) | `[OK]   D017-SONDA1: mut_relacao discrimina nos 15 cenários da sonda (pinado: _meta.sonda_relacao.total = 15)` em todos os runs; sob `M18`: `14 cenário(s) na sonda ≠ 15 pinado(s) …` | ✓ |
| 34 | `M10`–`M16`, `M18` morrem na sonda | red §6 (`:194-201`); matriz (iii) com as linhas re-medidas | oito kills com o cenário nomeado (iv/xv, iii, v, xi, ix, viii, vi, total) — não re-executados por mim (declarado) | ✓ |
| 35 | `M17` (fiação) **sobrevive** à sonda por desenho e morre pelo par `M2`; declarado em `dividas_declaradas` | red §9; matriz (i) | `M17` sozinho: sonda 15/15, fecho 0, exit 0; `M17+M2`: 0 linhas com `ui_session_v32.js`; entrada (i) da matriz diz exatamente isso e que no estado B "a árvore não vê M17 sozinho (0 → 0)" | ✓ |

### C7 · as 58 razões migram para `insumos`

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 36 | Sete harnesses com `insumos` **exatamente** como a tabela de §Contratos (`spec.md:295-304`) | python sobre o mapa | `d010` `{oraculo: [tests_010_vao.js], fixture: [fixtures_010_vao.js]}` · `d009` `{oraculo: [tests_009_leitura.js], fixture: [fixtures_009_leitura.js]}` · `d011` `{oraculo: [tests_011_prioridade.js]}` · `d015` `{oraculo: [tests_015_apoio.js], fixture: [fixtures_015_apoio.js]}` · `d014` `{populacao: [ui_v32.css, ui_ux_v32.css, ui_p52_workspace_v32.css, ui_d011_prioridade_v32.css]}` · `d016` `{fixture: 44, declaracao: [.claude/verify/branch_protection.json]}` · `ea41` `{oraculo: [.claude/verify/check_eol_text.py], declaracao: [.gitattributes]}` | ✓ |
| 37 | `d016.fixture` = `git ls-files .claude/verify/fixtures_016/` − `F5.json` − `sem_fecho.json` = 44, **derivada** | `git ls-files` = 46; conjunto − lista = `{fecho/F5.json, protecao/sem_fecho.json}`; lista − conjunto = ∅ | 44/44 | ✓ |
| 38 | `p50`/`p51`/`p52`/`d014vis`/`core` sem chave | python | `harnesses sem insumos: [core, d014vis, p50, p51, p52]` | ✓ |
| 39 | `_trilha`s **não reescritas**; `d009` e `d016` ganham nota datada de uma linha, **anexada** | python: `nova.startswith(antiga)` | `d009`: `+ [2026-09-06 · demanda 017 (C7): insumos = … o precedente p52 citado acima é falsa analogia — …]`; `d016`: `+ [2026-09-06 · demanda 017 (C7): insumos = fixture (44 paths … menos fecho/F5.json e protecao/sem_fecho.json …), declaracao (…); os enderecos :41/:246 da spec 017 sao anteriores a estas insercoes — conferir por chave …]`; as outras dez `_trilha`s byte-idênticas | ✓ |
| 40 | Uma frase sobre `insumos` em `_meta.descricao`; chave `targets` não renomeada | python: `nova.startswith(antiga)` | anexado: `Campo insumos (demanda 017, D2/C7): objeto classe → [paths], vocabulário fechado (…) … ausência da chave equivale a {} (identidade) …`; `targets` em todos os 12 | ✓ |
| 41 | `REL2` e `INS1` verdes nos 11; `[OK]` com sufixo em 7 e sem sufixo em 4 | estado B | as 11 linhas literais em §Estado B | ✓ |

### C8 · `IC-6` substituído sem enfraquecimento

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 42 | Bloco `:395-412` sai; `IC-5` intacto (19/19, 19 par(es)) | hunks; estado B; diff C8 | hunk `@@ -395,19 +396,0 @@`; `_arqs51` removida, `_ids51`/`_oraculo` preservados (`:390-394`); `IC-5` idêntico nos dois lados | ✓ |
| 43 | Cabeçalho `:64-67` e comentário `:376-379` atualizados; id `IC-6` reservado | fonte `:65-66`, `:379-382`, `:456-458`; T037 | as sete citações restantes são retrospectivas (dizem que saiu / que o id está reservado / nomeiam a seção pela extensão de quando IC-9/IC-10 nasceram); a única **descritiva** (docstring de `ex_ids_do_harness`, *"escada de IC-5/IC-6"*) foi corrigida em `126dc61` (PP-12) e hoje diz *"Mesma escada do IC-5 … O bloco 017 … não sobe esta escada"* | ✓ |
| 44 | Regressão: `IC-1`, `IC-2`, `IC-4`, `IC-5`, `IC-9`, `IC-10` com os mesmos vereditos de `abdddd0`, 0 problemas de integridade, nenhuma linha `IC-6` | **diff por máquina** `f790a20` (≡ `abdddd0`) × HEAD | 50 × 50 linhas, **diff vazio**; `---- integridade: 0 ----`, `---- exceção nominal: 0 ----`, `---- guarda de leitura parcial: 0 ----` nos dois | ✓ |
| 45 | (iv) `git diff` restrito a PP-1…PP-8 (+ PP-12 comentário-only) | `git diff -U0 f790a20 HEAD -- check_mutation.py \| grep '^@@'` | 10 hunks: `-64` (PP-1) · `-175` (PP-2) · `-376,4` (PP-3) · `-382,2` (PP-4) · `-388`/`-392` (PP-5) · `-395,19` (PP-6) · `-464,0 +448,367` (PP-7) · `-880,3 +1230,5` (PP-12) · `-1328` (PP-8); PP-12: `so_docstring.py` `IDÊNTICA (20 → 20)`, hunk único `@@ -1230,3 +1230,5 @@ def ex_ids_do_harness(nome):`, `ast` ⇒ `False True` | ✓ |
| 46 | `M-IC8`/`M-IC9` re-executados contra o gate novo e mortos (`D017-M1`/`M2`), com saída | red §7; **HEAD** (itens 10 e 15) | mortos no red (`adb883f`) e no HEAD (`5818b1c`) | ✓ |
| 47 | `:1332-1421` (laço de trigger, `DEFER`/`FAIL` de ambiente, `receipts`, exit) byte-idênticos; `fails = IC_FAILS + D017_FAILS + EX_FAILS + GP_FAILS` | hunks (só `-1328` após o bloco); fonte `:1680`; estado B (2 campanhas pelo trigger) | único diff após o bloco é a linha `fails` (PP-8) | ✓ |

### C9 · erratas aditivas na spec da 013 e registros

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 48 | Errata `IC-6` em `:116` — nota inline `(Errata IC-6 · demanda 017 …)`; conteúdo mínimo: superação da identidade por `D017-REL1/REL2/INS1/FORM1`, `specs/017-…/spec.md` §Critérios, todo harness com preflight, saiu em `<commit>`, `M-IC8`/`M-IC9` re-mortos como `M1`/`M2`, id reservado (`spec.md:358`) | leitura de `specs/013-…/spec.md:116` | nota presente: substituição pelo bloco, "genérico a todo harness com preflight via `insumos`", id reservado, `M-IC8`/`M-IC9` → `D017-M1`/`M2` mortos no red `adb883f`, "ver §Erratas da demanda 017". **Faltam** os nomes `INS1`/`FORM1` e o caminho da spec 017 (o arquivo inteiro cita `specs/017-semantica-do-gatilho/` só em `:657` `red-017.md` e `:691` `tasks.md`; a spec é referida como "`spec.md` da 017, commit `36073dd`" em `:627`). Nada falso | ✓° (completar no mesmo commit de G1) |
| 49 | Errata `IC-6` em `:194` — "a checagem genérica nasceu na 017, não no `EA-3`, que fica com população e órfão" (`spec.md:359`) | leitura `:194`, `:651-652`, `:664` | substância presente (EA-3 fica com população/órfão); **mas** a nota diz *"`D017-REL1`/`D017-REL2` cobrem os sete harnesses com preflight declarados em `mutation_map.json → insumos`"* e a seção diz *"a **todo** harness com preflight declarado no mapa (hoje sete, via … `insumos`)"* e *"a cobertura cresceu de um harness para sete"*. Medido: o bloco corre sobre **onze** harnesses com preflight (item 41); sete têm `insumos` | **✗ implementação-divergente** (G3) |
| 50 | Errata `IC-6` em `:231-232` — "permanecem como T11 os deixou; **desde a 017 `targets` pode conter insumos de prova com razão de classe na chave `insumos`** — C2 estendido em `specs/017-…/spec.md` §Contratos" (`spec.md:360`) | leitura `:232` | nota presente: "os `targets` continuam reconciliados por T11 para fins de C2; quem confere `targets` contra o preflight … passou a ser `D017-REL1`/`D017-REL2`". **Ausente** a frase que estende C2 (insumos com razão de classe) e a remissão ao §Contratos da 017 — é a frase que avisa o leitor do C2 da 013 de que o contrato mudou | **✗ faltando** (G2) |
| 51 | Errata `C1` em `:205-226` — "forma canônica de `arquivos_mutados` = path relativo à raiz, POSIX, incluindo criados/removidos; o exemplo permanece válido porque todos estão na raiz; `d014`/`d016` migrados em `<commits>`; `mutantes[].arquivo` não é alcançado" (`spec.md:361`; §Contratos C1 `:248-258`) | leitura `:226` e `:675-686` | a nota diz *"`arquivos_mutados` … passou a alimentar também o bloco … **a forma deste JSON não muda**"*; a seção: *"o formato do JSON do preflight (C1) não muda — mesmo objeto, mesmos campos … **Não há novo campo, não há nova obrigação de quem escreve o preflight**"*. A errata C1 da 017 é **exatamente** uma obrigação nova de quem escreve o preflight — a forma dos elementos de `arquivos_mutados` —, cumprida por `9306d40`/`4f2dc6c` (item 1) e vigiada por `FORM1`/`REL1`. Os commits da migração aparecem só sob a Errata `IC-6` (`:669-672`). Um leitor do C1 da 013 concluiria que basename segue válido | **✗ implementação-divergente** (G1) |
| 52 | Seção única `## Erratas da demanda 017 (<data>)`, cabeçalho dizendo quem decidiu (usuário, portão da Fase 1), o que não é reaberto (E1–E4, G1–G3, T1–T12, IC-1…IC-5, IC-7…IC-10), nenhuma redação apagada (`spec.md:346-354`) | `grep -c '^## Erratas da demanda 017'` = 1; leitura `:624-696` | `:624` `## Erratas da demanda 017 (2026-09-06)`; `:626-628` "por decisão **do usuário** … nunca decisão do `tech-lead`"; `:632-635` lista o que não se reabre; `:637-639` nenhuma redação apagada | ✓ |
| 53 | Aditividade mecânica (prova de T032, `tasks.md` §Prova mecânica) | `aditiva_013.py 4f605c1~1 4f605c1` e `9d617d0 HEAD` | `4 linha(s) alterada(s) por UMA inserção [116, 194, 226, 232] · 74 linha(s) nova(s) · 0 removida(s) [] · 0 inserção(ões) fora da forma`, exit 0 (duas vezes); `grep -c 'Errata IC-6 · demanda 017'` = 3, `'Errata C1 · demanda 017'` = 1 | ✓ |
| 54 | BACKLOG: nota datada em `EA-3` com o que a 017 deixou pronto (três itens de D3) | `BACKLOG.md:393` (status `aberto`), `:537-547` | `### Nota datada (demanda 017, 2026-09-06)` com (i) classificação, (ii) forma D1, (iii) `insumos`; "não fecha este achado"; remete a §"O que fica pronto para o `EA-3` (D3)". Herda a frase de D3 (i) — item 6 | ✓ |
| 55 | BACKLOG: nota datada em `EA-44` — credor nomeado pela linha do stage | `:3424` (status `aberto`), `:3486-3496` | `D017_CREDOR_CORE = "EA-44"` (`:488`) e a linha `[DÍVIDA] core: relação …` citadas; "a 017 **não fecha** este achado" | ✓ |
| 56 | Achado novo para os dois pontos cegos de `ic_estatico` (`check_mutation.py:171-182`), id = próximo livre, status `aberto`, cadeia arquivo:linha→efeito | `grep -n '^## EA-46'`; maior id da série = 46 | `:3556` `## EA-46 — ic_estatico tem dois pontos cegos de regex, e hoje nenhum chamador os alcança` · `aberto` · cadeia `:181` (regex de `path.join(HERE, …)` só casa objeto literal — oito harnesses fora) e `:182` (`file: F.<nome>` não vê `em(F.ps016, …)`), efeito medido e o que não é medido (nenhum chamador consome o 2º elemento) | ✓ |
| 57 | Correção da citação de `EA-44`: `spec.md:441-442` → `:440-441` | `grep -c 'spec.md:441-442'` = 0; `:3436-3439`; `specs/013-…/spec.md:440-441` | citação agora `` `spec.md:38`, `:440-441` `` com nota de correção datada; **verdadeira no HEAD** — `:440-441` = "Editar `tests_core_mutants.js` — é a referência; sua falta de preflight é **dívida declarada** (T8)" (as 74 linhas novas da errata entram depois de `:440`) | ✓ |
| 58 | `specs/013-…/spec.md` e `BACKLOG.md` pinados → `gen_pins.py` no mesmo PR, commit separado | `git log -- pins.json`; baseline | `4f605c1` → `a45d697` (R7); `6a0c7a9` → `8f61eb8` (R8); `464/464` | ✓ |

### Contratos e erratas

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 59 | C1 (013) errata — `arquivos_mutados[]` relativo à raiz, `/`, sem `./`/`..`/`/` inicial, inclui criados/removidos; `mutantes[].arquivo` não alcançado (`spec.md:248-258`) | preflights (item 1); fonte de `d016` (`MUTABLE.concat(CRIAVEIS)`) | `999-sintetica-d016.json` (criado), `F5.json`/`sem_fecho.json` (removidos) presentes com diretório; `mutantes[].arquivo` segue basename (fora da errata, por desenho) | ✓ |
| 60 | C2 (013) extensão — `insumos` (regras a–f), `_meta.sonda_relacao {total, descricao}`, frase em `_meta.descricao`, `targets` mantida; dono `build-engineer` (W2) e `qa-engineer` para o pin (red) | mapa; `git show --stat adb883f`; autores | `adb883f` (QA) toca o mapa em **6 linhas, só `_meta.sonda_relacao`** (defasagem (a) riscada — confirmado); `e26ee90` (build-engineer) acrescenta `insumos`, a frase e as notas | ✓ |
| 61 | C5 (017) — retorno de `mut_relacao` `{estado, faltante, fantasma, insumos_ok, problemas: [(gate, alvo, causa)], forma, credor?}` sem I/O; fiação é do laço | fonte `:518-627`, `:782-811` | exato; `sub_alvo` só para FORM1 (`targets`/`arquivos_mutados`/`insumos`), o laço prefixa o harness | ✓ |
| 62 | Erratas Fase 3 — `D017-M19` com id, estado NOTA (variante A), prova de morte pelos quatro greps; `_meta.sonda_relacao` nasce no red pelo QA | red §8; matriz (i); item 60 | os quatro greps e as linhas literais em `red-017.md:222-232`; entrada (i) da matriz re-mede sobre `3d8fa70`; pin em `adb883f` | ✓ |
| 63 | Errata Fase 4 — `INS1(f)`, extensão de `FORM1(a)`, `M20`/`M21` em cópia no estado C (T022) com saídas guardadas; `_meta.sonda_relacao.total` continua 15 | matriz (ii): "T022 sobre o estado C (`e26ee90`, R3 `953df79`: M4, M20, M21)" + re-medição sobre `3d8fa70`; **HEAD** (itens 23, 25) | provados três vezes (C, B em `3d8fa70`, HEAD); pin 15 | ✓ |

### Comportamento, sonda, bordas, arquivos, tipagem, riscos, cross-check, escopo

| # | Exigência | Como medi | Resultado | Veredito |
|---|---|---|---|---|
| 64 | §Comportamento — as dez formas de linha (`spec.md:185-196`) | extraídas do executável (estado B, mutantes, red §8, fonte) | identidade `[OK]   D017: <h> · gatilho ⊇ conjunto mutado ∪ {harness} (<n>)` · com insumos `… (<n>) · insumos: <classe> <k>[, …]` · faltante/fantasma (itens 13, 15) · diagnóstico (26) · INS1 (a)–(e) `[FAIL] D017-INS1: <h> · <causa>: <classe> (<paths>)` e (f) `… · insumos malformado — não é objeto classe → [paths]: <tipo>` · FORM1 `[FAIL] D017-FORM1: <h>/<conjunto> · path fora da forma canônica: <path>` · `core` (28) · NOTA (12) · sonda `[OK]   D017-SONDA1: … (pinado: _meta.sonda_relacao.total = 15)` / `[FAIL] D017-SONDA1: cenário <rótulo> · esperado <campo> = … · obtido …` (`:771-773`). `<n>` = \|mutados ∪ {harness}\| (red §4 item 4); fecho conta **por linha** (defasagem (f): 9/4/2/0 medidos) | ✓ |
| 65 | Os 15 cenários com ids permanentes (`spec.md:198-216`) | fonte `:661-731` | rótulos `i · … xv ·` na ordem da tabela; xv usa os seis `arquivos_mutados` reais da `p51` como dado (`D017_P51_MUTADOS`) | ✓ |
| 66 | Bordas 1–12 (`spec.md:218-233`) | fonte + mapa + estado B | 1 → sonda vi (item 21) · 2/3 → `d016` emite criado/removidos e passa (27) · 4 → C5 · 5/6 → C2/C1 · 7 → uma classe, n membros (`fixture 44`) · 8 → D1 · 9 → quatro sem chave, `null` ≡ ausente (23) · 10 → `targets` **iguais a `9d617d0` nos 12** (nenhum protegido entrou) · 11 → o bloco não lê `receipts` (grep vazio em `:484-813`) · 12 → fora (item 5) | ✓ |
| 67 | §Arquivos rastreados que mudam — os sete + `pins.json` + `specs/017-…/*`; `gen_pins.py` no mesmo PR, em commit separado após **cada** commit de conteúdo (`spec.md:313-324`) | `git diff --stat 9d617d0..HEAD` (15 arquivos); `git log -- pins.json` | 7 (`check_mutation.py`, `mutation_map.json`, `tests_014_mutants.js`, `tests_016_mutants.js`, `mutation-matrix.json`, `specs/013-…/spec.md`, `BACKLOG.md`) + `pins.json` + 5 de `specs/017-…/` + `CONTEXT.md` (Fase 0, `abdddd0`; `git diff --stat abdddd0..HEAD -- CONTEXT.md` **vazio**) + planning-state (fora do registry, R13). **Doze repins** executados, cada commit de conteúdo seguido do seu (`adb883f`→`985c386`, `7923701`→`2c79eb2`, `e26ee90`→`953df79`, `9306d40`→`7cc3d86`, `4f2dc6c`→`14d2046`, `1aaccbe`→`0d3cce5`, `4f605c1`→`a45d697`, `6a0c7a9`→`8f61eb8`, `126dc61`→`bc12e28`, `d643d8d`→`5818b1c`); duas exceções **declaradas na mensagem do repin**: R0 (`f790a20`) fecha três portões e R1 (`d9a43d9`) dois commits de W0. `spec-validate.md`/`relatorio-final.md` ainda não pinados (R9, T043 — esperado) | ✓ |
| 68 | §Não mudam — `tests_core_mutants.js`, oito harnesses de raiz, `tests_ea41_mutants.js`, `expected_suites.json`, `pipeline.yaml`, `CONTEXT.md` (após a Fase 0), `known_issues.json`, `invariants.json`, `boundary.json`, `env_doctor.py`, `.gitattributes` (`spec.md:326-332`) | `git diff --stat 9d617d0..HEAD -- <lista>` | **vazio**; `check_suites.py:50-51` cobre o `cmd` de todo harness do mapa (lido) — nenhuma suíte contada nova | ✓ |
| 69 | Tipagem / R3 — autor do gate ≠ implementador; red commitado; mutante obrigatório; sem waiver (`spec.md:334-344`, `:444-447`) | autores dos commits; `check_tdd.py` | gate e pin da sonda: `adb883f` (`qa-engineer`); green: `e26ee90`/`9306d40`/`4f2dc6c` (`build-engineer`), nenhum toca `check_mutation.py`; docstring `126dc61` (`doc-writer`, comentário-only, PP-12); `red.status: proven`, `red.commit: adb883f…`; `0 waiver(s)` | ✓ |
| 70 | §Nascimento de gate (R10): positivo · negativo · adversarial · regressão; oráculo independente (JSON de C1); mutantes em cópia (`spec.md:146-156`) | tabela acima | positivo = estado B + sonda i/iv/x/xv; negativo = janela A (58 semânticos/70 literais), C4(b), `M1`–`M7`, `M19`–`M21`; adversarial = `M9`, `M21`, sonda v/vi/vii/xi; regressão = diff C8 vazio, `M1`/`M2`, `:1332-1421`. Nenhum mutante tocou a árvore real (clones efêmeros; porcelain vazio) | ✓ |
| 71 | §Riscos 1–6 (`spec.md:363-383`) | janela; preflights Windows; BACKLOG; matriz | 1 janela **7 → 2 → 1 → 0** medida (§Janela), invisível ao CI (único run: `5818b1c`, estado B + W3) · 2 Windows: `split(path.sep).join("/")` emitiu `/` neste host · 3 desenho (o gate lembra — `M4`) · 4 nenhum parágrafo novo de desvio (as sete razões viraram `insumos`; só duas notas de uma linha) · 5 → `EA-46` · 6 → credor `EA-42` nas três entradas | ✓ |
| 72 | §Cross-check — INV nenhuma violada; R13 sem conflito; specs 013/014/015/016 sem contradição não tratada; seladas intocadas; boundary; R10 §1–10 (`spec.md:385-447`) | diff de 15 arquivos (zero produto); `boundary.json`/`invariants.json`/`known_issues.json` intocados; `p51.targets` e os 56 da `d016` iguais a `9d617d0` (016 `spec.md:868` continua verdadeira: `check_mutation.py` fora de todo `targets`); nenhum `SKIP` (core = dívida; NOTA nomeada); contagem em dado; nenhuma âncora `HEAD:`; nenhum processo novo | ✓ |
| 73 | §Fora de escopo — nada de população/órfão, eixo C, `EA-44`/`EA-45`, oráculo da `p51` no gatilho, reescrita de `_trilha`, renome de `targets`, harness com `requires: chromium` (`spec.md:449-470`) | mapa; diffs | `p51.targets` inalterado (o caso xv vive só na sonda); `_trilha`s anexadas, não reescritas; `targets` é a chave; nenhum harness com `chromium` no diff | ✓ |

## Bateria sobre o HEAD — os onze mutantes de árvore, kill isolado

Clone efêmero de `5818b1c`; para cada mutante, edição textual, commit efêmero,
`origin/develop` apontado para o próprio commit (nenhuma campanha dispara — o
que se mede é o bloco), stage, `reset --hard`. Controle **C0** (HEAD íntegro,
mesma configuração): `11 [OK] D017 · 0 [FAIL] · ---- semântica do gatilho: 0
problema(s) nomeado(s) ---- · mutation: 0 campanha(s) executada(s) · 0
problema(s)`, exit 0. Em **todos** os onze: `---- integridade: 0 ----` (nenhum
move o contador da 013), exit 1, e o `[OK] D017` do harness mutado ausente
(10 `[OK]`, não 11).

| Id | Edição (cópia, commit efêmero) | Linha(s) medida(s) — literal | fecho 017 | Veredito |
|---|---|---|---|---|
| M1 | `p51.targets` − `USER_GUIDE.md` (`72aa28c`) | `[FAIL] D017-REL1: p51 · conjunto mutado fora do gatilho: USER_GUIDE.md` | 1 | MORTO |
| M2 | `p51.targets` + `ui_session_v32.js` (`26a29f4`) | `[FAIL] D017-REL2: p51 · alvo fantasma (sem razão de classe): ui_session_v32.js` | 1 | MORTO |
| M3 | `d014.targets` − `.claude/verify/regra_morta.js` (`2b40708`) | `[FAIL] D017-REL1: d014 · conjunto mutado fora do gatilho: .claude/verify/regra_morta.js` | 1 | MORTO |
| M4 | classe `fixture` retirada de `d010.insumos` (`c5ece24`) | `[FAIL] D017-REL2: d010 · alvo fantasma (sem razão de classe): fixtures_010_vao.js` | 1 | MORTO |
| M5 | `d010.insumos.oraculo` → `endurece_trigger` (`69102b7`) | `[FAIL] D017-INS1: d010 · classe fora do vocabulário: endurece_trigger (tests_010_vao.js)` — nenhuma REL2 | 1 | MORTO |
| M6 | `d015.insumos` + `populacao: [ui_v32.js]` (`35defe7`) | `[FAIL] D017-INS1: d015 · insumo que é conjunto mutado: populacao (ui_v32.js)` | 1 | MORTO |
| M7 | `p51.insumos = {oraculo: [tests_p50_core.js]}` sem entrar em `targets` (`9b11674`) | `[FAIL] D017-INS1: p51 · razão sem gatilho: oraculo (tests_p50_core.js)` | 1 | MORTO |
| M8 | `tests_014_mutants.js:305` → `path.basename(m.file)` (`3be0e08`) | `[FAIL] D017-REL1: d014 · conjunto mutado fora do gatilho: regra_morta.js, regra_morta_seletor.js [forma do path? mesmo basename nos dois lados: regra_morta.js, regra_morta_seletor.js — C1 exige path relativo à raiz]` e `[FAIL] D017-REL2: d014 · alvo fantasma (sem razão de classe): .claude/verify/regra_morta.js, .claude/verify/regra_morta_seletor.js [forma do path? …]` | 2 | MORTO |
| M9 | `:305` → `.join(String.fromCharCode(92))` (`be63e9e`) | `[FAIL] D017-FORM1: d014/arquivos_mutados · path fora da forma canônica: .claude\verify\regra_morta.js` · idem `…regra_morta_seletor.js` · `[FAIL] D017-REL2: d014 · alvo fantasma (sem razão de classe): .claude/verify/regra_morta.js, .claude/verify/regra_morta_seletor.js` (sem diagnóstico); 0 `REL1` | 3 | MORTO |
| M20 | `d010.insumos = []` (`28f228f`) | `[FAIL] D017-INS1: d010 · insumos malformado — não é objeto classe → [paths]: list` · `[FAIL] D017-REL2: d010 · alvo fantasma (sem razão de classe): fixtures_010_vao.js, tests_010_vao.js` | 2 | MORTO |
| M21 | `d010.targets` + `7`, `""` (`9f5f6cf`) | `[FAIL] D017-FORM1: d010/targets · path fora da forma canônica: 7` · `[FAIL] D017-FORM1: d010/targets · path fora da forma canônica: ` · 0 `REL2` da `d010` | 2 | MORTO |

Coincide linha a linha com a entrada (ii) da matriz (re-medição sobre
`3d8fa70`) e, para `M1`/`M2`/`M5`–`M7`/`M9`, com o red (`adb883f`, onde os
fechos eram 10 porque o estado A já tinha 9). Ao fim: `HEAD 5818b1c · porcelain
vazio · origin/develop 9d617d0`.

## Janela vermelha — re-medida commit a commit (clone efêmero, `origin/develop` = o próprio commit)

| Commit | Estado | `[OK] D017` | linhas `[FAIL]` (REL1 / REL2) | paths (REL1 / REL2) | harnesses vermelhos | diagnóstico C4(b) | fecho | integridade | exit |
|---|---|---|---|---|---|---|---|---|---|
| `adb883f` (red) | A | 4 | 9 (2 / 7) | 12 / 70 | `d009 d010 d011 d014 d015 d016 ea41` | 4 linhas | 9 | 0 | 1 |
| `e26ee90` (`insumos`) | C | 9 | 4 (2 / 2) | 12 / 12 | `d014 d016` | 4 | 4 | 0 | 1 |
| `9306d40` (`d014`) | C′ | 10 | 2 (1 / 1) | 10 / 10 | `d016` | 2 | 2 | 0 | 1 |
| `4f2dc6c` (`d016`) | B | 11 | 0 | 0 / 0 | — | 0 | 0 | 0 | 0 |

`[OK] D017-SONDA1 … 15 cenários` e `[NOTA] D017` = 0 nos quatro; `IC-6` = 0
nos quatro. É a tabela do plano (§Janela) e do `tasks.md` (§A janela vermelha)
**sem divergência** — inclusive a contagem por linha que o red fixou.

## As sete defasagens pré-declaradas do `tasks.md` — cada uma é o que diz ser?

| Item | Declarado | Medido | Veredito |
|---|---|---|---|
| ~~(a)~~ dono de `_meta.sonda_relacao` | riscado: virou Errata `_meta.sonda_relacao` | a errata existe (`spec.md:581-639`); `adb883f` toca o mapa só em `_meta` (6 linhas), pelo QA | **é o que diz** |
| (b) linhas de `pins.json` (`:425`/`:430`) | conferir pela chave | conferido pela chave: 14 chaves presentes; `_meta.gerado_de_head = d643d8d` | **é o que diz** |
| (c) `mutation_map.json:41`/`:246` | endereços pré-T020; localizar pela chave | notas localizadas por `harnesses.d009._trilha`/`harnesses.d016._trilha`, anexadas | **é o que diz** |
| (d) NOTA com duas redações | forma do executável vale | executável: *"não medida — preflight fracassou e IC-4 já o nomeou"* (§Comportamento) | **é o que diz** |
| (e) âncora C8 `abdddd0` × `36073dd` × `f790a20` | byte-idênticos nos quatro arquivos | `git diff --stat abdddd0 f790a20 -- <4>` vazio; base medida em `f790a20` | **é o que diz** |
| (f) contagem do fecho por linha ou por path | por linha; nenhum critério depende | 9/4/2/0 por linha (12+70 paths no A); nenhum item desta tabela usa o número como critério | **é o que diz** |
| (g) `EA-46` previsto | id real = próximo livre | `## EA-46` em `BACKLOG.md:3556`; maior id da série = 46 | **é o que diz** |

## O que mudou depois do `tasks.md` — pesado

1. **Três erratas** — lidas e conferidas contra o executável: `D017-M19` (item
   12), `_meta.sonda_relacao` (item 60), `INS1(f)` (itens 23, 25, 63). Nenhuma
   enfraquece; a de Fase 4 alcança um gate já commitado sem tocá-lo.
2. **`M19`, `M20`, `M21`** — os três têm id na série, carrasco executado com
   saída citável (red §8; matriz (i)/(ii); `M20`/`M21` re-mortos aqui) e vivem em
   `dividas_declaradas` com credor `EA-42`.
3. **T037** — a docstring de `ex_ids_do_harness` era a única citação
   **descritiva** de `IC-6`; corrigida em `126dc61`, provada comentário-only
   (item 45). As sete restantes são retrospectivas; duas delas (`:961`, `:1453`)
   nomeiam "a seção de integridade (IC-1…IC-6)" pela extensão histórica — a
   classificação de T037 as mantém e eu não a contesto: nenhuma afirma que o
   `IC-6` existe.
4. **Doze repins, não dez** — medido: `f790a20` R0 · `d9a43d9` R1 · `985c386` R2 ·
   `2c79eb2` **R2a** · `953df79` R3 · `7cc3d86` R4 · `14d2046` R5 · `0d3cce5` R6 ·
   `a45d697` R7 · `8f61eb8` R8 · `bc12e28` **R8a** · `5818b1c` **R8b**. **Três**
   fora da tabela prevista, não dois: R2a (errata pós-red), R8a (docstring,
   PP-12) e **R8b** (repin da própria emenda do plano `d643d8d`). O plano
   (`plan.md:287-288`, escrito em `bc12e28`) diz "onze executados, doze com R9 …
   os dois extras"; a mensagem de R8b diz "décimo segundo … os dois extras (R2a,
   R8a, R8b)" — lista três e conta dois. Não é gap da spec (cada commit de
   conteúdo tem o seu repin; baseline 464/464): é **registro defasado em um**,
   para o relatório final fechar com o par (commit → chaves): 12 executados,
   13 com R9, 14 se houver R10.
5. **`plan.md` amendado após a execução** — as três notas conferem com o git:
   P1 (duas edições do julgador: `adb883f` executável, `126dc61` docstring);
   P5 (o PR **não** abriu ao fim da W2: abriu em `5818b1c`, **12 commits**
   depois de `4f2dc6c` — `git rev-list --count 4f2dc6c..HEAD` = 12 —, todos sem
   CI até o run `34066877538`; a janela seguiu invisível ao CI); `[P]` da W3
   (rodou serial: `1aaccbe`→`0d3cce5`, `4f605c1`→`a45d697`, `6a0c7a9`→`8f61eb8`,
   `126dc61`→`bc12e28`). Orçamento: `check_mutation.py` tem **1.773** linhas
   (`wc -l`), como a nota diz.

## CI — o run `34066877538`, lido pela razão

| Job | Conclusão | O que o log diz (literal) | Classe |
|---|---|---|---|
| `verify` (`101577081187`) | success | `verify: 17 PASS · 0 FAIL` (linha 249) · `compliance: 17 PASS · 0 FAIL · 0 WARN` (317) · `[PASS] mutation` (243) · nenhum `[DEFER]` (a única ocorrência de "DEFER" é o env `MUTATION_DEFER_MISSING: 1`, linha 229) | verde canônico |
| `visual` (`101577081096`) | success | `P50 CHROMIUM + P51 … 27 PASS · 0 FAIL` · `P52 CHROMIUM … 55 PASS · 0 FAIL` · `D011 CHROMIUM … 1 PASS` · o bloco 017 **inteiro** (linhas 790–804, idêntico a §Estado B) · `[RUN] d014` · `[RUN] d016` · `35/35 … controles: 3 ok` · **`mutation: 2 campanha(s) executada(s) · 0 problema(s)`** (836) | verde canônico; **é aqui** que a linha `mutation: 2 campanha(s)` vive |
| `fecho` (`101577081169`) | failure | `[SONDA] fecho: 37 caso(s) · 0 divergência(s) (total pinado: 37)` · `[FAIL]  FECHO PENDENTE da demanda 017-semantica-do-gatilho (fase implement) — merge bloqueado até done` · `fecho --pr: FECHO PENDENTE · fase-nao-done` · exit 1 | **desenho** (`D016-PR1`, C8 da 016): acusa o processo, fecha em T046 |

Observação de registro (não é gap): `tasks.md` T029 e T040 (v) mandam ler
*"job `verify` do último run com `mutation: 2 campanha(s) · 0 problema(s)`"*.
O job `verify` roda o `run.sh`, que só ecoa a saída de um stage quando ele
**falha** (EA-15) — o log traz `[PASS] mutation`, sem a linha. A linha existe, no
mesmo run, no job `visual`, que invoca `check_mutation.py` diretamente. O
relatório final deve citar o job certo.

## Cobranças do refinamento (§"Como cobrar esta demanda") — para o aceite do PO

1. *Nenhum harness precisa de parágrafo de "desvio declarado" sob a regra nova*:
   as sete razões viraram `insumos` (item 36); as `_trilha`s de `d009` e `d016`
   ganharam **uma linha datada cada**, anexada (item 39); as outras dez são
   byte-idênticas.
2. *Fantasma não passa*: `M2` (red e HEAD, item 15), `M4` (matriz e HEAD, item
   16); e a direção "razão escrita mas quebrada" também não passa calada (`M20`,
   item 23).

## Achados que não entram no score (processo, com destino)

- **Planning-state defasado**: `phase: implement`, `implement.waves_done` sem a
  W3 (T030–T038 estão commitadas), sem `pr_url` (o PR #48 existe desde
  2026-09-06T23:26Z). T029 (`pr_url`) e T036 (`waves_done: [1,2,3]`, `phase:
  validate`) não foram executadas; T046 exige `pr_url presente`. Dono:
  orquestrador (skill `new-demand`), commit próprio, sem repin.
- **`relatorio-final.md`** ainda não existe (T042, `doc-writer`, `[P]` com
  T041); a spec §Arquivos rastreados o lista. As saídas de T022/T025/T028 que
  ele deve carregar têm aqui uma contraprova independente (§Janela, §Bateria).
- **Candidata de forma** (já registrada na Errata Fase 4 e em T042): `FORM1(a)`
  com string vazia imprime a causa sem sujeito (`… forma canônica: ` — medido em
  `M21`); veredito certo, forma pobre; conserto seria segunda edição do julgador.

## Classificação e próximo passo (skill, passos 3–5)

| Gap | Classe | Direção da correção | Aprovação do usuário? |
|---|---|---|---|
| G1 · Errata C1 da 013 nega a obrigação de forma | implementação-divergente | `doc-writer` reescreve **dentro** da nota `*(Errata C1 · demanda 017: …)*` em `:226` e nos parágrafos `:675-686`: forma canônica de `arquivos_mutados` (relativo à raiz, POSIX, criados/removidos), exemplo válido porque todos na raiz, `d014`/`d016` migrados em `9306d40`/`4f2dc6c`, `mutantes[].arquivo` fora; re-rodar `aditiva_013.py 9d617d0 HEAD` ⇒ `0 removida(s)` · `0 fora da forma`; commit próprio + repin **R10** (T045) | não (registro de tipo `doc`; a spec da 017 é a régua e não muda) |
| G2 · `:232` sem a extensão de C2 | faltando | mesma nota: acrescentar "desde a 017 `targets` pode conter insumos de prova com razão de classe na chave `insumos` — C2 estendido, `specs/017-semantica-do-gatilho/spec.md` §Contratos" | não |
| G3 · "sete harnesses com preflight" | implementação-divergente | `:194`, `:651-652`, `:664`: **onze** com preflight (o bloco corre sobre todos); **sete** com `insumos`; cobertura de 1 → 11 | não |
| G4 · D3 (i): o retorno "classifica cada path" | spec-errada | **decisão do usuário**: (i) errata de uma frase em `spec.md:33` e `:237-238` ("a classificação é **derivável** do retorno C5 e dos argumentos; `insumos_ok` devolve a posição `insumo(classe)`") + ajuste da nota de `EA-3` (`BACKLOG.md:539-547`), tipo `doc`, TL + `doc-writer`, repins; ou (ii) aceitar a leitura "derivável" e registrar aqui. **Não** recomendo a terceira rota — devolver `mutado`/`harness` no retorno — porque é segunda edição do julgador com red próprio, para um consumidor (`EA-3`) que ainda não existe | **sim** |

Iteração **1 de 2**. G1–G3 fecham num commit + um repin; G4 depende do usuário.
Nenhuma correção passa por `check_mutation.py`, `mutation_map.json` ou pelos
harnesses; nenhum gate é afrouxado (R10 §1). Após a correção, a iteração 2
deste documento repete: `aditiva_013.py 9d617d0 HEAD`, `grep -c` das notas,
leitura de conteúdo dos quatro pontos, `check_baseline.py`.
