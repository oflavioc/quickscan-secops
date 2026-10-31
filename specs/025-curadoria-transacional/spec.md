# Spec — 025-curadoria-transacional

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md), não o repete.
>
> **Quem escreveu**: o `tech-lead`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-10-27, sob delegação do orquestrador, na worktree
> `phase5-sel` (branch `feature/025-curadoria-transacional`, HEAD `d695dbb`).
> Tudo o que está citado como `arquivo:linha` foi **lido por mim nesse HEAD**;
> nada foi executado além de leitura (`git`, `grep`, `sed`, um `node -e` que só
> interroga a versão do jsdom e um `python` que só calcula SHA-256 de blobs).
>
> **Esta spec não reabre decisões.** P1–P6 foram aprovadas em bloco pelo usuário
> no chat em 2026-10-27 (`refinement.md:421`, rodada 2) e a autorização nominal
> §29.4 para `ui_session_v32.js`, `ui_ux_v32.js`, `tests_session_m48.js` e
> `ui_v32.js` foi dada na mesma data (`refinement.md:422`, rodada 3; planning-state
> `refinement.notes`). Aqui elas viram critérios, gates e contratos.

## Objetivo

Fazer a **importação de sessão ser substitutiva e atômica também para a curadoria
do relatório** — validar sem aplicar, snapshot antes de qualquer escrita, candidato
com a sexta chave inclusive quando ausente, commit dentro da transação — e ligar a
curadoria ao ciclo de vida da sessão (Exportar, Nova sessão, Reiniciar, editor,
prévia), com gates que **importam de verdade**. Link: [refinement.md](refinement.md).

Vocabulário desta spec: *Curadoria do relatório* (`CONTEXT.md:210-221`),
*Importação substitutiva* (`CONTEXT.md:233-244`), *Supressão pela curadoria*
(`CONTEXT.md:224-231`). Os textos novos de produto **evitam a palavra do papel**
(facilitador/operador/engenheiro — `refinement.md:409-414`). [PO 2026-10-27]
*Validação pura* / *aplicador*, *candidato*, *snapshot*/*rollback* e *transiente*
são **vocabulário interno** desta spec e do plano (contrato de bridge, R9 §3/§5),
classificados assim no `refinement.md:403-407` e **não registrados** no
`CONTEXT.md` (grep `pura|puro` = 0): são propriedade de função, não conceito que o
facilitador ou o leitor do relatório encontre; a propriedade visível ao usuário já
está absorvida pelo verbete *Importação substitutiva* ("olhar um arquivo … deixa a
janela igual à anterior").

## Critérios de aceite → gates

Namespace **`D025-*`**. Suíte nova **`tests_025_curadoria_sessao.js`** (jsdom, sem
Chromium; mesmo padrão de `tests_019_curadoria.js:50-125`: `T()`, `vac()` para
falha nomeada por vacuidade, `boot(opts)` sobre o HTML construído, variáveis
`D025_HTML_OVERRIDE`, `D025_ONLY` e **`D025_DOC_OVERRIDE`** — esta última um
diretório de onde as alíneas documentais leem `SESSION_SCHEMA_V32.md`/
`USER_GUIDE.md`, para que o harness mute cópias, nunca a árvore — R7 §3).
Harness de mutação **`tests_025_mutants.js`** (runner no padrão de
`tests_019_mutants.js:272-360`: mutação em cópia, rebuild em `os.tmpdir`,
`--preflight` com `ocorrencias == 1`, três estados). Chave **`d025`** em
`expected_suites.json → suites` e em `mutation_map.json → harnesses`, **no mesmo
PR**, na wave de fecho, depois do green (R10 §3; errata E2 da 019,
`specs/019-curadoria-do-relatorio/spec.md:24-36`: o registro é oráculo de contagem
VERDE). `heavy.session` permanece **97** — as reancoragens acrescentam alíneas,
não gates — e é **refixado por execução**.

Oráculos **independentes da implementação**, usados por todos os gates abaixo
(nenhum lê o fonte de `ui_session_v32.js`; S69(a) é a exceção herdada):

- `window.__CURATION.state()`, `.contract()`, `.published()`, `.offered()`,
  `.toSession()`;
- `w.__DEV.captureCanonicalInputs()` serializado, comparado **entre janelas**;
- tela: cards `#p52-workspace #p52-sec-support > .apoio-block[data-p53-sol-produto]`,
  checkboxes `.p53-cur-check` (mapa id→checked com o painel aberto) e o aviso
  `[data-p53-suprimido]`;
- papel: `#v32-print-report` **após `beforeprint`** (evento real despachado na
  janela; corpo sem `#pr-cover`, que carrega datas — precedente S37,
  `tests_session_m48.js:343-367`);
- contador de chamadas ao bridge: `fromSession`, `set`, `clear`, `unset`,
  `setArchitectureNote`, `unsetArchitectureNote` (escritas) e `toSession`
  (leitura usada pelo snapshot), embrulhados pelo gate na janela sob teste.

Chamo de **assinatura(w)** a concatenação JSON de `state()` + `contract()` +
`captureCanonicalInputs()` + mapa de checkboxes + atributo do aviso + corpo do
papel. Dois estados são "byte-iguais" quando as assinaturas coincidem.

**Fixtures** (todas construídas na própria suíte; nenhuma sessão real — R11):
sessão de referência = `boot()` nível 0 com `PRIOS` (`tests_019_curadoria.js:69-108`,
≥ 9 produtos ofertados); *curadoria A* = `exclude` em `offered()[0]`, `include` em
`catalog()` ∖ `offered()` `[0]` (inclusão sem lastro), `architectureNote:"exclude"`;
*curadoria B* = `exclude` em `offered()[1]`, sem `architectureNote` (disjunta de A);
documentos: `F-A`, `F-B` (exportados de janelas com A e B), `F-0` (mesmo conteúdo,
**sem** `reportCuration`), `F-null`/`F-vazio`/`F-dec-vazio`/`F-dec-vazio-arch`
(formas não canônicas de P1), `F-arch` (`{architectureNote:"exclude"}` só),
`F-inv-id`/`F-inv-enum`/`F-inv-tipo` (curadoria inválida), `F-extra` (`F-A` com
`reportCuration.observacao = "x"` — chave desconhecida **dentro** do bloco, nem
proibida nem derivada [PO 2026-10-27]), `F-tardio` (`F-A` com
`operationalRefinement.answers["ref-hunting"]=99`, erro no último bloco validado —
`tests_session_m48.js:286`), `F-engine` (`F-A` com `engineSha256` trocado),
`F-insuf` (≤ 9 respostas + curadoria A).

| # | Critério | Gate · arquivo · asserção | Mutante previsto |
|---|---|---|---|
| C1 | **Validar não aplica — nos três chamadores.** Selecionar arquivo, abrir a prévia, cancelar, apertar Escape e **exportar** deixam o owner intocado | `D025-VAL1` · `tests_025_curadoria_sessao.js` · janela com curadoria B; (a) `validateSessionDocument(F-A)` → `ok:true`, **0** escritas no bridge, `state()` idêntico; (b) caminho real do seletor: `openImportPicker(origin)`, `input[type=file][aria-label="Selecionar arquivo de sessão"]` recebe `File` sintético com `F-A` e o `onchange` real é aguardado → prévia aberta em `#ux-modal`, **0** escritas; `#ux-modal-cancel` → 0 escritas; de novo com Escape (`keydown` na `document`, `ui_ux_v32.js:41`) → 0 escritas; assinatura byte-igual à inicial em todos os pontos; (c) `prepareSessionExport("x")` com curadoria A declarada → `ok:true`, **0** escritas, `JSON.stringify(state())` idêntico antes/depois (`EA-105`); (d) negativo: `importSessionDocument(F-A)` confirmado escreve **≥ 1** vez — prova que o contador enxerga escrita | **M1** · `ui_session_v32.js` · reintroduzir `fromSession` no validador (o produto de hoje, `:240`) ⇒ VAL1 vermelho em (a)/(b)/(c) |
| C2 | **O bridge valida sem tocar o estado**, e `fromSession` inválido não apaga a seleção (sub-caso E do `EA-91`) | `D025-VAL2` · idem · (a) `validate(F-inv-id.reportCuration)` devolve lista não vazia cuja mensagem **nomeia o campo** (`decisions: id fora do catálogo: …`); `state()` byte-igual; idem para `F-inv-enum` (`valor fora do enum fechado`) e `F-inv-tipo` (`decisions não é objeto`); (b) `fromSession(inválido)` devolve **as mesmas** mensagens e `state()` byte-igual — o aplicador recusa **antes** de zerar; (c) `importSessionDocument(F-inv-*)` → `ok:false`, `error` começa por `Curadoria inválida: `, assinatura byte-igual; (d) positivo: `validate(F-A.reportCuration)` → `[]` e `state()` ainda byte-igual (validar válido também não aplica) | **M2** · `ui_curation_v32.js` · `daSessao` zera o estado **antes** de validar (o produto de hoje, `:188`) ⇒ VAL2(b)/(c) vermelhos |
| C3 | **Forma canônica de "sem curadoria" é a ausência da chave** (P1). `null`, `{}`, `{decisions:{}}` e `decisions` sem chaves são recusados com mensagem; `{architectureNote:"exclude"}` é válido. [PO 2026-10-27] **Sub-caso: chave desconhecida dentro de `reportCuration` é recusada nomeando-a** — a mesma estritez que o schema v1 aplica à raiz (`:224-225`), a `inputs` (`:229-230`), ao assessment (`:246-247`), ao contexto (`:283`), à capability (`:300`) e à solution (`:310-311`); `reportCuration` era a única estrutura do documento que tolerava chave desconhecida em silêncio (`hasForbiddenKeys`/`hasReservedDerived` já recusam, por recursão, as proibidas e as derivadas — o vão era só o resto) | `D025-CAN1` · idem · janela com curadoria A; para cada um de `F-null`, `F-vazio`, `F-dec-vazio`, `F-dec-vazio-arch`: `validate(...)` não vazio **e** `importSessionDocument(...)` → `ok:false`, `error` contém `ausência da chave` ou `ausência do campo`, assinatura byte-igual (curadoria A **permanece**); [PO 2026-10-27] `F-extra`: `validate(...)` não vazio com mensagem que contém `não reconhecid` **e** o nome da chave (`observacao`), `importSessionDocument(F-extra)` → `ok:false`, assinatura byte-igual; `F-arch` → `ok:true`, `state().architectureNote==="exclude"`, `decisions` vazio, `published()==offered()`; controle: `F-0` → `ok:true` (ausência continua legítima) | **M3** · `ui_curation_v32.js` · `validate` aceita `{}`/`{decisions:{}}`/`null` como "vazio" (direção inversa de P1) ⇒ CAN1 vermelho; [PO 2026-10-27] **M23** · `ui_curation_v32.js` · `validate` ignora chave desconhecida (o produto de hoje, `daSessao` lê só `decisions`/`architectureNote`) ⇒ CAN1 (`F-extra`) vermelho |
| C4 | **A curadoria entra no candidato e no commit — inclusive a ausência.** | `D025-TRX1` · idem · (a) `normalizeSessionDocument(F-A)` devolve `cand` com a chave **`curadoria`** presente (`hasOwnProperty`) e **deep-igual** a `F-A.inputs.reportCuration`, sem tocar o estado (assinatura byte-igual, padrão S50); (b) `normalizeSessionDocument(F-0)` devolve `cand` com `curadoria` **presente e `undefined`**; (c) `commitCanonicalOwners(cand de F-A)` em janela com B → `{ok:true}` e `state()` deep-igual a A; (d) `commitCanonicalOwners(cand de F-0)` em janela com A → `state()` vazio, `toSession()===undefined` | **M4** · `ui_session_v32.js` · `curadoria` fora do candidato (lista de 10 de hoje, `:533-541`) ⇒ TRX1(a)/(b) vermelhos; e o commit sem a escrita ⇒ (c)/(d) vermelhos |
| C5 | **Snapshot antes de qualquer escrita; falha no commit devolve a SESSÃO, não o arquivo.** | `D025-TRX2` · idem · janela com curadoria B e assinatura `pre`; (a) **ordem**: com o bridge instrumentado, em `importSessionDocument(F-A)` a primeira escrita (`fromSession`/`set`/`clear`) ocorre **depois** de ao menos uma leitura `toSession` (a do snapshot) — e nenhuma escrita ocorre durante `validateSessionDocument` + `normalizeSessionDocument` (caso 13); (b) **falha após a escrita da curadoria**: `fromSession` embrulhado aplica e **lança uma vez** (restaurando-se antes de lançar, padrão `tests_session_m48.js:688-691`) → `commitCanonicalOwners(cand de F-A)` devolve `{ok:false, rolledBack:true}`, `state()` deep-igual a **B** (não a A), assinatura byte-igual a `pre`; [PO 2026-10-27] **(b′) a mesma falha em janela com "nada declarado"** (`toSession()===undefined` antes): rollback ⇒ `toSession()===undefined` e `state().decisions` vazio — é o único caso em que `snap.curadoria` é `undefined`, e é o que a guarda `&& snap.curadoria` de hoje (`:602`) faria **falhar**: sem (b′), um mutante que a reintroduza sobrevive a (b) e a S69(b), onde o snapshot é sempre truthy; (c) **falha antes da curadoria**: `Set.prototype.clear` lança (S62+S68) → mesmo veredito; (d) o mesmo documento, sem patch, importa com `ok:true` e `state()` igual a A — o patch não contaminou a janela | **M6** · `ui_session_v32.js` · mutB: snapshot com `curadoria: null` e restore sem `fromSession` ⇒ TRX2(b) vermelho; **M7** · idem · `snapshotCanonicalOwners()` movido para **depois** da primeira escrita ⇒ TRX2(a) e (b) vermelhos; **M8** · idem · `fromSession(cand.curadoria)` **fora** do `try` (antes do snapshot) ⇒ TRX2(a)/(b) vermelhos; [PO 2026-10-27] **M22** · idem · reintroduzir a guarda `&& snap.curadoria` em `restoreCanonicalOwners` ⇒ TRX2(b′) vermelho (TRX2(b) e S69(b) **sobrevivem** a M22 — por isso (b′) existe) |
| C6 | **Ausência substitui.** O mesmo arquivo sem a chave produz, sobre três estados prévios distintos, o estado de um DOM virgem — tela, papel e export | `D025-AUS1` · idem · quatro janelas: virgem, com `exclude` em ofertado, com `include` explícito sem lastro, com `architectureNote:"exclude"`; em cada uma `importSessionDocument(F-0)` → `ok:true`; (a) `state()` vazio e `toSession()===undefined` nas quatro; (b) `published()` deep-igual a `offered()` e **ausência** de `[data-p53-suprimido]`; (c) contagem e ids dos cards da tela iguais nas quatro (≥ 9 — vacuidade nomeada); (d) corpo do papel após `beforeprint` **idêntico** nas quatro; (e) `captureCanonicalInputs()` **sem** `reportCuration` nas quatro e idêntico entre elas | **M5** · `ui_curation_v32.js` · mutC: `daSessao` devolve `[]` sem aplicar (a importação nunca restaura nem limpa) ⇒ AUS1(a) vermelho nas janelas sujas |
| C7 | **Roundtrip de identidade: substituição, nunca merge.** *(Errata E9 · [PO 2026-10-30]: a célula "Nascem vermelhos" abaixo listava INV8(b)(c)(d); o red mediu INV8 vermelho **só por (d)** — (a)(b)(c) nascem verdes, declarados; poder: (a) M4, (b) M9, (c) idempotência **sem carrasco** — ver §Erratas tardias)* | `D025-INV8` · idem · (a) **DOM novo**: `F-A` importado em `boot()` → `captureCanonicalInputs()` JSON-idêntico ao da janela de origem, `contract()` e `published()` deep-iguais, papel idêntico; inclui `architectureNote:"exclude"` e a inclusão sem lastro, que aparece **sinalizada** no editor (`[data-p53-cur-sem-lastro]`) e **rotulada** no papel (`[data-p53-prov="operador"]`) — caso 17, inalterado; (b) **janela suja**: `F-A` importado sobre curadoria B → `state()` deep-igual a A e `state().decisions` **sem** nenhuma chave de B; (c) **idempotência**: `F-A` importado duas vezes seguidas → assinaturas idênticas após a 1ª e a 2ª; (d) o exemplo publicado `synthetic_session_examples/exemplo-completo.json` declara `reportCuration`, importa com `ok:true` e `state()` deep-igual ao declarado (liga a tarefa `doc` a uma máquina) | **M9** · `ui_curation_v32.js` · mutD: `daSessao` sem o reset do estado (merge em vez de substituição) ⇒ INV8(b) vermelho |
| C8 | **Sem efeito**: cancelar, Escape, erro posterior ao bloco da curadoria, engine incompatível e curadoria inválida deixam a janela byte-igual | `D025-NOP1` · idem · janela com curadoria B e painel aberto; assinatura `pre`; para cada um de `F-tardio` (`ok:false`, erro de hoje, `Resposta inválida`/aprofundamento *(Errata E10 · [PO 2026-10-30]: o literal do produto é `Valor de aprofundamento inválido: ref-hunting`, `ui_session_v32.js:493`; o gate assere só `/aprofundamento/` — ver §Erratas tardias)*), `F-engine` (`importSessionDocument` → `ok:false` com `compat`; seletor → modal `Importação bloqueada`), `F-inv-id`, e para Cancelar/Escape sobre `F-A` pela prévia real: assinatura **byte-igual** a `pre` — `state()`, checkboxes, aviso, papel, inputs; (b) S29-like: o `bad` vem de **outra** janela (curadoria A) e também na versão sem a chave | **M10** · `ui_session_v32.js` · `importSessionDocument` aplica a curadoria **antes** de `sessionCompatibility` ⇒ NOP1 (`F-engine`) vermelho |
| C9 | **Nova sessão limpa a curadoria** (`EA-92`); cancelar preserva | `D025-NEW1` · idem · curadoria A declarada; (a) `#ux-newsession` → `#ux-modal-ok` → `state()` vazio, `toSession()===undefined`, `captureCanonicalInputs()` sem a chave; nova avaliação (`boot`-like na mesma janela: respostas + `showResults`) → `published()==offered()`, sem `[data-p53-suprimido]`; (b) rota direta `uxNewSession({silent:true})` → idem; (c) `#ux-newsession` → `#ux-modal-cancel` e → Escape → `state()` deep-igual a A (UX22 com oráculo que vê o owner); (d) o texto `Nova sessão remove também todo o contexto tecnológico declarado.` continua no modal (pinado em `tests_ux_m41.js:203`; não muda) | **M11** · `ui_ux_v32.js` · `clear()` removido de `uxNewSession` (o produto de hoje) ⇒ NEW1(a)/(b) vermelhos |
| C10 | **Reiniciar avaliação limpa a curadoria e o diálogo a nomeia** (P2); landscape preservado | `D025-RST1` · idem · curadoria A + contexto declarado; (a) `#restart` → `#ux-modal-ok` → `state()` vazio, `toSession()===undefined`, `V32.isLegacyModeV32()===false` (contexto **preservado**), `TARGET`/refinamento limpos como hoje; (b) o modal contém **exatamente** `Respostas, observações, prioridades e a curadoria do relatório serão limpas. O contexto tecnológico declarado será preservado.`; (c) Cancelar/Escape preservam A | **M12** · `ui_ux_v32.js` · `clear()` removido de `uxResetAssessment` ⇒ RST1(a) vermelho; **M13** · idem · texto antigo do diálogo (`:55`) ⇒ RST1(b) vermelho |
| C11 | **`prioLimitHit` é transiente e o commit o zera** (`EA-108`) | `D025-TRN1` · idem · `prioLimitHit=true` produzido pela UI (três prioridades + tentativa da quarta, `quickscan_secops_soccmm_v3_1_3.html:709-711`) → `importSessionDocument(F-0 com priorities: [])` → `w.eval("prioLimitHit")===false` e a tela de prioridades **não** contém `Limite de 3 prioridades atingido` | **M14** · `ui_session_v32.js` · atribuição removida do commit ⇒ TRN1 vermelho |
| C12 | **O `draft` do editor de contexto é descartado por commit, Nova sessão e Reiniciar** (`EA-107`, P5) — **wave própria, severável** | `D025-TRN2` · idem · para cada um de {import confirmado de `F-0`, `#ux-newsession`+ok, `#restart`+ok}: abrir `#v32cta` (draft nasce, `ui_v32.js:411`) → ação → `__V32UI.hasDraft()===false` e `preparePrint().blocked` **não** é `true` (`finishPrint()` em seguida); (b) **transação**: editor aberto + `importSessionDocument(F-inv-id)` (recusa) e + prévia de `F-A` cancelada → `hasDraft()===true` e `preparePrint().blocked===true` (comportamento de hoje, `ui_v32.js:1587-1591`); (c) `typeof __V32UI.discardDraft === "function"` | **M15** · `ui_v32.js` · `discardDraft` vira no-op ⇒ TRN2(a) vermelho |
| C13 | **A prévia e o aviso de substituição falam da curadoria** (P4) | `D025-PRV1` · idem · (a) `sessionPreview(F-A).curation===true`, `sessionPreview(F-0).curation===false`; (b) `showImportPreview(F-A, …)` → `#ux-modal` contém `Curadoria do relatório: sim`; com `F-0`, `Curadoria do relatório: não`; (c) janela virgem (`boot()` sem respostas) + `__CURATION.set(catalog()[0],"exclude")` → `sessionHasContent()===true`, modal contém `substituirá a sessão atual` e `#ux-modal-ok` é `Importar e substituir` (literais de S30 intactos, `tests_session_m48.js:297-298`); sem a declaração → `false` e `Importar` | **M16** · `ui_session_v32.js` · `sessionHasContent` sem a curadoria (o produto de hoje) ⇒ PRV1(c) vermelho; **M17** · idem · `sessionPreview` sem o campo / prévia sem a linha ⇒ PRV1(a)/(b) vermelhos |
| C14 | **Toggle-back volta a ausente** (P3, `EA-110`): o editor escreve só a decisão que diverge do que o motor faria | `D025-UNS1` · idem · painel aberto; (a) ofertado: desmarcar → `state().decisions[id]==="exclude"`; remarcar → **`id` ausente** de `decisions` (não `include`); (b) não ofertado: marcar → `include`; desmarcar → ausente; (c) leitura arquitetural (fixture com `#v32arch-note`): desmarcar → `architectureNote==="exclude"`; remarcar → `undefined`; (d) após (a)+(b)+(c) completos, `toSession()===undefined` e o roundtrip em DOM novo não produz `[data-p53-prov="operador"]` para o item remarcado; (e) bridge: `unset(id)` devolve `true` e remove; `unset("ProdutoQueNaoExiste")` lança `curadoria: id fora do catálogo`; `unsetArchitectureNote()` devolve `true` | **M18** · `ui_curation_edit_v32.js` · remarcar grava `include` explícito (`b.set(id, checked ? "include" : "exclude")`, o produto de hoje, `:87`) ⇒ UNS1(a) vermelho |
| C15 | **Gate de suficiência fechado + curadoria no arquivo: importada e retida, editor indisponível, nada ressuscita em silêncio** (caso 16) | `D025-GAT1` · idem · `importSessionDocument(F-insuf)` em `boot({poucasRespostas:true})` → `ok:true`, `#p50-results[data-p50-gate]==="blocked"` (vacuidade nomeada), **ausência** de `[data-p53-abrir-curadoria]`, `state()` deep-igual à curadoria A, e o export seguinte **carrega** `reportCuration` deep-igual. **Nasce verde** (declarado): hoje o atalho de `:240` já retém; o poder vem do mutante | **M19** · `ui_session_v32.js` · o commit só aplica a curadoria quando `data-p50-gate==="released"` ⇒ GAT1 vermelho |
| C16 | **A documentação do schema e o guia dizem o que o produto faz** (`EA-112` d) | `D025-DOC1` · idem · lê `SESSION_SCHEMA_V32.md` e `USER_GUIDE.md` de `D025_DOC_OVERRIDE` ou da raiz; (a) a tabela de owners (§5, `SESSION_SCHEMA_V32.md:226-241`) tem linha com `reportCuration` e `__CURATION`, com o **mesmo número de células** das demais (S82); (b) o texto diz que a chave ausente é legítima **e** que a importação **substitui** (regex `ausên[cs]ia[\s\S]{0,160}substitu`); (c) a cobertura de rollback (§8.4 item 5) nomeia `__CURATION`; (d) as regexes de S81 (`tests_session_m48.js:910-915`) continuam satisfeitas na cópia lida; (e) `USER_GUIDE.md` §11 diz que importar substitui **também a curadoria** e que *Nova sessão* e *Reiniciar avaliação* a limpam | **M21** · cópia de `SESSION_SCHEMA_V32.md` · remover a linha da sexta chave ⇒ DOC1(a) vermelho |

> **Nascem vermelhos** (R3 §4): VAL1, VAL2, CAN1, TRX1, TRX2, AUS1, INV8(b)(c)(d),
> NOP1, NEW1, RST1, TRN1, TRN2, PRV1, UNS1, DOC1, mais S50(b), S30(b) e
> S31-S32(b) abaixo. **Nascem verdes, declarados**: GAT1 e S69(b) — nada os viola
> hoje; o poder vem de M19 e M6 (precedente `D015-NOSUB1`; 019 T004).
>
> [PO 2026-10-30] **Errata E9** (§Erratas tardias — classe (c)): a lista acima diz
> "INV8(b)(c)(d)"; o red (`red-025.md` D3, medido 2026-10-27 e reexecutado
> 2026-10-30) mostrou INV8 vermelho **só por (d)**. **(a)(b)(c) nascem verdes e
> ficam declarados aqui ao lado de GAT1 e S69(b)**: poder em M4 (a) e M9 (b);
> **(c) idempotência não tem carrasco** entre M1–M23 — alínea de regressão, dívida
> declarada na matriz. A frase original não é reescrita (R2 §5): a errata diz o
> que mudou e por quê.

### Reancoragens em `tests_session_m48.js` (§29.4 — autorizadas em 2026-10-27)

Onde havia UMA asserção passa a haver DUAS; a segunda é a que não existia
(regra da T012 da 019, `tests_session_m48.js:116-126`). Nenhuma alínea antiga é
afrouxada; os literais pinados não mudam.

| Gate | Alínea nova | Carrasco |
|---|---|---|
| **S50** (`:531-539`) | a lista do candidato passa a `ans,arch,arq,curadoria,landscape,notes,platforms,priorities,refinement,signals,targetOverrides` — **11** chaves — e a alínea (b) nova prova que `curadoria` está presente **também** quando o documento não traz a chave (`"curadoria" in cand`, valor `undefined`) | **M20** · `tests_session_m48.js` · ressuscitar a lista de 10 ⇒ `FAIL  S50` (muta o arquivo de teste; `suite: "tests_session_m48.js"`, `skipBuild: true`, heap 6144 — precedente `D019-M11`, `tests_019_mutants.js:264-268`) |
| **S69** (`:788-798`) | (a) regex de hoje permanece; (b) **comportamental**: `richLandscape` + curadoria A; `snap = snapshotCanonicalOwners()`; zerar **cada** owner (inclusive `__CURATION.clear()` e `step`); `restoreCanonicalOwners(snap)`; `captureCanonicalInputs()` + `derivedModel()` + `__CURATION.state()` + `step` iguais ao pré | **M6** (mutB), executado também sob m48 com `M48_HTML_OVERRIDE` (abaixo) ⇒ `FAIL  S69` |
| **S30** (`:290-299`) | (b) janela virgem com **só** curadoria declarada por bridge → `sessionHasContent()===true`, modal com `substituirá a sessão atual` e botão `Importar e substituir`; (a) e os literais intactos | **M16** sob m48 ⇒ `FAIL  S30` |
| **S31-S32** (`:300-314`) | o documento importado passa a ser a variante **curada** de `richSession` (mesma janela, `__CURATION.set` antes do `buildSessionDocument` — padrão S4-S5 (b)); `afterRestart` e `afterNew` ganham `__CURATION.toSession()===undefined` e `state().decisions` vazio | **M11** e **M12** sob m48 ⇒ `FAIL  S31-S32` |

Para que M6/M11/M12/M16 sejam executados **contra o HTML mutado** pela própria
campanha (e não provados uma vez num relatório — família `EA-28`), o carregador
de `tests_session_m48.js:3` ganha a variável **`M48_HTML_OVERRIDE`** (padrão
inalterado: o HTML da raiz). É uma linha, dentro da autorização, e é a única
mudança no cabeçalho da suíte. Custo: cinco execuções de m48 na campanha `d025`
(M20 + quatro) — **a medir na Fase 2** (ver DEPENDÊNCIAS).

Não se tocam: `richSession`/`richLandscape`, S4-S5, S6/S7, S29, S37, S41, S49,
S57, S62+S68, S67, S77, S112. As variantes curadas das famílias
*reject-before-commit* e *roundtrip* vivem em **`D025-NOP1`** e **`D025-INV8`**
(a suíte da demanda), não na suíte congelada — menos superfície §29.4 editada, e
o mesmo poder.

### `D019-INV8`, `D019-SUF1` e a spec da 019 (P6)

- **`D019-INV8`** (`tests_019_curadoria.js:219-247`) recebe **errata de título**:
  de *"exportada, recomputada na importação, e id desconhecido é recusado"* para
  *"exportada; id desconhecido recusado; nenhum derivado viaja"*, com o comentário
  de cabeçalho ajustado. **Corpo intacto**; `D019-M3` continua o carrasco;
  contagem `d019` continua **14**. Reduzir o título ao corpo não enfraquece (R10
  §1): a promessa de importação passa a ser cumprida por `D025-INV8`.
- **`D019-SUF1`** (`:789-797`) **não muda**. C10 da 019 recebe errata de redação
  (abaixo); a alínea "instrumentar o bridge sob gate fechado" (`EA-115`) fica
  **fora**, declarada baixa.
- As erratas na `specs/019-curadoria-do-relatorio/spec.md` são **tarefas desta
  demanda** (seção *Erratas*), nunca editadas aqui.

### Cobertura — caso → gate, cenário → gate

Nenhum caso sem gate; nenhum gate sem caso.

| Caso (`refinement.md:261-290`) | Gate / alínea |
|---|---|
| 1 cancelar · 2 Escape | VAL1(b), NOP1 |
| 3 erro posterior | NOP1 (`F-tardio`) |
| 4 engine incompatível | NOP1 (`F-engine`), M10 |
| 5 curadoria inválida | VAL2, NOP1 (`F-inv-*`) |
| 6 exportar | VAL1(c) |
| 7 · 8 ausência substitui | AUS1 |
| 9 substituição | INV8(b) |
| 10 DOM novo | INV8(a) |
| 11 idempotência | INV8(c) |
| 12 falha no commit | TRX2(b)(b′)(c) — (b′) [PO 2026-10-27]: "estado da sessão" inclui "nada declarado" |
| 13 ordem interna | TRX2(a) |
| 14 forma canônica | CAN1 (+ `F-extra`, sub-caso [PO 2026-10-27] — `refinement.md` ERR-2) |
| 15 `{architectureNote}` só | CAN1 (`F-arch`) |
| 16 gate fechado | GAT1 |
| 17 include sem lastro | INV8(a) + regressão `D019-CUR2(e)`/`D019-PROV1` (não muda) |
| 18 Nova sessão | NEW1(a)(b)(d) |
| 19 cancelar Nova sessão | NEW1(c) |
| 20 Reiniciar | RST1 |
| 21 · 22 toggle-back | UNS1 |
| 23 prévia e aviso | PRV1 + S30(b) |
| 24 `prioLimitHit` | TRN1 |
| 25 `draft` | TRN2 |
| 26 papel | AUS1(d), NOP1, INV8(a) — jsdom; Chromium no job `visual` (KI-3, rito do proprietário; não é gate desta suíte) |
| 27 gate fechado: editor não lê | errata C10 (redação); `D019-SUF1` inalterado |
| 28 reancoragens | S50, S69, S30, S31-S32 + M20 |

| Cenário (síntese §3.2, `refutacao_adversarial_2026-10-25.md:103-122`) | Gate |
|---|---|
| 1 validação pura | VAL1, VAL2 |
| 2 transação completa | TRX1, TRX2, S69(b) |
| 3 ausência substitui | AUS1 |
| 4 forma canônica | CAN1 |
| 5 cancelar/Escape/erro/incompatível/inválida | NOP1 |
| 6 roundtrip de identidade | INV8 |
| 7 Nova sessão | NEW1 |
| 8 Reiniciar | RST1 |
| 9 transientes | TRN1, TRN2 |
| 10 prévia e aviso | PRV1, S30(b) |
| 11 toggle-back | UNS1 |
| 12 reancoragens | S50, S69, S30, S31-S32 |
| 13 papel | alíneas de papel em AUS1/NOP1/INV8 |
| 14 adjacente SUF1 | errata de redação C10; sem gate novo (declarado) |

Mutantes mínimos da síntese: (a)=M4 · (b)=M6 · (c)=M7 · (d)=M1 · (e)=M11 ·
(f)=M3 · (g)=M14 · (h)=M15 · (i)=M5 · (j)=M9 · (k)=M6. Adicionais desta spec:
M2, M8, M10, M12, M13, M16, M17, M18, M19, M20, M21, e [PO 2026-10-27] M22 (guarda
`&& snap.curadoria` ressuscitada) e M23 (chave desconhecida dentro de
`reportCuration` ignorada). Ids `D025-M1`…`D025-M23`, permanentes (R12). Se a wave do `draft` for cortada, **M15 é aposentado** e
`D025-TRN2` sai por errata de W0, antes do red (`EA-107` fica `aberto`).

## Comportamento especificado

Regra única (`refinement.md:252-259`; verbete *Importação substitutiva*): depois
de um import bem-sucedido, o estado da janela é função **só do documento**;
depois de um import cancelado, recusado ou falho, é **byte-igual** ao anterior.

### Importar — `picker → validar → prévia → confirmar → commit → render`

| passo | hoje | passa a ser |
|---|---|---|
| seleção do arquivo (`ui_session_v32.js:681-700`) | `validateSessionDocument` **aplica** a curadoria (`:237-242`) | `validateSessionDocument` chama **`__CURATION.validate(I.reportCuration)`** (puro) quando a chave existe; erro → `Curadoria inválida: ` + mensagens, **nada escrito**; a mensagem `Curadoria declarada no arquivo, mas o modulo de curadoria nao esta disponivel.` (`:238-239`) permanece |
| compatibilidade / prévia (`:695-697`, `:718-736`) | prévia sem curadoria; aviso cego | prévia ganha a linha **`Curadoria do relatório: sim`/`não`** (depois de *Aprofundamento*); `sessionHasContent()` conta curadoria declarada; literais `Importar esta sessão substituirá a sessão atual nesta janela.` e `Importar e substituir` **inalterados** |
| Cancelar / Escape (`ui_ux_v32.js:41`, `:45`) | nada desfaz — porque já aplicou | nada a desfazer: nada foi escrito |
| confirmação (`:631-641`) | valida **de novo** aplicando; candidato de 10 chaves | valida de novo (puro); `normalizeSessionDocument` leva **`curadoria`** ao candidato — cópia profunda de `I.reportCuration`, ou **`undefined`** quando a chave não existe; a chave `curadoria` está **sempre** presente no `cand` |
| commit (`:606-628`) | snapshot `:607` depois da escrita de `:240`; não escreve a curadoria | `snapshotCanonicalOwners()` é a **primeira** instrução (já é) e fotografa `__CURATION.toSession()`; dentro do `try`, **depois** das escritas dos owners existentes e **antes** dos transientes: `__CURATION.fromSession(cand.curadoria)` — `undefined` ⇒ limpa; transientes: `tgtNotices=[]`, `refStage`, `refReturn`, **`prioLimitHit=false`**, **`__V32UI.discardDraft()`** (guardado por `typeof`) |
| falha no commit | restaura a curadoria **do arquivo** | `restoreCanonicalOwners(snap)` reaplica `fromSession(snap.curadoria)` **sempre que o bridge existe** — `undefined` ⇒ limpa; a janela volta à **sessão** |
| render (`:630`) | — | inalterado: só após o commit |

Erros **anteriores** ao bloco da curadoria (`:206-231`) e **posteriores** (`:243+`)
continuam com as mensagens de hoje e, agora, sem efeito algum. Chave ausente:
legítima, e **substitui** (INV-8 nas duas metades).

### Exportar

`prepareSessionExport` (`:116-121`) continua validando com o mesmo validador
(propriedade 4.8.0.7-A, `:107-111`) — que agora é puro: **zero escritas** no
owner. `captureCanonicalInputs` (`:69-77`) inalterado: a chave sai só quando algo
foi declarado.

### Nova sessão · Reiniciar avaliação

- `uxNewSession` (`ui_ux_v32.js:23-30`): acrescenta `window.__CURATION.clear()` e
  `window.__V32UI.discardDraft()` (ambos guardados por existência/`typeof`),
  **antes** de `render()`. Diálogo (`:61`) **não muda**.
- `uxResetAssessment` (`:17-22`): idem. Landscape/arch/plataformas/sinais
  continuam preservados. Diálogo (`:55`) passa a:
  **`Respostas, observações, prioridades e a curadoria do relatório serão limpas. O contexto tecnológico declarado será preservado.`**
  (não pinado em nenhum `tests_*.js` nem em `tests_visual/` — grep meu = 0).
  [PO 2026-10-27] **Texto aprovado pelo PO** tal como está: é o exemplo literal
  de P2 (`refinement.md:315-316`), usa a cabeça do verbete (*curadoria do
  relatório*), concorda em gênero/número ("serão limpas" — quatro sujeitos
  femininos), não nomeia o papel e preserva intacta a segunda frase (a promessa
  da 4.2 sobre o contexto). Reconferi que `Respostas, observações` só ocorre em
  `ui_ux_v32.js:55`, no HTML gerado e nos artefatos desta demanda — nenhuma suíte
  o pina. O texto de "Nova sessão" (`:61`, UX21 `tests_ux_m41.js:203`) **não muda**
  e continua verdadeiro: "remove também" já abrange a curadoria. A linha da
  prévia **`Curadoria do relatório: sim`/`não`** também está aprovada — é o
  literal de P4 (`refinement.md:345`), paralela a `Cenário-alvo: sim/não` e
  `Aprofundamento: sim/não` (`ui_session_v32.js:732-733`), sem predicar
  "informada/declarada" porque a ausência da chave **é** a forma de "não".
- Cancelar/Escape nos dois diálogos: nada muda (UX22, com oráculo que vê o owner
  em NEW1(c)/RST1(c)).

### Editor de curadoria (toggle / unset — P3)

`ui_curation_edit_v32.js:86-88` e `:181`: o editor escreve **só a divergência**.

| item | marcado | desmarcado |
|---|---|---|
| ofertado | `unset(id)` (ausente — o motor publica) | `set(id,"exclude")` |
| não ofertado (catálogo) | `set(id,"include")` | `unset(id)` (ausente) |
| leitura arquitetural | `unsetArchitectureNote()` (ausente — publica) | `setArchitectureNote("exclude")` |

Sessões antigas com `include` explícito em ofertado ou `exclude` inerte em não
ofertado **continuam válidas** (enum intacto) e normalizam-se ao primeiro toque.
`gateFechado()`/`decorar()` (`:62-65`, `:216-217`) não mudam.

### `architectureNote`

Tri-estado como os produtos: ausente (motor publica) · `include` · `exclude`.
Viaja em `reportCuration.architectureNote` só quando definido (`paraSessao`,
`ui_curation_v32.js:178-183`, inalterado); `{architectureNote:"exclude"}` sozinho
é forma canônica válida (caso 15); a ausência da chave inteira limpa também a
nota (AUS1, janela 4); `unsetArchitectureNote()` devolve-a a ausente.

### Mensagens de recusa (texto exato, PT-BR)

Devolvidas por `__CURATION.validate(obj)` como itens de `erros[]`; o validador de
sessão compõe `"Curadoria inválida: " + erros.join("; ")` (como hoje, `:241`).

| forma | mensagem |
|---|---|
| `null` | `reportCuration é null — represente 'sem curadoria' pela ausência da chave` |
| não objeto / array | `reportCuration não é objeto` (hoje) |
| `{}` ou sem `decisions` e sem `architectureNote` | `reportCuration sem decisão declarada — represente 'sem curadoria' pela ausência da chave` |
| `decisions` não objeto | `decisions não é objeto` (hoje) |
| `decisions` com **zero** chaves | `decisions sem chaves — represente 'nenhuma decisão por produto' pela ausência do campo` |
| chave desconhecida dentro de `reportCuration` [PO 2026-10-27] | `reportCuration: campos não reconhecidos: <k1>, <k2>` (padrão de `:225`/`:229-230`; ordem de `Object.keys`) |
| id fora do catálogo | `decisions: id fora do catálogo: <id>` (hoje) |
| valor fora do enum | `decisions: valor fora do enum fechado: <valor>` (hoje) |
| `architectureNote` fora do enum | `architectureNote fora do enum: <valor>` (hoje) |

Padrão das mensagens novas: `ui_session_v32.js:327-329` e `:346-348`
(*"represente … pela ausência do campo"*). [PO 2026-10-27] Redação das oito
linhas **aprovada** pelo PO como está: PT-BR, voz do validador de sessão
(identificador de código + explicação + remédio), nenhuma usa a palavra do papel;
o prefixo `Curadoria inválida: ` (`:241`) continua sendo o que o usuário lê no
modal `Não foi possível importar`.

### UNSET · NA · suficiência

- **Suficiência fechada**: a curadoria do arquivo é importada e **retida**; o
  editor não se oferece (C10 da 019); a exposição segue a regra do gate, que esta
  demanda **não altera** (GAT1). INV-3 intocada.
- **`UNSET`/`NA`** não são tocados (vivem em respostas e contexto — C5 da 019).
- **Ausência ≠ vazio**: a ausência da chave é a única grafia de "sem curadoria";
  `null`/`{}`/`{decisions:{}}` são recusados (P1). É a tétrade da INV-8 aplicada à
  curadoria (`refinement.md:65-70`).

## Contratos

### Bridge `__CURATION` (owner: `ui_curation_v32.js`, `core-engineer`; R9 §5)

Shape atual (`ui_curation_v32.js:206-242`) **mais**:

```
validate(obj)            → string[]   puro: nunca toca `estado`; [] = válido
unset(id)                → true       remove decisions[id]; lança "curadoria: id fora do catálogo: <id>"
unsetArchitectureNote()  → true       architectureNote = undefined
```

[PO 2026-10-30] **Errata E11** (§Erratas tardias): o contrato acima não fixava
`validate(undefined)`. Passa a valer **`validate(undefined) → []`** — a ausência é a
forma canônica de "sem curadoria" (P1) e, validada, é válida; é o que o código faz
(`ui_curation_v32.js:214-219`, interpretação declarada na T020) e o que VAL2(b)
exige (`fromSession(x)` e `validate(x)` devolvem as mesmas mensagens para todo `x`).
Inalcançável pelo validador de sessão (`ui_session_v32.js:239` só chama `validate`
quando a chave existe). **Ratificado pelo usuário em 2026-10-30.**

Semântica revista de **`fromSession(obj)`** (aplicador): `obj === undefined` ⇒
limpa e devolve `[]`; senão `erros = validate(obj)`; se não vazio, devolve `erros`
**sem tocar o estado**; se vazio, substitui o estado inteiro (nunca merge). **Uma
verdade só** sobre o que é curadoria válida (R9 §8): `validate` — o validador de
sessão deixa de ser o lugar onde ela se aplica, e `set`/`unset` continuam usando
`valido()` (`:133-138`). Inalterados: `state`, `offered`, `catalog`, `decide`,
`published`, `isOperatorChoice`, `unsupported`, `set`, `setArchitectureNote`,
`clear`, `toSession`, `contract`. Consumidores: `ui_session_v32.js` (validar,
snapshot, commit, restore, `sessionHasContent`), `ui_curation_edit_v32.js` (`unset`,
`unsetArchitectureNote`), `ui_ux_v32.js` (`clear`). Nota de
`.claude/verify/bridges.json:71-74` a atualizar (validação pura; `unset`).

### `ui_session_v32.js` (consome; nunca decide)

- `validateSessionDocument`: bloco `:232-242` troca `fromSession` por `validate`.
- `normalizeSessionDocument`: `cand.curadoria` = cópia profunda de
  `I.reportCuration` ou `undefined`, **chave sempre presente**; a lista de 10
  (`:533-541`) vira **11** — S50 reancorado.
- `snapshotCanonicalOwners`: `curadoria: __CURATION.toSession()` (forma canônica:
  `undefined` quando nada declarado; antes `state()`, `:585-586`).
- `restoreCanonicalOwners`: `if (window.__CURATION) window.__CURATION.fromSession(snap.curadoria)`.
  A guarda `&& snap.curadoria` (`:602`) **cai** — não por ser código morto (R13
  §Candidatas não a lista; a leitura do PO em `refinement.md:101-104` é
  extrapolação), mas porque com `toSession()` no snapshot ela passaria a ser
  **alcançável e errada**: pularia a restauração de "nada declarado". Registrado
  aqui para que a mudança não volte como achado.
  [PO 2026-10-27] **Confirmado pelo PO**, lidas as duas (`refinement.md:99-104`;
  `design-decisions.md` §Candidatas, *cláusula defensiva*): a entrada da R13
  enumera **três** instâncias com prova de inalcançabilidade própria
  (`engine_v32.js:696` + `validateConfigV32`); `:602` não está entre elas e a sua
  inalcançabilidade de hoje tem outra prova (bridge IIFE instalado antes de
  qualquer snapshot). O que a R13 proíbe é *reportar como defeito* e *corrigir de
  passagem* — não mudar por spec quando o contrato muda. E o teste da própria
  entrada decide: depois desta demanda, um mutante que **reintroduza** a guarda
  **não é equivalente** (M22 o mata em TRX2(b′)) — logo a cláusula deixa de
  pertencer à classe. A frase *"não se removem"* do refinamento era mais larga do
  que a R13 sustenta: errata **ERR-1** no `refinement.md`. O `err("…modulo de
  curadoria nao esta disponivel")` (`:238-239`) continua na classe e **permanece**.
- `commitCanonicalOwners`: `fromSession(cand.curadoria)` dentro do `try`, após as
  escritas de owner (`:609-619`) e antes dos transientes (`:620-621`);
  `prioLimitHit = false`; `discardDraft()` guardado. Falha após a escrita da
  curadoria ⇒ rollback inclui a curadoria; os transientes só são escritos se
  todas as escritas de owner terminaram (como hoje).
- `sessionPreview`: campo novo **`curation: boolean`**
  (`doc.inputs.reportCuration !== undefined`); `showImportPreview` acrescenta
  `<li>Curadoria do relatório: ${yn(p.curation)}</li>` ao template existente (não é
  `innerHTML =` novo; módulo 4.x legado).
- `sessionHasContent`: `|| (window.__CURATION && window.__CURATION.toSession() !== undefined)`.
- Comentários `:3`, `:232-236`, `:565-569`, `:582-584` passam a descrever o que o
  código faz (divergências de `refinement.md:234-239`).

### `ui_ux_v32.js` · `ui_v32.js` · `__V32UI`

- `uxNewSession`/`uxResetAssessment`: ver *Comportamento*.
- `window.__V32UI` (`ui_v32.js:1688`, registrado em `bridges.json:7`) ganha
  **`discardDraft()`** (`draft = null`; devolve `true` se havia draft) e o par de
  leitura **`hasDraft()`** (`draft !== null`) — o nome `hasDraft()` já é citado
  como contrato em `ui_p52_workspace_v32.js:2015` sem existir; nasce aqui com a
  semântica citada. Nenhum outro símbolo de `ui_v32.js` é tocado; os 9 `innerHTML=`
  legados ficam como estão. Nota de `bridges.json:7-10` a atualizar.

### Registro e identidade

- `expected_suites.json`: `suites.d025` (contagem medida por execução, 16 ou 15 se
  TRN2 sair); `heavy.session` 97 refixado por execução; `suites.d019` 14 inalterado.
- `mutation_map.json → harnesses.d025`: `cmd: node tests_025_mutants.js`,
  `preflight: true`, `targets`: `tests_025_curadoria_sessao.js`,
  `tests_025_mutants.js`, `tests_session_m48.js` (mutado por M20 — logo **não**
  insumo), `ui_curation_v32.js`, `ui_curation_edit_v32.js`, `ui_session_v32.js`,
  **`ui_ux_v32.js`**, **`ui_v32.js`** *(Errata E12 · [PO 2026-10-30]: a lista real tem **9** — o nono é `SESSION_SCHEMA_V32.md`, mutado em cópia por M21 e exigido no gatilho por `D017-REL1`; ver §Erratas tardias)*; `insumos.oraculo`: `tests_025_curadoria_sessao.js`;
  `requires: node, python`. Hoje nenhum harness tem `ui_ux_v32.js` como alvo de
  mutação com oráculo de curadoria (d019 lista `ui_v32.js` e `ui_session_v32.js`,
  não `ui_ux_v32.js`).
- `pins.json` via `gen_pins.py` no mesmo PR (R8 §1): os cinco módulos, as duas
  suítes da 019 (título), `tests_session_m48.js`, `tests_p50_core.js` (trilha
  "Identidade anterior" para `ui_v32.js:383`, `ui_ux_v32.js:384`,
  `ui_session_v32.js:550`), HTML reconstruído, `SESSION_SCHEMA_V32.md`,
  `USER_GUIDE.md`, `synthetic_session_examples/exemplo-completo.json`,
  `bridges.json`, `expected_suites.json`, `mutation_map.json`, `CONTEXT.md` e os
  artefatos desta demanda.
- **Âncoras de mutantes alheios preservadas** (lição `EA-4`): `D019-M3`
  (`out.reportCuration = cur;`), `D019-M2`, `D019-M1`, `D019-M10`, `D019-M8`,
  `D019-M12`, `D019-M11` (`CANONICAS.concat(["reportCuration"])`) e as dos
  harnesses `core`, `d009`, `d010`, `d011`, `d014`, `d015`, `d021`, `d022`, `d023`,
  `p51`, `p52` que apontam para `ui_v32.js`/`ui_ux_v32.js`/`ui_session_v32.js`:
  `--preflight` de cada um continua `ocorrencias == 1` depois das waves.

### O que NÃO muda (explícito)

`SESSION_SCHEMA_VERSION = 1` · a forma de `reportCuration` no export
(`{decisions, architectureNote}`, `spec.md:130-137` da 019 com a errata E4) ·
`paraSessao` · `decide()`/`published()`/`contract()`/`offered()` (inclusive a
oferta por sinal da 022) · `hasSubstituteV32()` (023/024) · a proveniência
(`PROV_TXT`, `ui_p52_support_v32.js:152`) e a declaração de supressão (`:598-615`)
· a degradação dos casos 4/5 da 019 (`spec.md:161-166`) · **payload M41
byte-idêntico** (C5 da 019 continua critério: `D019-MED1` + stage `m41`) · engine e
Camada 1 (zero linha) · `tests_ux_m41.js` (congelada; UX21 `:203`) · o texto de
"Nova sessão" (`ui_ux_v32.js:61`) · os literais de S30 · o `err("…modulo de
curadoria nao esta disponivel")` (`:238-239`, defensivo). [PO 2026-10-27] A linha
anterior desta lista — *"chaves desconhecidas dentro de `reportCuration` continuam
ignoradas"* — **saiu**: decisão do PO na revisão da Fase 1, entra como sub-caso de
C3 (`F-extra`, M23). Razões: (i) é a doutrina do próprio schema v1 — toda outra
estrutura do documento recusa chave desconhecida nomeando-a; recusar fora e
ignorar dentro é incoerente pela mesma razão que fez P1 recusar `{}`; (ii) custo
marginal nulo — uma comparação a mais em `validate`, que **nasce** nesta demanda
no único módulo não protegido que ela edita; deixá-lo para achado futuro é reabrir
`ui_curation_v32.js` depois; (iii) self-import (4.8.0.7-A) intacto — `paraSessao`
nunca emite chave além de `decisions`/`architectureNote`; `SESSION_SCHEMA_VERSION`
continua `1`. Não é reabertura de P1: P1 fixou *"uma grafia por estado"*; isto é a
mesma regra para *"nenhuma grafia que o produto não lê"*. Vai ao usuário junto com
a spec (portão da Fase 1).

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** **INV-8** é a que esta demanda passa a
  honrar nas duas metades (o import recomputa só do documento; `missing ≠ null ≠
  {}`) — `D025-AUS1`, `D025-INV8`, `D025-CAN1`. **INV-7** por consequência: a
  narrativa de supressão deixa de derivar de entrada de outra sessão
  (`D025-NEW1`, `D025-AUS1`). **INV-3** intocada (`D025-GAT1`; C10 da 019).
  **INV-1** protegida por C5 da 019 (payload M41 byte-idêntico; stage `m41`).
  **INV-9**: boundary legível por máquina não é expandida — ver *Boundary*.
  **INV-10**: mensagens novas em PT-BR; nomes de código como no source. INV-2,
  4, 5, 6 não são alcançadas (nada toca score, tecnologia, target, refinamento;
  `TARGET`/refinamento continuam limpos por *Reiniciar* como hoje).
- [x] **`design-decisions.md` — nenhum conflito.** Lidas as entradas `:15` (a
  lista secundária convive — nada aqui a toca) e `:18` (supressão total não repõe a
  leitura congelada — `D025-AUS1(b)` mede *ausência* de aviso, nunca "aviso com
  seção vazia" como defeito). §Candidatas, *cláusula defensiva inalcançável*: as
  três instâncias listadas (A5, `tgtValidateHTML`, 4º parâmetro de `prCards`) não
  são tocadas; a guarda `:602` **não está na lista** e muda por mudança de
  contrato, declarada acima. Nenhuma linha desta spec reporta lista, supressão
  total ou cláusula defensiva como defeito (R13).
- [x] **Specs validadas anteriores — nenhuma contradição.** **019**: esta demanda
  executa o que ela aprovou (`refinement.md:173` caso 7; `spec.md:41-42` C2/C3;
  `tasks.md:31-32` T010/T011) e emenda C3/C10 **por errata listada como tarefa**
  (abaixo); fronteira seleção×redação, sexta chave, proveniência, degradação 4/5
  intocadas. **022** (oferta por sinal em `offered()`, `ui_curation_v32.js:89-131`):
  não tocada. **023/024** (`published()` como substituto; supressão total): esta
  demanda muda **quando** o owner é escrito, não o que `published()` devolve.
  **010** (`D010-ARB1` ancorado em `published()`): idem. **009** (ordem canônica de
  leitura): nenhuma seção nova. **015**: partição de apoio intocada.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `current_phase.json → specs_normativas` aponta **uma**: `specs/PHASE_5_0_REV_B.md`,
  SHA-256 **medido sobre o blob de HEAD** =
  `4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b` — confere.
  O que toca o escopo: **`:1613-1620` §29.4** — `ui_v32.js` · `ui_ux_v32.js`
  (`:1616`), `ui_session_v32.js` (`:1617`), *todas as suítes congeladas*
  (`:1618-1619`), *schema de sessão* (`:1620`; `SESSION_SCHEMA_VERSION` e a forma
  de `reportCuration` **não mudam** — o que muda é a recusa de grafias que o
  exportador nunca produz, dentro do schema v1). **`:195-196`**: *"session import
  starts from canonical inputs and recomputes derived outputs"* — é a propriedade
  que esta demanda restaura para a curadoria. **`:1376-1381`** (P50-SESUX3, wording
  de import e strictness do schema v1): a linha nova da prévia não promete
  persistência; a strictness não é afrouxada. **Nada** sobre curadoria, Nova
  sessão ou Reiniciar na REV B (grep `curadoria|reportCuration|Nova sess|Reiniciar`
  = 0). `specs/PHASE_5_0_REV_A.md` (histórica, `legacy`): **0** ocorrências de
  curadoria/`reportCuration` — leitura negativa registrada. Spec selada **não é
  editada** aqui.
- [x] **Boundary (R6) — as três fontes cruzadas.**
  1. `.claude/verify/boundary.json`: nenhum dos cinco módulos nem das suítes
     aparece (grep = 0). `frozen` (engine, Camada 1, harness M41, snapshot): **zero
     linha**. `generated`: o HTML é reconstruído **só** pelo builder; stage `build`
     prova identidade. `legacy` e `registry`: intocados (pins via `gen_pins`).
  2. `tests_p50_core.js`: **`PROTECTED`** (`:82-642`) contém **`ui_v32.js`** (`:383`),
     **`ui_ux_v32.js`** (`:384`) e **`ui_session_v32.js`** (`:550`), com hashes
     **iguais** aos de `pins.json:536/:534/:531` — toca os três.
     `tests_019_curadoria.js`/`tests_019_mutants.js` **não estão** em `PROTECTED`
     (grep `tests_019` = 0) nem em `frozenSuites`. `tests_session_m48.js` **não é
     chave hash de `PROTECTED`**; está em **`frozenSuites`** (`:648-651`, só
     existência) e é §29.4 pela prosa (*todas as suítes congeladas*), pinada em
     `pins.json:499`. `ui_curation_v32.js`/`ui_curation_edit_v32.js` (módulos da
     019): pinados (`:514-515`), não protegidos. `tests_p50_core.js` (pin `:492`) é
     editado só na trilha "Identidade anterior" do `PROTECTED` — precedente de toda
     reancoragem §29.4.
  3. `pins.json` (stage `baseline`): todos os arquivos tocados são pinados ou
     novos ⇒ `gen_pins` no mesmo PR; repin **sempre em commit separado**.

> **AUTORIZAÇÃO §29.4 — REGISTRADA, NÃO ASSUMIDA.** O rito (R6 §5) é autorização
> nominal do proprietário no chat, por demanda. Foi dada em **2026-10-27**, rodada
> 3 do refinamento (`refinement.md:422`): *"Autorizo os quatro (Recomendada)"* —
> `ui_session_v32.js`, `ui_ux_v32.js`, `tests_session_m48.js` e `ui_v32.js`, **só
> para a 025**, com repin e trilha "Identidade anterior" nos pins inline legados.
> Nenhum outro protegido é tocado; se o desenho da Fase 2 exigir um quinto, o
> plano **para** nesse ponto. **Precedência**: onde a prosa da spec selada divergir
> do executável, vale o regime de pins (R8;
> `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2); divergência
> vira achado no `BACKLOG.md`, nunca edição de spec selada.

- [x] **R9 — modularização.** §1 nenhum módulo novo (IIFE não se aplica); §2
  nenhum bridge novo — métodos acrescentados a bridges registrados (`__CURATION`,
  `__V32UI`); §3 contrato só por bridge (`validate` puro é a correção do "validar
  que muta"); §4 **nenhum monkey-patch e nenhum patch-point novo** — `ui_ux_v32.js`
  chama o bridge; o módulo de curadoria **não** registra gancho de reset; §5 owner
  continua `ui_curation_v32.js`; `ui_session_v32.js` só consome; §6 zero CSS; §7
  `ui_curation_v32.js` 243 → ≈ 290 linhas; §8 `validate` é o helper único da
  validade da curadoria; **§9 zero `innerHTML =` novo** — `ui_curation*` seguem em
  0; nota de estado: **neste HEAD** `check_lint_arch.py:37` varre só
  `ui_p5*`/`ui_d0*`; os commits do `EA-101` (`1def6a9`…`433a9d2`, PR #113) existem
  só em `fix/EA-101-lint-arch-modulos-novos` segundo os refs locais desta worktree
  (sem `fetch`) — depois do rebase sobre a `develop` o lint alcança `ui_curation*`;
  até lá a Fase 6 confere por `grep` (declarado).
- [x] **R10 — gates.** Cada gate nasce com positivo, negativo, adversarial
  (falha sintética, documento de outra janela, formas não canônicas) e regressão
  (D019 14/14, m48 97, UX 56, P50 65); oráculos independentes (bridge, DOM, papel,
  inputs canônicos entre janelas); contagens em `expected_suites.json`, nunca na
  prosa; namespace `D025-*` em arquivo próprio; nenhum gate spawna suíte (a m48 é
  rodada pelo harness de mutação, como `D019-M11`); vacuidade nomeada por `vac()`;
  nenhum hash inline; teste não escreve na árvore (override por env).
- [x] **R3 — TDD.** Gates nascem aqui, antes do plano; `qa-engineer` escreve e
  prova o red (commit); implementadores recebem o gate no prompt; tipagem no
  `tasks.md` (`feature`/`fix` exigem red; título do `D019-INV8` e docs são
  `doc`/`chore`, declarados); mutante por gate, listados acima.

## Erratas — tarefas desta demanda (listadas, não executadas aqui)

Molde: §"Errata de fidelidade" da 009 (tabela *O que estava escrito / Fato medido
/ O que passa a valer / Onde o gate afirma / Classe*), amendando **também a célula
do critério**; seções de ratificação anteriores ficam intactas.

| # | Artefato | O que muda | Carrasco / prova |
|---|---|---|---|
| E1 | `specs/019-curadoria-do-relatorio/spec.md:42` (C3) | registrar que C3 foi **medido pela metade**: `spec-validate.md:13` deu "conforme" apontando o restauro em `validateSessionDocument`, que é validador, não lugar de restauro; a metade "import recomputa" passa a ser medida por `D025-INV8`/`D025-AUS1`; `D019-INV8` reduzido ao que mede | spec 019 cita `D025-INV8`; `spec-validate.md` da 019 **não** é reescrito (registro retrospectivo, R2 §5) |
| E2 | `specs/019-curadoria-do-relatorio/spec.md:49` (C10) | *"o controle não existe e o estado não é lido"* → *"o controle não existe e **o editor** não lê o estado"* — é o que `ui_curation_edit_v32.js:216-217` faz e o que `D019-SUF1` mede; `showResults` lê o bridge sob gate fechado (`EA-115`), fora desta demanda | nenhum gate muda |
| E3 | `tests_019_curadoria.js:219` (+ comentário) | título do `D019-INV8` reduzido ao corpo (texto acima); contagem 14; `D019-M3` intacto | `node tests_019_curadoria.js` 14/14; `--preflight` d019 `ocorrencias == 1` |
| E4 | `SESSION_SCHEMA_V32.md` | §4 (`:221`): *"cinco blocos"* + `reportCuration` opcional; §5 (`:226-241`): linha da sexta chave (`__CURATION` · `inputs.reportCuration` · não); §8.4 (`:416`, `:428-430`): snapshot antes de qualquer escrita **vale para a curadoria**; cobertura de rollback inclui `__CURATION`; §9 (`:436-442`): validação da curadoria (puro; formas recusadas; ausência legítima **e substitutiva**). Restrições: regexes de S80/S81 (`:904-915`) e S82 (`:916-931`) satisfeitas; o bloco JSON inline de §3 continua **igual** a `exemplo-minimo.json` (S110, `:1377-1395`) — a curadoria entra como **fragmento** JSON ou prosa, nunca como segundo documento completo antes dele (S79 ignora fragmentos; S110 usa o primeiro completo) | `D025-DOC1`; m48 S79–S82, S109, S110 verdes |
| E5 | `synthetic_session_examples/exemplo-completo.json` | ganha `reportCuration` válido (uma exclusão de ofertado + `architectureNote`); `toolVersion`/`engineSha256` inalterados (S109, `:1358-1376`) | `D025-INV8(d)` |
| E6 | `USER_GUIDE.md:404-432` (§11) | *"Importar substitui a sessão ativa por inteiro"* (`:417`) ganha *"— inclusive a curadoria do relatório; o que o arquivo não declara volta a 'nada declarado'"*; nota de que **Nova sessão** e **Reiniciar avaliação** limpam a curadoria; checklist A→B→A (`:419-426`) inalterado. [PO 2026-10-27] Fato medido: o guia tem **0** ocorrências de `curadoria`, `Reiniciar avaliação` e `Nova sessão` (grep meu, `USER_GUIDE.md` inteiro) — a 019 nunca o documentou. A nota de E6 não pode citar *"a curadoria do relatório"* como coisa já apresentada: ou remete a uma seção que a descreva (não existe) ou abre com uma frase que a defina pelo verbete (`CONTEXT.md:210`), sem a palavra do papel. É a alínea (d) do `EA-112`, já no escopo; o `doc-writer` executa, DOC1(e) mede | `D025-DOC1(e)`; `P51-DOC*` verdes |
| E7 | `.claude/verify/bridges.json:7-10`, `:71-74` | notas de `__V32UI` (`discardDraft`/`hasDraft`) e `__CURATION` (`validate` puro, `unset`, `fromSession` recusa sem tocar) | stage `lint-arch` |
| E8 | `.claude/BACKLOG.md` | status de `EA-91`, `EA-92`, `EA-105`…`EA-114` ao fecho (`doc-writer`, Fase 6); `EA-110` sobe a decisão P3 (não vai a `design-decisions.md` — virou comportamento, não decisão de "não é defeito"); `EA-115` permanece `aberto`, baixa. [PO 2026-10-27] Confirmado: o `BACKLOG.md:10323-10330` registra o `EA-110` como *pergunta de desenho* a decidir por PO/TL; P3 a respondeu na direção **"corrigir"** (toggle-back volta a ausente), logo o fecho é `corrigido pela 025 (P3, D025-UNS1)` com a decisão citada — **não** riscado (não foi refutado) e **não** em `design-decisions.md` (que guarda o que se decidiu *não* ser defeito; a alternativa "manter e registrar" do `refinement.md:340-342` foi a **não adotada**) | relatório final |

Se a wave do `draft` cair: **E0** (W0, antes do red) retira `D025-TRN2`/`M15` e
`discardDraft`/`hasDraft` desta spec; `EA-107` fica `aberto` com a alínea
declarada "não executada". Nada mais depende dela. [PO 2026-10-27] Conferido o
isolamento: nenhum outro gate assere `hasDraft`/`discardDraft`; as menções em
*Comportamento → commit* e *Nova sessão · Reiniciar* são chamadas **guardadas por
`typeof`**, que E0 remove junto. E0 tem de retirar **também**: `ui_v32.js` dos
`targets` de `mutation_map.json → harnesses.d025`, da lista de repin e da nota E7
(`bridges.json:7-10`); a autorização §29.4 para `ui_v32.js` fica **sem uso, não
revogada** (foi dada para a 025 e permanece citável). O corte em si é decisão do
usuário — P5 foi aprovada *com* o `draft`; "severável" é a forma do corte, não a
licença para cortar.

## Fora de escopo

Herdado do refinamento (`refinement.md:430-453`): achados de instrumento
`EA-93`…`EA-100`, `EA-102`…`EA-104`, `EA-116`; `EA-101` (pré-requisito, PR #113 —
ver nota R9 §9); selagem/release/tag/CI/README; o significado da curadoria
(`decide()`, `published()`, proveniência, supressão, degradação 4/5); catálogo,
severidade, score, estágio, suficiência, gaps (C5 da 019 — payload M41
byte-idêntico); engine e Camada 1; `tests_ux_m41.js`; o texto de "Nova sessão"; o
conflito de nomes do papel; nome da suíte/waves/donos (Fases 2/3 — esta spec
propõe os nomes, o plano os fixa).

A spec exclui ainda:

- **Instrumentar o bridge sob gate fechado** (`EA-115`, cenário 14): só a redação
  de C10 (E2).
- **Fixtures curadas na suíte congelada** para S29/S49/S67/S77/S6/S7/S37/S41/S112
  (cenário 12, segunda metade): a propriedade é medida em `D025-NOP1`/`D025-INV8`;
  a m48 recebe só as quatro reancoragens autorizadas.
- ~~**Chaves desconhecidas dentro de `reportCuration`**: comportamento de hoje
  (ignoradas), declarado; candidata a achado.~~ [PO 2026-10-27] **Entrou** — C3,
  `F-extra`, M23 (ver *O que NÃO muda*).
- **Mutante do papel separado** (cenário 13): o papel é derivado dos cards
  (`D019-PAR1`); as alíneas de papel vivem nos gates de estado; Chromium é o job
  `visual` (KI-3).
- **Gate novo em `tests_ux_m41.js`** (UX21/UX22 "com oráculo que veja o owner"):
  vive em `D025-NEW1`, nunca na suíte congelada.
- **Persistência, autosave, histórico de curadoria, proveniência temporal** no
  estado (recusada pela 019 — só ids e enum fechado).

## Erratas tardias — classe (c) (2026-10-30)

> Escritas pelo `product-owner`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-10-30, na worktree `phase5-009` (HEAD `3741ebd`),
> depois do aceite de intenção (T092) e com o harness T084 fechado (23 DETECTADO ·
> 0 SOBREVIVENTE — contagem reportada pelo orquestrador, **não executada por mim**).
> Molde: §"Errata de fidelidade" da 009 e §"Erratas da demanda 025" da spec da 019
> — a redação original **não é apagada**; cada célula emendada recebe **uma** nota
> inline `*(Errata E<n> · [PO 2026-10-30]: …)*` e o registro completo vive aqui
> (R2 §5). "Classe (c)" é a classe de **medição/registro** da própria demanda
> (`tasks.md` §PARADAs, item 3: *"errata tardia de W0 (classe (c))"*): o que muda é
> o texto, para que ele descreva o que foi medido — nenhum gate, mutante, contagem
> ou comportamento muda. [PO 2026-10-30]

| Campo | Registro |
|---|---|
| **Quem decidiu** | O usuário |
| **Quando** | 2026-10-30 |
| **Onde** | No chat (AskUserQuestion), sobre o relatório do aceite de intenção (T092): **E9/E10** — *"Autorizo a errata (Recomendada)"* (errata tardia classe (c) na spec da 025); **E11** — *"Ratifico (Recomendada)"* (`validate(undefined) → []`); **E12** — *"Autorizo a E12 (Recomendada)"* (2026-10-30, sobre o gap **G1** do `spec-validate.md`, `f965100`: lista de `targets` de `harnesses.d025`) |
| **Alcance** | A célula "Nascem vermelhos" de C7 (E9), a célula de C8 sobre o erro de `F-tardio` (E10) e o contrato do bridge `__CURATION` em §Contratos (E11). Três notas inline, uma por célula, mais este registro. *[PO 2026-10-30, E12: + a célula de §Registro sobre `harnesses.d025.targets` — quarta nota inline]* |
| **O que NÃO é reaberto** | P1–P6 e as rodadas 2–6 do refinement; ERR-1/ERR-2; as 12 emendas `[PO 2026-10-27]`; os 16 gates `D025-*`, as 4 reancoragens e os 23 mutantes (ids permanentes); as contagens (`d025` 16, `heavy.session` 97, `d019` 14); **o red** (R3 §4: `D025-INV8` nasceu vermelho — por (d) — e o commit do red `b20b20b` permanece a prova); as erratas-tarefa E1–E8; a autorização §29.4 de 2026-10-27. Nenhuma linha anterior desta spec é reescrita |
| **Nenhuma redação original apagada** | Verificável por máquina: cada linha do base sobrevive byte a byte; as três notas são inserções |

### E9 · A célula "Nascem vermelhos" prometia INV8(b)(c)(d); o red mediu só (d)

| Campo | Registro |
|---|---|
| **O que estava escrito** | `spec.md` §Critérios, blockquote *Nascem vermelhos*: "… AUS1, **INV8(b)(c)(d)**, NOP1 …"; e C7 sem nota sobre o que nasce verde |
| **Fato medido** | `red-025.md` D3 (QA, 2026-10-27; reexecutado 2026-10-30 com veredito byte-idêntico): `FAIL D025-INV8 — … [(d) exemplo-completo.json não declara reportCuration]` — **(a), (b) e (c) verdes**. Causa: o produto do dia aplicava a curadoria do arquivo pelo validador (`daSessao` zerava antes de aplicar), logo substituição (b) e idempotência (c) já valiam; (a) DOM novo também. O gate INV8 reprovou **só por (d)** — a contagem `1 PASS · 15 FAIL de 16` conferiu com o esperado. Ao cruzar as alíneas com os 23 mutantes (aceite T092, O1/O3): (a) morre por **M4** (curadoria fora do candidato ⇒ DOM novo sem curadoria ⇒ inputs ≠ origem); (b) por **M9** (merge); **(c) não morre por nenhum** — M9 e M4 sobrevivem a "importar o mesmo documento duas vezes" (A∪A = A; sem curadoria nas duas) |
| **O que passa a valer** | **INV8: nasce vermelho só por (d); (a)(b)(c) nascem verdes, declarados; poder: (a) M4, (b) M9, (c) idempotência sem carrasco — alínea de regressão, dívida declarada na matriz (O3).** A alínea (c) permanece no gate: mede propriedade real (importação com efeito colateral acumulativo a quebraria) e é regressão, não tautologia (`EA-20`); o que não pode é ficar implícita sob o verde do gate |
| **Onde o gate afirma** | `D025-INV8` em `tests_025_curadoria_sessao.js` (alíneas a–d); `red-025.md` §Leitura por alínea; `mutation-matrix.json → dividas_declaradas` (registro do `qa-engineer`, T084) |
| **Classe** | (c) — registro de red mais largo que a medição; corpo do gate intacto; nada afrouxado (R10 §1) |

### E10 · O erro de `F-tardio` não é "Resposta inválida"

| Campo | Registro |
|---|---|
| **O que estava escrito** | C8: "`F-tardio` (`ok:false`, erro de hoje, `Resposta inválida`/aprofundamento)" |
| **Fato medido** | `red-025.md` §P0 e D4: o literal do produto é **`Valor de aprofundamento inválido: ref-hunting`** (`ui_session_v32.js:493`); `Resposta inválida em:` é a mensagem das **respostas** (`:259`), outro bloco. O gate `D025-NOP1` assere `ok:false` e `/aprofundamento/i` (`tests_025_curadoria_sessao.js:567`) — **não pina o texto** |
| **O que passa a valer** | C8 lê: "erro de hoje — `Valor de aprofundamento inválido: ref-hunting`; o gate assere só `/aprofundamento/`". Nenhuma mensagem do produto muda; nenhuma asserção muda |
| **Onde o gate afirma** | `D025-NOP1` (`F-tardio`, `F-tardio-0`) |
| **Classe** | (c) — redação da spec mais imprecisa que a medição; sem efeito em gate |

### E11 · `validate(undefined) → []` — interpretação declarada no código, ratificada pelo usuário

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Contratos: `validate(obj) → string[] puro: nunca toca estado; [] = válido`; `fromSession(undefined)` ⇒ limpa e devolve `[]`. A spec **não fixava** `validate(undefined)` |
| **Fato medido** | `ui_curation_v32.js:214-219`: `validar(undefined)` devolve `[]`, com o comentário *"Decisão de interpretação (aceita pelo orquestrador na T020)"* — decisão de agente, não do usuário, até 2026-10-30 (apontada no aceite T092, O2). Propriedades verificadas por leitura: **coerente com P1** (a ausência É a forma canônica de "sem curadoria"; validá-la como válida é a mesma regra, não uma segunda grafia); **inalcançável pelo validador de sessão** (`ui_session_v32.js:239` só chama `validate` quando `I.reportCuration !== undefined`; JSON não representa `undefined`); **necessária a VAL2(b)** (`fromSession(x)` e `validate(x)` devolvem as mesmas mensagens para todo `x` — com `fromSession(undefined) → []`, só `validate(undefined) → []` mantém a igualdade) |
| **O que passa a valer** | O contrato do bridge ganha a linha **`validate(undefined) → []`** (ausência válida). Ratificado pelo usuário em 2026-10-30: *"Ratifico (Recomendada)"* |
| **Onde o gate afirma** | Nenhum gate assere `validate(undefined)` diretamente (VAL2(b) cobre os `F-inv-*`); nenhum chamador do produto passa `undefined` — **sem mutante, declarado**: ramo de contrato inalcançável pelos chamadores, não comportamento observável pelo usuário |
| **Classe** | (c) — interpretação registrada só em comentário de código passa a registro de spec com decisão do usuário |

### E12 · §Registro listava 8 `targets` para `harnesses.d025`; o registro executável tem 9 — `SESSION_SCHEMA_V32.md`

> [PO 2026-10-30] Decidido pelo usuário, no chat, em **2026-10-30**: *"Autorizo a E12
> (Recomendada)"*. Origem: gap **G1** do `spec-validate.md` (`f965100`, 41/42),
> classe `spec-errada`. Escrita pelo `product-owner` (Fable 5.1, `claude-fable-5-1`)
> em HEAD `017ed5d`. Nada apagado: a célula de §Registro recebe uma nota inline e o
> registro vive aqui. Não reabre nada de E9–E11, de P1–P6 nem dos 23 mutantes.

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Registro e identidade: "`mutation_map.json → harnesses.d025`: … `targets`: `tests_025_curadoria_sessao.js`, `tests_025_mutants.js`, `tests_session_m48.js`, `ui_curation_v32.js`, `ui_curation_edit_v32.js`, `ui_session_v32.js`, `ui_ux_v32.js`, `ui_v32.js`" — **8** nomes |
| **Fato medido** | `.claude/verify/mutation_map.json → harnesses.d025.targets` (HEAD `017ed5d`, `:500-510`, lido por mim) tem **9** nomes: os 8 acima **+ `SESSION_SCHEMA_V32.md`**. O nono entra porque `D025-M21` o **muta** (em cópia sob `os.tmpdir`, apontada por `D025_DOC_OVERRIDE` — R7 §3) e o contrato C1 da demanda 017 — **`D017-REL1`**, `check_mutation.py` §"semântica do gatilho (017)": `targets ⊇ arquivos_mutados ∪ {harness}` — exige que todo sujeito mutado esteja no gatilho. Medido pelo QA no stage `mutation` (`d025 · gatilho ⊇ conjunto mutado ∪ {harness}`): com 8 nomes o stage reprovaria o harness recém-nascido por "conjunto mutado fora do gatilho". A spec definiu M21 (muta o schema) e, ao mesmo tempo, um `targets` que M21 viola — a prosa estava errada, não o registro. Direção única: tirar o nono afrouxaria o gatilho (editar o schema deixaria de re-provar M21) e omitiria um sujeito mutado do C1 — nunca (R10 §1) |
| **O que passa a valer** | A lista de **9**: `tests_025_curadoria_sessao.js`, `tests_025_mutants.js`, `tests_session_m48.js`, `ui_curation_v32.js`, `ui_curation_edit_v32.js`, `ui_session_v32.js`, `ui_ux_v32.js`, `ui_v32.js`, **`SESSION_SCHEMA_V32.md`**. Regra que fica para as próximas specs: o `targets` de um harness **deriva do conjunto mutado** (todo arquivo que algum `M*` toca, inclusive documento mutado em cópia) ∪ {harness} — nunca é enumerado à mão só pelos módulos de código |
| **Onde o gate afirma** | `check_mutation.py` **D017-REL1** (stage `mutation`, relação gatilho × conjunto mutado); `mutation_map.json → harnesses.d025.targets` |
| **Classe** | **spec-errada** (classe do `spec-validate`; nesta seção, (c): registro executável certo, prosa da spec incompleta) — nenhum gate, mutante, contagem ou comportamento muda |
