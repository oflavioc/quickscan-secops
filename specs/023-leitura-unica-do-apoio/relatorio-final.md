# Relatório final — 023-leitura-unica-do-apoio

> Fase 6 · donos: qa-engineer + product-owner · encerra a demanda.
> Consome o [refinamento](refinement.md), a [spec](spec.md) com as erratas
> `E1`–`E4`, o [plano](plan.md), as [tarefas](tasks.md) e a
> [conformidade](spec-validate.md).

## O que foi entregue

A leitura congelada da Camada 1 some quando **existe substituto publicado**, e
volta quando ele deixa de existir — inclusive quando é o operador que o remove.

Duas expressões em `ui_v32.js`, sob a autorização nominal `§29.4` de 2026-10-01:

```
substituto = (capability com card e payload)
             OU (produto publicado  E  gate de suficiência ABERTO)
```

…e o ramo **legado** de `renderBlocks()` deixou de passar a constante `false`.

## A demanda mudou de alvo no meio, e a razão foi medida

O refinamento mediu três rotas e todas custavam invariante. A spec propôs a
quarta — contar o produto publicado — e ela funcionava **no mundo errado**.

**A Fase 4 mediu que "sem contexto declarado" são dois mundos:**

| o que foi declarado | `isLegacyModeV32` | substituto (antes) | ocultos | cards |
|---|---|---|---|---|
| **nada** | **`true`** | false | 0 | 11 |
| só `saasAllowed=yes` | `false` | false | 0 | 11 |
| capability `NONE` | `false` | true | 3 | 11 |

Sessão em que **nada** foi declarado é modo legado, e ali `renderBlocks` chama
`hideLegacyRecommendation(app, false)` **incondicionalmente**: o predicado nem é
consultado. O proprietário confirmou em 2026-10-02 que a sessão real do relato
não usou o editor de contexto — **a spec aprovada não corrigiria o caso
relatado**. Posta a escolha entre entregar o mundo vizinho, estender a arbitragem
ao modo legado, ou fazer a visão por produto desaparecer nele, a decisão foi a
segunda (errata `E1`).

**A cláusula revogada já era parcialmente falsa**, e isso foi o que a tornou
revogável sem perda: *"em modo legado a V3.2 não governa"* descrevia o produto
antes do `EA-65`/`EA-68`. Medido, a visão por produto renderiza os 11 cards lá, e
`published()` é **idêntico nos dois modos** (4/4, 4/4, 6/6, 5/5, 7/7 nas cinco
fixtures da 010). O que ficou proibido, e o `D023-LEG1 (c)` passou a medir, é a
V3.2 governar **qualquer outra coisa** em modo legado.

## O que as máquinas acharam que eu não tinha visto

Esta é a parte que vale guardar. Em cada caso o portão estava certo.

**1 · O `D010-ARB3 (c)` exigiu a errata `E4`.** Ele reprovou comparando um
conjunto visível **vazio** contra os três nós da linha de base. A causa: a visão
por produto publica **5 itens sob gate de suficiência fechado**, e sem cláusula a
congelada saía da tela por causa de uma leitura que o próprio produto declara
não-publicável. A cláusula é a INV-3 pelo lado da apresentação — e foi ela que
**devolveu sujeito** ao `D010-ARB1`.

**2 · O `D015` caiu 0 PASS · 5 FAIL por uma raiz só** — a fixture `E2`, cuja razão
de ser é *"Camada 1 visível e `#v32prio` presente ao mesmo tempo"*, perdia essa
propriedade. Quatro fixtures ganharam supressão de curadoria; a `E1` **não**,
porque não oferta nada e o guarda de não-vacuidade a recusou: *"nada ofertado pelo
motor — a supressão ficaria sem sujeito"*. A razão ficou escrita nela.

**3 · O `D023-M2` sobreviveu e refutou uma afirmação minha.** Eu havia escrito na
errata `E3` e no cabeçalho da suíte que sem a `fronteira()` os cards seriam
ocultados junto com a lista. Três renders, duas fixtures, seis medições:
`cards=11 ocultos=0` em todas. O decorador os **repõe** depois da varredura. O que
a fronteira protege é o **censo**, que é oráculo da demanda 019 — e é lá que o
mutante morre. A errata foi corrigida; o ataque não mudou.

**4 · O `D019-M18` sobreviveu depois da minha própria emenda.** Os dois controles
que eu escrevi não separavam as metades da conjunção `arbitrando && cards.length`:
no controle de supressão `cards.length` é zero, então a guarda de contagem
sozinha escondia o defeito. O estado que separa as duas é o do gate de
suficiência **fechado** (`cards=1`, `ocultos=0`) — que existe **por causa da
errata `E4`**. Uma errata nascida de um gate reprovando na W1 deu o controle que
faltava a um gate de outra demanda na W3.

**5 · O `ui31` estava vermelho desde a W1 e eu não vi, porque li a saída pelo
`tail`.** Os gates `U1` e `U7` da suíte M3.1 (fase 4.x) exigiam *"apoio legado
visível"* em modo legado, **incondicionalmente** — a cláusula que a `E1` revogou.
Relatei a W2 como *"todas verdes menos `p50core`"*, e o `ui31` estava na **linha
3** da saída que eu truncara. Terceira vez nesta sessão que `tail` esconde um
estágio que falhou. As duas asserções foram emendadas para medir a regra nas
**duas** direções — oculto com substituto, visível sem ele —, o que é mais forte
do que a redação original, e o quinto oráculo entrou na conta.

**6 · A campanha `p52` tinha 16 não-KILL, e TRÊS eram meus.** O controle em
worktree limpa de `origin/develop` devolveu 13; os três de diferença — `P52-M8`,
`P52-RA8`, `P52-RA8B` — foram de **3/3 DETECTADO** no controle a **0/3** no
branch. Em modo legado sob arbitragem o catálogo de ícones vai de 9 para 29
tiles, 20 ocultos, e os ocultos vêm primeiro: a deduplicação por `alt|tamanho`
tomava a chave com um nó de retângulo zero, e dois gates de fase 5.2 passaram a
medir o invisível.

Rota **C**: a guarda de tile não desenhado entrou nos dois gates — fortalecimento,
porque eles prometem medir o que o navegador desenha — e a causa virou **`EA-81`**.
Sem o controle de árvore inteira eu teria chamado os 16 de pré-existentes e aberto
o PR com três mutantes mortos pela minha mudança.

E o mesmo controle, aplicado à **suíte** `p52chromium`, achou outros dois:
`P52-ICON3` (que obtinha "lista congelada na tela" não declarando contexto — o que
deixou de bastar) e `P52-REC1g` (que media faixa e coluna de nós `display:none`).
Controle 51/5, branch 49/7, branch depois das emendas **51/5 — igualdade com o
controle**, com as cinco remanescentes sendo `poppler-utils` ausente.

**O preço da rota B não apareceu no produto; apareceu nos oráculos.** Seis suítes,
dez gates. A errata `E1` previu duas suítes, e a conta subiu em toda wave — porque
cada um deles codificava, à sua maneira, a proposição *"a leitura congelada está
visível quando o contexto não foi declarado"*: verdadeira por anos, falsa desde
esta demanda.

**7 · O `tdd` recusou prosa no `red.commit`.** Pus `"b4e3fd4 (1a prova) + o commit
desta errata"` num campo que uma máquina resolve. Quarta vez nesta sessão que um
campo de vocabulário fechado cobra.

## O que esta demanda NÃO resolveu, e está registrado

**`EA-80` — a supressão da curadoria deixa a seção com o título e nada embaixo.**
O decorador da 019 consome os `.apoio-block` congelados **incondicionalmente**;
com zero cards publicados, nada os substitui. **Pré-existente**, conferido no
build anterior a esta demanda. A 023 não causou — tornou load-bearing, porque
agora é a visibilidade da Camada 1 o que a arbitragem devolve quando o substituto
é suprimido, e o que ela devolve está vazio. A `C1` da 010 fica cumprida na letra
e falha no que queria dizer.

É também o motivo pelo qual o `D010-ARB1` foi reancorado na `D010-F3` e **não** na
fixture de supressão: a alínea `(c)` dele mede blocos contíguos visíveis, e sob
supressão não existe nenhum.

**`EA-76`** (derivação em duas cópias) e **`EA-77`** (dono errado no registro de
bridges) seguem abertos. Esta demanda **lê** `published()` em vez de criar uma
terceira cópia — não agrava o `EA-76`, e não o resolve.

## Aceite de intenção — `product-owner`

A necessidade do refinamento era: *"a seção apresenta o mesmo conjunto duas vezes
e nada diz que são a mesma coisa"*. Entregue: **uma** leitura, e os dois mundos em
que o defeito aparecia estão cobertos, com o do relato medido nominalmente.

A pergunta que o refinamento deixou aberta — *"esta demanda pode concluir que
nenhuma rota vale o preço"* — foi respondida com **quatro** oráculos alheios
emendados e nenhum enfraquecido. Cada emenda tem ratificação nominal do
proprietário, errata escrita na spec da demanda de origem, e um mutante que a
mata.

**Não encontrei objeção.** O aceite de fase é do proprietário, no chat (R4).

## Verificação

```
run.sh (leve)            14 PASS · 0 FAIL
compliance-audit.sh      17 PASS · 0 FAIL · 0 WARN
d023 LEITURA ÚNICA        9 PASS · 0 FAIL de 9
d023 MUTATION            12 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO
7 campanhas jsdom        d023 12/12 · d010 23/24 (KI-5) · d015 15/15 ·
                         d019 17/17 · d009 19/19 · d021 8/8 · d022 13/13 · core 3/3
```

Contagens por suíte, campanhas das outras demandas e o que **não** foi executado
com a causa declarada: [spec-validate.md](spec-validate.md).

## Trilha de commits

| commit | o quê |
|---|---|
| `b4e3fd4` | red — 9 gates, 1 vermelho, três achados de Fase 4 |
| `ac297bc` | planning-state — tarefas aprovadas, red provado |
| `a92d9ea` | errata `E1` — o modo legado entra no escopo, red reprovado |
| `7e75cce` | W1 — as duas expressões, errata `E4`, quatro oráculos emendados |
| `a6ffcb2` | W2 — campanha 12/12, e a correção da `E3` |
| `8b77dae` | W3 — repin `§29.4`, terceiro controle do `D019-CTX1 (c)` |
| `95efe33` | W3 — `gen_pins`, 515 arquivos |
