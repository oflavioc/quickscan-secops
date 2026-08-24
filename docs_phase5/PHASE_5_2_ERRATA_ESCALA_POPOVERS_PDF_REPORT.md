# Phase 5.2 — Errata estreita de UAT: escala ultrawide, popovers de domínio e paginação do PDF

**Errata aplicada sobre a candidata corrente da Phase 5.2 REV B.** Não abre fase nova, não recomeça
a implementação e não reabre item já aprovado. Branch `feat/phase5-5-2-desktop-workspace`,
**0 commits**.

Documento aplicado: `ERRATA_UAT_PHASE_5_2_ESCALA_POPOVERS_PDF.md`
· SHA-256 `53aae7a1fdd48a2a62b900310d3f16a04fd3e4c8168bc7ceaba0468324c49c38` · 12.474 bytes ·
260 linhas · UTF-8 sem BOM · zero CRLF — conferido antes de qualquer edição.

Complementa `PHASE_5_2_DESKTOP_WORKSPACE_REPORT.md`, `PHASE_5_2_UAT_REVISION_A_REPORT.md` e
`PHASE_5_2_UAT_REVISION_B_REPORT.md`, que permanecem válidos para tudo o que esta errata não
substituiu. Este relatório **não declara a fase concluída** e **não contém autoauditoria**.

---

## 0 · Preflight (§1)

| verificação | resultado |
|---|---|
| branch | `feat/phase5-5-2-desktop-workspace` |
| commits sobre a base · staged | **0** · **0** |
| HTML de entrada | `cdd2de01c5c766c1647227c383c4edb56914ec5dc2dce969d5bba9d5af043380` · **899.187 bytes** — confere |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` — confere |
| payload M41 | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` — confere |
| manifesto de entrada | `6a44b0bb81438806377fce2bccda1caacdc5febf48d5c67bda6dfae3b969608f` · `sha256sum -c` **158/158 OK** — confere |
| preview `1338` | servia exatamente o HTML de entrada |
| produção `1337` | `200` · 744.179 B · `12bb950f…eebbf9d9` |

Nenhuma identidade material divergiu. Engine, question bank, scoring, schema, owners de sessão,
Target, recomendações e contexto tecnológico ficaram **fora** do delta.

---

## 1 · Escala ultrawide, sem detecção de navegador (§2)

**Nada é detectado e nada é coletado.** Não há leitura de `user-agent`, resolução física,
`devicePixelRatio`, zoom ou telemetria; não há `transform: scale()` no shell nem `zoom`. A única
entrada é a **largura de viewport em CSS px**, que já incorpora o zoom manual do usuário — quem
aplica 125% reduz a viewport em CSS px e **sai** da faixa, que é o comportamento desejado.

**Onde a faixa começa: 2400px**, número fixado por medição e não por gosto. A home era limitada a
1680px de largura útil: isso ocupa 87% da viewport em 1920, **70% em 2400** e **49% em 3440**.
Abaixo de 2400 a composição ainda usa a tela; acima, passa a sobrar moldura.

### 1.1 Home — escala ≈ 1,22

| superfície | 1920 | 3440 | razão |
|---|---|---|---|
| heading principal | 44,00px | 53,68px | 1,22 |
| texto corrido (`lead`) | 16,00px | 19,52px | 1,22 |
| CTA principal — fonte · altura | 15px · 52px | 18,3px · 63px | 1,22 |
| CTA de contexto — altura | 52px | 63px | 1,22 |
| importar sessão — altura | 44px | 54px | 1,22 |
| largura útil (`.wrap`) | 1680px | **2240px** | 1,33 |

Pisos exigidos pela §2.2 em 3440×1392, medidos: heading **53,68px** (≥ 44), texto corrido
**19,52px** (≥ 16), botões **54–63px** (≥ 44). A linha de leitura é limitada em **caracteres**, não
por redução de fonte: o parágrafo do hero mede **~77 caracteres** na faixa (teto do gate: 92).
A divisão do hero passou de 7/5 para **6/6** porque, em 7/5, sobravam mais de 300px de vazio
**interno** ao lado do parágrafo — vazio artificial que a §2.2 proíbe. O rodapé cresce menos que o
corpo e continua assinatura, não conteúdo.

### 1.2 Questionário — escala ≈ 1,10

| superfície | 1920 | 3440 | razão |
|---|---|---|---|
| corpo da pergunta | 34,00px | 37,40px | 1,10 |
| `hint` | 15,00px | 16,50px | 1,10 |
| alternativa — caixa · título | 16px · 15,5px | 17,6px · 17,05px | 1,10 |
| navegação (Voltar/Continuar) | 15px · 48px | 16,5px · 52,8px | 1,10 |

O mapa lateral **não** ganha largura: a coluna permanece no teto de 440px e todo o espaço extra vai
para a pergunta. Em 3440×1392 mapa, pergunta, opções, evidência e navegação continuam
**simultaneamente visíveis** (navegação termina em 1011px de 1392). Nenhuma viewport de 390 a 3440
tem rolagem horizontal.

### 1.3 Ponto de leitura declarado

A §2.3 pede escala de 1,08–1,12 no questionário **e** que ele "não pareça menor que a home". Com a
home em 1,22 e o questionário em 1,10, as duas exigências não podem valer ao mesmo tempo em termos
absolutos: 15px × 1,10 = 16,5px nunca alcança 16px × 1,22 = 19,52px. Prevaleceu a **faixa numérica
explícita** da §2.3, e o piso adotado foi o **corpo canônico da home (16px)** — o questionário não
fica menor do que a home era. Está gateado assim (`P52-UW2`) e listado na §6 como decisão do
proprietário.

---

## 2 · Paridade dos cinco popovers de domínio (§3)

### 2.1 O defeito, medido

Não era cosmético. Medido em Chromium, apontando o **rótulo** de cada domínio:

| domínio | disco | rótulo | miolo da caixa do nó |
|---|---|---|---|
| 1 Negócio | abre | abre | abre |
| 2 Pessoas | abre | abre | abre |
| **3 Processos** | abre | **não abre** | **não abre** |
| 4 Tecnologia | abre | abre | **não abre** |
| 5 Serviços | abre | abre | abre |

Duas causas independentes, ambas materiais:

1. **Área sensível desigual.** Um `<g>` de SVG só responde onde existe geometria **pintada**: o vão
   entre o disco e o rótulo é buraco. Cada domínio acabava com uma área sensível de formato
   diferente — e a de Processos era a pior.
2. **O popover nascia por cima do próprio nó.** Ele era ancorado ao rodapé da caixa do emblema
   (`bottom: 6px`, dentro do desenho). Os dois nós de baixo — Processos e Tecnologia — eram os
   únicos cobertos: ao abrir, o ponteiro passava a estar sobre o popover, `mouseleave` disparava no
   nó e a ajuda fechava sozinha. Daí o "Processos não parece igual aos outros".

E um terceiro, encontrado pelo gate novo em contexto com toque: **nenhum dos cinco abria no
celular**. O navegador sintetiza `mouseenter` antes do `click` do mesmo gesto; com alternância
cega, um toque abria e fechava em sequência.

### 2.2 A correção

- **faixa reservada** abaixo do desenho (`padding-bottom` na caixa do emblema): o popover vive
  fora do SVG e **não encosta em nó, rótulo ou desenho** — os cinco passam a ter a mesma geometria
  de ancoragem (mesma esquerda, mesma largura, mesma base, medidas com tolerância de 1px);
- **retângulo transparente de acionamento** por nó, dimensionado pela caixa real do nó: a área
  sensível passa a ser idêntica nos cinco. É alvo de ponteiro, não desenho — não pinta nada;
- **tolerância de ponteiro**: entrar no próprio popover deixou de contar como saída do nó;
- **toque**: o clique originado de toque, dentro da janela do próprio gesto, apenas **abre**; um
  segundo toque deliberado fecha. Mouse continua alternando como sempre.

Contrato provado nos cinco, em 390, 768, 1920, 2560 e 3440: mesmo componente e mesma apresentação
(classe, largura, padding, tipografia, borda, raio, fundo, sombra, posição, `z-index`, `role`,
cor e entrelinha — assinatura única), mesma associação `aria-describedby`, abertura por ponteiro
(disco, rótulo e miolo), foco, clique, **toque** e `Enter`, `Esc` fechando e devolvendo o foco, um
popover aberto por vez, sem recorte por ancestral ou viewport e sem sobreposição com nó algum.

---

## 3 · Blocker de paginação: a jornada no papel (§4)

### 3.1 A causa raiz

A régua útil do A4 com margens de 12mm mede **~703 CSS px** — **abaixo** do `@media (max-width:720px)`
da camada 4.1, que existe para **celular**. No papel valia, portanto, a regra de telefone:
`.jn-track` virava **coluna** e `.jn-node{flex:0 1 110px}` passava a significar **110px de altura por
estágio**. Seis estágios × 110px + temas = **uma folha inteira** para seis rótulos — e, por ser tão
alto, o bloco se partia entre páginas conforme o conteúdo anterior deslizava.

### 3.2 A correção

No relatório impresso (`#v32-print-report`, sem tocar o print legado) a trilha volta a ser **linha**:
os seis estágios dividem a largura útil, com os nomes em ~8,4pt quebrando dentro da própria coluna —
nada reduzido a tamanho ilegível. O bloco é declarado **atômico** (`break-inside: avoid` no cartão,
`break-after: avoid` no título) e a política "título + primeiro conteúdo juntos" passa a valer para
todo título de seção do relatório.

Efeito medido: a jornada saiu de **uma página inteira** para **~1/4 de página**, e o relatório
completo encolheu **uma página** em cada um dos quatro cenários.

---

## 4 · Provas no PDF real (§4.5)

Quatro PDFs impressos pelo mesmo Chromium dos gates, em A4 com margens de 12mm. As provas examinam
o **arquivo**, não o DOM: texto por página, **caixa de cada palavra** em pontos (`pdftotext
-bbox-layout`) e **cobertura de tinta** da página rasterizada (`pdftoppm -gray`, PGM lido byte a
byte). Sem poppler não há prova — e a ausência é declarada como **falha**, nunca como silêncio.

`P52-PDF4` prova, em cada arquivo: título, **seis estágios**, marcadores de perfil e próximo
estágio e o texto explicativo na **mesma página**; os estágios numa **única fileira** (faixa
vertical ≤ 40pt) **distribuída na horizontal** (≥ 300pt); título acima dos estágios; e a fileira
sem encostar na margem inferior.

`P52-PDF5` prova, página a página dos quatro arquivos: **nada fora da área imprimível**; **nenhum
título de seção isolado no rodapé**; **nenhuma página intermediária quase vazia** (tinta e
caracteres medidos). Registra o **censo completo**: SHA-256 e bytes do PDF, total de páginas e,
por página, tinta, caracteres e o conteúdo inicial e final.

Dois falsos positivos do próprio oráculo foram encontrados e corrigidos antes de qualquer PASS:
a régua da página 1 usa os **mesmos nomes de estágio** da jornada (a prova passou a medir a
fileira, e não a mera presença dos nomes), e a frase "O contexto tecnológico declarado foi
considerado…" da leitura executiva era confundida com o **título** homônimo (um título passou a
exigir linha própria, sem palavra estranha na linha).

---

## 5 · Mutantes novos — nenhum vacuoso

| mutante | o que reintroduz | gate que reprova | motivo observado |
|---|---|---|---|
| `P52-ER1` | desliga a ampliação ultrawide da home | `P52-UW1` | superfícies escalando 1× |
| `P52-ER2` | desliga a ampliação ultrawide do questionário | `P52-UW2` | superfícies escalando 1× |
| `P52-ER3` | solta a linha de leitura do parágrafo | `P52-UW1` | linha de leitura fora da faixa de caracteres |
| `P52-ER4` | troca largura fluida por largura fixa | `P52-UW1` | rolagem horizontal em 2560px |
| `P52-ER5` | tira a área sensível **só de Processos** | `P52-POP2` | "domínio 2 não abre ao apontar o miolo" |
| `P52-ER6` | dá a **Processos** popover com outra apresentação | `P52-POP1` | "2 apresentações diferentes entre os cinco" |
| `P52-ER7` | devolve a jornada empilhada no papel | `P52-PDF4` | "apenas 2 de 6 estágios numa mesma fileira" |
| `P52-ER8` | permite título de seção órfão | `P52-PDF5` | "título 'Resumo de maturidade' isolado no rodapé" |

Os dois mutantes de §3 isolam **exatamente um domínio** e o gate nomeia o domínio e a propriedade
divergente, como a errata exige.

---

## 6 · Arquivos alterados nesta errata

| arquivo | natureza da mudança |
|---|---|
| `ui_p52_workspace_v32.css` | faixa ultrawide (§2), faixa reservada e área sensível do popover (§3), jornada horizontal e atômica no papel + política de título no papel (§4) |
| `ui_p52_workspace_v32.js` | retângulo transparente de acionamento por nó, tolerância de ponteiro entre nó e popover, e clique originado de toque que abre sem fechar |
| `tests_p52_chromium.js` | **7 gates novos** (`P52-UW1/2/3`, `P52-POP1/2`, `P52-PDF4/5`), leitor de PDF por caixa de palavra e por tinta, e impressão do PDF também sob supressão de evidência |
| `tests_p52_layout.js` | `P52-DOC2` — preferências de impressão e jornada atômica declaradas no manual |
| `tests_p52_mutants.js` | **8 mutantes novos** (`P52-ER1`…`P52-ER8`) |
| `tools_p52_shots.js` | cenas próprias da errata: os cinco popovers e a faixa ultrawide em 3440×1392 |
| `USER_GUIDE.md` | §12.1 — preferências de impressão (§4.4) |
| `docs_phase5/evidence_p52/` | acervo regenerado: 105 capturas, 4 PDFs reais e 12 páginas rasterizadas |
| `docs_phase5/MANIFEST_PHASE5_P52.sha256` | regenerado por último |
| `quickscan_secops_soccmm_v3_2_dev.html` | derivado do build determinístico |

**Não foram tocados:** `engine_v32.js`, cálculo, `stageOf()`, thresholds, M41, question bank,
owners de resposta e de sessão, schema, Target, conteúdo tecnológico e recomendações, `ui_v32.js`,
`ui_ux_v32.js`, `ui_journey_v32.js`, `ui_session_v32.js`, `ui_icons_v32.js`, `ui_v32.css`,
`ui_ux_v32.css`, `ui_p50_shell_v32.js`, `ui_p50_v32.css`, `build_v32_html.py`, `package.json`,
`deploy/`, `AGENTS.md`, `MANIFEST.sha256` e o acervo histórico `docs_phase5/evidence_p50/`
(conferido byte a byte ao final: **0 arquivos alterados, 0 arquivos novos**).

---

## 7 · Resultados — execução serial, com códigos de saída próprios

| suíte | comando | exit | resultado |
|---|---|---|---|
| build | `python3 build_v32_html.py` | **0** | determinístico — duas execuções, mesmo SHA |
| engine | `node tests_m42_m86.js` | **0** | 105 PASS · 0 FAIL |
| UI 3.1 · 3.2 · 3.3.1 | `tests_ui_m31/m32/m33.js` | **0** · **0** · **0** | 19 · 25 · 11 |
| UI 3.3.2 (PDF) · 3.3.3 | `tests_ui_m332/m333.js` | **0** · **0** | 23 · 26 |
| UX 4.1 | `node tests_ux_m41.js` | **0** | 56 PASS |
| Target 4.3.1 · Refinamento 4.4 | `tests_target_m431/ref_m44.js` | **0** · **0** | 30 · 28 |
| Jornada 4.5 · Ícones 4.6 · UNSET | `tests_journey_m45/icons_m46/unset_ug.js` | **0** · **0** · **0** | 31 · 12 · 13 |
| P50/P51 core · Chromium | `tests_p50_core/p50_chromium.js` | **0** · **0** | 64 · 27 |
| **P52 layout** | `node tests_p52_layout.js` | **0** | **35 PASS · 0 FAIL** (34 + `P52-DOC2`) |
| **P52 Chromium** | `node tests_p52_chromium.js` | **0** | **33 PASS · 0 FAIL** (26 + 7 da errata) |
| Sessão 4.8 | `node --max-old-space-size=4608 tests_session_m48.js` | **0** | 97 PASS · 0 FAIL |
| M41 | `node harness_m41_v313.js … --compare` | **0** | PASS — payload idêntico ao baseline |
| Visual congelado | `npx playwright test` | **0** | 67 passed · 0 failed · 37 skipped |
| **Mutação P52** | `node tests_p52_mutants.js` | **0** | **47/47** detectados pelo gate **e** pelo motivo esperados |

A campanha de mutação rodou sozinha e em série; ao final, restauração byte-idêntica de todos os
fontes tocados e do HTML, com o acervo de evidência conferido arquivo a arquivo (131 arquivos).

### 7.1 Defeito encontrado pelo próprio gate durante a rodada

A primeira tentativa de reduzir o vazio interno do hero redividiu a composição em 6+6. O gate
`P52-HOME1`, aprovado na REV B, reprovou: **a proporção 7+5 é contrato aprovado** e esta errata não
o reabre. A mudança foi **desfeita** — o ganho de espaço vem da largura útil (1680 → 2240px) e da
escala, não de redividir o hero. Nenhum gate foi enfraquecido para obter verde.

---

## 8 · Hashes e identidade dos PDFs

| artefato | SHA-256 |
|---|---|
| **HTML candidato** (912.961 bytes) | `1c51810eca4786483826e7f1592965833758e864a9ead97373923ecd7c5f6dca` |
| **`engine_v32.js`** | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` (byte-idêntico ao core) |
| **payload funcional M41** | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` (byte-idêntico ao core) |
| `ui_p52_workspace_v32.js` | `2b1a46c486e87bdb9875caed7eb2d36530f2d31b673c42ed8747c1b7100ce8dc` |
| `ui_p52_workspace_v32.css` | `374faf9ab9a324633cf9b1e3516de4d63026719b9ce48e8471a5e207786fd4df` |

**PDFs reais** — impressos pelo mesmo Chromium dos gates, A4, margens de 12mm:

| arquivo | páginas | jornada | bytes | SHA-256 |
|---|---|---|---|---|
| `P52-pdf-bloqueado.pdf` | 7 | p5 | 155.837 | `195655221fdf990396bb9a29b47a8f8c732bb71b58d1f6854f17c430d5f184b0` |
| `P52-pdf-fronteira.pdf` | 12 | p9 | 364.842 | `b422a0dcd1825df30585cbbce9c8400aa6d919bc1879bf6a3717c5361de08622` |
| `P52-pdf-suficiente-3prioridades.pdf` | 11 | p9 | 379.362 | `b1d5f5a76ac21cd3a93afae6e346958faa0a25a2d8ed9f2cda4a5e39b281be10` |
| `P52-pdf-suficiente-sem-prioridade.pdf` | 12 | p9 | 364.713 | `b0b944fa1c325f68e75eef82f715ae6c7bb1a65aad0d286d38d9a18efb7174fe` |

O censo completo por página — tinta, caracteres, conteúdo inicial e final — está em
`docs_phase5/evidence_p52/P52-pdf-paginacao.json`.

---

## 9 · Evidência e preview

- `docs_phase5/evidence_p52/INDEX.md` — **105 capturas** em 1440×900, 1920×1080, 2560×1440,
  3440×1440, 390×844, mais as cenas próprias da errata: **um arquivo por domínio** com o popover
  aberto (`P52-ER-popover-dominio-0…4-1920x1080.png`) e a faixa ultrawide em **3440×1392**
  (`P52-ER-ultrawide-home` e `P52-ER-ultrawide-pergunta`);
- `docs_phase5/evidence_p52/pdf/` — **4 PDFs reais** e **12 páginas rasterizadas**: páginas 1 e 2 de
  cada arquivo mais **a página da jornada**, que é o objeto do blocker;
- medições dos gates: `P52-UW1-home-scale.json`, `P52-UW2-question-scale.json`,
  `P52-UW3-degradacao.json`, `P52-POP1-parity.json`, `P52-POP2-interacao.json` e
  `P52-pdf-paginacao.json`.

**Preview local: <http://127.0.0.1:1338/>** — serve exatamente o HTML candidato acima.
**Produção `127.0.0.1:1337` intacta:** `200` · 744.179 bytes · `12bb950f…eebbf9d9`, os mesmos bytes
observados antes desta rodada. Tailscale, tags, releases e `deploy/` não foram tocados.
**Branch `feat/phase5-5-2-desktop-workspace` · 0 commits · 0 staged.**

---

## 10 · Pontos que dependem da decisão do proprietário

1. **Início da faixa ultrawide em 2400px.** A errata pedia um número medido entre 2400 e 2560;
   ficou no piso da faixa, para que monitores de 2560 já recebam a ampliação. Subir para 2560
   deixaria a 2560 fora da faixa.
2. **Escala do questionário × escala da home** (§1.3): prevaleceu a faixa numérica 1,08–1,12 da
   §2.3, com piso no corpo canônico da home (16px). Se o proprietário quiser o questionário no
   mesmo tamanho absoluto da home ampliada, é outra decisão — e contraria a faixa da própria §2.3.
3. **Proporção 7+5 do hero** mantida por ser contrato aprovado na REV B (§7.1). Se o proprietário
   quiser 6+6 na faixa ultrawide, o gate `P52-HOME1` precisa ser reancorado por decisão explícita.
4. **Distância do popover ao trigger.** Os cinco popovers têm a MESMA geometria — mesma caixa,
   mesma largura, mesma base, mesma distância do emblema. Uma distância constante em relação a
   **cada nó** é geometricamente incompatível com "não sobrepor nó nem rótulo vizinho" no tamanho
   atual do emblema: um popover legível não cabe entre o anel e a borda do desenho. Preferiu-se a
   identidade do componente. Ancorar por nó exigiria encolher emblema e popover.
5. **Ajuda das capabilities no toque.** A correção de toque foi aplicada apenas aos cinco popovers
   de domínio, que são o escopo da §3. Os botões de ajuda `i` do editor de contexto usam o mesmo
   padrão e têm o mesmo comportamento em telas de toque; corrigi-los é uma decisão fora desta
   errata.
6. **Última página com apenas o rodapé** em alguns cenários (por exemplo, `P52-pdf-bloqueado`).
   O gate proíbe página **intermediária** quase vazia, que é o que a errata pede; a página final
   curta permanece registrada no censo para a leitura do proprietário.
