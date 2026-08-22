# REVALIDAÇÃO INDEPENDENTE DE PROVENIÊNCIA — PHASE 5.0

Instrução executada: `REVALIDACAO_INDEPENDENTE_ENXUTA_PHASE_5_0.md`
· SHA-256 `40e5236df6f8400e5a327042744f7fde799e4542f9c3fd44ce99f5614e75c9f2`
· 6.576 bytes · 166 linhas · UTF-8 sem BOM · zero CR (verificado byte a byte antes de qualquer
leitura do repositório: `CR = 0`, `CRLF = 0`, `LF = 166`).

Parecer técnico sob revalidação:
`AUDITORIA_INDEPENDENTE_FECHAMENTO_PHASE_5_0.md`
· SHA-256 `a69207287c7bfb0a37227aa254ecb4119a3086009e7ba8e1fb8f5fa98c97c1e6` — **confere** · 501 linhas.

Repositório: `C:\Projetos\QuickScan-SOC-CMM\phase5`
Execução: 2026-08-21 · Windows 11 · Node v24.19.0 · npm 11.17.0 · Python 3.12.10 ·
Playwright 1.62.1 · Chrome/Chromium 151.0.7922.138 · axe-core 4.13.0.

---

## 0 · Declaração de independência

Esta sessão **não** participou da implementação da microfase 5.0.5, **não** produziu nenhuma das
quatro correções da candidata e **não** produziu o parecer `a6920728…`. Não reutilizei nenhum
harness, fixture ou artefato do implementador nem do auditor anterior como prova.

Escrevi instrumentação própria, integralmente nova, fora da árvore auditada:

```text
reaud/obs.js         observador de DOM/estado (4 cenários próprios, troca A→B→A, round-trip)
reaud/oracle.py      oráculo independente em Python (aritmética reimplementada do source congelado)
reaud/kbd.js         fluxo real só por teclado, foco, overflow, 0.0 × n/d, grayscale
reaud/kbd_eval.py    avaliação do acima, com contraste WCAG recalculado do zero
reaud/note_probe.js  matriz de ativação por teclado do painel de evidência
reaud/clip_probe.js  materialidade do recorte de anel de foco em 390 px
reaud/axe.js         axe independente, sem `disableRules`, + contraste próprio
reaud/axe2.js        atribuição nó a nó das violações (Camada 5 × superfície congelada)
reaud/print.js       comparação de print por DOM/estilo/texto contra a baseline de entrada
reaud/mutate.py      três mutações próprias, distintas das quatro do parecer
```

**Método adversarial adotado, que o parecer anterior não podia usar:** medi a candidata **e** a
baseline de entrada da 5.0.5 (`git show HEAD:…html` = `d7c53209…fd6cdb8c`) com o **mesmo**
instrumento. Isso separa mecanicamente três coisas que se confundem com facilidade: defeito
introduzido pela 5.0.5, propriedade pré-existente de superfície congelada, e artefato do meu
próprio ambiente ou da minha própria medição.

---

## 1 · Preflight — CONFERE INTEGRALMENTE

| item | exigido | observado |
|---|---|---|
| branch | `feat/phase5-5-0-5` | idem |
| HEAD | `3b8d76be8b07b78549b93d38758e9677b51dd8fa` | idem |
| commits sobre `main` | 0 | 0 |
| staged | 0 | 0 |
| delta | 57 = 10 modificados + 47 novos | 57 = 10 + 47 |
| tags · stash | — | 0 · 0 |
| HTML | `c40d9735…efce09f` | idem · 698.613 bytes |
| `engine_v32.js` | `9a4a2e67…2bb5d247a` | idem |
| manifesto | `024d6130…62d702` · 111/111 | idem · 111 entradas de dados · `sha256sum -c` **111 OK, 0 falhas** |
| relatório 5.0.5 | `f440ba36…a0d29211` | idem |
| parecer técnico | `a6920728…8c97c1e6` | idem |

Confirmei ainda, por conta própria, o bloco de identidade da §16 do relatório 5.0.5 — os **11**
hashes declarados (`ui_p50_shell/suff/results`, `ui_p50_v32.css`, `tests_p50_core/chromium`,
`fixtures_p50.js`, `tests_p50_mutants.js`, `build_v32_html.py`, `package.json`,
`package-lock.json`) conferem **todos**, incluindo os três declarados como *intocados*.

**Boundary.** Os 10 modificados são exatamente os autorizados pela §29.2/§29.3 (os quatro módulos
P50, os dois arquivos de teste P50, `package.json`, `package-lock.json`, o HTML construído e o
manifesto). Os 47 novos são o relatório e evidência (`28 × P50-5.0.5-*`, `12 × P50-ACC1-axe-*`,
`P50-ACC4-contrast.json`, `4 × P50-VIS5-focus-*`, `P50-geometry.json`). **Zero caminhos fora da
lista autorizada.**

**Dependência axe.** `@axe-core/playwright` fixado em `4.13.0` exato (sem `^`/`~`), só em
`devDependencies`; no lockfile ele e a transitiva `axe-core@4.13.0` estão ambos com `dev: true`.
`dependencies` continua contendo apenas `jsdom@30.0.1`. O diff do lockfile contra `HEAD` são
exatamente os dois blocos dessa dependência — nada mais. E no HTML construído:
`axe-core`, `axeCore`, `AxeBuilder`, `@axe-core` = **0 ocorrências cada**.

Nenhuma identidade material divergiu. Nada foi normalizado nem descartado.

---

## 2 · Preservação da árvore original — **INTACTA**

Inventário completo por caminho, tamanho e SHA-256 (excluído `node_modules`), antes e depois de
tudo:

```text
arquivos (pré)                 528
arquivos (pós)                 528
digest do inventário (pré)     37213639e8246227a99af1d92d23504adbeeff1705e4d49421ece04bfc3350a5
digest do inventário (pós)     37213639e8246227a99af1d92d23504adbeeff1705e4d49421ece04bfc3350a5
caminhos divergentes           0
git pós                        branch/HEAD/0 commits/0 staged/57 delta/0 tags/0 stash — inalterados
```

Toda execução — build, testes, mutações, oráculos, axe, print — ocorreu em **cópias temporárias
completas** (`work/` e `mut/`), cada uma incluindo `.git`, rastreados modificados e não rastreados.
A fidelidade da cópia foi verificada por inventário: 527 de 528 arquivos byte-idênticos, única
diferença em `.git/index` (cache de `stat` atualizado por `git status`, sem alteração de conteúdo
versionado).

**A árvore original permaneceu byte a byte idêntica.**

---

## 3 · Cenários próprios e cálculo independente

Construí quatro cenários — nenhum reaproveitado das fixtures entregues nem dos cenários A/B/C do
parecer — e calculei **todos** os valores esperados em Python, reimplementando do source congelado
`SCORES = [0, 1.7, 3.3, 5]`, `confirmado ⟺ v ≠ null ∧ v ≠ "NA"`, `domStat().n`,
`score = round(média × 10)/10`, `dataSufficiency = confirmadas ≥ 10 ∧ ∀ domínio n ≥ 2`, e a média
do vetor efetivo para o alvo.

```text
X  insuficiente, mistura completa      [0,NA,null, 3,3,null, NA,NA,NA, 0,0,1, null,2,null]
Y  suficiente, alvo, notas, dom0=0.0   [0,0,0, 1,2,3, 2,2,NA, 1,1,1, 3,0,2] + 4 alvos + 2 notas
Z  global satisfeito, domínio deficitário (12 confirmadas, Serviços com 0) — teste direto da R3
W  adversarial: alvo declarado sobre pergunta NA (sonda do invariante de Target)
```

| propriedade (oráculo próprio × runtime) | X | Y | Z | W |
|---|---|---|---|---|
| confirmadas globais | 7 = 7 | 14 = 14 | 12 = 12 | 14 = 14 |
| `dataSufficiency` canônico | false | true | **false** | true |
| score por domínio | `0.0 5.0 n/d 0.6 3.3` | `0.0 3.3 3.3 1.7 2.8` | `1.7 1.7 1.7 1.7 n/d` | `3.3 ×5` |
| valor exibido em Atual × Alvo | `n/d ×5` | idêntico ao canônico | `n/d ×5` | idêntico |
| déficits exibidos × déficits reais | iguais | — | iguais | — |
| 15 células do heat map, campo a campo | ok | ok | ok | ok |
| 15 linhas da alternativa acessível | ok | ok | ok | ok |

**Zero divergências** entre o meu oráculo e o runtime, em todas as comparações efetuadas
(contagens, `n`/`nNA`/`score` por domínio, veredito, déficits, eixo dos três estados, atributos de
cada célula, texto de cada célula, espelhamento campo a campo da tabela alternativa, linhas
Atual × Alvo, marcador de zero, e ausência de `<script>` ou atributo de evento na superfície).

Pontos de risco que verifiquei por cálculo próprio:

- **`null` nunca vira zero.** Em X, Processos (`n = 0`, três `NA`) exibe `n/d`; com o gate fechado
  os cinco domínios exibem `n/d` e **nenhum** `0.0` é fabricado. Nenhuma célula não confirmada
  recebe `data-p50-level` nem renderiza `0.0`.
- **`NA` não confirma.** As células `NA` recebem `data-p50-ans="na"`, sem `level` e sem `score`, e
  não entram em `confirmedCount()`.
- **`0` confirmado é dado.** Em Y o domínio Negócio tem média exatamente `0.0`: é plotado
  (`data-p50-plotted="true"`), exibe `0.0` e recebe o marcador explícito de origem
  (`[data-p50="ct-zero"]` + `data-p50-zero="true"`). As linhas sem base atual exibem `n/d` e
  **não** recebem marcador — contraprova executada nos dois sentidos, nos quatro cenários.
  Verifiquei aritmeticamente que `0.0` na tela **só** pode vir de zero exato: o menor score não
  nulo possível é `1.7/3 = 0.6`, logo não existe caso de "exibe 0.0 sem ser zero".
- **Troca X → Y → X.** Estado canônico, painel de suficiência, células e linhas Atual × Alvo
  **idênticos** ao primeiro X; `TARGET_PROFILE.overrides` volta vazio. **Zero contaminação.**
- **Round-trip de sessão** (Y): `buildSessionDocument` → `validateSessionDocument` (`{"ok":true}`)
  → limpeza real comprovada → `importSessionDocument` devolve `captureCanonicalInputs()`
  **idêntico**. Documento de 3.531 bytes, `schemaVersion = 1`, chaves de topo
  `format/schemaVersion/toolVersion/engineSha256/createdAt/label/inputs`, sem `derived`,
  `uxEphemeral`, `dirty`, `score`, `stats`, `overall` ou `stage`.
- **Rede:** 1 requisição por carga, esquema `file:` apenas, **zero externas**. Zero `pageErrors`,
  zero diálogos, inclusive com nota adversarial contendo `<script>alert(1)</script>`, que foi
  renderizada como texto inerte.

---

## 4 · Experiência real — teclado e viewports

Fluxo canônico executado **sem `window.__DEV`, sem `page.focus()` e sem clique** — apenas teclas
reais: `Enter` na home, dígito para o arquétipo, dígitos 1–5 nas 15 perguntas (5 = "não sei ·
precisa validar" = `NA`), `Tab`/`Espaço` para o painel de evidência, `Enter` para avançar.

| medição | 1440×900 | 390×844 |
|---|---|---|
| Results alcançado só por teclado | **sim** | **sim** |
| estado resultante (confirmadas / gate) | 14 · aberto | 14 · aberto |
| scores × oráculo próprio `[1.7, 3.3, 2.5, 0.0, 2.8]` | **iguais** | **iguais** |
| nota digitada por teclado no owner canônico | presente | presente |
| paradas de foco medidas | 77 | 77 |
| sem `:focus-visible` | 0 | 0 |
| sem indicador de foco renderizado | **0** | **0** |
| tablist alcançado por `Tab` · `ArrowRight` navega | 17 passos · sim | 17 passos · sim |
| painéis visíveis simultâneos | 1 | 1 |
| região rolável alcançada por `Tab` | **sim, 2 passos** | **sim, 2 passos** |
| seta rola a região | — | `scrollLeft 0 → 49` |
| overflow horizontal do documento | **0 px** | **0 px** |
| nós além da viewport **fora** de contentor rolável | 0 | 0 |
| texto funcional clipado | 0 | 0 |
| `0.0` confirmado com marcador · `n/d` sem marcador | correto | correto |
| células do heat map sem texto / sem `aria-label` / sem `cue` | 0 / 0 / 0 | 0 / 0 / 0 |
| células que preservam o texto sob `grayscale(1)` | **15/15** | **15/15** |
| requisições externas · `pageErrors` | 0 · 0 | 0 · 0 |

A informação **não depende de cor**: cada célula carrega o valor textual (`0.0`, `1.7`, `3.3`,
`5.0`, `Não sei`), um `data-p50-cue` distinto e nome acessível não vazio; sob dessaturação total o
texto permanece integralmente legível.

A única região que excede a largura em 390 px é a tabela alternativa, contida em
`.p50-alt{overflow-x:auto}` — padrão responsivo legítimo, agora focável e rolável por teclado.

---

## 5 · Não vacuidade medida contra a baseline pré-5.0.5

Rodei **a minha própria instrumentação**, sem alteração, sobre a baseline de entrada da 5.0.5
(`d7c53209…fd6cdb8c`). Este é o teste mais forte que produzi, porque não depende de acreditar em
nenhum gate do implementador:

| defeito que a 5.0.5 alega corrigir | baseline (meu instrumento) | candidata (meu instrumento) |
|---|---|---|
| anel de foco ausente em Results | **8 paradas sem indicador** (`p50-tab`, `p50-panel`) | **0** |
| cor de domínio como texto < 4.5:1 | `.p50-hm-dom-name` "Negócio" a **4.214:1** | **8.175:1** (pior do heat map) |
| nós axe violados **dentro** da Camada 5 | **4** (`.p50-hm-dom-name`, 3 × `th` da alternativa) | **0** |
| região rolável sem acesso por teclado | **inalcançável** em 40 `Tab` | **alcançada em 2 `Tab`**, rola por seta |
| `0.0` confirmado sem marcador | **sem marcador** | **com marcador**, e `n/d` sem |
| anéis de foco clipados em 390 px | **24 paradas** | **16** (`ses-export`/`ses-import` corrigidos) |

As quatro correções da 5.0.5 são, portanto, **reais, materiais e eficazes**, reproduzidas por
medição independente que enxerga o defeito antes e a ausência dele depois. Nenhum gate do
implementador foi usado nesta comparação.

---

## 6 · Mutações próprias — três, distintas das quatro do parecer

Aplicadas na cópia `mut/`, com rebuild e **restauração byte-idêntica verificada** em cada caso.

| # | defeito material injetado | mecanismo | detectado por | diagnóstico emitido |
|---|---|---|---|---|
| **A** | `0` confirmado passa a ser classificado como UNSET no eixo por pergunta | `state = (a === null \|\| a === 0) ? "unset" : …` em `ui_p50_results_v32.js` | **P50-UX10** | `semântica de DOM no heat map: ["unset","na","unset"]` |
| **B** | mensagem global de suficiência enganosa quando o déficit é só por domínio | `p50Pending()` deixa de emitir déficits se `missingGlobal === 0` | **P50-SUF3 · SUF4 · SUF5 · SUF7** | SUF7 nomeia o vetor exato: `[0,1,3,3,3] · esperado [0,1], observado []` |
| **C** | recorte do anel de foco em 390 px **por mecanismo diferente** do mutante 3 do parecer | `overflow:hidden` no contentor do tablist (não `outline-offset`) | **P50-VIS5** | `button#p50-tab-*: indicador clipado por div[data-p50="tabs"].p50-tabs` — nos 4 tabs, em 1440 **e** 390 |

Impacto material confirmado diretamente, além da detecção pelo gate:

- **A** — no cenário Y, três respostas nível 0 genuinamente confirmadas passam a renderizar `n/d`
  no heat map, enquanto o agregado continua exibindo `0.0`: a superfície fica internamente
  contraditória. É exatamente o anti-pattern `UNSET ≠ NONE`, invertido.
- **B** — no cenário Z, o painel passa a exibir "12 respostas confirmadas no total · mínimo
  requerido: 10." com a lista de déficits **vazia**, sem nomear Serviços, ainda que o resultado
  siga bloqueado.
- **C** — os quatro tabs da Camada 5 perdem o anel de foco nos dois viewports.

Em todos os casos a detecção veio do gate **semanticamente correspondente**, com diagnóstico
acionável; nenhuma foi incidental por manifesto, sintaxe ou crash. Restauração verificada:

```text
ui_p50_results_v32.js  4c2965f7…4a8b66e   ui_p50_suff_v32.js  a9931330…94b86f5b
ui_p50_v32.css         3e483520…6bee4a50  HTML reconstruído   c40d9735…efce09f
```

---

## 7 · axe, contraste, rede e print — amostra independente

**axe 4.13.0, sem `disableRules`**, sobre dois estados meus (insuficiente e suficiente com alvo),
em **390×844 e 1440×900**, cinco varreduras por combinação (superfície inteira + as quatro tabs),
tags `wcag2a · wcag2aa · wcag21a · wcag21aa · wcag22aa`:

```text
varreduras                       20
checagens aprovadas             606
incompletas                      24   (não são violações; nenhuma promovida nem usada como exclusão)
violações                        20   — todas da regra color-contrast (serious)
nós violados DENTRO da Camada 5   0
nós violados em superfície congelada  18  (.eyebrow · .stage-tag · .f-tag · #ux-journey · #ux-prios …)
```

Diferentemente do parecer, **não** restringi o `include` aos seis contêineres da Camada 5:
varri a página inteira. O resultado reforça a conclusão anterior em vez de contradizê-la —
**zero** violações na superfície nova — e adicionalmente expõe 18 nós violados em superfície
**congelada**, que reproduzi **idênticos na baseline pré-5.0.5**. São pré-existentes, estão fora da
change boundary da §29.4 e não são atribuíveis à Phase 5.0 (ressalva N3 abaixo).

**Contraste recalculado por rotina própria** (tokens resolvidos, alpha composto, fundo opaco
efetivo percorrido na árvore, opacidade acumulada dos ancestrais):

```text
amostras na Camada 5 (2 estados × 2 viewports)   152      reprovadas: 0
pior combinação observada                        4.582:1  P[data-p50="ses-dirty"].p50-ses-note  (limiar 4.5)
amostras por domínio, com o heat map visível      45      reprovadas: 0
pior combinação POR DOMÍNIO (dom 0..4)           8.175:1  em todos os cinco
```

A pior razão **reproduz exatamente** o valor declarado pelo implementador e pelo parecer
(4,582:1, `--faint` sobre `--surface2`). É conforme, com folga de 0,082, e ambos os tokens são
congelados.

**Rede:** 4 requisições no total das quatro cargas, **zero externas**, esquema único `file:`.
**axe fora do HTML:** 0 ocorrências de `axe-core`, `axeCore`, `AxeBuilder` e `@axe-core`;
dependência presente somente em `devDependencies`, com `dev: true` no lockfile.

**Print — candidato × baseline de entrada, por DOM/estilo/texto, sem SHA binário de PDF.**
Saí do modo legado por owner canônico do landscape para materializar o relatório V32 real, sob
mídia `print`, pelo caminho congelado `preparePrint()`:

| estado | bytes do relatório | elementos | seções `pr-*` | HTML idêntico | texto idêntico | divergências de estilo (120 nós) | Camada 5 no papel |
|---|---|---|---|---|---|---|---|
| gate **bloqueado** | 19.670 | 335 | 22 | **sim** | **sim** | **0** | **0** |
| gate **liberado** | 25.799 | 342 | 21 | **sim** | **sim** | **0** | **0** |

A 5.0.5 **não** criou semântica de print nem alterou conteúdo ou estilo material do relatório.

---

## 8 · Execuções direcionadas — e o que este ambiente **não** pôde executar

Executadas na cópia temporária. Registro o que falhou e por quê, sem converter artefato de
ambiente em achado nem em PASS.

| comando | esperado | observado neste host | leitura |
|---|---|---|---|
| `npm ci --engine-strict` | exit 0 | **exit 1** — `Missing: fsevents@2.3.2 from lock file` | **artefato de ambiente pré-existente**: reproduzi a falha **idêntica** sobre o `package.json`/`package-lock.json` **puros do `HEAD`** (pré-5.0.5), em diretório limpo. Não é regressão da candidata. |
| `python3 build_v32_html.py` | HTML `c40d9735…` | conteúdo idêntico, **CRLF** | única diferença é tradução de fim de linha do modo texto do Python no Windows: após normalizar `CRLF→LF` o rebuild é **byte-idêntico** a `c40d9735…efce09f` (7.193 linhas). Determinismo de **conteúdo** reproduzido de forma independente; o `CLAUDE.md` já declara que o determinismo de bytes é comprovado **apenas** em Linux. |
| `npm run test:p50` | 38/38 | **37 PASS · 1 FAIL** | o único FAIL é `P50-IC4 → ICONS 4.6 exit 1`. Isolei a causa: `generate_icons_v32.py` (congelado, protegido) usa `Path.write_text`, que no Windows emite CRLF; o gate compara o hash do gerado com o publicado. Provei que o gerado é **idêntico após `CRLF→LF`**. Artefato de host em superfície congelada. |
| `npm run test:p50vis` | 24/24, zero SKIP | **23 PASS · 1 FAIL** | o único FAIL é `P50-VIS10`, por `print.spec exit null`. Causa isolada: `print.spec` exige `pdftoppm`/`pdftotext`/`pdfinfo` (poppler), **ausentes neste host**; o próprio preflight da suíte reprova declarando as ferramentas faltantes. **Gate não executado**, não reprovado por defeito. |
| `npm run test:m41` | PASS + payload | **PASS** · `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | reproduzido exatamente (o script canônico usa `--out /dev/null`, inválido no Windows; executei o harness com destino temporário equivalente). |
| `npm run test:visual` | 67 / 0 / 37 | **60 passed · 37 skipped · 1 failed · 6 did not run** | 60 + 1 + 6 = **67**: os 7 testes de print não puderam rodar pela mesma ausência de poppler, e o preflight é o "1 failed". Nenhuma falha substantiva. |

Não repeti a regressão histórica completa: a amostragem direcionada não revelou sinal de
inconsistência, os hashes protegidos conferem e o M41 reproduz o payload canônico.

**Declaração explícita do não executado neste ambiente:** os gates de determinismo **em nível de
byte** (ICONS 4.6 / P50-IC4) e **toda** a família de print/PDF (P50-VIS10, `print.spec`, 7 testes
visuais) **não foram executados** aqui, por limitação de host (tradução CRLF do Python no Windows e
ausência de poppler). Não os declaro PASS. O parecer `a6920728…` os executou em Linux/WSL2, que é o
host canônico declarado pelo próprio projeto.

---

## 9 · Blockers

**Nenhum.**

Não encontrei defeito funcional ou material reproduzível capaz de alterar resultado, estado,
suficiência, Target, heat map, relatório, print, acessibilidade prática, uso em viewport canônico,
integridade da candidata ou boundary normativa. Cada sinal que a minha amostragem levantou foi
rastreado até uma de três origens, todas verificadas experimentalmente: defeito do meu próprio
harness, artefato do meu ambiente, ou propriedade **pré-existente de superfície congelada**
reproduzida byte a byte na baseline pré-5.0.5.

Registro, por transparência, os defeitos **do meu próprio instrumento** que precisei corrigir antes
de concluir qualquer coisa — cada um teria produzido um falso achado grave:

1. tabulei até um botão `.opt` antes de pressionar `Enter`, o que faz o handler global congelado
   ignorar a tecla; o fluxo por teclado parecia quebrado e não estava;
2. medi o contraste do anel de foco contra o fundo **do próprio botão**, e não contra a superfície
   em que o anel é pintado (`outline-offset` positivo); os 4 "1,0:1" viraram **4,043:1** ao medir
   corretamente;
3. tratei `outline-style: auto` (anel dual-tone do próprio navegador) como cor sólida, gerando 24
   falsos positivos;
4. naveguei para a tab "Análise" e concluí que a região rolável do heat map era inalcançável.

Nenhum desses virou achado.

---

## 10 · Ressalvas não bloqueantes

**N1 · Precedência de `Enter` sobre o controle de evidência (superfície congelada).**
Com a pergunta **já respondida**, `Enter` sobre `#notetgl` ou sobre o atalho novo
`[data-p50="evidence-open"]` é consumido pelo atalho global congelado (`advanceFromQuestion()`,
`quickscan…html:2073`) e avança a pergunta em vez de abrir o painel. **Equivalência de teclado está
satisfeita:** `Espaço` funciona nas quatro combinações testadas (`#notetgl` e atalho P50 × pergunta
respondida e não respondida), e a nota chega ao owner canônico em todas. Matriz executada na
candidata **e** na baseline: **resultado idêntico nas oito células**. Propriedade pré-existente da
Camada 1, fora da change boundary da Phase 5.0. **Risco: baixo.**

**N2 · Recorte residual de anel de foco em 390 px, em controles congelados.**
Restam 16 paradas com o anel recortado por `SECTION.screen`, todas em controles **congelados**
(`v32cta`, `editprio`, `restart`, `.cta`) — nenhuma na Camada 5. Medi a materialidade: o recorte é
de **4 px apenas na borda esquerda do anel**; a **caixa do controle não é recortada** (0 px em
ambos os lados), os demais lados do anel de 2 px renderizam integralmente e o contraste do anel
contra o fundo real é **4,043:1** (limiar 3:1). Idêntico na baseline, onde eram **24** — a
candidata **melhorou** este eixo. **Risco: baixo.**

**N3 · 18 nós com `color-contrast` (serious) em superfície congelada.**
Aparecem apenas porque varri a página inteira em vez de restringir aos contêineres da Camada 5
(`.eyebrow`, `.stage-tag`, `.f-tag`, cabeçalhos de `#ux-journey`/`#ux-prios`/`#ux-refsum`).
Reproduzidos **idênticos** na baseline pré-5.0.5. Pré-existentes, em arquivos protegidos pela
§29.4, fora da boundary. **Risco: baixo — registro para decisão futura do proprietário, não para
correção agora.**

**N4 · Camada de Target congelada aceita alvo não estritamente superior.**
`setTarget()` (4.3.1, congelada) rejeita `v < current` mas **aceita `v === current`**, e quando o
current da pergunta é `"NA"` aceita qualquer nível 0..3. No meu cenário adversarial **W**, um alvo
`0` declarado sobre uma pergunta `NA` faz o **alvo agregado do domínio cair abaixo do atual**
(alvo 2,2 contra atual 3,3), exibindo gap **−1,1**. Verifiquei que a Camada 5 apenas **reproduz
fielmente** o cálculo congelado: `computeTargetProfile` devolve `2.2` / overall `3.1` de forma
**bit-idêntica** na candidata e na baseline pré-5.0.5, e a superfície congelada de Target já
exibia o mesmo valor negativo. **Não é regressão da 5.0.5** e está fora da change boundary.
Registro por tocar a redação do invariante "alvo estritamente > current confirmado", cuja garantia
é por pergunta (onde não há current confirmado) e não no agregado do domínio. **Risco: baixo.**

**N5 · Margem estreita de contraste (confirma a R2 do parecer).** `--faint` sobre `--surface2` =
**4,582:1** contra o limiar de 4,5:1, reproduzido de forma independente pela minha rotina. Conforme.
Tokens congelados. **Risco: baixo.**

**N6 · Cobertura de execução deste ambiente.** Os gates de determinismo em nível de byte e toda a
família de print/PDF não puderam ser executados neste host (CRLF do Python no Windows; poppler
ausente). Declarados como **não executados** na §8, nunca como PASS. **Risco: nulo para a
candidata; é limitação da minha rodada, não dela.**

### Sobre a R3 do parecer — avaliada de forma independente

Construí o cenário Z exatamente para isso. Na candidata, o painel exibe simultaneamente:
`"12 respostas confirmadas no total · mínimo requerido: 10."`, o déficit nomeado
`"Serviços: +2 respostas confirmadas necessárias (0 de 2)."`, a orientação
`"Continue o assessment para atingir evidência suficiente."`, `data-p50-sufficient="false"` e os
cinco domínios com `n/d`. A linha global, **lida isoladamente**, é neutra; o painel, **lido como
unidade**, explica integralmente o bloqueio. Minha mutação **B** demonstra que a garantia
substantiva é gatada: no instante em que a explicação deixa de corresponder ao déficit real,
**quatro** gates de suficiência reprovam, incluindo o exaustivo P50-SUF7 sobre os 1024 vetores.
**Concordo com a classificação do parecer: nuance de redação, não defeito material.**

---

## 11 · Conclusão sobre o parecer técnico e sobre R1

A leitura independente **confirma** o parecer técnico
`a69207287c7bfb0a37227aa254ecb4119a3086009e7ba8e1fb8f5fa98c97c1e6` e **não o contradiz em nenhum
ponto material**. Onde ampliei o escopo além do que ele mediu — varredura axe sem restrição de
`include`, comparação sistemática contra a baseline pré-5.0.5, cenário adversarial de Target sobre
pergunta `NA`, matriz de ativação por teclado do controle de evidência — os achados adicionais
recaíram **integralmente** sobre superfícies congeladas e propriedades pré-existentes, fora da
change boundary da Phase 5.0, e nenhum é bloqueante.

Os números centrais do parecer que reproduzi de forma independente conferem: identidade e boundary
da candidata, 111/111 do manifesto, payload M41 `9794b267…3ed4365b`, determinismo de conteúdo do
build, distinção `null` × `NA` × `0`, marcador de zero confirmado, ausência de contaminação entre
clientes, round-trip de sessão sem derivados, zero rede externa, ausência de axe no HTML, pior
contraste 4,582:1, e print sem alteração material contra a baseline.

**Não encontrei ponto cego funcional ou material que torne insegura a recomendação de selagem e
integração.** A ressalva de proveniência **R1** — de que o parecer fora produzido pela mesma sessão
que implementou a candidata — era um risco de **processo**, e o ato de governança que ela exigia foi
agora praticado: uma sessão que não tocou a candidata reexaminou os riscos centrais com
instrumentação própria e cenários próprios, e chegou às mesmas conclusões materiais.

```text
PASS COM RESSALVAS NÃO BLOQUEANTES — R1 ENCERRADA
```

**Recomendo a selagem e a integração da Phase 5.0.** Nenhuma condição de hardening, autenticação,
vault, cloud, backend ou deployment é imposta, e nenhuma seria pertinente. As ressalvas N1–N6
tocam superfícies congeladas ou o meu próprio ambiente de execução e ficam registradas para
decisão futura do proprietário, não como condição.

---

## 12 · Atos não realizados

Não houve `commit`, `push`, `PR`, `merge`, `tag`, `freeze`, `release` nem `deployment`. Não
implementei correção alguma. Não editei a árvore original: toda execução ocorreu em cópias
temporárias completas, e a igualdade byte a byte pré/pós está provada na §2. Não declaro a fase
concluída nem congelada — isso cabe ao proprietário.

Independent provenance revalidation of Phase 5.0 complete; R1 evaluated; candidate preserved; awaiting owner decision on sealing and integration; no commit, push, PR, merge, tag, freeze, release or deployment was performed.
