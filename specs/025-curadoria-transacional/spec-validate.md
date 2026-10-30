# Conformidade — 025-curadoria-transacional

> Fase 6 · T090 · executor: `qa-engineer`, modelo **Fable 5.1** (`claude-fable-5-1`) ·
> somente leitura (skill `spec-validate`). 2026-10-30, pasta primária `phase5-009`,
> branch `feature/025-curadoria-transacional`, árvore limpa em **`91a57e7`** (R15a) para
> todas as execuções; a dívida `D025-INV8(c)` entrou na matriz em **`af41f72`**
> (classe (b), antes do score — ver §Antes do score). Conferido na implementação REAL
> (fonte lido no HEAD, `git diff` contra a base `da71759`, gates e stages EXECUTADOS),
> nunca no relato de quem implementou (R2 §4). Divergência pesa mais que ausência.

## Score

> **Iteração 2 (2026-10-30, após a errata E12 `42daddc` + R15b `6a6899d`): 42 de 42 · 100 % — ver §Iteração 2 ao fim.** O texto abaixo é o da iteração 1, mantido como foi medido.

**41 de 42 itens conformes · 97,6 %** — **um gap**, classe **`spec-errada`**, que exige
errata com aprovação do usuário e por isso PARA esta validação aqui (skill: < 100 % ⇒
uma iteração, nunca ajuste de gate nem de registro):

- **G1 · `mutation_map.json → harnesses.d025.targets` tem 9 nomes; a spec §Registro
  lista 8.** O nono é `SESSION_SCHEMA_V32.md`, que `D025-M21` MUTA (em cópia sob
  `os.tmpdir`, apontada por `D025_DOC_OVERRIDE`) e que o contrato C1 do harness declara
  em `arquivos_mutados`; `check_mutation.py` (D017-REL1) exige
  `targets ⊇ arquivos_mutados ∪ {harness}` — com 8 nomes o stage reprovaria o harness
  recém-nascido por "conjunto mutado fora do gatilho". Direção: a lista da spec é que
  está incompleta (a spec define M21 e, ao mesmo tempo, um `targets` que M21 viola);
  tirar o nono nome afrouxaria o gatilho (editar o schema deixaria de re-provar M21) e
  exigiria omitir um sujeito mutado do C1 — nunca (R10 §1). Leitura alternativa, declarada
  por honestidade: `implementação-divergente` (o registro não é o que a spec escreveu).
  Recomendação: errata aditiva **E12** na célula §Registro da spec (nota inline, molde das
  E9–E11), decisão do usuário; nenhum gate, registro ou mutante muda. Já estava declarado
  no relatório da T084 (D1) e na `_trilha` de `harnesses.d025`.

Fora do denominador, declarado: **E8** (`BACKLOG.md`) nasce em **T093**, depois desta
validação, por ordem do plano aprovado — não é gap nem ausência; hoje
`compliance-audit.sh` fecha `17 PASS · 0 FAIL · 0 WARN` (inclui a regra `backlog`).

## Antes do score — a dívida que a E9 dava como existente

A E9 (spec §Erratas tardias) escreve: *"Onde o gate afirma: … `mutation-matrix.json →
dividas_declaradas` (registro do `qa-engineer`, T084)"*. **Medido antes de pontuar**:
`grep -n INV8 .claude/verify/mutation-matrix.json` → **2 ocorrências, ambas no par
`D025-M9`** (`gate` e `ultima_prova`); em `dividas_declaradas`, **nenhuma**. A T084 não a
tinha escrito. Acrescentada em commit próprio, classe (b)
(`test(025): matriz — divida declarada INV8(c) idempotencia sem carrasco`, **`af41f72`**),
com o fato MEDIDO na campanha de 2026-10-30 que a sustenta: sob `D025-M9` o gate INV8
reprovou **só pela alínea (b)** (`[(b) estado ≠ A após importar sobre B: {…}]`) — a (c)
passou (A∪A = A); sob `D025-M4` o kill foi em TRX1 e a (c) também passa (duas
importações sem curadoria são iguais). Mutante que quebrasse só a idempotência exigiria
efeito acumulativo por importação, que nenhum sítio do produto tem (commit substitui por
atribuição; `fromSession` substitui o estado inteiro) — seria sintético. Classe
sentinela/regressão com gatilho nomeado (qualquer escrita em
`commitCanonicalOwners`/`restoreCanonicalOwners`/`fromSession` que passe a somar), como
`D015-TIT1(h2)`; não é tautologia (EA-20). O arquivo é pinado: `baseline` acusa
`mutation-matrix.json` divergente até o **R15** (`build-engineer`).

## Critérios C1–C16 — execução + leitura do fonte

Execução: `node tests_025_curadoria_sessao.js` ⇒ **`D025 CURADORIA SESSAO: 16 PASS · 0 FAIL de 16`**
(stage `suites`, 2026-10-30, `[OK] d025: 16 PASS · 0 FAIL`); campanha
`node tests_025_mutants.js` ⇒ **`23 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 23`**
(534 s; e 574 s dentro do stage `mutation`). Leitura: `git diff da71759 HEAD` nos cinco
módulos + grep no HEAD.

| # | critério | conforme | evidência executada · leitura |
|---|---|---|---|
| C1 | validar não aplica — nos três chamadores | sim | `D025-VAL1` PASS (a: 0 escritas em `validateSessionDocument`; b: seletor REAL `#ses-import` + `File` + `change`, prévia, Cancelar e Escape com 0 escritas; c: `prepareSessionExport` 0 escritas; d: controle ≥ 1). Leitura: `fromSession` ocorre em `ui_session_v32.js` só em `:620` (restore) e `:637` (commit); **0** em `validateSessionDocument`/`prepareSessionExport`; `:242` chama `window.__CURATION.validate(I.reportCuration)`. **M1 KILL** |
| C2 | o bridge valida sem tocar o estado; inválido não apaga a seleção | sim | `D025-VAL2` PASS (3 fixtures × a/b/c + d). Leitura `ui_curation_v32.js:253-262`: `daSessao` → `validar(obj)` → `if (erros.length) return erros` **antes** de qualquer escrita em `estado`; substituição por `estado = novo` (nunca merge). **M2 KILL** |
| C3 | ausência é a única grafia de "sem curadoria"; chave desconhecida recusada (ERR-2) | sim | `D025-CAN1` PASS (F-null/F-vazio/F-dec-vazio/F-dec-vazio-arch recusadas com "ausência da chave/do campo"; F-extra recusada nomeando `observacao`; F-arch válida; F-0 legítima). Leitura: as **oito** strings exatas de §Mensagens presentes em `ui_curation_v32.js` (1 ocorrência cada: `é null —`, `não é objeto`, `sem decisão declarada`, `decisions não é objeto`, `decisions sem chaves`, `campos não reconhecidos:`, `id fora do catálogo:`, `valor fora do enum fechado:`, `architectureNote fora do enum:`); prefixo `"Curadoria inválida: " + errosCur.join("; ")` em `ui_session_v32.js`. **M3, M23 KILL** |
| C4 | a curadoria entra no candidato e no commit, inclusive a ausência | sim | `D025-TRX1` PASS. Leitura `ui_session_v32.js:543` `curadoria: undefined` no literal `cand`; `:548` atribuição condicional (cópia profunda ou `undefined`); `:637` `fromSession(cand.curadoria)` **dentro** do `try`. **M4 KILL** |
| C5 | snapshot antes de qualquer escrita; falha devolve a SESSÃO (b, b′, c, d) | sim | `D025-TRX2` PASS. Leitura: `:626` `const snap = snapshotCanonicalOwners();` é a **primeira** instrução do commit; `:599-600` snapshot por `toSession()`; `:619-620` restore **sem** `&& snap.curadoria` (grep = 0 ocorrências da guarda); `:637` escrita após `OPERATIONAL_REFINEMENT` (`:636`) e antes de `tgtNotices = []` (`:638`). **M6, M7, M8, M22 KILL** (M6 também sob m48 — S69) |
| C6 | ausência substitui (tela, papel, export) | sim | `D025-AUS1` PASS — quatro janelas, cards ≥ 9, papel idêntico após `beforeprint`, inputs sem `reportCuration`. **M5 KILL** |
| C7 | roundtrip de identidade: substituição, nunca merge (E9) | sim | `D025-INV8` PASS (a–d). `exemplo-completo.json` declara `reportCuration = {decisions:{FortiAnalyzer:"exclude"}, architectureNote:"exclude"}`, importa `ok:true`. **M9 KILL** (por (b)); (a) coberta por M4; **(c) sem carrasco — dívida declarada** (§Antes do score) |
| C8 | sem efeito: cancelar, Escape, erro tardio, engine incompatível, inválida (E10) | sim | `D025-NOP1` PASS (F-tardio `/aprofundamento/`, F-engine direto e pelo seletor com `Importação bloqueada`, F-inv-id, Cancelar, Escape, F-tardio-0). `red-025.md` §P1: seletor real em **1 tick**, sem fallback. **M10 KILL** |
| C9 | Nova sessão limpa a curadoria; cancelar preserva | sim | `D025-NEW1` PASS. Leitura `ui_ux_v32.js:30`: `clear()`/`discardDraft()` guardados **antes** de `step=-1; render()`; `:61` (texto de Nova sessão) **não** está no diff contra a base; `tests_ux_m41.js` byte-idêntico a `da71759`, **56 PASS · 0 FAIL** (stage `suites`, `ux41`). **M11 KILL** (d025 + m48) |
| C10 | Reiniciar limpa a curadoria e o diálogo a nomeia | sim | `D025-RST1` PASS. Leitura `:57`: literal **exato** `Respostas, observações, prioridades e a curadoria do relatório serão limpas. O contexto tecnológico declarado será preservado.`; `:21` `clear()` antes de `render()`; landscape preservado. **M12 (d025 + m48), M13 KILL** |
| C11 | `prioLimitHit` transiente, zerado pelo commit | sim | `D025-TRN1` PASS. Leitura `:640` `prioLimitHit = false;`. **M14 KILL** |
| C12 | `draft` descartado por commit, Nova sessão e Reiniciar | sim | `D025-TRN2` PASS. Leitura `ui_v32.js:1691-1693`: `discardDraft`/`hasDraft` e `window.__V32UI` com **7** chaves; o diff de `ui_v32.js` contra a base acrescenta **nenhuma** linha `  if (draft !== null){` (as 2 ocorrências — `:1587`, `:1626` — já existiam na base; o "= 1" do tasks.md era medição errada, declarada em `red-025.md` D1; a âncora real do p52 é o par `function safePrint(){` + `if (draft !== null){`, preflight p52 108/108). **M15 KILL** |
| C13 | prévia e aviso de substituição falam da curadoria | sim | `D025-PRV1` PASS. Leitura `:756` `<li>Curadoria do relatório: ${yn(p.curation)}</li>` imediatamente após *Aprofundamento* (`:755`); `:671` `curation:`; `:677` `sessionHasContent` com `toSession() !== undefined`; literais de S30 intactos (`substituirá a sessão atual nesta janela`, `Importar e substituir`, 1 ocorrência cada). **M16 (d025 + m48), M17 KILL** |
| C14 | toggle-back volta a ausente (P3) | sim | `D025-UNS1` PASS (a–e). Leitura `ui_curation_edit_v32.js:91-92` tabela fechada (ofertado: marcado→`unset`, desmarcado→`set exclude`; não ofertado: marcado→`set include`, desmarcado→`unset`); `:187` nota arquitetural (`unsetArchitectureNote`/`setArchitectureNote("exclude")`); o diff contra a base toca **só** `:87-93` e `:181/:187` — `gateFechado()` e `decorar()` byte-idênticos (0 linhas no diff). **M18 KILL** |
| C15 | gate fechado: curadoria importada e retida; editor indisponível | sim | `D025-GAT1` PASS (nasceu verde, declarado). Poder: **M19 KILL** na campanha (único carrasco) — conferido na matriz e na saída da campanha |
| C16 | a documentação diz o que o produto faz | sim | `D025-DOC1` PASS (a–e). Leitura: `SESSION_SCHEMA_V32.md:238` linha da sexta chave com o mesmo nº de células; §4 "cinco blocos obrigatórios e a sexta chave opcional"; §8.4 e §9 nomeiam `__CURATION`; `USER_GUIDE.md` §11 — três linhas novas abrindo pela definição do verbete (`CONTEXT.md:210`), **sem** `facilitador|operador|engenheiro` (grep = 0 em §11 e no schema). **M21 KILL** |

```
D025 CURADORIA SESSAO: 16 PASS · 0 FAIL de 16
D025 MUTATION [tests_025_mutants.js]: 23 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 23
```

## Reancoragens em `tests_session_m48.js` (§29.4, autorizadas em 2026-10-27)

| item | conforme | evidência |
|---|---|---|
| S50 (lista de 11 chaves + (b) `"curadoria" in cand` e `undefined`) | sim | `SESSION 4.8: 97 PASS · 0 FAIL de 97` (`check_suites --heavy`, 83 s; e no stage `suites-heavy`). Carrasco **M20** DETECTADO (m48, `skipBuild`) |
| S69 (b) comportamental | sim | 97/97; **M6** DETECTADO sob m48 (`M48_HTML_OVERRIDE`, 93,5 s) |
| S30 (b) só curadoria declarada ⇒ `Importar e substituir` | sim | 97/97; **M16** DETECTADO sob m48 (88,1 s) |
| S31-S32 curada (`afterRestart`/`afterNew` com `toSession()===undefined`) | sim | 97/97; **M11**, **M12** DETECTADOS sob m48 (100,6 s · 92,2 s) |

`git log --oneline b20b20b..HEAD -- tests_session_m48.js` = **vazio**: o diff de T015 é o único
no arquivo (R3 §2). `M48_HTML_OVERRIDE` é a única mudança no carregador (`:3`).

## Erratas — tarefas desta demanda

| errata | artefato | conforme | prova (executada em 2026-10-30) |
|---|---|---|---|
| E1 · E2 | `specs/019-curadoria-do-relatorio/spec.md` (T074 `19f4d45`) | sim | `aditiva_025.py` (hash-object `c3c22e92…` = declarado) `19f4d45~1 19f4d45` ⇒ `aditiva-025: 2 linha(s) alterada(s) por UMA inserção [42, 49] · 40 linha(s) nova(s) · 0 removida(s)/alterada(s) fora de UMA inserção [] · 0 inserção(ões) fora da forma []` · `[OK]` · exit 0; `spec-validate.md` da 019 **intacto** (0 commits desde a base) |
| E3 | `tests_019_curadoria.js` (T076 `8ce520a`) | sim | `corpo_019_inv8.py` (hash `e7b71882…` = declarado) `8ce520a~1 8ce520a` ⇒ `janela de edição base :218-:219 → nova :218-:220 · 217 linha(s) antes idênticas · corpo + resto idênticos (638 linhas) · título E3 presente` · exit 0; `d019: 14 PASS · 0 FAIL`; `D019-M3` DETECTADO (campanha d019 17/17 no stage) |
| E4 · E5 | `SESSION_SCHEMA_V32.md`, `exemplo-completo.json` (T070) | sim | DOC1(a)-(d) e INV8(d) PASS; m48 97/97 (S79–S82, S109, S110 PASS); `toolVersion`/`engineSha256` do exemplo inalterados (`3.4.0-dev.4.8.0.7`, `9a4a2e67…`) |
| E6 | `USER_GUIDE.md` §11 (T072) | sim | DOC1(e) PASS; `p50core: 65 PASS · 0 FAIL` (nenhum `P51-DOC*` vermelho); sem palavra do papel; verbete `CONTEXT.md:210` como abertura |
| E7 | `bridges.json` (T082) | sim | notas `[025]` em `__V32UI` (`:9`) e `__CURATION` (`:73`); stage `lint-arch` PASS |
| E8 | `BACKLOG.md` (T093) | **deferida** (fora do denominador) | nasce em T093, depois desta validação; `compliance-audit.sh --rule=backlog` dentro do audit completo: `17 PASS · 0 FAIL · 0 WARN` hoje |
| E9 | spec C7 — INV8 nasce vermelho só por (d); (c) sem carrasco | sim | nota inline em C7 + §Erratas tardias; `red-025.md` D3; dívida **agora** em `dividas_declaradas` (`af41f72`) — a E9 a dava como existente desde T084 e não estava (corrigido antes do score) |
| E10 | spec C8 — texto do erro de F-tardio | sim | `ui_session_v32.js:493` `Valor de aprofundamento inválido: ref-hunting`; `D025-NOP1` assere `/aprofundamento/i` (não pina o texto) |
| E11 | contrato `validate(undefined) → []` | sim | `ui_curation_v32.js:219` `if (obj === undefined) return [];`; inalcançável pelo validador de sessão (`:239` só chama com `!== undefined`); necessário a VAL2(b); ratificado pelo usuário 2026-10-30; **sem mutante, declarado** (ramo inalcançável pelos chamadores) |

## Contratos

| contrato | conforme | leitura |
|---|---|---|
| Bridge `__CURATION` | sim | diff contra a base **acrescenta** só `unset`, `unsetArchitectureNote`, `validate` (+ `validar`, `daSessao` revisto, `CHAVES`); **nenhuma** linha de `state/offered/catalog/decide/published/isOperatorChoice/unsupported/set/setArchitectureNote/clear/toSession/contract` nem de `paraSessao` no diff (0); `fromSession(undefined)` zera e devolve `[]`; precedência 1→6 do plano em `validar` (`/* 1 */ … /* 6 */`) |
| `ui_session_v32.js` — tabela "onde cada linha entra" | sim | validador `:242` `validate`; `:241` `err("…nao esta disponivel")` permanece; `normalize` `:543/:548`; snapshot `:599-600` `toSession()`; restore `:619-620` sem guarda; commit `:626` snapshot primeiro, `:637` curadoria dentro do `try`, `:640` `prioLimitHit`, `:641` `discardDraft` guardado; `sessionPreview` `:671`; `showImportPreview` `:756`; `sessionHasContent` `:677`; `:231` (âncora CM1) intacta (grep 1) |
| `__V32UI` | sim | `ui_v32.js:1691-1693`: `function discardDraft(){ const had = draft !== null; draft = null; return had; }`, `function hasDraft(){ return draft !== null; }`, bridge com 7 chaves; o diff de `ui_v32.js` contra a base é **só** este bloco (+6/−1) |

## Registros e identidade

| registro | conforme | evidência |
|---|---|---|
| `bridges.json` | sim | E7; `lint-arch` PASS (`20 bridges em uso, todos registrados`) |
| `mutation_map.json → harnesses.d025` | **não — G1** (`spec-errada`) | `cmd`, `preflight: true`, `insumos.oraculo`, `requires` conformes; `targets` com **9** nomes contra 8 na spec — ver §Score |
| `expected_suites.json` | sim | `suites.d025 = 16/0` (fixado por execução), `heavy.session = 97/0` refixado por `check_suites --heavy`, `_trilha` 94→96→97 |
| `mutation-matrix.json` | sim | 23 pares `D025-M*` com `ultima_prova` medida (2026-10-30); `check_tdd`: `201 pares completos`; `_meta.execucao_demanda_025`; dívida INV8(c) (`af41f72`) |
| `pins.json` | sim | `check_baseline.py` em `91a57e7`: **`527/527 pins conferem · 0 divergentes · 0 ausentes · 0 sem pin`** (R0–R15a); após `af41f72` acusa a matriz até o R15 (previsto) |

## O que NÃO muda (spec §O que NÃO muda)

| item | conforme | evidência |
|---|---|---|
| `SESSION_SCHEMA_VERSION = 1` | sim | `ui_session_v32.js:5` |
| `paraSessao`; `decide()/published()/contract()/offered()` | sim | 0 linhas no diff de `ui_curation_v32.js` contra a base |
| engine e Camada 1 (zero linha); payload M41 | sim | `git diff --stat da71759 HEAD -- engine_v32.js quickscan_secops_soccmm_v3_1_3.html harness_m41_v313.js v3_1_3_functional_snapshot.json build_v32_html.py` = vazio; `check_m41.py` ⇒ `[OK] comparação com o snapshot funcional: PASS · [OK] payload 9794b267e4225d8f… == pin declarado (régua D2)`; `D019-MED1` PASS (d019 14/14) |
| `tests_ux_m41.js` (UX21 `:203`) | sim | byte-idêntico à base (diff vazio); 56/56 |
| texto de "Nova sessão" (`ui_ux_v32.js:61`) | sim | fora do diff |
| literais de S30 | sim | 1 ocorrência cada em `ui_session_v32.js` |
| `err("…modulo de curadoria nao esta disponivel")` | sim | `:241` (grep 1) |
| `hasSubstituteV32()`, proveniência, supressão, degradação 4/5 | sim | `ui_p52_support_v32.js` fora do diff da branch; d019 14/14, d023 9/9, d010 13/13 (stage `suites`) |

## Cross-check boundary · protótipos · âncoras alheias

| item | conforme | evidência |
|---|---|---|
| Boundary (R6): `frozen`/`legacy`/`registry` intocados; PROTECTED 15 conferidas, 3 repinadas inline com trilha (T080); `boundary.json` byte-idêntico | sim | `tests_p50_core.js` **65 PASS · 0 FAIL**; `git show HEAD:tests_p50_core.js` com `Identidade anterior` nos três pins; `boundary.json` fora do diff; stage `boundary` PASS |
| Protótipos P1/P2 | sim | `red-025.md` §Protótipos (P1 SIM em 1 tick; P2 1/1/0); `prototypes/` na raiz é diretório pré-existente só com `.gitkeep` (2026-08-27) — nenhum artefato de protótipo da 025 |
| Âncoras de mutantes alheios preservadas (EA-4) | sim | `--preflight` em 2026-10-30: d009 19/19 · d010 24/24 · d011 19/19 · d014 9/9 · d015 15/15 · d021 8/8 · d022 13/13 · d023 12/12 · d025 23/23 · p51 19/19 · p52 108/108 (`ok == total`); core por grep CM1/CM2/CM3 = 1/1/1; matriz com `ultima_prova` re-datada para core/d009/d015 (2026-10-30) |

## Pipeline inteiro — executado em `91a57e7`, árvore limpa

`bash .claude/verify/run.sh` (completo, 1857 s, exit 1 — o nº de stages vermelhos):

```
[PASS] env-doctor
[PASS] baseline
[PASS] eol-text
[PASS] boundary
[PASS] marker-lint
[PASS] icons-check
[PASS] build
[PASS] lint-arch
[PASS] regra-morta
[PASS] state
[PASS] tdd
[PASS] fecho
[FAIL] mutation
       [...] 101 linha(s) omitida(s) no meio (saída completa: 146 linhas) [...]
              D025 MUTATION [tests_025_mutants.js]: 23 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 23
              não-KILL: nenhum — os 23 mutante(s) lidos estão DETECTADO
       mutation: 9 campanha(s) executada(s) · 2 problema(s)
[PASS] mutation-coverage
[PASS] m41
[PASS] suites
[PASS] suites-heavy
[PASS] evidence-bridge
----
verify: 17 PASS · 1 FAIL
```

`bash .claude/verify/compliance-audit.sh` ⇒ **`compliance: 17 PASS · 0 FAIL · 0 WARN`**.
`python .claude/verify/check_m41.py` ⇒ payload `9794b267e4225d8f…` == pin.

**O único stage vermelho é `mutation`, pelas campanhas Chromium locais — nomeado, previsto
pelo tasks.md ("local FAIL nomeado requires chromium, KI-3"), e não da 025.** As 101 linhas
omitidas pelo `run.sh` (cabeça 30 + cauda 15; o log completo vive num `mktemp` apagado no
EXIT) não foram reconstruídas: o mesmo comando do stage foi **reexecutado isolado**, duas
vezes, com a saída inteira guardada, e a diferença foi **medida**:

| execução | interpretador | p51/p52 | fecho do stage |
|---|---|---|---|
| `run.sh` (91a57e7) | `PYBIN=python3` → alias da Microsoft Store, **Python 3.12 (MSIX)** | não executadas: `have("chromium")` é **False** sob esse interpretador — `os.path.isdir(%LOCALAPPDATA%\ms-playwright)` devolve False (virtualização de sistema de arquivos do app da Store; reproduzido: `python3 -c …` ⇒ `isdir= False`) ⇒ `[FAIL] p51/p52: campanha EXIGIDA … ambiente sem chromium` | `9 campanha(s) · 2 problema(s)` |
| `python .claude/verify/check_mutation.py` (af41f72, direto) | `C:\Python314\python.exe` 3.14.7 | executadas (cache visível): p51 **19/19**; p52 **95/108** — 13 sobreviventes | `11 campanha(s) · 1 problema(s)` (3318 s) |
| idem com `MUTATION_DEFER_MISSING=1` (WIP 0a50584, T084) | 3.14.7 | executadas, idem | `11 · 1` (3411 s) |

Em **todas** as execuções: integridade 0 · semântica do gatilho 0 (D017 d025 ⊇ (8) · oraculo 1) · IC-4
d025 23 âncoras · **d025 23/23** · core 3/3 · d009 19/19 · d015 15/15 · d019 17/17 · d021 8/8 ·
d022 13/13 · d023 12/12 · d010 23/24 (D010-M20 perdoado por KI-5). Os 13 "sobreviventes" da
p52 local foram diagnosticados com controle A/B **sem mutação** em HEAD e na base `da71759`:
PDF4/5/6 e TGT4 reprovam por **`poppler-utils (pdftotext/pdftoppm) ausente`** (12 falsos
sobreviventes, vermelho de controle) e ER5 sobrevive **também na base** (pré-existente neste
ambiente; a última prova canônica da p52 é o job `visual`, run 34772594772, 108/108). Registro
integral em `mutation-matrix.json → _meta.execucao_demanda_025`. A canônica desta demanda é o
job `visual` do PR (T095).

Achados candidatos para o BACKLOG (instrumento, não produto; dono `build-engineer`/QA; T093):
(i) `harnesses.p52.requires` não declara **poppler-utils** — com Chromium presente e poppler
ausente o stage local produz 12 falsos sobreviventes (classe EA-72); (ii) `run.sh` prefere
`python3`, que nesta máquina é o alias da Store sob virtualização MSIX — `have("chromium")`
diverge por interpretador e o `env-doctor` do pipeline reporta "Chromium indisponível" com o
cache presente; (iii) `run.sh` descarta o log completo do stage reprovado (101 linhas aqui) —
a identidade das campanhas não executadas e a 2ª causa só se recuperam reexecutando (EA-15).

## O que já nasce defasado — declarado, não é gap (tasks.md §"Onde o spec-validate olha")

(a) SHAs do cabeçalho de spec/plan (`d695dbb`, `520f20d`…) vivem só no reflog; equivalentes
`31e60b9`/`29be723`/`395942a`; base `da71759`. (b) Linhas de `pins.json` citadas pela spec
são endereço instável — conferido pela chave. (c) Linhas de `ui_session_v32.js` moveram após
T030 (`:240`→`:242`, `:533-541`→`:543-548`, `:585-586`→`:599-600`, `:602`→`:620`,
`:606-628`→`:626-647`, `:641-654`→`:671/:677`, `:718-736`→`:756`); localizado por texto.
(d) `tests_p50_core.js` `:382/:383/:550` moveram após T080. (f) a coluna `suites` da janela
do plano estava errada — o stage ficou vermelho NOMEADO de T013 a T084, como previsto no
tasks.md. (g) INV8 fechou na W7 (10/16 após a W3). (h) `core`/CM1 não foi medido entre T030 e
T040. (m) `red-025.md` cobriu R1 e R2. (n) INV8(b)(c) verdes no red → virou **E9**.
Mais dois, medidos nesta demanda: `grep -c "  if (draft !== null){" ui_v32.js` = **2** (não 1;
tasks.md T010/T060 — `red-025.md` D1) e `expected_suites.json → suites` com **23 → 24**
chaves (não "17 → 18").

## Formas de mutante declaradas (ataque preservado, forma reduzida ao discriminante)

Precedente d019 (`_trilha`): a coluna *Mutante previsto* descreve o ataque; a forma executável
é do harness. **M6** implementa a metade discriminante de mutB (restore sem `fromSession`;
a foto `null` é inerte sob ela) — mata TRX2(b) e S69(b). **M7** tira o snapshot DEPOIS da
escrita da curadoria (a única escrita que as fixtures tornam detectável: os dez owners do
documento de referência coincidem com a sessão) — mata TRX2(a)(b). **M4** apaga a chave do
candidato (o commit recebe `undefined` e limpa) — TRX1 (a)(b)(c). **M3** é uma linha em
`validar` que aceita `null/{}/{decisions:{}}` como vazio. Nenhuma forma afrouxa o que o
mutante previsto atacava; todas estão na `descricao` dos pares da matriz.

## Não executado, com causa

- Campanhas Chromium **canônicas** (`p51`, `p52`, suítes `p50chromium`/`p52chromium`/
  `d011chromium`): a execução local existe mas não é canônica (KI-3; poppler ausente) — a
  canônica é o job `visual` do PR (T095); a demanda não se declara pronta sem ele.
- E8 (`BACKLOG.md`): T093, por ordem do plano.

## Iteração 2 (2026-10-30) — única; só o G1 contra a E12

> Executor: `qa-engineer` (Fable 5.1). Partida `6a6899d` (R15b), árvore limpa, `check_baseline`
> **528/528**. Nada do que a iteração 1 conferiu foi reaberto: só o gap G1 contra a E12 e a lista
> de 9 do registro.

**Score final: 42 de 42 itens conformes · 100 %.** Denominador **mantido em 42**, declarado:
a E12 é a correção do G1 — não é exigência nova — e foi conferida dentro do item que a iteração 1
reprovou (`registros → mutation_map.json`), que passa a conforme. Classes de gap: 0.

| item | conforme | evidência (executada em 2026-10-30) |
|---|---|---|
| **G1** · `mutation_map.json → harnesses.d025.targets` × spec §Registro | **sim** | E12 (`42daddc`, autorizada pelo usuário: *"Autorizo a E12 (Recomendada)"*; registro em §Erratas tardias, HEAD do PO `017ed5d`): a célula §Registro recebe nota inline — *"a lista real tem **9** — o nono é `SESSION_SCHEMA_V32.md`, mutado em cópia por M21 e exigido no gatilho por `D017-REL1`"*. Conferência mecânica: os nove nomes citados na célula (`tests_025_curadoria_sessao.js`, `tests_025_mutants.js`, `tests_session_m48.js`, `ui_curation_v32.js`, `ui_curation_edit_v32.js`, `ui_session_v32.js`, `ui_ux_v32.js`, `ui_v32.js`, `SESSION_SCHEMA_V32.md`) são, como conjunto, **iguais** aos `targets` do registro (9 = 9; 0 faltando, 0 sobrando). `cmd`, `preflight: true`, `insumos.oraculo`, `requires` já conformes na iteração 1 |
| E12 como errata (aditiva, nada apagado) | sim | `git show --stat 42daddc`: `spec.md` +22/−… só por nota inline + seção `### E12`; `refinement.md` +1 (rodada 8); nenhuma linha anterior reescrita (molde E9–E11); repin R15b `6a6899d` |

**Nada de produto ou de registro executável mudou desde o pipeline de `91a57e7`:**
`git diff --stat 91a57e7 HEAD` = `.claude/verify/mutation-matrix.json` (+1 dívida, texto),
`.claude/verify/pins.json` (R15, R15b), `specs/025-curadoria-transacional/refinement.md` (+1),
`spec.md` (E12), `spec-validate.md` (este arquivo) — nenhum `ui_*.js`, suíte, harness,
`expected_suites.json` ou `mutation_map.json`. Por isso o `run.sh` completo **não foi reexecutado**:
valem o run de `91a57e7` (`verify: 17 PASS · 1 FAIL` — só `mutation`, pelas campanhas Chromium
locais, explicado acima) e as reexecuções isoladas do stage (`11 campanha(s) · 1 problema(s)`,
p52 local por poppler/ER5 — nada da 025). Reexecutados nesta iteração, por serem baratos e
lerem o que mudou: `check_baseline.py` ⇒ **`528/528 pins conferem · 0 divergentes · 0 ausentes
· 0 sem pin`**; `check_tdd.py` ⇒ `[OK] 025-curadoria-transacional.json: red provado e commitado
(b20b20b1e2e3…)` · `[OK] matriz gate↔mutante: 201 pares completos` (a dívida `D025-INV8(c)`
aparece listada).

Fora do denominador, como na iteração 1: **E8** (`BACKLOG.md`, T093 — ordem do plano). Segue para
o aceite de intenção do `product-owner` (T092) e para o relatório final (T093); "pronto" continua
sendo o job `visual` verde no PR (T095, KI-3).
