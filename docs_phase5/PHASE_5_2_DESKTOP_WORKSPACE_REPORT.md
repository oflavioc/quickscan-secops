# Phase 5.2 — Desktop Workspace & Results Information Architecture

**Etapa A · implementação, testes dirigidos e preview local**
Branch `feat/phase5-5-2-desktop-workspace` · sem commit, push, PR, merge, tag, release ou promoção.
Diretriz: `DIRETRIZ_PHASE_5_2_DESKTOP_WORKSPACE_RESULTS_UX.md`
· SHA-256 `d23abba488b18789c66d90005376b9e4f9b5ace7d5a7e004587934f7e7ecd82e` · 25.518 bytes · 666 linhas · UTF-8 sem BOM · zero CRLF (conferido antes de qualquer edição).

Este relatório **não declara a fase concluída** e **não contém autoauditoria**. A execução para
aqui, para a UAT visual do proprietário.

> **Adendo posterior — Revisão A da UAT visual.** O primeiro ciclo de validação visual do
> proprietário gerou o documento `AJUSTE_UAT_VISUAL_PHASE_5_2_REV_A.md`
> (SHA-256 `2545480c…e981dc4`), aplicado sobre esta mesma candidata na mesma branch. As mudanças da
> REV A — home, contexto tecnológico, visão executiva, hierarquia da suficiência, resumo dos
> domínios, normalização óptica dos ícones e mapa do assessment — estão registradas em
> **`PHASE_5_2_UAT_REVISION_A_REPORT.md`**, que também traz a identidade da candidata vigente. Este
> documento permanece válido para tudo o que a REV A não tocou.

---

## 0 · Preflight — baseline de entrada

Todas as identidades da §1 da diretriz conferiram **antes** de qualquer edição:

| item | esperado | observado | veredito |
|---|---|---|---|
| branch inicial | `main` | `main` | OK |
| HEAD local | `d3886812718e7ad9c5024880067133fbddf2fc4d` | idem | OK |
| `origin/main` | `d3886812718e7ad9c5024880067133fbddf2fc4d` | idem | OK |
| ahead/behind | 0/0 | 0/0 | OK |
| HTML de entrada | `12bb950f…eebbf9d9` · 744.179 B | idem | OK |
| `engine_v32.js` | `9a4a2e67…2b5d247a` | idem | OK |
| payload M41 | `9794b267…3ed4365b` | idem | OK |
| `docs_phase5/MANIFEST_PHASE5_P50.sha256` | `a6b13586…3abbd8ab782` | idem | OK |
| `ui_p50_results_v32.js` | `4c2965f7…6d4a8b66e` | idem | OK |

`AGENTS.md` estava presente como arquivo **não rastreado e preexistente**. Não foi apagado, editado,
staged, commitado nem incluído em manifesto algum — exatamente como a §1 determina.

Branch criada: `feat/phase5-5-2-desktop-workspace`.

---

## 1 · O que foi entregue

A tela deixou de ser uma pilha vertical de cartões e passou a ser um **workspace**: um trilho de
navegação lateral e nove seções nomeadas, com grade de 12 colunas em desktop, largura útil que
acompanha a viewport e uma ordem de leitura declarada. A tela de pergunta virou uma grade de linhas
explícitas, com o rodapé de atribuição ocupando a faixa inferior inteira.

Nada do método mudou: engine, payload M41, perguntas, pontuação, suficiência, Target, sessão e
recomendações permanecem byte-idênticos ou funcionalmente idênticos (§4 desta entrega).

### 1.1 Arquitetura

O owner de layout é a **Camada 5.2**, composta por dois módulos novos:

```
ui_p52_workspace_v32.js    owner de layout · decorador idempotente, zero innerHTML
ui_p52_workspace_v32.css   toda decisão de layout dentro de @media screen
```

O módulo **não possui estado canônico**. Ele lê apenas o que já é público no runtime congelado
(`TARGET_PROFILE.overrides`, `data-p50-gate`, `aria-expanded`, `.f-tag.sev-*`, `DOMS[i].pt`) e
**move os nós originais** — com os handlers e o ARIA que os owners lhes deram — para dentro de
seções. Nenhum nó é clonado, nenhum é recriado, nenhum cálculo é reimplementado.

**Duas entradas, um decorador.** `window.__uxDecor` é invocado por `renderResults()` — isto é,
**antes** de `uxAfterRender()` gravar `body[data-uxscreen]` e antes de o owner congelado recriar
`#ux-execrow`. Um layout montado só ali ficaria uma passagem atrasado a cada transição de tela e
seria desfeito em seguida. A Camada 5.2 registra-se no agregador `window.__P50.registerDecor` **e**
embrulha `render` (mesmo padrão já estabelecido pelas camadas 4.1 e 5.0: predecessor sempre, e
antes). As duas entradas chamam o mesmo decorador **idempotente**, que desmonta o que montou antes
de remontar — provado por `P52-LAY5`.

### 1.2 Ordem de leitura (P52-RES2)

```
1 Visão executiva      2 Cenário-alvo        3 Contexto tecnológico
4 Evidência e suficiência                    5 Domínios e heat map
6 Prioridades do negócio                     7 Gaps observados
8 Formas de apoio                            9 Relatório e sessão
```

A ordem do DOM **é** a ordem visual e a ordem de foco: nenhuma seção é reposicionada por `order` ou
por `grid-row` (P52-ACC2). "Gaps observados" é **um** item de navegação com **dois** grupos
estruturais internos — altos e moderados nunca se misturam.

### 1.3 Ponto que exige decisão do proprietário — gate FECHADO

A §7 exige, no mesmo parágrafo, que com o gate de suficiência fechado *"o painel de suficiência
ganhe destaque no primeiro viewport"*; a §8 exige que o cenário-alvo venha *"imediatamente depois da
visão executiva"*. Com o gate fechado as duas cláusulas se tensionam.

**Medição real na candidata**, 1440×900, fixture de gate fechado: com a ordem canônica pura, o topo
do painel de suficiência ficava a **~2.960 px** do topo do documento — cerca de três viewports.

**O que foi implementado, e é reversível numa linha:**

1. com o gate **fechado**, "Evidência e suficiência" sobe para logo depois da visão executiva —
   `exec > evidence > target > context > detail > …`. O trilho anuncia exatamente a mesma ordem;
2. em **ambas** as ordens o cenário-alvo continua **antes** do contexto tecnológico;
3. a visão executiva ganha um **ponteiro de navegação** — *"Ver o que falta para liberar o
   resultado"* — dentro do primeiro viewport em todas as oito viewports obrigatórias. É
   **navegação, não veredito**: não repete contagem, limiar nem estado. Quem os declara continua
   sendo o painel de suficiência (UI-009A) e o renderer do gate;
4. com o gate **aberto** nada muda: vale a ordem canônica da §7 e o alvo é imediatamente posterior
   à visão executiva.

Reverter para a ordem canônica pura em todos os casos é trocar `p52OrderFor()` por `P52_SECTIONS`
em `ui_p52_workspace_v32.js`. **A decisão é do proprietário na UAT.**

### 1.4 Requisito por requisito

| requisito | o que foi feito | onde |
|---|---|---|
| **P52-LAY1** largura útil | `.wrap` passa a `width: min(96vw, 2480px)` com calha `clamp(16px,1.4vw,32px)`. O teto é 2480 e não 2400 porque em 3440 px a calha ainda consome 32 px de cada lado — assim o mínimo é atendido medindo a caixa de **borda** *e* a de **conteúdo** | CSS |
| **P52-LAY2** grade de 12 colunas | cada `.p52-sec` é `repeat(12, minmax(0,1fr))` em ≥1180 px; seções usam 12, 8+4, 7+5 ou auto-fit | CSS |
| **P52-LAY3** breakpoints | ≤767 uma coluna · 768–1179 coluna ampla com trilho em barra · 1180–1599 desktop com trilho · ≥1600 workspace expandido (a divisão lateral da visão executiva entra em ≥1700) | CSS |
| **P52-Q1** distribuição | `.wrap` da pergunta vira grade de **linhas explícitas**: `.top`, progresso móvel, `#app`, `#p50-shell`, `#annex` e `footer` têm linha e coluna declaradas. O baseline nomeava só duas áreas e deixava o resto em auto-placement — foi assim que a atribuição foi parar sob a coluna lateral | CSS |
| **P52-Q2** rodapé | `grid-column: 1/-1` por regra, faixa com linha divisória, atribuição à esquerda e contato à direita. O `footer` do baseline tinha teto de 780 px: removido. O conteúdo foi **embrulhado** em dois blocos sem alterar um único caractere | CSS + JS |
| **P52-Q3** evidência como botão | `#notetgl` continua sendo o **único** controle, com o rótulo que a 5.1 lhe deu. Ganha borda, 44×44 mínimo, foco visível e o símbolo `＋`/`−`/`✎` por `::before` — **fora** do nome acessível, para não criar um segundo alvo nem alterar o texto que o gate `P51-UX1` fixa | CSS + JS |
| **P52-RES1** trilho | `<nav>` com nome acessível, âncoras reais, `aria-current`, item ativo distinguível por **forma, borda, peso e texto** ("seção atual"), scroll spy por `IntersectionObserver`, foco levado à seção, barra rolável no mobile | JS + CSS |
| **P52-RES2** ordem | ver §1.2 e §1.3 | JS |
| **P52-RES3** visão executiva | KPI/estágio · radar · leitura+domínios. **A largura da `.radar-box` é gate visual congelado (V1: 420 px ≥1200, 460 px ≥1500)** — a Phase 5.2 é layout, não geometria de dado: o radar mantém a medida exata e a composição se organiza ao redor dele. Em ≥1700 px a faixa executiva ocupa 8 colunas e o par de painéis as 4 restantes (~4/4/4) | CSS |
| **P52-RES4** "Próximo passo" | a caixa `.next` é **removida do DOM**. Nenhum substituto promocional entrou no lugar; recomendações, capabilities a validar e ações de PDF/sessão permanecem | JS |
| **P52-TGT1** posição e explicação | alvo antes do contexto em todas as ordens; parágrafo estável declarando que o alvo **não altera respostas nem score atual** e que só projeta Current × Target | JS |
| **P52-TGT2** editor | prática e baseline à esquerda, seleção à direita; grupos por domínio com acento canônico; duas colunas em ≥1600; barra de ações Salvar/Cancelar; selects com fundo e texto explícitos | CSS |
| **P52-TGT3** navegação | o trilho informa "sem cenário-alvo" ou "N práticas com alvo", derivado de `TARGET_PROFILE.overrides`. Zero controle editável dentro do trilho | JS |
| **P52-CTX1** contexto opcional | card com título, badge **Opcional**, explicação canônica e o botão `#v32cta` proeminente (≥44 px). Resumo de completude quando há contexto declarado. O contexto **não** virou pré-requisito | JS + CSS |
| **P52-CTX2/CTX3** grupos | `details[open]` com borda, acento, fundo e cabeçalho próprios; marcador `▾`/`▸`; **texto** de estado ("aberto"/"fechado") no summary; corpo do grupo agrupado; duas colunas em ≥1600 | JS + CSS |
| **P52-DOM1** tags de domínio | `data-dom` canônico por correspondência exata com `DOMS[i].pt`; amostra sólida na cor congelada, borda na cor congelada e texto na variante de contraste `--p50-dom-text`. **Zero hex duplicado no JavaScript**; `#DA291C` nunca é usado como cor de domínio | JS + CSS |
| **P52-GAP1** severidades | dois grupos com heading, contador, borda e marcador próprios; cards em auto-fit no desktop e uma coluna no mobile. A severidade é **lida** do rótulo que o renderer congelado imprimiu, nunca recalculada | JS + CSS |
| **P52-REC1** recomendações | grade de 12 colunas: cards de apoio em 6 colunas quando há mais de um, faixa inteira quando há um só; títulos de função em faixa própria. Nenhuma recomendação inventada, nenhuma perdida | CSS |
| **P52-ICON1** peso óptico | tile uniforme, `object-fit: contain`, caixa interna de 46 px (34 px no `.sm`). Bytes do asset intocados, sem recolorir, sem distorcer proporção | CSS |
| **P52-ACT1** barra de ações | Imprimir/PDF · Editar prioridades · Revisar · Exportar/Importar sessão · Nova sessão, com **Reiniciar** empurrado para a direita como ação destrutiva secundária, em tracejado | CSS |
| **P52-DOC1** manual | `USER_GUIDE.md` ganhou §8.1 (navegação da tela de resultados), a nomenclatura "suficiência de evidência", a distinção estrutural entre gaps altos e moderados, o caráter opcional do contexto e a orientação explícita sobre dados sensíveis na evidência. `README.md` ganhou a seção "Tela de resultados" | docs |

---

## 2 · Arquivos alterados

### 2.1 Novos (Camada 5.2)

| arquivo | SHA-256 |
|---|---|
| `ui_p52_workspace_v32.js` | `3be742910adc0e0cdcf5df0880c46ad76b1fc3a5cacba2736f2cef49a957c271` |
| `ui_p52_workspace_v32.css` | `72ca19ce98d7629ee6659254a9786cd1de0400a720eb4e8566d1305e00859dfc` |
| `fixtures_p52.js` | `466a66f0750b942cbdacc12d8ce07b7817a19c5a16084a5eaeba0d14c4b32512` |
| `tests_p52_layout.js` | `b8c794cd3d6a31d05fd5907bbcade02183a913bf2f036edd1926f45f755b0130` |
| `tests_p52_chromium.js` | `e87428735d619f9d1945e698f31f810db5e9c97a55bf992b0776c1773a1ec961` |
| `tests_p52_mutants.js` | `64019a3be0eeb72d4684cc423b3663253eeef044248234a8a813e63d4fb630a7` |
| `tools_p52_shots.js` | `ba2379e3c15dcff487a405be8774b6a99d6391a363cbf1c092b76af1e7868a90` |
| `docs_phase5/evidence_p52/` | 65 capturas + 13 arquivos de medição + `INDEX.md` |
| `docs_phase5/PHASE_5_2_DESKTOP_WORKSPACE_REPORT.md` | este documento |

### 2.2 Editados, com justificativa

| arquivo | mudança | autorização |
|---|---|---|
| `build_v32_html.py` | **injeção nominal** dos dois módulos novos (JS após o bloco P50 results; CSS após o bloco P50). Nenhuma outra linha | §4.2 da diretriz |
| `ui_v32.js` | **duas linhas** em `hideLegacyRecommendation()`: o escopo da varredura passa a ser a seção de apoio do workspace quando ela existe. A regra de ocultação e `HIDE_EYEBROWS` são byte-idênticas. Sem o hook, `renderBlocks()` chamado fora de `render()` (ação "Limpar contexto tecnológico") varreria uma lista de filhos que já não contém os blocos e deixaria a recomendação legada oculta indevidamente | §4.3 ("`ui_v32.js` apenas para hooks/apresentação V3.2 necessários") |
| `tests_p50_core.js` | **repin** de `ui_v32.js` em `PROTECTED` (gates `P50-GOV1` e `P50-IC4`), com o comentário de rastreabilidade e a identidade anterior preservada. Nenhuma asserção removida ou enfraquecida | precedente da 5.1, mesma disciplina |
| `USER_GUIDE.md`, `README.md` | §1.4, linha `P52-DOC1` | §4.3 |
| `package.json` | ver §2.3 | ver §2.3 |
| `quickscan_secops_soccmm_v3_2_dev.html` | artefato **derivado** do build determinístico | — |

**Não foram tocados:** `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, `ui_ux_v32.js`,
`ui_target_v32.js`, `ui_refinement_v32.js`, `ui_journey_v32.js`, `ui_session_v32.js`,
`ui_icons_v32.js`, `ui_v32.css`, `ui_ux_v32.css`, `generate_icons_v32.py`, `harness_m41_v313.js`,
`v3_1_3_functional_snapshot.json`, `tests_unset_ug.js`, `MANIFEST.sha256`, nenhuma suíte congelada,
`ui_p50_shell_v32.js`, `ui_p50_suff_v32.js`, `ui_p50_results_v32.js`, `ui_p50_v32.css`,
`fixtures_p50.js`, `tests_p50_chromium.js`, `tests_p50_mutants.js`, `tests_p51_mutants.js`,
`deploy/`, `AGENTS.md`.

O acervo `docs_phase5/evidence_p50/` foi **restaurado byte a byte** e a suíte foi reexecutada com a
supressão correta: `test:p50vis` regrava artefatos quando roda sem `P50_NO_EVIDENCE=1`, e esses
artefatos pertencem à linha 5.0/5.1 já integrada e byte-pinada. Execução final:
`P50_NO_EVIDENCE=1 npm run test:p50vis` → **27 PASS · 0 FAIL**, com
`git status --porcelain docs_phase5/evidence_p50/` devolvendo **zero** linhas.

### 2.3 Item de boundary que exige registro explícito

`package.json` recebeu **três scripts novos** (`test:p52`, `test:p52vis`, `test:p52mut`, os dois
primeiros encadeados em `test:all`) e **uma alteração de infraestrutura**:

```
"test:session": node --max-old-space-size=3072 → 4608
```

**Motivo material, medido:** o HTML construído cresceu de 744.179 para 808.749 bytes (+8,7%) com os
dois módulos novos. A suíte de sessão instancia dezenas de janelas jsdom sobre esse HTML e já
operava no limite do teto de 3.072 MB. Comprovação por A/B **na mesma máquina, no mesmo dia**:

| build | heap | resultado |
|---|---|---|
| baseline `12bb950f…` | 3072 MB | **97 PASS · 0 FAIL de 97** |
| candidata | 3072 MB | **abortou** — `FATAL ERROR: Reached heap limit` após 75 PASS |
| candidata | 4608 MB | **97 PASS · 0 FAIL de 97** |

Isto **não enfraquece gate algum**: as 97 asserções continuam executando integralmente e o exit code
continua real. O que mudou foi o teto de heap do interpretador, não o critério do teste. Fica
registrado aqui para decisão explícita do proprietário e da auditoria.

---

## 3 · Testes executados

### 3.1 Suítes novas da Phase 5.2

| suíte | resultado |
|---|---|
| `tests_p52_layout.js` (jsdom · estrutura) | **17 PASS · 0 FAIL de 17** |
| `tests_p52_chromium.js` (geometria, pixel, print, axe) | **14 PASS · 0 FAIL de 14** |
| `tests_p52_mutants.js` (campanha de mutação) | **10/10 mutantes detectados pelo gate e motivo esperados** |

**Cobertura da tabela §14.1 da diretriz**

| gate da diretriz | onde | veredito |
|---|---|---|
| P52-LAY1 largura útil por viewport | `P52-LAY1` (chromium, 8 viewports × 2 telas) | PASS |
| P52-LAY2 question grid + footer full-span | `P52-LAY2` (chromium, 8 viewports) | PASS |
| P52-LAY3 results workspace + ordem das seções | `P52-LAY3` (chromium) + `P52-LAY3/LAY4/LAY5` (layout) | PASS |
| P52-Q1 botão único de evidência | `P52-Q1` (layout) | PASS |
| P52-NAV1 navegação lateral, ativo e teclado | `P52-NAV1` (chromium) + `P52-NAV0` (layout) | PASS |
| P52-TGT1 Target antes de Context e current invariável | `P52-TGT1` + `P52-TGT3` (layout) | PASS |
| P52-CTX1 CTA opcional e grupo ativo distinguível | `P52-CTX1`/`P52-CTX2` (layout) + `P52-CTX1v` (chromium) | PASS |
| P52-DOM1 tags com domínio/cor/texto canônicos | `P52-DOM1` (layout) + `P52-DOM1c` (chromium) | PASS |
| P52-GAP1 grupos alto/moderado separados | `P52-GAP1` (layout) + `P52-GAP1v` (chromium) | PASS |
| P52-REC1 grid e completude de recomendações | `P52-REC1` (layout) + `P52-REC1g` (chromium) | PASS |
| P52-ICON1 peso óptico do FortiGuard | `P52-ICON1` (chromium, medida em pixel) | PASS |
| P52-PR1 isolamento de print | `P52-PR1` (chromium, A/B contra o baseline) | PASS |
| P52-DOC1 manual atualizado sem overclaim | `P52-DOC1` (layout) | PASS |

Gates adicionais além da tabela mínima: `P52-GOV1`/`P52-GOV2` (governança e identidade),
`P52-LAY4` (nenhuma superfície perdida ou duplicada), `P52-LAY5` (idempotência),
`P52-RES4` ("Próximo passo" removido sem substituto), `P52-GATE1`/`P52-GATE1v` (gate fechado),
`P52-ACC1` (axe), `P52-ACC2` (zoom 200%), `P52-ERR0` (zero erro de console).

**Viewports medidas em todos os gates geométricos:** 390×844 · 768×1024 · 1024×768 · 1280×800 ·
1440×900 · 1920×1080 · 2560×1440 · 3440×1440, mais zoom de 200 % em 1440×900.

### 3.2 Campanha de mutação — os dez mutantes da §14.3

| # | mutação | gate que detectou | motivo observado |
|---|---|---|---|
| P52-M1 | restaurar `max-width:980px` nos resultados | `P52-LAY1` | `largura útil 980px < 1180px` |
| P52-M2 | retirar `grid-column:1/-1` do footer | `P52-LAY2` | `rodapé com 320px de 1193px úteis` |
| P52-M3 | empilhar Target depois de Context | `P52-TGT1` | `contexto (1) antes do alvo (2)` |
| P52-M4 | deixar dois controles de evidência | `P52-Q1` | `2 controles de evidência` |
| P52-M5 | remover o marcador de grupo ativo do contexto | `P52-CTX1v` | `marcador de estado idêntico entre aberto e fechado` |
| P52-M6 | misturar gaps altos e moderados | `P52-GAP1` | `um dos grupos de severidade não existe` |
| P52-M7 | neutralizar as cores das tags de domínio | `P52-DOM1c` | `amostra rgb(44,44,49) != canônica rgb(144,99,205)` |
| P52-M8 | reduzir visualmente só o FortiGuard | `P52-ICON1` | `artwork aparente 49.9% do tile` |
| P52-M9 | vazar o trilho no print | `P52-PR1` | `vazou para o papel: trilho` |
| P52-M10 | permitir alvo inferior ao current confirmado | `TARGET 4.3.1` | `FAIL T3 — target confirmado nunca inferior ao atual` |

Cada mutante foi detectado pelo gate **semanticamente correspondente**, com motivo compatível.
Detecção incidental por manifesto ou por identidade de arquivo **não foi contada**. Todo source foi
restaurado e conferido byte a byte; o acervo de evidência ficou byte-idêntico durante toda a
campanha (escrita suprimida por `P52_NO_EVIDENCE=1`).

### 3.3 Regressão dirigida (smoke) das suítes congeladas

| suíte | baseline 4.8.0.7 | candidata |
|---|---|---|
| engine (M1–M40 + M42–M86 + P2.1) | 105 | **105 PASS · 0 FAIL** |
| UI 3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | 19 / 25 / 11 / 23 / 26 | **19 / 25 / 11 / 23 / 26 PASS · 0 FAIL** |
| UX 4.1 | 56 | **56 PASS · 0 FAIL** |
| TARGET 4.3.1 | 30 | **30 PASS · 0 FAIL** |
| REF 4.4 | 28 | **28 PASS · 0 FAIL** |
| JOURNEY 4.5 | 31 | **31 PASS · 0 FAIL** |
| ICONS 4.6 | 12 | **12 PASS · 0 FAIL** |
| UNSET (UG) | 13 | **13 PASS · 0 FAIL** |
| SESSION 4.8 | 97 | **97 PASS · 0 FAIL** (heap 4608 MB — ver §2.3) |
| P50 CORE + P51 | 64 | **64 PASS · 0 FAIL** |
| P50 CHROMIUM + P51 | 27 | **27 PASS · 0 FAIL** |
| M41 | payload `9794b267…` | **PASS · payload idêntico ao baseline** |
| visual (Playwright) | 67 passed / 0 failed / 37 skipped | **67 passed / 0 failed / 37 skipped** |

A regressão histórica integral e a auditoria independente **não** foram executadas: a §15 as coloca
depois do aceite visual.

### 3.4 Primeira execução com FAIL — registrada, não escondida

Duas reprovações reais apareceram na primeira passagem e foram corrigidas no produto, não no gate:

1. **`V1 radar getBoundingClientRect` (suíte visual congelada), 3 projetos.** A primeira versão da
   composição executiva tornava a `.radar-box` fluida (304 px em 1366, 322 px em 1440, 517 px em
   1920). A largura do radar é **gate visual congelado** — 420 px a partir de 1200 px e 460 px a
   partir de 1500 px. Correção: o radar mantém a medida congelada e a composição se organiza ao
   redor dele. Após a correção, a suíte voltou a 67 passed / 0 failed / 37 skipped.
2. **`P50-VIS5` e `P50-ACC3` (suíte P50 Chromium).** Os nove itens do trilho compartilhavam a mesma
   assinatura de seletor, o que fazia o caminhamento por `Tab` detectar "ciclo completo" na segunda
   parada e acusar armadilha de foco. Correção: cada item do trilho ganhou **id estável**
   (`p52-railto-<seção>`), o que é melhor prática independentemente do gate. Após a correção,
   27 PASS · 0 FAIL.

Uma terceira reprovação apareceu na **UAT interna por screenshot**, antes de qualquer gate acusar:
o ponteiro do gate fechado duplicava a cada render, porque o nó criado por esta camada voltava para
a lista de nós legados na desmontagem. Corrigido no produto **e** no gate — `P52-LAY5` passou a
fazer censo completo, incluindo os invólucros próprios, nas duas fixtures de gate.

---

## 4 · Invariantes preservadas

| invariante | prova |
|---|---|
| `engine_v32.js` byte-idêntico | `9a4a2e67…2b5d247a` · `P52-GOV2` + `P50-GOV1` |
| HTML-base V3.1.3 congelado byte-idêntico | `d3290491…deb7ae82` · `P52-GOV2` |
| payload M41 byte-idêntico | `9794b267…3ed4365b` · `test:m41` PASS |
| perguntas, alternativas, pontuação, `stageOf()` | engine 105/105 · M41 PASS |
| `UNSET ≠ NA ≠ 0` | UNSET (UG) 13/13 · `P52-GATE1` (todos os domínios em `n/d`) |
| `dataSufficiency()` e contrato derivado | P50 CORE 64/64 · a camada de layout não declara limiar (`P52-GOV1` proíbe por varredura de source) |
| schema e round-trip de sessão | SESSION 97/97 |
| Current × Target e revalidação | TARGET 30/30 · `P52-TGT1` confere `TARGET.overrides` intacto · mutante M10 |
| capabilities, ofertas e recomendações | engine 105/105 · `P52-REC1` (nenhuma inventada, nenhuma perdida) |
| zero requisição externa automática | suíte visual (V-gates) 67/67 |
| conteúdo semântico do PDF da 5.1 | `P52-PR1`: relatório executivo **caractere a caractere idêntico** ao do baseline após normalizar o carimbo de data/hora |
| produção `127.0.0.1:1337` e rota Tailscale | intocadas — ver §6 |
| core congelado e artefatos históricos | `P50-GOV1` 64/64 · acervo `evidence_p50/` restaurado byte a byte |

**Tecnologia não aumenta score; alvo não deriva de produto; refinamento não afeta scoring** —
nenhum desses caminhos foi tocado: a Camada 5.2 não chama `dataSufficiency`, `confirmedCount`,
`computeFindings`, `buildTiers`, `stageOf`, `setTarget` nem `setAnswerById`, e o gate `P52-GOV1`
reprova por varredura de source se algum dia chamar.

---

## 5 · Print e PDF — diferença declarada

O `P52-PR1` mede **dois** cenários, ambos em `media: print`, ambos contra o baseline de entrada
extraído do próprio git:

**(A) PDF executivo V3.2** (`#v32-print-report`, com contexto declarado). O relatório é
**materialmente idêntico** ao do baseline: mesma extensão, mesmo texto, mesma ordem — a única
diferença bruta é o carimbo de data/hora de geração, normalizado antes da comparação. Trilho,
títulos de seção, card de CTA, editor de contexto, estado de grupo, contador de gaps e controles de
sessão **não** aparecem: a camada congelada oculta a `.wrap` inteira nesse modo.

**(B) Papel legado** (sem contexto declarado — o print é a própria tela). Aqui há **uma única
diferença material** em relação ao baseline, e ela é a autorizada pela §7:

```
.next  ("Próximo passo sugerido")   baseline: 1 visível   →   candidata: 0
```

Todo o resto foi conferido nó a nó e ficou **idêntico**: contagem de `.finding`, de `.apoio-block`,
de `.prio-decl`, de réguas de domínio, do radar, da legenda de escala, o tamanho do anexo de
evidências e o texto do rodapé. O cromo da Phase 5.2 (trilho, títulos de seção, lead de seção,
ponteiro do gate, cabeçalho e explicação do card de contexto, estado de grupo, contador e marcador
de gaps) é ocultado no papel — são nós que **não existiam** no baseline.

Decisão registrada: `#v32panel`, `#v32editor` e os controles de sessão **continuam** com o
comportamento exato do baseline no papel legado. Escondê-los seria uma segunda diferença material
no papel, e a §7 autoriza apenas uma.

O gate `P50-PR1` (isolamento contínuo de estilo do print legado) permanece **PASS**.

---

## 6 · Preview, produção e rede

| serviço | endereço | verificação final | estado |
|---|---|---|---|
| **preview da candidata** | `http://127.0.0.1:1338/` | `200` · 808.749 B · `58d8e026…e747d47c` | serve os bytes da candidata por **bind read-only** do próprio `quickscan_secops_soccmm_v3_2_dev.html` do repositório; atualiza a cada build |
| **produção** | `http://127.0.0.1:1337/` | `200` · 744.179 B · `12bb950f…eebbf9d9` — **idêntico ao preflight** | **intocada** nesta rodada |

`git status --porcelain` sobre `deploy/` devolve **zero** linhas: `compose.yaml`, `default.conf`,
o artefato servido e `RELEASE_PHASE_5_1.sha256` continuam com os bytes e os timestamps de 2026-08-22.

O preview em `1338` é um bind direto do arquivo do repositório — confirmado por identidade de bytes
e por coincidência exata de `Last-Modified` com o `mtime` do arquivo. Nenhum comando desta rodada
tocou o serviço `1337`, o `compose.yaml` de `deploy/`, o Tailscale Serve, o Funnel, tag ou release.

**Observação de fato, sem ação:** no preflight, `127.0.0.1:1337` respondia `200` servindo
`12bb950f…eebbf9d9` — os mesmos bytes da Phase 5.1 —, e não o `8d0932e1…` da V3.2 Final Release
descrito no relatório da 5.1. O stack `deploy/phase5.1/compose.yaml` existe no worktree, com
artefato e `RELEASE_PHASE_5_1.sha256`, datado de 2026-08-22 21:43. Ou seja: **a promoção da Phase
5.1 para o serviço local já havia ocorrido antes desta rodada**. Isto é registrado porque a §0 da
diretriz declara a 5.1 como "ainda não promovida"; nada foi alterado a respeito.

---

## 7 · Evidência

`docs_phase5/evidence_p52/INDEX.md` indexa o acervo: **65 capturas** (9 cenas × 8 viewports, mais o
zoom de 200 %) e **13 arquivos de medição** produzidos pelos próprios gates.

| cena | conteúdo |
|---|---|
| `01-pergunta` | tela de pergunta — duas colunas e rodapé de largura total |
| `02-pergunta-evidencia` | evidência aberta — botão secundário único |
| `03-resultado-bloqueado` | gate de suficiência **fechado** |
| `04-resultado-liberado` | workspace completo |
| `05-cenario-alvo` | cenário-alvo declarado (4 práticas com override) |
| `06-contexto-grupo-aberto` | contexto tecnológico com grupo aberto |
| `07-prioridades-gaps-apoio` | prioridades, gaps altos/moderados e formas de apoio |
| `08-editor-alvo` | editor do cenário-alvo |
| `09-zoom200` | zoom de 200 % em 1440×900 |

Medições: larguras por viewport, geometria da tela de pergunta e do rodapé, ordem e geometria das
seções, comportamento do trilho, bounding box de pixels de cada artwork, cor e contraste de cada
tag de domínio, geometria dos grupos de severidade, grade das formas de apoio, estado dos grupos do
editor, isolamento de print, axe (superfícies novas e comparação com o baseline), zoom de 200 % e a
campanha de mutação.

---

## 8 · Manifesto

Foi criado `docs_phase5/MANIFEST_PHASE5_P52.sha256`, com o delta desta fase, **gerado por último**:
**97 entradas**, `sha256sum -c` **97/97 OK**, zero duplicatas, zero autorreferência. `AGENTS.md`
fica fora por **exclusão nominal declarada**, não por omissão. A completude é conferida por oráculo
independente do manifesto: a união dos caminhos reportados por `git status --porcelain`, com
diretórios expandidos arquivo a arquivo.

`docs_phase5/MANIFEST_PHASE5_P50.sha256` **não foi alterado**: ele é o registro da linha 5.0/5.1 já
integrada, e a §15 manda regenerar o manifesto definitivo somente **depois** do aceite visual.
Contra a candidata ele está, por construção, defasado nas entradas de `ui_v32.js`,
`tests_p50_core.js`, `build_v32_html.py`, `package.json`, `README.md`, `USER_GUIDE.md` e do HTML
derivado — o que será resolvido na Etapa B.

---

## 9 · Identidade da candidata

```text
HTML candidato : quickscan_secops_soccmm_v3_2_dev.html
SHA-256        : 58d8e026c3a5e90f812d2f0fc7f5470a480bbdb161c62dbb5f84fbc0e747d47c
bytes          : 808.749
engine         : 9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a  (byte-idêntico)
payload M41    : 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b  (byte-idêntico)
toolVersion    : 3.4.0-dev.4.8.0.7  (preservado)
preview        : http://127.0.0.1:1338/
produção       : http://127.0.0.1:1337/  — intocada
branch         : feat/phase5-5-2-desktop-workspace  — sem commit, push, PR ou merge
```

O build é determinístico: execuções repetidas sobre as mesmas fontes produziram o mesmo SHA-256.

---

## 10 · Pontos que a UAT precisa decidir

1. **Ordem com o gate fechado** (§1.3) — manter a subida da suficiência ou voltar à ordem canônica
   pura em todos os casos.
2. **Heap da suíte de sessão** (§2.3) — aceitar 4608 MB ou pedir redução do tamanho do HTML.
3. **Peso óptico dos ícones** (§1.4, P52-ICON1) — a métrica implementada é a **dimensão aparente no
   eixo dominante** do bounding box de tinta, normalizada em 71–76 % do tile para todos os produtos.
   Glifos naturalmente estreitos (o escudo do FortiGuard SOCaaS, por exemplo) continuam mais
   estreitos em largura, porque forçar paridade de área distorceria a percepção. Se, olhando o
   preview, o proprietário ainda perceber desequilíbrio, o ajuste fino é por `data-attribute` e cabe
   na mesma camada.
4. **Redundância no cenário-alvo** — a explicação estável exigida pela §8 convive com a frase que o
   owner congelado já imprime quando não há alvo. É repetição de uma linha; pode ser resolvida em
   ajuste de UAT.

---

## 11 · Parada

A candidata está completa para a Etapa A. A execução **para aqui**, para a **UAT visual do
proprietário**. Nada de regressão histórica integral, auditoria independente, selagem, commit, PR,
merge, tag, release ou promoção foi feito — nem será, antes do aceite.
