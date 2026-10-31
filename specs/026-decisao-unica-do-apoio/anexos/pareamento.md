# Pareamento `itemId → chave` — tabela de pré-imagens (T011, `D026-REC1 (g)`)

Demanda 026 — decisão única do apoio. Tarefa T011 (`tasks.md`), lente `data-engineer`, **somente leitura do catálogo**: nenhuma constraint nova, nenhum toque em `engine_v32.js` (frozen), em `quickscan_secops_soccmm_v3_1_3.html` (Camada 1, frozen) nem em qualquer outro arquivo do repositório — este anexo é o único artefato escrito.

| | |
|---|---|
| Data | 2026-10-31 |
| HEAD | `96369af` (`feature/026-decisao-unica-do-apoio`; `git status` limpo antes; depois, só este anexo como untracked — `git diff` vazio) |
| Regras aplicadas | `anexos/desenho-sintese.md` §1.4 ≡ `spec.md` §Contratos → *Pareamento `itemId → chave` por critério* (os dois textos são idênticos, conferido) |
| Fontes lidas | `engine_v32.js:85` `OFFERINGS` (29 ids; defaults `family:null, variantOf:null` em `:80`), `:200` `SERVICES` (16), `:242-248` `SERVICE_FAMILIES` (1 família, 14 membros); `quickscan_secops_soccmm_v3_1_3.html:262-276` `PRODUCTS` (13 chaves) |
| Constante da regra 4 | `LINHA_DA_FAMILIA_DE_SERVICO = { "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" }` — a única declarada (§1.4) |
| Script | `C:\Users\usuario\AppData\Local\Temp\claude\C--Projetos-QuickScan-SOC-CMM\ed12b417-535d-4d8a-94c5-4194158e2cc2\scratchpad\pareamento.js` (fonte integral no §7 deste anexo) |
| Execução | `node pareamento.js C:/Projetos/QuickScan-SOC-CMM/phase5` → exit 0; saída colada **sem edição** nos §1–§5 |

## 0 · Método — calculado, não lido de cabeça

O script carrega `engine_v32.js` por `require` (é IIFE sobre `globalThis` com `module.exports = V32`, `engine_v32.js:811-819` — o mesmo caminho de `tests_m42_m86.js:7`) e lê `V32.OFFERINGS`, `V32.SERVICES`, `V32.SERVICE_FAMILIES` do objeto exportado; `PRODUCTS` é extraído do HTML congelado por regex sobre o literal `const PRODUCTS = {…};` (`:262-276`) e avaliado com `Function`. O `ICONS` (`:249`, base64) não entra no casamento da regex. A função `chaveDe` do script aplica as cinco regras **na ordem escrita** e devolve, além da chave, a regra que decidiu e a cadeia percorrida — é essa trilha que aparece na coluna "cadeia percorrida" do §1. `idsDaLinha`/`tipoDaLinha` são a imagem inversa calculada sobre a tabela, como o desenho pede.

Sanidade do domínio, medida pelo script (primeira linha do §1): `OFFERINGS ∩ SERVICES = ∅` (os 45 ids são distintos), os 13 `.n` de `PRODUCTS` são distintos (a regra 1 nunca é ambígua), os 14 membros de `SERVICE_FAMILIES` existem em `SERVICES` e não se repetem, e a cadeia `variantOf` não tem ciclo (quatro alvos: `fortisiem`, `fortiedr`, `ndr-family`, `fortimail-wss`, todos existentes).

**Leitura rápida**: 45 ids → 32 com chave, 13 `null`; por regra decisora 12 / 3 / 3 / 14 / 13; as 13 chaves de `PRODUCTS` têm ≥ 1 pré-imagem (a de `FortiGuard-Service-Bundle` só pela constante da regra 4); `tipoDaLinha === "servico"` em exatamente `SOCaaS`, `FortiGuard-MDR-Service`, `FortiGuard-Service-Bundle`. A lista de `null` obtida é **idêntica** à escrita no §1.4. Tudo o que o `REC1 (g)` afirma se sustenta no catálogo de hoje. As surpresas estão no §6.

---

## 1–5 · Saída do script (colada sem edição; A ≡ §1, B ≡ §2, C ≡ §3, D ≡ §4, E ≡ §5)

Domínio: OFFERINGS=29 · SERVICES=16 · OFFERINGS ∪ SERVICES=45 (colisão de id entre os dois: nenhuma) · PRODUCTS=13 (nomes `.n` duplicados: nenhum) · SERVICE_FAMILIES=1 com 14 membros (órfãos: nenhum; duplicados: nenhum)

### A · Tabela por id — `chaveDe(itemId)` (ordem do catálogo)

| # | id | origem | entityType / serviceType | family | variantOf | name | **chave** | **regra** | cadeia percorrida |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `endpoint-family` | OFFERINGS | family | `null` | `null` | Fortinet Endpoint Security | **`FortiEndpoint`** | **3** | fam=endpoint-family; candidatos={fortiendpoint, fortiedr, forticlient}; pareáveis por (1)={fortiendpoint→FortiEndpoint} (1) → ÚNICO |
| 2 | `fortimail-family` | OFFERINGS | family | `null` | `null` | FortiMail (Email & Workspace Security) | **`null`** | **5** | fam=fortimail-family; candidatos={fortimail, fortimail-wss}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null |
| 3 | `ndr-family` | OFFERINGS | family | `null` | `null` | FortiNDR | **`FortiNDR`** | **1** | ndr-family.name "FortiNDR" === PRODUCTS.FortiNDR.n |
| 4 | `soc-platform-family` | OFFERINGS | family | `null` | `null` | Fortinet SecOps Platform | **`null`** | **5** | fam=soc-platform-family; candidatos={fortisoc, fortianalyzer, fortisiem, fortisoar}; pareáveis por (1)={fortianalyzer→FortiAnalyzer, fortisiem→FortiSIEM, fortisoar→FortiSOAR} (3) → NÃO único → (3) falha → (4) n/a (oferta) → null |
| 5 | `identity-family` | OFFERINGS | family | `null` | `null` | Fortinet Identity | **`null`** | **5** | fam=identity-family; candidatos={fortiauthenticator, fortipam}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null |
| 6 | `fortisoc` | OFFERINGS | offering | `soc-platform-family` | `null` | FortiSOC | **`null`** | **5** | fam=soc-platform-family; candidatos={fortisoc, fortianalyzer, fortisiem, fortisoar}; pareáveis por (1)={fortianalyzer→FortiAnalyzer, fortisiem→FortiSIEM, fortisoar→FortiSOAR} (3) → NÃO único → (3) falha → (4) n/a (oferta) → null |
| 7 | `fortianalyzer` | OFFERINGS | offering | `soc-platform-family` | `null` | FortiAnalyzer | **`FortiAnalyzer`** | **1** | fortianalyzer.name "FortiAnalyzer" === PRODUCTS.FortiAnalyzer.n |
| 8 | `fortisiem` | OFFERINGS | offering | `soc-platform-family` | `null` | FortiSIEM | **`FortiSIEM`** | **1** | fortisiem.name "FortiSIEM" === PRODUCTS.FortiSIEM.n |
| 9 | `fortisiem-cloud` | OFFERINGS | variant | `soc-platform-family` | `fortisiem` | FortiSIEM Cloud | **`FortiSIEM`** | **2** | fortisiem-cloud →variantOf→ fortisiem →(1)→ FortiSIEM |
| 10 | `fortisoar` | OFFERINGS | offering | `soc-platform-family` | `null` | FortiSOAR | **`FortiSOAR`** | **1** | fortisoar.name "FortiSOAR" === PRODUCTS.FortiSOAR.n |
| 11 | `fortiendpoint` | OFFERINGS | offering | `endpoint-family` | `null` | FortiEndpoint | **`FortiEndpoint`** | **1** | fortiendpoint.name "FortiEndpoint" === PRODUCTS.FortiEndpoint.n |
| 12 | `fortiedr` | OFFERINGS | offering | `endpoint-family` | `null` | FortiEDR | **`FortiEndpoint`** | **3** | fam=endpoint-family; candidatos={fortiendpoint, fortiedr, forticlient}; pareáveis por (1)={fortiendpoint→FortiEndpoint} (1) → ÚNICO |
| 13 | `forticlient` | OFFERINGS | component | `endpoint-family` | `null` | FortiClient | **`FortiEndpoint`** | **3** | fam=endpoint-family; candidatos={fortiendpoint, fortiedr, forticlient}; pareáveis por (1)={fortiendpoint→FortiEndpoint} (1) → ÚNICO |
| 14 | `fortixdr` | OFFERINGS | variant | `endpoint-family` | `fortiedr` | FortiXDR | **`FortiXDR`** | **1** | fortixdr.name "FortiXDR" === PRODUCTS.FortiXDR.n |
| 15 | `fortindr-cloud` | OFFERINGS | variant | `ndr-family` | `ndr-family` | FortiNDR Cloud | **`FortiNDR`** | **2** | fortindr-cloud →variantOf→ ndr-family →(1)→ FortiNDR |
| 16 | `fortindr-onprem` | OFFERINGS | variant | `ndr-family` | `ndr-family` | FortiNDR (On-Premises) | **`FortiNDR`** | **2** | fortindr-onprem →variantOf→ ndr-family →(1)→ FortiNDR |
| 17 | `fortimail` | OFFERINGS | offering | `fortimail-family` | `null` | FortiMail | **`null`** | **5** | fam=fortimail-family; candidatos={fortimail, fortimail-wss}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null |
| 18 | `fortimail-wss` | OFFERINGS | offering | `fortimail-family` | `null` | FortiMail Workspace Security | **`null`** | **5** | fam=fortimail-family; candidatos={fortimail, fortimail-wss}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null |
| 19 | `fortimail-cloud-saas` | OFFERINGS | component | `fortimail-family` | `fortimail-wss` | FortiMail Cloud SaaS | **`null`** | **5** | fortimail-cloud-saas →variantOf→ fortimail-wss →(1) falha; fam=fortimail-family; candidatos={fortimail, fortimail-wss}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null |
| 20 | `fortirecon` | OFFERINGS | offering | `null` | `null` | FortiRecon | **`FortiRecon`** | **1** | fortirecon.name "FortiRecon" === PRODUCTS.FortiRecon.n |
| 21 | `fortideceptor` | OFFERINGS | offering | `null` | `null` | FortiDeceptor | **`FortiDeceptor`** | **1** | fortideceptor.name "FortiDeceptor" === PRODUCTS.FortiDeceptor.n |
| 22 | `fortisandbox` | OFFERINGS | offering | `null` | `null` | FortiSandbox | **`null`** | **5** | family=null e entityType≠family → (3) n/a → (4) n/a (oferta) → null |
| 23 | `fortidlp` | OFFERINGS | offering | `null` | `null` | FortiDLP | **`FortiDLP`** | **1** | fortidlp.name "FortiDLP" === PRODUCTS.FortiDLP.n |
| 24 | `fortiaigate` | OFFERINGS | offering | `null` | `null` | FortiAIGate | **`null`** | **5** | family=null e entityType≠family → (3) n/a → (4) n/a (oferta) → null |
| 25 | `fortisat` | OFFERINGS | offering | `null` | `null` | FortiSAT | **`null`** | **5** | family=null e entityType≠family → (3) n/a → (4) n/a (oferta) → null |
| 26 | `fortiauthenticator` | OFFERINGS | offering | `identity-family` | `null` | FortiAuthenticator | **`null`** | **5** | fam=identity-family; candidatos={fortiauthenticator, fortipam}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null |
| 27 | `fortipam` | OFFERINGS | offering | `identity-family` | `null` | FortiPAM | **`null`** | **5** | fam=identity-family; candidatos={fortiauthenticator, fortipam}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null |
| 28 | `fortiai-assist` | OFFERINGS | component | `null` | `null` | FortiAI-Assist | **`FortiAI-Assist`** | **1** | fortiai-assist.name "FortiAI-Assist" === PRODUCTS.FortiAI-Assist.n |
| 29 | `fortigate` | OFFERINGS | offering | `null` | `null` | FortiGate | **`null`** | **5** | family=null e entityType≠family → (3) n/a → (4) n/a (oferta) → null |
| 30 | `fortiguard-socaas` | SERVICES | managed-service | `null` | `null` | FortiGuard SOCaaS | **`SOCaaS`** | **1** | fortiguard-socaas.name "FortiGuard SOCaaS" === PRODUCTS.SOCaaS.n |
| 31 | `fortiguard-mdr` | SERVICES | managed-service | `null` | `null` | FortiGuard MDR | **`FortiGuard-MDR-Service`** | **1** | fortiguard-mdr.name "FortiGuard MDR" === PRODUCTS.FortiGuard-MDR-Service.n |
| 32 | `ir-readiness-subscription` | SERVICES | readiness-subscription | `fortiguard-labs-advisory` | `null` | FortiGuard Incident Readiness Subscription | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ ir-readiness-subscription → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 33 | `ir-plan-development` | SERVICES | advisory | `fortiguard-labs-advisory` | `null` | Incident Response Plan Development | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ ir-plan-development → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 34 | `ir-playbook-development` | SERVICES | advisory | `fortiguard-labs-advisory` | `null` | Incident Response Playbook Development | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ ir-playbook-development → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 35 | `ttx` | SERVICES | exercise | `fortiguard-labs-advisory` | `null` | Cybersecurity Tabletop Exercise | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ ttx → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 36 | `ir-training` | SERVICES | training | `fortiguard-labs-advisory` | `null` | Incident Response Training | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ ir-training → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 37 | `dfir` | SERVICES | reactive-service | `fortiguard-labs-advisory` | `null` | Digital Forensics & Incident Response | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ dfir → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 38 | `compromise-assessment` | SERVICES | assessment | `fortiguard-labs-advisory` | `null` | Compromise Assessment | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ compromise-assessment → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 39 | `ransomware-readiness-assessment` | SERVICES | assessment | `fortiguard-labs-advisory` | `null` | Ransomware Readiness Assessment | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ ransomware-readiness-assessment → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 40 | `soc-assessment` | SERVICES | assessment | `fortiguard-labs-advisory` | `null` | FortiGuard SOC Assessment | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ soc-assessment → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 41 | `soc-development-service` | SERVICES | advisory | `fortiguard-labs-advisory` | `null` | FortiGuard SOC Development Service | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ soc-development-service → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 42 | `vulnerability-assessment` | SERVICES | assessment | `fortiguard-labs-advisory` | `null` | Vulnerability Assessment | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ vulnerability-assessment → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 43 | `ad-security-assessment` | SERVICES | assessment | `fortiguard-labs-advisory` | `null` | Active Directory Security Assessment | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ ad-security-assessment → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 44 | `penetration-testing` | SERVICES | assessment | `fortiguard-labs-advisory` | `null` | Penetration Testing | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ penetration-testing → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |
| 45 | `red-team-assessment` | SERVICES | assessment | `fortiguard-labs-advisory` | `null` | Red Team Assessment | **`FortiGuard-Service-Bundle`** | **4** | SERVICE_FAMILIES["fortiguard-labs-advisory"].members ∋ red-team-assessment → LINHA_DA_FAMILIA_DE_SERVICO["fortiguard-labs-advisory"] = "FortiGuard-Service-Bundle" |

Contagem por regra decisora: regra 1: 12 · regra 2: 3 · regra 3: 3 · regra 4: 14 · regra 5: 13 · total 45 · com chave: 32 · null: 13

### B · Tabela por chave de `PRODUCTS` (13) — `idsDaLinha(chave)` / `tipoDaLinha(chave)`

| # | chave | `PRODUCTS[k].n` | pré-imagens (`idsDaLinha`) | nº | regras que as trouxeram | **tipoDaLinha** |
|---|---|---|---|---|---|---|
| 1 | `FortiAnalyzer` | FortiAnalyzer | `fortianalyzer` | 1 | 1 | **produto** |
| 2 | `FortiSIEM` | FortiSIEM | `fortisiem`, `fortisiem-cloud` | 2 | 1,2 | **produto** |
| 3 | `FortiSOAR` | FortiSOAR | `fortisoar` | 1 | 1 | **produto** |
| 4 | `FortiEndpoint` | FortiEndpoint | `endpoint-family`, `fortiendpoint`, `fortiedr`, `forticlient` | 4 | 1,3 | **produto** |
| 5 | `FortiNDR` | FortiNDR | `ndr-family`, `fortindr-cloud`, `fortindr-onprem` | 3 | 1,2 | **produto** |
| 6 | `FortiRecon` | FortiRecon | `fortirecon` | 1 | 1 | **produto** |
| 7 | `SOCaaS` | FortiGuard SOCaaS | `fortiguard-socaas` | 1 | 1 | **servico** |
| 8 | `FortiGuard-MDR-Service` | FortiGuard MDR | `fortiguard-mdr` | 1 | 1 | **servico** |
| 9 | `FortiAI-Assist` | FortiAI-Assist | `fortiai-assist` | 1 | 1 | **produto** |
| 10 | `FortiGuard-Service-Bundle` | Serviços FortiGuard | `ir-readiness-subscription`, `ir-plan-development`, `ir-playbook-development`, `ttx`, `ir-training`, `dfir`, `compromise-assessment`, `ransomware-readiness-assessment`, `soc-assessment`, `soc-development-service`, `vulnerability-assessment`, `ad-security-assessment`, `penetration-testing`, `red-team-assessment` | 14 | 4 | **servico** |
| 11 | `FortiXDR` | FortiXDR | `fortixdr` | 1 | 1 | **produto** |
| 12 | `FortiDeceptor` | FortiDeceptor | `fortideceptor` | 1 | 1 | **produto** |
| 13 | `FortiDLP` | FortiDLP | `fortidlp` | 1 | 1 | **produto** |

Chaves sem pré-imagem: **nenhuma** (13/13 com ≥ 1 pré-imagem) · tipo `servico`: `SOCaaS`, `FortiGuard-MDR-Service`, `FortiGuard-Service-Bundle` · tipo `produto`: 10

### C · Regra 3 por família — unicidade do representante

| nó de família | candidatos (`family===fam ∧ variantOf===null ∧ entityType≠family`) | excluídos por `variantOf≠null` | pareáveis por (1) | nº | **resultado** | ids que a regra 3 decide |
|---|---|---|---|---|---|---|
| `endpoint-family` | `fortiendpoint`, `fortiedr`, `forticlient` | `fortixdr` | `fortiendpoint`→`FortiEndpoint` | 1 | **`FortiEndpoint`** | `endpoint-family`, `fortiedr`, `forticlient` |
| `fortimail-family` | `fortimail`, `fortimail-wss` | `fortimail-cloud-saas` | ∅ | 0 | **`null`** | — (ninguém) |
| `ndr-family` | ∅ | `fortindr-cloud`, `fortindr-onprem` | ∅ | 0 | **`null`** | — (ninguém) |
| `soc-platform-family` | `fortisoc`, `fortianalyzer`, `fortisiem`, `fortisoar` | `fortisiem-cloud` | `fortianalyzer`→`FortiAnalyzer`, `fortisiem`→`FortiSIEM`, `fortisoar`→`FortiSOAR` | 3 | **`null`** | — (ninguém) |
| `identity-family` | `fortiauthenticator`, `fortipam` | ∅ | ∅ | 0 | **`null`** | — (ninguém) |

### D · Lista fechada dos `null` (regra 5)

- `fortimail-family` (OFFERINGS, family) — fam=fortimail-family; candidatos={fortimail, fortimail-wss}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null
- `soc-platform-family` (OFFERINGS, family) — fam=soc-platform-family; candidatos={fortisoc, fortianalyzer, fortisiem, fortisoar}; pareáveis por (1)={fortianalyzer→FortiAnalyzer, fortisiem→FortiSIEM, fortisoar→FortiSOAR} (3) → NÃO único → (3) falha → (4) n/a (oferta) → null
- `identity-family` (OFFERINGS, family) — fam=identity-family; candidatos={fortiauthenticator, fortipam}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null
- `fortisoc` (OFFERINGS, offering, family soc-platform-family) — fam=soc-platform-family; candidatos={fortisoc, fortianalyzer, fortisiem, fortisoar}; pareáveis por (1)={fortianalyzer→FortiAnalyzer, fortisiem→FortiSIEM, fortisoar→FortiSOAR} (3) → NÃO único → (3) falha → (4) n/a (oferta) → null
- `fortimail` (OFFERINGS, offering, family fortimail-family) — fam=fortimail-family; candidatos={fortimail, fortimail-wss}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null
- `fortimail-wss` (OFFERINGS, offering, family fortimail-family) — fam=fortimail-family; candidatos={fortimail, fortimail-wss}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null
- `fortimail-cloud-saas` (OFFERINGS, component, family fortimail-family) — fortimail-cloud-saas →variantOf→ fortimail-wss →(1) falha; fam=fortimail-family; candidatos={fortimail, fortimail-wss}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null
- `fortisandbox` (OFFERINGS, offering) — family=null e entityType≠family → (3) n/a → (4) n/a (oferta) → null
- `fortiaigate` (OFFERINGS, offering) — family=null e entityType≠family → (3) n/a → (4) n/a (oferta) → null
- `fortisat` (OFFERINGS, offering) — family=null e entityType≠family → (3) n/a → (4) n/a (oferta) → null
- `fortiauthenticator` (OFFERINGS, offering, family identity-family) — fam=identity-family; candidatos={fortiauthenticator, fortipam}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null
- `fortipam` (OFFERINGS, offering, family identity-family) — fam=identity-family; candidatos={fortiauthenticator, fortipam}; pareáveis por (1)={∅} (0) → nenhum → (3) falha → (4) n/a (oferta) → null
- `fortigate` (OFFERINGS, offering) — family=null e entityType≠family → (3) n/a → (4) n/a (oferta) → null

Total: **13** — ofertas: 13; serviços: 0.
Conferência contra a lista escrita no §1.4 (13 ids): **idêntica**.

### E · Sensibilidade à ordem das regras (medida, não suposta)

| id | §1.4 (1→2→3) | se 2 e 3 viessem antes de 1 | se 3 viesse antes de 2 | se a regra 3 não exigisse `variantOf===null` |
|---|---|---|---|---|
| `endpoint-family` | `FortiEndpoint` | `FortiEndpoint` | `FortiEndpoint` | `null` ⚠ |
| `fortiedr` | `FortiEndpoint` | `FortiEndpoint` | `FortiEndpoint` | `null` ⚠ |
| `forticlient` | `FortiEndpoint` | `FortiEndpoint` | `FortiEndpoint` | `null` ⚠ |
| `fortixdr` | `FortiXDR` | `FortiEndpoint` ⚠ | `FortiXDR` | `FortiXDR` |

(4 ids sensíveis; os demais 25 offerings são invariantes a essas três variações. Serviços não entram: só a regra 1 e a 4 os alcançam.)

---

## 6 · Onde as regras §1.4 são ambíguas ou surpreendem — lido do resultado, não suposto

Numeração permanente (`PAR-1`…), para o QA (`T010`, reimplementação do pareamento no gate) e o core (`T020`, `chaveDe`) citarem. Nenhum item abaixo pede mudança de catálogo; os que pedem decisão de semântica estão marcados **decisão**.

### PAR-1 · `fortixdr` pareia por nome com `FortiXDR` embora seja `variantOf: "fortiedr"` — a ordem 1 → 2 → 3 é o que decide

`OFFERINGS.fortixdr` (`engine_v32.js:133`) é `entityType:"variant"`, `family:"endpoint-family"`, `variantOf:"fortiedr"`, `name:"FortiXDR"`. A regra 1 bate em `PRODUCTS.FortiXDR.n === "FortiXDR"` (`v3_1_3.html:273`) **antes** de a cadeia `variantOf` ser percorrida — e a cadeia nem chegaria a lugar algum: `fortiedr` (`:125`) não tem par por nome. A regra 2 só existe para variantes cujo **nome próprio não pareia** (`fortisiem-cloud`, `fortindr-*`); a 1 é uma porta de saída que a variante pode tomar por conta própria.

O §5 mede o custo de inverter: com 2 e 3 avaliadas antes de 1, `fortixdr → FortiEndpoint` (pela regra 3 do `endpoint-family`), e a chave `FortiXDR` ficaria **sem pré-imagem** — o `REC1 (g)` cairia. Logo a ordem não é estilo: é o que garante 13/13 chaves cobertas.

**Efeito colateral que surpreende** (não é defeito, é consequência medida): a hierarquia do motor fica **invertida** na Camada 1. A base `fortiedr` vai para `FortiEndpoint` (regra 3, irmã) e a sua variante `fortixdr` vai para `FortiXDR` (regra 1, linha própria). `idsDaLinha("FortiXDR") = {fortixdr}` apenas — `fortiedr` **não** é pré-imagem de `FortiXDR`. Quem esperar "a variante herda a linha da base" lê a tabela ao contrário. A elegibilidade de `fortiguard-mdr` (`baseOffering:["fortiedr","fortixdr","fortiendpoint"]`, `engine_v32.js:209`) atravessa duas linhas da Camada 1 (`FortiEndpoint` e `FortiXDR`) — informação só, fora do escopo do pareamento.

### PAR-2 · A cláusula `variantOf === null` da regra 3 é a que segura o `endpoint-family` — e o §1.4 não diz isso

O texto do §1.4 explica só a cláusula *"exatamente uma"* (sem ela, `fortisoc → FortiAnalyzer`). A outra cláusula, `variantOf === null` nos candidatos, tem o mesmo peso e passa em silêncio: o §5 mede que, sem ela, `fortixdr` entra no conjunto de candidatos do `endpoint-family`, pareia por nome, os pareáveis passam a ser **dois** (`fortiendpoint`, `fortixdr`) e a unicidade cai — `endpoint-family`, `fortiedr` e `forticlient` viram `null` (três ids a menos com chave; `FortiEndpoint` ficaria com pré-imagem `{fortiendpoint}` só). O catálogo de hoje tem exatamente **uma** variante cujo nome pareia (`fortixdr`), e é na família em que a regra 3 é a única que resolve alguém. Cláusula de peso igual, mutante natural para o gate (`DEPENDÊNCIAS`).

### PAR-3 · `ndr-family` é o único nó de família que pareia por nome — e a regra 3 não o cobre em fallback

`OFFERINGS["ndr-family"].name === "FortiNDR"` (`engine_v32.js:89` = `v3_1_3.html:267`); as duas variantes (`fortindr-cloud` `:138`, `fortindr-onprem`) têm `variantOf:"ndr-family"` e chegam a `FortiNDR` pela regra 2 **através do nó**. A regra 3 aplicada ao `ndr-family` dá `null` (§3: candidatos `∅`, porque os dois membros são variantes e o próprio nó é excluído por `entityType === "family"`). Hoje é irrelevante — a 1 resolve antes —, mas a cobertura de `FortiNDR` depende **inteiramente** de um nome: se a família fosse renomeada, as três pré-imagens cairiam juntas e a chave ficaria sem pré-imagem. É o inverso do `endpoint-family`, cuja cobertura vem de um membro. Não é achado (catálogo é frozen); é a fragilidade que o gate deve nomear quando falhar.

### PAR-4 · **decisão** — cadeia da regra 2 que termina sem alcançar (1): cair para a 3 ou parar?

`fortimail-cloud-saas` (`engine_v32.js:151`, `entityType:"component"`, `variantOf:"fortimail-wss"`): a cadeia chega a `fortimail-wss`, que não pareia, e acaba. O §1.4 diz *"cadeia variantOf até (1)"* e não diz o que acontece quando a cadeia se esgota. O script **cai para a regra 3** (fam = `fortimail-family` → nenhum pareável → `null`); parar na 2 daria `null` também. **No catálogo de hoje o resultado é o mesmo** (único caso: linha 19 do §1), mas `chaveDe` precisa escolher uma semântica e o gate precisa afirmá-la, senão a próxima variante órfã de nome decide sozinha. Recomendação da lente de dados: **cair para a 3** (é o que a regra 3 já faz para a variante `fortixdr` se a 1 não existisse — coerência: variante sem nome próprio herda o representante da família).

### PAR-5 · **decisão** — regra 3 para oferta com `family: null` e `entityType ≠ "family"`

`fortisandbox`, `fortiaigate`, `fortisat`, `fortigate`: sem família, não são nó de família; o §1.4 define `fam` só nos dois casos (`family` ou o próprio id quando família) e não diz que a regra 3 é inaplicável quando `fam` é `null`. O script trata como **não aplicável** (`fam` nulo → sem conjunto de candidatos → segue para 4/5). A alternativa — tomar `fam = null` literalmente e buscar `family === null` — reuniria as 8 ofertas sem família (`fortirecon`, `fortideceptor`, `fortisandbox`, `fortidlp`, `fortiaigate`, `fortisat`, `fortiai-assist`, `fortigate`) num "pseudo-grupo" com **quatro** pareáveis (`fortirecon`, `fortideceptor`, `fortidlp`, `fortiai-assist`), não único, `null` do mesmo jeito. Resultado invariante hoje; semântica a fixar em `chaveDe` (recomendado: `fam == null → regra 3 não se aplica`, nunca comparar `family === null` como se fosse família).

### PAR-6 · A regra 1 compara com `PRODUCTS[k].n` e devolve a **chave** `k` — em 3 das 13 linhas chave ≠ nome

`SOCaaS` (`n:"FortiGuard SOCaaS"`), `FortiGuard-MDR-Service` (`n:"FortiGuard MDR"`), `FortiGuard-Service-Bundle` (`n:"Serviços FortiGuard"`). Implementação ou oráculo que compare `name` com a **chave** (ou faça `toLowerCase` do id contra a chave, como as "9 colisões case-insensitive" de `custo-identidade.md` §0 sugerem) perde os dois serviços da regra 1 e deixa `SOCaaS` e `FortiGuard-MDR-Service` sem pré-imagem. `chaveDe` compara com `.n` e devolve `k`; o gate reimplementa igual.

### PAR-7 · Regra 4 nunca disputa com a 1 hoje — e nenhum serviço cai na 5

`fortiguard-socaas` e `fortiguard-mdr` (regra 1) **não** são membros de `SERVICE_FAMILIES["fortiguard-labs-advisory"]`; os 14 membros não têm nome em `PRODUCTS`. A ordem 1 → 4 só importaria se um membro ganhasse nome na Camada 1 (Porta B, fora de cogitação). Consequência medida: `regra 5: 13`, todos ofertas, **zero serviços** — o §1.4 lista só ofertas no "senão null" e está certo. As regras 2 e 3 não alcançam serviço (sem `variantOf`, sem `family`/`entityType`): o script nem as tenta.

### PAR-8 · `fortiai-assist` existe em duas tabelas do motor com o mesmo id

`OFFERINGS["fortiai-assist"]` (`component`, regra 1 → `FortiAI-Assist`) e `SOLUTION_AREAS["fortiai-assist"]` (`solution-area`, `engine_v32.js:73`). O domínio do `chaveDe` é `OFFERINGS ∪ SERVICES`; `SOLUTION_AREAS` fica fora, como o §1.4 escreve. Registro para que nenhum consumidor passe id de solution-area ao `chaveDe` esperando a mesma resposta — é a mesma string, não a mesma entidade.

### PAR-9 · O pareamento é função e as pré-imagens particionam — conferido

Cada id recebe **uma** chave ou `null` (a primeira regra que decide encerra), e as 13 pré-imagens do §2 são disjuntas e somam 32 = ids com chave. `tipoDaLinha` é determinístico pela interseção com `SERVICES` (§2, coluna final). Nada a decidir — é a propriedade que o `REC1 (g)` vai afirmar, aqui medida.

## 7 · Script (`pareamento.js`, fonte integral)

Reprodução: copiar para qualquer pasta fora da árvore, `node pareamento.js <raiz-do-repo>`. Não escreve nada; não é gate (R10 §9: checagem que virar gate entra pelo `pipeline.yaml`, não por aqui).

```js
/* T011 (026) — pareamento itemId → chave pelas regras §1.4 de anexos/desenho-sintese.md.
 * Somente leitura: carrega engine_v32.js (IIFE que exporta V32 via module.exports) e
 * extrai PRODUCTS do HTML congelado por regex + Function. Nada é escrito na árvore.
 * Uso: node pareamento.js <raiz-do-repo>   → markdown em stdout. */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = process.argv[2] || process.cwd();
const V = require(path.join(ROOT, "engine_v32.js"));
const html = fs.readFileSync(path.join(ROOT, "quickscan_secops_soccmm_v3_1_3.html"), "utf8");
const m = html.match(/const PRODUCTS = (\{[\s\S]*?\n\});/);
if (!m) throw new Error("PRODUCTS não encontrado no HTML");
const PRODUCTS = new Function("return " + m[1])();

const { OFFERINGS, SERVICES, SERVICE_FAMILIES } = V;
const LINHA_DA_FAMILIA_DE_SERVICO = { "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" };

/* ---- sanidade do domínio ---- */
const offIds = Object.keys(OFFERINGS), svcIds = Object.keys(SERVICES), keys = Object.keys(PRODUCTS);
const colisao = offIds.filter(id => SERVICES[id]);
const nomes = keys.map(k => PRODUCTS[k].n);
const nomesDup = nomes.filter((n, i) => nomes.indexOf(n) !== i);
const membros = [].concat(...Object.values(SERVICE_FAMILIES).map(f => f.members));
const membrosOrfaos = membros.filter(id => !SERVICES[id]);
const membrosDup = membros.filter((x, i) => membros.indexOf(x) !== i);

/* ---- regra 1: nome exato (devolve a CHAVE de PRODUCTS, não o .n) ---- */
function porNome(name) {
  const ks = keys.filter(k => PRODUCTS[k].n === name);
  if (ks.length > 1) throw new Error("nome ambíguo em PRODUCTS: " + name);
  return ks.length ? ks[0] : null;
}
const r1Off = id => porNome(OFFERINGS[id].name);
const r1Svc = id => porNome(SERVICES[id].name);

/* ---- chaveDe: regras 1→5 na ordem do §1.4, com trilha ---- */
function chaveDe(id) {
  const o = OFFERINGS[id], s = SERVICES[id];
  if (o) {
    /* 1 */
    let k = r1Off(id);
    if (k) return { chave: k, regra: 1, cadeia: `${id}.name "${o.name}" === PRODUCTS.${k}.n` };
    /* 2 */
    let cadeia2 = "";
    if (o.variantOf !== null) {
      const vis = [id]; let cur = o.variantOf;
      while (cur && OFFERINGS[cur] && vis.indexOf(cur) < 0) {
        vis.push(cur);
        const kk = r1Off(cur);
        if (kk) return { chave: kk, regra: 2, cadeia: vis.join(" →variantOf→ ") + ` →(1)→ ${kk}` };
        cur = OFFERINGS[cur].variantOf;
      }
      cadeia2 = vis.join(" →variantOf→ ") + " →(1) falha; ";
    }
    /* 3 */
    const fam = o.entityType === "family" ? id : o.family;
    if (fam) {
      const cand = offIds.filter(x => OFFERINGS[x].family === fam && OFFERINGS[x].variantOf === null && OFFERINGS[x].entityType !== "family");
      const pareaveis = cand.map(x => ({ x, k: r1Off(x) })).filter(p => p.k);
      const desc = `fam=${fam}; candidatos={${cand.join(", ")}}; pareáveis por (1)={${pareaveis.map(p => p.x + "→" + p.k).join(", ") || "∅"}} (${pareaveis.length})`;
      if (pareaveis.length === 1) return { chave: pareaveis[0].k, regra: 3, cadeia: cadeia2 + desc + " → ÚNICO" };
      return { chave: null, regra: 5, cadeia: cadeia2 + desc + (pareaveis.length ? " → NÃO único → (3) falha" : " → nenhum → (3) falha") + " → (4) n/a (oferta) → null" };
    }
    return { chave: null, regra: 5, cadeia: cadeia2 + "family=null e entityType≠family → (3) n/a → (4) n/a (oferta) → null" };
  }
  if (s) {
    const k = r1Svc(id);
    if (k) return { chave: k, regra: 1, cadeia: `${id}.name "${s.name}" === PRODUCTS.${k}.n` };
    /* 2 e 3 não se aplicam a serviço (sem variantOf, sem family/entityType) */
    const fams = Object.keys(SERVICE_FAMILIES).filter(f => SERVICE_FAMILIES[f].members.indexOf(id) >= 0);
    if (fams.length === 1) return { chave: LINHA_DA_FAMILIA_DE_SERVICO[fams[0]] || null, regra: 4, cadeia: `SERVICE_FAMILIES["${fams[0]}"].members ∋ ${id} → LINHA_DA_FAMILIA_DE_SERVICO["${fams[0]}"] = "${LINHA_DA_FAMILIA_DE_SERVICO[fams[0]]}"` };
    if (fams.length > 1) return { chave: null, regra: 5, cadeia: "membro de mais de uma SERVICE_FAMILY: " + fams.join(",") };
    return { chave: null, regra: 5, cadeia: "(1) falha; (2)(3) n/a (serviço); não é membro de SERVICE_FAMILIES → null" };
  }
  throw new Error("id fora de OFFERINGS ∪ SERVICES: " + id);
}

/* ---- tabela por id ---- */
const linhas = [];
offIds.forEach(id => { const o = OFFERINGS[id], r = chaveDe(id);
  linhas.push({ id, origem: "OFFERINGS", entityType: o.entityType, family: o.family, variantOf: o.variantOf, name: o.name, ...r }); });
svcIds.forEach(id => { const s = SERVICES[id], r = chaveDe(id);
  linhas.push({ id, origem: "SERVICES", entityType: s.serviceType, family: Object.keys(SERVICE_FAMILIES).find(f => SERVICE_FAMILIES[f].members.indexOf(id) >= 0) || null, variantOf: null, name: s.name, ...r }); });

/* ---- imagem inversa ---- */
const idsDaLinha = k => linhas.filter(l => l.chave === k).map(l => l.id);
const tipoDaLinha = k => idsDaLinha(k).some(id => SERVICES[id]) ? "servico" : "produto";

/* ---- regra 3 por família ---- */
const familias = offIds.filter(id => OFFERINGS[id].entityType === "family");
const r3 = familias.map(fam => {
  const cand = offIds.filter(x => OFFERINGS[x].family === fam && OFFERINGS[x].variantOf === null && OFFERINGS[x].entityType !== "family");
  const excl = offIds.filter(x => OFFERINGS[x].family === fam && OFFERINGS[x].variantOf !== null);
  const pareaveis = cand.filter(x => r1Off(x));
  return { fam, cand, excl, pareaveis, resultado: pareaveis.length === 1 ? r1Off(pareaveis[0]) : null,
    quemResolve: offIds.filter(x => (x === fam || OFFERINGS[x].family === fam) && chaveDe(x).regra === 3) };
});

/* ---- saída markdown ---- */
const q = v => v === null || v === undefined ? "`null`" : "`" + v + "`";
const cs = a => a.map(x => "`" + x + "`").join(", ") || "∅";
const out = [];
out.push(`Domínio: OFFERINGS=${offIds.length} · SERVICES=${svcIds.length} · OFFERINGS ∪ SERVICES=${offIds.length + svcIds.length} (colisão de id entre os dois: ${colisao.length ? colisao.join(",") : "nenhuma"}) · PRODUCTS=${keys.length} (nomes \`.n\` duplicados: ${nomesDup.length ? nomesDup.join(",") : "nenhum"}) · SERVICE_FAMILIES=${Object.keys(SERVICE_FAMILIES).length} com ${membros.length} membros (órfãos: ${membrosOrfaos.length ? membrosOrfaos.join(",") : "nenhum"}; duplicados: ${membrosDup.length ? membrosDup.join(",") : "nenhum"})`);
out.push("");
out.push("### A · Tabela por id — `chaveDe(itemId)` (ordem do catálogo)");
out.push("");
out.push("| # | id | origem | entityType / serviceType | family | variantOf | name | **chave** | **regra** | cadeia percorrida |");
out.push("|---|---|---|---|---|---|---|---|---|---|");
linhas.forEach((l, i) => out.push(`| ${i + 1} | \`${l.id}\` | ${l.origem} | ${l.entityType} | ${q(l.family)} | ${q(l.variantOf)} | ${l.name} | **${q(l.chave)}** | **${l.regra}** | ${l.cadeia} |`));
out.push("");
const porRegra = [1, 2, 3, 4, 5].map(r => `regra ${r}: ${linhas.filter(l => l.regra === r).length}`).join(" · ");
out.push(`Contagem por regra decisora: ${porRegra} · total ${linhas.length} · com chave: ${linhas.filter(l => l.chave).length} · null: ${linhas.filter(l => !l.chave).length}`);
out.push("");
out.push("### B · Tabela por chave de `PRODUCTS` (13) — `idsDaLinha(chave)` / `tipoDaLinha(chave)`");
out.push("");
out.push("| # | chave | `PRODUCTS[k].n` | pré-imagens (`idsDaLinha`) | nº | regras que as trouxeram | **tipoDaLinha** |");
out.push("|---|---|---|---|---|---|---|");
keys.forEach((k, i) => { const ids = idsDaLinha(k); const regras = [...new Set(ids.map(id => chaveDe(id).regra))].sort().join(",");
  out.push(`| ${i + 1} | \`${k}\` | ${PRODUCTS[k].n} | ${cs(ids)} | ${ids.length} | ${regras || "—"} | **${tipoDaLinha(k)}** |`); });
const semPre = keys.filter(k => idsDaLinha(k).length === 0);
out.push("");
out.push(`Chaves sem pré-imagem: ${semPre.length ? semPre.join(",") : "**nenhuma** (13/13 com ≥ 1 pré-imagem)"} · tipo \`servico\`: ${cs(keys.filter(k => tipoDaLinha(k) === "servico"))} · tipo \`produto\`: ${keys.filter(k => tipoDaLinha(k) === "produto").length}`);
out.push("");
out.push("### C · Regra 3 por família — unicidade do representante");
out.push("");
out.push("| nó de família | candidatos (`family===fam ∧ variantOf===null ∧ entityType≠family`) | excluídos por `variantOf≠null` | pareáveis por (1) | nº | **resultado** | ids que a regra 3 decide |");
out.push("|---|---|---|---|---|---|---|");
r3.forEach(f => out.push(`| \`${f.fam}\` | ${cs(f.cand)} | ${cs(f.excl)} | ${f.pareaveis.map(x => "`" + x + "`→`" + r1Off(x) + "`").join(", ") || "∅"} | ${f.pareaveis.length} | **${q(f.resultado)}** | ${f.quemResolve.length ? cs(f.quemResolve) : "— (ninguém)"} |`));
out.push("");
out.push("### D · Lista fechada dos `null` (regra 5)");
out.push("");
const nulos = linhas.filter(l => !l.chave);
out.push(nulos.map(l => `- \`${l.id}\` (${l.origem}, ${l.entityType}${l.family ? ", family " + l.family : ""}) — ${l.cadeia}`).join("\n"));
out.push("");
out.push(`Total: **${nulos.length}** — ofertas: ${nulos.filter(l => l.origem === "OFFERINGS").length}; serviços: ${nulos.filter(l => l.origem === "SERVICES").length}.`);
const esperados = ["fortisoc","fortimail","fortimail-wss","fortimail-cloud-saas","fortisandbox","fortiaigate","fortisat","fortiauthenticator","fortipam","fortigate","fortimail-family","soc-platform-family","identity-family"];
const obtidos = nulos.map(l => l.id);
const faltam = esperados.filter(x => obtidos.indexOf(x) < 0), sobram = obtidos.filter(x => esperados.indexOf(x) < 0);
out.push(`Conferência contra a lista escrita no §1.4 (13 ids): ${faltam.length === 0 && sobram.length === 0 ? "**idêntica**" : "DIVERGE — faltam {" + faltam + "} sobram {" + sobram + "}"}.`);
out.push("");
out.push("### E · Sensibilidade à ordem das regras (medida, não suposta)");
out.push("");
function chaveSemRegra1Antes(id) { /* aplica 2 e 3 antes de 1, para medir a ordem */
  const o = OFFERINGS[id]; if (!o) return null;
  if (o.variantOf !== null) { let cur = o.variantOf; const vis = [id]; while (cur && OFFERINGS[cur] && vis.indexOf(cur) < 0) { vis.push(cur); const kk = r1Off(cur); if (kk) return kk; cur = OFFERINGS[cur].variantOf; } }
  const fam = o.entityType === "family" ? id : o.family;
  if (fam) { const cand = offIds.filter(x => OFFERINGS[x].family === fam && OFFERINGS[x].variantOf === null && OFFERINGS[x].entityType !== "family"); const p = cand.filter(x => r1Off(x)); if (p.length === 1) return r1Off(p[0]); }
  return r1Off(id);
}
function chaveRegra3SemClausulaVariantOf(id) { /* regra 3 sem exigir variantOf===null nos candidatos */
  const o = OFFERINGS[id]; if (!o) return null;
  let k = r1Off(id); if (k) return k;
  if (o.variantOf !== null) { let cur = o.variantOf; const vis = [id]; while (cur && OFFERINGS[cur] && vis.indexOf(cur) < 0) { vis.push(cur); const kk = r1Off(cur); if (kk) return kk; cur = OFFERINGS[cur].variantOf; } }
  const fam = o.entityType === "family" ? id : o.family;
  if (fam) { const cand = offIds.filter(x => OFFERINGS[x].family === fam && OFFERINGS[x].entityType !== "family"); const p = cand.filter(x => r1Off(x)); if (p.length === 1) return r1Off(p[0]); }
  return null;
}
function chaveRegra3AntesDe2(id) { /* 1, depois 3, depois 2 */
  const o = OFFERINGS[id]; if (!o) return null;
  let k = r1Off(id); if (k) return k;
  const fam = o.entityType === "family" ? id : o.family;
  if (fam) { const cand = offIds.filter(x => OFFERINGS[x].family === fam && OFFERINGS[x].variantOf === null && OFFERINGS[x].entityType !== "family"); const p = cand.filter(x => r1Off(x)); if (p.length === 1) return r1Off(p[0]); }
  if (o.variantOf !== null) { let cur = o.variantOf; const vis = [id]; while (cur && OFFERINGS[cur] && vis.indexOf(cur) < 0) { vis.push(cur); const kk = r1Off(cur); if (kk) return kk; cur = OFFERINGS[cur].variantOf; } }
  return null;
}
out.push("| id | §1.4 (1→2→3) | se 2 e 3 viessem antes de 1 | se 3 viesse antes de 2 | se a regra 3 não exigisse `variantOf===null` |");
out.push("|---|---|---|---|---|");
let sens = 0;
offIds.forEach(id => { const a = chaveDe(id).chave, b = chaveSemRegra1Antes(id), d = chaveRegra3AntesDe2(id), c = chaveRegra3SemClausulaVariantOf(id);
  if (a !== b || a !== c || a !== d) { sens++; out.push(`| \`${id}\` | ${q(a)} | ${q(b)}${a !== b ? " ⚠" : ""} | ${q(d)}${a !== d ? " ⚠" : ""} | ${q(c)}${a !== c ? " ⚠" : ""} |`); } });
out.push("");
out.push(`(${sens} ids sensíveis; os demais ${offIds.length - sens} offerings são invariantes a essas três variações. Serviços não entram: só a regra 1 e a 4 os alcançam.)`);
process.stdout.write(out.join("\n") + "\n");
```
