# CONTEXT — glossário canônico

> Mantido pelo `product-owner` na Fase 0 de cada demanda (R12). Só glossário:
> o que cada conceito É, em uma ou duas frases. Doc, spec e prompt novos usam o
> termo daqui, sem derivar para os sinônimos evitados.

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
