# QUICKSCAN SECOps SOC-CMM V3.2+
# ROADMAP CANDIDATE — PHASE 5.0
## Assessment Experience, Evidence UX & Sufficiency-Aware Results
### Especificação candidata · REVISÃO A · NÃO AUTORIZADA PARA IMPLEMENTAÇÃO

```text
ROADMAP CANDIDATE
NON-NORMATIVE
NOT AUTHORIZED FOR IMPLEMENTATION
DO NOT USE AS CURRENT PHASE SPEC
```

**Status:** ROADMAP CANDIDATE / DESIGN SPEC ONLY  
**Idioma normativo:** PT-BR  
**Implementação:** PROIBIDA até autorização explícita posterior  
**Pré-condição mínima:** Phase 4.9 formalmente FROZEN por auditoria independente e roadmap subsequente aprovado  
**Referência externa de inspiração:** SOCSCOPE / SOC Maturity Platform — screenshots e site público fornecidos para benchmark visual/UX.  
**Regra:** a referência externa é **não normativa**. Nenhum texto, scoring, mapeamento, comportamento ou estrutura proprietária deve ser copiado como fonte de verdade do Quickscan.

---

# 0.A HISTÓRICO DE REVISÃO E ESTADO CORRENTE

## Revisões

```text
REV 0  Spec candidata original.
REV A  Incorpora integralmente os achados da auditoria técnica
       independente da candidata (A-01, A-02, B-01, B-02, B-03,
       C-01, C-02, C-03) e os gates derivados GOV1 e UX9.
       Nenhuma mudança de arquitetura da fase; apenas
       fortalecimento de contrato.
```

## Estado corrente declarado do projeto (na data desta revisão)

```text
Phase 4.8   FROZEN
Phase 4.9   IMPLEMENTATION COMPLETE · AWAITING INDEPENDENT AUDIT · NOT YET FROZEN
Phase 5.0   ROADMAP CANDIDATE · NOT AUTHORIZED
```

Este bloco registra o estado **declarado** pela governança do projeto no momento da revisão. Ele não substitui o START/HANDOFF vigente: qualquer sessão futura deve reconfirmar o estado corrente pela fonte normativa atual antes de agir. A pré-condição desta candidata permanece inalterada: Phase 4.9 formalmente FROZEN por auditoria independente e roadmap subsequente aprovado.

## Localização recomendada deste arquivo

```text
ROADMAP/
└─ candidates/
   └─ QUICKSCAN_PHASE_5.0_ASSESSMENT_EXPERIENCE_CANDIDATE_SPEC_REV_A.md
```

Manter fora de `specs/current/` e de qualquer cadeia normativa ativa, para que nenhuma sessão futura o confunda com especificação de fase autorizada.

---

# 0. PROPÓSITO DESTA SPEC

Esta especificação descreve uma candidata futura **Phase 5.0 — Assessment Experience, Evidence UX & Sufficiency-Aware Results** para evoluir a experiência de uso do Quickscan sem reabrir silenciosamente metodologia, scoring ou contratos congelados.

Objetivos:

1. reduzir carga cognitiva durante discovery/assessment;
2. aumentar consistência de interpretação das respostas;
3. capturar evidência/racional no momento da entrevista;
4. tornar progresso, suficiência e estado de avaliação visualmente inequívocos;
5. tornar resultados mais executivos sem fabricar precisão;
6. tornar `UNSET ≠ NONE` visível na interface;
7. expor Session Portability com wording honesto sobre persistência;
8. melhorar navegação, acessibilidade, responsividade e legibilidade;
9. permitir visualizações derivadas somente quando houver fonte canônica e provenance explícita;
10. transformar os invariantes metodológicos do Quickscan em **comportamentos visíveis da UI**.

Esta fase deve ser tratada como evolução de **experiência e apresentação**, não como oportunidade para “melhorar” scoring ou metodologia.

---

# 1. GATE DE ENTRADA

A Phase 5.0 NÃO pode começar enquanto:

```text
Phase 4.9 != FROZEN
```

e enquanto não houver autorização explícita para a próxima linha de desenvolvimento após a V3.2.

Mesmo após o freeze da 4.9:

```text
ROADMAP APPROVAL
        ↓
PHASE 5.0 SPEC REVIEW
        ↓
CHANGE BOUNDARY APPROVED
        ↓
IMPLEMENTATION
```

Não iniciar automaticamente.

---

# 2. BASELINE E INVARIANTES QUE A PHASE 5.0 DEVE HERDAR

A implementação futura deverá partir do baseline formalmente aprovado na ocasião.

Até nova autorização normativa, permanecem protegidos:

- engine;
- methodology;
- scoring;
- perguntas;
- domains;
- stages;
- sufficiency rules;
- findings;
- severity;
- Recommendation Context;
- Current × Target semantics;
- Operational Refinement semantics;
- Journey/Narrative semantics;
- portfolio semantics;
- M41;
- schemaVersion 1;
- Session Portability canonical owners;
- separação canonical owner × derived state.

Invariantes obrigatórios:

```text
technology alone NEVER increases maturity
UNSET != NONE
derived state is NEVER canonical source of truth
insufficient evidence MUST NOT produce executive-grade maturity verdict
session import starts from canonical inputs and recomputes derived outputs
invalid/untrusted imported JSON cannot manufacture canonical states
```

Qualquer requisito desta spec que conflite com esses invariantes deve ser interpretado de forma conservadora ou removido.

---

# 3. BENCHMARK EXTERNO — O QUE É E O QUE NÃO É

As screenshots de referência mostram padrões úteis de UX:

- navegação por domínio/aspecto;
- progresso global;
- estimativa de tempo;
- answer cards;
- labels verbais;
- feedback contextual abaixo da resposta;
- metadados por pergunta;
- rationale/evidence textarea;
- navegação Basic/Advanced;
- resultados com cards, radar, heat map e visão NIST;
- sidebar contextual.

Esses padrões servem exclusivamente como **benchmark de interação**.

Não são fonte normativa de:

- maturidade;
- nomenclatura;
- escala;
- framework mapping;
- scoring;
- target;
- suficiência;
- definição de L0–L5;
- cálculo NIST;
- regras comerciais;
- question bank.

Não copiar visual identity, textos ou asset design.

O Quickscan deve produzir solução visual própria, coerente com seu design system e governança.

---

# 4. PRINCÍPIOS DE UX

## UX-P1 — Evidence before score

A interface deve privilegiar:

```text
evidência
→ suficiência
→ interpretação
→ score
```

Nunca:

```text
resposta parcial
→ score executivo aparente
```

## UX-P2 — Unknown is visible

`UNSET` não pode ser visualmente representado como zero, ausência, falha ou baixa maturidade.

## UX-P3 — Guidance without methodology drift

Ajuda visual pode esclarecer opções já existentes, mas não pode criar nova semântica de scoring.

## UX-P4 — Progressive disclosure

Mostrar detalhe quando necessário sem obrigar todos os usuários a navegar por densidade máxima.

## UX-P5 — State honesty

A UI não pode comunicar “salvo”, “persistido”, “cobertura zero” ou “resultado final” quando o runtime não prova isso.

## UX-P6 — Derived views are labeled as derived

NIST/CIS/Target/Journey ou qualquer framework correlato deve explicitar provenance e natureza derivada.

## UX-P7 — Accessible without color alone

Estado, prioridade, maturidade, insuficiência e seleção não podem depender exclusivamente de cor.

## UX-P8 — No hidden methodological side effects

Trocar aba, modo, filtro ou visualização não pode alterar score ou canonical state.

---

# 5. ESCOPO FUNCIONAL CANDIDATO

A Phase 5.0 pode ser organizada em cinco microfases para reduzir risco:

```text
5.0.1  Assessment Shell & Answer Semantics
5.0.2  Evidence Capture & Progress UX
5.0.3  Sufficiency-Aware Results
5.0.4  Derived Framework & Target Visualizations
5.0.5  Accessibility, Responsive & Visual Closure
```

A numeração é candidata e poderá ser ajustada no roadmap formal.

---

# 6. REQUISITOS — ASSESSMENT SHELL

## UI-001 — Hierarquia de navegação

A tela de assessment deve permitir leitura imediata de:

```text
assessment
→ domain
→ aspect/capability
→ question
```

A navegação deve expor:

- domínio atual;
- aspecto/capability atual;
- posição no aspecto;
- progresso do domínio;
- progresso global.

### Critério de aceite

Em qualquer pergunta, o usuário consegue identificar domínio, aspecto e posição sem rolagem para o topo.

---

## UI-002 — Sidebar contextual

Pode existir sidebar lateral de resumo, desde que:

- não exiba `0.0` para domínio/aspecto `UNSET`;
- use `—`, `Não avaliado` ou representação equivalente para UNSET;
- diferencie `NONE/ausência confirmada` de `UNSET`;
- não calcule score executivo se o gate de suficiência estiver fechado.

### Proibido

```text
Process 0.0
```

quando Process não foi avaliado.

### Esperado

```text
Process —
Não avaliado
```

---

## UI-003 — Answer cards com âncoras verbais

Cada opção canônica deve mostrar:

```text
canonical value
+
verbal anchor
```

Exemplo apenas visual:

```text
1  Não
2  Parcialmente
3  Moderadamente
4  Majoritariamente
5  Plenamente
```

### REGRA CRÍTICA

Os textos acima são **candidatos de UX**, não novos valores metodológicos.

Antes da implementação:

1. ler opções canônicas reais;
2. mapear cada label ao ID/valor existente;
3. provar que nenhum valor foi criado/removido/reordenado;
4. submeter wording final à revisão metodológica/conteúdo.

A apresentação não pode mudar o valor persistido nem o scoring.

---

## UI-004 — Seleção acessível

Answer cards devem funcionar como grupo semântico equivalente a radio group.

Exigir:

- teclado;
- focus visible;
- label programático;
- estado selected programático;
- ordem previsível;
- nenhuma dependência de hover.

---

# 7. FEEDBACK SEMÂNTICO DA RESPOSTA

## UI-005 — Response interpretation cue

Após seleção, a UI pode exibir uma frase curta explicando a interpretação operacional da resposta.

Exemplo conceitual:

```text
Selecionado: Parcialmente
“Existe prática identificável, porém ainda inconsistente ou incompleta.”
```

### REGRA DE GOVERNANÇA

Isto **não é automaticamente UI-only**.

Um dicionário `question × answer → semantic cue` pode influenciar a forma como o entrevistado responde e, portanto, funciona como conteúdo metodológico auxiliar.

A implementação só é permitida se uma das condições for verdadeira:

### Caminho A
A frase é derivada de guidance já canônico/aprovado para aquela opção/pergunta.

### Caminho B
Uma microfase de conteúdo separada aprova e congela os descriptors.

### Caminho C
Usar apenas descritor genérico da opção, sem semântica específica da pergunta.

### Proibido

Gerar descriptors por IA em runtime.

Inventar guidance baseado no benchmark externo.

Alterar score com base no descriptor.

---

# 8. CAPTURA DE EVIDÊNCIA

## UI-006 — Evidence/rationale inline

Disponibilizar campo de evidência/racional próximo ao contexto onde a informação é coletada.

Placeholder candidato:

```text
Registre evidência, racional, fonte, observação ou contexto adicional...
```

### Boundary

O campo deve bindar a um **canonical owner já existente**.

Se o schema atual só possuir nota por aspecto e a UI desejada exigir nota por pergunta:

```text
STOP
```

Não criar novo owner ou mudar `schemaVersion` dentro de uma fase declarada UI-only.

---

## UI-007 — Indicador de evidência

Quando aplicável, a interface pode distinguir:

```text
evidência registrada
sem evidência registrada
```

Isso é presença de nota/evidência, não “verdade” da resposta.

Não transformar automaticamente existência de nota em `confirmed`.

---

## UI-008 — Metadata chips

A pergunta pode exibir chips como:

```text
Question ID
Domain/Aspect ID
importance/weight class, se canônico
framework mapping, se canônico
evidence status, se canônico
```

### Regra

Nenhum chip pode inventar mapping ou classificação.

Toda informação deve possuir source/provenance identificável.

---

# 9. PROGRESSO E EXPECTATIVA

## UI-009 — Progresso global e segmentado

Mostrar separadamente:

```text
respondido
total aplicável
progresso de suficiência
(na unidade canônica retornada pelo sufficiency contract — ver UI-009A)
```

Não misturar completion com sufficiency.

Exemplo:

```text
Conclusão: 18/30 respostas
Suficiência: Process precisa de +1 <unidade canônica>
```

O exemplo é **ilustrativo**. A unidade real exibida (respostas, confirmações, itens de evidência ou outra) é definida exclusivamente pelo contrato canônico de sufficiency do baseline — ver UI-009A.

---

## UI-009A — Canonical Sufficiency Currency

A unidade exibida para progresso de suficiência deve ser **exatamente** a unidade utilizada pelo gate canônico do baseline.

A UI não define, não traduz, não aproxima, não endurece e não afrouxa a moeda de suficiência. Ela apenas apresenta a avaliação retornada pelo contrato canônico de sufficiency.

### Proibido

A UI não pode substituir:

```text
answers → confirmed answers
questions → capabilities
domains → evidence items
```

ou qualquer outra unidade, sem mudança normativa aprovada.

### Nota de origem

O termo "confirmadas" usado em rascunhos e protótipos anteriores era contaminação vinda da taxonomia do template de relatório (✅/⚠/❓). Essa taxonomia **não** é assumida como canônica pelo produto. Ver UI-021 para a regra de governança correspondente.

### Gate associado

SUF0 (seção 25).

---

## UI-010 — Tempo restante estimado

Pode ser exibido como:

```text
≈ 18 min restantes
```

Nunca como SLA ou valor exato.

### Modelo aceitável

Preferência:

```text
remaining applicable questions
×
rolling median time per answered question
```

Fallback:

```text
fixed documented estimate
```

### Regras

- usar símbolo `≈`;
- esconder se não houver amostra razoável;
- não persistir comportamento individual desnecessariamente;
- não enviar telemetry;
- não alterar assessment logic.

---

## UI-010A — UX-derived ephemeral state

Fica definida a categoria formal **UX-derived ephemeral state**, incluindo, no mínimo:

```text
tempo por pergunta
rolling median de tempo
estimated remaining time
expanded/collapsed panels
selected results tab
scroll position
presentation-only Basic/Advanced preference
chart hover/focus state
```

### Regra

```text
UX-derived ephemeral state MUST NOT enter the canonical
session document unless a future schema contract explicitly
promotes that field to canonical state.
```

Esta regra é a extensão, para a camada de UX, do invariante já provado de derived-injection-rejection da Session Portability: estado derivado nunca vira fonte canônica por conveniência de implementação.

### Gates associados

SESUX5 (exclusão no export) e o gate adversarial de import correspondente (tentativa de injeção desses campos como propriedades reserved/unknown deve ser tratada conforme o contrato de strictness do schema vigente).

---

# 10. SESSION PORTABILITY — MENSAGEM HONESTA

## UI-011 — Não copiar “Saved — close tab and resume anytime”

Esse padrão NÃO deve ser adotado enquanto o Quickscan não implementar persistência automática.

### Estado padrão

Mensagem candidata:

```text
Sessão não salva automaticamente.
Exporte o arquivo da sessão para continuar depois.
```

### Após export bem-sucedido

```text
Sessão exportada.
Guarde o arquivo JSON para retomar posteriormente.
```

### Após import

```text
Sessão carregada do arquivo.
Novas alterações não são salvas automaticamente.
```

### Gate

Nenhuma ocorrência de:

```text
Saved
Auto-saved
Pode fechar a aba com segurança
Retome automaticamente
```

sem funcionalidade que prove essa afirmação.

---

# 11. SUFICIÊNCIA VISÍVEL

## UI-012 — Sufficiency Gate como componente de primeira classe

Antes de apresentar score executivo, a UI deve verificar o gate canônico.

Enquanto insuficiente:

```text
Executive Score: LOCKED
```

Exibir mensagem construtiva baseada no gate real.

Exemplo:

```text
Resultado ainda indisponível

<condições pendentes retornadas pelo runtime>
Process: requisito mínimo de suficiência não atingido
Services: requisito mínimo de suficiência não atingido

Continue o assessment para atingir evidência suficiente.
```

O exemplo é ilustrativo e não presume unidade de contagem. A UI apresenta as razões/condições de insuficiência **retornadas pelo runtime**, na unidade canônica do gate (UI-009A), e não reconstrói a lógica de suficiência no renderer (SUF0, SUF3).

---

## UI-013 — Não mostrar overall maturity como 0 ou baixo score quando insuficiente

Proibido:

```text
Overall Maturity 0.87
Stage Initial
```

se o gate canônico não autorizar esse veredito.

### Permitido durante insuficiência

- completion;
- evidence counts;
- missing domains;
- readiness to score;
- coverage of responses;
- navigation.

---

## UI-014 — Domain score insufficient

Se domínio não possuir suficiência:

```text
Domain —
Insufficient evidence
```

e não:

```text
Domain 0.0
```

---

# 12. HEAT MAP

## UI-015 — Heat map por domínio/aspecto

Criar visão compacta capaz de mostrar:

- assessed maturity/state;
- UNSET;
- NONE/confirmed absence;
- insufficient;
- N/A, se canônico;
- target gap, se aplicável e suportado.

---

## UI-016 — UNSET ≠ NONE visual

Exigir representação não baseada apenas em cor.

Exemplo:

```text
UNSET
—  Não avaliado
neutral/dashed pattern

NONE
0 / Ausente confirmado
explicit icon + label
```

A palavra/valor exato deve seguir o contrato canônico.

### Gate adversarial

Criar fixture com:

```text
Aspect A = UNSET
Aspect B = canonical NONE
```

e provar:

```text
DOM semantics differ
visible label differs
accessible name differs
print/PDF representation differs
```

---

# 13. CURRENT × TARGET

## UI-017 — Current vs Target radar

Pode ser criado radar/visual equivalente usando **somente o Target Profile canônico já existente**.

Não usar target fixo `3.0`.

O target precisa ser o target definido no assessment.

---

## UI-018 — Target não altera Current

Alterar/visualizar target nunca pode alterar:

```text
current answers
current score
current findings
current sufficiency
canonical assessment state unrelated to target
```

---

## UI-019 — Current insuficiente

Se Current não tiver suficiência:

- não desenhar linha/polígono current como zero;
- não preencher missing points como `0`;
- exibir missing/insufficient state;
- target pode ser exibido separadamente apenas se isso não induzir comparação falsa.

---

# 14. STRENGTHS / PRIORITY IMPROVEMENTS

## UI-020 — Executive cards somente após gate

Cards como:

```text
Key Strengths
Priority Improvements
Gap to Target
```

só podem ser exibidos quando seus gates canônicos permitirem.

Não construir ranking executivo sobre UNSET.

---

## UI-021 — Evidence qualification

Onde existir status canônico, distinguir:

```text
confirmed
preliminary/hypothesis
insufficient
not assessed
```

Não inferir “confirmed” pela existência de resposta ou nota.

### Regra de governança da taxonomia

```text
se a taxonomia existir como estado canônico
→ pode renderizar

se não existir
→ não inventar; a UI opera sem ela

introdução futura da taxonomia
→ microfase dedicada de schema/content/methodology

Wave 1 funciona integralmente sem essa taxonomia
```

Esta regra remove uma contaminação identificada em auditoria: a taxonomia ✅/⚠/❓ pertence hoje ao template de relatório consultivo, não ao modelo canônico do produto.

---

# 15. FRAMEWORK VIEWS — NIST / CIS

## UI-022 — Derived mapping label obrigatório

Qualquer painel NIST deve apresentar label inequívoco, por exemplo:

```text
Cobertura NIST CSF 2.0 derivada
a partir do mapeamento do Quickscan
```

e não:

```text
NIST CSF 2.0 Assessment Score
```

se o Quickscan não executou assessment NIST direto.

---

## UI-023 — No-data não é zero

Para uma função/subcategoria sem evidência mapeada suficiente:

```text
—
Sem evidência avaliada
```

ou:

```text
Insuficiente
```

Não renderizar `0%` por simples ausência de respostas.

---

## UI-024 — Mapping provenance

Todo framework mapping deve registrar:

- framework;
- versão;
- mapping dataset version;
- source/owner;
- mapping direction;
- one-to-one / one-to-many behavior;
- método de aggregation;
- limitations.

Se não existir dataset canônico aprovado:

```text
FEATURE BLOCKED
```

Não criar mapping oportunisticamente dentro da UI.

---

## UI-025 — No feedback into maturity

NIST/CIS derived coverage:

```text
MUST NOT feed maturity score
MUST NOT change stage
MUST NOT change sufficiency
MUST NOT create findings by itself
```

sem autorização metodológica específica.

---

# 16. BASIC / ADVANCED MODE

## UI-026 — Toggle candidato, não automaticamente aprovado

O padrão é desejável, porém possui risco metodológico.

Antes da implementação, definir qual dos modelos abaixo vale:

### Modelo 1 — View density only
Basic/Advanced muda somente quantidade de ajuda/metadata visível.

**Preferido para Phase 5.0 UI-only.**

### Modelo 2 — Assessment depth
Basic/Advanced muda question set.

Isso NÃO é UI-only e exige contrato normativo separado para:

- applicability;
- scoring;
- sufficiency;
- session roundtrip;
- comparison between modes;
- report labeling.

### Gate obrigatório

Se `mode` mudar apenas apresentação:

```text
canonical assessment state before == after
score before == after
sufficiency before == after
```

---

# 17. CONDITIONAL QUESTIONS

## UI-027 — Conditional reveal

Subperguntas condicionais só podem ser usadas para:

- fields/questions que já existam no modelo canônico;
- regras de applicability já aprovadas.

Não criar novas perguntas por conveniência de UI.

### Gate

Condition false:

```text
hidden field does not fabricate canonical value
```

Condition true:

```text
field appears
existing value restored if canonical contract says it should persist
```

---

# 18. RESULTS INFORMATION ARCHITECTURE

## UI-028 — Results tabs candidatas

Estrutura possível:

```text
Summary
Domains
Heat Map
Framework Mapping
Analysis
```

Nomes finais devem seguir produto.

---

## UI-029 — Summary

Quando suficiente:

- overall maturity;
- target context;
- evidence/sufficiency badge;
- domain profile;
- strengths/priorities;
- current × target.

Quando insuficiente:

- completion;
- sufficiency progress;
- missing evidence;
- blocked executive results.

---

## UI-030 — Domain view

Permitir drill-down:

```text
domain
→ aspect
→ underlying assessed evidence/questions
```

Resultado deve ser explicável.

---

# 19. VISUAL DESIGN SYSTEM

## UI-031 — Design tokens próprios

Criar tokens sem copiar o benchmark:

```text
surface
surface-elevated
border
text-primary
text-secondary
accent-primary
state-positive
state-warning
state-negative
state-unknown
state-derived
focus
target
```

### Regra

Os tokens são **semânticos**: nenhuma cor física é congelada nesta candidata. A palette concreta depende da decisão pendente BRANDING-01 (ver UI-033).

---

## UI-032 — Dark theme

Dark theme é candidato apropriado, mas deve atender legibilidade/acessibilidade.

Não usar Fortinet branding como justificativa para contraste insuficiente.

---

## UI-033 — Color semantics

Cores devem possuir meaning consistente.

Exemplo:

```text
cyan/accent = selection/navigation
green = confirmed/pass
amber = attention/preliminary
red = confirmed deficiency
gray = unknown/unset
purple = derived framework view
dashed = target
```

A semântica final deve ser congelada em design tokens.

Nunca usar só cor.

### Decisão pendente obrigatória no decision log

```text
BRANDING-01
Fortinet-aligned product UI
vs
Quickscan-neutral product identity
```

Critérios de decisão: contraste (incl. vermelho Fortinet sobre dark ≥ 4.5:1 quando usado em texto); implicações dark/light; Fortinet brand governance; uso interno vs eventual distribuição; coerência com relatórios; acessibilidade; impressão.

Nenhuma palette (cyan, Fortinet red ou outra) é congelada antes de BRANDING-01.

---

## UI-033A — Idioma baseline

```text
UI language baseline: PT-BR
```

A Phase 5.0 **não** implementa internacionalização por default. Strings novas devem, entretanto, permanecer centralizáveis e evitar dependência estrutural do texto, para permitir futura localização. EN/i18n é future scope e não pode ser introduzido como efeito colateral desta fase.

---

# 20. ACCESSIBILITY

## UI-034 — WCAG target

Objetivo de design:

```text
WCAG 2.2 AA
```

para a superfície de assessment/resultados nova, exceto limitações formalmente documentadas.

---

## UI-035 — Contrast

Normal text:

```text
>= 4.5:1
```

Large text:

```text
>= 3:1
```

UI state/focus deve cumprir os requisitos aplicáveis de contraste.

---

## UI-036 — Keyboard

Todo fluxo crítico deve ser completável sem mouse:

- tabs;
- domain navigation;
- aspect navigation;
- answer selection;
- notes;
- next/previous;
- export/import;
- results navigation.

---

## UI-037 — Focus

Focus indicator claro e persistente.

Não remover outline sem substituto equivalente.

---

## UI-038 — Target size

Controls interativos devem atender ao menos o requisito AA aplicável de target size e preferencialmente oferecer área confortável para notebook/tablet.

---

## UI-039 — Screen reader semantics

Exigir landmarks/labels apropriados.

Charts precisam de alternativa textual ou tabela equivalente para seus dados essenciais.

---

# 21. RESPONSIVE

## UI-040 — Breakpoints

Testar ao menos:

```text
desktop wide
desktop/laptop
tablet landscape
tablet/narrow
```

Smartphone pode ser suportado somente se explicitamente aprovado como use case.

Não afirmar suporte por mera renderização.

---

## UI-041 — Sidebar collapse

Sidebar contextual pode colapsar em telas menores, sem remover acesso aos dados.

---

## UI-042 — Charts

Charts não podem:

- cortar labels;
- depender de hover;
- ficar ilegíveis;
- exigir zoom horizontal desnecessário.

Radar muito denso deve possuir alternativa tabular.

---

# 22. PERFORMANCE / LOCALITY

## UI-043 — Local-first preserved

A evolução visual não pode adicionar:

- telemetry;
- tracking;
- CDN obrigatório;
- remote font dependency obrigatória;
- network API;
- analytics;
- cloud persistence.

---

## UI-044 — Interaction latency

Seleção de resposta e navegação devem permanecer responsivas em datasets canônicos máximos.

Definir budgets após baseline measurement, não inventar números antes da instrumentação.

---

# 23. PRINT / PDF

## UI-045 — Screen/Print semantic parity

### Objetivo

UNSET, NONE, insufficient, target e derived-framework devem permanecer semanticamente distinguíveis nos artefatos em que forem autorizados.

Não depender apenas de background color.

### Boundary

A implementação em PDF/print depende de uma microfase explicitamente autorizada para reabrir a superfície Print/Render (ver Print/Render Boundary, seção 29). Até essa autorização, este requisito é **normativo de produto, porém BLOCKED para implementação**.

Este bloqueio existe para evitar contradição interna: o print pipeline e suas semânticas vêm de superfície congelada (Phase 4.7), e a Phase 5.0 não recebe implicitamente autorização para modificá-lo.

---

## UI-046 — Results consistency

Tela e PDF devem derivar do mesmo estado canônico/derived recomputation.

Não criar lógica de scoring específica do print.

---

## UI-046A — Insufficient Print Policy

Antes da implementação da microfase Print/Render, selecionar **normativamente** uma das duas políticas para geração de PDF com gate de suficiência fechado:

### Modelo A — COLLECTION_REPORT

Print permitido, sem executive score. O PDF contém:

```text
Assessment in progress
Sufficiency not reached
completion/evidence state
missing requirements
```

e nenhum maturity verdict executivo.

### Modelo B — BLOCK_PRINT

```text
Export Results/PDF unavailable
until sufficiency gate is satisfied
```

### Regra comum

Em **nenhuma** das políticas é permitido produzir score/stage executivo quando o gate de suficiência estiver fechado. A escolha entre COLLECTION_REPORT e BLOCK_PRINT é decisão consciente de design review — não do renderer.

### Fixture associada

PRINT-F1 (seção 26).

---

# 24. SECURITY / PRIVACY

## UI-047 — No new persistence claims

Nenhum componente novo pode afirmar autosave sem implementação e gate correspondentes.

---

## UI-048 — Notes may be sensitive

Evidence/rationale fields podem conter informação sensível do cliente.

Exibir orientação curta quando apropriado:

```text
Evite registrar segredos, credenciais ou dados pessoais desnecessários.
```

---

## UI-049 — Safe rendering

Toda nova saída de texto livre deve usar o mesmo modelo de escaping/safe rendering já congelado.

Adicionar adversarial tests para:

```text
<script>
<img onerror>
<svg/onload>
quotes
angle brackets
unicode edge cases
```

---

# 25. GATES EXECUTÁVEIS CANDIDATOS

Namespace recomendado:

```text
UX = assessment experience
SUF = sufficiency visualization
VIS = visual/Chromium
ACC = accessibility
MAP = derived framework mapping
SESUX = session UX
GOV = governance/boundary enforcement
```

Não reutilizar `S` da Session Portability.

## UX1 — Answer labels do not change canonical values
Selecionar cada label → canonical value esperado.

## UX2 — Keyboard answer selection
Arrow/Tab/Space behavior canônico e sem perda de state.

## UX3 — Semantic cue corresponds to selected canonical option
Sem cue stale ao trocar opção.

## UX4 — Evidence field binds only to approved canonical owner
Roundtrip preservado.

## UX5 — Metadata chips source from canonical metadata
Nenhum chip fabricado.

## UX6 — Navigation does not mutate answers
Domain/aspect/tab changes are presentation-only.

## UX7 — Basic/Advanced presentation-only mode does not mutate canonical state
Aplicável apenas se Modelo 1 for aprovado.

## UX8 — Conditional UI does not fabricate hidden values

## UX9 — Presentation state isolation
Mudanças exclusivamente visuais (tab, sidebar, expanded state, Basic/Advanced view-only mode, filter, chart selection) devem provar:

```text
canonical state before == canonical state after
session export before == session export after
score before == score after
sufficiency before == sufficiency after
```

Este gate resume a filosofia da fase: apresentação nunca produz efeito canônico.

## GOV1 — Protected-surface authorization
Antes de qualquer microfase:

```text
required file/surface
        ↓
inside approved change boundary?
        ├─ yes → proceed
        └─ no  → STOP
```

Aplicável especialmente a: engine, schema, question bank, print/render, framework mapping, content descriptors. Este gate transforma a change boundary em verificação executável, não apenas instrução.

---

## SUF0 — Renderer does not own sufficiency logic

```text
Given canonical assessment state X:
runtime sufficiency result = Y
UI must render Y.
```

O renderer não pode derivar independentemente outro resultado de suficiência a partir de contagens de resposta ou estado de apresentação — nem mais restritivo, nem mais permissivo que o runtime. Este gate precede e governa SUF1–SUF6.

## SUF1 — Insufficient overall score hidden
Fixture abaixo do gate → nenhum overall maturity executivo.

## SUF2 — Missing domain shows unknown, not zero

## SUF3 — Gate message uses runtime sufficiency reasons
Não reimplementar gate no renderer.

## SUF4 — Transition insufficient → sufficient
Ao atingir gate:

```text
results unlock from recomputed canonical state
```

## SUF5 — Sufficient → insufficient after answer change
Resultado volta a bloquear corretamente.

## SUF6 — UNSET vs NONE visible and semantic distinction
Requisitos atuais da candidata: screen + accessible name.
A asserção Print/PDF permanece **BLOCKED** até microfase Print/Render explicitamente autorizada, conforme UI-045 e Print/Render Boundary (seção 29).

---

## SESUX1A — Static prohibited-copy lint
Busca estática por expressões proibidas conhecidas ("Saved", "Auto-saved", "Pode fechar a aba com segurança", "Retome automaticamente" e variantes). Útil como lint; insuficiente sozinho.

## SESUX1B — Rendered persistence claim
No Chromium, o texto visível renderizado **e** o accessible/computed text dos componentes de status de sessão devem corresponder ao estado real da sessão.

Fixtures obrigatórias:

```text
fresh assessment
modified but not exported
export success
import success
post-import modification
export failure
```

Cada fixture deve provar que não existe claim de autosave/resume automático — inclusive quando o texto for composto por nós DOM separados, ícone+tooltip ou conteúdo dinâmico.

## SESUX2 — Export success wording only after successful export

## SESUX3 — Import wording does not imply automatic persistence

## SESUX4 — Session roundtrip remains canonical

## SESUX5 — UX-derived state exclusion

```text
Manipulate timing/view/presentation state
        ↓
export session
        ↓
JSON must contain none of those states
```

Complemento adversarial: tentar injetar campos de UX-derived ephemeral state (UI-010A) no import como propriedades reserved/unknown; o comportamento deve seguir o contrato de strictness do schema vigente (rejeição, nunca absorção silenciosa).

---

## MAP1 — Derived label present

## MAP2 — No data != 0%

## MAP3 — Mapping provenance visible

## MAP4 — Mapping does not mutate maturity
Snapshot before/after.

## MAP5 — Unknown mapped inputs remain unknown

---

## VIS1 — Desktop reference viewport
No overflow/collision.

## VIS2 — Laptop reference viewport

## VIS3 — Tablet landscape

## VIS4 — Narrow viewport

## VIS5 — Focus visible

## VIS6 — Text scaling / zoom robustness

## VIS7 — Chart labels
No clipping in canonical fixtures.

## VIS8 — UNSET/NONE/insufficient screenshots
Evidence archive.

## VIS9 — Target vs Current semantics

## VIS10 — Print/PDF semantics

---

## ACC1 — Automated accessibility baseline
Ferramenta a definir no momento da fase.

## ACC2 — Keyboard-only canonical flow

## ACC3 — Focus order

## ACC4 — Contrast

## ACC5 — Accessible chart alternative

## ACC6 — Selected answer programmatic state

---

# 26. VISUAL FIXTURES OBRIGATÓRIAS

Criar fixtures representando:

### F1 — Blank assessment
Todos UNSET.

### F2 — Partial insufficient
Algumas respostas, gate fechado.

### F3 — Near threshold
Uma condição de suficiência faltando.

### F4 — Exactly sufficient
Gate no boundary mínimo.

### F5 — Fully sufficient
Cobertura alta.

### F6 — UNSET vs NONE
Estados lado a lado.

### F7 — Rich notes
Texto longo, Unicode, punctuation.

### F8 — Target profile
Current + target legítimos.

### F9 — Framework derived partial
Alguns mappings avaliados, outros unknown.

### F10 — Adversarial content
Strings de segurança/escaping.

### F11 — PRINT-F1 · Insufficient print attempt

```text
assessment insufficient
→ generate/attempt PDF
→ no executive maturity verdict
```

O comportamento exato (COLLECTION_REPORT ou BLOCK_PRINT) segue a política selecionada em UI-046A; a fixture prova a regra comum em ambas. Executável somente dentro da microfase Print/Render autorizada.

---

# 27. CRITÉRIOS DE ACEITE DE PRODUTO

A experiência nova deve permitir que um assessor:

1. encontre rapidamente onde está no assessment;
2. compreenda o significado visual da opção sem depender somente do número;
3. capture racional/evidência no momento apropriado;
4. veja quanto falta responder;
5. veja separadamente se existe evidência suficiente;
6. identifique `não avaliado` sem confundir com `maturidade zero`;
7. exporte/importa sessão sem acreditar que existe autosave;
8. abra Results sem receber score executivo quando insuficiente;
9. entenda de onde vêm visualizações NIST/CIS derivadas;
10. compare Current × Target sem target fixo;
11. navegue por teclado;
12. use tela e PDF sem perder semântica essencial.

---

# 28. ANTI-PATTERNS EXPLICITAMENTE PROIBIDOS

## AP-01
Mostrar score composto com evidência insuficiente.

## AP-02
Converter unanswered/UNSET em zero.

## AP-03
Radar preenchendo missing com `0`.

## AP-04
Mostrar `0%` NIST quando significado real é “sem evidência mapeada avaliada”.

## AP-05
Comunicar “Saved” sem autosave real.

## AP-06
Adicionar pergunta nova dentro de “conditional UI” sem mudança metodológica aprovada.

## AP-07
Usar Basic/Advanced para alterar scoring sem contrato explícito.

## AP-08
Criar framework mapping dentro do renderer.

## AP-09
Fazer target fixo global como `3.0`.

## AP-10
Usar cor como única indicação de estado.

## AP-11
Copiar textos, layout ou design assets do benchmark como implementação.

## AP-12
Usar UI redesign como justificativa para refactor de engine.

---

# 29. CHANGE BOUNDARY CANDIDATA

A boundary final deve ser definida somente quando o baseline pós-4.9 estiver conhecido.

Diretriz:

### Potencialmente autorizáveis
- camada UI;
- CSS/design tokens;
- visual components;
- presentation-only helpers;
- novos testes UX/Chromium;
- docs desta fase.

### Protegidos por default
- engine;
- print/render pipeline e suas semânticas congeladas (ver Print/Render Boundary abaixo);
- Layer 1;
- question bank;
- scoring;
- canonical owners;
- Session schema;
- methodology;
- recommendation semantics.

Se um requisito exigir tocar arquivo protegido:

```text
STOP
→ classify requirement
→ open dedicated microphase
→ independent review
```

### Print/Render Boundary

O pipeline de geração/print e suas semânticas congeladas (Phase 4.7) permanecem protegidos por default. Requisitos da Phase 5.0 que exijam novas semânticas visuais em PDF (UI-045, UI-046A, F11) deverão ser executados em **microfase explicitamente autorizada de Print/Render UX**, limitada à apresentação e sem alteração de scoring, metodologia, conteúdo canônico ou matemática.

Essa microfase deverá preservar e reexecutar todos os gates/evidências congelados da Phase 4.7, adicionando novos gates apenas para as semânticas visuais autorizadas. A Phase 5.0 **não** recebe implicitamente autorização para modificar o print pipeline.

---

# 30. EVIDENCE PACKAGE DA PHASE 5.0

A futura fase deverá produzir:

- spec normativa final;
- change boundary;
- screenshots Chromium;
- fixtures;
- responsive evidence;
- accessibility evidence;
- print/PDF evidence;
- test report;
- mutation/adversarial tests quando aplicável;
- build hashes;
- manifest;
- clean-room report;
- known limitations;
- UX decision log.

A inspiração SOCSCOPE deve aparecer apenas no decision log/benchmark section, como referência não normativa.

---

# 31. DEFINITION OF DONE CANDIDATA

A Phase 5.0 só poderá ser candidata a freeze se:

```text
all frozen methodology invariants preserved
engine/methodology hashes preserved when required
UNSET != NONE visually and semantically
insufficient evidence blocks executive scoring
no false autosave/persistence claim
verbal anchors map 1:1 to canonical answers
semantic cues have approved provenance
notes bind only to canonical owner
framework views are explicitly derived
no-data framework state != 0%
Current × Target uses canonical target
Basic/Advanced has no hidden scoring side effect
conditional UI fabricates no state
keyboard flow passes
accessibility gates pass
responsive Chromium gates pass
print semantics pass
session roundtrip passes
full regression passes
clean-room passes
independent audit pending
```

## Promotion Gate — VIS/ACC detailing

```text
ROADMAP CANDIDATE
        ↓
before normative promotion
        ↓
VIS/ACC gates must define:
- exact viewports
- browser/version
- test tool + version
- thresholds
- expected state
- evidence artifact
- failure condition
```

Os gates VIS/ACC desta candidata são aceitáveis como esqueleto, porém **insuficientes para promoção normativa**. Exemplo do nível de precisão exigido — em vez de "VIS3 — Tablet landscape", a versão normativa deve especificar: viewport 1024×768, Chromium canonical version X, zero horizontal document overflow, question choices fully visible, navigation reachable, no overlap > 0 px. Da mesma forma, ACC1 deve nomear ferramenta e versão, não "automated accessibility baseline" genericamente.

---

# 32. STOP RULE

Ao final da implementação futura:

```text
STOP
```

Não iniciar automaticamente:

- nova metodologia;
- deep-dive question bank;
- new framework mapping;
- benchmark module;
- action tracker;
- KPI suite;
- accreditation module;
- cloud persistence;
- next phase.

A Phase 5.0 somente poderá ser declarada FROZEN após auditoria independente explícita.

---

# 33. RECOMENDAÇÃO DE ROADMAP

A candidata Phase 5.0 é grande demais para uma única alteração monolítica.

Sequência sugerida:

```text
5.0.1 Assessment Shell & Answer Semantics
      ↓
5.0.2 Evidence Capture & Progress UX
      ↓
5.0.3 Sufficiency-Aware Results
      ↓
5.0.4 Derived Framework & Target Visualizations
      ↓
5.0.5 Accessibility, Responsive & Visual Closure
      ↓
Independent audit
```

### Prioridade sugerida

#### Wave 1A — Pure presentation / lowest methodological risk
- navigation shell;
- progress/completion (moeda canônica, ver UI-009A);
- honest Session Portability messaging;
- UNSET ≠ NONE;
- sufficiency lock (renderizando o resultado do runtime, ver SUF0);
- sidebar unknown semantics;
- responsive/accessibility shell.

#### Wave 1B — Canonical-content-dependent
- verbal anchors ligados aos valores existentes (UI-003);
- inline evidence usando owner existente (UI-006);
- metadata chips com provenance (UI-008).

#### Wave 2 — Analytics
- heat map;
- Current × Target;
- strengths/priorities gated;
- domain drill-down.

#### Wave 3 — Provenance-dependent
- NIST/CIS derived views;
- semantic cue matrix question × answer;
- time estimate (UI-010, respeitando UI-010A).

#### Separate contract
- Basic/Advanced question-set semantics;
- new conditional questions;
- new evidence-status taxonomy (UI-021);
- print/render reopening (Print/Render Boundary, UI-045/UI-046A);
- new framework mapping datasets.

---

# 34. DECISÃO DE DESIGN CENTRAL

O principal diferencial da experiência futura não deve ser “ter mais gráficos”.

Deve ser:

> **A interface torna explícito quando o Quickscan sabe, quando não sabe e quando ainda não possui evidência suficiente para emitir um número.**

Isso deve aparecer em:

- sidebar;
- heat map;
- radar;
- executive summary;
- framework views;
- PDF;
- session workflow.

A disciplina metodológica deve ser visível ao usuário, não apenas implementada internamente.

---

# 35. STATUS FINAL DESTA SPEC

```text
PHASE 5.0 CANDIDATE SPEC · REV A
AUDIT FINDINGS INCORPORATED (A-01..C-03, GOV1, UX9)
IMPLEMENTATION NOT AUTHORIZED

current declared state:
  Phase 4.8  FROZEN
  Phase 4.9  IMPLEMENTATION COMPLETE · AWAITING INDEPENDENT AUDIT

AWAIT PHASE 4.9 FREEZE
AWAIT V3.2 RELEASE-ROADMAP DECISION
AWAIT FORMAL PHASE 5.0 APPROVAL
```

Não executar esta especificação automaticamente.
