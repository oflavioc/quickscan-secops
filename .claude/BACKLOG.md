# Backlog de achados — Estrutura Agêntica (R12)

> Mantido por `doc-writer`. Cada achado tem **id permanente** (números citados
> nunca renumeram; inserção tardia ganha sufixo de letra) e cita a cadeia
> `arquivo:linha → efeito` — achado sem cadeia é palpite (R12,
> [`.claude/rules/documentation.md`](rules/documentation.md)). Refutado fica
> **riscado com a razão** (R2 §5), nunca apagado. Decisão confirmada como
> desenho — não defeito — vai para
> [`design-decisions.md`](rules/design-decisions.md), não para aqui.

## Por que este arquivo, e por que aqui

A R12 manda achado ir "ao backlog com id permanente" — mas esse backlog nunca
existiu neste repositório. Os ids **E1–E12** são citados por várias regras
(`modularity.md` cita E12; `orchestration.md` cita E12; `evidence.md` cita
E5/E8/E9; `boundary.md` cita E2; `determinism.md` cita E6/E9) mas nunca
definidos aqui: pertencem ao **documento fundador da Estrutura Agêntica**
(acordado 2026-08-25), que é externo a este clone. `known_issues.json` é outra
coisa — exceções nominais de lint com remoção prevista, não achados. E
`docs_phase5/REVB_BACKLOG.md` é artefato histórico da Fase 5.0, selado sob o
processo antigo (R13, linha "Fases 5.0–5.2 seladas").

`.claude/BACKLOG.md` foi escolhido por eliminação, com um critério técnico
específico: `docs_phase5/**` e `.claude/project-memory/**` estão **excluídos
do registry de pins** (`.claude/verify/pins.json → _meta.exclusoes`) porque um
é histórico selado e o outro é estado de processo que muda por fase, validado
pelo stage `state`, nunca por pin (R13, linha "planning-state/project-memory
fora do registry"). Um backlog de achados não é nem um nem outro — é
**registro durável**, do mesmo tipo que uma regra ou um template. Por isso vive
sob `.claude/` e é pinado como os demais 67 arquivos ali, sujeito ao mesmo rito
de repin (R8) que qualquer alteração.

## Namespace de id: `EA-*`, não a continuação de `E*`

A série `E1…E12` pertence ao documento fundador, cujo **texto completo não
está neste repositório** — não há como saber, sem lê-lo, se `E13` já foi usado
ou reservado lá. Continuar a numeração alheia arriscaria colisão e violaria
"números citados nunca renumeram" (R12): se o documento fundador um dia for
trazido para o repositório com um `E13` já definido, um `E13` daqui teria de
ser renumerado — exatamente o que a regra proíbe.

**Decisão**: achados nascidos **sob a Estrutura Agêntica** (2026-08-25 em
diante, neste repositório) usam a série **`EA-*`** (Estrutura Agêntica),
começando em `EA-1`. A série `E-*` permanece citável como histórico — as
regras que a citam não são retro-editadas (R13) — mas não recebe novos
membros por aqui.

## Rito de escrita da linha de status

Todo achado tem, na **primeira linha não vazia após o heading `## EA-*`**,
uma linha de status em forma canônica: rótulo em negrito fechado
(`**Status**`), dois-pontos **fora** do negrito, um espaço, valor entre
**crases**, sem ponto final. Vocabulário fechado, minúsculas,
case-sensitive — 4 estados:

    **Status**: `aberto`
    **Status**: `resolvido`
    **Status**: `refutado`
    **Status**: `transferido`

Eventos que escrevem a linha (mantenedor declarado: `doc-writer`,
`BACKLOG.md:3`): abertura de achado → `aberto`; fix-finding §4 ("o que foi
feito", com PR/commit registrado na prosa) → `resolvido`; fix-finding §1
("se não reproduz: risque com a razão") → `refutado` (título e corpo
riscados, linha de status limpa); migração para `design-decisions.md`
(R12/R13) → `transferido`, com ponteiro na prosa. Fix-finding **em curso**
não muda o estado.

**Data de abertura** (recomendada, não exigida pelo gate — decisão 1.3 da
demanda 012, `specs/012-status-backlog/spec.md`): registre-a na prosa de
cada achado novo, para a revisão humana; o parser não a confere.

**Prefixo reservado**: dentro de um bloco de achado (do heading `## EA-*`
até o próximo `## ` ou o fim do arquivo), qualquer linha começando com
`**Status` em coluna 0 é lida como candidata a linha de status e precisa
casar a forma canônica acima — não escreva prosa com esse prefixo em coluna
0 dentro de um bloco de achado; reformule ou desloque.

Os quatro exemplos acima ficam **antes do primeiro achado** (auto-exclusão
de escopo de bloco, R10 §10) e **em código indentado (4 espaços)**, nunca em
coluna 0: a indentação retira o `^` que o parser exige tanto do heading de
achado (`^## `) quanto da candidata a status (`^\*\*Status`) — nenhum
exemplo deste rito vira achado ou candidata fantasma.

---

## EA-1 — As três listas de proteção nunca foram reconciliadas

**Status**: `resolvido`

**Mesmo formato do achado E2** ("a §29.4 da spec (prosa) não impediu edição de
protegidos nas fases 5.1/5.2" — citado em
[`boundary.md`](rules/boundary.md) como origem da R6): prosa declara proteção
que a máquina não sustenta por completo. EA-1 é a versão atual, mais fina, do
mesmo fenômeno — desta vez com um gate real no meio, mas com uma lacuna de
cobertura dentro dele.

### Cadeia arquivo:linha → efeito

Três listas de proteção, nunca reconciliadas entre si:

1. **`specs/PHASE_5_0_REV_B.md:1613-1620`** (§29.4, "Protegidos — lista
   nominal; edição proibida nesta fase"): nomeia ~14 arquivos nominais **e**,
   por extenso, "todas as suítes congeladas (`tests_*.js` existentes,
   incluindo `tests_unset_ug.js`)". É **prosa de spec selada** — nada a
   executa; o próprio gate que verifica a spec (`P50-GOV2`,
   `tests_p50_core.js:245`) só confere o SHA-256 do arquivo inteiro, não o
   cumprimento do que o texto promete.
2. **`tests_p50_core.js:82-228`** — mapa `PROTECTED`, 16 entradas (14 arquivos
   nominais + `tests_unset_ug.js` + `MANIFEST.sha256`). **Entre as suítes
   `tests_*.js`, só `tests_unset_ug.js` está aqui.**
3. **`.claude/verify/boundary.json`** — 9 paths em 4 classes: `frozen` (4:
   `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`,
   `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json`), `generated` (2),
   `legacy` (2), `registry` (1). Nenhuma suíte `tests_*.js` aparece aqui —
   confirmado por leitura direta do arquivo nesta sessão.

O gate **`P50-GOV1`** (`tests_p50_core.js:231`, "nenhuma superfície protegida
da §29.4 foi alterada — identidade byte-a-byte") faz **duas verificações de
força diferente**, e essa distinção é o coração do achado:

- `tests_p50_core.js:232` — identidade **byte a byte** (SHA-256) sobre as 16
  chaves de `PROTECTED`.
- `tests_p50_core.js:235-238` — apenas **presença** (`fs.existsSync`,
  `tests_p50_core.js:239`) sobre `frozenSuites`, um array literal de 13
  suítes congeladas (`tests_m42_m86.js` … `tests_session_m48.js` …
  `tests_unset_ug.js`).

~~**Efeito**: das 13 suítes que §29.4 declara "edição proibida nesta fase", só~~
~~`tests_unset_ug.js` tem identidade byte a byte fixada por algum gate — as~~
~~outras **12 podem ser editadas livremente sem que nenhuma máquina reclame**,~~
~~apesar da prosa dizer o contrário. `P50-GOV1` continua passando: o arquivo~~
~~ainda existe, só não é mais o mesmo.~~

**Refutado no fix-finding (2026-08-30), riscado e mantido (R2 §5)**: o efeito
está errado em dois pontos — as 13 suítes estão **todas** pinadas em
`.claude/verify/pins.json` (stage `baseline`, que reprova divergência) e
`tests_icons_m46.js` tem identidade byte a byte num segundo gate. Os números
conferidos estão em §Resolução, abaixo; a cadeia das três listas (itens 1-3
acima) permanece verdadeira e é o que sustenta a Face A.

### Duas faces, com remédios diferentes

Misturar as duas faces no mesmo fix enfraqueceria as duas — são falhas de
natureza distinta:

- **Face A — arquivo citado na §29.4 *e* presente em `PROTECTED`.** O gate
  pega a mudança, mas **tarde**: só no meio da implementação, quando a suíte
  roda. A demanda 009 viveu isso e precisou de autorização nominal do
  proprietário para prosseguir (relatado pela sessão da 009; não
  re-verificável nesta branch porque `specs/009-*/` não existe neste
  worktree). É falha de **processo**: o cross-check de Fase 1 (spec → plan)
  não abre as specs de fase já seladas para conferir se o trabalho novo
  esbarra numa delas. **Remédio**: template de spec — o cross-check da Fase 1
  passa a listar explicitamente os protegidos de fases seladas relevantes ao
  escopo da demanda nova.
- **Face B — arquivo citado na §29.4 mas *ausente* de `PROTECTED`.** Nada
  pega, nunca — nem tarde. É falha de **cobertura de gate**: a prosa declara
  uma proteção que nenhuma asserção sustenta. **Remédio**: decidir qual fonte
  é a verdadeira (a prosa está certa e o gate precisa de mais 12 entradas
  byte-a-byte? ou o gate está certo e a prosa da §29.4 é que está
  desatualizada?) e alinhar a outra — sem tocar a spec selada por fora do rito
  P50-GOV2.

### Tensão que o fix terá de resolver (registrada, não resolvida aqui)

Aplicar a §29.4 ao pé da letra — byte-identidade para as 13 suítes congeladas
para sempre — congelaria toda `tests_*.js` permanentemente e tornaria letra
morta tanto a R10 §3 ("suíte nova entra no registro no mesmo PR", que pressupõe
suítes vivas e editáveis) quanto o papel do `qa-engineer` como dono vivo dos
gates. A hipótese mais econômica, subscrita pelas duas sessões (008 e 009): a
distinção **é proposital** — byte-identidade reservada para o gate que sustenta
a INV-2 (`tests_unset_ug.js`, com a errata UG8 já registrada e confirmada em
[`design-decisions.md`](rules/design-decisions.md), linha "Exceção UG8 no
oráculo do p50_core") e presença (não apagar, mas poder evoluir) para as
demais. Se essa hipótese se confirmar, quem está desatualizada é a prosa da
§29.4, e o fix alinha o texto ao gate — não o contrário. ~~Esta é uma hipótese a~~
~~ser decidida pelo `product-owner`/proprietário no fix-finding, não uma~~
~~conclusão deste registro.~~ **Riscado (R2 §5)**: não era hipótese a decidir —
a decisão já existia quando este registro foi escrito
(`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2, 2026-08-25).

### Precedente concreto (registrado com honestidade)

A demanda **008** (`specs/008-migracao-zips/`) editou `tests_session_m48.js`
— commit `7cd3182` (`refactor(008): S64/S74+S75/S113 leem o blob do
commit-ancora`) — um caso de **Face B**: `tests_session_m48.js` está na
§29.4 e em `frozenSuites`, mas nunca esteve em `PROTECTED`. Pipeline completo
**14/14** e CI verde **duas vezes** (branch da 008 e pós-merge do PR #21) —
**nada executável foi violado**, porque nenhuma asserção de gate cobria aquele
arquivo por identidade byte a byte. Decisão registrada e subscrita pela
demanda 009: **não agir retroativamente** — reabrir um trabalho já mesclado e
verde com base em prosa ambígua trocaria um risco documentado por um risco
real (reabrir histórico auditado por causa de um achado que a própria máquina
não sustentava no momento da edição).

### Encaminhamento

O proprietário já encomendou um `fix-finding` para EA-1 — **a abrir depois
que a demanda 009 fechar**. Este registro é o insumo: a cadeia
arquivo:linha→efeito, as duas faces com remédios distintos, a tensão a
resolver e o precedente a não reabrir. Nenhuma decisão de correção foi tomada
aqui — só o registro do achado (R12; este documento não decide PASS/FAIL,
papel do `doc-writer`).

### Resolução — o que foi feito

`fix-finding` encomendado nominalmente pelo proprietário, aplicado em
`fix/ea1-crosscheck-specs-seladas` (de `origin/develop`, `4092463`), em dois
commits separados: o conteúdo e este fechamento.

**Face A — remédio aplicado no template.** `.claude/templates/spec.md`, seção
`## Cross-check (obrigatório)`: entrou um **5º item** — "Specs de fase seladas
— por leitura, não por memória", que manda abrir as specs de
`current_phase.json → specs_normativas` e citar `arquivo:linha` do que toca o
escopo, **inclusive o resultado negativo** ("nada sobre <tema> em <arquivo>"),
que também é leitura. E o item de **Boundary** foi reescrito para cruzar as
**três** fontes (`.claude/verify/boundary.json` · `PROTECTED` e `frozenSuites`
em `tests_p50_core.js` · `.claude/verify/pins.json`) com **regra de
precedência** escrita: onde a prosa de spec selada divergir do executável, vale
o regime de pins (R8; `RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2), e a
divergência vira **achado** aqui — nunca edição de spec selada. É essa cláusula
que fecha a tensão em vez de a redocumentar: sem ela, toda Fase 1 futura
reabriria a mesma discussão. Precedente de forma, já praticado fora do template:
`specs/013-integridade-da-campanha/spec.md:370` e `:380`.

**Duas correções de fato ao registro original** (o texto errado fica riscado
acima, com a razão — R2 §5; nada é apagado):

1. **As 13 suítes de `frozenSuites` estão todas pinadas.** `frozenSuites`
   (`tests_p50_core.js:400-403`) lista 13 arquivos; os 13 têm entrada em
   `.claude/verify/pins.json` — conferido nesta branch, um a um, 13/13
   presentes. O stage `baseline` reprova divergência de identidade
   (`.claude/verify/check_baseline.py:57`, `[FAIL] pin diverge`, com
   `sys.exit(1)` em `:68`), e também "rastreado sem pin" (`:61`). Logo,
   "editáveis sem que nenhuma máquina reclame" é **falso desde a Onda 0**: o
   que `P50-GOV1` não fixa por byte, o registry de pins fixa.
2. **`tests_icons_m46.js` é a segunda suíte pinada por byte.** Além de
   `tests_unset_ug.js` em `PROTECTED`, ela está em `FROZEN_VISUAL_AUTHORITY`
   (`tests_p50_core.js:2655`), asserida por `P50-COR4` (`:2664`, identidade
   SHA-256 em `:2666-2671`). São **2 de 13**, não 1.

**Face B — encerrada por remissão, não por conserto.** O que o registro tratou
como "hipótese a ser decidida" já era disposição vigente:
`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, **Disposição §2** (2026-08-25)
— "o freeze acumulativo da estrutura parte do estado REAL: a identidade vigente
de todos esses arquivos está pinada em `.claude/verify/pins.json` e protegida
por `boundary.json` + `guard-boundary` + stage `boundary`". Nenhuma lista foi
alinhada, ampliada ou reescrita neste fix: a Face B se lê contra o regime que a
supera, e é para ele que este achado passa a apontar.

**A §29.4 permanece intocada.** `specs/PHASE_5_0_REV_B.md:1613-1621` foi aberta
só para conferência de leitura. Alterá-la é rito — `P50-GOV2`
(`tests_p50_core.js:410`) confere o SHA-256 do arquivo inteiro contra
`CLAUDE.md` e o registro de promoção, e `current_phase.json → specs_normativas`
registra o mesmo hash: mexer no texto seria promoção de REV C, expressamente
fora desta tarefa. A prosa da §29.4 não precisava de conserto — precisa ser
lida junto com o registro que a supera, e é isso que o template agora obriga.

**Evidência**: `bash .claude/verify/compliance-audit.sh --rule=backlog` →
`1 PASS · 0 FAIL`, **5 achados abertos** (EA-1 sai da listagem: EA-3, EA-4,
EA-5, EA-6, EA-7). `gen_pins.py` **não foi rodado** neste passo — o repin do
registry (`.claude/templates/spec.md` e `.claude/BACKLOG.md` são pinados,
R8 §1) é do `build-engineer`, no mesmo PR.

### Instância adicional observada, mesma propriedade (demanda 014, 2026-09-01)

`specs/014-gate-sem-poder-discriminante/refinement.md:47-53` e
`specs/014-gate-sem-poder-discriminante/spec.md:299-305` (branch
`feature/014-gate-sem-poder-discriminante`, **não mesclada**) registraram uma
nova divergência de leitura, com **outro par de documentos e outros
arquivos**: `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md` afirma que
`ui_p50_v32.css`, `tests_p50_chromium.js` e `tests_p51_mutants.js` estão
"protegidos por `boundary.json`" (tocados pelas fases 5.1/5.2 seladas), e
`.claude/verify/boundary.json → frozen` **não os lista** (lista só
`engine_v32.js`, a Camada 1, o harness M41 e o snapshot — 4 entradas,
conferido por leitura em 2026-09-01).

**Verificado nesta sessão, contra `pins.json`**: os três arquivos citados
**estão pinados** — `ui_p50_v32.css`, `tests_p50_chromium.js` e
`tests_p51_mutants.js` ocorrem em `.claude/verify/pins.json` (grep direto, 3/3
presentes). Ou seja: é **exatamente a mesma propriedade** já fechada acima na
Face B — a proteção real destes três é de **identidade** (regime de pins, R8),
não de **proibição** (`boundary.json` + D2), e
`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md` continua sendo lido contra o
regime que o supera (Disposição §2, citada acima), nunca editado (é registro
selado — R13, linha "Fases 5.0–5.2 seladas").

**Por isso não abre id novo**: a 014 cogitou tratar isto como achado próprio
(`spec.md:299-305`, "Pela regra do template isso é achado de backlog"), mas a
conferência contra `pins.json` mostra que não há propriedade nova — é a Face B
deste `EA-1`, com outra lista de arquivos. Registrado aqui, e não em id
próprio, para não desgastar a confiança nos achados reais com a reabertura do
que já está `resolvido` (R13). Se uma leitura futura encontrar um arquivo
citado por `RECONCILIACAO_BOUNDARY_5_1_5_2.md` como "protegido por
`boundary.json`" e que **não** esteja em `pins.json` — aí sim a Face B reabre,
porque a proteção alegada deixaria de ter qualquer sustentação executável.

## EA-2 — A seção `waivers` reporta um waiver TDD que não existe

**Status**: `resolvido`

**Aberto em**: 2026-08-29. Achado colateral da campanha de mutantes da
demanda 012 (`specs/012-status-backlog/matriz-gate-mutante.md`, T006),
descoberto pelo `qa-engineer` e deliberadamente adiado — ver §Por que é
notável, e por que foi adiado abaixo.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/compliance-audit.sh:126`** — a seção `waivers` roda
  `grep -l "tdd_waiver" .claude/project-memory/planning-state/*.json` para
  listar planning-states com waiver TDD ativo.
- **`.claude/project-memory/planning-state/012-status-backlog.json:5`** — o
  campo `brief` contém, **em prosa**, a palavra `tdd_waivers` (ao descrever a
  própria demanda: "…listar achados abertos como já faz com os
  tdd_waivers").
- `grep` casa **substring livre**, sem fronteira de chave JSON estruturada —
  não distingue a chave `tdd_waiver` de uma menção em texto corrido.
- **Efeito**: a cada execução do audit, a seção `waivers` lista
  `.../012-status-backlog.json` como "waiver TDD ativo" sem existir a chave
  `tdd_waiver` nesse arquivo. Conferido por execução: dos 4 planning-states
  existentes, só o da 012 casa (`grep -c "tdd_waiver"` = 1); os de 003, 007 e
  008 dão 0.
- **Severidade**: ruído de exibição — **nunca vira FAIL**, a seção emite `ok`
  em ambos os ramos (com ou sem waiver listado). Não bloqueia pipeline.

### Por que é notável, e por que foi adiado

Este achado é **o mesmo defeito** que a própria demanda 012 curou uma seção
abaixo: status lido por substring livre sobre prosa, em vez de campo em
gramática fechada com parse que reprova o que não casa. A seção `waivers` foi
o **precedente** que a seção `backlog` espelhou (`plan.md` da 012: "a seção
`backlog` segue a anatomia das 7 seções irmãs") — e o espelho, ao nascer com
parser fechado, revelou o defeito do original.

Descoberto pelo `qa-engineer` durante a campanha de mutantes da 012 (T006) e
**deliberadamente adiado**, por três razões registradas na matriz da 012:
"corrigir de passagem" é exatamente a disciplina que deu origem à demanda 012
(R5 §anti-patterns); tocar `waivers` naquele momento invalidaria a prova de
regressão das 7 seções irmãs já executada (BS-1); e o dano observado é
**ruído**, não falha — não há PASS/FAIL incorreto em jogo.

### Nota de guarda do `product-owner`

A correção **não é** editar a prosa do campo `brief` no planning-state da 012
para remover a palavra `tdd_waivers` dali — isso **mascararia o caso de
reprodução** em vez de corrigir o scanner: o caso vivo
(`012-status-backlog.json` com `tdd_waivers` em prosa, ao lado dos outros 3
planning-states sem a palavra) é o que torna o `fix-finding` fácil de provar
por execução. A correção pertence a
`.claude/verify/compliance-audit.sh:126` — casar campo estruturado (a chave
JSON `"tdd_waiver"`, com aspas) em vez de substring livre no texto.

### Resolução — o que foi feito

`fix-finding` provado e commitado em **`e9329de`**
(`fix(ea2): secao waivers casa a chave JSON tdd_waiver, nao substring em
prosa`): na seção `waivers` de `.claude/verify/compliance-audit.sh`, o
`grep -l "tdd_waiver"` deu lugar a um **parse da chave JSON de topo**
`tdd_waiver` via `$PYBIN` — o mesmo padrão já usado pelas seções irmãs
(`known-issues`, `backlog`) — com stdout UTF-8 explícito, ordem
determinística e arquivo ilegível **listado nomeando a causa**, nunca
pulado em silêncio (R10 §2).

Três provas executadas e registradas pelo `qa-engineer`:

- **Negativo** (árvore real): `[PASS] waivers TDD: nenhum ativo` — o
  fantasma do planning-state da 012 sumiu da listagem.
- **Positivo** (worktree efêmera, `tdd_waiver: {motivo, data}` real inserido
  numa cópia do planning-state da 008): o waiver **verdadeiro continua
  listado** — o falso positivo foi eliminado sem criar falso negativo, que
  era o risco central da correção.
- **Adversarial**: o planning-state da 012 — com o substring `tdd_waivers`
  na prosa do `brief`, **intocado** — não aparece mais na listagem.
- Borda extra provada: JSON corrompido é listado como ilegível, com a causa
  nomeada, nunca `SKIP` silencioso.
- `compliance-audit` completo: **13 PASS · 0 FAIL**.

**O caso de reprodução continua vivo e intocado**: a prosa do campo `brief`
do planning-state da 012 (`.claude/project-memory/planning-state/012-status-backlog.json:5`)
segue com a palavra `tdd_waivers`, e agora ela é **corretamente ignorada** —
é a prova permanente de que o scanner passou a distinguir campo estruturado
de texto corrido. A nota de guarda do `product-owner` foi honrada: a
correção não mascarou o caso editando a prosa do `brief`; corrigiu o
scanner, com o caso vivo como prova.

### Encaminhamento original (histórico)

`fix-finding` próprio para o `grep` da seção `waivers` — sem spec (não cria
comportamento novo; corrige o oráculo para parar de casar prosa como se fosse
dado estruturado). Cumprido — ver §Resolução acima.

## EA-3 — O stage `mutation` não sabe dizer o que não está checando

**Status**: `aberto`

**Aberto em**: 2026-08-29. Nasceu ao conferir a premissa de uma rota registrada
do backlog ("Onda 3 — harness de mutação scriptado, KI-2") antes de abrir
trabalho sobre ela: a premissa estava **vencida**. `known_issues.json →
_meta.descricao` registra que **KI-2 foi cumprida na Onda 4** (harness
scriptado, trigger por path). Ao ler o mecanismo já existente para confirmar,
encontrou-se este defeito nele.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/check_mutation.py:58-59`** — o stage percorre **os
  harnesses declarados**, não os arquivos que mudaram: `for name, h in
  MAP.items(): due = ... any(t in changed for t in h["targets"])`.
- Um arquivo que mudou e não figura nos `targets` de **nenhum** harness nunca
  é avaliado — não emite `OK`, `WARN` nem `FAIL` **sobre ele próprio**. Mas o
  efeito agregado é pior que silêncio simples (detalhe confirmado
  independentemente pela sessão da demanda 009, verificado aqui no source):
  `.claude/verify/check_mutation.py:61` emite, para cada harness cujos
  `targets` não mudaram, `[OK]   <nome>: nenhum alvo mudou desde a base —
  campanha não exigida`. Com os 4 harnesses inertes ao mesmo tempo em que o
  arquivo órfão mudou, a saída do stage é **só verdes** — e quem a lê conclui,
  corretamente pela mensagem e **incorretamente pelo fato**, que nenhuma
  campanha era necessária. Formulação da sessão da 009, que vale citar por
  precisão: *"um `[OK]` que mente por omissão é pior que um `[FAIL]`, porque
  ninguém investiga um verde."* **Não existe checagem de órfão.**
- **`.claude/verify/mutation_map.json → harnesses`** — 4 harnesses (`core`,
  `p50`, `p51`, `p52`), todos com `targets` de módulos de UI da fase 5
  (confirmado por leitura: nenhum deles cita qualquer arquivo de
  `.claude/verify/` nem `tests_session_m48.js`). Contagem verificada nesta
  sessão, na `develop`: 21 entradas somadas nos 4 arrays `targets` (16
  arquivos distintos, com sobreposição entre harnesses — `ui_v32.js` e
  `ui_session_v32.js` aparecem em mais de um). A sessão da 009 mediu 20
  arquivos distintos na própria branch, que carrega um harness a mais —
  `d009` (9 targets), criado pela demanda 009 e ainda não mesclado na
  `develop` no momento desta medição. As duas contagens estão corretas em
  suas respectivas árvores: nenhum engano, só contexto de árvore que
  faltou registrar na primeira vez. Vale reter mesmo sem divergência real:
  **o número de arquivos órfãos depende de qual árvore se mede** — dado
  relevante para quem desenhar o conserto (o inventário de órfãos não é
  uma constante do repositório, muda conforme harnesses novos chegam).
- **Efeito**: os gates entregues pelas demandas 008 e 012 são **órfãos** do
  stage. Provados os seis: `.claude/verify/check_evidence_bridge.py`,
  `.claude/verify/gen_evidence_bridge.py`, `.claude/verify/evidence_bridge.json`,
  `tests_session_m48.js`, `.claude/verify/compliance-audit.sh` e
  `.claude/BACKLOG.md` — a sessão da 009 amostrou 4 destes 6
  independentemente e confirmou todos. Execução confirmatória nesta sessão:
  `bash .claude/verify/run.sh --stage=mutation` na árvore atual → `[PASS]
  mutation`, sem uma linha sequer sobre qualquer um dos seis.
- **Consequência concreta e documentada**: na validação da 012 (T007), o
  stage relatou "0 campanhas exigidas" **enquanto** o `qa-engineer` executava
  à mão uma campanha real de 6 mutantes + 2 sondas exatamente sobre esses
  arquivos (`specs/012-status-backlog/matriz-gate-mutante.md`). A campanha
  existiu; a máquina não soube dizer que existia, nem que era necessária.
- **Severidade**: cobertura silenciosa. Não é `FAIL` hoje — e é justamente
  esse o problema: a ausência de campanha é **indistinguível** de "campanha
  não exigida". Contraste com o desenho deliberado do resto do arquivo:
  harness com `requires` ausente é reportado **por nome** (R10 §2, "SKIP
  silencioso é FAIL") — a disciplina existe para o ambiente e falta para a
  cobertura.

### Achado-irmão (autoria da demanda 009 — citado, não registrado aqui)

No mesmo dia, a sessão da demanda 009 encontrou o defeito complementar da
mesma família: **âncora textual de mutante apodrece em silêncio** quando o
dono do módulo reescreve a linha-alvo, e só a execução da campanha detecta —
sempre depois do fato. Eles observaram cinco casos (`M51-16`, `M51-18`,
`M51-20`, herdados e pré-existentes, mais `D009-M16` e `D009-M5`, apodrecidos
por correção legítima do módulo). Esse achado é **de autoria da sessão da
009** e será registrado como **`EA-4`** quando a 009 fechar — não é
registrado por mim aqui, só citado como irmão.

**A distinção entre os dois importa**: `EA-3` é **ausência de harness** — o
arquivo nunca entra em campanha alguma, o sistema não sabe que deveria
verificá-lo. `EA-4` é **decaimento dentro de um harness já registrado** — a
campanha roda, mas a âncora não casa mais com o texto atual do módulo. Mesma
família de causa raiz (o sistema de mutação não sabe dizer o que **não**
está checando, seja por ausência de harness, seja por âncora podre dentro de
um harness que existe) — remédios diferentes, portanto achados distintos com
ids distintos.

### Propriedade combinada — o EA-3 e o EA-4 fecham um ciclo

Os dois achados não são só irmãos por família de causa: são
**complementares**, e a soma das duas metades revela uma propriedade que
nenhum dos dois sozinho deixa ver. Formulação da sessão da 009, registrada
aqui com crédito:

- `EA-3` diz: arquivo **fora** de `targets` nunca entra em campanha.
- `EA-4` diz: arquivo **dentro** de `targets` pode carregar mutante cuja
  âncora não casa mais com o texto atual do módulo.

> **Um verde da campanha de mutação não prova cobertura. Prova apenas que
> nada do que ainda está registrado e ainda casa falhou.**

O que torna isso difícil de enxergar por conta própria: as duas metades da
negação vivem em **lugares diferentes do sistema** — uma na ausência de
entrada em `mutation_map.json`, outra na obsolescência de uma âncora dentro
de uma entrada existente — e **nenhuma das duas é visível de dentro do
relatório da campanha**. Quem lê `4 campanha(s) executada(s) · 0
problema(s)` não tem como saber, só por essa linha, quantos alvos deixaram
de existir (EA-4) nem quantos arquivos nunca foram alvo (EA-3).

### Encaminhamento

**Demanda própria** — não é `fix-finding`: criar checagem de órfão e/ou
registrar harnesses novos é comportamento e gate novos (R10 "Nascimento de
gate": caso positivo/negativo/adversarial/regressão + mutante próprio),
exige spec (R4). A abrir quando o proprietário decidir. Este registro
descreve o defeito e a cadeia verificada — **não propõe o desenho da
correção**; o desenho, se a demanda abrir, é da spec.

## EA-4 — Âncora de mutante apodrece em silêncio; o aviso existe, mas só quando alguém puxa o gatilho

**Status**: `aberto`

**Aberto em**: 2026-08-29. **Autoria da sessão da demanda 009**, que encontrou o
defeito no mesmo dia do `EA-3` e o descreveu como o irmão complementar dele; o
registro do `EA-3` já reservou nominalmente este id ("será registrado como
`EA-4` quando a 009 fechar", §Achado-irmão). O id é alocado aqui, na série
`EA-*`. A cadeia abaixo foi **re-verificada nesta árvore**
(`feature/013-integridade-da-campanha`, demanda 013), não herdada de relato
(R2 §4).

### O que o sistema faz quando falha — é isto que o separa dos vizinhos

O harness **avisa**: `ERRO <id> · alvo não encontrado em <arquivo>`. Honesto — e
**tardio**, porque o aviso só sai quando a campanha roda, e a campanha só roda
quando o gatilho de path dispara **e** o ambiente existe. Contraste dentro da
mesma família: `EA-3` é o verde que **mente por omissão** (arquivo fora de
`targets` nunca entra em campanha alguma, e o stage diz `[OK] … campanha não
exigida`); `EA-5` é o número que **afirma o que não mediu**.

### Cadeia arquivo:linha → efeito

- **`tests_p51_mutants.js:196-198`** (estado anterior à demanda 013 — lido em
  `b725820`): o laço da campanha conta as ocorrências da âncora no alvo
  (`const n = src.split(m.find).length - 1;`) e, com `n < 1`, imprime
  `ERRO  <id> · alvo não encontrado em <arquivo>`, empurra
  `{ id, detected: false, why: "alvo não encontrado" }` e segue para o próximo
  mutante. Mesma família nas outras harnesses: `tests_p52_mutants.js:36-38`
  registra que, antes da 013, havia um rótulo `"NÃO APLICÁVEL"` para âncora
  podre "e todo o resto caía em `NÃO DETECTADO`".
- **`.claude/verify/check_mutation.py`, laço de trigger** — `due = changed is
  None or any(t in changed for t in h["targets"])`: a campanha só é **exigida**
  quando um alvo declarado muda em relação à base. Sem mudança, o harness nem é
  invocado, e a contagem de âncoras de `tests_p51_mutants.js:196-198` não
  acontece.
- **`.claude/verify/mutation_map.json → harnesses.*.requires`**: `p50`, `p51` e
  `p52` exigem `chromium` — ausente na máquina do proprietário e no job `verify`
  do CI. Sob `MUTATION_DEFER_MISSING=1` a campanha exigida vira `[DEFER]`
  nomeado e o stage passa; a contagem de âncoras, de novo, não acontece.
- **Efeito**: entre um gatilho e o seguinte, a âncora pode ter deixado de casar
  com o texto do módulo há meses sem que nenhuma máquina diga isso. O aviso
  existe; o que falta é verificação que **não dependa de alguém acionar a
  campanha**.

### Evidência medida na demanda 013

- **Oito âncoras podres em 180**, na primeira varredura das três harnesses:
  quatro já conhecidas (`M51-03`, `M51-16`, `M51-18`, `M51-20`) e **quatro que
  só o preflight revelou** — `p50/M13`, `p50/M23`, `p50/M35`, `p52/V322-M3`.
  `M35` é a **única ambígua** (`ocorrencias=2`); as outras sete são
  `ocorrencias=0`.
- **`M13`, `M23` e `M51-03` apodreceram no MESMO commit**: `4aa1f12`
  (`feat(phase5): complete Phase 5.1 UAT, executive report, user guide and
  errata`, 2026-08-22) — três âncoras, um alvo (`ui_p50_shell_v32.js`), uma
  reescrita. Confirmado por arqueologia `git log -S`
  (`specs/013-integridade-da-campanha/matriz-gate-mutante.md` §9).
- **`V322-M3` nasceu podre**: `ocorrencias=0` no próprio commit de autoria,
  `df5d9f6` (`fix(v3.2.2): finalize context keyboard and transition UX`,
  2026-08-25). O gate `V322-CTXPAR1` **nunca** rodou contra esta mutação. É o
  que explica o `106/107` do CI — **não era sobrevivente nem regressão**; era um
  mutante que nunca existiu na prática, somado como não-detectado por um
  relatório de dois estados (ver `EA-5`).
- Nenhuma das oito respondeu "propriedade morta": as oito deram **reancorar**,
  com gate e propriedade vivos. Âncora podre não é propriedade extinta — e é por
  isso que o defeito é de **instrumento**, não de desenho do mutante.

### O que a demanda 013 mudou, e o que este registro não decide

A 013 introduziu `--preflight` (contrato C1) em `p50`/`p51`/`p52` e a asserção
`IC-4` no stage `mutation`, que conta as ocorrências de cada âncora **fora** do
laço de trigger e **independente de `requires`**. Foi esse instrumento que
produziu os números acima. O `core` segue **sem** preflight — dívida declarada e
impressa pelo stage (`[DÍVIDA] core: sem preflight declarado — âncora podre só
aparece na execução da campanha`), registrada em
`.claude/verify/mutation-matrix.json → dividas_declaradas`. **Se isso fecha o
`EA-4`, quem declara é o `qa-engineer`, por execução citável, em fix-finding**;
este registro descreve o defeito e a cadeia e não decide PASS/FAIL (R12 — papel
do `doc-writer`).

## EA-5 — Harness que não rodou reporta `NÃO DETECTADO`: o número não distingue "não executei" de "executei e escapou"

**Status**: `aberto`

**Aberto em**: 2026-08-29. Nasceu do red da demanda 013 (cenário IC-3(a),
`specs/013-integridade-da-campanha/red-integridade.md:119-149`), medido em
worktree efêmera e descartada, com as harnesses **intocadas**.

### O que o sistema faz quando falha

**Afirma.** `EA-3` cala (verde por omissão) e `EA-4` avisa tarde; `EA-5` produz
um **veredito sobre um gate que nunca rodou** e o soma numa razão `D/T` que tem
a aparência de medição. É o único dos três que é **desonesto** no sentido
estrito: a saída não é incompleta, é falsa.

### Cadeia arquivo:linha → efeito

Lida no estado anterior à demanda 013 (`b725820`), na `p51`; a mesma forma de
dois estados valia nas quatro harnesses:

- **`tests_p51_mutants.js:185-188`** — `run(cmd)` embrulha `execSync` num
  `try/catch` e devolve `{ code, out }`, com `out` juntando stdout e stderr. O
  código de saída **é** capturado ali.
- **`tests_p51_mutants.js:201-203`** — o laço chama `const r = run(m.cmd);`,
  procura em `r.out` a linha `FAIL  <gate>` e conclui
  `const detectado = !!linhaFail && m.reason.test(linhaFail);`. **`r.code` nunca
  é lido.** Interpretador ausente, build quebrado, suíte que não emitiu a linha
  do gate esperado e gate que rodou e passou produzem todos `linhaFail === ""` —
  **indistinguíveis**.
- **`tests_p51_mutants.js:209`** — imprime `NÃO DETECTADO <id> · <desc>`, o
  mesmo rótulo que um mutante genuinamente sobrevivente recebe.
- **`tests_p51_mutants.js:214`** — `MUTATION TESTING (Phase 5.1): <ok>/<total>
  mutantes detectados pelo gate e motivo esperados`: o denominador conta o que
  nunca foi medido, e a frase afirma "detectados pelo gate e motivo esperados"
  sobre execuções em que gate nenhum foi consultado.
- **Efeito**: a campanha reporta cobertura que não exerceu. Um `0/1` de ambiente
  ausente é tipograficamente idêntico a um `0/1` de gate sem poder
  discriminante — e o segundo é defeito grave, enquanto o primeiro é apenas uma
  máquina errada. Quem lê a razão não tem como separar os dois.

### Evidência medida na demanda 013

- **Cenário IC-3(a)** (`red-integridade.md:129`): worktree efêmera em `3e43a15`,
  `PATH` reduzido a `nodejs` + `System32` — nem `python` nem `python3` resolvem,
  verificado —, `MUT_ONLY=M51-01`. A `p51` imprimiu `NÃO DETECTADO M51-01 · …`
  seguido de `MUTATION TESTING (Phase 5.1): 0/1 mutantes detectados pelo gate e
  motivo esperados`, exit 1, `git status --porcelain` vazio. **O gate
  `P51-VIS1` não chegou a ser invocado**: o build inicial nem rodou.
- **Um mutante foi medido, não os vinte.** A execução da campanha completa era
  proibida naquela wave; o cenário isolou `M51-01` justamente para não disparar
  campanha. A generalização — numa máquina Windows, onde o literal `python3` do
  harness não resolve, os vinte mutantes da `p51` cairiam no mesmo rótulo — é
  **inferência da cadeia acima**, não medição, e fica marcada como tal.
- **Divergência registrada no mesmo cenário**: `p50` e `p52` **abortam** (exceção
  não capturada em `build()` na `p50`; `MUTATION P52: falha fatal` na `p52`).
  As duas formas violam o vocabulário, mas em direções opostas — a `p51`
  **inventa veredito**, `p50`/`p52` **não chegam a falar**. Defeitos diferentes,
  remédios diferentes; registrado para que o conserto de um não seja lido como
  conserto do outro.
- **Efeito agregado observado no CI**: o `106/107` da `p52` contava `V322-M3`
  como não-detectado quando `V322-CTXPAR1` jamais rodou contra a mutação —
  âncora podre de nascença (`EA-4`). A aritmética estava certa; o significado,
  errado.

### O que a demanda 013 mudou, e o que este registro não decide

A 013 substituiu os dois rótulos por um **vocabulário fechado de três estados**
— `DETECTADO` · `SOBREVIVENTE` · `NÃO EXECUTADO`, este último sempre com **uma**
causa de conjunto fechado (`interpretador ausente`, `âncora não encontrada`,
`âncora ambígua`, `rebuild falhou`, `gate não pôde ser executado`) — nas três
harnesses defeituosas, com a regra de que um número não medido não é impresso.
O `core` ficou fora por decisão de escopo (é a referência do interpretador).
**Se isso fecha o `EA-5`, quem declara é o `qa-engineer`**, por execução
citável; este registro não decide PASS/FAIL.

## EA-6 — Pré-condição decorativa: o requisito `python` era declarado por quatro harnesses e não podia reprovar em nenhum

**Status**: `aberto`

**Aberto em**: 2026-08-29. Encontrado pelo `product-owner` na Fase 0 da demanda
013, ao conferir a evidência do refinamento, e re-verificado nesta árvore.

### O que o sistema faz quando falha — e por que é o mais difícil de enxergar

**Nada.** Não cala como o `EA-3`, não avisa tarde como o `EA-4`, não mente como
o `EA-5`: **deixa passar**. É um portão que sempre abre. E a assimetria que o
torna perigoso está registrada mais abaixo — **ele nunca mordeu**, porque o
binário sempre existiu onde se mediu.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/check_mutation.py:30-31`** (estado até `e27761d`, lido nesta
  árvore): dentro de `have(req)`, `if req == "python":` / `return True` —
  literal, sem consultar o disco. Os irmãos tinham dentes: `node` resolvia por
  `shutil.which` e `chromium` conferia `CHROME_PATH` e o cache `ms-playwright`.
  A lacuna era **nominal a um requisito**, não estrutural.
- **`.claude/verify/mutation_map.json → harnesses.*.requires`**: **os quatro**
  harnesses — `core`, `p50`, `p51`, `p52` — declaram `python`. Conferido nesta
  árvore.
- **`.claude/verify/check_mutation.py`, laço de trigger** —
  `missing = [r for r in h["requires"] if not have(r)]`: como `have("python")`
  era sempre `True`, `python` **nunca** entrava em `missing`. O
  `[FAIL] <harness>: campanha EXIGIDA (alvo mudou) mas ambiente sem …` e o
  `[DEFER] <harness>: … delegada ao job com …` eram, **para `python`**,
  inalcançáveis por construção.
- **Efeito**: a única pré-condição capaz de barrar uma campanha **antes** de ela
  começar a produzir números era decorativa. Quatro declarações de requisito,
  nenhuma asserção por trás.

### EA-6 habilita o EA-5 — a cadeia causal, registrada porque senão se perde

Os harnesses invocavam o interpretador por **literal** (`python3
build_v32_html.py`), nome que não resolve no Windows. Numa máquina Windows a
campanha era, por construção, incapaz de reconstruir o HTML — e portanto de
consultar gate nenhum. Com dentes no `have()`, o `check_mutation.py` teria
**parado no portão e nomeado o ausente** (`[FAIL] p51: … ambiente sem python`),
e a execução nunca teria chegado ao laço do harness que imprime `NÃO
DETECTADO`. Os `NÃO DETECTADO` do `EA-5` **só existem porque a pré-condição
deixou passar**: um é a porta, o outro é o que acontece depois dela.

A consequência prática para quem for consertar: **os dois remédios não se
substituem**. Consertar só o `EA-5` deixa o portão aberto — a campanha continua
sendo admitida em ambiente que não a sustenta, só que agora com rótulo correto.
Consertar só o `EA-6` deixa o relatório de dois estados intacto para **toda
outra** causa de não-execução: rebuild quebrado, filtro que não seleciona gate
nenhum, suíte que não emite a linha esperada. A pré-condição cobre um caso; o
vocabulário cobre a classe.

### A assimetria que o torna perigoso: hoje não morde

`python3` existe no CI (Linux) e `python` existe na máquina do proprietário
(Windows). Nas duas, `return True` e um `have()` com dentes devolvem **o mesmo
resultado** — e devolveram, em toda execução observada até aqui. O defeito só se
manifesta onde o interpretador falta, que é exatamente o caso em que ele
importaria. **Gate que nunca falhou não acumula confiança: acumula a ilusão de
que a pré-condição está sendo verificada.** É o mesmo formato do `EA-1` — prosa
declara proteção que a máquina não sustenta — um nível abaixo: **JSON declara
requisito que a função não sustenta.**

### Estado atual, e o que este registro não decide

A **T004 da demanda 013** (commit `d126753`, `fix(013): T004 — green de IC-2, o
requisito python passa a ter dentes`) trocou o `return True` por
`shutil.which(mutation_py_bin())`, e a asserção `IC-2` do stage `mutation` mede
a propriedade de forma adversarial: com `MUTATION_PY` apontando para um binário
inexistente, `have("python")` **tem de** dizer não. **Nada disso é veredito
deste registro** — se o green de `IC-2` fecha o `EA-6`, quem declara é o
`qa-engineer`, por execução citável, em fix-finding. Fica registrado o que
permanece independentemente dessa decisão: **não existe varredura que procure a
família** — requisito declarado em `requires` sem asserção que o sustente. O
próximo requisito decorativo nasceria do mesmo jeito e ficaria igualmente
invisível, porque o sinal de que ele é decorativo é justamente **a ausência de
qualquer falha na sua história**.
## EA-7 — Gate verde que já não pode reprovar: a Fase 5.2 assumiu a composição que o mutante da 5.1 ataca

**Status**: `aberto`

**Aberto em**: 2026-08-29. Encontrado pelo `qa-engineer` na E3 da demanda 013, ao
classificar os dois não-KILL da campanha no vocabulário fechado. Janela de
regressão: `4aa1f12..HEAD`.

### O que o sistema faz quando falha

**Passa.** `P51-VIS1` está verde no baseline e continua verde COM a mutação
aplicada — o harness reporta `SOBREVIVENTE M51-01 · o gate esperado NÃO
reprovou`. Não é o silêncio do `EA-3`, nem o aviso tardio do `EA-4`, nem o
rótulo mentiroso do `EA-5`: aqui **todo o instrumento está saudável**. A âncora
é única, o `reason` casa mensagens que o gate ainda emite, a mutação é aplicada
e o gate roda. O que se perdeu foi o **poder discriminante**: o gate afirma uma
propriedade que a mutação não consegue mais violar, porque quem implementa a
propriedade mudou de camada.

É a doença que o `EA-4` NÃO cobre. Âncora podre grita na hora em que alguém
conta ocorrências. Esta não: a contagem é 1, o preflight sai 0, e o par parece
íntegro sob todos os instrumentos que a 013 construiu.

### Cadeia arquivo:linha → efeito

- **`tests_p51_mutants.js:125-131`** — `M51-01` ("layout desktop volta a
  empilhar mapa e pergunta") muta `ui_p50_v32.css`, trocando
  `grid-template-columns:minmax(0,1fr) 340px` / `grid-template-areas:"main side"`
  por uma coluna só e áreas empilhadas.
- **`ui_p50_v32.css:693-702`** (Fase 5.1, nascida em `4aa1f12`) — o sítio da
  âncora: `body[data-uxscreen="question"] .wrap` com as duas colunas e, em
  `:701-702`, `grid-area:side` / `grid-area:main` nos filhos.
- **`ui_p52_workspace_v32.css:70-83`** (Fase 5.2, nascida em `c1e3649`) — passou a
  governar a MESMA composição: `html body[data-uxscreen="question"] .wrap` declara
  `grid-template-columns: minmax(0, 1fr) clamp(320px, 23vw, 440px)`, e `:80-81`
  colocam `#app` e `#p50-shell` por `grid-column`/`grid-row` explícitos.
- **Cascata, medida** — a regra da 5.2 tem especificidade `(0,2,2)` contra
  `(0,2,1)` da 5.1 (conferido com `@bramus/specificity`, já presente em
  `node_modules`), logo vence `grid-template-columns` por especificidade, em
  qualquer ordem. As colocações dos filhos empatam em `(1,2,1)` e são decididas
  por ordem de fonte — e **`build_v32_html.py:76`** inlina `ui_p52_workspace_v32.css`
  DEPOIS de `ui_p50_v32.css`, então a 5.2 vence de novo.
- **Efeito** — a mutação recai sobre declarações que já não decidem nada. O grid
  renderizado em ≥1180px é o da 5.2, idêntico com e sem mutação; `P51-VIS1`
  (`tests_p50_chromium.js:3352-3430`) mede caixas reais e não tem o que reprovar.
  As três alternativas do `reason` (`:3405`, `:3408`, `:3412`) continuam vivas e
  emissíveis — só que nada as dispara.

### Por que o remédio não cabia na demanda 013

Escrever asserção NOVA sobre comportamento de produto é outro tipo de trabalho e
outro dono (spec `013` §Fora de escopo; §Riscos 3 manda a demanda **parar** nesta
saída). Duas rotas plausíveis, nenhuma decidida aqui: (i) reancorar `M51-01` no
sítio da 5.2 que hoje governa — mas isso é mover o par para outra fase e outra
camada, decisão de desenho; (ii) gate novo que detecte **regra morta** — CSS da
5.0/5.1 inteiramente sobreposta por camada posterior —, que é a classe geral do
defeito e vale para além deste par.

### O que este achado NÃO decide, e o que fica medido

A causa foi verificada por **análise estática de cascata** na árvore real e por
oráculo independente de especificidade; a execução do gate em navegador **não**
foi possível nesta máquina (sem Chromium: `CHROME_PATH` vazia, cache
`ms-playwright` inexistente — `tests_p50_chromium.js` devolve 23
`SKIP … NÃO EXECUTADO (browser indisponível)`). O `19/20 · SOBREVIVENTE M51-01`
é execução do job `visual` do CI, relatada, não medida aqui. A classificação
`gate sem poder discriminante (achado EA-7)` está registrada no par
(`.claude/verify/mutation-matrix.json`) e em `dividas_declaradas`; a narrativa
com as provas vive em
`specs/013-integridade-da-campanha/matriz-gate-mutante.md` §15.

**A generalização que interessa**: a Fase 5.2 (`c1e3649`, e a integração
`df5d9f6`) reescreveu composição que camadas anteriores declaravam. `M51-01` é o
caso que a campanha conseguiu enxergar porque alguém foi olhar um número de
19/20. **Nenhum instrumento deste repositório procura a família** — par cuja
âncora vive em CSS que uma camada posterior sobrepõe. Os outros pares da `p51`
que mutam `ui_p50_v32.css` (`M51-08`) e todos os da `p50` que mutam o mesmo
arquivo estão sujeitos ao mesmo mecanismo, e passariam pelo preflight do mesmo
jeito.

## EA-8 — `data-eid` não é chave global no engine: `fortiai-assist` é id em `OFFERINGS` e em `SOLUTION_AREAS`

**Status**: `aberto`

**Aberto em**: 2026-08-31. Medido em 2026-08-30 pelo `data-engineer` na T004 da
demanda 010 (planning-state `010-recomendacao-sem-vao.json`,
`t004_equivalencia.achados_registrados[0]`). O id foi **reservado nominalmente**
em `specs/010-recomendacao-sem-vao/relatorio-final.md:192`, já na `develop` — por
isso nasce aqui como `EA-8` e não em outro número (R12: id citado não renumera).

### O que o sistema faz hoje

**Nada.** Não há efeito observável: a área de solução homônima não é emitida como
enabler em superfície alguma. O achado é sobre a **premissa** que dois consumidores
já assumem, e que o engine não garante.

### Cadeia arquivo:linha → efeito

- **`engine_v32.js:73`** — `SOLUTION_AREAS["fortiai-assist"]` (`entityType:
  "solution-area"`).
- **`engine_v32.js:184`** — `OFFERINGS["fortiai-assist"]` (`component` /
  `embedded-capability`), que em `:188` ainda declara `solutionAreaRelations` para
  o **homônimo**. O mesmo literal é chave nos dois catálogos.
- **`ui_v32.js:540-548`** — `iconFor(itemId, name)` resolve por
  `ICON_MAP_V32[itemId]`: a chave é o id **cru**, sem qualificar de que catálogo
  ele veio.
- **`tests_010_vao.js:1413-1419`** e **`:1433-1440`** — C10 (c1) usa `data-eid`
  como **chave de identidade**: dois itens com o mesmo `data-eid` no mesmo card são
  FAIL nomeando a repetição.
- **Efeito** — `data-eid` é consumido como chave global por um resolvedor de ícone e
  por um oráculo de deduplicação, e a globalidade **não é propriedade do engine**.
  No dia em que um id for emitido pelas duas fontes na mesma tela, os dois
  consumidores tratarão entidades distintas como a mesma.

### Relação com o `EA-9`

São o par: **este** é o fato do catálogo (o homônimo existe); o `EA-9` é a
**ausência de checagem** que permitiria o próximo. Quem decide o remédio — e se ele
é um gate de catálogo, um id qualificado ou nada — é o `qa-engineer` com o
`data-engineer`; o engine é `frozen` (rito D2, hoje Porta B).

## EA-9 — `validateConfigV32` não proíbe `:` em id: a segurança do prefixo `map:` é convenção medida, não invariante checada

**Status**: `aberto`

**Aberto em**: 2026-08-31. Medido na T004 da 010 e **escrito na errata E15** da
própria demanda (`specs/010-recomendacao-sem-vao/spec.md:222-228`, linha "O que
passa a valer"). Id reservado em `relatorio-final.md:193`.

### Cadeia arquivo:linha → efeito

- **`engine_v32.js:680`** em diante — `validateConfigV32()` confere enums, órfãos,
  composição e duplicidade de `questionId` (`:696-697`). **Nenhuma asserção sobre a
  forma do id** — nem alfabeto, nem unicidade global entre catálogos.
- **`ui_target_v32.js:346`** — `const id=eq || ("map:"+x.p)`: o item sem
  equivalência V3.2 recebe `data-eid` com o prefixo `map:`, **normativo** desde a
  E15.
- **A segurança do prefixo é medição**, não checagem: `t004_equivalencia.colisao_map`
  (planning-state da 010) registra "nos 95 ids + 22 `SIGNAL_IDS`, **nenhum** id
  contém `:`". É verdade sobre o catálogo de hoje.
- **Modo de falha se colidir** — item vindo do `MAP` e item do catálogo com o mesmo
  `data-eid` no mesmo card: a fusão de C10 (c1) (`tests_010_vao.js:1433-1440`)
  **apaga um deles do card**, e o desaparecimento não tem mensagem de erro própria.
  É a mesma superfície que o `EA-8` descreve pelo outro lado.

### Remédio recomendado, e por quem

O `product-owner` da 010 recomendou remédio **fora do engine**: gate de catálogo
com **unicidade global de id** (e alfabeto de id), que é barato e **não abre Porta
B**. Registrado como recomendação — o **nascimento do gate é do `qa-engineer`**
(R10), e transformar isso em invariante seria do PO com ratificação do auditor
(R1). Este registro não decide nenhum dos dois.

## EA-10 — o recorte de `blocoTexto` do `P52-TGT4`: duas metades, a segunda nascida da correção da primeira

**Status**: `resolvido`

**Aberto em**: 2026-08-31 · **fechado no mesmo dia, dentro da demanda 010**. Id
reservado como `aberto` em `specs/010-recomendacao-sem-vao/relatorio-final.md:194`
— a leitura do fonte na `develop` (`86a4f1e`) mostra as **duas** metades já
corrigidas, e é o que este registro guarda. **Não é veredito de execução**: quem
declara o gate verde é o `qa-engineer`, pelo job `visual` do CI.

### Onde está a cadeia — e por que ela não é reproduzida aqui

A trilha canônica vive **dentro do próprio gate**, em `tests_p52_chromium.js`, com
a medição que a sustenta (offsets, ordem interna do bloco, margem de 121
caracteres). Reproduzi-la aqui criaria uma segunda fonte que apodrece separada.
Aponta-se para as linhas:

- **`tests_p52_chromium.js:4032-4066`** — o comentário `RECORTE E TINTA`, com a
  causa provada por eliminação, e a **retificação do próprio `EA-10`** a partir de
  `:4048`.
- **`:4057`** — metade **(a)**: `idxBloco` escolhia **uma** página para um bloco que
  ocupa **duas**. Corrigida pelo fluxo multi-página, `:4098-4105`; a tinta passou a
  somar as mesmas páginas do bloco (`:4147-4155`).
- **`:4059`** — metade **(b)**: com a fatia cobrindo o bloco inteiro, o recorte
  passou a engolir a **lista de práticas-alvo**, que é conteúdo **autorizado** sob
  gate fechado. Nasceu da correção de (a). Fechada pelo `LIMITE DO NÚCLEO`,
  `:4106-4146`.
- **`:4094-4097`** — escopo: suíte congelada (§29.4), **autorização nominal do
  proprietário em 2026-08-31**, restrita a `tgt4()` e a duas derivações.

### O aviso que não pode se perder

`:4061-4066` diz, no fonte, o que este registro repete de propósito: quem ler o
`EA-10` tem de encontrar **as duas** metades e o fato de que a segunda nasceu da
correção da primeira — **senão desfaz (a) por causa de (b)**, ou reabre a demanda
atrás de um sintoma que já não existe.

### O que ficou de fora, e virou achado próprio

Duas ressalvas registradas no mesmo comentário **não** foram corrigidas (fora da
autorização) e têm id próprio: `EA-12` (o sensor de estágios) e `EA-13` (a tinta
que não é exclusiva do alvo).

## EA-11 — a guarda de não-vacuidade de `D010-INV7` apontava para o conjunto que a V3 esvaziou

**Status**: `resolvido`

**Aberto em**: 2026-08-31 · **fechado dentro da demanda 010**. Achado do
`ui-engineer` na T013, devolvido na wave 7 (planning-state
`010-recomendacao-sem-vao.json`, `implementacao.wave_7.achados_devolvidos[0]`), e
reservado como `aberto` em `relatorio-final.md:195`. A leitura do fonte mostra a
guarda **já corrigida** em `cf6dd21` (T019, 2026-08-30) — commit **ancestral** do
que escreveu o relatório (`803113b`, 2026-08-31): **o relatório ficou
desatualizado neste item**, e a divergência fica registrada aqui em vez de
propagada. Confirmação por execução é do `qa-engineer`.

### Cadeia arquivo:linha → efeito (histórica) e a correção

- **`fixtures_010_vao.js:605-610`** — `d010BaseInV32Base()`: apresentação `base`
  **sem** flag de prioridade — o conjunto que alimentava `#v32base`, e que a V3
  esvaziou de cards.
- **`tests_010_vao.js:508-524`** — a narrativa da correção, no próprio gate: a
  guarda antiga **coincidia** com o sujeito real sob F1/F2 (2 e 2), e a coincidência
  **já se rompe no acervo** — sob `D010-F1b` a guarda antiga vale 4 e o sujeito real
  é **0**. Uma alínea apontada para F1b **fecharia verde sem sujeito**, com a guarda
  satisfeita: vacuidade com aparência de medição.
- **`tests_010_vao.js:526-531`** — `sujeitoPreservacao()` passa a derivar o sujeito
  do **modelo** (`d010BasePresented` menos `d010BaseInV32Base`), nunca do DOM que a
  alínea julga.
- **`:539-541`** e **`:557-559`** — as alíneas (a) e (b) chamam `vac()` sobre o
  sujeito **real**; sem sujeito, a alínea declara vacuidade em vez de fechar verde.

### O que permanece medido, e não asserido

A correspondência entre o sujeito derivado do modelo e o card que de fato emite a
frase foi **conferida contra o DOM nas cinco fixtures** (`:523-524`: 2·F1 · 0·F1b ·
2·F2 · 0·F3 · 2·F4). É medição, não asserção. Se isso deve virar asserção é
decisão do `qa-engineer` (R10) — este registro não a toma. O id **não é reusado**
em nenhuma hipótese (R12). Padrão de fundo: `EA-20`.

## EA-12 — `P52_ESTAGIOS` casa rótulo de opção: falso positivo do sensor, contornado pelo recorte e não resolvido

**Status**: `aberto`

**Aberto em**: 2026-08-31. Declarado como "achado de fundo, fora desta
autorização" pelo próprio gate, durante a correção do `EA-10` (demanda 010).

### Cadeia arquivo:linha → efeito

- **`tests_p52_chromium.js:3837`** — `const P52_ESTAGIOS =
  /Inexistente|Inicial|Definido|Gerenciado|Otimiz/i`: o sensor de "nome de estágio
  publicado" é uma regex **case-insensitive** sobre texto corrido.
- **`:4114-4119`** — a medição, no fonte: sob gate fechado o bloco contém
  `"definido"` no offset 1156, vindo de `QS["training"].opts[2].t` — **rótulo de
  opção**, não estágio de maturidade. O comentário nomeia os **seis** rótulos de
  `QS` que casam o sensor; a lista está lá e não é reproduzida aqui.
- **`:4224`** — a asserção que consome: `P52_ESTAGIOS.test(blocoTexto)` →
  `"PDF-TEXTO: nome de estágio publicado no bloco"`.
- **`:4132-4135`** — o gate declara o que não fez: o `LIMITE DO NÚCLEO` **contorna**
  o falso positivo (encolhendo o texto medido) e **não o resolve**; resolver exige
  mexer na **asserção**.
- **Efeito** — a defesa contra o falso positivo é hoje **geométrica** (o quanto o
  recorte alcança), não semântica. Qualquer mudança de layout que traga um desses
  seis rótulos para dentro do núcleo reprova o gate sem que nada tenha vazado.

O remédio é asserção nova em suíte congelada: dono é o `qa-engineer`, e o rito é o
da §29.4.

## EA-13 — `P52_TGT_GREEN` não é cor exclusiva do alvo: o mesmo hex é o domínio 2

**Status**: `aberto`

**Aberto em**: 2026-08-31. Registrado como "ressalva registrada, não corrigida"
dentro do gate, na correção do `EA-10` (demanda 010).

### Cadeia arquivo:linha → efeito

- **`tests_p52_chromium.js:3836`** — `const P52_TGT_GREEN = [60, 177, 126];` com o
  comentário `#3CB17E — encoding exclusivo do alvo`.
- **`ui_v32.js:796`** — `PR_DOM_HEX` traz `"#3CB17E"` na segunda posição: o **mesmo
  hex** é a cor do **domínio 2** no mapa usado pelo PDF.
- **`tests_p52_chromium.js:4227`** — asserção de vazamento: tinta > 0 na página do
  bloco ⇒ FAIL `"px de #3CB17E (cor exclusiva do alvo)"`.
- **`:4239`** — asserção de **controle**: sob gate aberto, tinta == 0 ⇒ FAIL
  `"nenhuma tinta #3CB17E do alvo na página do bloco"`.
- **Efeito** — a asserção de tinta **não prova presença do alvo**: uma tag de
  domínio 2 na mesma página satisfaz o controle, e pode acusar vazamento onde não
  há. O comentário estava errado sobre a exclusividade.
- **`:4086-4092`** — a ressalva, com o que foi medido no papel: o verde aparece em
  `#pr-maturity` (2×) e `#pr-target` (1×), e em nenhuma outra seção. A exclusividade
  é **de estado, na sessão medida**, não do encoding.

## EA-14 — no job `visual`, as campanhas de mutação rodam depois das suítes: suíte vermelha deixa o passo `skipped` e a não-medição não aparece como falha

**Status**: `aberto`

**Aberto em**: 2026-08-31, na leitura do CI feita pela demanda 011.

### Cadeia arquivo:linha → efeito

- **`.github/workflows/verify.yml:42`** — o job `verify` roda com
  `MUTATION_DEFER_MISSING: "1"`.
- **`.claude/verify/check_mutation.py:1291-1298`** — com essa env, campanha
  **exigida** cujo ambiente falta sai como `[DEFER] … delegada ao job com chromium
  (job visual)` e o stage **segue verde**. O delegado é o único que a mediria.
- **`.claude/verify/mutation_map.json`** — `p50`, `p51` e `p52` declaram
  `requires: ["node","python","chromium"]`: são as delegáveis.
- **`verify.yml:69-73`** (suítes visuais) e **`:79-80`**
  (`python .claude/verify/check_mutation.py`) são passos do **mesmo job**, nesta
  ordem. Passo que falha aborta o job; os seguintes ficam `skipped`.
- **Efeito** — um vermelho de suíte esconde a **não-medição** das campanhas
  delegadas: o sinal visível é o da suíte, o `verify` já saiu verde com `[DEFER]`,
  e **nenhum sinal diz "campanha exigida não foi medida"**. É a família que a 013
  fechou no relato local — a distinção entre `NÃO EXECUTADO` e `SOBREVIVENTE`
  (`EA-5`) — reaparecendo do lado do CI, onde ela ainda não existe.

**Não executado**: não rodei o workflow. A cadeia acima é leitura do YAML, do
`check_mutation.py` e do `mutation_map.json` na `develop` `86a4f1e`.

## EA-15 — `run.sh` trunca a saída do stage em 30 linhas: o veredito do `mutation` chega sem motivo e parece crash

**Status**: `aberto`

**Aberto em**: 2026-08-31, na demanda 011. É **achado de método**: muda como se
atribui causa (R2 §3), antes de mudar qualquer código.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/run.sh:62-72`** — `reporta()`: no ramo FAIL (`:69`) a saída do
  stage é impressa passada por `head -30`. O corte vale para **qualquer** stage, e é sempre
  pelo **começo**.
- **`.claude/verify/check_mutation.py:185`** — o bloco `---- integridade da campanha
  (013) ----` é impresso **antes de qualquer campanha**, com as linhas `IC-*`.
- **`check_mutation.py:1289-1305`** — as linhas por campanha (`[OK]`, `[DEFER]`,
  `[FAIL]`, `[RUN]`) e o relato dos não-KILL (`mut_relata`, criado pela 013
  justamente para o motivo não se perder) saem **depois** disso.
- **duas últimas linhas do arquivo** — `----` e
  `mutation: N campanha(s) executada(s) · M problema(s)`: o veredito é **o fim** da
  saída.
- **Efeito** — quem lê o pipeline vê o **começo do cabeçalho de integridade** e não
  vê nem o veredito nem o motivo; a leitura natural é "o stage morreu". O
  diagnóstico que a 013 construiu existe e não chega ao operador.

**Remédio de método, enquanto o achado estiver aberto**: para atribuir causa,
rodar `python .claude/verify/check_mutation.py` **direto**, e nunca concluir a
partir da saída truncada do `run.sh`.

**Não medido por execução**: o stage é `mutates: true` e esta escrita não roda
campanha; a cadeia acima é leitura de fonte.

## EA-16 — `UX14` é constante por duas razões independentes: o gate não pode reprovar

**Status**: `aberto`

**Aberto em**: 2026-08-31, na demanda 011 (o refinamento dela já registrava que a
rota recusada "mata UX14"). Suíte **congelada**: registrado, **não emendado**.

### O que o sistema faz quando falha

**Passa.** `UX14` afirma "atalho de teclado continua atingindo o finding global
correto após regroup" e devolve `true` em qualquer estado do produto.

### Cadeia arquivo:linha → efeito

- **`tests_ux_m41.js:127-134`** — o gate inteiro.
- **`:133`** — a condição do ternário termina em
  `selected[0]===firstGlobal.sort((a,b)=>0)[0]===selected[0]`, que **associa à
  esquerda**: `(booleano) === string` é **sempre falso**. A condição inteira é falsa,
  e o gate cai sempre no ramo `: true`.
- **`:133`** — e o ramo `?`, se fosse alcançado, é `X || true` — **também constante**.
  São **duas razões independentes**: fechar uma não desconstante o gate.
- **`:131`** — `const sel=[...w.__DEV.V32?[]:[]]; /* noop */`: **código morto**,
  nunca lido, com um ternário cujos dois ramos são `[]`.
- **Efeito** — a interação que o gate encena (`key(w,d,"1")`, `:130`) **não é julgada
  por asserção alguma**. É verde que não pode virar vermelho: o atalho pode passar a
  atingir o finding errado sem que `UX14` mude de cor.

### Escopo

`tests_ux_m41.js` é suíte congelada — está na lista `frozenSuites` do próprio
`P50-GOV1` (`tests_p50_core.js:446-449`) e sob a §29.4. Correção exige rito
próprio e é do `qa-engineer`. Instância do padrão `EA-20`.

## EA-17 — R9 §6 (CSS com prefixo do próprio módulo) não tem verificador em lugar nenhum do pipeline

**Status**: `aberto`

**Aberto em**: 2026-08-31, na demanda 011.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/check_lint_arch.py:1-54`** — o lint executa **quatro**
  checagens: pureza do engine (`:23-29`), `innerHTML=` proibido e IIFE nos módulos
  `ui_p5*` (`:31-39`), bridges registrados (`:41-50`). **Nenhuma abre arquivo
  `.css`.**
- **`.claude/verify/pipeline.yaml:17-98`** — nenhum outro stage lê `.css` para
  verificar prefixo ou allowlist; o único consumidor de `.css` sob
  `.claude/verify/` é a campanha de mutação, que **muta** CSS sem verificá-lo.
- **`.claude/rules/modularity.md` §6** — exige prefixo do próprio módulo e
  allowlist revisada (FE propõe, TL aprova) para seletor alheio, com o custo do
  contrário registrado na própria regra (E12: 178 seletores alheios estilizados).
- **Efeito** — a alínea vale por disciplina de quem escreve. Módulo novo cujo CSS
  estiliza seletor de outro módulo passa por **todos** os stages, e a violação só
  aparece quando alguém lê o arquivo — que é exatamente o modo de falha que o
  `lint-arch` existe para eliminar.

Nascimento de checagem nova é do `qa-engineer` com o `tech-lead`, e entra no
`pipeline.yaml` (R10 §9) — nunca no prompt de um agente.

## EA-18 — gate que lê a árvore e gate que lê HEAD medem objetos diferentes: mutação só no disco passa no `baseline`

**Status**: `aberto`

**Aberto em**: 2026-08-31, na demanda 011.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/check_baseline.py:36`** — `git show HEAD:<path>`: o stage
  `baseline` compara o registry contra o **blob de HEAD**. É o que a R2 §2 manda
  (medição à prova de CRLF/plataforma) — **não é defeito**.
- **`tests_p50_core.js:58`** — `sha = p => …fs.readFileSync(p)`: mede o **disco**.
- **`tests_p50_core.js:442-444`** — `P50-GOV1` compara esse sha do disco contra o
  mapa `PROTECTED` (`:82-228`, pins inline legados — R8 §2).
- **Efeito** — com a alteração **só na árvore** (o estado em que vive toda campanha
  de mutação, todo hook e todo agente antes de commitar), o `baseline` **passa**: ele
  mede o commit. Quem pega é **só** o `P50-GOV1`. No estado inverso — alteração
  commitada e revertida no disco — quem pega é só o `baseline`. Cada um dos dois
  estados é coberto por **um único** gate.
- **Consequência de método, além do caso** — todo par futuro que toque superfície
  protegida precisa **declarar qual objeto mede** (árvore ou HEAD); ler "os dois
  gates passaram" como "o protegido está intacto nos dois estados" é a inferência
  que esta cadeia proíbe.

**Não executado**: a leitura é dos dois fontes. A prova canônica — mutar no disco,
rodar os dois — é do `qa-engineer`.

## EA-19 — a tela de prioridade pergunta por gaps sobre uma lista vazia quando não há finding

**Status**: `aberto`

**Aberto em**: 2026-08-31. Caso 5 do refinamento da demanda 011, cuja cadeia
canônica e enquadramento de produto vivem em
`specs/011-numeracao-das-prioridades/refinement.md:203` (caso 5) e `:287-296`
(P9 — escopo secundário declarado). A branch `feature/011-numeracao-das-prioridades`
**não estava mesclada** quando este registro foi escrito (PR #32 aberto).

### Cadeia arquivo:linha → efeito

- **`quickscan_secops_soccmm_v3_1_3.html:522-533`** — `computeFindings()` só empilha
  finding quando `m.s > 0`; resposta em nível alto não gera nenhum, e `"NA"` vai
  para `validate` (`:526`). **N = 0 é alcançável** — todas as confirmadas em nível
  2/3, ou todas "A validar".
- **`:716`** — `renderPriority()` lê `computeFindings().findings`.
- **`:723`** — a pergunta é escrita **incondicionalmente**: "Dos gaps identificados
  na conversa, quais mais impactam a operação ou o negócio hoje?".
- **`:725-731`** — `.opts` é `findings.map(...).join("")`: com N = 0 o container
  renderiza **vazio**.
- **`:732`** — `"0 de 3 selecionadas"`; **`:738`** — a `kbd-tip` continua prometendo
  "1–9 seleciona os primeiros itens".
- **Efeito** — o facilitador fica, ao vivo, com uma pergunta sobre um vazio, um
  contador e uma legenda que afirmam itens que não existem, e **sem nada que diga
  que não há gap a priorizar**. É ausência renderizada como lista vazia.

### Escopo e rito

`quickscan_secops_soccmm_v3_1_3.html` é Camada 1, classe `frozen`
(`.claude/verify/boundary.json`): qualquer rota nesse arquivo é rito D2, hoje
Porta B. O tratamento está declarado como **escopo secundário da 011** — o rito é
da spec dela, não deste registro.

## EA-20 — o padrão que três demandas seguidas instanciaram: gate sem poder discriminante

**Status**: `aberto`

**Aberto em**: 2026-08-31. Não é o quarto item de uma lista: é **a família** que os
achados abaixo instanciam, registrada porque o alvo dela não é nenhum dos três
gates.

### O que é

Gate ou alínea **verde que não pode reprovar** — e não por o instrumento estar
doente. Âncora podre (`EA-4`), ambiente ausente (`EA-6`), campanha que não roda
(`EA-3`, `EA-14`) e número que afirma o que não mediu (`EA-5`) são doenças do
**instrumento**. Aqui o instrumento está saudável: o que se perdeu é a
possibilidade de a asserção ser violada — porque a propriedade mudou de camada,
porque a pré-condição nunca falha, ou porque a expressão que a afirma é constante.

### As três instâncias (cada uma com id e cadeia próprios — não reproduzidos aqui)

1. **`EA-7`** (demanda 013) — `P51-VIS1` continua verde **com** a mutação `M51-01`
   aplicada: a composição que a 5.1 declarava passou a ser governada pela 5.2.
2. **A errata E17 da demanda 010** (`specs/010-recomendacao-sem-vao/spec.md:243-255`)
   — C8 (a) é verdadeira **por estado, não por gate**: `temCandidato` é sempre falso
   onde `tgtValidateHTML` chega, e `D010-M11` saiu da campanha como equivalente por
   construção. A própria errata registra que foi a **terceira vez dentro da mesma
   demanda** (depois de **E5** e **E1**).
3. **`EA-16`** (demanda 011) — `UX14` devolve `true` por duas razões independentes.

### Por que um id próprio, e não três defeitos

Porque o alvo é o **critério de nascimento de gate** (R10, §"Nascimento de um
gate"), não nenhum dos três gates. Os três **satisfazem** o critério como ele está
escrito — caso positivo, negativo, adversarial, regressão, oráculo independente, e
até mutante declarado — e ainda assim não discriminam. O que falta ao critério é a
exigência de **prova de que a asserção pode reprovar**. Registrar as três como três
defeitos manda consertar três gates e **deixa o quarto nascer igual**.

A 010 já deu o nome ao fenômeno, e ele vale como definição de trabalho
(`spec.md:254`): *alínea cuja pré-condição nunca falha é indistinguível de alínea
que mede, até alguém escrever o mutante e ele sobreviver*.

### A cadeia própria deste achado é uma ausência

- **`.claude/verify/mutation_map.json`** + **`.claude/verify/check_mutation.py`** —
  a campanha é o único instrumento que separa "mede" de "parece medir", e só desde
  que a 013 distinguiu `SOBREVIVENTE` de `NÃO EXECUTADO`. Mas ela só enxerga gate
  **para o qual alguém escreveu um par**: `UX14` não tem par (suíte congelada, fora
  de `targets` — é o `EA-3` pelo outro lado), e `D010-M11` foi retirado como
  equivalente por construção.
- **`.claude/verify/pipeline.yaml:17-98`** — **nenhum stage** verifica que um gate
  ainda pode reprovar. Não há varredura que procure a família.
- **Efeito** — a detecção depende de alguém olhar um número (o `19/20` que abriu o
  `EA-7`) ou reler uma expressão (o `UX14`). Os três casos foram achados por leitura
  humana, em três demandas seguidas — o que mede a **frequência**, não a cobertura.

### O que este registro recomenda, e o que ele não decide

O `product-owner` e o `tech-lead` recomendaram, **cada um por sua conta**, que a
**varredura de gates constantes** vire **demanda própria** (R4): cria comportamento
novo, a checagem entra no `pipeline.yaml` (R10 §9), e o desenho é do `tech-lead`
com o `qa-engineer`. **Não** é `fix-finding` — não há um defeito único a corrigir.

Este registro **não decide**: se a varredura é estática (expressão constante,
ternário morto), mutacional (par obrigatório por gate) ou mista; se algum dos três
casos fecha; nem quando a demanda abre. Abrir a demanda é do orquestrador; o
veredito de cada instância é do `qa-engineer`.

> **Nota de numeração (2026-09-01)**: esta cópia de `.claude/BACKLOG.md`, na
> branch `feature/014-gate-sem-poder-discriminante`, diverge de
> `origin/develop` antes da demanda **015** mesclar (PR mesclado, commit visível
> em `origin/develop`), que alocou `EA-21`…`EA-31` — não presentes aqui.
> Conferido por `git show origin/develop:.claude/BACKLOG.md` em 2026-09-01: o
> maior id em qualquer branch (`develop` e todo `feature/*`/`fix/*` remoto) é
> `EA-31`. Os dois achados abaixo continuam a série a partir de `EA-32`, sem
> colisão. A reconciliação textual das duas cópias (`EA-21`…`EA-31` que faltam
> aqui) é automática no merge do PR desta demanda para `develop` — **não** é
> renumeração, é a mesma série vista de duas branches (R12, R14).

## EA-32 — mutante `P52-RA8` ataca dois assets pela mesma âncora; a metade `SOCaaS` é inerte por ordem de cascata

**Status**: `aberto`

**Aberto em**: 2026-09-01. Achado da demanda 014 (wave 5), classe nomeada pela
errata E7 do `qa-engineer`: **mutante-parcialmente-inerte**
(`.claude/verify/regra_morta.json → exclusoes[2].cegueira` e
`.classes_de_achado`) — id permanente alocado pelo `doc-writer` contra
`origin/develop` em 2026-09-01, substituindo o marcador provisório
`014-P52-RA8` nas duas posições do registro (`exclusoes[2]` e
`indecidiveis.arvore`).

### Cadeia arquivo:linha → efeito

- `tests_p52_mutants.js:398-406` — o mutante `P52-RA8` (gate-alvo `P52-ICON2`)
  altera **duas** declarações pela mesma âncora textual: `--p52-icon-scale` de
  `FortiGuard-MDR-Service` (`ui_p52_workspace_v32.css:1350`, de `1.053` para
  `0.70`) **e** insere logo abaixo uma regra nova,
  `.icon-tile img[data-p52-icon="SOCaaS"] { --p52-icon-scale: 0.70; }`.
- `ui_p52_workspace_v32.css:1357` — a folha **já** declara
  `.icon-tile img[data-p52-icon="SOCaaS"] { --p52-icon-scale: 1.006; }`, mesma
  especificidade e mesmo contexto de mídia da regra inserida. A regra
  **inserida pelo mutante** perde por **ordem de cascata** (a última
  declaração de mesmo peso vence, e `:1357` vem depois da inserção). O valor
  computado de `SOCaaS` é **idêntico** com e sem a mutação — a metade `SOCaaS`
  não pode influenciar veredito algum.
- **Efeito**: o `desc` do mutante ("reduzir SOCaaS e MDR abaixo do limite
  óptico") promete duas propriedades atacadas; só uma é efetiva. A folha está
  **sã** — não há regra morta nela. Quem escreve a regra morta é o **mutante**.

### Por que não é `EA-20` nem `EA-7`

`EA-20` é a família de gate **saudável, mas sem poder de reprovar**
(pré-condição que nunca falha, expressão constante). Aqui o gate **morre** —
`P52-ICON2` reprova com a mutação aplicada, porque a metade `MDR` é efetiva. O
que está comprometido é **parte** da mutação, não a capacidade do gate de
reprovar. `EA-7` (`P51-VIS1`/`M51-01`) é o contraponto que decide o dono: lá a
regra morta estava **na folha do produto**; aqui a folha é sã e a regra morta
nasce **no mutante**. Mesmo sintoma de superfície (regra CSS que perde por
ordem/especificidade), dono e remédio diferentes.

### O que não se sabia, e por isso o remédio não tinha sido escolhido

> **Resolvido em 2026-09-04** — ver "Veredito do job visual" abaixo. Texto
> original preservado (R2 §5): não é refutação, é a pergunta que o parágrafo
> abaixo deixava em aberto, agora respondida por execução.

Não se sabe se `P52-ICON2` ainda mata com **só** a metade `MDR` da mutação — a
resposta depende do veredito do job `visual` do CI **sob a mutação parcial**,
em execução no momento deste registro. Se `P52-ICON2` matar mesmo sem a metade
`SOCaaS`, o par é válido com um `desc` que promete demais (remédio possível:
corrigir a descrição, ou dividir o mutante). Se sobreviver, é um **segundo**
par sem poder discriminante — entraria na família `EA-20` — e o achado cresce.

### As três saídas nomeadas (nenhuma escolhida aqui)

1. Mover a regra inserida para depois de `:1357` (faria a metade `SOCaaS`
   vencer por ordem — mas alteraria o alvo real do mutante).
2. Alterar a regra existente em `:1357` em vez de inserir uma nova.
3. **(product-owner)** Partir `P52-RA8` em dois mutantes, um por asset — o
   precedente é o das metades simétricas `D011-M12`/`D011-M13`: mutante que
   ataca dois assets pela mesma âncora não diz qual alínea do gate morreu.

### Evento de remoção (auto-executável, já registrado)

`.claude/verify/regra_morta.json → exclusoes[2].evento_de_remocao`: a exceção
morre no dia em que existir um par `(p52*, P52-RA8)` em
`.claude/verify/mutation-matrix.json → pares` — é assim que o veredito do job
`visual` volta e fecha esta exceção. `remocao_prevista` (ambas as posições do
registro) já cita `EA-32`.

### Veredito do job visual (2026-09-04)

Veredito dado em 2026-09-04 (run 33834890154): `P52-ICON2` mata sob a mutação
parcial — par válido; resta o reparo. Registro em
`regra_morta.json → exclusoes[2].veredito_job_visual`.

Cai a saída "segundo par sem poder discriminante" (não vira instância de
`EA-20`). O que resta é o defeito medido nesta cadeia: a metade `SOCaaS` é
inerte por ordem de cascata contra `ui_p52_workspace_v32.css:1357`, e o `desc`
do mutante promete "reduzir SOCaaS e MDR" quando só `MDR` é efetivo.

O `qa-engineer` **recusou disparar** o `evento_de_remocao` auto-executável da
exceção. Razão: registrar o par de `P52-RA8` agora — com o mutante ainda
partido ao meio e o reparo deferido — reprovaria `C3(e)` e forçaria a saída da
exclusão; sem a exclusão, a varredura passaria a ver a regra `SOCaaS` inserida
como **morta**, e `C2(zero)` ficaria **cronicamente vermelha**; e
`C6(cont-árvore)` exigiria fixar a contagem da árvore por execução. Três
consequências sem o ato que as resolve — vermelho crônico é o padrão do
`EA-5`. A exceção segue válida pela condição de máquina, com a razão
**estreitada por escrito** (`veredito_job_visual` em `regra_morta.json`), e o
par nasce no fix-finding **junto com o reparo, num commit só**.

**Encaminhamento recomendado**, com as cinco condições que o `qa-engineer` pôs
para partir o mutante em dois (uma metade por asset):

1. Cada metade altera a **regra vencedora** do seu asset —
   `ui_p52_workspace_v32.css:1350` (MDR), `:1357` (SOCaaS) — nunca inserindo
   regra que perde por ordem.
2. O `reason` de cada metade **nomeia o `alt`** do tile atacado.
3. O kill de cada metade é medido no job `visual` **antes** de pinar — a
   errata **E13** acabou de mostrar o que custa pinar raciocínio.
4. Commit atômico: partição do mutante + remoção da exclusão + errata na
   lista `C3` + contagem da árvore fixada por execução + registro dos pares.
5. Dono `qa-engineer`; desenho do `tech-lead`; confirmação do `product-owner`.

### O que este registro não decide

O veredito de `P52-ICON2` sob a mutação parcial chegou (ver seção acima); a
saída recomendada é partir `P52-RA8` em dois, mas falta a confirmação do
`product-owner` sobre o desenho (`tech-lead` desenha); a família `EA-20` **não**
ganha membro novo — a hipótese caiu. O que permanece não decidido aqui é
apenas o reparo em si: quando e por quem o fix-finding do `EA-32` é aberto.

## EA-33 — demandas mescladas na `develop` com o planning-state parado antes de `done`

**Status**: `aberto`

**Aberto em**: 2026-09-01. Observado pelo orquestrador durante a demanda 014.
Instância nova da família **`EA-31`** ("o registro da prova não é comparado
com a execução da prova") — id próprio, porque o alvo é outro par
registro/execução: aqui é **fase da demanda** × **histórico do git**, não
prova de mutante. `EA-31` vive em `origin/develop`, ausente desta cópia local
de `BACKLOG.md` (ver nota de numeração acima) — a inclusão desta instância na
lista de `EA-31` é `DEPENDÊNCIA` para quem reconciliar o merge.

### Cadeia arquivo:linha → efeito

- `.claude/project-memory/planning-state/009-leitura-do-relatorio.json` —
  `phase: "validate"`, `validate.status: "awaiting_approval"`, `pr_url:
  "https://github.com/oflavioc/quickscan-secops/pull/24"`. O commit de merge
  `4092463` ("Merge pull request #24…") está em `origin/develop` desde
  2026-08-30 (`git log --merges`, conferido em 2026-09-01).
  `specs/009-leitura-do-relatorio/relatorio-final.md` **não existe** em
  `origin/develop`.
- `.claude/project-memory/planning-state/013-integridade-da-campanha.json` —
  `phase: "validate"`, `validate.status: "in_progress"`, `pr_url: null`. O
  commit de merge `2426582` ("Merge pull request #29…") está em
  `origin/develop` desde 2026-08-30.
  `specs/013-integridade-da-campanha/relatorio-final.md` **não existe** em
  `origin/develop`.
- `.claude/verify/check_state.py:48-53` — a única cláusula que compara `phase`
  com algo externo ao próprio arquivo é `:52-53`, e ela só reprova `phase ==
  "done"` sem `pr_url`. **Nenhuma cláusula** verifica a direção oposta: uma
  branch cujo commit de merge já está no histórico de `develop` com a demanda
  ainda em `validate`.
- `.claude/hooks/state-eval.sh:59-67` — a cada prompt, todo planning-state com
  `phase != "done"` entra em `ativos` e é impresso em `[demanda]`. Efeito
  medido: **duas demandas já entregues** (`009`, `013`) continuam anunciadas
  como em voo desde 2026-08-30 — o mesmo mecanismo de erosão de confiança que
  motivou a R10 §2 (SKIP silencioso) e a própria `EA-31`.

### Por que é `EA-31`, com id próprio

`EA-31` já nomeia a família: instrumento e prova saudáveis, o que diverge é o
**registro** delas. As três instâncias já nomeadas (`EA-28`, `EA-29`, `EA-30`)
são sobre **prova de mutante**. Esta é sobre **estado de demanda** — o par
descasado é `planning-state.phase` × "o commit de merge está no histórico de
`develop`" —, mecanismo diferente, mesma forma de falha: **nada compara os
dois lados**. Ganha id próprio pela mesma razão que `EA-30` ganhou dentro de
`EA-20` ("para não reescrever este corpo — números citados nunca renumeram,
R12") e referencia a família.

### O que este registro não decide

Se o remédio é um stage novo (comparar `pr_url`/commit de merge contra o
histórico de `develop`), uma cláusula em `check_state.py`, ou rito de
fechamento manual da Fase 6; se `009` e `013` precisam, retroativamente, de
`relatorio-final.md` e aceite de intenção registrado, ou se o merge já
consumado é aceito como fato encerrado; abrir demanda é do orquestrador (R4); o
veredito é do `qa-engineer` com o `product-owner`.

## EA-34 — "declaração viva" não implica "mutação observável pelo gate": o limite do instrumento de regra morta por cascata

**Status**: `aberto`

**Aberto em**: 2026-09-04. Medido pelo `qa-engineer` na errata **E13** da demanda
014 (`specs/014-gate-sem-poder-discriminante/spec.md:728-733`), repassado ao
`doc-writer` para id permanente **fora daquela errata** — é o próprio texto da
E13 que nomeia a entrega. **Isto é limitação declarada do instrumento
(`.claude/verify/regra_morta.js`), não defeito dele**: a demanda 014 o construiu
para varrer cascata por declaração, e é exatamente isso que ele faz, corretamente,
nas duas formas medidas abaixo. O achado é o **limite** — para que ninguém leia
`D014-VARR1` verde como uma promessa maior do que ele dá.

### Cadeia arquivo:linha → efeito

- `.claude/verify/regra_morta.js:227` — `classificarDeclaracao()` só considera
  concorrente `O` quando `O.prop === D.prop` (a linha filtra por
  `O.prop !== D.prop`); é a régua da §3 do próprio arquivo (comentário
  `:196-214`): "regra morta ⟺ existe uma concorrente que vence D … " — concorrente
  é sempre da **mesma propriedade**.
- `.claude/verify/regra_morta.js:392-412` (§6 `diferenca()`) — agrupa as
  declarações introduzidas/alteradas pelo mutante em um `Map` cuja chave é
  `ctxChave(d) + " " + d.seletor + " " + d.prop` (`:399`/`:405`):
  contexto de mídia, seletor e **propriedade**. Uma declaração cujo efeito visual
  é neutralizado por **outra propriedade**, de **outra camada**, nunca entra na
  mesma chave — o instrumento não tem onde compará-las.
- **Efeito, medido duas vezes**:
  1. **`ui_p50_v32.css:697`** `grid-template-areas:"main side"` (camada 5.1,
     `4aa1f12`) neutraliza `grid-template-columns` de
     **`ui_p52_workspace_v32.css:77`** (camada 5.2, `c1e3649`): tirar o segundo
     track não tira a segunda coluna — a área nomeada já define grade explícita
     de duas colunas, e a coluna não dimensionada cai em `grid-auto-columns:
     auto`. `regra_morta.js` responde **viva** para a declaração de `:77`
     (`censo_ok`, zero mortas) — e o gate `P52-LAY2` não a via: mutar `:77` só
     mudava a **largura** da coluna 2 (medido em 1280: `842px 320px` →
     `861px 301px`), nunca a composição "lado a lado" que o gate mede. Foi assim
     que `D014-M10`, na forma `:77`, saiu **SOBREVIVENTE** no job `visual` do CI,
     run **33516136516** (`SOBREVIVENTE D014-M10 · gate P52-LAY2 · o gate
     esperado NÃO reprovou — sem poder discriminante`), enquanto o instrumento
     desta própria demanda dizia a declaração "viva".
  2. **`ui_p52_workspace_v32.css:1350`** (`--p52-icon-scale` de
     `FortiGuard-MDR-Service`, mutante `P52-RA8`) — caso irmão, já registrado sob
     outro nome (`EA-32`, "mutante parcialmente inerte"): ali a neutralização é
     por **ordem de cascata dentro da mesma propriedade**, não por interação
     entre propriedades; `EA-32` não é instância desta família, é citado só para
     marcar a fronteira.

### A frase que resume

**"Declaração viva" não implica "mutação observável pelo gate"** — o instrumento
mede cascata por declaração (mesma propriedade, mesmo seletor, mesmo contexto de
mídia), não layout. Duas declarações de propriedades diferentes podem produzir a
mesma geometria renderizada, e nesse caso mutar uma delas é indistinguível, para
o instrumento, de não mutar nada — mas não é indistinguível para o navegador.

### Por que não é `EA-20` nem `EA-32`

`EA-20` é a família "gate saudável, mas sem poder de reprovar" — pré-condição que
nunca falha, expressão constante. Aqui o defeito não está em gate nenhum: o gate
`P52-LAY2` **tem** poder discriminante sobre a propriedade certa (medido pela
própria E13, variante `grid-column: 2` → `1`: **DETECTADO 1/1**). O que tem um
limite é o **instrumento de varredura estática** — `D014-VARR1` continua correto
sobre o que promete (cascata por declaração) e errado apenas se alguém o lesse
como promessa sobre layout. `EA-32` é o mutante parcialmente inerte (regra
inserida que perde por ordem, dentro da **mesma** propriedade); aqui a regra
sequer compete — são propriedades diferentes, e a `diferenca()` do §6 nem as
coloca na mesma chave para competir.

### O que este registro não decide

Se o instrumento ganha uma segunda fase (medição de geometria renderizada,
necessariamente com Chromium — o que o tornaria `heavy`, ao contrário do desenho
atual) para cobrir interação entre propriedades; se o remédio é documentar o
limite no cabeçalho de `regra_morta.js` e em `CONTEXT.md` (vocabulário do
`product-owner`); ou se a exposição permanece vigiada só pelo par mutante↔gate
por Chromium, caso a caso, como o próprio `D014-M10`/`P52-LAY2` reancorado.
Abrir demanda é do orquestrador (R4); o veredito é do `qa-engineer`.
