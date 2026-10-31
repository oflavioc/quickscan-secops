# Contrato do motor (engine_v32.js) para a apresentação — demanda 026

Lente `core-engineer`, somente leitura. O engine é classe `frozen` (R6): este documento **descreve**, não propõe toque. Toda afirmação cita `engine_v32.js:linha`; o que foi medido por sonda (`node` sobre o módulo CommonJS, `:820`) está marcado **[sonda]**. Sondas em `scratchpad/motor/sonda_engine.js`, `sonda2.js`, `sonda3.js` — nunca escrevem na árvore.

Ponto de partida: `buildRecommendationContext()` (`:551-677`) devolve `{ legacyMode, contexts, architectureNote, licensedContext }`. Cada `contexts[capId]` (`:561-568`) tem `capability, maturity, businessPriority, techState, classification, flags, supportMode, candidates[], services[], notes[], commercialOptions[]`. Recalcula a cada chamada — não há cache no engine (`ui_v32.js:272` e `:1407` dependem disso).

---

## 1. classification × supportMode × o que o motor DIZ sobre aquisição

`classify()` (`:392-418`) combina `maturityStateOf` (`:337-360`: `gap-high` se alguma resposta com sev 2, `gap-moderate` se sev 1, `needs-validation` se alguma `null`/`"NA"`, senão `mature`) com `deriveTechState` (`:363-389`). O `switch` de `buildRecommendationContext` (`:569-632`) fixa `supportMode`, `candidates` e `notes`.

| classification | quando (`classify`) | supportMode | candidates | notes[] (literal PT-BR) | É aquisição? |
|---|---|---|---|---|---|
| `TECHNOLOGY_WHITESPACE` | gap + `presence NONE` + `ENV.assessmentSufficient()` (`:402-403`) | `DIRECT` (`:571`) | `resolveCandidates(capId)` (`:572`) → `offering` / `family` | — | **SIM**, único caso. |
| `TECHNOLOGY_WHITESPACE` suprimida | idem + `suppressedByPlatform().caps.has(capId)` (`:573`) | `CONTEXTUAL` (`:575`) | `[]` (`:574`) | `"capability coberta pela plataforma unificada declarada — foco em operacionalização, não em nova aquisição"` (`:576`) | Não. |
| `TECHNOLOGY_WHITESPACE` rebaixada | whitespace sem `offering`/`family`/`family-of-variants` real, só `contextual-support` (`:646-650`) | `CONTEXTUAL` (`:649`) | só `contextual-support` | — | Não. classification **permanece** WHITESPACE (`:644`). |
| `OPERATIONAL_GAP` | gap + `OPERATIONAL` (`:407`) | `CONTEXTUAL` (`:580`) | `[]`; + `fortixdr` `contextual-extension` se `endpoint-detection` com base `/forti(edr\|endpoint)/` declarada (`:585-588`); + `contextual-support` se não suprimida (`:633-642`) | `"tecnologia operacional — apoio em operacionalização (nunca substituição)"` (`:583`); + `"plataforma unificada declarada cobre esta capability — gap é operacional, explicável (M75)"` se suprimida (`:584`) | Não. |
| `COVERAGE_GAP` | gap + `PARTIAL_OPERATIONAL` (`:406`) | `CONTEXTUAL` | idem OPERATIONAL_GAP | `"tecnologia operacional com cobertura parcial — apoio em expansão de cobertura"` (`:582`) | Não. |
| `ADOPTION_GAP` | gap + `IN_FLIGHT` (`:408`) | `CONTEXTUAL` | idem | `"tecnologia contratada/em implantação — apoio em enablement/integração"` (`:581`) | Não. |
| `EVALUATION_IN_PROGRESS` | gap + `EVALUATING` (`:409`) | `CONTEXTUAL` (`:592`) | `[]` — **não** recebe `contextual-support` (fora da lista `:635`) | `"avaliação em curso — apoio em critérios de avaliação/PoC; sem candidatos de aquisição"` (`:593`) | Não. |
| `TECH_STATUS_UNVERIFIED` | gap + `DECLARED_UNSPECIFIED` (PRESENT sem solutions ou sem status) (`:405`), `flags.statusUnverified` | `VALIDATE` (`:596`) | `[]` | `"tecnologia declarada sem status — validar estágio operacional antes de qualquer leitura de gap tecnológico"` (`:597`) | Não. |
| `NEEDS_VALIDATION` | resposta `null`/`"NA"` **ou** `presence UNKNOWN` (`:398`); **ou** gap + NONE sem suficiência, `flags.insufficientEvidence` (`:404`) | `VALIDATE` (`:600`) | `[]` | nenhuma | Não. |
| `CONTEXT_NOT_INFORMED` | gap + `presence UNSET` (`:401`) — inclui as 3 capabilities `landscapeEnabled:false` (§5) | `LEGACY-LABELLED` (`:602`) | `[]` — e **`suppressedByPlatform` não é consultada neste ramo** (ver §6) | nenhuma | Não diz nada: é o ramo "hipótese da Camada 1". `services[]` **ainda entra** (§2). |
| `UNASSESSED_CAPABILITY` por sinal | `assessmentCoverage:"none"` (`:394`) + offering `primary` com `requiredSignals` ligado + `presence` ∈ NONE/UNSET/PARTIAL (`:604-615`) | `CONTEXTUAL` (`:613`) | `{itemKind:"offering", relation:"contextual-by-signal", signals:[...]}` (`:608-609`) | `"habilitado por sinal explícito — conversa contextual/deep-dive; a recomendação nasce do sinal + contexto, jamais da ausência"` (`:615`) | Não é gap medido; conversa contextual. |
| `UNASSESSED_CAPABILITY` licenciada | idem + `licensedContext[capId]` (bundle/subscription declarada em `PLATFORM_CONTEXT`) (`:621-625`) | `CONTEXTUAL` | `[]` (`:622`) | `"capacidade já licenciada via fg-… — apoio em adoção/configuração/cobertura, nunca recompra (M62)"` (`:624`) | Não (recompra vetada). |
| `UNASSESSED_CAPABILITY` inventário | demais (`:616-619`) | `INVENTORY` | `[]` | `"sinal registrado para aprofundamento: …"` só com `declaredDriver` (`:618`) | Nada. |
| `MATURE_WITH_TECH` | madura + OPERATIONAL/PARTIAL (`:413`) ou DECLARED_UNSPECIFIED com `flags.statusUnverified` (`:414`) | `NONE` (`:628`) | `[]` | nenhuma | Nada. |
| `TECH_TRANSITION` | madura + IN_FLIGHT/EVALUATING (`:415`) | `NONE` (`:629`) | `[]` | `"capability madura com mudança tecnológica em curso — nota informativa"` | Nada. |
| `POSSIBLE_CONTEXT_DIVERGENCE` | madura + NONE (`:416`) | `VALIDATE` (`:630`) | `[]` | `"maturidade declarada alta sem tecnologia — validar divergência"` | Não. |
| `null` | madura + UNSET (`:417`) | `NONE` (`:631`, `default`) | `[]` | nenhuma | Nada. **[sonda]** `incident-management: null / NONE`. |

**Regra única de aquisição**: candidato de aquisição = `supportMode === "DIRECT"` **e** `itemKind ∈ {offering, family}` (hoje; `family-of-variants` é inalcançável, §8). Qualquer outro `candidates[]` é contextual por construção (`:614`, `:588`, `:641`).

### 1.1 `itemKind` possíveis e campos

| itemKind | nasce em | relation | scopeNote | variantResolution | variants | signals |
|---|---|---|---|---|---|---|
| `offering` (DIRECT) | `resolveCandidates` `:454` | `primary` \| `partial` (do catálogo `:445`) | do catálogo (ex.: `"camada endpoint"` `:122`, `"complementa o programa; não representa sozinho todo o ciclo"` `:156`) ou `null` | `"atende"` | — | — |
| `family` | `:462-466`, quando `archSatisfied` = `"unknown"` e nenhum candidato resolvido cobre o grupo | `"primary"` | `null` | `"oferta a definir no aprofundamento"` (endpoint-family) / `"modalidade/variante a definir (contexto arquitetural insuficiente)"` (ndr-family) | ids agrupados, ex. `["fortiendpoint","fortiedr"]` **[sonda]** | — |
| `family-of-variants` | `:462`, grupo que não é `entityType:"family"` | idem | `null` | idem | idem | — (**inalcançável no catálogo atual**, §8) |
| `contextual-extension` | `:587-588` | `"contextual"` | `"extensão de correlação sobre a base EDR instalada — nunca nova aquisição standalone (M50)"` | — | — | — |
| `contextual-support` | `:640-641` (relações com `contextTrigger:true`: `fortisiem→detection-engineering` `:107`, `fortisoar→knowledge-management` `:116`, `fortiai-assist→detection-engineering` `:186`) | `"contextual"` | `"apoio contextual via relação de suporte — não é aquisição direta"` | — | — | — |
| `offering` **por sinal** | `:608-609` | **`"contextual-by-signal"`** | — | — | — | `requiredSignals` ligados |

**Atenção ao nome**: `contextual-by-signal` **não é `itemKind`** — é o valor de `relation`, com `itemKind:"offering"` (`:608`). É por isso que `ui_p52_support_v32.js:301-302` e `ui_curation_v32.js:124-126` filtram `itemKind==="offering" && signals.length`. O valor não está em `ENUMS.relation` (`:25`); `validateConfigV32` valida o catálogo, não a saída.

`commercialOptions` (`withCommercial`, `:667-671`): anexado ao candidato só quando `OFFERINGS[itemId].commercialOptions` tem opção com `eligibility !== "not-applicable"`. **[sonda]** só `fortigate` tem (`:192`) e ele é `contextAnchor` (nunca candidato, `:443`) → **nenhum candidato carrega `commercialOptions`**; todo serviço carrega `fortipoints` (default `S()` `:198-199`) → 5/5 nos serviços medidos. Não é qualificador de elegibilidade; é camada terminal.

---

## 2. `services[]` — forma, gatilho e veto

Laço `:653-665`, para cada `SERVICES[sid]` com relação à capability:

```
{ serviceId, lifecycle, triggeredBy: [...sinais ligados] | ["capability-gap"], note: serviceEligibility(sid).reason, commercialOptions:[fortipoints] }
```

Gatilhos (`:660-663`):
- `requiredSignals` não vazio → entra **sempre que elegível**, `triggeredBy` = sinais ligados — **independe de gap e de supportMode** (**[sonda]** `dfir` entra em `incident-management` madura, `classification null`).
- senão, `hasGap` (`gap-high`/`gap-moderate`) **e** (`relation==="primary"` **ou** `gapTrigger===true`) → `triggeredBy:["capability-gap"]`. `supporting` sem `gapTrigger` **nunca dispara por gap**.
- **Entra mesmo com `supportMode` `LEGACY-LABELLED`** (**[sonda]** C7: `soc-staffing CONTEXT_NOT_INFORMED` com `fortiguard-socaas<capability-gap>`).

| serviço | capability → gatilho por gap | por sinal |
|---|---|---|
| `fortiguard-socaas` (`:201-204`) | `continuous-monitoring` primary; `soc-staffing` gapTrigger | — |
| `fortiguard-mdr` (`:205-210`) | `endpoint-detection` primary; `continuous-monitoring`, `soc-staffing` gapTrigger | — ; **veto** por `eligibilityRequires` |
| `ir-readiness-subscription` | `incident-management` primary (`soc-governance` supporting **não dispara**) | — |
| `ir-plan-development`, `ir-playbook-development`, `ttx` | `incident-management` primary (`knowledge-management`/`soc-skills` supporting não disparam) | — |
| `ir-training` | `soc-skills` primary | — |
| `vulnerability-assessment` | `vulnerability-management` primary | — |
| `penetration-testing`, `red-team-assessment` | só supporting → **nunca por gap** | — |
| `dfir` / `compromise-assessment` / `ransomware-readiness-assessment` / `soc-assessment` / `soc-development-service` / `ad-security-assessment` | — | `activeIncident` / `suspectedCompromise` / `ransomwareConcern` / `wantsSOCAssessment` / `wantsSOCDevelopment` / `identityRiskConcern` |

Consequência medida **[sonda3]**: gap em `soc-governance` (mandate/governance/policies) ou `knowledge-management` → `services:[]` — o engine **não** tem par para o `FortiGuard-Service-Bundle` que o MAP oferece ali (`v3_1_3.html:422-427`, `:432`).

`serviceEligibility(svcId)` (`:472-491`) veta, nesta ordem:
1. `"serviço inexistente"` (`:474`);
2. `"sinal requerido ausente: a|b"` (`:475-476`);
3. `eligibilityRequires` (só `fortiguard-mdr`, `:209`): varre **todas** as `TECH_LANDSCAPE[*].solutions` e considera base o `product` cujo nome normalizado (minúsculas, sem espaço) contém `fortiedr`/`fortixdr`/`fortiendpoint` (`:480-483`) → `"base requerida ausente (fortiedr/fortixdr/fortiendpoint)"` (`:484`); se **toda** base está em `on-prem`/`air-gapped` → `"base declarada apenas em deployments não elegíveis (on-prem/air-gapped) — OG oficial"` (`:485-486`); alguma base sem `deployment` → elegível com `"elegível — validar deployment da base"` (`:487-488`); senão `"base compatível"`.
4. demais: `"sem restrições"` (`:490`).

**[sonda]** FortiEDR `on-prem` → inelegível (C7); mesma base sem `deployment` → elegível com "validar deployment" (qualificador a preservar); base `cloud` → "base compatível"; EDR de terceiro → "base requerida ausente" (C2: MDR não aparece).

---

## 3. O que é PÚBLICO em `V32` (`:816-821`)

`Object.assign(V32, { ENUMS, CAPABILITIES, SOLUTION_AREAS, OFFERINGS, SERVICES, SERVICE_FAMILIES, SECURITY_SUBSCRIPTIONS, BUNDLES, COMMERCIAL_PROGRAMS, TECH_LANDSCAPE, ARCHITECTURE_CONTEXT, PLATFORM_CONTEXT, SESSION_SIGNALS, SIGNAL_IDS, resetLandscapeToUnset, isLegacyModeV32, deriveLicensedContext, configure, maturityStateOf, deriveTechState, classify, archSatisfied, resolveCandidates, serviceEligibility, suppressedByPlatform, architectureNote, buildRecommendationContext, validateConfigV32 })` — `root.V32` (`:821`) e `module.exports` (`:822`). **[sonda]** `typeof V32.suppressedByPlatform === "function"`, idem `serviceEligibility`, `architectureNote`, `isLegacyModeV32`, `classify`, `resolveCandidates`, `archSatisfied`.

Útil à apresentação, sem tocar o engine:
- `suppressedByPlatform()` → `{ caps:Set<capId>, plat:{offeringId:"fortisoc"|null, solution} }` (`:500-521`). FortiSOC: caps = relações `embedded|primary` de `OFFERINGS.fortisoc` (`:512-514`) = `soc-platform, security-analytics, security-automation, incident-management, threat-intelligence, soc-ai-assistance` **[sonda]**. Terceiro: só `solutions[].coveredCapabilities` (`:517`).
- `serviceEligibility(id)` → `{eligible, reason}` com a razão literal do veto (hoje o engine **descarta** o serviço vetado em `:659`; a razão só é recuperável chamando a função).
- `archSatisfied(OFFERINGS[id].architectureRequires)` → `"ok"|"violated"|"unknown"` (`:421-435`): única forma de saber **por que** uma oferta não é candidata (o engine descarta `violated` em silêncio, `:448`).
- `architectureNote(contexts)` (`:522-548`) → `{show, optionA, optionB|null, basis:{coreGaps, fragmentation, socPlatformNone}}`; `optionB` é o **único** caminho em que `fortisoc` (policy `architecture-only`, `:94`) aparece.
- `isLegacyModeV32()` (`:305-311`).
- `OFFERINGS[id]`: `name, entityType, deliveryType, family, variantOf, architectureRole, deployment[], architectureRequires, recommendationPolicy, requiredSignals, url` (`:79-83`). `url` falta em `fortisiem-cloud`, `fortindr-cloud`, `fortindr-onprem`, `fortideceptor`, `fortisandbox`, `fortidlp`, `fortiauthenticator`, `fortipam`, `fortiai-assist`, `fortimail`, `fortimail-cloud-saas` (vazio por default `:83`). Não há descrição comercial — isso só existe em `PRODUCTS[*].d` da Camada 1.
- `CAPABILITIES[id]`: `name, scope, assessmentCoverage, questionIds, landscapeEnabled, modes` (`:40-41`).
- `maturity` do contexto: `state, hasUnknowns, stateSourceFindingIds, allFindingIds, sourceQuestionIds, evidenceSources[{questionId, answer}]` (`:353-359`) — é a **origem "resposta/gap"** que a auditoria pede.
- `businessPriority.flag` + `priorityQuestionIds` (`:564`) — prioridade do negócio por capability (não vira produto: `design-decisions.md`, card de prioridade).

Não exportado: `declaredUnifiedPlatform` (`:494`), `signalOn` (`:312`), `ENV` (`:330`).

---

## 4. Tabela de IDENTIDADE — Camada 1 `PRODUCTS` (13, `v3_1_3.html:262-275`) × motor

| chave `PRODUCTS` | `n` exibido | id(s) do motor | como se liga | pode ser candidato? |
|---|---|---|---|---|
| `FortiAnalyzer` | FortiAnalyzer | `OFFERINGS.fortianalyzer` (`:99`) | nome exato | DIRECT em `security-analytics` (sem `architectureRequires`) |
| `FortiSIEM` | FortiSIEM | `fortisiem` (`:104`) + `fortisiem-cloud` (`:110`, `variantOf:"fortisiem"`, name "FortiSIEM Cloud") | exato + variante | DIRECT; a variante cloud só com `saasAllowed:"yes"` **[sonda]** |
| `FortiSOAR` | FortiSOAR | `fortisoar` (`:113`) | exato | DIRECT em `security-automation`, `incident-management`; `contextual-support` em `knowledge-management` |
| `FortiEndpoint` | FortiEndpoint | `fortiendpoint` (`:120`); placeholder `endpoint-family` (`:87`, name **"Fortinet Endpoint Security"**, variants `[fortiendpoint, fortiedr]`) | exato; a família **não é** FortiEndpoint | DIRECT só com `saasAllowed:"yes"`; `saasAllowed:"no"`/`localProcessingRequired:"yes"`/`edrSpecificNeed` → `fortiedr` (`:126`) — C1 |
| `FortiNDR` | FortiNDR | `ndr-family` (`:89`, name **"FortiNDR"** — idêntico à chave), `fortindr-cloud` (`:138`, "FortiNDR Cloud"), `fortindr-onprem` (`:141`, "FortiNDR (On-Premises)"), ambos `variantOf:"ndr-family"` | família + 2 variantes | DIRECT por variante; família como placeholder se arquitetura desconhecida — C6: dedup por nome colapsa a variante na família |
| `FortiRecon` | FortiRecon | `fortirecon` (`:154`) | exato | DIRECT `external-exposure` (primary), `vulnerability-management` (partial, scopeNote `:156`) |
| `SOCaaS` | FortiGuard SOCaaS | `SERVICES["fortiguard-socaas"]` (`:201`, name = `n`) | pelo `name`, não pela chave | serviço, nunca `candidates[]` |
| `FortiGuard-MDR-Service` | FortiGuard MDR | `SERVICES["fortiguard-mdr"]` (`:205`, name = `n`) | pelo `name` | serviço; veto §2 |
| `FortiAI-Assist` | FortiAI-Assist | `OFFERINGS["fortiai-assist"]` (`:184`, `component`, policy `landscape-only`); também `SOLUTION_AREAS["fortiai-assist"]` (`:73`) | exato | só `contextual-support` em `detection-engineering`; a relação `soc-staffing supporting` (`:187`) **não tem `contextTrigger`** → o MAP `team-capacity` lv1 (`v3_1_3.html:430`) oferece FortiAI-Assist sem par no motor |
| `FortiGuard-Service-Bundle` | Serviços FortiGuard | `SERVICE_FAMILIES["fortiguard-labs-advisory"]` (`:243-248`, 14 membros) — **ou nenhum** | nenhum `name` bate; o motor emite **serviços individuais** (`ir-training`, `ttx`, …) | guarda-chuva; o motor não tem id único |
| `FortiXDR` | FortiXDR | `fortixdr` (`:133`, `variant` de `fortiedr`, policy `contextual-only`) | exato | só `contextual-extension` em `endpoint-detection` com base Forti; o MAP `automation` lv1 (`v3_1_3.html:441`) oferece FortiXDR — **relação inexistente no motor** |
| `FortiDeceptor` | FortiDeceptor | `fortideceptor` (`:159`, `landscape-only`, sem `requiredSignals`) | exato | **nunca** (nem por sinal: `:607` exige `requiredSignals.length`) — coerente com o comentário da Camada 1 `:259-260` |
| `FortiDLP` | FortiDLP | `fortidlp` (`:164-169`) | exato | `contextual-by-signal` em `data-loss-prevention` e `insider-risk` (C9) |

Ids do motor **sem par** em `PRODUCTS` e se chegam a `candidates[]`:

| id | pode aparecer? | como |
|---|---|---|
| `fortiedr` | **sim** | DIRECT `endpoint-detection` quando `anyOf` `:126` satisfeito (C1) |
| `fortindr-onprem` | **sim** | DIRECT `network-detection` (C6); par parcial via família "FortiNDR" |
| `fortisiem-cloud` | **sim** | DIRECT `security-analytics` com `saasAllowed:"yes"` (C10); par parcial via `variantOf` |
| `fortimail`, `fortimail-wss`, `fortimail-cloud-saas` | **sim, os três de uma vez** | `contextual-by-signal` em `email-threat-protection` (`becConcern`/`emailSecurityConcern`, `:147,:149,:152`) — `ofertados()` descarta ("fora do catalogo curavel", `ui_curation_v32.js:137`) |
| `fortiaigate` | sim | by-signal `ai-runtime-security` (`:174`) |
| `fortipam`, `fortiauthenticator` | sim | by-signal `pamRequirement` / `identityRiskConcern` (`:180,:183`) |
| `fortisoc` | **nunca em `candidates`** | só `architectureNote.optionB` (`:546`) |
| `fortisat`, `fortisandbox`, `forticlient`, `fortigate`, famílias `fortimail-family`, `soc-platform-family`, `identity-family` | nunca | policy `landscape-only`/`never-direct` sem sinal; `fortigate` é `contextAnchor` (`:191`) |
| 14 membros de `SERVICE_FAMILIES` | sim, em `services[]` | §2 |

Observação de identidade: a apresentação hoje deduplica por **nome exibido** (`ui_p52_support_v32.js:321-327`, comentário "A CHAVE E O NOME EXIBIDO") — é a raiz de C6 ("FortiNDR" família = "FortiNDR" chave) e do colapso FortiEDR→FortiEndpoint em C1. A identidade estável que o motor oferece é `itemId` + `OFFERINGS[itemId].variantOf/family`.

---

## 5. Pergunta (MAP) → capability

`CAPABILITIES[*].questionIds` (`:43-67`); as 15 chaves do `MAP` (`v3_1_3.html:421-467`) são exatamente os `questionIds` (`validateConfigV32` proíbe pergunta em duas capabilities, `:697`, e coverage `none` com pergunta, `:696`):

| pergunta (MAP) | capability | `landscapeEnabled` |
|---|---|---|
| `mandate`, `governance`, `policies` | `soc-governance` (`:43`) | **false** |
| `team-capacity` | `soc-staffing` (`:44`) | **false** |
| `training` | `soc-skills` (`:45`) | **false** |
| `knowledge` | `knowledge-management` (`:46`) | true |
| `incident-response` | `incident-management` (`:47`) | true |
| `detection-lifecycle` | `detection-engineering` (`:48`) | true |
| `logs` | `security-analytics` (`:49`) | true |
| `automation` | `security-automation` (`:50`) | true |
| `monitoring-coverage` | `continuous-monitoring` (`:51`) | true |
| `endpoint` | `endpoint-detection` (`:55`) | true |
| `network-visibility` | `network-detection` (`:56`) | true |
| `external-surface` | `external-exposure` (`:57`) | true |
| `vulnerability-management` | `vulnerability-management` (`:58`) | true |

**Armadilha estrutural**: as 3 capabilities `landscapeEnabled:false` não têm entrada em `TECH_LANDSCAPE` (`:285-286`) → `deriveTechState(undefined)` = `UNSET` (`:364`) → gap ali é **sempre** `CONTEXT_NOT_INFORMED`/`LEGACY-LABELLED`, por desenho ("[3.2.1-4] matriz aprovada: landscape N/A", `:43`), mesmo com contexto completo. Só `services[]` fala por elas (`socaas`/`mdr` em staffing, `ir-training` em skills; **nada** em governance). **[sonda3]**.

Capabilities **sem pergunta** (`assessmentCoverage:"none"`, 12): `soc-platform`, `threat-intelligence`, `soc-ai-assistance`, `deception`, `malware-analysis`, `email-threat-protection`, `insider-risk`, `data-loss-prevention`, `identity-access`, `privileged-access`, `human-risk`, `ai-runtime-security` (`:52-54`, `:59-67`). Para elas `maturity.state === "not-assessed"` (`:340`), classification `UNASSESSED_CAPABILITY`, e só sinal/driver/licença produzem algo (§1).

---

## 6. O caso C3 — por que `security-automation` sai `CONTEXT_NOT_INFORMED` e não "suprimida"

Cenário (`cen/C3.json`): `automation=0`, `soc-platform PRESENT` com `FortiSOC production saas`, `saasAllowed:"yes"`; `security-automation` **não declarada** (UNSET).

Cadeia:
1. `suppressedByPlatform()` lê **só** `TECH_LANDSCAPE["soc-platform"]` (`:505`) → `caps` contém `security-automation` (`:512-514`). **[sonda]** confirmado.
2. `classify("security-automation")` lê `TECH_LANDSCAPE["security-automation"]` (`:397`) → `UNSET` → `CONTEXT_NOT_INFORMED` (`:401`). A supressão **não participa** de `classify`.
3. No `switch`, `sup.caps` só é consultada em `TECHNOLOGY_WHITESPACE` (`:573`), como nota em OPERATIONAL/COVERAGE/ADOPTION (`:584`) e como barreira ao `contextual-support` (`:636`). O ramo `CONTEXT_NOT_INFORMED` (`:601-602`) é cego a ela.

Contraprova **[sonda]**: mesmo cenário com `security-automation` `NONE` → `TECHNOLOGY_WHITESPACE`/`CONTEXTUAL`, `candidates:[]`, nota "coberta pela plataforma unificada declarada"; com `FortiSOAR production` → `OPERATIONAL_GAP` + nota M75. Ou seja: o engine **sabe** que FortiSOC cobre a capability, mas só o diz quando a capability em si foi declarada.

Como a apresentação sabe sem tocar o engine: `V32.suppressedByPlatform()` é pública (`:816`, verificado §3). Regra de derivação proposta para a apresentação (dado do engine, decisão declarada na spec da 026):

```
sup = V32.suppressedByPlatform();
se ctx.classification === "CONTEXT_NOT_INFORMED" && sup.caps.has(capId)
   → ação "operacionalizar/expandir a plataforma declarada" (sup.plat.offeringId || sup.plat.solution.product),
     sem candidato de aquisição; produto do MAP para essa pergunta NÃO vira "indicação prioritária".
```

Isso é a mesma leitura que o engine faria no ramo NONE (`:576`), aplicada pela apresentação ao ramo UNSET. Não é toque no engine. Registrar no backlog como lacuna do engine (candidata a Porta B futura, **não** agora): "`sup.caps` não consultada em `CONTEXT_NOT_INFORMED`". Alternativa sem código: o facilitador declarar `security-automation` como `PRESENT`/`FortiSOC` no editor — o engine responde `OPERATIONAL_GAP` + M75.

---

## 7. O que o engine NÃO fornece e o plano da auditoria pede — derivação proposta

Pedido (`Plano §2 "Contrato desejado"`, `Auditoria QS-01`): identidade estável, origem, **tipo de ação** (validar / operacionalizar / expandir / avaliar aquisição / serviço), elegibilidade e razão de supressão, modalidade/pré-requisitos, relação, qualificador comercial, limitação de escopo, proveniência da curadoria.

| campo pedido | fornece? | de onde |
|---|---|---|
| identidade estável | sim | `candidates[].itemId` + `OFFERINGS[id].variantOf/family`; `services[].serviceId`; `capability` |
| origem resposta/gap | sim | `maturity.stateSourceFindingIds`, `evidenceSources` (`:355-358`) |
| origem sinal | sim | `candidates[].signals`, `services[].triggeredBy` |
| origem humana | **não** (dono: `ui_curation_v32.js`) | — |
| **tipo de ação** | **não** — derivável (tabela abaixo) | `classification + supportMode + itemKind + notes` |
| elegibilidade do serviço | sim, em `note` (razão literal) | `services[].note`; vetado some — recuperar com `V32.serviceEligibility(id)` |
| razão de supressão de produto | **parcial** | capability suprimida: `V32.suppressedByPlatform()`; oferta vetada por arquitetura: **some em silêncio** (`:448`) — recomputar com `V32.archSatisfied(OFFERINGS[id].architectureRequires)` |
| modalidade / pré-requisitos | sim | `OFFERINGS[id].deployment`, `architectureRequires`; `variantResolution`, `variants` |
| relação | sim | `candidates[].relation` (`primary/partial/contextual/contextual-by-signal`) |
| limitação de escopo | sim | `candidates[].scopeNote` (perdida no papel — QS-02) |
| qualificador comercial ("prioritária"/"após validação") | **não** — derivável | `maturity.state` (`gap-high` ⇔ sev 2 da Camada 1, `:346`) + `supportMode` |
| descrição/URL comercial | parcial | `OFFERINGS[id].url` (lacunas §3); descrição só em `PRODUCTS[*].d` |
| "por quê" por nível (`MAP.lv[].c[].w`) | não | só Camada 1 |

Tabela de derivação da **ação** (proposta; toda linha é função pura do contexto):

| classification | supportMode | candidates | ação | qualificador |
|---|---|---|---|---|
| `TECHNOLOGY_WHITESPACE` | `DIRECT` | `offering` | **avaliar aquisição** | `maturity.state==="gap-high"` → "indicação prioritária"; `gap-moderate` → "após validação"; `relation:"partial"` → sempre com `scopeNote` visível |
| `TECHNOLOGY_WHITESPACE` | `DIRECT` | `family` | avaliar aquisição, **modalidade a definir** | "após validação" (usar `variantResolution` e listar `variants`) |
| `TECHNOLOGY_WHITESPACE` | `CONTEXTUAL` | `[]` + nota "coberta pela plataforma" | **operacionalizar/expandir** a plataforma declarada | sem produto |
| `TECHNOLOGY_WHITESPACE` | `CONTEXTUAL` | só `contextual-support` | apoio contextual (não aquisição) | "após validação", nunca prioritária |
| `OPERATIONAL_GAP` | `CONTEXTUAL` | `[]` / `contextual-extension` / `contextual-support` | **operacionalizar** o existente; `fortixdr` = estender base instalada | "após validação"; nunca "nova aquisição" |
| `COVERAGE_GAP` | `CONTEXTUAL` | idem | **expandir cobertura** | idem |
| `ADOPTION_GAP` | `CONTEXTUAL` | idem | operacionalizar (enablement/integração) | idem |
| `EVALUATION_IN_PROGRESS` | `CONTEXTUAL` | `[]` | **avaliar** (critérios/PoC) | sem produto |
| `TECH_STATUS_UNVERIFIED` | `VALIDATE` | `[]` | **validar** estágio operacional | sem produto |
| `NEEDS_VALIDATION` | `VALIDATE` | `[]` | **validar** resposta/evidência (`flags.insufficientEvidence` distingue suficiência) | sem produto |
| `POSSIBLE_CONTEXT_DIVERGENCE` | `VALIDATE` | `[]` | validar divergência | sem produto |
| `CONTEXT_NOT_INFORMED` | `LEGACY-LABELLED` | `[]` | **hipótese condicionada** (MAP da Camada 1) — exceto §6 (suprimida → operacionalizar) | sempre "após validação" (contexto ausente não autoriza prioritária — ver C5/C8 em §8) |
| `UNASSESSED_CAPABILITY` | `CONTEXTUAL` | `relation:"contextual-by-signal"` | conversa contextual por sinal | "após validação", origem "sinal", nunca gap medido |
| `UNASSESSED_CAPABILITY` | `CONTEXTUAL` + nota M62 | `[]` | adoção/configuração do já licenciado | sem produto |
| `UNASSESSED_CAPABILITY` | `INVENTORY` | `[]` | nada | — |
| `MATURE_WITH_TECH`/`TECH_TRANSITION`/`null` | `NONE` | `[]` | nada (TRANSITION: nota informativa) | — |
| qualquer | qualquer | `services[]` | **serviço**: `triggeredBy ["capability-gap"]` → por gap; sinais → por sinal | `note === "elegível — validar deployment da base"` → "após validação"; `"base compatível"`/`"sem restrições"` → por `maturity.state` |

Decisão que a derivação **não** pode tomar sozinha e fica para a spec: o rótulo de prioridade quando a Camada 1 (sev 2) e o engine (`CONTEXTUAL`) discordam — pelo contrato acima, o engine vence (R1 INV-3: a UI nunca é dona da decisão).

---

## 8. Armadilhas

1. **`legacyMode` devolve `contexts:{}`** (`:552`). `isLegacyModeV32` (`:305-311`) exige landscape todo UNSET **e** arquitetura default **e** sinais todos `"unset"` **e** `declaredPlatforms` vazio. Um único campo (`saasAllowed:"yes"`, um sinal mesmo `false`) sai do legado para **todas** as capabilities. C5/C8 (sem contexto) → o engine não diz nada; a tela é 100% Camada 1 — ali "indicação prioritária" é derivada de `sev 2` sem nenhuma voz do engine.
2. **`archSatisfied === "unknown"` vira placeholder `family`, não `family-of-variants`** (`:462`): os dois grupos agrupáveis (`endpoint-family`, `ndr-family`) são `entityType:"family"`. **[sonda]** arquitetura desconhecida → `endpoint-family/family` (variants `fortiendpoint, fortiedr`), `ndr-family/family`; `fortisiem-cloud` agrupa em `fortisiem` (`:450`), que não tem `architectureRequires` e sempre cobre (`:457-459`) → `family-of-variants` é **inalcançável** com o catálogo atual. O placeholder tem `name` "Fortinet Endpoint Security"/"FortiNDR" — não é FortiEndpoint nem variante.
3. **`violated` some sem rastro** (`:448`): em C1 `fortiendpoint` é descartado e só `fortiedr` sai; o contexto não diz "FortiEndpoint vetado por `saasAllowed:"no"`". A apresentação que quiser explicar recomputa com `V32.archSatisfied`.
4. **`withCommercial`** (`:667-671`): candidatos nunca ganham `commercialOptions` (só `fortigate` tem, e é âncora); serviços sempre carregam `fortipoints`. Presença do campo não é qualificador.
5. **`services[]` ignora `supportMode`**: sai em `LEGACY-LABELLED` (C7, `soc-staffing`) e por sinal em capability madura (`dfir`). Não inferir "o engine recomendou aquisição" de `services.length`.
6. **`contextual-by-signal` é `relation`, `itemKind` é `offering`** (`:608`). Filtro por `itemKind==="offering"` sem olhar `relation` mistura DIRECT com sinal — hoje a apresentação olha `signals.length`, o que funciona mas é indireto.
7. **`classification` pode ser `null`** (`:417`, madura + UNSET) com `supportMode "NONE"`.
8. **`fortisoc` nunca é candidato**: policy `architecture-only` (`:94`; validador proíbe DIRECT para `unified-platform`, `:708-709`). Só `architectureNote.optionB`, e só com `saasAllowed !== "no"` e `localProcessingRequired !== "yes"` (`:543-546`); `show` exige ≥2 gaps core (sem `continuous-monitoring`) + (fragmentação ≥2 vendors nas 4 core **ou** `soc-platform NONE`) + `unifiedPlatformPreference !== "no"` + algum landscape relevante informado (`:531-541`). **[sonda]** fragmentada + `saasAllowed:"no"` → `optionB:null`.
9. **Base para MDR é por substring de produto em qualquer landscape** (`:480-483`): "FortiEDR" declarado em `network-detection` conta; EDR de terceiro nunca conta (C2 sem MDR); `deployment` ausente → elegível com qualificador "validar deployment".
10. **E-mail por sinal gera 3 candidatos** (`fortimail`, `fortimail-wss`, `fortimail-cloud-saas`), nenhum em `PRODUCTS` → `ofertados()` descarta (`ui_curation_v32.js:137`) e a visão por produto também (`ui_p52_support_v32.js:305-311` resolve nome pelo `OFFERINGS`, mas o card só nasce se a curadoria publicar).
11. **Supporting sem `gapTrigger`/`contextTrigger` é inerte**: `fortiai-assist→soc-staffing` (`:187`), `ir-readiness-subscription→soc-governance` (`:212`), `ttx→soc-skills` (`:218`), `ir-playbook-development→knowledge-management` (`:216`). O MAP oferece produto nesses pontos; o engine não.
12. **`TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT`/`SESSION_SIGNALS` são objetos vivos exportados** (`:817`): quem escreve neles muda o resultado da próxima `buildRecommendationContext()`. A sonda do orquestrador escreve direto (`probe026.js:33-39`), como o editor de contexto faz — o dono do estado é o engine, mas a escrita é externa (R9 §5 já convive com isso; não é achado novo).
13. **`segmented`** (`:372-375`): ≥2 solutions com `coverage` distintas e sem `broad-production` → `PARTIAL_OPERATIONAL` mesmo com `presence PRESENT` → `COVERAGE_GAP`, não `OPERATIONAL_GAP`.
14. **`NEEDS_VALIDATION` tem duas origens** (resposta `null`/`"NA"` ou `UNKNOWN`, `:398`; gap+NONE sem suficiência, `:404`) — só `flags.insufficientEvidence` as separa; `notes` fica vazia nas duas.

---

## Anexo — resultados brutos das sondas (recorte)

```
C3  sup.caps = soc-platform,security-analytics,security-automation,incident-management,threat-intelligence,soc-ai-assistance ; plat=fortisoc
C3  security-automation: CONTEXT_NOT_INFORMED / LEGACY-LABELLED / cand=[] / notes=[]
C3b (automation NONE):   TECHNOLOGY_WHITESPACE / CONTEXTUAL / cand=[] / "capability coberta pela plataforma unificada declarada…"
C3c (FortiSOAR prod):    OPERATIONAL_GAP / CONTEXTUAL / cand=[] / "…(M75)"
arch unknown: endpoint-family/family [fortiendpoint,fortiedr] ; ndr-family/family [fortindr-cloud,fortindr-onprem] ; analytics: fortianalyzer, fortisiem (offering)
saas=yes: fortiendpoint ; fortindr-cloud ; fortianalyzer,fortisiem,fortisiem-cloud     saas=no: fortiedr ; fortindr-onprem ; fortianalyzer,fortisiem
MDR: on-prem → inelegível (OG oficial) ; sem deployment → "elegível — validar deployment da base" ; cloud → "base compatível" ; sem base → "base requerida ausente"
C7: continuous-monitoring CONTEXT_NOT_INFORMED + socaas<capability-gap> ; endpoint-detection OPERATIONAL_GAP + fortixdr/contextual-extension ; MDR ausente
withCommercial: candidatos 0/0 ; serviços 5/5
soc-governance gap: svc=[] ; knowledge-management gap (UNSET): svc=[]
```
