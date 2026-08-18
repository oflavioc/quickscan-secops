# Session Schema · Quickscan SecOps V3.2 (schemaVersion 1)

## 1 · Objetivo
Arquivar e transportar uma sessão **concluída** do Quickscan preservando **evidência de entrada**, nunca resultados
calculados. Ao importar, o Quickscan valida os inputs e **recalcula integralmente** todos os derivados com o engine
compatível.

## 2 · schemaVersion
Atual: **1**. Não há migrations nesta versão; outro valor é recusado explicitamente.

## 3 · Exemplo (sanitizado)
O bloco abaixo é **exatamente** o arquivo publicado `synthetic_session_examples/exemplo-minimo.json`: o arquivo é
a fonte canônica única e este bloco é derivado dele, com igualdade profunda exigida pelo gate **S110**.

**Proveniência (mecanismo real):** o exemplo foi **exportado pelo runtime** (`buildSessionDocument()`), é
**revalidado pelo próprio import** a cada execução (**S79**) e tem versão/engine SHA conferidos contra o build
(**S109**). Ele **não** é gerado por `build_v32_html.py` — o builder monta apenas o HTML e não emite estes
arquivos; a redação anterior ("gerado pelo próprio build") era incorreta e foi corrigida na 4.8.0.7.

O documento é completo: inclui todos os campos de `architectureContext`, `declaredDriver` em cada capability e os
15 IDs canônicos.

```json
{
  "format": "quickscan-secops-session",
  "schemaVersion": 1,
  "toolVersion": "3.4.0-dev.4.8.0.7",
  "engineSha256": "9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a",
  "createdAt": "2026-08-17T12:00:00.000Z",
  "label": "exemplo-minimo",
  "inputs": {
    "assessment": {
      "archetype": 0,
      "answers": {
        "mandate": 1,
        "governance": 1,
        "policies": 1,
        "team-capacity": 1,
        "training": 1,
        "knowledge": 1,
        "incident-response": 1,
        "detection-lifecycle": 1,
        "automation": 1,
        "logs": 1,
        "endpoint": 1,
        "network-visibility": 1,
        "monitoring-coverage": 1,
        "external-surface": 1,
        "vulnerability-management": 1
      },
      "notes": {}
    },
    "priorities": [
      "logs"
    ],
    "technologyLandscape": {
      "capabilities": {
        "knowledge-management": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "incident-management": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "detection-engineering": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "security-analytics": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "security-automation": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "continuous-monitoring": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "soc-platform": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "threat-intelligence": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "soc-ai-assistance": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "endpoint-detection": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "network-detection": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "external-exposure": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "vulnerability-management": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "deception": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "malware-analysis": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "email-threat-protection": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "insider-risk": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "data-loss-prevention": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "identity-access": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "privileged-access": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "human-risk": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        },
        "ai-runtime-security": {
          "presence": "UNSET",
          "solutions": [],
          "declaredDriver": null
        }
      },
      "architectureContext": {
        "saasAllowed": "unknown",
        "localProcessingRequired": "unknown",
        "otIsolated": "unknown",
        "unifiedPlatformPreference": "undefined",
        "environmentProfile": "uninformed",
        "dataResidency": "uninformed"
      },
      "declaredPlatforms": [],
      "signals": {
        "activeIncident": "unset",
        "suspectedCompromise": "unset",
        "ransomwareConcern": "unset",
        "wantsIRReadiness": "unset",
        "wantsSOCAssessment": "unset",
        "wantsSOCDevelopment": "unset",
        "becConcern": "unset",
        "emailSecurityConcern": "unset",
        "dataLeakageConcern": "unset",
        "insiderRiskConcern": "unset",
        "complianceDataProtection": "unset",
        "shadowAIConcern": "unset",
        "aiUsageRisk": "unset",
        "organizationBuildsAIApps": "unset",
        "usesPrivateLLMs": "unset",
        "usesAgenticAI": "unset",
        "aiRuntimeSecurityConcern": "unset",
        "promptInjectionConcern": "unset",
        "llmDataLeakageConcern": "unset",
        "identityRiskConcern": "unset",
        "pamRequirement": "unset",
        "edrSpecificNeed": "unset"
      }
    },
    "targetProfile": {
      "overrides": {}
    },
    "operationalRefinement": {
      "answers": {
        "ref-metrics": null,
        "ref-lessons": null,
        "ref-hunting": null
      }
    }
  }
}
```

Um segundo exemplo, com landscape rico (NONE/PARTIAL, soluções third-party e Fortinet, FortiSOC com `notes`,
arquitetura não-default, target e refinement), está em `synthetic_session_examples/exemplo-completo.json`.

## 4 · Campos
**Obrigatórios:** `format`, `schemaVersion`, `toolVersion`, `engineSha256`, `inputs` (com os cinco blocos).
**Opcionais:** `createdAt`, `label`. Chaves desconhecidas em raiz ou em `inputs` são **recusadas** na v1.

## 5 · Canonical × derived — owners de estado

| canonical owner | runtime source | session JSON path | derived? |
|---|---|---|---|
| ponto de partida | `arq` | inputs.assessment.archetype | não |
| respostas das 15 práticas | `ans[]` (0–3 · "NA" · null) | inputs.assessment.answers.{id} | não |
| observações | `notes[]` | inputs.assessment.notes.{id} | não |
| prioridades declaradas | `businessPriority` (ordem preservada) | inputs.priorities | não |
| capabilities do landscape | `V32.TECH_LANDSCAPE` | inputs.technologyLandscape.capabilities | não |
| contexto de arquitetura | `V32.ARCHITECTURE_CONTEXT` | …architectureContext | não |
| plataformas declaradas | `V32.PLATFORM_CONTEXT.declaredPlatforms` | …declaredPlatforms | não |
| sinais de sessão | `V32.SESSION_SIGNALS` | …signals | não |
| cenário-alvo (sparse) | `TARGET_PROFILE.overrides` | inputs.targetProfile.overrides | não |
| aprofundamento | `OPERATIONAL_REFINEMENT.answers` | inputs.operationalRefinement.answers | não |
| score/domínios/estágio/suficiência | `domStat`/`stageOf`/`dataSufficiency` | **ausente** | **sim** |
| findings, gaps, severidade | `computeFindings` | **ausente** | **sim** |
| classification, supportMode, offerings, services | `buildRecommendationContext` | **ausente** | **sim** |
| Current×Target, Journey, Narrative, temas | camadas 4.3.1/4.5 | **ausente** | **sim** |

Campos derivados em qualquer posição fazem a importação **falhar explicitamente** — um arquivo adulterado nunca
injeta score ou recomendação.

## 6 · Compatibilidade
`format` diferente → recusa · `schemaVersion ≠ 1` → recusa · **engine igual** → compatível ·
**toolVersion diferente com engine igual** → importa com aviso informativo · **engine diferente** → **bloqueado**,
sem opção de forçar.

## 7 · Semântica do engine SHA
`engineSha256` é gerado no build a partir dos bytes reais de `engine_v32.js`; `toolVersion` vem de
`package.json`. Nenhum dos dois é digitado manualmente na UI. Engine diferente significa outra matemática de
maturidade: reinterpretar uma sessão histórica com ela destruiria a fidelidade do arquivo.

## 8 · Privacidade
O JSON pode conter tecnologias, fornecedores, observações e contexto do ambiente do cliente, além do `label`.
Nada é transmitido: export é `Blob` local, import lê apenas o arquivo escolhido. Armazene conforme a política
aplicável.

## 8.1 · Contratos aninhados (fonte canônica no runtime)
Todos os enums são **derivados em tempo de execução** das fontes do próprio runtime — nenhum valor é redigitado no
módulo de sessão (`SES.*` em `ui_session_v32.js`). A tabela normativa completa, com fonte canônica, shape, gate
positivo e gate negativo de cada campo, está na **seção 11 · Canonical runtime contract sources** — mantida como
tabela única para não criar duas fontes de verdade.

Chaves extras são **proibidas** em raiz, `inputs`, `assessment`, capability, solution, `declaredDriver`,
`architectureContext`, entrada de plataforma, `targetProfile` e `operationalRefinement`.

## 8.1.1 · Dois domínios distintos de capability
`Object.keys(V32.CAPABILITIES)` (25 IDs) **não** é o domínio das chaves de `technologyLandscape.capabilities`.
O owner canônico do Landscape é `V32.TECH_LANDSCAPE` (22 IDs), montado apenas com capabilities que têm
`landscapeEnabled: true`. As capabilities de assessment/recommendation fora desse owner — hoje `soc-governance`,
`soc-staffing` e `soc-skills` — **não podem ser chaves de Landscape** (S84), mas **continuam válidas** em
`solutions[].coveredCapabilities` (S85), porque o engine valida esse campo contra `CAPABILITIES`. Os três IDs são
citados aqui apenas como evidência da auditoria; a produção **deriva ambos os domínios do runtime**, nunca de
lista fixa.

## 8.1.2 · Contrato plain-object
`assessment.answers` e `assessment.notes` (quando presente) são **objetos de mapa JSON**, não arrays. Como
`typeof [] === "object"` em JavaScript, o validador testa explicitamente `!Array.isArray(...)`: `[]` é recusado
mesmo estando "vazio" (S86, S87). A mesma verificação cobre todos os containers de mapa do documento —
`capabilities`, `architectureContext`, `signals`, `targetProfile.overrides`, `operationalRefinement.answers` e o
próprio `inputs` (S88, que também varre o source em busca de checagens sem guard). `notes` permanece **sparse**:
ausente é válido, `{}` é válido, e chave ausente significa observação vazia.

## 8.2 · Representação de campos opcionais
O editor do runtime **remove** campos opcionais vazios (`delete s.coverage`). A sessão preserva essa semântica:
um campo ausente é exportado ausente e importado ausente — **nunca convertido em `null`**. Gate: S42.

## 8.2.1 · Canonical owners **completos** × owners **sparse** (4.8.0.6)
O exporter grava certos owners **sempre completos**. Para esses, **propriedade ausente não é equivalente ao
default**: a ausência é recusada na validação e a normalização **não fabrica** `null` / `UNSET` / `"unset"` / `[]`
(mesma classe de bug já fechada em `declaredDriver` na 4.8.0.4).

| owner | completude | representação de "não informado" | gate |
|---|---|---|---|
| `assessment.answers` | **completo** — todos os 15 IDs canônicos | `null` explícito | S94 |
| `technologyLandscape.capabilities` | **completo** — todos os IDs de `V32.TECH_LANDSCAPE` | `{"presence":"UNSET","solutions":[],"declaredDriver":null}` | S95 |
| `technologyLandscape.architectureContext` | **completo** — todos os campos de `ARCH_FIELDS` | valor de enum explícito | S67 |
| `technologyLandscape.declaredPlatforms` | **required array** (pode ser vazio) | `[]` explícito | S96 |
| `technologyLandscape.signals` | **completo** — todos os `SIGNAL_IDS` | `"unset"` explícito | S97 |
| `operationalRefinement.answers` | **completo** — todos os refinement IDs | `null` explícito | S98 |
| `priorities` | **required array** (pode ser vazio) | `[]` | S10 |
| `assessment.notes` | **sparse** | chave ausente = observação vazia | S87, S99 |
| `targetProfile.overrides` | **sparse** | chave ausente = sem alvo declarado | S10, S99 |
| campos opcionais de `solution` | **sparse** | propriedade ausente | S42, S100 |
| `declaredPlatforms[].notes` | **sparse** | propriedade ausente | S70 |

`normalizeSessionDocument()` lança exceção diante de owner completo incompleto — o import devolve erro **sem tocar
em nenhum owner global**. Gate de self-containment: **S104**.

## 8.2.2 · `solutions[].coveredCapabilities` — contexto canônico (4.8.0.6)
O campo é a via explícita pela qual uma **plataforma de terceiro** declara o que efetivamente entrega. Sua
existência é **posicional**, não apenas tipada:

| regra | origem no runtime congelado | gate |
|---|---|---|
| só em `capabilities["soc-platform"]` | `suppressedByPlatform()` lê a cobertura explícita **apenas** em `TECH_LANDSCAPE["soc-platform"]`; `solRow()` só renderiza os checkboxes quando `capId==="soc-platform"` | S90, S103 |
| **proibido** em solution FortiSOC | `/fortisoc/i.test(s.product\|\|"")` — a cobertura do FortiSOC vem das `capabilityRelations` do catálogo | S90 |
| domínio = `Object.keys(V32.CAPABILITIES)` **exceto** `soc-platform` | é literalmente a expressão que monta a grade de checkboxes | S91 |
| `soc-platform` não cobre a si própria | a UI exclui o próprio ID da grade | S91 |
| array **não vazio**, **sem duplicatas** | `if (covCaps.length) s.coveredCapabilities = covCaps; else delete` — checkboxes não repetem | S92 |
| "nenhuma cobertura declarada" = **campo ausente** (nunca `[]`) | `delete s.coveredCapabilities` | S92 |

`soc-governance`, `soc-staffing` e `soc-skills` permanecem **válidos** como capabilities cobertas (S85) e
**inválidos** como chaves de Landscape (S84) — os dois domínios seguem separados, agora sem legitimar posição
impossível. A supressão derivada dessa declaração é exercitada na posição correta em **S93**.

## 8.2.3 · Canonicalização textual — paridade com `readDraftFromDom()` (4.8.0.6)
O editor grava apenas a forma já canonicalizada; o import **não** aceita representações que a UI converteria de
imediato, e **não** faz trim silencioso — recusa explicitamente:

| campo | contrato | gate |
|---|---|---|
| `solution.vendor` / `product` | `value.trim()`; vazio válido em **um** dos dois (S58 preservado); padded recusado | S100 |
| `solution.coverage` / `notes` | trimados e **não vazios**; `""`, `"   "` e padded recusados; "não informado" = ausência | S100 |
| `solution.status` | quando presente, apenas `V32.ENUMS.solutionStatus`; `""` **fora do domínio** — "não informado" = ausência | S101 |
| `solution.deployment` | ausente **ou** valor de `V32.ENUMS.deployment` | S43 |
| `declaredDriver.note` | `drv.value.trim()`; não vazia e **igual ao próprio trim**; `{"note":" motivo "}` recusado | S102 |

`assessment.notes` e `declaredPlatforms[].notes` **não** são afetados: seus contratos são distintos e já
congelados em rodadas anteriores (S87, S70).

## 8.2.4 · Limite textual em ESCALARES Unicode (4.8.0.7)
O limite normativo de **10.000** conta **valores escalares Unicode (code points)**, não code units UTF-16. Fonte
única: `scalarLen()` em `ui_session_v32.js`, usada por todo campo textual do schema v1.

| aspecto | contrato | gate |
|---|---|---|
| emoji astral | conta **1** escalar, não 2 code units (`"😀".repeat(10000).length === 20000`, `scalarLen === 10000`) | S105 |
| sequência combinante | contada pelos **escalares constituintes**, não por grapheme cluster (`"e\u0301"` = 2) | S105 |
| limite exato | 10.000 aceito · 10.001 recusado | S105, S108 |
| surrogate desemparelhado | **recusado** como Unicode não canônico; nunca tratado como texto válido | S105, S108 |
| normalização/truncamento | **nenhum**: o valor atravessa intacto ou é recusado | S105 |

O contrato vale para **toda string importada**, incluindo metadata de raiz (`toolVersion`, `engineSha256`,
`createdAt`) — gate S108. Enums e hashes continuam recusados antes, por suas regras mais estritas.

`label` tem um bound canônico **estrito** de **200 escalares**, provado pelo exporter: `buildSessionDocument()`
trunca por escalares (`sesLabel()`). A implementação anterior usava `String.slice(0,200)`, que corta code units e
podia **partir um par surrogate**, emitindo um label malformado que o próprio import recusaria — defeito real
corrigido na 4.8.0.7.

## 8.2.5 · Preflight de exportação — fechamento do self-import (4.8.0.7)
Invariante normativa:

> **Nenhum JSON emitido pela UI pode ser recusado pelo mesmo build por causa de um limite que o exporter deixou
> de aplicar.**

Antes de qualquer Object URL, `prepareSessionExport()` monta o documento exato, valida com o **mesmo**
`validateSessionDocument()` do import, serializa os bytes exatos e mede o tamanho **UTF-8 dessa serialização**:

| situação | comportamento | gate |
|---|---|---|
| campo fora do contrato canônico | nenhum arquivo emitido · erro local explícito · sessão intacta | S106, SE7 |
| serialização > 1.048.576 bytes | nenhum arquivo emitido · limite exibido · sessão intacta | S107, SE8 |
| documento válido e dentro do limite | download emitido e **reimportável pelo mesmo build** | S106, S112, SE6 |
| export recusado | **nenhum** Object URL criado | S106, S107, SE7, SE8 |

Nada é truncado silenciosamente: evidência canônica não é mutilada para caber no limite.

## 8.2.6 · Unicidade em `declaredPlatforms` (4.8.0.7)
Duplicatas **não** são estado canônico e são recusadas antes do commit:

| regra | origem no runtime congelado | gate |
|---|---|---|
| no máximo **uma** entrada por `platform` | `readDraftFromDom()` reconstrói a lista como `others.filter(p => p.platform!=="fortigate").concat([entry])` | S111 |
| `subscriptions` **sem repetição** | a UI monta a lista por `Object.keys(V32.SECURITY_SUBSCRIPTIONS).filter(checkbox)` — únicas por construção | S111 |

`deriveLicensedContext()` deduplica os sids via `new Set()`, portanto **nenhum contrato de runtime depende** de
preservar repetição.

## 8.3 · Invariante de target
Além dos tipos, o alvo importado obedece à mesma regra da UI: quando o nível atual está **confirmado**, o alvo
deve ser **estritamente superior** a ele (`target > current`) — os selects só oferecem níveis superiores e
`revalidateTargets()` remove o override quando `current >= target`. Baseline `NA`/não respondido permite qualquer
alvo (0–3). Gate: **S61**.

## 8.5 · Estados alcançáveis (reachable state)
A importação reproduz as invariantes do editor congelado — estado que a UI nunca manteria é recusado **antes** do
commit:

| invariante | origem no runtime | gate |
|---|---|---|
| `solutions` só com `presence` PRESENT ou PARTIAL | `sel.onchange` do editor limpa solutions em NONE/UNSET/UNKNOWN | S59 |
| solution precisa de `vendor` **ou** `product` | o editor descarta soluções sem identificação | S58 |
| `presence: UNSET` ⇒ `declaredDriver: null` | `if (L.presence==="UNSET") L.declaredDriver = null` | S60 |
| alvo **estritamente superior** ao nível atual confirmado | selects de target só oferecem níveis superiores; `revalidateTargets` remove override quando `current >= target` | S61 |

## 8.4 · Garantia de atomicidade
`parse → validação estrutural → validação semântica → normalização em candidato ISOLADO → compatibilidade →
commit → recompute/render`.

O commit real (`commitCanonicalOwners`) funciona assim:
1. **snapshot** completo dos owners canônicos (`snapshotCanonicalOwners`) antes de qualquer escrita;
2. escritas dentro de `try`; **nenhum** `render()`, `uxNewSession()`, modal ou helper de UI é chamado na janela
   de commit (gate estrutural S63 inspeciona o corpo da função e verifica que a tela não muda);
3. qualquer exceção dispara **rollback completo** via `restoreCanonicalOwners`, retornando `{ok:false,
   rolledBack:true}` — **provado após escrita parcial** (S62+S68: o harness intercepta `Set.prototype.clear`, que
   só é chamada depois de `arq`/`ans`/`notes` já terem recebido valores do candidato; o teste captura o estado
   parcial antes da exceção e restaura o patch em `finally`). **Não há hook de fault injection no runtime
   publicado** — a técnica é inteiramente do harness;
4. `render()` ocorre **somente após** o commit ter terminado. O recompute roda **fora** da transação: é o caminho
   de render já congelado, executado sobre estado canônico completo e válido — se ele lançasse, o estado importado
   permaneceria aplicado (como em qualquer render normal da ferramenta). Isso é declarado, não alegado como parte
   da transação.
5. Cobertura de rollback (S69, gate estrutural): todo owner escrito pelo commit — `arq`, `ans`, `notes`,
   `businessPriority`, `TECH_LANDSCAPE` (com `declaredDriver`), `ARCHITECTURE_CONTEXT`, `declaredPlatforms`,
   `SESSION_SIGNALS`, `TARGET_PROFILE`, `OPERATIONAL_REFINEMENT` e `step` — existe no snapshot e na restauração.

Correção declarada na 4.8.0.2: a versão anterior chamava `uxNewSession({silent:true})` dentro do commit, que
resetava e renderizava **antes** da aplicação terminar — não era atômico. Gates: S29, S49, S50, S51, S62, S63.

## 9 · Validação na importação
Limite de **1 MiB** antes do parse · apenas `File.text()` + `JSON.parse` (sem eval/Function/HTML) · os 15 IDs
canônicos · respostas 0–3/"NA"/null · notas ≤ 10.000 chars · até 3 prioridades sem duplicatas · enums de presence
(`UNSET/NONE/PARTIAL/PRESENT/UNKNOWN`) · `declaredDriver` **obrigatório** em cada capability (`null` ou `{note}` — ausência é recusada, pois missing ≠ null) · alvos e temas de aprofundamento válidos · `__proto__`/`prototype`/
`constructor` recusados · **owners completos** (`answers`, `capabilities`, `architectureContext`, `declaredPlatforms`, `signals`, `operationalRefinement.answers`) exigidos na íntegra, com ausência recusada em vez de preenchida por default (§8.2.1) · **paridade textual** com `readDraftFromDom()` (§8.2.3) · limite de **10.000 escalares Unicode** em toda string, incluindo metadata de raiz (§8.2.4) · **preflight de exportação** que impede a emissão de arquivo não reimportável (§8.2.5) · unicidade de plataformas/subscriptions (§8.2.6) · `coveredCapabilities` validado no **contexto canônico** (§8.2.2). **Escopo da transação:** validação, normalização e commit estão dentro da boundary
protegida — falha em qualquer uma dessas etapas deixa a sessão anterior intacta (rollback provado em S62+S68).
O **recompute/render é pós-commit e fica fora da transação**: nesse ponto o estado importado já está aplicado.

## 10 · Limitações conhecidas
- somente snapshots concluídos (a partir de Results);
- sem autosave, sem persistência de navegador, sem resume de sessão incompleta;
- sem cross-engine migration;
- sem assinatura ou autenticidade criptográfica;
- o JSON pode conter informações sensíveis do cliente.

**"Evidence Archive"** significa arquivo local versionado dos inputs declarados na sessão. **Não** significa cadeia
de custódia, evidência forense, assinatura digital, não-repúdio, armazenamento regulatório ou auditoria formal.

---
Runtime desta fase: toolVersion `3.4.0-dev.4.8.0.7` · HTML SHA-256 `8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb` · engine `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` (byte-idêntico desde a 4.7)


## 11 · Canonical runtime contract sources (item 24)

| field | canonical source | valid values / shape | how validator derives it | positive gate | negative gate |
|---|---|---|---|---|---|
| `technologyLandscape.capabilities.{id}` (keys) | **`V32.TECH_LANDSCAPE`** — owner do Landscape | domínio = `Object.keys(V32.TECH_LANDSCAPE)`; IDs de `CAPABILITIES` com `landscapeEnabled:false` são recusados (mesma regra de `validateConfigV32`, que exige capability habilitada) | `SES.landscapeIds()` | S83 | S84, S89 |
| `presence` | `V32.ENUMS.presence` | UNSET · NONE · PARTIAL · PRESENT · UNKNOWN | `SES.presence()` | S8, S41 | S21-S26 |
| `solutions[]` | editor (`readDraftFromDom`) | lista; exige `vendor` **ou** `product`; só com presence PRESENT/PARTIAL | allowlist `SOLUTION_KEYS` | S41, S42 | S58, S59 |
| `solutions[].status` | `V32.ENUMS.solutionStatus` | 6 status; **propriedade ausente** = não informado (`""` não pertence ao domínio do import — é só a opção visual do select) | `SES.status()` | S43, S101 | S43, S101 |
| `solutions[].deployment` | `V32.ENUMS.deployment` | appliance · vm · saas · cloud · on-prem · air-gapped · agente · hybrid | `SES.deployment()` | S41 | S43 |
| `solutions[].coveredCapabilities[]` | **posição**: `TECH_LANDSCAPE["soc-platform"]` (`suppressedByPlatform()` / `solRow()`); **domínio**: `V32.CAPABILITIES` menos `soc-platform` | só em solution **third-party** de `soc-platform`; array não vazio, sem duplicatas, sem auto-cobertura; ausente quando nada foi declarado; proibido em FortiSOC | `SES.coveredIds()` + `COVERAGE_HOST_CAP` + `FORTISOC_RE` | S44, S85, S90, S93 | S90, S91, S92, S103 |
| `declaredDriver` | editor: `drv.value.trim() ? {note} : null` | **propriedade obrigatória**; `null` **ou** `{note: string não-vazia}`; ausência, `{}`, `{note:null}`, `{note:""}`, `{note:{}}`, extras e primitivos recusados | presença da chave + shape | S71, S76, S78 | S71, S76, S77 |
| `architectureContext` | bloco **obrigatório e COMPLETO** (todos os campos de `ARCH_FIELDS`) | candidato não herda valor da sessão aberta | documento é a única fonte | S66, S72, S79 | S67 |
| `architectureContext.*` | `ARCH_FIELDS` via `window.__V32UI` | saasAllowed/localProcessingRequired/otIsolated: `unknown`·`yes`·`no` · unifiedPlatformPreference: `undefined`·`unified`·`no` · environmentProfile: `uninformed`·`cloud-first`·`hybrid`·`on-prem` · dataResidency: `uninformed`·`local-required`·`regulated`·`no-constraint` | `SES.archValues()` monta `{campo: opts[0]}` | S53 | S54 |
| `declaredPlatforms` (owner) | `PLATFORM_CONTEXT.declaredPlatforms` | **propriedade obrigatória**; lista podendo ser vazia; ausência ≠ `[]` | presença da chave | S96 | S96 |
| `declaredPlatforms[].platform` | owner `PLATFORM_CONTEXT` (UI declara fortigate; suítes 3.3.3 preservam fortisoc) | `fortigate` · `fortisoc` | `SES.platforms()` | S55, S73 | S47 |
| `declaredPlatforms[].bundle` | `V32.BUNDLES` | atp · utp · ent · `null`; não-null exige `BUNDLES[b].appliesTo === platform` (mesma invariante de `validateConfigV32`) | `SES.bundles()` + `appliesTo` | S56, S65 | S47, S65 |
| `declaredPlatforms[].subscriptions[]` | `V32.SECURITY_SUBSCRIPTIONS` | apenas IDs existentes | `SES.subs()` | S56 | S47, S65 |
| `declaredPlatforms[].notes` | owner canônico (suíte 3.3.3) | **string** opcional (vazia aceita); ausência ≠ `null`; object/array/number/boolean/null recusados | tipo verificado | S56, S70 | S70 |
| root `label` | exporter (`sesLabel()`) | string; **bound estrito de 200 escalares**; truncamento por code points (nunca parte par surrogate) | `SESSION_MAX_LABEL` | S108 | S108 |
| root `toolVersion` / `engineSha256` / `createdAt` | metadata de build | string bem formada, ≤ 10.000 escalares | `strFieldError()` | S108, S109 | S108 |
| toda string do documento | `scalarLen()` + `isWellFormedUnicode()` | ≤ 10.000 **escalares Unicode**; surrogate desemparelhado recusado | fonte única `strFieldError()` | S105, S108 | S105, S108 |
| `declaredPlatforms` (unicidade) | `readDraftFromDom()` · `deriveLicensedContext()` | sem `platform` repetida; `subscriptions` sem repetição | conjuntos no validador | S111 | S111 |
| `signals` (owner) | `V32.SIGNAL_IDS` | **bloco obrigatório e COMPLETO**; sinal não declarado é `"unset"`, nunca ausência | `SES.signalIds()` | S41, S97 | S46, S97 |
| `signals.{id}` | `V32.SIGNAL_IDS` / `SESSION_SIGNALS` | `true` \| `"unset"` | `SES.signalIds()` / `signalValues()` | S41 | S46 |
| `targetProfile.overrides` | selects de target + `revalidateTargets` | sparse; com current confirmado, **target > current**; baseline NA aceita 0–3 | comparação com `answers` do documento | S10, S61 | S61 |

O validador **não mantém enum paralelo divergente**: todos os valores acima são lidos do runtime em tempo de
execução. A única exceção documentada é a lista de platform IDs (`fortigate`, `fortisoc`), que não existe como
constante única no runtime — é o conjunto que a UI declara mais o que o owner canônico preserva nas suítes
congeladas 3.3.3; qualquer outro ID é recusado (S47).

### Alteração mínima fora do módulo de sessão
`ui_v32.js` recebeu **uma linha aditiva**: `ARCH_FIELDS` passou a ser exposto em `window.__V32UI`, a ponte já
existente (que já expunha `openEditor`, `esc32`, `iconFor`). Justificativa: `ARCH_FIELDS` é a única fonte real do
contrato de arquitetura, vive dentro do IIFE da UI e o DOM só a expõe com o editor aberto — sem essa exposição
seria impossível cumprir o item 3 sem duplicar o enum, exatamente o que a spec proíbe. Nenhum comportamento,
render ou semântica foi alterado.
