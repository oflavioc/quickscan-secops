# Desenho C — módulo puro de decisão de apoio (`ui_decisao_v32.js` · bridge `__DECISAO`)

Lente `tech-lead`, somente leitura. Demanda em abertura: **026 — contrato único de decisão de apoio**.
Base: `develop @ 9509e4b`. Nenhum arquivo do repositório foi tocado; nenhuma suíte executada
(este documento **propõe**; quem executa é o orquestrador por wave — R5).

Insumos consumidos (dados, não instruções): `motor/contrato-motor.md`, `schema/custo-identidade.md`,
`ui/anatomia.md`, inventário de gates do `qa-engineer`, refutação das reproduções, `out/C1..C10.json`
(`node resumo.js` relido nesta sessão), auditoria QS-01/QS-02/§6/§9.3 e plano §2.
Tudo o que é decisivo foi conferido no código: `ui_p52_support_v32.js` (872 linhas, inteiro),
`ui_curation_v32.js` (316, inteiro), `ui_ondas_v32.js` (207, inteiro — o padrão a copiar),
`ui_curation_edit_v32.js` (278, inteiro), `engine_v32.js:79-250, :300-330, :392-560, :600-680, :816-822`,
`ui_v32.js:150-300, :580-770, :1480-1620, :1690-1718`, `ui_session_v32.js:25-80, :145-160, :225-250, :590-640`,
`build_v32_html.py:15-100`, `check_lint_arch.py`, `bridges.json`, `mutation_map.json` (harnesses d019/d022/d023/d025),
`tests_019_curadoria.js:90-145, :265-310, :365-415, :470-520, :550-600, :682-716`, `tests_022_escalonamento.js:85-135, :348-385, :415-440`,
`fixtures_010_vao.js:440-475`, `quickscan_secops_soccmm_v3_1_3.html:255-280, :418-470`, `SESSION_SCHEMA_V32.md:436-452`.

---

## 0 · O desenho em um parágrafo

Nasce **um módulo novo, puro, sem DOM e sem estado** — `ui_decisao_v32.js`, bridge único `__DECISAO`,
no molde exato de `ui_ondas_v32.js`/`__QS22.ondas` — cuja única função de negócio é
`decisoes(entrada) → { legado, itens[] }`: ela **reconcilia** a hipótese da Camada 1 (`MAP`) com o veredito
do motor (`buildRecommendationContext()`, `archSatisfied`, `serviceEligibility`, `suppressedByPlatform`) e
devolve **um registro por item de apoio**, com identidade estável, ação, qualificador, variante, escopo,
origem e veto. A curadoria (`__CURATION`, dono do estado do operador) consome essa lista para dizer o que é
**ofertado** e aplica `include|exclude` + proveniência sobre ela, expondo o resultado em `contract().itens`.
A visão por produto (`__P53SOL`) consome `contract().itens` e só **desenha**; o papel continua **derivado dos
cards da tela** (princípio do `D019-PAR1`), agora copiando também qualificador, ação, variante, escopo,
condição e elegibilidade. O engine (`frozen`) e a Camada 1 (`frozen`) não recebem uma linha. O `EA-76`
fecha porque "o que o motor ofereceu" passa a ter **uma** implementação, testável direto no bridge com
fixtures literais — sem jsdom — e dois consumidores.

O que o desenho **não** faz: não cria chave nova na sessão (a chave curável continua sendo a linha de
produto da Camada 1 — rota (4) do `data-engineer`), não alarga `PRODUCTS` (Porta B), não reabre a errata
E2 da 022 além do que a auditoria pede (extensão contextual `fortixdr` entra; `contextual-support` e os
14 serviços de assessment ficam fora, declarados), e não transforma veto do motor em aviso de supressão da
curadoria (marcador próprio, nunca `[data-p53-suprimido]`).

---

## 1 · Shape do registro, onde nasce, quem consome

### 1.1 O módulo

```
ui_decisao_v32.js            dono: core-engineer · classe: produto (não frozen)
  IIFE + guarda dentro do bridge (como ui_ondas_v32.js:37)
  window.__DECISAO = { __installed: true, decisoes, entradaViva, PAREAR, VERSAO }
  zero document./window.* além do próprio bridge · zero innerHTML · zero escrita em V32.*
  injeção no builder: marcador V32_DECISAO_BEGIN/END, ANTES de V32_CURATION (consumidor)
  registro: bridges.json → "__DECISAO": { owner: "ui_decisao_v32.js", nota: "contrato único de decisão de apoio (026): decisoes(entrada) pura — sem I/O, sem DOM, sem estado; entradaViva() é o único coletor, somente leitura" }
```

`decisoes(entrada)` é **função pura de dado para dado**: recebe um objeto já colhido e devolve registros.
`entradaViva()` é o **único coletor** (R9 §8): lê `computeFindings()`, `MAP`, `PRODUCTS`, `V32.*` — e
**nunca escreve**. A separação existe para que (a) o gate de unidade rode com fixture literal, sem HTML,
e (b) o gate de pureza (`D026-PUR1`, precedente `D022-INV1`) prove por snapshot que nem a coleta nem a
decisão movem estado canônico.

### 1.2 `entrada` — dado, não função

```js
entrada = {
  legado:      boolean,                       // V32.isLegacyModeV32()
  suficiente:  boolean,                       // ENV.assessmentSufficient() via __P50SUFF/dataSufficiency (só informativo)
  findings:    [{ id, sev, lvl }],            // computeFindings().findings — Camada 1
  mapa:        MAP,                           // referência somente leitura (Camada 1)
  produtos:    PRODUCTS,                      // idem — chaves curáveis e nomes exibidos
  contextos:   {},                            // buildRecommendationContext().contexts  ({} em legado)
  catalogo:    { ofertas: V32.OFFERINGS, servicos: V32.SERVICES, capabilities: V32.CAPABILITIES, familiasServico: V32.SERVICE_FAMILIES },
  landscape:   { [capId]: presence },         // só a presença, para a regra UNSET ≠ NONE (D-6)
  supressao:   { caps: [capId], plataforma: "fortisoc" | "<product>" | null },   // suppressedByPlatform()
  arquitetura: { [offeringId]: "ok"|"violated"|"unknown" },   // archSatisfied(OFFERINGS[id].architectureRequires), só ids com architectureRequires
  elegibilidade: { [serviceId]: { eligible, reason } }       // serviceEligibility(sid) para TODO SERVICES
}
```

Tudo que o motor já calcula é passado **como calculou** (`notes`, `reason`, `variantResolution` literais).
Nenhum enum do engine é redigitado: `classification`/`supportMode` entram como strings do próprio `contexts`.

### 1.3 O registro de decisão (`item`)

| campo | tipo / enum | de onde vem | para quê |
|---|---|---|---|
| `chave` | chave de `PRODUCTS` \| `null` | pareamento §2.3 | **identidade curável** (sessão, `decide/set`, dedup). `null` = incurável (status quo dos sem-par) |
| `itemId` | id do motor (`fortiedr`, `fortiguard-mdr`, `endpoint-family`) \| chave Camada 1 quando só o MAP fala | candidato/serviço do motor; senão `cands[j].p` | **identidade estável** exibida em `data-p53-sol-item-id` (auditoria §6.4) |
| `tipo` | `oferta` \| `familia` \| `servico` | `itemKind`/`SERVICES` | forma do card e do rótulo de ação |
| `nome` | texto | `OFFERINGS[id].name` \| `SERVICES[id].name` \| `PRODUCTS[chave].n` | título do card (variante nomeada — C1/C6) |
| `linha` | texto \| `null` | `PRODUCTS[chave].n` | `data-p53-sol-produto` (contrato dos gates e da curadoria); subtítulo quando `nome ≠ linha` |
| `variante` | `{ de: itemId\|null, resolucao: texto\|null, variantes: [ids] }` | `variantOf`, `variantResolution`, `variants` | C1/C6/C10; "modalidade a definir" |
| `modo` | `motor` \| `hipotese` | §2.1 | o motor **decidiu** ou **se absteve** (Camada 1 como hipótese condicionada) |
| `acao` | `avaliar-aquisicao` \| `modalidade-a-definir` \| `estender-base` \| `servico` \| `conversa-por-sinal` \| `hipotese` \| (não publicáveis: `operacionalizar` \| `expandir-cobertura` \| `enablement` \| `avaliar-poc` \| `validar` \| `apoio-contextual` \| `operacionalizar-plataforma`) | tabela §2.2 | rótulo visível `.p53-sol-acao`; só o que é aquisição diz "aquisição" |
| `qualificador` | `prioritaria` \| `validacao` \| `null` | §2.2 | `data-p53-sol-tier` (mesmos valores de hoje; `TIER` preservado) |
| `origens` | `[{ via:"gap", qid, capId, sev, lvl } \| { via:"sinal", capId, sinais:[ids] } \| { via:"servico-gap", capId, serviceId } \| { via:"servico-sinal", capId, serviceId, sinais }]` | findings / candidates.signals / services.triggeredBy | proveniência mecânica (auditoria: "origem resposta/gap/sinal") |
| `capabilities` | `[{ capId\|null, qid\|null, texto }]` | `MAP[qid].cap` (gap) \| `CAPABILITIES[capId].name` (sinal/serviço) — **canônico**; `applyCopy` é da apresentação | `li[data-p53-sol-cap]`; `D019-SOL1` |
| `sinais` | `[signalId]` | união | `data-qs22-sinais` (a apresentação traduz com `sigPT`) |
| `escopo` | texto \| `null` | `scopeNote` do candidato (motor) \| `MAP…c[].sn` (hipótese) | `.p53-sol-escopo` tela + papel (QS-02) |
| `condicao` | `sem-contexto` \| `capability-nao-informada` \| `fora-do-catalogo-contextual` \| `null` | §2.1 | linha visível só em `modo:"hipotese"` — C8 "hipótese condicionada" |
| `elegibilidade` | `{ estado: elegivel\|inelegivel\|nao-avaliada, motivo }` | `services[].note` / `elegibilidade[sid].reason` | serviço: "validar deployment da base" vira `validacao` |
| `vetos` | `[{ tipo: arquitetura\|elegibilidade\|plataforma\|motor-contextual\|motor-validar\|motor-avaliacao\|motor-sem-candidato\|fora-do-escopo, motivo, capId }]` | §2.2 | por que a hipótese do MAP **não** virou card; vai ao `diag()`; nunca ao `[data-p53-suprimido]` |
| `notas` | `[texto]` | `contexts[cap].notes` literais | papel/diag |
| `publicavel` | boolean | `vetos.length === 0 && tipo publicável` | nasce card? |
| `curavel` | boolean | `chave !== null` | entra em `offered()`? |
| `classificacao`, `modoApoio` | strings do engine | `classification`, `supportMode` | só diagnóstico (nomes PT-BR para não colidir com `RESERVED_DERIVED`: `supportMode` é banido na sessão, `ui_session_v32.js:34-37`) |

Campos que **a curadoria acrescenta** (não o módulo puro): `publicado`, `supressao: "curadoria"|null`,
`proveniencia: "motor"|"operador"`. Nenhum campo do registro usa nome de `RESERVED_DERIVED`
(`offerings`, `services`, `findings`, `supportMode`, `commercial`…) — e nenhum registro é serializado
(INV-8; `S4-S5` continua medindo o export, que não muda).

### 1.4 Dono do estado e consumidores (R9 §5)

```
                     engine_v32.js (frozen)         Camada 1 (frozen)
                 buildRecommendationContext()     computeFindings()+MAP+PRODUCTS
                 archSatisfied/serviceEligibility/suppressedByPlatform
                              │                            │
                              └──────── entradaViva() ─────┘      ui_decisao_v32.js  (NOVO, core-engineer)
                                            │                     __DECISAO.decisoes(entrada) → { legado, itens[] }
                                            ▼                     PURO · sem estado · sem DOM
   ┌────────────────────────────── __CURATION (ui_curation_v32.js, core-engineer — DONO do estado do operador) ──┐
   │ ofertados() = itens.filter(publicavel && curavel).map(chave)          ← única derivação (fecha EA-76)        │
   │ decidir/publicados/escolhaDoOperador/validar/daSessao: INTACTOS (âncoras D019-M1/M2, D025-M2/M3/M5/M9/M23)  │
   │ contract().itens = itensDecididos()  (registro + publicado/supressao/proveniencia; + acréscimos do operador) │
   └───────────────┬──────────────────────────────────────────────┬─────────────────────────────────────────────┘
                   ▼                                              ▼
   __P53SOL (ui_p52_support_v32.js, ui-engineer)        __P53CUR (ui_curation_edit_v32.js, ui-engineer)
   cards ← contract().itens (ou __DECISAO direto se        offered()/catalog()/decide(): API inalterada
   __CURATION ausente); papelHTML() ← cards da tela        (zero linha; subtítulo de variante é opcional, W5b)
                   │
                   ▼
   buildPrintReport() (ui_v32.js:1566) ← __P53SOL.printHTML()   (inalterado)
```

- **Dono de estado**: continua sendo só `__CURATION` (decisões do operador). `__DECISAO` não tem estado
  (nem cache): recalcula a cada chamada, como `buildRecommendationContext()` (`ui_v32.js:272`).
- **Quem decide quem entra**: `__DECISAO` (regra), **uma** vez. Quem decide o que **publica**: `__CURATION`.
  Quem **desenha**: `__P53SOL`/`__P53CUR`. É a mesma tripartição `ondas() → ui_v32 → papel` da 022.
- `__P53SOL` perde `ofertaDoMotor()` (`:247-346`) e `acrescimos()` (`:570-583`) como derivações: passam a
  ser **leituras** de `contract().itens`. O comentário de `:729-731` ("a curadoria age aqui, e só aqui")
  continua verdadeiro — só que "aqui" vira o `publicado` que o dono do estado já aplicou.

---

## 2 · Regras de reconciliação MAP × motor

### 2.1 Princípio

> **O motor fala → a Camada 1 cala. O motor se abstém → a Camada 1 é hipótese condicionada.**
> Nada é inventado: presença/ausência de tecnologia só entra como o engine a leu.

`modo` por capability (`capId` = a capability cujo `questionIds` contém o `qid` do finding; único por
construção, `validateConfigV32 :697`):

| situação | `modo` | quem vale |
|---|---|---|
| `entrada.legado === true` (`contexts:{}`) | `hipotese`, `condicao:"sem-contexto"` | MAP inteiro, tier por `sev` — **decisão registrada** (023 E1; design-decisions "lista pode fazer sentido"; refutação C8). Zero veto: em legado `serviceEligibility` leria UNSET como ausência (INV-2) |
| `contexts[capId].classification === "CONTEXT_NOT_INFORMED"` e `capId ∉ supressao.caps` | `hipotese`, `condicao:"capability-nao-informada"` | MAP, tier por `sev`. Cobre as 3 capabilities `landscapeEnabled:false` (sempre `CONTEXT_NOT_INFORMED`) e toda fixture "só `saasAllowed:yes`" das suítes (G6/G9/G11/G15) — é o que mantém `offered()` não vazio nelas |
| `CONTEXT_NOT_INFORMED` e `capId ∈ supressao.caps` | **veto `plataforma`** (C3) | derivação da apresentação sobre dado público do engine (`suppressedByPlatform`, `:816`) — **decisão D-2 do proprietário** (a refutação a chama de "terceiro decisor"; o motor-contrato §6 a chama de "a mesma leitura do ramo NONE aplicada ao UNSET") |
| produto do MAP **sem relação** com `capId` no catálogo do motor (ex.: `automation` lv1 → `FortiXDR`, que só se relaciona a `endpoint-detection`) | `hipotese`, `condicao:"fora-do-catalogo-contextual"` | MAP — o motor não tem opinião sobre esse par |
| produto do MAP **sem par** no motor (`FortiGuard-Service-Bundle`) | `hipotese` (a condição da capability) | idem; serviços-membro do motor (`ir-training`, `ttx`…) seguem fora da visão por produto (E2, status quo) |
| qualquer outra classificação com contexto | `motor` | tabela §2.2 |

### 2.2 Tabela de derivação (uma linha = uma função pura do `contexts[capId]`)

| classification | supportMode | candidatos | registros publicáveis | `acao` | `qualificador` | o produto do MAP para esse `qid` |
|---|---|---|---|---|---|---|
| `TECHNOLOGY_WHITESPACE` | `DIRECT` | `offering` (`relation` primary/partial) | 1 por candidato, `modo:motor`, `escopo = scopeNote` | `avaliar-aquisicao` | `maturity.state === "gap-high"` → `prioritaria`; `gap-moderate` → `validacao` | **substituído** pelos candidatos pareados à mesma `chave`; se o par do MAP é um `offeringId` com `arquitetura[id] === "violated"` → registro não publicável, `vetos:[{arquitetura, motivo:"architectureRequires não satisfeito: …"}]` (C1: `fortiendpoint` vetado, `fortiedr` publicado) |
| `TECHNOLOGY_WHITESPACE` | `DIRECT` | `family` | 1, `tipo:familia`, `variante.resolucao`, `variante.variantes` | `modalidade-a-definir` | `validacao` (sempre) | substituído (G8/G12/G14: `endpoint-family` → chave `FortiEndpoint`, card "Fortinet Endpoint Security — oferta a definir") |
| `TECHNOLOGY_WHITESPACE` | `CONTEXTUAL` + nota "coberta pela plataforma" | `[]` | nenhum | `operacionalizar-plataforma` (não publicável) | — | veto `plataforma` |
| `TECHNOLOGY_WHITESPACE` | `CONTEXTUAL` só `contextual-support` | `contextual-support` | nenhum (E2) | `apoio-contextual` (não publicável) | — | veto `motor-contextual` |
| `OPERATIONAL_GAP` | `CONTEXTUAL` | `[]` / `contextual-extension` / `contextual-support` | só o `contextual-extension` (`fortixdr`), `escopo = scopeNote` ("extensão de correlação… nunca nova aquisição standalone (M50)") | `estender-base` | `validacao` (nunca `prioritaria`) | veto `motor-contextual`, motivo = `notes[0]` ("tecnologia operacional — apoio em operacionalização (nunca substituição)") — **C2/C4: sem card de aquisição** (decisão §2.4) |
| `COVERAGE_GAP` / `ADOPTION_GAP` | `CONTEXTUAL` | idem | idem | `estender-base` | `validacao` | veto `motor-contextual` (`expandir-cobertura` / `enablement` só no diag) |
| `EVALUATION_IN_PROGRESS` | `CONTEXTUAL` | `[]` | nenhum | `avaliar-poc` | — | veto `motor-avaliacao` |
| `TECH_STATUS_UNVERIFIED` / `NEEDS_VALIDATION` / `POSSIBLE_CONTEXT_DIVERGENCE` | `VALIDATE` | `[]` | nenhum | `validar` | — | veto `motor-validar` (inclui gap+NONE sob gate fechado: `flags.insufficientEvidence` — INV-3 pela apresentação) |
| `UNASSESSED_CAPABILITY` | `CONTEXTUAL` | `offering` com `relation:"contextual-by-signal"` | 1 por candidato, `origens:[{via:sinal}]` | `conversa-por-sinal` | `validacao` | não há `qid` (C9 — igual a hoje, agora por `relation`, não por `signals.length`) |
| `UNASSESSED_CAPABILITY` | `CONTEXTUAL` + nota M62 / `INVENTORY` | `[]` | nenhum | — | — | — |
| `MATURE_*` / `TECH_TRANSITION` / `null` | `NONE` | `[]` | nenhum | — | — | não há finding (sev 0 ⇒ sem `c[]` no MAP) |
| qualquer (inclusive `LEGACY-LABELLED`, contrato §2) | qualquer | `services[]` | 1 por serviço **com par na Camada 1** (`fortiguard-socaas`→`SOCaaS`, `fortiguard-mdr`→`FortiGuard-MDR-Service`), `elegibilidade` de `note` | `servico` | `triggeredBy:["capability-gap"]` → por `maturity.state`; por sinal → `validacao`; `note` "elegível — validar deployment da base" → `validacao` | produto-serviço do MAP: publicado se o par está em `services[]`; senão `elegibilidade[sid].eligible === false` → veto `elegibilidade` (C7 MDR: "base declarada apenas em deployments não elegíveis (on-prem/air-gapped) — OG oficial"); elegível e não disparado → veto `motor-sem-candidato`. **Exceção D-6**: `reason` "base requerida ausente…" com `landscape["endpoint-detection"] === "UNSET"` ⇒ abstenção (INV-2: não declarado ≠ ausente) ⇒ `hipotese` |

Regra de ouro derivada da tabela: **`qualificador:"prioritaria"` só nasce de `modo:"motor"` com `acao` ∈
{`avaliar-aquisicao`, `servico`} e `gap-high`, ou de `modo:"hipotese"` com `sev 2`** — e neste último caso o
card carrega a `condicao` visível. Extensão contextual, família a definir, conversa por sinal e serviço
"validar deployment" são `validacao` por construção.

### 2.3 Pareamento de identidade — `PAREAR(itemId) → chave | null` (critério, não lista — R12)

```
1. nome exato:        OFFERINGS[id].name === PRODUCTS[k].n  ou  SERVICES[id].name === PRODUCTS[k].n
                      (9 ofertas + 2 serviços; inclui ndr-family → "FortiNDR", fortixdr → "FortiXDR")
2. cadeia variantOf:  id → OFFERINGS[id].variantOf → … até (1)          (fortisiem-cloud → fortisiem → "FortiSIEM";
                                                                           fortindr-onprem/-cloud → ndr-family → "FortiNDR")
3. representante da família: entre OFFERINGS com family === OFFERINGS[id].family, entityType === "offering"
                      e variantOf === null, o que casa por (1)            (fortiedr → fortiendpoint → "FortiEndpoint";
                                                                           forticlient idem — nunca candidato)
4. senão null (incurável; publicável só se o motor o produziu: fortimail*, fortiaigate, fortipam… — status quo de :139/:142)
```

A direção inversa (`chave → ids do motor`, usada para ler o veredito do motor sobre um produto do MAP) é a
imagem inversa de `PAREAR` — calculada uma vez por chamada, nunca tabela. Propriedades que o gate `D026-ID1`
afirma: `PAREAR` é total sobre `OFFERINGS ∪ SERVICES`; toda chave de `PRODUCTS` exceto
`FortiGuard-Service-Bundle` tem ≥ 1 pré-imagem (a exceção é **declarada** no gate, não silenciosa).

**Deduplicação**: a chave de união é `chave || itemId` — **nunca o nome exibido** (raiz de C6 e do colapso
FortiEDR→FortiEndpoint em `:321-327`). Ao unir: `capabilities`, `sinais`, `origens`, `vetos` são unidos;
`modo:"motor"` absorve `hipotese`; entre dois `motor` publicáveis o `qualificador` menor vence (`prioritaria`);
`nome` e `itemId` são os do registro `motor` com `variante.de === null` quando existir (C10: `fortisiem` e
`fortisiem-cloud` → um card "FortiSIEM", `variante.variantes:["fortisiem","fortisiem-cloud"]`), senão o do
único resolvido (C6: `fortindr-onprem` → nome "FortiNDR (On-Premises)", linha "FortiNDR").

### 2.4 Os casos, um a um

| caso | regra aplicada | resultado |
|---|---|---|
| **C1** (`saasAllowed:no`, `localProcessingRequired:yes`, endpoint NONE) | `DIRECT` → candidato `fortiedr`; MAP `FortiEndpoint` → pré-imagem `fortiendpoint`, `arquitetura.fortiendpoint === "violated"` → veto `arquitetura` | **um** card: `linha FortiEndpoint`, `nome FortiEDR`, `itemId fortiedr`, `acao avaliar-aquisicao`, `prioritaria`. Excluir `"FortiEndpoint"` na curadoria retira o card FortiEDR (supressão sobrevive) |
| **C2/C4** (EDR/SIEM de terceiro em produção, `OPERATIONAL_GAP`) | veto `motor-contextual`; nenhum candidato → **nenhum card** | Decisão: **sem card de aquisição** — e não "card operacionalizar sem prioridade". Justificativa: (i) um card "FortiEndpoint — operacionalizar" sobre um CrowdStrike em produção afirmaria relação com produto que o cliente não tem; (ii) a leitura "operacionalizar o existente" **já existe** na superfície certa, o card de capability em `#v32support`/`pr-support` (medido na refutação: "operacionaliza" 3× no papel); (iii) `hasSubstituteV32` continua verdadeiro por `porCapability` (card CONTEXTUAL com notas), logo a arbitragem da 010 não muda; (iv) é o que a spec 010 `:461-462` manda ("sob contexto declarado a autoridade é o engine"). O veto fica no `diag()` e no registro, para a demanda futura que quiser uma "linha de vetos" (D-5) |
| **C3** (FortiSOC só em `soc-platform`, `automation` lv0) | `CONTEXT_NOT_INFORMED` + `supressao.caps ∋ security-automation` → veto `plataforma` (D-2) | **nenhum card** FortiSOAR; registro `acao operacionalizar-plataforma`, `vetos:[{plataforma, motivo:"capability coberta pela plataforma unificada declarada (fortisoc)"}]`. Se o proprietário recusar D-2, C3 vira `hipotese`+`condicao` (card com linha "capability não informada") e C3b (FortiSOC declarado na própria capability, `OPERATIONAL_GAP`+M75) é o caso certo, coberto pela linha `OPERATIONAL_GAP` |
| **C5** (legado, 9 cards) | `hipotese`/`sem-contexto` em tudo | mesmos 9 cards, mesmos tiers (7/2); **papel passa a trazer** o qualificador, a `condicao` ("contexto tecnológico não informado nesta sessão") e o escopo do `MAP…sn` ("cobre a camada de endpoint…") para FortiEndpoint — tela e papel iguais por construção |
| **C6** (NDR, `saas:no`) | `DIRECT` → `fortindr-onprem`; `PAREAR` → `FortiNDR` (passo 2) | card `linha FortiNDR`, **`nome "FortiNDR (On-Premises)"`**, `itemId fortindr-onprem`, `prioritaria`. Fica declarado que isso **reabre a E2 da 022 só para variante do mesmo produto** (D-3): não é produto novo na seção — é o nome certo do mesmo |
| **C7** (FortiEDR on-prem, monitoring/team lv0, endpoint lv1) | `soc-staffing`/`continuous-monitoring`: `services[]` ∋ `fortiguard-socaas` → SOCaaS `servico`, `prioritaria` (gap-high); MDR ausente de `services[]`, `elegibilidade["fortiguard-mdr"].eligible === false` com base **declarada** → veto `elegibilidade`; `endpoint-detection OPERATIONAL_GAP` + `fortixdr contextual-extension` → card FortiXDR `estender-base`, `validacao`, escopo M50; MAP `FortiEndpoint` (endpoint lv1) → veto `motor-contextual` | 2 cards: **FortiGuard SOCaaS** (prioritária, serviço, por gap de 2 capabilities) e **FortiXDR** (após validação, estender base instalada). MDR e FortiEndpoint fora, com motivo no registro |
| **C8** (legado, endpoint lv0) | `hipotese`/`sem-contexto` | card FortiEndpoint `prioritaria` **com** `condicao` visível e no papel — hipótese condicionada, sem inventar presença/ausência (023 E1 preservada; `D019-SOL3 (b)`/(c) e `D025` fixtures intactos) |
| **C9** (sinal `dataLeakageConcern`, DLP NONE) | `contextual-by-signal` em `insider-risk` e `data-loss-prevention` → união por `chave FortiDLP` | card FortiDLP, `conversa-por-sinal`, `validacao`, `origens` 2× sinal, `capabilities` 2 — igual a hoje, origem preservada (`D022-PROD1` intacto) |
| **C10** (`saas:yes`, logs+endpoint NONE) | `DIRECT` em ambas | FortiAnalyzer, FortiSIEM (`variantes` fortisiem+fortisiem-cloud), FortiEndpoint — todos `prioritaria`, `modo motor`. Igual à tela de hoje, agora com `acao`/`itemId` |
| **curadoria — produto retirado não volta** | `publicado = decidir(chave) !== "exclude"`; o cálculo do motor é insensível ao estado (D019-MED1) | exclude sobre a **linha** vale para qualquer variante que o motor resolva (C1) — propriedade da rota (4) |
| **curadoria — acréscimo humano** | `include && !ofertado` → registro `modo:"operador"`, `proveniencia:"operador"`, `acao:null`, `qualificador:null`, `capabilities:[]` | marcador `[data-p53-prov="operador"]` em tela e papel (hoje: `:424-425`, `:819-820`; `D019-PROV1`/`D019-M4` continuam o carrasco). Inclusão sobre produto que o motor agora **veta** vira escolha do operador e leva o selo — residual honesto da 025 (uma linha no relatório, não código) |
| **identidade** | chave estável = `chave`/`itemId`; nome nunca é chave de união | `data-p53-sol-produto` = linha (contrato antigo, intacto); `data-p53-sol-item-id` = id do motor (contrato novo); `data-p53-sol-variante` = nome quando ≠ linha |

### 2.5 Pseudo-código de `decisoes(entrada)`

```js
function decisoes(entrada) {
  var e = entrada || {}, itens = {}, ordem = [];
  var legado = e.legado === true, ctxs = e.contextos || {};
  var capDoQid = indiceCapPorQuestao(e.catalogo.capabilities);     // qid -> capId
  var preImagem = inversaDePAREAR(e.catalogo, e.produtos);         // chave -> [ids do motor]

  function reg(chave, itemId, base) {                              // união por chave||itemId, ordem de 1ª aparição
    var k = chave || itemId, r = itens[k];
    if (!r) { r = itens[k] = Object.assign({ chave, itemId, origens:[], capabilities:[], sinais:[], vetos:[], notas:[],
                                            modo:null, acao:null, qualificador:null, escopo:null, condicao:null,
                                            variante:{ de:null, resolucao:null, variantes:[] },
                                            elegibilidade:{ estado:"nao-avaliada", motivo:null } }, base); ordem.push(k); }
    return r;
  }
  function unir(r, patch) { /* capabilities/sinais/origens/vetos/notas unidos; motor absorve hipotese;
                               qualificador menor vence entre motor publicáveis; nome/itemId do principal (variante.de === null) */ }

  /* 1 · HIPÓTESE DA CAMADA 1 — findings × MAP, exatamente o laço de ui_curation_v32.js:101-109 */
  (e.findings || []).forEach(function (f) {
    var m = e.mapa[f.id]; if (!m || !m.lv || !m.lv[f.lvl]) return;
    var capId = capDoQid[f.id] || null, ctx = capId ? ctxs[capId] : null;
    (m.lv[f.lvl].c || []).forEach(function (c) {
      var p = e.produtos[c.p]; if (!p) return;
      var base = { tipo: ehServico(c.p) ? "servico" : "oferta", nome: p.n, linha: p.n,
                   escopo: c.sn || null, qualificador: f.sev === 2 ? "prioritaria" : "validacao" };
      var r = reg(c.p, c.p, base);
      r.origens.push({ via:"gap", qid:f.id, capId:capId, sev:f.sev, lvl:f.lvl });
      r.capabilities.push({ capId:capId, qid:f.id, texto:m.cap });
      var veredito = veredictoDoMotor(c.p, capId, ctx, legado, e);     // §2.1/§2.2 → {modo, condicao, vetos, acao}
      unir(r, veredito);
    });
  });

  /* 2 · A VOZ DO MOTOR — candidatos e serviços dos contexts (vazio em legado) */
  Object.keys(ctxs).forEach(function (capId) {
    var ctx = ctxs[capId], estado = (ctx.maturity || {}).state;
    (ctx.candidates || []).forEach(function (cd) {
      var fam = linhaDeCandidato(cd, e);           // {chave, itemId, nome, linha, tipo, variante} via PAREAR
      if (cd.itemKind === "offering" && cd.relation !== "contextual-by-signal" && ctx.supportMode === "DIRECT")
        unir(reg(fam.chave, fam.itemId, fam), { modo:"motor", acao:"avaliar-aquisicao", escopo: cd.scopeNote || null,
             qualificador: estado === "gap-high" ? "prioritaria" : "validacao",
             origens:[{ via:"gap", capId, qid:null, sev:null, lvl:null }], capabilities:[{ capId, qid:null, texto:e.catalogo.capabilities[capId].name }] });
      else if (cd.itemKind === "family")
        unir(reg(fam.chave, fam.itemId, fam), { modo:"motor", tipo:"familia", acao:"modalidade-a-definir", qualificador:"validacao",
             variante:{ de:null, resolucao:cd.variantResolution, variantes:cd.variants || [] }, … });
      else if (cd.itemKind === "contextual-extension")
        unir(reg(fam.chave, fam.itemId, fam), { modo:"motor", acao:"estender-base", qualificador:"validacao", escopo: cd.scopeNote, … });
      else if (cd.relation === "contextual-by-signal")
        unir(reg(fam.chave, fam.itemId, fam), { modo:"motor", acao:"conversa-por-sinal", qualificador:"validacao",
             sinais: cd.signals, origens:[{ via:"sinal", capId, sinais:cd.signals }], … });
      else /* contextual-support */
        unir(reg(fam.chave, fam.itemId, fam), { modo:"motor", acao:"apoio-contextual",
             vetos:[{ tipo:"fora-do-escopo", motivo:"apoio contextual via relação de suporte — fora da visão por produto (022 E2)", capId }] });
    });
    (ctx.services || []).forEach(function (s) {
      var fam = linhaDeServico(s.serviceId, e); if (!fam.chave) return;   // sem par na Camada 1: fora (E2)
      var porGap = (s.triggeredBy || []).indexOf("capability-gap") >= 0;
      unir(reg(fam.chave, fam.itemId, fam), { modo:"motor", tipo:"servico", acao:"servico",
           elegibilidade:{ estado:"elegivel", motivo:s.note },
           qualificador: (!porGap || /validar/i.test(s.note || "")) ? "validacao" : (estado === "gap-high" ? "prioritaria" : "validacao"),
           origens:[ porGap ? { via:"servico-gap", capId, serviceId:s.serviceId } : { via:"servico-sinal", capId, serviceId:s.serviceId, sinais:s.triggeredBy } ],
           capabilities:[{ capId, qid:null, texto:e.catalogo.capabilities[capId].name }], notas: ctx.notes || [] });
    });
  });

  /* 3 · FECHO */
  return { legado: legado, itens: ordem.map(function (k) {
    var r = itens[k];
    r.publicavel = !r.vetos.length && ["oferta","familia","servico"].indexOf(r.tipo) >= 0 && r.acao !== "apoio-contextual";
    r.curavel = r.chave !== null;
    return r; }) };
}

/* veredictoDoMotor(chaveMAP, capId, ctx, legado, e) — a tabela §2.1/§2.2 sobre UM produto do MAP */
function veredictoDoMotor(chave, capId, ctx, legado, e) {
  if (legado || !capId || !ctx) return { modo:"hipotese", condicao:"sem-contexto", acao:"hipotese" };
  if (ctx.classification === "CONTEXT_NOT_INFORMED") {
    if (e.supressao.caps.indexOf(capId) >= 0)
      return { modo:"motor", acao:"operacionalizar-plataforma", vetos:[{ tipo:"plataforma", capId,
               motivo:"capability coberta pela plataforma unificada declarada (" + e.supressao.plataforma + ") — foco em operacionalização, não em nova aquisição" }] };
    /* serviço do MAP: o engine fala por services[] mesmo em LEGACY-LABELLED (contrato §2) */
    var sid = servicoPareado(chave, e); if (sid) return veredictoDeServico(sid, capId, ctx, e);
    return { modo:"hipotese", condicao:"capability-nao-informada", acao:"hipotese" };
  }
  var ids = preImagem[chave] || [];
  var relacionados = ids.filter(function (id) { return temRelacao(id, capId, e.catalogo); });
  if (!relacionados.length) return { modo:"hipotese", condicao:"fora-do-catalogo-contextual", acao:"hipotese" };
  var sid2 = servicoPareado(chave, e); if (sid2) return veredictoDeServico(sid2, capId, ctx, e);
  switch (ctx.supportMode) {
    case "DIRECT": {
      var presente = (ctx.candidates || []).some(function (c) { return relacionados.indexOf(c.itemId) >= 0 || (c.variants || []).some(v => relacionados.indexOf(v) >= 0); });
      if (presente) return { modo:"motor" };                                   // o card nasce do candidato (passo 2)
      var violado = relacionados.filter(function (id) { return e.arquitetura[id] === "violated"; });
      return { modo:"motor", vetos:[ violado.length
        ? { tipo:"arquitetura", capId, motivo:"architectureRequires não satisfeito para " + violado.join(", ") }
        : { tipo:"motor-sem-candidato", capId, motivo:"o motor não resolveu esta oferta como candidata" } ] };
    }
    case "CONTEXTUAL": return { modo:"motor", vetos:[{ tipo: ctx.classification === "EVALUATION_IN_PROGRESS" ? "motor-avaliacao"
                                 : ((ctx.notes||[]).some(n => /plataforma unificada/.test(n)) ? "plataforma" : "motor-contextual"),
                                 capId, motivo:(ctx.notes || [])[0] || ctx.classification }] };
    case "VALIDATE":   return { modo:"motor", vetos:[{ tipo:"motor-validar", capId, motivo: ctx.flags && ctx.flags.insufficientEvidence
                                 ? "evidência insuficiente — gate de suficiência fechado" : ctx.classification }] };
    default:           return { modo:"motor", vetos:[{ tipo:"motor-sem-candidato", capId, motivo: ctx.classification || "sem gap" }] };
  }
}
function veredictoDeServico(sid, capId, ctx, e) {
  if ((ctx.services || []).some(function (s) { return s.serviceId === sid; })) return { modo:"motor" };   // nasce no passo 2
  var el = e.elegibilidade[sid] || { eligible:true, reason:"" };
  if (!el.eligible) {
    if (/^base requerida ausente/.test(el.reason) && e.landscape["endpoint-detection"] === "UNSET")        /* D-6: UNSET ≠ NONE */
      return { modo:"hipotese", condicao:"capability-nao-informada", acao:"hipotese" };
    return { modo:"motor", vetos:[{ tipo:"elegibilidade", capId, motivo: el.reason }] };
  }
  return { modo:"motor", vetos:[{ tipo:"motor-sem-candidato", capId, motivo:"serviço elegível sem gatilho nesta capability" }] };
}
```

`entradaViva()` (mesmo arquivo, ~35 linhas): só leituras, sob `typeof`; devolve `null` quando
`computeFindings`/`MAP`/`PRODUCTS`/`V32` faltam — e quem chama **nomeia** a ausência no console (R10 §2),
nunca inventa oferta.

---

## 3 · O papel — o que o `pr-card` passa a carregar

Princípio intacto: `papelHTML()` (`ui_p52_support_v32.js:794-834`) **lê os cards da tela** e copia. O que
muda é a lista do que copia. Hoje omite o único `data-*` que importa (`data-p53-sol-tier`) e o escopo —
medido C1–C7 `tierAttr=null`, C5 sem "Escopo".

| no card da tela (novo/alterado) | no `pr-card` (copiado) | texto visível (tabela `ROTULOS` em `ui_p52_support_v32.js`, nunca no módulo puro) |
|---|---|---|
| `data-p53-sol-produto` = **linha** (inalterado) | idem | `<b>` = **`nome`** (variante quando resolvida) + `.pr-mut.p53-pr-linha` "linha de produto: FortiEndpoint" quando `nome ≠ linha` |
| `data-p53-sol-item-id` = `itemId` | idem | — |
| `data-p53-sol-variante` = `nome` quando ≠ linha; `data-p53-sol-variantes` = ids unidos | idem | `.p53-pr-variante` "modalidade/variante: FortiNDR (On-Premises)" ou "oferta a definir no aprofundamento (FortiEndpoint · FortiEDR)" |
| `data-p53-sol-tier` (já existe) + `.p53-sol-tierlabel` (já existe) | **`data-p53-sol-tier` + `.pr-mut.p53-pr-tier`** com o mesmo texto ("indicação prioritária" / "após validação") | corrige C5/QS-02; mutante `D026-M5` remove só no papel |
| `data-p53-acao` + `.p53-sol-acao` | idem + `.p53-pr-acao` | "avaliar aquisição" · "modalidade a definir" · "estender a base instalada" · "serviço gerenciado" · "conversa por sinal declarado" · "hipótese da avaliação" |
| `data-p53-modo` + `.p53-sol-condicao` (só `hipotese`) | idem + `.p53-pr-condicao` | "Hipótese da avaliação — contexto tecnológico não informado nesta sessão; validar aderência antes de qualquer recomendação." / "…contexto desta capability não informado…" / "…fora do catálogo contextual do motor para esta capability…" |
| `data-p53-origem` = `gap` \| `sinal` \| `gap+sinal` \| `servico` | idem | já existe para sinal ("habilitado por sinal declarado: …", `:815`); gap fica implícito nas capabilities |
| `.scope.p53-sol-escopo` dentro do `.prod` (hoje só chega quando o `.prod` legado é movido) | `.pr-mut.p53-pr-escopo` | "Escopo: camada endpoint" / "Escopo: cobre a camada de endpoint; demais componentes podem permanecer em plataformas especializadas" |
| `data-p53-elig` + `.p53-sol-elig` (serviço) | `.p53-pr-elig` | "Elegibilidade técnica: validar deployment da base" (só quando `estado:"elegivel"` com ressalva) |
| `[data-p53-prov="operador"]` (inalterado) | inalterado (`:819-820`, âncora `D019-M4`) | `PROV_TXT` inalterado |
| `[data-p53-suprimido]` (inalterado — só curadoria) | inalterado (`:801`, âncora `D023-M6`) | contagem = itens curáveis excluídos; **vetos do motor não entram** (`D025-AUS1 (b)`/`NEW1`: aviso `null` sem curadoria) |

Nada do papel recalcula decisão. CSS: só classes `p53-*` novas em `ui_p52_support_v32.css` (R9 §6); no papel
reaproveita `.pr-mut`. Os literais novos entram em `ROTULOS` de `ui_p52_support_v32.js`; se o `P52_COPY`
(`ui_p52_workspace_v32.js:128-236`) quiser reescrevê-los, é decisão do `ui-engineer` — nenhum literal visível
atual muda (lição "copy de apresentação cega gate").

---

## 4 · Arquivos, linhas, waves, gates

### 4.1 Arquivos tocados (estimativa de linhas)

| arquivo | dono | mudança | linhas |
|---|---|---|---|
| `ui_decisao_v32.js` **(novo)** | core-engineer | IIFE, `__DECISAO = { __installed, decisoes, entradaViva, PAREAR, VERSAO }`, pseudo-código §2.5 + cabeçalho de desenho no padrão da casa | ~380 (código ~220) |
| `ui_curation_v32.js` | core-engineer | `ofertados()` `:93-152` → 18 linhas (`__DECISAO.decisoes(__DECISAO.entradaViva())`, filtro `publicavel && curavel`, `chave` dedup; ausência do bridge → `[]` + `console.error`); nova `itensDecididos()` após `:193` (~35); `contract()` `:306-314` + `itens` (1). **Zero linha** em `valido`/`decidir`/`publicados`/`validar`/`daSessao`/`paraSessao` (âncoras `:157`, `:164`, `:219`, `:227`, `:254-257` intactas) | −60 / +55 |
| `ui_p52_support_v32.js` | ui-engineer | remove `ofertaDoMotor()` `:247-346` e a tradução por nome; nova `itensParaCards()` (~30: lê `curadoria().contract().itens` ou `__DECISAO` direto; mapeia `qualificador` → `p.tier` 1/2 para manter `"data-p53-sol-tier": TIER[p.tier] \|\| TIER[2]` `:394`); `cardDoProduto` `:383-472` +30 (atributos/linhas novas, título = `nome`, subtítulo linha, `corpoDoCatalogo(chave, nome, itemId)` com ícone `ICONS_V32[ICON_MAP_V32[itemId]]` sob `typeof` e `url` de `OFFERINGS[itemId]` quando variante); `acrescimos()` `:570-583` passa a ler `itens` com `proveniencia:"operador"` (−8); `decorar()` `:721-735` troca `ofertaDoMotor()`/`decisaoDe()` por `item.publicado` (−6/+6); `papelHTML()` `:794-834` +22; `ROTULOS` +18 | −130 / +140 |
| `ui_p52_support_v32.css` | ui-engineer | `.p53-sol-acao`, `.p53-sol-condicao`, `.p53-sol-escopo`, `.p53-sol-elig`, `.p53-sol-linha`, `.p53-sol-variante` — sem hex, tokens existentes | +35 |
| `build_v32_html.py` | build-engineer | `DECJS = HERE / "ui_decisao_v32.js"` após `:22`; leitura; marcador `/* V32_DECISAO_BEGIN */…END` imediatamente antes de `V32_CURATION_BEGIN` em `:81-83` | +4 |
| `.claude/verify/bridges.json` | build-engineer | entrada `__DECISAO` | +4 |
| `.claude/verify/pins.json` | build-engineer (`gen_pins.py`, mesmo PR, motivo no commit) | 4 módulos + builder + html gerado + suítes | gerado |
| `quickscan_secops_soccmm_v3_2_dev.html` | gerado pelo builder (classe `generated`) | — | gerado |
| `tests_026_decisao.js` **(novo)** | qa-engineer | gates §4.4 (unidade sobre `__DECISAO` com fixtures literais + jsdom para tela/papel) | ~450 |
| `tests_026_mutants.js` **(novo)** | qa-engineer | 7 mutantes §4.4, runner no padrão `tests_022_mutants.js` (HTML efêmero, `D026_HTML_OVERRIDE`) | ~260 |
| `tests_019_mutants.js` | qa-engineer | reancorar `D019-M5` (`:733` muda) e `D019-M15` (`:721` muda) | ~6 |
| `tests_022_mutants.js` | qa-engineer | reancorar `D022-M10` (`:330` some) → união de capabilities em `ui_decisao_v32.js` | ~4 |
| `.claude/verify/expected_suites.json` | qa-engineer | chave `d026` (contagem medida); `d019`/`d022`/`d023`/`d025` inalteradas | +5 |
| `.claude/verify/mutation_map.json` | qa-engineer | harness `d026` (targets: `ui_decisao_v32.js`, `ui_curation_v32.js`, `ui_p52_support_v32.js`, `tests_026_*.js`, `build_v32_html.py`); acrescentar `ui_decisao_v32.js` aos `targets` de `d019` (`:404-405`), `d022` (`:448-449`), `d023` | +30 |
| `.claude/BACKLOG.md` | doc-writer | `EA-76` → `resolvido` (026); candidatas novas: lacuna `classify`×`suppressedByPlatform` em `CONTEXT_NOT_INFORMED` (Porta B futura), `exclude` obsoleto sem sujeito (`ui_curation_v32.js:170-179`), serviços sem par na Camada 1 | doc |
| `CONTEXT.md` | product-owner | verbetes **Registro de decisão de apoio**, **Hipótese condicionada**, **Veto do motor** (critério, não lista) | doc |
| `SESSION_SCHEMA_V32.md` | — | **zero** (opcional: uma frase em §9 dizendo que a chave curável é a linha de produto) | 0 |
| `ui_curation_edit_v32.js`, `ui_v32.js`, `ui_session_v32.js`, `engine_v32.js`, Camada 1 | — | **zero** | 0 |

Orçamento R9 §7: `ui_decisao_v32.js` ≤ 600; `ui_p52_support_v32.js` fica ~880 (já acima de 600 — legado
documentado da 019; a 026 **reduz** derivação ali, não a aumenta: justificativa a registrar no `plan.md`).

### 4.2 Waves (um módulo por delegação; dependência real dita a ordem)

| wave | agente | módulo/artefato | depende de |
|---|---|---|---|
| W0 | product-owner + tech-lead | `specs/026-…/refinement.md`, `spec.md` com D-1..D-6 **ratificadas**, `CONTEXT.md` | — |
| W1 | qa-engineer | `tests_026_decisao.js` + `tests_026_mutants.js` — **RED commitado** (o bridge não existe: todos FAIL nomeando "`__DECISAO.decisoes` ausente", como `tests_022_escalonamento.js:151-153`) | W0 |
| W2 | core-engineer | `ui_decisao_v32.js` (arquivo solto; o gate de unidade o carrega direto por `vm`/jsdom sem builder) | W1 |
| W3 | build-engineer | `build_v32_html.py` + `bridges.json` (+ marcador; `marker-lint` e `lint-arch` verdes) | W2 |
| W4 | core-engineer | `ui_curation_v32.js` (`ofertados`, `itensDecididos`, `contract().itens`) | W3 |
| W5 | ui-engineer | `ui_p52_support_v32.js` + `ui_p52_support_v32.css` | W4 (consome `contract().itens`) |
| W5b (opcional) | ui-engineer | `ui_curation_edit_v32.js`: subtítulo da variante lido de `contract().itens` (+8) — **não** nesta demanda salvo pedido | W5 |
| W6 | qa-engineer | reancoragens (`D019-M5/M15`, `D022-M10`), `expected_suites.json`, `mutation_map.json`; campanhas `d019`/`d022`/`d023`/`d025`/`d026` (sequenciais — mutam in place) | W5 |
| W6' (paralela a W6, arquivos distintos) | build-engineer | `gen_pins.py`; job `visual` no CI (P8/PDF5/PDF6 medidos) | W5 |
| W7 | doc-writer + product-owner | backlog, relatório, aceite de intenção (Fase 6) | W6 |

### 4.3 Gates existentes — decisão por gate

Classe **nao-afeta** (não listados um a um; a razão é a mesma): tudo que mede legado (`boot()` de
`tests_019_curadoria.js:90-120` nunca declara contexto; `D010-F5/F5b`, `P52-F1`, `U1/U7`, `D015-E2`,
fixtures da 025) continua recebendo a **mesma oferta** (`modo:"hipotese"` reproduz `computeFindings()+MAP`
com tier por `sev`), e o que compara tela×papel/janela×janela (`D019-PAR1`, `D023-PAP1`, `D025-INV8`,
`S37`, assinaturas da 025) vê o conteúdo novo nos dois lados.

| gate | classe | decisão |
|---|---|---|
| `D019-SOL1` (`:372`, oráculo `computeFindings+MAP+PRODUCTS`) | nao-afeta (fixture legado) → **declarar** que é oráculo de hipótese; o oráculo com contexto é o `D026-MOT1` | manter; comentário-trilha |
| `D019-SOL3 (b)/(c)` (`:476`, tier por sev, dois tiers) | nao-afeta (legado) | manter |
| `D019-PROV1 (c)` (`:270`, card por `PRODUCTS[id].n`) | nao-afeta: `data-p53-sol-produto` continua a **linha** | manter |
| `D019-CTX1` (`:553`, contexto: `security-analytics`+`soc-platform` NONE, `saas:yes`) | reancorável sem mudança: `offered()` = FortiAnalyzer, FortiSIEM (`DIRECT`) + hipóteses das demais → ≥4 ✓; fronteira inalterada | manter; **medir** na W6 |
| `D019-CARD1 (a)` (`:682`, nome uma vez) | nao-afeta: subtítulo "linha" só quando `nome ≠ linha`, e aí o `h4` diz outra coisa | manter |
| `D019-VAZ1`, `D023-SUP1/SUJ1/PAP1`, `D025-AUS1 (b)`/`NEW1` | nao-afeta **porque** veto do motor tem marcador próprio e não entra na contagem de `[data-p53-suprimido]` | manter (é guarda do desenho) |
| `D023-REG1` F2 (`endpoint-detection` NONE) | reancorável sem mudança: `endpoint-family` → chave `FortiEndpoint` (`familia`, `validacao`) — cards == publicados | manter; medir |
| `D022-PROD1` (`:350`) | nao-afeta (C9 preservado por `relation`) | manter |
| `D022-INV1`, `D022-BND1`/`D023-BND1` | nao-afeta; `BND1` é a guarda de que o engine não foi tocado | manter |
| **`D010_DECLARED.substituto`** (`fixtures_010_vao.js:819…`, oráculo declarado de outra demanda) | **não disparado** sob as regras escolhidas: F1/F1b/F4 são `CONTEXT_NOT_INFORMED` → `hipotese` → `published() > 0`. **Se o proprietário trocar a regra de `CONTEXT_NOT_INFORMED` por "sem produto"** (ou recusar D-6 e vetar MDR com base UNSET) → o oráculo vira falso em F1/F1b/F4 → **PARAR e escalar**, nunca reancorar por conta | guarda; decisão D-1 |
| `P52-ICON3 (t2)`, `D010-ARB1/ARB3 (c)/ARB4`, `D015-*` | nao-afeta (legado/saas-only → oferta não vazia) | manter |
| `P52-REC1g`, `P52-LAY4/LAY5`, `P52-REC1` | nao-afeta (contador reescrito `:768-769`; idempotência preservada no ramo `else` `:744-762`, que passa a reler `item.publicado`) | manter |
| `S4-S5`, `S30`, `S31-S32`, `S69 (b)` | nao-afeta (export inalterado; nenhum nome banido nos registros, e registros nunca serializados) | manter |
| `playwright P8` (12 páginas no host canônico) | **incerto**: 3–5 linhas novas por `pr-card` | medir no CI; se mudar, **repin de BASELINE declarado** com trilha, nunca afrouxar |
| `P52-PDF5/PDF6` | incerto (bloco novo em `#pr-sup-solucao`) | medir no job `visual` |
| mutantes `D019-M5` (`:733`), `D019-M15` (`:721`), `D022-M10` (`:330`) | **reancorar** (ataque preservado: M5 → "não filtrar por `publicado`", M15 → "`itensParaCards()` devolve `[]`", M10 → "guardar só a primeira capability na união") | W6 |
| mutantes `D019-M4/M7/M9/M13/M14/M16/M17/M18`, `D023-M2/M6`, `D019-M1/M2`, `D025-M2/M3/M5/M9/M23` | intactos se os literais citados em §4.1 não mudarem — **conferir a campanha após cada rename** (memória: âncora apodrece) | W6 |
| `expected_suites.json` | `d026` novo; contagens existentes inalteradas (nenhum gate novo em suíte antiga) | W6 |

### 4.4 Gates novos — só o que, sem ele, o produto quebra em silêncio (diretriz 2026-09-13)

Suíte `tests_026_decisao.js`, namespace `D026-*`. Fixtures literais C1, C2, C3b, C6, C7, C9, C10 e G1
(legado) escritas como `entrada` **sem jsdom** para os gates de unidade (o bridge é carregado num contexto
`vm` com `window = {}`), e jsdom só onde tela/papel são o sujeito.

| gate | afirma (oráculo independente) | mutante que mata |
|---|---|---|
| `D026-MOT1` | com contexto declarado: todo `itemId` publicado é candidato `DIRECT`/`contextual-extension`/`contextual-by-signal` do **`buildRecommendationContext()`** (oráculo = engine, não MAP) ou serviço de `services[]`; nenhum produto publicado em capability `CONTEXTUAL`/`VALIDATE` sem candidato (C2/C4/C7-FortiEndpoint); `arquitetura violated` ⇒ veto (C1 sem FortiEndpoint, com FortiEDR) | `D026-M1` remove o veto `arquitetura` (C1 publica FortiEndpoint); `D026-M2` trata `CONTEXTUAL` como `hipotese` (C2 publica) |
| `D026-HIP1` | legado e `CONTEXT_NOT_INFORMED` ⇒ `modo:"hipotese"`, oferta == `computeFindings()+MAP` (o oráculo do `D019-SOL1`, agora **declarado** como oráculo de hipótese), tier por `sev`, `condicao` presente na tela **e** no papel; zero veto em legado (G1: MDR continua ofertado) | `D026-M3` aplica `elegibilidade` em legado (MDR some em G1) |
| `D026-SVC1` | C7: `SOCaaS` publicado como `servico` por gap, `prioritaria`; `FortiGuard-MDR-Service` **não** publicado com veto `elegibilidade` cujo motivo é o `reason` literal de `serviceEligibility`; `FortiXDR` publicado `estender-base`, nunca `prioritaria`; D-6: mesma C7 com `endpoint-detection` UNSET ⇒ MDR `hipotese` | `D026-M4` ignora `eligible:false` (MDR volta "prioritária") |
| `D026-PAP1` | para cada card da tela, o `pr-card` homônimo carrega `data-p53-sol-tier` igual e o texto do qualificador, mais variante/escopo/condição/ação quando existem na tela (C5: 9/9 com qualificador no papel; `escopo` de FortiEndpoint) | `D026-M5` remove o tier **só** em `papelHTML()` (o defeito C5) |
| `D026-ID1` | dedup por `chave\|\|itemId`: C10 → um card `FortiSIEM` com `data-p53-sol-variantes` ⊇ {`fortisiem`,`fortisiem-cloud`}; C6 → `data-p53-sol-item-id="fortindr-onprem"`, `h4` = `OFFERINGS["fortindr-onprem"].name`, `data-p53-sol-produto="FortiNDR"`; `PAREAR` total sobre `OFFERINGS ∪ SERVICES` e toda chave de `PRODUCTS` salvo `FortiGuard-Service-Bundle` tem pré-imagem | `D026-M6` une por `nome` exibido (C6 perde a variante / C10 duplica) |
| `D026-CUR1` | `published()` ≡ conjunto da tela ≡ papel; `set("FortiEndpoint","exclude")` em C1 retira o card FortiEDR e conta 1 em `[data-p53-suprimido]`; `set(<fora da oferta>,"include")` em C2 publica com `[data-p53-prov]` nas duas superfícies; `legacySnapshot()` e `buildRecommendationContext()` byte-iguais antes/depois | `D026-M7` chaveia `decidir` por `itemId` (exclude da linha não alcança a variante) |
| `D026-PUR1` (candidato a cortar se o proprietário quiser 6) | `decisoes(e)` idempotente (duas chamadas, mesmo JSON) e `entradaViva()+decisoes()` não movem `legacySnapshot()` nem `__DEV._stateJSON()` (precedente `D022-INV1`, snapshot **antes** do primeiro render) | `D026-M8` escreve `V32.SESSION_SIGNALS.edrSpecificNeed = true` dentro de `decisoes` |

Sete gates, oito mutantes; caso positivo/negativo/adversarial por gate está nas fixtures (C1 é o adversarial
de MOT1; G1 o negativo de HIP1; C7 com UNSET o adversarial de SVC1). Nenhum gate mede "apresentação bonita".

---

## 5 · Invariantes, importação substitutiva (025), riscos, rollback

| invariante | impacto |
|---|---|
| INV-1 (engine byte-idêntico) | **zero toque**; `D022-BND1`/`D023-BND1` + `baseline`/`m41` guardam. C3 é resolvido por derivação sobre `suppressedByPlatform()` pública, não por errata em `classify` |
| INV-2 (UNSET ≠ NONE) | reforçada: `hipotese` só nasce de UNSET/legado; D-6 impede que "base requerida ausente" sob UNSET vire veto |
| INV-3 (suficiência; UI nunca dona) | gate fechado ⇒ `NEEDS_VALIDATION`/`insufficientEvidence` ⇒ veto `motor-validar` em modo motor; em hipótese o comportamento é o de hoje (e `temProdutoPublicadoV32` E4 continua não substituindo) |
| INV-4/5/6 | não tocadas (nada de score/target/refinamento) |
| INV-7 (narrativa determinística, derivada de evidência) | `decisoes` é pura; `condicao` e `vetos` são evidência do engine/Camada 1 — o papel deixa de afirmar "prioritária" sem dizer de onde |
| INV-8 (derivado nunca serializado) | **nenhum campo novo na sessão**; registros nunca saem de `contract()`; `S4-S5` intacto; nomes dos campos fora de `RESERVED_DERIVED` |
| INV-9 (boundary) | só classes `produto`/`generated` (via builder) |
| INV-10 | nomes de código exatos; literais PT-BR na apresentação |

**Importação substitutiva (025)**: `validate`/`fromSession`/`toSession`/snapshot/commit/rollback
(`ui_curation_v32.js:199-263`, `ui_session_v32.js:69-77, :239-244, :548, :619-637`) **não mudam**; a chave
de `decisions` continua a da Camada 1; arquivos existentes (inclusive `exemplo-completo.json`) importam com o
**mesmo significado** — e `exclude` declarado sobrevive à correção da oferta (C1). Residual a declarar no
relatório: `include` pré-025 sobre produto que o motor passa a vetar vira "escolha do engenheiro" com selo.

**Riscos e detecção**

| risco | detecção | mitigação |
|---|---|---|
| fixture com gate fechado **e** capability declarada NONE perde produto (`motor-validar`) — nenhuma conhecida nas suítes | `D010-ARB1`/`D019-CTX1 (c)` na W6 | se aparecer: é o desenho (INV-3), reancorar a fixture com trilha |
| P8 (12 páginas) e PDF5/PDF6 mudam com as linhas novas no `pr-card` | job `visual` | repin declarado; alternativa: condensar tier+ação numa linha só |
| D-2 (C3) contestada como "terceiro decisor" | revisão do PO | regra desligável por constante no módulo puro; C3b continua coberto por `OPERATIONAL_GAP` |
| `applyCopy` sobre textos canônicos de capability: `D019-SOL1` compara `applyCopy(m.cap)` | SOL1 | a apresentação segue aplicando `aplicarCopy` (`:241-246`) sobre `capabilities[].texto` |
| ordem de injeção: `__CURATION` instalado antes de `__DECISAO` | `lint-arch`/`marker-lint` + `D026-CUR1` | consumo é em tempo de chamada, não de instalação; ainda assim injetar `V32_DECISAO` antes de `V32_CURATION` |
| âncoras de mutante apodrecem em silêncio | campanhas `d019/d022/d023/d025/d026` na W6, **sequenciais** | lista §4.3 |

**Rollback**: a mudança é aditiva e isolável por wave. Reverter W5 devolve a tela/papel de hoje com
`__CURATION.offered()` já unificado (sem regressão visível); reverter W4+W5 devolve o estado atual com o
módulo puro inerte (ninguém o consome); reverter tudo = `git revert` dos commits por caminho nominal. Sem
feature flag, sem dado migrado, sem schema tocado.

---

## 6 · Antes / depois — C1..C10

| caso | antes (HEAD 9509e4b) | depois (desenho C) |
|---|---|---|
| **C1** | tela `FortiEndpoint` · prioritária · papel `FortiEndpoint` sem qualificador | tela card `FortiEDR` (linha FortiEndpoint, `item-id fortiedr`) · **avaliar aquisição** · prioritária · papel idem **com** qualificador e ação |
| **C2** | `FortiEndpoint` · prioritária (motor: `OPERATIONAL_GAP`, "nunca substituição") | **nenhum card**; registro vetado `motor-contextual`; leitura "operacionalizar" fica no card de capability (`#v32support`/`pr-support`) |
| **C3** | `FortiSOAR` · prioritária | **nenhum card** (veto `plataforma`, D-2) — ou, se D-2 recusada, `FortiSOAR` hipótese + condição "capability não informada" |
| **C4** | `FortiAnalyzer` + `FortiSIEM` · prioritárias | **nenhum card** (veto `motor-contextual`) |
| **C5** | 9 cards (7 validação, 2 prioritária); papel: 9 sem qualificador, sem escopo | 9 cards iguais, cada um com **condição** "contexto tecnológico não informado"; papel: 9 **com** qualificador, condição e escopo ("cobre a camada de endpoint…" em FortiEndpoint) |
| **C6** | `FortiNDR` · prioritária | card **`FortiNDR (On-Premises)`** (linha FortiNDR, `item-id fortindr-onprem`) · avaliar aquisição · prioritária · papel idem |
| **C7** | `FortiEndpoint` após validação + `FortiGuard SOCaaS` prioritária + `FortiGuard MDR` prioritária | **`FortiGuard SOCaaS`** serviço · prioritária (por gap em 2 capabilities) + **`FortiXDR`** estender base instalada · após validação · escopo M50; MDR fora (veto `elegibilidade`: "…(on-prem/air-gapped) — OG oficial"); FortiEndpoint fora (veto `motor-contextual`) |
| **C8** | `FortiEndpoint` · prioritária | igual, **+ condição** "hipótese da avaliação — contexto tecnológico não informado nesta sessão" em tela e papel |
| **C9** | `FortiDLP` · após validação · sinal preservado | igual (`conversa por sinal declarado`, origem sinal, 2 capabilities) + qualificador no papel |
| **C10** | `FortiAnalyzer`, `FortiSIEM`, `FortiEndpoint` · prioritárias | iguais, `modo motor`, `avaliar aquisição`; `FortiSIEM` com `variantes fortisiem+fortisiem-cloud`; papel com qualificador |

---

## 7 · Decisões que ficam para o proprietário (via `product-owner`, antes da W1)

| id | decisão | default deste desenho | custo de inverter |
|---|---|---|---|
| D-1 | `CONTEXT_NOT_INFORMED` sem supressão de plataforma = **hipótese condicionada** (card + condição), não "sem produto" | hipótese | inverter esvazia `offered()` em F1/F1b/F4 da 010 → oráculo declarado `substituto:true` vira falso → **parar e escalar** (35 gates) |
| D-2 | C3: `CONTEXT_NOT_INFORMED` + `suppressedByPlatform().caps` ⇒ veto `plataforma` (sem card) | aplicar | recusar = C3 vira hipótese; registrar a lacuna do engine no backlog de qualquer forma |
| D-3 | nomear a **variante** do mesmo produto no card (C1/C6) — reabre a E2 da 022 só para variante | nomear | não nomear = `h4` continua a linha; `item-id` e `variante` só em atributo/papel |
| D-4 | `contextual-support` e os 14 serviços sem par na Camada 1 continuam **fora** da visão por produto (E2) | fora | incluir = cards novos visíveis ao cliente + `PORTFOLIO` por família + ícones |
| D-5 | vetos do motor: só no registro/`diag()`, **sem** "linha de vetos" na seção | sem linha | com linha = nó novo depois dos cards, marcador próprio, +PDF |
| D-6 | serviço com `reason` "base requerida ausente" e `endpoint-detection` UNSET = abstenção (hipótese), não veto | abstenção | veto = MDR some de toda sessão "só saasAllowed" (G6/G9/G11/G15) sem que o cliente tenha dito "não tenho EDR" |

Nenhuma destas é tomada aqui: o `tech-lead` propõe e não delega (R5).
