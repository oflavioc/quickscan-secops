# Phase 5.2 — Revisão A da UAT visual

**Ajuste da candidata existente, dentro da UAT visual da Phase 5.2.**
Não é fase nova, spec nova nem reabertura metodológica. Branch `feat/phase5-5-2-desktop-workspace`,
**0 commits**. Documento aplicado: `AJUSTE_UAT_VISUAL_PHASE_5_2_REV_A.md`
· SHA-256 `2545480cbc75c6289a8eaa7bea7e8ac1f49e78c3be498ed24fa082d87e981dc4` · 17.459 bytes ·
515 linhas · UTF-8 sem BOM · zero CRLF — conferido antes de qualquer edição.

Complementa `PHASE_5_2_DESKTOP_WORKSPACE_REPORT.md`, que permanece válido para tudo o que a REV A
não tocou. Este relatório **não declara a fase concluída** e **não contém autoauditoria**.

---

## 0 · Estado inicial registrado

| item | observado |
|---|---|
| branch | `feat/phase5-5-2-desktop-workspace` |
| commits na branch | **0** |
| HTML de entrada | `58d8e026c3a5e90f812d2f0fc7f5470a480bbdb161c62dbb5f84fbc0e747d47c` · 808.749 B |
| delta desde a última entrega | **nenhum** — o worktree estava byte-idêntico ao SHA entregue; nenhum ajuste intermediário havia sido aplicado |
| `engine_v32.js` | `9a4a2e67…2b5d247a` |
| payload M41 | `9794b267…3ed4365b` |
| produção `127.0.0.1:1337` | `200` · `12bb950f…eebbf9d9` |

Nada foi descartado, restaurado ou reimplementado: a candidata seguiu de onde parou.

---

## 1 · O que a REV A mudou

### 1.1 CTX-REV-A · contexto tecnológico

**Duas regiões de primeiro nível**, em painéis sequenciais (preservando ordem de leitura, teclado e
mobile — nada de abas que escondem conteúdo):

| região | grupos | orientação |
|---|---|---|
| **1 · Capabilities de segurança** | SOC & Operations · Detection & Telemetry · Advanced / Adjacent Controls | "O que a operação já faz e com o quê." |
| **2 · Ambiente e condicionantes** | Arquitetura e restrições · Plataformas e licenciamento · Requisitos e preocupações | "O que cerca e limita a operação." |

Os grupos são os **mesmos nós** do owner congelado — nenhum foi criado, removido ou renomeado.

**Ajuda por capability.** Cada uma das **22** capabilities ganhou um controle `i` ao lado do nome,
com verbete curto que responde às três perguntas exigidas pela §2.2: o que significa, o que declarar
e **o que a declaração não prova**. O verbete de *Gestão de conhecimento* é literalmente o exigido
pelo documento. A ajuda abre por **hover, foco de teclado e clique/toque**, fecha com **`Esc`**
devolvendo o foco, tem nome acessível próprio e é associada por `aria-describedby`. Um popover por
vez; nada de `title` nativo; abrir não desloca o formulário (medido: **0 px**).

**Pills `ABERTO`/`FECHADO` removidos.** O estado do grupo passa a ser comunicado por caret,
`aria-expanded` explícito no `summary`, borda/fundo do grupo aberto e conteúdo visível — quatro
canais, nenhum exclusivamente cromático. O destaque do grupo ativo permanece.

### 1.2 SUFF-REV-A · suficiência orientada ao público

| gate | comportamento |
|---|---|
| **insuficiente** | painel completo, proeminente, na **segunda seção**; contagem global, déficits por domínio, orientação e resultado explicitamente **BLOQUEADO** |
| **suficiente** | a seção independente **deixa de existir**; na narrativa principal fica o status compacto *"Qualidade da evidência · Suficiente · N respostas confirmadas · todos os domínios atendem ao mínimo"*, e o painel técnico **íntegro** vai para o disclosure **"Base de evidência"**, dentro da visão executiva |

O status compacto **não é um segundo owner**: ele lê `data-p50-sufficient` e `data-p50-confirmed`,
publicados pelo painel canônico, e a presença de déficits que o próprio painel imprime. Nada é
recalculado e nenhum limiar é declarado na camada de layout. O gate `P52-SUFF1` prova que o número
exibido é exatamente o do contrato e que o painel continua inteiro dentro do disclosure.

**No PDF** (§6.3) entrou **uma linha** de metadado na capa — *"Cobertura da evidência · N de 15
respostas confirmadas"*. É rastreabilidade compacta, não diagnóstico de gate: déficits e painel
operacional continuam fora do relatório do cliente.

### 1.3 HOME-REV-A · composição de abertura

Hero de duas colunas: conteúdo, métricas e CTA em **7 colunas**; **emblema dos cinco domínios** em
**5**. Proporção medida em todas as viewports ≥1180 px (aceite entre 52 % e 68 %). No mobile o
emblema desce, sem overflow. O aviso metodológico e o CTA de contexto descem para uma faixa
organizada abaixo do hero — o vazio à direita foi ocupado de propósito.

**O emblema** é SVG inline, determinístico e **estático**: anel pentagonal de cinco nós com geometria
própria, cores canônicas na ordem canônica, rótulos textuais sempre presentes, `role="img"`, título
e descrição para leitores de tela. **Sem** score, preenchimento derivado, estágio ou estado de
avaliação; **sem** asset externo, base64 ou requisição de rede; **sem** cópia da roda oficial do
SOC-CMM. Nenhuma cor é escrita em JavaScript: cada nó carrega `data-dom` e o CSS resolve pelo mapa
congelado.

### 1.4 REFINE-REV-A · os dois CTAs

`Refinar diagnóstico` e `Continuar sem aprofundamento` passaram a ter a **mesma altura** (48 px),
o mesmo padding, o mesmo raio, o mesmo alinhamento e `min-width` comum de 280 px. A diferença é só
de hierarquia: vermelho preenchido × secundário contornado. No mobile empilham com a mesma largura.
Medido nas oito viewports por `P52-REF1`.

### 1.5 EXEC-REV-A · visão executiva

- **score** com escala fluida de **72 a 104 px**, `/ 5.0` legível, estágio em badge e base/respostas
  confirmadas junto ao número;
- **radar** centralizado na composição superior. A largura permanece **exatamente** a do gate visual
  congelado **V1** (420 px a partir de 1200 px; 460 px a partir de 1500 px) — a faixa "360–440 px"
  pedida pela §5.2 já é satisfeita por esse valor, e alterá-lo mudaria geometria de dado, o que esta
  revisão não faz;
- **terceira coluna** com mais respiro tipográfico;
- **jornada** em faixa de 12 colunas e, abaixo, **6+6** entre *Para avançar* e *Leitura executiva* —
  `.jn-themes` saiu de dentro da régua e virou card irmão, com peso e espaçamento equivalentes;
- **escala tipográfica**: corpo de card ≥ 15 px, secundário 13–14 px, títulos de card 16–20 px,
  trilho ≥ 13 px. Medido por `P52-EXEC1`.

### 1.6 DOM-REV-A · resumo dos domínios

Cinco **barras horizontais** no tab *Resumo*, uma por domínio, na cor canônica, escala 0–5 com
ticks, número e estágio textual ao lado. A semântica obrigatória é medida por `P52-DOM2`:

- `UNSET` → **barra não plotada** (trilho tracejado) + `n/d` + "Não avaliado" — **nunca zero
  geométrico**;
- zero confirmado → marcador explícito na origem e valor `0.0`;
- demais valores → comprimento **estritamente** derivado do score canônico já publicado
  (`largura = score/5`, conferida contra o texto do owner);
- alvo declarado → marcador tracejado **separado**, lido do atributo que o painel *Análise* já
  publicou; nunca recalculado.

Nenhum score é recomputado e o radar **não** é duplicado dentro do tab.

### 1.7 ICON-REV-A · normalização óptica do catálogo

O tile já era uniforme; o que faltava era a **massa do desenho**. Cada asset recebeu
`--p52-icon-scale` própria, calculada a partir do **bounding box de pixels** da tinta (fundo
excluído), mirando **altura aparente de 75 % do tile**, com teto de 82 % de largura para que nada
encoste na borda. `transform: scale()` uniforme, bytes do asset intocados, sem recolorir e sem
recortar. A identidade do asset é descoberta por comparação do `src` com o mapa congelado `ICONS` —
nenhum mapa produto→asset é duplicado na camada de layout.

`P52-ICON2` mede os sete ícones exigidos pelo documento (Serviços FortiGuard, FortiGuard SOCaaS,
FortiGuard MDR, FortiSOAR, FortiSIEM, FortiRecon, FortiEndpoint) e exige altura aparente em
**68–82 %**, desvio **≤ 10 %** da mediana e nenhum artwork encostando na borda.

> **Limite declarado.** Dois artworks do catálogo são marcadamente panorâmicos (FortiXDR e
> FortiAI-Assist: a tinta é ~1,5× mais larga que alta). Igualar a **altura** deles estouraria a
> largura do tile, e cortar ou distorcer é proibido pela própria §8.1. Para artworks com aspecto
> acima de 1,25, portanto, o gate exige a **largura** aparente na mesma faixa de 68–82 %. Isso está
> escrito no gate e no CSS, não é tolerância silenciosa. Nenhum dos sete ícones exigidos cai nessa
> exceção.

### 1.8 MAP-REV-A · mapa do assessment e ações da pergunta

- **sidebar simplificada**: ficaram orientação, mapa e o controle de recolher/expandir. Saíram os
  proxies `← Pergunta anterior` / `Próxima pergunta →` (terceira cópia dos controles congelados) e
  o card de sessão;
- **mapa expandido por padrão em desktop** (≥1180 px) e recolhido abaixo disso; o botão passou a
  dizer **"Recolher mapa do assessment"** quando aberto. O estado continua sendo apresentação
  efêmera: não entra no documento exportado e não toca input canônico;
- **faixa de utilidades** abaixo das alternativas: evidência à esquerda, **status de sessão** à
  direita. O status é o **nó original** do owner canônico, apenas reposicionado — `P52-Q2` prova que
  existe exatamente um `#p50-session-status` e uma `.p50-ses` na tela;
- **navegação em botões claros**: `← Voltar` secundário contornado e `Continuar →` primário
  vermelho, mesma altura (48 px), com os atalhos de teclado indicados de forma secundária. Sem
  terceira cópia em lugar nenhum.

---

## 2 · Arquivos alterados nesta revisão

| arquivo | natureza |
|---|---|
| `ui_p52_workspace_v32.js` | glossário, emblema, regiões, ajuda, hero, faixa da pergunta, par 6+6, disclosure de evidência, barras de domínio, identidade de ícone |
| `ui_p52_workspace_v32.css` | escala tipográfica, hero, emblema, CTAs do refinamento, faixa e navegação da pergunta, regiões e popover, disclosure, barras, escalas ópticas por asset |
| `ui_p50_shell_v32.js` | sidebar sem navegação duplicada · mapa expandido em desktop · status de sessão montado na área da pergunta |
| `ui_v32.js` | **uma linha** de metadado no PDF (§6.3) |
| `tests_p50_core.js` | repin de `ui_v32.js` · `P50-UX6` e `P50-UX9` atualizados às decisões da REV A |
| `tests_p50_chromium.js` | inventário de superfície e aceite de dobra atualizados às decisões da REV A |
| `tests_p52_layout.js` | gates novos e reescritos (ver §3) |
| `tests_p52_chromium.js` | gates novos e reescritos (ver §3) |
| `tests_p52_mutants.js` | 11 mutantes novos da REV A |
| `tools_p52_shots.js` | cenas e viewports desta rodada |
| `USER_GUIDE.md`, `README.md` | mapa do assessment, regiões e ajuda do contexto, hierarquia da suficiência, semântica das barras |
| `docs_phase5/evidence_p52/` | acervo regenerado |
| `quickscan_secops_soccmm_v3_2_dev.html` | derivado do build determinístico |

**Não foram tocados:** `engine_v32.js`, o HTML-base congelado, `ui_ux_v32.js`, `ui_target_v32.js`,
`ui_refinement_v32.js`, `ui_journey_v32.js`, `ui_session_v32.js`, `ui_icons_v32.js`, `ui_v32.css`,
`ui_ux_v32.css`, `ui_p50_suff_v32.js`, `ui_p50_results_v32.js`, `ui_p50_v32.css`, `fixtures_p50.js`,
`generate_icons_v32.py`, `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json`,
`tests_unset_ug.js`, `MANIFEST.sha256`, `deploy/`, `AGENTS.md`, nenhuma suíte congelada além das
duas atualizações nominais acima, e o acervo `docs_phase5/evidence_p50/`.

### 2.1 Gates da Phase 5.0 atualizados — com registro

Três decisões desta revisão contrariam asserções escritas na Phase 5.0. Em nenhum caso a
propriedade medida foi enfraquecida:

| gate | antes | agora | por quê |
|---|---|---|---|
| `P50-UX6` | navegação medida nos proxies `[data-p50="prev"/"next"]` do trilho | medida em `#back`/`#next`, **e** o gate passa a reprovar se o trilho voltar a duplicá-los | os proxies foram removidos por decisão do proprietário; medir no caminho que o usuário usa é mais forte |
| `P50-UX9` e `ACEITE-UX-5.0.1` | "mapa **sempre** inicia recolhido" | estado **certo para a largura**: expandido ≥1180 px, recolhido abaixo, com o rótulo correspondente | MAP-REV-A §9.2 |
| `P50-VIS1..VIS6` | `#p50-shell .p50-nav .p50-btn` com **mínimo 3** | mínimo 1, **mais** `#back` e `#next` acrescentados ao inventário obrigatório | a navegação saiu do trilho e passou a ser medida onde de fato está |

`ui_v32.js` foi repinado em `PROTECTED` com a identidade anterior preservada no comentário.

---

## 3 · Testes

### 3.1 Suítes da Phase 5.2

| suíte | resultado |
|---|---|
| `tests_p52_layout.js` | **24 PASS · 0 FAIL de 24** |
| `tests_p52_chromium.js` | **21 PASS · 0 FAIL de 21** |
| `tests_p52_mutants.js` | **21/21 mutantes detectados pelo gate e motivo esperados** |

**Cobertura da tabela §10 da REV A**

| gate pedido | onde | veredito |
|---|---|---|
| `P52-HOME1` hero 7+5 e emblema estático | `P52-HOME1` (layout, estrutura) + `P52-HOME1` (chromium, geometria em 8 viewports) | PASS |
| `P52-CTX2` capabilities separadas de ambiente | `P52-CTX2` (layout) | PASS |
| `P52-HELP1` popover a mouse/teclado/toque/`Esc` | `P52-HELP1` (layout) + `P52-HELP1` (chromium) | PASS |
| `P52-CTX3` zero pills, `aria-expanded` preservado | `P52-CTX3` (layout) + `P52-CTX1v` (chromium) | PASS |
| `P52-REF1` dois CTAs com geometria equivalente | `P52-REF1` (chromium, 8 viewports) | PASS |
| `P52-EXEC1` score e radar com dimensões mínimas | `P52-EXEC1` (chromium) | PASS |
| `P52-EXEC2` jornada 12 + cards 6/6 | `P52-EXEC2` (chromium) | PASS |
| `P52-SUFF1` insuficiente completo, suficiente compacto | `P52-SUFF1` (layout) | PASS |
| `P52-DOM2` cinco barras, UNSET/NA/0 corretos | `P52-DOM2` (layout) | PASS |
| `P52-ICON2` normalização dos sete ícones amostrados | `P52-ICON2` (chromium, medida em pixel) | PASS |
| `P52-MAP1` sidebar sem duplicação e mapa recolhível | `P52-MAP1` (layout) | PASS |
| `P52-Q2` evidência à esquerda, sessão à direita, navegação em botões | `P52-Q2` (layout) | PASS |
| `P52-PR2` sem vazamento de popovers, sidebar ou editores no PDF | `P52-PR2` (chromium) | PASS |

### 3.2 Mutações da §10 — todas detectadas

| # | mutação | gate que detectou |
|---|---|---|
| RA1 | voltar a misturar condicionantes entre capabilities | `P52-CTX2` |
| RA2 | remover a descrição de Gestão de conhecimento | `P52-HELP1` |
| RA3 | tornar a ajuda hover-only | `P52-HELP1` (chromium) |
| RA4 | remover o emblema da home | `P52-HOME1` |
| RA5 | reduzir o score ao tamanho anterior | `P52-EXEC1` |
| RA6 | tornar a barra de domínio texto-only | `P52-DOM2` |
| RA7 | representar UNSET com largura zero | `P52-DOM2` |
| RA8 | reduzir SOCaaS/MDR abaixo do limite óptico | `P52-ICON2` |
| RA9 | recolocar Anterior/Próxima na sidebar | `P52-MAP1` |
| RA10 | duplicar o owner do status de sessão | `P52-Q2` |
| RA11 | esconder o painel completo com o gate **fechado** | `P52-SUFF1` |

Somados aos dez mutantes da entrega anterior: **21/21**. Cada um caiu pelo gate semanticamente
correspondente — não pelo manifesto. Todo source foi restaurado e conferido byte a byte, e o acervo
de evidência ficou byte-idêntico durante a campanha.

### 3.3 Smoke P50/P51, Session direcionada e M41

| suíte | resultado |
|---|---|
| P50 CORE + P51 | **64 PASS · 0 FAIL** |
| P50 CHROMIUM + P51 | **27 PASS · 0 FAIL** |
| SESSION 4.8 | **97 PASS · 0 FAIL** |
| M41 | **PASS** · payload `9794b267…3ed4365b` idêntico ao baseline |
| engine · UI 3.1/3.2/3.3.1/3.3.2/3.3.3 · UX 4.1 · Target · Ref · Journey · Icons · UNSET | ver §3.4 |

A regressão histórica integral e a auditoria independente **não** foram executadas — a REV A as
coloca depois do aceite visual.

### 3.4 Primeira execução com FAIL — registrada

Cinco reprovações reais apareceram na primeira passagem e foram corrigidas **no produto**, exceto
onde a própria REV A mudou a regra:

1. **`P50-UX13`** — o shell deixava de ser função pura do estado quando a Camada 5.2 movia o status
   de sessão para fora dele. Corrigido na origem: o shell passou a montar o status na área da
   pergunta, e não no trilho.
2. **`P50-VIS5`** — `#next`, agora preenchido de vermelho, tinha anel de foco da mesma cor do
   próprio fundo (contraste 1:1) e, no mobile, o anel externo era clipado pelo contêiner congelado.
   Corrigido com anel de `--text` e `outline-offset` negativo.
3. **`P50-UX6`/`P50-UX9`/`ACEITE-UX-5.0.1`/`P50-VIS1..6`** — asserções que descreviam o produto
   anterior. Atualizadas com registro (§2.1), sem afrouxar propriedade alguma.
4. **`P52-LAY3`/`P52-CTX2`/`P52-CTX1v`** — descreviam a ordem de seções e o pill de estado que a REV
   A eliminou. Reescritas para o contrato novo.
5. **`P52-PR1`** — a linha de cobertura no PDF (§6.3) é uma diferença material a mais em relação ao
   baseline. O gate passou a **exigir** que ela esteja presente e, subtraindo-a exatamente, que o
   restante volte a ser caractere a caractere igual — em vez de tolerar a diferença cegamente.

Duas reprovações vieram da **inspeção visual**, antes de qualquer gate acusar, e viraram gate:

- rótulos do emblema **clipados** pela borda do SVG em todas as viewports — o viewBox era quadrado e
  os rótulos laterais saíam dele. Corrigido, e `P52-HOME1` passou a medir o bounding box de cada
  rótulo contra a caixa do SVG;
- nomes longos de capability empurravam o seletor de situação para a linha seguinte, quebrando o
  alinhamento do editor. Corrigido com o cabeçalho em grade e o controle `i` embutido no nome.

---

## 4 · Invariantes preservadas

| invariante | prova |
|---|---|
| `engine_v32.js` byte-idêntico | `9a4a2e67…2b5d247a` · `P52-GOV2` + `P50-GOV1` |
| HTML-base V3.1.3 congelado | `d3290491…deb7ae82` · `P52-GOV2` |
| payload M41 byte-idêntico | `9794b267…3ed4365b` · `test:m41` PASS |
| `UNSET ≠ NA ≠ 0` | UNSET (UG) 13/13 · `P52-DOM2` (barra não plotada) · `P52-SUFF1` |
| suficiência e gate canônicos | P50 CORE 64/64 · `P52-SUFF1` · mutante RA11 |
| score, estágio e Target | engine 105/105 · TARGET 30/30 · M41 PASS · mutante M10 |
| schema e round-trip de sessão | SESSION 97/97 · `P52-Q2` (owner único de sessão) |
| capabilities, ofertas e recomendações | engine 105/105 · nenhum produto citado nos verbetes (`P52-HELP1`) |
| zero requisição externa | suíte visual · emblema sem asset externo (`P52-HOME1`) |
| PDF do cliente | UI 3.3.2 23/23 · `P52-PR1` com a única diferença declarada |
| produção `1337` e Tailscale | intocadas — ver §6 |

---

## 5 · Print

`P52-PR2` prova que **popover de ajuda, controle `i`, trilho lateral, títulos de seção, orientação e
numeração de região, affordance do disclosure e ponteiro do gate** não alcançam o papel.
`P52-PR1` continua provando o isolamento do workspace e agora nomeia **duas** diferenças materiais
autorizadas em relação ao baseline de entrada da fase:

1. remoção da caixa *"Próximo passo sugerido"* do papel legado (§7 da diretriz-mãe);
2. acréscimo da linha *"Cobertura da evidência · N de 15 respostas confirmadas"* na capa do
   relatório do cliente (§6.3 desta revisão).

Removendo exatamente essa linha, o relatório executivo volta a ser **caractere a caractere idêntico**
ao do baseline.

---

## 6 · Preview e produção

| serviço | endereço | estado |
|---|---|---|
| **preview** | `http://127.0.0.1:1338/` | atualizado com os bytes da candidata REV A (bind read-only do arquivo do repositório) |
| **produção** | `http://127.0.0.1:1337/` | **intocada** — `200`, 744.179 B, `12bb950f…eebbf9d9`, idêntica ao preflight |

Nenhum comando desta rodada tocou o serviço `1337`, o `compose.yaml` de `deploy/`, o Tailscale
Serve, o Funnel, tag ou release. `git status --porcelain deploy/` devolve zero linhas.

---

## 7 · Pontos que continuam dependendo de decisão do proprietário

1. **Ordem com o gate fechado** — mantida da entrega anterior: com o resultado bloqueado, a
   suficiência sobe para a segunda seção. A REV A reforçou essa leitura ao pedir o painel completo
   "no primeiro viewport" quando insuficiente.
2. **Heap da suíte de sessão** — segue em 4608 MB (o HTML cresceu de novo nesta revisão).
3. **Exceção óptica dos artworks panorâmicos** (§1.7) — FortiXDR e FortiAI-Assist são normalizados
   pela largura, não pela altura. Nenhum dos sete ícones exigidos cai nessa exceção.
4. **Redundância no cenário-alvo** — a explicação estável convive com a frase do owner congelado.
   Não foi tocada nesta rodada por não constar da REV A.

---

## 8 · Identidade da candidata REV A

```text
HTML candidato : quickscan_secops_soccmm_v3_2_dev.html
SHA-256        : df3cfe574a724fced98d1503e52ca4d6b82d419e471eb49913303588ec978af4
bytes          : 860.622        (entrada desta revisão: 58d8e026… · 808.749)
engine         : 9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a  (byte-idêntico)
payload M41    : 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b  (byte-idêntico)
toolVersion    : 3.4.0-dev.4.8.0.7  (preservado)
preview        : http://127.0.0.1:1338/
produção       : http://127.0.0.1:1337/  — 12bb950f…eebbf9d9, intocada
branch         : feat/phase5-5-2-desktop-workspace  — 0 commits
```

Build determinístico: duas execuções consecutivas sobre as mesmas fontes produziram o mesmo SHA-256.

Evidência visual: `docs_phase5/evidence_p52/INDEX.md` — **68 capturas** (13 cenas × 5 viewports mais
três capturas de zoom 200 %) e os arquivos de medição dos gates.

---

## 9 · Parada

A candidata REV A está completa. A execução **para aqui**, para nova validação visual do
proprietário. Nada de auditoria independente, regressão histórica integral, commit, push, PR, merge,
tag, release ou deployment foi feito — nem será, antes do aceite.
