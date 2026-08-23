# AUDITORIA INDEPENDENTE ORIENTADA A RISCO — QUICKSCAN PHASE 5.1 (UAT & RELATÓRIO EXECUTIVO)

Auditor independente da candidata. Esta sessão **não** participou da implementação, das correções,
da geração das evidências nem da autoria do `PHASE_5_1_UAT_REPORT.md`. Nenhum arquivo da candidata
foi alterado; toda execução com efeito colateral ocorreu em cópia temporária.

- Data da auditoria: **2026-08-22**
- Repositório auditado: `/mnt/c/Projetos/QuickScan-SOC-CMM/phase5`
- Ambiente: Node **v22.23.2** · Python **3.14.4** · jsdom **30.0.1** · @playwright/test **1.62.1** ·
  Chromium **151.0.7922.34** · @axe-core/playwright **4.13.0** · WSL2/Linux 6.18.33.2

---

## VEREDITO

> ## `FAIL`

Um blocker **reproduzido duas vezes, em sessões independentes, e confirmado em PDF A4 real**: o
relatório executivo nomeia um **estágio de maturidade uma faixa abaixo do canônico** e **contradiz a
si mesmo dentro do mesmo documento** (o Resumo de maturidade e a régua dizem *Gerenciado*; a Jornada
de maturidade e a Leitura executiva, no mesmo PDF, dizem *Definido*), além de divergir da tela.

Enquadra-se nos critérios de blocker **1** (conclusão incorreta), **2** (distorção de informação
material do relatório) e no item de regressão “discrepância entre tela e relatório”.

Todo o restante do escopo auditado passou. As demais observações são **ressalvas não bloqueantes**.

---

## 1 · Estado da candidata e identidades (PRÉ-AUDITORIA)

| item | esperado | observado | veredito |
|---|---|---|---|
| branch | `feat/phase5-5-1-uat-report` | `feat/phase5-5-1-uat-report` | **OK** |
| HEAD | `af279a685eacffb8c85c60976cf4c6a059b967d0` | idem | **OK** |
| commits sobre `origin/main` | 0 | `git rev-list --count origin/main..HEAD` = **0** | **OK** |
| arquivos staged | 0 | `git diff --cached --name-only` vazio | **OK** |
| branch publicada | não | `git ls-remote --heads origin feat/phase5-5-1-uat-report` vazio | **OK** |
| produção V3.2 | intocada | `127.0.0.1:1337` serve `8d0932e1…f1dd85ddb` (578.152 B) | **OK** |

### Identidades principais

| arquivo | SHA-256 esperado | SHA-256 observado | bytes | veredito |
|---|---|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` | `e8857a9d…a55b8513` | `e8857a9da789367b6a20c4c0aa848cc3db550f99d243f052d12ccd1aa55b8513` | 743.908 | **OK** |
| `engine_v32.js` | `9a4a2e67…2b5d247a` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | 57.261 | **OK** |
| payload funcional M41 | `9794b267…f3ed4365b` | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | — | **OK** |
| `USER_GUIDE.md` | `fa8de3df…baad06a` | `fa8de3df8125d6bd6ec8984153f66f710d59494e6563f7d526653dde1baad06a` | 19.430 | **OK** |
| `README.md` | `b7924ce0…a6322a64` | `b7924ce0f142ad773e7159f0dd726a26aec1122214c87039ff31b3a5a6322a64` | 2.854 | **OK** |
| `docs_phase5/PHASE_5_1_UAT_REPORT.md` | `bd2ca220…3daa89784` | `bd2ca220bb3b801a24016cb070e979df60b3eb0670f29a304666372d3aa89784` | 31.636 | **OK** |
| `docs_phase5/MANIFEST_PHASE5_P50.sha256` | `f0c6ed8c…16ce2f32` | `f0c6ed8c3df78b4ba631b091de9f483394d1ac6b2ca872b3d0eddfff16ce2f32` | 18.811 | **OK** |
| adendo documental | `1896c270…59d75cef8` | `1896c270d5064a701dee062cfebf02f5d0fbfab15363da39196764859d75cef8` (12.559 B · 347 linhas) | — | **OK** |

Também conferida a diretriz executada `DIRETRIZ_PHASE_5_1_UAT_E_RELATORIO.md` ·
`9755984e1e5665de878da578b00dcd94f4df91a4145f5596fd159d96b2eb2073` · 23.149 B · 454 linhas.

### Manifesto

- **143 entradas** válidas; `sha256sum -c` → **143 OK / 0 falhas**;
- **zero duplicatas** de caminho; **zero autorreferência**; **zero caminhos inexistentes**;
- confronto com `git status --porcelain`: o único caminho do delta ausente do manifesto além do
  próprio manifesto é **`AGENTS.md`**, cuja exclusão é **declarada nominalmente** no cabeçalho.
- `AGENTS.md` **não foi editado, apagado, manifestado nem stageado** por esta auditoria.

**Nenhuma identidade principal divergiu.** A auditoria prosseguiu.

---

## 2 · Preservação da árvore original

| momento | arquivos | SHA-256 do inventário |
|---|---|---|
| **pré-auditoria** | 337 | `b3ec0a71fd6e58b20110a9ea54bf1e74f6d9a13867337062fbbd44e6c28860d0` |
| **pós-auditoria** | 337 | `b3ec0a71fd6e58b20110a9ea54bf1e74f6d9a13867337062fbbd44e6c28860d0` |

`diff` entre os inventários: **vazio**. `git status --porcelain` idêntico ao inicial; `HEAD`
inalterado em `af279a68…`. Inventário = `sha256sum` de todo arquivo fora de `.git/` e
`node_modules/`.

Toda execução com efeito colateral (build, `test:all`, `test:visual`, campanhas de mutação, geração
de PDF/screenshots) ocorreu em **duas cópias temporárias** sob
`/tmp/.../scratchpad/{work,view}`, provadas byte-idênticas à origem no momento da cópia.

**Nenhum commit, push, PR, merge, tag, release, freeze ou deployment foi realizado. Nenhum container
foi reiniciado, parado, removido ou modificado.**

---

## 3 · BLOCKER

### B1 · O relatório executivo nomeia estágio de maturidade uma faixa abaixo do canônico e contradiz a si mesmo

**Severidade:** blocker (critérios 1 e 2).
**Superfícies:** `ui_v32.js:956` (`buildPrintReport`) → HTML construído linha 4173; consumidores
`qsStageRulerHTML()` e o KPI “Estágio indicativo”; relatório em tela, HTML de impressão e PDF.

#### 1. Comportamento esperado

O score geral canônico é `Math.round(média_dos_scores_de_domínio * 10) / 10` — a forma usada em
**quatro** dos cinco pontos do produto: `renderResults()` (tela · HTML 2094), `legacySnapshot()`
(`ui_v32.js:126`), `computeTargetProfile()` (`ui_target_v32.js:34`) e `buildNarrativeSnapshot()`
(`ui_journey_v32.js:34`). O estágio publicado no relatório deve ser `stageOf()` desse mesmo valor,
coerente com o número exibido, com a jornada do próprio documento e com a tela.

#### 2. Comportamento observado

`buildPrintReport()` é o **único** ponto que calcula o agregado **sem arredondar**:

```js
/* ui_v32.js:956 — único sítio sem Math.round */
const overall = suff && scored.length ? (scored.reduce((a,s)=>a+s.score,0)/scored.length) : null;
```

O número é então impresso com `overall.toFixed(1)` (que arredonda) e o estágio é derivado de
`stageOf(overall)` (que **não** arredonda). Quando o agregado cai em `[faixa − 0,05 ; faixa)`, o
relatório exibe o número da faixa superior e o **nome** da faixa inferior.

Texto extraído do PDF A4 real (`pdftotext -layout`), sessão única, mesmo documento:

```text
Resumo de maturidade
  2.5 / 5                         Gerenciado              adequada
  Score geral indicativo          Estágio indicativo      Suficiência da sessão
...
2.5 / 5 · Gerenciado                        ← leitura da régua (marcador em left:50.00%)
...
  2   Gerenciado
  3   Definido PERFIL ATUAL                 ← jornada, no MESMO PDF
  4   Gerenciado quantitativamente PRÓXIMO ESTÁGIO
...
O Quickscan posiciona a operação em Definido (2.5/5), …   ← leitura executiva, no MESMO PDF
```

Na **tela**, a mesma sessão exibe `2.5` e jornada `3 · Definido · Perfil atual`.

#### 3. Reprodução

Duas sessões independentes, ambas suficientes, ambas reproduzidas em jsdom e em Chromium/PDF A4:

**Caso A** — respostas (índice do nível):
`mandate=0, governance=0, policies=0, team-capacity=2, training=2, incident-response=2,
detection-lifecycle=2, automation=3, logs=2, endpoint=3, monitoring-coverage=0,
external-surface=0, vulnerability-management=2` (13 confirmadas, todos os domínios ≥ 2).
Scores de domínio `[0 · 3,3 · 3,9 · 4,2 · 1,1]`, soma **12,5**, média exata **2,5**.

**Caso B** — `mandate=0, governance=0, team-capacity=0, training=0, knowledge=1,
incident-response=1, detection-lifecycle=3, logs=1, endpoint=3, monitoring-coverage=3,
external-surface=3` (11 confirmadas). Scores `[0 · 0,6 · 3,4 · 3,4 · 5]`, soma **12,4**,
média **2,48**.

Em ambos:

| leitura | valor |
|---|---|
| `legacySnapshot().overall` (tela) | `2.5` → `stageOf(2.5).pt` = **Definido** |
| jornada na tela | `3 Definido · Perfil atual` |
| PDF · KPI “Estágio indicativo” | **Gerenciado** |
| PDF · régua `[data-rl-read]` | `2.5 / 5 · Gerenciado` |
| PDF · jornada | `3 Definido · Perfil atual` |
| PDF · leitura executiva | “posiciona a operação em **Definido** (2.5/5)” |

Evidência gerada: `pdf/BLOCKER-estagio-arredondamento.pdf` (A4, 121.759 B, margens 14 mm),
produzido a partir do HTML candidato `e8857a9d…a55b8513` sem qualquer modificação de fonte.

No Caso A a média **matemática exata é 2,5** (12,5 ÷ 5); a divergência decorre também da
representação binária (`2.4999999999999996`), de modo que o relatório erra mesmo sob a leitura “não
arredondar é mais preciso”.

#### 4. Impacto material

- O **estágio de maturidade** — a conclusão executiva mais citada do documento — é publicado **uma
  faixa inteira abaixo** do canônico (`Gerenciado` em vez de `Definido`).
- O **mesmo PDF** afirma as duas coisas: `Gerenciado` no resumo/régua e `Definido` na jornada e na
  leitura executiva. Um documento entregue ao cliente se autocontradiz.
- **Tela e relatório divergem** para o mesmo estado canônico, no mesmo instante.
- O marcador da régua fica em `left:50.00%`, exatamente sobre a fronteira, reforçando a ambiguidade.
- **Incidência (enumeração exaustiva das 14 pontuações de domínio alcançáveis, 14⁵ = 537.824
  combinações):** **21.436 combinações divergentes — 3,99%**. Concentradas nos scores de fronteira
  efetivamente exibidos:

  | score exibido | combinações divergentes |
  |---|---|
  | `0.5 / 5` | 85 de 200 — **43%** |
  | `1.5 / 5` | 3.970 de 9.405 — **42%** |
  | `2.5 / 5` | 12.594 de 30.211 — **42%** |
  | `3.5 / 5` | 4.717 de 12.415 — **38%** |
  | `4.5 / 5` | 70 de 240 — **29%** |

  Ou seja: **sempre que o relatório imprime um score de fronteira, há ~3 em 10 a ~4 em 10 de chance
  de o estágio nomeado estar errado.**

#### 5. Arquivos e superfícies envolvidos

- `ui_v32.js:956` — cálculo do agregado em `buildPrintReport()`;
- `ui_v32.js:971` (KPI “Estágio indicativo”) e `ui_v32.js:975` → `qsStageRulerHTML(overall, suff)`;
- HTML construído `quickscan_secops_soccmm_v3_2_dev.html:4173`;
- superfícies de saída: `#pr-maturity .pr-kpi`, `#pr-stage-ruler` / `[data-rl-read]`, PDF A4.

#### 6. Correção mínima sugerida (não implementada)

Alinhar `buildPrintReport()` à forma canônica já usada nos outros quatro sítios — **uma linha**,
dentro da boundary nominalmente autorizada da 5.1 para `ui_v32.js`:

```js
const overall = suff && scored.length
  ? Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10
  : null;
```

E acrescentar um gate que ancore a coerência **entre superfícies**, não apenas dentro da régua — por
exemplo, para vetores de fronteira (`0.5 / 1.5 / 2.5 / 3.5 / 4.5`), exigir
`KPI de estágio === leitura da régua === nó “Perfil atual” da jornada ===
stageOf(legacySnapshot().overall).pt`. O gate atual `P51-RPT3` prova que a régua **deriva** de
`stageOf()`, mas não prova que o **valor alimentado** à régua é o mesmo da tela — foi exatamente por
essa fresta que o defeito passou.

> Observação de escopo: o cálculo sem arredondamento **já existia no `HEAD`** (`ui_v32.js:691` do
> commit auditado). A Phase 5.1, porém, **ampliou o alcance do defeito** ao criar dois novos
> consumidores desse valor (a régua RPT-03 e a leitura textual da capa/resumo) e ao colocar, no mesmo
> documento, uma jornada e uma leitura executiva que usam o valor arredondado. A contradição
> intradocumento é, portanto, **introduzida nesta entrega**.

---

## 4 · Ressalvas não bloqueantes

### R1 · Buraco de poder semântico: o **sinal** do gap Current × Target não é protegido por nenhum gate

Mutação adversarial própria (**AUD-02**), em `ui_p50_results_v32.js`, invertendo o sinal do gap na
matriz única que alimenta heat map, drill-down, Current × Target e a tabela acessível:

```js
gap: (score !== null && tScore !== null) ? p50Round1(score - tScore) : null   /* era tScore - score */
```

Resultado com `logs` current `1.7` e alvo `5.0`:

```text
data-p50-gap = -3.3
aria-label   = "Tecnologia · Centralização de logs: confirmado · 1.7 de 5 · alvo declarado 5.0 · gap -3.3"
```

Suítes executadas contra o mutante (todas em cópia):

| suíte | resultado |
|---|---|
| `tests_p50_core.js` (P50+P51) | **61 PASS · 0 FAIL** |
| `tests_p50_chromium.js` (P50+P51) | **27 PASS · 0 FAIL** |
| `tests_journey_m45.js` | 31 PASS · 0 FAIL |
| `tests_target_m431.js` | 30 PASS · 0 FAIL |
| `tests_unset_ug.js` | 13 PASS · 0 FAIL |

**Nenhum gate detectou.** O produto **entregue está correto** (verifiquei gaps `+3.3`, `+1.7`,
`+5.0` e ausência de negativos), por isso isto é ressalva de **assurance**, não defeito de produto.
Mas a propriedade “sem gap negativo não intencional”, da qual o `USER_GUIDE.md` §9 e o checklist
pré-entrega dependem explicitamente, **não tem gate**. Sugestão: asserir em `P50-VIS9`/`P50-ACC5`
que, para todo alvo declarado estritamente superior ao atual confirmado, `data-p50-gap ≥ 0` e
`gap === alvo − atual`.
Fonte restaurada byte a byte (`4c2965f7…e4a8b66e`) e HTML reconstruído em `e8857a9d…a55b8513`.

### R2 · `USER_GUIDE.md` §8 descreve o score geral de forma imprecisa

O manual afirma: *“**Score 0–5.** Média das respostas confirmadas. Por domínio e geral.”* O score
**geral** não é a média das respostas confirmadas: é a **média dos cinco scores de domínio**, cada um
já arredondado. Demonstração com sessão própria (12 confirmadas, domínios `[0,9 · 0,9 · 0 · 2,5 ·
0,6]`):

- média das **respostas** confirmadas: **0,8**
- score geral do produto (média dos **domínios**): **1,0**

O consultor que reproduzir a conta descrita no manual obtém outro número. Correção mínima: “o score
por domínio é a média das respostas confirmadas do domínio; o score geral é a média dos cinco scores
de domínio”. Não bloqueante: o produto calcula corretamente e de forma consistente.

### R3 · `USER_GUIDE.md` §12 lista a estrutura do relatório fora da ordem real

O manual lista `3. Como interpretar → 4. Régua 0–5 → 5. Legenda dos domínios`. A ordem realmente
produzida (medida no DOM de impressão e no PDF) é:

```text
#pr-cover (com #pr-domlegend) → #pr-maturity (com #pr-stage-ruler) → #pr-howto → #pr-prios → …
```

Isto é: a **legenda** está na capa e a **régua** está dentro do Resumo de maturidade, **antes** da
caixa interpretativa. Editorial, sem risco de cálculo; corrigir a lista para refletir o documento.

### R4 · Limitação N4 da camada congelada de Target — confirmada e corretamente contida

`setTarget()` aceita alvo **igual** ao atual confirmado (`if (… v < cur) return false`), contrariando
a redação “estritamente superior”. Reproduzido. **Contenção verificada e adequada:**

- o preflight de export recusa antes de gerar qualquer arquivo:
  *“Esta sessão contém um valor que o próprio Quickscan não conseguiria reimportar: Nível-alvo deve
  ser superior ao nível atual confirmado em: logs … nada foi truncado nem baixado.”*
- qualquer re-render aciona `revalidateTargets()`, que remove o override conflitante e exibe aviso.

Sem perda de dado, sem corrupção silenciosa. Já declarada em §13.1 do relatório da candidata (a
redação “o import do documento resultante é recusado” é imprecisa — na prática o **export** é
recusado antes, o que é melhor).

### R5 · Contagem “36/36” de evidências reconferidas não reproduz exatamente

O §12 do relatório da candidata declara que `npm run test:all` regravou evidências e que elas foram
restauradas — “36/36 idênticos”. Na minha execução, a suíte regravou **29** arquivos em
`docs_phase5/evidence_p50/`. **Todos os 29 estão dentro do escopo declarado no cabeçalho do
manifesto** (prefixo `P50-5.0.5-` ou os artefatos exigidos por nome: `P50-geometry.json`,
`P50-ACC1-axe-*`, `P50-VIS5-focus-*`, `P50-ACC4-contrast.json`), e **os 32 arquivos das microfases
5.0.1–5.0.4 permaneceram byte-idênticos**. A propriedade material está honrada; apenas o número
citado não reproduz. Metadado de governança, sem efeito sobre execução ou relatório.

### R6 · Ressalva ambiental já declarada

Chromium **151.0.7922.34** contra o `141.0.7390.37` histórico. Sem regressão demonstrável: todas as
suítes visuais e de print verdes nas contagens de baseline.

---

## 5 · Auditoria funcional do assessment (§4 da diretriz)

Oráculo **próprio**, reimplementado a partir da especificação (`SCORES=[0, 1.7, 3.3, 5]`, média por
domínio arredondada a 1 casa, suficiência `≥10 confirmadas ∧ todo domínio ≥2`, faixas de `stageOf`),
**sem chamar** `domStat()`, `confirmedCount()`, `dataSufficiency()` nem o contrato da Camada 5.
Três sessões próprias, criadas por mim, sem depender das fixtures entregues.

| verificação | S1 · insuficiente (`null` + `NA` + zero confirmado) | S2 · suficiente, gaps multi-domínio | S3 · prioridades + evidência + alvo |
|---|---|---|---|
| respostas confirmadas | 2 ✓ | 12 ✓ | 14 ✓ |
| `n` por domínio | `[1,0,1,0,0]` ✓ | `[2,2,3,2,3]` ✓ | `[3,2,3,3,3]` ✓ |
| suficiência global | `false` ✓ | `true` ✓ | `true` ✓ |
| déficit global / por domínio | 8 · `[1,2,1,2,2]` ✓ | 0 · `[0,0,0,0,0]` ✓ | 0 ✓ |
| scores por domínio | `[0,n/d,0,n/d,n/d]` ✓ | `[0.9,0.9,0,2.5,0.6]` ✓ | `[1.7,1.7,0,1.7,1.1]` ✓ |
| score agregado | `null` ✓ | `1.0` ✓ | `1.2` ✓ |
| estágio (tela) | ausente ✓ | `Inicial` ✓ | `Inicial` ✓ |

**46 verificações · 0 divergências de cálculo** (as duas “falhas” brutas do meu script eram artefato
de normalização de espaço em `textContent`, não divergência).

### Três estados de resposta (`UNSET ≠ NA ≠ 0 confirmado`)

| estado | `data-p50-ans` | texto | `data-p50-score` |
|---|---|---|---|
| `null` (não respondida) | `unset` | `n/d` | ausente |
| `"NA"` (Não sei) | `na` | `Não sei` | ausente |
| `0` confirmado | `confirmed` | `0.0` | `0.0` |

`null` **nunca** vira zero; `NA` não confirma nem pontua; zero confirmado participa da média e é
exibido como zero, com marcador de origem próprio.

### Resultado bloqueado

Com o gate fechado, medido **em Chromium com estilo computado** (não por `textContent`):

- score `n/d`, badge `COBERTURA INSUFICIENTE`, KPI “Estágio: suficiência de dados não atingida”;
- régua: “Estágio não determinado — dados insuficientes”, **sem marcador**;
- jornada: **nenhum** nó marcado como `current`;
- o valor agregado legado (`5.0 — Optimizing`) fica `display:none` + `aria-hidden="true"`; o que o
  usuário lê é `n/d` + “Não avaliado · evidência insuficiente”, mais os banners
  “Evidência insuficiente: nenhum score de maturidade por domínio é apresentado até o gate canônico
  abrir” e “Perfil de maturidade por domínio indisponível”;
- painel de suficiência lista exatamente os déficits (“Faltam 7 respostas confirmadas no total
  (3 de 10)”, “Pessoas: +2 …”).

### Fronteira canônica do desbloqueio

| vetor | confirmadas | domínios ≥2 | suficiente | veredito |
|---|---|---|---|---|
| 10 confirmadas, Tecnologia=1 e Serviços=0 | 10 | não | `false` | **OK** — global não basta |
| 9 confirmadas, Serviços=1 | 9 | não | `false` | **OK** |
| exatamente 10, todos ≥2 | 10 | sim | `true` | **OK** — limite exato |
| 11, todos ≥2 | 11 | sim | `true` | **OK** |

### Heat map — 15 práticas

15 células, 3 por domínio, distribuição idêntica ao oráculo
(`{confirmed:12, na:1, unset:2}` em S2), estado por `data-p50-ans` + texto + `data-p50-cue`
(sólido/itálico/tracejado) — distinguível **sem cor**.

### Gaps Current × Target

| prática | atual | alvo | gap esperado | gap do produto |
|---|---|---|---|---|
| `detection-lifecycle` | 0.0 | 3.3 | `+3.3` | `3.3` ✓ |
| `automation` | 0.0 | 3.3 | `+3.3` | `3.3` ✓ |
| `logs` | 1.7 | 5.0 | `+3.3` | `3.3` ✓ |
| `external-surface` | 0.0 | 1.7 | `+1.7` | `1.7` ✓ |

**Zero gaps negativos.** `setTarget('endpoint', 1)` com atual `2` → **recusado** (`false`). Elevar o
atual acima de um alvo já declarado remove **apenas** o override conflitante e exibe o aviso
“O alvo desta prática foi redefinido porque o nível atual revisado já o alcança ou supera”.

### Estado canônico é imune à navegação

Abas de resultados, `details`/`summary`, expansão de painéis e ~40 acionamentos de botão não
alteraram um byte de `captureCanonicalInputs()`. Abrir o editor de evidência por teclado também não.

### Isolamento entre clientes A → B → A

Na **mesma janela**, `A → B → A` por `importSessionDocument`:

- estado de B ≠ estado de A;
- em B: notas de A ausentes, prioridades de A ausentes, overrides de alvo de A **zerados**, contexto
  tecnológico de A de volta a `UNSET`;
- `A'` reproduz **exatamente** (`JSON` idêntico) o `captureCanonicalInputs()` original de A;
- o relatório de `A'` contém a nota de A e **não** contém a nota de B.

### Export / import

- owners exportados: exatamente `assessment`, `priorities`, `technologyLandscape`, `targetProfile`,
  `operationalRefinement`;
- **nenhum derivado serializado** (varredura por `score`, `domainScores`, `stage`, `sufficiency`,
  `findings`, `gaps`, `recommendations`, `overall`, `targetScore`, `journey`, `html`, `pdf`);
- injetar `inputs.assessment.score = 4.2` → import **recusado**;
- round-trip preserva o estado canônico byte a byte.

**26 verificações de isolamento/sessão/suficiência/alvo · 0 falhas.**

---

## 6 · Experiência UAT em Chromium real (§5)

Tela de pergunta com mapa aberto (o estado que produzia o empilhamento reclamado) e tela de
resultados, medindo **caixas reais**:

| viewport | overflow-X | clipping | uso da faixa central | composição | controle de evidência |
|---|---|---|---|---|---|
| 390 × 844 | 0 | 0 | 100% | **1 coluna** (sobreposição 354 px, correto) | 1 |
| 768 × 1024 | 0 | 0 | 100% | **1 coluna** | 1 |
| 1440 × 900 | 0 | 0 | 94% | **2 colunas reais** (sobreposição 0; `#app` 908 px + mapa 340 px) | 1 |
| 1920 × 1080 | 0 | 0 | 94% | **2 colunas reais** (`#app` 1.281 px + mapa 400 px) | 1 |
| 2560 × 1440 | 0 | 0 | 82% | **2 colunas reais** (`#app` 1.576 px + mapa 400 px) | 1 |
| zoom 200% (683 × 384 CSS) | 0 | 0 | — | 1 coluna, pergunta e resultados | 1 |

Zero `pageerror` em todos os viewports. Nenhum elemento indevidamente empilhado ou sobreposto.

**Tags de domínio × cores canônicas** (medido por `getComputedStyle` no chip da tela de pergunta):

| domínio | canônico | borda observada |
|---|---|---|
| 0 · Negócio | `#9063CD` | `rgb(144, 99, 205)` ✓ |
| 1 · Pessoas | `#3CB17E` | `rgb(60, 177, 126)` ✓ |
| 2 · Processos | `#2CCCD3` | `rgb(44, 204, 211)` ✓ |
| 3 · Tecnologia | `#307FE2` | `rgb(48, 127, 226)` ✓ |
| 4 · Serviços | `#A2B2C8` | `rgb(162, 178, 200)` ✓ |

**Controle único de evidência:** um só `<button>` visível e focável — `Adicionar evidência ou
observação`, `outline: 2px solid`, `aria-expanded`; acionado por teclado abre o editor **sem alterar
o estado canônico**.

**Exemplos de evidência contextualizados:** conferi as **15** perguntas percorrendo o caminho real —
`15/15` com bloco “O que registrar” e exemplo **próprio, realista e não repetido**, indexado pelo
`data-qid` correto (do `mandate` “charter aprovado pelo CISO em 03/2025…” ao
`vulnerability-management` “varredura mensal em servidores; estações fora do ciclo…”). O exemplo de
MSSP/SLA aparece **apenas** em `monitoring-coverage`.

**“Mandato” em linguagem de negócio:** a tela apresenta o eyebrow “Direcionamento, autoridade e
objetivos” e a releitura *“A operação possui missão, patrocínio, autoridade e objetivos formalmente
definidos e ligados às prioridades do negócio? (mandato formal)”*. O glossário do manual define
mandato formal como “autorização, patrocínio, responsabilidade e autoridade concedidos à operação de
segurança…”. **Compreensível sem jargão.**

**Jornada — seis estados distinguíveis por geometria, número, texto e estado:**

| nó | número | nome | `data-jn-state` | rótulo | geometria |
|---|---|---|---|---|---|
| 0 | `0` | Inexistente | `past` | — | preenchido escuro |
| 1 | `1` | Inicial | `past` | — | preenchido escuro |
| 2 | `2` | Gerenciado | `current` | **Perfil atual** | preenchido `rgb(48,127,226)` |
| 3 | `3` | Definido | `target` | **Próximo estágio · Cenário-alvo** | contorno **tracejado** |
| 4 | `4` | Gerenciado quantitativamente | `future` | — | contorno sólido |
| 5 | `5` | Em otimização | `future` | — | contorno sólido |

**Cenário-alvo:** `P51-VIS2` verde e reproduzido; `select` e `option` com `color`,
`background-color` e `color-scheme` explícitos — legível fechado e aberto (o mutante M51-08, que
devolve `inherit`/`transparent`, é detectado).

**Acessibilidade:** `P50-ACC1` (axe-core 4.13.0, 3 fixtures × 4 viewports, zero violações
critical/serious), `P50-ACC2` (fluxo canônico completo só por teclado, estado idêntico ao do mouse),
`P50-ACC3` (ordem de foco, sem armadilha), `P50-ACC4` (107 combinações de contraste, 15 alvos),
`P50-VIS5` (foco visível ≥ 3:1) — **todos PASS** na minha execução.

---

## 7 · Recomendações e qualidade das informações (§6)

Auditei os **oito** gaps exigidos, isolando cada um como gap alto, com a capability correspondente
declarada como ausência confirmada (`NONE`) e SaaS permitido:

| gap auditado | capability canônica | o que o relatório propõe |
|---|---|---|
| casos de uso de detecção | `detection-engineering` | FortiSIEM (**apoio contextual**, relação de suporte — “não é aquisição direta”), FortiAI-Assist; caminhos de apoio: FortiSIEM, FortiAnalyzer, FortiSOAR, FortiSOC |
| centralização de logs | `security-analytics` | FortiAnalyzer, FortiSIEM, **FortiSIEM Cloud** — aquisição candidata |
| gestão de vulnerabilidades | `vulnerability-management` | FortiEndpoint (**“camada endpoint”**), FortiRecon (**“complementa o programa; não representa sozinho todo o ciclo”**), serviço Vulnerability Assessment |
| visibilidade de rede | `network-detection` | **FortiNDR Cloud** com SaaS permitido; **FortiNDR (On-Premises)** quando `saasAllowed=no` / processamento local exigido |
| resposta a incidentes | `incident-management` | FortiSOAR + FortiGuard Incident Readiness Subscription, DFIR, TTX, Ransomware Readiness |
| automação | `security-automation` | FortiSOAR |
| capacitação | `soc-skills` | somente **serviços** (Incident Response Training); nenhum produto — correto |
| superfície externa | `external-exposure` | FortiRecon |

**Todos os oito produtos exigidos pela diretriz são alcançáveis** — FortiAnalyzer, FortiSIEM,
FortiSOAR, FortiSOC, FortiClient/EMS, FortiNDR, FortiRecon e os FortiGuard Services — e **nenhum
aparece em toda sessão**: a saída depende da resposta, do gap, da prioridade declarada e do contexto.

**Verificações de compatibilidade e não-overclaim:**

- **FortiSOC** aparece exclusivamente como **opção arquitetural** (política `architecture-only`),
  com o texto “abordagem integrada de SOC, como opção de plataforma — **nunca como produto
  obrigatório**”, e a Rota B só é emitida quando o `architectureNote` do motor a habilita
  (`saasAllowed=yes`, `socPlatformNone=true`, gaps core presentes). **Nunca como requisito.**
- **FortiClient administrado por EMS** só aparece em gestão de vulnerabilidades **com escopo de
  endpoint explícito** e a ressalva “não substitui uma plataforma completa de gestão de
  vulnerabilidades”. O mutante M51-06, que o descreve como “plataforma universal”, é detectado.
- **FortiRecon** em vulnerabilidades traz a delimitação “pertinente à superfície externa, não à
  gestão interna”; o manual repete “**não** cobre vulnerabilidade interna”.
- **Restrição arquitetural respeitada:** o mesmo gap de rede devolve `FortiNDR Cloud` ou
  `FortiNDR (On-Premises)` conforme `saasAllowed` / `localProcessingRequired`.
- **Contexto muda a leitura, não o número:** o mesmo gap de logs produz “Apoio direto — ausência
  confirmada de tecnologia” com `NONE`; com `PRESENT`, o relatório deixa de propor aquisição e passa
  a “A validar em aprofundamento · tecnologia declarada sem status operacional”. **Supressão
  funciona.**
- **Sem contexto declarado**, o bloco de apoio diz “as opções abaixo exigem **validar aderência**
  antes de qualquer recomendação” — não recomenda.
- **Prioridade declarada** abre a seção `#pr-prios` e insere o marcador “prioridade declarada pelo
  negócio”, ausente quando não há prioridade — sem alterar score algum.
- **Sem overclaim:** varredura por “é obrigatório”, “requisito obrigatório”, “solução completa”,
  “compra recomendada” no relatório inteiro — só ocorrem **negadas** (“não são requisito nem compra
  recomendada”). Minha mutação AUD-03, que troca a negação por afirmação, é detectada por
  `P51-REC1`.
- **Sem preço, SKU, sizing ou licenciamento presumido** no relatório e no manual (`P51-DOC10`).

**Nenhum blocker de recomendação.** Não encontrei produto incompatível com a capability, produto
apresentado como necessário sem base, omissão sistemática de correspondência crítica, recomendação
contraditória com as respostas nem informação de produto materialmente falsa.

---

## 8 · Relatório executivo e PDF (§7)

PDFs A4 reais gerados a partir do HTML candidato, em cinco cenários próprios (`margin 14 mm`,
`printBackground`), com medição sob **`emulateMedia({media:"print"})`**:

| cenário | bytes | score / estágio | régua | marcador |
|---|---|---|---|---|
| insuficiente, sem rótulo | 167.397 | `n/d` · “suficiência de dados não atingida” | “Estágio não determinado — dados insuficientes” | **ausente** |
| suficiente, rótulo Unicode `Cliente Órion — «piloto» 😀` | 313.519 | `1.0 / 5` · `Inicial` | `1.0 / 5 · Inicial` | presente |
| prioridades + evidência + alvo | 345.417 | `1.2 / 5` · `Inicial` | `1.2 / 5 · Inicial` | presente |
| todas as respostas no nível 0 | 275.857 | `0.0 / 5` · `Inexistente` | `0.0 / 5 · Inexistente` | presente |
| todas no nível 3 | 93.613 | `5.0 / 5` · `Em otimização` | `5.0 / 5 · Em otimização` | presente |

Conferido em **todos**: capa com título, subtítulo, disclaimer “Screening indicativo de alto nível —
não substitui assessment formal”, emblema e metadados; **zero controle interativo** no print; anexo
com **15** itens; **seis** faixas de régua; **cinco** itens de legenda; **zero requisição externa**;
**zero `pageerror`**; **nenhum texto cortado**; rótulo Unicode preservado sem corrupção.

**Metadados honestos:** sessão nova → `Data da sessão`; documento importado → **`Sessão registrada
em`** (o `createdAt` é o instante do export original, não o início da avaliação); `createdAt` ausente
→ **“Data original não informada”**, nunca fabricada; sem rótulo → **“Sem rótulo”**, nunca um nome
inventado; `toolVersion` = `3.4.0-dev.4.8.0.7`, igual a `window.__QS_BUILD_META`. Reproduzi também o
caso de rótulo **stale** (importar sem rótulo após importar com rótulo → volta a “Sem rótulo”).

**Caixa “Como interpretar este relatório”:** presente em todos os cenários, logo após o Resumo de
maturidade, 6 itens, curta; estática (não depende de score, suficiência, Target nem contexto).

### Régua de estágios

- **Deriva** de `stageOf()` por varredura de 0 a 5 (`qsStageBands`), sem literais de limiar próprios;
  `P51-RPT3` prova equivalência exaustiva em 501 pontos **e nas dez bordas**
  (`0.49/0.5/1.49/1.5/2.49/2.5/3.49/3.5/4.49/4.5/5`) — reexecutado, PASS. O mutante M51-12, que
  desloca uma borda, é detectado.
- **Não cria thresholds próprios.** ✓
- **`n/d` não vira zero:** sem suficiência não há marcador e a leitura é “Estágio não determinado”;
  com zero confirmado o marcador existe em 0 e a leitura é `0.0 / 5`. ✓
- **Legível em impressão:** extraída do PDF por `pdftotext -layout`, as seis faixas aparecem com
  número e nome. ✓
- **`posiciona corretamente o score`: ✗ — ver blocker B1.** A régua posiciona e nomeia a partir de um
  agregado **não arredondado**, divergente do canônico da tela.

### Legenda de domínios

Ordem canônica de `DOMS` (`Negócio · Pessoas · Processos · Tecnologia · Serviços`), nomes sempre
presentes, cores medidas por `getComputedStyle` iguais a `PR_DOM_HEX`
(`rgb(144,99,205) · rgb(60,177,126) · rgb(44,204,211) · rgb(48,127,226) · rgb(162,178,200)`), e
**pista não cromática**: cada item é prefixado por `1.` … `5.`, e os nós do emblema carregam os
mesmos números — o significado sobrevive à impressão em P&B.

### Emblema e faixa SVG

- **SVG inline**, sem `<image>`, sem `base64`, sem `url(...)`, sem rede, sem fonte remota ✓
- vértices **pré-calculados e fixos** (`QS_PENTA`), nada derivado de dado ✓
- cores exclusivamente de `PR_DOM_HEX`, na ordem canônica ✓ · **`#DA291C` ausente** ✓
- `role="img"` + `<title>`/`<desc>`, com o texto “Cinco domínios do Quickscan … Elemento gráfico
  fixo, **não representa resultados**” ✓
- **rótulos textuais** dos cinco domínios como nós `<text>` próprios ✓
- **byte-idênticos entre sessões**: `sha256(outerHTML)` do pentágono
  `6f39a578…0b6a592e` e da faixa `ba04a55d…fb9be99b` **iguais nos cinco cenários**, incluindo a
  sessão de score `0.0` contra a de score `5.0` ✓
- **não imita indevidamente uma visualização oficial do SOC-CMM**: é um pentágono de contorno com
  cinco nós numerados e rótulos, declarado como identidade estática; a visualização de dados do
  relatório é o radar separado, que sim reflete os scores.

---

## 9 · Documentação e guia de uso (§8)

Li integralmente `USER_GUIDE.md` (19.430 B), `README.md` (2.854 B), a caixa “Como interpretar este
relatório” e `docs_phase5/PHASE_5_1_UAT_REPORT.md` (31.636 B).

**Cobertura exigida — presente e correta:** finalidade e limitações (§1, §13); iniciar/continuar/
exportar/importar sessão (§2, §11); distinção entre resposta, evidência e contexto (§4); `null` ×
“Não sei” × zero confirmado (§3, com o quadro “ausência de evidência ≠ evidência de ausência”);
suficiência (§8); score (§8); domínios (§1); estágios (§8); prioridades (§5); gaps (§8);
Current × Target (§9); recomendações (§10); relatório/PDF (§12); revisão humana antes da entrega
(checklist §12 e §13); troca e isolamento de clientes (§11, com checklist A→B→A); armazenamento
manual dos assessments (§11 e README); influência do contexto tecnológico (§6, §7).

**Contexto tecnológico — as seis afirmações exigidas estão explícitas:**

| exigência | onde |
|---|---|
| melhora interpretação, priorização e recomendações | §6, tabela de influência (`Alta`/`Muito alta`) |
| ajuda a contextualizar evidências e arquitetura | §7 (Deployment, Arquitetura e restrições, Cobertura) |
| não altera arbitrariamente respostas | §6.2 “Nenhuma dessas classificações altera o score original” |
| não substitui os cálculos canônicos | §6 “O assessment informa o diagnóstico; o contexto informa a prescrição” |
| não aumenta nem reduz score por presença de tecnologia | §3 “Tecnologia não eleva maturidade”; §6 “influência zero sobre o score” (linhas `Nenhuma` para score, estágio, suficiência e gap) |
| não transforma inventário de produto em maturidade | §13 “Não use produto instalado como proxy de maturidade” |
| não substitui validação humana | §10, §13 e o checklist pré-entrega |

**Conferência literal contra a UI:** os cinco rótulos de `PRESENCE_LABELS`, os sete de
`STATUS_LABELS` e os seis nomes de estágio de `stageOf()` aparecem no manual **exatamente** como o
runtime os renderiza (24 conferências, 1 divergência — a de R2, de redação de cálculo, não de
rótulo). Os rótulos `Não sei · precisa validar` e `Adicionar evidência ou observação` coincidem.

**Busca por afirmações que induzam a ler recomendação como obrigação, garantia, certificação ou
conclusão automática:** o manual é conservador e, em vários pontos, explicitamente restritivo —
“Produto exibido é **possibilidade de apoio**, não requisito automático”; “Score **não é
certificação**”; “Recomendação **não substitui validação**”; “**FortiSOC** … nunca obrigatória”;
“Este manual e o relatório **não** trazem preço, SKU, dimensionamento, licenciamento presumido nem
promessa de cobertura”. O README repete o disclaimer de screening. **Nada encontrado.**

**Imprecisões factuais encontradas:** R2 (fórmula do score geral) e R3 (ordem das seções do
relatório). Nenhum erro gramatical foi tratado como achado.

**`PHASE_5_1_UAT_REPORT.md`:** honesto quanto ao escopo (“a fase não é declarada concluída nem
aprovada por este documento”), quanto à regravação/restauração de evidências e quanto às limitações
remanescentes. Não declara freeze, merge nem release. A imprecisão de contagem está em R5 e a de
redação da N4 em R4.

---

## 10 · Testes alterados e não vacuidade (§9)

### Diff das três suítes congeladas contra `HEAD`

`tests_journey_m45.js` (+22/−6), `tests_session_m48.js` (+16/−3), `tests_visual/screen.spec.js`
(+7/−5). Nenhum teste removido, nenhum `skip` acrescentado, nenhuma asserção suprimida sem
substituição.

| gate | mudança | avaliação |
|---|---|---|
| `N1-N2` | `.includes("PERFIL ATUAL")` → `/PERFIL ATUAL/i` | tipografia (a caixa alta passou ao CSS); a propriedade — rótulo do perfil atual **no nó atual** — permanece |
| `N3` | ausência de “PRÓXIMO ESTÁGIO” medida nos `.jn-label` em vez do texto do bloco | **mais preciso**: a nota explicativa cita “próximo estágio” em prosa e não é marcador de estado |
| `N6-N7` | `CENÁRIO-ALVO` case-insensitive | tipografia |
| `N30-N32` | idem, restrito aos `.jn-label` do `#pr-journey` | tipografia + precisão |
| `N33-N34` | glifos `● ◆` → `data-jn-state` + numeração `0,1,2,3,4,5` + 6 marcadores + rótulos | **mais forte**: exige três sinais não cromáticos em vez de dois glifos |
| `S37` | corpo do relatório comparado **excluindo a capa**; `pre === post` e `pre.length > 500` mantidos; proveniência asserida **à parte** (`Data da sessão` na original × `Sessão registrada em` na importada) | **exatamente o pedido**: corpo canônico idêntico continua exigido e a proveniência nova é verificada separadamente |
| `V8` (visual) | quatro `toContain` → `toMatch(/…/i)`, **incluindo a asserção negativa** | tipografia; nenhuma cobertura perdida |

Contagens observadas **iguais ao baseline**: Journey **31/31**, Session **97/97**, visual
**67 passed · 0 failed · 37 skipped** — o número de `skip` **não aumentou**.

### `P51-REC1` — o oráculo não deriva da tabela que valida

Confirmado. O nome da capability é comparado contra **`MAP[qid].cap`** (o motor congelado), não
contra `QS_GAP_SUPPORT[qid].cap`; e o conjunto de `qid` autorizados
(`detection-lifecycle`, `logs`, `automation`, `vulnerability-management`) é **declarado no gate a
partir da diretriz §UAT-07**, externa ao produto. Verifiquei em código que `qsGapSupportHTML()`
publica de fato `MAP[f.id].cap` (`ui_v32.js:912`), fechando o ciclo. Mutante M51-07 (apoio anexado ao
gap errado) é detectado por esse caminho.

### `P51-PDF1` — a medição usa mídia print

Confirmado: `await pg.emulateMedia({ media: "print" })` **antes** de `pg.evaluate` das caixas, e o
documento é renderizado por `pg.pdf({format:"A4"})`. A geometria de `.pr-cover` só existe sob
`@media print`; medir sem emular lia um layout que o papel nunca teria — foi por isso que o mutante
de colisão de capa (M51-16) passou antes e é detectado agora.

### `P51-DOC1` a `P51-DOC12`

Todos executados e **PASS**. Verificam fatos, não burocracia: existência e referência mútua manual ↔
README; afirmação de influência zero sobre o score; completude e coerência da tabela de influência;
`n/d` × zero confirmado; data da sessão × data de geração; cenário-alvo sem promessa; glossário de
mandato formal; limitações de produto sem overclaim; checklist acionável; ausência de pricing/SKU;
**coincidência literal com os rótulos finais da UI**; e a caixa interpretativa no PDF, curta e após o
resumo. Minha mutação AUD-04, que remove a afirmação de influência zero, é detectada por
`P51-DOC2`.

### Os 16 mutantes dirigidos — reexecutados por mim

Campanha `node tests_p51_mutants.js` executada integralmente **em cópia**:

**`MUTATION TESTING (Phase 5.1): 16/16 mutantes detectados pelo gate e motivo esperados`**

Veredito por mutante **idêntico** ao `P51-mutation.json` entregue (`detected` e `restored` iguais em
16/16); os hashes de baseline coincidem com os SHAs declarados no §2 do relatório da candidata.
O harness só conta detecção quando a **linha `FAIL <gate>` esperada** aparece **com motivo
compatível** — detecção por manifesto, sintaxe ou crash **não conta**.

| # | mutante | gate | motivo observado |
|---|---|---|---|
| M51-01 | empilhamento em desktop | `P51-VIS1` | “mapa e pergunta se sobrepõem horizontalmente (1280px)” |
| M51-02 | segundo botão de evidência | `P51-UX1` | “2 controles de evidência focáveis” |
| M51-03 | exemplo de MSSP no qid errado | `P51-UX2` | “exemplo de MSSP aparece em mandate” |
| M51-04 | jornada sem número | `P51-JN1` | “nó 0: número ''” |
| M51-05 | tag de domínio fora da ordem | `P51-COR5` | “fora da ordem canônica: 'x0'” |
| M51-06 | FortiClient como plataforma universal | `P51-REC1` | “FortiClient citado sem escopo de endpoint” |
| M51-07 | apoio no gap errado | `P51-REC1` | “apoio anexado a um gap fora do mapeamento normativo: 'training'” |
| M51-08 | `option` sem cor/fundo | `P51-VIS2` | “option 'Manter atual' sem fundo explícito” |
| M51-09 | rótulo de sessão stale | `P51-RPT2` | “label ficou stale após import sem rótulo” |
| M51-10 | data de geração como data da sessão | `P51-RPT2` | “data da sessão e de geração vêm do mesmo instante” |
| M51-11 | régua marca sem suficiência | `P51-PDF1` | “régua marcou posição com dados insuficientes” |
| M51-12 | régua diverge de `stageOf()` | `P51-RPT3` | “divergência em 2.9” |
| M51-13 | cor de domínio trocada | `P51-RPT4` | “legenda 0: cor 'background:#3CB17E' != #9063CD” |
| M51-14 | emblema varia com o score | `P51-RPT5` | “SVG 'pentagon' varia entre sessão baixa e alta” |
| M51-15 | emblema perde rótulos | `P51-RPT5` | “rótulo 'Negócio' ausente dos textos do gráfico” |
| M51-16 | capa colide com o cabeçalho | `P51-PDF1` | “capa e cabeçalho colidem (head top 0 < fim da capa 178)” |

**Restauração byte a byte** após a campanha (cópia × original):

```text
ui_p50_v32.css                             IDÊNTICO
ui_p50_shell_v32.js                        IDÊNTICO
ui_journey_v32.js                          IDÊNTICO
ui_v32.js                                  IDÊNTICO
quickscan_secops_soccmm_v3_2_dev.html      IDÊNTICO
```

**Marcadores residuais de mutação: zero** (varredura por `M51-` e pelos fragmentos injetados nos
quatro arquivos).

### Não regravação das evidências históricas

`docs_phase5/evidence_p50/` tem 82 arquivos, todos rastreados no `HEAD`. Após `npm run test:all` na
cópia, **29** foram regravados — **100% dentro do escopo declarado** no cabeçalho do manifesto
(prefixo `P50-5.0.5-` ou os artefatos exigidos por nome). Os **32** arquivos com prefixo
`P50-5.0.1-` a `P50-5.0.4-` permaneceram **byte-idênticos**. No repositório original,
`git status --porcelain docs_phase5/evidence_p50/` é **vazio** — nenhuma evidência histórica foi
alterada na entrega.

### Minhas mutações adversariais (§9, obrigatórias)

Quatro mutações próprias, materialmente diferentes das 16 entregues, aplicadas em cópia:

| id | classe | arquivo | gate esperado | resultado |
|---|---|---|---|---|
| **AUD-01** | cálculo / suficiência | `ui_p50_suff_v32.js`: limiar por domínio `2 → 1` | `P50-SUF7` | **DETECTADO** — `FAIL P50-SUF7 … vetor [0,0,0,0,0] campo domains[0].required: esperado 2, observado 1`; também `P50-SUF1` e `P50-SUF8` |
| **AUD-02** | cálculo · **sinal** do gap Current×Target | `ui_p50_results_v32.js`: `p50Round1(tScore - score)` → `p50Round1(score - tScore)` | `P50-VIS9` | **NÃO DETECTADO** — 61+27+31+30+13 gates verdes com o mutante ativo → **ressalva R1** |
| **AUD-03** | recomendação · overclaim de produto | `ui_v32.js`: “não são requisito nem compra recomendada” → “constituem requisito obrigatório” | `P51-REC1` | **DETECTADO** — `FAIL P51-REC1 … overclaim de produto` |
| **AUD-04** | documentação operacional | `USER_GUIDE.md`: remove a afirmação de influência zero sobre o score | `P51-DOC2` | **DETECTADO** — `FAIL P51-DOC2 … afirmação de influência zero sobre o score ausente` |

Todos os quatro arquivos **restaurados byte a byte** e o HTML reconstruído em `e8857a9d…a55b8513`.
**3 de 4 detectadas pelo gate semanticamente correspondente**; a que sobreviveu está registrada como
ressalva R1, por ser buraco de assurance e não defeito do produto entregue.

---

## 11 · Regressão dirigida (§10)

Tudo executado **na cópia**, com o HTML reconstruído pelo builder.

| suíte / gate | esperado (baseline) | observado | veredito |
|---|---|---|---|
| build determinístico A/B/C | mesmo SHA-256 | 3 execuções → `e8857a9d…a55b8513`, **idêntico ao entregue** | **PASS** |
| `tests_m42_m86.js` (engine) | 105 | **105 PASS · 0 FAIL** | **PASS** |
| UI M3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | 19 / 25 / 11 / 23 / 26 | **19 / 25 / 11 / 23 / 26**, 0 FAIL | **PASS** |
| UX 4.1 | 56 | **56 PASS · 0 FAIL** | **PASS** |
| Target 4.3.1 | 30 | **30 PASS · 0 FAIL** | **PASS** |
| Ref 4.4 | 28 | **28 PASS · 0 FAIL** | **PASS** |
| Journey 4.5 *(suíte alterada)* | 31 | **31 PASS · 0 FAIL** | **PASS** |
| Icons 4.6 | 12 | **12 PASS · 0 FAIL** | **PASS** |
| **Session 4.8** *(suíte alterada)* | 97 | **97 PASS · 0 FAIL** | **PASS** |
| UNSET (UG) | 13 | **13 PASS · 0 FAIL** | **PASS** |
| **P50 CORE + P51** | — | **61 PASS · 0 FAIL de 61** | **PASS** |
| **P50 CHROMIUM + P51** | — | **27 PASS · 0 FAIL de 27** (inclui `P51-VIS1`, `P51-VIS2`, `P51-PDF1`, `P50-VIS10` de print integral) | **PASS** |
| **M41** | PASS + payload | **PASS** · `COMPARAÇÃO: PASS` · payload `9794b267…f3ed4365b` | **PASS** |
| **`test:visual`** *(spec alterada)* | 67 / 0 / 37 | **67 passed · 0 failed · 37 skipped** | **PASS** |
| manifesto | 143 OK | **143 OK**, 0 duplicata, 0 autorreferência, 0 ausente | **PASS** |
| mutantes P51 | 16/16 | **16/16** | **PASS** |
| mutações do auditor | — | **3/4** (ver R1) | **ressalva** |

**Nenhum comando foi interrompido ou expirou.** Todo `PASS` acima corresponde a execução completa
observada nesta auditoria. **Não expandi para a regressão integral**: nenhuma das amostragens
revelou divergência de cálculo do estado canônico, alteração inesperada de owner, falha de build,
enfraquecimento de suíte, mudança fora da boundary, contaminação de evidência ou erro que sugira
regressão sistêmica. O blocker B1 é uma divergência **localizada numa única linha** de
`buildPrintReport()`, com origem no `HEAD` e alcance ampliado nesta fase — não indício de regressão
estrutural.

### Boundary

`P50-GOV1` fixa byte a byte as superfícies protegidas da §29.4 e passou. Os repins declarados
(`ui_v32.js`, `ui_v32.css`, `ui_journey_v32.js`) correspondem à autorização nominal da diretriz de
2026-08-22; `ui_target_v32.js` e `ui_session_v32.js` continuam pinados no valor original.
`engine_v32.js` **byte-idêntico** ao core e payload M41 **inalterado**. `build_v32_html.py`,
`package.json` e `package-lock.json` byte-idênticos ao `HEAD`. **Nenhuma alteração fora da
boundary.**

---

## 12 · Produção e preview (§11) — somente observação

| alvo | esperado | observado | veredito |
|---|---|---|---|
| produção `127.0.0.1:1337` | HTML V3.2 `8d0932e1…f1dd85ddb` | **HTTP 200** · 578.152 B · `8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb` | **OK** |
| preview `127.0.0.1:1338` | candidato `e8857a9d…a55b8513` | **HTTP 200** · 743.908 B · `e8857a9da789367b6a20c4c0aa848cc3db550f99d243f052d12ccd1aa55b8513` | **OK** |
| Tailscale Serve | somente produção 1337 | `https://flavio-desktop.tail396297.ts.net (tailnet only)` → `/ proxy http://127.0.0.1:1337` | **OK** |
| Funnel | ausente | `tailscale funnel status` devolve apenas a configuração **tailnet only**; nenhuma exposição pública | **OK** |

Consultas exclusivamente de leitura (`curl`, `tailscale … status`). **Nenhum container foi
reiniciado, parado, removido ou modificado.**

---

## 13 · Testes NÃO executados (declarados)

- `visual_print_evidence_47/48/487.zip` — acervos históricos; não foram descompactados nem
  reconferidos. Fora do escopo de risco desta rodada.
- Auditoria de acessibilidade **manual** com leitor de tela real (NVDA/JAWS/VoiceOver): não
  executada. A cobertura automatizada (`axe-core` 4.13.0, foco, contraste, ordem de foco,
  equivalência teclado/mouse) foi executada e passou.
- Testes em navegadores **não-Chromium** (Firefox, Safari/WebKit): fora do escopo declarado do
  projeto e da diretriz.
- Regressão integral da história do projeto anterior à Phase 5.0: **não** executada, por decisão
  amparada na §10 da diretriz — nenhum sinal de regressão estrutural apareceu na amostragem.
- Impressão física em papel: não executada; a leitura em P&B foi avaliada pelo PDF e pelas pistas
  não cromáticas (numeração de legenda e de nós).

---

## 14 · Resumo

| dimensão auditada | veredito |
|---|---|
| Identidades, manifesto e boundary | **PASS** |
| Exatidão de cálculo, score, gaps, suficiência e cenário-alvo (estado canônico) | **PASS** |
| Estado canônico e isolamento entre clientes/sessões | **PASS** |
| Export/import e não serialização de derivados | **PASS** |
| Experiência de assessment, responsividade e acessibilidade | **PASS** |
| Recomendações de capacidades e produtos Fortinet | **PASS** |
| Emblema, faixa, legenda e metadados do relatório | **PASS** |
| **Coerência do relatório executivo/PDF (estágio de maturidade)** | **FAIL — blocker B1** |
| Coerência factual do manual e da documentação | **PASS com ressalvas R2, R3** |
| Suítes alteradas, não vacuidade e poder de mutação | **PASS com ressalva R1** |
| Regressão dirigida | **PASS** |
| Produção e preview | **PASS** |

### Blockers

1. **B1** — o relatório executivo nomeia estágio de maturidade uma faixa abaixo do canônico e
   contradiz a si mesmo dentro do mesmo PDF (§3).

### Ressalvas não bloqueantes

1. **R1** — o sinal do gap Current × Target não é protegido por gate algum (mutação AUD-02
   sobreviveu a 162 gates).
2. **R2** — `USER_GUIDE.md` §8 descreve o score geral como “média das respostas confirmadas”.
3. **R3** — `USER_GUIDE.md` §12 lista a estrutura do relatório fora da ordem produzida.
4. **R4** — limitação N4 da camada congelada de Target, confirmada e adequadamente contida.
5. **R5** — a contagem “36/36” de evidências reconferidas não reproduz (observei 29, todas no escopo
   declarado; as históricas intactas).
6. **R6** — versão nominal de Chromium, ressalva ambiental já declarada e sem regressão.

### Confirmação final

**Nenhum arquivo da candidata foi alterado por esta auditoria.** Inventário pré e pós da árvore
original idênticos (337 arquivos, SHA-256 do inventário
`b3ec0a71fd6e58b20110a9ea54bf1e74f6d9a13867337062fbbd44e6c28860d0` nos dois momentos), `git status`
inalterado, `HEAD` em `af279a685eacffb8c85c60976cf4c6a059b967d0`. Nenhum commit, push, PR, merge,
tag, release, freeze ou deployment. `AGENTS.md` não foi tocado. Nenhuma fase seguinte foi iniciada.

**A fase não é declarada concluída nem congelada por este documento. O veredito é `FAIL` e a
decisão é do proprietário.**
