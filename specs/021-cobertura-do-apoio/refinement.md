# Refinamento — 021-cobertura-do-apoio

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.
>
> **Quem escreveu**: o orquestrador, no contrato do `product-owner` — os agentes
> de papel existem em `.claude/agents/` mas não estão disponíveis como subagentes
> nesta sessão (precedente da 018, 019 e 020).
>
> **Estado: aguardando o portão da Fase 0.** Há **uma** decisão de desenho para o
> proprietário, no fim, e ela é barata porque a medição já eliminou as
> alternativas ruins.

## Necessidade

**11 dos 15 gaps chegam ao relatório do cliente sem nenhum caminho de apoio.**

Medido hoje, 2026-09-24, sonda sobre o HTML construído, sessão com nível 0 em
todas as quinze perguntas, nas **duas** configurações de contexto:

```
contexto NÃO informado   →  15 gaps · 4 com apoio · 11 SEM
contexto DECLARADO       →  15 gaps · 4 com apoio · 11 SEM
```

Os quatro atendidos são exatamente `detection-lifecycle`, `logs`, `automation` e
`vulnerability-management` — o conjunto que a §UAT-07 da Fase 5.1 autorizou.

Ficam sem nada, entre outros: **Capacidade do time**, **Capacitação**, **Resposta
a incidentes**, **Proteção de endpoint**, **Visibilidade de rede** e **Superfície
externa**. O cliente lê *"gap alto de maturidade"* e o documento não diz por onde
começar.

Este é o `EA-56` na forma que ele assumiu depois da emenda de 2026-09-15: deixou
de ser *"falta a trilha de capacitação"* e passou a ser **a cobertura da tabela
de apoio**.

## Enquadramento de produto

### Invariantes tangenciadas (R1)

- **INV-4** (tecnologia isolada nunca aumenta o score): **não tocada** — apoio é
  apresentação, não medição.
- **INV-7** (narrativa determinística derivada de evidência): **reforçada**. Hoje
  o produto observa um gap e cala sobre ele; passar a citar o que a própria
  Camada 1 já declara é mais derivação, não menos.
- **INV-1**: **não tocada**. O `MAP` é **lido**, nunca escrito — sem Porta B, sem
  repin da régua D2.

### Conflito com decisão registrada

Nenhum. O `EA-56` está **aberto** e o encaminhamento dele já apontava este
caminho: *"o caminho mais barato é o segundo, e ele depende de uma decisão que só
o proprietário toma: emendar a §UAT-07"*.

### A descoberta que muda o custo

O encaminhamento do `EA-56` supunha que o conteúdo teria de ser **escrito**. Não
tem. **A Camada 1 congelada já declara produto e justificativa para os quinze
qids**, em `MAP[qid].lv[nível].c`:

| qid sem apoio hoje | o que o `MAP` já diz |
|---|---|
| `team-capacity` | SOCaaS · *"amplia capacidade sem contratar um turno inteiro"* · FortiGuard-MDR |
| **`training`** | FortiGuard-Service-Bundle · *"treinamento e certificação (Cybersecurity Professional Education)"* |
| `incident-response` | FortiSOAR · *"processo como playbook auditável"* · Service-Bundle (IR readiness, TTX) |
| `endpoint` | FortiEndpoint · *"EPP + EDR em agente unificado"* |
| `network-visibility` | FortiNDR · *"visibilidade comportamental… inclusive onde agentes não chegam"* |
| `external-surface` | FortiRecon · *"superfície externa, credenciais vazadas e marca"* |
| `monitoring-coverage` | SOCaaS · FortiGuard-MDR |
| `mandate` · `governance` · `policies` | FortiGuard-Service-Bundle, com justificativa própria em cada |
| `knowledge` | FortiSOAR · *"playbooks como documentação executável"* |

**A trilha de capacitação que o `EA-56` dizia não ter onde morar já mora na
Camada 1.** O produto simplesmente não a lê.

**Consequência: nada precisa ser inventado, e nada precisa ser decidido sobre
catálogo.** Some o custo que parecia dominar este item.

## Sistema real

| fato | onde |
|---|---|
| a tabela escrita à mão cobre **4** qids | `ui_v32.js:1085` (`QS_GAP_SUPPORT`) |
| quem não está na tabela recebe `""` — silêncio, não recusa declarada | `ui_v32.js:1128` (`if (!m) return "";`) |
| a âncora normativa que autoriza os quatro | `tests_p50_core.js:3556` (`QIDS_AUTORIZADOS`, gate `P51-REC1`) |
| o gate mede **as duas direções**: nada fora da lista, e nada da lista sem apoio | `tests_p50_core.js:3560-3568` |
| o `MAP` declara candidatos por **nível respondido**, para os 15 | Camada 1, `frozen` |
| a tabela parte da **capability**; o `MAP`, do **nível** — divergência declarada no produto desde o `EA-48` | `ui_v32.js:1140` |

### As duas fontes não são iguais, e isso importa

Medido para os quatro já cobertos:

| qid | tabela escrita à mão | `MAP` no nível 0 |
|---|---|---|
| `detection-lifecycle` | FortiSIEM, FortiAnalyzer, FortiSOAR, FortiSOC | FortiSIEM |
| `logs` | FortiAnalyzer, FortiSIEM, FortiSOC | FortiAnalyzer, FortiSIEM |
| `automation` | FortiSOAR, Automação nativa | FortiSOAR |
| `vulnerability-management` | FortiClient por EMS, FortiRecon | FortiRecon, FortiEndpoint |

A tabela é **mais larga** (parte da capability); o `MAP` é **mais preciso** (parte
do que foi respondido). Trocar uma pela outra **estreitaria** os quatro que hoje
funcionam — regressão silenciosa disfarçada de melhoria.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | qid na tabela escrita à mão | mantém **exatamente** o de hoje — zero regressão |
| 2 | qid fora da tabela, com candidatos no `MAP` | recebe apoio derivado, com a justificativa que o `MAP` já traz |
| 3 | qid sem candidatos no `MAP` no nível respondido | **nenhum bloco**, como hoje — nunca bloco vazio |
| 4 | contexto tecnológico não declarado | mantém *"validar aderência"*; contexto ausente nunca vira recomendação |
| 5 | nível respondido ≠ 0 | usa o nível respondido, nunca o nível 0 fixo |
| 6 | papel (PDF) | o apoio chega às **duas** superfícies — o `EA-56` mediu que hoje o papel é pior |
| 7 | bloco derivado × bloco da tabela | a **ancoragem de cada bloco** precisa ser declarada nele, porque agora diferem (`EA-48`) |

## Vocabulário

Nenhum termo novo. *Ancoragem*, *capability* e *caminho de apoio* já estão no
`CONTEXT.md`.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do proprietário |
|---|---|---|
| 1 | (2026-09-24) fazer o lote do `EA-58`? | *"Vamos fazer o lote do EA-58"* |
| 2 | (2026-09-24) o lote não é homogêneo — partir em três e começar pela cobertura? | *"Sim, começa pelo 1"* |
| 3 | confirma o desenho **C** e a emenda da §UAT-07? | **SIM** — *"Confirmo o C, com a emenda da §UAT-07"* (2026-09-24). Portão **fechado**; Fase 1 aberta |

## A decisão do portão

Três desenhos possíveis. A medição já descartou dois.

**A · escrever 11 entradas novas à mão.** Mantém a ancoragem por capability.
**Descartada**: exige conteúdo editorial que eu teria de inventar ou você de
redigir, e tabela escrita à mão apodrece — é a doença que o `EA-68` já pagou.

**B · derivar tudo do `MAP` e aposentar a tabela.** Zero invenção.
**Descartada**: estreitaria os quatro qids que hoje funcionam (`detection-lifecycle`
cairia de quatro produtos para um). Regressão disfarçada de melhoria.

**C · a tabela vira exceção curada; o `MAP` é o padrão.** ← **recomendada**
Quem está na tabela mantém exatamente o de hoje; quem não está passa a receber o
que a Camada 1 já declara. Cobertura vai de **4 para 15**, com **zero regressão**
e **zero invenção**.

> **A pergunta é só esta: confirma o C?**
>
> E, junto com ele, a **emenda da §UAT-07** — hoje o `QIDS_AUTORIZADOS` do
> `P51-REC1` autoriza quatro qids e **reprova apoio anexado a qualquer outro**.
> Sem a emenda, o C é barrado pelo próprio portão, corretamente.

O que a emenda passa a dizer: *o mapeamento mínimo é o que a Camada 1 declara* —
a âncora deixa de ser uma lista de quatro nomes e passa a ser a fonte congelada,
que não apodrece porque ninguém a edita à mão.

## Fora de escopo (explícito)

- **Não** toca engine, Camada 1, `MAP`, score, estágio, suficiência nem
  prioridades. Nenhuma Porta B, nenhum repin da régua D2.
- **Não** acrescenta produto ao catálogo — `FortiNAC`, `FortiClient EMS`,
  `FortiSOC` e `FortiSOAR` são o **item 2** da partição do `EA-58`, com rito
  próprio.
- **Não** mexe em `SCORES`, que é o item 3 e ainda é *candidata* em
  `design-decisions.md`, não achado.
- **Não** remove a tabela escrita à mão: ela vira exceção curada, e as quatro
  entradas continuam valendo por decisão.
