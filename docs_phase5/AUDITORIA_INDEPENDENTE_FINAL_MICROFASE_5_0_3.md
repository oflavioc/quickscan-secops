# AUDITORIA INDEPENDENTE FINAL — MICROFASE 5.0.3

## Sufficiency-Aware Results · candidata não commitada, pós-errata documental

**Veredito: `FAIL` — 1 blocker novo (`B-AUD-FIN-503-1`).**

`B-AUD-503-1` está **fechado** por reprodução própria. `B-AUD-503-2` está **fechado apenas em
parte**: o vazamento principal foi corrigido, mas um resíduo da mesma classe permanece e é
mensurável em Chromium real, no papel legado, por oráculo próprio.

Auditor independente: agente Claude Opus 5, atuando exclusivamente como auditor técnico.
Data: 2026-08-21.

---

## 0 · Declaração de independência e de não ação

Esta sessão **não implementou, não corrigiu e não orientou** qualquer byte desta candidata. A
sessão iniciou sem histórico de trabalho neste repositório: não participou da microfase 5.0.3, nem
da errata estreita, nem da errata pós-auditoria FAIL, nem da errata documental pós-reauditoria.
Nenhuma incompatibilidade de função se aplica.

Atos **não** realizados por esta sessão:

- nenhuma correção implementada;
- nenhum byte da árvore original editado, criado ou removido;
- nenhuma evidência regenerada, alterada ou promovida na árvore original;
- nenhum commit, push, PR, merge, tag, freeze, release ou deployment;
- microfase 5.0.4 **não** iniciada;
- nenhum dado de cliente tocado;
- o parecer **não** foi copiado para o repositório;
- a microfase **não** foi declarada encerrada, congelada ou aprovada — isso não é ato meu.

`AUDITORIA_INDEPENDENTE_REAUDITORIA_MICROFASE_5_0_3.md` foi tratado **exclusivamente** como mapa de
riscos e reproduções, conforme instruído. Seu veredito **não foi herdado**. Todo achado abaixo foi
reproduzido com oráculo próprio ou por leitura direta dos bytes.

---

## 1 · Identidade da instrução de auditoria

```text
PROMPT_AUDITORIA_INDEPENDENTE_FINAL_MICROFASE_5_0_3.md
SHA-256   e8a710b2d230b6adfd98faeb3963f065dccc7a5bc1f7f874f75a28af8faabdc0   CONFERE
bytes     13.857                                                            CONFERE
linhas    360                                                               CONFERE
encoding  UTF-8 sem BOM                                                     CONFERE
CRLF      0                                                                 CONFERE
```

Lida integralmente até EOF antes de qualquer execução.

---

## 2 · Identidade deste parecer

```text
arquivo   AUDITORIA_INDEPENDENTE_FINAL_MICROFASE_5_0_3.md
local     C:\Users\usuario\Documents\Codex\2026-08-18\
          referenced-chatgpt-conversation-this-is-an-3\outputs\   (FORA do repositório)
encoding  UTF-8 sem BOM
CRLF      0
```

**Desvio declarado.** Bytes, linhas de conteúdo e SHA-256 deste parecer só existem depois que o
arquivo é gravado; um arquivo não pode conter o próprio digest. Essas três grandezas são emitidas
no arquivo irmão `AUDITORIA_INDEPENDENTE_FINAL_MICROFASE_5_0_3.md.sha256` e na mensagem de
encerramento desta sessão. Nenhuma outra exigência da §11 da instrução foi omitida.

Este parecer **não sobrescreve** `AUDITORIA_INDEPENDENTE_REAUDITORIA_MICROFASE_5_0_3.md`, que
permanece intacto no mesmo diretório.

---

## 3 · Preflight — identidades exigidas pela §1

```text
repositório                 /mnt/c/Projetos/QuickScan-SOC-CMM/phase5
branch                      feat/phase5-5-0-3                                  CONFERE
HEAD                        fe4a536a508ed592bf62d1545a90e399036bb43d           CONFERE
commits da 5.0.3 sobre HEAD 0                                                  CONFERE
staged                                                  0                      CONFERE
caminhos alterados                                     36                      CONFERE
módulos ou trabalho da 5.0.4                            0                      CONFERE
```

| item | exigido | observado | veredito |
|---|---|---|---|
| HTML candidato | `4c7f678b…62d4dd29` · 651.513 B | idêntico · 651.513 B | **CONFERE** |
| `engine_v32.js` | `9a4a2e67…2b5d247a` | idêntico | **CONFERE** |
| payload funcional M41 | `9794b267…3bed4365b` | idêntico, por harness real | **CONFERE** |
| `docs_phase5/MICROFASE_5_0_3_REPORT.md` | `ff5d78b7…9528ac` · 91.869 B · 1.492 linhas · UTF-8 sem BOM · 0 CRLF | idêntico em todos os cinco campos | **CONFERE** |
| `docs_phase5/MANIFEST_PHASE5_P50.sha256` | `b61a1532…68a5cc2f` · 47/47 · 0 divergências · 0 ausentes · 0 duplicatas · 0 autorreferência | idêntico; `sha256sum -c` 47/47 OK | **CONFERE** |

**Nenhuma identidade material divergiu.** A auditoria prosseguiu para os testes.

### 3.1 Documentos externos — identidade conferida antes do uso

| documento | SHA-256 | bytes | linhas | BOM | CRLF | veredito |
|---|---|---|---|---|---|---|
| `AUDITORIA_INDEPENDENTE_MICROFASE_5_0_3.md` | `f0e20755…71af7cb5` | 43.152 | 660 | ausente | 0 | **CONFERE** |
| `ERRATA_POS_AUDITORIA_FAIL_MICROFASE_5_0_3.md` | `06ec99df…2f3d4887` | 15.399 | 375 | ausente | 0 | **CONFERE** |
| `AUDITORIA_INDEPENDENTE_REAUDITORIA_MICROFASE_5_0_3.md` | `e72f720d…ba5d63e31` | 34.882 | 590 | ausente | 0 | **CONFERE** |
| `ERRATA_DOCUMENTAL_POS_REAUDITORIA_MICROFASE_5_0_3.md` | `c62ca276…92593006` | 10.624 | 224 | ausente | 0 | **CONFERE** |

### 3.2 Completude do manifesto por oráculo independente

Oráculo próprio, independente do manifesto: o delta real da Phase 5.0 é
`git diff --name-only b2888f1 HEAD` ∪ `git status --porcelain` = **48 caminhos**. O manifesto
contém exatamente esses 48 **menos ele próprio** = **47**.

```text
entradas não-comentário            47
sha256sum -c                       47/47 OK · 0 divergências
caminhos ausentes do manifesto      0   (apenas o próprio manifesto, por desenho)
caminhos excedentes                 0
duplicatas de caminho               0
autorreferência em entradas         0
```

---

## 4 · Inventário criptográfico pre/post da árvore original

```text
escopo        toda a árvore, exceto .git/ e node_modules/
arquivos      247
PRE           ea1b14952458905d613c8e8ccd4c4e785d28767ef12d65cecd083c80a37fc9c6
POST          idêntico (três checkpoints: após a campanha de mutação, após a prova
              da guarda, e ao encerramento de todos os testes)
```

**A árvore original permanece byte a byte idêntica.** Nenhum teste, build, mutante, probe ou
oráculo foi executado nela.

### 4.1 Método de isolamento

Toda execução ocorreu em cópias temporárias completas, criadas com `cp -a` da árvore inteira
(rastreados + modificados + não rastreados + `node_modules`):

| cópia | finalidade |
|---|---|
| `/tmp/aud503` | campanha de mutação, prova da guarda, regressão integral, mutantes próprios |
| `/tmp/aud503p` | oráculos próprios: print (Chromium), suficiência (1024 vetores), pixels, geometria |

A identidade da cópia foi conferida contra a candidata **antes** de qualquer execução (mesmo
`HEAD`, mesmos 36 caminhos, acervo de evidência byte-idêntico).

---

## 5 · Boundary e completude do delta (§3)

### 5.1 Os 36 caminhos — lista real

**15 modificados**

```text
build_v32_html.py
docs_phase5/MANIFEST_PHASE5_P50.sha256
docs_phase5/evidence_p50/P50-5.0.1-default-collapsed-1440.png
docs_phase5/evidence_p50/P50-5.0.1-default-collapsed-390.png
docs_phase5/evidence_p50/P50-5.0.1-map-expanded-1440.png
docs_phase5/evidence_p50/P50-ACC6-P50-F2-1440.png
docs_phase5/evidence_p50/P50-ACC6-P50-F6-1440.png
docs_phase5/evidence_p50/P50-ACC6-selection-1440.json
docs_phase5/evidence_p50/P50-mutation-5.0.1.json
fixtures_p50.js
quickscan_secops_soccmm_v3_2_dev.html
tests_p50_chromium.js
tests_p50_core.js
tests_p50_mutants.js
ui_p50_v32.css
```

**21 novos**

```text
docs_phase5/MICROFASE_5_0_3_REPORT.md
ui_p50_results_v32.js
ui_p50_suff_v32.js
docs_phase5/evidence_p50/P50-5.0.3-*  (18 artefatos)
```

Os dois módulos da 5.0.3 — `ui_p50_suff_v32.js` e `ui_p50_results_v32.js` — estão **presentes**.
Zero staged. Zero temporários, caches, logs ou outputs não manifestados no delta: os únicos
caminhos ignorados são `node_modules/`, `print_evidence/`, `visual_evidence/` e `test-results/`,
todos cobertos pelo `.gitignore` e preexistentes ou vazios de conteúdo publicável.

### 5.2 Ordem de injeção no builder

`build_v32_html.py` foi editado **somente** com entradas de injeção, na ordem declarada pela §29.3:

```text
JS   … ui_session_v32.js → ui_p50_shell_v32.js → ui_p50_suff_v32.js → ui_p50_results_v32.js
CSS  … ui_v32.css → ui_ux_v32.css → ui_p50_v32.css
```

Nenhuma outra linha do builder foi tocada. **CONFERE.**

### 5.3 Boundary normativa recalculada (denominador definido, não herdado)

Os denominadores históricos `20/20` e `16/16` **não** foram aceitos. Recalculei a boundary
diretamente da lista nominal da §29.4 da `specs/PHASE_5_0_REV_B.md`:

| recorte da §29.4 | contagem | verificação contra `HEAD fe4a536a` |
|---|---|---|
| caminhos nominais individuais | **14** | **14/14 byte-idênticos** |
| suítes congeladas (`tests_*.js` menos os 3 módulos P50) | **13** | **13/13 byte-idênticas** |
| `tests_visual/` (árvore inteira) | **4** | **4/4 byte-idênticos** |
| `MANIFEST.sha256` do core 4.8.0.7 | **1** | **1/1 byte-idêntico** |
| **subtotal protegido §29.4** | **32** | **32/32 intactos** |
| `package.json` · `package-lock.json` (§29.3, edição autorizada **não exercida**) | **2** | **2/2 byte-idênticos** |
| **total** | **34** | **34/34 byte-idênticos** |

A aritmética do relatório está **correta** e a categorização é coerente com a spec, com uma
exceção documental registrada em `RQ-AUDFIN-1` (§10). `package.json` e `package-lock.json` foram
preservados: a autorização da §29.3 existia e **não** foi exercida nesta microfase.

---

## 6 · `B-AUD-503-1` — proveniência mutada da evidência · **FECHADO**

Fechado por reprodução própria. O handoff **não** foi aceito como prova.

### 6.1 Barreira preventiva (§4.1) — confirmada por busca exaustiva

Enumerei **todos** os pontos de criação de subprocesso em `tests_p50_mutants.js`:

```text
linha  85   build()  → execSync("python3 build_v32_html.py")   — não executa suíte, não escreve evidência
linha 101   run()    → execSync(cmd, { env: SUPPRESS_EVIDENCE })  — executor comum
```

Não existe terceiro caminho. Todos os usos de `m.cmd` — linhas 676, 699 e 750 — passam por `run()`.
Nenhum mutante precisa lembrar da flag: a supressão é aplicada **por construção** em

```js
const env = Object.assign({}, process.env, SUPPRESS_EVIDENCE, envOverride || {});
```

**Precedência sobre o ambiente herdado — provada, não presumida.** Executei a campanha completa com
`P50_NO_EVIDENCE=0` **exportado no ambiente pai**. A campanha ainda assim terminou com o acervo
29/29 byte-idêntico e zero escrita: `SUPPRESS_EVIDENCE` vem **depois** de `process.env` no
`Object.assign` e prevalece. O único `envOverride` do arquivo é o da própria prova não vacuosa
(linha 676), deliberado e autocontido.

Único escritor de evidência do produto é `tests_p50_chromium.js`, cuja escrita passa integralmente
por `writeEvidence()`/`shotElement()`/`shotViewport()`, todas guardadas por
`NO_EVIDENCE = process.env.P50_NO_EVIDENCE === "1"`. `tests_p50_core.js` **não escreve nada**.

### 6.2 Guarda detectiva (§4.2) — confirmada, inclusive nas três formas de violação

`GUARDED` fotografa o **diretório inteiro** `docs_phase5/evidence_p50/` — 29 artefatos, dos quais
18 do prefixo corrente `P50-5.0.3-*` e 11 históricos.

Verifiquei as três formas de violação por **injeção própria**, não por leitura de código:

| forma | como provei | resultado |
|---|---|---|
| **ALTERADO** | prova não vacuosa (`MUT_GUARD_PROOF=1`) | detectado e nomeado |
| **REMOVIDO** | mutante sintético meu (`AUDX`), com `cmd` que remove um PNG durante a execução | `REMOVIDO P50-5.0.3-relocked-1440.png` |
| **ADICIONADO** | o mesmo mutante, criando `P50-5.0.3-INTRUSO.png` | `ADICIONADO P50-5.0.3-INTRUSO.png` |

Nos dois últimos casos a guarda **abortou a campanha** e **restaurou os bytes**:

```text
Error: AUDX: acervo de evidência violado durante o mutante —
REMOVIDO P50-5.0.3-relocked-1440.png · ADICIONADO P50-5.0.3-INTRUSO.png
(bytes restaurados; campanha abortada · nenhuma evidência mutada sobrevive ao mutante seguinte)
```

O mutante sintético e a modificação do harness ocorreram **somente na cópia temporária**, com
restauração conferida por SHA-256 (`tests_p50_mutants.js` = `245337cb…`, íntegro).

### 6.3 Prova não vacuosa (§4.3) — os seis itens

Executada por mim (`MUT_GUARD_PROOF=1`, exit **0**):

```text
1. M20 sem supressão · exit=1
2. guarda detectou 2 violação(ões), 2 no prefixo corrente
     · ALTERADO P50-5.0.3-acc6-selection-1440.json (f77771d6b770091d != 23e0855ef4f2b611)
     · ALTERADO P50-5.0.3-sufficiency-surface.json (50e5165bfe76d19d != df9d970f08743641)
3. após restauração: 0 divergência(s)
4. barreira preventiva restaurada (P50_NO_EVIDENCE central em run())
5. M20 com supressão · exit=1 · violações=0
   M20 permanece DETECTADO pelo gate P50-SESUX1B (motivo semântico preservado)

PASS  MUT-GUARD-PROOF
```

| exigência da §4.3 | resultado |
|---|---|
| 1 · execução desprotegida reproduz contaminação material de `M20` | **SIM** — 2 artefatos do prefixo corrente reescritos |
| 2 · a guarda detecta as violações do prefixo corrente | **SIM** — ambas nomeadas |
| 3 · todos os bytes restaurados antes de continuar | **SIM** — 0 divergências |
| 4 · `M20` protegido não escreve evidência | **SIM** — violações = 0 |
| 5 · `M20` continua detectado pelo gate e motivo correto | **SIM** — exit 1, motivo semântico `P50-SESUX1B` |
| 6 · supressão afeta apenas escrita, não asserções | **SIM** — exit real preservado, asserções executadas |

Nenhum SHA de evidência limpa foi usado como oráculo funcional.

### 6.4 Evidência final limpa (§4.4) — confirmada por regeneração própria

| exigência | observado |
|---|---|
| veredito `PASS` nos JSONs correntes | `P50-5.0.3-sufficiency-surface.json` → `verdict: PASS`; `P50-5.0.3-acc6-selection-1440.json` → `verdict: PASS`; `P50-5.0.3-mutation.json` → `51/51` |
| zero ocorrência **binária** da string mutante `Estado da sessão: ` em todo o acervo | **0 arquivos** (busca binária sobre os 29, PNG incluídos) |
| mensagem honesta `Há alterações ainda não exportadas.` nas sete fixtures aplicáveis | **7 ocorrências** em `P50-5.0.3-sufficiency-surface.json` |
| 29 artefatos cobertos pelo manifesto | **29/29** |
| 18 artefatos do prefixo corrente reproduzíveis a partir de build limpo | **18/18** |
| campanha protegida deixa 29/29 byte-idênticos pre/post, zero escrita | **29/29**, zero escrita |

**Regeneração limpa independente.** Executei build limpo + `tests_p50_chromium.js` sem qualquer
supressão, em cópia temporária, e comparei o acervo regenerado com o acervo comitado:

```text
29/29 artefatos reproduzidos BYTE A BYTE — zero divergência
(inclui os 18 do prefixo corrente e o P50-5.0.3-mutation.json regenerado pela campanha)
```

`B-AUD-503-1` está **fechado**.

---

## 7 · `B-AUD-503-2` — neutralização de tela vazando para o print legado · **FECHADO EM PARTE**

### 7.1 O que foi corrigido — confirmado

`.p50-legacy-gone` e `.p50-legacy-veiled` estão confinadas a `@media screen`
(`ui_p50_v32.css`, linhas 323–326). Os substitutos novos da fase
(`#p50-suff`, `#p50-results`, `#app .p50-legacy-note`, `#p50-shell`, `.p50-chips`, `.p50-ses`)
estão em `display:none !important` sob `@media print`. Nenhum inline style e nenhuma manipulação
de DOM volta a ocultar nós congelados durante `preparePrint()`: a neutralização é feita por
`classList` + `aria-hidden`, e `preparePrint()` no modo legado apenas esvazia
`#v32-print-report` e remove `v32-print-mode`.

### 7.2 Oráculo próprio de print — método

Escrevi oráculo **independente**, sem reutilizar `pr1Measure()` nem qualquer função do
implementador. Ele compara candidato × baseline de ENTRADA da 5.0.3
(`5d1a301e…0c926cd`, materializado de `git show HEAD:`) sob a **mesma fixture** e a **mesma mídia
(`print`) em Chromium real**, percorrendo **todos** os nós congelados sob `#app` e comparando:

- **24 propriedades de estilo computado** por nó (não apenas visibilidade booleana);
- texto normalizado;
- caixa (`getBoundingClientRect`);
- render real: screenshot de página inteira, com diff de pixels em canvas.

### 7.3 Resultado — contraste decisivo

**Estado SUFICIENTE (`P50-F5`, gate liberado):**

```text
nós congelados comparados : 272
divergências              : 0
screenshot                : IDÊNTICO ao baseline
```

**Estado INSUFICIENTE (`P50-F3`, gate bloqueado):**

```text
nós congelados comparados : 248
divergências              : 6
screenshot                : DIFERENTE do baseline

  ESTILO position  | .radar-box            | base="static"  cand="relative"
  ESTILO opacity   | .ruler  (domínio 0)   | base="1"       cand="0.45"
  ESTILO opacity   | .ruler  (domínio 1)   | base="1"       cand="0.45"
  ESTILO opacity   | .ruler  (domínio 2)   | base="1"       cand="0.45"
  ESTILO opacity   | .ruler  (domínio 3)   | base="1"       cand="0.45"
  ESTILO opacity   | .ruler  (domínio 4)   | base="1"       cand="0.45"
```

O contraste é causal e não admite outra explicação: com o gate **liberado** o papel é
**pixel-idêntico** ao baseline; com o gate **bloqueado** — isto é, exatamente quando a
neutralização da Camada 5 está ativa — o papel diverge.

**Quantificação em pixels (mesma fixture, mídia `print`, Chromium real):**

```text
página          1440 × 4178  =  6.016.320 px
pixels distintos                  19.820
delta máximo de canal                124
bounding box     x 125–624 · y 612–887
```

**Atribuição geométrica exata.** Medi as caixas no papel: as cinco `.ruler` ocupam
`x=125, w=500`, em `y = 612, 679, 746, 813, 880`, `h=8`. A união dessas caixas é
`x 125–624 · y 612–887` — **idêntica** ao bounding box da divergência de pixels. Os 19.820 pixels
correspondem a 99,1% da área das cinco réguas (5 × 500 × 8 = 20.000 px). A divergência é
inteiramente das réguas de domínio.

`.radar-box` recebe `position:relative` no papel (`y 84–492`), **fora** do bounding box: é
divergência **latente**, hoje sem efeito de pixel, porque seu único filho novo
(`.p50-legacy-note`) está `display:none` em print.

### 7.4 Causa raiz

Em `ui_p50_v32.css`, duas regras de neutralização ficaram **fora** de `@media screen`:

```css
#app .radar-box.p50-legacy-off{ position:relative; }                    /* linha 328 */
#app .dom[data-p50-legacy="neutralized"] .ruler{ opacity:.45; }         /* linha 339 */
```

O atributo `data-p50-legacy="neutralized"` é aposto por `p50NeutralizeLegacy()`
(`ui_p50_results_v32.js`) e **não** é removido por `preparePrint()`. Como o modo legado imprime
`.wrap`/`#app` diretamente, a regra alcança o papel.

O comentário da própria §5.1 do CSS enuncia o princípio correto — *"a regra correta é NÃO agir no
print"* — mas o confinamento cobriu apenas `display` e `visibility`. `opacity` é atenuação visual
da mesma natureza e permaneceu descoberta.

### 7.5 Por que os guards não viram

- **`P50-PR1`** decide visibilidade por `seen()`, que só reprova `opacity === 0`; `0.45` é lido
  como visível. Sua comparação com o baseline cobre 12 campos — presença, texto, visibilidade
  booleana, contagens — e **nenhum** estilo computado contínuo. `.ruler` sequer entra no `diag`.
- **`M51`** apenas **remove o bloco `@media screen`**; não introduz nem exercita regra
  desconfinada fora dele. Detecta a regressão do vazamento já corrigido, não o resíduo.
- **Print congelado 23/23** e **`test:visual` 67/0/37** passam: nenhum deles afere opacidade dos
  nós legados sob gate fechado.

### 7.6 Guard e mutante (§5.3) — o que **está** confirmado

| exigência | resultado |
|---|---|
| `P50-PR1` positivo no candidato limpo | **PASS** (dentro de P50 Chromium 5/5) |
| mutante que remove o confinamento `@media screen` detectado pelo guard e motivo correto | **`M51` DETECTADO** — `FAIL P50-PR1 … [print: valor do domínio 0 ausente do papel · …]` |
| print congelado 23/23 ainda passa | **23/23 · exit 0** |
| `P50-PR1` não declara `P50-VIS10` encerrado ou redefinido | **CONFIRMADO** — rótulo do gate, evidência JSON e sete pontos do relatório afirmam explicitamente o contrário |

**Conclusão:** o vazamento **binário** (sumiço de conteúdo) está fechado. O vazamento
**contínuo** (atenuação) não está. `B-AUD-503-2` não pode ser declarado integralmente fechado, e
"print legado preservado" não pode ser demonstrado — ver `B-AUD-FIN-503-1` (§10).

---

## 8 · Contrato de suficiência e coerência funcional (§6)

| exigência | resultado |
|---|---|
| `dataSufficiency()` permanece fonte funcional canônica e byte-idêntica | **SIM** — `quickscan_secops_soccmm_v3_1_3.html:512-514`, `return confirmedCount() >= 10 && stats.every(s=>s.n>=2)`; Camada 1 byte-idêntica ao `HEAD` |
| camada derivada não cria owner paralelo | **SIM** — lê `confirmedCount()` e `domStat(i).n`, as funções reais do runtime congelado |
| única declaração autorizada dos limiares na Camada 5 | **SIM** — `var P50_SUFF_REQUIRED = { global: 10, domain: 2 };`, ocorrência única |
| renderer consome a estrutura e não contém limiares literais paralelos | **SIM** — `ui_p50_results_v32.js` consome `window.__P50SUFF.contract()`; zero literal de limiar |
| `P50-SUF7` percorre 1024/1024 com oráculo independente | **SIM** — ver §8.1 |
| `P50-SUF8` percorre 1024/1024 sobre o mesmo estado semântico | **SIM** — equivalência tripla `computeTargetProfile` = `dataSufficiency` = derivado |
| estado é restaurado entre vetores | **SIM** — verificado por mim, 0 falhas em 1024 |
| `P50-SUF0` rejeita recount por `ans`, DOM, `QS` ou fórmula duplicada | **SIM, com nuance** — ver §8.2 e `RQ-AUDFIN-3` |
| bloqueio/liberação/rebloqueio preservam coerência de tela e acessibilidade | **SIM** — `P50-SUF4`/`P50-SUF5` PASS; mutantes `M48`/`M49` detectados |
| nenhuma superfície apresenta score ou estágio enganoso sob insuficiência | **SIM** — `P50-SUF1`/`P50-SUF2` PASS; `M6`/`M47` detectados |
| UNSET não volta a ser zero geométrico | **SIM** — UG 13/13, `UG1`/`UG7`/`UG10` PASS |

### 8.1 Oráculo próprio dos 1024 vetores

Escrevi enumerador independente (nenhuma função de `tests_p50_core.js`), com aritmética própria,
aplicando o estado pelos setters canônicos e comparando três fontes por vetor:

```text
vetores enumerados      : 1024 / 1024
valores 0(NONE)/null/NA : 3840 / 4096 / 3584
divergências            : 0
   (contrato derivado × minha aritmética × dataSufficiency real — as três coincidem)
falhas de restauração   : 0
leak de estado canônico : false
```

`0` (NONE) confirma; `null` e `"NA"` não confirmam. `UNSET ≠ NONE` preservado no eixo da moeda.

### 8.2 Mutante próprio de owner/recount — exigido pela §6

Escrevi mutante **adversarial e distinto** dos entregues. `M50` remove as leituras canônicas;
o meu as **mantém presentes e vivas**, derrotando o lint estrutural, e instala um owner paralelo
**silencioso, por fórmula duplicada**:

```js
/* AUD-OWN-1 · aplicado em ui_p50_suff_v32.js, somente na cópia temporária */
var shadow = 0;
for (var z = 0; z < domains.length; z++) { shadow += domains[z].confirmed; }
confirmedGlobal = shadow;                     /* override silencioso da moeda global */
```

Resultado — **DETECTADO**, com o motivo semântico exato:

```text
FAIL  P50-SUF0 — nenhum renderer é dono de lógica de suficiência; limiar declarado uma única vez
      [confirmedGlobal = 510 não reflete a sentinela (7) — moeda global recontada localmente]
```

A prova por sentinela de `P50-SUF0` tem poder discriminante real: o lint estrutural sozinho não
teria visto este mutante.

**Segundo mutante, e correção do meu próprio método.** Escrevi também um mutante de recontagem por
**DOM** (`li.p50-q[data-p50-ans="confirmed"]` sob `#p50-shell .p50-dom[data-dom=i]`). `P50-SUF0`
retornou PASS. Antes de tratar isso como lacuna, sondei a **vivacidade** do mutante: na superfície
de resultados `#p50-shell` **não está no DOM** (`shellPresent: false`, `domSections: 0`), e a sonda
do build mutado é **idêntica** à do build limpo em todos os campos. O mutante é **código morto** —
o PASS está **correto** e não é fraqueza do gate. Fica apenas a observação de endurecimento
`RQ-AUDFIN-3`.

Ambos os mutantes foram aplicados **exclusivamente** na cópia temporária, com restauração conferida
por SHA-256 (`ui_p50_suff_v32.js` = `cdb4a6ed…`, HTML = `4c7f678b…`).

---

## 9 · Verificação documental (§7) — `RQ-REAUD-1`

Li o relatório inteiro (1.492 linhas), não apenas as seções finais.

### 9.1 Varredura das ocorrências superadas

| padrão | ocorrências | todas identificadas na própria unidade textual? |
|---|---|---|
| `56b9bb5c` | 8 | **SIM** — "HTML de ENTRADA da errata", "REGISTRO HISTÓRICO — SUPERADO", coluna de tabela de antes/depois, nota de rótulo dedicada (§30) |
| `657.178` | 7 | **SIM** — sempre acopladas a `56b9bb5c` e ao rótulo de entrada |
| `49/49` | 4 | **SIM** — bloco precedido de "REGISTRO HISTÓRICO — SUPERADO PELA ERRATA PÓS-AUDITORIA … O `49/49` abaixo **não** é o estado corrente" |
| P50 Chromium com `4` | 5 | **SIM** — coluna *Baseline*, "REGISTRO HISTÓRICO", ou reconciliação explícita `4 → 5` |
| P50 CORE com `30` | 6 | **SIM** — RED pré-implementação (linha 41), coluna *Baseline*, ou reconciliação explícita `30 → 31` |
| `Build A` / `Build B` / `candidato` | — | **SIM** — bloco corrente `4c7f678b…` rotulado "Estado CORRENTE"; o anterior isolado em citação "REGISTRO HISTÓRICO — SUPERADO" |
| `20/20` e `16/16` | 4 | **SIM** — nunca reafirmados; §28.1 declara explicitamente que "nenhum dos dois é reafirmado aqui" |
| `32/32` e `34/34` | 4 | **SIM** — valores **correntes**, recalculados e por mim confirmados (§5.3) |
| `42/42` · `76d365a7` | 2 | **SIM** — bloco rotulado "Preflight estreito **de ENTRADA desta rodada** … **não** descrevem o estado corrente da árvore" |

Nenhuma ocorrência superada aparece sem rótulo inequívoco na sua própria unidade textual.

### 9.2 Consistência do estado corrente nas seções exigidas

Seções 5, 14, 17, 18, 28, 35 e 35.1 — todas consistentes e todas confirmadas por mim contra os
bytes:

```text
HTML 4c7f678b… · 651.513 bytes        CONFERE
P50 CORE 31/31                        CONFERE   (reexecutado, exit 0)
P50 Chromium 5/5 · zero SKIP          CONFERE   (reexecutado, exit 0)
mutação P50 51/51                     CONFERE   (reexecutada, exit 0)
evidências 29/29 pre/post             CONFERE   (reproduzido)
builds A/B iguais ao candidato        CONFERE   (reexecutado)
manifesto 47/47                       CONFERE   (oráculo independente)
```

### 9.3 Demais exigências da §7

| exigência | resultado |
|---|---|
| `RQ-REAUD-1` encerrada | **SIM** — §39; reconciliação verificada item a item |
| `RQ-REAUD-2` e `RQ-REAUD-3` registradas como backlog não bloqueante | **SIM** — §40, com declarações explícitas de não implementação |
| verificação técnica da sessão implementadora não importada como parecer independente | **SIM** — §38.1 e §41 declaram; o documento **não** está no repositório (conferido: ausente de `docs_phase5/`) |
| nenhum resultado de suíte apresentado como reexecutado durante a errata exclusivamente documental | **SIM** — §38: "**Nenhuma suíte foi reexecutada nesta rodada**"; §41 reitera |
| contradição factual residual não marcada | **NENHUMA ENCONTRADA** na varredura numérica e textual |

`RQ-REAUD-1` está **encerrada**. Registro uma imprecisão documental **distinta**, não coberta por
`RQ-REAUD-1`, em `RQ-AUDFIN-1` (§10).

---

## 10 · Regressão final obrigatória (§8) — resultados e códigos de saída

Todos os comandos executados **até a conclusão**, em cópia temporária, cada um com código de saída
próprio. Nenhum `PASS` atribuído a timeout, comando interrompido, `SKIP` indevido ou exit de
campanha parcial.

| # | verificação | exigido | observado | exit |
|---|---|---|---|---|
| 1 | campanha P50 de mutação | `51/51` | **51/51 detectados** · 0 não detectados | **0** |
| 2 | acervo de evidências pre/post | `29/29`, zero escrita | **29/29 byte-idênticos**, zero escrita | — |
| 3 | P50 CORE | `31/31` | **31 PASS · 0 FAIL de 31** | **0** |
| 4 | P50 Chromium | `5/5`, Chromium real, zero SKIP | **5 PASS · 0 FAIL de 5** · 0 SKIP | **0** |
| 5 | `P50-SUF7` | `1024/1024` | **1024/1024** (+ oráculo próprio 1024/1024) | **0** |
| 6 | `P50-SUF8` | `1024/1024` | **1024/1024** | **0** |
| 7 | engine | `105` | **105 PASS · 0 FAIL de 105** | **0** |
| 8 | UI 3.1/3.2/3.3.1/3.3.2/3.3.3 | `19+25+11+23+26` | **19 · 25 · 11 · 23 · 26** | **0** ×5 |
| 9 | UX 4.1 | `56` | **56 PASS · 0 FAIL de 56** | **0** |
| 10 | Target 4.3.1 | `30` | **30 PASS · 0 FAIL de 30** | **0** |
| 11 | Refinement 4.4 | `28` | **28 PASS · 0 FAIL de 28** | **0** |
| 12 | Journey 4.5 | `31` | **31 PASS · 0 FAIL de 31** | **0** |
| 13 | Icons 4.6 | `12` | **12 PASS · 0 FAIL de 12** | **0** |
| 14 | Session 4.8 | `97/97` | **97 PASS · 0 FAIL de 97** | **0** |
| 15 | UG (UG13 em Chromium real) | `13/13` | **13 PASS · 0 FAIL de 13**, UG13 em Chromium real | **0** |
| 16 | M41 | `COMPARAÇÃO PASS`, payload esperado | **COMPARAÇÃO: PASS** · payload `9794b267…3bed4365b` | **0** |
| 17 | visual | `67 passed / 0 failed / 37 skipped` | **67 passed · 0 failed · 37 skipped** | **0** |
| 18 | print congelado | `23/23` | **23 PASS · 0 FAIL de 23** (UI 3.3.2 PDF) | **0** |
| 19 | `P50-PR1` | PASS adicional | **PASS** | — |
| 20 | builds independentes A/B | iguais entre si e ao candidato | **A == B == `4c7f678b…62d4dd29`** | **0** ×2 |
| 21 | engine, M41 e boundary preservados | intactos | **intactos** · 34/34 byte-idênticos | — |
| 22 | manifesto | `47/47`, completude por oráculo independente | **47/47**, completude confirmada | — |

Ambiente: Node `v22.23.2`, Python `3.14.4`, Playwright `1.62.1`,
Chromium real `151.0.7922.34` (gerenciado pelo Playwright — `/opt/google/chrome/chrome` ausente
neste host), `pageErrors: []`.

**A campanha formal completa concluiu com exit `0`.** Nenhum `PASS` deste parecer deriva de
`MUT_ONLY`. Reproduzi `RQ-REAUD-3` de forma independente: `MUT_ONLY=M1` com `1/1` detectado sai com
código `1`, por comparar contra o inventário completo — direção **conservadora**, uma campanha
parcial nunca sai `0` indevidamente.

**A regressão integral está verde.**

---

## 11 · Blocker

### `B-AUD-FIN-503-1` — resíduo da neutralização de tela no papel legado

| campo | conteúdo |
|---|---|
| **Severidade** | **BLOCKER** |
| **Classe** | recorrência parcial de `B-AUD-503-2` |
| **Requisito violado** | REV B §29.6 e §23 (print/render protegido, sem semântica nova na Phase 5.0); §29.4 (superfície congelada de governança); §5.1 da instrução desta auditoria — *"nenhuma regra equivalente fora de `screen`"* |
| **Arquivo** | `ui_p50_v32.css` linhas **328** e **339** |

**Fato.** Duas regras de neutralização não foram confinadas a `@media screen`:

```css
#app .radar-box.p50-legacy-off{ position:relative; }
#app .dom[data-p50-legacy="neutralized"] .ruler{ opacity:.45; }
```

O marcador `data-p50-legacy="neutralized"` é aposto pela Camada 5 e não é removido por
`preparePrint()`. No modo legado a superfície impressa é `.wrap`/`#app`, logo as regras alcançam o
papel.

**Reprodução (oráculo próprio, Chromium real, mídia `print`):**

1. carregar o candidato `4c7f678b…`; `setArq(0)`; aplicar a fixture insuficiente `P50-F3`;
   `showResults()`;
2. disparar o evento real `beforeprint`; `emulateMedia({ media: "print" })`;
3. comparar estilo computado, texto e pixels contra o baseline de entrada `5d1a301e…`, na mesma
   fixture e na mesma mídia.

**Observado:**

```text
gate BLOQUEADO   → 6 divergências de estilo · screenshot DIFERENTE
                   5 × .ruler  opacity 1 → 0.45
                   1 × .radar-box position static → relative (latente, sem efeito de pixel)
                   19.820 px distintos · delta máx. de canal 124
                   bbox x 125–624 · y 612–887 = união exata das cinco réguas

gate LIBERADO    → 0 divergências · screenshot IDÊNTICO ao baseline
```

**Impacto.** A Phase 5.0 altera materialmente o relatório impresso legado numa superfície
congelada de governança que não lhe é autorizada, e o faz exatamente na condição que o blocker
anterior nomeou. O efeito é atenuação, não mutilação — texto, valores, `.conf`, fills, radar e
legenda permanecem presentes, legíveis e com o texto canônico — mas as cinco réguas de domínio
saem no papel a 45% de opacidade, com contraste reduzido. Os guards responsáveis são cegos ao
resíduo (§7.5), de modo que a condição pode reaparecer sem detecção. O relatório afirma "print
legado preservado"; a afirmação é verdadeira para conteúdo e visibilidade, e **falsa** para a
apresentação impressa.

**Correção mínima recomendada — NÃO implementada por esta sessão.** Mover as duas regras para
dentro do bloco `@media screen` existente, de modo que nenhuma decisão de neutralização atue no
print; e estender `P50-PR1` a comparar, contra o baseline de entrada, o estilo computado contínuo
dos nós congelados relevantes (no mínimo `opacity` e `position` de `.ruler`, `.fill`, `.conf`,
`.lbl > span`, `.radar-box` e `.scale-legend`), acrescentando mutante que introduza regra
desconfinada **fora** do bloco `@media screen` — classe que `M51` não cobre. A decisão sobre
escopo, sequência e autorização é do proprietário.

---

## 12 · Ressalvas não bloqueantes

### `RQ-AUDFIN-1` — `tests_p50_mutants.js` fora da lista fechada da §29.2 (documental)

`tests_p50_mutants.js` **não** consta da lista nominal e fechada de módulos novos da §29.2, nem da
§29.3. Foi criado na 5.0.1 (`70154a1b`), consta do manifesto e foi aceito nas duas auditorias
independentes anteriores. **Não é desvio novo da 5.0.3.** A imprecisão é do relatório: a §28.1 o
descreve como "autorizado pela §29.2/§29.3", o que a spec não sustenta. Impacto: governança
documental. Correção sugerida: reclassificar como desvio divulgado herdado da 5.0.1, ou promovê-lo
nominalmente em revisão da spec.

### `RQ-AUDFIN-2` — `P50-PR1` mede visibilidade binária, não apresentação

Consequência direta do blocker. `seen()` só reprova `opacity === 0`; a comparação com o baseline
cobre 12 campos, nenhum contínuo; `.ruler` não entra no `diag`. Correção sugerida junto com
`B-AUD-FIN-503-1`.

### `RQ-AUDFIN-3` — `P50-SUF0` sem proibição estrutural de recontagem por DOM (endurecimento)

O lint da camada derivada proíbe `ans[`, iteração de `ans`/`QS` e reprodução da fórmula de
confirmação, mas não proíbe `document.querySelector*` como fonte de recontagem. **Hoje não é
explorável** — provei que o shell não está no DOM na superfície de resultados, tornando tal
mutante código morto — e a prova por sentinela captura qualquer override vivo. Endurecimento
apenas.

### Ressalvas herdadas — avaliadas, sem consequência bloqueante nova

| id | avaliação |
|---|---|
| `RQ-REAUD-2` — colisão nominal `M50`/`M51` | **não bloqueante**, confirmada: arquivo, runner, cabeçalho e evidência próprios qualificam os resultados; nenhum gate `P50-*` em `tests_m42_m86.js` |
| `RQ-REAUD-3` — exit de campanha parcial sob `MUT_ONLY` | **não bloqueante**, reproduzida por mim; direção conservadora (parcial nunca sai `0`); campanha completa sai `0` |
| `RQ-AUD-7`, `RQ-AUD-8`, `RQ-AUD-9` | fora do escopo desta microfase; sem consequência bloqueante nova |
| `RQ-502-1` — Chromium `151.0.7922.34` ≠ revisão nominal `141.0.7390.37` | **não bloqueante**; divergência de ambiente explicitamente aceita; todos os gates em Chromium real, zero SKIP |
| `RQ-502-2` — fechamento amplo de acessibilidade com axe-core | previsto para 5.0.5; `@axe-core/playwright` corretamente ausente de `package.json` nesta microfase |
| autenticação · vault · deployment · hardening | fora de escopo |
| itens da 5.0.4 | nenhum presente; nenhum exigido |
| encerramento de `P50-VIS10` | **não** ocorreu, e o relatório afirma isso explicitamente em sete pontos |

---

## 13 · Veredito

# `FAIL`

Demonstrado, com oráculo próprio, nesta ordem:

| exigência da §10 | estado |
|---|---|
| `B-AUD-503-1` fechado por reprodução própria | **SIM** |
| `B-AUD-503-2` fechado por oráculo próprio | **NÃO** — resíduo mensurável, `B-AUD-FIN-503-1` |
| evidência final limpa e reproduzível | **SIM** — 29/29 reproduzidos byte a byte |
| print legado preservado | **NÃO** — 19.820 px divergentes sob gate bloqueado |
| contrato de suficiência correto | **SIM** — 1024/1024 por oráculo próprio |
| relatório documentalmente coerente | **SIM** — `RQ-REAUD-1` encerrada |
| regressão integral verde | **SIM** — todos os comandos exit `0` |
| árvore original byte-idêntica pre/post | **SIM** — 247 arquivos, inventário idêntico |

Sete das oito exigências estão satisfeitas. As duas que falham são a mesma: a preservação do print
legado sob gate fechado. O defeito é pequeno em superfície e grande em classe — é a reincidência,
em forma contínua, do mesmo vazamento que já causou um `FAIL`, numa superfície de governança que a
Phase 5.0 não está autorizada a alterar, e nenhum guard vigente o enxerga.

A candidata **não** está pronta para selagem. `B-AUD-FIN-503-1` deve ser corrigido e o guard
correspondente fortalecido, com reexecução da regressão de print e nova auditoria independente.

---

## 14 · Todas as não ações desta sessão

Nenhuma correção implementada · nenhum byte da árvore original alterado · nenhuma evidência
regenerada na árvore original · nenhum commit · nenhum push · nenhum PR · nenhum merge · nenhuma
tag · nenhum freeze · nenhuma release · nenhum deployment · microfase 5.0.4 não iniciada · parecer
não copiado para o repositório · `AUDITORIA_INDEPENDENTE_REAUDITORIA_MICROFASE_5_0_3.md` não
sobrescrito e não herdado como veredito · `P50-VIS10` não encerrado · nenhuma suíte enfraquecida ·
nenhum gate alterado · nenhum dado de cliente tocado · nenhuma autoauditoria.

Todos os mutantes, probes e oráculos desta auditoria viveram em `/tmp/aud503` e `/tmp/aud503p`,
cópias temporárias descartáveis, com restauração conferida por SHA-256.
