# Patch V3.2.2 — paridade do contexto tecnológico, rodapé responsivo e pendência de impressão

Correção estreita de UX sobre a release publicada **v3.2.1**, preparada como candidata local e
**não comitada**. Este relatório declara separadamente fatos observados, decisões de implementação,
defeitos reais do produto, defeitos do harness, limitações e pendências do proprietário.

- Instrução desta rodada: `PROMPT_PATCH_QUICKSCAN_V3_2_2_CONTEXT_FOOTER_PRINT_UX.md`
  · SHA-256 `0f96327161e552e8911f540fdfe1df6fc7ca4e51355786afdf46fd4558ff1342` · 19.212 bytes · UTF-8
  sem BOM · zero CRLF.
- Branch de trabalho: `fix/v3.2.2-context-footer-print-ux`, criada a partir de
  `07bc90b3fbf6f033a56c490f3bff1951c58316b7` **após** o preflight passar.
- **Nada foi comitado, empurrado, mesclado, marcado, publicado ou implantado.**

---

## 1 · Preflight (§1) — PASS

| verificação | esperado | observado | veredito |
|---|---|---|---|
| branch inicial | `main` | `main` | PASS |
| `HEAD` | `07bc90b3fbf6f033a56c490f3bff1951c58316b7` | idem | PASS |
| `origin/main` | mesmo commit | idem | PASS |
| `v3.2.1^{}` | mesmo commit | idem | PASS |
| objeto anotado da tag | `1707d3dec94d567956748162793bd6b160b89af0` | idem | PASS |
| worktree | sem arquivo rastreado modificado | limpo | PASS |
| `AGENTS.md` | não rastreado, preexistente | presente e **intocado** | PASS |
| HTML canônico | `fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79` · 963.373 bytes | idem | PASS |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | idem | PASS |
| payload M41 | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | idem (`npm run test:m41`, exit 0) | PASS |
| `http://127.0.0.1:1337/` | bytes canônicos | HTTP 200 · 963.373 B · `fb906462…` | PASS |
| `https://flavio-desktop.tail396297.ts.net/` | bytes canônicos | HTTP 200 · 963.373 B · `fb906462…` | PASS |

**Nota de identidade do arquivo.** A instrução chama o HTML canônico de
`quickscan_secops_soccmm_v3_2_1.html`; no repositório o arquivo se chama
`quickscan_secops_soccmm_v3_2_dev.html` — que é o nome que a própria §13.1 usa para a candidata. O
SHA-256 e o tamanho conferem exatamente, de modo que a identidade material está confirmada e a
diferença é só de nome de publicação. Nenhuma ação foi tomada a respeito.

**Nota sobre a contagem de linhas da instrução.** O arquivo tem 499 linhas terminadas por `\n`
(mais a linha vazia após o último `\n`, que alguns editores contam como a 500ª). SHA-256, tamanho,
encoding e ausência de CRLF conferem exatamente; a identidade material está confirmada.

Docker/Tailscale/containers **não** foram reiniciados, parados ou reconfigurados em momento algum.

---

## 2 · Fatos observados (§2) — confirmados no source e MEDIDOS na v3.2.1

Todos os três diagnósticos foram confirmados antes de qualquer edição, com medição em Chromium real
sobre o HTML publicado.

### 2.1 Duas experiências para o mesmo editor — CONFIRMADO

Medido em 1440×900 sobre a v3.2.1:

| superfície | regiões de 1º nível | grupos fora de região | ajudas `(i)` |
|---|---|---|---|
| editor aberto pela **home** | **0** | **6** (lista plana) | **0** |
| editor aberto pelos **resultados** | 2 | 0 | 104 |

A causa suposta pela instrução (`p52ContextRegions()` aplicado só na superfície de resultados) está
**correta, e é mais funda do que isso**. São dois defeitos encadeados:

1. `uxOpenHomeEditor()` (`ui_ux_v32.js:143`) monta a tela do editor trocando o `innerHTML` de `#app`
   e marca `document.body.dataset.uxscreen = "ctxeditor"` **na mão**, sem passar por `render()`.
   Como o decorador da Phase 5.2 só é invocado pelo wrapper de `render()`, nenhuma passagem de
   decoração chega a ver o editor aberto pela home;
2. `p52Screen()` derivava a tela de `uxScreenOf()`, que é função de `step`. Na home `step === -1`,
   então `uxScreenOf()` devolve `"home"` e **nunca** `"ctxeditor"` — o ramo `if (screen === "ctxeditor")`
   de `p52Decor()` era **código morto**. Ainda que o decorador fosse invocado, ele trataria a tela do
   editor como HOME e `p52Home()` reestruturaria a tela errada.

### 2.2 Rodapé da home comprimido — CONFIRMADO E QUANTIFICADO

O `<footer>` já era faixa de largura total; o **bloco legal** é que continuava preso a
`max-width: 92ch`, resolvido para 665,2 px com a tipografia do rodapé:

| viewport | largura útil | bloco legal | fração ocupada | `max-width` computado |
|---|---|---|---|---|
| 1440 | 1313,3 px | 665,2 px | **50,7 %** | 665,158 px |
| 1920 | 1626,2 px | 665,2 px | **40,9 %** | 665,158 px |
| 2560 | 2176,0 px | 900,2 px | **41,4 %** | 900,202 px |
| 3440 | 2176,0 px | 900,2 px | **41,4 %** | 900,202 px |

Em 1920 sobravam **548 px** de vão morto entre o fim do texto legal e o começo da autoria.

### 2.3 Bloqueio de PDF sem orientação local — CONFIRMADO E QUANTIFICADO

O bloqueio funcional **está correto** e não foi tocado: `window.print()` foi chamado **0 vezes** com
draft aberto, e o dono da decisão continua sendo `safePrint()` (`ui_v32.js:1218`). O defeito é de
localização:

| propriedade | v3.2.1 |
|---|---|
| `window.print()` com draft | 0 chamadas (correto) |
| distância da mensagem até o botão que falhou | **5.544 px** |
| mensagens junto ao botão de PDF | 0 |
| `aria-describedby` no botão | ausente |
| indicador no item **Contexto tecnológico** do trilho | ausente |
| texto do item do trilho | `▸Contexto tecnológicoopcional` |
| mensagem junto a **Salvar/Cancelar** | presente (`#v32errors`, dentro do editor) |

`#v32errors` existe, como a instrução supunha. Na tela de resultados o único `#v32errors` do
documento é o que `paintEditor()` cria **dentro** do editor, ao lado de Salvar/Cancelar — por isso a
§6.4 já estava satisfeita e não precisou de mudança.

---

## 3 · Decisões de implementação

### 3.1 Correção A — um compositor, duas entradas

- `p52Screen()` passa a **honrar `body[data-uxscreen="ctxeditor"]`** antes de consultar
  `uxScreenOf()`: o atributo é a única fonte desse estado, porque `step` continua em −1. Isso torna o
  ramo `ctxeditor` alcançável e impede que `p52Home()` reestruture a tela do editor.
- Criado `p52ContextEditorDecor()`, ponto de chamada **único** de
  `p52ContextRegions` + `p52DecorateContextGroups` + `p52CapHelp`. A decoração passa a seguir o **nó**
  (`#v32editor`), não a tela. Usado por `p52Decor()`, pelo `MutationObserver` e pelo listener
  delegado de clique — as três já eram funções idempotentes e convergentes.
- `p52InstallContextObserver()` passa a ser instalado em **toda** passagem de `p52Decor()`. Sem
  observador já na home, nenhuma passagem veria a troca de `innerHTML` feita por
  `uxOpenHomeEditor()` fora de `render()`.
- O listener delegado de clique passa a cobrir também `#ux-addctx, #ux-editctx`, para que a
  composição apareça **no mesmo clique** e não um checkpoint de microtarefas depois.

Nada foi duplicado: `p52ContextRegions()` **move** os nós existentes para dentro das regiões, e
`p52CapHelp()` guarda-se por `[data-p52="cap-help"][data-cap]` antes de criar qualquer controle. O
estado inicial (`SOC & Operations` aberto, os demais recolhidos) e a preservação de `prevOpen` já
eram do owner congelado — nenhuma linha foi alterada ali.

### 3.2 Correção B — rodapé

`flex: 1 1 520px` + `max-width: 92ch` substituídos pela grade fluida que a §5 prescreve:
`grid-template-columns: minmax(0, 1fr) auto` com `align-items: end`. O teto estreito do bloco legal
foi **removido**; a autoria continua `auto`, à direita e alinhada pela base. O empilhamento passa a
começar em **1023 px** (antes 767 px), porque entre 768 e 1023 px a autoria não cabe ao lado do texto
legal sem espremer os dois. **O texto do disclaimer e o da autoria são byte-idênticos** — a mudança é
só de layout.

### 3.3 Correção C — pendência no ponto de ação

**Fonte única do estado.** O estado continua sendo exclusivamente o `draft` de `ui_v32.js`. A camada
de apresentação não o espelha: ela o **lê**, pela ponte que o próprio owner publica —
`window.__DEV._setDraft(fn)` é declarado como `fn => { if (draft) fn(draft); }`, de modo que a sonda
devolve literalmente `draft !== null`, sem cópia e sem cache. Reserva documentada, usada só se a
ponte não existir: `#v32editor` visível e povoado, que equivale a `draft !== null` em todos os
caminhos do owner.

`p52PrintAttempted` **não** é um segundo estado de pendência: é a memória de apresentação de que a
impressão já foi tentada e bloqueada — o que separa "há alterações pendentes" (informação, desde o
primeiro caractere) de "a sua impressão falhou por isto" (erro, só depois da tentativa), que é
exatamente a distinção exigida pela §6.3. Ele tem **um único ponto de reposição**: quando o draft
morre, dentro de `p52SyncContextDraftUi()`. Consequência correta e deliberada: um **Salvar que falha
na validação** mantém o draft vivo e, portanto, mantém a orientação na tela.

A tentativa é detectada no **borbulhamento**, depois do handler do owner: `wireSafePrint()` instala
`safePrint` como `onclick` do botão, e o listener delegado no documento roda em seguida, no mesmo
evento. `safePrint()` continua sendo o único dono da decisão de bloquear — esta camada apenas a
observa.

As três apresentações derivam do mesmo estado, por `p52SyncContextDraftUi()`, idempotente:

1. **Junto ao botão de PDF** — `div[data-p52="print-pending"]` inserido imediatamente **depois do
   grupo `.actions`** que contém o botão, com o texto exato da v3.2.1, `role="alert"`,
   `aria-live="assertive"`, `aria-describedby` no botão e a ação **Ir para contexto tecnológico**,
   que rola até a seção e põe o foco no editor **sem tocar no draft**;
2. **No trilho lateral** — indicador no item `Contexto tecnológico`, com ponto luminoso
   `aria-hidden` (decorativo) **mais o texto “alterações pendentes”**, que é quem nomeia o estado. A
   borda muda de cor **e de largura** — forma, não só cor. Estado `pending` antes da tentativa e
   `error` depois dela, com o texto continuando a explicar a ação;
3. **Junto a Salvar/Cancelar** — a mensagem do owner, **preservada como estava**. Esta camada só a
   lê; nunca a escreve.

### 3.4 Decisão de boundary: `ui_v32.js` NÃO foi alterado

A §3 autoriza editar `ui_v32.js` **“somente se materialmente necessário”**. A primeira implementação
publicava ali um acessor limpo (`window.__V32UI.hasDraft`) e avisava a apresentação nas quatro
transições do draft. Essa versão **passou os quatro gates dirigidos**, mas reprovou dois gates
congelados:

```
FAIL  P50-GOV1 — nenhuma superfície protegida da §29.4 foi alterada [protegidos alterados: ui_v32.js]
FAIL  P50-IC4  — regressão de ícones: superfícies congeladas intactas [ui_v32.js alterado]
```

`ui_v32.js` é superfície congelada pela §29.4 da Phase 5.0 e fixada **byte a byte** por uma tabela de
hashes que vive em `tests_p50_core.js` — arquivo **fora** da boundary desta rodada. Reautorizar o
pino exigiria ampliar a boundary.

Como o owner **já publica** uma leitura suficiente do estado, tocar nele não era materialmente
necessário. A Correção C foi reimplementada **inteiramente na camada P52**, `ui_v32.js` voltou a ser
byte-idêntico (`0b30fe27…`) e os dois gates voltaram a verde **sem enfraquecer nenhum deles e sem
ampliar a boundary**. Nenhum gate foi editado para passar.

---

## 4 · RED obrigatório (§7) — gates dirigidos, namespace próprio `V322-*`

Os gates foram escritos **antes** de qualquer edição de produção e executados contra a v3.2.1
intocada. Toda medida vem de `getBoundingClientRect()` / `getComputedStyle()` / contagem de nós
reais; screenshot **não** é oracle de nenhuma asserção.

| gate | v3.2.1 (RED) | motivo material da reprovação | candidata |
|---|---|---|---|
| `V322-CTXPAR1` | **FAIL** | `home: 0 regiões de primeiro nível (esperado 2)` · `home: 6 grupo(s) fora de região` · `ajudas (i) de capability: home=0 resultados=22` · `home: abertura inicial = [] (esperado [g1])` | **PASS** |
| `V322-FOOT1` | **FAIL** | `1920: bloco legal ocupa 41% da largura útil (mínimo 62%)` · `max-width estreito ainda aplicado ao texto legal (665.158px < 1626.2px)` (idem 1440/2560/3440) | **PASS** |
| `V322-PRINT1` | **FAIL** | `mensagem junto ao PDF: 0 ocorrência(s)` · `botão de PDF sem aria-describedby` · `trilho: 0 indicador(es)` · `ação 'Ir para contexto tecnológico' ausente` | **PASS** |
| `V322-NOREG1` | **PASS** (guarda de não regressão, verde por construção) | — | **PASS** |

`V322-NOREG1` é gate de **não regressão**, não gate RED: ele deve estar verde nas duas versões, e a
sua função é falhar se o patch mover estado.

### 4.1 Não vacuidade

Duas guardas de vacuidade foram acrescentadas depois que a primeira execução revelou que asserções
podiam passar sem medir nada:

- os três campos da prova de preservação **têm de existir** — senão o gate acusa
  `asserção de preservação vacuosa`;
- o repaint do owner **tem de ser provocável** — senão o gate acusa `asserção vacuosa`.

### 4.2 Convergência como asserção, não como timeout

Um decorador não convergente **não devolve FAIL**: ele congela a página, e o gate morreria por
timeout do harness — exatamente a "falha incidental" que a §8 proíbe contar como detecção. Os
callbacks de `MutationObserver` são **microtarefas**: um decorador que muta o DOM dentro do próprio
callback nunca deixa o checkpoint de microtarefas drenar, e a **tarefa** corrente jamais termina.

`V322-PRINT1` ganhou um **orçamento de convergência** (`v322Eval` / `v322Act` / `v322Close`) que
transforma o congelamento em asserção nomeada:

```
a página deixou de responder JÁ no clique de impressão — decoração não convergente
(callback de MutationObserver que muta o DOM a cada passagem)
```

---

## 5 · Campanha mutante (§8) — 12/12 detectados

Executada por `tests_p52_mutants.js` sobre o código **final**
(`html 887daa2e…` · `ui_p52_workspace_v32.js 1749edb2…` · `ui_v32.js 0b30fe27…`).

| # | mutante | gate | detectado por |
|---|---|---|---|
| M1 | regiões só na tela de resultados | `V322-CTXPAR1` | `home: 0 regiões de primeiro nível` |
| M2 | todos os accordions abertos por padrão | `V322-CTXPAR1` | `abertura inicial = [g1, g2, …]` |
| M3 | reabrir `SOC & Operations` em todo rerender | `V322-CTXPAR1` | `o decorador REABRIU no rerender o grupo que o usuário fechou` |
| M4 | restaurar o `max-width` estreito do disclaimer | `V322-FOOT1` | `max-width estreito ainda aplicado ao texto legal` |
| M5 | remover a mensagem local do botão de PDF | `V322-PRINT1` | `mensagem junto ao PDF: 0 ocorrência(s)` |
| M6 | remover o indicador do menu | `V322-PRINT1` | `trilho: 0 indicador(es)` |
| M7 | indicador só cromático, sem nome acessível | `V322-PRINT1` | `indicador sem texto 'alterações pendentes'` |
| M8 | não limpar `aria-describedby` após Salvar | `V322-PRINT1` | `após Salvar: aria-describedby obsoleto no botão de PDF` |
| M9 | não limpar a mensagem após Cancelar | `V322-PRINT1` | `após Cancelar: mensagem de PDF permanece` |
| M10 | duplicar a mensagem em cliques repetidos | `V322-PRINT1` | `NÃO CONVERGIU` / `a página deixou de responder JÁ no clique` |
| M11 | permitir `window.print()` com draft | `V322-PRINT1` | `window.print() chamado 1 vez(es) com draft aberto` |
| M12 | perder valor digitado ao reorganizar os nós | `V322-CTXPAR1` | `valor perdido na passagem do decorador` |

**Resultado: 12/12 detectados pelo gate e pelo motivo esperados.** Restauração byte-idêntica de
todos os oito arquivos mutáveis e do HTML; acervo de evidência com **286 arquivos byte-idênticos ao
início** da campanha.

Duas notas de honestidade sobre a campanha:

- **M8 e M9** atacam a mesma obrigação da §6.5 (limpeza pós-Salvar e pós-Cancelar) por duas
  superfícies distintas — `aria-describedby` e o nó da mensagem —, porque as duas limpezas passam
  pelo **mesmo** ramo `!show` de `p52SyncPrintPending()`. Os motivos de reprovação são distintos e
  acionáveis, mas a garantia atacada é a mesma;
- **M10** foi promovido de "mensagem duplicada" para "decoração não convergente": sem a guarda de
  reaproveitamento, a superfície não chega a duplicar visivelmente — ela congela a página. O gate
  reporta isso pelo nome, e não como timeout.

---

## 6 · Defeitos reais encontrados NO PRODUTO

1. **[corrigido] Editor de contexto sem composição na entrada da home** — §2.1 acima. Duas causas
   encadeadas: `uxOpenHomeEditor()` não passa por `render()`, e `p52Screen()` não conseguia devolver
   `"ctxeditor"`, tornando o ramo correspondente de `p52Decor()` **código morto**.
2. **[corrigido] `max-width: 92ch` no bloco legal do rodapé** — §2.2. O comentário do próprio CSS já
   registrava que o teto de 780 px do `<footer>` fora removido por prender a faixa à esquerda; o
   teto da **coluna interna** permaneceu.
3. **[corrigido] Pendência de contexto sem orientação no ponto de ação** — §2.3. Mensagem a 5.544 px
   do botão que falhou, sem `aria-describedby` e sem sinalização no trilho.
4. **[corrigido durante a rodada, introduzido por esta rodada] Guarda de convergência ausente em
   `p52SyncPrintPending()`.** A primeira versão criava um nó novo a cada passagem do
   `MutationObserver`, sem reaproveitar o existente. Como os callbacks de `MutationObserver` são
   microtarefas, isso **congelava a página** ao clicar em imprimir. Foi encontrado **pela campanha
   mutante**, diagnosticado com instrumentação em Chromium real (`+[DIV.p52-print-pending]` repetido
   indefinidamente em `SECTION#p52-sec-actions`) e corrigido com o laço de reaproveitamento, que é a
   **condição de parada** — não uma otimização.

---

## 7 · Defeitos encontrados NO HARNESS

1. **`V322-NOREG1` comparava o relógio, não o produto.** A primeira execução reprovou porque
   `buildPrintReport().html` carrega `data-pr-meta="generatedAt"` — o instante da geração. É metadado
   do ato de imprimir, não estado do assessment. O oracle passou a neutralizar **apenas** esse campo;
   todo o resto do relatório entra na comparação byte a byte. **Defeito meu, corrigido; o produto
   estava certo.**
2. **Fixture vacuosa na prova de preservação.** Declarar `PRESENT` numa capability **não** cria a
   linha de solução (o owner nasce com a lista vazia; a linha só existe depois do `+`). Sem o
   segundo passo, o campo de produto nunca era criado e a asserção passava medindo `null == null`.
   Corrigido, e coberto por guarda de não vacuidade explícita.
3. **`P52-PR1` e `P52-ACC1` não podem rodar na v3.2.1 — PRÉ-EXISTENTE, não causado por esta rodada.**
   `baselineFile()` lê `git show HEAD:quickscan_secops_soccmm_v3_2_dev.html` e compara com
   `P52_BASELINE_SHA = 12bb950f…` (entrada da Phase 5.2). Esse conteúdo está em `d388681` (merge da
   Phase 5.1); em `HEAD` (v3.2.1, `07bc90b`) o HTML é `fb906462…`. Como a função lê **só** o `HEAD`,
   ignorando o working tree, os dois gates reprovam na release publicada **independentemente de
   qualquer alteração local**:

   ```
   FAIL  P52-PR1  — [baseline indisponível: baseline em HEAD com SHA fb906462484ff3d3]
   FAIL  P52-ACC1 — [baseline indisponível: baseline em HEAD com SHA fb906462484ff3d3]
   ```

   **Não corrigi**: re-fixar o baseline de um gate congelado é ato de governança, não de UX, e
   depende do proprietário. Ver §11.

---

## 8 · Assurance executada (§11)

Contagens e exit codes próprios, com o HTML final `887daa2e…`.

| suíte | resultado | exit |
|---|---|---|
| build determinístico | `A == B == C` = `887daa2e…` | 0 |
| `git diff --check` | limpo | 0 |
| engine (M1–M40 + M42–M86 + P2.1) | **105 PASS · 0 FAIL** | 0 |
| UI M3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | **19 / 25 / 11 / 23 / 26 PASS · 0 FAIL** | 0 |
| UX 4.1 | **56 PASS · 0 FAIL** | 0 |
| Target 4.3.1 | **30 PASS · 0 FAIL** | 0 |
| Ref 4.4 | **28 PASS · 0 FAIL** | 0 |
| Journey 4.5 | **31 PASS · 0 FAIL** | 0 |
| Icons 4.6 | **12 PASS · 0 FAIL** | 0 |
| Session 4.8 | **97 PASS · 0 FAIL** | 0 |
| UNSET geometry (UG) | **13 PASS · 0 FAIL** | 0 |
| P50 core + P51 | **64 PASS · 0 FAIL** | 0 |
| P50 Chromium + P51 | **27 PASS · 0 FAIL** | 0 |
| P52 layout | **35 PASS · 0 FAIL** | 0 |
| P52 Chromium | **46 PASS · 2 FAIL** (`P52-PR1`, `P52-ACC1` — baseline pré-existente, §7.3) | 1 |
| M41 | payload `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` — **idêntico ao baseline** | 0 |
| `npm run test:visual` | **67 passed · 0 failed · 37 skipped** | 0 |
| gates dirigidos `V322-*` | **4 PASS · 0 FAIL** | 0 |
| campanha mutante `V322-M1..M12` | **12/12 detectados** | 0 |

Todas as contagens congeladas do baseline 4.8.0.7 conferem exatamente. As **únicas** duas reprovações
são as da §7.3, provadas pré-existentes na release publicada.

### 8.1 Acessibilidade e isolamento de print contra a release REAL

Como `P52-ACC1`/`P52-PR1` não alcançam o seu baseline, a comparação foi refeita contra o baseline que
de fato interessa — a **v3.2.1 publicada** (`fb906462…`), extraída de `HEAD` —, com `axe-core` sobre
`#app` em quatro cenas. Evidência: `docs_phase5/evidence_v322/V322-axe-vs-v321.json`.

| cena | v3.2.1 (nós / tipos) | v3.2.2 (nós / tipos) | violações novas |
|---|---|---|---|
| home | 2 / 2 | 2 / 2 | nenhuma |
| resultados | 1 / 1 | 1 / 1 | nenhuma |
| contexto pelos **resultados** | 7 / 2 | 7 / 2 | nenhuma |
| contexto pela **home** | 0 / 0 | 6 / 1 | `nested-interactive [serious]` |

**Leitura honesta desse único delta.** Não é uma classe nova de defeito: é **exatamente a mesma
violação já presente na v3.2.1**, nos **mesmos 6 nós** e com os **mesmos seletores**
(`details[data-gid="g1"] > summary` etc.), causada pelo controle de ajuda `(i)` que a Phase 5.2 coloca
**dentro** do `<summary>`. Ela existia na v3.2.1 no editor aberto pelos resultados e agora aparece
também no editor aberto pela home — porque a home passou a receber a mesma composição, que é
precisamente o que a Correção A foi mandada entregar. O número de superfícies afetadas cresce; o
defeito é o mesmo, e é anterior a esta rodada. **Não o corrigi**: mudar onde `p52FieldHelp()` insere o
controle é decisão de design da Phase 5.2, fora das três correções desta rodada. Ver §11.

---

## 9 · Prova das três correções na candidata

Medidas em `docs_phase5/evidence_v322/V322-medidas.json`.

**A · paridade do editor** — as duas entradas ficaram estruturalmente idênticas:

| | regiões | grupos soltos | ajudas totais | ajudas de capability | campos |
|---|---|---|---|---|---|
| home | **2** | 0 | **104** | **22** | **69** |
| resultados | **2** | 0 | **104** | **22** | **69** |

**B · rodapé** — o bloco legal passou a ocupar a faixa disponível, com `max-width` computado `none`:

| viewport | largura útil | legal (antes → depois) | fração (antes → depois) |
|---|---|---|---|
| 1440 | 1313,3 px | 665,2 → **868,8 px** | 50,7 % → **66,2 %** |
| 1920 | 1626,2 px | 665,2 → **1181,8 px** | 40,9 % → **72,7 %** |
| 2560 | 2176,0 px | 900,2 → **1731,6 px** | 41,4 % → **79,6 %** |
| 3440 | 2176,0 px | 900,2 → **1731,6 px** | 41,4 % → **79,6 %** |
| 390 / 768 | 342,4 / 705,3 px | empilhado, ordem de leitura preservada | 100 % |

Zero overflow horizontal e zero sobreposição nas seis larguras.

**C · ciclo completo da pendência** — `window.print()` chamado **0 vezes** com draft em todas as
etapas bloqueadas:

| etapa | msg. no PDF | trilho | estado do item | msg. no editor | `aria-describedby` | distância do grupo de ações |
|---|---|---|---|---|---|---|
| antes da tentativa | 0 | **1** | `pending` | 0 | — | — |
| após bloqueio | **1** | **1** | `error` | **1** | `p52-print-pending` | **30 px** |
| após **Salvar** | 0 | 0 | — | 0 | removido | — |
| após **Cancelar** | 0 | 0 | — | 0 | removido | — |

Cinco cliques repetidos em Imprimir mantêm **exatamente uma** mensagem em cada local. O atalho
**Ir para contexto tecnológico** leva ao editor **sem descartar o draft** (valor do campo preservado,
`draft !== null` mantido). Impressão liberada após Salvar e após Cancelar: `window.print()` chamado
1 vez em cada caso.

**Não regressão** — o ciclo pendência → bloqueio → Cancelar deixa `fullStateJSON()`,
`legacySnapshot()`, o contexto e o HTML do relatório **byte-idênticos**, e nenhum nó de pendência
chega ao papel (`p52-print-pending` e `p52-rail-pending` têm `display:none !important` em `@media print`,
além de `.actions` já sair do papel).

---

## 10 · Tabela pre/post de todos os arquivos alterados

| arquivo | SHA-256 antes (v3.2.1 / HEAD) | SHA-256 depois (candidata) |
|---|---|---|
| `ui_p52_workspace_v32.js` | `0b8af6bf0e2a5324941218d0d749d70c04aa7cc818de74e3f4fb513ccd99fdc0` | `1749edb29822066577dd38008af6a5dc3fa8cef229b93759a74801a7a4681247` |
| `ui_p52_workspace_v32.css` | `01f0fca4acdd65abf4e17402b2520ba12dfad162f98f7490f41955bc26c74b3c` | `c17b459e6d075293fa69c4d3f307d506895ce77c3be054471ef2ffb982975350` |
| `tests_p52_chromium.js` | `cd75b2d87e84f14fb7ffaf4f4d6c5f8ec1f92fa24c1f6655ad4504d342c67770` | `6bd7c1762806c9b19404d3cda997a99fced45a08a9f4762aa3d161b995ddadc2` |
| `tests_p52_mutants.js` | `8335b96109588d53e46fb2f0a54e813bfa53e8f7c900ffa5ec90908f0aa9d528` | `1c6fc4715b5bc379f851437756bc4d0f39b9db342b4aa278747afef6bcb9793d` |
| `tools_p52_shots.js` | `6cfe4b3f9ca809faca53727a63792b3004a636c706c9c41e8492ea40d9ed56a8` | `737450e58438f465823c5b18568c784216d62303df32c10c9cf73c96681f5dc5` |
| `USER_GUIDE.md` | `17f1a9a7fd57b05eace64195529f6c26b65162742f0cce4ce758e19e8edcf0b7` | `d510bdda50d760512ceb5e98b6fd72b4de91a9f398e362373f0f19ba9812585e` |
| `quickscan_secops_soccmm_v3_2_dev.html` | `fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79` (963.373 B) | `887daa2e35da55424ea37bb53ca191a8d6f26e209b26b78f02b0c16ddbc5f9ca` (982.327 B) |

Arquivos **novos** (não rastreados): `docs_phase5/evidence_v322/` (22 arquivos) ·
`docs_phase5/PATCH_V3_2_2_CONTEXT_FOOTER_PRINT_UX_REPORT.md` ·
`docs_phase5/MANIFEST_V3_2_2.sha256`.

---

## 11 · Inventário explícito do que NÃO foi alterado

| superfície | estado |
|---|---|
| `engine_v32.js` | **byte-idêntico** · `9a4a2e67…` |
| `ui_v32.js` | **byte-idêntico** · `0b30fe27…` (ver §3.4) |
| `ui_ux_v32.js` | **byte-idêntico** · `a0504011…` (autorizado, não foi necessário) |
| `ui_session_v32.js` | byte-idêntico |
| `ui_target_v32.js`, `ui_refinement_v32.js`, `ui_journey_v32.js`, `ui_icons_v32.js` | byte-idênticos |
| `ui_p50_shell_v32.js`, `ui_p50_suff_v32.js`, `ui_p50_results_v32.js`, `ui_p50_v32.css` | byte-idênticos |
| `ui_v32.css`, `ui_ux_v32.css` | byte-idênticos |
| `build_v32_html.py` | **não editado** |
| `package.json` / `package-lock.json` | **não editados** |
| módulos de cálculo, suficiência, target e recomendações | byte-idênticos |
| payload M41 | `9794b267…` — **idêntico ao baseline** |
| `docs_phase5/evidence_p50`, `evidence_p51`, `evidence_p52` | **byte-idênticos** (ver §12.1) |
| tag `v3.2.1`, GitHub Release, registros de publicação | intocados |
| Docker, Docker Compose, Tailscale, produção em 1337 | **intocados e não reiniciados** |
| `AGENTS.md` | intocado, não rastreado, **fora** do manifesto |
| contêineres Aurora | não tocados |

---

## 12 · Limitações

1. **`docker` não está disponível nesta distro WSL** (“The command 'docker' could not be found in
   this WSL 2 distro”). Não foi possível inspecionar o container do preview por dentro, nem
   comparar o hash **dentro** do container. Conforme a §12, **nada foi reiniciado**. O que pôde ser
   verificado, foi:

   | verificação | resultado |
   |---|---|
   | hash do arquivo local | `887daa2e35da55424ea37bb53ca191a8d6f26e209b26b78f02b0c16ddbc5f9ca` |
   | hash servido em `http://127.0.0.1:1338/` | `887daa2e…` — **igual** |
   | bind de 1338 | `LISTEN 127.0.0.1:1338` — **loopback exclusivo** |
   | bind de 1337 | `LISTEN 127.0.0.1:1337` — loopback exclusivo |
   | produção em 1337 | `fb906462…` — **v3.2.1 intacta** |
   | Tailscale Serve | `fb906462…` — **intacto** |
   | 1338 por Tailscale | sem resposta (não exposto) |
   | Funnel / porta pública / montagem de `QuickscanData` | nenhum criado |

   O preview em 1338 já servia a candidata automaticamente (monta o diretório do repositório); **não
   foi necessário nem executado** qualquer comando de infraestrutura.

2. **Determinismo comprovado apenas em Linux/WSL**, conforme a política do projeto. Chromium usado:
   o do Playwright (`chromium-1234`), via `CHROME_PATH` — `/opt/google/chrome/chrome` não existe
   nesta máquina. As contagens visuais (67/0/37) conferem com o baseline.

3. **`P52-PR1` e `P52-ACC1` não foram executados de fato** — abortam por baseline indisponível
   (§7.3). O que eles cobrem foi substituído, para esta rodada, pela comparação da §8.1 contra a
   release publicada. Não são PASS e **não estão sendo declarados PASS**.

4. **Não auditei o próprio trabalho** (§14). Este relatório é descrição de execução com evidência,
   não parecer de auditoria.

### 12.1 Nota sobre o acervo histórico de evidência

As primeiras execuções de regressão rodaram **sem** `P50_NO_EVIDENCE` / `P52_NO_EVIDENCE` e, por
isso, reescreveram arquivos de `docs_phase5/evidence_p50` e `docs_phase5/evidence_p52`. Isso foi
detectado, **os dois diretórios foram restaurados a partir do git** e a bateria final de regressão
foi reexecutada com as duas variáveis ativas. Estado final confirmado por `git status`: **nenhum
arquivo dos acervos históricos aparece como modificado**. A campanha mutante, que tem guarda própria
de acervo, reportou **286 arquivos byte-idênticos ao início**.

---

## 13 · Pendências que dependem do proprietário

1. **Baseline de `P52-PR1` / `P52-ACC1`.** Os dois gates fixam a entrada da Phase 5.2 (`12bb950f…`),
   que não está mais em `HEAD`. Re-fixá-los na release publicada (`fb906462…`) é ato de governança e
   **não** foi feito. Enquanto não for decidido, os dois permanecem inexecutáveis em qualquer rodada
   posterior à v3.2.1 — não apenas nesta.
2. **`nested-interactive` no editor de contexto.** Violação `serious` **pré-existente** na v3.2.1
   (controle `(i)` dentro de `<summary>`), que a Correção A propaga para a entrada da home junto com
   a composição. Corrigi-la significa mudar onde `p52FieldHelp()` insere o controle — decisão de
   design da Phase 5.2, fora do escopo desta rodada. Precisa de autorização própria.
3. **Acessor de estado em `ui_v32.js`.** A leitura da pendência é feita hoje pela ponte
   `window.__DEV._setDraft`, que o owner rotula como “API de teste (build DEV)”. Funciona, é a
   variável do owner e não cria segundo estado — mas um acessor nominal em `window.__V32UI` seria
   mais limpo. Exige autorizar `ui_v32.js` **e** re-fixar `P50-GOV1`/`P50-IC4` em `tests_p50_core.js`,
   fora da boundary desta rodada.
4. **UAT visual do proprietário** sobre `http://127.0.0.1:1338/` e o acervo em
   `docs_phase5/evidence_v322/`.
5. **Auditoria independente estreita** das três correções.

---

## 14 · Parada

Nenhum commit, push, PR, merge, tag, GitHub Release, publicação, substituição de produção, alteração
de Tailscale ou início de fase seguinte foi executado. A branch
`fix/v3.2.2-context-footer-print-ux` permanece local, com as alterações **não comitadas**.

---
---

# 15 · Fechamento pré-auditoria (rodada seguinte)

Seção **acrescentada**, não substitutiva: tudo acima permanece como registrado. Esta rodada não
reimplementou as três correções funcionais; ela encerrou os jobs residuais, reparou a resolução
obsoleta do baseline de `P52-PR1`/`P52-ACC1`, eliminou o `nested-interactive` que a §8.1 havia
declarado como pendência, e reexecutou a assurance proporcional ao delta.

Mandato: `PROMPT_FECHAMENTO_PRE_AUDITORIA_QUICKSCAN_V3_2_2.md` · SHA-256
`3b83c16e2cf498d5689303045a99374bc278af8ea007a0de4f95fff0f3f024dd` · 16.349 bytes · 389 linhas ·
UTF-8 sem BOM · zero CRLF. **Isto não é auditoria e não emite parecer, aceite, freeze ou promoção.**

## 15.1 · Inventário e encerramento dos sete shells

Identidades de entrada da §1 do mandato — branch, `HEAD`, `origin/main`, 0 commits sobre main, 0
staged, `v3.2.1^{}`, os seis arquivos com SHA/bytes/linhas, payload M41 e manifesto 30/30 — todas
**conferiram exatamente** antes de qualquer edição.

Os sete jobs eram, sem ambiguidade, **laços de espera órfãos da própria sessão anterior**:

| PID | início | comando | classificação |
|---|---|---|---|
| 1106771 | 19:05:58 | `until grep -q "^EXIT=" …/loop2.log; do sleep 5; done` | probe órfão |
| 1113750 | 19:30:19 | `… mut322c.log; do sleep 15; done` | probe órfão |
| 1115011 | 19:40:27 | `… mut322c.log; do sleep 20; done` | probe órfão |
| 1116755 | 19:51:43 | `… mut322d.log; do sleep 15; done` | probe órfão |
| 1118673 | 20:02:58 | `… mut322e.log; do sleep 20; done` | probe órfão |
| 1120406 | 20:13:57 | `… mut322f.log; do sleep 20; done` | probe órfão |
| 1122276 | 20:24:41 | `… m10direct.log; do sleep 10; done` | probe órfão |

Todos com PPID `1094847` (o processo desta sessão) e `cwd` no repositório. Cada um vigiava um log
no **scratchpad** (`/tmp/claude-1000/…`), nunca um caminho do repositório. Nenhum dos seis logs
chegou a receber a marca `EXIT=`: os produtores foram encerrados na rodada anterior, de modo que os
sete eram **laços sem condição de término**. Os resultados que vigiavam já haviam sido superados e
colhidos (`mut322g`/`mut322h`, 12/12) — nada se perdeu.

Encerramento: `SIGTERM` nos sete e nos seus `sleep` filhos; **`SIGKILL` não foi necessário**. Nada
foi sinalizado fora dessa lista — em particular, não foram tocados Docker Desktop, Tailscale, nginx,
containers Aurora, o daemon da sessão nem processos do sistema.

Prova de quiescência, medida depois do encerramento:

- os sete PIDs: **nenhum vivo**;
- processos de teste/build/browser (`tests_p5*`, `tests_ui_*`, `tests_session*`, `tests_unset*`,
  mutantes, `harness_m41_v313.js`, `build_v32_html.py`, Node de suíte, Chromium/Playwright,
  `pdftoppm`/`pdftotext`/`pdfinfo`): **nenhum**;
- descritores abertos para **escrita** em qualquer caminho do repositório: **nenhum**;
- artefatos temporários inesperados na raiz (`.ppm`, `.pgm`, `.pbm`, PDFs, logs, `actual/expected`,
  marcadores de mutação): **nenhum**;
- `print_evidence/` e `visual_evidence/` foram atualizados pela suíte visual; são **ignorados pelo
  git por design** (`.gitignore` linhas 3–4), não entram no manifesto e não fazem parte da
  candidata.

Todas as identidades da §1 e o manifesto foram **recalculados após a limpeza** e conferiram com os
valores de entrada — prova de que a limpeza não modificou nenhum arquivo da candidata.

## 15.2 · Correção 1 — baseline imutável de `P52-PR1` e `P52-ACC1`

Detalhe completo, com RED, GREEN e mutantes: `docs_phase5/evidence_v322/V322-baseline-RED-GREEN.md`.

`baselineFile()` resolvia o baseline por `HEAD:<caminho>` — e `HEAD` é móvel. Publicada a v3.2.1,
`HEAD` passou a carregar `fb906462…` (963.373 bytes) em vez de `12bb950f…` (744.179 bytes), e os
dois gates deixaram de comparar coisa alguma.

**RED na candidata** e **RED na release publicada**, esta última medida num `git worktree` limpo da
própria tag `v3.2.1`, com o harness da própria release — provando que o defeito é do harness e
**pré-existente**, não introduzido pelo patch:

```
FAIL  P52-PR1  — [baseline indisponível: baseline em HEAD com SHA fb906462484ff3d3]
FAIL  P52-ACC1 — [baseline indisponível: baseline em HEAD com SHA fb906462484ff3d3]
```

Implementação (D-322-2): constantes nominais `P52_BASELINE_COMMIT` /
`P52_BASELINE_PATH` / `P52_BASELINE_SHA` / `P52_BASELINE_BYTES` e **uma só** função de resolução
para os dois gates. Lê os bytes de
`d3886812718e7ad9c5024880067133fbddf2fc4d:quickscan_secops_soccmm_v3_2_dev.html`, confere
**tamanho e SHA-256 antes do uso**, distingue "commit ausente" de "caminho ausente" e **falha
fechada** com diagnóstico que nomeia o observado e o esperado. Sem rede, sem branch, sem tag móvel,
sem working tree, sem `HEAD`. O oracle **não** foi rebaseado para a v3.2.1.

**GREEN**: `P52-PR1` e `P52-ACC1` executam **integralmente** e passam — sem SKIP, bypass, downgrade
para aviso ou remoção de controle positivo.

## 15.3 · Correção 2 — eliminação do `nested-interactive`

**RED**, em Chromium real, `axe-core` 4.13.0 pinado, nas duas entradas, com seletor, HTML mínimo e
impacto por nó (`docs_phase5/evidence_v322/V322-nested-interactive-RED.json`):

| superfície | `nested-interactive` | interativos dentro de `<summary>` |
|---|---|---|
| home | **6** nós, impacto `serious` | 10 |
| home + grupo Requisitos aberto | **10** | 10 |
| resultados | **6** nós, impacto `serious` | 10 |
| resultados + Requisitos aberto | **10** | 10 |

Causa estrutural: o controle `(i)` era um `<button>` **dentro** do `<summary>` — dois focáveis
aninhados. Exemplo de nó: seletor `details[data-gid="g1"] > summary`, `<summary aria-expanded="true">`.
Os quatro nós adicionais são os subgrupos `sig-N`, que só ficam renderizados com a família
Requisitos aberta.

**Padrão adotado, e por que não o literal da §5.2.** A §5.2 sugere o botão como irmão do `<summary>`
dentro do `<details>`. Esse padrão foi implementado e **medido primeiro** — e reprovado por
evidência: com o grupo **recolhido**, o Chromium não renderiza o filho não-`summary`, nem fora de
fluxo. `checkVisibility({checkVisibilityCSS:true})` devolveu `true` apenas no grupo aberto (`g1`) e
`false` em `g2`, `g3`, `arch`, `plat` e `sig` — **cinco das seis famílias**, que são exatamente as
que nascem recolhidas. O `(i)` sumiria no estado inicial do editor, violando a §5.2.2.

O padrão adotado preserva todas as doze propriedades da §5.2: um **wrapper de cabeçalho**
(`div.p52-grphead`) envolve o `<details>`, e o controle e o seu popover são **irmãos do
`<details>`** dentro desse wrapper — fora da árvore interativa do `<summary>` e fora do accordion,
portanto renderizados nos dois estados. O wrapper também mantém o controle fora de `.p52-grp-body`,
que `p52DecorateContextGroups()` monta a partir dos irmãos do summary.

**GREEN** (`V322-nested-interactive-green.json`): **zero** `nested-interactive`, **zero** violação
`critical`/`serious` do axe e **zero** controle interativo dentro de `<summary>` nas quatro
combinações medidas. E, contra a release publicada
(`V322-axe-vs-v321.json`): **violações de acessibilidade novas em relação à v3.2.1 = 0** — o delta
que a §8.1 registrava como pendência deixou de existir, nas duas entradas.

**Contrato comportamental** (`V322-help-behaviour.json`), verificado nas duas entradas:

| propriedade | resultado |
|---|---|
| `(i)` visível com o grupo **recolhido** | OK (as seis famílias) |
| hover abre, `aria-expanded="true"` | OK |
| foco por teclado abre e o controle recebe foco | OK |
| `Esc` fecha, devolve o foco e **não** reabre | OK |
| clicar no `(i)` **não** alterna o accordion | OK |
| clicar no `<summary>` alterna uma vez | OK |
| Enter e Espaço no `<summary>` alternam uma vez | OK (entrada de resultados — ver 15.6) |
| um único popover aberto por vez | OK |
| IDs únicos, `aria-describedby` sem órfãos | OK |
| rerender não duplica controle, ID nem listener | OK |
| 390 px, 200% de zoom e 3440 px sem clipping/overflow | OK |
| erros de página/console | 0 |

Textos dos verbetes, IDs dos popovers (`p52-grphelp-*`, `p52-sggrphelp-*`), lista de grupos e
glossários: **byte-idênticos**. A caixa do controle continua **22×22**, igual à de todos os outros
`(i)` do editor — o contrato visual único que `P52-HELP2` mede.

## 15.4 · Mutantes desta rodada

| mutante | mutação | gate | motivo da detecção |
|---|---|---|---|
| `V322-M13` | commit imutável → commit da v3.2.1 (`HEAD`) | `P52-PR1` | `baseline … com 963373 bytes; esperado 744179` |
| `V322-M14` | um dígito do SHA-256 esperado do baseline | `P52-ACC1` | `identidade do baseline diverge … observado …, esperado …d8` |
| `V322-M15` | reinserir controle focável dentro do `<summary>` | `V322-NI1` | `nó(s) nested-interactive` / `controle(s) interativo(s) dentro de <summary>` |

`V322-M13` e `V322-M14` são rejeitados **antes** de qualquer comparação entre produto e baseline.

## 15.5 · Assurance executada nesta rodada

| suíte | resultado | exit |
|---|---|---|
| `P52-PR1` + `P52-ACC1` isolados (RED, antes) | **0 PASS · 2 FAIL** | 1 |
| `P52-PR1` + `P52-ACC1` isolados (GREEN, depois) | **2 PASS · 0 FAIL** | 0 |
| gates dirigidos `V322-*` + `P52-PR1`/`P52-ACC1` | **7 PASS · 0 FAIL** | 0 |
| engine (M1–M40 + M42–M86 + P2.1) | **105 PASS · 0 FAIL** | 0 |
| UI 3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | **19 / 25 / 11 / 23 / 26 PASS · 0 FAIL** | 0 |
| UX 4.1 · Target 4.3.1 · Ref 4.4 · Journey 4.5 · Icons 4.6 | **56 / 30 / 28 / 31 / 12 PASS · 0 FAIL** | 0 |
| Session 4.8 | **97 PASS · 0 FAIL** | 0 |
| UNSET geometry (UG) | **13 PASS · 0 FAIL**, sem SKIP — UG13 em Chromium real | 0 |
| P50 core + P51 | **64 PASS · 0 FAIL** | 0 |
| P50 Chromium + P51 | **27 PASS · 0 FAIL** | 0 |
| P52 layout | **35 PASS · 0 FAIL** | 0 |
| P52 Chromium (integral, com o gate novo) | **49 PASS · 0 FAIL** | 0 |
| M41 | payload `9794b267…` — idêntico ao baseline | 0 |
| `npm run test:visual` | **67 passed · 0 failed · 37 skipped** | 0 |
| campanha de mutação **integral** | **87/87 detectados** (72 históricos + 15 `V322-*`) | 0 |
| build determinístico | `A == B == C` = `e7ddd965…` | 0 |
| `git diff --check` | limpo | 0 |

**Zero FAIL e zero SKIP indevido.** Nenhum PASS foi atribuído a timeout, processo interrompido ou
comando parcial.

Ajustes de gate exigidos pela mudança estrutural — nenhum deles enfraquece asserção:

- **`P52-CTX2`** (jsdom) e **`V322-CTXPAR1`** mediam os grupos como filhos diretos do corpo da
  região; passam a atravessar o wrapper de cabeçalho. A propriedade medida é a mesma: os grupos
  daquela região, naquela ordem, e nenhum solto;
- **`P52-HELP2`** verificava a ajuda das famílias e dos subgrupos **dentro do `<summary>`** — a
  estrutura que o axe proíbe. O host passa a ser o wrapper de cabeçalho, com checagem por **filho
  direto**, para que um controle de capability lá dentro não satisfaça a asserção e a torne vácua.
  `V322-M15` prova que a asserção continua discriminante.

## 15.6 · Achado pré-existente registrado, fora do escopo

Na tela do editor aberto **pela home**, `Enter` com o `<summary>` focado não alterna o accordion:
um atalho de teclado da aplicação consome a tecla e avança a jornada (`data-uxscreen` vai de
`ctxeditor` para `arq`). Medido **nas duas versões**:

| versão | entrada | efeito do `Enter` no `<summary>` |
|---|---|---|
| v3.2.1 publicada | home | navega para `arq`, editor destruído |
| v3.2.1 publicada | resultados | alterna o accordion (correto) |
| v3.2.2 candidata | home | navega para `arq`, editor destruído |
| v3.2.2 candidata | resultados | alterna o accordion (correto) |

É **pré-existente e idêntico** nas duas; a §5.2.7 exige que o comportamento *continue* como está, e
ele continua. Não foi corrigido: está fora das duas correções autorizadas nesta rodada.

## 15.7 · Verificações finais

| verificação | resultado |
|---|---|
| `ui_v32.js` byte-idêntico | `0b30fe27ebc7fa0678b746ffe2fcd08fb1dcaf40a386ea774ffc3349f958e559` |
| `engine_v32.js` byte-idêntico | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` |
| demais congelados (UX, sessão, target, journey, icons, CSS 5.0, builder, package.json) | byte-idênticos a `HEAD` |
| HTML construído A = B = C = arquivo candidato | `e7ddd965…` |
| M41 | `9794b267…` idêntico |
| evidências históricas P50/P51/P52 | **byte-idênticas** (ver 15.8) |
| preview `127.0.0.1:1338` | serve a candidata por SHA |
| produção `127.0.0.1:1337` e URL Tailscale | seguem em `fb906462…` (v3.2.1) |
| binds | `127.0.0.1:1337` e `127.0.0.1:1338` — loopback exclusivo |
| Funnel / porta pública / montagem de `QuickscanData` | nenhum |
| worktree staged | 0 |
| jobs residuais ao terminar | 0 |

## 15.8 · Nota sobre o acervo histórico

Duas execuções escreveram no acervo da Phase 5.2 e foram **detectadas e revertidas**:

1. a campanha de mutação **integral** regrava `evidence_p52/P52-mutation.json` ao final. O conteúdo
   desta rodada foi preservado em `evidence_v322/V322-mutation-87.json` e o arquivo histórico foi
   restaurado do git;
2. `P52-ACC1` grava `evidence_p52/P52-ACC1-axe.json`. Restaurado do git.

Causa raiz do segundo caso: `evidence322()` respeitava `P52_NO_EVIDENCE`, o mesmo interruptor que
protege o acervo histórico — o que obrigava a escolher entre **gerar** a evidência da v3.2.2 e
**preservar** a da 5.2. O acervo desta rodada ganhou interruptor próprio (`V322_NO_EVIDENCE`), e a
campanha de mutação passa a suprimir **os dois**: produto deliberadamente defeituoso não escreve
evidência em acervo nenhum. Estado final confirmado por `git status`: **nenhum arquivo dos acervos
históricos aparece como modificado**.

## 15.9 · Backlog explícito (D-322-4)

A leitura do estado de pendência continua sendo feita pela ponte `window.__DEV._setDraft(fn)`, que
lê o `draft` real do owner e **não** cria segundo booleano — mas cujo nome a anuncia como API de
teste. Substituí-la por um **acessor nominal, side-effect-free**, em `window.__V32UI` exigiria
editar `ui_v32.js` e reabrir os pinos `P50-GOV1`/`P50-IC4` em `tests_p50_core.js`. Por decisão
`D-322-4`, **nada disso foi feito nesta rodada**: `ui_v32.js` permanece byte-idêntico, os pinos P50
não foram tocados e nenhum owner, cache ou estado paralelo foi criado. Fica registrado como
**backlog de arquitetura para uma fase própria**.

## 15.10 · Produção, tag e infraestrutura

Produção em `127.0.0.1:1337` e a URL Tailscale continuam servindo **exatamente** os bytes da v3.2.1
(`fb906462…`). A tag `v3.2.1` e a GitHub Release não foram tocadas. Docker, Docker Compose,
containers, volumes, Tailscale Serve e Funnel **não foram criados, alterados, reiniciados nem
parados** em momento algum — o `docker` sequer está disponível nesta distro WSL, e a limitação foi
tratada como estado operacional, conforme a §1.5 do mandato. `AGENTS.md` permanece não rastreado,
intocado e fora do manifesto.

**Nenhum commit, push, PR, merge, tag, release, freeze, deployment ou promoção foi executado. A
v3.2.2 NÃO está declarada aprovada.** Próximos passos: UAT visual do proprietário e, depois,
auditoria independente em sessão nova.

## 15.11 · Adendo documental para GitHub e revisão externa

Após o fechamento funcional, o proprietário solicitou a atualização da página de entrada do GitHub
e a montagem de um pacote autocontido para revisão externa. `README.md` foi atualizado somente em
documentação: recebeu uma captura real da home, a distinção entre release publicada e candidata de
desenvolvimento, e regras para uma revisão independente verificável. Nenhum byte de runtime, teste,
builder, HTML ou evidência foi alterado por esse adendo.

O pacote externo foi criado fora do repositório em `outputs/`, com HTML, README, manual, brief,
limitações, prompt especializado, cinco capturas e manifesto próprio. O relatório interno do
implementador, dados de cliente, infraestrutura e pareceres anteriores foram deliberadamente
excluídos para preservar a independência. O pacote não é release, aprovação ou deployment.

Identidade do README após o adendo:

```text
README.md
SHA-256 be7975de2684fa5de516ca7704d6490045d946330507fadd9da8262e58160732
5.747 bytes
```

Por ser alteração exclusivamente documental, nenhuma suíte funcional foi reexecutada. A cobertura
exata do delta da candidata passou a incluir `README.md` no manifesto da rodada.

---

# 16 · Errata de ajudas, accordion e transição (rodada seguinte)

Rodada estreita de **experiência de interação** sobre a mesma candidata v3.2.2, executada sob
instrução única cuja identidade foi verificada antes de qualquer leitura adicional
(SHA-256 `9f0b978c594dac3559c6a16db9e7d0b31f20ebc9153d7049bcd1303a759bb6aa`, 13.425 bytes, 307 linhas,
UTF-8 sem BOM, zero CRLF). Nada de cálculo, resposta, suficiência, estágio, gap, recomendação,
relatório/PDF, schema de sessão, engine ou payload M41 foi tocado.

## 16.1 · Preflight (§1) — PASS

Todas as identidades de entrada exigidas conferiram **exatamente**, antes de qualquer edição:

```text
quickscan_secops_soccmm_v3_2_dev.html  e7ddd965971ec8ee2747f547dfb671934a9dc3bdfe0e4eb9cbe79e2205f20422  987.760 bytes
ui_p52_workspace_v32.js                471386e0b5991d2501af7f55dba71c703bf144ff9e08da012ca2459227319fb6
ui_p52_workspace_v32.css               7e235e1408784130763a1f5afbb3e437b3797c7b8162bc3d06072959c1f0f81d
docs_phase5/MANIFEST_V3_2_2.sha256     813d7563b7b98098192919a94436e71b3fc00689e70872c7b1ccaddf97f93a2e
engine_v32.js                          9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
payload funcional M41                  9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
```

Branch `fix/v3.2.2-context-footer-print-ux`; **zero** alteração staged; `127.0.0.1:1337` (produção
v3.2.1) e `127.0.0.1:1338` (preview) em escuta e **não tocados**; `AGENTS.md` não rastreado, intocado
e fora do manifesto; nenhum job de teste, build, mutação ou browser ativo no início.

O M41 foi executado no preflight, e não presumido: 20 asserções PASS, comparação com o baseline
funcional PASS, payload canonicalizado idêntico ao esperado.

## 16.2 · Causa material do piscar — MEDIDA, não suposta

`render()` reatribui `#app.innerHTML` a **cada** mudança de estado. O handler de opção do owner
congelado é `b.onclick = () => { ans[k] = ...; render(); }`: marcar uma resposta reconstrói a tela
inteira, exatamente como avançar de pergunta. A Camada 1 congelada declara, no seu próprio `<style>`:

```css
.screen{animation:fade .35s ease;}
@keyframes fade{from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:none;}}
```

Um `section.screen` NOVO é um elemento novo e **reexecuta a animação inteira**. Medido no gate
`V322-MOT3`, em Chromium 1440×900, ao trocar de resposta sem mudar de pergunta:

```text
animation-name computado ......... fade
animation-duration ............... 0.35s
animações ativas no section ...... 1  [{"nome":"fade","dur":350,"estado":"running"}]
opacidade mínima amostrada ....... 0
transform observado .............. matrix(1, 0, 0, 1, 0, 10) → 10px de deslocamento VERTICAL
```

Esse é o piscar. A UI não tinha como distinguir "troquei a resposta" de "mudei de pergunta" porque
nunca perguntou **qual** pergunta estava na tela antes.

## 16.3 · Mecanismo final adotado

A Camada 1 é superfície congelada e **não foi editada**. A correção vive inteiramente na Camada P52:

**CSS** — `section.screen { animation: none; }` neutraliza a animação legada de forma incondicional.
O seletor é `section.screen` (0,1,1) e não `.screen` (0,1,0) de propósito: a vitória não depende da
ordem de injeção, e a asserção do gate não pode ser satisfeita por engano pelo `.screen{animation:none}`
que já existia dentro do bloco `prefers-reduced-motion`. Duas regras novas reintroduzem movimento
**somente** sob a marcação `[data-p52-nav]`:

```css
@keyframes p52-nav-fwd  { from { transform: translateX(18px); }  to { transform: none; } }
@keyframes p52-nav-back { from { transform: translateX(-18px); } to { transform: none; } }
.screen[data-p52-nav="fwd"]  { animation: p52-nav-fwd  150ms cubic-bezier(.22,.61,.36,1); }
.screen[data-p52-nav="back"] { animation: p52-nav-back 150ms cubic-bezier(.22,.61,.36,1); }
```

150 ms está dentro da faixa 120–180 ms exigida. **`opacity` não é animada** — não há como "partir de
opacidade zero" quando a propriedade sequer entra no keyframe. O deslocamento é horizontal, no
sentido da navegação.

**JS** — `p52ScreenMotion()` guarda a última coordenada de navegação observada (a tela canônica de
`uxScreenOf()` e o `step` do runtime congelado) e a compara com a corrente. A marcação só é escrita
quando **as duas passagens estão no fluxo de perguntas e o `step` mudou**. Trocar de resposta, abrir a
observação ou repintar a mesma pergunta mantêm o `step` — e não recebem marcação alguma. A marcação é
carimbada uma única vez por `section.screen` (`data-p52-nav-seen`): como `render()` cria um nó novo a
cada passagem, uma reentrância do decorador sobre a mesma tela encontra o carimbo e não reexecuta
transição. Nenhum `userAgent`, `platform`, resolução, `devicePixelRatio` ou fingerprint participa da
decisão — o JS só publica estado, e é o CSS que decide animar.

**Acessibilidade** — o bloco `prefers-reduced-motion: reduce` da camada passa a nomear
`section.screen, .screen[data-p52-nav] { animation: none !important; }`. A remoção do movimento é
explícita e verificável por gate, em vez de herança silenciosa do `*{animation:none}` da Camada 1.
Nenhuma funcionalidade depende do movimento: o atributo continua sendo escrito, e só o CSS decide.

## 16.4 · Correção A — hierarquia de ajudas `(i)`

Princípio aplicado: ajuda localizada **somente onde existe ambiguidade semântica real**.

O mapa `P52_PLAT_HELP` foi **removido do source**, e não apenas desligado. Sem texto não há como um
decorador futuro voltar a pendurar controles item a item por descuido. A explicação da seção passou
para `P52_GROUP_HELP.plat`, reescrita para dizer, em linguagem neutra de fabricante, que a seção
registra **base instalada e direitos de uso** e que declarar isso **não prova implantação, cobertura
nem maturidade**.

## 16.5 · Correção B — os seis grupos nascem recolhidos

**Achado de arquitetura registrado nesta rodada:** `ui_v32.js` inteiro vive dentro de uma IIFE.
`openEditor` e `paintEditor` **não são bindings alcançáveis** pela Camada P52 — medido no runtime
construído: `window.openEditor` e `window.paintEditor` são `undefined`, enquanto `window.render`
(declarada na Camada 1) existe. Um wrapper sobre `paintEditor` teria sido **código morto** com
aparência de correção. A primeira tentativa de implementação seguiu esse caminho, foi medida, foi
reprovada por evidência e foi substituída — o registro fica aqui porque a tentativa descartada é
informação de auditoria, não constrangimento.

Os únicos pontos públicos reais são dois, e a correção usa os dois:

1. `window.__V32UI.openEditor` — a ponte que o owner publica, por onde `uxOpenHomeEditor()` abre o
   editor na entrada da HOME;
2. o clique nos CTAs que abrem o editor (`#v32cta` nos resultados, `#ux-addctx` e `#ux-editctx` na
   home), capturado pelo listener delegado que a camada já mantinha, na fase de **bolha** — ou seja,
   depois de o handler do owner ter pintado o editor e ainda dentro do mesmo evento.

Os dois convergem para `p52NewEditSession()`, a **única** função autorizada a recolher grupos. Ela
roda uma vez por EDIÇÃO — nunca numa repintura, nunca numa passagem do observador, nunca num toggle.
É essa restrição, e não uma flag global, que garante a §4: o estado escolhido pelo usuário sobrevive
a todo repaint, e só uma nova edição volta ao estado inicial recolhido.

O foco passa a repousar no primeiro `<summary>`. Com tudo recolhido, o `select` que o owner focava
está dentro de um `<details>` fechado e **não é renderizado** — focá-lo seria regressão de
acessibilidade, não correção. É o mesmo alvo que `p52GotoContextEditor()` já usava.

O default `open:true` do owner permanece **byte-idêntico**: é a apresentação que decide o estado
inicial da sessão de edição, não o dado.


## 16.6 · RED obrigatório (§2) — executado ANTES do código de produção

Os gates dirigidos foram escritos e executados **contra a árvore intocada**. O resultado abaixo é a
primeira execução, registrada como saiu:

```text
$ P52_ONLY=V322-HELP3,V322-HELP4,V322-HELP5,V322-ACC4,V322-ACC5,V322-MOT1,V322-MOT2 node tests_p52_layout.js
FAIL  V322-HELP3 — [home: ajuda (i) redundante em 'Situação declarada' de v32-pres-knowledge-management]
PASS  V322-HELP4
PASS  V322-HELP5
FAIL  V322-ACC4  — [home: grupos abertos na primeira abertura = [g1] (esperado nenhum)]
FAIL  V322-ACC5  — [o repaint ABRIU um grupo que o usuário não pediu]
FAIL  V322-MOT1  — [avançar não recebeu a transição para a frente: null]
FAIL  V322-MOT2  — [as regras de transição por direção não existem em `[data-p52-nav]`]
P52 LAYOUT (Phase 5.2): 2 PASS · 5 FAIL de 7 · exit=1
```

```text
$ P52_ONLY=V322-MOT3 node tests_p52_chromium.js
FAIL  V322-MOT3 — [movimento-normal: trocar de resposta aplica animação 'fade' (0.35s) ·
  1 animação(ões) ativa(s) ao trocar de resposta — [{"nome":"fade","dur":350,"estado":"running"}] ·
  a tela caiu para opacidade 0 ao trocar de resposta (o piscar) ·
  houve translação ao trocar de resposta — matrix(1, 0, 0, 1, 0, 10) ·
  avançar não marcou a transição para a frente (null) · voltar não marcou a transição para trás (null) ·
  avanço com animação 'fade' (esperado 'p52-nav-fwd') · avanço com duração 350ms (esperado 120–180ms) ·
  retorno com animação 'fade' (esperado 'p52-nav-back') · retorno com duração 350ms (esperado 120–180ms) ·
  avanço partiu de opacidade 0 · retorno partiu de opacidade 0 ·
  trocar de resposta pelo TECLADO anima ('fade') · Enter não avançou com transição (null) ·
  ArrowLeft não voltou com transição (null)]
P52 CHROMIUM (Phase 5.2): 0 PASS · 1 FAIL de 1 · exit=1
```

**Declaração honesta sobre `V322-HELP4` e `V322-HELP5`.** Os dois nasceram VERDES e isso está correto:
não são gates de RED, são gates de **preservação**. `V322-HELP4` afirma o que a errata mandava manter;
`V322-HELP5` afirma a integridade que a remoção poderia quebrar. Um gate que nunca reprovou, porém,
não provou nada — e por isso os dois recebem mutante próprio (`V322-M22` e `V322-M23`), que os faz
reprovar pelo motivo exato. O poder discriminante deles é demonstrado, não presumido.

Duas correções foram feitas no próprio harness **antes** do GREEN, e são declaradas: (a) a sonda de
movimento capturava o estado canônico ANTES da troca de resposta e acusava mudança que a própria
sonda tinha provocado; (b) uma asserção inicial exigia que o foco não repousasse no `<body>` após a
navegação — propriedade que o owner congelado **nunca** teve, e que teria sido um gate falso. As duas
foram corrigidas com o produto ainda defeituoso, e o RED acima é o resultado depois da correção do
harness.

## 16.7 · Gates novos (§6) e migração dos antigos

Gates novos, namespace `V322-*`:

| gate | suíte | propriedade |
|---|---|---|
| `V322-HELP3` | jsdom | zero ajuda em *Situação declarada*; zero ajuda por item em plataformas; ajuda única no cabeçalho, fabricante-neutra, com base instalada + direitos de uso + negação de implantação/cobertura/maturidade |
| `V322-HELP4` | jsdom | ajuda preservada: capabilities, campos de arquitetura, seis famílias, quatro subgrupos, todos os sinais, contexto complementar |
| `V322-HELP5` | jsdom | zero `aria-describedby` órfão, zero popover sem dono, zero ID duplicado, contrato idêntico em todo controle |
| `V322-ACC4` | jsdom | seis grupos recolhidos na primeira abertura, nas duas entradas, com estado coerente e sem pill |
| `V322-ACC5` | jsdom | abertura manual sobrevive ao repaint do owner E à passagem do decorador; nova edição reinicia recolhida |
| `V322-MOT1` | jsdom | marcação de transição só na navegação real entre perguntas; nunca ao trocar resposta, abrir observação, na home, nos resultados ou no editor |
| `V322-MOT2` | jsdom | contrato de CSS: neutralização incondicional, keyframes por direção, 120–180 ms, sem opacidade zero, `prefers-reduced-motion` com `!important`, zero decisão por user-agent/fingerprint/resolução |
| `V322-MOT3` | Chromium | medição real: `animation-name`, animações ativas, amostragem quadro a quadro de opacidade e `transform`, scroll, teclado e estado canônico |

Gates antigos **migrados**, com a propriedade preservada documentada linha a linha no próprio código:

| gate | o que mudou | por que não é enfraquecimento |
|---|---|---|
| `P52-CTX3` | exigia "pelo menos um grupo aberto" no estado inicial | a propriedade real (estado ativo distinguível) passou a ser medida **depois da interação**, e o gate GANHOU a verificação do estado inicial recolhido, que antes não existia |
| `P52-CTX4` | esperava `abertos == [g1]` | passou a exigir **nenhum** dos seis aberto: cobre seis grupos onde antes olhava um |
| `P52-CTX1v` | comparava aberto × fechado usando o default do owner | abre uma família pelo caminho real e prova que a distinção sobrevive à **interação** |
| `P52-HELP1` | fazia hover num controle que agora nasce dentro de grupo recolhido | abre a família como o usuário faz; ganhou asserção de **visibilidade** do controle |
| `P52-HELP2` | cobertura indiscriminada ("ajuda em tudo") | virou contrato de dois lados: presença obrigatória onde há ambiguidade **e ausência obrigatória** onde a errata a declarou redundante, cada lado com guarda de não vacuidade |
| `V322-CTXPAR1` | exigia `[g1]` aberto e testava só "não reabrir o que o usuário fechou" | exige os seis recolhidos nas duas entradas **e ao reabrir**, e testa a decisão do usuário **nos dois sentidos** (não fechar o que ele abriu, não reabrir o que ele fechou) |


## 16.8 · Campanha mutante (§6) — 96/96 detectados

Nove mutantes novos cobrem os seis exigidos pela §6 e três de não vacuidade:

| mutante | defeito reintroduzido | gate que detectou | motivo exigido |
|---|---|---|---|
| `V322-M16` | ajuda `(i)` de volta em cada *Situação declarada* | `V322-HELP3` | `ajuda (i) redundante em 'Situação declarada' de v32-pres-…` |
| `V322-M17` | ajuda `(i)` de volta numa subscription FortiGuard | `P52-HELP2` | `ajuda (i) redundante reintroduzida: subscription · v32-sub-fg-ips` |
| `V322-M18` | *SOC & Operations* volta a nascer aberto | `V322-ACC4` | `grupos abertos na primeira abertura = [g1]` |
| `V322-M19` | remove a neutralização: o `fade` volta a cada render | `V322-MOT3` | `trocar de resposta aplica animação 'fade'` |
| `V322-M20` | suprime a marcação: navegação real sem transição | `V322-MOT3` | `avançar não marcou a transição para a frente` |
| `V322-M21` | move a transição para a Web Animations API, fora do alcance do CSS | `V322-MOT3` | `… sob prefers-reduced-motion` |
| `V322-M22` | apaga a ajuda conceitual de uma capability | `V322-HELP4` | `capabilities sem ajuda — knowledge-management` |
| `V322-M23` | `aria-describedby` apontando para ID inexistente | `V322-HELP5` | `aria-describedby órfão — …` |
| `V322-M24` | recolhe os grupos em toda passagem do decorador | `V322-ACC5` | `o repaint FECHOU o grupo que o usuário abriu (passagem do decorador)` |

`V322-M21` merece nota: sob `prefers-reduced-motion: reduce` a Camada 1 congelada já aplica
`*{animation:none !important}`, e por isso um mutante que apenas removesse a regra desta camada não
produziria movimento algum — seria indetectável por construção e não mediria gate nenhum. O mutante
faz o que um implementador faria de errado de verdade: implementa a transição em JavaScript, via
`element.animate()`, que **não** obedece a `!important` de CSS. `V322-MOT3` o pega porque mede
`document.getAnimations()` e a amostragem quadro a quadro, não apenas o `animation-name` computado.

### 16.8.1 · Três mutantes ANTIGOS migrados — e por quê

A primeira execução da campanha completa devolveu **93/96**. Os três não detectados não revelaram
gate fraco: revelaram mutante obsoleto. Os três são registrados aqui porque esconder um resultado
intermediário seria pior do que explicá-lo.

| mutante | por que deixou de ser detectável | migração |
|---|---|---|
| `P52-RB4` | mutava o default `open:` de `ui_v32.js`. Com a §4, a apresentação recolhe os grupos ao abrir cada edição e o default do owner **deixou de ser observável**: o mutante era indetectável POR CONSTRUÇÃO e não media gate algum | passa a mutar `p52CollapseGroups()`, onde a propriedade agora vive; mesma propriedade, mesmo gate (`P52-CTX4`), mesmo motivo |
| `V322-M2` | mesma causa. Além disso, apenas *pular* o recolhimento não abria `g2`/`g3` — eles já eram `open:false` no owner —, e o mutante não realizava o defeito que descreve | passa a **abrir** todos os grupos, que é literalmente "parede de campos na primeira abertura"; gate e motivo inalterados |
| `V322-M3` | continuava reprovando `V322-CTXPAR1`, mas o gate passou a pegá-lo mais cedo: com o estado inicial recolhido, a PRIMEIRA passagem do decorador já reabre `g1` | o motivo aceito passa a incluir `abertura inicial = [g1]`, que diz a mesma coisa que `o decorador REABRIU…`. Nenhuma detecção incidental foi admitida |

Nenhuma das três migrações reduz a exigência: em todas, o mutante continua tendo de fazer o gate
**reprovar pelo motivo semântico correspondente**. O que mudou foi o ponto de injeção, para
acompanhar o ponto onde a propriedade passou a ser decidida.

## 16.9 · Assurance executada (§7)

Tudo abaixo foi **executado**; nada foi presumido. Nenhum comando interrompido, `SKIP` ou timeout é
registrado como PASS.

| verificação | comando | resultado |
|---|---|---|
| suíte congelada completa | `P52_NO_EVIDENCE=1 P50_NO_EVIDENCE=1 npm run test:all` | **exit 0** |
| engine | — | 105 PASS · 0 FAIL |
| UI 3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | — | 19 / 25 / 11 / 23 / 26 PASS · 0 FAIL |
| UX 4.1 · Target 4.3.1 · Ref 4.4 · Journey 4.5 · Icons 4.6 | — | 56 / 30 / 28 / 31 / 12 PASS · 0 FAIL |
| Session 4.8 | — | 97 PASS · 0 FAIL |
| UNSET geometry | — | 13 PASS · 0 FAIL |
| P50 core + P51 | — | 64 PASS · 0 FAIL |
| P50 Chromium + P51 | — | 27 PASS · 0 FAIL |
| P52 layout (jsdom) | `node tests_p52_layout.js` | **44 PASS · 0 FAIL** |
| P52 Chromium | `node tests_p52_chromium.js` | **50 PASS · 0 FAIL** |
| M41 | `npm run test:m41` | payload `9794b267…4365b` — **idêntico ao canônico** |
| visual | `npm run test:visual` | **67 passed · 0 failed · 37 skipped** (exit 0) |
| mutação | `node tests_p52_mutants.js` | **96/96 detectados**, restauração byte-idêntica |
| build determinístico | `python3 build_v32_html.py` ×2 | A == B == `332631223e40cfea…` |
| whitespace | `git diff --check` | limpo |

Todas as contagens congeladas do baseline 4.8.0.7 foram atingidas **exatamente**. `engine_v32.js`
permanece `9a4a2e67…5d247a` e `ui_v32.js` permanece `0b30fe27…f958e559` — byte-idênticos.

### 16.9.1 · Duas reprovações reais durante a rodada, corrigidas no PRODUTO e não no gate

1. **`P51-DOC1` reprovou**: o README que esta rodada escreveu continha a expressão
   "auditoria independente", e o gate proíbe conteúdo de governança de fase na landing page. A
   correção foi **no README** ("por revisão externa independente"); o gate não foi tocado.
2. **`V322-DOC3` reprovou**: o README nomeava a infraestrutura de publicação ("Tailscale ou Docker")
   dentro de uma frase de EXCLUSÃO. A proibição não está na §8.1 — ela é do gate que esta rodada
   escreveu. Mesmo assim, a correção foi **no README** (a frase passou a dizer "qualquer configuração
   de produção, de rede ou de publicação"), porque afrouxar um gate recém-escrito para acomodar o
   próprio texto seria exatamente o anti-padrão que a §6 proíbe. O README da v3.2.1 publicada
   também não nomeia infraestrutura.

### 16.9.2 · Preservação dos acervos selados

`docs_phase5/evidence_p50`, `evidence_p51` e `evidence_p52` terminam a rodada **byte-idênticos ao
commit selado**, confirmado por `git status --porcelain` vazio. Toda a evidência desta errata vive em
`docs_phase5/evidence_v322/`. As suítes Chromium foram executadas com `P52_NO_EVIDENCE=1` e
`P50_NO_EVIDENCE=1` justamente para isso, e a eficácia dessa supressão foi verificada empiricamente
(execução de `P52-ACC1,P52-PDF4` com a flag, seguida de `git status` vazio).

**Divergência observada e não explicada** (registrada, não escondida): no início desta rodada, 22
arquivos de `docs_phase5/evidence_p52/` — incluindo os seis PDFs de `pdf/` — estavam modificados em
relação ao commit selado, com `mtime` de 00:33–00:34 de 2026-08-25. O snapshot de `git status` do
início da sessão os mostrava limpos, e nenhuma execução desta rodada usou as suítes sem a flag de
supressão. Não foi possível atribuir autoria. Os arquivos foram **restaurados** para os bytes de
`HEAD` e assim permanecem. O auditor independente deve tratar isso como um fato do ambiente, não como
resultado desta errata.

## 16.10 · Evidência dirigida (§7)

`docs_phase5/evidence_v322/` recebeu, além do acervo do patch anterior:

| arquivo | o que mostra |
|---|---|
| `V322-02-primeira-abertura-seis-recolhidos.png` | primeira abertura limpa — os SEIS grupos recolhidos |
| `V322-10-capability-ajuda-no-nome.png` | capability aberta: ajuda `(i)` só no nome; *Situação declarada* sem controle |
| `V322-11-plataformas-sem-ajuda-por-item.png` | plataformas aberto: ajuda única no cabeçalho, zero por item, legendas e aviso do owner preservados |
| `V322-12-avanco-entre-perguntas.png` · `V322-13-retorno-entre-perguntas.png` | a transição curta, nos dois sentidos |
| `V322-14-home-1920x1080.png` | home FINAL desta candidata — imagem de abertura do README |
| `V322-15-questionario-1920x1080.png` · `V322-16-resultados-1920x1080.png` | capturas de referência do pacote externo, dos bytes finais |
| `V322-MOT3-motion.json` | medição de movimento com e sem `prefers-reduced-motion` |
| `V322-medidas.json` | censo de ajuda por família de alvo + medição de movimento |
| `V322-mutation-96.json` | campanha mutante completa desta rodada |

**Screenshot não prova ausência de animação.** É por isso que a prova de movimento é numérica:

```text
                          marcação  animation-name   duração   opacidade mínima  transform
troca de resposta         (nenhuma) none             —         1.000             none
avançar                   fwd       p52-nav-fwd      0.15s     1.000             translateX
voltar                    back      p52-nav-back     0.15s     1.000             translateX
avançar  (reduced-motion) fwd       none             0s        1.000             none
voltar   (reduced-motion) back      none             0s        1.000             none
```

Censo de ajuda `(i)` no editor, medido nas duas entradas (idêntico em ambas):

```text
PRESERVADAS   capabilities 22/22 · arquitetura 6/6 · famílias 6/6 · subgrupos 4/4 · sinais 22/22
REMOVIDAS     Situação declarada 0/22 · plataforma 0/1 · bundles 0/4 · subscriptions 0/14 · legendas 0/3
PLATAFORMAS   ajuda única no cabeçalho: SIM · controles dentro do grupo: 0
TOTAIS        60 controles · 60 popovers · 0 aria-describedby órfão
ACCORDION     grupos abertos na primeira abertura: []
```

De 104 controles para 60: **44 removidos**, nenhum órfão, nenhum ID duplicado.

## 16.11 · Tabela pre/post desta errata

| arquivo | SHA-256 antes | SHA-256 depois | natureza |
|---|---|---|---|
| `ui_p52_workspace_v32.js` | `471386e0…319fb6` | `a58a0e99…777278` | produção · owner de layout da Camada 5 |
| `ui_p52_workspace_v32.css` | `7e235e14…f0f81d` | `7048e033…0e3942` | produção · folha de estilo da Camada 5 |
| `quickscan_secops_soccmm_v3_2_dev.html` | `e7ddd965…f20422` (987.760 B) | `33263122…fa8ca2` (993.584 B) | artefato reconstruído pelo builder canônico |
| `tests_p52_layout.js` | `258de36f…14cf0f` | `0558407c…d79752` | gates jsdom · 7 novos + 2 migrados + 2 de documentação |
| `tests_p52_chromium.js` | `144e4fdd…354696` | `a2d28c18…a96a58` | gates Chromium · 1 novo + 4 migrados |
| `tests_p52_mutants.js` | `42044f7b…a2a4e45` | `99e51418…fa2b81` | 9 mutantes novos + 3 migrados |
| `tools_p52_shots.js` | `737450e5…81f5dc5` | `e287a7ab…1741a9` | gerador de evidência · 7 cenas novas + censo de ajuda + medição de movimento |
| `README.md` | `be7975de…160732` | `11f4b400…4ab70b` | documentação · revisão obrigatória da §8.1 |
| `USER_GUIDE.md` | `d510bdda…12585e` | `6a381858…44392c` | documentação · coerência factual |

## 16.12 · Inventário do que NÃO foi alterado

`engine_v32.js` (`9a4a2e67…5d247a`), `ui_v32.js` (`0b30fe27…f958e559`), `ui_ux_v32.js`,
`ui_session_v32.js`, `ui_target_v32.js`, `ui_journey_v32.js`, `ui_icons_v32.js`,
`ui_refinement_v32.js`, `ui_p50_shell_v32.js`, `ui_p50_suff_v32.js`, `ui_p50_results_v32.js`,
`ui_v32.css`, `ui_ux_v32.css`, `ui_p50_v32.css`, `build_v32_html.py`, `package.json`,
`package-lock.json`, `quickscan_secops_soccmm_v3_1_3.html` (Camada 1 congelada) e todos os acervos
de evidência anteriores permanecem **byte-idênticos**.

Nada de cálculo, resposta, suficiência, estágio, Current × Target, gap, recomendação, impressão/PDF,
schema de sessão ou payload M41 foi tocado. `AGENTS.md` continua não rastreado, intocado e fora do
manifesto.

## 16.13 · Limitações e ressalvas desta rodada

1. **`buildPrintReport` embrulhado é código morto.** A Camada P52 embrulha `buildPrintReport` desde
   antes desta errata, mas essa função vive dentro da IIFE de `ui_v32.js` e não é alcançável por
   nome — o wrapper nunca executa. A transformação de linguagem no papel continua acontecendo pelo
   listener de `beforeprint`, que é o caminho real. **Achado pré-existente, fora do escopo desta
   errata, não corrigido aqui** — corrigi-lo exigiria tocar superfície fora da boundary. Registrado
   como dívida.
2. **O foco ao abrir o editor mudou.** Antes repousava no primeiro `<select>`; agora repousa no
   primeiro `<summary>`, porque com tudo recolhido o `select` não é renderizado. É consequência
   direta e desejada da §4, mas é comportamento novo e merece verificação de teclado na UAT.
3. **A campanha mutante foi validada contra os bytes finais**: o baseline registrado em
   `V322-mutation-96.json` é `332631223e40cfea…`, o mesmo HTML final. Depois dela, os únicos
   arquivos alterados foram `README.md`, `USER_GUIDE.md` e as duas asserções de documentação
   acrescentadas a `tests_p52_layout.js`; nenhum mutante executa a suíte de layout sem filtro
   `P52_ONLY`, e os dois gates novos são ignorados por esse filtro, de modo que nenhum resultado da
   campanha depende deles.
4. **`V322-HELP4` e `V322-HELP5` nasceram verdes.** São gates de preservação, não de RED. O poder
   discriminante dos dois é provado por `V322-M22` e `V322-M23`, e não presumido.
5. **Docker não está disponível nesta distro WSL.** Nenhum container, volume, Serve ou Funnel foi
   criado, alterado, reiniciado ou parado. A limitação é declarada como estado operacional.
6. **Divergência do acervo `evidence_p52`** descrita na §16.9.2, sem autoria atribuída.

## 16.14 · Parada

**Nenhum commit, push, PR, merge, tag, GitHub Release, deployment, promoção ou substituição de
produção foi executado.** A produção v3.2.1 em `127.0.0.1:1337` e a rota de publicação permanecem
servindo exatamente os bytes da v3.2.1; o preview em `127.0.0.1:1338` não foi tocado. A v3.2.2
**NÃO** está declarada aprovada, congelada ou promovida.

O pacote externo de 2026-08-24 está **SUPERADO** — o HTML candidato mudou de `e7ddd965…f20422` para
`332631223e40cfea…`, e o pacote antigo não pode mais ser apresentado como corrente. Um pacote novo
foi montado a partir dos bytes finais.

Próximos passos, nesta ordem e em sessões separadas: UAT visual do proprietário e, depois, auditoria
independente sem participação de quem implementou.

---

# 17 · Errata final orientada a risco (rodada seguinte · REV C)

Rodada executada sob `INSTRUCAO_ERRATA_FINAL_ORIENTADA_A_RISCO_QUICKSCAN_V3_2_2.md`
(SHA-256 `21425d6d7249714554adbc8589f7f1a69f1cd26defa3c25b52c020945d5a9a00`, 18.619 bytes, 493 linhas,
UTF-8 sem BOM, zero CRLF — recalculado antes de qualquer ação).

Fonte dos achados: `docs_phase5/AUDITORIA_EXTERNA_INDEPENDENTE_QUICKSCAN_V3_2_2_REV_B.md`
(`90ed5390…86524f`, 55.157 bytes, 931 linhas), veredito **FAIL** com 1 BLOCKER, 2 ALTOS, 5 MÉDIOS e
8 BAIXOS. O parecer é evidência de reprodução, não autorização para implementar tudo o que lista.

**Política de risco do proprietário aplicada nesta rodada:** corrigir integralmente B-01, A-01 e
A-02; tratar os médios locais e baratos; manter baixos, dívida arquitetural e melhorias não
essenciais como **backlog aceito, não bloqueante**. O objetivo não é "zero achados": é ausência de
risco material conhecido no uso proposto.

## 17.1 · Preflight de identidade (§2) — PASS

| objeto | esperado | recalculado | veredito |
|---|---|---|---|
| branch | `fix/v3.2.2-context-footer-print-ux` | idem | IGUAL |
| `HEAD` | `07bc90b3fbf6f033a56c490f3bff1951c58316b7` | idem | IGUAL |
| `origin/main` | `07bc90b3fbf6f033a56c490f3bff1951c58316b7` | idem | IGUAL |
| `quickscan_secops_soccmm_v3_2_dev.html` | `332631223e40cfea…fa8ca2` · 993.584 B | idem | IGUAL |
| `engine_v32.js` | `9a4a2e67…5d247a` | idem | IGUAL |
| payload M41 | `9794b267…3ed4365b` | idem — reexecutado | IGUAL |
| `README.md` | `11f4b400…4ab70b` | idem | IGUAL |
| `USER_GUIDE.md` | `6a381858…44392c` | idem | IGUAL |
| `PATCH_…_REPORT.md` | `3397a88d…7eab00` | idem | IGUAL |
| `MANIFEST_V3_2_2.sha256` | `af914b57…62cf74` · 47 entradas | idem · 47 | IGUAL |
| parecer REV B | `90ed5390…86524f` · 55.157 B · 931 linhas | idem | IGUAL |

Zero staged. Nenhum processo de suíte, build, Playwright, Chromium, PDF ou gerador de evidência
ativo. `AGENTS.md` não rastreado, intocado, fora do manifesto e fora de qualquer staging. Nenhum
arquivo temporário de auditoria na raiz. Produção v3.2.1 fora de escopo e não tocada.

## 17.2 · Causa comum de B-01 e A-01 — medida, não suposta

O handler global de teclado vive na **Camada 1 congelada** (`quickscan_secops_soccmm_v3_1_3.html`,
linha 1036 do arquivo base; linha 4267 do HTML construído):

```js
document.addEventListener("keydown", e=>{
  if(e.target && (e.target.tagName==="TEXTAREA" || e.target.tagName==="INPUT")) return;
  if((e.key==="Enter" || e.key===" ") && e.target?.classList?.contains("opt")) return;
  if(step===-1 && e.key==="Enter"){ step=0; render(); return; }
  ...
```

Duas decisões erradas somadas:

1. **isenção por `tagName`, e não por "o alvo trata a própria tecla"** — `BUTTON`, `SELECT`,
   `SUMMARY` e `A[href]` não estão isentos;
2. **identidade de tela derivada só de `step`** — `uxOpenHomeEditor()` monta a tela do editor sem
   alterar `step`, que permanece em `-1`.

Somadas: qualquer `Enter` no editor aberto pela home caía no ramo "home → iniciar questionário",
`render()` substituía `#app`, o `draft` (que vive fora do DOM) sobrevivia órfão, e `safePrint()`
passava a recusar — corretamente — imprimir, sem editor na tela para salvar ou cancelar.

## 17.3 · Decisão de boundary — nada fora da Camada P52

| arquivo | por que NÃO foi tocado |
|---|---|
| `quickscan_secops_soccmm_v3_1_3.html` | Camada 1 congelada; o handler não é alcançável por nome — não há referência para remover nem embrulhar |
| `ui_ux_v32.js` | `uxOpenHomeEditor()` (tela do editor sem `step`) e o `#v32errors` externo vivem aqui; superfície 4.1, fora da change boundary da §3 |
| `ui_v32.js` | owner do editor e do `draft`; §29.4 da Phase 5.0 e `P50-GOV1`/`P50-IC4` o fixam byte a byte |
| `engine_v32.js`, `build_v32_html.py`, `package.json`, `specs/*` | protegidos pela §3.2 |

A correção inteira é da **Camada 5.2**, que é onde o defeito se manifesta e onde a apresentação já é
dona do teclado, do foco e do layout.

### 17.3.1 · Por que `<html>`, na bolha

O caminho de um `keydown` é `window → document → html → … → alvo → … → html → document → window`.

- **captura em `document`** rodaria antes do alvo: barrar ali mataria os handlers do próprio
  controle e a seleção nativa;
- **bolha em `document`** rodaria **depois** do handler congelado, que foi registrado primeiro;
- **bolha em `document.documentElement`** é o último nó antes de `document`: o evento já passou pelo
  alvo e por todos os ancestrais elementares — todos os handlers de elemento já rodaram — e a **ação
  padrão** (o clique nativo que o `<button>` dispara, a navegação do `<a>`, o comportamento do
  `<select>`) é intocada, porque `stopPropagation` **não** é `preventDefault`.

Varredura do artefato: os únicos outros ouvintes de `keydown` em `document` são o de `Escape` desta
própria camada e o da camada de refinamento, este registrado em **captura** — portanto anterior ao
escudo e não afetado por ele. O único ouvinte suprimido é o global congelado.

### 17.3.2 · Cinco condições de supressão

| # | condição | por quê |
|---|---|---|
| 1 | `isComposing` / `keyCode === 229` | `Enter` confirma composição de IME; não navega |
| 2 | `ctrlKey` / `metaKey` / `altKey` | `Enter` com modificador não é o atalho que a interface anuncia |
| 3 | `defaultPrevented` | um handler mais próximo já consumiu a tecla e sabe o que ela significa ali |
| 4 | o alvo trata a própria ativação | `button, select, input, textarea, summary, a[href], [contenteditable], [role=button], [role=link]` |
| 5 | a tela não é a que o atalho controla | `p52RealHome()` exige a home **de fato** — sem editor vivo e com o `#start` que a interface mostra — em vez de aceitar `step === -1` como prova |

**O que não muda:** `Enter` sobre um card `.opt` continua selecionando; `Enter` com o foco fora de
um controle continua avançando o questionário, a partida na home e as prioridades. Nenhuma das cinco
condições se aplica, o evento chega intacto ao handler congelado e o contrato de teclado documentado
permanece. Isso é gate `V322C-KEY1`/K9 e K10, e não presunção.

## 17.4 · A-02 — preservação de foco

Dois instantes distintos, duas metades:

1. **o foco que o owner restaurou e a decoração derrubou.** `paintEditor()` repõe o foco no
   `select` da capability; logo depois `p52ContextRegions()`, `p52DecorateContextGroups()` e
   `p52MountHeaderHelp()` reparenteiam o nó que o contém, e mover um nó que contém o
   `activeElement` derruba o foco para `<body>` no Chromium. A identidade estável (`id`) do
   `activeElement` é capturada antes da decoração e devolvida **depois do último reparentamento** —
   que é `p52CapHelp()`, não `p52ContextRegions()`;
2. **o foco que o owner não repõe.** "+ Adicionar tecnologia", "Remover" e a troca de bundle
   repintam sem repor: quando a decoração roda, o `activeElement` já é `<body>` e não há o que
   capturar. A **intenção** é registrada na fase de **captura** do evento — antes do handler do
   owner — e resolve para um controle previsível e próximo da ação: o campo da tecnologia
   recém-criada, o botão de adicionar da mesma capability, ou o próprio rádio de bundle.

Três disciplinas fecham o contrato:

- restaura **somente** quando o foco foi realmente perdido (`activeElement` fora do editor ou
  `<body>`) — sem isso, uma passagem do observador roubaria o foco de quem tabulou para fora, e o
  mouse ganharia saltos perceptíveis;
- **nada** é restaurado em editor ausente, escondido ou vazio: tela fechada por Salvar/Cancelar não
  recebe foco de volta;
- `focus({preventScroll:true})`, e a rolagem é reposta a partir do valor lido **antes do repaint do
  owner**. Esse detalhe foi descoberto por reprovação real do gate: `paintEditor()` troca o
  `innerHTML` do editor, o documento encolhe por um instante, o navegador prende o `scrollTop` ao
  novo limite e a posição não volta sozinha — **-90 px medidos** ao trocar de bundle. A posição lida
  na entrada da decoração já é a posição saltada; só a de antes do repaint preserva a leitura.

## 17.5 · Melhorias oportunistas implementadas (§5)

### M-01 · reflow abaixo de 430 px

Duas causas somadas, ambas tratadas:

1. **especificidade entre camadas** — o override móvel `#v32editor .v32-signals` (1,1,0) não
   alcançava a base `#v32editor .v32-subs .v32-signals` (1,2,0), que continuava computando
   `grid-template-columns: 260px`, rígido. O override passa a repetir a mesma especificidade;
2. **caixas que não encolhem** — `fieldset` tem `min-inline-size: min-content` na folha do agente de
   usuário e item de grade tem `min-width: auto`: os 260 px rígidos subiam pela árvore e fixavam o
   `min-content` do `<fieldset>` em 328 px. `min-inline-size: 0` nos fieldsets do editor,
   `minmax(0,1fr)` e `min-width: 0` nos itens, e teto de 100% em `select`/`input[type=text]`
   (o `min-content` de um `<select>` é o da sua opção mais longa).

O editor não foi redesenhado: ordem de leitura, grupos, rótulos e comportamento em desktop são os
mesmos.

### M-02 · uma única região de erro

O nó `#v32errors` que `uxOpenHomeEditor()` injeta **fora** do editor é removido na primeira passagem
de decoração da sessão de edição, que acontece **dentro do mesmo clique** — `uxOpenHomeEditor()`
chama `window.__V32UI.openEditor()`, que esta camada embrulha. Nenhum caminho do owner escreve em
`#v32errors` antes disso, portanto não há mensagem a preservar. A partir daí
`getElementById("v32errors")` resolve para a caixa do editor, imediatamente antes de
Salvar/Cancelar — que é onde o manual (§12.0) já dizia que ela estaria.

### M-05 · contraste

| controle | antes | depois | como |
|---|---|---|---|
| `#ux-addctx` (home) | `#fff` sobre `#307FE2` = **3,99:1** | `#fff` sobre `#2B72CB` = **4,80:1** | variante de preenchimento do azul de marca, mesmo matiz, 10% mais escura. O token `--ftnt-blue` **não** foi alterado: ele continua identificando o domínio Tecnologia no radar, no emblema e nas bordas de acento |
| `#next` (prioridades) | `#DA291C` sobre `#0B0B0C` = **4,04:1** | `#F54133` sobre `#0B0B0C` = **5,33:1** | `--red-text`, o token que esta camada já mantém para vermelho pequeno. A escolha é **por tela** (`priority` e `arq`) para não colidir com a forma preenchida da pergunta, que já rende 4,87:1 |

As razões são **recalculadas em runtime** pela fórmula do WCAG sobre as cores resolvidas por
`getComputedStyle`, com o fundo efetivo descoberto subindo a árvore. Aparência não conta.

## 17.6 · RED obrigatório (§7) — executado ANTES do código de produção

Seis gates novos, namespace próprio `V322C-*`, todos reprovando na candidata de entrada com exit
code próprio. Log integral: `docs_phase5/evidence_v322/rev_c/RED_V322C.log`.

```text
FAIL  V322C-ID1   (tests_p52_layout.js)     exit=1
FAIL  V322C-KEY1  (tests_p52_chromium.js)
FAIL  V322C-FOC1  (tests_p52_chromium.js)
FAIL  V322C-PRN1  (tests_p52_chromium.js)
FAIL  V322C-RFL1  (tests_p52_chromium.js)
FAIL  V322C-CON1  (tests_p52_chromium.js)   exit=1
```

O RED reproduz literalmente o parecer externo: `Enter` levando a `arq`, foco em `BODY` nas quatro
repinturas, `window.print` chamado 0 vez após Salvar por teclado, 39 caixas do editor fora da tela a
320 px, `3.99:1` e `4.04:1`.

| gate | mede | onde |
|---|---|---|
| `V322C-KEY1` | matriz K1–K12; `Enter ≡ clique` por estado canônico em páginas independentes | Chromium |
| `V322C-FOC1` | F1/F2/F2b/F3 depois do checkpoint de microtarefas; rolagem; loop de observador; tela fechada | Chromium |
| `V322C-PRN1` | O1/O2/O3 ponta a ponta com `window.print` instrumentado | Chromium |
| `V322C-RFL1` | oráculo geométrico em 320/360/384/390/430 px, independente do CSS | Chromium |
| `V322C-CON1` | contraste recalculado pela fórmula do WCAG | Chromium |
| `V322C-ID1` | unicidade de ID no documento **inteiro**, nas duas entradas | jsdom |

### 17.6.1 · Não vacuidade

- **K8, K9 e K10 nasceram verdes** e são deliberadamente âncoras de regressão, não casos RED: K8
  prova a paridade da entrada dos resultados (que a REV B já media correta), K9 que o card `.opt`
  continua selecionando, K10 que o atalho global de avanço **não** foi morto pelo escudo. O poder
  discriminante dos três é provado por mutante, não presumido.
- **Um oráculo vacuoso foi encontrado e corrigido na primeira execução**: em K5 o `filechooser` do
  Playwright descartava o `<input type=file>` — e o seu `onchange` de descarte removia o nó — antes
  da leitura, fazendo o ramo do **clique** reprovar por artefato de harness. A medição passou a ser
  na origem, contando a chamada suprimida de `HTMLInputElement.prototype.click`, instalada
  identicamente nos dois modos.
- **K12 foi acrescentado durante a rodada**, ao construir a matriz de mutação: sem ele, a cláusula
  5 (identidade de tela) não teria mutante capaz de detectá-la, porque as cláusulas 4 e 5 se
  sobrepõem em quase todos os alvos reais.

## 17.7 · Campanha mutante dirigida (§8) — 29/29 detectados

Mutantes novos, estreitos, um por cláusula da correção. Todos restaurados byte a byte, inclusive em
erro; nenhum tocou o acervo de evidência.

| mutante | o que ataca | gate | motivo esperado |
|---|---|---|---|
| `V322C-M1` | isenção de `<button>` | `V322C-KEY1` | K1 (Enter): tela final 'arq' |
| `V322C-M2` | isenção de `<select>` | `V322C-KEY1` | T3 (select): a isenção por ALVO não está em vigor |
| `V322C-M3` | voltar a decidir só por `step === -1` | `V322C-KEY1` | K12 (Enter) |
| `V322C-M4` | `Enter` em "← Voltar" avança | `V322C-KEY1` | K6 (Enter): pergunta N → M |
| `V322C-M5` | omitir a restauração de foco | `V322C-FOC1` | F1: o foco caiu para `<body>` |
| `V322C-M6` | restaurar foco em `<body>` | `V322C-FOC1` | F1: o foco caiu para `<body>` |
| `V322C-M7` | Salvar/Cancelar caem no handler global | `V322C-KEY1` | T1 (button): a isenção por ALVO não está em vigor |
| `V322C-M8` | limpar a pendência sem o draft morrer | `V322C-PRN1` | mensagem de bloqueio invisível |
| `V322C-M9` | especificidade insuficiente na regra móvel | `V322C-RFL1` | caixas do editor além da largura |
| `V322C-M10` | não remover o `#v32errors` externo | `V322C-ID1` | ids duplicados no documento |
| `V322C-M11` | devolver o azul de marca ao preenchimento | `V322C-CON1` | `#ux-addctx`: contraste |

### 17.7.1 · Duas mutações NO-OP na primeira execução — e o que foi feito

A primeira execução desta campanha deu **27/29**. `V322C-M2` (isenção de `<select>`) e `V322C-M7`
(Salvar/Cancelar) **não foram detectados** — e a causa não era fraqueza do gate nem defeito do
produto: eram **mutações no-op**.

Medido: na tela do editor, a **cláusula 5** do escudo (identidade de tela) já recusa o `Enter`
independentemente do alvo. Remover `<select>` ou os dois botões da **cláusula 4** não muda efeito
observável algum ali — e, nas demais telas em que esses controles existem (o editor aberto pelos
RESULTADOS), o handler global congelado não tem ramo de `Enter` para executar. As duas cláusulas se
sobrepõem, e a matriz de EFEITO não consegue distingui-las.

A §8 é explícita: mutação no-op **não é contada**. Contá-las como detectadas seria falso; forçar a
detecção afrouxando um gate seria pior.

O que foi feito é a terceira alternativa: **tornar a regra normativa falsificável**. A §4.1 exige a
isenção **por alvo**, e essa exigência é independente de tela. `V322C-KEY1` passou a medir, para
cada classe de controle da lista da §4.1, **qual cláusula do escudo está em vigor** — pelo contador
e pelo motivo que `window.__P52.diag()` publica, com a cláusula de alvo avaliada antes da de tela.
São doze casos (`T1`–`T12`): `button` (Salvar, Cancelar, `#back`, `#notetgl`, `#ux-addctx`,
`#ses-import-home`), `select`, `summary`, `input`, `textarea`, `a[href]` e `[role="button"]`.

Com isso os dois mutantes passaram a ser detectados **pelo motivo semanticamente correto**, sem que
nenhuma asserção existente fosse enfraquecida — e a campanha final fechou em **29/29**.

**Achado lateral, registrado.** O nó do emblema (`[role="button"]`) é blindado pela **cláusula 3**
(`evento já consumido`), não pela 4: o seu próprio ouvinte de `keydown` chama `preventDefault()`, e
ouvinte de elemento roda antes do escudo. As duas cláusulas dizem a mesma coisa — o alvo trata a
própria ativação —, mas o gate exige o motivo **esperado por caso** em vez de aceitar qualquer um: se
o emblema deixasse de consumir a tecla, o motivo exigido passaria a ser `alvo-ativa-sozinho` e o caso
reprovaria.

**Onde o draft órfão continua sendo medido.** Não em `V322C-M7`, e sim em `V322C-M3` — o mutante que
devolve a decisão de tela ao `step === -1` e que, por isso, **produz** um draft órfão de verdade. Ele
é detectado por `K12`, cuja falha nomeia literalmente `draft órfão: existe draft sem editor na tela`.

**Seleção dirigida, e por quê.** A §8 autoriza executar os mutantes novos mais os existentes que
atingem os arquivos e caminhos modificados, reservando a campanha integral de 96 para alteração
ampla, falha inesperada ou impossibilidade de demonstrar cobertura real. Os caminhos tocados nesta
errata são novos (escudo de teclado, restauração de foco, deduplicação de `#v32errors`) ou
estritamente aditivos (duas regras de CSS); a regressão integral cobre o resto e não mostrou sinal
novo.

Foram executados **29 mutantes**: os 11 novos e 18 existentes cujos gates exercitam exatamente os
caminhos modificados — decoração do editor de contexto (`V322-CTXPAR1`, `V322-ACC4`, `V322-ACC5`,
`P52-CTX1v`), pendência e bloqueio de impressão (`V322-PRINT1`, sete mutantes), ajuda e wrapper de
cabeçalho do editor (`V322-HELP3/4/5`, `V322-NI1`, `P52-POP2`). **A campanha integral dos 96 não foi
executada e não está reportada como executada** (§17.12).

Restauração ao fim da campanha: todos os oito arquivos mutáveis e o HTML **byte-idênticos**; acervo
de evidência com **302 arquivos byte-idênticos ao início**.

## 17.8 · Assurance executada (§9)

Rodada final limpa, toda com exit code próprio. Logs integrais em
`docs_phase5/evidence_v322/rev_c/`.

| # | verificação | resultado |
|---|---|---|
| 1 | gates dirigidos desta errata | **6/6 PASS** · `GREEN_V322C.log` · exit 0 e 0 |
| 2 | mutação dirigida (§8) | **29/29 detectados** · exit 0 · `V322C-mutacao-dirigida.log` |
| 3 | `npm run test:all` | **exit 0 · 0 FAIL** · `V322C-test-all.log` |
| 4 | `npm run test:visual` | **67 passed · 0 failed · 37 skipped** · `V322C-test-visual.log` |
| 5 | Session 4.8 | **97 PASS · 0 FAIL de 97** |
| 6 | M41 com payload canônico | **PASS** · `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` |
| 7 | build determinístico A/B/C | `913440adc157e850e100c98a706ad6e6793e3556981bb78a4736500cd1c02879` nas três execuções · 1.014.061 bytes |
| 8 | `git diff --check` | limpo |
| 9 | manifesto | regenerado por ÚLTIMO, sem duplicata, ausente, excedente ou autorreferência |
| 10 | smoke real por mouse e teclado | `V322C-SMOKE-invariantes.json` |

Contagens congeladas, conferidas uma a uma contra o baseline 4.8.0.7:

```text
engine 105 · UI 19+25+11+23+26 · UX 56 · Target 30 · Ref 28 · Journey 31 · Icons 12
Session 97/97 · UNSET 13 · P50 core+P51 64 · P50 chromium+P51 27 · M41 PASS
visual 67 passed / 0 failed / 37 skipped
```

Os únicos desvios são **aditivos e nominais**: `P52 LAYOUT 44 → 45` (o gate `V322C-ID1`) e
`P52 CHROMIUM 50 → 55` (os cinco gates Chromium desta errata). Nenhuma contagem congelada caiu.

### 17.8.1 · Smoke real, nos dois meios

Fluxo completo home → contexto → questionário → resultados → PDF, uma vez por **mouse** e uma vez por
**teclado**, com `window.print` instrumentado:

```text
MOUSE    salvar por clique  -> draft:false  tela:home   ·  PDF: window.print = 1, bloqueio:false, 0 erros
TECLADO  Enter em #ux-addctx           -> tela: ctxeditor
         Enter no select               -> tela: ctxeditor   (editor vivo)
         Enter em Salvar contexto      -> tela: home, draft:false
         questionário inteiro por tecla (2 / Enter, 16 telas) -> tela: results
         Enter no botão de PDF         -> window.print = 1, bloqueio:false, 0 erros
```

Zero erro de página e zero erro de console nos dois fluxos.

### 17.8.2 · Invariantes canônicos — confirmados explicitamente

| invariante | como foi medido | resultado |
|---|---|---|
| `UNSET ≠ NA ≠ 0` | 15 não respondidas → gate `blocked` e `n/d`; 15 `NA` → gate `blocked`; 15 nível 0 → gate `released` publicando `0.0` | **OK** |
| tecnologia não altera score, estágio, suficiência ou gap | declarar `endpoint-detection` PRESENT com produto e recomparar gate, scores por domínio, estágio e KPI lidos da TELA | **idênticos** |
| Current insuficiente não publica Target | 4 confirmadas + alvos declarados em todas as práticas → gate `blocked`, `n/d` publicado | **OK** |
| nenhum draft impede PDF sem caminho visível de recuperação | `V322C-PRN1`/O3: bloqueio correto, mensagem visível, "Ir para contexto tecnológico" torna o editor alcançável, Cancelar restaura a impressão | **OK** |
| sessão exporta somente estado canônico | chaves de raiz do documento exportado + varredura por derivado dentro de `inputs` | **zero derivado** |
| produção v3.2.1 permanece intocada | nenhum arquivo de produção, Docker, Tailscale, porta ou release foi tocado | **OK** |

## 17.9 · Evidência dirigida (§10)

Acervo NOMINAL desta errata, em `docs_phase5/evidence_v322/rev_c/`:

| arquivo | o que mostra |
|---|---|
| `RED_V322C.log` | primeira execução dos seis gates novos na candidata de ENTRADA — 6/6 FAIL, exit 1 |
| `GREEN_V322C.log` | os mesmos seis gates sobre a candidata corrigida — 6/6 PASS, exit 0 |
| `V322C-mutacao-dirigida.log` · `.json` | campanha 29/29, com o registro do diagnóstico de no-op da primeira execução |
| `V322C-test-all.log` · `V322C-test-visual.log` | regressão integral e suíte visual, com exit code |
| `V322C-SMOKE-invariantes.json` | smoke por mouse e por teclado + os invariantes canônicos |
| `V322C-01-home-1920x1080.png` | home dos bytes finais, com o CTA de contexto em 4,80:1 |
| `V322C-02-enter-no-select-editor-vivo.png` | B-01 fechado: `Enter` no select **não** destrói o editor |
| `V322C-03-enter-em-salvar-volta-a-home.png` | `Enter` em Salvar grava e devolve à home, sem draft órfão |
| `V322C-04-editor-390px-sem-corte.png` | M-01 fechado: plataformas/licenciamento inteiro dentro da tela a 390 px |
| `V322C-05-erro-unico-junto-das-acoes.png` | M-02 fechado: a região de erro que o runtime resolve é a do editor, junto de Salvar/Cancelar |

Medições dos gates, escritas pelo próprio harness em `docs_phase5/evidence_v322/`:
`V322C-KEY1-teclado.json` (matriz K1–K12 + regra por alvo T1–T12), `V322C-FOC1-foco.json`,
`V322C-PRN1-impressao.json`, `V322C-RFL1-reflow.json`, `V322C-CON1-contraste.json`.

**Captura não prova comportamento.** As cinco imagens são ilustração; o que decide são os JSON e os
logs, e é por isso que cada afirmação acima aponta para um número, não para um pixel.

## 17.10 · Tabela pre/post desta errata

| arquivo | SHA-256 antes | SHA-256 depois | natureza |
|---|---|---|---|
| `ui_p52_workspace_v32.js` | `a58a0e99…777278` | `cad66aeb…c11a8a` | produção · escudo de `Enter`, preservação de foco, região de erro única |
| `ui_p52_workspace_v32.css` | `7048e033…0e3942` | `862354a0…f5442d` | produção · reflow do editor e contraste dos dois controles |
| `quickscan_secops_soccmm_v3_2_dev.html` | `33263122…fa8ca2` (993.584 B) | `913440ad…c02879` (1.014.061 B) | artefato reconstruído pelo builder canônico |
| `tests_p52_layout.js` | `0558407c…d79752` | `ac557f39…767b43` | gate `V322C-ID1` |
| `tests_p52_chromium.js` | `a2d28c18…a96a58` | `5c9f9cb6…36102d` | gates `V322C-KEY1/FOC1/PRN1/RFL1/CON1` + regra por alvo |
| `tests_p52_mutants.js` | `99e51418…fa2b81` | `f8db2d94…760885` | 11 mutantes novos |
| `docs_phase5/PATCH_…_REPORT.md` | `3397a88d…7eab00` | (esta §17) | relatório da implementação |
| `docs_phase5/MANIFEST_V3_2_2.sha256` | `af914b57…62cf74` | (regenerado por último) | manifesto da rodada |
| `docs_phase5/evidence_v322/rev_c/*` | — | novos | acervo nominal desta errata |
| `docs_phase5/evidence_v322/V322C-*.json` | — | novos | medições escritas pelos gates |

## 17.11 · Inventário do que NÃO foi alterado

Byte-idênticos, recalculados ao fim da rodada:

```text
9a4a2e67…5d247a  engine_v32.js
0b30fe27…f958e559  ui_v32.js
a0504011…7a9d3938  ui_ux_v32.js
6fd849cd…dc27164b  ui_session_v32.js
d672da97…e4aa63f8  ui_target_v32.js
e28a2173…436a58e3  ui_p50_shell_v32.js
a9931330…94b86f5b  ui_p50_suff_v32.js
57fd78ca…f984a141  ui_p50_results_v32.js
acb0eba1…730faa6f  ui_v32.css
84af6705…41483b44  ui_ux_v32.css
749cbb98…a239dc93  ui_p50_v32.css
bf98d496…a8ade89ac  build_v32_html.py
b0ee93a2…6351daef  package.json
d3290491…deb7ae82  quickscan_secops_soccmm_v3_1_3.html   (Camada 1 congelada)
e287a7ab…d8d71741a9  tools_p52_shots.js
11f4b400…4ab70b  README.md
6a381858…44392c  USER_GUIDE.md
```

`README.md` e `USER_GUIDE.md` **não** foram tocados: a §10.6 autoriza atualizá-los somente se a
instrução operacional ao usuário tiver mudado, e ela não mudou — nada no manual prometia o
comportamento defeituoso, e a §12.0 do guia, que já dizia que a mensagem aparece "junto aos botões
Salvar contexto / Cancelar, dentro do próprio editor", passou de **falsa na entrada pela home** a
**verdadeira nas duas entradas** por efeito da correção M-02. Uma alegação que passa a ser verdadeira
não exige reescrita.

Nada de cálculo, resposta, suficiência, estágio, Current × Target, gap, recomendação, impressão/PDF,
schema de sessão ou payload M41 foi tocado. `AGENTS.md` continua não rastreado, intocado e fora do
manifesto. Os acervos de evidência anteriores (`evidence_p52` e o primeiro nível de `evidence_v322`)
permanecem byte-idênticos — 302 arquivos conferidos ao início e ao fim da campanha mutante.

## 17.12 · Ressalvas não bloqueantes aceitas e backlog

Registro separado, conforme a §10 da instrução.

### Corrigido nesta rodada

`B-01` (BLOCKER) · `A-01` (ALTO) · `A-02` (ALTO) · `M-01` (MÉDIO) · `M-02` (MÉDIO) · `M-05` (MÉDIO).

### Ressalva não bloqueante aceita

| # | ressalva | impacto | por que não bloqueia |
|---|---|---|---|
| R-1 | A imagem de abertura do `README.md` (`V322-14-home-1920x1080.png`) foi capturada antes da M-05 e mostra o CTA de contexto no azul de marca (`#307FE2`), não na variante de preenchimento (`#2B72CB`). | cosmético: **um** controle, diferença de 10% de luminância no mesmo matiz. Nenhuma alegação textual do README ficou falsa. | a §3.1 autoriza editar o `README.md` **apenas se o comportamento documentado mudar**, e uma captura não é comportamento documentado. Trocar a imagem seria ampliar a boundary por preferência estética. A captura correspondente aos bytes finais existe no acervo desta errata (`rev_c/V322C-01-home-1920x1080.png`) e está no pacote externo. |
| R-2 | O foco ao abrir o editor repousa no primeiro `<summary>`, não no primeiro `<select>`. | comportamento herdado da errata anterior (§16.13.2), preservado aqui. | é consequência direta e desejada de os seis grupos nascerem recolhidos; com tudo recolhido o `select` não é renderizado. Verificado por `V322C-FOC1`/F5 e por `V322-CTXPAR1`. |
| R-3 | Um único motor exercitado: Chromium. Firefox, WebKit e navegadores móveis reais não foram executados. | achados de foco e de layout podem variar nesses motores. | mesma limitação declarada pelo parecer REV B (§1.3.1); o público-alvo declarado usa desktop com Chromium/Edge. `test:visual` e os gates novos rodam no motor canônico da fase. |
| R-4 | Sem leitor de tela real (NVDA/JAWS/VoiceOver). | conclusões de tecnologia assistiva permanecem inferidas da árvore de acessibilidade e da semântica ARIA. | limitação de ambiente, declarada; nenhuma asserção desta rodada depende de leitor de tela. |
| R-5 | Docker/Tailscale indisponíveis nesta distro WSL. | nenhum container, volume, Serve ou Funnel foi criado, alterado, reiniciado ou parado. | fora do escopo por proibição expressa da §13. |

### Backlog aceito — não bloqueia esta entrega

| achado | severidade REV B | impacto | prioridade sugerida | motivo de não bloqueio |
|---|---|---|---|---|
| `M-03` wrapper morto de `buildPrintReport()` | MÉDIO | o PDF entregue ao cliente está **correto** (verificado em 9 PDFs pelo próprio parecer); o defeito é de verificabilidade e de consistência de comentário | P2 | corrigi-lo exige expor a função pela ponte `__V32UI`/`__DEV` **dentro de `ui_v32.js`**, arquivo protegido pela §3.2. Fora da boundary desta errata. Já registrado como dívida na §16.13.1 |
| `M-04` foco e cabeçalhos do questionário | MÉDIO | o foco volta a `<body>` a cada transição e o enunciado não é cabeçalho; o questionário **permanece completável por teclado** (1–5 / `Enter` / `←` são globais) | P2 | reestruturação ampla de cabeçalhos e foco do questionário; a §6 a exclui explicitamente |
| `L-01` numeração de seções salta o "4" com o gate aberto | BAIXO | sumário com buraco; o trilho lateral não numera, logo não há contradição | P3 | cosmético |
| `L-02` subgrupos `sig-N` não preservam o estado aberto | BAIXO | os **seis grupos principais** — objeto da errata anterior — preservam corretamente | P3 | afeta subgrupo, não grupo |
| `L-03` `aria-controls="notetxt"` órfão com a evidência fechada | BAIXO | `aria-expanded` está correto nos dois estados | P3 | único IDREF órfão em 7 telas |
| `L-04` alvos `(i)` de 22×22 px | BAIXO | 2 px abaixo do mínimo do SC 2.5.8; a exceção de espaçamento é satisfeita nos cabeçalhos de grupo | P3 | decisão de design com consequência normativa; deixada explícita para o proprietário |
| `L-05` `svg.p52-emblem` com `role="img"` contendo controles focáveis | BAIXO | funciona no Chromium; outros motores/AT podem não expor a subárvore | P3 | sem leitor de tela real, o impacto não é afirmável |
| `L-06` redundância textual (capa e cinco "Página oficial ↗") | BAIXO | sugestão de produto | P3 | não é defeito |
| `L-07` `#v32-print-report` retém ~29 KB após `afterprint` | BAIXO | não vaza para a tela nem para o papel; `preparePrint()` reconstrói a cada impressão | P3 | dívida de estado residual |
| `L-08` `heading-order` na tela de resultados | BAIXO | best-practice do axe, `moderate` | P3 | editorial |
| §12.2 riscos arquiteturais (6 itens) | — | handler global de teclado, reparentamento pós-render, wrappers por alcance léxico, numeração por catálogo, especificidade entre camadas, `#v32-print-report` persistente | fase própria | dívida arquitetural; a §6 veda usar esta rodada para hardening geral. **Nota:** os itens 1 e 2 foram *mitigados* nesta errata — o teclado passou a decidir por "o alvo trata a própria tecla" e o reparentamento passou a preservar foco —, mas o *padrão* permanece |
| documentação de operação por teclado no `USER_GUIDE.md` | — | o manual não tem seção de teclado; nenhuma alegação sua ficou falsa | P3 | a §10.6 autoriza atualizar o guia **somente se a instrução operacional ao usuário tiver mudado**, e ela não mudou: nada no manual prometia o comportamento defeituoso |

### Não executado nesta rodada — declarado, nunca presumido

- **Campanha integral dos 96 mutantes existentes**: executada a seleção dirigida autorizada pela §8
  (todos os 11 novos + os existentes que atingem os caminhos modificados). A campanha integral não
  foi executada e **não está sendo reportada como executada**.
- **Autoauditoria independente**: proibida pela §13 e não realizada.
- **Firefox, WebKit, navegador móvel real, leitor de tela real, toque com hardware**: não executados.
- **Produção, Docker, Tailscale, porta 1337, tag, release, deployment**: não tocados.

## 17.13 · Pacote externo REV C (§11)

Montado a partir dos bytes finais, **fora do repositório**, na mesma convenção do pacote anterior. O
pacote **REV B não foi apagado** e continua sendo o parecer de referência dos achados.

Conteúdo mínimo exigido pela §11, todos presentes: HTML autocontido da candidata, README curto do
pacote, `USER_GUIDE.md`, relatório da implementação/errata, auditoria externa REV B, evidências
dirigidas desta errata, manifesto interno e instrução curta e inequívoca para a reauditoria.

```text
nome      QUICKSCAN_V3_2_2_INDEPENDENT_ANALYST_REVIEW_PACKAGE_2026-08-25_REV_C.zip
conteúdo  24 arquivos · MANIFEST_SHA256.txt com 23 entradas
manifesto interno: sha256sum -c → 23 OK, 0 falhas
          (verificado a partir do ZIP EXTRAÍDO, não do diretório de montagem)
HTML do pacote = HTML da candidata:
          913440adc157e850e100c98a706ad6e6793e3556981bb78a4736500cd1c02879 · 1.014.061 bytes
local     /mnt/c/Projetos/QuickScan-SOC-CMM/   (fora do clone, mesma convenção do pacote anterior)
```

O **SHA-256 e o tamanho do próprio ZIP** são publicados no sidecar `...REV_C.zip.sha256` e no
`docs_phase5/MANIFEST_V3_2_2.sha256`, e não aqui: este relatório está DENTRO do pacote, e um
documento contido no pacote não pode carregar o hash do pacote que o contém sem se tornar
circular. A cópia do relatório dentro do ZIP é byte-idêntica a esta.

O `README.md` do pacote é próprio e curto; o `PROMPT_REAUDITORIA_ESTREITA_REV_C.md` carrega, literal,
o texto de escopo exigido pela §11 — reauditoria estreita e única, `PASS COM RESSALVAS NÃO
BLOQUEANTES` elegível para integração, e a lista fechada do que pode bloquear.

O pacote **não contém** sessão real, PDF de cliente, dado de assessment, credencial ou qualquer
configuração de rede, produção ou publicação.

## 17.14 · Parada

**Nenhum commit, push, PR, merge, tag, GitHub Release, deployment, promoção ou substituição de
produção foi executado.** A produção v3.2.1 não pertence ao escopo desta errata e não foi tocada;
nenhum container, volume, Serve, Funnel ou porta foi criado, alterado, reiniciado ou parado — Docker
e Tailscale não estão disponíveis nesta distro WSL, e a limitação é declarada como estado
operacional. Nenhuma dependência nova foi instalada. Nenhuma limpeza destrutiva do worktree foi
feita, nenhum `git add .` foi executado e `AGENTS.md` não foi lido para edição, alterado nem
excluído.

A v3.2.2 **NÃO** está declarada aprovada, congelada ou promovida. O pacote externo REV B está
**SUPERADO** como candidata corrente — o HTML mudou de `332631223e40cfea…` para `913440adc157e850…` —
mas permanece válido e preservado como parecer.

Próximo passo, em sessão separada e sem participação de quem implementou: **uma única reauditoria
independente estreita** sobre o pacote REV C.
