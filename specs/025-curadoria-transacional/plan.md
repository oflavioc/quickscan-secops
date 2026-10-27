# Plano — 025-curadoria-transacional

> Fase 2 · dono: tech-lead · consome a spec aprovada.
>
> **Quem escreveu**: o `tech-lead`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-10-27, sob delegação do orquestrador, na worktree
> `phase5-sel` (branch `feature/025-curadoria-transacional`, HEAD `520f20d`;
> `origin/develop` em `cee02e9` após `git fetch`, merge-base `cee02e9`, 14 à frente,
> 0 atrás). A spec foi **aprovada integralmente pelo usuário em 2026-10-27**
> (`refinement.md:423`, rodada 4), com as 12 emendas `[PO 2026-10-27]` e as erratas
> ERR-1/ERR-2 do refinamento. Este plano **não reabre** critério, gate, mutante,
> texto ou autorização — fixa camada, donos, contratos, ordem, custo e janela.
>
> O que foi **executado** para escrever isto (só leitura e medição, árvore limpa
> antes e depois — `git status --short` vazio): `check_baseline.py` (519/520 ·
> 1 divergente · 2 sem pin), `--preflight` de d009/d010/d015/d019/d021/d022/d023/
> p51/p52/d016, `check_mutation_coverage.py`, e **três suítes cronometradas** —
> `tests_session_m48.js` 97/97 em **107 s** (heap 6144), `tests_019_curadoria.js`
> 14/14 em **10 s**, `tests_p50_core.js` 65/65 em **51 s**. Nada foi mutado,
> commitado ou repinado.

## Desenho

### A decisão central: a transação já existe — a curadoria passa a obedecê-la

`ui_session_v32.js` já tem a forma certa — `parse → validate → normalize → compat
→ confirm → commit atômico → recompute` (`:3`) — para dez owners. O defeito da 019
é que a curadoria entrou pela porta errada: o **validador aplica** (`:240`), o
candidato **não a leva** (`:533-541`), o snapshot guarda `state()` em vez da forma
canônica (`:585-586`) e o rollback restaura **o arquivo** quando devia restaurar a
**sessão** (`:602`). O desenho não cria mecanismo novo: **põe a sexta chave nos
quatro lugares onde as outras dez já estão**, e torna o bridge capaz de validar
sem aplicar. Tudo o mais (Nova sessão, Reiniciar, prévia, transientes, toggle-back)
é consumir API de bridge que já existe ou que nasce aqui.

Camada: **produto 5.x** (módulos de UI por injeção). Engine e Camada 1: **zero
linha** (INV-1; `D019-MED1` + stage `m41` continuam a prova). Nenhum módulo novo,
nenhum bridge novo, nenhum patch-point, zero CSS.

### Módulos tocados — um dono por módulo

| Módulo | Dono | O que muda | Por que esse dono |
|---|---|---|---|
| `ui_curation_v32.js` (243 linhas, IIFE, bridge `__CURATION`) | `core-engineer` | nasce **`validate(obj)`** (puro); **`unset(id)`**; **`unsetArchitectureNote()`**; `fromSession` passa a *validar-antes-de-zerar* e a tratar `undefined` como "limpa"; chave desconhecida dentro do bloco recusada (M23) | owner do estado (R9 §5); lógica não-visual |
| `ui_session_v32.js` (760, legado 4.8, §29.4) | `core-engineer` | validador chama `validate`; `cand.curadoria` **sempre presente**; snapshot com `toSession()`; restore sem a guarda `&& snap.curadoria`; commit escreve `fromSession(cand.curadoria)` dentro do `try`, antes dos transientes; `prioLimitHit=false`; `discardDraft()` guardado; `sessionPreview.curation`; linha da prévia; `sessionHasContent`; comentários `:3`, `:232-236`, `:565-569`, `:582-584` | coordenador da transação; consome, nunca decide |
| `ui_ux_v32.js` (249, legado 4.1, §29.4) | `core-engineer` | `uxNewSession`/`uxResetAssessment` chamam `__CURATION.clear()` e `__V32UI.discardDraft()` (guardados) **antes** de `render()`; texto do diálogo de Reiniciar (`:55`) | a mudança é **ciclo de vida do estado** (quais owners um reset zera) mais um literal fixado pela spec; zero CSS/layout/a11y — `ui-engineer` nunca decide estado (R5) |
| `ui_curation_edit_v32.js` (272, IIFE, `__P53CUR`) | `ui-engineer` | os dois handlers de `change` (`:86-88`, `:181`) escrevem **só a divergência**: tabela fechada (marcado × ofertado) → `unset`/`set` | módulo do editor desde a 019 (T016, `ui-engineer`); a tabela vem da spec, o handler só a aplica — não é decisão |
| `ui_v32.js` (1713, monólito 4.x, §29.4) | `core-engineer` | `__V32UI` ganha **`discardDraft()`** e **`hasDraft()`**; nada mais | acessores de estado do `draft` (owner `ui_v32.js:139`); **wave própria, severável** (E0) |
| `tests_025_curadoria_sessao.js` (**novo**) | `qa-engineer` | os 16 gates `D025-*`, fixtures, `vac()`, `D025_HTML_OVERRIDE`/`D025_ONLY`/`D025_DOC_OVERRIDE` | R3 §2 |
| `tests_025_mutants.js` (**novo**) | `qa-engineer` | 23 mutantes, `--preflight`, três estados, cinco execuções de m48 sob `M48_HTML_OVERRIDE` | R3 §5; ver *Quando o harness nasce* |
| `tests_session_m48.js` (1492, congelada, §29.4) | `qa-engineer` | S50(b), S69(b), S30(b), S31-S32 curada, **uma linha** no carregador (`M48_HTML_OVERRIDE`) | autorização nominal 2026-10-27; QA escreve gate |
| `tests_019_curadoria.js:219` | `qa-engineer` | errata **E3** — título do `D019-INV8` (comentário/rótulo; corpo intacto) | arquivo de gate; tarefa `doc` |
| `SESSION_SCHEMA_V32.md`, `USER_GUIDE.md`, `synthetic_session_examples/exemplo-completo.json`, `specs/019-curadoria-do-relatorio/spec.md`, `.claude/BACKLOG.md`, relatório final | `doc-writer` | E4, E6, E5, E1/E2, E8 | PT-BR, promoção de registro |
| `quickscan_secops_soccmm_v3_2_dev.html` (`generated`) | **via builder**, no commit do módulo | reconstruído por `build_v32_html.py` a cada wave de produto | rito vivo: `aef6ff3`, `90f14ea`, `f10f60b`, `7e75cce` — o HTML viaja **no mesmo commit** do módulo; o stage `build` nunca fica vermelho |
| `tests_p50_core.js` (`PROTECTED`) | `build-engineer` | só os três valores inline (`:382` `ui_v32.js`, `:383` `ui_ux_v32.js`, `:550` `ui_session_v32.js`) com trilha "Identidade anterior" | precedente `0535775` (022) |
| `.claude/verify/bridges.json` | `build-engineer` | E7 — notas de `__CURATION` e `__V32UI` | registry |
| `.claude/verify/expected_suites.json`, `mutation_map.json`, `mutation-matrix.json` | `qa-engineer` | `suites.d025` e `heavy.session` fixados **por execução**; `harnesses.d025`; pares e `ultima_prova` | **D4 da 013**: a chave `preflight` entra no mesmo commit em que o harness lê `--preflight` — um autor, um commit (precedentes 019 T022, 021, 022, 023, todos `qa-engineer`). Divergência do brief (que previa `build-engineer`): declarada em DEPENDÊNCIAS |
| `.claude/verify/pins.json` | `build-engineer` | `gen_pins.py`, um por commit de conteúdo | R8 |
| `CONTEXT.md` | **ninguém** | sem termo novo (vocabulário interno declarado na spec); está **divergente** no registry desde a Fase 0 — entra no repin R0 | — |

**Não tocados, por desenho**: `build_v32_html.py` (ordem de injeção não muda — e
editá-lo dispararia `d011` e `d014`), `tests_ux_m41.js`, `engine_v32.js`, Camada 1,
`ui_p52_support_v32.js`, `ui_p52_workspace_v32.js`, `ui_ondas_v32.js`.

### Owner do estado — para cada dado novo (R9 §5)

| Dado | Nasce em | Owner | Natureza |
|---|---|---|---|
| estado da curadoria (`decisions`, `architectureNote`) | já existe | `ui_curation_v32.js` | canônico; única porta de escrita continua o bridge |
| `cand.curadoria` (cópia profunda de `inputs.reportCuration`, ou `undefined`) | `normalizeSessionDocument` | `ui_session_v32.js` | **candidato** — transiente da transação, nunca persistido, nunca lido por render |
| `snap.curadoria` (= `toSession()`) | `snapshotCanonicalOwners` | `ui_session_v32.js` | fotografia para rollback; forma canônica (`undefined` = nada declarado) |
| `sessionPreview().curation: boolean` | `sessionPreview` | `ui_session_v32.js` | derivado do **documento**, não do estado; só a prévia lê |
| `draft` | já existe (`ui_v32.js:139`) | `ui_v32.js` | acessores novos `discardDraft()`/`hasDraft()`; estado não muda de dono |
| `prioLimitHit` | já existe (Camada 1) | Camada 1 | o commit o zera como `uxNewSession` já zera (`ui_ux_v32.js:19`,`:27`) — escrita de transiente, não dado novo |

Nenhum estado nasce em decorador; nenhuma renderização escreve.

### Ordem de injeção — conferida, e por que não muda

`build_v32_html.py:81`: `UI` (`ui_v32.js`) → `UX` → `TARGET` → `REF` → meta →
`JOURNEY` → **`SESSION`** → `P50_SHELL` → `P50_SUFF` → `P50_RESULTS` →
**`CURATION`** → `P52_WORKSPACE` → `D011` → `ONDAS` → `P53_SUPPORT` →
`P53_CURATION_EDIT`.

`ui_session_v32.js` é injetado **antes** de `ui_curation_v32.js`. É irrelevante, e
é preciso dizer por quê: toda referência de `ui_session_v32.js` a `window.__CURATION`
vive **dentro de funções** (validador, snapshot, restore, commit, `sessionHasContent`),
nunca no topo do módulo; o bundle executa de cima a baixo num único `<script>` antes
de qualquer chamada a `__DEV` ou evento de usuário — quando `validateSessionDocument`
roda, `__CURATION` já está instalado. O mesmo vale para `ui_ux_v32.js` →
`__CURATION.clear()` e para `ui_session`/`ui_ux` → `__V32UI.discardDraft()`
(`ui_v32.js` é o primeiro injetado e `__V32UI` nasce em `:1688`). Todas essas
chamadas ficam **guardadas por existência/`typeof`**, e o
`err("…modulo de curadoria nao esta disponivel")` (`:238-239`) permanece na classe
defensiva. **A ordem não se toca.**

## Contratos e registros

### Bridge `__CURATION` — acréscimos e semântica revista (owner `ui_curation_v32.js`)

```
validate(obj)            → string[]   puro: não lê nem escreve `estado`; [] = válido
unset(id)                → true       delete decisions[id]; lança "curadoria: id fora do catálogo: <id>"
unsetArchitectureNote()  → true       architectureNote = undefined
fromSession(obj)         → string[]   obj === undefined ⇒ zera e devolve [];
                                      erros = validate(obj); não vazio ⇒ devolve erros SEM tocar estado;
                                      vazio ⇒ substitui o estado inteiro (nunca merge)
```

**Precedência das recusas em `validate`** (as oito mensagens da spec §Mensagens,
texto exato lá; aqui só a ordem, que a spec não fixa e o gate precisa):

1. `obj === null` → devolve `[msg null]` (estrutural: termina);
2. não objeto ou array → `["reportCuration não é objeto"]` (termina);
3. chaves fora de `{decisions, architectureNote}` → acumula
   `reportCuration: campos não reconhecidos: <k1>, <k2>` (ordem de `Object.keys`) e **continua**;
4. sem `decisions` **e** sem `architectureNote` → acumula "sem decisão declarada" e termina;
5. `decisions` presente: não objeto/array/`null` → "decisions não é objeto"; zero chaves →
   "decisions sem chaves…"; senão item a item por `valido()` (`:133-138`, inalterado);
6. `architectureNote` presente e fora do enum → "architectureNote fora do enum: …".

Estrutural termina cedo; de campo acumula — é o que `daSessao` já faz hoje para
ids e enum, e é o que `F-extra` (A + `observacao`) exige: a mensagem nomeia a chave
**e** o resto do bloco continua a ser validado. **Uma verdade só** (R9 §8):
`validate` é o único lugar que sabe o que é curadoria válida; `set`/`unset`
continuam em `valido()`; o validador de sessão só compõe o prefixo
`Curadoria inválida: ` (`ui_session_v32.js:241`, inalterado).

**Contrato de instrumentabilidade** (sem ele os gates não medem): o bridge continua
um **objeto literal com propriedades graváveis** (não `Object.freeze`), com
`__installed` como hoje; e **todo** consumidor chama `window.__CURATION.<m>(...)` por
propriedade **no momento da chamada** — nunca referência capturada no topo do módulo
(`const { fromSession } = …` quebraria o contador de VAL1/TRX2 e a falha sintética
de TRX2(b)). Mesma regra para `window.__V32UI.discardDraft`.

### `ui_session_v32.js` — onde cada linha entra

| Função | Mudança exata | Preservar byte a byte |
|---|---|---|
| `validateSessionDocument` `:237-242` | `fromSession(I.reportCuration)` → **`validate(I.reportCuration)`**; comentário `:232-236` reescrito | **`:231`** (`if (hasReservedDerived(I,0)) …`) é a âncora de `CM1` (`tests_core_mutants.js:55`) — não se move |
| `normalizeSessionDocument` `:533-541` | literal `cand` ganha `curadoria: undefined`; depois `cand.curadoria = (I.reportCuration === undefined) ? undefined : JSON.parse(JSON.stringify(I.reportCuration));` — chave **sempre própria** (`hasOwnProperty`) | — |
| `snapshotCanonicalOwners` `:585-586` | `curadoria: (…__CURATION) ? window.__CURATION.toSession() : undefined` | `:76` (`out.reportCuration = cur;`, âncora `D019-M3`) fica fora |
| `restoreCanonicalOwners` `:601-602` | `if (typeof window !== "undefined" && window.__CURATION) window.__CURATION.fromSession(snap.curadoria);` — a guarda `&& snap.curadoria` **cai** (ERR-1, confirmado pelo PO) | ordem dos outros owners |
| `commitCanonicalOwners` `:606-628` | dentro do `try`, **após** `OPERATIONAL_REFINEMENT` (`:619`) e **antes** de `tgtNotices = []` (`:620`): `if (window.__CURATION) window.__CURATION.fromSession(cand.curadoria);`; nos transientes (`:620-621`): `prioLimitHit = false;` e `if (window.__V32UI && typeof window.__V32UI.discardDraft === "function") window.__V32UI.discardDraft();` | `snapshotCanonicalOwners()` continua a **primeira** instrução |
| `sessionPreview` `:641-649` | `curation: doc.inputs.reportCuration !== undefined` | — |
| `showImportPreview` `:718-736` | `<li>Curadoria do relatório: ${yn(p.curation)}</li>` após *Aprofundamento*, no template existente (não é `innerHTML =` novo) | literais `substituirá a sessão atual` / `Importar e substituir` |
| `sessionHasContent` `:650-654` | `\|\| (typeof window !== "undefined" && window.__CURATION && window.__CURATION.toSession() !== undefined)` | — |

Por que a escrita da curadoria fica **depois** dos owners e **antes** dos
transientes (DEPENDÊNCIA 4d da Fase 1, respondida): (i) TRX2(c) exige que uma
falha *antes* dela (`Set.prototype.clear`, primeira escrita de owner) deixe a
curadoria intocada — qualquer posição dentro do `try` satisfaz; (ii) TRX2(b) exige
que uma falha *dela* desfaça os dez owners já escritos — logo ela tem de estar
**dentro** do `try` (M8 a põe fora); (iii) os transientes (`tgtNotices`,
`refStage`, `prioLimitHit`, `draft`) só podem ser zerados quando **todas** as
escritas de owner terminaram, senão um rollback deixaria transiente limpo com owner
restaurado — por isso a curadoria vem **antes** deles. É a mesma regra que o
código de hoje aplica aos dez.

### `__V32UI` (owner `ui_v32.js`)

`window.__V32UI = { openEditor, esc32, iconFor, ARCH_FIELDS, publishableStats, discardDraft, hasDraft }`
(`:1688`), com

```
function discardDraft(){ const had = draft !== null; draft = null; return had; }
function hasDraft(){ return draft !== null; }
```

Só estado: o DOM do editor é refeito pelo `render()` que **sempre** segue
(`uxNewSession`/`uxResetAssessment` renderizam; `recomputeAfterImport` renderiza).
`hasDraft()` tem **uma** citação viva (comentário, `ui_p52_workspace_v32.js:2015`) e
**zero** chamadores (grep `hasDraft|discardDraft` em `ui_*.js` = só a citação):
nascer não muda comportamento do workspace. **Restrição de âncora**: a linha
`  if (draft !== null){` (`:1587`) é âncora de `P52-…` (`tests_p52_mutants.js:1172`,
`ocorrencias == 1`) — as funções novas **não** repetem essa forma (usam a expressão,
não um `if` com esse texto).

### `ui_ux_v32.js`

- `uxResetAssessment` (`:17-22`): depois de `arq=null;`, antes de `step=-1; render();`:
  `if (window.__CURATION) window.__CURATION.clear(); if (window.__V32UI && typeof window.__V32UI.discardDraft === "function") window.__V32UI.discardDraft();`
- `uxNewSession` (`:23-30`): idem, depois de `V32.resetLandscapeToUnset();`.
- `:55` → `Respostas, observações, prioridades e a curadoria do relatório serão limpas. O contexto tecnológico declarado será preservado.`
  **Antes do commit**: `grep -rn "Respostas, observa" tests_*.js tests_visual/` = 0
  (medido hoje; mitigação do `EA-62`). `:61` (Nova sessão, UX21 `tests_ux_m41.js:203`)
  **não muda**.

### `ui_curation_edit_v32.js` — tabela fechada do handler

| item | marcado (`checked`) | desmarcado |
|---|---|---|
| ofertado (`ofertado === true`, `:78`) | `b.unset(id)` | `b.set(id,"exclude")` |
| não ofertado | `b.set(id,"include")` | `b.unset(id)` |
| leitura arquitetural (`:181`) | `b.unsetArchitectureNote()` | `b.setArchitectureNote("exclude")` |

`gateFechado()` (`:62-65`, âncora de `D019-M10`) e `decorar()` (`:216-217`) **não
mudam**. Sessões antigas com `include` explícito em ofertado continuam válidas
(enum intacto) e normalizam-se ao primeiro toque — comportamento declarado na spec.

### Patch-points

**Nenhum.** Nenhum monkey-patch, nenhum wrapper de `render`, nenhum
`MutationObserver`, nenhum decorator registrado: `ui_ux_v32.js` chama o bridge;
`ui_session_v32.js` chama o bridge; o editor chama o bridge. Os quatro wrappers
vivos de `render` (E12) seguem como estão.

### `bridges.json` — sem bridge novo; duas notas (E7)

```
"__V32UI":    "ponte da Camada 3 (publishableStats, iconFor, ARCH_FIELDS). [025] discardDraft()/hasDraft():
               acessores do `draft` do editor de contexto — o draft e descartado por commit de importacao,
               Nova sessao e Reiniciar (D025-TRN2); nenhum outro modulo escreve `draft`."
"__CURATION": "estado de curadoria do relatorio (demanda 019) … [025] validate(obj) e PURO e e a unica
               verdade sobre curadoria valida (R9 §8); fromSession recusa SEM tocar o estado e trata
               `undefined` como 'nada declarado'; unset()/unsetArchitectureNote() devolvem ao ausente
               (toggle-back, D025-UNS1). Renderizacao consome, nunca escreve (R9 §5)."
```

### Pins — arquivos pinados que mudam (repin no mesmo PR, **sempre em commit separado**)

Produto: `ui_curation_v32.js`, `ui_session_v32.js`, `ui_ux_v32.js`,
`ui_curation_edit_v32.js`, `ui_v32.js`, `quickscan_secops_soccmm_v3_2_dev.html`.
Gates: `tests_session_m48.js`, `tests_p50_core.js` (três valores inline),
`tests_019_curadoria.js` (E3). Novos: `tests_025_curadoria_sessao.js`,
`tests_025_mutants.js`. Docs: `SESSION_SCHEMA_V32.md`, `USER_GUIDE.md`,
`synthetic_session_examples/exemplo-completo.json`,
`specs/019-curadoria-do-relatorio/spec.md`, `.claude/BACKLOG.md`. Registros:
`bridges.json`, `expected_suites.json`, `mutation_map.json`, `mutation-matrix.json`.
Artefatos: `specs/025-curadoria-transacional/*` e **`CONTEXT.md`** (já divergente).

**Série de repins** (medida hoje: `check_baseline` = `519/520 · 1 divergente
(CONTEXT.md) · 2 sem pin (refinement.md, spec.md)`; a dívida dos portões **não é
zero**):

| R | depois do commit de | dono |
|---|---|---|
| R0 | `plan.md` (portão da Fase 2) — fecha CONTEXT.md + refinement.md + spec.md + plan.md | `build-engineer` |
| R0b | `tasks.md` (Fase 3) | idem |
| R0′ | **rebase** sobre `develop` com #112/#113 — `pins.json` conflita por construção (#112 e #113 têm repins próprios); resolve-se **regenerando**, nunca à mão | idem · classe (a), prevista |
| R1 | red: `tests_025_curadoria_sessao.js` (+ `red-025.md`, se o QA o escrever) | idem |
| R2 | reancoragens em `tests_session_m48.js` | idem |
| R3 | `ui_curation_v32.js` + HTML | idem |
| R4 | `ui_session_v32.js` + HTML | idem |
| R5 | `ui_ux_v32.js` + HTML | idem |
| R6 | `ui_curation_edit_v32.js` + HTML | idem |
| R7 | `ui_v32.js` + HTML (severável) | idem |
| R8 | `SESSION_SCHEMA_V32.md` + `exemplo-completo.json` (E4+E5, um commit) | idem |
| R9 | `USER_GUIDE.md` (E6) | idem |
| R10 | `specs/019-…/spec.md` (E1+E2) | idem |
| R11 | `tests_019_curadoria.js` (E3) | idem |
| R12 | `tests_p50_core.js` — repin inline §29.4 ×3 com trilha | idem |
| R13 | `bridges.json` (E7) | idem |
| R14 | harness `d025` + `mutation_map` + `expected_suites` + `mutation-matrix` | idem |
| R15 | `spec-validate.md` (Fase 6) | idem |
| R16 | `relatorio-final.md` + `BACKLOG.md` (E8) | idem |

Classes de desvio **previstas** (registradas no relatório final, nunca
silenciadas): (a) merge/rebase de `develop`; (b) iteração do `spec-validate`;
(c) errata de spec **depois** do red (precedente 017 R2a); (d) segunda edição
comentário-only de um julgador (017 R8a). `planning-state` está fora do registry —
commit de estado não pede repin. **`gen_pins.py` recusa qualquer pendência fora de
`pins.json`** (inclusive `??`): toda wave com repin é **serial**, e `[P]` só sobra
entre tarefas em que ninguém escreve arquivo.

## Boundary

**Classe mais alta tocada: produto 5.x + superfícies §29.4 — autorizadas.**

- `frozen` (engine, Camada 1, harness M41, snapshot): **zero linha**; payload M41
  byte-idêntico é critério herdado (`D019-MED1` + stage `m41`).
- `generated`: o HTML é reconstruído **só** pelo builder, no commit do módulo; o stage
  `build` prova identidade em diretório efêmero (R7 §3). `ui_icons_v32.js`: intocado.
- `legacy` (`MANIFEST.sha256`, REV A) e `registry` (`pins.json` só via `gen_pins`): intocados.
- `PROTECTED` de `tests_p50_core.js` (`:82-642`): **`ui_v32.js` (`:382`), `ui_ux_v32.js`
  (`:383`), `ui_session_v32.js` (`:550`)** — hashes hoje iguais a `pins.json:536/:534/:531`
  (conferido: `d9215fd6…`, `a0504011…`, `e1463eb7…`). Os três são repinados **inline**
  com trilha "Identidade anterior", medidos sobre `git show HEAD:<path>` (R2 §2), em
  commit próprio (precedente `0535775`, 022). `frozenSuites` (`:648-651`) só exige
  existência — `tests_session_m48.js` editada não o viola; é pinada em `pins.json:499`
  e alcançada pela prosa da §29.4 (*todas as suítes congeladas*).
- **Autorização §29.4, registrada e não assumida**: proprietário, no chat,
  2026-10-27, rodada 3 (`refinement.md:422`; planning-state `refinement.notes`):
  *"Autorizo os quatro (Recomendada)"* — `ui_session_v32.js`, `ui_ux_v32.js`,
  `tests_session_m48.js`, `ui_v32.js`, **só para a 025**, com repin e trilha nos pins
  inline. Este plano consome exatamente esses quatro. `ui_curation_v32.js`,
  `ui_curation_edit_v32.js`, `tests_019_curadoria.js`, `tests_025_*` e os docs são
  **pinados, não protegidos** (grep em `boundary.json` e em `PROTECTED` = 0).
- **Ponto de PARADA declarado**: se qualquer wave precisar de `tests_ux_m41.js`,
  `build_v32_html.py`, de um quinto arquivo da §29.4 ou de uma linha de engine, a
  execução **para** nessa tarefa e o orquestrador leva o rito (R6 §5 / D2) ao
  usuário — nunca se assume.

Precedência onde a prosa da REV B divergir do executável: regime de pins (R8;
`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2); divergência vira
achado, nunca edição de spec selada.

## Checklist R9 — por módulo tocado (nenhum módulo novo)

| Módulo | IIFE + `__installed` | bridge único registrado | CSS por prefixo | zero `innerHTML =` novo | ≤ 600 linhas | helper único |
|---|---|---|---|---|---|---|
| `ui_curation_v32.js` | sim (`:58-61`) | `__CURATION` (registrado); métodos novos, não bridge | n/a (zero CSS) | sim (hoje 0, continua 0) | 243 → ≈ 300 | **`validate`** nasce como o helper único da validade |
| `ui_curation_edit_v32.js` | sim | `__P53SOL`… não: `__P53CUR` (registrado); não ganha símbolo | n/a | sim (0 → 0) | 272 → ≈ 280 | consome `valido()` via `set`/`unset` |
| `ui_session_v32.js` | **legado 4.8** (sem IIFE; documentado, não licença; allowlist `LEGADOS_4X` do #113) | `__sesDecor`/`__P51SESMETA` (não tocados) | n/a | **nenhum novo** — `<li>` entra no template existente de `uxModal` | 760 → ≈ 780 (legado, acima do teto desde a 4.8 — registrado, não justificativa nova) | não duplica regra de validade (R9 §8): compõe o prefixo |
| `ui_ux_v32.js` | legado 4.1 (allowlist) | `__uxDecor`/`__QS_STAGE_RULER` (não tocados) | n/a | nenhum novo | 249 → ≈ 255 | — |
| `ui_v32.js` | monólito 4.x (fora do glob `ui_*_v32.js`) | `__V32UI` ganha dois métodos; `__DEV` não muda | n/a | **nenhum novo** (os 9 legados ficam) | 1713 → ≈ 1718 | — |

`lint-arch` **neste HEAD** varre só `ui_p5*`/`ui_d0*` (`check_lint_arch.py:37`); a
versão do #113 (lida de `origin/fix/EA-101-lint-arch-modulos-novos`) varre
`ui_*_v32.js` menos `LEGADOS_4X = {ui_ux, ui_target, ui_session, ui_refinement,
ui_journey, ui_icons}` — alcança `ui_curation_v32.js` e `ui_curation_edit_v32.js`,
que **hoje já cumprem** (IIFE presente, `innerHTML=` = 0). Ver W0.

## Tabela de gatilho de campanha — o que cada arquivo editado dispara, e onde fecha

Gatilho = `mutation_map.json → harnesses.<n>.targets` × `git diff --name-only
merge-base(HEAD, origin/develop) HEAD` (`check_mutation.py:830-833`). Hoje o diff da
branch (BACKLOG, README, docs_phase5, pins, planning-state, CONTEXT, specs/025) **não
casa alvo de nenhum harness** — nenhuma campanha dispara neste HEAD. Populações
medidas por `--preflight` em 2026-10-27 (todas `ok == total`); `core` não tem
preflight (3 mutantes contados no fonte).

| Arquivo editado (wave) | Campanhas disparadas | `requires` | Onde fecha | Custo estimado* |
|---|---|---|---|---|
| `ui_curation_v32.js` (W2) | **d019** (17), **d022** (13), **d023** (12) | node | local | d019 ≈ 16×13 s + 1×110 s (M11 roda m48) ≈ 5–6 min; d022 ≈ 3–4 min; d023 ≈ 3 min |
| `ui_session_v32.js` (W3) | **core** (3), **d019** | node | local | core: CM1 roda m48 (≈ 110 s) + 2 ≈ 4 min; d019 já disparada |
| `ui_ux_v32.js` (W4) | **nenhuma hoje** (só `ui_ux_v32.css` é alvo, d009) → passa a disparar **d025** quando registrada | node | local | 0 até W7 |
| `ui_curation_edit_v32.js` (W5) | **d019** | node | local | já disparada |
| `ui_v32.js` (W6) | **core, d009 (19), d010 (24), d015 (15), d019, d021 (8), d022, d023** + **p51 (19), p52 (108)** | node · **chromium** (p51, p52) | node: local; **p51/p52: só o job `visual` do CI** (`MUTATION_DEFER_MISSING=1` no job `verify` → `[DEFER]`; localmente `run.sh` completo acusa FAIL nomeado — KI-3, por desenho) | d009 ≈ 4 min; d010 ≈ 5 min; d015 ≈ 3 min; d021 ≈ 2 min + 1 (M9 roda p50core 51 s); p51/p52: CI |
| `tests_session_m48.js` (W1) | **d019** | node | local | já disparada |
| `tests_019_curadoria.js` (W6/E3) | **d019, d023** | node | local | já disparadas |
| `tests_p50_core.js` (W7, inline) | **d021** | node | local | já disparada |
| `USER_GUIDE.md` (W6/E6) | **p51** | chromium | **CI `visual`** | — |
| `SESSION_SCHEMA_V32.md`, `exemplo-completo.json`, `specs/019/spec.md`, `BACKLOG.md`, `bridges.json`, `expected_suites.json`, `mutation_map.json`, `mutation-matrix.json`, `pins.json`, `CONTEXT.md`, `specs/025/*` | nenhuma (conferido alvo a alvo; `d016` só alcança `.claude/verify/fecho*`, `branch_protection*`, `fixtures_016/**`, planning-states 015/016/999; `d018` só `check_mutation_coverage.py`/`mutation_population.json`) | — | — | 0 |
| `tests_025_*.js` (W1/W7) | **d025** (23) — a partir do registro | node, python | local | 18 mutantes × (3 s rebuild + ≈ 30–60 s suíte) + **5 × ≈ 110 s de m48** (M20, M6, M11, M12, M16) ≈ **20–25 min** |

\* Unidades **medidas** hoje: m48 107 s (heap 6144); `tests_019_curadoria.js` 10 s;
`tests_p50_core.js` 51 s; rebuild ≈ 3 s. A duração da suíte `d025` é estimativa
(≈ 25 janelas jsdom: AUS1 abre 4, INV8 e NOP1 várias) — **fixa-se por execução em W7**.
Totais por campanha são **a medir** na própria campanha (W7); os números acima
dimensionam a sessão, não a substituem.

**Custo das cinco execuções de m48 na campanha `d025`** (DEPENDÊNCIA 4b da Fase 1,
respondida): 5 × 107 s ≈ **9 min** só de m48, mais o rebuild por mutante; aceito —
é o preço de os quatro carrascos das reancoragens (M6, M11, M12, M16) serem
executados **contra o HTML mutado** pela campanha em vez de provados uma vez num
relatório (família `EA-28`). Alternativa recusada: um só mutante sob m48 e os outros
só sob a suíte `d025` — deixaria S30(b)/S31-S32(b)/S69(b) sem carrasco executável,
que é exatamente a tautologia que a 014 expôs.

**Soma local da sessão de fecho (W7), ordem de grandeza**: d025 ≈ 25 min + core ≈ 4 +
d019 ≈ 6 + d022 ≈ 4 + d023 ≈ 3 + d009 ≈ 4 + d010 ≈ 5 + d015 ≈ 3 + d021 ≈ 3 ≈ **1 h**
de campanhas node, mais m48 (107 s) e as 17 suítes do stage `suites`. p51 e p52
fecham no job `visual` do PR — a demanda **não se declara pronta** sem esse job verde.

## Waves

Dependência real dita a ordem: pré-condição de identidade antes do red (o SHA do red
é citado pelo `check_tdd` via `git cat-file -e` — um rebase posterior o invalidaria
no clone do CI); gate antes de implementação (R3 §4); contrato antes do consumidor
(`validate`/`unset` antes de `ui_session`/editor); docs antes da fixação de contagem
(DOC1 só fica verde com E4/E6); registro depois do green (R10 §3). **Toda wave que
carrega repin é serial**; `[P]` só onde ninguém escreve arquivo.

| Wave | Tarefas (resumo · dono · tipo) | Depende de |
|---|---|---|
| **W0 · pré-condições** | **W0.1** `chore` `build-engineer`: repin **R0** após o commit do `plan.md` (lista pela saída real do `check_baseline`, não só `specs/025`). **W0.2** `chore` **`usuário`** (ato humano, nunca `[P]`): mesclar **#112** e **#113** em `develop` (sem squash — R14). **W0.3** `chore` `build-engineer`: `git fetch` + **rebase** de `feature/025` sobre `origin/develop` (os commits do #112 saem por patch-id; conflito em `pins.json` resolve-se por `gen_pins.py` → **R0′**); conferir `git log origin/develop --oneline -3` contém #113 e `python .claude/verify/check_lint_arch.py` imprime `… módulos novos (ui_*_v32.js menos 6 legados 4.x)`. **W0.4** (Fase 3) `tasks.md` + **R0b** | portão da Fase 2 |
| **W1 · red** | **W1.1** `chore` `qa-engineer` `[P]`: **medir antes** — `--preflight` de core/d009/d010/d015/d019/d021/d022/d023 (`ocorrencias == 1` em todos: a régua das âncoras alheias). **W1.2** `feature` `qa-engineer`: `tests_025_curadoria_sessao.js` — 16 gates, fixtures `F-*`, `vac()`, três env; executar → esperado **1 PASS (GAT1) · 15 FAIL de 16**; **commit do red**; planning-state `red.status: proven` + SHA. **W1.3** `chore` `build-engineer`: **R1**. **W1.4** `fix` `qa-engineer`: `tests_session_m48.js` — S50(b), S69(b), S30(b), S31-S32 curada, linha `M48_HTML_OVERRIDE` em `:3`; executar → esperado **94 PASS · 3 FAIL de 97** (S50, S30, S31-S32 vermelhos; S69(b) **verde declarado**); commit. **W1.5** `chore`: **R2** | W0 (SHA do red estável) |
| **W2 · bridge** | **W2.1** `feature` `core-engineer`: `ui_curation_v32.js` — `validate` (precedência acima), `unset`, `unsetArchitectureNote`, `fromSession` revisto; **rebuild** no mesmo commit; green **parcial** medido com `D025_ONLY=D025-VAL2,D025-CAN1,D025-UNS1` (VAL2(a)(b)(d), CAN1 `validate`-alíneas, UNS1(e)); `node tests_019_mutants.js --preflight` continua 17/17 `ok`. **W2.2** `chore`: **R3** | W1 |
| **W3 · sessão** | **W3.1** `feature` `core-engineer`: `ui_session_v32.js` (tabela *onde cada linha entra*); rebuild no mesmo commit; green esperado: VAL1, VAL2(c), CAN1, TRX1, TRX2, AUS1, INV8, NOP1, TRN1, PRV1, GAT1 + m48 **S50, S30** (S31-S32 ainda vermelho); `--preflight` de `core` (3) e `d019` intactos. **W3.2** `chore`: **R4** | W2 |
| **W4 · ciclo de vida** | **W4.1** `feature` `core-engineer`: `ui_ux_v32.js` — `clear()`/`discardDraft()` guardados em `uxNewSession`/`uxResetAssessment`, texto `:55`; `grep "Respostas, observa" tests_*.js tests_visual/` = 0 antes do commit; rebuild; green: NEW1, RST1, m48 **S31-S32** → m48 **97/97**; `tests_ux_m41.js` **56/56** (UX21 intacto). **W4.2** `chore`: **R5** | W2 (independe de W3; serial pelo repin) |
| **W5 · editor** | **W5.1** `feature` `ui-engineer`: `ui_curation_edit_v32.js` — tabela fechada do handler; rebuild; green: UNS1(a)(b)(c)(d); `d019` 14/14. **W5.2** `chore`: **R6** | W2 (`unset`) |
| **W6 · `draft` — severável** | **W6.1** `feature` `core-engineer`: `ui_v32.js` — `discardDraft`/`hasDraft` em `__V32UI` (`:1688`); rebuild; green: **TRN2** (a)(b)(c); `p50core` fica **63/65** (P50-GOV1 + P50-IC4 leem `PROTECTED["ui_v32.js"]`) até W7. **W6.2** `chore`: **R7**. **Se o usuário cortar P5-draft**: E0 na W0 (antes do red), `tasks.md` consolidado, M15 aposentado, `ui_v32.js` sai de `targets`, R7 não existe; nada mais se move | W2–W5 concluídas (último conteúdo de produto: o corte é truncamento puro) |
| **W7 · docs e erratas da 019** | **W7.1** `doc` `doc-writer`: `SESSION_SCHEMA_V32.md` (E4) + `exemplo-completo.json` (E5), um commit; m48 S79–S82/S109/S110 verdes **na cópia** (`D025_DOC_OVERRIDE`) e na árvore; **R8**. **W7.2** `doc` `doc-writer`: `USER_GUIDE.md` §11 (E6) — abre pela definição do verbete (`CONTEXT.md:210`), sem a palavra do papel; `P51-DOC*` verdes; dispara **p51** (CI); **R9**. **W7.3** `doc` `doc-writer`: `specs/019-…/spec.md` E1/E2 (molde 009; célula do critério amendada; seções de ratificação intactas; prova de aditividade por `difflib` sobre blobs, nunca `grep` do diff); **R10**. **W7.4** `doc` `qa-engineer`: `tests_019_curadoria.js:219` E3 (título + comentário; `d019` 14/14; hunk único; `--preflight` d019 17/17); **R11** | W1 (E4–E6 não dependem de código, mas DOC1 fecha aqui); W6 para E3 só por ordem serial |
| **W8 · fecho de identidade e registro** | **W8.1** `chore` `build-engineer`: `tests_p50_core.js` — três valores inline, trilha "Identidade anterior" ×3 medida por `git show HEAD:<path>`, autorização citada no próprio pin (precedente `0535775`); `p50core` **65/65**; **R12**. **W8.2** `chore` `build-engineer`: `bridges.json` E7; `lint-arch` verde; **R13**. **W8.3** `chore` `qa-engineer`: **`tests_025_mutants.js`** (23 mutantes, `--preflight` 23/23 `ok`, três estados, M20/M6/M11/M12/M16 sob m48 com `M48_HTML_OVERRIDE`, heap 6144, `skipBuild` só no M20) + `mutation_map.json → harnesses.d025` (`targets`: as duas suítes 025, `tests_session_m48.js`, os **cinco** módulos; `insumos.oraculo`: `tests_025_curadoria_sessao.js`; `requires: node, python`; `preflight: true`) + `expected_suites.json` (`suites.d025` **fixado por execução** — 16, ou 15 sem TRN2; `heavy.session` **97 refixado por execução**) + `mutation-matrix.json` (23 pares + `ultima_prova` das campanhas re-executadas) — **um commit** (D4 da 013); campanha `d025` **23/23 KILL** e as campanhas disparadas (core, d019, d021, d022, d023, d009, d010, d015) re-executadas; **R14** | W2–W7 (todos os verdes; anchors existem) |
| **W9 · validação** | **W9.1** `doc` `qa-engineer`: `spec-validate` (16 critérios + erratas + reancoragens + registros); **R15**. **W9.2** `[P]` **`product-owner`**: aceite de intenção (lê; não escreve). **W9.3** `doc` `doc-writer`: `relatorio-final.md` + `BACKLOG.md` E8 (EA-91, 92, 105…114 `corrigido pela 025`; EA-110 com a decisão P3 citada; EA-115 `aberto`, baixa); **R16**. **W9.4** `chore` orquestrador: planning-state `validate → done`, `pr_url` **antes** do merge (precedente `cdc8c0f`/`36c5774`, 023); PR `feature/025 → develop`; job `visual` verde (p51/p52) é condição de "pronto". Merge é do usuário | W8 |

**O que roda em paralelo na mesma mensagem**: W1.1 (medição, sem escrita) com
qualquer leitura; W9.2 (PO, só lê) com W9.1 **ou** W9.3 (um escritor por vez). **Nada
mais é `[P]`**: W4/W5/W6 são módulos distintos sem dependência entre si, mas o
`gen_pins.py` recusa pendência alheia (`:72-79`) — dois escritores na mesma worktree
tornam "um repin por commit de conteúdo" mecanicamente impossível (017: reset +
cherry-pick para desfundir). A delegação diz "commit, volte, repin, próxima".

### Quando o harness de mutantes nasce — e por que não no red

As âncoras (`find:`) dos 23 mutantes são **strings do código que ainda não existe**
(M1: a chamada a `validate` em `:240`; M7: a posição do snapshot; M22: a guarda
removida; M13: o texto novo de `:55`…). O contrato do `--preflight` exige
`ocorrencias == 1` **antes** de qualquer mutação (013 C1/C2; `tests_019_mutants.js:
329-360`), e D4 da 013 exige a chave `preflight` no mesmo commit em que o harness a
lê. Um harness no red teria 22 de 23 âncoras `nao_executavel` — e a única executável
(M20) muta um arquivo do próprio QA. Por isso o harness nasce em **W8.3**, depois do
green, como fizeram 019 (T022), 021, 022 e 023. O que viaja no red e no prompt dos
implementadores é a **tabela estado-do-mundo** (M1…M23 da spec, uma linha por
mutante: o que muta, qual alínea reprova, mensagem esperada) — `tasks.md` §"O estado
do mundo que reprova cada gate". Divergência do brief (que previa mutantes em W1):
declarada em DEPENDÊNCIAS para decisão do orquestrador.

### R3 §2 quando gate e mudança se cruzam

- `tests_session_m48.js`: **um autor (QA), um commit (W1.4)**; nenhum commit toca o
  arquivo depois do red. Os greens de S50/S30/S31-S32 vêm de `ui_session`/`ui_ux`,
  por outro agente, em outro arquivo (modelo 017).
- `tests_p50_core.js`: o único toque é o **valor** inline (W8.1, `build-engineer`),
  nunca a asserção — precedente de toda reancoragem §29.4.
- `tests_019_curadoria.js`: E3 é **título e comentário**; corpo byte-idêntico
  (prova: diff restrito ao hunk de `:219` e ao bloco de comentário; `d019` 14/14;
  `D019-M3` continua KILL).

### Janela vermelha — commit → veredito esperado

Inevitável (R3 §4) e **vive só na branch**: `develop` recebe o merge inteiro; o
hook Stop roda `--light --no-mutate` (sem `suites`, `suites-heavy`, `mutation`,
`evidence-bridge`) e **vê `build`**, que fica verde porque o HTML viaja no commit do
módulo; o CI só roda em `pull_request`/`push` para `develop`/`main` — o PR abre
**depois** do green (W9.4).

| Após o commit de | `baseline` | `suites` (17) | `suites-heavy` (m48) | `p50core` | `mutation` (local) | `lint-arch`/`build`/`boundary`/`tdd` |
|---|---|---|---|---|---|---|
| hoje (`520f20d`) | **FAIL** 1 div + 2 sem pin | verde | 97/97 | 65/65 | nada dispara | verde |
| R0 / rebase + R0′ | verde | verde | 97/97 | 65/65 | nada | verde (lint com #113) |
| W1.2 red (+R1) | verde após R1 | verde (`d025` **não registrada** → não roda) | 97/97 | 65/65 | nada | `tdd` verde (`red.commit` existe) |
| W1.4 m48 (+R2) | verde após R2 | verde | **94/97** (S50, S30, S31-S32) | 65/65 | `d019` exigida (alvo `tests_session_m48.js`) → roda, 17/17 KILL | verde |
| W2 curation (+R3) | idem | verde | 94/97 | 65/65 | d019, d022, d023 | verde |
| W3 session (+R4) | idem | verde | **96/97** (S31-S32) | **64/65** (P50-GOV1) | + core | verde |
| W4 ux (+R5) | idem | verde | **97/97** | 64/65 | idem | verde |
| W5 editor (+R6) | idem | verde | 97/97 | 64/65 | idem | verde |
| W6 ui_v32 (+R7) | idem | verde | 97/97 | **63/65** (GOV1 + IC4) | + d009, d010, d015, d021; **p51/p52 FAIL nomeado "requires chromium"** (KI-3) — fecha no CI | verde |
| W7 docs (+R8–R11) | idem | verde | 97/97 | 63/65 | + p51 (`USER_GUIDE.md`) → CI | verde |
| W8.1 inline (+R12) | idem | verde | 97/97 | **65/65** | idem | verde |
| W8.3 registro (+R14) | idem | **18 suítes**, `d025` 16/16 | 97/97 refixado | 65/65 | d025 23/23 + re-execuções | verde; `mutation-coverage` inalterado (população = `check_*.py`) |
| W9 | verde | verde | verde | verde | local: tudo node verde; p51/p52 só CI | `fecho`: FECHO PENDENTE até `done` (sinal próprio, por desenho) |

Os números de W1 são **esperados** e viram **medidos** no commit do red; divergência
é declarada, nunca ajustada (R10 §1: a contagem canônica nunca é rebaixada durante
o vermelho — precedente d009/d010/d011/d015).

## Riscos e rollback

| Risco | Como se detecta | Como se reverte / mitiga |
|---|---|---|
| **S50 reprova de propósito** (W1.4 → W3) e alguém "conserta" a m48 em vez do produto | `heavy.session` 94/97 com S50 nomeado; o único commit em `tests_session_m48.js` é o red | R10 §1: nenhuma asserção da m48 muda depois de W1.4; o green é de `ui_session` |
| **UX21 não deve reprovar** (texto de Nova sessão pinado em `tests_ux_m41.js:203`) | `tests_ux_m41.js` 56/56 após W4 (medível na própria tarefa) | `:61` não é tocado; `grep` do literal antes do commit de W4 |
| **P50-GOV1/P50-IC4 vermelhos** entre W3 e W8.1 | `p50core` 64/65 → 63/65, nomeando `ui_session_v32.js`/`ui_v32.js` | janela prevista; fecha com o repin inline (W8.1) — só os **três** que divergirem (conferir os 15 de `PROTECTED` um a um antes de repinar; 015 repinou 1 de 15) |
| **Payload M41 muda** | stage `m41` + `D019-MED1` | não há rota: engine zero linha; se acontecer, a demanda **para** (C5 da 019) |
| **Campanhas Chromium** (p51 por `ui_v32.js` e `USER_GUIDE.md`; p52 por `ui_v32.js`) | `run.sh` local acusa `requires chromium` em W6/W7; CI `verify` → `[DEFER]`; CI `visual` executa | por desenho (KI-3); a demanda não se declara pronta sem o job `visual` do PR verde; rollback = reverter W6 (severável) não elimina p51 (USER_GUIDE) |
| **Tocar `ui_curation_v32.js` antes do #113 na develop** | o lint deste HEAD não o varre; o do #113 varre | W0.2/W0.3 **antes** de W2; se o usuário não mesclar, fallback **declarado**: `python <(git show origin/fix/EA-101-lint-arch-modulos-novos:.claude/verify/check_lint_arch.py)` em cópia, medido na tarefa W2.1 — nunca "confere depois" |
| **Rebase depois do red** invalida `red.commit` no clone do CI (`check_tdd.py:32`) | stage `tdd` FAIL no CI | W0.3 antes de W1; se a ordem for invertida por decisão do orquestrador, o commit do rebase atualiza `red.commit` no planning-state **no mesmo commit**, desvio classe (a) no relatório |
| **Conflito em `pins.json` no rebase** (#112 e #113 têm repins) | `git rebase` para | regenerar com `gen_pins.py` (R0′), nunca editar à mão; se #112 for squashed (contra R14), tomar a versão da `develop` para BACKLOG/README/docs |
| **Heap da m48** (6144 já é o limite medido em 2026-09-22; S30(b)/S31-S32 abrem janelas a mais) | `Ineffective mark-compacts` no red | medir em W1.4; se estourar, as alíneas novas **fecham a janela** (`w.close()`) em vez de subir o heap — subir heap é último recurso e vai declarado na `_trilha` |
| **Âncoras de mutantes alheios movidas** (`EA-4`): `CM1` em `:231`, `D019-M3` em `:76`, `D019-M10` em `editor:65`, `P52` em `ui_v32.js:1587`, os 108 do p52 | `--preflight` de cada harness afetado **antes e depois** de cada wave (W1.1 régua; cada tarefa de produto repete) | editar fora das linhas-âncora; se uma âncora tiver de mover, é reancoragem do harness alheio, declarada, pelo QA, em commit próprio |
| **Gate instrumenta o bridge e a implementação captura referência** | TRX2(a)/(b) e VAL1 medem 0 chamadas onde deveria haver ≥ 1 | contrato de instrumentabilidade acima, no prompt de W3/W4 |
| **`hasDraft()` nascer muda o workspace 5.2** | `p52chromium` (CI) | grep hoje: 0 chamadores — só a citação em comentário; se o CI acusar, W6 é severável |
| **Suíte `d025` lenta** (muitas janelas jsdom) | duração medida em W1.2 | agrupar janelas por gate; `w.close()`; o número entra na `_trilha` de `d025` |
| **O usuário corta P5-draft** | decisão no portão | E0 em W0 (antes do red); `tasks.md` consolidado no mesmo commit; M15 aposentado; `ui_v32.js` sai de targets/repins/E7; autorização §29.4 fica sem uso, não revogada |

Rollback por wave: cada wave de produto é **um commit de módulo + HTML** seguido de
um repin — `git revert` dos dois devolve a identidade anterior; W6 é severável por
construção; W1 (gates) nunca se reverte para passar.

## Protótipo

Dois itens que **só código responde**, cada um em branch descartável a partir do HEAD
da `feature/025` (nunca vira produção; o aprendizado entra aqui como nota
`*(Protótipo …)*` e o QA escreve o gate dele a partir da spec — R3 §2). **Não
executados nesta fase**; propostos para a abertura da W1, pelo `qa-engineer`.

### P1 · `prototype/025-seletor-file-text` — o caminho real do seletor sob jsdom

**Pergunta exata**: na janela `boot()` com resultados, clicar `#ses-import` (que
chama `openImportPicker(e.currentTarget)` — a função **não** está em `__DEV`, e o
plano **não** a expõe: o botão é o caminho público), localizar
`input[type=file][aria-label="Selecionar arquivo de sessão"]` no `body`, atribuir
`Object.defineProperty(input, "files", { value: [new w.File([json], "f.json",
{ type: "application/json" })] })`, despachar `new w.Event("change")` e **aguardar**
— o `onchange` real (`await f.text()` → `validateSessionDocument` →
`sessionCompatibility` → `showImportPreview`) chega a `#ux-modal`? Em quantos ticks
(`await Promise.resolve()` ×n · `setTimeout(0)`)?

**Critério de resposta**: SIM se `#ux-modal` existe com `Importar sessão` no título
após ≤ 3 ticks e o contador de escritas do bridge marca 0; NÃO se `f.text()` rejeita
ou `input.files[0]` é `undefined`. Leitura prévia (não execução): jsdom **30.0.1**
implementa `Blob.prototype.text()` (`node_modules/jsdom/lib/jsdom/living/file-api/
Blob-impl.js:85`) — o risco residual é a atribuição de `files` e o número de ticks.
**Se NÃO**: fallback **sem tocar produto** — `file.text = () => Promise.resolve(json)`
como propriedade da instância (o `onchange` real continua a ser o caminho); o
protótipo mede qual dos dois. Expor `openImportPicker` em `__DEV` fica como última
opção, declarada, porque é edição de produto para fins de teste.

### P2 · `prototype/025-falha-sintetica-fromsession` — "aplica e lança uma vez"

**Pergunta exata**: substituir `w.__CURATION.fromSession` por um embrulho que
`(1)` chama o original (aplica), `(2)` restaura `w.__CURATION.fromSession = original`,
`(3)` lança — é **visível** pelo chamador? Hoje, sem a W3, o caminho que chama
`fromSession` é `validateSessionDocument(:240)` e `restoreCanonicalOwners(:602)`:
o protótipo mede (a) que `validateSessionDocument(F-A)` passa pelo embrulho
(prova "propriedade lida na chamada"), (b) que `restoreCanonicalOwners(snap)` passa
pelo embrulho e, com o embrulho já restaurado, a segunda chamada vai ao original —
é exatamente a mecânica que TRX2(b)/(b′) usarão sobre o `commit` da W3.

**Critério de resposta**: SIM se o contador do embrulho marca 1 em (a) e 1 em (b) e,
após (b), `state()` é o do `snap`; NÃO se o contador fica 0 (referência capturada
em algum lugar — então o contrato de instrumentabilidade vai como asserção para o
prompt de W3) ou se a propriedade não é gravável (então o plano para e revê a
hipótese "objeto literal"). Mede-se também o caso (b′): `snap.curadoria === undefined`
hoje **não** chega ao bridge (guarda `:602`) — é a contrafactual medida que M22
reintroduz, registrada como número, não como raciocínio.

Ambos: clone/worktree efêmero com `refs/remotes/origin/develop` pinado no HEAD do
clone (nenhuma campanha dispara), sem escrita na árvore rastreada, `git status`
limpo ao fim.
