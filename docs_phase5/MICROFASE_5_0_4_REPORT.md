# Microfase 5.0.4 — Target & Heat Map Visualizations

**Relatório de entrega da candidata.** Documento factual de implementação; **não** é auditoria.
A microfase **não** está concluída nem congelada: só o auditor declara. Nenhuma autoauditoria foi
realizada.

> **ESTADO DA CANDIDATA: completa e verde; aguarda auditoria independente.**
> O blocker de fronteira normativa **`B-504-UNSET-LABEL`** está **FECHADO** pela
> **ERRATA AUTORIZADA UG8** (§20), por decisão explícita do proprietário (Opção 1). A microfase
> **não** está concluída nem congelada: só o auditor declara.
>
> **Registro histórico.** Este relatório declarou, na entrega anterior, `ESTADO DA CANDIDATA:
> BLOQUEADA`, com `UG 12/13` e `B-504-UNSET-LABEL` em aberto. Aquele estado foi **superado** pela
> errata: a §13 preserva o achado como registro e a §20 documenta o fechamento. O estado corrente é
> **UG 13/13**.

---

## 1 · Preflight

```text
branch inicial        main
HEAD == origin/main   ae03c04fd6eee124777ec8d57f29cd8cb8f2a04a          CONFERE
pais do merge         e0cde76f6440ff3c3b2874b6e803b03105498b35
                      127be70e7b150235ae4b4fb62415d826a98c6cf2          CONFERE
árvore                64d1b0b94a4ebd756cf1faff25bde0bde9493d5d          CONFERE
worktree limpo · staged 0 · tags 0 · releases 0 · deployments 0         CONFERE
HTML de entrada       04f9d7ba9c5534aff69fec5193ab7fd8548dae304eddf29fad1378c5de5639ab
engine                9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
payload M41           9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
tests_p50_chromium.js 52c5e1357dbb53b19bcff483e9521356b0b48063bdb6610df90114fc3bdf8847
manifesto             a822b1c656787a46264f30c6fd49b7aae8fc9bfa8bf2d6da6285ad6e614cea2a · 52/52
P50 CORE 31/31 · P50 Chromium 5/5 zero SKIP · P50-PR1 contra fe4a536a…/5d1a301e…
nenhum arquivo ou trabalho preexistente da 5.0.4
```

## 2 · Branch e base

```text
branch      feat/phase5-5-0-4   (criada de main exatamente em ae03c04…)
commits     0 · staged 0 · nenhum push, PR, merge, tag, freeze, release ou deployment
```

## 3 · Arquivos — pre/post

| caminho | papel | PRE | POST |
|---|---|---|---|
| `ui_p50_results_v32.js` | produção (§4.1) | `9694ef05…d30e670` | ver §14 |
| `ui_p50_v32.css` | produção (§4.1) | `57a6fa72…d77d7620` | ver §14 |
| `fixtures_p50.js` | teste (§4.2) | `90b2a7d2…023bc9b5` | ver §14 |
| `tests_p50_core.js` | teste (§4.2) | `ff6e2646…4a88927bc` | ver §14 |
| `tests_p50_chromium.js` | teste (§4.2) | `52c5e135…3bdf8847` | ver §14 |
| `tests_unset_ug.js` | **exceção nominal autorizada** (§20) | `d2a3f804…de1bae2e9` | `af129900…0cabcb91` |
| `quickscan_secops_soccmm_v3_2_dev.html` | output (§4.3, rebuild) | `04f9d7ba…5de5639ab` | ver §14 |
| `docs_phase5/MICROFASE_5_0_4_REPORT.md` | output (§4.3) | (inexistente) | este documento |
| `docs_phase5/evidence_p50/P50-5.0.4-*` | output (§4.3) | (inexistentes) | 7 artefatos novos |
| `docs_phase5/MANIFEST_PHASE5_P50.sha256` | output (§4.3, por último) | `a822b1c6…614cea2a` · 52/52 | **60/60** · SHA externo no handoff |

**`tests_p50_mutants.js` permanece byte-idêntico** (`28f2e876…8c8c067ddf5`), conforme §4.2.
**`tests_unset_ug.js`** é a **única** exceção de boundary, nominal e autorizada pelo proprietário
(§20), restrita ao bloco de `UG8`. `P50-GOV1` continua fixando-o byte a byte, no valor autorizado.
**Demais protegidos da §4.4 verificados byte a byte contra o `HEAD`:** `engine_v32.js`, Camada 1,
`ui_v32.js`, `ui_v32.css`, `ui_target_v32.js`, `ui_session_v32.js`, `ui_p50_shell_v32.js`,
`ui_p50_suff_v32.js`, `build_v32_html.py`, `package.json`, `package-lock.json`, **todas** as suítes
congeladas (inclusive `tests_unset_ug.js`), `tests_visual/`, specs, registros e evidências
5.0.1/5.0.2/5.0.3 — **zero divergência**.

## 4 · RED real, antes de qualquer código de produção

Os gates foram escritos e ampliados primeiro. O vermelho alcançou **asserções semânticas** —
a suíte inicializou por inteiro, sem erro de sintaxe, fixture inválida ou browser ausente:

```text
P50 CORE (antes da implementação): 27 PASS · 6 FAIL de 33 · exit 1
  FAIL  P50-UX6   [esperadas 4 tabs de Results, obtidas 0]
  FAIL  P50-UX9   [tab ausente para isolamento: heatmap]
  FAIL  P50-UX10  [heat map com 0 células (esperadas 15)]
  FAIL  P50-COR2  [heat map ausente]
  FAIL  P50-UX11  [chips de presence ausentes na superfície nova]
  FAIL  P50-COR3  [UNSET não é esmaecido (sem opacidade declarada)]

P50 CHROMIUM (antes da implementação): 5 PASS · 4 FAIL de 9 · exit 1
  FAIL  P50-VIS7  [tab ausente: heatmap]
  FAIL  P50-VIS8  [tab ausente: heatmap]
  FAIL  P50-VIS9  [tab ausente: analise]
  FAIL  P50-ACC5  [tab ausente: heatmap]
```

## 5 · Arquitetura e fontes canônicas

Um **modelo de dados único** (`p50Matrix(contract)`) alimenta as quatro visões. Isso não é
elegância: é a garantia estrutural de que a alternativa acessível **não pode** divergir do gráfico
(P50-ACC5 compara campo a campo, e ambos consomem a mesma derivação).

```text
respostas             ans[k]                                    owner congelado
score por domínio     domStat(i).score
perfil atual/alvo     tgtCurrentProfile() · computeTargetProfile(tgtEffectiveVector())
alvo declarado        TARGET_PROFILE.overrides                  nunca fixo, nunca inferido
presence              V32.TECH_LANDSCAPE[cap].presence
suficiência           window.__P50SUFF.contract()               (UI-012A)
```

Nenhuma matemática nova: o único arredondamento é o do **delta** (`target − current`), sobre dois
valores que o runtime congelado já produziu. Nenhum limiar de suficiência é declarado, comparado ou
recalculado nesta camada — `P50-SUF0` continua verde.

**Ressalva declarada — rótulo de presence.** O runtime congelado mantém `PRESENCE_LABELS` dentro do
IIFE de `ui_v32.js` e **não o expõe** à Camada 5. O **valor** de presence continua tendo owner
único e canônico; o **rótulo visível** passou a ser texto de apresentação PT-BR declarado em
`ui_p50_results_v32.js` (UI-033A). Para que isso não vire deriva silenciosa, `P50-UX11` exige
**cobertura total** do mapa da Camada 5 contra `V32.ENUMS.presence` e reprova qualquer enum cru
que chegue à tela: se o engine acrescentar um estado, o gate falha em vez de vazar `UNSET` como
texto.

## 6 · Tabs de Results (UI-028)

```text
Resumo · Domínios · Heat Map · Análise        (sem tab Framework Mapping — §15)
```

- `role="tablist"`/`role="tab"`/`role="tabpanel"`, `aria-selected`, `aria-controls`,
  `aria-labelledby`, roving `tabindex` e teclado `ArrowLeft`/`ArrowRight`/`Home`/`End`;
- trocar de tab **não** chama setter canônico, **não** dispara `render()` congelado e **não** toca
  owner algum: alterna `hidden` e o estado ARIA, nada mais;
- o valor corrente vive em variável de módulo (estado efêmero, UI-010A): sobrevive a re-render,
  **não** é serializado e **não** aparece em `captureCanonicalInputs()` — asserido por `P50-UX9`;
- rótulos PT-BR; nenhuma camada "aspecto/capability" entre domínio e pergunta (correção A-2),
  asserido explicitamente por `P50-UX6`.

## 7 · Heat map domínio → pergunta (UI-015 · UI-016a)

15 células, 5 linhas de domínio. Cada célula expõe domínio, pergunta, estado canônico, valor
**somente quando confirmado**, insuficiência do domínio (consumida do contrato), target gap
**somente com override** e rótulo visível + nome acessível coerentes.

```text
null   → data-p50-ans="unset"      "n/d"        sem nível, sem score, data-p50-fill="none"
"NA"   → data-p50-ans="na"         "Não sei"    sem nível, sem score, item de validação
0      → data-p50-ans="confirmed"  "0.0"        nível 0 PLOTADO normalmente (UG7)
1..3   → data-p50-ans="confirmed"  valor correspondente
```

**Encoding de UNSET (§12.2c · COR-01.3):** cor do **próprio domínio** esmaecida
(`background:var(--dom-accent)` a `opacity:.28`) **mais** duas pistas não cromáticas — borda
tracejada e hachura diagonal. Nunca cinza genérico, nunca o acento de marca, nunca o encoding
tracejado+verde reservado ao alvo. Zero hex literal: toda cor vem de token congelado.

## 8 · Presence UNSET × NONE (UI-016b · §12.2)

Chips por capability, agrupados pela identidade de domínio derivada dos `questionIds` canônicos.

```text
UNSET  data-p50-presence="UNSET"  data-p50-confirmed="false"  cue="tracejado"  "Não informado"
NONE   data-p50-presence="NONE"   data-p50-confirmed="true"   cue="barrado"    "Não existe / não utilizamos"
```

DOM semantics, rótulo visível, nome acessível e pista não cromática **distintos** entre os dois.
UNSET nunca vira zero e nunca é apresentado como ausência confirmada. Nenhuma presence é fabricada:
`P50-UX11` confere chip a chip contra `V32.TECH_LANDSCAPE`.

## 9 · Drill-down (UI-030)

`domínio → pergunta → resposta/estado/nota`, com a nota **somente leitura**, vinculada ao owner
canônico `notes[k]`. Nenhum score, status ou provenance paralelo é criado.

## 10 · Current × Target (UI-017 · UI-018 · UI-019)

- alvo **exclusivamente** de `TARGET_PROFILE.overrides` e do perfil canônico derivado;
- **sem override, nenhum alvo é exibido** — a superfície declara a ausência em vez de arbitrar um
  valor; `P50-VIS9` reprova qualquer `3.0` fixo ou fallback;
- alvo aparece **apenas** nos domínios com override (em `P50-F9`: Negócio, Pessoas, Tecnologia;
  Processos e Serviços ficam deliberadamente sem alvo, e o gate confere isso domínio a domínio);
- encoding do alvo: **tracejado + `var(--ftnt-green)`**; current usa a cor do próprio domínio;
- gap deriva de current e override canônicos; nunca é serializado como owner.

**Colisão de encoding registrada e resolvida.** A paleta congelada atribui `--ftnt-green` ao
domínio **Pessoas**. Portanto o verde **isolado** não é exclusivo do alvo — o encoding exclusivo é
a **combinação** tracejado + verde (§12.2b · T14/V9). A primeira versão do meu `P50-VIS9` proibia a
cor isolada e reprovava a barra legítima de Pessoas; a asserção foi corrigida para exigir a
combinação, sem afrouxar o que o gate protege. Ver H-27 (§12).

### 10.1 Current insuficiente ou UNSET (UI-019)

Sob gate fechado, **nenhum agregado de domínio é publicado**: `data-p50-current` ausente, barra não
plotada, `n/d` como rótulo, zero gap e uma declaração explícita de indisponibilidade. O eixo por
**pergunta** permanece honesto e visível — inclusive o `0.0` confirmado. Ver H-28 (§12).

## 11 · Invariantes de estado canônico

Para toda interação nova (troca de tab, teclado, seleção), capturado antes/depois:

```text
JSON.stringify(captureCanonicalInputs())    igualdade estrita
tgtCurrentProfile()                         igualdade estrita
window.__P50SUFF.contract().sufficient      igualdade estrita
TARGET_PROFILE.overrides                    igualdade estrita
```

Asseridos em `P50-UX6`, `P50-UX9` (CORE) e `P50-VIS9` §(3) (Chromium). Oráculos proibidos por
P50-UX9 permanecem ausentes.

## 12 · Defeitos encontrados no próprio harness

- **H-27 · `P50-VIS9` confundia cor com encoding.** A primeira formulação proibia
  `--ftnt-green` na barra de current; como a paleta congelada dá verde ao domínio Pessoas, o gate
  reprovava o cumprimento correto de COR-01.2. Corrigido para exigir a **combinação** tracejado +
  verde, que é o encoding realmente exclusivo do alvo.
- **H-28 · `P50-SUF1` desarmado por concatenação de `textContent`.** A asserção
  `/\b0[.,]0\b/` varria `textContent` do container inteiro; nós adjacentes concatenam
  (`" · 0.0"` + `"1 de 2…"` = `"0.01"`) e **destroem o word boundary**. Foi exatamente por isso que
  a primeira implementação publicou **score agregado de domínio sob gate fechado** — a mesma classe
  do `B-503-COHERENCE` — e passou. O gate foi **fortalecido**, não afrouxado: a leitura passou a ser
  **por nó**, com separador, e ganhou asserções **estruturais** por atributo sobre as três visões
  novas. O escopo textual exclui as subárvores de resposta **confirmada**, porque um `0.0`
  confirmado é legítimo e obrigatório (UG7/UI-016a) — o que se persegue é o zero **fabricado**.
  Depois disso o gate reprovou a implementação; a produção foi corrigida (§10.1).
- **H-29 · refactor de tabs desarmou os mutantes congelados M37/M38.** Ao mover os executive cards
  para dentro do painel Resumo, a âncora literal
  `if (released) sec.appendChild(p50ExecCards());` + `return sec;` deixou de existir e a campanha
  passou a reportar `ÂNCORA DE MUTAÇÃO NÃO ENCONTRADA` (51/53). Como `tests_p50_mutants.js` é
  byte-idêntico por boundary, a correção foi **minha**: o painel Resumo passou a ser construído por
  `p50BuildResumo(released)`, função que **é dona** da decisão de publicar conteúdo executivo e
  termina exatamente naquela sequência. M37 e M38 voltaram a ser detectados pelo gate e motivo
  esperados.

Nenhum desses defeitos foi ocultado; nenhum gate foi enfraquecido para contorná-los.

## 13 · `B-504-UNSET-LABEL` — colisão normativa · **FECHADO** (ver §20)

**Severidade:** era bloqueante · **Classe:** fronteira normativa · **Status:** **FECHADO** pela
ERRATA AUTORIZADA UG8, decisão do proprietário (Opção 1). Ver §20 para a correção, as provas de não
vacuidade e os hashes pre/post.

O achado abaixo é preservado como **registro do que foi encontrado e por que não foi contornado**.
Ele descreve o estado da entrega anterior, **não** o estado corrente.

### 13.1 Fato reproduzido

`UG8` (suíte congelada `tests_unset_ug.js`, protegida pela §4.4) executa uma sessão **suficiente**
com 10 confirmadas (2 por domínio) e a 3ª pergunta de cada domínio **não respondida**, e assere:

```js
!app.includes("n/d")      /* app = textContent de #app */
```

`UI-016a` da REV B especifica, para o **eixo de respostas**:

```text
null → n/d · "Não avaliado" · sem score
```

O heat map e a sua alternativa acessível são superfícies **por pergunta** e vivem dentro de `#app`.
Numa sessão suficiente com perguntas não respondidas, elas emitem `n/d` por definição:

```text
[HISTÓRICO · PRÉ-ERRATA — o estado corrente é UG 13/13, ver §20–§25]
suficiente: true · gate: released · #app contém "n/d": true
nós que emitem "n/d":  hm-state 5  ·  <td> da tabela alternativa 20
fora de #p50-results:  nenhum
UNSET GEOMETRY (UG): 12 PASS · 1 FAIL de 13 · exit 1   (somente UG8)
```

### 13.2 Por que é blocker e não uma escolha de implementação

Antes da 5.0.4 **não existia eixo por pergunta** dentro de `#app` na tela de resultados: a asserção
página-inteira de UG8 era um proxy adequado para uma propriedade do **eixo de domínio** ("nenhum
domínio renderiza `n/d`, porque todos têm score"). A 5.0.4 introduz legitimamente um segundo eixo,
e o proxy passa a capturar algo que ele nunca pretendeu governar.

Toda resolução disponível é **decisão do proprietário**, não minha:

1. **Escopar a asserção de UG8 ao eixo de domínio** (p. ex. `.panel .dom` + `svg.radar`) — uma
   linha em suíte **congelada e protegida**. Preserva integralmente a propriedade que UG8 defende
   e resolve a colisão na sua origem. **Recomendada**, mas exige autorização explícita para tocar
   arquivo protegido.
2. **Trocar o rótulo do eixo por pergunta** por outro texto (p. ex. "não respondida"), reservando
   `n/d` ao eixo de domínio. Não toca arquivo protegido, mas **reinterpreta `UI-016a`**, que escreve
   `n/d` literalmente para o eixo de respostas — e §12.2(a) fixa `n/d` como o rótulo canônico de
   UNSET por decisão A-8.
3. **Render tardio dos painéis** (só ao ativar a tab). Faria UG8 passar por construção, sem resolver
   a colisão — e **degradaria a alternativa acessível**, que deixaria de existir por padrão,
   enfraquecendo `P50-ACC5`. **Não recomendada.**

Não escolhi nenhuma. Escolher seria arbitrar unilateralmente entre uma cláusula normativa e um gate
congelado — precisamente o que a §4.4 me proíbe.

### 13.3 Estado deixado na árvore pela entrega anterior — **SUPERADO**

Naquele momento: `UI-016a` implementada como escrita (`n/d` no eixo de respostas) e `UG8`
**vermelho**, com `tests_unset_ug.js` intocado. **Estado corrente:** `UI-016a` permanece implementada
exatamente como escrita — **nenhum rótulo P50 mudou** — e `UG8` está **verde** após a correção
autorizada do seu escopo (§20). `UG 13/13`.

## 14 · Assurance executada

Cada comando concluiu com código de saída próprio. Nenhum PASS atribuído a timeout, interrupção ou
`SKIP`.

| verificação | esperado | observado | exit |
|---|---|---|---:|
| P50 CORE | 31/31 + novos | **33 PASS · 0 FAIL de 33** | **0** |
| P50 Chromium (Chromium real, zero SKIP) | 5/5 + novos | **9 PASS · 0 FAIL de 9** | **0** |
| `P50-VIS7` · `P50-VIS8` · `P50-VIS9` · `P50-ACC5` | novos, verdes | **PASS** | **0** |
| `P50-PR1` contra `fe4a536a…`/`5d1a301e…` | verde | **PASS** · baseline comparada | **0** |
| mutação P50 (harness byte-idêntico) | 53/53 | **53/53 detectados** · 0 não detectados | **0** |
| engine | 105 | **105 PASS · 0 FAIL** | **0** |
| UI 3.1/3.2/3.3.1/3.3.2/3.3.3 | 19+25+11+23+26 | **19 · 25 · 11 · 23 · 26** | **0** ×5 |
| UX 4.1 · Target · Refinement · Journey · Icons | 56 · 30 · 28 · 31 · 12 | **56 · 30 · 28 · 31 · 12** | **0** ×5 |
| Session 4.8 | 97/97 | **97 PASS · 0 FAIL** | **0** |
| **UG (UG13 em Chromium real)** | **13/13** | **13 PASS · 0 FAIL** (pós-errata, §20) | **0** |
| M41 | PASS + payload | **COMPARAÇÃO: PASS** · `9794b267…3bed4365b` | **0** |
| `test:visual` | 67 / 0 / 37 | **67 passed · 0 failed · 37 skipped** | **0** |
| print congelado (UI 3.3.2 PDF) | 23/23 | **23 PASS · 0 FAIL** | **0** |
| builds A/B | determinístico | **A == B**, bytes idênticos | **0** ×2 |
| engine · payload M41 · boundary | intactos | **intactos** | — |
| evidências históricas | byte-idênticas | **29/29 byte-idênticas** | — |

Ambiente: Node `v22.23.2` · Playwright `1.62.1` · Chromium real `151.0.7922.34` (`RQ-502-1`
mantida) · `pageErrors: []` nos gates novos.

### 14.1 Campanha de mutação — executada em cópia temporária

`tests_p50_mutants.js` é **byte-idêntico** por boundary (§4.2) e, por desenho, grava a sua evidência
em `P50-5.0.3-mutation.json`, registrando os SHAs das fontes. Executá-la no clone **regravaria
evidência histórica da 5.0.3**, o que a §4.4 e a §10 proíbem. A campanha foi portanto executada em
**cópia temporária completa** do estado corrente, com código de saída próprio, sem escrever um byte
no clone.

```text
MUTATION TESTING (5.0.1+5.0.2+5.0.3) [tests_p50_mutants.js · namespace P50]:
      53/53 mutantes detectados pelo gate e motivo esperados          exit 0
acervo de evidência: 29/29 byte-idênticos ao início; zero arquivo escrito
restauração: ui_p50_shell_v32.js OK · ui_p50_v32.css OK · ui_p50_suff_v32.js OK ·
             ui_p50_results_v32.js OK · html OK
```

Os mutantes `M37`/`M38` voltaram a ser detectados após a correção de H-29 (§12); antes dela a
campanha reportava `51/53` com `ÂNCORA DE MUTAÇÃO NÃO ENCONTRADA` — defeito meu, não do harness.

### 14.2 Hashes finais

```text
ui_p50_results_v32.js                      b52f5c3b3ef2975ac9906f31f8001c21a3311cbfc156f2aeed8780eaa567eb5d   38.243 bytes
ui_p50_v32.css                             81b32002a8fe4d891d4d7ce3704ee98c6c43ddefba9d8bd5f966cfdb6f2d9a30   24.358 bytes
fixtures_p50.js                            08610c8f92238eefb82a07ec57cb1ab9cdbb626cad1c9483d278e26ed572443f   16.586 bytes
tests_p50_core.js                          038876723376cf7934a53d024b201e9cb6c407ff989253410bb82345656f0ef9   135.750 bytes
tests_p50_chromium.js                      c0ead18e2be76fb7ef8c219b1f30ac876c2ae543d04007a415c687968fdf0d0e   104.579 bytes
quickscan_secops_soccmm_v3_2_dev.html      d7c532097ac00548212085579c434e4dab69d14b7ed51ad86ab68377fd6cdb8c   685.519 bytes
docs_phase5/MANIFEST_PHASE5_P50.sha256     60 entradas · 60/60 OK · regenerado POR ÚLTIMO
   (o SHA externo do manifesto NÃO é registrado aqui: o relatório é entrada dele,
    e fixá-lo criaria dependência circular. Vai no handoff e é reconferível por
    `sha256sum docs_phase5/MANIFEST_PHASE5_P50.sha256`.)
engine_v32.js                              9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
payload funcional M41                      9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
```

## 15 · Evidências

Prefixo exclusivo `P50-5.0.4-`, de **execução limpa final única**. Nenhum artefato de microfase
anterior foi regravado — conferido byte a byte antes e depois (**29/29 históricas idênticas**).

```text
P50-5.0.4-heatmap-F6-1440.png            heat map, três estados lado a lado, 1440
P50-5.0.4-heatmap-F6-390.png             idem, 390 (sem overflow horizontal)
P50-5.0.4-presence-F7-1440.png           eixo de presence UNSET × NONE
P50-5.0.4-current-target-F9-1440.png     Current × Target com overrides canônicos
P50-5.0.4-current-target-F9-390.png      idem, 390
P50-5.0.4-domain-drilldown-1440.png      drill-down domínio → pergunta → nota
P50-5.0.4-visual-surface.json            estado, acessibilidade, bounding boxes, owners canônicos,
                                         divergências por gate e comparação before/after
```

## 16 · Casos adversariais exigidos pela §9.2

| # | caso | onde reprova |
|---|---|---|
| 1 | `null` renderizado como `0` | P50-UX10 · P50-VIS8 (blank: 0 preenchimentos, 0 níveis) |
| 2 | `NA` recebendo score/fill | P50-UX10 (`data-p50-level` ausente em NA) |
| 3 | `0` omitido como não avaliado | P50-UX10 (`fill="level"`, nível `0`) · P50-VIS8 |
| 4 | target fixo sem override | P50-VIS9 §(1): 0 marcadores, 0 gaps, `3.0` ausente |
| 5 | target alterando current/canônico | P50-VIS9 §(3) · P50-UX6 · P50-UX9 |
| 6 | gap com current inexistente | P50-VIS9 §(4) · P50-SUF1 (5.0.4) |
| 7 | UNSET igual a NONE | P50-UX11 · P50-VIS8 §(3) |
| 8 | `#DA291C` como dado de domínio | P50-COR1 · P50-COR2 (zero hex; `--ftnt-red` ausente) |
| 9 | alternativa acessível divergente | P50-ACC5 (comparação campo a campo, 15 linhas) |
| 10 | tabs mutando owner canônico | P50-UX6 · P50-UX9 |

Nenhum mutante persistente foi acrescentado; `tests_p50_mutants.js` permanece byte-idêntico.

## 17 · Declaração de boundary

Alterados **exclusivamente** os caminhos autorizados: produção `ui_p50_results_v32.js` e
`ui_p50_v32.css` (§4.1); teste `fixtures_p50.js`, `tests_p50_core.js`, `tests_p50_chromium.js`
(§4.2); outputs `quickscan_secops_soccmm_v3_2_dev.html` (rebuild determinístico), este relatório,
as evidências `P50-5.0.4-*` e o manifesto (§4.3). Nenhum módulo novo criado.

**Exceção nominal de boundary, autorizada pelo proprietário (§20):** `tests_unset_ug.js`, somente no
bloco de `UG8`. É **test-only, nominal, estreita e não extensível**. Nenhum outro arquivo protegido
da §4.4 foi tocado — 39 caminhos protegidos conferidos byte a byte contra o `HEAD`, zero
divergência, incluindo `tests_p50_mutants.js`, as demais suítes congeladas, `tests_visual/`, specs,
engine, Camada 1, `ui_v32.js`/`ui_v32.css`, Target, Session, builder e package files. Nenhum namespace de gate novo: os IDs usados (`P50-UX6/9/10/11`,
`P50-VIS7/8/9`, `P50-ACC5`, `P50-COR2/3`, `P50-GOV1`, `P50-PR1`) são todos pré-declarados na
REV B §25.

## 18 · Blockers e ressalvas

- **`B-504-UNSET-LABEL`** — **FECHADO** (§20), por decisão do proprietário (Opção 1). Nenhum
  blocker aberto.
- **`RQ-504-1`** — o runtime congelado não expõe rótulos de presence à Camada 5; o rótulo visível
  é texto de apresentação da Camada 5, com trava de cobertura contra `V32.ENUMS.presence` (§5).
  Não bloqueante.
- `P50-VIS10` continua **aberto e integral**; `P50-PR1` segue guard adicional e estreito.
- `RQ-502-1` (Chromium 151 × 141 nominal) e `RQ-502-2` (axe-core na 5.0.5) mantidas.
- `RQ-AUDFIN-1`, `RQ-AUDFIN-3`, `RQ-REAUD-2`, `RQ-REAUD-3`, `RQ-REAUD-FIN-1` inalteradas.

## 19 · Atos NÃO realizados

Nenhum commit · nenhum push · nenhum PR · nenhum merge · nenhuma tag · nenhum freeze · nenhuma
release · nenhum deployment · **microfase 5.0.5 não iniciada** · nenhuma autoauditoria · nenhum
módulo novo · **nenhum outro arquivo protegido alterado além da exceção test-only, nominal e
autorizada no bloco `UG8` de `tests_unset_ug.js`** (§20) · `tests_p50_mutants.js` byte-idêntico ·
demais suítes congeladas byte-idênticas · nenhum mutante persistente acrescentado · nenhuma
evidência anterior regravada ·
nenhum símbolo de framework mapping, NIST/CIS, print ou 5.0.5 introduzido · nenhum dado de cliente
tocado.

A candidata aguarda **auditoria independente em sessão e contexto distintos**. Declarar a microfase
encerrada, congelada ou aprovada **não é ato meu**.

---

# ERRATA AUTORIZADA UG8 — fechamento de `B-504-UNSET-LABEL`

## 20 · Escopo, autoridade e limite

Diretriz vinculante: `ERRATA_AUTORIZADA_UG8_MICROFASE_5_0_4.md` · SHA-256
`1f49af03b854a9c14889b6b424e6d49cf40bce5034d582e04ace32cf59490860` · 11.686 bytes · UTF-8 sem BOM ·
zero CRLF — identidade conferida antes de qualquer edição.

**Divergência de metadado registrada por honestidade:** a instrução de entrada declara `185 linhas`;
o arquivo tem **184** (termina com newline; `wc -l` e `awk NR` concordam em 184). SHA-256 e tamanho
em bytes conferem **exatamente**, e são eles que fixam a identidade — é o arquivo pretendido. A
divergência é de campo descritivo, não de conteúdo.

**Decisão do proprietário: Opção 1.** Corrigir exclusivamente o **escopo do oráculo de `UG8`** em
`tests_unset_ug.js`, de modo que ele continue protegendo o eixo congelado de **domínio/radar** sem
capturar o novo eixo normativo **por pergunta** da Camada 5.

Exceção de boundary **test-only, nominal, estreita e não extensível**. Não foram alterados: produção
congelada, engine, Camada 1, `ui_v32.js`/`ui_v32.css`, Target, Session, builder, package files,
outras suítes congeladas, specs, registros ou evidências históricas. **Nenhum requisito, byte de
runtime ou rótulo P50 foi alterado**: o `n/d` normativo do heat map, do drill-down e da alternativa
acessível permanece exatamente como `UI-016a`, a decisão A-8 e a §12.2 exigem.

## 21 · Reprodução do blocker ANTES da correção

```text
[ANTES DA CORREÇÃO — reprodução exigida pela errata; o estado corrente é UG 13/13, ver §25]
node tests_unset_ug.js
  UG1..UG7 e UG9..UG13   PASS
  UG8                    FAIL
  UNSET GEOMETRY (UG): 12 PASS · 1 FAIL de 13        exit 1
```

Sonda somente-leitura sobre o vetor **exato** de `UG8` (10 confirmadas, 2 por domínio, a 3ª de cada
domínio `null`):

```text
pré-condição funcional
  confirmadas totais            10
  confirmadas por domínio       2,2,2,2,2
  suficiência canônica          true
  domStat(i).score              3.3 | 3.3 | 3.3 | 3.3 | 3.3

eixo CONGELADO de domínio/radar
  #app .grid2 .panel .dom       5 linhas
  #app svg.radar                1
  vértices do polígono          5
  svg.radar .unset-mark         0
  valores .lbl > span           "3.3 — Defined" × 5
  "n/d" no eixo de domínio      NÃO
  "n/d" no radar congelado      NÃO

origem do "n/d" que dispara o FAIL
  P50:hm-state   5      (células UNSET do heat map)
  P50:td        20      (tabela acessível)
  emissores FORA de #p50-results:  NENHUM
```

A sessão é funcionalmente suficiente, o eixo congelado está íntegro, e o `n/d` vem **exclusivamente**
da superfície P50 por pergunta. O conflito está no **alcance do oráculo**, não no comportamento do
produto.

## 22 · Correção aplicada — diff exato de `UG8`

```diff
-  const app=txt(q(d,"#app"));
   const expected=SCORES[2];
+  const domRows=Array.from(d.querySelectorAll("#app .grid2 .panel .dom"));
+  const radar=q(d,"#app svg.radar");
+  if(domRows.length!==5) throw new Error("UG8: eixo de domínio com "+domRows.length+" linhas (esperadas 5)");
+  if(!radar) throw new Error("UG8: radar congelado #app svg.radar ausente");
+  if(!shape) throw new Error("UG8: polígono do radar ausente");
+  domRows.forEach((r,i)=>{ if((txt(r)||"").includes("n/d"))
+    throw new Error("UG8: 'n/d' no eixo congelado de domínio, linha "+i+": "+…); });
+  if((txt(radar)||"").includes("n/d")) throw new Error("UG8: 'n/d' no radar congelado");
+  const shown=domRows.map(r=>{const s=r.querySelector(".lbl > span");return s?txt(s).trim():null;});
+  shown.forEach((v,i)=>{ if(v===null) throw new Error("UG8: valor de domínio ausente na linha "+i);
+    if(v.indexOf(expected.toFixed(1))!==0)
+      throw new Error("UG8: domínio "+i+" exibe '"+v+"' e não o score esperado "+expected.toFixed(1)); });
   return sc.every(s=>s===expected) && nPts(shape)===5 &&
-    !d.querySelector("svg.radar .unset-mark") &&
-    !app.includes("n/d") && app.includes("3.3");
+    !d.querySelector("svg.radar .unset-mark");
```

Conformidade item a item com a §3 da errata:

| exigência | cumprida |
|---|---|
| preservar ID, título e contagem de `UG8` | **sim** — ID e título intactos; UG segue com 13 gates |
| preservar scores de domínio, 5 vértices, ausência de `.unset-mark` | **sim** — as três asserções permanecem no `return` |
| trocar a coleta ampla de `#app` por coleta nominal de domínio/radar | **sim** — `#app .grid2 .panel .dom` + `#app svg.radar` |
| cardinalidade estrutural; ausência é FAIL, não PASS | **sim** — 5 linhas e 1 radar exigidos, com diagnóstico |
| `n/d` ausente **somente** nessa superfície | **sim** — verificado linha a linha e no radar |
| cinco valores correspondem a `3.3`, não uma ocorrência solta | **sim** — `shown[i]` conferido contra `expected.toFixed(1)` |
| não incluir `#p50-results`/`.p50-hm-*`/`.p50-alt-*`/drill-down | **sim** — nenhum seletor P50 no oráculo |
| não alterar `UG9` | **sim** — bloco `UG9` **byte-idêntico** (diff vazio) |

Não se usou remoção pura de `!app.includes("n/d")`, nem `document.body`, nem filtro textual que
fizesse o gate ignorar linhas de domínio.

### 22.1 Consequência autorizada em `P50-GOV1`

`P50-GOV1` fixa `tests_unset_ug.js` **byte a byte** e, corretamente, reprovou a edição autorizada.
O pin foi **reancorado ao valor autorizado** em `tests_p50_core.js` (arquivo já autorizado pela
§4.2), com comentário registrando a exceção, a sua autoridade e o hash anterior. O gate **não foi
enfraquecido**: continua fixando o arquivo byte a byte.

```text
tests_unset_ug.js  PRE   d2a3f804bb14e9156978407710a7a680f8dc4b71929546c28a719fbde1bae2e9  14.943 B · 277 linhas
tests_unset_ug.js  POST  af129900d1c5e2b8f02a9582f4fc8ab26fecc617cc595c9f2a7508000cabcb91  16.897 B · 300 linhas
```

## 23 · Provas de não vacuidade e de separação dos dois eixos

Todas em **cópia temporária**, com restauração byte-idêntica conferida após cada caso. O clone
permaneceu intocado (`tests_unset_ug.js af129900…`, HTML `d7c53209…`).

**23.1 · Caso positivo — pergunta sem resposta é legítima**

```text
eixo POR PERGUNTA contém "n/d"       SIM   · 5 células data-p50-ans="unset"
eixo de DOMÍNIO: cinco valores 3.3   5/5   · "3.3 — Defined"
eixo de DOMÍNIO contém "n/d"         NÃO
UG8                                  PASS  · UG 13/13 · exit 0
```

**23.2 · Mutante negativo — `n/d` indevido no eixo de domínio**
(surrogate na Camada 1 da cópia: domínio 2 publica `n/d` preservando as cinco linhas)

```text
FAIL  UG8 — [UG8: 'n/d' no eixo congelado de domínio, linha 2: Processos · Process…]   exit 1
```

O diagnóstico **nomeia o eixo e a linha afetada**, como exigido.

**23.3 · Mutante negativo — superfície ausente**

```text
(a) uma das cinco linhas inalcançável
    FAIL  UG8 — [UG8: eixo de domínio com 4 linhas (esperadas 5)]        exit 1
(b) radar aplicável ausente
    FAIL  UG8 — [UG8: radar congelado #app svg.radar ausente]            exit 1
```

Falha por **cardinalidade/estrutura**, nunca PASS por coleção vazia.

**23.4 · Controle — domínio realmente UNSET**

`UG9` reexecutado **sem modificação** (bloco byte-idêntico, diff vazio): **PASS**. O `n/d` canônico
continua exigido em tela, régua e PDF quando um domínio inteiro está UNSET. A correção de `UG8` não
alterou esse comportamento nem o seu gate.

Nenhum namespace novo criado; nenhum mutante persistido na suíte.

## 24 · Inspeção visual (§7 da errata) — Chromium real 1440 px e 390 px

Confrontada com DOM e atributos, mais inspeção visual dos artefatos regenerados:

```text
1440px · pageErrors 0 · requisições externas 0 · overflow horizontal 0
 390px · pageErrors 0 · requisições externas 0 · overflow horizontal 0
estados distintos            ["n/d", "Não sei", "0.0"]  nos dois viewports
0.0 confirmado               data-p50-level="0" · data-p50-fill="level" · plotado
null                         "n/d" + tracejado + hachura na cor do próprio domínio, esmaecida
domínio insuficiente         "faltam N · evidência insuficiente" + esmaecimento + pista
tabela acessível             estados idênticos aos do heat map, célula a célula
drill-down                   0 campos editáveis, 0 botões — somente leitura
Current × Target (gate fechado)  0 agregados, 0 deltas, indisponibilidade declarada
Current × Target (F9)        alvo só nos 3 domínios com override; current == canônico
```

Inspeção visual direta dos PNGs confirma: no heat map, cor de domínio congelada por linha, células
UNSET com hachura tracejada na própria cor, `Não sei` em itálico pontilhado e `0.0` sólido
preenchido; no Current × Target, barras na cor do domínio e marcador de alvo **tracejado verde**
apenas em Negócio, Pessoas e Tecnologia — Processos e Serviços sem alvo e sem gap.

## 25 · Reexecução obrigatória (§6 da errata)

Ver a tabela consolidada em §14, atualizada para o estado pós-errata. Destaques:

```text
UG1–UG13                 13 PASS · 0 FAIL      exit 0   (UG13 em Chromium real, zero SKIP)
P50 CORE                 33 PASS · 0 FAIL      exit 0
P50 Chromium              9 PASS · 0 FAIL      exit 0   zero SKIP · Chromium real 151.0.7922.34
campanha de mutação      53/53 detectados      exit 0   (cópia temporária; acervo 36/36
                                                         byte-idêntico, zero escrita no clone)
engine 105 · UI 19+25+11+23+26 · UX 56 · Target 30 · Ref 28 · Journey 31 · Icons 12
Session 97/97 · visual 67/0/37 · print 23/23 · M41 PASS payload 9794b267…3bed4365b
Builds A/B               A == B == d7c532097ac00548212085579c434e4dab69d14b7ed51ad86ab68377fd6cdb8c
```

`P50-5.0.3-mutation.json` do clone permanece `6cd79e68…c3183da7`, byte-idêntico ao `HEAD`: a
campanha não regravou evidência histórica.

A edição test-only de `UG8` **não alterou bytes do HTML**, como a errata previa: o candidato
permanece `d7c53209…`, idêntico ao da entrega anterior.

## 25.1 · Manifesto — desvio registrado da cardinalidade prevista

A errata previa `60` entradas, supondo que `tests_unset_ug.js` já fosse caminho coberto, e mandou
**confirmar pela enumeração real, não por presunção**. A enumeração real mostra que a suposição era
falsa:

```text
tests_unset_ug.js no manifesto do HEAD:   0 ocorrências (NUNCA esteve)
```

Razão: `tests_unset_ug.js` sempre foi **suíte congelada e protegida**, fora do delta da Phase 5.0 e,
por isso, fora deste manifesto — que cobre o delta, não as superfícies protegidas. Ao entrar no
delta pela exceção nominal autorizada, passou a **exigir cobertura**: sem ela o manifesto deixaria
de ser completo sobre `git status --porcelain`, que é o seu próprio oráculo de completude.

```text
cardinalidade   60 → 61      (o único acréscimo é tests_unset_ug.js)
entradas 61 · corretos 61/61 · ausentes 0 · excedentes 0 · duplicatas 0 · autorreferência 0
delta git 16 · nenhum caminho do delta fora do manifesto
aritmética  (16 − 1 autorreferência) + 46 artefatos já comitados = 61
```

Este é um **desvio declarado** em relação ao número previsto na errata, adotado exatamente pela
regra que a própria errata fixou (enumeração real acima de presunção). Nenhuma outra cardinalidade
mudou.

## 26 · Atos NÃO realizados nesta errata

Nenhum commit · push · PR · merge · tag · freeze · release · deployment · **microfase 5.0.5 não
iniciada** · nenhuma autoauditoria · nenhum parecer importado · nenhum requisito, byte de runtime ou
rótulo P50 alterado · nenhuma superfície P50 movida para fora de `#app` · nenhum render tardio ·
`P50-ACC5` não enfraquecido · contagem `UG1–UG13` inalterada · nenhuma asserção de `UG8` removida ·
`tests_p50_mutants.js` byte-idêntico · evidências históricas byte-idênticas · nenhum dado de cliente
tocado.
