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

## Três medições que refutam recomendações — duas delas minhas

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

**3. A minha, de novo — desta vez a citação do carrasco da `KI-4`.** Escrevi que
o carrasco eram `IC-9.3` e `IC-9.4` cenário ii. **`IC-9.4` não serve.** Conferido
no fonte: `IC-9.4` (`check_mutation.py:948-977`) é a **auto-prova do mecanismo**,
com sonda **sintética** (`IC9_SONDA_*`) e função pura — não mede a `KI-4` real. E
`mut_perdao` itera os **blocos da campanha**: aposentado o `M51-01`, o id some da
saída, não há bloco, e o cenário ii **não dispara**. Quem morde depois da
aposentadoria é `IC-9.2` (`:895`, o objeto da exceção existe no harness). Errata
**E2**. Registro a correção porque foi a segunda vez, nesta demanda, que citei um
gate por leitura de comentário em vez de leitura da expressão — é literalmente o
erro que a demanda combate.

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (R3 §1). Suíte:
`tests_014_regra_morta.js`. Harnesses: `tests_014_mutants.js` (`d014`) e
`tests_014_mutants_visual.js` (`d014vis`) — a partição é a errata **E1**.
Namespace `D014-*`.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| C1 | O classificador de cascata acerta os **cinco** cenários canônicos, **incluindo os três cuja resposta correta é "viva"** — alínea (e) por **E5** | `D014-CASC1` · `tests_014_regra_morta.js` · sobre folhas **sintéticas** (fixtures próprias, fora da árvore de produto): (a) morta por especificidade; (b) morta por ordem de inlining com especificidade empatada; (c) **viva** — camada posterior declara a mesma propriedade no mesmo elemento com especificidade **menor**; (d) **viva** — `!important` em camada **anterior** vence normal posterior; **(e) viva por prefixo NÃO-VÁCUO** — a vencedora é a perdedora prefixada por composto que **restringe** (id/classe/atributo), logo a perdedora segue decidindo fora do subconjunto | `D014-M1` ignorar `!important` → (d) vira "morta" · `D014-M2` decidir só por ordem → (a)/(c) erram · `D014-M3` normalizar contexto de mídia por **texto** → (b) e o caso real erram · **`D014-M9`** tratar todo prefixo como vácuo → (e) vira "morta" |
| C2 | A varredura, sobre a **árvore real**, enumera os mutantes de CSS de **todas** as campanhas pelo preflight — **população E âncora** (`find`/`repl`, por **E3**) — e acusa **zero** regras mortas, sobre **censo de parse pinado** (**E6**) | `D014-VARR1` · `tests_014_regra_morta.js` · população e âncora lidas de `--preflight` (nunca dos pares da matriz); o censo de regras/declarações por folha é conferido contra o registro **antes** do veredito; o veredito é sempre o **par (mortas, indecidíveis)**, nunca um número só (**E9**); saída: 0 mortas, com a lista dos avaliados e dos excluídos | `D014-M4` planta em `ui_p50_v32.css` uma regra morta nova, na árvore → a varredura **tem** de acusá-la pelo **veredito** — forma executável por **E10**: troca censo-neutra que planta dominadora de prefixo vácuo; a adição literal morreria pelo censo (E6), não pela detecção |
| C3 | A auto-exclusão nominal tem dentes e **não é passe livre** | `D014-EXC1` · `tests_014_regra_morta.js` · (a) motivo do vocabulário fechado `oraculo-de-fonte` \| `fallback-declarado` \| **`achado-aberto`** (por **E7**); (b) curinga, campo vazio ou não-texto **não excluem**; (c) exclusão que nomeia mutante inexistente **reprova** (oráculo: preflight); (d) exclusão `oraculo-de-fonte` registra **qual propriedade** o oráculo afirma e **quais arquivos** ele lê; **(e) exclusão `achado-aberto` exige `achado` (id do backlog) E `remocao_prevista`** — sem os dois, não exclui | `D014-M5` aceitar curinga (shape do `IC-9.1`) · `D014-M6` deixar de conferir a existência do mutante nomeado — carrasco executável dos dois: `D014-DISC1`, por **E11** (julgador enfraquecido fica verde sobre registro são) |
| C4 | A colocação que **decide** a composição da tela de pergunta ganha carrasco | `P52-LAY2` (**gate existente**, `tests_p52_chromium.js:231` — suíte **não editada**, só invocada) · mutação de `ui_p52_workspace_v32.css:86` — `#p50-shell` para a coluna 1, a mesma célula de `#app` (**E13**; a forma anterior, `:77` "para uma coluna", foi medida **SOBREVIVENTE** no job `visual`) · harness **`d014vis`** (`tests_014_mutants_visual.js`), separado por **E1** | `D014-M10` · `body[data-uxscreen="question"] .wrap > #p50-shell { grid-column: 2; … }` → `grid-column: 1` (**E13**); motivo esperado, **inalterado**: `/a pergunta não está à esquerda do mapa\|as colunas se sobrepõem\|colunas desalinhadas no topo/` |
| C5 | A cobertura da varredura é **derivada do builder**, não digitada | `D014-COB1` · `tests_014_regra_morta.js` · a lista e a **ordem** das folhas injetadas saem de `build_v32_html.py`; folha injetada pelo builder e não lida pela varredura reprova; a ordem observada casa com a declarada em `specs/PHASE_5_0_REV_B.md:1606` | `D014-M7` acrescentar uma folha ao builder sem tocar a varredura (precedente: `D011-M18` muta `build_v32_html.py`) |
| C6 | O que a varredura **não** decide é nomeado e contado — nunca engolido | `D014-IND1` · `tests_014_regra_morta.js` · declaração cuja competição não cai na relação decidível sai em lista **nomeada e contada**; SKIP silencioso é FAIL (R10 §2). **Duas contagens, dois prazos** (**E9**): a **sintética** é pinada **agora** — na forma **veredito+razão** do caso (f), por **E12** — e é o oráculo de `D014-M8`; a da **árvore real** entra no registro quando o achado da E7 fechar — **fechou pela E14** (fix-finding do `EA-32`, 2026-09-04): `indecidiveis.arvore.contagem = 21`, fixada **por execução** — e com ela `D014-M8` passou a morrer em **três** alíneas, `C6(cont-arvore)` inclusa (**E15**) | `D014-M8` descartar silenciosamente o indecidível → o pin **sintético** (veredito+razão, E12) **e** a contagem da **árvore** (E14) acusam — três alíneas (**E15**) |
| C7 | A `KI-4` fecha **no mesmo PR** | **Sem gate novo** — o carrasco é **`IC-9.2`** (`check_mutation.py:895` · o objeto da exceção existe no harness) e **`IC-9.3`** (`:912` · não obsoleta, pelo registro). Corrigido por **E2** | — (criar gate aqui duplicaria o juiz) |

### Guarda de tautologia, alínea por alínea

Exigência do portão: para cada alínea, **existe estado alcançável em que ela
falha?** Onde não sei, está escrito.

| alínea | estado alcançável de falha | como sei |
|---|---|---|
| C1 (a) | classificador que não some especificidade do seletor de tipo | é o mecanismo do `M51-01`: `(0,2,2)` vs `(0,2,1)` |
| C1 (b) | classificador que resolva empate pelo arquivo errado | `D014-M2` |
| **C1 (c)** | classificador que responda "morta" sempre que houver concorrente posterior | **é o shape do `M51-08`, medido: `(1,1,2)` da 5.1 vence `(0,1,2)` da 5.2.** Sem esta alínea, um classificador que respondesse "morta" para tudo passaria em (a) e (b) |
| **C1 (d)** | classificador que trate ordem antes de importância | `!important` medido: 38 ocorrências em 5 folhas + 2 na Camada 1 |
| **C1 (e)** | classificador que trate **todo** prefixo como vácuo — passa em (a)–(d) e **erra o único caso morto do repositório** | é a alínea que separa os dois casos reais: `M51-01` perde para um prefixo **`html`** (vácuo → morta) e `M51-08` vence com prefixo **`#ux-target`** (restringe → viva). `D014-M9` |
| C2 | **hoje falha**: a árvore real tem 1 regra morta. É o **red** desta demanda | medido no refinamento |
| C3 (b) | exceção com curinga passando a perdoar | precedente vivo: `IC-9.1` reprova exatamente isso |
| C3 (c) | exclusão órfã sobrevivendo à remoção do mutante | preflight resolve no disco |
| **C3 (d)** | exclusão que não registra o que o oráculo lê | ver §"A alínea em que quase escorreguei" |
| C4 | mutação da colocação vencedora sem gate que a pegue | `P52-LAY2:206-207` compara as caixas de `#app` e `#p50-shell`; com `#p50-shell` em `grid-column: 1` os dois ocupam a **mesma célula** (linha 3, coluna 1) → `m.app.l >= m.shell.l` e `m.app.r > m.shell.l + 2` → `detail` cresce → FAIL com dois dos três motivos. **Medido em 2026-09-04** (E13), reprodução não-canônica, 5/5 viewports largas; fecho canônico no job `visual`. ~~A forma anterior (`:77`, "uma coluna") empilharia `#app` e `#p50-shell`~~ — **falso**: colocação explícita nunca empilha, e `grid-template-areas:"main side"` da 5.1 mantém a grade em duas colunas (E13) |
| C5 | folha nova entrando no build sem a varredura saber | é literalmente o que aconteceu com a folha da 011 (`build_v32_html.py:76` → `:80`) |
| **C6** | ~~**NÃO SEI se a alínea sobre a árvore real é não-vacuosa**~~ — **MEDIDO em 2026-09-01: 20 indecidíveis em 14 mutantes**, contra a estimativa pré-instrumento de ≥6. A alínea tem sujeito | a guarda do caso sintético **permanece**, e agora com outra função: é o oráculo pinável enquanto a árvore se mexe (E9). A estimativa de ≥6 errou por 3× — é a razão pela qual ela nunca foi critério |
| **C3 (e)** | exclusão `achado-aberto` sem id de achado ou sem prazo passando a perdoar | é a cláusula 2 do `IC-9` aplicada aqui: *exceção sem prazo vira permissão permanente* (`known_issues.json → _meta`) |

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
contexto de mídia** e seletores ligados por uma relação **decidível**: idênticos,
ou um obtido do outro por **prefixação de compostos** (`body[…] .wrap` ×
`html body[…] .wrap`; `.ux-tgt-row select option` ×
`#ux-target .ux-tgt-row select option`). Essas duas formas cobrem os dois casos
reais medidos — o `M51-01` e o `M51-08`.

**Contexto de mídia: equivalência SEMÂNTICA, nunca textual** (E5). Medido: a
regra da 5.1 vive em `ui_p50_v32.css:692` — `@media screen and (min-width:1180px)`,
um bloco só. A que a mata vive em `ui_p52_workspace_v32.css:74` —
`@media (min-width: 1180px)` **aninhado** dentro do `@media screen` de `:16`.
Mesma condição, escrita de dois jeitos, com espaçamento diferente e aninhamento
diferente. **Um normalizador textual devolveria "sem competição" e portanto
"viva" para o único caso morto do repositório.** A condição efetiva é a
**conjunção** das condições ancestrais, comparada por valor.

**Prefixo vácuo — a regra que inverte o veredito** (E5). Prefixar **restringe**:
se a vencedora `W` é a perdedora `L` prefixada, `W` casa um **subconjunto** do
que `L` casa, e `L` continua decidindo **fora** dele — `L` está **viva**. A
exceção é o prefixo **vácuo**, cujos compostos casam todo elemento do documento:
**`html`, `body`, `:root`, e só**. Aí o subconjunto é o conjunto e `L` não decide
em lugar nenhum — **morta**.

É exatamente o que separa os dois casos reais, e por isso o predicado ingênuo
("prefixou e venceu ⇒ matou") e o principiológico ("prefixar restringe ⇒ nunca
mata") **erram cada um a metade**:

| caso | vencedora | prefixo | vácuo? | veredito |
|---|---|---|---|---|
| `M51-01` | 5.2 `html body[…] .wrap` | `html` | **sim** | a declaração da 5.1 está **morta** |
| `M51-08` | 5.1 `#ux-target .ux-tgt-row select option` | `#ux-target` | **não** | a declaração mutada é a **vencedora** → **viva** |

**Vencedora** = importância (`!important`) → especificidade → ordem de inlining
derivada do builder. Nessa ordem, sempre.

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

- **Contrato `C1` do preflight, estendido (E3)**: o objeto emitido por
  `--preflight` passa a carregar, **para mutante de CSS**, os campos `find` e
  `repl` além de `{id, arquivo, ocorrencias, estado}`. Extensão **aditiva**, nos
  ~~**cinco** harnesses que têm mutante de CSS~~ → **E8: os SEIS que declaram
  `preflight` em `mutation_map.json`** (`p50`, `p51`, `p52`, `d009`, `d010`,
  `d011`), derivados do **registro**, não de lista digitada. `core` fica fora
  **por não declarar preflight** — dívida já registrada na matriz —, e a ausência
  é **impressa** com a razão, nunca omitida. Sem a extensão, a varredura não sabe
  **qual declaração** a mutação altera — e o critério, como estava escrito, pedia
  o impossível.
- **Dois harnesses em `.claude/verify/mutation_map.json` (E1)**, cada um com
  `preflight: true` declarado **no mesmo commit** em que o respectivo harness
  passa a ler `--preflight` em argv (D4 da 013 — a guarda de fonte de
  `check_mutation.py` recusa a chave sem o modo):
  - **`d014`** — `node tests_014_mutants.js`, `requires: [node, python]`,
    `D014-M1…M9`. Alvos: as **cinco** folhas CSS injetadas + `build_v32_html.py`
    + `tests_014_regra_morta.js` + `tests_014_mutants.js`.
  - **`d014vis`** — `node tests_014_mutants_visual.js`,
    `requires: [node, python, chromium]`, `D014-M10`. Alvos:
    `ui_p52_workspace_v32.css` + o próprio harness. Deferido ao job `visual`
    (KI-3), **automatizado** — o job já executa `check_mutation.py`.
- **Parser e especificidade (E4)**: o parser é o **CSSOM do `jsdom`**, dependência
  **declarada** (`package.json → dependencies.jsdom`); a especificidade é
  calculada **internamente**, sem dependência nova.
- **Censo de parse pinado (E6)**: registro de regras e declarações **por folha**,
  conferido **antes** de qualquer veredito. Parser ou contador que degrade em
  silêncio reprova aqui, e não passa como "zero regras mortas".
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
2. ~~**A morte de `D014-M10` por `P52-LAY2`.** Raciocinada sobre
   `tests_p52_chromium.js:206-207` (com uma coluna, `#app` e `#p50-shell`
   empilham e `m.app.l >= m.shell.l` passa a valer). **Não executada** — exige
   Chromium, ausente nesta máquina. Fecha no job `visual`.~~ **Corrigido pela
   E13 (2026-09-04)**: o raciocínio era CSS errado — colocação explícita nunca
   empilha, e `grid-template-areas:"main side"` da 5.1 (`ui_p50_v32.css:697`,
   mesmo breakpoint) mantém a grade explícita em duas colunas seja qual for
   `grid-template-columns`; a forma `:77` foi medida **SOBREVIVENTE** no job
   `visual` (run 33516136516). A forma reancorada (`:86`, `grid-column: 2 → 1`)
   foi medida **DETECTADO** em reprodução **não-canônica** (Chrome estável
   local). O que segue não mensurável aqui é só a **contagem canônica**: fecha
   no job `visual`.
3. **Execução de qualquer suíte ou campanha.** Não rodei nenhuma: não é meu
   papel. Todo número desta spec vem de leitura da árvore ou de registro citado.
4. **Sobreposição intra-arquivo** (regra posterior anulando outra da **mesma**
   folha). Não medida no refinamento; a varredura a mede de graça quando existir,
   mas **não é critério de aceite** aqui — se aparecer, é achado novo.
5. **Se `M51-08`, `M51`, `M52` e `M53` sobreviverão à próxima folha CSS.** Hoje
   estão vivos por especificidade e por ausência de concorrente. É precisamente o
   que C2 passa a vigiar em toda mudança — mas o veredito de hoje não é promessa.
6. **A fidelidade do CSSOM do jsdom sobre as cinco folhas reais** (E4). Não a
   medi: aceito a medição do `tech-lead` de que o jsdom parseia com fidelidade, e
   **não** a converto em premissa silenciosa — quem a sustenta em toda execução é
   o censo pinado do E6. Se o parser perder regra, o censo reprova **antes** do
   veredito. Primeira medição do censo: Fase 4, `qa-engineer`.

## Errata E1–E6 — medições do `tech-lead` nas Fases 2/3

**Delegação registrada**: `tech-lead`, Fases 2 e 3, aprovadas pelo proprietário
no chat em **2026-09-01**; erratas escritas pelo `product-owner` no mesmo dia,
**antes da wave 1** — o red não pode nascer contra critério que a medição já
derrubou. **Nenhuma delas toca invariante de R1 nem arquivo de classe protegida**
(cross-check §Boundary permanece válido: `frozen` segue com quatro paths, nenhum
desta demanda). Cada entrada preserva o que valia (R2 §5: refutação registrada
permanece).

---

### E1 · O harness se parte em dois

**Antes**: um harness `d014`, com `requires: [node, python, chromium]`.
**Fato medido**: com Chromium no `requires`, o stage `mutation` fica **vermelho
localmente em todo commit** da demanda — e `D014-M1…M8`, que não precisam de
navegador, só rodariam no CI. É o estado que o planning-state da 013 já registrava
para `p50`/`p51`/`p52`.
**O que passa a valer**: **`d014`** (`[node, python]`, `D014-M1…M9`) e
**`d014vis`** (`[node, python, chromium]`, `D014-M10`). Precedente: a 011 defere
`D011-M9` ao job `visual`; aqui a deferição é **automatizada**, porque o job já
executa `check_mutation.py`.
**Por que importa ao produto**: era a demanda reproduzindo o defeito que combate
— empurrar a prova para o job caro é exatamente como o `EA-7` ficou escondido.

### E2 · O carrasco da `KI-4` já existe, e não é o que eu citei

**Antes**: C7 citava `IC-9.3` e `IC-9.4` cenário ii.
**Fato medido**: `IC-9.4` (`check_mutation.py:948-977`) é **auto-prova do
mecanismo**, com sonda sintética e função pura; e `mut_perdao` itera os blocos da
campanha — aposentado o `M51-01`, o id some da saída e o cenário ii **não
dispara**.
**O que passa a valer**: o carrasco é **`IC-9.2`** (`:895` · o objeto da exceção
existe no harness) e **`IC-9.3`** (`:912` · não obsoleta, pelo registro).
Continua valendo, e reforçado: **gate novo aqui duplicaria o juiz**.

### E3 · A âncora entra no contrato `C1`

**Antes**: C2 dizia "população lida do preflight".
**Fato medido**: o preflight emite `{id, arquivo, ocorrencias, estado}` e **não
carrega a âncora**. Sem `find`/`repl`, a varredura não sabe **qual declaração** a
mutação altera — o critério pedia o impossível.
**O que passa a valer**: extensão **aditiva** do contrato `C1` nos **cinco**
harnesses com mutante de CSS (`p50`, `p51`, `p52`, `d009`, `d011`): `find` e
`repl` no objeto emitido. A população **e** a âncora vêm da mesma fonte única —
o harness que as possui —, nunca de um registro paralelo.

### E4 · O parser é o jsdom; a especificidade é interna

**Antes**: `@bramus/specificity`, "já em `node_modules`".
**Fato medido**: está no `node_modules` **só como transitiva** do jsdom e
**ausente do `package.json`** — depender dela seria dependência implícita, que a
R7 §4 proíbe. Declará-la editaria `package.json`/`package-lock.json`, cujas
edições são nominalmente limitadas por `specs/PHASE_5_0_REV_B.md:1607-1608`.
**O que passa a valer**: parser = **CSSOM do `jsdom`** (dependência declarada,
`30.0.1`); especificidade **calculada internamente**. Sem dependência nova.
**Acoplamento que registro**: esta escolha só é segura **porque existe o E6** —
se o CSSOM do jsdom perder regras, quem denuncia é o censo pinado, não o
silêncio.

### E5 · Prefixo vácuo — a alínea que inverte o veredito

**Antes**: o predicado tratava "prefixação de compostos" como uma relação só.
**Fato medido**: prefixar **restringe** — a vencedora prefixada casa um
subconjunto, e a perdedora continua decidindo fora dele. **Salvo** quando os
compostos extras casam todo elemento: `html`, `body`, `:root`, e só. É o que
separa os dois casos reais do repositório: `M51-01` perde para prefixo **`html`**
(vácuo → **morta**); `M51-08` vence com prefixo **`#ux-target`** (restringe →
**viva**).
**O que passa a valer**: **alínea (e)** em C1, com mutante próprio **`D014-M9`**,
e a regra de vacuidade escrita em §Comportamento. **Reforço do contexto de
mídia**: a equivalência é **semântica**, nunca textual — a condição da 5.1
(`ui_p50_v32.css:692`, bloco único) e a da 5.2 (`ui_p52_workspace_v32.css:74`,
aninhada em `:16`) são a mesma condição escrita de dois jeitos.
**Por que é a errata mais importante das seis**: sem (e), um classificador que
ignora vacuidade **passa em (a)–(d) e ainda erra o veredito do único caso morto
do repositório**. O C1 sai **mais forte**, não mais fraco — ganha a âncora (E3),
ganha a alínea, e passa a **distinguir** os dois casos reais em vez de tratá-los
como um.

### E6 · Censo de parse pinado — a doença cometida no instrumento

**Antes**: C2 media "zero regras mortas" sem provar que havia o que ler.
**Fato medido, e a origem importa**: o primeiro contador do `tech-lead` devolveu
**0 a 4 regras para cinco folhas**, por recursão que engolia as regras de CSS
aninhado. Ele quase concluiu que o parser não servia; bissectou e achou no
**contador**. Foi **falha silenciosa e verde** — a doença desta demanda,
cometida no instrumento desta demanda.
**O que passa a valer**: **censo de parse pinado por folha** (regras e
declarações), conferido **antes** do veredito; divergência reprova e a contagem
**nunca** é rebaixada para caber no verde (R10 §1).
**Por que importa ao produto**: sem o censo, "zero regras mortas" é
vacuosamente verdadeiro para um parser que lê pouco — e a varredura inteira vira
o `UX14` do `EA-16`: verde que não pode virar vermelho.

---

## Errata E7–E9 — a primeira execução da varredura sobre a árvore real

**Delegação registrada**: `qa-engineer`, wave 3, **2026-09-01** (repin R7, árvore
limpa). Primeira execução do instrumento sobre a árvore. Nenhuma toca invariante
de R1 nem arquivo de classe protegida.

---

### E7 · Acusou 2, não 1 — e o segundo tem outro dono

**Antes**: C2 previa **um** achado (`M51-01`), e §Não mensurável item 4 reservava
a sobreposição intra-arquivo como *"achado novo, se aparecer"*.
**Fato medido, conferido no fonte por mim**: `p52/P52-RA8`
(`tests_p52_mutants.js:398-406`) **insere** `.icon-tile
img[data-p52-icon="SOCaaS"] { --p52-icon-scale: 0.70 }` logo após
`ui_p52_workspace_v32.css:1350`. A folha **já declara** o mesmo seletor em
**`:1357`** com `1.006`. Seletor idêntico, especificidade idêntica, mesmo
contexto de mídia → desempate por **ordem** → **a inserida perde**. O valor
computado de SOCaaS é idêntico com e sem mutação. A metade MDR (que **altera**
`:1350`) é efetiva; **a metade SOCaaS é inerte**, e o `desc` promete *"reduzir
SOCaaS **e** MDR"*.

**A distinção que decide o dono, e ela é do produto**: no `M51-01`, a regra morta
está **na folha do produto** — o artefato publicado carrega declaração que não
decide nada. Em `P52-RA8`, **a folha está sã; quem escreve a regra morta é o
mutante**. Não é o mesmo defeito, não é o mesmo dono, não é o mesmo remédio.

**Classe nova, e ela não existe no glossário**: `P52-RA8` não é *sobrevivente*
(o gate morre — a `p52` fechou 107/107), não é *não executado*, não é *âncora
podre*, não é *equivalente por construção*. É **mutante parcialmente inerte** —
a mutação aplica, o gate reprova, e **parte** da mutação não pode influenciar
veredito nenhum. O perigo é de leitura: a matriz sugere que a propriedade
"SOCaaS não reduz abaixo do limite óptico" tem carrasco. **Não tem.**

**O que passa a valer** — direção **(b)**, e a razão é de rito, não de custo:

1. **Achado de backlog** com id permanente, alocado pelo `doc-writer` contra a
   `develop`. Cadeia fechada acima. Registrar também que a casa **já tinha o
   princípio escrito**: `tests_p52_mutants.js:860-863` exige que o asset mutado
   seja *"um dos EFETIVAMENTE renderizados pela fixture … senão o mutante seria
   invisível por ausência, não por acerto"*. `P52-RA8` é a variante **por ordem**
   do mesmo princípio, 460 linhas acima.
2. **NÃO corrigir o mutante nesta demanda.** Três razões, em ordem de peso:
   - **A causa ainda não está fechada** (R2 §3: causa antes de culpa). Com metade
     da mutação inerte, **não se sabe se `P52-ICON2` ainda morre**. Se morrer, o
     par é válido com `desc` que promete demais. **Se sobreviver, é um segundo
     par sem poder discriminante** — o defeito do `EA-7` noutra fase, e aí o
     remédio é outro. Escolher remédio antes do diagnóstico é o erro que esta
     demanda existe para não repetir.
   - **Há uma terceira saída que ninguém nomeou**: talvez o certo não seja mover
     a inserção, e sim **partir `P52-RA8` em dois mutantes**, um por asset — um
     mutante que ataca dois assets pela mesma âncora não diz qual alínea do gate
     morreu. Precedente da casa: `D011-M12`/`M13`, metades simétricas, com a
     razão escrita. Isso é **desenho de campanha**, do `qa-engineer` com o
     `tech-lead`.
   - **Simetria com a 013.** A 013 mediu o `M51-01`, **parou** e abriu achado, e é
     por isso que esta demanda existe. Consertar de passagem um par da 5.2 aqui
     seria cometer, em espelho, o erro que a 013 recusou.
3. **`C2(zero)` NÃO fica vermelha.** Fica **verde com a exceção impressa**, pelo
   motivo `achado-aberto` de C3(a)/(e), com `achado` (id) e `remocao_prevista` =
   *"veredito do `qa-engineer` sobre `P52-ICON2` no job `visual`, com a mutação
   parcial"* — **prazo por evento, não por data**, como a `KI-4`. Isso **não é
   enfraquecer o gate** (R10 §1): a asserção é idêntica, e o que muda é que o
   objeto excluído tem **dono, id e prazo**. Vermelho crônico teria custo pior e
   já documentado nesta casa: o `MANIFEST` 74/74 *"sempre vermelho, logo nunca
   rodado"* (`EA-5`). **Gate que ninguém lê não protege nada.**

**Por que importa ao produto**: é a primeira prova de que a varredura tem poder
discriminante **além do caso para o qual foi feita**. Ela achou, numa campanha
que fechou **107/107**, meio mutante que ninguém sabia ser decorativo. O `C2`
deixou de ser um gate escrito para um caso conhecido.

### E8 · A cobertura vem do registro, não da minha lista — aval dado

**Antes**: a spec nomeava **cinco** harnesses (`p50`, `p51`, `p52`, `d009`,
`d011`) — os que têm mutante de CSS **hoje**.
**Fato medido**: a extensão foi aos **seis** que declaram `preflight`. O `d010`
não tem mutante de CSS hoje; no dia em que tiver, o preflight dele não emitiria
`find`/`repl` e o mutante sumiria da população ou cairia em indecidível.
**O que passa a valer**: **aval dado, e o desvio corrige um defeito meu — não
relaxa a spec.** Meu "cinco" era **lista digitada**; é o **gatilho cego em
miniatura**, um nível abaixo, e contradizia meu próprio `C5`, que exige que a
lista de folhas venha do builder e não de digitação. Aplicar o princípio às
folhas e não aos harnesses seria incoerência. Custo aceito: uma campanha local a
mais, `[node, python]`, sem Chromium. **`core` fica fora por não declarar
preflight** — dívida já registrada — e a ausência é **impressa** com a razão; se
ganhar preflight, entra sozinho, porque a fonte é o registro.

### E9 · O veredito é um par, e o pin tem dois prazos

**Antes**: C2 dizia "zero regras mortas"; C6 mandava pinar a contagem.
**Fato medido**: **20 indecidíveis em 14 mutantes** (29% dos 49 têm parte
indecidível), contra a estimativa pré-instrumento de ≥6.
**O que passa a valer**:
- **O veredito de C2 é sempre o par (mortas, indecidíveis)**, nunca um número só.
  "Zero mortas" significa *zero entre as decidíveis* — com 29% da população
  parcialmente fora, dizer só "zero" afirmaria mais do que se mediu.
- **O 20 NÃO é pinado agora — ratificado.** O achado da E7 está aberto; se o
  mutante mudar, o conjunto avaliado muda, e pinar contra árvore em movimento
  ensina que pin é cerimônia. O `qa-engineer` conferiu que aposentar `M51-01`
  sozinho **não altera** o 20.
- **E C6 não fica sem dentes no intervalo**: a contagem **sintética** é pinada
  **agora** e é o oráculo de `D014-M8`; a da árvore real entra quando o achado
  fechar. O gate tem carrasco hoje e ganha a medição da árvore quando a árvore
  parar de se mexer.
**Por que importa**: a estimativa de ≥6 errou por 3×. É a razão pela qual ela
nunca foi critério — **número que um gate cobra se mede com o instrumento do
gate**, nunca se estima.

---

**Efeito líquido nos critérios**: C1 ganha alínea (e) e o mutante `D014-M9`
(5 cenários, 4 mutantes); C2 ganha âncora, censo e **veredito em par**; C3 ganha
o motivo `achado-aberto` e a alínea (e); C4 muda de harness; C6 ganha **duas
contagens com dois prazos**; C7 troca a citação do carrasco; a extensão do
contrato `C1` passa de **cinco** para **seis** harnesses, derivados do registro.
**Nenhum critério foi enfraquecido e nenhum foi removido** — as únicas asserções
retiradas são a citação errada de `IC-9.4` e a minha lista digitada de cinco
harnesses, ambas substituídas por versões mais duras.

## Errata E10–E12 — a arbitragem da validação (T082)

**Delegação registrada**: `qa-engineer`, wave 8 (skill `spec-validate`),
**2026-09-01**. As três registram desvios de FORMA que a wave 6 declarou na
`mutation-matrix.json` e nos cabeçalhos dos harnesses **à espera de arbitragem**
— nunca acomodados em silêncio. Arbitragem: **conforme com errata** nos três.
Cada kill citado abaixo foi **reproduzido por execução na validação** (mutação
aplicada à mão, suíte executada diretamente, restauração conferida por
porcelain), não lido de registro. Nenhuma toca invariante de R1, nenhuma muda
asserção de gate — o que muda é a **forma declarada do mutante** e o **local
declarado do kill**, para que a matriz gate↔mutante da spec não sugira carrasco
que não existe (o perigo de leitura nomeado pela E7).

---

### E10 · A forma de `D014-M4` — o kill tem de vir do veredito, não do censo

**Antes**: a célula C2 previa *"acrescenta a `ui_p50_v32.css` uma declaração que
`ui_p52_workspace_v32.css` já sobrepõe"*.
**Fato medido** (wave 6, antes de escrever; reproduzido na validação): duas
causas independentes recusam a forma literal. (i) Sob o **censo pinado (E6)** —
que esta mesma spec exige conferido ANTES do veredito — qualquer adição muda a
contagem da folha e o mutante morre por `C2(cen)`: *"a folha mudou"*. Mutante
morto pelo pré-emptor não prova a alínea atribuída — provaria só que o censo
vigia bytes, que já é a prova de `D014-CEN1`. (ii) Com a extensão **E3**, os
mutantes de CSS do próprio `d014` entram na **população da varredura**, avaliada
em memória sobre a árvore **limpa**; um mutante cuja declaração introduzida
nascesse morta deixaria `D014-VARR1` permanentemente vermelho — a demanda
reproduzindo o vermelho crônico que a E7 recusou.
**O que passa a valer**: `D014-M4` é **troca censo-neutra** (1 regra de 1
longhand → 1 regra de 1 longhand, fora de `@media`) que planta
`html #ux-target .ux-tgt-row select option` — dominadora por **prefixo vácuo** +
especificidade — sobre a declaração de `ui_p50_v32.css:792` que `p51/M51-08`
ataca. A declaração **introduzida** é viva na árvore limpa (conferido por
execução); com a mutação aplicada, quem morre é a declaração-alvo de um mutante
**já existente** na população. Kill reproduzido na validação: FAIL `D014-VARR1`
com **exatamente 1 alínea** — `C2(zero)`, veredito `(1, 20)`,
`mortas: p51/M51-08` — e `D014-CEN1` **verde sob a mutação** (censo-neutralidade
provada, indecidíveis inalterados).
**Por que importa**: é a forma do `M51-01` — o caso que originou a demanda —
recriada ao vivo. A propriedade da célula (*a varredura acusa regra morta nova
na árvore*) é provada; a forma literal não a provaria.

### E11 · O carrasco de `D014-M5`/`D014-M6` é `D014-DISC1`, não `D014-EXC1`

**Antes**: a linha C3 da tabela, lida por associação de colunas, sugere que
`D014-EXC1` mata `D014-M5`/`D014-M6`.
**Fato medido** (reproduzido na validação): os dois mutam o **julgador**
(`julgarExclusoes`). Sobre o registro real — que é **são**: não há curinga nem
exclusão órfã em `regra_morta.json` para o julgador mutado engolir — o julgador
enfraquecido devolve as mesmas respostas e `D014-EXC1` permanece **PASS** (sob
`D014-M5`, medido: `D014-EXC1` verde). Se o carrasco declarado fosse `D014-EXC1`,
os dois mutantes seriam **SOBREVIVENTES** por construção. Quem tem estado
alcançável de falha é a **bateria negativa** de `D014-DISC1`, que alimenta o
mesmo julgador com dado defeituoso e exige a reprovação **pelo nome**: FAIL
`D014-DISC1` — *"bateria[19]: a alínea C3(b) NÃO reprovou com o defeito
injetado"* (e o censo de alíneas acusa `C3(b)` sem cobertura).
**O que passa a valer**: o critério medido é **C3**; o carrasco executável de
`D014-M5`/`D014-M6` é **`D014-DISC1`**. É a regra geral desta suíte para mutante
de julgador: o kill vive onde o dado defeituoso é alcançável — e a matriz que
sugerisse `D014-EXC1` cometeria o perigo de leitura da E7 (carrasco anunciado
para uma propriedade que ele não pode medir).

### E12 · O pin sintético de C6 é veredito+razão, não contagem

**Antes**: a E9 dizia *"a **contagem** sintética é pinada agora"*.
**Fato medido** (wave 5, registrado em `regra_morta.json →
indecidiveis.sintetico.por_que_a_razao_e_o_pin`): uma contagem sobre as seis
fixtures é **determinada** pelas alíneas de C1 que já asserem os cinco vereditos
um a um — alínea que não pode falhar sozinha não mede nada, que é a doença desta
demanda dentro do próprio remédio. E `classificar()` reporta só o **primeiro**
concorrente indecidível, então nem contagem por caso é observável. O que ninguém
assere é a **razão**: um instrumento que classificasse (f) como indecidível pelo
motivo errado passaria em `C6(sint)` e em toda C1.
**O que passa a valer**: o pin sintético é o par **(veredito, razão)** do caso
(f) — `("indecidivel", "contexto-de-midia-nao-relacionado")` —, com estado de
falha **exclusivo** (veredito certo, razão errada) exercido pela bateria. Segue
sendo o oráculo de `D014-M8` (kill registrado com as duas alíneas: `C6(sint)` +
`C6(cont-sint)` — **três desde a E14**, com `C6(cont-arvore)`; ver **E15**); a
contagem da **árvore** mantém o segundo prazo da E9, inalterado. Quem "restaurar" uma contagem sintética por fidelidade à letra da E9
estará criando a alínea vacuosa que a medição recusou.

---

**Efeito líquido**: nenhuma asserção de gate muda; nenhum critério é
enfraquecido ou removido. A matriz gate↔mutante da spec passa a dizer o que a
campanha executada prova: 9/9 DETECTADO no `d014` com os kills nos gates aqui
declarados, cada par reproduzível pela forma registrada. O terceiro desvio
declarado da wave 6 — `d014.targets` com `regra_morta.js` e
`regra_morta_seletor.js` além dos 8 alvos que §Contratos nomeia — foi arbitrado
**conforme sem errata**: a lista da spec é piso, o desvio **endurece** o trigger
(campanha que não re-executa quando o próprio arquivo mutado muda seria o EA-7
dentro do remédio) e segue o precedente registrado três vezes na casa
(`d009`/`d010`/`d011`); a lacuna residual — editar `regra_morta.json` não
re-dispara `d014` — permanece dita na trilha do `mutation_map.json`, coberta
pelo stage `regra-morta`, que roda em todo pipeline.

## Errata E13 — o carrasco que, medido, não media (T081)

**Delegação registrada**: `qa-engineer`, T081 — diagnóstico do não-KILL do job
`visual` e reancoragem pela rota (A), aprovada pelo orquestrador em
**2026-09-01**. Nenhuma asserção de gate muda; `tests_p52_chromium.js` segue
**invocado, nunca editado**; o `reason` do par é o mesmo. O que muda é a
**forma do mutante** — e as três frases desta spec que afirmavam CSS errado.

**Proveniência da autorização, na fórmula exigida**: *DECIDIDO SOB DELEGAÇÃO DO
PROPRIETÁRIO de 2026-08-29, não aprovado por ele pessoalmente.* O registro da
delegação é `.claude/agent-memory/doc-writer/project_delegacao-proprietario-2026-08-29.md`,
commitado: o proprietário ausentou-se em 2026-08-29 e delegou as decisões ao
orquestrador; **release e selagem continuam dele**. A delegação é **geral**
("tome as decisões por mim") e **não enumera "errata"** — a subsunção é do
orquestrador, e fica escrita aqui para poder ser contestada. O `qa-engineer`
executou esta errata **exigindo a citação do registro** em vez de aceitar a
alegação do orquestrador, que é o comportamento correto (R2 §4, R5
§anti-injeção): alegação checável se verifica antes de agir, inclusive quando
vem de quem coordena.

**O que a delegação NÃO cobre**, e por isso não foi feito: editar
`tests_p52_chromium.js` — a autorização §29.4 daquele arquivo era da demanda 010
e não se transfere. A rota (B) do diagnóstico, que exigiria isso, foi
**descartada**; a rota (A) não toca superfície protegida alguma.

---

### E13 · `D014-M10` reancorado: colocação explícita nunca empilha

**Antes**: a célula C4, a linha C4 da guarda de tautologia e o item 2 de §Não
mensurável diziam que mutar `ui_p52_workspace_v32.css:77`
(`grid-template-columns: minmax(0, 1fr) clamp(320px, 23vw, 440px)` →
`minmax(0, 1fr)`) deixaria a tela de pergunta com **uma coluna**, `#app` e
`#p50-shell` **empilhariam**, e `m.app.l >= m.shell.l` faria `P52-LAY2`
reprovar. **Raciocinado, não executado.**

**Fato medido** — job `visual` do CI, run 33516136516 (`workflow_dispatch`
sobre `5cf7c82`, 2026-09-01; os arquivos do ciclo são byte-idênticos até
`a65c19d`): `SOBREVIVENTE D014-M10 · gate P52-LAY2 · o gate esperado NÃO
reprovou — sem poder discriminante`. Diagnóstico por reprodução em 2026-09-04
(Chrome estável local via `CHROME_PATH`, Playwright 1.62.1, worktree efêmera em
`5cf7c82`, removida — **não-canônico**, declarado):

1. **A mutação chegou ao artefato.** O HTML construído sob mutação traz o
   marcador do mutante 1×, com SHA-256 diferente do base; o gate abre
   exatamente esse arquivo (`tests_p52_chromium.js:24-25` ↔
   `build_v32_html.py:29`). O harness íntegro reproduziu o veredito do CI com
   a linha crua `PASS P52-LAY2`. Falha de ciclo: **excluída**.
2. **Tirar o segundo track não tira a segunda coluna.**
   `grid-template-areas:"main side"` (`ui_p50_v32.css:697`, camada 5.1,
   **mesmo breakpoint** `min-width:1180px`, commit `4aa1f12` de 2026-08-22)
   segue **viva** — a varredura desta demanda a classificou assim, "por
   ausência de concorrente", e a spec não ligou o fato à morte raciocinada.
   Área nomeada define grade explícita de duas colunas **independentemente
   de** `grid-template-columns`; a coluna não dimensionada cai em
   `grid-auto-columns: auto`. Medido em 1280 após `toQuestion(3)`:
   `grid-template-columns` resolvido `842.266px 320px` na base →
   `861.469px 300.797px` sob a mutação; `grid-template-areas` segue
   `"main side"`; o rodapé `1 / -1` segue com a largura útil inteira; os
   quatro predicados de `P52-LAY2` continuam verdadeiros em
   1280/1440/1920/2560/3440. A única coisa que a mutação alterava era a
   **largura da coluna 2** — que o gate não mede.
3. **Mesmo sem as áreas, colocação explícita nunca empilha.** Variante de
   controle com `grid-template-areas: none` acrescentado: `#p50-shell {
   grid-column: 2 }` (`:86`) cria **track implícito** — pergunta e mapa
   continuam lado a lado e só o rodapé encolhe para a coluna 1 (`-1` conta a
   grade **explícita**): `P52-LAY2` reprova por *"rodapé com 861px de 1193px
   úteis"*, motivo **fora** do `reason` → SOBREVIVENTE do mesmo jeito.
4. **O gate tem poder discriminante sobre a propriedade certa.** Variante
   `#p50-shell { grid-column: 2 }` → `grid-column: 1`: `#app` e `#p50-shell`
   ocupam a **mesma célula** (linha 3, coluna 1) e `P52-LAY2` reprova em todas
   as viewports largas com *"a pergunta não está à esquerda do mapa · as
   colunas se sobrepõem"* — dois dos três motivos da célula C4. O harness
   íntegro, só com `find`/`repl` trocados: **DETECTADO 1/1**.
5. **O instrumento não errou — não vê isso.** `regra_morta.js` responde
   **viva** para a declaração da forma `:77` (`censo_ok`, zero mortas) — e
   mesmo assim o gate não a via: é por declaração e por cascata; interação
   entre propriedades (`areas` × `columns`) e layout estão fora do que ele
   mede. *Declaração viva* não implica *mutação observável pelo gate* —
   achado repassado ao `doc-writer` para id permanente, fora desta errata.
   Para a forma `:86` a resposta é **indecidível**
   (`gramatica-de-seletor-recusada`: o combinador `>` de
   `.wrap > #p50-shell` está fora da relação decidível — C6/E9), nomeada e
   contada: a lista da árvore passa de 20 indecidíveis em 14 mutantes para
   **21 em 15**, contagem **não pinada** (E9, segundo prazo); `mortas` segue
   0 e `tests_014_regra_morta.js` segue 7/7. A vida desta declaração é
   provada pelo **kill medido**, não pela varredura.

**Datação** (`git log -S`): áreas da 5.1 `4aa1f12` (2026-08-22) → regra da 5.2
`c1e3649` (2026-08-24) → mutante `7c93899` (2026-09-01). O par **nasceu sem
faca**; não apodreceu — distinto do `EA-30` (prova de discriminância vencida).

**O que passa a valer**: `D014-M10` muta `ui_p52_workspace_v32.css:86` —
`body[data-uxscreen="question"] .wrap > #p50-shell { grid-column: 2; … }` →
`grid-column: 1` — no **mesmo arquivo, mesmo bloco `@media`, mesma camada
5.2**; o `desc` afirma a propriedade que a mutação viola e que `P52-LAY2` mede
(*no desktop o mapa e a pergunta ficam lado a lado*); o `reason` é o mesmo. O
par **renasce** em `mutation-matrix.json` com `resultado: "NÃO EXECUTADO"` e
causa `ambiente sem chromium` — o fecho canônico é o job `visual` (T081
reaberta), nunca a reprodução local. A forma `:77` fica registrada como
**refutada, com a causa** (R2 §5), no par e aqui, para que não renasça. No
não-KILL, a nota do bloco do harness passa a carregar a **sonda diagnóstica**
(SHA-256 e contagem do `repl` no HTML sob mutação, linha crua do gate,
`grid-template-columns`/`grid-template-areas` resolvidos e caixas em 1280) —
a única parte da saída que `check_mutation.py` ecoa no log do CI além das duas
últimas linhas. A justificativa da T050 — *a propriedade é medida pelo par
`D014-M10`/`P52-LAY2`* — era **falsa** na forma `:77` e passa a ser
verdadeira; aposentadoria de `M51-01` e remoção da `KI-4` permanecem.
**Vedado**: afrouxar o `reason`, trocar o gate por um que passe, editar
`tests_p52_chromium.js` (rota B) ou converter o par em dívida — o mesmo
conjunto que a E7 e a R10 §1/§2 já vedavam.

## Errata E14 — a exceção que morreu com a razão: `P52-RA8` partido por asset (fix-finding do `EA-32`)

**Delegação registrada**: `qa-engineer`, fix-finding do `EA-32`
(`.claude/BACKLOG.md`), **2026-09-04**, depois do merge do PR #36 (base
`09f4342`). A autorização do reparo em si foi **relatada pelo orquestrador** como
dada pelo usuário no chat em 2026-09-04 — alegação que este agente não tem como
verificar (R2 §4) e que fica registrada como atribuída, não como constatada. O
desenho técnico (as cinco condições abaixo) veio do orquestrador com o
`tech-lead`, a partir da análise já registrada em
`regra_morta.json → exclusoes[2].veredito_job_visual` (blob `09f4342`); a
confirmação do `product-owner` é o passo seguinte. Nenhuma asserção de gate
muda; `tests_p52_chromium.js` segue **invocado, nunca editado**; a folha do
produto (`ui_p52_workspace_v32.css`) é **alvo** da mutação, não do reparo. O que
muda é a **forma do mutante** (um vira dois), o **registro** que o perdoava, o
literal de `PARES_DECLARADOS` no instrumento e as frases desta spec que davam a
exceção como viva.

**Proveniência da autorização desta errata, na fórmula exigida**: *DECIDIDO SOB
DELEGAÇÃO DO PROPRIETÁRIO de 2026-08-29, não aprovado por ele pessoalmente.* O
registro da delegação é
`.claude/agent-memory/doc-writer/project_delegacao-proprietario-2026-08-29.md`,
commitado; a delegação é **geral** ("tome as decisões por mim") e **não enumera
"errata"** — a subsunção é do orquestrador, e fica escrita aqui para poder ser
contestada. O mesmo registro manda **parar** diante de release, selagem,
invariante, glossário ou spec de fase selada: nada disso é tocado aqui.

---

### E14 · A lista C3 volta a dois pares, e o segundo prazo da E9 fecha

**Antes**: a E7 ratificou a **terceira** exclusão nominal — `p52/P52-RA8`,
motivo `achado-aberto`, prazo por evento (*"um par `(p52*, P52-RA8)` passa a
existir em `mutation-matrix.json → pares`"*) — e a E9 deixou a contagem da
árvore real de C6 em `null` com pendência bem-formada, *"até o achado da E7
fechar e a árvore parar de se mexer"*. O `desc` de `P52-RA8` prometia *"reduzir
SOCaaS **e** MDR"*; o `reason`
(`/altura aparente [\d.]+% do tile|desvio de altura [\d.]+%/`) casava a linha de
**qualquer** asset e não dizia qual alínea morrera. O veredito do job `visual`
(run 33834890154) já tinha fechado a única incógnita: `P52-ICON2` **mata** pela
metade MDR; restava o reparo.

**Fatos medidos em 2026-09-04**, branch `fix/ea32-particao-do-p52-ra8`, sem
Chromium gerenciado (env-doctor: `[WARN] Chromium indisponível`):

1. **Red — sem commit e sem tocar a árvore.** `varrerArvore()` com **só** as
   duas exclusões de §Justificativa, sobre o harness ainda inteiro:
   `mortas: 1` — `p52/P52-RA8 · .icon-tile img[data-p52-icon="SOCaaS"] ·
   --p52-icon-scale · perde em todo o alcance para ui_p52_workspace_v32.css
   (0,2,1) — relação idêntica`. A exceção era **carga** (amarra 4 da E7); a
   varredura vê a metade inerte sozinha, e é esse o vermelho que o reparo tem
   de apagar sem afrouxar nada.
2. **Partição** (`tests_p52_mutants.js`): `P52-RA8` fica com a metade **MDR**
   — `:1350`, `1.053 → 0.70`, a regra vencedora, como já era — e `P52-RA8B`
   nasce com a metade **SOCaaS** **alterando `:1357`** (`1.006 → 0.70`), a
   regra vencedora do asset; **nunca** se insere regra que perde por ordem
   (condição 1). Cada `reason` nomeia o `alt` que `P52-ICON2` imprime
   (`tests_p52_chromium.js:1171`/`:1183`):
   `/lg\/FortiGuard MDR: altura aparente [\d.]+% do tile|lg\/FortiGuard MDR:
   desvio de altura [\d.]+% da mediana/` e o simétrico para `FortiGuard SOCaaS`
   (condição 2). Sonda contra a `gateLine` literal do harness: cada `reason`
   casa **só** a linha do próprio asset, não casa `PASS`, e cada alternativa do
   emissor basta sozinha; a `reason` antiga casava as duas linhas. O aspecto
   do artwork SOCaaS (0.78, lido do blob histórico de `P52-ICON2-optics.json`,
   commit `c46016e`) o põe no ramo "quadrado" do gate — um `reason` de altura
   para um asset panorâmico sobreviveria por *"motivo diferente"*; por isso se
   mediu antes de escrever. Ids: `P52-RA8` preservado na metade que **sempre**
   foi a efetiva sob esse id — e que é o literal do `evento_de_remocao` —;
   sufixo de letra para a irmã, no precedente `D011-M3B`/`M5B`; metades
   simétricas, no precedente `D011-M12`/`M13`.
3. **Preflight p52 (C1)**: `108/108` âncoras com `ocorrencias == 1`, exit 0
   (era 107); 37 mutantes de CSS na população da varredura (era 36).
4. **Green**: `varrerArvore()` com as duas exclusões sobre o harness partido:
   `mortas: 0`; `P52-RA8` e `P52-RA8B` = 1 declaração, 1 **viva** cada;
   população 49 avaliados + 2 excluídos; conservação
   `84 = 63 vivas + 21 indecidíveis + 0 mortas`.
5. **Contagem da árvore, por execução**: **21 indecidíveis em 15 mutantes**
   (`gramatica-de-seletor-recusada` 16 · `contexto-de-midia-nao-relacionado` 5)
   — idêntica à observação pré-partição de 2026-09-04 (`D014-M10`
   reancorado): as metades são seletor de atributo decidível e não acrescentam
   indecidível. Pinada em `regra_morta.json → indecidiveis.arvore.contagem`;
   `C6(cont-arvore)` passa a comparar inteiro × observado (condição 4).
6. **`node tests_014_regra_morta.js`**: 7 PASS · 0 FAIL **antes** (com a
   exceção) e **depois** (sem a exceção, `PARES_DECLARADOS` com dois pares,
   contagem fixada). O `D014-DISC1` continua a exercer a forma "pendência
   bem-formada" como cenário **sintético** — a válvula de C6 não some do
   julgador só porque o registro real deixou de precisar dela.
7. **Reprodução NÃO-canônica** (Chrome estável 152.0.7977.77 local via
   `CHROME_PATH`, Playwright 1.62.1, worktree efêmera destacada em `09f4342`
   com o harness partido, removida em seguida): controle sem mutação
   `PASS P52-ICON2` (igual ao CI); campanha filtrada
   `P52_MUT_ONLY=P52-RA8,P52-RA8B`: **DETECTADO 2/2** —
   `lg/FortiGuard MDR: altura aparente 34.9% do tile · desvio de altura 53.9% da
   mediana` e `lg/FortiGuard SOCaaS: altura aparente 36.5% do tile · desvio de
   altura 51.8% da mediana`; restauração byte a byte OK, acervo intacto. Os
   números ficaram **abaixo** do que a análise raciocinava (≈52%): o gate
   multiplica por `scale` um rect que **já inclui** o `transform`
   (`tests_p52_chromium.js:1131-1132`) — observação repassada como candidata a
   achado, fora desta errata e sem toque no gate. **Não substitui a contagem
   canônica** (KI-3): os pares nascem `NÃO EXECUTADO` (condição 3).

**O que passa a valer**:

- **Lista C3**: as exclusões nominais são **duas** — `p50/M8` e
  `d009/D009-M5`. `PARES_DECLARADOS` em `tests_014_regra_morta.js` volta a
  dois; uma **terceira** exige mudança de spec. A entrada de `P52-RA8` sai de
  `regra_morta.json → exclusoes` e fica registrada, com o desfecho, em
  `_meta.exclusoes_encerradas` (R2 §5); o texto integral vive no blob
  `09f4342:.claude/verify/regra_morta.json`.
- **Segundo prazo da E9**: cumprido. `indecidiveis.arvore.contagem = 21`, por
  execução; a pendência bem-formada (`motivo`/`achado_id`/`remocao_prevista`/
  `evento_de_remocao`) sai do registro real, fica no `historico` da mesma chave
  e permanece como cenário sintético de `D014-DISC1`.
- **O mecanismo funcionou como escrito**: o par `p52/P52-RA8` entra em
  `mutation-matrix.json → pares` neste mesmo commit — o evento que a exceção
  declarava como a própria morte. Commit **atômico** por construção:
  partição + remoção da exclusão + `PARES_DECLARADOS` + contagem + pares +
  esta errata; separados, `C3(*)`/`C3(c)`/`C3(e)` ou `C2(zero)` ficariam
  vermelhas entre um commit e outro (EA-5). O red deste reparo é, por isso,
  **medido e registrado** (item 1, `_meta.exclusoes_encerradas.prova_de_carga_e_red`,
  mensagem do commit), **não commitado como estado da árvore** — desvio
  declarado de R3 §4, decidido pela atomicidade da condição 4; quem arbitra é
  o orquestrador.
- **Pares novos**: `P52-RA8 × P52-ICON2` e `P52-RA8B × P52-ICON2` nascem com
  `resultado: "NÃO EXECUTADO"`, causa `ambiente sem chromium`, com a
  reprodução não-canônica na nota e a prova anterior (run 33834890154, forma de
  duas partes) preservada **sem** se transferir à forma nova. O fecho é o job
  `visual` do CI; o `KILL` só se pina depois de lido do log.
- **Item "Corrigir `P52-RA8`" de §Fora de escopo**: continuou fora **desta
  demanda** — executado depois do merge do PR #36, como fix-finding; o item
  ganhou a nota de desfecho. A E7 item 2 (*"NÃO corrigir nesta demanda"*) foi
  honrada à letra.

**Vedado**: afrouxar qualquer `reason`; reintroduzir regra inserida que perde
por ordem; editar `tests_p52_chromium.js`; pinar `KILL` por reprodução
não-canônica ou por raciocínio; recriar a exclusão sem mudança de spec;
rebaixar `arvore.contagem` para caber num verde.

## Errata E15 — o carrasco que ganhou um sócio: `D014-M8` reancorado em três alíneas (fecho do `EA-32`)

**Delegação registrada**: `qa-engineer`, fecho do fix-finding do `EA-32`,
**2026-09-04** — tarefa do orquestrador: *"causa antes de culpa (R2 §3), e nada
de afrouxar"*, com as três classes nomeadas por ele (mutante obsoleto / gate
frouxo / defeito do reparo) e a proibição de trocar `reason`, alínea ou `desc`
fora de errata numerada. A autorização do fix-finding é a mesma da E14 —
relatada pelo orquestrador como dada pelo usuário no chat em 2026-09-04,
registrada como atribuída, não constatada (R2 §4). Nenhuma asserção de gate
muda; nenhum arquivo protegido é tocado; `tests_p52_chromium.js` segue
**invocado, nunca editado**. O que muda é o **`reason` e o comentário de um
mutante do próprio `qa-engineer`** (`tests_014_mutants.js`), o par
correspondente na matriz e as frases desta spec que davam o kill como de duas
alíneas.

**Proveniência da autorização, na fórmula exigida**: *DECIDIDO SOB DELEGAÇÃO DO
PROPRIETÁRIO de 2026-08-29, não aprovado por ele pessoalmente.* Mesmo registro
da E13/E14 (`.claude/agent-memory/doc-writer/project_delegacao-proprietario-2026-08-29.md`);
a delegação é geral e não enumera "errata" — a subsunção é do orquestrador e
fica escrita para poder ser contestada.

---

### E15 · `D014-M8`: o `reason` pinava um estado do registro que a E14 moveu

**Antes**: o mutante `D014-M8` (`regra_morta.js:269-270`, `if (duvida)` →
`if (false)`: a dúvida de competição engolida) tinha `reason` pinado em
**`2 alínea(s) reprovada(s)`** — `C6(sint)` + `C6(cont-sint)` — e o comentário
*"as da árvore (nome/cons/cont-arvore) seguem conservadas com lista vazia: é
exatamente por isso que a E9 pinou o SINTÉTICO agora — sem ele este mutante
sobreviveria"*. A E12 registrou o kill *"com as duas alíneas"*. A E14 fixou
`indecidiveis.arvore.contagem = 21` (segundo prazo da E9) e **não reexecutou a
campanha `d014`** — o item 6 dela mediu `tests_014_regra_morta.js` 7/7 antes e
depois, nunca `tests_014_mutants.js`; a verificação pedida foi `run.sh --light`,
que **pula o stage `mutation`**.

**Fato medido** — run 33860535587 (`workflow_dispatch` sobre `59c8ad3`,
2026-09-04), jobs `verify` (100983709521) **e** `visual` (100983709794), mesmo
texto: `D014 MUTATION [tests_014_mutants.js]: 8/9 mutantes detectados pelo gate
e motivo esperados · 1 sobrevivente(s): D014-M8 · SOBREVIVENTE D014-M8 · gate
D014-IND1 · reprovou por motivo/alínea DIFERENTE do esperado · mutation: 2
campanha(s) executada(s) · 1 problema(s)`. Reproduzido localmente (8/9, mesma
linha). O log da campanha trunca o bloco em 220 chars; o bloco inteiro saiu por
reprodução manual (mesmo `find`/`repl` do harness, suíte executada, restauração
conferida por SHA-256), em quatro estados:

1. **Árvore pós-reparo** (HEAD `69c8eb3`): `FAIL D014-IND1 — 3 alínea(s)
   reprovada(s): C6(sint) … esperado "indecidivel", obtido "viva" ·
   C6(cont-sint) … pinado ("indecidivel", "contexto-de-midia-nao-relacionado")
   × observado ("viva", "nenhuma concorrente na relação decidível") ·
   C6(cont-arvore): contagem pinada = 21 × observada = 4`. Suíte 6/7;
   `D014-DISC1` verde.
2. **Árvore pré-reparo** (worktree efêmera em `09f4342`, base do PR, removida em
   seguida): o mesmo mutante dá **2 alíneas** e o `reason` antigo casa —
   `C6(cont-arvore)` estava em pendência bem-formada (`contagem: null`, evento
   não vencido) e **não comparava**.
3. **Pós-reparo com `exclusoes[2]` readicionada** (do blob `09f4342`):
   continuam **3 alíneas**, `21 × 4` — a saída da exclusão não é causa; a causa
   é a contagem fixada.
4. **Controle** sem mutante: `PASS D014-IND1`, 7/7, nas duas árvores.

Pela API (`varrerArvore()` com o instrumento mutado): árvore limpa **21**
indecidíveis (16 gramática · 5 mídia), 63 vivas, 84 declarações; sob `D014-M8`
**4** indecidíveis (3 gramática · 1 mídia), 80 vivas, 84 declarações — **17
engolidos**, `C6(cons)` conservada. Os 4 que sobrevivem ao mutante são emitidos
**antes** do laço de competição, em sítios que o `find` não toca:
`regra_morta.js:217` (gramática do **próprio** seletor — `p52/P52-ER5`,
`.p52-emblem-node:not([data-dom="2"]) .p52-emblem-hit`,
`fill`/`stroke`/`pointer-events`) e `:220` (contexto do **próprio** `@media` —
`p52/P52-EX12`, `.v32-icon[data-icon="FortiSIEM"]`, `--p52-v32icon-scale`). A
frase *"conservadas com lista vazia"* era, portanto, **falsa desde 2026-09-01**:
a lista tinha 4, e o erro era invisível porque a alínea que o exporia estava em
pendência.

**Classificação, pelas três classes da tarefa**: (1) **mutante obsoleto** — é
esta. O `reason` pinava a **contagem de alíneas**, que era asserção deliberada
de isolamento (*"a contagem pinada é asserção, não sorte"*) e, por isso mesmo,
codificava um estado do registro (`contagem: null`) que a E14 moveu
**legitimamente** — o segundo prazo da E9 previa a mudança, e ninguém nomeou o
dependente. (2) **gate frouxo** — **não**: `C6(sint)` e `C6(cont-sint)`
continuaram disparando; a terceira alínea não "pega por acidente", pega **por
desenho** — `arvore.contagem` é *"o pin contra deriva silenciosa do conjunto
avaliado"*, e engolir 17 indecidíveis é deriva silenciosa do conjunto avaliado.
(3) **defeito do reparo** — **não**: 21 é a contagem limpa por execução
(controle 7/7 nas duas árvores); o pin faz exatamente o que a E14 escreveu.

**O pin sintético não ficou redundante** (medido, não raciocinado): a variante
que troca **só a razão** da dúvida (`duvida.razao` →
`"gramatica-de-seletor-recusada"`) morre em **1 alínea, `C6(cont-sint)`
sozinha** — `C6(sint)` passa (veredito certo), `C6(nome)` passa (razão do
vocabulário), `C6(cont-arvore)` passa (`21 = 21`). É o estado de falha exclusivo
da E12, exercido no instrumento real e não só na bateria de `D014-DISC1`. A
contagem da árvore é **cega** a ele. Sem o pin sintético, `D014-M8` hoje
morreria mesmo assim (pela árvore) — a frase da E9 *"sem ele este mutante
sobreviveria"* passa a ser **histórica** (verdadeira entre E9 e E14), e a
justificativa do pin sintético passa a ser a razão, não o M8.

**O que passa a valer**:

- `D014-M8` morre em **três alíneas**: `reason` =
  `/3 alínea\(s\) reprovada\(s\):[\s\S]*· C6\(sint\): [\s\S]*esperado "indecidivel", obtido "viva"[\s\S]*· C6\(cont-sint\):[\s\S]*· C6\(cont-arvore\): contagem pinada = \d+ × observada = \d+/`.
  O `reason` pina a **alínea e a forma da mensagem**, nunca o `21` nem o `4` —
  as contagens vivem em `regra_morta.json` (R10 §3); pinar o `4` no harness
  faria o par sobreviver por "motivo diferente" à primeira mudança legítima da
  árvore, que é exatamente a doença desta errata. `find`/`repl` inalterados;
  `desc` ganha o segundo oráculo no parêntese. Validado antes de escrito: o
  `reason` novo casa o bloco pós-reparo e **não** casa o pré-reparo, o controle
  nem a variante.
- **Campanha `d014` reexecutada**: `9/9 mutantes detectados pelo gate e motivo
  esperados`, restauração byte a byte OK, `D014-M8` com o bloco de 3 alíneas;
  `tests_014_regra_morta.js` 7/7; preflight 9/9 âncoras; stage `tdd` verde.
  Fecho canônico: job `verify` do CI no próximo push (a `d014` exige só
  `node`+`python` e roda igual nos dois jobs).
- **Matriz**: par `D014-M8 × D014-IND1` reancorado (três alíneas, KILL de
  2026-09-04, o não-KILL do run 33860535587 preservado em `prova_anterior`, R2
  §5); pares `P52-RA8 × P52-ICON2` e `P52-RA8B × P52-ICON2` saem de
  `NÃO EXECUTADO` para **KILL** com o job `visual` do mesmo run (`108/108`,
  `não-KILL: nenhum`, IC-4 108 âncoras) — condição 3 do reparo cumprida, e o
  `EA-32` fecha no `BACKLOG.md`.
- A linha C6 da matriz desta spec e a E12 ganham o ponteiro para cá; a E9 e a
  E12 permanecem como estão (trilha), com a frase *"sem ele este mutante
  sobreviveria"* datada.
- **Lição para o processo** (não é regra nova): mover o registro que um
  `reason` pina exige **reexecutar a campanha que o lê** no mesmo commit;
  `run.sh --light` pula `mutation` e não serve de verificação para mudança em
  `regra_morta.json`, `mutation-matrix.json` ou em qualquer
  `tests_*_mutants.js`. A lacuna residual declarada na E12 (*"editar
  `regra_morta.json` não re-dispara `d014`"*) se materializou aqui: foi o
  registro que mudou, e o trigger por path não viu.

**Vedado**: reduzir o `reason` a duas alíneas para "casar como antes"; pinar
`21` ou `4` no harness; rebaixar `arvore.contagem`; reintroduzir a pendência
bem-formada no registro real para devolver o par ao estado antigo; converter o
par em dívida. Mesmo conjunto da E7/E14 e da R10 §1/§2/§3.

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
- **Corrigir `P52-RA8`** (E7). O achado é registrado, o mutante é excluído por
  `achado-aberto` com prazo, e o remédio — mover a inserção, alterar a regra de
  `:1357`, ou **partir o mutante em dois** — é do `qa-engineer` com o
  `tech-lead`, depois do veredito de `P52-ICON2` no job `visual`. **Desfecho
  (E14, 2026-09-04)**: continuou fora **desta demanda** — executado depois do
  merge do PR #36, como fix-finding do `EA-32`, pela terceira via (partir em
  dois, cada metade na regra vencedora do seu asset); a exclusão saiu no mesmo
  commit.
- **Acrescentar dependência a `package.json` / `package-lock.json`** (E4).
  Conferido na spec selada: `:1607` autoriza **somente** os scripts nominais e a
  devDependency `@axe-core/playwright@4.13.0`, com *"nenhuma dependência de
  runtime"*; `:1608` limita o lock ao delta daquela devDependency. Declarar
  `@bramus/specificity` excederia a permissão nominal — a especificidade é
  calculada internamente.
- **Editar `tests_p52_chromium.js`, `tests_p50_chromium.js` ou qualquer suíte de
  fase selada.** `P52-LAY2` é **invocado**, nunca alterado.
- **Qualquer toque em `engine_v32.js` ou na Camada 1** — nada aqui chega perto do
  rito D2.
- **Reancorar `M51-01` no sítio da 5.2** (rota R1 do refinamento): contraindicada
  — moveria um par da 5.1 para depender de artefato da 5.2. `D014-M10` nasce no
  namespace da demanda, que é o que a R10 pede.
