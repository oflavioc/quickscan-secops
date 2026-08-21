# AUDITORIA INDEPENDENTE ORIENTADA A RISCO — MICROFASE 5.0.4

**Target & Heat Map Visualizations** · Quickscan SecOps SOC-CMM V3.2 · Fase 5.0

- **Auditor:** sessão independente, sem participação na implementação nem nas correções da candidata.
- **Data:** 2026-08-21
- **Documento normativo desta auditoria:** `AUDITORIA_INDEPENDENTE_RISCO_MICROFASE_5_0_4.md`
  · SHA-256 `5d1dad7862ffb8078de339c65967a50942f0111d89424dae19ffb39ceb611147`
  · 8.225 bytes · 172 linhas · UTF-8 sem BOM · zero CRLF — **identidade conferida e idêntica**.

---

## VEREDITO

> ## `PASS COM RESSALVAS NÃO BLOQUEANTES`

Nenhum dos nove riscos bloqueantes da §0 foi materializado. A funcionalidade pode ser integrada com
segurança operacional para uso local do proprietário. As sete ressalvas da §8 são legibilidade,
texto de diagnóstico, ambiente de reprodução e propriedades herdadas de camada congelada — nenhuma
altera cálculo, estado canônico ou veredito, e nenhuma foi convertida em blocker.

---

## 1 · Preflight — CONFERE

| item | esperado | observado | status |
|---|---|---|---|
| branch | `feat/phase5-5-0-4` | `feat/phase5-5-0-4` | OK |
| HEAD/base | `ae03c04f…` | `ae03c04fd6eee124777ec8d57f29cd8cb8f2a04a` | OK |
| commits sobre `main` | 0 | 0 (`merge-base` == `HEAD`) | OK |
| staged | 0 | 0 | OK |
| delta | 16 caminhos | 16 (8 M + 8 `??`) | OK |
| HTML | `d7c53209…` | `d7c532097ac00548212085579c434e4dab69d14b7ed51ad86ab68377fd6cdb8c` (685.519 bytes) | OK |
| engine | `9a4a2e67…` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | OK |
| payload M41 | `9794b267…` | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | OK |
| `tests_unset_ug.js` | `af129900…` | `af129900d1c5e2b8f02a9582f4fc8ab26fecc617cc595c9f2a7508000cabcb91` | OK |
| `tests_p50_core.js` | `4a6b526d…` | `4a6b526d873e485249eaf02a25b06029c4d289ce55a12afc8e05fa763426b324` | OK |
| relatório 5.0.4 | `8bc9db6d…` | `8bc9db6dcf9d026e081d24cc6a89ec7bdc9e7fcaaa8147e9efa97cae933e3e37` | OK |
| manifesto | `1a140042…` | `1a140042cf07ab35e156a0557f20e45fea372afa9c34025c24cf9971059059d3` | OK |
| manifesto | 61/61 | **61/61** por enumeração independente | OK |

Zero divergência material de bytes ou branch. Node `v22.23.2` (satisfaz `^22.22.2`).

### 1.1 Inventário pre/post da árvore original

```text
arquivos inventariados (exclui .git, node_modules, test-results, playwright-report):  259
SHA-256 do inventário PRE :  1d7d6582f3fc213ba91c24b71a75fb63c5fcefe4decb39b29dcb0e67a9f49944
SHA-256 do inventário POST:  1d7d6582f3fc213ba91c24b71a75fb63c5fcefe4decb39b29dcb0e67a9f49944
git status --porcelain PRE/POST: 16 / 16 caminhos · HEAD inalterado
```

**A árvore original foi preservada byte a byte.** Toda execução, mutação e escrita ocorreu em cópia
temporária (`…/scratchpad/work`) e em cópias derivadas dos mutantes.

---

## 2 · Auditoria funcional prioritária (§3)

### 2.1 Estados de resposta — PASS

Runtime real (jsdom sobre o HTML da candidata), oráculo próprio, sem reutilizar asserções do
implementador. Vetor com os três estados no mesmo domínio (`0`, `"NA"`, `null`):

| `ans[k]` | `data-p50-ans` | rótulo visível | nome acessível | `data-p50-score` | fill | cue |
|---|---|---|---|---|---|---|
| `null` | `unset` | `n/d` | `Não avaliado` | ausente | `none` | `tracejado` |
| `"NA"` | `na` | `Não sei` | `Não sei · precisa validar` | ausente | `none` | `italico` |
| `0` | `confirmed` | `0.0` | `confirmado · 0.0 de 5` | `0.0` | `level` | `solido` |

- **`0` não é confundido com ausência**: `data-p50-level="0"` e `data-p50-score="0.0"` são emitidos
  (não há bug de falsy), o fill existe (`::before` com `opacity .10`, cor do domínio) e o nível 0
  participa do cálculo — domínio com uma única confirmada de nível 0 rende `0.0`, conferido contra
  oráculo próprio.
- **Concordância célula a célula** entre heat map, tabela acessível e drill-down: **15/15 AGREE**
  em `data-k`, `data-qid`, `data-p50-ans`, `data-p50-score`, `data-p50-target`, `data-p50-gap`,
  `data-p50-domain-sufficient`. Repetido em Chromium real a 1440 px e 390 px: `ok: true, n: 15`.
- Nenhuma concatenação textual ou seletor confunde `0.0` com estado ausente: a distinção é
  estrutural (atributos de dado) **e** textual (`"0.0"` vs `"n/d"`), não cromática.

Cues em Chromium real: `unset` → borda `dashed` + hachura; `na` → borda `dotted` + itálico;
`confirmed` → borda `solid` + preenchimento. Confirmado também na evidência
`P50-5.0.4-heatmap-F6-390.png` (Mandato `n/d` tracejado · Governança `Não sei` itálico ·
Políticas `0.0` sólido preenchido).

### 2.2 Suficiência e honestidade — PASS

- **Nenhum owner paralelo.** Lint sobre `ui_p50_results_v32.js`: zero ocorrências de limiar novo
  (`>= 10`, `>= 2`, `confirmedCount`, `dataSufficiency`, `P50_SUFF_REQUIRED`) e zero redefinição de
  `SCORES` / `DOMS` / `QS` / `ans` / `notes` / `TARGET_PROFILE`. O estado global e por domínio vem
  de `window.__P50SUFF.contract()` (UI-012A) e o score de `domStat(i).score`.
- **Domínio insuficiente não promove score parcial a veredito.** Sob gate fechado: resumo
  `["n/d","n/d","n/d","n/d","n/d"]`, zero executive cards, `ct-current-value` = `n/d`, zero
  `ct-gap`, `ct-blocked` presente. O eixo POR PERGUNTA permanece honesto — é diagnóstico, e o
  drill-down o declara literalmente como *"diagnóstico parcial, não veredito de maturidade"*.
- **Rebloqueio e reabertura íntegros** (nenhum valor obsoleto sobrevive):

```text
ABERTO  : resumo 3.3×5 · cards 2 · ctGap ["+0.9"] · ctBlocked false · drill "· 3.3"
REBLOQ. : resumo n/d×5 · cards 0 · ctGap []      · ctBlocked true  · drill "· n/d"
REABERTO: resumo 3.3×5 · cards 2 · ctGap ["+0.9"] · ctBlocked false · drill "· 3.3"
```

- Regressão 5.0.3 (`B-503-COHERENCE`) intacta: sob gate fechado as 5 linhas legadas recebem
  `data-p50-legacy="neutralized"` e `value`/`conf`/`fill` recebem `.p50-legacy-gone`
  (`display:none !important`); com gate aberto os atributos e classes são removidos.

### 2.3 Current × Target — PASS

- **Alvo só com override canônico.** Sem `TARGET_PROFILE.overrides`: `data-p50-has-target="false"`
  em todos os domínios, nenhum marcador, nenhum gap, e a superfície declara
  *"Nenhum cenário-alvo foi declarado nesta sessão."* Com override em 2 perguntas do dom0 e 1 do
  dom4: **somente** esses dois domínios recebem alvo; os outros três permanecem `has-target=false`.
  Nenhum alvo é fabricado, inferido ou fixo.
- **Fidelidade ao canônico verificada contra a camada congelada 4.3.1.** A superfície congelada
  `#ux-target` publica `Negócio 3.3→3.9 +0.6` e `Serviços 3.3→4.2 +0.9`; a 5.0.4 publica
  `data-p50-target="3.9" data-p50-gap="0.6"` e `"4.2"/"0.9"`. **Coincidência exata** — a 5.0.4 lê
  `computeTargetProfile(tgtEffectiveVector()).stats`, não reimplementa matemática.
- **O valor atual não é alterado pelo target.** `data-p50-current` e o eixo de domínio congelado
  permanecem `3.3` antes e depois de declarar alvo; `captureCanonicalInputs()` idêntico.
- **Nenhum agregado ou delta enganoso sob gate fechado**: `ct-gap` ausente, `ct-blocked` presente,
  e quando existe alvo sem base atual a linha declara *"sem base atual para comparar"*.
- **Distinção não cromática**: current = barra sólida na cor do domínio; alvo = marcador com
  `border-left: 2px dashed` **e** rótulo textual `"alvo X.X"`; gap em texto com sinal.

### 2.4 Navegação e estado — PASS

Cliques nas quatro tabs + `ArrowRight`/`ArrowLeft`/`Home`/`End`, com sessão contendo respostas,
nota, alvo e refinement declarados. Oráculo: hashes de `captureCanonicalInputs()`,
`snapshotCanonicalOwners()`, `buildSessionDocument()`, `TARGET_PROFILE.overrides`,
`V32.TECH_LANDSCAPE`, `getOperationalRefinementSnapshot()` e `_stateJSON()`.

```text
MUTAÇÃO DE ESTADO CANÔNICO APÓS NAVEGAÇÃO: NENHUMA
```

O único campo que variou entre duas chamadas foi `buildSessionDocument().createdAt` — carimbo de
tempo do exportador congelado, aposto na chamada, **não** efeito da navegação (`captureCanonicalInputs`
e `snapshotCanonicalOwners` byte-idênticos; duas chamadas consecutivas sem navegação exibem o mesmo
comportamento). O estado de tab vive em variável de módulo, não entra em owner algum e não é
serializado.

**Determinismo:** re-render triplo → DOM idêntico; duas instâncias independentes com as mesmas
entradas → idêntico; **ordem de aplicação das entradas permutada → idêntico**.

### 2.5 Acessibilidade e layout — PASS (com ressalva R1)

Chromium real (151.0.7922.34), 1440 px e 390 px, verificação própria:

| verificação | 1440 px | 390 px |
|---|---|---|
| teclado (`→ → → End Home ←`) percorre e seleciona | OK | OK |
| foco visível no tab selecionado (`outline 3px`) | OK | OK |
| tabela acessível ≡ heat map (7 campos × 15 células) | OK | OK |
| drill-down somente leitura (0 inputs/textarea/select/contenteditable) | OK | OK |
| `n/d` × `Não sei` × `0.0` distinguíveis sem depender de cor | OK | OK |
| overflow horizontal do documento | 0 px | 0 px |
| nós de `#p50-results` fora da viewport | 0 | 0 fora de contêiner rolável |
| `pageErrors` / `console.error` | 0 / 0 | 0 / 0 |
| requisições externas automáticas | 0 | 0 |

Único elemento que excede 390 px é a tabela acessível, **contida em `.p50-alt { overflow-x:auto }`**:
`scrollWidth 517 / clientWidth 321`, rolagem atinge `scrollLeft 196` e as 7 colunas tornam-se
alcançáveis (última coluna `Suficiência` termina em 355 px < 390 px). **Não há clipping nem
conteúdo inacessível** — padrão responsivo legítimo, não impede uso.

---

## 3 · Auditoria estreita da exceção `UG8` (§4) — PASS

### 3.1 Escopo do diff

`git diff tests_unset_ug.js` produz **uma única hunk** (`@@ -138,35 +138,58 @@`), integralmente
dentro do bloco `UG8`. `UG1`–`UG7` e `UG9`–`UG13` permanecem semanticamente intactos; a contagem
segue 13; nenhuma asserção foi removida.

### 3.2 Provas com oráculo próprio

**(1) Sessão suficiente com a 3ª pergunta `null` em cada domínio** — verificado independentemente:

```text
suficiente (oráculo próprio)                     true
eixo POR PERGUNTA: 15 células, 5 com "n/d"       todas com data-p50-ans="unset"  (legítimo)
eixo de domínio congelado                        ["3.3 — Defined" × 5]  → 5/5 começam com 3.3
vértices do radar                                5
"n/d" no eixo de domínio                         false
"n/d" no radar                                   false
"n/d" em #app INTEIRO                            true  ← origem exata da colisão normativa
UG8                                              PASS
```

A errata é **legítima e não é um contorno**: o `"n/d"` que passou a existir em `#app` provém
exclusivamente do eixo por pergunta da Camada 5 (`data-p50="hm-state"`), onde UI-016a/§12.2 exigem
literalmente `n/d`. A coleta passou a ser nominal sobre a superfície congelada, e **ganhou força**:
a expressão antiga verificava uma ocorrência solta de `"3.3"`; a nova exige cardinalidade 5, radar
presente, polígono presente e os **cinco** valores iguais ao score esperado.

**(2)–(4) Mutantes adversariais** (construídos por mim, em cópias temporárias isoladas, por hook
pós-render injetado no HTML — a árvore original não foi tocada):

| mutante | efeito | resultado |
|---|---|---|
| `ND` — injeta `"n/d"` numa linha de domínio **suficiente** | contamina o eixo congelado | **UG8 FAIL** — `'n/d' no eixo congelado de domínio, linha 2` |
| `DROPROW` — remove uma linha de domínio | cardinalidade 4 | **UG8 FAIL** — `eixo de domínio com 4 linhas (esperadas 5)` |
| `DROPRADAR` — remove `#app svg.radar` | superfície ausente | **UG8 FAIL** — `radar congelado #app svg.radar ausente` |
| `ZERO` — troca um domínio por `"0.0 — Non-existent"` (diluição por zero) | score fabricado | **UG8 FAIL** — `domínio 1 exibe '0.0 — Non-existent' e não o score esperado 3.3` |

O mutante `ZERO` é acréscimo meu, além dos exigidos: prova que `UG8` continua guardando a
propriedade material da microfase UNSET (nenhum score diluído por zero), e não apenas a ausência do
literal.

**(5) Domínio realmente UNSET** — mutante `NDGONE` apaga o rótulo `n/d` em tela, régua e PDF quando
um domínio inteiro está UNSET: **`UG9` FAIL**, `UG8` PASS. `UG9` permanece a regressão canônica de
`n/d` e **não** foi absorvido nem enfraquecido pela errata. Os dois eixos estão corretamente
separados.

**Conclusão:** `UG8` não está enfraquecido, não é vacuoso e detecta `n/d` indevido no eixo de
domínio. Suíte sem mutação: **UG 13/13, `UG13` real em Chromium (não SKIP)**.

### 3.3 Reancoramento de `P50-GOV1` — PASS

```text
hash anterior registrado no comentário   d2a3f804bb14e9156978407710a7a680f8dc4b71929546c28a719fbde1bae2e9
hash de tests_unset_ug.js em HEAD        d2a3f804bb14e9156978407710a7a680f8dc4b71929546c28a719fbde1bae2e9   COINCIDE
novo hash fixado                         af129900d1c5e2b8f02a9582f4fc8ab26fecc617cc595c9f2a7508000cabcb91   == arquivo atual
entradas em PROTECTED                    16 antes · 16 depois (uma única entrada atualizada)
```

**Não vacuidade verificada:** acrescentei uma linha de comentário a `tests_unset_ug.js` numa cópia
temporária → `P50-GOV1 FAIL — protegidos alterados: tests_unset_ug.js`. O gate continua reprovando
qualquer mutação posterior. `tests_p50_mutants.js` byte-idêntico ao HEAD (`28f2e876…`).

---

## 4 · Boundary e runtime congelado — PASS

- **Build determinístico:** `python3 build_v32_html.py` duas vezes na cópia temporária →
  `A == B == candidato == d7c532097ac00548212085579c434e4dab69d14b7ed51ad86ab68377fd6cdb8c`.
  Esta é a prova decisiva de que o HTML é **injeção pura** dos módulos autorizados.
- O diff do HTML remove exatamente **6 linhas**, e as 6 correspondem, uma a uma, às remoções de
  `ui_p50_results_v32.js`. Nenhuma superfície congelada foi tocada.
- `ui_p50_v32.css`: **zero linhas removidas** (240 adicionadas).
- `engine_v32.js` byte-idêntico ao baseline; M41 PASS com payload exato.
- `P50-GOV1` PASS (16 superfícies protegidas) · `P50-GOV2` PASS.
- Nenhum símbolo de framework mapping, NIST/CIS ou print introduzido nos módulos novos (lint de
  fronteira ativo e reposicionado para a fronteira 5.0.5/§15).

---

## 5 · Regressão proporcional (§5) — todas executadas de fato

| suíte | esperado | **observado** | status |
|---|---|---|---|
| build determinístico | A == B == candidato | idênticos | **PASS** |
| P50 CORE | 33/33 | **33 PASS · 0 FAIL de 33** | **PASS** |
| P50 Chromium | 9/9 real, sem SKIP | **9 PASS · 0 FAIL de 9**, zero SKIP | **PASS** |
| UG | 13/13, UG13 real | **13 PASS · 0 FAIL de 13**, UG13 PASS real | **PASS** |
| Engine (M1–M40, M42–M86, P2.1) | 105 | **105 PASS · 0 FAIL** | **PASS** |
| UI M3.1 | 19 | **19 PASS · 0 FAIL** | **PASS** |
| UI 3.2 | 25 | **25 PASS · 0 FAIL** | **PASS** |
| UI 3.3.1 | 11 | **11 PASS · 0 FAIL** | **PASS** |
| UI 3.3.2 (print/PDF) | 23 | **23 PASS · 0 FAIL** | **PASS** |
| UI 3.3.3 | 26 | **26 PASS · 0 FAIL** | **PASS** |
| UX 4.1 | 56 | **56 PASS · 0 FAIL** | **PASS** |
| Target 4.3.1 | 30 | **30 PASS · 0 FAIL** | **PASS** |
| Ref 4.4 | 28 | **28 PASS · 0 FAIL** | **PASS** |
| Journey 4.5 | 31 | **31 PASS · 0 FAIL** | **PASS** |
| Icons 4.6 | 12 | **12 PASS · 0 FAIL** | **PASS** |
| Session 4.8 | 97/97 | **97 PASS · 0 FAIL de 97** | **PASS** |
| M41 | PASS, payload esperado | **PASS** · `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | **PASS** |
| visual | 67 passed / 0 failed / 37 skipped | **67 passed · 0 failed · 37 skipped** | **PASS** |
| manifesto (enumeração independente) | 61/61 | **61/61** | **PASS** |

Optei por executar **também** todas as suítes congeladas individualmente, embora a §5 dispensasse.
Nenhum PASS é reivindicado para comando não executado.

### 5.1 Verificação independente do manifesto

Oráculo próprio, sem reutilizar o do implementador:

```text
61 entradas · 61 hashes conferem contra a árvore · 0 ausentes · 0 divergentes
0 duplicatas · 0 autorreferência (o manifesto exclui a si próprio, corretamente)
delta git = 16 caminhos; 15 constam no manifesto; o 16º é o próprio manifesto
demais 46 entradas = artefatos 5.0.1/5.0.2/5.0.3 já comitados, declarados no cabeçalho
```

O desvio de cardinalidade declarado no relatório (`60 → 61`, acréscimo de `tests_unset_ug.js`) é
**correto**: a suíte nunca constou do manifesto porque era protegida e fora do delta; ao entrar no
delta pela exceção nominal, passou a exigir cobertura. Confirmei que `tests_unset_ug.js` tem 0
ocorrências no manifesto do HEAD.

### 5.2 Acervo de evidência

Nenhuma evidência histórica foi regravada: o delta acrescenta apenas artefatos `P50-5.0.4-*` e o
inventário PRE/POST da árvore é idêntico. As 6 PNGs são válidas (assinatura PNG e dimensões
íntegras, 1440 px e 390 px) e `P50-5.0.4-visual-surface.json` declara `pageErrors: []` e
`verdict: PASS` — coerente com a minha execução independente, inclusive na versão de browser
observada (`151.0.7922.34`). **Evidência não contaminada por mutação.**

---

## 6 · Coerência documental (§6) — PASS

- `B-504-UNSET-LABEL` — **FECHADO** pela ERRATA AUTORIZADA UG8 (§20 do relatório), por decisão
  explícita do proprietário (Opção 1). Nenhum blocker aberto.
- **UG 13/13** declarado e confirmado por execução real.
- Exceção **test-only** em `UG8` declarada, nominal e delimitada; consequência em `P50-GOV1`
  documentada com o hash anterior registrado.
- Demais protegidos intactos (`P50-GOV1` PASS; `tests_p50_mutants.js` byte-idêntico).
- Candidata **não comitada e não aprovada**: worktree limpo em relação a `HEAD`, 0 commits sobre
  `main`, 0 staged, nenhuma tag.
- Afirmações pré-errata (`ESTADO: BLOQUEADA`, `UG 12/13`) permanecem no §13, **claramente marcadas
  como registro histórico superado** pelo §20. Conforme a §6 da norma desta auditoria, isso não é
  motivo de reprovação.

---

## 7 · Riscos bloqueantes da §0 — resultado

| # | risco | resultado |
|---|---|---|
| 1 | cálculo incorreto de score/suficiência/estado/target/gap | **NÃO OCORRE** — conferido contra oráculo próprio e contra a camada congelada |
| 2 | fabricação de score para `null`, `NA` ou domínio insuficiente | **NÃO OCORRE** |
| 3 | contaminação ou mutação do estado canônico | **NÃO OCORRE** |
| 4 | alteração de runtime congelado fora da boundary | **NÃO OCORRE** — build determinístico A==B==candidato |
| 5 | relatório/print incorreto ou regressão funcional | **NÃO OCORRE** — print 23/23, P50-PR1 PASS, M41 exato |
| 6 | falha de navegação, acessibilidade essencial ou layout | **NÃO OCORRE** |
| 7 | inconsistência determinística com as mesmas entradas | **NÃO OCORRE** |
| 8 | evidência corrente contaminada por mutação | **NÃO OCORRE** |
| 9 | `UG8` enfraquecido, vacuoso ou incapaz de detectar `n/d` indevido | **NÃO OCORRE** — 4 mutantes mortos com diagnóstico exato |

---

## 8 · Ressalvas não bloqueantes

**R1 · Barra de `0.0` confirmado é graficamente igual a `n/d` no Atual × Alvo.**
Em `p50CurrentTarget`, um `current = 0.0` gera `data-p50-plotted="true"` com `--p50-ct-w: 0.00%`;
uma linha sem base atual gera `plotted="false"` com `width: 0`. Ambas resultam em barra de largura
zero. A desambiguação existe e **não é cromática** — o texto adjacente é `"0.0"` (peso 700, via
`.p50-ct-row[data-p50-current] .p50-ct-value`) contra `"n/d"` (peso normal) —, e a §12.2 (c)
dispensa componentes não-radar de copiar eixo/marcador/nota. Não é violação de invariante nem
fabricação de score. **Sugestão de hardening futuro:** marcador explícito de zero na trilha (por
exemplo um tique na origem para `plotted="true" && current == 0`), tornando a distinção visível sem
recorrer ao rótulo.

**R2 · Redação `"3 de 2 respostas confirmadas"` no drill-down.**
`dm.confirmed` é a contagem real (até 3) e `dm.required` é o limiar canônico (2), então um domínio
completo exibe `"3 de 2 respostas confirmadas · evidência suficiente"`. Aritmeticamente honesto,
mas lê-se mal. Editorial.

**R3 · Mensagem de diagnóstico desatualizada no lint de fronteira.**
`tests_p50_core.js` lança `"… antecipa símbolo da 5.0.4: …"` enquanto a lista `forbidden` já guarda
a fronteira 5.0.5 e a área permanentemente fora de escopo (§15/§23). O gate está correto e ativo;
apenas o texto do erro ficou preso à microfase anterior.

**R4 · `aria-label` redundante no eixo de presence para `UNSET`.**
`"… : Não informado · não informado · não avaliado, nunca ausência"` repete o rótulo. Não prejudica
a distinção exigida por UI-016 (b) — DOM semantics, rótulo visível e nome acessível diferem
comprovadamente entre `UNSET` e `NONE`. Editorial.

**R5 · Desvio nominal de versão de browser.**
Evidência gerada com Chromium `151.0.7922.34` contra o nominal `141.0.7390.37` da spec, com
`nominalDeviationAccepted: true` declarado no próprio artefato. A §0 classifica versões nominais de
browser como ressalva não bloqueante. Minha execução independente usou a mesma versão e reproduziu
os mesmos resultados.

**R6 · `P50-PR1` exige base de objetos git alcançável a partir do diretório de execução.**
O gate faz `git show <commit>:<arquivo>` com `cwd = __dirname`. Executado numa cópia sem repositório
git, ele **falha com diagnóstico explícito** (`baseline de entrada indisponível…`) em vez de
declarar SKIP silencioso — comportamento correto e honesto, mas que torna a suíte não portátil para
cópias temporárias sem `.git`. Reproduzi o PASS anexando um clone bare local à cópia. Nota de
reprodutibilidade, não defeito.

**R7 · Comparação por prefixo em `UG8`.**
`v.indexOf(expected.toFixed(1)) !== 0` aceitaria um valor como `"3.35"`. O risco é nulo na prática
porque a mesma asserção exige `sc.every(s => s === expected)` a partir do oráculo independente do
próprio harness, que fixa o score exato. Sugestão cosmética de endurecimento futuro.

### 8.1 Observação sobre camada congelada (fora da boundary da 5.0.4)

`setTarget()` aceita alvo em pergunta **não respondida** (a guarda `v < cur` só se aplica quando há
resposta confirmada). O alvo de domínio passa então a ser calculado sobre um conjunto de perguntas
maior que o do atual — no meu cenário, dom0 atual `3.3` (2 perguntas) contra alvo `3.9` (3
perguntas), gap `+0.6`. **Isto é comportamento da camada congelada 4.3.1**: verifiquei que a
superfície congelada `#ux-target` publica exatamente os mesmos `3.3→3.9 +0.6`, e a camada congelada
já rotula o caso como *"Baseline atual não validado — delta local n/d"*. A 5.0.4 reproduz o
canônico com fidelidade e a célula correspondente mostra `alvo 1.7` com atual `n/d` e gap `n/d`.
Registro apenas como observação para o proprietário; **não é achado da 5.0.4** e corrigi-lo estaria
fora da change boundary autorizada.

---

## 9 · Método e superfície de execução

- Sessão independente; nenhum envolvimento na implementação ou nas correções.
- Todas as execuções, mutações e escritas em cópia temporária; árvore original conferida byte a byte
  antes e depois.
- Oráculos próprios, escritos por mim, sem importar `tests_p50_*.js` nem `fixtures_p50.js`:
  score/suficiência por domínio recalculados a partir do vetor de respostas; concordância entre as
  três superfícies verificada campo a campo; mutantes construídos por hook pós-render.
- Sondas executadas: estados de resposta · gate aberto/fechado · alvo canônico × superfície
  congelada · navegação e mutação de owners · determinismo (re-render, entre instâncias, com ordem
  permutada) · neutralização legada · cobertura de presence e `UNSET × NONE` · oráculo de `UG8` ·
  5 mutantes adversariais · não vacuidade de `P50-GOV1` · Chromium real 1440/390 (teclado, foco,
  concordância, cues, overflow, `pageErrors`, requisições externas) · rolagem da tabela acessível.

---

## 10 · Entregável

```text
arquivo    AUDITORIA_INDEPENDENTE_MICROFASE_5_0_4.md
local      fora do repositório (não importado no clone)
encoding   UTF-8 sem BOM · zero CRLF
```

Identidade (SHA-256, bytes, linhas) registrada no bloco final desta entrega.

---

## 11 · Atos NÃO realizados

Nenhum commit · nenhum push · nenhum PR · nenhum merge · nenhuma tag · nenhum freeze · nenhuma
release · nenhum deployment · **microfase 5.0.5 não iniciada** · nenhuma correção implementada ·
nenhum byte da candidata alterado · nenhum arquivo criado dentro do clone · nenhum parecer importado
para o repositório · nenhuma evidência regravada · nenhum dado de cliente tocado.

Declarar a microfase encerrada, congelada ou aprovada é ato do proprietário.

---

## 12 · Identidade deste parecer

```text
arquivo    AUDITORIA_INDEPENDENTE_MICROFASE_5_0_4.md
SHA-256    6395421586a4782ec8e511a269a142597e68c58d6998fca8a1a4aa74a6625827
bytes      25020
linhas     429
encoding   UTF-8 sem BOM · zero CRLF
```

---

Auditoria independente orientada a risco da microfase 5.0.4 concluída; a árvore original foi preservada; nenhum commit, push, PR, merge, tag, freeze, release, deployment ou trabalho da microfase 5.0.5 foi realizado; aguardando decisão do proprietário sobre integração.
