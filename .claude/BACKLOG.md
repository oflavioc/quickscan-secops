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

**Status**: `resolvido`

> **Fecho — demanda 021-cobertura-do-apoio, 2026-09-26.** O achado mudou de forma
> na emenda de 2026-09-15 — de *"falta a trilha de capacitação"* para *"a tabela de
> apoio cobre 40% dos gaps"* —, e foi essa forma que a 021 fechou.
>
> **Medido: 4 → 15.** Todo gap observado passa a trazer caminho de apoio.
>
> **A trilha de capacitação já morava na Camada 1, e o produto não lia.** O
> encaminhamento deste achado supunha que o conteúdo teria de ser ESCRITO, e era
> por isso que ele parecia caro — os três caminhos "bloqueados" eram três formas
> de escrever. O `MAP` congelado já declarava:
>
> ```
> training → FortiGuard-Service-Bundle
>            "treinamento e certificação (Cybersecurity Professional Education)"
> ```
>
> Nenhuma Porta B, nenhum repin da régua D2: **ler o `MAP` não o altera**.
>
> Custou uma colisão com a C2 selada da demanda 015 — resolvida pela errata `E19`,
> ratificada pelo proprietário —, e o cross-check que a teria antecipado não foi
> feito. Registro completo em `specs/021-cobertura-do-apoio/relatorio-final.md`.

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

### Instância medida em 2026-09-24 — e ela reforça a saída 1

O `EA-69` nasceu como achado próprio em 2026-09-22, de apontamento do
proprietário em sessão real, e **é este achado outra vez**. A sonda dele mede
com mais precisão o que este registro já afirmava:

```
cópia do HTML com (SIEM) e (NDR) nos dois rótulos, harness --compare
→ 9 campos divergentes em 4 dos 9 cenários
  TODOS em $.scenarios[*].tiers.t2[*].reasons[*]
```

Dois parênteses em dois rótulos movem o payload em quatro cenários, e portanto
exigem repinar `declared.m41_payload_sha256` — a régua que decide Porta A ×
Porta B para **todas** as mudanças futuras do engine.

**O que a instância acrescenta ao encaminhamento:** nada de novo, e é esse o
ponto. A **saída 1** — uma Porta B levando o lote inteiro — já era a resposta em
2026-09-15, e cada pedido novo do proprietário que cai aqui só aumenta o
denominador do mesmo custo fixo. A fila hoje: `EA-56`, os seis pedidos de
conteúdo, `SCORES`, e agora `(SIEM)`/`(NDR)` do `EA-69`.

### A fila, recontada em 2026-10-16 — um item a menos

Correção de registro pedida no fecho da demanda 021 (condição (3) do aceite de
intenção do `product-owner`): o parágrafo acima, de 2026-09-24, ainda lista o
`EA-56` entre os represados. **O `EA-56` está `resolvido`** — fechado pela 021 em
2026-09-26, com o fecho escrito no próprio bloco dele: cobertura de apoio medida
**4 → 15**, *"nenhuma Porta B, nenhum repin da régua D2: **ler o `MAP` não o
altera**"*. Ele saiu da fila pelo único jeito que não paga este achado: a trilha de
capacitação **já estava** na Camada 1, e o produto passou a lê-la.

**A fila hoje, recontada**:

| item | estado |
|---|---|
| catálogo: `FortiNAC`, `FortiClient EMS`, `FortiSOC`, `FortiSOAR` | represados |
| rótulos `(SIEM)`/`(NDR)` — [[EA-69]] | `aberto`, com a sonda que mediu 9 campos divergentes em 4 dos 9 cenários |
| `SCORES = [0, 1.7, 3.3, 5]` | candidata em `design-decisions.md`, nem achado é |
| ~~`EA-56`~~ | **saiu**: `resolvido` em 2026-09-26 (demanda 021) |

**O que isto muda no encaminhamento: nada, e na direção boa.** A **saída 1** —
uma Porta B levando o lote inteiro — continua sendo a resposta disponível, e o
`EA-56` sair **sem** consumir Porta B nenhuma não reduz o custo fixo da auditoria
independente: reduz o **denominador**, que é o argumento desta saída. Um item a
menos no lote, e o lote continua esperando a mesma decisão do proprietário.

As outras duas menções ao `EA-56` neste bloco — a da §Encaminhamento, saída 1
(*"`EA-56` + os seis pedidos + `SCORES`"*) e a linha *"Ver [[EA-56]], que é a
instância mais cara deste achado"* — **ficam como foram escritas**: são de
2026-09-15 e descrevem a fila daquele dia, que é o que o registro histórico deve
preservar (R2 §5). A fila corrente é esta subseção.

### A fila, recontada em 2026-10-19 — o `EA-69` já tinha saído, e a recontagem anterior não viu

Correção de registro da demanda 024 (`specs/024-sete-defeitos-do-relatorio/refinement.md`
§0, item 4; decisão D2). A tabela de 2026-10-16, logo acima, conta os rótulos
`(SIEM)`/`(NDR)` do [[EA-69]] como `aberto` e represados atrás de Porta B. **Estava
errada no dia em que foi escrita**: os rótulos entraram no produto em 2026-09-27,
pela tabela de apresentação `P52_COPY` (`ui_p52_workspace_v32.js:204-217`) —
fix-finding `463808f`, PR #103, mesclado no mesmo dia (`7bee758`), dezenove dias
antes daquela recontagem. Ela leu a **linha de status** do `EA-69`, que ninguém
tinha virado, e não o fonte.

**A fila hoje, recontada contra o fonte**:

| item | estado |
|---|---|
| catálogo: `FortiNAC`, `FortiClient EMS`, `FortiSOC`, `FortiSOAR` | represados — nada medido nesta recontagem os move |
| `SCORES = [0, 1.7, 3.3, 5]` | candidata em `design-decisions.md`, nem achado é |
| ~~rótulos `(SIEM)`/`(NDR)` — `EA-69`~~ | **saiu**: no produto desde 2026-09-27, pela `P52_COPY`; `resolvido` no registro em 2026-10-19 |
| ~~`EA-56`~~ | **saiu**: `resolvido` em 2026-09-26 (demanda 021) |

**O que isto muda no encaminhamento.** O `EA-69` saiu **sem** Porta B e — segundo
a mensagem do `463808f`, não remedido aqui — sem mover o payload M41, pela rota que
a emenda de 2026-09-27 do próprio `EA-69` descreve: a fronteira é **decisão ×
apresentação**, não `frozen` × não-`frozen`. São duas saídas da fila, e nenhuma
pagou a saída 1. O que resta nela é o que muda o que o motor **decide** (catálogo) e
a candidata `SCORES`; a pergunta deste achado continua do proprietário.

A tabela de 2026-10-16 e a frase *"A fila corrente é esta subseção"* ficam como
foram escritas (R2 §5); a fila corrente passa a ser esta.

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

### Nota de 2026-10-20 — a tag `v3.2.11` registra um release; não fecha este achado

A selagem da v3.2.11 (`docs_phase5/SELAGEM_V3_2_11.md`) cria a tag anotada
`v3.2.11`, que dá ao repositório o registro do commit da v3.2.11 em produção
(conteúdo `0bd677c`; a tag aponta para o merge do PR de selagem). **Isto não fecha
o achado**: o remédio de raiz descrito acima — registro rastreado escrito por
`preparar_release.py` — **não foi feito**. Uma tag é o registro de um release, não
uma fonte que o `V322-DOC3` possa comparar com o README; o `README.md` voltou a
declarar uma versão que não era a de produção (v3.2.9, quando a produção é a
v3.2.11) e foi corrigido à mão no mesmo PR de selagem — a mesma classe de
apodrecimento que abriu o achado. Status continua `aberto`.

### Nota de 2026-10-25 — incidência confirmada pela auditoria externa

Incidência confirmada pela auditoria externa do Codex (2026-10-20) — `README.md:73-74` (ver `EA-104`). Status continua `aberto`.

### Nota de 2026-10-31 — a tag `v3.2.11` prevista na nota de 2026-10-20 não nasce

A nota de 2026-10-20 acima diz que a selagem cria a tag anotada `v3.2.11`. **Não
cria**: a tag foi suspensa em 2026-10-25 (*"Corrigir produto antes de selar"*) e a
v3.2.11 foi superada pela correção da demanda 025 (PR #114, `9ca1fde`). A selagem
efetiva **propõe `v3.2.12`** — nome pendente de ratificação do proprietário na
mescla —, com registro em `docs_phase5/SELAGEM_V3_2_12.md`; a v3.2.11 fica como
artefato publicado **sem tag** (SHA-256 `4c45ce20…5712`, ainda servido em
`127.0.0.1:1337` até o cutover). O nome v3.2.11 já estava ligado àquele SHA em
`README.md`, em `deploy/v3.2.11/` e no pacote entregue em reunião; reusá-lo para
outro artefato quebraria a trilha de identidade — a classe deste achado.
O remédio de raiz (registro rastreado escrito por `preparar_release.py`) **segue
não feito**. Status continua `aberto`. Achado irmão do caminho de entrega:
`EA-121`.

## EA-65 — a visão por solução não existe quando há contexto tecnológico declarado

**Status**: `resolvido`

> **Fecho — fix-finding, 2026-09-22.** Gate `D019-CTX1`, mutantes `D019-M17` e
> `D019-M18`. Nenhum arquivo protegido tocado.
>
> **Medido:** com contexto declarado, a visão vai de **0 para 11 cards** — os
> mesmos onze que o motor oferece.
>
> **A abstenção passou a ser POR NÓ.** `blocosLegados()` e `prodLegadoDe()`
> recusam o que está oculto, então nada que a arbitragem da 010 escondeu é
> movido ou ressuscitado; o produto continua no card, montado do catálogo, como
> já acontece com os de `sev 1`.
>
> **E a armadilha da W4 voltou, agora medida em vez de adivinhada.** Com a
> arbitragem ativa o título congelado fica OCULTO e os cards ficam VISÍVEIS;
> encostados, o censo da Camada 1 os conta no mesmo grupo contíguo e o
> `D010-ARB3` reprova por *"arbitragem parcial — 3 ocultos de 9"*. Ele está
> certo: grupo meio oculto e meio visível é o estado misto que a regra
> tudo-ou-nada proíbe.
>
> A saída é uma **fronteira declarada** — nó visível, de classe própria, fora
> de `CLASSES_CONTIGUAS` — que encerra a contagem antes dos cards. **E ela é
> condicional**: em modo legado o título está visível e os cards SÃO os "blocos
> contíguos visíveis" que o `D010-ARB1 (c)` mede; interpor a fronteira ali
> tiraria o sujeito da alínea e o gate cairia por vacuidade.
>
> **A mesma peça, nos dois modos, tem efeitos opostos.** Por isso o gate mede as
> duas direções e há um mutante para cada — medir um lado só foi exatamente o
> que produziu este achado.

**Aberto em**: 2026-09-22, por mim, ao medir o papel para avaliar se a emenda do
`EA-56` (PR #82) ainda descrevia o produto. **Defeito meu, publicado na v3.2.7** —
achado por acidente de outra verificação, não por gate.

### O que foi medido

Build da v3.2.7, sessão com 15 respostas em nível 0 e três prioridades
declaradas, variando **só** o contexto tecnológico:

| sessão | cards por solução | blocos legados | `isLegacyModeV32()` |
|---|---|---|---|
| **sem** contexto declarado | **9** | 0 (consolidados) | `true` |
| **com** contexto declarado | **0** | 15 (intactos) | `false` |

Basta **uma** capability declarada para a funcionalidade inteira sumir — tela e
papel. No papel, `[data-p53-sol-produto]` vai de 9 para 0.

### Cadeia arquivo:linha → efeito

1. Declarar qualquer contexto tira o runtime do modo legado; a arbitragem da
   demanda 010 oculta o título congelado e **3** `.apoio-block` em
   `#p52-sec-support` (medido: 4 filhos diretos com `v32-hidden`).
2. `ui_p52_support_v32.js:198` — `arbitragemEmCurso()` devolve `true` quando
   **qualquer** filho direto do escopo de apoio está oculto.
3. `ui_p52_support_v32.js:443` — `decorar()` faz `return` imediato. O módulo se
   abstém da **seção inteira**.
4. Os **12** `.apoio-block` que permanecem VISÍVEIS, no acordeão da seção de
   gaps, nunca são consolidados. `__P53SOL.diag()` devolve `passes: 0`.
5. `buildPrintReport()` chama `__P53SOL.printHTML()`, que deriva dos cards da
   tela; sem cards, devolve `""` e a seção não existe no papel.

**Verruga visível**: o controle `[data-p53-abrir-curadoria]` **aparece** nessa
configuração, porque o gate de suficiência está liberado. Oferece curadoria de um
conjunto vazio.

### Por que nenhum gate pegou, e esta é a parte que importa

O `boot()` de `tests_019_curadoria.js:85` **nunca declara contexto tecnológico**.
Os dez gates da demanda rodam, todos, em modo legado. Não é gate medindo menos do
que promete — é **fixture cobrindo um caminho só**, e o caminho não coberto é o
principal: o contexto tecnológico existe justamente para "evitar recomendações
incompatíveis com o ambiente existente".

É parente do `EA-20` por outra porta. Lá o gate era tautológico; aqui ele é
honesto e **cego por amostragem**.

### A decisão grossa que produziu isso

A guarda nasceu na W4 para satisfazer o `D010-ARB3`, que reprovou — com razão —
uma versão que ressuscitava blocos ocultos pela arbitragem. A arbitragem da 010 é
**tudo-ou-nada**, e consumir parte de uma região parcialmente oculta produz o
estado misto que ela proíbe (`tests_010_vao.js:437`).

O que eu não vi na hora: a abstenção correta é **por nó**, não por seção. Os 3
ocultos ficam onde estão; os 12 visíveis podem ser consolidados. A tentativa por
nó falhou na W4 por uma razão que só ficou clara agora — os cards novos nasciam
**contíguos** ao trecho congelado oculto, e `censoCamada1()`
(`tests_010_vao.js:179` e o censo logo acima) os contava no mesmo grupo,
quebrando o tudo-ou-nada por composição, não por princípio.

### Encaminhamento proposto

Consolidar os blocos **visíveis** e inserir um **nó separador** entre o trecho
congelado e os cards: o censo para no primeiro nó de classe não permitida, os
ocultos fecham em `ocultos == conhecidos`, e o `P52-REC1g` continua com os cards
como filhos diretos da grade.

E a fixture que faltava: **gate que rode com contexto declarado**. Sem ela a
correção nasce com o mesmo ponto cego.

### Estado da produção

**Não há regressão.** Nessa configuração a v3.2.7 se comporta como a v3.2.6 — os
15 blocos por capability, como sempre foram. A funcionalidade nova não aparece, e
o botão de curadoria aparece sem objeto. Rollback disponível e verificado
(`deploy/v3.2.6/`), mas não recomendado por mim: voltar não devolve nada que a
v3.2.7 tenha tirado.

**Corrigido e publicado na v3.2.8** (2026-09-22, PR #95). A produção em
`127.0.0.1:1337` serve o artefato `87775a0f…`, conferido nas três partes; o
registro está em `deploy/v3.2.8/`.

Ver [[EA-57]], que esta demanda fechou, e [[EA-20]], de quem este achado é
parente por amostragem.

### Nota de 2026-10-20 — o fecho acima afirma, sobre o modo legado, o que o código não faz

Registro com erro, mecanismo correto (auditoria adversarial de 2026-10-19). O
fecho acima não é reescrito (R2 §5); esta nota o corrige por acréscimo.

- **O que o fecho afirma** (`.claude/BACKLOG.md:6046-6049`): a fronteira "é
  condicional" — em modo legado ela não entra. O comentário do módulo diz o mesmo
  (`ui_p52_support_v32.js:633`, "E ele NÃO entra em modo legado, de propósito").
- **O que o código de `0bd677c` faz**: a condição não é o modo legado.
  `ui_p52_support_v32.js:702` — `var arbitrando = arbitragemEmCurso();` — e `:666`
  — `if (arbitrando && cards.length) sec.appendChild(fronteira());`.
  `arbitragemEmCurso()` (`:198-205`) devolve `true` quando **qualquer filho direto**
  do escopo de apoio tem a classe `v32-hidden`; não consulta `isLegacyModeV32()`.
  Quem aplica `v32-hidden` a títulos, `.apoio-block`, `.t-list` e `.t-details` é
  `hideLegacyRecommendation` (`ui_v32.js:196-205`), e a 023 passou a ocultar a
  lista "pode fazer sentido" (`.t-list` presente e oculta; `D023-DOM1` PASS, da
  auditoria).
- **Logo**: "há filho oculto na seção" e "não é modo legado" são proposições
  diferentes. O fecho e o comentário nomeiam a segunda; o código executa a
  primeira. O mecanismo funciona — a alínea (c) do `D010-ARB1` e o `D010-ARB3`
  seguem verdes —, o que está errado é a descrição.
- **Não reproduzido por mim**: li a cadeia estática acima; o estado concreto em que
  as duas proposições divergem (modo legado com filho oculto pela 023) é a leitura
  da auditoria. Corrigir o comentário do módulo exige tocar `ui_p52_support_v32.js`
  e fica fora desta nota. Status continua `resolvido` (o defeito do achado, a visão
  por solução ausente, segue corrigido).

## EA-66 — falha ao montar o relatório imprime a TELA como se fosse o relatório

**Status**: `resolvido`

> **Fecho — fix-finding, 2026-09-22.** Autorizado pelo proprietário no chat
> depois de eu descrever o endurecimento. `ui_v32.js` é §29.4; repin com trilha
> inline. Gate `D019-PRT1`, mutante `D019-M12`.

**Aberto em**: 2026-09-22, por **relato do proprietário depois de conduzir uma
sessão real** na v3.2.7 recém-publicada: *"o relatório em PDF apareceu com a
maior parte das páginas em branco, com exceção da última página 13"*.

### O que foi medido, e como se sabe que era a tela

Três provas independentes, sobre o artefato que estava no ar:

1. A página 13 traz **"Evidências e observações da sessão"** — esse é o anexo
   **da tela** (`renderAnnex()`, Camada 1 congelada). O do relatório chama-se
   "Anexo — respostas da sessão".
2. O rodapé daquela página é o rodapé legado da tela, não o do relatório.
3. **A contagem de folhas bate com a tela, não com o relatório.** Medido no
   navegador, em mídia de impressão: a tela tem **10.497 px ≈ 11 páginas**, mais
   o anexo em folha própria e a capa — as 13 folhas relatadas. O relatório tem
   5.685 px ≈ 6.

As páginas "em branco" são o workspace 5.2 em papel branco: trilho lateral,
grade e seções que no papel não têm o que mostrar.

### Cadeia arquivo:linha → efeito

1. `ui_v32.js` — `preparePrint()` monta o relatório e **só depois** aplica
   `v32-print-mode` (`buildPrintReport()` → `el.innerHTML = html` →
   `classList.add`).
2. `ui_v32.js:1435` (antes da correção) — `preparePrint` estava pendurado
   **cru**: `window.addEventListener("beforeprint", preparePrint)`.
3. Exceção em qualquer ponto da montagem ⇒ a classe nunca entra ⇒ `.wrap`
   permanece visível e `#v32-print-report` permanece `display:none`.
4. A regra congelada `#annex{display:block; break-before:page}` — da era em que
   imprimir **era** imprimir a tela — dá ao anexo a folha final. É a assinatura
   do modo de falha.

### Por que isto é grave mesmo sendo raro

O artefato que vai ao cliente sai errado **sem que ninguém seja avisado**. O
operador vê um diálogo de impressão perfeitamente normal. Não há sintoma na
tela, não há erro visível, não há gate.

### A família já mordeu antes

A **errata externa B-03** corrigiu exatamente *"sem aplicar `v32-print-mode`,
deixava `.wrap` visível na impressão"* — mesmo sintoma, outro caminho. Duas
instâncias, e entre elas nenhuma máquina afirmando a propriedade. É a marca do
`EA-20` numa terceira forma: não é gate tautológico nem gate cego por
amostragem, é **propriedade sem gate nenhum**.

### O que a correção faz, e o que ela NÃO faz

`preparePrint` passa a rodar sob guarda; a falha reusa o estado
`v32-print-blocked`, que já existe e já esconde `.wrap`. O resultado é **uma
página** dizendo o que houve, com a mensagem do erro para relato.

**A guarda não conserta a causa** — a exceção que o proprietário encontrou
**não foi reproduzida**. Testei no mesmo container, pelo caminho real
(`beforeprint`, nunca a chamada direta), com curadoria aplicada, painel aberto,
nove práticas com alvo e três acréscimos do operador: a montagem fecha limpa nas
quatro combinações. O que a guarda garante é que, quando acontecer de novo, a
falha **se anuncia** em vez de emitir a tela — e a mensagem dará a causa.

Imprimir nada é recuperável; imprimir a tela achando que é o relatório, não.

Ver [[EA-20]] e [[EA-26]] (medir o PDF por `beforeprint`, nunca por
`buildPrintReport()` — foi essa disciplina que permitiu reproduzir o caminho
real e descartar hipóteses).

## EA-67 — acabamento da visão por solução: nome em duplicata, card sem ícone e disclosure vazio

**Status**: `resolvido`

> **Fecho — fix-finding, 2026-09-22.** Gate `D019-CARD1`, mutantes `D019-M13` e
> `D019-M14`. Nenhum arquivo protegido tocado.

**Aberto em**: 2026-09-22, por **relato do proprietário depois de conduzir uma
sessão real** na v3.2.7, em três apontamentos de uma passada só.

### Os três defeitos

1. **O nome do produto saía duas vezes em todo card.** Na visão por gap o
   `.pt-name` era o título do produto dentro do bloco da capability. Consolidado
   por produto, o título do card **já é** o produto — e o `.pt-name` repete a
   mesma palavra duas linhas abaixo. Mover o nó mudou o papel dele, e eu movi
   sem reavaliar o papel.
2. **O card acrescentado pelo engenheiro saía sem ícone.** O card colhido traz o
   `.prod` do renderer congelado, que já vem com `.icon-tile`; o acrescentado eu
   montava do catálogo e não montei o ícone. Na tela do proprietário só
   `Serviços FortiGuard` aparecia ilustrado — o único colhido entre quatro.
3. **O disclosure vazio ficava na tela anunciando conteúdo que migrou.** Eu
   deixara o `<details>` "Possíveis formas de apoio aos demais gaps altos" no
   lugar, com um ponteiro para a seção consolidada. Palavras do proprietário:
   *"essa informação ali polui a tela e é desnecessária"*.

### Por que nenhum gate pegou

**Os doze gates da demanda mediam CONJUNTOS** — produtos, pares
(produto × capability), grupos, chaves de sessão. Nenhum olhava para o card
**como o leitor olha**: a forma, o acabamento, o que se repete.

É a quarta forma da família `EA-20` nesta série, e a mais difícil de antecipar:
não é gate tautológico, nem cego por amostragem, nem propriedade sem gate — é
**gate medindo a dimensão errada**. Conjunto certo, forma errada.

### A decisão do item 3, e por que não foi ocultar

O `<details>` é âncora nomeada do `D010-ARB3 (b)`, entre as que *"nunca podem
ser ocultadas"*. Eu poderia escondê-lo com classe própria — o censo daquele gate
só enxerga `v32-hidden` — e passaria. **Seria contornar pela letra.** A regra
existe para impedir que conteúdo da Camada 1 desapareça sem substituto.

Aqui há substituto e ele é integral: os blocos **migraram** para a seção de
apoio. O que sobrava era uma casca cujo rótulo promete o que ela não tem. Casca
vazia removida é subtração honesta; casca vazia escondida é a mesma subtração
fingindo não ter acontecido.

Medido depois da remoção: `D010` 13 PASS · 0 FAIL, com **duas** âncoras
restantes em `(b)` — a alínea continua com sujeito e não caiu em vacuidade.

### O que o gate novo afirma

`D019-CARD1`, em três alíneas: o nome sai **uma** vez por card; **todo** card
tem ícone; e a (c) exige que um card **acrescentado** tenha sido medido, senão a
segunda alínea não teria visto o caso que o defeito produziu.

Dois mutantes, e não um, porque as duas primeiras alíneas guardam propriedades
independentes — uma cai sem a outra notar, que foi exatamente como os dois
defeitos conviveram por sete waves.

> **O que distingue um card acrescentado de um colhido tem de ser o selo de
> proveniência, nunca o acabamento.** Card mais pobre é um segundo canal
> dizendo "este aqui é de segunda", e não é isso que a demanda combinou.

Ver [[EA-20]] e [[EA-57]].

## EA-68 — a visão por solução ignora a fonte onde quase todos os produtos vivem

**Status**: `resolvido`

> **Fecho — fix-finding, 2026-09-22.** Caminho escolhido pelo proprietário no
> chat: *"segue com a 1, com fixture de sessão realista"*. Gate `D019-SOL3`,
> mutantes `D019-M15` e `D019-M16`. `D019-M6` aposentado no mesmo commit.
>
> **Medido depois:** na mesma sessão do relato, a visão por solução vai de
> **2 para 11 produtos** — 9 com qualificador *"após validação"* e 2 com
> *"indicação prioritária"* —, todos com ícone, e os onze chegam ao papel.
>
> **A fonte passou a ser o motor** (`computeFindings()` + `MAP`), a mesma do
> `__CURATION.offered()` que já devolvia os onze enquanto a vista mostrava
> dois. O tier sai da mesma regra do `buildTiers` congelado, com o menor
> vencendo quando o produto aparece nos dois.
>
> **A lista "pode fazer sentido" ficou INTACTA**, e isso é decisão declarada:
> removê-la cegaria o `P52-ICON3`, que afirma que os ícones ali são
> materialmente pintados e só roda no Chromium do CI. O pedido era que os
> produtos aparecessem **também** na visão por solução, não que a lista
> sumisse. **A redundância que sobra é decisão do proprietário**, agora com o
> custo daquele gate na mesa.
>
> **Código morto removido junto:** com a fonte no motor, `colher()` deixou de
> ter chamador. Mantê-lo porque um mutante apontava para ele seria dívida
> disfarçada de cobertura — o mutante foi reancorado e a função, removida.

> ---
>
> **O CUSTO DE REMOVER A LISTA, MEDIDO — e ele desmente a minha estimativa.**
> O proprietário autorizou tirar a lista secundária da tela para acabar com a
> duplicação. Eu havia estimado o custo em *"uma reancoragem de gate visual,
> ciclo de uma hora"*. **Estava errado**, e a execução mostrou por quê:
> remover o título congelado derrubou **cinco gates da demanda 010** —
> `D010-ARB3`, `INV7`, `CARD1`, `CARD2` e `CARD3` —, todos pela mesma raiz:
>
> ```
> D010-F3: títulos congelados presentes ["Como a Fortinet pode apoiar agora"]
>        != declarados [..., "Pode fazer sentido — após validação"]
> ```
>
> As **fixtures da 010 declaram** aquele título como presente, por fixture. Não
> é um gate de apresentação que se reancora: é o **oráculo declarado de outra
> demanda**, e mudá-lo de dentro de um fix-finding seria exatamente o tipo de
> alteração que a R10 §1 chama de decidir a direção sem decidir.
>
> **Revertido**, com `D010` de volta a 13 PASS · 0 FAIL. A duplicação dos
> produtos de `sev 1` — card e item de lista — **permanece**, agora com o custo
> real na mesa: reancorar `P52-ICON3` (Chromium, só CI) **e** as declarações de
> `D010_DECLARED` em cinco gates. É trabalho de demanda, não de fix-finding.

**Aberto em**: 2026-09-22, ao investigar o apontamento 2 do proprietário:
*"'Centralização de logs' foi uma prioridade declarada, logo, FortiSIEM,
FortiAnalyzer e até mesmo FortiSOC, poderiam vir aqui"*. O apontamento é
sintoma; a causa é maior do que ele.

### O que foi medido

Sessão reproduzida do relato do proprietário — quase tudo em nível 1 (gap
moderado), dois achados em nível 0 (gap alto), três prioridades declaradas:

| | |
|---|---|
| achados na sessão | **15** |
| deles com `sev 2` | **2** |
| produtos na **visão por solução** | **2** — FortiSOAR, Serviços FortiGuard |
| produtos em *"pode fazer sentido — após validação"* (`.t-item`) | **9** |
| desses 9, quantos aparecem na visão por solução | **zero** |

**A consolidação por produto cobre 2 de 11 produtos.** Os outros nove estão na
tela, logo abaixo, noutra estrutura.

### Cadeia

1. O renderer congelado emite `.apoio-block` **apenas para `sev 2`**
   (`quickscan_secops_soccmm_v3_1_3.html:890+`, `prioSev2.length ? ... :`).
   Achado de gap moderado não gera bloco de apoio; gera entrada `.t-item` na
   lista *"pode fazer sentido — após validação"*.
2. `ui_p52_support_v32.js` — `blocosLegados()` colhe **só** `.apoio-block`.
3. Logo, numa sessão dominada por gaps moderados — que é a sessão comum — a
   visão por solução nasce quase vazia, e a informação fica na lista antiga.

### Por que nenhum gate pegou, e é a quinta forma da mesma família

O `boot()` de `tests_019_curadoria.js` responde **tudo em nível 0**. Nessa
fixture *todo* achado é `sev 2`, *todo* achado vira `.apoio-block`, e a
consolidação enxerga 100% dos produtos — 15 blocos → 9 cards, que é o número
que a spec cita e que eu medi em sete waves.

A fixture cobre o **extremo improvável**: uma operação em que tudo está no pior
nível. A sessão real do proprietário tem quase tudo no nível intermediário, e
ali a demanda entrega 18% do que promete.

É parente direto do [[EA-65]] — lá a cegueira era no eixo *contexto declarado*,
aqui é no eixo *severidade das respostas*. Duas fixturas, um caminho cada.

### O que isto significa para a demanda 019

A 019 existe para substituir a leitura por gap por uma leitura por produto. Numa
sessão comum ela **não substitui**: convivem a visão por solução com dois cards
e a lista antiga com nove produtos, dizendo coisas diferentes sobre o mesmo
assessment. É pior do que antes da demanda, porque agora são duas superfícies
desalinhadas em vez de uma.

### Decisão que pertence ao proprietário

A saída natural é a visão por solução consolidar **as duas fontes** — o
`.apoio-block` de `sev 2` e o `.t-item` de `sev 1` —, com o produto aparecendo
uma vez e o **qualificador** dizendo de onde veio: indicação prioritária ou
"após validação".

Isso **muda o desenho aprovado na Fase 1 da 019** e por isso não é minha
decisão. O refinamento da demanda não previu a distinção de severidade porque a
medição da Fase 0 foi feita na mesma fixture de nível 0.

Relacionado: [[EA-56]], cuja emenda mede o mesmo vão pelo lado do papel —
*"a tabela de apoio do relatório cobre 40% dos gaps"*. É a mesma lacuna vista de
outro ângulo, e a correção deste achado muda aquele número.

## EA-69 — dois rótulos técnicos do MAP não trazem o acrônimo que os outros trazem

**Status**: `resolvido`

> **Fecho — fix-finding `fix/sessao-v329-onda1`, PR #103, mesclado em 2026-09-27
> (`7bee758`); registrado em 2026-10-19 pela reconfirmação da demanda 024.** A rota
> foi a da emenda logo abaixo — **apresentação, não Camada 1**: sete entradas novas
> na tabela fechada `P52_COPY` (`ui_p52_workspace_v32.js:204-217`), com `(SIEM)` em
> `:204-205` e `(NDR)` em `:208-209`; razão e limite da regra no comentário de
> `:177-203` — nome de mercado só onde a capability é categoria de tecnologia,
> **ratificado pelo proprietário em 2026-09-27**. O papel passa pelo mesmo mapa
> (`:3316-3318`, `beforeprint` → `p52Copy(#v32-print-report)`). Commits `463808f`
> (a tabela), `4b61398` (a troca alcança o nome acessível e as superfícies que o
> cliente recebe) e `d5caecb` (reancora o `P52-RB6`). Nenhum arquivo `frozen`
> tocado; o payload M41 idêntico ao pinado é afirmação da mensagem do `463808f`,
> não remedida aqui. Vivo no artefato construído:
> `quickscan_secops_soccmm_v3_2_dev.html:12211`.
>
> **A linha de status ficou `aberto` 22 dias depois do merge**, e nesse intervalo a
> recontagem de 2026-10-16 da fila do [[EA-58]] ainda o contou como represado atrás
> de Porta B. Fonte da reconfirmação:
> `specs/024-sete-defeitos-do-relatorio/refinement.md` §0. As seções abaixo —
> inclusive *"não agir"* e *"aguarda decisão do proprietário"*, de 2026-09-24 —
> ficam como foram escritas (R2 §5): descrevem a rota da Camada 1, que não foi a
> usada.

> **EMENDA DE ROTA, 2026-09-27 — a conclusão "Porta B" avaliou UMA rota só.**
>
> Este achado (e o [[EA-58]] que o contém) concluíram que corrigir um rótulo de
> exibição exige Porta B, porque o texto vive em arquivo `frozen` e está dentro do
> payload M41. A primeira metade é verdadeira; a conclusão não segue.
>
> **A rota de APRESENTAÇÃO já existia, já tinha precedente aceito, e nenhuma das
> duas análises a considerou.** Medido em 2026-09-27:
>
> ```
> "Mandato e objetivos"        -> 5 ocorrencias no payload M41 congelado
> "Direcionamento e objetivos" -> 0 ocorrencias no payload M41 congelado
> ```
>
> E é *"Direcionamento e objetivos"* que o produto mostra hoje, pela tabela
> `P52_COPY` (`ui_p52_workspace_v32.js:128`). Ou seja: **uma string que vive
> DENTRO do payload congelado já foi trocada no que o cliente vê, sem tocar no
> arquivo `frozen` e sem mover a régua D2** — o payload segue byte-idêntico ao
> pinado, como toda release desde então comprova.
>
> Acrescentar `(NDR)` e `(SIEM)` tem **exatamente a mesma forma**.
>
> **Isto não é contornar o portão pela letra.** O `P52_COPY` é tabela FECHADA e
> DECLARADA de substituição de apresentação, auditável numa tela, e foi usada
> para uma string da mesmíssima classe. Contornar seria editar o congelado
> alegando que o gate não olha; aqui a régua continua medindo o mesmo objeto e
> continua imóvel, porque o objeto não mudou — mudou a apresentação dele.
>
> **A consequência é maior que estes dois rótulos.** A premissa do `EA-58` —
> *"corrigir um rótulo custa o mesmo que mudar uma decisão"* — é **falsa para
> rótulos de exibição**. Se vale para `(NDR)` e `(SIEM)`, vale para boa parte dos
> seis pedidos represados, e o lote deixa de precisar de uma Porta B para existir.
>
> **O que continua exigindo Porta B**: mudar o que o motor DECIDE — quem é
> recomendado, em que tier, sob que condição. Esse payload muda por construção.
> A fronteira real não é "frozen versus não-frozen"; é **decisão versus
> apresentação**, e o `EA-58` merece ser reescrito em torno disso.
>
> **Limites medidos desta rota**, para não vendê-la mais barata do que é:
> a substituição é textual e se aplica ao texto renderizado, logo (a) exige grep
> do literal antigo nas suítes antes de qualquer troca, porque a string pode ser
> observável de invariante; (b) precisa de âncora que não colida por substring; e
> (c) não serve para o que o motor decide, só para como o nome aparece.
>
> Decidido sob delegação de 2026-08-29 levar esta emenda ao proprietário junto da
> tabela de rótulos proposta; a ratificação da tabela é dele.

**Instância do [[EA-58]]**, não achado independente.

> **CORREÇÃO DE REGISTRO, 2026-09-24 — este achado JÁ EXISTIA.**
>
> O `EA-58`, aberto em **2026-09-15 a pedido explícito do proprietário**, nomeia
> estes dois casos **pelo nome**: *"acrescentar `(NDR)` a um rótulo, para ficar
> coerente com o `(EDR)` que o vizinho já tem, muda o SHA do payload"* e
> *"`SIEM` no rótulo de logs"* entre os seis pedidos represados. E já trazia a
> medição por execução, com os três rótulos extraídos do payload.
>
> Abri o `EA-69` em 2026-09-22 sem ver isso, e em 2026-09-24 gastei um ciclo de
> medição **remedindo o que o `EA-58` já tinha medido**. A sonda confirmou o
> número com mais precisão — 9 campos em 4 dos 9 cenários, todos em `reasons` —,
> mas a conclusão era conhecida desde o dia 15.
>
> **Por que escapou:** ao investigar o apontamento da sessão real fui do sintoma
> para o código (`MAP` → Camada 1 → rito), sem varrer o backlog por achado
> anterior no mesmo arquivo. `EA-58` e `EA-69` tocam a MESMA linha do MESMO
> arquivo; um grep de `MAP[qid].cap` no `BACKLOG.md` teria bastado.
>
> **O id permanece** (R12: ids nunca renumeram, achado não se apaga). O que muda
> é o estatuto: deixa de ser pergunta própria e passa a ser **mais uma instância
> da fila que o `EA-58` já descreve**.
>
> **E a recomendação muda junto.** Eu havia escrito *"não agir"*. A saída 1 do
> `EA-58` é melhor e já estava escrita: **não agir SOZINHO — entrar no lote**.
> Se toda mudança de conteúdo cai em Porta B, que seja **uma** Porta B levando
> o lote inteiro (`EA-56` + os seis pedidos + `SCORES` + estes dois rótulos),
> porque *"a auditoria independente humana é o custo dominante e não dobra por
> levar mais conteúdo"*.
>
> A decisão continua do proprietário, e agora é **uma só** em vez de duas.

Relatado pelo proprietário em **sessão real na v3.2.8**, 2026-09-22:
*"Centralização de logs não mostra SIEM (SIEM) e Visibilidade de rede não
mostra o acrônimo para Network Detection & Response (NDR)."*

### O que foi medido

O `MAP` congelado tem padrão, e ele é consistente na maioria dos rótulos
técnicos — o acrônimo entre parênteses, junto do nome em português:

| qid | `MAP[qid].cap` | acrônimo |
|---|---|---|
| `policies` | Políticas de segurança e privacidade **(LGPD)** | sim |
| `detection-lifecycle` | Ciclo de vida de detecção **(detection engineering)** | sim |
| `endpoint` | Detecção e resposta em endpoint **(EDR)** | sim |
| `external-surface` | Gestão de exposição externa **(EASM/DRPS)** | sim |
| **`logs`** | Análise centralizada, correlação e retenção de eventos | **não** |
| **`network-visibility`** | Network Detection & Response | **não** |

Quatro de seis seguem o padrão; os dois que fogem são exatamente os dois que o
proprietário apontou. O relato está certo e é verificável.

### Cadeia arquivo:linha → efeito

- `quickscan_secops_soccmm_v3_1_3.html:448` — `"logs":{cap:"Análise centralizada,
  correlação e retenção de eventos"`
- `quickscan_secops_soccmm_v3_1_3.html:454` — `"network-visibility":{cap:"Network
  Detection & Response"`
- consumido por `ui_v32.js:1136` (`capCanon = MAP[f.id].cap`), que por decisão
  declarada no próprio comentário usa **um único dono do nome** para que a tabela
  de apoio e o motor não divirjam.

### Por que isto NÃO é um fix-finding meu

O texto vive na **Camada 1 V3.1.3, classe `frozen`**. A R6 §5 manda parar e
nomear o rito; como a Porta A segue **pendente de ratificação (Q3)**, qualquer
toque ali é **Porta B — spec + auditoria independente humana**. Não é decisão
minha e não se contorna pela letra.

### A assimetria que barateia metade do problema

Para `logs`, o acrônimo **já existe** do lado V3.2: `engine_v32.js:47` nomeia
`security-analytics` como *"Analytics de segurança (SIEM/data lake)"*. A
superfície mostra o nome da Camada 1 em vez do da V3.2 — é escolha de fonte, não
invenção de texto.

Para `network-visibility`, `"(NDR)"` **não existe em lugar nenhum**:
`engine_v32.js:54` também diz apenas *"Network Detection & Response"*. Ali é
texto novo, sem atalho.

### Encaminhamento — decisão do proprietário

| caminho | alcance | custo |
|---|---|---|
| Porta B na Camada 1 | os dois, na fonte certa | spec + auditoria humana |
| trocar a fonte do nome na superfície V3.2 | só `logs` | barato, mas cria duas redações para a mesma capability — exatamente o que `ui_v32.js:1131-1135` documenta como decisão deliberada de evitar |
| não agir | nenhum | zero |

**Recomendação registrada:** anotar e não agir agora. É legibilidade, não
correção de conteúdo, e a rota que resolve de verdade custa uma auditoria
humana. **Decisão do proprietário no chat, 2026-09-22: anotar como achado e não
agir** — *"Concordo, anota o 2 como achado"*.

### MEDIÇÃO DE 2026-09-24 — o custo é MAIOR do que eu havia declarado

Em 2026-09-24 o proprietário disse *"Vamos seguir com todas"*. Antes de escrever
a spec da Porta B, medi o que eu **não** tinha medido: se o rótulo entra no
payload funcional do M41.

**Entra.** Sonda executada sobre cópia do HTML construído, em scratchpad, sem
tocar arquivo protegido:

```
node harness_m41_v313.js <cópia com os dois acrônimos>      --compare v3_1_3_functional_snapshot.json
→ exit 1 · 9 campos divergentes em 4 dos 9 cenários
  (S2_critico_total · S3_misto_com_prioridades · S5_na_pesado · S6_moderado_total)
  TODOS em `$.scenarios[*].tiers.t2[*].reasons[*]`
```

`MAP[qid].cap` é o texto do **"Por que apareceu"**, e o "Por que apareceu" é
payload funcional — INV-7, narrativa determinística derivada de evidência.

**O que isso muda, e muda muito.** Eu havia dito que a correção custava *"spec +
auditoria independente humana"*. Está incompleto: ela custa **também repinar
`declared.m41_payload_sha256`**, que é a própria régua D2 — o número que decide,
em toda mudança futura do engine, se ela é Porta A ou Porta B. A R8 §3 é
explícita: mudar pin declarativo *"é ato de governança, nunca efeito colateral"*.

Não é impossível nem proibido. É que deixa de ser uma correção de legibilidade e
passa a ser **mexer no instrumento que mede todas as outras mudanças** — para
acrescentar dois parênteses a dois rótulos.

**Recomendação revista, e mais firme que a anterior:** não agir. O benefício é
legibilidade; o custo é reescrever a régua. Se um dia a Camada 1 for reaberta por
outro motivo — aí sim, estes dois rótulos entram de carona, com o repin já
justificado por aquele motivo maior.

**Aguarda decisão do proprietário com este número na mesa.** A autorização de
2026-09-24 foi dada sem ele.

Ver [[EA-47]], que é a mesma família pelo lado do glossário: rótulo que envelhece
em silêncio porque ninguém compara contra o padrão dos irmãos.

## EA-70 — o (i) dos sinais cai numa linha nova, e é reincidência do EA-60 (11)

**Status**: `resolvido`

> **Fecho — fix-finding, 2026-09-22.** Correção em `ui_p52_workspace_v32.css`
> (terceira coluna na grade do rótulo de sinal; grade no lugar de flex no
> rótulo de arquitetura) e gate novo `V322-HELPGEO1` no Chromium.
>
> **O gate foi visto FALHAR antes de passar**, e a medição está abaixo. Não
> era formalidade: ele achou DUAS instâncias que ninguém tinha relatado.
>
> **Vermelho** (CSS revertido): 22 sinais × 3 viewports, cada um com a medida
> — *centro do (i) a 31px do topo, altura de linha 20px*. Mais **três campos
> de arquitetura a 390px**.
>
> **A terceira instância é o achado dentro do achado**: os campos de
> arquitetura continuaram vermelhos DEPOIS da correção dos sinais, porque a
> mudança não os tocava. Ou seja, **a correção do `EA-60` (11) funcionava em
> 1440/1920 e quebrava em 390px** — e ficou assim desde então porque nasceu
> sem gate. A raiz é a mesma num disfarce: em `flex` o nome do campo é item
> **anônimo**, e não há seletor que o alcance para mandá-lo encolher; em
> viewport estreito ele tomava a linha inteira e empurrava o (i) para baixo.
> Grade alcança o que flex não alcança.
>
> **Verde depois das duas correções:** `V322-HELPGEO1` 1 PASS · 0 FAIL, nas
> duas famílias, nos três viewports.
>
> **Três instâncias do mesmo defeito, das quais o proprietário viu UMA.** É
> a medida do que custou não ter escrito o gate na primeira vez.

Relatado pelo proprietário em **sessão real na v3.2.8**, 2026-09-22:
*"O (i) de informação ficou fora do padrão em 'Requisitos ou preocupações
específicas'."*

### Cadeia arquivo:linha → efeito

`ui_p52_workspace_v32.css:2096` declara o `<label>` de cada sinal como grade de
**duas** colunas:

```css
#v32editor .v32-signals > label {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
}
```

A caixa ocupa `(1,1)` por posicionamento explícito (`:2105-2109`); o texto é
anônimo e cai em `(2,1)` por auto-posicionamento; o botão `(i)`, terceiro item,
vai para **a próxima célula livre — `(1,2)`**. Daí ele aparecer numa linha nova,
alinhado à coluna da caixa, em vez de ao lado do rótulo.

`ui_p52_workspace_v32.css:2112` tenta o contrário e **não pode funcionar**:

```css
#v32editor .v32-signals > label > .p52-caphelp-btn { margin-left: 6px; vertical-align: -5px; }
```

`vertical-align` não tem efeito sobre item de grade. A regra **declara uma
intenção que o layout contradiz** — e o comentário acima dela afirma
textualmente *"o controle de ajuda acompanha o rótulo e não abre coluna nova"*.

### A parte que é reincidência, e o erro é meu

O `EA-60` item (11) era **este mesmo sintoma** nos campos de arquitetura, e foi
corrigido com classe própria (`p52-fieldhelp-arch`, `:695-699`). No comentário
daquela correção — `ui_p52_workspace_v32.js:1541-1543` — eu escrevi que os sinais
*"têm checkbox e não podem virar grade"*.

**Raciocínio nunca medido, e errado**: os sinais **já eram** grade desde
`:2096`, com o mesmo defeito. Corrigi um irmão, declarei o outro imune por
inspeção e segui.

### Por que nenhum gate pegou

- `V322-HELP3` (`tests_p52_layout.js:1281`) afirma **existência e ordem no DOM**
  do controle `(i)`, nunca **posição** — e não poderia: jsdom não tem layout.
- Posição só se julga no Chromium (KI-3). Conferido em `tests_p52_chromium.js`:
  há medição de geometria de trilho, seções, cards e radar — **de nenhum
  controle `(i)`**.
- Logo a correção do `EA-60` (11) também nasceu **sem gate**. Foi por isso que o
  irmão pôde quebrar em silêncio: não havia sensor nenhum nessa dimensão.

> **Correção verificada só a olho não deixa sensor para o próximo caso.** O
> EA-60 (11) foi aceito por inspeção visual; o gate que faltou ali é exatamente o
> que teria reprovado este. Um gate novo aqui não é cerimônia — é a dívida
> daquela correção sendo paga.

Ver [[EA-60]], de quem este é reincidência direta, e [[EA-20]], por ser mais uma
propriedade que nenhum portão media.

## EA-71 — o gate que prova "tudo-ou-nada" da arbitragem não pode falhar

**Status**: `aberto`

**Aberto em**: 2026-09-26, durante a demanda 021, ao investigar um sobrevivente
da campanha `d010`. **Não é da 021** — provado abaixo.

### O que foi medido

O mutante `D010-M20` faz a arbitragem **parar no título**: em vez de
`node.classList.toggle("v32-hidden", hide)`, ele faz `remove("v32-hidden")` — ou
seja, **nada é ocultado**. O gate `D010-ARB3`, que existe para provar *"tudo-ou-nada
e sem transbordo"*, **passa**.

```
D010-M20 aplicado · D010-ARB3 → PASS
```

### Por que passa, e é o mecanismo que importa

A arbitragem é tudo-ou-nada por construção: `ocultos` tem de valer **0** ou
`conhecidos.length`. Com o mutante, `ocultos = 0` — e zero satisfaz a condição.

**O gate não distingue "arbitrou tudo" de "não arbitrou nada".** Ele afirma a
consistência da arbitragem sem nunca afirmar que ela **aconteceu**.

### A prova de que NÃO é da demanda 021

**Controle válido** (2026-09-26): `git worktree add --detach <tmp> origin/develop`
— árvore INTEIRA da base, não arquivo trocado dentro da branch. Campanha `d010`
rodada lá, restauração byte a byte OK:

```
D010 MUTATION: 23/24 · SOBREVIVENTE D010-M20      (origin/develop e9e1e6b)
D010 MUTATION: 23/24 · SOBREVIVENTE D010-M20      (branch da 021, medido pelo CI)
```

Idêntico dos dois lados. A 021 toca `qsGapSupportHTML()`, superfície de **papel**;
o `D010-ARB3` mede censo de **tela**.

> **Errata de método.** A primeira redação deste achado provava a não-autoria
> trocando só `ui_v32.js` pela versão da develop **dentro da branch**. Isso não é
> controle: o arquivo trocado convive com harness, fixtures e fontes de build da
> branch. O veredito calhou de estar certo, e o método não — tanto que, ao ver no
> CI do PR #91 que o mutante morria quatro dias antes, a conclusão foi invertida e
> anunciada como regressão própria antes de haver controle. Registrado para não
> se repetir.

### Quando parou de morrer, e por quê

O `D010-M20` era DETECTADO até o CI do PR #91 (2026-09-22, `24/24`). O que mudou
não foi alvo declarado de campanha nenhuma: a demanda 019 alterou **299 linhas**
de `ui_p52_support_v32.js`. Revertendo SÓ esse arquivo ao estado pré-019, na
worktree de controle:

```
D010 MUTATION: 24/24 · D010-M20 DETECTADO
```

Uma variável, veredito invertido. Ver [[EA-72]], que é a razão de ninguém ter
notado por quatro dias.

### O gate não pode falhar — e o produto MUDA sem que ninguém olhe

Com o mutante aplicado, a suíte `d010` INTEIRA, sem o filtro `only`:

```
D010 RECOMENDAÇÃO SEM VÃO: 13 PASS · 0 FAIL de 13
```

**Treze gates, nenhum vê.** E a mutação *é* observável: o censo da alínea (b)
cai de três âncoras para duas — o `<details> 'demais gaps altos'` desaparece:

```
são     · âncoras presentes: #review, #restart, <details> 'demais gaps altos'   (0/3 no escopo)
mutado  · âncoras presentes: #review, #restart                                  (0/2 no escopo)
```

Essa diferença é impressa num `g.nota`, **não numa asserção**. O gate enxerga e
não julga.

As três razões se somam, e cada uma sozinha já bastaria:

1. **(a) aceita `∅`** — a arbitragem tem de ocultar 0 ou tudo; o mutante oculta 0.
2. **(b) é inofensiva por declaração** — sob o workspace 5.2 a varredura tem
   escopo `[data-p52-legacy-scope="support"]`, e o próprio comentário do gate
   registra `DENTRO do escopo varrido: 0/3 — nenhuma: (b) é guarda de ALCANCE,
   não pode falhar enquanto o escopo for o do workspace 5.2`.
3. **O par `only: "D010-ARB3"`** impede que qualquer outro gate tenha a chance.

### O que este achado NÃO é

Censo do produto **são**, pré-019 × develop: saída **idêntica, byte a byte**. A
invariante C3 não foi arranhada e **não há defeito visível na v3.2.8**. O que se
perdeu foi a redundância que tornava o mutante visível — o dano é à prova, não ao
produto.

### Cadeia arquivo:linha → efeito

- `ui_v32.js` — `if (hiding && allowed) node.classList.toggle("v32-hidden", hide);`
  (a linha que o mutante ataca)
- `tests_010_vao.js` — `D010-ARB3`, alínea (a): arbitragem parcial reprova,
  arbitragem **ausente** não; alínea (b): guarda de alcance, sem poder de falhar.
- `ui_p52_support_v32.js` — a mudança da 019 que retirou o caso que fazia (a) ver.

### Encaminhamento

Falta a alínea que afirma a **ocorrência**: com a arbitragem ligada e substituto
presente, o conjunto oculto tem de ser **não vazio**. E o censo de âncoras, hoje
uma nota, tem de virar asserção — quem observa e não julga não é portão.

**Não corrigido na 021 de propósito**: é gate de outra demanda, e alterá-lo de
dentro desta seria o que a R10 §1 proíbe — a lição que a 020 mediu e a 021 pagou
com três waves quando colidiu com a C2 da 015. Enquanto não for corrigido, o
sobrevivente está declarado em `.claude/verify/known_issues.json` como exceção
nominal `mutation-sobrevivente` (IC-9), com prazo e com este achado como credor:
a exceção mantém o mutante CONTADO e reprova sozinha no dia em que ele voltar a
morrer.

Ver [[EA-20]], de quem este é mais uma instância: portão que promete mais do que
mede.

## EA-72 — o gatilho das campanhas vigia menos do que a campanha depende

**Status**: `aberto`

**Aberto em**: 2026-09-26, durante a demanda 021, ao investigar por que dois
sobreviventes passaram quatro dias sem ser notados.

### O que foi medido

As campanhas só rodam quando um **alvo declarado** muda (`check_mutation.py`:
`nenhum alvo mudou desde a base — campanha não exigida`). Os alvos:

```
core  = [ui_session_v32.js, ui_v32.js, ui_refinement_v32.js, tests_core_mutants.js]
d010  = [ui_v32.js, ui_target_v32.js, tests_010_vao.js, fixtures_010_vao.js, tests_010_mutants.js]
```

Mas a campanha `d010` **reconstrói o HTML** e roda o gate sobre ele. O HTML é
montado a partir de fontes que **não estão na lista** — entre elas
`ui_p52_support_v32.js`, alterado em 299 linhas pela 019, que foi exatamente o
que tirou o poder discriminante do `D010-ARB3` ([[EA-71]]).

O mesmo vale para o `core`: o gate é `tests_session_m48.js`, e o **comando** que o
invoca morava numa cópia literal do `package.json` — nenhum dos dois é alvo.
Quando o `package.json` subiu o heap de 4608 para 6144, a cópia ficou para trás e
o `CM1` virou sobrevivente falso.

### O mecanismo

O gatilho protege contra o custo de rodar tudo sempre, e o preço é uma lista que
precisa acompanhar a dependência real da campanha. Ela não acompanhou. Pior: o
silêncio é **indistinguível de saúde** — `campanha não exigida` é impresso como
`[OK]`, e quatro merges seguidos passaram verdes com dois gates já sem poder.

### Encaminhamento

Duas direções, e a segunda é a que fecha a classe:

1. **Estender os alvos** de `core` e `d010` para as fontes que entram no build —
   remédio imediato, mas volta a apodrecer na próxima fonte nova.
2. **Derivar o gatilho da dependência real** — a campanha já conhece o que
   reconstrói; a lista podia sair daí em vez de ser redigida à mão. Fonte única,
   como o comando do gate passou a ser (corrigido na 021, `tests_core_mutants.js`).

Enquanto não houver remédio, vale a regra de leitura: `campanha não exigida` não
é prova de saúde da campanha — é ausência de medição, e a R10 §2 não deixa
confundir as duas.

Ver [[EA-20]], de quem este é instância no **gatilho**, e não no gate.

## EA-73 — o apoio Fortinet decora o card de PRIORIDADE, e só quando calha de casar

**Status**: `resolvido`

> **Fecho — fix-finding `fix/sessao-v329-onda1`, PR #103, mesclado em 2026-09-27
> (`7bee758`), commit `463808f`; registrado em 2026-10-19 pela reconfirmação da
> demanda 024.** A rota foi a do encaminhamento abaixo, e mais larga do que ele
> previa: `p52SupportHints` **saiu inteira** em vez de ser restringida à seção 4.
> Medido no cenário do relato, os 3 ponteiros pousavam **todos** em `.prio-decl` e 0
> no papel — o comentário do `EA-55` prometia as seções 2 e 4, mas o seletor só
> alcançava prioridade, logo não havia o que preservar na seção de gaps.
> `p52ValidationIndex` e o CSS `.p52-hint*` saíram junto, senão virariam código e
> regra mortos. Registro da reversão: `ui_p52_workspace_v32.js:3029-3038`.
> Varredura por `p52SupportHints` em `*.js` (recursiva, fora `node_modules`) em
> 2026-10-19: **uma** ocorrência, o próprio comentário (`:3032`).
>
> **O registro em `design-decisions.md` que este encaminhamento exigia — e que o
> comentário em `:3038` afirma existir — não existia.** Escrito em 2026-10-19, na
> mesma demanda 024. A linha de status ficou `aberto` 22 dias depois do merge.

**Aberto em**: 2026-09-27, por relato do proprietário após sessão real na v3.2.9.

### O relato

> *"aqui não é para colocar solução Fortinet, é para mostrar apenas as prioridades
> selecionadas e nas capabilities relacionadas"*

Na seção **2 · Prioridades do negócio**, o card *Centralização de logs* trazia
`Apoio possível, a validar: FortiSIEM · FortiAnalyzer`. Os outros dois cards da
mesma seção não traziam nada.

### O que foi medido

Não é defeito de implementação — é **comportamento deliberado do [[EA-55]]**:

```
/* EA-55 · passagens que cruzam SEÇÕES: o ponteiro de apoio lê a lista
   "após validação" (seção 7) para decorar cards das seções 2 e 4. */
p52SupportHints(flow);
```

`ui_p52_workspace_v32.js:1020` percorre `.prio-decl`, casa o texto da capability
contra o índice de validação e só emite quando há produto correspondente. Por isso
saiu em **um** dos três cards: os outros dois não casaram.

A inconsistência que o proprietário viu é consequência direta do desenho: a
decoração é condicional, e condicional sem regra visível lê-se como defeito. **Ou
aparece nos três, ou em nenhum** — o meio-termo é o pior dos casos.

### Encaminhamento

Restringir `p52SupportHints` à seção 4 (gaps), onde o apoio pertence. É pequeno,
mas **reverte parte de uma correção anterior**: entra em
`.claude/rules/design-decisions.md`, nunca em silêncio (R13).

Ver [[EA-55]], de quem este reverte metade, e [[EA-20]] pela condicional que
promete regra e entrega coincidência.

## EA-74 — o contador de gaps promete a sessão e mede a seção

**Status**: `resolvido`

> **Fecho — fix-finding `fix/sessao-v329-onda1`, PR #103, mesclado em 2026-09-27
> (`7bee758`); registrado em 2026-10-19 pela reconfirmação da demanda 024.** As
> **duas** metades do encaminhamento. O rótulo do índice lê o censo da **sessão**
> (`ui_p52_workspace_v32.js:2297-2300` → `p52CensoSessao`, `:274-283`), publicado
> pelo domínio em `#v32panel` como `data-qs-censo-*` — quem calcula publica, quem
> apresenta lê. E a seção de gaps **nomeia** quantos altos foram lidos como
> prioridade, com ponteiro para a seção 2 (`p52GapsForaDaSecao`, `:3010-3027`).
> Commits `463808f` (as duas metades) e `4b61398` (a publicação do censo em
> `ui_v32.js`, depois de o `P52-GOV1` reprovar a primeira versão, que chamava
> `computeFindings()` de dentro do workspace), com repin `§29.4` sob autorização
> nominal do proprietário de 2026-09-27 (`bf85a65`). Sem motor, o rótulo é omitido
> em vez de mostrar número errado. Vivo no artefato construído:
> `quickscan_secops_soccmm_v3_2_dev.html:14303`. A linha de status ficou `aberto`
> 22 dias depois do merge.

**Aberto em**: 2026-09-27, por relato do proprietário após sessão real na v3.2.9.

### O relato

> *"Gaps observados apareceu nessa sessão '0 altos - 9 moderados', o que não faz
> sentido, visto que as prioridades do negócios seriam também os principais gaps
> altos."*

### O que foi medido

`ui_p52_workspace_v32.js:2229` conta dentro da seção, e só dentro dela:

```
var gsec = document.getElementById("p52-sec-gaps");
var hi = gsec ? gsec.querySelectorAll(".f-tag.sev-a").length : 0;
var mo = gsec ? gsec.querySelectorAll(".f-tag.sev-m").length : 0;
return hi + " altos · " + mo + " moderados";
```

A seção de gaps exclui, **por desenho**, os gaps escolhidos como prioridade — o
próprio subtítulo diz *"Também foram observados gaps que não foram selecionados
entre as prioridades declaradas nesta sessão."* Quando os três altos da sessão
viram prioridade, a conta da seção é literalmente `0 altos`.

Literalmente verdadeiro; **enganoso como leitura da sessão**, que é o que o índice
lateral parece oferecer. Quem lê `0 altos` entende *"esta organização não tem gaps
altos"*.

### O defeito de raiz, que é maior que o contador

**Virar prioridade faz o gap sumir da leitura de gaps.** O contador é apenas onde
isso aflora. Trocar só o escopo da contagem move o silêncio de lugar: o rótulo
passaria a dizer `3 altos` e a seção mostraria nove cartões.

### Encaminhamento

Decidido com o proprietário em 2026-09-27: o contador passa a medir a **sessão
inteira**, e a seção de gaps ganha a linha que nomeia quantos altos estão nas
prioridades, com ponteiro para a seção 2 — as duas metades juntas, porque só a
primeira troca uma omissão por outra.

Ver [[EA-20]], de quem este é instância: número que promete mais do que mede.

## EA-75 — produto que serve duas capabilities aparece duas vezes, e a alavancagem some

**Status**: `resolvido`

> **Fecho — demanda `022-escalonamento-do-investimento`, PR #104, mesclado em
> 2026-10-01 (`aa74fbc`); registrado em 2026-10-19 pela reconfirmação da demanda
> 024.** Resolvido em **forma emendada**, não na do encaminhamento abaixo. A errata
> `E2` da 022 (`specs/022-escalonamento-do-investimento/spec.md:85-117`), ratificada
> pelo proprietário no chat em 2026-09-28 (*"Vamos de B"*), **recusou a reindexação
> da leitura por capability** — custo medido: 55 asserções em 5 suítes, uma `§29.4`
> e outra selada por errata — e completou a visão **por produto**, que já existia e
> não listava o produto habilitado por sinal declarado. Capabilities e sinais
> **unidos**, chave pelo nome exibido (`ui_p52_support_v32.js:272-344`); gate
> `D022-PROD1` (`tests_022_escalonamento.js:350-389`). A leitura por capability
> continua mostrando o produto em cada capability que ele serve — por desenho: ela
> responde *"por que este apareceu para esta necessidade"*.
>
> O refinamento da 024 cita o gate em `:369-387` e o bloco em `:272-330`; medido em
> 2026-10-19, o gate inteiro é `:350-389` (as linhas citadas lá são as alíneas (b) e
> (c)) e o bloco fecha em `:344`, no fim do `try/catch`. A linha de status ficou
> `aberto` 18 dias depois do merge.

**Aberto em**: 2026-09-27, por relato do proprietário após sessão real na v3.2.9.

### O relato

> *"Quando uma tecnologia estiver associada a mais de uma capability, por exemplo,
> Risco Interno e Prevenção de Perda de Dados como sinal declarado, aparece
> FortiDLP. Aqui poderia aparecer a solução apenas uma vez, em vez de duplicar."*

### O que foi medido

A seção **Contexto tecnológico** é organizada **por capability**: cada bloco traz
as ofertas daquela capability. `FortiDLP` serve *Risco interno* e *Prevenção de
perda de dados*, e sai duas vezes — cada ocorrência legítima na sua caixa, com o
mesmo sinal declarado (`Insider risk, Shadow AI`) repetido.

### Por que não é só cosmético

A repetição **esconde o melhor argumento do produto**. O leitor vê dois itens; o
que existe é **um produto cobrindo duas necessidades** — exatamente a alavancagem
que justifica investimento. Organizar por capability torna invisível o que mais
pesa na decisão de compra.

E isto se liga ao que o proprietário pediu sobre o motor: se a unidade de decisão
é o **investimento**, o eixo da seção tem de ser o investimento, não a capability.

### Encaminhamento

Decidido com o proprietário em 2026-09-27: a seção passa a ser **indexada por
produto**, com as capabilities como atributo. Ao fundir, sinais e capabilities são
**unidos**, nunca escolhidos — `FortiDLP` sai uma vez dizendo *Risco interno ·
Prevenção de perda de dados*, preservando o sinal declarado de cada.

Ver [[EA-68]], que já moveu a visão por solução para derivar do motor — este segue
a mesma direção.

## EA-76 — "o que o motor ofereceu" é derivado em dois lugares, e nada obriga os dois a andarem juntos

**Status**: `resolvido`

> **Fecho — demanda `026-decisao-unica-do-apoio` (branch
> `feature/026-decisao-unica-do-apoio`, PR PR #117 (https://github.com/oflavioc/quickscan-secops/pull/117)), registrado em 2026-10-31 —
> T060, `doc-writer`.** Corrigido **na branch**; a mesclagem e o job `visual` do CI
> estão pendentes. `resolvido` aqui significa «corrigido e medido pela suíte
> `D026` e pelas campanhas da 026», não «mesclado» nem «entregue» (merge e deploy
> em `127.0.0.1:1337` são do proprietário). A origem é a auditoria externa de
> 2026-10-31 (`QS-01`, `QS-02`). As decisões D-1..D-9 em que o conserto se apoia
> foram *decididas pelo orquestrador sob a instrução do proprietário de
> 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR*.
>
> **O que foi feito — a fonte única.** A derivação de «o que o motor ofereceu»
> deixou de existir em dois módulos. Nasce **uma vez**, no dono do estado:
> `reconciliar(entrada)` (`ui_curation_v32.js:207`) — função **pura**, sem DOM e
> sem estado — reconcilia `computeFindings()+MAP` (a hipótese da Camada 1) com
> `buildRecommendationContext()` (a voz do motor) e devolve
> `{ registros[], vetos[] }`. O coletor é `entradaViva()` (`:173-202`); a derivação
> viva é `derivar()` (`:412-418`); a bridge `__CURATION` ganha `oferta()`,
> `vetos()` e `reconcile()` (`:550-552`) e `contract()` ganha `{oferta, vetos}`
> (`:584-595`). `ofertados()` (`:422-426`) virou **leitor** do mesmo registro
> (chaves com `chave ≠ null`); `decidir`, `publicados`, `valido`, `validar`,
> `daSessao`, `paraSessao` e `unset` estão byte-iguais. Do outro lado,
> `ofertaDoMotor()` (`ui_p52_support_v32.js:309`) deixou de varrer
> `computeFindings()` e o catálogo por nome: lê `oferta()` e o laço por sinal da
> 022 E2 saiu do módulo (a âncora do `D022-M10` foi transportada verbatim para
> `ui_curation_v32.js:341-357`). O editor lê a mesma bridge
> (`ui_curation_edit_v32.js:106`, «apresentado como <variante>», D-9).
> Engine, Camada 1, `ui_v32.js`, `ui_session_v32.js` e o schema: **zero linha**.
>
> **As duas direções do `EA-76`, fechadas.**
>
> - **O card que morria no filtro** (direção do corpo do achado: o coletor tinha
>   o produto e `decisaoDe()` → `decide()` devolvia `exclude` por ele não estar em
>   `offered()`). Agora `offered()` e os cards saem do **mesmo** registro:
>   `ofertados()` (`ui_curation_v32.js:422-426`) lista as chaves dos registros e
>   `decisaoDe()` (`ui_p52_support_v32.js:136-141`) só age sobre a linha que o
>   registro já trouxe. Medido por `D026-REC1 (h)`: `published()` ≡ conjunto de
>   `data-p53-sol-produto` da tela ≡ o do papel em C1, C7 e C10.
> - **O card que entrava sem passar pela curadoria** (a «segunda fonte» de
>   2026-10-19: candidato do motor por sinal, resolvido por **nome**, sem chave
>   em `PRODUCTS`). O pareamento `itemId → chave` passou a ser **por critério** e
>   total sobre `OFFERINGS ∪ SERVICES` (`ui_curation_v32.js:133-167`, regras 1–5
>   do desenho §1.4): `fortiedr` e `forticlient` curam sob a linha `FortiEndpoint`,
>   `fortindr-onprem` e `fortindr-cloud` sob `FortiNDR`, `fortisiem-cloud` sob
>   `FortiSIEM`, `fortiguard-labs-advisory` sob `FortiGuard-Service-Bundle`.
>   `data-p53-sol-produto` carrega a **linha** (a identidade curável); o item
>   resolvido vai ao `h4` e a `data-p53-sol-item-id` (D-7). Medido por
>   `D026-REC1 (a)(c)(e)(g)` e `D026-LEG1 (g)`:
>   `set("FortiEndpoint","exclude")` retira o card `FortiEDR` da tela e do papel,
>   `unset` o devolve.
>
> **Resíduo declarado — item sem par na Camada 1 (`chave:null`).** O pareamento
> não inventa chave: `fortisoc`, `fortimail`, `fortimail-wss`, `fortimail-cloud-saas`,
> `fortisandbox`, `fortiaigate`, `fortipam`, `fortiauthenticator`, `fortisat`,
> `fortigate` e os nós `fortimail-family`/`soc-platform-family`/`identity-family`
> continuam **publicáveis e incuráveis** — o status quo de
> `ui_curation_v32.js` (em `9509e4b`, `ui_curation_v32.js:142`, `if (!chave) return;`) e de
> `ui_p52_support_v32.js:136-141` (`idDoNome` nulo → `include`). Ou seja: os seis
> nomes da tabela de 2026-10-19 (`FortiMail`, `FortiMail Workspace Security`,
> `FortiMail Cloud SaaS`, `FortiAuthenticator`, `FortiPAM`, `FortiAIGate`)
> **ainda não podem ser excluídos pelo operador** — `valido()` (byte-igual)
> recusa id fora de `catalogo()`. O que mudou para eles: aparecem com o registro
> completo (tier, ação, condição, origem) em tela e papel, e `D026-REC1 (g)` fixa
> que o pareamento devolve `null` para eles (a fixação é do gate; a recusa de
> `valido()` é por leitura minha, **não reexecutada**). A rota é Porta B em
> `PRODUCTS` (`specs/019-curadoria-do-relatorio/spec.md:215-218`, payload M41) ou
> alternativa restrita a esse grupo, em demanda própria. `published() ≠ cards`
> continua latente nesse caso, como já era antes da 026.
>
> **Medido** (execuções citadas das mensagens de commit e dos logs da W4/W4b;
> não reexecutadas por mim): red `7678222` — `D026 CONTRATO: 0 PASS · 3 FAIL de 3`;
> green em `816d605`/`dc5b633` — `3 PASS · 0 FAIL de 3` (`D026-REC1`, `D026-PAP1`,
> `D026-LEG1`); a alínea `D026-REC1 (j)` (fixture C4-DL) entrou em `993e371` com a
> suíte ainda 3/3 (errata E12 da spec); regressão `d019` 14/14, `d022` 14/14,
> `d023` 9/9, `d025` 16/16, `d010` 13/13, `d015` 5/5, `d021` 8/8. Campanhas
> sequenciais (`5a99293`, `993e371`): `d019` 17/17, `d022` 13/13 (`D022-M10`
> DETECTADO no arquivo novo), `d023` 12/12, `d025` 23/23 e `d026` **6/6**
> DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO. A primeira execução da `d026`
> fechou 5/1, com `D026-M5` sobrevivente: o diagnóstico mostrou que ele acusava o
> **gate** (nenhuma fixture exercitava a fusão veto > hipótese do lado produto),
> não o código — a alínea (j) nasceu verde por desenho e o derruba, sem afrouxar
> asserção alguma. Ainda: `d014 regra_morta` 7/7 após o censo do CSS remedido
> (33/205/3 → 52/298/5); stage `suites` 0 problemas; `compliance-audit` 17 PASS ·
> 0 FAIL · 0 WARN (execução da W4); matriz de mutação com 207 pares. **Pendentes**:
> o pipeline final (`run.sh` **18 PASS · 0 FAIL** (stage `mutation` incluso: campanhas d019/d022/d023/d025/d026 pela relação do diff) e `compliance-audit` **17 PASS · 0 FAIL · 0 WARN**, sobre `fca0e1c` em árvore limpa, 2026-10-31 (log `026-pipeline-final.log`)); `playwright P8` e `P52-PDF5/6`, que rodam
> no job `visual` do CI e dependem do PR. Carrascos: `D026-M1`…`D026-M6`
> (`tests_026_mutants.js`).
>
> **Aberto por causa dele.** `EA-122` (lacuna do engine: `suppressedByPlatform()`
> não consultada no ramo `CONTEXT_NOT_INFORMED`, e dois descartes silenciosos) —
> a 026 a contorna (`CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false`,
> `ui_curation_v32.js:111`), não a corrige. A decisão de 2026-10-19 («DECLARAR E
> SELAR», pendência 1 dos registros de selagem) fica como trilha; a pendência que
> ela declarava é esta. `EA-123` (decisão `exclude` sobre linha que o motor deixou
> de ofertar sobrevive no arquivo de sessão sem efeito e sem aviso) — achado
> lateral, fora da 026.

**Aberto em**: 2026-09-29, durante a W3 da demanda 022, ao descobrir por que um
produto entrava na lista do coletor e o card nunca chegava ao DOM.

### O que foi medido

A mesma derivação — *o conjunto que o motor ofereceu nesta sessão*, varrendo
`computeFindings()` e `MAP` — existe **duas vezes**, em módulos diferentes:

| onde | função | para quê |
|---|---|---|
| `ui_p52_support_v32.js:247` | `ofertaDoMotor()` | monta os cards da visão por produto |
| `ui_curation_v32.js:75` | `ofertados()` | diz ao operador o que ele pode curar |

E a segunda é **porteira da primeira**: `decisaoDe()` consulta `decide()`, que
devolve `exclude` para todo id fora de `offered()`. Um produto pode estar no
coletor e ser barrado pelo outro módulo, sem que nada acuse.

Medido no episódio que o revelou:

```
produtos (ofertaDoMotor)  12   — FortiDLP incluído
cards                     11   — FortiDLP fora
offered()                 11   — sem fortidlp
decide("FortiDLP")        exclude
```

Estendi uma das cópias e o produto continuou sem chegar à tela. O diagnóstico
custou quatro ciclos porque a suspeita natural — a guarda de idempotência — estava
errada, e só a instrumentação mostrou onde ele morria.

### O mecanismo

Não é duplicação de código por descuido: os dois módulos têm donos diferentes e
ordens de injeção diferentes, e o de curadoria é o **dono do estado** (R9 §5). O
que falta é a fonte única: hoje quem altera uma cópia não tem como saber que a
outra existe, e a única prova de que divergiram é um produto sumindo da tela.

### Cadeia arquivo:linha → efeito

- `ui_curation_v32.js:75` — `ofertados()`, o laço sobre `computeFindings()` + `MAP`
- `ui_p52_support_v32.js:247` — `ofertaDoMotor()`, o mesmo laço
- `ui_p52_support_v32.js` — `decisaoDe()` → `__CURATION.decide()` devolve `exclude`
  para id fora de `offered()`, e o card morre no filtro sem aviso

### Encaminhamento

Fonte única: a derivação passa a viver num lugar só — candidato natural é o módulo
de curadoria, que já é dono do estado —, e o de apresentação consome por bridge,
acrescentando só o que é de apresentação (capabilities exibidas, sinais, tier).

**Não corrigido na 022 de propósito**: a demanda estendeu as duas cópias para não
travar, e consertar a estrutura é mudança de contrato entre dois módulos com ordem
de injeção declarada — R10 §1.

Ver [[EA-72]], que é a mesma classe (cópia literal de um valor com dono): esta é a
**quinta instância medida na mesma semana**, ao lado do heap do `SESSION 4.8`, dos
dois pré-filtros do caminhador da copy e da âncora do `P52-RB6`.

### Instância medida em 2026-10-19 — a segunda fonte, e a direção inversa da descrita acima

Medida pela auditoria adversarial de 2026-10-19 (refutador do claim R-EA-68, a
resolução do `EA-68`: "a oferta vem do motor, a mesma do `offered()`"), sobre o
HTML construído de `1c6a363` — SHA-256 `4c45ce20…5712`, igual ao blob de
`0bd677c` (`git show 0bd677c:quickscan_secops_soccmm_v3_2_dev.html | sha256sum`,
reconferido ao escrever esta nota). As linhas abaixo foram lidas por mim em
`0bd677c`; a sonda jsdom é do refutador e **não foi reexecutada aqui**.

**`ofertaDoMotor()` tem uma SEGUNDA fonte**, e ela não é a de `offered()`:

- `ui_p52_support_v32.js:272-345` — o bloco `[022 · errata E2 — EA-75]` acrescenta
  candidatos habilitados por sinal (`V32.buildRecommendationContext()`) e resolve
  o produto no catálogo do motor **por nome** (`:308-310`: `V32.OFFERINGS` →
  `OFFERINGS` → `PRODUCTS`).
- `ui_curation_v32.js:121` — `ofertados()` exige chave na Camada 1:
  `if (!chave) return;` ("fora do catalogo curavel: nao se inventa id"). Na
  auditoria sobre `1c6a363` a mesma linha era `:116`.
- `ui_p52_support_v32.js:136-141` — `decisaoDe()` devolve `"include"` quando
  `idDoNome()` (`:114-121`, busca `PRODUCTS[id].n === nome`) não acha o produto.
- `ui_curation_v32.js:133-138` — `valido()` recusa id fora de `catalogo()`
  ("id fora do catálogo").
- **Efeito**: o card entra na seção de apoio **sem passar pela curadoria**, e o
  operador **não consegue excluí-lo** — não há id a excluir. É a direção inversa
  da que o corpo deste achado e o `EA-75` descrevem ("o card morre no filtro").

**Reproduzido com sinais normais da UI** (`ui_v32.js:53-55`, grupos "E-mail /
Dados", "IA", "Identidade / Endpoint"), cards da tela contra `__CURATION.offered()`:

| sinal declarado | `offered()` | cards | cards fora de `offered()` |
|---|---|---|---|
| nenhum | 11 | 11 | — |
| `becConcern` | 11 | **14** | FortiMail, FortiMail Workspace Security, FortiMail Cloud SaaS |
| `identityRiskConcern` | 11 | **12** | FortiAuthenticator |
| `pamRequirement` | 11 | **12** | FortiPAM |
| `organizationBuildsAIApps` | 11 | **12** | FortiAIGate |
| todos os sinais | 12 | **18** | os seis nomes acima |

A sonda do auditor usou só `insiderRiskConcern`/`dataLeakageConcern`/`shadowAIConcern`,
cujo produto, FortiDLP, **está** em `PRODUCTS`
(`quickscan_secops_soccmm_v3_1_3.html:275`) — onde a assimetria é invisível
(12 = 12). Os outros seis nomes estão fora do catálogo congelado (13 entradas,
`:262-275`; nenhum dos seis aparecia no backlog antes desta nota).

**O gate de registro do `EA-68` é cego a isto**: o `D019-SOL3`
(`tests_019_curadoria.js:475-534`, alínea (a): cards menos `offered()` deve ser
vazio) rodado pelo refutador em cópia de scratch, **inalterado salvo um sinal a
mais na fixture**, falhou em 5 de 5 variantes (por exemplo "produto na visão que o
motor não ofereceu: FortiMail…"; com `dataLeakageConcern`, "FortiDLP: card diz
'validacao', motor diz undefined" — o oráculo de tier da alínea (b) é só
`computeFindings()` + `MAP`). O 14/14 verde depende de a fixture não declarar sinal:
mesma classe de amostragem que o `EA-65` registra.

O que **se sustenta** do fecho do `EA-68` (R2 §5, o fecho não é reescrito):
`colher()` removida (0 ocorrências em `ui_p52_support_v32.js`) e a lista "pode
fazer sentido" presente no DOM, hoje oculta pela 023. O que **cai** é "a oferta
vem do motor, a mesma do `offered()`".

**Decisão do proprietário, 2026-10-19: DECLARAR E SELAR** — fail-open nomeado; o
conserto é demanda futura (dois módulos, R9 §5). Declarado em
`docs_phase5/SELAGEM_V3_2_11.md`, pendência 1. Status continua `aberto`.

### Nota de 2026-10-25 — reproduzido também pela auditoria externa

Reproduzido também pela auditoria externa do Codex, 2026-10-20 (terra CX-03: `becConcern` → cards `FortiMail`, `FortiMail Workspace Security` e `FortiMail Cloud SaaS`; `__CURATION.set("FortiMail","exclude")` → `id fora do catálogo`) — nada a acrescentar à cadeia. Status continua `aberto`.

## EA-77 — o registro de bridges declara um dono que não é o dono

**Status**: `aberto`

**Aberto em**: 2026-09-28, durante a Fase 2 da demanda 022.

### O que foi medido

`.claude/verify/bridges.json` declara:

```json
"__QS_STAGE_RULER": { "owner": "ui_ux_v32.js", "nota": "régua de estágios" }
```

A implementação vive em **`ui_v32.js:991`**. O registro está errado desde que
nasceu, e o `lint-arch` não pega: ele verifica que todo `window.__*` **esteja**
registrado, não que o `owner` declarado seja quem realmente o instala.

### Por que importa mais do que parece

O registro de bridges é o mapa que a R9 §2 criou para que "um módulo por
delegação" funcione — quem vai mexer numa superfície precisa saber de quem ela é.
Dono errado manda o próximo trabalho para o arquivo errado, que é justamente o
custo que o registro existe para evitar.

### Encaminhamento

Corrigir a entrada, e — o que vale mais — dar dentes à alínea: o gate pode
conferir que o arquivo declarado como `owner` **contém** a atribuição
`window.__NOME =`. Sem isso, a próxima entrada errada nasce igual.

Ver [[EA-20]], de quem este é instância: registro que promete mais do que verifica.

## EA-78 — item sem atalho desenha uma caixa vazia que lê como checkbox

**Status**: `resolvido`

**Aberto em**: 2026-10-01, por relato do proprietário após sessão real na v3.2.10.

### O relato

> *"Voltamos com aqueles problemas das numerações limitadas para selecionar
> manualmente as opções na tela de definição de prioridades"*

### O que foi medido — e NÃO é regressão da numeração

A demanda 011 decidiu isto de propósito. `C2`: *"item sem atalho não exibe glifo;
o elemento `.key` **permanece no DOM** (alinhamento)"*. Com 15 gaps e teclas de 1
a 9, seis itens ficam sem atalho, e o gate `D011-KEY2` prova que o comportamento é
o especificado.

**O defeito é a consequência visual, que nunca foi especificada.** A caixa vem do
congelado — `.opt .key{ flex:0 0 26px; height:26px; … border … }` — e o módulo da
011 só esconde o glifo **no papel**. Na tela, o item sem atalho fica com uma caixa
vazia de 26px **com borda**, ao lado de nove com número: o leitor vê dois controles
diferentes onde há um, e o vazio lê como *checkbox desmarcado*.

### Correção

Uma regra no CSS do próprio módulo, agora também para a tela.
`visibility: hidden` preserva os 26px — que é exatamente o alinhamento que a `C2`
queria — e cobre o item **selecionado**, onde `.opt.sel .key` pintaria a caixa.

**Escrita em forma multilinha de propósito**: a regra equivalente do bloco de
impressão é a âncora **byte a byte** do mutante `D011-M20`, e uma cópia idêntica a
levaria a `ocorrencias=2`, reprovando o `IC-4` e derrubando o stage `mutation`
inteiro com a campanha correta.

**E a prosa do comentário não cita o literal do bloco de impressão**: o
`D011-PRT1(a)` exige exatamente um por arquivo e conta **por texto**, sem
distinguir comentário de regra. A primeira redação citou, e o gate contou dois —
terceira vez nesta sessão que um comentário derruba um portão.

Medido depois: `D011 NUMERAÇÃO: 6 PASS · 0 FAIL` · âncoras todas em
`ocorrencias == 1`.

## EA-79 — sem contexto declarado, a seção de apoio mostra duas leituras sem dizer que são a mesma

**Status**: `resolvido`

> **Fecho — demanda `023-leitura-unica-do-apoio`, PR #106, mesclado em 2026-10-02
> (`232448f`); registrado em 2026-10-19 pela reconfirmação da demanda 024.**
>
> **A demanda estrutural que o encaminhamento abaixo anuncia foi feita — e por uma
> QUARTA rota, nenhuma das três que a tabela abaixo mede.** O *"Vamos de C"* de
> 2026-10-01 escolheu a **estrutural** entre paliativa, remover e estrutural
> (`specs/023-leitura-unica-do-apoio/refinement.md:122`); a linha explicativa era a
> paliativa, e o encaminhamento já registra que ela foi implementada e retirada. A
> spec da 023 propôs a quarta rota: o **produto publicado conta como substituto**
> (`temProdutoPublicadoV32`, `ui_v32.js:729-745`, consultado por `hasSubstituteV32`,
> `:746-758`). É uma forma de "alargar `hasSubstituteV32`" que **não paga** o custo
> que a tabela mediu para essa rota: conta o **publicado**, não o ofertado, e "sem
> substituto" continua alcançável pela supressão da curadoria — o `D010-ARB1` foi
> reancorado, não esvaziado. A errata `E1` da 023 estendeu a arbitragem ao modo
> legado (*"Vamos com a B"*, 2026-10-02), porque a sessão do relato não declarou
> nada: o ramo legado de `renderBlocks` passa `hasSubstituteV32(null)`
> (`ui_v32.js:264`) em vez da constante `false`. Commit da W1: `7e75cce`. Vivo no
> artefato construído: `quickscan_secops_soccmm_v3_2_dev.html:6308`, `:6773-6789`,
> `:6790-6802`.
>
> **A linha de status não era a única coisa errada.** A tabela abaixo mede três
> rotas e a executada é uma quarta, que nela não está; e a entrada de
> `design-decisions.md` sobre a demanda 020 dizia *"a demanda nova a executa"* sem
> registrar quem executou nem como — fechada em 2026-10-19. O texto abaixo fica
> como foi escrito (R2 §5); este fecho é o que vale. A linha de status ficou
> `aberto` 17 dias depois do merge.
>
> **Resíduo declarado — borda B5 do refinamento da 024, decisão D3.** Com o **gate
> de suficiência fechado** o produto publicado **não** substitui (cláusula `E4` da
> 023, `ui_v32.js:732-741`): a leitura congelada fica, a visão por produto também
> publica, e as duas leituras coexistem. É deliberado — a INV-3 pelo lado da
> apresentação: *o que não é publicável não desloca o que é*. **Não reportar como
> reincidência deste achado.**

**Aberto em**: 2026-10-01, por relato do proprietário após sessão real na v3.2.10.

### O relato

> *"Não entendi essa divisão de lista e depois card em 'formas de apoio', para mim,
> está um pouco confusa essa seção e ela poderia ser mais direta"*

### O que foi medido

A arbitragem da 010 **já sabe esconder** aquela lista — `HIDE_EYEBROWS` inclui
`"Pode fazer sentido — após validação"` pelo nome. Ela não dispara porque
`hasSubstituteV32` exige um **card de capability V3.2**, que só existe com contexto
tecnológico declarado:

```
SEM contexto | hasSubstitute=false | 0 nós ocultos | lista legada VISÍVEL | 11 cards por produto
COM contexto | hasSubstitute=true  | 3 nós ocultos | lista legada OCULTA  | 11 cards por produto
```

A **visão por produto existe nos dois casos** (desde o `EA-65`/`EA-68`). Então a
redundância aparece exatamente onde o cliente é mais comum — sessão sem contexto
declarado — e some quando ele declara.

### As três rotas, todas medidas

| rota | custo medido |
|---|---|
| **remover a lista** (a demanda 020) | 5 gates da 010 caem: as fixtures `D010-F3` declaram o título **presente no DOM** |
| **alargar `hasSubstituteV32`** | o `D010-ARB1` fica **sem sujeito**: toda sessão com gap tem card por produto, logo "sem substituto" só existiria sem gap algum — e aí não há recomendação legada. A `C1` da 010 viraria tautologia |
| **explicar com uma linha** | as duas posições úteis estão fechadas: antes do título o `p52Classify` **reclassifica o nó para outra seção** (medido: foi parar em `p52-sec-gaps`); entre a lista e os cards o `D010-ARB1 (c)` reprova por **vacuidade** (medido, confirmando o aviso do autor da `fronteira()`). Sobra o fim da seção — depois do momento em que o leitor se confundiu |

### Encaminhamento

**Vira demanda própria**, por decisão do proprietário em 2026-10-01 (*"Vamos de C"*),
que **reverte a refutação da 020** registrada em `design-decisions.md`. A reversão é
dele e está amparada em medição que a 020 não tinha: aquela demanda avaliou **uma**
rota (remover) e concluiu pelo custo dela; agora são três, com o custo de cada uma.

A linha explicativa **foi implementada e retirada no mesmo ciclo**: funcionava, mas
só na posição de fim de seção, e seria removida pela demanda estrutural logo em
seguida.

Ver [[EA-20]] pelo que a rota do meio produziria — gate que promete asserção e
entrega tautologia —, e a entrada da 020 em `design-decisions.md`, que esta demanda
emenda em vez de contradizer em silêncio.

## EA-80 — a supressão da curadoria deixa a seção de apoio com o título e nada embaixo

**Status**: `transferido`

> **Fechado por declaração — portão da Fase 0 da demanda 024, 2026-10-19 (decisão
> D4).** Nenhuma linha de produto mudou. A decisão migrou para
> [`design-decisions.md`](rules/design-decisions.md) como **confirmada** (R13), com
> a errata `E20` em `specs/010-recomendacao-sem-vao/spec.md`. No rito de status
> deste arquivo, migração para `design-decisions.md` é `transferido`.
>
> **A rota mais barata do encaminhamento abaixo foi recusada, e a razão inverte o
> que o achado supõe.** O `.apoio-block` congelado é **onde o produto excluído
> mora** — é dele que `prodLegadoDe()` tira o `.prod` —, e o conjunto ofertado à
> curadoria contém os produtos daqueles blocos. Repor os blocos quando
> `cards.length === 0` **re-exibiria exatamente o que o operador acabou de
> excluir**: não é desfecho conservador, é desfazer a curadoria. A `C1` da 010
> protege o cliente contra **vão do software**; a **supressão pela curadoria** é
> decisão declarada de quem conduz a sessão, não vão. A seção com o aviso de
> supressão **é** a leitura correta daquele estado.
>
> A cadeia abaixo continua verdadeira como medição — a remoção é incondicional; o
> achado a cita em `:744`, e em 2026-10-19 ela está em
> `ui_p52_support_v32.js:738-739` — e deixou de ser defeito por decisão, não por
> correção. Aprovação: proprietário, no chat, 2026-10-19 (*"Vamos de (a), release
> com a tag"*), conforme registrada em
> `.claude/project-memory/planning-state/024-sete-defeitos-do-relatorio.json`.

**Aberto em**: 2026-10-02, medido na W1 da demanda 023.

### A cadeia

`ui_p52_support_v32.js:744` remove os `.apoio-block` legados do DOM **depois** de
migrar o `.prod` de cada um para os cards por produto — a consolidação do `EA-65`.
A remoção é **incondicional**: acontece tenha a curadoria publicado onze cards ou
zero. Com a curadoria excluindo tudo, `cards.length` é 0, `declararSupressao()`
escreve o aviso, e a seção fica com o **título congelado visível e nenhum bloco
embaixo dele**.

Medido sob a fixture `D010-F5` (que é `D010-F1` + supressão total):

```
censo da Camada 1: 1 nó — só o título. Blocos contíguos: ZERO.
mesma sessão sem supressão: título + 2 `.apoio-block` congelados
```

**É pré-existente**, e isso foi conferido no build anterior à demanda 023: a
sonda de 2026-10-02 sobre `saasAllowed=yes` + supressão total já devolvia
`[titulo, titulo, bloco t-list]`, sem os `.apoio-block`. A 023 não causou; ela
tornou o defeito **load-bearing**, porque passou a ser a visibilidade da Camada 1
o que a arbitragem devolve quando o substituto é suprimido — e o que ela devolve
está vazio.

### Por que importa

A `C1` da demanda 010 promete que *"a Camada 1 não desaparece sem substituto"*. Com
a supressão, o título fica e o **conteúdo** não — o cliente lê um cabeçalho de
recomendação sem recomendação alguma, mais um aviso dizendo que itens foram
retirados. A promessa é cumprida na letra e falha no que ela queria dizer.

### Consequência já paga

É por isto que o `D010-ARB1` foi reancorado na `D010-F3` (gate de suficiência
fechado) e **não** na fixture de supressão: a alínea `(c)` dele mede blocos
contíguos visíveis, e sob supressão não existe nenhum. Ficou registrado no
próprio gate, com a razão.

### Encaminhamento

Demanda própria ou fix-finding — o núcleo é decidir o que a seção mostra quando a
curadoria esvazia a publicação: devolver os blocos congelados (não removê-los
quando `cards.length === 0`), ou declarar que o aviso de supressão É a leitura
daquele estado. A primeira preserva a Camada 1 e é mais barata; a segunda muda o
que a `C1` da 010 promete e precisa do `product-owner`.

Ver [[EA-76]] e a errata `E19` de `specs/010-recomendacao-sem-vao/spec.md`.

## EA-81 — em modo legado sob arbitragem, o catálogo de ícones fica duplicado e oculto

**Status**: `aberto`

> **Dívida de instrumento declarada — portão da Fase 0 da demanda 024, 2026-10-19
> (decisão D5).** Fica `aberto` e fora de demanda, pelo corte do proprietário
> (nenhuma frente nova de instrumento sem pedido dele): **o cliente não vê nó
> oculto**, e o papel lê só os cards por produto — `papelHTML()`
> (`ui_p52_support_v32.js:794-802`, exposto no bridge como `printHTML`) colhe
> `:scope > .apoio-block[data-p53-sol-produto]` e o aviso de supressão, então a cópia
> congelada oculta não imprime. Isso é leitura de fonte, **não medido por execução**
> — quem confirma: `ui-engineer` com `qa-engineer`. O custo que este achado já cobrou
> — `P52-ICON1`/`P52-ICON2` cegos — foi pago dentro da 023 (rota C, guarda de tile
> não desenhado).
>
> **Risco residual nomeado, para o registro de selagem:** todo oráculo futuro que
> deduplicar por ordem de documento nesta seção tem de olhar **visibilidade** —
> senão pina a **cópia morta** (verbete em `CONTEXT.md`) e passa a medir o que
> ninguém vê.
>
> **Este achado e o [[EA-80]] são uma causa lida de duas pontas** (refinamento da
> 024, §Enquadramento): `hasSubstituteV32()` decide **ocultar** pelo que foi
> publicado; `blocosLegados()` + `decorar()` decidem **consumir** pela visibilidade
> do nó. Se um dia isso se pagar por código, os dois se desenham juntos — consertar
> um sozinho piora o outro.

**Aberto em**: 2026-10-02, medido na W4 da demanda 023.

### A cadeia

A errata `E1` da demanda 023 estendeu a arbitragem da 010 ao **modo legado**. Ali
`hideLegacyRecommendation` passa a ocultar a região congelada, e o decorador da
5.2 tem **abstenção por nó** (`ui_p52_support_v32.js:206-211`): `blocosLegados()`
recusa o que está oculto. Consequência — ele **não consome** os `.apoio-block`
congelados e monta os cards por produto ao lado, com tiles próprios.

Medido na fixture dos gates de ícone (vetor de 15 zeros, nada declarado):

```
origin/develop (8f166d3)   .icon-tile img: 9 total · 0 ocultos · 9 alts distintos
branch da 023              .icon-tile img: 29 total · 20 OCULTOS · 10 alts
                           FortiGuard: 3 (0 ocultos) → 6 (3 ocultos)
```

Vinte tiles que o cliente não vê continuam no DOM, e o catálogo inteiro existe em
duas cópias — a congelada oculta e a nova visível.

### O que isso já custou

**Cegou dois gates de outra fase.** `P52-ICON1` e `P52-ICON2` deduplicavam por
`alt|tamanho` guardando a **primeira** ocorrência em ordem de documento, sem
olhar visibilidade — e as ocultas passaram a vir primeiro. Três mutantes de
geometria (`P52-M8`, `P52-RA8`, `P52-RA8B`) foram de DETECTADO a SOBREVIVENTE:
**3/3 no controle de `origin/develop`, 0/3 no branch**, em worktree limpa de
árvore inteira.

O **gate** foi consertado na própria 023 (guarda de tile não desenhado, decisão
do proprietário em 2026-10-02 — rota C), e passou a medir o que o cliente vê. A
**causa** não: é este achado.

### Encaminhamento

Demanda própria. O núcleo é o que o decorador faz com bloco congelado **oculto**
em modo legado: hoje se abstém, e a abstenção foi desenhada no `EA-65` para o
cenário em que a arbitragem escondia região que a V3.2 não ia substituir — o que
deixou de ser verdade. As duas rotas aparentes:

- **consumir mesmo oculto** quando há card a publicar, eliminando a cópia morta;
- **não ocultar** o que o decorador vai consumir — ordenação, raio maior.

Ver [[EA-80]], que é da mesma família (o que a seção mostra quando a publicação
esvazia), e a errata `E1` de `specs/023-leitura-unica-do-apoio/spec.md`.

## EA-82 — `git commit -a` contorna o `guard-data` inteiro: o hook mede o índice num instante em que o índice ainda está vazio

**Status**: `aberto`

**Aberto em**: 2026-10-10, medido pelo orquestrador na leitura do HEAD
(`232448f`) e reproduzido por execução do próprio hook nesta worktree.

### Cadeia arquivo:linha → efeito

- **`.claude/settings.json:54`, `:58`** — `guard-data.sh` está registrado como
  `PreToolUse` com matcher `Bash`. `PreToolUse` roda **antes** do comando: no
  instante em que o hook executa, nada que o comando fosse fazer aconteceu
  ainda.
- **`.claude/hooks/guard-data.sh:12`** —
  `case "$CMD" in *"git commit"*) ;; *) exit 0;; esac`. O portão está certo: o
  hook só segue adiante em `git commit`.
- **`.claude/hooks/guard-data.sh:15`** —
  `STAGED=$(git diff --cached --name-only 2>/dev/null) || exit 0`. A única
  fonte do conjunto a inspecionar é o **índice**.
- **`.claude/hooks/guard-data.sh:16`** — `[ -z "$STAGED" ] && exit 0`. Índice
  vazio → **saída zero, sem inspecionar nada**.
- **Efeito**: `git commit -a` e `git commit -am` **estagiam no momento do
  commit** — depois do `PreToolUse`. Logo o índice está vazio quando o hook
  mede, ele sai em `:16`, e as quatro checagens de `:30` (sessão real), `:33`
  (PDF novo), `:37` (padrão de segredo) e `:40` (binário novo > 200 KB) **não
  rodam sobre arquivo algum**. O conteúdo entra no commit do mesmo jeito, sem
  nenhuma mensagem.

**O `guard-add.sh` não cobre este vetor.** `.claude/hooks/guard-add.sh:38` —
`case "$CMD" in *git*add*) ;; *) exit 0;; esac` — e `:90`, que exige o token
`add` depois do token `git`. `git commit -am` não contém `add`: o guarda sai
zero. Os dois hooks do matcher `Bash` deixam passar o mesmo comando.

### Medição, com controle positivo

Repositório descartável, um `cliente.session.json` **rastreado** e sujo na
árvore, e o **próprio** `.claude/hooks/guard-data.sh` do HEAD alimentado por
stdin:

```
estagiado     + {"command":"git commit -m x"}   → exit 2
                guard-data: commit BLOQUEADO — · sessão real: cliente.session.json
NÃO estagiado + {"command":"git commit -am x"}  → exit 0   (silêncio)
                índice: []  ·  árvore suja: [cliente.session.json]
NÃO estagiado + {"command":"git commit -am x"}  → exit 0   (guard-add.sh)
```

O **controle positivo** é o que torna a medição conclusiva: mesmo hook, mesmo
arquivo, mesmo repositório — muda só se o conteúdo passou pelo índice antes do
`PreToolUse`. E o atalho de fato carrega o arquivo: `git commit -am` seguido de
`git show --stat` lista `cliente.session.json` no commit resultante.

### O que isto não é

Não é desenho mal feito do hook. As checagens de `:30`–`:41` estão corretas, e o
controle positivo prova que funcionam. O problema é **quando** o hook vê, não o
que ele faz com o que vê — e a ordem de execução de um `PreToolUse` não é
observável de dentro do próprio script. Um hook que roda antes do comando não
tem como ler um índice que o comando ainda vai escrever.

### Por que esta é a de maior consequência

A R11 (`.claude/rules/evidence-intake.md`) protege **dado de cliente real** —
nome de parte, teor de documento, assessment — e sua metade mecânica é este
hook. A metade normativa manda commitar por caminho nominal (R11 §3; o `EA-37`
construiu o `guard-add` exatamente para isso). Hoje a metade mecânica é
contornada pelo atalho mais comum do git.

### Encaminhamento

`fix-finding`, dono `build-engineer`. Duas rotas aparentes, nenhuma decidida
aqui:

- **medir o conjunto que o comando VAI estagiar**, não o que já está: em
  `-a`/`-am`, a união do índice com os rastreados modificados
  (`git diff --name-only`), lendo o conteúdo da **árvore** em vez de `:0:<f>`;
- **recusar `-a`/`-am`** em `git commit`, pelo mesmo argumento do `EA-37` —
  staging de escopo amplo já é proibido por regra, e o caminho nominal cobre
  100% do caso legítimo.

A segunda rota tem a forma do guarda que já existe e custo medido menor; a
primeira preserva o atalho. Ver [[EA-83]], que pergunta se este hook **chega a
ser despachado**, e o `EA-37`, que construiu o par deste guarda.

### O que foi feito (2026-10-11) — status **inalterado**

O veredito de fecho é do `qa-engineer` (R5); este registro só descreve o que
existe no código, com os commits citáveis. Conserto em **`3521230`**
(`fix(EA-82): guard-data recusa git commit que não passa pelo índice`) e repin
do registry em **`8878d6a`**.

Rota escolhida: **recusar**, a segunda das duas do encaminhamento acima.
`.claude/hooks/guard-data.sh:21` alargou o pré-filtro barato;
`:67-167` tokeniza o comando com `shlex`, remove corpo de heredoc e decide pela
gramática do git quem é o subcomando; `:169-187` recusa com `exit 2` e mensagem
que nomeia o motivo e o caminho nominal da R11 §3. Auto-exclusão nominal
(R10 §10) em `:46-50`: prosa que **cita** a forma proibida não aciona o guarda —
este bloco do backlog é um dos citadores.

**Nota 1 — o conserto cobre escopo maior que a cadeia literal deste achado.**
Além de `-a`/`--all`, recusa também pathspec após `--`
(`guard-data.sh:148-149`): `git commit -m x -- <pathspec>` commita a árvore
ignorando o índice — **vetor gêmeo**, mesma causa raiz, input diferente. Foi
**medido pelo `build-engineer`**, não inferido. Registra-se aqui como escopo
maior do conserto, e **não** como id novo: a proposição é a mesma.

**Nota 2 — residual declarado, com o endereço da declaração.** Fica fora da
cobertura: pathspec **posicional sem `--`** (`git commit arquivo -m x`; e
`git commit -ma x`, que o git lê como `-m a` mais o pathspec `x`), além de
`-i`/`-o` com caminho posicional. Distinguir pathspec de valor de opção exigiria
a tabela completa de opções do git, e errar ali é **falso positivo em commit
legítimo**. O residual está declarado em comentário no próprio guarda —
**`.claude/hooks/guard-data.sh:52-56`** — e não só neste registro.

**O que o conserto NÃO alcança**, e por isso tem id próprio: [[EA-84]] (o
guarda mede o índice da pasta primária, mesmo em commit nominal) e [[EA-85]] (o
guarda falha aberto sem python). Nenhum dos dois é efeito deste conserto, e
nenhum dos dois é resolvido por ele.

## EA-83 — ninguém mediu se o harness despacha hook com matcher `Bash`: os dois guardas da R11 ficam inertes juntos, e o fecho do `EA-37` faz a pergunta parecer respondida

**Status**: `aberto`

**Aberto em**: 2026-10-10, medido pelo orquestrador nas configurações do HEAD
(`232448f`).

### Cadeia arquivo:linha → efeito

- **`.claude/settings.json:53-65`** — um **único** grupo `PreToolUse` com
  `"matcher": "Bash"` (`:54`) carrega os dois guardas: `guard-data.sh` (`:58`)
  e `guard-add.sh` (`:62`). O outro grupo (`:41`) é `"matcher": "Write|Edit"`,
  com `guard-boundary.sh`/`guard-tdd.sh`.
- **Efeito do agrupamento**: o despacho dos dois é **comum**. Se o matcher
  dispara, os dois disparam; **se não dispara, os dois estão inertes juntos** —
  e aí a R11 fica sem metade mecânica nenhuma e o `EA-37` volta a depender de
  disciplina. Uma condição, dois guardas: a pergunta é **uma só para os dois**.
- **`.claude/BACKLOG.md:3371`** — `grep -a 'matcher'` no backlog dá **uma**
  ocorrência em 7193 linhas, e é a linha do fecho do próprio `EA-37`. O
  despacho nunca foi objeto de achado nem de medição registrada.
- **`.claude/BACKLOG.md:3374-3378`** — o que o fecho do `EA-37` provou, na
  redação dele: o hook **existe**, está **registrado** em `settings.json:62`, e
  "alimentado com `{"tool_name":"Bash","tool_input":{"command":"git add -A"}}`,
  devolve exit 2". Isso é um **payload entregue por stdin ao script** — mede a
  **lógica do script**, que era a metade em dúvida em 2026-09-13.
- **O que o fecho não tocou**: se o harness, diante de uma chamada real da
  ferramenta `Bash`, **invoca** o grupo de `:53-65`. Nenhum registro afirma
  isso, em nenhuma data.

### Por que o registro atual piora o problema

O `EA-37` está **`resolvido`** (`.claude/BACKLOG.md:3318`) desde a varredura de
2026-09-13, e o fecho encerra com "nenhum resíduo foi identificado na
varredura". Para quem lê o registro, a defesa mecânica está provada — e a
próxima pergunta não é feita. **Verde falso é pior que vermelho.**

Esta é a forma exata da família `EA-31` (`aberto`, `.claude/BACKLOG.md:2492`),
"o registro da prova não é comparado com a execução da prova", e do `EA-39`
(`:3543`), onde "0 merges" não distinguia "não há" de "não consegui caminhar".
O `EA-5` (`:764`) é a origem da forma do argumento — "o número não distingue
não executei de executei e escapou" — e está **`refutado`**: o que sobrevive
dele é a família, não o achado.

**Isto não reabre o `EA-37`** (R2 §5: refutação e fecho registrados
permanecem). O `EA-37` cobrava a existência do hook, e o hook existe — aquilo
foi medido e está certo. Este achado tem id próprio porque cobra outra
proposição, que nunca foi medida.

### Encaminhamento

`fix-finding`, dono `build-engineer`, e o produto é uma **medição** antes de
qualquer correção: provar por execução que uma chamada real da ferramenta
`Bash` dispara o grupo `:53-65`. O resultado decide o resto —

- **despacha**: registrar a prova com a execução citável e fechar; a R11 tem
  metade mecânica viva, e o `EA-82` passa a ser o único vão.
- **não despacha**: os dois guardas são prosa executável que nunca executa — a
  R11 e o `EA-37` ficam sem defesa mecânica. A reabertura do `EA-37`, nesse
  caso, é decisão de quem pode tomá-la, não efeito colateral deste registro.

Um **controle negativo** é indispensável no desenho dessa medição: um guarda
que nunca sai zero, ou um comando que ele deve barrar e que o harness deixaria
passar. Sem isso, "não houve bloqueio" não distingue "despachou e aprovou" de
"não despachou" — que é precisamente o defeito que este achado descreve, e
seria medi-lo com o instrumento que ele acusa. Ver [[EA-82]], o outro vão da
mesma defesa, e [[EA-31]].

### O que foi feito (2026-10-11) — status **inalterado**

A medição que este achado pede **ainda não existe**: ela é do proprietário, em
sessão nova. O que foi entregue é o **instrumento** — commit **`0fff362`**
(`fix(EA-83): instrumento de despacho — os guardas da R11 registram a própria
invocação`) e repin em **`13d6510`**.

- **`.claude/hooks/lib/common.sh:70-89`** — `log_dispatch`: uma linha por
  (guarda, sessão) em `.claude/hooks/dispatch.log`, com timestamp UTC, nome do
  guarda, id de sessão, `$0` e `$PWD` (`:86`). Deduplicação por chave (`:81`),
  teto duro de 400 linhas rotacionando para 200 (`:82-85`), tudo em subshell
  com saídas em `/dev/null` e `|| true` (`:88`) — falha de registro **não**
  silencia o guarda. Sem python e sem jq: só `date` e `grep`.
- **`.claude/hooks/guard-data.sh:13`** e **`.claude/hooks/guard-add.sh:38`** —
  a chamada é a **primeira** instrução de cada guarda, antes de qualquer saída
  antecipada: o log existir é evidência **positiva** de invocação, que é o
  controle que a cadeia acima exige (ausência de bloqueio não distingue
  "despachou e aprovou" de "não despachou").
- O arquivo é **ignorado pelo git** (`.gitignore:5`, `*.log`) — R7 §3:
  verificação nunca escreve na árvore versionada.

**O que o instrumento não prova** está declarado nele mesmo
(`lib/common.sh:65-69`): que o `exit 2` chega ao usuário e aborta a chamada
(despacho ≠ enforcement); que a decisão do guarda está correta; que o matcher
cobre toda forma de chamada de `Bash` — só as que ocorreram.

**Pendências que condicionam a medição**, ambas com id próprio:

- [[EA-87]] — a cópia que o harness executa é a da pasta primária, e a branch em
  que ela está hoje **não contém `log_dispatch`** (`grep -c` → `0` em
  `guard-data.sh` e em `lib/common.sh`). Medir a partir dali hoje devolveria
  "log ausente" por falta do instrumento, não por falta de despacho — a mesma
  ambiguidade que este achado denuncia. Medir exige a primária numa branch que
  carregue o instrumento.
- [[EA-84]] — `log_dispatch` usa o mesmo `project_root()` e grava em
  `"$raiz/.claude/hooks/dispatch.log"` (`lib/common.sh:73-75`): o log aparece no
  clone **primário**, não na worktree de trabalho. Quem for conferir precisa
  saber onde procurar.

Hoje **não existe `dispatch.log` em nenhum dos dois clones** — conferido nesta
sessão, e sem valor probatório pelo primeiro item acima. Status segue `aberto`
até haver execução citável.

## EA-84 — o `guard-data` resolve a raiz do repositório pelo cwd do próprio processo: num commit disparado de qualquer worktree, ele inspeciona o índice da pasta PRIMÁRIA

**Status**: `aberto`

**Aberto em**: 2026-10-11. Devolvido pelo `build-engineer` no encaminhamento do
`EA-82`/`EA-83` e **conferido pelo orquestrador na leitura do código** antes de
virar achado.

### Cadeia arquivo:linha → efeito

- **`.claude/settings.json:54`, `:58`** — o grupo `PreToolUse` de matcher
  `Bash` invoca `bash "$CLAUDE_PROJECT_DIR"/.claude/hooks/guard-data.sh`. O
  script executado é o da **pasta primária**, e o processo do hook nasce com o
  cwd nela — nunca na worktree onde o comando do usuário vai rodar.
- **`.claude/hooks/lib/common.sh:15`** —
  `project_root() { git rev-parse --show-toplevel 2>/dev/null; }`. Não recebe
  argumento e não consulta o payload: resolve **do cwd do processo**.
- **`.claude/hooks/guard-data.sh:189`** —
  `cd "$(project_root)" 2>/dev/null || exit 0`. O guarda se muda para a raiz
  assim resolvida.
- **`.claude/hooks/guard-data.sh:190`** —
  `STAGED=$(git diff --cached --name-only 2>/dev/null) || exit 0`: o índice
  medido é o da raiz onde o `cd` caiu.
- **`.claude/hooks/guard-data.sh:191`** — `[ -z "$STAGED" ] && exit 0`.
- **Efeito**: um `git commit` disparado de outra worktree é inspecionado
  **contra o índice de um repositório que não é o dele** — índice alheio, em
  geral vazio, logo saída zero silenciosa em `:191`. As quatro checagens de
  `:205` (sessão real), `:208` (PDF novo), `:212` (padrão de segredo) e `:215`
  (binário novo > 200 KB) não rodam sobre arquivo algum.

**O erro é simétrico, e a outra ponta também é defeito**: se a primária tiver
algo estagiado, o commit da worktree é julgado por conteúdo que **não está
nele** — falso positivo possível, barrando commit legítimo por causa de um
índice de terceiros. A direção do erro depende do estado de um repositório que
quem commita não está olhando.

### Por que é independente do `EA-82` e do `EA-83`

- **Do `EA-82`**: ali o vão é a **forma do comando** (`-a`/`-am`, pathspec sem
  passar pelo índice) e a causa é ordem de execução. Aqui o comando pode ser
  perfeitamente nominal — `git add <caminho> && git commit -m "…"`, o que a
  R11 §3 manda — e o guarda ainda mede o repositório errado.
- **Do `EA-83`**: ali a pergunta é se o harness **despacha** o grupo. Aqui o
  despacho pode ser perfeito: o hook roda, executa todas as checagens, e olha
  para o lugar errado. Despachar e acertar o alvo são proposições diferentes.

### O custo, que é concreto

A R14 (`.claude/rules/git-flow.md`, §Worktrees) prescreve **uma worktree por
demanda** para conversas simultâneas, e este repositório usa isso por desenho —
`.claude/worktrees/` é ignorado pelo git exatamente para isso. Toda demanda que
trabalhou em worktree commitou com a metade mecânica da R11 apontada para o
repositório errado. Não é hipótese de uso raro: é o modo de trabalho descrito
na própria regra.

### O mesmo defeito contamina o instrumento do `EA-83`

`.claude/hooks/lib/common.sh:73-75` — `log_dispatch` chama o mesmo
`project_root()` e escreve em `"$raiz/.claude/hooks/dispatch.log"`. Logo o log
de despacho de uma sessão enraizada na primária aparece **na primária**, não na
worktree de trabalho — quem for conferir a prova do `EA-83` precisa saber em
qual clone procurar. Ver [[EA-83]].

### Gatilho de falsificação

Esta cadeia tem uma premissa única e verificável: **o cwd do processo do hook é
a pasta primária**. Se fosse a worktree, `git rev-parse --show-toplevel`
devolveria a worktree e não haveria achado. O instrumento que decide isso já
existe e já grava o dado: `.claude/hooks/lib/common.sh:86` registra `$PWD` na
linha do `dispatch.log`. Primeira linha de log escrita por um copy que carregue
o instrumento resolve a pergunta por execução — e refuta este achado se o
`$PWD` registrado for a worktree.

### Encaminhamento

`fix-finding`, dono `build-engineer`. Rotas **aparentes, nenhuma decidida
aqui**:

- derivar a raiz do **comando**, não do processo: se o payload do `PreToolUse`
  carregar um campo de cwd, `project_root` passa a aceitá-lo (hoje nenhum hook
  lê campo de cwd — `grep -rn 'cwd' .claude/hooks/` não acha nada, e se o campo
  existe no payload é **pendência de verificação**, não fato);
- recusar o que não sabe julgar, pelo mesmo argumento do `EA-82`: se a raiz do
  comando não for determinável, barrar em vez de aprovar — o que esbarra na
  tensão de direção que o [[EA-85]] registra (guarda que falha aberto vs.
  guarda que barra tudo no ambiente degradado).

A escolha entre aprovar e barrar no caso indeterminado **não é do agente**: é a
mesma decisão de proprietário que o [[EA-85]] isola. Ver [[EA-82]] e o `EA-37`,
que construiu o guarda irmão.

### Nota de 2026-10-20 — a família cresceu: não é só o `guard-data`

O defeito está em `project_root()` (`.claude/hooks/lib/common.sh:15`), que **todos**
os hooks que resolvem a raiz usam, não só o `guard-data`. Medido em `0bd677c` por
`grep -n 'project_root' .claude/hooks/*.sh`: `guard-boundary.sh:15`,
`guard-data.sh:189`, `guard-tdd.sh:19`, `post-turn-verify.sh:21` e
`state-eval.sh:10` fazem `cd "$(project_root)"` e passam a ler a árvore daquele
diretório. Em 2026-10-19 o `guard-tdd` leu a worktree errada (relato do
orquestrador, vindo da auditoria; **não reexecutado por mim**), o que confirma, por
execução, a premissa única do gatilho de falsificação acima: o cwd do processo do
hook não é a worktree. Consequência para a rota "derivar a raiz do comando": ela
vale para os cinco hooks, não para um. Dono: `build-engineer`. Status continua
`aberto`.

## EA-85 — o `guard-data` falha ABERTO quando o python não está disponível: no ambiente degradado em que mais se precisa dele, o guarda aprova tudo em silêncio

**Status**: `aberto`

**Aberto em**: 2026-10-11. Devolvido pelo `build-engineer` no encaminhamento do
`EA-82`. **Pré-existente**: o conserto do `EA-82` não introduziu nem removeu
este comportamento.

### Cadeia arquivo:linha → efeito

- **`.claude/hooks/lib/common.sh:13`** —
  `PYBIN=python3; command -v python3 >/dev/null 2>&1 || PYBIN=python`. Se
  nenhum dos dois existe no PATH, `PYBIN` fica valendo `python` e **toda**
  invocação dele falha. Não há checagem posterior: o valor é usado como se
  fosse válido.
- **`.claude/hooks/lib/common.sh:18-32`** — `payload_get` é implementado **em
  python**. Sem python, o hook não consegue nem ler o comando que deveria
  julgar.
- **`.claude/hooks/guard-data.sh:16`, `:21`** — `CMD` sai vazio e o pré-filtro
  `case "$CMD" in *git*commit*) ;; *) exit 0;; esac` cai no `*`: **saída zero
  aqui**, antes de qualquer checagem.
- **`.claude/hooks/guard-data.sh:67-172`** — ainda que `CMD` chegasse, `ANALISE`
  sairia vazia e `case "$(… head -1)" in commit) ;; *) exit 0;; esac` (`:169`)
  dá a **segunda saída zero**.
- **`.claude/hooks/guard-data.sh:193-221`** — e com `FALHAS` vazia, `:221`
  `[ -z "$FALHAS" ] && exit 0` dá a **terceira**.
- **Efeito**: três pontos de saída, todos no mesmo sentido. Sem python, o
  guarda da R11 aprova qualquer commit sem emitir uma linha — e o silêncio é
  indistinguível do silêncio de um commit limpo.

**O que o conserto do `EA-82` mudou aqui (e o que não mudou)**: não mudou a
direção — o guarda já falhava aberto antes. Mudou a **superfície**: a decisão
"isto é mesmo um `git commit`?" passou a vir da análise em python
(`:67-172`), que antes era usada só para listar achados sobre o índice. A
dependência de python ficou carregando uma decisão a mais. É observação de
escopo, não achado novo.

### A tensão, que é real e não se resolve aqui

Um guarda **fail-closed** barraria **todo** commit num ambiente sem python —
inclusive commit de documentação, inclusive o commit que consertaria o
ambiente. Um guarda **fail-open** é o que existe hoje: não guarda exatamente
quando o ambiente está quebrado. Há rotas intermediárias aparentes
(degradar para uma checagem em shell puro sobre os nomes dos arquivos
estagiados; barrar só as classes detectáveis sem python; exigir ack nominal),
e nenhuma delas é escolha do `doc-writer` nem do orquestrador.

**Quem decide a direção é o proprietário.** Se a decisão for "fail-open é o
desenho", o destino do registro não é fecho e sim `transferido` para
[`design-decisions.md`](rules/design-decisions.md) (R13), com a fonte da
confirmação — e aí a R11 passa a declarar, por escrito, que sua metade
mecânica é condicional ao ambiente.

### O que isto não é

Não é a família do `E6` ("SKIP silencioso é FAIL", R10 §2): aquilo é sobre
**gate** de pipeline, que tem stage 0 (`env-doctor`) para declarar ambiente
antes de rodar. Um hook de sessão não tem stage 0 — roda no ambiente que a
sessão tiver, sem ninguém ter validado nada. A semelhança é de forma; a
mitigação do `E6` não alcança este caso. O que o `env-doctor` faz (FAIL em
`python < 3.10`, `.claude/verify/env_doctor.py:9`) protege o **pipeline**, não
o hook.

### Encaminhamento

`fix-finding`, dono `build-engineer`, **mas o portão é do proprietário**: a
direção do erro (aberto vs. fechado) é decisão dele, e sem ela não há conserto
a executar. Ver [[EA-82]], cujo conserto escolheu recusar no caso que não sabia
julgar, e [[EA-84]], que tem exatamente a mesma pergunta pendente para o caso
"raiz do comando indeterminável".

## EA-86 — o `env-doctor` passa com `node_modules` ausente: o stage 0 declara node e Chromium, e não olha a dependência INSTALADA — 3 FAIL com sintomas que nomeiam a coisa errada

**Status**: `aberto`

**Aberto em**: 2026-10-11. Devolvido pelo `build-engineer`, que mediu a
consequência ao vivo; a lacuna no verificador foi **conferida pelo
orquestrador** e a tradução enganosa do sintoma foi conferida no fonte.

### Cadeia arquivo:linha → efeito

- **`.claude/verify/pipeline.yaml:17-19`** — `env-doctor` é o **stage 0**:
  `python .claude/verify/env_doctor.py`. A R7 §4
  (`.claude/rules/determinism.md`) lhe dá o papel: "dependência de ambiente é
  declarada, nunca implícita — valida node/python/git/Chromium ANTES das
  suítes".
- **`.claude/verify/env_doctor.py:43-69`** — verifica o **binário** node:
  presença no PATH (`:44-45`, FAIL) e versão contra `engines` do
  `package.json` (`:69`, WARN).
- **`.claude/verify/env_doctor.py:71-80`** — Chromium: `CHROME_PATH` ou cache
  `ms-playwright`, ausência vira WARN nomeado (KI-3, R13).
- **Lacuna**: em 99 linhas, **nenhuma** menciona `node_modules` ou as
  dependências instaladas. `grep -rn 'node_modules' .claude/verify/` devolve
  **duas** ocorrências, ambas em **prosa de registro** dentro de
  `mutation-matrix.json:842` e `:864` — nenhuma em verificador. O binário é
  validado; o que `npm ci` instala, não.
- **Efeito**: worktree nova não traz `node_modules` (é ignorado pelo git, logo
  `git worktree add` não o copia) e o pipeline roda inteiro nesse estado, sem
  que o stage 0 diga uma palavra.

### Medição (pelo `build-engineer`, ao vivo, em worktree nova)

```
sem node_modules   bash .claude/verify/run.sh  → 15 PASS · 3 FAIL
                   22 suítes: "sem contagem na última linha: (sem saída)"
                   regra-morta: "instrumento ausente"
npm ci --no-audit  bash .claude/verify/run.sh  → 18 PASS · 0 FAIL
```

Entre as duas execuções **não se tocou uma linha de código** — a diferença é
só a árvore de dependências instalada. Um pipeline inteiro vermelho por motivo
que nenhum stage nomeia.

### O sintoma engana por construção (conferido no fonte, nesta sessão)

- **`.claude/verify/check_suites.py:28`, `:31`** — a suíte é julgada pela
  última linha não vazia do stdout; sem stdout, o relatório imprime
  `sem contagem na última linha: (sem saída)`. Vinte e duas vezes. A mensagem
  descreve o **formato da saída**, nunca a causa: o processo nem subiu.
- **`.claude/verify/regra_morta.js:46`** — `const { JSDOM } = require("jsdom")`.
  Sem `node_modules`, esse `require` estoura `MODULE_NOT_FOUND` **dentro** do
  instrumento.
- **`tests_014_regra_morta.js:598-601`** — o `catch` traduz **qualquer**
  `MODULE_NOT_FOUND` em
  `"instrumento ausente: .claude/verify/regra_morta.js (T040, wave 4, owner build-engineer) — NÃO EXECUTADO, e isso é FAIL, não SKIP"`.
  O instrumento está **presente no disco e em HEAD**: o que falta é a
  dependência transitiva dele. A mensagem acusa o artefato errado e endereça o
  dono errado, e quem a lê vai procurar um arquivo que está lá.

O desenho de `tests_014_regra_morta.js:591-592` está certo e é exemplar
("Ausência é FAIL NOMEADO, nunca SKIP silencioso (R10 §2)") — o defeito é que
**nomeia errado**: `MODULE_NOT_FOUND` do próprio instrumento e
`MODULE_NOT_FOUND` de uma dependência dele são causas distintas colapsadas numa
frase.

### Por que é achado, e de qual família

É a família do `E6` citado pela R7 §4 e pela R10 §2 — ambiente ausente que não
vira declaração nomeada. Aqui com um agravante: não há SKIP silencioso, há
**FAIL alto e eloquente apontando para o lugar errado**, que custa investigação
humana. O stage 0 existe precisamente para que isso não aconteça.

### Encaminhamento

Duas correções **separáveis, de donos diferentes** — e a segunda não é do
`build-engineer`:

- **`env_doctor.py`** (dono `build-engineer`): verificar a presença de
  `node_modules` e das dependências que o pipeline realmente importa (`jsdom`,
  `playwright`), com FAIL ou WARN **nomeado** no stage 0 — direção (FAIL ou
  WARN) a definir com quem decide, já que `npm ci` é pré-condição documentada
  no `CLAUDE.md` §Comandos.
- **`tests_014_regra_morta.js`** (dono `qa-engineer`, R5): distinguir, no
  `catch` de `:598-601`, "o instrumento não existe" de "uma dependência do
  instrumento não resolveu" — são causas diferentes, com donos diferentes.
  Alteração de suíte **não é do `build-engineer` nem do `doc-writer`**.

## EA-87 — a configuração de hook é versionada, e a que vale é a da pasta PRIMÁRIA: na branch em que ela está hoje, o `guard-add` não está registrado — nem existe

**Status**: `aberto`

**Aberto em**: 2026-10-11. Devolvido pelo `build-engineer`; **medido pelo
orquestrador** na pasta primária e conferido contra as branches pelo
`doc-writer` ao registrar.

### Cadeia arquivo:linha → efeito

- **`.claude/settings.json:53-65`, nesta worktree** (`fix/r11-guard-data-inerte`)
  — um grupo `PreToolUse` de `"matcher": "Bash"` (`:54`) com **dois** guardas:
  `guard-data.sh` (`:58`) e `guard-add.sh` (`:62`).
- **O mesmo arquivo na pasta primária** (`C:\Projetos\QuickScan-SOC-CMM\phase5-009`,
  branch `chore/fecho-013-done`, HEAD `e38d4d5`) — o grupo `Bash` abre em
  `:53-54` e fecha em `:61`, com **um só** guarda: `guard-data.sh` (`:58`).
  Nenhuma linha cita `guard-add.sh`.
- **Mais que não registrado: ausente.** Naquela branch,
  `ls .claude/hooks/guard-add.sh` → `No such file or directory`, e
  `git cat-file -e HEAD:.claude/hooks/guard-add.sh` →
  `does not exist in 'HEAD'`. O guarda nasceu em **`58372d6`** (2026-09-04,
  `fix(EA-37): guard-add — hook mecânico contra git add -A/./--all`) e esse
  commit **não é ancestral** de `chore/fecho-013-done`
  (`git merge-base --is-ancestor` → falso). Em `develop` e `origin/develop` o
  script existe e o registro tem 1 ocorrência — conferido nas duas refs.
- **Efeito**: o harness executa
  `bash "$CLAUDE_PROJECT_DIR"/.claude/hooks/<guarda>.sh`, isto é, a
  **configuração e o código da pasta primária**. Como ambos são versionados, a
  metade mecânica da R11 vale o que a **branch da primária** tiver — não o que
  a branch de trabalho tem. Numa sessão enraizada ali, o `guard-add` não está
  inerte por matcher: está **não instalado**, e o `EA-37` volta a depender de
  disciplina, **independentemente de despacho**.

### Consequência para a leitura do `EA-83`

A premissa do [[EA-83]] — "os dois guardas ficam inertes juntos, uma condição
para dois" — vale **onde os dois estão registrados**. Onde um não está, a
inferência quebra nos dois sentidos:

- **ausência de linha do `guard-add` no `dispatch.log` não diz nada** numa
  sessão enraizada na primária de hoje: o script não está lá para registrar
  nada. A linha a procurar é a do **`guard-data`**;
- e a recíproca: um `dispatch.log` com só a linha do `guard-data` é
  **compatível com despacho perfeito** do grupo — não é sinal de matcher
  parcial.

Agravante conferido nesta sessão, que torna a medição do `EA-83` **impossível a
partir da primária de hoje**: a cópia de `guard-data.sh` e de
`lib/common.sh` daquela branch **não contém `log_dispatch`**
(`grep -c log_dispatch` → `0` nos dois arquivos). O instrumento do `EA-83` está
na branch de trabalho; quem executa é a cópia da primária. Hoje não há
`dispatch.log` em nenhum dos dois clones — e esse "nenhum" é exatamente o
silêncio ambíguo que o `EA-83` descreve, agora com causa nomeada: o
instrumento ainda não está na branch que o harness carrega. Medir exige a
primária **em uma branch que carregue o instrumento**.

### O que isto não é

Não é defeito do `settings.json` desta worktree, que está correto, nem
reabertura do `EA-37`, cujo hook existe e foi medido (R2 §5). É uma proposição
diferente: **qual cópia da configuração o harness obedece**, e o que isso faz
com a garantia quando as branches divergem. Da mesma família do [[EA-84]] —
ambos descendem do mesmo fato: o que executa vem da pasta primária, não da
worktree.

### Encaminhamento

`fix-finding`, dono `build-engineer`, com uma pergunta de desenho que **não é
do agente**: se a defesa mecânica da R11 deve depender da branch em que a pasta
primária estiver parada. Rotas aparentes, nenhuma decidida aqui — manter a
primária sempre em `develop` como rito operacional; um verificador que compare
a configuração efetiva da primária contra a de `develop`; ou mover a
configuração dos guardas para fora do versionamento por branch. A escolha é do
proprietário/`tech-lead`.

## EA-88 — o portão da Fase 6 não tem observável: o campo que registra o aceite não é declarado em schema nenhum, e o veredito pode morar em cinco lugares diferentes

**Status**: `aberto`

**Aberto em**: 2026-10-16. Escrito pelo `product-owner` na Fase 6 **retroativa**
da demanda 021 — condição (1) do aceite dele —, com o **censo das 18 demandas
ampliado pelo orquestrador** e reconferido por execução pelo `doc-writer` ao
registrar, na worktree `fix/aceite-021` (de `origin/develop`, HEAD `7d5aef2` + o
commit do aceite). As origens são independentes: o PO escreveu **sem shell**, por
leitura, e declarou esse limite no próprio campo; o orquestrador mediu o censo; eu
remedi cada número antes de gravar.

### Cadeia arquivo:linha → efeito

- **`.claude/rules/sdd.md:18`** — a tabela da máquina de fases dá à Fase 6 um
  único portão: *"aceite do PO"*. **`:38`** (D3) fecha a forma dele: *"Nenhum
  agente escreve em registro de aceitação: agente **reprova ou declara 'não
  encontrei objeção'**"*. **`:6-8`** diz onde o estado mora e quem o confere —
  planning-state, *"escrito pela skill, validado pelo stage `state`"*.
- **`.claude/templates/planning-state.schema.json`** — `grep -i aceite` →
  **0 ocorrências** (medido). O bloco `properties.validate` declara **um** campo,
  `conformance`; o `required` do topo tem quatro chaves (`demanda`, `phase`,
  `spec_dir`, `branch`); não há `additionalProperties: false`. **O campo que
  registra o único portão da Fase 6 não é declarado**, e qualquer nome passa.
- **`.claude/verify/check_state.py:34-53`** (58 linhas no total) — o stage `state`
  valida **à mão**: `required` literal (`:34`), enum de fase (`:37`), coerência
  slug↔arquivo (`:39`), `spec_dir` existente (`:41`), enum de status (`:43-46`),
  a R3 (`:48-51`) e `done` sem `pr_url` (`:52-53`). **Nenhuma cláusula olha o
  aceite** — e o arquivo **nunca abre o schema**, o que o próprio docstring
  declara (`:4-6`: *"Validação estrutural sem dependência externa (sem jsonschema
  lib)"*).
- **`grep -rln 'aceite_po\|aceite_de_intencao' .claude/verify/ .claude/hooks/
  .claude/skills/` → saída vazia** (medido). Nenhum gate, nenhum hook, nenhuma
  skill nomeia o campo. As quatro ocorrências da palavra "aceite" sob
  `.claude/verify/` (`check_baseline.py:49`, `check_mutation.py:69` e `:464`,
  `check_mutation_coverage.py:23`) são comentário em outro sentido — *"critérios
  de aceite"*.
- **`.claude/skills/new-demand/SKILL.md:64`** — *"`product-owner`: aceite de
  intenção contra o `refinement.md`"*. A skill nomeia **o ato**; não nomeia o
  campo, nem a forma, nem o vocabulário. Quem escreve o estado escolhe o nome.
- **Efeito**: o stage `state` não pode reprovar o aceite **por ausência**, nem
  **por forma**, nem **por sujeito errado**. O veredito da Fase 6 pode migrar para
  `notes`, pode virar a fala do proprietário no campo do PO, pode virar uma
  palavra que a D3 proíbe um agente de escrever, ou pode não existir — e **nada
  fica vermelho**. Quem descobriu isto foi um pedido no chat, não um portão.

### O renomeio que apagou o sujeito

O campo mudou de nome entre as demandas e **o nome novo deixou de nomear quem
fala**:

- `aceite_po` — 010, 011, 015, 016, 017;
- `aceite_de_intencao` — 019, 020, 021, 022, 023.

`aceite_po` diz **quem** fala; `aceite_de_intencao` diz só **o objeto**. Como nada
declara o campo, o renomeio não exigiu decisão, não deixou errata e não acendeu
nenhum stage. Em 010, 011 e 015 o campo aparece ainda em **dois blocos irmãos** —
`validate` **e** `validacao` (PT) —, o que multiplica os lugares onde o veredito
pode estar: o `check_tdd.py` só lê `validate`.

### Censo das 18 demandas — medido em 2026-10-16, nesta worktree

Censo **completo** (18 de 18 planning-states, não amostra), por
`grep -o '"aceite[a-z_]*"'` em cada arquivo mais leitura do valor:

| estado do campo | demandas | n |
|---|---|---|
| **campo não existe** | 003, 007, 008, 009, 012, 013, 014, 018 | **8** |
| `aceite_po` com veredito canônico e a medição que o sustenta | 010, 011, 015, 016, 017 | **5 de 5** |
| `aceite_de_intencao` bem-formado (cita a D3) | 019 | 1 |
| **a fala do proprietário** ocupando o campo do PO | 020 | 1 |
| a palavra única **`aceito`** — a que a D3 proíbe um agente de escrever | 022 | 1 |
| `sem objecao` no campo, com o aceite íntegro jogado em `notes` | 023 | 1 |
| **sem veredito** por ~3 semanas, em demanda `done` e mesclada | 021 (corrigido em 2026-10-16) | 1 |

Medições que sustentam as quatro últimas linhas, todas conferidas no fonte:

- **020** — o campo contém a transcrição do chat: *"Proprietario no chat,
  2026-09-24: 'Nao remover a lista, fecha a 020 como refutada'"*. É aceite **do
  proprietário** ocupando o lugar onde a D3 põe a declaração do agente.
- **022** — o valor é a string `aceito`, **6 caracteres**, sem data, sem autor,
  sem medição. É exatamente a forma que a D3 proíbe (`sdd.md:38`).
- **023** — o campo tem `sem objecao` (11 caracteres); o aceite íntegro —
  *"ACEITE DE INTENCAO: nao encontrei objecao. A necessidade do refinamento
  era…"*, com a medição e o *"O ACEITE DE FASE E DO PROPRIETARIO, no chat (R4)"* —
  está dentro de `validate.notes`, campo que o schema também não declara.
- **021** — **precisão do registro**: o campo não estava *vazio*; estava **ocupado
  por um não-veredito**. Em `7d5aef2` lia-se *"Pendente do proprietario. O produto
  entrega o que a Fase 0 pediu: 4 -> 15 gaps com caminho de apoio…"*, escrito no
  fecho de **2026-09-26** (`45ecb33`, `phase: done`) e assim permanecido até
  **2026-10-16** — 20 dias, com o PR #101 já mesclado. É o caso que mais interessa
  ao achado: um não-veredito preenche o campo e passa em tudo.

### Por que não é o `EA-33`, e a distinção é do `product-owner`

O [[EA-33]] (`resolvido`) é **mesclar sem fecho** — `phase` parada antes de `done`
com o commit de merge já no histórico da `develop`; o par descasado é
`planning-state.phase` × git, e o remédio dele foi o stage `fecho`
(`check_fecho.py`). Este achado é outro: **o portão não ter observável**. O fecho
pode existir, a demanda pode estar `done` com `pr_url`, o stage `fecho` pode estar
verde — e o veredito estar no lugar errado, na voz errada ou em palavra proibida.
As 021, 022 e 023 provam a independência das duas proposições: todas fecharam, e
três das quatro formas condenadas estão nelas.

### De que família é

Da do [[EA-50]] — *"a invariante é real, carrega peso e nenhum portão a afirma"* —
e, antes dela, da forma que o `E2` deu origem à R6 e que o [[EA-1]] registra:
**prosa de regra declara uma garantia que a máquina não sustenta**. Aqui a prosa é
a `sdd.md:18`/`:38` e a máquina é o `check_state.py`. Ganha id próprio, e não
alínea dentro do `EA-50`, porque o alvo é outro: lá é invariante de produto sem
asserção, aqui é **portão de processo sem campo declarado** (R12 — números citados
nunca renumeram).

**Gatilho de falsificação**, escrito para que este achado possa ser riscado (R2
§5): se alguém exibir **um gate hoje** que reprove `phase: done` por aceite
ausente, mal-formado ou de sujeito errado, este registro é refutado com a razão.
A medição que o sustenta é um `grep` de uma linha — refutar é tão barato quanto
afirmar.

**Viés de amostragem declarado**: todos os casos apareceram na **mesma janela** —
a Fase 6 retroativa da 021, em 2026-10-16, olhando planning-states. O censo é
completo (18/18), então a **distribuição** não é viés; o viés é de **superfície**:
só o campo de aceite foi olhado. Os demais campos de fase não declarados no schema
(`notes`, `achado_real`, `autorizacao`, `fecho_pendente` e os outros ad-hoc já
medidos pelo `data-engineer` na 016) não foram censados aqui e podem ter o mesmo
problema.

### Nota de peso — 020 e 022 estão hoje na condição que este achado condena

Registrado para que **quem for consertar não descubra depois**: o campo da **020**
(fala do proprietário no lugar do PO) e o da **022** (a palavra `aceito`) estão na
forma que o remédio abaixo proíbe. Isto **não reabre** nenhuma das duas — ambas
estão fechadas e mescladas, o campo delas é do `product-owner` e reabrir é decisão
do orquestrador (R2 §5: o registro permanece como foi feito). O que o achado diz é
que **a correção do schema vai encontrar duas demandas fechadas fora do enum**, e
que isso é parte do custo a decidir: corrigir os campos antigos, tolerá-los por
piso de demanda, ou declarar exceção nominal.

### Remédio proposto — não decidido, e não é meu

Proposta do `product-owner`, registrada como **candidata**:

1. declarar o campo no schema com nome que **nomeie o autor** (o que `aceite_po`
   fazia e `aceite_de_intencao` perdeu);
2. **enum de veredito restrito**, com `data` e `modelo` obrigatórios;
3. **proibição literal** das palavras `aprovado` e `aceito` (D3, `sdd.md:38`);
4. o stage `state` passa a **reprovar `phase: done`** com veredito ausente ou fora
   do enum.

Dono do gate é o `qa-engineer`; do campo, o `product-owner`; do schema, o
`data-engineer` — e **autor do gate ≠ quem escreve o campo** (R3 §2).

**Obstáculo já medido, que o remédio tem de atravessar**: declarar o campo no
schema, só, **não cria portão nenhum**. O `check_state.py` nunca abre o schema
(`:4-6`); mudança de schema nasce verde e sem dentes. Dentes exigem cláusula nova
em `check_state.py` — e aí o piso de demanda importa, porque `done` retroativo com
veredito fora do enum deixaria o stage **permanentemente vermelho** no histórico,
que é o modo de falha do `EA-5` (o MANIFEST sempre vermelho, logo nunca rodado) e
a razão pela qual a normalização de chaves da 016 foi adiada. A ordem e o piso são
decisão do `tech-lead`/proprietário, não deste registro.

### Nota de 2026-10-20 — contagem corrigida: 12 de 19 fora do critério, não 13

A contagem que circulou na conversa de 2026-10-19 ("13 de 19") contou a 021 duas
vezes. Medida em `0bd677c` — `grep -a -c '"aceite'` por arquivo e leitura do
valor, nos 19 planning-states —, **12 de 19 estão fora do critério**:

| estado do campo | demandas | n |
|---|---|---|
| campo não existe | 003, 007, 008, 009, 012, 013, 014, 018 | **8** |
| forma condenada (fala do proprietário no campo do PO · `aceito` · `sem objecao`) | 020, 022, 023 | **3** |
| veredito canônico no campo, mas a palavra `ACEITO` escrita por agente dentro do bloco | 011 | **1** |
| `aceite_po` / `aceite_de_intencao` canônico | 010, 015, 016, 017, 019, 021, 024 | 7 |

8 + 3 + 1 + 7 = 19. A 021 está canônica desde o PR #108 e a 024 nasceu com
`aceite_po`.

**A 011 sai da linha "5 de 5" do censo acima.** Em
`011-numeracao-das-prioridades.json:63`,
`validacao.aceite_po_segundo_passe.decisao_tasks_160` começa por "ACEITO COM
DEFERIMENTO REGISTRADO, nao segurado" — palavra que a D3 (`sdd.md:38`) proíbe um
agente de escrever, escrita por agente (commit `0eeaeb5`). O censo anterior não
podia vê-la: `grep -o '"aceite[a-z_]*"'` devolve nomes de chave e a palavra mora num
valor aninhado. Agravante registrado pelo refutador, não convertido em motivo: a
data interna do aceite (2026-09-01) contradiz o commit que o escreveu (`0eeaeb5`,
2026-09-04). O veredito canônico da 011 e o primeiro passe `REPROVADO` seguem
intactos no registro.

Status continua `aberto`.

## EA-89 — `**Onda**` é cabeça de verbete DUAS vezes no `CONTEXT.md`: a acepção de processo desambigua contra *wave* e é cega para a própria gêmea de produto

**Status**: `aberto`

**Aberto em**: 2026-10-16. Duplicata **medida pelo orquestrador** no `CONTEXT.md`
emendado; cadeia, causa provável, alcance e ausência de gate conferidos pelo
`doc-writer` ao registrar. O conserto foi **recusado deliberadamente** pelo
`product-owner` no passe do glossário, e a recusa é parte do achado — não
pendência dele (ver §Alcance).

### Cadeia arquivo:linha → efeito

- **`CONTEXT.md:201-204`**, sob `## Estrutura (processo)` — `**Onda**`:
  *"Etapa de implantação da Estrutura Agêntica (0–4), com critério de pronto
  executável."* Acepção de **processo**. `_Evitar_` (`:204`): `fase`.
- **`CONTEXT.md:467-471`**, no fim do mesmo arquivo — `**Onda**`:
  *"Conjunto de frentes apresentado junto, com a primeira sendo o que se ataca
  agora."* Acepção de **produto**. `_Evitar_` (`:471`): `fase, etapa, roadmap,
  sprint`.
- **Efeito**: a cabeça do verbete é a chave de busca do glossário — é por ela que
  doc, spec e prompt novos "usam o termo daqui" (R12 §Glossário). Com duas cabeças
  idênticas, a chave **não resolve**: quem procura `Onda` encontra duas definições
  incompatíveis (processo × produto) e **nenhuma linha de distinção entre elas**.
  Num repositório cuja disciplina inteira é vocabulário fechado, o termo canônico
  deixa de ser canônico — e a R12 fica sem como ser cumprida para esta palavra,
  porque não existe "o termo daqui".

### A cegueira está declarada dentro do próprio verbete

O `:201` **se preocupa em desambiguar** — e contra um termo estrangeiro:

- a distinção contra *wave* está no **CORPO** (`:203`: "Distinta de *wave* (grupo
  de tarefas paralelas dentro de uma demanda)"), **não** no `_Evitar_` — correção
  de medição: o `_Evitar_` do `:204` lista só `fase`. A substância do achado é a
  mesma; a localização, não;
- as duas cabeças reservam `fase` no `_Evitar_` (`:204`, `:471`) — isto é, as duas
  foram escritas com cuidado de fronteira, cada uma olhando para fora;
- e o `:471` evita `roadmap` — exatamente a palavra que o **terceiro** sentido usa.

Um verbete que desambigua contra *wave* e contra `roadmap`, e não vê o homônimo que
está no mesmo arquivo, 266 linhas abaixo.

### Terceiro sentido, e já medido antes

- **`specs/PHASE_5_0_REV_B.md:1718`** (selada, imutável, classe `legacy`):
  `# 33. ROADMAP — ONDAS E CONTRATOS SEPARADOS`. Único uso real no arquivo — a
  segunda ocorrência de `onda` (`:1403`) é substring de "corresponda".
- **`specs/022-escalonamento-do-investimento/spec.md:209-211`** registra isso
  textualmente: *"nada sobre teto, onda de investimento ou escalonamento em
  `PHASE_5_0_REV_B.md` — a `§33` usa "ondas" para o roadmap de microfases, sentido
  não relacionado."*
- **Agravante**: a demanda que criou a cabeça duplicada **já sabia** que a palavra
  estava ocupada por um terceiro sentido, mediu isso na própria spec, declarou-o
  "não relacionado" — e não olhou para a gêmea de **processo** no arquivo em que ia
  escrever.

### Causa provável, conferida: a fronteira de seção quebrada

O `CONTEXT.md` tem **duas** seções (`## Metodologia (produto)`, `:47`;
`## Estrutura (processo)`, `:194`) — medido, não há outras. Quatro cabeças de
**produto** moram sob a de **processo**, e são as **quatro últimas do arquivo**,
contíguas:

- `:461` `**Frente de investimento**` · `:467` `**Onda**` (produto) ·
  `:473` `**Teto de frentes**` · `:480` `**Substituto**`.
- As quatro entraram no **mesmo commit**: `b339637` (2026-09-30,
  `docs(022): Fase 6 — conformidade 14/14, aceite de intencao e dois achados`),
  ancestral de `develop`. A de processo (`:201`) é do commit fundador do glossário,
  `f7a787c` (2026-08-25) — medido por `git log -S` sobre o corpo de cada uma.
- **Como a duplicata passou**: quem anexa termo de produto no fim do arquivo não
  atravessa a seção de processo, e quem lê a seção de processo não espera termo de
  produto ali. A fronteira quebrada removeu o único lugar em que as duas cabeças se
  encontrariam na mesma leitura. Isto é causa **plausível e medida** — as quatro
  estão fora de seção, e a duplicata está entre elas —, não demonstrada.

### Ninguém mede: o glossário não tem gate

- Medido: **nenhum** arquivo de `.claude/verify/` parseia o `CONTEXT.md` como
  glossário. As duas únicas referências ao arquivo ali são `pins.json` (identidade
  do blob, R8) e `regra_morta.js:229` (citação de um verbete em comentário). O
  `compliance-audit.sh` não tem seção de glossário.
- O pin prova que o arquivo **não mudou**; nunca que ele **continua coerente** — é a
  mesma distinção que a R12 já escreveu para `§Não mudam` (`EA-47`).
- E o `b339637` carrega `conformidade 14/14` na própria mensagem: o `spec-validate`
  da 022 certificou conformidade **no commit que introduziu a cabeça duplicada**.
  Mesma família do [[EA-47]] — instrumento que mede forma e conclui sentido —, aqui
  com o agravante de que não havia nem a forma a medir.

### Por que isto é o defeito que duas regras existem para impedir

As duas regras mais recentes de vocabulário deste repositório são, as duas, sobre
**a cabeça carregar a própria delimitação**:

- R12 §Glossário, *"Verbete define por CRITÉRIO, nunca por lista"* (`EA-47`,
  2026-09-14, `.claude/rules/documentation.md:32-38`);
- `CONTEXT.md:188`, emenda de 2026-10-16 (`d0efc33`): *"Neste repositório, *âncora*
  sem qualificador é do instrumento"* — e essa emenda resolveu a colisão de *âncora*
  **sem duplicar cabeça**, qualificando as duas (`**Âncora de mutante**`, `:226`;
  `**Ancoragem do apoio**`, `:170`).

Cabeça duplicada é o caso degenerado das duas: dois verbetes, nenhum dos dois
qualificado — e **já consumado** no arquivo, 16 dias antes da emenda que escreveu a
regra.

### Alcance — por que o conserto não é deste passe

Censo de citações medido hoje, por acepção:

- **processo**: 9 linhas com `Onda` em 6 arquivos de regra (`boundary.md` 1,
  `design-decisions.md` 3, `determinism.md` 1, `evidence-intake.md` 1, `pins.md` 1,
  `tdd.md` 2); as formas `Onda <N>` somam 10 ocorrências (2× `Onda 0`, 2× `Onda 3`,
  6× `Onda 4`);
- **produto**: 47 linhas com `onda` em 6 artefatos de
  `specs/022-escalonamento-do-investimento/` (`spec.md` 18, `plan.md` 10,
  `refinement.md` 8, `tasks.md` 6, `spec-validate.md` 3, `relatorio-final.md` 2) —
  demanda **mesclada** em `develop`.

**Remédio candidato, não decidido**: cabeça qualificada na acepção de **produto**,
no padrão que a emenda de hoje usou para a âncora, com cláusula de delimitação
recíproca nas duas e **sem** que nenhum termo saia do `_Evitar_` — nada a riscar
(R2 §5), porque nenhum sentido muda.

**O conserto exige passe próprio, com o censo de quem cita qual.** A recusa do
`product-owner` em consertar sem esse censo está correta e fica registrada aqui:
mexer em cabeça de verbete citada por demanda mesclada tem alcance, e decisão de
cabeça é **conteúdo de glossário** — do `product-owner` (R12), nunca do
`doc-writer`.

### O que isto não é

- **Não é achado sobre a emenda de 2026-10-16** (`d0efc33`), que está correta e não
  tocou nenhuma das duas cabeças de `Onda`.
- **Não é reabertura do [[EA-47]]**: ali o defeito era verbete definido por lista;
  aqui o **corpo** dos dois está certo — o defeito é a **chave**.
- **Não é "termo faltando no glossário"** (R12 §Glossário, *"termo que falta lá é
  sinal"*): os dois sentidos **estão** definidos. O defeito é a chave não dizer
  qual.
- **Não é defeito da demanda 022 como registro**: registro mesclado não se
  retro-ajusta (R13, precedente das fases seladas). O que se conserta é o
  `CONTEXT.md` de hoje.

### Encaminhamento

`fix-finding`, dono **`product-owner`** (conteúdo de verbete), com `doc-writer` no
censo de citações e na gravação. Três perguntas que **não são do agente**:

1. qual das duas acepções recebe o qualificador na cabeça — a de **produto** é a
   candidata aparente, por ser a mais nova e a de alcance menor em regra;
2. se as quatro cabeças de produto (`:461`, `:467`, `:473`, `:480`) migram para
   `## Metodologia (produto)` no mesmo passe — move linha em arquivo pinado, logo
   `gen_pins.py` no mesmo PR (R8);
3. se a máquina entra: checagem de **cabeça duplicada** no `CONTEXT.md` — hoje
   inexistente — dentro do `compliance-audit.sh`, que é onde a R12 já é auditada.
   Gate novo é da R10, dono `qa-engineer`.

Nenhuma das três decidida aqui.

## EA-90 — uma exclusão R13 inerte é invisível ao `check_fecho`: entrada em `fecho.json → excluidas_por_r13` cujo slug não tem planning-state, ou cuja demanda não está `done`, nunca é julgada

**Status**: `aberto`

**Aberto em**: 2026-10-20, com a medição feita pelo `qa-engineer` em 2026-10-19 ao
consertar o `D016-M20` (commit `93c8561`, PR #110). Registrado pelo `doc-writer` no
passe final da selagem da v3.2.11; as linhas abaixo foram lidas por mim em
`0bd677c`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/fecho.json:103` — `excluidas_por_r13`: hoje 5 entradas
  (003, 009, 010, 020, 024), 6 artefatos ausentes nomeados.
- `.claude/verify/fecho.py:206-223` — `_classifica_exclusoes()` valida só a
  **forma** de cada entrada (`fonte`, `artefatos_ausentes`, sem curinga); o slug
  não é confrontado com nada.
- `.claude/verify/fecho.py:272-274` — o julgamento itera `for slug in
  sorted(estados)`: **só slugs com planning-state são julgados**.
- `.claude/verify/fecho.py:337` — `exclusao = validas.get(slug)`, dentro de
  `_julga_demanda`: a entrada só é consultada para um slug que já é sujeito. A
  checagem de exclusão obsoleta (`exclusao-obsoleta`) vive no ramo
  `fase == "done"` do mesmo corpo.
- **Efeito**: uma entrada cujo slug **não tem planning-state** (ou cuja demanda não
  está `done`) não vira sujeito, não é acusada por ninguém e não aparece no censo.
  Baseline verde; a exclusão está lá, inerte e invisível. É o que o
  `qa-engineer` mediu em commit efêmero: 6ª entrada `998-sem-planning-state`
  (len=6) → gate nu exit 0, `998` fora dos sujeitos, `D016-M20` segue com 5.

As cinco exclusões em si **não são o achado**: são decisão registrada (003, 009 e
010 fechadas sem `spec-validate.md`/`relatorio-final.md` sob o processo antigo ou
em fecho retroativo; 020 e 024 refutadas no portão da Fase 0, sem Fase 6). O achado
é o instrumento não ver uma exclusão que perdeu o sujeito.

### Duas defasagens de registro MEDIDO, no mesmo achado

1. `.claude/verify/fecho.json:22` — `_meta.prova_de_carga.exclusoes` ainda diz "sem
   as três entradas … 3 problema(s)", medido em 2026-09-04. A população mudou duas
   vezes desde então (020 em `23f8fa7`, 024 em `0c05007`): hoje 5 demandas, 6
   artefatos, 5 problemas.
2. `.claude/verify/mutation-matrix.json:1963-1964` — `pares[D016-M20].invariante` e
   `.descricao` ainda dizem "as três exclusões R13" / "as três entradas", desde
   2026-09-24. Só a `ultima_prova` (`:1966`) foi renovada, em 2026-10-19; o `23f8fa7`
   não renovou nem ela.

Nenhum dos dois é tocado agora: `fecho.json` e `mutation-matrix.json` são pinados e
a selagem é doc-only (`gen_pins.py` é do orquestrador).

### Encaminhamento

Fora do escopo de um passe de selagem; **nenhuma rota decidida aqui**. Aparente:
um global não impeditivo para slug de `excluidas_por_r13` sem sujeito (família do
`exclusao-malformada`, `fecho.py:261-266`) — o que muda o contrato do
`check_fecho` e passa por demanda (`tech-lead`) e por gate novo (R10, dono
`qa-engineer`). A defasagem de registro é `doc`, do dono do harness.

## EA-91 — a importação de sessão não é transacional nem substitutiva para a curadoria: validar já aplica, cancelar não desfaz, e a chave ausente herda a sessão anterior

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`D025-VAL1`, `D025-VAL2`, `D025-TRX1`, `D025-TRX2`,
> `D025-AUS1`, `D025-NOP1`; commits `e11fd05` e `d8518e0`). Os seis gates vivem em
> `tests_025_curadoria_sessao.js` (`D025 CURADORIA SESSAO: 16 PASS · 0 FAIL de 16`,
> reexecutado na escrita deste fecho, HEAD `b24534e`). Cada metade da cadeia acima
> tem o seu gate e o seu carrasco:
>
> - *validar aplicava* (`ui_session_v32.js:237-242`) → o validador chama
>   `__CURATION.validate`, puro (`ui_session_v32.js:242`): `VAL1` (seletor real,
>   prévia, Cancelar, Escape e exportar: 0 escritas no bridge); `D025-M1`.
> - *`daSessao` zerava antes de validar* (sub-caso E) → `fromSession` recusa sem
>   tocar o estado: `VAL2`; `D025-M2`.
> - *a chave ausente herdava a sessão anterior* → a curadoria — inclusive
>   `undefined` — é a 11ª chave do candidato e o commit a escreve: `TRX1`
>   (`D025-M4`) e `AUS1` (`D025-M5`).
> - *o snapshot nascia depois da mutação* → `snapshotCanonicalOwners()` é a primeira
>   instrução de `commitCanonicalOwners` (`ui_session_v32.js:624`);
>   `fromSession(cand.curadoria)` entra dentro do `try` (`:637`); o restore perde a
>   guarda `&& snap.curadoria` (`:620`; ERR-1 do refinamento): `TRX2` (`D025-M6`,
>   `M7`, `M8`, `M22`).
> - *cancelar, falha tardia e engine incompatível* → `NOP1` (`D025-M10`).
>
> Campanha `d025`: `23 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 23`
> (`mutation-matrix.json → _meta.execucao_demanda_025`). Conformidade:
> `specs/025-curadoria-transacional/spec-validate.md`, 42/42 na iteração 2 (C1–C8
> conformes). A cadeia acima fica como foi escrita (R2 §5). Os irmãos — `EA-92`,
> `EA-105`, `EA-106` e `EA-111` a `EA-114` — fecham nos próprios blocos.

**Severidade (triagem do orquestrador)**: alta — visível no relatório impresso
sob fluxo normal.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (relatórios em `docs_phase5/auditoria_codex_2026-10-20/`: **CX-01 e
CX-02 do astra**, **CX-01 do terra**), com triagem do orquestrador. As linhas
abaixo foram relidas por mim (`doc-writer`) em `cee02e9`; os arquivos de produto
são idênticos entre `ba77134` e `cee02e9`.

### Cadeia arquivo:linha → efeito

- `ui_session_v32.js:693-697` — o seletor de arquivo chama
  `validateSessionDocument(doc)` (`:693`), depois `sessionCompatibility(doc)`
  (`:695`) e só então `showImportPreview(doc, c, origin)` (`:697`). Tudo isso
  acontece **antes** de o operador confirmar qualquer coisa.
- `ui_session_v32.js:237-242` — dentro de `validateSessionDocument`, se
  `I.reportCuration !== undefined`, chama `window.__CURATION.fromSession(I.reportCuration)`
  (`:240`). A função é **validadora no nome e aplicadora no corpo**.
- `ui_curation_v32.js:187-189` — `daSessao` começa por
  `estado = { decisions: {}, architectureNote: undefined }` e só depois valida item
  a item: o owner da curadoria é **zerado e reescrito** na validação, mesmo quando
  a função devolve erros.
- `ui_ux_v32.js:45` — `#ux-modal-cancel` só faz `close(true)`; nada restaura a
  curadoria. Erro de validação posterior (`ui_session_v32.js:245`, por exemplo
  `Assessment ausente`) e incompatibilidade de engine (`:695` → `sesEngineMismatch`)
  também retornam sem desfazer.
- `ui_session_v32.js:570-589` e `:606-607` — `snapshotCanonicalOwners()` inclui
  `curadoria` (`window.__CURATION.state()`), mas é chamado **dentro** de
  `commitCanonicalOwners`, isto é, **depois** de a validação já ter mutado o
  owner. O snapshot de rollback fotografa o estado já alterado; o "atômico" do
  comentário (`:565-569`) não alcança a curadoria. Na confirmação a validação roda
  de novo (`:632`), então `fromSession` é aplicado duas vezes.
- `ui_session_v32.js:525-564` e `:606-628` — **chave ausente** (intervalos
  corrigidos in loco em 2026-10-25; eu havia escrito `:525-563` e `:606-622`, que eram
  o corpo até o `return` / o `try`):
  `normalizeSessionDocument` não leva `reportCuration` ao candidato (a palavra não
  aparece no intervalo) e `commitCanonicalOwners` não escreve a curadoria. Com a
  chave ausente, `validateSessionDocument` também não chama `fromSession`
  (`:237`); o estado anterior da curadoria **sobrevive** à importação.
- **Efeito**: (1) importar-e-cancelar, importar-e-falhar ou importar
  incompatível **altera a curadoria da sessão ativa**; (2) o mesmo JSON, sem
  `reportCuration`, produz resultados diferentes conforme a sessão que estava
  aberta antes — o documento deixa de ser suficiente para reconstruir o resultado.

### Como foi medido (executado vs. lido)

**Executado pelo Codex, em jsdom** (não reexecutado por mim):

- astra CX-02: o **mesmo JSON** (15 respostas em nível 0, sem `reportCuration`)
  importado em dois DOMs — um com exclusão prévia de FortiAnalyzer e outro novo —
  retornou sucesso nos dois, com **0 vs. 1 card na tela e 0 vs. 1 no DOM de
  impressão** depois de `beforeprint`.
- astra CX-01: excluir FortiAnalyzer, selecionar JSON que o inclua — **com a prévia
  ainda aberta o estado já era `include`**; Cancelar manteve a mudança. Repetido com
  `assessment` ausente e com SHA de engine incompatível: ambos rejeitados, ambos
  alterando a curadoria. Fluxo do seletor e do botão Cancelar executado.
- terra CX-01: com `FortiAnalyzer=exclude`, documento incompatível → `ok:false` mas
  a curadoria ficou `include`; documento inválido → `ok:false` mas ficou `{}`;
  documento válido sem `reportCuration` → `ok:true`, preservou o `exclude` anterior
  e o reexportou.

**Lido por mim, não executado**: toda a cadeia acima. Ressalva do Codex, que
vale aqui: a evidência de papel é o DOM preparado por `beforeprint`, não um PDF
renderizado.

### Invariante ferida

- **INV-8** (`product-invariants.md`): "o import recomputa; missing ≠ null ≠ []
  ≠ 'unset'". O comentário de `ui_session_v32.js:232-236` cita a própria regra
  (`missing != {}`) e cumpre só a metade da **recusa**; a metade da **substituição**
  não existe. **INV-7** por consequência (a narrativa deixa de ser derivada só da
  evidência do documento).

### Por que os gates não pegaram

- `D019-INV8` (`tests_019_curadoria.js:219-246`) promete, no título,
  "recomputada na importação" e **nunca importa**: verifica exportação, setter e
  ausência de derivados. A suíte passou em 14/14 (medido pelo astra).
- A atomicidade existente (`S29`, `tests_session_m48.js:282`) usa `richSession`
  (`:86`), e o comentário de `tests_session_m48.js:119` admite que `richSession`
  não declara curadoria. Falha tardia sem curadoria nunca exerce o owner novo.

### Encaminhamento

**Demanda** (≥ 2 módulos: `ui_session_v32.js` e `ui_curation_v32.js`). Dono do
desenho: `tech-lead`; implementação: `core-engineer` (curadoria é owner,
R9 §5). Escopo mínimo: validação **pura** separada da aplicação; a curadoria —
**inclusive a ausência da chave** — entra no candidato e no commit atômico,
coberta por snapshot/rollback tirado antes de qualquer escrita; gate de roundtrip
real (`qa-engineer`) com cancelamento, incompatibilidade de engine, falha tardia e
chave ausente sobre estados prévios diferentes, comparando tela **e** papel.
Possivelmente absorve o `EA-92`.

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5: o corpo acima não foi reescrito; só os
intervalos de linha de `normalizeSessionDocument` e `commitCanonicalOwners` foram
corrigidos **in loco**, no corpo que eu mesmo escrevi em `d8dc7bd`). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1 —
workflow de 31 agentes, dois refutadores independentes por achado (reprodução e
contra-leitura). Linhas abaixo reconferidas por mim em HEAD `2fcd552` (produto e
instrumentos byte-idênticos a `cee02e9`), salvo as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2), em jsdom — 10 cenários e sondas
  A–E; `D019-INV8` fecha 1/1 verde sobre o artefato defeituoso.
- **Severidade recomendada**: alta (2/2).
- **Encaminhamento recomendado**: **demanda 025**. A correção mínima cabe em
  `ui_session_v32.js` (validar com `state()`/`fromSession(prev)` via bridge;
  curadoria no `cand`; `fromSession(cand.curadoria)` dentro do `try` do commit),
  mas a demanda se justifica por §29.4 (`specs/PHASE_5_0_REV_B.md:1613-1617`,
  precedente de autorização em `specs/019-curadoria-do-relatorio/tasks.md:31`),
  por R9 §3 (bridge cujo "validar" muta) e por absorver o `EA-92` e as
  reancoragens em suítes PROTECTED. "Demanda por ≥ 2 módulos" não é necessidade
  técnica.

**Correções de cadeia** (prevalecem sobre a cadeia acima onde divergirem):

- **Linhas.** `validateSessionDocument` aplica a curadoria em
  `ui_session_v32.js:237-242` (chamada em `:240`). `snapshotCanonicalOwners
  :570-589` (comentário `:565-569`; curadoria em `:585-586`) é chamado em `:607`,
  dentro de `commitCanonicalOwners :606-628`; `restoreCanonicalOwners :590-605`
  reaplica a curadoria em `:602-603`, só por exceção. `normalizeSessionDocument
  :525-564`: o candidato tem 10 chaves (`arq`, `ans`, `notes`, `priorities`,
  `landscape`, `arch`, `platforms`, `signals`, `targetOverrides`, `refinement` —
  `:533-541`) e nenhuma é a curadoria. `daSessao` zera o owner em
  `ui_curation_v32.js:188` e reaplica item a item em `:194-202`. Os intervalos
  `:525-563` e `:606-622` do corpo eram o corpo até o `return` / o `try` —
  corrigidos in loco.
- **Sub-caso (b) impreciso.** O estado pós-recusa é o que o ARQUIVO declarou, não
  necessariamente `{}`: fica `include` se a curadoria do arquivo é válida e o erro
  vem depois (`:244+`); fica `{}` se ela é `{}` ou inválida. Erros anteriores a
  `:237` (`:209-231` *(síntese)*) nunca alcançam `fromSession`. Nos caminhos
  Cancelar / engine incompatível / documento inválido o snapshot nem chega a ser
  tirado (`:607` só existe dentro do commit); na confirmação ele já fotografa o
  estado mutado.
- **Sub-caso E (novo, executado).** Curadoria **inválida** no arquivo zera o owner
  antes de recusar (`daSessao :188`): uma recusa por curadoria malformada também
  apaga a seleção da sessão ativa.
- **Sub-caso novo, executado — falha DURANTE o commit** (severidade do sub-caso:
  alta). Com um setter sintético que lança na 1ª escrita de `declaredPlatforms`, o
  commit devolve `{ok:false, rolledBack:true}` e `ans[0]` é restaurado, mas a
  curadoria após o rollback é o `include` do **ARQUIVO**, não o `exclude` da
  **sessão** — o snapshot (`:607`) é tirado depois da validação que já aplicou o
  arquivo (`:240`). O corpo só tinha esse caminho por leitura
  (`restoreCanonicalOwners` alcançado por exceção). É o que obriga a 025 a tirar o
  snapshot **antes de qualquer escrita**, não apenas "levar a curadoria ao
  candidato".
- **Invariante.** INV-8 é a ferida literal ("o import recomputa; missing ≠ `{}`");
  INV-7 só por consequência — `tests_ux_m41.js` e o M41 não alcançam a curadoria
  (C5 da 019, `specs/019-curadoria-do-relatorio/spec.md:44`).
- **Fuga de gates, mais larga que a do corpo.** Além de `D019-INV8`
  (`tests_019_curadoria.js:219-247`, cujo corpo não contém nenhuma chamada a
  `importSessionDocument`/`validateSessionDocument`/`fromSession` — `grep` = 0) e
  de S29 (`tests_session_m48.js:282-289`; `richSession :86-100` não declara
  curadoria), S6/S7 (`tests_session_m48.js:101-106`) importam em `boot()` novo e
  sem curadoria. `specs/019-curadoria-do-relatorio/spec-validate.md:13` deu C3
  "conforme" sem medir importação. Famílias de gates cegos: `EA-111` e `EA-112`.
- **Intenção declarada contrária ao código.**
  `specs/019-curadoria-do-relatorio/refinement.md:173` (caso 7, "Ausência ≠ vazio"),
  `spec.md:42` (C3) e `tasks.md:31` (T010) pedem o que o código não faz; a trilha em
  `tests_p50_core.js:544-545` diz que snapshot/restore carregam a curadoria "para
  que uma importação que falhe no meio não deixe a seleção meio aplicada". O estado
  nasceu em `90f14ea` (2026-09-18, T010/T011).
- **Irmãos nascidos no mesmo passe**: `EA-105` (exportar também escreve no owner),
  `EA-106` (três representações de "sem curadoria"), `EA-111` (`D019-INV8`
  tautológico), `EA-112` (suítes cegas ao sexto owner), `EA-113` (S50), `EA-114`
  (S69).

## EA-92 — "Nova sessão" não limpa a curadoria: a exclusão de um relatório sobrevive e é exportada na sessão seguinte

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`D025-NEW1`, `D025-RST1`; commit `17683b6`,
> `ui_ux_v32.js`, §29.4 autorizado em 2026-10-27). `uxNewSession`
> (`ui_ux_v32.js:30`) e `uxResetAssessment` (`:21`) chamam `__CURATION.clear()` —
> e `__V32UI.discardDraft()` — antes de `render()`. A pergunta que o
> Encaminhamento deixava ao `tech-lead` («Reiniciar avaliação» leva a curadoria?)
> foi decidida por P2 (portão da Fase 0, 2026-10-27): leva, e o diálogo a nomeia
> (`ui_ux_v32.js:57`).
>
> `D025-NEW1`: Nova sessão, pelo diálogo e pela rota direta, deixa `state()` vazio
> e o export sem `reportCuration`; Cancelar e Escape preservam; o texto de `:61`
> permanece intacto (UX21). `D025-RST1`: Reiniciar limpa a curadoria e preserva o
> contexto tecnológico. Carrascos `D025-M11` e `D025-M12` — ambos DETECTADOS
> também sob a m48, pela alínea reancorada de `S31-S32` (`b20b20b`) — e
> `D025-M13` (o texto do diálogo). `tests_ux_m41.js` ficou byte-idêntico à base
> (`56 PASS · 0 FAIL`). A pegada que a nota de 2026-10-25 previa (pin em
> `tests_p50_core.js`) foi o repin §29.4 `97f08d8`, com «Identidade anterior».

**Severidade (triagem do orquestrador)**: alta — risco de seleção de relatório de
um cliente vazar para o seguinte.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-02 do astra** e **CX-02 do terra**), com triagem do
orquestrador. Cadeia relida por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `ui_ux_v32.js:23-30` — `uxNewSession` chama `clearTargetProfile`,
  `clearOperationalRefinement`, zera `ans`/`notes`/`businessPriority`/`arq`,
  `V32.resetLandscapeToUnset()` e `render()`. **Não chama
  `window.__CURATION.clear()`.**
- `ui_curation_v32.js:228` — `clear: function () { estado = { decisions: {},
  architectureNote: undefined }; }` **existe** no bridge; `grep` por `__CURATION`
  em `ui_ux_v32.js` não acha ocorrência. O módulo de curadoria também não registra
  gancho de reset.
- `ui_session_v32.js:75-77` (corrigido in loco em 2026-10-25; eu havia escrito
  `:76-77`) — a exportação lê a curadoria do owner por
  `__CURATION.toSession()` e escreve `reportCuration` se houver algo declarado:
  o resíduo é serializado.
- **Efeito**: depois de "Nova sessão", a tela volta à home com respostas `null`,
  mas `FortiAnalyzer: exclude` continua no owner, e é exportado.

### Como foi medido (executado vs. lido)

**Executado pelo Codex, em jsdom**: terra CX-02 — selecionar resposta, abrir
resultados, marcar `FortiAnalyzer=exclude`, clicar em "Nova sessão" e confirmar:
tela `home`, respostas todas `null`, curadoria `{"FortiAnalyzer":"exclude"}`
exportada. astra CX-02: o mesmo, pelo botão e confirmação, preservou e reexportou.
**Lido por mim, não executado**: a ausência da chamada a `clear()` em
`uxNewSession` e a existência de `clear` no bridge.

### Invariante ferida

Nenhuma das dez de forma literal; é escopo de dado entre sessões (**INV-8**: o
estado exportado deixa de ser só o da sessão corrente) e a promessa do próprio
diálogo: "Nova sessão remove também todo o contexto tecnológico declarado"
(`ui_ux_v32.js:61`). A curadoria é entrada declarada pelo operador (comentário
`ui_session_v32.js:69-75`, "Selecao e ENTRADA").

### Encaminhamento

`fix-finding` de **um módulo** (`ui_ux_v32.js`: chamar `window.__CURATION.clear()`
quando o bridge existir, no mesmo ponto em que o landscape é limpo) **+ gate** em
`tests_019_curadoria.js` (`qa-engineer`: `include`/`exclude` declarados → "Nova
sessão" → ausência de `reportCuration` no próximo export). `uxResetAssessment`
(`ui_ux_v32.js:17-22`) preserva o contexto tecnológico por desenho (`:21`); o
`tech-lead` decide se "Reiniciar avaliação" leva a curadoria ou não — decisão de
produto, não do instrumento. Alternativa: absorvido pela demanda do `EA-91`
(decisão do `tech-lead`).

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5; só o número de linha de
`ui_session_v32.js` foi corrigido **in loco**, no corpo de `d8dc7bd`). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1.
Linhas reconferidas por mim em HEAD `2fcd552` (produto idêntico a `cee02e9`), salvo
as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2) — pelo bridge e pelo checkbox real;
  quatro oráculos cegos medidos; controle com `clear()` manual removendo a chave.
- **Severidade recomendada**: alta (2/2) — **não** bloqueante: o aviso é visível, o
  editor desfaz e o recarregamento limpa (S33).
- **Encaminhamento recomendado**: **absorver na demanda 025**, em wave própria, no
  módulo `ui_ux_v32.js`, sob o rito §29.4 (autorização nominal do proprietário +
  trilha "Identidade anterior" em `tests_p50_core.js:383` + `gen_pins`).
  Alternativa, se o `tech-lead` preferir: `fix-finding` com o mesmo rito
  (precedentes `EA-61`/`EA-66`/`EA-69`). Pegada real do PR: `ui_ux_v32.js` +
  `tests_p50_core.js:383` + `pins.json` + HTML + gate novo em
  `tests_019_curadoria.js` (`expected_suites.json`, 14 → 15) + mutante — e nenhum
  harness de mutação observa `ui_ux_v32.js` hoje. O encaminhamento do corpo
  ("`fix-finding` de **um módulo**") subestimava a pegada.

**Correções de cadeia**:

- `ui_session_v32.js:76-77` → **`:75-77`** (a atribuição de `cur` começa em `:75`;
  corrigido in loco).
- **O resíduo não é só `decisions`.** `architectureNote` e `include` fora da oferta
  também sobrevivem; a correção é `clear()` inteiro.
- **O efeito vai além de "é exportada".** A avaliação **seguinte** renderiza 8 cards
  contra 9 num DOM virgem, com o aviso "Seleção do engenheiro aplicada. 1 item foi
  retirado…" (`ui_p52_support_v32.js:598-614`, copiado ao papel em `:798-802`) —
  **INV-7 literal** na tela e no papel; INV-8 no export. "Nenhuma INV literal" era
  fraco.
- **Por que os gates não pegaram.** UX21 (`tests_ux_m41.js:199-207`), T21/T28
  (`tests_target_m431.js:155,213`), R21 (`tests_ref_m44.js:113`) e S31-S32
  (`tests_session_m48.js:300-314`) medem por `legacySnapshot` (`ui_v32.js:127-135`),
  `isLegacyModeV32` (`engine_v32.js:305-311`) e `sessionHasContent`
  (`ui_session_v32.js:652-656`) — todos cegos à curadoria. Nenhum `D019-*` clica
  `#ux-newsession` (`grep` = 0 em `tests_019_curadoria.js` e `tests_019_mutants.js`).
  Cada outro owner tem o seu "Nova sessão limpa X" (T21, R21); a curadoria não.
- **O fio não pode nascer em `ui_curation_v32.js`.** R9 §3/§4 proíbem o gancho de
  reset registrado pelo módulo; o fio nasce em `ui_ux_v32.js`, que é §29.4
  (`specs/PHASE_5_0_REV_B.md:1613-1620`), pinado em `tests_p50_core.js:383` e
  `pins.json:534`, e **ausente de `boundary.json`** (`grep` = 0): o `guard-boundary`
  não o bloqueia; quem acusa a edição é o `P50-GOV1` + `baseline`.
- **`uxResetAssessment` (`ui_ux_v32.js:17-22`) também preserva a curadoria**
  (medido). A analogia do corpo ("como o landscape") é errada: target e refinamento
  são limpos por "Reiniciar" desde 4.3.1/4.4 (`docs/CHANGELOG_v32.md:232` e `:261`).
  O diálogo (`ui_ux_v32.js:55`) diz "O contexto tecnológico declarado será
  preservado" e **não nomeia a curadoria**; o resíduo é invisível com o gate fechado
  (`ui_curation_edit_v32.js:62-65`, `:218`) até reaparecer como decisão "do
  engenheiro" (`ui_curation_v32.js:141-144`). **Decisão de produto pendente
  (PO/TL) para a 025** — não corrigir sem ela;
  `specs/019-curadoria-do-relatorio/spec.md:161-166` trata de respostas que mudam,
  não de avaliação reiniciada.
- **Historicidade.** `ui_ux_v32.js` está intocado desde `e5ccd42` (2026-08-18); a
  curadoria nasce em `aef6ff3` (2026-09-18). `plan.md:38-40` da 019 não lista
  `ui_ux_v32.js`; `refinement.md:163-175` não contempla Nova sessão nem Reiniciar —
  omissão, não decisão.
- A rota direta `uxNewSession({silent:true})` reproduz o defeito.
- **Irmãos nascidos no mesmo passe**: `EA-107` (`draft` do editor de contexto
  sobrevive à nova sessão), `EA-108` (`prioLimitHit`), `EA-109`
  (`sessionHasContent()`/`sessionPreview()` cegos à curadoria), `EA-112` (alínea c).

## EA-93 — `guard-tdd` e `guard-boundary` comparam caminho sensível a caixa em sistema de arquivos que ignora caixa: `UI_P52_WORKSPACE_V32.JS` passa pelo `guard-tdd` onde `ui_p52_workspace_v32.js` é negado

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: alta — a R6 (boundary) e a R3 (TDD)
são os dois portões que o hook de `Write|Edit` existe para sustentar.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-04 do terra**), com triagem do orquestrador. Cadeia relida
por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.claude/hooks/guard-boundary.sh:19` e `:26` — normaliza `\` para `/` e compara
  `arq == p or arq.endswith("/" + p)`: **igualdade de string, sensível a caixa**.
- `.claude/hooks/guard-tdd.sh:22-24` — `BASE="${ARQ##*/}"` e `case "$BASE" in
  ui_*.js|ui_*.css|build_v32_html.py|generate_icons_v32.py)`: padrões em
  minúsculas, igualmente sensíveis a caixa.
- `.claude/settings.json:41` — o grupo `Write|Edit` roda os dois hooks.
- **Efeito**: em NTFS (Windows, ambiente de desenvolvimento local declarado em
  `CLAUDE.md`), `ENGINE_v32.js` e `engine_v32.js` são o mesmo arquivo; o hook só
  reconhece uma grafia. A variação de caixa **contorna** a recusa do rito.

### Como foi medido (executado vs. lido)

**Executado pelo Codex** (terra CX-04): `Test-Path ENGINE_v32.js` e
`Test-Path UI_P52_WORKSPACE_V32.JS` → `True`; payload `PreToolUse` com
`engine_v32.js` no `guard-boundary` → exit 2, com `ENGINE_v32.js` → exit 0; o mesmo
no `guard-tdd` (minúsculo bloqueado, maiúsculo aprovado). **Nenhuma escrita foi
feita.** **Lido por mim, não executado**: as linhas acima. **Pendência de
verificação**: `permissions.deny` (`.claude/settings.json:3-22`) também lista os
caminhos por grafia exata; ninguém mediu se o motor de permissões do host ignora
caixa — se ignora, há uma segunda barreira para `Edit`/`Write`.

### Regra ferida

**R6** (boundary: "edição direta de path protegido é negada pelo hook") e **R3**
(`guard-tdd`); **INV-9** (superfícies congeladas protegidas por boundary legível
por máquina) — a coerência 9/9 dos caminhos declarados não implica enforcement.

### Encaminhamento

`fix-finding`, `build-engineer` (hooks) — `lib/common.sh`: canonicalizar o
caminho relativo à raiz e comparar sem caixa quando a plataforma exigir; casos
de teste de hook (`qa-engineer`) com caixa, barras `\`/`/` e caminho absoluto.
Mesma família do `EA-83`/`EA-87` (o que o hook efetivamente enxerga).

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1 e §2b.
Linhas reconferidas por mim em HEAD `2fcd552` (hooks e `settings.json` idênticos a
`cee02e9`), salvo as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA — a metade R6/INV-9
  (`guard-boundary`) é **neutralizada ponta a ponta pelo `deny` do host**; a metade
  R3 (`guard-tdd`) é **sustentada ponta a ponta**.
- **Executado por**: os dois refutadores (2/2). Hooks por stdin: `engine_v32.js` →
  exit 2 e `ENGINE_v32.js` → exit 0; `ui_p52_workspace_v32.js` → 2 e
  `UI_P52_WORKSPACE_V32.JS` → 0. Sonda do host 2.1.301 em projeto-sonda:
  `Edit(FOO.txt)` contra `deny` `Edit(foo.txt)` recusado, arquivo intacto, hook nem
  invocado (hooklog só com `BAR.txt`). O host entrega `tool_input.file_path` como
  digitado (hooklog `...\BAR.txt`), logo a metade `guard-tdd` não é inferência. O
  par exato (`Edit` sobre `engine_v32.js` na worktree) não foi medido — foi medido
  o comportamento do host com `deny` equivalente.
- **Severidade recomendada**: **média**. O reprodutor disse alta; o contra-leitor,
  média. Recomendo média: a metade R6 é fechada pelo `deny` do host (medido); a
  metade R3 é Windows-only, exige uma grafia que nenhuma convenção do repo produz e
  aparece pós-fato sob o nome canônico (` M ui_*.js` → stage `build` do Stop).
  **Sobe para alta** se o proprietário decidir que o repo não deve depender da
  versão do host, que não é pinada.
- **Encaminhamento recomendado**: `fix-finding`, `build-engineer`:
  `guard-tdd.sh:22` (`BASE="${BASE,,}"` ou `shopt -s nocasematch`, sem condicional
  de plataforma) + paridade opcional em `guard-boundary.sh:26` (`.casefold()`, mesmo
  dono, mesma delegação) + `gen_pins` (hooks pinados).
- **Título reescrito neste passe** (ids são permanentes, títulos não). Título
  anterior: "`guard-boundary` e `guard-tdd` comparam caminho sensível a caixa em
  sistema de arquivos que ignora caixa: `ENGINE_v32.js` passa onde `engine_v32.js`
  é negado". O exemplo `ENGINE_v32.js` estava errado: ele **não** passa por
  `Edit`/`Write`, porque o `permissions.deny` do host (`settings.json:4`) é
  avaliado antes do `PreToolUse` e ignora caixa (medido em projeto-sonda).

**Correções de cadeia**:

- **Regra ferida: R3 apenas.** INV-9 fica intacta (`boundary.json` +
  `guard-boundary` + `deny` seguem sustentando as superfícies congeladas). R6 §1 é
  ferida **só na parte "com o rito nomeado"**.
- **Pendência do corpo ("ninguém mediu se o motor de permissões ignora caixa")
  fechada por medição**: ignora. Consequência lateral: para os 9 caminhos da
  boundary, o agente **nunca vê o "rito nomeado"** que `boundary.md:18` promete —
  vê a recusa genérica do host, também com caminho em minúsculas. Observação de
  desenho de R6 §1, não id.
- **O exemplo verdadeiro** é `UI_P52_WORKSPACE_V32.JS` / `BUILD_V32_HTML.PY` no
  `guard-tdd` (`:22-24`: `BASE` comparado contra `ui_*.js|ui_*.css|build_v32_html.py|generate_icons_v32.py`).
  O `guard-tdd` **nunca** cobre `engine_v32.js` (`:11`, `:24`: minúsculo → exit 0).
- **Escopo maior que o descrito** *(síntese)*: para `legacy`/`registry` qualquer
  componente do caminho contorna (`SPECS\PHASE_5_0_REV_A.md` → 0,
  `.claude\verify\PINS.json` → 0); os builders e a caixa mista
  (`Ui_p52_workspace_v32.js`) também. **Limite**: caixa em diretórios acima da raiz
  NÃO contorna (`C:\PROJETOS\…\engine_v32.js` → 2; só o sufixo é comparado).
- `project_root()` não lê `CLAUDE_PROJECT_DIR`: é `git rev-parse --show-toplevel`
  (`.claude/hooks/lib/common.sh:15`, tema do `EA-84`).
- **Precedente interno contrário**: `guard-data.sh:203` já faz `.lower()`; os hooks
  de boundary/TDD estão intocados desde `e0dc231`/`47cf2e2` *(síntese)*.
- **Lateral**: as regras `Write(...)` do `permissions.deny` são inertes segundo o
  host — registrado como `EA-116`.

## EA-94 — escrita em caminho protegido por Bash não tem guarda: boundary e TDD estão só no matcher `Write|Edit`

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: alta.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-05 do terra**), com triagem do orquestrador. Cadeia relida
por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.claude/settings.json:41` — `guard-boundary.sh` e `guard-tdd.sh` estão no
  matcher `Write|Edit`.
- `.claude/settings.json:54` — o matcher `Bash` carrega só `guard-data.sh` e
  `guard-add.sh`, que olham `git commit` e `git add` de escopo amplo.
- `.claude/settings.json:3-22` — `permissions.deny` lista `Edit(...)` e
  `Write(...)` por caminho; **não há `Bash(...)` no `deny`** (os `Bash(...)` do
  arquivo estão em `allow`, `:24-35`).
- **Efeito**: um `python -c "open('engine_v32.js','w')…"`, `sed -i` ou redirecionamento
  `>` por Bash não passa por hook de boundary nem pelo `deny` de Edit/Write.

### Como foi medido (executado vs. lido)

**Executado pelo Codex** (terra CX-05): JSON `PreToolUse` simulando um comando
Python que escreveria em `engine_v32.js`, entregue aos dois hooks do matcher
`Bash` → `guard-data=0`, `guard-add=0`. **O comando representado não foi
executado.** **Lido por mim**: o registro em `settings.json`. **Não medido por
ninguém**: se as permissões do host (modo de aprovação de `Bash`) criam outra
barreira — ressalva do próprio terra.

### Regra ferida

**R6**/**INV-9** na promessa de "negado pelo hook com o rito nomeado"
(`boundary.md`, regra 1), que vale só para `Write|Edit`; **R3** (`guard-tdd`).

### Encaminhamento

`tech-lead` decide a rota: (a) hook de `Bash` que recuse redirecionamento ou
interpretador sobre caminho do boundary, ou (b) prova **ponta a ponta** de que
`permissions.deny` alcança Bash. Relacionado ao `EA-83` (ninguém mediu o despacho
do matcher `Bash`) e ao `EA-87`.

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1 e §4.
Linhas reconferidas por mim em HEAD `2fcd552` (instrumentos idênticos a `cee02e9`),
salvo as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: **parcial**. Os hooks foram executados por 1 dos 2
  refutadores: 5 payloads Bash × 4 hooks = 20/20 exit 0, com controles positivos
  exit 2. O alcance do `deny` do host sobre `Bash` **não foi executado por nenhum
  dos dois** (ambos só leram a documentação do host,
  `code.claude.com/docs/en/permissions`, §Redirections e §sandboxing): exigiria
  escrever em caminho protegido dentro do cwd do repo. Corroboração indireta: no
  `EA-93`, o reprodutor viu o host bloquear `> ENGINE_v32.js` em Bash por regra de
  `deny`. Nenhuma camada **configurada** (projeto, local, usuário) barra `Bash` —
  isso foi medido.
- **Severidade recomendada**: alta (2/2) — pelo motivo certo: a metade R3 (alvos do
  `guard-tdd`) fica sem camada alguma por Bash, e o vetor interpretador
  (`python -c open(...)`) está aberto em Windows sem sandbox ("on native Windows …
  unsandboxed", pela doc do host).
- **Encaminhamento recomendado**: `fix-finding`, `build-engineer`: **hook novo no
  matcher `Bash` que interprete o comando** (redirecionamento, `sed -i`,
  `cp`/`tee`/`mv`, interpretador) + `settings.json` + `compliance-audit.sh:29` +
  repin (perfil do precedente `58372d6` / `EA-37` *(síntese)*); medir na pasta
  primária (`EA-87`); R10 §10 — auto-exclusão para leituras legítimas (por exemplo
  `node harness_m41_v313.js <html>`).

**Correções de cadeia**:

- **Diagnóstico impreciso: ampliar o matcher para `Bash` NÃO resolve.**
  `guard-boundary.sh:12-13` e `guard-tdd.sh:16-17` leem só
  `.tool_input.file_path` e saem 0 se vazio (medido 10/10). O hook precisa
  **interpretar** o comando.
- **Metade R6 superdimensionada.** Pela documentação do host, regras `Edit(path)` de
  `deny` alcançam `sed`/`tee`/`cat`/`head`/`tail` e alvos de `>`/`>>`/`2>`: `sed -i`
  e `>` sobre `engine_v32.js` já seriam barrados. Só o **interpretador** fica fora,
  por desenho do host. Redação certa: "o `deny` cobre `sed`/redirect/`tee` (prova
  ponta a ponta **pendente**); interpretador e rito nomeado descobertos."
- **A metade R3 é a mais exposta**: nenhum espelho em `deny` para
  `ui_*.js|ui_*.css|build_v32_html.py|generate_icons_v32.py` (`guard-tdd.sh:24`).
- **A rota (b) do corpo** ("provar que `deny` alcança Bash") não fecha o achado nem
  se for positiva.
- **A rede pós-fato tem um furo no mesmo PR.** `gen_pins.py` está coberto pelo
  `allow` `Bash(python .claude/verify/*)` (`settings.json:24`): o repin no mesmo PR
  neutraliza a rede de `check_boundary.py:10-11` / `:28,40`; resta `check_m41` e o
  merge humano.
- `compliance-audit.sh:29-39` (hooks) e `:44-62` (`deny`) são verdes por construção
  — nunca conferem matcher *(síntese)*.
- `post-turn-verify.sh:23` só dispara em `\.(js|py|css|html|json|yaml|sh)$`:
  `MANIFEST.sha256` e `specs/PHASE_5_0_REV_A.md` passam até o commit.
- **Camadas configuradas vazias**: sem `settings.local.json` em nenhuma worktree;
  `~/.claude/settings.json` com `deny=[] ask=[] sandbox=null`; hook de usuário sem
  matcher só faz `process.exit(0)` *(síntese)*.
- **Agravante**: a instrução de modo automático orienta a editar por `sed`/heredoc
  em Bash — a porta sem guarda.
- **Limites do remédio por hook**: `shlex`, `bash -c`, variáveis (a mesma família
  do `EA-99a`).

## EA-95 — o `guard-tdd` libera qualquer módulo de produto se existir UMA demanda ativa com RED provado ou `tdd_waiver`, mesmo `{}`; o `check_state` não carrega o schema que diz validar

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: média.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-11 do terra**), com triagem do orquestrador. Cadeia relida
por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.claude/hooks/guard-tdd.sh:32-44` — junta todos os planning-states em
  `phase ∈ {red, implement, validate}` e calcula (`:40`)
  `ok = (red.status == "proven" and red.commit) or ("tdd_waiver" in d)`;
  `:44` libera se **qualquer** demanda ativa tiver `ok`. Não há vínculo
  arquivo ↔ tarefa ↔ demanda; a presença da chave `tdd_waiver`, **inclusive
  `{}`**, basta.
- `.claude/verify/check_state.py:48-51` — mesma condição (`"tdd_waiver" not in d`);
  o arquivo valida campos à mão (docstring `:2-4`: "sem jsonschema lib") e `grep`
  por `schema` só acha o docstring: **o arquivo
  `.claude/templates/planning-state.schema.json` não é carregado**. Nele,
  `tdd_waiver` exige `motivo` e `data` (`:17-20`); `check_tdd.py:40` tolera a
  ausência (`.get('motivo','?')`).
- **Efeito**: uma demanda alheia, com RED provado, libera a edição de qualquer
  módulo `ui_*` — o RED passa a ser "algum RED existe", não "este RED cobre esta
  edição". Um `tdd_waiver: {}` vale como waiver.

### Como foi medido (executado vs. lido)

**Lido** (terra CX-11 e por mim); **não explorado por ninguém**. Na árvore atual
os 19 planning-states estão em `done` (medido por mim por script: nenhum em
`red`/`implement`/`validate`), então o caminho ativo não foi exercido — o achado é
de desenho do guarda.

### Regra ferida

**R3** ("o RED prova a tarefa") e a promessa de `check_state` ("planning-state
válido contra o schema"). O cabeçalho de `guard-tdd.sh:7` descreve o escopo como
"conservador: bloqueia mais, nunca menos" por demanda; o efeito de
qualquer-demanda-libera-tudo é o inverso.

### Encaminhamento

`tech-lead` (contrato do vínculo) + `build-engineer` (hook e `check_state`):
validar o schema de fato (exigir `motivo`/`data`), associar waiver/RED à demanda e
à superfície autorizada. Gate novo: `qa-engineer`.

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1.
Linhas reconferidas por mim em HEAD `2fcd552` (instrumentos idênticos a `cee02e9`),
salvo as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2) — repo git efêmero; `check_state.py` e
  `check_tdd.py` reais; `jsonschema 4.26.0` contra o schema de HEAD; replay git.
- **Severidade recomendada**: média (2/2).
- **Encaminhamento recomendado**: **DIVIDIR**. (a) Dois `fix-finding` de 1 arquivo,
  `build-engineer`: `check_state.py` passa a impor o `required` do schema
  (incluindo `branch`) e a forma do waiver; `guard-tdd.sh:40` passa a exigir `dict`
  com `motivo` e `data` não vazios. (b) O **vínculo arquivo ↔ demanda** é
  **demanda**: schema (`data-engineer`), hook e `check_state` (`build-engineer`),
  skills `new-demand`/`fix-finding` e `tdd.md`, gate para o hook (`qa-engineer`) —
  ≥ 4 artefatos, ≥ 3 donos —, **com a rota do `fix-finding` no contrato** (hoje
  inexistente).

**Correções de cadeia**:

- **Linhas decisivas de `guard-tdd.sh`** (conferidas): filtro de fase `:38`;
  `ok = … or ("tdd_waiver" in d)` em `:40`; `any(ok)` em `:44-45`; `LIBERADO`
  tratado em `:52`. Filtro de módulo `:22-26`, laço `:33-41` e veredito `:42-47`
  *(síntese)*. O intervalo `:32-44` do corpo é só o miolo.
- **"Inclusive `{}`" subestima.** `tdd_waiver: null` também libera o hook e passa
  `state`; só o `tdd` o derruba, por **crash** (`check_tdd.py:40`, `AttributeError`,
  exit 1). `{}` atravessa hook, `state` e `tdd` (`[WAIVER] …: ? (?)`).
- **"RED provado" é mais fraco do que o corpo diz.** O hook não invoca git:
  `red.commit=deadbeef…` libera (caso C). A existência só é conferida em
  `check_tdd.py:32` — e esse é o `EA-96`.
- **Divergência `check_state` ↔ schema inclui `branch`** (`required` desde
  `d130a04`, 2026-09-04; `check_state.py` tem um único commit, `7340f51`,
  2026-08-25). Medido: sem `branch` → 0 problemas. A promessa "válido contra o
  schema" está em `check_state.py:2` e `pipeline.yaml:72`; o docstring `:4` admite
  "sem jsonschema lib" (a lib existe localmente, mas não é declarada).
- **Cabeçalho `guard-tdd.sh:6-7`** ("granularidade demanda nesta onda —
  conservador: bloqueia mais, nunca menos") qualifica o eixo **tipo-de-tarefa**, não
  o eixo arquivo ↔ demanda. Também **não é R13** (nenhuma spec, ADR ou
  `design-decisions.md` o confirma como desenho).
- **A janela "demanda alheia" EXISTIU** *(síntese)*: 2026-08-30/31 (009 e 013 em
  `validate`, 010/011/015 em `red`/`implement`); em `b86bbac` a 010 estava com
  `phase:"implementacao"` (enum inválido) — só 009/013 liberavam. Benigno.
- **A rota de `fix-finding` que o hook prescreve (`:56-57`) nunca foi usada**
  *(síntese)*: 25 commits `fix(EA-*)` em `ui_*`/builders têm árvore-pai
  `SEM_DEMANDA` (`--diff-filter=D` vazio).
- CX-11 `check_state.py:34` → a cláusula R3 é `:48-51` (o corpo já estava certo).

## EA-96 — a prova de RED aceita qualquer objeto git como "commit": `git cat-file -e HEAD:README.md` retorna 0

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: média.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-06 do terra**), com triagem do orquestrador. Cadeia relida
por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/check_tdd.py:32` — `subprocess.run(["git","cat-file","-e", c])`:
  só confirma que **um objeto** com aquele nome existe.
- `.claude/verify/check_state.py:48-51` — exige `red.status=proven` e `red.commit`
  **não vazio**; não resolve nada no git.
- `.claude/verify/fecho.py:563` (corrigido in loco em 2026-10-25; eu havia escrito
  `:566`, que é o `continue` do `except`) — o único `^{commit}` do instrumento está
  no **leitor** `ler_ancestralidade` (`:555-…`); `julgar_pre_merge` (`:409`) não lê
  `red.commit` (as únicas leituras de `red.commit` em `fecho.py` são `:318` e `:558`).
- **Efeito**: um planning-state com `red.status=proven` e
  `red.commit: "HEAD:README.md"` (um blob) passa `state` e `tdd`; pathspec ou tag
  leve também. A "prova de red commitado" (R3 §4) não prova que seja commit.

### Como foi medido (executado vs. lido)

**Executado pelo Codex** (terra CX-06): `HEAD:README.md` resolve para objeto
`blob`; `git cat-file -e HEAD:README.md` → 0, enquanto
`git rev-parse --verify 'HEAD:README.md^{commit}'` → 1. **Lido por mim**: as
chamadas acima. **Não rastreei** o caminho `fecho --pr` até o fim: o terra afirma
que um estado assim "poderia passar `state`, `tdd` e `fecho --pr`"; o que li é que
`julgar_pre_merge` não consulta `red.commit`.

### Regra ferida

**R3 §4** (red commitado e referenciado) e **R2 §1** (o PASS cita o que foi
executado).

### Encaminhamento

`fix-finding` (`build-engineer`; três arquivos do mesmo conjunto de instrumentos):
`check_tdd`, `check_state` e o fluxo pré-merge de `fecho` passam a exigir
`git rev-parse --verify --quiet <red.commit>^{commit}`. Negativo explícito com blob,
tag leve e pathspec (`qa-engineer`).

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5; o número de linha de `fecho.py` foi
corrigido **in loco** no corpo de `d8dc7bd`). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1.
Linhas reconferidas por mim em HEAD `2fcd552` (instrumentos idênticos a `cee02e9`),
salvo as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2) — o `check_tdd.py` real contra
  planning-states sintéticos (blob, tree, pathspec `HEAD:README.md`, `HEAD`, tag
  leve, tag anotada, branch, `HEAD~1` → `[OK]`; só SHA inexistente ou vazio →
  `[FAIL]`); censo: 17/17 `red.commit` reais são commit.
- **Severidade recomendada**: média (2/2) — defeito latente de poder discriminante,
  sem falso verde hoje.
- **Encaminhamento recomendado**: `fix-finding`, `build-engineer`, em `check_tdd.py`:
  **forma SHA hex** (≥ 7, idealmente 40) **+** `^{commit}`; decidir explicitamente
  sobre os 7 `red.commit` abreviados (011, 014, 015, 018, 019, 022, 023). **Não**
  levar git a `check_state.py` (contrato "sem dependência externa"; no máximo regex
  de formato). `fecho --pr` **fora** (contrato C5 da 016, `julgar_pre_merge` puro —
  errata ou demanda). Alinhar `verify.yml:29` ("valida por sha") e
  `.claude/skills/new-demand/SKILL.md:50` ("ref do commit" → SHA).

**Correções de cadeia**:

- `fecho.py:566` → **`:563`** (corrigido in loco). `:563` é o
  `["rev-parse", "--verify", "--quiet", f"{sha}^{{commit}}"]`; a mensagem está em
  `:570`; `:566` é o `continue` do `except FileNotFoundError`.
- **O remédio `^{commit}` sozinho NÃO rejeita** tag leve (`evidence-p50`), tag
  anotada, `HEAD`, nome de branch nem `HEAD~1` (medido, rc=0). O "negativo com tag
  leve" pedido no corpo é **inatingível sem checar a forma hex** (R10 §5; `SHA40` em
  `fecho.py:75`).
- **Código de saída**: `git rev-parse --verify 'HEAD:README.md^{commit}'` sem
  `--quiet` devolve `fatal: Needed a single revision`, rc=128; com `--quiet`, rc=1
  (conferido pelo sintetizador). O corpo escreveu o comando sem `--quiet` e rc 1 —
  cada fonte mediu uma forma.
- **O leitor pós-merge tampouco VALIDA**: se não resolve, devolve `resposta: None` +
  causa (`fecho.py:569-571`) e nunca FAIL; o oráculo secundário (`:312-320`
  *(síntese)*) e `vivo_pre` (`check_fecho.py:501-509`) não leem `red.commit`.
- O terra cita `check_tdd.py:30` (é o `if`) onde a chamada é `:32` — o corpo já
  estava certo.
- **Regra**: R3 §4 + R10 §5 + classe `EA-20`; R2 §1 cabe mal.
- `check_tdd.py` não tem harness nem teste (`mutation_population.json:71-74`, prazo
  2026-12-31 *(síntese)*); único commit `300d1d2` ("red.commit existe") *(síntese)*.

## EA-97 — o agregador de suítes ignora o código de saída do processo, e o bloco `visual` do registro nunca é comparado

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: alta — falso verde possível no gate de
contagens.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-03 do astra** e **CX-10 do terra**), com triagem do
orquestrador. Cadeia relida por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/check_suites.py:26-27` — `subprocess.run(spec["cmd"], shell=True,
  capture_output=True, …)`; `returncode` **não é lido em nenhum ponto do arquivo**
  (`grep returncode`: zero ocorrências).
- `:28-41` — o julgamento usa apenas a última linha não vazia de `stdout`
  (`LINE`, `:22`: `(\d+) PASS · (\d+) FAIL`) e as contagens esperadas.
- **Efeito**: suíte que imprime `N PASS · 0 FAIL` e morre com erro (ou com
  `stderr` fatal) é **aprovada**. Alcança `suites` e `heavy`.
- `.claude/verify/check_suites.py:21` — `block = "heavy" if "--heavy" in sys.argv
  else "suites"`: o agregador só conhece esses dois blocos. O bloco `visual` de
  `expected_suites.json:144` (`playwright`: `pass 67`, `skip 37`…) **nunca é
  comparado**; `.github/workflows/verify.yml:75-80` roda os comandos Chromium
  direto. Redução de gates visuais passa se não houver `FAIL`.

### Como foi medido (executado vs. lido)

**Executado pelo Codex** (astra CX-03): o agregador original com `subprocess.run`
**substituído em memória** — 23 processos simulados com `returncode=87`, `stderr`
`FATAL` e contagens corretas → stage exit 0, "0 problema(s)"; controle com
contagens incorretas → exit 1, 23 problemas. **Simulação**, não 23 suítes reais
falhando; o próprio astra o diz. **Lido** (terra CX-10 e por mim): o bloco
`visual`, sem execução de Chromium.

### Regra ferida

**R10 §2/§3** (contagens pinadas comparadas contra execução real; SKIP silencioso é
FAIL) e **R2 §1**.

### Encaminhamento

`fix-finding` (`build-engineer`; `check_suites.py` e o job `visual`): exigir
`returncode == 0` **e** contagem; imprimir `stderr` quando falhar; `--visual` no
agregador, executado no job `visual`, comparando PASS/FAIL/SKIP com o registro.
Contraprova específica (`qa-engineer`).

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5; o título e a severidade da triagem acima
ficam como foram escritos — ver a divisão abaixo). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1 e §2b.
Linhas reconferidas por mim em HEAD `2fcd552` (instrumentos idênticos a `cee02e9`),
salvo as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA — a metade `returncode` é fato de
  contrato **sem instância viva** nas 24 suítes registradas (23 em `suites` + 1 em
  `heavy`); a metade `visual` é lacuna real de R10 §3/§2.
- **Executado por**: **parcial**. O reprodutor executou — `runpy` sobre o
  agregador real com `subprocess.run` falso (23 processos com rc=87 → 0 problemas);
  sandbox com node REAL (morte/exceção depois da linha-resumo → `[OK]`);
  `--visual` → a suíte visual nunca roda, exit 0. O contra-leitor **não executou**
  (desenho e contexto). A metade `visual` ficou, assim, executada; o `returncode`
  foi reproduzido com node real, sem mock (cenários S1/S2/S6), em 2026-10-25 sobre
  o blob `78b400bc` de `check_suites.py` (conferido: é o de HEAD).
- **Severidade recomendada — dividir com o id**: metade `visual` **alta**
  (contagens pinadas de 151 gates + 37 `skip` sem comparador em lugar algum — o
  padrão E6 que o stage nasceu para matar; o contra-leitor diz média, por
  exposição limitada a redução/`skip` sem FAIL e mitigação parcial por
  `check_mutation` sob trigger); metade `returncode` **média** (janela estreita,
  correção de duas linhas). A severidade "alta" da triagem acima passa a valer só
  para a metade `visual`.
- **Encaminhamento recomendado**: **DIVIDIR**. Este id fica com a metade
  `returncode` — `fix-finding`, `build-engineer`, 1 módulo (`check_suites.py:26-41`
  passa a ler `returncode`; imprimir `stderr` na falha). A metade `visual` nasce
  como **`EA-97a`** (demanda), logo abaixo. O título acima descreve as duas metades
  e foi mantido.

**Correções de cadeia**:

- **"Confirmar ausência de `visual` no código" é impreciso.** O token existe em
  `check_suites.py:49` (censo de cobertura) e `:52` (comentário); o que não existe
  é a **seleção** de `reg['visual']`: `:21` só conhece `heavy`/`suites`, e
  `--visual` é engolido em silêncio como `suites`.
- **"Controle → 23 problemas" depende da perturbação**: +1 uniforme dá 22 (`unset`
  aceita [12, 13]).
- **`stderr` é descartado inteiro**, e a janela do defeito é a morte **depois** da
  linha-resumo (antes dela o agregador pega em `:31`, "sem contagem"). As 3 suítes
  com `process.exitCode = 1` — `tests_022_escalonamento.js:459`,
  `tests_023_leitura.js:596`, `tests_p50_core.js:4421` — são a forma exata do
  cenário S2, mas sem trabalho assíncrono pendente: **nenhuma instância viva**.
- **Assimetria**: o CI (`verify.yml:77-80`, `bash -e`) cobra exit code e não
  contagem; o local cobra contagem e não exit code.
- `check_mutation.py` no job `visual` é por trigger de path (`EA-72`), não camada
  incondicional.
- `specs/016-registro-contra-execucao/refinement.md:300` cita `check_suites.py:25`;
  a seleção está em `:21`. O `verify.yml` que o astra cita em `:39` é `:40`.
- **KI-3 cobre a decisão de AMBIENTE** (Chromium só no CI e no rito do
  proprietário), não a ausência de comparação.
- O único "comparador" visual hoje é a leitura humana de log (`_trilha` de
  `expected_suites.json`).

## EA-97a — o bloco `visual` de `expected_suites.json` não tem comparador em lugar nenhum: 151 gates pinados e 37 `skip` do Playwright nunca são conferidos contra a execução

**Status**: `aberto`

**Severidade (refutação adversarial)**: alta — o padrão E6 (contagem pinada sem
comparador) que o stage `suites` nasceu para matar. O contra-leitor do `EA-97` diz
média, pela exposição limitada a redução ou `skip` sem FAIL e pela mitigação parcial
de `check_mutation` sob trigger de path; a alta é a recomendação da síntese.

**Aberto em**: 2026-10-25, por divisão do `EA-97` na refutação adversarial
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1, §2b).
Execução por script (`--visual` no agregador real), não jsdom. Linhas relidas por
mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/check_suites.py:21` — `block = "heavy" if "--heavy" in sys.argv
  else "suites"`: o agregador só conhece esses dois blocos. `--visual` não é
  reconhecido nem rejeitado — é engolido como `suites`. O token `visual` aparece em
  `:49` (censo de cobertura) e `:52` (comentário).
- `.claude/verify/expected_suites.json:144` — o bloco `visual` pina 4 entradas:
  `playwright` (`pass 67`, `skip 37`), `p50chromium` (27), `p52chromium` (56) e
  `d011chromium` (1) — **151** `pass` e **37** `skip`.
- `.claude/verify/pipeline.yaml` — `grep -i visual` = 0: nenhum stage consome o
  bloco (R10 §9).
- `.github/workflows/verify.yml:75-80` — o job `visual` roda `npm run test:visual`,
  `tests_p50_chromium.js`, `tests_p52_chromium.js` e `tests_011_chromium.js`
  direto; `bash -e` cobra exit code, nunca contagem.
- **Efeito**: suíte visual que perde casos, ou que passa a pular mais, passa se não
  houver FAIL. O único comparador é a leitura humana do log.

### Como foi medido (executado vs. lido)

**Executado** pelo reprodutor do `EA-97`: `--visual` no agregador → a suíte visual
nunca roda, exit 0. **Lido** por mim: o bloco `visual` e os quatro `cmd`. O Chromium
não foi executado (KI-3: execução canônica no job `visual` e no rito do
proprietário).

### Regra ferida

**R10 §3** (contagens pinadas comparadas contra execução real) e **§2** (`skip`
silencioso — a semântica de `skip` do Playwright precisa de decisão); **R10 §9**
(checagem nova entra no `pipeline.yaml`). `design-decisions.md` KI-3 cobre o
ambiente, não esta lacuna.

### Encaminhamento

**Demanda** (2 a 4 arquivos e contrato novo — "`fix-finding`" contradiz
`.claude/skills/fix-finding/SKILL.md:3`, "no máximo 1 módulo"): `tech-lead` desenha;
`build-engineer` implementa. Escopo: parser para o `reporter: list` do Playwright,
que não emite "N PASS · M FAIL"; semântica de `skip` por R10 §2; `requires`; passo
novo em `verify.yml:75-80`; entrada em `pipeline.yaml`. Gate e mutante:
`qa-engineer`. A metade `returncode` segue no `EA-97`.

## EA-98 — o stage `build` (`mutates: false`) regrava `ui_icons_v32.js` na árvore: a verificação escreve em arquivo versionado

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: média.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-05 do astra** e **CX-09 do terra**), com triagem do
orquestrador. Cadeia relida por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/pipeline.yaml:55-57` — stage `build`: `run: python
  .claude/verify/check_build.py`, `mutates: false`.
- `.claude/verify/check_build.py:27` — roda `build_v32_html.py <tmp>` (HTML em
  diretório efêmero).
- `build_v32_html.py:36` — `subprocess.run([sys.executable,
  str(HERE/"generate_icons_v32.py")], …)` **sem** `--check`.
- `generate_icons_v32.py:36` — sem `--check`, `open(out, "w", …)` sobre
  `HERE/"ui_icons_v32.js"` (`:28`, na árvore). `--check` existe (`:29-34`) e é o
  que o stage `icons-check` usa.
- **Efeito**: o stage `mutates: false` abre `ui_icons_v32.js` para escrita. Os
  bytes são idênticos e o `git status` não vê, mas é regravação de arquivo
  versionado durante verificação.
- **Declarado no próprio código**: `check_build.py:8-10` descreve o fato ("o
  gerador de ícones regrava `ui_icons_v32.js` com bytes idênticos por construção")
  como aceito. **Não há entrada em `design-decisions.md` (R13) que o confirme
  como desenho** — por isso o registro; a decisão é do orquestrador/PO.

### Como foi medido (executado vs. lido)

**Executado pelo Codex** (astra CX-05): builder e gerador com `open` interceptado
por buffers — **duas aberturas `w`**, HTML solicitado e `ui_icons_v32.js` na raiz;
nenhum arquivo gravado. terra CX-09 por leitura (não rodou o builder pela mesma
razão). **Lido por mim**: a cadeia.

### Regra ferida

**R7 §3** ("verificação nunca escreve na árvore … todo stage prova `git status`
inalterado" — o `git status` prova conteúdo, não ausência de escrita) e a
classificação `mutates: false`.

### Encaminhamento

`fix-finding` (`build-engineer`): o builder chama o gerador com `--check` na
verificação, ou gera em tmp; a geração efetiva continua operação explícita de
build. `build_v32_html.py` é pinado: repin é do orquestrador (R8).

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1 e §2b.
Linhas reconferidas por mim em HEAD `2fcd552` (instrumentos idênticos a `cee02e9`),
salvo as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2) — clone efêmero de `cee02e9` com
  interceptor de `open` (duas aberturas em `w`: `rebuild.html` em tmp e
  `<raiz>/ui_icons_v32.js`); `mtime_ns` avança a cada execução; a Exp3a reverte uma
  edição local, a Exp3b grava conteúdo novo; corrida sintética: 1 em 60.
- **Severidade recomendada**: média (2/2).
- **Encaminhamento recomendado**: `fix-finding`, `build-engineer`, 1 módulo:
  `build_v32_html.py:36` **sempre** com `--check` (e imprimir `r.stdout` na falha,
  porque `check=True, capture_output=True` engole o "DIVERGE") + `gen_pins` + uma
  linha em `CLAUDE.md:97-98` e no README (o build deixa de regenerar os ícones;
  dependem disso `README.md:114` e `:224`, `package.json:7` e
  `preparar_release.py:53-55`). **Id próprio `EA-98a`** para `tests_ui_m33.js:108`.

**Correções de cadeia**:

- `check_build.py:25` → **`:27`** e `pipeline.yaml:53` é o cabeçalho (`run:` em
  `:55`, `mutates: false` em `:57`) — o corpo já estava certo.
- **Regra**: R7 §3 **e** R10 §8; nenhuma INV (a identidade da classe `generated`
  segue provada pelo stage).
- **`mutates: false` não é rótulo**: `run.sh:100` o consome e o Stop roda
  `--light --no-mutate` (`post-turn-verify.sh:26`). **Nenhum** stage do
  `pipeline.yaml` é `mutates: true`; a flag é derrotada pelo único stage que
  regenera. Isso acontece **a cada turno**, não só no CI.
- **"Bytes idênticos" é condicional**: fonte alterada → conteúdo NOVO em arquivo
  rastreado (Exp3b); edição local → revertida sem aviso (Exp3a).
- **Mensagem invertida no caso 3a**: `check_build.py:48-50` imprime `[FAIL] a execução
  sujou a árvore de trabalho:` com a lista vazia (o `before` tinha a edição, o
  `after` não).
- O CX-09 do terra citava `.last_green`; ele é gitignored (`.gitignore:8`) e fica
  fora de R7 §3.
- **"Gera em tmp" é caro**: obriga a tocar `generate_icons_v32.py`, pinado inline em
  `tests_journey_m45.js:301` (N47) e `tests_p50_core.js:598` (P50-IC4) — 3 arquivos +
  repin legado com trilha (R8 §2).
- **Corrida com `icons-check` e `lint-arch`** (`check_lint_arch.py:50` varre
  `ui_*.js`) no mesmo grupo paralelo (`run.sh:102-103`): 470 em 222.317 sondagens
  viram arquivo parcial (mínimo 0 B); 0 em 40 FAIL com o par literal de comandos —
  FAIL falso raro, nunca PASS falso *(síntese)*.
- **Contradição de registro**: `docs/CHANGELOG_v32.md:61` documenta a regeneração
  ("Build regenera `ui_icons_v32.js` antes da injeção") como contrato do builder;
  `specs/009-leitura-do-relatorio/plan.md:144` e `specs/010-recomendacao-sem-vao/plan.md:305`
  afirmam o oposto ("`ui_icons_v32.js` não é tocado"). O docstring de
  `check_build.py:8-10` não é decisão R13.
- `--check` nasceu em `2234eae` "para o stage icons-check"; a linha
  `build_v32_html.py:36` vem de `e5ccd42` e nunca foi ajustada *(síntese)*.

## EA-98a — a suíte congelada `tests_ui_m33.js` executa `generate_icons_v32.py` SEM `--check` sobre a árvore, como oráculo: o stage `suites` regrava `ui_icons_v32.js`

**Status**: `aberto`

**Severidade (refutação adversarial)**: média.

**Aberto em**: 2026-10-25, a partir do contra-leitor do `EA-98` na refutação
adversarial (`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md`
§2b). **Lido** (a linha foi relida por mim em HEAD `2fcd552`); a execução do stage
`suites` não foi feita por ninguém neste passe.

### Cadeia arquivo:linha → efeito

- `tests_ui_m33.js:108` — `execSync('python3 "'+path.join(__dirname,"generate_icons_v32.py")+'"')`:
  o gerador roda **sem `--check`**, sobre a árvore.
- `generate_icons_v32.py:28` e `:36` — sem `--check`, `open(out, "w", …)` sobre
  `HERE/"ui_icons_v32.js"`; o `--check` existe (`:29-34`).
- `tests_ui_m33.js` é suíte congelada 4.x, registrada em `expected_suites.json` (stage
  `suites`) e pinada em `pins.json:503`.
- **Efeito**: uma **segunda instância, independente do `EA-98`**, da verificação que
  escreve em arquivo versionado — agora dentro de uma suíte, não do stage `build`.

### Regra ferida

**R7 §3** (verificação nunca escreve na árvore) e **R10 §8** (teste não escreve em
arquivo versionado).

### Encaminhamento

Trocar a chamada por `--check` (ou gerar em tmp e comparar). É suíte **congelada**:
edição de `tests_*.js` existente é §29.4 (ver `EA-1`) — **autorização nominal do
proprietário** — e o arquivo é pinado: `gen_pins` no mesmo PR com **repin legado
acompanhado de comentário-trilha** "Identidade anterior" (R8 §2). Dono da suíte:
`qa-engineer`; repin: orquestrador. Pode ir junto do `EA-98`, mas é diff separado —
outro módulo, outro rito.

## EA-99 — o comando que o próprio `guard-data` recomenda contorna a inspeção: o hook mede o índice antes do `git add` da mesma chamada, e o parser não vê `&&` colado nem `$g commit`

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: alta (R11) — vetores novos da família
do `EA-82`.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-04 do astra** e **CX-14 do terra**), com triagem do
orquestrador. Cadeia relida por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.claude/hooks/guard-data.sh:184` — a mensagem de recusa do `EA-82` recomenda
  `git add <caminho1> <caminho2> …  &&  git commit -m "…"`, **numa só chamada**.
- `.claude/hooks/guard-data.sh:189-191` — `cd`, `STAGED=$(git diff --cached
  --name-only)` e `[ -z "$STAGED" ] && exit 0`. `PreToolUse` roda **antes** do
  comando inteiro: o `git add` da mesma chamada ainda não aconteceu, o índice está
  vazio e o hook sai com 0. As checagens da R11 (sessão real, PDF novo, segredo,
  binário > 200 KB) não rodam sobre nada.
- `.claude/hooks/guard-add.sh:98` — recusa só a **forma** `-A`/`--all`/`.`; não
  inspeciona conteúdo.
- `.claude/hooks/guard-data.sh:91` e `.claude/hooks/guard-add.sh:71` —
  `shlex.split(..., posix=True)`; o separador `&&` só é reconhecido como token
  isolado (`guard-data.sh:100` / `guard-add.sh:83`).
- `.claude/hooks/guard-data.sh:156` e `.claude/hooks/guard-add.sh:93` — o parser só
  reconhece Git quando o token é literal `git` ou `*/git`.

### Como foi medido (executado vs. lido)

**Executado pelo Codex** (astra CX-04), **só o parser original, em memória**:
`git commit -am x` → recusado; o composto nominal → `commit` sem recusa;
`git add cliente.session.json&&git commit -am x` → `nao-commit`. **Não** executou
staging, commit nem o despacho real do hook; a sequência posterior decorre da
ordem `PreToolUse` → comando.
**Medido por mim** (`python -I`, `shlex` isolado, sem rodar o hook):
`shlex.split("git add x&&git commit -m y", posix=True)` →
`['git','add','x&&git','commit','-m','y']` (o operador colado vira parte do
argumento); com espaços, `&&` sai como token separado. **Lido** (terra CX-14, e por
mim): `g=git; $g commit …` e `$g add -A` escapam por construção do teste de token
literal. `guard-add.sh:28-32` já declara e aceita o limite de heredoc para outro
interpretador; os vetores acima não estão declarados.

### Regra ferida

**R11 §3** (`guard-data` bloqueia no commit) e **R10 §9**; o `EA-82` (já aberto)
cobre `-a`/`-am` e pathspec — este é o complemento.

### Encaminhamento

`tech-lead` decide a rota: (a) guarda no momento efetivo do commit (hook do
próprio git, `pre-commit`) em vez de `PreToolUse`; ou (b) o hook recusa
composições que alterem o índice na mesma chamada que commita, **e** o texto da
recusa deixa de recomendar o composto. Casos de teste (`qa-engineer`) com
variável, `bash -c`, substituição de comando e operador colado. Ver `EA-82`,
`EA-83`.

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1 e §2b.
Linhas reconferidas por mim em HEAD `2fcd552` (hooks idênticos a `cee02e9`), salvo as
marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2) — hooks reais por stdin a partir do
  repo: composto nominal `git add <p> && git commit -m …` → exit 0/0 (hook de commit
  e hook de add); `a&&git commit -am x` → `nao-commit`, exit 0; `$g commit -am x` →
  exit 0; controles `git commit -am x` → exit 2 e `git add -A` → exit 2. `git add`
  e `git commit` reais **não foram executados** (vedado): o efeito decorre da ordem
  `PreToolUse` → comando, que o próprio hook concede em `guard-data.sh:25-30`.
- **Severidade recomendada**: alta (2/2).
- **Encaminhamento recomendado**: **DIVIDIR**. Este id fica com **(A)** — **tempo +
  recomendação do composto**: extensão do `EA-82` (precedente: Nota 1 do próprio
  `EA-82`), 1 módulo, `guard-data.sh` — recusar statement `git add/rm/mv` antes de
  `git commit` na mesma chamada, **ou** inspecionar a árvore dos paths nomeados, e
  reescrever as linhas `:43` e `:184` para recomendar **duas chamadas**; repin
  (precedente `8878d6a`) e BACKLOG. **(B)** — parser com operador colado, `bash -c`
  e expansão de shell — nasce como **`EA-99a`**, logo abaixo. O título acima
  descreve as duas metades e foi mantido.

**Correções de cadeia**:

- `:153`/`:90` → **`:156`/`:93`** (`t == "git" or t.endswith("/git")`) e a
  tokenização `shlex.split(posix=True)` em `guard-data.sh:91` e `guard-add.sh:71` —
  o corpo já estava certo.
- **"Índice vazio → exit 0" descreve só o composto nominal e não é precondição**:
  com outros arquivos estagiados o hook inspeciona **esses**, nunca o do `add` da
  mesma chamada.
- **Operador colado (`&&`, `;`) sai em `guard-data.sh:171` como `nao-commit` ANTES
  de `:189`** — contorna também a recusa `-a`/`-am` do `EA-82`.
- **A recomendação do composto é desenho declarado**, não acidente:
  `guard-data.sh:42-44` ("cobre 100% do caso legítimo", commit `3521230`,
  2026-10-10) — e contradiz `:33-36` (um hook que roda antes do comando não inspeciona
  conteúdo que o comando criará). Antes de `3521230` o hook não recomendava forma
  nenhuma.
- **A atribuição a R11 §3 é do hook**: `evidence-intake.md:41` diz só "bloqueia no
  commit".
- O astra CX-04 cita `guard-data.sh:90`; o bloco do parser é `:67-167` *(síntese)*.
- **Sem segunda linha de defesa** *(síntese)*: `core.hooksPath` ausente,
  `.git/hooks` só com samples, `deny` sem `Bash`, nenhum stage escaneia dado sensível
  (só um comentário em `check_eol_text.py:33`) e o `baseline` só acusa arquivo sem pin
  e ignora `docs_phase5/**` e `project-memory/**` (`gen_pins.py:29-30`).

## EA-99a — o parser do `guard-data` e do `guard-add` não vê operador colado (`x&&git`, `;`), `bash -c` nem expansão de shell (`$g`): `git add .&&git commit` e `$g add -A` passam pelos dois guardas

**Status**: `aberto`

**Severidade (refutação adversarial)**: alta (R11) — compartilhada com o `EA-99`; fere
também o `EA-37` (`guard-add`) e a recusa de `-a`/`-am` do `EA-82`.

**Aberto em**: 2026-10-25, por divisão do `EA-99` na refutação adversarial
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1, §2b).
Execução por stdin nos hooks reais (2/2 refutadores); `git add`/`git commit` reais não
foram executados. Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `.claude/hooks/guard-data.sh:91` e `.claude/hooks/guard-add.sh:71` —
  `shlex.split(…, posix=True)`: o operador **colado** vira parte do argumento
  (`shlex.split("git add x&&git commit -m y", posix=True)` →
  `['git','add','x&&git','commit','-m','y']`); o operador só é reconhecido como token
  isolado (`guard-data.sh:100`, `guard-add.sh:83`).
- `.claude/hooks/guard-data.sh:156` e `.claude/hooks/guard-add.sh:93` — o parser só
  reconhece Git quando o token é literal `git` ou `*/git`: `$g commit`, `g=git; $g …`
  e `bash -c "git commit -am x"` escapam por construção.
- `.claude/hooks/guard-data.sh:171` — o statement colado sai como `nao-commit` e o
  hook retorna 0 **antes** de `:189`: a recusa `-a`/`-am` do `EA-82` também é
  contornada.
- `.claude/hooks/guard-add.sh:98` — `any(a in ("-A", "--all", ".") for a in args)`:
  `-A&&git` ∉ (`-A`, `--all`, `.`), logo `git add -A&&git commit -m x` passa.
- **Medido (exit 0)**: `git add a;git commit -am x`, `bash -c "git commit -am x"`,
  `git add -A&&git commit -m x`, `git add .&&git commit -m x`, `$g add -A` e
  `$g commit -am x`; controles `-am` → exit 2 e `-A` → exit 2.
- **Efeito**: o vetor que a R11 §3 e o `EA-37` existem para fechar fica aberto por
  uma questão de grafia do comando.

### Como foi medido (executado vs. lido)

**Executado** pelos dois refutadores do `EA-99`, nos hooks reais, por stdin. **Lido**
por mim: as linhas acima. Nenhum comando git real foi executado.

### Regra ferida

**R11 §3** (o `guard-data` bloqueia no commit), **R10 §9**, e o `EA-37`. A mesma
tensão do `EA-85` — "recusar forma não analisável" contra "residual declarado" — está
**ausente** das declarações de limite de `guard-data.sh:52-56` e `guard-add.sh:28-31`.

### Encaminhamento

2 módulos (`guard-data.sh` e `guard-add.sh`; 3 se a correção for içada para
`lib/common.sh`). Nenhum gate commitado cobre os hooks (a bateria do `EA-82` foi em
repo descartável) — logo nasce com **gate + red + mutante** (`qa-engineer` escreve;
`build-engineer` implementa): dois `fix-finding` (um por hook) ou uma demanda
pequena. Correção técnica do colado: `shlex.shlex(s, posix=True,
punctuation_chars=True)`. `$g` e `bash -c` são **classe distinta** (expansão de
shell): exigem a decisão "recusar forma não analisável" **ou** "residual declarado"
antes de qualquer código. Repin dos dois hooks no mesmo PR (R8).

## EA-100 — `run.sh --stage=<nome-inexistente>` termina `0 PASS · 0 FAIL` com exit 0: SKIP silencioso por erro de operador

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: média.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-12 do terra**), com triagem do orquestrador. Cadeia relida
por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/run.sh:22` — `--stage=*) FILTRO="${arg#--stage=}"`.
- `.claude/verify/run.sh:99` — `[ -n "$FILTRO" ] && [ "$nome" != "$FILTRO" ] && continue`:
  um nome que não existe filtra **todos** os stages.
- `.claude/verify/run.sh:115` — imprime `verify: 0 PASS · 0 FAIL`; sem stage
  executado o `FAIL` acumulado é 0 e o script termina em exit 0.
- **Efeito**: `--stage=buidl` (erro de digitação) reporta verde. Não há validação
  do nome contra o `pipeline.yaml`.

### Como foi medido (executado vs. lido)

**Lido** (terra CX-12 e por mim). O terra **não executou** o wrapper
(`mktemp` em `/tmp` bloqueado no sandbox). **Não medi por execução.**

### Regra ferida

**R10 §2** ("SKIP silencioso é FAIL").

### Encaminhamento

`fix-finding` (`build-engineer`, um arquivo): stage desconhecido → exit ≠ 0
nomeando o stage; exigir ≥ 1 stage selecionado. Negativo (`qa-engineer`).

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1 e §2b.
Linhas reconferidas por mim em HEAD `2fcd552` (instrumentos idênticos a `cee02e9`),
salvo as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2) — cópia isolada: `--stage=naoexiste`,
  `--stage=buidl` e `--stage=Baseline` → exit 0; controle com `env-doctor` ausente →
  `[FAIL]`, exit 1. O contra-leitor não rodou o `run.sh`; executou a irmã
  `compliance-audit.sh --rule=naoexiste` → `compliance: 0 PASS · 0 FAIL · 0 WARN`,
  rc=0 (**reexecutada por mim em 2026-10-25**, mesmo resultado, árvore inalterada —
  é o `EA-100a`).
- **Severidade recomendada**: média (2/2).
- **Encaminhamento recomendado**: `fix-finding`, `build-engineer`, 1 módulo
  (`run.sh`: validar `FILTRO` contra os nomes do `pipeline.yaml`, exigir ≥ 1 stage
  selecionado, tratar `--stage=` vazio, mensagem nomeada + exit ≠ 0 nos moldes de
  `run.sh:50`) + `gen_pins` (`pins.json:275`; precedente `EA-15`, `485b66f` +
  `8fbe33f`). O negativo é **prova executada registrada no verbete**, no estilo do
  `EA-15` — não suíte nova (obrigaria `expected_suites.json`). A irmã
  `compliance-audit.sh --rule=` é o **`EA-100a`**, nunca o mesmo diff.
- **Ressalva de processo (uma linha)**: o reprodutor do `EA-100` executou
  `run.sh --stage=naoexiste` na worktree apesar da restrição (caminho sem stage;
  árvore e `.last_green` medidos inalterados).

**Correções de cadeia**:

- **O filtro é UMA linha**: `run.sh:99`; o exit vem de `:119` (`exit "$FAIL"`), não
  de `:115` (que só imprime). O terra citava `:19/:97` → `:22/:99`.
- **Silêncio total**: `continue` nu, ao contrário de `:100-101`
  (`[SKIP] nome (mutates)` / `(heavy, --light)`, desde `f71eb8b`) — a única rota de
  skip sem nome. É a forma precisa da violação de R10 §2 e a prova de que não é
  decisão.
- **Comparação exata e case-sensitive**: `--stage=Baseline` → 0/0.
- **`.last_green` NÃO é gravado**: `run.sh:116` exige `-z "$FILTRO"`; o
  `state-eval.sh:36-45` fica imune.
- **Nenhum chamador automatizado filtra** (`verify.yml:40`, `post-turn-verify.sh:26`);
  todos os `--stage=` do repo nomeiam stages existentes (`state-eval.sh:31`, skill
  `baseline`, specs) — a exposição é só interativa, mas agentes citam
  `run.sh --stage=X` como evidência (`mutation-matrix.json:1968`, e verbetes deste
  backlog).
- **Borda irmã** *(lida, não executada)*: `--stage=` com valor vazio → `FILTRO=""` →
  run **completo** (que gravaria `.last_green`).
- **Não é regressão**: o filtro é mudo desde a wave-0 (`f71eb8b`).
- `run.sh` está fora da população de mutação por escolha; não há precedente de
  harness sobre `.sh`; o `EA-15` registrou "não cria gate sobre a forma da saída do
  run.sh".
- O "Não medi por execução" do corpo está **superado**: medido.

## EA-100a — `compliance-audit.sh --rule=<nome-inexistente>` termina `compliance: 0 PASS · 0 FAIL · 0 WARN` com exit 0: o mesmo filtro mudo do `run.sh`, na auditoria da própria configuração

**Status**: `aberto`

**Severidade (refutação adversarial)**: média — irmã do `EA-100`.

**Aberto em**: 2026-10-25, a partir do contra-leitor do `EA-100` na refutação
adversarial (`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md`
§2b). **Executado** pelo contra-leitor e **reexecutado por mim** em HEAD `2fcd552`:
`bash .claude/verify/compliance-audit.sh --rule=naoexiste` → `compliance: 0 PASS ·
0 FAIL · 0 WARN`, rc=0, `git status --porcelain` vazio depois.

### Cadeia arquivo:linha → efeito

- `.claude/verify/compliance-audit.sh:19` — `for arg in "$@"; do case "$arg" in
  --rule=*) FILTRO="${arg#--rule=}";; esac; done`.
- `.claude/verify/compliance-audit.sh:22` — `secao() { [ -z "$FILTRO" ] || [
  "$FILTRO" = "$1" ]; }`: um nome que não é de nenhuma seção nunca casa.
- Nenhuma seção roda; o rodapé imprime `compliance: 0 PASS · 0 FAIL · 0 WARN` e sai
  com `exit "$FAIL"` = 0.
- **Efeito**: `--rule=backlgo` (erro de digitação) reporta verde, sem nomear nada.
  Mesmo idioma de `run.sh:99` (`EA-100`).

### Regra ferida

**R10 §2** (SKIP silencioso é FAIL). Nenhuma decisão R13 o confirma como desenho.

### Encaminhamento

`fix-finding`, `build-engineer`, 1 módulo (`compliance-audit.sh`: validar `--rule=`
contra os nomes das seções, exigir ≥ 1 seção selecionada, mensagem nomeada + exit
≠ 0) + `gen_pins` (`pins.json:210`). **Diff separado do `EA-100`** (outro módulo).
Negativo: prova executada no verbete, como no `EA-100`.

## EA-101 — o `lint-arch` anuncia "módulos novos" mas só aplica IIFE e `innerHTML=` a `ui_p5*` e `ui_d0*`: três módulos de demanda ficam fora

**Status**: `resolvido`

**Severidade (triagem do orquestrador)**: média.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-13 do terra**), com triagem do orquestrador. Cadeia relida
por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/check_lint_arch.py:37-38` — `PREFIXOS_NOVOS =
  ("ui_p5*_v32.js", "ui_d0*_v32.js")`; `novos` = glob desses padrões.
- `.claude/verify/pipeline.yaml:60` (stage `lint-arch`, descrição): "innerHTML=
  proibido e IIFE exigido em módulo novo (ui_p5* + ui_d0*)".
- **Efeito**: `ui_curation_v32.js`, `ui_curation_edit_v32.js` e `ui_ondas_v32.js`
  — módulos de demanda que **não casam** nenhum dos dois padrões — ficam fora da
  regra IIFE/`innerHTML=` (R9 §1, §9).

### Como foi medido (executado vs. lido)

**Lido** (terra CX-13) e **medido por mim** com `grep -c`: nos três arquivos há
**0** ocorrências de `.innerHTML =` e **≥ 1** de `(function` (6, 4 e 16). Ou
seja: hoje os três **cumprem** a regra que o lint não confere. O achado é de
cobertura do sensor, não de violação presente.

### Regra ferida

**R9 §1 e §9** (bloqueante para módulo novo) / **R10** (checagem no `pipeline`).

### Encaminhamento

`fix-finding` (`build-engineer`, um arquivo): derivar o conjunto de módulos novos
de dado (`bridges.json`/`current_phase.json`) ou usar allowlist explícita dos
legados; os três módulos acima entram sem exceção, pois já cumprem.

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1.
Linhas reconferidas por mim em HEAD `2fcd552` (`ui_curation_v32.js`,
`ui_curation_edit_v32.js` e `ui_ondas_v32.js` idênticos a `cee02e9`), salvo as marcadas
*(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2) — glob reproduzido (6 casados); o
  lint real → "6 módulos novos… 0 problema(s)"; cópias em scratch com `innerHTML=` e
  sem `(function` nos 3 módulos → 0 problemas, exit 0; controles em `ui_p50_shell`
  (1 FAIL) e `ui_d022_ondas` (2 FAIL); o conjunto ampliado reprova o mutante.
- **Severidade recomendada**: média (2/2) — lacuna de sensor, zero violação presente.
- **Encaminhamento recomendado**: `fix-finding`, `build-engineer`:
  `check_lint_arch.py:37` → `ui_*_v32.js` **menos** uma allowlist nominal
  {`ui_ux`, `ui_target`, `ui_session`, `ui_refinement`, `ui_journey`, `ui_icons`,
  `ui_v32`} (medido: 9 módulos varridos, 0 FAIL em HEAD) + `gen_pins`
  (`pins.json:202`) + **registrar a convenção de nomenclatura da 011** em R9, na skill
  `new-demand` e nos templates (senão o 25º módulo repete). Fazer **antes ou dentro da
  025**: `ui_curation_v32.js` é exatamente o arquivo que a 025 toca — um `innerHTML=`
  ali passaria verde.

**Correções de cadeia**:

- **A regra 4 (bridges, `check_lint_arch.py:50`, glob `ui_*.js`) ALCANÇA os três**
  (`__CURATION`, `__P53CUR`, `__QS22` registrados); o buraco é das regras 2 e 3 —
  não "fora do lint-arch".
- **"Regra ferida R9 §1 e §9" → nenhuma ferida hoje**: IIFE em `ui_curation_v32.js:57`,
  `ui_curation_edit_v32.js:35` e `ui_ondas_v32.js:27` (todas com guarda
  `__installed`, conferido); 0 `innerHTML =` nos três (conferido). O ferido é o
  **cabeçalho** da R9 ("bloqueante para módulo NOVO (stage `lint-arch`)") —
  enforcement sem alcance sobre 3 dos 5 módulos novos de `current_phase.json`
  *(síntese)*.
- **"Derivar de dado (`bridges.json`/`current_phase.json`)" é impraticável**:
  `current_phase.json:40` é prosa; `bridges.json` tem owner para os legados também.
- **Origem**: não é "o lint que ficou estreito" — a 019 e a 022 batizaram módulos
  **fora** da convenção que a 011 criou para o lint alcançar (`plan 011:27-31`;
  `84c92a1` recusou o glob largo por 11 FAILs em 6 módulos 4.x). A 019 cobriu
  `ui_p52_support` por acaso do prefixo e descobriu dois na mesma demanda, com
  bridges `__P53*` de uma fase 5.3 não aberta; os checklists R9 dos plans (019:100 e
  :103; 022:81-82) não têm gate nem `spec-validate` *(síntese)*.
- **Fraquezas preexistentes, não reportar (R13)**: o teste de IIFE é substring
  (`( function` engana) e `ui_d0*` não casa `ui_d1NN`.
- CX-13 `check_lint_arch.py:36` → **`:37`**. `ui_ondas_v32.js:29-36` refere-se à
  regra 4 e não contradiz.

### Fecho (2026-10-25) — o conjunto varrido passou a ser "tudo menos a lista nominal dos legados"

Nota acrescentada por `doc-writer` (R2 §5), por acréscimo: nada acima foi reescrito;
a única linha alterada neste bloco é a de status, `aberto` → `resolvido`.

**Qual linha do cabeçalho mandou o status**: "Rito de escrita da linha de status",
`BACKLOG.md:62-63` — *"fix-finding §4 ("o que foi feito", com PR/commit registrado
na prosa) → `resolvido`"*. A letra pede commit/PR **citado na prosa**, não PR
mesclado; e o fix-finding está no §4 (fechar), não "em curso" (`BACKLOG.md:66-67`).
Na data deste registro o PR #113 está **aberto** (`gh pr view 113`: `state: OPEN`,
`mergedAt: null`, base `develop`, head `ecbd23b`); a merge é do usuário (R14) e esta
nota não a antecipa. O bloco do `EA-101` nasce no PR #112 (registro da auditoria
externa); a branch do fix parte de `eec8370`, HEAD dele.

1. **O que mudou** (descrito a partir do diff de `1def6a9` e `8c6b913`):
   - **`.claude/verify/check_lint_arch.py`, regras 2 (`.innerHTML =` proibido) e 3
     (IIFE obrigatório)**. Saiu o `PREFIXOS_NOVOS = ("ui_p5*_v32.js",
     "ui_d0*_v32.js")` da cadeia acima (`:37-38`). Entrou `LEGADOS_4X`, um
     `frozenset` **nominal e fechado** (`:56-63`) com seis nomes: `ui_ux_v32.js`,
     `ui_target_v32.js`, `ui_session_v32.js`, `ui_refinement_v32.js`,
     `ui_journey_v32.js` e `ui_icons_v32.js`. O conjunto varrido é agora
     `Path(".").glob("ui_*_v32.js")` **menos** `LEGADOS_4X` (`:64`). O sentido da lista
     inverteu: o **excluído** é nominal (legado) e o **incluído** é o resto — módulo
     novo entra por construção, qualquer que seja o prefixo do nome. O
     comentário-trilha no código (`:38-55`) registra que os seis são exatamente os
     que a 011 (`84c92a1`) recusou varrer por 11 FAILs, e que entrada nova na lista
     é ato de governança (`:48-50`). Docstring do arquivo atualizada junto.
   - **Alcance medido**: de 6 módulos varridos (os 5 `ui_p5*` mais
     `ui_d011_prioridade_v32.js`) para **9**. Os três que entram são os do achado:
     `ui_curation_v32.js`, `ui_curation_edit_v32.js` e `ui_ondas_v32.js`. A
     fraqueza "`ui_d0*` não casa `ui_d1NN`", anotada na refutação, deixa de existir:
     não há mais prefixo a casar.
   - **Intocado**: a regra 1 (pureza do engine, `:30-36`) e a regra 4 (bridges, glob
     `ui_*.js`, `:73-82`). As mensagens de FAIL das regras 2 e 3 são as mesmas; a
     única linha de saída que mudou é a `[OK]` (`:71`): "9 módulos novos
     (ui_*_v32.js menos 6 legados 4.x)".
   - **`.claude/verify/pipeline.yaml:60`**, só o texto de `desc` do stage
     `lint-arch`: "(ui_p5* + ui_d0*)" → "(ui_*_v32.js menos LEGADOS_4X)". `run:`,
     `parallel:`, `mutates:`, `heavy:` e a ordem dos stages ficaram como estavam.
   - **Rota do Encaminhamento**: a *allowlist explícita dos legados* (a segunda
     alternativa). A derivação "de dado" (`bridges.json`/`current_phase.json`) ficou
     descartada pela correção de cadeia da refutação (impraticável:
     `current_phase.json:40` é prosa). **A regra não foi afrouxada** (R10 §1): as
     mesmas duas verificações alcançam mais arquivos, nunca menos.

2. **A prova** (executada pelo `build-engineer`, Sonnet 5.5; números dos corpos dos
   commits `1def6a9` e `8c6b913`):
   - Árvore: `[OK] 9 módulos novos (ui_*_v32.js menos 6 legados 4.x): zero
     innerHTML= e IIFE presente`; `lint-arch: 0 problema(s)`, exit 0.
   - Negativos em árvore efêmera (cópia com mutante; nada escrito na árvore):
     `ui_curation_v32.js` com `.innerHTML =` → 1 FAIL; `ui_curation_edit_v32.js` sem
     IIFE → 1 FAIL; `ui_ondas_v32.js` sem `(function` → 1 FAIL; módulo sintético
     `ui_zz_novo`, fora de qualquer prefixo → 2 FAIL; os três mutantes juntos → 3
     FAIL, exit 1. **O lint anterior deu `0 problema(s)`, exit 0, sobre essa mesma
     árvore** — é a medida de que o sensor era cego a eles. Controle sem mutante: 9
     varridos, 0 FAIL (os legados 4.x, com `innerHTML =`, seguem fora).
   - `run.sh --stage=lint-arch`: `[PASS] lint-arch`, `1 PASS · 0 FAIL` (nos dois
     commits; no segundo prova também que o `run.sh` parseia o `pipeline.yaml`
     editado). `compliance-audit.sh`: `17 PASS · 0 FAIL · 0 WARN` (nos dois).
     `git status --porcelain` só com o arquivo tocado (nos dois).
   - Baseline `520/520` depois do repin `ecbd23b` (`gen_pins.py`, orquestrador).
   - **Reconferência minha**, em `ecbd23b` e antes de escrever esta nota:
     `python .claude/verify/check_lint_arch.py` → três `[OK]` (engine puro; 9
     módulos novos; 20 bridges registrados) e `lint-arch: 0 problema(s)`, exit 0;
     `python .claude/verify/check_baseline.py` → `520/520 pins conferem · 0
     divergentes · 0 ausentes · 0 sem pin`. Os negativos não foram refeitos por mim.
   - **O que esta prova é**: negativos manuais em árvore efêmera. Nenhum gate
     commitado trava a nova varredura: `check_lint_arch.py` segue na população de
     mutação como dívida declarada (`mutation_population.json:42-45`, "Sem harness
     desde que nasceu", prazo `2026-12-31`). Este fix não a criou nem a paga.

3. **Desvio declarado — `ui_v32.js` fora da lista**: a allowlist recomendada pela
   refutação tinha sete nomes (os seis acima e `ui_v32`); a implementada tem seis.
   `ui_v32.js` **não casa** o glob `ui_*_v32.js` (falta o `_` antes de `v32`):
   conferido por `ls ui_*_v32.js` na worktree — 15 arquivos, `ui_v32.js` ausente,
   15 = 9 varridos + 6 legados. Uma entrada para ele seria inerte; o comentário do
   código diz isso (`:54-55`).

4. **Fraquezas preexistentes, anotadas e NÃO corrigidas** (fix-finding §3: diff
   mínimo, nada de "limpar de passagem"; o diff não toca estas linhas). Sem id: a
   refutação as classificou "não reportar (R13)"; a tabela de
   `design-decisions.md` não as lista, e a confirmação formal, se desejada, é do
   `product-owner`.
   - **IIFE por substring** (`:69`, `"(function" not in src`): `( function` com
     espaço não casa; e, pela leitura da expressão, qualquer `(function` no arquivo
     (um callback, um comentário) satisfaz o teste sem o módulo ser IIFE. A segunda
     metade é leitura do código, não medida por execução.
   - **O `[OK]` das regras 2/3 depende do contador global** (`:71`, `... if fails
     == 0 else ""`; `fails` é compartilhado, `:24-28`): um FAIL da regra 1 (engine
     impuro) faz a linha `[OK]` das regras 2/3 sair vazia mesmo com as duas limpas.
     A saída deixa de distinguir "2/3 limpas" de "2/3 não reportadas".

5. **Pendência que nasce e fica fora deste PR — registrar a convenção**: "módulo
   novo = qualquer `ui_*_v32.js` fora de `LEGADOS_4X`" hoje só vive no
   comentário de `check_lint_arch.py:38-55`. Não consta de R9
   (`.claude/rules/modularity.md`), de `.claude/templates/plan.md:24` (o checklist
   R9 ali é IIFE + `__installed`, bridge, CSS por prefixo) nem da skill
   `new-demand` — conferido por `grep` de `ui_*`, `ui_p5`, `prefixo` e `nomenclatura`
   nos três; o item vem da refutação ("senão o
   25º módulo repete"). Dono: `tech-lead` (R9, skill, templates) com `doc-writer`
   (registro). É **encaminhamento, não defeito**: sem id novo. O que a convenção
   precisa dizer, porque é o residual do desenho: o alcance das regras 2/3 passa a
   depender do **nome** casar `ui_*_v32.js`; um arquivo de UI nomeado fora desse
   glob (por exemplo `ui_foo.js`) continua fora das regras 2 e 3 — a regra 4 o
   alcança, pelo glob `ui_*.js` (`:76`).

6. **Não executado, declarado**: a campanha `d011` (`node tests_011_mutants.js`) não
   foi reexecutada nesta demanda. Ela importa porque o mutante `D011-M7`
   (`tests_011_mutants.js:338-345`) usa **este lint** como carrasco (`LINT_PY`, `:70`;
   oráculo `lint`, `:343`), casando por regex a mensagem de FAIL sobre
   `ui_d011_prioridade_v32.js`. Pela leitura do diff, a mensagem não mudou e esse
   módulo segue no conjunto varrido — é leitura, não execução. `check_lint_arch.py`
   também **não** está em `targets` da `d011` (`mutation_map.json`, harness `d011`),
   de modo que, pelo desenho do stage `mutation` (gatilho por path, `pipeline.yaml`),
   mexer nele não a dispara. Quem decide se reexecuta é o `qa-engineer`.

7. **Commits, PR e trilha de modelos**: `1def6a9` (fix em `check_lint_arch.py`) e
   `8c6b913` (`desc` em `pipeline.yaml`), ambos do `build-engineer`, Sonnet 5.5
   (trailer dos commits; `model: sonnet` em `.claude/agents/build-engineer.md:5`);
   `ecbd23b` (repin de `check_lint_arch.py` e `pipeline.yaml`), do orquestrador,
   trailer Claude Fable 5.1; PR #113 (`fix/EA-101-lint-arch-modulos-novos` →
   `develop`, aberto). Este registro: `doc-writer`, Sonnet 5.5 (`claude-sonnet-5-5`,
   lido do ambiente; `model: sonnet` em `.claude/agents/doc-writer.md:5`) — sem
   desvio do modelo declarado nos agentes.

## EA-102 — três ids `EA-*` são citados sem verbete no backlog: `EA-59`, `EA-60`, `EA-63`

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: baixa (R12).

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-07 do astra**), com triagem do orquestrador. Censo refeito
por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- Censo dos headings `^## (~~)?EA-n` de `.claude/BACKLOG.md`: **87 verbetes**,
  máximo `EA-90`; as lacunas são **exatamente 59, 60 e 63**.
- Citados: `EA-60` em `.claude/BACKLOG.md:5782` (e em `:6636`, `:6653`, `:6699`,
  `:6715`, `:6719`, `:6723` — o `EA-70` o chama "reincidência do `EA-60`");
  `EA-59`/`EA-60` em `:5880`; `EA-59`/`EA-63` em `:5998`. No produto,
  `ui_p52_workspace_v32.js:143`, `:1078` e `:1603` (`EA-60`), `:665`, `:675` e
  `:696` (`EA-63`), `:2428` e `:2527` (`EA-59`).
- **Origem recuperável no git** (`git log --grep`): `EA-59` — `4279cbc`, `cb8beed`,
  mesclado como PR #84 (`c80b486`, 2026-09-15); `EA-60` — `172e1d1` (2026-09-15),
  `08d78cc`, `b5d34bf`, `b1a940b` (**PR de entrada não identificado por mim**);
  `EA-63` — `87fc01f`, `e6139bf`, mesclado como PR #86 (`31ea762`, 2026-09-17).
  Os commits são `fix(EA-n)`; **não** há verbete que registre status, causa ou
  cadeia.
- **Efeito**: lacuna de rastreabilidade; não prova correção indevida (o próprio
  astra o diz).

### Divergência com a triagem do orquestrador, anotada

A triagem apontou também `EA-4`, `EA-5`, `EA-6` e `EA-19` como ausentes. **Estão
presentes**, sob a forma de refutado riscado (`## ~~EA-4 …~~` em
`.claude/BACKLOG.md:661` e análogos): o censo por `^## EA-n` os perde; o por
`^## (~~)?EA-n` os acha. A lista deste achado é, portanto, **só 59, 60 e 63**.

### Como foi medido (executado vs. lido)

**Executado pelo Codex** (astra CX-07): o censo (87 verbetes, lacunas 59/60/63).
**Medido por mim**: o mesmo censo, por script, com o padrão corrigido acima.

### Regra ferida

**R12** ("achados vão ao backlog com id permanente").

### Encaminhamento

`doc-writer`: escrever os três verbetes retroativos (`resolvido`, com PR/commit e a
cadeia recuperável nos commits acima), preservando a numeração; conferir se outros
`EA-*` citados não têm destino. Um gate de referência (`EA-n` citado sem heading) é
instrumento novo e fica para decisão do proprietário.

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5; o corpo acima, que diz "PR de entrada não
identificado por mim", **não** foi reescrito — esta subsecção o supera). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1. Fatos
de git e de `gh` reconferidos por mim em 2026-10-25, salvo os marcados *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2) — censo por script (87 headings
  tolerantes, máximo `EA-90`, lacunas [59, 60, 63]; em HEAD, 101 verbetes até
  `EA-104`, mesmas lacunas); `git log --all -S/-G` vazio; `git grep` fora do backlog
  = 48 ocorrências, só em produto; `gh pr view 85`.
- **Severidade recomendada**: baixa (2/2).
- **Encaminhamento recomendado**: `fix-finding` doc-only, `doc-writer`: três
  verbetes retroativos `resolvido`, na **posição numérica** entre o `EA-58` (`:5619`)
  e o `EA-61` (`:5778`), com a linha de status canônica, + `gen_pins` (o backlog é
  pinado, R8 §1). Um gate de referência (`EA-n` / `[[EA-n]]` citado sem heading) é
  instrumento novo (R10 §9) e fica como **demanda do proprietário**.

**Correções de cadeia**:

- **A metade "`EA-4`, `EA-5`, `EA-6` e `EA-19` ausentes" é FALSA**, e o corpo já a
  desfazia: existem como `## ~~EA-n — …~~` em `:661`, `:764`, `:863` e `:1588`
  (conferido), com a linha de status `refutado` e o corpo riscado (R2 §5). O parser
  canônico (`compliance-audit.sh:407`, `^## (?:~~)?(EA-\d+[a-z]?)\b`, "tolera refutado
  riscado") os conta. A inclusão nasceu na triagem, não no Codex.
- **O "87 verbetes" do astra JÁ é a contagem tolerante** (83 pela estrita).
- **Citações dos três ids, em HEAD** (conferidas por `grep`): `EA-59` em `:5880` e
  `:5998`; `EA-60` em `:5782`, `:5880`, `:6640` (heading do `EA-70`), `:6657`,
  `:6703`, `:6719`, `:6723` e `:6727` (`[[EA-60]]`, o único wikilink pendente de 50);
  `EA-63` em `:5998`.
- **PR de entrada do `EA-60` identificado: #85** (`fix/ea60-editor-e-linguagem`,
  `MERGED` 2026-09-17T19:55:07Z — `gh pr view 85`). O `mergeCommit` `e0d70db` é
  `chore(EA-62): gen_pins`, um commit simples (conferido). Os commits `172e1d1`,
  `b5d34bf`, `08d78cc` e `b1a940b` entraram na `develop` pelo merge do **#86**
  (`31ea762`, 2026-09-17, 2º pai `e6139bf`): `git merge-base --is-ancestor 172e1d1
  31ea762^1` → **não**; `… 31ea762^2` → sim (conferido).
- **`EA-59` inclui também** `366302e` (o principal) e `6f77ef9` (o repin) — o corpo
  listava só `4279cbc` e `cb8beed`.
- **Natureza dos três commits**: lotes dos "treze apontamentos do proprietário sobre
  a v3.2.5" sob a delegação de 2026-08-29 — `366302e`: itens 1, 2, 3, 4, 5 e 10;
  `172e1d1`: 9, 11, 12 e 13; `87fc01f`: 6 *(síntese)*. A rota `fix-finding`
  ("achado registrado", `.claude/skills/fix-finding/SKILL.md:3`) correu três vezes
  **sem achado**. Os verbetes retroativos devem registrar também o **não entregue**:
  o item 12 → `EA-61`; o 13, parcialmente revertido em `08d78cc` → `EA-62`; o 7/8 →
  `EA-56`/`EA-58`; e a dúvida "setas com ponta?" em `87fc01f`.
- **Regra**: `documentation.md:48-50` + o namespace do preâmbulo deste arquivo
  (`:42-43`). Nenhum instrumento resolve `[[EA-n]]` *(síntese)*.

## EA-103 — o workflow de CI referencia Actions por tag móvel e não declara `permissions:`

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: baixa (cadeia de suprimentos).

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-17 do terra**), com triagem do orquestrador. Cadeia relida
por mim em `cee02e9`.

### Cadeia arquivo:linha → efeito

- `.github/workflows/verify.yml:27`, `:31`, `:34`, `:58`, `:62`, `:65`, `:97`,
  `:98` — `actions/checkout@v7`, `actions/setup-python@v7`,
  `actions/setup-node@v7`: **tag móvel**, não SHA (8 ocorrências de `uses:`).
- `grep permissions` em `verify.yml`: **zero** — nenhum bloco `permissions:` por
  job ou global; vale o default do repositório.
- `.github/workflows/verify.yml:50` — `GITHUB_TOKEN: ${{ github.token }}` é entregue
  **de propósito** ao passo de compliance (`:43` é o nome do passo; o comentário
  `:46-49` cita "D016-PROT1" — intervalo corrigido in loco em 2026-10-25; eu havia
  escrito `:44-49`, e `:45` é o `env:`). Não é o defeito; é o que um `permissions:`
  mínimo limitaria.

### Como foi medido (executado vs. lido)

**Lido** (terra CX-17 e por mim); inspeção estática. O terra não pôde consultar
permissões efetivas nem proteção de branch; exploração não comprovada.

### Regra ferida

Nenhuma das R1–R14 de forma literal; é postura de cadeia de suprimentos.
Candidata a decisão do proprietário se vira regra.

### Encaminhamento

`build-engineer`: fixar as Actions em SHA revisado com a versão humana em
comentário; `permissions: contents: read` por job (o que precisar de mais declara
o mínimo próprio). Mudança em arquivo pinado: repin do orquestrador.

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5; a imprecisão `:44-49` → `:46-49` do corpo
foi corrigida **in loco**). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1.
Linhas reconferidas por mim em HEAD `2fcd552`, salvo as marcadas *(síntese)*.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA — a perna das tags é sustentada e
  sem mitigação; a perna `permissions:` / token fica rebaixada a postura (o default
  externo já é seguro).
- **Executado por**: os dois refutadores (2/2) — `gh api …/actions/permissions` e
  `…/permissions/workflow`, rulesets, `matching-refs/tags/v7` e o log do run
  `39392713758`.
- **Severidade recomendada**: baixa (2/2).
- **Encaminhamento recomendado**: `fix-finding`, `build-engineer`, 1 módulo
  (`verify.yml`: os 8 `uses:` → `@<sha> # vX.Y.Z` + `permissions: contents: read` no
  topo) + `gen_pins` (`pins.json:277`); evidência = run do próprio PR
  (`build-engineer.md:31` *(síntese)*). `dependabot.yml` (automação que abre PRs) e o
  toggle `sha_pinning_required` são **decisão do proprietário**, fora do fix.

**Correções de cadeia**:

- `verify.yml:43` → **`:50`**: `:43` é o nome do passo, `:45` o `env:`, `:46-49` o
  comentário D016-PROT1/G6 (`9a460f5`); o `GITHUB_TOKEN` está em `:50`.
- **6 → 8 `uses:`**: `:27`, `:31`, `:34`, `:58`, `:62`, `:65` e **`:97`, `:98`** (job
  `fecho`, `83a88e2`).
- **A perna `permissions:` está rebaixada a postura.** "Sem permissões mínimas" é
  literalmente verdadeiro, mas o token efetivo **já é read-only**
  (`default_workflow_permissions: "read"`, `can_approve_pull_request_reviews: false`;
  log do run: Contents/Metadata/Packages read). O defeito é **dependência de default
  externo ao workflow**.
- **"Token entregue ao passo de compliance" não é defeito**: decisão registrada
  (`spec.md:545` G6/E016-6 *(síntese)*), consumidor único `check_branch_protection.py`
  (GET-only; `compliance-audit.sh:72-73`, `metadata: read` por T6) — e o mesmo token
  chega a todo passo de todo job via `checkout persist-credentials:true` e `token:`
  default de `setup-node`/`setup-python`. Sair da cadeia.
- **A tag móvel é fato medido**: `setup-python@v7` = `5fda3b95` (v7.0.0) nos runs da
  selagem de 2026-10-20 → `6d4fd22b` (v7.1.0, commit de 2026-10-22); `checkout`
  (v7.0.0 → v7.0.1) e `setup-node` (v7.0.0 → v7.1.0) também. A plataforma canônica
  se moveu sob a selagem. Camada de plataforma desligada: `allowed_actions: "all"`,
  `sha_pinning_required: false`; sem dependabot; `pins.json:277` pina os bytes do yml,
  não o commit da tag.
- **Regra**: nenhuma R1–R14 literal; espírito de R7 §4 / R10 §5 (a leitura literal
  acusaria também `ubuntu-latest` e `node-version: "24"`).
- `contents: read` não quebra nada medível (`check_fecho --pr` só lê env;
  `evidence-bridge` sem token).
- **Nota lateral (decisão do proprietário, NÃO registrada como achado)**: `main` não
  tem ruleset — `gh api …/rules/branches/main` → `[]`; o ruleset 21381133 inclui só
  `refs/heads/develop`. R14 diz que `main` só recebe código via release. Executado.
  Com o token read-only, não amplifica o `EA-103`.

## EA-104 — o README manda obter "o artefato da release" e baixar `releases/latest` com nome da v3.2.7, contra a v3.2.11 que ele mesmo declara

**Status**: `aberto`

**Severidade (triagem do orquestrador)**: média — incidência viva do `EA-64`.

**Aberto em**: 2026-10-25, a partir da auditoria externa do Codex de 2026-10-20
sobre `ba77134` (**CX-06 do astra** e **CX-15 do terra**), com triagem do
orquestrador. Cadeia relida por mim em `cee02e9`. Escapou ao passe de selagem
(PR #111).

### Cadeia arquivo:linha → efeito

- `README.md:19` e `:33-35` — declaram a v3.2.11 corrente, com tag e registro.
- `README.md:37-39` — manda tratar "o artefato da release" como byte-idêntico ao em
  uso. A v3.2.11 **não tem GitHub Release** (a última Release é a v3.2.9;
  `docs_phase5/SELAGEM_V3_2_11.md`, pendência 11).
- `README.md:73-74` — manda baixar `releases/latest` e dá o nome
  `quickscan_secops_soccmm_v3_2_7.html`: arquivo congelado de outra versão.
- `tests_p52_layout.js:1707` (gate `V322-DOC3`; corrigido in loco em 2026-10-25 — eu
  havia escrito `:1756`, que é o regex de versão dentro do corpo do gate) — compara
  declarações de versão dentro do README; não confere a instrução de obtenção.
- **Efeito**: quem segue o README obtém a v3.2.9 (a última Release) com um nome de
  arquivo que não é o dela, enquanto o README diz que a versão corrente é a v3.2.11.

### Como foi medido (executado vs. lido)

**Lido** (astra CX-06 e terra CX-15, e por mim): a contradição é local ao arquivo.
Nenhum dos dois consultou o destino remoto de `releases/latest`.

### Regra ferida

R12 (documentação que descreve o produto como ele é); manifestação concreta do
`EA-64`, que segue `aberto`.

### Encaminhamento

Tratado pelo **PR de registro da auditoria externa**
(`chore/registro-auditoria-codex`, commit próprio sobre `README.md`): a v3.2.11 é
obtida pela tag `v3.2.11` (quando criada) ou pelo artefato de `deploy/` do
proprietário, com SHA-256 e tamanho; nenhum nome de arquivo congelado de outra
versão. O status só vira `resolvido` depois do merge, e por quem o escrever com a
referência do PR (R2 §1). O `EA-64` não fecha: o remédio de raiz (registro
rastreado escrito por `preparar_release.py`) continua não feito.

### Refutação adversarial de 2026-10-25

Nota acrescentada por `doc-writer` (R2 §5; o número de linha de `tests_p52_layout.js`
foi corrigido **in loco**). Fonte:
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §1.
Linhas de README relidas por mim em `cee02e9` (o corpo descreve esse estado; o
`README.md` de HEAD já é o de `bb1b18d`), as de `tests_p52_layout.js` em HEAD
`2fcd552`.

- **Veredito**: CONFIRMADO COM CORREÇÃO DE CADEIA.
- **Executado por**: os dois refutadores (2/2) — `gh release list`/`gh api
  releases/latest`; sha256 dos blobs `cee02e9` × tag `v3.2.9`; `git blame`;
  `gh run list` (`verify` em `success` em `0bd677c`/`ba77134`/`cee02e9`, com a
  contradição presente). O download do asset **não foi executado** (digest via API).
- **Severidade recomendada**: média (2/2).
- **Encaminhamento recomendado**: fix-finding doc-only **já aplicado** em `bb1b18d`
  (README). Resta: repin de `pins.json:285` se pendente; o status do verbete; e
  **refazer a referência de identidade** — `bb1b18d` grava o SHA em prosa e o adendo
  `8d35787` já diz que ele "não vale para a tag futura" ("dado que apodrece não mora
  em prosa"): a referência final deve ser `pins.json` / o registro de selagem na
  selagem efetiva. O remédio de raiz é o `EA-64` (demanda: registro rastreado escrito
  por `preparar_release.py` + gate que confira a instrução de obtenção contra a versão
  declarada, ou proíba nome de arquivo congelado no README).
- **Situação do verbete**: segue `aberto` até o merge deste PR; só vira `resolvido`
  por quem o escrever com a referência do PR (R2 §1).

**Correções de cadeia**:

- `README.md:36-37` → **`:37`** (bloco `:37-39`; `:36` é vazia no `cee02e9`).
  **Acrescentar `:23`** ("A versão corrente do produto é a v3.2.11"), a linha que o
  gate `V322-DOC3` exige e que torna `:37` contraditório.
- **Medido**: `releases/latest` = **v3.2.9** (Latest, 2026-09-27), asset único
  `quickscan_secops_soccmm_v3_2_9.html`, 1.204.636 B, digest `sha256:a82b8362…bcf` =
  `git show v3.2.9:…dev.html`; em uso = `4c45ce20…5712`, 1.242.046 B
  (`pins.json:337`; `SELAGEM_V3_2_11.md`) — `:37` é falso **por medida**.
  `quickscan_secops_soccmm_v3_2_7.html` só existe na release v3.2.7 (1.186.088 B).
- **`:74` está errado desde a release v3.2.8** (2026-09-22T20:04Z, ~16 h depois de
  `afcabe8`) e sobreviveu a `194e61e` (README:66 na tag v3.2.8), `9f1346f` (`:68` na
  v3.2.9) e `adc300f` — **terceira regressão da mesma forma do `EA-64`**. `:37` e
  `:73` eram verdadeiros em `5fd9124` (fix do `EA-64`, v3.2.6) e viraram falsos em
  `adc300f`, o próprio commit de selagem *(síntese)*.
- `:19` e `:35` afirmam a tag v3.2.11, inexistente (`ls-remote` só até v3.2.9; a API
  dá 404 para v3.2.10/11) — é o CX-07, tratado no adendo de `SELAGEM_V3_2_11.md`, não
  o `EA-104`.
- **O gate `V322-DOC3` começa em `tests_p52_layout.js:1707`** (não `:1756`, que é o
  regex `V` de versão; corrigido in loco). Nenhuma asserção sobre `releases/latest`,
  nome de arquivo ou "artefato da release" (a palavra "release" só aparece em
  comentários `:1732`/`:1738` *(síntese)*).
- A única decisão registrada (`SELAGEM_V3_2_11.md:29-32`: "sem Release") é a que torna
  `:37` e `:73-74` falsos.
- Nenhum outro consumidor de `v3_2_7.html` / `releases/latest` em `cee02e9` além do
  README e de `SELAGEM_V3_2_11.md:303` (afirmação correta, não instrução).

## EA-105 — exportar também escreve no owner da curadoria: `prepareSessionExport` chama `validateSessionDocument`, que chama `fromSession` — o botão de exportar zera e reescreve o estado a partir da própria serialização

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`D025-VAL1(c)`, `D025-M1`; commit `d8518e0`). A alínea
> (c) do gate chama `prepareSessionExport("x")` com curadoria declarada e exige
> `ok:true`, 0 escritas no bridge e `JSON.stringify(state())` idêntico antes e
> depois — o contador que o Encaminhamento pedia; a alínea (d) é o controle
> negativo (importar confirmado escreve ≥ 1). O terceiro chamador deixou de
> escrever porque `validateSessionDocument` não aplica mais
> (`ui_session_v32.js:242`). O mutante do Encaminhamento — reintroduzir
> `fromSession` no validador — é `D025-M1`, DETECTADO.

**Severidade (refutação adversarial)**: baixa — idempotente hoje; é o terceiro chamador
do "validar que aplica".

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de completude do produto
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N1).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `ui_session_v32.js:116-118` — `prepareSessionExport(label)` monta o documento
  (`:117`) e chama `validateSessionDocument(doc)` (`:118`).
- `ui_session_v32.js:237-240` — a validação chama `window.__CURATION.fromSession(I.reportCuration)`
  quando a chave existe.
- `ui_curation_v32.js:188` — `daSessao` zera o owner e o reescreve a partir da
  própria serialização.
- **Efeito**: exportar **escreve** no owner. Os três chamadores do "validar que
  aplica" são `ui_session_v32.js:693` (seletor de arquivo), `:632` (confirmação) e
  `:118` (exportação); o `EA-91` trata só os dois primeiros.

### Como foi medido (executado vs. lido)

**Executado** (jsdom, crítico do produto): `fromSession` é chamado 1× durante
`prepareSessionExport('conta')`, `ok = true`, conteúdo igual antes e depois. **Lido**
por mim: a cadeia acima.

### Invariante / regra ferida

Nenhuma INV literal. Mesma raiz do `EA-91` (**R9 §3**: bridge cujo "validar" muta).

### Encaminhamento

Id próprio (a síntese admite também o sufixo `EA-91a`). Entra no **cenário 1 da 025**:
se a validação pura for feita só no import, o export continua escrevendo no owner —
o gate exige contador de chamadas a `fromSession` = 0 durante o seletor, a prévia
aberta, Cancelar/Escape **e** `prepareSessionExport`, e `JSON.stringify(state())`
idêntico antes e depois do export. Mutante: reintroduzir `fromSession` no validador.

## EA-106 — "sem curadoria" tem três representações e dois comportamentos: a chave ausente PRESERVA a sessão anterior, `{}` e `{decisions:{}}` LIMPAM — e o validador aceita `{}` onde recusa `coverage:""` e `coveredCapabilities:[]`

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`D025-CAN1`, `D025-AUS1`; commits `e11fd05` e
> `d8518e0`). Decisão de produto P1 (portão da Fase 0, 2026-10-27, «Aprovado em
> bloco (Recomendada)»): a forma canônica de «sem curadoria» é a **ausência da
> chave**; `null`, `{}`, `{decisions:{}}` e `decisions` sem chaves são
> **recusados**, com as mensagens de §Mensagens da spec; só a nota arquitetural
> (`{architectureNote:"exclude"}`) é válida. Extensão ERR-2 (portão da Fase 1, «Aprovado, com a
> extensão (Recomendada)»): chave desconhecida dentro de `reportCuration` também é
> recusada, nomeando-a. `CAN1` mede as quatro recusas de forma vazia (`F-null`,
> `F-vazio`, `F-dec-vazio`, `F-dec-vazio-arch`), a recusa de chave desconhecida
> (`F-extra`) e as duas formas aceitas (`F-arch`, `F-0`); carrascos `D025-M3` (o
> vazio aceito — o mutante (f) do Encaminhamento) e `D025-M23` (chave desconhecida
> ignorada). `AUS1` mede o que a ausência faz: substitui.

**Severidade (refutação adversarial)**: média.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de completude do produto
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N2).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `ui_session_v32.js:237` — a curadoria só é aplicada se `I.reportCuration !== undefined`:
  a chave **ausente** não chama `fromSession` e o estado anterior sobrevive (`EA-91`).
- `ui_curation_v32.js:188-189` — `daSessao` zera o owner e só então avalia a entrada;
  `{}` e `{decisions:{}}` chegam ao fim com o estado **vazio**.
- Contraste, no mesmo validador: `ui_session_v32.js:327-329` e `:346-348` recusam
  `coverage: ""` e `coveredCapabilities: []` mandando "representar pela ausência do campo".
- `ui_curation_v32.js:178-183` — `paraSessao` nunca emite `{}`; a forma canônica é a
  ausência (`D019-CUR2`, `tests_019_curadoria.js:174`: "missing ≠ null ≠ {}").
- **Efeito**: três grafias de "sem curadoria", com dois comportamentos — a ausência
  herda a sessão anterior; `{}` e `{decisions:{}}` substituem por vazio.

### Como foi medido (executado vs. lido)

**Executado** (jsdom): ausente → o estado herda; `{}` → `{}`; `{decisions:{}}` → `{}`;
`coverage:""` → `ok=false`. **Lido** por mim: as linhas acima.

### Invariante / regra ferida

**INV-8** em sua parte de forma canônica (missing ≠ `{}`): o validador aceita uma
grafia que o exportador nunca produz. Não é a questão de transacionalidade do `EA-91`.

### Encaminhamento

Id próprio. **Decisão a pinar na 025** (cenário 4), de `product-owner` / `tech-lead`:
recusar `{}` / `{decisions:{}}` / `decisions` sem chaves como não-canônicos (coerente
com `:327-329` / `:346-348` e `D019-CUR2`) **ou** declará-los equivalentes à ausência —
com mutante para o lado escolhido (mutante (f) da lista consolidada: `{}`
aceito/recusado invertido).

## EA-107 — o `draft` do editor de contexto tecnológico sobrevive a importação, "Nova sessão" e "Reiniciar avaliação" e bloqueia a impressão do cliente seguinte por um editor que não está na tela

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`D025-TRN2`, `D025-M15`; commits `4ef94ba`, `d8518e0` e
> `17683b6`). `ui_v32.js` (§29.4) expõe `__V32UI.discardDraft()` e `hasDraft()`
> (`ui_v32.js:1691-1693`; a bridge passa a 7 chaves); o commit da importação
> (`ui_session_v32.js:641`), «Nova sessão» (`ui_ux_v32.js:30`) e «Reiniciar»
> (`:21`) o chamam. `TRN2(a)`: para cada um dos três, abrir o editor → ação →
> `hasDraft()===false` e `preparePrint().blocked` diferente de `true`; `(b)` a
> transação — importação recusada e prévia cancelada **não** descartam o draft;
> `(c)` `discardDraft` é função. A wave do `draft` (P5) era severável e não foi
> cortada.

**Severidade (refutação adversarial)**: média.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de completude do produto
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N3).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `ui_v32.js:139` — `let draft = null;` (cópia de trabalho; "só vira estado no Salvar").
  `:409-411` — `openEditor` faz `draft = newDraft()`.
- `ui_v32.js:535` e `:572` — os **únicos** pontos que o zeram (cancelar e salvar).
- `ui_ux_v32.js:23-30` (`uxNewSession`), `:17-22` (`uxResetAssessment`) e
  `ui_session_v32.js:606-628` (`commitCanonicalOwners`) **nunca** o tocam.
- `ui_v32.js:1585-1590` — `preparePrint`: `draft !== null` → `{ blocked:true }` com o
  texto "Salve ou cancele as alterações do contexto tecnológico antes de gerar o
  relatório." (`:1588`); `safePrint` repete o teste em `:1625-1626`.
- **Efeito**: com o editor aberto, importar, "Nova sessão" ou "Reiniciar" deixa
  `#v32editor` oculto e vazio, mas `beforeprint` bloqueado — a impressão do cliente
  seguinte é barrada por um editor que não está na tela, e o operador só a destrava
  abrindo `#v32cta` e `#v32cancel`. O `draft` carrega vendor / produto / notas do
  cliente anterior em memória (não salvável: `#v32save` deixa de existir depois do
  render).

### Como foi medido (executado vs. lido)

**Executado** (jsdom, cenários D1–D4): após importação, Nova sessão e Reiniciar com o
editor aberto, `#v32editor` fica oculto/vazio e o `beforeprint` é bloqueado;
recupera-se só pelo par `#v32cta` + `#v32cancel`. **Lido** por mim: as linhas acima.

### Invariante / regra ferida

Nenhuma INV literal; escopo de dado entre sessões (mesma família do `EA-92`).

### Encaminhamento

Id próprio; módulo distinto do `EA-91`/`EA-92` — `ui_v32.js` é §29.4 (9 `innerHTML=`
legados: não tocar além do necessário). Na 025: **ponto de descarte do `draft` exposto
em `__V32UI`, em wave própria**, chamado por reset e por commit (cenário 9). Alíneas:
"após Nova sessão + nova avaliação, `preparePrint()` não bloqueia" e "após import com
editor aberto, `preparePrint()` não bloqueia". Mutante (h): `draft` não descartado.

## EA-108 — `prioLimitHit` (Camada 1) sobrevive à importação: o aviso "Limite de 3 prioridades atingido" aparece sobre uma sessão importada com 0 prioridades

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`D025-TRN1`, `D025-M14`; commit `d8518e0`):
> `prioLimitHit = false;` no commit (`ui_session_v32.js:640`) — transiente zerado
> onde o Encaminhamento previa, sem tocar arquivo congelado. `TRN1`:
> `prioLimitHit` produzido pela UI (três prioridades e a quarta tentativa) →
> importar `F-0` com `priorities: []` → `prioLimitHit===false` e a tela de
> prioridades não exibe «Limite de 3 prioridades atingido».

**Severidade (refutação adversarial)**: baixa.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de completude do produto
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N4).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `quickscan_secops_soccmm_v3_2_dev.html:4838` — renderiza "N de 3 selecionadas" e, se
  `prioLimitHit`, o trecho "Limite de 3 prioridades atingido — desmarque …".
- `ui_ux_v32.js:20` e `:27` — "Reiniciar" e "Nova sessão" fazem `prioLimitHit=false`.
- `ui_session_v32.js:606-628` — `commitCanonicalOwners` escreve `businessPriority` e
  `tgtNotices = []` (`:620`), mas **não** `prioLimitHit`.
- **Efeito**: a variável de Camada 1 sobrevive à importação (classe de `tgtNotices`, que
  o commit já zera).

### Como foi medido (executado vs. lido)

**Executado** (jsdom): limite atingido → importação com `priorities: []` → "0 de 3
selecionadas · Limite de 3 prioridades atingido…". **Lido** por mim: as linhas acima.

### Invariante / regra ferida

Nenhuma INV literal; transiente que o commit deveria substituir.

### Encaminhamento

Id próprio **ou** alínea do inventário de transientes da 025 (cenário 9). Zerar no
commit (`ui_session_v32.js`) não toca arquivo congelado: a variável já é escrita por
`ui_ux_v32.js`. Mutante (g): `prioLimitHit` não zerado.

## EA-109 — `sessionHasContent()` e `sessionPreview()` são cegos à curadoria: o aviso "substituirá a sessão atual" e a prévia da importação ficam mudos sobre o que a 025 tornará substitutivo

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`D025-PRV1`, `S30(b)`; `D025-M16`, `D025-M17`; commits
> `d8518e0` e `b20b20b`). `sessionHasContent()` conta a curadoria
> (`ui_session_v32.js:677`, `toSession() !== undefined`) e `sessionPreview` ganha
> o campo `curation`, exibido na prévia como «Curadoria do relatório: sim/não»
> (`:756`). `PRV1`: janela virgem com só uma declaração → o modal traz
> «substituirá a sessão atual» e o botão «Importar e substituir»; sem declaração →
> «Importar». A suíte congelada recebeu a alínea (b) de S30 com o mesmo cenário
> (reancoragem §29.4, `b20b20b`); `D025-M16` é DETECTADO pelas duas suítes (d025 e
> m48). Os literais de S30 ficaram intactos.

**Severidade (refutação adversarial)**: média.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), por fusão do crítico de produto (item 6) e do crítico de gates (item 7)
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N5).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `ui_session_v32.js:652-656` — `sessionHasContent()` não olha a curadoria.
- `ui_session_v32.js:642-651` — `sessionPreview(doc)` também não.
- `ui_session_v32.js:721-734` — `showImportPreview` (`:718`) monta o aviso de
  substituição a partir de `sessionHasContent()` (`:721`).
- `tests_session_m48.js:290-299` — S30 ("sessão ativa exige confirmação de
  substituição") mede **um só** estado, `answerAll`.
- **Efeito**: o portão de confirmação não avisa que a curadoria será substituída.

### Como foi medido (executado vs. lido)

**Executado** (jsdom): depois de "Reiniciar" com um `exclude`, `sessionHasContent()` =
`false` enquanto `captureCanonicalInputs().reportCuration` = `{…exclude}`; a prévia não
tem campo de curadoria; as chaves de `sessionPreview` são `label`, `createdAt`,
`toolVersion`, `answered`, `landscape`, `target`, `refinement`. **Lido** por mim: as
linhas acima.

### Invariante / regra ferida

Nenhuma INV literal. O `EA-92` cita `sessionHasContent` só como a razão de S31-S32
ficarem verdes; como **defeito de UX** (portão de confirmação sem aviso) é novo.

### Encaminhamento

Id próprio. **Cenário 10 da 025**: `sessionHasContent()` passa a contar a curadoria
(S30 com resíduo **só** de curadoria exige "Importar e substituir" + aviso);
`sessionPreview` ganha "Curadoria do relatório: sim/não" e a prévia o exibe — pinar a
decisão de produto qualquer que seja.

## EA-110 — pergunta de desenho (NÃO é defeito confirmado): desmarcar e remarcar um item ofertado grava `include` explícito, porque o bridge da curadoria não tem `unset`

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (P3, `D025-UNS1`, `a0a879a`) — **decisão do usuário no
> portão da Fase 0, 2026-10-27**: «Aprovado em bloco (Recomendada)», e P3 =
> toggle-back volta a ausente. O achado era pergunta de desenho; a 025 a
> respondeu na direção «corrigir». Por isso **não** está riscado (não foi
> refutado) e **não** vai para `design-decisions.md`, que guarda o que se decidiu
> *não* ser defeito — a alternativa «manter e registrar» foi a não adotada.
>
> Mecanismo: `__CURATION.unset(id)` e `unsetArchitectureNote()` (`e11fd05`); o
> editor escreve só a decisão que diverge do motor — tabela fechada em
> `ui_curation_edit_v32.js:87-93` e nota arquitetural em `:187` (`a0a879a`;
> `gateFechado()` e `decorar()` byte-idênticos à base). `UNS1` (a–e): remarcar
> ofertado → ausente; desmarcar não ofertado → ausente; nota arquitetural →
> `undefined`; `toSession()===undefined` depois dos três; `unset` no bridge.
> Carrasco `D025-M18`, DETECTADO.

**Severidade (refutação adversarial)**: baixa — e **isto não é um defeito confirmado**.
É uma pergunta de desenho para `product-owner` / `tech-lead`, registrada aqui para não
se perder; a síntese a classifica assim e a decisão de a tratar como defeito ou como
desenho é deles.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de completude do produto
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N6).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `ui_curation_edit_v32.js:86-88` — o `change` do checkbox chama o bridge `set`.
- `ui_curation_v32.js:217-222` — o bridge só tem `set` e `clear`: **não há `unset(id)`**.
- `ui_curation_v32.js:178-183` — `paraSessao` serializa a decisão; na importação ela
  volta sem gaps (`:162-164`, `escolhaDoOperador`; `:149-157`, `publicados`).
- `ui_p52_support_v32.js:152` — `PROV_TXT`: "Incluído por decisão do engenheiro — não
  derivado da avaliação."
- **Efeito**: um no-op de UI (desmarcar e remarcar) vira decisão canônica que viaja na
  sessão e reaparece como "Incluído por decisão do engenheiro".

### Como foi medido (executado vs. lido)

**Executado** (jsdom): desmarcar → `exclude`; remarcar → `include`; reimportar em DOM
novo → `published = [item]`, `isOperatorChoice = true`, `unsupported = [item]`. **Lido**
por mim: as linhas acima.

### Por que não é defeito confirmado

Os casos 4 e 5 do `refinement.md` da 019 partiram de decisões deliberadas *(síntese)*.
Nada nas regras ou nas invariantes proíbe o comportamento.

### Encaminhamento

**Pergunta de desenho para PO/TL na 025** (cenário 11): voltar a `missing` — o que
exige `unset(id)` no bridge — ou manter o `include` explícito. A forma decidida define a
alínea de roundtrip. Se confirmado como desenho, vai para `design-decisions.md` (R12/R13,
conteúdo do `product-owner`); **não** foi levado para lá neste passe.

## EA-111 — `D019-INV8` é tautológico para a importação: o título promete "recomputada na importação" e o corpo não importa; três mutantes (mutB, mutC, mutD) sobrevivem com 14/14

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`D025-INV8` + errata E3, `8ce520a`). O Encaminhamento
> oferecia duas rotas; a 025 tomou a segunda: nasce `D025-INV8` (C7: roundtrip em
> DOM novo, janela suja substituída, idempotência, e `exemplo-completo.json`
> declarando `reportCuration`) e o título do `D019-INV8` foi reduzido ao que o
> corpo mede. Prova mecânica da errata (`corpo_019_inv8.py`, base e HEAD de
> `8ce520a`): *«janela de edição base :218-:219 → nova :218-:220 · 217 linha(s)
> antes idênticas · corpo + resto idênticos (638 linhas) · título E3 presente»*;
> `d019` segue `14 PASS · 0 FAIL`; `D019-M3` intacto.
>
> Os três sobreviventes do achado agora morrem: mutC é `D025-M5` (`AUS1`), mutD é
> `D025-M9` (`INV8(b)`), mutB é `D025-M6` (`TRX2(b)`) — todos DETECTADOS.
> **Resíduo declarado**: a alínea `INV8(c)` (idempotência) não tem carrasco —
> dívida em `mutation-matrix.json → dividas_declaradas` (`af41f72`, errata E9 da
> spec). Nasceu verde; mutante que a matasse sozinha exigiria efeito acumulativo
> por importação, que nenhum sítio do produto tem, e seria sintético. Gatilho
> nomeado na dívida: qualquer escrita em `commitCanonicalOwners`,
> `restoreCanonicalOwners` ou `fromSession` que passe a somar.

**Severidade (refutação adversarial)**: alta — classe `EA-20` (gate que promete
asserção e entrega tautologia), ligado ao `EA-91`.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de gates
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N7).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `tests_019_curadoria.js:219-247` — o título (`:219`) promete "exportada, recomputada na
  importação"; o corpo **não contém nenhuma chamada** a `importSessionDocument`,
  `validateSessionDocument` ou `fromSession` (`grep` = 0 em `:219-247`).
- `tests_019_mutants.js:88-91` — o único mutante, `D019-M3`, ataca só o exportador.
- `mutation_map.json` — o harness `d019` lista só esse arquivo como `insumos.oraculo`
  *(síntese)*; `tests_core_mutants.js:53-60` (`CM1`) cobre só `hasReservedDerived`.
- **Efeito**: mutantes que apagam a importação sobrevivem.

### Como foi medido (executado vs. lido)

**Executado** (crítico de gates): `node tests_019_curadoria.js` → 14/14; com
`D019_HTML_OVERRIDE` sobre cópias mutadas, **14/14 nos três** — sobreviventes: **mutC**
(`fromSession` → `[]`, a importação nunca restaura), **mutD** (`daSessao` sem reset:
merge em vez de substituição) e **mutB** (snapshot com `curadoria: null` + restore sem
`fromSession`). **Lido** por mim: as linhas acima.

### Invariante / regra ferida

**R3 §5** (mutante obrigatório) e o "Nascimento de um gate" da R10 (oracle que discrimina); `design-decisions.md` (R13) diz que gate
que promete asserção e entrega tautologia **é** achado (`EA-20`). O `EA-91` já anota que
o corpo nunca importa — mas como cadeia do defeito de produto; a sobrevivência de três
mutantes executada é um achado de gate distinto.

### Encaminhamento

Id próprio, ligado ao `EA-91`. Na 025: ou se corrige o corpo do `D019-INV8` (importação
real), ou nasce um `D025-INV8` e o `INV8` é reduzido ao que mede. Mutantes (i) mutC,
(j) mutD e (k) mutB da lista consolidada, cada um vermelho no gate correspondente.
`qa-engineer`.

## EA-112 — guarda-chuva: as suítes de sessão e de UX são cegas ao sexto owner (a curadoria), em quatro famílias — reject-before-commit, roundtrip, Nova sessão e self-import / documentação

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025 no que a spec tomou; resíduo declarado ao fim.**
> Reancoragens `S50`/`S69(b)`/`S30(b)`/`S31-S32` na m48 (`b20b20b`, §29.4
> autorizado em 2026-10-27); erratas E4–E6 (`01e7067`, `6cace4c`); gates
> `D025-NEW1`/`RST1`/`INV8`/`DOC1`.
>
> - **(c) Nova sessão** — `S31-S32` reancorada (importa a variante curada;
>   `afterRestart` e `afterNew` exigem `toSession()===undefined`; `D025-M11` e
>   `M12` DETECTADOS sob a m48) e `D025-NEW1`/`RST1` com oráculo que vê o owner.
>   `tests_ux_m41.js` não foi tocada, como o Encaminhamento preferia. Quanto a «o
>   `mutation_map` não tem harness para `ui_ux_v32.js`»: `harnesses.d025.targets`
>   o contém.
> - **(a) reject-before-commit e (b) roundtrip** — o oráculo é a suíte nova:
>   `D025-NOP1` (janela com curadoria B; `F-tardio`, `F-engine`, `F-inv-id`,
>   Cancelar, Escape), `D025-TRX2` e `D025-INV8` (o mesmo documento sobre estados
>   prévios distintos).
> - **(d) documentação** — `SESSION_SCHEMA_V32.md` (sexta chave; ausência
>   legítima e substitutiva; `__CURATION` na cobertura de rollback),
>   `synthetic_session_examples/exemplo-completo.json` (`reportCuration`) e
>   `USER_GUIDE.md` §11; `D025-DOC1` (a–e); carrasco `D025-M21`.
>
> **Resíduo declarado** (só o medido): (1) a spec excluiu as fixtures curadas
> **dentro** das suítes congeladas S29/S49/S67/S77/S6/S7/S37/S41/S112 (§Fora de
> escopo da spec: a propriedade é medida em `NOP1`/`INV8`, e a m48 recebeu só as
> quatro reancoragens autorizadas) — as alíneas (a) e (b) foram cumpridas **na
> propriedade**, não na forma do Encaminhamento. (2) Dos cinco documentos da
> alínea (d), `synthetic_session_examples/exemplo-minimo.json` e
> `session_roundtrip_report.md` seguem com 0 ocorrências de `reportCuration` e de
> «curadoria» (`grep -c -i`, 2026-10-30) — a 025 não os tocou. Se alguém quiser
> (1) ou (2) como achado próprio, é id novo.

**Severidade (refutação adversarial)**: alta — mesma raiz de cobertura do `EA-91` e do
`EA-92`, que citam S29, S6/S7, UX21 e S31 só de passagem.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de gates
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N8).
Linhas da síntese; as de `documentação` medidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

Um id guarda-chuva com quatro alíneas (a síntese admitia também dois ids, sessão ×
Nova sessão):

- **(a) reject-before-commit** — S29, S49, S67, S77, S62+S68: fixtures sem curadoria; o
  "pre" é lido por `captureCanonicalInputs` (chave ausente = owner invisível); o
  documento ruim é derivado da própria janela.
- **(b) roundtrip** — S6, S7, S37, S41, S112, P50-SESUX4, D019-CUR2: sempre `boot()`
  limpo ou a mesma janela; nunca o **mesmo documento** sobre dois estados prévios
  distintos.
- **(c) Nova sessão** — S31-S32, UX21, UX22, UX24: oráculos `sessionHasContent`,
  `legacySnapshot` e `fullStateJSON` (`ui_v32.js:906-910`, sem curadoria). Cada owner
  tem o seu "Nova sessão limpa X" (T21, R21); a curadoria não. O `mutation_map` não tem
  harness para `ui_ux_v32.js` / `tests_ux_m41.js`.
- **(d) self-import / documentação** — S57, S73, S79, S82, S110, S112:
  `SESSION_SCHEMA_V32.md`, `synthetic_session_examples/exemplo-completo.json`,
  `synthetic_session_examples/exemplo-minimo.json`, `session_roundtrip_report.md` e
  `USER_GUIDE.md` têm **0** ocorrências de `reportCuration` / "curadoria" (conferido
  por mim, `grep -c`, nos cinco). S81 audita um escopo de atomicidade que a curadoria
  rompe.
- Linhas *(síntese)*: `tests_session_m48.js:86-99`, `:100-106`, `:155-165`,
  `:282-289`, `:300-314`, `:343-367`, `:431`, `:520-530`, `:673-705`, `:777-787`,
  `:874-883`, `:904-935`, `:1441-1490`; `tests_ux_m41.js:199-219`;
  `tests_p50_core.js:2540-2556`; `tests_019_curadoria.js:174-183`.

### Como foi medido (executado vs. lido)

**Executado** (crítico de gates): `tests_session_m48.js` rodada de uma cópia — base **94
PASS · 3 FAIL**, e os 3 são S64, S74+S75 e S113 por "blob do archive inacessível"
(ambiente de scratch sem `.git`; na worktree passam); sob **mutC** e **mutB** os
vereditos são **idênticos linha a linha** (`diff` vazio); `tests_ux_m41.js` 56/56.
Sondas A3, A4, A5, A7, E (8/8 contra 9/9 em tela e papel; inputs canônicos ≠ depois
do mesmo import), B1, B2 e C1–C4.

### Invariante / regra ferida

**R3 §5** (mutante obrigatório) e o "Nascimento de um gate" da R10 (poder discriminante); INV-8 e INV-7 ficam sem sensor.
Classe `EA-20`.

### Encaminhamento

Insumo direto dos **cenários 2, 3, 5 e 6** da 025. `qa-engineer`: fixtures curadas
(variantes de `richSession` / `richLandscape` no padrão S4-S5), "com e sem curadoria na
mesma janela, a única diferença é a declaração"; harness com `ui_ux_v32.js` em
`targets`; documentação (`SESSION_SCHEMA_V32.md` com a sexta chave, a ausência legítima
e o escopo transacional; exemplo completo com `reportCuration`; `USER_GUIDE.md`) com S81
cobrando que a doc diga que a curadoria entra no candidato e no commit. As suítes
`tests_session_m48.js` e `tests_ux_m41.js` são PROTECTED: rito §29.4 com autorização do
proprietário; para `tests_ux_m41.js`, preferir gates novos em `tests_019_*`.

## EA-113 — S50 ("o candidato é completo antes do commit") pina a AUSÊNCIA da curadoria: a lista de 10 chaves é o contrato de 5 — a correção certa do `EA-91` vai reprovar S50

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`S50`, `D025-M20`; reancoragem §29.4 autorizada em
> 2026-10-27, `b20b20b`). Direção decidida — a spec mudou, o gate não foi
> afrouxado (R10 §1): a lista passou a **11** chaves (`…,arq,curadoria,
> landscape,…`) e S50 ganhou a alínea (b), `"curadoria" in cand &&
> cand.curadoria === undefined` para documento **sem** a chave; a asserção antiga
> (`pre === pós`) permanece. O mutante que o Encaminhamento pedia — ressuscitar a
> lista de 10 — é `D025-M20`, que muta a própria m48 (`skipBuild`, heap 6144) e é
> DETECTADO (80,6 s). Estado da suíte: `SESSION 4.8: 97 PASS · 0 FAIL de 97`.

**Severidade (refutação adversarial)**: média — e **acionável**: é o gate que vai
bloquear a correção.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de gates
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N9).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `tests_session_m48.js:531-539` — S50 pina a lista de chaves do candidato.
- `ui_session_v32.js:533-541` — `normalizeSessionDocument` devolve um `cand` com 10
  chaves, nenhuma é a curadoria; `captureCanonicalInputs` (`:42`) já emite a sexta em
  `:69-77`.
- **Efeito**: a correção do `EA-91` ("curadoria no candidato") **muda a lista** e S50
  reprova. A tentação é a da proibição 1 da R10 ("nunca enfraquecer o gate para passar") ao contrário: o gate não pode ser afrouxado, mas
  a premissa dele — "5 chaves" — ficou velha.
- Precedente de reancoragem em suíte §29.4: T012 / S4-S5, com `D019-M11`
  (`tests_019_mutants.js:264-268`).

### Como foi medido (executado vs. lido)

**Executado** (crítico de gates, sonda A6): `Object.keys(normalizeSessionDocument(doc))`
= a lista de 10; S50 passa na base, em mutC e em mutB. **Lido** por mim: as linhas acima.

### Invariante / regra ferida

**R10, proibição 1** (a direção da mudança tem de ser decidida — a spec mudou? o
artefato foi editado? —, nunca afrouxar a asserção). Classe `EA-20`.

### Encaminhamento

Id próprio. **Reancoragem obrigatória na 025** sob o rito §29.4 (autorização nominal do
proprietário; a suíte é PROTECTED), com um mutante que **ressuscite a lista de 10**.
`qa-engineer`.

## EA-114 — S69 ("snapshot/restore cobre todos os owners escritos pelo commit") confere uma lista fixa de 10 owners sem `__CURATION`, por regex sobre o fonte: remover a curadoria do snapshot/restore sobrevive a ele, à suíte e à d019

**Status**: `resolvido`

> **Fecho — demanda `025-curadoria-transacional` (branch
> `feature/025-curadoria-transacional`, ainda sem PR), registrado em 2026-10-30 —
> E8 da spec, T093, `doc-writer`.** Corrigido **na branch**; a mesclagem (T095) e
> o job `visual` do CI estão pendentes. `resolvido` aqui significa «corrigido e
> medido pela suíte e pela campanha da 025», não «mesclado».
>
> **Corrigido pela 025** (`S69(b)`, `D025-M6`; `b20b20b`). S69 ganhou a alínea (b)
> **comportamental** — a regex sobre o fonte virou a alínea (a), «estrutural», e
> permanece: `richLandscape` + curadoria A → `snapshotCanonicalOwners()` → zera
> **cada** owner (inclusive `__CURATION.clear()` e `step`), com não-vacuidade
> asserida → `restoreCanonicalOwners(snap)` → inputs, `derivedModel`, `state()` e
> `step` iguais ao pré. O mutante do Encaminhamento (mutB: o restore deixa de
> devolver a curadoria) é `D025-M6`, DETECTADO sob a m48 via `M48_HTML_OVERRIDE`
> (93,5 s) e pela d025 (`TRX2(b)`). S69(b) nasceu verde, declarado em
> `red-025.md`: o poder está em M6.

**Severidade (refutação adversarial)**: média — instância do `EA-20` no gatilho da
atomicidade.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de gates
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N10).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `tests_session_m48.js:788-798` — S69: lista fixa de 10 owners, sem `__CURATION`;
  oráculo por regex sobre o **fonte**.
- `ui_session_v32.js:585-586` e `:602-603` (curadoria no snapshot e no restore) são
  invisíveis para o S69; o snapshot é tirado em `:607`, **depois** da mutação de
  `:240` — "cobre" ≠ "protege".
- **Efeito**: o gate nomeia a atomicidade e não a mede para o owner novo.

### Como foi medido (executado vs. lido)

**Executado** (crítico de gates): sob **mutB** → `snapshot.curadoria = null` e o estado
depois do restore é `{}` contra o `exclude` da base; a expressão do S69 dá `true` nos
dois fontes; S69 passa nos três runs (base, mutC, mutB); a d019 mutB fecha 14/14.
**Lido** por mim: as linhas acima.

### Invariante / regra ferida

**R3 §5** (mutante obrigatório); classe `EA-20`.

### Encaminhamento

Id próprio. Na 025, S69 vira **comportamental**: zerar cada owner depois do snapshot e
provar o restore, incluindo a curadoria (cenário 2). Suíte PROTECTED: rito §29.4.
`qa-engineer`.

## EA-115 — `D019-SUF1` mede só metade de C10: "não se oferece E o estado não é lido" — o corpo confere apenas a ausência do controle; o estado É lido sob gate fechado

**Status**: `aberto`

> **Nota de 2026-10-30 — demanda 025 (E8 da spec, T093): permanece `aberto`.** Da
> 025 entrou **só a redação de C10** (errata E2, `19f4d45`): a spec da 019 passa a
> dizer «o controle não existe e **o editor** não lê o estado», que é o que
> `ui_curation_edit_v32.js` faz e o que `D019-SUF1` mede. «Instrumentar o bridge
> sob gate fechado» ficou fora de escopo (§Fora de escopo da spec da 025). O efeito
> do achado — `showResults` lê o bridge sob gate fechado e nenhum gate o mede — não
> mudou.

**Severidade (refutação adversarial)**: baixa — classe `EA-20`.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido"), a partir do crítico de gates
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2a, N11).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `tests_019_curadoria.js:789-797` — `D019-SUF1`: título "com o gate de suficiência
  FECHADO a curadoria não se oferece e o estado não é lido"; o corpo só confere a
  ausência do controle.
- `specs/019-curadoria-do-relatorio/spec.md:49` — C10: "gate de suficiência fechado ⇒
  curadoria indisponível". `spec-validate.md:20` deu C10 "conforme".
- `ui_curation_edit_v32.js:216-219` — só o **editor** se abstém (o `return` de
  `gateFechado` vem antes de ler o bridge).
- `tests_019_mutants.js:185-188` — `D019-M10` ataca só a oferta.
- **Efeito**: o bridge é lido durante `showResults` com o gate fechado, e nenhum gate o
  vê.

### Como foi medido (executado vs. lido)

**Executado** (crítico de gates): boot com o gate `blocked` e bridge instrumentado em
`showResults` → leituras `{decide:1, isOperatorChoice:1, state:1}`. **Lido, não
executado**: um mutante que leia `state()` antes do `return` de `gateFechado`.

### Invariante / regra ferida

**R3 §5**; classe `EA-20` (o `spec-validate` deu C10 "conforme" sem medir a metade da
leitura).

### Encaminhamento

Id próprio **ou** alínea da 025 (cenário 14, adjacente): instrumentar o bridge sob gate
fechado e exigir zero leituras, **ou** reescrever C10 para "o editor não lê"; mutante
que leia `state()` antes do `return` de `gateFechado`. `qa-engineer` + decisão de
`product-owner` sobre a redação de C10.

## EA-116 — as regras `Write(...)` do `permissions.deny` são inertes segundo o host, e a seção `deny` do `compliance-audit.sh` exige essa forma por espelho

**Status**: `aberto`

**Severidade (refutação adversarial)**: baixa.

**Aberto em**: 2026-10-25 (refutação adversarial; medido em jsdom salvo onde dito
"lido" — aqui tudo é **lido**: a evidência é a mensagem do host e a documentação, não
uma execução), a partir dos contra-leitores do `EA-93` e do `EA-94`
(`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md` §2b).
Linhas relidas por mim em HEAD `2fcd552`.

### Cadeia arquivo:linha → efeito

- `.claude/settings.json:5-21` — nove regras `Write(<caminho>)` ao lado das nove
  `Edit(<caminho>)` no `permissions.deny`.
- `.claude/verify/compliance-audit.sh:52-54` — `for tool in ("Edit", "Write"): if
  f"{tool}({p})" not in deny:` — a seção `deny` falha se faltar o `Write(...)`.
- **Segundo o host** (mensagem no boot, citada pelo contra-leitor do `EA-93`: "Permission
  deny rule: Write(foo.txt) is not matched…"; e a documentação, citada pelo do `EA-94`:
  "Write(path) rules never match — only Edit(path) rules are evaluated"), as regras
  `Write(...)` nunca casam.
- **Efeito**: o espelho `Edit` + `Write` que o `compliance-audit` exige mantém nove
  regras mortas, e a auditoria dá verde por uma forma que o host ignora.

### Como foi medido (executado vs. lido)

**Lido**: a mensagem do host e a documentação, como citadas pela síntese; as linhas do
repositório foram relidas por mim. **Não medi** a mensagem do host por execução.

### Invariante / regra ferida

**R6 §2** ("`permissions.deny` espelha o boundary (Edit+Write) — o `compliance-audit`
falha se divergirem"): a regra codifica uma crença que o host desmente. Nenhuma INV
ferida; o `Edit(...)` basta para o efeito.

### Encaminhamento

Id próprio, baixa. `tech-lead` decide a rota: manter o `Write(...)` por defensividade
(outro host ou versão) com nota explícita, **ou** removê-lo e ajustar R6 §2 +
`compliance-audit.sh:52-54` — o que altera texto de regra (decisão do proprietário) e
arquivos pinados (repin no mesmo PR). Confirmar antes contra a documentação do host na
versão corrente.

## EA-117 — `mutation_map.json → harnesses.p52.requires` declara só `chromium`, mas quatro gates da p52 exigem `poppler-utils`: com o cache do Playwright presente e o poppler ausente, o stage local produz 12 falsos sobreviventes em vez de `[DEFER]` ou FAIL nomeado

**Status**: `aberto`

**Severidade (triagem do `doc-writer`; a confirmar pelo `qa-engineer`)**: média —
instrumento, não produto. O ruído é nomeável por controle A/B, mas o stage local
reporta como «sobrevivente» o que é dependência de ambiente ausente: a mesma classe
do `EA-72` (o gatilho — aqui, o `requires` — vigia menos do que a campanha depende).

**Aberto em**: 2026-10-30, na Fase 6 da demanda 025 (T090 e T093), a partir do
`spec-validate.md` (iteração 1, `f965100`) e de `mutation-matrix.json →
_meta.execucao_demanda_025`. Linhas relidas por mim em `b24534e`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/mutation_map.json:127-131` — `harnesses.p52.requires` =
  `["node", "python", "chromium"]`. Não há `poppler`.
- `.claude/verify/check_mutation.py:39-55` — `have(req)` só conhece `node`,
  `python` e `chromium`; qualquer outro nome cai no `return False` final. `:1701` —
  `missing = [r for r in h["requires"] if not have(r)]` é o único ponto que decide
  `[DEFER]` ou FAIL nomeado por ambiente: o poppler não entra nessa conta.
- `tests_p52_chromium.js:1919-1922` (verificação de `pdftotext` e `pdftoppm`),
  `:2022` (`P52-PDF4`), `:2095` (`P52-PDF5`), `:2166` (`P52-PDF6`) e `:3965`
  (`P52-TGT4`) — sem poppler os quatro gates falham com
  `poppler-utils (pdftotext/pdftoppm) ausente: a prova de papel NÃO foi executada`.
- `.github/workflows/verify.yml:72` — o job `visual` instala `poppler-utils` por
  `apt-get`; é o único lugar em código executável onde a dependência é declarada.
  O `env_doctor.py` não a nomeia (`grep poppler` = 0) — contra o que `gates.md` §7
  e `determinism.md` §4 pedem para dependência de ambiente.
- **Efeito**: com `ms-playwright` em cache, `have("chromium")` é verdadeiro e a
  p52 **executa** localmente; os mutantes `ER7`, `ER8`, `ER9`, `EX5`, `EX6` (gates
  `P52-PDF4/5/6`) e `FT1`…`FT7` (gate `P52-TGT4`) saem «reprovou por motivo
  diferente do esperado» — **12 falsos sobreviventes** — e o stage fecha com `p52
  95/108` e `11 campanha(s) executada(s) · 1 problema(s)`.

### Como foi medido (executado vs. lido)

**Executado pelo `qa-engineer`, em 2026-10-30** (`mutation-matrix.json →
_meta.execucao_demanda_025`; `spec-validate.md` §Pipeline inteiro): controle A/B
**sem mutação** — `P52_ONLY=P52-POP2,P52-PDF4,P52-PDF5,P52-PDF6,P52-TGT4
P52_NO_EVIDENCE=1 node tests_p52_chromium.js` — em HEAD `f8f753a` **e** na base
`da71759` (worktree efêmera), mesmo resultado nas duas: PDF4, PDF5, PDF6 e TGT4 FAIL
por poppler ausente; POP2 PASS. Logo os 12 são vermelho de controle, idênticos sem
a 025. **Executado por mim** (Git Bash desta máquina, 2026-10-30): `which pdftoppm`
→ nada; `which pdftotext` → `/ucrt64/bin/pdftotext` — o poppler está **incompleto**,
e o gate exige os dois binários. **Lido por mim**: as linhas acima. Não reexecutei
a p52.

**Lateral, não classificado aqui**: `P52-ER5` (gate `P52-POP2`) sobrevive **também
na base** `da71759` (reexecutado isolado pelo `qa-engineer`, `P52_MUT_ONLY=P52-ER5`)
— pré-existente neste ambiente, achado da p52. A prova canônica da p52 é o job
`visual` do CI Linux (última registrada na matriz: run `34772594772`, 2026-09-13,
`108/108`).

### Encaminhamento

Dono: `build-engineer` (registro e `env_doctor`) com o `qa-engineer` (vocabulário
do `requires`). Rota a decidir; o que o achado exige é que o poppler ausente
**seja nomeado** — `[DEFER]` com `MUTATION_DEFER_MISSING=1`, FAIL nomeado sem ela
— em vez de sobrevivente. Isso passa por `have()` aprender o requisito (hoje devolve
`False` para nome desconhecido, o que faria a campanha ser sempre deferida/reprovada
para quem só acrescentar a palavra ao `requires`) e pelo `env_doctor` avisar. Ver
`EA-72`, de quem este é instância.

## EA-118 — `run.sh` resolve o interpretador como `python3`, que nesta máquina é o alias da Microsoft Store: sob ele `have("chromium")` e o `env-doctor` não veem o cache `ms-playwright` que `python` vê — o veredito do stage `mutation` depende do interpretador (KI-3 cresce)

**Status**: `aberto`

**Severidade (triagem do `doc-writer`; a confirmar pelo `qa-engineer`)**: média —
instrumento, específico de ambiente Windows; no CI Linux o `python3` é o do
`setup-python` e o achado não se manifesta.

**Aberto em**: 2026-10-30, na Fase 6 da demanda 025 (T090 e T093), a partir do
`spec-validate.md` (iteração 1) e confirmado por mim por execução (abaixo). Linhas
relidas por mim em `b24534e`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/run.sh:17` — `PYBIN=python3; command -v python3 >/dev/null 2>&1 ||
  PYBIN=python`; `:61` — `cmd="${cmd/#python /$PYBIN }"`: todo stage cujo comando
  começa por `python ` roda sob `PYBIN`, inclusive `env-doctor` e `mutation`.
- `.claude/verify/check_mutation.py:52-53` e `.claude/verify/env_doctor.py:76-78` —
  o Chromium é «visto» por `os.path.isdir(<LOCALAPPDATA>\ms-playwright)` mais um
  diretório com «chromium» no nome.
- **Efeito**: o mesmo checkout, a mesma máquina e o mesmo cache dão veredito
  diferente por interpretador. No `run.sh` completo de `91a57e7` (via `python3`):
  `p51/p52: campanha EXIGIDA … ambiente sem chromium` e `mutation: 9 campanha(s)
  executada(s) · 2 problema(s)`; com `python .claude/verify/check_mutation.py` direto
  (3.14.7): p51 e p52 executam e o stage fecha em `11 campanha(s) · 1 problema(s)`.
  O `env-doctor` do pipeline avisa «Chromium indisponível» com o cache presente.

### Como foi medido (executado vs. lido)

**Executado por mim, 2026-10-30, nesta máquina, Git Bash**: `which python3` →
`…\AppData\Local\Microsoft\WindowsApps\python3`; `python3 -c` imprime versão
`3.12.10`, `sys.executable` `…\AppData\Local\Python\pythoncore-3.12-64\python.exe` e
`os.path.isdir(%LOCALAPPDATA%\ms-playwright)` = **False**; `python -c` imprime
`3.14.7`, `C:\Python314\python.exe` e o mesmo teste = **True**. **Executado pelo
`qa-engineer`**: as duas execuções do stage (tabela em `spec-validate.md` §Pipeline
inteiro). **Não verificado por mim**: a causa mecânica — o `qa-engineer` a atribui à
virtualização de sistema de arquivos do app da Store (MSIX); eu medi o sintoma
(`False` sob `python3`, `True` sob `python`), não o mecanismo. Causa antes de culpa
(R2 §3): não tratar esta linha como defeito de `check_mutation.py` até isolar.

### Encaminhamento

Dono: `build-engineer`. Rota a decidir: `PYBIN` rejeitar o alias da Store, ou o
`env-doctor` nomear **qual interpretador** viu o quê, ou o teste do cache não
depender do interpretador. O que o achado exige é que o resultado de uma verificação
não mude com o `PATH` sem que o relatório diga qual interpretador respondeu.
Relaciona-se a `KI-3` (`design-decisions.md`, linha «Suítes visuais fora do agregado
local») e a `EA-117`.

## EA-119 — `run.sh` apaga o log completo do stage reprovado no `EXIT` (`mktemp -d` + `trap`): o trecho omitido no meio — 101 linhas na T090 da 025 — só se recupera reexecutando o stage

**Status**: `aberto`

**Severidade (triagem do `doc-writer`; a confirmar pelo `qa-engineer`)**: baixa —
o `EA-15` (resolvido) já garante o veredito na cauda; o que se perde é o meio.

**Aberto em**: 2026-10-30, na Fase 6 da demanda 025 (T090), a partir do
`spec-validate.md` (§Pipeline inteiro). Linhas relidas por mim em `b24534e`.

### Cadeia arquivo:linha → efeito

- `.claude/verify/run.sh:52` — `TMPD=$(mktemp -d); trap 'rm -rf "$TMPD"' EXIT`; a
  saída de cada stage vai para `$TMPD/<stage>.out` (`executa()`, `:59-63`).
- `.claude/verify/run.sh:56` e `:81-85` — `CABECA=30; CAUDA=15`; num stage
  reprovado imprime cabeça e cauda e declara
  `[...] N linha(s) omitida(s) no meio (saída completa: M linhas) [...]`.
- **Efeito**: a omissão é declarada, mas **não recuperável** — o arquivo com a
  saída completa morre no `EXIT`. Na T090 da 025 (`91a57e7`), o stage `mutation`
  reprovou com 146 linhas: 30 + 15 impressas, **101 omitidas**; a identidade das
  campanhas não executadas e a segunda causa só vieram de reexecutar o comando do
  stage isoladamente, duas vezes (`spec-validate.md`). É a família do `EA-15`: o
  `EA-15` corrigiu *o que se imprime*; este é *o que sobra depois*.

### Como foi medido (executado vs. lido)

**Executado pelo `qa-engineer`**: o `run.sh` completo de `91a57e7` (1857 s, exit 1) e
as reexecuções isoladas do stage. **Lido por mim**: `run.sh:52-85`; a aritmética
146 − 30 − 15 = 101 confere com a linha de omissão que o `run.sh` imprime. Não
reexecutei o pipeline completo.

### Encaminhamento

Dono: `build-engineer`. Persistir o log do stage reprovado em diretório **ignorado**
(R7 §3, R11 §1 — nunca em diretório rastreado) e imprimir o caminho junto da linha de
omissão. Ver `EA-15`.

## EA-120 — `mutation_map.json → harnesses.d011` não lista `check_lint_arch.py` — o carrasco de `D011-M7` — em `targets` nem em `insumos.oraculo`: mudar o lint não dispara a campanha d011

**Status**: `aberto`

**Severidade (triagem do `doc-writer`; a confirmar pelo `qa-engineer`)**: baixa —
instrumento; a mudança que o expôs (`EA-101`) não alterou a mensagem casada, por
leitura de diff.

**Aberto em**: 2026-10-30, na Fase 6 da demanda 025 (T093). O vão já estava
anotado em prosa, sem id, no item 6 do fecho do `EA-101` (PR #113); este id o torna
rastreável. Linhas relidas por mim em `b24534e`.

### Cadeia arquivo:linha → efeito

- `tests_011_mutants.js:70` — `LINT_PY` = `.claude/verify/check_lint_arch.py`;
  `:338-346` — `D011-M7` (`oraculo: "lint"`, `gate: "lint-arch
  (check_lint_arch.py)"`, `reason` casando `ui_d011_prioridade_v32.js: atribuição
  .innerHTML=`): o carrasco do mutante é o **lint**, não uma suíte.
- `.claude/verify/mutation_map.json:165-181` — `harnesses.d011.targets` tem cinco
  nomes (`ui_d011_prioridade_v32.js`, `…css`, `build_v32_html.py`,
  `tests_011_prioridade.js`, `tests_011_mutants.js`) e `insumos.oraculo` lista só
  `tests_011_prioridade.js`. `check_lint_arch.py` não está em nenhum.
- `.claude/verify/check_mutation.py:1697` — `due = changed is None or any(t in
  changed for t in h["targets"])`: o gatilho é só por `targets`.
- **Efeito**: alterar `check_lint_arch.py` não torna a `d011` exigida; o stage
  imprime `nenhum alvo mudou desde a base — campanha não exigida`, que o `EA-72`
  já nomeia como ausência de medição lida como saúde. O fix do `EA-101` (`1def6a9`,
  regras 2/3 passam a varrer `ui_*_v32.js` menos allowlist; PR #113) mudou
  exatamente esse arquivo.

### Como foi medido (executado vs. lido)

**Executado pelo `qa-engineer`**: `--preflight` da `d011` em 2026-10-30 → `19/19`
(`spec-validate.md`; mede as âncoras, **não** a campanha). **Citado do briefing da
T093 (orquestrador), sem registro em arquivo**: campanha da `d011` feita à mão em
2026-10-27, no PR #113, `19/19` — não a reexecutei nem encontrei o registro dela no
repositório. **Lido por mim**: as linhas acima. Classe `EA-72` (o gatilho vigia menos
do que a campanha depende); o `D017-REL1` (`targets ⊇ mutados ∪ {harness}`) não o
pega porque o carrasco do `D011-M7` não é um arquivo *mutado*.

### Encaminhamento

Dono: `build-engineer` (registro) com o `qa-engineer`. Declarar `check_lint_arch.py`
no `d011` — `targets` e `insumos.oraculo` (classe `oraculo`, vocabulário da 017) —
é a rota mínima; a rota que fecha a classe é a do `EA-72` (derivar o gatilho da
dependência real). Ver `EA-101`, item 6.

## EA-121 — `preparar_release.py` escolhe o "release anterior" por `sorted()` de strings `vN.N.N`, isto é, lexicograficamente: a partir da v3.2.11 a base errada alimenta o cabeçalho do `compose.yaml` e o `docker stop` impresso

**Status**: `aberto`

**Severidade (triagem do `doc-writer`; a confirmar pelo `build-engineer`)**: média —
instrumento do caminho de entrega (classes `EA-53`/`EA-64`); hoje sem efeito no
artefato, com efeito no texto e no cutover sugerido.

**Aberto em**: 2026-10-31. Medido em 2026-10-30 pelo orquestrador e pelo
`build-engineer` (registro `deploy/v3.2.12/V3_2_12_PRODUCTION_DEPLOYMENT_RECORD.md`,
seção "Observação", fora do repositório — `EA-53`); linhas do script relidas por
mim em `66b0c5a`.

### Cadeia arquivo:linha → efeito

- `preparar_release.py:64-66` — `anterior = sorted(d for d in os.listdir(DEPLOY) if
  re.match(r"^v\d+\.\d+\.\d+$", d))` e `base = os.path.join(DEPLOY,
  anterior[-1])`. `sorted()` de strings é lexicográfico: `'v3.2.9'` > `'v3.2.12'` >
  `'v3.2.11'` > `'v3.2.10'`, porque `'9'` > `'1'`. Com os diretórios de
  `deploy/` de hoje, `sorted()` devolve `['v3.2.10', 'v3.2.11', 'v3.2.12', 'v3.2.2',
  …, 'v3.2.9']` e o "último" é `v3.2.9` (reproduzi a ordenação com o mesmo regex
  sobre `os.listdir`; **não executei o script**, que escreve em `deploy/`).
- `:73-74` — o `default.conf` da release nova é copiado de `base`; `:77-78` — a
  imagem é lida do `compose.yaml` de `base`; `:84` e `:113` — `anterior=` alimenta o
  cabeçalho gerado *"postura de seguranca herdada de {anterior}"*; `:106` — o
  cutover impresso é `docker stop quickscan-` + `base` sem os pontos.
- **Efeito medido** (`sed -n 2p deploy/vX/compose.yaml`): `v3.2.11` e `v3.2.12`
  declaram *"herdada de v3.2.9"* quando a base certa era `v3.2.10` e `v3.2.11`; o
  `v3.2.10` também diz `v3.2.9`, que ali era a base certa. O script, para a
  v3.2.12, imprime `docker stop quickscan-v329` (**por leitura de `:106` e da
  derivação acima, não por execução**) — container que não existe: o que está no ar
  é `quickscan-v3211` (`docker ps`, registro de deploy da v3.2.12).
- **Não afetou o artefato**: o `default.conf` (`sha256sum`
  `7c9ecad4abf28cd6d8fa6a88dab22a84f74d66c4538df18dfc1ea8e74e16dbbe`) e o digest da
  imagem (`nginxinc/nginx-unprivileged@sha256:44e36330f74d4f3a1d4e222acca9e23b401fb87811a7597024502bb759c4dd49`)
  são idênticos de `v3.2.9` a `v3.2.12`. Afetaria no dia em que divergirem entre
  releases: a release nova herdaria postura de uma base antiga sem aviso.

### Como foi medido (executado vs. lido)

**Executado por mim**: `sorted()` e a ordenação por tupla numérica sobre
`os.listdir` de `deploy/`; `sed -n 2p` e `sha256sum default.conf` nos quatro
diretórios `v3.2.9`…`v3.2.12`. **Citado, não reexecutado**: o digest da imagem e
`docker ps` (registro de deploy do `build-engineer`). **Não executado**:
`preparar_release.py` (escreve fora do repositório).

### Encaminhamento

Dono: `build-engineer`. Ordenar por tupla numérica —
`key=lambda d: tuple(int(x) for x in d[1:].split("."))` — nas duas ocorrências do
critério de "anterior"; com o gate que o `EA-64` pede (registro escrito pelo
script, não à mão), a base passaria a ser dado e não inferência por nome. Ver
`EA-53`, `EA-64`.

## EA-122 — `buildRecommendationContext()` aplica `suppressedByPlatform()` em três ramos e não no `CONTEXT_NOT_INFORMED`; e descarta em silêncio o que o desenho precisaria mostrar (`violated`, serviço inelegível)

**Status**: `aberto`

**Severidade (triagem do `doc-writer`; a confirmar pelo `core-engineer`)**: média —
lacuna de **cobertura** do motor, não fail-open: a 026 a contorna de forma
conservadora (o item vira hipótese rotulada, nunca afirmação de aquisição). Classe
**frozen** (`engine_v32.js`): conserto só por **Porta B** (R1, rito D2; a Porta A
segue pendente de ratificação).

**Aberto em**: 2026-10-31, durante a Fase 6 da demanda `026-decisao-unica-do-apoio`.
Medido na Fase 0 pelo refutador (`specs/026-decisao-unica-do-apoio/anexos/refutacao-reproducoes.json`,
caso C3 e C3b) e reproduzido na W3a pela sonda
(`anexos/sonda-leitura.js` sobre `anexos/cenarios/C3.json` e `C3b.json`). Linhas
do engine relidas por mim em `fc5874f`.

### O que foi medido

**C3** — gap em `security-automation`, FortiSOC declarado **só** em `soc-platform`:
a plataforma que o cliente declarou cobre a capability, e o motor sabe
(`suppressedByPlatform().caps ∋ security-automation`), mas o ramo que o
classificou **não olha** essa informação. Resultado: `CONTEXT_NOT_INFORMED` /
`LEGACY-LABELLED`, sem nota de plataforma — a tela mostra o card `FortiSOAR`
(prioritário, com a condição «capability não informada» desde a 026) em vez de
dizer «plataforma cobre».

**C3b** — o mesmo FortiSOC declarado **na própria** `security-automation`:
`OPERATIONAL_GAP` e a nota M75 *«plataforma unificada declarada cobre esta
capability — gap é operacional, explicável»*. Aqui o motor fala, e a 026 veta o
FortiSOAR com a nota literal. As duas fixtures só diferem pelo lugar onde a
plataforma foi declarada; o comportamento do motor muda de «cobre» para «silêncio».

### Cadeia arquivo:linha → efeito

- `engine_v32.js:500-521` — `suppressedByPlatform()`: com `soc-platform` `PRESENT`
  e produto `fortisoc`, `caps` recebe toda capability de
  `OFFERINGS.fortisoc.capabilityRelations` com relação `embedded` ou `primary`
  (`:510-514`); plataforma de terceiro só suprime o que declarou em
  `solutions[].coveredCapabilities` (`:515-518`).
- `engine_v32.js:401` — `classify()`: capability com gap (`gap-high`/`gap-moderate`)
  e tecnologia `UNSET` ⇒ `CONTEXT_NOT_INFORMED`. `classify()` **não** consulta a
  supressão (`:392-419`).
- `engine_v32.js:554` — `const sup = suppressedByPlatform();` em
  `buildRecommendationContext()` (`:551`). A supressão é aplicada em **três**
  pontos: `:573-577` (ramo `TECHNOLOGY_WHITESPACE`: zera `candidates`, vira
  `CONTEXTUAL`, nota «coberta pela plataforma unificada declarada»), `:584` (ramos
  `OPERATIONAL_GAP`/`COVERAGE_GAP`/`ADOPTION_GAP`: nota M75) e `:636` (bloco de
  `contextual-support`: não adiciona).
- `engine_v32.js:601-602` — ramo `CONTEXT_NOT_INFORMED`:
  `ctx.supportMode = "LEGACY-LABELLED"; break;` — **não lê `sup.caps`**.
- **Efeito**: capability coberta pela plataforma declarada mas ainda sem
  `presence` declarada na própria capability sai do motor como abstenção; quem
  consome o `ctx` não distingue «não informada» de «não informada, mas a plataforma
  cobre».

**Dois descartes silenciosos da mesma classe** (a razão existe no engine e some):

- `engine_v32.js:447-448` — `resolveCandidates()`: `archSatisfied(o.architectureRequires)
  === "violated"` ⇒ `return;` sem registro. Em C1 (endpoint `NONE`,
  `saasAllowed:"no"`, `localProcessingRequired:"yes"`) o `fortiendpoint` é vetado
  aqui e o `fortiedr` entra; quem quer mostrar *por que* a linha `FortiEndpoint` do
  mapa não é a resolvida só consegue chamando `archSatisfied()` de novo — o que
  `entradaViva()` faz (`ui_curation_v32.js:189`).
- `engine_v32.js:658-659` — `buildRecommendationContext()`:
  `const el = serviceEligibility(sid); if (!el.eligible) return;`. Em C7
  (FortiEDR `on-prem`) `fortiguard-mdr` é inelegível («…— OG oficial», `:486`) e some
  de `ctx.services[]`; a razão só aparece chamando `serviceEligibility(sid)` de novo
  (`ui_curation_v32.js:190`). O mesmo `return` descarta o inelegível por
  `base requerida ausente` (`:484`) com `presence` `UNSET`, onde a leitura é
  *não informado*, não *ausente* — a 026 trata isso como abstenção (D-6).

### Como a 026 contorna — e por que não corrige

- **C3 vira hipótese condicionada**, não veto: a constante
  `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false` (`ui_curation_v32.js:111`) mantém o
  card `FortiSOAR` com `condicao = capability-nao-informada` e tier pela severidade
  (`D026-LEG1 (c)`, que pina a constante em `false`). Hipótese de trabalho,
  **condicionada**: ligar a constante (`:252`) daria o mesmo card com
  `plataforma-declarada-cobre` e tier 2 — nunca veto.
- **Por que nunca veto**: retirar o FortiSOAR esvazia `published()`;
  `presentationOf` nunca promove `CONTEXT_NOT_INFORMED` a `card`
  (`ui_v32.js:693-696`) e `hasSubstituteV32` exige classificação ≠
  `CONTEXT_NOT_INFORMED` (`ui_v32.js:751`) ⇒ a leitura congelada da Camada 1 **volta**
  à tela com o produto que o veto acabou de negar. Medido em C3 (desenho §2.6).
- **C3b é o caso «plataforma cobre»** que a spec usa: o motor fala (nota M75) e a
  026 veta por `D026-LEG1 (c)`.
- **Os dois descartes**: a 026 recalcula `archSatisfied()`/`serviceEligibility()`
  fora do motor para mostrar a razão (E5 e veto `elegibilidade`), e é por isso que
  `reconciliar()` carrega dois literais próprios para vetos que o engine emite sem
  nota (`SEM_CANDIDATO`, `ARQ_VIOLADA`, `ui_curation_v32.js` — «únicos literais do
  dono do estado»). É o custo de o motor não dizer a razão.

### Como foi medido (executado vs. lido)

**Executado** (refutador e sonda, jsdom, citado de
`anexos/refutacao-reproducoes.json` e do log da sonda da W3a): C3 → card `FortiSOAR`
prioritário com `condicao=capability-nao-informada`, zero veto; C3b → zero card,
veto `operacional` com «(M75)» e «Tecnologia declarada: FortiSOC (production, saas)».
**Lido por mim**: todas as linhas do engine acima, em `fc5874f`. **Não executado**:
nenhuma alteração do engine — não é desta demanda.

### Encaminhamento

Dono: `core-engineer` (guardião do engine), **Porta B** (spec + auditoria
independente humana; mudar o `ctx` de `CONTEXT_NOT_INFORMED` altera o payload
funcional, logo a régua D2 reprova a Porta A). Três pontas, que **não** precisam
sair juntas:

1. ramo `:601-602` consultar `sup.caps.has(capId)` e dizer «plataforma declarada
   cobre» como o `:576` e o `:584` já dizem;
2. o descarte de `:448` e o de `:659` passarem a deixar rastro legível (por exemplo,
   `ctx.notes` ou lista de inelegíveis) para o consumidor não recalcular fora do
   motor;
3. **dependência de outra classe**: enquanto `hasSubstituteV32` exigir classificação
   ≠ `CONTEXT_NOT_INFORMED` (`ui_v32.js:751`, §29.4), um veto em
   `CONTEXT_NOT_INFORMED` continua devolvendo a Camada 1 — a ponta 1 sozinha não
   libera ligar a constante da 026 por veto. A decisão de mexer ali é do
   proprietário.

Ver `EA-76` (fecho da 026) e `EA-79` (convivência sob gate fechado). Fora do
escopo da 026 (`specs/026-decisao-unica-do-apoio/spec.md` §Fora de escopo).

### Nota de 2026-10-31 — observação (c) do aceite de intenção da 026

Os códigos internos do engine chegam ao texto que o cliente lê — `(M75)` e `(M50)` nas notas de
`ctx.notes`, «OG oficial» em `serviceEligibility().reason` — e a 026 os reproduz **literalmente** nos
vetos (decisão D-4: a razão é a do motor, literal). Não é introdução da 026: `#pr-support` já os
imprimia (medido pelo `product-owner` em C3b/C7). A redação das notas é do engine (frozen) e entra
na mesma Porta B deste achado; até lá, o passe de copy da apresentação não os reescreve (R10 §1:
o literal é o observável de `D026-REC1 (b)(d)`).

## EA-123 — `exclude` obsoleto sem sujeito no arquivo de sessão: decisão sobre linha que o motor deixou de ofertar sobrevive sem efeito e sem aviso

**Status**: `aberto`

**Aberto em**: 2026-10-31, na Fase 6 da demanda `026-decisao-unica-do-apoio`, ao listar
os residuais do `EA-76`. Fora da 026. Severidade (triagem do `doc-writer`): baixa —
não publica produto errado hoje; deixa uma decisão do operador invisível.

**Cadeia** (`ui_curation_v32.js`, lida em `fc5874f`; **não executado**):
`set()` (`:554-558`) aceita `exclude` para qualquer id do catálogo (`valido()`,
`:428-433`) e `paraSessao()` (`:473-476`) o grava no arquivo. Se a avaliação muda e a
linha deixa de ser ofertada, `publicados()` (`:444-454`) parte de `ofertados()` e
ignora o `exclude`; `contract().suppressed` (`:591`) lista só ofertados;
`inclusoesSemLastro()` (`:463-467`) cobre só `include`. **Efeito**: o `exclude` fica
no arquivo sem efeito e sem aviso — e, se a linha voltar a ser ofertada numa sessão
futura, o card some em silêncio (`decidir()`, `:436-439`).

**Encaminhamento**: dar ao `exclude` sem sujeito o mesmo aviso do `include` sem
lastro, ou descartá-lo com registro na importação. Mexe no dono do estado e no
contrato `unsupported`: demanda própria, não fix-finding. Ver `EA-76`.
