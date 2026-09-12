# Refinamento — 018-cobertura-declarada-de-mutacao

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Demanda aberta em 2026-09-11 a pedido do proprietário no chat, como remédio do
> achado **`EA-3`** (`.claude/BACKLOG.md`). O `EA-3` **não fecha** com esta
> abertura — fecha quando o instrumento existir e o achado for reconferido.
>
> **Nota de condução**: os agentes de papel (`product-owner`, `tech-lead`, …)
> existem como definição em `.claude/agents/` mas **não estão disponíveis como
> subagentes nesta sessão**. Este artefato foi escrito pelo orquestrador no
> contrato do `product-owner`, e isso vai dito em vez de simulado.

## Necessidade

O stage `mutation` **não sabe dizer o que não está checando**. Ele percorre os
harnesses declarados e, para cada um cujos `targets` não mudaram, emite
`[OK] … campanha não exigida`. Um arquivo que mudou e **não figura nos `targets`
de harness nenhum** não produz linha alguma — nem `OK`, nem `WARN`, nem `FAIL`.

Para quem lê o pipeline, a ausência de campanha é **indistinguível** de "campanha
não exigida". A formulação que o `EA-3` registra, da sessão da 009, é exata:
*"um `[OK]` que mente por omissão é pior que um `[FAIL]`, porque ninguém investiga
um verde."*

**Por que agora.** Três medições desta semana convergiram e tornaram o desenho
possível — antes dela, o remédio seria palpite:

1. o censo de 2026-09-11 (`EA-3`) mediu **11 de 14** `check_*.py` e **17 de 36**
   `tests_*.js` fora de qualquer `targets`, e confirmou que **os seis órfãos
   nomeados continuam órfãos** desde 2026-09-05;
2. o `EA-42` provou que **ser `target` não é ser coberto** — dos 3 `check_*.py`
   que são `targets`, só `check_fecho.py` sempre teve mutante; `check_eol_text.py`
   ganhou um em 2026-09-11; e `check_branch_protection.py` **também é mutado**
   (`D016-M29`) — ver a *Correção de premissa* em [plan.md](plan.md): a frase
   herdada do `EA-42` que o dava como "gatilho sem mutante" é **falsa**, e foi
   repetida aqui antes de ser medida;
3. o `EA-3` registra, contra si mesmo, que **os números são teto e não defeito**:
   sem declaração de população, `11 de 14` mede candidatos, não arquivos que
   *deveriam* estar cobertos.

A demanda existe para transformar (3) em medida: **declarar a população** e, só
então, medir a diferença.

## Enquadramento de produto

### Invariantes tangenciadas (R1)

Nenhuma das dez invariantes de produto é tocada: esta demanda não altera engine,
score, narrativa, sessão nem superfície de relatório. O que ela toca é a
**estrutura de verificação** — o instrumento, não o produto.

A invariante de estrutura mais próxima é a disciplina da **R10 §2**, *"SKIP
silencioso é FAIL"*, hoje aplicada ao **ambiente** (harness com `requires` ausente
é reportado por nome) e **ausente para a cobertura**. Esta demanda estende a mesma
disciplina de um eixo ao outro. É extensão de princípio já ratificado, não
princípio novo.

### Conflito com decisão registrada

Conferido em `design-decisions.md` (R13): nenhuma decisão confirmada nem candidata
trata de cobertura de mutação. Conferido em `boundary.json` (R6): o `mutation_map`
não é classe protegida — é dado de verificação, editável.

**Não conflita, mas encosta** numa disposição registrada: *"cláusula defensiva
inalcançável por construção, declarada, sem mutante — não reportar como código
morto"*. A declaração de população precisa saber acomodar essa classe, ou passará
a acusar como lacuna o que o `product-owner` já decidiu que não é. Ver caso de
borda **B4**.

### Alternativa mais simples considerada, e por que não basta

**Alternativa A — só corrigir a mensagem.** Trocar `[OK] … campanha não exigida`
por algo que não afirme suficiência. *Não basta*: o defeito não é o texto da linha
que **existe**, é a ausência de linha para o arquivo que **não tem harness**.
Nenhuma reescrita de mensagem faz aparecer o que não é percorrido.

**Alternativa B — exigir que todo arquivo rastreado seja `target` de algum
harness.** *Não basta, e faz mal*: transformaria em dívida ~600 arquivos que
ninguém jamais decidiu que deveriam ter campanha, e a resposta racional do time
seria silenciar o gate — o enfraquecimento que a R10 §1 proíbe.

**Alternativa C — declarar a população e medir a diferença.** É a que sobra, e é a
que o próprio `EA-3` pede, *"no espírito do `boundary.json` da R6"*: a proteção
daquele arquivo funciona porque a população protegida é **declarada**, não
inferida. Mesma forma, outro eixo.

## Sistema real

Verificado por leitura e execução em 2026-09-11, na `develop` em `312a18c` — não
suposto.

- **`.claude/verify/check_mutation.py`** — a linha
  `[OK]   {name}: nenhum alvo mudou desde a base — campanha não exigida` vive
  **hoje** em `:1687`. **Citada por busca, não por número**: este sítio já
  derivou duas vezes em seis dias (`EA-3`, §"Segunda deriva"), e a âncora durável
  é o texto — `grep -n "campanha não exigida" .claude/verify/check_mutation.py`.
- **`.claude/verify/mutation_map.json → harnesses`** — **13** harnesses
  declarados. O laço percorre `MAP.items()`, isto é, **os harnesses**, nunca os
  arquivos que mudaram. Nenhum arquivo fora da união dos `targets` é alcançável
  por esse laço, por construção.
- **Censo de 2026-09-11** — `check_*.py`: 14 no disco, 3 `targets`, **11 órfãos**;
  `tests_*.js`: 36 no disco, 19 `targets`, **17 órfãos**.
- **Os seis órfãos nomeados**, reconferidos um a um:
  `check_evidence_bridge.py` · `gen_evidence_bridge.py` · `evidence_bridge.json` ·
  `tests_session_m48.js` · `compliance-audit.sh` · `.claude/BACKLOG.md`.
- **`target` × coberto** — `mutation_map.json` declara `targets` (o que
  **dispara** a campanha) e cada harness declara seus `MUTANTS` (o que é
  **mutado**). São conjuntos diferentes e o instrumento atual não compara os dois:
  os três `check_*.py` que são gatilho **são todos mutados** — medido em
  2026-09-11, corrigindo a afirmação herdada do `EA-42` (ver *Correção de
  premissa* em [plan.md](plan.md)). A distinção gatilho × conjunto mutado
  **continua real e necessária**: são campos diferentes, de arquivos diferentes,
  que nenhum oráculo compara hoje — o que caiu foi só o exemplo.
- **Precedente vivo do que se quer** — `.claude/verify/boundary.json` declara
  população e rito por classe, e o stage `boundary` mede a árvore contra ela. É a
  forma a copiar.

### Divergência doc × código encontrada

A cadeia do `EA-3` cita `check_mutation.py:58-59` e `:61`; a primeira correção
citou `:1332-1335`; ambas apodreceram. Emendado no registro em 2026-09-11 com a
regra de citar por busca. **Esta demanda herda a regra**: nenhum artefato dela
cita número de linha de `check_mutation.py` como endereço.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| **B1** | Arquivo na população declarada e fora de todo `targets` | **FAIL nomeado** — é o defeito que o `EA-3` descreve |
| **B2** | Arquivo fora da população declarada e fora de todo `targets` | **Silêncio legítimo** — não é lacuna; é o que a declaração existe para dizer |
| **B3** | Arquivo `target` de um harness, mas **não mutado** por mutante algum | **A decidir — é a pergunta P2.** Medido em 2026-09-11: **nenhum** arquivo está nesse estado hoje. O caso é real e o gate nasce verde — o exemplo que eu citava (`check_branch_protection.py`) era falso, ver [plan.md](plan.md) |
| **B4** | Arquivo cuja única mutação possível é **equivalente por construção** (cláusula defensiva inalcançável, R13) | **Dívida declarada**, nunca FAIL — a forma já existe em `mutation-matrix.json → dividas_declaradas` |
| **B5** | Arquivo entra na população e ainda não tem harness (janela de trabalho) | **A decidir — pergunta P3.** Sem válvula, a declaração nasce vermelha e o time a silencia |
| **B6** | Harness novo adota um órfão | A população não muda; a diferença diminui sozinha. **Sem ação** |
| **B7** | Arquivo sai do disco e continua na população declarada | **FAIL nomeado** — declaração que aponta para arquivo inexistente é registro podre (família `EA-31`) |
| **B8** | O próprio declarador (`mutation_map.json`, o novo arquivo de população) | **Auto-exclusão nominal** (R10 §10), senão o gate falha em si mesmo |

## Vocabulário

Termos novos, a registrar no `CONTEXT.md` na Fase 1 — hoje o repositório usa
`targets` para duas coisas diferentes, e é metade da confusão que o `EA-42`
expôs:

- **População de mutação** — o conjunto **declarado** de arquivos que devem estar
  sob campanha. Não é inferido do disco nem dos harnesses; é decisão registrada.
- **Gatilho** (`targets` no `mutation_map.json`) — o que faz uma campanha ser
  **exigida** quando muda. Não implica que o arquivo seja mutado.
- **Conjunto mutado** — o que os `MUTANTS` de um harness de fato alteram.
- **Órfão de cobertura** — arquivo na população e fora de todo gatilho.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1 | Abrir a demanda do `EA-3`? | **Sim** — 2026-09-11, no chat |
| 2 | `P1`…`P5` abaixo, com as recomendações do PO | **"segue com as recomendações"** — 2026-09-11, no chat. As cinco recomendações viram decisão e estão transcritas em [spec.md](spec.md) §"Decisões do portão da Fase 0" |

### Perguntas abertas — o portão desta fase depende delas

**P1 · Quem escreve a população inicial, e com que critério?** Duas rotas:
*(a)* **enumeração nominal** — como o `boundary.json`: lista explícita, cada
entrada uma decisão; *(b)* **regra + exceções** — ex.: "todo `check_*.py` do
stage é população, salvo o que a exceção nominar". *Recomendação: **(b)**.* A
enumeração de 50 arquivos apodrece na primeira demanda que criar o 51º, que é
exatamente a doença da família `EA-31`; a regra sobrevive e a exceção é onde a
decisão fica visível.

**P2 · `target` sem mutante é lacuna (caso B3)?** *Recomendação: **sim, mas em
severidade própria***. São dois defeitos de tamanhos diferentes — "ninguém olha"
(B1) e "olha e não mede" (B3) —, e colapsá-los num único FAIL faz o segundo
parecer o primeiro. **Emenda de 2026-09-11**: medido, **nenhum** arquivo está
nesse estado hoje — o gate nasce verde e seu poder vem do mutante, não do red.

**P3 · Qual a válvula para a janela de trabalho (caso B5)?** *Recomendação:
**dívida declarada com prazo**, na forma que `known_issues.json` já usa* — o
precedente existe e o `compliance-audit` já lista waivers a cada execução, o que
mantém a válvula visível em vez de silenciosa.

**P4 · A população nasce com o quê?** *Recomendação: **só os `check_*.py` do
`pipeline.yaml`***, isto é, os julgadores. São 14 arquivos, é onde os seis órfãos
nomeados vivem, e é o conjunto cuja cobertura o `EA-42` provou importar. Estender
a `tests_*.js` depois, com o instrumento já rodando, é barato; começar por 50
arquivos é o que faz a demanda não caber.

**P5 · O gate novo reprova o `develop` no dia 1?** Com a recomendação de P4, sim:
os seis órfãos viram FAIL imediato. *Recomendação: **nascer com os seis em dívida
declarada e prazo**, e o gate vermelho só para órfão NOVO.* Nascer vermelho
convida ao silenciamento; nascer com a dívida visível cobra sem paralisar.

## Fora de escopo (explícito)

- **Escrever campanha para os órfãos.** Esta demanda entrega o **instrumento que
  os nomeia**, não os mutantes. Cada órfão adotado é `fix-finding` próprio.
- **Estender a população a `tests_*.js`**, se P4 for aceita — fica para demanda
  posterior, com o instrumento já provado.
- **`EA-4` / âncora podre** — decaimento **dentro** de harness existente é outro
  achado, com outro remédio (o próprio `EA-3` faz a distinção).
- **Mudar o laço de trigger.** O laço percorre harnesses e continua percorrendo;
  o instrumento novo mede **ao lado** dele, não no lugar dele.
- **Fechar o `EA-3`.** Fecha quando o instrumento existir e o achado for
  reconferido por execução — não com a abertura desta demanda.
