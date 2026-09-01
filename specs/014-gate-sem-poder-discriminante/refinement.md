# Refinamento — 014-gate-sem-poder-discriminante

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.

Achado de origem: **`EA-7`** (`.claude/BACKLOG.md:707`). Decisão do proprietário
em 2026-08-30, no chat: vira **demanda própria**, não `fix-finding`, não absorvida
por outra.

---

## Necessidade

Quem usa isto não é o facilitador: é **quem confia no verde**. Hoje `P51-VIS1`
está verde no baseline e continua verde **com** a mutação `M51-01` aplicada — o
instrumento inteiro está saudável (âncora única, `reason` vivo, gate executado) e
mesmo assim nada pode reprovar. Enquanto isso durar, a composição de duas colunas
da tela de pergunta tem um guarda que não guarda, e ninguém sabe disso lendo o
relatório da campanha.

Por que agora: a **013** entregou o instrumento que separa esta doença das outras
(`--preflight` com contrato C1, os três estados com causa, o relato que nomeia os
não-KILL). Sem ele, "regra morta" é indistinguível de "âncora podre" e de
"ambiente ausente" — que foi como o problema ficou escondido por meses. E há
prazo: a exceção nominal **`KI-4`** declara `remocao_prevista: "Merge da demanda
014 na develop"` (`.claude/verify/known_issues.json:16`). A 014 é o prazo.

---

## Enquadramento de produto

### Invariantes tangenciadas (R1)

**Nenhuma das dez muda, e nenhuma está diretamente em risco.** Medido:
`P51-VIS1` **não aparece** em `.claude/verify/invariants.json` — ele guarda uma
propriedade de superfície da Fase 5.1 (UAT-01, composição responsiva da tela de
pergunta), não uma invariante de R1. Afirmar "INV-x está desprotegida" aqui seria
inflar o achado.

O que a demanda tangencia é a **frase que sustenta a R1**: *"invariante sem gate é
prosa"*. Um gate sem poder discriminante é, operacionalmente, um gate ausente com
aparência de presente — a mesma classe de mentira, um nível abaixo. E é o
aparelho de prova da R3 §5 ("gate novo só é aceito matando um mutante") e da R10
(§"Nascimento de um gate") que fica em questão, não o produto.

**INV-9** é tangenciada por reflexo e vale registrar: `ui_p50_v32.css`,
`tests_p50_chromium.js` e `tests_p51_mutants.js` **não estão** em
`.claude/verify/boundary.json → frozen` (que lista só `engine_v32.js`, a Camada 1,
o harness M41 e o snapshot), embora `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`
os liste como tocados pelas fases 5.1/5.2 seladas. A proteção deles é de
**identidade** (pins, R8), não de **proibição** (D2). Isso decide o rito das rotas
— ver §Rotas.

### Conflito com decisão registrada

- **KI-3** (`design-decisions.md`): suítes visuais fora do agregado local, execução
  canônica no job `visual` do CI. As três campanhas em questão declaram
  `requires: [node, python, chromium]` (`.claude/verify/mutation_map.json`), e o
  planning-state da 013 registra que o único FAIL do pipeline local é exatamente
  o stage `mutation` por Chromium ausente. **Não é conflito: é restrição de
  desenho** — e ela empurra a solução para o lado estático (§Rotas).
- **R13 · fases 5.0–5.2 seladas sob o processo antigo**: nada em `docs_phase5/`
  é retro-ajustado por esta demanda. Ela age sobre o par vivo e sobre o registro
  corrente, nunca sobre a selagem.
- **Decisão registrada de NÃO expandir a matriz** (`mutation-matrix.json →
  _meta.expansao_p51`: expandir `p50`/`p52` por par é a T13 da 013). Qualquer
  varredura desta demanda tem de enumerar mutantes **pelo preflight do harness**,
  nunca pelos pares da matriz — senão colide com a decisão. Ver §Casos de borda 3.

### Alternativa mais simples considerada

**`fix-finding` do par**: reancorar `M51-01` no sítio da 5.2 e fechar. É de fato o
caminho mais curto, e a medição abaixo mostra que hoje ele bastaria para o
*número* (é 1 caso, não N). Foi recusado pelo proprietário — e a medição sustenta
a recusa por uma razão que não era óbvia antes dela: **a causa não é a âncora, é
o gatilho** (§Sistema real, item 5). Reancorar deixa o mecanismo intacto e o
próximo caso nasce igual, sem sinal.

---

## Sistema real

Tudo abaixo foi lido na árvore desta worktree. O que é **execução** vem relatado
de registro citado — não medi campanha (não é meu papel e esta máquina não tem
Chromium).

### 1. A ordem de inlining, medida — e uma divergência doc × código

`build_v32_html.py:80` concatena, dentro do `<style>` único:

```
Camada 1 (inline) → ui_v32.css → ui_ux_v32.css → ui_p50_v32.css
                  → ui_p52_workspace_v32.css → ui_d011_prioridade_v32.css
```

**Divergência**: o `EA-7` e a memória do `qa-engineer` citam
`build_v32_html.py:76`. A linha era 76 quando a 013 mediu; **é 80 hoje** — a
folha da demanda 011 entrou no meio. O fato não muda (a 5.2 continua depois da
5.1); a citação, sim. Registrar a correção é barato agora e caro depois.

### 2. A população, contada — 42 mutantes de CSS

Enumerados por `file:` no array `MUTANTS` de cada harness:

| campanha | total de mutantes | mutantes de CSS | arquivo mutado |
|---|---|---|---|
| `p50` (`tests_p50_mutants.js`) | 53 | **4** — `M8` (:293), `M51` (:747), `M52` (:807), `M53` (:817) | `ui_p50_v32.css` |
| `p51` (`tests_p51_mutants.js`) | 20 | **2** — `M51-01` (:126), `M51-08` (:174) | `ui_p50_v32.css` |
| `p52` (`tests_p52_mutants.js`) | 107 | **36** | `ui_p52_workspace_v32.css` |
| | 180 | **42** | |

(53 + 20 + 107 = 180 casa com as `180/180 âncoras` do preflight registrado em
`specs/013-integridade-da-campanha/matriz-gate-mutante.md` §14.)

### 3. Filtro estrutural — 36 dos 42 são imunes, e isso é medido, não presumido

Os 36 da `p52` mutam a **penúltima** folha. A única posterior é
`ui_d011_prioridade_v32.css` — **li o arquivo inteiro (91 linhas)**: declara
exclusivamente `.d011-legenda` e `.d011-key[data-d011=…]`, zero seletor alheio
por desenho declarado (`:4-8`), zero `!important` em regra, e o único bloco
condicional é um `@media print` sobre os mesmos `.d011-*` (`:87-91`).

**Nenhum dos 36 pode ser sobreposto por camada posterior.** Não é amostra: é o
universo do que vem depois. Corroborado por execução: `p52` fechou **107/107
KILL** no run 33389017967 do job `visual`, 2026-08-31
(`mutation-matrix.json → _meta.execucao_ci_demanda_010`).

Restam **6**, todos em `ui_p50_v32.css`, com duas camadas posteriores.

### 4. Filtro de oráculo e cascata — os 6, um a um

**`M8` sai por oráculo, não por cascata.** `P50-COR1` (`tests_p50_core.js:2500`)
é *"lint de fonte única: zero hex de cor de domínio nos módulos novos"* — lê o
**texto** do `.css`. A mutação insere `#307FE2` no arquivo e o lint o encontra
haja o que houver na cascata. **Imune por construção.** Este é o caso que a
leitura por nome erraria: "muta CSS de fase anterior" não implica risco.

Os cinco restantes têm oráculo em `tests_p50_chromium.js` (caixas reais /
computed style). Cascata medida sítio a sítio:

| mutante | o que a mutação toca | concorrente em camada posterior | veredito |
|---|---|---|---|
| **`M51-01`** | `grid-template-columns` / `grid-template-areas` em `body[data-uxscreen="question"] .wrap` **(0,2,1)**; `grid-area` nos filhos **(1,2,1)** — `ui_p50_v32.css:693-702` | `ui_p52_workspace_v32.css:70-83` — `html body[data-uxscreen="question"] .wrap` **(0,2,2)** vence por especificidade; colocações dos filhos empatam em **(1,2,1)** e a 5.2 vence por ordem de inlining | **REGRA MORTA** |
| **`M51-08`** | `color` / `background-color` em `#ux-target .ux-tgt-row select option` e `#ux-target select[data-qid] option` — **(1,1,2)** | `ui_p52_workspace_v32.css:578-580` declara **as mesmas duas propriedades no mesmo elemento**, mas com `.ux-tgt-row select option` / `.ux-tgt-table select option` **(0,1,2)** e `#v32editor select option` (1,0,2) | **VIVA** — a regra da 5.1 vence por especificidade; o `#ux-target` é o id que decide |
| **`M51`** (p50) | desconfina o bloco `@media screen` inteiro (`ui_p50_v32.css:637-656`): `display`/`visibility`/`position`/`opacity` sobre `#app .p50-legacy-*`, `.ruler`, `.radar-box` | em `ui_p52_workspace_v32.css`: **zero** ocorrência de `p50-legacy`; `.ruler` só como `.pr-ruler` (:1384, :1414 — outra classe); `.radar-box` só com `margin-inline` (:749) e `width` (:933) | **VIVA quanto à cascata** (mas ver item 6) |
| **`M52`** (p50) | acrescenta `opacity:.45` a `#app .dom[data-p50-legacy="neutralized"] .ruler` fora de `@media screen` | nada declara `opacity` em `.ruler` depois | **VIVA** |
| **`M53`** (p50) | acrescenta `position:relative` a `#app .radar-box.p50-legacy-off` | `.radar-box` posterior só declara `margin-inline` e `width` | **VIVA** |

**O `M51-08` é o resultado que muda a demanda.** A memória do `qa-engineer`
(`ancora-viva-em-regra-morta.md`) recomenda *"suspeite sempre que o alvo do
mutante for `ui_p50_v32.css`"*, e nomeia `M51-08` como suspeito. Medido, ele é
**o contraexemplo perfeito**: a 5.2 declara exatamente as mesmas duas
propriedades, no mesmo elemento, numa camada posterior — e **perde**, porque a
regra da 5.1 tem um id e a da 5.2 não. Corroborado por execução: `p51` fechou
**19/20** em 2026-08-31 e o único não-KILL foi `M51-01`.

Isto é o pedido do enunciado literalmente cumprido: **medir, não deduzir pelo
nome.** A suspeita estava certa sobre o mecanismo e errada sobre a instância.

### 5. A causa está um nível abaixo da cascata — e é o achado desta varredura

`.claude/verify/mutation_map.json → harnesses.p51.targets` lista sete caminhos:
`USER_GUIDE.md`, `ui_journey_v32.js`, `ui_p50_results_v32.js`,
`ui_p50_shell_v32.js`, `ui_p50_v32.css`, `ui_v32.js`, `tests_p51_mutants.js`.
**`ui_p52_workspace_v32.css` não está lá** — nem em `p50.targets`.

Consequência medida: quando `c1e3649` (Fase 5.2) escreveu a regra que mata a
regra do `M51-01`, **o gatilho por path não re-executou a `p51`**. O alvo
declarado não mudou. O mutante perdeu os dentes num commit que a campanha dele
não tinha razão nenhuma para olhar.

Enunciado em uma frase, que é o que a demanda deveria carregar para a Fase 1:

> **O gatilho por path vigia o que a campanha MUTA, nunca o que decide o
> resultado.**

É a mesma lição de `cobertura é escopo ∩ estado`, aplicada ao gatilho: o *escopo*
está certo (a campanha muta o arquivo certo) e o *estado* mudou fora dele. E é
uma exposição **viva e permanente**: toda folha CSS futura entra depois de
`ui_p50_v32.css` e nasce fora dos `targets` de `p50`/`p51`.

### 6. A prova de discriminância tem data — e três registros estão vencidos

Este eixo não estava no `EA-7` e apareceu na varredura. Um `KILL` prova que o
gate discriminava **na árvore em que foi medido**. Medido no registro:

- **`mutation-matrix.json:55-63`** — a `p50` inteira é **uma linha agregada** com
  `ultima_prova.data: "histórica (fases 5.0.x)"`. A execução real de 2026-08-29
  (`52/53`, em `matriz-gate-mutante.md:1073`) **não está no registro**.
- **`P50::M51` não tem prova de KILL pós-correção.** A 013 corrigiu o `reason`
  (rot semântica, §16) e registrou que a prova (b) ficou **PARCIAL** e a prova (c)
  foi **por enumeração estática, não por execução** — *"fecha no job visual"*. E o
  run de 2026-08-31 **não exigiu a `p50`**: *"nenhum alvo mudou desde a base —
  campanha não exigida"*.
- **`mutation-matrix.json:209-225`** — `M51-08` registra
  `ultima_prova.data: "2026-08-22"`, apesar da execução de 2026-08-31 que o matou.
  O registro nominal **atrasa** a execução.
- **`mutation-matrix.json:464-470`** — os 107 da `p52` não têm par nominal (linha
  agregada, por decisão registrada).

### 7. O mecanismo da KI-4 é de mão dupla, e amarra o fim desta demanda

`check_mutation.py:557-585` (IC-9), com as quatro cláusulas fixadas nominalmente
pelo proprietário em 2026-08-30: exceção **nominal** (harness + mutante + gate),
com **prazo**, **impressa** no veredito, e **obsoleta reprova** em duas direções —
`IC-9.3` pelo registro (a matriz volta a dizer `KILL`) e `IC-9.4` cenário ii pela
execução (o bloco volta a `DETECTADO`).

Ou seja: **a 014 não pode terminar sem mexer na `KI-4`.** Devolver poder
discriminante ao par sem remover a entrada faz o stage reprovar; remover a entrada
sem devolver o poder também. As duas pontas se fecham no mesmo PR.

---

## O tamanho real, respondido

**1 caso em 42, não uma família.**

| classe | quantos | quem |
|---|---|---|
| regra morta confirmada | **1** | `M51-01` |
| viva por especificidade, apesar de a camada posterior declarar a mesma propriedade | 1 | `M51-08` |
| viva — nenhuma camada posterior declara a propriedade | 3 | `M51`, `M52`, `M53` (p50) |
| imune por oráculo (lint de fonte, cascata irrelevante) | 1 | `M8` |
| imune por estrutura (nenhuma camada posterior possível) | 36 | os de `ui_p52_workspace_v32.css` |

E o enunciado do `EA-7` — *"os outros pares da `p51` que mutam `ui_p50_v32.css`
(`M51-08`) e todos os da `p50` que mutam o mesmo arquivo estão sujeitos ao mesmo
mecanismo"* — está **correto como hipótese e refutado como diagnóstico**: estão
sujeitos ao mecanismo, e nenhum deles é vítima dele hoje. A frase permanece no
backlog; esta medição é a resposta a ela, não uma correção dela.

**Isto muda a demanda.** Uma varredura justificada por "há N casos escondidos" não
se sustenta: não há. O que se sustenta é o item 5 — **a exposição é estrutural e
permanente, e o valor da varredura é prospectivo**. A Fase 1 tem de escrever a
justificativa nesses termos, sob pena de a spec prometer um saneamento que a
medição já fez.

---

## As quatro distinções, e como se separa cada uma

O coração da demanda. Um par não-KILL pode parecer os quatro; o que segue é o
instrumento que decide, na ordem em que é barato aplicá-lo.

| # | classe | sinal | instrumento que decide | custo |
|---|---|---|---|---|
| 1 | **ambiente ausente** | a campanha não chega ao laço | `requires` do `mutation_map.json` + `have()` com dentes (`shutil.which`, 013 T004); o stage **nomeia** o ausente antes de qualquer mutação | zero |
| 2 | **âncora podre** | `ocorrencias == 0` (ausente) ou `> 1` (ambígua) | `<harness> --preflight` (contrato C1): sai `exit 1` **sem mutar, sem reconstruir, sem escrever** | segundos |
| 3 | **equivalente por construção** | SOBREVIVENTE, preflight verde, e **nenhum estado alcançável do produto** distingue mutante de original | leitura da alcançabilidade + registro em `dividas_declaradas` — **não há automação hoje** (precedente: `D010-M11`, cláusula de precedência inalcançável) | análise |
| 4 | **regra morta** | SOBREVIVENTE, preflight verde, `reason` vivo e emissível, gate executado e **passando** | **cascata**: importância (`!important`) → especificidade (`@bramus/specificity`, já em `node_modules`) → ordem de inlining (`build_v32_html.py:80`) | estático, sem navegador |

**O que separa (3) de (4), que é o par difícil:** em ambos o gate roda e passa.
A pergunta que decide é **existe um sítio vivo que implementa a propriedade?**

- Em **(4)** existe: a propriedade "mapa e pergunta lado a lado" continua valendo
  e continua implementada — mudou de camada (`ui_p52_workspace_v32.css:70-83`). A
  mutação erra o alvo.
- Em **(3)** não existe: não há sítio nenhum, porque não há estado que chegue lá.
  A mutação acerta um alvo que nada alcança.

Teste operacional da diferença: em (4) você consegue **apontar o arquivo:linha que
hoje decide**; em (3) você só consegue apontar o caminho que ninguém percorre.

**E o quinto estado, que a 013 nomeou e esta varredura reencontrou** — *rot
semântica*: o gate **reprova**, mas com mensagem que o `reason` não casa mais
(`P50::M51`). Não é falta de poder discriminante: é o registro do par que
envelheceu. Fica fora do escopo de qualquer varredura de cascata, e tem conserto
próprio já feito (013 §16). Cito porque um leitor futuro vai confundir os dois:
**"o gate não reprovou" ≠ "o gate reprovou pelo motivo errado"**, e a nota do
harness já os separa por texto.

---

## Rotas, com o rito de cada uma

Todas partem de um fato de rito **comum e medido**: nenhum dos arquivos
envolvidos está em `boundary.json → frozen`; `tests_p50_chromium.js` **não** está
em `frozenSuites` de `P50-GOV1` (`tests_p50_core.js:446-449`) nem no mapa
`PROTECTED`. Logo **não há rito D2 aqui** — o rito é o comum: TDD (R3, red
commitado, autor do gate ≠ implementador) + **repin no mesmo PR** (R8 §1), porque
`ui_p50_v32.css`, `tests_p50_chromium.js` e `tests_p51_mutants.js` são pinados.
Isto distingue esta demanda do `EA-16`, cujo gate (`tests_ux_m41.js`) **está**
congelado e exige rito próprio.

| rota | o que faz | rito | avaliação |
|---|---|---|---|
| **R1 — reancorar `M51-01` no sítio da 5.2** | a âncora passa a `ui_p52_workspace_v32.css:70-83`, preservando a propriedade | comum + repin; **e obriga** acrescentar `ui_p52_workspace_v32.css` a `p51.targets` (senão o gatilho fica cego de novo) | **contraindicada**. O glossário define *reancoragem* como preservar a propriedade "quando o comportamento-alvo ainda existe e a mutação continua produzindo a mesma violação" — aqui existe, mas em **outro dono**. Um par da 5.1 passa a depender de artefato da 5.2 e a campanha 5.1 passa a re-executar por mudança na 5.2. É decisão de desenho, não conserto |
| **R2 — mover o par para a `p52`** | aposentar `M51-01` da `p51` com a razão na matriz; nascer um `P52-*` que muta o sítio da 5.2, julgado por gate da 5.2 | comum + repin + matriz + `known_issues` | coerente com "namespace da fase" (R10). **Custo**: `P51-VIS1` fica **sem mutante** → dívida declarada (R3 §5), a menos que se escreva outro para ele |
| **R3 — asserção nova sobre produto** | gate que afirme a propriedade **na camada que hoje a implementa**, com mutante próprio | comum + repin + `expected_suites.json` no mesmo PR (R10 §3) | é o que o `EA-7` antecipou como remédio provável. Devolve poder discriminante de verdade; é a rota que fecha a `KI-4` pelo `IC-9.3` |
| **R4 — varredura estática de regra morta** | checagem no `pipeline.yaml` que, para cada mutante de CSS, prova que a declaração resultante **decide** ao menos uma propriedade | R10 §9 (entra no pipeline, nunca no prompt) + R10 §10 (auto-exclusão nominal) + R3 (red próprio) | **não substitui R2/R3**: a varredura *detecta*, não *conserta*. Fecha o item 5 (o gatilho cego) porque roda em toda mudança de CSS, não só nos `targets` da campanha. Não exige Chromium — não herda a KI-3 |

**Recomendação**: **R4 + R3**, nesta ordem de dependência (a varredura primeiro,
porque ela é o red do caso `M51-01`; a asserção nova depois, provada por ela).
R1 descartada; R2 só se a Fase 2 concluir que a propriedade pertence mesmo à 5.2.
Quem desenha é o `tech-lead` com o `qa-engineer` — isto é recomendação de produto,
não desenho.

---

## Fronteira com o `EA-20` — o que fica para a demanda dele

O `EA-20` registra a **família**: gate verde que não pode reprovar, com três
instâncias (`EA-7`, a errata E17 da 010, `EA-16`) e um alvo declarado que **não é
nenhum dos três gates** — é o critério de nascimento de gate da R10.

Divisão que evita as duas metades:

| | **014 (esta)** | **demanda do `EA-20`** |
|---|---|---|
| causa | **regra morta por cascata** — a propriedade mudou de camada | **pré-condição que nunca falha** (E17 da 010) e **expressão constante** (`UX14`/`EA-16`) |
| população | mutantes de CSS (42, medidos) | alíneas e gates em JS; inclui gate **sem par nenhum** (`UX14` não tem mutante — é o `EA-3` pelo outro lado) |
| instrumento | especificidade + importância + ordem de inlining — **estático, sem navegador** | análise de expressão / alcançabilidade de estado — outra técnica |
| entrega normativa | **nenhuma** — a 014 não altera a R10 | **altera a R10**: acrescentar ao critério a exigência de **prova de que a asserção pode reprovar** |

**O que a 014 entrega ao `EA-20` sem invadi-lo**: o precedente executável (uma
varredura de poder discriminante que roda no pipeline e tem red próprio), o
vocabulário fechado das quatro classes (§As quatro distinções) e a constatação de
que **a prova de discriminância tem data** — que vale para as três instâncias, não
só para CSS.

**O que a 014 NÃO deve fazer**, sob pena de entregar metade: nomear sua checagem
"varredura de gates sem poder discriminante". Isso é o `EA-20`. A checagem desta
demanda chama-se **varredura de regra morta** e o escopo dela é cascata de CSS —
declarado assim na spec, no `pipeline.yaml` e no `CONTEXT.md`.

---

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | `M51-01` volta a `KILL` e a `KI-4` continua no `known_issues.json` | `IC-9.3` **reprova** e força a remoção. A remoção da entrada e a devolução do poder discriminante são **o mesmo PR**, nunca dois |
| 2 | Rota R2: o par `M51-01` deixa de existir, mas a `KI-4` o nomeia | `IC-9.1` exige harness+mutante+gate **resolvendo no disco** (oráculo: preflight). Exceção órfã reprova. Aposentar o mutante **obriga** remover a exceção no mesmo PR |
| 3 | A varredura precisa enumerar mutantes e a matriz é agregada em `p50`/`p52` | Enumerar **pelo preflight do harness** (`--preflight` já devolve o objeto C1 com toda âncora), **nunca** pelos pares da matriz — expandir `p50`/`p52` é a T13 da 013, decisão registrada |
| 4 | Mutante de CSS cujo gate é **lint de fonte** (`M8`/`P50-COR1`) | Excluído **nominalmente** da varredura de cascata, com o motivo no próprio registro. Sem isso, falso positivo — e R10 §10 exige que o scanner tenha auto-exclusão nominal |
| 5 | Mutante **aditivo** (`M52`, `M53`, `P52-M8`, `P52-ER5`, `P52-ER6`, `P52-FC2`) — acrescenta regra em vez de alterar a ancorada | A cascata tem de ser medida sobre a **declaração resultante**, não sobre a âncora. Varredura que só olhe a âncora erra a classe inteira |
| 6 | Mutante dentro de `@media` (`P52-EX5` muta `flex-direction: row !important` em `@media print`; a folha da 5.2 tem 8 blocos `@media`) | O contexto de mídia é parte do endereço. Comparar declarações de contextos de mídia diferentes como se competissem é resposta errada com cara de certa |
| 7 | `!important` em camada **anterior** | Vence declaração normal de camada posterior — a ordem de inlining **não** é o primeiro critério. Medido: 38 ocorrências em 5 folhas + 2 na Camada 1. A varredura tem de aplicar importância → especificidade → ordem, nessa ordem |
| 8 | Camada CSS **nova** entra no build depois de `ui_p50_v32.css` | Hoje nasce fora de `p50.targets`/`p51.targets` e **não dispara** re-execução. A varredura tem de ser gatilhada por **qualquer** `.css`, não pelos `targets` da campanha (é o item 5 do Sistema real) |
| 9 | Regra morta **por sobreposição dentro do mesmo arquivo** (uma regra posterior de `ui_p52_workspace_v32.css` anulando outra do mesmo arquivo) | Mesmo mecanismo, sem troca de fase. **Não medido nesta varredura** — declarado em §O que ficou por medir |
| 10 | A varredura acusa regra morta em declaração que é **fallback deliberado** (ex.: valor de base sobrescrito só sob `@media`/`:hover`) | Falso positivo previsível. Precisa de exceção nominal com motivo, ou de recorte que só considere o **mesmo contexto de mídia e estado** |

---

## Vocabulário

Termos a registrar no `CONTEXT.md` **no portão desta fase** (R12 — resolvidos
antes, escritos com a aprovação). Redação já pronta:

```md
**Regra morta**:
Declaração CSS que permanece no arquivo e não decide nenhuma propriedade
renderizada, porque outra declaração vence a cascata — importância, depois
especificidade, depois ordem de inlining. Mutar regra morta troca texto sem mudar
produto.
_Evitar_: regra órfã, CSS não usado, seletor morto, código morto

**Poder discriminante**:
Propriedade de um gate: existe ao menos um estado alcançável do produto em que ele
reprova. Provado por mutante que ele mata — e a prova vale para a árvore em que
foi medida, não para sempre.
_Evitar_: cobertura, força do gate, robustez

**Prova de discriminância vencida**:
Par cuja última prova de KILL foi medida em árvore anterior a uma mudança que pode
ter tirado o poder do gate, e que não foi re-executada desde então. Quarto estado
de leitura do registro, distinto de SOBREVIVENTE (medido e escapou) e de MUTANTE
NÃO EXECUTADO (não rodou).
_Evitar_: prova stale, KILL antigo, par desatualizado

**Varredura de regra morta**:
Checagem estática que, para cada mutante de CSS, prova que a declaração resultante
decide ao menos uma propriedade — cascata, sem navegador. Distinta da varredura de
gate constante (achado EA-20), que mede expressão e alcançabilidade de estado.
_Evitar_: varredura de gates sem poder discriminante, lint de CSS morto
```

Termos já canônicos que esta demanda **usa sem redefinir**: *âncora de mutante*,
*âncora podre*, *reancoragem*, *aposentadoria de mutante*, *mutante sobrevivente*,
*mutante não executado*, *alvo declarado de campanha*, *gate*, *achado*.

---

## Rodadas de entrevista

Uma recomendação por pergunta. Nenhuma respondida ainda.

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1 · P1 | A medição diz **1 caso em 42**, não uma família. Isso muda a justificativa da demanda: ela deixa de ser saneamento e passa a ser **prevenção do gatilho cego** (§Sistema real, item 5). Confirma que a demanda segue com essa justificativa reescrita? **Recomendo que sim** — a exposição do item 5 é permanente e independe do número de casos de hoje. | |
| 1 · P2 | Escopo da entrega: **R4 (varredura estática) + R3 (asserção nova sobre produto)**, ou só uma das duas? **Recomendo as duas, nesta ordem**: a varredura é o red do `M51-01`, e sem a asserção nova a `KI-4` não fecha pelo `IC-9.3`. Entregar só a varredura deixa a exceção viva sem prazo novo. | |
| 1 · P3 | A varredura deve cobrir **as 6 campanhas** (`p50`, `p51`, `p52`, `d009`, `d011`, `core`) ou só as três do enunciado? **Recomendo as seis**: `d009` muta `ui_ux_v32.css` (a folha mais antiga, com **três** camadas posteriores) e `ui_p52_workspace_v32.css`; restringir a três deixa o caso mais exposto de fora por acidente de recorte. | |
| 1 · P4 | Os quatro termos do §Vocabulário entram no `CONTEXT.md` **agora** (antes do portão, R12) ou no commit da Fase 1? **Recomendo agora**, no mesmo turno em que este refinamento for aprovado — o precedente da 013 (âncora podre, reancoragem, mutante sobrevivente) é esse. | |
| 1 · P5 | O achado do item 6 — **três registros de prova vencidos** (`p50` agregada como "histórica", `P50::M51` sem KILL pós-correção, `M51-08` com data atrasada) — entra nesta demanda ou vira achado próprio no backlog? **Recomendo achado próprio (`EA-*` novo), fora desta demanda**: é doença de **registro**, não de cascata, e misturá-la aqui é exatamente a metade-e-metade que a §Fronteira quer evitar. O id **não** é alocado por mim na Fase 0 (branches paralelas não se enxergam). | |
| 1 · P6 | A citação `build_v32_html.py:76` está desatualizada no `EA-7`, no `known_issues.json` e na memória do `qa-engineer` (é `:80` hoje). Corrijo nesta demanda ou deixo para o `doc-writer` em `fix-finding`? **Recomendo corrigir aqui**, no PR desta demanda: são três linhas e a demanda toca os três arquivos de qualquer modo. | |

---

## O que ficou por medir

Declarado, não omitido (R2 §1). Cada item nomeia quem mede.

1. **Execução.** Não rodei campanha nem suíte: não é meu papel, e esta máquina não
   tem Chromium (a 013 registrou `CHROME_PATH` vazia e cache `ms-playwright`
   inexistente). Todo número de execução aqui é **relatado** de registro citado —
   runs do job `visual` do CI. → `qa-engineer` / CI.
2. **Sobreposição intra-arquivo** (caso de borda 9): não verifiquei, para os 36
   mutantes da `p52`, se alguma regra posterior **do mesmo arquivo** anula a
   declaração mutada. O argumento de imunidade que dei cobre camada posterior, não
   ordem interna. → a própria varredura da R4 mede isto de graça; até lá é lacuna
   conhecida.
3. **Colisões de `!important`** (caso de borda 7): contei 38 ocorrências em 5
   folhas + 2 na Camada 1, mas **não confrontei** cada uma com as declarações
   mutadas. → `ui-engineer` ou a varredura.
4. **Confirmação por `git log`** de que `c1e3649` é posterior a 2026-08-22 (a data
   do KILL de `M51-01`), separando "nasceu podre" de "apodreceu". A 013 já
   registra a cadeia por `git log -S`; não a re-executei. → `build-engineer`.
5. **`P51-VIS2` medindo `option`.** Minha leitura de cascata para `M51-08` conclui
   que a regra da 5.1 vence; a corroboração é o KILL de 2026-08-31. Não li o corpo
   do oráculo para confirmar **qual** propriedade computada ele lê. → `qa-engineer`.
6. **Campanhas `d009`, `d011` e `core`.** Fora do recorte do enunciado. `d009` tem
   2 mutantes de CSS (`ui_ux_v32.css:170`, `ui_p52_workspace_v32.css:337`) e
   `d011` tem 5 (`ui_d011_prioridade_v32.css`) — **não medidos**. O de
   `ui_ux_v32.css` é o mais exposto de todo o repositório (três camadas
   posteriores) e é o motivo da pergunta P3.

---

## Fora de escopo (explícito)

- **Alterar a R10** (o critério de nascimento de gate). É o alvo declarado do
  `EA-20` e a 014 não o toca.
- **`EA-16` / `UX14`** e a **errata E17 da 010**: outras causas da mesma família,
  outra técnica, suíte congelada com rito próprio.
- **Expandir `mutation-matrix.json` por par** em `p50`/`p52` — é a T13 da 013.
- **Retro-ajustar registros de `docs_phase5/`** (R13).
- **Qualquer mudança em `engine_v32.js` ou na Camada 1** — nada nesta demanda
  chega perto do rito D2.
- **Rot semântica** (`reason` envelhecido): classe distinta, conserto já feito
  pela 013 §16.
- **Corrigir de passagem** o código morto de `tests_p50_chromium.js:1046-1049`
  (`cmp` definido e nunca invocado), já registrado pela 013 §18.
