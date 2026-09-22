# Refinamento — 019-curadoria-do-relatorio

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
>
> **Quem escreveu**: o orquestrador, **no contrato do `product-owner`**. Os
> agentes de papel existem em `.claude/agents/` mas **não estão disponíveis como
> subagentes nesta sessão** — isso vai dito no artefato em vez de simulado
> (precedente da demanda 018).
>
> **Origem**: achado `EA-57`, aberto em 2026-09-14 a pedido do proprietário, e
> o feedback de 2026-09-15 que pediu a reorganização de "Formas de apoio" por
> solução. Condução sob a delegação de 2026-08-29.

## Necessidade

Quem conduz a sessão — o SE — chega ao fim dela **sabendo coisas que o
screening não sabe**: o que o cliente já contratou, o que está em piloto, qual
conversa está madura e qual não está. Hoje ele não tem onde colocar esse
conhecimento: o relatório sai como o motor o produziu, e o SE escolhe entre
entregar assim ou reescrever fora da ferramenta.

O pedido, na palavra dele (2026-09-15):

> *"Seria interessante ter uma tela adicional, depois desse passo, para
> validar/ajustar as informações que o SE (no caso, eu), gostaria de ter no
> relatório final, tanto na página com a visão executiva, quanto na versão em
> PDF."*

**Por que agora**: porque a mesma rodada de feedback produziu **oito pedidos de
catálogo** (`EA-56` e os itens 2 a 5 e 7 a 8 de 2026-09-15) que estão todos
represados atrás de Porta B. Com curadoria, o catálogo deixa de precisar estar
certo para todos os casos — o SE completa no momento do preenchimento. A
curadoria não substitui o catálogo, mas **destrava o valor enquanto ele não
melhora**.

## Enquadramento de produto

### Invariantes tangenciadas (R1)

Duas, e as duas são o coração da demanda.

**INV-7 — "Narrativa determinística e derivada de evidência".**
A leitura ingênua diz que curadoria a viola: se um humano escolhe, a narrativa
deixa de ser derivada. **A leitura correta é outra**: determinismo é uma
propriedade da função `(entradas) → saída`, não uma proibição de entradas
humanas. O produto já é determinístico *com* respostas humanas, prioridades
humanas e contexto humano. Curadoria **preserva a INV-7 se, e somente se, for
modelada como ENTRADA** — nunca como edição da saída.

**INV-8 — "Derivados nunca serializados como fonte de verdade; sessão exporta
só inputs canônicos e o import recomputa".**
Mesma chave. Uma **seleção** entre o que o motor produziu é entrada; um **texto
de recomendação escrito pelo SE** seria derivado serializado, e isso a INV-8
proíbe. A fronteira do desenho sai daqui:

> **O SE escolhe entre o que o motor ofereceu. Ele nunca escreve o que o motor
> deveria ter dito.**

Se em algum momento a demanda precisar afrouxar isso, ela para e escala.

### Conflito com decisão registrada?

**Nenhum encontrado, e a busca foi por medição.** `design-decisions.md` não trata
de curadoria. A `015-superficies-de-apoio` decidiu a **partição** das superfícies
de apoio (prioridades × demais, direto × validar); esta demanda não a reabre —
ela acrescenta um filtro **depois** da partição.

### Precedente que já existe no produto, e é forte

O relatório **já carrega conteúdo escrito pelo facilitador**: as observações por
pergunta (`notes[k]`), impressas em `ui_v32.js:1247` e `:1345` como
`<i>Observações da sessão:</i> …`. Ou seja, o produto **já resolveu uma vez** o
problema de misturar voz humana e voz do motor — e resolveu **rotulando**.

A curadoria herda esse padrão. O que ela precisa acrescentar é que o rótulo
apareça **também no papel** e que diga de quem é a escolha.

### Alternativa mais simples considerada

**(A) Não fazer nada e melhorar só o catálogo.** Não basta: o catálogo nunca vai
cobrir todo cliente, e o `EA-56` mostrou que hoje ele cobre **2 de 10 gaps** no
PDF de uma sessão real. Além disso custa Porta B a cada ajuste (`EA-58`).

**(B) Deixar o SE editar o texto do relatório.** Mais simples de implementar e
**recusada**: viola a INV-8 e desmonta a garantia que sustenta o produto
inteiro — *"nenhum produto é inferido sem contexto"* perde sentido se o texto
pode ser reescrito à mão.

**(C) Curadoria como seleção sobre o que o motor produziu.** É a que atende o
pedido preservando as duas invariantes. **É a proposta.**

## Sistema real

Medido em 2026-09-17 sobre `develop`, dirigindo o fluxo real — não lido da
documentação.

### As duas montagens divergem, e ninguém as compara

| superfície | quem monta | classe |
|---|---|---|
| tela | recomposição da Camada 5.2 (`ui_p52_workspace_v32.js`) | livre |
| papel | `buildPrintReport()` (`ui_v32.js:1180+`) | **§29.4** |

São **dois montadores independentes** sobre os mesmos dados. Foi essa divergência
que produziu o `EA-55` (a tela repetia), o `EA-58` (o ícone do papel), e a
constatação do proprietário de que *"o PDF parece estar mais completo"*. Uma
curadoria que viva só num dos dois **aumenta** a divergência em vez de curá-la.

### O tamanho do problema de apoio, medido

Sessão real, 15 respostas nível 0, três prioridades de tecnologia:

| medida | valor |
|---|---|
| blocos de apoio | **15** |
| capabilities distintas | 15 |
| **produtos distintos** | **9** |
| menções totais | 20 |

`Serviços FortiGuard` aparece **5 vezes**; `FortiSOAR`, 3. Já existe
deduplicação — é o que produz o *"também relacionado a esta capability"* — mas
ela trata o sintoma: a estrutura é **gap → soluções**, então 9 produtos se
espalham por 15 blocos. Invertendo para **solução → capabilities**: **9 cards**.

### O que a sessão exporta hoje

`captureCanonicalInputs()` (`ui_session_v32.js:58-68`) devolve **exatamente
cinco chaves**:

```
assessment · priorities · technologyLandscape · targetProfile · operationalRefinement
```

E o gate `S4-S5` (`tests_session_m48.js:115`) afirma essa lista **por igualdade
exata de JSON**, além de proibir 13 nomes de campo derivado. `S27` recusa
injeção de campo derivado na importação. **`tests_session_m48.js` é §29.4.**

> **Consequência de custo, agora medida e não estimada**: persistir a curadoria
> como sexta chave canônica toca **dois arquivos §29.4** — `ui_session_v32.js`
> (o produtor) e `tests_session_m48.js` (o gate que pina a lista) — mais o
> validador de importação.

### O que NÃO precisa mudar

`fullStateJSON()` (`ui_v32.js:815`) é a invariante de impressão conferida por
`finishPrint()`: o estado não pode mudar durante o print. Um campo de curadoria
**fora** dessa função não a viola — e não há razão para incluí-lo, já que a
curadoria é lida, nunca escrita, durante a impressão.

### Portões que cercam a seção de apoio

- **`P52-REC1`** (`tests_p52_layout.js:512`) — todo `.apoio-block` dentro da
  seção de apoio ou do acordeão de gaps; contador conferido contra o DOM;
  **nome de produto proibido** no arquivo de layout.
- **`P52-REC1g`** (`tests_p52_chromium.js:675`) — mede a **geometria** dos
  `.apoio-block`: reprova "cards de apoio em coluna única no desktop".

> **Consequência**: ocultar os 15 blocos legados para mostrar 9 cards novos faz
> os retângulos irem a zero e **derruba o `P52-REC1g`**. A reorganização por
> solução não é ajuste de CSS — é reestruturação, e precisa de desenho próprio
> na Fase 2.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | SE não abre a curadoria | Relatório idêntico ao de hoje. A curadoria é **opcional**, como o contexto tecnológico |
| 2 | SE desmarca **tudo** | A seção de apoio não some: declara que a curadoria suprimiu tudo. Relatório sem explicação para a ausência é pior que relatório cheio |
| 3 | Sessão exportada, importada noutro dia | A curadoria volta. É por isso que ela precisa ser entrada canônica |
| 4 | Curadoria feita, depois a **resposta muda** | O conjunto oferecido muda. Seleção que deixou de existir é **descartada com aviso**, nunca ressuscitada em silêncio |
| 5 | Curadoria feita, depois o **contexto tecnológico** muda | Idem ao 4 |
| 6 | Gate de suficiência **fechado** | Curadoria indisponível: não há resultado publicado para curar |
| 7 | Importar sessão de versão anterior (sem o campo) | Ausência ≠ vazio: sem curadoria declarada, comporta-se como o caso 1 (INV-8, `missing ≠ null ≠ []`) |
| 8 | Curadoria contradiz a política de severidade | Permitida e **rotulada**: é justamente o conhecimento que o SE tem e o screening não |
| 9 | Papel × tela | A **mesma** seleção nas duas superfícies. Divergir aqui é reproduzir o defeito que a demanda existe para curar |

## Vocabulário

Termos a registrar no `CONTEXT.md` na Fase 1:

- **Curadoria do relatório** — seleção, feita pelo operador, do subconjunto do
  que o motor produziu que vai ao relatório. **Não** é edição de texto e **não**
  cria conteúdo novo.
- **Operador** — quem conduz a sessão (o SE). Distinto de **cliente** (quem
  recebe o relatório) e de **proprietário** (quem governa o produto). O produto
  hoje diz "facilitador" em alguns lugares e não nomeia o papel em outros.
- **Anotação do operador** — conteúdo do relatório cuja origem é a pessoa, não o
  motor. Já existe de fato (`Observações da sessão`), mas não tem nome.
- **Apoio por solução** — apresentação que agrupa por produto e lista as
  capabilities que ele atende, em vez de agrupar por gap.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1 | O item 4 do feedback de 2026-09-14 vira demanda própria? | *"Registre no backlog"* → `EA-57` |
| 2 | A reorganização de "Formas de apoio" por solução entra junto? | *"Quero que a demanda absorva"* (2026-09-15) |
| 3 | Ordem de ataque | *"9, 11, 12, 13 primeiro, depois 6, depois os outros que já temos na fila"* |
| 4 | **Portão da Fase 0 — cinco perguntas abaixo** | **pendente** |

## Perguntas do portão da Fase 0

**P1 · A fronteira.** Confirma que curadoria é **seleção**, nunca edição de
texto? *Recomendo sim* — é o que preserva INV-7 e INV-8, e é o que separa esta
demanda de "deixar editar o relatório", que eu recusaria.

**P2 · Persistência.** A curadoria sobrevive a exportar/importar sessão?
*Recomendo sim*, como **sexta chave canônica**. Custa dois arquivos §29.4 e o
validador. A alternativa barata — curadoria efêmera, só até fechar a aba — some
quando você reabre a sessão no dia seguinte, que é exatamente quando o
relatório costuma ser gerado.

**P3 · Proveniência no papel.** Como marcar o que foi escolhido por você? Opções:
(a) rótulo por item, no padrão de `Observações da sessão`; (b) uma linha no
rodapé do relatório; (c) ambos. *Recomendo (a)*, que é o precedente já existente
e o que resiste a leitura fora de ordem.

**P4 · Escopo da primeira entrega.** A curadoria cobre só a **seção de apoio**,
ou também gaps, prioridades e cenário-alvo? *Recomendo só o apoio* — é onde o
pedido nasceu, onde está a redundância medida, e onde o catálogo falha. Os
demais viram demanda própria se você quiser.

**P5 · O apoio por solução.** Entra nesta demanda ou vira a seguinte? *Recomendo
entrar*, porque a curadoria **precisa de uma lista de produtos para oferecer** —
e essa lista é exatamente a visão por solução (9 em vez de 15). As duas coisas
são a mesma estrutura vista de dois ângulos; separá-las faria construir duas
vezes.

> A R4 é literal: aprovação é do usuário, no chat. A delegação de 2026-08-29
> cobre a **condução** dos portões; estas cinco são decisões de **produto** sobre
> o que a ferramenta passa a permitir, não ritmo de fase.

## Decisões do portão da Fase 0 — **FECHADO em 2026-09-17**

Transcritas aqui para não viverem só no transcript.

**P1 · A fronteira.** Curadoria é **seleção**. O verbo "adicionar" foi
desdobrado em três e decidido caso a caso:

| | o que é | decisão |
|---|---|---|
| **(a)** | acrescentar produto **do catálogo** que o motor não ofereceu para aquele gap | **SIM** — é seleção de um conjunto maior |
| **(b)** | acrescentar produto **fora do que o motor ofereceu**, inclusive fora do mapeamento atual | **SIM** |
| **(c)** | escrever **texto livre** de recomendação | **NÃO** — *"esse é desnecessário"* |

Com (c) fora, a INV-8 permanece intacta: nada que o operador produz vira prosa
do motor. **(b) tem consequência de desenho e está nomeada abaixo.**

**P2 · Persistência.** Sim, como **sexta chave canônica** da sessão.

**P3 · Proveniência.** Rótulo **por item**, no padrão já existente de
`Observações da sessão`.

**P4 · Escopo.** Confirmada a leitura proposta:

> A curadoria age sobre o que o motor **inferiu** — nunca sobre o que foi
> **declarado** ou **medido**.

| curável | não curável |
|---|---|
| formas de apoio e recomendações | respostas · score · estágio · suficiência |
| leitura arquitetural | **gaps observados** |
| "pode fazer sentido — após validação" | prioridades declaradas · cenário-alvo |

O "Tudo" do proprietário vale no sentido que importa: **toda recomendação, em
todas as seções onde ela apareça**. Suprimir um gap seria o relatório deixar de
dizer o que o cliente respondeu — para desenfatizar, o caminho é a observação.

**P5 · Apoio por solução.** Entra nesta demanda, agrupado pela divisão oficial
do portfólio (`fortinet.com/products`, lido em 2026-09-17).

### Conhecimento do proprietário, registrado

> *"Pode manter FortiEDR e FortiClient; é decisão ainda interna da Fortinet não
> divulgar explicitamente, mas ainda assim comercializar a opção separada."*

A navegação pública consolidou o endpoint sob **FortiEndpoint** e não mostra
mais FortiEDR nem FortiClient. **Isso é decisão de divulgação, não
descontinuação.** O registro importa porque eu havia lido a ausência como sinal
de que o item 8 do feedback pedia nomes superados — e estava errado. Consequência
para o `EA-56`: os dois continuam candidatos legítimos de catálogo.

### Consequência aberta, para a Fase 1 decidir

A decisão **(b)** exige uma origem para os produtos que o motor não ofereceu.
Duas rotas, a serem pesadas no `plan.md`:

- **(i) Catálogo completo como fonte.** A curadoria oferece **todo** o
  `PRODUCTS`, e não só os mapeados para aquele gap. Mantém tudo como seleção e
  não cria vocabulário novo. Limite: não alcança produto que **não exista** no
  catálogo — e `FortiNAC`, `FortiEDR` e `FortiClient` **não existem** hoje
  (medido: zero ocorrências em `quickscan_secops_soccmm_v3_1_3.html` e
  `engine_v32.js`).
- **(ii) Catálogo ampliado antes.** Acrescentar os faltantes ao `PRODUCTS`
  **sem** mapeá-los a pergunta alguma — o que, em tese, os tornaria
  selecionáveis sem mudar o que o motor decide sozinho.

### A rota (ii) foi MEDIDA, e é Porta B

Executado em 2026-09-17, em **cópia** do HTML construído — a árvore nunca foi
tocada (R7 §3):

```
1ª sonda · produto novo, sem ícone
   payload DIVERGE — configErrors ganha
   "ICONS: produto sem ícone embutido (fallback será usado) — FortiTesteEA57"

2ª sonda · FortiEDR, que TEM ícone em ui_icons_v32.js
   payload DIVERGE — a mesma linha, agora com FortiEDR
```

**A causa não é o mapeamento.** `candidatesMatrix()`
(`harness_m41_v313.js:117`) percorre as **perguntas** e lê o `MAP`; produto sem
mapeamento não entra nela. Quem muda é o **`configErrors`**: a validação da
Camada 1 (`quickscan_secops_soccmm_v3_1_3.html:1088`) exige que **todo** item de
`PRODUCTS` tenha entrada no `ICONS` **da Camada 1** — e o acervo onde
`FortiEDR`/`FortiClient` existem é o `ICONS_V32`, que é **outro mapa**.

> **Conclusão medida**: acrescentar **qualquer** produto ao `PRODUCTS` altera o
> payload M41. A rota (ii) é **Porta B, sem exceção** (R1) — e converge com o
> `EA-56`/`EA-58`, que já estão na fila.

**Consequência para o desenho desta demanda**: a rota (i) é a única livre, e ela
alcança **todo o catálogo existente**. Não alcança `FortiNAC`, `FortiEDR` nem
`FortiClient`, que **não existem** em `PRODUCTS` (medido: zero ocorrências).
Esses três chegam quando a Porta B do catálogo acontecer — e a curadoria os
oferece **no dia seguinte, sem mudança de código**, porque ela lê o catálogo.

Ou seja: a demanda entrega valor agora **e** fica pronta para o catálogo depois.
Isso é resultado da medição, não desenho que eu tenha escolhido.

### Taxonomia de agrupamento (P5), levantada em 2026-09-17

Oito categorias de topo. Quase todo o catálogo cai em **Security Operations**,
cujos subgrupos viram os baldes:

| subgrupo | do nosso catálogo |
|---|---|
| Security and Risk Management | FortiSOC · FortiAnalyzer · FortiSIEM · FortiSOAR · SOCaaS · FortiAI-Assist |
| Endpoint | FortiEndpoint *(e FortiEDR/FortiClient, por decisão do proprietário)* |
| Network Detection | FortiNDR · FortiDeceptor · FortiSandbox |
| Continuous Threat Exposure Management | FortiRecon |

**Duas ressalvas que a leitura revelou e que o agrupamento precisa tratar:**

1. **FortiGate não está em Security Operations** — está em *Network Security*.
   O agrupamento usa o subgrupo quando existe e a categoria de topo quando não.
2. **MDR e treinamento não estão em Products.** Vivem em *Support → Services and
   Training*. São **serviços**, não produtos, e precisam de balde próprio — sem
   ele, somem do agrupamento. Isso vale também para a trilha de capacitação do
   `EA-56`.

## Fora de escopo (explícito)

- **Editar texto do relatório.** Recusado por INV-8 (ver P1).
- **Mudar o catálogo** (`MAP`, `QS_GAP_SUPPORT`): é `EA-56`/`EA-58`, Porta B, e
  esta demanda existe em parte para **reduzir a urgência** disso — não para
  fazê-lo.
- **Mudar a política de severidade** (sev 2 direto × sev 1 a validar). Ela
  continua decidindo o que é **oferecido**; a curadoria decide o que é
  **publicado**.
- **Score, estágio, suficiência, gaps.** Nada nesta demanda os alcança. O
  payload M41 deve sair **byte-idêntico**, e isso é critério de aceite.
- **Curadoria de gaps, prioridades ou cenário-alvo** — decidido em P4: são
  medição e declaração, não inferência. Ficam fora **por princípio**, não por
  economia.
- **A imagem de abertura do README** e a fonte de verdade de produção
  (`EA-64`): outra conversa.
