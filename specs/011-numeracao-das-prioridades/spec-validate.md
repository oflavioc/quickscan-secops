# Spec-validate — 011-numeracao-das-prioridades

> Fase 6 · T026 (parte `spec-validate`) · **somente leitura** · 2026-08-31.
> Executado no HEAD `27aabe9`, worktree `phase5-011`, árvore limpa, contra a
> [spec.md](spec.md) aprovada (`5b529c9`) com a errata da Fase 2 (`4db6583`).
> **Registro escrito pelo `doc-writer`.** A skill nomeia o `qa-engineer` como
> executor: nenhum veredito de gate abaixo é meu — cada linha cita execução ou
> registro canônico, e o único gap encontrado é devolvido ao orquestrador para
> decisão, não consertado aqui (R10 §1: afrouxar não é opção).

## Método

Cada exigência verificável da spec foi conferida **na implementação real** — source
lido e gate executado —, nunca no relatório de quem implementou (R2 §2/§4). As
execuções desta validação, todas em 2026-08-31, node v24.19.0 · python 3.14.7 ·
jsdom 30, com `git status --porcelain` vazio antes e depois:

- `tests_011_prioridade.js` direto: **6 PASS · 0 FAIL de 6**;
- stages `env-doctor` (0 FAIL · 1 WARN nomeado), `baseline` (**281/281 · 0
  divergentes · 0 ausentes · 0 sem pin**), `boundary` (9/9), `marker-lint` (38),
  `icons-check` (OK), `build` (byte-idêntico, árvore inalterada), `lint-arch` (0),
  `state` (8 demandas · 0), `tdd` (8 demandas · 0 waivers · 0), `m41` (payload
  `9794b267e4225d8f…` == pin declarado), `suites` (17 suítes nas contagens
  canônicas), `suites-heavy` (session 97/0), `evidence-bridge` (0 FAIL · 0 WARN);
- `mutation`: **1 campanha executada · 0 problemas** — `d011` **19 DETECTADO ·
  0 SOBREVIVENTE · 0 NÃO EXECUTADO de 19**, `IC-4` com **19 âncoras
  `ocorrencias == 1`**, restauração do source e do HTML byte a byte OK;
- `compliance-audit.sh`: **13 PASS · 0 FAIL**;
- diffs por `git diff` contra o merge-base **`86a4f1e`** (`origin/develop`).

**Não executado, declarado**: `tests_011_chromium.js` (`D011-CON1`) e `D011-M9` —
sem Chromium nesta worktree (KI-3); a suíte, invocada aqui, termina **0 PASS ·
1 FAIL** com o motivo nomeado, nunca em SKIP silencioso (R10 §2).

## Itens — veredito um a um

| # | Exigência (spec) | Verificação | Veredito |
|---|---|---|---|
| 1 | **C1** · todo glifo numérico exibido é atalho que funciona; oráculo recalcula a ordem **do vetor da fixture**, sem `computeFindings()` | `D011-KEY1` PASS na execução de hoje; source do oráculo confere (sev desc → lvl asc → k asc); carrascos `D011-M2` (renumerar pela posição visual) e `D011-M8` (mapeamento tecla→finding, em worktree efêmera sobre a Camada 1) **DETECTADOS**, alíneas (c) e (d) | **conforme** |
| 2 | **C2** · item sem atalho não exibe glifo; `.key` permanece no DOM em 15/15; `1..9` intactos nos índices 0..8 | `D011-KEY2` PASS; `D011-M1` (restaurar o `·`) DETECTADO em (c); **prova de desenho**: `KEY1` sobreviveu ao `M1` e `KEY2` sobreviveu ao `M20`, como exigido — tela e papel não medem a mesma coisa | **conforme** (alínea (b) sem mutante plausível, declarada — ver §Dívidas) |
| 3 | **C3** · `aria-hidden` em todo `.key`; `aria-keyshortcuts` no botão de índice < 9 **inclusive selecionado**; ausente em índice ≥ 9 | `D011-ACC1` PASS; source usa `setAttribute`, nunca `innerHTML`; carrascos `D011-M3` (e), `D011-M3B` (d), `D011-M14` (b), `D011-M16` (c) — **quatro alíneas, quatro mutantes** DETECTADOS | **conforme** |
| 4 | **C4** · exatamente **uma** legenda com o texto canônico, dentro do container da grade, se e somente se há botão | `D011-LEG1` PASS; literal `"Os números são atalhos de teclado — não a ordem de prioridade."` conferido no source; carrascos `D011-M5` (ausente), `D011-M5B` (texto que afirma ordem), `D011-M15` (montagem errada), `D011-M17` (legenda em grade sem botão) DETECTADOS | **conforme** (direção *remoção* do "se e somente se" sem mutante — ver §Dívidas) |
| 5 | **C5** · idempotência por reconstrução: uma legenda, nenhum glifo mudo, mesmos atributos após toggle | `D011-IDEM1` PASS; `D011-M4` (guarda global `__done`) DETECTADO em (c); `D011-M11` (**não instalar o observador**) DETECTADO em (b) **com contraprova**: sob ele `KEY2`, `ACC1` e `LEG1` reprovaram as três e `KEY1` sobreviveu — não existe caminho de teste que não passe pelo patch-point | **conforme** |
| 6 | **C6** · regressão congelada intacta **e** mapeamento tecla→finding preservado, com o carrasco trocado para `D011-KEY1` pela errata | `suites`: `ux41` **56/0**, `ref` **28/0** (contagens de `expected_suites.json`); `tests_ux_m41.js` **fora do diff** `86a4f1e..HEAD`; `D011-M8` morre em `KEY1(d)` — o mapeamento tem carrasco real, e não o `UX14` tautológico | **conforme** |
| 7 | **C7** · nenhuma superfície protegida muda sem autorização registrada; `P50-GOV1` verde | `p50core` **64/0**; `baseline` **281/281 · 0 sem pin**; `boundary` 9/9; diff `86a4f1e..HEAD` **sem** `ui_ux_v32.js`, `ui_ux_v32.css`, `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json`, `MANIFEST.sha256`, `PHASE_5_0_REV_A.md`; `D011-M6` DETECTADO por `P50-GOV1` em worktree efêmera, com a nuance medida (baseline lê blobs de HEAD, não a árvore → `EA-18`) | **conforme** |
| 8 | **C8** · higiene de módulo novo: IIFE + guarda única, zero `innerHTML =`, CSS com prefixo próprio, ≤ 600 linhas, bridge registrado se e somente se expuser `window.__*` | `lint-arch` **0 problemas** (5 módulos novos com IIFE e sem `innerHTML=`; 16 bridges registrados); módulo com **297 linhas** e CSS com **86**; `__D011` em `bridges.json` com shape fechado `{ __installed, diag() }`; `D011-M7` DETECTADO — e só é matável porque a wave 1 estendeu o glob para `ui_d0*_v32.js` | **conforme, com dívida declarada**: a cláusula **CSS com prefixo próprio** não tem verificador algum no pipeline (`EA-17`); a cobertura de "zero seletor alheio" existe só dentro do `@media print`, por `D011-PRT1(b)`/`D011-M19` |
| 9 | **C9** · a suíte nova entra no registro canônico no MESMO PR, com contagem **medida por execução** | `expected_suites.json → suites.d011` = **6/0**, `_trilha` registrando a fixação por execução pós-rebuild (T024) e as duas janelas vermelhas sem rebaixamento; `visual.d011chromium` = 1/0 com `requires:["chromium"]`, declarada como ainda não fixada por execução | **conforme** |
| 10 | **C10** · contraste da legenda ≥ 4,5:1 pela fórmula WCAG sobre as cores resolvidas (`D011-CON1`), com `D011-M9` calculado para ~3,9:1 | O gate **existe** (`tests_011_chromium.js`, 161 linhas), está **registrado** no bloco `visual` e tem par próprio na matriz. **Mas nenhum runner o invoca**: `verify.yml:71-73` roda `npm run test:visual` (Playwright sobre `tests_visual/`, onde a suíte não está), `tests_p50_chromium.js` e `tests_p52_chromium.js`; `grep` em todo o repositório não acha `tests_011_chromium` fora de registros e prosa. No run de CI existente (`33410267738`, job `visual` success) a suíte **não aparece no log**. O local não roda por KI-3, e o CI não roda por **ausência de passo** | **GAP — `implementação-divergente`** (do meio de execução, não do critério). Ver §Gap |
| 11 | **C11** · `@media print` do próprio módulo, seletor do próprio módulo, que some com glifo **e** legenda e **preserva** o estado de seleção — as duas cláusulas **indivisíveis** (errata da Fase 2) | `D011-PRT1` PASS com **seis alíneas**; CSS com três linhas sob `@media print`, todas em `.d011-*`; zero contato com `buildPrintReport`/`preparePrint`/`beforeprint` (§29.6 respeitada); carrascos `D011-M18`(a) `M19`(b) `M13`(c) `M12`(d) `M10`(e) `M20`(f) — **seis mutantes, seis alíneas distintas**, nenhuma subsumindo a outra | **conforme** — e mais estrito que o especificado: a terceira cláusula (`"mudo"`) nasceu da reprovação do PO e foi absorvida sem afrouxar nada |
| 12 | **O critério central decomposto** — a conjunção C1+C2+C3+C4 sustenta "o glifo não lê como índice"; o resíduo perceptual **não** vira asserção disfarçada | os quatro gates verdes com carrasco cada; nenhuma asserção sobre percepção foi escrita em gate algum | **conforme** |
| 13 | **Declarado não mensurável** (percepção residual · accname computado · largura da caixa vazia · efeito da regra de print no PDF · leitor de tela real · contraste no agregado local) | as seis linhas permanecem declaradas; nada foi convertido em gate que fingisse medi-las; o `env-doctor` nomeia o WARN de Chromium em vez de silenciar | **conforme** |
| 14 | **Comportamento especificado** — tabela de estados (`N = 0`; `1 ≤ N ≤ 9`; `10 ≤ N ≤ 15`; selecionado índice < 9; selecionado índice ≥ 9; após toggle) | coberto por execução: `LEG1` mede `N = 0` (zero legenda) e o caso pleno; `KEY2`/`ACC1` medem a faixa ≥ 10 na fixture de 15; `ACC1` mede o selecionado com e sem atalho; `IDEM1` mede o pós-toggle | **conforme** |
| 15 | **Contratos** — nenhum estado novo, nenhum dado novo; apresentação pura; INV-8 intocada | source: nenhuma escrita em estado canônico, nenhum `render()` chamado, decisão derivada de `computeFindings()`/`businessPriority`/`step` e identidade por `data-id` — **nunca** de `.key.textContent`, `.sel` ou `aria-pressed` (R9 §3); `session` **97/0**; `tests_session_m48.js` fora do diff | **conforme** |
| 16 | **Contrato de bridge** — `window.__*` exige entrada em `bridges.json` no mesmo PR | `__D011` registrado com owner e nota, no commit `84c92a1`, **antes** do consumidor (wave 1 × wave 3); `lint-arch` confere 16/16 | **conforme** |
| 17 | **Ponto de extensão** — a spec mediu que `__uxDecor`/`registerDecor` não rodam nesta tela e remeteu a decisão do patch-point à Fase 2, com registro no `plan.md` (R9 §4) | `PP-011-1` registrado no `plan.md` com Id, tipo, owner, alvo, instalação, guardas, "o que NÃO faz" e prova de que dispara; implementado como registrado (`MutationObserver` sobre `#app`, `attributes:false`, `busy`, write-if-different, `try/catch`) | **conforme** |
| 18 | **Decisão 1 do portão** — rota **A2** (módulo novo), sem consumir autorização de boundary | executada: arquivos novos + `build_v32_html.py` (pinado, não protegido) + registros; **nenhuma** autorização nominal pedida ou usada; as quatro rotas alternativas ficaram recusadas com custo medido no `plan.md` | **conforme** |
| 19 | **Decisão 2 do portão** — C11 nos termos estritos, sem tocar o pipeline de print congelado | conferido no CSS e no diff: nenhum arquivo do pipeline de print no diff; regra vive só em arquivo novo e alcança só `.d011-*` | **conforme** |
| 20 | **Achado colateral `UX14`** — registrado, **não** emendado (suíte congelada) | `tests_ux_m41.js` fora do diff; `ux41` 56/0; achado alocado como **`EA-16`** no `.claude/BACKLOG.md` de `origin/develop` (PR #33) | **conforme** |
| 21 | **Fora de escopo respeitado** — Camada 1 só lida; mapeamento não muda; agrupamento não desfeito; `✓` inalterado; lista vazia não tratada (vira achado); `kbd-tip` não reescrita; relatório/scoring/suficiência/sessão/catálogo intocados; **nenhuma numeração criada** | diff `86a4f1e..HEAD` (19 arquivos) conferido item a item; a lista vazia virou **`EA-19`** na `develop`; nenhuma sequência numérica é criada pelo módulo — ele só **remove** conteúdo do `.key` e **acrescenta** atributo e legenda | **conforme** |
| 22 | **R3** — red provado e **commitado** antes da implementação, com o FAIL de cada gate nomeado | `red.commit` = `5bf4731` (existe; `check_tdd` confere por `git cat-file`), `red.status: proven`, `red.gates` com os cinco vermelhos; **1 PASS · 5 FAIL de 6** registrado no `_trilha`; autor do gate ≠ implementador em toda a demanda | **conforme** |
| 23 | **R8** — arquivo pinado alterado ⇒ `gen_pins.py` no mesmo PR, com motivo no commit | 11 execuções de `gen_pins.py` (R0…R9 + o repin do merge de `develop`); `baseline` fecha em 281/281 · 0 sem pin | **conforme, com desvio declarado**: o `tasks.md` previa 9 repins (R0–R6c) e a série foi renumerada após o merge; registrado no `relatorio-final.md` §5 |
| 24 | **R3 §5 / R10** — matriz gate↔mutante **um par por mutante**, nascida expandida, com `D011-M9` declarado deferido e as raias efêmeras nomeadas | `mutation-matrix.json`: **22 pares** `D011-*`, cada um com `harness`, `gate` e `ultima_prova.resultado`; `D011-M6`/`M8` com raia efêmera nomeada; `D011-M9` com o deferimento escrito; `check_tdd` **0 problemas** | **conforme, com expansão declarada**: 12 previstos → 22 (dois variantes promovidos, `D011-M13`, seis pares propostos na wave 5 e `D011-M20` no fecho). **Todas fortalecem; nenhuma enfraquece** |
| 25 | **INV-1** — o engine não entra na régua: payload M41 inalterado | `m41`: comparação com o snapshot **PASS** e payload **== pin declarado**; `declared.m41_payload_sha256` fora do diff | **conforme** |
| 26 | **C9 (2ª metade) / R10 §3** — contagem nunca rebaixada durante o vermelho | `_trilha` de `d011` registra as duas janelas (**1/5** e **5/1**) mantendo a canônica em **6/0**, com a razão escrita (R10 §1) | **conforme** |

## Score final

**25 conformes de 26 — 96,2 %.** Um gap, classe **`implementação-divergente`**.
**Nenhum gap de classe `spec-errada`** e **nenhum de classe `faltando`**: nenhuma
exigência da spec ficou por implementar, e nenhuma foi reformulada.

## O gap — item 10 (C10 · contraste)

**O que a spec prometeu**: `D011-CON1` medindo a razão WCAG sobre as cores
resolvidas, executado "fora do agregado local (KI-3): Chromium é CI + rito do
proprietário", com `D011-M9` como carrasco.

**O que existe**: a suíte (161 linhas), a chave `visual.d011chromium` no registro
canônico e o par `D011-M9` na matriz, com o deferimento escrito.

**O que falta, medido**: **o veículo do deferimento**. O job `visual` do
`verify.yml` não descobre suítes pelo registro — ele roda **três comandos
literais** (`:71-73`), e `tests_011_chromium.js` não é nenhum deles. `check_suites`
usa o bloco `visual` apenas para **registrar**, não para executar. Consequência: a
T030, como redigida ("colher o resultado do job"), **não é executável sem uma
mudança de pipeline** — e mudança de pipeline entra no `pipeline.yaml`/`verify.yml`
(R10 §9), nunca no prompt de um agente.

**Direção que eu recomendo** (decisão do orquestrador, não minha):

1. **`build-engineer`** acrescenta o passo `node tests_011_chromium.js` ao job
   `visual` de `.github/workflows/verify.yml`, no mesmo PR, e reexecuta o job —
   fechando `D011-CON1` com o número do run;
2. **`qa-engineer`** decide o destino do `D011-M9`: harness Chromium próprio para
   `d011` ou execução manual em worktree efêmera no rito do proprietário, e escreve
   o retorno na matriz (T031, dono único do arquivo);
3. **enquanto isso, C10 permanece declarado como não executado** — nunca como
   "verde por ausência". O que **não** é opção: rebaixar C10, retirar o gate do
   registro ou afrouxar a razão de 4,5:1 (R10 §1).

Alternativa legítima, se o proprietário preferir não mexer no CI nesta demanda:
**aceitar C10 como deferido nominal com prazo**, no formato da exceção KI-4 — mas
isso é ato de governança, e a decisão é do usuário no chat, não de agente.

Iteração: **1 de 2** (limite da skill). O gap acima não se resolve por reescrita de
spec nem por conserto do `doc-writer`.

## Dívidas de mutante declaradas — conferidas, não são gaps

Registradas em `mutation-matrix.json → dividas_declaradas` e conferidas por
leitura nesta validação:

- **três ramos alcançáveis só pelo teste** (`attr-removido`, `remocao-legenda`,
  `legenda-excedente`) — 0 hits nas três fixtures reais, hits só sob cenário
  sintético; o **observável** que cada critério pede tem carrasco, o que fica sem
  mutante é o **mecanismo**;
- **duas alíneas sem mutante plausível** — `D011-KEY2(b)` e `D011-IDEM1(d)`;
- **`D011-KEY1(a)` e `(b)`** fora da campanha **por decisão**: matá-las exigiria
  mutar o oráculo, e mutar o oráculo prova o oráculo, não o produto — as duas
  foram provadas vermelhas na bateria negativa da Fase 4, em cópia efêmera;
- **`EA-17`** (cláusula de CSS do C8 sem verificador);
- **`D011-PRT1(f)` / `D011-M20`** — dívida **quitada**, registro mantido pela
  trilha (R2 §5).

## Observações que não são gaps de spec

1. **`mutation_map.json → d011._trilha`** ainda diz **"18 mutantes LOCAIS"** e
   enumera 18 ids sem `D011-M20`; o harness tem **19** e o `IC-4` mediu 19.
   Nenhum stage lê esse texto — o veredito não muda —, mas o registro contradiz a
   execução. Dono único: `qa-engineer`.
2. **`planning-state`** em `phase: "red"` e sem `pr_url`, com as waves 3–6
   executadas (as irmãs 009 e 010 estão em `validate`). O stage `state` passa; o
   `state-eval` injeta a fase em todo prompt. Dono: orquestrador.
3. **Nenhuma execução de CI no head `27aabe9`** — o último run do PR
   (`33410267738`) é 8 commits atrás. A plataforma canônica é o CI Linux (R7 §5);
   as execuções desta validação são locais, em Windows, com paridade de LF por
   construção.
4. Escrever este arquivo e o `relatorio-final.md` deixa a árvore com dois
   arquivos **não rastreados** — o stage `mutation` exige `porcelain` vazio
   (precedente registrado no `spec-validate.md` da 012). Todas as execuções acima
   foram feitas **antes** da escrita, com a árvore limpa.
