# AUDITORIA ORIENTADA A RISCO — MICROFASE 5.0.5 E FECHAMENTO DA PHASE 5.0

Instrução executada: `AUDITORIA_RISCO_FECHAMENTO_PHASE_5_0.md` · SHA-256
`2e269bb6d6f2bd94b0a57f45711ded4982dcdc0d6b8bbfe68a1573bd6e17b5bb` · 14.782 bytes · 380 linhas ·
UTF-8 sem BOM · zero CRLF — identidade conferida antes de qualquer leitura do repositório.

Repositório auditado: `/mnt/c/Projetos/QuickScan-SOC-CMM/phase5`
Data da execução: 2026-08-21 · Node v22.23.2 · Python 3.14.4 · Playwright 1.62.1 ·
Chromium 151.0.7922.34 (Linux/WSL2)

---

## 0 · RESSALVA DE PROVENIÊNCIA — LEIA ANTES DO VEREDITO

A §0 da instrução exige que a sessão auditora **não** tenha participado da implementação da 5.0.5.
**Essa precondição não foi satisfeita:** esta mesma sessão produziu a candidata e as correções que a
compõem. Registro o fato por dever de honestidade, e não o omito nem o contorno.

O que fiz para mitigar, dentro do que é mitigável:

- **não** reutilizei nenhum harness, fixture (`fixtures_p50.js`) ou artefato do implementador como
  prova — escrevi cinco oráculos novos (`aud_state.js`, `aud_resp.js`, `aud_kbd.js`, `aud_axe.js`,
  `aud_print3.js`, `aud_smoke.js`) com aritmética própria;
- reimplementei a aritmética de suficiência e de score a partir da definição **congelada** da
  Camada 1 (`confirmedCount`, `domStat`, `dataSufficiency`), lida diretamente do source protegido;
- construí cenários próprios, não as fixtures entregues;
- tratei todo número do relatório do implementador como alegação a reproduzir.

**O que essa mitigação não cobre:** viés de ponto cego é justamente aquilo que o autor não enxerga.
Um defeito que eu não concebi como hipótese ao implementar tende a permanecer não concebido ao
auditar. **Recomendo ao proprietário tratar este parecer como verificação técnica reproduzível, não
como a auditoria independente exigida pelo protocolo**, e obter uma segunda leitura por sessão/agente
que não tenha tocado a candidata antes de decidir a selagem. Todos os scripts e resultados estão em
`/tmp/.../scratchpad/audit/` e são reexecutáveis por terceiro.

---

## 1 · Preflight — CONFERE INTEGRALMENTE

| item | esperado | observado |
|---|---|---|
| branch | `feat/phase5-5-0-5` | idem |
| HEAD | `3b8d76be8b07b78549b93d38758e9677b51dd8fa` | idem |
| merge-base com `main` | `3b8d76be…` | idem |
| commits sobre `main` | 0 | 0 |
| staged | 0 | 0 |
| delta total | 57 caminhos | 57 |
| modificados rastreados | 10 | 10 |
| novos não rastreados | 47 | 47 |
| tags | 0 | 0 · `git stash list` = 0 |
| HTML | `c40d9735…efce09f` | idem · **698.613 bytes** (bate) |
| `engine_v32.js` | `9a4a2e67…2bb5d247a` | idem |
| payload M41 | `9794b267…3ed4365b` | idem (reexecutado) |
| manifesto | `024d6130…62d702` · 111/111 | idem · 111 linhas de dados, **zero duplicata**, **zero autorreferência**, `sha256sum -c` integral |
| relatório 5.0.5 | `f440ba36…a0d29211` | idem |
| `package.json` | `1c8d844d…64304c7` | idem |
| `package-lock.json` | `abe535af…ca24f75f` | idem |
| `tests_p50_core.js` | `b2b8b01f…709c38b8` | idem |
| `tests_p50_chromium.js` | `d06860c7…d52f3294a4` | idem |
| `tests_p50_mutants.js` | `28f2e876…c067ddf5` | idem |

Verificações adicionais exigidas pela §1:

- `@axe-core/playwright` está em `package.json` **e** no lockfile exatamente como `4.13.0` (sem `^`,
  `~` ou faixa); `dev: true` no lockfile e presente **apenas** em `devDependencies`; a transitiva
  `axe-core@4.13.0` também `dev: true`. `integrity` do pacote confere com o declarado na spec §25.7.
- `package.json.version` (`3.4.0-dev.4.8.0.7`) intocado; 21 scripts, nenhum alterado; nenhuma
  dependência de runtime acrescentada (`dependencies` continua só `jsdom@30.0.1`).
- **zero bytes de axe no HTML construído**: `axe-core`, `axeCore`, `AxeBuilder` e `@axe-core` têm 0
  ocorrências. (As únicas subcadeias "axe" no HTML são as palavras inglesas `axes`/`axed`.)
- **artefatos 5.0.1–5.0.4 inalterados**: as 36 evidências históricas conferem byte a byte contra o
  manifesto do commit auditado (`git show HEAD:…MANIFEST_PHASE5_P50.sha256`).
- **protegidos intactos**: 24 arquivos verificados contra `HEAD` — engine, Camada 1, `ui_v32.js`,
  `ui_ux_v32.js`, `ui_target_v32.js`, `ui_refinement_v32.js`, `ui_journey_v32.js`,
  `ui_session_v32.js`, `ui_icons_v32.js`, `ui_v32.css`, `ui_ux_v32.css`, `generate_icons_v32.py`,
  `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json`, `tests_unset_ug.js`,
  `build_v32_html.py`, `fixtures_p50.js`, `tests_p50_mutants.js`, `MANIFEST.sha256`,
  `playwright.config.js` e os quatro arquivos de `tests_visual/` — **todos byte-idênticos**.
- **nenhum trabalho posterior à Phase 5.0**: busca por `frameworkMapping`, `nist-csf`, `cisControls`,
  `autosave`, `Modelo 2`, `questionSet`, `actionTracker`, `kpiSuite`, `accreditation`, `cloudSync`,
  `vault`, `telemetryClient` → **0 ocorrências** nos módulos novos e no HTML.
  `SESSION_SCHEMA_VERSION = 1` preservado. Zero referência a estimativa de tempo (UI-010, DL-5).
  A única ocorrência de `deep-dive` no HTML é texto congelado, presente também na baseline.

Nenhuma identidade material divergiu. Nada foi normalizado, revertido ou descartado.

---

## 2 · Preservação da árvore original — **INTACTA**

1. Inventário **pré**: 309 arquivos (excluídos `.git` e `node_modules`), por caminho, tamanho e
   SHA-256.
2. Três cópias temporárias completas (`treeA`, `treeB`, `treeC`), cada uma incluindo `.git`,
   rastreados modificados e não rastreados.
3. **Toda** execução — regressão, rebuilds, mutantes, oráculos, regeneração de evidência — ocorreu
   exclusivamente nas cópias.
4. Inventário **pós**: 309 arquivos.

```text
sha256 do inventário ordenado (pré)   317805a0dce5b6c8b590d2e7c1e8869d37d98d5493ea3058cbb32fdbcaba8be5
sha256 do inventário ordenado (pós)   317805a0dce5b6c8b590d2e7c1e8869d37d98d5493ea3058cbb32fdbcaba8be5
tamanhos pré x pós                    idênticos
git pós                               branch/HEAD/0 commits/0 tags/0 staged/57 delta/0 stash
```

**A árvore original permaneceu byte a byte idêntica.**

---

## 3 · Boundary e builds — CONFERE

Delta contra `HEAD`, rastreados modificados (10): `ui_p50_shell_v32.js`, `ui_p50_suff_v32.js`,
`ui_p50_results_v32.js`, `ui_p50_v32.css`, `tests_p50_core.js`, `tests_p50_chromium.js`,
`package.json`, `package-lock.json`, `quickscan_secops_soccmm_v3_2_dev.html`,
`docs_phase5/MANIFEST_PHASE5_P50.sha256`.

Novos (47): `docs_phase5/MICROFASE_5_0_5_REPORT.md` · 28 × `P50-5.0.5-*` · 12 × `P50-ACC1-axe-*` ·
1 × `P50-ACC4-contrast.json` · 4 × `P50-VIS5-focus-*` · 1 × `P50-geometry.json`.

**Zero arquivos fora da lista autorizada pela §4.** O diff de `package.json` é uma única linha
acrescentada; o de `package-lock.json` são apenas os dois blocos da dependência aprovada e sua
transitiva — nenhuma outra entrada, nenhum script, nenhuma versão de aplicação, nenhuma dependência
de runtime.

Rebuild em **duas árvores independentes**, ambas com o HTML previamente removido:

```text
Build A (treeA)   c40d97358beaf52f286209b93143f74f4665011a1229f65015c2e6561efce09f
Build B (treeB)   c40d97358beaf52f286209b93143f74f4665011a1229f65015c2e6561efce09f
HTML candidato    c40d97358beaf52f286209b93143f74f4665011a1229f65015c2e6561efce09f
engine            9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a  (inalterado)
payload M41       9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b  (inalterado)
```

`build_v32_html.py` byte-idêntico ao `HEAD` — o build determinístico não dependeu de edição do
builder.

---

## 4 · Regressão executável (cópia temporária `treeA`) — CONFERE

Exit code próprio por comando: `npm ci --engine-strict` = 0 · `npm run test:all` = 0 ·
`npm run test:visual` = 0.

| suíte | exigido | observado |
|---|---|---|
| engine / MATRIZ | 105 | **105 PASS · 0 FAIL** |
| UI 3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | 19+25+11+23+26 | **19 · 25 · 11 · 23 · 26**, 0 FAIL |
| UX 4.1 | 56 | **56 PASS · 0 FAIL** |
| TARGET 4.3.1 | 30 | **30 PASS · 0 FAIL** |
| REF 4.4 | 28 | **28 PASS · 0 FAIL** |
| JOURNEY 4.5 | 31 | **31 PASS · 0 FAIL** |
| ICONS 4.6 | 12 | **12 PASS · 0 FAIL** |
| SESSION 4.8 | 97/97 | **97 PASS · 0 FAIL** |
| UG | 13/13, UG13 em Chromium real | **13 PASS · 0 FAIL · UG13 PASS**, não SKIP |
| M41 | PASS + payload | **PASS · `9794b267…`** |
| P50 CORE | 38/38 | **38 PASS · 0 FAIL** |
| P50 Chromium | 24/24, zero SKIP | **24 PASS · 0 FAIL · 0 linhas `SKIP`** |
| visual | 67 / 0 / 37 | **67 passed · 0 failed · 37 skipped** |
| print | 23/23 + agregação P50-VIS10 | **23/23**; VIS10 reexecuta de fato UI 3.3.2 (23/23, P1–P11 PASS), `print.spec` (7 executados / 0 falhas / 21 skips de recorte de projeto, soma 28 = 7×4) e UG4/UG6/UG9 PASS |

Nenhum PASS foi atribuído a timeout, processo interrompido, ausência de browser ou SKIP. Os 37 skips
do `test:visual` e os 21 de `print.spec` são **recorte de projeto declarado pelas próprias suítes
congeladas** (`test.skip(project.name !== 'd1440')`), não gates não executados — verifiquei a origem
no source protegido.

A campanha histórica de mutação (53/53) não foi reexecutada por mim: a §6.5 dispensa-a
explicitamente quando os quatro ensaios independentes são demonstrados (§6 abaixo). Verifiquei, ainda
assim, a consistência interna do artefato entregue: `detected = total = 53`, 53 ids únicos, exit 0,
`tests_p50_mutants.js` byte-idêntico ao `HEAD`, e **os hashes das fontes sob mutação declarados no
artefato coincidem exatamente com as fontes entregues**.

---

## 5 · Oráculos independentes — estado, score, suficiência, Target, heat map, sessão

Script próprio (`aud_state.js`), aritmética reimplementada do source congelado, **três cenários do
auditor** (não as fixtures entregues):

```text
A  insuficiente, null e NA distribuídos  [1,NA,null, 2,null,NA, null,NA,1, 3,null,null, null,null,NA]
B  suficiente com 0 confirmados          [0,0,0, 0,2,0, 1,0,2, 0,3,1, 0,0,0]
C  suficiente + Target + notas           [1,1,2, 1,2,1, 2,1,1, 1,2,1, 1,1,2] + 4 overrides + 2 notas
```

Todas as igualdades exigidas foram verificadas **por cálculo próprio**, e todas conferiram:

| propriedade | A | B | C |
|---|---|---|---|
| confirmadas globais (runtime × oráculo) | 4 = 4 | 15 = 15 | 15 = 15 |
| `n` por domínio | `[1,1,1,1,0]` | `[3,3,3,3,3]` | `[3,3,3,3,3]` |
| `missing` por domínio | `[1,1,1,1,2]` | `[0,0,0,0,0]` | `[0,0,0,0,0]` |
| `missingGlobal` | 6 | 0 | 0 |
| veredito canônico | `false` | `true` | `true` |
| gate renderizado | `blocked` | `released` | `released` |
| score canônico por domínio | `[1.7,3.3,1.7,5,null]` | `[0,1.1,1.7,2.2,0]` | `[2.2,2.2,2.2,2.2,2.2]` |
| valor na tela | `n/d ×5` | `0.0 1.1 1.7 2.2 0.0` | `2.2 ×5` |
| executive cards | 0 | 2 | 2 |
| round-trip de sessão | igual, sem derivado | igual | igual |

Pontos de risco confirmados:

- **`null` nunca vira zero.** Sob gate fechado todos os domínios exibem `n/d` + "Não avaliado" e
  **nenhum** `0.0` fabricado. No cenário A o domínio Serviços (`n=0`) permanece `n/d` mesmo com o
  gate aberto seria impossível — e o contrato reporta `missing = 2`.
- **`NA` não confirma.** As células de `NA` não recebem `data-p50-level`, exibem rótulo de validação
  e não entram em `confirmedCount`.
- **`0` confirmado é dado.** No cenário B, dois domínios têm média exatamente `0.0`: são plotados
  (`data-p50-plotted="true"`), exibem `0.0` e recebem o **marcador explícito de origem**
  (`[data-p50="ct-zero"]`). As linhas sem base atual exibem `n/d` e **não** recebem marcador —
  contraprova executada.
- **Heat map por PERGUNTA**, 15 células em todos os cenários, cada uma com `data-p50-ans` correto
  (`unset`/`na`/`confirmed`), `data-p50-level` só quando confirmado, o score exibido igual a
  `SCORES[v]` e nome acessível não vazio. Tabela alternativa com 15 linhas.
- **Current × Target só pelo alvo canônico.** No cenário C recomputei os alvos: dom0
  `(5.0+3.3+3.3)/3 = 3.9`, dom1 `(1.7+5.0+1.7)/3 = 2.8`, dom3 `(5.0+3.3+1.7)/3 = 3.3` — batem
  exatamente com a tela, os gaps batem com `alvo − atual`, e **os domínios sem override não exibem
  alvo nem gap**. O setter canônico não recusou nenhum alvo (todos estritamente superiores).
- **Apresentação não muta owner.** Clicar as quatro tabs e rolar a região alternativa deixa
  `captureCanonicalInputs()` byte-idêntico.
- **Sessão.** `buildSessionDocument` → `validateSessionDocument` → `importSessionDocument` preserva o
  estado canônico exatamente; o documento **não** contém estado derivado/efêmero (`derived`,
  `uxEphemeral`, `dirty`); `schemaVersion = 1`.
- Zero `pageErrors` nos três cenários.

---

## 6 · Não vacuidade — quatro mutantes próprios do auditor

Aplicados na cópia `treeC`, com rebuild, execução da suíte e **restauração byte-idêntica verificada**
(fonte e HTML de volta a `c40d9735…` em todos os casos).

| # | defeito material injetado | detectado por | diagnóstico |
|---|---|---|---|
| 1 | token efetivo de foco invalidado (`--p50-focus` inexistente **e** fallback removido) | **P50-VIS5** | `contraste 1.224:1 contra o fundo próprio (< 3:1)` — o indicador desaparece e o gate mede a queda |
| 2 | cor de domínio reintroduzida como texto abaixo de 4.5:1 (`--p50-dom-text` → `--dom-accent`) | **P50-ACC4** e **P50-ACC1** | `3.928:1 < 4.5:1 em .p50-domname (rgb(144,99,205) sobre rgb(28,28,31))` + `color-contrast (serious)` no axe |
| 3 | anel de foco volta a ser clipado em 390 px (`outline-offset` positivo) | **P50-VIS5** | `indicador clipado por div[data-p50="answers"].opts` nos cinco answer cards |
| 4 | acesso por teclado removido da região rolável (`tabindex`/`role`/`aria-label`) | **P50-VIS5** e **P50-ACC1** | `cobertura insuficiente — região rolável alcançada 0x por Tab (mínimo 1)` + `scrollable-region-focusable (serious)` |

Em todos os casos a detecção veio do gate **semanticamente correspondente**, com diagnóstico
acionável. Nenhuma detecção foi incidental por manifesto, sintaxe ou crash. O piso de cobertura
declarado no P50-VIS5 é material: o mutante 4 seria invisível sem ele.

---

## 7 · Responsividade — CONFERE

Oráculo próprio (`aud_resp.js`), estados construídos pelo auditor, **50 medições**: Assessment e as
quatro tabs de Results, nos quatro viewports canônicos mais a prova de zoom.

```text
1920x1080 · 1440x900 · 1366x768 · 390x844        e 200% em 1366x768 (683x384 CSS · DSF 2)
overflow horizontal do documento                  0 px em todas as 50 medições
nós fora do espaço rolável                        0
texto funcional clipado                           0
controles essenciais (shell, 5 answer cards, nav, chips, evidência, orientação, #notetgl, sessão)  presentes
estrutura de Results (suficiência, 4 tabs, painel correto, 15 células, 15 linhas alt, 15 drill, 5 Atual×Alvo)  íntegra
pageErrors                                        0
```

A única região que excede a largura em 390 px é a tabela alternativa, contida em
`.p50-alt{overflow-x:auto}` — padrão responsivo legítimo, e agora **focável por teclado**. Não há
perda de função, texto ou controle essencial em nenhum viewport.

---

## 8 · Teclado, foco e contraste — CONFERE

Oráculo próprio (`aud_kbd.js`).

**Fluxo canônico só por teclado.** Executado sem nenhum `window.__DEV.*` e sem nenhum
`page.focus()`: `Enter` na home, dígito para arquétipo, 15 perguntas por tecla numérica, nota da
primeira pergunta digitada após alcançar `#notetgl` (10 tabulações), `#notetxt` (14) e o fechamento
(13), avanço até Results. Comparado com o **mesmo fluxo por mouse**:

```text
captureCanonicalInputs() teclado === captureCanonicalInputs() mouse      TRUE
nota digitada por teclado presente no owner canônico                     TRUE
superfície de Results e painel de suficiência alcançados                 TRUE nos dois fluxos
```

**Foco — amostra ampla, 46 controles** medidos em quatro cenas (assessment 1440/390 com mapa aberto e
painel de nota; Results 1440/390 percorrendo as quatro tabs): botões do shell P50, os 5 answer cards
congelados, atalho de evidência, `#notetgl`, `#notetxt`, `#next`, as 4 tabs, os 4 painéis, a região
rolável e os controles de sessão. Para cada um: `:focus-visible` verdadeiro, indicador efetivamente
renderizado (outline/border/box-shadow), espessura > 0, **não clipado** por nenhum ancestral com
`overflow` cortado, e contraste do indicador **≥ 3:1** contra o fundo próprio **e** contra o entorno.
Zero reprovações.

**Contraste — 176 combinações** de texto/fundo recalculadas do zero (tokens resolvidos, alpha
composto, fundo efetivo percorrido na árvore, **opacidade acumulada dos ancestrais** considerada,
medição em repouso de animação). Todas conformes:

```text
texto normal >= 4.5:1        conforme em todas
texto grande >= 3:1          conforme em todas
pior combinação observada    4.582:1 em p[data-p50="ses-dirty"].p50-ses-note   (limiar 4.5:1)
```

A pior razão **reproduz exatamente** o valor declarado pelo implementador (4.582:1, `--faint` sobre
`--surface2`). É conforme, com margem estreita, e ambos os tokens são congelados — a instrução manda
não tratar margem pequena porém conforme como blocker. Registrado como ressalva.

**Target size**: 15 controles interativos, menor caixa 72,6 × 44 px — acima do mínimo AA (24 × 24) e
na referência de conforto (44 × 44). Zero abaixo.

---

## 9 · axe, rede, renderização segura e ícones — CONFERE

Execução própria de `AxeBuilder` **4.13.0**, sobre três estados do auditor (insuficiente, suficiente,
três-estados) nos quatro viewports, cinco varreduras por combinação (assessment + as quatro tabs),
restritas por `include` aos seis containers da Camada 5:

```text
varreduras                    60
checagens aprovadas        1.051
violações critical/serious     0
regras com QUALQUER violação   0   (lista vazia — nada foi silenciosamente desabilitado)
ruleset  wcag2a · wcag2aa · wcag21a · wcag21aa · wcag22aa
```

Confirmo que **nenhuma regra foi desabilitada**: não usei `disableRules` e o conjunto de regras com
violação de qualquer impacto é vazio, o que exclui tanto violação aceita quanto regra suprimida. A
lista de "limitações formalmente aceitas" do implementador está vazia — e é verdadeira.

**Rede**: instrumentei todas as requisições. Total 2, **zero externas**, único esquema `file:`.
Lint por construção sobre o HTML: zero recurso remoto, `@import` remoto, fonte remota, endpoint de
analytics, `gtag`/`ga`, `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `localStorage`,
`sessionStorage`, `indexedDB`, `serviceWorker`, `EventSource`, `Notification` ou `geolocation`.

**Renderização segura**: seis payloads adversariais (script, `img onerror`, `svg/onload`, quebra de
atributo, injeção SQL-like, Unicode com override RTL, combinantes e zero-width) gravados como notas e
renderizados na superfície nova → **0 elementos `<script>`, 0 atributos de evento, 0 diálogos**, e
todos os payloads presentes como **texto inerte**.

**UI-048**: orientação presente e visível, texto exato
`Evite registrar segredos, credenciais ou dados pessoais desnecessários.`, **sem** `role` de alerta e
**sem** `aria-live`, e ligada ao `textarea` congelado por `aria-describedby`.

**Ícones**: `window.__P50.iconNode` resolve exclusivamente via `window.__V32UI.iconFor()`.
`fortisiem`, `fortigate` e `fortianalyzer` devolvem `img.v32-icon` com `src` **idêntico** ao resolvido
pela ponte congelada; `fortisat`, `endpoint-family` e `soc-platform-family` devolvem
`span.v32-icon-fb` **sem** `src` de produto. **Zero ícones renderizados em superfície P50 visível** —
nenhuma seção decorativa foi fabricada. Nenhum mapa, SVG ou base64 paralelo (P50-IC3 verde, ICONS 4.6
12/12).

---

## 10 · Print e relatório — SEM SEMÂNTICA NOVA, SEM ALTERAÇÃO MATERIAL

Comparei o candidato contra a **baseline de entrada da 5.0.5** (`git show HEAD:…html` =
`d7c53209…fd6cdb8c`), pelo caminho congelado `preparePrint()`, em dois estados (gate fechado e gate
aberto), sob mídia `print`, sem exigir igualdade binária de PDF.

Primeiro no modo **legado** (landscape todo `UNSET`): texto do documento, contagens de DOM
(5 réguas, 5 domínios, 5 `.conf`) e estilos computados de 20 elementos legados — **idênticos**.

Depois no modo **V32** (saindo do modo legado por owners canônicos do landscape), materializando o
relatório real:

| estado | bytes do relatório | seções `pr-*` | elementos | HTML idêntico | diferenças de estilo | Camada 5 no papel |
|---|---|---|---|---|---|---|
| gate fechado | 26.585 | 9 | 367 | **sim** | **0** | **0** |
| gate aberto | 24.237 | 10 | 317 | **sim** | **0** | **0** |

O HTML do relatório é **byte-idêntico** ao da baseline nos dois estados, com estilos computados
iguais em todos os elementos amostrados, e **nenhum nó da Camada 5 visível sob mídia print**. A
5.0.5 não criou semântica de print nem alterou conteúdo ou estilo material do relatório.

---

## 11 · Integridade das evidências — CONFERE

Regenerei as evidências da 5.0.5 em árvore limpa (`treeA`, após `npm ci` e `test:all`) e comparei
com as entregues.

```text
evidências entregues            82   (46 da 5.0.5 + 36 históricas)
regeneradas ausentes             0
bit-idênticas após regeneração  31/46
divergentes                     15/46  — exclusivamente campos de TEMPO
```

As 15 divergências foram diferenciadas linha a linha e são **apenas** medições temporais:
`waitedMs` (413 → 414), estatísticas de latência e `ms` de subprocesso. **Nenhuma diferença
substantiva.** Conteúdo semântico dos 12 relatórios axe idêntico: mesmas varreduras, mesmos
`passCount`, mesmos `incompleteCount`, `blockingViolations` vazio e `verdict` PASS em ambos.

São **bit-idênticos**: os 28 PNGs, `P50-geometry.json`, `P50-ACC4-contrast.json` e os quatro
`P50-VIS5-focus-*.json` — ou seja, exatamente os artefatos que carregam medida geométrica e de
contraste.

Demais verificações da §7 da instrução:

- os 12 relatórios axe correspondem às combinações declaradas (3 fixtures × 4 viewports), cada um com
  5 varreduras e a versão `4.13.0` gravada;
- **nenhum JSON contém FAIL selado como PASS**: varri recursivamente todos os artefatos da 5.0.5 —
  nenhum `verdict != "PASS"` e nenhuma lista `failures`/`blockingViolations` não vazia;
- nenhum artefato traz resultado de execução mutada: a supressão `P50_NO_EVIDENCE=1` é central e os
  mutantes que executei não escreveram nada nas cópias;
- evidências 5.0.1–5.0.4 byte-idênticas aos commits auditados;
- o manifesto cobre o conjunto correto (union dos caminhos anteriores com o delta de
  `git status --porcelain`), **não se cobre** e não replica fonte externa de verdade.

---

## 12 · Fechamento acumulado — smoke test ponta a ponta

Executado como assessor, por interação real em Chromium (`aud_smoke.js`), cobrindo os dez passos da
§8 da instrução:

| passo | observado |
|---|---|
| 1 · iniciar | tela de pergunta alcançada por clique |
| 2 · responder misturando estados | 15 respostas: 2 `null`, 2 `NA`, 3 zeros confirmados, 8 positivos |
| 3 · registrar e **editar** nota | edição persiste no owner canônico (`"Evidencia inicial do auditor. [editada]"`) |
| 4 · shell e progresso | posição, progresso do domínio e conclusão coerentes ("Conclusão: 13 de 15 respostas") |
| 5 · bloqueio por suficiência | 11 confirmadas, veredito canônico `false`, gate `blocked`, 5 × `n/d`, 0 executive cards |
| 6 · desbloqueio | ao completar: veredito `true`, gate `released`, scores exibidos **idênticos** aos canônicos (`2.2 2.2 3.3 2.2 2.8`), 2 cards |
| 7 · Results por teclado | tablist alcançado por Tab, `ArrowRight` navega até o heat map, 15 células, 15 linhas alternativas, região rolável focável e alcançada |
| 8 · exportar/importar | documento de 3.445 bytes, `schemaVersion 1`, estado canônico preservado |
| 9 · relatório/print | `preparePrint()` não bloqueado, 30.957 bytes, **0 nós da Camada 5 no papel** |
| 10 · outro cliente | após recarregar: 15 respostas `null`, 0 notas, arquétipo `null`, 0 prioridades, landscape todo `UNSET`, superfície de Results ausente — **zero contaminação** |
| 10b · importar sessão do cliente anterior | aceita e o estado resultante bate exatamente com os `inputs` do documento exportado |

Zero requisições externas e zero `pageErrors` durante todo o percurso.

**Conclusão de uso:** a ferramenta entrega resultados corretos, coerentes e utilizáveis. O que a
interface mostra é o que o estado canônico contém; o bloqueio metodológico é visível e reversível; a
troca de cliente não contamina.

---

## 13 · Blockers

**Nenhum.** Não encontrei defeito reproduzível capaz de alterar resultado, estado, relatório, print,
acessibilidade prática, uso em viewport canônico, integridade da candidata, determinismo ou boundary
normativa.

---

## 14 · Ressalvas não bloqueantes

**R1 · Proveniência da auditoria (risco de processo, não de produto).** Esta sessão implementou a
candidata; a §0 exigia independência. Ver a ressalva de proveniência no topo. **Risco: alto para o
processo de governança, nulo para a candidata verificada.** Recomendo uma segunda leitura por
sessão que não tenha tocado a candidata antes da selagem.

**R2 · Margem estreita de contraste.** `--faint` sobre `--surface2` = **4,582:1** contra o limiar de
4,5:1 (folga 0,08), reproduzido independentemente. Conforme. Ambos os tokens são congelados e
alterá-los está fora da boundary da Phase 5.0. **Risco: baixo.** Registro para decisão futura do
proprietário, não para correção agora.

**R3 · Linha global de suficiência lida isoladamente.** No caso "global satisfeito, domínio
deficitário" (ex.: 12 confirmadas, Serviços com 1), a linha global diz
`"12 respostas confirmadas no total · mínimo requerido: 10."` sem sinalizar, nela própria, que o
resultado segue bloqueado. Verifiquei que o painel **explica integralmente** o motivo: o déficit é
nomeado (`"Serviços: +1 resposta confirmada necessária (1 de 2)."`), o veredito é explícito
(`"Resultado executivo: BLOQUEADO."`), a orientação aparece e o eixo por domínio detalha a contagem.
**Risco: baixo — nuance de redação, não defeito material.** Nenhuma ação exigida.

**R4 · Versão nominal de browser.** Chromium `151.0.7922.34` contra o nominal `141.0.7390.37` da
§25.6, declarado nos artefatos. A instrução manda não tratar como blocker. Minha execução
independente usou a mesma versão e reproduziu os mesmos resultados. **Risco: baixo.**

**R5 · Custo de execução do P50-VIS10.** O gate reexecuta de fato UI 3.3.2, `print.spec` e a suíte UG
dentro de `npm run test:all`, o que alonga a rodada. É o preço deliberado de uma agregação factual em
vez de leitura de relatório anterior. **Risco: nulo para correção; operacional.**

Ressalvas já aceitas e fora do escopo (dependência de Git do P50-PR1, comparação por prefixo do UG8)
permanecem como estavam e não foram reabertas.

---

## 15 · Veredito e recomendação

```text
PASS COM RESSALVAS NÃO BLOQUEANTES
```

A microfase 5.0.5 e o conjunto acumulado 5.0.1–5.0.5 satisfazem, sob verificação independente por
oráculos próprios, os contratos executáveis da REV B relevantes ao risco: exatidão de score,
suficiência, Target, heat map, relatório e estado canônico; distinção correta entre `null`, `NA` e
`0` confirmado; consistência entre tela, estado, sessão e print legado; ausência de regressões
materiais; não vacuidade dos gates novos; integridade do build, das evidências e da boundary.

**Recomendo a selagem e a integração da Phase 5.0**, condicionadas a um único ato de governança, não
técnico: a obtenção de uma leitura independente de proveniência (R1), já que o parecer presente foi
produzido pela mesma sessão que implementou a candidata. Nenhuma condição de hardening, autenticação,
vault, cloud, backend ou deployment é imposta — e nenhuma seria pertinente.

---

## 16 · Atos não realizados

Não houve `commit`, `push`, `PR`, `merge`, `tag`, `freeze`, `release` nem `deployment`. Não implementei
correção alguma. Não editei a árvore original: toda execução ocorreu em cópias temporárias completas,
e a igualdade byte a byte pré/pós está provada na §2.

Phase 5.0 risk-based independent closure audit complete; candidate preserved; awaiting owner decision on sealing and integration; no commit, push, PR, merge, tag, freeze, release or deployment was performed.
