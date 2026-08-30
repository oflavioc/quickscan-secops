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
