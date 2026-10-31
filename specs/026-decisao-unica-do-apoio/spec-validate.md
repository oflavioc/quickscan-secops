# Conformidade — 026-decisao-unica-do-apoio

> Fase 6 · T063 · executor: `qa-engineer`, modelo **Fable 5.1** (`claude-fable-5-1`) ·
> somente leitura (skill `spec-validate`). **2026-10-31**, pasta primária `phase5`,
> branch `feature/026-decisao-unica-do-apoio`, árvore limpa em **`8ad6621`** para todas
> as execuções; base `develop @ 9509e4b` (`git diff 9509e4b..HEAD`). Conferido na
> implementação REAL (fonte lido no HEAD, diff contra a base, suíte e sondas
> EXECUTADAS), nunca no relato de quem implementou (R2 §4) — o `relatorio-final.md`
> foi lido só para localizar a prova da campanha `d022`, que este validador não
> reexecuta. Erratas E1–E12 da `spec.md` §Erratas contam como spec emendada, não
> como divergência. Divergência pesa mais que ausência.

## Score

**123 de 125 itens conformes · 98,4 %** — **dois gaps, ambos classe `spec-errada`**,
que exigem errata com decisão do usuário e por isso PARAM esta validação aqui (skill:
< 100 % ⇒ UMA iteração; nunca ajuste de gate, de registro ou de código):

- **G1 · comentário-trilha "nos dois lados" × `ui_v32.js` intocado.** A spec afirma
  duas coisas incompatíveis: §Contratos → *Funções*, linha `temVoz(ctx)`: *"espelha
  `ui_v32.js:750-752`; **comentário-trilha nos dois lados**"* e §Regra única de
  aquisição: *"com comentário-trilha **cruzado nos dois módulos**"*; e §O que NÃO muda:
  *"`ui_v32.js` … **não muda**"* (reforçado por §Cross-check → Boundary: `ui_v32.js` é
  §29.4 da REV B e **ponto de PARADA declarado**). Medido: `ui_v32.js:746-758`
  (`hasSubstituteV32`) **não** carrega comentário `[026]`/`temVoz` — o diff de
  `ui_v32.js` contra a base é **vazio**; a trilha cruzada vive só do lado do owner
  (`ui_curation_v32.js:122-124`: *"espelha a cláusula de `hasSubstituteV32`
  (ui_v32.js:750-752)"*). Direção: a **spec** é que está errada — o executável respeitou
  a boundary, e escrever o comentário em `ui_v32.js` seria tocar §29.4 sem rito.
  Recomendação: errata aditiva (molde E1–E12) nas duas células, registrando *"trilha só
  no lado do owner; `ui_v32.js` intocado por §29.4"*. Nenhum gate, registro ou código muda.
- **G2 · literais de `motivo` no dono do estado.** §Contratos → *Regra de ouro*: *"Os
  únicos literais novos são rótulos de apresentação (`ACAO_TXT`, `CONDICAO_TXT`,
  `VETO_TXT`) em `ui_p52_support_v32.js`"*; §Tela: *"moram em `ui_p52_support_v32.js`,
  **nunca no dono do estado**"*. Medido em `ui_curation_v32.js:117-120`: **três** literais
  no owner — `SEM_NOTA_VALIDAR` (:118, o único que a própria spec prevê em §Veredito,
  linha `NEEDS_VALIDATION sem nota`), **`SEM_CANDIDATO`** (:119, `motivo` do veto
  `motor-sem-candidato`) e **`ARQ_VIOLADA`** (:120, `motivo` do veto `arquitetura`). A
  spec exige `motivo` literal do engine para esses dois vetos (§Veredito, §Shape do veto)
  e, ao mesmo tempo, declara em §Fora de escopo que o engine **descarta em silêncio** o
  `violated` (`:448`) e o candidato ausente — não existe nota do engine para copiar; a
  spec é **omissa** sobre a origem desse `motivo`, e a *Regra de ouro* fica falsa por
  construção. Direção: errata aditiva (molde E1/E2) listando os três literais do owner
  como os únicos fora da apresentação (o comentário `:117` já os declara assim). Nenhum
  gate os pina (ambos os vetos são cláusulas declaradas defensivas/sem fixture —
  §Cross-check R13). Leitura alternativa, declarada por honestidade:
  `implementação-divergente` (mover os dois literais para `VETO_TXT` e deixar `motivo`
  vazio) — recusada aqui porque §2.2 já põe um literal de veto no owner e a forma do
  shape (`motivo` sempre string) é a que `declararVetos` lê (`:747`, fallback ao `motivo`).

Fora do denominador, declarado (§Fora do denominador ao fim): repin de fecho pendente
(E11), campanhas de mutação não reexecutadas por este validador, `run.sh` completo e job
`visual`.

## Execução — o que rodou neste HEAD (logs no scratchpad `026-specval-*.log`)

```
node tests_026_contrato.js                 ⇒ D026 CONTRATO: 3 PASS · 0 FAIL de 3        (exit 0)
node tests_019_curadoria.js                ⇒ D019 CURADORIA: 14 PASS · 0 FAIL de 14
node tests_022_escalonamento.js            ⇒ D022 ESCALONAMENTO: 14 PASS · 0 FAIL de 14
node tests_023_leitura.js                  ⇒ D023 LEITURA ÚNICA: 9 PASS · 0 FAIL de 9
node tests_025_curadoria_sessao.js         ⇒ D025 CURADORIA SESSAO: 16 PASS · 0 FAIL de 16
node tests_026_mutants.js --preflight      ⇒ 6/6 ocorrencias == 1 (python resolvido em C:\Python314)
node tests_019/022/023/025_mutants.js --preflight ⇒ 17/17 · 13/13 · 12/12 · 23/23 (D022-M10: 1 em ui_curation_v32.js)
python .claude/verify/check_lint_arch.py   ⇒ lint-arch: 0 problema(s) (20 bridges, zero innerHTML=)
python .claude/verify/check_tdd.py         ⇒ [OK] 026: red provado e commitado (7678222…) · 207 pares completos
python .claude/verify/check_m41.py         ⇒ snapshot funcional PASS · payload 9794b267e4225d8f… == pin
python .claude/verify/check_baseline.py    ⇒ 638/647 · 9 divergentes · 1 sem pin (todos pós-3f13100 — E11, §Fora do denominador)
sonda-leitura.js C1..C10, C3b (QS_REPO)    ⇒ 11/11 exit 0; sonda própria do validador (026-specval-probe.js,
                                              read-only, mesma montagem :33-39) ⇒ registro, vetos, tela e papel por cenário
```

Nenhum arquivo do produto foi escrito; `git status` limpo antes e depois (a sonda própria
vive no scratchpad). Leitura: `ui_curation_v32.js` inteiro (597 linhas),
`ui_p52_support_v32.js:236-1105`, diffs de `ui_curation_edit_v32.js`, `tests_022_mutants.js`,
`tests_019_curadoria.js`, `ui_p52_support_v32.css`, registros `.claude/verify/*.json`,
`tests_026_contrato.js` inteiro, `tests_026_mutants.js` inteiro.

## A · Critérios C1–C8 — execução + leitura do fonte

| # | critério | conforme | evidência executada · leitura |
|---|---|---|---|
| 1 | **C1** veto visível, nunca aquisição | sim | `D026-REC1 (b)` PASS. Sonda C2: `oferta() = []`, `vetos()` = 1 (`FortiEndpoint · endpoint-detection · operacional`, `motivo` = `ctx.notes[0]` literal, `existente` CrowdStrike Falcon production/saas); tela zero card, `[data-p53-vetos="1"]`, `li` com "Tecnologia declarada: CrowdStrike Falcon (production, saas)". C4: `data-p53-vetos="2"` (FortiAnalyzer, FortiSIEM). Leitura: `ui_curation_v32.js:281-283` (classe por `CLASSE_DO_GAP`, `notas[0]`), `:232` (`existente` de `solucoes[capId]`); `ui_p52_support_v32.js:721-787` |
| 2 | **C2** variante é o título; linha é a identidade; pareamento total | sim | `REC1 (a)(c)(e)(g)(i)` PASS. Sonda C1: registro `chave FortiEndpoint · titulo FortiEDR · itemId fortiedr · avaliar-aquisicao · tier 1`; card `data-p53-sol-produto="FortiEndpoint"`, `h4` "FortiEDR", `item-id="fortiedr"`, `tier="prioritaria"`, sem `[data-p53-vetos]` (E5). C6: `h4` "FortiNDR (On-Premises)", `item-id="fortindr-onprem"`, linha `FortiNDR`. C10: `FortiSIEM` com `variantes="fortisiem, fortisiem-cloud"`, frase "Disponível também como FortiSIEM Cloud", **sem** card Cloud. Leitura: `:388-392` (título), `:133-168` (pareamento) |
| 3 | **C3** serviço gerenciado: elegibilidade do motor; veto vence hipótese | sim | `REC1 (d)(f)(j)` PASS (E12: (f) garantida pelo veto por linha; a fusão é medida por (j) em C4-DL). Sonda C7: 1 registro `SOCaaS · servico · tier 1 · gap · elegibilidade {elegivel, "sem restrições"}`; vetos `FortiGuard MDR` ×2 (`soc-staffing`, `continuous-monitoring`, `elegibilidade`, reason "base declarada apenas em deployments não elegíveis…") e `FortiEndpoint` (`operacional`, `extensoes [fortixdr]`); tela: card SOCaaS `acao=servico`, `tier=prioritaria`, `.p53-sol-elig` "Elegível: sem restrições"; `li` MDR com reason literal; `li` FortiEndpoint com `[data-p53-sol-extensao="fortixdr"]` + scopeNote M50 + "Tecnologia declarada: FortiEDR (production, on-prem)". Leitura: `:292-317` |
| 4 | **C4** sem voz do motor nada é inventado (hipótese condicionada; D-6; constante C3) | sim | `D026-LEG1 (a)(b)(c)` PASS. Sonda C8 (legado): `hipotese · sem-contexto · tier 1`, `.p53-sol-condicao` visível na tela e no papel, zero veto. C3: `FortiSOAR · hipotese · capability-nao-informada · prioritaria`, zero veto, `[data-p53-suprimido]` ausente. C3b: zero card, `li[FortiSOAR]` classe `operacional` com as DUAS notas (M75 pela `notas[]`, E2). Leitura: `:111` (`= false`), `:251-253`, `:309` (D-6), `:328` (legado) |
| 5 | **C5** gate fechado e leitura congelada | sim | `LEG1 (d)(e)` PASS (GF-NONE `NEEDS_VALIDATION`, GF-TERCEIRO `OPERATIONAL_GAP`: `data-p50-gate ≠ released`, hipóteses `contexto-a-validar`, zero veto; C2/C4/C7/C3b: `d010HasSubstitute === true`, nenhum `.apoio-block` congelado visível, `[data-p53-suprimido]` ausente). Sonda: `legadoVisivel 0` e `suprimido null` nas quatro fixtures com veto. Leitura: `:329-330` (porta de suficiência), `:125-128` (`temVoz`), `:197-198` (E6) |
| 6 | **C6** o papel diz o que a tela diz, por card | sim | `D026-PAP1 (a)…(f)` PASS. Sonda C5: 9/9 `pr-card` com `data-p53-sol-tier` + `.p53-pr-tier` (7 `validacao`, 2 `prioritaria` — medido), `pr-card[FortiEndpoint]` "Escopo: cobre a camada de endpoint…", `pr-card[FortiRecon]` "complementa o programa de gestão de vulnerabilidades…"; C1 `<b>` "FortiEDR" + `.p53-pr-variante`; C9 "após validação" + `origem="sinal"` + `data-qs22-sinais`; C2/C4/C7 `.p53-pr-vetos[data-p53-vetos]` com mesma contagem e itens, **não** `.pr-card`, sem `data-p53-sol-produto`; C2/C4 seção só com vetos. Leitura: `ui_p52_support_v32.js:972-1067` |
| 7 | **C7** mesma decisão nas três superfícies; exclusão por linha; acréscimo | sim | `REC1 (h)` PASS (C1/C7/C10 `published()` ≡ tela ≡ papel); `LEG1 (g)` PASS (`set("FortiEndpoint","exclude")` retira `fortiedr` da tela e do papel com `[data-p53-suprimido="1"]`; `unset` devolve; `[data-p53-cur-item="FortiEndpoint"]` no painel e `.p53-cur-item-var` contém "FortiEDR"; acréscimo com `[data-p53-prov="operador"]`, `origem="operador"`, `acao="hipotese"`, sem tier, nas duas). Leitura: `ui_p52_support_v32.js:908-909` (`decisaoDe` por linha), `:570-571`, `ui_curation_edit_v32.js:100-107` |
| 8 | **C8** derivação pura, sem efeito, nunca serializada; isolamento da 025 | sim | `LEG1 (f)` PASS (`reconcile` duas vezes ⇒ JSON idêntico; entrada não mutada; `legacySnapshot()` e `buildRecommendationContext()` byte-iguais após `oferta()/vetos()/contract()`; `toSession()` = `{decisions:{FortiEndpoint:"exclude"}}`; nenhuma chave de `RESERVED_DERIVED` ∪ {oferta, vetos} no documento; `captureCanonicalInputs()` sem `oferta`/`vetos`). Sonda: `toSession undefined` em todos os cenários sem curadoria. `tests_025_curadoria_sessao.js` **16/16** neste HEAD. Leitura: `:207` (sem DOM/estado/cache), `:412-418` (`derivar()` por chamada), `paraSessao` byte-igual à base |

## B · Gates, red, harness e mutantes

| # | item | conforme | evidência |
|---|---|---|---|
| 9 | suíte `tests_026_contrato.js` (jsdom, padrão 019: `T()`, `vac()`, `boot(opts)`, `D026_HTML_OVERRIDE`, `D026_ONLY`), três gates com alíneas nomeadas | sim | `:93-101` (`T`, `vac`), `:81` (`D026_HTML_OVERRIDE`), `:92` (`D026_ONLY`), `:184-218` (`boot`), `:106-121` (alíneas sequenciais, `D026_DIAG`); gates `:525`, `:778`, `:874`; 3 PASS · 0 FAIL de 3 |
| 10 | oráculos independentes (motor público, pareamento reimplementado, Camada 1 como hipótese, DOM, papel após `beforeprint`, bridges, `FX010.d010HasSubstitute`, `[data-p50-gate]`) | sim | `:334-339` (`ctxDe`), `:355-388` (pareamento reimplementado, nunca `chaveDe` do produto), `:315-333` (`hipoteseDoMapa`), `:257-262` (`papel()` despacha `beforeprint`), `:391-417` (censo da 010), `:978` (`FX010.d010HasSubstitute`), `:957-960` (`data-p50-gate` + `__P50SUFF`) |
| 11 | fixtures C1–C10, C3b, C7-UNSET, F2-placeholder, GF ×2 (+ C4-DL por E12), literais dos anexos | sim | `:153-182` — valores iguais a `anexos/cenarios/*.json` (conferido C1/C2/C4/C7: `saasAllowed`, `localProcessingRequired`, soluções e deployments); `F2` = `tests_023_leitura.js:156` |
| 12 | red provado e commitado: `0 PASS · 3 FAIL de 3`, cada gate nomeando o contrato ausente | sim | `7678222` (`test(026): red — D026-REC1/PAP1/LEG1 (0/3)`), `red-026.md:31`; `bridge(w)` `:230-238` nomeia *"`__CURATION.oferta` ausente — o contrato da spec §Contratos não existe"*; `check_tdd` `[OK] red provado e commitado (7678222…)`; planning-state `red.status: proven` |
| 13 | harness `tests_026_mutants.js` no padrão da 025: mutação + restauração byte a byte, rebuild em `os.tmpdir`, `--preflight` com `ocorrencias == 1`, três estados, `reason` nominal por gate | sim | `:283-307` (mutação/`finally` byte a byte), `:289` (`os.tmpdir`), `:232-263` (preflight, JSON único em stdout), `:118` (três estados), `:125` (`/FAIL {2}D026-REC1\b/`, nunca `/N FAIL/`); preflight executado 6/6 |
| 14 | mutantes `D026-M1`..`M6` ancorados nos sítios previstos; M3 exige REC1+LEG1; M4 exige REC1+PAP1+LEG1; M5 reancorado em `REC1 (j)` (E12) | sim | `:128-158`; âncoras conferidas no fonte: M1 `ui_curation_v32.js:127`, M2 `ui_p52_support_v32.js:1001`, M3 `:141`, M4 `:731`, M5 `:404`, M6 `:309`. Formas reduzidas ao discriminante (M1 `temVoz` ⇒ `false`, M2 só a linha do tier) **declaradas** na matriz e no cabeçalho `:33-46` (precedente d019/025). Campanha **não reexecutada** por este validador (§Fora do denominador); registro da última prova: matriz `ultima_prova` 2026-10-31, 6 KILL |
| 15 | `D-9` sem gate próprio, `LEG1 (d)` e `LEG1 (f)` sem carrasco, constante C3 sem mutante — dívidas declaradas na matriz | sim | `mutation-matrix.json → dividas_declaradas`: `D026-LEG1 (d)`, `D026-LEG1 (f)`, `D026 · CONSTANTE C3`, `D026 · D-9`, `D026-M3 → D023-REG1 (c)` (5 entradas) |
| 16 | nenhum gate lê `oferta()` como oráculo de si mesmo; vacuidade nomeada; nenhum hash inline; teste não escreve na árvore | sim | `LEG1 (a)` compara `oferta()` contra a Camada 1; `REC1 (h)` compara `published()` contra DOM; `vac()` em toda pré-condição; grep `sha256|[0-9a-f]{64}` = 0 em `tests_026_*.js`; `D026_HTML_OVERRIDE` + efêmero em `os.tmpdir` |

## C · Contratos

| # | item | conforme | leitura |
|---|---|---|---|
| 17 | dono de estado continua só `__CURATION`; registro derivado, recomputado a cada chamada, sem cache, nunca serializado, nunca lido do DOM | sim | `ui_curation_v32.js:412-418` (`derivar()` a cada `oferta()/vetos()/contract()/offered()`), `:550-552`; nenhum `querySelector`/`document` no módulo (grep = 0); `paraSessao` `:473-478` byte-igual à base |
| 18 | shape do registro (vocabulário fechado: `chave, nome, titulo, tipo, modo, itemId, itemIds, variante, acao, tier, origem, condicao, capabilities, caps, sinais, escopo, elegibilidade, entregaveis, fontes, notas, vetosDaLinha`) | sim | `:359-361` — os 21 campos, nenhum a mais; sonda C1/C7/C10 confirma os valores (`modo`, `origem`, `variante`, `elegibilidade`, `entregaveis`, `fontes[].via`) |
| 19 | shape do veto (`chave, nome, itemId, capId, cap, classe, motivo, existente, extensoes, servicos` + `notas` por E2; `itemId` por E5) | sim | `:241-242`; `itemId` = primeira oferta relacionada não-família (`:258`) ou `serviceId` (`:312-313`); sonda C2/C7 confirma `existente`, `extensoes`, `notas` |
| 20 | nenhum campo colide com `RESERVED_DERIVED` nem com os 13 banidos de `S4-S5`; nada viaja na sessão | sim | `RESERVED_DERIVED` (`ui_session_v32.js:34-37`) ∩ campos = ∅ (conferido nome a nome; `services`/`offerings` do engine não são campos do registro); `LEG1 (f)` varre o documento |
| 21 | `entradaViva()` coletor sob `typeof`, `null` quando falta, chamador nomeia no console (+ `solucoes` por E1; `__P50SUFF` ausente ⇒ `false` por E6; `coletar(true)` por E7) | sim | `:173-202`, `:191-194` (`solucoes`), `:197-198`, `:412-418` (`console.error("[026] entrada do motor indisponível …")`) |
| 22 | `reconciliar(entrada)` pura (dado → dado), sem DOM, sem estado, não muta a entrada | sim | `:207-409`; `LEG1 (f)` PASS (idempotência, entrada byte-igual) |
| 23 | pareamento `itemId → chave` por critério, regras 1→5 na ordem, total sobre `OFFERINGS ∪ SERVICES`; `idsDaLinha`, `tipoDaLinha` (`servico` sse ∩ `SERVICES` ≠ ∅); constante `LINHA_DA_FAMILIA_DE_SERVICO` única | sim | `:137` (1), `:142-145` (2), `:146-153` (3: `family === fam`, `!variantOf`, `entityType !== "family"`, EXATAMENTE UMA), `:156-159` (4), `:154/:160` (5), `:112`, `:165-166`; `REC1 (g)` PASS: 13/13 chaves com pré-imagem, `ir-training → FortiGuard-Service-Bundle` pela regra 4, os 8 `null` esperados, `fortiedr/endpoint-family → FortiEndpoint`, `fortindr-*→ FortiNDR`, `fortisiem-cloud → FortiSIEM`; sonda C5: `FortiGuard-Service-Bundle · tipo servico` |
| 24 | `temVoz(ctx)` helper único; espelha `hasSubstituteV32` (`ui_v32.js:750-752`); comentário-trilha nos dois lados | **não — G1** (`spec-errada`) | `:125-128` espelha byte a byte a cláusula de `ui_v32.js:750-752`; trilha só em `:122-124`; `ui_v32.js` sem comentário (diff vazio — e assim tem de ser por §29.4) — ver §Score |
| 25 | `veredictoDeServico(chave, capId, ctx, entrada)` pura, tabela §2.4 (+ E3) | sim | `:292-317`: disparado ⇒ `servico` com `origem` por `triggeredBy`, `elegibilidade.estado` por `/^elegível — validar/`, `entregavel = SERVICES[sid].name`; D-6 `:309`; sinal `:311`; `!eligible` ⇒ veto `elegibilidade` `:312`; elegível não disparado ⇒ `CONTEXT_NOT_INFORMED ? hipótese : motor-sem-candidato` `:313`; vale em `CONTEXT_NOT_INFORMED` (sonda C7: `fontes servico-gap/soc-staffing`) |
| 26 | `ofertados()` leitor: chaves dos registros com `chave !== null`, deduplicadas, assinatura `offered()` inalterada | sim | `:422-426`, `:543`; sonda: `offered()` ≡ `oferta().map(chave)` em todos os cenários |
| 27 | `decidir/publicados/escolhaDoOperador/inclusoesSemLastro/paraSessao/validar/daSessao/valido/unset` byte-iguais | sim | corpos extraídos de `9509e4b` e `HEAD` comparados por script: **byte-iguais** (9/9; `unset` `:568-573` fora do diff); preflight d019 17/17 e d025 23/23 (âncoras `D019-M1/M2`, `D025-M2/M3/M5/M9/M23` com `ocorrencias == 1`) |
| 28 | bridge `__CURATION`: `oferta()`, `vetos()`, `reconcile(entrada)`, `contract()` com +2 campos (os 5 de hoje byte-iguais), `offered()` inalterado; nenhum setter novo | sim | `:550-552`, `:584-595` (os cinco campos iguais a `9509e4b:306-314`; `oferta`/`vetos` acrescidos); sonda: `contractKeys` = 7; porta de escrita continua `set/unset/clear/fromSession` (`:554-582`) |
| 29 | nota de `bridges.json` para `__CURATION` (texto proposto), nenhum bridge novo, `owner` intactos | sim | diff `bridges.json`: só a nota de `__CURATION` (+ `[026] oferta()/vetos()/reconcile(entrada) … temVoz espelha hasSubstituteV32, ui_v32.js:750-752`), ASCII como as notas vizinhas; `lint-arch`: 20 bridges, todos registrados |

## D · Comportamento especificado

### Portas de saída · NA/UNSET

| # | item | conforme | leitura · execução |
|---|---|---|---|
| 30 | `entradaViva() === null` ⇒ hipóteses do mapa, `sem-contexto`, `console.error` nomeando (E7) | sim | `:412-418` (`coletar(true)` monta só a Camada 1 com `legado: true` ⇒ `:328` `sem-contexto`); ramo não exercitado por gate — dívida declarada na E7 |
| 31 | `legado === true` ⇒ toda linha `hipotese · sem-contexto`, tier por `sev`, zero veto/serviço/elegibilidade | sim | `:328` (antes de qualquer veredito), `:340` (laço por sinal só `!legado`); sonda C5/C8: 9 e 1 registros `hipotese · sem-contexto`, `vetos []` |
| 32 | `suficiente === false` ⇒ toda linha **do mapa** hipótese (`contexto-a-validar` com voz, senão `capability-nao-informada`/`contexto-a-validar`), sem veto; laço por sinal continua (E4) | sim | `:329-330`; `:340-355` só testa `!legado` (E4); `LEG1 (d)` PASS nas duas GF |
| 33 | NA fora de `findings` (nada muda); UNSET nunca lido como ausência — única leitura de `presence` é a do D-6; veto só sobre `solutions` declarado | sim | `:305` (`landscape["endpoint-detection"]` só em `:309`); `existente` só de `solucoes` declaradas (`:232`); `LEG1 (b)` PASS (C7-UNSET: MDR hipótese) |

### Veredito por linha do MAP × capability (§2.2)

| # | situação | conforme | leitura |
|---|---|---|---|
| 34 | `ctx` ausente / `CONTEXT_NOT_INFORMED` (com constante `true` e `supressao.caps ∋ capId` ⇒ `plataforma-declarada-cobre` tier 2, nunca veto) | sim | `:251-253` |
| 35 | `!temVoz(ctx)` com classificação ≠ CNI ⇒ `contexto-a-validar` | sim | `:255`; defensivo `:288` |
| 36 | `TECHNOLOGY_WHITESPACE · DIRECT`: offering ⇒ `avaliar-aquisicao` (tier por `gap-high`), placeholder ⇒ `modalidade-a-definir` tier 2, `contextual-support` ⇒ `apoio-contextual`, `relacionados` vazio ⇒ `fora-do-catalogo-contextual`, senão `arquitetura` (só sem card em capability alguma — E5) ou `motor-sem-candidato` | sim | `:263-276`; E5 em `:402` (`vetosDaLinha` sem `arquitetura`) e `:407` (filtro dos vetos emitidos); `REC1 (a)` C1 (sem veto arquitetural com card), `(i)` F2 (`modalidade-a-definir`, `validacao`) |
| 37 | `TECHNOLOGY_WHITESPACE · CONTEXTUAL` por plataforma ⇒ veto `plataforma` (nota `:576` + `supressao.plataforma` em `existente`) | sim | `:277`, `:239-240` |
| 38 | `TECHNOLOGY_WHITESPACE · CONTEXTUAL` só `contextual-support` ⇒ `apoio-contextual`; demais ⇒ `motor-sem-candidato` | sim | `:278-279` (sem fixture — dívida declarada na spec R3) |
| 39 | `OPERATIONAL/COVERAGE/ADOPTION_GAP · CONTEXTUAL` ⇒ `contextual-support` ⇒ `apoio-contextual`; toda outra linha ⇒ veto `operacional/expansao/enablement` com `ctx.notes` literal, `existente`, `extensoes` (`fortixdr`), `servicos` | sim | `:116`, `:281-283`, `:232-238`; sonda C2/C4/C7/C3b |
| 40 | `EVALUATION_IN_PROGRESS` ⇒ veto `avaliacao` | sim | `:285` |
| 41 | `TECH_STATUS_UNVERIFIED` / `NEEDS_VALIDATION` com serviço / `POSSIBLE_CONTEXT_DIVERGENCE` ⇒ veto `validar` (nota literal; sem nota: "presença declarada como desconhecida — validar antes de qualquer leitura de gap") | sim | `:286-287`, `:118` (literal exato) |
| 42 | `UNASSESSED_CAPABILITY · CONTEXTUAL` por sinal ⇒ `conversa-por-sinal`, `origem:"sinal"`, tier 2, `chave = chaveDe(itemId)` (pode ser `null`), âncora `D022-M10` transportada | sim | `:340-355`, `:348` (âncora, `ocorrencias == 1`); sonda C9: `conversa-por-sinal · tier 2 · sinal`, 2 capabilities |

### Regra única · serviço · tier/título · fusão · constante

| # | item | conforme | leitura |
|---|---|---|---|
| 43 | só `DIRECT` com `itemKind ∈ {offering, family, family-of-variants}` vira aquisição; veto só onde `temVoz`; veto de produto nunca devolve a Camada 1; veto de serviço com voz própria, `LEG1 (e)` mede `d010HasSubstitute` | sim | `:264-271`; `:255` barra veto sem voz; `LEG1 (e)` PASS nas 4 fixtures com veto (inclui C7, cujo veto do MDR nasce em `CONTEXT_NOT_INFORMED`) |
| 44 | serviço do motor sem linha do MAP na pergunta não vira card (D-5); entra em `servicos[]` do veto | sim | `:236-238` (`chavesH.indexOf(par.chaveDe(s.serviceId)) < 0`); nenhum card nasce fora de `H` ou do laço por sinal |
| 45 | tier de hipótese: `sev 2 → 1`, senão 2; `prioritaria` só de motor `avaliar-aquisicao`/`servico` + `gap-high` ou hipótese `sev 2` (com condição visível) | sim | `:226`; `:267`, `:301`; sonda C3/C8 (`tier 1` + `.p53-sol-condicao`), C5 (7/2) |
| 46 | título = nome do item só quando `avaliar-aquisicao` fundiu UM `itemId ∈ OFFERINGS` não-família com `name ≠ linha`; placeholder ⇒ tier 2 sempre, `variante {modalidade:"a definir", nomes, resolucao}`; `apoio-contextual`/`conversa-por-sinal` tier 2; serviço por gap `gap-high → 1`, `note` "validar" → 2 + `estado:"validar"`; por sinal 2 | sim | `:388-392`, `:270-271`, `:378`, `:245`, `:351`, `:299-301`; sonda C1 (FortiEDR), C6, C10 (título = linha com 2 variantes) |
| 47 | fusão: tier = mínimo entre as fontes que produzem card | sim | `:367` |
| 48 | registros chaveados por `chave || itemId`, nunca por nome; acumulam `fontesMotor[]`, `hipoteses[]`, `vetos[]` | sim | `:220-224` (`acc[key]`, `key = chave || itemId`) |
| 49 | regra 1: fonte do motor ⇒ card motor; capabilities = motor ∪ hipóteses não vetadas; `itemIds/sinais/escopo/entregaveis` unidos; `acao` mais forte; vetos da chave em outras capabilities ⇒ `vetosDaLinha` | sim | `:398-403`, `:375` (`FORCA_ACAO` `:114`), `:369`, `:376`, `:379`, `:381` |
| 50 | regra 2: sem motor e `vetos.length > 0` ⇒ sem card, hipóteses caem (veto > hipótese) | sim | `:404-405`; `REC1 (j)` PASS (C4-DL: `FortiSIEM` zero card, `li` presente, `published()` sem FortiSIEM); carrasco `D026-M5` |
| 51 | regra 3: sem motor e sem veto ⇒ card hipótese com a condição mais forte (`FORCA_CONDICAO`); ordem de emissão = primeira aparição | sim | `:404`, `:382-383`, `:115`; `ordem[]` `:222` |
| 52 | `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false` em `ui_curation_v32.js`; `LEG1 (c)` pina; com `true` nunca veta; C3b = "plataforma cobre" pela regra geral | sim | `:111` (comentário D-3 `:106-110`), `:252`; `LEG1 (c)` PASS; `CONDICAO_TXT["plataforma-declarada-cobre"]` `:291` |

### Tela — `ui_p52_support_v32.js`

| # | item | conforme | leitura · execução |
|---|---|---|---|
| 53 | card `div.apoio-block.p53-sol-card` filho direto de `#p52-sec-support`; `data-p53-sol-produto` = nome da linha; `-grupo`; `-tier` = `TIER[tier]` (`:240` inalterado); `data-qs22-sinais`; novos `-chave` (`""` quando null), `-item-id` (ausente se null), `-variantes` (só > 1), `-acao`, `-origem`, `-condicao` (presente sse `!== null`) | sim | `:396-423`; `:240` byte-igual; `:850` (`sec.appendChild`); sonda C1 (sem `-condicao`), C8 (com), C10 (`-variantes` só no FortiSIEM) |
| 54 | título `h4 = titulo`; `.pt-name` removido; a linha de produto nunca é folha com texto igual ao nome | sim | `:448`, `:486-488`, `:647-648` (frase, não folha); `D019-CARD1 (a)` verde (d019 14/14) |
| 55 | corpo: `.prod` movido quando existe; senão corpo do catálogo/motor com ícone `productIcon`, descrição `PRODUCTS[chave].d`, link (`PRODUCTS.u` ou `OFFERINGS.url`), `.scope.p53-sol-escopo` | sim | `:471-502`, `:600-625`; **nota**: a spec nomeia dois helpers (`corpoDoMotor(p)` e `corpoDoCatalogo(id, nome, escopo)`); o fonte tem UM — `corpoDoCatalogo` — que cobre os dois ramos (`:604` lê `OFFERINGS` para `chave:null`). Saída de DOM idêntica à especificada; nome de helper privado, sem gate nem bridge — não contado como gap |
| 56 | linhas novas `.p53-sol-variante` (três frases), `.p53-sol-acao` (`ACAO_TXT`), `.p53-sol-condicao` (`CONDICAO_TXT`; legado "contexto tecnológico não informado nesta sessão"), `.p53-sol-elig` (motivo literal), `.scope.p53-sol-escopo` ("Escopo: …") | sim | `:449-456`, `:643-652`, `:625`, `:287`; sonda C1/C6/C10/C8/C7/C5 |
| 57 | capabilities `li.p53-sol-cap[data-p53-sol-cap]` = `__P52.applyCopy(texto)` (texto canônico no registro) | sim | `:322-324` (`aplicarCopy` sobre `capabilities[].texto`), `:509-510`; sonda C6: registro "Network Detection & Response" → card "Network Detection and Response (NDR)"; `D019-SOL1` 14/14 |
| 58 | sinais `data-qs22-sinais` = `sigPT(id)` unidos (`D022-PROD1`) | sim | `:303`, `:333`, `:409`; d022 14/14 |
| 59 | acréscimo humano: `acrescimos()` inalterado + `data-p53-sol-origem="operador"`, `-acao="hipotese"`, sem tier, sem capability, `[data-p53-prov]` | sim | `acrescimos` byte-igual à base (script); `:570-571`; `:573` `chipDoGrupo(grupo)` sem tier; `LEG1 (g)` PASS |
| 60 | supressão: `suprimidos = produtos.length - cards.length` só conta exclusões do operador; veto nunca usa `[data-p53-suprimido]` | sim | `:910` (`produtos` já sem vetados); `declararSupressao` byte-igual; `LEG1 (e)` + sonda (`suprimido null` com veto) |
| 61 | bloco de vetos `div.p53-sol-vetos[data-p53-vetos=N][role=note]`, título "Não indicado nesta leitura", `ul > li[data-p53-veto-item][data-p53-veto-classe]` com nome · motivos literais · capabilities · "Tecnologia declarada: <product> (<status>[, <deployment>])" · `span[data-p53-sol-extensao]` · "Serviço elegível nesta capability: …" | sim | `:721-787` (`:731`, `:732`/`:294`, `:737-738`, `:745-751`, `:752-753`, `:758`, `:769`, `:779-780`); sonda C7 (ext fortixdr), C2 (tecnologia), C3b (duas notas) |
| 62 | invariantes de DOM (E17): depois dos cards e antes do botão do editor; classe fora de `CLASSES_CONTIGUAS`; nunca `.apoio-block`; só com voz do motor; idempotente nos dois ramos de `decorar()` | sim | `:786` (`appendChild` após `colocar`); sonda C2/C7 `posicao`: `… apoio-block, p53-sol-vetos, p53-cur-abrir`; `tests_010_vao.js:168` = `["apoio-block","t-list","t-details"]`; `:722-723` remove o antigo; `:898`, `:918`, `:939` |
| 63 | portas de saída da tela: sem bridge/`oferta` ⇒ lista vazia e console nomeando; `decorar()` com zero produto ainda declara vetos | sim | `:309-318`, `:348-357`, `:893-898`; sonda C2/C4 `consoleErrors []` |
| 64 | literais `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` moram em `ui_p52_support_v32.js`, nunca no dono; gates não os pinam (E8: "Ação sugerida:") | **não — G2** (`spec-errada`) | `:278-302` conformes e não pinados (`PAP1` compara atributos; `compararCards` `:275-298`); **mas** `ui_curation_v32.js:119-120` carrega dois literais de `motivo` fora do previsto — ver §Score |

### Editor — `ui_curation_edit_v32.js` (D-9)

| # | item | conforme | leitura |
|---|---|---|---|
| 65 | `linhaProduto`: `data-p53-cur-item` e `.p53-cur-item-nome` continuam a linha; `span.p53-cur-item-var` "apresentado como <titulo>" quando `titulo !== nome` (lê `oferta()` pelo bridge; sem `oferta` nada muda) | sim | `:79-80`, `:100-107` (diff +8 linhas, único toque); `LEG1 (g)`: `.p53-cur-item-var` contém "FortiEDR"; CSS `.p53-cur-item-var` no diff; `D025-UNS1` 16/16 |
| 66 | `gateFechado()` e handler (tabela fechada da 025) inalterados | sim | `gateFechado` byte-igual (script); handler `:86-93` fora do diff; preflight `D019-M10`/`D025-M18` ok |
| 67 | linhas vetadas não aparecem em `offered()` — só em "Acrescentar por decisão sua"; `include` sobre vetada vira escolha com selo, veto ainda visível (residual declarado) | sim | `offered()` só de registros (`:422-426`); sonda C2: `offered []`; `cardAcrescentado` `:559-593` com selo; bloco de vetos independente dos cards (`:898`, `:918`) |

### Papel — `papelHTML()`

| # | item | conforme | leitura · execução |
|---|---|---|---|
| 68 | princípio intacto: o papel lê os cards da tela e copia (`D019-PAR1`) | sim | `:975` (`querySelectorAll` dos cards), nenhum recálculo; `D019-PAR1` verde (d019 14/14) |
| 69 | `data-p53-sol-tier` + `<div class="pr-mut p53-pr-tier">` com o texto do tier copiado de `.p53-sol-tierlabel` | sim | `:999-1001`, `ATTRS_DO_PAPEL` `:1054`; `PAP1 (a)` 9/9 em C5; carrasco `D026-M2` ancorado em `:1001` |
| 70 | `-chave`, `-item-id`, `-variantes`, `-acao`, `-origem`, `-condicao` copiados (presentes sse presentes na tela) | sim | `:1054-1063`; `compararCards` (`:283-286`) compara `null` com `null` |
| 71 | `<b>` = `txt(h4)` (título), não o nome | sim | `:1004-1005`; `PAP1 (b)` `<b>` = "FortiEDR" |
| 72 | `.pr-mut.p53-pr-variante` · `-acao` · `-condicao` · `-elig` por cópia de texto | sim | `:1006-1007`, `linhaCopiada` `:1064-1067`; sonda C8 (condição no papel), C7 (elig) |
| 73 | `.pr-mut.p53-pr-escopo` "Escopo: …" do `.scope` movido ou montado | sim | `:1016-1018`; `PAP1 (a)` FortiEndpoint/FortiRecon |
| 74 | `[data-p53-prov]`, `.pt-desc`, `li[data-p53-sol-cap]`, "habilitado por sinal declarado" inalterados (`D019-M4`) | sim | `:1010-1013`, `:1019-1026`, `:1002`; preflight `D019-M4` ok; d019 14/14 |
| 75 | bloco de vetos no papel `.pr-mut.p53-pr-vetos[data-p53-vetos]` com `li[data-p53-veto-item][data-p53-veto-classe]`, **não** `.pr-card`, sem `data-p53-sol-produto` | sim | `:1032-1048`; sonda C2/C4/C7: `isPrCard false`, `temProduto false`, contagem/itens iguais; `D023-PAP1`/`D010-PAPEL1` verdes (d023 9/9, d010 não reexecutada — contagens só de `.pr-card`) |
| 76 | guarda `if (!cards.length && !aviso && !vetos) return "";` | sim | `:980` (literal); `PAP1 (f)` C2/C4 |
| 77 | `[data-p53-suprimido]` no papel byte-igual (`D023-M6`); ordem `#pr-sup-solucao` > `h2` "Formas de apoio, por produto" | sim | `:982-983` fora do diff; `:981`; preflight `D023-M6` ok; `tests_010_vao.js`/`tests_p50_core.js` fora do diff |
| 78 | modo legado no papel: seção p53 entra pelo hook `__P53SOL.printHTML()` já existente, com a condição visível (D-6) | sim | `:1096-1099` (hook inalterado); `ui_v32.js` diff vazio; sonda C5/C8: `pr-card` com `.p53-pr-condicao` |

## E · Reancoragens (spec §Reancoragens)

| # | item | conforme | evidência |
|---|---|---|---|
| 79 | `D022-M10` muda de arquivo em **quatro** toques: `F.estado`, `file: F.estado`, `precisaBuild` com `F.estado`, `mutation_map.json → harnesses.d022` | sim | `tests_022_mutants.js:49`, `:122`, `:254`; `find`/`repl`/`reason` byte-iguais (diff só em `file` + comentário); grep da âncora: **1** em `ui_curation_v32.js:348`, **0** em `ui_p52_support_v32.js`; preflight d022 13/13 (`D022-M10 · ocorrencias=1 em ui_curation_v32.js`); mapa: `ui_curation_v32.js` em `targets` e **fora** de `populacao` (= `[ui_p52_support_v32.js]`, decisão pela semântica do gatilho, registrada na `_trilha`). Campanha d022 **não reexecutada** aqui — última prova registrada: commit `3560ba6` (*"preflight d022 13/13; campanha d022 13 DETECTADO"*) e `relatorio-final.md:161` |
| 80 | `D022-PROD1` byte-igual; `d022` 14 | sim | `tests_022_escalonamento.js` fora do diff; **14 PASS · 0 FAIL** executado |
| 81 | comentários-trilha E13 em `D019-SOL1`, `D019-SOL3 (b)`, `D019-MED1` — uma frase, corpo byte-igual, contagem 14 | sim | diff de `tests_019_curadoria.js` = +11 linhas, só comentários (`:319-322`, `:376-380`, `:514-515`); **14 PASS · 0 FAIL** executado; preflight d019 17/17 |
| 82 | âncoras que sobrevivem à W2 (`D019-M1/M2`, `D025-M2/M3/M5/M9/M23`) e à W3a (`D019-M4/M5/M7/M9/M13/M14/M15/M16/M17/M18`, `D023-M2/M6`) | sim | preflights d019 17/17, d025 23/23, d023 12/12 (`ocorrencias == 1` em todas); `var produtos = ofertaDoMotor();` `:893`; `"data-p53-sol-tier": TIER[p.tier] \|\| TIER[2]` `:405` |
| 83 | regra do raio: `D019-CTX1 (a)`, `D025-UNS1`, `D023-REG1`, `D010-*` **não** reancorados; queda em oráculo alheio ⇒ parar | sim | `tests_019_curadoria.js` (só comentários), `tests_025_*`, `tests_023_leitura.js`, `tests_010_vao.js` fora do diff de asserção; d019/d023/d025 verdes; `D019-MED1` PASS (payload M41 `check_m41` PASS) |

## F · Registros

| # | registro | conforme | evidência |
|---|---|---|---|
| 84 | `expected_suites.json → suites.d026` = 3/0, no mesmo PR, depois do green | sim | diff: `cmd node tests_026_contrato.js`, `pass 3`, `fail 0`, `_trilha` com janela vermelha declarada; commit `5a99293` (T044) após `816d605`/`dc5b633` |
| 85 | `mutation_map.json → harnesses.d026` (`cmd`, `preflight: true`, `targets`, `insumos.oraculo`, `populacao`, `requires`) | sim | `targets` = {`tests_026_contrato.js`, `tests_026_mutants.js`, `ui_curation_v32.js`, `ui_p52_support_v32.js`, `ui_p52_support_v32.css`, `ui_curation_edit_v32.js`} ⊇ `arquivos_mutados` ∪ {harness}; `oraculo` = suíte; `populacao` = CSS + editor; `requires` node+python |
| 86 | `mutation-matrix.json`: 6 pares `D026-M*` com `ultima_prova` + dívidas declaradas | sim | 6 pares (M1 → REC1 (a); M2 → PAP1 (a); M3 → REC1 (a)+LEG1 (g); M4 → REC1 (b)+PAP1 (c)+LEG1 (c); M5 → REC1 (j); M6 → LEG1 (b)), todos `KILL` 2026-10-31; 5 dívidas (item 15); `check_tdd`: 207 pares completos |
| 87 | `bridges.json` nota `__CURATION` | sim | item 29 |
| 88 | `regra_morta.json` re-medido para `ui_p52_support_v32.css` (33/205/3 → 52/298/5) | sim | diff: só a folha da 026 e `censo_fonte`/`censo_fixado_em`; as outras sete folhas byte-iguais |
| 89 | `pins.json` — todos os arquivos tocados pinados ou novos; `gen_pins.py` no mesmo PR | sim (com repin de fecho pendente, declarado) | R0 `96369af`, R1 `a02d411`, R2 `102decc`, R3 `3f13100` (E11); `check_baseline` hoje: 9 divergentes + 1 sem pin, **todos** os arquivos tocados depois de `3f13100` (`git diff --stat 3f13100..HEAD` = exatamente esses 10) — E11: *"esperam o repin de fecho"*; `tasks.md` T065 (R7) depende desta T063 |
| 90 | `CONTEXT.md`: quatro verbetes por critério (`Registro de decisão de apoio`, `Hipótese condicionada`, `Veto do motor`, `Linha de produto`) com remissiva a *Habilitador a validar* | sim | `CONTEXT.md:247`, `:261`, `:280`, `:294` (grep em `:247-305`); diff +60 |

## G · O que NÃO muda (spec §O que NÃO muda) — releitura, não só diff vazio (R12)

| # | item | conforme | evidência |
|---|---|---|---|
| 91 | `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json`, `ui_icons_v32.js` | sim | `git diff --stat 9509e4b..HEAD` vazio; `check_m41.py` PASS, payload `9794b267e4225d8f…` == pin (régua D2); INV-1 |
| 92 | `ui_v32.js` (`temProdutoPublicadoV32`, `hasSubstituteV32`, `buildPrintReport`) — `published()` continua a definição lida | sim | diff vazio; `:729-758` relidos: `temProdutoPublicadoV32` lê `__CURATION.published()`; `LEG1 (e)` prova que `hasSubstituteV32` continua verdadeiro com veto |
| 93 | `ui_session_v32.js` (`RESERVED_DERIVED`, `:239-244`, `:548`, `:619-637`) | sim | diff vazio; `LEG1 (f)` + d025 16/16 |
| 94 | `SESSION_SCHEMA_V32.md`, `synthetic_session_examples/*` | sim | diff vazio; `D025-DOC1`/`INV8` verdes (16/16); preflight `D025-M21` ok |
| 95 | `tests_019_mutants.js`, `tests_025_*`, `tests_session_m48.js`, `tests_010_vao.js`, `tests_023_leitura.js`, `tests_p50_core.js` | sim | diff vazio (todos) |
| 96 | `build_v32_html.py` (`CURJS` `:22`) | sim | diff vazio; HTML gerado reconstruído só pelo builder (commits R2/R3) |
| 97 | `decisions` (`{ chave → enum }`), `validate`/`fromSession`/`toSession`/snapshot/commit/rollback | sim | item 27 (byte-iguais); `ENUM` `:96`; d025 16/16 |
| 98 | `TIER` (`:240`) | sim | byte-igual; preflight `D019-M16` ok |
| 99 | textos "indicação prioritária"/"após validação"/`PROV_TXT`/"Formas de apoio, por produto"/"habilitado por sinal declarado:"/os dois textos de `declararSupressao` | sim | `:391`, `:981`, `:1002`, `:691-696` (`declararSupressao` byte-igual); nenhuma linha removida do diff toca esses literais (grep) |
| 100 | `gateFechado()` e o handler do editor | sim | item 66 |
| 101 | `paraSessao`; `decide()/published()/contract()/offered()` — assinaturas | sim | item 27/28; `contract()` só ganhou dois campos |
| 102 | `acrescimos()` (`:570-583` → `:653-666`), `prodLegadoDe`, `chipDoGrupo`, `fronteira`, `colocar` | sim | corpos byte-iguais (script) |

## H · Cross-check (spec §Cross-check)

| # | item | conforme | evidência |
|---|---|---|---|
| 103 | INV-1..INV-10: zero toque no engine; UNSET ≠ ausência (D-6); gate fechado sem veto; nada de score/target/refinamento; `reconciliar` pura; `decisions` enum; `data-*` nunca lido de volta; só classes `produto`/`generated`; enums PT-BR sem acento | sim | itens 8, 33, 32, 22, 17, 91; `FORCA_ACAO`/`FORCA_CONDICAO` `:114-115` sem acento; `D022-INV1` (d022 14/14) |
| 104 | `design-decisions.md`: `:15` (lista × visão por solução), `:17` (card de prioridade), `:18` (supressão total) preservadas; cláusulas defensivas novas declaradas sem mutante | sim | veto ≠ supressão (item 60, 62); `businessPriority` não lido (grep em `ui_curation_v32.js` = 0); sonda C2/C4 `legadoVisivel 0`; R13 citado em `:117` do owner |
| 105 | specs anteriores 010/019/022/023/024/025/015/009 — nenhuma contradição | sim | d019 14/14 · d022 14/14 · d023 9/9 · d025 16/16 executados; `REC1 (e)` (022 E2); `LEG1 (d)` (023 E4); `PRODUCTS` com 13 chaves (019: não ampliado, `REC1 (g)`) |
| 106 | REV B (`PHASE_5_0_REV_B.md`, SHA `4f1583c7…`) — §29.4 intocado, UI-045/UI-046, print pipeline não tocado | sim | `ui_v32.js`, `ui_ux_v32.js`, `ui_session_v32.js`, `tests_visual/`, schema: diff vazio; hook `printHTML` existente (item 78); `tests_p50_core.js` fora do diff |
| 107 | Boundary R6 — `boundary.json` `frozen/generated/legacy/registry`; `PROTECTED`/`frozenSuites` de `tests_p50_core.js`; pins | sim | item 91/95; HTML gerado só por builder; `pins.json` só via `gen_pins.py` (commits `chore(026): gen_pins`); classe mais alta tocada `produto` + `generated` |
| 108 | R9: nenhum módulo/bridge novo; contrato só por bridge; nenhum monkey-patch/patch-point; owner `ui_curation_v32.js`; CSS só `p53-*`, sem hex; orçamento (E9: 597/1105, declarado); `temVoz` helper único; `innerHTML =` 0 | sim | `lint-arch` 0 problema(s); diff CSS: só seletores `p53-*` (fora deles apenas `@media`), 0 hex, só `var(--…)`; `innerHTML *=` = 0 nos três módulos; `registerDecor` inalterado `:1077-1079`; E9 registra os números medidos (`wc -l` = 597 / 1105 / 291, confere) |
| 109 | R10: positivo/negativo/adversarial/regressão; oráculos independentes; contagens no registro; namespace `D026-*` em arquivo próprio; nenhum gate spawna suíte; `vac()`; sem hash inline; não escreve na árvore | sim | itens 9–16; `tests_026_contrato.js` não invoca outra suíte (grep `execSync|spawn` = só no harness) |
| 110 | R3: gates antes do plano; red commitado; implementadores com gate por id; tipagem no `tasks.md`; mutante por gate; dívidas declaradas | sim | `7678222` < `6ace994` (W2); `check_tdd` OK; item 14/15 |

## I · Fora de escopo (spec §Fora de escopo)

| # | item | conforme | evidência |
|---|---|---|---|
| 111 | lacuna do engine (`sup.caps` no ramo CNI; `violated` e serviço inelegível descartados em silêncio) — achado novo no backlog | sim | `.claude/BACKLOG.md:11379` **`EA-122`** (`buildRecommendationContext()` aplica `suppressedByPlatform()` em três ramos e não no `CONTEXT_NOT_INFORMED`; descarta em silêncio…); `EA-76` resolvido (`:7185`) |
| 112 | `exclude` obsoleto sem sujeito — achado de backlog | sim | `.claude/BACKLOG.md:11501` **`EA-123`** |
| 113 | `ui_v32.js` (cláusula de veto-como-substituto), `chave:null` (Porta B em `PRODUCTS`), serviços sem linha/`fortixdr` como card, `[data-pr-gap-support]`, memoização, condições do acréscimo, mutante da constante/porta de suficiência, QS-03..QS-12, deploy — não tocados | sim | `ui_v32.js` diff vazio; `PRODUCTS` 13 chaves; `D021-*`/`P51-REC1` fora do diff; sem cache em `derivar()`; `cardAcrescentado` sem condição |

## J · Erratas E1–E12 — cada uma conferida contra o fonte

| # | errata | conforme | leitura |
|---|---|---|---|
| 114 | E1 `entradaViva()` traz `solucoes` | sim | `:191-194`; lido em `:211`/`:232` |
| 115 | E2 veto ganha `notas[]` | sim | `:242` (`notas: ctx.notes.slice()`); `declararVetos:745-751` emite todas; sonda C3b `notas 2` |
| 116 | E3 "sinal requerido ausente" é abstenção | sim | `:310-311`; sem alínea/mutante (dívida declarada na errata) |
| 117 | E4 laço por sinal roda sob suficiência fechada | sim | `:340` só `!entrada.legado`; `:329-330` corta só as linhas do mapa |
| 118 | E5 `veto.itemId` = primeira oferta relacionada não-família / `serviceId` | sim | `:258` (`alvo`), `:312-313`, `:315`; sonda C2 `itemId fortiendpoint`, C7 MDR `fortiguard-mdr` |
| 119 | E6 `__P50SUFF` ausente ⇒ `suficiente = false` | sim | `:197-198` (`suf === true`) |
| 120 | E7 entrada nula ⇒ `coletar(true)` + `console.error` | sim | `:412-418`, `:176` (`soMapa` só exige a Camada 1) |
| 121 | E8 `ACAO_TXT` começa por "Ação sugerida:" | sim | `:279-284` (6/6); `VETO_TXT.extensao` `:297` "Extensão contextual sobre a base declarada: " |
| 122 | E9 orçamentos medidos (597 / 1105 / 291 / +8) | sim | `wc -l` neste HEAD: 597 · 1105 · 291 · 286 (editor; diff +8) — confere; `lint-arch` 0 |
| 123 | E10 preflight d023 = 12 | sim | preflight d023 executado: 12/12 |
| 124 | E11 repins consolidados R0–R3; repin de fecho cobre o que vier depois de `3f13100` | sim | `git log`: `96369af`, `a02d411`, `102decc`, `3f13100`; `check_baseline` acusa exatamente os 10 arquivos pós-`3f13100` (item 89) |
| 125 | E12 `D026-M5` reancorado em `REC1 (j)` com fixture C4-DL; nenhuma alínea afrouxada; contagem 3 gates | sim | `tests_026_contrato.js:164` (C4-DL), `:740-772` ((j)); `tests_026_mutants.js:150-153`; matriz M5 `KILL` em (j); spec C3 com texto original riscado (R2 §5); suíte continua 3 gates (3/3) |

## Observações — declaradas, não contadas como gap

- **Helper de corpo** (item 55): `corpoDoMotor(p)` da §Tela não existe por esse nome; `corpoDoCatalogo(id, nome, escopo)` cobre os dois ramos com a saída de DOM especificada. Nome de função privada da apresentação, sem gate/bridge/registro que o leia.
- **Dívidas das erratas E3/E5/E7** ("sem alínea nem mutante próprio") e as duas de §Cross-check R3 (`apoio-contextual`; `tipo:"servico"` do `FortiGuard-Service-Bundle` pela §2.4) estão declaradas **na spec**, não em `mutation-matrix.json → dividas_declaradas` (lá vivem só as cinco do item 15). A spec não diz "na matriz" para elas — sem exigência violada; fica aqui como achado para o `product-owner`/`qa-engineer` decidirem se migram (precedente 025: dívida citada tem de existir onde se diz que está).
- **`tipoDaLinha("FortiGuard-Service-Bundle") === "servico"`** é exercido em legado (sonda C5, `REG … servico hipotese`) e em `REC1 (g)` (pré-imagem com id de `SERVICES`); o que fica sem fixture é só o caminho §2.4 fora do legado.
- **`data-p52-support-cards`** conta também o `.apoio-block` congelado oculto (sonda C1: "2" com 1 card) — comportamento da 019/EA-65, fora do diff; não é da 026.
- **`montarEntrada`** da suíte (`:421-442`) não carrega `solucoes` (E1): `LEG1 (f)` mede pureza/idempotência com entrada literal sem `existente[]`; o campo é exercido pelas alíneas de DOM (REC1 (b)(d)). Não é lacuna de spec — a alínea mede o que promete.
- **Pares `D022-M*` não vivem em `mutation-matrix.json → pares`** (grep `D022` = 1 ocorrência, em prosa) — estado pré-existente da 022, não da 026; a prova da reancoragem é o preflight (executado) e a campanha (registrada em `3560ba6`).
- **planning-state** `phase: "implement"` — a Fase 6 é esta validação; o avanço de fase é do orquestrador (T068).

## Fora do denominador — declarado, não é gap

- **Repin de fecho** (E11; `tasks.md` T065 "fecha T063"): `check_baseline` em `8ad6621` ⇒ `638/647 · 9 divergentes · 0 ausentes · 1 sem pin` — os 9 + 1 são **exatamente** `git diff --stat 3f13100..HEAD` (W4b `993e371`, `fc5874f`, W6 `8ad6621` e este `spec-validate.md` quando entrar). Previsto pelo plano; `build-engineer`.
- **Campanhas de mutação** (`node tests_026_mutants.js`, `d022`, stage `mutation`, `run.sh` completo): **não executadas** por este validador — a delegação as proíbe (mutam in place; memória "campanhas de mutação não são paralelizáveis"); o que se executou foram os **preflights** (5 harnesses, todas as âncoras `ocorrencias == 1`). Última prova registrada: d026 6 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO (W4b, matriz `ultima_prova` 2026-10-31); d022 13 DETECTADO (`3560ba6`). A canônica é o CI do PR.
- **Job `visual`** (Chromium; `P52-RES4`, `U15 (E)` citados na E8): fora desta máquina (KI-3); `p52layout 45/45` em `816d605` é relato do implementador, não conferido aqui.
- **`compliance-audit.sh`** e `run.sh --light`: não executados (verificação proporcional; nada do que a 026 muda entra nas regras do audit além de `bridges.json`, que `lint-arch` já cobriu).

## Veredito

**98,4 % (123/125) — abaixo de 100 %: classificado e devolvido ao orquestrador para
UMA iteração de correção**, que aqui é **só de spec**: G1 e G2 são `spec-errada` e se
resolvem por errata aditiva com decisão do usuário (E13 e E14 pelo molde de E1–E12),
**sem** tocar gate, mutante, registro ou código (R10 §1). Nenhum item de produto,
contrato, reancoragem, registro executável ou "o que não muda" diverge do especificado;
a suíte `d026` fecha 3/3 e as quatro suítes vizinhas fecham verdes neste HEAD. Depois da
errata, a iteração 2 confere só os itens 24 e 64 contra o texto novo; o repin de fecho
(T065/T067) e o relatório (T066) seguem a ordem do plano.

## Iteração 2 (2026-10-31) — única; só os itens que as erratas E13–E15 tocam

> Executor: `qa-engineer` (Fable 5.1). Partida **`5d9bdff`** (`test(026): F6 — green da alinea (c), registros e red-026 (segunda janela)`), árvore limpa; desde `8ad6621` entraram `0bdfcfe` (iteração 1), `6122bb7` (red F6, 2/3), `860735a` (green F6), `8e696d1` (erratas E13/E14/E15) e `5d9bdff`. Nada do que a iteração 1 conferiu foi reaberto além dos itens que a F6 e as erratas alcançam: **24, 64** (G1/G2 → spec emendada), **4, 34, 52** (constante C3 / §2.6 / `LEG1 (c)`) e as citações de linha que a F6 deslocou (+4 linhas em `ui_curation_v32.js` a partir de `:108`).

**Score final: 125 de 125 itens conformes · 100 %.** Denominador **mantido em 125**, declarado: E13 e E14 são a correção de G1/G2 — não são exigências novas — e foram conferidas dentro dos itens 24 e 64; E15 reancora a alínea `LEG1 (c)` já contada nos itens 4/52 (uma asserção mais exigente, nenhuma afrouxada; red `6122bb7` 2/3 commitado **antes** do green `860735a`). Classes de gap: 0.

Executado em `5d9bdff`: `node tests_026_contrato.js` ⇒ **`D026 CONTRATO: 3 PASS · 0 FAIL de 3`** (exit 0; `026-specval-it2-suite.log`); `node tests_026_mutants.js --preflight` ⇒ **6/6 `ocorrencias == 1`** (as âncoras deslocaram de linha, não de forma); sonda `anexos/sonda-leitura.js` em C3 ⇒ tela `FortiSOAR · validacao · "após validação"` com texto *"Hipótese do mapa: a plataforma declarada cobre esta capability; validar no aprofundamento."*, papel idem (`tierAttr validacao`, `temAposValidacao true`), `consoleErrors []`; sonda própria do validador em C3 e C3b (`026-specval-it2-probe-C3*.log`): C3 registro `hipotese · tier 2 · condicao plataforma-declarada-cobre`, `offered/published = [FortiSOAR]`, zero veto, `[data-p53-suprimido]` ausente, `legadoVisivel 0`, `pr-card` com `data-p53-sol-condicao="plataforma-declarada-cobre"` e `.p53-pr-condicao` igual à tela; **C3b inalterado** (zero card, veto `operacional` com 2 notas, `data-p53-vetos="1"` em tela e papel). `git diff --stat 8ad6621..HEAD -- ui_v32.js ui_p52_support_v32.js ui_p52_support_v32.css ui_curation_edit_v32.js engine_v32.js` = **vazio**: a F6 é uma linha de produto (`ui_curation_v32.js:115`) + comentário (`:105-113`) + HTML reconstruído pelo builder.

| item | conforme | evidência (executada/lida em `5d9bdff`) |
|---|---|---|
| **24** · `temVoz` — trilha "nos dois lados" × `ui_v32.js` intocado (G1) | **sim** | **E13** (`8e696d1`, aditiva): a trilha é **unilateral**, vive em `ui_curation_v32.js` (agora **`:126-128`**: *"espelha a cláusula de `hasSubstituteV32` (ui_v32.js:750-752)"*, função `:129-132`); `ui_v32.js` permanece sem comentário `[026]` e **fora do diff** (base `9509e4b` → `5d9bdff`); as duas células originais ficam riscadas pela errata (R2 §5). Nenhum gate, registro ou código mudou para fechar o gap |
| **64** · literais de apresentação só em `ui_p52_support_v32.js` × três literais de `motivo` no owner (G2) | **sim** | **E14** (`8e696d1`, aditiva): a Regra de ouro ganha a exceção — literais de **motivo** moram no owner quando o engine não emite nota; são exatamente `SEM_NOTA_VALIDAR`, `SEM_CANDIDATO`, `ARQ_VIOLADA`, agora em **`:121-124`** (comentário `:121`, literais `:122-124`; eram `:117-120`), e os rótulos `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` continuam só em `ui_p52_support_v32.js:278-302` (fora do diff). Dívida declarada na errata (sem gate que os pine — cláusulas defensivas, R13) |
| **4** · C4 — `LEG1 (c)` C3 | **sim** | **E15** (divergência declarada, O-1 do PO): a célula C4 da §Critérios traz o texto antigo riscado e o novo — *"C3 pina a constante em `true`: card `FortiSOAR` `condicao="plataforma-declarada-cobre"`, `data-p53-sol-tier="validacao"`, condição visível em tela e papel, `published()` não vazio, zero veto"*; `tests_026_contrato.js` (c) reancorada em `6122bb7` (asserções novas: condição, tier `validacao`, `acao=hipotese`, `.p53-sol-condicao` não vazio, `published()` não vazio, `pr-card` com condição/tier/`.p53-pr-tier` "após validação"/`.p53-pr-condicao` igual à tela, sem `.p53-pr-vetos`); red **2 PASS · 1 FAIL de 3** (`red-026.md:240-249`) com a constante `false` → green **3/3** em `860735a` (`:261-270`) — reexecutado aqui 3/3. C3b (veto M75) **não muda** (sonda) |
| **34** · `CONTEXT_NOT_INFORMED` com constante `true` e `supressao.caps ∋ capId` ⇒ `plataforma-declarada-cobre` tier 2, nunca veto | **sim** | ramo agora **vivo** (`ui_curation_v32.js:256`, era `:252`): sonda C3 confirma `tier 2`, zero veto; `CONDICAO_TXT["plataforma-declarada-cobre"]` `ui_p52_support_v32.js:291` é o texto visto em tela e papel |
| **52** · constante C3 — §2.6 | **sim** | `ui_curation_v32.js:115` **`= true`** (era `:111 = false`), comentário D-3 reescrito em `:105-113` (nomeia O-1, EA-122); §2.6 da spec com o título e o parágrafo (a) riscados e o (b) como vigente; §Cobertura linha C3 corrigida (*"após validação (tier 2) · `condicao=plataforma-declarada-cobre` visível em tela e papel; zero veto"*); `mutation-matrix.json → dividas_declaradas` "CONSTANTE C3" reescrita para *"PINADA EM TRUE … 6122bb7 red 2/3 → 860735a green 3/3"*; `expected_suites.json`/`mutation_map.json` `_trilha` com a segunda janela; `d026` continua 3/0. Sem mutante próprio (dívida mantida — diretriz de 2026-09-13) |

**Citações de linha deslocadas pela F6 (`ui_curation_v32.js`, +4 a partir de `:108`)** — a leitura da iteração 1 vale com o deslocamento: `:111`→**`:115`** (constante), `:112`→`:116`, `:114-116`→`:118-120`, `:117-120`→**`:121-124`**, `:122-128`→**`:126-132`** (`temVoz`), `:133-168`→`:137-172` (pareamento), `:173-202`→`:177-206` (`coletar`/`entradaViva`), `:207-409`→**`:211-413`** (`reconciliar`; `:252`→`:256`, `:255`→`:259`, `:309`→`:313`, `:311`→`:315`, `:348`→`:352` âncora `D022-M10`, `:404`→**`:408`** âncora `D026-M5`), `:412-418`→`:416-422` (`derivar`), `:422-426`→`:426-430`, `:539-596`→`:543-600` (bridge; `oferta`/`vetos`/`reconcile` `:554-556`, `contract` `:588-599`). Conferido por `grep -n` e pelo preflight d026 6/6 (M1 `:131`, M3 `:145`, M5 `:408`, M6 `:313`); `ui_p52_support_v32.js` não moveu.

**Fora do denominador, como na iteração 1**: repin de fecho — `check_baseline` em `5d9bdff` ⇒ `634/647 · 13 divergentes · 0 ausentes · 2 sem pin` (os 13 + 2 são exatamente os arquivos tocados desde `3f13100`, incluindo este `spec-validate.md` e o `relatorio-final.md`; T065/T067, `build-engineer`); campanhas de mutação não reexecutadas (preflight 6/6 executado; a constante não tem carrasco — declarado); job `visual`; `run.sh`/`compliance-audit.sh`. Ratificação literal de D-1..D-9 e da inversão de D-3 (E15) é do usuário no PR (T069) — nenhuma linha deste arquivo afirma aprovação.

**Veredito: 100 % (125/125) — segue para o aceite de intenção do `product-owner` (T064 — reexecução sobre o HTML de `5d9bdff`, já que a O-1 foi atendida) e para o relatório final (T066); "pronto" continua sendo o CI verde no PR (T068/T069).**
