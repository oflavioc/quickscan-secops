# Spec — 014-gate-sem-poder-discriminante

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md), não o repete.

## Objetivo

Instalar uma **varredura de regra morta** que rode em toda mudança de CSS — não
pelos alvos das campanhas — e devolver poder discriminante ao sítio que hoje
governa a composição da tela de pergunta, fechando a exceção `KI-4`.

## Justificativa — reescrita, e o que ela não promete

**Esta demanda não é saneamento de uma família.** A varredura estendida às
**sete** campanhas mediu **49 mutantes de CSS** e encontrou **um** caso de regra
morta (`p51/M51-01`). Registrado aqui em letra grande porque é o que impede
alguém, daqui a seis meses, de ler "varredura de regra morta" e concluir que
havia um problema grande:

| classe | quantos | quem |
|---|---|---|
| **regra morta confirmada** | **1** | `M51-01` |
| imune por estrutura — mutam folha sem camada posterior capaz de sobrepor | 42 | 36 da `p52` + `D009-M17` (`ui_p52_workspace_v32.css`) + os 5 da `d011` (última folha do inlining) |
| imune por oráculo — o gate lê **fonte**, não renderização | 2 | `M8` (`P50-COR1`) · `D009-M5` (`D009-DOM1`) |
| viva — cascata medida, a declaração ancorada vence | 4 | `M51-08` · `M51` · `M52` · `M53` |
| campanhas sem mutante de CSS | — | `d010` · `core` |

O que justifica a demanda é a **exposição permanente**, não o número de hoje:

> **O gatilho por path vigia o que a campanha MUTA, nunca o que decide o
> resultado.** `ui_p52_workspace_v32.css` não está em `p51.targets` nem em
> `p50.targets` (`.claude/verify/mutation_map.json`). Quando `c1e3649` escreveu a
> regra que mata o `M51-01`, a `p51` não foi re-executada — o alvo declarado não
> mudou. Toda folha CSS futura entra **depois** de `ui_p50_v32.css`
> (`build_v32_html.py:80`) e nasce fora dos alvos das campanhas antigas.

## Duas medições que refutam recomendações — inclusive a minha

Registrado porque refutação some quando não se escreve (R2 §5).

**1. A minha, da Fase 0.** Recomendei **R4 + R3** — varredura *mais* "asserção
nova sobre comportamento de produto". **R3 é desnecessária.** Medido:
`tests_p52_chromium.js:231` — `P52-LAY2`, *"tela de pergunta em duas colunas reais
e rodapé ocupando a largura útil inferior"* — **já afirma exatamente a
propriedade** que `P51-VIS1` afirma, **na camada que hoje a decide**, medindo
caixas reais: `:206` a pergunta à esquerda do mapa, `:207` as colunas não se
sobrepõem, `:208-209` alinhadas pelo topo, `:224-226` abaixo de 1180px empilham.
A propriedade **nunca esteve desguardada**. Escrever gate novo seria um segundo
dono da mesma medição.

**2. A do `EA-7`.** O achado listou duas rotas plausíveis: reancorar `M51-01` no
sítio da 5.2, ou gate novo de regra morta. Falta a terceira, que é a barata e a
correta: **a declaração vencedora `ui_p52_workspace_v32.css:77**
(`grid-template-columns: minmax(0, 1fr) clamp(320px, 23vw, 440px)`) **não tem
mutante nenhum**. Dos 36 mutantes de CSS da `p52`, o único que toca aquele bloco
é `P52-M2`, e ele ataca a cláusula do **rodapé** (`:88`), não a das colunas. O
buraco não é gate ausente: é **carrasco ausente sobre a linha que decide**.

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (R3 §1). Suíte:
`tests_014_regra_morta.js`. Harness: `tests_014_mutants.js`. Namespace `D014-*`.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| C1 | O classificador de cascata acerta os quatro cenários canônicos, **incluindo os dois cuja resposta correta é "viva"** | `D014-CASC1` · `tests_014_regra_morta.js` · sobre folhas **sintéticas** (fixtures próprias, fora da árvore de produto): (a) morta por especificidade; (b) morta por ordem de inlining com especificidade empatada; (c) **viva** — camada posterior declara a mesma propriedade no mesmo elemento com especificidade **menor**; (d) **viva** — `!important` em camada **anterior** vence declaração normal posterior | `D014-M1` ignorar `!important` → (d) vira "morta" · `D014-M2` decidir só por ordem → (a)/(c) erram · `D014-M3` ignorar contexto de mídia → (b) erra |
| C2 | A varredura, sobre a **árvore real**, enumera os mutantes de CSS de **todas** as campanhas pelo preflight e acusa **zero** regras mortas | `D014-VARR1` · `tests_014_regra_morta.js` · população lida de `--preflight` de cada harness (nunca dos pares da matriz); saída: 0 mortas, com a lista dos avaliados e dos excluídos | `D014-M4` acrescenta a `ui_p50_v32.css` uma declaração que `ui_p52_workspace_v32.css` já sobrepõe (regra morta nova, na árvore) → a varredura **tem** de acusá-la |
| C3 | A auto-exclusão nominal tem dentes e **não é passe livre** | `D014-EXC1` · `tests_014_regra_morta.js` · (a) motivo do vocabulário fechado `oraculo-de-fonte` \| `fallback-declarado`; (b) curinga, campo vazio ou não-texto **não excluem**; (c) exclusão que nomeia mutante inexistente **reprova** (oráculo: preflight); (d) exclusão `oraculo-de-fonte` registra **qual propriedade** o oráculo afirma e **quais arquivos** ele lê | `D014-M5` aceitar curinga (shape do `IC-9.1`) · `D014-M6` deixar de conferir a existência do mutante nomeado |
| C4 | A linha que **decide** a composição da tela de pergunta ganha carrasco | `P52-LAY2` (**gate existente**, `tests_p52_chromium.js:231` — suíte **não editada**, só invocada) · mutação de `ui_p52_workspace_v32.css:77` para uma coluna | `D014-M10` · `grid-template-columns: minmax(0, 1fr) clamp(320px, 23vw, 440px)` → `minmax(0, 1fr)`; motivo esperado `/a pergunta não está à esquerda do mapa\|as colunas se sobrepõem\|colunas desalinhadas no topo/` |
| C5 | A cobertura da varredura é **derivada do builder**, não digitada | `D014-COB1` · `tests_014_regra_morta.js` · a lista e a **ordem** das folhas injetadas saem de `build_v32_html.py`; folha injetada pelo builder e não lida pela varredura reprova; a ordem observada casa com a declarada em `specs/PHASE_5_0_REV_B.md:1606` | `D014-M7` acrescentar uma folha ao builder sem tocar a varredura (precedente: `D011-M18` muta `build_v32_html.py`) |
| C6 | O que a varredura **não** decide é nomeado e contado — nunca engolido | `D014-IND1` · `tests_014_regra_morta.js` · declaração cuja competição não cai na relação decidível sai em lista **nomeada e contada**; a contagem vive em registro canônico e divergência reprova; SKIP silencioso é FAIL (R10 §2) | `D014-M8` descartar silenciosamente o indecidível → a contagem muda |
| C7 | A `KI-4` fecha **no mesmo PR** | **Sem gate novo** — `IC-9.3` (registro volta a `KILL`) e `IC-9.4` cenário ii (execução volta a `DETECTADO`) já são o carrasco, nas duas direções (`check_mutation.py:557-585`) | — (criar gate aqui duplicaria o carrasco) |

### Guarda de tautologia, alínea por alínea

Exigência do portão: para cada alínea, **existe estado alcançável em que ela
falha?** Onde não sei, está escrito.

| alínea | estado alcançável de falha | como sei |
|---|---|---|
| C1 (a) | classificador que não some especificidade do seletor de tipo | é o mecanismo do `M51-01`: `(0,2,2)` vs `(0,2,1)` |
| C1 (b) | classificador que resolva empate pelo arquivo errado | `D014-M2` |
| **C1 (c)** | classificador que responda "morta" sempre que houver concorrente posterior | **é o shape do `M51-08`, medido: `(1,1,2)` da 5.1 vence `(0,1,2)` da 5.2.** Sem esta alínea, um classificador que respondesse "morta" para tudo passaria em (a) e (b) |
| **C1 (d)** | classificador que trate ordem antes de importância | `!important` medido: 38 ocorrências em 5 folhas + 2 na Camada 1 |
| C2 | **hoje falha**: a árvore real tem 1 regra morta. É o **red** desta demanda | medido no refinamento |
| C3 (b) | exceção com curinga passando a perdoar | precedente vivo: `IC-9.1` reprova exatamente isso |
| C3 (c) | exclusão órfã sobrevivendo à remoção do mutante | preflight resolve no disco |
| **C3 (d)** | exclusão que não registra o que o oráculo lê | ver §"A alínea em que quase escorreguei" |
| C4 | mutação da linha vencedora sem gate que a pegue | `P52-LAY2:206-207` compara as caixas de `#app` e `#p50-shell`; com uma coluna elas empilham e `m.app.l >= m.shell.l` passa a ser verdadeiro → `detail` cresce → FAIL. **Raciocinado, não executado** — exige Chromium (§Não mensurável, item 2) |
| C5 | folha nova entrando no build sem a varredura saber | é literalmente o que aconteceu com a folha da 011 (`build_v32_html.py:76` → `:80`) |
| **C6** | **NÃO SEI se a alínea sobre a árvore real é não-vacuosa** — se hoje o conjunto indecidível for **vazio**, ela não mede nada | ver §Não mensurável, item 1. Guarda obrigatória: C6 tem **também** um caso indecidível **sintético**, para que a alínea não dependa do número da árvore |

### A alínea em que quase escorreguei (C3-d)

Excluir `M8` e `D009-M5` "porque o oráculo é de fonte" está **certo quanto à
cascata** e é **insuficiente como registro**. `D009-DOM1`
(`tests_009_leitura.js:335-340`) lê `ui_ux_v32.css` como texto e exige que alguma
regra de `.jn-dom` declare `font-weight` — isto é, afirma uma propriedade de
**renderização** (o canal não-cromático) lendo **um único arquivo**. Se uma folha
posterior declarasse `font-weight: normal` em `.jn-dom`, o canal morreria e o gate
**não notaria**.

Medido hoje: **nenhuma outra folha do repositório menciona `.jn-dom`** — as
únicas ocorrências estão em `ui_ux_v32.css:249-271`. Logo **não há defeito**, e é
exatamente por isso que isto é **registro**, não achado. A alínea C3-d existe para
que a exclusão carregue essa cegueira impressa em vez de presumida: um scanner
que exclui sem dizer o que está deixando de ver é a doença que esta demanda
combate, aplicada a ela mesma.

## Comportamento especificado

### O predicado, e por que ele é estreito de propósito

Decidir "estas duas regras competem" no caso geral é o problema de interseção de
seletores — indecidível na prática sem DOM. Um scanner que fingisse decidir seria
o defeito que a demanda combate. Então o predicado é **estreito e declarado**:

**Duas declarações competem** quando têm a **mesma propriedade**, o **mesmo
contexto de mídia** (normalizado), e seletores ligados por uma relação
**decidível**: idênticos, ou um obtido do outro por **prefixação de compostos**
(`body[…] .wrap` × `html body[…] .wrap`; `.ux-tgt-row select option` ×
`#ux-target .ux-tgt-row select option`). Essas duas formas cobrem os dois casos
reais medidos — o `M51-01` e o `M51-08`.

**Vencedora** = importância (`!important`) → especificidade
(`@bramus/specificity`, já em `node_modules`) → ordem de inlining derivada do
builder. Nessa ordem, sempre.

**Regra morta** = toda declaração que a mutação altera ou acrescenta **perde** a
cascata em **todos** os contextos em que compete, e **em nenhum** contexto ela é
a vencedora.

Tudo que ficar fora da relação decidível é **indecidível**, e vai para a lista
contada de C6. **Nunca "provavelmente viva"**, nunca silêncio.

### Mutante aditivo — a classe que erraria por construção

`M52`, `M53`, `P52-M8`, `P52-ER5`, `P52-ER6`, `P52-FC2` **acrescentam** regra em
vez de alterar a ancorada. A cascata tem de ser medida sobre a **declaração
resultante** (a diferença entre a folha original e a mutada), nunca sobre a
âncora. Varredura que só olhe a âncora erra a classe inteira e sai verde.

### O que acontece com `M51-01`

`D014-M10` devolve carrasco à linha vencedora. `M51-01` continua sem poder
discriminante — a mutação dele segue trocando declarações mortas. Disposição:

1. **Aposentado** de `tests_p51_mutants.js`, com a razão registrada em
   `mutation-matrix.json` e a **substituição nominal** apontando `D014-M10`.
2. `P51-VIS1` fica **sem mutante** → **dívida declarada com causa** em
   `dividas_declaradas`: a propriedade é medida pelo par `D014-M10`/`P52-LAY2`, e
   `P51-VIS1` permanece como **segunda medição independente** (mesma linguagem
   do precedente `D011-IDEM1(d)`). Dívida declarada nunca vira mutante sintético.
3. **`KI-4` removida no mesmo PR.** `IC-9.1` exige que a exceção nomeie mutante
   que **resolve no disco**; com `M51-01` aposentado, exceção órfã reprova.
   Remover a exceção e devolver o poder discriminante são **o mesmo commit-par**,
   nunca dois PRs.

> **A demanda não encerra** com `M51-01` aposentado e `KI-4` viva, nem com `KI-4`
> removida e nenhum carrasco novo. `IC-9.3` reprova nas duas direções.

### Onde a varredura roda

Stage próprio no `pipeline.yaml` (R10 §9 — checagem nova entra no pipeline, nunca
no prompt de um agente), `heavy: false`, **sem Chromium**. É o ponto: o defeito
ficou escondido meses porque a prova morava no job `visual` (KI-3). A varredura é
estática e roda em todo PR, gatilhada por qualquer `.css`, não pelos `targets` de
campanha.

O par `D014-M10`/`P52-LAY2` **exige Chromium** e é deferido ao job `visual`
(KI-3, `design-decisions.md`) — declarado, nunca omitido.

## Contratos

- **`d014` em `.claude/verify/mutation_map.json`**: `cmd`, `preflight: true`
  declarado **no mesmo commit** em que `tests_014_mutants.js` passa a ler
  `--preflight` em argv (D4 da 013 — a guarda de fonte de `check_mutation.py`
  recusa a chave sem o modo). `targets`: `ui_p52_workspace_v32.css`,
  `build_v32_html.py`, `tests_014_regra_morta.js`, `tests_014_mutants.js`.
  `requires`: `[node, python, chromium]`.
- **Registro de exclusões nominais**: arquivo próprio, legível por máquina, com
  `harness` · `mutante` · `motivo` (vocabulário fechado) · `propriedade_afirmada`
  · `arquivos_lidos`. Owner: `qa-engineer`. Nunca prosa.
- **Registro da contagem de indecidíveis**: chave própria no mesmo arquivo, no
  shape do `expected_suites.json` (contagem pinada, divergência reprova).
- **Nenhum estado novo de produto.** Nada aqui é bridge, nada renderiza, nada
  toca sessão — R9 §5 não se aplica por ausência de dado novo.

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** `P51-VIS1` e `P52-LAY2` **não
  constam** de `.claude/verify/invariants.json` (resultado negativo, conferido):
  guardam superfície de fase, não invariante. Nenhuma das dez muda.
- [x] **`design-decisions.md` — nenhum conflito.** KI-3 (visuais fora do agregado
  local) é **respeitada e explorada**: a varredura é estática justamente para não
  herdá-la; o par C4 é deferido ao job `visual`, declarado. R13 "fases 5.0–5.2
  seladas valem como foram seladas" — nada em `docs_phase5/` é retro-ajustado.
- [x] **Specs validadas anteriores — nenhuma contradição.** `specs/013…/spec.md`
  §Fora de escopo manda a 013 **parar** na saída "gate sem poder discriminante" e
  remeter o remédio a outro dono; esta spec é esse dono. A decisão registrada de
  **não expandir** `mutation-matrix.json` por par em `p50`/`p52` (T13 da 013) é
  respeitada: a varredura enumera pelo **preflight**, não pelos pares.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `current_phase.json → specs_normativas` tem **uma**:
  `specs/PHASE_5_0_REV_B.md` (SHA `4f1583c7…4619b`). Lida:
  - **`:1606`** — declara a ordem de injeção CSS (`ui_p50_v32.css` após
    `ui_ux_v32.css`, *"nesta ordem declarada"*, `build_v32_html.py` *"permanece
    protegido… nenhuma outra linha"*). **É âncora normativa da entrada da
    varredura.** Consequência: C5 **lê** essa ordem e a confere; **reordenar
    folhas não é remédio admissível** nesta demanda — mexeria em diretriz de fase
    selada.
  - **`:1594`** — `ui_p50_v32.css` *"zero hex de domínio"*: origem normativa do
    `P50-COR1`, que é o motivo da exclusão nominal de `M8`.
  - **Resultado negativo, que também é leitura**: **nada** sobre cascata,
    especificidade, sobreposição entre camadas ou regra morta em
    `specs/PHASE_5_0_REV_B.md` — busca por `cascata`, `especificidade`,
    `inlining` sem ocorrência. A spec selada declara a **ordem**, nunca quem
    vence. O terreno é livre.
  - Spec selada **não é editada aqui** (rito de promoção).
- [x] **Boundary (R6) — as três fontes cruzadas, com o negativo:**
  1. **`.claude/verify/boundary.json`** — `frozen` lista **quatro** paths:
     `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`,
     `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json`. **Nenhum arquivo
     desta demanda está lá.** `build_v32_html.py` **não** é `generated` (o
     gerado é o HTML de saída).
  2. **`PROTECTED` e `frozenSuites` (`tests_p50_core.js`)** — `frozenSuites`
     (`:446-449`) tem 13 suítes e **`tests_p52_chromium.js` não está entre elas**;
     o mapa `PROTECTED` não tem chave `ui_p5*` nem `tests_p5*` (busca por
     `"tests_p5` e `"ui_p5` sem ocorrência). **Resultado negativo explícito.**
  3. **`.claude/verify/pins.json`** — `ui_p52_workspace_v32.css`,
     `build_v32_html.py` e os arquivos novos são/serão **pinados**: repin por
     `gen_pins.py` **no mesmo PR**, com motivo no commit (R8 §1); arquivo
     rastreado sem pin é FAIL no stage `baseline`.
  - **Rito, nomeado**: **não há rito D2 nesta demanda.** O rito é o comum — TDD
    (R3: red commitado, autor do gate ≠ implementador) + repin (R8 §1) +
    `expected_suites.json` no mesmo PR (R10 §3). **É isto que separa esta demanda
    do `EA-16`**, cujo gate (`tests_ux_m41.js`) **está** em `frozenSuites` e exige
    rito próprio.
  - **Precedência** onde a prosa de spec selada divergir do executável: vale o
    regime de pins (R8; `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`,
    Disposição §2). **Divergência encontrada e não resolvida aqui**: aquele
    documento afirma que os arquivos tocados por 5.1/5.2 estão *"protegidos por
    `boundary.json`"*, e `boundary.json` **não os lista** — a proteção real é de
    **identidade** (pins), não de **proibição**. Pela regra do template isso é
    **achado de backlog, nunca edição de spec selada** → DEPENDÊNCIAS.

## Não mensurável nesta fase — declarado, não omitido (R2 §1)

1. **A não-vacuidade de C6 sobre a árvore real.** Não sei quantos dos 49 caem
   fora da relação decidível: depende do normalizador, que ainda não existe. Se
   der **zero**, a alínea da árvore real é vacuosa. **Guarda já na spec**: C6 tem
   caso indecidível **sintético** obrigatório. **Medição: Fase 4, `qa-engineer`.**
2. **A morte de `D014-M10` por `P52-LAY2`.** Raciocinada sobre
   `tests_p52_chromium.js:206-207` (com uma coluna, `#app` e `#p50-shell`
   empilham e `m.app.l >= m.shell.l` passa a valer). **Não executada** — exige
   Chromium, ausente nesta máquina. Fecha no job `visual`.
3. **Execução de qualquer suíte ou campanha.** Não rodei nenhuma: não é meu
   papel. Todo número desta spec vem de leitura da árvore ou de registro citado.
4. **Sobreposição intra-arquivo** (regra posterior anulando outra da **mesma**
   folha). Não medida no refinamento; a varredura a mede de graça quando existir,
   mas **não é critério de aceite** aqui — se aparecer, é achado novo.
5. **Se `M51-08`, `M51`, `M52` e `M53` sobreviverão à próxima folha CSS.** Hoje
   estão vivos por especificidade e por ausência de concorrente. É precisamente o
   que C2 passa a vigiar em toda mudança — mas o veredito de hoje não é promessa.

## Fora de escopo

Herdado do refinamento, mais o que esta spec exclui:

- **Alterar a R10** (critério de nascimento de gate) — alvo declarado do `EA-20`.
  Esta demanda produz o precedente e o vocabulário; **não** generaliza a regra.
- **`EA-16`/`UX14`** e a **errata E17 da 010** — outras causas da mesma família,
  outra técnica, suíte congelada com rito próprio.
- **`EA-17` (R9 §6 · CSS com prefixo do próprio módulo sem verificador).** A
  varredura abre `.css` e vai parecer o lugar óbvio para hospedar o lint de
  prefixo. **Não é.** Achado próprio, dono próprio, e misturar os dois é a
  metade-e-metade que a §Fronteira do refinamento existe para evitar.
- **As três provas de discriminância vencidas** (`p50` agregada como
  "histórica"; `P50::M51` sem KILL pós-correção; `M51-08` com data atrasada) —
  achado próprio, id alocado pelo `doc-writer` contra a `develop` (decisão P5).
- **Expandir `mutation-matrix.json` por par** em `p50`/`p52` — T13 da 013.
- **Reordenar folhas no builder** — `specs/PHASE_5_0_REV_B.md:1606` é âncora
  normativa de fase selada.
- **Editar `tests_p52_chromium.js`, `tests_p50_chromium.js` ou qualquer suíte de
  fase selada.** `P52-LAY2` é **invocado**, nunca alterado.
- **Qualquer toque em `engine_v32.js` ou na Camada 1** — nada aqui chega perto do
  rito D2.
- **Reancorar `M51-01` no sítio da 5.2** (rota R1 do refinamento): contraindicada
  — moveria um par da 5.1 para depender de artefato da 5.2. `D014-M10` nasce no
  namespace da demanda, que é o que a R10 pede.
