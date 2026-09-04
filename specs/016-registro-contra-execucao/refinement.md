# Refinamento — 016-registro-contra-execucao

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.

Achados de origem: **`EA-33`** (`.claude/BACKLOG.md:1841`) e **`EA-14` / borda 8**
(`.claude/BACKLOG.md:1025`; `specs/013-integridade-da-campanha/spec.md:192`,
`:348-351`; `mutation-matrix.json → dividas_declaradas`, entrada "Borda 8").
Família: **`EA-31`** (`.claude/BACKLOG.md:1595`) — *o registro da prova não é
comparado com a execução da prova*. Autorização do usuário no chat, 2026-09-04:
*"Prossiga com a EA-33 e a borda 8"*.

Tudo abaixo foi **lido** na worktree `phase5-014` (branch
`feature/016-registro-contra-execucao`, de `origin/develop` em `921977c`). Não
executei comando nenhum; o que dependeria de execução está em §O que ficou por
medir, com dono.

---

## Necessidade

Quem usa isto não é o facilitador: é **quem confia no verde para mesclar** — o
proprietário e o orquestrador sob delegação. Hoje o verde do CI e o verde do
`state-eval` dizem duas coisas que não são verdade: (1) que uma demanda cujo
merge já está em `develop` ainda está "em voo", e (2) que uma campanha de
mutação exigida foi tratada, quando o que houve foi uma **promessa** (`[DEFER]`)
de que outro job a executaria — promessa que ninguém cobra.

O custo é medido, não hipotético. Entre 2026-08-30 e 2026-09-04, **cinco**
demandas entraram na `develop` com a Fase 6 aberta (009, 010, 011, 013, 015 —
`fecho_retroativo` nos cinco planning-states) e uma **sexta** (014) entrou com
`phase: implement` e `pr_url` vazio, criada no mesmo ciclo em que o `EA-33` foi
aberto (`014-gate-sem-poder-discriminante.json → validate.fecho`). A 011 entrou
**sem aceite de intenção nenhum**, com a dívida escrita em
`specs/011-numeracao-das-prioridades/relatorio-final.md:264` ("Não executado
nesta wave") — declarada com honestidade, recolhida por ninguém. Do outro lado,
duas demandas precisaram ir ao log do CI **à mão** para provar que um
deferimento fechou: a 009 (run 33298658338) e a 013 (run 33295007844 — job
`visual` fechou às 06:40:17Z, merge às 06:41:22Z: **65 segundos**, sem nada que
obrigasse a esperar). Um dia de trabalho retroativo, e o hook anunciando quatro
demandas "em voo" a cada prompt até ninguém mais ler a linha.

Por que agora: os dez planning-states existentes acabaram de ser postos em `done`
(fecho retroativo de 2026-09-01/04). É o único momento em que um gate desta
natureza **nasce verde no registro** e pode ser instalado sem virar o vermelho
crônico que ninguém roda (`EA-5`). Daqui a duas demandas, não mais.

---

## Enquadramento de produto

### A propriedade, em linguagem de invariante

> **P16 — O merge é o vencimento de toda promessa feita à verificação.**
> Nenhuma promessa que um artefato de processo faz a um gate sobrevive ao merge
> em `develop` sem ter sido **cobrada por execução**.

Duas instâncias, que são a mesma proposição aplicada a dois pares
registro/execução:

| | promessa (registro) | execução que a cobra | vencimento |
|---|---|---|---|
| **P16.a** — demanda | `planning-state.phase` promete que a Fase 6 fecha antes do merge | o histórico do git: o merge da branch da demanda está em `develop` | o merge do PR |
| **P16.b** — campanha | `[DEFER] <harness>: exigida — delegada ao job visual` promete que o job irmão executa | o veredito real de `check_mutation.py` sobre aquele head SHA, com Chromium presente | o merge do PR |

**Por que o vencimento é o merge e não outra coisa** — resposta à pergunta 3 do
enunciado, que decide o resto:

- **Não é prazo em dias.** A promessa é sobre um head SHA, não sobre o calendário.
  Um PR pode ficar legitimamente aberto por dias; o que não pode é ser mesclado
  com a promessa em aberto.
- **Não é o `done` da demanda.** Amarrar a cobrança ao `done` cria um segundo
  registro (o planning-state teria de gravar o número do run) — e branch sem
  demanda (`chore/*`, `fix/*`) não tem `done`. Seria confrontar registro com
  registro, a doença da família `EA-31` um nível acima.
- **É o merge**, por uma razão medida no próprio repositório: depois do merge o
  gatilho da campanha **fica cego** — `check_mutation.py:466-473` calcula
  `changed` pelo merge-base com `origin/develop`, e no push pós-merge o diff é
  vazio (dívida declarada, `mutation-matrix.json → dividas_declaradas`, "Trigger
  por merge-base não dispara em push na própria develop"). A execução do PR é a
  **única** que existirá para aquelas mudanças. Se a promessa não foi cobrada
  antes do merge, nunca mais será, por máquina.

E o corolário que o enunciado pede que fique explícito: **quem cobra no merge é
a proteção de branch** (check obrigatório sobre o head SHA), que é uma
configuração **fora do repositório**. Nenhum gate desta casa pode criá-la; pode,
no máximo, auditá-la. Sem ela, todo o resto desta demanda decide vermelho e verde
e **ninguém é obrigado a olhar** — o caso dos 65 segundos é exatamente esse.
Ver P2 das rodadas.

### A formulação fraca de P16.a (contra "toda demanda mesclada está em `done`")

A formulação óbvia reprova casos legítimos. A que passa a valer:

> Toda branch de demanda (`feature/NNN-*`, R14: casa com `specs/NNN-slug/`) cujo
> merge está no histórico de `develop` tem planning-state `NNN` em `done` **com
> os artefatos da Fase 6 em disco** — ou um **fecho pendente declarado**
> (nominal, com motivo, dono e prazo não vencido), impresso a cada verificação.

Os quatro enfraquecimentos, cada um com a razão:

1. **População = branches de demanda ∩ planning-states.** `chore/fecho-009-013`,
   `fix/ea32-particao-do-p52-ra8`, as branches das Ondas 0–4, os merges
   `main→develop` da integração v3.2.2 ficam **fora por construção** — não são
   demandas, não prometem Fase 6. A chave de junção já existe: R14 fixa
   `feature/NNN-slug` ↔ `specs/NNN-slug/`.
2. **Válvula nominal com prazo.** A recusa do `product-owner` e do `qa-engineer`
   de mover a 013 a `done` sem `spec-validate.md`/`relatorio-final.md`
   (`013-integridade-da-campanha.json → validate.notes`) foi **correta** e não
   pode virar vermelho que bloqueia PR alheio. O estado honesto de uma demanda
   mesclada sem fecho é **"mesclada sem fecho, declarado, com dono e prazo"** —
   amarelo impresso, não verde nem vermelho silencioso. Precedentes da casa:
   `tdd_waiver` (`{motivo, data}`, listado pelo `compliance-audit`) e a exceção
   nominal do `known_issues.json` (`remocao_prevista` obrigatória; "exceção sem
   prazo vira permissão permanente", `known_issues.json → _meta`). Vencido o
   prazo, reprova — como `IC-9.3`.
3. **Piso temporal (âncora) para a direção git→registro.** Merges anteriores ao
   nascimento do gate não são julgados: R13 ("fases seladas sob o processo
   antigo valem como foram seladas") e R10 §5 (âncora de regressão é commit
   imutável + SHA). Sem isso o gate nasce vermelho sobre a história e vira o
   `EA-5`.
4. **`done` não exige "CI verde".** A `new-demand` diz hoje "*Planning-state
   `done` só com PR aberto e CI verde*" (`.claude/skills/new-demand/SKILL.md:66`).
   Se um check pré-merge passar a exigir `done`, a frase cria um **impasse**:
   `done` espera CI verde, CI verde espera `done`. `done` passa a significar
   **Fase 6 completa com PR aberto**; "CI verde" vira condição do **merge**, que
   é onde sempre pertenceu (R14: merge é do usuário). Ver P7.

### Invariantes tangenciadas (R1)

**Nenhuma das dez muda.** P16 é propriedade de **processo**, não de produto: vive
na família de R4 (Fase 6, `done`), R14 (merge) e R10 §2 (nunca silêncio). **Não**
entra em `.claude/verify/invariants.json` — aquele arquivo é "invariantes de
produto" e o `compliance-audit` afirma "10/10" (`compliance-audit.sh:76`);
inflar a lista com processo confundiria a régua. A âncora normativa de P16 é uma
frase em `sdd.md` (Fase 6: *merge só depois de `done`*) mais os gates mapeados em
`pipeline.yaml`/`verify.yml`. É o mesmo enquadramento que a 014 deu ao
`EA-7`: a frase que sustenta a R1 — *"invariante sem gate é prosa"* — aplicada
ao próprio processo.

**INV-9 por reflexo**: nenhum arquivo tocado é `frozen`. `check_state.py`,
`check_tdd.py`, `verify.yml`, a skill e o schema são pinados (R8 → `gen_pins.py`
no mesmo PR), sem rito D2.

### Conflito com decisão registrada

- **KI-3 / `design-decisions.md` ("Suítes visuais fora do agregado local … job
  `visual` do CI (em calibração)")**: a rota recomendada para P16.b move as
  **campanhas** (não as suítes) para o job `verify`. O agregado **local** não
  muda um byte. Mas há uma **divergência doc×código a registrar**: o
  `design-decisions.md` diz "em calibração" enquanto `known_issues.json → _meta`
  diz "KI-2/KI-3 cumpridas na Onda 4" e `verify.yml:47` diz "Promovido na Onda 4
  (calibração fechada na 6ª rodada)". A razão que justificou o deferimento —
  job `visual` ainda não confiável como check — **já não existe**. O deferimento
  é fóssil dela. Correção da linha do `design-decisions.md` é do `doc-writer`,
  no PR desta demanda.
- **Spec 013, T7 ("nenhuma mudança em `verify.yml`"), C4 ("`MUTATION_DEFER_MISSING`
  permanece com a semântica atual, intocada", `:250-251`), borda 8 (`:192`) e a
  cláusula de regressão de §Nascimento de gate ("`DEFER`/`FAIL` intactos")**:
  são **restrições de escopo da 013**, não decisões de desenho — a própria spec
  as devolve como "demanda própria" (Risco 4). A 016 as supera por **errata de
  registro** na spec pinada da 013 (precedente: erratas G1/G2 de 2026-09-01),
  nunca por afrouxamento: o que muda é que ambiente ausente passa a reprovar
  **em todo lugar**, o que é mais forte (R10 §1).
- **"planning-state fora do registry de pins"** (`design-decisions.md`): o gate
  proposto lê o planning-state e o git, não pina nada — coerente.
- **R13 "fases seladas sob o processo antigo"**: é o que sustenta o piso.

### Alternativa mais simples considerada

**Rito manual**: acrescentar à `new-demand` e ao `verify` "antes de mesclar,
confira `done`". Recusada: a frase **já existe** (`SKILL.md:66`) e as seis
instâncias aconteceram com ela escrita, cinco sob delegação. Prosa não vigia —
é o E1/E3 que motivou a Estrutura Agêntica. O que faltou não foi lembrete, foi
**vigia**.

**Para P16.b, porém, existe um caminho mais simples que "vincular o DEFER à
execução" — e ele é a recomendação**: *não fazer a promessa*. Ver §Rotas, R-b1.

---

## Sistema real

### 1. O que `check_state.py` compara, e com o quê

`check_state.py:34-53` valida forma (campos obrigatórios, enums, slug ↔ nome do
arquivo, `spec_dir` existe), a cláusula R3 (`:48-51`: fase pós-red exige
`red.status = proven` + `red.commit` ou `tdd_waiver`) e **uma única** cláusula
sobre `done` (`:52-53`: `done` sem `pr_url` reprova). **Nada olha para fora do
arquivo.** A relação "esta branch já foi mesclada" não é lida em lugar nenhum.

O precedente de stage que lê o git existe ao lado: `check_tdd.py:30-36` executa
`git cat-file -e <red.commit>` e reprova se o commit não existir. É a forma
exata do que falta — só que na direção "o commit existe", nunca "o commit está
no histórico de `develop`".

### 2. O que o `state-eval` anuncia

`.claude/hooks/state-eval.sh:58-67`: todo planning-state com `phase != "done"`
entra em `ativos` e é impresso em `[demanda]`. Mesclada ou não, é "em voo". O
hook já chama `git` (`:13`, `:17`, `:29`); saber se a branch foi mesclada custa
uma chamada a mais.

### 3. O que a skill promete e a ordem em que as coisas acontecem

`new-demand/SKILL.md:60-66` (Fase 6): (1) QA — green + mutante + pipeline
completo verde + `spec-validate`; (2) PO — aceite; (3) push + PR; "*merge é do
usuário. Planning-state `done` só com PR aberto e CI verde*". A ordem prevista
é **`done` antes do merge**. As seis instâncias inverteram a ordem — e a skill
não tem como impedir, porque a única coisa que roda no merge é o CI, e o CI não
lê a fase.

Duas consequências que a Fase 1 tem de carregar:

- **O check pré-merge não pode viver dentro de `run.sh`.** O QA precisa de
  "pipeline completo verde" para escrever o `spec-validate` (passo 1), que
  precede o `done`. Um stage do `pipeline.yaml` que reprove "demanda desta branch
  não está em `done`" tornaria a Fase 6 **impossível de fechar**. O check
  pré-merge é contexto de PR (job próprio em `verify.yml`, ou stage que só
  decide sob `GITHUB_BASE_REF` e é **informativo nomeado** fora dele). Onde mora
  é do `tech-lead`; a restrição é de negócio e fica aqui.
- **A direção pós-merge (git → registro) pode viver em `run.sh`**: nunca dispara
  no PR da própria demanda (o merge ainda não está em `origin/develop`), só
  depois da violação — e aí deve doer em todo PR seguinte, com a válvula como
  saída honesta.

### 4. Como se sabe, sem rede, que uma branch foi mesclada

Dois oráculos, para o `tech-lead` escolher e o gate **imprimir qual respondeu**
(padrão de IC-5/IC-6):

- **Ancestralidade do `red.commit`**: se `red.commit` é ancestral de
  `origin/develop` (`git merge-base --is-ancestor`), a branch foi mesclada com
  merge verdadeiro. Robusto a nome de branch e a PR deletado; **cego a squash e
  rebase** — que R14 proíbe em branch de fase, logo é a regra da casa. Três
  planning-states registram SHA curto (`011: 5bf4731`, `014: 71b4347`,
  `015: f084c02`); ambiguidade é caso de borda.
- **Mensagem do commit de merge**: `Merge pull request #N from
  <owner>/feature/NNN-slug` — é como o `EA-33` conferiu (`4092463`, `2426582`).
  Cobre demanda **sem** `red.commit` (`tdd_waiver`) e a direção git→registro
  (merge de `feature/NNN-*` sem planning-state). Heurístico: depende do formato
  do GitHub e de o merge não ter sido feito por outra rota.

Nenhum dos dois usa `pr_url` por rede — e não deve: o `pr_url` da 003 aponta
para **outro repositório** (`quickscan-secops-v32-phase5-dev/pull/13`).

### 5. O estado dos registros hoje — o gate nasce verde no registro

Os dez planning-states existentes estão em `done` (003, 007, 008, 009, 010,
011, 012, 013, 014, 015); o 016 está em `refinement`. A direção
registro→git **não reprova nada hoje**. Mas a cláusula "done ⇒ artefatos da
Fase 6 em disco" **nasceria vermelha em três**:

| demanda | `relatorio-final.md` | `spec-validate.md` |
|---|---|---|
| 003 | **ausente** | **ausente** |
| 009 | presente | **ausente** |
| 010 | presente | **ausente** |
| 007, 008, 011, 012, 013, 014, 015 | presente | presente |

A 014 provou o valor da cláusula: `conformance: "19/19"` viveu **só no JSON** de
2026-09-01 a 2026-09-04 sem que o artefato existisse
(`014 → validate.spec_validate.retroativo`). `check_tdd.py:37-38` exige só a
string. Ver P4.

Um segundo drift de forma, registrado para a Fase 1: a 010 e a 015 usavam a
chave **`validacao`** (PT) enquanto os gates leem **`validate`** (EN); o bloco
`validate` foi escrito no fecho retroativo "para o formato que
`check_tdd.py:37` cobra" (`010 → validate.nota`). O gate novo lê a chave
canônica e o schema deveria proibir a irmã — do `data-engineer`.

### 6. O deferimento, de ponta a ponta

- `verify.yml:39-42`: o job `verify` roda `run.sh` com
  `MUTATION_DEFER_MISSING: "1"`.
- `check_mutation.py:1286-1303`: para cada harness exigido cujo `requires` falta,
  com a env → `[DEFER] … delegada ao job com chromium (job visual)` e `continue`
  **sem `fails += 1`** (`:1297-1299`); sem a env → `[FAIL]` nomeado
  (`:1300-1302`). `mutation_map.json`: `p50`, `p51`, `p52`, `d014vis` exigem
  `chromium` (`:69`, `:90`, `:110`, `:163`).
- `verify.yml:46-81`: o job `visual` **não tem `needs`** e o `verify` **não
  espera por ele**; instala Chromium + poppler (`:63-68`); roda as quatro suítes
  (`:69-74`); restaura `docs_phase5/` (`:75-79`); e **só então** roda
  `check_mutation.py` (`:80-81`). Passo que falha aborta o job e os seguintes
  ficam `skipped` — `EA-14`.
- `verify.yml:49`: em `workflow_dispatch` sem `inputs.visual`, o job `visual`
  **não roda**; o `verify` defere para um job que não existe naquele run.
- Ninguém compara a lista de `[DEFER]` do `verify` com o que o `visual` executou.
  Ambos derivam `changed` do mesmo merge-base — o `visual` **tende** a exigir as
  mesmas campanhas —, mas isso é coincidência de código, não cobrança.
- Pós-merge: diff vazio, nada exigido (§Enquadramento). A prova do PR é a única.
- E há **duas espécies de deferimento** no repositório, que não se confundem:
  o `[DEFER]` do CI (máquina promete a máquina) e o **"DEFERIDO AO JOB VISUAL /
  ao rito do proprietário"** da matriz (`mutation-matrix.json:852`, `:1706` —
  `D011-M9`), em que um **humano** é o credor. A 016 alcança só a primeira.

### 7. O custo da rota "sem deferimento", medido no que há

`check_suites.py:25` executa só os blocos `suites` e `heavy`; o bloco `visual`
de `expected_suites.json` é lido apenas em `:49`, para o censo de cobertura.
Logo, instalar Chromium no job `verify` **não** faz as suítes visuais rodarem
nele — o único acréscimo é o stage `mutation` executar as campanhas. Duração de
referência (`mutation-matrix.json → _meta.execucao_ci_demanda_010`): `verify`
11m34s, `visual` 37m45s — o segundo **inclui** as quatro suítes; a fatia só das
campanhas não está separada em lugar nenhum (pendência 3). `run.sh:91-93`: só
`env-doctor` aborta o pipeline — no `verify`, uma suíte vermelha **não** pula a
campanha, o que é exatamente o mecanismo do `EA-14` desaparecendo.

### 8. Divergências doc × código encontradas

| onde | diz | estado real |
|---|---|---|
| `design-decisions.md` (KI-3) | job `visual` "em calibração" | `known_issues.json → _meta`: KI-3 cumprida na Onda 4; `verify.yml:47`: calibração fechada |
| `new-demand/SKILL.md:66` | `done` só com PR aberto **e CI verde** | impasse com check pré-merge de `done`; seis merges antes do `done` |
| `sdd.md` (tabela de fases) | portão da Fase 6 = "aceite do PO" | não diz que o **merge** espera o `done`; R14 diz só "merge é do usuário" |
| `010`/`015` planning-state | chave `validacao` | gates leem `validate`; espelhado a mão no fecho retroativo |
| `planning-state.schema.json:15` | `branch` opcional | é a chave de junção com o git; todos os onze arquivos o têm |

---

## Rotas, com o rito de cada uma

Nenhum arquivo é `frozen`; o rito é o comum (R3 red commitado, autor do gate ≠
implementador; R8 repin no mesmo PR; R10 §9 no `pipeline.yaml`).

### P16.a — demanda × git

| rota | o que faz | onde vive | avaliação |
|---|---|---|---|
| **R-a1** direção registro→git | para cada planning-state com `phase != done`: se a branch já está mesclada em `origin/develop` e não há fecho pendente declarado válido ⇒ **FAIL nomeado** (demanda, oráculo que respondeu, SHA do merge-base) | stage `state` (`run.sh`) | **recomendada**. Nunca dispara no PR da própria demanda; depois da violação dói em todo PR — com a válvula como saída |
| **R-a2** direção git→registro | para cada merge de `feature/NNN-*` em `develop` **posterior à âncora**: existe planning-state `NNN` e está em `done`? | stage `state` | **recomendada com piso** (P9). Apanha demanda feita fora da máquina (R4 §Violação). Sem piso nasce vermelha na história |
| **R-a3** check pré-merge | em contexto de PR: a demanda de `GITHUB_HEAD_REF` (se `feature/NNN-*`) está em `done`? senão ⇒ FAIL **distinguível** de falha de produto | **fora** de `run.sh` (job/check próprio); check **obrigatório** na proteção de branch | **recomendada** — é o único que **previne**; os outros dois só acusam. Sem proteção de branch, não vence |
| **R-a4** `done` ⇒ artefatos | `done` exige `relatorio-final.md` e `spec-validate.md` em `spec_dir` (não só a string `conformance`) | `check_tdd.py:37-38` | **recomendada** (P4). Registro × disco, mesma família; três históricas fora por exclusão nominal impressa |
| **R-a5** válvula | `fecho_pendente: {motivo, dono, prazo}` no planning-state; listada pelo `compliance-audit` ao lado dos waivers (`compliance-audit.sh:213-235`); vencida reprova | schema + `state` + audit | **recomendada** (P3) |
| **R-a6** hook | `state-eval` distingue "mesclada sem fecho" de "em voo" | `state-eval.sh:58-67` | barata e informativa; entra se o TL couber na wave |
| R-a7 rito manual | linha na skill | prosa | **recusada** (§Alternativa mais simples) |

### P16.b — campanha × execução

| rota | o que faz | avaliação |
|---|---|---|
| **R-b1** retirar o deferimento | o job `verify` instala Chromium + poppler (como `visual:63-68`) e roda o stage `mutation` **inteiro**; `MUTATION_DEFER_MISSING` sai do `verify.yml`; o ramo `[DEFER]` (`check_mutation.py:1297-1299`) é **removido** — ambiente ausente ⇒ FAIL nomeado em todo lugar; o passo `:80-81` sai do job `visual`. Errata de registro na spec 013 (T2, T7, C4, borda 8, §Nascimento regressão, G1). `EA-14` fecha por consequência (a campanha deixa de ficar atrás das suítes) | **recomendada** (P1). A promessa que não existe não vence. É mais forte, não mais fraca (R10 §1). Custo: minutos de CI (pendência 3) e uma errata |
| **R-b2** promessa + recibo + credor | o `visual` publica recibo `{harness, head_sha, veredito}` como artefato; job `reconcile` (`needs: [verify, visual]`, `if: always()`) compara a lista de `[DEFER]` com os recibos e reprova qualquer promessa sem recibo **do mesmo head SHA**; gate com sonda sintética (função pura, padrão IC-9.4/IC-10) | **reserva**, se o custo de tempo de R-b1 for recusado. Três jobs, artefatos, calibração; o red só se prova no PR. Introduz vocabulário próprio (recibo, deferimento vencido) |
| **R-b3** proteção de branch exigindo `verify` **e** `visual` | o merge espera os dois jobs | **necessária em qualquer rota** — é o credor. **Insuficiente sozinha**: não nomeia (o `EA-14` continua com diagnóstico errado), não cobre `workflow_dispatch` sem `visual`, e não reconcilia listas |
| R-b4 só reordenar o job `visual` (campanha antes das suítes) | fecha a ordem do `EA-14` | não cobra promessa nenhuma; **recusada** como rota principal |
| R-b5 não fazer, registrar | — | **recusada**: custo já medido duas vezes |

**Recomendação**: **R-a1 + R-a2 (com piso) + R-a3 + R-a4 + R-a5** para P16.a;
**R-b1 + R-b3** para P16.b. Quem desenha é o `tech-lead` com o `qa-engineer` e o
`build-engineer`; isto é recomendação de produto, não desenho.

---

## Desafio ao enquadramento — uma demanda ou duas?

O orquestrador recomendou juntar por serem a mesma propriedade; o usuário
aprovou. A propriedade é uma (P16) e o vocabulário é compartilhado — isso
sustenta **um refinamento e uma spec**. O que **não** é o mesmo são os
**mecanismos, os donos e onde o red se prova**:

| | P16.a | P16.b (R-b1) | P16.b (R-b2) |
|---|---|---|---|
| mecanismo | Python lendo git e JSON | configuração de CI + remoção de ramo + errata | 3 jobs, artefatos, script novo |
| red provável | **localmente**, com fixture e worktree | localmente para o ramo removido (sonda de `check_mutation`); a fiação só no PR | **só no CI**, no PR |
| risco de calibração | baixo | baixo | médio (a Onda 4 gastou 6 rodadas no job `visual`) |
| dono | `core-engineer`/`qa-engineer` | `build-engineer` | `build-engineer` + `qa-engineer` |

**Posição**: **uma demanda se R-b1; duas se R-b2.** Sob R-b1 a metade da
campanha encolhe a uma mudança de `verify.yml`, um ramo removido e uma errata —
pequena o bastante para viajar na mesma spec, em wave própria. Sob R-b2 o red do
recibo seguraria a metade local refém de rodadas de CI, e a separação
(016 = `EA-33`; 017 = borda 8) seria o certo. Ver P5.

E a metade que **não vale o custo** de construir: uma *reconciliação nominal*
de promessas (R-b2) quando a promessa pode simplesmente não ser feita. A 013
manteve o `DEFER` porque mexer em `verify.yml` era ampliação de escopo — razão
de escopo, não de desenho.

---

## O que este gate NÃO mede

Escrito para que ninguém o cite como prova do que ele não prova (lição da 014:
gate que promete e não mede é pior que gate ausente).

1. **A qualidade do fecho.** Ele mede que o registro diz `done` e que dois
   arquivos existem — não que o "não encontrei objeção" foi um juízo e não um
   carimbo, nem que o `spec-validate.md` mediu o que diz. Carimbo continua sendo
   defesa humana (D3).
2. **A proteção de branch.** Nenhum gate do repositório pode obrigar o merge a
   esperar um check. Sem check obrigatório, R-a3 e o CI inteiro são **conselho**.
   Auditar a proteção por `gh api` exige permissão que o `GITHUB_TOKEN` padrão
   pode não ter (pendência 2).
3. **Merge por squash/rebase.** R14 proíbe; se ocorrer, o oráculo de
   ancestralidade cala e o de mensagem pode não casar. O gate tem de dizer
   "**não determinável**" — nunca verde (R10 §2).
4. **Promessas humanas.** O "DEFERIDO AO RITO DO PROPRIETÁRIO" da matriz
   (`D011-M9`) e a data de `ultima_prova` são território do `EA-30`; ficam onde
   estão.
5. **A campanha pós-merge na `develop`.** O gatilho cego pós-merge continua
   (dívida própria na matriz); a prova é a do PR.
6. **Árvore testada = árvore mesclada.** Se `develop` andar entre o último run e o
   merge, o que foi testado não é o que entrou. É a opção "require branches to
   be up to date" da proteção — decisão de fluxo do proprietário (P2).
7. **A história anterior à âncora.** Por desenho (R13).
8. **Conteúdo de `relatorio-final.md`.** Só existência.

---

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | Branch `chore/*`, `fix/*`, `hotfix/*`, Onda, `main→develop` mesclada sem planning-state | **Fora da população** por construção (só `feature/NNN-*` ∩ planning-state). Nem verde nem vermelho: não julgada, e o gate imprime o critério de população uma vez por execução |
| 2 | Demanda mesclada com fase `< done` e **sem** `fecho_pendente` | FAIL nomeado em R-a1: demanda, fase, oráculo que respondeu, SHA de `origin/develop` julgado. Reprova em todo PR seguinte até fecho ou declaração |
| 3 | Demanda mesclada com fase `< done` e `fecho_pendente` **válido** (motivo, dono, prazo futuro) | **Não reprova**; linha impressa a cada execução com dono e prazo (cláusula "impressa, nunca silenciosa" do IC-9); listada pelo `compliance-audit` como os waivers |
| 4 | `fecho_pendente` com prazo **vencido**, ou sem `dono`/`motivo`/`prazo` | FAIL — exceção sem prazo é permissão permanente; vencida perdeu a razão (IC-9.3) |
| 5 | `fecho_pendente` declarado em demanda que **está** em `done` | FAIL — exceção obsoleta (a mesma direção do IC-9.3): remova a entrada |
| 6 | O PR da própria demanda, antes do `done` | R-a1/R-a2 **silenciosos** (o merge não está em `origin/develop`); R-a3 **vermelho e nomeado** ("fecho pendente da demanda NNN") — e o pipeline local do QA continua verde, porque R-a3 não vive em `run.sh` |
| 7 | `done` sem `relatorio-final.md` ou sem `spec-validate.md` em `spec_dir` | FAIL em R-a4, exceto as três históricas (003, 009, 010) por **exclusão nominal impressa** com a fonte (R13) — ou pelos artefatos escritos retroativamente (P4) |
| 8 | `red.commit` em SHA curto (`5bf4731`) ambíguo, ou `tdd_waiver` sem `red.commit` | Oráculo de ancestralidade **não responde**; cai para o de mensagem; se nenhum responder ⇒ FAIL "não determinável", nunca verde |
| 9 | `origin/develop` **desatualizado** localmente | O gate imprime o SHA que julgou; um merge recente pode escapar até o `fetch`. No CI `fetch-depth: 0` (`verify.yml:29`) resolve. Não é SKIP: é veredito sobre um SHA declarado |
| 10 | Clone raso (`fetch-depth: 1`) ou `git` ausente | FAIL nomeado, nunca SKIP — mesma regra que `check_tdd.py` já depende |
| 11 | Planning-state **sem `branch`** | FAIL de forma ("registro sem chave de junção"); schema passa a exigir `branch` |
| 12 | `feature/NNN-*` mesclada **antes da âncora** sem planning-state (001, 002, 004–006, se existirem) | Fora do julgamento pelo piso; contagem "N merges anteriores ao piso" impressa. Quais existem é a pendência 1 |
| 13 | Demanda abandonada — nunca mesclada, branch apagada, fase parada | **Não é `EA-33`** (não há merge). Fica "em voo" no hook para sempre. Fora de escopo; candidata a estado terminal (P8) |
| 14 | Merge em `main` (selagem) | Não julgado: R14 diz que `develop→main` é release, não demanda. A história de `main` contém a de `develop` |
| 15 | (R-b1) Chromium não instala no `verify` | `have("chromium")` falso ⇒ campanha exigida ⇒ **FAIL nomeado** (`:1300-1302`), job vermelho — sem env não há silêncio possível |
| 16 | (R-b1) Nenhum alvo mudou | `[OK] … campanha não exigida`, como hoje |
| 17 | (R-b1) Operador local exporta `MUTATION_DEFER_MISSING=1` | Sem efeito: o ramo não existe mais. Ambiente ausente ⇒ FAIL — não há mais promessa sem credor |
| 18 | (R-b1) `workflow_dispatch` sem `inputs.visual` | `verify` roda as campanhas mesmo assim; `visual` continua opcional para as suítes |
| 19 | (R-b1) Suíte Chromium usada como oráculo da campanha (P52-LAY2, P51-PDF1) falha por infra | O par sai `NÃO EXECUTADO · gate não pôde ser executado` (T4 da 013), a campanha reprova nomeando — a mesma exposição que o job `visual` já tem hoje, sem nova classe de silêncio |
| 20 | (R-b1) `tests_p50_chromium.js` regrava `docs_phase5/evidence_p50` (E9) dentro da campanha | `check_mutation.py:1356-1366` restaura `receipts` e reprova árvore suja ao final — o próprio stage é a guarda; confirmar no primeiro run do PR (pendência 4) |
| 21 | (R-b2, se escolhida) recibo de outro head SHA, `visual` pulado, artefato ausente | Promessa sem recibo ⇒ FAIL nomeando harness e SHA; `if: always()` para o `reconcile` correr quando o `visual` for pulado |
| 22 | O merge acontece **enquanto** o check ainda roda (os 65 segundos) | Só a proteção de branch impede. Sem ela, o gate registra a violação **depois** (R-a1) — o que é melhor que hoje, e pior que prevenir |

---

## Vocabulário

Três termos a registrar no `CONTEXT.md` **no portão desta fase** (R12; a lição da
014 — os quatro termos aprovados só entraram na Fase 6 — não se repete). Seção
"Estrutura (processo)". Redação pronta:

```md
**Fecho de demanda**:
Transição do planning-state para `done`: só legítima com a Fase 6 completa
(spec-validate com artefato, aceite de intenção registrado, relatório final em
disco) e o PR aberto — e sempre ANTES do merge. É o fecho que autoriza o merge,
nunca o merge que produz o fecho.
_Evitar_: encerramento, conclusão da demanda, "mover para done", CI verde

**Demanda mesclada sem fecho**:
Estado em que o merge da branch da demanda já está no histórico de `develop` e o
planning-state ainda não está em `done`. É violação de fecho medida pela máquina
(git × registro), não demanda "em voo"; a saída honesta é o fecho retroativo (R4
§Violação detectada) ou um fecho pendente declarado.
_Evitar_: demanda em voo, fase aberta, pendência de registro, atraso de estado

**Fecho pendente declarado**:
Exceção nominal gravada no planning-state de uma demanda mesclada sem fecho, com
motivo, dono e prazo. Impressa a cada verificação e listada pelo compliance-audit
como os waivers; vencida ou obsoleta, reprova. Nomeia a dívida enquanto os
artefatos da Fase 6 não existem — nunca os substitui.
_Evitar_: waiver de fecho, done provisório, exceção de merge
```

**Sobre os candidatos do enunciado** — *promessa de execução* e *deferimento
vencido*: **não entram sob R-b1**. Definir termo para um conceito que a demanda
aposenta é ruído no glossário. Se R-b2 for a escolhida, entram dois — **Recibo
de execução** (registro emitido pelo job que executou, com harness, head SHA e
veredito, consumido por quem prometeu) e **Deferimento vencido** (promessa de
execução cujo vencimento, o merge, passou sem recibo). E a resposta à pergunta
de família: **sim, é a mesma família** de *prova de discriminância vencida*
(`CONTEXT.md:212-217`) — `EA-31`, registro × execução —, mas eixo diferente: lá
o registro **envelhece** (KILL medido em árvore anterior); aqui o registro
**promete e ninguém cobra** (execução que nunca aconteceu). Um é *stale*; o
outro é *ausente*. O glossário já separa "não executado" de "sobrevivente"
(`:182-191`) pela mesma razão.

Termos já canônicos que esta demanda usa sem redefinir: *demanda*, *gate*,
*mutante não executado*, *achado*, *status de achado*, *selagem*,
*commit-âncora*, *boundary*, *pin / repin*.

---

## Rodadas de entrevista

Uma recomendação por pergunta. Nenhuma respondida ainda.

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1 · P1 | **Rota para P16.b**: retirar o deferimento (R-b1 — o `verify` instala Chromium e roda as campanhas; `MUTATION_DEFER_MISSING` e o ramo `[DEFER]` saem) ou manter a promessa e cobrá-la por recibo (R-b2)? **Recomendo R-b1.** A razão do deferimento (KI-3, job `visual` não confiável) já não existe; a promessa que não se faz não vence; e é mais forte (ambiente ausente reprova em todo lugar). Custo: minutos de CI no `verify` (a fatia das campanhas ainda não está medida — pendência 3) e uma errata de registro na spec 013. | |
| 1 · P2 | **Proteção de branch em `develop`**: existe hoje? quais checks são obrigatórios? **Recomendo** configurar `verify` e `visual` (e o check pré-merge de R-a3) como obrigatórios, e **recomendo também** "require branches to be up to date" — é o que garante que a árvore testada é a mesclada, ao custo de um merge de `develop` na feature antes de cada merge. É ato do proprietário, fora do repositório; sem ele nenhuma rota vence no merge (é o caso dos 65 s). | |
| 1 · P3 | **A válvula** `fecho_pendente {motivo, dono, prazo}`: entra? **Recomendo que sim.** Sem ela, a recusa correta da 013 (não mover a `done` sem artefatos) vira vermelho crônico que bloqueia PR alheio, e a alternativa seria mover a `done` para calar o gate — o carimbo que a 013 combate. Com prazo obrigatório e obsolescência reprovando, é o padrão já ratificado do IC-9. | |
| 1 · P4 | **`done` ⇒ artefatos em disco** (R-a4) nasce vermelho em 003 (sem os dois), 009 e 010 (sem `spec-validate.md`). Tratar por **exclusão nominal impressa** com fonte (R13, "anterior ao gate") ou por **escrita retroativa** dos artefatos? **Recomendo a exclusão nominal para as três**, sem prazo mas com fonte citada — e registrar a escrita retroativa de `spec-validate.md` de 009/010 como opcional do `qa-engineer`, fora desta demanda. A 003 foi fechada sob a Onda 2 e vale como foi fechada. | |
| 1 · P5 | **Uma demanda ou duas?** **Recomendo uma, condicionada a P1 = R-b1.** Se P1 = R-b2, recomendo **duas** (016 = `EA-33`; 017 = borda 8): o red do recibo só se prova no CI e seguraria a metade local. | |
| 1 · P6 | **Vocabulário**: os três termos de §Vocabulário entram no `CONTEXT.md` **agora**, no mesmo turno da aprovação (R12; `CONTEXT.md` é pinado → repin no PR)? E *promessa de execução* / *deferimento vencido* ficam **fora** sob R-b1? **Recomendo sim às duas.** | |
| 1 · P7 | **A frase da skill** ("done só com PR aberto e CI verde", `SKILL.md:66`) passa a "done com a Fase 6 completa e o PR aberto; CI verde é condição do merge", com uma linha em `sdd.md` (Fase 6: merge só depois de `done`)? **Recomendo que sim, nesta demanda** — sem isso R-a3 cria impasse e a âncora normativa de P16 fica em lugar nenhum. | |
| 1 · P8 | **Demanda abandonada** (nunca mesclada, fase parada) fica "em voo" no hook para sempre. Entra um estado terminal (`abandonada`, com motivo) nesta demanda? **Recomendo que não** — não é `EA-33` (não há merge), e é o tipo de acréscimo que faz a spec prometer duas coisas. Registro como candidata, com a cadeia (`state-eval.sh:58-67`), para o `doc-writer`. | |
| 1 · P9 | **Direção git→registro** (R-a2: merge de `feature/NNN-*` sem planning-state `NNN` em `done`) entra, com piso no SHA do merge desta própria demanda? **Recomendo que sim, com piso.** É a única cláusula que apanha demanda feita **fora** da máquina (R4 §Violação); sem piso nasce vermelha em qualquer `feature/00X` histórica sem planning-state — e quais existem é pendência de censo (1). | |

---

## O que ficou por medir

Declarado, não omitido (R2 §1). Cada item nomeia quem mede.

1. **Censo dos merges em `develop`** (`git log --merges --first-parent
   origin/develop`): quais branches `feature/NNN-*`, `chore/*`, `fix/*` e de
   Onda entraram; se existem `feature/001`, `002`, `004`–`006`; se todo merge de
   PR carrega a mensagem `Merge pull request #N from …` (oráculo 2 de §4). →
   `build-engineer`. Decide o piso de P9 e a robustez do oráculo de mensagem.
2. **Proteção de branch atual em `develop`** e se o `GITHUB_TOKEN` padrão tem
   permissão para lê-la (`GET /repos/…/branches/develop/protection`, exige
   `administration: read`); alternativa: auditoria só no rito local do
   proprietário com `gh auth`. → `build-engineer` / proprietário (P2).
3. **Duração isolada das campanhas Chromium** no job `visual` (logs dos runs
   33834890154 e 33389017967 têm os timestamps por passo). → `build-engineer`.
   É o número que P1 precisa.
4. **Árvore limpa após as campanhas no job `verify`** (E9 do
   `tests_p50_chromium.js` dentro da campanha `p50`; `receipts` do
   `mutation_map.json`): já provado no job `visual`, a confirmar no primeiro run
   do PR desta demanda. → `build-engineer` + `qa-engineer`.
5. **`git merge-base --is-ancestor` com os SHAs curtos** de 011/014/015
   (ambiguidade) e comportamento com `red.commit` ausente. → `qa-engineer`, nas
   fixtures do gate.
6. **Se `check_state.py` roda em contexto de PR com `origin/develop` presente**
   (o `verify.yml:29` faz `fetch-depth: 0`; `refs/remotes/origin/develop` existe
   no checkout do `pull_request`?). → `build-engineer`. Se não, R-a1 precisa de
   `git fetch origin develop` no passo.
7. **Execução.** Não rodei suíte, stage nem `git`. Todo número aqui é de
   registro citado.

---

## Fora de escopo (explícito)

- **`EA-30` / `ultima_prova` atrasada na matriz** e qualquer promessa cujo credor
  é o **rito humano do proprietário** (`D011-M9`): outra instância da família,
  outro mecanismo.
- **Gatilho cego pós-merge na `develop`** (dívida própria na matriz): a 016 fixa o
  vencimento no PR justamente porque essa dívida existe; não a paga.
- **Auditar ou configurar a proteção de branch a partir do repositório** além de
  uma checagem informativa, se o token permitir (P2 é do proprietário).
- **Estado terminal para demanda abandonada** (P8): candidata registrada, não
  entregue.
- **Reescrever `spec-validate.md` retroativos** de 003/009/010: opcional, fora
  (P4).
- **`EA-15`** (`run.sh` trunca a saída em 30 linhas) — relacionado ao diagnóstico
  da campanha, outro achado.
- **Qualquer byte de produto**, engine, Camada 1, módulos `ui_*`: nada aqui chega
  perto do rito D2.
- **Merge por squash/rebase**: R14 já proíbe; o gate só precisa dizer "não
  determinável" se ocorrer.
