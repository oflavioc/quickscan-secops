# QUICKSCAN SECOps SOC-CMM V3.2+
# PHASE 5.0 — NORMATIVE SPEC · REVISÃO B
## Assessment Experience, Evidence UX & Sufficiency-Aware Results
### Especificação normativa · REV B · PROMOVIDA EM 2026-08-19 · IMPLEMENTAÇÃO NÃO AUTORIZADA ATÉ ABERTURA FORMAL DA PHASE 5.0

```text
PHASE 5.0 NORMATIVE SPEC · REV B
NORMATIVA DESDE 2026-08-19 — REGISTRO DE PROMOÇÃO: docs_phase5/REV_B_PROMOTION_RECORD.md
NOT AUTHORIZED FOR IMPLEMENTATION — PHASE 5.0 NÃO ABERTA · WAVE 1A NÃO INICIADA
```

**Status:** NORMATIVA — promovida em 2026-08-19. A numeração normativa desta revisão é **FINAL**.
Cumpridos, nesta ordem: auditoria independente da REV B com resultado **PASS** e zero blockers
abertos (`docs_phase5/AUDITORIA_INDEPENDENTE_PHASE_5_0_REV_B.md` · SHA-256
`dfa8001844085ad1da09db1c858581e7b1bcb3283ed0c5dbf4155b1188c237c6` · 2026-08-19 · auditor: Codex /
OpenAI, independente do autor da candidata) · aceite do proprietário · aprovação formal da change
boundary (§29) · registro de promoção em `docs_phase5/REV_B_PROMOTION_RECORD.md` (data + SHA-256 +
atualização simultânea do `CLAUDE.md`). O conteúdo que recebeu o PASS independente é identificado
pelo SHA-256 `0f31900e8ad608c8a5825d9d5fa9e2d7a4fd3d68f8efbf23c7fc937a16950925` (identidade
histórica da candidata auditada); o SHA-256 dos bytes finais desta spec promovida é declarado
externamente, no registro de promoção e no `CLAUDE.md`, nunca dentro deste arquivo (P50-GOV2).
**Idioma normativo:** PT-BR (denominações canônicas de domínio/estágio permanecem PT/EN — UI-033A).
**Implementação:** NÃO AUTORIZADA — a promoção normativa **não** abre a fase. Permanece proibida
até a **abertura formal da Phase 5.0** (§1), ato exclusivo do proprietário. Wave 1A NÃO INICIADA.
**Documento-base:** `PHASE_5_0_REV_A.md` · SHA-256 `22e729174c6a3c5dd620da5330b03eb96d9eb6fc6e64eba097c2bde55eb0a510` · 1.859 linhas.
**Conjunto exclusivo de alterações:** `MINUTA_REV_B_MANDATO.md` (rev. 3) · SHA-256 `6aa129d4743dc9a542807936e9fe8da80d5bfbc2f644eebb23391e85982c95bb` · 42.514 bytes · aprovado pelo proprietário com resultado PASS e zero blockers.
**Referência externa de inspiração:** SOCSCOPE — permanece **não normativa** (§3). Nenhum texto, scoring, mapeamento, comportamento ou estrutura proprietária é fonte de verdade do Quickscan.

---

# 0.A HISTÓRICO DE REVISÃO E ESTADO CORRENTE

## Revisões

```text
REV 0  Spec candidata original.
REV A  Incorpora os achados da auditoria da candidata (A-01..C-03, GOV1, UX9).
       REPROVADA em auditoria independente (2026-08-18): 6 blockers (B-1..B-6),
       9 achados altos (A-1..A-9), 8 médios (M-1..M-8), 5 baixos (L-1..L-5).
REV B  Esta revisão. Escrita contra o source real do baseline de trabalho,
       aplicando exclusivamente o mandato aprovado (SHA 6aa129d4…82c95bb):
       remediação de B-1..B-6, correções A-1..A-9, achados M-1..M-8 e L-1..L-5,
       decision log DL-1..DL-5, resultado da micro-fase UNSET (UG1–UG13) e
       cláusulas COR-01/ICON-01 do backlog. Nenhuma sexta fonte de escopo.
       APROVADA (PASS, zero blockers) em auditoria independente em 2026-08-19
       (Codex / OpenAI); aceita pelo proprietário; change boundary da §29
       formalmente aprovada; PROMOVIDA A NORMATIVA em 2026-08-19 — registro em
       docs_phase5/REV_B_PROMOTION_RECORD.md. A Phase 5.0 permanece NÃO ABERTA.
```

## Estado corrente declarado do projeto (na data desta revisão — 2026-08-19)

```text
Phase 4.8              FROZEN (core 4.8.0.7 · 625079c4…0ee5b89d · imutável)
Phase 4.9.0-docs.2     FROZEN WITH NON-BLOCKING CAVEATS (wrapper documental;
                       delta funcional zero — pós-4.9 é byte-idêntico ao core 4.8.0.7)
Micro-fase UNSET       ENTREGUE E APROVADA em parecer de par (2026-08-18, UG1–UG13,
                       mutation-tested; engine e payload M41 byte-idênticos)
Phase 5.0              NÃO ABERTA · esta spec é NORMATIVA (promovida em 2026-08-19)
```

Este bloco registra o estado declarado no momento da revisão; sessões futuras devem reconfirmar o
estado corrente pela fonte normativa atual antes de agir.

## Baseline de trabalho aprovado para autoria e auditoria da REV B

```text
HTML construído:            787cd3ab33188eee75a82590ab08d4240b6016a21329f899fd597050e3dde85a
engine_v32.js:              9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
                            (byte-idêntico ao core 4.8.0.7)
payload funcional M41:      9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
                            (byte-idêntico ao core 4.8.0.7)
Camada 1 (v3_1_3.html):     d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82
ui_v32.js:                  094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038
ui_target_v32.js:           cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0
package.json:               8654fc09d178f750ffcf1d87f8e1aaa1037d829ece698b01baab5d316586b599
tests_unset_ug.js:          d2a3f804bb14e9156978407710a7a680f8dc4b71929546c28a719fbde1bae2e9
registro de delta:          docs_phase5/MANIFEST_PHASE5_UNSET.sha256 (6 entradas OK)
core congelado 4.8.0.7:     625079c462be7d44ffd69b1cd85f256382322bd0555ae4b548f21bf30ee5b89d
                            (pasta-mãe, intocado; MANIFEST.sha256 do core acusa exatamente as
                            5 divergências esperadas da micro-fase — delta auditável)
```

**Limites explícitos do baseline de trabalho:** o HTML `787cd3ab…3dde85a` **não é** freeze, release,
release candidate, abertura da Phase 5.0 nem substituição do core congelado 4.8.0.7. É o estado
aprovado sobre o qual esta spec é escrita e auditada. Freeze e abertura de fase permanecem atos
exclusivos do proprietário, após auditoria independente.

**Regra de ancoragem de citações (âncora simbólica):** nesta spec, toda citação de source é
normativamente o par **(arquivo, símbolo)** — ex.: (`ui_v32.js`, `escAttr`). O número `fonte:N` /
`arquivo.js:N` que a acompanha é **registro histórico da auditoria da REV A** (baseline pré
micro-fase: Camada 1 `3e24ff9d…` · HTML `8d0932e1…`) e **não é fonte normativa de posição**: a spec
promovível não depende de posições antigas. A fonte normativa de posições é o **mapa de reancoragem**
`docs_phase5/REV_B_REANCHOR_MAP.md` (formato: `arquivo · símbolo · posição pré-microfase · posição no
baseline atual · SHA do arquivo verificado`), verificado contra os arquivos identificados pelos hashes
deste bloco. Arquivos **byte-idênticos ao core 4.8.0.7** (não alterados pela micro-fase — ex.:
`engine_v32.js`, `ui_session_v32.js`) conservam as posições da auditoria por identidade; para os
arquivos **alterados** pela micro-fase (Camada 1, `ui_v32.js`, `ui_target_v32.js`, `package.json`), a
posição vale somente após verificação registrada no mapa. **Obrigação normativa (P50-GOV3):** nenhum
gate novo que dependa de posição no source executa antes de a entrada correspondente do mapa estar
verificada. A reancoragem não trata o baseline de trabalho como freeze, release ou substituição do
core 4.8.0.7.

## Localização deste arquivo

```text
specs/PHASE_5_0_REV_B.md
```

Esta spec **é** a especificação normativa apontada pelo `CLAUDE.md` (remediação de B-6/L-1
consumada): o cabeçalho candidato foi retirado no ato da promoção, de modo que não subsiste
coexistência de um `CLAUDE.md` normativo com cabeçalho candidato. No registro de promoção
`docs_phase5/REV_B_PROMOTION_RECORD.md` o proprietário gravou data, o SHA-256 do documento promovido
e a atualização simultânea do `CLAUDE.md`. Gate documental: a spec promovida e o `CLAUDE.md`
referenciam o mesmo arquivo e o mesmo SHA-256 (P50-GOV2, §25). O SHA-256 dos bytes finais desta spec
**não** é gravado dentro dela — seria autorreferência criptográfica insolúvel; o fechamento mecânico
é `SHA observado de specs/PHASE_5_0_REV_B.md == SHA em docs_phase5/REV_B_PROMOTION_RECORD.md == SHA
em CLAUDE.md`.

---

# 0. PROPÓSITO DESTA SPEC

Esta especificação define a **Phase 5.0 — Assessment Experience, Evidence UX & Sufficiency-Aware
Results**: evolução de **experiência e apresentação**, sem reabrir metodologia, scoring ou contratos
congelados.

Objetivos:

1. reduzir carga cognitiva durante discovery/assessment;
2. aumentar consistência de interpretação das respostas;
3. capturar evidência/racional no momento da entrevista;
4. tornar progresso, suficiência e estado de avaliação visualmente inequívocos;
5. tornar resultados mais executivos sem fabricar precisão;
6. **preservar** `UNSET ≠ NONE` visível na interface (entregue pela micro-fase UNSET; ver §12.2);
7. expor Session Portability com wording honesto sobre persistência;
8. melhorar navegação, acessibilidade, responsividade e legibilidade;
9. permitir visualizações derivadas somente quando houver fonte canônica e provenance explícita;
10. transformar os invariantes metodológicos do Quickscan em **comportamentos visíveis da UI**.

---

# 1. GATE DE ENTRADA

Precondição material: **substancialmente satisfeita** (remediação de B-5). A Phase 4.9.0-docs.2 está
FROZEN WITH NON-BLOCKING CAVEATS e, por ser wrapper documental com delta funcional zero, o baseline
pós-4.9 é byte-idêntico ao core 4.8.0.7; a micro-fase UNSET foi entregue e aprovada, estabelecendo o
baseline de trabalho da §0.A.

A Phase 5.0 só pode abrir após, nesta ordem:

```text
AUTORIA DA CANDIDATA
        ↓
AUDITORIA INDEPENDENTE
        ↓
CORREÇÕES E REAUDITORIA, SE NECESSÁRIO
        ↓
ACEITE DO PROPRIETÁRIO + APROVAÇÃO FORMAL DA CHANGE BOUNDARY (§29)
        ↓
PROMOÇÃO NORMATIVA
(data + SHA-256 + atualização simultânea do CLAUDE.md)
        ↓
ABERTURA FORMAL DA PHASE 5.0
        ↓
IMPLEMENTAÇÃO (por microfases, §5/§33)
```

Etapas cumpridas em 2026-08-19: **PASS** da auditoria independente da REV B (zero blockers), aceite
do proprietário, aprovação formal da change boundary (§29) e **promoção normativa** registrada em
`docs_phase5/REV_B_PROMOTION_RECORD.md`. Permanece pendente, e somente, a **abertura formal da
Phase 5.0** — ato exclusivo do proprietário. A Phase 5.0 permanece **NÃO ABERTA**, a implementação
**NÃO AUTORIZADA** e a Wave 1A **NÃO INICIADA**. Não iniciar automaticamente.

---

# 2. BASELINE E INVARIANTES QUE A PHASE 5.0 HERDA

A implementação parte do **baseline de trabalho da §0.A** — core 4.8.0.7 (`625079c4…`), idêntico ao
pós-4.9, mais o delta aprovado da micro-fase UNSET.

Permanecem protegidos: engine; methodology; scoring; perguntas; domains; stages; sufficiency rules;
findings; severity; Recommendation Context; Current × Target semantics; Operational Refinement
semantics; Journey/Narrative semantics; portfolio semantics; M41; schemaVersion 1; Session Portability
canonical owners; separação canonical owner × derived state; **pipeline de print/render congelado
(4.7)**; **geometria UNSET corrigida pela micro-fase (UG1–UG13)**.

Invariantes obrigatórios:

```text
technology alone NEVER increases maturity
UNSET != NONE
derived state is NEVER canonical source of truth
insufficient evidence MUST NOT produce executive-grade maturity verdict
session import starts from canonical inputs and recomputes derived outputs
invalid/untrusted imported JSON cannot manufacture canonical states
UNSET NUNCA renderiza como zero geométrico (invariante entregue; preservação em §12.2)
```

Qualquer requisito desta spec que conflite com esses invariantes deve ser interpretado de forma
conservadora ou removido.

**Fatos do baseline que esta spec assume (verificados pela auditoria contra o source):**

- a moeda canônica de suficiência é **resposta confirmada** (`v !== null && v !== "NA"`): global
  `≥ 10` de 15 (`confirmedCount()`, `fonte:483` pré micro-fase) e por domínio `≥ 2` de 3
  (`domStat().n`, `fonte:485`); os limiares vivem como literais em `dataSufficiency()`
  (`fonte:501–503`), que retorna **boolean**;
- o modelo canônico é `assessment → domínio (5) → pergunta (15, 3 por domínio)`; **não existe camada
  aspect/capability** no eixo de assessment;
- o eixo de respostas tem **três** estados canônicos: `null` (não avaliado) · `"NA"` (não sei /
  precisa validar — não pontua; vira item de validação) · `0..3` (confirmado; `SCORES=[0,1.7,3.3,5]`);
  `NONE` pertence ao eixo de **presence do landscape**, não ao de respostas;
- cada pergunta tem **quatro opções** com título e descrição próprios (`opts:[{t,d}×4]`) — âncoras
  verbais **já implementadas**;
- o owner canônico de notas **já é por pergunta** (`notes[k]`, serializado como
  `inputs.assessment.notes[qid]`; roundtrip coberto pela SESSION 4.8);
- Current × Target **já existe, congelado e gatilhado** (`#ux-target`, `pr-target`, TARGET 4.3.1
  30/30, gate visual V9): alvo declarado por pergunta, nunca fixo, estritamente superior ao atual,
  revalidado;
- a política de print sob insuficiência **já existe** e é `COLLECTION_REPORT` de fato (score `n/d`,
  sem estágio fabricado — gate congelado P11);
- os cinco pontos de zero geométrico de UNSET **foram corrigidos** pela micro-fase e são governados
  por UG1–UG13.

---

# 3. BENCHMARK EXTERNO — O QUE É E O QUE NÃO É

As screenshots de referência (SOCSCOPE) mostram padrões úteis de UX: navegação por domínio; progresso
global; answer cards; labels verbais; feedback contextual; metadados por pergunta; rationale/evidence
textarea; resultados com cards, radar e heat map; sidebar contextual.

Esses padrões servem exclusivamente como **benchmark de interação**. Não são fonte normativa de:
maturidade; nomenclatura; escala; framework mapping; scoring; target; suficiência; definição de
níveis; cálculo NIST; regras comerciais; question bank.

Não copiar visual identity, textos ou asset design. O Quickscan produz solução visual própria,
coerente com seu design system (§19 — branding decidido, DL-4) e governança.

Registro competitivo preservado do projeto: exibir score antes do gate de suficiência é anti-pattern
estrutural (AP-01) — o gate de suficiência é o diferenciador metodológico desta ferramenta.

---

# 4. PRINCÍPIOS DE UX

## UX-P1 — Evidence before score
```text
evidência → suficiência → interpretação → score
```
Nunca: `resposta parcial → score executivo aparente`.

## UX-P2 — Unknown is visible
`UNSET` não pode ser visualmente representado como zero, ausência, falha ou baixa maturidade.
(Entregue nas superfícies congeladas pela micro-fase; obrigatório nas superfícies novas — §12.2.)

## UX-P3 — Guidance without methodology drift
Ajuda visual esclarece opções existentes; não cria nova semântica de scoring.

## UX-P4 — Progressive disclosure
Detalhe quando necessário, sem densidade máxima obrigatória.

## UX-P5 — State honesty
A UI não comunica "salvo", "persistido", "cobertura zero" ou "resultado final" sem prova do runtime.

## UX-P6 — Derived views are labeled as derived
Target/Journey e qualquer visão derivada explicitam provenance e natureza derivada.

## UX-P7 — Accessible without color alone
Estado, prioridade, maturidade, insuficiência e seleção não dependem exclusivamente de cor.

## UX-P8 — No hidden methodological side effects
Trocar aba, modo, filtro ou visualização não altera score ou canonical state.

---

# 5. ESCOPO FUNCIONAL — MICROFASES

```text
5.0.1  Assessment Shell & Answer Semantics
5.0.2  Evidence Capture & Progress UX
5.0.3  Sufficiency-Aware Results
5.0.4  Target & Heat Map Visualizations        (framework views REMOVIDAS — §15)
5.0.5  Accessibility, Responsive & Visual Closure
```

Cada microfase segue o protocolo de fase do projeto (spec → baseline → boundary → implementação →
gates → regressão → relatório → PARADA). A numeração acima é a final desta spec.

**Fora do escopo da Phase 5.0** (consolidado; ver §15, §23, §33): painel NIST CSF / framework mapping
(D4); ícones no PDF/print (ICON-01.4); revisão de `ICON_ASSET_DECISIONS_V32.md`; alteração de engine,
scoring ou metodologia; reabertura da dívida `ui_target_v32.js:32`; alteração da semântica de print
congelada 4.7; UI-010/estimativa de tempo restante (DL-5); Basic/Advanced Modelo 2; taxonomia nova de
evidence-status; novas perguntas condicionais.

---

# 6. REQUISITOS — ASSESSMENT SHELL

## UI-001 — Hierarquia de navegação

A tela de assessment (superfície nova da Camada 5 — decisão D1/DL-3) deve permitir leitura imediata de:

```text
assessment → domínio → pergunta
```

(Correção A-2: a camada `aspect/capability` **não existe** no modelo canônico e não é criada por esta
fase. Criá-la seria mudança metodológica — blocker imediato se tentada.)

A navegação expõe: domínio atual; pergunta atual e posição no domínio (1..3); progresso do domínio;
progresso global.

### Critério de aceite
Em qualquer pergunta, o usuário identifica domínio e posição sem rolagem para o topo.

### Gate associado
P50-UX1, P50-UX6 (§25).

---

## UI-002 — Sidebar contextual

Pode existir sidebar lateral de resumo, desde que:

- não exiba `0.0` para domínio `UNSET`/não avaliado;
- use o token canônico **`n/d`** acrescido, de forma aditiva, do rótulo textual **"Não avaliado"** e
  de nome acessível (decisão A-8, opção (a) — os cinco gates congelados que asserem `n/d` — N3, S9,
  T10/T11, P11 — **não são modificados**);
- diferencie, no eixo correto, os **três estados de resposta** (`null` · `"NA"` · confirmado) e, no
  eixo de presence do landscape, `UNSET` × `NONE` (correção A-3);
- não calcule nem exiba score executivo com o gate de suficiência fechado;
- siga a regra de superfícies novas não geométricas (§12.2, bloco d).

### Proibido
```text
Processos 0.0        (quando Processos não foi avaliado)
```

### Esperado
```text
Processos n/d
Não avaliado
```

### Gate associado
P50-SUF2, P50-UX6.

---

## UI-003 — Answer cards com âncoras verbais

Cada opção canônica exibe `canonical value + verbal anchor`.

**Fato do baseline (correção A-4):** as âncoras verbais **já existem** — cada pergunta tem **quatro**
opções, cada uma com título e descrição próprios e específicos daquela pergunta
(`opts:[{t,d}×4]`, `fonte:285–…`), mapeadas por `SCORES=[0,1.7,3.3,5]`, mais a opção `NA` ("Não sei ·
precisa validar / Não pontua — entra como item de validação"). O exemplo genérico de cinco âncoras da
REV A foi **removido**: não existe escala genérica de 5 níveis e ela não pode ser criada.

Esta cláusula é de **preservação do mapeamento**: a superfície nova renderiza exatamente as quatro
opções canônicas + `NA` de cada pergunta, com seus textos canônicos.

### REGRA CRÍTICA
1. ler as opções canônicas reais da pergunta;
2. mapear cada card ao ID/valor existente (`0..3`, `"NA"`);
3. provar que nenhum valor foi criado/removido/reordenado;
4. wording novo (se houver, apenas em chrome da UI, nunca no texto da opção) segue UI-033A.

A apresentação não pode mudar o valor persistido nem o scoring.

### Gate associado
P50-UX1.

---

## UI-004 — Seleção acessível

Answer cards funcionam como grupo semântico equivalente a radio group, **sem reescrever o markup da
Camada 1** (correção A-9). O controle atual é grupo de `<button class="opt" data-i aria-pressed>`
(`fonte:664–668` pré micro-fase; mesmo padrão em `fonte:636` para arquétipo e `fonte:716` para
prioridades), e `aria-pressed` já entrega estado selecionado programático.

**Caminho autorizado (decisão D1/DL-3):** superfície nova da Camada 5 e/ou **decoração pós-render** a
partir de módulo novo da fase, com precedente estabelecido (`window.__uxDecor(app)`, `ui_v32.js:823`
pré micro-fase; wrapper aditivo de `renderResults`, `:820–824`), usando **os mesmos setters do runtime
congelado**. É **proibido** reescrever markup dentro de `quickscan_secops_soccmm_v3_1_3.html`.

**Risco declarado:** os gates congelados de teclado/foco (visual V6; UX 4.1, 56 gates) exercitam o
comportamento atual — a decoração não pode alterá-lo; a regressão congelada é a prova.

Exigir na superfície nova: teclado; focus visible; label programático; estado selected programático;
ordem previsível; nenhuma dependência de hover.

### Gates associados
P50-UX2, P50-ACC6; regressão UX 4.1 e V6 intactas.

---

## UI-004A — Composição de `window.__uxDecor` (owner único P50)

O runtime congelado **já possui um owner** de `window.__uxDecor`. A Phase 5.0 define **um único owner
de composição P50**: `ui_p50_shell_v32.js`. Contrato obrigatório:

1. o agregador captura o callback predecessor **exatamente uma vez** (na carga do módulo);
2. **preserva a invocação** do predecessor em toda execução;
3. executa a **decoração congelada antes** da decoração P50;
4. é **idempotente**: decorar duas vezes o mesmo render não duplica nós nem handlers;
5. **isola falhas por callback**: exceção em uma decoração P50 não impede o predecessor nem as demais
   (try/catch por callback, erro registrado);
6. `ui_p50_suff_v32.js` e `ui_p50_results_v32.js` **não reatribuem** `window.__uxDecor` — **exportam
   funções** consumidas pelo agregador;
7. `ui_ux_v32.js` e qualquer arquivo protegido **não são alterados**.

### Gate e mutante associados
**P50-UX13** (§25.3): prova o contrato acima e inclui **mutante obrigatório** — remover a chamada do
predecessor no agregador deve ser **detectado** (regressão acusada pelo gate e/ou pelas suítes UX 4.1
e Session Portability, que permanecem integralmente verdes na versão não mutada).

---

# 7. FEEDBACK SEMÂNTICO DA RESPOSTA

## UI-005 — Response interpretation cue

Após seleção, a UI pode exibir frase curta explicando a interpretação operacional da resposta.

### REGRA DE GOVERNANÇA
Isto **não é automaticamente UI-only**. Um dicionário `question × answer → semantic cue` influencia a
forma como o entrevistado responde; funciona como conteúdo metodológico auxiliar.

Permitido somente por um dos caminhos:

- **Caminho A** — a frase é derivada de guidance já canônico (na prática: a **descrição canônica da
  própria opção**, `opts[].d`, que já existe por pergunta);
- **Caminho B** — microfase de conteúdo separada aprova e congela descriptors novos (fora desta fase);
- **Caminho C** — descritor genérico da opção, sem semântica específica da pergunta.

**Nesta fase, apenas os Caminhos A (com `opts[].d` existente) e C são implementáveis.** Caminho B é
contrato separado (§33).

### Proibido
Gerar descriptors por IA em runtime · inventar guidance do benchmark · alterar score pelo descriptor.

### Gate associado
P50-UX3.

---

# 8. CAPTURA DE EVIDÊNCIA

## UI-006 — Evidence/rationale inline

Disponibilizar campo de evidência/racional próximo ao contexto de coleta.

Placeholder candidato:
```text
Registre evidência, racional, fonte, observação ou contexto adicional...
```

### Boundary (correção M-3)
O campo binda **exclusivamente** ao owner canônico **já existente e já por pergunta**: `notes[k]`,
serializado como `inputs.assessment.notes[qid]` (`ui_session_v32.js:45–46` pré micro-fase; roundtrip
coberto pela SESSION 4.8). A premissa da REV A (nota por aspecto) era invertida.

**STOP reescrito sobre o risco real:** se qualquer requisito de UI exigir um **segundo** owner de
evidência (por domínio, por sessão, por tema, ou taxonomia paralela):

```text
STOP
```

Não criar novo owner nem mudar `schemaVersion` dentro desta fase.

### Gate associado
P50-UX4.

---

## UI-007 — Indicador de evidência

A interface pode distinguir `evidência registrada` × `sem evidência registrada`. Isso é presença de
nota, não "verdade" da resposta. Não transformar existência de nota em `confirmed` — a confirmação é
exclusivamente `v !== null && v !== "NA"` no eixo de respostas.

---

## UI-008 — Metadata chips

A pergunta pode exibir chips como: Question ID; Domain ID; evidence status (presença de nota).

### Regra
Nenhum chip inventa mapping ou classificação. Chips de "importance/weight class" e "framework mapping"
**não existem nesta fase**: não há fonte canônica para eles no baseline (o primeiro não existe; o
segundo foi removido — §15). Toda informação de chip tem source/provenance identificável no runtime.

### Gate associado
P50-UX5.

---

# 9. PROGRESSO E EXPECTATIVA

## UI-009 — Progresso global e segmentado

Mostrar separadamente:

```text
respondido / total aplicável             (completion)
progresso de suficiência                 (na moeda canônica — UI-009A)
```

Não misturar completion com sufficiency.

Exemplo (na moeda canônica real):
```text
Conclusão: 12/15 respostas
Suficiência: 11 de 10 respostas confirmadas · Processos precisa de +1 resposta confirmada
```

O painel de suficiência consome exclusivamente o **contrato derivado estruturado** (UI-012A).

---

## UI-009A — Canonical Sufficiency Currency (correção A-1)

A moeda de suficiência é, **normativamente**, a do gate canônico do baseline:

```text
respostas confirmadas (v !== null && v !== "NA")
global:      ≥ 10 de 15        — confirmedCount()  (fonte:483, pré micro-fase)
por domínio: ≥ 2 de 3          — domStat().n       (fonte:485, pré micro-fase)
```

A UI congelada **já exibe essa moeda com esse nome** (`fonte:926`, `fonte:855`, `fonte:493–497`).
Exibir "respostas" incluindo `NA` seria o erro; **"respostas confirmadas" é a unidade canônica.**

A UI não define, não traduz, não aproxima, não endurece e não afrouxa a moeda. Permanece proibido à
UI substituir a unidade (`answers → capabilities`, `domains → evidence items`, ou qualquer outra) sem
mudança normativa aprovada.

**Distinção preservada (UI-021):** a taxonomia ✅/⚠/❓ do template de relatório consultivo **não** é
canônica e não é introduzida por esta fase. (A "Nota de origem" da REV A, que declarava o termo
"confirmadas" como contaminação, era factualmente incorreta contra o source e foi removida.)

### Gates associados
P50-SUF0, P50-SUF7 (§25).

---

## UI-010 — Tempo restante estimado — **REMOVIDA (DL-5)**

```text
CLÁUSULA REMOVIDA DO ESCOPO DA PHASE 5.0 — decisão DL-5 do proprietário (2026-08-19):
utilidade marginal para 15 perguntas e custo desproporcional de estado e testes.
Pode ser reconsiderada em fase futura. Numeração preservada para rastreabilidade.
```

---

## UI-010A — UX-derived ephemeral state (correção M-4)

Fica definida a categoria formal **UX-derived ephemeral state**, incluindo, no mínimo:

```text
expanded/collapsed panels
selected results tab
scroll position
presentation-only Basic/Advanced preference
chart hover/focus state
estado de status da sessão:
  - dirty flag ("modificado desde o último export")
  - resultado da última operação de sessão (export sucesso/falha; import aplicado)
```

(Os itens de timing da REV A — tempo por pergunta, rolling median, estimated remaining time — saem da
lista por consequência de DL-5: o estado deixa de existir.)

### Regra
```text
UX-derived ephemeral state MUST NOT enter the canonical session document
unless a future schema contract explicitly promotes that field to canonical state.
```

Extensão, para a camada de UX, do invariante provado de derived-injection-rejection da Session
Portability. O dirty flag e o resultado da última operação são exatamente o estado que P50-SESUX1B
exige rastrear — enumerá-los aqui impede que virem campo serializado por conveniência.

### Gates associados
P50-SESUX5 (exclusão no export) + complemento adversarial de import (o schema v1 já recusa chaves
desconhecidas em raiz e em `inputs` — `ui_session_v32.js:214`, `:220` pré micro-fase — e derivados,
`:222`; rejeição, nunca absorção silenciosa).

---

# 10. SESSION PORTABILITY — MENSAGEM HONESTA

## UI-011 — Não copiar "Saved — close tab and resume anytime"

Esse padrão NÃO é adotado enquanto não existir persistência automática (não existe; §24).

### Estado padrão
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
Nenhuma ocorrência de `Saved` · `Auto-saved` · `Pode fechar a aba com segurança` ·
`Retome automaticamente` sem funcionalidade que prove a afirmação.
Gates: P50-SESUX1A (lint), P50-SESUX1B (renderizado), P50-SESUX2, P50-SESUX3.

---

# 11. SUFICIÊNCIA VISÍVEL

## UI-012 — Sufficiency Gate como componente de primeira classe

Antes de apresentar score executivo, a UI verifica o veredito canônico.

Enquanto insuficiente:
```text
Resultado executivo: BLOQUEADO
```

com mensagem construtiva **consumida exclusivamente do contrato derivado estruturado** (UI-012A):

```text
Resultado ainda indisponível

Faltam 3 respostas confirmadas no total (7 de 10)
Processos: +1 resposta confirmada necessária (1 de 2)
Serviços: +2 respostas confirmadas necessárias (0 de 2)

Continue o assessment para atingir evidência suficiente.
```

O renderer **não reconstrói** a lógica de suficiência e **não contém os literais `10` ou `2`**: os
números vêm de `requiredGlobal`, `missingGlobal` e `domains[].required/missing` do contrato.

### Gates associados
P50-SUF0, P50-SUF3, P50-SUF7.

---

## UI-012A — Contrato derivado estruturado de suficiência (remediação de B-1 · decisão DL-1, opção 1a)

### Arquitetura obrigatória

1. **`dataSufficiency()` permanece a fonte funcional canônica** — booleana, byte-idêntica, na
   Camada 1. Nenhuma alteração de assinatura, retorno ou posição. O payload M41 (`9794b267…`) e o
   marcador estrutural `function dataSufficiency` (`harness_m41_v313.js:26`) são invariantes da fase.
2. A fase introduz, **em módulo novo da Camada 5** (`ui_p50_suff_v32.js`, §29), uma camada derivada
   que lê `confirmedCount()` e `domStat().n` (escopo compartilhado do bloco injetado) e expõe o
   contrato estruturado abaixo.
3. Os limiares (`10` global, `2` por domínio) são declarados na **única declaração nova autorizada na
   Camada 5** — constante nomeada nesse módulo, com comentário normativo de que espelham os literais
   de `dataSufficiency()` (`fonte:501–503`, pré micro-fase; reancorar por §0.A). O módulo derivado
   **espelha** os limiares sob o gate exaustivo P50-SUF7; `computeTargetProfile()` permanece **dívida
   legada conhecida** (UI-012B).

### Shape do contrato

```text
{
  confirmedGlobal:  number,          // total de respostas confirmadas
  requiredGlobal:   number,          // limiar global (espelho: 10)
  missingGlobal:    number,          // max(0, requiredGlobal − confirmedGlobal)
  domains: [                          // exatamente 5, na ordem canônica de DOMS
    { domainId, confirmed, required,  // required (espelho: 2)
      missing }                       // max(0, required − confirmed)
  ],
  sufficient: boolean                 // missingGlobal === 0 && todos os missing === 0
}
```

### Regras de consumo

- o renderer consome **somente** essa estrutura; **não contém os literais `10` ou `2`**;
- as condições pendentes exibidas correspondem **exatamente** aos déficits: nenhum domínio satisfeito
  (`missing === 0`) aparece como pendente; **todo** domínio com déficit (`missing > 0`) aparece;
  nenhum déficit incorreto ou negativo é emitido;
- escopo **prospectivo** (remediação de B-2): estas regras aplicam-se a superfícies criadas ou
  modificadas pela Phase 5.0.

### Gates associados
P50-SUF7 (exaustivo, §25), P50-SUF8 (equivalência de estado, UI-012B).

---

## UI-012B — Dívida conhecida `computeTargetProfile` e equivalência sobre o mesmo estado (remediação de B-2)

A duplicação do gate de suficiência em `ui_target_v32.js:32` (pré micro-fase; `computeTargetProfile`,
espelho deliberado e comentado da matemática legada) é **dívida técnica conhecida**, coberta por 30
gates verdes da suíte TARGET 4.3.1, **não reaberta nesta fase** — `ui_target_v32.js` **não é
modificado** por esta cláusula.

**Diferença de fonte de estado, registrada:** `dataSufficiency(stats)` usa `confirmedCount()` sobre o
**owner global `ans`**; `computeTargetProfile(eff)` usa o **vetor explícito `eff`**. A equivalência só
tem valor probatório se as duas funções forem exercitadas sobre o **mesmo estado semântico** — é isso
que o gate P50-SUF8 (§25) prova, sobre a mesma matriz exaustiva de 1024 vetores.

---

## UI-013 — Não mostrar overall maturity como 0 ou baixo score quando insuficiente

Proibido:
```text
Overall Maturity 0.87
Stage Initial
```
se o gate canônico não autorizar o veredito.

### Permitido durante insuficiência
completion; contagem de respostas confirmadas; domínios com déficit (do contrato UI-012A); navegação.

### Gate associado
P50-SUF1.

---

## UI-014 — Domain score insufficient (com decisão M-1 registrada)

Na **tela**, se o veredito global estiver bloqueado, o resumo executivo do domínio segue:

```text
Domínio n/d
Não avaliado / evidência insuficiente
```

e nunca `Domínio 0.0` fabricado.

**Decisão M-1 do proprietário (2026-08-19) — ratificação do status quo:** sob gate global fechado,
scores parciais por domínio **podem** aparecer no `COLLECTION_REPORT` (comportamento congelado do
print — `ui_v32.js:687–693` pré micro-fase; gate P11) **apenas como diagnóstico intermediário**,
acompanhados de **indicação inequívoca de evidência insuficiente**; **não constituem veredito
executivo**. Overall, estágio, strengths, priorities e conclusões executivas permanecem bloqueados ou
`n/d`. **Esta decisão não autoriza alteração de print na Phase 5.0.**

### Gate associado
P50-SUF2; regressão P11 intacta.

---

# 12. HEAT MAP E SEMÂNTICA DE ESTADOS

## UI-015 — Heat map por domínio → pergunta (correção A-2)

Criar visão compacta `domínio → pergunta` capaz de mostrar, nos eixos corretos:

- **eixo de respostas:** confirmado (nível 0..3, com score) · `"NA"` (precisa validar) · `null`
  (não avaliado);
- **eixo de presence do landscape** (quando exibido): `UNSET` · `NONE` · `PARTIAL` · `PRESENT` ·
  `UNKNOWN`;
- insuficiência por domínio (do contrato UI-012A);
- target gap, quando houver override canônico (UI-017).

O heat map é superfície geométrica nova: segue §12.2 blocos (a) e (c) e COR-01 (§19).

### Gate associado
P50-UX10 (três estados), P50-COR2.

---

## UI-016 — Três estados de resposta + UNSET × NONE (correção A-3)

Dois gates **separados**, em eixos distintos:

**(a) Eixo de respostas — três estados:**
```text
null   →  n/d · "Não avaliado" · sem score · fora de polígono/fill
"NA"   →  rótulo canônico "Não sei · precisa validar" · não pontua · item de validação
0      →  confirmado · pontua 0 · plotado normalmente (nunca omitido)
```
com DOM semantics, rótulo visível e nome acessível distintos entre os três.

**(b) Eixo de presence do landscape — UNSET × NONE:**
fixture com capability A = `UNSET` e capability B = `NONE`, provando:
```text
DOM semantics differ · visible label differs · accessible name differs
```
(A asserção print/PDF permanece BLOCKED — §23/§29; a distinção em print já é coberta pela regressão
congelada existente na medida em que ela a assere.)

### Gates associados
P50-UX10 (a), P50-UX11 (b); fixtures P50-F6 e P50-F7 (§26).

---

## §12.2 — UNSET ≠ NONE: cláusula de PRESERVAÇÃO (remediação de B-3 — RESOLVIDO pela micro-fase)

Os 5 pontos onde UNSET era zero geométrico (radar de tela `fonte:760`; régua `fonte:939`; radar do
PDF `ui_v32.js:652`; overlay de alvo `ui_target_v32.js:120`; radar atual×alvo do PDF
`ui_target_v32.js:179` — todos pré micro-fase) foram **corrigidos pela micro-fase UNSET**, aprovada em
parecer de par. Esta spec **não contém cláusula de correção de UNSET**: contém preservação, em quatro
blocos:

**(a) Invariante universal** (toda superfície, congelada ou nova): UNSET **nunca** renderiza como
zero; **nunca** fabrica ponto, preenchimento, vértice ou score; possui **rótulo textual** (`n/d`,
decisão A-8 opção (a)) e **nome acessível**; a distinção **não depende somente de cor**. Zero
**confirmado** (nível 0) continua plotado/exibido normalmente (UG7): a semântica de omissão é
exclusiva de `score === null`.

**(b) Superfícies corrigidas/congeladas da micro-fase** (radar de tela, régua, radar do PDF, overlay
e radar de alvo): preservam **exatamente o encoding neutro aprovado** — vértice omitido, eixo
pontilhado neutro (`--faint`/`#999`), marcador vazado, nota textual fora do SVG — e permanecem
**governadas por UG1–UG13**. Razão do encoding neutro: restrição do runtime congelado
(tracejado+`#3CB17E` é encoding exclusivo do cenário-alvo — T14/V9).

**(c) Superfícies geométricas novas da Camada 5** (qualquer componente que plote valor por domínio):
omitem o ponto/vértice UNSET; usam a **cor congelada do próprio domínio esmaecida**, conforme
COR-01.3 (§19); acrescentam **pista não cromática adequada ao tipo de componente**; **não são
obrigadas** a copiar a estrutura específica do radar (eixo/marcador/nota) quando não forem radar.

**(d) Superfícies novas não geométricas** (listas, cards, textos de estado): apresentam `n/d` +
"Não avaliado" e semântica acessível; **não são obrigadas** a criar eixo, polígono, marcador ou nota
de radar.

A diferença de encoding entre (b) e (c) é **deliberada** e normativa.

### Gates de preservação
A suíte `tests_unset_ug.js` (**UG1–UG13**, mutation-tested, incluindo UG13/layout Chromium) integra a
regressão obrigatória da fase (`test:all`). Nenhum gate UG pode ser enfraquecido, reescrito ou
removido. Superfícies novas que desenhem geometria por domínio recebem gates análogos na numeração
`P50-*` (P50-VIS8, P50-UX10).

**Regra de evidência do UG13:** UG13 pode emitir `SKIP` em ambiente de desenvolvimento sem browser
resolvível (comportamento congelado da suíte, que preserva o invariante de `test:all` passar sem
browser). **SKIP nunca conta como PASS** e **não satisfaz** evidência de fase, de auditoria ou de
freeze: toda execução canônica (entrega de fase, auditoria, decisão de freeze) deve produzir
**UG13 PASS em Chromium real**.

---

# 13. CURRENT × TARGET (correção M-6 — delta sobre superfície existente)

**Fato do baseline:** Current × Target **já existe, congelado e gatilhado** — tela `#ux-target`
(`ui_target_v32.js:50` pré micro-fase), PDF `pr-target` (`:188`), suíte TARGET 4.3.1 (30/30) e gate
visual V9 ("overlay verde tracejado só com override, polígono atual inalterado"). O alvo já é
declarado por pergunta (`TARGET_PROFILE.overrides`), nunca fixo, estritamente superior ao atual
(`setTarget` recusa `v < cur`) e revalidado (`revalidateTargets`). As cláusulas abaixo são **delta de
apresentação sobre superfície existente**, nunca reimplementação.

## UI-017 — Current vs Target

Visualizações novas de Current × Target usam **somente o Target Profile canônico já existente**
(`TARGET_PROFILE.overrides`). Não usar target fixo `3.0` (AP-09). O perfil computado é derivado e
recalculado, nunca serializado como fonte.

## UI-018 — Target não altera Current

Alterar/visualizar target nunca altera: current answers · current score · current findings · current
sufficiency · canonical assessment state não relacionado a target.

### Gate associado
P50-UX6, P50-UX9.

## UI-019 — Current insuficiente / UNSET (preservação)

A violação de geometria que esta cláusula apontava na REV A **foi corrigida pela micro-fase UNSET**
(overlay `ui_target_v32.js:120` e radar do PDF `:179`, ambos pré micro-fase). A cláusula vira
preservação (§12.2 blocos a–b, gates UG5/UG6): não desenhar current como zero; não preencher missing
points com `0`; exibir estado de insuficiência via contrato UI-012A; target exibível separadamente
apenas se não induzir comparação falsa.

---

# 14. STRENGTHS / PRIORITY IMPROVEMENTS

## UI-020 — Executive cards somente após gate

Cards como `Key Strengths` · `Priority Improvements` · `Gap to Target` só são exibidos quando o
veredito canônico permitir (`sufficient === true` no contrato UI-012A). Não construir ranking
executivo sobre UNSET ou sobre estado insuficiente.

### Gate associado
P50-SUF1, P50-SUF4, P50-SUF5.

## UI-021 — Evidence qualification

Onde existir status canônico, distinguir estados. **Fato do baseline:** a taxonomia de qualificação
(confirmado/preliminar/insuficiente) usada no template de relatório consultivo **não** pertence ao
modelo canônico do produto. Regra de governança:

```text
se a taxonomia existir como estado canônico → pode renderizar
se não existir → não inventar; a UI opera sem ela
introdução futura → microfase dedicada de schema/content/methodology (§33, contrato separado)
a Phase 5.0 funciona integralmente sem essa taxonomia
```

Os únicos estados renderizáveis nesta fase são os canônicos existentes: os três estados de resposta
(UI-016a), presença de nota (UI-007) e o contrato de suficiência (UI-012A). Não inferir "confirmed"
pela existência de resposta ou nota.

---

# 15. FRAMEWORK VIEWS — NIST / CIS — **REMOVIDAS DO ESCOPO (decisão D4/DL-4)**

```text
CLÁUSULAS UI-022, UI-023, UI-024, UI-025 — REMOVIDAS DO ESCOPO DA PHASE 5.0.
GATES MAP1–MAP5 — REMOVIDOS. FIXTURE de framework derivado — REMOVIDA.
Numeração preservada para rastreabilidade.
```

**Fundamento:** não existe dataset de mapeamento canônico em lugar algum do baseline; a única
ocorrência de "NIST CSF 2.0" no runtime é nome de oferta comercial na trilha Fundação (`fonte:810`
pré micro-fase). A própria UI-024 da REV A determinava `FEATURE BLOCKED` sem dataset canônico
aprovado. Logo, não é decisão de design de UI: qualquer painel NIST/CIS futuro é **microfase separada
de conteúdo/metodologia** (framework, versão, dataset version, source/owner, direção, one-to-one/
one-to-many, agregação, limitações), registrada em §33 como contrato separado.

Permanecem válidos como princípio geral (herdados em UX-P6 e AP-04/AP-08): visão derivada é rotulada
como derivada; ausência de dados nunca é `0%`; mapping nunca alimenta maturidade; mapping nunca nasce
dentro do renderer.

---

# 16. BASIC / ADVANCED MODE

## UI-026 — Toggle candidato, não automaticamente aprovado

**Modelo 1 — View density only** (Basic/Advanced muda somente quantidade de ajuda/metadata visível):
**único modelo admissível nesta fase.**

**Modelo 2 — Assessment depth** (muda question set): **NÃO é UI-only** — exige contrato normativo
separado (applicability; scoring; sufficiency; session roundtrip; comparação entre modos; report
labeling). Registrado em §33 como contrato separado.

### Gate obrigatório (Modelo 1)
```text
canonical assessment state before == after
score before == after
sufficiency before == after
```
Gate: P50-UX7 (oráculo de estado: `captureCanonicalInputs()` — ver P50-UX9).

---

# 17. CONDITIONAL QUESTIONS

## UI-027 — Conditional reveal

Subperguntas condicionais só para fields/questions **já existentes** no modelo canônico e regras de
applicability já aprovadas. Não criar novas perguntas por conveniência de UI (AP-06).

### Gate
Condition false: `hidden field does not fabricate canonical value`.
Condition true: `field appears; existing value restored if canonical contract says it should persist`.
Gate: P50-UX8.

---

# 18. RESULTS INFORMATION ARCHITECTURE

## UI-028 — Results tabs (correção L-4)

Estrutura candidata:

```text
Resumo
Domínios
Heat Map (domínio → pergunta)
Análise
```

(Sem tab `Framework Mapping` — removida por §15; heat map por **pergunta**, não por "aspecto" —
camada inexistente, correção A-2.) Nomes finais seguem produto e UI-033A.

## UI-029 — Summary

Quando suficiente: overall maturity; target context; badge de suficiência; domain profile;
strengths/priorities; current × target.
Quando insuficiente: completion; progresso de suficiência (contrato UI-012A); domínios com déficit;
resultados executivos bloqueados.

## UI-030 — Domain view (correção A-2)

Drill-down:
```text
domínio → perguntas → resposta/estado/nota de cada pergunta
```
Resultado deve ser explicável: cada score de domínio decompõe-se nas suas 3 perguntas, com os três
estados de resposta visíveis (UI-016a).

---

# 19. VISUAL DESIGN SYSTEM (decisão D5/DL-4 — BRANDING-01 ENCERRADO)

## UI-031 — Tokens de cor: fonte única congelada (cláusula COR-01 do backlog)

**Decisão registrada (DL-4):** a paleta congelada é o branding oficial — `PR_DOM_HEX`
(`ui_v32.js:643` pré micro-fase), custom properties `--ftnt-purple/green/teal/blue/silver` (uma por
domínio, asseridas em runtime pelos gates visuais V4+V5), `#DA291C` como acento de marca e a marca
"Fortinet · Quickscan SecOps · SOC-CMM" no cabeçalho do print (`ui_v32.js:682`). **Custo de boundary
registrado:** a alternativa Quickscan-neutra implicaria alterar superfície de print e gates visuais
congelados — rejeitada. BRANDING-01 está **encerrado**; nenhuma pendência de branding permanece.

**COR-01.1 — Consumo exclusivo de tokens congelados.** Toda superfície nova da Camada 5 que exibir
cor de domínio DEVE consumi-la das custom properties `--ftnt-*` congeladas. É PROIBIDO declarar hex
literal de cor de domínio fora da fonte única congelada.

**COR-01.2 — Papel do acento de marca.** `#DA291C` é acento de marca, não cor de dado: progresso
global, seleção ativa, marcações de cabeçalho/print. Réguas, radar, heat map e qualquer visualização
em que o domínio é a dimensão usam a cor do próprio domínio.

**COR-01.3 — UNSET esmaecido na cor do domínio.** UNSET em superfícies novas usa a cor do próprio
domínio **esmaecida** (tracejado/lacuna) — nunca cinza genérico, nunca o acento de marca. A diferença
em relação às superfícies congeladas (pontilhado neutro, §12.2b) é deliberada.

**COR-01.4 — Gates.** P50-COR1…P50-COR4 (§25); V4+V5 permanecem a autoridade sobre as superfícies
congeladas e ficam intactos.

## UI-031A — Ícones oficiais em superfícies novas (cláusula ICON-01 do backlog)

**ICON-01.1 — Fonte única congelada.** Ícone de produto/serviço Fortinet em superfície nova
resolve-se exclusivamente via `window.__V32UI.iconFor(itemId, name)` do runtime congelado
(`iconFor` já exposto na ponte — `ui_v32.js:827` pré micro-fase, verificado no core extraído;
**nenhuma linha aditiva no core é necessária**). PROIBIDO: novo mapa de ícones; SVG/base64 de produto
fora de `ICONS_V32`; duplicação total ou parcial de `ICON_MAP_V32`.

**ICON-01.2 — Semântica de fallback preservada.** O fallback determinístico de iniciais
(`.v32-icon-fb`) é comportamento correto e congelado para: entidades sem asset oficial (`fortisat`,
decisão `FALLBACK_RETAINED_NO_ASSET`) e abstrações de família (`endpoint-family`, `fortimail-family`,
`identity-family`, `soc-platform-family`, decisão `FALLBACK_RETAINED_ABSTRACTION`). Superfícies novas
DEVEM renderizar o fallback quando `iconFor()` o produzir; é PROIBIDO atribuir a família o ícone de um
produto específico. `ICON_ASSET_DECISIONS_V32.md` (Fase 4.6) permanece normativo; sua revisão está
fora do escopo 5.0.

**ICON-01.3 — Liberdade de apresentação, não de conteúdo.** Dimensionar, posicionar e agrupar é
livre, desde que: (a) o asset seja byte-idêntico ao servido por `ICONS_V32`; (b) contraste e
legibilidade respeitem o tema dark congelado; (c) nenhuma transformação altere o artwork (sem recolor,
retracing ou recomposição) — proveniência "cópia byte-a-byte" da Fase 4.6.

**ICON-01.4 — Superfícies congeladas intocadas.** Listas do Recommendation Context, print/PDF e os 12
gates da suíte ICONS 4.6 permanecem intactos. Ícones no PDF: **fora do escopo 5.0**; proposta futura
exige autorização própria, evidência Chromium nova e novos baselines de print.

**Registro anti-reabertura:** os ícones **já renderizam** nas listas `.v32-cand`/`.v32-svc` via
`iconFor()`; a percepção de "falta de ícone" em itens específicos decorre de decisões congeladas
corretas (fallback by design). Esta cláusula trata de consumo em superfícies novas, não de correção do
estado atual.

**Gates:** P50-IC1…P50-IC4 (§25).

## UI-032 — Dark theme

O tema dark congelado é o tema do produto (consequência de DL-4). Superfícies novas atendem
legibilidade/acessibilidade (§20); o branding não justifica contraste insuficiente — onde `#DA291C`
for usado em texto sobre dark, exigir ≥ 4.5:1 ou usar variante/peso que atinja o contraste.

## UI-033 — Color semantics

A semântica de cores é a **congelada**: cor própria por domínio (`--ftnt-*`) nas dimensões de dados;
`#DA291C` como acento de marca; tracejado+`#3CB17E` exclusivo do cenário-alvo (T14/V9); pontilhado
neutro para UNSET nas superfícies congeladas; cor do domínio esmaecida para UNSET nas superfícies
novas. Nunca usar só cor (UX-P7). Nenhuma paleta nova é criada nesta fase.

## UI-033A — Idioma baseline (correção M-5)

```text
PT-BR é o idioma da UI NOVA (chrome, mensagens, rótulos de estado).
Denominações canônicas de domínio e estágio permanecem como congeladas, em PT/EN
(DOMS {en,pt} — fonte:275; stageOf {en,pt} — fonte:474; render "EN · PT" — fonte:924, pré micro-fase).
EN/i18n generalizado é future scope e não pode ser introduzido como efeito colateral desta fase.
```

Strings novas permanecem centralizáveis, sem dependência estrutural do texto.

---

# 20. ACCESSIBILITY

## UI-034 — WCAG target
`WCAG 2.2 AA` para a superfície nova de assessment/resultados, exceto limitações formalmente
documentadas no evidence package.

## UI-035 — Contrast
Texto normal `≥ 4.5:1` · texto grande `≥ 3:1` · estados de UI/focus cumprem os requisitos aplicáveis.
Gate: P50-ACC4.

## UI-036 — Keyboard
Fluxo crítico completável sem mouse: navegação por domínio/pergunta; seleção de resposta; notas;
next/previous; export/import; navegação de resultados. Gate: P50-ACC2.

## UI-037 — Focus
Indicador de foco claro e persistente. Não remover outline sem substituto equivalente.
Gates: P50-ACC3, P50-VIS5.

## UI-038 — Target size
Controles interativos atendem o requisito AA aplicável de target size; preferir área confortável para
notebook/tablet.

## UI-039 — Screen reader semantics
Landmarks/labels apropriados. Charts novos têm alternativa textual ou tabela equivalente para os dados
essenciais. Gate: P50-ACC5.

---

# 21. RESPONSIVE

## UI-040 — Breakpoints (detalhamento M-8)

Viewports canônicos da fase (os mesmos de `VISUAL_GATES_V32.md`):

```text
1920×1080   desktop wide
1440×900    desktop/laptop
1366×768    laptop
390×844     narrow/mobile-width
```

Smartphone como use case só se explicitamente aprovado; renderizar não é suportar.
Gates: P50-VIS1…P50-VIS4.

## UI-041 — Sidebar collapse
Sidebar contextual pode colapsar em telas menores sem remover acesso aos dados.

## UI-042 — Charts
Charts não cortam labels, não dependem de hover, não exigem zoom horizontal desnecessário. Radar denso
tem alternativa tabular (P50-ACC5). Gate: P50-VIS7.

---

# 22. PERFORMANCE / LOCALITY

## UI-043 — Local-first preserved
A evolução visual não adiciona: telemetry; tracking; CDN obrigatório; remote font obrigatória;
network API; analytics; cloud persistence. (Regra do projeto; verificado pela regressão congelada de
rede/persistência.)

## UI-044 — Interaction latency
Seleção e navegação permanecem responsivas nos datasets canônicos máximos. Budgets numéricos só após
baseline measurement registrado no evidence package — não inventar números antes da instrumentação.

---

# 23. PRINT / PDF

## UI-045 — Screen/Print semantic parity — **normativa de produto, BLOCKED para implementação**

UNSET, NONE, insufficient e target permanecem semanticamente distinguíveis nos artefatos em que forem
autorizados; nunca depender só de cor. A implementação de **novas** semânticas em PDF/print depende de
microfase explicitamente autorizada de Print/Render UX (§29). A Phase 5.0 **não** recebe autorização
implícita para modificar o print pipeline. (A paridade já entregue pela micro-fase UNSET — geometria
idêntica tela/PDF — é preservada por UG4/UG6/UG9, não reaberta.)

## UI-046 — Results consistency
Tela e PDF derivam do mesmo estado canônico/derived recomputation. Não criar lógica de scoring
específica do print. (Já é o comportamento congelado; cláusula de preservação.)

## UI-046A — Insufficient Print Policy — **RESOLVIDA (decisão M-1)**

A premissa da REV A (ausência de política) era falsa: o runtime congelado **já implementa**
`COLLECTION_REPORT` de fato (`ui_v32.js:687–689` pré micro-fase; gate congelado P11 — "insuficiência:
score n/d, sem estágio fabricado"). `BLOCK_PRINT` seria **regressão de comportamento congelado** e é
**descartado**.

**Decisão registrada do proprietário (ratificação do status quo):** sob gate global fechado, scores
parciais por domínio podem aparecer no `COLLECTION_REPORT` **apenas como diagnóstico intermediário**,
acompanhados de indicação inequívoca de evidência insuficiente; **não constituem veredito executivo**.
Overall, estágio, strengths, priorities e conclusões executivas permanecem bloqueados ou `n/d`.
**Esta decisão não autoriza alteração de print na Phase 5.0.**

### Regra comum preservada
Em nenhuma circunstância o PDF produz score/stage executivo com o gate de suficiência fechado —
comportamento já asserido por P11, que permanece intacto.

---

# 24. SECURITY / PRIVACY

## UI-047 — No new persistence claims
Nenhum componente novo afirma autosave sem implementação e gate correspondentes (P50-SESUX1A/1B).

## UI-048 — Notes may be sensitive
Campos de evidência podem conter informação sensível do cliente. Exibir orientação curta quando
apropriado:
```text
Evite registrar segredos, credenciais ou dados pessoais desnecessários.
```

## UI-049 — Safe rendering (correção M-2)

Toda saída de texto livre **nova** (evidência/racional é exatamente isso) usa **`escAttr`/`esc32`**
(`ui_v32.js:255–257` pré micro-fase) — escapa `& " ' < >`, seguro para texto **e** atributos. O `esc`
da Camada 1 (`fonte:472`; escapa apenas `&` e `<`) **não é suficiente** para superfície nova. A
expressão ambígua "o mesmo modelo de escaping já congelado" está eliminada desta spec.

Testes adversariais obrigatórios para: `<script>` · `<img onerror>` · `<svg/onload>` · quotes ·
angle brackets · unicode edge cases. Gate: P50-UX12.

---

# 25. GATES EXECUTÁVEIS (remediação de B-4 — namespace fixado)

## 25.1 · Tabela de reserva de namespace (obrigatória)

| intervalo/prefixo | ocupado por | observação |
|---|---|---|
| `UX1–UX56` | `tests_ux_m41.js` (UX 4.1) | colisão da REV A eliminada |
| `F1–F9` | `tests_visual/fixtures.js` | significados invertidos vs REV A (F1/F5/F6) — eliminados |
| `V1–V12` · `P1–P11` | gates visuais/print congelados | |
| `S1–S113` | suíte SESSION 4.8 | **teto de identificador = S113**; 97/97 é contagem de execuções |
| `SE1–SE8` | gates Chromium de sessão | |
| `T*` · `N*` · `M*` · `RCE*` · `CD*` · `FR*` | Target/Journey/Matriz/engine/Client Delivery/Final | |
| `UG1–UG13` | micro-fase UNSET | ocupado; integra a regressão desta fase |
| `D1–D19` · `A1–A31` | gates de documentação 4.9 e IDs compostos da suíte ICONS 4.6 (até `A31`) | |
| `R1–R7` · `FZ*` | gates de documentação 4.9 | |
| prefixo `MAP` | **PROIBIDO** — colide com o global `MAP` do runtime (L-2); conteúdo removido (§15) | |

**Regra de nomeação (fixada):** todo gate e fixture novo da Phase 5.0 usa **exclusivamente** o formato
`P50-<ÁREA><N>`. Verificado: `P50-*` não possui colisão literal atual com nenhuma suíte congelada.
IDs fixados: `P50-IC1…P50-IC4` (ícones) e `P50-COR1…P50-COR4` (cor). `COR-01`/`ICON-01` são nomes de
**cláusula**, nunca IDs de gate.

## 25.2 · Gates de governança

**P50-GOV1 — Protected-surface authorization (por símbolo/seção — correção A-7).**
O gate opera por símbolo/seção, não por arquivo, usando o mapa tela × print da §29.1. Antes de
qualquer edição: `símbolo/superfície requerida → dentro da boundary nominal (§29)? → sim: prossegue ·
não: STOP`. Aplicável especialmente a: engine, schema, question bank, print/render, content
descriptors. FAIL se qualquer edição tocar símbolo protegido.

**P50-GOV2 — Coerência de promoção (remediação de B-6).**
Verifica que a spec promovida e o `CLAUDE.md` referenciam o mesmo arquivo e o mesmo SHA-256, e que o
registro de promoção (data + SHA) existe. FAIL em qualquer divergência.

**P50-GOV3 — Reancoragem de citações (guard de implementação).**
Verifica que toda âncora simbólica (arquivo, símbolo) usada por gate novo tem entrada **verificada**
no mapa `docs_phase5/REV_B_REANCHOR_MAP.md` (posição no baseline atual + SHA do arquivo verificado)
antes da primeira execução do gate dependente. FAIL se um gate dependente executar com entrada do mapa
pendente ou divergente. A spec em si não depende de posições antigas (§0.A).

## 25.3 · Gates de assessment experience

**P50-UX1 — Answer labels não mudam valores canônicos.** Selecionar cada card (0..3, "NA") em cada
pergunta → valor canônico esperado em `ans[k]`; nenhum valor criado/removido/reordenado (UI-003).
**P50-UX2 — Seleção por teclado.** Arrow/Tab/Space/Enter na superfície nova produzem o mesmo estado
canônico que o clique; sem perda de estado; regressão UX 4.1 e V6 intactas (UI-004).
**P50-UX3 — Semantic cue corresponde à opção selecionada.** Cue exibida = descrição canônica
(`opts[].d`) ou descritor genérico (Caminhos A/C, UI-005); sem cue stale ao trocar opção.
**P50-UX4 — Evidência binda somente ao owner canônico.** Nota digitada na superfície nova aparece em
`notes[k]` e em `inputs.assessment.notes[qid]` no export; roundtrip preservado (UI-006).
**P50-UX5 — Metadata chips com provenance.** Todo chip tem fonte no runtime; nenhum chip fabricado
(UI-008).
**P50-UX6 — Navegação não muta respostas.** Trocas de domínio/pergunta/tab são presentation-only
(oráculo: P50-UX9).
**P50-UX7 — Basic/Advanced (Modelo 1) não muta estado canônico.** Aplicável apenas se o toggle for
implementado (UI-026).
**P50-UX8 — Conditional UI não fabrica valores ocultos** (UI-027).
**P50-UX9 — Presentation state isolation (correção A-5).** Mudanças exclusivamente visuais (tab,
sidebar, expanded state, modo view-only, filtro, seleção de chart) provam:
```text
JSON.stringify(captureCanonicalInputs()) before === after
score before === after
sufficiency (veredito canônico) before === after
```
**Oráculo obrigatório:** `captureCanonicalInputs()` (`ui_session_v32.js:42` pré micro-fase — cinco
owners canônicos). **Proibido** usar como oráculo: o documento exportado completo (carrega `createdAt`
e nunca é igual entre dois exports) e `fullStateJSON()` (não cobre `targetProfile.overrides` nem
`operationalRefinement.answers`). Este gate resume a filosofia da fase: apresentação nunca produz
efeito canônico.
**P50-UX10 — Três estados de resposta (correção A-3).** Fixture P50-F6: `null`, `"NA"` e `0` na mesma
tela → DOM semantics, rótulo visível e nome acessível distintos; `0` plotado, `null` omitido, `"NA"`
como item de validação.
**P50-UX11 — UNSET × NONE no eixo de presence.** Fixture P50-F7 → DOM semantics, rótulo e nome
acessível distintos entre capability `UNSET` e capability `NONE` (asserção print BLOCKED — §23).
**P50-UX12 — Safe rendering adversarial.** Payloads da UI-049 em campos novos → texto inerte via
`escAttr`/`esc32`; zero script node; zero handler; console limpo.
**P50-UX13 — Composição de `window.__uxDecor` (UI-004A).** Prova: captura única do predecessor;
invocação preservada; decoração congelada antes da P50; idempotência (dois renders → mesma árvore);
isolamento de falha por callback; `ui_p50_suff_v32.js`/`ui_p50_results_v32.js` sem reatribuição direta
(lint no source). **Mutante obrigatório:** remover a chamada do predecessor no agregador → o gate FAIL
e/ou UX 4.1/Session acusam a regressão; source restaurado byte-idêntico após o mutante. UX 4.1 e
Session Portability permanecem integralmente verdes.

## 25.4 · Gates de suficiência

**P50-SUF0 — Renderer does not own sufficiency logic.**
```text
Dado estado canônico X: veredito canônico = dataSufficiency(stats) = Y → a UI renderiza Y.
```
O renderer não deriva independentemente outro resultado — nem mais restritivo, nem mais permissivo.
Escopo **prospectivo**: aplica-se a superfícies criadas/modificadas pela Phase 5.0 (remediação de
B-2). Lint adicional: o código de renderização novo não contém os literais `10`/`2` nem comparações de
contagem que reimplementem o gate. Precede e governa P50-SUF1..P50-SUF8.

**P50-SUF1 — Insufficient overall score hidden.** Fixture abaixo do gate → nenhum overall/stage
executivo na superfície nova (UI-013, UI-020).
**P50-SUF2 — Missing domain shows n/d, not zero.** (UI-002, UI-014.)
**P50-SUF3 — Gate message usa o contrato derivado.** As condições pendentes renderizadas provêm de
`missingGlobal`/`domains[].missing` do contrato UI-012A; não reimplementar o gate no renderer.
**P50-SUF4 — Transição insufficient → sufficient.** Ao cruzar o limiar, resultados desbloqueiam a
partir do estado canônico recomputado.
**P50-SUF5 — Sufficient → insufficient após mudança de resposta.** O bloqueio retorna corretamente.
**P50-SUF6 — UNSET vs NONE visível e semântico.** Tela + accessible name (consolida P50-UX11);
asserção print/PDF permanece BLOCKED até microfase Print/Render autorizada.

**P50-SUF7 — Gate exaustivo do contrato derivado estruturado (remediação de B-1 · DL-1).**
Sobre o espaço completo de contagens confirmadas por domínio — os **4^5 = 1024 vetores**
`(n₁,n₂,n₃,n₄,n₅)`, `nᵢ ∈ {0,1,2,3}` —, para **cada** vetor: construir o estado de respostas
correspondente, computar `stats` pela via canônica e exigir **todas** as igualdades:
```text
confirmedGlobal === n₁+n₂+n₃+n₄+n₅
requiredGlobal  === 10
missingGlobal   === max(0, 10 − (n₁+n₂+n₃+n₄+n₅))
∀i: domains[i].confirmed === nᵢ · domains[i].required === 2 ·
    domains[i].missing === max(0, 2 − nᵢ)
sufficient === (missingGlobal === 0 && ∀i domains[i].missing === 0)
derived.sufficient === dataSufficiency(stats)
```
**Correção das razões:** as condições pendentes emitidas correspondem exatamente aos déficits —
nenhum domínio com `missing === 0` aparece como pendente; todo domínio com `missing > 0` aparece;
nenhum déficit incorreto ou negativo é emitido. **Moeda:** casos representativos provam que `null` e
`"NA"` não confirmam (substituição que reduz `nᵢ` e altera o veredito ao cruzar o limiar) e que `0..3`
confirmam (inclusive `0`). Qualquer divergência em qualquer vetor ou campo é FAIL.
**Terminologia do oracle (obrigatória na implementação do teste):** as **funções reais do runtime**
(`dataSufficiency`, `confirmedCount`, `domStat`) são os **objetos submetidos à comparação de
equivalência**; as **equações e invariantes independentes acima** (aritmética de soma/max definida
pelo contrato) fornecem o **oracle de correção**. É **proibido** duplicar a fórmula de
`dataSufficiency()` no teste para fabricar um segundo oracle equivalente por construção.

**P50-SUF8 — Equivalência sobre o mesmo estado (remediação de B-2 · UI-012B).**
Registro: `dataSufficiency(stats)` lê o **owner global `ans`** via `confirmedCount()`;
`computeTargetProfile(eff)` lê o **vetor explícito `eff`**. Sobre a mesma matriz de 1024 vetores,
para **cada** vetor:
```text
1. iniciar runtime isolado OU capturar o estado anterior do owner;
2. aplicar o vetor ao owner canônico `ans` pelas rotas/setters permitidos;
3. obter `stats` pela via canônica;
4. usar um `eff` semanticamente idêntico ao estado aplicado;
5. fazer a camada derivada ler o mesmo estado;
6. chamar as funções REAIS dataSufficiency(stats) e computeTargetProfile(eff);
7. exigir computeTargetProfile(eff).suff === dataSufficiency(stats) === derived.sufficient;
8. descartar o runtime ou restaurar o estado antes do próximo vetor.
```
`ui_target_v32.js` **não é modificado**. Terminologia obrigatória e consistente com P50-SUF7:
```text
dataSufficiency(), computeTargetProfile() e a camada derivada são os objetos reais
submetidos à comparação; as equações e invariantes independentes de P50-SUF7
fornecem o oracle de correção.
```
É **proibido** duplicar a fórmula de `dataSufficiency()` no teste para fabricar um segundo oracle
equivalente por construção.

## 25.5 · Gates de sessão (UX)

**P50-SESUX1A — Lint estático de claims proibidos.** Busca por "Saved", "Auto-saved", "Pode fechar a
aba com segurança", "Retome automaticamente" e variantes nos módulos novos; útil como lint,
insuficiente sozinho.
**P50-SESUX1B — Rendered persistence claim (Chromium).** Texto visível **e** accessible/computed text
do componente de status de sessão correspondem ao estado real. Fixtures obrigatórias:
```text
fresh assessment · modified but not exported · export success ·
import success · post-import modification · export failure
```
Cada fixture prova ausência de claim de autosave/resume — inclusive texto composto por nós DOM
separados, ícone+tooltip ou conteúdo dinâmico. (O componente de status de sessão é superfície nova —
hoje só existem os botões Exportar/Importar; o rastreio "modificado desde o export" é estado efêmero
enumerado em UI-010A.)
**P50-SESUX2 — Wording de export só após export bem-sucedido.**
**P50-SESUX3 — Wording de import não implica persistência automática.**
**P50-SESUX4 — Session roundtrip permanece canônico.** (Não duplicar cobertura da SESSION 4.8; este
gate exercita apenas o caminho com a superfície nova ativa.)
**P50-SESUX5 — Exclusão de UX-derived state.** Manipular estado de apresentação (UI-010A, incluindo
dirty flag) → exportar → o JSON não contém nenhum desses estados. Complemento adversarial: injetar os
campos no import → rejeição pelo strictness do schema v1 (`ui_session_v32.js:214/:220/:222` pré
micro-fase), nunca absorção silenciosa.

## 25.6 · Gates visuais (Chromium) — definição executável (remediação de M-8/§31)

**Ambiente canônico de todos os P50-VIS/P50-ACC:** Chromium **141.0.7390.37** dirigido por Playwright
**1.62.1**, rota de resolução de browser congelada (`CHROME_PATH` → `/opt/google/chrome/chrome` se
existir → Chromium gerenciado — mesma rota da suíte UG). Viewports: **1920×1080 · 1440×900 ·
1366×768 · 390×844**. Evidência: screenshot PNG nomeado `P50-<gate>-<fixture>-<largura>.png` +
`P50-geometry.json` (medidas + `pageErrors`), em `docs_phase5/evidence_p50/`. **Tratamento de SKIP
(todos os gates Chromium da fase):** sem browser resolvível, o gate imprime `SKIP … NÃO EXECUTADO` e
**nunca conta como PASS**; execução canônica (entrega, auditoria, freeze) exige PASS em Chromium real.

**P50-VIS1..P50-VIS4 — Layout por viewport.** Fixtures P50-F2 e P50-F5; sequência: carregar → navegar
até a superfície nova → screenshot. Observado: `document.scrollingElement.scrollWidth <=
viewport.width` (zero overflow horizontal, tolerância 0 px); todos os answer cards visíveis ou
alcançáveis por scroll vertical; navegação alcançável. PASS: todas as condições em todas as fixtures;
FAIL: qualquer violação; evidência por viewport.
**P50-VIS5 — Focus visible.** Procedimento executável, por elemento do fluxo crítico:
```text
1. navegar exclusivamente por teclado (Tab/Shift+Tab/Arrows conforme o fluxo);
2. a cada passo, obter document.activeElement;
3. exigir que o elemento corresponda a :focus-visible
   (document.activeElement.matches(":focus-visible") === true);
4. obter getComputedStyle(document.activeElement);
5. identificar o indicador nominalmente permitido: outline, box-shadow, border,
   ou combinação declarada no design da superfície nova;
6. calcular o contraste do indicador contra as cores adjacentes
   (fundo do elemento e do entorno imediato);
7. exigir contraste mínimo de 3:1;
8. FAIL em: ausência de indicador · indicador clipado (fora do viewport ou sob
   overflow oculto) · indicador imperceptível (espessura computada 0/transparente) ·
   contraste < 3:1.
```
Evidência: `P50-VIS5-focus-<fixture>-<largura>.json` com diagnóstico **por elemento** (seletor,
indicador identificado, valores computados, razão de contraste, veredito) + screenshot do estado
focado de cada elemento reprovado. PASS somente se todos os elementos do fluxo crítico passarem.
**P50-VIS6 — Zoom robustness.** Page zoom 200% em 1366×768; observado: zero overflow horizontal do
documento e nenhum texto do fluxo crítico clipado (`scrollWidth <= clientWidth` por elemento
observado). PASS/FAIL idem.
**P50-VIS7 — Chart labels.** Fixtures P50-F5 e P50-F9; método de medição de bounding box igual ao do
UG13. Condições, todas obrigatórias:
```text
1. bounding boxes dos labels DISJUNTOS ENTRE SI (tolerância de overlap: 0 px);
2. cada bounding box de label INTEGRALMENTE CONTIDO no content box do seu
   container (tolerância de overflow/clipping: 0 px);
3. nenhum label clipado por overflow oculto.
```
PASS somente se todas as condições forem verdadeiras para **todos** os labels em **todas** as
fixtures/viewports. FAIL identifica nominalmente os **pares sobrepostos** e/ou os **labels fora do
container**, com as medidas no `P50-geometry.json`.
**P50-VIS8 — UNSET/estados screenshots.** Fixtures P50-F1, P50-F6, P50-F7 nas superfícies novas;
observado: presença dos encodings da §12.2(c)/(d) — cor de domínio esmaecida + pista não cromática +
`n/d`/"Não avaliado" — e ausência de vértice/fill fabricado; evidence archive obrigatório.
**P50-VIS9 — Target vs Current semantics.** Fixture P50-F9; observado: overlay de alvo presente
apenas com override; encoding tracejado+`#3CB17E` exclusivo do alvo; polígono atual inalterado
(regressão V9/T14 intacta como autoridade nas superfícies congeladas).
**P50-VIS10 — Print/PDF.** **Sem escopo novo nesta fase.** O gate consiste exclusivamente na
reexecução integral da regressão congelada de print (UI 3.3.2/P1–P11 · print.spec · V*) e dos gates UG
aplicáveis a print (UG4, UG6, UG9), em contagens integrais. FAIL se qualquer contagem regredir.

## 25.7 · Gates de acessibilidade — definição executável

**P50-ACC1 — Baseline automatizado.** Definição executável completa:
```text
pacote:        @axe-core/playwright
versão exata:  4.13.0  (dependência transitiva: axe-core ~4.13.0;
               integrity sha512-6YLx+kxXu5GJceG4ozFg+33a2EMTdjYwWGloJ3sb9K
               ta5pp+ZNS53uxGVog5JetIY8s++P5UrtX+cri+u0VAVg==)
resolução:     dist-tag latest do registry.npmjs.org em 2026-08-19;
               peerDependency playwright-core >= 1.0.0 → compatível com o
               Playwright canônico 1.62.1 (fonte da resolução registrada
               no evidence package)
integração:    new AxeBuilder({ page }) sobre a page Playwright do ambiente
               canônico da §25.6 (Chromium 141.0.7390.37 · Playwright 1.62.1)
fixtures:      P50-F2 · P50-F5 · P50-F6, nos 4 viewports da §25.6
escopo DOM:    superfícies novas da Camada 5 (include pelos containers P50)
ruleset:       .withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"])
severidades bloqueantes: critical · serious
limitações formalmente aceitas: somente violações listadas nominalmente
               (ruleId + seletor + justificativa) em known limitations do
               evidence package, aprovadas pelo proprietário; a exclusão é
               por entrada individual, nunca por regra inteira
artefato:      P50-ACC1-axe-<fixture>-<largura>.json (relatório axe integral)
PASS:          zero violações critical/serious fora da lista de limitações
               aceitas, em todas as fixtures e viewports
FAIL:          qualquer violação critical/serious não listada; ou execução
               com versão de axe divergente da fixada
```
O lockfile da fase **reproduz** a versão fixada por esta spec (§29.3); a versão não é adiada para a
implementação. Nenhuma dependência entra no runtime/HTML.
**P50-ACC2 — Keyboard-only canonical flow.** Sequência: completar, só por teclado, o fluxo `responder
3 perguntas → registrar 1 nota → navegar a Results`; observado: estado canônico final idêntico ao do
mesmo fluxo por mouse (oráculo `captureCanonicalInputs()`). PASS/FAIL binário.
**P50-ACC3 — Focus order.** Ordem de tabulação segue a ordem visual/semântica declarada da superfície
nova; sem armadilhas de foco. Observado por travessia programática.
**P50-ACC4 — Contrast.** Medição programática das combinações texto/fundo dos componentes novos:
normal ≥ 4.5:1, grande ≥ 3:1, incluindo `#DA291C` sobre dark quando usado em texto. PASS/FAIL por
combinação, com tabela no evidence package.
**P50-ACC5 — Accessible chart alternative.** Todo chart novo expõe alternativa textual/tabela com os
dados essenciais; observado por presença e conteúdo (valores iguais aos plotados).
**P50-ACC6 — Selected answer programmatic state.** Estado selecionado programático
(`aria-pressed`/equivalente) consistente com o estado canônico em todas as perguntas da fixture.

## 25.8 · Gates de identidade visual

**P50-COR1 — Lint de fonte única.** Nenhum módulo novo da Camada 5 contém hex literal dos valores de
domínio fora da declaração congelada (`--ftnt-*`); zero ocorrências. (UI-031/COR-01.1.)
**P50-COR2 — Cor do domínio na dimensão de dados.** Nas superfícies novas, visualizações com domínio
como dimensão usam `var(--ftnt-*)` do próprio domínio; `#DA291C` ausente de dados. (COR-01.2.)
**P50-COR3 — UNSET esmaecido.** Encoding de UNSET nas superfícies novas = cor do próprio domínio
esmaecida + pista não cromática; nunca cinza genérico, nunca `#DA291C`, nunca tracejado+`#3CB17E`.
(COR-01.3, §12.2c.)
**P50-COR4 — Regressão de autoridade.** Gates V4+V5 e as superfícies congeladas permanecem intactos
(byte-idênticos onde aplicável).

**P50-IC1 — Positivo.** Superfície nova renderiza, para itemId com asset oficial (ex.: `fortisiem`),
`<img class="v32-icon">` com `src` idêntico ao de `ICONS_V32`.
**P50-IC2 — Fallback.** Para itemId de família e para `fortisat`, a superfície nova renderiza
`.v32-icon-fb`, nunca asset de produto.
**P50-IC3 — Fonte única / lint.** Nenhum módulo novo contém `data:image/svg+xml` de produto, mapa
paralelo itemId→asset, nem literal duplicado de `ICON_MAP_V32`.
**P50-IC4 — Regressão.** Suíte ICONS 4.6 permanece 12/12 e as superfícies congeladas byte-idênticas.

## 25.9 · Preservação UG

UG1–UG13 integram `test:all` da fase, em contagens integrais, sem enfraquecimento. Regra de evidência
do UG13 conforme §12.2 (SKIP nunca é PASS; execução canônica exige Chromium real).

---

# 26. VISUAL FIXTURES OBRIGATÓRIAS (namespace P50-F)

| fixture | conteúdo | uso principal |
|---|---|---|
| **P50-F1** — Blank assessment | todas as respostas `null`; landscape todo `UNSET` | P50-VIS8; §12.2 |
| **P50-F2** — Partial insufficient | algumas respostas confirmadas; gate fechado | P50-SUF1..3; P50-VIS1..4; P50-ACC1 |
| **P50-F3** — Near threshold | exatamente uma condição de suficiência faltando (ex.: 10 globais, um domínio com 1) | P50-SUF3/SUF4 |
| **P50-F4** — Exactly sufficient | boundary mínimo: 10 confirmadas, 2 por domínio | P50-SUF4 |
| **P50-F5** — Fully sufficient | cobertura alta (15 confirmadas) | P50-VIS/ACC; P50-SUF5 |
| **P50-F6** — Três estados de resposta | `null`, `"NA"` e `0` lado a lado no mesmo domínio | P50-UX10; P50-VIS8 |
| **P50-F7** — UNSET vs NONE (presence) | capability A = `UNSET`, capability B = `NONE` | P50-UX11 |
| **P50-F8** — Rich notes | texto longo, Unicode, punctuation | P50-UX4; P50-UX12 |
| **P50-F9** — Target profile | current + overrides legítimos (target > current) | P50-VIS9 |
| **P50-F10** — Adversarial content | strings de segurança/escaping (UI-049) | P50-UX12 |

Fixture de framework derivado: **removida** (§15). Fixture de print insuficiente (ex-PRINT-F1):
**movida para o contrato separado** de Print/Render (§33) — executável somente dentro daquela
microfase autorizada; a regra comum (nenhum score executivo sob gate fechado) já é asserida por P11.

---

# 27. CRITÉRIOS DE ACEITE DE PRODUTO

A experiência nova deve permitir que um assessor:

1. encontre rapidamente onde está no assessment (domínio → pergunta);
2. compreenda o significado da opção pelo texto canônico, sem depender só do número;
3. capture racional/evidência no momento apropriado (owner por pergunta existente);
4. veja quanto falta responder (completion);
5. veja separadamente a suficiência, na moeda canônica, com déficits exatos (contrato UI-012A);
6. identifique `não avaliado` (`n/d` + "Não avaliado") sem confundir com maturidade zero e distinga
   os três estados de resposta;
7. exporte/importe sessão sem acreditar que existe autosave;
8. abra Results sem receber score executivo quando insuficiente;
9. compare Current × Target usando somente o alvo canônico declarado;
10. navegue por teclado o fluxo crítico completo;
11. mantenha em tela e PDF a semântica essencial já congelada (nenhuma semântica nova de print nesta
    fase).

---

# 28. ANTI-PATTERNS EXPLICITAMENTE PROIBIDOS

| AP | conteúdo | estado no baseline |
|---|---|---|
| AP-01 | mostrar score composto com evidência insuficiente | proibido; gate congelado P11 + P50-SUF1 |
| AP-02 | converter unanswered/UNSET em zero | **corrigido nas superfícies congeladas pela micro-fase**; proibido em superfícies novas (§12.2, UG, P50-VIS8) |
| AP-03 | radar preenchendo missing com `0` | idem AP-02 (UG1/UG4/UG5/UG6) |
| AP-04 | `0%` derivado quando o real é "sem evidência avaliada" | princípio preservado (framework views fora do escopo — §15) |
| AP-05 | comunicar "Saved" sem autosave real | P50-SESUX1A/1B |
| AP-06 | pergunta nova via "conditional UI" sem mudança metodológica aprovada | P50-UX8 |
| AP-07 | Basic/Advanced alterando scoring sem contrato | P50-UX7; Modelo 2 = contrato separado |
| AP-08 | framework mapping criado dentro do renderer | proibido (princípio); escopo removido |
| AP-09 | target fixo global como `3.0` | proibido; o runtime congelado já impede (`setTarget`) |
| AP-10 | cor como única indicação de estado | UX-P7; P50-ACC4/P50-VIS8 |
| AP-11 | copiar textos/layout/assets do benchmark | §3 |
| AP-12 | usar UI redesign como justificativa para refactor de engine | §2; P50-GOV1 |

---

# 29. CHANGE BOUNDARY (remediação de A-6/A-7 — listas nominais; sem autorizações genéricas)

## 29.1 · Mapa normativo tela × print (granularidade por símbolo — P50-GOV1)

| arquivo | superfície de tela (autorizável mediante cláusula) | superfície print/render (protegida, 4.7) |
|---|---|---|
| `ui_v32.js` | editor, cards, blocos pós-resultado | `prRadarSVG` · `buildPrintReport` · `preparePrint` · `safePrint` |
| `ui_target_v32.js` | `tgtSection` | `pr-target` |
| `ui_journey_v32.js` | render de jornada | `pr-journey` |
| `ui_refinement_v32.js` | render de refinamento | `pr-refinement` |

(Posições de linha herdadas da auditoria são pré micro-fase; reancorar por §0.A/P50-GOV3.)
**Nesta fase, nenhuma das colunas acima é editada:** toda a implementação vive nos módulos novos
abaixo, que decoram pós-render e usam os setters congelados (D1/DL-3, UI-004).

## 29.2 · Módulos novos autorizados (lista nominal e fechada)

| módulo novo | responsabilidade | injeção no build |
|---|---|---|
| `ui_p50_shell_v32.js` | assessment shell (navegação domínio→pergunta, answer cards, chips, indicador de evidência, componente de status de sessão) e **owner único de composição de `window.__uxDecor`** (UI-004A: captura única do predecessor, decoração congelada antes, idempotência, isolamento de falhas) | sim |
| `ui_p50_suff_v32.js` | camada derivada de suficiência (contrato UI-012A; única declaração nova de limiares; painel de suficiência); **exporta funções de decoração consumidas pelo agregador — não reatribui `window.__uxDecor`** | sim |
| `ui_p50_results_v32.js` | results tabs, heat map domínio→pergunta, drill-down, executive cards gated, visual Current×Target novo (consumindo `TARGET_PROFILE` congelado); **exporta funções de decoração consumidas pelo agregador — não reatribui `window.__uxDecor`** | sim |
| `ui_p50_v32.css` | estilos das superfícies novas (consumindo `--ftnt-*`; zero hex de domínio) | sim |
| `tests_p50_core.js` | gates P50-UX*, P50-SUF* (inclui SUF7/SUF8 exaustivos), P50-SESUX* estruturais, P50-COR1..3, P50-IC1..3, P50-GOV* | não (teste) |
| `tests_p50_chromium.js` | gates P50-VIS*, P50-ACC*, P50-SESUX1B (dirige Chromium diretamente, mesma rota de resolução da suíte UG; **não toca `tests_visual/`**) | não (teste) |
| `fixtures_p50.js` | fixtures P50-F1..P50-F10 | não (teste) |

Nenhum outro módulo é autorizado. Módulo não listado nominalmente = edição/criação proibida, exigindo
revisão desta spec.

## 29.3 · Arquivos existentes cuja edição é permitida (lista nominal e fechada)

| arquivo | edição permitida | limite |
|---|---|---|
| `build_v32_html.py` | **somente** adicionar as entradas de injeção dos módulos `ui_p50_shell_v32.js`, `ui_p50_suff_v32.js`, `ui_p50_results_v32.js`, `ui_p50_v32.css`, **nesta ordem declarada**, após a entrada existente de `ui_session_v32.js` (JS) e após `ui_ux_v32.css` (CSS) | nenhuma outra linha; **permanece protegido** |
| `package.json` | **somente** adicionar os scripts nominais: `"test:p50"` (→ `node tests_p50_core.js`), `"test:p50vis"` (→ `node tests_p50_chromium.js`), e incluí-los em `test:all`; **somente** adicionar a devDependency de teste `"@axe-core/playwright": "4.13.0"` (**versão exata** — proibido `^`, `~`, `latest` ou faixa flutuante; P50-ACC1) | **scripts existentes intocados**; `package.json.version` **intocado**; nenhuma dependência de runtime; axe-core **não** entra no HTML |
| `package-lock.json` | **somente** registrar o delta resolvido da devDependency aprovada: bloco raiz + subgrafo estritamente necessário (`@axe-core/playwright@4.13.0` e sua transitiva `axe-core`) | nenhuma outra entrada alterada; `npm ci --engine-strict` permanece o caminho canônico de instalação |

Precedente registrado: o desvio de `package.json` da micro-fase permanece classificado como desvio
divulgado e autorizado a posteriori — não é reclassificado.

## 29.4 · Protegidos (lista nominal; edição proibida nesta fase)

`engine_v32.js` · `quickscan_secops_soccmm_v3_1_3.html` (Camada 1, no estado do baseline de trabalho)
· `ui_v32.js` · `ui_ux_v32.js` · `ui_target_v32.js` · `ui_refinement_v32.js` · `ui_journey_v32.js` ·
`ui_session_v32.js` · `ui_icons_v32.js` · `ui_v32.css` · `ui_ux_v32.css` · `generate_icons_v32.py` ·
`harness_m41_v313.js` · `v3_1_3_functional_snapshot.json` · todas as suítes congeladas
(`tests_*.js` existentes, incluindo `tests_unset_ug.js`) · `tests_visual/` · `MANIFEST.sha256` do core
4.8.0.7 (**imutável**) · question bank · schema de sessão · qualquer conteúdo metodológico.

O delta da fase vive em manifesto próprio do workspace: `MANIFEST_PHASE5_P50.sha256` (precedente:
`MANIFEST_PHASE5_UNSET.sha256`), estendido a cada entrega.

## 29.5 · Superfícies visuais abrangidas (lista nominal)

Tela de assessment nova (shell, answer cards, sidebar); painel de suficiência; componente de status de
sessão; results tabs novas; heat map domínio→pergunta; drill-down de domínio; executive cards gated;
visual novo de Current×Target. **Nenhuma superfície de print/PDF** (protegidas; §23).

## 29.6 · Print/Render Boundary

O pipeline de print e suas semânticas congeladas (4.7) permanecem protegidos por default. Requisitos
que exijam novas semânticas em PDF (UI-045; fixture de print) executam-se em **microfase explicitamente
autorizada de Print/Render UX** (contrato separado, §33), preservando e reexecutando todos os
gates/evidências congelados da 4.7. A Phase 5.0 não recebe autorização implícita.

Se um requisito exigir tocar arquivo/símbolo protegido:
```text
STOP → classificar o requisito → abrir microfase dedicada → revisão independente
```

---

# 30. EVIDENCE PACKAGE DA PHASE 5.0 (lista nominal de artefatos exigidos)

1. esta spec promovida (SHA registrado) + registro de promoção;
2. change boundary aprovada (§29) e mapa de reancoragem `docs_phase5/REV_B_REANCHOR_MAP.md` com todas
   as entradas verificadas (P50-GOV3);
3. screenshots Chromium por gate/fixture/viewport (`docs_phase5/evidence_p50/*.png`);
4. `P50-geometry.json` (medidas + `pageErrors`) e diagnósticos `P50-VIS5-focus-*.json`;
5. tabela de contraste (P50-ACC4) e relatórios `P50-ACC1-axe-*.json` de **axe-core via
   `@axe-core/playwright@4.13.0`** (versão exata da spec + fonte da resolução registrada);
6. fixtures P50-F1..P50-F10 (`fixtures_p50.js`);
7. relatório de testes com contagens integrais (novas + congeladas + UG), primeira execução com FAIL
   declarada quando houver;
8. mutation/adversarial testing dos gates novos (poder discriminante, como na suíte UG);
9. hashes de build (duas execuções → mesmo SHA) e `MANIFEST_PHASE5_P50.sha256`;
10. clean-room report quando solicitado;
11. known limitations;
12. UX decision log (benchmark SOCSCOPE apenas como referência não normativa).

---

# 31. DEFINITION OF DONE (correção M-7 — sem redução de regressão)

A Phase 5.0 só é candidata a freeze se:

```text
todos os invariantes metodológicos congelados preservados
engine byte-idêntico (9a4a2e67…) · payload M41 byte-idêntico (9794b267…)
UNSET != NONE preservado (UG1–UG13 integrais; §12.2)
evidência insuficiente bloqueia score executivo (P50-SUF0..SUF8 PASS; 1024 vetores)
nenhum claim falso de autosave/persistência (P50-SESUX*)
âncoras verbais mapeiam 1:1 aos valores canônicos (P50-UX1)
cues semânticos com provenance aprovada (Caminhos A/C)
notas bindam somente ao owner canônico por pergunta (P50-UX4)
Current × Target usa somente o alvo canônico (P50-VIS9; regressão TARGET/V9)
Basic/Advanced (se implementado) sem efeito canônico (P50-UX7)
conditional UI não fabrica estado (P50-UX8)
fluxo de teclado passa (P50-ACC2)
gates de acessibilidade passam (P50-ACC1..6)
gates responsivos Chromium passam (P50-VIS1..9)
REGRESSÃO DE PRINT INTEGRAL: todos os gates congelados de print/render
  (UI 3.3.2/P1–P11 · print.spec · V*) e os gates UG aplicáveis a print
  (UG4, UG6, UG9) em contagens integrais — a ausência de escopo novo de
  print NÃO autoriza redução da regressão de print
session roundtrip passa (SESSION 4.8 integral + P50-SESUX4)
regressão completa passa (todas as suítes congeladas em contagens integrais)
UG13 PASS em Chromium real (SKIP nunca conta como PASS)
build determinístico (duas execuções → mesmo SHA)
clean-room passa quando exigido
auditoria independente pendente de execução
```

(A obrigação de criar novas semânticas de print foi removida da DoD — a semântica de print permanece
BLOCKED para escopo novo nesta fase; a regressão de print permanece obrigatória e integral.)

---

# 32. STOP RULE

Ao final da implementação de cada microfase e da fase:

```text
STOP
```

Não iniciar automaticamente: nova metodologia; deep-dive question bank; framework mapping; benchmark
module; action tracker; KPI suite; accreditation module; cloud persistence; reabertura de print;
UI-010/estimativa de tempo (DL-5); próxima fase.

A Phase 5.0 somente poderá ser declarada FROZEN após auditoria independente explícita. O agente nunca
declara freeze.

---

# 33. ROADMAP — ONDAS E CONTRATOS SEPARADOS

```text
5.0.1 Assessment Shell & Answer Semantics
      ↓
5.0.2 Evidence Capture & Progress UX
      ↓
5.0.3 Sufficiency-Aware Results
      ↓
5.0.4 Target & Heat Map Visualizations
      ↓
5.0.5 Accessibility, Responsive & Visual Closure
      ↓
Independent audit
```

### Wave 1A — Pure presentation / menor risco metodológico
navigation shell; progress/completion (moeda canônica — UI-009A); mensagem honesta de Session
Portability; preservação UNSET ≠ NONE (§12.2); sufficiency lock consumindo o contrato derivado
(UI-012/UI-012A); sidebar com semântica de desconhecido; shell responsivo/acessível.
(Nota registrada da auditoria: a Wave 1A não depende de nenhum ex-blocker e não toca superfície
protegida.)

### Wave 1B — Canonical-content-dependent
âncoras verbais canônicas (UI-003); evidência inline no owner existente (UI-006); metadata chips com
provenance (UI-008).

### Wave 2 — Analytics
heat map domínio→pergunta (UI-015); visual novo de Current × Target (UI-017..019); strengths/
priorities gated (UI-020); domain drill-down (UI-030).

### Wave 3 — Provenance-dependent
semantic cue matrix question × answer via Caminho B (exige microfase de conteúdo — contrato separado).

### Contratos separados (fora da Phase 5.0; cada um exige spec/autorização própria)
Basic/Advanced Modelo 2 (question-set semantics); novas perguntas condicionais; taxonomia nova de
evidence-status (UI-021); reabertura de Print/Render (UI-045/fixture de print); datasets de framework
mapping NIST/CIS (D4); UI-010/estimativa de tempo (DL-5, se reconsiderada); revisão de
`ICON_ASSET_DECISIONS_V32.md`.

---

# 34. DECISÃO DE DESIGN CENTRAL

O principal diferencial da experiência não é "ter mais gráficos". É:

> **A interface torna explícito quando o Quickscan sabe, quando não sabe e quando ainda não possui
> evidência suficiente para emitir um número.**

Isso aparece em: sidebar; heat map; radar; executive summary; painel de suficiência; PDF (semântica
congelada preservada); session workflow. A disciplina metodológica deve ser visível ao usuário.

---

# 35. STATUS FINAL DESTA SPEC

```text
PHASE 5.0 NORMATIVE SPEC · REV B
Base: REV A (22e72917…5eb0a510) + mandato aprovado (6aa129d4…82c95bb) — nenhuma sexta fonte de escopo
Runtime, testes e documentos congelados consultados APENAS como evidência de validação

decisões incorporadas:  DL-1..DL-5 · A-8=(a) · M-1=status quo · D1..D5 · BRANDING-01 encerrado
blockers da REV A:      B-1..B-6 remediados nesta revisão
achados da REV A:       A-1..A-9, M-1..M-8, L-1..L-5 incorporados

estado corrente:
  Phase 4.8              FROZEN
  Phase 4.9.0-docs.2     FROZEN WITH NON-BLOCKING CAVEATS
  Micro-fase UNSET       ENTREGUE E APROVADA
  Phase 5.0              NÃO ABERTA · esta spec NORMATIVA desde 2026-08-19

numeração normativa:     FINAL
etapas cumpridas, NESTA ORDEM:
  1. auditoria independente da REV B — PASS, zero blockers (2026-08-19)          ✔
     docs_phase5/AUDITORIA_INDEPENDENTE_PHASE_5_0_REV_B.md · dfa80018…88c237c6
  2. aceite do proprietário + aprovação formal da change boundary (§29)          ✔
  3. registro de promoção (data + SHA-256 + atualização simultânea do CLAUDE.md) ✔
     docs_phase5/REV_B_PROMOTION_RECORD.md
pendência remanescente para abertura:
  4. abertura formal da Phase 5.0                       ← ato exclusivo do proprietário
Phase 5.0: NÃO ABERTA · Implementação: NÃO AUTORIZADA · Wave 1A: NÃO INICIADA
IMPLEMENTATION NOT AUTHORIZED · PHASE 5.0 NÃO ABERTA
```

Não executar esta especificação automaticamente.

---

# 36. RASTREABILIDADE — MANDATO (RB-*) → CLÁUSULA FINAL DESTA SPEC

Os identificadores `RB-*` são instrumentais do mandato e existem **somente** nesta tabela (e no
artefato de assurance derivado `REV_B_MANDATE_TRACEABILITY.md`, que a reproduz).

Colunas: **(1)** cláusula final da REV B · **(2)** item `RB-*` · **(3)** achado/decisão/fonte de
origem · **(4)** gate que demonstra a cláusula · **(5)** evidência exigida · **(6)** critério de
fechamento.

| cláusula final da REV B | RB-* | origem | gate demonstrador | evidência exigida | critério de fechamento |
|---|---|---|---|---|---|
| §0.A · §1 · §2 | RB-01 | B-5 · relatório da micro-fase UNSET | P50-GOV3 | bloco de baseline com hashes; mapa `REV_B_REANCHOR_MAP.md` verificado | baseline citado = hashes reais; nenhuma posição antiga como fonte normativa; limites do baseline de trabalho declarados |
| §0.A (localização/promoção) · §1 · §35 | RB-02 | B-6 · L-1 | P50-GOV2 | registro de promoção (data+SHA) + `CLAUDE.md` coerente | auditoria PASS antes da promoção; spec e `CLAUDE.md` com o mesmo SHA |
| UI-012A (arquitetura; única declaração nova) | RB-03.1 / RB-03.2 | B-1 · DL-1 (opção 1a) | P50-SUF7 · regressão M41 | payload M41 `9794b267…` byte-idêntico; lint de literais no renderer | `dataSufficiency()` intocada; limiares declarados uma única vez na Camada 5 |
| UI-012A (shape/consumo) | RB-03.3 | B-1 | P50-SUF7 (1024 vetores) | log do gate exaustivo campo a campo | todas as igualdades e razões/déficits corretos em 1024/1024 vetores |
| UI-012 · P50-SUF0..SUF6 | RB-03.4 | B-1 | P50-SUF0 · P50-SUF3 | render sob fixtures P50-F2/F3/F4 | renderer consome só o contrato; sem literais 10/2; mensagens = déficits exatos |
| UI-009 · UI-009A | RB-03.5 | A-1 | P50-SUF7 (casos de moeda) | casos `null`/`"NA"`/`0..3` no log do gate | moeda exibida = respostas confirmadas; `NA`/`null` não confirmam; `0` confirma |
| P50-SUF0 (escopo prospectivo) | RB-04.1 | B-2 | P50-SUF0 | inventário de superfícies novas/modificadas | nenhuma superfície da fase deriva suficiência própria |
| UI-012B | RB-04.2 | B-2 · TARGET 4.3.1 | P50-SUF8 (1024 vetores, 8 passos) | log de equivalência tripla por vetor | `computeTargetProfile(eff).suff === dataSufficiency(stats) === derived.sufficient` no mesmo estado; `ui_target_v32.js` intocado |
| §12.2 (quatro blocos) · UI-019 · §25.9 | RB-05.1..05.4 | B-3 · DL-2 · relatório da micro-fase | UG1–UG13 · P50-VIS8 · P50-COR3 | suíte UG integral; screenshots P50-VIS8; UG13 PASS em Chromium real | UG 13/13 sem enfraquecimento; encoding §12.2(b) byte-preservado; superfícies novas conforme (c)/(d); SKIP≠PASS |
| UI-002 · §12.2(a) · UI-014 | RB-05.5 | A-8 = opção (a) | P50-SUF2 · regressão N3/S9/T10/T11/P11 | render `n/d`+"Não avaliado"; contagens das suítes congeladas | token `n/d` preservado; rótulo aditivo presente; 5 gates congelados intactos |
| §25.1 · §25.8 · §26 | RB-06 | B-4 · L-2 | autoverificação de namespace | tabela de reserva; grep de colisões | zero gate novo fora de `P50-*`; `P50-IC1..4`/`P50-COR1..4` fixados; prefixo `MAP` ausente |
| P50-GOV1 · §29.1 | RB-07.1 | A-7 | P50-GOV1 | mapa tela×print por símbolo | nenhuma edição em símbolo protegido |
| §29.2 · §29.3 · §29.4 | RB-07.2 | A-6 | P50-GOV1 · manifesto | `MANIFEST_PHASE5_P50.sha256`; diff de `build_v32_html.py`/`package.json`/`package-lock.json` | somente as edições nominais listadas; core `MANIFEST.sha256` imutável |
| UI-001 · UI-015 · UI-028 · UI-030 | RB-08.2 | A-2 | P50-UX1 · P50-UX6 | render da hierarquia domínio→pergunta | nenhuma camada de "aspecto" criada |
| UI-002 · UI-016 · P50-F6/F7 | RB-08.3 | A-3 | P50-UX10 · P50-UX11 | DOM/labels/nomes acessíveis distintos nas fixtures | três estados de resposta distintos; UNSET×NONE no eixo de presence |
| UI-003 | RB-08.4 | A-4 | P50-UX1 | mapeamento card↔valor por pergunta | 4 opções canônicas + `NA`; nenhum valor criado/removido/reordenado |
| P50-UX9 | RB-08.5 | A-5 | P50-UX9 | comparação `captureCanonicalInputs()` antes/depois | igualdade estrita; oráculos proibidos ausentes do teste |
| UI-004 · UI-004A | RB-08.9 | A-9 · D1 | P50-UX2 · P50-UX13 · regressão V6/UX 4.1 | contagens integrais UX 4.1; mutante do predecessor detectado | markup da Camada 1 não reescrito; composição conforme UI-004A |
| UI-001 · UI-004 · §29.2 | RB-09.1 | D1 · DL-3 | P50-GOV1 | inventário de módulos novos | implementação inteira nos módulos P50 nominais |
| UI-012A | RB-09.2 | D2 (resolvida por DL-1) | P50-SUF7 | idem RB-03 | idem RB-03 |
| §12.2 · UI-002 | RB-09.3 | D3 (resolvida) + A-8 | P50-SUF2 · P50-VIS8 | idem RB-05 | idem RB-05 |
| §19 (UI-031/032/033) | RB-09.4 | D5 · DL-4 (custo registrado) | P50-COR1..4 | lint de hex; screenshots | BRANDING-01 encerrado; zero paleta nova; V4+V5 intactos |
| UI-010 (removida) · UI-010A · §32 · §33 | RB-09.5 | DL-5 | P50-SESUX5 | export sem estado efêmero | UI-010 fora do escopo; estado efêmero jamais serializado |
| §15 · §26 · §33 | RB-10 | D4 | — (remoção) | grep: ausência de cláusulas/gates MAP ativos | NIST/framework fora do escopo; princípios herdados em UX-P6/AP-04/AP-08 |
| UI-031 · §12.2(c) | RB-11 | COR-01 (backlog) | P50-COR1..P50-COR4 | lint + screenshots + regressão V4/V5 | tokens `--ftnt-*` como fonte única; `#DA291C` fora de dados; UNSET esmaecido na cor do domínio |
| UI-031A | RB-12 | ICON-01 (backlog) · N-1..N-3 | P50-IC1..P50-IC4 | render de asset e fallback; lint; ICONS 4.6 12/12 | `iconFor()` como fonte única; fallback by design preservado; PDF fora do escopo |
| UI-014 · UI-046A | RB-13.1 | M-1 (decisão do proprietário) | regressão P11 | contagem integral de print | status quo ratificado; nenhuma alteração de print na 5.0 |
| UI-049 | RB-13.2 | M-2 | P50-UX12 | payloads adversariais inertes | `escAttr`/`esc32` nomeados; `esc` da Camada 1 vetado para superfície nova |
| UI-006 | RB-13.3 | M-3 | P50-UX4 | roundtrip da nota por pergunta | binding exclusivo em `notes[k]`; STOP para segundo owner |
| UI-010A | RB-13.4 | M-4 | P50-SESUX1B · P50-SESUX5 | export inspecionado; fixtures de status | estado efêmero enumerado e excluído do documento canônico |
| UI-033A | RB-13.5 | M-5 | — (cláusula) | inspeção de strings novas | PT-BR na UI nova; denominações PT/EN congeladas preservadas |
| §13 (UI-017..019) | RB-13.6 | M-6 | P50-VIS9 · regressão TARGET/V9 | screenshots; contagens TARGET 30/30 | delta de apresentação; zero reimplementação de target |
| §31 · P50-VIS10 | RB-13.7 | M-7 | P50-VIS10 | contagens integrais de print + UG4/UG6/UG9 | DoD sem semântica nova de print; regressão de print integral |
| §25.6 · §25.7 · UI-040 | RB-13.8 | M-8 | P50-VIS1..9 · P50-ACC1..6 | screenshots/JSONs/relatórios axe | todos os gates VIS/ACC com definição executável completa (browser, viewports, seletores, tolerâncias, PASS/FAIL/SKIP) |
| §0.A (localização) | RB-14.1 | L-1 | P50-GOV2 | caminho do arquivo | spec em `specs/` com cabeçalho candidato; sem cadeia normativa ativa |
| §25.1 | RB-14.2 | L-2 | autoverificação | grep | prefixo `MAP` banido e ausente |
| UI-010 (removida) | RB-14.3 | L-3 · DL-5 | — (remoção) | grep | nenhum requisito de estimativa de tempo ativo |
| UI-028 | RB-14.4 | L-4 | P50-UX6 | render das tabs | sem tab Framework Mapping; heat map por pergunta |
| — (sem cláusula; corrigido na entrega da auditoria) | RB-14.5 | L-5 | — | registro da auditoria | n/a |
| §5 · §15 · §23 · §33 | RB-15 | consolidação de não-escopo | P50-GOV1 | inventário de escopo da fase | nenhum item de não-escopo implementado |

**Checklist da lista fechada da seção 8 da auditoria (11 itens):** 1→UI-012A/P50-SUF7 ✔ ·
2→P50-SUF0/UI-012B/P50-SUF8 ✔ · 3→§12.2 ✔ · 4→§25.1 ✔ · 5→§0.A/§1 ✔ · 6→§0.A/P50-GOV2 ✔ ·
7→A-1..A-9 conforme tabela acima ✔ · 8→§25.6/§25.7 ✔ · 9→D2/D3 resolvidas ✔ · 10→§15 ✔ ·
11→§19/UI-004 (D1, D5 com custo registrado) ✔.

---

# 37. REGISTRO DE RECUPERAÇÃO DA INSTRUÇÃO DE AUTORIA

A instrução de autoria do proprietário havia chegado truncada no requisito 12. **A instrução completa
foi recuperada e aplicada** por meio da errata obrigatória da auditoria da candidata (2026-08-19):
o requisito 12 exige a tabela de rastreabilidade de **seis colunas** — atendida pela §36 e reproduzida
no artefato de assurance `REV_B_MANDATE_TRACEABILITY.md`; o requisito 13 exige a Definition of Done
completa — atendida pela §31. **Nenhuma ressalva de requisito perdido permanece.**
