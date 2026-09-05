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

### Nota do desfecho (demanda 016, 2026-09-04) — **permanece `aberto`**

A demanda **016-registro-contra-execucao** tratou esta borda 8 (`spec.md`
§P16.b, gate `D016-PROT1`) sem fechar o achado. O que muda: a promessa
`[DEFER]` **não foi retirada** (o desenho recusado seria R-b1, "levar Chromium
ao `verify`") **nem instrumentada por recibo** (o outro desenho recusado, R-b2)
— a cobrança que faltava passou a ser **da proteção de branch**: o merge em
`develop` passa a esperar o job `visual` (e o `fecho`) como check obrigatório,
uma vez que o proprietário execute o ato P2, auditado por `D016-PROT1`
(`.claude/verify/branch_protection.json`, seção `branch-protection` do
`compliance-audit.sh`). `mutation-matrix.json → dividas_declaradas` (entrada
"Borda 8") recebeu o desfecho **anexado como sufixo da mesma string** (R2 §5,
texto original preservado): *"credor = proteção de branch com `visual`
obrigatório, auditada por `D016-PROT1`; a promessa continua, a cobrança
existe"*.

**O que isso fecha**: um `[DEFER]` cujo job `visual` **falhe, seja pulado ou
não rode** no head SHA do merge passa a **bloquear o merge**, porque `visual`
vira check obrigatório — o sintoma central que abriu a borda 8 (o caso dos
"65 segundos" entre o job fechar e o merge acontecer no PR #29, sem nada que
obrigasse a esperar) deixa de ser possível, uma vez que P2 esteja configurada.

**O que isso NÃO fecha — por que o achado permanece `aberto`**: nenhuma
máquina compara a **lista** de campanhas que o `[DEFER]` do job `verify`
prometeu com as que o job `visual` de fato executou; a coincidência de ambos
derivarem `changed` do mesmo merge-base é **coincidência de código, não
cobrança** (`spec.md` §NÃO mede 6, ratificado pelo aceite do `product-owner`,
`validate.aceite_po.respostas_as_seis_perguntas.1_p16_cumprida_ou_contornada`).
O diagnóstico desta borda 8 — suíte vermelha deixa o passo das campanhas
`skipped` sem que a não-medição apareça como falha própria (o corpo original
deste achado) — **também não mudou**: com `visual` obrigatório, uma suíte
vermelha naquele job passa a **bloquear o merge**, mas o sinal visível
continua sendo o da suíte, não "campanha exigida não medida" (`spec.md` §NÃO
mede 9). Se as duas listas um dia divergirem, fechar isso é demanda própria
(R-b2), não desta.

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

**Espécie registrada depois** (2026-09-01): **`EA-28`** — mutante que existiu, foi
executado e **saiu do registro**. Não é falta de mutante: é falta de par na matriz
e de gatilho que o re-execute. Ganhou id próprio para não reescrever este corpo
(números citados nunca renumeram, R12), e referencia esta família.

## EA-21 — duas curadorias divergentes para o mesmo gap, no mesmo PDF

**Status**: `aberto`

**Aberto em**: 2026-09-01. Levantado pela demanda 015 e **reservado em prosa** por
ela antes do merge do PR #34
(`specs/015-superficies-de-apoio/relatorio-final.md:548`) — o id já era permanente
quando este registro foi escrito.

### Cadeia arquivo:linha → efeito

- **`ui_v32.js:1034-1066`** — `QS_GAP_SUPPORT`: curadoria indexada por
  **capability**, sem nível.
- **`quickscan_secops_soccmm_v3_1_3.html:420-467`** — `MAP`: curadoria indexada
  por **qid × nível**.
- **A medição das combinações alcançáveis vive em
  `specs/015-superficies-de-apoio/refinement.md` §M5** — em **3 das 7**, nenhuma
  lista contém a outra. Não reproduzida aqui de propósito: número copiado para um
  segundo lugar apodrece separado do que o mediu.
- **Efeito** — o mesmo gap chega ao leitor do relatório impresso com dois
  conjuntos de produtos, sem texto que diga qual responde a quê.

### Escopo e rito

`MAP` é Camada 1, classe `frozen` (`.claude/verify/boundary.json`) → rito D2, hoje
Porta B. `QS_GAP_SUPPORT` vive em `ui_v32.js` (camada 5.x, editável). **Qual
curadoria é canônica é decisão de produto — `product-owner`**; este registro não a
toma.

## EA-22 — `P51-REC1` promete "sem duplicação" no nome e não compara `pr-gapsup` com superfície alguma

**Status**: `aberto`

**Aberto em**: 2026-09-01. Reservado em prosa pela 015 (`relatorio-final.md:549`).
**Pendente de confirmação por execução** — o veredito é do `qa-engineer`, nunca
deste registro.

### Cadeia arquivo:linha → efeito

- **`tests_p50_core.js:3363`** — o gate nasce com a promessa no próprio título:
  *"recomendações acionáveis junto do gap, sem overclaim nem duplicação"*.
- **`tests_p50_core.js:3363-3411`** — o corpo assere: capability canônica lida do
  `MAP` para aquele qid, opções da tabela presentes, e a âncora normativa externa
  (§UAT-07 da Phase 5.1). **Nenhuma asserção compara `pr-gapsup` com outra
  superfície do mesmo relatório.**
- **`ui_v32.js:1029-1030`** — o cabeçalho normativo do módulo repete a promessa (o
  bloco final de apoio existe para as capabilities sem gap correspondente,
  **sem duplicar o mesmo card**).
- **Efeito** — a propriedade "sem duplicação" está escrita em dois registros
  consultáveis e medida em nenhum; quem lê o nome do gate acredita que ela é
  coberta.

### O que este registro não decide

Se o gate reprova ou passa, e se a promessa deve virar asserção ou sair do título:
`qa-engineer` (execução) e `tech-lead` (desenho). Instância de fronteira da
família `EA-31`.

## EA-23 — a mesma capability sob dois nomes no mesmo relatório

**Status**: `aberto`

**Aberto em**: 2026-09-01. Reservado em prosa pela 015 (`relatorio-final.md:550`).

### Cadeia arquivo:linha → efeito

- **`quickscan_secops_soccmm_v3_1_3.html:448`** — `MAP["logs"].cap` = *"Análise
  centralizada, correlação e retenção de eventos"*.
- **`engine_v32.js:49`** — `"security-analytics"` = *"Analytics de segurança
  (SIEM/data lake)"*.
- **Efeito** — o leitor encontra dois nomes para a mesma capability dentro do
  mesmo documento, sem sinônimo declarado em lugar nenhum.

### Escopo e rito

Fechar do lado do `MAP` é Camada 1 `frozen` → rito D2, hoje Porta B — **é por isso
que isto é achado e não demanda**. A reconciliação de vocabulário (qual nome é
canônico, e se o outro vira sinônimo no `CONTEXT.md`) é do `product-owner`.

## EA-24 — o card neutro culpa o mapeamento quando a causa é ausência de gap

**Status**: `aberto`

**Aberto em**: 2026-09-01. Reservado em prosa pela 015 (`relatorio-final.md:551`).
**Pendente de confirmação por execução** (`qa-engineer`).

### Cadeia arquivo:linha → efeito

- **`ui_v32.js:645`** — `presentationOf(id, c)` devolve `null` quando não há
  contexto/gap que sustente apresentação.
- **`ui_v32.js:721`** — `neutralPrioCardHTML(id, c)` é a rota do card sem produto.
- **`ui_v32.js:727`** — o texto emitido atribui a causa ao **mapeamento** ("Não há
  oferta direta mapeada para esta capability nesta etapa"), inclusive quando a
  causa é **não haver gap** — capability madura.
- **Efeito** — a tela e o papel dizem ao facilitador que falta oferta, quando o
  que falta é problema; a leitura induzida é de lacuna de catálogo.

### O que este registro não decide

Quais estados alcançáveis produzem cada causa (medida do `qa-engineer`) e qual
texto substitui (`product-owner` com `ui-engineer`).

## EA-25 — "prioridade declarada nunca desaparece" é invariante de fato sem âncora normativa

**Status**: `aberto`

**Aberto em**: 2026-09-01. Reservado em prosa pela 015 (`relatorio-final.md:552`).

### Cadeia arquivo:linha → efeito

- **`ui_v32.js:722`**, **`:738`**, **`:745`** — a propriedade vive em **comentário
  de código** (`[3.2.3-B] prioridade NUNCA desaparece`, `[3.2.2-A] priority-first
  REAL`, `[3.2.3-B] sem exceção`).
- Ela é **medida** por gates de várias fases (`V10`/`V15`/`V21`/`V22`/`P5`/`P7`/
  `D010-ABS1`, conforme `specs/015-superficies-de-apoio/spec.md` §Cross-check).
- **Ausente** de `.claude/rules/product-invariants.md` (INV-1…INV-10) e de
  `.claude/verify/invariants.json` — conferido por busca em 2026-09-01: zero
  ocorrência.
- **Efeito** — uma propriedade que sete gates protegem não tem dono normativo:
  quem quiser mudá-la não encontra a regra que a proíbe, e cada gate parece uma
  escolha local. É o inverso do `EA-22`: aqui a execução garante **mais** do que o
  registro afirma.

### Fora do meu domínio, nomeado

**Redação ou promoção a invariante é do `product-owner`** (R1: só o PO propõe, só
o auditor ratifica). Este registro apenas mede a ausência.

## EA-26 — resíduo `C × I`: card-alvo e `apoio-block` lendo o mesmo `MAP` em duas seções, sem texto que explique

**Status**: `aberto`

**Aberto em**: 2026-09-01. Reservado em prosa pela 015 (`relatorio-final.md:553`).
Declarado pela demanda **010** e **não fechado** por ela nem pela 015.

### Cadeia arquivo:linha → efeito

- A cadeia canônica vive em `specs/015-superficies-de-apoio/spec.md` §E1 e
  §"Referenciado, não absorvido" — apontada, não reproduzida.
- **Host bloqueado**: o lugar certo de tratar é `ui_target_v32.js`, **não
  autorizado** por spec vigente alguma, e o `MAP` é Camada 1 `frozen`.
- **Efeito** — a mesma informação aparece em duas seções do relatório com origem
  idêntica e sem frase que distinga os papéis; duas demandas passaram ao lado
  porque nenhuma tinha o host no escopo.

### O que este registro não decide

Qual host recebe o tratamento e sob que rito (D2 Porta B, ou spec que autorize
`ui_target_v32.js`): `tech-lead` propõe, orquestrador delega, usuário autoriza.

## EA-27 — `HIDE_EYEBROWS` existe em três cópias sem dono único

**Status**: `aberto`

**Aberto em**: 2026-09-01. Reservado em prosa pela 015 (`relatorio-final.md:554`).
**Efeito medido, não hipotético.**

### Cadeia arquivo:linha → efeito

- **produto** — `ui_v32.js:109-110`.
- **oráculo de `U15`** — `tests_ui_m31.js:279-280` (a lista literal, de novo,
  dentro do teste).
- **fixture da 010** — `fixtures_010_vao.js:675-676` (`D010_HIDE_EYEBROWS`).
- **Efeito medido** — mutar o array **do produto não alcança `U15`**, porque o
  oráculo lê a própria cópia. Foi isso que fez `M18` **parecer** ter dois carrascos
  e ter um só; a medição está no par `D015-M18` de
  `.claude/verify/mutation-matrix.json` e na errata **E2.1** de
  `specs/015-superficies-de-apoio/spec.md`.
- **Regra em jogo** — R9 §5 (dono do estado) e R9 §8 (helper único por semântica):
  três cópias, nenhum dono.

### O que este registro não decide

Se a unificação é bridge, helper ou import de fixture, e se cabe em `fix-finding`
ou em demanda: `tech-lead` com `core-engineer`; o veredito sobre o poder do oráculo
é do `qa-engineer`.

## EA-28 — prova que existiu e saiu do registro: mutante declarado carrasco, provado só em bateria efêmera

**Status**: `aberto`

**Aberto em**: 2026-09-01. Espécie **nova** da família `EA-20` — id próprio porque
o corpo do `EA-20` descreve outra ausência (falta de mutante) e não se reescreve
por evento posterior (R12). A instância que a revelou **já está fechada**; o que
fica aberto é a classe.

### O que é

Mutante **declarado carrasco na spec**, executado de verdade uma vez, cuja prova
morava num registro **substituído** — sem par na matriz e **sem gatilho de path**
que a re-executasse. O gate segue verde e o registro segue afirmando prova; o que
sustenta a afirmação é o histórico do git.

**Critério de trabalho, formulado pela 015**: *prova que não tem par na matriz e
não tem trigger que a re-execute não é prova — é lembrança.*

### Cadeia arquivo:linha → efeito

- **`specs/015-superficies-de-apoio/spec.md:276`** — `C1` declara `M17` e `M18`
  carrascos, `M18` como **único** de `(h1)`.
- A bateria negativa da Fase 4 registrou **15/15 incluindo os dois**, num `_trilha`
  de `.claude/verify/expected_suites.json` **substituído** pelo `_trilha` da
  contagem fixada em **`351de95`** — a prova passou a viver só no histórico do git.
- **`specs/015-superficies-de-apoio/spec-validate.md:67`** — o gap **G2**: os dois
  **não estavam no harness, não tinham par na matriz e não constavam de
  `dividas_declaradas`**. Achado por **leitura**, na Fase 6, não por gate.
- **A cadeia própria é uma ausência** — `.claude/verify/check_mutation.py:376-433`:
  `IC-5`/`IC-6` comparam harness ↔ matriz **nominalmente à `p51`**, por decisão
  registrada; **nenhuma cláusula** compara *mutante declarado em spec* com *par na
  matriz* para os demais harnesses, e `.claude/verify/mutation_map.json` só
  re-executa quem tem `targets`.
- **Efeito** — o registro de dívida chegou a **afirmar que `M18` era o único
  carrasco de `(h1)`**: alegação de prova que a campanha nunca executou.

### A instância está fechada; a classe não

`M17` e `M18` entraram no harness em **`5724fbd`** (campanha **15/15**, zero
sobreviventes) com repin em **`5ede3fe`**, e hoje
`mutation_map.json → harnesses.d015` traz `targets` e `preflight: true` — conferido
no HEAD deste registro. **Nada impede o próximo caso**: nenhum gate compara spec
com harness.

### Fora do meu domínio, nomeado

O veredito sobre cobertura e o desenho da checagem são do `qa-engineer` (com o
`tech-lead`); a checagem, se nascer, entra no `pipeline.yaml` (R10 §9), nunca em
prompt de agente.

## EA-29 — afirmação refutada que sobreviveu em três superfícies, e a pior delas era o comentário do gate

**Status**: `resolvido`

**Aberto em**: 2026-09-01, já com a correção citável — registrado porque a **lição
é de propagação**, e ela permanece válida com as três ocorrências riscadas.

### Cadeia arquivo:linha → efeito

- **`specs/015-superficies-de-apoio/spec.md:222`** e **`:276`** — a errata **E3**
  riscou a afirmação (*"a metade de TELA, atacada por `M17`, é prova fraca …
  `N40` mataria `M17` também"*) **na spec**. Primeira correção — e ela **não
  alcançou as cópias**.
- **`.claude/verify/mutation-matrix.json:1499`** — a nota do par **`D015-M19`**
  seguia afirmando o refutado e **contradizia, no mesmo arquivo**, a nota do par
  vizinho `D015-M17` (`:1511`).
- **`tests_015_apoio.js:403`** — a frase estava viva no **comentário do próprio
  gate**: o lugar onde o próximo leitor olha **primeiro**, antes da matriz e antes
  da spec.
- **Efeito enquanto durou** — dois registros consultáveis afirmavam o oposto da
  spec emendada, e um deles contradizia o vizinho dentro do mesmo arquivo.
  Refutação registrada tem de ficar **riscada com a razão** (R2 §5) — em **todas**
  as superfícies, não na primeira encontrada.

### O que foi feito

Commit **`8b4aff3`** (demanda 015): as duas ocorrências riscadas com a razão, nunca
apagadas, e **censo por string em oito arquivos** — matriz, mapa, registro de
suítes, spec, tasks, relatório e os dois arquivos de teste. Sobrevivem três
ocorrências, **todas em contexto de refutação**; zero afirmações vivas. Conferido
por leitura no HEAD deste registro.

### A lição, que é o motivo de o achado existir

**Corrigir uma refutação é varredura, não edição** — por string, não por memória —
e o alvo de maior risco é o **comentário do gate**, porque é o primeiro que se lê e
o último que se revisa. A ausência que sobra (nada no pipeline procura cópias vivas
de uma afirmação já riscada) está registrada como perna da família **`EA-31`**, não
aqui.

## EA-30 — três provas de discriminância vencidas no registro da campanha

**Status**: `aberto`

**Aberto em**: 2026-09-01. Levantado pelo `product-owner` na **Fase 0 da demanda
014** (`specs/014-gate-sem-poder-discriminante/refinement.md` §6, branch
`feature/014-gate-sem-poder-discriminante`, commit `ec77053`, **não mesclada**),
**sem id alocado** — por desenho: branches paralelas não se enxergam. O PO
recomendou achado próprio, fora da 014 (mesmo arquivo, §P5 item 1); **a decisão de
a 014 absorver ou não é do orquestrador**.

**Vocabulário**: *prova de discriminância vencida* — par cuja última prova de KILL
foi medida em árvore anterior a uma mudança que pode ter tirado o poder do gate, e
que não foi re-executada desde então. Definido no glossário do refinamento da 014;
**ainda não está no `CONTEXT.md`** (conferido em 2026-09-01) — glossário é do
`product-owner`.

### Cadeia arquivo:linha → efeito

Linhas medidas **no HEAD deste registro**; o refinamento da 014 citava `:55-63` e
`:209-225`, deslocadas porque a matriz foi reescrita em `8b4aff3` — a própria
deriva de citação é sintoma da família `EA-31`.

- **`.claude/verify/mutation-matrix.json:57-67`** — a `p50` inteira é **uma linha
  agregada**, com `ultima_prova.data: "histórica (fases 5.0.x)"` (`:63`). A
  execução real de **2026-08-29** (`52/53`, com o não-KILL `P50::M51`) está em
  `specs/013-integridade-da-campanha/matriz-gate-mutante.md:1070-1076` e **não no
  registro**.
- **`.claude/verify/mutation-matrix.json:1553`** — `P50::M51` **sem KILL
  pós-correção**: a 013 re-derivou o `reason` e registrou a prova (b) como
  **parcial** e a (c) por **enumeração estática**, com a execução em navegador
  deferida ao job `visual`. E o run de 2026-08-31 **não exigiu a `p50`** — `:7`:
  *"[OK] p50: nenhum alvo mudou desde a base — campanha não exigida"*.
- **`.claude/verify/mutation-matrix.json:211-229`** — `M51-08` com
  `ultima_prova.data: "2026-08-22"` (`:217`), **nove dias** mais velha que a
  execução de 2026-08-31 que o cobriu (run `33389017967`, registrado em `:7`).
  **Medido por mim em 2026-09-01, e o caso é maior que o citado**: são **16** pares
  `p51` com data `2026-08-22` e **4** com `2026-08-29`, sob uma campanha `p51`
  executada em 2026-08-31.
- **A ausência** — `.claude/verify/check_mutation.py:376-433`: `IC-5`/`IC-6` são
  nominais à `p51` e comparam **conjuntos**, não **datas**; nenhuma cláusula
  compara `ultima_prova.data` com a data da execução que cobriu o par, e linha
  agregada não tem data por par para comparar.
- **Efeito** — o registro afirma discriminância medida em árvore que já mudou, e a
  leitura humana não distingue "provado ontem" de "provado em outra fase".

### O que este registro não decide

O veredito de cada uma das três (e do conjunto `p51`) é do `qa-engineer`; se o
remédio é campo, cláusula `IC-*` nova ou re-execução, é desenho do `tech-lead` com
o QA; abrir demanda é do orquestrador (R4).

## EA-31 — a terceira família: o registro da prova não é comparado com a execução da prova

**Status**: `aberto`

**Aberto em**: 2026-09-01. Como o `EA-20`, **não é o próximo item de uma lista**: é
a família que os achados abaixo instanciam, registrada porque o alvo dela não é
nenhum gate nem nenhum instrumento.

### O que é, e como se distingue das duas famílias já nomeadas

O backlog já separava dois eixos: **instrumento doente** — âncora podre (`EA-4`),
ambiente ausente (`EA-6`), campanha que não roda (`EA-3`, `EA-14`), número que
afirma o que não mediu (`EA-5`), veredito truncado (`EA-15`), waiver inexistente
(`EA-2`) — e **gate saudável sem poder discriminante** (`EA-20`).

Esta é a terceira: **instrumento saudável e prova real — o que diverge é o registro
dela.** A afirmação escrita (spec, matriz, comentário de gate, título de gate,
`ultima_prova`) e a execução que a sustentaria **não são comparadas por nada**; a
divergência só aparece quando um humano lê os dois lados.

### As instâncias (cada uma com id e cadeia próprios — não reproduzidos aqui)

1. **`EA-28`** — prova que existiu e **saiu do registro** (`M17`/`M18`: a spec
   declarava carrasco, a campanha não executava).
2. **`EA-29`** — afirmação **refutada** que sobreviveu em duas cópias depois de a
   spec ser emendada, uma delas no comentário do gate.
3. **`EA-30`** — prova registrada com **data e agregação anteriores** à execução
   que a cobriu.

**Casos de fronteira, nomeados com a razão** (não os conto como membros, mas eles
mostram as duas direções da mesma falha): **`EA-22`** — o registro promete **mais**
do que a execução mede (o nome do gate diz "sem duplicação"); **`EA-25`** — a
execução garante **mais** do que o registro afirma (sete gates protegem uma
propriedade que nenhuma regra escreve).

**Adjacente, não membro**: **`EA-27`** — três cópias literais de `HIDE_EYEBROWS`
produzem exatamente essa divergência, mas em **código**, não em registro. Vale
citar junto porque o remédio (dono único) é da mesma natureza.

### A cadeia própria desta família é uma ausência

- **`.claude/verify/pipeline.yaml`** — **nenhum stage** compara registro com
  execução: nem spec ↔ harness, nem `ultima_prova` ↔ data de execução, nem
  ocorrências vivas de uma afirmação já riscada.
- **`.claude/verify/check_mutation.py:376-433`** — o mais perto que existe:
  `IC-5`/`IC-6` comparam harness ↔ matriz, **nominalmente à `p51`**, por conjunto e
  não por data.
- **R2 §1** (todo PASS cita execução) e **R2 §5** (refutação permanece riscada)
  **não têm verificador algum** — a mesma forma de dívida que o `EA-17` registrou
  para a R9 §6.
- **Efeito** — as três instâncias foram achadas por **três atos humanos
  diferentes** (o `spec-validate` da 015, o censo por string do `qa-engineer`, a
  varredura de registro do `product-owner` na Fase 0 da 014). **Nenhuma** por
  máquina.

### O contra-argumento, escrito para poder ser cobrado

As três nasceram na **mesma janela**: revisão de registro (Fase 6 da 015, Fase 0 da
014). Quem revisa registro acha defeito de registro — o **viés de amostragem é
real**, e a frequência observada nesta leva **não** mede a frequência no
repositório. O que sustenta a família mesmo assim: (i) **origens independentes**,
três agentes e três métodos; (ii) o mecanismo é **verificável agora**, sem
estatística — não existe comparador de registro no pipeline; (iii) as três
sobreviveram a gates verdes.

**Gatilho de falsificação, declarado**: se uma varredura de registro (ou a próxima
demanda que revise campanha) **não achar instância fora destas três**, esta família
é artefato da janela de leitura, e este achado deve ser **riscado com a razão**
(R2 §5), não apagado.

### O que este registro não decide

Se o remédio é gate, campo obrigatório de registro, ou rito de escrita; se vira
demanda própria (R4 — do orquestrador); o veredito de cada instância
(`qa-engineer`); e o vocabulário que entra no `CONTEXT.md` (`product-owner`).

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

> **Fecho da nota (2026-09-04)**: a reconciliação previsto acima **aconteceu** neste merge de `origin/develop` para `feature/014-gate-sem-poder-discriminante`: `EA-21`…`EA-31` passam a estar
> presentes nesta cópia, e a série fica contínua de `EA-1` a `EA-34`. A nota
> permanece porque descreve por que os ids saltaram de `EA-20` para `EA-32` na
> história desta branch — registro consumado não se apaga (R2 §5).

## EA-32 — mutante `P52-RA8` ataca dois assets pela mesma âncora; a metade `SOCaaS` é inerte por ordem de cascata

**Status**: `resolvido`

**Aberto em**: 2026-09-01 · **fechado em 2026-09-04** (fix-finding, branch
`fix/ea32-particao-do-p52-ra8` — ver §Fecho ao final desta entrada). Achado da
demanda 014 (wave 5), classe nomeada pela
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

### Fecho (2026-09-04)

Resolvido pelo fix-finding do `EA-32` (branch `fix/ea32-particao-do-p52-ra8`,
base `09f4342`), nas cinco condições do encaminhamento acima:

1. **Partição** — commit `8d753bc`: `P52-RA8` fica com a metade MDR
   (`ui_p52_workspace_v32.css:1350`, regra vencedora) e `P52-RA8B` nasce com a
   metade SOCaaS **alterando** `:1357` (a regra vencedora — nenhuma inserção
   que perde por ordem); cada `reason` nomeia o `alt` que `P52-ICON2` imprime
   (condições 1 e 2). A exclusão `achado-aberto` saiu de
   `regra_morta.json → exclusoes` pelo seu próprio `evento_de_remocao` (par em
   `pares`), `PARES_DECLARADOS` voltou a dois, `indecidiveis.arvore.contagem`
   foi fixada por execução em 21 — num commit só (condição 4); errata **E14**
   da 014.
2. **Kill medido antes de pinado** (condição 3) — job `visual` do CI, run
   33860535587 (job 100983709794, `workflow_dispatch` sobre `59c8ad3`,
   2026-09-04): `[OK] IC-4: p52: 108 âncora(s) com ocorrencias == 1` ·
   `MUTATION TESTING (Phase 5.2) [tests_p52_mutants.js]: 108/108 mutantes
   detectados pelo gate e motivo esperados` · `não-KILL: nenhum — os 108
   mutante(s) lidos estão DETECTADO`; controle `PASS P52-ICON2` e
   `P52 CHROMIUM (Phase 5.2): 55 PASS · 0 FAIL de 55`. Os pares
   `P52-RA8 × P52-ICON2` e `P52-RA8B × P52-ICON2` passam de `NÃO EXECUTADO` a
   **KILL** em `mutation-matrix.json` com essa referência.
3. **Colateral do mesmo run, resolvido antes de fechar este achado** (fechar
   deixando a campanha vermelha seria trocar um achado por um vermelho crônico
   — `EA-5`): a campanha `d014` saiu `8/9` — `D014-M8` sobreviveu por *"motivo/
   alínea diferente"* porque o seu `reason` pinava `2 alínea(s)` e a contagem
   da árvore fixada pela E14 acrescentou a terceira
   (`C6(cont-arvore): contagem pinada = 21 × observada = 4`). Classe:
   **mutante obsoleto** (não gate frouxo, não defeito do reparo) — reancorado
   pela errata **E15** da 014; campanha `d014` reexecutada `9/9`, suíte 7/7.
4. Dono `qa-engineer`, desenho do `tech-lead` (condição 5); a confirmação do
   `product-owner` sobre o desenho é registrada como **atribuída pelo
   orquestrador**, não constatada por este agente (R2 §4).

Achado derivado, aberto no mesmo ciclo e **não** fechado aqui: `EA-35`
(aritmética `scale²` da altura aparente do `P52-ICON2`).

## EA-33 — demandas mescladas na `develop` com o planning-state parado antes de `done`

**Status**: `resolvido`

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

### Resolução — o que foi feito, e o que fica de fora

Demanda **016-registro-contra-execucao** (`specs/016-registro-contra-execucao/`,
PR [#40](https://github.com/oflavioc/quickscan-secops/pull/40), branch
`feature/016-registro-contra-execucao`). Tratou **EA-33** e a borda 8 do `EA-14`
juntas, sob a mesma propriedade de processo — **P16: o merge é o vencimento de
toda promessa feita à verificação** — com mecanismos e donos distintos por
metade (`refinement.md` §Desafio ao enquadramento).

**O que entrou, executado e citável** (HEAD local `ed2f9d0`; pipeline completo
local **16 PASS · 0 FAIL**, `MUTATION_DEFER_MISSING=1 bash .claude/verify/run.sh`;
`compliance-audit.sh` **15 PASS · 1 FAIL · 0 WARN**; campanha `d016` — número por
estado, ver `specs/016-registro-contra-execucao/relatorio-final.md` §Números):

- **P16.a — direção registro↔git**: gates `D016-FEC1` (registro→git, com o
  oráculo de mensagem de merge `#N` e o secundário de ancestralidade),
  `D016-FEC2` (git→registro com piso, `.claude/verify/fecho.json → piso.sha =
  921977c2…`), `D016-FEC3` (`done` ⇒ artefatos em disco, com as três exclusões
  R13 impressas — 003, 009, 010), `D016-FEC4` (válvula `fecho_pendente`) e
  `D016-PR1`, o **check pré-merge** em job próprio `fecho` (`verify.yml`, sem
  `needs:`/`if:`) — todos no namespace `D016-*`, definidos em
  `specs/016-registro-contra-execucao/spec.md`.
- **P16.b — a borda 8**: a rota escolhida **não** foi nenhuma das duas
  recomendadas no refinamento (R-b1: levar Chromium ao `verify`; R-b2:
  recibo+reconcile) — foi **tornar a proteção de branch de `develop` dado
  auditável**. A medição do `build-engineer` (`medicoes-fase0.md` §Medição 1)
  derrubou R-b1 por custo (campanhas dominam por **duas ordens de grandeza**:
  42–55 min contra 28–35 s de instalação) e revelou o credor real (§Medição 2:
  `develop` não tinha **nenhum** check obrigatório). O gate `D016-PROT1`
  (seção `branch-protection` do `compliance-audit.sh`) audita a proteção via
  API a cada execução; a promessa `[DEFER]` **continua existindo** —
  `verify.yml:42` (`MUTATION_DEFER_MISSING`) e a semântica do `check_mutation.py`
  ficaram byte-intactas (T9) — e quem a cobra passou a ser o merge esperando o
  check `visual` obrigatório, ao lado de `verify` e do novo `fecho`.
- **CI, run real citado**: PR #40, run
  [`33927191969`](https://github.com/oflavioc/quickscan-secops/actions/runs/33927191969)
  (head `ebe0b22`, evento `pull_request`, único run do PR até esta escrita) —
  job `fecho` **FAILURE** com `[FAIL] FECHO PENDENTE da demanda
  016-registro-contra-execucao (fase implement) — merge bloqueado até done`
  (exit 1: o red **ao vivo** de `D016-PR1`, esperado por desenho enquanto a
  demanda não estiver em `done`); job `verify` **FAILURE** só no passo de
  auditoria (`bash .claude/verify/run.sh` fechou **16 PASS · 0 FAIL** dentro do
  mesmo job — o pipeline em si é verde — e `compliance-audit.sh` reprovou com
  `develop DESPROTEGIDA · faltam: fecho, up-to-date, verify, visual`: o red **ao
  vivo** de `D016-PROT1`, também esperado até o ato do proprietário).
- **O ato do proprietário (P2)** — configurar `verify`, `visual` e `fecho` como
  checks obrigatórios em `develop`, mais *up to date* — **ainda não foi
  executado** nesta data. É condição do aceite do `product-owner`
  (`016-registro-contra-execucao.json → validate.aceite_po.condicoes_do_aceite`),
  não pendência solta.

**O que fica de fora, declarado** (detalhe completo e fontes em
`specs/016-registro-contra-execucao/relatorio-final.md`):

- A reconciliação `[DEFER]` × campanha efetivamente executada continua **não
  medida por gate nenhum** — o que a proteção garante é que o job `visual`
  rodou verde sobre o mesmo head SHA, não que exigiu as mesmas campanhas
  (`spec.md` §NÃO mede 6). Por isso **`EA-14` permanece `aberto`**, com nota
  própria abaixo.
- **Achado novo** sobre a conflação de sinais entre o vermelho de `D016-PROT1`
  (que vive dentro do job `verify`) e o significado de "verify vermelho" —
  registrado como `EA-36`, abaixo, por decisão do orquestrador de não ampliar
  o escopo desta demanda.
- A recusa do `data-engineer` em normalizar a chave irmã
  `validacao`/`implementacao` do planning-state (010/011/015) **dentro** do
  mesmo commit que endurecia o schema — ratificada pelo `product-owner` no
  aceite (`validate.aceite_po.respostas_as_seis_perguntas.4_recusa_do_data_engineer`);
  fica candidata, fora desta demanda.
- `spec-validate.md` está em **iteração 1 de 2** (63/66, 95 %) nesta data; a
  iteração 2 (reverificação de G1/G2/G3 com a execução que os fechou) está em
  curso pelo `qa-engineer` em paralelo a este registro.

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

## EA-35 — a "altura aparente" do `P52-ICON2` é proporcional a `scale²`, não a `scale`: o `getBoundingClientRect()` já inclui o `transform`

**Status**: `aberto`

**Aberto em**: 2026-09-04. Achado do `qa-engineer` durante o reparo do
`EA-32` (partição do mutante `P52-RA8`) — id permanente alocado pelo
`doc-writer` contra `origin/develop` (HEAD `09f4342`) e todas as branches
não mescladas censadas nesta data (`chore/fecho-013-done`, ainda parada em
`EA-34`; a própria `fix/ea32-particao-do-p52-ra8`, idem); nenhuma prosa de
`specs/**` reservava `EA-35` ou adiante em nenhuma delas.

**Nota de conferência contra o fonte**: a delegação citou
`tests_p52_chromium.js:1131-1132` como o sítio da duplicação; a leitura do
arquivo em HEAD (`59c8ad3`) mostra que **essas duas linhas são o laço de
varredura alfa do canvas** (`for (let yy...) if (d[...] > 16) {`), não a
multiplicação. A cadeia real, confirmada linha a linha, está abaixo — cito-a
em vez de transcrever a referência recebida (R2 §4).

### Cadeia arquivo:linha → efeito

1. **`ui_p52_workspace_v32.css:1342`** — `transform: scale(var(--p52-icon-scale, 1));`
   aplicado ao `img` do tile. O `--p52-icon-scale` de cada asset é declarado
   em `:1345-1357` (ex.: `FortiGuard-MDR-Service` em `1350`, `SOCaaS` em
   `1357`).
2. **`tests_p52_chromium.js:1123`** — `const tr = tile.getBoundingClientRect(), ir = img.getBoundingClientRect();`.
   `ir` é medido **depois** do `transform: scale(...)` do passo 1 — o
   navegador já devolve a caixa **pós-escala**.
3. **`tests_p52_chromium.js:1125`** — `const scale = parseFloat(cs.getPropertyValue("--p52-icon-scale")) || 1;`
   lê o mesmo fator que já está embutido em `ir`.
4. **`tests_p52_chromium.js:1138`** — `const drawn = Math.min(ir.width, ir.height) * scale;`
   multiplica a caixa **já escalada** pelo fator de escala **outra vez**. A
   partir daqui, `drawn` é proporcional a `scale²`.
5. **`tests_p52_chromium.js:1146-1147`** — `hApparent`/`wApparent` herdam
   `drawn` diretamente: `(fh * drawn) / tileSide` e `(fw * drawn) / tileSide`.
6. **`tests_p52_chromium.js:1170-1175`** — o limiar (`0.68 − 0.005` a
   `0.82 + 0.005`, isto é 67,5%–82,5%) compara contra esse valor em `scale²`,
   e a linha impressa nomeia a grandeza errada: `detail.push(size + "/" + t.alt + ": altura aparente " + (t.hApparent * 100).toFixed(1) + "% do tile")`
   (idem `wApparent` em `:1175`) — o rótulo "altura aparente N% do tile" não é
   a fração linear que o nome promete.

### O que muda e o que não muda (o achado é a distinção, não o número isolado)

- **O veredito não muda.** `P52-ICON2` reprova quando deve reprovar; a
  monotonicidade de detecção se preserva e os mutantes morrem — isto é
  relatado como observação do `qa-engineer`, não reexecutado por mim
  (`doc-writer` não decide PASS/FAIL, R5).
- **A fidelidade do número muda.** No reparo do `EA-32`, o raciocínio pinado
  previa que `1.006 → 0.70` levaria a altura aparente de ~75% para **~52%**
  (abaixo do limiar de 67,5%, portanto ainda reprovando — previsão do
  veredito correta). A medição real, reportada pelo `qa-engineer`, deu
  **34,9%** (`lg/FortiGuard MDR`) e **36,5%** (`lg/FortiGuard SOCaaS`) — a
  distância entre a previsão (~52%) e a medição (~35%) é exatamente o
  quadrado do fator, não ruído de medição. Quem ler o log para calibrar
  limiar, ou para prever o efeito de uma mudança de `scale`, é enganado pelo
  número, não pelo veredito.

### Por que este achado é a confirmação empírica da condição 3 do reparo do `EA-32`

O reparo do `EA-32` (ver `EA-32`, seção "Encaminhamento recomendado") pôs
como condição 3: *"o kill de cada metade é medido no job `visual` **antes**
de ser pinado — a errata **E13** acabou de mostrar o que custa pinar
raciocínio."* Este achado é o motivo ficando concreto pela terceira vez no
mesmo ciclo:

1. **E13** (demanda 014) — a spec afirmava que tirar `grid-template-columns`
   faria `#app` e `#p50-shell` empilharem; colocação explícita nunca
   empilha, e o par `D014-M10` nasceu sem faca por isso.
2. **`EA-32`** — o `desc` do mutante prometia "reduzir SOCaaS E MDR" e a
   metade `SOCaaS` era inerte por ordem de cascata.
3. **Este achado** — a aritmética da "altura aparente" dobra o expoente do
   fator de escala; o número que a condição 3 existe para checar por
   execução (e não por conta) teria sido pinado **errado** se a condição não
   existisse.

**Viés de amostragem declarado**: as três origens nasceram na mesma janela
(o ciclo do `EA-32`, 2026-08-31 a 2026-09-04) e do mesmo par de agentes
(`tech-lead`/`qa-engineer` desenhando e verificando a mesma partição de
mutante) — a frequência mede o cuidado desta demanda com raciocínio pinado,
não uma taxa de erro do repositório. Registrado como contexto, não como
família nomeada: falta a terceira origem independente que
[[nomear-padrao-com-gatilho-de-falsificacao]] exige antes de um id de
padrão; aqui as três instâncias já têm dono (`E13`, `EA-32`, este achado) e
citar as três é o que a demanda pediu — não é proposta de família nova.

### Limite deste registro — por que é registro, não conserto

`tests_p52_chromium.js` é suíte congelada por autorização **nominal e restrita
à linha** do proprietário (padrão em `:4023-4024`, "Autorização NOMINAL do
proprietário [...], restrita a ESTA linha" — a mesma suíte já registra, no
próprio corpo, que autorização de uma correção **não se estende** a outra
linha, nem a outra demanda). A autorização §29.4 citada para outras edições
deste arquivo foi da demanda 010 e não cobre esta linha nem esta demanda.
**Este arquivo não está listado nas quatro classes de
`.claude/verify/boundary.json`** (`frozen`/`generated`/`legacy`/`registry`)
— o mecanismo de proteção aqui é o rito §29.4 registrado em comentário no
próprio gate (mesma família do precedente "Exceção UG8" em
`design-decisions.md`), não o hook `guard-boundary`. Isso não abre a porta
para editar sem pedir: por R6 §5 e R6 §3 (expansão de boundary só por spec
commitada antes do código, nunca por autorização só em prosa de relatório),
qualquer correção aqui **exige parar e aguardar autorização nominal do
proprietário no chat**, nomeando a linha exata a mudar.

### Opções de remédio nomeadas (nenhuma escolhida aqui)

1. **Remover a segunda multiplicação** — trocar `:1138` para
   `const drawn = Math.min(ir.width, ir.height);` (sem `* scale`), já que
   `ir` medido em `:1123` já é pós-transform. Dono: `qa-engineer` (autor do
   gate, R3 §2); exige a autorização nominal acima antes de tocar a linha.
2. **Renomear a grandeza em vez de corrigi-la** — se a intenção original era
   medir algo proporcional a `scale²` por algum motivo não documentado no
   comentário do bloco (`:1106-1109`), o remédio é documentar essa intenção
   e renomear `hApparent`/`wApparent` e a mensagem impressa para não afirmar
   "altura aparente" sobre uma grandeza que não é. Dono: `qa-engineer` +
   confirmação do `product-owner` sobre o que o nome deve prometer.
3. Nenhuma das duas altera o limiar (`0.68`–`0.82`) sem recalibrar contra a
   grandeza corrigida — recalibrar é decisão do `product-owner` (a régua
   óptica é conteúdo de produto, R1).

Qual das opções, e quando o fix-finding abre, é decisão do orquestrador
depois da autorização do proprietário — este registro não escolhe.

### O que este registro não decide

Se a duplicação é bug de fato (opção 1) ou nome errado sobre grandeza
intencional (opção 2); a confirmação por execução do gate após qualquer
mudança é do `qa-engineer`; a autorização da linha exata é do proprietário,
no chat.

## EA-36 — o vermelho de `D016-PROT1` vive dentro do job `verify`: o sinal que a errata E1 quis separar volta a se confundir, uma vez

**Status**: `aberto`

**Aberto em**: 2026-09-04. Achado do `product-owner` no aceite de intenção da
demanda 016 (`016-registro-contra-execucao.json →
validate.observacoes_do_po_a_tratar.1_prot1_no_verify`), decisão do
orquestrador de **não ampliar o escopo** daquela demanda e registrar aqui como
achado próprio.

### Cadeia arquivo:linha → efeito

- **`specs/016-registro-contra-execucao/spec.md`, errata **E1**** — o check
  pré-merge (P16.a) ganhou **job próprio** `fecho` em vez de virar passo do
  job `verify`, com a razão escrita: *"um `verify` vermelho durante toda a
  demanda ensina que vermelho é normal, e vermelho normal deixa de ser lido —
  mecanismo exato do `E5`; um check `fecho` vermelho diz algo verdadeiro e
  útil (a demanda ainda não fechou) e o `verify` continua significando 'o
  código está são'"* (`spec.md`, tabela T8, item b).
- **`.github/workflows/verify.yml:43-44`** — a auditoria de proteção de
  branch (`D016-PROT1`, P16.b) foi colocada como **passo do job `verify`**
  (`bash .claude/verify/compliance-audit.sh`), não em job próprio — decisão
  registrada em T8 c, com a razão de custo ("chamada de rede a cada turno
  seria custo sem valor" e "o `compliance-audit` já é executado em todo run
  do CI").
- **Efeito, medido no run `33927191969` (PR #40, head `ebe0b22`)**: o job
  `verify` fechou `FAILURE` — mas `bash .claude/verify/run.sh` (o pipeline,
  "o código está são") fechou **16 PASS · 0 FAIL** dentro do mesmo job; quem
  reprovou foi só o passo seguinte, `compliance-audit.sh`, com `[FAIL]
  branch-protection: develop DESPROTEGIDA`. Um `verify` vermelho por razão que
  **não é** "o código está são" — exatamente o que a E1 quis evitar ao separar
  o job `fecho`.

### Por que não é o mesmo mecanismo do `E5`, e por que é achado ainda assim

Decisão do orquestrador, registrada no planning-state: o vermelho de
`D016-PROT1` dentro do `verify` é **transiente** — tem dono (o proprietário),
evento único (o ato P2) e desaparece assim que a proteção de branch for
configurada — não é o vermelho crônico que ninguém investiga (`E5`). Por isso
a demanda 016 não expandiu escopo para lhe dar job próprio. Mas a conflação de
sinais é **real** enquanto durar: quem olha o check `verify` do PR #40 vê
vermelho sem saber, sem abrir o log, se é o pipeline ou a auditoria de
configuração externa ao repositório — a mesma ambiguidade que a E1 nomeou e
resolveu para P16.a, reaberta para P16.b.

### Encaminhamento

Demanda própria (mover a seção `branch-protection` para um job dedicado, ou
para o job `fecho` já existente, ou aceitar o custo transiente como está) —
não é `fix-finding` porque envolve decisão de desenho de CI (R4). A abrir
quando o proprietário decidir se o custo de um job a mais (chamada de API
isolada) vale a separação de sinal. Este registro descreve o defeito e não
propõe a correção.

## EA-37 — a regra "commit por caminho nominal com agente em voo" vive só numa trilha de demanda: nem `orchestration.md` nem a skill a carregam

**Status**: `aberto`

**Aberto em**: 2026-09-04. Achado do `product-owner` no aceite de intenção da
demanda 016 (`016-registro-contra-execucao.json →
validate.observacoes_do_po_a_tratar.2_regra_so_na_trilha`), sobre erro do
próprio orquestrador registrado em
`specs/016-registro-contra-execucao/trilha-do-commit-541771a.md`.

### Cadeia arquivo:linha → efeito

- **`specs/016-registro-contra-execucao/trilha-do-commit-541771a.md`** — dois
  commits (`541771a`, `d130a04`) empacotaram trabalho de agentes em voo sob
  mensagem que descreve só uma fração do conteúdo, por `git add -A` rodado
  pelo orquestrador enquanto `build-engineer`/`data-engineer`/`doc-writer`
  ainda escreviam na mesma worktree. A trilha registra a regra que passou a
  valer: *"enquanto houver delegação ativa na worktree, o orquestrador
  commita por caminho nominal, nunca com `-A`"*.
- **`.claude/rules/orchestration.md`** e
  **`.claude/skills/new-demand/SKILL.md`** — nenhum dos dois cita a regra
  (conferido por leitura em 2026-09-04, antes da correção registrada abaixo).
- **Efeito**: a regra nasceu **em prosa de demanda**, no exato formato que a
  R6 (§origem, achado `E2`) e a R12 dizem não sustentar — "regra que a máquina
  não sustenta é prosa" — desta vez aplicada a **processo do próprio
  orquestrador**, não a produto. A segunda ocorrência (`d130a04`) aconteceu
  **quatro horas depois** de a primeira já estar escrita e commitada,
  confirmando que registrar sozinho não bastou.

### O que já foi corrigido, no mesmo PR que abriu este achado

A demanda 016 acrescentou a regra a **`.claude/rules/orchestration.md`**
§Anti-patterns (item novo, forma errado→custo→correto, citando `541771a` e
`d130a04`) — ver esta mesma seção do arquivo. Isso resolve a metade
**normativa** (a regra agora vive num arquivo que `CLAUDE.md` aponta e que
todo agente lê). **O que este achado continua cobrando é a metade
mecânica**: nenhum hook vigia `git add -A`/`git add .` — a regra, mesmo
escrita no lugar certo, ainda depende de disciplina do orquestrador para ser
seguida.

### Encaminhamento

`fix-finding` candidato, nomeado pelo `product-owner` no aceite: hook
`PreToolUse` que barre `git add -A` e `git add .` **enquanto houver
delegação ativa** (o mesmo sinal que hoje aciona `state-eval`/`guard-*`) —
dono `build-engineer`. Não decidido aqui se o hook é viável sem falsos
positivos (ex.: `gen_pins.py` exige árvore limpa e roda só quando nenhum
agente está em voo, que já é o sinal natural do momento seguro).

## EA-38 — no job `visual` sob `pull_request`, o runner do Playwright torna o clone raso no `base.sha` do PR: a campanha `d016` mede um repositório mutado e sai 20/33

**Status**: `resolvido`

**Aberto em**: 2026-09-05. Achado do `qa-engineer` no diagnóstico do A1 do
`spec-validate.md` da demanda 016 (runs `33927191969`, `33930617469`,
`33933887655`, `33935247512` — 4 de 4 `pull_request` vermelhos; `33933884597`
e `33937833002` — 2 de 2 `workflow_dispatch` verdes). Reprodução integral em
`specs/016-registro-contra-execucao/prova-de-carga.md` §11.

### Cadeia arquivo:linha → efeito

- **`.github/workflows/verify.yml`**, job `visual`, passo "Suítes visuais"
  (`npm run test:visual` = `playwright test`) — roda **depois** do checkout e
  **antes** do passo "Campanhas de mutação com Chromium". O job `verify` não
  o executa.
- **`node_modules/playwright/lib/runner/index.js`** (`playwright` 1.62.1):
  `gitCommitInfoPlugin` (`:652-676`) é registrado sempre (`:641-642`, `:6606`,
  `:6648`); com `captureGitInfo.diff === undefined && ci` (`:669`) chama
  `gitDiff()`; `ciInfo()` (`:679-693`) lê `GITHUB_EVENT_PATH` e, se há
  `pull_request`, devolve `prBaseHash = pull_request.base.sha`; `gitDiff()`
  (`:762`) executa **`git fetch origin <base.sha> --depth=1
  --no-auto-maintenance --no-auto-gc --no-tags --no-recurse-submodules`**.
- **`.git/shallow`** passa a conter `base.sha` — no PR #40, **o piso
  `921977c`**. A cadeia first-parent de `origin/develop` vira um commit sem
  pais (`%P` vazio; o objeto cru segue com dois `parent`).
- **`.claude/verify/fecho.py:473-503`** (`ler_merges`) acha o piso na posição
  0 e não conta merge algum; **`check_fecho.py:374-397`** (guarda de censo)
  reprova `0 ≠ 39`; o harness (`tests_016_mutants.js`, `C0-fecho`) marca os
  13 mutantes `ARVORE` como `NÃO EXECUTADO`; o stage sai `1 problema(s)`.
- **Efeito**: o check obrigatório `visual` fica vermelho em **todo**
  `pull_request` — o PR não mescla sob P2 — por uma mutação do `.git` que a
  guarda de "árvore limpa" do `check_mutation.py` (`git status --porcelain`)
  **não vê**. Em `workflow_dispatch` o `event.json` não tem `pull_request` ⇒
  nenhum fetch ⇒ verde: os dois eventos **não são amostras comparáveis** para
  esse job (o adendo do `relatorio-final.md` errou por isso; corrigido, R2 §5).
- **Refutado por execução, e por isso registrado**: não é o checkout de
  `refs/pull/N/merge` (o job `verify` do mesmo run, checkout idêntico, fecha
  `[PASS] fecho` 7 s depois dele; as réplicas Linux e Windows do checkout do
  CI dão `39 (ok)` logo após o checkout), não é `fetch-depth` (é 0 e o fetch
  é completo), não é versão de git (2.55.0 antes e depois do `apt-get`).

### Encaminhamento

`fix-finding` candidato, dono **`build-engineer`**: `captureGitInfo: { commit:
false, diff: false }` em `playwright.config.js` — direção **provada** na
réplica Linux (mesma execução do `playwright test` sob as variáveis de PR:
sem `.git/shallow`, cadeia inteira, gate `39 (ok)`); arquivo **pinado** ⇒
`gen_pins.py` no mesmo PR (R8 §1). É a forma que a R7 §4 pede: dependência de
ambiente declarada, nunca implícita. Alternativa que trata só o sintoma: passo
`git fetch --unshallow` antes da campanha, guardado por `git rev-parse
--is-shallow-repository` (falha num repositório completo). Um `git fetch`
simples de `develop` **não** repara (medido). Quem prova o fecho é um run
`pull_request` com `visual` verde. Ver `EA-39` para a metade que este remédio
não toca.

### Nota do desfecho do EA-39 (2026-09-05) — permanece `aberto`

O fix-finding do `EA-39` produziu a primeira execução em `pull_request` com
`visual` **verde** desde o remédio deste achado (`8ec429a`): run
`33946727326` (PR #41, `fix/ea37-guarda-do-add-A`, 2026-09-05) — `verify`:
`[PASS] fecho`; `fecho` sob `--pr`: `NÃO JULGADO · fora-da-populacao` (por
desenho, `fetch-depth: 1` do job); `visual`: **success**. É a prova que
faltava para o remédio em si (`captureGitInfo` desligado).

**O que isso não fecha**: no mesmo run, `mutation: 0 campanha(s)` — o diff do
PR #41 (`EA-37`) não toca path que dispare a campanha `d016`, logo o
`C0-fecho` (sonda + gate nu, sob as condições reais de um job `visual` de
`pull_request`) **não foi exercido** ali. A prova de que o remédio também
sustenta `d016` sob PR só existe quando um PR que **muda**
`fecho.py`/`check_fecho.py`/`fecho.json`/`tests_016_mutants.js` rodar
`visual` verde com a campanha de fato executando — e o primeiro PR nessas
condições é o **deste** fix-finding, `fix/ea39-leitor-mudo → develop` (que
toca exatamente esses arquivos). Ler, no primeiro run do PR desta branch, os
jobs `verify` e `visual`, a linha `controle: C0-fecho · OK · … 39/39`; só
essa leitura decide se o achado fecha.

### Resolução — a prova que faltava (2026-09-05)

**Remédio** (`build-engineer`, já registrado acima): `captureGitInfo: {
commit: false, diff: false }` em `playwright.config.js` — a causa era o
runner do Playwright chamando `git fetch origin <base.sha> --depth=1` com o
`base.sha` do PR (o próprio piso do gate), o que tornava `.git/shallow` a
raiz da cadeia e derrubava o censo de `ler_merges`.

**Prova, conferida por execução direta desta run (não repassada)**: run
**`33952207595`**, evento `pull_request` do PR #42 (`fix/ea39-leitor-mudo →
develop`, head `58c879e`), job **`visual`** (conferido via `gh run view
33952207595 --json jobs`, id `101268992664`, conclusão `success`) — log lido
via `gh run view --job 101268992664 --log`:

```
D016 MUTATION [tests_016_mutants.js]: 35/35 mutantes detectados pelo gate e motivo esperados · controles: 3 ok · 0 falho(s)
controle: C0-fecho · OK · sonda 37/37 · falhas 0 · 11 demanda(s) · 0 problema(s)
         · censo da leitura 39/39 (ok) · exit 0 · origin/develop ec74d6f79fb5 · data do commit 2026-09-05
controle: C0-protecao · OK · sonda 9/9 · falhas 0 · exit 0
controle: D016-M24/positivo · OK · 015-superficies-de-apoio: FECHO PENDENTE DECLARADO
         · mensagem #34 · dono qa-engineer · prazo 2026-09-05 · válvulas 1 · censo 15/15 (ok)
não-KILL: nenhum — os 35 mutante(s) lidos estão DETECTADO
mutation: 1 campanha(s) executada(s) · 0 problema(s)
```

É a condição que a nota do desfecho do `EA-39` (acima) nomeava como pendente:
sob `pull_request` — o ambiente exato onde o defeito existia —, com a
campanha `d016` de fato executada (o PR toca `fecho.py`/`check_fecho.py`/
`tests_016_mutants.js`), o censo lê **39/39** em vez de **0/39**. `C0-fecho`
foi exercido sob PR e fechou verde; o achado fecha por essa leitura, como o
próprio registro pedia.

**O que tornou o defeito diagnosticável não foi o conserto.** Foi o eco do
controle (errata `E016-8`, ver `EA-39`), que levou a razão até o log. Antes
dele, o mesmo vermelho aparecia sem causa — dois dias de `[FAIL]` sem motivo
nomeado (runs `33927191969` a `33935247512`).

**A cadeia completa, como lição durável — três silêncios em série:**

1. Um runner de teste (Playwright, `gitCommitInfoPlugin`) alterou
   silenciosamente o repositório (`git fetch --depth=1` escreveu
   `.git/shallow`) como efeito colateral de coletar metadado de diagnóstico —
   nunca declarado como escrita na árvore.
2. Isso fez um leitor de governança (`fecho.py:ler_merges`) devolver `merges:
   []`/`od.causa: None` **em silêncio** — sem consultar
   `git rev-parse --is-shallow-repository` nem comparar pais caminhados ×
   pais do objeto — a lacuna que o `EA-39` fechou (código `historico-raso`,
   errata `E016-8`).
3. Isso derrubou 13 mutantes `ARVORE` com `NÃO EXECUTADO` (e, sem a guarda de
   censo, teria saído **verde por omissão** — o cenário que o próprio
   `EA-39` mediu no caso **G** da bateria) — uma razão que não chegava ao
   log do CI.

O `EA-39` — o leitor que agora **nomeia** o histórico raso — é o remédio da
segunda camada, e está `resolvido` (ver abaixo). Sem ele, o mesmo defeito
voltaria mudo se o vetor de truncamento mudasse: o remédio deste achado trata
o vetor conhecido (Playwright/`base.sha`); o `EA-39` trata a classe (clone
raso, qualquer origem).

**Sobre a válvula `D016-M24/positivo · prazo 2026-09-05` na mesma linha do
log** — conferido no fonte, não é uma válvula real vencendo hoje. É o
controle positivo do próprio harness (`tests_016_mutants.js:513-516`):
`valvulaApos(BRANCH_015, "D016-M24/positivo", ctx => ctx.dataCommit)` escreve
uma válvula sintética no arquivo mutável `F.ps015`
(`.claude/project-memory/planning-state/015-superficies-de-apoio.json`) com
`prazo = dataDoCommit()` (`git log -1 --format=%cI HEAD`, a data do commit
julgado — hoje, porque o HEAD do PR é de hoje) e depois **restaura os bytes
originais** (`BASE_BYTES`, linha 527/779) ao fim da campanha. O
`015-superficies-de-apoio.json` real, lido nesta árvore, **não tem** campo de
válvula/prazo — a fase já é `"done"`. Não é achado; é o desenho do controle
(nomeado no `desc` do próprio par: "válvula escrita pela campanha d016").

**Evidência**: run `33952207595`, job `visual` (`101268992664`), conclusão
`success`, log com as linhas acima citadas — conferido diretamente por este
agente via `gh run view 33952207595 --json jobs` e `gh run view --job
101268992664 --log`, não repassado do texto de delegação. Confirmação de
PASS/FAIL da campanha e do fechamento é do `qa-engineer`; este registro cita
o que a execução mostrou.

## EA-39 — o leitor de histórico lê um repositório raso como cadeia completa e não diz: "0 merges" não distingue "não há" de "não consegui caminhar" (família do EA-5)

**Status**: `resolvido`

**Aberto em**: 2026-09-05. Achado do `qa-engineer`, nomeado pelo orquestrador
como o que importa mais que a causa do A1: sem a guarda de censo (J1 do
`spec-validate`, `piso.merges_ate_piso = 39`) a árvore rasa teria saído
**verde** — `0 problema(s)`, exit 0. Red da metade de I/O medido em dois SOs
(`prova-de-carga.md` §11.3 "red do leitor" e §11.4 "à mão").

### Cadeia arquivo:linha → efeito

- **`.claude/verify/fecho.py:473`** — `git log --first-parent
  --format=%H%x00%P%x00%cI%x00%s refs/remotes/origin/develop`; sob
  `.git/shallow` = piso, devolve uma linha com `%P` vazio.
- **`:487-489`** — o piso é achado (`indice = 0`) ⇒ `piso_na_cadeia = True`;
  **`:491-503`** — nenhum elemento com dois pais ⇒ `merges = []`; **`od.causa`
  fica `None`**: o leitor não consulta `git rev-parse --is-shallow-repository`
  nem compara os pais caminhados com os do objeto (`git cat-file -p`).
- **`:516-543`** (`ler_ancestralidade`) — `merge-base --is-ancestor
  <red.commit> refs/remotes/origin/develop` responde `False` para os dez
  `red.commit` (a caminhada está truncada), com `causa: None`.
- **`:176-190`** (`_impedimento`) — só dois impedimentos: `origin/develop`
  ausente e piso fora da cadeia; "piso na cadeia, cadeia truncada nele" não
  existe. **`:242-286`** julga: as dez `done` mescladas saem **`EM VOO`**
  (afirmação falsa sobre a árvore), `contagens.problemas = 0`.
- **`check_fecho.py:374-397`** — a guarda de censo reprova (`lidos 0 ≠ censo
  pinado 39`) com o detalhe **disjuntivo** "leitor mudo ou histórico
  incompleto": o gate sabe que algo está errado, não sabe o quê, e o leitor
  tinha como saber.
- **Efeito**: o mesmo número — 0 — para "não há merges" e "não consegui
  caminhar" (EA-5: número que não distingue "não medi" de "medi e deu zero").
  A guarda de censo cobre só o trecho até o piso; um histórico raso **acima**
  do piso (base de PR mais nova que o piso, quando `develop` avançar) cai em
  `piso-invalido` com o detalhe errado ("um SHA de outra branch não é piso").

### Encaminhamento

Muda veredito ⇒ **decisão antes de código** (`product-owner`/`tech-lead`):
o leitor passa a nomear o histórico raso (`git rev-parse
--is-shallow-repository` e/ou pais caminhados ≠ pais do objeto) e o julgador
ganha o impedimento — ou como **`piso-invalido`** com detalhe nomeado ("piso
`921977c` é raiz de um histórico raso; `git fetch --unshallow`"), sem tocar o
vocabulário fechado T10, ou como código novo (errata da spec 016). Carrasco
permanente: fixture **pura** F25 na sonda (o leitor reporta o estado, o
julgador não pode responder `EM VOO`), no padrão de F20–F22; a metade de I/O
segue na bateria adversarial, já registrada em `prova-de-carga.md` §11.
Implementação em `fecho.py` do **`core-engineer`**; red e mutante do
**`qa-engineer`** depois da decisão. Independente de `EA-38`: consertar o
vetor não ensina o leitor a falar.

### Decisão de forma — encaminhamento datado (`product-owner`, 2026-09-05)

Encaminhamento, não resolução: o achado só fecha quando o código existir e
for provado (red da metade pura + campanha). Lido nesta árvore:
`fecho.py:176-190` e `:459-503`, `check_fecho.py:374-397` e §CONTRATO,
`fecho.json → _meta.contrato_da_sonda` e `_meta.censo_de_leitura`,
`tests_016_mutants.js:469-474`, spec 016 (T10, §Casos de borda linha 10,
E016-5), `plan.md` ET3 e o `EA-5` acima.

**Decisão: rota (b) — código novo `historico-raso`, veredito `NÃO
DETERMINÁVEL`.** T10 não é tocado.

Por que não reusar `piso-invalido` (rota a):

1. **O código é o discriminador que a sonda pina; o detalhe não é.**
   `contrato_da_sonda.campos_pinados_por_caso_pos` pina `esperado`,
   `oraculo`, `codigo`, `problemas` — e diz por quê: *"pinar só o veredito
   deixaria vivo um julgador que reprova pela razão errada"*. Sob a rota (a)
   a fixture F25 pinaria exatamente o que F21 já pina (`NÃO DETERMINÁVEL ·
   piso-invalido · 1`): a sonda não separaria o julgador certo do que trata
   truncamento como "SHA de outra branch" — o detalhe falso que o caso "raso
   **acima** do piso" já produz hoje (cadeia acima). E o código é também o
   que o harness imprime na nota do controle (`tests_016_mutants.js:41-42`,
   "globais saem com nome"): sob (a), a linha do job `visual` que levou dois
   dias a decifrar passaria a dizer `piso-invalido` para um clone raso — o
   rótulo errado no exato lugar onde o `EA-38` foi diagnosticado.
2. **`piso-invalido` já cobre dois estados, mas de um só remédio** — piso
   fora de forma e piso fora da cadeia dizem ambos "o registro aponta um piso
   que esta cadeia não tem": corrige-se `fecho.json`, ou busca-se a branch
   certa. O terceiro estado tem **outro dono e outro remédio**: o piso está
   certo, o clone é que está raso; conserta-se com `git fetch --unshallow`,
   e `git fetch origin develop` — o remédio de C1(e) — **não repara**
   (medido: `prova-de-carga.md` §11.3, "reparo 1: persiste"). Mesmo rótulo
   para remédios distintos é o `EA-5` por outra porta: em seis meses quem lê
   `piso-invalido` no log abre o `fecho.json`, encontra o piso certo e ou
   desiste ou "corrige" o piso.
3. **Fechado não é congelado.** O que torna um vocabulário fechado é que
   todo valor emitido pertence a uma enumeração comparada por igualdade
   (enum, não regex sobre prosa — T10, R10 §6). Ele cresce por errata
   aditiva com fixture que pina o membro novo — foi assim que a própria 016
   foi de F19/P7 a F24/P11 sob "aditivo, ids permanentes, nunca renumerar",
   e é a forma das causas de `NÃO EXECUTADO` da 013 (conjunto fechado, T4).
   O que dissolve o fechamento é o contrário: esticar um membro até cobrir
   estados de remédio distinto — o enum fica do mesmo tamanho e deixa de
   significar uma coisa só. Cada código responde a "o que faço agora?" com
   uma resposta; código com duas respostas é o número que não distingue.
4. **Precisão sobre o custo, para não o superestimar**: T10 enumera
   **vereditos**; a lista de **códigos** (16) não está na spec — vive em
   `fecho.json → _meta.contrato_da_sonda.codigos`, no §CONTRATO de
   `check_fecho.py`, em `fecho.py → CODIGOS` e em `plan.md` ET3. O veredito
   para "clone raso" já é `NÃO DETERMINÁVEL` pela letra da spec (§Casos de
   borda, linha 10). A errata é pequena e aditiva; o que muda de verdade é o
   dado do gate.

**Terceira rota, considerada e rejeitada — reusar `origin-develop-ausente`.**
É para onde a borda 10 da spec aponta hoje ("clone raso / `git` ausente →
C1 e") e não exigiria errata nenhuma. Rejeitada: a ref **está** presente, o
nome do código mentiria sobre o estado, e o remédio que ele carrega (`git
fetch origin develop`) é justamente o que a §11.3 mediu que não conserta. O
código mais barato que mente é o mais caro.

**Semântica do código novo (para a errata, o docstring e a linha do log):**

- `historico-raso` — o clone é raso (`.git/shallow` presente; `git rev-parse
  --is-shallow-repository` = `true`) e a cadeia first-parent de
  `refs/remotes/origin/develop` termina num commit sem pais caminháveis cujo
  objeto tem pais. **Nenhuma posição relativa ao piso é julgável** — esteja o
  piso na cadeia (índice 0, o caso do `EA-38`) ou fora dela (base de PR mais
  nova que o piso, quando `develop` avançar). Global **impeditivo**, como os
  outros dois: todo sujeito-demanda sai `NÃO DETERMINÁVEL` com este código.
- **Precedência** (decisão 2 do cabeçalho de `fecho.py`, estendida): piso
  fora de 40 hex → `origin/develop` ausente → **histórico raso** → piso fora
  da cadeia. Não se localiza piso numa cadeia truncada pela mesma razão que
  não se localiza numa cadeia ilegível; hoje "raso acima do piso" cai em
  `piso-invalido` com detalhe falso.
- **Detalhe obrigatório** (T10: causa não vazia): o SHA em que a cadeia
  termina, se o piso foi encontrado e em que posição, e o remédio — `git
  fetch --unshallow origin` — nunca `git fetch origin develop`.
- **Detecção** é do `tech-lead`/`core-engineer`; o que decido é o
  vocabulário: `historico-raso` só é emitido quando o clone é de fato raso.
  Truncamento por outro mecanismo (grafts, `refs/replace`) nunca foi
  observado e **não ganha código**: linguagem para caso hipotético é
  linguagem inventada (R12). Cai na guarda de censo, que existe para o que
  não tem nome.
- O nome segue a palavra que a spec já usa ("clone raso", borda 10;
  "checkout raso", Superfície 2): não é vocabulário novo, é identificador
  (INV-10) — não entra no `CONTEXT.md`, como nenhum dos 16 códigos nem as
  causas da 013 entram.

**Pergunta 1 — a guarda de censo fica redundante? Não, e a divisão importa:**

- O **impedimento** é o autorrelato do instrumento: nomeia a causa e cobre o
  raso em qualquer posição — inclusive **acima** do piso, onde a guarda não
  alcança (limite declarado em `_meta.censo_de_leitura.o_que_nao_cobre`).
- A **guarda** é o oráculo **independente** do instrumento (número pinado,
  R10 §3): acusa qualquer contagem errada até o piso, inclusive a causa que
  o leitor não sabe detectar e o defeito do próprio leitor que o cale
  (`D016-M33`).
- **Qual não se remove: a guarda.** Foi ela que pegou o `EA-39`, e é a única
  das duas que não depende de o leitor ser honesto sobre si mesmo — a lição
  literal do `EA-5` (autorrelato de instrumento não é evidência; R2 §4).
  Remover o impedimento perde precisão de mensagem; remover a guarda perde a
  detecção do que ainda não tem nome. Não é cinto e suspensório: uma é o
  diagnóstico, a outra é a medição.
- **Regra de composição** (a errata escreve, senão a contradição volta):
  leitor nomeia truncamento → global `historico-raso` e guarda
  `nao_aplicado` — a regra vigente *"fora disso o global do julgador já
  nomeia a causa"* estendida ao campo novo: **um** FAIL nomeado, não dois.
  Leitor cala com contagem errada → guarda `divergente`, e a disjunção do
  detalhe passa a ser honesta: "o leitor não nomeou causa — defeito do
  instrumento ou truncamento que ele não detecta".
- **Condição para `D016-M33` continuar medindo o que mede**: M33 corta na
  linha `return {"merges": merges, "origin_develop": od}`
  (`tests_016_mutants.js:472`) com `od` intacto. O campo novo tem de estar
  populado **antes** dessa linha — senão o `od` de M33 sai "truncado", o
  impedimento novo dispara, `problemas` deixa de ser 0 e M33 passa a provar
  o impedimento em vez da guarda. Quem confere é o `qa-engineer`.

**Errata da spec 016 — aditiva, id `E016-8` (a série da Fase 6); quem
escreve é o `qa-engineer` com o `tech-lead`; sem ratificação do proprietário
no chat, leva a fórmula de delegação como E3/E016-5.** Pontos:

1. §Casos de borda, linha 10: "clone raso" separa de "`git` ausente" — raso ⇒
   `NÃO DETERMINÁVEL` com código `historico-raso`; C1(e) fica para ref/git
   ausente.
2. E016-5 (b)/(c) e `fecho.json → _meta.censo_de_leitura.quando_se_aplica`:
   "só com `origin/develop` presente, piso na cadeia **e cadeia íntegra**".
3. §Contratos, casos da sonda: **F25** — leitor reporta raso, piso na
   cadeia, `merges: []` ⇒ `NÃO DETERMINÁVEL · null · historico-raso · 1
   problema` (acréscimo sob a regra da Fase 4/6). Recomendo uma segunda
   fixture, "raso com piso fora da cadeia" (`piso_na_cadeia: false` + raso ⇒
   `historico-raso`, não `piso-invalido`): é o que prova a precedência. Ids
   do `qa-engineer`.
4. Dado e contrato: `fecho.json → _meta.contrato_da_sonda.codigos` 16 → 17;
   `check_fecho.py` §CONTRATO ("(16)"; "sob um global IMPEDITIVO (esses
   dois)" → três; shape de `origin_develop`); `plan.md` ET3; cabeçalho de
   `fecho.py`, decisão 2. Tudo pinado ⇒ `gen_pins.py` no mesmo PR (R8 §1).
5. Mutantes: F25 mata "julgador ignora o campo" (metade pura). "Leitor não
   consulta o raso" só é observável num clone raso — mutante de árvore que
   produza `.git/shallow` (é o próprio `git fetch --depth=1` de um commit
   presente, com `--unshallow` na restauração) ou, se for caro demais,
   dívida declarada com carrasco na bateria adversarial de §11. `D016-M33`
   permanece como está.

**O que este encaminhamento não decide**: a detecção (`is-shallow`,
comparação de pais, ou ambas) e o nome do campo em `origin_develop` —
`tech-lead`; implementação — `core-engineer`; red, F25 e mutantes —
`qa-engineer`. Independente do `EA-38`, como o registro acima já diz.

### Resolução — o que foi feito

`fix-finding` do `EA-39` (tipagem `fix`, T090–T099,
`specs/016-registro-contra-execucao/ea39-desenho.md` §8), na branch
`fix/ea39-leitor-mudo` (de `develop`, `ec74d6f`), um commit por wave, com
repin em commit separado após cada um de conteúdo (R8 §1).

**Decisão de forma** (`product-owner`, `e2d3892`) — registrada acima,
"Decisão de forma": código novo `historico-raso`, veredito `NÃO
DETERMINÁVEL`, vocabulário fechado T10 intacto (os 17 códigos vivem em
`fecho.json → _meta.contrato_da_sonda.codigos` e em `check_fecho.py`
§CONTRATO, nunca na spec). O argumento decisivo foi de **remédio**:
`piso-invalido` já cobre dois estados que se consertam corrigindo o registro
(`fecho.json` ou a branch julgada); o terceiro tem outro dono — o clone é
que está raso — e outro remédio (`git fetch --unshallow origin`); o remédio
óbvio, `git fetch origin develop`, foi **medido ineficaz**
(`prova-de-carga.md` §11.3 "reparo 1: persiste", repetido em §12.2 cenário
E.1, "fetch de novo não conserta").

**Desenho** (`tech-lead`, `fac8bfd`, `ea39-desenho.md`): detecção por
**conjunção** — `git rev-parse --is-shallow-repository` como portão barato,
e só sob `true` a comparação `%P` (pais caminhados) × `git cat-file -p`
(pais do objeto) no fim da cadeia. Nenhuma metade sozinha basta, e as duas
falhas estão medidas em `prova-de-carga.md` §12: o flag sozinho acusaria
falso um clone **completo** que fez `fetch --depth=1` de um commit alheio
(cenário **C** — `39 (ok)` · `0 problema(s)` · `--json` byte-idêntico ao
baseline do mesmo código, em §12.1 e de novo em §12.2); a comparação sozinha
confunde graft/replace e custaria processo em toda execução.

**Implementação** (`core-engineer`, `a8bdfe4`, T094) em `fecho.py`:
`C_HISTORICO_RASO` em `CODIGOS`, o ramo em `_impedimento` na posição de
precedência (forma → `origin/develop` ausente → **raso** → piso fora da
cadeia) e a detecção em `ler_merges`, populando `cadeia_integra` /
`fim_da_cadeia` / `posicao_do_piso` **antes** da linha que a âncora do
`D016-M33` corta (`tests_016_mutants.js:472`) — âncora conferida
byte-idêntica e única por preflight (`node tests_016_mutants.js --preflight`)
antes e depois.

**Red commitado** (`c535431`, T091) falhando por dois caminhos
independentes: `check_fecho.py --sonda` (guarda `CODIGOS … a menos:
['historico-raso']`, `✗ F25` obtido `EM VOO`, `✗ F26` obtido
`piso-invalido`, exit 1) e o gate nu (*"árvore não julgada: o julgador
reprovou na própria sonda"*, exit 1).

**Campanha e mutantes** (`qa-engineer`, `5e5b151`, T096): harness `d016` 33
→ 35 pares, com `D016-M34` (julgador ignora `cadeia_integra`) e `D016-M35`
(precedência trocada — F25 não vê M35, por isso F26 existe). Campanha
integral **35/35 DETECTADO · 3 controles OK · 24 s**, com `D016-M33`
mantendo o kill inalterado (censo `0 × 39 · 0 problema(s)`).

**Errata `E016-8`**, aditiva (`82f22b9`), com o texto do global `[FAIL]`
**extraído** da implementação — nunca redigido antes do green — e **medido**
nas duas variantes do detalhe: piso **dentro** do trecho lido ("na posição
N") e piso **fora** do trecho lido, ambas em `prova-de-carga.md` §12.2.

**O achado que a bateria produziu, mais forte que o achado original.** O
caso **G** (`--depth=10`, raso **abaixo** do piso — cadeia lida com 10
commits, `.git/shallow` com 7 linhas pela fronteira do BFS) não existia em
fixture nenhuma (`F25` termina a cadeia **no** piso; `F26` tem o piso **fora**
do trecho). Medido em clone efêmero (`prova-de-carga.md` §12.2, linha "G"):

- **Pré-fix**: a guarda de censo pegava `7 ≠ 39` — mas com **0 problema(s)**
  de julgamento e **sete** das dez demandas `done` mescladas saindo `EM VOO`
  (afirmação falsa sobre a árvore). O número já estava acusado e os
  vereditos já saíam errados mesmo assim.
- **Pós-fix**: o leitor nomeia (`cadeia_integra: false`, `fim_da_cadeia
  fdf5779608dc…`, `posicao_do_piso 2`) ⇒ global `historico-raso` na posição
  2, `em_voo 0`, e a guarda **cede a vez** (`nao_aplicado`, com o `lido 7`
  ainda visível no `--json`) — **um** FAIL, a causa certa.

Isto é o argumento mais forte do fix: mostra que a guarda de censo sozinha
**não bastava** — ela dizia que algo estava errado, nunca o quê, e sete
vereditos de demanda passavam errados por baixo da mesma contagem que a
guarda já sinalizava como divergente.

**O que fica registrado, e não se resolve por si só:**

- **Dívida declarada com causa, não par vazio**: mutante de árvore para a
  metade de I/O do leitor foi **recusado com razão medida**
  (`prova-de-carga.md` §12, cabeçalho): `.git/shallow` é invisível às três
  guardas de restauração do harness (bytes, SHA-256, `git status
  --porcelain` escopado), `git fetch --depth=1` numa worktree muta o `.git`
  **compartilhado por nove worktrees** desta máquina, e `--unshallow` exige
  o remoto e falha em repositório completo. O carrasco é a **bateria
  adversarial** de `prova-de-carga.md` §12 (clones efêmeros em scratchpad,
  nada escrito na árvore), reexecutada a cada mudança de
  `fecho.py:ler_merges` — registrada em `mutation-matrix.json →
  dividas_declaradas`, "leitor sob clone raso".
- **A fixture `F26` é load-bearing**: a bateria negativa do julgador do
  harness provou que julgar `D016-M35` só por `F25` o deixa **sobrevivente**
  — `F25` (cadeia truncada **no** piso) não distingue a ordem certa da
  precedência trocada; só `F26` (truncada **acima** do piso) o mata.
- **Proveniência, para poder ser contestada**: a errata `E016-8` leva a
  mesma fórmula de delegação do `E016-5`/`E3` — decidida **sob a delegação
  geral do proprietário de 2026-08-29**
  (`.claude/agent-memory/doc-writer/project_delegacao-proprietario-2026-08-29.md`),
  **não aprovada por ele pessoalmente**. O `product-owner` registrou
  explicitamente que a **ratificação nominal do usuário no chat seria a
  autorização mais forte e não foi pedida** nesta rodada (`spec.md:884`) —
  delegação não se promove sozinha a ratificação.

**Evidência**: pipeline do worktree `16 PASS · 0 FAIL` (citado pelo
orquestrador na delegação deste fechamento, não medido de novo por este
agente); campanha `d016` **35/35 DETECTADO · 3 controles OK**; red commitado
em `c535431`; bateria de I/O do leitor em `prova-de-carga.md` §12.1 (pré-fix)
e §12.2 (pós-fix); commits de conteúdo `e2d3892`, `fac8bfd`, `82f22b9`,
`c535431`, `81c0326`, `a8bdfe4`, `5e5b151`, repinados em `31eb1a4`,
`1c8f601`, `859ecf5`, `2f0245c` (R8 §1). `gen_pins.py` **não roda neste
passo** — é do `build-engineer`, no PR desta demanda.
## EA-40 — o cabeçalho de `FROZEN_VISUAL_AUTHORITY` cita a §29.4 para uma entrada que a §29.4 não nomeia

**Status**: `resolvido`

**Aberto em**: 2026-09-05. Levantado pelo `qa-engineer` ao executar o repin
inline do `P50-COR4` da demanda 016 (`EA-38`); classificação de achado (não de
defeito do gate) do orquestrador e do `product-owner` — o `qa-engineer`
registrou desenho defensável (viewports e resolução de browser parametrizam
V4+V5) e não o reportou como falha.

### Cadeia arquivo:linha → efeito

- **`tests_p50_core.js:2724-2726`** — o comentário que abre
  `FROZEN_VISUAL_AUTHORITY` diz: *"Estes hashes fixam os arquivos que a §29.4
  declara protegidos"*.
- **`specs/PHASE_5_0_REV_B.md:1613-1620`** (spec selada, imutável) — a §29.4
  nomeia `tests_visual/` e "todas as suítes congeladas (`tests_*.js`
  existentes...)"; **não nomeia `playwright.config.js`** em nenhuma alínea.
- **`tests_p50_core.js:2765`** — `"playwright.config.js"` está na chave do
  mapa mesmo assim, coberto pela alínea (a) de `P50-COR4` (identidade byte a
  byte).
- **Efeito**: toda mudança **só de ferramental** em `playwright.config.js`
  (dono `build-engineer`) passa pela mesma trilha de repin que uma suíte de
  fase selada exigiria — como aconteceu hoje na correção do `EA-38` (repin
  `8ec429a`, comentário `:2733-2764`). O custo é real; a justificativa citada
  para pagá-lo aponta para uma fonte que não a sustenta.

### Distinção da família (não é duplicata)

Mesma família de **E5** (citação que aponta para fonte que não diz aquilo — o
erro do orquestrador corrigido ontem, sete citações propagadas). **Vizinho,
não membro, de `EA-31`**: `EA-31` é registro não confrontado com **execução**;
aqui não há execução nenhuma — é um **registro citando outro registro** (a
spec) que não o sustenta. A comparação que falta é registro↔registro, não
registro↔execução.

### O que este achado NÃO propõe

`specs/PHASE_5_0_REV_B.md` é spec selada e imutável (R6 §4; boundary classe
`frozen`/`legacy` conforme o caso) — **não é tocada por este achado**; mexer
na §29.4 é promoção de REV C, matéria do proprietário
([[project_delegacao-proprietario-2026-08-29]]), não conserto de texto. Este
registro também não decide que `playwright.config.js` deva **sair** da lista
— isso pressuporia que a inclusão é indevida, e o desenho (parametrizar
V4+V5) é defensável.

### Encaminhamento

Rotas possíveis, decisão nomeada para `product-owner`/`tech-lead` (nenhuma
executada aqui):

1. **Corrigir só a justificativa do cabeçalho** em `tests_p50_core.js:2724-2726`
   para dizer que a lista é **mais ampla** que a §29.4, por decisão de quem a
   escreveu (o pin cobre ferramental que parametriza V4+V5, não só o que a
   §29.4 nomeia) — sem mexer na lista. Custo: baixo; `fix-finding`, dono
   `qa-engineer` (autor do gate).
2. **Deixar como está**, registrando aqui que a imprecisão é conhecida e
   aceita — custo: a próxima leitura do cabeçalho repete o mesmo engano.
3. **Mover `playwright.config.js` para um mapa de autoridade próprio**, fora
   de `FROZEN_VISUAL_AUTHORITY`, com justificativa nominal separada da §29.4 —
   custo: maior, toca estrutura do gate `P50-COR4` (rito R10, gate em suíte
   congelada).

Nenhuma rota toca `specs/PHASE_5_0_REV_B.md`.

### Fecho (2026-09-05) — rota 1, executada como `fix-finding` pelo `qa-engineer`

**Decisão de rota** (orquestrador + `product-owner`, no despacho do
`fix-finding`; nenhuma outra executada): **rota 1**. Remover
`playwright.config.js` do mapa seria enfraquecer gate (R10 §1) — e a demanda
016 acabou de provar o valor do pin: o remédio do `EA-38` tocou exatamente esse
arquivo e o pin forçou o repin com trilha. Acrescentar à §29.4 é impossível:
REV B imutável (`P50-GOV2`), expansão de boundary só por spec (R6 §3) —
`specs/PHASE_5_0_REV_B.md` **não foi tocada**. A rota 3 não foi escolhida: toca
estrutura de gate em suíte congelada para sanar um erro de justificativa.
Leitura do `product-owner` que sustenta a redação nova: o pin nasceu na
microfase 5.0.5 (`docs_phase5/MICROFASE_5_0_5_REPORT.md:403-408`, §7.11) como
**hospedeiro da autoridade** — viewports/`projects` e `launchOptions` sob os
quais V4+V5 medem — sem invocar a §29.4.

**Reconfirmado antes de tocar** (passo 1 da skill; medido na worktree
`phase5-014`, branch `fix/ea40-justificativa-do-cabecalho`, HEAD `b534fad`):
(1) a divergência ainda era verdade — `tests_p50_core.js:2724-2727` dizia
"arquivos que a §29.4 declara protegidos"; `specs/PHASE_5_0_REV_B.md:1613-1620`
(blob `4f1583c7…`, o hash registrado no `CLAUDE.md`) nomeia `tests_visual/` e
os `tests_*.js`, não `playwright.config.js`; (2) `tests_p50_core.js` não consta
de `boundary.json`, de `permissions.deny` (`settings.json`) nem do
`guard-boundary.sh`, e o `guard-tdd.sh` só alcança
`ui_*.js|ui_*.css|build_v32_html.py|generate_icons_v32.py` — quem a protege é
`pins.json` (`5cf40876…`, igual ao blob de HEAD; rito: `gen_pins.py` no mesmo
PR); (3) nenhum gate, âncora de mutante (`mutation-matrix.json`: 22 campos
`arquivo`, nenhum em `tests_p50_core.js`) ou scanner lê o texto do cabeçalho —
as frases dele só existem nele mesmo, e a suíte não se auto-pina.

**O que foi feito**: só o comentário que abre `FROZEN_VISUAL_AUTHORITY`
(`tests_p50_core.js:2724-2727` → `:2724-2734`, +7 linhas) foi reescrito. A
lista passa a ser descrita como os arquivos que **hospedam** a autoridade de
identidade visual (cor e ícones): os que a §29.4 declara protegidos
(`tests_visual/`, `tests_icons_m46.js`) **e** `playwright.config.js`, que a
§29.4 **não** nomeia — pinado desde a 5.0.5 (§7.11) por hospedar os viewports
(`BP`/`projects`) e as `launchOptions` sob os quais V4+V5 medem. A frase do
guard estrutural permanece; a trilha desta mudança (achado e data) está no
próprio comentário. Nenhuma chave, nenhum hash e nenhuma alínea de `P50-COR4`
mudou; a trilha do repin do `EA-38` desceu byte-idêntica para `:2740-2771`
(R2 §5). Prova de que a edição é só de comentário: fora do bloco `/* … */`
nenhum byte do arquivo difere (asserido no script de edição), `node --check`
limpo, e a suíte fecha na contagem canônica antes **e** depois.

**Medido** (2026-09-05, mesma worktree): `node tests_p50_core.js` — **64 PASS ·
0 FAIL de 64** antes e depois da edição (`expected_suites.json → p50core` =
64/0; `P50-COR4` PASS); `bash .claude/verify/run.sh --light` — **11 PASS ·
1 FAIL**: o FAIL é `baseline`, `.claude/BACKLOG.md` (registry `cdd4891…` ≠
HEAD `cf5c656b…`), divergência que já existia antes desta edição — nasce do
cherry-pick `b534fad` (a abertura deste achado) sem repin e foi medida idêntica
no controle pré-edição; `bash .claude/verify/compliance-audit.sh` — **17 PASS ·
0 FAIL · 0 WARN** antes deste fecho (EA-40 entre os 31 abertos) e **17 PASS ·
0 FAIL · 0 WARN** (30 abertos, EA-40 fora da lista) depois dele;
`python .claude/verify/check_suites.py` (stage `suites`, lê o disco) —
**19/19 suítes na contagem canônica, 0 problema(s)**, com `p50core` 64 PASS ·
0 FAIL lido do disco já editado. O repin de `tests_p50_core.js` e deste
`BACKLOG.md` (`gen_pins.py`) é do orquestrador, em commit próprio; até ele o
stage `baseline` acusa os dois.
