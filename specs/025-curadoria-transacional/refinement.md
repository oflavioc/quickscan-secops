# Refinamento — 025-curadoria-transacional

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.
>
> **Quem escreveu**: o `product-owner`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-10-25, sob delegação do orquestrador, **sem
> Bash**. Tudo o que está marcado *lido* abaixo foi lido por mim na worktree
> `phase5-sel` (HEAD `eec8370`; produto byte-idêntico à develop `cee02e9` segundo
> a síntese da refutação, que o mediu — eu não). Tudo o que está marcado
> *executado* foi executado pelos refutadores e críticos do workflow de
> 2026-10-25 (`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md`),
> em jsdom, e é citado como tal (R2 §4).
>
> **Origem**: `EA-91` e `EA-92` (auditoria externa Codex, 2026-10-20), confirmados
> com correção de cadeia pela refutação adversarial (2/2, severidade alta), mais os
> adjacentes `EA-105`…`EA-115` nascidos no mesmo passe. **Decisão do proprietário,
> no chat, 2026-10-25**: *corrigir o produto antes de selar a v3.2.11*. Esta
> demanda é a correção. O insumo medido é a síntese §3; a decisão é a dele.

## Necessidade

Quem conduz a sessão faz a **curadoria do relatório** como último passo antes de
entregar — e costuma fazê-lo a partir de um arquivo de sessão reaberto noutro
dia (foi este o argumento que fez a 019 persistir a curadoria, P2 do portão dela).
Hoje, nesse fluxo, acontecem quatro coisas que ele não vê e o cliente paga:

1. **Contaminação entre clientes.** A exclusão feita para o cliente A sobrevive a
   "Nova sessão" e é aplicada ao relatório do cliente B: 8 cards em vez de 9, com
   o aviso *"Seleção do engenheiro aplicada. 1 item foi retirado…"*
   (`ui_p52_support_v32.js:608-611`, copiado ao papel) — o relatório de B diz que
   um engenheiro decidiu algo que ninguém decidiu para B. E a exclusão é
   exportada no arquivo de B (*executado*: terra CX-02, astra CX-02, 2/2).
2. **O mesmo arquivo dá resultados diferentes.** Um arquivo **sem** `reportCuration`
   importado numa janela que tinha uma exclusão herda a exclusão; importado numa
   janela nova, não — 0 contra 1 card, tela e papel (*executado*: astra CX-02;
   sonda E dos críticos, 8/8 contra 9/9). O documento deixou de bastar para
   reconstruir o relatório — e "reconstruir a partir do arquivo" é a única
   garantia de reprodutibilidade que o produto oferece (INV-8).
3. **Olhar um arquivo já altera a sessão.** Selecionar o arquivo no seletor — antes
   de confirmar — já reescreve a curadoria; Cancelar, Escape, engine incompatível
   e arquivo inválido deixam a alteração (*executado*: astra CX-01, terra CX-01).
   Uma curadoria **inválida** no arquivo apaga a seleção da sessão ativa antes de
   recusar (sub-caso E, *executado*).
4. **Falha no meio devolve o arquivo, não a sessão.** Se o commit falha, o rollback
   restaura a curadoria **do arquivo** — o snapshot foi tirado depois de ela já ter
   sido aplicada (*executado*: setter sintético que lança na 1ª escrita).

**Por que agora**: a v3.2.11 está por selar, e a curadoria é a superfície mais
recente do que o cliente recebe. Selar com um relatório que pode carregar decisão
de outro cliente, ou que não se reproduz a partir do próprio arquivo, é selar o
defeito junto. O proprietário decidiu corrigir antes.

## Enquadramento de produto

### Invariantes tangenciadas (R1)

**INV-8 — a ferida literal.** *"Sessão exporta só inputs canônicos e o import
recomputa (missing ≠ null ≠ [] ≠ "unset")"*. A curadoria é entrada (019, P1 do
portão), e a 019 cumpriu a metade do **export**: a chave sai só quando algo foi
declarado (`ui_session_v32.js:69-77`). A metade do **import** — recomputar a
partir do documento, e só dele — não existe. Como a tétrade se aplica à curadoria:

| forma no arquivo | o que significa | hoje (lido/executado) | nesta demanda |
|---|---|---|---|
| chave **ausente** | nada declarado → o motor decide (publicado = ofertado) | `:237` não chama nada; o owner **herda** a sessão aberta | **substitui**: o owner vai a "nada declarado" (P1 não altera isto — é o núcleo) |
| `null` | não é estado: o exportador nunca o emite (`ui_curation_v32.js:178-183`) | `daSessao :189` **aceita** como vazio (*lido por mim, não executado*) | P1 — recomendo recusar |
| `{}` · `{decisions:{}}` | não é estado: o exportador nunca o emite | aceitos como vazio (*executado*, N2) — enquanto o mesmo validador recusa `coverage:""` e `coveredCapabilities:[]` mandando *"representar pela ausência"* (`:327-329`, `:346-348`) | P1 — recomendo recusar |
| **"unset" por item** | na curadoria é a **ausência do id** em `decisions` (*"sem a chave → o motor decide"*, `ui_curation_v32.js:50`) | o editor não consegue devolver um item a esse estado: só `set`/`clear` (`:217-228`) | P3 — recomendo `unset(id)` |

"O import recomputa" quer dizer: o conjunto publicado é função **do documento**.
Hoje é função de (documento, sessão que estava aberta).

**INV-7 — por consequência.** A narrativa *"Seleção do engenheiro aplicada"* no
relatório de B deriva de entrada de A. Determinística, sim; derivada da evidência
**desta** sessão, não. Os gates da INV-7 (`tests_ux_m41`, M41) não alcançam a
curadoria por desenho (C5 da 019) — por isso não acusaram.

**INV-3** — não tocada: sob gate fechado a curadoria continua indisponível (C10);
a demanda só decide, em P6, a redação do critério (o bridge É lido sob gate
fechado por `showResults`; o editor não lê — `EA-115`).

**INV-1** — critério de aceite herdado da 019 (C5): **payload M41 byte-idêntico**.
Nada aqui toca engine nem Camada 1.

**INV-9** — `ui_session_v32.js`, `ui_ux_v32.js` e `ui_v32.js` são §29.4
(`specs/PHASE_5_0_REV_B.md:1613-1617`), pinados em `tests_p50_core.js` (`PROTECTED`,
`:82+`, com trilha "Identidade anterior" no padrão `:85-103`) e **ausentes de
`boundary.json`** — o `guard-boundary` não bloqueia; quem acusa é `P50-GOV1` +
`baseline`. O rito é **autorização nominal do proprietário no chat, por demanda**
(precedente: 019, 2026-09-17, `tasks.md:31`), trilha inline e `gen_pins` no mesmo
PR. **Nenhuma linha desses três é escrita antes dela** (R6 §5).

### Conflito com decisão registrada ou spec validada?

**Nenhum, e a busca foi por leitura:**

- `design-decisions.md` (`:15`, `:18`): tratam da leitura congelada, do substituto
  e da **supressão total pela curadoria** (D4 da 024) — nenhuma fala de sessão,
  importação ou ciclo de vida. A entrada *"cláusula defensiva inalcançável"*
  alcança duas linhas desta superfície — a guarda `&& snap.curadoria` em
  `ui_session_v32.js:602` e o `err("…módulo de curadoria não está disponível")`
  em `:238-239` — que **não se reportam nem se removem**.
- **Spec 019**: esta demanda **executa** a intenção que a 019 aprovou e não
  cumpriu — `refinement.md:173` (caso 7), `spec.md:41-42` (C2/C3), `tasks.md:31-32`
  (T010/T011). Onde a 019 foi **silenciosa** (Nova sessão, Reiniciar, Cancelar,
  Exportar), decide-se aqui (P1–P6). Nada do que a 019 decidiu é revertido: a
  fronteira seleção×redação, a sexta chave, a proveniência, a degradação dos casos
  4/5 (`spec.md:161-166`) continuam como estão.
- **REV B §29.4 — "schema de sessão"**: `SESSION_SCHEMA_VERSION` permanece `1` e a
  forma de `reportCuration` não muda. O que P1 faz é recusar grafias que o
  exportador **nunca produz** — a propriedade de self-import (4.8.0.7-A,
  `ui_session_v32.js:107-111`: *nenhum JSON emitido pela UI pode ser recusado pelo
  mesmo build*) permanece verdadeira por construção.
- **023/024**: `hasSubstituteV32()` lê `__CURATION.published()` (verbete
  *Substituto*, `CONTEXT.md:519-521`). Esta demanda muda **quando** o owner é
  escrito, não o que `published()` devolve.

### Por que a 019 falhou aqui — omissão, não decisão

Três artefatos aprovados da 019 pedem o que o código não faz: `refinement.md:173`
(*"Ausência ≠ vazio: sem curadoria declarada, comporta-se como o caso 1"*),
`spec.md:42` (*"import recomputa"*), `tasks.md:31-32` (*"restauro na importação"*;
*"missing ≠ null ≠ {}"*). O que o código fez (*lido*):

- O comentário de `ui_session_v32.js:232-236` cita a INV-8 e a lê como
  **"Ausência da chave é legítima e não produz erro"** — a metade da *recusa*. A
  metade da *substituição* nunca ganhou uma linha: `normalizeSessionDocument`
  devolve 10 chaves e nenhuma é a curadoria (`:533-541`); `commitCanonicalOwners`
  escreve nove owners e dois transientes, não a curadoria (`:609-621`).
- O "restauro" foi posto **dentro do validador** (`:240`) — um atalho que só
  funciona no caminho "importar uma vez, em janela nova". É exatamente o caminho
  que todo gate percorria.
- Ninguém viu porque **nenhuma máquina olhava**: `D019-INV8`
  (`tests_019_curadoria.js:219-247`) nunca importa — usa `captureCanonicalInputs`
  e `b.set` (*lido por mim*; três mutantes de importação sobrevivem 14/14,
  *executado*, `EA-111`); nenhum arquivo `tests_019_*.js` cita `uxNewSession`,
  `uxResetAssessment` ou `importSessionDocument` (grep meu = 0); o
  `spec-validate.md:13` da 019 deu C3 *"conforme"* apontando
  `validateSessionDocument` como o lugar do restauro; a tabela de casos de borda
  da 019 (`refinement.md:165-175`) **não tem linha** para Nova sessão, Reiniciar,
  Cancelar nem Exportar.

Nenhum artefato da 019 decide *"a chave ausente herda a sessão aberta"*. A única
frase sobre ausência diz o contrário. **Omissão.** A lição generalizável — todo
owner canônico novo precisa responder às seis perguntas do ciclo de vida
(exportar · importar presente · importar ausente · cancelar/falhar · Nova sessão
· Reiniciar) — vai para a minha memória e para o checklist de Fase 0, não para
esta spec.

### Alternativa mais simples considerada

- **(A) `fix-finding` de um módulo** (`ui_session_v32.js`: curadoria no `cand`,
  `fromSession` dentro do `try` do commit, snapshot antes). **Não basta**: (i) o
  bridge continua com um "validar" que muta — a validação **pura** exige
  `validate(obj)` em `ui_curation_v32.js` (R9 §3); (ii) `EA-92` vive em
  `ui_ux_v32.js`; (iii) **a correção certa reprova um gate PROTECTED** — S50
  (`tests_session_m48.js:531-539`) pina a lista de 10 chaves do candidato
  (`EA-113`); S69 (`:788-798`) não vê a curadoria (`EA-114`); S30/S31-S32 medem
  por oráculos cegos. Reancorar suíte §29.4 sem spec é a proibição 1 da R10 ao
  contrário. ≥ 4 módulos, 3 deles §29.4, suítes PROTECTED, decisões de produto em
  aberto → **demanda** (R4: *na dúvida, é demanda*).
- **(B) Só gates, produto como está**: refutada pela decisão do proprietário.
- **(C) Demanda com waves por módulo, decisões de produto pinadas antes do
  código** — **a proposta.**

## Sistema real

Tudo *lido por mim* em `phase5-sel` (HEAD `eec8370`); o que foi *executado* está
marcado. Linhas da síntese que **eu** reconferi e divergem do BACKLOG estão
anotadas.

### A cadeia da importação, para a curadoria

| passo | hoje (arquivo:linha) | efeito observável |
|---|---|---|
| seleção do arquivo | `openImportPicker` `ui_session_v32.js:681-700` → `validateSessionDocument(doc)` `:693` | **aplica**: `:237` testa `I.reportCuration !== undefined` e `:240` chama `window.__CURATION.fromSession(...)`; `daSessao` **zera** o owner em `ui_curation_v32.js:188` e reescreve item a item em `:194-202` — antes de qualquer confirmação |
| compatibilidade / prévia | `sessionCompatibility` `:695` → `sesEngineMismatch` `:696` · `showImportPreview` `:697`, `:718-736` | incompatível → diálogo e **nada desfaz**; prévia: Cancelar é `#ux-modal-cancel` → `close(true)` (`ui_ux_v32.js:45`), Escape idem `:41` — nada restaura |
| confirmação | `importSessionDocument` `:631-641` → valida **de novo** `:632` (2ª aplicação) → `normalizeSessionDocument` `:635` → `commitCanonicalOwners` `:637` → `recomputeAfterImport` `:639` | `cand` tem 10 chaves (`arq, ans, notes, priorities, landscape, arch, platforms, signals, targetOverrides, refinement`, `:533-541`) e **nenhuma é a curadoria** |
| commit | `commitCanonicalOwners` `:606-628`: snapshot `:607`, escritas `:609-619`, `tgtNotices=[]` `:620`, `refStage/refReturn` `:621`, `catch` `:623-627` | o commit **não escreve** a curadoria; o cabeçalho `:565-569` promete *"snapshot tirado antes de qualquer escrita"* — falso para a curadoria, que já foi escrita em `:240` |
| snapshot / rollback | `snapshotCanonicalOwners` `:570-589` (curadoria `:585-586` via `state()`); `restoreCanonicalOwners` `:590-605` (curadoria `:602-603` via `fromSession`) | o snapshot fotografa **o arquivo**, não a sessão; o comentário `:582-584` (*"para que uma importação que falhe no meio não deixe a seleção meio aplicada"*) descreve o que não acontece (*executado*: rollback devolve o `include` do arquivo) |
| chave ausente | `:237` | nenhuma chamada → o owner **herda** (*executado*, 2/2) |
| exportação | `prepareSessionExport` `:116-121` → `buildSessionDocument` `:89-96` → `captureCanonicalInputs` `:42-79` (curadoria `:69-77`, `toSession()`; chave omitida se `undefined`) → `validateSessionDocument(doc)` `:118` | **exportar escreve no owner** (`fromSession` 1×, idempotente — *executado*, N1 / `EA-105`) |

### O bridge e o editor

- `window.__CURATION` (`ui_curation_v32.js:206-242`): `state`, `offered`,
  `catalog`, `decide`, `published`, `isOperatorChoice`, `unsupported`, `set`,
  `setArchitectureNote`, `clear`, `toSession`, `fromSession`, `contract`. **Não há
  `validate` nem `unset`.** A nota em `.claude/verify/bridges.json:71-74` não
  menciona validação.
- `daSessao` (`:187-204`): `null`/`undefined` → `[]` (`:189`); `{}` →
  `[]` e estado vazio; `decisions` não-objeto → erro; id fora do catálogo / valor
  fora do enum → erro **depois** de ter zerado o estado.
- `paraSessao` (`:178-183`): emite `decisions` só se tiver chaves, `architectureNote`
  só se definido, e **`undefined`** quando nada — nunca `{}`, nunca `null`.
- Editor: `ui_curation_edit_v32.js:86-88` — `change` → `b.set(id, checked ?
  "include" : "exclude")`: remarcar um item ofertado grava `include` **explícito**
  (`EA-110`). `gateFechado` `:62-65`; `decorar` retorna antes do bridge `:216-219`.
- Efeito na tela/papel: `declararSupressao` `ui_p52_support_v32.js:598-615`
  (*"Seleção do engenheiro aplicada."* · *"Nenhuma forma de apoio foi publicada
  nesta leitura."*); `PROV_TXT` `:152` (*"Incluído por decisão do engenheiro — não
  derivado da avaliação."*).

### O ciclo de vida da sessão

- `uxNewSession` (`ui_ux_v32.js:23-30`): limpa target, refinamento, `ans`, `notes`,
  `businessPriority`, `prioLimitHit`, `arq`, `V32.resetLandscapeToUnset()`. **Sem
  `__CURATION.clear()`** — grep de `__CURATION` no arquivo = 0. Diálogo `:60-62`:
  *"Nova sessão remove também todo o contexto tecnológico declarado."* — texto
  **pinado** em `tests_ux_m41.js:203` (suíte congelada): não muda.
- `uxResetAssessment` (`:17-22`): idem, preservando landscape/arch/plataformas/
  sinais; **também não limpa a curadoria** (*executado*). Diálogo `:54-56`:
  *"Respostas, observações e prioridades serão limpas. O contexto tecnológico
  declarado será preservado."* — **não pinado** em nenhum `tests_*.js` (grep meu
  = 0): pode mudar sem reancorar suíte congelada. Precedente: Reiniciar limpa
  target e refinamento desde 4.3.1/4.4 (`docs/CHANGELOG_v32.md:232`, `:261`) e
  preserva o landscape por decisão da 4.2 (`:141`).
- Prévia e aviso: `sessionPreview` `:642-651` devolve 7 chaves (`label, createdAt,
  toolVersion, answered, landscape, target, refinement`) — sem curadoria;
  `sessionHasContent` `:652-656` — sem curadoria; `showImportPreview` usa-o em
  `:721` e `:724`. S30 pina *"substituirá a sessão atual"* e *"Importar e
  substituir"* (`tests_session_m48.js:297-298`) — esses literais **não mudam**.
- Transientes: `prioLimitHit` é zerado em `ui_ux_v32.js:20`/`:27` e **não** no
  commit (`EA-108`, *executado*); `draft` (`ui_v32.js:139`) nasce em `openEditor`
  `:411` e só morre em `:406`, `:535`, `:572`; `preparePrint` `:1585-1591` bloqueia
  com `draft !== null`; `safePrint` `:1626` repete. O bridge `window.__V32UI`
  (`:1688`) expõe `{ openEditor, esc32, iconFor, ARCH_FIELDS, publishableStats }` —
  **sem ponto de descarte** (`EA-107`, *executado* D1–D4).

### Divergências doc × código

| onde | diz | faz |
|---|---|---|
| `ui_session_v32.js:3` | *"parse → validate → normalize → compat → confirm → commit atômico → recompute"* | para a curadoria: parse → **validate-e-aplica** → compat → confirm → **validate-e-aplica** → commit (sem curadoria) → recompute |
| `:565-569` | *"snapshot dos owners é tirado antes de qualquer escrita"* | depois da escrita de `:240` |
| `:582-584` | snapshot protege a seleção contra falha no meio | o snapshot já é a seleção do arquivo |
| `:235-236` | *"Ausência da chave é legítima e não produz erro"* | INV-8 lida como proibição de recusar, não como obrigação de substituir |
| `specs/019 …/spec-validate.md:13` | C3 *"conforme"*, restauro em `validateSessionDocument` | validador não é lugar de restauro; importação nunca medida |
| `docs/SESSION_SCHEMA_V32.md`, `USER_GUIDE.md`, `synthetic_session_examples/*` | — | **0** ocorrências de `reportCuration` (grep meu, confirmando `EA-112` d): a sexta chave não existe na documentação do schema |

### O que foi verificado pelos críticos e NÃO é vão (para a demanda não gastar escopo)

`SESSION_SIGNALS` (validador exige os 22 ids e só `true|'unset'`); `tgtNotices`,
`refStage`, `refReturn` zerados no commit e `step` no snapshot; chaves de
`PRODUCTS` sem colisão com `RESERVED_DERIVED`; `toSession()` só emite
`decisions` + `architectureNote`; `draft` velho não é salvável após o render.

## Casos de borda

**Regra única que todos os casos instanciam**: *a importação é substitutiva e
atômica.* Depois de um import bem-sucedido, o estado da janela — owner da
curadoria, checkboxes `.p53-cur-check`, banner `[data-p53-suprimido]`,
`#v32-print-report` após `beforeprint`, `captureCanonicalInputs()` — é função
**só do documento**. Depois de um import cancelado, recusado ou falho, é
**byte-igual** ao anterior. O oráculo compara **entre janelas** (o mesmo documento
sobre dois estados prévios distintos), nunca uma janela contra si mesma. `[Sn]`
remete ao cenário n da síntese §3.2; `P-n` às decisões abaixo.

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | Seleciono um arquivo com curadoria diferente da minha e **cancelo** na prévia `[S5]` | Nada muda: owner, checkboxes, banner, papel, export. `fromSession`/`set` chamados **0** vezes |
| 2 | Idem, fecho com **Escape** `[S5]` | Idem ao 1 |
| 3 | Arquivo com erro **depois** do bloco de curadoria (ex.: `Assessment ausente`, `ref-hunting=99`) `[S5]` | Recusado com a mensagem de hoje; **nada** muda na sessão |
| 4 | Arquivo com **engine incompatível** `[S5]` | Diálogo de bloqueio; nada muda |
| 5 | Arquivo com curadoria **inválida** (id fora do catálogo, valor fora do enum, `decisions` não-objeto) `[S5]`, sub-caso E | Recusado com mensagem que **nomeia o campo**; a seleção da sessão ativa **permanece** — hoje é apagada antes da recusa |
| 6 | **Exportar** a sessão `[S1]` · `EA-105` | O owner não é tocado: `JSON.stringify(state())` idêntico antes/depois; a chave sai só se algo foi declarado (como hoje) |
| 7 | Importo arquivo **sem** `reportCuration` numa janela com `exclude` `[S3]` | Estado igual ao de uma janela virgem: `published()==offered()`; tela 9/9 e papel 9/9 (não 8/8); export seguinte **sem** a chave |
| 8 | Idem, janela com `include` explícito, ou com `architectureNote:'exclude'` `[S3]` | Idem ao 7 — **toda** forma de resíduo some, não só `decisions` |
| 9 | Importo arquivo **com** curadoria numa janela com curadoria **diferente** `[S6]` | `state()` == o do documento. Substituição, nunca merge |
| 10 | O mesmo documento importado em DOM novo `[S6]` | `captureCanonicalInputs()` JSON-idêntico ao original; `contract()`, `published()` e papel idênticos — inclusive `architectureNote:'exclude'` e `include` sem lastro |
| 11 | Importo o mesmo documento **duas vezes** seguidas | A segunda importação é no-op observável (idempotência) |
| 12 | Falha sintética **durante** o commit `[S2]` | `{ok:false, rolledBack:true}`; **todos** os owners, inclusive a curadoria, voltam ao estado da **sessão** (hoje volta o do arquivo); tela/papel/export byte-iguais ao pré-import |
| 13 | Ordem interna do commit `[S2]` | Nenhuma chamada a `fromSession`/`set`/`clear` antes de `snapshotCanonicalOwners` (instrumentação do bridge) |
| 14 | `reportCuration: {}` · `{decisions:{}}` · `null` `[S4]` · `EA-106` | **P1** — recomendo recusar com mensagem no padrão de `:327-329`: *"represente 'sem curadoria' pela ausência da chave"* |
| 15 | `reportCuration: {architectureNote:"exclude"}` sem `decisions` | Válido e canônico (é o que `paraSessao` emite); aplicado |
| 16 | Arquivo com curadoria declarada **e** suficiência fechada (≤ 9 respostas) | Importado e **retido** no owner; o editor não se oferece (C10); a exposição segue a regra do gate, que esta demanda não altera. Nada "ressuscita em silêncio": é o próprio documento que declara |
| 17 | Arquivo com `include` de produto que **esta** avaliação não oferece | Mantido e **sinalizado** no editor, **rotulado** no papel — caso 4/5 da 019, `spec.md:161-166`. **Não muda** |
| 18 | **Nova sessão** → confirmar `[S7]` · `EA-92` | `state()` vazio, `toSession()===undefined`, export sem a chave; a avaliação seguinte publica == oferta, sem aviso de seleção. O texto `:61` (*"remove também…"*) continua verdadeiro e **não muda** (pinado em `tests_ux_m41.js:203`) |
| 19 | Nova sessão → **Cancelar** no diálogo `[S7]` | Curadoria preservada (padrão UX22, com oráculo que veja o owner) |
| 20 | **Reiniciar avaliação** `[S8]` | **P2** — recomendo limpar a curadoria e o diálogo `:55` nomeá-la |
| 21 | Desmarco e **remarco** um item **ofertado** `[S11]` · `EA-110` | **P3** — recomendo voltar a *ausente*: o export não carrega a decisão; nenhum rótulo de proveniência nasce de um no-op |
| 22 | Marco e desmarco um item **não ofertado** (do catálogo) | Consequência de P3: volta a *ausente* (hoje grava `exclude` inerte) |
| 23 | Prévia de importação e aviso de substituição `[S10]` · `EA-109` | **P4** — recomendo *"Curadoria do relatório: sim/não"* na prévia e `sessionHasContent()` contar curadoria declarada. Os literais pinados por S30 (`:297-298`) **não mudam** |
| 24 | Import com `priorities: []` numa janela com `prioLimitHit=true` `[S9]` · `EA-108` | **P5** — recomendo zerar no commit: o aviso *"Limite de 3 prioridades atingido"* não aparece sobre 0 selecionadas |
| 25 | Editor de contexto **aberto** + import confirmado / Nova sessão / Reiniciar `[S9]` · `EA-107` | **P5** — recomendo descartar o `draft`: `preparePrint()` não bloqueia o relatório do cliente seguinte. Import **cancelado/recusado** com editor aberto → `draft` permanece (transação: nada muda) |
| 26 | Papel `[S13]` | Os casos 7–12 lidos em `#v32-print-report` após `beforeprint` (jsdom) e, no job `visual`, no Chromium (KI-3) |
| 27 | Gate fechado: o editor não lê o bridge; `showResults` lê `[S14]` · `EA-115` | **P6** decide a redação de C10; o comportamento do editor (`:216-219`) já é o certo e não muda |
| 28 | Reancoragens em `tests_session_m48.js` (S50, S69, S30, S31-S32) `[S12]` · `EA-113`/`EA-114` | Rito §29.4 com autorização nominal; S50 ganha a 11ª chave **com mutante que ressuscite a lista de 10** (precedente T012/`D019-M11`); S69 vira comportamental |

Os **11 mutantes** da síntese §3.2 (a)–(k) são insumo da Fase 1; a Fase 0 não os
define. P1 e P3 fixam a **direção** de (f) e da alínea de roundtrip.

## Decisões de produto em aberto — recomendação para o portão

Cada uma com a recomendação e o motivo. O usuário decide; aprovação em bloco é
válida (*"sigo as recomendações"*).

**P1 · Forma canônica de "sem curadoria"** (`EA-106`; caso 14). `reportCuration: {}`,
`{decisions:{}}`, `decisions` sem chaves e `null` — recusar como não-canônicos, ou
equivaler à ausência?
*Recomendo recusar, com mensagem.* Três razões: (i) é a doutrina **do próprio
validador** — `coverage:""` e `coveredCapabilities:[]` são recusados mandando
*"representar pela ausência do campo"* (`:327-329`, `:346-348`); a curadoria seria
a única entrada com duas grafias para um estado; (ii) o exportador **nunca produz**
essas formas (`paraSessao :178-183`), logo recusá-las não fere o self-import
(4.8.0.7-A) e não exige bump de schema; (iii) a INV-8 diz que as representações
são **distintas** — duas grafias com o mesmo efeito é colapsá-las. Custo: zero
para o usuário real; um mutante (f) com direção definida. A alternativa
("equivale à ausência") é defensável só se alguém produzisse `{}` — ninguém produz.

**P2 · "Reiniciar avaliação"** (`EA-92`, cadeia; caso 20). Limpa a curadoria, ou
preserva com o diálogo nomeando-a?
*Recomendo limpar, e o diálogo `:55` passar a dizê-lo* (ex.: *"Respostas,
observações, prioridades e a curadoria do relatório serão limpas. O contexto
tecnológico declarado será preservado."*). Motivo de produto: a curadoria é
decisão sobre o que o motor **inferiu desta avaliação**; reiniciar a avaliação
destrói o objeto da decisão. Preservá-la deixa um estado invisível (gate fechado →
editor indisponível) que reaparece na avaliação seguinte como *"Seleção do
engenheiro aplicada"* — a mesma forma do defeito do cliente B, só que com o mesmo
cliente. É também o precedente do produto: Reiniciar limpa o que é **sobre a
avaliação** (respostas, prioridades, target, refinamento — CHANGELOG `:232`,
`:261`) e preserva só o que é **sobre o ambiente** (landscape, 4.2). A curadoria
está do lado da avaliação. Custo igual nas duas rotas (o texto `:55` muda nas
duas; não está pinado — grep meu = 0). "Nova sessão" herda pelo *"remove também"*
de `:61`, que não muda.

**P3 · Toggle-back** (`EA-110`; casos 21-22). Remarcar um item ofertado grava
`include` explícito — manter, ou voltar a *ausente*?
*Recomendo voltar a ausente* — `unset(id)` no bridge e o editor escrever só a
decisão que **diverge** do que o motor faria (ofertado: marcado = ausente,
desmarcado = `exclude`; não ofertado: marcado = `include`, desmarcado = ausente;
`architectureNote` idem). Motivo: a 019 escolheu o tri-estado (*"sem a chave → o
motor decide"*, `ui_curation_v32.js:50`); o editor o colapsa em dois e **inventa
uma declaração** que o operador não fez — e essa declaração viaja na sessão e, se
a avaliação mudar, vira o rótulo *"Incluído por decisão do engenheiro"* no papel
do cliente. Proveniência que mente é o oposto do que C4 existe para garantir.
Custo: dois módulos **não protegidos** da 019; sessões antigas com `include`
explícito continuam válidas (enum intacto). Alternativa aceitável: manter e
registrar em `design-decisions.md` §Candidatas → confirmadas — mas então a
alínea de roundtrip pina um rótulo que ninguém decidiu.

**P4 · Prévia e aviso de substituição** (`EA-109`; caso 23). Passam a mostrar
*"Curadoria do relatório: sim/não"*?
*Recomendo sim*, e `sessionHasContent()` contar curadoria declarada. Motivo: depois
desta demanda a importação **substitui** a curadoria, inclusive por ausência; o
portão de confirmação existe para dizer o que será substituído — calar sobre a
curadoria é reproduzir, na UX, a omissão que a demanda corrige. Custo: no módulo
já tocado; S30 reancorado (PROTECTED, já em escopo). Observação medida: com P2
adotado e `EA-92` corrigido, "só curadoria, nada mais" deixa de ser alcançável
pela UI (gate fechado → sem editor) — o S30 reancorado mede o **contrato da
função**, alcançável por bridge, e isso basta.

**P5 · `draft` (`EA-107`) e `prioLimitHit` (`EA-108`)** — entram, ou ficam
declarados? (casos 24-25)
*Recomendo que os dois entrem.* `prioLimitHit`: uma atribuição ao lado de
`tgtNotices=[]` (`:620`) — é a regra **já escrita** (*"metadata transitória não
atravessa a importação"*) aplicada a uma variável que ela esqueceu; mesmo módulo,
mesmo rito, mutante (g) barato. `draft`: é o único dos adjacentes que **bloqueia o
relatório do cliente seguinte** por um editor que não está na tela — exatamente o
fluxo "sessão seguinte" que o proprietário mandou corrigir; a correção é um ponto
de descarte em `__V32UI` (`:1688`) chamado pelos dois resets e pelo commit, em
**wave própria** de `ui_v32.js` (§29.4; os 9 `innerHTML=` legados não se tocam).
É **severável**: se o proprietário cortar, `EA-107` fica `aberto` com a alínea
declarada "não executada", e nada mais nesta demanda depende dela.

**P6 · `D019-INV8` e as erratas de registro da 019** (`EA-111`, `EA-115`; casos
27-28). Emendar o corpo do `D019-INV8` para importar, ou criar `D025-INV8` e
reduzir o `INV8` ao que mede?
*Recomendo o segundo*: gates de importação nascem no namespace **desta** demanda
(`D025-*`, suíte própria, `expected_suites.json` no mesmo PR — R10 §3 e
*"namespace da fase corrente"*); o `D019-INV8` recebe **errata de título** —
reduzido a *"exportada; id desconhecido recusado; nenhum derivado viaja"*, que é o
que o corpo mede e o que `D019-M3` mata — e a spec da 019 recebe errata
registrando que C3 foi medido pela metade (`spec-validate.md:13`). Reduzir o
**título** ao corpo não é enfraquecer (R10 §1): o corpo não muda; o que muda é a
promessa, e promessa maior que a medida é a classe `EA-20`. Na mesma errata, C10
(`spec.md:49`) passa a dizer *"o controle não existe e **o editor** não lê o
estado"* — é o que `:216-219` faz e o que `D019-SUF1` mede; a alínea
"instrumentar o bridge sob gate fechado" (`EA-115`) fica **fora**, declarada como
baixa, salvo se o TL a quiser por custo zero.

## Vocabulário

**Registrados agora no `CONTEXT.md`** (Fase 0, caminho normal da R12). O arquivo é
**pinado**: `gen_pins.py` no mesmo PR, com o motivo no commit (R8 §1) — condição
nomeada em DEPENDÊNCIAS. Se o portão alterar algum termo, a emenda vem **antes**
do repin.

- **Curadoria do relatório** — dívida da 019: o `refinement.md:179-183` dela
  prometeu registrá-lo na Fase 1 e nunca o fez; o glossário tinha o filho
  (*Supressão pela curadoria*, `:210`) sem o pai. Esta demanda precisa do termo na
  prévia (P4) e no diálogo (P2). Grep de "curadoria" no `CONTEXT.md` (`:47`,
  `:171`, `:207`, `:210-216`, `:519`): **uma família só**, nenhuma colisão —
  cabeça sem qualificador adicional além do próprio nome da 019.
- **Importação substitutiva** — o conceito que esta demanda existe para
  instaurar. Raiz compartilhada com *Substituto* (`:513`, família 023/024:
  leitura V3.2 no lugar da congelada) → **cabeça qualificada + remissiva nos dois
  lados**, sem mudar sentido algum e sem riscar nada. Evitei *suficiente* /
  *autossuficiente* (colidiria com *Suficiência*, INV-3).

**Vocabulário interno** (spec/plan/código; **não** vai ao glossário):
*validação pura* × *aplicação* (é R9 §3 — contrato de bridge); *owner da
curadoria* (é o *owner do estado* da R9 §5); *transação de importação* / *commit
atômico* (comentário `:565`, propriedade já absorvida no verbete acima);
*candidato* (`cand`), *snapshot*/*rollback*, *transiente* (`:620`).

**Dívida de vocabulário da 019 que NÃO resolvo aqui** (fora de escopo, passe
próprio do PO): o **papel de quem conduz a sessão** tem três nomes —
*facilitador* (`CONTEXT.md:59`), *operador* (`:211`; 019 `refinement.md:184`),
*engenheiro* (tela: `ui_p52_support_v32.js:152`, `:608`). É conflito real (R12),
mas é da 019 e de toda a Camada 5.x; os textos novos desta demanda **evitam a
palavra do papel** para não pinar uma das três antes da decisão.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1 | Decisão de corrigir antes de selar a v3.2.11 (orquestrador → proprietário, 2026-10-25) | *"corrigir o produto antes de selar"* — origem desta demanda |
| 2 | **Portão da Fase 0** — enquadramento acima + **P1 a P6**, cada uma com recomendação (orquestrador → proprietário, 2026-10-27, no chat) | *"Aprovado em bloco (Recomendada)"* — **P1 a P6 adotadas como recomendadas**: P1 recusar `{}`/`{decisions:{}}`/`null`; P2 Reiniciar limpa a curadoria e o diálogo a nomeia; P3 toggle-back volta a ausente (`unset` no bridge); P4 prévia/aviso mostram "Curadoria do relatório: sim/não" e `sessionHasContent()` conta curadoria; P5 `prioLimitHit` e `draft` entram (`draft` em wave própria, severável); P6 `D025-INV8` novo + errata de título do `D019-INV8` + errata na spec 019 (C3, C10) |
| 3 | **Autorização nominal §29.4** (R6 §5) para `ui_session_v32.js`, `ui_ux_v32.js`, `tests_session_m48.js` e `ui_v32.js` (orquestrador → proprietário, 2026-10-27, no chat) | *"Autorizo os quatro (Recomendada)"* — vale só para a 025; repin e trilha "Identidade anterior" nos pins inline legados |
| 4 | **Portão da Fase 1** — spec.md (16 gates `D025-*`, 4 reancoragens, 23 mutantes, erratas da 019) com a revisão de intenção do PO, incluindo a extensão de P1 (chave desconhecida dentro de `reportCuration` recusada — ERR-2, M23) (orquestrador → proprietário, 2026-10-27, no chat) | *"Aprovado, com a extensão (Recomendada)"* — spec aprovada integralmente; ERR-2 passa de decisão do PO a decisão do usuário |
| 5 | **Portão da Fase 2** — plan.md (10 waves, um dono por módulo, harness de mutantes em W8 com a tabela M1…M23 no red, W0 = mescla de #112/#113 + rebase antes do red, 17 repins, p51/p52 só no CI visual) (orquestrador → proprietário, 2026-10-27, no chat) | *"Aprovado (Recomendada)"* |

> A R4 é literal: aprovação é do usuário, no chat. P1–P6 são decisões de
> **produto** (o que a ferramenta passa a fazer), não de ritmo. Depois da
> aprovação, cada P vira "Resposta: adotada/alterada" aqui e é mapeada ao critério
> da spec que a executa — para a Fase 6 não medir a demanda contra o que ela não
> prometeu.

## Fora de escopo (explícito)

- **Os achados de instrumento** `EA-93`…`EA-100`, `EA-102`…`EA-104`, `EA-116`: não
  são desta demanda. `EA-101` (`lint-arch` não cobre `ui_curation*`) é
  **pré-requisito recomendado** como `fix-finding` separado, antes ou dentro da
  025 — porque `ui_curation_v32.js` é o arquivo que a demanda edita e um
  `innerHTML=` ali passaria verde hoje (ver DEPENDÊNCIAS).
- **`EA-111`…`EA-115`**: entram **só** onde são os gates desta demanda — `EA-111`
  (P6), `EA-113`/`EA-114` (reancoragens S50/S69, caso 28), `EA-112` (fixtures
  curadas e famílias reject-before-commit/roundtrip/Nova sessão; a alínea (d) de
  documentação entra como tarefa `doc`: `SESSION_SCHEMA_V32.md` com a sexta chave,
  a ausência legítima e a substituição; exemplo sintético com `reportCuration`;
  `USER_GUIDE.md`). `EA-115` só na redação de C10 (P6).
- **Selagem da v3.2.11**, release, tag, deploy, README (`EA-104`), CI (`EA-103`).
- **O que a curadoria significa**: `decide()`, `published()`, proveniência, apoio
  por solução, supressão (parcial/total), degradação dos casos 4/5 — tudo da 019 e
  da 024, intocado. P3, se adotado, é **aditivo** (`unset`), não altera a leitura.
- **Catálogo, política de severidade, score, estágio, suficiência, gaps** — C5 da
  019 continua critério de aceite: payload M41 byte-idêntico.
- **Engine e Camada 1**: zero linha. **`tests_ux_m41.js`**: congelada; gates novos
  vivem na suíte da 025, nunca lá.
- **Mudar o texto de "Nova sessão"** (`:61`): pinado por UX21 e já verdadeiro.
- **O conflito de nomes do papel** (facilitador/operador/engenheiro): passe próprio.
- **Decidir o nome da suíte, as waves e os donos**: `tech-lead`, Fase 2/3.

## Erratas do refinamento

> Registradas pelo `product-owner` (Fable 5.1, `claude-fable-5-1`) em 2026-10-27,
> na revisão de intenção da spec (Fase 1). O refinamento foi aprovado na rodada 2;
> o que está acima **não é reescrito** — a errata diz o que mudou e por quê, para
> que a Fase 6 meça a demanda contra a régua corrigida, não contra a frase que a
> spec provou larga demais.

| # | Onde | O que estava escrito | O que passa a valer | Razão |
|---|---|---|---|---|
| ERR-1 | §Conflito com decisão registrada, `:101-104` | a entrada *"cláusula defensiva inalcançável"* da R13 *"alcança duas linhas desta superfície — a guarda `&& snap.curadoria` (`:602`) e o `err(...)` (`:238-239`) — que não se reportam nem se removem"* | **`:238-239` permanece** na classe e não se toca. **`:602` cai por mudança de contrato** (snapshot passa a guardar `toSession()`, que é `undefined` para "nada declarado"; com a guarda, o rollback pularia a restauração desse estado — alcançável e errada). Não é remoção de código morto nem "correção de passagem": é a spec (C5, `D025-TRX2(b′)`, mutante `D025-M22`) | Lidas as duas: a entrada da R13 enumera **três** instâncias com prova própria de inalcançabilidade e manda não as *reportar*; não diz que cláusula defensiva não possa mudar por spec quando o contrato muda. Depois da demanda, reintroduzir a guarda **não é mutante equivalente** — a cláusula sai da classe pelo critério da própria entrada. O "não se removem" foi extrapolação minha, apontada pelo `tech-lead` na Fase 1 |
| ERR-2 | P1 (`:300-311`) e caso 14 (`:276`) | P1 enumera `{}`, `{decisions:{}}`, `decisions` sem chaves e `null` | P1 ganha um **sub-caso**: chave **desconhecida dentro** de `reportCuration` é recusada nomeando-a (`F-extra`, `D025-CAN1`, mutante `D025-M23`) — a mesma regra que o schema v1 aplica a toda outra estrutura do documento (`extraKeys`), de que `reportCuration` era a única exceção silenciosa | Omissão da Fase 0: a tabela da INV-8 (`:65-70`) tratou as grafias do *estado* e não as chaves do *bloco*. Mesma razão (i) de P1 (doutrina do próprio validador), custo marginal nulo (uma comparação no `validate` que nasce nesta demanda), self-import intacto. Escalado pelo `tech-lead`; decidido pelo PO; **vai ao usuário junto com a spec** no portão da Fase 1 — se recusado, volta a "declarado, candidato a achado" |
