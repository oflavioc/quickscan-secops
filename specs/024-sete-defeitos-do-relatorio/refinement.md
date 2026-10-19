# Refinamento — 024-sete-defeitos-do-relatorio

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.
>
> **O slug é histórico.** A reconfirmação da §0 reduziu os sete a **dois**, e
> nenhum dos dois é defeito no relatório entregue. O nome da pasta e do branch
> não são renomeados (ids e caminhos não renumeram, R12); o que vale é o escopo
> desta página.
>
> **Instrumento desta Fase 0**: leitura de fonte, sem execução. O agente não
> tinha Bash. Tudo o que não pôde ser medido está na §O que não pude medir —
> e nenhuma afirmação de "verde" é feita aqui.

## 0 · Reconfirmação dos sete — o que sobrou

Regra aplicada: `fix-finding` §1 — **achado que não reproduz se risca, não se
corrige**. Cada veredito abaixo foi conferido **contra o código de hoje** desta
worktree (`feature/024-sete-defeitos-do-relatorio`, de `origin/develop`), e
confirmado também no artefato construído `quickscan_secops_soccmm_v3_2_dev.html`
quando havia o que confirmar lá — porque é o artefato, não o módulo, que o
cliente recebe.

| achado | veredito | onde isso foi conferido |
|---|---|---|
| `EA-69` rótulos sem acrônimo | **NÃO reproduz** — corrigido | `ui_p52_workspace_v32.js:204-217`: sete entradas novas em `P52_COPY`, com `(SIEM)` em `:204-205` e `(NDR)` em `:208-209`; razão e limite da regra em `:177-203`, com ratificação nominal do proprietário de 2026-09-27. No artefato: `:12211`. Papel coberto pelo mesmo mapa (`:3316-3318`, `beforeprint` → `p52Copy(#v32-print-report)`) |
| `EA-73` apoio decora card de prioridade | **NÃO reproduz** — corrigido | `p52SupportHints` e `p52ValidationIndex` **não existem mais**: a varredura por `p52SupportHints` em `*.js` devolve só comentário e backlog. Registro da reversão em `ui_p52_workspace_v32.js:3029-3038`. No artefato: `:15035` |
| `EA-74` contador promete a sessão e mede a seção | **NÃO reproduz** — corrigido nas **duas** metades | o rótulo lê o censo da **sessão** (`:2297-2300` → `p52CensoSessao`, `:274-283`, que consome `data-qs-censo-*` publicado por `ui_v32.js` — quem calcula publica, quem apresenta lê); e a seção de gaps **nomeia o que não mostra** (`p52GapsForaDaSecao`, `:3010-3027`). No artefato: `:14303` |
| `EA-75` produto duplicado, alavancagem some | **NÃO reproduz** — resolvido em **forma emendada** | demanda 022, errata `E2` (`specs/022-escalonamento-do-investimento/spec.md:85-117`), ratificada no chat (*"Vamos de B"*): a visão **por produto** passou a receber o habilitado por sinal declarado, com capabilities e sinais **unidos** e chave pelo nome exibido — `ui_p52_support_v32.js:272-330`; gate `D022-PROD1` em `tests_022_escalonamento.js:369-387`. A reindexação da leitura por capability foi **recusada com custo medido** (55 asserções em 5 suítes) |
| `EA-79` duas leituras sem dizer que são a mesma | **NÃO reproduz** — resolvido pela 023 | a suspeita trazida ao refinamento está **confirmada**: `ui_v32.js:264` passa `hasSubstituteV32(null)` no ramo legado, e o predicado (`:746-758`) consulta `temProdutoPublicadoV32()` (`:729-745`). Vivo no artefato: `:6308`, `:6773`, `:6801`. A rota executada foi a **B/quarta** da 023, não a "linha explicativa" que o encaminhamento do achado anunciava |
| `EA-80` supressão deixa título sem conteúdo | **REPRODUZ** | `ui_p52_support_v32.js:738-739` remove **todos** os `legados` sem guarda; `cards` pode ser 0 (`:732-733`, `decisaoDe` → `exclude` para todos) e a remoção acontece igual. Declarado como não resolvido pela própria 023 (`specs/023-leitura-unica-do-apoio/relatorio-final.md:120-132`) |
| `EA-81` catálogo duplicado e oculto | **REPRODUZ** | `blocosLegados()` (`:206-211`) recusa nó oculto — `!oculto(todos[i])`; com a errata `E1` da 023 a arbitragem passa a ocultar a região congelada em modo legado, logo nada é consumido e a cópia congelada permanece. Vivo no artefato: `:16196` |

**Sobraram dois de sete.** Cinco não são trabalho de produto: são **correção de
registro** (§Decisões, D2).

E a reconfirmação achou mais do que linha de status desatualizada — achou
**registro que promete e ninguém escreveu**:

1. **`design-decisions.md` não tem a entrada do `EA-73`.** O comentário em
   `ui_p52_workspace_v32.js:3038` afirma *"Reverte metade do EA-55; registrado em
   .claude/rules/design-decisions.md"*. Li o arquivo inteiro: **não há** entrada
   sobre `EA-55`/`EA-73`/`p52SupportHints`. A R13 existe para que decisão
   revertida não volte como achado; aqui a reversão está só no comentário do
   módulo.
2. **`design-decisions.md:15` descreve um mundo que a 023 substituiu.** A emenda
   de 2026-10-01 diz *"a demanda nova a executa"* e descreve a rota C (linha
   explicativa). Quem executou foi a 023, pela **quarta** rota, e a entrada não
   registra o fecho.
3. **Comentário vivo contradizendo o código.** `ui_p52_workspace_v32.js:1072`
   ainda afirma *"O ponteiro FICA nos `.prio-decl`"* — o ponteiro saiu em
   2026-09-27 (`:3029`). É prosa, não comportamento; mas é a prosa que o próximo
   leitor vai acreditar.
4. **A fila do `EA-58` conta um item que já saiu.** `BACKLOG.md:5732` lista
   *"rótulos `(SIEM)`/`(NDR)` — `EA-69`"* como `aberto` e represado atrás de uma
   Porta B, numa recontagem feita em **2026-10-16** — depois de os rótulos já
   estarem no produto por `P52_COPY`. A recontagem corrigiu o `EA-56` e não viu
   este.

## Necessidade

O proprietário pediu o corte: **congelar o backlog de instrumento, limpar o que
o cliente vê, selar.** A necessidade real desta demanda é, portanto, uma
pergunta de fecho e não de construção: *sobrou defeito visível no relatório que
o cliente recebe?*

A resposta medida é **não** — e ela não é uma opinião otimista, é consequência
de as demandas 019 a 023 terem consumido cinco dos sete candidatos. O que muda
para o leitor do relatório, hoje, com este refinamento: **nada**, e é esse o
desfecho desejável antes de uma selagem. O que muda para o facilitador e para
quem auditar a selagem: o backlog passa a **dizer a verdade** sobre o que está
aberto, e as duas dívidas que sobram ficam **declaradas com a razão**, em vez de
atravessarem a selagem como achados `aberto` de significado incerto.

Por que agora: porque é a última demanda antes da selagem, e carregar cinco
achados falsamente abertos para dentro de um registro de aceitação é o tipo de
dívida que ninguém consegue reler depois.

## Enquadramento de produto

### Os sete eram um problema ou sete? — resposta

**Os cinco que caíram eram cinco.** Independentes, de causas distintas, cada um
fechado por rota própria (tabela de apresentação; remoção de decorador; troca de
fonte do censo; completar a visão por produto; alargar o predicado de
arbitragem). Não havia causa comum atrás deles — havia uma **superfície nova com
muito movimento recente**, que é outra coisa.

**Os dois que sobraram são um.** E a causa tem nome:

> A seção de apoio tem **dois donos decidindo o destino da leitura congelada por
> predicados independentes**: `hasSubstituteV32()` (`ui_v32.js:746`, dono da
> 010/023) decide **ocultar**, pelo que foi **publicado**; `blocosLegados()` +
> `decorar()` (`ui_p52_support_v32.js:206`, `:683`, dono da 019/`EA-65`) decide
> **consumir**, pela **visibilidade do nó** e pela existência de oferta do motor
> — nunca pelo que foi publicado.

Os dois predicados concordam no caso comum e divergem exatamente nas bordas:

| borda | oculta? | consome? | o que resulta |
|---|---|---|---|
| publicação vazia (supressão total pela curadoria) | **não** | **sim** | título congelado visível, `.apoio-block` removidos → `EA-80` |
| publicação cheia em modo legado | **sim** | **não** (está oculto) | cópia morta: catálogo congelado oculto + catálogo novo visível → `EA-81` |

É **uma** causa lida de duas pontas. E há a prova de que são inseparáveis
**por desenho, não por conveniência**: consertar um por código piora o outro.

- guardar a remoção por `cards.length > 0` (a rota que o `EA-80` chama de mais
  barata) **não toca** o `EA-81`, porque sob arbitragem os blocos congelados nem
  entram em `legados`;
- fazer `blocosLegados()` aceitar nó oculto (a rota do `EA-81`) faz a supressão
  total remover os blocos **também** no mundo em que eles eram a única leitura —
  **agrava** o `EA-80`.

A regra única que fecharia os dois, se um dia se pagar por código:

> **A Camada 1 é consumida se e somente se há publicação que a substitua** — e o
> que é consumível é consumido, não deixado em cópia oculta.

Isto é a `C1` da 010 dita na linguagem do decorador. **Esta demanda recomenda
escrever a regra e não implementá-la** (D4/D5), pela razão da próxima seção.

### E a causa comum do enquadramento proposto ("superfície nova sem cobertura de borda")?

**Parcialmente verdadeira, e não é o que decide o desenho.** É verdade que
`EA-75`, `EA-79` e `EA-80`/`EA-81` nasceram todos de superfícies criadas em
019–023. Mas:

- `EA-75` e `EA-79` já foram fechados **pelas demandas seguintes**, o que é
  exatamente a cobertura de borda acontecendo — devagar, mas acontecendo;
- `EA-80` e `EA-81` não são falta de cobertura: **são cobertura funcionando**.
  O `EA-80` foi medido pela 023 sob fixture própria e **declarado** no relatório
  final; o `EA-81` foi descoberto porque a 023 rodou controle de árvore inteira e
  viu três mutantes mudando de veredito. Nenhum dos dois escapou — os dois foram
  vistos, medidos e deixados para trás com a razão escrita.

Chamar isso de "superfície sem cobertura" seria injusto com o instrumento e, pior,
levaria a desenhar uma demanda de reforço de cobertura — trabalho de instrumento,
que é exatamente o que o corte do proprietário congelou.

### Invariantes tangenciadas (R1)

- **INV-9** (superfícies congeladas protegidas por boundary): é a invariante
  central dos dois que sobraram. `EA-80` a tangencia pelo **conteúdo** (o bloco
  congelado é retirado do DOM sem substituto); `EA-81`, pelo **duplo** (o
  congelado permanece, íntegro e invisível, ao lado de uma cópia nova). Nenhum
  arquivo `frozen` é tocado em nenhuma das rotas — `ui_p52_support_v32.js` não
  está em `boundary.json → frozen` nem nas 15 entradas de `PROTECTED`
  (`tests_p50_core.js:82-635`), logo **não há §29.4 nem rito D2 em jogo**.
- **INV-3** (suficiência antes de score, e a UI nunca é dona da decisão): é ela
  que sustenta o resíduo declarado do `EA-79` (D3). A cláusula `E4` da 023
  (`ui_v32.js:732-741`) faz o gate de suficiência fechado **não** produzir
  substituto: *o que não é publicável não desloca o que é*.
- **INV-7** (narrativa determinística e derivada de evidência): tangenciada pelo
  `EA-80` — sob supressão total o relatório afirma um título de recomendação sem
  recomendação. A pergunta de produto da D4 é se isso é narrativa quebrada ou
  narrativa honesta.
- **INV-2 / INV-4 / INV-5 / INV-6 / INV-8**: não tangenciadas. Nada aqui toca
  resposta, score, alvo, refinamento operacional ou serialização.
- **INV-1**: **não tangenciada** — nenhuma rota considerada move o payload M41.

### Conflito com decisão registrada ou spec validada

- **`design-decisions.md:15`** está **desatualizada em duas pontas** (ver §0,
  itens 2 e 4). Não é conflito com esta demanda: é registro a fechar.
- **`C1` da demanda 010** (*"a Camada 1 não desaparece sem substituto"*): a rota
  A do `EA-80` parece servi-la e, medido, **a contraria** — ver D4. Qualquer
  mexida nela é **emenda a oráculo declarado de outra demanda**, que nesta casa
  se faz por errata na spec de origem + ratificação nominal do proprietário
  (precedente: `E19` da 015, erratas da 022 e da 023). É o item mais caro de
  todo este refinamento, e é por isso que a recomendação é não pagá-lo agora.
- **`C7` da demanda 023** (*"nada é removido — a lista continua no DOM, apenas
  oculta"*) **parece** contradita pelo `EA-80`, que descreve remoção. Não há
  contradição: são nós diferentes — a 023 oculta títulos e `t-list`, e o
  decorador da 019 remove `.apoio-block`. Mas a frase, lida sozinha, é enganosa.
  É disto que nasce o vocabulário da §Vocabulário: **ocultar ≠ consumir**.

### Alternativa mais simples considerada

A mais simples de todas — **não abrir demanda de produto** — é a recomendada
(D1). As duas alternativas maiores e por que não bastam/não cabem:

| alternativa | por que não |
|---|---|
| demanda de 7 itens, como nomeada | cinco não reproduzem; abrir sete tarefas seria gastar um ciclo de 7 fases em cinco correções de registro e dois achados que não são defeito no relatório entregue |
| demanda de 1 causa com 2 sintomas, por código | a rota do `EA-80` que parece barata contraria a curadoria do operador (D4); a do `EA-81` é invisível ao cliente (D5). Pagar emenda de oráculo alheio + repin na véspera da selagem, para mudar o que ninguém vê, é o oposto do corte aprovado |

## Sistema real

Verificado por leitura nesta worktree. Linha citada = linha lida.

**O caminho do apoio, hoje:**

1. `ui_v32.js:264` — ramo **legado** de `renderBlocks` chama
   `hideLegacyRecommendation(app, hasSubstituteV32(null))`. Era a constante
   `false` antes da errata `E1` da 023.
2. `ui_v32.js:311` — ramo não-legado chama com `haSubstituto` (010 · V1).
3. `ui_v32.js:746-758` — `hasSubstituteV32` = card de capability com payload
   **ou** `temProdutoPublicadoV32()`.
4. `ui_v32.js:729-745` — `temProdutoPublicadoV32`: exige módulo de curadoria
   instalado, **gate de suficiência aberto** (`:741`, cláusula `E4`) e
   `__CURATION.published()` não vazio.
5. `ui_v32.js:176-207` — `hideLegacyRecommendation` **oculta** por classe
   (`v32-hidden`), nunca remove; escopo é a seção de apoio do workspace.
6. `ui_p52_support_v32.js:206-211` — `blocosLegados()` colhe `.apoio-block` que
   **não** sejam cards por produto **e não** estejam ocultos.
7. `ui_p52_support_v32.js:683-743` — a passagem: colhe `legados`, pede
   `ofertaDoMotor()`, aplica `decisaoDe()` (curadoria) para montar `cards`,
   **remove os `legados` incondicionalmente** (`:738-739`), coloca os cards e
   declara a supressão (`:741`).
8. `ui_p52_support_v32.js:795-802` — o **papel** (`buildSupportHTML`) lê só
   `:scope > .apoio-block[data-p53-sol-produto]` e o aviso de supressão. A
   Camada 1 **não é impressa** — é desenho selado da 010 (C13) e foi remedido
   pela errata `E2` da 023.

**Divergências doc×código encontradas** (as quatro da §0, resumidas): entrada
prometida e inexistente em `design-decisions.md` (`EA-73`); `design-decisions.md:15`
descrevendo rota que não foi a executada; comentário `ui_p52_workspace_v32.js:1072`
afirmando ponteiro que não existe; `BACKLOG.md:5732` contando o `EA-69` numa fila
de Porta B que ele já deixou.

**Observação que NÃO virou achado, por causa do corte:**
`ui_v32.js:203` traz `node.classList.contains("prio-decl") && false` — cláusula
neutralizada por `&& false`, sem comentário que explique a neutralização, dentro
de arquivo `PROTECTED` (§29.4). Não é defeito de relatório e não tem efeito
observável: `prio-decl` simplesmente nunca entra no escopo de ocultação. Fica
**nomeada aqui e não aberta como achado** porque o proprietário congelou frentes
novas de instrumento; se ele quiser o id, abre-se um.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| B1 | curadoria exclui **todos** os ofertados (supressão total) | o relatório declara a supressão e **não** ressuscita o que o operador excluiu. O aviso **é** a leitura daquele estado (D4) |
| B2 | curadoria exclui **parte** | cards dos remanescentes + aviso de supressão parcial. Hoje é o comportamento, e está certo |
| B3 | modo legado (nada declarado) **com** produto publicado | uma leitura só: os cards. É o caso do relato do `EA-79`, e está resolvido |
| B4 | modo legado **sem** produto publicado | a leitura congelada permanece, e o convite ao editor de contexto também |
| B5 | **gate de suficiência fechado** | não há substituto (INV-3 pela apresentação): a leitura congelada **fica**, e a visão por produto também publica → as duas leituras coexistem. **Resíduo declarado e deliberado** (D3) |
| B6 | sessão com contexto declarado e gaps | igual a hoje: 3 nós ocultos, cards visíveis |
| B7 | supressão total **e** sessão sem gap moderado | a `t-list` ("pode fazer sentido") não existe, e sob B1 a seção fica com título + aviso e nada mais. É o pior caso visível do `EA-80`, e é o que a D4 decide |
| B8 | supressão total **com** gaps moderados | a `t-list` **sobrevive** — o decorador só consome `.apoio-block` —, logo a seção ainda tem leitura. Medido por leitura de `:206-211`, **não executado** |
| B9 | `UNSET` em capability com gap, sem contexto | inalterado por esta demanda; o resíduo é o *vão de contexto parcial* já no glossário |
| B10 | `target == current` | não tangenciado |

## Vocabulário

Três termos, **resolvidos aqui** e com o texto final abaixo. **Não foram
gravados no `CONTEXT.md` nesta Fase 0**, de propósito: o arquivo é **pinado**
(`pins.json:281`) e gravá-lo exige `gen_pins.py` no mesmo PR (R8 §1), que esta
delegação proíbe. Precedente nominal para o diferimento: os três termos da
demanda 016, *"resolvidos na Fase 0 (`refinement.md` §Vocabulário) e gravados na
Fase 5, no mesmo PR"* — declarado no cabeçalho do próprio `CONTEXT.md`.
**Condição do portão (D6)**: se a demanda seguir, a gravação + repin entram no
mesmo PR; se a demanda for fechada como refutada (D1), os termos entram pelo
`fix-finding` de registro, também com repin.

A razão de serem necessários não é estética: sem eles, a `C7` da 023 (*"nada é
removido"*) e o `EA-80` (*"o decorador remove"*) parecem contraditórios, e a
causa comum da §Enquadramento é indizível.

```md
**Consumo da leitura congelada**:
Ato do decorador V3.2 de RETIRAR do DOM um bloco congelado da Camada 1 cujo
conteúdo foi migrado para a visão por produto. Distinto de ocultação, que marca
o nó com `v32-hidden` sem removê-lo e é reversível: consumo é definitivo e
alcança só `.apoio-block`; ocultação alcança títulos, `t-list` e `t-details`.
Quem consome é a camada de apoio da 019; quem oculta é a arbitragem da 010/023.
_Evitar_: remoção, limpeza, migração, dissolução

**Supressão pela curadoria**:
Decisão do operador, no editor de curadoria, de excluir produto ofertado da
publicação — total quando nenhum card sobra, parcial quando alguns sobram. É ato
declarado de quem conduz a sessão, não falha do produto: por isso retira o
substituto (e a Camada 1 volta visível) sem que o relatório deva repor o que foi
excluído. Nunca alcança o conjunto OFERTADO pelo motor, só o PUBLICADO.
_Evitar_: supressão (sozinho — ver *Arbitragem de camada*), curadoria vazia,
relatório vazio, filtro

**Cópia morta**:
Mesmo conteúdo existindo duas vezes no DOM, uma das cópias oculta e portanto
nunca lida pelo cliente. Não é defeito do relatório — é risco de instrumento:
oráculo que deduplica por ordem de documento pode pinar a cópia oculta e passar
a medir o que ninguém vê. Distinta de *regra morta*, onde o morto é a declaração
e não o nó.
_Evitar_: duplicata, resíduo, nó órfão, sobra
```

**Colisão de homônimo, declarada**: o verbete *Arbitragem de camada* lista
"supressão" entre os `_Evitar_`, e o código usa "supressão" com o outro sentido
(`declararSupressao`, `data-p53-suprimido`, `C3` da 023). Por isso a cabeça nova
é **qualificada** — *Supressão pela curadoria* —, e a gravação deve acrescentar
a remissiva no verbete *Arbitragem de camada*: "supressão" sozinho continua a
ser evitado como sinônimo de arbitragem, e passa a remeter à cabeça qualificada.
INV-10 manda o nome seguir o artefato, e o artefato chama assim.

## Decisões a aprovar

Uma recomendação por decisão. O proprietário aprova em bloco ou recusa item a item.

| # | Decisão | Recomendação do PO |
|---|---|---|
| **D1** | A 024 é demanda de produto? | **Não.** Fechar como **refutada no portão da Fase 0** — precedente nominal: a 020, refutada no mesmo portão, com o registro em `design-decisions.md`. Nenhuma linha de código de produto é recomendada por este refinamento: logo não há Fase 1–5, nem red, nem mutante, nem repin de `frozen`. O trabalho que sobra é de **registro e decisão**, e cabe em `fix-finding` |
| **D2** | Os cinco que não reproduzem | Status → `resolvido`, **cada um com a rota que o fechou e a data**, nunca "resolvido" seco. Junto, no mesmo passe: a entrada do `EA-73` em `design-decisions.md` (prometida pelo código e inexistente), o fecho da entrada `:15` (a 023 executou, pela quarta rota), a recontagem da fila do `EA-58` sem o `EA-69`, e o comentário `ui_p52_workspace_v32.js:1072`. Dono: `doc-writer`; o comentário de módulo é `ui-engineer` |
| **D3** | O resíduo do `EA-79` (borda B5) | **Permanece declarado, sem mexer.** Com o gate de suficiência fechado as duas leituras coexistem, e isso é a INV-3 pela apresentação — mudar seria fazer leitura não-publicável deslocar leitura publicável. Registrar como **resíduo declarado** no bloco do `EA-79`, para que não volte como achado novo numa releitura futura (R2 §5) |
| **D4** | `EA-80` — o que a seção mostra sob supressão total | **Fechar por declaração, sem código** (rota B do próprio achado), e **recusar a rota A**. A razão é de produto e inverte o que o achado supõe: o `.apoio-block` congelado é **onde o produto excluído mora** — é dele que `prodLegadoDe()` tira o `.prod` —, e o conjunto ofertado à curadoria contém os produtos daqueles blocos. Repor os blocos quando `cards.length === 0` **re-exibe exatamente o que o operador acabou de excluir**: não é desfecho conservador, é desfazer a curadoria. A `C1` da 010 protege o cliente contra **vão do software**; supressão pela curadoria é **decisão de quem conduz**, não vão. O aviso de supressão **é** a leitura daquele estado. Custo: uma errata na spec da 010 dizendo isso, com ratificação nominal do proprietário — zero linha de produto |
| **D5** | `EA-81` — cópia morta em modo legado | **Fica declarado como dívida de instrumento e fora desta demanda**, pelo corte do proprietário: o cliente não vê nós ocultos, e o papel lê só os cards por produto (`:795-802`). O custo que ele já cobrou — dois gates cegos — **foi pago dentro da 023** (guarda de tile não desenhado, rota C). O que deve ir ao registro de selagem é o **risco residual nomeado**: todo oráculo futuro que deduplicar por ordem de documento nesta seção precisa olhar visibilidade, senão mede a cópia morta |
| **D6** | Vocabulário | Gravar os três verbetes + a remissiva de *Arbitragem de camada* no `CONTEXT.md`, **com `gen_pins.py` no mesmo PR** (R8 §1), no PR que executar D2 |
| **D7** | O que vai ao registro de selagem | Uma linha por dívida, com a razão e o estado: `EA-80` **declarado** (D4), `EA-81` **dívida de instrumento** (D5), resíduo B5 do `EA-79` **declarado** (D3), mais os 27 de instrumento que o corte congelou. Dívida declarada é selável; achado `aberto` de significado incerto não é |

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1 | D1–D7 acima, em bloco: a 024 fecha como refutada no portão, com cinco correções de registro, o `EA-80` fechado por declaração e o `EA-81` declarado como dívida de instrumento? | *(pendente)* |
| 2 | Se a resposta a D4 for "não, quero o código": a rota deixa de ser barata — exige emenda à `C1` da 010 (oráculo declarado de outra demanda) e reabre o `EA-81` junto, porque os dois têm de ser desenhados juntos. Confirma mesmo assim? | *(pendente)* |

## Fora de escopo (explícito)

- **Qualquer mudança de código de produto.** Esta demanda, como refinada, não
  propõe nenhuma.
- **Os 27 achados de instrumento.** Congelados pelo corte do proprietário.
  Nenhuma frente nova abre sem pedido dele.
- **`EA-58` e o lote de Porta B** (catálogo represado, `SCORES`). Continua sendo
  decisão do proprietário, e só encolheu: o `EA-56` saiu pela 021 e o `EA-69`
  sai agora pela `P52_COPY`.
- **Reindexar a leitura por capability** (a rota recusada pela errata `E2` da
  022): permanece recusada, com o custo medido.
- **Reforço de cobertura de borda da superfície nova.** É trabalho de
  instrumento; o corte o congelou.
- **A abertura ou a selagem de fase.** Não é desta demanda — mas é condição da
  próxima coisa que o proprietário pediu, e está sinalizada abaixo.

## Sinalização para a selagem (não é escopo, é aviso)

`.claude/verify/current_phase.json` diz: `fase_corrente 5.2 · SELADA` e
`proxima_fase: null · NAO_ABERTA`. **Não há fase de produto aberta para selar.**
O que existe desde então são demandas sob a máquina SDD, e o gate de abertura da
R4 (*"specs/PHASE_X*.md commitada com hash registrado antes de qualquer
implementação"*) nunca foi atravessado. Isso não invalida nada do que foi feito
— mas significa que "selar" hoje precisa que o proprietário diga **o que** está
sendo selado: um release `develop → main` com tag anotada (R14), ou a abertura
retroativa de uma fase 5.3 para então selá-la. É decisão dele, e é melhor
decidida antes do PR de fecho do que dentro dele.

## O que não pude medir

Fase 0 feita **sem Bash**, por leitura de fonte. Nenhum "verde" é afirmado aqui.

1. **Não executei suíte, gate, campanha ou pipeline.** Toda contagem citada
   (p.ex. 55 asserções, 3/3 mutantes) vem de artefato de demanda anterior,
   nominalmente citado — não foi remedida.
2. **Não confirmei por git** que a árvore desta worktree é idêntica ao `1c6a363`
   de `origin/develop`. As leituras são do disco; se houver mudança não
   commitada, elas a refletem. Verificador: `build-engineer`.
3. **Bordas B7 e B8 não foram executadas.** Deduzi por leitura que a `t-list`
   sobrevive à supressão total (o decorador só consome `.apoio-block`), e o
   registro do `EA-80` traz as duas medições de fixtures diferentes. Quem fecha:
   `qa-engineer`.
4. **Não medi o papel sob supressão total.** Por leitura de `:795-802`, o
   relatório impresso traz o título da seção e o aviso; a Camada 1 não é
   impressa (C13 da 010 + errata `E2` da 023). Quem confirma por execução:
   `ui-engineer` com `qa-engineer`.
5. **Não medi o `EA-81` no papel.** Por leitura, `buildSupportHTML` colhe só os
   cards por produto, logo a cópia morta não imprime. Quem confirma:
   `ui-engineer`.
6. **Não contei os achados abertos por ferramenta de auditoria.** Grep do padrão
   ``**Status**: `aberto` `` devolve **33** blocos (o 34º hit, `BACKLOG.md:56`,
   é o exemplo de formato, indentado). O número citado na delegação era 34.
   Diferença de 1 explicada por isso, não investigada além.
