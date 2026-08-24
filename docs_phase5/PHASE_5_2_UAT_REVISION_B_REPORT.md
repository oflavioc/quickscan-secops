# Phase 5.2 — Revisão B da UAT visual

**Revisão final da candidata Phase 5.2 durante a UAT visual.** Não cria fase nova e não reabre
cálculo ou metodologia. Branch `feat/phase5-5-2-desktop-workspace`, **0 commits**.
Documento aplicado: `AJUSTE_UAT_VISUAL_PHASE_5_2_REV_B.md`
· SHA-256 `01e6e4a678964576543353f52ee648466d2a51933deee74f6784e31c12612dad` · 23.167 bytes ·
720 linhas · UTF-8 sem BOM · zero CRLF — conferido antes de qualquer edição.

Complementa `PHASE_5_2_DESKTOP_WORKSPACE_REPORT.md` e `PHASE_5_2_UAT_REVISION_A_REPORT.md`, que
permanecem válidos para tudo o que a REV B não substituiu. Este relatório **não declara a fase
concluída** e **não contém autoauditoria**.

---

## 0 · Preflight (§0)

| verificação | resultado |
|---|---|
| branch | `feat/phase5-5-2-desktop-workspace` |
| commits na branch · staged | **0** · **0** |
| HTML de entrada (REV A) | `df3cfe574a724fced98d1503e52ca4d6b82d419e471eb49913303588ec978af4` · 860.622 B |
| manifesto corrente | `72fe10ef…3fb7aaa` · 103 entradas · `sha256sum -c` **103/103 OK** |
| SHA servido em `127.0.0.1:1338` | `df3cfe57…c978af4` — idêntico ao HTML de entrada |
| produção `127.0.0.1:1337` | `200` · 744.179 B · `12bb950f…eebbf9d9` — baseline anterior |
| `engine_v32.js` | `9a4a2e67…2b5d247a` — conforme esperado |
| payload M41 | `9794b267…3ed4365b` — conforme esperado |

Nenhum ajuste aprovado da REV A foi revertido. A candidata seguiu de onde parou.

---

## 1 · O que a REV B mudou

### 1.1 HOME-B — hero, emblema, CTAs e rodapé

- **emblema ~25% maior** (box de 540px em 1920+, dentro da faixa 430–560 pedida), proporcional em
  1440 e mobile, sem clipping de rótulo;
- **explicação por domínio**: cada nó é um controle focável (`tabindex`, `role=button`,
  `aria-expanded`, `aria-describedby`) que abre por hover, foco e clique/toque, fecha com `Esc` e
  respeita um popover por vez. Os cinco textos são os exigidos pela §2.2. Continua **estático**: não
  representa score, estágio nem estado da avaliação;
- **disclaimer consolidado**: o card intermediário saiu do hero. Todos os itens que ele carregava já
  viviam no rodapé; o único que não vivia — o framework ser **aberto e neutro de fabricante** — foi
  acrescentado lá. A mensagem deixou de aparecer duas vezes;
- **CTAs equivalentes lado a lado**: `Começar o quickscan` em vermelho preenchido e
  `Adicionar contexto tecnológico · opcional` em azul preenchido (token `--ftnt-blue`), mesma altura
  (52px), mesmo padding, mesmo raio e `min-width` comum de 300px. `Importar sessão` logo abaixo.
  No mobile empilham em largura total;
- **crédito pessoal como marca d'água**: dois níveis tipográficos abaixo do rodapé, em `--faint`,
  sem traço decorativo, mantendo nome, função e contato.

### 1.2 CTX-B — comportamento e composição do editor

- ao entrar, **apenas `SOC & Operations`** fica aberto; as demais famílias vêm recolhidas e o que já
  foi preenchido sobrevive a fechar e reabrir;
- **acento lateral** do grupo ativo restaurado em azul de ação de contexto, com fundo e borda
  próprios. Grupos fechados ficam neutros. Nenhuma cor de domínio é usada para famílias que não são
  domínios, e o pill `ABERTO/FECHADO` **não** voltou;
- **ordem dentro da capability**: nome e explicação, situação declarada, tecnologias declaradas,
  `+ Adicionar tecnologia` e só então o **Contexto complementar da capability · opcional** — que
  antes vinha antes das tecnologias e com o rótulo "Motivo declarado para aprofundamento";
- **Salvar** e **Cancelar** com a mesma altura, mesmo `min-width` e mesma barra; vermelho preenchido
  × contornado.

### 1.3 HELP-B — glossário de arquitetura, dados e IA

Controle `i` acessível também nos seis campos de arquitetura, nas famílias de plataformas e de
requisitos e em **todos os oito sinais de IA**. A distinção obrigatória da §4.2 está escrita:
**processamento local** trata do local e do modelo operacional; **residência de dados** trata de
jurisdição e regulação. Os rótulos de IA passaram a ser distinguíveis
(`Aplicações corporativas de IA (copilots e chatbots)` × `Agentes autônomos de IA`, entre outros)
**sem alterar um único ID interno** — o schema e o round-trip de sessão seguem intactos.

### 1.4 COPY-B — linguagem de negócio

"mandato" e "charter" saíram de tudo o que o usuário e o cliente leem: pergunta, alternativas, ajuda,
prioridades, gaps, recomendações, cenário-alvo, PDF, manual e README. A substituição é de
**apresentação**: `QS[0].id` continua `mandate`, `QS[0].lbl` continua `Mandato e objetivos` e o
payload M41 continua byte-idêntico. O mapa é **fechado, ordenado e público**
(`window.__P52.copyMap()`), e por isso os gates que comparam texto canônico com texto exibido
aplicam a mesma transformação declarada em vez de aceitar divergência.

O travessão deixou de ser separador padrão em frases de sistema. Notas digitadas pelo usuário,
citações legais, atribuições e o sinal `Current × Target` **não** são tocados: a guarda recusa
qualquer nó dentro de campo de formulário, de nota da sessão ou do rodapé literal.

### 1.5 EVID-B — campo de evidência

A ordem passou a ser **rótulo → "O que registrar:" → textarea**, e o exemplo específico da pergunta
virou o **placeholder** do campo: some ao digitar, não é valor salvo e não aparece mais duplicado
abaixo. As 15 orientações foram normalizadas (não repetem "Registre" depois de "O que registrar:") e
o exemplo de MSSP/SLA continua exclusivo da cobertura de monitoramento.

### 1.6 EXEC-B — resultado e leitura

- **radar**: mantém exatamente a geometria do gate visual congelado **V1** até 1920px (420px de 1200
  a 1499; 460px a partir de 1500 — já dentro da faixa 440–540 da §7.1) e cresce para **520px a
  partir de 2200px**, onde V1 não mede e há largura de sobra. Valores, vértices, Target e UNSET
  intocados;
- **score** entre **80 e 112px** no desktop amplo, reduzindo nos breakpoints menores;
- **"Para avançar"** com bullets de 18px e entrelinha 1.6; **leitura executiva** com corpo de 17px,
  entrelinha 1.75 e parágrafos distribuídos.

### 1.7 SUPPORT-B — links e sistema único

Toda oferta e todo serviço com **URL canônica cadastrada** passou a mostrar `Página oficial ↗`, com
`target="_blank"` e `rel="noopener"` na tela e o endereço legível no papel. Sem URL, nenhum link é
inventado. Os dois conjuntos de cards passaram a compartilhar tile, título, tipografia, posição do
contexto e posição do link; a diferença semântica é dita por **badge textual**.

### 1.8 SUFF-B — suficiência fora do resultado do cliente

Com o resultado **liberado**, "Qualidade da evidência · Suficiente" saiu da narrativa principal e do
menu lateral; o que resta é a **Base de evidência da sessão**, em disclosure, dentro de
*Relatório e sessão*. No PDF, o KPI `Suficiência da sessão: adequada` foi substituído por
`Respostas confirmadas`, e a rastreabilidade fica na linha `Cobertura da evidência` dos metadados.
Com o resultado **insuficiente**, nada disso muda: painel completo, item no menu lateral, resultado
bloqueado. **O gate canônico não foi alterado.**

### 1.9 DOM-B — largura do painel

`#p50-results` e `#p50-suff` perdiam a faixa por um `max-width:820px` herdado da Camada 5.0. Dentro
do workspace o teto saiu: o painel passa a ocupar **100%** da seção (critério da §10: ≥80%), o heat
map usa a grade completa e *Pontos fortes* × *Prioridades de evolução* ficam em 5+7. Os limites de
leitura continuam nos textos internos.

### 1.10 PDF-B — primeira página, régua, quebras e ícones

- **abertura única**: a marca aparecia duas vezes seguidas no topo. Ficou só na capa; o cabeçalho
  passou a levar apenas a **faixa dos cinco domínios**, agora ocupando **100%** da largura útil;
- **ordem da página 1**: capa e metadados → *Como interpretar este relatório* → *Resumo de
  maturidade* com a régua. A orientação passou a vir **antes** dos números;
- **prioridades abrem a página 2** (`break-before: page`), com `break-after: avoid` nos headings e
  `break-inside: avoid` nos cards;
- **régua** de ponta a ponta, com marcador no **vermelho de marca** (nunca cor de domínio), rótulo
  **"Você está aqui"** alinhado ao marcador e posição derivada **estritamente** do score já
  arredondado para exibição. Sem suficiência não há marcador algum: `n/d` nunca é desenhado como
  zero;
- **ícones no papel** a 11mm, com `print-color-adjust: exact`, fundo branco explícito, proporção
  preservada e fallback de iniciais quando não há asset.

### 1.11 Defeitos materiais achados na prova de PDF real — e corrigidos

A REV B exige provas de PDF **real**. Gerado o PDF e rasterizada a página 1 (`pdftoppm`), a
inspeção da imagem expôs dois defeitos que **nenhum gate existente pegava**, porque todos mediam o
DOM e o DOM estava correto:

| defeito | causa raiz | correção | gate que passou a pegar |
|---|---|---|---|
| rótulos do emblema da capa cortados — o papel mostrava "ições" e "Pes" no lugar de "Serviços" e "Pessoas" | `qsPentagonSVG()` desenhava num `viewBox` quadrado `0 0 100 100` enquanto os rótulos laterais viviam em `x=89`/`x=11` com `text-anchor` para fora; o SVG recortava o que passava da caixa | o `viewBox` ganhou calha lateral (`-25 2 150 96`) e os rótulos, folga real em relação aos nós. Geometria de desenho apenas — nós, cores e numeração intactos | `P52-PDF2` mede, para cada rótulo, se ele sai da caixa do SVG **ou** se cobre um nó |
| "Você está aqui" não chegava ao papel, e a haste do marcador apagava a letra do estágio dentro da faixa | `.pr-rl-track` herda `overflow:hidden` da régua congelada — o rótulo é posicionado em `top:100%`, fora da pista, e era recortado; além disso a regra congelada `.pr-rl-mark{border-left:3px solid #111}` pintava **por cima** do fundo de marca, devolvendo um traço preto | na camada 5.2: pista com `overflow:visible`, haste **abaixo** da pista (com seta apontando para a faixa), borda herdada zerada e folga vertical para o rótulo | `P52-PDF2` reprova se o rótulo for recortado por ancestral, se rótulo ou haste cruzarem o texto da régua, ou se a borda pintar sobre a cor de marca |

Quatro mutantes novos (`P52-RB15`…`P52-RB18`) reintroduzem exatamente cada uma dessas condições e
são detectados pelos motivos esperados. Nenhum gate foi relaxado: os dois casos entraram como
asserção **adicional** no `P52-PDF2`.

---

## 2 · Arquivos alterados nesta revisão

| arquivo | natureza |
|---|---|
| `ui_p52_workspace_v32.js` | mapa COPY-B público, glossário de domínios e de arquitetura/IA, hero com CTAs, popovers do emblema, base de evidência em Relatório e sessão, marcação de ícones |
| `ui_p52_workspace_v32.css` | emblema, CTAs, watermark, acento do grupo ativo, ordem do editor, largura do painel de domínios, radar e tipografia executiva, sistema único de cards, bloco de print da REV B |
| `ui_v32.js` | estado inicial dos accordions, ordem interna da capability, rótulos de IA, links oficiais, KPI do relatório, abertura única, régua com "Você está aqui", prioridades na página 2 |
| `ui_p50_shell_v32.js` | "O que registrar" antes do campo, exemplo como placeholder, linguagem de direcionamento |
| `tests_p50_core.js` | repin de `ui_v32.js`; `P50-UX1`, `P51-UX2`, `P51-UX3`, `P51-DOC7`, `P51-DOC12` e `P51-DOC13` atualizados às decisões da REV B |
| `tests_p50_chromium.js` | `ACEITE-UX-5.0.3` passa a medir sobreposição real, em vez de ordem vertical |
| `tests_p52_layout.js` | 10 gates novos e 3 reescritos |
| `tests_p52_chromium.js` | 4 gates novos, `P52-PR1` e `P52-EXEC1` reescritos, PDFs reais |
| `tests_p52_mutants.js` | 18 mutantes novos (14 da REV B + 4 dos defeitos de PDF real) |
| `tools_p52_shots.js` | cenas da REV B |
| `USER_GUIDE.md`, `README.md` | abertura, editor, glossário, ordem do relatório e terminologia |
| `docs_phase5/evidence_p52/` | acervo regenerado, com `pdf/` |
| `quickscan_secops_soccmm_v3_2_dev.html` | derivado do build determinístico |

**Não foram tocados:** `engine_v32.js`, o HTML-base congelado, `ui_ux_v32.js`, `ui_target_v32.js`,
`ui_refinement_v32.js`, `ui_journey_v32.js`, `ui_session_v32.js`, `ui_icons_v32.js`, `ui_v32.css`,
`ui_ux_v32.css`, `ui_p50_suff_v32.js`, `ui_p50_results_v32.js`, `ui_p50_v32.css`, `fixtures_p50.js`,
`generate_icons_v32.py`, `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json`,
`tests_unset_ug.js`, `MANIFEST.sha256`, `deploy/`, `AGENTS.md` e o acervo `evidence_p50/`.

### 2.1 Gates atualizados — com registro

| gate | por quê |
|---|---|
| `P50-UX1` | a alternativa passou a ser reescrita na apresentação; o oráculo aplica a MESMA transformação pública ao valor canônico antes de comparar |
| `P51-UX2` | o exemplo migrou para o placeholder; o gate lê o placeholder e passa a **reprovar** se a linha duplicada voltar |
| `P51-UX3` | título de apresentação passou a "Direcionamento e objetivos"; o gate agora também reprova qualquer jargão remanescente |
| `P51-DOC7` | o verbete do glossário passou a ser "direcionamento formal"; o gate reprova se "mandato"/"charter" reaparecerem no manual |
| `P51-DOC12` / `P51-DOC13` | a orientação passou a vir antes do resumo; a adjacência continua exigida |
| `ACEITE-UX-5.0.3` | media "suficiência acima do resultado"; passou a medir **interseção real** de retângulos, que é a propriedade que sempre quis medir |
| `P52-PR1` | o relatório foi reestruturado por decisão do proprietário; o contrato deixou de ser igualdade textual e passou a exigir **nenhuma seção perdida**, **fatos do anexo idênticos** e as proibições da REV B |
| `P52-EXEC1` | limites de score e radar atualizados aos da REV B |
| `P52-HOME1` / `P52-SUFF1` | acompanham as decisões §2.4 e §9 |

Nenhum gate foi enfraquecido para obter verde.

---

## 3 · Pontos que ainda dependem de decisão do proprietário

1. **Radar acima de 1920px** — a faixa 440–540 da §7.1 é cumprida com 460px em 1920 e 520px a partir
   de 2200px. Ampliar também em 1440/1920 exigiria alterar o gate visual **congelado V1**, o que a
   REV B não autoriza expressamente. Se o proprietário quiser o radar maior já em 1920, isso precisa
   ser dito e o V1 reancorado.
2. **Travessões remanescentes** — a redução foi feita por mapa fechado nas frases de sistema. Os
   travessões que sobram estão em atribuição/licença, em nomes próprios e em textos congelados do
   question bank que a REV B não listou. Uma varredura mais ampla mudaria conteúdo canônico.
3. **Exceção óptica dos artworks panorâmicos** (FortiXDR e FortiAI-Assist), herdada da REV A e não
   alterada aqui.
4. **Heap da suíte de sessão** em 4608 MB, herdado da REV A.

5. **Emblema da capa do PDF** — a correção do recorte alargou a caixa de desenho e afastou os
   rótulos dos nós. A composição ficou mais larga do que a original; se o proprietário preferir
   rótulos menores em vez de caixa mais larga, é decisão dele e muda `qsPentagonSVG()`.
6. **Marcador da régua abaixo da pista** — a haste passou a sair por baixo da faixa, com seta
   apontando para cima e o rótulo logo abaixo. A alternativa (haste atravessando a faixa) foi
   descartada porque apagava a letra do nome do estágio impresso.
7. **Prioridades truncadas em 72 caracteres no PDF** — na página 2, duas das três prioridades saem
   com reticências ("…"). Isso vem de `qLabel()`, comportamento **anterior à Phase 5.2** e não
   listado pela REV B. Mostrar a pergunta inteira é possível, mas altera uma função da camada 4.x
   fora do que esta revisão autoriza: fica registrado como decisão do proprietário, não corrigido
   por conta própria.

---

## 4 · Resultados dos testes — execução final, com códigos de saída próprios

Todas as suítes rodaram **serialmente**, sobre o mesmo HTML determinístico entregue abaixo.

| suíte | comando | exit | resultado |
|---|---|---|---|
| build | `python3 build_v32_html.py` | **0** | build determinístico (duas execuções, mesmo SHA) |
| engine | `node tests_m42_m86.js` | **0** | 105 PASS · 0 FAIL de 105 |
| UI 3.1 | `node tests_ui_m31.js` | **0** | 19 PASS · 0 FAIL |
| UI 3.2 | `node tests_ui_m32.js` | **0** | 25 PASS · 0 FAIL |
| UI 3.3.1 | `node tests_ui_m33.js` | **0** | 11 PASS · 0 FAIL |
| UI 3.3.2 (PDF) | `node tests_ui_m332.js` | **0** | 23 PASS · 0 FAIL |
| UI 3.3.3 | `node tests_ui_m333.js` | **0** | 26 PASS · 0 FAIL |
| UX 4.1 | `node tests_ux_m41.js` | **0** | 56 PASS · 0 FAIL |
| Target 4.3.1 | `node tests_target_m431.js` | **0** | 30 PASS · 0 FAIL |
| Refinamento 4.4 | `node tests_ref_m44.js` | **0** | 28 PASS · 0 FAIL |
| Jornada 4.5 | `node tests_journey_m45.js` | **0** | 31 PASS · 0 FAIL |
| Ícones 4.6 | `node tests_icons_m46.js` | **0** | 12 PASS · 0 FAIL |
| UNSET geometry | `node tests_unset_ug.js` | **0** | 13 PASS · 0 FAIL |
| P50/P51 core | `node tests_p50_core.js` | **0** | 64 PASS · 0 FAIL |
| P50/P51 Chromium | `node tests_p50_chromium.js` | **0** | 27 PASS · 0 FAIL |
| **P52 layout** | `node tests_p52_layout.js` | **0** | **34 PASS · 0 FAIL** |
| **P52 Chromium (inclui as provas de PDF real)** | `node tests_p52_chromium.js` | **0** | **26 PASS · 0 FAIL** |
| Sessão 4.8 | `node --max-old-space-size=4608 tests_session_m48.js` | **0** | 97 PASS · 0 FAIL |
| M41 | `node harness_m41_v313.js … --compare` | **0** | PASS — payload funcional idêntico ao baseline |
| Visual congelado | `npx playwright test` | **0** | 67 passed · 0 failed · 37 skipped |
| **Mutação P52** | `node tests_p52_mutants.js` | **0** | **39/39 mutantes detectados pelo gate E pelo motivo esperados** |

A campanha de mutação rodou **sozinha e em série**; ao final, restauração byte-idêntica de todos os
fontes tocados e do HTML, e o acervo de evidência conferido arquivo a arquivo.

---

## 5 · Hashes da entrega

| artefato | SHA-256 |
|---|---|
| **HTML candidato** `quickscan_secops_soccmm_v3_2_dev.html` (899.187 bytes) | `cdd2de01c5c766c1647227c383c4edb56914ec5dc2dce969d5bba9d5af043380` |
| **`engine_v32.js`** | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` |
| **payload funcional M41** | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` |
| HTML-base congelado `quickscan_secops_soccmm_v3_1_3.html` | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| `ui_v32.js` | `0fdf6f5bbffd3adb043817a30212be0cc3b6d564de4c8eaf4677955d93173677` |
| `ui_p52_workspace_v32.js` | `bb5de8ee4d4eedfbbfc30d2af20840b7de8286e046288eeecfc294b806567f29` |
| `ui_p52_workspace_v32.css` | `1dfa12b257a02925adb75674e915e99fd7118a26cf7b884ba7f299674f23bd2c` |
| `ui_p50_shell_v32.js` | `e28a21733564e1a222cefa82fb848f569e3a50b6ddda8c447d2ad52b436a58a3` |
| `ui_journey_v32.js` | `a30db1ce94bf06b14a46ab1d41881f2fe2561c8c85a531862843eabe6bc2c15d` |

**Engine e payload M41 permanecem byte-idênticos ao core 4.8.0.7.** O build é determinístico: duas
execuções consecutivas de `build_v32_html.py` produziram o mesmo SHA.

---

## 6 · Evidência

- `docs_phase5/evidence_p52/INDEX.md` — 98 capturas em 1440×900, 1920×1080, 2560×1440, 3440×1440 e
  390×844, mais os JSON de medição dos gates;
- `docs_phase5/evidence_p52/pdf/` — **4 PDFs reais** impressos pelo mesmo Chromium dos gates, em A4
  com margens de 12 mm, e as **páginas 1 e 2 rasterizadas** de cada um, para leitura direta do papel:
  `P52-pdf-suficiente-3prioridades.pdf` (380.074 B), `P52-pdf-suficiente-sem-prioridade.pdf`
  (365.249 B), `P52-pdf-fronteira.pdf` (365.216 B) e `P52-pdf-bloqueado.pdf` (157.643 B).

Foi a leitura dessas rasterizações — e não o DOM — que expôs os dois defeitos da §1.11.

---

## 7 · Onde ver

**Preview local: <http://127.0.0.1:1338/>** — serve exatamente
`cdd2de01c5c766c1647227c383c4edb56914ec5dc2dce969d5bba9d5af043380` (899.187 bytes, conferido por
`curl` + `sha256sum`).

**Produção `127.0.0.1:1337` intacta:** `200` · 744.179 bytes ·
`12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9` — byte a byte o mesmo binário do
início da rodada. Tailscale Serve, Funnel, tags e releases não foram tocados.

**Branch `feat/phase5-5-2-desktop-workspace` · 0 commits · 0 staged.** Nenhum commit, push, PR,
merge, tag, release, freeze, deployment ou promoção para produção foi realizado. `evidence_p50/`,
`AGENTS.md`, `deploy/` e `MANIFEST.sha256` permanecem intocados.
