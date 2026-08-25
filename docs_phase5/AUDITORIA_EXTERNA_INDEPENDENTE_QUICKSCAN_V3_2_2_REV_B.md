# Auditoria externa independente — Quickscan SecOps · SOC-CMM · candidata v3.2.2 (pacote REV B)

Analista: auditor independente sênior de engenharia de software e frontend.
Não participei da implementação, dos gates, dos mutantes, da atualização do README nem da montagem
do pacote. Nenhuma correção foi implementada. O HTML original não foi editado.
Data da execução: 2026-08-25.

---

## 1. Identidade e ambiente

### 1.1 Preflight de identidade (executado antes de qualquer análise)

| Objeto | Esperado | Recalculado | Veredito |
|---|---|---|---|
| `QUICKSCAN_V3_2_2_INDEPENDENT_ANALYST_REVIEW_PACKAGE_2026-08-25_REV_B.zip` | `da6faffd25aeb493d06d905d16cfc534c7a73e5fad771ff35d8eb1dacff8c1bb` | `da6faffd25aeb493d06d905d16cfc534c7a73e5fad771ff35d8eb1dacff8c1bb` | **IGUAL** |
| Sidecar `.zip.sha256` | — | confere com o ZIP | **OK** |
| `MANIFEST_SHA256.txt` | 15 entradas | `sha256sum -c` → 15 OK, 0 falhas | **15/15 OK** |
| `quickscan_secops_soccmm_v3_2_2_candidate.html` | `332631223e40cfea0b4102ac325920389752a5e9c3e669d99063d592c7fa8ca2` | idem | **IGUAL** |
| Tamanho do objeto principal | 993.584 bytes | 993.584 bytes | **IGUAL** |

O artefato **não** é o superado de 2026-08-24 (`e7ddd965971ec8ee2747f547dfb671934a9dc3bdfe0e4eb9cbe79e2205f20422`).
Verificação repetida ao final da auditoria: ZIP, manifesto e HTML permanecem idênticos.

Conteúdo do pacote (15 arquivos): `INDEPENDENT_ANALYST_REVIEW_BRIEF.md`, `KNOWN_LIMITATIONS_AND_SCOPE.md`,
`MANIFEST_SHA256.txt`, `PROMPT_REVISAO_INDEPENDENTE_SENIOR_FRONTEND_V3_2_2.md`, `README.md`,
`USER_GUIDE.md`, o HTML candidato e 8 capturas + `screenshots/README.md`.

README, guia, brief e capturas foram tratados como **alegações**. Nenhum PASS abaixo se apoia neles.

### 1.2 Ambiente de execução

| Item | Valor |
|---|---|
| SO | Linux 6.18.33.2-microsoft-standard-WSL2 (WSL2 sobre Windows), x86_64 |
| Node | v22.23.2 |
| Automação | Playwright 1.62.1 (`playwright-core` 1.62.1) |
| Navegador | Chromium empacotado (build 1234) — `HeadlessChrome/151.0.7922.34` |
| Acessibilidade | axe-core 4.13.0 (tags wcag2a/aa, wcag21a/aa, wcag22aa, best-practice) + verificação manual |
| PDF | `page.pdf({printBackground:true, scale:1, preferCSSPageSize:true, displayHeaderFooter:false})`; o documento declara `@page{size:A4 portrait; margin:14mm}` |
| Inspeção de PDF | poppler `pdfinfo`, `pdftotext -layout`, `pdftoppm` (raster 60 e 100 dpi) |
| Viewports | 390×844 · 768×1024 · 1024×768 · 1440×900 · 1920×1080 · 2560×1440 · 3440×1392 |
| Zooms | 100% · 110% · 125% · 200% (emulados por redução equivalente do viewport CSS) |
| Origem | `file://` sobre cópia de trabalho do HTML (bytes idênticos ao do pacote) |
| Oráculo de score | reimplementação própria da semântica SOC-CMM em Node, sem chamar função alguma do artefato |

### 1.3 Limitações declaradas (não atribuo PASS a nada fora disto)

1. **Um único motor**: Chromium headless. Firefox, Safari/WebKit e navegadores móveis reais **não** foram
   exercitados. Achados de layout e de foco podem variar nesses motores.
2. **Sem leitor de tela real**: NVDA/JAWS/VoiceOver não foram executados. O comportamento de tecnologia
   assistiva foi inferido da árvore de acessibilidade do Chromium (CDP `Accessibility.getFullAXTree`),
   da semântica ARIA e do axe. Onde a conclusão depende do leitor, está dito.
3. **Toque real não exercitado**: `pointerType==="touch"` não foi emulado com hardware; o caminho de
   toque foi lido no código e exercitado apenas por clique sintético.
4. **Zoom emulado por viewport**: reproduz o *reflow* do zoom do navegador, não o *text-only zoom*.
5. **`page.pdf()` não dispara `beforeprint`**. Para não medir um caminho falso, cada PDF foi gerado
   despachando `beforeprint` antes da renderização — o que executa exatamente os dois ouvintes
   registrados (`preparePrint` e o de COPY-B), na ordem de registro. `afterprint` foi despachado depois.
6. **Importação de sessão** não passou pelo diálogo de arquivo do SO; foi conduzida pelas mesmas
   funções que o seletor da UI invoca (`validateSessionDocument` → `sessionCompatibility` →
   `importSessionDocument`), a partir de um documento realmente exportado pela ferramenta.
7. **Determinismo de build** não foi objeto desta auditoria; audito o binário entregue, não o builder.

---

## 2. Veredito

# FAIL

Um defeito **BLOCKER** reproduzível foi confirmado: no editor de contexto tecnológico aberto **pela
home**, a tecla `Enter` sobre qualquer controle (inclusive o botão **Salvar contexto** e o select
**Situação declarada**) descarta silenciosamente o contexto declarado, destrói a tela do editor,
deixa o `draft` órfão e, por consequência, **bloqueia a geração do relatório/PDF** até que o usuário
descubra sozinho que precisa reabrir e cancelar o editor.

O núcleo metodológico da ferramenta está sólido — score, estágio, suficiência, UNSET, `Não sei`,
Target e PDF passaram em todos os cenários adversariais que construí, com oráculo independente. Os
**três pontos da errata v3.2.2 foram tratados como hipóteses a refutar e não foram refutados**. O
veredito FAIL decorre de um defeito de operação por teclado que existe fora do escopo da errata mas
dentro do artefato submetido, e que produz perda de trabalho e relatório inacessível.

---

## 3. Contagem por severidade e aptidão

| Severidade | Quantidade |
|---|---|
| **BLOCKER** | 1 |
| **ALTO** | 2 |
| **MÉDIO** | 5 |
| **BAIXO** | 8 |

### Aptidão para avaliação com cliente

**Apta com restrição operacional explícita; não apta sem ela.**

- **Conduzida por mouse/trackpad**, em desktop ≥1024 px: apta. Não encontrei nenhum caminho de
  cálculo, publicação, Target ou PDF que produza resultado errado, contraditório ou enganoso.
- **Conduzida por teclado**: **não apta** até B-01 ser corrigido. O facilitador que usar `Enter`
  no editor de contexto aberto pela home perde o que declarou e fica sem relatório.
- **Em telas ≤430 px CSS** (celular, ou tablet a 200% de zoom): o editor de contexto perde conteúdo
  visível (M-01). O restante do fluxo responde bem.

Recomendação prática enquanto B-01 não for corrigido: **abrir o contexto tecnológico pelos
RESULTADOS**, nunca pela home — a entrada dos resultados foi medida e está correta (`step` já não é
`-1`, o sequestro de `Enter` não ocorre, `Salvar` com `Enter` grava normalmente).

---

## 4. Achados

Cada achado traz passos de reprodução, evidência medida, impacto, causa provável e gate recomendado.
Os identificadores são meus; não continuam nenhuma numeração do projeto.

---

### B-01 · BLOCKER · `Enter` no editor de contexto aberto pela home descarta o contexto e trava o relatório

**Passos**

1. Home → `Adicionar contexto tecnológico` (ative com **Espaço**; ver A-01).
2. Abra um grupo, declare uma capability como `PRESENT`, preencha fabricante e produto.
3. Leve o foco a **Salvar contexto** e pressione **Enter**.

**Evidência medida**

```text
antes  : {tela:"ctxeditor", step:-1, editor:true,  draft:true}
depois : {tela:"arq",       step:0,  editor:false, draft:true}
capabilities gravadas em V32.TECH_LANDSCAPE = 0
tela exibida: "PONTO DE PARTIDA · Pergunta 1 de 16 · Como a segurança é operada hoje?"
```

O mesmo ocorre com `Enter` sobre: qualquer `<summary>` de grupo, qualquer botão de ajuda `(i)`,
o botão **Cancelar** e — o gatilho mais provável no uso real — o **select “Situação declarada”**:

```text
ENTER em campo de texto  -> tela: ctxeditor   (seguro: <input> é isento)
ENTER em select          -> tela: arq         (editor destruído)
```

Com **Espaço** o mesmo botão Salvar funciona corretamente (`salvas:1, draft:false`), o que confirma
que o handler do botão está certo e que o problema é o sequestro da tecla.

**Cadeia completa até o relatório inacessível** (medida de ponta a ponta):

```text
1. contexto declarado para "knowledge-management"  (PRESENT + Acme/EDR X)
2. Enter em Salvar          -> tela=arq, capabilities salvas=0, draft=ORFÃO (true)
3. questionário completo -> resultados
4. clique em "Imprimir / salvar em PDF"  -> window.print chamado = 0  (BLOQUEADO)
   mensagem: "Salve ou cancele as alterações do contexto tecnológico antes de gerar o relatório."
   editor no DOM: presente, porém invisível (v32-hidden) — não há onde salvar nem cancelar na tela
5. Ctrl+P (caminho nativo) -> PDF de 1 página contendo apenas a frase de bloqueio
6. recuperação: reabrir o editor (#v32cta) e clicar Cancelar -> print volta a funcionar
```

**Impacto** — Perda silenciosa de todo o contexto tecnológico declarado (que é justamente a entrada
que a v3.2.2 passou a tratar em paridade com a dos resultados) **e** relatório/PDF materialmente
indisponível, com a causa invisível na tela. Enquadra-se em duas cláusulas de BLOCKER do próprio
prompt: *perda de dados* e *PDF materialmente quebrado*.

**Causa provável** — Handler global de teclado da camada congelada:

```js
document.addEventListener("keydown", e=>{
  if(e.target && (e.target.tagName==="TEXTAREA" || e.target.tagName==="INPUT")) return;
  if((e.key==="Enter"||e.key===" ") && e.target?.classList?.contains("opt")) return;
  if(step===-1 && e.key==="Enter"){ step=0; render(); return; }
  ...
```

`uxOpenHomeEditor()` monta o editor **sem** alterar `step`, que permanece `-1`. A guarda isenta
apenas `TEXTAREA`, `INPUT` e os cards `.opt` — não isenta `BUTTON`, `SELECT` nem `SUMMARY`. Logo,
qualquer `Enter` na tela do editor da home cai no ramo “home → iniciar questionário”, que chama
`render()` e substitui `#app`. O `draft` vive fora do DOM e sobrevive; `safePrint()` continua
(corretamente) recusando imprimir com `draft !== null`.

Na entrada pelos **resultados** o defeito não ocorre: verificado, `step===17` e `Enter` em Salvar
grava (`salvas:1, draft:false`).

**Gate recomendado** — Gate de teclado por tela: para cada tela e cada controle focável não-`.opt`,
`Enter` deve produzir **exatamente** o mesmo efeito que o clique, e nunca alterar `step`. Oráculo
independente: comparar o snapshot canônico (`__DEV.captureCanonicalInputs()` + `step` + `data-uxscreen`)
após `element.click()` e após `Enter` com o mesmo foco; qualquer divergência reprova. Caso negativo
obrigatório: `Enter` em `#v32save` com a entrada HOME grava o contexto e não muda de tela.

---

### A-01 · ALTO · `Enter` sequestrado em todas as telas: botões focados executam ação diferente da rotulada

**Passos** — Foque cada botão indicado e pressione `Enter`.

**Evidência medida**

| Tela | Foco em | Ação esperada | Ação medida |
|---|---|---|---|
| home | `#ux-addctx` “Adicionar contexto tecnológico” | abrir editor | vai para `arq` (inicia o questionário) |
| home | `#ses-import-home` “Importar sessão” | abrir seletor de sessão | vai para `arq` |
| questão | `#back` “← **Voltar**” | `step 3 → 2` | `step 3 → 4` (**avança**) |
| questão | `#notetgl` “Adicionar evidência ou observação” | abrir a caixa | `step 3 → 4` |
| prioridades | “← Voltar” | volta ao questionário | vai para `results` |

Com **Espaço** todos funcionam como rotulado (`#ux-addctx` → `ctxeditor`; `#notetgl` → mantém `step 3`).

**Impacto** — `Enter` é a tecla canônica de ativação de `<button>`. O caso “← Voltar” é o mais grave:
o botão faz o **oposto** do que anuncia. Usuário de teclado perde previsibilidade em toda a
ferramenta; usuário de leitor de tela recebe um rótulo e obtém outra ação. WCAG 2.1.1 continua
tecnicamente atendido (Espaço funciona), mas 3.2.x (previsibilidade) e a operabilidade prática não.

**Causa provável** — A mesma do B-01: guarda do handler global por `tagName`/classe em vez de por
“o alvo é um controle que trata a própria tecla”.

**Gate recomendado** — o mesmo gate de teclado de B-01, estendido a todas as telas, com a matriz
completa (tela × controle focável × `Enter`/`Espaço`) e oráculo por equivalência com o clique.

---

### A-02 · ALTO · Foco perdido para `<body>` a cada repintura do editor de contexto

**Passos** — Abra o editor (qualquer entrada), abra um grupo, foque um select **Situação declarada**
e altere o valor pelo teclado.

**Evidência medida** (amostragem por microtarefa)

```text
antes da mudança : activeElement = v32-pres-endpoint-detection
síncrono         : activeElement = v32-pres-endpoint-detection   (owner restaurou o foco)
microtarefa      : activeElement = BODY
+0ms / +250ms    : activeElement = BODY
o elemento continua no DOM (stillThere=true) e agora está dentro de .p52-ctxregion
```

Vale para **todas** as repinturas do editor: alterar situação, `Adicionar tecnologia`, `Remover`,
trocar bundle. Custo medido para retornar ao mesmo controle, com o grupo `g1` (9 capabilities)
aberto: **19 tabulações** — e cada parada intermediária abre um popover de ajuda no `focus`.

**Impacto** — Regressão de gestão de foco (WCAG 2.4.3). O owner congelado faz a coisa certa
(`paintEditor(app); document.getElementById("v32-pres-"+capId).focus();`) e a camada de apresentação
a desfaz. Para quem opera por teclado, cada alteração no editor custa uma retravessia.

**Causa provável** — `p52ContextEditorDecor()` roda no checkpoint de microtarefas do `MutationObserver`,
**depois** de o owner ter restaurado o foco, e **reparenta** os nós recém-pintados em dois pontos:
`p52ContextRegions()` move os `<details>` para dentro de `.p52-ctxregion-body`, e
`p52DecorateContextGroups()` move os irmãos do `<summary>` para dentro de `.p52-grp-body`. Mover um
nó que contém o `activeElement` derruba o foco para `<body>` no Chromium.

**Gate recomendado** — Gate de preservação de foco: para cada repintura do editor, `document.activeElement`
depois do checkpoint de microtarefas deve ser o mesmo (ou um descendente do mesmo) que era antes, ou
o alvo que o owner declarou. Caso adversarial: repintura com o foco no último controle do último
grupo aberto.

---

### M-01 · MÉDIO · Perda de conteúdo no editor de contexto abaixo de ~430 px CSS

**Passos** — Viewport 320–430 px (ou 768×1024 a 200%), abrir o editor, abrir “Plataformas e
licenciamento já existentes”.

**Evidência medida** (viewport 390 px)

```text
cadeia de contenção do fieldset:
  FIELDSET.v32-plat        w=328  sw=326  cw=326
  DIV.p52-grp-body         w=223  sw=344  cw=223
  ...
  SECTION.screen  overflow-x=hidden   w=342  sw=406  cw=342   <-- recorta
documentElement.scrollWidth = clientWidth = 390  -> não há rolagem para alcançar o excedente
```

Medido em 320/360/390/430 px: a caixa mantém 328 px fixos e a borda direita fica fora da tela; a
captura confirma a moldura cortada e os rótulos mais longos encostando na borda.

**Impacto** — Perda de conteúdo sem rolagem 2-D compensatória, exatamente o que WCAG 1.4.10 (Reflow,
AA) proíbe em 320 px. Atinge o grupo de plataformas/licenciamento inteiro.

**Causa provável** — Conflito de especificidade, medido: o override móvel

```css
@media (max-width: 719px){ #v32editor .v32-signals, #v32editor .v32-bundles { grid-template-columns: minmax(0,1fr); } }
```

tem especificidade (1,1,0) e **não alcança** a regra base `#v32editor .v32-subs .v32-signals` (1,2,0).
Confirmado em runtime a 390 px: `.v32-subs .v32-signals` computa `grid-template-columns: 260px`
(rígido), enquanto `.v32-bundles` computa `minmax(0px,1fr)` (correto). Os 260 px rígidos elevam o
`min-content` do `<fieldset>` para 328 px; como `fieldset` tem `min-inline-size: min-content` e é item
de grade sem `min-width:0`, ele não encolhe.

**Gate recomendado** — Gate de reflow: em 320/360/390 px, nenhum elemento do editor pode ter
`getBoundingClientRect().right > clientWidth` sem um ancestral com `overflow-x:auto|scroll`. Oráculo
independente do CSS: varredura geométrica, não inspeção de regra.

---

### M-02 · MÉDIO · `id="v32errors"` duplicado na entrada HOME do editor

**Evidência** — Com o editor aberto pela home, o documento tem **dois** `#v32errors`:

```text
[0] class="v32-errors v32-hidden"  fora do #v32editor   <- é este que getElementById devolve
[1] class="v32-errors v32-hidden"  dentro do #v32editor <- nunca é escrito
```

Origem: `uxOpenHomeEditor()` injeta `<div id="v32errors">` e `paintEditor()` emite outro. A entrada
pelos resultados não tem o problema (0 IDs duplicados medidos).

**Impacto** — A errata §1 exige “zero ID duplicado”; nesta entrada a exigência **não** é cumprida.
Funcionalmente, `save` e `safePrint` escrevem no nó externo (acima do editor), portanto a mensagem
aparece — mas distante do botão que a provocou, e a caixa interna do editor permanece vazia.

**Gate recomendado** — Gate de unicidade de ID executado nas **duas** entradas do editor e em todas as
telas (o meu varreu 7 telas; só esta reprova).

---

### M-03 · MÉDIO · O wrapper de `buildPrintReport()` é código morto; COPY-B só existe no caminho `beforeprint`

**Evidência medida**

```text
window.buildPrintReport  -> undefined        (vive dentro da IIFE do owner)
window.render            -> function         (alcançável)
__DEV.buildPrintReport === window.buildPrintReport -> false

__DEV.buildPrintReport().html : "mandato" x3 ; subtítulo "…alto nível — não substitui assessment formal."
DOM impresso (beforeprint)    : "mandato" x0 ; subtítulo "…alto nível. Não substitui um assessment formal."
tela                          : "mandato" x0
```

O bloco `var p52PrevBuildPrint = (typeof buildPrintReport === "function") ? buildPrintReport : null;`
resolve para `null`, então o wrapper **nunca é instalado**. A transformação chega ao papel apenas pelo
ouvinte de `beforeprint` que reescreve `#v32-print-report`.

**Impacto** — O PDF entregue ao cliente está correto (verificado em 9 PDFs). O defeito é de
verificabilidade e de consistência: o comentário do próprio arquivo afirma que “o wrapper aplica a
MESMA transformação ao HTML devolvido”, e é justamente o anti-padrão que o arquivo condena três
blocos acima (“código morto que parece uma correção é pior do que correção nenhuma”). Um gate que
compare `__DEV.buildPrintReport()` com `__P52.copyMap()` valida um texto que o cliente nunca vê.

**Gate recomendado** — Gate de equivalência de linguagem entre os dois caminhos: aplicar `copyMap()` ao
retorno de `__DEV.buildPrintReport()` e exigir igualdade com o `innerText` de `#v32-print-report` após
`beforeprint`. Hoje esse gate reprova.

---

### M-04 · MÉDIO · Foco e estrutura de cabeçalhos no questionário

**Evidência medida**

```text
foco ao entrar na questão            : BODY
foco após selecionar resposta        : BODY
foco após "Continuar"                : BODY
foco após fechar a caixa de evidência: BODY
cabeçalhos da tela de questão        : nenhum <h1>; o enunciado é <div class="question" tabindex="-1">
live regions presentes               : #ux-progress-mobile role=status "Etapa 3 de 16 · Negócio"
                                       #p50-session-status aria-live=polite
axe (prioridades)                    : page-has-heading-one [moderate]
```

**Impacto** — Em cada uma das 16 transições o foco volta ao início do documento; a ordem de tabulação
recomeça no cabeçalho da página. A `live region` de progresso anuncia a etapa, mas **não** o enunciado
da pergunta, e o enunciado não é cabeçalho — logo não é alcançável por navegação por cabeçalhos.
Mitigação real: as teclas 1–5 / `Enter` / `←` são globais, então o questionário permanece completável
por teclado.

**Gate recomendado** — Após cada transição de tela, `document.activeElement` deve ser um alvo declarado
(por exemplo o próprio enunciado, com `tabindex="-1"`), e o enunciado deve ser `h1`/`h2` da região.

---

### M-05 · MÉDIO · Contraste abaixo de 4.5:1 em dois controles

**Evidência** — axe (serious) e recálculo independente da fórmula WCAG:

| Elemento | Cores | Razão | Requisito | Veredito |
|---|---|---|---|---|
| `#ux-addctx` (home) | `#ffffff` sobre `#307fe2`, 15 px normal | **3,99:1** | 4,5:1 | reprova |
| `#next` (prioridades) | `#da291c` sobre `#0b0b0c`, 14 px normal | **4,04:1** | 4,5:1 | reprova |

Contra-amostras que **passam** (recalculadas): `--muted/--bg` 8,82:1 · `--faint/--bg` 5,30:1 ·
`--text/--bg` 18,03:1 · `.stage-tag` `#F54133` sobre `#0B0B0C` 5,33:1.

**Impacto** — WCAG 1.4.3 (AA) em dois pontos de ação; o restante da paleta é sólido.

**Gate recomendado** — axe `color-contrast` sem exceções nas 7 telas, com confirmação manual dos
serious (foi assim que confirmei estes dois).

---

### L-01 · BAIXO · A numeração das seções de resultado salta o “4”

Com o gate **aberto**, os números renderizados são `1,2,3,5,6,7,8,9`; com o gate **fechado**, `1..9`
contínuos. Causa: `String(i + 1)` usa o índice do **catálogo** `P52_SECTIONS` e não a posição entre as
seções realmente presentes — com o gate aberto a seção `evidence` é esvaziada e pulada por `continue`,
mas `i` avança. O trilho lateral não numera, então não há contradição, apenas um sumário com buraco.

### L-02 · BAIXO · Subgrupos de requisitos não preservam o estado aberto nas repinturas

Medido: com `sig` e `sig-1` abertos, uma repintura (troca de bundle) devolve `sig=aberto`,
`sig-1=fechado`. Causa: `paintEditor()` guarda o estado consultando apenas
`details.v32-group[data-gid]`; os subgrupos são `details.v32-siggroup` e caem no default `false`.
Os **seis grupos principais** — que são o objeto da errata §4 — preservam corretamente.

### L-03 · BAIXO · `aria-controls="notetxt"` órfão com a evidência fechada

Na tela de questão com a caixa fechada, `#notetgl` mantém `aria-controls="notetxt"` apontando para um
elemento inexistente. `aria-expanded` está correto nos dois estados (`false`/`true`, verificado em nó
fresco). Único IDREF órfão encontrado em 7 telas.

### L-04 · BAIXO · Alvos `(i)` de 22×22 px

Os 60 controles de ajuda medem **22×22 px** (mínimo do SC 2.5.8 é 24×24). Nos cabeçalhos de grupo a
exceção de espaçamento é satisfeita (nenhum vizinho a menos de 24 px do centro). Nas 21 linhas de
sinais, **não**: o centro do `(i)` fica a 22,1 px do centro da caixa de seleção (18×18 px). axe reporta
`target-size` serious em 52 nós com todos os grupos abertos. A exceção “inline” do SC é discutível
para os controles que ficam ao fim do rótulo; registro a medição e deixo a decisão de conformidade
explícita para o proprietário.

### L-05 · BAIXO · `svg.p52-emblem` com `role="img"` contendo cinco controles focáveis

axe `nested-interactive` (serious). A árvore de acessibilidade do Chromium expõe os cinco
`g[role=button]` (`ignored=false`) e a tabulação os alcança na ordem correta; `Enter`/`Espaço`
funcionam. Pela especificação ARIA o subárvore de `role="img"` é apresentacional, portanto outros
motores/AT podem não expô-los. Sem leitor de tela real, não afirmo impacto — registro o risco.

### L-06 · BAIXO · Redundância e ambiguidade textual

- A capa do PDF imprime **duas vezes** “Screening indicativo de alto nível. Não substitui um assessment formal.”
- Cinco links externos distintos usam o mesmo texto “Página oficial ↗” (todos com `target="_blank" rel="noopener"` e destinos `fortinet.com` corretos). Em lista de links de leitor de tela, os cinco ficam indistinguíveis.

### L-07 · BAIXO · `#v32-print-report` retém ~29 KB do relatório anterior após `afterprint`

O nó permanece no DOM com o conteúdo da última impressão (`display:none`, 0 focáveis, invisível a
`checkVisibility`). Não vaza para a tela nem para o papel — `preparePrint()` reconstrói a cada
impressão —, mas mantém em memória o relatório de uma sessão possivelmente já substituída por outro
cliente.

### L-08 · BAIXO · `heading-order` na tela de resultados

axe (moderate): salto de nível de cabeçalho em `.panel:nth-child(1) > h3`. Confirmado no dump de
cabeçalhos (`H2 → H3 → H4` com H4 usados para itens de card).

---

## 5. Verificação adversarial da errata v3.2.2

Os três pontos foram tratados como **hipóteses a refutar**. Nenhuma foi refutada.

### 5.1 Densidade de ajuda — **NÃO REFUTADA (confirmada)**

Editor aberto, todos os grupos expandidos, contagem programática:

```text
total de controles (i)                      : 60
em "Situação declarada" (22 selects)        : 0     <- exigido: zero
dentro do grupo "Plataformas e licenciamento": 0     <- exigido: zero
no cabeçalho desse grupo                     : 1     <- exigido: exatamente um
capabilities com ajuda no nome               : 22/22
cabeçalhos de grupo com ajuda                : 10/10 (3 famílias + arch + plat + sig + 4 subgrupos)
campos de arquitetura                        : 6/6
sinais                                       : 22/22
aria-describedby órfãos                      : 0
IDs duplicados                               : 0 (ver M-02: a entrada HOME reprova por outro motivo)
popovers sem dono / donos sem popover        : 0 / 0
controles aninhados (nested-interactive)     : 0 no editor
botões focáveis invisíveis                   : 0
```

Texto do único `(i)` do grupo de plataformas, verificado literalmente e **fabricante-neutro**:

> “Registre a base instalada e os direitos de uso já existentes: o que está em produção e o que está
> licenciado ou contratado. Serve para evitar recompra e orientar adoção. **Declarar não prova
> implantação, cobertura nem maturidade**, e nada aqui altera score, estágio ou gaps.”

Contrato de interação verificado: clique alterna; `hover` abre e `mouseleave` fecha; `focus` abre;
apenas **um** popover aberto por vez; `Esc` fecha, devolve o foco ao controle e **não** reabre (a
supressão `p52NoReopen` funciona — 0 abertos após 300 ms); o `(i)` de cabeçalho **não** alterna o
`<details>` (medido: `before=false → after=false`, popover aberto).

### 5.2 Accordion — **NÃO REFUTADA nos seis grupos principais**; ressalvas L-02, A-02 e B-01

| Verificação | HOME | RESULTADOS |
|---|---|---|
| Seis grupos nascem recolhidos (`open=false`, `aria-expanded="false"`, `data-p52-grp="closed"`) | ✔ | ✔ |
| Foco inicial no primeiro `<summary>` (“SOC & Operations”) | ✔ | ✔ |
| Grupo aberto pelo usuário sobrevive a: declarar situação | ✔ | ✔ |
| … adicionar tecnologia | ✔ | ✔ |
| … trocar bundle | ✔ | ✔ |
| Cancelar → reabrir recomeça recolhido | ✔ | ✔ |
| Foco após cancelar | `<body>` (volta à home) | `#v32cta` ✔ |
| Decoração extra / mutação avulsa **não** recolhe | ✔ | ✔ |
| Clique em `<summary>` não recolhe os demais | ✔ | ✔ |
| Reabertura por **Espaço** no CTA recomeça recolhido | ✔ | n/a |
| “Ir para contexto tecnológico” (a partir do bloqueio de impressão) **preserva** o que estava aberto | ✔ | ✔ |

Trilha medida (entrada HOME):

```text
inicial : g1=c g2=c g3=c arch=c plat=c sig=c sig-0..3=c   foco=SUMMARY "SOC & Operations"
usuário : g2=O plat=O
presence: g2=O plat=O   add: g2=O plat=O   bundle: g2=O plat=O
cancelar+reabrir: tudo recolhido, foco=SUMMARY "SOC & Operations"
```

**Sobre “verifique também o foco e o teclado nesse instante”**: é exatamente aí que a errata deixa
descoberto o essencial. O estado inicial e a persistência estão certos; o **foco** durante as
repinturas não (A-02) e o **teclado** na entrada HOME é destrutivo (B-01).

### 5.3 Movimento — **NÃO REFUTADA (confirmada integralmente)**

Instrumentação: amostragem por `requestAnimationFrame` durante 700 ms (≈43 quadros), lendo
`getComputedStyle(section.screen).animationName/animationDuration/opacity/transform`,
`document.getAnimations()` e `window.scrollY`.

`prefers-reduced-motion: no-preference`

| Ação | `animationName` | duração | opacidade mín/máx | transform | `data-p52-nav` | Δscroll | animações ativas |
|---|---|---|---|---|---|---|---|
| selecionar resposta (mouse) | `none` | 0s | 1 / 1 | `none` | — | 0 | 0 |
| trocar resposta (mouse) | `none` | 0s | 1 / 1 | `none` | — | 0 | 0 |
| selecionar por tecla “2” | `none` | 0s | 1 / 1 | `none` | — | 0 | 0 |
| abrir observação | `none` | 0s | 1 / 1 | `none` | — | 455* | 0 |
| **avançar** (clique) | `p52-nav-fwd` | 0,15s | 1 / 1 | `translateX(18px) → 0` | `fwd` | — | 1 |
| **avançar** (`Enter`) | `p52-nav-fwd` | 0,15s | 1 / 1 | `translateX(18px) → 0` | `fwd` | — | 1 |
| **voltar** | `p52-nav-back` | 0,15s | 1 / 1 | `translateX(-18px) → 0` | `back` | — | 1 |

\* o deslocamento de 455 px ao abrir a observação é o `focus()` do `<textarea>` rolando a página, não animação (0 animações ativas, `animationName: none`).

`prefers-reduced-motion: reduce` — as **sete** ações: `animationName: none`, duração `0s`,
`transform: none`, `document.getAnimations().length` **máximo 0**. O atributo `data-p52-nav`
continua sendo escrito (`fwd`/`back`), e é só o CSS que decide — exatamente como o arquivo documenta.
**Nenhum movimento residual.**

**Nada disso decide por navegador ou dispositivo**: varredura do arquivo inteiro por `navigator.`,
`userAgent`, `platform`, `devicePixelRatio`, `screen.width/height` → **zero ocorrências** em código
executável (as únicas linhas com “platform” são identificadores de domínio de negócio). A única leitura
de ambiente é `matchMedia("(prefers-reduced-motion: reduce)")`. Confirmei também ausência de
`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `localStorage`, `sessionStorage`, `indexedDB`,
`document.cookie`, `eval` e `new Function` — **zero** ocorrências.

---

## 6. Matriz dos fluxos executados

| # | Fluxo | Executado | Resultado |
|---|---|---|---|
| 1 | Home, nova sessão e importação | sim | PASS (com A-01 sobre `Enter` no botão Importar) |
| 2 | Questionário completo por mouse | sim | PASS |
| 3 | Questionário completo por teclado (1–5 / `Enter` / `←`) | sim | PASS funcional; M-04 (foco) e A-01 (botões) |
| 4 | Movimento ao selecionar × ao navegar | sim | PASS (§5.3) |
| 5 | Evidência por pergunta | sim | PASS — `aria-expanded` correto, foco vai ao `textarea`, indicador de evidência aparece; L-03 |
| 6 | Mapa do assessment (sidebar da questão) | sim | PASS — “3 de 3 respostas confirmadas neste domínio”, por prática, coerente com o estado |
| 7 | Refinamento opcional | parcial | Tela `refbranch` alcançada e correta (`Refinar diagnóstico` / `Continuar sem aprofundamento`); as 3 perguntas não foram percorridas em profundidade |
| 8 | Contexto tecnológico pela home | sim | **FAIL — B-01** |
| 9 | Contexto tecnológico pelos resultados | sim | PASS |
| 10 | Estado inicial dos seis grupos / preservação / reinício | sim | PASS (§5.2) |
| 11 | Salvar, cancelar e reabrir contexto | sim | PASS por mouse e por Espaço; FAIL por `Enter` na entrada HOME |
| 12 | Imprimir com draft pendente, localizar orientação, limpar bloqueio | sim | PASS — ver §8 |
| 13 | Resultado bloqueado (gate fechado) | sim | PASS |
| 14 | Resultado liberado (gate aberto) | sim | PASS |
| 15 | Prioridades, gaps, recomendações e links oficiais | sim | PASS — 5 links `fortinet.com`, `target=_blank rel=noopener`; L-06 |
| 16 | Cenário-alvo e Current × Target | sim | PASS |
| 17 | Exportação / importação / rejeição de sessão inválida / troca de cliente | sim | PASS — ver §9 |
| 18 | Relatório/PDF com e sem contexto tecnológico | sim | PASS — 9 PDFs, ver §7 |
| 19 | Responsividade 7 viewports × 4 zooms | sim | PASS exceto M-01 |
| 20 | axe-core em 7 telas | sim | ver M-05, L-04, L-05, L-08 |
| 21 | Idempotência / reentrância | sim | PASS — 60 renders: 0 erros, 0 IDs duplicados, 8 seções, 8 itens de trilho |

### 6.1 Invariantes metodológicas — 12 cenários contra oráculo independente

Oráculo escrito por mim em Node, reimplementando a semântica declarada (média das confirmadas por
domínio, arredondada a 1 casa; geral = média das médias publicáveis; suficiência = ≥10 confirmadas
**e** ≥2 por domínio). **12/12 conferiram exatamente**, em score, estágio, valores por domínio e
estado do gate.

| Cenário | Confirmadas | Oráculo | Tela | Gate |
|---|---|---|---|---|
| nada respondido | 0 | n/d | `n/d / 5.0` | blocked |
| 9 confirmadas | 9 | n/d | `n/d / 5.0` | blocked |
| 13 confirmadas, 1 domínio com 1 | 13 | n/d | `n/d / 5.0` | blocked |
| **todas “Não sei”** | 0 (15 NA) | n/d | `n/d / 5.0` | blocked |
| **todas nível 0** | 15 | 0.0 · Non-existent | `0.0 / 5.0` | released |
| todas nível máximo | 15 | 5.0 · Optimizing | `5.0 / 5.0` | released |
| **fronteira 0,5** | 12 | 0.5 · Initial | `0.5 / 5.0` | released |
| **fronteira 1,5** | 15 | 1.5 · Managed | `1.5 / 5.0` | released |
| **fronteira 2,5** | 14 | 2.5 · Defined | `2.5 / 5.0` | released |
| **fronteira 3,5** | 15 | 3.5 · Quantitatively Managed | `3.5 / 5.0` | released |
| **fronteira 4,5** | 12 | 4.5 · Optimizing | `4.5 / 5.0` | released |
| mistura com NA | 10 (5 NA) | 2.5 · Defined | `2.5 / 5.0` | released |

Conclusões diretas:

- **UNSET nunca vira zero.** Com o gate fechado a tela publica `n/d` em todos os domínios e o painel
  de suficiência declara o déficit exato (“Falta 1 resposta confirmada no total (9 de 10)”,
  “Serviços: +1 resposta confirmada necessária (1 de 2)”). No heat map, a prática não respondida
  recebe `aria-label` “…: **Não avaliado · sem score**”, e na tabela alternativa “Não avaliado | n/d”.
- **`Não sei` não confirma e não pontua.** 15 NA ⇒ 0 confirmadas ⇒ gate fechado; no anexo do PDF as
  15 respostas saem como “Não sei / precisa validar”.
- **Zero confirmado permanece zero legítimo**: 15 respostas nível 0 publicam `0.0 · Non-existent`
  com gate aberto — não confundido com ausência.
- **Tecnologia não altera score.** Cenário com contexto declarado e salvo mantém score, estágio e
  suficiência idênticos; o PDF correspondente ganha a seção de contexto e nada mais.
- **Target não contamina Current** (§10).
- **Print não altera estado**: `fullStateJSON()` idêntico antes e depois de `beforeprint`+`afterprint`;
  classes de `body` limpas ao final.

---

## 7. Avaliação específica do PDF

Nove PDFs reais gerados em Chromium, A4 (594,96 × 841,92 pt confirmado por `pdfinfo`), escala 100%,
fundos habilitados, cabeçalhos/rodapés do navegador desabilitados, `@page` do documento respeitado.

| Caso | Páginas | Tinta por página | Veredito |
|---|---|---|---|
| suficiente **com prioridades** | 6 | 9,6 / 13,4 / 9,3 / 4,2 / 10,5 / 1,8 % | PASS |
| suficiente **sem contexto tecnológico** | 5 | 9,8 / 14,1 / 6,5 / 10,4 / 1,8 % | PASS |
| **fronteira de estágio (2,5)** | 5 | 9,8 / 12,9 / 3,8 / 10,3 / 1,8 % | PASS |
| **insuficiente** | 5 | 12,2 / 9,2 / 4,5 / 9,4 / 1,0 % | PASS |
| **alvo suficiente com Current insuficiente** | 6 | 12,2 / 9,6 / 8,8 / 4,3 / 9,4 / 1,0 % | PASS |
| alvo com Current suficiente | 7 | 9,6 / 12,3 / 9,5 / 9,3 / 4,3 / 10,5 / 1,8 % | PASS |
| **com contexto tecnológico salvo** | 9 | 9,6 … 1,7 % | PASS |
| **draft de contexto pendente** | 1 | 0,6 % | PASS (bloqueio correto) |
| todas “Não sei” | 3 | 11,3 / 5,1 / 9,4 % | PASS |

**Páginas residuais: nenhuma.** A menor cobertura de tinta observada é 1,0–1,8 % na última página, que
é a cauda do anexo de respostas — conteúdo real, não página vazia.

**Inspeção de texto por página** (`pdftotext -layout`) e **inspeção rasterizada** (`pdftoppm`,
páginas 1–2 do caso com prioridades e 2–4 do caso com alvo, revisadas visualmente):

- **Capa e metadados**: emblema pentagonal dos cinco domínios, marca, título, subtítulo, `SESSÃO`,
  `DATA DA SESSÃO`, `RELATÓRIO GERADO EM`, `VERSÃO DA FERRAMENTA 3.4.0-dev.4.8.0.7`,
  `COBERTURA DA EVIDÊNCIA n de 15`. Coerentes com a tela em todos os casos.
- **Régua de estágio**: as faixas têm largura proporcional às faixas reais de `stageOf()` (0–0,5 = 10 %,
  0,5–1,5 = 20 %, …) e o marcador “Você está aqui” fica em `score/5`. Conferido no caso 1,5: o marcador
  cai exatamente na fronteira Inicial→Gerenciado e a leitura diz “1.5 / 5 · Gerenciado”, que é o valor
  correto (1,5 é o primeiro valor de *Managed*). Sem suficiência **não há marcador** e a régua imprime
  “Estágio não determinado: dados insuficientes”.
- **Jornada horizontal**: uma linha, atômica, com `PERFIL ATUAL` e `PRÓXIMO ESTÁGIO` marcados; não
  ocupa página inteira.
- **Quebras, títulos órfãos e cards**: nenhum card cortado entre páginas nas 47 páginas revisadas;
  nenhum título isolado no rodapé.
- **Coerência tela ↔ papel**: no caso de fronteira, tela `2.5 / 5.0` + `Defined`; papel
  `2.5 / 5 Definido`, domínios `2.5 3.3 2.8 1.1 2.8` — idênticos.
- **Publicação sob suficiência fechada**: papel imprime `n/d` no KPI, “Estágio: suficiência de dados
  não atingida”, `n/d` nos cinco domínios e a frase canônica “Evidência insuficiente: nenhum score de
  maturidade por domínio é publicado até o gate canônico abrir. n/d significa não avaliado — nunca
  zero. 7 de 15 respostas confirmadas; a regra canônica exige ao menos 10 confirmadas e ao menos 2 por
  domínio.” **Nenhum valor contraditório sobreviveu ao papel.**
- **Alvo com Current insuficiente**: a comparação aparece com `Atual · n/d` e `Cenário-alvo · n/d` e a
  nota “…nenhum score, estágio, valor por domínio ou delta é publicado nesta comparação, **de nenhum
  dos dois lados**”. Correto e indivisível.
- **Alvo com Current suficiente**: `1.5 / 5` × `2.7 / 5` com tabela por domínio
  `0.6→1.7 (+1.1) · 2.2→2.8 (+0.6) · 1.7→3.3 (+1.6) · 1.1→2.2 (+1.1) · 1.7→3.3 (+1.6)`. Recalculei:
  média dos alvos = 13,3/5 = 2,66 → **2,7**. Todos os deltas conferem.
- **COPY-B no papel**: 0 ocorrências de “mandato”/“charter”; subtítulo na forma nova.
- **Draft pendente**: 1 página com exatamente a frase de bloqueio; `body.v32-print-blocked`, sem
  `v32-print-mode` — a superfície de aplicação **não** vaza para o papel.

**Regressão em impressão/PDF: nenhuma encontrada.** Único apontamento cosmético: L-06 (linha do
subtítulo duplicada na capa).

---

## 8. Bloqueio de impressão com contexto pendente

Medido com `window.print` instrumentado:

```text
sem draft            : window.print chamado = 1                (imprime)
com draft aberto     : window.print chamado = 1 (não incrementou)  -> BLOQUEADO
mensagem inline      : "Salve ou cancele as alterações do contexto tecnológico antes de gerar o
                        relatório. · Ir para contexto tecnológico"
                       role="alert"  aria-live="assertive"
                       o botão recebe aria-describedby="p52-print-pending"
distância medida     : 299 px do botão que falhou   (a v3.2.1 alegava 5.544 px)
trilho lateral       : "Contexto tecnológico · opcional · alterações pendentes" (texto, não só cor)
antes da tentativa   : trilho já sinaliza pendência; a mensagem local ainda não existe  ✔ §6.3
"Ir para contexto"   : leva ao editor SEM descartar o draft; foco no primeiro <summary>;
                       preserva os grupos que o usuário havia aberto
após Cancelar        : mensagem some, trilho volta a "seção atual", impressão volta a funcionar
Ctrl+P nativo        : página única com a frase de bloqueio (rede de segurança correta)
```

Esta correção está **correta e bem localizada**. A ressalva é que ela também é o que torna B-01
visível ao usuário como “não consigo imprimir” — o bloqueio funciona, o que falta é impedir que o
`draft` fique órfão.

---

## 9. Portabilidade de sessão, isolamento e entradas adversariais

**Documento exportado** — chaves de raiz: `format`, `schemaVersion` (1), `toolVersion`, `engineSha256`,
`createdAt`, `label`, `inputs`. 3.413 bytes. **Zero derivados serializados** (nenhum `overall`,
`score`, `stage` ou `suff` no payload).

**Round-trip e isolamento de cliente**

```text
sessão A (score 1.5) -> exportada
contaminação: todas as respostas para nível 3 (score 5.0), nota trocada, alvo limpo
importar A -> {ok:true}
  captureCanonicalInputs()  antes === depois : true
  fullStateJSON()           antes === depois : true
  score na tela             1.5 / 5.0  (recomputado, não restaurado)
  nota preservada byte a byte, com acentos, aspas, & < > e emoji
```

**Rejeição de documentos adversariais** — 13 documentos, todos recusados com mensagem precisa e
**estado da sessão intacto após todas as rejeições** (verificado por igualdade de
`captureCanonicalInputs()`):

| Documento | Resposta da ferramenta |
|---|---|
| `null`, string, array | “Arquivo não é um documento de sessão válido.” |
| `format` errado | “Este arquivo não é uma sessão do Quickscan SecOps.” |
| `schemaVersion: 2` | “…versão de schema que esta versão do Quickscan não suporta.” |
| campo extra na raiz (`results`) | “Campos não reconhecidos no documento: results” |
| derivado dentro de `inputs` | “Entradas não reconhecidas: results” |
| resposta `9` | “Resposta inválida em: mandate” |
| resposta `"NA "` (com espaço) | “Resposta inválida em: mandate” |
| `answers` sem uma prática | “Respostas incompletas — práticas ausentes: logs. O schema v1 exige todas as práticas; ‘não respondida’ é representada por `null`, não pela ausência da propriedade.” |
| nota de 20.000 caracteres | “Nota de mandate excede o limite de 10000 caracteres.” |
| `engineSha256` diferente | validação passa, **compatibilidade bloqueia**: “Esta sessão foi criada com outro engine de maturidade…” |
| `__proto__` como string (raiz) | “Campos não reconhecidos no documento: __proto__” |
| `__proto__` como objeto (raiz) | idem — e `({}).polluted === false`: **sem poluição de protótipo** |
| chave desconhecida em `notes` | “Nota para prática desconhecida: __proto__x” |

`missing ≠ null ≠ [] ≠ "unset"` é tratado com a distinção correta e mensagem explícita.

---

## 10. Cenário-alvo · Current × Target

- `tgtComparisonPublishable(cur) === (cur.suff === true)`: com Current insuficiente **nenhum** dos dois
  lados publica — nem KPI, nem estágio, nem valor por domínio, nem delta, nem polígono pintado — em
  tela **e** em papel. Confirmado nos dois meios.
- Com Current suficiente, a comparação publica e todos os deltas conferem com recálculo próprio.
- O alvo **não** contamina o Current: em nenhum cenário com overrides o score atual mudou.
- O disclaimer indicativo (“a adoção de tecnologia, isoladamente, não altera a maturidade…”) está
  presente em tela e no PDF.
- Sem alvo declarado, o trilho anuncia “sem cenário-alvo” e a seção diz explicitamente que nenhum
  cenário foi definido.

---

## 11. Avaliação visual, responsiva e acessível

### 11.1 Responsividade — varredura de 28 combinações (7 viewports × 4 zooms)

Critérios: rolagem horizontal do documento, elementos ultrapassando o viewport sem ancestral rolável,
e texto recortado por `overflow:hidden`.

| Viewport | 100% | 110% | 125% | 200% |
|---|---|---|---|---|
| 390×844 | **M-01** | **M-01** | **M-01** | M-01 + 8 px de rolagem horizontal (195 px CSS) |
| 768×1024 | ok | ok | ok | **M-01** (384 px CSS) |
| 1024×768 | ok | ok | ok | ok |
| 1440×900 | ok | ok | ok | ok |
| 1920×1080 | ok | ok | ok | ok |
| 2560×1440 | ok | ok | ok | ok |
| 3440×1392 | ok | ok | ok | ok |

Todos os problemas se concentram no **editor de contexto** e têm a mesma causa (M-01). Home, questão,
prioridades e resultados atravessam as 28 combinações sem rolagem horizontal e sem clipping. Aos
195 px CSS (390 px a 200%) há 8 px de rolagem horizontal — abaixo do limiar de 320 px do WCAG 1.4.10,
portanto fora do requisito, registrado por completude.

### 11.2 Aproveitamento de tela e tipografia

- **1440×900** (tela de trabalho declarada): tela de questão em duas colunas — enunciado e opções à
  esquerda, mapa do assessment à direita, com estado por prática (“Confirmado · 1,7”) e progresso por
  domínio. Densidade boa, hierarquia clara, cards de opção com número, título e descrição.
- **1920×1080 / 2560×1440**: escala bem, sem colunas de texto excessivamente largas.
- **3440×1392 (ultrawide)**: trilho lateral + duas colunas na visão executiva; o radar fica com folga
  vertical generosa na coluna esquerda — desperdício estético, não defeito.
- **768×1024**: colapsa para coluna única corretamente.
- Régua, radar, barras por domínio, jornada e heat map são SVG/CSS nativos, legíveis em todas as
  resoluções testadas.

### 11.3 Acessibilidade — axe-core 4.13.0 em 7 telas

| Tela | critical | serious | moderate |
|---|---|---|---|
| home | 0 | 2 (`color-contrast`, `nested-interactive`) | 1 (`region`) |
| questão | 0 | 0 | 1 (`region`) |
| prioridades | 0 | 1 (`color-contrast`) | 2 (`region`, `page-has-heading-one`) |
| resultados (gate aberto) | 0 | 0 | 2 (`heading-order`, `region`) |
| resultados (gate fechado) | 0 | 0 | 2 |
| editor de contexto (recolhido) | 0 | 1 (`target-size`, 6 nós) | 2 |
| editor de contexto (aberto) | 0 | 1 (`target-size`, 52 nós) | 2 |

Todos os *serious* foram confirmados manualmente (M-05, L-04, L-05). `region` e `page-has-heading-one`
são *best-practice*, não critérios WCAG — registro sem transformar em achado.

### 11.4 Verificações manuais adicionais

| Verificação | Resultado |
|---|---|
| Controle interativo aninhado em outro | **0** em todas as telas (única exceção: L-05, `role="img"`) |
| Botões/controles sem nome acessível | **0** |
| IDREF órfãos (`aria-describedby/labelledby/controls/owns/for`) | 1 (L-03) |
| IDs duplicados | 1 (M-02, só na entrada HOME do editor) |
| Botões focáveis invisíveis | **0** |
| Ajudas por mouse / teclado / clique / `Esc` | **todas as quatro** funcionam |
| Regiões roláveis focáveis | heat map e tabela alternativa com `overflow-x:auto` declarado |
| `live regions` | `#ux-progress-mobile` (`role=status`), `#p50-session-status` (`polite`), `#p52-print-pending` (`assertive`) |
| Ordem de tabulação | segue a ordem do DOM e a ordem visual em todas as telas |

---

## 12. Arquitetura, riscos e dívida técnica

### 12.1 O que está bem resolvido

- **Camadas aditivas com owner único.** Cada camada embrulha a anterior chamando o predecessor
  **antes** e nunca substituindo o fluxo congelado. `p52Decor` é idempotente e reentrante: 60 renders
  consecutivos produziram 0 erros, 0 IDs duplicados, exatamente 8 seções e 8 itens de trilho.
- **Um único dono por decisão.** Suficiência vem de `p50SuffContract`; publicabilidade por domínio vem
  de `window.__V32UI.publishableStats`; pendência de draft é lida do owner (`_setDraft`), sem espelho.
  Não encontrei um segundo booleano de verdade.
- **Save transacional** no contexto: snapshot completo, validação, rollback integral em caso de erro,
  com invariante M43 verificada em runtime.
- **Zero superfície proibida**: sem rede, sem armazenamento de navegador, sem telemetria, sem `eval`.
- **Determinismo**: a decisão de animar é função exclusiva do estado da aplicação; nenhuma leitura de
  fingerprint.
- **Desempenho**: um render completo de resultados custa **4,6 ms**; 60 renders encadeados, 1.037 ms.
  O arquivo tem 993.584 bytes / 12.546 linhas em um `<style>` e um `<script>`.
- **Anti-`innerHTML` em nó vivo** na camada 5.2, com `DOMParser` inerte onde precisa parsear.

### 12.2 Riscos arquiteturais

1. **Handler global de teclado que não conhece o alvo** *(causa de B-01 e A-01)*. Um `keydown` no
   `document` que decide por `step` e isenta por `tagName` é frágil por construção: cada nova tela ou
   controle adicionado por uma camada superior herda o sequestro sem que ninguém perceba.
   `uxOpenHomeEditor()` monta uma tela nova **sem** mudar `step`, e é exatamente essa combinação que
   produz o blocker. Enquanto a decisão de teclado não migrar para “o alvo trata a própria tecla”, o
   risco reaparece a cada tela nova.
2. **Reparentamento pós-render como técnica padrão de decoração** *(causa de A-02)*. Camadas que
   reorganizam o DOM depois que o owner restaurou o foco vão continuar derrubando o foco. É um custo
   estrutural do modelo “decorar sem editar o owner”.
3. **Wrappers dependentes de alcance léxico** *(causa de M-03)*. O arquivo documenta corretamente que
   `paintEditor` é inalcançável, e mesmo assim instala um wrapper sobre `buildPrintReport`, que é
   inalcançável pelo mesmo motivo. Toda tentativa de wrapper deveria falhar ruidosamente
   (`console.error` + contador) em vez de degradar para `null` silenciosamente.
4. **Numeração de seção derivada do catálogo e não da presença** *(L-01)*. Padrão que reaparecerá se
   outra seção passar a ser condicional.
5. **Especificidade de CSS entre camadas** *(M-01)*. Um override em `@media` de uma camada não alcança
   a regra base de outra camada porque a base é mais específica. Com nove camadas de folha de estilo
   no mesmo documento, isso é dívida recorrente.
6. **`#v32-print-report` persistente** *(L-07)*: o relatório de uma sessão sobrevive à troca de cliente
   dentro da mesma aba. Não vaza, mas é estado desnecessário.

### 12.3 Dívida técnica × sugestão de produto × preferência estética

- **Defeitos reproduzíveis**: B-01, A-01, A-02, M-01, M-02, M-03, M-04, M-05, L-01, L-02, L-03, L-08.
- **Risco arquitetural**: os seis itens de §12.2.
- **Dívida técnica**: L-07 (estado residual), L-04 (2 px abaixo do alvo mínimo — decisão de design com
  consequência normativa).
- **Sugestão de produto**: L-06 (texto de link repetido; linha duplicada na capa), aproveitamento
  vertical do radar em ultrawide.
- **Preferência estética**: nada que eu tenha transformado em achado.
- **HTML único**: é requisito de distribuição e **não** o trato como defeito. A arquitetura interna
  sustenta o requisito — camadas nomeadas, fronteiras declaradas, pontes públicas explícitas, zero
  dependência externa. O custo é o acoplamento por escopo léxico descrito em §12.2.3.

---

## 13. Roadmap priorizado

| Prioridade | Ação | Achados fechados |
|---|---|---|
| **P0 — antes de qualquer uso com cliente** | Isentar do handler global de teclado todo alvo que trata a própria tecla (`BUTTON`, `SELECT`, `SUMMARY`, `A[href]`, `[role=button]`, `[contenteditable]`), ou condicionar o ramo `step===-1` a `data-uxscreen==="home"`. Acompanhar de gate de equivalência `Enter` ≡ clique. | **B-01**, **A-01** |
| **P1** | Preservar o foco nas repinturas do editor: capturar `activeElement` antes de `p52ContextEditorDecor()` e restaurá-lo depois do reparentamento (ou montar as regiões uma única vez e mover só o conteúdo novo). | **A-02** |
| **P1** | Corrigir o reflow do editor: `min-width:0` nos itens de `.p52-grp-body` e override de `grid-template-columns` com especificidade suficiente para `#v32editor .v32-subs .v32-signals`. | **M-01** |
| **P2** | Remover o `id="v32errors"` duplicado da entrada HOME (usar apenas a caixa do editor) e estender o gate de unicidade de ID às duas entradas. | **M-02** |
| **P2** | Tornar o wrapper de `buildPrintReport` alcançável (expor a função pela ponte `__V32UI`/`__DEV` **antes** de a camada 5.2 rodar) ou remover o código morto e reescrever o comentário para descrever o caminho real. Adicionar gate de equivalência de linguagem entre fonte e papel. | **M-03** |
| **P2** | Gestão de foco e cabeçalhos no questionário: enunciado como cabeçalho com `tabindex="-1"` recebendo foco a cada transição; `h1` por tela. | **M-04** |
| **P2** | Ajustar as duas cores reprovadas para ≥4,5:1. | **M-05** |
| **P3** | Numerar seções pela posição entre as presentes; preservar `details.v32-siggroup` em `paintEditor`; remover `aria-controls` quando a caixa está fechada; alvos `(i)` para 24×24; reavaliar `role="img"` do emblema (usar `role="group"` ou `graphics-document`); limpar `#v32-print-report` no `afterprint`; corrigir `heading-order`; remover a linha duplicada da capa; diferenciar os textos dos cinco links externos. | **L-01…L-08** |

---

## 14. Respostas objetivas

**Você confiaria no resultado?**
**Sim, no número.** Construí um oráculo independente e o exercitei em 12 cenários, incluindo as cinco
fronteiras de estágio, zero legítimo, todas “Não sei”, déficit global e déficit por domínio. Bateu
exatamente em todos. UNSET nunca virou zero, `Não sei` nunca pontuou, tecnologia nunca mexeu na nota,
Target nunca contaminou Current, e o gate de suficiência fechado impediu a publicação em tela e em
papel, dos dois lados da comparação. O motor de resultado desta candidata é o componente mais sólido
do artefato.

**Você enviaria o PDF?**
**Sim.** Gerei nove PDFs reais cobrindo todos os casos exigidos, inspecionei texto por página e
rasterização, e não encontrei página residual, card cortado, título órfão nem contradição entre tela e
papel. A capa, os metadados, a régua, o marcador e a jornada estão corretos, e o relatório é honesto
sob suficiência fechada. A única ressalva é cosmética (uma linha de subtítulo duplicada na capa).

**Você usaria a ferramenta numa reunião real?**
**Sim, com uma restrição que eu comunicaria ao facilitador antes da reunião: conduzir por mouse e
abrir o contexto tecnológico pelos RESULTADOS, nunca pela home.** Sem essa restrição, não. Um `Enter`
sobre “Salvar contexto” — o gesto mais natural do mundo depois de escolher um valor em um `select` —
apaga o contexto declarado na frente do cliente e deixa o relatório inacessível, sem dizer por quê.
Numa demonstração ao vivo isso não é um bug de polimento: é a reunião parando. Corrigido o P0, minha
resposta passa a ser um sim sem asterisco.

---

## 15. Declarações finais

- **Nenhuma correção foi implementada.**
- **O pacote não foi modificado.** ZIP, `MANIFEST_SHA256.txt` e os 15 arquivos foram reverificados ao
  final: 15/15 OK; SHA-256 do ZIP inalterado.
- **O HTML original permaneceu byte-idêntico.** Toda a execução ocorreu sobre cópia em diretório
  temporário. Verificação final:

```text
332631223e40cfea0b4102ac325920389752a5e9c3e669d99063d592c7fa8ca2  pkg/quickscan_secops_soccmm_v3_2_2_candidate.html
332631223e40cfea0b4102ac325920389752a5e9c3e669d99063d592c7fa8ca2  work/candidate.html   (cópia usada nos testes)
332631223e40cfea0b4102ac325920389752a5e9c3e669d99063d592c7fa8ca2  phase5/quickscan_secops_soccmm_v3_2_dev.html
da6faffd25aeb493d06d905d16cfc534c7a73e5fad771ff35d8eb1dacff8c1bb  ...REVIEW_PACKAGE_2026-08-25_REV_B.zip
```

- **Nenhum commit, push, PR, merge, tag, release ou deployment foi realizado.**
- Nada marcado como PASS neste parecer deixou de ser executado. O que não foi executado está
  declarado em §1.3 e no fluxo 7 da matriz.

