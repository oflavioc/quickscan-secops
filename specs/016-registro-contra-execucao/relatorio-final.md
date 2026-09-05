# Relatório final — 016-registro-contra-execucao

> Fase 6 · T082 · dono: `doc-writer` · 2026-09-04.
> Branch `feature/016-registro-contra-execucao` · HEAD local `ed2f9d0` · PR
> [#40](https://github.com/oflavioc/quickscan-secops/pull/40) · worktree
> `phase5-014`. Demanda conduzida **sob a delegação do proprietário de
> 2026-08-29**, com três ratificações nominais próprias no chat: o portão da
> Fase 0 (rota da borda 8), o portão da Fase 1 (errata E1 — job `fecho`
> próprio, três checks obrigatórios) e o portão da Fase 2.
> **Aceite de intenção do `product-owner`: "não encontrei objeção"** (2026-09-04,
> registrado em `.claude/project-memory/planning-state/016-registro-contra-execucao.json
> → validate.aceite_po`), **condicionado** a cinco condições que só o CI e o
> ato do proprietário fecham (§Estado da Fase 6, abaixo) — agente reprova ou
> declara "não encontrei objeção"; quem escreve em registro de aceitação é o
> auditor humano (R4/D3).
> Este relatório **não emite veredito de PASS/FAIL**. Todo número vem de
> execução citável ou de registro canônico; o que depende do CI ou do ato do
> proprietário está declarado como tal, nunca antecipado.

## Objetivo cumprido

**P16 — o merge é o vencimento de toda promessa feita à verificação.** Nenhuma
promessa que um artefato de processo faz a um gate sobrevive ao merge em
`develop` sem ter sido cobrada por execução (`refinement.md` §Enquadramento).
Duas instâncias, dois achados de origem:

| | promessa | achado de origem | o que a 016 entregou |
|---|---|---|---|
| **P16.a** | `planning-state.phase` promete que a Fase 6 fecha antes do merge | `EA-33` | gates `D016-FEC1`…`FEC4` (direções registro↔git, com piso e válvula) + `D016-PR1` (check pré-merge, job `fecho`) |
| **P16.b** | `[DEFER]` do `check_mutation.py` promete que o job `visual` executa a campanha | `EA-14` / borda 8 | `D016-PROT1` — a proteção de branch de `develop` vira **dado auditável**, e o merge passa a esperar o job `visual` como check obrigatório |

**A rota escolhida para P16.b não foi nenhuma das duas recomendadas no
refinamento.** O refinamento recomendava **R-b1** (retirar o `[DEFER]`: levar
Chromium para o job `verify` e rodar a campanha ali) ou, em segundo plano,
**R-b2** (promessa + recibo + job `reconcile`). Nenhuma das duas foi construída.
No portão da Fase 0 (P1), o `build-engineer` mediu e a medição decidiu:

- **R-b1 caiu por custo, medido em duas ordens de grandeza**
  (`medicoes-fase0.md` §Medição 1): as campanhas com Chromium levam
  **42–55 minutos** por execução contra **28–35 segundos** de instalar o
  Chromium no job `verify` — levá-las para o `verify` inflaria o tempo do PR
  em dezenas de minutos, não segundos.
- **A mesma medição revelou o credor real** (§Medição 2): `develop` **não
  tinha nenhum check obrigatório** — só um ruleset com `deletion` +
  `non_fast_forward`. Isso explica, por dado e não por suposição, os "65
  segundos" entre o job `visual` fechar e o merge do PR #29 acontecer sem nada
  que obrigasse a esperar (o caso que abriu a borda 8 na demanda 013).

Com o credor identificado, a rota que sobrou — e que o usuário aprovou
literalmente no chat ("Tornar `verify` e `visual` obrigatórios") — foi **tornar
a proteção de branch, hoje um rito manual fora do repositório, um dado que o
próprio repositório audita**: `D016-PROT1` lê a API do GitHub a cada
`compliance-audit` e reprova se `develop` não exigir os três checks
(`verify`, `visual` e o novo `fecho` — errata **E1**, decidida só no portão da
Fase 1) com *up to date*. O `[DEFER]` **continua existindo** — `verify.yml:42`
e a semântica de `check_mutation.py` ficaram byte-intactas (decisão **T9**) —
porque a promessa em si não muda; o que muda é que agora **algo audita se o
credor dela continua de pé**. É a mesma resposta que a R6 já dá para boundary
("prosa não sustenta proteção") aplicada um nível acima, à própria
configuração do GitHub.

## Três defeitos que a demanda achou em si mesma

Uma demanda sobre "o registro não pode prometer o que a execução não cobre"
encontrou, ao se auto-aplicar, exatamente esse padrão três vezes.

### 1. A alínea `C4(e)` prometia reprovar e não podia — o `EA-20` dentro da demanda que o caça

Na 1ª iteração do `spec-validate` (`specs/016-registro-contra-execucao/spec-validate.md`,
item 21, classificado como **gap G3**), o `qa-engineer` mediu: o instrumento
**cumpre** a alínea C4(e) (`prazo` fora do formato ISO ⇒ FAIL, "não é data, não
é válvula" — confirmado num clone efêmero com `prazo: "04/09/2026"`), mas
**nenhum caso da sonda** usava prazo malformado e **nenhum mutante** atacava a
função que valida a data: removida a cláusula à mão, a sonda seguia
respondendo **33 · 0, exit 0** — uma alínea que parecia medida e não tinha
carrasco algum. A própria mensagem do commit de correção nomeia o precedente:
*"alínea que prometia medir e não podia reprovar (`EA-20`) dentro da demanda
que o caça"* (`9fe57f0`). Fechado no mesmo commit: caso **F24** (prazo
`30/09/2026`, formato dia/mês/ano) + mutante **D016-M31** (desliga a cláusula
de validação de data) — sonda de 33 para **35** casos, harness de 30 para
**33** mutantes.

### 2. O scanner sem auto-exclusão (R10 §10) — a forma alternativa foi medida e recusada por deixar cinco evasões vivas

A T032(v) original varria `check_fecho.py`/`fecho.py` com
`grep -nE "urllib\|http\.\|socket\|ssl"` para provar "zero rede nestes dois
arquivos" — e essa mesma varredura **acusava o próprio gate**, porque a lista
nominal das quatro bibliotecas proibidas vivia em prosa dentro do arquivo
varrido (`check_fecho.py:23`), a mesma classe de furo que a R10 §10 exige
fechar por auto-exclusão nominal. A errata **ET4** do `tasks.md` mediu **três**
formas antes de escolher (bateria adversarial de 16 arquivos sintéticos,
GNU grep 3.0):

| Forma | O que faz | Resultado medido |
|---|---|---|
| **P** — prescrita original (`urllib\|http\.\|socket\|ssl`) | biblioteca por substring | 2 cegos: `from http import client`, `import http` escapam de `http\.` |
| **B** — só linhas de import (`^\s*(import\|from)\s…`) | restringe a linhas de import | **afrouxamento** (R10 §1): deixa vivas **5 evasões** — `x = 1; import urllib`, `__import__("socket")`, `importlib.import_module("http.client")`, `exec("import ssl")`, `nome = "urllib"; __import__(nome)` |
| **W** — palavra inteira, arquivo inteiro (`-w`) | mata tudo que P mata **mais** os dois cegos de P | **escolhida** — sobre os dois arquivos-alvo, P e W davam 1 · 1 (ambos o próprio `check_fecho.py:23`) e passaram a **0 · 0** depois de reformular a lista para não se autonomear |

A forma **B** — que pareceria a mais "precisa" à primeira vista, por restringir
a busca a linhas de import — foi **medida e recusada** exatamente por
enfraquecer a garantia (R10 §1: nunca afrouxar para passar). O que nenhuma das
três formas pega, declarado sem disfarce: nome de biblioteca montado em tempo
de execução (`"ht"+"tp"`) — um scanner de padrão não é sandbox; a garantia
estrutural fica por conta do stage não ter rede nenhuma (`plan.md` §Camada), e
o scanner é a cobrança barata, não a única linha de defesa.

### 3. A seção de auditoria nasceu quebrada — heredoc e pipe disputando o mesmo stdin

Registrado em detalhe em
`specs/016-registro-contra-execucao/trilha-do-commit-541771a.md`: a primeira
versão da seção `branch-protection` do `compliance-audit.sh` passava o JSON
para o classificador Python assim —

```sh
printf '%s' "$JSON" | "$PYBIN" - <<'PY'   # ERRADO
```

— e o heredoc (o *programa* de `python -`) vence a disputa pelo mesmo
descritor de entrada contra o pipe (o *stdin* do processo): `sys.stdin.read()`
chegava sempre vazio, e a seção reportava `[FAIL] JSONDecodeError`
**incondicionalmente**, para qualquer resposta real da API. É o oposto exato
do propósito de `D016-PROT1`: a seção nunca chegaria a classificar proteção
nenhuma, e teria passado por **verde-por-vermelho** — ninguém desconfia de um
gate que reprova quando já se espera que reprove (a demanda estava, de fato,
sobre uma `develop` desprotegida). O defeito foi achado pelo `build-engineer`
**testando** a seção, não lendo-a — e a lição registrada na trilha é a mesma
que a demanda 014 já havia nomeado para mutantes: *"gate novo que nasce
vermelho tem de ser lido pela razão do vermelho, não pela cor."* Corrigido em
`d7dbe58`: JSON por variável de ambiente em vez de pipe, mais
`sys.stdout.reconfigure(encoding="utf-8")` (faltava, e corrompia acentos no
Windows).

## A recusa medida do `data-engineer` — recusa fundamentada é entrega

A tarefa T012 (schema do planning-state) previa três mudanças no mesmo commit:
(1) `branch` obrigatório, (2) a propriedade `fecho_pendente`, (3) proibir a
chave irmã `validacao`/`implementacao` que 010/011/015 usam em vez de
`validate`. O `data-engineer` entregou (1) e (2) e **recusou (3)** — e a recusa
foi ratificada pelo `product-owner` no aceite, com três razões e uma ressalva:

1. **A spec aprovada já excluía isso explicitamente** (`spec.md` §Fora de
   escopo: "não ganha gate aqui, para a spec não prometer duas coisas") —
   proibir a chave irmã seria ampliar escopo contra o portão da Fase 1.
2. **Proibir num schema que nenhum executável lê** (`check_state.py` não
   valida por biblioteca JSON Schema) criaria exatamente o defeito da família
   `EA-31` — um registro que promete e ninguém cobra — um nível acima:
   `additionalProperties: false`, além disso, reprovaria a própria
   `016-registro-contra-execucao.json` (que usa `portao_fase0`,
   `ideia_para_a_spec`, `achado_real`, chaves fora do schema atual).
3. **O caminho honesto já estava nomeado na spec**: um `chore` do
   `data-engineer` que normaliza os três planning-states (010/011/015) **e**
   fecha o schema no mesmo commit — com leitor, ou não se fecha.

**Ressalva registrada, para não ser remedida**: a medição que fundamenta a
recusa — **5 de 11** planning-states reprovariam sob
`additionalProperties: false`, **3 de 11** reprovariam mesmo na forma nominal
(proibir só a chave `validacao`/`implementacao`) — foi relatada pelo
`orquestrador` ao `product-owner`, e **não está gravada em arquivo nenhum** que
este relatório consiga citar como execução própria. Fica registrada aqui,
como o `product-owner` pediu, exatamente para não ser confundida com número
medido por este relatório.

## O erro do orquestrador, duas vezes — e a resposta foi mudar a regra, não a história

Dois commits desta demanda empacotam mais do que a mensagem descreve, ambos
pela mesma causa: `git add -A` rodado pelo orquestrador **enquanto** outro
agente ainda escrevia na mesma worktree.

| Commit | Mensagem | O que a mensagem descreve | O que o commit também contém |
|---|---|---|---|
| `541771a` | `chore(014): fecha a pendência do termo no planning-state` | 2 linhas do planning-state da 014 | `.claude/verify/compliance-audit.sh` (+159/−11) — a **T042** inteira: a seção `branch-protection` |
| `d130a04` | `doc(016): errata E4 — citação trocada entre E5 e EA-5 em sete pontos` | a errata E4 | o schema do planning-state (**G1**, `data-engineer`), `design-decisions.md` e o ADR 0001 (**G2**, `doc-writer`), e o `spec-validate.md` que estava não rastreado |

O histórico **não foi reescrito** nos dois casos, pela mesma razão registrada
já na 015 (o número 667/752): commit imutável continua dizendo o que dizia, a
correção vive ao lado — e aqui há uma razão a mais, específica desta demanda:
a branch carrega o commit de red (`d1ae3c7`) referenciado pelo planning-state,
cuja imutabilidade a R3 §4 exige. A segunda ocorrência, **quatro horas depois**
de a primeira já estar escrita e commitada em
`trilha-do-commit-541771a.md`, é a evidência de que **registrar sozinho não
bastou** — e é por isso que a resposta não foi só escrever mais um parágrafo:

- **A regra operacional mudou**: *"enquanto houver delegação ativa na
  worktree, o orquestrador commita por caminho nominal, nunca com `-A`"* —
  escrita na trilha e, nesta rodada de fechamento, promovida para
  `.claude/rules/orchestration.md` §Anti-patterns (a mesma seção citada aqui
  na Tarefa 2), para deixar de viver só em prosa de uma demanda específica.
- **Achado de backlog aberto** para a metade que a regra em prosa ainda não
  cobre — `EA-37`, `.claude/BACKLOG.md` — nomeando o candidato a hook
  `PreToolUse` que barraria `git add -A`/`git add .` com delegação em voo.
- **Terceiro item, pedido pelo `product-owner`**: mapear os dois commits que
  dizem menos do que contêm, artefato → commit — feito na tabela acima e, em
  particular, **o `spec-validate.md` (iteração 1) entrou em `d130a04`**, junto
  com G1/G2 e a errata E4.

## O aceite condicionado do `product-owner`, e as três observações dele

O aceite de intenção (`validate.aceite_po`) respondeu **seis perguntas** do
orquestrador — cumprimento de P16.a e P16.b, os "verdes por vácuo" de
FEC1/FEC2/FEC4, o leitor que perde merges posteriores ao piso, a recusa do
`data-engineer`, o vermelho ao vivo de `D016-PROT1`, e o próprio erro do
orquestrador — e concluiu **"NÃO ENCONTREI OBJEÇÃO"**, mas **condicionado a
cinco condições** (`validate.aceite_po.condicoes_do_aceite`) que só o CI e o
ato do proprietário produzem:

1. P2 executada pelo proprietário e `D016-PROT1` = `PROTEGIDA` num run do CI
   citado por número, **antes** do `done` e do merge.
2. O check `fecho` do PR #40 medido nos dois estados — vermelho
   (`FECHO PENDENTE`) e, depois do `done`, `LIBERADO` — como **flip medido**,
   não raciocinado.
3. `spec-validate.md` recebe a **iteração 2** antes do `done`, com G1/G2/G3
   reverificados pela execução que os fechou e o score recomputado.
4. Este relatório final registra os runs, a série de repins, a medição
   `5/11`–`3/11` do `data-engineer`, os dois commits mapeados e o desfecho de
   `EA-33`/`EA-14`.
5. A regra operacional da trilha entra em `orchestration.md` §Anti-patterns
   neste PR.

**As três observações do PO que o orquestrador tratou** (`validate.observacoes_do_po_a_tratar`):

1. **O vermelho de `D016-PROT1` vive dentro do job `verify`** (`verify.yml:43-44`),
   contrariando o espírito da errata E1 (que separou o check `fecho` para o
   `verify` não ensinar "vermelho é normal"). Decisão do orquestrador:
   **não ampliar escopo agora** — o vermelho é transiente (dono, evento único,
   some com P2), não é o mecanismo do `E5` — e registrar como achado próprio.
   Registrado como **`EA-36`**.
2. **A regra "commit por caminho nominal" vivia só na trilha da demanda** —
   nem `orchestration.md` nem a skill a carregavam. Corrigido nesta mesma
   rodada de fechamento (Tarefa 2 deste ciclo, `.claude/rules/orchestration.md`
   §Anti-patterns) e registrado como achado para a metade mecânica ainda
   ausente (**`EA-37`**).
3. **`spec-validate.md` datado**: o artefato ainda diz "iteração 1, 95 %"
   enquanto o estado do planning-state já diz "gaps fechados" — registro
   atrás da execução, a família que esta própria demanda combate. Iteração 2
   está encomendada e em curso pelo `qa-engineer` no momento desta escrita
   (não tocada por este relatório).

## Série de commits e repins — executada × prevista

O `tasks.md` (§Notas de execução) previu **14–15 repins** rotulados
`R0b, R1a, R1b, R2, R3a, R3b, R4a, R4b, R5a, R5b, R6a, R6b, R6c, (R6d), R7`,
além do `R0` já consumido antes de o `tasks.md` existir (portanto 15–16
execuções de `gen_pins.py` no total). **A execução real fechou em 9 commits
`chore(016): gen_pins`** — a numeração passou a nomear **wave**, não
**tarefa**, e vários rótulos previstos foram fundidos num único commit:

| Repin executado | Commit | Cobre | Rótulos previstos fundidos |
|---|---|---|---|
| — | `50f289d` | Fase 0 + spec | fora da série `R0…R7` (anterior à nomeação) |
| **R0** | `9e3fb0c` | errata da spec e do plano | = `R0` (consumido antes do `tasks.md` existir — daí `R0b` a seguir) |
| **R0b** | `24899ed` | `tasks.md` | = `R0b` previsto (T001) |
| **R1a+R2** | `41efba0` | registros/fixtures da sonda (T010+T011) **e** os dois gates do red (T023) | funde `R1a` + `R2` previstos |
| **R3** | `9a83ace` | os dois instrumentos (`fecho.py`, `branch_protection.py`) | funde `R3a` + `R3b` previstos |
| **R4** | `612002e` | stage/job `fecho`, scanner endurecido (ET4), erratas ET1–ET4 | funde `R4a` + `R4b` previstos |
| **R5** | `758b897` | errata E3, harness `d016`, matriz, prova de carga | funde `R5a` + `R5b` previstos — **desvio declarado no próprio commit**: "os três commits de conteúdo entraram em sequência, então o repin é um só; repin entre eles exigiria rebase interativo, que não se faz em branch com red commitado" |
| **R6** | `76fd9dc` | seção `branch-protection` do audit, C8, C9, a trilha do `541771a` | funde `R6a` + `R6b` + `R6c` previstos |
| **R7** | `581fe2c` | G1 (schema), G2 (design-decisions + ADR 0001), G3 (F24, P11, censo pinado, M31–M33), errata E4, as duas trilhas | cobre a **iteração de correção do `spec-validate`** — não corresponde ao `R7` de fechamento que o `tasks.md` (T083) reserva para depois deste relatório |

**Saldo**: 9 repins reais contra 15–16 rotulados previstos — cada consolidação
está declarada no próprio commit (ou, agora, aqui) e nenhum arquivo pinado
ficou sem repin no caminho (o gate `baseline` teria acusado). A colisão de
nome que fica registrada para quem ler depois: o `tasks.md` reserva **`R7`**
para o commit de fechamento (T083, depois de `spec-validate.md` +
`relatorio-final.md` + `BACKLOG.md` prontos); a execução real já usou o
rótulo **`R7`** para a iteração de correção do `spec-validate` (G1/G2/G3). O
repin que fecha **este** commit (as três tarefas do `doc-writer`) é do
`build-engineer`/orquestrador, e precisa de rótulo novo — não `R7` de novo. É
a mesma lição que a 015 já deixou registrada: **rótulo de repin é prosa sobre
um dado; o que é conferível é o par (commit, arquivos pinados)**.

## Runs de CI — o que já aconteceu, e o que ainda depende do proprietário

**Não executado por mim**: qualquer coisa que dependa do CI além de ler o
resultado publicado, e o ato P2 do proprietário. O que segue é leitura de
`gh run view`/`gh api` sobre o PR #40, nesta data.

O PR **#40** tem **um** run até esta escrita —
[`33927191969`](https://github.com/oflavioc/quickscan-secops/actions/runs/33927191969)
(evento `pull_request`, head `ebe0b22` — o commit imediatamente anterior ao de
fechamento deste relatório; `ed2f9d0` ainda não foi enviado ao remoto). Os três
jobs fecharam, e os três resultados batem com o que a spec previa como "red ao
vivo, por desenho" (`spec.md` §Nascimento sem vermelho crônico):

| Job | Conclusão | O que aconteceu, por dentro |
|---|---|---|
| `fecho` | **FAILURE** | `[SONDA] fecho: 35 caso(s) · 0 divergência(s)`; `[FAIL] FECHO PENDENTE da demanda 016-registro-contra-execucao (fase implement) — merge bloqueado até done`, exit 1 — o red **ao vivo** de `D016-PR1` (C5 b), esperado até o `done` |
| `verify` | **FAILURE** | `bash .claude/verify/run.sh` fechou **16 PASS · 0 FAIL** dentro do próprio job (o pipeline, isolado, é verde); quem reprovou foi só o passo seguinte, `compliance-audit.sh`, com `develop DESPROTEGIDA · faltam: fecho, up-to-date, verify, visual` — o red **ao vivo** de `D016-PROT1`, esperado até o ato P2 |
| `visual` | **FAILURE** | as suítes visuais (P50/P52/D011) **passaram** (etapa "Suítes visuais" com conclusão `success`); quem reprovou foi o passo seguinte e independente, "Campanhas de mutação com Chromium" (`verify.yml:80-81`, invocação direta e pré-existente de `check_mutation.py`, **fora** do `run.sh`): `mutation: 1 campanha(s) executada(s) · 1 problema(s)`, com **13 de 33** mutantes da campanha `d016` saindo `NÃO EXECUTADO · gate não pôde ser executado · baseline do gate nu VERMELHO` |

**A terceira linha não estava prevista na `tasks.md` (T063) e não foi
diagnosticada por mim.** Dentro do próprio job `verify`, a mesma campanha
`d016`, invocada pelo estágio `mutation` do `run.sh`, fechou `[PASS] mutation`
minutos antes (~~22:51:18Z~~ **[CORRIGIDO no adendo de 2026-09-04: hora de
flush do passo no log, não do evento]**) — no mesmo head SHA. A invocação
direta e separada de `check_mutation.py` no job `visual` (um passo
pré-existente, anterior à demanda 016, que roda **de novo** as campanhas sem
Chromium como efeito colateral de rodar as que precisam dele) encontrou, oito
minutos depois (~~22:59:21Z~~ **[idem: flush, não evento]**), o gate nu
(~~`check_fecho.py`, sem flags~~ **[CORRIGIDO: `check_fecho.py --json` — é o
controle `C0-fecho` do harness, que sempre chama com `--json`, nunca "sem
flags"]**) **vermelho** como baseline — impedindo o harness de atribuir
qualquer kill aos mutantes de árvore. Registrei o observado sem diagnosticar
a causa (R2 §3: causa antes de conclusão) — isolado depois, no run que fecha
esta pendência (§Adendo — 2026-09-04, abaixo).

**O que isso não muda**: nenhuma das três falhas é inesperada pelo desenho da
spec para o estado atual da demanda (`phase: implement`, P2 não executada); a
única que não estava nomeada de antemão é a divergência de veredito da
campanha `d016` entre as duas invocações no mesmo commit.

## Estado da Fase 6 — o que falta, e quem fecha

| Condição | Estado nesta data | Quem fecha |
|---|---|---|
| Pipeline completo local | **16 PASS · 0 FAIL** (`run.sh`, HEAD `ed2f9d0`) | — |
| `compliance-audit` local | **15 PASS · 1 FAIL · 0 WARN** — o FAIL é `branch-protection`, esperado | — |
| `spec-validate.md` | **iteração 1 de 2** (63/66, 95 %) — iteração 2 em curso, fora deste relatório | `qa-engineer` |
| `relatorio-final.md` + `BACKLOG.md` | este arquivo; `EA-33` → `resolvido`, `EA-14` com nota, `EA-36`/`EA-37` abertos | `doc-writer` (feito) |
| Regra da trilha em `orchestration.md` | feita, nesta mesma rodada (Tarefa 2) | `doc-writer` (feito) |
| PR aberto | **sim**, #40 | — |
| Check `fecho` do PR | vermelho (`FECHO PENDENTE`), run `33927191969` citado acima | flip para `LIBERADO` só depois do `done` |
| P2 (ruleset: `verify`, `visual`, `fecho` + up-to-date) | **não executada** — `DESPROTEGIDA` | usuário/proprietário |
| Medição do `GITHUB_TOKEN` em `/rules/branches` no CI | **não medida** — dependente de P2/novo run | primeiro run pós-P2 |
| Aceite de intenção | **condicionado**, "não encontrei objeção" | `product-owner` (feito, condicionado) |
| `done` | não — `phase` ainda `implement` no planning-state | orquestrador (T084, depois das 5 condições) |

## Candidatas sem gate — registradas, não decididas aqui

Herdadas do aceite do `product-owner` (`validate.aceite_po.candidatas_sem_gate`),
listadas para não se perderem:

- Segunda âncora imutável pós-merge da 016 (o leitor que perde merges
  *posteriores* ao piso — dívida aceitável, carrasco na campanha).
- `D016-PROT1` passar a julgar `pull_request.allowed_merge_methods == ["merge"]`
  (hoje só impresso, não julgado) — única defesa por máquina contra squash/rebase
  cegando os oráculos de T1.
- Visibilidade local do audit: `.last_green` é gravado sem a seção
  `branch-protection` (observação **J5** do `spec-validate`).
- `R-a6`: `state-eval.sh` distinguir "mesclada sem fecho" de "em voo" (T073 não
  coube na wave 6).
- Hook `PreToolUse` contra `git add -A`/`git add .` com delegação em voo —
  agora com id de backlog (`EA-37`).
- Estado terminal "abandonada" (P8) e a chave irmã `validacao`/`implementacao`
  do planning-state (`data-engineer`) — já nomeadas em `spec.md` §Fora de
  escopo.

## Dependências deixadas para outros

| Para | O quê |
|---|---|
| `qa-engineer` | Fechar a **iteração 2** do `spec-validate.md` antes do `done` (condição 3 do aceite); diagnosticar a divergência de veredito da campanha `d016` entre o estágio `mutation` do `run.sh` (job `verify`, `[PASS]`) e a invocação direta de `check_mutation.py` (job `visual`, `1 problema(s)`, baseline do gate nu vermelho) no mesmo head SHA — observado e não diagnosticado neste relatório (R2 §3) |
| `build-engineer` | Push do HEAD atual (`ed2f9d0`) para o PR #40; medir a permissão do `GITHUB_TOKEN` em `/rules/branches/develop` no primeiro run pós-push; repin do commit que fecha estas três tarefas do `doc-writer` — **rótulo novo**, não `R7` (colisão registrada em §Série de repins) |
| `product-owner` | Nada pendente do aceite em si (condicionado, com as cinco condições listadas); fica a redação de invariante/glossário se algum dos achados novos (`EA-36`, `EA-37`) subir a demanda própria |
| orquestrador | Decidir quando abrir demanda para `EA-36` (job dedicado para `branch-protection`, ou aceitar o custo transiente) e para o `fix-finding` do hook de `EA-37`; mover `phase` para `validate` no planning-state (a `validate` já está `in_progress`, mas `phase` ainda registra `implement` — observação do próprio aceite, `observacao_de_registro`) |
| usuário (proprietário) | **P2** — configurar `verify`, `visual` e `fecho` como checks obrigatórios em `develop` (ruleset, não proteção clássica — T7 e), mais *up to date*. Sem isso o PR #40 não deve ser mesclado (spec §Nascimento sem vermelho crônico) |

## Adendo — 2026-09-04: o run que fecha as pendências (R2 §5 — adendo, não reescrita)

Este adendo **não substitui** nada acima; as duas correções de fato que ele
motivou (o comando exato do controle de baseline e a natureza dos dois
horários citados) ficaram **riscadas com a razão, no próprio ponto** — seção
"Runs de CI — o que já aconteceu…", acima —, nunca reescritas por cima. O que
segue é leitura direta de
`gh run view`/`gh api` sobre o run
[`33933884597`](https://github.com/oflavioc/quickscan-secops/actions/runs/33933884597)
do PR #40, evento `workflow_dispatch`, head `5df74c2` — o commit
`chore(016): gen_pins — repin R9 (G6, eco do controle, erratas E016-5/6/7)`,
já no remoto e citado como `feito` no HEAD local desta escrita (o `ed2f9d0`
citado acima e em `.claude/BACKLOG.md → EA-33` é anterior ao push e ao repin;
não corrijo o BACKLOG aqui — fora do escopo deste adendo).

### Por job, cada um lido e não repassado

| Job | Conclusão | O que o log mostra, por dentro |
|---|---|---|
| `visual` | **success** | As 3 suítes visuais (P50/P52/D011) `success`; o passo "Campanhas de mutação com Chromium" fechou `D016 MUTATION [tests_016_mutants.js]: 33/33 mutantes detectados pelo gate e motivo esperados · controles: 3 ok · 0 falho(s)` e `não-KILL: nenhum — os 33 mutante(s) lidos estão DETECTADO`; `mutation: 1 campanha(s) executada(s) · 0 problema(s)` |
| `fecho` | **success** | `[SONDA] fecho: 35 caso(s) · 0 divergência(s) (total pinado: 35)`; `[OK] NÃO JULGADO (evento sem base (push, workflow_dispatch ou re-run fora de pull_request))`; `fecho --pr: NÃO JULGADO · evento-sem-base`, exit 0. Nomeado, não silencioso (R10 §2) — é `workflow_dispatch`, não `pull_request`; no próprio PR #40 o mesmo check volta a **reprovar** com `FECHO PENDENTE` até o `done`, por desenho |
| `verify` | **failure** | `bash .claude/verify/run.sh` fechou **16 PASS · 0 FAIL** dentro do job (todos os stages, inclusive `[PASS] mutation` e `[PASS] fecho`); o passo seguinte, `compliance-audit.sh`, fechou **15 PASS · 1 FAIL · 0 WARN** — o único FAIL é `branch-protection`: `develop DESPROTEGIDA · faltam: fecho, up-to-date, verify, visual · mecanismo lido: ruleset 21381133 (deletion, non_fast_forward) + classic enabled=false`. Esperado até o proprietário executar P2 |

O run inteiro fecha `failure` porque o job `verify` fecha `failure` — os
outros dois `success` não mudam o veredito agregado do run; é o mesmo desenho
que a spec já previa (`spec.md` §Nascimento sem vermelho crônico): o `fecho`
passa nomeando o "não julgado", o `verify` reprova pela metade que só o
proprietário fecha.

### ~~A campanha `d016` não reincidiu — a causa continua não atribuída, e é isso que muda~~

> **[REFUTADO em 2026-09-05 — R2 §5: riscado, não apagado; o refutado é o
> próprio autor deste adendo.]** A conclusão "não reincidiu, era transitória"
> comparou amostras **não comparáveis**: o run `33933884597`, usado como prova,
> é `workflow_dispatch` (checkout da ponta da branch, `event.json` sem
> `pull_request`); os runs vermelhos são `pull_request` (checkout de
> `refs/pull/40/merge`, `event.json` com `pull_request.base.sha`). O par
> comparável do mesmo head `5df74c2` — run `33933887655`, `pull_request`,
> 2026-09-05T00:43Z — fechou o `visual` **vermelho outra vez**, e o run
> `33935247512` (`pull_request`, head `0b774b3`) também: 4 de 4 runs
> `pull_request` vermelhos, 2 de 2 `workflow_dispatch` verdes. **Não era
> transitória: era determinística e específica do evento `pull_request`.** A
> causa foi isolada por execução em 2026-09-05 — o runner do
> `@playwright/test` (`node_modules/playwright/lib/runner/index.js:762`), sob
> `GITHUB_ACTIONS` com evento `pull_request`, executa `git fetch origin
> <pull_request.base.sha> --depth=1` para montar o diff do PR; `base.sha` do
> PR #40 é o piso `921977c`, e esse fetch grava `.git/shallow` com o piso:
> `origin/develop` passa a ter **um** commit sem pais, `ler_merges` devolve 0
> merges com `piso_na_cadeia: true`, e a guarda de censo (0 ≠ 39) reprova o
> baseline. O job `verify` do mesmo run (checkout idêntico, sem Playwright)
> fecha `[PASS] fecho`. Registro integral: `spec-validate.md` §Desfecho de A1,
> `prova-de-carga.md` §11, `BACKLOG.md` EA-38 (vetor e remédio) e EA-39 (o
> leitor não nomeia o histórico raso). O parágrafo abaixo fica como foi
> escrito, para que a leitura futura veja o erro e a razão.

O achado **A1** do `spec-validate.md` (run `33927191969`: 20/33, 13×
`NÃO EXECUTADO · baseline do gate nu VERMELHO`) **não se repetiu** neste run:
os 33 mutantes saíram `DETECTADO`, com os 3 controles (`C0-fecho`,
`C0-protecao`, `D016-M24/positivo`) todos `OK`. Confirmo o que o próprio
`prova-de-carga.md` §10.4 já registrava como pendência: **a causa do run
`33927191969` continua sem atribuição** (R2 §3 — não isolei condição alguma
que explique aquele vermelho pontual). O que mudou não foi a causa ficar
conhecida — foi o **instrumento** ganhar, no mesmo dia, o eco do controle
(errata **E016-7**, commit `6678d31` "fix(016): eco do controle — a razão do
baseline vermelho chega ao log"): se a divergência
`d016` voltar a acontecer num run futuro do job `visual`, a nota do
`NÃO EXECUTADO` passará a carregar `controle <id> · resultado: FALHOU ·
<exit/problemas/censo/erro_de_leitura>` em vez da string constante "baseline
do gate nu VERMELHO" sem motivo — provado em clone efêmero
(`prova-de-carga.md` §10.3, cenário do `check_fecho.py` quebrado por
`F99.json`: `13 de 33 mutante(s) lido(s)` com cada um carregando a nota do
controle que falhou). ~~Era transitória; segue não-nomeável a partir do registro
antigo; deixa de ser não-nomeável a partir do próximo registro, se recorrer.~~
**[Refutado — ver a nota no início desta seção: não era transitória; o
próximo registro (`33933887655`) disse a razão, e a razão levou à causa.]**

### G6 — a medição de §Não mensurável 1, com a precisão que faltava

Confirmo a mecânica, com uma correção de escopo em relação ao que me foi
passado: `GITHUB_TOKEN: ***` mascarado **no ambiente do passo "Auditoria de
conformidade da configuração agêntica"** aparece **só no job `verify`** —
porque é o **único** dos três jobs que roda `compliance-audit.sh` (T8 c:
`D016-PROT1` é seção do audit, não stage do `pipeline.yaml`; não roda em
`fecho` nem em `visual`, por desenho). O `token: ***` que aparece nos três
jobs, nos passos `actions/setup-python@v7`/`actions/setup-node@v7`, é a
máscara padrão do parâmetro `token:` dessas actions (usada para consultar o
índice de versões sem esbarrar em rate limit anônimo) — **não** é o mecanismo
do gap G6, e já existia antes desta demanda. O que fecha, de fato,
§Não mensurável 1 (`spec.md:524`, commit `9a460f5`) é só a linha do job
`verify`: `GITHUB_TOKEN: ***` no bloco `env:` do passo do audit, seguida de
`[FAIL] branch-protection: … mecanismo lido: ruleset 21381133 (…) + classic
enabled=false` — uma leitura da API que **classifica o mecanismo**, o que uma
leitura anônima (sujeita a limite e a `403` silenciosos) não garantia antes de
`9a460f5`. Uma incógnita declarada desde a Fase 1 fechada por medição, não por
argumento — mas fechada num job, não em três.

### A correção que eu mesmo devia — o A1 deixou de estar "sem diagnóstico"

Em `DEPENDÊNCIAS` eu havia deixado registrado que o relatório "ainda diz A1
registrado sem diagnóstico". Está corrigido: o `spec-validate.md` (§Achado A1)
recebeu diagnóstico que **refutou quatro hipóteses por medição** — (a) o
código em HEAD (33/33 no stage isolado e no clone efêmero, ambos lidos na
saída; e 33/33 no job `verify` por **dedução** válida e citada como tal, não
por leitura de log — a segunda das duas correções que o `spec-validate.md`
registrou riscadas em 2026-09-04); (b) escrita das suítes no gate; (c)
`999-sintetica-d016.json` pré-existente; (d) árvore suja — e concluiu que a
razão exata **não era nomeável a partir do registro daquele run** (o
`check_mutation.py` truncava a saída em duas linhas + o bloco de não-KILL com
nota constante). A refutação da inferência "a sonda estava sã" (`julgaSonda`
não pina isolamento; `D016-M1` sai `DETECTADO` mesmo com `C0-fecho` vermelho,
medido em clone efêmero com `F99.json`) também fica registrada, riscada, no
`spec-validate.md` — não apagada. O que o eco corrigiu não foi a causa do run
antigo: foi a capacidade do instrumento de nomear a causa, **daqui para
frente**.

### O que este adendo não decide

`spec-validate.md` segue em **iteração 1 de 2** — a iteração 2 (condição 3 do
aceite do `product-owner`) não foi tocada por mim; é o `qa-engineer` quem a
fecha, com G1/G2/G3 reverificados e o score recomputado. P2 (ruleset com os
três checks obrigatórios) segue **não executada** — é o único item, das cinco
condições do aceite, que este run não pôde medir por não depender de
execução alguma minha ou do CI: depende do proprietário, fora do repositório.
`phase` no planning-state segue `validate` — não movo esse campo (é do
orquestrador, T084).

## Fontes citadas

- `specs/016-registro-contra-execucao/refinement.md` — §Enquadramento (P16),
  §Rotas (R-b1/R-b2/R-b3), §Rodadas de entrevista
- `specs/016-registro-contra-execucao/medicoes-fase0.md` — §Medição 1 (custo
  de Chromium no `verify`), §Medição 2 (proteção de branch hoje), §Medição 3
  (censo de merges)
- `specs/016-registro-contra-execucao/spec.md` — T1–T10, C1–C10, erratas E1/E2,
  §Nascimento sem vermelho crônico, §NÃO mede
- `specs/016-registro-contra-execucao/tasks.md` — 8 waves, série de repins
  prevista, errata ET1–ET4
- `specs/016-registro-contra-execucao/spec-validate.md` — iteração 1 (63/66,
  95 %), gaps G1/G2/G3, julgamentos J1–J5
- `specs/016-registro-contra-execucao/trilha-do-commit-541771a.md` — os dois
  commits empacotados, a regra operacional
- `.claude/project-memory/planning-state/016-registro-contra-execucao.json` —
  `portao_fase0`, `red`, `validate.aceite_po`,
  `validate.observacoes_do_po_a_tratar`
- `.claude/rules/orchestration.md` §Anti-patterns — regra nova (Tarefa 2 deste
  ciclo)
- `.claude/BACKLOG.md` — `EA-33` (`resolvido`), `EA-14` (nota do desfecho,
  `aberto`), `EA-36`, `EA-37` (novos, `aberto`)
- `docs/adr/0001-cobranca-no-merge-fora-do-repositorio.md`
- `.claude/verify/mutation-matrix.json → dividas_declaradas` ("Borda 8", com
  desfecho anexado)
- Commits: `263a0d2` `9b19fc4` `058c368` `50f289d` `9b8d2ae` `cf0248f`
  `bf1c700` `26235d4` `9e3fb0c` `854084b` `9d2a470` `24899ed` `b94b8fc`
  `d1ae3c7` `3e20057` `41efba0` `cf52a61` `d80c7ed` `9a83ace` `83a88e2`
  `06b3056` `612002e` `50b97cd` `e52e573` `55f59d6` `758b897` `146f2b4`
  `f9b79fc` `541771a` `d7dbe58` `9abffc1` `76fd9dc` `d130a04` `9fe57f0`
  `e8c2d67` `be2b9a0` `581fe2c` `ebe0b22`
- PR [#40](https://github.com/oflavioc/quickscan-secops/pull/40) · run
  [`33927191969`](https://github.com/oflavioc/quickscan-secops/actions/runs/33927191969)
  (head `ebe0b22`; `fecho`, `verify` e `visual` **failure**, cada um pela razão
  citada acima)

### Fontes do adendo — 2026-09-04

- PR [#40](https://github.com/oflavioc/quickscan-secops/pull/40) · run
  [`33933884597`](https://github.com/oflavioc/quickscan-secops/actions/runs/33933884597)
  (head `5df74c2`, evento `workflow_dispatch`; `visual` **success**, `fecho`
  **success**, `verify` **failure** — por job, lido acima)
- `specs/016-registro-contra-execucao/spec-validate.md` §Achado A1 — as duas
  correções riscadas ("a sonda estava sã"; "33/33 no `verify`" como leitura)
- `specs/016-registro-contra-execucao/prova-de-carga.md` §10 (E016-7 · o eco
  do controle) — RED/GREEN do cenário `F99.json`, bateria do leitor (29
  verificações · 0 falhas)
- `specs/016-registro-contra-execucao/spec.md:524` — gap G6, commit `9a460f5`
- Commits desta rodada de fechamento: `9a460f5` (G6), `6678d31` (eco do
  controle), `f0fe1e2` (erratas E016-5/E016-6), `7cec314` (correções do
  `spec-validate` §A1), `5df74c2` (`chore(016): gen_pins` — repin R9, feito
  pelo `build-engineer`/orquestrador, não por mim)

### Fontes da correção do adendo — 2026-09-05 (`qa-engineer`)

- Runs do PR #40, job `visual`, lidos pela linha do controle:
  [`33933887655`](https://github.com/oflavioc/quickscan-secops/actions/runs/33933887655)
  (`pull_request`, head `5df74c2`, `C0-fecho · FALHOU · … censo da leitura
  0/39 (divergente)`) e
  [`33935247512`](https://github.com/oflavioc/quickscan-secops/actions/runs/33935247512)
  (`pull_request`, head `0b774b3`, mesma nota); o job `verify` dos dois:
  `[PASS] fecho` · `[PASS] mutation`. Dispatches verdes no mesmo head:
  `33933884597` (`C0-fecho · OK · 39/39`, lido) e
  [`33937833002`](https://github.com/oflavioc/quickscan-secops/actions/runs/33937833002)
  (`visual` `success`; a nota não foi lida — `run.sh` não ecoa PASS).
- `node_modules/playwright/lib/runner/index.js` (`playwright` 1.62.1):
  `:641-642`, `:652-676` (condição `:669`), `:679-693` (`ciInfo`), `:759-763`
  (`gitDiff`: o `fetch --depth=1`).
- `specs/016-registro-contra-execucao/spec-validate.md` §Desfecho de A1;
  `specs/016-registro-contra-execucao/prova-de-carga.md` §11 (réplicas Linux e
  Windows do checkout do CI, forense, reparos, direção do remédio);
  `.claude/BACKLOG.md` EA-38, EA-39.
