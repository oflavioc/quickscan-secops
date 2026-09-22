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

**Status**: `resolvido`

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

### Correção do próprio texto (revisão do `qa-engineer`, 2026-09-05)

Os números acima — **11 de 14 `check_*.py`** e **17 de 35 `tests_*.js`** fora
de qualquer `targets` — são **teto, não contagem de defeito**: nenhuma
declaração no repositório afirma que um arquivo *deve* ser alvo de campanha
(não existe um `boundary.json` da cobertura de mutação). O instrumento que
este achado pede é, primeiro, uma **declaração de população** — no espírito
do `boundary.json` de R6 — e só depois a diferença entre essa população
declarada e os `targets` reais. Sem a declaração, "11 de 14" e "17 de 35"
medem o universo de arquivos candidatos, não o universo de arquivos que
deveriam estar cobertos. Isso não muda o efeito medido: os seis órfãos
citados acima continuam órfãos, e a fração de fundo (14 `check_*.py`, 35
`tests_*.js`) segue válida como teto — apenas o tamanho do problema deixa de
parecer maior e mais mecânico do que é.

**Reproduzido nesta sessão**: `python .claude/verify/check_mutation.py` segue
emitindo **12×** `[OK] … campanha não exigida` (um por harness declarado:
`d010`, `d009`, `core`, `p50`, `p51`, `p52`, `d014`, `d011`, `d014vis`,
`d015`, `d016`, `ea41`) e fecha em `---- integridade: 0 problema(s) nomeado(s)
----` seguido de `mutation: 0 campanha(s) executada(s) · 0 problema(s)` — o
achado reproduz e continua `aberto`.

### Censo remedido em 2026-09-11 — o que mudou, e o que não mudou

Remedido porque a própria cadeia registra que **o inventário de órfãos não é
constante do repositório**: muda conforme harnesses novos chegam. Desde a
medição anterior entrou o harness `ea41i` (fix-finding do `EA-42`), e a
pergunta honesta era se ele move o número. **Move pouco, e não onde importa.**

| população | no disco | são `target` | órfãos |
|---|---|---|---|
| `check_*.py` | 14 | **3** (`check_branch_protection`, `check_eol_text`, `check_fecho`) | **11** |
| `tests_*.js` | 36 | 19 | **17** |
| harnesses declarados | **13** (era 12) | — | — |

**Os seis órfãos nomeados na cadeia continuam os seis**, conferidos um a um
nesta data: `check_evidence_bridge.py`, `gen_evidence_bridge.py`,
`evidence_bridge.json`, `tests_session_m48.js`, `compliance-audit.sh` e o
próprio `.claude/BACKLOG.md`. Nenhum foi adotado por harness algum desde
2026-09-05.

Vale registrar o que o `EA-42` mediu e este censo confirma: dos 3 `check_*.py`
que são `target`, só **`check_fecho.py`** é de fato **mutado** por um par
(`M16`/`M29` de `tests_016_mutants.js`); `check_eol_text.py` passou a ser
mutado em 2026-09-11 pelo harness `ea41i`, e `check_branch_protection.py`
é `target` sem mutante. **Ser `target` não é ser coberto** — e é exatamente
essa a diferença que o instrumento pedido por este achado precisa saber
declarar.

> **RETIFICAÇÃO (2026-09-11) — o parágrafo acima está ERRADO na parte factual.**
> Medido diretamente no mesmo dia, ao desenhar a Fase 2 da demanda **018**:
>
> | `check_*.py` que é gatilho | par que o muta |
> |---|---|
> | `check_fecho.py` | **`D016-M16`** — *"o laço da sonda itera sobre `[]`"* |
> | `check_branch_protection.py` | **`D016-M29`** — a mesma mutação, no outro gate |
> | `check_eol_text.py` | os 8 pares `EA42-I*` do harness `ea41i` |
>
> `tests_016_mutants.js` declara **os dois** gates como arquivos mutados:
> `gateFecho: path.join(V, "check_fecho.py")` e
> `gateBp: path.join(V, "check_branch_protection.py")`. **Os três gatilhos são
> mutados; nenhum arquivo está hoje no estado "gatilho sem mutante".**
>
> **Como o erro entrou**: o parágrafo herdou a frase do corpo do `EA-42`
> (2026-09-05), que cita `M16`/`M29` como se **ambos** mutassem `check_fecho.py`.
> Os **ids estavam certos** e a **atribuição colapsou dois arquivos num só** — e eu
> repeti a frase sem reexecutar, que é o que a **R2 §4** proíbe. Retificação
> registrada e não apagada (R2 §5): é a família `EA-31` acontecendo dentro do
> achado que pede o instrumento contra ela.
>
> **O que NÃO muda**: os **seis órfãos** seguem órfãos, reconferidos um a um por
> medição direta — são eles que sustentam o `EA-3`. E a distinção **gatilho ×
> conjunto mutado** continua real e sem oráculo: são campos diferentes, de
> arquivos diferentes, que nada compara hoje. Caiu o exemplo, não a tese.

**Os números seguem sendo teto, não contagem de defeito** (§Correção do
próprio texto, acima): sem uma declaração de população, `11 de 14` mede o
universo de candidatos, não o de arquivos que deveriam estar cobertos.

**Deriva de citação, dentro do próprio achado que fala de registro
apodrecido (família `EA-31`)**: a cadeia acima cita
`.claude/verify/check_mutation.py:58-59` e `:61` para o laço de trigger e o
`[OK] … campanha não exigida`; medido nesta sessão, esse trecho hoje é o
guard de árvore suja (`git status --porcelain`), sem relação com o laço. O
laço `for name, h in MAP.items(): due = …` e o `[OK] … campanha não exigida`
vivem hoje em `check_mutation.py:1332-1335`.

> **Segunda deriva, e a emenda que a encerra (2026-09-11)** — a correção acima
> também apodreceu: `check_mutation.py:1332-1335` hoje é o bloco de
> `EXCEÇÃO OBSOLETA` do `known_issues`, sem relação com o laço. Medido nesta
> data, o `[OK] … campanha não exigida` vive em **`:1687`**.
>
> **Parar de citar linha para este sítio.** Duas derivas em seis dias, no achado
> que fala de registro apodrecido, dizem que o número de linha é o material
> errado: `check_mutation.py` cresce a cada demanda. A âncora durável é o
> **texto**, que é estável porque é a mensagem que o operador lê:
> `grep -n "campanha não exigida" .claude/verify/check_mutation.py`. Quem for
> escrever o remédio usa a busca, não o número — e o número acima fica como
> trilha do que já foi medido, nunca como endereço a confiar.

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

### Nota datada (demanda 017, 2026-09-06)

A demanda 017 (`specs/017-semantica-do-gatilho/spec.md`, D3) **não fecha**
este achado — continua `aberto`, com a mesma população/órfão/"11 de 14 ·
17 de 35" sem dono — mas deixa pronto o insumo que a correção vai precisar:
(i) a classificação de cada path do gatilho em `mutado` / `harness` /
`insumo(<classe>)`, devolvida como **dado** por `mut_relacao` (função pura,
`check_mutation.py`), por harness; (ii) a forma canônica de path (D1), sem a
qual a união entre harnesses não é comparável com `git ls-files`; (iii)
`insumos` em `mutation_map.json` (sete harnesses), que impede o instrumento
de contar oráculo/fixture como cobertura de mutação — a confusão que este
próprio achado nomeia. Nenhuma das três uniões (`⋃ mutados`, `⋃ targets`,
população declarada) é calculada pela 017 — ver `specs/017-semantica-do-gatilho/spec.md`
§"O que fica pronto para o `EA-3` (D3)".

### Nota datada (demanda 017, 2026-09-09) — segunda edição do item (i)

O item (i) da nota acima (2026-09-06) afirma que a classificação de cada path
do gatilho em `mutado` / `harness` / `insumo(<classe>)` é "devolvida como
**dado** por `mut_relacao`" — **falso contra o código**: o retorno real de
`mut_relacao` (contrato C5) não tem as posições `mutado` nem `harness`
(`"mutado" in retorno = False`, `"harness" in retorno = False`, medido nos
onze harnesses de preflight — `specs/017-semantica-do-gatilho/spec-validate.md`
§G4, iteração 2). A Errata `D3(i)` da demanda 017
(`specs/017-semantica-do-gatilho/spec.md:938`) fixa a forma correta e manda
esta segunda edição, sem apagar a primeira:

(i) a classificação de cada path do gatilho em `mutado` / `harness` /
`insumo(<classe>)` é **derivável do retorno C5 (`insumos_ok`) e dos
argumentos (`arquivos_mutados`, `fontes`), por harness, sob `estado == ok`**
— não devolvida como dado por `mut_relacao`. `insumo(<classe>)` sai de
`insumos_ok` (com a classe); `mutado` = `arquivos_mutados` (argumento, C1);
`harness` = `fontes` (argumento, PP-9). `estado == "ok"` é a pré-condição da
derivação, não a identidade (N1, N2 — `specs/017-semantica-do-gatilho/spec.md:895-906`).

Itens (ii) e (iii) da nota de 2026-09-06 não são tocados por esta correção.

### Resolvido em 2026-09-13 — o instrumento existe e responde

O efeito era *"a saída do stage é só verdes"* quando um arquivo mudava fora dos
`targets` de todo harness. A demanda **018** construiu o julgador que faltava, e
ele responde a cada execução:

```
mutation-coverage: 15 na população · 0 órfão(s) · 1 não medido(s) · 11 dívida(s) · 0 problema(s)
```

**Órfão** é exatamente o caso do achado — arquivo na população sem harness que o
cubra — e o stage o **nomeia** em vez de calar. O que sobra não é silêncio: é
**fronteira declarada** (`gen_*.py`, `*.sh`, `*.json`, `tests_*.js` fora da
população, com custo medido em 2026-09-11) e **11 dívidas com prazo**. Fronteira
dita é o oposto do `[OK]` que mente por omissão.


## ~~EA-4 — Âncora de mutante apodrece em silêncio; o aviso existe, mas só quando alguém puxa o gatilho~~

**Status**: `refutado`

~~**Aberto em**: 2026-08-29. **Autoria da sessão da demanda 009**, que encontrou o~~
~~defeito no mesmo dia do `EA-3` e o descreveu como o irmão complementar dele; o~~
~~registro do `EA-3` já reservou nominalmente este id ("será registrado como~~
~~`EA-4` quando a 009 fechar", §Achado-irmão). O id é alocado aqui, na série~~
~~`EA-*`. A cadeia abaixo foi **re-verificada nesta árvore**~~
~~(`feature/013-integridade-da-campanha`, demanda 013), não herdada de relato~~
~~(R2 §4).~~

~~### O que o sistema faz quando falha — é isto que o separa dos vizinhos~~

~~O harness **avisa**: `ERRO <id> · alvo não encontrado em <arquivo>`. Honesto — e~~
~~**tardio**, porque o aviso só sai quando a campanha roda, e a campanha só roda~~
~~quando o gatilho de path dispara **e** o ambiente existe. Contraste dentro da~~
~~mesma família: `EA-3` é o verde que **mente por omissão** (arquivo fora de~~
~~`targets` nunca entra em campanha alguma, e o stage diz `[OK] … campanha não~~
~~exigida`); `EA-5` é o número que **afirma o que não mediu**.~~

~~### Cadeia arquivo:linha → efeito~~

~~- **`tests_p51_mutants.js:196-198`** (estado anterior à demanda 013 — lido em~~
~~  `b725820`): o laço da campanha conta as ocorrências da âncora no alvo~~
~~  (`const n = src.split(m.find).length - 1;`) e, com `n < 1`, imprime~~
~~  `ERRO  <id> · alvo não encontrado em <arquivo>`, empurra~~
~~  `{ id, detected: false, why: "alvo não encontrado" }` e segue para o próximo~~
~~  mutante. Mesma família nas outras harnesses: `tests_p52_mutants.js:36-38`~~
~~  registra que, antes da 013, havia um rótulo `"NÃO APLICÁVEL"` para âncora~~
~~  podre "e todo o resto caía em `NÃO DETECTADO`".~~
~~- **`.claude/verify/check_mutation.py`, laço de trigger** — `due = changed is~~
~~  None or any(t in changed for t in h["targets"])`: a campanha só é **exigida**~~
~~  quando um alvo declarado muda em relação à base. Sem mudança, o harness nem é~~
~~  invocado, e a contagem de âncoras de `tests_p51_mutants.js:196-198` não~~
~~  acontece.~~
~~- **`.claude/verify/mutation_map.json → harnesses.*.requires`**: `p50`, `p51` e~~
~~  `p52` exigem `chromium` — ausente na máquina do proprietário e no job `verify`~~
~~  do CI. Sob `MUTATION_DEFER_MISSING=1` a campanha exigida vira `[DEFER]`~~
~~  nomeado e o stage passa; a contagem de âncoras, de novo, não acontece.~~
~~- **Efeito**: entre um gatilho e o seguinte, a âncora pode ter deixado de casar~~
~~  com o texto do módulo há meses sem que nenhuma máquina diga isso. O aviso~~
~~  existe; o que falta é verificação que **não dependa de alguém acionar a~~
~~  campanha**.~~

~~### Evidência medida na demanda 013~~

~~- **Oito âncoras podres em 180**, na primeira varredura das três harnesses:~~
~~  quatro já conhecidas (`M51-03`, `M51-16`, `M51-18`, `M51-20`) e **quatro que~~
~~  só o preflight revelou** — `p50/M13`, `p50/M23`, `p50/M35`, `p52/V322-M3`.~~
~~  `M35` é a **única ambígua** (`ocorrencias=2`); as outras sete são~~
~~  `ocorrencias=0`.~~
~~- **`M13`, `M23` e `M51-03` apodreceram no MESMO commit**: `4aa1f12`~~
~~  (`feat(phase5): complete Phase 5.1 UAT, executive report, user guide and~~
~~  errata`, 2026-08-22) — três âncoras, um alvo (`ui_p50_shell_v32.js`), uma~~
~~  reescrita. Confirmado por arqueologia `git log -S`~~
~~  (`specs/013-integridade-da-campanha/matriz-gate-mutante.md` §9).~~
~~- **`V322-M3` nasceu podre**: `ocorrencias=0` no próprio commit de autoria,~~
~~  `df5d9f6` (`fix(v3.2.2): finalize context keyboard and transition UX`,~~
~~  2026-08-25). O gate `V322-CTXPAR1` **nunca** rodou contra esta mutação. É o~~
~~  que explica o `106/107` do CI — **não era sobrevivente nem regressão**; era um~~
~~  mutante que nunca existiu na prática, somado como não-detectado por um~~
~~  relatório de dois estados (ver `EA-5`).~~
~~- Nenhuma das oito respondeu "propriedade morta": as oito deram **reancorar**,~~
~~  com gate e propriedade vivos. Âncora podre não é propriedade extinta — e é por~~
~~  isso que o defeito é de **instrumento**, não de desenho do mutante.~~

~~### O que a demanda 013 mudou, e o que este registro não decide~~

~~A 013 introduziu `--preflight` (contrato C1) em `p50`/`p51`/`p52` e a asserção~~
~~`IC-4` no stage `mutation`, que conta as ocorrências de cada âncora **fora** do~~
~~laço de trigger e **independente de `requires`**. Foi esse instrumento que~~
~~produziu os números acima. O `core` segue **sem** preflight — dívida declarada e~~
~~impressa pelo stage (`[DÍVIDA] core: sem preflight declarado — âncora podre só~~
~~aparece na execução da campanha`), registrada em~~
~~`.claude/verify/mutation-matrix.json → dividas_declaradas`. **Se isso fecha o~~
~~`EA-4`, quem declara é o `qa-engineer`, por execução citável, em fix-finding**;~~
~~este registro descreve o defeito e a cadeia e não decide PASS/FAIL (R12 — papel~~
~~do `doc-writer`).~~

### Refutado no fix-finding (2026-09-05), riscado e mantido (R2 §5)

A `spec.md` da demanda 013 já previa o fecho no mesmo PR
(`specs/013-integridade-da-campanha/spec.md:309`); o rito `aberto → resolvido`
nunca foi executado — o `qa-engineer` assume a falha como sua, na revisão de
2026-09-05, e este registro documenta a medição.

Hoje o **`IC-4`** confere **305/305 âncoras únicas em 11 harnesses**, a cada
execução do stage, sem gatilho e sem depender de `requires`
(`check_mutation.py:337`, `:374`; a exclusão do `core` é o `IC_SEM_PREFLIGHT`
em `:119`). Soma refeita nesta sessão sobre a saída medida do próprio stage
(`python .claude/verify/check_mutation.py`): `d009` 19 + `d010` 24 + `d011` 19
+ `d014` 9 + `d014vis` 1 + `d015` 15 + `d016` 35 + `ea41` 3 + `p50` 53 +
`p51` 19 + `p52` 108 = **305**. O instrumento propagou sozinho para os 8
harnesses nascidos depois de `p50`/`p51`/`p52`.

**O residual, nomeado para que riscar não vire ilusão**: o `core` fica de fora
por escopo declarado da própria 013 (T8,
`specs/013-integridade-da-campanha/spec.md:38`, `:441-442`) e não tem
preflight — registrado como **`EA-44`**, ao final deste arquivo, junto com o
`d009` (**`EA-45`**), que nunca recebeu o vocabulário de três estados que
fecha este achado e o `EA-5`.

## ~~EA-5 — Harness que não rodou reporta `NÃO DETECTADO`: o número não distingue "não executei" de "executei e escapou"~~

**Status**: `refutado`

~~**Aberto em**: 2026-08-29. Nasceu do red da demanda 013 (cenário IC-3(a),~~
~~`specs/013-integridade-da-campanha/red-integridade.md:119-149`), medido em~~
~~worktree efêmera e descartada, com as harnesses **intocadas**.~~

~~### O que o sistema faz quando falha~~

~~**Afirma.** `EA-3` cala (verde por omissão) e `EA-4` avisa tarde; `EA-5` produz~~
~~um **veredito sobre um gate que nunca rodou** e o soma numa razão `D/T` que tem~~
~~a aparência de medição. É o único dos três que é **desonesto** no sentido~~
~~estrito: a saída não é incompleta, é falsa.~~

~~### Cadeia arquivo:linha → efeito~~

~~Lida no estado anterior à demanda 013 (`b725820`), na `p51`; a mesma forma de~~
~~dois estados valia nas quatro harnesses:~~

~~- **`tests_p51_mutants.js:185-188`** — `run(cmd)` embrulha `execSync` num~~
~~  `try/catch` e devolve `{ code, out }`, com `out` juntando stdout e stderr. O~~
~~  código de saída **é** capturado ali.~~
~~- **`tests_p51_mutants.js:201-203`** — o laço chama `const r = run(m.cmd);`,~~
~~  procura em `r.out` a linha `FAIL  <gate>` e conclui~~
~~  `const detectado = !!linhaFail && m.reason.test(linhaFail);`. **`r.code` nunca~~
~~  é lido.** Interpretador ausente, build quebrado, suíte que não emitiu a linha~~
~~  do gate esperado e gate que rodou e passou produzem todos `linhaFail === ""` —~~
~~  **indistinguíveis**.~~
~~- **`tests_p51_mutants.js:209`** — imprime `NÃO DETECTADO <id> · <desc>`, o~~
~~  mesmo rótulo que um mutante genuinamente sobrevivente recebe.~~
~~- **`tests_p51_mutants.js:214`** — `MUTATION TESTING (Phase 5.1): <ok>/<total>~~
~~  mutantes detectados pelo gate e motivo esperados`: o denominador conta o que~~
~~  nunca foi medido, e a frase afirma "detectados pelo gate e motivo esperados"~~
~~  sobre execuções em que gate nenhum foi consultado.~~
~~- **Efeito**: a campanha reporta cobertura que não exerceu. Um `0/1` de ambiente~~
~~  ausente é tipograficamente idêntico a um `0/1` de gate sem poder~~
~~  discriminante — e o segundo é defeito grave, enquanto o primeiro é apenas uma~~
~~  máquina errada. Quem lê a razão não tem como separar os dois.~~

~~### Evidência medida na demanda 013~~

~~- **Cenário IC-3(a)** (`red-integridade.md:129`): worktree efêmera em `3e43a15`,~~
~~  `PATH` reduzido a `nodejs` + `System32` — nem `python` nem `python3` resolvem,~~
~~  verificado —, `MUT_ONLY=M51-01`. A `p51` imprimiu `NÃO DETECTADO M51-01 · …`~~
~~  seguido de `MUTATION TESTING (Phase 5.1): 0/1 mutantes detectados pelo gate e~~
~~  motivo esperados`, exit 1, `git status --porcelain` vazio. **O gate~~
~~  `P51-VIS1` não chegou a ser invocado**: o build inicial nem rodou.~~
~~- **Um mutante foi medido, não os vinte.** A execução da campanha completa era~~
~~  proibida naquela wave; o cenário isolou `M51-01` justamente para não disparar~~
~~  campanha. A generalização — numa máquina Windows, onde o literal `python3` do~~
~~  harness não resolve, os vinte mutantes da `p51` cairiam no mesmo rótulo — é~~
~~  **inferência da cadeia acima**, não medição, e fica marcada como tal.~~
~~- **Divergência registrada no mesmo cenário**: `p50` e `p52` **abortam** (exceção~~
~~  não capturada em `build()` na `p50`; `MUTATION P52: falha fatal` na `p52`).~~
~~  As duas formas violam o vocabulário, mas em direções opostas — a `p51`~~
~~  **inventa veredito**, `p50`/`p52` **não chegam a falar**. Defeitos diferentes,~~
~~  remédios diferentes; registrado para que o conserto de um não seja lido como~~
~~  conserto do outro.~~
~~- **Efeito agregado observado no CI**: o `106/107` da `p52` contava `V322-M3`~~
~~  como não-detectado quando `V322-CTXPAR1` jamais rodou contra a mutação —~~
~~  âncora podre de nascença (`EA-4`). A aritmética estava certa; o significado,~~
~~  errado.~~

~~### O que a demanda 013 mudou, e o que este registro não decide~~

~~A 013 substituiu os dois rótulos por um **vocabulário fechado de três estados**~~
~~— `DETECTADO` · `SOBREVIVENTE` · `NÃO EXECUTADO`, este último sempre com **uma**~~
~~causa de conjunto fechado (`interpretador ausente`, `âncora não encontrada`,~~
~~`âncora ambígua`, `rebuild falhou`, `gate não pôde ser executado`) — nas três~~
~~harnesses defeituosas, com a regra de que um número não medido não é impresso.~~
~~O `core` ficou fora por decisão de escopo (é a referência do interpretador).~~
~~**Se isso fecha o `EA-5`, quem declara é o `qa-engineer`**, por execução~~
~~citável; este registro não decide PASS/FAIL.~~

### Refutado no fix-finding (2026-09-05), riscado e mantido (R2 §5)

A demanda 013 substituiu os dois rótulos pelo vocabulário fechado de três
estados — `DETECTADO` · `SOBREVIVENTE` · `NÃO EXECUTADO`, este último sempre
com uma causa do conjunto fechado (`interpretador ausente`, `âncora não
encontrada`, `âncora ambígua`, `rebuild falhou`, `gate não pôde ser
executado`) — nas três harnesses defeituosas (`p50`, `p51`, `p52`).

**Medido nesta sessão**, em execução direta (o próprio código garante que
nenhum arquivo é tocado quando o interpretador falta, antes de mutar —
`tests_p51_mutants.js:381-387`, IC-3(a)), com `MUTATION_PY=inexistente`:
`p51` **19×**, `p50` **53×** e `p52` **108×** `NÃO EXECUTADO · interpretador
ausente`, a razão `DETECTADO`/`SOBREVIVENTE` impressa **0 vezes** nas três,
exit 1 nas três, `git status --porcelain` limpo antes e depois de cada
execução. A cadeia original do achado (`tests_p51_mutants.js:185-209`, o
veredito de dois estados que nunca lia `r.code`) não existe mais nesse trecho.

Confirmado também por contagem independente do vocabulário no fonte:
`grep -c 'NÃO EXECUTADO'` dá **5** em `tests_p51_mutants.js`, **7** em
`tests_p50_mutants.js`, **7** em `tests_p52_mutants.js` — e **0** em
`tests_core_mutants.js` e `tests_009_mutants.js`. Essa ausência nos dois
últimos não é ruído: é exatamente o residual registrado em **`EA-44`**
(`core`) e **`EA-45`** (`d009`), ao final deste arquivo.

## ~~EA-6 — Pré-condição decorativa: o requisito `python` era declarado por quatro harnesses e não podia reprovar em nenhum~~

**Status**: `refutado`

~~**Aberto em**: 2026-08-29. Encontrado pelo `product-owner` na Fase 0 da demanda~~
~~013, ao conferir a evidência do refinamento, e re-verificado nesta árvore.~~

~~### O que o sistema faz quando falha — e por que é o mais difícil de enxergar~~

~~**Nada.** Não cala como o `EA-3`, não avisa tarde como o `EA-4`, não mente como~~
~~o `EA-5`: **deixa passar**. É um portão que sempre abre. E a assimetria que o~~
~~torna perigoso está registrada mais abaixo — **ele nunca mordeu**, porque o~~
~~binário sempre existiu onde se mediu.~~

~~### Cadeia arquivo:linha → efeito~~

~~- **`.claude/verify/check_mutation.py:30-31`** (estado até `e27761d`, lido nesta~~
~~  árvore): dentro de `have(req)`, `if req == "python":` / `return True` —~~
~~  literal, sem consultar o disco. Os irmãos tinham dentes: `node` resolvia por~~
~~  `shutil.which` e `chromium` conferia `CHROME_PATH` e o cache `ms-playwright`.~~
~~  A lacuna era **nominal a um requisito**, não estrutural.~~
~~- **`.claude/verify/mutation_map.json → harnesses.*.requires`**: **os quatro**~~
~~  harnesses — `core`, `p50`, `p51`, `p52` — declaram `python`. Conferido nesta~~
~~  árvore.~~
~~- **`.claude/verify/check_mutation.py`, laço de trigger** —~~
~~  `missing = [r for r in h["requires"] if not have(r)]`: como `have("python")`~~
~~  era sempre `True`, `python` **nunca** entrava em `missing`. O~~
~~  `[FAIL] <harness>: campanha EXIGIDA (alvo mudou) mas ambiente sem …` e o~~
~~  `[DEFER] <harness>: … delegada ao job com …` eram, **para `python`**,~~
~~  inalcançáveis por construção.~~
~~- **Efeito**: a única pré-condição capaz de barrar uma campanha **antes** de ela~~
~~  começar a produzir números era decorativa. Quatro declarações de requisito,~~
~~  nenhuma asserção por trás.~~

~~### EA-6 habilita o EA-5 — a cadeia causal, registrada porque senão se perde~~

~~Os harnesses invocavam o interpretador por **literal** (`python3~~
~~build_v32_html.py`), nome que não resolve no Windows. Numa máquina Windows a~~
~~campanha era, por construção, incapaz de reconstruir o HTML — e portanto de~~
~~consultar gate nenhum. Com dentes no `have()`, o `check_mutation.py` teria~~
~~**parado no portão e nomeado o ausente** (`[FAIL] p51: … ambiente sem python`),~~
~~e a execução nunca teria chegado ao laço do harness que imprime `NÃO~~
~~DETECTADO`. Os `NÃO DETECTADO` do `EA-5` **só existem porque a pré-condição~~
~~deixou passar**: um é a porta, o outro é o que acontece depois dela.~~

~~A consequência prática para quem for consertar: **os dois remédios não se~~
~~substituem**. Consertar só o `EA-5` deixa o portão aberto — a campanha continua~~
~~sendo admitida em ambiente que não a sustenta, só que agora com rótulo correto.~~
~~Consertar só o `EA-6` deixa o relatório de dois estados intacto para **toda~~
~~outra** causa de não-execução: rebuild quebrado, filtro que não seleciona gate~~
~~nenhum, suíte que não emite a linha esperada. A pré-condição cobre um caso; o~~
~~vocabulário cobre a classe.~~

~~### A assimetria que o torna perigoso: hoje não morde~~

~~`python3` existe no CI (Linux) e `python` existe na máquina do proprietário~~
~~(Windows). Nas duas, `return True` e um `have()` com dentes devolvem **o mesmo~~
~~resultado** — e devolveram, em toda execução observada até aqui. O defeito só se~~
~~manifesta onde o interpretador falta, que é exatamente o caso em que ele~~
~~importaria. **Gate que nunca falhou não acumula confiança: acumula a ilusão de~~
~~que a pré-condição está sendo verificada.** É o mesmo formato do `EA-1` — prosa~~
~~declara proteção que a máquina não sustenta — um nível abaixo: **JSON declara~~
~~requisito que a função não sustenta.**~~

~~### Estado atual, e o que este registro não decide~~

~~A **T004 da demanda 013** (commit `d126753`, `fix(013): T004 — green de IC-2, o~~
~~requisito python passa a ter dentes`) trocou o `return True` por~~
~~`shutil.which(mutation_py_bin())`, e a asserção `IC-2` do stage `mutation` mede~~
~~a propriedade de forma adversarial: com `MUTATION_PY` apontando para um binário~~
~~inexistente, `have("python")` **tem de** dizer não. **Nada disso é veredito~~
~~deste registro** — se o green de `IC-2` fecha o `EA-6`, quem declara é o~~
~~`qa-engineer`, por execução citável, em fix-finding. Fica registrado o que~~
~~permanece independentemente dessa decisão: **não existe varredura que procure a~~
~~família** — requisito declarado em `requires` sem asserção que o sustente. O~~
~~próximo requisito decorativo nasceria do mesmo jeito e ficaria igualmente~~
~~invisível, porque o sinal de que ele é decorativo é justamente **a ausência de~~
~~qualquer falha na sua história**.~~

### Refutado no fix-finding (2026-09-05), riscado e mantido (R2 §5)

A **T004** da demanda 013 (commit `d126753`) trocou o `return True` por
`shutil.which(mutation_py_bin())`. Confirmado no HEAD desta sessão
(`check_mutation.py:39-49`): `have()` tem dentes para `python`, `node` e
`chromium`. Medido ao vivo nesta sessão — `python .claude/verify/check_mutation.py`
imprimiu `[OK]   IC-2: requisito "python" reprova com interpretador ausente
(MUTATION_PY=mutation-py-inexistente-013 ⇒ have("python") = False)` — a
asserção `IC-2` mede a propriedade de forma adversarial, a cada execução do
stage.

O que este registro NÃO risca: a ausência de uma varredura que procure a
família (requisito declarado em `requires` sem asserção que o sustente) segue
verdadeira em tese, mas nenhuma instância nova foi encontrada nesta revisão —
abrir achado sem instância seria especular. Fica só citada, não reaberta.

## EA-7 — Gate verde que já não pode reprovar: a Fase 5.2 assumiu a composição que o mutante da 5.1 ataca

**Status**: `resolvido`

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

### Resolvido — a demanda 014 aposentou o par e nomeou o substituto; o registro é que ficou para trás

Reexaminado em 2026-09-14, depois de o orquestrador ter classificado este achado
**duas vezes** como bloqueado por rito D2 (PRs #73 e #74). **Estava errado**:
`tests_p51_mutants.js`, `ui_p50_v32.css` e `ui_p52_workspace_v32.css` não são
`frozen` no `boundary.json` **nem** têm pin em `PROTECTED`. Nenhum rito jamais
barrou este achado.

E, ao medir, o trabalho já estava feito — em **2026-09-01**, pela demanda 014.

| o que o achado cobrava | estado medido hoje |
|---|---|
| `M51-01` afirma propriedade que a mutação não viola | **aposentado**; zero ocorrências em `tests_p51_mutants.js` |
| substituto | **`D014-M10`**, harness `d014vis`, muta a linha **vencedora** (`ui_p52_workspace_v32.css`, `.wrap > #p50-shell { grid-column: 2 → 1 }`) |
| a propriedade tem carrasco vivo? | **sim** — par `D014-M10`/`P52-LAY2`, `ultima_prova 2026-09-04 · KILL`, run `33834890154` |
| o carrasco pode apodrecer em silêncio? | **não** — `d014vis.targets` inclui `ui_p52_workspace_v32.css`: mexer na camada que decide **re-dispara** a campanha |

**A 014 não escondeu o resíduo**: `dividas_declaradas` registra, com todas as
letras, que `P51-VIS1` **fica sem mutante próprio**, e por quê — *"a propriedade
NÃO fica desguardada: quem a mede é o par `D014-M10`/`P52-LAY2`, na camada que
HOJE a decide"*. Dívida declarada com causa, não falsa garantia.

**Vale guardar o caminho**, porque é a parte cara do episódio: a primeira forma do
`D014-M10` (mutar `grid-template-columns` em `:77`) saiu **SOBREVIVENTE** no job
`visual` — tirar o segundo track não tira a segunda coluna, porque
`grid-template-areas:"main side"` da camada 5.1 mantém a grade explícita. Só a
**reancoragem na colocação** (`grid-column`) matou. É a interação entre camadas
que o **`EA-34`** registra como limite de instrumento.

**Nada foi alterado neste fecho.** É registro alcançando a execução — a mesma
família `EA-31` que já fechou `EA-16`, `EA-27`, `EA-28` e `EA-37` nesta semana.


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

**Status**: `resolvido`

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

### Resolvido em 2026-09-14 — o sensor virou semântico; o recorte fica, e agora por mérito próprio

O registro dizia que resolver *"exige mexer na **asserção**, não na derivação"*. É
exatamente o que foi feito: **só o sensor mudou**.

| | antes | agora |
|---|---|---|
| forma | `/Inexistente\|Inicial\|Definido\|Gerenciado\|Otimiz/i` — radicais soltos, case **insensitive** | as **seis formas canônicas** de `stageOf()` (`…v3_1_3.html:484-492`), case **sensitive** |
| razão | nenhuma: casava qualquer ocorrência da palavra | nome de estágio é **rótulo** e nasce capitalizado; o adjetivo em frase nasce minúsculo |

**Medido antes de trocar, nos dois lados:**

| | |
|---|---|
| verdadeiros positivos | **8/8** — as seis canônicas **mais** `Gerenciadoquantitativamente` e `Emotimização`, que é como o DOM as concatena |
| falsos positivos | **6/6 eliminados** (`"Plano de capacitação definido"`, `"Sem processo definido"`, `"Casos de uso gerenciados"`, `"Playbooks definidos"`, `"Cobertura gerenciada e otimizada"`, `"Scans inexistentes ou ocasionais"`) |
| sítios reais do gate | **3/3** seguem casando, e o que legitimamente não publica estágio segue não casando |

**Não enfraquece**: mesmos verdadeiros positivos, seis falsos a menos. É aumento
de poder discriminante, que é o oposto do que a R10 §1 proíbe.

#### O `\b` que quase entrou, e a medição que o barrou

A primeira forma que escrevi tinha `\b` no início. **Falhou nos três sítios
reais**: o DOM concatena sem espaço (`"…5Gerenciado"`) e entre `5` e `G` **não há
fronteira de palavra**. Com ela, o **controle** de `:4277` — que assere que o KPI
do alvo **tem** estágio — reprovaria por motivo falso. A capitalização canônica já
é a âncora semântica; o `\b` era supérfluo e quebrava. É a mesma armadilha de
concatenação que o próprio gate já documentava na derivação do recorte.

#### O que NÃO mudou, e é deliberado

O **recorte do núcleo** continua inteiro. Ele deriva do **critério** — o que o gate
fechado autoriza publicar —, não do falso positivo que o revelou. A nota do gate
foi atualizada para dizer isso: antes ela declarava o achado de fundo; agora
declara que ele foi resolvido e que o recorte permanece **por mérito exclusivo**.

**Prova final é do CI**: `tests_p52_chromium.js` exige Chromium (KI-3). A mudança
também re-dispara a campanha `p52` (109 mutantes), porque a suíte é `target`
declarado dela.


## EA-13 — `P52_TGT_GREEN` não é cor exclusiva do alvo: o mesmo hex é o domínio 2

**Status**: `resolvido`

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

### Fecho (2026-09-11) — a afirmação falsa saiu; a prova exclusiva já existia

**Rito consumido, e é a razão de este achado ter ficado parado**: suíte congelada
§29.4. **Autorização nominal do proprietário no chat em 2026-09-11**, restrita ao
remédio do `EA-13` e a **três sítios** — o comentário de `P52_TGT_GREEN`, a linha
`PDF-TINTA` do ramo de gate fechado e a linha `CONTROLE` de tinta zero. A
autorização de 2026-08-31 **não** foi reaproveitada: ela é expressamente restrita a
`tgt4()` e a duas coisas, e continua valendo só para o que nomeia.

**A descoberta que barateou o remédio**: a prova **exclusiva** de presença do alvo
já existe e já é asserida — polígono com `stroke="#3CB17E"`
(`papel.tgtPts`/`papel.tgtDash`, `:3975-3977`), asserido em `:4215` no ramo fechado
e em `:4236`/`:4238` no controle. Tag de domínio **não é polígono**. O defeito
nunca foi falta de prova: era a **tinta afirmar uma exclusividade que o encoding
não tem**.

**O que mudou, e por que não enfraquece** (R10 §1 — nenhum caso que reprovava
deixou de reprovar):

| sítio | antes | depois |
|---|---|---|
| comentário de `P52_TGT_GREEN` | *"encoding exclusivo do alvo"* — **falso** | diz que o hex é `PR_DOM_HEX[1]` (domínio 2) e aponta onde mora a exclusividade real |
| `PDF-TINTA` (gate fechado) | uma linha: tinta > 0 ⇒ *"cor exclusiva do alvo"* | **duas**, pelo disjunto `papel.tgtPts`: com polígono no DOM, vazamento **corroborado nas duas superfícies**; sem ele, declara o hex **ambíguo** em vez de afirmar o alvo |
| `CONTROLE` de tinta zero | *"nenhuma tinta #3CB17E do alvo"* | mesma asserção, sem o rótulo: é condição **necessária**, e a suficiente já vive em `tgtPts`/`tgtDash` |

**O que este fecho NÃO faz**: desambiguar a fonte da tinta **no próprio raster**
exigiria medir por **região** em vez de por página — mudança em `p52PdfColorInk`,
fora da autorização concedida e de outra ordem de custo. Enquanto isso, um vermelho
de tinta sem polígono no DOM chega **diagnosticável**, com as duas fontes nomeadas,
em vez de enganoso.

**Verificação**: `node --check` limpo; `run.sh --light` 13 PASS · 0 FAIL;
`compliance-audit` 17 PASS · 0 FAIL. **Não executado localmente, com o motivo**
(R2 §1): `p52chromium` e a campanha `p52` (107 mutantes) exigem Chromium — KI-3,
execução canônica no job `visual` do CI. `tests_p52_chromium.js` é `target` do
harness `p52`, logo esta edição **re-dispara a campanha por gatilho de path**.

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

**Status**: `resolvido`

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

### Fecho (2026-09-11) — cabeça **e** cauda, com a omissão declarada

**Remédio** (`.claude/verify/run.sh`, ramo FAIL de `reporta()`): o corte deixa de
ser só pelo começo. Imprime as primeiras `CABECA=30` linhas, **uma linha de
omissão que diz quantas linhas sumiram e qual o total**, e as últimas `CAUDA=15`
— onde vive o veredito. Saída com até 45 linhas sai **inteira**, sem marcador.
As duas constantes ficam nomeadas no topo, junto de `TMPD`, em vez de literais
enterrados na função.

**Por que cauda, e não `head` maior**: o problema não é tamanho, é **posição**. O
veredito de um stage é a última linha por construção (`check_mutation.py:185`
imprime a integridade **antes** de qualquer campanha; `:1289-1305` imprime as
linhas por campanha e o `mut_relata` **depois**). Qualquer corte pelo começo
esconde o veredito quando a saída cresce; aumentar o `head` só adia. Vale para
**qualquer** stage, que é como o achado foi escrito.

**Medido por execução** (2026-09-11, entrada sintética com a forma real — cabeçalho
de integridade, ruído, `[FAIL]`, `mut_relata`, `----`, linha de veredito):

| cenário | antes (HEAD) | depois |
|---|---|---|
| saída de 77 linhas, rc≠0 | última linha visível: `ruido intermediario 17`; veredito e `mut_relata` **invisíveis** | cabeçalho de integridade **e** `[FAIL] d016 · 3 SOBREVIVENTE(s)`, `mut_relata`, `mutation: … · 3 problema(s)`; omissão declarada: `[...] 32 linha(s) omitida(s) no meio (saída completa: 77 linhas) [...]` |
| saída de 12 linhas, rc≠0 | inteira | inteira, **sem** marcador de omissão (conferido: zero ocorrência de `[...]`) |
| rc = 0 | `[PASS] stage` | `[PASS] stage` — ramo intacto |

Aritmética conferida: 77 − 30 − 15 = 32. `bash -n` limpo; pipeline completo
`bash .claude/verify/run.sh --light` → **13 PASS · 0 FAIL**.

**O remédio de método sai de vigor**: não é mais preciso rodar
`check_mutation.py` direto para atribuir causa — a saída do `run.sh` passou a
carregar o veredito. Arquivo pinado (registry R8) → repin no mesmo PR.

**O que este fecho NÃO faz**: não toca `check_mutation.py` nem a ordem em que ele
imprime, e não cria gate sobre a forma da saída do `run.sh` — o `run.sh` é o
executor do pipeline, não objeto dele.

## EA-16 — `UX14` é constante por duas razões independentes: o gate não pode reprovar

**Status**: `resolvido`

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

### Resolvido em 2026-09-13 — a propriedade ganhou carrasco vivo; o gate morto continua morto, e isso está aceito

O efeito era *"o atalho pode passar a atingir o finding errado sem que `UX14` mude
de cor"*. **Deixou de ser verdade.** A demanda 011 criou o substituto e o declarou
na própria spec (*"`D011-KEY1` passa a ser o único carrasco do mapeamento
tecla→finding"*).

Medido hoje: `D011-KEY1` **PASS** (`tests_011_prioridade.js:317`), com oráculo que
recalcula a ordem do vetor da fixture sem chamar `computeFindings()`, e carrascos
`D011-M2`/`D011-M8` provados KILL na campanha `d011`.

**Resíduo aceito**: o `UX14` continua constante pelas duas razões medidas, e vive
em `tests_ux_m41.js` — **harness M41, classe `frozen`**. Consertá-lo custa D2 para
desconstantar um gate cuja propriedade já tem julgador. Não se paga, e fica dito
em vez de disfarçado.


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

## ~~EA-19 — a tela de prioridade pergunta por gaps sobre uma lista vazia quando não há finding~~

**Status**: `refutado`

~~**Aberto em**: 2026-08-31. Caso 5 do refinamento da demanda 011, cuja cadeia~~
~~canônica e enquadramento de produto vivem em~~
~~`specs/011-numeracao-das-prioridades/refinement.md:203` (caso 5) e `:287-296`~~
~~(P9 — escopo secundário declarado). A branch `feature/011-numeracao-das-prioridades`~~
~~**não estava mesclada** quando este registro foi escrito (PR #32 aberto).~~

~~### Cadeia arquivo:linha → efeito~~

~~- **`quickscan_secops_soccmm_v3_1_3.html:522-533`** — `computeFindings()` só empilha~~
~~  finding quando `m.s > 0`; resposta em nível alto não gera nenhum, e `"NA"` vai~~
~~  para `validate` (`:526`). **N = 0 é alcançável** — todas as confirmadas em nível~~
~~  2/3, ou todas "A validar".~~
~~- **`:716`** — `renderPriority()` lê `computeFindings().findings`.~~
~~- **`:723`** — a pergunta é escrita **incondicionalmente**: "Dos gaps identificados~~
~~  na conversa, quais mais impactam a operação ou o negócio hoje?".~~
~~- **`:725-731`** — `.opts` é `findings.map(...).join("")`: com N = 0 o container~~
~~  renderiza **vazio**.~~
~~- **`:732`** — `"0 de 3 selecionadas"`; **`:738`** — a `kbd-tip` continua prometendo~~
~~  "1–9 seleciona os primeiros itens".~~
~~- **Efeito** — o facilitador fica, ao vivo, com uma pergunta sobre um vazio, um~~
~~  contador e uma legenda que afirmam itens que não existem, e **sem nada que diga~~
~~  que não há gap a priorizar**. É ausência renderizada como lista vazia.~~

~~### Escopo e rito~~

~~`quickscan_secops_soccmm_v3_1_3.html` é Camada 1, classe `frozen`~~
~~(`.claude/verify/boundary.json`): qualquer rota nesse arquivo é rito D2, hoje~~
~~Porta B. O tratamento está declarado como **escopo secundário da 011** — o rito é~~
~~da spec dela, não deste registro.~~

> ~~**Emenda (2026-09-12) — o dono declarado acima RECUSOU a tarefa, e este registro~~
> ~~ficou apontando para ele.** A frase *"escopo secundário da 011"* veio da~~
> ~~recomendação **P9 do refinamento** da 011, que de fato propunha incluir. **A spec~~
> ~~dela decidiu o contrário, no portão**, e disse por escrito:~~
~~>~~
> ~~- `specs/011-numeracao-das-prioridades/spec.md:12` — *"**P9** a lista vazia~~
> ~~  **não** entra (achado registrado à parte)"*;~~
> ~~- `:272` — *"A lista vazia (`N = 0`) **não é tratada** — decisão P9 do portão"*;~~
> ~~- `:73`, na tabela de estados — *"A lista vazia em si **é achado registrado à~~
> ~~  parte** (P9) — esta demanda não a trata"*.~~
~~>~~
> ~~A 011 **mesclou** (PR #32, `4f7c140`) sem tratar, **e isso estava certo** — foi~~
> ~~decisão de portão registrada, não omissão. O que estava errado era **este~~
> ~~registro**, que herdou a recomendação e não a decisão.~~
~~>~~
> ~~**Consequência prática**: o `EA-19` **não tem dono por herança**. O remédio exige~~
> ~~**D2 Porta B** — spec commitada + auditoria independente humana (R1) — porque o~~
> ~~arquivo é Camada 1. Não há spec vigente que o autorize.~~
~~>~~
> ~~**O conteúdo, porém, não é decisão nova**: a própria 011 observou que aplica o~~
> ~~princípio já aceito na **009** — *ausência vira aviso único e acionável* —, em vez~~
> ~~da pergunta sobre lista vazia com `"0 de 3 selecionadas"` e a `kbd-tip` prometendo~~
> ~~itens inexistentes.~~
~~>~~
> ~~Emenda escrita ao levar o achado até a porta e parar (família `EA-31`: o registro~~
> ~~afirmava um encaminhamento que a execução tinha desmentido há duas semanas).~~

### Refutado por execução (2026-09-13): a tela existe, o estado não é alcançável

A cadeia `arquivo:linha` acima está **correta linha a linha**. O que a execução
desmentiu é o **efeito**: nenhum gesto do facilitador leva a `renderPriority()`
com `N = 0`. As duas únicas entradas em `PRIORITY_STEP` já são guardadas por
`findings.length`, e nenhuma camada acrescenta uma terceira.

- **`quickscan_secops_soccmm_v3_1_3.html:634`** — `advanceFromQuestion()`:
  `step = f.length ? PRIORITY_STEP : RESULTS_STEP`. Com `N = 0` o fluxo natural
  **pula a tela** e vai direto para os resultados.
- **`:1021`** — o botão *"Editar prioridades"* só é renderizado sob
  `${findings.length? … :""}`; sem finding, o botão **não existe**, e por isso o
  handler de `:1029` nunca tem o que ligar.
- **`ui_ux_v32.js:244`** (`__DEV.showPriority`) e `:247` (`__DEV.gotoStep`) são
  bridges de desenvolvimento sob `window.__DEV`, não superfície de facilitador.
- **`ui_session_v32.js:576`** (`step = snap.step`) é o **rollback** de
  `commitCanonicalOwners`, que restaura o snapshot tomado uma linha antes; a
  importação bem-sucedida passa por `recomputeAfterImport()` (`:602`), que força
  `step = RESULTS_STEP`.
- **`ui_refinement_v32.js:50`** intercepta a transição para `PRIORITY_STEP`, não a
  cria.

**Medição, no artefato que é publicado** (`quickscan_secops_soccmm_v3_2_dev.html`,
jsdom, dirigindo o fluxo real — `advanceFromQuestion()`, `togglePriority()`,
`render()` —, nunca escrevendo `step` à mão exceto no cenário E, que existe para
mostrar o que a injeção produz):

| Cenário | Estado | `step` resultante |
|---|---|---|
| **A** — as 15 respostas em nível 2 (`m.s === 0`) | `findings = 0` | `17` = **resultados** |
| **B** — as 15 respostas `"NA"` | `findings = 0` | `17` = **resultados** |
| **C** — entra na prioridade com 1 gap, declara a prioridade, volta (`step = QS.length`), zera a resposta e avança | `findings = 0` | `17` = **resultados**; `#editprio` **ausente** |
| **D** — resultados com `N > 0` | `findings = 1` | `#editprio` **presente** |
| **E** — `step = PRIORITY_STEP` **por injeção**, `N = 0` | — | `.opt` = 0, `"0 de 3 selecionadas"`, `kbd-tip` intacta |

O cenário **E** reproduz exatamente o que o registro descreve — e só por injeção.
O **C** é o caminho que o registro implicitamente supunha (o facilitador volta e
melhora uma resposta): ele também termina nos resultados.

**Consequência**: o `EA-19` **não é defeito de produto**. Some da lista dos cinco
que o cliente vê, e some com ele o rito **D2 Porta B** — não há mudança a fazer em
Camada 1, logo não há spec commitada nem auditoria humana a pedir.

A **demanda 019**, aberta em 2026-09-12 para remediá-lo, foi **encerrada na Fase 0
sem Fase 1** por falta de objeto; o `refinement.md` dela era o artefato que
afirmava *"o estado é alcançável — medido, não suposto"* com base numa medição
**parcial**: mediu `computeFindings()` e não mediu o roteamento. É a família
`EA-31` aplicada ao próprio trabalho desta sessão — registro comparado contra
leitura, não contra execução.

**O resíduo tem id próprio**: a invariante *"`PRIORITY_STEP` só é alcançável com
`N > 0`"* é real e carrega peso, mas está **implícita em duas guardas
independentes** e **nenhum portão a afirma** — registrada como **`EA-50`**, ao
final deste arquivo.


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

**Status**: `resolvido`

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

### Fecho (2026-09-11) — a decisão de produto chegou, e o texto já estava no papel

**Decisão do proprietário, tomada no chat em 2026-09-11**: a **ancoragem canônica
é o `MAP` (`qid × nível`)**. O `QS_GAP_SUPPORT` **não é revogado** — segue vivo como
superfície declaradamente complementar, de ancoragem diferente. A decisão é de
ancoragem, **não** de fonte única: eleger fonte única é o que o `refinement.md` §P9
da 015 deixou fora, e continua fora.

**Medições que sustentam a escolha** (conferidas no disco em 2026-09-11, `develop`
em `3676986`, nenhum commit tocando os dois arquivos desde 2026-09-01):

- cobertura — `MAP` cobre **15** qids; `QS_GAP_SUPPORT` cobre **4**
  (`detection-lifecycle`, `logs`, `automation`, `vulnerability-management`);
- estrutura — os dois carregam razão por produto (`{p,w}` × `{n,w}`) e `cap:`; o
  `MAP` ainda gradua por nível (`lv:[s2,s1,0,0]`). **Não há vantagem editorial** no
  `QS_GAP_SUPPORT` a preservar — a hipótese de que só ele carregava o "porquê" foi
  medida e é falsa;
- governança — a afirmação canônica passa a morar na camada protegida, não na
  livremente editável.

**Por que este fecho não edita código.** O nó declarativo que o achado pedia **já
foi entregue pela 015**: `ui_v32.js:1092` e `:1099` emitem
`[data-pr-gap-fonte]` — *"Esta lista parte da **capability** associada ao gap, não
do nível respondido na pergunta — por isso pode não coincidir com outras listas
deste relatório."* Protegido por `D015-ANC1`, campanha `d015` 15/15 KILL,
contagem fixada por execução (`expected_suites.json`, 5/0). O "sem texto que diga
qual responde a quê" da cadeia acima **deixou de ser verdade** quando a 015
mesclou; o que faltava era o dono normativo, e é ele que este bloco registra.

### O que este fecho NÃO faz

- **Não nomeia a canônica dentro do PDF.** Fazer o papel dizer "esta é a lista
  canônica" é edição de `ui_v32.js` → autorização nominal §29.4 + repin inline de
  `PROTECTED` + reexecução de `d015`/`core`/`d009` + job `visual` no CI. Medido
  contra o ganho — o leitor já é avisado da divergência e da razão dela — **não se
  paga**. Decisão tomada sob a diretriz permanente do proprietário de 2026-09-11
  (rota mais simples, rápida e econômica; sem revisão desnecessária).
  **Este resíduo ganhou id próprio em 2026-09-11: `EA-48`** — o leitor continua
  recebendo dois conjuntos de produtos para o mesmo gap, e decisão registrada só
  aqui vira silêncio. Levantado por sessão par na revisão deste fecho.
- **Não funde as duas curadorias.** Continua diferido no §P9 da 015, que exige
  decisão sobre reabrir a §UAT-07. Quando (e se) abrir, o delta de conteúdo já está
  medido e nomeado, e é o que uma fusão mal-feita apagaria: só no `QS_GAP_SUPPORT`
  vivem **FortiSOC**, **FortiSOAR**, **FortiAnalyzer**, **FortiClient-EMS** e
  "Automação nativa de FortiAnalyzer/FortiSIEM"; só no `MAP` vivem
  **FortiAI-Assist**, **FortiXDR** e **FortiEndpoint** (cadeia em
  `specs/015-superficies-de-apoio/refinement.md` §M5).
- **Não cria invariante.** A decisão é citável aqui; promovê-la a `INV-*` em
  `.claude/rules/product-invariants.md` custaria gate e entrada em
  `invariants.json`, e nada hoje a viola.

**Nenhum rito foi consumido neste fecho**: nada de Camada 1 foi tocado, logo **não
há D2 Porta B**; nenhum arquivo protegido por §29.4 foi editado. O único custo é o
repin deste registro.

## EA-22 — `P51-REC1` promete "sem duplicação" no nome e não compara `pr-gapsup` com superfície alguma

**Status**: `resolvido`

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

### Resolvido em 2026-09-13 — a promessa saiu do nome, nenhuma asserção saiu do corpo

O gate prometia no título *"sem overclaim **nem duplicação**"* e mediu quatro
coisas, nenhuma delas duplicação:

1. capability canônica do motor;
2. opções da tabela presentes;
3. nenhum apoio anexado a gap **fora do mapeamento normativo** — este é o
   *"sem overclaim"*, e é verdadeiro;
4. nenhum gap normativo sem caminhos de apoio.

**Correção**: o título passa a ser *"recomendações acionáveis junto do gap, sem
overclaim"*. **Nenhuma alínea foi removida nem afrouxada** (R10 §1) — o que se foi
foi a promessa que ninguém cumpria. Medido: `p50core` 65/65.

**Dívida declarada, e com endereço**: a relação entre a lista do gap e a do
card-alvo continua sem julgador. Mas ela deixou de ser invisível ao leitor: desde
o **`EA-48`** o bloco de gaps avisa que as listas podem não coincidir e **nomeia a
canônica**, e a medição das duas listas está no fecho do **`EA-26`**. Sob a
diretriz do proprietário de **2026-09-13**, nenhum gate novo foi criado para isso.


## EA-23 — a mesma capability sob dois nomes no mesmo relatório

**Status**: `resolvido`

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

### Resolvido no fix-finding de 2026-09-13 — o que foi medido, e por que o remédio é este

**O registro nomeava um par; a medição encontrou doze.** Dos 15 pares
pergunta↔capability, **12 têm nomes diferentes** entre `MAP[qid].cap` e
`CAPABILITIES[id].name`. Só três coincidem (`network-visibility`,
`external-surface`, `vulnerability-management`).

**E o alcance é menor do que o registro sugeria, também por medição.** O
vocabulário de catálogo chega ao leitor em **uma única superfície**: o chip de
*"Contexto tecnológico declarado"*. Conferido em quatro capabilities — fora do
chip, as ocorrências do nome de catálogo no DOM são **zero**. Em todo o resto o
leitor vê `MAP[qid].cap` ("Capability a desenvolver:") ou o rótulo da pergunta.

> **Falso positivo desfeito**: *"Capacidade do time"* aparecia 9 vezes e parecia
> um quinto caso. Não é: ali o texto é o **rótulo da pergunta** (`QS[k].lbl`),
> idêntico por coincidência ao nome de catálogo `soc-staffing`.

**O PDF nunca teve o defeito.** `ui_p50_v32.css:669` esconde `#p50-results`
inteiro em `@media print`, e o chip vive dentro dele. A duplicação existia só na
tela do workspace — real para quem conduz a sessão ao vivo, ausente do
documento que o cliente leva.

### Por que não renomear nenhum dos dois

Os dois lados são `frozen` (`boundary.json`): renomear o `MAP` é Camada 1 **mais**
o `v3_1_3_functional_snapshot.json`, que carrega o nome 6 vezes; renomear o
catálogo é `engine_v32.js` mais 4 asserções em `tests_ui_m32.js`/`tests_ui_m332.js`.
Qualquer das duas rotas é **D2 Porta B**.

E não deveriam ser renomeados: **não são sinônimos preguiçosos, são unidades
diferentes.** `MAP[qid].cap` nomeia a prática avaliada por *uma* pergunta;
`CAPABILITIES[].name` nomeia a capability do catálogo, que pode **agregar
várias** — `soc-governance` agrega `mandate`, `governance` e `policies`.

### O remédio

`ui_p50_results_v32.js` (Camada 5, **nem `frozen` nem §29.4**) passa a declarar,
no chip, o nome pelo qual a capability é avaliada — *avaliada como "…"* — **se e
somente se** ela for 1:1 com uma pergunta **e** os dois nomes divergirem. O nome
entra também no `aria-label`: sem isso, quem usa leitor de tela ficaria com o
único nome que não aparece em nenhuma outra seção. **Nenhum rito consumido**:
sem D2, sem Porta B, sem autorização nominal.

### Gate e carrascos

**`P50-VOC1`** em `tests_p50_core.js` (mesma fase, mesmo módulo — R10 §1).
Oráculo **independente**: lê `MAP` e `CAPABILITIES` do estado congelado por
`w.eval` e **recomputa** a decisão; perguntar ao renderer o que ele decidiu seria
concordar com ele por construção. Guarda de tautologia no próprio gate: se um dia
menos de 5 capabilities divergirem, ele **reprova** em vez de passar sem medir.

**Red provado** (`caa28ef`): 64 PASS · 1 FAIL de 65. **Green**: 65 PASS · 0 FAIL.

> **Errata do próprio gate, na primeira execução verde.** A alínea (d) proibia o
> nome do chip de ser *substring* do apelido. É falsa — "Gestão de conhecimento"
> (catálogo) está legitimamente contida em "Gestão de conhecimento operacional"
> (avaliado) — e reprovava o produto **correto**. Foi **trocada**, não removida,
> pela propriedade que se sustenta (o apelido declara, não justapõe). Registrado
> aqui porque corrigir oráculo sem dizer é como afrouxar gate sem dizer.

**Mutantes `M54`–`M56`** registrados em `tests_p50_mutants.js` — julgam por
`tests_p50_core.js`, **sem Chromium**. Entraram nesse harness, e não em um novo,
porque `ui_p50_results_v32.js` já é `target` declarado dele: o gatilho de path que
evita a âncora podre (família `EA-4`) já existia.

**O quarto mutante da bateria não foi registrado, e a ausência é medida.** Trocar
`qids.length !== 1` por `!qids.length` é **equivalente na população alcançável**:
das 25 capabilities, 12 têm chip e zero pergunta, 10 têm chip e uma pergunta, e a
**única** que agrega (`soc-governance`) tem `landscapeEnabled: false` — não rende
chip. Com 0 ou 1 pergunta os dois códigos devolvem o mesmo. A guarda continua no
código porque é defensiva; declará-la coberta seria afirmar cobertura inexistente.

### O que este fecho não faz

- **Não reconcilia os dois vocabulários** — declara a equivalência onde o leitor
  a precisa, e cada nome continua certo no seu próprio contexto.
- **Não alcança `soc-governance`** — a capability agregada não recebe apelido, por
  desenho: escolher uma das três perguntas seria fabricar vocabulário.
- **Não toca o PDF** — que nunca teve o defeito.


## EA-24 — o card neutro culpa o mapeamento quando a causa é ausência de gap

**Status**: `resolvido`

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

### Fecho (2026-09-12) — e o achado era MAIOR do que esta cadeia descrevia

**A medida que faltava**: `maturity.state` tem **quatro** valores
(`engine_v32.js:349-350`) e o card emitia **um** texto para todos:

| estado | o que o facilitador lia | era verdade? |
|---|---|---|
| `gap-high` · `gap-moderate` | *"não há oferta direta mapeada"* | **sim** |
| `mature` | idem | **não** — não há **lacuna**; é o caso que esta cadeia registrou |
| `needs-validation` | idem | **não** — faltam **respostas**; **não estava no registro** |

O **`needs-validation` é o pior dos três** e ninguém o tinha nomeado: o facilitador
lê "lacuna de catálogo" quando o que falta é ele **terminar o assessment**.

**Remédio**: helper `neutralPrioCausa(c)` ramifica por `maturity.state`. **Sem
estado novo** (R9 §5) — o dado já vem em `c`, calculado pelo engine no mesmo passe.
O texto dos dois estados de gap fica **byte a byte** como estava.

**A última frase é idêntica nos três ramos, de propósito**: é a invariante
`[3.2.3-B]` — *prioridade declarada nunca desaparece* — que o comentário do próprio
código protege e que o **`EA-25`** diz não ter âncora normativa. Não foi tocada.

**Rito consumido**: autorização **nominal §29.4** do proprietário no chat em
2026-09-12, restrita a `neutralPrioCardHTML` e ao texto do `div.v32-neutral`. A do
`EA-13` **não** foi reaproveitada. Repin inline de `PROTECTED['ui_v32.js']` pela
**R8 §2**, sem tocar asserção alguma — os gates `P50-GOV1` e `P50-IC4` leem a mesma
entrada e fecharam juntos. **Sem Porta B**: `ui_v32.js` é camada 5.x.

**Conferido antes de editar**: nenhuma âncora de mutante casa na função nem no
texto (`d015`, `core` e `d009` varridos) — mudar o texto não apodrece âncora
alguma, que é a classe do `EA-4`.

**Medido**: `run.sh --light` 14 PASS · 0 FAIL · `compliance-audit` 17/0/0 ·
`p50core` **64/64** (de 62/2 na janela vermelha) · `baseline` 476/476.

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

**Status**: `resolvido`

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

### Medição de 2026-09-12 — o remédio foi implementado, medido e REVERTIDO

Com **autorização nominal do proprietário** para `ui_target_v32.js`, o remédio
óbvio foi escrito e executado: uma cláusula anexada à frase de `tgtEnablersHTML`
dizendo que *o mesmo catálogo aparece nos blocos de "formas de apoio", lá por gap
observado; aqui, só nas práticas declaradas como alvo*. O texto original foi
**preservado verbatim** e a cláusula só acrescenta.

**A duplicação é real, e foi confirmada por leitura**: o `apoio-block`
(`quickscan_secops_soccmm_v3_1_3.html:863`) e o card-alvo
(`ui_target_v32.js:351`) leem **o mesmo** `MAP[qid].lv[nível].c`. A seção de apoio
divide por **priorizado × demais gaps altos** (`:900-911`); o card-alvo, por
**prática declarada como alvo**. As duas dimensões se cruzam — o `"demais"` do
rótulo **não** exclui o card-alvo.

**O que bloqueia não é a boundary — é um quarto anel de proteção que a análise
anterior não tinha visto.** Quatro gates afirmam identidade byte a byte:

| gate | o que afirma | repinável? |
|---|---|---|
| `P50-GOV1` | superfície §29.4 byte-idêntica | **sim** — é pin (R8 §2) |
| `P50-SUF0` | nenhum renderer dono de lógica de suficiência | sim, mesmo mecanismo |
| `P50-SUF8` | equivalência tripla, 1024 vetores | sim, mesmo mecanismo |
| **`D015-GOV1`** | *"`#pr-target` byte-idêntico à âncora em E1..E8 — `ui_target_v32.js` intocado, provado pelo produto"* | **NÃO** |

O `D015-GOV1` **não é pin**: é asserção de **saída** contra commit imutável.
Medido: `E2`/`E5` âncora 45.898 → HEAD 46.470 bytes; `E3` 39.174 → 39.603; `E8`
45.895 → 46.467. Mover essa âncora é **reescrever o oráculo de um gate para
acomodar a mudança** — o que a **R10 §1** proíbe.

**O gate não está errado.** A 015 o escreveu para provar que **ela** não tocou o
arquivo, e ele não distingue *"a 015 quebrou a promessa"* de *"outra demanda,
depois, mexeu com autorização"*. É a família **`EA-20`** em estado puro: gate
saudável cuja premissa venceu.

### As três saídas — nenhuma é do orquestrador

1. **Errata na 015** movendo a âncora do `D015-GOV1`, com a razão registrada —
   a mais correta e a mais cara: mexe em spec validada e o dono do gate é o
   `qa-engineer`.
2. **Outro host** — o único outro é o `apoio-block`, que é **Camada 1** → Porta B.
3. **Deixar parado**, com esta medição no registro. Hoje o leitor vê duplicação
   **sem explicação** — não é erro factual, é falta de contexto.

**Recomendação do orquestrador**: a **3** por ora, e a **1** quando outra demanda
já estiver tocando a 015 — abrir errata em spec validada só para acrescentar uma
frase não se paga sozinho. A decisão é do proprietário.

### Resolvido em 2026-09-13 — o remédio já tinha chegado por outra porta, e a medição de 2026-09-12 descrevia o defeito errado

Remedido **sem uma linha de código** e **sem consumir rito nenhum**: a cura veio do
`EA-48`, escrito em 2026-09-12 para outro fim (o resíduo do `EA-21`), e alcança
este achado inteiro. Medido no **papel real**, pelo `beforeprint` — não pelo
`buildPrintReport()`, que é artefato intermediário e não passa pelo mapa de
apresentação.

#### O defeito era outro, e mais concreto do que "falta de contexto"

A cadeia dizia *"a mesma informação em duas seções"*. **Não é a mesma
informação.** Medido em sessão com duas práticas declaradas como alvo:

| capability | seção **Gaps observados** | seção **Cenário-alvo** |
|---|---|---|
| Análise centralizada, correlação e retenção de eventos | FortiAnalyzer, FortiSIEM, **FortiSOC** | FortiAnalyzer, FortiSIEM |
| Ciclo de vida de detecção | FortiAnalyzer, FortiSIEM, **FortiSOAR**, **FortiSOC** | FortiSIEM |

São **duas respostas diferentes para a mesma pergunta** no mesmo documento — a do
alvo é subconjunto estrito. A causa é a ancoragem: a seção de gaps parte da
**capability**; a do alvo, do **nível respondido**.

#### Por que isso deixou de ser defeito

O `EA-48` pôs no bloco de gaps, **nos dois ramos** (contexto declarado e não
declarado — conferido por execução), a frase que nomeia exatamente essa
divergência:

> *"Esta lista parte da capability associada ao gap, não do nível respondido na
> pergunta — por isso **pode não coincidir com outras listas deste relatório**. A
> **ancoragem canônica** desta sessão é a que parte da pergunta e do nível
> respondido; esta lista é complementar."*

Três coisas, e as três importam:

1. **avisa que outras listas existem**;
2. **explica por que divergem**;
3. **nomeia qual é a canônica** — e a canônica é a do **card-alvo**, que é
   justamente o bloco que a `D015-GOV1` impede de tocar.

E o bloco do alvo declara a própria ancoragem: *"Do catálogo desta sessão, **pelo
gap observado nesta prática**"*.

**A ordem de leitura fecha o argumento**: `pr-findings` vem **antes** de
`pr-target` no papel e "4 Gaps" antes de "5 Cenário-alvo" na tela (medido nos dois
ramos). O leitor recebe a explicação **antes** de encontrar a lista menor.

#### O resíduo, aceito e nomeado

A explicação é **assimétrica**: o bloco de gaps referencia o outro, o card-alvo
não. Fechar a assimetria exige tocar `#pr-target` — e a `D015-GOV1` compara esse
nó **byte a byte** contra commit imutável, em 7 estados. Mover a âncora é
reescrever o oráculo de um gate para acomodar a mudança (**R10 §1**).

Não se paga: o custo é errata em spec validada, e o ganho seria repetir, no
segundo bloco, um aviso que o leitor já recebeu no primeiro. **Não há erro factual
em nenhuma das duas listas** — há duas ancoragens declaradas, ambas ditas.

#### Sobre a medição de 2026-09-12

Aquela sessão implementou uma cláusula em `tgtEnablersHTML`, mediu os quatro anéis
de proteção e reverteu. **A implementação estava certa e o diagnóstico, incompleto**:
tratava o caso como "duplicação sem explicação" quando já não era — a explicação
tinha entrado no mesmo dia, do outro lado do relatório, por outro achado. Fica
registrado: **`EA-31` na própria sessão que mais citou a família.**


## EA-27 — `HIDE_EYEBROWS` existe em três cópias sem dono único

**Status**: `resolvido`

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

### Resolvido em 2026-09-13 — as cópias continuam, a divergência silenciosa não

O efeito medido era *"mutar o array do produto não alcança `U15`, porque o oráculo
lê a própria cópia"*. A demanda 015 fechou isso: `tests_015_apoio.js:311`
(`tresCopiasDaLista`) compara as **três** — produto, oráculo de `U15` e fixture da
010 — dentro do `D015-TIT1`.

Provado por carrasco, não por leitura: **`D015-M18`** muta o `HIDE_EYEBROWS` **do
produto** e o `D015-TIT1 (h1)` o mata (`KILL` na matriz). Mutar o produto passou a
alcançar julgador.

**Resíduo aceito**: as três cópias seguem sem dono único (R9 §5/§8). Unificá-las
mexe em `ui_v32.js` (§29.4) e em duas suítes, para remover uma duplicação que hoje
**não pode divergir em silêncio**. Fica como está, com a razão escrita.


## EA-28 — prova que existiu e saiu do registro: mutante declarado carrasco, provado só em bateria efêmera

**Status**: `resolvido`

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
- **A cadeia própria é uma ausência** — `.claude/verify/check_mutation.py:376-433`
  (deriva de citação medida nesta sessão: a seção `IC-5`/`IC-6` vai hoje até
  `:462`, não `:433` — a família `EA-31` acontecendo dentro do próprio achado
  que a nomeia):
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

### Resolvido em 2026-09-13 — os três buracos nominais fecharam

Medido, um a um:

| o que o achado cobrava | hoje |
|---|---|
| `M17`/`M18` não estavam no harness | **estão** — `D015-M17` e `D015-M18` em `tests_015_mutants.js` |
| não tinham par na matriz | **têm** — um par cada, `ultima_prova 2026-09-01 · KILL` |
| não constavam de `dividas_declaradas` | `D015-M18` consta; `D015-M17` não precisa, porque está no harness |

A prova voltou do histórico do git para o registro, que era o defeito.

**Resíduo nomeado, e não fechado aqui**: continua não existindo cláusula genérica
que compare *mutante declarado em spec* com *par na matriz* — o `IC-5` segue
**nominal à `p51`**. Metade disso já caiu: a **017** generalizou o antigo `IC-6` a
todo harness com preflight. Sob a diretriz do proprietário de **2026-09-13**,
**nenhum gate novo foi criado** para a metade restante; o custo de deixar assim é
que a próxima spec que declarar carrasco sem par depende de leitura humana.


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

**Status**: `resolvido`

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
- **A ausência** — `.claude/verify/check_mutation.py:376-433` (deriva de
  citação medida nesta sessão: a seção vai hoje até `:462`): `IC-5`/`IC-6` são
  nominais à `p51` e comparam **conjuntos**, não **datas**; nenhuma cláusula
  compara `ultima_prova.data` com a data da execução que cobriu o par, e linha
  agregada não tem data por par para comparar.
- **Efeito** — o registro afirma discriminância medida em árvore que já mudou, e a
  leitura humana não distingue "provado ontem" de "provado em outra fase".

### O que este registro não decide

O veredito de cada uma das três (e do conjunto `p51`) é do `qa-engineer`; se o
remédio é campo, cláusula `IC-*` nova ou re-execução, é desenho do `tech-lead` com
o QA; abrir demanda é do orquestrador (R4).

### Resolvido em 2026-09-13 — as provas foram atualizadas com a execução que já existia

As três datas vencidas apontavam para campanhas que **já haviam rodado**. O PR #67
disparou as três no job `visual` do CI (run `34772594772`), completas, e é essa
execução que passa a constar:

| harness | antes | agora | medido |
|---|---|---|---|
| `p50` | `"histórica (fases 5.0.x)"` (1 par agregado) | `2026-09-13` | **56/56 DETECTADO** |
| `p51` | 16 pares em `2026-08-22` + 3 em `2026-08-29` | `2026-09-13` | **19/19 DETECTADO** |
| `p52` | 2 em `2026-08-31` + 2 em `2026-09-04` | `2026-09-13` | **108/108 DETECTADO** |

**24 pares atualizados** — só o campo `data`, mais uma nota `reexecucao` com o run,
as contagens e a conferência de restauração byte a byte (`não-KILL: nenhum`).

> **Errata da primeira tentativa (mesmo dia), porque o CI a reprovou e a razão
> vale mais que o conserto.** Eu tinha reescrito também `resultado` e `registro`,
> e o **`IC-5`** derrubou os 19 pares da `p51`: ele exige `resultado == "KILL"`
> **exato** (qualquer outra coisa passa a precisar de `classificacao` do
> vocabulário fechado) e `registro` que **resolve no disco** —
> `os.path.exists`, não prosa. Os dois campos voltaram ao original.
>
> **E o erro antes desse foi de verificação, não de dados**: fechei a mudança com
> `run.sh --light`, que **pula o stage `mutation`** — justamente o que julga esta
> matriz. Proporcional não é o mesmo que leve: o stage que julga o arquivo tocado
> é obrigatório, mesmo quando o arquivo não é de produto.

**O `P50::M51` fechou.** Era a segunda das três provas vencidas — *"sem KILL
pós-correção"*, com a execução em navegador deferida. A campanha completa de hoje
devolveu **zero sobreviventes em 56**, e isso inclui o `M51`.

### A ausência estrutural continua, e fica declarada em vez de gateada

Nenhuma cláusula compara **data de prova no registro** com **execução real da
campanha**; a atualização acima foi feita à mão. Sob a diretriz do proprietário de
**2026-09-13** (*"projeto interno… não precisamos de tantas revisões e
verificações, vamos focar na qualidade e integridade do produto"*), **não foi
criado gate para isso** — seria instrumento vigiando instrumento, sem alcance no
produto.

**Custo de deixar assim, dito para quem reabrir**: toda mudança em superfície 5.x
re-dispara as três campanhas Chromium e envelhece estes 24 pares de novo. O
remédio barato, se um dia incomodar, é o job `visual` gravar a data no registro ao
final da campanha — uma linha no workflow, não um gate.



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
4. **Citação de sítio de gate que apodreceu por deslocamento** — registrada em
   2026-09-05, achada pelo `qa-engineer` ao fechar o `EA-40`. `mutation-matrix.json:103`
   (`ancora.razao` de `P51-UX2`) cita `tests_p50_core.js:2723-2724` como o sítio do
   gate; medido hoje, aquelas linhas caem dentro do comentário de cabeçalho e o gate
   real começa em `:2966`. A mesma citação ecoa em
   `specs/013-integridade-da-campanha/refinement.md:135` e `spec.md:165`.
   **Distinção que a mantém nesta família e não no `E5`**: aqui a citação **estava
   certa quando escrita** e apodreceu depois, por deslocamento de linha — como no
   `EA-30`. No `E5` a citação apontava para uma fonte que **nunca** disse aquilo.
   **Quarta origem independente**, fora da janela de 2026-09-01 que produziu
   `EA-28`/`EA-29`/`EA-30`: reforça o gatilho de falsificação da família em vez de
   ameaçá-lo.

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
- **`.claude/verify/check_mutation.py:376-433`** (deriva de citação medida
  nesta sessão: a seção vai hoje até `:462` — esta família, dentro do próprio
  achado que a nomeia) — o mais perto que existe: `IC-5`/`IC-6` comparam
  harness ↔ matriz, **nominalmente à `p51`**, por conjunto e não por data.
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

**Status**: `resolvido`

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
  `ctxChave(d) + "\u0000" + d.seletor + "\u0000" + d.prop` (`:399`/`:405`):
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

### Resolvido em 2026-09-14 — o limite ficou escrito onde é lido, nas duas pontas

O registro deixava **três opções** e dizia que escolher era do `qa-engineer`.
Escolhida a segunda — *documentar o limite no cabeçalho de `regra_morta.js` e no
`CONTEXT.md`* — pela razão que o próprio achado dá: **isto é limitação declarada
do instrumento, não defeito dele**. As outras duas custam caro e compram pouco:
a primeira tornaria a varredura `heavy` (geometria renderizada exige navegador),
que é o oposto do desenho da 014; a terceira já é o que acontece hoje, sem nome.

**No instrumento** (`.claude/verify/regra_morta.js`, novo bloco **§3.1**, dentro
do comentário do predicado, onde quem lê o `§3` topa com ele): o laço pula toda
concorrente com `O.prop !== D.prop` e a `§6` agrupa por *contexto + seletor +
propriedade*. Disso decorre que **`viva` significa "decide a própria propriedade",
e não "muda o que se vê"**. A consequência prática está escrita para quem for
escrever mutante de CSS: **`D014-VARR1` verde prova que a declaração DECIDE algo;
não prova que mutá-la será visível para o gate.**

**No glossário** (`CONTEXT.md`), verbete novo **"Declaração viva e inobservável"**,
definido **por critério** e não por lista — como a R12 passou a exigir no fecho do
`EA-47`, no mesmo dia: *viva* decide-se **por propriedade** e sem navegador;
*observável* decide-se **por efeito**, e efeito só um navegador resolve.

### A evidência que fechou o texto veio de outro achado, hoje

Ao reexaminar o **`EA-7`** encontrei a trilha completa do episódio: a primeira
forma do `D014-M10` mutava `grid-template-columns` e saiu **SOBREVIVENTE** no job
`visual` — enquanto esta varredura dizia a declaração **viva**. **As duas leituras
estavam certas**, e é exatamente isso que o bloco novo diz. O mutante só matou
depois de **reancorado na colocação** (`grid-column`).

Esse par — instrumento estático diz `viva`, navegador diz `SOBREVIVENTE` — é a
melhor ilustração possível do limite, e agora está no lugar onde a próxima pessoa
vai precisar dela.

**Medido**: `D014` regra morta **7 PASS · 0 FAIL**; censo de parse **inalterado**
(220/1134) — comentário e verbete não mexem em estrutura.


## EA-35 — a "altura aparente" do `P52-ICON2` é proporcional a `scale²`, não a `scale`: o `getBoundingClientRect()` já inclui o `transform`

**Status**: `resolvido`

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

### Resolvido em 2026-09-14 — era defeito, e o gate irmão já provava

O registro reservava a escolha: **defeito de cálculo** (opção 1) ou **grandeza
intencional com nome errado** (opção 2). O levantamento fechou a favor da 1, por
três evidências independentes.

#### 1 · A intenção declarada é linear

`tests_p52_chromium.js:1106` — *"ICON-REV-A §8.2 · altura aparente medida em
**PIXEL do bounding box da tinta**"*. Pixel de altura da tinta como fração do
tile é grandeza **linear**. O nome estava certo; a conta é que não entregava o
que ele promete.

#### 2 · O gate IRMÃO, no mesmo arquivo, já fazia certo

Encontrado ao aplicar a correção — **evidência que este registro não tinha**:
`P52-ICON1` (`:504`) calcula

```js
/* dimensão APARENTE do artwork = maior lado da tinta, na escala em que
   `object-fit:contain` desenha a imagem dentro do tile */
const drawn = Math.min(ir.width, ir.height);
```

**sem `* scale`**, e com um comentário que define *"dimensão aparente"*
exatamente como a grandeza linear. Os dois gates irmãos mediam a mesma coisa e
**discordavam**; a correção os torna consistentes. Não restava intenção a
preservar.

#### 3 · Os números, medidos antes de tocar

Como `ir` já é pós-transform, `corrigida = atual ÷ scale`. Com os 13 fatores de
`ui_p52_workspace_v32.css:1345-1357`:

| asset | `scale` | deslocamento |
|---|---|---|
| **FortiNDR** | 1.089 | **−6,1 pp** |
| FortiGuard-MDR · FortiSIEM | 1.053 | −3,8 pp |
| FortiAI-Assist · FortiXDR | 1.044 | −3,2 pp |
| FortiAnalyzer | 1.025 | −1,8 pp |
| sete assets | 1.006 | −0,5 pp |
| FortiGuard-Service-Bundle | 0.989 | +0,8 pp |

Maior deslocamento **6,1 pontos**, contra faixa de **15 pontos** (0,675–0,825):
**nenhum asset sai da faixa**, e o **veredito não muda**. O que muda é a
fidelidade do número impresso — que foi o custo real, medido no reparo do
`EA-32`: previsão pinada de **52%** contra medição de **34,9%** e **36,5%**,
diferença que é exatamente o quadrado do fator.

#### Rito consumido

**Autorização do proprietário no chat**, 2026-09-14: respondeu *"Sigo com a
recomendação"* à proposta que nomeava **esta linha** (`:1138`, hoje `:1161`) e a
remoção do `* scale`. **Não se estende** a outra linha nem a outra demanda — mesmo
padrão que esta suíte já registra em `:4023`.

**Limiar `0.68`–`0.82` inalterado**, por decisão do proprietário na mesma resposta
(a régua óptica é conteúdo de produto, R1).

`scale` continua lido e **reportado na evidência** (`scale: scale`): o que saiu foi
a segunda multiplicação, não a medição do fator.

**Prova final é do CI** — `tests_p52_chromium.js` exige Chromium (KI-3), e a
mudança re-dispara a campanha `p52`, porque a suíte é `target` declarado dela.


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

### Medição do fix-finding (`build-engineer`, 2026-09-05) — recusa medida

Tarefa recebida como `fix-finding` apesar do encaminhamento acima (decisão do
orquestrador de restringir o escopo às duas formas baratas já nomeadas pelo
`qa-engineer`). Medido antes de tocar:

- **Reconfirmação**: hoje o `D016-PROT1` responde `PASS · PROTEGIDA` — medido
  duas vezes, `bash .claude/verify/compliance-audit.sh` (17 PASS · 0 FAIL) e
  `--rule=branch-protection` isolado (`develop PROTEGIDA · ruleset 21381133 +
  classic enabled=false · checks obrigatórios: fecho, verify, visual`). O
  sintoma (vermelho transiente) não se reproduz agora — o achado continua
  válido como descrito (é sobre ONDE o sinal mora), a medição é só sobre as
  duas correções propostas.
- **Custo em tempo, medido no run `33978353035` (push, `develop`,
  2026-09-05T16:35)**: job `fecho` completo = **5 s** (16:35:41→16:35:46); só
  o passo `compliance-audit.sh` dentro do job `verify` = **~1 s**
  (16:41:31,17→16:41:32,21, saída `compliance: 17 PASS · 0 FAIL · 0 WARN`);
  job `verify` inteiro = 352 s; job `visual` = 527 s. Rodar o audit inteiro
  dentro do `fecho` custaria ~1 s a mais nos ~5 s dele — **tempo não é o
  fator decisivo em nenhuma das duas formas**.
- **O fator decisivo é o que a P16.a/E1 já resolveu, e as duas formas
  desfazem de um jeito ou de outro**:
  1. *Mover só a seção `branch-protection` para um passo novo do job
     `fecho`*: o job `fecho` é hoje **sem rede por construção** — não por
     acaso, mas porque `check_fecho.py` roda para TODA PR, inclusive "fora da
     população", e sua doutrina (docstring, linhas 25-33) é nunca ficar mudo
     nem depender de algo que possa faltar. Introduzir uma chamada à API do
     GitHub nesse job faz o veredito `NÃO DETERMINÁVEL` do classificador de
     branch-protection (rede indisponível, permissão, resposta inesperada)
     virar `FAIL` sob `GITHUB_ACTIONS` (política T7, `check_branch_protection.py`)
     **dentro do check que hoje é o mais confiável dos três** — um `fecho`
     vermelho por "a API do GitHub não respondeu" não é "a demanda ainda não
     fechou": é o MESMO mecanismo que a E1 e este achado nomeiam, deslocado
     para o job errado, com o agravante de ser o job que a spec 016 desenhou
     para nunca falhar por causa externa.
  2. *Rodar o `compliance-audit.sh` inteiro dentro do `fecho`*: das 9 seções
     do script, 8 (`hooks`, `deny`, `invariantes`, `suites`, `paths`,
     `known-issues`, `waivers`, `backlog`) não têm relação alguma com "esta
     demanda fechou" — um hook desregistrado ou uma exceção nominal sem dono
     passaria a reprovar o `fecho` de QUALQUER PR, inclusive uma que não
     tocou nada disso. É a mesma conflação que este achado descreve,
     espelhada: em vez de "`verify` vermelho por razão que não é 'o código
     está são'", vira "`fecho` vermelho por razão que não é 'a demanda
     fechou'".
  3. *Job dedicado novo* (considerado, não pedido pelo achado): só teria
     efeito de bloqueio real se entrasse em `checks_obrigatorios` do
     branch-protection do GitHub — ou seja, mudar a própria configuração
     viva do repositório que este gate audita, fora da alçada de um
     `fix-finding` (é ação de governança sobre o remoto, não mudança de
     código) e fora do domínio do `build-engineer` sem pedido explícito do
     proprietário. Sem isso, um job novo só audita — não impede merge — o
     que **enfraquece** o gate hoje em vigor (a seção vive num job
     obrigatório).
- **Conclusão**: as duas formas nomeadas pelo `qa-engineer` como "baratas"
  custam pouco em tempo e caro no mesmo eixo que o achado protege — trocam o
  vermelho-alheio de um job pelo vermelho-alheio de outro, ou pior, colocam
  a dependência de rede dentro do único job desenhado para nunca precisar
  dela. **Recusa medida**: nenhuma mudança de código nesta passagem;
  `.github/workflows/verify.yml` e `.claude/verify/compliance-audit.sh`
  permanecem como estavam. Precedentes do mesmo tipo de entrega: recusa do
  `data-engineer` em normalizar a chave irmã `validacao`/`implementacao` do
  planning-state dentro do mesmo commit (ratificada pelo `product-owner`,
  ver EA-33 acima) e recusa do `qa-engineer` em disparar o
  `evento_de_remocao` auto-executável sem as cinco condições que ele mesmo
  pôs (ver EA-32, "Encaminhamento recomendado"). Acompanhado de
  `bash .claude/verify/compliance-audit.sh` (17 PASS · 0 FAIL) e
  `bash .claude/verify/run.sh --light` na mesma medição, como não-regressão.
  Acha aberto o encaminhamento original: só o proprietário decide se aceita
  o custo transiente como está ou pede o job dedicado com a mudança de
  `checks_obrigatorios` no GitHub.

## EA-37 — a regra "commit por caminho nominal com agente em voo" vive só numa trilha de demanda: nem `orchestration.md` nem a skill a carregam

**Status**: `resolvido`

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

### Fechado na varredura de 2026-09-13 — a metade mecânica existe, e foi provada por execução

O achado cobrava o hook. Ele **existe**, e o registro não foi atualizado quando
ele nasceu — instância da família `EA-31` dentro do achado que mais depende de
registro fiel.

- **`.claude/hooks/guard-add.sh`** — `PreToolUse` (matcher `Bash`), bloqueante
  em `git add -A` / `git add .` / `git add --all`. O cabeçalho do próprio hook
  cita `541771a` e `d130a04`, os dois commits desta cadeia.
- **`.claude/settings.json:62`** — o hook está **registrado**; não é script
  órfão.
- **Provado por execução em 2026-09-13**: alimentado com
  `{"tool_name":"Bash","tool_input":{"command":"git add -A"}}`, devolve **exit 2**
  e a mensagem `guard-add: BLOQUEADO — 'git add' de escopo amplo (-A / . / --all).`
- **`.claude/rules/orchestration.md:71-73`** — a metade normativa, que o próprio
  registro já dava por feita, continua lá em §Anti-patterns, na forma
  errado→custo→correto.

O hook resolveu um problema que o registro descrevia como dependente de
disciplina. Nenhum resíduo foi identificado na varredura.


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

## EA-41 — `.claude/BACKLOG.md:2041` carrega dois bytes NUL literais: o registro sai da normalização de texto que ele mesmo vigia (R7 §1)

**Status**: `resolvido`

**Aberto em**: 2026-09-05. Levantado pelo `qa-engineer` de passagem, ao fechar o
`EA-40`; não corrigido no mesmo diff (skill `fix-finding` §4) — registrado aqui
pelo `doc-writer`.

### Cadeia arquivo:linha → efeito

- **`.claude/BACKLOG.md:2041`** (medido nesta árvore após o merge de
  `origin/develop`; **`:2029`** em `origin/develop`, ver a nota de citação
  abaixo) contém **dois bytes `0x00` literais** dentro da string
  ``ctxChave(d) + "<NUL>" + d.seletor + "<NUL>" + d.prop`` — hexdump da linha:
  `... 22 00 22 20 2b 20 ... 22 00 22 20 2b ...` (aspas · NUL · aspas, duas
  vezes). A intenção do texto é citar o separador de string do código-fonte
  (`.claude/verify/regra_morta.js:399`/`:405`, onde a chave é montada como
  `ctxChave(d) + "\x00" + d.seletor + "\x00" + d.prop`) como o escape de duas
  letras `\x00`; o que foi gravado foi o byte em si, não o escape.
- **Origem**: entrou no commit `5729961` ("doc(014): EA-34 — limite do
  instrumento de regra morta…"), na linha 1435 daquela versão do arquivo
  (1489 linhas então; o arquivo tem 3072 linhas nesta árvore) — já
  presente no próprio diff do commit (linha 48 do patch). Confirmado bit a bit
  igual em `origin/develop` (`git fetch origin develop`, mesma posição
  relativa do trecho).
- **Efeito de determinismo** — `git ls-files --eol .claude/BACKLOG.md` responde
  `i/-text w/-text attr/text=auto eol=lf`: o `.gitattributes` pede `eol=lf`
  para o arquivo, mas o conteúdo é classificado **binário** pelo git (por
  causa do NUL) e a normalização de fim de linha fica **desligada** para ele.
  Um commit que introduzisse CRLF neste arquivo passaria sem normalização —
  e `.claude/BACKLOG.md` é arquivo **pinado** (`pins.json`, registry da R8).
  É exatamente a classe de risco que motivou a R7 §1 ("LF em todo texto"),
  nascida do achado E9 (56 de 74 hashes falsos no Windows por CRLF de
  checkout não normalizado) — aqui ela vive dormente dentro do próprio
  registro de achados.
- **Efeito colateral observado, custou tempo**: `grep` sobre o arquivo sem
  `-a` responde `Binary file .claude/BACKLOG.md matches` e não imprime a
  linha — vários agentes e o orquestrador tropeçaram nisso durante dias sem
  saber a causa. `git diff` permanece textual só pela heurística dos
  primeiros ~8000 bytes, o que **esconde** a classificação binária em vez de
  expô-la.

### Nota de citação (2026-09-05) — a linha citada apodreceu dentro do próprio commit que a escreveu

A primeira redação deste achado citava **`:2029`**, e estava **certa contra a
árvore medida**: no commit `7ee85a0` (pai do commit que escreveu esta entrada)
o byte NUL está na linha 2029, conferido. O commit `ecdb4ee` — **este** —
inseriu prosa acima daquele ponto e empurrou o byte para **2041**: a citação
nasceu obsoleta no ato de nascer. Medição da trilha inteira:

| ref | total de linhas | NUL na linha |
|---|---|---|
| `5729961` (origem) | 1489 | 1435 |
| `7ee85a0` (árvore medida pelo QA) | 2902 | **2029** |
| `ecdb4ee` (o commit desta entrada) | 2976 | **2041** |
| `origin/develop` (com o PR #44) | 2851 | 2029 |
| esta árvore, pós-merge e pós-nota | 3072 | **2041** |

Isto é a **quinta instância** da família `EA-31`, e a mais curta: a distância
entre citação correta e citação falsa foi **um commit**, o próprio. Reforça
a tese do `EA-31` sem depender de tempo decorrido: número de linha em documento
que cresce não é endereço estável. **A âncora que não apodrece é o conteúdo**
— a string ``ctxChave(d) + "⟨NUL⟩" + d.seletor``, citada acima, localiza o
defeito em qualquer versão do arquivo; o número é conforto de leitura, não
endereço. Quem consertar o `EA-41` **mede antes**, não confia no número daqui.

### Nota de precisão (2026-09-05) — o escape do fonte é `\u0000`, não `\x00`

A cadeia acima (item `regra_morta.js:399`/`:405`) e o "remédio" candidato
abaixo supõem que o separador da chave é gravado no fonte como o escape
hexadecimal de duas letras `\x00`. Conferido agora, antes de restaurar o
texto: `grep -n '\x00\|\u0000' .claude/verify/regra_morta.js` devolve três
linhas — `:399`, `:405` e `:438` (`chaveCache` de `verificarPasta`) — e as
três usam o escape **Unicode de seis caracteres `\u0000`**, nenhuma usa
`\x00`. A citação restaurada na linha 2041 usa `\u0000`, para ficar byte a
byte idêntica ao fonte; gravar `\x00` teria produzido uma citação **nova e
diferente** do código, não uma correção — a mesma classe de erro que este
achado documenta, só que na prosa em vez do byte. A premissa original
(`\x00`) fica registrada acima como foi escrita — refutada aqui, não apagada
(R2 §5) — e vale também para a frase de mesmo teor em "O remédio" logo abaixo.

### Escopo — só este arquivo (pergunta respondida)

`git ls-files --eol | grep -- "-text"` (medido nesta worktree, antes desta
correção) devolvia **55 linhas**, não todas exclusão de fato: o defeito
(`.claude/BACKLOG.md`, único com `i/-text`) e mais 54 linhas que casam com a
substring `-text` em algum ponto da linha — sendo que **uma** delas casa pelo
**nome do arquivo**, não por coluna de estado: `.claude/agent-memory/
qa-engineer/armadilha-oraculo-de-texto-copymap.md`, que é `i/lf w/lf` (texto
normal — o próprio nome documenta esta classe de armadilha de instrumento, e
o `grep` sobre a linha inteira cai nela). Medição **por coluna** (`i/` ou `w/`
contendo `-text`, a única que conta exclusão de fato): **53** — **27 PNGs**
de `docs_phase5/evidence_v322/**` e **26 SVGs** de `icons_v32_source/**`
(conferido por extensão e por contagem de arquivo: `icons_v32_source/*.svg`
tem 26 entradas, todas rastreadas), todos com `attr/-text`, ou seja,
**exclusão explícita e intencional** no `.gitattributes` (imagem/ícone
declarado binário por desenho, não achado). Depois desta correção, a mesma
busca devolve **54** linhas (as 53 exclusões mais a linha do nome de
arquivo) — `.claude/BACKLOG.md` sai da lista. `.claude/BACKLOG.md` era o
**único** arquivo rastreado em que o `.gitattributes` pedia normalização de
texto (`attr/text=auto eol=lf`) e o conteúdo a desativava por acidente. A
conclusão do achado se mantém — um arquivo só, sem mudar de dono ou de rota;
os números (55/53/26+27) é que estavam errados.

### O remédio, como candidato (não decidido aqui)

Substituir os dois bytes NUL por representação textual (o escape de duas
letras `\x00`, ou o nome do byte em prosa — "byte nulo") restaura a
classificação de texto do arquivo. É `fix-finding` pequeno, sem spec; dono
provável `doc-writer` (autor da prosa, dono do `BACKLOG.md`) ou
`build-engineer` (se a rota preferida tratar isso como correção de registry).
Rito: correção não entra no mesmo diff que a abriu (skill `fix-finding` §4);
decisão de rota e de dono é do orquestrador.

### Fecho (2026-09-05) — rota `doc-writer`, bytes trocados pelo escape do fonte, gate novo em vigia

**Decisão de rota**: `doc-writer`, dono do `BACKLOG.md` e autor da prosa (a
rota candidata 1 do "remédio" acima), despachado pelo orquestrador. Rito:
correção fora do commit RED (`2a1fb7f`, do `qa-engineer` — ele não corrige,
R3 §2); diff mínimo (fix-finding §3): os dois bytes da linha 2041 e este
registro do achado.

**O que foi feito**: os dois bytes \x00 literais da linha 2041 (offsets 116172
e 116190 do arquivo antes da troca, medidos por script) foram substituídos
pelo escape textual \u0000 — não \x00, como a cadeia original e o "remédio"
supunham; ver "Nota de precisão" acima. A linha 2041 passa a ler
``ctxChave(d) + "\u0000" + d.seletor + "\u0000" + d.prop`` (``:399``/``:405``),
byte a byte idêntica à construção da chave em `regra_morta.js:399`/`:405`.
Nenhum outro byte do arquivo mudou fora desta linha, da correção da seção
"Escopo" e da "Nota de precisão" acrescentadas por este fecho.

**O instrumento que passa a vigiar a classe**: gate novo `eol-text`
(`EA41-EOL1`/`EA41-EOL2`, `.claude/verify/check_eol_text.py`), escrito e
provado em RED pelo `qa-engineer` no commit `2a1fb7f` antes desta correção,
com stage próprio no `pipeline.yaml` (dono `qa-engineer`, não tocado aqui). A
R7 §1 ("LF em todo texto") era regra bloqueante **sem checagem executável**
para a classe "texto rastreado que o `.gitattributes` marca `eol=lf` e o
conteúdo desativa por NUL ou CR solitário"; agora tem. O achado sai do
backlog **com instrumento**, não com promessa.

**Medido** (2026-09-05, worktree `phase5-014`, branch `fix/ea41-bytes-nul`):
- `python .claude/verify/check_eol_text.py` — antes da correção (RED do
  `qa-engineer`, commit `2a1fb7f`): `[FAIL] EA41-EOL1(a) .claude/BACKLOG.md —
  attr/text=auto eol=lf · i/-text w/lf: classificado binário ... causa
  (índice): nul — NUL=2 (1ª ocorrência: linha 2041)`, `1 problema(s)
  [EOL1(a)=1 · EOL1(b)=0]`, exit 1; depois de trocar os bytes e reindexar por
  caminho nominal (`git add .claude/BACKLOG.md`): **`579 rastreado(s) · 526
  com normalização declarada · 53 excluído(s) por declaração (-text) · 0 sem
  declaração · 0 com CR só no worktree · 0 problema(s) [EOL1(a)=0 ·
  EOL1(b)=0] · 0 falha(s) de instrumento · sonda 13/13`**, exit 0 — os **53
  excluídos por declaração** que o próprio gate conta batem com a medição por
  coluna da "Escopo" acima.
- `git ls-files --eol .claude/BACKLOG.md` — antes: `i/-text w/lf
  attr/text=auto eol=lf`; depois de `git add` por caminho nominal: **`i/lf
  w/lf attr/text=auto eol=lf`**.
- `bash .claude/verify/run.sh --light` — o stage `baseline` **FALHA**, e é
  **esperado até o repin do orquestrador** (R8, fora deste commit):
  `check_baseline.py` mede contra `HEAD` (R2 §2), não contra o índice; antes
  deste commit, `HEAD` ainda é o RED do `qa-engineer` e o `baseline` só acusa
  o que ele já havia introduzido — `pipeline.yaml` divergente e
  `check_eol_text.py` rastreado sem pin. A partir deste commit,
  `.claude/BACKLOG.md` entra como uma **terceira** divergência (o hash de
  `HEAD` muda; o registro ainda cita o anterior, `f9fa841b…`) — as três
  fecham juntas no mesmo `gen_pins.py`, que é do orquestrador, em commit
  separado. Nenhum outro stage do `--light` muda de veredito por esta troca
  de bytes: `eol-text` fecha em **0 problema(s)** antes e depois de
  `env-doctor`/`boundary`/`marker-lint`/`icons-check`/`build`/`lint-arch`/
  `regra-morta`/`state`/`tdd`/`fecho`/`m41`, que não leem este arquivo.
- **Pares de mutante na matriz** (commit `fab2216`, harness `ea41` —
  `tests_ea41_mutants.js` — e fixture `.claude/verify/fixtures_ea41/sujeito.md`
  no mesmo commit da entrada em `mutation-matrix.json`): **`EA41-M1`** (NUL só
  no worktree ⇒ `EOL1(a)`, disjunto `w`), **`EA41-M2`** (CRLF no blob do
  índice sob `eol=lf` ⇒ `EOL1(b)`), **`EA41-M3`** (NUL no blob do índice ⇒
  `EOL1(a)`, disjunto `i` — o estado exato em que o defeito viveu antes desta
  correção). M3 existe além do pedido: a sonda interna do gate arma
  `i/-text` **e** `w/-text` ao mesmo tempo, então não distingue sozinha qual
  dos dois disjuntos da alínea (a) está fazendo o trabalho — M1 mede o `w`,
  M3 mede o `i`; sem M3, metade da alínea ficaria sem testemunha. Medido
  agora (worktree `phase5-014`, branch `fix/ea41-bytes-nul`, HEAD `fab2216`):
  `bash .claude/verify/run.sh --stage=mutation` → **`[PASS] mutation` · 1
  PASS · 0 FAIL**; `python .claude/verify/check_tdd.py` → **`tdd: 11
  demanda(s) · 0 waiver(s) · 0 problema(s)`** e **`matriz gate↔mutante: 163
  pares completos`**. O `qa-engineer` declarou dívida com gatilho para
  `EA41-EOL2` (a cláusula que confere que o próprio `.gitattributes` está
  rastreado e em escopo): sem mutante de árvore porque o estado que a
  exercita é remover a declaração do repositório inteiro, e aí a acusação
  sairia pelo censo tanto quanto pela alínea — kill não atribuível. É a
  forma que `design-decisions.md` já aceita para cláusula defensiva
  declarada, e o `check_tdd` a imprime a cada execução.

## EA-42 — a prova de que o julgador de `eol-text` não mente vive só em bateria efêmera

**Status**: `resolvido`

> **Alcance do `resolvido`**: fecha a **instância** — a prova do julgador deixou de
> viver só em bateria efêmera. A **classe** (não há detector que separe *"gate com
> par possível"* de *"gate sem `target` algum"*) é o **`EA-3`**, que segue `aberto`.
> Ver §"O que este fecho NÃO faz".

**Aberto em**: 2026-09-05. Levantado pelo `qa-engineer`, apontando o
princípio contra o próprio trabalho dele, no fecho do `EA-41`; registrado
aqui pelo `doc-writer`.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/check_eol_text.py`** (gate `eol-text`) tem **duas** provas
  de poder discriminante, de ordens diferentes.
- **Prova 1 — mutantes de ÁRVORE** (o gate é fixo, o mundo muda): que ele
  **acusa o estado errado e absolve o certo**. Provada pelos pares
  `EA41-M1`/`EA41-M2`/`EA41-M3`, agora versionados no harness `ea41`
  (`tests_ea41_mutants.js`) e na matriz (commit `fab2216`). **Resolvida** —
  é o objeto do fecho do `EA-41` acima.
- **Prova 2 — mutantes de INSTRUMENTO** (o gate muda, o mundo é fixo): que o
  **julgador não mente** — que não é um `return PASS`, que não acusa tudo,
  que o parser não é cego, que o código de causa não é constante, que a
  sonda não foi encurtada, que a alínea (b) tem carrasco, que exclusão
  declarada (`-text`) e ausência de declaração não foram confundidas com
  escopo. Provada por **8 mutantes do próprio gate**, numa bateria que rodou
  em cópia efêmera do gate durante a Fase Red (commit RED `2a1fb7f`) — 8/8
  mortos, mais o controle intacto e o mutante mudo em modo completo sobre a
  árvore real. **O único registro que sobrevive dessa bateria é a linha
  `EA41-EOL0/EOL1` de `dividas_declaradas`**
  (`.claude/verify/mutation-matrix.json:2216`) — a mensagem de relatório de
  um agente, sem par na matriz, sem harness, sem trigger de path que a
  re-execute.

### Precedente já pago

Esta classe já custou: `G2` da demanda 015
(`specs/015-superficies-de-apoio/spec-validate.md:118`,
`relatorio-final.md:277-288,512`) — dois carrascos (`M17`, `M18`) declarados
na spec e provados na bateria negativa da Fase 4, sem par no harness; o
registro que os sustentava (`_trilha` de `expected_suites.json`) foi
**substituído** e a prova ficou só no histórico do git, sem trigger que a
re-executasse. A frase que ficou: **"prova que vive só na bateria efêmera
EVAPORA"**. Este achado é a mesma classe, achada pelo autor do instrumento
contra o próprio instrumento.

### Reclassificação (revisão do `qa-engineer`, 2026-09-05): eixo C, detector de eixo A

A classificação acima tratou o `EA-42` como instância da família do `EA-28`
(eixo C — o registro da prova não é comparado com a execução da prova,
`EA-31`). Revisto: o **fato** é mesmo do eixo C — a prova (8/8 mortos)
existiu, foi executada, e o que a sustenta é uma linha de
`dividas_declaradas` sem par nem gatilho, a mesma forma do `EA-28`. Mas o
**detector** que fecharia o caso é do eixo A (cobertura do mapa, `EA-3`): a
única chave mecânica possível seria "julgador declarado em `pipeline.yaml`
que é mutado por algum harness", e essa chave não discrimina hoje. Medido
nesta sessão contra `mutation_map.json`: dos **14** `check_*.py`, **3** são
`targets` de algum harness (`check_branch_protection.py`,
`check_eol_text.py`, `check_fecho.py`) e **11** não são `target` de harness
nenhum. Dos três que são `targets`, apenas **`check_fecho.py`** é de fato
**mutado** por um par (`M16`/`M29` de `tests_016_mutants.js`, "mutantes do
próprio gate"); **`check_eol_text.py`** é `target` (mudá-lo redispara a
campanha `ea41`) mas **não** é mutado por nenhum `MUTANTS` do harness — a
campanha `ea41` muta a árvore/índice que o gate lê, nunca o fonte do gate. A
mesma chave ("é `target`?") que fecharia o `check_fecho.py` deixaria o
`check_eol_text.py` — o objeto deste próprio achado — do lado de fora.

> **RETIFICAÇÃO (2026-09-11) — a frase "apenas `check_fecho.py`" é FALSA, e este
> é o sítio de origem.** Medido ao desenhar a Fase 2 da demanda **018**:
> `D016-M16` muta `check_fecho.py` e **`D016-M29` muta
> `check_branch_protection.py`** — dois gates, uma mutação cada (*"o laço da sonda
> itera sobre `[]`"*), com `tests_016_mutants.js` declarando `gateFecho` **e**
> `gateBp` como arquivos mutados. Os **ids estavam certos**; o que errou foi
> atribuir os dois ao mesmo arquivo.
>
> A frase viajou daqui para o censo do `EA-3` e para dois artefatos da 018 antes
> de alguém reexecutar — seis dias e quatro cópias. Fica **riscada pela razão, não
> apagada** (R2 §5), porque o percurso dela é a melhor evidência que este achado
> tem de si mesmo.
>
> **A tese do `EA-42` não cai**: `check_eol_text.py` era mesmo `target` sem ser
> mutado em 2026-09-05 — e continuou até o harness `ea41i` nascer em 2026-09-11,
> no fecho deste próprio achado. A chave "é `target`?" de fato não discrimina. O
> exemplo que a ilustrava é que estava trocado.

**A consequência prática, que é o que importa registrar**: portar os 8
mutantes de instrumento (o remédio já proposto abaixo) fecha **a instância**
do `EA-42` e não fecha **a classe** — o próximo julgador que ganhar prova só
em bateria efêmera continuará invisível ao mesmo detector, porque não existe
hoje um oráculo que separe "gate com par possível na matriz" de "gate sem
`target` algum".

### Por que isto é achado, e não só dívida na matriz

`EA41-EOL0/EOL1` já está escrito em `dividas_declaradas`
(`mutation-matrix.json:2216`) — mas dívida na matriz é lida por quem abre a
matriz; achado no backlog aparece na listagem do `compliance-audit.sh` a
cada execução. A diferença entre os dois é quem tropeça nela sem procurar.

### Remédio candidato (não decidido aqui)

Portar os 8 mutantes do gate como mutantes de instrumento, no padrão
`d016 M1..M11` (8 âncoras no fonte do gate + o julgador da sonda,
~80 linhas). Dono `qa-engineer`. **Não corrigido neste diff** — este PR é
um `fix-finding` do `EA-41` que já cresceu de dois bytes para gate + harness
+ fixture + três pares; portar os 8 mutantes de instrumento é escopo novo,
`fix-finding` próprio.

### Fecho da INSTÂNCIA (2026-09-11) — a bateria efêmera virou harness

**`tests_ea41_instrumento.js`** (novo, harness **`ea41i`** em `mutation_map.json`):
os 8 mutantes de instrumento versionados. Complementa o `ea41` sem substituí-lo —
`ea41` muta a **árvore** (o gate é fixo, o mundo muda), `ea41i` muta o **gate** (o
mundo é fixo, o gate muda). Ordens diferentes de prova, nenhuma dispensa a outra.

**Desvio deliberado do padrão `d015`/`d016`, que endurece**: a mutação **não** é
in-place com restauração. Cada mutante escreve uma **cópia** em `os.tmpdir()` e
roda o Python sobre ela, com `cwd` na raiz — o gate lê a árvore por `git`, não pela
própria localização (`ESTE_GATE` é constante, não `__file__`). O SHA-256 do fonte
rastreado é medido antes e depois, e divergência é **falha**, não aviso. Não existe
janela em que a árvore esteja mutada (R7 §3).

**Medido** (2026-09-11, py 3.14.7): preflight **8/8 âncoras casando 1×**; campanha
**8 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO**, gate rastreado intacto
(`d49f04390524` antes e depois); stage `mutation` **1 campanha · 0 problema(s)**.

**Duas execuções vermelhas, registradas e não escondidas** (R2 §1):

1. **`EA42-I2` sobreviveu na primeira rodada.** Causa diagnosticada antes de
   atribuir (R2 §3), e era do **mutante**, não do gate: derrubar só a guarda de
   classe não acusa registro limpo — `S2`, `S6` e `S8` atravessam o corpo sem
   `-text` e sem CR no índice —, então ele morria por 3 divergências em vez de 6.
   Reprovação **incidental**, que este harness recusa como kill por desenho.
   Corrigido para acusação incondicional.
2. **`D017-INS1` reprovou a primeira versão da entrada `ea41i`**, e a reprovação
   estava certa: eu havia declarado `check_eol_text.py` como `insumos.oraculo`
   **e** como alvo de mutação. Oráculo que se move junto com o mutante não é
   oráculo. O `insumos` saiu, com a ausência dita no `_trilha` para não ser lida
   como omissão — aqui o gate é o **sujeito mutado**, e o oráculo é o sinal
   declarado por mutante, que vive no harness.

Dívida `EA41-EOL0/EOL1` declarada **quitada** na matriz, sem reescrever o texto
anterior (fica no histórico do git). O gatilho que faltava existe:
`check_eol_text.py` é `target` de `ea41i`, logo qualquer mudança nele re-dispara
**esta** campanha, e não só a de árvore.

### O que este fecho NÃO faz — a classe continua aberta, e ela já tem id

A §Reclassificação acima antecipou: o **fato** é do eixo C, mas o **detector** que
fecharia o caso é do eixo A. Não existe hoje oráculo que separe *"gate com par
possível na matriz"* de *"gate sem `target` algum"* — dos **14** `check_*.py`
medidos em 2026-09-05, **3** eram `targets` e só **1** era de fato mutado. O
próximo julgador que ganhar prova só em bateria efêmera continua invisível ao mesmo
detector.

Essa classe **não ganha id novo**: é literalmente o **`EA-3`** (*"o stage
`mutation` não sabe dizer o que não está checando"*), que segue `aberto`. Cunhar um
`EA-49` aqui duplicaria achado vivo — o oposto do que o `EA-48` ensinou. O que o
`EA-48` cobra é que resíduo não fique **sem** dono; este tem dono, e é o `EA-3`.

## EA-43 — a sonda de `eol-text` deixa diretório órfão em `%TEMP%` no Windows: `rmtree(ignore_errors=True)` engole a falha sobre objeto git somente-leitura

**Status**: `resolvido`

**Aberto em**: 2026-09-05. Medido pelo `qa-engineer` durante a campanha do
`EA-41`, que removeu os órfãos à mão; conferido e reproduzido pelo
`doc-writer` agora.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/check_eol_text.py:278`** — a sonda cria um repositório
  git efêmero com `tempfile.mkdtemp(prefix="eol-text-sonda-")`.
- **`.claude/verify/check_eol_text.py:332`** — a limpeza usa
  `shutil.rmtree(tmp, ignore_errors=True)`.
- No Windows, os objetos do git dentro do repositório efêmero nascem
  **somente-leitura**; o `rmtree` tenta remover, falha, e
  `ignore_errors=True` **engole o erro** silenciosamente — o diretório fica
  em `%TEMP%`.
- **Medido pelo `qa-engineer`**: **38** diretórios `eol-text-sonda-*` órfãos
  em `%TEMP%`, mais **35** criados só no dia da campanha; removidos à mão.
- **Reproduzido pelo `doc-writer` agora** (worktree `phase5-014`, branch
  `fix/ea41-bytes-nul`): `ls "$TEMP" | grep -c eol-text-sonda-` — **10**
  diretórios órfãos presentes antes de qualquer ação minha; uma execução
  isolada de `python .claude/verify/check_eol_text.py` (exit 0) levou a
  contagem a **11** — confirma o crescimento de um por execução, do jeito
  que o `qa-engineer` descreveu. `git status --porcelain`, antes e depois
  da execução, mostrou só a edição deste `BACKLOG.md` — a árvore
  **versionada** fica intacta; o resíduo é só fora dela.

### Por que não é falso verde

O gate julga certo e a árvore versionada permanece íntegra
(`git status --porcelain` limpo, conferido) — isto não é um `PASS` indevido.
É desperdício de disco na plataforma de desenvolvimento, e toca a R7 §3 no
espírito ("verificação nunca escreve na árvore"): a regra fala da árvore
**versionada**; este resíduo vive fora dela, em `%TEMP%`, e cresce sem
limite conhecido. **O CI Linux não sofre** — lá o bit somente-leitura do
objeto git não existe e o `rmtree` limpa sem erro.

### Remédio candidato (não decidido aqui)

`onerror`/`onexc` no `shutil.rmtree` que limpe o bit somente-leitura
(`os.chmod` + retry) antes de remover, em vez de `ignore_errors=True`.
Arquivo **pinado** (`check_eol_text.py`, registry R8) — repin no mesmo PR.
Dono `qa-engineer`, `fix-finding` próprio.

### Fecho (2026-09-11) — a emenda existia e estava órfã; resgatada e reconferida

**Procedência, dita para não se perder**: o remédio foi escrito **nesta worktree
`phase5-014`**, na branch `fix/ea43-ea46`, em `8497d3e` (2026-09-11 01:38), por
uma sessão que **não estava mais ativa** quando este fecho foi escrito. A branch
nunca foi empurrada (`git ls-remote --heads origin fix/ea43-ea46` vazio) e ficou
~16h parada. A autoria do git **não identifica a sessão** — todas commitam sob a
identidade configurada do repositório —, e por isso a procedência vai escrita
aqui, nunca inferida do `%an`.

**O que a emenda faz** (`.claude/verify/check_eol_text.py`, `remove_efemero()`):
handler `onexc`/`onerror` que **acrescenta** `S_IWRITE` ao modo corrente e repete
a operação que falhou; confere o **disco** em vez da ausência de exceção; e
devolve aviso **nomeado** — `[WARN] eol-text sonda/limpeza`, com caminho e
exceção — quando sobra resíduo. WARN e não FAIL por decisão registrada no próprio
cabeçalho: a sonda já rodou inteira, o veredito é sobre a **árvore**, e reprovar
por higiene de `%TEMP%` inventaria condição de falha que este gate não tem (e
deixaria o Windows cronicamente vermelho, `EA-5`). O que não se admite é o
silêncio de antes, e ele morreu.

**Reconferido por execução antes do resgate** (R2 §4 — alegação de outro agente se
verifica por execução, nunca por leitura do commit). 2026-09-11, py 3.14.7,
worktree `phase5-014`: `%TEMP%` com **34** `eol-text-sonda-*` antes; uma execução
de `python .claude/verify/check_eol_text.py` → exit 0, `sonda 13/13`,
`0 problema(s)`, `0 falha(s) de instrumento`; `%TEMP%` com **34** depois — **zero
órfão novo**. Controle na `develop`, medido em separado no mesmo dia: 32 → 33, um
por execução. Nenhuma alínea, cenário (`S0..S12`) ou contagem pinada
(`TOTAL_SONDA=13`, `PROBLEMAS_SONDA=6`) muda.

**O que este fecho NÃO faz**: não toca o `EA-46`, que viaja na mesma branch e
**continua `aberto`** — é latente por medição (os dois pontos cegos existem e
nenhum chamador os alcança), e o commit `3c56eab` apenas declarou a dívida na
`mutation-matrix.json`. Fechar o `EA-43` não fecha o `EA-46`.

## EA-44 — o `core` ficou fora do vocabulário fechado da 013: ambiente incompleto sai como "gate sem poder discriminante", um falso eixo D

**Status**: `resolvido`

**Aberto em**: 2026-09-05. Nasceu como o residual nomeado no fecho de
`EA-4`/`EA-5`/`EA-6` — riscar os três sem nomear o que sobra trocaria um
achado por uma ilusão de cobertura completa.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/check_mutation.py:119`** — `IC_SEM_PREFLIGHT = ("core",)`:
  o `core` fica fora do preflight (`IC-4`) por escopo declarado da demanda 013
  (T8, `specs/013-integridade-da-campanha/spec.md:38`, `:440-441` — ele é a
  referência do interpretador, e tocá-lo era o próprio risco que a demanda
  existia para conter). *(Correção de citação, demanda 017, 2026-09-06: a
  referência apontava `:441-442`, que hoje cai um bullet adiante ("Stage
  novo…"); medido — a frase citada vive em `:440-441`.)* Sem preflight, uma
  âncora podre nele só aparece na
  execução da campanha — medido nesta sessão, `[DÍVIDA] core: sem preflight
  declarado — âncora podre só aparece na execução da campanha`
  (`bash .claude/verify/run.sh --stage=mutation`).
- **`tests_core_mutants.js:76-79`** — quando o `find` não casa mais com o
  módulo (âncora podre), o harness imprime `FAIL  <id> — find-string não
  aplica (módulo mudou: mantenha o mutante, R10)` e empurra o id para
  `escaped`; a linha de fecho, **`:96`** (`CORE MUTATION: <n> KILL · <m>
  escaparam de <total>`), conta esse caso como "escapou" — o mesmo rótulo de
  um mutante que rodou e sobreviveu de verdade. Âncora ausente e mutante
  sobrevivente ficam **indistinguíveis** na única linha que alguém lê
  primeiro.
- **`tests_core_mutants.js:84-88`** — `const dead = code !== 0 &&
  m.reason.test(out);`, seguido de `console.log((dead ? "KILL " : "FAIL ") …
  (dead ? "matou (exit " + code + ")" : "NÃO matou — gate sem poder
  discriminante"))`. Esta bifurcação não distingue **por quê** `code !== 0`
  é falso ou o `reason` não casa: rebuild quebrado, comando do gate
  indisponível, ambiente incompleto (o `qa-engineer` cita ausência de
  `node_modules` como cenário concreto) e mutante genuinamente sobrevivente
  produzem a MESMA linha `"NÃO matou — gate sem poder discriminante"`.
  Confirmado por leitura do código nesta sessão — a bifurcação é estrutural,
  não depende de reproduzir o cenário específico ao vivo (retirar
  `node_modules` desta árvore seria destrutivo e está fora do escopo deste
  PR).
- **`.claude/verify/check_mutation.py:573-580`** — `mut_relata` já nomeia o
  efeito, mas só a metade que o stage enxerga: "harness cujo fecho tem
  formato próprio (`core`, sem o `emitir()` de T4/T5, logo sem estado por
  mutante para relatar — dívida de T8)" imprime `NÃO NOMEADOS` no relato
  por-mutante do stage — mas isso não alcança a linha de fecho do PRÓPRIO
  harness (`:96`), que é onde a ambiguidade tipo-`EA-5` realmente mora.
- **Efeito** — o `core` é o único harness da casa em que uma falha de
  eixo B (instrumento: âncora podre, ambiente incompleto) e uma falha de
  eixo D genuína (gate sem poder discriminante) chegam ao leitor pela MESMA
  frase. Consertar o `EA-5` nos outros harnesses não alcança este: o `core`
  nunca emitiu o vocabulário de três estados para começar.

### O que este registro não decide

Se o remédio é dar ao `core` o mesmo preflight (`IC-4`) e vocabulário fechado
(T4/T5) que `p50`/`p51`/`p52` ganharam na 013, ou um instrumento de forma
diferente (a dívida declarada já nomeia a lacuna): `tech-lead` com
`qa-engineer`. Abrir demanda é do orquestrador (R4); isto não é
`fix-finding` — é comportamento novo de instrumento (R10, "Nascimento de um
gate").

### Nota datada (demanda 017, 2026-09-06)

Este achado passou a ser **credor nomeado no código**, não só no backlog: o
bloco `---- semântica do gatilho (017) ----` (`check_mutation.py`) declara
`D017_CREDOR_CORE = "EA-44"` (`:488`) e imprime, para o `core`,
`[DÍVIDA] core: relação gatilho × conjunto mutado NÃO MEDIDA — sem preflight
(credor: EA-44)` — medido em `red-017.md` e na árvore real
(`specs/017-semantica-do-gatilho/tasks.md`, T012/T028). A 017 **não fecha**
este achado (não dá preflight ao `core` nem toca `tests_core_mutants.js`) —
apenas nomeia, na saída do stage, quem tem de resolvê-lo. `check_mutation.py:476`
e `:531` citam o mesmo credor no comentário e no contrato de `mut_relacao`.

### Resolvido em 2026-09-14 — âncora podre deixou de ser contada como sobrevivente

O efeito era a **indistinção**: `tests_core_mutants.js` empurrava a âncora podre
para o mesmo balde de um mutante que rodou e sobreviveu, e a linha de fecho — a
única que alguém lê primeiro — dizia "escaparam" para os dois.

O `core` migrou para os mesmos três estados do `d009`: âncora que não aplica sai
`NÃO EXECUTADO · âncora não encontrada`, falha de rebuild sai `NÃO EXECUTADO ·
rebuild falhou`, e `SOBREVIVENTE` fica reservado a mutante que **rodou** e não foi
morto. O mutante continua no harness (R10) — o que mudou foi o **rótulo**.

**Medido**: `3 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 3`, restauração
byte a byte OK.

**O que continua fora, por escopo declarado e não por esquecimento**: o `core`
segue em `IC_SEM_PREFLIGHT` (`check_mutation.py:119`). A 013 o excluiu com razão
registrada — ele é a **referência do interpretador**, e tocá-lo era o risco que
aquela demanda existia para conter (T8). Com esta correção, a âncora podre do
`core` ainda aparece só na execução da campanha, mas **aparece nomeada**, que era
o defeito deste achado.


## EA-45 — o resíduo do `d009`: nascido em branch paralela, nunca recebeu o vocabulário de três estados da 013

**Status**: `resolvido`

**Aberto em**: 2026-09-05. Segundo residual nomeado no fecho de
`EA-4`/`EA-5`/`EA-6` — mecanismo distinto do `EA-44`: `d009` TEM preflight
(`IC-4` o cobre — medido nesta sessão, `IC-4: d009: 19 âncora(s) com
ocorrencias == 1 (preflight, C1)`); o que falta é o vocabulário de runtime.

### Cadeia arquivo:linha → efeito

- **`tests_009_mutants.js:483-486`** — a checagem de interpretador
  (`resolvePy`) só existe dentro do bloco `--preflight` (`:434-478`); o modo
  de campanha principal (`main()`, a partir de `:486`) nunca a consulta.
- **`tests_009_mutants.js:507`** — `main()` chama `build()` como primeiro
  efeito, ANTES de tocar qualquer mutante. **Medido nesta sessão**, execução
  direta com `MUTATION_PY=inexistente node tests_009_mutants.js`: exceção
  não capturada (`node:child_process:1017`, `throw err;`), exit 1, **zero**
  linhas `KILL`/`ESCAPOU`/`FALHA DO HARNESS` na saída, `git status
  --porcelain` limpo antes e depois — o crash acontece antes de qualquer
  `fs.writeFileSync` em arquivo de produto, por isso é seguro reproduzir.
  Nenhuma das harnesses irmãs — `p50`/`p51`/`p52` — se comporta assim: as
  três têm o `IC-3(a)` que intercepta o interpretador ausente e emite `NÃO
  EXECUTADO` para cada mutante, sem exceção (ver refutação do `EA-5` acima,
  mesma sessão: `p51` 19×, `p50` 53×, `p52` 108×, todas com o vocabulário
  fechado e exit 1 controlado).
- **`tests_009_mutants.js:503`** (`FALHA DO HARNESS`) e **`:544`**
  (`KILL`/`ESCAPOU`) — o vocabulário PRÓPRIO do `d009`, herdado do formato
  pré-013 (o mesmo formato de dois estados que a refutação do `EA-5` mediu
  em `p50`/`p51`/`p52`). Nunca migrado.
- **`.claude/verify/check_mutation.py:496`** — `RE_MUT_LINHA =
  re.compile(r"^(DETECTADO|SOBREVIVENTE|NÃO EXECUTADO)  (\S+) · (.*)$")`: o
  julgador só reconhece o vocabulário fechado de T4/T5. Nenhuma linha
  `KILL`/`ESCAPOU`/`FALHA DO HARNESS` casa — confirmado por leitura de
  `mut_ler` (`:550-567`) e `mut_relata` (`:570-580`, cujo comentário em
  `:574-577` nomeia só o `core`, mas cuja condição — `if not todos:`,
  `:573` — vale para qualquer harness que não emita o vocabulário fechado,
  `d009` incluído): quando o stage executa a campanha real do `d009`, o
  relato por-mutante cai no mesmo `NÃO NOMEADOS em \`d009\`` que o `core`
  recebe. Não reexecutei a campanha real do `d009` para forçar esse
  caminho ao vivo (exigiria alterar um dos seus alvos para disparar o
  trigger, fora do escopo deste PR); a conclusão vem de leitura direta do
  código dos dois lados (harness e julgador), não de memória.
- **Efeito** — dois defeitos empilhados no mesmo harness: (i) sem
  `IC-3(a)`, uma campanha de `d009` num ambiente sem o interpretador certo
  estoura em vez de reportar `NÃO EXECUTADO`; (ii) mesmo com o interpretador
  presente e a campanha rodando até o fim, o resultado por-mutante não é
  lido pelo julgador do stage — o veredito agregado (`ran`/`fails`) ainda é
  correto (vem do `returncode` do processo), mas a identidade de QUAL
  mutante sobreviveu, se algum sobreviver, não chega ao relatório do stage.

### O que este registro não decide

Portar `d009` para o padrão T4/T5 (`tests_p50_mutants.js`/
`tests_p51_mutants.js`/`tests_p52_mutants.js` como referência) é
comportamento novo de instrumento, não `fix-finding`: `tech-lead` com
`qa-engineer` desenham, o orquestrador abre a demanda (R4).

### Resolvido em 2026-09-14 — o `d009` migrou para o vocabulário fechado da 013

Duas correções, no `tests_009_mutants.js`:

**1. A campanha deixou de sair muda.** O achado media que
`MUTATION_PY=inexistente` produzia exceção não capturada, exit 1 e **zero linhas**
— indistinguível, para quem lê, de campanha que não precisou rodar. O
interpretador passa a ser conferido **antes de qualquer efeito**, e cada mutante
sai `NÃO EXECUTADO · interpretador ausente`. Medido: **19 linhas**, uma por
mutante, com a causa do conjunto fechado.

**2. Três estados no lugar de dois.** `KILL`/`ESCAPOU` viraram
`DETECTADO`/`SOBREVIVENTE`/`NÃO EXECUTADO`, com as causas fechadas de
`check_mutation.py:113` — âncora podre (`não encontrada`/`ambígua`), `rebuild
falhou`, `gate não pôde ser executado`. **`SOBREVIVENTE` passou a exigir que o
gate tenha rodado**: sem linha do gate ninguém julgou nada.

**A prova de que isso importa** é a linha canônica: `check_mutation.py:846`
(`RE_MUT_LINHA`) casa as três formas novas e **não casava** `KILL      <id> · …`.
O relato de não-KILL por nome, que existe desde a 013, nunca tinha alcançado esta
campanha.

**Medido**: campanha completa **19 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO
de 19**, restauração de source e HTML byte a byte OK — mesma contagem de antes,
agora legível pelo instrumento.


## EA-46 — `ic_estatico` tem dois pontos cegos de regex, e hoje nenhum chamador os alcança

**Status**: `resolvido`

**Aberto em**: 2026-09-06. Observado durante a demanda 017 (T034,
`doc-writer`), ao ler `ic_estatico` para escrever a nota de `EA-3` sobre a
classificação de path que a 017 deixa pronta — não é achado da 017, que não
toca este trecho.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/check_mutation.py:181`** — `fmap = dict(re.findall(r'(\w+)\s*:\s*path\.join\(HERE,\s*"([^"]+)"\s*\)', src))`
  só casa a forma de **objeto literal** `chave: path.join(HERE, "arquivo")` —
  a forma que `tests_p51_mutants.js:40-45` usa (`const F = { css:
  path.join(HERE, "ui_p50_v32.css"), … }`). **Não casa**
  `const X = path.join(HERE, "arquivo")` — a forma que `tests_core_mutants.js`
  (`:24-26`), `tests_p50_mutants.js` (`:54-58`), `tests_p52_mutants.js`
  (`:60-69`), `tests_009_leitura.js` (`:52-58`), `tests_010_vao.js` (`:63,65`),
  `tests_011_prioridade.js` (`:61`) e `tests_014_mutants_visual.js`
  (`:89-92`) usam — confirmado por leitura direta dos oito arquivos nesta
  sessão. `tests_015_apoio.js:123` usa uma terceira forma
  (`HTML_OVERRIDE || path.join(HERE, HTML_NOME)`), também fora da forma que
  o regex casa. `tests_016_mutants.js` usa uma **quarta**: `path.join(V,
  "...")` (`:141-150`), onde `V = path.join(HERE, ".claude", "verify")`
  (`:138`) — a indireção de dois níveis falha mesmo se a forma fosse
  objeto-literal, porque o primeiro argumento não é o literal `HERE`.
- **`.claude/verify/check_mutation.py:182`** — `usados = set(re.findall(r"\bfile\s*:\s*F\.(\w+)", src))`
  só casa `file: F.<nome>` literal dentro do próprio objeto do mutante — a
  forma de `tests_p51_mutants.js:152` (`file: F.shell, gate: …`). **Não vê**
  arquivo passado por helper: `tests_016_mutants.js:197`
  (`const em = (file, e) => Object.assign({}, e, { file });`) e `:396`
  (`edicoes: [em(F.ps016, valvulaApos(…))]`) — o `file` chega pelo primeiro
  argumento de `em(...)`, nunca como `file: F.ps016` literal no fonte.
- **Efeito medido, e o que NÃO é medido**: as duas regexes alimentam o
  **segundo** elemento da tupla que `ic_estatico` devolve (`arquivos
  mutados` por leitura estática) — `check_mutation.py:183-184`. **Nenhum dos
  dois chamadores de `ic_estatico` hoje consome esse segundo elemento**:
  `:394` (`IC-5`, reserva da `p51`) e `:1241` (`ex_ids_do_harness`, reserva
  de `IC-9` para qualquer harness) usam só `[0]` (a lista de ids via
  `RE_IC_ID`, `:111`, que **não** tem os pontos cegos acima — ela casa
  `id: "..."` em qualquer estilo de declaração). Os dois pontos cegos são
  **reais e verificados**, mas **hoje sem efeito observável**: o código que
  os alcançaria está escrito e nunca é chamado. O risco é para o dia em que
  alguém precisar do segundo elemento (por exemplo, para estender a
  identidade de `arquivos_mutados` a um harness sem preflight) — nesse dia,
  a reserva estática mentiria por omissão para sete dos onze harnesses
  declarados, sem aviso (o retorno seria `[]`, indistinguível de "harness
  não muta nada").

  > **Correção de número (2026-09-11)** — o *"sete dos onze"* acima conta a
  > **forma de declaração**, e a população inclui `tests_015_apoio.js`, que é
  > suíte e não fonte de harness. Pelo predicado que importa — 2º elemento
  > **vazio** —, o censo mede **10 de 12** (completo só em `p51`, 6/6; parcial
  > em `d014`, 3 de 5), idêntico no commit que abriu o achado (`6a0c7a9`) e no
  > HEAD. O número corrigido, o método de contagem e o gatilho de reavaliação
  > vivem na entrada `EA-46` de `.claude/verify/mutation-matrix.json`
  > (`dividas_declaradas`), declarada em `3c56eab` — **não os copio para cá**:
  > número copiado apodrece separado do que o mediu. Este parágrafo fica como
  > foi escrito (R2 §5: registro não se reescreve, se emenda).

### O que este registro não decide

Se o remédio é generalizar as duas regexes (aceitar `const`/`let`/`var` e
indireção de uma variável, e reconhecer chamada de helper por posição) ou
declarar a segunda peça do retorno como código morto e removê-la enquanto
nada a consome: `qa-engineer` (autor do gate) decide, com o `tech-lead` se
a resposta for "generalizar" (comportamento novo de instrumento, R4). Não é
`fix-finding` — não há asserção hoje que dependa do segundo elemento para
mudar de veredito.

### Resolvido em 2026-09-14 — dois pontos cegos fechados, e o resíduo deixou de ser mudo

O achado media que o 2º elemento de `ic_estatico` sairia `[]` — **indistinguível
de "este harness não muta nada"** — para a maioria dos harnesses, no dia em que
alguém precisasse dele.

**Censo antes, reproduzido hoje**: 2º elemento **vazio em 12 de 14** fontes de
harness (completo só em `p51`, parcial em `d014`).

**Duas correções:**

1. **`fmap` passou a ler as duas formas** de declarar o arquivo — o objeto literal
   `chave: path.join(HERE, "arq")` (p51, d014) **e** a constante solta
   `const NOME = path.join(HERE, "arq")`, que é a forma das outras doze. `usados`
   passou a casar `file: F.x` **e** `file: X`.
2. **`[]` deixou de significar duas coisas.** Fonte que **declara mutante** e não
   entrega arquivo devolve **`None`** — *não medido* — em vez de lista vazia.
   É a R10 §2 (não medir em silêncio é FAIL) aplicada ao valor de retorno.

**Censo depois**: **10 medidos · 4 nomeados como NÃO MEDIDO**, contra 2 medidos e
12 mudos.

**Validação de que o alargamento não inventa**: para os 10, os arquivos lidos são
**subconjunto dos `targets` declarados em `mutation_map.json` — zero fora, nos
dez**. É a condição necessária que o `D017-REL1` já exige (`targets ⊇ arquivos
mutados`), conferida aqui pelo caminho estático.

Os dois chamadores (`:394` e `:1243`) continuam consumindo só `[0]`, como antes —
nenhuma mudança de comportamento no stage. O que mudou foi a **qualidade da
reserva** para o dia em que ela for consumida, que era exatamente o risco do
achado.


## EA-47 — verbete de vocabulário fechado definido por lista, não por critério: o `spec-validate` certificou a lacuna como conformidade

**Status**: `resolvido`

**Aberto em**: 2026-09-09. Escrito pelo `product-owner`, na correção
(`fix-finding`) do resíduo 1 do aceite de intenção da demanda 017 — o verbete
*Insumo de prova* do `CONTEXT.md`, já corrigido por remissão (`CONTEXT.md:22-28`).
Não é achado sobre o verbete em si (que já está emendado): é achado de
**processo**, maior que a instância que o revelou.

### O núcleo

- `specs/017-semantica-do-gatilho/refinement.md:272-278` — a seção **`§Não
  registrados, de propósito`** lista as **seis** razões candidatas de classe
  (oráculo, fixture, declaração, julgador, registro lido, **entrada da
  varredura**) e diz explicitamente que são identificadores de instrumento,
  **não termos de domínio**.
- `.claude/verify/check_mutation.py:487` — `D017_CLASSES` tem **quatro**:
  `("oraculo", "fixture", "populacao", "declaracao")`. "Entrada da varredura"
  virou `populacao`.
- O verbete *Insumo de prova* copiou **cinco dos seis** nomes de classe para
  dentro do glossário como exemplos — na mesma fase, pela mesma mão, **contra
  a decisão escrita na própria seção** acima — e deixou de fora justamente a
  sexta (`populacao`/"entrada da varredura").
- `specs/017-semantica-do-gatilho/spec.md:342-348` — a linha 346 põe
  `CONTEXT.md` em `§Não mudam` ("verbetes já gravados na Fase 0... as classes
  são identificadores, não termos"); `spec-validate.md:304` (item 68) mede
  `git diff --stat 9d617d0..HEAD -- ... CONTEXT.md ...` **vazio** e registra
  veredito **✓ conforme**.

**O efeito, que é o achado**: a máquina **certificou** o verbete desatualizado.
O `spec-validate` converteu uma hipótese da Fase 1 (diff vazio = nada mudou =
conforme) em prova de conformidade na Fase 6, sem reler o conteúdo contra a
decisão de origem.

Duas hipóteses óbvias estão **refutadas pelo próprio artefato**, o que é o que
dá força ao achado: não é "glossário cedo demais" — o refinamento da Fase 0
já tinha as seis razões (`refinement.md:272-278`, acima); e não é "falta
reconciliação" — ela acontece (a demanda 016 refez três termos antes de
gravar, ver instância abaixo; este resíduo foi pego no próprio aceite da 017).
É defeito de **forma**: verbete que define extensão por **lista** onde deveria
definir por **critério**.

### As quatro instâncias

- **014** — "prova de discriminância vencida" definida no refinamento da
  demanda 014 e ausente do `CONTEXT.md`, registrada **dentro do corpo do
  `EA-30`** (`.claude/BACKLOG.md:1724-1728`) em vez de ter id próprio — que um
  membro da família já vivesse escondido em achado alheio é o próprio sintoma
  de não ter id.
- **015** — *cláusula sentinela* nasceu na **Fase 4**, com desvio autorizado
  pelo orquestrador sob delegação, registrado no próprio `CONTEXT.md:7-11`
  ("foi gravado na Fase 4... fora da Fase 0, por autorização do orquestrador
  sob delegação").
- **016** — três termos (*Fecho de demanda*, *Demanda mesclada sem fecho*,
  *Fecho pendente declarado*) resolvidos na Fase 0 e gravados na **Fase 5**,
  também declarado no próprio `CONTEXT.md:13-20` ("resolvidos na Fase 0...
  mas gravados aqui na Fase 5, no mesmo PR").
- **017** — verbete completo na Fase 0 e **incompleto ao fim** — a instância
  que motivou este registro, emendada hoje (`CONTEXT.md:22-28`).

Nas quatro, o glossário só ficou correto por **desvio declarado** ou por
**correção de resíduo** — nunca pelo processo ordinário de portão ter pego a
divergência antes do aceite.

### Os dois remédios candidatos — não decididos, escolha do proprietário

1. **Rito de escrita** (R12 §Glossário, uma linha): verbete define pelo
   **critério**; extensão que um enum de instrumento vai fechar entra por
   **remissão à fonte que a pina**, nunca por lista. É o que a emenda de hoje
   no verbete *Insumo de prova* já aplica — remédio da causa.
2. **Escopo declarado**: em demanda que constrói vocabulário fechado,
   `CONTEXT.md` não entra na `§Não mudam` como afirmação, e sim como
   **pergunta do aceite**; o `spec-validate` mede a resposta, não o diff
   vazio.

### Resolvido em 2026-09-14 — a regra de forma entrou na R12

O verbete já estava emendado quando o achado foi escrito; o que faltava era o
**processo**, e o registro dizia isso com todas as letras (*"é defeito de forma"*).
Duas regras entraram em `.claude/rules/documentation.md`, no bloco do glossário:

1. **Verbete define por CRITÉRIO, nunca por lista.** Definição que enumera casos
   envelhece em silêncio — quando a fonte ganha um item, a lista do glossário fica
   errada **sem que nada mude nela**. O verbete diz o que faz um caso pertencer; a
   lista canônica vive na fonte executável e é **referenciada**, não copiada.
2. **Item em `§Não mudam` não se certifica por diff vazio.** `git diff` vazio prova
   que o arquivo **não mudou** — nunca que ele **continua certo**. Item declarado
   imutável exige, na Fase 6, releitura do conteúdo contra a decisão de origem.

As duas citam a instância que pagou o preço, como manda o formato da casa
(errado → custo → correto).

**Sem verificador novo**, por diretriz do proprietário de 2026-09-13. A regra vive
onde `CLAUDE.md` aponta e todo agente lê — é a mesma metade normativa que resolveu
o `EA-37`; a metade mecânica, lá, só veio depois e por decisão própria.


## EA-48 — a canônica do `EA-21` está decidida e o PDF continua emitindo as duas listas

**Status**: `resolvido`

**Aberto em**: 2026-09-11, no mesmo dia em que o `EA-21` fechou, e **por causa
dele**. Levantado por sessão par na revisão do fecho do `EA-21` e conferido por
leitura de fonte antes de virar registro. Ganha id próprio em vez de reabrir o
`EA-21` porque o corpo daquele registro descreve outro fato — a **ausência de
dono normativo**, que morreu — e números citados nunca renumeram (R12).

### Por que não é o `EA-21` de novo

O efeito do `EA-21` tinha duas metades. A segunda — *"sem texto que diga qual
responde a quê"* — caiu quando a 015 entregou `[data-pr-gap-fonte]`
(`ui_v32.js:1092`, `:1099`), e a primeira — *"o mesmo gap chega ao leitor com
dois conjuntos de produtos"* — **não caiu**. O fecho do `EA-21` (2026-09-11)
nomeou esse resíduo na sua §"O que este fecho NÃO faz", e este registro é o id
que faltava para ele.

### Cadeia arquivo:linha → efeito

- **`ui_v32.js:1089`, `:1096`** — `qsGapSupportHTML` emite `[data-pr-gap-support]`
  em `#pr-findings`, a partir de `QS_GAP_SUPPORT` (**por capability**, 4 qids).
- **`ui_target_v32.js:351`** — `tgtEnablersHTML` emite
  `[data-ux-enablers="a-validar"]` a partir de `MAP[qid].lv[atual].c`
  (**por qid × nível**, 15 qids); **`:453`** é o sítio de chamada **no papel**,
  dentro do card de `#pr-target` (`:455`). Conferido por leitura em 2026-09-11 —
  o `:453` citado isolado no §M5 da 015 é o sítio de chamada, não a emissão.
- **`specs/015-superficies-de-apoio/refinement.md` §M5** — em **3 das 7**
  combinações alcançáveis, **nenhuma lista contém a outra**. Medição não
  reproduzida aqui de propósito (número copiado apodrece longe de quem o mediu).
- **Efeito** — decidida a ancoragem canônica (`MAP`), o papel **não diz qual das
  duas listas é ela**. O aviso de `[data-pr-gap-fonte]` explica a **razão** da
  divergência ("parte da capability, não do nível respondido"), e não designa
  autoridade: o leitor continua recebendo dois conjuntos de produtos para o mesmo
  gap e escolhendo por conta própria.

### Escopo e rito — é por isso que é achado e não demanda

Fechar do lado do papel é editar `ui_v32.js` (e possivelmente
`ui_target_v32.js`): protegidos por `specs/PHASE_5_0_REV_B.md:1616`, pinados por
`P50-GOV1`/`P50-IC4` → **autorização nominal §29.4 no chat**, repin inline de
`PROTECTED`, reexecução das campanhas `d015`/`core`/`d009` e job `visual` no CI.
O fecho do `EA-21` mediu esse custo contra o ganho e **decidiu não pagar agora**,
sob a diretriz do proprietário de 2026-09-11 (rota mais simples e econômica) —
decisão registrada, não esquecimento. Este id existe para que ela continue
visível em vez de virar silêncio.

### O que este registro não decide

Se o remédio é uma frase de designação no papel, a fusão das curadorias (diferida
no §P9 da 015, que exige decisão sobre reabrir a §UAT-07), ou nenhum dos dois: é
decisão de produto do **`product-owner`**, e o custo do rito é do proprietário.
Instância de fronteira da família `EA-31` — registro que afirma o que a superfície
não sustenta —, aqui na forma inversa: a **decisão** existe e a **superfície** não
a reflete.

### Fecho (2026-09-12) — a superfície passou a refletir a decisão

**Autorização nominal §29.4** do proprietário no chat, própria para este achado; a
do `EA-24` era restrita ao `neutralPrioCardHTML` e **não** foi reaproveitada.

A frase anterior de `[data-pr-gap-fonte]` ficou **verbatim** e a nova só acrescenta,
nos **dois** ramos de `qsGapSupportHTML`:

> *"A **ancoragem canônica** desta sessão é a que parte da pergunta e do nível
> respondido; esta lista é complementar."*

Diz o que o `EA-21` decidiu e **nada além**: ancoragem canônica, **não** fonte
única. *"Complementar"* é a palavra do próprio fecho do `EA-21` — o
`QS_GAP_SUPPORT` não é revogado, e o §M5 da 015 mediu que suprimir qualquer das
duas **subtrai conteúdo**.

### Duas correções depois do primeiro empurrão, ambas pegas por gate

1. **Âncoras podres** (`d015` 3 de 15 não-KILL, *"ocorrencias=0"*). Conferi os
   **gates** antes de editar e **esqueci os mutantes** — conferir uma metade é o
   mesmo que não conferir. `FONTE_TXT` acompanhou o fonte no mesmo PR, com a
   semântica dos três mutantes **intacta** (classe `EA-4`).
2. **Título vazado**, e este é o mais grave: a primeira redação citava
   *"Perfil atual × Cenário-alvo de maturidade"*, e o `tests_visual/print.spec.js:62`
   acusou — *"seções condicionais, títulos únicos"*. **Não era problema de teste,
   era de leitor**: o bloco de apoio aparece mesmo quando aquela seção **não
   existe**, então quem não declarou cenário-alvo receberia um ponteiro para o
   vazio. A mesma classe que o `EA-24` acabara de corrigir, reintroduzida por outro
   caminho no mesmo dia.

   Remédio: descrever a ancoragem **pela propriedade**, não pelo nome da seção —
   melhor também fora do gate, porque não depende de rótulo que pode não existir.
   **Não havia cura local**: o `print.spec.js` exige Chromium (KI-3). É o caso em
   que o job `visual` é prova, não formalidade.

**Medido** (PR #64, mesclado em `979fac7`): `d015` **5 PASS · 0 FAIL** e campanha
**15/15** com `IC-4` 15 âncoras · `d010` **24/24** · `p50core` **64/64** após
**dois** repins inline (R8 §2) · `run.sh` completo **17 PASS · 1 FAIL**, só
`p51`/`p52` sem Chromium · CI **verify · visual · fecho todos verdes**.

### O que este fecho NÃO faz

Não funde as duas curadorias — continua diferido no §P9 da 015, que exige decisão
sobre reabrir a §UAT-07. E não toca o `EA-26`, que é a **outra** duplicação (mesmo
`MAP` em duas seções) e está bloqueada pelo `D015-GOV1`.

### O que este registro não decide

Qual dos dois remédios (ou os dois) adotar, e se algum vira alteração em
`documentation.md` (R12) ou em `sdd.md`/`spec-validate` (R4): decisão do
proprietário. Nenhum agente escreve o rito antes disso.

## EA-49 — a população de mutação lê só o `pipeline.yaml`, e um julgador que roda pelo `compliance-audit.sh` fica fora do alcance do instrumento

**Status**: `resolvido`

**Aberto em**: 2026-09-12, a pedido do proprietário no chat, logo após o merge da
demanda **018**. Levantado pelo orquestrador durante a Fase 5 da própria 018 e
registrado então em `regra.limite_conhecido` — **no dado**; ganha id próprio agora
porque registro sem id vira silêncio, que é a lição que o `EA-48` cobrou.

### Cadeia arquivo:linha → efeito

Medida na `develop` em `d89c87a`, em 2026-09-12 — não herdada da 018.

- **`.claude/verify/mutation_population.json → regra`** — a população é derivada
  de **uma** fonte: `fonte: ".claude/verify/pipeline.yaml"`, campo
  `stages.*.run`. É a decisão **P4** do portão da Fase 0 da 018, aprovada pelo
  proprietário, e é deliberada — não é descuido.
- **Censo desta data**: **15** `check_*.py` no disco · **14** invocados por stage
  do `pipeline.yaml` (a população) · **2** invocados pelo
  `.claude/verify/compliance-audit.sh` (`check_branch_protection.py` e
  `check_fecho.py`).
- **`check_fecho.py`** é invocado pelos **dois**, logo está na população.
- **`.claude/verify/check_branch_protection.py`** é o **único** invocado pelo
  `compliance-audit.sh` e por **nenhum** stage — e por isso **está fora da
  população**. Conferido também o inverso: **zero** `check_*.py` no disco ficam
  fora dos dois.
- **Efeito** — o julgador da proteção de branch é invisível ao
  `D018-ORF1`. Não é que ele apareça como órfão: **ele não aparece**. O gate que
  existe para dizer "ninguém está checando isto" não tem como dizê-lo sobre um
  arquivo que a população não declara.

### Por que isto é achado, e não a 018 mal feita

A 018 entregou o que a P4 aprovou, e o instrumento **funciona** para o que declara
cobrir. O defeito é de **alcance da regra**, e ele só é visível depois que o
instrumento existe — antes dele, "julgador sem cobertura" não era uma pergunta que
a máquina soubesse fazer.

**Hoje o risco é latente, e a distinção importa**: `check_branch_protection.py`
**está** coberto — é `target` do harness `d016` e é mutado pelo par `D016-M29`
(*"o laço da sonda itera sobre `[]`"*). A lacuna não é de cobertura; é de
**vigilância**. Se algum dia a 016 o tirar de `targets`, nada acusa — e o silêncio
será exatamente o do `EA-3`, um nível acima: agora com um instrumento instalado
que dá a impressão de estar olhando.

### Remédio candidato (não decidido aqui)

Estender a `fonte` da regra para aceitar **mais de um** arquivo — `pipeline.yaml`
**e** `compliance-audit.sh` —, ou generalizar para "todo `check_*.py` do disco,
com exceção nominal". A primeira é a menor e mantém a forma declarativa; a
segunda inverte o ônus e pode acusar arquivos que ninguém decidiu cobrir, que é a
**Alternativa B** que o refinamento da 018 recusou por criar dívida em massa.

**Não é `fix-finding`**: mudar a regra muda **o que a máquina cobra de todo
mundo**, e a P4 foi decisão de portão do proprietário. Reabri-la é demanda, ou no
mínimo errata com ratificação — a mesma porta pela qual a P4 entrou.

### O que este registro não decide

Qual das duas rotas, e se a população deve ou não crescer junto para `tests_*.js`
— que é a outra metade do `EA-3` ainda aberta. Decisão do `product-owner`.

### Fecho (2026-09-12) — a rota menor, e custou zero dívida

`fonte` passou a aceitar **string ou lista**, e `compliance-audit.sh` entrou ao lado
do `pipeline.yaml`. `check_branch_protection.py` entra na população e sai
**`[OK]`**: ele já tinha gatilho (`target` do `d016`, mutado pelo par `D016-M29`).

**Medido**: `15 na população · 0 órfão(s) · 11 dívida(s) · 0 problema(s)` —
**+0 dívida nova**, que era o número previsto no censo. Campanha `d018` reexecutada
por gatilho de path: **7/7 KILL**. `run.sh --light` 14/0 · `compliance-audit` 17/0/0.

**Simplificação medida antes de adotar**: a varredura passou a ler o arquivo
inteiro em vez de só as linhas `run:` — o `pipeline.yaml` devolve os **mesmos 14**
dos dois jeitos, e a restrição a `run:` não faz sentido num `.sh`, que invoca
direto.

**Feito como `fix-finding`, não como demanda.** A demanda **019** chegou a ser
aberta e foi **descartada a pedido do proprietário**, com a razão dita no chat: o
núcleo do remédio é uma linha de dado, e 7 fases em volta disso é cerimônia, não
rigor. O registro fica porque a decisão de *não* usar a máquina também é decisão.

### O que continua fora, e por escolha

A outra metade do `EA-3`: `gen_*.py`, `*.sh`, `*.json` e `tests_*.js` — custo
medido em 2026-09-12 se entrassem: **+2, +2, +11 e +17** dívidas. Ficam fora
porque **hoje ninguém é enganado por eles**, e cada um vira `fix-finding` próprio
quando incomodar. O `.claude/BACKLOG.md`, que o `EA-3` lista entre os seis, não é
alcançado por regra nenhuma de arquivo de verificação — é **documento**, e
cobertura de mutação mede julgador que pode mentir.

## EA-50 — a invariante que sustenta o `EA-19` é real, carrega peso e nenhum portão a afirma

**Status**: `aberto`

**Aberto em**: 2026-09-13, ao **refutar o `EA-19` por execução**. Não é o resto do
`EA-19`: é o que o tornava inofensivo. A tela de prioridade com lista vazia existe
no fonte e é inalcançável **apenas porque duas guardas independentes, escritas em
lugares diferentes e sem nenhuma menção uma à outra, concordam**. Nada no
repositório diz que elas precisam concordar.

### Cadeia arquivo:linha → efeito

- **`quickscan_secops_soccmm_v3_1_3.html:634`** — guarda de fluxo:
  `step = f.length ? PRIORITY_STEP : RESULTS_STEP`.
- **`:1021`** — guarda de superfície: `${findings.length? '<button … id="editprio">…' : ""}`.
- **`:1029`** — `const ep = $("#editprio"); if(ep) ep.onclick = …` — o `if(ep)`
  **depende** de `:1021`, e não repete a condição. Quem editar `:1021` sem ler
  `:634` não recebe aviso nenhum.
- **`:717`** — `[...businessPriority].forEach(id => { if(!findings.some(…)) … delete … })`
  é a **purga defensiva** que só roda dentro de `renderPriority()`. Medido: como a
  tela não é alcançada com `N = 0`, a purga **não roda**, e um id obsoleto
  sobrevive no `Set` até o fim da sessão — inofensivo hoje porque `:825`
  (`.map(id => findings.find(…)).filter(Boolean)`) o descarta na renderização dos
  resultados. **Duas defesas para o mesmo risco, nenhuma declarada.**
- **Efeito** — a invariante *"`PRIORITY_STEP` só é alcançável com `N > 0`"* não
  está escrita em lugar nenhum: nem como comentário de invariante na Camada 1, nem
  como asserção em suíte, nem no `CONTEXT.md`. Uma demanda futura que acrescente
  uma rota para a tela de prioridade — um deep link, um passo de sessão importada,
  um botão de navegação — **reintroduz o `EA-19` sem que nenhuma máquina reclame**,
  e o defeito volta a ser exatamente o que o registro refutado descreve.

### Por que isto é `EA-20`, e não `EA-1`

Não é superfície protegida sem gate (`EA-1`): é **propriedade emergente sem
julgador**. A diferença importa para o remédio — `EA-1` pede pin, este pede
asserção sobre o **comportamento do fluxo**, que nenhum pin alcança.

### Remédio previsto, e o que ele custa

Suíte nova em namespace próprio (`D050-*`, arquivo próprio — R10 §1 proíbe
continuar numeração de fase alheia ou morar em arquivo de outra), que dirige o
fluxo real em jsdom e afirma os cenários **A**, **B**, **C** e **D** medidos na
refutação do `EA-19`. **Não toca Camada 1**: é arquivo de teste novo mais chave em
`expected_suites.json` e entrada em `pipeline.yaml` (R10 §9) — classe
`estrutura/pipeline`, **sem rito de boundary e sem Porta B**. Cabe em
`fix-finding`; foi deixado aberto porque a refutação do `EA-19` não é o lugar de
introduzir portão novo (fix-finding §4: "correção revelou outro problema → novo
achado com id próprio, nunca no mesmo diff").

**Guarda de tautologia, medida antes de escrever este registro** (2026-09-13,
cópia efêmera do artefato publicado, âncora única conferida — `ocorrencias = 1`):
o mutante previsto troca `:634` por `step = PRIORITY_STEP` incondicional. Sob ele,
os cenários **A**, **B** e **C** todos passam a terminar em `step = 16` — os três
REPROVAM. O portão nasce, portanto, com poder discriminante **medido**, e não é
mais um dos que o `EA-20` cataloga.

## EA-51 — o relatório pulava a seção 8: o assessment completo produzia numeração com buraco

**Status**: `resolvido`

**Aberto e fechado em**: 2026-09-13, na primeira inspeção de **produto** feita sob
a diretriz do proprietário do mesmo dia (*"vamos focar na qualidade e integridade
do produto em si"*). Não veio do backlog: veio de conduzir uma sessão inteira e
**ler o que o cliente lê**.

### Cadeia arquivo:linha → efeito

- **`ui_p52_workspace_v32.js:2259-2261`** — o laço pula a seção cujo balde está
  vazio (`if (!nodes || !nodes.length) continue;`).
- **`:2267` e `:2272`** — mas o número vinha de **`String(i + 1)`**, o índice na
  lista canônica de 9 seções. Seção pulada **queimava o número dela**.
- **Efeito** — o leitor via *"7. Formas de apoio"* seguido de *"9. Relatório e
  sessão"* e concluía que **faltava uma seção** no relatório. Sai na tela e no PDF.

### Medido em seis cenários, antes de tocar no código

| sessão | numeração |
|---|---|
| tudo nível 1 · tudo nível 0 · tudo nível 3 · misto com 2 "NA" | `1,2,3,4,5,6,7,`**`9`** |
| tudo "NA" · metade "NA" | `1..9` contínuo |

**O gatilho é o caso bom.** A seção 8 é *"Evidência e suficiência"*; o balde dela
só tem conteúdo quando há resposta **"Não sei"**. Sessão sem nenhuma — o
assessment completo — é exatamente a que saía com o relatório parecendo defeituoso.

> O cenário "misto com 2 NA" também falhou: as duas "NA" não bastaram para encher
> o balde. A condição é menos frequente do que "ter alguma NA", então o buraco
> aparecia em mais sessões do que a tabela sugere.

### Correção

Contador do que **renderizou** (`vis`), em vez do índice da lista, nas duas saídas
— o número visível e `data-p52-order` da seção. **6 de 6 cenários contínuos** após
a correção.

Nenhum gate lê o `data-p52-order` **por seção**: os quatro consumidores
(`tests_009_leitura.js:262`, `tests_p52_layout.js:609`, `tests_p52_chromium.js:320`
e o CSS) leem o atributo da **raiz**, que continua `canonical`/`gate-blocked`.

### Sem gate novo, por decisão declarada

Sob a diretriz de 2026-09-13, **nenhuma suíte, mutante ou registro novo** foi
criado para isto. **A dívida é real e fica dita**: uma regressão aqui volta a ser
silenciosa. O que pegou este defeito não foi gate nenhum — foi **olhar o produto**,
e é essa a prática que o substitui.

## EA-52 — a lista de prioridades do PDF imprimia perguntas mutiladas

**Status**: `resolvido`

**Aberto e fechado em**: 2026-09-13, na leitura do PDF em quatro cenários, sob a
diretriz de produto do mesmo dia. Como o `EA-51`, **não veio do backlog**.

### Cadeia arquivo:linha → efeito

- **`ui_v32.js:87-92`** — `qLabel(qid)` devolve o **texto da pergunta**, cortado em
  72 caracteres com reticências.
- **`ui_v32.js:1229`** — a seção *"Prioridades declaradas pelo negócio"* do
  relatório impresso usava `qLabel(f.id)`.
- **Efeito** — o cliente lia, como prioridade do próprio negócio:
  *"1. Políticas de segurança e privacidade (incluindo LGPD) estão…"*. Não é uma
  prioridade: é uma **pergunta cortada**, e cortada exatamente onde diria o que
  pergunta. **10 das 15** perguntas passam de 72 caracteres.

| pergunta | o que o PDF imprimia | rótulo que já existia |
|---|---|---|
| `network-visibility` | "A operação possui visibilidade e capacidade de detectar…" | **Visibilidade de rede** |
| `monitoring-coverage` | "A operação possui cobertura de monitoramento compatível com a…" | **Cobertura de monitoramento** |
| `team-capacity` | "A equipe de segurança tem capacidade e redundância compatíveis com a…" | **Capacidade do time** |

**E a tela já mostrava o rótulo curto** — as duas superfícies discordavam, e a que
vai para o cliente era a pior.

### Correção

`QS[f.k].lbl` no lugar de `qLabel(f.id)`, alinhando o PDF com a tela. **Uma linha.**

`qLabel` **não foi tocada**: o único outro chamador é `tests_ui_m32.js:189`, que a
usa como oráculo de outra superfície. A função continua existindo para quem
precisar da pergunta abreviada — só deixou de ser usada onde o rótulo cabia.

### Rito consumido

**Autorização nominal** do proprietário no chat (*"autorizado, pode trocar no
ui_v32.js"*) — §29.4. **Repin inline** de `PROTECTED["ui_v32.js"]` com trilha
cumulativa (R8 §2); identidade anterior `4c9abc43…`, nova `79771119…`.

Conferido **antes** de editar: `tests_p52_mutants.js:573` ancora na linha
**anterior** (`:1228`, o `pr-pagebreak`), intocada; `tests_ui_m332.js:P5` assere a
**ordem** das prioridades por substring (`"incidente"` antes de `"logs"`), que o
rótulo curto preserva.

**Medido**: `p50core` 65/65 · `ui_m332` 23/23 · `ui_m32` 25/25 · `d009` 15/15 ·
`d010` 13/13. Nenhum gate novo — diretriz de 2026-09-13.

## EA-53 — correção mesclada não alcançava a instância publicada: o serviço rodou 20 dias atrás do repositório

**Status**: `resolvido`

**Aberto em**: 2026-09-14, por **pergunta do proprietário** — *"essas atualizações
foram feitas na versão disponível no docker?"*. A resposta medida era **não**, e o
achado é maior que a instância: ele **invalida o relato de todos os outros**.
Durante três semanas eu reportei "resolvido" e "verde" com razão **no
repositório**, sem nunca perguntar onde o produto roda.

### Cadeia arquivo:linha → efeito

- **`deploy/v3.2.2/compose.yaml`** — o container `quickscan-v322` monta, em
  `bind` read-only, `deploy/v3.2.2/quickscan_secops_soccmm_v3_2_2.html`.
- **`deploy/` está FORA da worktree do git** (é irmão de `phase5/`, sem `.git`):
  nenhum commit, nenhum pin, nenhum stage o alcança.
- **`build_v32_html.py`** escreve **só** `quickscan_secops_soccmm_v3_2_dev.html`.
  Nada no build, no pipeline ou no CI toca `deploy/`.
- **Efeito, medido**: o serviço em `127.0.0.1:1337` servia 1.014.061 bytes de
  **25/08**, enquanto o build do repositório tinha 1.072.745 bytes. Conferido por
  presença no artefato servido: **`EA-23`, `EA-24`, `EA-48`, `EA-51` e `EA-52` —
  zero ocorrências nas cinco**. Sete correções de produto, nenhuma no ar.

### Por que passou despercebido

Não é descuido de uma pessoa: é **caminho de entrega manual e invisível**. O
pipeline prova identidade byte a byte entre fonte e `_dev.html` (stage `build`) e
para exatamente ali. Da fronteira do git em diante, ninguém mede nada — e um
artefato parado não emite sinal.

### Resolvido em 2026-09-14, em três atos

**1 · Publicado**, com autorização do proprietário, seguindo a convenção da casa:
`deploy/v3.2.3/` com artefato, `default.conf` byte-idêntico, `compose.yaml`,
manifesto SHA-256 e registro de deploy. Cutover `quickscan-v322` → `quickscan-v323`
na mesma porta, com a v3.2.2 **parada e preservada** como rollback.

**Verificado**: o que a porta 1337 devolve é **byte a byte idêntico** ao artefato
do release (`73bae0ba…`, 1.072.745 bytes, conferido por `cmp`), e as cinco
correções estão presentes.

**Preflight que importa**: `engine_v32.js` e o **payload funcional M41**
(`9794b267…d4365b`) saíram **idênticos** aos da v3.2.2 — nenhuma das sete
correções tocou score ou suficiência. São todas de apresentação.

**2 · Lacuna fechada**: `preparar_release.py`, **no repositório** (versionado e
pinado, ao contrário de `deploy/`). Uma linha prepara o release inteiro a partir
do build, herdando a postura de segurança do release anterior.

**Ele deliberadamente NÃO publica.** Não sobe nem para container: prepara e
**imprime** os comandos. Automatizar o cutover trocaria um esquecimento silencioso
por uma **publicação silenciosa**, que é pior.

Guardas, provadas na criação: recusa tag fora de `vN.N.N`; recusa sobrescrever
release existente; recusa árvore suja; e recusa se o build no disco estiver
desatualizado em relação às fontes.

**3 · O resíduo tem id próprio** — preparar o release ficou barato, mas **nada
ainda compara o que está no ar com o que o repositório tem**. Não virou gate por
diretriz do proprietário de 2026-09-13, e porque dependeria do container estar de
pé. Fica dito: **a próxima defasagem também será silenciosa**, só que agora o
remédio é uma linha.

## EA-54 — o harness M41, invocado do jeito óbvio, sobrescreve um arquivo `frozen`

**Status**: `aberto`

**Aberto em**: 2026-09-14, no preflight do deploy da v3.2.3 — **aconteceu comigo**,
e só apareceu porque o `preparar_release.py` recusa árvore suja e nomeou o
arquivo.

### Cadeia arquivo:linha → efeito

- **`harness_m41_v313.js:18`** —
  `const outPath = flag("--out") || (argv.includes("--compare") ? null : "v3_1_3_functional_snapshot.json");`
  Sem `--compare` **e** sem `--out`, o destino padrão é o **próprio snapshot**.
- **`:260`** — `if (outPath) fs.writeFileSync(outPath, …)`.
- **`v3_1_3_functional_snapshot.json` é classe `frozen`**
  (`.claude/verify/boundary.json`), a par de `engine_v32.js` e da Camada 1.
- **Efeito, medido**: `node harness_m41_v313.js` — o comando que qualquer um
  digita para obter o payload, e que o registro de deploy da v3.2.2 pede no
  preflight — reescreveu o snapshot congelado. O diff foi de **uma linha**
  (`generatedAt`), o payload saiu idêntico, e **nenhum aviso foi emitido**.

**O pipeline não é alcançado**: `check_m41.py:21-22` invoca com `--compare` e
`--out <temp>`. O defeito está no **padrão**, que é o caminho de quem não lê o
wrapper primeiro.

### Por que é R7 §3, e não detalhe

*"Verificação nunca escreve na árvore"* — e aqui ela escreve **na classe mais
protegida do repositório**, em silêncio, no caminho mais provável. Se o payload
tivesse divergido, o harness teria **gravado a divergência como novo baseline**
em vez de reprovar.

### O que trava

`harness_m41_v313.js` é **`frozen`**: inverter o padrão (comparar por default,
escrever só com `--out` explícito) é rito **D2**. Não foi feito aqui.

**Mitigação enquanto isso, e é barata**: invocar sempre com `--compare`
`v3_1_3_functional_snapshot.json`. O `preparar_release.py` já protege por outro
caminho — recusa árvore suja —, mas a proteção é lateral, não a cura.

### Emenda de 2026-09-14 — mitigado onde dá, e a correção de raiz continua bloqueada

> **Errata do orquestrador, antes de tudo.** Ao listar o backlog eu recomendei este
> achado como *"uma linha, e o D2 nele é barato porque dá para provar identidade
> byte a byte — que é a Porta A"*. **Estava errado.** `CLAUDE.md:107` diz, textual:
> *"Porta A pendente de ratificação — hoje tudo é Porta B"*. Portanto a correção de
> raiz exige **spec commitada + auditoria independente humana**, e não é barata.
> O erro foi meu e não do registro: a Porta A está pendente desde antes desta
> sessão, e eu já a tinha citado corretamente ao abrir a demanda 019.

#### O risco é real, e é LIMITADO — medido, não suposto

Simulei a invocação nua (só o carimbo `generatedAt` alterado) e perguntei a cada
guarda existente se ela prosseguiria:

| guarda | com o snapshot `frozen` sujo |
|---|---|
| `baseline` | **PASSA** — lê `git show HEAD:`, é cego à árvore. É o **`EA-18`** |
| `mutation` | **RECUSA** — árvore suja |
| `gen_pins` | **RECUSA** — árvore suja |
| `preparar_release.py` | **RECUSA** — árvore suja |

Três das quatro recusam prosseguir. A janela silenciosa é **entre a invocação nua
e o próximo desses comandos** — e commitar o estrago por acidente esbarra ainda no
hook `guard-add.sh`, que bloqueia `git add -A`.

**O que continua verdadeiro, e é o que mantém o achado aberto**: se o payload
divergisse, o harness gravaria a divergência **como novo baseline** em vez de
reprovar. Nenhuma das três guardas impede isso — elas só impedem que o estrago
**avance**.

#### Mitigação aplicada

O `preparar_release.py` passou a **imprimir o comando seguro** no bloco de
preflight, com a razão:

```
node harness_m41_v313.js quickscan_secops_soccmm_v3_2_dev.html \
     --compare v3_1_3_functional_snapshot.json
```

Isso tira a armadilha do **caminho óbvio**, que é onde ela vivia: ninguém a
documentava: era o comando que a pessoa digitava sozinha. O defeito latente
continua no harness.

#### A correção de raiz, para quando o proprietário decidir

Inverter o padrão de `harness_m41_v313.js:18` — comparar por default, escrever só
com `--out` explícito. **Uma linha de código, rito de sete fases**: `frozen` ⇒ D2
⇒ Porta B ⇒ spec commitada + auditoria humana independente, que **nenhum agente
pode assinar** (R4 §D3).

Vale notar a assimetria, porque ela é o argumento para ratificar a Porta A um dia:
a mudança é **provadamente inerte à medição** — não toca o cálculo do payload, só
o destino do arquivo —, e é exatamente esse tipo de prova que a Porta A aceitaria.


## Varredura de reconferência por execução — 2026-09-13

> **Não corrige nada.** Mede os **26 achados `aberto`** contra a árvore de hoje
> (`develop` em `b736695`) e registra, por achado, se a cadeia ainda se sustenta.
> Pedida pelo proprietário depois que três reconferências seguidas mudaram o
> achado que conferiam — o `EA-19` era falso, o `EA-23` era doze pares e não um,
> o `EA-48` nasceu do fecho do `EA-21`.
>
> **Vocabulário**: `REPRODUZ` (cadeia e efeito de pé) · `MUDOU` (o achado existe
> mas não no tamanho registrado) · `NÃO REPRODUZ` (o efeito não se sustenta).
> `[exec]` marca o que foi provado por **execução**, não por leitura.

### Resultado

| achado | veredito | o que a medição de hoje devolveu |
|---|---|---|
| `EA-3` | **MUDOU** | O instrumento da 018 já existe e **diz o que não checa**: `15 na população · 0 órfão · 1 não medido · 11 dívida · 0 problema`. Sobra a fronteira declarada (`gen_*.py`, `*.sh`, `*.json`, `tests_*.js`), que é **exclusão nomeada**, não silêncio — o oposto do que o título afirma `[exec]` |
| `EA-7` | REPRODUZ | `ui_p50_v32.css:715` (era `:697`) ainda declara `grid-template-areas:"main side"`, que subsume a composição da 5.2. Prova final exige Chromium (KI-3) |
| `EA-8` | **REPRODUZ** | `OFFERINGS ∩ SOLUTION_AREAS = ["fortiai-assist"]` — interseção de exatamente 1 `[exec]` |
| `EA-9` | **REPRODUZ** | Injetei a oferta `map:sonda-ea9` e `validateConfigV32()` devolveu `[]` — **zero erro**. A segurança do prefixo `map:` continua convenção `[exec]` |
| `EA-12` | REPRODUZ | `P52_ESTAGIOS` inalterada e ainda `/…/i`; o próprio gate registra o achado de fundo em `:4163` |
| `EA-14` | REPRODUZ | `.github/workflows/verify.yml`: *"Campanhas de mutação"* vem **depois** de *"Suítes visuais"* e **sem `if: always()`** — suíte vermelha pula a campanha |
| `EA-16` | **REPRODUZ** | **Removi o `key(w,d,"1")`** — o sujeito inteiro do gate — e `UX14` **passou assim mesmo**. 56/56. O gate não tem como reprovar `[exec]` |
| `EA-17` | REPRODUZ | Nenhum verificador de prefixo de seletor CSS no pipeline. A única cobertura existente é `D011-PRT1(b)`, de **um** módulo e só dentro de `@media print` — e a própria `mutation-matrix.json:965` já registrava isso |
| `EA-18` | **REPRODUZ** | Alterei um arquivo **pinado** no disco, sem commit, e o stage devolveu `baseline: 476/476 pins conferem · 0 divergentes`. Ele lê `git show HEAD:` (`:36`) e é cego à árvore `[exec]` |
| `EA-20` | REPRODUZ (família) | O `EA-16` acabou de ser provado por execução; `EA-7` e `EA-34` de pé estruturalmente. A família tem instâncias vivas |
| `EA-22` | REPRODUZ | `P51-REC1` está hoje em **`tests_p50_core.js:3421`** (era `:3363`). No corpo: **0** ocorrências de `pr-gapsup` e **0** asserção de duplicação. A promessa segue só no título |
| `EA-25` | REPRODUZ | `product-invariants.md`: **0** ocorrências de *"nunca desaparece"* ou `3.2.3-B` |
| `EA-26` | REPRODUZ | Medido em 2026-09-12 com a implementação feita e revertida; `D015-GOV1` continua sendo a âncora de saída |
| `EA-27` | **MUDOU** | As cópias continuam sem dono único, mas **não são mais silenciosas**: `tests_015_apoio.js:311` (`tresCopiasDaLista`) compara produto × oráculo × fixture, e `D015-M19` mata a divergência. O risco que o achado descreve está **gateado** |
| `EA-28` | **MUDOU** | Os três buracos nominais **fecharam**: `D015-M17`/`D015-M18` estão no harness, têm **par na matriz** (`2026-09-01 · KILL`) e constam de `dividas_declaradas`. Resta a metade estrutural, e **menor**: o `IC-5` segue nominal à `p51`, mas o `IC-6` foi **generalizado pela 017** a todo harness com preflight |
| `EA-30` | **REPRODUZ (agravado)** | `p50` continua uma linha agregada com `ultima_prova.data: "histórica (fases 5.0.x)"`, e **16 pares `p51` em `2026-08-22`**. E hoje o job `visual` executou `p50 56/56`, `p51 19/19` e `p52 108/108` — **três campanhas completas que o registro não absorveu** |
| `EA-31` | REPRODUZ (família) | **Duas instâncias novas hoje**: o `EA-37` estava curado e o registro continuava `aberto`; e as citações de `EA-7`, `EA-22`, `EA-34` e `EA-35` derivaram de linha. A varredura é ela mesma o remédio pontual desta família |
| `EA-34` | REPRODUZ | `ui_p52_workspace_v32.css:77` e a área nomeada da 5.1 seguem como descrito. Prova exige Chromium |
| `EA-35` | REPRODUZ | O sítio derivou para **`tests_p52_chromium.js:1138`** (`drawn = Math.min(ir.width, ir.height) * scale`). Prova exige Chromium |
| `EA-36` | REPRODUZ | `compliance-audit.sh:73` chama `check_branch_protection.py`, e o `compliance-audit` roda **dentro do job `verify`** (`verify.yml:44`) |
| `EA-37` | **NÃO REPRODUZ** | `.claude/hooks/guard-add.sh` **existe**, está registrado em `settings.json:62` como `PreToolUse`, e executado com `{"command":"git add -A"}` devolve **exit 2** com `guard-add: BLOQUEADO`. A metade mecânica que o achado cobrava **foi construída** `[exec]` |
| `EA-44` | REPRODUZ | `core` é o **único** dos 14 harnesses com `preflight` ausente `[exec]` |
| `EA-45` | REPRODUZ | `tests_009_mutants.js`: **0** ocorrências do vocabulário de três estados, contra 7 na `p50` e 5 na `p51` `[exec]` |
| `EA-46` | REPRODUZ | `check_mutation.py:181` e `:182` **byte a byte como registrados** |
| `EA-47` | REPRODUZ | O `CONTEXT.md:255-261` ganhou emenda dizendo que *"a lista canônica lê-se na fonte, nunca daqui"* — o que **conserta o ponteiro**, não o critério. A razão de classe continua definida por lista |
| `EA-50` | REPRODUZ | **0** suítes afirmam a invariante `PRIORITY_STEP ⇒ N > 0` |

### O que a varredura desmentiu, e era meu

**Eu previ que "uma fração cairia". Caiu um.** De 26, **1 não reproduz**, **3
mudaram de tamanho** e **22 se sustentam**. A intuição de que o registro
envelhecera mal veio de três acertos seguidos e não resistiu à medição — o
backlog está, na maior parte, **certo**.

Isso muda o encaminhamento, e é a informação que a varredura comprou: não há um
lote de achados falsos para limpar. O que existe é **trabalho real represado**, e
a prioridade passa a ser a ordem de ataque, não a triagem.

### O que a varredura mediu e não estava em registro nenhum

1. **`EA-16` e `EA-18` nunca tinham prova de execução** — eram análise estrutural.
   Agora têm: um gate que passa sem o próprio sujeito, e um stage que aprova uma
   árvore mutada.
2. **`EA-30` piorou hoje, por causa do PR #67**: as três campanhas Chromium
   rodaram completas no CI e o registro continua com as datas velhas. Toda
   mudança em superfície 5.x amplia este achado.
3. **Quatro achados tiveram deriva de citação** (`EA-7`, `EA-22`, `EA-34`,
   `EA-35`). As linhas corrigidas estão na tabela acima. A deriva é `EA-31`
   acontecendo em silêncio.

### O que esta varredura NÃO fez

- **Não corrigiu nada.** Nenhum arquivo de produto ou de verificação foi tocado;
  as duas sondas (`EA-16`, `EA-18`) mutaram a árvore e foram restauradas, com
  `git status` conferido limpo nas duas.
- **Não fechou `EA-7`, `EA-34` nem `EA-35` por execução** — os três exigem
  Chromium, que esta máquina não tem (KI-3). Estão como `REPRODUZ` por
  sustentação estrutural, e isso está dito em vez de disfarçado.
- **Não reordenou o backlog.** Priorizar é decisão do proprietário.

## EA-55 — a tela de resultados lia mal: duplicidade nas prioridades, ordem invertida nos gaps e o apoio longe do gap

**Status**: `resolvido`

**Aberto em**: 2026-09-14, por **relato do proprietário após sessão real** — não
por varredura. Quatro apontamentos, todos reproduzidos por mim em
`127.0.0.1:1337` antes de qualquer mudança, dirigindo o fluxo de verdade
(15 respostas, 10 achados, 3 prioridades declaradas).

### Cadeia arquivo:linha → efeito

1. **Duplicidade nas prioridades.** `ui_ux_v32.js:208` insere `#ux-execrow`
   antes da âncora "Gaps observados"; `ui_p52_workspace_v32.js:670` a
   reclassifica para o balde `priorities`. A faixa aterrissa **logo abaixo dos
   `.prio-decl` que repete** — mesmo conteúdo, duas formas seguidas. Sem
   contexto tecnológico declarado a faixa é **só** a repetição.
2. **Ordem dos gaps.** `p52BuildGaps()` empurrava todo o *head* para cima: o
   primeiro heading da seção "Gaps observados" era o título legado **"Outros
   gaps observados"**, que rotula de "outros" o conjunto inteiro e empurra
   `Gaps altos de maturidade` para baixo de um título que o contradiz. E o
   `details` "Possíveis formas de apoio aos demais gaps **altos**" era anexado
   no fim da seção — **depois dos moderados**, longe do grupo que nomeia.
3. **"Capacidade do time" sem solução.** Medido: **não falta mapeamento.**
   `MAP["team-capacity"]` (`quickscan_secops_soccmm_v3_1_3.html:430`) aponta
   duas ofertas no nível 1. O que existe é **política de severidade** — o
   renderer congelado só emite `.apoio-block` para `sev 2`, e prioridade com
   gap moderado recebe banner e vai para "Pode fazer sentido — após validação",
   **duas seções abaixo**, redigida como não-recomendação. A recomendação
   existia; estava longe e negada.
4. **Redundância da seção de apoio.** Na sessão medida ela continha
   **exatamente** os dois `.apoio-block` que os gaps acima já justificam.

### O que foi corrigido, e onde

Tudo em **`ui_p52_workspace_v32.js` + `.css`** — camada 5.2, fora da §29.4,
sem rito. A camada já é a dona da recomposição da tela; nenhum arquivo
`frozen` ou protegido foi tocado, e o payload M41 não muda.

- `p52ExecRowBucket()` — a faixa some da TELA por classe e **permanece no
  DOM**; com `#ux-ctxsummary` presente ela é roteada para a seção de contexto,
  onde o resumo pertence. Ocultar, e não remover, porque
  `tests_ux_m41.js:346` conta `#ux-prios .ux-priochip` e
  `tests_p50_core.js:908` exige `#ux-execrow` vivo e recriado.
- `p52BuildPrioCard()` — ordem no título (`PRIORIDADE N`), fatos em lista,
  procedência (`declarada na sessão`) em rodapé itálico à direita. Reescrita
  por **leitura** do que o renderer imprimiu, nunca por recomputação.
- `p52BuildGaps()` — título legado oculto, parágrafo promovido a lead,
  `Gaps altos de maturidade` como primeiro heading, e cada `details` de apoio
  inserido **logo após o grupo cuja severidade ele nomeia**.
- `p52SupportHints()` — o ponteiro "Apoio possível, a validar: …" no próprio
  card, com os nomes **lidos do DOM** (`P52-REC1` proíbe produto neste
  arquivo). Sem casamento, não imprime nada — nunca afirma apoio não listado.
- `p52ProdBullets()` — "Neste contexto:" ganha bloco próprio na caixa da
  solução, por **movimento de nós**, sem reescrever texto.

### Dois defeitos que eu mesmo introduzi, e o que os pegou

- **`P52-REC1` reprovou** porque escrevi um nome de produto **num comentário
  meu** (`/Forti[A-Z]/` em `tests_p52_layout.js:538`). É a segunda vez que um
  comentário meu derruba um portão; o portão estava certo.
- **O parágrafo de lead sumia do DOM na segunda passagem**: marquei um nó
  LEGADO com `p52-sec-lead`, e `p52Harvest()` trata essa classe como invólucro
  desta camada e **não o devolve à lista**. Corrigido com classe própria
  (`p52-legacy-lead`). Pego por medição na tela, não por leitura.

### O que NÃO foi feito, e por quê

- **A trilha de capacitação (`training.fortinet.com`)** — decidida com o
  proprietário nesta data e **bloqueada nos três caminhos possíveis**. Ver
  `EA-56`.
- **A seção de apoio editável** — pedida pelo proprietário e registrada como
  demanda própria. Ver `EA-57`.
- **Mover os `.apoio-block` para junto das prioridades**, que era a minha
  proposta para matar a redundância do apontamento 4. `P52-REC1`
  (`tests_p52_layout.js:512`) lança *"bloco de apoio fora da seção e fora do
  acordeão de gaps"* — a invariante é explícita e deliberada, e
  `data-p52-support-cards` é conferido contra o DOM em dois portões. O
  ponteiro no card resolve a distância sem enfraquecer portão nenhum; a
  redundância em si fica com o `EA-57`, que é onde o proprietário a colocou.

## EA-56 — a trilha de capacitação não tem onde morar: os três caminhos estão bloqueados

**Status**: `aberto`

**Aberto em**: 2026-09-14, ao implementar o `EA-55`. O proprietário decidiu o
conteúdo (`training.fortinet.com`) e eu **não consegui entregá-lo** sem
enfraquecer um portão ou abrir rito caro. Registro o bloqueio em vez de
escolher por conta própria.

### O buraco é real

`training.fortinet.com` **não aparece em lugar nenhum do produto** (`grep` em
`quickscan_secops_soccmm_v3_1_3.html` e `engine_v32.js`: zero). A única menção
a capacitação é prosa dentro da descrição do bundle de serviços
(`:272`). As duas capabilities de pessoas — `soc-staffing` e `soc-skills` — não
têm oferta de treinamento nomeável.

### Os três caminhos e o que cada um custa

| caminho | arquivo | o que trava |
|---|---|---|
| `MAP` | `quickscan_secops_soccmm_v3_1_3.html:430` | classe **`frozen`** → rito D2, e `CLAUDE.md:107` diz *"Porta A pendente de ratificação — hoje tudo é Porta B"*: spec + auditoria independente humana |
| `QS_GAP_SUPPORT` | `ui_v32.js:1058` | `P51-REC1` (`tests_p50_core.js:3495`) declara `QIDS_AUTORIZADOS = ["detection-lifecycle","logs","automation","vulnerability-management"]` como **âncora normativa externa** da diretriz §UAT-07 e lança *"apoio anexado a um gap fora do mapeamento normativo"*. `team-capacity` não está nela. Mexer na lista é **emendar a diretriz** — decisão de governança do proprietário, não minha (R10 §1) |
| camada 5.2 | `ui_p52_workspace_v32.js` | `P52-REC1` (`tests_p52_layout.js:538`) proíbe nome de produto neste arquivo. A regex não pegaria o domínio do portal de treinamento, mas o propósito do portão é exatamente esse — passar pela letra e furar o espírito seria o pior dos três |

### Encaminhamento

O caminho mais barato é o **segundo**, e ele depende de uma decisão que só o
proprietário toma: **emendar a §UAT-07 para incluir as capabilities de
pessoas**. Com a lista ampliada, a entrada em `QS_GAP_SUPPORT` custa a
autorização nominal §29.4 de sempre e um repin inline — e a tabela já é
redigida como *"validar aderência"*, que é a moldura honesta para uma trilha
de capacitação. Enquanto isso não acontece, o `EA-55` entrega o ponteiro para
o apoio que já existe, e nada é inventado.

### Emenda de 2026-09-15 — medido no PAPEL, e lá é pior

Depois do merge do PR #81 medi a mesma sessão **no relatório do cliente**,
disparando `beforeprint` (nunca `buildPrintReport()` — ver a lição registrada em
`EA-26`). O que a tela agora resolve por ponteiro, o PDF **não** resolve:

| configuração | `Capacidade do time` recebe caminho de apoio? | gaps com apoio |
|---|---|---|
| contexto tecnológico **não informado** (`legacyMode`) | **não** | **2 de 10** |
| contexto tecnológico **declarado** | **não** | **2 de 10** |

No modo legado é pior ainda por composição: a errata externa **B-02** suprime as
seções E–H, e com elas some também a lista *"Pode fazer sentido — após
validação"* — que na TELA é onde o apoio a `team-capacity` aparece. Ou seja, no
PDF de uma sessão sem contexto declarado, **uma prioridade declarada pelo
negócio é nomeada e não recebe absolutamente nada**, sem ponteiro algum.

E a proporção não é detalhe de um gap: **8 dos 10 gaps** desta sessão chegam ao
cliente sem caminho de apoio, nas duas configurações. A causa é a mesma deste
achado — `QS_GAP_SUPPORT` cobre **4 qids**, e `QIDS_AUTORIZADOS`
(`tests_p50_core.js:3495`) é a âncora normativa que fixa esses quatro.

**O que isto muda no encaminhamento**: o `EA-56` deixa de ser "falta a trilha de
capacitação" e passa a ser **"a tabela de apoio do relatório cobre 40% dos gaps
que o produto sabe produzir"**. A decisão continua sendo a mesma e continua sendo
do proprietário — **emendar a §UAT-07** —, mas o que está em jogo é o artefato
que vai ao cliente, não uma linha de tela.

O ponteiro entregue pelo `EA-55` **não alcança o papel** por desenho: ele vive na
camada 5.2, que compõe a tela; o relatório é montado por `buildPrintReport()`
(`ui_v32.js`, §29.4). Corrigir o papel exige a mesma decisão de governança.

## EA-57 — a seção de apoio nas prioridades declaradas é redundante e não é editável

**Status**: `resolvido`

> **Fecho — demanda `019-curadoria-do-relatorio`, PR #88, mesclado em
> 2026-09-21.** Este achado virou a demanda que o proprietário pediu, e ela entregou
> as duas metades: a **redundância** (a seção passa a agrupar por produto em vez
> de por gap — medido, 15 blocos → 9 cards, com `Serviços FortiGuard` deixando de
> aparecer cinco vezes) e a **edição** (`ui_curation_edit_v32.js`, onde o
> engenheiro mantém, remove ou acrescenta).
>
> **Os três custos que este achado nomeou foram pagos, um a um:**
>
> - **estado persistido** — `reportCuration`, sexta chave canônica em
>   `ui_session_v32.js` (§29.4, autorizado em 2026-09-17), omitida quando nada
>   foi declarado, o que preserva `missing ≠ {}` (INV-8);
> - **papel** — `buildPrintReport()` consome a mesma seleção da tela, e o papel é
>   **derivado** dos cards, não recalculado: a igualdade tela×papel virou
>   propriedade de construção em vez de coincidência a conferir (`D019-PAR1`);
> - **proveniência** — `[data-p53-prov]` nas duas superfícies, e **só** em item
>   cuja PRESENÇA é decisão do operador. O gate `D019-PROV1` mede as duas
>   direções: o selo existe onde deve **e não existe onde não deve**, porque
>   rótulo que aparece em tudo não distingue nada.
>
> O ponto que este achado dizia não ser negociável — não inventar recomendação —
> ficou executável: a curadoria é **seleção**, e o editor não tem campo de texto
> por desenho. O `D019-CUR1` tenta redigir a cada execução para provar que
> continua não tendo.

**Aberto em**: 2026-09-14, por relato do proprietário (apontamento 4 do
`EA-55`), que pediu explicitamente que virasse demanda própria.

**Aberto em**: 2026-09-14, por relato do proprietário (apontamento 4 do
`EA-55`), que pediu explicitamente que virasse demanda própria.

### O que foi medido

Na sessão real, a seção 7 continha **exatamente** os dois `.apoio-block` que os
gaps já justificam, mais um banner. Não é coincidência: é a mesma função
`apoioBlock` (`quickscan_secops_soccmm_v3_1_3.html:860`) rodando sobre o mesmo
conjunto, em outra superfície.

### O que o proprietário pediu

Que a seção seja **editável por ele no momento do preenchimento**, quando tem
informação do cliente que o screening não tem, podendo selecionar a solução
específica que vai ao relatório.

### Por que é demanda, e não ajuste de apresentação

É **comportamento novo**, e o custo está em três lugares fora da camada 5.2:

- **Estado persistido** — a exportação de sessão vive em `ui_session_v32.js`
  (§29.4 protegido) e a importação **valida esquema** (`:298+`); campo novo
  toca os dois.
- **Papel** — `buildPrintReport()` está em `ui_v32.js` (§29.4 protegido).
  Correção só de tela deixaria o PDF, que é o que vai ao cliente, divergente.
- **Proveniência** — e este é o ponto que não pode ser negociado. Uma solução
  **escolhida pelo operador** impressa num relatório que declara *"os
  resultados refletem a percepção declarada na sessão"*
  (`quickscan_secops_soccmm_v3_1_3.html:242`) precisa de **marcador visível**
  dizendo que é anotação do operador e não saída do motor. O produto inteiro é
  construído sobre não inventar recomendação; uma seção editável sem marcador
  desmonta essa garantia em silêncio.

`fullStateJSON()` (`ui_v32.js:815`) **não** precisaria mudar — um campo fora
dele não viola a invariante de impressão conferida por `finishPrint()`. Essa
parte é barata; as três acima não são.

## EA-58 — a régua D2 inclui strings de exibição: corrigir um rótulo custa o mesmo que mudar uma decisão

**Status**: `aberto`

**Aberto em**: 2026-09-15, a pedido explícito do proprietário, depois de três
rodadas seguidas de apontamentos de produto em que **todo** ajuste de conteúdo
— por mais cosmético — caiu em Porta B.

### Cadeia arquivo:linha → efeito

- **`harness_m41_v313.js:217`** —
  `functionalPayload(r) { return { configErrors, candidatesMatrix, scenarios }; }`
- **`:240`** — o SHA-256 é calculado sobre `stableStringify()` **dessas três
  chaves**, e é ele que `pins.json → declared.m41_payload_sha256` pina.
- **`.claude/rules/product-invariants.md`**, régua da INV-1, textual:
  *"Payload idêntico = Porta A. Payload diferente = Porta B, sem exceção."*

**Medido por execução** — extraí as três chaves do
`v3_1_3_functional_snapshot.json` e procurei rótulos de exibição:

```
DENTRO do payload: Network Detection & Response
DENTRO do payload: Detecção e resposta em endpoint (EDR)
DENTRO do payload: Análise centralizada, correlação e retenção de eventos
```

Os **nomes de capability** de `MAP[qid].cap` estão dentro da superfície
hasheada. Logo: acrescentar `(NDR)` a um rótulo, para ficar coerente com o
`(EDR)` que o vizinho já tem, **muda o SHA do payload** e aciona spec commitada
+ auditoria independente humana.

### Por que isso é achado, e não desenho

A régua D2 existe para separar **mudança de equivalência** de **mudança de
comportamento**. Como está, ela não separa: uma sigla entre parênteses e uma
troca de produto recomendado produzem **o mesmo sinal** — payload diferente.

O efeito prático é o oposto do pretendido. Uma régua que encarece o trivial na
mesma medida do grave **empurra para não corrigir o trivial** — e o trivial,
aqui, é o vocabulário que o cliente lê no relatório. O acervo de apontamentos
desta semana mostra o custo: `(NDR)`, `SIEM` no rótulo de logs, FortiNAC,
FortiClient EMS, FortiSOAR em capacidade do time, FortiSOC — **seis pedidos do
proprietário sobre o produto, todos represados atrás do mesmo rito**.

Não estou afirmando que os rótulos devam sair do payload. Eles são o que o
usuário recebe, e há bom motivo para o harness os congelar. O achado é que
**hoje não existe um segundo sinal** que distinga as duas naturezas, e por isso
a única resposta possível a qualquer pedido de conteúdo é "Porta B".

### O que NÃO foi feito aqui

Nada. Não toquei no harness, que é classe **`frozen`**, nem na régua, que é
**ato de governança** (R8 §3: *"Mudá-los é ato de governança, nunca efeito
colateral"*). Este registro é o insumo da decisão, não a decisão.

### Encaminhamento — três saídas, em ordem de custo

1. **Nenhuma mudança de régua: agrupar.** Se toda mudança de conteúdo é Porta B,
   que seja **uma** Porta B levando todo o lote (`EA-56` + os seis pedidos +
   `SCORES`). A auditoria independente humana é o custo dominante e **não dobra
   por levar mais conteúdo**. É a saída disponível hoje, sem decidir nada novo.
2. **Segundo sinal, derivado do mesmo payload.** Um SHA adicional sobre o
   payload com os campos de exibição **normalizados** — se só ele muda, a
   alteração é de vocabulário; se o principal muda, é de decisão. Não afrouxa a
   régua atual: acrescenta discriminante ao lado dela. Exige demanda própria e
   mexe em `harness_m41_v313.js`, que é `frozen` — portanto Porta B uma vez,
   para deixar de pagar Porta B sempre.
3. **Ratificar a Porta A.** `CLAUDE.md:107` — *"Porta A pendente de ratificação
   — hoje tudo é Porta B"*. Ela sozinha **não resolve este achado**: rótulo em
   `MAP` muda o payload, então nem a Porta A o alcançaria. Registrado aqui para
   fechar a pergunta antes que ela seja feita.

A decisão é do proprietário. Ver [[EA-56]], que é a instância mais cara deste
achado, e a linha de `design-decisions.md` sobre `SCORES = [0, 1.7, 3.3, 5]`,
que é a mais estrutural.

## EA-61 — a redação do selo do bundle está pinada por gate em suíte protegida

**Status**: `aberto`

**Aberto em**: 2026-09-16, ao implementar o `EA-60`. O proprietário pediu uma
troca de duas palavras e ela **não foi feita** — registro o bloqueio em vez de
contorná-lo.

### O pedido

No editor de contexto, o selo ao lado de cada subscription incluída pelo bundle
declarado deve ler **"incluso no bundle"** em vez de **"incluído pelo bundle"**.

### Cadeia arquivo:linha → efeito

- **`ui_v32.js:402`** emite
  `<span class="v32-tag v32-bundletag">incluído pelo bundle</span>`.
- **`tests_ui_m333.js:280`** (gate `C22`) afirma
  `/incluído pelo bundle/.test(txt(q(d,"#v32-sub-fg-ips").parentElement))`
  como **prova de que a inferência do bundle ENT está sendo exibida**.
- **`tests_ui_m333.js` está na lista §29.4** (`tests_p50_core.js:502`).

Medido por execução: com a troca aplicada pela camada 5.2,
`UI 3.3.3` cai para **25 PASS · 1 FAIL**; revertida, volta a **26 PASS · 0 FAIL**.

### Por que não contornei

A propriedade que o `C22` mede é a **inferência**, não a redação — reancorar a
expressão para `/inclu[ií](do pelo|so no) bundle/` preservaria o teste inteiro.
Mas duas regras dizem que não é minha a caneta:

- **R3 §2** — quem escreve gate é o `qa-engineer`; o implementador **nunca**
  escreve o próprio critério de aceite. Editar o `C22` para aceitar a minha
  própria mudança é exatamente o anti-padrão que a regra nomeia.
- **§29.4** — a suíte é protegida e exige autorização nominal do proprietário.

Havia uma saída pela letra: a camada 5.2 podia trocar o texto e eu podia não
olhar para o `ui333`. O gate ficaria vermelho e eu saberia. Não é saída.

### O que destrava, e é barato

Uma frase do proprietário autorizando o repin nominal da `tests_ui_m333.js`.
Com ela, a reancoragem é de **uma linha**, a propriedade fica idêntica e o selo
passa a ler o que ele pediu. Enquanto isso, o resto do item 12 **foi
entregue**: o selo deixou de quebrar linha e os bundles ficaram em 2×2.

Ver [[EA-58]] — é a mesma família, num nível acima: ali a régua D2 não
distingue rótulo de decisão; aqui um gate de comportamento pina uma redação.

## EA-62 — reescrita de apresentação pode cegar gate de invariante, e nada avisa

**Status**: `aberto`

**Aberto em**: 2026-09-17, **aconteceu comigo** no PR #85 — e quem pegou foi o
CI, não eu.

### O que aconteceu, medido

Acrescentei ao `P52_COPY` (`ui_p52_workspace_v32.js`) uma entrada que reescreve,
**no render**:

```
"Leitura V3.1.3 preservada (maturidade: X)"  →  "Maturidade observada nesta sessão (nível: X)"
```

Troca de apresentação, pedida pelo proprietário: número de versão da árvore
interna vazando para o relatório do cliente.

Acontece que **essa string é o OBSERVÁVEL** de três cláusulas do `D010-INV7`:

- **`tests_010_vao.js:305`** — `const RE_PRESERVADA = /Leitura V3\.1\.3 preservada/;`
- **`:549`** — a alínea (a) reprova se a tela afirma preservação com a Camada 1
  **oculta**. É a **INV-7**, uma das dez invariantes de produto.
- **`:560`** e **`:575`** usam a mesma regex.

Removida do DOM, o gate deixou de enxergar o estado que policia. O mutante
`D010-M6` (`tests_010_mutants.js:133`), que arma justamente essa bomba —
*"emitir a afirmação de preservação incondicionalmente"* — passou a
**SOBREVIVER**: `gate D010-INV7 · reprovou por motivo diferente do esperado`.

Revertida a entrada, `d010` volta a **24/24**.

### Por que eu não peguei antes de empurrar

A campanha `d010` tem `cmd: "node tests_010_vao.js"` e **não** exige Chromium —
mas o *stage* `mutation` a executa só no job que tem o ambiente completo, e nesta
máquina o `p52`/`d014vis` faltando derruba o stage inteiro antes (KI-3). Na
prática: **mudança de apresentação não é medida contra a matriz de mutação
local**, e o sinal só aparece no CI, ~50 minutos depois.

### Por que é achado, e não só um erro meu

O `p52Copy` existe desde a 5.2 e reescreve texto renderizado em **qualquer**
superfície, tela e papel. Nada no repositório liga as duas pontas:

- não há registro de **quais strings são observáveis de gate**;
- não há checagem que compare o mapa de cópia com as âncoras de texto das
  suítes;
- a ordem de execução é justamente a que esconde: o gate lê o DOM **depois** da
  reescrita.

Enquanto isso valer, toda entrada nova no `P52_COPY` é uma aposta — e a
`EA-59`/`EA-60` mostraram que essas entradas vão continuar aparecendo, porque é
por ali que o vocabulário do produto é corrigido sem tocar superfície congelada.

### Encaminhamento

O remédio barato é uma **checagem estática no pipeline** (R10 §9): extrair os
literais de `P52_COPY[i][0]` e reprovar se algum deles aparecer como literal de
regex/string em arquivo `tests_*.js`. Não prova ausência de cegueira — prova que
ninguém reescreve, sem saber, um texto que alguma suíte usa como sujeito.

Isso é **gate novo**, e a diretriz de 2026-09-13 diz para não criar gate sem
pedido do proprietário. Fica registrado para decisão dele.

**Mitigação enquanto isso, e é de graça**: entrada nova no `P52_COPY` exige
`grep` do literal antigo em `tests_*.js` antes de commitar. Foi o que teria
evitado este caso — e é exatamente o passo que eu pulei.

Ver [[EA-58]] e [[EA-61]] — a mesma família: o produto e as provas
compartilham vocabulário, e mudar a palavra mexe nas duas pontas.

#### Emenda de 2026-09-17 — a mitigação rodada, e o que ela achou

Apliquei a checagem proposta acima sobre o estado atual: extrair os literais de
`P52_COPY[i][0]` e procurá-los nas suítes. **Três candidatos**, todos
pré-existentes e nenhum deles cego:

| literal | suíte | veredito |
|---|---|---|
| `Mandato e objetivos` | `tests_p52_layout.js` | é o gate **`P52-COPY1`**, que afirma a AUSÊNCIA — ele existe para provar que a reescrita aconteceu |
| `Mandato e objetivos` | `tests_009_leitura.js:154-160` | aparece só em **comentário**, e o comentário descreve exatamente este perigo: *"procurar 'Mandato e objetivos' na tela nunca casaria. Por isso o gate aplica…"* |
| `Mandato e objetivos` | `tests_ui_m332.js:267` | asserção real, sobre superfície que a reescrita não alcança — a suíte passa 23/23 |

**Isso reforça o achado em vez de esvaziá-lo.** O perigo já era conhecido: o
`tests_009_leitura.js` o documenta em prosa e contorna caso a caso. O que não
existe é **mecanismo** — cada suíte se defende por conta própria, e quem
escrever a próxima entrada no `P52_COPY` não tem como saber disso a não ser
lendo os comentários certos. Foi o que aconteceu comigo.

A checagem, como está, é **heurística**: ela sinaliza candidatos, não defeitos.
Mesmo assim teria bastado — o literal `Leitura V3.1.3 preservada` apareceria
apontando para `tests_010_vao.js`, e eu teria parado antes de empurrar.

## EA-64 — o repositório não registra qual versão está em produção, e o README apodreceu quatro versões

**Status**: `aberto`

**Aberto em**: 2026-09-17, ao atualizar o README a pedido do proprietário.

### O que estava errado, medido

O README declarava, em 2026-09-17:

> **v3.2.2** — produção publicada. É a versão liberada e atualmente em uso.

No mesmo momento, o que a porta `127.0.0.1:1337` devolvia era a **v3.2.6**
(`2f9c0a84…`, conferido byte a byte). O README estava **quatro versões atrás** e
afirmando algo falso — e o gate que o guarda, `V322-DOC3`
(`tests_p52_layout.js:1731`), estava **verde**, porque ele pinava o número
`v3.2.2` literalmente.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/current_phase.json`** registra a **fase de produto** (5.2,
  `SELADA`, tag `v3.2.1`) — não o que está publicado.
- **`deploy/`** mora **fora da worktree do git** (`EA-53`): nenhum commit, pin
  ou stage o alcança.
- **`preparar_release.py`** escreve em `deploy/<tag>/` e **não** deixa registro
  no repositório.
- **Logo**: não existe, em lugar algum rastreado, a resposta para *"qual versão
  está em produção?"*. O único lugar onde a informação aparecia era a prosa do
  README — que é justamente o que apodreceu.

**Medido em 2026-09-17**: as releases publicadas no GitHub iam até a **v3.2.2**,
de 25/08. As v3.2.3, v3.2.4 e v3.2.5 foram para o ar **sem release**, existindo
só em `deploy/`.

### Por que o gate não pegou

`V322-DOC3` afirmava `/v3\.2\.2[^\n]{0,120}produção publicada/`. Ele media se o
README **diz** algo, nunca se o que ele diz é **verdade** — e não tinha contra o
que comparar, porque a verdade não está em lugar nenhum do repositório.

Não é defeito do gate: é o limite dele. Um julgador não pode conferir um fato
que a árvore não guarda.

### O que foi feito agora

- README corrigido para a v3.2.6, com a v3.2.5 nomeada como rollback e o par
  v3.2.2/v3.2.1 preservado como histórico.
- Release **v3.2.6** cortada e conferida (o download do GitHub é byte a byte o
  artefato em uso), sob autorização do proprietário no chat.
- `V322-DOC3` **reancorado para a propriedade** em vez do número: ele passa a
  extrair a versão que o README chama de produção e a que chama de rollback,
  exigir que sejam distintas, e cobrar coerência com a frase "a versão corrente
  do produto é a vX". Ficou mais forte num ponto — a forma anterior não pegava
  "produção e rollback apontando a mesma versão".
- Título do gate corrigido: dizia *"produção v3.2.1 e candidata v3.2.2"*, o
  contrário do que o corpo media desde 2026-08-25 (família do `EA-22`).

### O que NÃO foi feito, e é o remédio de raiz

Criar a **fonte de verdade**: um registro rastreado — no espírito do
`boundary.json` da R6 — dizendo qual tag está publicada, com que sha256 e a
partir de que commit, escrito pelo `preparar_release.py` no mesmo passo que
prepara o `deploy/`. Com ele, o `V322-DOC3` deixa de conferir só coerência
interna e passa a conferir **o fato**.

Isso é **gate/instrumento novo**, e a diretriz de 2026-09-13 diz para não criar
sem pedido do proprietário. Fica registrado para decisão dele.

**Mitigação enquanto isso**: a reancoragem acima faz o gate parar de apodrecer a
cada versão — ele não sabe se o número está certo, mas passou a sobreviver à
mudança em vez de exigir edição. O que continua sem juiz é a **correspondência
com a realidade**, e ela depende de alguém olhar.

### Observação anexa, medida e não corrigida

A **imagem de abertura** do README vem de `docs_phase5/evidence_v322/` e mostra
a home **anterior** ao `EA-59`/`EA-63` — botões antigos, marca menor, emblema
sem o tratamento novo. O próprio `V322-DOC3` declara, em comentário, que *"um
PNG de um acervo anterior representaria estado visual superado"* — e é o que
ele está aceitando agora, porque a asserção fixa o diretório do acervo e não a
atualidade da captura.

Não substituí: promover imagem ao repositório é passo explícito de evidência
(R11 §2) e o `guard-data` barra binário novo acima de 200 KB. Fica nomeado.

Ver [[EA-53]] — é a mesma raiz: `deploy/` fora do git faz o repositório não
saber o que está no ar. Ali a consequência foi correção mesclada que não chegava
ao cliente; aqui é documentação que mente para quem chega de fora.
