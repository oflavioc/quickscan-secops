# AUDITORIA_REV_A.md — Auditoria independente da PHASE 5.0 Candidate Spec REV A

**Data:** 2026-08-18 · **Workspace:** `/mnt/c/Projetos/QuickScan-SOC-CMM/phase5`
**Objeto auditado:** `specs/PHASE_5_0_REV_A.md` · sha256
`22e729174c6a3c5dd620da5330b03eb96d9eb6fc6e64eba097c2bde55eb0a510` (conferido nesta sessão)
**Runtime de referência:** baseline congelado 4.8.0.7 (core `625079c4…0ee5b89d`)
**Natureza:** auditoria documental + verificação contra o source real. **Nenhuma implementação da
Fase 5.0 foi realizada. Nenhum artefato congelado foi alterado.**

---

## 1 · Veredito

```text
RESULTADO:            REPROVAR REV A
ABERTURA DA FASE 5.0: BLOQUEADA
blockers abertos:     6   (B-1 … B-6)
achados altos:        9   (A-1 … A-9)
achados médios:       8   (M-1 … M-8)
achados baixos:       5   (L-1 … L-5)
decisões D1–D5:       1 decidível · 1 decidível com custo declarado · 2 bloqueadas · 1 fora de escopo
```

A REV A é sólida como carta de princípios metodológicos: os invariantes que ela protege são os
corretos e a disciplina "apresentação nunca produz efeito canônico" está bem formulada. O problema
não é de intenção, é de **referência**: a REV A foi escrita contra um baseline hipotético "pós-4.9"
e nunca foi confrontada com o source do runtime que a Fase 5 realmente herda. Disso decorrem três
classes de defeito:

1. cláusulas que **descrevem o baseline errado** (moeda de suficiência, camada de aspectos, aridade
   da escala de resposta, owner das notas);
2. gates que são **insatisfazíveis** contra o runtime real (SUF0/SUF3 sobre um contrato booleano;
   UX9 sobre um documento com timestamp);
3. anti-patterns que a spec proíbe e que **já existem hoje** exatamente nas superfícies que a
   própria spec declara protegidas — a fase, como escopada, não pode corrigi-los.

Nada disso invalida a fase; invalida **esta revisão** como documento normativo. A remediação é uma
REV B escrita contra o source, com o conjunto fechado de correções da seção 8.

---

## 2 · Método e limites desta auditoria

Executado:

- leitura integral de `CLAUDE.md`, `PHASE_5_KICKOFF.md` e `specs/PHASE_5_0_REV_A.md` (1859 linhas);
- verificação de identidade do baseline por hash (MANIFEST, engine, HTML fonte e construído);
- reexecução das suítes congeladas que não escrevem artefatos;
- inspeção direta do source para cada cláusula listada no escopo autorizado
  (UI-009A, UI-010A, GOV1, SUF0, UI-033A, UI-046A, SESUX1A/1B, SESUX5, UX9), mais as cláusulas
  adjacentes cuja consistência dependia delas.

**Não executado nesta sessão** (declarado, não omitido):

- `npm run test:visual` — Playwright/Chromium; escreve `visual_evidence/` e `print_evidence/`.
  A auditoria é de especificação e o modo de trabalho é read-only; a evidência visual congelada
  vale a da execução consolidada do proprietário.
- `node tests_icons_m46.js` — escreve arquivos (`writeFileSync`).
- `npm run build` — reescreveria `quickscan_secops_soccmm_v3_2_dev.html`. Desnecessário: o hash do
  HTML construído já confere byte a byte com o baseline.

Limite metodológico assumido: esta auditoria julga a **spec** contra o **source**. Ela não julga a
qualidade estética da experiência proposta, nem substitui os protótipos de UI que a regra do projeto
exige antes da revisão formal quando há decisão de design em aberto (D1–D5).

---

## 3 · Validação do baseline

### 3.1 Identidade (medida nesta sessão)

| item | esperado | observado | veredito |
|---|---|---|---|
| `specs/PHASE_5_0_REV_A.md` | `22e72917…5eb0a510` | `22e729174c6a3c5dd620da5330b03eb96d9eb6fc6e64eba097c2bde55eb0a510` | **PASS** |
| `MANIFEST.sha256` | 74/74 OK | 74/74 OK · 0 FAIL | **PASS** |
| `engine_v32.js` | `9a4a2e67…2b5d247a` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | **PASS** |
| `quickscan_secops_soccmm_v3_2_dev.html` | `8d0932e1…1fd85ddb` · 578152 B | `8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb` · 578152 B | **PASS** |
| `quickscan_secops_soccmm_v3_1_3.html` | `3e24ff9d…c36f87bb` (MANIFEST) | `3e24ff9dc18ec3c8005a75820e2828f801a8013a0e3945396c215b26c36f87bb` | **PASS** |
| M41 payload canônico | `9794b267…3ed4365b` | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` · `COMPARAÇÃO: PASS` | **PASS** |

### 3.2 Suítes congeladas (medidas nesta sessão)

```text
MATRIZ (M1–M40 + M42–M86 + P2.1):  105 PASS · 0 FAIL de 105
UI M3.1:                            19 PASS · 0 FAIL de 19
UI 3.2:                             25 PASS · 0 FAIL de 25
UI 3.3.1:                           11 PASS · 0 FAIL de 11
UI 3.3.2 (PDF):                     23 PASS · 0 FAIL de 23
UI 3.3.3:                           26 PASS · 0 FAIL de 26
UX 4.1:                             56 PASS · 0 FAIL de 56
TARGET 4.3.1:                       30 PASS · 0 FAIL de 30
REF 4.4:                            28 PASS · 0 FAIL de 28
JOURNEY 4.5:                        31 PASS · 0 FAIL de 31
SESSION 4.8:                        97 PASS · 0 FAIL de 97
M41:                                PASS (payload idêntico ao baseline)
ICONS 4.6:                          NÃO EXECUTADO nesta sessão (escreve arquivos)
VISUAL (Chromium):                  NÃO EXECUTADO nesta sessão
```

**Veredito do baseline: VALIDADO** para os fins desta auditoria — identidade íntegra e todas as
suítes executadas nas contagens exatas do baseline 4.8.0.7. O registro em duplicidade (execução
consolidada do proprietário × revalidação desta sessão) está em
`docs_phase5/BASELINE_VALIDATION_WSL.md`.

---

## 4 · Proveniência das citações `arquivo:linha`

Toda referência de linha neste relatório aponta para **um** dos três tipos de arquivo abaixo. A
distinção é obrigatória porque o fonte e o build têm numerações diferentes:

| rótulo usado | arquivo | observação |
|---|---|---|
| `fonte:N` | `quickscan_secops_soccmm_v3_1_3.html` | **Camada 1 congelada.** É a fonte de verdade auditável e a que consta do MANIFEST (`3e24ff9d…`). |
| `build:N` | `quickscan_secops_soccmm_v3_2_dev.html` | artefato gerado por `build_v32_html.py`; nunca editar. Citado só quando útil para reprodução. |
| `arquivo.js:N` | `ui_v32.js`, `ui_target_v32.js`, `ui_session_v32.js`, `engine_v32.js`, `tests_*.js` | arquivos independentes; numeração própria, idêntica no repositório e no MANIFEST. |

**Regra de conversão verificada:** para todo o trecho anterior à âncora de injeção
(`const CONFIG_ERRORS = validateConfig();` — `fonte:1063` / `build:4682`), vale
`build = fonte + 362`. O deslocamento vem do CSS injetado antes do bloco `<script>`.
Aferido em quatro pontos independentes: `esc` 472→834 · `dataSufficiency` 501→863 ·
`radarSVG` 739→1101 · régua de domínio 939→1301.

---

## 5 · Verificação cláusula a cláusula contra o source

### 5.1 UI-009A — Canonical Sufficiency Currency · **FALHA (A-1)**

Contrato real:

```js
/* fonte:483 */ function confirmedCount(){ return ans.filter(v=>v!==null && v!=="NA").length; }
/* fonte:501 */ function dataSufficiency(stats){
                  return confirmedCount() >= 10 && stats.every(s=>s.n>=2);
                }
```

A moeda canônica de suficiência **é** *resposta confirmada* — definida como resposta que não é
`null` e não é `"NA"` — em duas dimensões: global (`≥10` de 15) e por domínio (`s.n >= 2` de 3,
onde `n` é a contagem de respostas pontuáveis do domínio, `fonte:485`).

A UI congelada **já exibe essa moeda com esse nome**:

- `fonte:926` — `${confirmed} de ${QS.length} respostas confirmadas na sessão`;
- `fonte:855` (bloco `leitura`) — “refletem somente as **respostas confirmadas**”;
- `fonte:493–497` (`domStat.basis`) — “3 de 3 **respostas confirmadas** · leitura consistente”,
  “2 de 3 respostas confirmadas · 1 requer validação”, “1 de 3 respostas confirmada · leitura parcial”.

A REV A afirma o contrário em dois lugares:

- o bloco **Proibido** veda à UI a substituição `answers → confirmed answers`;
- a **Nota de origem** declara que o termo “confirmadas” era “contaminação vinda da taxonomia do
  template de relatório (✅/⚠/❓)” e que “essa taxonomia **não** é assumida como canônica”.

A segunda afirmação é factualmente incorreta contra este baseline e a primeira inverte a direção
correta: exibir “respostas” (incluindo `NA`) seria o erro; “respostas confirmadas” é a unidade
canônica. A intenção original da cláusula — impedir que a UI invente uma unidade — permanece válida
e deve ser preservada; o que precisa cair é o exemplo e a nota de origem.

> **Remediação (REV B):** declarar normativamente a moeda como
> `respostas confirmadas (global ≥ 10) + respostas confirmadas por domínio (≥ 2 de 3)`, citando
> `confirmedCount()`/`domStat().n`; remover a Nota de origem; manter a proibição genérica de
> traduzir/aproximar a unidade. Preservar a distinção correta que a nota tentava fazer: a taxonomia
> ✅/⚠/❓ do template consultivo continua **não** canônica (isso é UI-021, e ali está certo).

### 5.2 UI-010A — UX-derived ephemeral state · **PASSA com lacuna (M-4)**

A categoria é coerente com o baseline e o invariante que ela estende é real e provado: o export
serializa **apenas** entradas canônicas (`captureCanonicalInputs()`, `ui_session_v32.js:42–68`) e o
import recusa chaves desconhecidas em raiz e em `inputs` (`ui_session_v32.js:214`, `:220`), recusa
derivados (`hasReservedDerived`, `:222`) e recusa chaves proibidas (`:215`). Nenhum dos estados
listados por UI-010A tem qualquer caminho para o documento canônico hoje.

Lacuna: a enumeração não inclui o estado que **SESUX1B exige** — “modificado desde o último export”
(dirty flag) e o resultado da última operação de sessão (sucesso/falha de export, import aplicado).
Sem enumerá-lo explicitamente como efêmero, ele é o candidato mais provável a virar campo
serializado por conveniência.

### 5.3 GOV1 — Protected-surface authorization · **FALHA parcial (A-7, A-6)**

O gate está corretamente concebido (transformar a change boundary em verificação executável), mas
opera na granularidade errada. O fluxograma decide por **arquivo/superfície**, e no baseline real
uma mesma unidade de arquivo contém superfície autorizável e superfície protegida:

| arquivo | superfície de tela (potencialmente autorizável) | superfície print/render (protegida, 4.7) |
|---|---|---|
| `ui_v32.js` | editor, cards, blocos pós-resultado | `prRadarSVG` `:644` · `buildPrintReport` `:673` · `preparePrint` `:779` · `safePrint` `:799` |
| `ui_target_v32.js` | `tgtSection` `:49` | `pr-target` `:188` |
| `ui_journey_v32.js` | render de jornada | `pr-journey` `:196` |
| `ui_refinement_v32.js` | render de refinamento | `pr-refinement` `:146` |

Além disso, a change boundary da §29 **não menciona** os três artefatos sem os quais nenhum arquivo
novo de UI passa a existir: `build_v32_html.py` (lista literal de fontes injetadas, linhas 10–19 e
56–58 — e `CLAUDE.md` proíbe editá-lo sem autorização), `package.json` (registro de suítes novas) e
`MANIFEST.sha256` (74 entradas). GOV1 não é executável enquanto esses três não estiverem
classificados.

### 5.4 SUF0 — Renderer does not own sufficiency logic · **FALHA (B-1, B-2)**

Duas falhas independentes.

**(a) O contrato canônico não retorna o que SUF0/SUF3/UI-012 mandam renderizar.**
`dataSufficiency()` retorna `boolean`. Não há razões, não há déficit por domínio, e os limiares
(`10`, `2`) são literais dentro da função (`fonte:501–503`). UI-012 exige “condições pendentes
retornadas pelo runtime”, SUF3 exige “gate message uses runtime sufficiency reasons” e proíbe
reimplementar o gate no renderer. Contra este baseline, as três saídas possíveis são:

1. o renderer recalcula “falta +1 em Processos” a partir de `domStat().n` e de constantes `10`/`2`
   copiadas → **viola SUF0 literalmente**;
2. `dataSufficiency()` passa a retornar um objeto → **quebra M41**: `suff` entra no payload funcional
   canônico (`harness_m41_v313.js:96–…`, campo `suff` do snapshot), cujo hash
   `9794b267…3ed4365b` é invariante da fase; além disso a função vive na Camada 1
   (`fonte:501`), artefato mais protegido do baseline;
3. adiciona-se uma função **nova** de relatório de suficiência (ex.: `sufficiencyReport()`) num
   arquivo de UI da Fase 5, sem tocar `dataSufficiency()` — tecnicamente possível, porque o código
   injetado compartilha escopo com `QS`/`domStat`/`confirmedCount`, mas os limiares continuariam
   duplicados fora da fonte canônica, o que é a mesma violação da opção 1 com outro nome.

Não existe caminho limpo sem uma decisão explícita do proprietário. **Este é o blocker central da
fase**, porque a Wave 1A inclui nominalmente “sufficiency lock (renderizando o resultado do runtime,
ver SUF0)”.

**(b) SUF0 já é violado pelo próprio baseline.** `ui_target_v32.js:24–36` reimplementa o gate:

```js
/* [D] calculador PURO — espelha byte a byte a matemática legada (SCORES/DOMS/média/suficiência/stageOf) */
function computeTargetProfile(eff){
  ...
  const confirmed = eff.filter(v=>v!==null && v!=="NA").length;
  const suff = confirmed>=10 && stats.every(s=>s.n>=2);      /* ui_target_v32.js:32 */
```

A duplicação é deliberada e documentada no comentário — foi a forma de calcular o perfil-alvo sem
mutar o vetor de respostas real. A REV A não diz se SUF0 é retroativo. Se for, a conformidade exige
tocar uma superfície congelada 4.3.1 protegida por 30 gates verdes; se não for, SUF0 precisa dizer
isso, sob pena de o primeiro gate da fase falhar contra código que ninguém está autorizado a mexer.

### 5.5 UI-033A — Idioma baseline · **FALHA leve (M-5)**

`UI language baseline: PT-BR` conflita com o bilinguismo canônico deliberado do produto:

```js
/* fonte:275 */ const DOMS = [{en:"Business", pt:"Negócio"}, … {en:"Services", pt:"Serviços"}];
/* fonte:474 */ function stageOf(v){ … return {en:"Managed", pt:"Gerenciado"}; … }
/* fonte:924 */ <div class="stage-tag">${st.en} · ${st.pt}</div>
/* fonte:943 */ <span>0 Non-existent</span>…<span>5 Optimizing</span>
```

Os nomes de estágio e de domínio em inglês não são “i18n”: são rótulos canônicos de conteúdo
metodológico (SOC-CMM), asseridos por gates congelados. UI-033A, lida literalmente, proíbe o que o
produto já faz e que não deve mudar.

> **Remediação:** “PT-BR é o idioma da UI **nova** (chrome, mensagens, rótulos de estado);
> denominações canônicas de domínio e estágio permanecem como congeladas, em PT/EN; EN/i18n
> generalizado é future scope.”

### 5.6 UI-046A — Insufficient Print Policy · **PASSA com correção de premissa (M-1)**

A cláusula pede escolher entre `COLLECTION_REPORT` e `BLOCK_PRINT`. A premissa implícita — de que
não há política hoje — é falsa. O runtime congelado **já implementa** um `COLLECTION_REPORT` de
fato:

```js
/* ui_v32.js:687-689 */
<b>${overall!==null ? overall.toFixed(1)+" / 5" : "n/d"}</b><span>Score geral indicativo</span>
${(suff && overall!==null) ? …estágio… : `<b>—</b><span>Estágio: suficiência de dados não atingida</span>`}
<b>${suff ? "adequada" : "insuficiente"}</b><span>Suficiência da sessão</span>
```

e o comportamento é gate congelado: `tests_ui_m332.js:102` (`P11 — insuficiência: score n/d, sem
estágio fabricado`). O único bloqueio de print existente é ortogonal à suficiência: rascunho de
contexto tecnológico não salvo (`ui_v32.js:781–785`).

Duas consequências para a REV B:

1. escolher `BLOCK_PRINT` seria **regressão de comportamento congelado** e quebraria gates de print;
   a política default já está escolhida de facto e a decisão real é ratificá-la;
2. resta uma questão genuína que a REV A não formula: sob gate fechado, o PDF **continua imprimindo
   scores por domínio** (`ui_v32.js:692–693`) e o radar. É preciso decidir normativamente se score
   por domínio sob insuficiência conta como “veredito executivo” — UI-014 diz que sim (`Domain —
   Insufficient evidence`), o print diz que não. Ver B-3 e M-7.

### 5.7 SESUX1A / SESUX1B — claim de persistência · **PASSA (com observação)**

SESUX1A (lint estático) é implementável e barato. SESUX1B é a cláusula certa e a mais valiosa da
seção: a busca textual é insuficiente e a spec reconhece isso.

Observação de escopo: hoje **não existe** componente de status de sessão. `ui_session_v32.js` expõe
apenas `Exportar sessão` / `Importar sessão` (`:714–715`, `:724`) e modais. As seis fixtures de
SESUX1B (`fresh` · `modified but not exported` · `export success` · `import success` ·
`post-import modification` · `export failure`) descrevem, portanto, **um componente novo** e exigem
o rastreio “modificado desde o export” — que precisa estar em UI-010A antes de existir (M-4).
Nenhum claim proibido existe hoje no source; o gate nasce verde e passa a ter função quando o
componente for criado.

### 5.8 SESUX5 — UX-derived state exclusion · **PASSA**

Verificado contra o source, é o gate mais bem alinhado da REV A. O export monta um documento literal
(`ui_session_v32.js:79–85`) cujo conteúdo é exclusivamente `captureCanonicalInputs()`; não há
caminho de escrita de estado de apresentação. O complemento adversarial (“rejeição, nunca absorção
silenciosa”) corresponde ao contrato real: chaves extras na raiz e em `inputs` produzem erro
explícito (`:214`, `:220`), derivados são recusados (`:222`) e o schema v1 declara em
`SESSION_SCHEMA_V32.md:222` que “chaves desconhecidas em raiz ou em `inputs` são **recusadas** na
v1”. Sugestão de precisão: a REV B deve citar essas linhas em vez de “o contrato de strictness do
schema vigente”, e deve cuidar para não duplicar cobertura já existente na suíte SESSION 4.8.

### 5.9 UX9 — Presentation state isolation · **FALHA (A-5)**

A filosofia está certa e é a mais importante da fase. A formulação, não:

```text
session export before == session export after
```

é **insatisfazível por construção**, porque o documento carrega timestamp:

```js
/* ui_session_v32.js:83 */ createdAt: new Date().toISOString(),
```

Dois exports consecutivos nunca são iguais, com ou sem mudança de apresentação. O gate falharia no
baseline íntegro, por motivo benigno — exatamente a classe de gate que ensina a equipe a relaxar
gates.

Oráculo correto disponível no baseline: `captureCanonicalInputs()` (`ui_session_v32.js:42`), que
retorna os cinco owners canônicos (`assessment`, `priorities`, `technologyLandscape`,
`targetProfile`, `operationalRefinement`). Comparar `JSON.stringify` disso — ou o subárvore
`inputs` do documento — é determinístico.

Advertência adicional: **não** usar `fullStateJSON()` (`ui_v32.js:638–642`) como oráculo de UX9,
apesar de já existir e já ser usado como invariante de print (`finishPrint`, `ui_v32.js:793–797`).
Ele é incompleto para este fim: cobre `arq`, `notes`, landscape, arquitetura, plataformas, sinais e
o `legacySnapshot`, mas **não** cobre `targetProfile.overrides` nem `operationalRefinement.answers`.
Uma mutação de alvo ou de refinamento causada por interação de apresentação passaria despercebida.

---

## 6 · Achados classificados

### 6.1 Blockers — impedem a abertura da fase

---

**B-1 · O contrato canônico de suficiência é booleano; SUF0/SUF3/UI-009/UI-012 não são
implementáveis como escritos.**
Evidência: `fonte:501`; payload M41 `9794b267…` inclui `suff`; `harness_m41_v313.js:26` exige
`function dataSufficiency` como marcador estrutural de extração do engine.
Impacto: o item “sufficiency lock” da Wave 1A não tem caminho conforme.
Remediação: decisão explícita do proprietário entre (i) manter o booleano e reescrever SUF0/SUF3
para “a UI renderiza o veredito booleano canônico e apresenta as **condições pendentes** lendo
acessores canônicos (`confirmedCount()`, `domStat().n`), com os limiares declarados em fonte única”;
ou (ii) abrir microfase autorizada de Camada 1 para publicar um contrato de suficiência estruturado,
com reancoragem formal do payload M41. **(i) é a recomendação desta auditoria** — preserva engine,
M41 e o invariante de que a UI não decide suficiência.

---

**B-2 · SUF0 já é violado pelo baseline congelado, e a REV A não diz se o gate é retroativo.**
Evidência: `ui_target_v32.js:32`.
Impacto: o primeiro gate novo da fase falha contra código fora da change boundary.
Remediação: SUF0 declara escopo explícito (“aplica-se a superfícies criadas ou modificadas pela Fase
5.0”) e registra a duplicação de `ui_target_v32.js` como dívida técnica conhecida, com decisão
consciente de não reabrir 4.3.1 nesta fase.

---

**B-3 · Os anti-patterns AP-02 e AP-03 já existem no runtime congelado, e a única via de correção
está bloqueada pela própria REV A.**
Evidência — UNSET convertido em zero **geométrico** em cinco pontos:

| ponto | código | superfície |
|---|---|---|
| `fonte:760` | `pt(i, R*Math.max(s.score??0,0.15)/5)` | radar de tela (Camada 1 congelada) |
| `fonte:939` | `style="width:${(s.score??0)/5*100}%"` | régua de domínio, tela (Camada 1 congelada) |
| `ui_v32.js:652` | `P(i, R*((s.score===null?0:s.score)/5))` | radar do PDF (print, 4.7) |
| `ui_target_v32.js:120` | `tgt.stats[i].score===null?0:…` | overlay de alvo, tela |
| `ui_target_v32.js:179` | `P(i,Rp*((s.score===null?0:s.score)/5))` | radar atual × alvo do PDF |

Em todos, o **rótulo** já é honesto (`n/d`) — o produto nunca escreve um número falso. O que mente é
a **geometria**: um domínio não avaliado é desenhado no centro do radar, indistinguível de maturidade
zero, e a régua de domínio fica com preenchimento 0%. É precisamente o anti-pattern que `CLAUDE.md`
descreve como falha de design documentada.
Impacto: a Fase 5.0, como escopada, **não pode corrigir a violação onde ela está** — dois dos cinco
pontos vivem na Camada 1 congelada e dois no pipeline de print que UI-045 declara BLOCKED.
Remediação: a REV B precisa decidir e declarar o escopo real de “UNSET ≠ NONE”. As opções honestas
são: (a) limitar a Fase 5.0 às superfícies novas e declarar os cinco pontos como limitação conhecida
herdada (sem afirmar que a fase entrega o invariante); (b) autorizar nominalmente `radarSVG`
(Camada 1) e a microfase Print/Render desde a abertura da fase. **Não é aceitável abrir a fase
declarando UNSET ≠ NONE como entregável enquanto os cinco pontos permanecerem intocáveis.**

---

**B-4 · Colisão de identificadores de gate e de fixture com as suítes congeladas.**
Evidência:

```text
REV A §25   UX1 … UX9      ×   tests_ux_m41.js  UX1 … UX56   (56 gates, 56/56 PASS nesta sessão)
REV A §26   F1 … F11       ×   tests_visual/fixtures.js F1 … F9
```

com significados **invertidos** nas colisões mais perigosas:

| ID | significado congelado (`tests_visual/screen.spec.js:218-219`) | significado REV A §26 |
|---|---|---|
| F5 | `F5_insufficient` — sessão insuficiente | “Fully sufficient — cobertura alta” |
| F6 | `F6_target_same` — alvo no mesmo estágio | “UNSET vs NONE lado a lado” |
| F1 | `F1_questions` — respostas preenchidas | “Blank assessment — todos UNSET” |

Impacto: fere a instrução de namespace próprio de `CLAUDE.md` e destrói a rastreabilidade da
evidência — “F5 PASS” passa a ser ambíguo entre dois universos de teste opostos.
Remediação: prefixo de fase em todos os IDs novos (p.ex. `P50-UX1`, `P50-F1`, ou `UXA1…`/`FX1…`),
com uma tabela de reserva de namespace na REV B declarando os intervalos já ocupados
(`UX1–UX56`, `F1–F9`, `V1–V12`, `P1–P11`, `S1–S97`, `T*`, `N*`, `M*`, `RCE*`, `CD*`, `FR*`).

---

**B-5 · Gate de entrada e estado declarado desatualizados. — documental, remediação trivial.**
Evidência: REV A §1 (`Phase 4.9 != FROZEN` ⇒ não começar), §0.A e §35 (`Phase 4.9 IMPLEMENTATION
COMPLETE · AWAITING INDEPENDENT AUDIT · NOT YET FROZEN`), §2 (“baseline formalmente aprovado na
ocasião”) e §29 (“a boundary final deve ser definida somente quando o baseline pós-4.9 estiver
conhecido”), contra `PHASE_5_KICKOFF.md:12` (`Phase 4.9.0-docs.2 · FROZEN WITH NON-BLOCKING
CAVEATS`) e `CLAUDE.md` (baseline da fase = core 4.8.0.7).

**Nuance registrada (e aceita por esta auditoria):** o gate de entrada está **substancialmente
satisfeito**. A Phase 4.9.0-docs.2 está hoje FROZEN WITH NON-BLOCKING CAVEATS e, por ser wrapper de
documentação com delta funcional zero, o “baseline pós-4.9” é **byte-idêntico ao core 4.8.0.7** —
o que esta auditoria confirma independentemente pelos hashes da seção 3.1. Não há, portanto,
precondição material pendente: o que falha é a **declaração de estado** nas seções §0.A/§35 e a
condicional de boundary da §29, escritas antes do freeze.
Classificação: **blocker formal de natureza documental, com remediação trivial** — permanece blocker
porque nenhuma fase pode abrir sob uma spec cujo próprio gate de entrada se autodeclara não atendido,
mas não exige trabalho de engenharia.
Remediação: atualizar §0.A/§35 para o estado real, substituir “baseline pós-4.9” por “core 4.8.0.7
(`625079c4…`), idêntico ao pós-4.9” em §2 e §29, e registrar as ressalvas não bloqueantes herdadas.

---

**B-6 · Contradição de status normativo entre a spec e o CLAUDE.md.**
Evidência: cabeçalho da REV A — `ROADMAP CANDIDATE` · `NON-NORMATIVE` · `NOT AUTHORIZED FOR
IMPLEMENTATION` · `DO NOT USE AS CURRENT PHASE SPEC`; §0.A recomenda manter o arquivo **fora** de
`specs/current/` “para que nenhuma sessão futura o confunda com especificação de fase autorizada”.
Contra `CLAUDE.md`: “Especificação normativa: `specs/PHASE_5_0_REV_A.md`”. O arquivo está,
efetivamente, em `specs/`.
Impacto: a precedência documental do projeto (spec corrente → HANDOFF → source → …) aponta para um
documento que se autodeclara inaplicável. Qualquer PASS citado contra ele é citável contra si mesmo.
Remediação: a REV B nasce com cabeçalho normativo e registro explícito de promoção; ou o CLAUDE.md
deixa de apontar a REV A como normativa enquanto ela for candidata. As duas afirmações não podem
coexistir.

### 6.2 Altos

**A-1 · UI-009A contradiz o source quanto à moeda de suficiência.** Ver 5.1. A “Nota de origem” é
factualmente incorreta e o bloco Proibido inverte a direção correta.

**A-2 · Não existe camada `aspect/capability` no modelo canônico.** O modelo é
`assessment → domínio (5) → pergunta (15, 3 por domínio)` — `fonte:275` (`DOMS`), `fonte:285` (`QS`,
campo `q.dom` como índice de domínio). Os “27 aspectos do SOC-CMM” aparecem uma única vez no
runtime, e como **texto comercial da trilha de aprofundamento** (`fonte:813`), isto é: são
explicitamente aquilo que o quickscan **não** faz. UI-001 (hierarquia
`assessment → domain → aspect/capability → question`), UI-002 (sidebar “domínio/aspecto”), UI-015
(heat map “por domínio/aspecto”) e UI-030 (drill-down `domain → aspect → questions`) pressupõem uma
camada inexistente. Criá-la é mudança metodológica — blocker imediato se tentada durante a
implementação.
Remediação: reescrever as quatro cláusulas para `domínio → pergunta`; se a camada de aspectos for
desejável, ela é contrato separado, não efeito colateral de UI.

**A-3 · São três estados canônicos de resposta, não dois; `"NA"` é ignorado pela REV A.**
Evidência: `const ans = new Array(QS.length).fill(null); /* null | 0..3 | "NA" */` (`fonte:464`);
`SCORES = [0, 1.7, 3.3, 5]` (`fonte:283`); rótulo canônico do terceiro estado — “Não sei · precisa
validar / Não pontua — entra como item de validação no resultado” (`fonte:670`); tratamento especial
no motor (`fonte:537`: respostas “Não sei” **não** alimentam Tier 2, viram “Capabilities a validar”;
`domStat.nNA`, `fonte:489`). Além disso, o enum `NONE` **não existe** no eixo de respostas: ele
pertence ao landscape tecnológico (`engine_v32.js:31` —
`presence: ["UNSET","NONE","PARTIAL","PRESENT","UNKNOWN"]`).
Impacto: UI-016, SUF6 e a fixture F6 (“Aspect A = UNSET, Aspect B = canonical NONE”) não são
construíveis como escritas — não nomeiam o eixo e omitem o estado que o produto mais precisa
distinguir visualmente (`NA` não é ausência nem desconhecimento: é pendência declarada).
Remediação: a REV B especifica um gate de **três** estados no eixo de respostas
(`null` = não avaliado · `"NA"` = não sei/validar · `0` = nível mais baixo confirmado, que pontua 0)
e, separadamente, o gate `UNSET × NONE` no eixo de presence do landscape.

**A-4 · O exemplo de âncoras verbais de UI-003 tem aridade e semântica erradas.** O exemplo mostra
cinco âncoras genéricas (`1 Não … 5 Plenamente`); o canônico são **quatro** opções por pergunta,
cada uma com título e descrição próprios e específicos daquela pergunta (`fonte:285–…`, campo
`opts:[{t,d}×4]`), mapeadas por `SCORES=[0,1.7,3.3,5]`. A REV A já exige provar o mapeamento antes
de implementar — mas o exemplo, deixado no texto, é uma armadilha que convida a criar uma escala
genérica de 5 níveis que não existe. Registre-se também que “âncoras verbais” **já estão
implementadas**: cada opção já é texto verbal rico, não um número.

**A-5 · UX9 é insatisfazível como escrito; o oráculo indicado é incompleto.** Ver 5.9.

**A-6 · A change boundary omite o pipeline de build.** `build_v32_html.py` (fontes injetadas
enumeradas nas linhas 10–19 e concatenadas em 56–58), `package.json` (scripts de suíte) e
`MANIFEST.sha256` não aparecem nem em “potencialmente autorizáveis” nem em “protegidos por default”.
Sem classificá-los, nenhum arquivo novo de UI/CSS/teste pode existir — e `CLAUDE.md` proíbe editar o
builder sem autorização.

**A-7 · GOV1 opera na granularidade errada.** Ver 5.3. Precisa ser por símbolo/seção, com um mapa
tela × print declarado na REV B.

**A-8 · O token `"n/d"` é asserido por gates congelados; UI-002/UI-014 propõem substituí-lo.**
Evidência: `tests_journey_m45.js:19,23,163` (N3 — “Posicionamento atual: n/d”) ·
`tests_session_m48.js:86,93` (S9) · `tests_target_m431.js:74,82` (T10, T11 — inclusive a string
composta “Baseline atual não validado — delta local n/d”) · `tests_ui_m332.js:102,109` (P11).
Impacto: trocar `n/d` por `—` / `Não avaliado` quebra suítes congeladas; alterar as suítes está fora
da boundary.
Remediação (é a decisão D3): manter `n/d` como token canônico e **acrescentar** — de forma aditiva e
não dependente de cor — rótulo textual (“não avaliado”), nome acessível e padrão visual distinto.
Alternativa: autorizar nominalmente a atualização dos cinco gates, o que exige justificar por que
não é enfraquecimento.

**A-9 · UI-004 (semântica de radio group) mira a Camada 1 congelada.** Hoje as opções são
`<button class="opt" data-i aria-pressed>` (`fonte:664`, `fonte:668` para o botão `NA`; o mesmo
padrão em `fonte:636` para arquétipo e `fonte:716` para prioridades). `aria-pressed` já entrega
estado selecionado programático (ACC6 parcialmente satisfeito hoje). Converter para
`radiogroup`/`radio` com roving tabindex significa reescrever markup dentro de
`quickscan_secops_soccmm_v3_1_3.html` — o artefato mais protegido do baseline.
Caminho viável dentro da boundary: decoração pós-render a partir de um arquivo de UI da Fase 5, com
precedente estabelecido (`window.__uxDecor(app)`, `ui_v32.js:823`; e o wrapper aditivo de
`renderResults`, `:820–824`). Risco a declarar: gates congelados de teclado/foco (visual V6; UX 4.1)
exercitam o comportamento atual.

### 6.3 Médios

**M-1 · UI-046A parte de premissa falsa: a política de print insuficiente já existe.** Ver 5.6.
Escolher BLOCK_PRINT é regressão; a questão real não formulada é o score por domínio sob gate
fechado.

**M-2 · UI-049 é ambíguo: existem dois escapers não equivalentes no baseline.**
`esc` (`fonte:472`) escapa apenas `&` e `<`; `escAttr`/`esc32` (`ui_v32.js:255–257`) escapa
`& " ' < >` e é declarado “seguro para texto E atributos”. “O mesmo modelo de escaping já congelado”
não identifica qual. Toda saída de texto livre nova (evidência/racional é exatamente isso) deve
nomear `escAttr`/`esc32`.

**M-3 · O STOP de UI-006 está invertido em relação ao baseline.** A cláusula supõe que o schema só
tenha nota por aspecto e que a UI queira nota por pergunta. O real é o oposto: o owner canônico já é
**por pergunta** (`notes[k]`, `fonte:465`; serializado como `inputs.assessment.notes[qid]`,
`ui_session_v32.js:45–46`; roundtrip coberto pela SESSION 4.8). Não existe nota por aspecto — nem
aspecto (A-2). A cláusula é satisfazível hoje; o STOP deve ser reescrito sobre o risco real
(criar um **segundo** owner de evidência, p.ex. por domínio ou por sessão).

**M-4 · UI-010A não enumera o estado que SESUX1B exige.** Ver 5.2 e 5.7. Acrescentar à lista:
“estado de status da sessão (modificado desde o último export; resultado da última operação de
export/import)”.

**M-5 · UI-033A conflita com o bilinguismo canônico.** Ver 5.5.

**M-6 · UI-017/UI-019/VIS9 ignoram que Current × Target já existe, congelado e gatilhado.**
`ui_target_v32.js` implementa o perfil-alvo (tela `#ux-target` `:50`; PDF `pr-target` `:188`),
coberto por TARGET 4.3.1 (30/30) e pelo gate visual V9 (“overlay verde tracejado só com override,
polígono atual inalterado”). As regras que a REV A pede também já estão implementadas: o alvo é
declarado por pergunta (`TARGET_PROFILE.overrides`, `:2`), nunca fixo em 3.0, obrigatoriamente
superior ao atual (`setTarget` recusa `v < cur`, `:18`) e revalidado quando o atual alcança o alvo
(`revalidateTargets`, `:38–48`). As cláusulas devem ser reescritas como **delta** sobre superfície
existente — inclusive UI-019, cuja violação real está listada em B-3.

**M-7 · A Definition of Done contradiz o bloqueio de print.** §31 exige `print semantics pass` como
condição de freeze; §23/§29 declaram a semântica de print BLOCKED para a Fase 5.0. A DoD é
insatisfazível como escrita — e é o tipo de contradição que, na hora do freeze, vira pressão para
relaxar o bloqueio.

**M-8 · VIS/ACC são esqueletos, por admissão da própria spec.** §31 (“Promotion Gate”) reconhece que
os gates VIS/ACC “são aceitáveis como esqueleto, porém insuficientes para promoção normativa”. Isso,
sozinho, impede a promoção da REV A a spec normativa. Ao detalhar, usar o ambiente já declarado:
Chromium 141.0.7390.37 + Playwright 1.62.1, breakpoints 1920×1080 · 1440×900 · 1366×768 · 390×844
(`VISUAL_GATES_V32.md`), e nomear ferramenta e versão em ACC1. Registrar o backlog B3 (Linux como
build canônico).

### 6.4 Baixos

**L-1 ·** §0.A recomenda `ROADMAP/candidates/QUICKSCAN_PHASE_5.0_…_REV_A.md`; o arquivo real é
`specs/PHASE_5_0_REV_A.md`. Alinhar (relacionado a B-6).

**L-2 ·** O prefixo de gate `MAP` (§25) colide nominalmente com o global `MAP` do runtime (mapa
pergunta → capability/severidade). Cosmético, mas polui busca e leitura de log.

**L-3 ·** UI-010 (tempo restante por mediana móvel) é de utilidade marginal com 15 perguntas e sem
fonte de amostra definida; “esconder se não houver amostra razoável” não é quantificado. Já está na
Wave 3; considerar retirar do escopo.

**L-4 ·** As tabs propostas em UI-028 pressupõem `Framework Mapping` (bloqueado, ver D4) e
`Heat Map` por aspecto (camada inexistente, A-2).

**L-5 ·** `docs_phase5/BASELINE_VALIDATION_WSL.md` tinha a seção “Execução consolidada final” em
branco enquanto o commit do workspace declarava o baseline VALIDATED. **Corrigido nesta entrega**:
o arquivo passa a conter dois registros independentes e rotulados — a execução consolidada do
proprietário e a revalidação desta sessão de auditoria, cada um com sua proveniência e com as
suítes não executadas declaradas.

---

## 7 · Decisões de design D1–D5

| # | decisão | status | fundamento |
|---|---|---|---|
| **D1** | modelo de interação das perguntas | **decidível** — protótipo antes da REV B | Controle atual: grupo de `<button aria-pressed>` na Camada 1 (`fonte:664–668`). A decisão real não é estética: é *decorar pós-render* (viável na boundary, precedente `__uxDecor`) **vs.** *reescrever markup congelado* (blocker). Risco a medir contra V6 e UX 4.1. |
| **D2** | abordagem de visualização dos gates | **BLOQUEADA por B-1** | Não se projeta o painel de suficiência antes de decidir a forma de saída do contrato: com booleano puro, o painel só pode dizer “insuficiente”; para dizer “faltam +1 em Processos” é preciso decidir de quem são os limiares `10`/`2`. |
| **D3** | representação visual de UNSET | **BLOQUEADA por A-8 + B-3** | Duas dependências: reconciliar o token `"n/d"` asserido por 5 gates congelados, e decidir o destino dos cinco pontos onde UNSET já é desenhado como zero — dois deles na Camada 1, dois no print bloqueado. Enquanto isso não for decidido, “UNSET ≠ NONE” não é entregável da fase. |
| **D4** | posicionamento do painel NIST CSF | **FORA DE ESCOPO — `FEATURE BLOCKED` pela própria UI-024** | Não existe dataset de mapeamento canônico em lugar algum do baseline. A única ocorrência de “NIST CSF 2.0” no runtime é o nome de uma oferta comercial na trilha Fundação (`fonte:810`). UI-024 é explícita: “Se não existir dataset canônico aprovado: FEATURE BLOCKED”. Logo D4 não é decisão de design — é microfase separada de conteúdo/metodologia (framework, versão, dataset version, direção, agregação, limitações). Retirar UI-022/023/024/025, MAP1–MAP5 e a fixture F9 do escopo 5.0. |
| **D5** | BRANDING-01 | **decidível agora, com custo de boundary declarado** | Independe do runtime como decisão, mas não como consequência: a paleta já está congelada e asserida — `PR_DOM_HEX` (`ui_v32.js:643`), custom properties `--ftnt-purple/green/teal/blue/silver` asseridos em tempo de execução pelos gates visuais V4+V5, vermelho `#DA291C` no radar do PDF (`ui_v32.js:659`) e a marca “Fortinet · Quickscan SecOps · SOC-CMM” no cabeçalho do relatório (`ui_v32.js:682`). Optar por identidade Quickscan-neutra implica alterar superfície de print e gates visuais congelados. A decisão deve registrar esse custo, não só o critério de contraste. |

---

## 8 · O que bloqueia a abertura da fase (lista fechada para a REV B)

A Fase 5.0 pode abrir quando a REV B contiver, verificavelmente:

1. **[B-1]** decisão registrada sobre o contrato de suficiência, com SUF0/SUF3/UI-009/UI-012
   reescritos contra ela. Recomendação: manter `dataSufficiency()` booleano e intocado; a UI
   renderiza o veredito canônico e apresenta condições pendentes a partir de acessores canônicos,
   com os limiares em fonte única declarada.
2. **[B-2]** escopo explícito de SUF0 (prospectivo), com a duplicação de `ui_target_v32.js:32`
   registrada como dívida conhecida e não reaberta nesta fase.
3. **[B-3]** decisão sobre os cinco pontos onde UNSET já é zero geométrico: limitar honestamente o
   escopo às superfícies novas, ou autorizar nominalmente `radarSVG` (Camada 1) e a microfase
   Print/Render desde a abertura. Sem isso, “UNSET ≠ NONE” não pode constar como entregável.
4. **[B-4]** tabela de reserva de namespace e renomeação de todos os gates e fixtures novos
   (`UX1–UX9` e `F1–F11` colidem hoje).
5. **[B-5]** atualização do estado declarado (§0.A/§35) e da condicional de boundary (§2/§29) para o
   baseline real 4.8.0.7 — documental, remediação trivial, gate materialmente já satisfeito.
6. **[B-6]** status normativo coerente entre a spec e o `CLAUDE.md`, com registro de promoção.
7. **[A-1..A-9]** correções de fato contra o source: moeda de suficiência; remoção da camada de
   aspectos; três estados de resposta com `"NA"` explícito; correção do exemplo de UI-003; oráculo de
   UX9 (`captureCanonicalInputs()`); classificação de `build_v32_html.py` / `package.json` /
   `MANIFEST.sha256`; GOV1 por símbolo com mapa tela × print; decisão sobre `"n/d"`; caminho de
   decoração pós-render para UI-004.
8. **[M-8 / §31]** detalhamento normativo dos gates VIS/ACC (viewports, browser e versão,
   ferramenta e versão, thresholds, artefato de evidência, condição de falha).
9. **[D2, D3]** decisões resolvidas — dependem de 1 e 3.
10. **[D4]** UI-022/023/024/025, MAP1–MAP5 e F9 retirados do escopo 5.0.
11. **[D1, D5]** decisões registradas no decision log, com o custo de boundary de D5 explícito.

Recomendação adicional, não bloqueante: manter a Wave 1A como está — navegação, progresso, mensagem
honesta de sessão, sidebar com semântica de desconhecido e shell responsivo/acessível são as partes
da fase que **não** dependem de nenhum dos blockers e que entregam valor real sem tocar superfície
protegida.

---

## 9 · Estado final desta auditoria

```text
objeto:                 specs/PHASE_5_0_REV_A.md · sha256 22e72917…5eb0a510
baseline:               VALIDADO (MANIFEST 74/74 · engine 9a4a2e67… · HTML 8d0932e1… · M41 9794b267…)
suítes reexecutadas:    engine 105 · UI 19/25/11/23/26 · UX 56 · Target 30 · Ref 28 · Journey 31 · Session 97
não executado aqui:     test:visual · tests_icons_m46 · npm run build
veredito:               REPROVAR REV A · ABERTURA DA FASE 5.0 BLOQUEADA
blockers abertos:       6
implementação:          NENHUMA · nenhum artefato congelado alterado
```

Esta auditoria **não declara a Fase 5.0 aberta, concluída ou congelada** — essa declaração cabe
exclusivamente ao auditor/proprietário do projeto. O agente **PARA** aqui e aguarda decisão.
