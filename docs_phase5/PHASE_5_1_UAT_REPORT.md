# PHASE 5.1 — UAT, RELATÓRIO EXECUTIVO E PREPARAÇÃO PARA PRODUÇÃO

Relatório de entrega da candidata. **A fase não é declarada concluída nem aprovada por este
documento**: a entrega para aqui e aguarda auditoria independente orientada a risco.

- Diretriz executada: `DIRETRIZ_PHASE_5_1_UAT_E_RELATORIO.md` · SHA-256
  `9755984e1e5665de878da578b00dcd94f4df91a4145f5596fd159d96b2eb2073` · 23.149 bytes · 454 linhas
- **Adendo documental executado na mesma rodada e na mesma branch:**
  `ADENDO_DOCUMENTACAO_PHASE_5_1_GUIA_DE_USO.md` · SHA-256
  `1896c270d5064a701dee062cfebf02f5d0fbfab15363da39196764859d75cef8` · 12.559 bytes · 347 linhas
  (identidades conferidas antes de qualquer edição)
- Branch: `feat/phase5-5-1-uat-report`
- Ambiente: Node v22.23.2 · Python 3.14.4 · Playwright 1.62.1 · Chromium 151.0.7922.34 (WSL2/Linux)

---

## 0 · ERRATA pós-auditoria independente (2026-08-22)

Esta seção foi acrescentada **depois** da auditoria independente orientada a risco
`AUDITORIA_INDEPENDENTE_PHASE_5_1_UAT_REPORT.md` · SHA-256
`6320eac04eae61d6078b2d59404e17423eea133456a89d855bdae73b32c1ff82` · 52.613 bytes · 880 linhas,
cujo veredito foi **`FAIL`** por um blocker. A errata é **estreita**: corrige o blocker B1 e fecha as
ressalvas **R1**, **R2** e **R3**. **Não reabre a fase, não declara conclusão, não congela e não
inicia fase nova.** As demais ressalvas (R4, R5, R6) permanecem como o parecer as classificou —
duas correções puramente editoriais delas estão declaradas no fim desta seção.

Preflight da errata conferido antes de qualquer edição e **sem divergência**: branch
`feat/phase5-5-1-uat-report`, HEAD `af279a685eacffb8c85c60976cf4c6a059b967d0`, zero commits sobre
`origin/main`, zero staged, branch não publicada, HTML `e8857a9d…a55b8513` (743.908 B), engine
`9a4a2e67…2b5d247a`, payload M41 `9794b267…f3ed4365b`, `USER_GUIDE.md` `fa8de3df…6baad06a`,
`README.md` `b7924ce0…a6322a64`, `PHASE_5_1_UAT_REPORT.md` `bd2ca220…3daa89784`, manifesto
`f0c6ed8c…16ce2f32` com **143/143** entradas válidas, `AGENTS.md` não rastreado e fora da entrega,
nenhum processo de teste, build, mutação ou geração de evidência ativo.

### 0.1 · B1 — blocker corrigido

**Defeito.** `buildPrintReport()` era o único dos cinco sítios do produto que calculava o agregado
**sem arredondar**. O número saía por `toFixed(1)` (que arredonda) e o **nome** da faixa saía de
`stageOf()` sobre o valor bruto. Em agregado dentro de `[faixa − 0,05 ; faixa)`, o relatório
publicava o número da faixa superior com o nome da faixa inferior — contra a jornada e a leitura
executiva do **mesmo** documento e contra a tela.

**Correção — uma linha, dentro da autorização nominal da §2.1 da diretriz para `ui_v32.js`:**

```js
/* ui_v32.js — buildPrintReport() */
const overall = suff && scored.length
  ? Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10
  : null;
```

Idêntica à forma já usada por `renderResults()`, `legacySnapshot()`, `computeTargetProfile()` e
`buildNarrativeSnapshot()`. Nada mais foi tocado: `stageOf()`, `domStat()`, `dataSufficiency()`,
`confirmedCount()`, engine e payload M41 permanecem byte-idênticos.

**Reprodução registrada antes da correção.** Com o HTML candidato `e8857a9d…a55b8513` intacto e o
gate novo já escrito, a primeira execução **FALHOU**, como devia:

```text
FAIL  P51-RPT6 — estágio coerente entre KPI, régua, jornada, leitura executiva e tela nas fronteiras
      [0.5: KPI diz 'Inexistente' e o canônico é 'Inicial']
```

Leitura medida no mesmo estado, antes da correção — a autocontradição intradocumento do parecer:

| superfície | antes | depois |
|---|---|---|
| KPI `Estágio indicativo` | `Inexistente` | `Inicial` |
| régua `[data-rl-read]` | `0.5 / 5 · Inexistente` | `0.5 / 5 · Inicial` |
| jornada do relatório | `Inicial` | `Inicial` |
| leitura executiva | “posiciona a operação em Inicial (0.5/5)” | idem |
| jornada na tela | `Inicial` | `Inicial` |

**Gate novo `P51-RPT6`** (jsdom, `tests_p50_core.js`) — ancora exatamente a propriedade que faltava:
*o valor alimentado à régua é o mesmo agregado canônico da tela*. `P51-RPT3` provava que a régua
**deriva** de `stageOf()`; não provava de que número ela derivava, e foi por essa fresta que o
defeito passou.

Não vacuidade construída dentro do gate, sem vetor escolhido a dedo: um oráculo próprio enumera as
**14** pontuações de domínio alcançáveis (domínios com `n=2` e `n=3` confirmadas) e as **537.824**
combinações, e seleciona, para cada score de fronteira exibido (`0.5 · 1.5 · 2.5 · 3.5 · 4.5`), um
vetor **dentro da janela do defeito** — aquele em que `stageOf(média bruta) ≠ stageOf(média
arredondada)`. O gate falha se qualquer das cinco janelas não for encontrada. A enumeração reproduz
de forma independente os números do parecer: **21.436 combinações divergentes · 3,99%**. Para cada
vetor o gate exige igualdade entre **cinco superfícies**: KPI de estágio, leitura da régua, nó
`Perfil atual` da jornada **no relatório**, leitura executiva e nó `Perfil atual` da jornada **na
tela**, todas contra `stageOf(legacySnapshot().overall).pt`; e exige que o número do KPI de score
seja o mesmo da régua e da leitura executiva.

### 0.2 · R1 — sinal do gap Current × Target, agora com gate

`P50-VIS9` já protegia o sinal do gap **por domínio**; a fresta era o gap **por prática**, na matriz
única de `ui_p50_results_v32.js` que alimenta heat map, drill-down, Current × Target e a tabela
acessível. Era ali que a mutação adversarial **AUD-02** do auditor sobrevivia a 162 gates.

**Gate novo `P51-VIS3`** (jsdom, `tests_p50_core.js`), com oráculo próprio construído de `SCORES` e
dos overrides do owner canônico de Target — nunca da matriz que valida. Em dois cenários (a fixture
`P50-F9` e um cenário com alvo declarado nas **15** práticas) exige, para cada célula:

- `data-p50-gap` **exatamente** `alvo − atual`;
- gap **estritamente positivo** sempre que o nível-alvo declarado for superior ao nível atual
  confirmado — a regra do próprio setter canônico;
- o **mesmo valor com o mesmo sinal** no rótulo acessível da célula, na coluna `Gap` da tabela
  acessível e no atributo da linha da tabela;
- o eixo por domínio coerente com o mesmo estado;
- **varredura final**: nenhum `data-p50-gap` negativo em superfície alguma dos resultados.

**Nenhuma linha de produto foi alterada por R1** — a ressalva era de assurance, e o produto entregue
já estava correto. `ui_p50_results_v32.js` permanece byte-idêntico (`4c2965f7…e4a8b66e`).

### 0.3 · R2 e R3 — duas imprecisões factuais do manual

- **R2 · `USER_GUIDE.md` §8.** Dizia “*Score 0–5. Média das respostas confirmadas. Por domínio e
  geral.*”. O score **geral** não é a média das respostas: é a média dos **cinco scores de domínio**,
  cada um já arredondado. O texto passou a separar as duas contas e a explicar por que os números
  divergem (cada domínio pesa o mesmo, independentemente de quantas perguntas foram respondidas).
- **R3 · `USER_GUIDE.md` §12.** Listava `Como interpretar → Régua 0–5 → Legenda dos domínios` como
  seções próprias. A ordem realmente emitida, medida no DOM de impressão, é
  `#pr-cover` (com `#pr-domlegend`) → `#pr-maturity` (com `#pr-stage-ruler`) → `#pr-howto` →
  `#pr-prios` → `#pr-findings` → `#pr-landscape` → `#pr-interp` → `#pr-support` → `#pr-journey` →
  `#pr-target` → `#pr-annex`. A lista foi reescrita para o documento real: a legenda está **na capa**
  e a régua está **dentro do resumo de maturidade**, antes da caixa interpretativa. Ficou declarado
  também que as seções 4 a 9 são condicionais.

**Gate novo `P51-DOC13`** (jsdom, `tests_p50_core.js`) — não confere redação, confere **fato**:

- monta uma sessão com quantidades **diferentes** de respostas confirmadas por domínio, prova que a
  média das respostas (`2.9`) e a média dos domínios (`3.0`) **divergem** nesse estado, e prova que o
  produto usa a segunda; só então exige que o manual descreva essa conta e recuse a redação antiga;
- reconstrói o relatório completo, compara a ordem real das seções com a lista numerada de §12 item
  a item, e exige que a legenda esteja dentro de `#pr-cover` e a régua dentro de `#pr-maturity`.

### 0.4 · Poder dos gates — quatro mutantes novos

A campanha passou de **16** para **20** mutantes, um por gate novo mais o regresso do blocker:

```text
M51-17 sinal do gap invertido na matriz única (= AUD-02)   -> P51-VIS3
M51-18 agregado do relatório sem arredondamento (= B1)     -> P51-RPT6
M51-19 manual volta à fórmula antiga do score geral (= R2) -> P51-DOC13
M51-20 manual volta a listar régua/legenda como seção (R3) -> P51-DOC13
```

**20/20 detectados** pelo gate e motivo esperados, todos com restauração byte a byte conferida.
A mutação que o auditor apontou como sobrevivente agora falha com
`[P50-F9 · mandate: gap -3.3 != alvo−atual 3.3]`, e o regresso do B1 falha com
`[0.5: KPI diz 'Inexistente' e o canônico é 'Inicial']`.

### 0.5 · Regressão da errata

Tudo reexecutado no repositório, com o HTML reconstruído pelo builder:

| suíte | baseline | observado | veredito |
|---|---|---|---|
| build determinístico A/B/C | mesmo SHA | 3 × `12bb950f…eebbf9d9` | **PASS** |
| ENGINE / MATRIZ | 105 | **105 · 0 FAIL** | **PASS** |
| UI 3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | 19 · 25 · 11 · 23 · 26 | idem, 0 FAIL | **PASS** |
| UX 4.1 · TARGET 4.3.1 · REF 4.4 | 56 · 30 · 28 | idem, 0 FAIL | **PASS** |
| JOURNEY 4.5 · ICONS 4.6 · SESSION 4.8 | 31 · 12 · 97 | idem, 0 FAIL | **PASS** |
| UNSET (UG) | 13 | **13 · 0 FAIL** | **PASS** |
| P50 CORE + P51 | 61 | **64 · 0 FAIL** (+`P51-RPT6`, `P51-VIS3`, `P51-DOC13`) | **PASS** |
| P50 CHROMIUM + P51 | 27 | **27 · 0 FAIL** | **PASS** |
| M41 | PASS + payload | **PASS** · payload `9794b267…f3ed4365b` | **PASS** |
| `test:visual` | 67 / 0 / 37 | **67 passed · 0 failed · 37 skipped** | **PASS** |
| mutação P51 | 16/16 | **20/20** | **PASS** |
| manifesto | 143 | **144 OK**, regenerado por último (+`P51-ERRATA-suites.txt`) | **PASS** |
| `git diff --check` | limpo | limpo | **PASS** |

`P50-GOV1` continua fixando byte a byte as superfícies protegidas da §29.4. `ui_v32.js` foi
**repinado** no valor da errata, com a identidade anterior registrada no próprio gate; nenhum outro
pino mudou. `engine_v32.js`, payload M41, `build_v32_html.py`, `package.json` e `package-lock.json`
permanecem byte-idênticos. As evidências de 5.0.1–5.0.5 permanecem byte-idênticas ao commit
auditado.

### 0.6 · Identidades após a errata

| arquivo | antes da errata | depois da errata |
|---|---|---|
| `ui_v32.js` | `6f1367d3f5806900eb409a8296d3a1c7d990309e824d28a7015adf3ced745159` | `61e71dcc191aabb2a74a7061173ede8a5d75fa5dda81bb03e7ad02360677d766` |
| `tests_p50_core.js` | `da1bd5c54cba0eedd373139ea86cfe8b5edb699b3bc2903d1409872befc20d6d` | `7481b674869a114d44f3c00c2db3d0ee418e659ebe2b852c956c3418f49d1794` |
| `tests_p51_mutants.js` | `f1bde5a764cd459c5b1efa73b8394e3289fbf9453671704edcf689bf60fc1c37` | `3e3a66ab048ef7c1bb7d77d0f2e7c50ee83a90dc33269763f0f78b17eede7839` |
| `USER_GUIDE.md` | `fa8de3df8125d6bd6ec8984153f66f710d59494e6563f7d526653dde1baad06a` | `98d97a2a3bf5f928a5f4a8e6995cb1b51e77e1a77897ec23aaabad01ccbd181d` |
| `quickscan_secops_soccmm_v3_2_dev.html` | `e8857a9da789367b6a20c4c0aa848cc3db550f99d243f052d12ccd1aa55b8513` | `12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9` (744.179 B) |

Também alterados pela errata, por consequência: este `docs_phase5/PHASE_5_1_UAT_REPORT.md` e
`docs_phase5/MANIFEST_PHASE5_P50.sha256`, que passou de **143** para **144** entradas com a
inclusão de `docs_phase5/evidence_p51/P51-ERRATA-suites.txt` e foi regenerado **por último**,
excluindo apenas a si próprio; `sha256sum -c` → **144 OK / 0 falhas**, zero duplicata de caminho,
zero autorreferência, zero caminho inexistente, e o delta de `git status --porcelain` integralmente
coberto exceto o próprio manifesto e o `AGENTS.md` de exclusão nominal declarada.

**Byte-idênticos e não tocados pela errata:** `engine_v32.js`, `ui_p50_results_v32.js`,
`ui_p50_suff_v32.js`, `ui_p50_shell_v32.js`, `ui_p50_v32.css`, `ui_v32.css`, `ui_journey_v32.js`,
`ui_target_v32.js`, `ui_session_v32.js`, `fixtures_p50.js`, `tests_p50_chromium.js`,
`tests_journey_m45.js`, `tests_session_m48.js`, `tests_visual/screen.spec.js`, `README.md`,
`build_v32_html.py`, `package.json`, `package-lock.json`. `AGENTS.md` **não** foi editado, apagado,
manifestado nem stageado.

### 0.7 · Evidência da errata gerada nesta rodada

- `docs_phase5/evidence_p51/P51-mutation.json` — **regenerado** pela campanha completa, agora
  **20/20**, com baseline e restauração por arquivo.
- `docs_phase5/evidence_p51/P51-ERRATA-suites.txt` — saída literal das suítes reexecutadas, da
  campanha de mutação, dos três builds determinísticos e do FAIL de reprodução do B1 **antes** da
  correção.

**Artefatos 5.1 anteriores não regerados.** Os `P51-report-*.pdf`, `P51-question-*.png`,
`P51-results-*.png`, `P51-layout-measures.json` e `P51-pdf-evidence.json` foram produzidos a partir
do HTML **`e8857a9d…a55b8513`** (pré-errata) por instrumentação ad hoc, não por suíte versionada, e
**não** foram regerados. A errata não altera nenhum deles materialmente: os cinco cenários de PDF
pontuam `n/d`, `1.0`, `1.2`, `0.0` e `5.0`, e **nenhum é score de fronteira** — é exatamente e apenas
na fronteira que a correção muda o que o documento diz. As medidas de layout e as capturas de tela
não dependem do agregado. Isto fica declarado como **limitação de evidência**, não como equivalência
provada byte a byte.

### 0.8 · Correções editoriais declaradas (fora das três ressalvas fechadas)

Duas frases deste próprio relatório estavam factualmente imprecisas e foram corrigidas na seção
correspondente, por serem afirmações que a auditoria conferiu e não reproduziu:

1. **§12 (R5 do parecer)** — a contagem “36/36 idênticos” de evidências reconferidas não reproduz.
   O auditor observou **29** arquivos regravados; nesta rodada foram **30**. Todos dentro do escopo
   declarado no cabeçalho do manifesto, e as evidências de 5.0.1–5.0.4 intactas. O texto passou a
   registrar o que se observa, em vez de um número que não se reproduz.
2. **§13.1 (R4 do parecer)** — “o import do documento resultante é recusado” era impreciso: na
   prática o **export** é recusado antes, o que é melhor. O texto foi ajustado.

Nenhuma das duas altera código, gate, cálculo ou conclusão.

---

## 1 · Baseline pre/post

| item | pré (exigido) | pré (observado) | pós (entregue) |
|---|---|---|---|
| branch | `main` | `main` | `feat/phase5-5-1-uat-report` |
| HEAD / `origin/main` | `af279a68…` | `af279a68…` / `af279a68…` | inalterado (zero commits) |
| ahead/behind | 0/0 | 0/0 | 0/0 |
| HTML | `c40d9735…efce09f` · 698.613 B | idem | `12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9` · 744.179 B (**pós-errata**; era `e8857a9d…a55b8513` pós-adendo — ver §0) |
| engine | `9a4a2e67…d247a` | idem | **idêntico** |
| payload M41 | `9794b267…4365b` | idem | **idêntico** |
| manifesto | 114/114 | 114/114 OK | regenerado por último (ver §10) |
| preview 5.0 | `127.0.0.1:1338` | HTTP 200 | serve o build 5.1 por bind |
| produção V3.2 | `127.0.0.1:1337` | HTTP 200 · `8d0932e1…` | **intocada** |

**Observação de preflight:** o worktree continha **um arquivo não rastreado**, `AGENTS.md`
(espelho do `CLAUDE.md`, criado em 2026-08-22 03:47, após o merge da Phase 5.0). Não é artefato desta
rodada, não toca byte auditado algum e todos os hashes de identidade conferiram — não foi tratado
como divergência material. **Não foi apagado, editado nem incluído** em qualquer entrega.

---

## 2 · Arquivos alterados e justificativa

| arquivo | por quê | SHA-256 final |
|---|---|---|
| `ui_p50_shell_v32.js` | UAT-02 (rótulo de apresentação), UAT-03 (remoção do proxy de evidência), UAT-04 (tabela de ajuda por `qid`), RPT-02 (owner de metadados de sessão), alinhamento da ponte `__DEV` ao wrapper | `f8302d68f61bc37c5064a657120f52abb68b81ca2861541f0550e3ae787b4bd0` |
| `ui_p50_v32.css` | UAT-01 (composição em duas colunas), UAT-05 (régua da jornada em tela), UAT-08 (legibilidade do select), estilos de UAT-02/04 | `749cbb989ddcb51feaef3af5dd8cbc6caf1cbc08eac70da60bde36cca239dc93` |
| `ui_v32.js` | RPT-01 (capa), RPT-02 (metadados), RPT-03 (régua derivada), RPT-04 (legenda), RPT-05 (emblema e faixa), UAT-07 (apoio junto do gap), pelo adendo a caixa **Como interpretar este relatório** e, pela **errata**, o agregado canônico de `buildPrintReport()` (§0.1) | `61e71dcc191aabb2a74a7061173ede8a5d75fa5dda81bb03e7ad02360677d766` |
| `ui_v32.css` | estilos de capa, régua, legenda, apoio, jornada **no papel** e da caixa interpretativa | `acb0eba165ef25e6b97475430e9b042a9b39038be2b9882ec5b3c67a730faa6f` |
| `ui_journey_v32.js` | UAT-05 (seis nós numerados, estados por atributo, classes legadas preservadas) | `4758148a94f4b6e788fc7bf7bef13ab00150f68c0a050308b694bacbf51ecade` |
| `tests_p50_core.js` | 11 gates P51 + **12 gates P51-DOC** do adendo + repin da boundary autorizada pela §2.1 + **3 gates da errata** (`P51-RPT6`, `P51-VIS3`, `P51-DOC13`) e repin de `ui_v32.js` (§0) | `7481b674869a114d44f3c00c2db3d0ee418e659ebe2b852c956c3418f49d1794` |
| `tests_p50_chromium.js` | gates P51-VIS1/VIS2/PDF1 (o de PDF passou a exigir a caixa interpretativa) + acionador de evidência atualizado | `39f932c636b514b8dde21edd0178b97dba0fcf9f33dc6021ffa71584fb7cf029` |
| `tests_journey_m45.js` | consequência autorizada da UAT-05 (ver §8) | `1e839d737c907a29d4fb91491ce9816a7ec9262ffcdcbd78eea6f1dab4817a16` |
| `tests_session_m48.js` | consequência autorizada da RPT-02 (ver §8) | `5b4174b79fd110aa50fd74c06410423c3b17db9a6056abf9cf008ce00be5f181` |
| `tests_visual/screen.spec.js` | consequência autorizada da UAT-05 (ver §8) | `18e2b8f69d3e7b4e2e6a43d6d6ac325724e8ef80c8d4afcdbdd76d8ee27f692a` |
| `tests_p51_mutants.js` | **novo** · harness de mutação da Phase 5.1; a errata acrescentou **M51-17 a M51-20** (§0.4) | `3e3a66ab048ef7c1bb7d77d0f2e7c50ee83a90dc33269763f0f78b17eede7839` |
| `quickscan_secops_soccmm_v3_2_dev.html` | derivado do builder | `12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9` |
| `USER_GUIDE.md` | **novo** · manual de utilização e interpretação (adendo §1–§2); a errata corrigiu §8 e §12 (§0.3) | `98d97a2a3bf5f928a5f4a8e6995cb1b51e77e1a77897ec23aaabad01ccbd181d` |
| `README.md` | **novo** · landing page do produto, apontando para o manual (adendo §3) | `b7924ce0f142ad773e7159f0dd726a26aec1122214c87039ff31b3a5a6322a64` |

**Byte-idênticos ao `HEAD`, verificados um a um:** `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`,
`ui_ux_v32.js`, `ui_ux_v32.css`, `ui_target_v32.js`, **`ui_session_v32.js`**, `ui_p50_suff_v32.js`,
`ui_p50_results_v32.js`, `fixtures_p50.js`, `tests_p50_mutants.js`, `build_v32_html.py`,
`package.json`, `package-lock.json`.

Vale destacar `ui_session_v32.js`: a §2.1 permitia editá-lo para expor metadados, mas **não foi
preciso**. O owner de metadados vive na Camada 5 e consome o wrapper de sessão que já existia, de
modo que o schema v1, a política de compatibilidade e a suíte SESSION 4.8 permanecem intocados.

---

## 3 · Decisão de layout (UAT-01)

Medido no preview real, em `#p50-shell` × `#app`, com o mapa aberto:

| viewport | `.wrap` / tela | sobreposição horizontal | overflow | composição |
|---|---|---|---|---|
| 390 × 844 | 390 / 390 (100%) | 354 px | 0 | uma coluna |
| 768 × 1024 | 768 / 768 (100%) | 722 px | 0 | uma coluna |
| 1024 × 768 | 1024 / 1024 (100%) | 963 px | 0 | uma coluna |
| 1440 × 900 | 1360 / 1440 (94%) | **0 px** | 0 | **duas colunas reais** |
| 2560 × 1080 | 2100 / 2560 (82%) | **0 px** | 0 | **duas colunas reais** |

A partir de 1180 px a `.wrap` da tela de pergunta vira grade de duas colunas: a **pergunta ocupa a
coluna principal** e o shell (orientação + mapa) passa a ser um trilho lateral com `position:sticky`.
A pergunta deixa de começar abaixo de toda a lista de domínios. Em ultrawide a largura acompanha a
viewport (`min(94vw, 2100px)`) e a **linha de leitura** é limitada a 1180 px dentro da coluna
principal, de modo que aproveitar a tela não vira uma linha de texto interminável.

Ordem de foco e leitura: o DOM mantém shell → `#app`. A orientação (domínio, posição, progresso,
navegação) é contexto legítimo antes da pergunta, nenhum nó é duplicado e nenhuma superfície
congelada foi reescrita — a correção é de layout. Nada disso alcança o papel: tudo está confinado a
`@media screen`.

---

## 4 · Tabela `qid` → orientação e exemplo (UAT-04)

Tabela única da Camada 5, indexada pelo `qid` canônico, com 15 entradas e 15 exemplos distintos.
Linguagem descritiva; nenhuma entrada sugere resposta, exige vendor ou inventa dado do cliente.

| `qid` | O que registrar | Exemplo |
|---|---|---|
| `mandate` | charter, patrocínio, metas, fórum de revisão e responsável | charter aprovado pelo CISO em 03/2025; sponsor é o Diretor de TI; metas revistas no comitê trimestral |
| `governance` | cadência do comitê, decisões, RACI, métricas e aprovações | comitê mensal com ata; RACI publicado; três métricas; exceções aprovadas pelo dono do risco |
| `policies` | políticas aplicáveis, revisão, exceções, retenção e LGPD | política revista anualmente; exceções com prazo e dono; retenção de 12 meses; DPO consultado |
| `team-capacity` | cobertura de horário, funções, turnos, FTEs e dependências | quatro analistas das 8h às 18h, um líder técnico, plantão por sobreaviso; duas funções acumuladas |
| `training` | plano, trilhas por função, exercícios, certificações e frequência | trilha de detecção para N1; tabletop semestral; duas certificações; sem orçamento formal |
| `knowledge` | runbooks, handover, repositório e bus factor | runbooks cobrindo 6 de 12 cenários; handover verbal; conhecimento de rede concentrado |
| `incident-response` | plano, severidades, SLA, acionamento e pós-incidente | plano com quatro severidades; acionamento por telefone; pós-incidente só para severidade 1 |
| `detection-lifecycle` | inventário de casos de uso, owners, ciclo de vida, tuning e cobertura MITRE | 40 regras sem dono formal; revisão sob demanda; cobertura ATT&CK não medida |
| `automation` | playbooks, integrações, aprovações e rollback | dois playbooks de enriquecimento; integração com service desk; bloqueio exige aprovação; rollback manual |
| `logs` | fontes, retenção, parsing, correlação e lacunas | firewall, AD e endpoint; 90 dias em linha; servidores de aplicação fora da coleta |
| `endpoint` | cobertura, gerenciamento, EDR/XDR, isolamento e exceções | antivírus em 95% e EDR em 40%; servidores críticos com exceção; isolamento não habilitado |
| `network-visibility` | segmentos, NDR, leste-oeste, tráfego criptografado e lacunas | visibilidade no perímetro; VLANs sem inspeção; TLS sem inspeção; fábrica fora do escopo |
| `monitoring-coverage` | horário, plantão, SLA e escalonamento | **MSSP cobre 8×5; plantão interno fora do horário; SLA P1 de 30 min** |
| `external-surface` | EASM/DRPS, credenciais expostas, frequência e tratamento | inventário externo em planilha; varredura trimestral; credenciais checadas de forma reativa |
| `vulnerability-management` | escopo, varredura, priorização, SLA, exceções e validação | varredura mensal em servidores; estações fora do ciclo; SLA de 30 dias; correção sem reteste |

O exemplo de **MSSP/SLA ficou exclusivamente em `monitoring-coverage`** — asserido pelo gate
P51-UX2, que percorre as 15 perguntas (inclusive a 15ª, que o caminho congelado não alcança sem
`gotoStep`) e exige 15 exemplos distintos.

---

## 5 · Matriz gap → capability → opções → condição (UAT-07)

O apoio passou a aparecer **dentro do card do gap**, logo após evidência e capability. A capability
nomeada é a **canônica do motor** (`MAP[qid].cap`), não uma segunda redação — um único dono do nome.

| `qid` do gap | opção | condição / limitação declarada |
|---|---|---|
| `detection-lifecycle` | FortiSIEM | coleta, correlação e analytics quando a detecção precisa cobrir fontes heterogêneas |
| | FortiAnalyzer | logging e analytics quando a operação já é majoritariamente Fortinet |
| | FortiSOAR | orquestração do ciclo de investigação e resposta |
| | FortiSOC | opção de plataforma integrada — **nunca produto obrigatório** |
| `logs` | FortiAnalyzer | logging e analytics no ecossistema Fortinet declarado |
| | FortiSIEM | necessidade SIEM ampla de TI/OT, múltiplas fontes e correlação em escala |
| | FortiSOC | abordagem integrada, **condicionada à arquitetura declarada** |
| `automation` | FortiSOAR | playbooks, integrações e padronização do tratamento |
| | Automação nativa de FortiAnalyzer/FortiSIEM | **somente** quando necessidade e arquitetura declaradas forem compatíveis |
| `vulnerability-management` | FortiClient administrado por EMS | descoberta, inventário, varredura e patching **no escopo de endpoint**; **não substitui** uma plataforma completa de gestão de vulnerabilidades |
| | FortiRecon | exposição externa (EASM/DRPS) — **não** a gestão interna |

Regras aplicadas: sem contexto declarado para a capability, o bloco diz **"validar aderência"** em
vez de recomendar, mantendo a ressalva de escopo visível; com contexto declarado, uma frase explica
**por que** a opção apareceu, citando o estado declarado; nenhuma opção é apresentada como requisito,
solução completa ou compra recomendada; nada de licenciamento, sizing, arquitetura ou cobertura é
inventado. Fontes conceituais: páginas oficiais de FortiAnalyzer, FortiSIEM, FortiSOAR, FortiSOC e a
documentação de *Vulnerability Scan* do FortiClient.

---

## 6 · Semântica exata dos metadados (RPT-02)

Owner próprio na Camada 5 (`window.__P51SESMETA`), **fora** de `captureCanonicalInputs()`, score,
suficiência, Target, recommendations e M41. **Schema v1 intocado**: o documento exportado continua
com exatamente as mesmas chaves.

| campo | origem | rótulo no relatório |
|---|---|---|
| Sessão | label ativo; `null` → `Sem rótulo` — **nunca** nome inventado | `Sessão` |
| sessão **nova** | `startedAt`, capturado uma vez na carga e estável | `Data da sessão` |
| sessão **importada** | `createdAt` do documento validado | **`Sessão registrada em`** |
| `createdAt` ausente | nada é fabricado | `Data original não informada` |
| geração | instante da preparação do relatório | `Relatório gerado em` |
| ferramenta | `window.__QS_BUILD_META.toolVersion` | `Versão da ferramenta` |

**Por que `Sessão registrada em`:** no runtime congelado, `createdAt` é gravado por
`buildSessionDocument()` no instante da **exportação** — não é o início da avaliação. Reinterpretá-lo
em silêncio como "data da sessão" seria mentir sobre a proveniência; o rótulo honesto foi adotado
exatamente como a diretriz prevê. Formatação `pt-BR` com segundos (dois carimbos podem cair no mesmo
minuto e o relatório precisa ser rastreável ao instante); internamente tudo permanece ISO 8601.

Export bem-sucedido pode promover o label a ativo; **export recusado ou com falha não altera
metadado algum** — comportamento confirmado na prática (§9, achado 4).

---

## 7 · Prova de derivação da régua por `stageOf()` (RPT-03)

As faixas **não** são thresholds novos: `qsStageBands()` varre 0..5 em passos de 0,01 e registra onde
`stageOf()` troca de estágio. Os literais `0.5/1.5/2.5/3.5/4.5` **não aparecem** no código da régua.

O gate **P51-RPT3** compara `stageOf(v)` com `window.__QS_STAGE_RULER.stageAt(v)` em **501 pontos**
ao longo de 0..5 e, explicitamente, nas bordas `0.49 · 0.5 · 1.49 · 1.5 · 2.49 · 2.5 · 3.49 · 3.5 ·
4.49 · 4.5 · 5`. Exige seis faixas e verifica que `stageOf()` permanece byte-idêntica no HTML
construído. O mutante **M51-12** desloca a régua numa borda e é detectado.

Comportamento sob insuficiência e sob zero, verificado em PDF real: gate fechado → **nenhum
marcador** e a frase `Estágio não determinado — dados insuficientes`; score zero confirmado →
marcador em 0 e leitura `0.0 / 5 · Inexistente`. `n/d` nunca vira marcador em zero.

---

## 8 · Prova de neutralidade dos SVGs (RPT-05)

Dois formatos do mesmo sistema: **emblema pentagonal** (capa) e **faixa de cinco segmentos**
(cabeçalho). Ambos inline, manuais e determinísticos — sem imagem externa, base64, fonte remota ou
novo asset. Geometria própria (cinco nós num pentágono; cinco segmentos iguais), não é roda de níveis
nem cópia do gráfico oficial do SOC-CMM.

O gate **P51-RPT5** renderiza o relatório em **duas sessões radicalmente diferentes** (todas as
respostas no nível 0 × todas no nível 3, com Target) e exige `outerHTML` **byte-idêntico** para os
dois SVGs. Verifica ainda: `role="img"`, `<title>`/`<desc>` explicando "Cinco domínios do Quickscan",
as cinco cores de `PR_DOM_HEX` presentes, `#DA291C` **ausente** como cor de domínio, e os rótulos
completos medidos **nos nós de texto de rótulo** — não no `textContent` do SVG, que inclui o `<desc>`
e mascarava a perda dos rótulos (foi assim que o mutante M51-15 escapou na primeira campanha).

Os mutantes **M51-13** (troca de ordem/cor), **M51-14** (SVG variando com o score) e **M51-15**
(perda de rótulos) são todos detectados.

---

## 9 · Defeitos reais encontrados

### 9.1 No produto (corrigidos nesta rodada)

Além dos oito UAT e cinco RPT pedidos, a execução expôs:

1. **FortiClient sem ressalva de escopo no ramo "validar aderência".** Quando o contexto da
   capability não era declarado, o bloco listava só o nome do produto — e a ressalva de que o escopo
   é de **endpoint** desaparecia justamente no caso em que há menos informação. Corrigido: a ressalva
   acompanha a opção nos dois ramos.
2. **Ponte `window.__DEV` desalinhada do wrapper de sessão.** `__DEV.importSessionDocument` guardava
   referência à função original, capturada antes do wrapper da Camada 5. O fluxo real da UI passava
   pelo wrapper (e atualizava status e metadados); qualquer chamada por `__DEV` passava ao largo —
   duas verdades para a mesma operação. As duas superfícies passam a apontar para a mesma função.
3. **Ambiguidade de vocabulário na ajuda de `team-capacity`.** O exemplo usava `8×5`, notação que o
   gate legitimamente confunde com o exemplo de MSSP. Reescrito como "das 8h às 18h em dias úteis":
   o gate permaneceu estrito e o produto ficou inequívoco.

### 9.2 Confirmação da ressalva N4 (fora do escopo, camada congelada)

Ao montar a evidência de PDF, `setTarget("logs", 3)` foi **aceito** com o atual já em nível 3, e o
`importSessionDocument` do mesmo documento foi **recusado** com
`Nível-alvo deve ser superior ao nível atual confirmado em: logs`. É exatamente a ressalva **N4**
registrada em `PHASE_5_0_CLOSURE_ACCEPTANCE.md` (a camada de Target congelada aceita alvo não
estritamente superior). **Não é regressão da Phase 5.1** e corrigi-la exigiria tocar
`ui_target_v32.js` em matéria de semântica — fora desta rodada. O owner de metadados comportou-se
corretamente: import recusado **não** alterou label nem data.

### 9.3 No harness (corrigidos)

| # | defeito | correção |
|---|---|---|
| H1 | P51-UX2 só alcançava 14 das 15 perguntas (`p50GotoQuestion` para em k=13), medindo `external-surface` duas vezes | travessia por `gotoStep()`, cobrindo as 15 e exigindo 15 exemplos distintos |
| H2 | oráculo de overclaim acusava a própria **negação** ("não são requisito nem compra recomendada") | passa a olhar a janela anterior e ignora ocorrências negadas |
| H3 | busca do FortiClient por janela de N caracteres perdia a frase quando ela crescia | divisão por **frase**, sem número mágico |
| H4 | P51-RPT2 comparava strings de data que caem no mesmo segundo | compara as **fontes semânticas** (ISO) e os rótulos |
| H5 | P51-COR5 não cobria a tag de domínio da tela de pergunta (o mutante M51-05 passou por essa fresta) | passa a cobrir `#app [data-dom]` e a conferir o chip contra o domínio canônico da pergunta |
| H6 | P51-REC1 validava a tabela de apoio **contra ela mesma** (equivalente por construção) — M51-07 escapava | âncora **normativa** da diretriz declarada no gate, e capability conferida contra `MAP[qid].cap` |
| H7 | P51-RPT5 media rótulos no `textContent` do SVG, que inclui `<desc>` | mede apenas os nós de texto de rótulo |
| H8 | P51-PDF1 media a capa **sem emular mídia print**, lendo um layout que o papel nunca teria | `emulateMedia({media:"print"})` antes da medição, mais checagem de capa fora de fluxo |
| H9 | detector de clipping tratava `<text>` de SVG como caixa HTML (falso positivo em "Serviços") | restrito a elementos do namespace XHTML |
| H10 | asserções de jornada tornadas case-insensitive ficaram amplas demais e passaram a casar a **prosa** explicativa | restritas aos rótulos dos nós |

### 9.4 Incidente de execução, registrado por transparência

Ao validar o harness de mutação, executei `require('./tests_p51_mutants.js')` **na árvore de
trabalho** em vez da cópia temporária. O processo foi interrompido, e a verificação encontrou **um
mutante ainda aplicado** (M51-05, `data-dom` prefixado). A fonte foi restaurada, o HTML reconstruído
e a ausência de **todos** os marcadores de mutação foi conferida um a um antes de prosseguir. A
campanha definitiva rodou exclusivamente em cópia temporária. Nenhum artefato entregue carrega
resultado de execução mutada.

---

## 10 · Consequências autorizadas em suítes congeladas

Três suítes precisaram ser atualizadas porque asseguravam **exatamente aquilo que a diretriz mandou
mudar**. Em nenhum caso a propriedade auditada foi enfraquecida.

| suíte | o que assegurava | o que passou a assegurar |
|---|---|---|
| `tests_journey_m45.js` (N1-N2, N3, N6-N7, N33-N34) | rótulos em CAIXA ALTA e os glifos `●`/`◆` | mesmos rótulos, comparados **sem depender de tipografia**; e a distinção sem cor passa a exigir **os três sinais** que a UAT-05 introduz: `data-jn-state`, número `0,1,2,3,4,5` e rótulo textual — verificação mais forte que a anterior |
| `tests_visual/screen.spec.js` (V8) | idem, em Chromium | idem |
| `tests_session_m48.js` (S37) | texto do relatório **idêntico** antes/depois do import | **corpo** do relatório idêntico (a propriedade original) **e**, adicionalmente, que a capa declare a proveniência com honestidade (`Data da sessão` × `Sessão registrada em`) |

Para reduzir o alcance, `ui_journey_v32.js` **restaurou as classes legadas** `jn-cur`, `jn-next`,
`jn-tgt` e `jn-past` de forma aditiva: os seletores congelados continuam funcionando e apenas a
apresentação do nó mudou.

A boundary de `tests_p50_core.js` (`PROTECTED`) foi **repinada** para `ui_v32.js`, `ui_v32.css`,
`ui_journey_v32.js` e `tests_visual/screen.spec.js`, com comentário normativo citando a autorização
nominal da §2.1. Todo o restante da §29.4 segue conferido byte a byte.

---

## 10-A · Adendo documental — guia de uso e interpretação

Executado na **mesma rodada e na mesma branch**, conforme a §0 do adendo: não é nova fase, microfase
ou proposta. A candidata funcional (os oito UAT e os cinco RPT) foi **preservada integralmente** —
nada foi descartado, revertido ou reimplementado.

### Entregáveis

| entregável | conteúdo |
|---|---|
| **`USER_GUIDE.md`** | manual canônico de utilização e interpretação, cobrindo as §2.1–§2.14 do adendo: visão geral, guia rápido de dez passos, semântica das respostas, evidências e observações, prioridades, influência do contexto tecnológico (com a tabela de dez linhas), preenchimento do contexto, leitura dos resultados, cenário-alvo, recomendações Fortinet com limitações honestas, sessões e isolamento entre clientes, estrutura do relatório com checklist pré-entrega, limitações e glossário |
| **`README.md`** | landing page curta: propósito, aviso de screening, como abrir localmente, fluxo resumido, link para o manual, identidade de versão por referência ao runtime e a regra de que dados de cliente não pertencem ao Git |
| **caixa no PDF** | **Como interpretar este relatório**, imediatamente após o resumo de maturidade: 6 itens, 544 caracteres — fração pequena da página, sem repetir o manual |

### Coerência com a candidata (adendo §5)

O manual descreve o comportamento **realmente implementado**, não o planejado. Os rótulos foram
extraídos do runtime e conferidos por gate: os seis estágios canônicos, os cinco domínios na ordem de
`DOMS`, os cinco estados de presença, os sete status operacionais e os rótulos de ação
(`Adicionar evidência ou observação`, `Não sei · precisa validar`, `Sem rótulo`,
`Sessão registrada em`, `Data original não informada`, `Perfil atual`, `Próximo estágio`). O limite de
prioridades citado no manual é **derivado empiricamente do runtime**, não fixado no texto do gate.

Nenhum threshold, fórmula ou mapa foi duplicado como nova fonte canônica; nenhum SHA efêmero entrou
no corpo do manual.

### Documentation assurance — 12 gates, todos verdes

| gate | verifica |
|---|---|
| `P51-DOC1` | existência de manual e README, link entre eles, e que o README não vira relatório de fase |
| `P51-DOC2` | afirmação explícita de que o contexto tecnológico **não muda o score** |
| `P51-DOC3` | as dez linhas da tabela de influência, componente por componente |
| `P51-DOC4` | distinção entre `n/d` e zero confirmado, e entre ausência de evidência e evidência de ausência |
| `P51-DOC5` | data da sessão × data de geração, `Sessão registrada em`, `Data original não informada` e ausência de autosave |
| `P51-DOC6` | Target como cenário desejado, sem promessa, sem alterar respostas atuais |
| `P51-DOC7` | definição de **mandato formal** com autorização, patrocínio, responsabilidade e autoridade |
| `P51-DOC8` | limitações das recomendações; FortiClient/EMS restrito a **escopo de endpoint**; FortiRecon restrito à exposição externa |
| `P51-DOC9` | checklist pré-entrega com pelo menos oito itens acionáveis |
| `P51-DOC10` | ausência de pricing, SKU, licenciamento ou dimensionamento **afirmados** (a menção negada é legítima) |
| `P51-DOC11` | coincidência **literal** com os rótulos finais da UI, lidos do runtime |
| `P51-DOC12` | caixa interpretativa presente, curta, logo após o resumo, com os seis pontos exigidos e **estática** (não varia com os dados) |

### Defeitos do harness documental, corrigidos

| # | defeito | correção |
|---|---|---|
| H11 | oráculos comparavam texto com ênfase markdown (`**negrito**`) e falhavam por tipografia | leitura normaliza a ênfase preservando as palavras |
| H12 | o lint comercial acusava a própria **negação** ("não trazem preço, SKU, dimensionamento") | passa a distinguir afirmação de negação, como no oráculo de overclaim |
| H13 | os mapas de rótulo não eram alcançáveis pela ponte de teste | `PRESENCE_LABELS`, `STATUS_LABELS` e `CLASS_LABELS` expostos em `__DEV` (aditivo) |
| H14 | o limite de prioridades era **fixado no gate** — oráculo falso | passa a ser derivado do runtime, adicionando pelo owner canônico até a recusa |

### Evidência regenerada após o adendo

Os seis PDFs e o `P51-pdf-evidence.json` foram **regenerados do build final** e carregam o carimbo
`e8857a9d…`. Os screenshots foram recapturados do mesmo build: os cinco da tela de pergunta saíram
**byte-idênticos** (o adendo é `@media print` e não altera a tela — verificado por comparação das
medidas de layout, que deram exatamente iguais), e os cinco de resultados mudaram porque passaram a
usar um alvo **válido** (`governance`) no lugar do `logs` anterior, que era igual ao atual. A campanha
de mutação **16/16** foi reexecutada contra as fontes pós-adendo.

Nenhum resultado de teste anterior à alteração é atribuído ao HTML pós-adendo.

---

## 11 · Regressão e mutação

Rodada da candidata, executada **após** o adendo e sobre o HTML de então (`e8857a9d…`), com código
de saída próprio por comando. **A rodada equivalente da errata, sobre o HTML entregue
`12bb950f…eebbf9d9`, está em §0.5** e é a que vale como regressão corrente.

| # | comando | exit | resultado |
|---|---|---|---|
| 1 | `npm ci --engine-strict` | 0 | — |
| 2 | `npm run test:all` | 0 | contagens abaixo |
| 3 | `npm run test:visual` | 0 | **67 passed · 0 failed · 37 skipped** |
| 4 | build A | 0 | `e8857a9d…a55b8513` |
| 5 | build B | 0 | `e8857a9d…a55b8513` — **byte-idêntico** |
| 6 | `git diff --check` | 0 | limpo |

| suíte | observado |
|---|---|
| ENGINE / MATRIZ | **105 · 0 FAIL** |
| UI 3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | **19 · 25 · 11 · 23 · 26**, 0 FAIL |
| UX 4.1 | **56 · 0 FAIL** |
| TARGET 4.3.1 | **30 · 0 FAIL** |
| REF 4.4 | **28 · 0 FAIL** |
| JOURNEY 4.5 | **31 · 0 FAIL** |
| ICONS 4.6 | **12 · 0 FAIL** |
| SESSION 4.8 | **97 · 0 FAIL** |
| UG | **13 · 0 FAIL**, UG13 PASS em Chromium real |
| M41 | PASS · payload `9794b267…4365b` |
| P50 CORE + P51 (inclui os 12 P51-DOC) | **61 · 0 FAIL** — **64 · 0 FAIL** após a errata (§0.5) |
| P50 CHROMIUM + P51 | **27 · 0 FAIL**, **zero SKIP** |

**Mutação dirigida — 16/16 detectados** nesta rodada (**20/20** após a errata, §0.4), cada um pelo gate semanticamente correspondente, com motivo
compatível, em cópia temporária e com restauração byte-idêntica verificada
(`docs_phase5/evidence_p51/P51-mutation.json`):

```text
M51-01 layout empilhado           -> P51-VIS1     M51-09 label stale após import  -> P51-RPT2
M51-02 dois botões de evidência   -> P51-UX1      M51-10 geração como data sessão -> P51-RPT2
M51-03 MSSP em qid incorreto      -> P51-UX2      M51-11 marcador sem suficiência -> P51-PDF1
M51-04 jornada sem número         -> P51-JN1      M51-12 régua fora de stageOf()  -> P51-RPT3
M51-05 tag de domínio trocada     -> P51-COR5     M51-13 ordem/cor trocada        -> P51-RPT4
M51-06 FortiClient universal      -> P51-REC1     M51-14 SVG variando com score   -> P51-RPT5
M51-07 apoio no gap errado        -> P51-REC1     M51-15 emblema sem rótulos      -> P51-RPT5
M51-08 option ilegível            -> P51-VIS2     M51-16 capa colidindo no PDF    -> P51-PDF1
```

Acrescentados pela errata (§0.4):

```text
M51-17 sinal do gap invertido     -> P51-VIS3     M51-19 fórmula antiga do score  -> P51-DOC13
M51-18 agregado sem arredondar    -> P51-RPT6     M51-20 régua/legenda como seção -> P51-DOC13
```

---

## 12 · Evidências

`docs_phase5/evidence_p51/`

- **Screenshots** da tela de pergunta e de resultados em **390, 768, 1024, 1440 e 2560 px**
  (`P51-question-*.png`, `P51-results-*.png`), capturados do preview local;
- `P51-layout-measures.json` — caixas reais, sobreposição, overflow e presença dos controles;
- **PDFs reais em A4** para seis cenários (`P51-report-*.pdf`): suficiente com label, importada com
  `createdAt`, suficiente sem label, insuficiente, score zero confirmado e label Unicode;
- `P51-pdf-evidence.json` — leitura da régua, marcador, faixas, legenda, blocos de apoio, anexo e
  contagem de controles interativos por cenário;
- `P51-mutation.json` — campanha **20/20**, regenerada pela errata contra as fontes pós-errata (§0.4);
- `P51-ERRATA-suites.txt` — saída literal das suítes, da campanha e dos builds da errata (§0.7).

Os artefatos de PDF, screenshot e medição de layout carregam o carimbo do build **pré-errata**
(`e8857a9da789367b6a20c4c0aa848cc3db550f99d243f052d12ccd1aa55b8513`) e **não** foram regerados; a
limitação está declarada em §0.7. O build entregue é
`12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9`.

**Documentação de produto entregue na raiz do repositório:** `USER_GUIDE.md` e `README.md`.

Verificado em todos os PDFs: **zero controles interativos**, anexo com 15 itens, seis faixas de
régua, cinco itens de legenda, emblema e faixa presentes, textos não cortados.

**As evidências das microfases 5.0.1–5.0.5 permanecem byte-idênticas.** Durante a rodada de
assurance, `npm run test:all` chegou a regravá-las (a suíte Chromium grava evidência quando
`P50_NO_EVIDENCE` não está definido); os arquivos foram **restaurados ao estado commitado** e
reconferidos contra o manifesto do commit auditado. **Correção de metadado (R5 do parecer, §0.8):** a
contagem “36/36” publicada aqui não reproduz — a auditoria independente observou **29** arquivos
regravados e a rodada da errata observou **30**, todos dentro do escopo declarado no cabeçalho do
manifesto (prefixo `P50-5.0.5-` ou os artefatos exigidos por nome). Em ambas as rodadas
`git status --porcelain docs_phase5/evidence_p50/` voltou **vazio** após a restauração, e os arquivos
de 5.0.1 a 5.0.4 permaneceram byte-idênticos — a propriedade material está honrada; o que não
reproduzia era o número.

---

## 13 · Limitações remanescentes

1. **N4 — camada de Target congelada** aceita alvo não estritamente superior ao atual. **Correção de
   redação (R4 do parecer, §0.8):** na prática o **export é recusado antes** de gerar qualquer
   arquivo — não é o import do documento resultante que falha. Sem perda de dado e sem corrupção
   silenciosa; qualquer re-render aciona `revalidateTargets()`, que remove o override conflitante e
   avisa. Confirmado nesta rodada (§9.2) e reconfirmado pela auditoria independente. Fora do escopo; a orientação
   operacional registrada no aceite da Phase 5.0 continua valendo.
2. **Ajuste dos rótulos do emblema** é geométrico (viewBox fixo) e é asserido por conteúdo, não por
   medição de caixa — `scrollWidth`/`clientWidth` não têm significado em SVG.
3. **Versão nominal de browser** (151.0.7922.34 contra o 141.0.7390.37 histórico) permanece ressalva
   ambiental já aceita.
4. **`AGENTS.md`** segue não rastreado no worktree, como encontrado. Não foi tocado.
5. **Hardening**, autenticação, vault, cloud e deployment permanecem backlog, como a diretriz
   determina.

---

## 14 · Atos NÃO realizados

Não houve `commit`, `push`, `PR`, `merge`, `tag`, `release`, freeze de release, deployment ou
promoção para produção. O adendo documental não tocou engine, M41, score, suficiência, Target,
schema de sessão, produção ou Tailscale. A produção V3.2 em `127.0.0.1:1337` responde `200` com o SHA
`8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb`, **inalterada**; a rota do
Tailscale Serve continua apontando exclusivamente para `http://127.0.0.1:1337`, sem Funnel. O preview
local em `127.0.0.1:1338` serve o build desta candidata por bind read-only.

Este relatório não declara a fase concluída nem contém autoauditoria.

---

## 15 · Parada

A candidata está completa. A execução **para aqui**, para **uma auditoria independente orientada a
risco**, antes de qualquer integração ou preparação de release.
