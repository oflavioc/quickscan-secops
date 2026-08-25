# Parecer de reauditoria independente — Quickscan SecOps · SOC-CMM · candidata v3.2.2 · pacote REV C

**Data:** 2026-08-25 · **Escopo:** reauditoria estreita e única, conforme `PROMPT_REAUDITORIA_ESTREITA_REV_C.md`
**Natureza:** parecer independente. O auditor não participou da implementação, dos gates, dos mutantes,
da errata final nem da auditoria REV B.
**Entrega:** fora do repositório. Nenhum commit, push, PR, merge, tag, release ou deployment executado.
Nenhuma correção implementada. A árvore original não foi alterada; toda execução com escrita ocorreu
em cópia temporária.

---

## VEREDITO

> ## PASS COM RESSALVAS NÃO BLOQUEANTES — elegível para integração

Nenhuma perda de estado, ação incorreta, corrupção de cálculo, bloqueio material do relatório/PDF,
violação canônica ou regressão material reproduzível foi encontrada no escopo desta rodada.
As ressalvas registradas na §7 são de ergonomia e dívida arquitetural e **não reabrem o ciclo**.

---

## 1 · Preflight de identidade — CONFORME

| item | exigido | medido | resultado |
|---|---|---|---|
| SHA-256 do ZIP | `1c02aafc3cb5e6091c84c5b4d75d96918d5deecf96178de3a296cdfff7a1419e` | idêntico | **OK** |
| bytes do ZIP | 1.000.634 | 1.000.634 | **OK** |
| sidecar `.zip.sha256` | confere | confere | **OK** |
| entradas | 24 arquivos | 24 arquivos | **OK** |
| manifesto interno | 23/23 OK | 23/23 `OK` via `sha256sum -c` | **OK** |
| candidata sob revisão | `quickscan_secops_soccmm_v3_2_2_candidate.html` | `913440adc157e850e100c98a706ad6e6793e3556981bb78a4736500cd1c02879` · 1.014.061 bytes · 12.918 linhas · UTF-8 sem BOM · LF | **OK** |
| prompt executado | `a4d95d64c6ba22427154a787430c35bf5d9df3719e112361746796b0fdcc8515` · 5.357 bytes | idêntico; 98 linhas terminadas em LF, UTF-8 sem BOM, lido integralmente até EOF | **OK** |

**Nota de precisão de identidade (não é achado).** O prompt declara 99 linhas; o arquivo tem 5.357 bytes
com 98 terminadores LF e último byte `0x0A`. São 98 linhas de conteúdo. A diferença é critério de
contagem (a linha vazia após o LF final), não divergência de conteúdo: o SHA-256 confere exatamente.

**Cadeia de evidência fechada.** A candidata é **byte-idêntica** ao artefato sob o qual as suítes
congeladas foram executadas (`quickscan_secops_soccmm_v3_2_dev.html`, mesmo SHA-256 e mesmos
1.014.061 bytes). Sem isso, os logs `V322C-test-all.log` e `V322C-test-visual.log` não poderiam ser
atribuídos à candidata. Com isso, podem.

---

## 2 · B-01 e A-01 · semântica de `Enter` — CONFORME (12/12)

Método: para cada caso, duas execuções em contextos de navegador independentes e recém-carregados —
uma com `element.click()`, outra com `element.focus()` + `Enter` real de teclado. Oráculo por **estado
canônico e tela resultante**: `__DEV.captureCanonicalInputs()`, `__DEV._stateJSON()`,
`body[data-uxscreen]`, número da pergunta, vivacidade do editor e vivacidade do `draft`.
Nunca por texto ou presença de nó. Chromium do Playwright, `file://`, sem rede.

| caso | exigido | medido | resultado |
|---|---|---|---|
| K1 | `Enter` em **Adicionar contexto tecnológico** abre o editor; não inicia o questionário | `home → ctxeditor`; editor vivo; questionário não iniciado; **idêntico ao clique** | **PASS** |
| K2 | `Enter` no select **Situação declarada**: editor permanece; tela e estado não mudam | `ctxeditor → ctxeditor`; canônico e `_stateJSON` inalterados; editor vivo | **PASS** |
| K3 | `Enter` em **Salvar contexto** (HOME): grava; draft limpo; sem bloqueio órfão | `ctxeditor → home`; canônico alterado (gravou); `draft` morto; `safePrint()` → `true` com `window.print` nativo chamado; **idêntico ao clique** | **PASS** |
| K4 | `Enter` em **Cancelar**: draft limpo; estado canônico salvo preservado | `ctxeditor → home`; canônico **inalterado**; `draft` morto; **idêntico ao clique** | **PASS** |
| K5 | `Enter` em **Importar sessão**: executa a ação; não inicia o questionário | seletor de sessão aberto **1 vez** por `Enter` e **1 vez** por clique (ação positiva, não no-op); tela permanece `home` | **PASS** |
| K6 | `Enter` em **← Voltar**: volta exatamente uma pergunta; nunca avança | pergunta 4 → 3; **idêntico ao clique** | **PASS** |
| K7 | `Enter` em **Adicionar evidência ou observação**: abre/fecha; não muda de pergunta | caixa alterna; pergunta 3 → 3; **idêntico ao clique** | **PASS** |
| K8 | idem K3 pela entrada dos **RESULTADOS**: paridade com a home | `results → results`; gravou; `draft` morto; editor fechado; **idêntico ao clique** | **PASS** |
| K9 | `Enter` num card de resposta: seleciona | resposta gravada no canônico; pergunta inalterada; **idêntico ao clique** | **PASS** |
| K10 | `Enter` com foco **fora** de controle, numa pergunta: continua avançando | pergunta 3 → 4. Diverge do clique — **corretamente**: clique em `body` é no-op, `Enter` é o atalho global, que **permanece vivo** | **PASS** |
| K11 | `Enter` em **← Voltar** nas prioridades: volta ao questionário; nunca publica | `priority → question` (pergunta 16); resultados **não** publicados; **idêntico ao clique** | **PASS** |
| K12 | `Enter` com foco fora de controle, **no editor aberto pela home**: não inicia o scan; nenhum draft órfão | `ctxeditor → ctxeditor`; editor vivo; nenhum draft órfão | **PASS** |

### 2.1 · Prova de que a correção é a causa do PASS (mutante independente)

Para não aceitar um PASS por coincidência, executei um mutante próprio: neutralizei
`KeyboardEvent.prototype.stopPropagation`, o que desarma o guard de `<html>` sem tocar em mais nada.

| | mutante (guard desarmado) | controle (candidata intacta) |
|---|---|---|
| tela após `Enter` em Salvar | `ctxeditor → **arq**` | `ctxeditor → home` |
| editor | destruído | fechado corretamente |
| contexto declarado | **descartado** (canônico inalterado) | **gravado** |
| `draft` | **vivo e órfão** | morto |
| `safePrint()` | **`false`**, `window.print` nativo **nunca chamado** | `true`, `print` chamado |

O mutante reproduz **B-01 integralmente**, inclusive o bloqueio do relatório/PDF. A candidata intacta
não o reproduz. O guard é *load-bearing* e o BLOCKER está fechado.

### 2.2 · Análise do mecanismo (leitura de código, independente do teste)

Enumerei **todos** os registros de teclado do artefato: `document` em bolha (o handler congelado, único
afetado), `document` em **captura** (guarda numérica do refinamento — roda antes, intacta), `document`
em bolha **somente `Escape`** (irrelevante para `Enter`), e três de **elemento** (rodam antes de
`<html>`, intactos). **Não há ouvinte de teclado em `window`.** A afirmação de que o único ouvinte
suprimido é o global congelado **confere com o artefato**. `stopPropagation` não é `preventDefault`:
a ativação nativa de `<button>`, `<select>` e `<a href>` é preservada — confirmado empiricamente em
K1–K12, F1, F2 e F3.

### 2.3 · Bateria adversarial (7 casos, todos limpos)

`Enter` fora de controle na home real → inicia o questionário (atalho preservado; motivo do guard
`null`, ou seja, não blindado) · idem com contexto já salvo → inicia · `Espaço` em card `.opt` →
seleciona · `Escape` → ainda fecha modal · `Ctrl+Enter` → corretamente blindado (`modificador`),
não inicia · 10× `Enter` em `<summary>` → editor vivo, sem draft órfão, `errors: 0`, sem degradação ·
`Enter` em aba de resultados → troca de aba. Adicionalmente: `Enter` em `<textarea>` de observação
insere quebra de linha e não muda de pergunta; `Enter` em campo de texto do editor preserva o valor,
não salva prematuramente e não destrói a tela.

---

## 3 · A-02 · preservação de foco — CONFORME (5/5)

Medido **depois** do checkpoint de microtarefas (espera real pós-repintura), não no instante síncrono.

| exigido | medido | resultado |
|---|---|---|
| alterar **Situação declarada** → foco no mesmo select, nunca em `<body>` | foco em `#v32-pres-knowledge-management` | **PASS** |
| **adicionar** tecnologia → foco previsível e próximo da ação, dentro do editor | foco em `#v32-sol-knowledge-management-0-vendor` (o campo recém-criado) | **PASS** |
| **remover** tecnologia → idem | foco em `#v32-add-knowledge-management` (a ação adjacente) | **PASS** |
| **trocar bundle** → foco e **posição de rolagem** preservados | foco no rádio de bundle, dentro do editor; `scrollY` **1362 → 1362**, delta **0 px** | **PASS** |
| nenhuma restauração de foco em tela já fechada por Salvar/Cancelar | após ambos, foco em `<body>` da home; **nenhuma** tentativa de restaurar para nó removido | **PASS** |
| nenhum loop observador/render/foco | **0 mutações** em 2 s de repouso; `__P52.diag().errors = 0` | **PASS** |

---

## 4 · Melhorias oportunistas — CONFORME (3/3)

**M-01 · reflow do editor.** Com **todos** os `<details>` expandidos, em 320/360/384/390/430 px CSS:
`scrollWidth == clientWidth` em todas as larguras e **zero** caixas além da largura do documento sem
ancestral rolável alcançável. Oráculo próprio, por geometria (`getBoundingClientRect` + varredura de
`overflow-x` ancestral), independente da implementação.

**M-02 · `id="v32errors"` único.** Contagem por `document.querySelectorAll('[id="v32errors"]')`:
home sem editor **0**; **entrada HOME** com editor aberto **1**; **entrada RESULTADOS** com editor
aberto **1**. Em ambas as entradas a região de erro está **dentro** do editor e é o **irmão
imediatamente anterior** a `.v32-actions` (Salvar/Cancelar).

**M-05 · contraste.** **Recalculado por implementação própria** da fórmula WCAG 2.x (linearização
sRGB, luminância relativa 0,2126/0,7152/0,0722, composição alfa sobre a pilha de fundos resolvida):

| controle | cor / fundo efetivo | razão medida | limiar | resultado |
|---|---|---|---|---|
| `#ux-addctx` (home) | `rgb(255,255,255)` sobre `rgb(43,114,203)` · 15 px / 600 | **4,803 : 1** | 4,5 : 1 | **PASS** |
| `#next` (prioridades) | `rgb(245,65,51)` sobre `rgb(11,11,12)` · 14 px / 600 | **5,327 : 1** | 4,5 : 1 | **PASS** |

Coerente com o RED do pacote (3,99:1 e 4,04:1 antes da correção).

---

## 5 · Smoke dos invariantes canônicos — CONFORME (5/5)

**UNSET ≠ NA ≠ 0.** Os três estados são estruturalmente distintos no snapshot do motor:
UNSET → `{score:null, n:0, nNA:0}` · NA → `{score:null, n:0, nNA:3}` · L0 → `{score:0, n:3, nNA:0}`.
**UNSET nunca renderiza como zero**; no papel os domínios sem evidência saem como `n/d`, com a nota
explícita "n/d significa não avaliado — nunca zero".

**Tecnologia não altera score, estágio, suficiência ou gap.** Declarando **toda** a paisagem
tecnológica (22 capabilities `PRESENT` com solução, arquitetura, FortiGate com bundle Enterprise e
**todos** os sinais ligados), permanecem **byte-idênticos**: `legacySnapshot()`, `stagesView()` e
`tgtCurrentProfile()`. O **único** campo da narrativa que muda é `technologyContext`
(`informed: false → true` + classificações) — contexto descritivo, que não é score, estágio,
suficiência nem gap. Invariante preservada.

**Current insuficiente não publica Target — em tela e no papel.** Com alvo **efetivamente declarado**
(`setTarget` aceito em todas as práticas):

| respostas | `suff` | overall | papel | tela |
|---|---|---|---|---|
| 5 | `false` | `null` | seção `#pr-nopub` presente; "Atual · n/d", "Cenário-alvo · n/d"; "A comparação será apresentada quando o perfil atual tiver evidência suficiente" | "Evidência e suficiência — **pendente**" |
| 9 | `false` | `null` | idem | idem |
| 10 | `false` | `null` | idem (regra por domínio ≥2 ainda não satisfeita) | idem |
| 15 | `true` | 1.7 | `#pr-nopub` **ausente**; comparação publicada com deltas por domínio | publicada |

O gate canônico (≥10 confirmadas **e** ≥2 por domínio) governa a publicação **dos dois lados**.

**Nenhum draft impede o PDF sem caminho visível de recuperação.** Sem draft, `window.print` nativo é
chamado. Com draft, o bloqueio ocorre — e é **legítimo, visível e recuperável**: mensagem
"Salve ou cancele as alterações do contexto tecnológico antes de gerar o relatório." renderizada e
**visível** (geometria e estilo computado verificados), com **Salvar** e **Cancelar** ambos visíveis
na tela. Após Salvar, a impressão volta a funcionar.

**Sessão exporta/importa somente estado canônico e recomputa derivados.** O documento exportado
contém apenas `createdAt`, `engineSha256`, `format`, `inputs`, `label`, `schemaVersion`,
`toolVersion`, com `inputs` = `{assessment, operationalRefinement, priorities, targetProfile,
technologyLandscape}`. Varredura por chaves de derivado (score/overall/stage/findings/gaps/narrative/
recommend/radar/heat/suff): **nenhum vazamento**. Round-trip em contexto novo: `legacySnapshot()`,
`captureCanonicalInputs()` e a narrativa **idênticos**. O relatório impresso diverge em **2 de 514**
linhas textuais — o rótulo da data ("Data da sessão" → "Sessão registrada em", semanticamente correto
para sessão importada) e o timestamp, com **1 segundo** de diferença. As 512 linhas restantes,
inclusive todo o conteúdo calculado, são idênticas. O validador ainda recusou corretamente um
documento com enum inválido que fabriquei (`status: "PRODUCTION"` fora de `solutionStatus`).

---

## 6 · Ausência de bloqueio órfão do relatório/PDF — CONFORME

Consolidando §2 (K3, K4, K8, K12), §2.1 e §5: em **nenhum** caminho por teclado a candidata deixa
`draft` vivo sem editor na tela. O único bloqueio observado é o **legítimo** — draft aberto de
verdade, com editor visível e Salvar/Cancelar acessíveis. O mutante prova que o bloqueio órfão existia
antes e que a correção o elimina.

---

## 7 · Ressalvas não bloqueantes e backlog

Nenhuma destas impede a integração. Nenhuma reabre o ciclo.

**R1 · Ergonomia de teclado após Salvar/Cancelar na home.** O foco vai para `<body>`, e não para um
controle significativo (p.ex. "Editar contexto" ou "Começar o quickscan"). Não é violação de A-02:
o exigido era **não** restaurar foco em tela já fechada, e isso é cumprido. Também não é regressão —
o clique se comporta igual, e o caminho é o `render()` da camada congelada. Um operador por teclado
precisa reiniciar a navegação por Tab a partir do topo. Vizinho de M-04. **Backlog.**

**R2 · Dívida arquitetural — supressão de propagação em `<html>`.** Quando o guard blinda um `Enter`,
`stopPropagation()` impede que o evento alcance `document`. Hoje isso é seguro, e eu confirmei por
enumeração exaustiva. Mas qualquer ouvinte de `keydown`/`Enter` registrado em `document` (em bolha)
ou em `window` por uma fase futura ficará **silenciosamente morto**, sem erro e sem sintoma
diagnosticável. A escolha está bem justificada no código e é a única disponível dentro da change
boundary; o risco é de **manutenção futura**, não de uso atual. Recomendo um gate de regressão que
falhe se um novo ouvinte de `Enter` em `document`/`window` for introduzido. **Backlog.**

**R3 · Acoplamento de `p52RealHome()` ao id literal `#start`.** A prova de "home de fato" depende da
presença de `#start`, id da camada congelada. Renomeá-lo mataria o atalho `Enter → começar` sem
qualquer erro visível. **Backlog.**

**R4 · Cobertura de campanha mutante.** A campanha dirigida (29/29) é adequada ao escopo estreito. O
pacote declara explicitamente que a **campanha integral de 96 mutantes NÃO foi executada** — declaração
honesta e conforme a disciplina evidence-first. Registro que a primeira execução foi **27/29**, com dois
mutantes no-op, e que a remediação **fortaleceu** o gate (passou a medir qual cláusula está em vigor por
classe de controle) em vez de enfraquecê-lo. Verifiquei o diagnóstico e concordo com a classificação.
**Registrado, não bloqueia.**

---

## 8 · O que NÃO foi executado — declaração explícita

Nada abaixo recebeu PASS. Não atribuo PASS a verificação não realizada.

1. **Não reexecutei** `npm run test:all`, `npm run test:visual`, `npm run test:session` nem o harness
   M41. Motivo: escrevem na árvore original, cuja alteração o proprietário vedou. **Revisei os logs do
   pacote** e confirmo que as contagens batem com o baseline congelado (engine 105 · UI 19+25+11+23+26 ·
   UX 56 · Target 30 · Ref 28 · Journey 31 · Icons 12 · Session 97 · P50 64+27 · P52 45+55 · visual
   67 passed / 0 failed / 37 skipped), que o SHA-256 do payload funcional canonicalizado do M41 é
   `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` — **igual ao baseline congelado** —
   e que a candidata é byte-idêntica ao artefato testado. Isso sustenta a **atribuição** dos logs, não
   substitui reexecução independente.
2. **Não executei** a campanha integral de 96 mutantes (o próprio pacote a declara não executada).
3. **Não auditei** M-03, M-04, L-01…L-08, refatoração do monólito, arquitetura do editor, motor de
   recomendações, telemetria, rede, persistência, schema novo, produção/Docker/release — fora do escopo
   por decisão expressa do proprietário.
4. **Não repeti** a auditoria integral da REV B. Não encontrei sinal concreto de regressão material que
   a justificasse.
5. **Não testei** com tecnologia assistiva real (leitor de tela), nem em Firefox, WebKit, Chrome/Edge
   de produção. Toda a execução se deu no Chromium empacotado do Playwright, em Linux/WSL2.
6. **Não gerei PDF real.** `window.print` foi instrumentado para observar invocação e bloqueio; a
   fidelidade tipográfica da saída impressa não foi avaliada nesta rodada.
7. **Não validei** as afirmações do parecer REV B além dos seis achados em escopo.

---

## 9 · Conclusão

O defeito material de teclado que motivou o FAIL da REV B está **fechado**, com causa compreendida,
correção no único ponto legítimo dentro da change boundary, e **prova por mutante independente** de que
a correção — e não o acaso — produz o resultado. A-01, A-02, M-01, M-02 e M-05 estão corrigidos e
verificados por oráculos independentes da implementação. Os invariantes canônicos permanecem íntegros:
UNSET ≠ NA ≠ 0, tecnologia não move o score, o gate de suficiência governa a publicação do Target em
tela e no papel, e a sessão exporta apenas estado canônico recomputando os derivados.

Não há risco material conhecido no uso proposto — avaliação conduzida por times de contas Fortinet, em
desktop e por teclado, com entrega de relatório/PDF ao cliente.

**PASS COM RESSALVAS NÃO BLOQUEANTES — elegível para integração.**
As ressalvas R1–R4 devem ser registradas como backlog aceito e não reabrem o ciclo.

Este parecer não promove, não congela e não declara fase concluída. Essa decisão é do proprietário.
