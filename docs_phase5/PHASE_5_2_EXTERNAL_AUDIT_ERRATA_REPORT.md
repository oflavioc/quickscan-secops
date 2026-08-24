# ERRATA CONTROLADA · Phase 5.2 — correção pós-auditoria externa de frontend

Relatório de execução da errata autorizada pelo proprietário após o parecer independente de
engenharia sênior de frontend. Documento de entrega para **reauditoria independente em sessão
nova**. Nada aqui declara fase concluída, congelada ou liberada: essa declaração é do auditor.

```text
Repositório : C:\Projetos\QuickScan-SOC-CMM\phase5
Branch      : feat/phase5-5-2-desktop-workspace
HEAD        : d3886812718e7ad9c5024880067133fbddf2fc4d
Commits     : zero · Staged: zero · Push/PR/merge/tag/release/deployment: nenhum
Execução    : Linux (WSL2), Node v22.23.2, Python 3.14.4, Chromium do Playwright,
              poppler-utils (pdftotext/pdftoppm) disponíveis
```

## 1 · Documentos normativos desta rodada

Identidades **recalculadas sobre os arquivos recebidos**, não transcritas.

| Documento | SHA-256 calculado | Bytes | Linhas | BOM | CRLF | Confere |
|---|---|---|---|---|---|---|
| `PROMPT_ERRATA_PHASE_5_2_PDF_UX_APOS_AUDITORIA_EXTERNA.md` | `ca9358ff5d1c44adee5e4bcd99f9c7c406d4fd65d27b711ac1ebecada4bd46b2` | 18.762 | 564 | ausente | zero | ✅ |
| `AUDITORIA_EXTERNA_SENIOR_FRONTEND_QUICKSCAN_PHASE_5_2.md` | `f5a9f70e7a5ee658ef86775d8dab93ce2cb15974604a7ed7f1dcd99e13b58dae` | 67.974 | 1.053 | ausente | zero | ✅ |

Ambos foram lidos integralmente até EOF antes de qualquer edição.

Veredito recebido do parecer: **FAIL** · 3 BLOCKER · 1 ALTO · 5 MÉDIO · 3 BAIXO ·
4 riscos arquiteturais. Os três blockers estão no caminho de PDF, não no motor de maturidade.

## 2 · Identidades pré e pós

### 2.1 Estado de entrada — conferido antes de editar

| Item | Esperado pelo prompt | Calculado nesta sessão | Resultado |
|---|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` | `70d91eb252f6b5238ec048724f329ffd172f3b42d9e0b70a0e78f8b04739c2cf` · 914.648 B | idem · 914.648 B | ✅ |
| `docs_phase5/MANIFEST_PHASE5_P52.sha256` | `c2223232d9ed3e978bf24e413f4371538332fcd0b5067f53f5542afb3b9a8b89` · 184 entradas | idem · 184 entradas | ✅ |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | idem | ✅ |
| payload funcional M41 | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | idem · M41 **PASS** | ✅ |

`sha256sum -c` do manifesto de entrada: **184/184 OK, exit code 0**.
Branch, HEAD e inventário do delta conferidos; **zero staged**; nenhum processo de teste, mutação ou
build em execução no início; `AGENTS.md` preservado como arquivo externo não rastreado.

Determinismo de entrada verificado antes de qualquer edição: `python3 build_v32_html.py` reproduziu
o HTML de entrada **byte a byte** (`70d91eb2…`, 914.648 B).

### 2.2 Estado de saída

| Item | SHA-256 | Bytes |
|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` | `dfbe2f3bdda58d00367d9a90cb6ea5ee2ea8a8639fd63618ec7773438bfac85a` | 957763 |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | 57261 |

Engine **byte-idêntico** ao baseline (`9a4a2e67…`) e payload funcional M41 **byte-idêntico**
(`9794b267…`, M41 **PASS**). Nenhuma linha do engine, do schema de sessão, do question bank, das
regras de score, do gate de suficiência ou do motor de recomendações foi tocada.

### 2.3 Arquivos alterados nesta errata

**Produção (módulos-fonte; o HTML é sempre reconstruído pelo builder):**

| Arquivo | SHA-256 | O que mudou |
|---|---|---|
| `ui_v32.js` | `0b30fe27ebc7fa06…` | B-01 (`publishableStats()`, tabela, radar, nota honesta), B-02 (seções E–H condicionais, contexto declarado como não informado, remoção do curto-circuito de `preparePrint()`), ponte `window.__V32UI.publishableStats` |
| `ui_target_v32.js` | `77b7b6991219e6d5…` | B-01 na comparação Atual × Alvo, em tela e no papel, pela mesma decisão canônica; `computeTargetProfile()` intocado |
| `ui_p52_workspace_v32.js` | `0b8af6bf0e2a5324…` | §6.1 (ajuda `(i)` em todos os campos + correção do `Escape` e da guarda de idempotência), §6.6 (ícones nas listas secundárias), M-01/M-03 (hierarquia de cabeçalhos) |
| `ui_p52_workspace_v32.css` | `846616d494b9e59f…` | A-01 (`--red-text`), L-01, §6.2 (grade de requisitos), §6.3 ("Para avançar"), §6.4 (cenário-alvo), §6.5 (normalização óptica do `.v32-icon`), §6.6 (grade das listas secundárias) |

**Gates, fixtures, ferramentas e documentação:**

| Arquivo | SHA-256 | O que mudou |
|---|---|---|
| `fixtures_p52.js` | `f6cb666af115d4cb…` | oráculo independente de publicabilidade `p52PublishOracle()` |
| `tests_p52_chromium.js` | `bfc215cd548ddb3f…` | matriz completa de PDF; gates novos `P52-PDF7/8/9`, `P52-ACC3`, `P52-HELP2`, `P52-SIG1`, `P52-ADV1`, `P52-TGT3`, `P52-ICON3`; migração de `P52-PR1`(c) e da métrica de `P52-SUP3` |
| `tests_p52_layout.js` | `a231c4ddc6da2738…` | precisão de seletor em `P52-HELP1` |
| `tests_p52_mutants.js` | `68774d3fe6169c37…` | catorze mutantes novos da errata; repontuação documentada de `P52-M9` |
| `tests_p50_core.js` | `f840163f115eded4…` | repin documentado de `PROTECTED` para `ui_v32.js`, `ui_target_v32.js` e `tests_unset_ug.js` |
| `tests_p50_chromium.js` | `32058b4e980ade44…` | migração de `P50-PR1` (metade de impressão invertida; metade de tela byte-idêntica) |
| `tests_ui_m332.js` | `2e9ce33d131090b5…` | migração de `P1` |
| `tests_unset_ug.js` | `81bb577c6489cee7…` | migração de `UG4`, `UG6` e `UG9`, com controle positivo |
| `tools_p52_shots.js` | `6cfe4b3f9ca809fa…` | viewports 768×1024 e 1024×768, zoom 110% e 125%, onze cenas nominais da errata |
| `tools_p52_pdf_census.js` | `556293f4951f4fa6…` | **arquivo novo** — censo de PDF real da matriz completa (§8.2) |
| `USER_GUIDE.md` | `17f1a9a7fd57b05e…` | o manual passa a descrever o relatório com e sem contexto e a não publicação por domínio sob gate fechado |

Superfícies **não** tocadas: `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`,
`build_v32_html.py`, `ui_icons_v32.js`, `generate_icons_v32.py`, `harness_m41_v313.js`,
`v3_1_3_functional_snapshot.json`, `ui_ux_v32.js`, `ui_refinement_v32.js`, `ui_journey_v32.js`,
`ui_session_v32.js`, `ui_v32.css`, `ui_ux_v32.css`, `ui_p50_*`, `package.json` e `package-lock.json`.


## 3 · Prioridade zero — os três blockers de PDF

Protocolo obrigatório cumprido na ordem: **RED real primeiro, código de produção depois.**
As reproduções abaixo foram feitas em **PDFs A4 reais**, impressos por Chromium headless com
escala 100%, gráficos de fundo habilitados, cabeçalho/rodapé do navegador desabilitados e margens
de 12 mm, com texto extraído **página a página** por `pdftotext -bbox-layout` e cobertura de tinta
medida na página **rasterizada** por `pdftoppm`.

### 3.1 B-01 · score por domínio publicado com o gate de suficiência fechado

**Causa-raiz.** Em `buildPrintReport()` (`ui_v32.js`), a tabela `table.pr-doms` e o radar
`prRadarSVG()` eram condicionados **apenas** a `s.score === null` — nunca a `suff`. O KPI global e a
régua, na mesma página, já respeitavam `suff`. A decisão de publicabilidade existia, mas não era
única: dois consumidores do mesmo dado seguiam regras diferentes.

**RED reproduzido** (cenário `insuficiente + contexto`, gate canônico fechado, 4 de 15 confirmadas):

```text
tabela de domínios ..... [2.5, 0.0, n/d, 5.0, n/d]
radar .................. Negócio 2.5 · Pessoas 0.0 · Tecnologia 5.0  (3 vértices de dado)
texto no papel (p1) .... "Negócio 2.5"  "Pessoas 0.0"  "Tecnologia 5.0"  "Serviços 2.5"
na mesma página ........ "n/d · Score geral indicativo" e "Estágio: suficiência de dados não atingida"
```

O domínio *Tecnologia*, com **uma** resposta confirmada, saía como `5.0`.

**Correção.** Uma função nova, `publishableStats(stats, suff)`, é a **fonte única** do que pode ser
publicado por domínio: com o gate fechado devolve `score: null` em todos os cinco. Tabela e radar
passam a consumir `pub`, nunca `stats` cru. Não há ocultação por CSS: o valor **não é produzido**.
Como `prRadarSVG()` já se recusa a desenhar quando não há vértice algum, o radar simplesmente não
existe sob gate fechado — em paridade exata com a tela, que também o suprime. Uma nota honesta
(`#pr-nopub`) explica a supressão, com a contagem real de confirmadas e a regra canônica.

**Correção adicional, da mesma classe, encontrada durante a errata.** A comparação
*Perfil atual × Cenário-alvo* — em **tela** e no **papel** — também publicava score por domínio sem
consultar gate algum (`ui_target_v32.js`). O prompt §4.1.1 exige que "qualquer texto derivado"
consuma a mesma decisão; a auditoria externa não mediu esse quadrante porque só exercitou o alvo
com o gate aberto. Ambas as superfícies passam a consumir `publishableStats()` pela ponte
`window.__V32UI`, com nota honesta própria. `computeTargetProfile()` continua **puro e
byte-idêntico**: nenhum valor calculado mudou, só o que é publicado.

### 3.2 B-02 · sem contexto tecnológico, o relatório projetado não era gerado

**Causa-raiz.** Duas decisões somadas:

1. `preparePrint()` tinha um curto-circuito — `if (V32.isLegacyModeV32()){ el.innerHTML="";
   document.body.classList.remove("v32-print-mode"); return { legacy:true }; }` — que descartava o
   relatório **antes** de montá-lo e não aplicava `v32-print-mode`, a classe que oculta `.wrap`.
   Consequência: a superfície de aplicação virava o documento.
2. `buildPrintReport()` tinha um `return` que **encerrava** o relatório em modo legado, logo após os
   gaps — cortando fora jornada, leitura executiva, refinamento, cenário-alvo e anexo, que não
   dependem de contexto algum.

**RED reproduzido** (cenários `suficiente + sem contexto` e `insuficiente + sem contexto`):

```text
document.body.className durante beforeprint ..... "" (sem v32-print-mode)
#v32-print-report .............................. 0 caracteres
getComputedStyle(.wrap).display sob @media print  "block"
PDF resultante ................................. 10 e 6 páginas da TELA, sem capa,
                                                 sem metadados, sem legenda, sem régua
```

**Correção.** O curto-circuito foi removido: existe **um único caminho de impressão**. Em
`buildPrintReport()`, o `return` de modo legado virou um bloco condicional — só as seções que
dependem **materialmente** do contexto (contexto declarado, plataformas e licenciamento, requisitos
específicos, interpretação do contexto, apoio Fortinet e leitura arquitetural) ficam de fora. O
contexto ausente passa a ser **declarado**, não omitido: a seção `#pr-landscape` aparece marcada
como *não informado*, com o texto neutro que explica que a ausência não altera score, estágio,
suficiência nem gaps, e o rodapé repete a condição.

### 3.3 B-03 · no caminho legado com gate fechado, o papel contradizia a tela

**Causa-raiz.** A neutralização honesta da superfície legada vive em `@media screen`
(`.p50-legacy-gone` / `.p50-legacy-veiled`), e a nota que a explica é ocultada em `@media print`.
Enquanto `.wrap` chegasse ao papel, os valores contraditórios ressuscitavam.

**RED reproduzido** (`insuficiente + sem contexto`):

```text
p2 do PDF: "2.5 — Defined"   "0.0 — Non-existent"   "5.0 — Optimizing"
tela, mesmo estado: n/d nos cinco domínios + "Não avaliado · evidência insuficiente"
```

**Correção — por construção, sem segunda correção de CSS.** Com B-02 corrigido, `preparePrint()`
sempre aplica `v32-print-mode`, e a regra congelada `body.v32-print-mode .wrap{display:none}` retira
a superfície de aplicação do papel em **todas** as condições. Nenhum valor bloqueado pode ressurgir
em `@media print` porque a superfície que os contém não é mais publicada. O gate `P50-PR1` mede
exatamente isso, nó a nó, e o gate `P52-PDF8` mede `.wrap` com `display:none` sob mídia de impressão
nos quatro quadrantes.

## 4 · A matriz de quatro quadrantes

Medida em **PDF A4 real**, com o oráculo independente de publicabilidade conferindo cada quadrante
antes de qualquer asserção. `printMode` é `document.body.classList.contains("v32-print-mode")` lido
**durante** o `beforeprint`; `domínios no papel` é o conteúdo real das cinco células.

| Suficiência | Contexto | ANTES (`70d91eb2…`) | DEPOIS (`dfbe2f3b…`) |
|---|---|---|---|
| **aberta** | informado | relatório estruturado · `printMode=true` · domínios `0.6 1.1 1.1 1.1 1.1` | **igual** — nada regrediu |
| **aberta** | **não informado** | ❌ **10 páginas da TELA** · `printMode=false` · sem capa, metadados, legenda, régua, jornada e anexo | ✅ relatório estruturado, 6 páginas · `printMode=true` · contexto marcado **não informado** |
| **fechada** | informado | ❌ relatório publica `2.5 0.0 n/d 5.0 n/d` sob KPI `n/d` · radar com 3 vértices | ✅ `n/d n/d n/d n/d n/d` · radar não publicado · nota honesta `#pr-nopub` |
| **fechada** | **não informado** | ❌ **6 páginas da TELA** com `2.5 — Defined`, `0.0 — Non-existent`, `5.0 — Optimizing` na p2 | ✅ relatório estruturado, 3 páginas · `n/d` nos cinco · contexto **não informado** |

Resultado esperado pelo prompt (§4) atendido nos quatro quadrantes: relatório estruturado sempre;
contexto marcado como não informado quando é o caso; score global e domínios **não publicados** com
o gate fechado.


## 5 · Resultados dos PDFs reais

Seis cenários, impressos por Chromium com **A4, escala 100%, gráficos de fundo habilitados,
cabeçalho/rodapé do navegador desabilitados e margens de 12 mm**. Para cada arquivo: SHA-256, total
de páginas, dimensão de página, texto extraído por página, primeira e última linha materiais e
**cobertura de tinta medida na página rasterizada** (`pdftoppm -gray -r 40`). Censo completo em
`docs_phase5/evidence_p52/P52-ERRATA-pdf-census.json`; arquivos em
`docs_phase5/evidence_p52/pdf_errata/`.

| # | Cenário | SHA-256 (16) | Págs | A4 | printMode | Domínios no papel | KPI |
|---|---|---|---|---|---|---|---|
| 1 | suficiente + contexto + prioridades | `6eb22c480456300b` | 11 | 11/11 | ✅ | `0.6 1.1 1.1 1.1 1.1` | `1.0 / 5` |
| 2 | suficiente + **sem contexto** + prioridades | `3d058cbb68de1d21` | 6 | 6/6 | ✅ | `0.6 1.1 1.1 1.1 1.1` | `1.0 / 5` |
| 3 | insuficiente + contexto | `8392bd08f1c88a8f` | 6 | 6/6 | ✅ | `n/d n/d n/d n/d n/d` | `n/d` |
| 4 | insuficiente + **sem contexto** | `b964536d2892439f` | 3 | 3/3 | ✅ | `n/d n/d n/d n/d n/d` | `n/d` |
| 5 | fronteira de estágio (1,7) | `b4e554492ad8041d` | 12 | 12/12 | ✅ | `1.7 1.7 1.7 1.7 1.7` | `1.7 / 5` |
| 6 | sem prioridades | `bca5c3d1bbd446d1` | 12 | 12/12 | ✅ | `0.6 1.1 1.1 1.1 1.1` | `1.0 / 5` |

**Todas as 50 páginas dos seis arquivos medem 210×297 mm.** Nenhuma página residual: a de menor
conteúdo material (p11/p12 dos cenários longos, 389 caracteres e 1,93% de tinta) fecha o anexo de
respostas e o rodapé — conteúdo, não decoração — e é assim classificada pelo censo material de
`P52-PDF6`, que reprova página existente apenas por rodapé ou decorador.

Verificações do §8.2 do prompt, provadas por gate no arquivo impresso:

| Verificação | Resultado |
|---|---|
| A4, escala 100%, fundos, sem cabeçalho/rodapé do navegador | ✅ nos 6 arquivos |
| Texto extraído por página | ✅ registrado no censo |
| Páginas rasterizadas e censo de tinta | ✅ `pdftoppm`, por página |
| Total de páginas, primeira e última seção de cada página | ✅ registrado no censo |
| Zero página residual | ✅ `P52-PDF6` |
| Jornada horizontal e atômica — título, seis estágios, marcadores e nota na mesma página | ✅ `P52-PDF4`, nos **quatro quadrantes** |
| Nenhum estágio dividido entre páginas | ✅ `P52-PDF4` mede a fileira em pontos PDF |
| Nenhuma primeira página quase vazia | ✅ menor p1 = 1.547 caracteres, 10,1% de tinta (antes: 281 caracteres no caminho legado) |
| Prioridades começam como seção íntegra | ✅ `P52-PDF1` (`break-before: page`) |
| Ícones realmente pintados | ✅ `P52-PDF3` (visibilidade + caixa) e `P52-ICON3` (censo de tinta) |
| Zero clipping e sobreposição | ✅ `P52-PDF2` (recorte por ancestral e colisão de caixas) e `P52-PDF5` |
| Score/estágio idênticos à tela | ✅ `P52-PDF9`, nos quatro quadrantes |

A **jornada vertical e quebrada** que o proprietário ainda observava era exatamente o caminho legado:
a régua útil do A4 com margens de 12 mm mede ≈703 px CSS, abaixo do `@media (max-width:720px)` que
existe para telefone — e no papel valia a regra de telefone, empilhando os seis estágios. A correção
de horizontalidade já existia, mas estava escopada em `#v32-print-report`, que **nunca era montado**
sem contexto. Com o caminho de impressão unificado, ela passa a valer nos quatro quadrantes; o gate
`P52-PDF4` agora mede os quatro, e não mais só os dois com contexto.


## 6 · Prioridade um e dois — acessibilidade e ajustes visuais autorizados

### 6.1 A-01 · contraste (ALTO)

O parecer mediu sete padrões de texto de marca entre 3,75:1 e 4,04:1, abaixo dos 4,5:1 de
WCAG 2.2 AA · 1.4.3, todos carregando significado executivo (severidade do gap, número da
prioridade, nome do estágio).

Token novo `--red-text`, **derivado do sistema existente** e do mesmo matiz de marca (4,1°),
apenas mais claro. O vermelho de preenchimento e acento (`--red`, `--ftnt-red`) **não** foi tocado:
barras, marcador da régua, bordas e radar continuam em `#DA291C`.

| Superfície | `#DA291C` (antes) | `#F54133` (`--red-text`) | Exigido |
|---|---|---|---|
| `--surface` `#151517` | 3,75:1 | **4,94:1** | 4,5:1 |
| `--bg` `#0B0B0C` | 4,04:1 | **5,33:1** | 4,5:1 |
| popover `#1C1C1F` | 3,49:1 | **4,60:1** | 4,5:1 |
| papel (branco) | 4,87:1 | 3,69:1 ✗ | 4,5:1 |

Como no papel a relação se inverte, sob `@media print` o token volta a `#DA291C`. Aplicado
nominalmente onde o vermelho funciona como **texto**: `.eyebrow`, `.stage-tag`, `.f-tag.sev-a`,
`.prio-decl .rk`, `.prod .pt-link`, `.ux-priochip .pnum`, `.ux-prios .eyebrow`, `a`.

Gate **P52-ACC3** mede contraste **computado**, nó a nó renderizado, nas três telas (resultados,
resultados bloqueado, pergunta), sobre o **fundo opaco efetivo** de cada nó, com limiar 4,5:1 para
texto normal e 3:1 para texto grande, e só considera nós com texto próprio e materialmente visível.

Junto foi corrigido **L-01** (alvo de toque): `.pt-link` e `.p52-sup-link` passam a ter altura
mínima de 24 px, sem mudar tipografia nem posição de leitura.

### 6.2 M-01 / M-03 · hierarquia de cabeçalhos (MÉDIO)

`#app h1` retornava **0** nas telas principais e a pergunta em curso era um `<div class="question">`.
Correção mínima e não destrutiva, no decorador de apresentação: o nó de título de cada tela recebe
`role="heading"` + `aria-level="1"` (um por tela, idempotente sob renders repetidos), e os cartões
de gap que estavam em `h4` sob um `h2` passam a anunciar nível 3. **Nenhuma tag, classe, id, atalho
ou aparência foi alterada** — só a árvore acessível passa a existir, o que preserva todos os
seletores das suítes congeladas.

`M-02` (`radiogroup` nas alternativas) **não** foi implementado nesta rodada: exigiria trocar
`aria-pressed` por `role="radio"`/`aria-checked` na superfície de pergunta congelada e reescrever a
navegação por setas, o que amplia risco sem cobrir blocker. Registrado no backlog (§11).

### 6.3 §6.1 · ajuda contextual `(i)` consistente

Medição da cobertura **antes** da errata, no editor real com todos os grupos abertos:

| Grupo de campos | Total | Com ajuda (antes) | Com ajuda (depois) |
|---|---|---|---|
| Capabilities | 22 | 22 | 22 |
| Campos de arquitetura | 6 | 6 | 6 |
| Situação declarada (por capability) | 22 | **0** | 22 |
| Famílias de capabilities + arquitetura | 4 | **0** | 4 |
| Subgrupos de requisitos | 4 | **0** | 4 |
| Requisitos / sinais | 22 | 8 | 22 |
| Plataforma, bundles e subscriptions | 19 | **0** | 19 |
| Legendas de `fieldset` | 3 | **0** | 3 |

"Processamento local obrigatório" e "Residência/localidade de dados" já estavam cobertos e
permanecem. Todo controle novo usa **o mesmo componente** já existente (`p52HelpControl`): mesmo
ícone, mesma caixa, mesma tipografia, abre por hover e por foco, alterna por clique/toque, fecha
com `Escape`, tem nome acessível próprio e associação programática por `aria-describedby`, com
`role="note"` no texto. **Nenhum `title` nativo** é usado.

Textos curtos, factuais e neutros de fabricante: para as subscriptions, o nome é do fabricante mas
a explicação descreve a **função** ("prevenção de intrusão: inspeciona o tráfego em busca de
exploração de vulnerabilidades conhecidas"), sem afirmar aderência, cobertura, sizing ou compra.

**Defeito do próprio componente encontrado ao criar o gate:** `Escape` fechava o popover e devolvia
o foco ao controle — comportamento correto de retorno de foco —, mas o controle abre no `focus`, e
as duas regras corretas juntas **reabriam** o popover: o `Escape` não fechava nada de fato. Corrigido
com uma supressão que dura apenas o ciclo de eventos do retorno de foco. O gate `P52-HELP2` exercita
hover, foco, clique, `Escape`, alternância e ausência de clipping em controle real.

### 6.4 §6.2 · grade dos requisitos específicos

Defeito: os quatro grupos (`Incidente / SOC` 6, `E-mail / Dados` 5, `IA` 8, `Identidade / Endpoint`
3) usavam `grid-template-columns: repeat(2,1fr)` com gaps **assimétricos** (`10px 18px`), o que
produzia blocos de alturas diferentes e espaço vazio ao fim de cada grupo.

Correção: grade única `repeat(auto-fill, minmax(260px, 1fr))`, **gaps iguais nos dois eixos**
(12 px), itens alinhados pelo topo, cada rótulo em subgrade de duas colunas para que a caixa de
seleção alinhe com a **primeira linha** do texto, altura mínima de 24 px e colapso para uma coluna
abaixo de 720 px — pelo próprio `auto-fill`, sem posicionamento manual de linha/coluna. A ordem de
leitura é a do DOM e não muda. A mesma regra vale para bundles e subscriptions.

### 6.5 §6.3 · "Para avançar"

Tipografia de achado (17 px, entrelinha 1,7, cor de texto principal; 15,5 px abaixo de 1180 px),
`list-style: none` e um **marcador gráfico determinístico** — um galão desenhado em CSS por bordas,
sem asset externo e sem depender de glifo de fonte, no vermelho de marca. Espaçamento por `grid`
de 14 px. Nenhum item vira card: o gate `P52-ADV1` reprova se a altura do item passar de quatro
linhas de texto, e exige que o achado nunca seja menor que o corpo da leitura executiva.

### 6.6 §6.4 · cenário-alvo

A seção `#ux-target` já ocupava a largura útil; o que parecia "card estreito preso à esquerda" era o
**conteúdo**: no estado vazio, um parágrafo com `max-width:640px` e um botão soltos num painel de
~1.400 px; no estado editado, a tabela `Current × Target` com **208 px**, encostada à esquerda,
enquanto KPIs e listas ocupavam tudo.

Correção: um **único grid** para os dois estados; a tabela passa a `width:100%` com
`table-layout:fixed` e proporções declaradas por coluna; o comprimento de linha do texto continua
limitado por `ch` (68ch no estado vazio, 78ch no disclaimer). `Current × Target` continua derivado,
Target continua sem contaminar Current e o score canônico não é afetado.

### 6.7 §6.5 · normalização óptica dos ícones

O tile grande (`.icon-tile`) já fora normalizado por caixa aparente numa errata anterior e continua
coberto por `P52-ICON1`/`P52-ICON2`. O ícone pequeno do sistema V3.2 (`.v32-icon`, usado nos cards
de apoio da tela **e** no relatório impresso) **não tinha normalização alguma**: medido em pixel,
o bounding box da tinta ia de **83,6%** (FortiGuard-MDR-Service) a **92,6%** (FortiSOC) do próprio
quadro — 10,8 pontos percentuais de diferença de peso óptico entre extremos.

Correção pelo mesmo método já validado: `object-fit: contain` explícito e um fator por asset,
medido em pixel sobre o próprio arquivo, que leva os **28 assets** à mesma ocupação aparente de
**88,0%**, com teto de 96% em cada eixo para que glifo panorâmico nenhum encoste na borda. Nenhum
byte de asset é tocado: só `transform: scale()` uniforme — sem corte, sem distorção, sem ampliação
borrada. Gate `P52-ICON3` mede a faixa 84–92% em pixel.

### 6.8 §6.6 · ícones nas listas secundárias

"Pode fazer sentido — após validação" (`.t-list`) e "Não priorizados neste screening"
(`.t-details`) listavam soluções **sem ícone**. Passam a usar o **mesmo componente** das
recomendações principais dessa superfície (`span.icon-tile.sm > img`), com o `src` vindo de
`productIcon()` — a função do runtime **congelado**. Esta camada não declara mapa de produto para
asset, não embute base64 e não escolhe artwork: apenas consome. O id canônico vem do catálogo
congelado `PRODUCTS`, por chave direta ou pelo nome de exibição — nada é adivinhado por
similaridade. Quando não há entrada no catálogo, o item é marcado `data-p52-titem="no-icon"` e
mantém o layout de uma coluna: nenhum ícone genérico substitui um canônico existente.

O nó de texto original é apenas **movido** para dentro de um corpo, sem reescrita: a explicação de
por que o item não foi priorizado e os links oficiais permanecem intactos. O gate `P52-ICON3` prova
a presença **por tinta rasterizada**, não por DOM, nas duas listas — e falha se o texto explicativo
encolher.


## 7 · Gates novos, gates migrados e campanha de mutação

### 7.1 Gates novos desta errata

Todos medem o **artefato real** — papel impresso, pixel rasterizado, estilo computado — e todos têm
**controle positivo** no mesmo lote, para que nenhum passe por ausência de conteúdo, seletor vazio
ou caminho não executado.

| Gate | O que prova | Não-vacuidade |
|---|---|---|
| `P52-PDF7` | Nenhum score por domínio publicado sob gate fechado — em célula de tabela, rótulo de radar, vértice desenhado ou texto do papel. O que pode ser publicado vem do **oráculo independente** `p52PublishOracle()`, recalculado do vetor sem chamar `domStat()`, `dataSufficiency()` nem `buildPrintReport()` | Com o gate ABERTO, o mesmo sensor **tem** de achar os cinco valores; e os nomes dos cinco domínios **têm** de estar no papel, senão o gate acusa "sensor cego" |
| `P52-PDF8` | Nas duas condições de contexto o documento é o relatório estruturado: `v32-print-mode` ativo durante `beforeprint`, relatório com > 2.000 caracteres, `.wrap` com `display:none` sob mídia de impressão, capa, cinco metadados nominais, legenda, "Como interpretar", régua com 6 faixas, jornada, anexo e rodapé; sem contexto, o rodapé **tem** de dizer "não informado" | O oráculo independente confere `suff` contra o quadrante declarado antes de qualquer asserção |
| `P52-PDF9` | Coerência tela × papel: o valor publicado por domínio e o agregado são os **mesmos** nos dois meios, nos quatro quadrantes. A tela é medida **antes** do print, e o que conta como publicado é o que está **materialmente visível** (`getComputedStyle`), não o que está no DOM | KPI global comparado contra o oráculo em todos os casos |
| `P52-ACC3` | Contraste **computado** nó a nó nas três telas, sobre o **fundo opaco efetivo**, com limiar por tamanho e peso | Falha se nenhum nó de texto de marca for medido |
| `P52-HELP2` | Cobertura de ajuda `(i)` em capabilities, situação declarada, campos de arquitetura, famílias, subgrupos, requisitos, bundles, subscriptions e legendas; contrato idêntico (mesma caixa, mesma tipografia, mesmo rótulo, nome acessível, `aria-expanded`, `role="note"`, texto ≥ 40 caracteres, **sem `title` nativo**) e comportamento real (hover, foco, clique, `Escape`, alternância, sem clipping) | Falha se nenhum campo do editor for encontrado |
| `P52-SIG1` | Grade de requisitos em 3 viewports: gaps iguais nos dois eixos, alinhamento de topo por linha, caixa alinhada ao rótulo, larguras de coluna coerentes, uma coluna em viewport estreito, mesmo número de colunas entre grupos | Falha se nenhuma grade for medida |
| `P52-ADV1` | "Para avançar": tipografia ≥ 16,5 px, entrelinha ≥ 1,55, `list-style:none`, marcador gráfico com caixa real, calha ≥ 20 px, **sem asset de imagem**, item nunca com altura de card, e nunca menor que a leitura executiva | Falha se o bloco não montar |
| `P52-TGT3` | Painel do cenário-alvo em 3 viewports × 2 estados: ocupa a área **útil** de conteúdo, nenhum filho encolhido abaixo de 60% do painel, tabela em largura plena, legibilidade preservada no estado vazio | Confere que o estado da fixture foi alcançado antes de medir |
| `P52-ICON3` | Ocupação óptica do `.v32-icon` medida em **pixel** (bounding box da tinta × escala aplicada) na faixa 84–92%, `object-fit:contain`, caixa de layout idêntica; e ícone **materialmente pintado** — por censo de tinta rasterizada — em "Pode fazer sentido" e "Não priorizados", com o texto explicativo preservado | Falha se menos de 3 ícones forem medidos ou se qualquer das duas listas não for exercitada |

### 7.2 Gates migrados — correspondência linha a linha

Cinco gates afirmavam, como requisito, o comportamento que a auditoria externa declarou defeituoso.
Nenhuma asserção foi **removida**: cada uma tem substituta no mesmo ponto do fluxo, e cada migração
está documentada **no próprio arquivo**, com a identidade anterior registrada.

| Gate | Arquivo | O que afirmava | O que passa a afirmar |
|---|---|---|---|
| `P1` | `tests_ui_m332.js` | sem contexto, relatório **não** montado, `v32-print-mode` **não** aplicado | relatório montado, `v32-print-mode` aplicado, estrutura completa, contexto **declarado** como não informado, seções E–H suprimidas |
| `P50-PR1` | `tests_p50_chromium.js` | no papel: `.wrap`/`#app` visíveis, 5 valores legados, 5 `.conf`, 5 fills, radar e legenda; texto = score canônico | no papel: `.wrap`/`#app` invisíveis, **nenhum** nó legado pintado, e o score canônico da Camada 1 **não** aparece sob gate fechado. Comparação com o baseline de entrada deixou de exigir identidade e passou a exigir **a diferença com o sinal certo** — se o baseline não apresentava o defeito, o gate FALHA. **As asserções de TELA continuam byte-idênticas.** |
| `P52-PR1`(c) | `tests_p52_chromium.js` | sem contexto, o papel é a própria tela | sem contexto, `.wrap` fora do papel; o baseline **tem** de tê-la impresso, senão a diferença declarada não existe; anexo e rodapé comparados na **tela**, onde a obrigação de não regredir vale |
| `UG4` · `UG6` · `UG9` | `tests_unset_ug.js` | vértices e células numéricas de domínio com o gate **fechado** | nada publicado sob gate fechado + **controle positivo** com o gate aberto. A invariante do rótulo canônico `n/d` foi preservada integralmente e ampliada aos cinco domínios e aos três meios |
| `P52-HELP1` · `P52-SUP3` | `tests_p52_layout.js` · `tests_p52_chromium.js` | precisão de seletor e de métrica (ver §9.4 e §9.5) | mesma obrigação, medida no alvo certo |


### 7.3 Campanha de mutação

**62 mutantes · 62 detectados pelo gate semanticamente correspondente e por motivo compatível.**
Detecção incidental por manifesto, identidade de arquivo ou contagem global **não** conta: o harness
exige a linha `FAIL` do gate nomeado e o casamento do motivo declarado. Após cada mutante o source é
restaurado e conferido **byte a byte**, e o acervo de evidência (144 arquivos) é verificado íntegro.

Os catorze mutantes desta errata (§8.4 do prompt) e o gate que cada um obriga a reprovar:

| Mutante | O que reintroduz | Gate |
|---|---|---|
| `P52-EX1` | publicar score por domínio na tabela sob gate fechado | `P52-PDF7` |
| `P52-EX2` | restaurar o radar numérico sob gate fechado | `P52-PDF7` |
| `P52-EX3` | restaurar o curto-circuito de modo legado em `preparePrint()` | `P52-PDF8` |
| `P52-EX4` | imprimir a superfície de tela (não aplicar `v32-print-mode`) | `P52-PDF8` |
| `P52-EX5` | recolocar a jornada **vertical** no papel | `P52-PDF4` |
| `P52-EX6` | permitir página residual | `P52-PDF6` |
| `P52-EX7` | devolver o vermelho de marca ao texto pequeno | `P52-ACC3` |
| `P52-EX8` | remover a ajuda `(i)` de uma capability | `P52-HELP2` |
| `P52-EX9` | quebrar a grade de requisitos (gaps desiguais) | `P52-SIG1` |
| `P52-EX10` | reduzir novamente a tipografia de "Para avançar" | `P52-ADV1` |
| `P52-EX11` | devolver o cenário-alvo a um card estreito preso à esquerda | `P52-TGT3` |
| `P52-EX12` | reduzir um ícone específico do sistema V3.2 | `P52-ICON3` |
| `P52-EX13` | remover o ícone das duas listas secundárias | `P52-ICON3` |
| `P52-EX14` | ícone presente no DOM mas **não pintado** | `P52-ICON3` |

**Um mutante preexistente teve de ser repontuado, e a razão é evidência da correção.** `P52-M9`
retirava `#p52-rail` da lista de supressão de print para provar que o trilho não vaza para o papel.
Depois de B-02 essa mutação ficou **inerte**: `.wrap` inteira deixou de ser impressa, e suprimir o
trilho individualmente virou redundância. A obrigação foi preservada atacando o único ponto que hoje
a garante — a aplicação de `v32-print-mode` em `preparePrint()`. Documentado no próprio arquivo.

## 8 · Regressão integral

Executada sobre o artefato final `dfbe2f3b…`. Cada linha é um comando concluído com **exit code
próprio**; nenhum timeout, interrupção ou execução parcial conta como PASS.

| Suíte | Comando | Resultado | Baseline congelado |
|---|---|---|---|
| Engine | `npm run test:engine` | **105 PASS · 0 FAIL** · exit 0 | 105 |
| UI 3.1 | `npm run test:ui31` | **19 PASS · 0 FAIL** · exit 0 | 19 |
| UI 3.2 | `npm run test:ui32` | **25 PASS · 0 FAIL** · exit 0 | 25 |
| UI 3.3 | `npm run test:ui33` | **11 PASS · 0 FAIL** · exit 0 | 11 |
| UI 3.3.2 (PDF) | `npm run test:ui332` | **23 PASS · 0 FAIL** · exit 0 | 23 |
| UI 3.3.3 | `npm run test:ui333` | **26 PASS · 0 FAIL** · exit 0 | 26 |
| UX 4.1 | `npm run test:ux41` | **56 PASS · 0 FAIL** · exit 0 | 56 |
| Target 4.3.1 | `npm run test:target` | **30 PASS · 0 FAIL** · exit 0 | 30 |
| Refinement 4.4 | `npm run test:ref` | **28 PASS · 0 FAIL** · exit 0 | 28 |
| Journey 4.5 | `npm run test:journey` | **31 PASS · 0 FAIL** · exit 0 | 31 |
| Icons 4.6 | `npm run test:icons46` | **12 PASS · 0 FAIL** · exit 0 | 12 |
| Session 4.8 | `npm run test:session` | **97 PASS · 0 FAIL** · exit 0 | 97 |
| UNSET Geometry | `npm run test:unset` | **13 PASS · 0 FAIL** · exit 0 | 13 |
| P50 core | `npm run test:p50` | **64 PASS · 0 FAIL** · exit 0 | 64 |
| P50 Chromium | `npm run test:p50vis` | **27 PASS · 0 FAIL** · exit 0 | 27 |
| P52 layout | `npm run test:p52` | **35 PASS · 0 FAIL** · exit 0 | 35 |
| P52 Chromium | `npm run test:p52vis` | **43 PASS · 0 FAIL** · exit 0 | 34 + **9 novos** |
| M41 (V3.1.3) | `npm run test:m41` | **22 PASS · 0 FAIL** · exit 0 · payload `9794b267…` idêntico | 22 |
| Visual (Playwright) | `npm run test:visual` | **67 passed · 0 failed · 37 skipped** · exit 0 | 67/0/37 |
| Mutação P52 | `node tests_p52_mutants.js` | **62/62 detectados** · exit 0 | 48 + **14 novos** |

**Nenhuma contagem congelada foi reduzida e nenhuma expectativa foi enfraquecida para acomodar
regressão.** As únicas contagens que subiram são as dos gates novos. As cinco migrações de gate
estão documentadas linha a linha em §7.2 e nos próprios arquivos, com a identidade anterior
registrada em `PROTECTED`.

### 8.1 Determinismo do build

```text
build A → dfbe2f3bdda58d00367d9a90cb6ea5ee2ea8a8639fd63618ec7773438bfac85a
build B → dfbe2f3bdda58d00367d9a90cb6ea5ee2ea8a8639fd63618ec7773438bfac85a   (idêntico)
```

O builder não foi alterado nesta errata. O HTML construído **não** foi editado à mão em momento
algum: toda correção é de módulo-fonte, e o artefato veio sempre de `python3 build_v32_html.py`.


## 9 · Defeitos do próprio harness encontrados nesta rodada

Registrados porque o prompt exige (§9.11) e porque explicam por que a auditoria externa achou o que
achou — e por que não achou mais.

### 9.1 A campanha de PDF não cobria metade da matriz

`PDF_CASOS`, em `tests_p52_chromium.js`, declarava `contexto: true` em **todos** os quatro cenários,
e o comentário do caso bloqueado registrava o motivo com honestidade: *"sem isso o produto entra em
modo legado e nem chega a montar o relatório V3.2"*. Isso é a definição de ponto cego: o harness
sabia da existência do caminho legado e escolheu não medi-lo. A metade não coberta era a metade
**mais provável** em uso real, porque o contexto tecnológico é opcional e documentado como opcional.
Corrigido: a matriz agora é `{aberta, fechada} × {contexto, sem contexto}`, mais fronteira de
estágio e ausência de prioridades — seis cenários de PDF real.

### 9.2 Três gates congelados afirmavam o defeito como requisito

`tests_ui_m332.js` P1, `tests_p50_chromium.js` P50-PR1 e `tests_p52_chromium.js` P52-PR1(c) exigiam
literalmente que, sem contexto, o relatório **não** fosse montado, `v32-print-mode` **não** fosse
aplicado e `.wrap` **fosse** a superfície impressa, com os cinco valores legados no papel. Não é
negligência: é o efeito previsível de congelar o núcleo e corrigir por camadas — o gate documentou o
comportamento existente e o transformou em contrato. A auditoria externa nomeia essa dinâmica em
§6.3 (R-01/R-02) e a chama de causa, não de sintoma.

Cada um foi migrado com correspondência **linha a linha** documentada no próprio arquivo, sem
remover asserção alguma e acrescentando controle positivo — ver §7.2.

### 9.3 Dois gates da UNSET Geometry mediam geometria estruturalmente impublicável

`tests_unset_ug.js` UG4, UG6 e UG9 exercitavam o radar do relatório com um domínio inteiro `n/d`.
Um domínio `n/d` tem `n = 0`, e `n = 0` **fecha o gate canônico por definição** — logo aquele radar
só podia existir quando a publicação era proibida. Os gates estavam medindo B-01 de outro ângulo e
chamando o resultado de invariante. Migrados: a invariante do rótulo canônico `n/d` foi preservada
integralmente e a invariante geométrica passou ao **controle positivo**, executado no único estado
em que o radar pode existir — o gate aberto, onde UG7 (zero confirmado) e UG8 (UNSET em nível de
prática) continuam provando que `n/d` nunca é desenhado como zero.

### 9.4 Uma métrica de gate confundia paint com layout

`P52-SUP3` comparava tiles de ícone por `getBoundingClientRect()`. Como a §6.5 pede normalização por
caixa **aparente** e a normalização é `transform: scale()` — que não altera layout algum, mas entra
no rect —, o gate passaria a acusar de "tile de tamanho diferente" exatamente a correção pedida. A
obrigação (todo card usa o mesmo tile) continua asserida, agora na caixa de layout; a uniformidade da
tinta, que o rect media por acidente, passou a ser asserida diretamente e em pixel por `P52-ICON3`.

### 9.5 Dois defeitos que os gates novos encontraram no próprio produto

- **`Escape` não fechava o popover de ajuda.** Fechar e devolver o foco ao controle é correto; abrir
  no `focus` é correto; juntas, as duas regras reabriam o que o usuário acabara de fechar. Só
  apareceu porque `P52-HELP2` exercita o ciclo completo (hover → foco → clique → `Escape` →
  alternância) em controle real, e não a presença dos atributos.
- **A guarda de idempotência do controle de capability era genérica demais.** Ao decorar também a
  "Situação declarada", que vive no mesmo cabeçalho, a guarda `[data-p52="cap-help"]` encontrava o
  controle vizinho e impedia a criação do controle da capability. Encontrado por `P52-HELP1`, gate
  **preexistente** — a suíte congelada fez o seu trabalho e é a evidência de que a errata não a
  enfraqueceu.


## 10 · Limitações declaradas e itens não executados

Nada abaixo recebe PASS em ponto algum deste relatório.

1. **Impressão por navegador não-Chromium.** Toda a prova de papel foi feita com o Chromium do
   Playwright (`pdf()` com A4, `printBackground`, margens de 12 mm), que é o mesmo motor do Chrome
   usado pela auditoria externa. Firefox e Safari **não** foram exercitados.
2. **Zoom real do navegador** (110%/125%/200%): emulado por viewport CSS equivalente com
   `deviceScaleFactor`. Cobre *reflow* com fidelidade; não cobre arredondamento de rasterização.
3. **Leitor de tela real** (NVDA/JAWS/VoiceOver): não executado. A prova de acessibilidade é por
   árvore acessível, semântica ARIA e contraste **calculado** sobre nós renderizados, mais `axe-core`
   em `P52-ACC1`.
4. **`M-02` (`radiogroup` nas alternativas)** não foi implementado — decisão declarada, no backlog.
5. **`M-04` (mapa do assessment congelado na carga)** não foi implementado — no backlog.
6. **Percurso completo de UI do editor de contexto** (abrir/fechar grupos, `+ Adicionar tecnologia`,
   salvar/cancelar/reabrir por interação real de mouse) continua verificado por estado e por
   invariante, e agora também por interação real nos controles de ajuda (`P52-HELP2`); o percurso
   comercial completo não foi percorrido clique a clique.
7. **Impressão a partir do diálogo nativo do navegador** (`window.print()` com interação humana) não
   é executável em ambiente headless: os gates disparam o evento `beforeprint` real e imprimem pelo
   motor, que é o caminho que produz o arquivo, mas não o diálogo.
8. **A produção em `127.0.0.1:1337` não foi exercitada** — por decisão: ela não podia ser tocada.
   Nenhuma verificação desta errata foi feita contra ela.


## 11 · Backlog pós-release — dívida arquitetural, separada e não bloqueante

O feedback arquitetural do DeepSeek é **pertinente como dívida** e foi classificado como tal.
Nesta errata **não** foi executado, por decisão do prompt (§7) e por razão técnica: uma
modularização transversal agora tornaria impossível atribuir regressões aos blockers de PDF.
Registro do que **não** foi feito e por quê:

- não converter para `import/export`;
- não dividir o produto em múltiplos artefatos de distribuição — o HTML autocontido é o artefato de
  distribuição, e o source já é composto por módulos injetados pelo builder;
- não reescrever o motor de recomendações — ele passou nos testes adversariais do parecer;
- não refatorar todos os globais; não consolidar todo o CSS de uma vez; não alterar o engine.

Contra-evidência medida pelo próprio parecer externo, que sustenta o adiamento: 357 ms de carga,
≈0,47 ms por render, **zero** requisições externas e **zero** crescimento de nós em 31 renders.

### 11.1 Itens do backlog

| # | Item | Origem |
|---|---|---|
| 1 | Modularização dos sources sem perder o build autocontido | DeepSeek · R-03 |
| 2 | Contrato de ownership do estado | DeepSeek |
| 3 | Extração das funções puras de publicação e recomendação | DeepSeek · R-04 |
| 4 | Consolidação incremental de CSS por componente | DeepSeek · L-03 |
| 5 | Tokenização tipográfica e de breakpoints (41 tamanhos, 39 breakpoints, par `1179`/`1180`) | L-03 |
| 6 | JSDoc e documentação das regras de recomendação | DeepSeek |
| 7 | Testes unitários sobre funções puras | DeepSeek |
| 8 | Remoção da superfície de resultado legada após migração dos gates | R-01 · R-02 |
| 9 | **M-02** · `role="radiogroup"`/`radio` + `aria-checked` nas alternativas, preservando os atalhos numéricos | parecer §3.6 |
| 10 | **M-04** · reavaliar o estado do mapa do assessment por `matchMedia` com listener de `change` | parecer §3.7 |
| 11 | **L-02** · medida de linha de `.p52-sec p` para ~62–68 ch | parecer §3.9 |
| 12 | **L-03** · eliminar as 13 ocorrências literais de `#DA291C` e tokenizar a paleta de impressão | parecer §6.4 |
| 13 | Extrair o cálculo do score geral para função única, chamada nos 6 pontos | R-04 |
| 14 | Fluxo de rotulagem de sessão obrigatório antes de gerar PDF | parecer §9.4 |
| 15 | Overlay de alvo no radar **de tela** (`.ux-target-shape`) ainda desenha vértices sob gate fechado — hoje inofensivo porque a `.radar-box` inteira é neutralizada na tela e não é impressa, mas é a última superfície de alvo que não consome `publishableStats()` | achado desta errata |
| 16 | Teste com leitor de tela real (NVDA/JAWS/VoiceOver) e snapshot visual rasterizado das páginas do PDF no pipeline | parecer §1.6 · §9.4 |

Nenhum destes bloqueia a correção atual.


## 12 · Blockers abertos conhecidos

**Nenhum blocker aberto conhecido** ao fim desta errata.

Os três blockers do parecer externo estão corrigidos na origem e cobertos por gate próprio, com
mutante que reprova por motivo compatível:

| ID | Estado | Gate que o congela | Mutante |
|---|---|---|---|
| **B-01** | corrigido na origem do dado (`publishableStats()`), em tela e no papel, no relatório e na comparação Atual × Alvo | `P52-PDF7`, `P52-PDF9`, `UG4`, `UG6`, `UG9` | `P52-EX1`, `P52-EX2` |
| **B-02** | corrigido por caminho único de impressão | `P52-PDF8`, `P1`, `P50-PR1`, `P52-PR1` | `P52-EX3`, `P52-M9` |
| **B-03** | **eliminado por construção** — a superfície que continha os valores contraditórios não é mais publicada | `P52-PDF7`, `P52-PDF8`, `P50-PR1` | `P52-EX4`, `P52-EX14` |

Os demais achados do parecer: **A-01** corrigido e medido; **M-01** e **M-03** corrigidos;
**M-05** eliminado junto com o caminho legado de impressão; **L-01** corrigido. **M-02**, **M-04**,
**L-02** e **L-03** ficaram declaradamente no backlog (§11), com o motivo registrado — não são
blockers e o parecer não os classifica como tal.

Um achado **novo desta errata**, também corrigido: a comparação *Perfil atual × Cenário-alvo*
publicava score por domínio sem consultar gate algum, em tela e no papel — mesma classe de B-01,
num quadrante que a auditoria externa não exercitou porque só testou o alvo com o gate aberto.

## 13 · Estado final e confirmação de produção intacta

```text
HTML pós-correção  : dfbe2f3bdda58d00367d9a90cb6ea5ee2ea8a8639fd63618ec7773438bfac85a · 957.763 bytes
engine_v32.js      : 9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a  (byte-idêntico)
payload M41        : 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b  (byte-idêntico) · M41 PASS
build determinístico: A == B
```

**Produção em `127.0.0.1:1337`: intocada.** Nenhum comando desta sessão escreveu fora do repositório
e do diretório temporário de trabalho; nenhuma requisição foi feita à instância de produção; nenhuma
porta foi aberta, servida ou reiniciada. A candidata existe apenas como arquivo no worktree local.

Estado do repositório ao fim:

```text
worktree      : NÃO comitado
staged        : zero
commits       : zero          push: zero      PR: zero
merge         : zero          tag: zero       release: zero      deployment: zero
fase seguinte : NÃO iniciada
AGENTS.md     : preservado como arquivo externo, não rastreado, fora do manifesto por decisão declarada
```

Nenhuma declaração de fase concluída, congelada ou liberada é feita aqui. **A candidata para para
reauditoria independente em sessão nova.**

