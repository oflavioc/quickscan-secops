# ERRATA FINAL DA PHASE 5.2 — PUBLICAÇÃO DO CENÁRIO-ALVO SOB GATE FECHADO

Relatório de execução da errata final estreita, aberta em 2026-08-24 sob o prompt
`PROMPT_ERRATA_FINAL_TARGET_PUBLICATION_PHASE_5_2.md`
(SHA-256 `1882a6b3534c54bec12fc830a65b78edbd6d3bfa39752faa4df77c5f5ad3acd8` · 17.340 bytes ·
512 linhas · UTF-8 sem BOM · zero CRLF), em resposta ao parecer independente
`AUDITORIA_INDEPENDENTE_REAUDITORIA_ERRATA_PHASE_5_2.md`
(SHA-256 `70904c113096d9a95617a80daf9eb7df28d27c1a0e0837f510fbffaa53b04120` · 55.571 bytes ·
886 linhas · sidecar `sha256sum -c` OK).

Documento de execução. **Não é declaração de fase concluída, congelada, liberada ou selada** — essa
declaração é do proprietário. Nenhuma auditoria do próprio trabalho foi feita aqui.

Escopo executado, e nada além dele: `ALTO-1`, `MÉDIO-2`, a proteção de proveniência de
`docs_phase5/evidence_p50/` e as correções documentais nominalmente autorizadas pelo §9 da instrução.
A Phase 5.2 **não** foi reimplementada; a candidata existente foi preservada; nenhuma refatoração
arquitetural foi feita. Os itens de dívida arquitetural do §16 do parecer continuam abertos e não
foram tocados.

---

## 1 · Identidades de entrada, recalculadas antes de qualquer edição

### 1.1 Prompt e parecer

| Artefato | SHA-256 exigido | Recalculado | Bytes | Linhas | BOM | CR | Resultado |
|---|---|---|---|---|---|---|---|
| `PROMPT_ERRATA_FINAL_TARGET_PUBLICATION_PHASE_5_2.md` | `1882a6b3…3acd8` | idem | 17.340 | 512 | ausente (`23 20 45`) | 0 | ✅ |
| `AUDITORIA_INDEPENDENTE_REAUDITORIA_ERRATA_PHASE_5_2.md` | `70904c11…b04120` | idem | 55.571 | 886 | ausente (`23 20 52`) | 0 | ✅ |
| sidecar `…REAUDITORIA_ERRATA_PHASE_5_2.md.sha256` | — | `sha256sum -c` → **OK** | 121 | — | — | — | ✅ |

Ambos foram lidos **integralmente até EOF** (512/512 e 886/886) antes de qualquer trabalho, com
atenção nominal a §8.2, §8.3, §9, §10 (`ALTO-1`, `MÉDIO-2`, `RESSALVA-3`), §12, §15, §16 e §17.

### 1.2 Preflight Git

```text
branch          : feat/phase5-5-2-desktop-workspace          confere
HEAD            : d3886812718e7ad9c5024880067133fbddf2fc4d   confere
staged          : 0                                          confere
modificados     : 58     não rastreados (-uall) : 311     total do delta : 369
tags            : 1 · v3.2-phase5.1 (PREEXISTENTE, da Phase 5.1)
upstream        : nenhum configurado para este branch
commits desta candidata : zero
```

`git status --short -uall` exato registrado em 369 linhas. **A candidata existente não foi
descartada nem revertida em nenhum momento.** Produção em `127.0.0.1:1337` não foi tocada: nenhuma
requisição foi feita a ela.

### 1.3 Identidades dos artefatos

| Artefato | SHA-256 esperado | Recalculado | Bytes | Resultado |
|---|---|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` | `dfbe2f3bdda58d00367d9a90cb6ea5ee2ea8a8639fd63618ec7773438bfac85a` | idem | 957.763 | ✅ |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | idem | 57.261 | ✅ |
| payload funcional M41 | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | idem | — | ✅ · **PASS**, exit 0 |
| `docs_phase5/MANIFEST_PHASE5_P52.sha256` | `8f850ccee8d35646f606826469e8e5965d6c370e253b07df91457d9389139a79` | idem | 47.696 | ✅ |
| `docs_phase5/PHASE_5_2_EXTERNAL_AUDIT_ERRATA_REPORT.md` | `31bca5d3dc2241f7fc8e8beb7b6be0cf802632840a4b0e5ef362d951b1956cce` | idem | 47.327 · 668 linhas | ✅ |

Manifesto de entrada: **367 entradas declaradas · `sha256sum -c` 367/367 OK · exit 0**, zero
duplicata, zero ausente, zero excedente, zero autorreferência.

### 1.4 Inventário PRE de `docs_phase5/evidence_p50/`

```text
arquivos no diretório .................... 82
modificados em relação ao HEAD ........... 44   (22 JSON + 22 PNG)
SHA-256 do inventário dos 82 ............. ed6e7bbe427f80912d56edd845cad50366489a8374ef45b26261d5d4946d197c
SHA-256 do inventário dos 44 ............. b7765491df179242f340f599ccbadedade6395412840fe0eeea918cfebba5022
```

---

## 2 · RED real, antes de qualquer edição de produção

### 2.1 `ALTO-1` — RED em jsdom (oráculo independente)

Cenário do **caso B**, montado pelos owners canônicos (`setAnswerById`, `setTarget`, editor real de
contexto tecnológico): cinco respostas confirmadas, uma por domínio; cinco alvos declarados sobre
práticas **nunca respondidas**, um por domínio.

```text
ORÁCULO current : confirmadas=5  suff=false  overall=null
ORÁCULO target  : confirmadas=10 suff=true   overall=3.0  dom=[3.4, 2.5, 3.4, 2.5, 3.4]
```

Estado observado **antes** da correção:

```text
TELA   KPI alvo : "Cenário-alvo 3.0 / 5 Definido"
TELA   tabela   : Negócio n/d → 3.4 n/d · Pessoas n/d → 2.5 n/d · Processos n/d → 3.4 n/d
                  Tecnologia n/d → 2.5 n/d · Serviços n/d → 3.4 n/d
TELA   overlay  : .ux-target-shape com 5 vértices, stroke #3CB17E
PAPEL  KPIs     : "n/d Atual · n/d"  ||  "3.0 / 5 Cenário-alvo · Definido"  ||  "5 práticas-alvo alteradas"
PAPEL  polígono : stroke #3CB17E · 5 pontos · dash "5 4"
PAPEL  nota     : "Evidência insuficiente: nenhum score por domínio é publicado nesta comparação
                   até o gate canônico abrir." — na mesma seção que publica cinco
```

**RED CONFIRMADO — 22 propriedades semânticas violadas**, exit 1. O RED falha por propriedade, não
por sintaxe, browser ausente, fixture inválida ou timeout.

### 2.2 `ALTO-1` — RED material em Chromium real e PDF A4 real

Medição por **visibilidade computada** (`getComputedStyle` + caixas), **árvore acessível**
(texto que um AT alcança, excluída a lista de práticas declaradas — conteúdo autorizado sob gate
fechado), **texto extraído do PDF** por `pdftotext -layout` e **tinta rasterizada** por `pdftoppm`
a 110 dpi, contada byte a byte no PPM P6, restrita à página que contém o bloco Atual × Alvo, em
janela estreita (±28) em torno de `#3CB17E`.

| Caso | Antes da correção |
|---|---|
| **A** insuf. × insuf. | 5 setas de comparação · overlay do alvo com 4 vértices · nota não neutra · PDF verde 0 px |
| **B** insuf. × **SUF.** | KPI de tela com score **e estágio** · 5 valores de alvo por domínio · 5 setas · overlay com 5 vértices · **score e estágio na árvore acessível** · KPI de papel com score e estágio · 5 valores no papel · polígono com 5 vértices · **18 px de tinta `#3CB17E` na página 7** · número e nome de estágio no texto do PDF · **nota contraditória** |
| **C** suf. × suf. | controle positivo — comparação completa, 147 px de tinta do alvo |
| **D** suf. sem alvo | canônico — nenhuma seção de comparação |

**RED CONFIRMADO — 19 violações materiais**, exit 1.

#### 2.2.1 Achado material adicional, da mesma classe, encontrado pela prova de tinta

A tinta verde residual do caso B levou a um segundo sítio de publicação que o parecer não cobriu.
O blob de 5×6 px em (522–526, 341–346) a 110 dpi, cor pura `#3CB17E`, é o glifo `◆` do marcador
**`CENÁRIO-ALVO`** da **régua da jornada de maturidade**, posicionado sobre o estágio **"Definido"**,
na mesma página em que a régua declara:

```text
    Posicionamento atual: n/d
    Não há evidência suficiente neste Quickscan para posicionar a operação com segurança
    em um estágio de maturidade.

               0            1           2          3◆          4              5
       Inexistente      Inicial    Gerenciado   Definido   Gerenciado    Em otimização
                                              CENÁRIO-ALVO quantitativamente
```

Uma varredura estrutural dos consumidores de `computeTargetProfile()` revelou um terceiro sítio:
a **Camada 5** (`ui_p50_results_v32.js`) pintava o marcador `alvo X.X` e o atributo
`data-p50-target` no eixo **por domínio** de "Atual × Alvo", sob gate fechado, sobre uma régua cujo
valor atual é `n/d`.

Os dois são a mesma decisão em outra superfície, e o §5.4 da instrução é explícito — "use a mesma
decisão de publicação para … nome de estágio … radar/overlay … relatório projetado … PDF" e "evite
uma condição independente por superfície". Foram corrigidos nesta errata e cobertos por mutante
próprio. Registro que **não** foram relatados pelo parecer independente.

### 2.3 `MÉDIO-2` — RED de contraste, com aritmética WCAG própria

Fixture com contexto tecnológico **declarado pelo editor real**, que é a única forma de o produto
montar os cards de apoio. Sete viewports; quatro nós `a.p52-sup-link` por viewport.

```text
nó ........ a.p52-sup-link  ("Página oficial ↗")   dentro de .v32-svc / .v32-cand
cor ....... rgb(218, 41, 28)  = #DA291C   (vermelho de MARCA, não o --red-text)
fundo ..... rgb(21, 21, 23)   = #151517   (--surface, primeiro ancestral OPACO)
tamanho ... 13,5 px · peso 400 → texto normal → exigido 4,5:1
razão ..... 3,747:1                        REPROVA (WCAG 2.2 AA · 1.4.3)
afordância. text-decoration-line = "none" → o link distingue-se APENAS pela cor
```

**RED CONFIRMADO — 28 violações** (4 nós × 7 viewports), exit 1. Reproduz o valor do parecer
(3,75:1) com aritmética independente.

---

## 3 · Causa-raiz

### 3.1 `ALTO-1`

`ui_target_v32.js` decidia a publicação de cada metade da comparação pelo gate **do próprio perfil**:

```js
const curPub = tgtPublishable(cur.stats, cur.suff),
      tgtPub = tgtPublishable(tgt.stats, tgt.suff);   //  <-- gate PRÓPRIO do vetor-alvo
```

`computeTargetProfile()` recalcula `suff` sobre o **vetor efetivo** (respostas + alvos declarados).
Como `setTarget()` aceita alvo sobre prática nunca respondida, alvos declarados **aumentam** a
contagem de confirmadas do vetor efetivo. Bastavam cinco alvos, um por domínio, para `tgt.suff`
abrir sozinho — e a metade Alvo publicava score por domínio, agregado e nome de estágio enquanto a
metade Atual publicava `n/d`. A nota da mesma seção, incondicional, negava a publicação.

A mesma decisão dividida existia em outras três superfícies: o overlay `.ux-target-shape` do radar
de tela (inerte apenas por CSS), o marcador de estágio da régua da jornada e o eixo por domínio da
Camada 5.

### 3.2 `MÉDIO-2`

A regra `A-01` da errata anterior aplicava `--red-text` a uma lista nominal de seletores que inclui
`a`. `.p52-sup-link` declarava `color: var(--red)` com especificidade `0,1,0`, que **vence** o `a`
de `0,0,1`. O único nó de texto de marca que ficou fora de `A-01` ficou fora por especificidade, não
por esquecimento — e o gate `P52-ACC3`, cujo seletor já cobria `#app a`, não o alcançava porque as
três fixtures declaram `landscape: "UNSET"` e nunca montam os cards de apoio.

---

## 4 · Regra normativa implementada

**A comparação Perfil atual × Cenário-alvo é indivisível.**

```text
comparisonPublishable = current.suff === true
```

`target.suff` **não** abre a comparação sozinho. A decisão é uma só, em todas as superfícies.

```js
function tgtComparisonPublishable(cur){ return !!cur && cur.suff === true; }
```

A função **não reimplementa** a regra de suficiência: consome `cur.suff`, produzido por
`computeTargetProfile()` sobre o vetor de respostas atuais — a mesma aritmética canônica que governa
`#pr-maturity` e a Camada 5. Nenhuma contagem, limiar ou fórmula foi duplicada.

### 4.1 Estado sob gate FECHADO — o que foi preservado e o que deixou de ser publicado

| Preservado (§5.2) | Deixou de ser publicado (§5.2) |
|---|---|
| `TARGET_PROFILE.overrides` íntegro e editável | score atual e score do alvo |
| lista de práticas-alvo declaradas, uma a uma, em tela e no papel | estágio atual e estágio do alvo |
| respostas atuais, suficiência atual, findings | valores por domínio dos dois lados |
| `computeTargetProfile()` puro e byte-idêntico | gaps, deltas, setas e sinais |
| `setTarget()` e seus contratos | polígono do alvo em tela e no papel |
| exportação canônica (só inputs) | tinta `#3CB17E` no PDF |
| | marcador de estágio do alvo na régua da jornada |
| | marcador `alvo X.X` e `data-p50-target` na Camada 5 |
| | esses valores na árvore acessível |

Mensagem neutra e honesta apresentada no lugar, em tela e no papel:

> O cenário-alvo está salvo. A comparação será apresentada quando o perfil atual tiver evidência
> suficiente. Evidência insuficiente: até o gate canônico abrir, nenhum score, estágio, valor por
> domínio ou delta é publicado nesta comparação, de nenhum dos dois lados. As práticas-alvo
> declaradas continuam listadas, uma a uma. n/d significa não avaliado, nunca zero.

A mensagem **não** apresenta o alvo como resultado, previsão ou score validado.

### 4.2 Estado sob gate ABERTO

Comportamento preservado integralmente: score atual canônico, score e estágio do alvo, valores por
domínio, gaps matematicamente corretos contra oráculo independente, polígonos atual e alvo coerentes,
tela e PDF concordantes. Contexto tecnológico continua com influência **zero** sobre score e
suficiência.

### 4.3 Nenhuma das soluções vedadas pelo §5.1 foi usada

Não se reescreveu a nota para admitir a publicação; não se manteve score ou estágio do alvo sem
score atual; não se ocultou apenas uma coluna; não se ocultou apenas os deltas; não se deixou
polígono pintado sem números; não se resolveu por CSS — a proteção do overlay de tela saiu
justamente do CSS e foi para a origem da publicação; `computeTargetProfile()` não foi alterado; e
respostas-alvo continuam **não** sendo evidência confirmada do estado atual.

---

## 5 · Correção de `MÉDIO-2`

`.p52-sup-link` passa a usar o token textual já adotado pela fase, **sem hex novo**:

| Estado | Antes | Depois |
|---|---|---|
| cor normal | `var(--red)` → `#DA291C` | `var(--red-text)` → `#F54133` |
| contraste sobre `#151517` | **3,747:1** — reprova | **4,938:1** — aprova |
| `:visited` | herdava | `var(--red-text)`, explícito |
| `:hover` | sublinhado | sublinhado com espessura 2px |
| `:focus-visible` | `outline: 2px solid var(--text)` | **inalterado** |
| afordância não-cromática | `text-decoration: none` (só cor) | `text-decoration: underline` permanente + glifo `↗` |
| `href` · `target` · `rel` | — | **intactos**; nenhum link abre automaticamente |
| papel | `#v32-print-report .p52-sup-link { color:#444 !important }` | **inalterado** (e `@media print` já devolve `--red-text` à cor de marca) |

Medição pós-correção, mesma aritmética, sete viewports, 28 nós: **4,938:1 em 100% dos nós**, exit 0.

---
## 6 · Arquivos alterados nesta errata

**Produção (módulos-fonte; o HTML é sempre reconstruído pelo builder, que não foi tocado):**

| Arquivo | Antes | Depois | O que mudou |
|---|---|---|---|
| `ui_target_v32.js` | `77b7b6991219e6d5…` | `d672da97a8c9b17d…` | `tgtComparisonPublishable()`; tela, papel e overlay do radar passam a consumir a decisão única; nota neutra e honesta; seta suprimida sob gate fechado |
| `ui_journey_v32.js` | `a30db1ce94bf06b1…` | `df0b00eb75f2ee2f…` | **uma linha** em `journeyModel()`: o marcador de estágio do cenário-alvo passa a exigir `snap.maturity.sufficient` |
| `ui_p50_results_v32.js` | `4c2965f7befdf2f9…` | `57fd78ca7084…` | **uma linha** em `p50Matrix()`: o agregado do alvo por domínio passa a exigir `released` |
| `ui_p52_workspace_v32.css` | `846616d494b9e59f…` | `01f0fca4acdd…` | `MÉDIO-2`: `.p52-sup-link` com `var(--red-text)`, sublinhado permanente, `:visited` explícito |

**Gates e fixtures:**

| Arquivo | Antes | Depois | O que mudou |
|---|---|---|---|
| `fixtures_p52.js` | `f6cb666af115d4cb…` | `8d4d45bbf129…` | fixtures `P52-F4` (gate fechado × alvo suficiente) e `P52-F5` (contexto declarado); oráculo `p52ComparisonOracle()` e `p52EffectiveVector()` |
| `tests_unset_ug.js` | `81bb577c6489cee7…` | `0b22450956b75e76…` | `UG6` ganha o **caso B** com guarda de não-vacuidade e controle positivo ampliado; `UG5` migrado com as asserções de encoding preservadas no controle positivo |
| `tests_p52_chromium.js` | `bfc215cd548ddb3f…` | `cd75b2d87e84…` | gate novo **`P52-TGT4`**; `P52-ACC3` ganha o caso `resultados-contexto`, guarda nominal de cobertura e verificação de afordância não-cromática |
| `tests_p52_mutants.js` | `68774d3fe6169c37…` | `8335b9610958…` | **dez mutantes novos** (`P52-FT1..FT7`, `P52-FC1..FC3`); `ui_journey_v32.js`, `ui_p50_results_v32.js` e `tests_p52_chromium.js` entram na lista de arquivos mutáveis |
| `tests_p50_core.js` | `f840163f115eded4…` | ver §12 | **repin documentado** de `ui_target_v32.js`, `ui_journey_v32.js` e `tests_unset_ug.js` em `PROTECTED`, com a identidade anterior transcrita e a autorização nominal citada |

**Documentação e selagem:** `docs_phase5/PHASE_5_2_FINAL_TARGET_PUBLICATION_ERRATA_REPORT.md`
(este arquivo, novo) e `docs_phase5/MANIFEST_PHASE5_P52.sha256` (regenerado por último).

**Evidência nova, em diretório próprio da Phase 5.2:**
`docs_phase5/evidence_p52/P52-TGT4-comparacao-indivisivel.json` (novo) e
`docs_phase5/evidence_p52/P52-ACC3-contraste.json` (atualizado, agora com o bloco `supLinks`).

**Superfícies NÃO tocadas nesta errata:** `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`,
`build_v32_html.py`, `ui_v32.js`, `ui_ux_v32.js`, `ui_refinement_v32.js`, `ui_session_v32.js`,
`ui_icons_v32.js`, `ui_v32.css`, `ui_ux_v32.css`, `ui_p52_workspace_v32.js`, `ui_p50_shell_v32.js`,
`ui_p50_suff_v32.js`, `ui_p50_v32.css`, `generate_icons_v32.py`, `harness_m41_v313.js`,
`v3_1_3_functional_snapshot.json`, `package.json`, `package-lock.json`, `README.md`, `USER_GUIDE.md`,
`fixtures_p50.js`, `tests_p50_chromium.js`, `tests_ui_m332.js`, `tests_p52_layout.js`.

> **Correção de trilha:** o §2.3 do relatório anterior lista `ui_journey_v32.js` entre as
> "superfícies **não** tocadas". Aquela afirmação era verdadeira para *aquela* errata e deixa de
> ser verdadeira para esta: aqui `ui_journey_v32.js` **foi** alterado, em uma linha, pelo motivo
> documentado no §3.1 e no `PROTECTED` de `tests_p50_core.js`.

Nenhum símbolo novo em escopo global. Nenhuma dependência nova. `computeTargetProfile()`,
`dataSufficiency()`, `setTarget()`, a fórmula de score, a semântica de UNSET/NA/zero, o conteúdo das
perguntas, o schema de sessão e o motor de recomendações permanecem **byte-idênticos**.

---

## 7 · Prova dos quatro quadrantes — tela, acessibilidade, papel e PDF

Medição pós-correção, Chromium real, viewport 1440×900, PDF A4 com `printBackground`, escala 100%,
margens 12 mm, sem cabeçalho/rodapé do navegador.

| | **A** insuf. × insuf. | **B** insuf. × **SUF.** | **C** suf. × suf. | **D** suf. sem alvo |
|---|---|---|---|---|
| oráculo `cur.suff` / `tgt.suff` | false / false | **false / true** | true / true | true / — |
| TELA · KPI do alvo | `Cenário-alvo n/d n/d` | `Cenário-alvo n/d n/d` | `Cenário-alvo 2.6 / 5 +0.9 Definido` | seção ausente |
| TELA · valores de alvo por domínio | 0 | **0** | 5 | — |
| TELA · valores atuais por domínio | 0 | 0 | 5 | — |
| TELA · setas de comparação | 0 | 0 | 5 | — |
| TELA · overlay do alvo | não criado | **não criado** | 5 vértices | não criado |
| A11Y · score+estágio do alvo na comparação | ausente | **ausente** | presente | — |
| CAMADA 5 · marcadores `alvo X.X` | 0 | **0** | — | — |
| JORNADA · marcador de estágio do alvo | 0 | **0** | — | — |
| PAPEL · valores de alvo por domínio | 0 | **0** | 5 | seção ausente |
| PAPEL · polígono do alvo | 0 vértices | **0 vértices** | 5 vértices | ausente |
| PDF · texto do bloco | só `n/d` | **só `n/d`** | números corretos | bloco ausente |
| PDF · tinta `#3CB17E` na página do bloco | **0 px** | **0 px** | **147 px** | 0 px |
| mensagem neutra | presente e visível | **presente e visível** | ausente (correto) | — |
| práticas-alvo declaradas preservadas | 1/1 | **5/5** | 4/4 | — |
| estado canônico antes × depois da impressão | idêntico | idêntico | idêntico | idêntico |
| erros de página | 0 | 0 | 0 | 0 |

No caso **C**, cada valor publicado e cada gap foram conferidos, célula a célula, contra o oráculo
independente `p52ComparisonOracle()`, e a tela foi comparada ao papel domínio a domínio: **zero
divergência**. O controle positivo é o que impede o gate de passar por ausência de conteúdo.

Amostragem da tinta: 1.173.368 pixels por página rasterizada a 110 dpi, contados um a um.

---

## 8 · Gates

### 8.1 Gate novo

**`P52-TGT4`** — *"Perfil atual × Cenário-alvo é indivisível: sob gate canônico fechado nenhuma
metade publica score, estágio, valor por domínio, delta, seta, polígono ou tinta — em tela,
acessibilidade, papel e PDF — e sob gate aberto a comparação volta completa e correta."*

Exercita os quatro quadrantes numa passada, mede quatro superfícies independentes, usa oráculo
independente da implementação e carrega **guarda de não-vacuidade nominal por caso**: se o cenário
declarado não for materialmente alcançado — em particular se `tgt.suff` deixar de ser `true` no caso
B —, o gate **falha**, nunca passa em silêncio. Ausência de poppler é declarada como FALHA, jamais
como silêncio.

### 8.2 Gates fortalecidos

| Gate | O que ganhou |
|---|---|
| `UG6` | o **caso B**, nominal e explícito, com guarda de não-vacuidade (`curB.suff===false && tgtB.suff===true && tgtB.overall!==null`) e asserção de que as cinco práticas-alvo continuam salvas; controle positivo ampliado para exigir setas e valores numéricos dos dois lados sob gate aberto |
| `UG5` | migrado pelo mesmo fato estrutural de `UG4`/`UG6`/`UG9`; as duas asserções de **encoding** (tracejado + `#3CB17E`) foram **preservadas** no controle positivo, e acrescentou-se a asserção de que o alvo continua salvo e de que o nome acessível do radar não anuncia cenário-alvo sob gate fechado |
| `P52-ACC3` | caso `resultados-contexto` (fixture `P52-F5`, contexto declarado pelo editor real), **guarda nominal de cobertura** que reprova se `a.p52-sup-link` não for montado, mínimo declarado de nós medidos e verificação de **afordância não-cromática** (WCAG 1.4.1); a evidência passa a registrar o bloco `supLinks` com cor, fundo e razão medida de cada nó |

Cobertura material de `P52-ACC3` após o reforço, lida da própria evidência:

```text
resultados .............. 38 nós medidos ·  0 falhas ·  0 sup-links
resultados-bloqueado .... 18 nós medidos ·  0 falhas ·  0 sup-links
pergunta ................  1 nó  medido  ·  0 falhas ·  0 sup-links
resultados-contexto ..... 38 nós medidos ·  0 falhas ·  4 sup-links  ← o ponto cego, agora coberto
```

`grep p52-sup-link` na evidência do gate: **4 ocorrências** (antes: zero).

---

## 9 · Mutantes dedicados

Dez mutantes novos, cada um restaurando o defeito por um caminho **diferente**. Todos materialmente
vivos (HTML com hash distinto do da candidata), todos detectados pelo gate **semanticamente
correspondente**, todos com o motivo específico casado por expressão regular. Detecção incidental
por manifesto, identidade de arquivo ou contagem global **não** conta.

| Mutante | O que reintroduz | Gate | Detectado por |
|---|---|---|---|
| `P52-FT1` | TELA: coluna Alvo volta a responder só a `tgt.suff` | `P52-TGT4` | `TELA: domínio N publica alvo` |
| `P52-FT2` | TELA: tabela protegida, KPI e **nome de estágio** do alvo reaparecem | `P52-TGT4` | `TELA: KPI do alvo publica score/estágio` |
| `P52-FT3` | PAPEL: texto protegido, **polígono** do alvo volta a ser pintado | `P52-TGT4` | `PAPEL: polígono do alvo com N vértices` / `PDF-TINTA` |
| `P52-FT4` | tela protegida, **PDF** volta a publicar a coluna Alvo | `P52-TGT4` | `PAPEL: domínio N publica alvo` / `PDF-TEXTO` |
| `P52-FT5` | nota neutra trocada por **alegação contraditória** | `P52-TGT4` | `PAPEL: mensagem neutra ausente` |
| `P52-FT6` | régua da jornada volta a marcar o **estágio do alvo** | `P52-TGT4` | `JORNADA: marcador de estágio do cenário-alvo na régua` |
| `P52-FT7` | Camada 5 volta a pintar `alvo X.X` por domínio | `P52-TGT4` | `CAMADA 5: N marcador(es)` |
| `P52-FC1` | `#DA291C` restaurado direto em `.p52-sup-link` | `P52-ACC3` | `p52-sup-link … 3.747:1 (exigido 4.5:1)` |
| `P52-FC2` | cor acessível **só no hover** | `P52-ACC3` | `p52-sup-link … 3.747:1 (exigido 4.5:1)` |
| `P52-FC3` | remove a declaração de contexto, tornando o gate **vacuoso** | `P52-ACC3` | `fixture não montou 'a.p52-sup-link' — gate vacuoso` |

**10/10 detectados.** Restauração byte a byte conferida em `finally` para os oito arquivos mutáveis
e para o HTML; o harness **aborta** se a restauração divergir. Acervo de evidência conferido
íntegro ao fim de cada mutante e ao fim da campanha.

---
## 10 · Regressão

Cada suíte foi executada como comando próprio, com **exit code próprio**. Nenhum timeout, nenhuma
interrupção, nenhum SKIP e nenhum browser ausente foi contado como PASS. A evidência histórica de
`docs_phase5/evidence_p50/` foi protegida por `P50_NO_EVIDENCE=1` em **todas** as execuções (§11).

### 10.1 Primeira execução — registrada com o FAIL que produziu

Evidence-first: a primeira rodada integral, feita **antes** do repin de governança, reprovou em três
gates de `tests_p50_core.js`. O FAIL é registrado, não escondido:

```text
FAIL  P50-GOV1 — nenhuma superfície protegida da §29.4 foi alterada (identidade byte-a-byte)
                 [protegidos alterados: ui_target_v32.js, ui_journey_v32.js, tests_unset_ug.js]
FAIL  P50-SUF0 — nenhum renderer é dono de lógica de suficiência [ui_target_v32.js alterado]
FAIL  P50-SUF8 — equivalência tripla sobre o MESMO estado — 1024 vetores [ui_target_v32.js
                 deixou de ser byte-idêntico]
```

Os três reprovaram **exclusivamente** pela identidade byte a byte das superfícies §29.4 — o gate de
governança fazendo exatamente o que deve fazer diante de uma edição autorizada ainda não registrada.
Nenhum deles reprovou por propriedade semântica: `P50-SUF0` continuou verde na asserção de que
`dataSufficiency()` está byte-idêntica no build, e `P50-SUF8` continuou verde na equivalência tripla
sobre os 1.024 vetores. Todas as demais 21 suítes dessa mesma rodada passaram, e a campanha de
mutação fechou **72/72**.

A resolução foi o **repin documentado** em `PROTECTED`, com a identidade anterior transcrita, a
autorização nominal citada e a descrição item a item do que mudou em cada arquivo — o mesmo
mecanismo usado em todas as rodadas autorizadas anteriores desta fase. Nenhum gate foi enfraquecido:
`P50-GOV1` continua fixando os três arquivos **byte a byte**, apenas no valor autorizado.

### 10.2 Rodada final limpa

| Suíte | Comando | Resultado observado | Exit |
|---|---|---|---|
| Build determinístico A | `python3 build_v32_html.py` | **`fb906462484ff3d3…`  — reproduz a candidata final** | 0 |
| Engine | `npm run test:engine` | **MATRIZ (M1–M40 ENGINE + M42–M86 + P2.1): 105 PASS · 0 FAIL de 105 testes** | 0 |
| UI 3.1 | `npm run test:ui31` | **UI M3.1: 19 PASS · 0 FAIL de 19** | 0 |
| UI 3.2 | `npm run test:ui32` | **UI 3.2: 25 PASS · 0 FAIL de 25** | 0 |
| UI 3.3.1 | `npm run test:ui33` | **UI 3.3.1: 11 PASS · 0 FAIL de 11** | 0 |
| UI 3.3.2 (PDF) | `npm run test:ui332` | **UI 3.3.2 (PDF): 23 PASS · 0 FAIL de 23** | 0 |
| UI 3.3.3 | `npm run test:ui333` | **UI 3.3.3: 26 PASS · 0 FAIL de 26** | 0 |
| UX 4.1 | `npm run test:ux41` | **UX 4.1: 56 PASS · 0 FAIL de 56** | 0 |
| Target 4.3.1 | `npm run test:target` | **TARGET 4.3.1: 30 PASS · 0 FAIL de 30** | 0 |
| Refinement 4.4 | `npm run test:ref` | **REF 4.4: 28 PASS · 0 FAIL de 28** | 0 |
| Journey 4.5 | `npm run test:journey` | **JOURNEY 4.5: 31 PASS · 0 FAIL de 31** | 0 |
| Icons 4.6 | `npm run test:icons46` | **ICONS 4.6: 12 PASS · 0 FAIL de 12** | 0 |
| Session 4.8 | `npm run test:session` | **SESSION 4.8: 97 PASS · 0 FAIL de 97** | 0 |
| UNSET Geometry (UG) | `npm run test:unset` | **UNSET GEOMETRY (UG): 13 PASS · 0 FAIL de 13** | 0 |
| P50 core + P51 | `npm run test:p50` | **P50 CORE + P51 (microfases 5.0.1..5.0.5 + Phase 5.1): 64 PASS · 0 FAIL de 64** | 0 |
| P50 Chromium + P51 | `npm run test:p50vis` | **P50 CHROMIUM + P51 (microfases 5.0.1..5.0.5 + Phase 5.1): 27 PASS · 0 FAIL de 27** | 0 |
| P52 layout | `npm run test:p52` | **P52 LAYOUT (Phase 5.2): 35 PASS · 0 FAIL de 35** | 0 |
| P52 Chromium | `npm run test:p52vis` | **P52 CHROMIUM (Phase 5.2): 44 PASS · 0 FAIL de 44** | 0 |
| M41 (V3.1.3) | `npm run test:m41` | **SANIDADE: OK · snapshot: /dev/null · cenários: 9** | 0 |
| Visual (Playwright) | `npm run test:visual` | **67 passed (26.1s)** | 0 |
| Mutação P52 | `npm run test:p52mut` | **MUTATION TESTING (Phase 5.2) [tests_p52_mutants.js]: 72/72 mutantes detectados pelo gate e motivo esperados** | 0 |
| Build determinístico B | `python3 build_v32_html.py` | **`fb906462484ff3d3…`  — reproduz a candidata final** | 0 |

Contagens congeladas do baseline 4.8.0.7, conferidas uma a uma: engine 105 · UI 19+25+11+23+26 ·
UX 56 · Target 30 · Ref 28 · Journey 31 · Icons 12 · Session 97/97 · M41 PASS ·
visual 67 passed / 0 failed / 37 skipped. **Nenhuma contagem congelada foi reduzida.**

Variações de contagem em relação ao parecer independente, todas para **mais** e todas nomeadas:

| Suíte | Parecer | Agora | Motivo |
|---|---|---|---|
| P52 Chromium | 43 | **44** | gate novo `P52-TGT4` |
| Mutação P52 | 62 | **72** | dez mutantes novos da errata final |
| UNSET Geometry | 13 | **13** | `UG5` e `UG6` fortalecidos, contagem preservada |

---
## 11 · Proveniência de `docs_phase5/evidence_p50/` — declaração explícita

### 11.1 O que aconteceu na errata anterior, declarado sem rodeio

**44 arquivos históricos** sob `docs_phase5/evidence_p50/` (22 JSON + 22 PNG) foram **reescritos**
durante a errata pós-auditoria externa de frontend, com mtimes de 2026-08-23 22:46–22:49.

A causa é o comportamento **gerador** da suíte: `npm run test:p50vis` grava sua evidência no próprio
diretório do acervo. A errata anterior precisou reexecutar a suíte P50 — obrigatório, porque migrou
`P50-PR1` — e a reexecução sobrescreveu o acervo. **Não foi edição manual e não foi acidente de
edição; foi efeito do desenho da suíte.**

O parecer independente reconciliou os 44 arquivo a arquivo (§RESSALVA-3): 28 são instáveis entre
execuções por natureza (PNG e relatórios axe com ruído de execução); 13 dos 16 determinísticos
**reproduzem byte a byte** na reexecução independente do auditor; os 3 restantes divergem
**apenas** por campos de ambiente e tempo (`browser.resolutionOrigin`, latências, campos `ms`).
Os vereditos internos foram preservados — `P50-ACC4-contrast.json` marca `verdict: "PASS"` antes e
depois.

**Esta errata declara a supersessão.** O §2.3 do relatório anterior
(`31bca5d3dc2241f7fc8e8beb7b6be0cf802632840a4b0e5ef362d951b1956cce`) **não lista** esses 44
arquivos e nenhuma de suas seções declara a regeneração. Aquele relatório descreve, portanto, de
forma **incompleta**, o conjunto de bytes que a candidata altera. A presente seção supre a omissão,
nomeadamente, citando o parecer `70904c11…` como fonte da constatação.

**Recuperabilidade.** Nada foi comitado. **Todos** os bytes históricos permanecem íntegros nos blobs
de `09fd0fc` e do HEAD `d3886812718e7ad9c5024880067133fbddf2fc4d`, recuperáveis por `git show`.
Nenhuma evidência foi apagada. Não se alega, em ponto algum deste relatório, que os arquivos nunca
foram regenerados.

### 11.2 O que esta errata fez para não ampliar o dano

A preferência da instrução (§8) é **preservar o estado de entrada, impedir nova escrita e documentar
a proveniência** — e foi exatamente isso:

1. `docs_phase5/evidence_p50/` **não foi regenerado** nesta rodada;
2. **toda** execução capaz de escrever ali rodou sob `P50_NO_EVIDENCE=1`, o mecanismo de supressão
   **já existente** na suíte (`tests_p50_chromium.js`, `evidenceWritable()`), inclusive na rodada
   integral final e na campanha de mutação;
3. nenhuma restauração ao HEAD foi feita — restauração ampla seria destrutiva e ampliaria o delta;
4. a evidência corrente da Phase 5.2 permanece separada por nome e diretório
   (`docs_phase5/evidence_p52/`), e é ali que a evidência nova desta errata foi escrita.

### 11.3 Inventário PRE × POST dos 82 arquivos (e dos 44)

```text
INVENTÁRIO PRE  ·  82 arquivos  ·  SHA-256 ed6e7bbe427f80912d56edd845cad50366489a8374ef45b26261d5d4946d197c
INVENTÁRIO POST ·  82 arquivos  ·  SHA-256 ed6e7bbe427f80912d56edd845cad50366489a8374ef45b26261d5d4946d197c
44 modificados  ·  PRE b7765491df179242f340f599ccbadedade6395412840fe0eeea918cfebba5022
                ·  POST b7765491df179242f340f599ccbadedade6395412840fe0eeea918cfebba5022
conferência byte a byte durante toda a rodada : 82/82 byte-idênticos · zero divergência
```

**Nenhum arquivo histórico foi sobrescrito por esta errata.**

---

## 12 · Correções documentais (§9 da instrução)

O relatório anterior — `PHASE_5_2_EXTERNAL_AUDIT_ERRATA_REPORT.md`,
`31bca5d3dc2241f7fc8e8beb7b6be0cf802632840a4b0e5ef362d951b1956cce` — **não foi editado**. Ele é o
objeto auditado pelo parecer `70904c11…` e sua identidade tem valor de trilha. As correções abaixo
o **superam nominalmente**: onde houver conflito, vale esta seção. Os valores antigos ficam
preservados, rotulados como históricos, e não são apresentados como estado corrente.

### 12.1 Contagem dos gates migrados na errata anterior

| Onde | Texto histórico | Estado corrente |
|---|---|---|
| §7.2 | "**Cinco** gates afirmavam, como requisito, o comportamento que a auditoria externa declarou defeituoso" | **Seis identificadores** de gate tiveram asserções invertidas: `P1`, `P50-PR1`, `P52-PR1(c)`, `UG4`, `UG6`, `UG9`. A tabela do próprio §7.2 já os listava em cinco **linhas**, uma delas agrupando três identificadores — a contagem citada era de linhas, não de gates. |
| §9.2 | "**Três** gates congelados afirmavam o defeito como requisito" (`P1`, `P50-PR1`, `P52-PR1(c)`) | **Correto** para aquele recorte; nenhuma correção necessária. |
| §9.3 | "**Dois** gates da UNSET Geometry mediam geometria estruturalmente impublicável" | **Erro factual.** São **três**, e o próprio corpo do parágrafo os nomeia: `UG4`, `UG6` e `UG9`. |

Totais corretos, conforme o §12 do parecer: **seis identificadores com asserção invertida** (cinco
deles em arquivos rastreados), **oito gates modificados no total** (somando `P52-HELP1` e
`P52-SUP3`, que mudaram precisão de seletor/métrica sem inversão) e **um mutante repontuado**
(`P52-M9`). Impacto material: **nenhum** — cada migração já estava documentada linha a linha no
próprio arquivo de teste, com a identidade anterior registrada.

> Esta errata acrescenta a esse histórico **duas** migrações próprias, documentadas no §8.2 acima e
> no `PROTECTED` de `tests_p50_core.js`: o fortalecimento de `UG6` (caso B) e a migração de `UG5`.

### 12.2 Contagem do acervo verificado pela campanha de mutação

| Onde | Texto histórico | Estado corrente |
|---|---|---|
| §7.3 | "o acervo de evidência (**144** arquivos) é verificado íntegro" | **264 arquivos.** É o número que a própria execução imprime: `acervo de evidência: 264 arquivo(s) byte-idênticos ao início`. A verificação é **mais ampla** do que o relatório declarava; o número no texto estava desatualizado. |

Reconferido nesta errata, na campanha completa: **265 arquivo(s) byte-idênticos ao início** — 264
mais `P52-TGT4-comparacao-indivisivel.json`, a evidência nova deste ciclo.

### 12.3 Generalização sobre a página de menor conteúdo

| Onde | Texto histórico | Estado corrente |
|---|---|---|
| §5 | "a de menor conteúdo material (p11/p12 dos cenários longos, **389 caracteres** e 1,93% de tinta) fecha o anexo de respostas" | Vale **apenas para os seis cenários declarados** naquela matriz, e **não generaliza**. Medição própria nos PDFs A–D desta errata: a menor página material tem **172 caracteres** (caso B, página 10). |
| §5 (tabela) | "Nenhuma primeira página quase vazia · menor p1 = 1.547 caracteres" | **Mantém-se** como afirmação sobre **primeiras** páginas, e é confirmada de forma independente aqui: p1 = 3.815 (casos A/B) e 3.841 (casos C/D) caracteres. |

Nenhuma página contém apenas rodapé ou cabeçalho — o critério permanece atendido, e por isso a
ressalva é de **polimento de paginação**, não de defeito. Registro que a afirmação de "menor página"
deve ser lida como **relativa ao conjunto medido**, nunca como propriedade universal do produto.

### 12.4 Declaração dos 44 arquivos de `evidence_p50`

Suprida no §11 acima, nominalmente e com citação do parecer.

### 12.5 Encerramento de `ALTO-1` e `MÉDIO-2`

Os dois são declarados encerrados **somente aqui**, e somente depois da prova verde do §7, §8, §9 e
§10. Nenhum encerramento foi declarado antes da prova.

---

## 13 · Ambiente e limitações declaradas

```text
Node v22.23.2 · npm 10.9.8 · Python 3 · jsdom 30.0.1 · @playwright/test
Chromium: /home/oflavioc/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
poppler-utils 26.01.0 (pdftotext · pdftoppm · pdfinfo)
```

Nada abaixo recebe PASS. É declarado como **não executado**:

1. **Browser nominal diferente do canônico.** `/opt/google/chrome/chrome` **não existe** nesta
   máquina; foi usado o Chromium gerenciado pelo Playwright — o mesmo motor que a evidência da
   candidata e o parecer independente registram, de modo que a comparação é homogênea. Chrome
   estável, Firefox e Safari **não** foram exercitados.
2. **Zoom real de navegador** (110% / 125% / 200%): não executado nesta errata; medido por viewport
   CSS equivalente pelas suítes reexecutadas.
3. **Leitor de tela real** (NVDA / JAWS / VoiceOver): **não executado**. A árvore acessível foi
   medida por reconstrução a partir do render, não por AT real.
4. **Diálogo nativo de impressão** com interação humana: não executável em headless.
5. **Produção em `127.0.0.1:1337`**: **não exercitada**, por decisão; nenhuma requisição foi feita.
6. **Percurso comercial completo clique a clique**: não percorrido integralmente; o editor de
   contexto tecnológico foi exercitado por interação real em todos os cenários desta errata.
7. **Auditoria independente desta errata**: **não realizada** — e não podia ser, por quem executou
   o trabalho.

---
## 14 · Integridade do núcleo congelado e determinismo de build

| Verificação | Resultado |
|---|---|
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` · **byte-idêntico ao baseline congelado** · 57.261 bytes |
| payload funcional M41 | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` · **idêntico** · comparação **PASS** · sanidade OK · 9 cenários |
| Build A × Build B | `fb906462484ff3d3…` × `fb906462484ff3d3…` · **IDÊNTICOS** |
| Build final × HTML candidato final | idêntico byte a byte |
| `dataSufficiency()` no HTML construído | byte-idêntica (asserido por `P50-SUF0`) |
| `computeTargetProfile()` | puro e byte-idêntico (asserido por `TARGET 4.3.1` e `P50-SUF8`, 1.024 vetores) |
| schema de sessão / exportação canônica | intocados · `SESSION 4.8` 97/97 |

---

## 15 · Blockers conhecidos e ressalvas

### 15.1 Blockers

**Nenhum blocker conhecido em aberto** ao fim desta errata, dentro do escopo autorizado.

### 15.2 Ressalvas remanescentes, não bloqueantes, herdadas e declaradas

1. **`setTarget()` aceita alvo sobre prática nunca respondida.** A guarda é
   `if (cur!==null && cur!=="NA" && v < cur) return false` — logo a invariante metodológica #5
   ("alvo é declarado, estritamente > current **confirmado**") não é exercida quando **não há**
   current confirmado. É anterior a esta errata e ao ciclo anterior, e **não** é regressão. Esta
   errata não a corrige: o §0 da instrução veda tocar `setTarget()` e o §5.1 veda tornar
   respostas-alvo equivalentes a evidência confirmada — o que a correção de `ALTO-1` garante é que
   um vetor majoritariamente aspiracional **não publica mais nada**. A guarda do setter continua
   sendo dívida registrada.
2. **Fontes concorrentes de decisão de suficiência** (§16.1 do parecer): `publishableStats()` em
   `ui_v32.js` é a canônica; `p50SuffContract()` reimplementa a regra com limiares literais em
   `ui_p50_suff_v32.js`, cross-checada por gate P50. Esta errata **reduziu** a concorrência ao
   eliminar `tgt.suff` como gate próprio, mas **não** completou a unificação. Dívida arquitetural
   pós-release, deliberadamente não tocada.
3. **Escrita de evidência pela própria suíte** (`RESSALVA-3`): a causa estrutural — `test:p50vis`
   grava no diretório do acervo — **permanece**. Esta errata a contorna por `P50_NO_EVIDENCE=1` e a
   declara; isolar a escrita em diretório de execução é item de backlog, fora do escopo autorizado.
4. **Polimento de paginação** (`RESSALVA-6`): páginas de cauda muito curtas continuam existindo
   (172 caracteres no melhor caso medido). Nenhuma página contém só rodapé ou cabeçalho. Item de
   polimento, não defeito.
5. **Modularização transversal, separação do HTML, conversão para `import/export`, reorganização
   de CSS e refatoração do motor de recomendações**: permanecem dívida arquitetural pós-release,
   como o §0 da instrução determina e o §16 do parecer recomenda.

### 15.3 Achados desta errata que o parecer independente não relatou

Registrados por dever de completude, ambos corrigidos e cobertos por mutante:

- a **régua da jornada de maturidade** publicava o marcador de estágio do cenário-alvo sob gate
  fechado, com tinta `#3CB17E` materialmente rasterizada no PDF (§2.2.1);
- a **Camada 5** publicava o agregado do alvo por domínio (`alvo X.X`, `data-p50-target`,
  `data-p50-gap`) sob gate fechado (§2.2.1).

Os dois são da mesma classe de `ALTO-1` e foram fechados pela mesma decisão única.

---

## 16 · Declaração de não ações

Nesta errata **não** houve, e não há neste repositório em consequência dela:

```text
commit ....... zero        push ......... zero        pull request .. zero
merge ........ zero        tag nova ..... zero        freeze ........ zero
release ...... zero        deployment ... zero        substituição de preview/produção ... zero
```

- A tag `v3.2-phase5.1` é **preexistente**, da Phase 5.1; nenhuma tag foi criada, movida ou removida.
- O branch `feat/phase5-5-2-desktop-workspace` continua **sem upstream** configurado.
- `HEAD` permanece em `d3886812718e7ad9c5024880067133fbddf2fc4d`, inalterado.
- A candidata **não** foi descartada, revertida nem recriada: o delta de entrada foi preservado e
  ampliado apenas pelos arquivos nominalmente listados no §6.
- A V3.2 Final Release, o assurance, o wrapper 4.9 e o control.4 **não** foram tocados.
- **Nenhuma fase posterior foi iniciada.**
- **Nenhuma autoauditoria foi feita.** Este relatório é de execução; o veredito de elegibilidade
  para selagem é do proprietário, mediante auditoria independente.
- Nenhum dado real de cliente, sessão real, PDF de cliente ou credencial foi criado, lido ou
  comitado. Os PDFs de prova saíram de fixtures sintéticas e vivem em `docs_phase5/evidence_p52/pdf/`
  e em diretórios temporários.

---
## 17 · Hashes finais

### 17.1 Candidata e núcleo

| Artefato | SHA-256 | Bytes |
|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` | `fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79` | 963373 |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | 57.261 |
| payload funcional M41 | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | — |
| `build_v32_html.py` | `bf98d496834c25365adff76f15689e1ba44f703c07bdb3db2eaeee0a8ade89ac` | 4.993 |

### 17.2 Arquivos alterados por esta errata

| Arquivo | SHA-256 anterior | SHA-256 final | Bytes |
|---|---|---|---|
| `ui_target_v32.js` | `77b7b6991219e6d5…` | `d672da97a8c9b17d33890eaa97dcdea3a9367a02a57c682662d32f56e4aa63f8` | 22324 |
| `ui_journey_v32.js` | `a30db1ce94bf06b1…` | `df0b00eb75f2ee2f8ae5542104bafd7f54580163e60432e7a48bb4bf8118aaf7` | 17546 |
| `ui_p50_results_v32.js` | `4c2965f7befdf2f9…` | `57fd78ca7084bfd513793e55094fef0429e58bc6012a4ba80f252b2f984a141a` | 41273 |
| `ui_p52_workspace_v32.css` | `846616d494b9e59f…` | `01f0fca4acdd65abf4e17402b2520ba12dfad162f98f7490f41955bc26c74b3c` | 91642 |
| `fixtures_p52.js` | `f6cb666af115d4cb…` | `8d4d45bbf1296c854f5b39a5499f79ab27bf3bc7a43a9cf2ad6979a7e0949f4c` | 10180 |
| `tests_unset_ug.js` | `81bb577c6489cee7…` | `0b22450956b75e760a9c9c79d7d48b6df51e7f55c5e1325876a9a4be26844d58` | 29801 |
| `tests_p52_chromium.js` | `bfc215cd548ddb3f…` | `cd75b2d87e84f14fb7ffaf4f4d6c5f8ec1f92fa24c1f6655ad4504d342c67770` | 236946 |
| `tests_p52_mutants.js` | `68774d3fe6169c37…` | `8335b96109588d53e46fb2f0a54e813bfa53e8f7c900ffa5ec90908f0aa9d528` | 45628 |
| `tests_p50_core.js` | `f840163f115eded4…` | `a017178c8e537196e8969394a97e4b083c5854b7d9ccf1da79fb02cca8b1e651` | 222318 |
| `docs_phase5/evidence_p52/P52-TGT4-comparacao-indivisivel.json` | — | `f1a64e5ab02a59fee4635cd33caff33dd0a3a33a1cf80b876ed912649be0a1e9` | 13982 |
| `docs_phase5/evidence_p52/P52-ACC3-contraste.json` | — | `f15800501b867d4ae04685b8fd4545ef57e988d15de05cab12479fa2e2e06e32` | 1402 |

### 17.3 Manifesto

| Item | Valor |
|---|---|
| arquivo | `docs_phase5/MANIFEST_PHASE5_P52.sha256` |
| entradas | **374** (entrada: 367) |
| `sha256sum -c` | **374/374 OK** · exit 0 |
| duplicatas | **zero** |
| caminhos ausentes no disco | **zero** |
| excedentes (manifesto − oráculo) | **zero** |
| autorreferência | **zero** — exclui apenas a si próprio |
| exclusão nominal declarada | `AGENTS.md` (não rastreado, preexistente, alheio a esta fase) |
| completude | oráculo independente: união de `git status --porcelain -uall` (376 caminhos, diretórios expandidos) menos manifesto = exatamente `AGENTS.md` e o próprio manifesto |

Sete entradas novas em relação às 367 de entrada: `ui_p50_results_v32.js`,
`docs_phase5/evidence_p52/P52-TGT4-comparacao-indivisivel.json`, os quatro PDFs
`docs_phase5/evidence_p52/pdf/P52-TGT4-{A,B,C,D}.pdf` e este relatório. Nenhuma entrada foi removida.

O SHA-256 do próprio manifesto **não** consta deste relatório: o manifesto é gerado por último e
sela este arquivo, de modo que citá-lo aqui seria um ponto fixo impossível. Ele é entregue no
handoff e é conferível por `sha256sum -c` sobre os bytes finais.

### 17.4 Identidade deste relatório

Um arquivo não pode conter o próprio SHA-256. Os demais atributos são declarados aqui e o resumo
final é entregue no handoff e selado pelo manifesto, que é gerado **por último** e exclui apenas a
si próprio.

```text
arquivo  : docs_phase5/PHASE_5_2_FINAL_TARGET_PUBLICATION_ERRATA_REPORT.md
Encoding : UTF-8
BOM      : ausente
Bytes CR : 0
```

---

## 18 · Estado ao final

```text
HEAD          : d3886812718e7ad9c5024880067133fbddf2fc4d   (inalterado)
branch        : feat/phase5-5-2-desktop-workspace          (inalterado)
staged        : 0
delta -uall   : 376  (entrada: 369)
tags          : 1 · v3.2-phase5.1 (preexistente)
upstream      : nenhum
```

`ALTO-1` e `MÉDIO-2` estão fechados e provados. `RESSALVA-3` está declarada. `RESSALVA-4`,
`RESSALVA-5` e `BAIXA-6` estão corrigidas documentalmente no §12.

**Esta errata PARA aqui.** Não foi declarada fase concluída, congelada, liberada ou selada — essa
declaração é do proprietário, mediante auditoria independente que esta sessão não fez e não pode
fazer.

FIM DO RELATÓRIO.
