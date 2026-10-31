# Plano — 026-decisao-unica-do-apoio

> Fase 2 · dono: tech-lead · consome a spec (portão da Fase 1 **pendente** — aprovação literal do usuário no chat, R4).
>
> **Quem escreveu**: o `tech-lead`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-10-31, sob delegação do orquestrador, na branch
> `feature/026-decisao-unica-do-apoio` (base `develop @ 9509e4b` conforme a
> delegação; `pins.json` gerado de `8c1617e…` em 2026-10-31). Só leitura:
> nenhum comando além de `sed`/`grep`/`python` para ler JSON e medir o SHA-256
> da REV B; nada executado, mutado, commitado ou repinado. O desenho é
> [`anexos/desenho-sintese.md`](anexos/desenho-sintese.md) (fonte de verdade da
> fase); a [spec.md](spec.md) fixou critérios, gates, mutantes e contratos.
> Este plano **não reabre** nada disso — fixa camada, donos, ordem, registros,
> custo e os pontos de parada.
>
> **Portão da Fase 1** (spec): **pendente** — aprovação literal do usuário no
> chat (R4). Decisões D-1..D-9: *decididas pelo orquestrador sob a instrução do
> proprietário de 2026-10-31 (prompt da microfase 01); ratificação literal
> pendente no PR*.

## Desenho

### A decisão central (desenho §0, §1): uma derivação, três consumidores

"O que o motor ofereceu nesta sessão" existe hoje **duas vezes**
(`EA-76`): `ofertados()` em `ui_curation_v32.js:96-152` (porteiro: `decide()`
devolve `exclude` para o que não está em `offered()`) e `ofertaDoMotor()` em
`ui_p52_support_v32.js:247-346` (coletor dos cards). As duas derivam de
`computeFindings()+MAP` e só a segunda passagem olha
`buildRecommendationContext()` — e só para o habilitado por sinal. Nenhuma
reconcilia veto, variante, elegibilidade ou nota do motor (QS-01); o papel
copia o card sem o tier (QS-02).

A derivação passa a viver **uma vez**, no **dono do estado**
(`ui_curation_v32.js`, `core-engineer`, bridge `__CURATION`), como
`reconciliar(entrada) → { registros[], vetos[] }` — função **pura** de
`entradaViva()` (Camada 1 + motor público + catálogo). `ofertados()` vira leitor
(`registros` publicáveis com `chave !== null` → chaves); `oferta()`, `vetos()` e
`reconcile(entrada)` entram no bridge. `ui_p52_support_v32.js` (**ui-engineer**)
**perde** a derivação: `ofertaDoMotor()` vira leitor de `oferta()` (o nome e o
literal `var produtos = ofertaDoMotor();` `:721` ficam — âncora `D019-M15`);
ganha os atributos novos no card, o bloco de vetos, as linhas de variante/ação/
condição/elegibilidade/escopo e o papel que copia tudo isso. O editor
(`ui_curation_edit_v32.js`, **ui-engineer**, delegação própria) ganha só
"apresentado como <variante>" (D-9).

Por que B e não A/C (desenho §0, placar 3×0 dos juízes, `anexos/objecoes-dos-juizes.json`):
A deixava duas cópias discordando por desenho e pinava a divergência como
comportamento — falha o aceite literal do QS-01; C é o mais limpo, mas paga
módulo + builder + marcador + `bridges.json` + 3 harnesses + 7 gates/8
mutantes + 3 reancoragens contra as diretrizes de 2026-09-11/13 (rota mais
barata; produto antes de instrumento; não criar gate/mutante sem pedido). As
melhores ideias de C entraram como enxertos (E1..E17 do desenho §0.1).

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
   cards ← registros · vetos ← vetos()               (D-9: subtítulo da variante lido de oferta())
   papelHTML() ← cards da tela (D019-PAR1)
            │
            ▼
   buildPrintReport() (ui_v32.js:1566) ← __P53SOL.printHTML()   — inalterado
```

### Módulos tocados — um dono por módulo

| Módulo | Dono | O quê (spec §Contratos, §Comportamento) | Linhas (estimativa) |
|---|---|---|---|
| `ui_curation_v32.js` | `core-engineer` | cabeçalho (+15); `chaveDe`/`idsDaLinha`/`tipoDaLinha`/`temVoz`/`capDaPergunta` (≈45); `entradaViva()` (≈35); `reconciliar(entrada)` + `veredictoDeServico` + fusão por chave (≈120, com a linha-âncora do `D022-M10` **verbatim** no laço por sinal); `ofertados()` `:96-152` vira leitor (−50 +6); constante `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false` (1); bridge `oferta`/`vetos`/`reconcile` + `contract()` (+6). `valido`/`decidir`/`publicados`/`validar`/`daSessao`/`paraSessao`/`unset`: **0** | 316 → ≈ 495 |
| `ui_p52_support_v32.js` | `ui-engineer` (delegação A) | `ofertaDoMotor()` `:247-346` vira leitor (−95 +12; comentário `:317-323` reescrito); `cardDoProduto` `:383-472`: atributos novos + `h4 = p.titulo` + linhas `.p53-sol-variante/-acao/-condicao/-elig` (+32); `corpoDoMotor(p)` (+15) e `corpoDoCatalogo(id, nome, escopo)` (+6); `cardAcrescentado` (+2); `decorar` `:721` + `:740-741` + ramo `else` `:749-762` (+8); `declararVetos` (+35); `papelHTML` `:794-834` (+30); `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` (+22) | 872 → ≈ 940 (justificativa em *Checklist R9*) |
| `ui_p52_support_v32.css` | `ui-engineer` (mesma delegação A) | `.p53-sol-variante`, `-acao`, `-condicao`, `-elig`, `-escopo`, `-vetos`, `-veto`, `.p53-pr-*` (papel reaproveita `.pr-mut`) — só `p53-*`, sem hex, cor nunca como único portador | 220 → ≈ 255 |
| `ui_curation_edit_v32.js` | `ui-engineer` (delegação B, D-9) | `linhaProduto` `:78-105`: `span.p53-cur-item-var` "apresentado como <titulo>" lido de `b.oferta()`; `data-p53-cur-item`/`.p53-cur-item-nome` continuam a linha | 278 → ≈ 286 |
| `tests_026_contrato.js` (novo) | `qa-engineer` | 3 gates (spec §Critérios); fixtures C1/C2/C3/C3b/C4/C5/C6/C7/C7-UNSET/C8/C9/C10/F2-placeholder/GF | ≈ 340 |
| `tests_026_mutants.js` (novo) | `qa-engineer` | `D026-M1..M6`, runner no padrão `tests_025_mutants.js` | ≈ 120 |
| `tests_022_mutants.js` | `qa-engineer` | `D022-M10` → `F.estado` (mapa `F` `:45-49` + `file` `:109` + `precisaBuild` `:241`) | 4 |
| `tests_019_curadoria.js` | `qa-engineer` | comentário-trilha E13 em `D019-SOL1`/`SOL3 (b)`/`MED1` — asserções byte-iguais | ≈ 6 (comentário) |
| `.claude/verify/expected_suites.json` · `mutation_map.json` · `mutation-matrix.json` | `qa-engineer` | `d026`; d022 (`insumos.populacao` de `ui_curation_v32.js` reavaliada) | ≈ 50 |
| `.claude/verify/bridges.json` · `pins.json` · HTML gerado | `build-engineer` | nota do `__CURATION`; `gen_pins.py` por commit de conteúdo; builder **sem mudança** (`build_v32_html.py:22,26,27,33` já injetam os quatro arquivos) | gerados + ≈ 3 |
| `CONTEXT.md` · `refinement.md` · `.claude/BACKLOG.md` · `design-decisions.md` · `relatorio-final.md` · `spec-validate.md` | `product-owner` / `doc-writer` / `qa-engineer` | verbetes (W0); `EA-76` → `resolvido`; achado novo (lacuna do engine C3); D-1/D-2/D-7 confirmadas após ratificação | doc |
| `engine_v32.js` · Camada 1 · `ui_v32.js` · `ui_session_v32.js` · `SESSION_SCHEMA_V32.md` · `synthetic_session_examples/*` · `tests_019_mutants.js` · `tests_025_*` · `build_v32_html.py` · `tests_visual/*` | — | **0** | 0 |

### Owner do estado — para cada dado novo (R9 §5)

| Dado | Owner | Natureza | Consumidores | Serializa? |
|---|---|---|---|---|
| registro de decisão de apoio (`oferta()`) | `ui_curation_v32.js` (`__CURATION`) | **derivado**, recomputado por chamada, sem cache | `__P53SOL` (cards, papel), `__P53CUR` (subtítulo D-9), gates | **nunca** (INV-8; `toSession()` `:199-204` intacto) |
| veto do motor (`vetos()`) | idem | derivado | `__P53SOL` (bloco de vetos, papel), gates | nunca |
| `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA` | idem | constante, `false` | `reconciliar()` | — |
| `LINHA_DA_FAMILIA_DE_SERVICO` | idem | constante declarada (regra 4 do pareamento) | `chaveDe` | — |
| `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` | `ui_p52_support_v32.js` | rótulos de apresentação | card e papel | — |
| atributos `data-p53-sol-*` novos, `[data-p53-vetos]` | `ui_p52_support_v32.js` (escreve) | DOM derivado do registro | papel (cópia), gates — **ninguém** os lê como canal de decisão (R9 §3) | — |
| `decisions`/`architectureNote` | `__CURATION` | **entrada canônica** — inalterada | — | sim, como hoje |

### Ordem de injeção — conferida, e por que não muda

`build_v32_html.py:83`: … `V32_P50_RESULTS` → **`V32_CURATION`** (`curjs`,
`:22`) → `V32_P52_WORKSPACE` → `V32_D011` → `V32_ONDAS` → **`V32_P53_SUPPORT`**
(`:26`) → **`V32_P53_CURATION_EDIT`** (`:27`); CSS `:92` com `P53SOLCSS`
(`:33`). O dono do estado é instalado **antes** dos dois consumidores; os
consumidores só leem o bridge dentro de decoradores registrados por
`__P50.registerDecor` (`ui_p52_support_v32.js:844-846`), executados no render —
nenhuma leitura em tempo de instalação. Nada a mudar no builder; o stage
`build` prova identidade em diretório efêmero (R7 §3).

## Contratos e registros

### Bridge `__CURATION` — acréscimos (owner `ui_curation_v32.js`)

Texto completo na spec §Contratos. Resumo operacional para a W2:

```
oferta()            → registro[]            reconciliar(entradaViva()).registros
vetos()             → veto[]                reconciliar(entradaViva()).vetos
reconcile(entrada)  → { registros, vetos }  PURA; `entrada` no shape de entradaViva()
contract()          → + { oferta, vetos }   os cinco campos de hoje byte-iguais
offered()           → chave[]               leitor; assinatura inalterada
```

Precedências fixadas (a spec as lista; o gate precisa delas em ordem):
`acao` — `avaliar-aquisicao` > `modalidade-a-definir` > `servico` >
`apoio-contextual` > `conversa-por-sinal` > `hipotese`; `condicao` —
`sem-contexto` > `capability-nao-informada` > `contexto-a-validar` >
`fora-do-catalogo-contextual` > `plataforma-declarada-cobre`; `tier` da fusão =
mínimo entre fontes que produzem card. Chave de fusão: `chave || itemId`,
**nunca** nome exibido. Portas de saída em ordem: `entradaViva() === null` →
`legado` → `suficiente === false`.

**Contrato de instrumentabilidade** (herdado da 025): bridge = objeto literal
gravável (não `Object.freeze`), `__installed` como hoje; consumidores chamam
`window.__CURATION.<m>(...)` por propriedade **no momento da chamada**.

**Restrições de âncora na W2** (preflight antes e depois — E14): as linhas de
`D019-M1` (`:157`), `D019-M2` (`:164`), `D025-M2` (`:255-256`), `D025-M3`
(`:219`), `D025-M23` (`:227`), `D025-M5` (`:254`), `D025-M9` (`:257`) ficam
byte-iguais e **únicas**; a linha-âncora do `D022-M10` (`            if (capNome
&& reg2.caps.indexOf(capNome) < 0) reg2.caps.push(capNome);`) passa a existir
**uma** vez neste arquivo (e zero vezes em `ui_p52_support_v32.js` depois da
W3a). Nomes `reg2`/`capNome`/`caps` são contrato de âncora, não estilo.

### `ui_p52_support_v32.js` — onde cada linha entra (W3a)

| Função | Mudança exata | Preservar byte a byte |
|---|---|---|
| `ofertaDoMotor()` `:247-346` | corpo substituído por leitura de `window.__CURATION.oferta()` sob `curadoria()`; devolve a lista de registros (campo `prod: null` acrescentado para `prodLegadoDe`); comentário `:317-323` reescrito; `catch` nomeando como `:338-344` | `var produtos = ofertaDoMotor();` (`:721`, `D019-M15`); `if (decisaoDe(produtos[i].nome) !== "exclude") cards.push(cardDoProduto(produtos[i]));` (`:733`, `D019-M5`) |
| `cardDoProduto(p)` `:383-472` | atributos novos; `h4` = `p.titulo`; linhas `.p53-sol-variante/-acao/-condicao/-elig`; `corpoDoMotor(p)` quando `!p.prod` e `p.modo === "motor"`; `corpoDoCatalogo(id, nome, escopo)` ganha `.scope.p53-sol-escopo` | `"data-p53-sol-tier": TIER[p.tier] \|\| TIER[2]` (`:394`, `D019-M16`); `nomeDuplicado.parentNode.removeChild(nomeDuplicado);` (`:451`, `D019-M13`); `linha.appendChild(tile);` (`:559`, `D019-M14`); `"data-p53-sol-grupo-nome": grupo` (`D019-M7`) |
| `declararVetos(sec, vetos)` (nova) | `div.p53-sol-vetos[data-p53-vetos=N][role=note]` depois dos cards, antes do botão do editor; `li[data-p53-veto-item][data-p53-veto-classe]`; idempotente (remoção + inserção) nos dois ramos de `decorar()` | nunca `.apoio-block`; nunca `data-p53-suprimido` (`"data-p53-suprimido": String(suprimidos)` de `declararSupressao` é `D019-M9`) |
| `decorar()` `:683-773` | `:721-734` inalterados; após `declararSupressao` chama `declararVetos`; ramo `else` `:744-762` idem | `var arbitrando = arbitragemEmCurso();` (`D019-M17`); `if (arbitrando && cards.length) sec.appendChild(fronteira());` (`D019-M18`/`D023-M2`); contador `:768-769` |
| `cardAcrescentado(id)` `:517-546` | + `data-p53-sol-origem="operador"`, `data-p53-sol-acao="hipotese"` | `[data-p53-prov]` + `PROV_TXT` |
| `papelHTML()` `:794-834` | guarda `:799` → `if (!cards.length && !aviso && !vetos) return "";`; `pr-card` copia os atributos novos; `<b>` lê `txt(h4)`; `.p53-pr-tier/-variante/-acao/-condicao/-elig/-escopo`; bloco `.p53-pr-vetos[data-p53-vetos]` ao fim da seção | `:801-802` (`D023-M6`); `'<div class="pr-mut" data-p53-prov="operador">'` (`:820`, `D019-M4`); `:815`, `:821-831` |
| `ACAO_TXT`/`CONDICAO_TXT`/`VETO_TXT` (novas) | literais fixados **depois** de `grep` em `tests_*.js` e conferência contra `P52_COPY` (`ui_p52_workspace_v32.js:128-236`) | "indicação prioritária"/"após validação" (`:380`), "Formas de apoio, por produto" (`:800`) |

### `ui_curation_edit_v32.js` — D-9 (W3b)

`linhaProduto(b, id, ofertado)` `:78-105`: depois de `.p53-cur-item-nome`, se
`ofertado` e `b.oferta` existir, `reg = oferta().find(r => r.chave === id)`;
quando `reg && reg.titulo !== reg.nome`, `span.p53-cur-item-var` =
"apresentado como " + `reg.titulo`. `gateFechado()` `:62-65` (`D019-M10`),
handler `:86-93` (tabela fechada da 025), `decorar()` `:218` e a lista de
acréscimos `:200-208` **não mudam**. Sem CSS novo (reaproveita `.p53-cur-item-grp`
ou uma regra em `ui_p52_support_v32.css` — decisão do ui-engineer A, que é o
dono do CSS; B não escreve CSS).

### Patch-points

**Nenhum.** Nenhum monkey-patch, nenhum wrapper de `render`, nenhum
`MutationObserver` novo, nenhum decorator novo: `__P53SOL` já é decorador
registrado (`registerDecor`, `ui_p52_support_v32.js:844-846`); `__P53CUR` idem.
O bridge ganha métodos, não ganchos.

### `bridges.json` — sem bridge novo; uma nota (W5, `build-engineer`)

```
"__CURATION": "estado de curadoria do relatorio (demanda 019) … [025] … [026] oferta()/vetos()/reconcile(entrada):
               a oferta por produto nasce UMA vez aqui (registro de decisao de apoio + vetos com razao literal do
               motor), reconciliando computeFindings()+MAP com buildRecommendationContext(); reconcile e PURO
               (dado → dado), o registro e DERIVADO e nunca serializado (INV-8); __P53SOL e __P53CUR consomem,
               nunca escrevem (R9 §5). Veto so onde o motor tem voz (temVoz espelha hasSubstituteV32,
               ui_v32.js:750-752)."
```

`__P53SOL`/`__P53CUR`: notas intactas (shape fechado `{ __installed, diag(),
printHTML, grupos, grupoDe }` continua; nada novo exposto).

### Pins — arquivos pinados que mudam (repin no mesmo PR, **sempre em commit separado**)

Produto: `ui_curation_v32.js`, `ui_p52_support_v32.js`, `ui_p52_support_v32.css`,
`ui_curation_edit_v32.js`, `quickscan_secops_soccmm_v3_2_dev.html`. Gates:
`tests_022_mutants.js`, `tests_019_curadoria.js`. Novos: `tests_026_contrato.js`,
`tests_026_mutants.js`. Registros: `bridges.json`, `expected_suites.json`,
`mutation_map.json`, `mutation-matrix.json`. Docs: `CONTEXT.md`,
`.claude/BACKLOG.md`, `.claude/rules/design-decisions.md`,
`specs/026-decisao-unica-do-apoio/*` (anexos + refinement + spec + plan + tasks +
red + spec-validate + relatorio-final — **sem pin hoje**: grep `specs/026` em
`pins.json` = 0).

**Série de repins** (`gen_pins.py:71-79` recusa árvore suja — toda wave com
repin é **serial**; `[P]` só sobra entre tarefas em que ninguém escreve arquivo
rastreado ou em worktrees distintas):

| R | depois do commit de | dono |
|---|---|---|
| R0 | `refinement.md` + `CONTEXT.md` + `spec.md` + `plan.md` + `tasks.md` (portões F0–F3) — fecha também os anexos | `build-engineer` |
| R1 | red: `tests_026_contrato.js` (+ `red-026.md`) | idem |
| R2 | `ui_curation_v32.js` + HTML | idem |
| R3 | `ui_p52_support_v32.js` + `.css` + `ui_curation_edit_v32.js` + HTML (W3, depois da junção das duas worktrees e de **um** rebuild) | idem |
| R4a | `tests_022_mutants.js` (reancoragem `D022-M10`) | idem |
| R4b | `tests_019_curadoria.js` (E13) | idem |
| R4c | harness `d026` + `mutation_map` + `expected_suites` + `mutation-matrix` | idem |
| R5 | `bridges.json` | idem |
| R6 | `BACKLOG.md` + `design-decisions.md` (após ratificação) | idem |
| R7 | `spec-validate.md` | idem |
| R8 | `relatorio-final.md` | idem |

Classes de desvio **previstas** (registradas no relatório final, nunca
silenciadas): (a) merge/rebase de `develop`; (b) iteração do `spec-validate`;
(c) errata de spec **depois** do red; (d) segunda edição comentário-only de um
julgador; (e) repin de BASELINE do job `visual` (abaixo). `planning-state` está
fora do registry — commit de estado não pede repin.

## Boundary

**Classe mais alta tocada: `produto` (módulos 5.x da 019/022) + `generated` via
builder. Zero `frozen`. Zero §29.4.**

- `frozen` (`boundary.json`: engine, Camada 1, harness M41, snapshot): **zero
  linha**; payload M41 byte-idêntico é critério herdado (`D019-MED1` + stage
  `m41`); `D022-BND1`/`D023-BND1` guardam.
- `generated`: o HTML é reconstruído **só** pelo builder, no commit do módulo
  (W2) ou no fecho da wave (W3); o stage `build` prova identidade. `ui_icons_v32.js`
  intocado.
- `legacy` (`MANIFEST.sha256`, REV A) e `registry` (`pins.json` só via
  `gen_pins`): intocados.
- `PROTECTED` de `tests_p50_core.js` (`:82-670`) e `frozenSuites` (`:677-680`):
  nenhum arquivo tocado está lá (spec §Cross-check, item 2) — **sem repin
  inline, sem trilha "Identidade anterior"**.
- **Ponto de PARADA declarado**: (i) se o job `visual` mostrar `playwright P8`
  (12 páginas, `tests_visual/print.spec.js:100-104`) ou `P52-PDF5/PDF6`
  repaginados, a correção **não** é editar `tests_visual/*` nem
  `tests_p52_chromium.js` (§29.4, REV B `:1619`) por conta própria: primeiro a
  alternativa de layout (condensar tier + condição numa linha do `pr-card`);
  se ainda divergir, **repin de BASELINE declarado** com trilha — **só com
  autorização nominal do proprietário no chat**, nunca afrouxamento; (ii) se
  qualquer wave precisar de `ui_v32.js`, `engine_v32.js`, Camada 1 ou schema, a
  execução **para** nessa tarefa.

Precedência onde a prosa da REV B divergir do executável: regime de pins (R8;
`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2); divergência
vira achado, nunca edição de spec selada.

## Checklist R9 (módulo novo)

Nenhum módulo novo. Por módulo tocado:

| Módulo | IIFE + `__installed` | bridge único registrado | CSS por prefixo | zero `innerHTML =` novo | ≤ 600 linhas | helper único |
|---|---|---|---|---|---|---|
| `ui_curation_v32.js` | sim (`:78-81`) | `__CURATION` (registrado); 3 métodos novos, não bridge | n/a (zero CSS) | sim (0 hoje → 0) | 316 → ≈ 495 ✓ | **`temVoz`** (semântica "o motor tem voz", R9 §8; espelho de `hasSubstituteV32` medido por `LEG1 (e)`); `chaveDe` (uma verdade sobre o pareamento) |
| `ui_p52_support_v32.js` | sim | `__P53SOL` (registrado; shape inalterado) | `p53-*` | sim (0 → 0; o papel é string devolvida ao hook de `ui_v32.js:1566`, como hoje — não é `innerHTML =` do módulo) | **872 → ≈ 940 — acima do teto; justificativa registrada aqui (R9 §7)**: o módulo já está em 872 desde 019/022/023 (consolidação de blocos, arbitragem, papel, acréscimos, supressão); esta demanda **retira** a derivação (`ofertaDoMotor()` −95 linhas: o laço `computeFindings+MAP` e o laço por sinal saem) e devolve ao módulo só **apresentação** (atributos, linhas, bloco de vetos, cópia no papel, rótulos). O saldo é +65 líquidas em responsabilidade que **é** a deste módulo (R9 §7: "uma responsabilidade por módulo" — apresentação por produto, tela e papel). O split (papel em módulo próprio, ou vetos em módulo próprio) é rota futura, não desta demanda: criaria bridge/injeção/marcador novos (o custo que fez C perder). O `lint-arch` não mede linhas; a justificativa vive aqui e vai ao relatório final | consome `TIER` (`:240`) e `applyCopy` (`__P52`), não duplica regra de decisão |
| `ui_p52_support_v32.css` | — | — | `p53-*` só; sem hex; cor nunca único portador (R9 §6) | — | 220 → ≈ 255 ✓ | — |
| `ui_curation_edit_v32.js` | sim | `__P53CUR` (registrado; shape inalterado) | nenhum CSS escrito por B | sim (0 → 0) | 278 → ≈ 286 ✓ | consome `oferta()`; não duplica título |

`check_lint_arch.py` (`:30-45`, EA-101) alcança os três módulos (todo
`ui_*_v32.js` menos os legados 4.x): IIFE presente e `innerHTML=` = 0 **hoje**
(grep: 0/0/0) e continuam.

## Tabela de gatilho de campanha — o que cada arquivo editado dispara, e onde fecha

Gatilho = `mutation_map.json → harnesses.<n>.targets` × diff da branch contra a
base (`check_mutation.py`). Populações hoje (`mutation_map.json`): d019 17
mutantes (`targets` inclui `ui_curation_v32.js`, `ui_p52_support_v32.js`,
`ui_curation_edit_v32.js`, `tests_019_curadoria.js`), d022 13 (`ui_p52_support`,
`ui_curation`), d023 8+3b (`ui_p52_support`, `ui_curation`, `tests_019_curadoria.js`),
d025 23 (`ui_curation`, `ui_curation_edit`).

| Arquivo editado (wave) | Campanhas disparadas | `requires` | Onde fecha | Custo (ordem de grandeza, unidades medidas pela 025) |
|---|---|---|---|---|
| `ui_curation_v32.js` (W2) | **d019**, **d022**, **d023**, **d025** (+ **d026** após o registro) | node, python | local | d019 ≈ 5–6 min (M11 roda m48); d022 ≈ 3–4; d023 ≈ 3; d025 ≈ 20–25 (5× m48 a 107 s) |
| `ui_p52_support_v32.js` + `.css` (W3a) | **d019**, **d022**, **d023** (+ d026) | node, python | local | já disparadas |
| `ui_curation_edit_v32.js` (W3b) | **d019**, **d025** (+ d026) | node, python | local | já disparadas |
| `tests_022_mutants.js` (W4) | **d022** | node, python | local | já disparada |
| `tests_019_curadoria.js` (W4) | **d019**, **d023** | node, python | local | já disparadas |
| `tests_026_*.js` + registros (W4) | **d026** (6) | node, python | local | 6 × (≈ 3 s rebuild + ≈ 60–90 s suíte com ≈ 15 janelas jsdom) ≈ **8–10 min** — fixa-se por execução |
| `bridges.json`, `expected_suites.json`, `mutation_map.json`, `mutation-matrix.json`, `pins.json`, `CONTEXT.md`, `BACKLOG.md`, `design-decisions.md`, `specs/026/*` | nenhuma (conferido alvo a alvo nos 19 harnesses) | — | — | 0 |
| HTML gerado | não é alvo (classe `generated`); o stage `build` o prova | — | — | — |

**Campanhas sequenciais, nunca em paralelo**: d019 → d022 → d023 → d025 → d026.
Mutam **in place** (cópia + restauração byte a byte em `finally`); duas
campanhas juntas corrompem a árvore e o veredito contaminado parece achado
(memória do projeto). **Preflight de âncoras antes de qualquer campanha** (E14):
`node tests_019_mutants.js --preflight`, `tests_022_mutants.js --preflight`,
`tests_023_mutants.js --preflight`, `tests_025_mutants.js --preflight`,
`tests_026_mutants.js --preflight` — `ocorrencias == 1` em todas; mutante
sobrevivente **acusa o gate**, não só o código. Soma local do fecho (W4): ≈
**45 min** de campanhas node, mais as suítes do stage `suites` e
`compliance-audit.sh`. `MUTATION_DEFER_MISSING=1` **não** se aplica (nenhum
harness chromium dispara: `p51`/`p52` só alcançam `ui_v32.js`/`USER_GUIDE.md`,
intocados) — mas o job `visual` do PR roda de qualquer forma e é onde `P8`/
`PDF5-6` são medidos.

**Saída de verificação gravada em arquivo, nunca truncada**: cada campanha e
cada `run.sh`/`compliance-audit.sh` escrevem em
`<scratchpad>/026-<etapa>.log` (fora da árvore), e o relatório cita a linha —
`| tail -3` apaga o nome do estágio que falhou (memória do projeto).

## Waves

| Wave | Tarefas (resumo) | Depende de |
|---|---|---|
| **W0** | `product-owner`: `refinement.md` pelo template (consolida anexos; registra D-1..D-9 com a frase canônica); verbetes em `CONTEXT.md` por critério (*Registro de decisão de apoio*, *Hipótese condicionada* — ou emenda de *Habilitador a validar* —, *Veto do motor*, *Linha de produto*). `tech-lead`: spec/plan/tasks (este). Orquestrador: planning-state (F0→F1→F2→F3). `build-engineer`: R0 | — |
| **W1** | `qa-engineer`: `tests_026_contrato.js` (3 gates, fixtures) + `red-026.md`; **RED provado e commitado** (`0 PASS · 3 FAIL de 3`, cada gate nomeando `__CURATION.oferta` ausente); saída gravada em arquivo. `data-engineer` [P]: tabela de pré-imagens do pareamento §1.4 sobre `OFFERINGS ∪ SERVICES ∪ SERVICE_FAMILIES` × `PRODUCTS` (13), **só leitura**, em `anexos/pareamento.md` — insumo da alínea `REC1 (g)` e do core na W2. `build-engineer`: R1. Orquestrador: `red.commit` | W0 |
| **W2** | `core-engineer`: `ui_curation_v32.js` (spec §Contratos, §Comportamento) + rebuild do HTML; preflight d019/d022/d023/d025 antes e depois (âncoras byte-iguais). `build-engineer`: R2 | W1 |
| **W3a ∥ W3b** | `ui-engineer` A: `ui_p52_support_v32.js` + `.css` (spec §Tela, §Papel) · `ui-engineer` B: `ui_curation_edit_v32.js` (D-9). **Em worktrees distintas** (R14), cada um commita **só o seu módulo** (sem HTML, sem repin); o orquestrador junta as duas, o `build-engineer` faz **um** rebuild + R3. Alternativa sem `[P]`: A depois B, com rebuild e repin a cada um (um ciclo a mais) | W2 |
| **W4** | `qa-engineer`: reancorar `D022-M10` (4 toques em `tests_022_mutants.js`); comentário-trilha E13; `tests_026_mutants.js` + `expected_suites.json` (`d026: {pass:3, fail:0}`) + `mutation_map.json` (`d026` com `preflight: true`, `targets`, `insumos.oraculo`) + `mutation-matrix.json` — **um commit** (D4 da 013); preflight de **todas** as âncoras; campanhas **sequenciais** d019 → d022 → d023 → d025 → d026; `bash .claude/verify/run.sh` **e** `bash .claude/verify/compliance-audit.sh` (os dois, sempre); saídas em arquivo. `build-engineer`: R4a/R4b/R4c | W3 |
| **W5** | `build-engineer`: `bridges.json` (nota); R5; CI do PR — `verify` + `visual`: medir `playwright P8` e `P52-PDF5/6`; divergência ⇒ PARADA declarada (Boundary) | W4 |
| **W6** | `doc-writer`: `BACKLOG.md` (`EA-76` → `resolvido`; achado novo: lacuna do engine C3; candidato: `exclude` obsoleto sem sujeito) + `relatorio-final.md` (matriz §3 do desenho antes/depois; **delta visível declarado**; série de repins executada × prevista; janela medida × esperada). `product-owner`: `design-decisions.md` (D-1/D-2/D-7 como confirmadas **só após ratificação literal**) + aceite de intenção (lê). `qa-engineer`: `spec-validate.md`. `build-engineer`: R6/R7/R8. Orquestrador: push + PR (com o pedido de ratificação D-1..D-9) + `phase: done`. Usuário: merge | W5 |

### Quando o harness de mutantes nasce — e por que não no red

As âncoras (`find`) de `D026-M1..M6` são **texto do código que a demanda cria**
(`temVoz`, `chaveDe` regras 2–3, a precedência veto > hipótese, a exceção D-6,
`declararVetos`, o `data-p53-sol-tier` do `pr-card`). Um harness no red teria 6
de 6 âncoras `nao_executavel`, e `mutation_map.json → d026.preflight: true` só
pode nascer **no mesmo commit** em que o harness responde `--preflight` com
`ocorrencias == 1` (`check_mutation.py:297-312`, IC-4). O que viaja no red e nos
prompts é a **tabela estado-do-mundo** do `tasks.md` (uma linha por mutante);
na W4 cada linha vira código e a campanha prova o poder discriminante —
precedente `specs/025-curadoria-transacional/plan.md` §*Quando o harness nasce*.
O desenho §5.2 punha o harness na W1; a conferência no instrumento (IC-4) o
move para a W4 — **declarado**, não silenciado.

### R3 §2 quando gate e mudança se cruzam

O `qa-engineer` escreve `tests_026_contrato.js` (W1) e **nunca** toca
`ui_curation_v32.js`/`ui_p52_support_v32.js`/`ui_curation_edit_v32.js`; os
implementadores recebem os gates por **id e caminho** (`tasks.md` §*O gate que
viaja no prompt*) e **nunca** editam `tests_026_*`. O QA toca
`tests_022_mutants.js` e `tests_019_curadoria.js` (W4) — harness e
comentário-trilha, não critério novo. O `data-engineer` escreve só
`anexos/pareamento.md` (leitura do catálogo).

### Janela vermelha — commit → veredito esperado

| Após | `tests_026_contrato.js` | `suites` (stage) | `mutation` | `build`/`baseline` |
|---|---|---|---|---|
| W1 (red) | **0 PASS · 3 FAIL de 3** (bridge ausente, nomeado) | **vermelho nomeado** (`tests_026_contrato.js` fora do registro) | verde (nada disparado: diff só specs/anexos/suíte nova) | verde após R1 |
| W2 (`ui_curation` + HTML) | 0/3 — `LEG1 (f)` e `REC1 (g)` passam; as alíneas de DOM ainda caem (atributos ausentes) | vermelho nomeado | d019/d022/d023/d025 disparadas, todas DETECTADO esperado — `D022-M10` ainda detecta pelo código antigo (a âncora em `ui_p52_support_v32.js:~327` só sai na W3a; a cópia verbatim em `ui_curation_v32.js` ainda não é a mutada) | verde após R2 |
| W3a + W3b (+ rebuild) | **3 PASS · 0 FAIL de 3** | vermelho nomeado (ainda fora do registro) | d019/d022/d023 disparadas; **d022: `--preflight` acusa `ocorrencias: 0` para `D022-M10`** (`:109` ainda `F.apoio`, âncora removida de lá) ⇒ IC-4 **vermelho nomeado** até R4a — janela declarada | verde após R3 |
| W4 (reancoragem + harness + registros) | 3/3 | **verde** (`d026` registrada: 3/3) | d019 17 · d022 13 · d023 11 · d025 23 · **d026 6** — todos DETECTADO | verde após R4c |
| W5/W6 | 3/3 | verde | verde | verde após R5–R8; CI `verify` + `visual` + `fecho` |

O ponto da tabela: **entre a W3a e a W4** o `D022-M10` fica com âncora podre
em `F.apoio` — a reancoragem é a **primeira** tarefa da W4 e a janela é
visível e nomeada pelo IC-4, nunca silenciosa.

## Riscos e rollback

| Risco | Detecção (gate) | Mitigação / reversão |
|---|---|---|
| `P8` (12 páginas) / `PDF5-6` mudam de paginação com tier + condição + escopo + vetos no papel | job `visual` do PR (W5) | layout condensado (tier + condição numa linha); se persistir, repin de BASELINE **só com autorização** (§29.4) — PARADA |
| fixture futura com gate fechado **e** capability declarada em produção | `LEG1 (d)` variante *terceiro em produção* | porta de saída §2.1 cobre: hipótese, sem veto — é a única alínea cuja razão de ser é essa porta (dívida: sem carrasco próprio) |
| `hasSubstituteV32` e `temVoz` divergirem um dia | `LEG1 (e)` | comentário-trilha cruzado; a alínea mede a propriedade (`d010HasSubstitute === true` com veto), não a cópia |
| regra 3 do pareamento com catálogo futuro (família com dois representantes pareáveis) | `REC1 (g)` | cai em `null` = incurável; nunca inventa par |
| literal de `ctx.notes` como texto visível | — | é dado do engine por desenho (o mesmo que `#v32support` faz, `ui_v32.js:639`) |
| `P52_COPY` reescrevendo rótulo novo no papel | conferência na W3a (grep + tabela `:128-236`) | rótulos escolhidos fora das âncoras do caminhador |
| âncoras de mutante apodrecendo em silêncio (W2/W3a editam os dois arquivos mais ancorados do repositório: 12 + 2 + 5 âncoras) | preflight E14 antes/depois de cada wave | campanhas sequenciais; sobrevivente acusa o gate |
| `D022-M10` entre W3a e W4 (âncora movida, mapa `F` sem `estado`) | `--preflight` d022 `ocorrencias: 0` → IC-4 | reancoragem é a **primeira** tarefa da W4; 4 toques (mapa, `file`, `precisaBuild`, `insumos`) |
| `include` pré-025 sobre produto que o motor passa a vetar | — (residual honesto) | vira "escolha do engenheiro" com selo e o veto continua visível — uma linha no relatório final, não código |
| `published() ≠ cards` para `chave:null` | já latente hoje (`:142`/`:139`) | residual declarado; rota em §Fora de escopo |
| estimativa de 495/940 linhas estourar | contagem no relatório final | justificativa R9 §7 já registrada; split é rota futura |

**Rollback.** Um PR; `git revert` do merge devolve o HEAD byte a byte —
nenhuma migração de dado, schema ou sessão (arquivos de sessão existentes
importam com o **mesmo significado**: `"FortiEndpoint":"exclude"` continua
retirando a linha, qualquer que seja a variante). O Docker em `127.0.0.1:1337`
segue servindo o HTML anterior até o deploy manual (`deploy/` fora do git;
merge não é entrega).

## Protótipo

**Nenhum.** A questão que só código responderia — *o que o motor diz em cada
cenário, e o que tela e papel mostram hoje* — **já foi medida** pela sonda
jsdom read-only [`anexos/sonda-leitura.js`](anexos/sonda-leitura.js) sobre
`anexos/cenarios/*.json` (C1..C10) e C3b, com resultados registrados em
`anexos/refutacao-reproducoes.json` e na matriz §3 do desenho (coluna "motor
(medido, `node resumo.js`)"). As três correções que a conferência impôs ao
desenho B (precedência veto > hipótese; D-4 retirada; C3 desligada porque
`presentationOf`/`hasSubstituteV32` devolveriam a Camada 1) vieram de leitura
do código, não de protótipo. Nada a aprender num `prototype/*` que a sonda não
tenha respondido; se a W2 encontrar um caso do catálogo que a regra 3 do
pareamento não decida, a resposta é `null` (incurável) por desenho, não um
protótipo.
