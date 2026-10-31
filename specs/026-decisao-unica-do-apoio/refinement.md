# Refinamento — 026-decisao-unica-do-apoio

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.
>
> **Quem escreveu**: o `product-owner`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-10-31, sob delegação do orquestrador, com Bash
> **só de leitura** — nenhuma suíte executada, nenhum git. *Lido* = conferido
> por mim no HEAD de `feature/026-decisao-unica-do-apoio` (= `develop @ 9509e4b`).
> *Executado* = medido pelo refutador e pela sonda do workflow de 2026-10-31
> (`anexos/refutacao-reproducoes.json`, `anexos/sonda-leitura.js`,
> `anexos/cenarios/*.json`), em jsdom, e citado como tal (R2 §4).
>
> **Origem**: auditoria externa de 2026-10-31 sobre a v3.2.12 (`QS-01`: os cards
> por produto contradizem o motor; `QS-02`: o PDF perde os qualificadores); o
> plano de correção do proprietário
> (`Downloads/Plano_de_correcao_e_prompt_QuickScan_2026-10-31.md`, §2 — prompt da
> microfase 01); e o `EA-76` (`.claude/BACKLOG.md:7094`, `aberto` desde
> 2026-09-29, "declarar e selar" nas selagens v3.2.11 e v3.2.12 — o conserto foi
> sempre "demanda futura"; esta é a demanda).
>
> **Desenho**: `anexos/desenho-sintese.md` é a fonte de verdade desta fase
> (desenho B vencedor por placar 3/3, com os enxertos E1–E17 e as três correções
> que a conferência no código impôs). Este refinamento o enquadra como produto;
> não o reescreve.
>
> **Decisões D-1..D-9** (desenho §10): decidido pelo orquestrador sob a instrução
> do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal
> pendente no PR. Nenhuma linha deste documento afirma aprovação do usuário.

## Necessidade

Duas pessoas recebem o que esta demanda toca.

**Quem conduz a sessão** (facilitador) vê, na mesma seção de apoio da tela, duas
leituras que se contradizem — e é convidado a curar a errada:

- **C1** (endpoint `NONE`, `saasAllowed:"no"`, `localProcessingRequired:"yes"`):
  o card de capability diz *"FortiEDR — aquisição candidata"*; o card por
  produto diz *"FortiEndpoint — indicação prioritária"*. O motor **vetou** o
  FortiEndpoint (`V32.archSatisfied(OFFERINGS.fortiendpoint.architectureRequires)
  === "violated"`, *executado*) e a tela o chama de prioritário.
- **C2 / C4** (EDR de terceiro, ou Microsoft Sentinel, em produção): o motor diz
  *"tecnologia operacional — apoio em operacionalização (nunca substituição)"*;
  ao lado, FortiEndpoint (ou FortiAnalyzer **e** FortiSIEM) aparecem como
  *"indicação prioritária"*.
- **C7** (FortiEDR on-prem): `serviceEligibility("fortiguard-mdr")` devolve
  `eligible:false` com a razão *"…(on-prem/air-gapped) — OG oficial"*
  (*executado*); o card diz *"FortiGuard MDR — indicação prioritária"*.
- O **editor de curadoria** lista, para decisão, exatamente o que o motor acabou
  de negar — e não lista o item que o motor resolveu (`FortiEDR` não tem chave
  em `PRODUCTS`).

**Quem lê o PDF** recebe menos do que a tela mostrou: na sessão de referência
(**C5**, §Sistema real) a tela publica 9 cards — 7 *"após validação"*, 2
*"indicação prioritária"* — e o papel imprime os 9 **sem nenhum** qualificador
(*executado*: 0 ocorrências em todas as `.pr-sec`). Sem o qualificador a
hipótese parece recomendação definitiva (`QS-02`).

**O que muda.** A decisão de apoio por linha de produto passa a nascer **uma
vez**, no dono do estado da curadoria (`__CURATION`, `ui_curation_v32.js`), como
*registro de decisão de apoio* + *vetos do motor*; tela, editor e papel
**consomem** o mesmo registro. Onde o motor tem voz, o card diz o que o motor
resolveu (título `FortiEDR`, curável como a linha `FortiEndpoint`) e a linha
vetada **não** ganha card — ganha uma linha no bloco *"Não indicado nesta
leitura"*, com a razão literal do motor e a tecnologia declarada. Onde o motor
se abstém (legado, capability não informada, gate fechado), a oferta da Camada 1
passa inteira como *hipótese condicionada*, com a condição visível e o tier da
severidade — nada é inventado (INV-2). O papel copia do card o tier, a ação, a
condição, a variante, o escopo e o bloco de vetos. Zero linha em engine, Camada
1, sessão, schema e `ui_v32.js`.

**Por que agora.** A auditoria de 2026-10-31 mediu o que o `EA-76` declarava
desde 2026-09-29, e a refutação confirmou 5 dos 8 casos como defeito real (C1,
C2, C4, C7 por uma raiz só; C5 pelo papel). O plano do proprietário põe esta
correção como **microfase 01**, antes de qualquer decisão metodológica e antes
do piloto. Selar outra vez com "declarar e selar" seria a terceira selagem com o
mesmo fail-open nomeado.

## Enquadramento de produto

### Invariantes tangenciadas (R1)

| INV | como esta demanda a toca | prova prevista (desenho §7/§8) |
|---|---|---|
| INV-1 | **Zero** toque: `V32.*` só lido; `TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT`/`SESSION_SIGNALS` nunca escritos pela derivação. O motor já decide certo (C1: `fortiedr`; C7: MDR inelegível) — o defeito é de apresentação e curadoria, como o `EA-76` encaminha | `D022-BND1`/`D023-BND1`, stages `baseline`/`build`/`m41`; `D026-LEG1 (f)` |
| INV-2 | **Reforçada.** `UNSET`/`UNKNOWN` nunca viram ausência: `serviceEligibility().reason` que começa por *"base requerida ausente"* (`engine_v32.js:484`) com `endpoint-detection` não declarado é **abstenção** (hipótese), nunca veto (D-6 / E1). Veto só sobre landscape **declarado** | `D026-LEG1 (b)` — C7-UNSET |
| INV-3 | Gate fechado (`__P50SUFF.contract().sufficient`, `ui_p50_suff_v32.js:74`) é **porta de saída**: toda linha é hipótese, nenhum veto. A apresentação **compõe** a decisão do engine e a do operador — não decide (E15) | `D010-F3`, `D019-SUF1`, `D026-LEG1 (d)` |
| INV-7 | `reconciliar(entrada)` é função **pura** de (respostas, `MAP`, contexto, catálogo); todo texto é literal do engine ou rótulo fixo de apresentação; `fontes[]` nomeia a resposta ou o sinal de origem. O papel continua **derivação** da tela (`D019-PAR1`) — só copia mais. Hoje a narrativa do papel difere da tela por omissão | `D025-INV8`, `D026-LEG1 (f)`, `D026-PAP1` |
| INV-8 | O registro é **derivado**: recomputado a cada chamada, sem cache, nunca em `toSession()`, nunca lido de volta do DOM. `decisions` continua `{ chave → include/exclude }` — o D-4 do desenho B (id do motor em `decisions`, schema v1 sem bump) foi **cortado** (E2) | `S4-S5`, `D019-INV8`, `D025-INV8` |
| INV-9 | Só classes `produto` (`ui_curation_v32.js`, `ui_p52_support_v32.js` + `.css`, `ui_curation_edit_v32.js`) e `generated` (HTML pelo builder). `ui_v32.js` (§29.4) e `ui_session_v32.js` **não** são escritos — nenhum rito R6 §5 a pedir | stage `build`; `P50-GOV1` |
| INV-10 | Enums novos em PT-BR sem acento (`avaliar-aquisicao`, `hipotese`, `capability-nao-informada`), como `prioritaria`/`validacao` já são; ids do engine copiados literalmente | `compliance-audit` |

### Conflito com decisão registrada ou spec validada?

**Nenhum.** Entradas de `.claude/rules/design-decisions.md` lidas e o que cada
uma exige da 026:

- *A lista "Pode fazer sentido — após validação" convive com a visão por
  solução* (com o fecho de 2026-10-19: **o produto publicado conta como
  substituto**, `temProdutoPublicadoV32`, `ui_v32.js:729-745`). A 026 mantém
  `published()` como a definição que `ui_v32.js` lê e **nunca a esvazia onde a
  Camada 1 voltaria** — é a razão de o veto só nascer onde o motor tem voz
  (`temVoz()` espelha `hasSubstituteV32`, `:750-752`) e de a constante C3 ~~nascer
  `false` (D-3)~~ ser, desde a Fase 6, `true` (D-3 revertida; E15 da spec). A convivência sob gate fechado (`EA-79`, resíduo) não é tocada.
- *Supressão total pela curadoria não repõe a leitura congelada* (D4 da 024).
  O veto do motor **não é supressão**: nunca escreve `[data-p53-suprimido]`,
  e `suprimidos` (`ui_p52_support_v32.js:734`) passa a contar só exclusões do
  operador. Semântica do aviso intacta.
- *O card de prioridade não traz apoio Fortinet* (`EA-73`): `businessPriority`
  não é lido pela reconciliação; os cards continuam na seção de apoio.
- *Cláusula defensiva inalcançável por construção* (candidatas): as três
  instâncias vivem em `ui_v32.js`/`ui_target_v32.js`, não tocados.
- As demais entradas (MANIFEST, acervos, suítes visuais, UG8, fases seladas,
  planning-state) não alcançam esta superfície.

Specs validadas, na mesma leitura: `specs/010-recomendacao-sem-vao/spec.md:461-462`
é a âncora normativa **a favor** — *"sob contexto declarado a autoridade é o
engine, e listar produto do catálogo congelado ali contradiria a leitura
informada"*. A errata **E2 da 022** (só o habilitado por sinal entra pela 2ª
fonte; *"mudança visível que ninguém pediu"*) é preservada em **conteúdo** —
nenhum card a mais: variantes (`fortisiem-cloud`), extensões (`fortixdr`) e
serviços sem linha no MAP **não** viram card (D-5) — e reaberta **só na forma**
por D-7 (título do card = item resolvido). Essa é a única letra de spec validada
que a 026 move, e vai nomeada ao PR. **023 E1** (legado = cards da Camada 1,
C8) e **E4** (gate fechado não substitui) ficam; **019 C1** (curadoria é seleção,
nunca redação) é o que decide D-8; **025** (importação substitutiva) importa
com o mesmo significado — `"FortiEndpoint":"exclude"` retira o card da linha
qualquer que seja a variante.

### Alternativa mais simples considerada

- **`fix-finding` do `EA-76`**: não cabe. O núcleo do remédio é **comportamento
  novo** — registro de decisão, vetos visíveis, condição de hipótese, bloco novo
  no DOM e no papel, três funções novas no bridge — não um dado que muda (R4:
  *na dúvida, é demanda*).
- **Desenho A** (corrigir `ofertaDoMotor()` para consultar o motor; `offered()`
  continua no MAP): **não basta** (desenho §0 e §9). (i) As duas cópias
  discordam **por desenho** — o editor lista o vetado e a tela não; falha o
  aceite literal do `QS-01` (*"mesma decisão na tela, no editor e no PDF"*) e o
  `EA-76` fica aberto; (ii) quebra por construção `published() ≡ cards` e
  `offered() ⊆ cards` (`D019-CTX1 (a)`, `D023-REG1 (c)`, `D023-PAP1 (b)`);
  (iii) lê `UNSET` como ausência ao vetar o MDR sob base não declarada (INV-2);
  (iv) põe lógica de decisão no módulo do `ui-engineer` (872 → ≈1.080 linhas,
  R9 §7 e tabela R5). Quatro juízes de quatro lentes recusaram o A.
- **Desenho C** (módulo puro + bridge novo + builder + marcador): tecnicamente o
  mais limpo, mas paga 7 gates, 8 mutantes, 3 harnesses e 3 reancoragens —
  contra as diretrizes do proprietário de 2026-09-11/13 (rota mais barata;
  produto antes de instrumento; nenhum gate ou mutante sem pedido). Suas ideias
  entram como enxertos (E1, E2, E8, E10, E11, E16).
- **Desenho B + enxertos = FINAL**: 2 módulos de produto, CSS, editor opcional,
  1 suíte nova com 3 gates, zero linha em engine/Camada 1/sessão/schema/`ui_v32.js`,
  âncoras de mutante existentes intactas (preflight E14).

## Sistema real

Tudo *lido* no HEAD; o *executado* é do refutador, em jsdom, e está marcado.

### A mesma derivação em dois lugares — e nenhum consulta o motor

| onde | o que faz hoje | efeito |
|---|---|---|
| `ofertados()` — `ui_curation_v32.js:96-152`; porteiro: `decidir()` `:162-165` devolve `exclude` para tudo fora dela; `publicados()` `:170-179` | 1ª fonte: `computeFindings()` + `MAP[f.id].lv[f.lvl].c[].p` — chaves de `PRODUCTS`. 2ª fonte (022 E2): só candidato do motor **com sinal** (`cd.signals.length`), pareado a `PRODUCTS` por **nome**; sem par → descartado (`:142`, *"fora do catalogo curavel: nao se inventa id"*) | o cabeçalho `:93-95` diz *"o que o MOTOR ofereceu … derivado do engine"* — a 1ª fonte é a **Camada 1**. `classify`, `resolveCandidates`, `archSatisfied`, `serviceEligibility`, `suppressedByPlatform` nunca são lidos |
| `ofertaDoMotor()` — `ui_p52_support_v32.js:247-346` | cópia da anterior com tier: 1ª fonte chaveada por id de `PRODUCTS`, `tier = sev===2 ? 1 : 2` (menor vence); 2ª fonte (`:296-337`), só sinal, chaveada por **nome exibido** (`:317-323`: *"A CHAVE E O NOME EXIBIDO, nao o id"*) | raiz única de C1/C2/C4/C7 e do colapso de identidade (C6): dois catálogos nomeiam o mesmo produto com chaves diferentes e a união se faz pelo nome |
| `decorar()` — `:721` `var produtos = ofertaDoMotor();` · `:733` `decisaoDe(produtos[i].nome)` · `:734` `suprimidos = produtos.length - cards.length` | a curadoria age só sobre a publicação (`D019-MED1`); `decisaoDe` (`:136-141`) resolve nome → id por `idDoNome` (`:114-121`); sem id → `"include"` (`:139`): item do motor sem chave em `PRODUCTS` é **incurável** | o editor (`ui_curation_edit_v32.js:72-75` `nomeDe`; `:200-208` acréscimos) lê `offered()`/`catalog()` pelo bridge — terceira resposta à mesma pergunta |

### O papel omite o que a tela já carrega

`papelHTML()` (`ui_p52_support_v32.js:794-834`) lê os cards da tela (`:797`) e
copia `data-p53-sol-produto`/`-grupo`/`data-qs22-sinais` (`:808-814`), `<b>` =
nome (`:816`), `[data-p53-prov]` (`:818-820`), `.pt-desc` (`:821-822`) e
`li[data-p53-sol-cap]` (`:823-830`). **Não** copia `data-p53-sol-tier` nem
`.p53-sol-tierlabel` (`TIER`, `:240`), que o card da tela já carrega — é o C5
inteiro. Nenhuma nota de escopo chega ao papel. Guarda de seção vazia em `:799`
(sem cards e sem aviso → `""`).

### O que a 026 não pode quebrar — a arbitragem (`ui_v32.js`, não tocado)

- `presentationOf()` `:688-698`: `CONTEXT_NOT_INFORMED` nunca vira `"card"`
  (`:693-696`), só `"base"`/`"maturity"`.
- `temProdutoPublicadoV32()` `:729-745`: gate fechado → `false` (`:741`, 023 E4);
  senão `published().length > 0` (`:742-743`).
- `hasSubstituteV32()` `:746-758`: `porCapability` exige `presentationOf ===
  "card"` (`:750`), classificação ≠ `CONTEXT_NOT_INFORMED` (`:751`) e payload
  (`candidates + services + notes > 0`, `:752`) — **é esta a cláusula que
  `temVoz()` espelha**; `|| temProdutoPublicadoV32()` (`:757`).
- Consequência (desenho §2.6, medido em C3): qualquer regra que **esvazie**
  `published()` numa capability `CONTEXT_NOT_INFORMED` devolve a Camada 1 à tela
  com o mesmo produto que o veto negou. Por isso o veto só nasce onde o motor
  tem voz e `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA` ~~nasce `false` (D-3)~~ é `true` desde a Fase 6 (D-3 revertida; a regra então **nunca veta** — hipótese `plataforma-declarada-cobre`).

### Onde o motor fala (`engine_v32.js`, frozen — só lido)

`isLegacyModeV32()` `:305-311` → `buildRecommendationContext()` devolve
`contexts:{}` (`:552`). `CONTEXT_NOT_INFORMED` → `supportMode:"LEGACY-LABELLED"`
(`:601-602`). `serviceEligibility()`: *"base requerida ausente (…)"* `:484` —
base **não declarada** lida como ausência, por isso D-6 —, *"…não elegíveis
(on-prem/air-gapped) — OG oficial"* `:486`. Serviços anexados mesmo em
`LEGACY-LABELLED` (`:653-665`); o inelegível é **descartado em silêncio**
(`:659`) — a razão que C7 precisa mostrar só existe chamando
`serviceEligibility(sid)` de novo, o que `entradaViva()` faz.

### A medição C1–C10 (*executado* pelo refutador — `anexos/refutacao-reproducoes.json`)

| caso | motor | tela/papel hoje | veredito |
|---|---|---|---|
| **C1** endpoint `NONE`, `saasAllowed:"no"` | `WHITESPACE/DIRECT`, `candidates=[fortiedr]`; `archSatisfied(fortiendpoint)="violated"` | card `FortiEndpoint` prioritária; papel sem tier | **defeito** — a oferta que o motor veta é a que a tela chama de prioritária |
| **C2** EDR de terceiro em produção | `OPERATIONAL_GAP/CONTEXTUAL`, 0 candidatos, nota *"nunca substituição"* | card `FortiEndpoint` prioritária | **defeito** |
| **C3** FortiSOC só em `soc-platform`, gap automation | `CONTEXT_NOT_INFORMED/LEGACY-LABELLED`; `suppressedByPlatform().caps ∋ security-automation`, mas a supressão só é aplicada no ramo `TECHNOLOGY_WHITESPACE` (`:567-572`) | card `FortiSOAR` prioritária | **não é defeito** — o motor se **abstém** e delega ao rótulo legado; FortiSOAR é coerente com `LEGACY-LABELLED`. Suprimi-lo obrigaria a apresentação a sobrepor `classify` (terceiro decisor) e, medido, devolveria a Camada 1 com o FortiSOAR. Lacuna de `classify` → backlog (frozen). **C3b** (FortiSOC declarado na própria `security-automation`): `OPERATIONAL_GAP` + nota M75 → **defeito**, classe C2 — é o caso "plataforma cobre" que a spec usa |
| **C4** Sentinel em produção, gap logs | `OPERATIONAL_GAP/CONTEXTUAL`, 0 candidatos | `FortiAnalyzer` + `FortiSIEM` prioritárias | **defeito** |
| **C5** sessão de referência | legado, `contexts:{}` | 9 cards (7 validação + 2 prioritária); papel 9 sem qualificador | **defeito** — só o papel |
| **C6** NDR `NONE`, `saasAllowed:"no"` | `DIRECT`, `fortindr-onprem[atende]` | card `FortiNDR` prioritária | **não é defeito** — a variante está nas duas superfícies (`#v32support`, `pr-support`); `"FortiNDR"` de `PRODUCTS` é o **nó de família** `ndr-family` do motor (`engine_v32.js:89`), que contém a variante: leitura menos granular, não contraditória; e a 022 E2 limitou a 2ª fonte ao sinal. D-7 muda só a **forma** (título = item resolvido) |
| **C7** FortiEDR on-prem, monitoring `NONE`, staffing gap | `socaas<gap>` em 2 capabilities; MDR `eligible:false` *"OG oficial"*; endpoint `OPERATIONAL` + `fortixdr/contextual-extension` (M50) | `FortiEndpoint` validação + `SOCaaS` prio + **`MDR` prio** | **defeito** — restrição explícita do catálogo contrariada. SOCaaS prioritária **coincide** com o motor (controle positivo) |
| **C8** legado, endpoint lv0 | `contexts:{}` | `FortiEndpoint` prioritária | **não é defeito** — modo legado é a leitura da Camada 1 por desenho (`isLegacyModeV32`; 023 E1, *"Vamos com a B"*, 2026-10-02) |
| **C9** sinal `dataLeakageConcern` | `UNASSESSED/CONTEXTUAL`, `fortidlp` em 2 capabilities | `FortiDLP` validação, sinal preservado | **correto hoje** — a 026 preserva (`D022-PROD1`) |
| **C10** whitespace `saasAllowed:"yes"` | analytics `fortianalyzer, fortisiem, fortisiem-cloud`; endpoint `fortiendpoint` | 3 cards prioritários | **correto hoje** — a variante Cloud não vira card (E2); a 026 só a nomeia no card `FortiSIEM` |
| **extra** `include` manual | — | card com `[data-p53-prov]` em tela e papel, sem tier, sem caps | **não é defeito** — `D019-PROV1`/`D019-M4` cobrem; "condições" do item manual não existem no estado (019 C1) → D-8 |

**Sessão de referência C5** (*executado*): respostas
`[1, 2, 2, 2, 1, 1, 1, 1, 1, 1, "NA", 1, 2, 0, 0]`, ponto de partida 1,
prioridades `mandate`/`training`/`knowledge`, contexto não informado, gate
aberto, sem curadoria. Tela: 9 cards — `FortiSIEM`, `FortiAnalyzer`, `FortiSOAR`,
`FortiAI-Assist`, `FortiXDR`, `FortiNDR`, `Serviços FortiGuard` *"após
validação"*; `FortiEndpoint`, `FortiRecon` *"indicação prioritária"*. Papel: 9
`.pr-card`, **0** qualificadores em todas as `.pr-sec`. Parte do `QS-02` que
**não** reproduz: a "nota separada de escopo (camada endpoint)" tem 0
ocorrências na **tela** — em legado o motor não produz `scopeNote`; o
FortiEndpoint vem de `vulnerability-management` lv0 do MAP, e o escopo que
existe é o `.prod .scope` da Camada 1 (*"cobre a camada de endpoint…"*,
`v3_1_3.html:874`), que o card move e o papel não copia. O número 9 **não**
vira requisito (plano §2): com contexto declarado a lista muda, e deve.

### Divergências doc × código

| onde | diz | faz |
|---|---|---|
| `ui_curation_v32.js:93-95` | *"O que o MOTOR ofereceu nesta sessão … Derivado do engine, nunca do DOM"* | a 1ª fonte é `computeFindings()+MAP` (Camada 1); o engine só entra pela 2ª, e só por sinal |
| `.claude/BACKLOG.md:7109` (`EA-76`) | `ofertados()` em `ui_curation_v32.js:75` | `:96` no HEAD — o cabeçalho e o bloco 022 E2 cresceram; o achado continua verdadeiro |
| `ui_p52_support_v32.js:317-323` | *"a seção já identifica produto por nome … a união usa a mesma identidade que a apresentação"* | é a raiz de C6 e do colapso FortiEDR → FortiEndpoint: identidade ≠ nome exibido (E3: `data-p53-sol-produto` = linha; `data-p53-sol-item-id` = item) |
| `tests_019_curadoria.js:504` (`D019-SOL3 (b)`) | *"o QUALIFICADOR … bate com o motor"* | o oráculo é `computeFindings()+MAP` (`:505-508`) — vale em legado e hipótese; com voz do motor o oráculo é `D026-REC1` (comentário-trilha E13, asserção intacta) |
| `anexos/desenho-sintese.md` §2.7 | `idDoNome` `:116-123` | `:114-121` no HEAD; sem efeito no desenho |

**O que não pude medir.** Nenhuma suíte rodou nesta Fase 0; os números acima
(9 cards, 0/9, `"violated"`, `eligible:false`) são do refutador. O red da W1
os remede com fixtures literais (`D026-*`), e o CI mede `playwright P8` e
`P52-PDF5/6` (W5) — o único risco de repin, declarado no desenho §8.

## Casos de borda

Regra única que todos os casos instanciam (desenho §2): **o motor vence a
Camada 1 onde tem voz; onde se abstém, a Camada 1 passa como hipótese
condicionada; a identidade curável é a linha, nunca o nome exibido; nada é
inventado.** `[Cn]` remete a `anexos/cenarios/`.

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | **C1** endpoint `NONE`, `saasAllowed:"no"`, `localProcessingRequired:"yes"` | 1 card: `data-p53-sol-produto="FortiEndpoint"`, `h4` **FortiEDR**, `data-p53-sol-item-id="fortiedr"`, `acao="avaliar-aquisicao"`, tier **prioritária** (gap-high), linha *"Variante resolvida pelo contexto declarado — linha de produto: FortiEndpoint"*; **sem** veto arquitetural visível (E5: o card já explica); papel idem, com tier, ação e variante |
| 2 | **C2** EDR de terceiro em produção | **nenhum card**; bloco *"Não indicado nesta leitura"* com `li[data-p53-veto-item="FortiEndpoint"]`: motivo literal *"tecnologia operacional — apoio em operacionalização (nunca substituição)"* + *"Tecnologia declarada: <EDR> (production)"*; Camada 1 continua oculta (`porCapability` pela nota); papel: `.p53-pr-vetos[data-p53-vetos="1"]`, seção impressa só com o bloco |
| 3 | **C3** FortiSOC só em `soc-platform` | ~~D-3 default: card `FortiSOAR` `modo="hipotese"`, `condicao="capability-nao-informada"` visível em tela e papel, tier prioritária (sev 2); zero veto; `[data-p53-suprimido]` ausente. Com a constante ligada: mesmo card, tier 2, condição *"Plataforma declarada (FortiSOC) cobre esta capability…"* — **nunca** veto~~ — **revisto na Fase 6 (O-1 do PO; errata E15 da spec)**: **hipótese `plataforma-declarada-cobre`, após validação** — card `FortiSOAR` `modo="hipotese"`, `condicao="plataforma-declarada-cobre"`, tier 2 (após validação), condição visível em tela e papel («Hipótese do mapa: a plataforma declarada cobre esta capability; validar no aprofundamento.»); `published()` não vazio (a Camada 1 não volta); zero veto; `[data-p53-suprimido]` ausente — **nunca** veto |
| 4 | **C3b** FortiSOC na própria `security-automation` | `OPERATIONAL_GAP` + M75 → sem card; veto `operacional`/`plataforma` com a nota M75 literal; Camada 1 oculta |
| 5 | **C4** Sentinel em produção | nenhum card; bloco de vetos com 2 linhas (`data-p53-vetos="2"`: FortiAnalyzer, FortiSIEM), motivo literal, *"Tecnologia declarada: Microsoft Sentinel (production)"* |
| 6 | **C5** legado, sessão de referência | mesmos 9 cards e tiers; cada um com `condicao="sem-contexto"` visível (D-6); papel **9/9** com `data-p53-sol-tier` + texto, condição, *"Escopo: cobre a camada de endpoint…"* no FortiEndpoint e o escopo do MAP no FortiRecon |
| 7 | **C6** NDR `NONE`, `saasAllowed:"no"` | card linha `FortiNDR`, `h4` **FortiNDR (On-Premises)**, `item-id="fortindr-onprem"`, prioritária; curável como `FortiNDR`; papel idem |
| 8 | **C7** FortiEDR on-prem, monitoring `NONE`, staffing gap | **1 card**: `FortiGuard SOCaaS`, `acao="servico"`, prioritária, `origem="gap"`, elegibilidade *"sem restrições"*. Vetos: `FortiGuard MDR` (razão literal *"…OG oficial"*; capabilities Cobertura de monitoramento, Capacidade e resiliência do time) e `FortiEndpoint` (*"nunca substituição"* · *"Tecnologia declarada: FortiEDR (production, on-prem)"* · extensão contextual `[data-p53-sol-extensao="fortixdr"]`, M50). FortiXDR **não** vira card (D-5) |
| 9 | **C7-UNSET** (`endpoint-detection` não declarado) | MDR permanece **hipótese** (D-6: *"base requerida ausente"* com `UNSET`/`UNKNOWN` é abstenção), tier por sev, zero veto — nada inventado |
| 10 | **C8** legado, endpoint lv0 | igual a hoje + `condicao="sem-contexto"` em tela e papel; zero veto (023 E1 preservada) |
| 11 | **C9** sinal `dataLeakageConcern` | igual: `acao="conversa-por-sinal"`, `origem="sinal"`, tier 2, 2 capabilities unidas (`D022-PROD1`); qualificador e origem agora no papel |
| 12 | **C10** `saasAllowed:"yes"` | 3 cards modo motor `avaliar-aquisicao`; `FortiSIEM` com `data-p53-sol-variantes="fortisiem, fortisiem-cloud"` e *"Disponível também como FortiSIEM Cloud"* — Cloud **não** vira card (E2) |
| 13 | **F2-placeholder** (endpoint `NONE`, arquitetura desconhecida; fixture do `D023-REG1`) | card `FortiEndpoint` `acao="modalidade-a-definir"`, tier **2 sempre** (E9), *"Modalidade a definir no aprofundamento: FortiEndpoint ou FortiEDR"*; `cards == published()` |
| 14 | **Gate de suficiência fechado**, mesmo com capability `NONE` declarada | porta de saída: toda linha hipótese, zero veto (INV-3; `D010-F3`/`D010-ARB1 (c)` por construção) |
| 15 | **Legado** (`contexts:{}`) | toda linha `hipotese`/`sem-contexto`, tier por sev; zero veto, zero serviço, zero elegibilidade (`serviceEligibility` leria `UNSET` como ausência) |
| 16 | Engine ou Camada 1 ausentes ou lançando (`entradaViva() === null`) | hipóteses do mapa + `console.error` nomeando o que faltou — nunca silêncio (R10 §2) |
| 17 | **Acréscimo manual** (`include` de produto não ofertado) | inalterado: card com `[data-p53-prov]` em tela e papel, sem tier, sem capability; ganha só `data-p53-sol-origem="operador"` e `data-p53-sol-acao="hipotese"`. "Condições" do item manual não existem no estado (D-8) |
| 18 | **Exclusão em C1**: `set("FortiEndpoint","exclude")` | retira o card FortiEDR (`item-id="fortiedr"`) da tela e do papel; `[data-p53-suprimido="1"]` nas duas; `unset` devolve o card. A identidade curável é a **linha**, qualquer que seja a variante resolvida |
| 19 | **Item sem par** (`chave:null` — `fortisoc`, `fortimail*`, `fortisandbox`, `fortiaigate`, `fortipam`, `fortiauthenticator`, `fortisat`, `fortigate`, nós de família; só por sinal) | publicável e **incurável**, como hoje (`ui_curation_v32.js:142`, `ui_p52_support_v32.js:139`); `nome` = `OFFERINGS[itemId].name`. Residual declarado: `published() ≠ cards` já é latente hoje nesse caso |
| 20 | Mesma linha com **card numa capability e veto noutra** (FortiEndpoint candidato em `endpoint-detection`, vetado em `vulnerability-management` com Tenable em produção) | card modo motor; a leitura vetada vai a `vetosDaLinha` e ao bloco de vetos **nomeando a capability** — as duas coexistem |
| 21 | **Hipótese e veto na mesma linha** (C7: MDR hipótese por `team-capacity`, vetado pela elegibilidade) | precedência veto > hipótese (E4): sem card; a hipótese cai |
| 22 | **Serviço do motor sem linha do MAP** na pergunta (`fortiguard-mdr` por `endpoint-detection`) | não vira card (D-5); entra em `servicos[]` do veto ou nota, informativo; `#v32support`/`#pr-support` já o listam |
| 23 | Sessão pré-025 com `include` sobre linha que o motor passa a **vetar** | importa com o mesmo significado; o card nasce como escolha do operador, com selo de proveniência — residual declarado, uma linha no relatório final |
| 24 | **Supressão total pela curadoria** com vetos presentes | aviso de supressão (D4 da 024) **e** bloco de vetos, marcadores distintos (`data-p53-suprimido` ≠ `data-p53-vetos`); `D023-PAP1` conta o mesmo nas duas superfícies |
| 25 | Reconciliação chamada duas vezes, antes e depois do render | `reconcile(entrada)` idempotente (JSON idêntico); `legacySnapshot()` e `buildRecommendationContext()` byte-iguais antes e depois de `oferta()`/`vetos()`/`contract()` (pureza, E10) |

## Vocabulário

**Registrados agora no `CONTEXT.md`** (Fase 0, caminho normal da R12), por
critério, com `_Evitar_` — colisões conferidas contra todo o glossário:

- **Registro de decisão de apoio** — o objeto que a demanda existe para
  instaurar. Não colide com *Curadoria do relatório* (decisão do operador) nem
  com *Substituto* (predicado de arbitragem): o registro é o que a curadoria
  decide **sobre** e o que a arbitragem lê **por** `published()`.
- **Hipótese condicionada** — o modo "sem voz do motor". Delimitada de
  *Habilitador a validar* (o ITEM sob capability não declarada — uma das
  condições; aqui qualifica-se a LEITURA, em todas elas) e de *Vão de contexto
  parcial* (estado de SESSÃO). O critério é o de `temVoz()` ≡ `hasSubstituteV32`.
- **Veto do motor** — a negativa com razão literal. Delimitado de *Supressão
  pela curadoria* (do operador) e de *Arbitragem de camada* (apresentação):
  veto não é supressão, não conta em `[data-p53-suprimido]` e não retira
  substituto.
- **Linha de produto** — a identidade curável (chave de `PRODUCTS`), distinta
  do item resolvido (título) e do nó de família (motor). É o que
  `data-p53-sol-produto` sempre carregou e o que `decisions` sempre chaveou.

**Vocabulário interno** (spec/plan/código; **não** vai ao glossário):
*reconciliação* / `reconciliar(entrada)`, *coletor* / `entradaViva()`, *porta de
saída* (§2.1), *fusão por chave* e *precedência* (§2.5), *pareamento* /
`chaveDe()` (§1.4), *condição* como enum (`condicao`), *título* (`titulo`),
*voz do motor* / `temVoz()`.

**Dívida de vocabulário que NÃO resolvo aqui** (declarada pela 025, passe
próprio do PO): o papel de quem conduz a sessão tem três nomes — *facilitador*
(`CONTEXT.md:59`), *operador* (verbetes de curadoria), *engenheiro* (tela,
`PROV_TXT`). Este refinamento usa *facilitador* na §Necessidade por ser o termo
do glossário; os verbetes novos evitam predicar com o nome do papel.

**Pino**: `CONTEXT.md` é pinado (`.claude/verify/pins.json:370`) —
`gen_pins.py` no mesmo PR, com o motivo no commit (R8 §1). Se a ratificação no
PR alterar algum termo, a emenda vem **antes** do repin.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta registrada |
|---|---|---|
| 0 | Origem — a auditoria de 2026-10-31 e o plano de correção (§2, microfase 01): abrir a 026 como **demanda** (contrato único de decisão), não como `fix-finding` do `EA-76`? | Instrução do proprietário de 2026-10-31 (prompt da microfase 01): *"Implemente uma correção restrita para que a apresentação de apoio por produto, a curadoria e o PDF respeitem as decisões do motor contextual e preservem os qualificadores da recomendação"*, com o contrato desejado em §2 (*"representação única da decisão que possa ser consumida por tela, curadoria e impressão"*). O orquestrador abriu a 026 sob essa instrução |
| D-1 | C2/C4: **sem card de aquisição** para a linha vetada, com o veto visível e a nota literal do motor — a ação "operacionalizar/expandir" fica no card de capability (`#v32support`/`#pr-support`)? Alternativa: card da linha com ação e sem tier (o produto vetado volta a ter nome na seção) | Adotada a recomendação (sem card; veto visível) — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR |
| D-2 | `CONTEXT_NOT_INFORMED` (inclui as 3 capabilities `landscapeEnabled:false`) = **hipótese condicionada com tier por `sev`**? Alternativa ("sempre após validação" / "sem produto") torna falso o oráculo declarado `substituto:true` de F1/F1b/F4 da 010 → parar e escalar | Adotada a recomendação (hipótese condicionada, tier por sev) — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR |
| D-3 | C3: `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false` (hipótese condicionada; lacuna de `classify` ao backlog; C3b como caso "plataforma cobre")? Ligar por veto devolve a Camada 1 (§2.6); a forma segura, se quiser C3 visível, é condição `plataforma-declarada-cobre` + tier 2, nunca veto | ~~Adotada a recomendação (`false`)~~ — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR. **Reversão na Fase 6 (O-1 do PO): `false` na W2 → `true` na Fase 6.** O aceite de intenção do `product-owner` (2026-10-31) reprovou nomeando a objeção O-1 — com `false`, o C3 declarado da forma natural (FortiSOC em `soc-platform`) seguia «FortiSOAR · indicação prioritária» em tela e PDF, e o plano do proprietário exige explicar uso/expansão da capacidade já existente; o PO mediu a forma segura (`true` numa cópia): hipótese «plataforma-declarada-cobre», após validação, `published()` não vazio, zero veto. O orquestrador acolheu a objeção — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR. Red `6122bb7`, green `860735a`; errata E15 da spec. A recomendação que o PR leva ao proprietário passa a ser `true`; se invertida, `false` e o C3 do plano fica em aberto no `EA-122` |
| D-4 | Vetos do motor **visíveis nas duas superfícies**, agrupados por linha, com razão literal e *"Tecnologia declarada"*? Alternativa: só no `diag()` — C7 sem explicação ao facilitador | Adotada a recomendação (visíveis em tela e papel) — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR |
| D-5 | Serviços do motor e `fortixdr` **não** viram card quando o MAP não os oferece para a pergunta — entram nomeados na nota ou no veto? Alargar = demanda própria (cards novos, `PORTFOLIO`, ícones) | Adotada a recomendação (sem card; nomeados) — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR |
| D-6 | Linha de hipótese condicionada **visível em tela e papel nos dois modos** (`CONDICAO_TXT` por enum; em legado *"contexto tecnológico não informado nesta sessão"*)? Alternativa: só fora do legado | Adotada a recomendação (visível nos dois modos) — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR |
| D-7 | **Título do card = item resolvido** quando a chave fundiu um só item (C1 *FortiEDR*, C6 *FortiNDR (On-Premises)*); `data-p53-sol-produto` = linha — reabre a 022 E2 só na forma? Alternativa: `h4` = linha + sub-linha de variante | Adotada a recomendação (título = item resolvido) — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR |
| D-8 | "Condições" do acréscimo manual **não** existem no estado (019 C1: ids + enum) — limitação declarada, demanda própria se quiser? | Adotada a recomendação (limitação declarada) — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR |
| D-9 | Editor mostra *"apresentado como <variante>"* (W3b, ≈8 linhas; `data-p53-cur-item` = linha)? Alternativa: zero linha no editor | Adotada a recomendação (sim) — decidido pelo orquestrador sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR |
| 1 | **Portão da Fase 0** — este refinamento + os 4 verbetes + D-1..D-9 em bloco | *(pendente — ratificação literal do proprietário no PR; R4: aprovação é do usuário, no chat)* |

Coluna renomeada: nesta Fase 0 não houve resposta do usuário; a ratificação
literal vem no PR (T069).

> Guarda de escalonamento (desenho §10): queda de oráculo declarado de outra
> demanda (`D010_DECLARED.substituto`, `V10`/`D010-INV7`, `D019-MED1`,
> `D015-TIT1`) ou inversão de D-1/D-2 → **parar e escalar**, nunca reancorar por
> conta.

## Fora de escopo (explícito)

Do desenho (§11), com rota:

- **Engine** (`engine_v32.js`, frozen): `sup.caps` não consultada no ramo
  `CONTEXT_NOT_INFORMED` (`:573`, `:584`, `:636` vs `:601-602`); `violated`
  descartado em silêncio (`:448`); serviço inelegível descartado em silêncio
  (`:659`). Backlog, Porta B futura.
- **`ui_v32.js`**: cláusula em `hasSubstituteV32` para contar veto-com-razão
  como substituto — só se D-3 for ligada por veto, o que não é o caso.
- **Itens sem par na Camada 1** (`chave:null`): publicáveis e incuráveis, como
  hoje. Rota: Porta B em `PRODUCTS` (`specs/019-curadoria-do-relatorio/spec.md:215-218`)
  ou alternativa restrita a esse grupo, em demanda própria.
- **Serviços do motor sem linha do MAP** e `fortixdr` como card (D-5): demanda
  própria.
- **`exclude` obsoleto sem sujeito** no arquivo de sessão: achado de backlog.
- **Blocos `[data-pr-gap-support]`** (`D021-*`, `P51-REC1`): fora do escopo.
- **Memoização** de `reconciliar()`: otimização futura.
- **Deploy, merge, selagem** e o Docker em `127.0.0.1:1337`: do proprietário.

Do plano do proprietário (§1 e §3) — **microfases 02 a 05**, que esta demanda
não resolve nem incidentalmente:

- **Metodologia** (02): nome do resultado (índice próprio ou bandas), equivalência
  a estágio SOC-CMM, confiança (completude × origem × validação), respostas
  desconhecidas e cobertura, crosswalk com os 27 aspectos, neutralidade do
  modelo de referência.
- **Atribuição** (02): licença, autoria, delimitação de conteúdo adaptado e
  restauração da atribuição no PDF.
- **Bug decimal** (02): comparação e as 64 combinações — não é desta demanda.
- **Checker de suítes que ignora o returncode** e identidade do HTML servido
  (03); jornada e relatório executivo (04); guard de sessões e piloto (05).
- **Invariante 8 do plano**: perguntas, pesos, `SCORES`, `stageOf`, suficiência
  e significado metodológico **não mudam** — C5 da 019 continua critério:
  payload M41 byte-idêntico.
