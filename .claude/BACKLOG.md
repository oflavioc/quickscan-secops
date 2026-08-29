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

**Status**: `aberto`

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

**Efeito**: das 13 suítes que §29.4 declara "edição proibida nesta fase", só
`tests_unset_ug.js` tem identidade byte a byte fixada por algum gate — as
outras **12 podem ser editadas livremente sem que nenhuma máquina reclame**,
apesar da prosa dizer o contrário. `P50-GOV1` continua passando: o arquivo
ainda existe, só não é mais o mesmo.

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
§29.4, e o fix alinha o texto ao gate — não o contrário. Esta é uma hipótese a
ser decidida pelo `product-owner`/proprietário no fix-finding, não uma
conclusão deste registro.

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
  sessão: 21 entradas somadas nos 4 arrays `targets` (16 arquivos distintos,
  com sobreposição entre harnesses — `ui_v32.js` e `ui_session_v32.js`
  aparecem em mais de um). A sessão da 009 relatou 20 na sua própria
  contagem independente; a diferença de 1 não foi reconciliada nesta sessão
  e não muda a conclusão — nenhum dos dois totais inclui qualquer arquivo de
  `.claude/verify/` ou `tests_session_m48.js`.
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
