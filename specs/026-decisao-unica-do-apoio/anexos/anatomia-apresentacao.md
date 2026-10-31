# Anatomia da apresentação por produto e do papel — demanda 026 (lente ui-engineer, somente leitura)

Base: `develop @ 9509e4b`. Fontes lidas inteiras ou nas faixas citadas: `ui_p52_support_v32.js` (872 linhas), `ui_p52_support_v32.css`, `ui_v32.js` :105-215, :585-790, :1406-1720, `ui_p52_workspace_v32.js` :2960-3000, :3270-3330, `quickscan_secops_soccmm_v3_1_3.html` :255-280, :455-468, :860-1030, `engine_v32.js` :80-210, :436-490, suítes `tests_010_vao.js`, `tests_019_curadoria.js`, `tests_019_mutants.js`, `tests_022_escalonamento.js`, `tests_023_leitura.js`, `tests_025_curadoria_sessao.js`, `tests_p52_chromium.js`, `tests_visual/*.spec.js`, `.github/workflows/verify.yml`, `.claude/verify/expected_suites.json`, `.claude/verify/bridges.json`. Medições: saídas da sonda do orquestrador em `scratchpad/out/C1..C10.json`.

---

## 1. Ciclo de vida do card (tela)

### 1.1 Gatilho e ordem
- O módulo é IIFE com bridge único `window.__P53SOL = { __installed, grupos(), grupoDe(), printHTML(), diag() }` (`ui_p52_support_v32.js:848-871`), registrado em `.claude/verify/bridges.json:75`.
- Registra `seguro()` → `decorar()` em `__P50.registerDecor` (`:844-846`), DEPOIS do workspace 5.2 (ordem de injeção do builder). `decorar()` roda a cada passagem do workspace (MutationObserver) e é idempotente (`:744-762`).

### 1.2 Passo a passo de `decorar()` (`:683-773`)
| # | Função | Linhas | O que faz | O que escreve no DOM |
|---|---|---|---|---|
| 1 | `arbitragemEmCurso()` | `:198-205` | `true` se algum filho DIRETO de `[data-p52-legacy-scope="support"]` (ou `section.screen`) tem `.v32-hidden` | nada |
| 2 | `blocosLegados(ws)` | `:206-211` | colhe `.apoio-block` SEM `data-p53-sol-produto` e NÃO ocultos (`oculto()` `:173-177` sobe a árvore procurando `.v32-hidden`) | nada |
| 3 | `ofertaDoMotor()` | `:247-346` | **fonte 1** (`:253-271`): `computeFindings().findings` × `MAP[f.id].lv[f.lvl].c[].p` → `PRODUCTS[id]`; `tier = (f.sev===2) ? 1 : 2`, menor vence; `caps` = `__P52.applyCopy(m.cap)`. **fonte 2** (`:291-337`): `V32.buildRecommendationContext().contexts[cap].candidates` filtrados por `itemKind==="offering" && signals.length` → tier 2 fixo, chave pelo NOME exibido, `caps` = `applyCopy(CAPABILITIES[cap].name)`, `sinais` = `sigPT(sg)`. Registro: `{ id, nome, tier, prod:null, caps:[], sinais?:[] }` | nada |
| 4 | `prodLegadoDe(ws, nome)` | `:351-363` | acha o `.apoio-block .prod` visível cujo `.pt-name` === nome (só existe para `sev 2`, primeira aparição — a segunda é `.prod-mini`, v3_1_3 `:870`) | nada |
| 5 | filtro de curadoria | `:732-733` | `decisaoDe(nome) !== "exclude"` (`__CURATION.decide(idDoNome(nome))`, `:136-141`) | nada |
| 6 | `cardDoProduto(p)` | `:383-472` | monta o card (ver §1.3) | card desanexado |
| 7 | `acrescimos()` → `cardAcrescentado(id)` | `:570-583`, `:517-546` | um card por decisão `include` que é `isOperatorChoice` e não está na oferta | card desanexado |
| 8 | remoção das cascas | `:738-739` | `removeChild` dos `.apoio-block` legados visíveis (depois de mover o `.prod`) | **subtração** |
| 9 | `colocar(sec, cards, arbitrando)` | `:644-680` | remove `[data-p53-sol-lead]` antigo; se `arbitrando && cards.length` anexa `fronteira()` (`<p class="p53-sol-lead" data-p53-sol-lead="1">`, `:639-642`); anexa cards **diretos em `#p52-sec-support`**, na ordem de `GRUPOS` (`:68-77`) | cards + fronteira |
| 10 | `declararSupressao(sec, publicados, suprimidos)` | `:598-615` | remove aviso antigo; se `suprimidos>0` anexa `<div class="p53-sol-suprimido" data-p53-suprimido="N" role="status">` | aviso |
| 11 | contador | `:768-769` | `sec.setAttribute("data-p52-support-cards", nº de :scope > .apoio-block)` — reescreve o que o workspace escreveu em `ui_p52_workspace_v32.js:2985` | atributo |
| 12 | `ponteiro(details.t-details)` | `:503-507`, `:771` | remove o `<details>` só se vazio (sem `.apoio-block` nem `.t-item`) | subtração condicional |

Ramo idempotente (`:744-762`): sem legado e já consolidado, relê `:scope > .apoio-block[data-p53-sol-produto]`, remove os recém-excluídos, reaplica `acrescimos`, `colocar`, `declararSupressao`.

### 1.3 Marcação do card — `cardDoProduto` (`:383-472`)
```
div.apoio-block.p53-sol-card
    [data-p53-sol-produto = nome exibido (PRODUCTS[id].n ou OFFERINGS[id].name)]
    [data-p53-sol-grupo   = id de GRUPOS | "nao-classificado"]
    [data-p53-sol-tier    = "prioritaria" | "validacao"]          (:394)
    [data-qs22-sinais     = "sinal A, sinal B" | ""]               (:398 — SEMPRE presente, mesmo vazio)
  ├ div.p53-sol-chiprow                                            (chipDoGrupo :371-382)
  │   ├ span.p53-sol-chip[data-p53-sol-grupo-nome=grupo]  "SIEM, analytics e retenção"
  │   └ span.p53-sol-tierlabel  "indicação prioritária" | "após validação"   (texto visível do tier)
  ├ h4  nome
  ├ div.p53-sol-prov[data-p53-prov="operador"]  PROV_TXT          (só se isOperatorChoice, :424-425)
  ├ div.why.p53-sol-why  "Atende N capabilit(y|ies) desta leitura."
  ├ div.prods
  │   └ div.prod  (MOVIDO do bloco congelado, sem .pt-name :449-451)  OU corpoDoCatalogo (:553-569)
  │       ├ span.icon-tile > img[src=productIcon(id)][alt=nome]
  │       └ span
  │           ├ div.pt-desc  "descrição[ Neste contexto: w.]"      (congelado v3_1_3 :873)
  │           ├ div.scope    "Escopo: sn."                          (SÓ no .prod movido; v3_1_3 :874)
  │           └ a.pt-link    "Página oficial ↗"
  └ ul.p53-sol-caps > li.p53-sol-cap[data-p53-sol-cap=cap]  cap
```
`cardAcrescentado` (`:517-546`): mesma casca + classe `p53-sol-card-add`, **sem** `data-p53-sol-tier`, **sem** `data-qs22-sinais`, **sem** `ul.p53-sol-caps`, com `p53-sol-prov` sempre.

### 1.4 Quem lê cada atributo/classe (gates) — âncoras que um desenho novo não pode mover
| Marca | Lida por | Mutante ancorado |
|---|---|---|
| `.apoio-block` (classe do card) | `P52-REC1g` `tests_p52_chromium.js:691,738` (`:scope > .apoio-block`, grade/colunas); `P52-PR1` `:1492` (censo visível tela×baseline); **censo da Camada 1** `tests_010_vao.js:168,192` (`CLASSES_CONTIGUAS`) e `tests_023_leitura.js:262` — o card p53 É contado como "bloco contíguo" quando segue um título de `HIDE_EYEBROWS` | — |
| `data-p52-support-cards` (na seção) | `P52-REC1g:717-720` (contador = cards medidos) | — |
| `data-p53-sol-produto` | `D019-SOL1 :387-394`, `D019-SOL3 :492-524`, `D019-PROV1 :283`, `D019-PAR1 :723-731`, `D019-CTX1 :562-578`, `D019-MED1 :689-703`, `D022-PROD1 :361-365`, `D023-*` `tests_023_leitura.js:266-278`, `D025 :162,:193` | — |
| `data-p53-sol-grupo`, `data-p53-sol-grupo-nome` | `D019-SOL2 :412-446` | `D019-M7` (`tests_019_mutants.js:160`) |
| `data-p53-sol-tier` | `D019-SOL3 :515-524` (bate contra `computeFindings+MAP`, **só na tela**) | `D019-M16 (:248)` |
| `data-p53-sol-cap` | `D019-SOL1 :393`, `D022-PROD1 :382` | — |
| `data-p53-prov` | `D019-PROV1 :288-298` (tela E papel), `D025 :192,:534` | `D019-M4 (:100)` — remove só no papel |
| `data-qs22-sinais` | `D022-PROD1 :371` (no PAPEL, `#pr-sup-solucao`) | `D022-M10` |
| `data-p53-suprimido` | `D019-VAZ1 :784`, `D023 :403-407,:495-502,:571`, `D025 :163` | `D019-M9 (:179)`, `tests_023_mutants.js:135` (papel) |
| `data-p53-sol-lead` | `D019-CTX1 :574-578,:613,:628,:656` (três controles) | `D019-M17 (:214)`, `D019-M18 (:230)` |
| `data-p52-legacy-scope="support"` (seção) | `tests_010_vao.js:169-173`, `tests_023_leitura.js:247`, `hideLegacyRecommendation` `ui_v32.js:190` | — |
| remoção do `.pt-name`, `icon-tile` | `D019-CARD1` | `D019-M13 (:256)`, `D019-M14 (:261)` |
| `#pr-sup-solucao` + h2 `/formas de apoio, por produto/i` | ordem do papel `tests_010_vao.js:330-338` (opcional), `tests_p50_core.js:4278-4294` (opcional) | `D019-M8 (:169)` (`D019-PAR1`) |
Literal strings do módulo que são `find:` de mutantes (`tests_019_mutants.js:100,115,160,179,214,230,240,248,256,261`): qualquer edição em `ui_p52_support_v32.js` que mude essas linhas apodrece a âncora (ver memória "rename apodrece âncora").

---

## 2. O papel — `papelHTML()` (`:794-834`) → `__P53SOL.printHTML` (`:863-866`)

Consumo: `buildPrintReport()` `ui_v32.js:1566` concatena a string depois de `#pr-support` (`:1535`) e das ondas, antes de `__uxJourneyPrintHTML` (`:1567`); `preparePrint()` `:1585-1617` faz `el.innerHTML = html` (`:1615`) em `#v32-print-report` (módulo 4.x) e põe `body.v32-print-mode`; disparo em `beforeprint` `:1675-1677` (fallback `v32PrintFallback` `:1662-1673`). Depois, `ui_p52_workspace_v32.js:3316-3319` aplica `p52Copy(#v32-print-report)` (substituições literais de `P52_COPY` `:128-236`), e o wrapper de `buildPrintReport` `:3293-3310` faz o mesmo na string quando `/[Mm]andato|charter/` casa.

### 2.1 O que o papel COPIA do card
| Papel (`#pr-sup-solucao`) | Fonte no card | Linha |
|---|---|---|
| `h2` "Formas de apoio, por produto" | fixo | `:800` |
| `div.pr-mut[data-p53-suprimido=N]` + texto do aviso | `:scope > [data-p53-suprimido]` | `:801-802` |
| `h3[data-p53-sol-grupo-nome=gid]` nomeDoGrupo | troca de `data-p53-sol-grupo` entre cards (ordenados) | `:808-811` |
| `div.pr-card[data-p53-sol-produto][data-p53-sol-grupo][data-qs22-sinais?]` | atributos do card (`data-qs22-sinais` só se não vazio) | `:812-814` |
| `div.pr-mut` "habilitado por sinal declarado: …" | `data-qs22-sinais` | `:815` |
| `<b>nome</b>` | `data-p53-sol-produto` | `:816` |
| `div.pr-mut[data-p53-prov=operador]` PROV_TXT | presença de `[data-p53-prov]` | `:819-820` |
| `div.pr-mut` txt(`.pt-desc`) | `.pt-desc` (inclui "Neste contexto: w." do MAP, pois está dentro de `.pt-desc`) | `:821-822` |
| `ul > li[data-p53-sol-cap]` | `[data-p53-sol-cap]` | `:823-830` |

### 2.2 O que o papel OMITE (presente no card da tela)
| Item | No card | No papel | Medição |
|---|---|---|---|
| **tier / qualificador** — atributo `data-p53-sol-tier` e texto `.p53-sol-tierlabel` ("indicação prioritária"/"após validação") | sim (`:379-380`, `:394`) | **não** — `pr-card` não carrega o atributo nem o texto | C1–C7 `papel.cards[].tierAttr = null`, `temIndicacaoPrioritaria=false`, `temAposValidacao=false`; C5: 9 cards, zero qualificadores |
| **nota de escopo da Camada 1** `.scope` "Escopo: …" | sim, quando o `.prod` foi movido | **não** (só `.pt-desc` é lido) | C5 tela FortiEndpoint: "…Escopo: cobre a camada de endpoint; demais componentes…"; papel: ausente |
| `.why.p53-sol-why` "Atende N capabilities" | sim | não (a lista `ul` cobre) | — |
| chip de grupo no card | sim | substituído por `h3` por grupo | — |
| `a.pt-link` (URL oficial) | sim | não (o `#pr-support` imprime `p52-sup-link`; o p53 não) | — |
| `img.icon-tile` | sim | não (P52-PDF3 mede ícones só do `.v32-icon` em `#pr-support`) | — |
| classe `p53-sol-card-add` (borda tracejada do acrescentado) | sim | não (só o texto de proveniência) | — |
| `role="status"` do aviso | sim | não | — |

Único `data-*` do card que o papel ignora: **`data-p53-sol-tier`**. Os demais são copiados ou não existem como atributo.

### 2.3 O que NEM o card NEM o papel carregam (decisões do motor sem assento na superfície)
Do registro de `ofertaDoMotor()` nunca saem: `classification`/`supportMode` do contexto (`engine_v32.js:392`), `relation` do candidato, `scopeNote` do motor (`:454`), `variantResolution`/`variants` (`:462-466`), `itemId` do motor (C6: motor `fortindr-onprem`, card "FortiNDR" — nome de `PRODUCTS`, sem variante), `services` e elegibilidade (`serviceEligibility` `:472-490`; C7: MDR inelegível no motor, card "FortiGuard MDR prioritária" vindo do MAP `monitoring-coverage`), `notes` de operacionalização (`:588`, `:641`), `suppressedByPlatform` (`:500`; C3 FortiSOAR). O card expõe só `tier` (sev do gap), `caps`, `sinais`, `prov`. É a "segunda fonte" do `EA-76`: o card nasce de `computeFindings+MAP`, não de `buildRecommendationContext`.

---

## 3. Onde a nota de escopo "camada endpoint" chega hoje

Há DUAS notas de escopo distintas para o mesmo par FortiEndpoint × vulnerabilidades, e nenhuma chega ao card p53 pelo motor:

1. **Motor** `engine_v32.js:106` — `CR("vulnerability-management","partial","camada endpoint")` → `resolveCandidates` `:454` (`scopeNote: rel.scopeNote`) → `candidateHTML` `ui_v32.js:597` `<div class="v32-scopenote">camada endpoint</div>` dentro de `li.v32-cand` (`candidateHTML` `:592-605`) → `capCardHTML` (`:636-660`) → **tela**: cards por capability em `#v32panel` (só com contexto declarado: `presentationOf==="card"`, `:688-698`); **papel**: `#pr-support` (`:1535-1545`) via `prCards` (`:948`), condicional a `!ctxRes.legacyMode` (`:1495`). **Nunca** entra em `.p53-sol-card` nem em `#pr-sup-solucao`. CSS de impressão: `#v32-print-report .v32-scopenote{color:#555}` `ui_v32.css:108`.

2. **Camada 1** `quickscan_secops_soccmm_v3_1_3.html:465` — `MAP["vulnerability-management"].lv[0].c[1] = {p:"FortiEndpoint", w:"visibilidade de vulnerabilidades no endpoint via agente", sn:"cobre a camada de endpoint; demais componentes podem permanecer em plataformas especializadas"}` → `apoioBlock` `:860-879` emite `<div class="scope">Escopo: …</div>` (`:874`) dentro de `.prod` (CSS `.prod .scope` `:170`, itálico, `--faint`) → movido pelo `prodLegadoDe` para o card. Condições para chegar à **tela** do card: (a) o achado é `sev 2` (só esses emitem `.apoio-block`, chamadas em `:902` (prioridades sev 2), `:911` (details dos demais gaps altos), `:934` (sem prioridades); `sev 1` vai para a lista "Pode fazer sentido" `:997-1001`, sem `sn`); (b) primeira aparição do produto no render (`renderedP` `:859`, `:868` — a segunda é `.prod-mini`, sem escopo); (c) o bloco está **visível** — com arbitragem em curso o `.prod` oculto não é movido (`:354-359`) e o card nasce de `corpoDoCatalogo`, sem `Neste contexto` e sem `Escopo`. **Papel**: nunca (`papelHTML` só lê `.pt-desc`, `:821`). Medido em C5 (legado, sem contexto, vulnerabilidades sev 2): tela tem a nota; papel não.

Resumo: a nota do engine `:106` chega só à leitura por capability (tela e papel, com contexto); a nota da Camada 1 chega só ao card da tela em modo legado sem arbitragem; o relatório por produto não tem escopo em nenhum caso.

---

## 4. Modo legado e arbitragem 010/023 — restrições de DOM para qualquer desenho novo

### 4.1 Mecanismo
- `hideLegacyRecommendation(app, hide)` `ui_v32.js:176-207`: varre os filhos DIRETOS de `[data-p52-legacy-scope="support"]` (atributo posto pelo workspace em `ui_p52_workspace_v32.js:2984`) ou de `section.screen`; um `.section-title` cujo `.eyebrow` ∈ `HIDE_EYEBROWS` (`:109-110`: "Como a Fortinet pode apoiar nas prioridades declaradas", "Como a Fortinet pode apoiar agora", "Pode fazer sentido — após validação") liga `hiding`; nós seguintes de classe `apoio-block` / `t-list` / `t-details` recebem `.v32-hidden` (`ui_v32.css:2` `display:none !important`); **qualquer outro nó encerra o alcance**; `#v32panel` zera.
- `hide` = `hasSubstituteV32(ctxRes)` `:746-758` = `porCapability` (card com payload e classificação ≠ `CONTEXT_NOT_INFORMED`) **OU** `temProdutoPublicadoV32()` `:729-745` (023 V1: `__CURATION.published().length>0` E `dataSufficiency` aberto — errata E4). Logo em **modo legado** (sem contexto) a arbitragem também liga quando há produto publicado (errata E1 da 023).
- Censo oráculo: `tests_010_vao.js:168-196` (`CLASSES_CONTIGUAS = ["apoio-block","t-list","t-details"]`, mesma varredura), `tests_023_leitura.js:245-272` (registra `produto` de cada bloco). `D010-ARB1 (c)`: sem substituto, blocos contíguos ao título congelado **visíveis**; `D010-ARB3`: ocultos = 0 ou todos; `(b)` âncoras nomeadas (inclui `details.t-details`) nunca ocultas; `D010-INV7`: censo visível igual ao modo legado.

### 4.2 Restrições que o módulo já aprendeu (comentários medidos) e que valem para a 026
1. **Cards são filhos diretos de `#p52-sec-support`** e mantêm `class="apoio-block"` — `P52-REC1g` mede `:scope > .apoio-block` e o contador; invólucro por grupo zera `cards.length` e cega a cláusula de geometria (`ui_p52_support_v32.js:650-657`); a grade é `#p52-sec-support > .apoio-block{grid-column:span 6}` `ui_p52_workspace_v32.css:483-488`.
2. **Nenhuma faixa irmã entre o título congelado e os blocos** em modo sem arbitragem — nó fora de `CLASSES_CONTIGUAS` encerra o censo e `D010-ARB1 (c)` falha por vacuidade (`:400-417`, `:659-660`). O selo de grupo vive DENTRO do card (`chipDoGrupo`).
3. **Contiguidade**: os cards, por serem `.apoio-block`, são contados como blocos da Camada 1 quando seguem um título de `HIDE_EYEBROWS`. Com arbitragem ativa o título está oculto e os cards visíveis → estado misto → por isso `fronteira()` (`p.p53-sol-lead`, classe fora de `CLASSES_CONTIGUAS`) é inserida antes dos cards **só** quando `arbitrando && cards.length` (`:666`; `D019-CTX1` com três controles `:560-660`; `D019-M17/M18`).
4. **Nó oculto nunca é movido nem consumido** (`oculto()`, `prodLegadoDe :354-359`, `blocosLegados :209`) — ressuscitar conteúdo que a arbitragem escondeu é o que `D010-ARB3` reprova.
5. **Supressão total não repõe a leitura congelada** (design-decisions R13, `E20` da 010): com `cards.length===0` a seção mostra só o aviso; `P52-ICON3/t2` usa exatamente esse estado para trazer a lista congelada de volta (`tests_p52_chromium.js:3730-3760`).
6. **`details.t-details` só sai se vazio** (`ponteiro`, `:503-507`) — é âncora `D010-ARB3 (b)`.
7. **Ordem no papel**: `#pr-sup-solucao` é seção OPCIONAL na ordem pinada depois de `pr-support` e antes de `pr-journey` (`tests_010_vao.js:330-338`, `tests_p50_core.js:4278-4294`); mantém `id` e o `h2`.
8. **Modo legado no papel**: `buildPrintReport` imprime "Contexto tecnológico — Não informado" e suprime E–H (`ui_v32.js:1495-1500`); a seção p53 entra fora desse condicional (`:1566`) — é a única leitura de apoio do PDF sem contexto.
9. **Copy**: todo texto novo no papel passa por `p52Copy` (`P52_COPY` `ui_p52_workspace_v32.js:128-236`: "Mandato"→"Direcionamento", "charter"→…); evitar literais que sejam âncora de `P52_COPY` e conferir `grep` em `tests_*.js` antes de fixar qualquer string visível (memória "copy de apresentação cega gate").
10. **`.pt-name` removido, ícone presente** (`D019-CARD1`, `D019-M13/M14`).

---

## 5. Proposta mínima de marcação (card e pr-card) — sem innerHTML, CSS `p53-`

Premissa R9 §5 / agente: a UI **não decide** ação, origem, elegibilidade, variante ou escopo. Esses campos têm de chegar prontos num registro de dono único (o "contrato único" da 026 — hoje `ofertaDoMotor()` é a segunda fonte do `EA-76`). Abaixo, o que a apresentação faz com o registro quando ele existir; valores em vocabulário fechado (campo que máquina resolve recusa prosa — a nuance vai para texto visível, não para o atributo).

### 5.1 Registro esperado (shape, dono = core)
`{ id, motorId, nome, tier, acao, origem, elegibilidade, supressao, variante, escopo, sinais[], caps[], notas[] }` — `tier` como hoje; os novos:
- `acao` ∈ `validar | operacionalizar | expandir | avaliar-aquisicao | servico`
- `origem` ∈ `gap | sinal | operador` (hoje inferível: `data-qs22-sinais` ≠ "" → sinal; `[data-p53-prov]` → operador; senão gap — a proposta só torna explícito)
- `elegibilidade` ∈ `elegivel | inelegivel | nao-avaliada`; `supressao` ∈ `"" | plataforma | curadoria`
- `variante` = `motorId` quando o motor resolveu variante (ex. `fortindr-onprem`) e `nomeVariante` ("FortiNDR (On-Premises)", `OFFERINGS[id].name`)
- `escopo` = `scopeNote` do candidato (engine) ou `sn` da Camada 1 quando for esse o lastro

### 5.2 Card (tela) — tudo por `el()` (`setAttribute`/`textContent`, `:96-101`); nada de `innerHTML`
Manter intactos todos os atributos, classes e textos de §1.3 (âncoras). Acrescentar:
```
div.apoio-block.p53-sol-card  (+ atributos atuais)
    [data-p53-acao=…] [data-p53-origem=…] [data-p53-elegibilidade=…] [data-p53-supressao=…]
    [data-p53-variante=motorId]            (só quando houver)
    [data-p53-escopo=texto]                (só quando houver)
  ├ div.p53-sol-chiprow  (inalterado: chip + tierlabel)
  ├ h4 nome                                  (inalterado)
  ├ div.p53-sol-variante   "Variante indicada: FortiNDR (On-Premises)"       (novo, só com variante)
  ├ div.p53-sol-acao       "Ação sugerida: validar no aprofundamento"         (novo, 1 linha; texto por mapa fechado ACAO_TXT)
  ├ div.p53-sol-origem     "Origem: gap medido" | "sinal declarado: …" | PROV_TXT   (nova linha; para operador reaproveita .p53-sol-prov existente — não duplicar o selo)
  ├ div.p53-sol-elig       "Elegibilidade: a validar — base FortiEDR on-prem"  (novo, só quando ≠ elegivel)
  ├ div.p53-sol-prov …     (inalterado)
  ├ div.why.p53-sol-why    (inalterado)
  ├ div.prods > .prod      (inalterado; quando o .prod é de catálogo e há `escopo`, acrescentar div.scope.p53-sol-escopo "Escopo: …" dentro do span, mesma posição do congelado v3_1_3 :874)
  └ ul.p53-sol-caps        (inalterado)
```
Ordem dos blocos novos entre `h4` e `.p53-sol-prov` para não deslocar o que `D019-CARD1`/`PROV1` procuram (todos usam `querySelector`, não posição — mas manter a leitura: identidade → variante → ação → origem/elegibilidade → descrição → caps).

### 5.3 `pr-card` (papel) — na mesma string de `papelHTML()` (padrão já aceito pelos hooks de impressão, `:784-787`), com `escHtml` em todo valor
```
div.pr-card[data-p53-sol-produto][data-p53-sol-grupo][data-qs22-sinais?]
    + [data-p53-sol-tier=…]  (passa a VIAJAR — hoje é o único data-* do card que o papel descarta)
    + [data-p53-acao] [data-p53-origem] [data-p53-elegibilidade] [data-p53-supressao] [data-p53-variante?] [data-p53-escopo?]
  ├ div.pr-mut.p53-pr-tier     "indicação prioritária" | "após validação"     (novo — fecha C5: 9 cards sem qualificador)
  ├ div.pr-mut  "habilitado por sinal declarado: …"   (inalterado)
  ├ b nome                                            (inalterado)
  ├ div.pr-mut.p53-pr-variante  "Variante indicada: …" (novo, condicional)
  ├ div.pr-mut.p53-pr-acao      "Ação sugerida: …"     (novo)
  ├ div.pr-mut.p53-pr-elig      "Elegibilidade: …"     (novo, condicional)
  ├ div.pr-mut[data-p53-prov]   (inalterado)
  ├ div.pr-mut  txt(.pt-desc)   (inalterado)
  ├ div.pr-mut.p53-pr-escopo    txt(.scope) | escopo   (novo — hoje "Escopo:" nunca chega ao papel)
  └ ul > li[data-p53-sol-cap]   (inalterado)
```
Fonte dos valores no papel: **ler do card da tela** (atributos `data-p53-*` e `txt(.p53-sol-*)`), como `papelHTML` já faz com `data-qs22-sinais`/`.pt-desc` — tela e papel continuam derivados de um só cálculo (`D019-PAR1`, EA-58), sem recalcular.

### 5.4 CSS (em `ui_p52_support_v32.css`, só prefixo `p53-`)
- Tela: `.p53-sol-acao`, `.p53-sol-origem`, `.p53-sol-elig`, `.p53-sol-variante`, `.p53-sol-escopo` — tipografia 12.5–13px, `var(--muted)`, sem hex (lição `P50-COR1`); `[data-p53-elegibilidade="inelegivel"] .p53-sol-elig { color: var(--p52-attn) }` no mesmo padrão de `[data-p53-sol-tier="prioritaria"] .p53-sol-tierlabel` (`css:209`).
- Papel: `@media print { .p53-pr-tier { font-weight:700; text-transform:uppercase; letter-spacing:.07em } .p53-pr-escopo { font-style:italic } }` — só classes próprias; a casca `.pr-mut`/`.pr-card` continua sendo estilizada pelo dono (`ui_v32.css:95-97`), não por este módulo (R9 §6). Não usar `#v32-print-report` como prefixo de seletor novo.
- Nada de cor como único portador de significado (texto sempre presente — mesma regra do `D022-A11Y1`/`V7`).

### 5.5 O que NÃO mudar (para não apodrecer âncoras)
- As dez linhas `find:` de `tests_019_mutants.js` (§1.4), `tests_023_mutants.js:135`, o `if (arbitrando && cards.length)` e `var produtos = ofertaDoMotor();` (`D019-M15/M18`).
- Textos visíveis atuais: "indicação prioritária", "após validação", `PROV_TXT`, "Formas de apoio, por produto", "habilitado por sinal declarado:", os dois textos de `declararSupressao`.
- Dependência: se o registro novo vier de outro bridge (core), `ofertaDoMotor()` vira consumidor — a linha `var produtos = ofertaDoMotor();` precisa continuar literal ou o `D019-M15` deve ser reancorado pelo qa-engineer.

---

## 6. Suítes Chromium que medem esta seção e que o CI roda

Job `visual` (`.github/workflows/verify.yml:52-80`; check obrigatório pela proteção de branch, `D016-PROT1`): `npm run test:visual` (playwright, `playwright.config.js` → `tests_visual/`), `node tests_p50_chromium.js`, `node tests_p52_chromium.js`, `node tests_011_chromium.js`. Contagens no bloco `visual` de `.claude/verify/expected_suites.json:150-184` (p52: 56 gates). Local: `MUTATION_DEFER_MISSING=1` delega a campanha chromium ao job (`verify.yml:42`); stage `suites` local roda só jsdom.

| Suíte / gate | Linhas | O que mede nesta seção |
|---|---|---|
| `tests_p52_chromium.js` **P52-REC1g** | `:684-736` | `#p52-sec-support` é `grid`; `:scope > .apoio-block` em ≥2 colunas no desktop (1440) e 1 coluna no mobile (390); nenhum card >62% da largura; `data-p52-support-cards` == cards medidos; `.section-title` visíveis em faixa de largura total (emenda 023: só o desenhado conta). Fixture `FX52.P52_F1` |
| **P52-PR1** | `:1360-1559` | isolamento do print: censo visível da tela (inclui `.apoio-block` `:1492`) igual ao baseline V3.1.3; nada do workspace no papel; nenhuma seção perdida |
| **P52-PR2** | `:1290` | cromo (popovers, trilho, editores) fora do papel |
| **P52-ICON3** | `:3643-3867` | ícones materialmente pintados em `.t-list .t-item` / `.t-details .t-item`; `t2` (`:3730-3760`) suprime toda a oferta via `__CURATION.set(id,"exclude")` para a lista congelada voltar à tela — depende de "supressão total não repõe" e de `published()===0` |
| **P52-PDF1…PDF7** | `:2303-2527` | PDF real (`page.pdf` + poppler `pdftotext/pdftoppm`): paginação (PDF4/5/6: título órfão, página vazia, conteúdo material em toda página), ícones `.v32-icon` (PDF3), nada publicado com gate fechado (PDF7). Qualquer bloco novo em `#pr-sup-solucao` muda a paginação medida por PDF5/PDF6 |
| **P52-TGT4** | `:3872` (nota), `:3961-4105` | perfil × cenário-alvo no PDF (lê `.pr-card` de `#pr-target`, `:4100`) — não lê p53 |
| `tests_visual/print.spec.js` P1–P11 | `:1-120` | `#pr-journey`, `#pr-target`, radar, `P11-nobg`; só no projeto `d1440` (`:25`). **Nenhum seletor sobre `pr-sup-solucao`/`p53`** — cobre a seção apenas por efeito colateral de paginação |
| `tests_visual/screen.spec.js` V7 | `:137-155` | `.ux-modebadge` das regiões `.v32-block[data-mode]` (APOIO DIRETO/CONTEXTUAL/VALIDAR/ARQUITETURAL) legíveis sem cor — leitura por capability, não a por produto |
| `tests_p50_chromium.js`, `tests_011_chromium.js` | — | não tocam esta seção |

Lacuna de cobertura Chromium: nenhum gate visual mede o `pr-card` de `#pr-sup-solucao` (tier, escopo, variante) nem a geometria dos cards p53 em modo de arbitragem com `fronteira`. Os gates que veem o conteúdo do papel desta seção são jsdom (`D019-PAR1/PROV1`, `D022-PROD1`, `D023-PAP1`, `D025`).

---

## 7. Observações medidas que sustentam a 026 (sem veredito — agente não aprova)
- C1–C7: `papel.cards[].tierAttr === null` em todos; C5: 9 cards no papel sem qualificador (tela: 7 "após validação", 2 "indicação prioritária").
- C5: "Escopo: cobre a camada de endpoint…" na tela (card FortiEndpoint, `.prod` movido), ausente no papel.
- C6: motor `fortindr-onprem` (variante resolvida) → card/papel "FortiNDR" sem variante (nome de `PRODUCTS`).
- C7: motor dá MDR inelegível (`baseDeploymentExcludes` on-prem, `engine_v32.js:209`, `:486`) e `fortixdr` contextual com `scopeNote` "extensão de correlação sobre a base EDR instalada…"; card mostra "FortiGuard MDR · indicação prioritária" e FortiEndpoint "após validação" — origem é `MAP["monitoring-coverage"]` (v3_1_3 `:458-459`), não o engine.
- A proveniência `operador` é a única "origem" explícita hoje; `gap` × `sinal` só se distinguem por `data-qs22-sinais` vazio/não vazio.
