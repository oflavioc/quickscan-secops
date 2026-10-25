# CONTEXT — glossário canônico

> Mantido pelo `product-owner` na Fase 0 de cada demanda (R12). Só glossário:
> o que cada conceito É, em uma ou duas frases. Doc, spec e prompt novos usam o
> termo daqui, sem derivar para os sinônimos evitados.
>
> **Desvio declarado — 2026-09-01.** *Cláusula sentinela* foi gravado na **Fase 4**
> da demanda 015, fora da Fase 0, por autorização do orquestrador sob delegação.
> Razão: o termo já estava em uso em três artefatos e no registro de mutantes, e
> deixá-lo indefinido custava mais que o desvio. Trilha em
> `specs/015-superficies-de-apoio/spec.md` §E2.1.
>
> **Desvio declarado — 2026-09-04.** Os três termos da demanda 016 (*Fecho de
> demanda*, *Demanda mesclada sem fecho*, *Fecho pendente declarado*) foram
> resolvidos na Fase 0 (`refinement.md` §Vocabulário, decisão P6 do portão), mas
> gravados aqui na **Fase 5**, no mesmo PR — e revistos contra o que a demanda
> construiu (vocabulário fechado de vereditos T10; T4; T5). *Mutante parcialmente
> inerte* nasceu na errata E7 da 014 (2026-09-01) e entra dois ciclos depois, com
> a classe estabilizada pelo fecho do `EA-32`. Trilha:
> `specs/016-registro-contra-execucao/spec.md` C9.
>
> **Emenda declarada — 2026-09-09.** O verbete *Insumo de prova* recebeu cláusula
> remissiva ao vocabulário fechado da demanda 017, fora de qualquer Fase 0, por
> `fix-finding` — resíduo 1 do aceite de intenção da 017, diferido de propósito
> enquanto a spec listava `CONTEXT.md` em §Não mudam e o `spec-validate` media
> esse diff como vazio (item 68). Nada no verbete era falso: era
> verdadeiro-e-incompleto, por definir a extensão com exemplos. Trilha:
> `specs/017-semantica-do-gatilho/spec.md` §Vocabulário fechado.
>
> **Emenda declarada — 2026-10-16.** *Ancoragem do apoio* entra fora de qualquer
> Fase 0, por autorização do proprietário — é a condição (4) do aceite de intenção
> da demanda 021, nomeada e diferida por mim para passe próprio. A `§Vocabulário`
> do `refinement.md` da 021 (`:121`) afirmou que *Ancoragem*, *capability* e
> *caminho de apoio* "já estão no `CONTEXT.md`"; medido, **capability** está,
> **Ancoragem** nunca existiu, e **caminho de apoio** está como `_Evitar_` de
> *Habilitador* — isto é, a demanda declarou cobertura de vocabulário que o
> glossário não dava. A palavra "âncora" estava ocupada **quatro** vezes (`:178`,
> `:183`, `:188`, `:375`), todas de INSTRUMENTO, e uma quinta vez em prosa
> (`âncora normativa`, `:104`) — e a 021 reancorou mutantes no mesmo ciclo em que
> introduziu a ancoragem de apoio. Nesta emenda: *Habilitador* e *Âncora de
> mutante* recebem cláusula de delimitação, **sem** que nenhum termo saia do
> `_Evitar_` e sem que nenhum sentido mude — por isso nada é riscado (R2 §5).
> O nome do atributo no código permanece (INV-10): o que se decide aqui é o termo
> de domínio. Trilha: `specs/021-cobertura-do-apoio/spec.md` §C6 e
> `refinement.md` §Vocabulário.
> **Desvio declarado — 2026-10-19.** Os três termos da demanda 024 (*Consumo da
> leitura congelada*, *Supressão pela curadoria*, *Cópia morta*) foram resolvidos
> pelo `product-owner` na Fase 0 (`refinement.md` §Vocabulário, decisão D6) e
> gravados aqui depois de a demanda ser refutada no portão (D1), por `fix-finding`
> de registro do `doc-writer` — texto colado do refinamento, sem edição. No mesmo
> passe, a remissiva no verbete *Arbitragem de camada*: "supressão" sozinho
> continua evitado como sinônimo de arbitragem e passa a remeter à cabeça
> qualificada. Trilha: `specs/024-sete-defeitos-do-relatorio/refinement.md`
> §Vocabulário.

## Metodologia (produto)

**Resposta confirmada**:
Resposta de valor 0–3 registrada pelo facilitador. Só ela entra em média de score.
_Evitar_: respondida, preenchida

**A validar (NA)**:
Resposta marcada como "não sei" — vira pendência de validação, nunca score.
_Evitar_: não aplicável (sentido diverso do usual!), pulada

**Não respondida (null)**:
Pergunta sem interação. Terceiro estado do eixo, distinto de confirmada e de NA.
_Evitar_: vazia, em branco

**UNSET**:
Estado do landscape tecnológico "não informado". Nunca é ausência declarada.
_Evitar_: vazio, não preenchido, NONE (é OUTRO estado)

**NONE**:
Ausência DECLARADA de tecnologia para a capability. Informação positiva; com gap
de maturidade e evidência suficiente, habilita whitespace.
_Evitar_: sem resposta, UNSET

**Suficiência**:
Portão canônico da Camada 1 (≥10 confirmadas E ≥2 por domínio) que autoriza
qualquer score/publicação. A UI nunca é dona desta decisão.
_Evitar_: completude, cobertura

**Publicável**:
Estado de um dado que a decisão canônica (publishableStats / comparisonPublishable)
permite exibir com valor. Sob gate fechado, score vira n/d — nunca zero.
_Evitar_: visível, liberado

**Capability**:
Unidade de avaliação do engine (25), com escopo, cobertura e relações de catálogo.
_Evitar_: recurso, funcionalidade

**Whitespace (TECHNOLOGY_WHITESPACE)**:
Gap de maturidade + NONE declarado + suficiência — a única classificação que gera
candidato DIRECT de aquisição.
_Evitar_: oportunidade, gap de produto

**Cenário-alvo (target)**:
Perfil prospectivo DECLARADO pelo facilitador, estritamente maior que o atual
confirmado; nunca derivado de produto. Encoding visual reservado: tracejado verde.
_Evitar_: meta automática, projeção

**Refinamento operacional**:
Camada qualitativa (3 perguntas ref-*) que contextualiza narrativa; nunca afeta
scoring.
_Evitar_: perguntas extras, ajuste de score

**Tier**:
Agrupamento de recomendação por severidade do achado (T1 alto, T2 moderado, T3
não priorizado com evidência positiva).
_Evitar_: prioridade (é do negócio), ranking

**Habilitador**:
Item de catálogo (produto ou serviço) que PODE apoiar a evolução de uma prática,
apresentado como possibilidade condicionada e sempre derivado de evidência
confirmada. Nunca é requisito, compra recomendada, nem origem do cenário-alvo.
Termo canônico de doc, spec e prompt; as strings já congeladas na UI permanecem
como estão (INV-10). O `_Evitar_` é do registro do CONCEITO, nunca do registro da
TELA: *formas de apoio* (Camada 1, classe `frozen`) e *caminhos de apoio*
(superfície 5.x sob §29.4) são **nomes de seção que o leitor vê**, e doc que os
nomeia os **cita** — citar o título de uma superfície não é usar o sinônimo. O que
o `_Evitar_` proíbe é **predicar** com eles: *"todo gap recebe caminho de apoio"*
fala do ITEM e deve dizer *habilitador* (ou *bloco de apoio*, se o sujeito é o
bloco). *Apoio* sozinho nomeia a SUPERFÍCIE — seção de apoio, leitura de apoio,
bloco de apoio, cobertura do apoio — e é livre, inclusive em slug de demanda.
_Evitar_: recomendação, solução, caminho de apoio, forma de apoio

**Bloco de ausência**:
Bloco de resultado cujo único conteúdo possível é declarar que algo não foi
informado ou não foi avaliado. Não renderiza: a ausência vira um aviso único e
acionável, com a lista do que ficou de fora.
_Evitar_: bloco vazio, placeholder, estado nulo

**Ordem canônica de leitura**:
Sequência declarada das seções do resultado (P52-RES2), que É a ordem do DOM, do
foco e do trilho lateral — e tem uma exceção declarada sob gate de suficiência
fechado. Alterá-la exige âncora normativa nova antes do código.
_Evitar_: layout, ordem visual, disposição

**Base de evidência da sessão**:
Disclosure do resultado que guarda o painel canônico de suficiência quando o gate
está ABERTO, para responder "de onde saiu este número". É de SESSÃO — distinta do
*Acervo de evidência*, que é o conjunto congelado que sustenta a selagem de uma
fase.
_Evitar_: acervo, anexo, evidências da sessão

**Tecla de atalho (priorização)**:
Glifo 1–9 exibido no botão da tela de prioridade que indica o ATALHO DE TECLADO
daquele item, não a sua posição numa lista. Itens além do nono não recebem
atalho.
_Evitar_: numeração, índice, ranking, ordem

**Habilitador a validar**:
Habilitador listado a partir do gap e do catálogo congelado quando o contexto
tecnológico da capability NÃO foi declarado. É hipótese explícita — o relatório diz
"validar aderência" e nunca afirma ausência de tecnologia. Distinto do habilitador
de apoio direto, que exige NONE declarado e suficiência.
_Evitar_: recomendação condicional, sugestão, produto provável

**Vão de contexto parcial**:
Estado de sessão em que algum contexto foi declarado (saindo do modo legado) sem que
nenhuma capability com gap tenha saído de UNSET — a leitura congelada é suprimida e
a leitura V3.2 não produz substituto. Estado não desenhado: o relatório passa a
conter MENOS do que conteria sem declaração alguma.
_Evitar_: modo intermediário, contexto incompleto, sessão híbrida

**Arbitragem de camada**:
Regra que decide qual das leituras de apoio (a congelada da Camada 1 ou a do engine
V3.2) é apresentada ao leitor. É de APRESENTAÇÃO, nunca de cálculo, e seu predicado
é a existência de substituto — não a existência de contexto declarado.
_Evitar_: modo legado, supressão (sozinho — ver *Supressão pela curadoria*), fallback

**Convergência no card**:
Forma de apresentação em que o habilitador é uma linha discreta DENTRO do card da
prática-alvo, em vez de uma seção própria. É aditiva: não implica dissolver a seção
de apoio, que carrega também conteúdo não-comercial (capabilities a validar, tiers).
_Evitar_: fusão de seções, unificação, merge de blocos

**Ancoragem do apoio**:
Dimensão do gap de que o CONTEÚDO de um bloco de apoio foi derivado, declarada
pelo próprio bloco. Responde "de onde saiu esta lista" — nunca "qual é o produto"
nem "esta lista serve". É **uma por bloco** e decide-se pela PROCEDÊNCIA do
candidato, não pelo que o texto visível parece dizer: quem forneceu os candidatos
fixa a ancoragem. Uma das dimensões é a **canônica da sessão** — a que parte da
pergunta e do nível respondido —, e é essa assimetria que dá função à declaração:
bloco que NÃO parte dela carrega o aviso de divergência (`EA-48`); o que parte
dela não o repete, porque não diverge de si mesmo. Nomear a canônica não é
enumerar os valores: é dizer quem avisa. Fonte de apoio nova herda o critério sem
emenda — declara a sua dimensão e, se não for a canônica, avisa. O conjunto de
valores é identificador (INV-10): lê-se em `qsGapSupportHTML()` e é cobrado pelo
gate `D021-ANC1`; este verbete define o CRITÉRIO e remete à fonte, nunca a copia
(R12 / `EA-47`).
Distinta de toda a família de INSTRUMENTO — *Âncora de mutante*, *Âncora podre*,
*Reancoragem*, *Commit-âncora* e a *âncora normativa* de uma diretriz de fase —,
que LOCALIZA (onde mutar, de que commit ler o blob) ou AUTORIZA (que norma
sustenta a mudança). Esta não localiza nem autoriza: informa procedência de
conteúdo ao leitor do relatório. Neste repositório, *âncora* sem qualificador é
do instrumento; a do produto vem sempre com "do apoio".
_Evitar_: âncora, ancoragem (sozinhos — são do instrumento), origem do bloco,
fonte (é o aviso, outra coisa), procedência da recomendação, nome do atributo
(identificador, não termo de domínio)
**Consumo da leitura congelada**:
Ato do decorador V3.2 de RETIRAR do DOM um bloco congelado da Camada 1 cujo
conteúdo foi migrado para a visão por produto. Distinto de ocultação, que marca
o nó com `v32-hidden` sem removê-lo e é reversível: consumo é definitivo e
alcança só `.apoio-block`; ocultação alcança títulos, `t-list` e `t-details`.
Quem consome é a camada de apoio da 019; quem oculta é a arbitragem da 010/023.
_Evitar_: remoção, limpeza, migração, dissolução

**Curadoria do relatório**:
Seleção, feita por quem conduz a sessão como último passo antes do relatório, do
subconjunto do que o motor INFERIU que vai à publicação — na tela e no papel, com
proveniência rotulada quando a presença de um item é decisão humana. É ENTRADA
canônica da sessão (a sexta chave), nunca edição de texto nem conteúdo novo, e
alcança só o inferido (apoio, leitura arquitetural) — jamais o declarado ou o
medido. Por item, o estado é tri-estado — ausente (o motor decide), `include`,
`exclude` — e a forma canônica de "nada declarado" é a AUSÊNCIA da chave; o dono
do estado é o bridge `__CURATION` (R9 §5), que este verbete referencia sem copiar.
Nasceu na demanda 019; o ciclo de vida na sessão é da 025 (ver *Importação
substitutiva*).
_Evitar_: edição do relatório, personalização, filtro, ajuste do PDF; "seleção do
engenheiro" é rótulo de TELA (citação livre) e não predica o conceito

**Supressão pela curadoria**:
Decisão do operador, no editor de curadoria, de excluir produto ofertado da
publicação — total quando nenhum card sobra, parcial quando alguns sobram. É ato
declarado de quem conduz a sessão, não falha do produto: por isso retira o
substituto (e a Camada 1 volta visível) sem que o relatório deva repor o que foi
excluído. Nunca alcança o conjunto OFERTADO pelo motor, só o PUBLICADO.
_Evitar_: supressão (sozinho — ver *Arbitragem de camada*), curadoria vazia,
relatório vazio, filtro

**Importação substitutiva**:
Propriedade da importação de sessão pela qual, depois de um import bem-sucedido,
TODO owner canônico — inclusive a curadoria do relatório — passa a ser o que o
documento declara, e o que o documento NÃO declara vira "nada declarado", nunca
herança da sessão que estava aberta: o documento basta para reconstruir o
resultado (INV-8). É também atômica — olhar um arquivo (prévia), cancelar,
recusar ou falhar no meio deixa a janela igual à anterior, inclusive no papel. Quem
a mede é o gate de roundtrip "o mesmo documento, sobre dois estados prévios
distintos, produz o mesmo estado". Distinta de *Substituto* (leitura V3.2 no lugar
da congelada — outra família, mesma raiz): aqui o substituído é a SESSÃO ABERTA,
pelo documento.
_Evitar_: mesclagem, merge, importação aditiva, herança da sessão, "preservar o
que o arquivo não traz"

## Estrutura (processo)

**Demanda**:
Unidade de trabalho que percorre as 7 fases da máquina SDD (skill new-demand),
com specs/NNN-slug/ e planning-state próprios.
_Evitar_: feature (reservado ao tipo de tarefa e ao nome de branch), pedido

**Onda**:
Etapa de implantação da Estrutura Agêntica (0–4), com critério de pronto
executável. Distinta de *wave* (grupo de tarefas paralelas dentro de uma demanda).
_Evitar_: fase (reservado à máquina SDD e às fases 5.x do produto)

**Pin / repin**:
Identidade SHA-256 de um artefato no registry (pins.json). Repin = atualização
consciente, no mesmo PR, com trilha "Identidade anterior".
_Evitar_: hash solto, checksum informal

**Boundary**:
Manifesto de classes de proteção (frozen/generated/legacy/registry) com o rito de
mudança de cada uma. Fecha acumulativamente a cada selagem.
_Evitar_: escopo, lista de proibidos

**Red / green**:
Estados do ciclo TDD: gate provado FALHANDO antes da implementação (red, commitado)
e passando depois (green). Sem red provado não há green que valha.
_Evitar_: teste quebrado (red é intencional)

**Gate**:
Asserção executável com poder discriminante provado por mutante. O que decide é o
gate, nunca a leitura de quem implementou.
_Evitar_: teste (genérico), checagem manual

**Âncora de mutante**:
Trecho de texto exato que localiza, no arquivo-alvo, onde a mutação é aplicada.
Distinta do alvo (o arquivo) e da propriedade (o comportamento defendido). Cabeça
da família de INSTRUMENTO que ocupa a palavra "âncora" neste glossário (com
*Âncora podre*, *Reancoragem* e *Commit-âncora*) — distinta da *Ancoragem do
apoio*, que é de PRODUTO e não localiza nada.
_Evitar_: alvo, trecho, patch, find

**Âncora podre**:
Âncora que não casa mais nenhum texto do arquivo-alvo. O mutante não chega a ser
aplicado e a campanha o contabiliza como não detectado.
_Evitar_: mutante quebrado, teste falhando, âncora desatualizada

**Reancoragem**:
Reposicionar a âncora no texto atual PRESERVANDO a propriedade que o mutante
defende — só legítima quando o comportamento-alvo ainda existe e a mutação
continua produzindo a mesma violação, provada pelo gate e motivo esperados.
_Evitar_: atualizar o mutante, consertar o find

**Aposentadoria de mutante**:
Remoção de mutante cujo comportamento-alvo deixou de existir, com a razão
registrada na matriz; o gate que fica sem mutante vira dívida declarada.
_Evitar_: deletar mutante, remover teste, limpar campanha

**Mutante não executado**:
Mutante que não chegou a rodar (ambiente ausente, build que não aconteceu,
âncora podre). Terceiro estado, distinto de detectado e de sobrevivente — nunca
somado a nenhum dos dois.
_Evitar_: não detectado (ambíguo), pulado, falhou

**Mutante sobrevivente**:
Mutante aplicado, com o gate executado, e ainda assim não reprovado pelo gate e
motivo esperados — o gate não tem poder discriminante para aquela propriedade.
_Evitar_: mutante não detectado, falso negativo

**Mutante parcialmente inerte**:
Mutante que aplica, altera bytes e é DETECTADO pelo gate e motivo esperados, mas
PARTE da mutação não pode influenciar veredito nenhum — a instância conhecida é
a regra CSS inserida que perde por ordem para a declaração vencedora da mesma
folha. Não é sobrevivente, não executado, âncora podre nem equivalente por
construção: o KILL é real e o perigo é de leitura, porque a matriz sugere
carrasco para uma propriedade que não tem. Saída canônica: partir por
propriedade, cada metade atacando a declaração vencedora (`P52-RA8`/`P52-RA8B`,
`EA-32`).
_Evitar_: KILL parcial, mutante meio morto, regra morta (é o mecanismo da
instância, não a classe), desc que promete demais

**~~Alvo declarado de campanha~~** (riscado em 2026-09-05, Fase 0 da demanda 017):
~~Conjunto de paths em `mutation_map.json → targets` que dispara a re-execução de
um harness por gatilho de path. Deve ser exatamente o conjunto de arquivos que o
harness muta, mais o próprio harness.~~
Riscado porque a segunda frase afirmava **identidade** entre o que dispara e o
que é mutado — relação que só `p50`, `p51`, `p52` e `d014vis` cumprem; sete dos
onze harnesses com preflight declaram gatilho maior que o conjunto mutado, com
razão escrita na `_trilha`, e R3 §5 exige o **gate** no gatilho. A primeira
frase estava certa e sobrevive como *Gatilho de campanha*; a segunda virou
*Conjunto mutado* (contido, não idêntico). Trilha:
`specs/017-semantica-do-gatilho/refinement.md` §Vocabulário.

**Gatilho de campanha**:
Conjunto de paths em `mutation_map.json → harnesses.<h>.targets` cuja mudança no
diff contra a base re-executa o harness (`check_mutation.py`, pertinência exata,
sem glob). Contém o conjunto mutado e o próprio harness; todo elemento além
disso é insumo de prova com razão declarada. Diz o que a campanha VIGIA, nunca o
que ela prova. A chave JSON permanece `targets` (INV-10); só a prosa muda.
_Evitar_: alvo, alvos, targets (em prosa), escopo da campanha, cobertura

**Conjunto mutado**:
Arquivos cujos bytes ou existência a campanha altera ao executar — o que o
harness emite em `arquivos_mutados` (contrato C1 da 013), incluindo o que ela
cria ou remove. É aquilo SOBRE o que a campanha prova e está sempre contido no
gatilho; arquivo mutado fora do gatilho é defeito sem exceção.
_Evitar_: alvos, arquivos do mutante, targets, MUTABLE / CRIAVEIS (nomes de código)

**Insumo de prova**:
Arquivo que a campanha não muta mas de que o poder da prova depende — oráculo
(suíte de gate), fixture, declaração (`.gitattributes`), julgador, registro que o
gate lê. Entra no gatilho com razão de CLASSE declarada e legível por máquina:
mudar nele muda o que a campanha prova, não o que ela muta. Arquivo que é mutado
E insumo classifica-se como conjunto mutado — uma classificação por arquivo.
A razão de classe é **vocabulário fechado**: normativo em
`specs/017-semantica-do-gatilho/spec.md` §Vocabulário fechado, pinado em
`check_mutation.py → D017_CLASSES` e ampliável só por errata com id. Os exemplos
acima dizem o que um insumo É; **não** são as classes — que são identificadores
(INV-10), não termos deste glossário, e não coincidem com esta lista: há classe
que absorve dois destes exemplos e há classe sem exemplo aqui. A lista canônica
lê-se na fonte, nunca daqui.
_Evitar_: alvo extra, desvio declarado, endurecimento do trigger, excedente (é o
rótulo do sintoma no `IC-6`, que pressupõe identidade)

**Alvo fantasma**:
Path no gatilho que não é conjunto mutado nem insumo de prova com razão —
dispara a campanha por mudança que não altera o que ela muta nem o que ela
prova. Instância histórica: `ui_session_v32.js` em `p51.targets` até a 013
(`M-IC9`). Distinto do arquivo órfão de campanha (`EA-3`), que está fora de todo
gatilho.
_Evitar_: alvo declarado que o harness não muta (mensagem do `IC-6`, que acusa
também o insumo legítimo), excedente, alvo morto

**Regra morta**:
Declaração CSS que permanece no arquivo e não decide nenhuma propriedade
renderizada, porque outra declaração vence a cascata — importância, depois
especificidade, depois ordem de inlining. Mutar regra morta troca texto sem mudar
produto.
_Evitar_: regra órfã, CSS não usado, seletor morto, código morto

**Cópia morta**:
Mesmo conteúdo existindo duas vezes no DOM, uma das cópias oculta e portanto
nunca lida pelo cliente. Não é defeito do relatório — é risco de instrumento:
oráculo que deduplica por ordem de documento pode pinar a cópia oculta e passar
a medir o que ninguém vê. Distinta de *regra morta*, onde o morto é a declaração
e não o nó.
_Evitar_: duplicata, resíduo, nó órfão, sobra

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

**Declaração viva e inobservável**:
Declaração que **vence** a cascata para a própria propriedade — e que a varredura
de regra morta, portanto, dá por **viva** — e que ainda assim não altera nada que
um gate consiga medir, porque o efeito visual que ela governaria já está
determinado por **outra propriedade**, possivelmente de outra camada. O critério
que a separa: *viva* decide-se **por propriedade** e sem navegador; *observável*
decide-se **por efeito**, e efeito só um navegador resolve. Mutar uma delas produz
SOBREVIVENTE sem que nada esteja podre — o instrumento e o gate estão ambos
certos, e medem coisas diferentes.
_Evitar_: regra morta (é o oposto — aquela não decide nem a própria propriedade),
mutante fraco, falso sobrevivente, gate sem poder discriminante (esse é o `EA-20`,
e nasce de outra causa)

**Varredura de regra morta**:
Checagem estática que, para cada mutante de CSS, prova que a declaração resultante
decide ao menos uma propriedade — cascata, sem navegador. Distinta da varredura de
gate constante (achado EA-20), que mede expressão e alcançabilidade de estado.
_Evitar_: varredura de gates sem poder discriminante, lint de CSS morto

**Cláusula sentinela**:
Alínea de gate que não pode falhar no estado atual do produto, mas cujo **gatilho
de falsificação é nomeado** — existe para apanhar a regressão no dia em que o
gatilho disparar. Fica **sem mutante**, e a ausência é declarada, nunca dívida.
Distinta da *cláusula defensiva inalcançável por construção* (`design-decisions.md`
§Candidatas), que **nenhuma** mudança pode tornar falsa e cuja disposição é "não
reporte": sentinela é falsificável, e a sua disposição é "reavalie quando o gatilho
disparar".
_Evitar_: cláusula defensiva, código morto, dívida de mutante

**Fecho de demanda**:
Transição do planning-state para `done`, só legítima com a Fase 6 completa
(`spec-validate.md` e `relatorio-final.md` em disco, aceite de intenção
registrado) e o PR aberto — sempre ANTES do merge. É o fecho que libera o check
pré-merge `fecho` (`D016-PR1`), nunca o merge que produz o fecho; CI verde é
condição do merge, não do fecho.
_Evitar_: encerramento, conclusão da demanda, "mover para done", CI verde,
selagem (é de fase, não de demanda)

**Demanda mesclada sem fecho**:
Estado em que o merge da branch da demanda já está no histórico de `develop` sem
que o fecho de demanda exista — planning-state fora de `done`, ou `done` sem os
artefatos da Fase 6 em disco. É violação medida pela máquina (git × registro,
stage `fecho`; a história anterior ao piso de `fecho.json` não é julgada, R13),
nunca demanda em voo; a saída honesta é o fecho retroativo (R4 §Violação
detectada) ou um fecho pendente declarado.
_Evitar_: em voo (é OUTRO estado: não mesclada), fase aberta, pendência de
registro, atraso de estado

**Fecho pendente declarado**:
Exceção nominal `fecho_pendente {motivo, dono, prazo}` gravada no planning-state
de uma demanda mesclada sem fecho — e só nela: antes do merge é prematura, em
demanda `done` é obsoleta, e ambas reprovam. Impressa a cada verificação e
listada pelo compliance-audit como os waivers; "vencida" é prazo anterior à
data do commit julgado, nunca ao relógio. Nomeia a dívida enquanto os artefatos
da Fase 6 não existem — nunca os substitui nem libera merge: o veredito
pré-merge `FECHO PENDENTE` é reprovação, não válvula.
_Evitar_: waiver de fecho, done provisório, exceção de merge, licença para mesclar

**Selagem**:
Ato do auditor humano que congela uma fase: release develop→main com tag anotada;
a boundary da fase fecha para sempre.
_Evitar_: entrega, conclusão de sprint

**Acervo de evidência**:
Conjunto congelado de artefatos (screenshots, PDFs, medidas JSON) que sustenta a
selagem de uma fase ou rodada; imutável após a selagem, com identidade por
manifesto de hashes.
_Evitar_: pasta de prints, anexos, evidências soltas

**Evidence store**:
Destino externo ao clone onde acervos de evidência publicados vivem — pela
decisão Q1 (2026-08-25), GitHub Releases, um release por fase com assets
verificados por hash. O repositório versiona o manifesto, nunca os bytes.
_Evitar_: backup, pasta externa, storage

**Manifesto-ponte**:
Arquivo versionado e pinável que liga cada artefato migrado ao evidence store:
hash original (idêntico ao manifesto de fase), pacote e destino. É o que preserva
a verificabilidade depois que os bytes saem do índice do git.
_Evitar_: índice de links, lista de hashes, planilha

**Commit-âncora**:
SHA imutável (40 hex) de um commit em que o acervo migrado ainda está no índice —
é dele que oráculos leem listas e blobs (`git ls-tree`/`git show`), nunca de
`HEAD:` ou branch (R10 §5). Registrado no manifesto-ponte, exige histórico
completo no clone (`fetch-depth: 0`).
_Evitar_: último commit, HEAD, commit de referência

**Pacote de auditoria**:
ZIP único e congelado que empacota a evidência visual/print de uma rodada da era
V3.2 (`visual_print_evidence_47/48/487.zip`), publicado na raiz do repo e lido
por oráculo de sessão como prova de paridade entre claims e artefatos.
_Evitar_: zip de prints, backup, anexo

**Acervo-arquivo**:
Acervo de evidência cujo conteúdo é um único arquivo rastreado (ex.: pacote de
auditoria da raiz). No manifesto-ponte, entrada com `tipo: "arquivo"`, `path`
explícito, exatamente 1 item em `arquivos` e `sha256_pacote` igual ao hash do
próprio blob; contrasta com o acervo-diretório (default `tipo: "diretorio"`,
regime da 007).
_Evitar_: zip avulso, acervo unitário, arquivo solto

**Achado**:
Registro durável de defeito ou anomalia no backlog (`.claude/BACKLOG.md`), com
id permanente da série `EA-*` e cadeia arquivo:linha→efeito obrigatória — sem
cadeia é palpite (R12). Distinto de exceção nominal (`known_issues.json`, que
suspende um lint com prazo) e de decisão de desenho (`design-decisions.md`).
_Evitar_: bug, issue, pendência, problema conhecido

**Status de achado**:
Campo de vocabulário fechado, um por achado, legível por máquina e auditado
pelo `compliance-audit` (seção `backlog`): `aberto` · `resolvido` · `refutado`
· `transferido`. Nunca prosa livre; refutado mantém a linha de status limpa e
risca o restante (R2 §5).
_Evitar_: situação, estado (genérico), "Status: aberto." em prosa

**Frente de investimento**:
Capability para a qual o relatório propõe investimento na onda corrente. É a
unidade que o teto conta — capability sem gap não vira frente, porque não há o
que investir, e isso não é corte pelo teto.
_Evitar_: recomendação, item, produto sugerido

**Onda**:
Conjunto de frentes apresentado junto, com a primeira sendo o que se ataca agora.
O que não cabe na primeira é declarado como onda seguinte, nunca removido do
relatório — a distinção é entre *quando*, não entre *se*.
_Evitar_: fase, etapa, roadmap, sprint

**Teto de frentes**:
Número máximo de frentes que o relatório abre por conta própria, derivado do
estágio de maturidade que ele já mediu — é o índice da banda de
`__QS_STAGE_RULER` que contém o score geral, com piso 1. Não alcança prioridade
declarada pelo negócio, e não existe quando não há suficiência.
_Evitar_: limite, quota, capacidade, budget

**Substituto**:
Leitura V3.2 que a seção de apoio pode apresentar NO LUGAR da recomendação
congelada da Camada 1 — e cuja existência é a condição para ocultá-la. Um caso
pertence quando o relatório publica, naquela sessão, ao menos uma leitura própria
de apoio sob o gate de suficiência ABERTO: card de capability com conteúdo do
motor, ou produto publicado na visão por produto. Não pertence o que o próprio
relatório declara não-publicável, nem o que a curadoria retirou. A lista canônica
de produtos publicados vive em `__CURATION.published()` e o predicado em
`hasSubstituteV32()` — este verbete define o CRITÉRIO e referencia a fonte, nunca
a copia (R12 / `EA-47`). Distinto de *Importação substitutiva* (mesma raiz, outra
família): lá o substituído é a sessão aberta, pelo documento importado; aqui é a
leitura congelada, pela leitura V3.2.
_Evitar_: alternativa, equivalente, troca, recomendação V3.2
