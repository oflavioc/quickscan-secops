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
como estão (INV-10).
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
_Evitar_: modo legado, supressão, fallback

**Convergência no card**:
Forma de apresentação em que o habilitador é uma linha discreta DENTRO do card da
prática-alvo, em vez de uma seção própria. É aditiva: não implica dissolver a seção
de apoio, que carrega também conteúdo não-comercial (capabilities a validar, tiers).
_Evitar_: fusão de seções, unificação, merge de blocos

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
Distinta do alvo (o arquivo) e da propriedade (o comportamento defendido).
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

**Alvo declarado de campanha**:
Conjunto de paths em `mutation_map.json → targets` que dispara a re-execução de
um harness por gatilho de path. Deve ser exatamente o conjunto de arquivos que o
harness muta, mais o próprio harness.
_Evitar_: arquivo do mutante, escopo da campanha

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
**Cláusula sentinela**:
Alínea de gate que não pode falhar no estado atual do produto, mas cujo **gatilho
de falsificação é nomeado** — existe para apanhar a regressão no dia em que o
gatilho disparar. Fica **sem mutante**, e a ausência é declarada, nunca dívida.
Distinta da *cláusula defensiva inalcançável por construção* (`design-decisions.md`
§Candidatas), que **nenhuma** mudança pode tornar falsa e cuja disposição é "não
reporte": sentinela é falsificável, e a sua disposição é "reavalie quando o gatilho
disparar".
_Evitar_: cláusula defensiva, código morto, dívida de mutante
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
