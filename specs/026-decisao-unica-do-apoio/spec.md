# Spec — 026-decisao-unica-do-apoio

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md), não o repete.
>
> **Quem escreveu**: o `tech-lead`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-10-31, sob delegação do orquestrador, na branch
> `feature/026-decisao-unica-do-apoio` (base `develop @ 9509e4b`, conforme a
> delegação; `pins.json → _meta.gerado_de_head = 8c1617e…`, gerado em 2026-10-31 —
> o stage `baseline` decide a identidade, eu não executei `git`). Tudo o que está
> citado como `arquivo:linha` foi **lido por mim nesse HEAD**; nada foi executado
> além de leitura (`sed`, `grep`, `python` só para ler JSON e calcular o SHA-256
> de `specs/PHASE_5_0_REV_B.md`). Nenhum arquivo fora de `specs/026-…/{spec,plan,tasks}.md`
> foi tocado.
>
> **Fonte de verdade desta fase**: [`anexos/desenho-sintese.md`](anexos/desenho-sintese.md)
> (desenho FINAL, lente tech-lead, 438 linhas) — esta spec **não reabre** o
> desenho; converte-o em critérios, gates, contratos e cross-check, e registra
> as **três correções que a conferência no código impôs** a ele (§Reancoragens e
> §Contratos → *o que a conferência mudou*). Insumos nomeados: `anexos/contrato-motor.md`
> (motor), `anexos/custo-identidade.md` (identidade curável), `anexos/anatomia-apresentacao.md`
> (tela e papel), `anexos/refutacao-reproducoes.json` + `anexos/cenarios/*.json`
> (fixtures sintéticas C1..C10, C3b) e `anexos/sonda-leitura.js` (sonda jsdom
> read-only que mediu motor × tela × papel no HEAD).
>
> **`refinement.md`** existe (`specs/026-decisao-unica-do-apoio/refinement.md`,
> Fase 0 pelo template, 2026-10-31) e os quatro verbetes estão em
> `CONTEXT.md:247-305`; o planning-state continua `phase: "refinement"` /
> `in_progress` até o portão da Fase 0.
>
> **Decisões D-1..D-9** (`desenho-sintese.md` §10): adotadas na recomendação do
> tech-lead, **decididas pelo orquestrador sob a instrução do proprietário de
> 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR**. Nenhum
> portão desta spec se apoia em aprovação de agente (R4; R2 §4).

## Objetivo

Fazer **"o que o motor ofereceu nesta sessão" nascer uma vez**, em
`ui_curation_v32.js` (dono do estado da curadoria, bridge `__CURATION`), como
lista de **registros de decisão de apoio** e lista de **vetos** com a razão
literal do motor — reconciliando a Camada 1 (`computeFindings()+MAP`, hipótese
por pergunta) com o motor contextual (`V32.buildRecommendationContext()`, que
veta, resolve variante, qualifica e confirma serviço onde tem voz) — e fazer
tela (`ui_p52_support_v32.js`), editor (`ui_curation_edit_v32.js`) e papel
(`papelHTML()`) **consumirem** o mesmo registro, com qualificador, ação,
variante, condição, escopo e origem preservados no PDF. Link: [refinement.md](refinement.md)
(W0) · origem: auditoria externa de 2026-10-31 (**QS-01** cards contradizem o
motor; **QS-02** o PDF perde qualificadores) e `EA-76` (`.claude/BACKLOG.md:7094-7149`,
*"candidato natural é o módulo de curadoria, que já é dono do estado"*).

Vocabulário desta spec (verbetes registrados em `CONTEXT.md` (W0/T002), **por
critério**, EA-47): *Registro de decisão de apoio*, *Hipótese condicionada*,
*Veto do motor*, *Linha de produto*. Verbetes já existentes que esta spec usa
sem redefinir: *Curadoria do relatório* (`CONTEXT.md:210-222`), *Supressão pela
curadoria* (`:224-231`), *Substituto* (`:601-613`), *Whitespace* (`:93-96`),
*Tier* (`:108-111`), *Arbitragem de camada* (`:167-171`), *Consumo da leitura
congelada* (`:202-208`). **Atenção do PO na W0**: o verbete *Habilitador a
validar* (`CONTEXT.md:153-158`) já define "hipótese quando o contexto da
capability NÃO foi declarado" — *Hipótese condicionada* é o mesmo conceito
alargado (legado, `CONTEXT_NOT_INFORMED`, gate fechado, `UNSET`/`UNKNOWN`,
fora do catálogo contextual); o PO optou por verbete novo com remissiva a
*Habilitador a validar* (`CONTEXT.md:272-274`) — nunca dois verbetes para o
mesmo critério.

## Critérios de aceite → gates

Namespace **`D026-*`**. Suíte nova **`tests_026_contrato.js`** (jsdom, sem
Chromium; padrão de `tests_019_curadoria.js:50-125` — `T()`, `vac()` para falha
nomeada por vacuidade, `boot(opts)` sobre o HTML construído, variáveis
`D026_HTML_OVERRIDE` e `D026_ONLY`). **Três gates**, cada um com alíneas
nomeadas; caso positivo, negativo, adversarial e regressão vivem nas fixtures.
Harness de mutação **`tests_026_mutants.js`** (runner no padrão de
`tests_025_mutants.js`: mutação em cópia, rebuild em `os.tmpdir`, `--preflight`
com `ocorrencias == 1`, três estados; `reason` **nominal por gate**, nunca
`/N FAIL/`). Chave **`d026`** em `expected_suites.json → suites` e em
`mutation_map.json → harnesses`, **no mesmo PR**, na wave de fecho, depois do
green (R10 §3; errata E2 da 019: o registro é oráculo de contagem VERDE; o
stage `suites` fica **vermelho nomeado** — "suíte fora do registro" — do commit
do red até o registro, como na 019 e na 025).

**Oráculos independentes da implementação** (nenhum gate lê `oferta()` como
oráculo de si mesmo):

- o **motor público** (`engine_v32.js:811-817`): `V32.classify`,
  `resolveCandidates`, `archSatisfied`, `serviceEligibility`,
  `suppressedByPlatform`, `buildRecommendationContext`, `isLegacyModeV32`;
- o **pareamento `itemId → chave` reimplementado no teste** a partir de
  `V32.OFFERINGS`/`V32.SERVICES`/`V32.SERVICE_FAMILIES`/`PRODUCTS` pelas regras
  §1.4 do desenho (nunca `chaveDe` do produto);
- a **Camada 1**: `computeFindings()+MAP+PRODUCTS` (o oráculo do `D019-SOL1`,
  `tests_019_curadoria.js:378-384`), aqui **declarado** como oráculo de
  *hipótese* — vale em legado, `CONTEXT_NOT_INFORMED` e gate fechado;
- a **tela**: cards `#p52-sec-support > .apoio-block[data-p53-sol-produto]`, o
  bloco `:scope > [data-p53-vetos]`, o aviso `[data-p53-suprimido]`;
- o **papel**: `#v32-print-report` **após `beforeprint`** despachado na janela
  (precedente S37 / `D019-PAR1`); `#pr-sup-solucao .pr-card` e
  `.p53-pr-vetos[data-p53-vetos]`;
- `__CURATION.published()`, `.offered()`, `.state()`, `.contract()`;
  `__DEV.legacySnapshot()`; `FX010.d010HasSubstitute(w)` (predicado da 010,
  `fixtures_010_vao.js:668`), `#p50-results[data-p50-gate]`.

**Fixtures** (todas sintéticas, construídas na própria suíte por `__DEV` +
escrita em `V32.TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT`/`SESSION_SIGNALS`, como
`anexos/sonda-leitura.js:33-39`; valores literais em `anexos/cenarios/*.json`):
**C1** (`endpoint` 0; `endpoint-detection` NONE; `saasAllowed:"no"`,
`localProcessingRequired:"yes"`), **C2** (`endpoint` 0; EDR de terceiro em
`production`/`saas`), **C3** (`automation` 0; FortiSOC declarado só em
`soc-platform`), **C3b** (idem + FortiSOC declarado em `security-automation`),
**C4** (`logs` 0; Microsoft Sentinel em produção), **C5** (`arq:1`,
`[1,2,2,2,1,1,1,1,1,1,"NA",1,2,0,0]`, prios `mandate/training/knowledge`,
legado), **C6** (`network-visibility` 0; `network-detection` NONE;
`saasAllowed:"no"`), **C7** (`monitoring-coverage` 0, `team-capacity` 0,
`endpoint` 1; FortiEDR `production`/`on-prem`; `continuous-monitoring` NONE),
**C7-UNSET** (C7 sem a declaração de `endpoint-detection`), **C8** (`endpoint`
0, nada declarado — legado), **C9** (`dataLeakageConcern:true`,
`data-loss-prevention` NONE), **C10** (`endpoint` 0, `logs` 0;
`endpoint-detection`/`security-analytics` NONE; `saasAllowed:"yes"`),
**F2-placeholder** (`endpoint-detection` NONE, arquitetura desconhecida — a
fixture F2 de `tests_023_leitura.js:156`), **GF** (gate fechado por
`poucasRespostas`, em duas variantes: `endpoint-detection` NONE e
`endpoint-detection` PRESENT/terceiro em produção — ver C5 abaixo).

| # | Critério | Gate · arquivo · asserção (alínea exata do desenho §7) | Mutante previsto |
|---|---|---|---|
| C1 | **Veto visível, nunca aquisição.** Onde o motor diz *operacionalizar/expandir/enablement* (ou plataforma, avaliação, validar) a linha do MAP **não vira card**; o bloco de vetos nomeia a linha, a razão **literal** do motor (`ctx.notes`) e "Tecnologia declarada: <product> (<status>)". QS-01 casos 2 e 4; aceites 1 e 4 do plano §2 | **`D026-REC1 (b)`** · `tests_026_contrato.js` · C2/C4: pré `ctx.supportMode === "CONTEXTUAL" && ctx.candidates.length === 0` (motor público); **zero** `[data-p53-sol-produto]` na seção; `[data-p53-vetos]` presente com `li[data-p53-veto-item]` por linha vetada (C4: `data-p53-vetos="2"`, FortiAnalyzer e FortiSIEM) e `txt(li)` contendo `ctx.notes[0]` literal **e** "Tecnologia declarada" | **`D026-M1`** (`ui_curation_v32.js`: `reconciliar` trata todo `ctx` como `CONTEXT_NOT_INFORMED` — ignora `temVoz`) ⇒ C2/C4 voltam ao MAP, cards reaparecem, zero veto; **`D026-M4`** (`ui_p52_support_v32.js`: `declararVetos` escreve `data-p53-suprimido` em vez de `data-p53-vetos`) ⇒ (b) sem `[data-p53-vetos]` |
| C2 | **A variante resolvida é o título; a linha é a identidade.** Candidato `offering` do motor vira card **modo motor** sob a linha do MAP que o cobre: `data-p53-sol-produto` = linha (`PRODUCTS[chave].n`), `h4` = item resolvido, `data-p53-sol-item-id` = id do motor; variante de uma linha **nunca** vira card próprio (E2/022); o pareamento é **total** sobre `OFFERINGS ∪ SERVICES` e por critério (D-7; QS-01 caso 1; NDR; C10) | **`D026-REC1 (a)(c)(e)(g)(i)`** · idem · (a) C1: pré `archSatisfied(OFFERINGS.fortiendpoint.architectureRequires) === "violated"`; card `[data-p53-sol-item-id="fortiedr"]`, `h4` "FortiEDR", `data-p53-sol-produto="FortiEndpoint"`, `data-p53-sol-tier="prioritaria"` (gap-high), **zero** `[data-p53-vetos]` (E5); (c) C6: `item-id="fortindr-onprem"`, `h4 === OFFERINGS["fortindr-onprem"].name`, linha `FortiNDR`; (e) C10: card `FortiSIEM` com `data-p53-sol-variantes="fortisiem, fortisiem-cloud"`, **sem** card "FortiSIEM Cloud"; (g) **totalidade**: `chaveDe` reimplementado no teste é definido sobre todo `OFFERINGS ∪ SERVICES`, toda chave de `PRODUCTS` (13) tem ≥ 1 pré-imagem (a do `FortiGuard-Service-Bundle` nasce da constante da regra 4, exceção declarada), e `fortisoc`/`fortimail*`/`fortiaigate`/`fortipam`/`fortiauthenticator`/`fortisat` → `null` — **e** o produto concorda: para cada id, o card (ou veto) que o carrega em `data-p53-sol-item-id` tem `data-p53-sol-produto` igual à chave reimplementada; (i) **F2-placeholder**: pré `ctx.candidates[0].itemKind === "family"` (motor público, `engine_v32.js:647`); card `data-p53-sol-produto="FortiEndpoint"`, `data-p53-sol-item-id="endpoint-family"`, `data-p53-sol-acao="modalidade-a-definir"`, `data-p53-sol-tier="validacao"` (E9 — nunca `prioritaria`), `.p53-sol-variante` com texto não vazio; `cards.length === published().length` | **`D026-M3`** (`ui_curation_v32.js`: `chaveDe` pareia **só por nome** — regras 2–3 removidas) ⇒ `fortiedr`/`fortindr-onprem`/`fortisiem-cloud` viram chave própria: (a) `data-p53-sol-produto` ≠ "FortiEndpoint", (c) linha ≠ `FortiNDR`, (e) nasce card "FortiSIEM Cloud"; **`D026-M1`** também derruba (a) e (c) (C1/C6 voltam ao MAP: `h4` = linha, sem `item-id`) |
| C3 | **Serviço gerenciado: a elegibilidade é do motor, e veto vence hipótese.** `serviceEligibility()` inelegível sobre landscape **declarado** ⇒ veto com a `reason` literal; serviço disparado pelo motor ⇒ card `servico` com tier por `gap-high` e `elegibilidade` do `note`; hipótese do MAP da **mesma chave** em outra capability **cai** diante do veto (E4) | **`D026-REC1 (d)(f)`** · idem · (d) C7: pré `serviceEligibility("fortiguard-mdr").eligible === false` e `reason` começa por "base declarada apenas em deployments não elegíveis"; **sem** card `[data-p53-sol-produto="FortiGuard MDR"]`; `li[data-p53-veto-item="FortiGuard MDR"]` com a `reason` literal; card `FortiGuard SOCaaS` com `data-p53-sol-acao="servico"` e `data-p53-sol-tier="prioritaria"` (controle positivo, `origem="gap"`); veto de `FortiEndpoint` com `[data-p53-sol-extensao="fortixdr"]` e o `scopeNote` M50 literal; `li[data-p53-veto-item="FortiEndpoint"]` com `txt` contendo "Tecnologia declarada: FortiEDR (production, on-prem)" (`C7.json`); card SOCaaS com `.p53-sol-elig` contendo o `note` literal de `ctx.services[]` para `fortiguard-socaas`; (f) **precedência**: em C7 nenhum card `FortiGuard MDR` **apesar** de `MAP["team-capacity"].lv[0].c` o listar (`v3_1_3.html:431`) e de `soc-staffing` ser `CONTEXT_NOT_INFORMED` | **`D026-M5`** (`ui_curation_v32.js`: fusão sem a precedência veto > hipótese — `vetos.length > 0` deixa de derrubar `hipoteses[]`) ~~⇒ (d) e (f) publicam "FortiGuard MDR · indicação prioritária" via `team-capacity`~~ — **corrigido pela errata E12 (W4b, 2026-10-31)**: medido que em C7 o MDR é vetado por inelegibilidade em **toda** linha da chave, `hipoteses[]` do MDR nasce vazio e `REC1 (d)(f)` são garantidas pelo veto por linha, não pela fusão (M5 sobreviveu na primeira execução da campanha); M5 passa a ser julgado por **`REC1 (j)`** (fixture C4-DL: `FortiSIEM` com hipótese por `detection-engineering` e veto por `security-analytics` ⇒ zero card, veto presente, `published()` sem `FortiSIEM`; sob M5 publica "FortiSIEM · indicação prioritária" ao lado do próprio veto) |
| C4 | **Sem voz do motor nada é inventado.** Legado, `CONTEXT_NOT_INFORMED` (inclui as 3 capabilities `landscapeEnabled:false`, `engine_v32.js:43-45`), `UNSET`/`UNKNOWN` na base de um serviço (D-6) e fora do catálogo contextual ⇒ **hipótese condicionada**, tier por `sev`, **condição visível em tela e papel nos dois modos** (D-2, D-6); zero veto; C3 nasce com `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false` (D-3) e C3b é o caso "plataforma cobre" | **`D026-LEG1 (a)(b)(c)`** · idem · (a) C8 (legado): card `FortiEndpoint`, `data-p53-sol-acao="hipotese"`, `data-p53-sol-condicao="sem-contexto"`, `data-p53-sol-tier="prioritaria"`, `.p53-sol-condicao` com texto não vazio, zero `[data-p53-vetos]`; **oferta ≡ `computeFindings()+MAP`** (conjunto de linhas e pares produto × capability — o oráculo do `D019-SOL1`, declarado aqui como oráculo de hipótese); (b) C7-UNSET: card `FortiGuard MDR` com `acao="hipotese"` e `condicao="capability-nao-informada"`, zero veto, e pré `serviceEligibility("fortiguard-mdr").reason` começa por "base requerida ausente" com `TECH_LANDSCAPE["endpoint-detection"].presence === "UNSET"`; (c) C3: card `FortiSOAR` `condicao="capability-nao-informada"`, tier `prioritaria` (sev 2), zero veto, `[data-p53-suprimido]` **ausente** — pina a constante em `false`; **C3b**: zero card `FortiSOAR`, `li[data-p53-veto-item="FortiSOAR"]` com classe `operacional` ou `plataforma` e `txt` contendo "M75" | **`D026-M6`** (`ui_curation_v32.js`: remove a exceção D-6 em `veredictoDeServico` — "base requerida ausente" vira veto também sob `UNSET`/`UNKNOWN`) ⇒ (b) MDR vetado em C7-UNSET. A constante de (c) **não tem mutante próprio**: a alínea pina o valor (`true` sem a forma segura da §2.6 faria (c) cair por `[data-p53-vetos]`), e o backlog carrega a lacuna do engine (§Fora de escopo) |
| C5 | **Gate fechado e leitura congelada.** Sob `__P50SUFF.contract().sufficient === false` nada do motor vira veto (INV-3 pelo lado da apresentação); onde há veto, a região congelada **permanece oculta** (`porCapability` pela nota) e o veto **nunca** é supressão (`[data-p53-suprimido]` ausente sem curadoria) | **`D026-LEG1 (d)(e)`** · idem · (d) **GF** nas duas variantes (`poucasRespostas` + `endpoint-detection` NONE; `poucasRespostas` + terceiro em produção): `#p50-results[data-p50-gate] !== "released"` (vacuidade nomeada), cards de hipótese com `condicao="contexto-a-validar"` nas duas variantes, **zero** `[data-p53-vetos]`; (e) em **toda** fixture com `[data-p53-vetos]` (C2, C4, C7, C3b): `FX010.d010HasSubstitute(w) === true`, nenhum `.apoio-block` congelado visível no escopo de apoio (censo `tests_010_vao.js:168-196`), **e** `[data-p53-suprimido]` ausente (a invariante do `D025-AUS1 (b)`, remedida onde há veto) | **`D026-M4`** ⇒ (e) `[data-p53-suprimido]` presente sem curadoria em C2/C4/C7. **(d) sem carrasco próprio entre M1–M6**: a variante NONE é hipótese por construção do engine (`classify` exige `assessmentSufficient()` para `TECHNOLOGY_WHITESPACE`, `engine_v32.js:402-404`); a variante *terceiro em produção* é a única que a porta de saída de suficiência decide (`OPERATIONAL_GAP` não consulta suficiência) — alínea de regressão, **dívida declarada** na matriz (precedente `D025-INV8 (c)`) |
| C6 | **O papel diz o que a tela diz, por card** (QS-02). Qualificador, ação, origem, condição, variante, elegibilidade e escopo saem no `pr-card` **por cópia do card** (derivação, nunca recálculo — `D019-PAR1`); o bloco de vetos sai no papel com a mesma contagem e os mesmos itens | **`D026-PAP1`** · idem · para cada `pr-card` de `#pr-sup-solucao` após `beforeprint`, em C1/C5/C7/C9/C10: `data-p53-sol-tier`, `-acao`, `-item-id`, `-origem`, `-condicao`, `-variantes` **iguais** ao card homônimo da tela (`data-p53-sol-produto`); `.p53-pr-tier` com o texto do tier ("indicação prioritária"/"após validação"); **C5**: 9/9 `pr-card` com `data-p53-sol-tier` e `.p53-pr-tier` (7 `validacao`, 2 `prioritaria` — contagem **medida pela fixture**, nunca pinada como requisito futuro) e `pr-card[FortiEndpoint]` com `.p53-pr-escopo` contendo "Escopo: cobre a camada de endpoint"; `pr-card[data-p53-sol-produto="FortiRecon"]` com `.p53-pr-escopo` contendo "complementa o programa de gestão de vulnerabilidades" (escopo do MAP, não do motor); **C1**: `<b>` "FortiEDR" + `.p53-pr-variante`; **C9**: `.p53-pr-tier` "após validação" + `data-p53-sol-origem="sinal"` + `data-qs22-sinais` não vazio; **C2/C7**: `.p53-pr-vetos[data-p53-vetos]` com a **mesma** contagem e os **mesmos** `data-p53-veto-item` da tela; **C2/C4**: a seção existe no papel **só com** o bloco de vetos (guarda `if (!cards.length && !aviso && !vetos) return ""`) | **`D026-M2`** (`ui_p52_support_v32.js`: `papelHTML` omite `data-p53-sol-tier`/`.p53-pr-tier` — **só no papel**, padrão `D019-M4`) ⇒ PAP1 vermelho em todas as fixtures |
| C7 | **Mesma decisão nas três superfícies; produto retirado não reaparece; acréscimo mantém o marcador.** `published()` ≡ conjunto de `data-p53-sol-produto` da tela ≡ do papel; `set(linha,"exclude")` retira o card da **linha** nas duas superfícies qualquer que seja a variante resolvida (D-7, `decisaoDe` por `idDoNome`); o editor lista a mesma linha e mostra "apresentado como <variante>" (D-9); o acréscimo humano continua com `[data-p53-prov]` em tela e papel e ganha `origem="operador"`/`acao="hipotese"` (D-8: sem condições no estado) | **`D026-REC1 (h)`** · idem · em C1/C7/C10: `new Set(published().map(id => PRODUCTS[id].n))` ≡ conjunto de `data-p53-sol-produto` dos cards da tela ≡ dos `pr-card` do papel (chave `null` fica fora dos três, por construção); **`D026-LEG1 (g)`** · idem · C1: `set("FortiEndpoint","exclude")` + re-render ⇒ `[data-p53-sol-item-id="fortiedr"]` ausente na tela **e** no papel, `[data-p53-suprimido="1"]` nas duas; `unset("FortiEndpoint")` devolve o card com o mesmo `item-id`; `[data-p53-cur-item="FortiEndpoint"]` existe no painel aberto e `.p53-cur-item-var` (se D-9 implementada) contém "FortiEDR"; acréscimo: `set(catalog() ∖ offered() [0], "include")` ⇒ card com `[data-p53-prov="operador"]`, `data-p53-sol-origem="operador"`, `data-p53-sol-acao="hipotese"`, **sem** `data-p53-sol-tier`, na tela e no papel | **`D026-M3`** ⇒ (g) `"FortiEndpoint":"exclude"` deixa de retirar o card `fortiedr` (chave própria); (h) `published()` ⊉ tela. Herdados: `D019-M4` (marcador só no papel) e `D019-M5` (`decisaoDe` ignorado) continuam os carrascos de `D019-PROV1`/`D019-MED1` |
| C8 | **A derivação é pura, sem efeito e nunca serializada; o isolamento transacional da 025 permanece.** `reconcile(entrada)` é função de dado; `oferta()`/`vetos()`/`contract()` não tocam `legacySnapshot()` nem `buildRecommendationContext()`; `toSession()` continua `{decisions, architectureNote}` (chave da Camada 1); A curada → B importada/nova/reiniciada não contamina B | **`D026-LEG1 (f)`** · idem · `reconcile(entrada)` com a mesma `entrada` duas vezes ⇒ `JSON.stringify` idêntico; `__DEV.legacySnapshot()` e `JSON.stringify(buildRecommendationContext())` **byte-iguais** antes/depois de `oferta()`, `vetos()`, `contract()` (snapshot tirado antes do primeiro render, precedente `D022-INV1`); `toSession()` em C1 com `exclude` ⇒ `{decisions:{FortiEndpoint:"exclude"}}` e **nenhuma** chave de `RESERVED_DERIVED` (`ui_session_v32.js:34-37`) no documento; `captureCanonicalInputs()` sem `oferta`/`vetos`. Isolamento: **herdado** de `D025-TRX1/TRX2/INV8/AUS1/NEW1/RST1` (inalterados; `tests_025_curadoria_sessao.js` 16/16) — a 026 não muda *quando* o owner é escrito nem *o que* ele guarda | **Sem carrasco próprio entre M1–M6** — alínea de regressão, **dívida declarada** na matriz (precedente `D025-INV8 (c)`); `D025-M2/M3/M5/M9/M23` continuam medindo o owner (âncoras byte-iguais, §Reancoragens) |

> **Nascem vermelhos** (R3 §4): os três gates. No red, `__CURATION.oferta`,
> `.vetos` e `.reconcile` **não existem**: cada gate falha **nomeando** o contrato
> ausente (padrão `bridge(w)` de `tests_022_escalonamento.js:133-137`:
> *"`__CURATION.oferta` ausente — o contrato da spec §Contratos não existe"*), e
> as alíneas de DOM falham por ausência dos atributos novos
> (`data-p53-sol-acao`, `-item-id`, `-condicao`, `[data-p53-vetos]`). O placar
> esperado do red é **`0 PASS · 3 FAIL de 3`**; o que nasceria verde **sem** os
> atributos novos fica declarado: `LEG1 (b)` (hoje o MAP já produz o card do
> MDR e nada veta) e `LEG1 (d)` — o poder de (b) está em `D026-M6`; (d) é a
> dívida declarada de C5.
>
> **D-9 (editor) não tem gate próprio**: é apresentação de uma decisão que já é
> a mesma por construção (o editor lê `offered()` do mesmo registro). A alínea
> `LEG1 (g)` mede `[data-p53-cur-item]` = linha (o que `D025-UNS1` já exige) e
> **só se** `.p53-cur-item-var` existir, o seu texto; a implementação de D-9 é
> conferida por leitura no `spec-validate`. Sem mutante — declarado.

### Reancoragens (D022-M10 muda de arquivo; comentários-trilha E13; nenhuma asserção enfraquecida)

Onde havia UMA asserção continua havendo UMA — ou passa a haver DUAS. Nenhuma
alínea antiga é afrouxada; nenhum literal pinado muda; nenhuma contagem
existente muda (`d019` 14, `d022` 14, `d023` 9, `d025` 16).

| Peça | O que muda | O que NÃO muda | Carrasco / prova |
|---|---|---|---|
| **`D022-M10`** (`tests_022_mutants.js:109-120`) | A linha-âncora `            if (capNome && reg2.caps.indexOf(capNome) < 0) reg2.caps.push(capNome);` (12 espaços, `reg2`, `capNome`) **muda de arquivo**: hoje em `ui_p52_support_v32.js:~327` (laço por sinal de `ofertaDoMotor()`; comentário `:317-323`, fusão `:324-327`), passa a viver na fusão por chave de `reconciliar()` em `ui_curation_v32.js`, **transportada verbatim**. **Conferido no harness** — são **quatro** toques, não dois: (i) o mapa `F` (`tests_022_mutants.js:45-49`) só tem `ondas`/`papel`/`apoio` — ganha `estado: P("ui_curation_v32.js")`; (ii) o mutante passa a `file: F.estado` (`:109`); (iii) `precisaBuild` (`:241`: `m.file === F.papel \|\| m.file === F.ondas \|\| m.file === F.apoio`) ganha `\|\| m.file === F.estado`, senão a campanha mutaria o fonte **sem reconstruir o HTML** e o mutante sairia SOBREVIVENTE pelo motivo errado (o comentário `:236-239` do próprio harness descreve esse falso negativo); (iv) `mutation_map.json → harnesses.d022`: `ui_curation_v32.js` já está em `targets`, mas está em **`insumos.populacao`** — passa a ser alvo **mutado**, e a semântica do gatilho (017, `check_mutation.py` "relação") decide se a entrada de `populacao` sai; o QA confere pelo `--preflight` e pelo stage `mutation` | ataque idêntico (guardar só a primeira capability: `repl` `if (capNome && !reg2.caps.length) reg2.caps.push(capNome);`); `reason` `/habilitado por sinal traz .* capability\|a fusão tem de trazer as duas/` (`:120`); `D022-PROD1` byte-igual (`tests_022_escalonamento.js:350+`) | campanha **d022** com `D022-M10` DETECTADO contra o HTML reconstruído; `--preflight` d022 com `ocorrencias == 1` para a âncora **no arquivo novo** e **0** no antigo |
| **`D019-SOL1`** (`tests_019_curadoria.js:372-407`), **`D019-SOL3 (b)`** (`:502-520`), **`D019-MED1`** (`:326-…`) | **comentário-trilha** (E13), uma frase cada: *"oráculo `computeFindings()+MAP` vale em modo legado/hipótese; com voz do motor o oráculo é `D026-REC1`"* — e em `D019-MED1`: *"`reconciliar()` é insensível ao estado do operador; `OFERTA_DO_MOTOR` continua a oferta de hipótese"* | **asserção byte-igual**; contagem 14; `D019-M5` continua morrendo (`decisaoDe` ignorado ⇒ `MED1`/`PROV1` caem); os pares (produto × capability) continuam idênticos em legado porque `data-p53-sol-produto` = linha e `[data-p53-sol-cap]` = `applyCopy(MAP.cap)` (texto canônico no registro, `applyCopy` na apresentação) | `node tests_019_curadoria.js` 14/14; `--preflight` d019 17/17 |
| Âncoras que **sobrevivem byte a byte** à W2 (`ui_curation_v32.js`) | — | `D019-M1` (`:157`), `D019-M2` (`:164`), `D025-M2` (`:255-256`), `D025-M3` (`:219`), `D025-M23` (`:227`), `D025-M5` (`:254`), `D025-M9` (`:257`): `valido`/`decidir`/`validar`/`daSessao` não mudam uma letra | preflight d019/d025 antes **e** depois da W2 (E14) |
| Âncoras que **sobrevivem byte a byte** à W3a (`ui_p52_support_v32.js`) | — | `D019-M4` (`:819-820` papel prov), `D019-M5` (`:733`), `D019-M7` (grupo-nome), `D019-M9` (`:604`/`declararSupressao`), `D019-M13`/`M14` (`:451`, `:559`), `D019-M15` (`var produtos = ofertaDoMotor();` `:721` — o **nome e o literal** ficam; a função vira leitor), `D019-M16` (`"data-p53-sol-tier": TIER[p.tier] \|\| TIER[2]` `:394`), `D019-M17`/`M18` (`arbitrando`/`fronteira`), `D023-M2` (= M18), `D023-M6` (`:801` papel suprimido) | preflight d019/d022/d023 antes e depois da W3a |

**Regra que governa o raio** (inventário do QA, desenho §6): legado, gate
fechado e `CONTEXT_NOT_INFORMED` **mantêm** a oferta do MAP (hipótese), e
nenhuma fixture de suíte existente reproduz C1/C2/C4/C6/C7 — por isso
`D019-CTX1 (a)` (G4: `security-analytics`/`soc-platform` NONE, `saasAllowed:"yes"`
— `security-analytics` DIRECT resolve `fortianalyzer`/`fortisiem`(+cloud) → cards
`FortiAnalyzer`/`FortiSIEM`; o resto é hipótese; MDR hipótese por D-6;
`offered() ⊆ cards` ✓), `D025-UNS1` (`data-p53-cur-item` = linha), `D023-REG1`
(F2 → placeholder `endpoint-family` → chave `FortiEndpoint`, `cards == published()`),
`D010-*` (F1/F1b/F4 landscape `{}` → `CONTEXT_NOT_INFORMED` → hipótese →
`published()` não vazio; F3 gate fechado → porta de saída) **não são
reancorados** (E3). Queda em oráculo declarado de outra demanda
(`D010_DECLARED.substituto`, `V10`/`D010-INV7`, `D019-MED1` payload M41,
`D015-TIT1`) ⇒ **parar e escalar**, nunca reancorar.

### Cobertura — critério → gate, cenário → gate

| Cenário (anexo) | Antes (HEAD, medido pela sonda) | Depois (FINAL) | Gate · alínea |
|---|---|---|---|
| C1 | card `FortiEndpoint` · prioritária; papel sem tier | card linha `FortiEndpoint`, `h4` FortiEDR, `item-id=fortiedr`, `acao=avaliar-aquisicao`, prioritária, linha de variante; sem veto arquitetural (E5); papel idem | REC1 (a), PAP1, LEG1 (g), REC1 (h) |
| C2 | card `FortiEndpoint` · prioritária | nenhum card; veto "tecnologia operacional — apoio em operacionalização (nunca substituição)" · "Tecnologia declarada: CrowdStrike Falcon (production)"; Camada 1 oculta | REC1 (b), LEG1 (e), PAP1 (vetos) |
| C3 | card `FortiSOAR` · prioritária | card `FortiSOAR` · prioritária · `condicao=capability-nao-informada` visível (D-3 default) | LEG1 (c) |
| C3b | — | sem card; veto com "M75" | LEG1 (c), LEG1 (e) |
| C4 | `FortiAnalyzer` + `FortiSIEM` · prioritárias | nenhum card; `data-p53-vetos="2"`; "Tecnologia declarada: Microsoft Sentinel (production)" | REC1 (b), LEG1 (e) |
| C5 | 9 cards (7/2); papel **0/9** com qualificador, sem "Escopo" | mesmos 9 cards e tiers, condição "sem contexto"; papel **9/9** com tier, condição, "Escopo: cobre a camada de endpoint…" no FortiEndpoint e o escopo do MAP no FortiRecon | PAP1 |
| C6 | card `FortiNDR` · prioritária | card linha `FortiNDR`, `h4` "FortiNDR (On-Premises)", `item-id=fortindr-onprem` | REC1 (c) |
| C7 | `FortiEndpoint` (validação) + `SOCaaS` (prio) + **`MDR` (prio)** | 1 card `FortiGuard SOCaaS` · `servico` · prioritária; vetos: `FortiGuard MDR` ("…OG oficial"), `FortiEndpoint` ("nunca substituição" · FortiEDR production/on-prem · extensão FortiXDR M50) | REC1 (d)(f)(h), LEG1 (e), PAP1 (vetos) |
| C7-UNSET | — | MDR hipótese (D-6), zero veto | LEG1 (b) |
| C8 | `FortiEndpoint` · prioritária | igual + condição "sem contexto" em tela e papel (023 E1) | LEG1 (a) |
| C9 | `FortiDLP` · validação · sinal | igual (`conversa-por-sinal`, `origem=sinal`, 2 capabilities) + qualificador e origem no papel | PAP1; `D022-PROD1` intacto |
| C10 | 3 cards prioritários | iguais, modo motor; `FortiSIEM` com `variantes="fortisiem, fortisiem-cloud"`, sem card Cloud | REC1 (e)(h) |
| F2-placeholder | card `FortiEndpoint` · tier por sev | card `FortiEndpoint` · `modalidade-a-definir` · após validação · "Modalidade a definir no aprofundamento: FortiEndpoint ou FortiEDR" | REC1 (i); `D023-REG1` intacto |
| GF (duas variantes) | cards de hipótese | cards de hipótese com condição, zero veto | LEG1 (d) |

## Comportamento especificado

Entrada → saída por superfície. **UNSET**, **NA** e **suficiência** explícitos.
Vocabulário fechado onde uma máquina resolve (enum), nunca prosa (lição
"campos de vocabulário fechado").

### Portas de saída — hipótese do mapa = comportamento de hoje (desenho §2.1)

| Condição | Efeito | Por quê |
|---|---|---|
| `entradaViva() === null` (`computeFindings`/`MAP`/`PRODUCTS`/`V32` ausentes ou lançando) | hipóteses do mapa; `condicao` = `sem-contexto`; `console.error` **nomeando** o que faltou | como `ui_p52_support_v32.js:338-344` hoje; nunca silêncio (R10 §2) |
| `legado === true` (`V32.isLegacyModeV32()`, `engine_v32.js:305-311`; `contexts:{}` `:552`) | **toda** linha do MAP é `hipotese` · `sem-contexto`, tier por `sev`; **zero** veto, zero serviço do motor, zero elegibilidade | 023 E1 (`design-decisions.md:15`, fecho de 2026-10-19); `serviceEligibility` leria UNSET como ausência (INV-2) |
| `suficiente === false` (`__P50SUFF.contract().sufficient`, `ui_p50_suff_v32.js:53`, `:218-220`) | toda linha é hipótese — `condicao` = `contexto-a-validar` quando `temVoz(ctx)` (o motor fala, mas a leitura não é publicável — INV-3), senão a da tabela abaixo (NONE sob gate fechado classifica `NEEDS_VALIDATION`, `engine_v32.js:402-404` ⇒ `contexto-a-validar`); **sem veto** | INV-3 pelo lado da apresentação (023 E4, `ui_v32.js:732-741`): o que não é publicável não desloca o que é; `D010-F3`/`D010-ARB1 (c)` preservados por construção |

**NA** (`"NA"` em resposta): `computeFindings()` a põe em `validate`, não em
`findings` (`v3_1_3.html:526`) ⇒ não há linha do MAP para ela ⇒ nada muda em
relação a hoje; a capability correspondente classifica `NEEDS_VALIDATION`
(`maturityStateOf` com `hasUnknowns`) ⇒ `!temVoz` ⇒ nada do motor vira veto
nessa capability. **UNSET** nunca é lido como ausência: a única leitura de
`presence` feita pela derivação é a do D-6 (`UNSET`/`UNKNOWN` ⇒ abstenção), e o
veto só nasce sobre `TECH_LANDSCAPE[capId].solutions` **declarado**.

### Veredito por linha do MAP × capability (desenho §2.2) — função pura de `contexts[capId]`

Para cada achado `f` de `computeFindings()` (`v3_1_3.html:522-533`): `capId` =
a capability cujo `questionIds` contém `f.id` (1:1 por `validateConfigV32`,
`engine_v32.js:697`); `ctx = contexts[capId]`; `H` = linhas de
`MAP[f.id].lv[f.lvl].c` com `PRODUCTS[c.p]` (com `w` e `sn`); `ids =
idsDaLinha(chave)`; `relacionados = ids ∩ {id : capabilityRelations ∋ capId}`.

| Situação do `ctx` | Linha de **produto** | Linha de **serviço** |
|---|---|---|
| ausente (defensivo) | `hipotese` · `capability-nao-informada` | idem |
| `CONTEXT_NOT_INFORMED` / `LEGACY-LABELLED` (`:601-602`) | `hipotese` · `capability-nao-informada`; com `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA === true` **e** `supressao.caps ∋ capId` → `hipotese` · `plataforma-declarada-cobre` · tier 2 (**nunca** veto — §2.6 do desenho) | `veredictoDeServico` |
| `!temVoz(ctx)` com classificação ≠ `CONTEXT_NOT_INFORMED` (`NEEDS_VALIDATION` sem serviço; `DIRECT` sem payload — defensivo) | `hipotese` · `contexto-a-validar` | `veredictoDeServico` |
| `TECHNOLOGY_WHITESPACE` · `DIRECT` (`:570-572`) | candidato `offering` da linha (`relacionados ∩ candidates`, ou `variants[]` de placeholder cobrindo a linha) → **motor** `avaliar-aquisicao`; placeholder `family`/`family-of-variants` → **motor** `modalidade-a-definir` (tier 2); `contextual-support` da linha → **motor** `apoio-contextual` (tier 2); `relacionados` não vazio mas nenhum candidato: algum `arquitetura[id] === "violated"` → **veto `arquitetura`** (só se a linha não ganhou card em capability alguma — E5), senão **veto `motor-sem-candidato`**; `relacionados` vazio → `hipotese` · `fora-do-catalogo-contextual` (ex.: `FortiXDR` em `automation` lv1, `v3_1_3.html:447`) | `veredictoDeServico` |
| `TECHNOLOGY_WHITESPACE` · `CONTEXTUAL` por plataforma (`:573-576`) | **veto `plataforma`** para toda linha (motivo literal `:576` + `supressao.plataforma`) | idem |
| `TECHNOLOGY_WHITESPACE` · `CONTEXTUAL` só `contextual-support` (`:644-650`) | linha com `contextual-support` → **motor** `apoio-contextual`; demais → veto `motor-sem-candidato` | idem |
| `OPERATIONAL_GAP` / `COVERAGE_GAP` / `ADOPTION_GAP` · `CONTEXTUAL` (`:579-590`) | linha com `contextual-support` → `apoio-contextual`; **toda outra** linha → **veto `operacional`/`expansao`/`enablement`** com `ctx.notes` literal (incl. M75 `:584`), `existente` = `TECH_LANDSCAPE[capId].solutions`, `extensoes` (`fortixdr` `:585-588`), `servicos` do motor nesta capability | idem |
| `EVALUATION_IN_PROGRESS` (`:591-594`) | veto `avaliacao` (nota `:593`) | idem |
| `TECH_STATUS_UNVERIFIED` · `NEEDS_VALIDATION` com serviço · `POSSIBLE_CONTEXT_DIVERGENCE` (`VALIDATE` com payload) | veto `validar` (nota literal; `NEEDS_VALIDATION` sem nota: "presença declarada como desconhecida — validar antes de qualquer leitura de gap") | idem |
| `UNASSESSED_CAPABILITY` · `CONTEXTUAL` por sinal (`:603-615`; sem pergunta, sem `H`) | **motor** `conversa-por-sinal`, `origem:"sinal"`, tier 2, `chave = chaveDe(itemId)` (pode ser `null`) — o segundo laço de hoje (`ui_p52_support_v32.js:291-337`), transportado com a linha-âncora do `D022-M10` | — |
| `UNASSESSED_CAPABILITY` licenciada (M62) / `INVENTORY` / `MATURE_*` / `TECH_TRANSITION` / `null` | nada (não há achado) | serviço por sinal em capability madura (`dfir`) só entraria se a linha existisse no MAP da pergunta — não existe → nada (status quo) |

**Regra única de aquisição** (`anexos/contrato-motor.md` §1): só
`supportMode:"DIRECT"` com `itemKind ∈ {offering, family, family-of-variants}`
vira `avaliar-aquisicao`/`modalidade-a-definir`. **Veto só onde o motor tem
voz**: `temVoz(ctx)` = `ctx.classification !== "CONTEXT_NOT_INFORMED" &&
(candidates+services+notes) > 0` — a cláusula de `hasSubstituteV32`
(`ui_v32.js:750-752`), com comentário-trilha cruzado nos dois módulos.
Consequência estrutural: um veto de produto nunca devolve a leitura congelada,
mesmo quando `published()` esvazia (C2/C4: `porCapability` é verdadeiro pela
nota). O veto de serviço tem voz própria (elegibilidade lê landscape
**declarado**) e `LEG1 (e)` mede `d010HasSubstitute === true` em toda fixture
com veto — propriedade **medida**, não suposta.

### Linhas de serviço — `veredictoDeServico(chave, capId, ctx, entrada)` (desenho §2.4; fora do legado e do gate fechado)

```
sids = idsDaLinha(chave) ∩ SERVICES com relação a capId
se algum sid ∈ ctx.services[]           → MOTOR "servico": origem = triggeredBy ∋ "capability-gap" ? "gap" : "sinal";
                                           elegibilidade = { estado: /^elegível — validar/.test(note) ? "validar" : "elegivel", motivo: note };
                                           entregavel = SERVICES[sid].name
senão, para cada sid: el = elegibilidade[sid]
   !el.eligible && /^base requerida ausente/.test(el.reason)
        && landscape["endpoint-detection"] ∈ {"UNSET","UNKNOWN"}    → HIPÓTESE · capability-nao-informada   (D-6 / INV-2)
   !el.eligible (demais razões; inclui base DECLARADA ausente — presence NONE — e
        "base declarada apenas em deployments não elegíveis (on-prem/air-gapped) — OG oficial")  → VETO "elegibilidade", motivo = el.reason
   el.eligible e não disparado          → ctx CONTEXT_NOT_INFORMED ? HIPÓTESE · capability-nao-informada : VETO "motor-sem-candidato"
```

Vale **em todo modo não-legado, inclusive `CONTEXT_NOT_INFORMED`** (o engine
anexa `services[]` mesmo em `LEGACY-LABELLED`, `engine_v32.js:653-665`; C7
`soc-staffing` prova). **Serviço do motor sem linha do MAP na pergunta** (ex.:
`fortiguard-mdr` por `endpoint-detection` primary quando o MAP `endpoint` lista
só FortiEndpoint) **não vira card** (D-5, fronteira E2/022): entra em
`servicos[]` do veto/nota, informativo; `#v32support`/`#pr-support` já o listam
(`ui_v32.js:637`, `:673`).

### Qualificador (`tier`) e título (desenho §2.3)

| Caso | `tier` | `titulo` |
|---|---|---|
| hipótese (qualquer `condicao`) | `sev 2 → 1`, senão `2` — como hoje e como `buildTiers` (`v3_1_3.html:545`) | nome da linha |
| motor `avaliar-aquisicao` (offering) | `maturity.state === "gap-high" → 1`, `gap-moderate → 2` | nome do item quando a chave fundiu **um só** `itemId ∈ OFFERINGS` com `name ≠ linha` (C1 "FortiEDR", C6 "FortiNDR (On-Premises)"); senão nome da linha (C10 "FortiSIEM" + `variante.nomes`) |
| motor `modalidade-a-definir` (placeholder `family`) | **2 sempre** (E9) | nome da linha; `variante = { modalidade:"a definir", nomes: variants.map(name), resolucao: variantResolution }` |
| motor `apoio-contextual` / `conversa-por-sinal` | 2 | nome da linha (ou `OFFERINGS[itemId].name` se `chave:null`) |
| motor `servico` por gap | `gap-high → 1`; `note === "elegível — validar deployment da base"` → 2 + `elegibilidade.estado:"validar"` | nome da linha; `entregaveis` nomeados |
| motor `servico` por sinal | 2 | idem |
| fusão | mínimo entre as fontes que produzem card (motor + hipóteses não vetadas) | — |

`prioritaria` só nasce de modo motor com `avaliar-aquisicao`/`servico` e
`gap-high`, ou de hipótese com `sev 2` — e neste caso o card carrega a
`condicao` visível.

### Fusão por chave e precedência (desenho §2.5 — E4)

Registros chaveados por `chave || itemId` — **nunca por nome exibido** (raiz de
C6 e do colapso em `ui_p52_support_v32.js:317-327`). Por chave acumulam-se
`fontesMotor[]`, `hipoteses[]`, `vetos[]`:

1. `fontesMotor.length > 0` → **card modo motor**: `capabilities` = das fontes
   do motor ∪ das hipóteses **não vetadas** da mesma chave; `itemIds`, `sinais`,
   `escopo`, `entregaveis` unidos; `acao` = a mais forte (`avaliar-aquisicao` >
   `modalidade-a-definir` > `servico` > `apoio-contextual` > `conversa-por-sinal`
   > `hipotese`); vetos da mesma chave em **outras** capabilities ficam em
   `vetosDaLinha` e são renderizados no bloco de vetos.
2. sem fonte do motor e `vetos.length > 0` → **sem card**; hipóteses da mesma
   chave **caem** (veto > hipótese). Retira "FortiGuard MDR · indicação
   prioritária" de C7 e o FortiEndpoint de `vulnerability-management` quando
   `endpoint-detection` diz "nunca substituição".
3. sem fonte do motor e sem veto → **card hipótese** com `condicao` = a mais
   forte presente (`sem-contexto` > `capability-nao-informada` >
   `contexto-a-validar` > `fora-do-catalogo-contextual` > `plataforma-declarada-cobre`).

Ordem de emissão: primeira aparição (ordem dos achados, depois
`Object.keys(contexts)`), como hoje.

### C3 — a constante e por que nasce desligada (desenho §2.6, D-3)

`CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false` em `ui_curation_v32.js` (chave de
reversão; `LEG1 (c)` a pina). Medido: em C3 `offered() = ["FortiSOAR"]`;
qualquer regra que **retire** o FortiSOAR esvazia `published()`;
`temProdutoPublicadoV32` devolve falso (`ui_v32.js:742-743`); `porCapability`
devolve falso porque `presentationOf` nunca promove `CONTEXT_NOT_INFORMED` a
`card` (`:693-696`) e `hasSubstituteV32` exige `classification !==
"CONTEXT_NOT_INFORMED"` (`:751`) ⇒ `hideLegacyRecommendation(app, false)` ⇒ a
Camada 1 **volta** com o FortiSOAR na lista congelada, ao lado do veto. Por isso:
(a) default `false` — C3 é hipótese · `capability-nao-informada`, e a lacuna do
engine vai ao backlog; (b) com `true` a regra **nunca veta** — card publicado e
curável com `condicao:"plataforma-declarada-cobre"` e tier 2 (texto em
`CONDICAO_TXT`, conferido contra `P52_COPY`); (c) **C3b** é o
caso "plataforma cobre" (`OPERATIONAL_GAP` + M75 ⇒ veto pela regra geral).

### Tela — `ui_p52_support_v32.js` (desenho §2.7, §3, §4)

| Elemento | Entrada (registro) | Saída (DOM) |
|---|---|---|
| card | registro com `chave !== null` (publicável e curável) ou `chave === null` (publicável, incurável — status quo `ui_curation_v32.js:142`, `ui_p52_support_v32.js:139`) | `div.apoio-block.p53-sol-card` filho **direto** de `#p52-sec-support` (restrição `P52-REC1g`/censo 010); `data-p53-sol-produto` = **`nome` (linha)**; `data-p53-sol-grupo`; `data-p53-sol-tier` = `TIER[tier]` (`:240`, inalterado); `data-qs22-sinais`; **novos**: `data-p53-sol-chave` (`chave` ou `""`), `data-p53-sol-item-id` (`itemId` ou ausente), `data-p53-sol-variantes` (`itemIds.join(", ")` quando > 1), `data-p53-sol-acao`, `data-p53-sol-origem`, `data-p53-sol-condicao` (**presente sse `condicao !== null`**) |
| título | `titulo` | `h4` = `titulo` (D-7); `.pt-name` continua removido (`D019-CARD1 (a)`); a linha "— linha de produto: <nome>" nunca é folha com texto igual ao nome |
| corpo | `.prod` movido quando existe (`prodLegadoDe`); senão `corpoDoMotor(p)` (ícone `productIcon(chave)`, `PRODUCTS[chave].d`, link) ou `corpoDoCatalogo(id, nome, escopo)` com `.scope.p53-sol-escopo` | ícone sempre (`D019-CARD1 (b)`) |
| linhas novas | `variante`, `acao`, `condicao`, `elegibilidade`, `escopo` | `.p53-sol-variante` ("Variante resolvida pelo contexto declarado — linha de produto: <nome>" / "Modalidade a definir no aprofundamento: A ou B" / "Disponível também como <nome>"), `.p53-sol-acao` (`ACAO_TXT[acao]`), `.p53-sol-condicao` (`CONDICAO_TXT[condicao]`; legado: "contexto tecnológico não informado nesta sessão" — D-6), `.p53-sol-elig` (`motivo` literal), `.scope.p53-sol-escopo` ("Escopo: …") |
| capabilities | `capabilities[].texto` canônico | `li.p53-sol-cap[data-p53-sol-cap]` = `__P52.applyCopy(texto)` (contrato do `D019-SOL1`) |
| sinais | `sinais[]` ids | `data-qs22-sinais` = `sigPT(id)` unidos (`D022-PROD1`) |
| acréscimo humano | `acrescimos()` (`:570-583`) inalterado | + `data-p53-sol-origem="operador"`, `data-p53-sol-acao="hipotese"`; sem tier, sem capability; `[data-p53-prov]` (D-8) |
| supressão | `suprimidos = produtos.length - cards.length` (`:734`) | conta **só exclusões do operador** (`produtos` já não contém vetados); veto **nunca** usa `[data-p53-suprimido]` |
| **bloco de vetos** | `vetos()` agrupados por linha | `div.p53-sol-vetos[data-p53-vetos=N][role=note]`, título "Não indicado nesta leitura", `ul > li[data-p53-veto-item=<linha>][data-p53-veto-classe=<classe>]`: nome da linha · motivo(s) literais · capabilities · "Tecnologia declarada: <product> (<status>[, <deployment>])" · `span[data-p53-sol-extensao="fortixdr"]` quando houver · "Serviço elegível nesta capability: …" quando houver. **Invariantes de DOM (E17)**: entra **depois** dos cards e antes do botão do editor; classe fora de `CLASSES_CONTIGUAS` (`tests_010_vao.js:168`); nunca `.apoio-block` (fora de `data-p52-support-cards`, `:768-769`); só existe com voz do motor (região congelada oculta); idempotente no ramo `else` de `decorar()` (`:744-762`: reemitido por remoção + inserção) |
| portas de saída | `entradaViva() === null` | `console.error` nomeando; seção segue com a hipótese do mapa |

Literais novos (`ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT`) moram em
`ui_p52_support_v32.js`, nunca no dono do estado; são conferidos contra
`P52_COPY` (`ui_p52_workspace_v32.js:128-236`) e contra `grep` em `tests_*.js`
**antes** de nascer (lição "copy de apresentação cega gate"). Os gates desta
spec **não pinam** esses literais — pinam atributos, `ctx.notes`/`reason`
literais do engine, os textos de tier já existentes ("indicação prioritária",
"após validação") e "Tecnologia declarada".

### Editor — `ui_curation_edit_v32.js` (D-9, opcional)

| Entrada | Saída |
|---|---|
| `offered()` (chaves) + `oferta()` (registros) | `linhaProduto` (`:78-105`): `data-p53-cur-item` e `.p53-cur-item-nome` continuam a **linha** (`D025-UNS1` intacto); `span.p53-cur-item-var` "apresentado como <titulo>" quando `titulo !== nome` |
| `gateFechado()` (`:62-65`) | inalterado (`D019-M10`) |
| handler (`:86-93`) | inalterado (tabela fechada da 025) |

Linhas vetadas **não** aparecem no editor (não estão em `offered()`); aparecem
em "Acrescentar por decisão sua" (`:200-208`) como qualquer item do catálogo não
ofertado — `include` explícito sobre linha vetada vira "escolha do engenheiro"
com selo, com a razão do veto ainda visível no bloco (as duas leituras
coexistem). Residual declarado (desenho §8).

### Papel — `papelHTML()` (`ui_p52_support_v32.js:794-834`; desenho §4)

Princípio intacto: o papel **lê os cards da tela** e copia (`D019-PAR1`).

| No card da tela | No `pr-card` | Hoje |
|---|---|---|
| `data-p53-sol-produto` · `-grupo` · `data-qs22-sinais` | idem (`:813-814`) | ok |
| `data-p53-sol-tier` + `.p53-sol-tierlabel` | **`data-p53-sol-tier`** + `<div class="pr-mut p53-pr-tier">indicação prioritária / após validação</div>` | **omitido** (QS-02) |
| `data-p53-sol-chave` · `-item-id` · `-variantes` · `-acao` · `-origem` · `-condicao` | mesmos atributos | — |
| `txt(h4)` (título) | `<b>` = título (`:816` passa a ler o `h4`) | `<b>` = nome |
| `.p53-sol-variante` · `-acao` · `-condicao` · `-elig` | `.pr-mut.p53-pr-variante` · `-acao` · `-condicao` · `-elig` (texto copiado) | — |
| `.prod .scope` (movido, `v3_1_3.html:874`) **ou** `.scope.p53-sol-escopo` | `.pr-mut.p53-pr-escopo` "Escopo: …" | **omitido** |
| `[data-p53-prov]` · `.pt-desc` · `li[data-p53-sol-cap]` · "habilitado por sinal declarado" | inalterados (`:815`, `:819-831`; `D019-M4` `:820`) | ok |
| `:scope > [data-p53-vetos]` | `<div class="pr-mut p53-pr-vetos" data-p53-vetos="N"><ul><li data-p53-veto-item="…" data-p53-veto-classe="…">…</li></ul></div>` — **não** é `.pr-card`, não carrega `data-p53-sol-produto` (contagens de `D023-PAP1`/`D010-PAPEL1` intactas) | — |
| guarda de seção vazia (`:799`) | `if (!cards.length && !aviso && !vetos) return "";` | — |

`[data-p53-suprimido]` no papel (`:801-802`, `D023-M6`) byte-igual. Ordem pinada
(`tests_010_vao.js:328-338`, `tests_p50_core.js:4278-4294`): `#pr-sup-solucao`,
`h2` "Formas de apoio, por produto", opcional — não muda. Modo legado no papel:
a seção p53 entra fora do condicional E–H (`ui_v32.js:1566`) — continua a única
leitura de apoio do PDF sem contexto, agora com a condição visível (D-6).

## Contratos

### Owner e consumidores (desenho §1.1)

- **Dono de estado**: continua só `__CURATION` (`ui_curation_v32.js`,
  `core-engineer`): `decisions: { chave → include|exclude }`,
  `architectureNote`. O registro de decisão é **derivado** — recomputado a
  cada chamada, sem cache, **nunca serializado** (INV-8), nunca lido de volta do
  DOM (R9 §3).
- **Quem decide quem entra**: `reconciliar()`, uma vez. **Quem decide o que
  publica**: `decidir()`/`publicados()` (`ui_curation_v32.js:162-179`,
  byte-iguais). **Quem desenha**: `__P53SOL` / `__P53CUR`.
- `ui_v32.js` (`temProdutoPublicadoV32` `:729-745`, `hasSubstituteV32`
  `:746-758`, `buildPrintReport` `:1566`) **não muda**: `published()` continua a
  definição que ele lê.

### Shape do registro (um por chave publicável; vocabulário fechado) — desenho §1.2

```js
{
  chave:     "FortiEndpoint" | null,      // linha curável = chave de PRODUCTS; null = sem par (publicável, incurável)
  nome:      "FortiEndpoint",             // nome da LINHA (PRODUCTS[chave].n); vai em data-p53-sol-produto; chave null → OFFERINGS[itemId].name
  titulo:    "FortiEDR",                  // h4/<b>: item resolvido SÓ quando acao === "avaliar-aquisicao" e a chave fundiu UM só itemId ∈ OFFERINGS com entityType !== "family" e name ≠ linha; senão == nome
  tipo:      "produto" | "familia" | "servico",
  modo:      "motor" | "hipotese",
  itemId:    "fortiedr" | null,
  itemIds:   ["fortiedr"],                // todos os ids do motor fundidos (C10: ["fortisiem","fortisiem-cloud"])
  variante:  { nomes:[…], modalidade:null|"a definir", resolucao:"atende"|"oferta a definir no aprofundamento"|… } | null,
  acao:      "avaliar-aquisicao" | "modalidade-a-definir" | "apoio-contextual" | "conversa-por-sinal" | "servico" | "hipotese",
  tier:      1 | 2,
  origem:    "gap" | "sinal" | "gap+sinal",
  condicao:  null | "sem-contexto" | "capability-nao-informada" | "contexto-a-validar" | "fora-do-catalogo-contextual" | "plataforma-declarada-cobre",
  capabilities: [{ capId, qid|null, texto }],   // texto CANÔNICO (MAP[qid].cap ou CAPABILITIES[capId].name)
  caps:      ["Detecção e resposta em endpoint (EDR)"],   // derivado de capabilities[].texto, deduplicado — portador da linha-âncora do D022-M10 (ver nota)
  sinais:    ["dataLeakageConcern"],
  escopo:    ["camada endpoint"],         // scopeNote do motor ∪ MAP.lv[].c[].sn, deduplicado por texto
  elegibilidade: { estado:"elegivel"|"validar", motivo } | null,
  entregaveis: ["Incident Response Training"],
  fontes:    [{ via:"gap"|"sinal"|"servico-gap"|"servico-sinal", capId, qid|null, sev|null, lvl|null, itemId|null, serviceId|null }],
  notas:     ["…literais de ctx.notes…"],
  vetosDaLinha: []                        // vetos da MESMA chave em outras capabilities
}
```

**Veto** (lista paralela; um por linha × capability; renderizado agrupado por linha):

```js
{ chave:"FortiEndpoint", nome:"FortiEndpoint", itemId:"fortiendpoint"|null, capId:"endpoint-detection", cap:"Detecção e resposta em endpoint (EDR)",
  classe: "arquitetura" | "operacional" | "expansao" | "enablement" | "avaliacao" | "validar" | "plataforma" | "elegibilidade" | "motor-sem-candidato",
  motivo: "tecnologia operacional — apoio em operacionalização (nunca substituição)",      // literal do engine
  existente: [{ product:"CrowdStrike Falcon", status:"production", deployment:"saas" }],   // TECH_LANDSCAPE[capId].solutions
  extensoes: [{ itemId:"fortixdr", nome:"FortiXDR", scopeNote:"extensão de correlação … (M50)" }],
  servicos:  [{ serviceId:"fortiguard-mdr", nome:"FortiGuard MDR", note:"base compatível" }] }
```

**Regra de ouro**: todo valor vem de dado que já existe (enum do engine,
literal de `ctx.notes`, `serviceEligibility().reason`,
`OFFERINGS[].name/deployment/url`, `MAP.w/sn`, `PRODUCTS.n/d/u`). Os únicos
literais novos são rótulos de apresentação (`ACAO_TXT`, `CONDICAO_TXT`,
`VETO_TXT`) em `ui_p52_support_v32.js`. Nenhum campo colide com
`RESERVED_DERIVED` (`ui_session_v32.js:34-37`) nem com os 13 banidos de
`S4-S5` — e nada disto viaja na sessão.

**O que a conferência mudou no shape** (uma coisa): o campo **`caps`**
(`string[]` canônico, deduplicado, derivado de `capabilities[].texto`) **existe
porque a linha-âncora do `D022-M10` é transportada verbatim** —
`reg2.caps.indexOf(capNome)` precisa de `reg2.caps` e de `capNome` no laço por
sinal da fusão. Sem `caps`, a reancoragem exigiria texto novo e o QA teria de
reescrever a âncora (reancoragem de mutante, não transporte). `capabilities[]`
continua a forma estruturada; a apresentação lê `capabilities[]` e aplica
`applyCopy`.

### Funções (todas em `ui_curation_v32.js`) — desenho §1.3

| Função | Natureza | O quê |
|---|---|---|
| `entradaViva()` | coletor, só leitura, sob `typeof` | `{ legado, suficiente, findings, mapa, produtos, contextos, catalogo:{ofertas, servicos, familiasServico, capabilities}, landscape:{capId→presence}, supressao:{caps:[…], plataforma}, arquitetura:{id→archSatisfied}, elegibilidade:{sid→{eligible,reason}} }`; `null` quando `computeFindings`/`MAP`/`PRODUCTS`/`V32` faltam — quem chama **nomeia** no console |
| `reconciliar(entrada)` | **pura** (dado → dado), sem DOM, sem estado | `{ registros[], vetos[] }` pelas regras acima |
| `chaveDe(itemId)` / `idsDaLinha(chave)` / `tipoDaLinha(chave)` | pareamento por critério (§Pareamento) | total sobre `OFFERINGS ∪ SERVICES` |
| `temVoz(ctx)` | helper único (R9 §8) | espelha `ui_v32.js:750-752`; comentário-trilha nos dois lados |
| `veredictoDeServico(chave, capId, ctx, entrada)` | pura | tabela acima |
| `ofertados()` | leitor | `reconciliar(entradaViva()).registros.filter(publicavel && chave !== null).map(chave)` deduplicado — assinatura `offered()` inalterada (devolve chaves) |
| `decidir`/`publicados`/`escolhaDoOperador`/`inclusoesSemLastro`/`paraSessao`/`validar`/`daSessao`/`valido`/`unset` | **byte-iguais** | âncoras `D019-M1` (`:157`), `D019-M2` (`:164`), `D025-M2/M3/M5/M9/M23` |

Custo: `reconciliar()` roda a cada `offered()`/`decide()`/`published()`/
`contract()`/`oferta()` — mesma classe de custo de hoje (`ofertados()` `:124` e
`ofertaDoMotor()` `:293` já recomputam `buildRecommendationContext()` por
passagem). Memoização: fora desta demanda.

### Pareamento `itemId → chave` por critério (desenho §1.4; R12/EA-47) — conferido no catálogo

```
1. nome exato:   OFFERINGS[id].name === PRODUCTS[k].n  ou  SERVICES[id].name === PRODUCTS[k].n
                 (fortianalyzer, fortisiem, fortisoar, fortiendpoint, fortixdr, fortirecon, fortideceptor, fortidlp,
                  fortiai-assist, ndr-family → "FortiNDR" (engine_v32.js:89 = v3_1_3.html:267), fortiguard-socaas, fortiguard-mdr)
2. cadeia variantOf até (1):   fortisiem-cloud → fortisiem → "FortiSIEM"; fortindr-cloud / fortindr-onprem → ndr-family → "FortiNDR"
3. representante ÚNICO da família: fam = OFFERINGS[id].family, ou o próprio id quando entityType === "family"
   (o nó de família tem family:null por default — engine_v32.js:80, :87, :89). Entre as ofertas com family === fam,
   variantOf === null e entityType !== "family", as pareáveis por (1) devem ser EXATAMENTE UMA → essa é a chave.
     endpoint-family: {fortiendpoint, fortiedr, forticlient} → só fortiendpoint pareia → "FortiEndpoint"
     soc-platform-family: {fortisoc, fortianalyzer, fortisiem, fortisoar} → TRÊS pareiam → NÃO há representante → fortisoc → null
     identity-family / fortimail-family: nenhuma pareia → null
4. serviço membro de SERVICE_FAMILIES[f] → LINHA_DA_FAMILIA_DE_SERVICO[f] — única constante declarada:
   { "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" }
5. senão null (incurável, status quo): fortisoc, fortimail, fortimail-wss, fortimail-cloud-saas, fortisandbox, fortiaigate,
   fortisat, fortiauthenticator, fortipam, fortigate, e os nós fortimail-family / soc-platform-family / identity-family
```

Propriedades que `REC1 (g)` afirma: `chaveDe` total; **toda** chave de
`PRODUCTS` (13) com ≥ 1 pré-imagem; `tipoDaLinha(chave) === "servico"` quando
`idsDaLinha(chave) ∩ SERVICES ≠ ∅` (SOCaaS, FortiGuard-MDR-Service,
FortiGuard-Service-Bundle).

### Bridge `__CURATION` — acréscimos (owner `ui_curation_v32.js`, `core-engineer`)

```
oferta()            → registro[]            derivado, recomputado a cada chamada, nunca serializado
vetos()             → veto[]                idem
reconcile(entrada)  → { registros[], vetos[] }   PURA — a mesma função que oferta()/vetos() usam, exposta para gates com fixture literal
contract()          → { published, offered, architectureNote, operatorChoices, suppressed, oferta, vetos }   (+2 campos; os 5 de hoje byte-iguais)
offered()           → chave[]               assinatura inalterada (registros publicáveis com chave !== null)
```

Nenhum setter novo; a única porta de escrita continua `set`/`unset`/`clear`/
`fromSession`. Contrato de instrumentabilidade (herdado da 025): objeto literal
gravável, chamadas por propriedade no momento da chamada.

Consumidores: `__P53SOL` (`ofertaDoMotor()` vira leitor de `oferta()`; cards ←
registros; vetos ← `vetos()`; `papelHTML()` ← cards da tela) e `__P53CUR`
(`offered()`/`catalog()`/`decide()` inalterados; opcional `oferta()` para o
subtítulo da variante).

**Nota de `bridges.json`** (texto proposto; `build-engineer`, W5):
`__CURATION`: *"[026] oferta()/vetos()/reconcile(entrada): a oferta por produto
nasce UMA vez aqui (registro de decisao de apoio + vetos com razao literal do
motor), reconciliando computeFindings()+MAP com buildRecommendationContext();
reconcile e PURO (dado → dado), o registro e DERIVADO e nunca serializado
(INV-8); __P53SOL e __P53CUR consomem, nunca escrevem (R9 §5). Veto so onde o
motor tem voz (temVoz espelha hasSubstituteV32, ui_v32.js:750-752)."* Nenhum
bridge novo; `owner` intactos.

### O que NÃO muda (explícito)

`engine_v32.js` · `quickscan_secops_soccmm_v3_1_3.html` (Camada 1: `MAP`,
`PRODUCTS`, `computeFindings`, `buildTiers`) · `ui_v32.js` · `ui_session_v32.js`
· `SESSION_SCHEMA_V32.md` · `synthetic_session_examples/*` · `tests_019_mutants.js`
· `tests_025_*` · `build_v32_html.py` (os dois módulos já são injetados;
`CURJS` `:22`) · `decisions` (`{ chave → enum }`), `validate`/`fromSession`/
`toSession`/snapshot/commit/rollback (`ui_curation_v32.js:199-263`;
`ui_session_v32.js:69-77, :239-244, :548, :619-637`) · `TIER` (`:240`) · os
textos "indicação prioritária"/"após validação"/`PROV_TXT`/"Formas de apoio, por
produto"/"habilitado por sinal declarado:"/os dois textos de `declararSupressao`
· `gateFechado()` e o handler do editor.

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** **INV-1**: zero toque no engine;
  `V32.*` só lido; `TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT` nunca escritos pela
  derivação (`D022-BND1`/`D023-BND1`, stages `baseline`/`build`/`m41`,
  `LEG1 (f)`). **INV-2** reforçada: `UNSET`/`UNKNOWN` nunca viram ausência —
  hipótese condicionada (D-6, `LEG1 (b)`); veto só sobre landscape declarado.
  **INV-3**: gate fechado ⇒ porta de saída pelo bridge `__P50SUFF`, nenhum veto
  (`LEG1 (d)`, `D010-F3`, `D019-SUF1`); a apresentação **compõe** decisões do
  engine e do operador, não decide. **INV-4/5/6**: nada de score/target/
  refinamento é lido ou escrito (`D022-INV1`). **INV-7**: `reconciliar()` é
  função pura de (respostas, MAP, contexto, catálogo); textos = literais do
  engine + rótulos fixos; `fontes[]` nomeia a origem (`LEG1 (f)`). **INV-8**:
  `decisions` continua `{ chave → enum }`; `oferta()`/`vetos()` nunca entram em
  `toSession()` (`:199-204` intacto); nenhum `data-*` é lido de volta como
  decisão (`S4-S5`, `D019-INV8`, `D025-INV8`, `LEG1 (f)`). **INV-9**: só
  classes `produto`/`generated` (abaixo). **INV-10**: enums em PT-BR sem acento
  (`avaliar-aquisicao`, `hipotese`), como `prioritaria`/`validacao` já são; ids
  do engine literais.
- [x] **`design-decisions.md` — nenhum conflito.** `:15` (lista secundária ×
  visão por solução; fecho da 023: `published()` como substituto sob gate
  aberto; convivência só sob gate fechado) — a 026 **preserva** `published()`
  como a definição lida por `temProdutoPublicadoV32` e a porta de saída de
  suficiência; `:17` (card de prioridade sem apoio Fortinet) — `businessPriority`
  não é lido pela derivação; `:18` (supressão total pela curadoria não repõe a
  leitura congelada) — o veto do motor **não é** supressão (`[data-p53-vetos]`,
  nunca `[data-p53-suprimido]`), e em C2/C4 a Camada 1 continua oculta por
  `porCapability`, não por `published()` — nenhuma linha desta spec reporta
  essas três como defeito. §Candidatas (*cláusula defensiva inalcançável*): as
  três instâncias (A5, `tgtValidateHTML`, 4º parâmetro de `prCards`) não são
  tocadas; as cláusulas defensivas **novas** desta spec (`ctx` ausente; `DIRECT`
  sem payload; `motor-sem-candidato`) são declaradas aqui como defensivas, sem
  mutante, no mesmo molde (R13).
- [x] **Specs validadas anteriores — nenhuma contradição.** **010**
  (`specs/010-recomendacao-sem-vao/spec.md:461-462`, frase iniciada em `:460`:
  *"S3 e S4 intocados: sob contexto declarado a autoridade é o engine, e listar
  produto do catálogo congelado ali contradiria a leitura informada"*) — é a
  **âncora normativa** desta demanda: D-1 (sem card de aquisição em C2/C4) é
  essa frase aplicada à visão por produto; `:446-447` (precedência: capability
  com candidato do engine não recebe item do MAP) e `:452-457` (identidade pela
  tabela de equivalência; fusão contra o conjunto anexado, nunca contra o
  domínio) são o precedente da fusão por chave — e a cláusula "item do MAP cujo
  equivalente não está anexado **sobrevive**" é exatamente a hipótese
  condicionada (E9 da 010: `FortiGuard-MDR-Service` sobrevive quando o motor não
  o anexa — aqui, sobrevive como hipótese **ou cai por veto declarado**, nunca
  em silêncio). **019** (`spec.md:215-218`: ampliar `PRODUCTS` é Porta B — a
  026 não amplia; chave `null` permanece incurável). **022** (E2: produto por
  sinal entra em `offered()`; `FortiSIEM Cloud`/`FortiNDR Cloud` **não** viram
  card — preservada por E12/D-5 e `REC1 (e)`). **023** (E1 legado na
  arbitragem; E4 gate fechado não substitui — preservadas por construção).
  **024** (D4 supressão total — intocada). **025** (importação substitutiva;
  `validate` puro; toggle-back — byte-iguais; `D025-*` 16/16 sem reancoragem).
  **015** (partição de apoio) e **009** (ordem de leitura): nenhuma seção nova.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `current_phase.json → specs_normativas` aponta **uma**: `specs/PHASE_5_0_REV_B.md`,
  SHA-256 **medido sobre o arquivo com LF** =
  `4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b` — confere
  com o registro. O que toca o escopo: **`:1613-1619` §29.4** — `ui_v32.js`,
  `ui_ux_v32.js`, `ui_session_v32.js`, *todas as suítes congeladas*,
  `tests_visual/`, *schema de sessão* — **nenhum deles é tocado** por esta
  demanda (ver Boundary); `tests_visual/` é a razão da PARADA declarada no
  plano se `P8` mudar de paginação. **`:190-197`** (invariantes: *"derived state
  is NEVER canonical source of truth"*, *"UNSET != NONE"*, *"session import
  starts from canonical inputs and recomputes derived outputs"*) — são INV-8,
  INV-2 e a importação substitutiva, todas preservadas acima. **`:1153-1158`
  UI-045** (paridade semântica tela/print; *"novas semânticas em PDF/print
  dependem de microfase autorizada de Print/Render UX"*; *"não recebe
  autorização implícita para modificar o print pipeline"*) — a 026 **não toca o
  print pipeline** (`preparePrint`/`buildPrintReport` em `ui_v32.js` §29.4): o
  conteúdo novo entra pelo hook já existente `__P53SOL.printHTML()`
  (`ui_v32.js:1566`), o mesmo caminho pelo qual a 019 criou `pr-sup-solucao` e
  a 022 `pr-ondas` — precedente, não exceção. **`:1160-1162` UI-046** (*"Tela e
  PDF derivam do mesmo estado canônico"*) é o que `D026-PAP1` mede. **Leitura
  negativa**: `grep -i "apoio|curadoria|suporte|support|hipótese|CONTEXT_NOT_INFORMED|buildRecommendationContext"`
  na REV B devolve só ICON-01.1 (`:1029-1040`, ícones de produto — respeitado:
  `productIcon(chave)` da Camada 1, nenhum SVG novo) e P50-IC3 (`:1501`); **nada**
  sobre visão por produto, curadoria, veto ou papel do apoio. `specs/PHASE_5_0_REV_A.md`
  (histórica, `legacy`): não normativa, não lida como norma. Spec selada **não
  é editada** aqui.
- [x] **Boundary (R6) — as três fontes cruzadas**, nesta ordem:
  1. `.claude/verify/boundary.json`: `frozen` = `engine_v32.js`,
     `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`,
     `v3_1_3_functional_snapshot.json` — **zero linha**; `generated` =
     `quickscan_secops_soccmm_v3_2_dev.html`, `ui_icons_v32.js` — o HTML é
     reconstruído **só** pelo builder, o stage `build` prova identidade;
     `ui_icons` intocado; `legacy` e `registry` (pins via `gen_pins.py`)
     intocados. Nenhum dos quatro módulos nem das suítes tocadas aparece
     (grep = 0).
  2. `tests_p50_core.js`: **`PROTECTED`** (`:82-670`; `engine` `:83`, Camada 1
     `:84`, `ui_v32.js` `:391`, `ui_ux_v32.js` `:401`, `ui_target` `:510`,
     `ui_refinement` `:511`, `ui_journey` `:554`, `ui_session_v32.js` `:578`,
     `ui_icons` `:579`, `ui_v32.css` `:580`, `ui_ux_v32.css` `:623`,
     `generate_icons` `:627`, harness M41 `:628`, snapshot `:629`,
     `tests_unset_ug.js` `:664`, `MANIFEST` `:670`): **nenhum** de
     `ui_curation_v32.js`, `ui_p52_support_v32.js`, `ui_p52_support_v32.css`,
     `ui_curation_edit_v32.js`, `tests_019_curadoria.js`, `tests_022_mutants.js`
     está lá (grep = 0). **`frozenSuites`** (`:677-680`, 13 suítes, só
     existência): nenhuma das tocadas está lá. ⇒ **sem §29.4, sem rito D2**.
  3. `.claude/verify/pins.json` (stage `baseline`): todos os arquivos tocados
     são pinados — `ui_curation_v32.js` (`:613`), `ui_p52_support_v32.js`
     (`:625`), `ui_p52_support_v32.css` (`:624`), `ui_curation_edit_v32.js`
     (`:612`), HTML gerado (`:426`), `tests_019_curadoria.js` (`:573`),
     `tests_022_mutants.js` (`:578`), `expected_suites.json` (`:303`),
     `mutation_map.json` (`:358`), `mutation-matrix.json` (`:357`),
     `bridges.json` (`:283`), `CONTEXT.md` (`:370`) — ou novos
     (`tests_026_*.js`, `specs/026-…/*`: **sem pin hoje**, grep `specs/026` = 0)
     ⇒ `gen_pins.py` **no mesmo PR**, repin sempre em commit separado.

  **Classe mais alta tocada: `produto` (módulos 5.x da 019) + `generated` via
  builder. Zero `frozen`, zero §29.4, zero `legacy`.** Precedência onde a prosa
  da REV B divergir do executável: regime de pins (R8;
  `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2); divergência
  vira achado em `.claude/BACKLOG.md`, nunca edição de spec selada. **Ponto de
  PARADA declarado**: se qualquer wave precisar de `ui_v32.js`,
  `tests_visual/*`, `engine_v32.js` ou da Camada 1, a execução **para** e o
  orquestrador leva o rito ao proprietário.
- [x] **R9 — modularização.** §1 nenhum módulo novo; §2 nenhum bridge novo —
  três métodos acrescentados a `__CURATION` (registrado); §3 contrato só por
  bridge (`__P53SOL` lê `oferta()`/`vetos()`; `__P53CUR` lê `offered()`/
  `oferta()`; ninguém lê atributo DOM alheio como canal de decisão); §4
  **nenhum monkey-patch, nenhum patch-point novo** (`registerDecor` já
  registrado); §5 owner continua `ui_curation_v32.js` — **a derivação sai do
  módulo decorador** (`ofertaDoMotor()` vira leitor); §6 CSS só `p53-*` em
  `ui_p52_support_v32.css`, sem hex, cor nunca como único portador; §7
  orçamento: `ui_curation_v32.js` 316 → ≈ 495 (dentro); `ui_p52_support_v32.js`
  872 → ≈ 940 — **já acima do teto desde a 019/022**; justificativa no
  `plan.md`: a demanda **retira** derivação do módulo (−95 em `ofertaDoMotor`)
  e acrescenta apresentação; o split é rota futura; §8 `temVoz` é o helper
  único da semântica "o motor tem voz" (com `hasSubstituteV32` como espelho
  medido por `LEG1 (e)`); §9 `innerHTML =`: os três módulos têm **0** hoje
  (grep) e continuam em 0 — o papel é string devolvida ao hook, como já é.
  `check_lint_arch.py` alcança `ui_curation*` e `ui_p52_support` desde o
  EA-101 (`:30-45`).
- [x] **R10 — gates.** Cada gate nasce com positivo (C1/C6/C7/C10), negativo
  (C2/C4/C3b), adversarial (C7 precedência, C7-UNSET, C3 constante, GF nas duas
  variantes, exclude/unset/include) e regressão (d019 14, d022 14, d023 9,
  d025 16, 010, p50core); oráculos independentes (motor público, pareamento
  reimplementado, Camada 1 como oráculo de hipótese, DOM, papel após
  `beforeprint`); contagens em `expected_suites.json`, nunca na prosa;
  namespace `D026-*` em arquivo próprio; nenhum gate spawna suíte (a d025/m48
  não são invocadas por gate; o harness roda as suítes, como `D019-M11`);
  vacuidade nomeada por `vac()`; nenhum hash inline; teste não escreve na
  árvore (`D026_HTML_OVERRIDE`); saída de verificação **gravada em arquivo,
  nunca truncada** (`| tail` apaga o estágio que falhou — memória do projeto).
- [x] **R3 — TDD.** Gates nascem aqui, antes do plano; `qa-engineer` escreve e
  prova o red (commit); implementadores recebem o gate no prompt por id e
  caminho; tipagem no `tasks.md` (`feature` para suíte e módulos; `doc`/`chore`
  para trilhas, registros e repins, declarados); mutante por gate (M1–M6);
  dívidas declaradas: `LEG1 (d)`, `LEG1 (f)` (regressão sem carrasco próprio) e
  D-9 (sem gate), `apoio-contextual` e `tipo:"servico"` da linha
  `FortiGuard-Service-Bundle` (regras §2.2/§2.4 sem fixture — nenhum cenário as
  produz; dívida declarada, fixture em demanda própria).

## Fora de escopo

Herdado do desenho §11 e do plano do proprietário §2 (*"Não altere o engine
congelado apenas para facilitar o renderizador"*; microfase 02 é outra demanda):

- **Engine** (`engine_v32.js`, frozen): lacuna "`sup.caps` não consultada no
  ramo `CONTEXT_NOT_INFORMED`" (`:573`, `:584`, `:636` vs `:601-602`);
  `violated` descartado em silêncio (`:448`); serviço inelegível descartado em
  silêncio (`:659`). **Achado novo no backlog** (W6), Porta B futura.
- **`ui_v32.js`**: cláusula em `hasSubstituteV32` para contar veto-com-razão
  como substituto (só se D-3 for ligada por veto). Fora desta demanda.
- **Itens sem par na Camada 1** (`chave:null`): publicáveis e incuráveis, como
  hoje; `published() ≠ cards` latente nesse caso (já latente hoje). Rota: Porta
  B em `PRODUCTS` (`specs/019-curadoria-do-relatorio/spec.md:215-218`) ou
  alternativa (3) de `anexos/custo-identidade.md` **restrita** a esse grupo, em
  demanda própria; qualquer id novo em `decisions` fica sujeito a
  `RESERVED_DERIVED`.
- **Serviços do motor sem linha do MAP na pergunta** e `fortixdr` como card
  (D-5): demanda própria (cards novos ao cliente; `PORTFOLIO`; ícones).
- **`exclude` obsoleto sem sujeito** no arquivo de sessão
  (`ui_curation_v32.js:170-179 → :312`): achado de backlog, não desta demanda.
- **Blocos `[data-pr-gap-support]`** (`D021-*`, `P51-REC1`, derivados do MAP em
  `ui_v32.js`): fora do escopo declarado.
- **Memoização** de `reconciliar()` por passagem; **"condições" do acréscimo
  manual** no estado (D-8; contraria `D019-CUR1`/INV-8 — demanda própria se
  quiser); **mutante próprio para a constante C3** e para a porta de saída de
  suficiência (dívidas declaradas; novo mutante só por pedido — diretriz de
  2026-09-13).
- **Decisões metodológicas da microfase 02** (nome do resultado, equivalência
  SOC-CMM, confiança, bug decimal, crosswalk, licença/atribuição, neutralidade —
  QS-03..QS-08): outras demandas. **QS-09..QS-12** (instrumento): fora.
- **Deploy/release**: merge, selagem e deploy manual em `127.0.0.1:1337` são do
  proprietário (merge não é entrega).

## Erratas

> Escritas pelo `doc-writer`, 2026-10-31, na branch
> `feature/026-decisao-unica-do-apoio` (HEAD `fc5874f`). Cada erratum registra um
> desvio que a **execução** das waves W2/W3/W4 declarou e o orquestrador aceitou
> (`planning-state → implement.notes`); a spec foi escrita antes do código e não
> previu esses pontos. **Nenhuma errata afrouxa gate, alínea ou mutante; a E12
> acrescenta uma alínea (`D026-REC1 (j)`) e nenhuma contagem de gate muda** — o
> texto passa a descrever o que foi medido. Aceite: *decidido pelo orquestrador sob a instrução
> do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal
> pendente no PR*. Nenhuma linha aqui afirma aprovação do usuário.

| Campo | Registro |
|---|---|
| **Quem decidiu** | O orquestrador, sob a instrução do proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal pendente no PR |
| **Quando / onde** | 2026-10-31 · `planning-state → implement.notes` (W2 fechada, W3a, W3b, W4, W4b) |
| **Classes** | **aditiva** — a spec era omissa e o código acrescenta sem mudar o que ela afirma · **divergência declarada** — o código faz diferente do texto da spec (a direção está dita); na E12 é o **gate** que ganha uma alínea · **registro** — interpretação ou medida que passa a constar, sem divergência de comportamento |
| **O que NÃO é reaberto** | Os 3 gates `D026-REC1`/`D026-PAP1`/`D026-LEG1` e todas as suas alíneas (a E12 acrescenta uma, não retira nem afrouxa nenhuma); os 6 mutantes `D026-M1`..`M6`; as 4 reancoragens de `D022-M10`; a trilha E13; as contagens existentes (`d019` 14, `d022` 14, `d023` 9, `d025` 16); D-1..D-9; o red `7678222`; o que a spec lista em «O que NÃO muda» |

### E1 · `entradaViva()` traz `solucoes` — aditiva

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Contratos → *Funções*: `entradaViva()` devolve `{ legado, suficiente, findings, mapa, produtos, contextos, catalogo, landscape:{capId→presence}, supressao, arquitetura, elegibilidade }` — `landscape` guarda só a **presença** |
| **Fato medido** | O veto precisa de `existente[]` = `TECH_LANDSCAPE[capId].solutions` (produto, status, deployment) para «Tecnologia declarada: <product> (<status>)». `ui_curation_v32.js:191-194` acrescenta `solucoes: { capId → [{product, status, deployment}] }` ao lado de `landscape`; `reconciliar()` o lê em `:211`/`:232` |
| **O que passa a valer** | A entrada ganha o campo `solucoes`. Continua dado → dado: copiado de `V32.TECH_LANDSCAPE`, nunca escrito |
| **Onde o gate afirma** | `D026-REC1 (b)` e `(d)` (texto «Tecnologia declarada: … (production[, on-prem])»); `D026-LEG1 (f)` (pureza: a entrada não é mutada) |
| **Classe** | aditiva |

### E2 · O veto ganha `notas[]` — aditiva

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Shape do veto: `{ chave, nome, itemId, capId, cap, classe, motivo, existente, extensoes, servicos }` |
| **Fato medido** | `ui_curation_v32.js:231-241`: o veto carrega também `notas: ctx.notes.slice()`. `motivo` é a primeira nota; as demais (C3b: a nota M75 vem depois de «tecnologia operacional…») só chegam à tela por `notas[]` |
| **O que passa a valer** | O shape do veto tem `notas: string[]` (literais de `ctx.notes`, cópia). A regra de ouro do shape continua: todo valor vem de dado existente |
| **Onde o gate afirma** | `D026-LEG1 (c)` (C3b: `txt` do `li` contém «M75»); `D026-REC1 (b)` (`ctx.notes[0]` literal) |
| **Classe** | aditiva |

### E3 · «Sinal requerido ausente» é abstenção, não veto — divergência declarada

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Linhas de serviço: `!el.eligible` com «demais razões» ⇒ **veto `elegibilidade`**, `motivo = el.reason`; a única exceção é «base requerida ausente» sob `UNSET`/`UNKNOWN` (D-6) |
| **Fato medido** | `serviceEligibility()` devolve «sinal requerido ausente: <sinais>» (`engine_v32.js:475-476`) quando o serviço exige um sinal que a sessão não ligou. Sinal é **entrada da sessão**, não landscape declarado. `ui_curation_v32.js:310-311` trata esse caso como `hip = true` (hipótese · `capability-nao-informada`), nunca veto |
| **O que passa a valer** | Veto de elegibilidade só nasce de razão sobre landscape **declarado**. «Sinal requerido ausente» e «base requerida ausente» sob `UNSET`/`UNKNOWN` são **abstenção**. Mesma lógica de D-6 (INV-2: não informado ≠ ausente), estendida ao sinal |
| **Onde o gate afirma** | `D026-LEG1 (b)` pina a exceção D-6 (mutante `D026-M6`). **A exceção do sinal não tem alínea nem mutante próprio** — dívida declarada; a fixture que a exercitaria (serviço gatilhado só por sinal, com o sinal desligado) não está entre as da spec |
| **Classe** | divergência declarada (menos vetos que o texto; direção conservadora) |

### E4 · O laço por sinal roda também sob suficiência fechada — divergência declarada

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Portas de saída: `suficiente === false` ⇒ «toda linha é hipótese … sem veto» |
| **Fato medido** | O segundo laço de `reconciliar()` (`ui_curation_v32.js:341-357`, a 022 E2 transportada, âncora `D022-M10`) só testa `!entrada.legado`. Com o gate fechado o candidato `offering` **com sinal** continua virando `conversa-por-sinal`, tier 2 — que é o comportamento de hoje (`ofertaDoMotor()` não consultava o gate). O corte por `suficiente` vale para as linhas do **mapa** (`:328-330`) |
| **O que passa a valer** | «Toda linha **do mapa** é hipótese» sob gate fechado; o card habilitado **por sinal** (`origem="sinal"`) permanece, tier 2 e sem veto. Status quo da 022; nenhum card novo |
| **Onde o gate afirma** | `D026-LEG1 (d)` (GF nas duas variantes: hipótese com `contexto-a-validar`, zero veto) não exercita sinal; `D022-PROD1` (intacto) cobre o laço |
| **Classe** | divergência declarada |

### E5 · `veto.itemId` — a primeira oferta relacionada que não é família — registro

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Shape do veto: `itemId: "fortiendpoint"\|null`, sem regra de preenchimento |
| **Fato medido** | `ui_curation_v32.js:258` (`alvo`): para veto de produto, a primeira oferta da linha com relação à capability e `entityType !== "family"` (a primeira relacionada se só houver família); para veto de serviço, o `serviceId` que gerou o veto (`:312`, `:315`). `null` só quando a linha não tem oferta relacionada |
| **O que passa a valer** | A regra acima fica escrita no contrato do veto. O atributo `data-p53-veto-item` continua o **nome da linha**; `itemId` só viaja no registro (`D026-REC1 (d)` lê o `li` pelo nome) |
| **Onde o gate afirma** | Nenhum gate assere `veto.itemId` diretamente — dívida declarada |
| **Classe** | registro |

### E6 · `__P50SUFF` ausente ⇒ `suficiente = false` — registro

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Portas de saída: `suficiente === false` lido de `__P50SUFF.contract().sufficient`; a spec não diz o que acontece sem a bridge |
| **Fato medido** | `ui_curation_v32.js:196-198`: `suf = window.__P50SUFF && …contract().sufficient`; `e.suficiente = suf === true`. Bridge ausente ou valor não booleano ⇒ `false` ⇒ porta de saída **fechada** |
| **O que passa a valer** | Suficiência desconhecida é tratada como **não publicável** (INV-3: a UI nunca é dona da decisão, e o que não se sabe não vira veto). Efeito: sem a bridge toda linha do mapa sai como hipótese. Os gates rodam sobre o HTML construído, onde a bridge existe |
| **Onde o gate afirma** | Indiretamente `D026-LEG1 (d)`; sem alínea própria para «bridge ausente» |
| **Classe** | registro (interpretação conservadora onde a spec era omissa) |

### E7 · Entrada nula ⇒ `coletar(true)` com `console.error` — registro

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Portas de saída: `entradaViva() === null` ⇒ «hipóteses do mapa; `condicao = sem-contexto`; `console.error` nomeando» — sem dizer como se monta a entrada só-mapa |
| **Fato medido** | `ui_curation_v32.js:412-418` (`derivar()`): `entradaViva() === null` ⇒ `console.error("[026] entrada do motor indisponível …")` e `coletar(true)`, que monta só a Camada 1 com `legado: true` (⇒ `sem-contexto` pela porta de legado, `:328`). Se nem isso monta, devolve `{ registros: [], vetos: [] }` |
| **O que passa a valer** | O modo de falha é este: nunca silêncio (R10 §2), nunca veto, sempre hipótese do mapa quando a Camada 1 existe |
| **Onde o gate afirma** | Nenhum gate exercita o ramo (precisaria de engine ausente) — dívida declarada |
| **Classe** | registro |

### E8 · `ACAO_TXT` começa por «Ação sugerida:» — registro

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Tela: `.p53-sol-acao` = `ACAO_TXT[acao]`; spec: «os gates **não pinam** esses literais». O rascunho entregue à W3a usava «Próximo passo…» e «…sobre a base declarada» (**segundo a delegação; o rascunho não está em arquivo do repositório**) |
| **Fato medido** | «Próximo passo» é observável de outros gates: `P52-RES4` (`tests_p52_layout.js:220`, `/Pr[óo]ximo passo sugerido/i`) e `U15 (E)` (`tests_ui_m31.js:315`, «fronteiras do hiding … 'Próximo passo'»). A W3a (`816d605`) usou «Ação sugerida: …» em `ACAO_TXT` (`ui_p52_support_v32.js:278-285`) e conferiu os literais novos contra `P52_COPY` e contra `grep` em `tests_*.js`. **Pendência de verificação**: não localizei regex que pine «sobre a base declarada» nos gates lidos; o trecho permanece em `VETO_TXT.extensao` (`ui_p52_support_v32.js:297`) |
| **O que passa a valer** | O texto da ação é «Ação sugerida: …»; o atributo `data-p53-sol-acao` carrega o enum e é o que os gates leem |
| **Onde o gate afirma** | `P52-RES4` e `U15 (E)` (intactos, verdes: `p52layout 45/45` em `816d605`); `D026-PAP1` compara atributos, não esse texto |
| **Classe** | registro |

### E9 · Orçamentos medidos — o plano previu menos — registro

| Campo | Registro |
|---|---|
| **O que estava escrito** | `plan.md`/desenho §5.1: `ui_curation_v32.js` 316 → ≈ 495; `ui_p52_support_v32.js` 872 → ≈ 940; CSS ≈ +35 |
| **Fato medido** | `git show HEAD:<arquivo> \| wc -l`: `ui_curation_v32.js` **597** (`git diff --numstat 9509e4b..HEAD`: +333 −52); `ui_p52_support_v32.js` **1105** (+339 −106); `ui_p52_support_v32.css` **291** (+71); `ui_curation_edit_v32.js` +8. Os dois primeiros ficam acima do orçamento de R9 §7 (~600; o de apoio já estava acima antes: 872) |
| **O que passa a valer** | As cifras do plano são estimativa. O crescimento do `ui_p52_support` é o do estouro herdado: a demanda **retira** a derivação do módulo (`ofertaDoMotor()` virou leitor), mas acrescenta o bloco de vetos, o papel e os literais; a justificativa de R9 §7 do `plan.md` continua valendo e o split segue como rota futura. `lint-arch`: 0 problema(s) |
| **Onde o gate afirma** | `lint-arch` (stage); R9 §7 é justificativa registrada, não gate |
| **Classe** | registro |

### E10 · O preflight d023 tem 12 mutantes, não 11 — registro

| Campo | Registro |
|---|---|
| **O que estava escrito** | `tasks.md` T020 (e `plan.md` §Janela vermelha): «preflight d023 11/11» |
| **Fato medido** | O harness d023 declara **12** mutantes e o preflight fecha 12/12 (planning-state, W2) |
| **O que passa a valer** | Onde o plano diz 11, lê-se 12. A contagem registrada (`mutation_map.json`) é a do harness, não a da prosa |
| **Onde o gate afirma** | `tests_023_mutants.js --preflight` |
| **Classe** | registro |

### E11 · Os repins foram consolidados (R0 a R3), não nove — registro

| Campo | Registro |
|---|---|
| **O que estava escrito** | `plan.md` §Pins: série `R0`, `R1`, `R2`, `R3`, `R4a`, `R4b`, `R4c`, `R5`, `R6`, `R7`, `R8`, cada um em commit separado |
| **Fato medido** | Executados até `fc5874f`: `R0` (`96369af`, docs), `R1` (`a02d411`, após o red), `R2` (`102decc`, `ui_curation`, `ui_p52_support` `.js`/`.css`, editor e HTML, **depois** de W2 e W3) e `R3` (`3f13100`, harness `d026`, registros, censo do CSS e trilhas da W4). W2 (`6ace994`) e W3a/W3b (`816d605`, `dc5b633`) não tiveram repin próprio. O planning-state registra a consolidação (após o red, após o rebuild da W3, no fecho) em lugar dos «nove previstos» — diretriz de 2026-09-13. Depois de `3f13100`, `993e371` (W4b: `REC1 (j)`, matriz) e `fc5874f` (nota do `__CURATION` em `bridges.json`) tocaram arquivos pinados e esperam o repin de fecho |
| **O que passa a valer** | R8 pede o repin **no mesmo PR**, não um commit por wave. Janela de `baseline` vermelho entre `6ace994` e `102decc` aceita e declarada. O repin de fecho (a série executada é `R0`–`R3`) cobre o que vier depois de `3f13100`, inclusive os documentos desta entrega: <<pipeline-final>> |
| **Onde o gate afirma** | stage `baseline` (`check_baseline.py`) no fecho |
| **Classe** | registro |


### E12 · `D026-M5`: o mecanismo de C7 e a alínea `REC1 (j)` com a fixture C4-DL — divergência declarada

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Critérios, linha C3, coluna *Mutante previsto*, e `tasks.md` §Estado do mundo, linha M5: «em C7 a hipótese do MAP de `team-capacity` cai diante do veto pela **precedência da fusão**» (E4 do desenho); `D026-M5` (fusão sem a precedência veto > hipótese) faria `REC1 (d)(f)` publicarem «FortiGuard MDR · indicação prioritária» |
| **Fato medido** | W4, primeira execução da campanha `d026` (`993e371` registra a correção; trilha em `mutation_map.json → harnesses.d026._trilha`): **5 DETECTADO · 1 SOBREVIVENTE · 0 NÃO EXECUTADO de 6** — o sobrevivente é `D026-M5`. Em C7, `veredictoDeServico` veta o MDR por **inelegibilidade**, propriedade do landscape que vale igual em toda linha da chave: o `li[data-p53-veto-item="FortiGuard MDR"]` lista as duas capabilities (`team-capacity` e `monitoring-coverage`), logo `hipoteses[]` do MDR nasce **vazio** e a precedência da fusão não tem sujeito. `REC1 (d)(f)` em C7 são garantidas pelo **veto por linha**, não pela fusão. O estado que M5 distingue existe no lado **produto**: a mesma chave com hipótese numa capability e veto noutra — C4 com `detection-lifecycle: 0` (fixture **C4-DL**): `FortiSIEM` com hipótese por `detection-engineering` (`CONTEXT_NOT_INFORMED`) e veto por `security-analytics` (`OPERATIONAL_GAP`). No produto correto a fusão derruba o card (`offered []`); sob M5 sai «FortiSIEM · indicação prioritária» ao lado do próprio veto. Nenhuma das 15 fixtures então existentes o exercitava: M5 não era equivalente, o **gate** era cego |
| **O que passa a valer** | `D026-M5` prevê `D026-REC1 (j)`: em C4-DL, zero card `[data-p53-sol-produto="FortiSIEM"]`, `li[data-p53-veto-item="FortiSIEM"]` presente e `published()` sem `FortiSIEM`. A alínea **nasce verde por desenho** (o produto está certo) e tem poder exclusivamente em M5 — precedente `D025-INV8 (c)`, aqui **com** carrasco. `REC1 (f)` continua medindo C7, agora com o mecanismo nomeado certo (veto por linha). O texto «precedência da fusão» da linha C3 e da linha M5 fica como redação original, desmentida por medição (R2 §5) |
| **Onde o gate afirma** | `D026-REC1 (j)` (`tests_026_contrato.js`); carrasco `D026-M5` (`tests_026_mutants.js`, reancorado em (j)). Remedido: `D026 CONTRATO` 3 PASS · 0 FAIL de 3; preflight 6/6; campanha `d026` **6 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO** (M5 cai em `REC1 (j)`); matriz de mutação 207 pares completos |
| **Classe** | divergência declarada — **o gate ganhou uma alínea, nenhuma foi afrouxada**: nenhuma asserção foi removida ou relaxada, uma foi acrescentada; a contagem da suíte continua em 3 gates |
