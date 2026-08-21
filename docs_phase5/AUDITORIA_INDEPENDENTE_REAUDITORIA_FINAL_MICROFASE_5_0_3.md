# REAUDITORIA INDEPENDENTE ESTREITA FINAL — MICROFASE 5.0.3

**Objeto:** correção final do blocker `B-AUD-FIN-503-1` (confinamento da neutralização da Camada 5
à mídia de tela) e fortalecimento de `P50-PR1` contra apresentação contínua.

**Veredito:** `PASS COM RESSALVAS NÃO BLOQUEANTES`.

---

## 1 · Declaração de independência

Esta sessão e este contexto:

- **não** implementaram a microfase 5.0.3;
- **não** implementaram a errata estreita, a errata pós-auditoria FAIL, a errata documental
  pós-reauditoria nem a errata final do blocker de print;
- **não** produziram `AUDITORIA_INDEPENDENTE_FINAL_MICROFASE_5_0_3.md` e, portanto, não aplicaram
  a própria correção;
- **não** editaram byte algum da candidata.

A sessão iniciou sem contexto anterior do projeto. A árvore original foi tratada como **somente
leitura** do primeiro ao último ato; toda execução geradora ou mutante ocorreu em duas cópias
temporárias completas (§5.1). Não houve autoauditoria, não houve reimplementação e nenhuma
correção foi proposta como código.

Escopo respeitado: reauditoria **estreita**. Áreas já aprovadas em rodadas anteriores não foram
reabertas sem evidência de regressão nova; o que se reauditou foi a correção do print, a sua prova,
a preservação da tela, o guard, a mutação, o relatório, o manifesto, a boundary e o determinismo.

---

## 2 · Identidade deste parecer

```text
arquivo   AUDITORIA_INDEPENDENTE_REAUDITORIA_FINAL_MICROFASE_5_0_3.md
local     C:\Users\usuario\Documents\Codex\2026-08-18\referenced-chatgpt-conversation-this-is-an-3\outputs
encoding  UTF-8 sem BOM · zero CRLF
SHA-256   publicado no arquivo irmão AUDITORIA_INDEPENDENTE_REAUDITORIA_FINAL_MICROFASE_5_0_3.md.sha256
          (calculado sobre os bytes entregues, no mesmo diretório)
```

Este parecer **não** sobrescreve nenhum parecer anterior; `AUDITORIA_INDEPENDENTE_MICROFASE_5_0_3.md`,
`AUDITORIA_INDEPENDENTE_REAUDITORIA_MICROFASE_5_0_3.md` e
`AUDITORIA_INDEPENDENTE_FINAL_MICROFASE_5_0_3.md` permanecem intactos no mesmo diretório. Este
documento **não** foi copiado para o repositório.

### 2.1 Prompt de execução — identidade conferida antes de agir

```text
PROMPT_REAUDITORIA_ESTREITA_FINAL_MICROFASE_5_0_3.md
SHA-256   6d634a6fb1f3eb733f9f4ee3b16182d34a563bdeac399db6f81b1b4df531c4c8   CONFERE
bytes     14.306                                                            CONFERE
linhas    380                                                               CONFERE
encoding  UTF-8 sem BOM · zero CRLF                                         CONFERE
```

### 2.2 Documentos externos — identidade conferida antes dos testes

| documento | SHA-256 observado | bytes | linhas | BOM | CRLF | veredito |
|---|---|---:|---:|---|---:|---|
| `AUDITORIA_INDEPENDENTE_FINAL_MICROFASE_5_0_3.md` | `8d9ed98c2ec9107097a613da9c4d1cb849115ad0e77d1ac8d2ddaed50584bbea` | 38.883 | 740 | ausente | 0 | **CONFERE** |
| `ERRATA_FINAL_BLOCKER_PRINT_MICROFASE_5_0_3.md` | `8550246cb2d0a560552d22187d3e487fbd0a8994a2beb8c0521ca0eb4652de63` | 12.819 | 328 | ausente | 0 | **CONFERE** |
| `HANDOFF_ERRATA_FINAL_BLOCKER_PRINT_MICROFASE_5_0_3.md` | `10d13b7d70becb194bc41562d16234728db43b472c890ec8ca38ac503b54a2a7` | 12.912 | 245 | ausente | 0 | **CONFERE** |

Os três foram lidos integralmente. O handoff foi tratado como **alegação**, não como prova: todas
as suas medições materiais foram refeitas por mim, com oráculo próprio, e são reportadas abaixo
como observação minha.

---

## 3 · Preflight da candidata

```text
repositório                    /mnt/c/Projetos/QuickScan-SOC-CMM/phase5
branch                         feat/phase5-5-0-3                                CONFERE
HEAD                           fe4a536a508ed592bf62d1545a90e399036bb43d         CONFERE
commits da 5.0.3 sobre HEAD    0  (HEAD = "Merge pull request #2 … 5-0-2")      CONFERE
staged                         0                                                CONFERE
caminhos no delta              36                                               CONFERE
tags                           0                                                CONFERE
trabalho/artefatos da 5.0.4    0                                                CONFERE
engine_v32.js                  9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a   CONFERE
payload funcional M41          9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b   CONFERE
                               (recalculado pelo harness real, não copiado do relatório)
```

### 3.1 Identidades correntes exigidas

| caminho | SHA-256 observado | bytes | linhas | BOM | CRLF | veredito |
|---|---|---:|---:|---|---:|---|
| `ui_p50_v32.css` | `57a6fa7204a5de3bce6527785f1c318ce47ecf2c0acfe5c04cabe488d77d7620` | 13.896 | 351 | ausente | 0 | **CONFERE** |
| `tests_p50_chromium.js` | `3295c91f2d12d932699a87bba85657c62127175f39cf028001580c324371052e` | 73.560 | 1.293 | ausente | 0 | **CONFERE** |
| `tests_p50_mutants.js` | `28f2e876d4f614baf83b02d0c23bbbf19a983d4b0a943e1b42d1f8c8c067ddf5` | 39.698 | 847 | ausente | 0 | **CONFERE** |
| `quickscan_secops_soccmm_v3_2_dev.html` | `04f9d7ba9c5534aff69fec5193ab7fd8548dae304eddf29fad1378c5de5639ab` | 651.969 | 6.292 | ausente | 0 | **CONFERE** |
| `docs_phase5/MICROFASE_5_0_3_REPORT.md` | `ea313469ea84df6dd6c1ed9b80b24220bd94c09469e5836e66efd56edb375ff5` | 108.492 | 1.808 | ausente | 0 | **CONFERE** |
| `docs_phase5/MANIFEST_PHASE5_P50.sha256` | `7ed08f982504087241647ff1326651064202f64cbd7969ec79937c0e86f2221b` | 6.776 | 64 | ausente | 0 | **CONFERE** |
| `docs_phase5/evidence_p50/P50-5.0.3-mutation.json` | `6cd79e682cace4dcaf22f22e8598a1120cdc20a159cd95ebcd0f6a05c3183da7` | 20.791 | 492 | ausente | 0 | **CONFERE** |
| `docs_phase5/evidence_p50/P50-5.0.3-sufficiency-surface.json` | `908df6d862ac73dbcd7c3ed231a64a334bc798261eadcce71fb9e120974a918c` | 169.751 | 3.620 | ausente | 0 | **CONFERE** |

**Nenhuma identidade material divergiu.** A auditoria prosseguiu para os testes.

### 3.2 Arquivos protegidos e normativos

`ui_v32.js` (`094db057…`), `ui_v32.css` (`78d68ed0…`) e `engine_v32.js` (`9a4a2e67…`) não aparecem
no `git diff` — **byte-idênticos ao `HEAD`**. `preparePrint()` e `buildPrintReport()` vivem em
`ui_v32.js` e, portanto, estão cobertos por essa igualdade. A boundary completa é conferida em §11.

O único caminho editado fora dos módulos novos é `build_v32_html.py`, e o diff é **exclusivamente
de injeção** (dois `open()` novos e a concatenação dos dois blocos `V32_P50_SUFF` / `V32_P50_RESULTS`
na ordem normativa) — nenhuma reestruturação de leitura, encoding, base HTML, output ou substituição.

---

## 4 · Distinção dos oito arquivos materialmente alterados

A errata final alterou bytes em **oito** caminhos: seis do conjunto principal e duas evidências
correntes. A contagem “seis caminhos” do handoff é **distinção de categoria**, não total.

| # | caminho | categoria | PRE (candidata FAIL) | POST (corrente) |
|---|---|---|---|---|
| 1 | `ui_p50_v32.css` | principal | `9fe665be…5b02f44a` | `57a6fa72…d77d7620` |
| 2 | `tests_p50_chromium.js` | principal | `8d3996b8…d32de308316` | `3295c91f…324371052e` |
| 3 | `tests_p50_mutants.js` | principal | `245337cb…50ecfd6c05fedb` | `28f2e876…8c8c067ddf5` |
| 4 | `quickscan_secops_soccmm_v3_2_dev.html` | principal (rebuild) | `4c7f678b…62d4dd29` | `04f9d7ba…5de5639ab` |
| 5 | `docs_phase5/MICROFASE_5_0_3_REPORT.md` | principal | `ff5d78b7…9528ac` | `ea313469…db375ff5` |
| 6 | `docs_phase5/MANIFEST_PHASE5_P50.sha256` | principal (por último) | `b61a1532…68a5cc2f` | `7ed08f98…6f2221b` |
| 7 | `…/P50-5.0.3-mutation.json` | evidência corrente | `a419cc09…` | `6cd79e68…c3183da7` |
| 8 | `…/P50-5.0.3-sufficiency-surface.json` | evidência corrente | `df9d970f…` | `908df6d8…974a918c` |

**Total material: 8.** Confirmo.

### 4.1 As outras 27 evidências — verificação mais forte que a alegada

O handoff alega que 27 das 29 evidências permanecem byte-idênticas. **Não me contentei com a
alegação nem com `mtime`.** Regenerei o acervo corrente inteiro em cópia temporária, a partir dos
bytes correntes das fontes:

```text
17 artefatos correntes P50-5.0.3-*  regenerados por `node tests_p50_chromium.js`
                                     (15 PNG + acc6-selection.json + sufficiency-surface.json)
 1 artefato   P50-5.0.3-mutation.json  regenerado pela campanha completa de mutação
11 artefatos históricos (P50-5.0.1-*, P50-5.0.2-*, P50-ACC6-*, P50-mutation-5.0.1.json)
                                     NÃO tocados pela barreira de prefixo — mtime preservado
---------------------------------------------------------------------------------------
29/29 BYTE-IDÊNTICOS ao acervo comitado na candidata
```

Chromium real `151.0.7922.34` (mesmo build usado pelo implementador), Playwright `1.62.1`,
Node `v22.23.2`. Portanto: as 27 não apenas “permanecem idênticas” — as **18 correntes são
integralmente reprodutíveis** a partir das fontes correntes, e as 11 históricas não são regraváveis
por desenho. Isto confirma, por reprodução independente, que a apresentação `screen` **não mudou**.

Observação de proveniência registrada por honestidade: `ui_p50_shell_v32.js`, `ui_p50_suff_v32.js`
e `ui_p50_results_v32.js` têm `mtime` dentro da janela da errata final, embora o handoff os declare
inalterados. A explicação é a campanha de mutação, que os tem como alvos (`MUTABLE`) e os reescreve
na restauração com bytes idênticos. Isso foi **provado**, não presumido, em §5.4.

### 4.2 Inventário criptográfico da árvore original — pre/post

```text
escopo     árvore inteira, exceto .git/, node_modules/, test-results/, playwright-report/
arquivos   246   (247 no recorte usado pelo parecer FAIL, que não exclui test-results/)
PRE        99e482f29103c48b9ba089aae1345ec7551dc6ac3e96d127c5bb3768a003d586
POST       99e482f29103c48b9ba089aae1345ec7551dc6ac3e96d127c5bb3768a003d586   IDÊNTICO
git POST   HEAD fe4a536a… · 36 caminhos · 0 staged · 0 tags
```

**A árvore original permanece byte a byte idêntica.** Nenhum build, teste, mutante, sonda,
screenshot, PDF ou oráculo foi executado nela.

---

## 5 · Método de isolamento e cópias temporárias

### 5.1 Cópias

| cópia | finalidade |
|---|---|
| `/tmp/p50audit` | regressão integral, campanha de mutação 53/53, suíte visual |
| `/tmp/p50aud2` | oráculos próprios: print (estilo/caixa/pixels/PDF), tela, mutante do auditor, reconstrução do CSS pré-errata |

Ambas criadas com `cp -a` da árvore inteira (rastreados + modificados + não rastreados + `.git` +
`node_modules`). Identidade da cópia conferida **antes** de qualquer execução: mesmo `HEAD`, mesmos
36 caminhos e **246/246 arquivos byte-idênticos** ao inventário PRE.

### 5.2 Sonda própria do print — não usa `P50-PR1` nem `pr1Measure()`

Escrita por mim, apenas na cópia temporária (`_auditor_print_probe.js`). Lê exclusivamente DOM e
estilo computado, e compara pixels e camada de texto do PDF.

```text
candidato   04f9d7ba9c5534aff69fec5193ab7fd8548dae304eddf29fad1378c5de5639ab   (conferido)
baseline    5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd   (materializado
            de `git show HEAD:quickscan_secops_soccmm_v3_2_dev.html`, hash conferido)
browser     Chromium real 151.0.7922.34 (Playwright-managed)
caminho     window.dispatchEvent(new Event("beforeprint"))  →  emulateMedia({media:"print"})
            (o listener REAL registrado por ui_v32.js; nunca preparePrint() direto)
estados     gate BLOQUEADO  (P50-F3)   ·   gate LIBERADO  (P50-F5, controle positivo)
```

**Repouso de animação.** A Camada 1 aplica `.screen{animation:fade .35s ease}`. Antes de cada
medição — dos **dois** lados e nas **duas** mídias — a sonda aguarda
`Promise.all(document.getAnimations().map(a => a.finished))` com corrida contra um timeout
**diagnóstico** de 3 s, mais 200 ms de folga, e depois **reconfere** que zero animação permanece em
`playState === "running"`. Timeout ou animação remanescente são registrados como **falha da sonda**,
nunca silenciados. **Nenhum CSS de produção foi removido, desabilitado ou reescrito para estabilizar
a medição.** Em todas as execuções: zero timeout, zero animação remanescente.

#### 5.2.1 Estilos, texto, caixa e cardinalidade

Comparados seletor a seletor e índice a índice, candidato × baseline, sob a mesma fixture e a mesma
mídia: presença, cardinalidade, identidade do nó (tag + classes congeladas), **texto renderizado**,
caixa (x/y/w/h), visibilidade efetiva e as oito propriedades `display` · `visibility` · `opacity` ·
`position` · `filter` · `transform` · `color` · `backgroundColor`.

| seletor | cardinalidade exigida | observada (cand./base.) |
|---|---:|---|
| `#app .grid2 .panel .dom .ruler` | 5 | 5 / 5 |
| `#app .grid2 .panel .dom .ruler .fill` | 5 | 5 / 5 |
| `#app .grid2 .panel .dom .conf` | 5 | 5 / 5 |
| `#app .grid2 .panel .dom .lbl > span` | 5 | 5 / 5 |
| `#app .radar-box` | 1 | 1 / 1 |
| `#app .scale-legend` | 1 | 1 / 1 |

```text
gate BLOQUEADO (P50-F3)
  modo legado real (isLegacyModeV32)            true   (candidato e baseline)
  #v32-print-report vazio · body sem v32-print-mode     confirmado
  .wrap e #app são a superfície impressa                confirmado
  divergências de estilo / texto renderizado / caixa    0
  notas P50 no DOM 17 · VISÍVEIS no papel               0
  #p50-shell / #p50-suff / #p50-results visíveis        0

gate LIBERADO (P50-F5)
  divergências de estilo / texto renderizado / caixa    0
  notas P50 no DOM 0 · visíveis no papel                0

pageErrors nos quatro contextos                         0
```

#### 5.2.2 Pixels

Screenshots `fullPage` das duas páginas, após o repouso, decodificados em canvas dentro do próprio
Chromium e comparados pixel a pixel (RGBA):

```text
gate BLOQUEADO   1440 × 4178   6.016.320 pixels comparados   DIVERGENTES: 0
gate LIBERADO    1440 × 4589   6.608.160 pixels comparados   DIVERGENTES: 0
```

Zero ruído ambiental. Nada foi aceito como ruído — não houve o que aceitar.

#### 5.2.3 Camada de texto do PDF

Conforme determinado, **hash binário de PDF não foi usado como oráculo de determinismo**. Gerei
`page.pdf({format:"A4"})` nos dois lados e comparei o **conteúdo textual** extraído com `pdftotext -layout`:

```text
gate BLOQUEADO   texto do PDF candidato == baseline   IDÊNTICO   (9.276 bytes)
gate LIBERADO    texto do PDF candidato == baseline   IDÊNTICO   (10.332 bytes)
zero string da Camada 5 no papel: "Não avaliado", "evidência insuficiente",
"diagnóstico parcial" → 0 ocorrências em ambos os PDFs do candidato.
(as 2 ocorrências de "n/d" no PDF bloqueado são do renderer CONGELADO e existem
 idênticas no baseline — o texto extraído é igual byte a byte)
```

Registro complementar, **não** usado como oráculo: neste ambiente os PDFs saíram também
binariamente idênticos nos dois estados.

#### 5.2.4 Observação informativa — `textContent` × texto do papel

Sob gate bloqueado, o `textContent` de `#app .radar-box` do candidato contém a mais a frase da nota
P50 (“Perfil de maturidade por domínio indisponível — evidência insuficiente.”), porque o nó novo
está no DOM. **Não é divergência de papel**, e verifiquei isso por três vias independentes:
`getComputedStyle(nota).display === "none"` em mídia print; `innerText` do contêiner congelado
idêntico ao baseline; e zero pixel e zero byte de texto de PDF divergentes. Registro a observação
por transparência; ela não sustenta ressalva.

### 5.3 Prova de que a sonda NÃO é vácua — blocker reproduzido de forma independente

Reconstituí o estado pré-errata na cópia temporária (as duas regras contínuas fora de
`@media screen`), reconstruí o HTML e rodei a **mesma** sonda:

```text
gate BLOQUEADO (P50-F3) · HTML reconstruído
  .ruler[0..4]  opacity   baseline "1"       → candidato "0.45"     (cinco réguas)
  .radar-box[0] position  baseline "static"  → candidato "relative"
  pixels divergentes: 19.820 de 6.016.320 · concentrados em y = 612, 679, 746, 813, 880
                      = união exata das cinco réguas
gate LIBERADO (P50-F5) · zero divergência
```

Reproduzi **exatamente** o que o parecer `FAIL` descreveu e o que a §43.2 do relatório registra,
inclusive o número `19.820` — obtido por implementação independente. `B-AUD-FIN-503-1` está,
portanto, reproduzido por mim antes de ser declarado fechado. A cópia foi restaurada byte a byte
(`ui_p50_v32.css 57a6fa72…`, HTML `04f9d7ba…`).

### 5.4 Prova decisiva de escopo — reconstrução exata do CSS pré-errata

Para eliminar qualquer dúvida sobre o que exatamente mudou, reconstruí o `ui_p50_v32.css`
**pré-errata** e o validei contra a identidade declarada na errata:

```text
ui_p50_v32.css reconstruído   9fe665be8e29af25a2e86ed2beda2e5774cbebb4feb6b6ce35c469ba5b02f44a
                              13.440 bytes · 344 linhas          IDENTIDADE EXATA DA ERRATA
diferença corrente ← pré      +456 bytes · +7 linhas, decompostos em:
                              +455 B = bloco de comentário B-AUD-FIN-503-1 (7 linhas)
                               −4 B  = as duas regras ganharam indentação de 2 espaços
                               +3 B  = fechamento " */" migrou para o fim do comentário
posições originais provadas   `#app .radar-box.p50-legacy-off{ position:relative; }` na linha 328
                              `#app .dom[…="neutralized"] .ruler{ opacity:.45; }`   na linha 339
```

Instalando **apenas** esse CSS na cópia temporária e reconstruindo:

```text
python3 build_v32_html.py  →  4c7f678b53202b4f540cb3694fec32c382303c42246d427a2615c4c462d4dd29
                              651.513 bytes    ==  HTML pré-errata declarado
```

**Consequência formal.** O HTML é a concatenação determinística de todas as fontes injetadas. Como
trocar somente o CSS reproduz **exatamente** o HTML pré-errata, fica provado que
`ui_p50_results_v32.js`, `ui_p50_suff_v32.js`, `ui_p50_shell_v32.js`, `build_v32_html.py`,
`engine_v32.js`, `ui_v32.js`, `ui_v32.css` e todos os demais módulos injetados são **byte-idênticos
ao estado pré-errata**. As alterações de `mtime` observadas em §4.1 são reescritas de restauração
com bytes idênticos, e a alegação “INALTERADOS” do handoff está **independentemente confirmada** —
não aceita sob palavra.

Fica igualmente provado que a mudança de CSS é **exatamente** a relocação documentada das duas
regras mais um comentário: nenhuma outra regra da Camada 5 foi alterada, adicionada ou removida.

---

## 6 · Inspeção estática do confinamento CSS

Inspeção direta de `ui_p50_v32.css` (351 linhas lidas integralmente) e busca exaustiva por
**todas** as classes `p50-legacy-*` e pelo atributo `data-p50-legacy` em `*.js`, `*.css` e `*.py`
do repositório — não me limitei às quatro regras citadas pelo handoff.

### 6.1 Dentro de `@media screen` (linhas 330–335) — exatamente quatro regras

```css
@media screen{
  #app .p50-legacy-gone{ display:none !important; }
  #app .p50-legacy-veiled{ visibility:hidden !important; }
  #app .radar-box.p50-legacy-off{ position:relative; }
  #app .dom[data-p50-legacy="neutralized"] .ruler{ opacity:.45; }
}
```

**CONFERE** — as quatro exigidas, incluindo o domínio neutralizado `.ruler { opacity:.45 }`.

### 6.2 Fora de `@media screen` — nenhuma regra atinge nó congelado do print

Tokens `p50-legacy-*` / `data-p50-legacy` fora do bloco `@media screen` aparecem em exatamente
quatro lugares, e em **todos** o nó estilizado é `.p50-legacy-note` — elemento **novo** da Phase 5:

| linhas | regra | nó estilizado | efeito no print |
|---|---|---|---|
| 337–341 | `#app .radar-box.p50-legacy-off > .p50-legacy-note{ position:absolute; … display:flex; … }` | `.p50-legacy-note` (novo) | nenhum: `display:none !important` em `@media print` prevalece |
| 342–345 | `#app .p50-legacy-note{ margin; color; font-* }` | `.p50-legacy-note` (novo) | nenhum |
| 346 | `#app .lbl > .p50-legacy-note{ margin; color }` | `.p50-legacy-note` (novo) | nenhum |
| 348–351 | `@media print{ … #app .p50-legacy-note{ display:none !important; } }` | nós novos P50 | oculta os novos |

Na regra 337 `.radar-box.p50-legacy-off` figura apenas como **ancestral** do seletor; não estiliza a
`.radar-box`. Confirmado empiricamente: em mídia print a `.radar-box` do candidato mede
`position: static`, idêntica à baseline (§5.2.1).

**Zero regra da Camada 5 fora de `@media screen` altera `display`, `visibility`, `opacity`,
`position`, `filter`, `transform`, `color`, `background` ou geometria de nó congelado do print.**

### 6.3 O DOM também não é mutado

`ui_p50_results_v32.js` neutraliza **sem** reescrever nó congelado: acrescenta `aria-hidden="true"`,
uma classe de ocultação e `data-p50-legacy`, e insere elementos **novos** ao lado. Nenhum
`textContent`, `style` inline ou remoção de nó congelado. Confirmado por leitura do módulo
(`legHide`/`legShow`/`legNote`/`legDropNote`/`p50NeutralizeLegacy`) e pelo texto do PDF idêntico
ao da baseline.

### 6.4 Superfícies congeladas de print

`ui_v32.js` (`094db057…`), `ui_v32.css` (`78d68ed0…`) — **byte-idênticos ao `HEAD`**, logo
`preparePrint()` e `buildPrintReport()` estão intocados. Confirmei também o mecanismo real do modo
legado: `preparePrint()` devolve `{legacy:true}`, esvazia `#v32-print-report` e **não** aplica
`v32-print-mode` ao `body`; `body.v32-print-mode .wrap{display:none}` não dispara e, portanto,
`.wrap`/`#app` **é** a superfície impressa. A premissa do blocker está correta.

---

## 7 · Preservação da tela

Sonda própria de tela (`_auditor_screen_probe.js`), Chromium real, mídia `screen`, gate bloqueado
com `P50-F3`, após repouso de animação:

```text
gate                                              blocked
.ruler[0..4] opacity                              ["0.45","0.45","0.45","0.45","0.45"]
.radar-box.p50-legacy-off presente                true
.radar-box position                               "relative"
nota do radar visível                             true
nota do radar position                            "absolute"
nota do radar contida na caixa do radar           true
texto da nota   "Perfil de maturidade por domínio indisponível — evidência insuficiente."
substitutos novos (P50) no DOM                    17
substitutos novos VISÍVEIS                        17
nós congelados retirados (data-p50-legacy=hidden) 17
   destes, com aria-hidden="true"                 17   (árvore acessível)
   destes, materialmente invisíveis               17   (tela)
valores de domínio legados visíveis                0
legenda de escala visível                          false
radar SVG visível                                  false
pageErrors                                         0
```

**17 substitutos novos** e **17 nós legados retirados da tela e da árvore acessível**, exatamente
como o contrato exige. A correção do print **não** desfez a honestidade da tela.

Coerência da evidência visual: os **15 screenshots correntes** da 5.0.3 e os dois JSONs de tela
foram regenerados por mim e saíram **byte-idênticos** aos comitados (§4.1) — a prova mais forte
disponível de que a apresentação `screen` não mudou.

---

## 8 · Auditoria de `P50-PR1`

Leitura integral do guard em `tests_p50_chromium.js` (linhas 664–1090) e conferência da evidência
corrente `P50-5.0.3-sufficiency-surface.json`.

| exigência | observado | veredito |
|---|---|---|
| declara contrato `P50-PR1/continuous-presentation-v1` | `PR1_STYLE_CONTRACT` e campo `contract` na evidência | **CONFERE** |
| permanece no namespace `P50-PR1` | ID único; zero namespace novo criado | **CONFERE** |
| mantém `P50-VIS10` aberto e integral | rótulo do gate, `vis10Statement` na evidência e §14/§36/§43/§45 do relatório | **CONFERE** |
| compara baseline × candidato em gate bloqueado e liberado | `pr1StyleState` × `{P50-F3 → blocked, P50-F5 → released}` | **CONFERE** |
| aguarda repouso de animações | `pr1Settle()` — `getAnimations().finished` com corrida de 2 s + 120 ms, nos dois lados | **CONFERE** |
| confere cardinalidade e identidade de nó | `count` vs `expect` e `tag`+`cls` por índice | **CONFERE** |
| compara as oito propriedades contínuas | `display · visibility · opacity · position · filter · transform · color · backgroundColor` | **CONFERE** |
| reprova qualquer divergência, não só `opacity === 0` | `pr1DiffStyles` compara valor a valor; `opacity` nunca é reduzida a booleano | **CONFERE** |
| diagnóstico com estado, seletor, índice, propriedade, baseline e candidato | formato `"<estado> · estilo divergente em <sel>[<i>] propriedade <p>: baseline <b>, candidato <c>"` | **CONFERE** |
| registra na evidência corrente | `/legacyPrintGuard/observed/continuousPresentation` com contrato, `baselineSha 5d1a301e…`, propriedades, seletores + `expect`, os dois estados, cardinalidades e `divergences: []` | **CONFERE** |
| não cria semântica de print da Phase 5 | exige `substitutesVisible === 0` de 17 e ausência de `#p50-shell/#p50-suff/#p50-results` no papel | **CONFERE** |

**Indisponibilidade da baseline nunca vira PASS vacuoso.** Verificado no código: quando
`pr1Baseline()` falha (repositório sem git, SHA divergente), o guard executa
`detail.push("oracle de apresentação contínua NÃO executado (…)")` e
`detail.push("baseline de entrada NÃO comparado (…) — oráculo (B) permanece exigido")`; como
`ok = detail.length === 0`, o resultado é **FAIL**, não SKIP nem PASS. O oráculo (B) — invariante da
Camada 1 por `legacySnapshot()`, exigindo o score canônico como prefixo do texto impresso — é
sempre exigido.

Além disso, o guard exercita a mídia `screen` sob gate fechado e **reprova** se a atenuação `0.45`,
o `position: relative` da `.radar-box` ou a saída da árvore acessível se perderem — isto é, a
correção do print não pode ser feita às custas da tela.

---

## 9 · Mutação não vacuosa

### 9.1 Campanha completa reexecutada por mim

```text
$ node tests_p50_mutants.js            (cópia temporária /tmp/p50audit)
MUTATION TESTING (5.0.1+5.0.2+5.0.3) [tests_p50_mutants.js · namespace P50]:
      53/53 mutantes detectados pelo gate e motivo esperados
DETECTADOS 53 · NÃO DETECTADOS 0 · exit 0
acervo de evidência: 29/29 byte-idênticos ao início (prefixo corrente incluído);
                     zero arquivo escrito durante a campanha
restauração: ui_p50_shell_v32.js OK · ui_p50_v32.css OK · ui_p50_suff_v32.js OK ·
             ui_p50_results_v32.js OK · html OK
```

Acervo reconferido por mim **após** a campanha contra a árvore original: **29/29 byte-idênticos**.

### 9.2 `P50::M51`, `P50::M52`, `P50::M53` — gate e motivo específicos

```text
DETECTADO  P50::M51 · remover o escopo @media screen da neutralização
           gate P50-PR1  →  FAIL [print: valor do domínio 0 ausente do papel · …]
           (classe BINÁRIA: sumiço de conteúdo — preservado e ainda detectado)

DETECTADO  P50::M52 · opacidade de neutralização desconfinada
           gate P50-PR1  →  FAIL [gate-bloqueado · estilo divergente em .ruler[0]
                                  propriedade opacity: baseline "1", candidato "0.45"]

DETECTADO  P50::M53 · posicionamento de neutralização desconfinado
           gate P50-PR1  →  FAIL [gate-bloqueado · estilo divergente em .radar-box[0]
                                  propriedade position: baseline "static", candidato "relative"]
```

O harness exige **regex de motivo** por mutante, e as regexes de `M52`/`M53` casam literalmente com
a divergência de `opacity` e de `position` contra a baseline. Portanto **nenhum** dos três é contado
por manifesto, por hash ou por consequência incidental de outro gate: `M52` e `M53` são invisíveis a
toda verificação anterior de presença, texto e visibilidade — só o oracle contínuo os enxerga.

### 9.3 Mutante próprio do auditor — `AUD-M1`

Criado por mim, **não** fornecido pelo implementador, atacando uma propriedade contínua **diferente**
(`filter`), somente na cópia temporária:

```css
#app .dom[data-p50-legacy="neutralized"] .conf{ filter: opacity(.45); }   /* fora de @media screen */
```

```text
P50-PR1  →  FAIL
  gate-bloqueado · estilo divergente em .conf[0] propriedade filter: baseline "none", candidato "opacity(0.45)"
  gate-bloqueado · estilo divergente em .conf[1] … [2] … [3] … [4]   (cinco índices nomeados)
P50 CHROMIUM: 4 PASS · 1 FAIL de 5
```

**Materialidade provada** (não é código morto): minha própria sonda, contra a baseline, mediu
**11.542 pixels divergentes** no papel bloqueado — e a camada de texto do PDF passou a divergir,
porque `filter` cria contexto de composição próprio. O mutante atinge o DOM real e o papel real.

Restauração após a prova: `ui_p50_v32.css 57a6fa72…d77d7620`, HTML `04f9d7ba…5de5639ab`, evidência
29/29 byte-idêntica — **byte-idêntica**, conferida.

**Conclusão:** `P50-PR1` é não vacuoso por `M51`, `M52`, `M53` e por um mutante independente de
propriedade não coberta pelos três.

---

## 10 · Regressão proporcional — executada por mim, cada comando até a conclusão

Cópia temporária `/tmp/p50audit`, cada suíte com o seu próprio código de saída. Nenhum PASS
atribuído a timeout, interrupção, `SKIP` indevido ou campanha parcial.

| verificação | exigido | observado | exit |
|---|---|---|---:|
| P50 CORE | `31/31` | **31 PASS · 0 FAIL de 31** | **0** |
| P50 Chromium | `5/5`, zero SKIP | **5 PASS · 0 FAIL de 5**, 0 SKIP | **0** |
| mutação P50 | `53/53` | **53/53 detectados** · 0 não detectados | **0** |
| `P50-SUF7` | `1024/1024` | **PASS** — 1024 vetores | **0** |
| `P50-SUF8` | `1024/1024` | **PASS** — 1024 vetores | **0** |
| UG (UG13 em Chromium real) | `13/13` | **13 PASS · 0 FAIL de 13** | **0** |
| `test:visual` | `67 / 0 / 37` | **67 passed · 0 failed · 37 skipped** | **0** |
| print congelado (UI 3.3.2 PDF) | `23/23` | **23 PASS · 0 FAIL de 23** | **0** |
| M41 | `COMPARAÇÃO PASS` + payload | **COMPARAÇÃO: PASS** · payload `9794b267…3bed4365b` | **0** |
| engine | `105` | **105 PASS · 0 FAIL de 105** | **0** |
| UI 3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | `19+25+11+23+26` | **19 · 25 · 11 · 23 · 26** | **0** ×5 |
| UX 4.1 | `56` | **56 PASS · 0 FAIL de 56** | **0** |
| Target 4.3.1 | `30` | **30 PASS · 0 FAIL de 30** | **0** |
| Refinement 4.4 | `28` | **28 PASS · 0 FAIL de 28** | **0** |
| Journey 4.5 | `31` | **31 PASS · 0 FAIL de 31** | **0** |
| Icons 4.6 | `12` | **12 PASS · 0 FAIL de 12** | **0** |
| Session 4.8 | `97/97` | **97 PASS · 0 FAIL de 97** | **0** |
| builds A/B | iguais entre si e ao candidato | **A == B == `04f9d7ba…5de5639ab`** · 651.969 B | **0** ×2 |
| boundary | `34/34` | **34/34 byte-idênticos ao `HEAD`** (§11) | — |
| manifesto | `47/47` | **47/47** por oráculo independente (§12) | — |

Ambiente: Node `v22.23.2` · Playwright `1.62.1` · Chromium real `151.0.7922.34` (`RQ-502-1`
mantida) · `pageErrors: []` em todos os contextos medidos.

---

## 11 · Boundary — 34/34 recontados por caminho

Recontagem própria a partir da lista nominal da §29.4/§29.3 da REV B, cada caminho comparado com o
seu blob em `HEAD fe4a536a`:

| recorte | contagem | verificação |
|---|---:|---|
| caminhos nominais individuais da §29.4 | 14 | **14/14 byte-idênticos** |
| suítes congeladas `tests_*.js` (excluídos os três módulos P50) | 13 | **13/13 byte-idênticas** |
| `tests_visual/` (árvore inteira) | 4 | **4/4 byte-idênticos** · zero caminho no `git status` |
| `MANIFEST.sha256` do core 4.8.0.7 | 1 | **1/1 byte-idêntico** |
| `package.json` · `package-lock.json` (§29.3, edição autorizada **não exercida**) | 2 | **2/2 byte-idênticos** |
| **total** | **34** | **34/34 intactos** |

O delta de 36 caminhos não contém nenhum caminho protegido.

---

## 12 · Manifesto — oráculo independente

```text
entradas não-comentário                        47
hashes recalculados dos bytes                  47/47 corretos · 0 divergências
caminhos ausentes                               0
caminhos excedentes                             0
duplicatas de caminho                           0
autorreferência                                 0
completude sobre o delta real                   36 caminhos do `git status`;
                                                todos cobertos, exceto o próprio manifesto
entradas fora do delta corrente                 12 — todas de artefatos da 5.0.1/5.0.2 já
                                                COMITADOS (conferido com `git ls-files`);
                                                legítimas num manifesto do delta da Phase 5.0
aritmética                                      (36 − 1 autorreferência) + 12 históricos = 47 ✔
evidência histórica alterada                    nenhuma
JSONs correntes que diferem do preflight        exatamente 2, os autorizados (§4)
temporários ou outputs estranhos                nenhum
```

---

## 13 · Relatório — leitura integral das 1.808 linhas

| exigência | observado | veredito |
|---|---|---|
| parecer `FAIL` e `B-AUD-FIN-503-1` registrados | §42: nome, SHA `8d9ed98c…`, 38.883 B, 740 linhas, veredito `FAIL`; §43 detalha o fato aceito | **CONFERE** |
| nenhuma alegação de `PASS` independente | §42 (bloco explícito), §45 e o fecho do documento | **CONFERE** |
| correção CSS descrita corretamente | §43.1/§43.2 — as duas regras contínuas, o modo legado, a relocação | **CONFERE** |
| guard descrito corretamente | §43.3–§43.5 — contrato, seletores, 8 propriedades, dois estados, repouso de animação | **CONFERE** |
| estado corrente: HTML `04f9d7ba…` · 651.969 B | §44.1 e §44.2 | **CONFERE** |
| P50 CORE `31/31` · Chromium `5/5` zero SKIP · mutação `53/53` · builds A/B == candidato · manifesto `47/47` | §44.1, tabela completa com exits | **CONFERE** |
| `RQ-AUDFIN-1` classificada como **desvio aditivo herdado da 5.0.1**, não autorizada nominalmente pela §29.2/§29.3 | §43.6, com a afirmação anterior explicitamente declarada incorreta e a spec **não** modificada | **CONFERE** |
| `RQ-AUDFIN-2` tratada pelo guard contínuo | §43.3–§43.5 e §44 | **CONFERE** |
| `RQ-AUDFIN-3` permanece backlog | §43.7, sem proibição estrutural de DOM acrescentada | **CONFERE** |
| `RQ-REAUD-1` permanece fechada | §39 preservada e íntegra; nenhuma reconciliação anterior foi desfeita | **CONFERE** |
| `P50-VIS10` permanece aberto | §14, §36, §43.3, §45 e `vis10Statement` na evidência | **CONFERE** |
| valores intermediários remanescentes claramente rotulados como históricos/entrada | **parcialmente** — ver `RQ-REAUD-FIN-1` em §14 | **RESSALVA** |

Verifiquei também, contra os bytes, as onze linhas da tabela de §5: sete conferem com a árvore
corrente e **quatro** carregam valores superados (§14).

---

## 14 · Ressalvas não bloqueantes

### `RQ-REAUD-FIN-1` — rótulo de “estado corrente” em seções superadas pela errata final

**Severidade:** baixa · **classe:** documental · **bloqueante:** não.

A errata final registrou corretamente o estado novo em §44.1 e §44.2, mas **não** rerrotulou as
seções anteriores que a errata documental havia acabado de reconciliar. Em consequência, valores
hoje superados continuam apresentados como correntes:

| local | valor apresentado como corrente | valor corrente real |
|---|---|---|
| §5, linha 141 (coluna “candidata FINAL corrente”) | `ui_p50_v32.css` `9fe665be…` · 13.440 B | `57a6fa72…` · 13.896 B |
| §5, linha 144 | `tests_p50_chromium.js` `8d3996b8…` | `3295c91f…` |
| §5, linha 145 | `tests_p50_mutants.js` `245337cb…` | `28f2e876…` |
| §5, linha 147 | HTML `4c7f678b…` · 651.513 B | `04f9d7ba…` · 651.969 B |
| §18, linhas 512–520, sob o rótulo **“Estado CORRENTE”** | `Build A == Build B == candidato = 4c7f678b…` · 651.513 B | `04f9d7ba…` · 651.969 B |
| §28, linhas 867–890, sob “o bloco abaixo é o estado **corrente**” | `mutação P50 51/51` e `Build … = 4c7f678b…` | `53/53` e `04f9d7ba…` |
| §35/§35.1, linhas 1333–1344, sob **“autoridade factual corrente do relatório”** | `Builds A/B … 4c7f678b…`; `HTML de SAÍDA 4c7f678b…` (651.513 B); `ui_p50_v32.css 9fe665be…` | `04f9d7ba…` (651.969 B); `57a6fa72…` |
| §40, linha 1478 | “a campanha completa de entrega **51/51** conclui com exit 0” | `53/53`, exit 0 |

É a **recorrência da classe de defeito de `RQ-REAUD-1`** — números intermediários apresentados como
estado corrente —, agravada por §35.1 declarar-se explicitamente “autoridade factual corrente”
enquanto carrega dois hashes superados.

**Por que não é bloqueante:** o manifesto está integralmente correto e é autoexecutável
(`sha256sum -c` 47/47); §44.1/§44.2 — as últimas seções do documento — registram o estado real com
precisão; nenhum comportamento de produto, gate, evidência ou build depende do rótulo; e todos os
valores superados são objetivamente verificáveis contra os bytes. O risco é o mesmo que
`RQ-REAUD-1` descreveu: um leitor que consulte §5, §18, §28 ou §35.1 em vez de §44.2 pode conferir a
árvore contra o HTML errado e concluir divergência onde não há.

**Correção mínima sugerida (não implementada por mim):** acrescentar, dentro de cada uma das
unidades textuais acima, nota de supersessão remetendo a §44.1/§44.2 — exatamente o tratamento que
a errata documental já aplicou a §14, §15, §18 e §30 — e substituir em §35.1 a expressão
“autoridade factual corrente” por referência explícita a §44.2. Rodada **documental**, sem tocar
código, teste, evidência ou build.

### Ressalvas herdadas — mantidas, verificadas, não reabertas

- **`RQ-502-1`** — Chromium `151.0.7922.34` ≠ revisão nominal `141.0.7390.37`. Confirmada por mim:
  é o browser efetivamente usado, em Chromium real, com zero SKIP. Divergência de ambiente aceita.
- **`RQ-502-2`** — fechamento amplo de acessibilidade com axe-core previsto para 5.0.5;
  `@axe-core/playwright` corretamente ausente de `package.json` (intocado).
- **`RQ-AUDFIN-1`** — `tests_p50_mutants.js` é desvio aditivo herdado da 5.0.1, divulgado,
  manifestado e aceito; regularização nominal na spec é ato do proprietário, não desta rodada.
- **`RQ-AUDFIN-3`**, **`RQ-REAUD-2`**, **`RQ-REAUD-3`**, `RQ-AUD-7/8/9` — backlog, sem consequência
  bloqueante nova nesta reauditoria.
- **`P50-VIS10`** — **aberto e integral**. `P50-PR1` não o encerra, não o redefine e não o substitui.

**Blockers abertos: nenhum.**

---

## 15 · Fechamento de `B-AUD-FIN-503-1`

| condição de fechamento | prova | veredito |
|---|---|---|
| defeito reproduzido de forma independente antes de aceitar a correção | §5.3 — 5 × `opacity 1→0.45`, `position static→relative`, 19.820 pixels | **SIM** |
| oracle próprio, independente de `P50-PR1` e de `pr1Measure()` | §5.2 — sonda escrita por mim, DOM/estilo/pixels/PDF | **SIM** |
| zero divergência contínua no print, gate **bloqueado** | 0 divergências de estilo/texto/caixa · 0 de 6.016.320 pixels · texto do PDF idêntico | **SIM** |
| zero divergência contínua no print, gate **liberado** | 0 divergências · 0 de 6.608.160 pixels · texto do PDF idêntico | **SIM** |
| nenhuma nota/substituto P50 visível no papel legado | 17 no DOM · 0 visíveis · 0 no texto do PDF | **SIM** |
| escopo da mudança provado exaustivamente | §5.4 — reconstrução exata do CSS pré-errata reproduz o HTML pré-errata | **SIM** |
| tela preservada | §7 — 5 × `0.45`, `.radar-box relative`, nota posicionada, 17/17 substitutos, 17/17 fora da árvore acessível | **SIM** |
| guard não vacuoso | §9 — `M51`/`M52`/`M53` por motivo específico + mutante próprio `AUD-M1` materialmente vivo | **SIM** |
| regressão integral verde com exits próprios | §10 | **SIM** |
| manifesto coerente | §12 — 47/47 por oráculo independente | **SIM** |
| relatório coerente | §13 — coerente quanto ao fato e ao estado; ressalva de rótulo em §14 | **PARCIAL** |
| árvore original byte-idêntica pre/post | §4.2 — `99e482f2…` idêntico | **SIM** |

**`B-AUD-FIN-503-1` está FECHADO**, por oráculo próprio e por reprodução independente do defeito
antes e depois da correção.

---

## 16 · Veredito

# PASS COM RESSALVAS NÃO BLOQUEANTES

A correção final do blocker de print da microfase 5.0.3 está **materialmente correta e provada**:
a neutralização da Camada 5 está integralmente confinada à mídia de tela, o print legado é
byte-a-byte e pixel-a-pixel indistinguível da baseline de entrada nos dois estados do gate, a
apresentação nova de tela permanece intacta e honesta, e `P50-PR1` passou a discriminar a classe
contínua de defeito que antes escapava — comprovado por três mutantes do implementador e por um
mutante independente meu.

A única ressalva é **documental e não bloqueante** (`RQ-REAUD-FIN-1`): seções anteriores do relatório
continuam rotulando como “estado corrente” valores superados pela própria errata final. Não afeta
código, gate, evidência, manifesto, build ou comportamento, e é corrigível numa rodada estritamente
documental.

Não declaro a microfase concluída, congelada, aprovada ou selada — isso é ato do proprietário.

---

## 17 · Não ações

Nenhuma correção implementada · nenhum byte da candidata editado · nenhum arquivo criado, alterado
ou removido na árvore original · nenhum commit · nenhum push · nenhum PR · nenhum merge · nenhuma
tag · nenhum freeze · nenhuma release · nenhum deployment · microfase 5.0.4 **não iniciada** ·
nenhum gate enfraquecido · nenhum namespace novo criado · nenhuma dependência instalada · spec REV B
não modificada · pareceres anteriores não sobrescritos · este parecer **não** copiado para o
repositório · nenhum dado de cliente tocado.

Toda execução geradora ou mutante ocorreu exclusivamente em `/tmp/p50audit` e `/tmp/p50aud2`.
Inventário da árvore original conferido antes, durante e depois: **idêntico**.

---

> Reauditoria independente estreita final da microfase 5.0.3 concluída; correção de print avaliada sem edição da candidata; árvore original preservada; aguardando decisão do proprietário sobre selagem e integração; nenhum trabalho da microfase 5.0.4 foi realizado.
