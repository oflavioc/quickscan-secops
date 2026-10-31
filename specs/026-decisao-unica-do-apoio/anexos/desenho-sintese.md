# Desenho FINAL — demanda 026 · contrato único de decisão de apoio

Lente `tech-lead` (síntese), somente leitura. Base: `develop @ 9509e4b`, árvore limpa. Este documento **propõe e não delega** (R5): quem executa é o orquestrador, por wave. Toda afirmação decisiva foi conferida no código do HEAD (`arquivo:linha`); o que vem das lentes anteriores e dos juízes entra como insumo nomeado.

Vencedor por placar: **desenho B** (3 de 3 juízes: 39/37/37 contra C 38/35/36 e A 21/31/32). O FINAL é o B com os enxertos que a maioria pediu, mais três correções que a conferência no código impôs (§1.4, §2.2, §2.6). Nenhum toque em `engine_v32.js` (frozen), na Camada 1 (frozen), em `ui_session_v32.js`, em `SESSION_SCHEMA_V32.md` nem em `ui_v32.js`.

---

## 0 · Decisão e por quê

**Tese.** "O que o motor ofereceu nesta sessão" passa a nascer **uma vez**, em `ui_curation_v32.js` (dono do estado da curadoria, `core-engineer`, bridge `__CURATION`), como lista de **registros de decisão** e lista de **vetos** com a razão literal do motor. `ui_p52_support_v32.js` (tela e papel) e `ui_curation_edit_v32.js` (editor) **consomem** pelo bridge. A Camada 1 (`MAP`) continua sendo o catálogo de **hipóteses por pergunta**; o motor **corrige** a hipótese onde tem voz (veta, resolve variante, qualifica, confirma serviço) e onde se abstém (legado, `CONTEXT_NOT_INFORMED`, gate fechado) a hipótese passa inteira, **rotulada como hipótese condicionada**. Nada é inventado: presença ou ausência de tecnologia só entra como o engine a leu (INV-2).

**Por que B e não A ou C.**

1. É o encaminhamento literal do `EA-76` (`.claude/BACKLOG.md:7094-7149`: "candidato natural é o módulo de curadoria, que já é dono do estado"). A deixava as duas cópias discordando em conteúdo por desenho (`__CURATION.offered()` no MAP, tela no motor) e pinava a divergência como comportamento (`D026-CUR1 (c)` do A) — falha o aceite literal do QS-01 ("mesma decisão na tela, no editor e no PDF").
2. A rota mais barata que entrega o contrato único: 2 módulos de produto, CSS, editor opcional, 1 suíte nova com 3 gates, zero linha em sessão/schema/engine/Camada 1, âncoras de mutante da campanha d019 intactas. C é tecnicamente o mais limpo (módulo puro, bridge novo, `D-6`), mas paga módulo + builder + marcador + `bridges.json` + 3 harnesses + 7 gates/8 mutantes + 3 reancoragens de mutante — contra as diretrizes do proprietário de 2026-09-11/13 (rota mais barata; produto antes de instrumento; não criar gate/mutante sem pedido). As melhores ideias de C entram como enxertos (§0.1).
3. O que B tinha de errado está corrigido aqui, por conferência no código: (i) a hipótese de MDR vinda de `team-capacity` sobrevivia ao veto de `continuous-monitoring` em C7 (§2.5, precedência); (ii) D-4 levava id do motor para `decisions` e mudava o contrato do schema v1 sem bump (retirado); (iii) a derivação de C3 (`CONTEXT_NOT_INFORMED` + `suppressedByPlatform`) **esvazia `published()`** e, como `presentationOf` nunca promove `CONTEXT_NOT_INFORMED` a `card` (`ui_v32.js:693-696`) e `hasSubstituteV32` exige payload não vazio (`:750-752`), a Camada 1 **voltaria à tela com o FortiSOAR que o veto acabou de negar** — por isso a regra nasce desligada (§2.6); (iv) o `data-p53-sol-produto` com nome de variante obrigava a reancorar `D019-CTX1 (a)` e `D025-UNS1` — o atributo continua carregando a **linha** (§2.7); (v) o cache `ultimaOferta` no decorador some.

### 0.1 Enxertos incorporados (maioria dos juízes → origem)

| # | enxerto | pedido por | onde no FINAL |
|---|---|---|---|
| E1 | **D-6**: `serviceEligibility().reason` que começa por "base requerida ausente" com `TECH_LANDSCAPE["endpoint-detection"].presence ∈ {UNSET, UNKNOWN}` é **abstenção** (hipótese), nunca veto — não informado ≠ ausente | PO, QA, core | §2.4 |
| E2 | **Cortar D-4**: item do motor sem linha na Camada 1 fica `chave:null`, publicável e **incurável** — status quo de `ui_curation_v32.js:142` e `ui_p52_support_v32.js:139`; zero linha em `valido()`/`unset()`/schema | PO, QA, core | §2.3, §10 |
| E3 | `data-p53-sol-produto` continua a **linha** (`PRODUCTS[chave].n`); o item resolvido vai ao `h4`/`<b>` e a `data-p53-sol-item-id`; `decisaoDe(produtos[i].nome)` resolve por `idDoNome` como hoje; sem cache `ultimaOferta` | PO, QA (+core) | §2.7, §3 |
| E4 | **Precedência veto > hipótese** na fusão por chave: registro só sobrevive com fonte do motor; sem isso C7 publica "FortiGuard MDR · indicação prioritária" via `team-capacity` | QA (+PO implícito) | §2.5 |
| E5 | Não emitir veto `arquitetura` quando a mesma linha **já tem** card resolvido (C1: o card FortiEDR + linha de variante já explicam) | PO, core | §2.2 |
| E6 | Derivação de C3 atrás de **uma constante nomeada** `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA`, **default `false`**; lacuna `classify` × `suppressedByPlatform` → backlog (Porta B futura) | PO (constante), core (default false), QA (D-3 ao PO) | §2.6, §10 D-3 |
| E7 | O bloco de veto diz **o que existe**: `Tecnologia declarada: <product> (<status>)` de `V32.TECH_LANDSCAPE[capId].solutions`; e nomeia a **extensão contextual** (`fortixdr` + scopeNote M50) dentro da nota, não como card | PO, QA, core | §2.2, §3 |
| E8 | `condicao` como **enum fechado** no registro de hipótese (`sem-contexto` · `capability-nao-informada` · `contexto-a-validar` · `fora-do-catalogo-contextual`), texto escolhido pelo enum | PO, core | §1.2 |
| E9 | Placeholder de família (`itemKind:"family"`) é **sempre** "após validação"; `prioritaria` só nasce de modo motor com `avaliar-aquisicao`/`servico` e `gap-high`, ou de hipótese com `sev 2` | PO (+C) | §2.3 |
| E10 | Pureza como **alínea** (não gate novo): `reconciliar()` idempotente e sem efeito em `legacySnapshot()`/`buildRecommendationContext()`; e **totalidade do pareamento** como alínea | PO, QA, core | §7 |
| E11 | Pareamento do nó de família por **critério**, não por tabela `REPRESENTANTE` (R12/EA-47); só o par serviço-família ↔ `FortiGuard-Service-Bundle` fica declarado | QA, core | §1.4 |
| E12 | Serviços do motor viram card **só sob linha que o MAP já oferece para a pergunta de origem** (E2/022); alargamento é decisão separada do PO | QA (+core) | §2.4, §10 D-5 |
| E13 | Comentário-trilha em `D019-SOL1`, `D019-SOL3 (b)`, `D019-MED1` ("oráculo `computeFindings()+MAP` vale em modo legado/hipótese; com voz do motor o oráculo é `D026-REC1`"), sem mudar asserção | PO, QA | §6 |
| E14 | Preflight de âncoras (`ocorrencias === 1`) antes de qualquer campanha; campanhas **sequenciais** d019→d022→d023→d025→d026 | QA | §5 W4 |
| E15 | Gate de suficiência lido do bridge `__P50SUFF.contract().sufficient` (sem argumento, `ui_p50_suff_v32.js:53`, `:220`) como porta de saída: sob gate fechado nada do motor vira veto | QA | §2.1 |
| E16 | Assinatura pura `reconciliar(entrada)` + coletor único `entradaViva()` — dentro de `ui_curation_v32.js`, sem módulo/bridge novo; exposta como `reconcile(entrada)` para gates com fixture literal | core | §1.3 |
| E17 | Invariantes de DOM do bloco de vetos: depois dos cards, fora de `CLASSES_CONTIGUAS`, fora de `data-p52-support-cards`, marcador próprio `data-p53-vetos` (nunca `data-p53-suprimido`) | core (+B) | §3 |

---

## 1 · Contrato — shape, owner, consumidores

### 1.1 Owner e consumidores

```
engine_v32.js (frozen)                       Camada 1 (frozen)
buildRecommendationContext · archSatisfied   computeFindings · MAP · PRODUCTS
serviceEligibility · suppressedByPlatform
            │                                        │
            └──────────── entradaViva() ─────────────┘   ui_curation_v32.js (core-engineer, DONO)
                                 │                       reconciliar(entrada) → { registros[], vetos[] }  (pura)
                                 ▼                       ofertados() = registros publicáveis e curáveis → chaves
   __CURATION: offered / decide / published / contract  ·  NOVOS: oferta() · vetos() · reconcile(entrada)
            │                                        │
            ▼                                        ▼
   __P53SOL (ui_p52_support_v32.js, ui-engineer)    __P53CUR (ui_curation_edit_v32.js, ui-engineer)
   ofertaDoMotor() = leitor de oferta()              offered()/catalog()/decide(): API inalterada
   cards ← registros · vetos ← vetos()               (opcional: subtítulo da variante lido de oferta())
   papelHTML() ← cards da tela (D019-PAR1)
            │
            ▼
   buildPrintReport() (ui_v32.js:1566) ← __P53SOL.printHTML()   — inalterado
```

- **Dono de estado**: continua só `__CURATION` (decisões do operador, `decisions: { chave → include|exclude }`). O registro de decisão é **derivado**: recomputado a cada chamada, sem cache, nunca serializado (INV-8), nunca lido de volta do DOM (R9 §3).
- **Quem decide quem entra**: `reconciliar()`, uma vez. **Quem decide o que publica**: `decidir()`/`publicados()` (`ui_curation_v32.js:162-179`, byte-iguais). **Quem desenha**: `__P53SOL`/`__P53CUR`.
- `ui_v32.js` (`temProdutoPublicadoV32` `:729-745`, `hasSubstituteV32` `:746-758`, `buildPrintReport` `:1566`) **não muda**: `published()` continua a definição que ele lê.

### 1.2 Shape do registro (um por chave publicável; vocabulário fechado onde uma máquina resolve)

```js
{
  chave:     "FortiEndpoint" | null,      // linha curável = chave de PRODUCTS; null = sem par (publicável, incurável — status quo)
  nome:      "FortiEndpoint",             // nome da LINHA (PRODUCTS[chave].n); vai em data-p53-sol-produto; chave null → OFFERINGS[itemId].name
  titulo:    "FortiEDR",                  // o que o <h4>/<b> mostra: nome do item resolvido quando UM só itemId ∈ OFFERINGS e name ≠ linha; senão == nome
  tipo:      "produto" | "familia" | "servico",
  modo:      "motor" | "hipotese",
  itemId:    "fortiedr" | null,           // identidade estável do motor; null em hipótese pura
  itemIds:   ["fortiedr"],                // todos os ids do motor fundidos nesta chave (C10: ["fortisiem","fortisiem-cloud"])
  variante:  { nomes:["FortiEDR"], modalidade:null|"a definir", resolucao:"atende"|"oferta a definir no aprofundamento"|… } | null,
  acao:      "avaliar-aquisicao" | "modalidade-a-definir" | "apoio-contextual" | "conversa-por-sinal" | "servico" | "hipotese",
  tier:      1 | 2,                       // 1 = "indicação prioritária" · 2 = "após validação" (TIER, ui_p52_support_v32.js:240 — inalterado)
  origem:    "gap" | "sinal" | "gap+sinal",
  condicao:  null | "sem-contexto" | "capability-nao-informada" | "contexto-a-validar" | "fora-do-catalogo-contextual" | "plataforma-declarada-cobre",
  capabilities: [{ capId, qid|null, texto }],   // texto CANÔNICO (MAP[qid].cap ou CAPABILITIES[capId].name); a apresentação aplica __P52.applyCopy
  sinais:    ["dataLeakageConcern"],      // ids; a apresentação traduz com sigPT
  escopo:    ["camada endpoint"],         // scopeNote do motor ∪ MAP.lv[].c[].sn, deduplicado por texto
  elegibilidade: { estado:"elegivel"|"validar", motivo } | null,   // serviço: motivo = services[].note literal
  entregaveis: ["Incident Response Training"],                     // SERVICES[*].name pareados à linha guarda-chuva
  fontes:    [{ via:"gap"|"sinal"|"servico-gap"|"servico-sinal", capId, qid|null, sev|null, lvl|null, itemId|null, serviceId|null }],
  notas:     ["…literais de ctx.notes…"],
  vetosDaLinha: []                        // vetos da MESMA chave em outras capabilities (diag; renderizados no bloco de vetos)
}
```

**Veto** (lista paralela; um por linha × capability; renderizado agrupado por linha):

```js
{ chave:"FortiEndpoint", nome:"FortiEndpoint", itemId:"fortiendpoint"|null, capId:"endpoint-detection", cap:"Detecção e resposta em endpoint (EDR)",
  classe: "arquitetura" | "operacional" | "expansao" | "enablement" | "avaliacao" | "validar" | "plataforma" | "elegibilidade" | "motor-sem-candidato",
  motivo: "tecnologia operacional — apoio em operacionalização (nunca substituição)",      // literal do engine (ctx.notes / serviceEligibility().reason)
  existente: [{ product:"CrowdStrike Falcon", status:"production", deployment:"saas" }],   // TECH_LANDSCAPE[capId].solutions
  extensoes: [{ itemId:"fortixdr", nome:"FortiXDR", scopeNote:"extensão de correlação … (M50)" }],   // contextual-extension da capability
  servicos:  [{ serviceId:"fortiguard-mdr", nome:"FortiGuard MDR", note:"base compatível" }] }      // services[] do motor nesta capability sem linha no MAP (informativo)
```

Regra de ouro: **todo valor vem de dado que já existe** (enum do engine, literal de `ctx.notes`, `serviceEligibility().reason`, `OFFERINGS[].name/deployment/url`, `MAP.w/sn`, `PRODUCTS.n/d/u`). Os únicos literais novos são rótulos de apresentação (`ACAO_TXT`, `CONDICAO_TXT`, `VETO_TXT`), que moram em `ui_p52_support_v32.js`, nunca no dono do estado. Nenhum nome de campo colide com `RESERVED_DERIVED` (`ui_session_v32.js:34-37`) nem com os 13 banidos de `S4-S5` — e nem precisaria: nada disto viaja na sessão.

### 1.3 Funções (todas em `ui_curation_v32.js`)

| função | natureza | o quê |
|---|---|---|
| `entradaViva()` | coletor, só leitura, sob `typeof` | `{ legado, suficiente, findings, mapa, produtos, contextos, catalogo:{ofertas, servicos, familiasServico, capabilities}, landscape:{capId→presence}, supressao:{caps:[…], plataforma}, arquitetura:{id→archSatisfied}, elegibilidade:{sid→{eligible,reason}} }`; devolve `null` quando `computeFindings`/`MAP`/`PRODUCTS`/`V32` faltam — e quem chama **nomeia** no console (R10 §2) |
| `reconciliar(entrada)` | **pura** (dado → dado), sem DOM, sem estado | `{ registros[], vetos[] }` pelas regras do §2 |
| `chaveDe(itemId)` / `idsDaLinha(chave)` | pareamento por critério (§1.4) | total sobre `OFFERINGS ∪ SERVICES` |
| `temVoz(ctx)` | helper único (R9 §8) | `ctx.classification !== "CONTEXT_NOT_INFORMED" && (candidates+services+notes) > 0` — espelha a cláusula de `hasSubstituteV32` (`ui_v32.js:750-752`); comentário-trilha nos dois lados |
| `ofertados()` | leitor | `reconciliar(entradaViva()).registros.filter(publicavel && chave !== null).map(chave)` deduplicado — assinatura `offered()` inalterada (devolve chaves) |
| bridge | `oferta()`, `vetos()`, `reconcile(entrada)`, `contract()` + `{ oferta, vetos }` | `decidir`/`publicados`/`escolhaDoOperador`/`inclusoesSemLastro`/`paraSessao`/`validar`/`daSessao`/`valido`/`unset`: **byte-iguais** (âncoras `D019-M1` `:157`, `D019-M2` `:164`, `D025-M2` `:255-256`, `D025-M3` `:219`, `D025-M23` `:227`, `D025-M5` `:254`, `D025-M9` `:257`) |

Custo de chamada: `reconciliar()` roda a cada `offered()`/`decide()`/`published()`/`contract()`/`oferta()` — mesma classe de custo de hoje (`ofertados()` `:124` e `ofertaDoMotor()` `:293` já recomputam `buildRecommendationContext()` por passagem). Memoização por passagem é otimização futura, fora desta demanda.

### 1.4 Pareamento `itemId → chave` por critério (R12/EA-47) — conferido no catálogo

```
1. nome exato:   OFFERINGS[id].name === PRODUCTS[k].n  ou  SERVICES[id].name === PRODUCTS[k].n
                 (fortianalyzer, fortisiem, fortisoar, fortiendpoint, fortixdr, fortirecon, fortideceptor, fortidlp,
                  fortiai-assist, ndr-family → "FortiNDR" (engine_v32.js:89 = v3_1_3.html:267), fortiguard-socaas, fortiguard-mdr)
2. cadeia variantOf até (1):   fortisiem-cloud → fortisiem → "FortiSIEM"; fortindr-cloud / fortindr-onprem → ndr-family → "FortiNDR"
3. representante ÚNICO da família: fam = OFFERINGS[id].family, ou o próprio id quando entityType === "family" (o nó de família
   tem family:null por default — engine_v32.js:80, :87, :89). Entre as ofertas com family === fam, variantOf === null e
   entityType !== "family", as pareáveis por (1) devem ser EXATAMENTE UMA → essa é a chave.
     endpoint-family: {fortiendpoint, fortiedr, forticlient} → só fortiendpoint pareia → "FortiEndpoint"  (cobre fortiedr e o placeholder)
     soc-platform-family: {fortisoc, fortianalyzer, fortisiem, fortisoar} → TRÊS pareiam → NÃO há representante → fortisoc → null
     identity-family / fortimail-family: nenhuma pareia → null
4. serviço membro de SERVICE_FAMILIES[f] → LINHA_DA_FAMILIA_DE_SERVICO[f]  — única constante declarada:
   { "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" } (não há nome em comum: "FortiGuard Labs Advisory Service (umbrella)" × "Serviços FortiGuard")
5. senão null (incurável, status quo): fortisoc, fortimail, fortimail-wss, fortimail-cloud-saas, fortisandbox, fortiaigate, fortisat,
   fortiauthenticator, fortipam, fortigate, e os nós fortimail-family / soc-platform-family / identity-family
```

A cláusula "exatamente uma" da regra 3 é o que a conferência no código impôs: sem ela, `fortisoc` parearia com `"FortiAnalyzer"` via `soc-platform-family`. Propriedades que o gate afirma (§7, `D026-REC1 (g)`): `chaveDe` é total sobre `OFFERINGS ∪ SERVICES`; **toda** chave de `PRODUCTS` (13) tem ≥ 1 pré-imagem — a do `FortiGuard-Service-Bundle` nasce da constante da regra 4, exceção **declarada**, não vácuo. `idsDaLinha(chave)` é a imagem inversa, calculada uma vez por chamada. `tipoDaLinha(chave) === "servico"` quando `idsDaLinha(chave) ∩ SERVICES ≠ ∅` (SOCaaS, FortiGuard-MDR-Service, FortiGuard-Service-Bundle).

---

## 2 · Regras de reconciliação MAP × motor

### 2.1 Portas de saída (hipótese do mapa = comportamento de hoje)

| condição | efeito | por quê |
|---|---|---|
| `entradaViva() === null` (engine/Camada 1 ausentes ou lançando) | hipóteses do mapa, `console.error` nomeando | como `ui_p52_support_v32.js:338-344` hoje; nunca silêncio (R10 §2) |
| `legado === true` (`isLegacyModeV32`, `engine_v32.js:305-311`; `contexts:{}` `:552`) | **toda** linha do MAP é `hipotese`/`sem-contexto`, tier por `sev`; **zero** veto, zero serviço do motor, zero elegibilidade | decisão registrada 023 E1 (`design-decisions.md`), refutação C8; `serviceEligibility` leria UNSET como ausência (INV-2) |
| `suficiente === false` (`__P50SUFF.contract().sufficient`) | toda linha é hipótese (condição pela regra abaixo), sem veto | INV-3 pelo lado da apresentação, 023 E4 (`ui_v32.js:732-741`): o que não é publicável não desloca o que é; preserva `D010-F3`/`D010-ARB1 (c)` por construção, não por sorte de fixture |

### 2.2 Veredito por linha do MAP × capability (uma função pura do `contexts[capId]`)

Para cada achado `f` de `computeFindings()` (`v3_1_3.html:522-533`), `capId` = a capability cujo `questionIds` contém `f.id` (1:1 por construção, `validateConfigV32 :697`), `ctx = contexts[capId]`, `H` = linhas de `MAP[f.id].lv[f.lvl].c` com `PRODUCTS[c.p]` (com `w` e `sn`), `ids = idsDaLinha(chave)`, `relacionados = ids ∩ { id : capabilityRelations ∋ capId }`.

| situação do `ctx` | linha de **produto** | linha de **serviço** (§2.4) |
|---|---|---|
| ausente (defensivo) | `hipotese` · `capability-nao-informada` | idem |
| `CONTEXT_NOT_INFORMED` / `LEGACY-LABELLED` (`:601-602`; inclui as 3 capabilities `landscapeEnabled:false`, `:43-45`) | `hipotese` · `capability-nao-informada`; com `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA === true` e `supressao.caps ∋ capId` → `hipotese` · `plataforma-declarada-cobre` · tier 2 (**nunca veto**, §2.6) | `veredictoDeServico` |
| `!temVoz(ctx)` com classificação ≠ CONTEXT_NOT_INFORMED (`NEEDS_VALIDATION` por presença `UNKNOWN` sem serviço; `DIRECT` sem payload — defensivo) | `hipotese` · `contexto-a-validar` | `veredictoDeServico` |
| `TECHNOLOGY_WHITESPACE` · `DIRECT` | candidato `offering` da linha (`relacionados ∩ candidates`, ou `variants[]` de placeholder cobrindo a linha) → **motor** `avaliar-aquisicao`; placeholder `family`/`family-of-variants` → **motor** `modalidade-a-definir` (tier 2); `contextual-support` da linha → **motor** `apoio-contextual` (tier 2); `relacionados` não vazio mas nenhum candidato: `arquitetura[id] === "violated"` para algum id → **veto `arquitetura`** (só se a linha não ganhou card em capability alguma — E5), senão **veto `motor-sem-candidato`** (defensivo); `relacionados` vazio → `hipotese` · `fora-do-catalogo-contextual` (ex.: `FortiXDR` em `automation` lv1, `v3_1_3.html:447`) | `veredictoDeServico` |
| `TECHNOLOGY_WHITESPACE` · `CONTEXTUAL` por plataforma (nota `:576`) | **veto `plataforma`** para toda linha (motivo literal + `supressao.plataforma`) | idem |
| `TECHNOLOGY_WHITESPACE` · `CONTEXTUAL` só `contextual-support` (`:644-650`) | linha com `contextual-support` → **motor** `apoio-contextual`; demais → veto `motor-sem-candidato` | idem |
| `OPERATIONAL_GAP` / `COVERAGE_GAP` / `ADOPTION_GAP` · `CONTEXTUAL` (`:579-590`) | veredito **de capability**: linha com `contextual-support` → `apoio-contextual`; toda outra linha → **veto `operacional`/`expansao`/`enablement`** com `ctx.notes` literal (incl. M75), `existente` de `TECH_LANDSCAPE[capId].solutions`, `extensoes` (`fortixdr`, `:585-588`) e `servicos` do motor nesta capability | idem |
| `EVALUATION_IN_PROGRESS` (`:591-594`) | veto `avaliacao` (nota `:593`) | idem |
| `TECH_STATUS_UNVERIFIED` · `NEEDS_VALIDATION` com serviço · `POSSIBLE_CONTEXT_DIVERGENCE` (`VALIDATE` com payload) | veto `validar` (nota literal; `NEEDS_VALIDATION` sem nota: "presença declarada como desconhecida — validar antes de qualquer leitura de gap") | idem |
| `UNASSESSED_CAPABILITY` · `CONTEXTUAL` por sinal (`:603-615`; sem pergunta, sem `H`) | **motor** `conversa-por-sinal`, `origem:"sinal"`, tier 2, `chave = chaveDe(itemId)` (pode ser `null`) — é o segundo laço de hoje (`ui_p52_support_v32.js:291-337`), transportado com a linha-âncora do `D022-M10` | — |
| `UNASSESSED_CAPABILITY` licenciada (M62) / `INVENTORY` / `MATURE_*` / `TECH_TRANSITION` / `null` | nada (não há achado) | serviço por sinal ainda entra (`dfir` em capability madura) só se a linha existir no MAP da pergunta — não existe → nada (status quo) |

**Regra única de aquisição** (contrato do motor §1): só `supportMode:"DIRECT"` com `itemKind ∈ {offering, family, family-of-variants}` vira `avaliar-aquisicao`/`modalidade-a-definir`. Tudo o mais é contextual, serviço, sinal ou hipótese — por construção.

**Veto só onde o motor tem voz.** `temVoz()` é a cláusula de `hasSubstituteV32` (`ui_v32.js:750-752`): um veto de produto só nasce em capability que, sozinha, mantém a Camada 1 oculta. Consequência estrutural: **um veto nunca devolve a leitura congelada** mesmo quando `published()` esvazia (C2/C4: `porCapability` é verdadeiro pela nota). O veto de serviço (§2.4) tem voz própria — a elegibilidade lê landscape **declarado** — e nas sessões reais vem sempre acompanhado da linha SOCaaS (MAP `team-capacity` lv0, `monitoring-coverage` lv0/lv1, `v3_1_3.html:431, :458-459`); a alínea `D026-LEG1 (e)` mede `d010HasSubstitute === true` em toda fixture com veto, para que isto seja propriedade medida, não suposta.

### 2.3 Qualificador (`tier`) e título

| caso | tier | título (`titulo`) |
|---|---|---|
| hipótese (qualquer `condicao`) | `sev 2 → 1`, senão `2` — como hoje e como `buildTiers` (`v3_1_3.html:545`) | nome da linha |
| motor `avaliar-aquisicao` (offering) | `maturity.state === "gap-high" → 1`, `gap-moderate → 2` | nome do item quando a chave fundiu **um só** `itemId ∈ OFFERINGS` com `name ≠ linha` (C1 "FortiEDR", C6 "FortiNDR (On-Premises)"); senão nome da linha (C10 "FortiSIEM" + `variante.nomes`) |
| motor `modalidade-a-definir` (placeholder `family`) | **2 sempre** (E9) | nome da linha; `variante = { modalidade:"a definir", nomes: variants.map(name), resolucao: variantResolution }` |
| motor `apoio-contextual` / `conversa-por-sinal` | 2 | nome da linha (ou `OFFERINGS[itemId].name` se `chave:null`) |
| motor `servico` por gap | `gap-high → 1`; `note === "elegível — validar deployment da base"` → 2 + `elegibilidade.estado:"validar"` | nome da linha; `entregaveis` nomeados |
| motor `servico` por sinal | 2 | idem |
| fusão | mínimo entre as fontes que produzem card (motor + hipóteses não vetadas) | — |

`prioritaria` só nasce de modo motor com `avaliar-aquisicao`/`servico` e `gap-high`, ou de hipótese com `sev 2` — e neste caso o card carrega a `condicao` visível.

### 2.4 Linhas de serviço — `veredictoDeServico(chave, capId, ctx, entrada)` (fora do legado e do gate fechado)

```
sids = idsDaLinha(chave) ∩ SERVICES com relação a capId
se algum sid ∈ ctx.services[]            → MOTOR "servico": origem = triggeredBy inclui "capability-gap" ? "gap" : "sinal";
                                            elegibilidade = { estado: /^elegível — validar/.test(note) ? "validar" : "elegivel", motivo: note };
                                            entregavel = SERVICES[sid].name
senão, para cada sid: el = elegibilidade[sid]
   !el.eligible && /^base requerida ausente/.test(el.reason)
        && landscape["endpoint-detection"] ∈ {"UNSET","UNKNOWN"}   → HIPÓTESE · capability-nao-informada     (D-6 / INV-2: não informado ≠ ausente)
   !el.eligible (demais razões; inclui base DECLARADA ausente — presence NONE — e
        "base declarada apenas em deployments não elegíveis (on-prem/air-gapped) — OG oficial")   → VETO "elegibilidade", motivo = el.reason
   el.eligible e não disparado             → ctx CONTEXT_NOT_INFORMED ? HIPÓTESE · capability-nao-informada : VETO "motor-sem-candidato" (defensivo)
```

Vale **em todo modo não-legado, inclusive `CONTEXT_NOT_INFORMED`** (o engine anexa `services[]` mesmo em `LEGACY-LABELLED`, `:653-665`; C7 `soc-staffing` prova). Era o furo do B que o juiz PO apontou (F2/G8: endpoint declarado NONE → MDR saía como hipótese enquanto o motor o declara inelegível).

**Serviço do motor sem linha do MAP na pergunta** (ex.: `fortiguard-mdr` disparado por `endpoint-detection` primary quando o MAP `endpoint` lista só FortiEndpoint): **não vira card** (E12 — a fronteira da E2/022: "mudança visível que ninguém pediu"); entra como `servicos[]` do veto/nota da capability, informativo, e a leitura por capability (`#v32support`/`#pr-support`, `ui_v32.js:673, :685`) já o lista. Promover a card é a decisão **D-5** do proprietário.

### 2.5 Fusão por chave e precedência (E4)

Registros chaveados por `chave || itemId` — **nunca por nome exibido** (raiz de C6 e do colapso FortiEDR→FortiEndpoint em `ui_p52_support_v32.js:317-327`). Por chave acumulam-se `fontesMotor[]`, `hipoteses[]`, `vetos[]`:

1. `fontesMotor.length > 0` → **card modo motor**: `capabilities` = das fontes do motor ∪ das hipóteses **não vetadas** da mesma chave; `itemIds`, `sinais`, `escopo`, `entregaveis` unidos; `acao` = a mais forte (`avaliar-aquisicao` > `modalidade-a-definir` > `servico` > `apoio-contextual` > `conversa-por-sinal` > `hipotese`); vetos da mesma chave em **outras** capabilities ficam em `vetosDaLinha` e são renderizados no bloco de vetos (ex.: FortiEndpoint candidato em `endpoint-detection` e vetado em `vulnerability-management` com Tenable em produção — as duas leituras coexistem, cada uma nomeando sua capability).
2. sem fonte do motor e `vetos.length > 0` → **sem card**; hipóteses da mesma chave **caem** (precedência veto > hipótese). É o que retira "FortiGuard MDR · indicação prioritária" de C7 (hipótese de `team-capacity`, `soc-staffing` `CONTEXT_NOT_INFORMED`, contra o veto de elegibilidade) e o FortiEndpoint de `vulnerability-management` quando `endpoint-detection` diz "nunca substituição".
3. sem fonte do motor e sem veto → **card hipótese** com `condicao` = a mais forte presente (`sem-contexto` > `capability-nao-informada` > `contexto-a-validar` > `fora-do-catalogo-contextual` > `plataforma-declarada-cobre`).

Ordem de emissão: primeira aparição (ordem dos achados, depois `Object.keys(contexts)`), como hoje.

### 2.6 C3 — a constante e por que nasce desligada

`CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false` em `ui_curation_v32.js` (âncora de mutante; chave de reversão). Medido no código: em C3 (`cen/C3.json`: só `automation=0`, FortiSOC declarado só em `soc-platform`), `offered() = ["FortiSOAR"]`. Qualquer regra que **retire** o FortiSOAR esvazia `published()`; `temProdutoPublicadoV32` devolve falso (`ui_v32.js:742-743`); `porCapability` devolve falso porque `presentationOf` nunca promove `CONTEXT_NOT_INFORMED` a `card` (`:693-696`) e `hasSubstituteV32` ainda exige `classification !== "CONTEXT_NOT_INFORMED"` (`:751`) → `hideLegacyRecommendation(app, false)` → a Camada 1 **volta** com o FortiSOAR na lista congelada, ao lado do veto. Incoerência pior que a de hoje.

Por isso: (a) default `false`: C3 é `hipotese` · `capability-nao-informada` (card com condição visível e tier por `sev`), e a lacuna "`sup.caps` não consultada no ramo `CONTEXT_NOT_INFORMED`" vai ao backlog como Porta B futura; (b) com `true`, a regra **nunca veta**: o card continua (publicado, curável), ganha `condicao:"plataforma-declarada-cobre"` ("Plataforma declarada (FortiSOC) cobre esta capability — avaliar uso/expansão antes de nova aquisição") e tier 2 — sem tocar `ui_v32.js`; (c) **C3b** (FortiSOC declarado na própria `security-automation`, `refutador/cen_C3b.json`) é `OPERATIONAL_GAP` + nota M75 → veto `operacional`/`plataforma` pela regra geral, com `porCapability` verdadeiro pela nota — é o caso "plataforma cobre" que a spec deve usar. Decisão **D-3** do proprietário (§10).

### 2.7 Identidade e curadoria

- `data-p53-sol-produto` = **nome da linha** (`PRODUCTS[chave].n`; para `chave:null`, `OFFERINGS[itemId].name` como hoje). É o que todos os consumidores atuais leem (`D019-SOL1/SOL3/CTX1/PROV1/CARD1/PAR1`, `D022-PROD1`, `D025-UNS1`, `acrescimos()` `:578`, `decisaoDe()` `:136-141`). A identidade estável do motor vai em `data-p53-sol-item-id` (+ `data-p53-sol-chave`, `data-p53-sol-variantes`).
- `decisaoDe(produtos[i].nome)` (`:733`, âncora `D019-M5`) e `ehEscolhaDoOperador` (`:146-151`) continuam resolvendo `nome → id` por `idDoNome` (`:116-123`). O registro leva o nome da linha em `nome` e o item resolvido em `titulo` — é isso que mantém "produto retirado não volta": `set("FortiEndpoint","exclude")` retira o card FortiEDR em C1, nas duas superfícies, qualquer que seja a variante que o motor resolva.
- Acréscimo humano (`acrescimos()`/`cardAcrescentado()`, `:517-583`): **inalterado**; ganha só `data-p53-sol-origem="operador"` e `data-p53-sol-acao="hipotese"`; continua sem tier, sem capability, com `[data-p53-prov]` em tela e papel (`D019-PROV1`, `D019-M4`). "Condições" do item manual não existem no estado (019 C1: só ids e enum) — limitação declarada, decisão **D-8**.
- `suprimidos = produtos.length - cards.length` (`:734`) passa a contar só exclusões do operador, porque `produtos` já não contém linhas vetadas. Veto do motor **nunca** usa `[data-p53-suprimido]` (`D025-AUS1 (b)`/`D025-NEW1` exigem `null` sem curadoria; `D023-PAP1` exige a mesma contagem nas duas superfícies).
- Item sem par (`chave:null`, por sinal): publicável e **incurável**, como hoje (`ui_curation_v32.js:142`, `ui_p52_support_v32.js:139`). Residual declarado (§10), com a nota de que `published() ≠ cards` já é latente hoje nesse caso.

---

## 3 · Os casos C1–C10 — antes / depois

| caso | motor (medido, `node resumo.js`) | antes (HEAD) | depois (FINAL) |
|---|---|---|---|
| **C1** endpoint NONE, `saasAllowed:"no"`, `localProcessingRequired:"yes"` | `WHITESPACE/DIRECT`, `candidates=[fortiedr/offering/atende]`; `archSatisfied(fortiendpoint)="violated"` | card `FortiEndpoint` · prioritária; papel sem tier | card `data-p53-sol-produto="FortiEndpoint"`, `h4` **FortiEDR**, `item-id="fortiedr"`, `acao="avaliar-aquisicao"`, **indicação prioritária** (gap-high), linha "Variante resolvida pelo contexto declarado — linha de produto: FortiEndpoint"; sem veto arquitetural visível (E5); papel idem com tier/ação/variante |
| **C2** gap endpoint, EDR de terceiro em produção | `OPERATIONAL_GAP/CONTEXTUAL`, `cand=[]`, nota "nunca substituição" | card `FortiEndpoint` · prioritária | **nenhum card**; bloco de vetos: "FortiEndpoint — tecnologia operacional — apoio em operacionalização (nunca substituição) · Tecnologia declarada: <EDR> (production)"; Camada 1 continua oculta (`porCapability` pela nota) |
| **C3** gap automation, FortiSOC só em `soc-platform` | `CONTEXT_NOT_INFORMED/LEGACY-LABELLED`; `sup.caps ∋ security-automation` | card `FortiSOAR` · prioritária | **D-3 default**: card `FortiSOAR` · prioritária (sev 2) · `condicao="capability-nao-informada"` visível em tela e papel; lacuna do engine → backlog. Com a constante ligada: mesmo card, tier **após validação**, condição "Plataforma declarada (FortiSOC) cobre esta capability…". **C3b** (FortiSOC na própria capability): sem card, veto com M75 |
| **C4** gap logs, Sentinel em produção | `OPERATIONAL_GAP/CONTEXTUAL`, `cand=[]` | `FortiAnalyzer` + `FortiSIEM` · prioritárias | **nenhum card**; bloco de vetos com 2 linhas (`data-p53-vetos="2"`), motivo literal, "Tecnologia declarada: Microsoft Sentinel (production)" |
| **C5** legado `[1,2,2,2,1,1,1,1,1,1,"NA",1,2,0,0]` | `contexts:{}` | 9 cards (7 validação / 2 prioritária); papel **0/9** com qualificador, sem "Escopo" | mesmos 9 cards e tiers, cada um com condição "sem contexto" (D-6, §10); papel **9/9** com `data-p53-sol-tier` + texto, condição, e "Escopo: cobre a camada de endpoint…" no FortiEndpoint (`.scope` do `.prod` movido, `v3_1_3.html:874`) e "complementa o programa…" no FortiRecon (escopo do MAP que hoje se perde na menção curta) |
| **C6** NDR NONE, `saasAllowed:"no"` | `DIRECT`, `fortindr-onprem/atende` | card `FortiNDR` · prioritária | card linha `FortiNDR`, `h4` **FortiNDR (On-Premises)**, `item-id="fortindr-onprem"`, prioritária; curável como `FortiNDR`; papel idem |
| **C7** staffing+monitoring gap alto, endpoint lv1, FortiEDR on-prem, monitoring NONE | `soc-staffing` LEGACY + `socaas<gap>`; `continuous-monitoring` WHITESPACE/DIRECT `cand=[]` + `socaas<gap>`; `endpoint-detection` OPERATIONAL + `fortixdr/contextual-extension`; `serviceEligibility("fortiguard-mdr") = {eligible:false, reason:"base declarada apenas em deployments não elegíveis (on-prem/air-gapped) — OG oficial"}` | `FortiEndpoint` (validação) + `SOCaaS` (prio) + **`MDR` (prio)** | **1 card**: `FortiGuard SOCaaS` · `servico` · prioritária (gap-high, "sem restrições", `origem="gap"`); bloco de vetos: `FortiGuard MDR` — razão literal "…OG oficial" (capabilities: Cobertura de monitoramento; Capacidade e resiliência do time); `FortiEndpoint` — "tecnologia operacional… (nunca substituição) · Tecnologia declarada: FortiEDR (production, on-prem) · Extensão contextual da base instalada: FortiXDR — extensão de correlação sobre a base EDR instalada — nunca nova aquisição standalone (M50)" |
| **C7-UNSET** (variante de controle: `endpoint-detection` não declarado) | MDR: "base requerida ausente (…)" | — | MDR permanece **hipótese** (D-6), tier por `sev` — nada inventado |
| **C8** legado, endpoint lv0 | `contexts:{}` | `FortiEndpoint` · prioritária | igual + condição "sem contexto" em tela e papel (023 E1 preservada) |
| **C9** sinal `dataLeakageConcern` | `UNASSESSED/CONTEXTUAL`, `fortidlp` em 2 capabilities | `FortiDLP` · validação · sinal preservado | igual (`conversa-por-sinal`, `origem="sinal"`, 2 capabilities unidas — `D022-PROD1` intacto) + qualificador e origem no papel |
| **C10** whitespace `saasAllowed:"yes"` | analytics: `fortianalyzer, fortisiem, fortisiem-cloud`; endpoint: `fortiendpoint` | 3 cards prioritários | iguais, modo motor, `avaliar-aquisicao`; `FortiSIEM` com `data-p53-sol-variantes="fortisiem, fortisiem-cloud"` e linha "Disponível também como FortiSIEM Cloud" — a variante Cloud **não** vira card próprio (E2 preservada) |
| **F2-placeholder** (endpoint NONE, arquitetura desconhecida — fixture `D023-REG1`) | `endpoint-family/family`, `variants=[fortiendpoint, fortiedr]` | card `FortiEndpoint` · tier por sev | card `FortiEndpoint` · `modalidade-a-definir` · **após validação** · "Modalidade a definir no aprofundamento: FortiEndpoint ou FortiEDR" — `cards == published()` ✓ |

---

## 4 · O papel (`papelHTML`, `ui_p52_support_v32.js:794-834`)

Princípio intacto: o papel **lê os cards da tela** e copia (derivação, nunca recálculo — `D019-PAR1` por construção). O que muda é a lista do que copia:

| no card da tela | no `pr-card` | hoje |
|---|---|---|
| `data-p53-sol-produto` (linha) · `data-p53-sol-grupo` · `data-qs22-sinais` | idem (`:813-814`) | ok |
| `data-p53-sol-tier` + `.p53-sol-tierlabel` (texto) | **`data-p53-sol-tier`** + `<div class="pr-mut p53-pr-tier">indicação prioritária / após validação</div>` | **omitido** (QS-02; C5 0/9) |
| `data-p53-sol-chave` · `-item-id` · `-variantes` · `-acao` · `-origem` · `-condicao` | mesmos atributos | — |
| `txt(h4)` (título resolvido) | `<b>` = título (`:816` passa a ler o `h4`) | `<b>` = nome |
| `.p53-sol-variante` · `.p53-sol-acao` · `.p53-sol-condicao` · `.p53-sol-elig` | `.pr-mut.p53-pr-variante` · `-acao` · `-condicao` · `-elig` (texto copiado) | — |
| `.prod .scope` (movido, `v3_1_3.html:874`) **ou** `.scope.p53-sol-escopo` (montado do registro) | `.pr-mut.p53-pr-escopo` "Escopo: …" | **omitido** (QS-02, "camada endpoint") |
| `[data-p53-prov]` · `.pt-desc` · `li[data-p53-sol-cap]` · "habilitado por sinal declarado" | inalterados (`:815`, `:819-831`; âncora `D019-M4` `:820`) | ok |
| `:scope > [data-p53-vetos]` (depois dos cards) | `<div class="pr-mut p53-pr-vetos" data-p53-vetos="N"><ul><li data-p53-veto-item="<linha>" data-p53-veto-classe="…">…</li></ul></div>` — **não** é `.pr-card`, não carrega `data-p53-sol-produto` (contagens de `D023-PAP1`/`D010-PAPEL1` intactas) | — |
| guarda de seção vazia `:799` | `if (!cards.length && !aviso && !vetos) return "";` — C2/C4 imprimem a seção só com o bloco de vetos | — |

`[data-p53-suprimido]` no papel (`:801-802`, âncora `D023-M6`) fica **byte-igual**. Ordem pinada do relatório (`tests_010_vao.js:328-338`, `tests_p50_core.js:4278-4294`) não muda: `#pr-sup-solucao`, `h2` "Formas de apoio, por produto", opcional. Texto novo entra no papel por cópia do card (`txt()`), o mesmo caminho do tier — e os literais de `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` são conferidos contra `P52_COPY` (`ui_p52_workspace_v32.js:128-236`) antes de nascer (lição "copy de apresentação cega gate").

**Bloco de vetos na tela** (`declararVetos(sec, vetos)` em `ui_p52_support_v32.js`): `div.p53-sol-vetos[data-p53-vetos=N][role=note]` com título "Não indicado nesta leitura" e `ul > li[data-p53-veto-item][data-p53-veto-classe]`, um por linha vetada: nome da linha · motivo(s) literais · capabilities · "Tecnologia declarada: …" · `span[data-p53-sol-extensao="fortixdr"]` quando houver · "Serviço elegível nesta capability: …" quando houver. Invariantes de DOM (E17): entra **depois** dos cards e antes do botão do editor; classe fora de `CLASSES_CONTIGUAS` (`tests_010_vao.js:168`) — o censo o trata como "nó estranho" que encerra o grupo, exatamente como já trata `.p53-sol-suprimido`; nunca `.apoio-block` (fora de `data-p52-support-cards`, `:768-769`, e dos censos de `P52-REC1g`/`tests_023`); só existe com voz do motor, modo em que a região congelada está oculta. CSS só `p53-*` em `ui_p52_support_v32.css` (R9 §6), sem hex, cor nunca como único portador; no papel reaproveita `.pr-mut`.

---

## 5 · Arquivos e waves

### 5.1 Arquivos tocados (estimativa)

| arquivo | dono | o quê | linhas |
|---|---|---|---|
| `ui_curation_v32.js` | core-engineer | cabeçalho (+15); `chaveDe`/`idsDaLinha`/`tipoDaLinha`/`temVoz`/`capDaPergunta` (≈45); `entradaViva()` (≈35); `reconciliar(entrada)` + `veredictoDeServico` + fusão (≈120); `ofertados()` `:96-152` vira leitor (−50 +6); constante `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA` (1); bridge `oferta`/`vetos`/`reconcile` + `contract()` (+6). `valido`/`decidir`/`publicados`/`validar`/`daSessao`/`paraSessao`/`unset`: **0** | 316 → ≈ 495 (dentro de R9 §7) |
| `ui_p52_support_v32.js` | ui-engineer | `ofertaDoMotor()` `:247-346` vira leitor de `oferta()` (−95 +12), nome e literal `var produtos = ofertaDoMotor();` `:721` preservados; `cardDoProduto` `:383-472`: atributos novos + `h4 = p.titulo` + linhas `.p53-sol-variante/-acao/-condicao/-elig` (+32); `corpoDoMotor(p)` (+15) e `corpoDoCatalogo(id, nome, escopo)` (+6: `.scope.p53-sol-escopo`); `cardAcrescentado` (+2); `decorar` `:722` + `:740-741` + ramo `else` `:749-762` (+8); `declararVetos` (+35); `papelHTML` (+30); `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` (+22); comentário `:317-323` reescrito | ≈ +65 líquidas (872 → ≈ 940; já acima de 600 — justificativa no `plan.md`: a demanda **retira** derivação do módulo; o split é rota futura) |
| `ui_p52_support_v32.css` | ui-engineer (mesma delegação) | `.p53-sol-variante`, `-acao`, `-condicao`, `-elig`, `-escopo`, `-vetos`, `-veto`, `.p53-pr-*` | ≈ +35 |
| `ui_curation_edit_v32.js` | ui-engineer (delegação própria, **opcional** — D-9) | `linhaProduto` `:78-105`: `span.p53-cur-item-var` "apresentado como FortiEDR" lido de `b.oferta()`; `data-p53-cur-item` e `.p53-cur-item-nome` continuam a linha (`D025-UNS1` intacto) | ≈ +8 |
| `tests_026_contrato.js` (novo) | qa-engineer | 3 gates (§7), fixtures literais C1/C2/C3/C3b/C4/C5/C6/C7/C7-UNSET/C8/C9/C10/F2-placeholder por `__DEV` + escrita em `V32.TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT`/`SESSION_SIGNALS` (como `probe026.js:33-39`) | ≈ 320 |
| `tests_026_mutants.js` (novo) | qa-engineer | 4 mutantes obrigatórios + 2 pedidos pelo juiz QA (§7) | ≈ 110 |
| `tests_022_mutants.js` | qa-engineer | `D022-M10`: `file: F.apoio → F.estado` (linha-âncora transportada verbatim, 12 espaços, nome `reg2`) | 2 |
| `tests_019_curadoria.js` | qa-engineer | comentário-trilha em `D019-SOL1`/`SOL3 (b)`/`MED1` — asserção intacta | ≈ 6 (comentário) |
| `.claude/verify/expected_suites.json` · `mutation_map.json` | qa-engineer | `d026: {pass:3, fail:0}`; harness `d026` (`targets`: `ui_curation_v32.js`, `ui_p52_support_v32.js`, `ui_p52_support_v32.css`, `ui_curation_edit_v32.js`, `tests_026_*.js`; `insumos.oraculo: tests_026_contrato.js`); d019/d022/d023/d025 já têm os dois módulos em `targets` (`:404-405`, `:448-449`, `:472-473`, `:504`) | ≈ 40 |
| `.claude/verify/bridges.json` · `pins.json` · HTML gerado | build-engineer | nota do `__CURATION` (+`oferta`/`vetos`/`reconcile` puros); `gen_pins.py` no mesmo PR com motivo no commit (R8); `build_v32_html.py` sem mudança (os dois módulos já são injetados, `CURJS` `:22`) | gerados + 2 |
| `.claude/BACKLOG.md` · `CONTEXT.md` · `design-decisions.md` · `relatorio-final.md` | doc-writer / product-owner | `EA-76` → `resolvido`; candidatas novas (§10); verbetes; decisões ratificadas | doc |
| `engine_v32.js` · `quickscan_secops_soccmm_v3_1_3.html` · `ui_session_v32.js` · `ui_v32.js` · `SESSION_SCHEMA_V32.md` · `synthetic_session_examples/*` · `tests_019_mutants.js` · `tests_025_*` | — | **0** | 0 |

### 5.2 Waves (um módulo por delegação; dependência real dita a ordem)

| wave | delegação | entrega | depende de |
|---|---|---|---|
| **W0** | `product-owner` (+ `tech-lead` na spec) | ratificar D-1..D-9 (§10) no chat; verbetes em `CONTEXT.md` (*Registro de decisão de apoio*, *Hipótese condicionada*, *Veto do motor*, *Linha de produto*), por critério; `spec.md` com a tabela §2 e os gates §7 | — |
| **W1** | `qa-engineer` | `tests_026_contrato.js` + `tests_026_mutants.js` + `expected_suites.json`/`mutation_map.json`; **RED provado e commitado** (R3 §4): `__CURATION.oferta` ausente → todo gate falha **nomeando** (padrão `tests_022_escalonamento.js:151-153`). Oráculo = motor público (`classify`, `resolveCandidates`, `archSatisfied`, `serviceEligibility`, `suppressedByPlatform`, `engine_v32.js:811-817`) + pareamento **reimplementado no teste**, nunca `oferta()`; saída gravada em arquivo (nunca `\| tail`) | W0 |
| **W2** | `core-engineer` | `ui_curation_v32.js` (§1.3, §2) preservando os literais-âncora listados em §1.3 | W1 |
| **W3a** ∥ **W3b** | `ui-engineer` A: `ui_p52_support_v32.js` + `.css` (§3, §4) · `ui-engineer` B (opcional, D-9): `ui_curation_edit_v32.js` | arquivos distintos, mesma wave (R5 §Waves 2-3) | W2 |
| **W4** | `qa-engineer` | reancorar `D022-M10` (arquivo); comentário-trilha E13; preflight de âncoras (`ocorrencias === 1` para `D019-M1/M2/M4/M5/M7/M9/M13/M14/M15/M16/M17/M18`, `D022-M10`, `D023-M2/M6`, `D025-M2/M3/M5/M9/M23`); campanhas **sequenciais** d019 → d022 → d023 → d025 → d026 (mutam in place); mutante sobrevivente acusa o gate, não só o código; `run.sh` **e** `compliance-audit.sh` | W3 |
| **W5** | `build-engineer` | `gen_pins.py`; `bridges.json`; CI `verify` + `visual`: medir `playwright P8` (12 páginas, `tests_visual/print.spec.js:100`) e `P52-PDF5/6`; divergência = **repin de BASELINE declarado** com trilha, nunca afrouxamento; verificar que `expected_suites.json` carrega `d026` | W4 |
| **W6** | `doc-writer` + `product-owner` | backlog, `design-decisions.md` (D-1/D-2/D-7 como confirmadas após ratificação), `relatorio-final.md` com a matriz §3 e o **delta visível declarado**; aceite de intenção (Fase 6) | W5 |

---

## 6 · Gates existentes afetados — decisão por gate

Regra que governa o raio (inventário QA): legado, gate fechado e `CONTEXT_NOT_INFORMED` **mantêm** a oferta do MAP (hipótese), e nenhuma fixture de suíte reproduz C1/C2/C4/C6/C7. Sob essa regra:

| gate | classe | decisão |
|---|---|---|
| `D019-SOL1` (`tests_019_curadoria.js:372-407`, oráculo `computeFindings+MAP+PRODUCTS`, fixture legada) | não afeta | manter; **comentário-trilha** (E13). Com `data-p53-sol-produto` = linha e `[data-p53-sol-cap]` = `applyCopy(MAP.cap)`, o par (produto × capability) continua idêntico em legado |
| `D019-SOL3 (a)(b)(c)` (`:476-520`, tier por `sev`, dois tiers) | não afeta | manter; comentário-trilha em (b) |
| `D019-MED1` (`:326`, `OFERTA_DO_MOTOR` e `legacySnapshot` invariantes à exclusão) | não afeta | manter; comentário-trilha. `reconciliar()` é insensível ao estado do operador — o mutante `D019-M5` continua morrendo |
| `D019-PROV1 (c)` (`:297-300`, `cardDe` por `PRODUCTS[id].n`) | não afeta | manter (nome da linha no atributo) |
| `D019-CTX1 (a)(b)(c)` (`:553-600`; G4: `security-analytics`/`soc-platform` NONE, `saasAllowed:"yes"`) | não afeta | manter **sem reancoragem** (E3): `offered()` = linhas; `security-analytics` DIRECT resolve `fortianalyzer`/`fortisiem`+`fortisiem-cloud` → cards `FortiAnalyzer`/`FortiSIEM`; demais capabilities `CONTEXT_NOT_INFORMED` → hipóteses; MDR hipótese por D-6; `offered() ⊆ cards` ✓; fronteira inalterada (`:666`) |
| `D019-CARD1 (a)(b)` (`:682-716`) | não afeta | (a) a linha "linha de produto: FortiEndpoint" nunca é folha com texto igual ao nome; (b) `corpoDoMotor` e `corpoDoCatalogo` sempre montam `<img>` (`productIcon(chave)`) |
| `D019-CUR1/CUR2/INV8/SUF1/PRT1/PAR1/VAZ1/SOL2` | não afeta | manter (`catalog()` igual; estado só ids+enum; papel derivado; `grupoDoNome` por linha) |
| `D022-PROD1` (`tests_022_escalonamento.js:350`) | não afeta | manter (por sinal preservado por `relation`; 2 capabilities unidas) |
| `D022-M10` (`tests_022_mutants.js:109-116`) | **reancorar (arquivo)** | `file: F.estado`; linha transportada verbatim; ataque idêntico (guardar só a primeira capability) |
| `D022-INV1`, `D022-BND1`/`D023-BND1` | não afeta | `BND1` é a guarda de que o engine não foi tocado |
| `D023-OCU1/REG1/SUP1/ARB1/SUJ1/PAP1/DOM1/LEG1` (fixtures `tests_023_leitura.js:152-178`) | não afeta | F1 saas-only → tudo hipótese (D-6 mantém MDR); F2 endpoint NONE → placeholder `endpoint-family` → chave `FortiEndpoint` (`cards == published()` ✓, `d010HasSubstitute` ✓); F3/F7/F8 `offered()` não vazio; F8 (contexto + supressão total): substituto por capability continua |
| `D010-*` (`fixtures_010_vao.js:819+`, oráculo declarado `substituto:true` em F1/F1b/F4; F3 gate fechado) | não afeta — **guarda** | F1/F1b/F4 (`arch:{saasAllowed:"yes"}`, landscape `{}`) → `CONTEXT_NOT_INFORMED` → hipótese → `published()` não vazio; F3 → porta de saída §2.1 (gate fechado) → 2 cards contíguos (`D010-ARB1 (c)`). Se o proprietário inverter D-1/D-2, **parar e escalar** (§10) |
| `D015-*`, `U1/U7`, `P52-ICON3 (t2)`, `P52-LAY4/LAY5`, `P52-REC1/REC1g`, `S4-S5`, `S30-S32`, `S37`, `S69 (b)` | não afeta | oferta não vazia nos estados dessas fixtures; export inalterado; contador reescrito; idempotência do ramo `else` preservada (vetos reemitidos por remoção+inserção). `S69` `richLandscape`: `offered()` encolhe (vetos operacionais) e continua não vazio com id fora da oferta |
| `D025-*` (16) incl. `UNS1` (`:734`), fixtures (`:238-262`, `off.length ≥ 9` em legado) | não afeta | manter **sem reancoragem** (E3): checkbox por `PRODUCTS[off0].n` = `data-p53-cur-item`; legado = 9 ofertados |
| `D025-AUS1 (b)`, `D025-NEW1` (`[data-p53-suprimido] === null` sem curadoria) | não afeta — **guarda** | veto usa `data-p53-vetos` |
| `P51-DOC13`, `D010-PAPEL1`, `P52-PR1` | não afeta | `pr-sup-solucao` opcional, mesma posição; bloco de vetos não é `.pr-card` |
| `playwright P8` (12 páginas), `P52-PDF5/6` | **incerto → medir no CI (W5)** | tier + condição + escopo por `pr-card` e bloco de vetos podem repaginar `F7_target_up`; se mudar: repin de BASELINE declarado com trilha, nunca afrouxar; alternativa de layout: condensar tier + condição numa linha |
| mutantes `D019-M4/M5/M7/M9/M13/M14/M15/M16/M17/M18`, `D023-M2/M6`, `D019-M1/M2`, `D025-M2/M3/M5/M9/M23` | intactos se os literais não mudarem | preflight obrigatório (E14) |
| `expected_suites.json`, `mutation_map.json`, `pins.json` | registro | `d026` novo; contagens existentes inalteradas (nenhum gate novo em suíte antiga); `gen_pins.py` no mesmo PR |
| oráculo declarado de outra demanda que a 026 **não** toca | — | `D010_DECLARED.substituto`, `V10`/`D010-INV7` ("nenhum produto é inferido sem contexto", `ui_v32.js:670-679`), `D019-MED1` (payload M41), `D015-TIT1`. Queda em qualquer um → parar e escalar |

---

## 7 · Gates novos `D026-*` — só o que, sem eles, quebra em silêncio

Suíte `tests_026_contrato.js`, namespace `D026-*`, oráculo independente da implementação (motor público + pareamento reimplementado no teste), caso positivo/negativo/adversarial por gate nas fixtures.

| gate | arquivo | asserção (alíneas) | mutante previsto |
|---|---|---|---|
| **D026-REC1** "o motor vence a Camada 1 onde tem voz; a identidade é a chave, não o nome" | `tests_026_contrato.js` | (a) C1: pré `archSatisfied(OFFERINGS.fortiendpoint.architectureRequires) === "violated"`; card `[data-p53-sol-item-id="fortiedr"]`, `h4` "FortiEDR", `data-p53-sol-produto="FortiEndpoint"`, tier `prioritaria`, zero `[data-p53-vetos]`; (b) C2/C4: pré `supportMode==="CONTEXTUAL" && candidates.length===0`; zero `[data-p53-sol-produto]`; `[data-p53-vetos]` com `li[data-p53-veto-item]` por linha e `txt` contendo `ctx.notes[0]` literal e "Tecnologia declarada"; (c) C6: `item-id="fortindr-onprem"`, `h4 === OFFERINGS["fortindr-onprem"].name`; (d) C7: pré `serviceEligibility("fortiguard-mdr").eligible === false`; sem card "FortiGuard MDR"; `li[data-p53-veto-item="FortiGuard MDR"]` com a `reason` literal; card SOCaaS `prioritaria` `data-p53-sol-acao="servico"` (controle positivo); veto de endpoint com `[data-p53-sol-extensao="fortixdr"]`; (e) C10: `FortiSIEM` com `data-p53-sol-variantes="fortisiem, fortisiem-cloud"`, sem card "FortiSIEM Cloud"; (f) **precedência**: em C7 nenhum card com `data-p53-sol-produto="FortiGuard MDR"` apesar da hipótese de `team-capacity`; (g) **totalidade**: `chaveDe` (reimplementado) definido sobre todo `OFFERINGS ∪ SERVICES`, toda chave de `PRODUCTS` com ≥ 1 pré-imagem, e `fortisoc`/`fortimail*`/`fortiaigate`/`fortipam`/`fortiauthenticator`/`fortisat` → `null`; (h) `published()` ≡ conjunto de `data-p53-sol-produto` da tela ≡ do papel em C1/C7/C10 | `D026-M1` (`ui_curation_v32.js`): `reconciliar` trata todo `ctx` como `CONTEXT_NOT_INFORMED` (ignora `temVoz`) → C1/C2/C4/C7 voltam ao MAP; `D026-M5` (QA): remove a precedência veto > hipótese → C7 publica MDR |
| **D026-PAP1** "o papel diz o que a tela diz, por card" | `tests_026_contrato.js` | para cada `pr-card` de `#pr-sup-solucao` após `beforeprint`: `data-p53-sol-tier`, `-acao`, `-item-id`, `-origem`, `-condicao` iguais ao card homônimo da tela; `.p53-pr-tier` com o texto do tier; C5: 9/9 com qualificador e `pr-card[FortiEndpoint]` contendo "Escopo: cobre a camada de endpoint"; C1: `<b>` "FortiEDR" + `.p53-pr-variante`; C9: "após validação" + `data-p53-sol-origem="sinal"`; C2/C7: `.p53-pr-vetos[data-p53-vetos]` com a mesma contagem e os mesmos `data-p53-veto-item` da tela | `D026-M2` (`ui_p52_support_v32.js`): `papelHTML` omite `data-p53-sol-tier`/`.p53-pr-tier` (só no papel — padrão `D019-M4`) |
| **D026-LEG1** "sem voz do motor nada é inventado; a derivação é pura" | `tests_026_contrato.js` | (a) C8 legado: card `FortiEndpoint`, `acao="hipotese"`, `condicao="sem-contexto"`, tier `prioritaria`, zero `[data-p53-vetos]`; oferta ≡ `computeFindings()+MAP` (o oráculo do `D019-SOL1`, aqui **declarado** como oráculo de hipótese); (b) C7-UNSET: MDR card hipótese (D-6), zero veto; (c) C3: card `FortiSOAR` `condicao="capability-nao-informada"`, zero veto, `[data-p53-suprimido]` ausente — pina a constante em `false`; C3b: sem card, veto `plataforma`/`operacional` com "M75"; (d) gate fechado (`poucasRespostas`) com `endpoint-detection` NONE: cards de hipótese, zero veto; (e) em toda fixture com `[data-p53-vetos]` (C2/C4/C7/C3b), `FX010.d010HasSubstitute(w) === true` e a região congelada oculta; (f) **pureza**: `reconcile(entrada)` duas vezes → JSON idêntico; `legacySnapshot()` e `JSON.stringify(buildRecommendationContext())` byte-iguais antes/depois de `oferta()`/`vetos()`/`contract()` (precedente `D022-INV1`, snapshot antes do primeiro render); (g) `set("FortiEndpoint","exclude")` em C1 retira `[data-p53-sol-item-id="fortiedr"]` da tela e do papel e conta `[data-p53-suprimido="1"]` nas duas; `unset` devolve o card | `D026-M3` (`ui_curation_v32.js`): `chaveDe` pareia só por nome (regras 2–3 removidas) → `fortiedr` vira chave própria e `"FortiEndpoint":"exclude"` deixa de retirar o card; `D026-M4` (`ui_p52_support_v32.js`): `declararVetos` escreve `data-p53-suprimido` em vez de `data-p53-vetos` → `D025-AUS1 (b)` cai (carrasco em suíte alheia, declarado); `D026-M6` (QA): remove a exceção D-6 → MDR vetado em C7-UNSET |

Três gates, quatro mutantes obrigatórios (M1–M4) e dois pedidos pelo juiz QA (M5, M6) sobre as mesmas fixtures. `d026` com `preflight: true` e `targets` nos módulos tocados. Se o proprietário quiser menos instrumento, M5/M6 viram alíneas sem mutante próprio (a propriedade continua medida por (f) e (b)).

---

## 8 · Invariantes, importação substitutiva (025), riscos, rollback

| invariante | efeito | prova |
|---|---|---|
| INV-1 engine byte-idêntico | zero toque; `V32.*` só lido; `TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT` nunca escritos pela derivação | `D022-BND1`/`D023-BND1`, stages `baseline`/`build`/`m41`; alínea (f) de `D026-LEG1` |
| INV-2 UNSET ≠ NONE | reforçada: `UNSET`/`UNKNOWN` nunca viram ausência — hipótese condicionada (D-6); veto só sobre landscape **declarado** | `D026-LEG1 (b)` |
| INV-3 suficiência; UI nunca dona | gate fechado ⇒ porta de saída (bridge `__P50SUFF`), nenhum veto; a apresentação **compõe** decisões do engine e do operador, não decide | `D010-F3`, `D019-SUF1`, `D026-LEG1 (d)` |
| INV-4/5/6 | nada de score/target/refinamento é lido ou escrito | `D022-INV1` |
| INV-7 narrativa determinística, derivada de evidência | `reconciliar()` é função pura de (respostas, MAP, contexto, catálogo); textos = literais do engine + rótulos fixos; `fontes[]` nomeia a resposta/sinal de origem | `D025-INV8`, `D026-LEG1 (f)` |
| INV-8 derivado nunca serializado | `decisions` continua `{ chave → enum }`; `oferta()`/`vetos()` nunca entram em `toSession()` (`:199-204` intacto); nenhum `data-*` é lido de volta como decisão | `S4-S5`, `D019-INV8`, `D025-INV8` |
| INV-9 boundary | só classes `produto`/`generated` (HTML via builder) | stage `build` |
| INV-10 PT-BR / nomes exatos | enums em PT-BR sem acento (`avaliar-aquisicao`, `hipotese`), como `prioritaria`/`validacao` já são; ids do engine copiados literalmente | `compliance-audit` |

Invariantes do plano da auditoria (§2, 1–10): 1/2/4/8 cobertas acima; 3 (prioridades fora dos cards) — `businessPriority` não é lido; 5 — nada persiste; 6/7 — abaixo; 9 — contagens só **sobem** (`d026`), pins por `gen_pins.py`, nenhum gate afrouxado; 10 — fixtures sintéticas de `cen/*.json`.

**Importação substitutiva (025).** `validate`/`fromSession`/`toSession`/snapshot/commit/rollback (`ui_curation_v32.js:199-263`; `ui_session_v32.js:69-77, :239-244, :548, :619-637`) **não mudam**; a chave de `decisions` continua a da Camada 1; arquivos existentes (inclusive `synthetic_session_examples/exemplo-completo.json`) importam com o **mesmo significado** — `"FortiEndpoint":"exclude"` continua retirando o card da linha qualquer que seja a variante resolvida. Depois de importar, o render recomputa a reconciliação sobre o engine já restaurado — o registro não tem ciclo de vida próprio, logo A curada seguida de B importada/nova/reiniciada não contamina B (`D025-TRX1/TRX2/TRN1/TRN2` medem o mesmo objeto). Residual honesto: `include` pré-025 sobre produto que o motor passa a vetar vira "escolha do engenheiro" com selo — uma linha no relatório, não código.

**Riscos e detecção.**

| risco | detecção | mitigação |
|---|---|---|
| `P8` (12 páginas) / `PDF5-6` mudam | job `visual` (W5) | repin declarado; condensar tier + condição |
| fixture futura com gate fechado **e** capability declarada NONE | `D026-LEG1 (d)` | porta de saída §2.1 já cobre: hipótese, sem veto |
| `hasSubstituteV32` e `temVoz` divergirem um dia | `D026-LEG1 (e)` | comentário-trilha cruzado nos dois módulos; a alínea mede a propriedade, não a cópia |
| regra 3 do pareamento com catálogo futuro (família com dois representantes pareáveis) | `D026-REC1 (g)` | cai em `null` = incurável; nunca inventa par |
| literal de `ctx.notes` como texto visível | — | é dado do engine por desenho (o mesmo que `#v32support` faz, `ui_v32.js:639`) |
| `P52_COPY` reescrevendo rótulo novo no papel | conferência na W3 | tabela `:128-236` lida antes de fixar `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` |
| âncoras de mutante apodrecendo em silêncio | preflight (E14) | campanhas sequenciais |

**Rollback.** Um PR; `git revert` do merge devolve o HEAD byte a byte — nenhuma migração de dado, schema ou sessão. O Docker em `127.0.0.1:1337` segue servindo o HTML anterior até o deploy manual (`deploy/` fora do git; merge não é entrega).

---

## 9 · Objeções fatais levantadas — resposta a cada uma

| juiz | objeção | resposta |
|---|---|---|
| PO | A: contrato duplo (`offered()` no MAP × tela no motor); editor lista o vetado; `D026-CUR1 (c)` pina a incoerência; falha o aceite QS-01; `EA-76` fica aberto | **Acatada** — A não é adotado. Fonte única em `ui_curation_v32.js` (`ofertados()` `:96-152` vira leitor de `reconciliar()`); o editor (`ui_curation_edit_v32.js:72-75`, `:200-208`) lê `offered()` do mesmo registro; `EA-76` → `resolvido` |
| PO | A: quebra por construção `published() ≡ cards`/`offered() ⊆ cards` (`D019-CTX1 (a)` `:559-568`, `D023-OCU1 (b)`, `D023-REG1 (c)` `:356-358`, `D023-PAP1 (b)`) ao vetar MDR sob base UNSET | **Acatada em duas frentes**: `published()` deriva dos mesmos registros (identidade por construção) e D-6 (`engine_v32.js:483-484` "base requerida ausente" com `deriveTechState` `UNSET`/`UNKNOWN` `:364-365` ⇒ abstenção) |
| PO | A: lê UNSET como ausência declarada (INV-2) | **Acatada**: D-6; `temVoz()` espelha `ui_v32.js:750-752`; veto só sobre landscape declarado |
| PO | A: lógica de decisão no módulo do ui-engineer (872 → ≈1.080, R9 §7; tabela R5) | **Acatada**: derivação no `core-engineer` (316 → ≈495); `ui_p52_support_v32.js` perde derivação |
| PO | B e C — nenhuma objeção fatal | registrado |
| QA | nenhuma fatal pelos critérios do enunciado (engine intocado; bridge por módulo; curadoria não entra na derivação) | registrado; o FINAL mantém as três propriedades (`reconciliar()` não lê `estado`; `D019-MED1` continua verdadeiro) |
| QA | A grave: `julgarLinha` veta serviço antes do ramo `CONTEXT_NOT_INFORMED`; `linhaDe("endpoint-family") === null` (nó sem campo `family`, `engine_v32.js:87`); divergência editor×tela | **Acatada**: regra 3 do pareamento trata o nó de família (`entityType === "family"` → `fam = itemId`, representante único pareável) e exige unicidade — sem ela `fortisoc` parearia com "FortiAnalyzer"; D-6 antes de qualquer veto de serviço |
| QA | B grave: C7 publica "FortiGuard MDR · prioritária" pela hipótese de `team-capacity` (listas paralelas sem fusão); D-4 muda o contrato do schema v1 sem bump | **Acatada**: precedência veto > hipótese (§2.5) + `D026-REC1 (f)` + `D026-M5`; D-4 **retirado** — zero linha em `valido()` `:154-159`, `unset()` `:290-295`, `SESSION_SCHEMA_V32.md`, `RESERVED_DERIVED` deixa de ser tema |
| QA | C grave: `PAREAR` passo 3 devolve `null` para o próprio nó de família → F2 dois registros → `D023-REG1` reprova; custo instrumental | **Acatada** no critério (idem acima); C não adotado pelo custo (diretrizes 2026-09-11/13), com suas ideias enxertadas (E1, E2, E8, E10, E11, E16) |
| core | A: não entrega contrato único; em C3 a exclusão esvazia `published()` → `hasSubstituteV32` falso (`ui_v32.js:751`) → Camada 1 volta com o FortiSOAR vetado | **Acatada e generalizada**: `temVoz()` + constante C3 default `false` (§2.6); alínea `D026-LEG1 (e)` mede `d010HasSubstitute === true` em toda fixture com veto |
| core | A: lógica de decisão em módulo decorador do ui-engineer | **Acatada** (idem) |
| core | B — condições: cortar D-4; nascer com a derivação C3 desligada; aplicar D-6 | **Todas acatadas** (E2, E6, E1) |
| core | C: instrumento acima do produto; D-5 (veto só no `diag()`) deixa C3 sem correção visível e C7 sem a razão do MDR | **Acatada**: vetos visíveis nas duas superfícies com marcador próprio (B); C3 tratado por §2.6 sem Camada 1 de volta |
| PO (nota, não fatal) | B: linha de serviço nunca consulta `serviceEligibility` em `CONTEXT_NOT_INFORMED` (F2/G8) | **Acatada**: `veredictoDeServico` em todo modo não-legado (§2.4) |
| PO / core (notas) | B: cache `ultimaOferta`; D-8 (`data-p53-sol-produto` = variante) força reancorar `D019-CTX1 (a)`/`D025-UNS1` | **Acatadas** (E3): atributo = linha; `titulo` separado; sem cache; zero reancoragem de gate existente |

---

## 10 · Decisões que pertencem ao proprietário (via `product-owner`, antes da W1)

| id | decisão | recomendação | se invertida |
|---|---|---|---|
| **D-1** | C2/C4: **sem card de aquisição**; veto visível com a nota literal do motor; a ação "operacionalizar/expandir" permanece no card de capability (`#v32support`/`#pr-support`, `ui_v32.js:636-640`) | sim — é o que `specs/010-recomendacao-sem-vao/spec.md:461-462` manda ("sob contexto declarado a autoridade é o engine"); um card Fortinet com "operacionalizar" afirmaria relação com produto que o cliente não tem | card da linha com ação e sem tier: `hasSubstituteV32` segue verdadeiro, mas o produto vetado volta a ter nome na seção |
| **D-2** | `CONTEXT_NOT_INFORMED` (inclui as 3 capabilities `landscapeEnabled:false`) = hipótese condicionada com tier por `sev` | sim — a alternativa ("sempre após validação" / "sem produto") rebaixa governança/time/competências em toda sessão com contexto e, em F1/F1b/F4 da 010, torna falso o oráculo declarado `substituto:true` → **parar e escalar** (35 gates por vácuo) | escalar; nunca reancorar por conta |
| **D-3** | C3: `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA` **= false** (hipótese condicionada; lacuna do engine ao backlog; C3b como caso "plataforma cobre") | manter `false` — ligar sem a cláusula em `hasSubstituteV32` devolve a Camada 1 (§2.6); se o proprietário quiser C3 visível agora, a forma segura é a condição `plataforma-declarada-cobre` + tier 2 no card, nunca veto | `true` com a forma segura: 1 linha + alínea (c) ajustada |
| **D-4** | vetos do motor **visíveis** nas duas superfícies, agrupados por linha, com razão literal e "Tecnologia declarada" | sim — é a "razão de supressão" do QS-01; sem ela C7 vira silêncio sobre o MDR, que é o que a auditoria mediu | só no `diag()`: C7 sem explicação ao facilitador |
| **D-5** | serviços do motor e `fortixdr` **não** viram card quando o MAP não os oferece para a pergunta; entram nomeados na nota/veto | sim — fronteira da E2/022; `#v32support` já os lista; delta visível e `P8` menores | alargar = demanda própria (cards novos ao cliente; `PORTFOLIO`; ícones) |
| **D-6** | linha de hipótese condicionada **visível em tela e papel nos dois modos** (`CONDICAO_TXT` por enum; em legado "contexto tecnológico não informado nesta sessão") | sim — aceite do plano ("contexto ausente gera hipótese condicionada") e QS-02 ("a hipótese pode parecer recomendação definitiva") pedem legibilidade no PDF; é uma linha | só fora do legado: C8/C5 ficam como hoje na tela; o atributo `data-p53-sol-condicao` continua nos dois |
| **D-7** | título do card = item resolvido quando a chave fundiu um só item (C1 "FortiEDR", C6 "FortiNDR (On-Premises)"); `data-p53-sol-produto` = linha | sim — `#v32support` já nomeia "FortiEDR"; as duas leituras da mesma tela passam a nomear o mesmo item; reabre a E2/022 **só na forma** (nenhum card a mais) | `h4` = linha + sub-linha de variante; `item-id` só em atributo/papel |
| **D-8** | "condições" do acréscimo manual (§9.3 da auditoria) **não** existem no estado (019 C1: ids + enum) — limitação declarada | manter: criar texto livre no estado contraria `D019-CUR1`/INV-8; demanda própria se quiser | — |
| **D-9** | editor mostra "apresentado como <variante>" (W3b, +8 linhas, `data-p53-cur-item` = linha) | sim, barato e fecha "mesma decisão no editor" de forma legível | zero linha no editor; a decisão já é a mesma por construção |

Guarda de escalonamento: queda de qualquer oráculo declarado de outra demanda (`D010_DECLARED.substituto`, `V10`/`D010-INV7`, `D019-MED1`, `D015-TIT1`) na W4/W5 → **parar e escalar**, nunca reancorar.

---

## 11 · Fora de escopo (declarado, com rota)

- **Engine** (`engine_v32.js`, frozen): lacuna "`sup.caps` não consultada no ramo `CONTEXT_NOT_INFORMED`" (`:573`, `:584`, `:636` vs `:601-602`); `violated` descartado em silêncio (`:448`); serviço inelegível descartado em silêncio (`:659`). Backlog, Porta B futura.
- **`ui_v32.js`**: cláusula em `hasSubstituteV32` para contar veto-com-razão como substituto (só se D-3 for ligada por veto). Fora desta demanda.
- **Itens sem par na Camada 1** (`chave:null`: `fortisoc`, `fortimail*`, `fortiaigate`, `fortipam`, `fortiauthenticator`, `fortisat`, 14 serviços de assessment/IR): publicáveis e incuráveis, como hoje; `published() ≠ cards` latente nesse caso. Rota: Porta B em `PRODUCTS` (`specs/019-curadoria-do-relatorio/spec.md:215-218`, payload M41) ou alternativa (3) da lente data-engineer **restrita** a esse grupo, em demanda própria; qualquer id novo em `decisions` fica sujeito a `RESERVED_DERIVED` (`ui_session_v32.js:34-37`).
- **Serviços do motor sem linha do MAP na pergunta** e `fortixdr` como card (D-5): demanda própria.
- **`exclude` obsoleto sem sujeito** no arquivo de sessão (`ui_curation_v32.js:170-179 → :312`): achado de backlog, não desta demanda.
- **Blocos `[data-pr-gap-support]`** (`D021-*`, `P51-REC1`, derivados do MAP em `ui_v32.js`): fora do escopo declarado da 026.
- **Memoização** de `reconciliar()` por passagem: otimização futura.
- **Decisões metodológicas da microfase 02** do plano (nome do resultado, equivalência SOC-CMM, confiança, bug decimal, crosswalk, licença/atribuição, neutralidade): outras demandas.
- **Deploy/release**: merge, selagem e deploy manual em `127.0.0.1:1337` são do proprietário.
