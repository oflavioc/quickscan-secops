# MICROFASE 5.0.5 — ACCESSIBILITY, RESPONSIVE & VISUAL CLOSURE

Relatório de entrega da candidata. **A microfase NÃO é declarada concluída nem congelada por este
documento**: o agente entrega e para; a declaração cabe exclusivamente ao auditor/proprietário
(REV B §32, `CLAUDE.md`).

- Spec normativa: `specs/PHASE_5_0_REV_B.md` · SHA-256 `4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b`
- Diretriz executada: `DIRETRIZ_ENXUTA_MICROFASE_5_0_5.md` · SHA-256 `c966c57b2bb27d74863e0aa48710d6232a88b99e5bc02e5bf5c27be29553b7cf` · 13.514 bytes · 356 linhas · UTF-8 sem BOM · zero CRLF (identidade conferida antes de qualquer edição)
- Branch de trabalho: `feat/phase5-5-0-5`
- Ambiente: Node v22.23.2 · Python 3.14.4 · Playwright 1.62.1 · Chromium 151.0.7922.34 (WSL2/Linux)

---

## 1 · Preflight e branch

Conferido item a item **antes** de qualquer edição, contra a §1 da diretriz. Todos os valores
bateram exatamente; nada foi normalizado ou descartado.

| item | esperado pela diretriz | observado |
|---|---|---|
| branch inicial | `main` | `main` |
| HEAD | `3b8d76be8b07b78549b93d38758e9677b51dd8fa` | idem |
| `origin/main` | `3b8d76be…` | idem |
| worktree | limpo | `git status --porcelain` vazio |
| pais do merge | `ae03c04f…` + `e527ef66…` | `ae03c04fd6eee124777ec8d57f29cd8cb8f2a04a` + `e527ef6687b18dc92e5b5fe615e33a77e77434ca` |
| árvore da 5.0.4 auditada ≡ `main` | idêntica | ambas `0d2ae7e39408846303d99cb3f45d0bcc62f32b0c` |
| PR #5 | merged | `MERGED`, mergeCommit `3b8d76be…` = HEAD |
| tags / releases / deployments | zero | `git tag` vazio · `gh release list` vazio · API de deployments 404 |
| HTML | `d7c53209…fd6cdb8c` | idem |
| engine | `9a4a2e67…2bb5d247a` | idem |
| payload M41 | `9794b267…3ed4365b` | idem (obtido executando `npm run test:m41`) |
| manifesto | `b3d5430f…7a191c86` · 63/63 | idem · 63/63 verificados por `sha256sum -c` |
| `package.json` | `fc0bf13b…c924746f` | idem |
| `package-lock.json` | `22203244…d058b68a` | idem |
| artefatos 5.0.5 preexistentes | nenhum | nenhum (busca por `*5_0_5*` / `*5.0.5*`) |

Branch `feat/phase5-5-0-5` criada a partir desse estado. **Nenhum commit foi feito.**

---

## 2 · Inventário nominal de arquivos

### Produção (Camada 5 · §29.2)

| arquivo | SHA-256 final | alterado nesta microfase |
|---|---|---|
| `ui_p50_shell_v32.js` | `957141ec1e26a945b22969c649a3b0a1e41f4855eb69d4ea73889e765aaffbf6` | sim |
| `ui_p50_suff_v32.js` | `a9931330021949b581da29012be7669edf75529aaaaa9c2f13d0165494b86f5b` | sim |
| `ui_p50_results_v32.js` | `4c2965f7befdf2f907d6502d28f94ef8f8603cbf4a9cd3fdecc802d6e4a8b66e` | sim |
| `ui_p50_v32.css` | `3e4835200c7faa6cef53d7719648100c9c3d416e74c7d6a2cba933606bee4a50` | sim |

### Testes e fixtures

| arquivo | SHA-256 final | alterado |
|---|---|---|
| `tests_p50_core.js` | `b2b8b01f07cbc3bcba017c8ab8156ca05415dfaa4c7204eae4a133d8709c38b8` | sim |
| `tests_p50_chromium.js` | `d06860c78f844e2dbc0e964bddd743a05fb87e8275cad2183bcd27d52f3294a4` | sim |
| `fixtures_p50.js` | `08610c8f92238eefb82a07ec57cb1ab9cdbb626cad1c9483d278e26ed572443f` | **não** (byte-idêntico ao HEAD) |
| `tests_p50_mutants.js` | `28f2e876d4f614baf83b02d0c23bbbf19a983d4b0a943e1b42d1f8c8c067ddf5` | **não** (byte-idêntico ao HEAD; campanha executada em cópia temporária) |

### Dependência de teste (§29.3)

`package.json` e `package-lock.json` — delta **exclusivamente** o autorizado.

### Fora da boundary

`build_v32_html.py` permanece **byte-idêntico** (`bce37fef5e4722e6e6215186f33c9f0af030bb03e706504a30ca80fededc07bc`,
igual ao HEAD). `git diff --name-only HEAD` filtrado contra a lista da boundary devolve **vazio**:
nenhum arquivo protegido foi tocado.

---

## 3 · Dependência axe: versão exata e prova de ausência no HTML

Instalação: `npm install --save-dev --save-exact @axe-core/playwright@4.13.0`.

Delta integral em `package.json` (uma linha) e `package-lock.json` (dois blocos):

```text
package.json      + "@axe-core/playwright": "4.13.0"          (exata; sem ^, ~ ou faixa)
package-lock.json + node_modules/@axe-core/playwright@4.13.0
                    integrity sha512-6YLx+kxXu5GJceG4ozFg+33a2EMTdjYwWGloJ3sb9Kta5pp+ZNS53uxGVog5JetIY8s++P5UrtX+cri+u0VAVg==
                  + node_modules/axe-core@4.13.0              (transitiva ~4.13.0, estritamente necessária)
```

O `integrity` resolvido é **idêntico** ao declarado pela spec na §25.7. Nenhuma outra entrada do
lockfile mudou; `package.json.version` intocado; nenhum script alterado.

**Prova de ausência no produto**, em duas camadas independentes:

1. lint de fronteira do P50 CORE — `axe-core`, `axeCore`, `runAxe` são símbolos proibidos nos quatro
   módulos de produção (verificação sobre o código, com comentários removidos);
2. verificação sobre o **artefato construído** — `axe-core`, `axeCore`, `AxeBuilder` e
   `@axe-core/playwright` têm **zero ocorrências** no HTML. As únicas ocorrências da subcadeia
   "axe" no HTML são as palavras inglesas `axes`/`axed` do conteúdo congelado.

---

## 4 · Estratégia de execução

Seguiu-se a §4 da diretriz, sem burocracia artificial:

1. inventário dos gates normativos materialmente inexistentes;
2. implementação dos gates faltantes nos arquivos autorizados;
3. execução contra o baseline **antes** de qualquer correção de produção;
4. registro do FAIL real quando ocorreu; **PASS de baseline** registrado quando o requisito já
   estava satisfeito — nenhum RED foi fabricado;
5. correção apenas do que falhou materialmente;
6. defeitos do próprio harness corrigidos dentro da boundary e acompanhados de prova de não
   vacuidade;
7. sem rodada separada para texto, comentário ou metadado.

Todo gate novo emite **diagnóstico por elemento/fixture** (seletor, valor medido, limiar, veredito),
nunca um booleano global.

---

## 5 · Gates novos e resultado real

### 5.1 Gates criados nesta microfase

| gate | arquivo | oráculo | primeira execução | após correção |
|---|---|---|---|---|
| P50-VIS1 (1920×1080) | `tests_p50_chromium.js` | medição de layout em Chromium real | **FAIL** (defeito do harness) | PASS |
| P50-VIS2 (1440×900) | idem | idem | **FAIL** (defeito do harness) | PASS |
| P50-VIS3 (1366×768) | idem | idem | **FAIL** (defeito do harness) | PASS |
| P50-VIS4 (390×844) | idem | idem | **FAIL** (defeito do harness) | PASS |
| P50-VIS5 (foco visível) | idem | travessia só por teclado + aritmética WCAG no oráculo | **FAIL** (2 defeitos reais de produto + 1 do harness) | PASS |
| P50-VIS6 (zoom 200%) | idem | 683×384 CSS · DSF 2 | **FAIL** (defeito do harness) | PASS |
| P50-VIS10 (print) | idem | reexecução real das suítes congeladas | **FAIL** (oráculo de SKIP incorreto) | PASS |
| P50-ACC1 (axe-core) | idem | `@axe-core/playwright@4.13.0` | **FAIL** (2 defeitos do harness + 2 achados reais) | PASS |
| P50-ACC2 (só teclado) | idem | `captureCanonicalInputs()` | **FAIL** (defeito do harness) | PASS |
| P50-ACC3 (ordem de foco) | idem | ordem do documento + ARIA tablist | **PASS de baseline** (sob a travessia fraca do defeito H9) | PASS (cobertura corrigida) |
| P50-ACC4 (contraste/target) | idem | aritmética WCAG independente | **FAIL** (achado real de contraste) | PASS |
| P50-COR4 (autoridade de cor) | `tests_p50_core.js` | hashes das superfícies congeladas + tokens | **PASS de baseline** | PASS |
| P50-IC1 (asset oficial) | `tests_p50_chromium.js` | `window.__V32UI.iconFor()` | **PASS de baseline** | PASS |
| P50-IC2 (fallback) | idem | idem | **PASS de baseline** | PASS |
| P50-IC4 (regressão ICONS) | `tests_p50_core.js` | reexecução real da suíte ICONS 4.6 | **PASS de baseline** | PASS |

Verificações de **aceite** (identificador próprio; **não** pertencem ao namespace de gate `P50-*`,
seguindo o precedente `ACEITE-UX-5.0.1`/`5.0.3` já existente nesta suíte):

| verificação | conteúdo | resultado |
|---|---|---|
| `ACEITE-R1-5.0.5` | marcador de zero confirmado no Atual × Alvo + contraprova sem base atual | PASS |
| `ACEITE-R2-5.0.5` | contagem e limiar como grandezas separadas | PASS |
| `ACEITE-R4-5.0.5` | nome acessível de presence sem redundância, UNSET × NONE preservados | PASS |
| `ACEITE-UI048-5.0.5` | orientação sobre dado sensível junto ao campo de evidência | PASS |
| `ACEITE-LOCALIDADE-LATENCIA-5.0.5` | zero rede/persistência + latências medidas | PASS |

### 5.2 Gates preservados e reexecutados, sem redefinição de contrato

`P50-VIS7`, `P50-VIS8`, `P50-VIS9`, `P50-ACC5`, `P50-ACC6`, `P50-SESUX1B`, `P50-PR1` e os
`P50-UX*`/`P50-SUF*`/`P50-SESUX*`/`P50-COR1..3`/`P50-IC3`/`P50-GOV*` das microfases 5.0.1–5.0.4:
todos reexecutados nesta rodada, nenhum enfraquecido, nenhum reescrito.

### 5.3 Defeitos do próprio harness, corrigidos dentro da boundary

Registrados por honestidade de evidência: cada um foi encontrado **executando** o gate, corrigido e
reexecutado; nenhum resultou em afrouxamento de limiar.

| # | defeito | correção | prova de não vacuidade |
|---|---|---|---|
| H1 | o gate exigia o conteúdo do painel *Resumo* visível também nas outras tabs, que o padrão ARIA mantém `hidden` | conjunto de exigências **por tab** (resumo/domínios/heat map/análise), cada uma com o seu conteúdo essencial | as quatro tabs passaram a ser exigidas nominalmente: 5 linhas de domínio, 5 seções + 15 perguntas de drill-down, 15 células + tabela alternativa, 5 linhas de Atual × Alvo |
| H2 | `require("@axe-core/playwright/package.json")` bloqueado pelo mapa `exports` do pacote | versão lida do arquivo instalado | o gate reprova explicitamente versão divergente de `4.13.0` |
| H3 | `AxeBuilder` exige page de contexto **explícito**; com `browser.newPage()` morria com "Please use browser.newContext()" | criação por `browser.newContext()` | 60 varreduras reais executadas, 1.051 checagens aprovadas |
| H4 | o oráculo de `print.spec` tratava como SKIP indevido o **recorte de projeto** declarado pela própria suíte congelada (`test.skip: project.name !== 'd1440'`) | contagem exata exigida: 7 executados, 0 falhas, 21 skips de projeto, soma 7 × 4 = 28 | um teste a menos, uma falha ou uma soma diferente reprovam |
| H5 | o fluxo de teclado parava antes de Results porque procurava `#skip`, controle que não existe no ramo de aprofundamento | avanço genérico até a superfície de Results, com as telas atravessadas registradas | ambos os fluxos (teclado e mouse) passam a alcançar Results; a assimetria também reprova |
| H6 | regexes injetadas na página estavam com barra simples dentro de um **template literal**: `\s` virava `s` e `\(` virava `(`, e o parser de cor devolvia `NaN` **sem erro** | barras duplicadas + teste unitário do parser sobre `rgb`, `rgba`, `color(srgb …)` e `rgba(0,0,0,0)` | o parser é exercitado fora do browser e devolve os quatro casos corretamente |
| H7 | o parser de cor não entendia `color(srgb …)`, a notação computada de `color-mix()`: toda cor derivada media contraste 0 | suporte à notação em ambos os lados (Node e página) | as 108 combinações passaram a ter razão real; a pior é 4.582:1 |
| H8 | o contraste ignorava a **opacidade acumulada** dos ancestrais — foi assim que uma violação real escapou ao oráculo próprio e só apareceu no axe | opacidade acumulada multiplicada na cor do texto | o oráculo próprio deixou de ser mais fraco que o axe nesse ponto |
| H9 | a travessia por Tab retomava do último **clique** (o "sequential focus navigation starting point" do Chromium) e terminava em 2 paradas: o gate media quase nada sem acusar nada | ponto de partida reposicionado no `<body>`, ciclo percorrido por inteiro, uma travessia por tab em Results, e **piso de cobertura declarado** | elementos com foco verificado passaram de **10 para 46**; não alcançar qualquer item do piso é FAIL |
| H10 | medição durante a animação congelada `.screen{animation:fade .35s}` produzia contraste transitório (`--faint` medido a 4,37:1 em pleno fade contra 4,92:1 em repouso) | espera **ativa e verificável** por `document.getAnimations()` em repouso, registrada na evidência | nenhum limiar foi alterado; o que mudou foi o instante da medição |

---

## 6 · Correções de produção realmente necessárias

Cada uma nasceu de um **FAIL medido**, não de suposição. Todas vivem nos quatro módulos da Camada 5;
nenhuma toca engine, scoring, metodologia, question bank, print ou arquivo protegido.

### 6.1 Anel de foco inexistente em toda a superfície de Results — **defeito real de acessibilidade**

`--dom-accent` só existe sob `[data-dom]` e é **indefinida** na raiz de `#p50-results`/`#p50-suff`.
Uma `var()` indefinida invalida a declaração inteira no tempo de valor computado, de modo que
`outline: 2px solid var(--dom-accent)` computava `outline-style: none`: **as tabs, os painéis e a
região rolável simplesmente não tinham indicador de foco**, sem erro algum no console.

Correção: token `--p50-focus` derivado do token de texto congelado (`var(--text)`), com *fallback*
literal `var(--p50-focus, var(--text))` em todos os usos, de modo que a perda silenciosa do
indicador se torne impossível. Foco é **estado de UI**, não dimensão de dados (COR-01.2): não usa a
cor do domínio, não usa o acento de marca e não usa o tracejado verde do cenário-alvo.

### 6.2 Cor de domínio como texto abaixo de 4.5:1 — **defeito real de contraste (UI-032)**

Medido: `--ftnt-purple` sobre `--surface2` = **3,93:1**; sobre `--surface` = 4,21:1. A UI-032 exige
atingir o contraste "ou usar variante/peso que o atinja" — nunca afrouxar a exigência.

Correção: token `--p50-dom-text = color-mix(in srgb, var(--dom-accent) 80%, var(--text))`, aplicado
**somente a texto**. Bordas, trilhos, hachuras e preenchimentos continuam com `var(--dom-accent)`
puro, porque ali o domínio é a dimensão de dados. A variante deriva do próprio token congelado:
**zero hex literal, zero paleta nova**, COR-01.1 intacta (P50-COR1 continua verde). Pior caso após a
derivação: **5,37:1**.

### 6.3 Anel de foco clipado — **defeito real de layout**

`ui_ux_v32.css` (protegido) aplica no breakpoint estreito
`.opts,.navrow,.screen{max-width:100vw; overflow-x:hidden}`. Medido em 390 px: o card ocupa
exatamente a largura de `.opts` (ambos 43..372 px), de modo que um anel com deslocamento **positivo**
sai cortado nas laterais. O mesmo ocorre com `#next` dentro de `.navrow` e com
`#ses-export`/`#ses-import` dentro de `section.screen`.

Correção: o anel passa a ser desenhado **para dentro** da caixa do próprio controle
(`outline-offset` negativo), onde nada o corta. A regra de `overflow` congelada **não** foi alterada,
nenhum indicador foi removido, e espessura, cor e a condição `:focus-visible` continuam as mesmas.
Confinado a `@media screen`, pela mesma razão de B-AUD-FIN-503-1: decisão de tela não vaza para o
papel. Contraste do anel contra o fundo do card: **14:1**.

### 6.4 Região rolável sem acesso por teclado — **achado real do axe (WCAG 2.1.1)**

`scrollable-region-focusable` (serious) em `.p50-alt`: a alternativa acessível do heat map rola
horizontalmente em telas estreitas, e quem navega só por teclado não alcançava as colunas fora da
vista. Correção: o contêiner passa a ser focável e nomeado (`tabindex="0"`, `role="group"`,
`aria-label`), com anel de foco visível. A tabela e os dados permanecem exatamente os mesmos.

### 6.5 UI-048 — orientação sobre dado sensível

Não existia. Acrescentada junto ao controle que abre o campo de evidência, curta e não alarmista,
e ligada ao `textarea` congelado por `aria-describedby` (atributo **aditivo**; markup da Camada 1
intocado):

```text
Evite registrar segredos, credenciais ou dados pessoais desnecessários.
```

Sem `role="alert"`, sem `aria-live`, sem cor de alerta, e sem qualquer claim de persistência,
segurança ou conformidade — o produto continua local-first e sem gravação automática de sessão
(UI-011/UI-047, P50-SESUX1A/1B verdes).

### 6.6 Polimentos R1–R4 da auditoria independente da 5.0.4

| # | ressalva | resolução | verificação |
|---|---|---|---|
| R1 | `0.0` confirmado graficamente idêntico a `n/d` no Atual × Alvo | marcador explícito de origem quando `plotted="true" && current === 0`, na cor do próprio domínio; texto continua `0.0` × `n/d`; linha sem base atual **não** recebe marcador | `ACEITE-R1-5.0.5`: 5 domínios com `current=0.0`, `plotted=true`, marcador presente com espessura > 0, rótulo `0.0`; contraprova com linhas sem base: zero marcadores, rótulo `n/d` |
| R2 | `"3 de 2 respostas confirmadas"` | contagem e limiar passam a ser grandezas declaradas separadamente: `"3 respostas confirmadas · mínimo requerido: 2"`; idem na linha global (`"15 respostas confirmadas no total · mínimo requerido: 10"`). Os números continuam vindo do contrato UI-012A e o renderer segue **sem** os literais `10`/`2` | `ACEITE-R2-5.0.5` + P50-SUF0/SUF3 verdes; a forma `(N de M)` do **déficit**, correta quando N < M, foi preservada e é asserida |
| R3 | mensagem de diagnóstico do lint presa à 5.0.4 | o lint deixa de guardar uma "microfase futura" e passa a guardar o que é permanente: área fora de escopo (§15/§23) e dependência exclusiva de teste; mensagem reescrita | gate ativo e verde; sentinelas `P50-ACC7`/`P50-VIS11` mantidos porque não existem na REV B |
| R4 | `aria-label` redundante em presence/UNSET | o complemento acessível deixa de repetir o rótulo visível | `ACEITE-R4-5.0.5`: rótulo aparece exatamente 1× no nome acessível; UNSET × NONE continuam com DOM, rótulo e nome acessível distintos (P50-UX11/SUF6 verdes) |

**R5, R6 e R7 não foram reabertos**, conforme a §7 da diretriz: versão nominal de browser,
dependência de Git do P50-PR1 e comparação por prefixo do UG8 permanecem ressalvas aceitas.

---

## 7 · Resultados por gate

### 7.1 P50-VIS1..VIS4 — layout por viewport

Fixtures P50-F2 e P50-F5, nos quatro viewports canônicos. Cada viewport mede **12 superfícies**:
assessment, mapa do assessment expandido e as quatro tabs de Results, para as duas fixtures.

Exigido e observado em 100% dos casos:

```text
document.scrollingElement.scrollWidth <= viewport.width   (tolerância 0 px)
overflow horizontal do documento                          0 px
controles essenciais presentes, visíveis e alcançáveis    navegação, perguntas, answer cards,
                                                          notas, sidebar, suficiência e Results
texto funcional oculto ou clipado                         0
pageErrors                                                0
```

A única região que excede a largura em 390 px é a tabela alternativa, **contida em
`.p50-alt{overflow-x:auto}`** e agora focável por teclado (§6.4) — padrão responsivo legítimo,
reconhecido nominalmente pelo gate, não silenciado.

390 px foi tratado como obrigação de **renderização utilizável e sem perda de função**, não como
promessa de experiência mobile sofisticada.

### 7.2 P50-VIS5 — foco visível

Travessia **exclusivamente por teclado**, com o ponto de partida de navegação sequencial
reposicionado no `<body>` e o ciclo percorrido por inteiro; em Results, uma travessia por tab.
Diagnóstico por elemento em `P50-VIS5-focus-<fixture>-<largura>.json`.

**46 elementos** do fluxo crítico verificados nos quatro casos (contra 10 antes da correção H9):

```text
assessment (P50-F2, 1440 e 390)   12 cada · prev/próxima/mapa do shell P50, os 5 answer cards
                                   congelados, atalho de evidência, #notetgl, #notetxt, #next
results    (P50-F5, 1440 e 390)   11 cada · 4 tabs, 4 painéis, região rolável, exportar, importar
```

Para cada elemento: `document.activeElement.matches(":focus-visible") === true`; indicador nominal
identificado (outline/box-shadow/border); espessura computada > 0; não clipado por nenhum ancestral
com `overflow` cortado; e contraste do indicador **≥ 3:1** contra o fundo próprio **e** contra o
entorno imediato. Seletor, propriedade, cores adjacentes, razão e veredito ficam gravados.

O **piso de cobertura** é declarado nominalmente no gate: não alcançar os botões do shell, os cinco
answer cards, o atalho de evidência, `#notetgl`, `#notetxt`, `#next`, as tabs, os painéis, a região
rolável ou os botões de sessão é FAIL — uma travessia que não alcançasse nada não pode passar por
"nenhuma falha".

### 7.3 P50-VIS6 — zoom 200%

1366×768 com zoom de página de 200%, emulado com fidelidade (683×384 CSS · `deviceScaleFactor: 2`),
não por `transform: scale`. Observado: **zero** overflow horizontal do documento e **zero** clipping
de texto ou controle do fluxo crítico, nas duas fixtures e nas quatro tabs.

### 7.4 P50-VIS7..VIS9 — preservados

Reexecutados com os oráculos da 5.0.4, sem redefinição: labels disjuntos, contidos e não clipados
(VIS7); encoding de UNSET e dos três estados nas superfícies novas (VIS8); Current × Target somente
pelo alvo canônico, com o polígono atual inalterado (VIS9).

### 7.5 P50-VIS10 — print, sem escopo novo

Encerrado **apenas** como agregação factual da regressão de print já normativa, executada de verdade
nesta rodada, com exit code próprio por componente. Nenhum arquivo do pipeline de print foi lido,
escrito ou decorado; nenhuma semântica nova de print foi criada.

| componente | comando real | resultado |
|---|---|---|
| UI 3.3.2 / P1–P11 | `node tests_ui_m332.js` | 23 PASS · 0 FAIL de 23 · P1..P11 todos PASS |
| gates visuais de print | `npx playwright test tests_visual/print.spec.js` | 7 executados · 0 falhas · 21 skips de **recorte de projeto** declarado pela suíte congelada (7 × 4 = 28) |
| UG aplicáveis a print | `node tests_unset_ug.js` | 13 PASS · 0 FAIL de 13 · UG4, UG6 e UG9 PASS |
| P50-PR1 | guard desta suíte | PASS — **adicional**, jamais substituto |

Regra explícita no gate: SKIP de gate real, timeout, sinal ou exit ≠ 0 **nunca** contam como PASS.

### 7.6 P50-ACC1 — axe-core

`@axe-core/playwright@4.13.0` com `AxeBuilder`, sobre as fixtures P50-F2, P50-F5 e P50-F6 nos quatro
viewports = **12 relatórios** `P50-ACC1-axe-<fixture>-<largura>.json`. Cada relatório cobre **5
varreduras** (assessment + as quatro tabs de Results), restritas por `include` aos containers da
Camada 5: `#p50-shell`, `#p50-suff`, `#p50-results`, `#app .p50-chips`, `#app .p50-cueblock`,
`.p50-ses`.

```text
ruleset      wcag2a · wcag2aa · wcag21a · wcag21aa · wcag22aa
severidades bloqueantes   critical · serious
varreduras   60        checagens aprovadas   1.051
violações critical/serious   0        incompletos (não bloqueantes)   39
limitações formalmente aceitas   NENHUMA — a lista está vazia
```

Nenhuma regra foi desabilitada e nenhuma violação foi "aceita": as duas violações `serious`
encontradas na primeira execução foram **corrigidas** (§6.4) ou eliminadas na origem da medição
(§ H10). O gate reprova também execução com versão de axe divergente da fixada.

### 7.7 P50-ACC2 — fluxo canônico só por teclado

O runtime congelado só publica Results em `RESULTS_STEP`; não existe atalho e criá-lo seria mudança
de produto. O fluxo executado portanto **contém** o exigido pela spec e o excede: 15 perguntas
respondidas por tecla numérica, nota registrada na primeira pergunta (`#notetgl` alcançado em 10
tabulações, `#notetxt` em 14, fechamento em 13), etapas posteriores atravessadas e Results
alcançado — tudo por teclado, **sem nenhum `window.__DEV.*` e sem nenhum `page.focus()`** no caminho.

```text
estado canônico final (teclado) === estado canônico final (mouse)     TRUE
oráculo: captureCanonicalInputs()   (cinco owners canônicos)
nota digitada por teclado chegou ao owner canônico notes              TRUE
superfície nova de Results e painel de suficiência presentes          TRUE nos dois fluxos
```

O fluxo por mouse percorre `refbranch(#ref-skip-all) → priority(#next) → results` e o de teclado
`refbranch → results`: caminhos diferentes do runtime congelado, **mesmo estado canônico**. A
assimetria está registrada na evidência e a não chegada de qualquer um dos dois a Results também
reprova o gate.

### 7.8 P50-ACC3 — ordem de foco

Ordem de tabulação conferida contra a ordem do **documento** (ordem semântica), com a geometria de
cada parada registrada para leitura independente. Zero inversões. Ausência de armadilha provada por
fechamento do ciclo e por `Shift+Tab` movendo o foco.

O tablist de Results segue o padrão ARIA e é verificado **como tal**, não ignorado: exatamente 1
parada de Tab (roving `tabindex`), exatamente 1 `aria-selected="true"`, `role="tablist"` presente, 4
tabpanels para 4 tabs, `ArrowRight` navegando de fato — e a navegação por setas **não altera estado
canônico**.

### 7.9 P50-ACC4 — contraste e target size

Medição programática sobre 7 combinações de fixture/tela/viewport, em repouso de animação, com o
fundo **efetivo** resolvido na árvore, a cor composta quando semitransparente e a **opacidade
acumulada** dos ancestrais considerada. A aritmética WCAG vive no oráculo, nunca é lida do produto.

```text
combinações texto/fundo medidas      108        todas PASS
pior razão observada                 4.582:1    (limiar 4.5:1)
controles interativos medidos          15        todos PASS
menor alvo                        72,6 × 44 px  (mínimo AA 24 × 24; referência de conforto 44 × 44)
controles abaixo de 44 px               0
```

Tabela integral com seletor, foreground, background, opacidade efetiva, tamanho, peso, razão,
limiar e veredito em `P50-ACC4-contrast.json`.

### 7.10 P50-ACC5 / P50-ACC6 — preservados

Reexecutados sem redefinição: alternativa acessível com os mesmos dados do heat map (ACC5) e estado
selecionado programático coerente com o estado canônico (ACC6).

### 7.11 P50-COR4 — autoridade de cor

Cinco verificações independentes: (a) `tests_visual/screen.spec.js`, `print.spec.js`,
`session.spec.js`, `fixtures.js`, `playwright.config.js` e `tests_icons_m46.js` byte-idênticos aos
hashes fixados; (b) o teste `V4+V5 progress semantics` continua existindo e asserindo os cinco
tokens `--ftnt-*`; (c) os cinco tokens continuam resolvendo para os valores congelados em
`ui_ux_v32.css`; (d) nenhum módulo da Camada 5 declara custom property de cor própria; (e) cada
token aparece **exatamente uma vez** no HTML construído. Nenhuma paleta nova foi criada.

### 7.12 P50-IC1 / P50-IC2 / P50-IC4 — ícones

Nenhuma superfície P50 atual possui `itemId` canônico. Conforme a §7 da diretriz, **nenhuma seção
decorativa foi criada** para satisfazer o teste: o que existe é um **renderer reutilizável**
(`window.__P50.iconNode`) que resolve exclusivamente por `window.__V32UI.iconFor(itemId, name)` e é
provado por fixture controlada de itemIds reais.

```text
P50-IC1   fortisiem · fortianalyzer · fortiedr · fortisoar
          -> <img class="v32-icon"> com src IDÊNTICO ao servido por ICONS_V32 e data-icon igual
P50-IC2   fortisat · endpoint-family · fortimail-family · identity-family · soc-platform-family
          -> <span class="v32-icon-fb"> com as iniciais do oráculo; nenhum src de produto
ícones renderizados em superfície P50 visível            0   (nada fabricado)
mapa paralelo, SVG/base64 de produto ou cópia de mapa    0   (P50-IC3 verde)
P50-IC4   suíte ICONS 4.6 reexecutada: 12 PASS · 0 FAIL de 12
```

O oráculo **não** é o renderer: é `iconFor()` chamado diretamente mais o mapa congelado, ambos lidos
do runtime. O renderer materializa a string do runtime por `DOMParser` (inerte) e só aceita
`img.v32-icon` ou `span.v32-icon-fb`, sem filhos e sem atributo de evento; qualquer outra coisa
devolve `null` em vez de entrar na árvore viva.

---

## 8 · Localidade, desempenho e texto sensível

Medido em Chromium real sobre o **dataset canônico máximo** (15 respostas confirmadas + nota longa
nas 15 perguntas), com sink de requisições ativo durante todo o fluxo.

```text
requisições totais nos fluxos testados     1
requisições externas (http/https/ws/wss)   0
esquemas observados                        file
```

Lint por **construção** (nunca por vocabulário — "Detection & Telemetry" é título de grupo do
landscape congelado e `security-analytics` é id canônico de capability) sobre o HTML construído,
com **zero ocorrências** em 16 verificações: recurso remoto em `src`/`href`, `@import` remoto, fonte
remota, endpoints de analytics, `gtag`/`ga`, `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`,
`localStorage`, `sessionStorage`, `indexedDB`, `serviceWorker`, `EventSource`, `Notification` e
`geolocation`. Nenhum claim novo de autosave (P50-SESUX1A/1B verdes).

Latências observadas — **nenhum budget normativo foi inventado**; UI-044 proíbe expressamente:

| operação | n | mínimo | mediana | máximo |
|---|---|---|---|---|
| seleção de resposta | 12 | 0,7 ms | 0,9 ms | 10,0 ms |
| navegação (próxima/anterior) | 24 | 0,8 ms | 0,9 ms | 1,4 ms |
| abertura de Results | 1 | 19,6 ms | 19,6 ms | 19,6 ms |
| troca de tab | 6 | 0,3 ms | 1,7 ms | 3,1 ms |

O limiar de **materialidade** declarado no artefato (1.000 ms) existe apenas para separar "lento a
ponto de prejudicar o uso" de "medido e registrado" — a maior latência observada está ~50× abaixo
dele. Medição com layout forçado (`offsetHeight`), portanto inclui o render, não só o JavaScript.

Safe rendering adversarial (UI-049) continua verde: **P50-UX12 PASS** para `<script>`,
`<img onerror>`, `<svg/onload>`, aspas, sinais de maior/menor e casos de Unicode.

Orientação sobre dado sensível: presente, curta e sem alarmismo (§6.5).

---

## 9 · Evidências

Todas determinísticas e geradas por execução real. **As evidências das microfases 5.0.1 a 5.0.4
foram preservadas byte a byte** — a suíte grava exclusivamente artefatos da microfase corrente
(prefixo `P50-5.0.5-`) mais os artefatos que a spec exige **por nome** e que não existiam no acervo,
verificados antes da implementação. Confirmado por `sha256sum -c` do manifesto anterior: nenhuma
divergência.

Sob campanha de mutação a escrita de evidência é suprimida (`P50_NO_EVIDENCE=1`), inclusive nos
subprocessos que o P50-VIS10 dispara.

| artefato | quantidade |
|---|---|
| `P50-geometry.json` (medidas consolidadas + `pageErrors`) | 1 |
| `P50-ACC1-axe-<fixture>-<largura>.json` | 12 |
| `P50-VIS5-focus-<fixture>-<largura>.json` | 4 |
| `P50-ACC4-contrast.json` | 1 |
| `P50-5.0.5-vis-assessment-<fixture>-<largura>.png` | 8 |
| `P50-5.0.5-vis-results-<fixture>-<largura>.png` | 8 |
| `P50-5.0.5-zoom200-*.png` | 4 |
| `P50-5.0.5-acc2-keyboard-*` (equivalência + captura) | 2 |
| `P50-5.0.5-accessibility-surface.json` | 1 |
| `P50-5.0.5-vis10-print-aggregation.json` | 1 |
| `P50-5.0.5-locality-latency.json` | 1 |
| `P50-5.0.5-icons.json` | 1 |
| `P50-5.0.5-r1-zero-vs-nd-1440.png` | 1 |
| `P50-5.0.5-mutation.json` (campanha, em cópia temporária) | ver §10 |

`docs_phase5/MANIFEST_PHASE5_P50.sha256` foi regenerado **por último**, conforme a §9 da diretriz.

---

## 10 · Rodada de assurance final (única, com exit próprio por comando)

Executada de ponta a ponta sobre a candidata entregue. Nenhum PASS foi atribuído a timeout, comando
interrompido ou SKIP de gate real.

| # | comando | exit | resultado |
|---|---|---|---|
| 1 | `npm ci --engine-strict` | 0 | 43 pacotes, 0 vulnerabilidades |
| 2 | `npm run test:all` | 0 | ver contagens abaixo |
| 3 | `npm run test:visual` | 0 | **67 passed · 0 failed · 37 skipped** |
| 4 | `python3 build_v32_html.py` (build A) | 0 | `c40d97358beaf52f286209b93143f74f4665011a1229f65015c2e6561efce09f` |
| 5 | `python3 build_v32_html.py` (build B) | 0 | `c40d97358beaf52f286209b93143f74f4665011a1229f65015c2e6561efce09f` — **byte-idêntico** |
| 6 | `npm run test:m41` | 0 | payload `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` |
| 7 | `git diff --check` | 0 | limpo |

O HTML medido antes da rodada, o build A e o build B são **o mesmo SHA-256**: o artefato testado é
exatamente o entregue e o build é determinístico.

### Contagens integrais

| suíte | esperado (baseline) | observado |
|---|---|---|
| ENGINE / MATRIZ | 105 | **105 PASS · 0 FAIL** |
| UI 3.1 | 19 | **19 PASS · 0 FAIL** |
| UI 3.2 | 25 | **25 PASS · 0 FAIL** |
| UI 3.3.1 | 11 | **11 PASS · 0 FAIL** |
| UI 3.3.2 (print/PDF) | 23 | **23 PASS · 0 FAIL** |
| UI 3.3.3 | 26 | **26 PASS · 0 FAIL** |
| UX 4.1 | 56 | **56 PASS · 0 FAIL** |
| TARGET 4.3.1 | 30 | **30 PASS · 0 FAIL** |
| REF 4.4 | 28 | **28 PASS · 0 FAIL** |
| JOURNEY 4.5 | 31 | **31 PASS · 0 FAIL** |
| ICONS 4.6 | 12 | **12 PASS · 0 FAIL** |
| SESSION 4.8 | 97 | **97 PASS · 0 FAIL** |
| UNSET GEOMETRY (UG) | 13/13, UG13 real | **13 PASS · 0 FAIL · UG13 PASS em Chromium real** |
| M41 | PASS + payload exato | **PASS · payload `9794b267…`** |
| visual (Chromium) | 67/0/37 | **67 passed · 0 failed · 37 skipped** |
| P50 CORE | — (novo teto) | **38 PASS · 0 FAIL de 38** |
| P50 CHROMIUM | — (novo teto) | **24 PASS · 0 FAIL de 24 · zero SKIP** |

`UG13` executou em Chromium real e reportou **PASS**, não SKIP. A suíte P50 Chromium enumera
nominalmente os 20 gates que declararia NÃO EXECUTADOS na ausência de browser; nesta rodada
**nenhum** foi declarado assim.

### Campanha histórica de mutação

Executada **integralmente** em cópia temporária, com `tests_p50_mutants.js` byte-idêntico ao HEAD
(`28f2e876…`) — o arquivo não foi modificado.

```text
MUTATION TESTING (5.0.1+5.0.2+5.0.3) [tests_p50_mutants.js · namespace P50]:
53/53 mutantes detectados pelo gate e motivo esperados          exit 0
```

Fontes sob mutação = as fontes **finais** desta candidata; a cópia foi restaurada byte a byte ao
final (verificado). A escrita de evidência ficou suprimida durante toda a campanha
(`P50_NO_EVIDENCE=1`), inclusive nos subprocessos que o P50-VIS10 dispara. Relatório integral em
`docs_phase5/evidence_p50/P50-5.0.5-mutation.json`.

### Runtime congelado e protegidos

```text
engine_v32.js                9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a  (intocado)
payload funcional M41        9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b  (intocado)
build_v32_html.py            bce37fef5e4722e6e6215186f33c9f0af030bb03e706504a30ca80fededc07bc  (byte-idêntico ao HEAD)
fixtures_p50.js              08610c8f92238eefb82a07ec57cb1ab9cdbb626cad1c9483d278e26ed572443f  (byte-idêntico ao HEAD)
tests_p50_mutants.js         28f2e876d4f614baf83b02d0c23bbbf19a983d4b0a943e1b42d1f8c8c067ddf5  (byte-idêntico ao HEAD)
```

`git diff --name-only HEAD`, filtrado contra a lista da boundary autorizada, devolve **vazio**.
Os hashes dos protegidos são reasseridos a cada execução por P50-GOV1 e, para a autoridade de cor e
de ícones, por P50-COR4 e P50-IC4.

### Manifesto

`docs_phase5/MANIFEST_PHASE5_P50.sha256` regenerado **por último**, por enumeração independente: a
união entre os caminhos já registrados nas entregas anteriores e o delta reportado por
`git status --porcelain`, excluindo apenas a si próprio. Zero duplicatas, zero auto-referência,
zero ausentes. As 36 evidências de 5.0.1–5.0.4 foram reconferidas por `sha256sum -c` contra o
manifesto anterior: **todas byte-idênticas**.

---

## 11 · Blockers reais

**Nenhum.** Não houve, em momento algum, necessidade de tocar arquivo ou símbolo protegido fora da
change boundary; nenhum risco de score, suficiência, Target, sessão ou estado canônico incorreto foi
observado; nenhuma regressão de relatório ou print ocorreu; a árvore permaneceu íntegra.

As três correções que envolveram **superfícies congeladas** foram resolvidas **dentro** da Camada 5,
sem editar arquivo protegido: o anel de foco dos controles congelados é reposicionado por regra
aditiva em `ui_p50_v32.css` (§6.3), confinada a `@media screen`, sem alterar a regra de `overflow`
da Camada 1 e sem remover indicador algum.

---

## 12 · Limitações não bloqueantes

1. **Versão nominal de browser (R5, mantida).** Evidência gerada com Chromium `151.0.7922.34`
   contra o nominal `141.0.7390.37` da §25.6. Declarado em cada artefato como
   `nominalDeviationAccepted: true`. Não reaberto, conforme a §7 da diretriz.
2. **Dependência de Git do P50-PR1 (R6, mantida).** O guard lê o baseline de entrada por
   `git show`. A cópia temporária da campanha de mutação foi criada **com** `.git` por essa razão;
   uma cópia sem repositório faria o gate falhar com diagnóstico explícito — comportamento correto
   e honesto, apenas não portátil.
3. **Comparação por prefixo em UG8 (R7, mantida).** Sugestão cosmética de endurecimento futuro,
   fora da boundary desta microfase.
4. **Margem estreita de contraste em `--faint` sobre `--surface2`: 4,582:1** contra o limiar de
   4,5:1. **Conforme**, mas com folga de apenas 0,08. Os dois tokens são congelados
   (`ui_v32.css` / Camada 1) e alterá-los está fora da boundary; a combinação foi mantida como
   projetada e fica **registrada** para decisão do proprietário, não silenciada. É a pior razão das
   108 combinações medidas.
5. **`frozenIconsStillRendered: 0`** no artefato de ícones é informativo, não asserção: a fixture
   usada (tela de pergunta) não renderiza listas `.v32-cand`. A preservação do comportamento
   congelado de ícones é asserida por **P50-IC4** (ICONS 4.6 · 12/12) e por P50-GOV1.
6. **39 resultados `incomplete` do axe** nas 60 varreduras. `incomplete` não é violação: é item que
   a ferramenta não consegue decidir automaticamente. Nenhum deles foi promovido a violação e
   nenhum foi usado para justificar exclusão.
7. **Assimetria de caminho no P50-ACC2.** Teclado e mouse chegam a Results por sequências
   diferentes do runtime congelado (`refbranch → results` contra
   `refbranch(#ref-skip-all) → priority(#next) → results`). O **estado canônico final é idêntico**,
   que é o que o gate afere; a diferença está registrada na evidência.
8. **P50-VIS10 torna `npm run test:all` mais lento**, porque reexecuta de fato a regressão de print
   (UI 3.3.2, `print.spec` e a suíte UG) em vez de ler contagens de um relatório anterior. É o
   custo deliberado de uma agregação factual.

Nenhuma limitação do axe foi "aceita": a lista de limitações formalmente aceitas de P50-ACC1 está
**vazia**, e as duas violações `serious` da primeira execução foram corrigidas.

---

## 13 · Escopo — o que NÃO foi feito

Nada fora do escopo da §2 da diretriz foi tocado: engine, scoring, question bank e metodologia
intactos; nenhuma pergunta nova ou semântica condicional; nenhum mapeamento NIST/CIS; nenhum
Basic/Advanced Modelo 2; nenhum autosave, backend, cloud, vault, autenticação ou persistência;
**nenhuma semântica nova de print/PDF** e nenhuma edição do pipeline de print; UI-010/estimativa de
tempo permanece removida (DL-5); assets oficiais e paleta congelada não foram revisados; nenhum
hardening de segurança além do safe rendering já normativo e dos checks de acessibilidade exigidos.

**Nenhum trabalho posterior à Phase 5.0 foi iniciado.**

---

## 14 · Atos NÃO realizados

Confirmação explícita: **não** houve `commit`, `push`, `PR`, `merge`, `tag`, `freeze`, `release` nem
`deployment`. A branch `feat/phase5-5-0-5` existe apenas localmente, com a árvore de trabalho
modificada e **nenhum commit**. Zero tags e zero releases no repositório.

Este relatório **não** declara a microfase concluída, aprovada ou congelada, e **não** contém
autoauditoria.

---

## 15 · Parada

A candidata está completa e a evidência preparada. A execução **para aqui**, uma única vez, para
uma **auditoria independente orientada a risco** que cubra conjuntamente:

1. a microfase 5.0.5;
2. a regressão acumulada das microfases 5.0.1–5.0.4;
3. o fechamento funcional e visual da Phase 5.0 como conjunto.

---

## 16 · Identidade da candidata

```text
branch                       feat/phase5-5-0-5   (sem commits; HEAD continua 3b8d76be…)
HTML construído              c40d97358beaf52f286209b93143f74f4665011a1229f65015c2e6561efce09f
engine_v32.js                9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
payload funcional M41        9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
ui_p50_shell_v32.js          957141ec1e26a945b22969c649a3b0a1e41f4855eb69d4ea73889e765aaffbf6
ui_p50_suff_v32.js           a9931330021949b581da29012be7669edf75529aaaaa9c2f13d0165494b86f5b
ui_p50_results_v32.js        4c2965f7befdf2f907d6502d28f94ef8f8603cbf4a9cd3fdecc802d6e4a8b66e
ui_p50_v32.css               3e4835200c7faa6cef53d7719648100c9c3d416e74c7d6a2cba933606bee4a50
tests_p50_core.js            b2b8b01f07cbc3bcba017c8ab8156ca05415dfaa4c7204eae4a133d8709c38b8
tests_p50_chromium.js        d06860c78f844e2dbc0e964bddd743a05fb87e8275cad2183bcd27d52f3294a4
fixtures_p50.js              08610c8f92238eefb82a07ec57cb1ab9cdbb626cad1c9483d278e26ed572443f  (intocado)
tests_p50_mutants.js         28f2e876d4f614baf83b02d0c23bbbf19a983d4b0a943e1b42d1f8c8c067ddf5  (intocado)
build_v32_html.py            bce37fef5e4722e6e6215186f33c9f0af030bb03e706504a30ca80fededc07bc  (intocado)
package.json                 1c8d844d972ccb4a691d8c5b3c3d544d5b514bef68eb5187dbe60121164304c7
package-lock.json            abe535af33ccd636a022c014af038cb5aa20294a23328595722246b1ca24f75f
MANIFEST_PHASE5_P50.sha256   111 entradas · SHA declarado FORA deste arquivo (ver abaixo)
```

Este relatório é o **último** artefato textual da entrega; o manifesto foi regenerado **depois** dele
e o cobre. Por isso o SHA-256 do manifesto **não** é gravado aqui — seria autorreferência
insolúvel, pelo mesmo motivo pelo qual a spec promovida não grava o próprio SHA (P50-GOV2). O
fechamento mecânico é: `sha256sum -c` das 111 entradas do manifesto passa integralmente, e o SHA do
manifesto é declarado no handoff da entrega.
