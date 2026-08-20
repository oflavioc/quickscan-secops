# MICROFASE_5_0_1_REPORT.md — Assessment Shell & Answer Semantics

**Data:** 2026-08-20 · **Workspace:** `/mnt/c/Projetos/QuickScan-SOC-CMM/phase5`
**Autorização:** GO condicionado do proprietário (errata 5.0.1), sob a spec normativa
`specs/PHASE_5_0_REV_B.md` · SHA-256 `4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b`.
**Status:** implementada e verificada. **Nada é declarado congelado.** A microfase 5.0.2 NÃO foi iniciada.

---

## 1 · Estado de origem

```text
branch de origem   main
branch de trabalho feat/phase5-5-0-1        (renomeada de feat/phase5-wave-1a por §3.1 da errata)
HEAD               b2888f130f16e17e008ca9a4a6673b9c637a926a
origin/main        b2888f130f16e17e008ca9a4a6673b9c637a926a
commits            0 · push 0 · tag 0 · merge 0
```

### 1.1 Correção factual obrigatória (§1 da errata)

`specs/PHASE_5_0_REV_B.md` possui **1.871 linhas** (`wc -l` = 1871; arquivo terminado por `\n`,
portanto 1.871 linhas completas). A contagem "1.795" registrada no preflight estava **incorreta** e
fica corrigida aqui. O SHA-256 conferiu em ambas as ocasiões; a identidade normativa nunca esteve em
questão e o preflight não precisou ser repetido.

---

## 2 · Arquivos criados (14 no total da microfase)

```text
ui_p50_shell_v32.js     f3580683d55d73837116060d7be099b47d63c491bb3a0633496fe6df35a7d3c4
ui_p50_v32.css          8a274b4e04167d33289b41958c7d8c363467e6c12bb2a5c83f6dcf4c3c925cd8
fixtures_p50.js         fde1e9868e1dddc294c4f66464dd031b65a5bcd0fea15ca850e3651696d48eac
tests_p50_core.js       f495c5081cf62c9ede2352a8d7edf42785505fd065e78c43a49f93375fbeb5b6
tests_p50_chromium.js   465ff2686bc36ad47fcf20a436509a01ec0ab4673b89d9914f14c6dc950e5396
tests_p50_mutants.js    009a879f30ae31355f0c86511e432497fac0b7a85118b73442e1078d43b51bf5
```

**Contagem corrigida (auditoria §5.1/§5.2).** A contagem "9" do relatório anterior estava errada.
Inventário real, por rodada:

```text
6 módulos/testes acima
+ docs_phase5/MANIFEST_PHASE5_P50.sha256
+ docs_phase5/MICROFASE_5_0_1_REPORT.md
+ docs_phase5/evidence_p50/P50-ACC6-selection-1440.json
+ docs_phase5/evidence_p50/P50-mutation-5.0.1.json
= 10 antes dos screenshots                    <- contagem verificada pela auditoria
+ docs_phase5/BACKLOG_PRODUCTION_HARDENING_VAULT.md      (rodada da diretriz de risco)
= 11
+ docs_phase5/evidence_p50/P50-ACC6-P50-F2-1440.png
+ docs_phase5/evidence_p50/P50-ACC6-P50-F6-1440.png
+ docs_phase5/evidence_p50/P50-smoke-P50-F6-390.png      (esta correção cirúrgica)
= 14 arquivos criados no total da microfase
```

`tests_p50_mutants.js` é o **harness de mutação separado**, previsto pela §4 da errata. Não integra
`test:all`: é executado sob demanda na entrega e o seu resultado é evidência de auditoria.

## 3 · Arquivos alterados (3)

| arquivo | pré | pós | natureza |
|---|---|---|---|
| `build_v32_html.py` | `3b5906f24e35bd4dce0d18da0ffef00a831801bda55272f268812046e734821a` | `f2295a421e59e77825530d77069a6d0350e9a01af8fdf506a6d1482416456a9e` | somente 2 entradas de injeção (§29.3) |
| `package.json` | `8654fc09d178f750ffcf1d87f8e1aaa1037d829ece698b01baab5d316586b599` | `fc0bf13b5c32832c04121245f3512dcc0e66744d2d1164da598bab1ec924746f` | somente `test:p50`, `test:p50vis` e inclusão em `test:all` |
| `quickscan_secops_soccmm_v3_2_dev.html` | `787cd3ab33188eee75a82590ab08d4240b6016a21329f899fd597050e3dde85a` | `61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d` | **saída de build** (603.016 bytes, pós-correção) |

`package-lock.json` **não** foi alterado (`222032440a51126270245dab871b3c6eb6a2a3fd3070b798c1693c5fd058b68a`).
Nenhuma dependência foi instalada. `package.json.version` intocado (`3.4.0-dev.4.8.0.7`).

### 3.1 Diff nominal integral

```text
build_v32_html.py    +4 linhas: P50SHELLJS, P50CSS, leitura do shell, leitura do CSS
                     +2 edições de string de injeção: V32_P50_SHELL_* após V32_SESSION_END
                                                      V32_P50CSS_*    após V32_UXCSS_END
package.json         +2 scripts nominais · 1 linha test:all
```

Nenhuma outra linha do builder foi tocada; nenhum script existente foi modificado.
Entradas de injeção para `ui_p50_suff_v32.js` e `ui_p50_results_v32.js` **não** foram criadas
(verificado: 0 ocorrências no HTML construído). A ordem final declarada na §29.3 permanece alcançável.

## 4 · Superfícies protegidas — identidade byte-a-byte (pré == pós)

Os **20** arquivos protegidos/normativos verificados permanecem idênticos ao baseline:

```text
engine_v32.js  9a4a2e67…2b5d247a          quickscan_secops_soccmm_v3_1_3.html  d3290491…deb7ae82
ui_v32.js      094db057…fb12c5038         ui_ux_v32.js       a0504011…7a9d3938
ui_target_v32.js cfd85cbb…c94bb4a0        ui_refinement_v32.js ade18a9a…cc6d01132c
ui_journey_v32.js 9005bbc2…43b97775       ui_session_v32.js  6fd849cd…dc27164b
ui_icons_v32.js 32aabc34…5aa42151         ui_v32.css         78d68ed0…6d4ea2cb
ui_ux_v32.css  84af6705…41483b44          generate_icons_v32.py 1acfe25c…8b8225bf7
harness_m41_v313.js 7ec750b2…149f14b0     v3_1_3_functional_snapshot.json 0abeaa7c…c99555435
tests_unset_ug.js d2a3f804…bde1bae2e      MANIFEST.sha256    80369148…6eed417e
package-lock.json 22203244…d058b68a       specs/PHASE_5_0_REV_B.md 4f1583c7…f004619b
CLAUDE.md      04f30859…1c0b9a25c0d4      docs_phase5/REV_B_PHASE_OPENING_RECORD.md 1a2ada07…2e08a416
```

Todas as suítes congeladas (`tests_*.js`) e `tests_visual/` permanecem intocadas
(`git status --porcelain` sobre elas: vazio). Print/PDF: nenhuma superfície tocada.

---

## 5 · Primeira execução vermelha REAL

Os arquivos de teste e as fixtures foram criados **antes** de qualquer módulo de produto e
executados contra a ausência total de superfície nova. Resultado real observado:

```text
node tests_p50_core.js        4 PASS · 11 FAIL de 15
  FAIL: P50-UX1 [grupo de respostas P50 ausente na pergunta 1]
        P50-UX2 [ArrowDown não moveu o foco (1)]
        P50-UX6 [controles de navegação P50 ausentes]
        P50-UX9 [toggle de sidebar ausente]
        P50-UX10 [esperadas 3 perguntas no domínio 0, obtidas 0]
        P50-UX13 [registro P50 de decoradores ausente]
        P50-SUF0 [nenhum módulo novo presente para lintar]
        P50-SUF2 [P50-F1: domínio 0 ausente na sidebar]
        P50-SESUX1A [shell ausente em P50-F1]
        P50-COR1 [nenhum módulo novo presente para lintar]
        P50-COR2 [ui_p50_v32.css ausente]
  PASS (vacuamente verdes sobre conjunto vazio ou já satisfeitos):
        P50-GOV1 · P50-GOV2 · P50-GOV3 · P50-IC3

node tests_p50_chromium.js    0 PASS · 1 FAIL de 1
  FAIL: P50-ACC6 [P50-F2: #p50-shell ausente · P50-F6: #p50-shell ausente]
```

Os quatro PASS iniciais são declarados **vacuamente verdes** e não valem como evidência de poder
discriminante. Esse poder é demonstrado adiante pelos mutantes M7 (P50-SUF0), M8 (P50-COR1) e pelo
lint de diff/identidade de P50-GOV1.

### 5.1 Defeitos de TESTE encontrados e corrigidos durante o ciclo red → green

Quatro defeitos estavam nos gates, não no produto; todos corrigidos com o motivo registrado:

| # | gate | defeito | correção |
|---|---|---|---|
| 1 | P50-GOV2 | falso negativo: a regex da data não admitia o negrito markdown (`**Data da promoção:** 2026-08-19`) | regex passou a aceitar `\**`. As três identidades de SHA sempre conferiram |
| 2 | P50-UX13 | o lint de owner único contava `window.__uxDecor ===` (comparação de captura) como atribuição | assinatura passou a ser `=(?!=)` |
| 3 | P50-UX9 | auto-detecção: o lint de oráculos proibidos casava com o próprio literal da sua regex | nomes montados por concatenação, de modo que o literal nunca apareça contíguo |
| 4 | P50-SUF2 | esperava o texto `N de 3 respondidas`; o produto emite a moeda canônica | expectativa alinhada a `N de 3 respostas confirmadas` (ver §7.2) |

---

## 6 · Gates novos — resultado verde

```text
P50 CORE (microfase 5.0.1): 15 PASS · 0 FAIL de 15
  P50-GOV1   superfícies protegidas da §29.4 byte-idênticas; suítes congeladas presentes
  P50-GOV2   spec == registro de promoção == CLAUDE.md, mesmo SHA-256
  P50-GOV3   9 âncoras simbólicas dos gates novos VERIFICADAS no mapa (33/33, 0 pendentes)
  P50-UX1    15 perguntas × 5 valores canônicos; ordem, cardinalidade e pares t/d preservados
  P50-UX2    teclado == clique, com invocação observada do handler congelado
  P50-UX6    navegação presentation-only
  P50-UX9    isolamento de estado de apresentação (oráculo captureCanonicalInputs())
  P50-UX10   três estados com DOM, rótulo visível e nome acessível distintos
  P50-UX13   composição de __uxDecor + wrapper de render (8 subasserções)
  P50-SUF0   renderer novo não é dono de suficiência (lint + varredura de superfície)
  P50-SUF2   domínio sem confirmadas → n/d + "Não avaliado", nunca 0.0
  P50-SESUX1A lint de claims de persistência (source + superfície renderizada)
  P50-COR1   zero hex literal nos módulos novos; consumo de var(--dom-accent)
  P50-COR2   cor do domínio na dimensão de dados; acento de marca ausente
  P50-IC3    nenhum mapa/asset de ícone paralelo

P50 CHROMIUM (microfase 5.0.1): 1 PASS · 0 FAIL de 1
  P50-ACC6   estado programático da seleção coerente com o estado canônico (Chromium REAL)
```

Nenhum ID fora da tabela normativa de reserva foi criado. Não existem `P50-UX1b` nem `P50-UX13b`:
as provas correspondentes são **subasserções internas** de P50-UX1 e P50-UX13 (§3.3 da errata).

### 6.1 Ambiente Chromium

```text
resolução (rota congelada)  CHROME_PATH (não definido) → /opt/google/chrome/chrome (ausente)
                            → Chromium gerenciado pelo Playwright   ← rota efetivamente usada
browser                     Chromium 151.0.7922.34
executável                  ~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
Playwright                  1.62.1  (conforme §25.6)
viewport                    1440×900
pageErrors                  []
SKIP                        nenhum — o gate foi realmente medido
```

**Divergência declarada — ver §9/D2:** a §25.6 nomeia Chromium **141.0.7390.37**; o Chromium
gerenciado disponível neste ambiente é **151.0.7922.34**. A *rota de resolução* congelada foi
respeitada integralmente. A divergência é de versão nominal, não de rota, e fica registrada para
decisão do proprietário/auditor.

---

## 7 · O que foi implementado

### 7.1 Arquitetura

**Owner único de composição de `window.__uxDecor` (UI-004A).** `ui_p50_shell_v32.js` captura o
predecessor congelado **exatamente uma vez** na carga do módulo (`const p50PrevDecor`), invoca-o
**sempre e antes** de qualquer decoração P50, isola falhas **por callback** com `try/catch`
individual, é idempotente e **não recaptura** reatribuições posteriores. Os módulos das microfases
seguintes consomem `window.__P50.registerDecor(fn)` e **não** reatribuem `window.__uxDecor`.

**Wrapper do binding global `render` (AMB-1, aprovado).** Mesmo padrão do precedente congelado
`ui_ux_v32.js:4-5`. As 12 condições da aprovação estão implementadas e cobertas:
captura única · predecessor antes · comportamento canônico preservado · idempotência de instalação
· idempotência do resultado · guard de reentrância (`p50Depth`) · isolamento de falha · sem
recaptura · nenhuma escrita direta em estado canônico · toda alteração de resposta pelo handler
congelado · mutantes discriminantes (M1, M2, M4, M9, M10) · zero edição de arquivo da §29.4.

**Necessidade do wrapper, verificada no source:** `window.__uxDecor` só dispara quando
`uxScreenOf()==="results"` (`ui_ux_v32.js:186`), portanto não alcança a tela de pergunta. O wrapper
de `render` é o único veículo determinístico dentro da boundary.

### 7.2 Superfície entregue

Presente **exclusivamente** na tela de pergunta (`step` entre 1 e `QS.length`); ausente em home,
arq, prioridade, resultados e print — verificado em DOM e reforçado por `@media print{#p50-shell{display:none}}`.

```text
#p50-shell
  .p50-orient   (sticky)
    [data-p50="domain-current"][data-dom=N]  "Processos · Process"     (PT/EN congelados, UI-033A)
    [data-p50="position"]                    "Pergunta 2 de 3 neste domínio"
    [data-p50="domain-progress"]             "1 de 3 respostas confirmadas neste domínio"
    [data-p50="completion"]                  "Conclusão: 5 de 15 respostas"
    nav: [data-p50="prev"] → aciona #back · [data-p50="next"] → aciona #next
         [data-p50="sidebar-toggle"]         (apresentação apenas)
  [data-p50="sidebar"]
    5 × [data-p50="domain"][data-dom=i]
        [data-p50="domain-name"]             "Negócio · Business"
        [data-p50="domain-state"]            "n/d"  + [data-p50="domain-state-label"] "Não avaliado"
                                        ou   "2 de 3 respostas confirmadas"
        3 × [data-p50="q"][data-qid][data-p50-ans="unset|na|confirmed"]
              [data-p50="q-state"] visível + aria-label distintos por estado
```

Answer cards congelados recebem **somente atributos aditivos**: `data-p50-value`,
`data-p50-selected`, `data-p50-opt`, `data-p50-optd`; o grupo `.opts` recebe `data-p50="answers"`,
`role="group"` e `aria-label`. **Nenhum markup da Camada 1 é reescrito.**

**Três estados do eixo de respostas (UI-016a):**

| estado canônico | DOM | rótulo visível | nome acessível |
|---|---|---|---|
| `null` | `data-p50-ans="unset"` | `n/d` | `Não avaliado` |
| `"NA"` | `data-p50-ans="na"` | `Não sei` | `Não sei · precisa validar · não pontua` |
| `0..3` | `data-p50-ans="confirmed"` | `Confirmado · 0,0` | `Resposta confirmada · 0,0 de 5` |

O nível **0 confirmado** é exibido com o seu valor e nunca omitido; `null` nunca produz zero.

### 7.3 Decisões de desenho tomadas durante a execução

**D-A · Navegação sem salto arbitrário.** O shell oferece orientação permanente + anterior/próxima
acionando `#back`/`#next`. Salto direto para uma pergunta qualquer exigiria que o shell passasse a
escrever `step`, o que colide com a condição 9 da aprovação de AMB-1. UI-001 exige *expor* domínio,
posição e progresso — atendido — e o critério de aceite ("identificar domínio e posição sem rolagem
para o topo") é atendido pela faixa de orientação `position:sticky`.

**D-B · Moeda canônica com o nome canônico.** A sidebar exibe `N de 3 respostas confirmadas` —
exatamente a unidade e a denominação que a UI congelada já usa (`domStat().basis`). Nenhum limiar,
nenhum veredito, nenhuma palavra "suficiente/insuficiente". A conclusão global é reportada
separadamente como `Conclusão: N de 15 respostas` (completion, inclui `NA`), preservando a
separação exigida por UI-009.

**D-C · Sidebar sem score.** Nenhum score de domínio é exibido em nenhum estado — o que torna a
proibição de veredito executivo satisfeita de forma total, e não parcial, sem depender do contrato
derivado UI-012A (microfase 5.0.3).

**D-D · Sem `innerHTML`.** Todo texto entra por `textContent` e todo atributo por `setAttribute`.
Disciplina de implementação e guard auxiliar, **não** encerramento normativo de UI-049/P50-UX12
(§3.4 da errata).

### 7.4 Split de cláusulas compartilhadas

| cláusula | em 5.0.1 | adiado | por quê o adiamento não deixa contrato parcial |
|---|---|---|---|
| UI-002 | sidebar com `n/d` + "Não avaliado", três estados, zero score | linha de déficit de suficiência → 5.0.3 | nenhum veredito executivo é emitido em nenhum estado |
| UI-009 | completion, nomeada como conclusão | progresso de suficiência (UI-009A) → 5.0.3 | exibir só completion, nomeada como tal, não pode misturá-la com suficiência |
| UI-016 | eixo (a) de respostas | eixo (b) presence do landscape → 5.0.4 | são gates separados por determinação da própria UI-016 (correção A-3) |
| UI-011 | apenas o guard negativo P50-SESUX1A | componente de status, dirty flag, P50-SESUX1B → 5.0.2 | nenhum componente de status foi criado; não há claim para ser honesto ou desonesto |
| §29.3 builder | 2 das 4 entradas, na ordem declarada | `suff` e `results` → 5.0.2/5.0.3 | ordem final permanece alcançável; entrada para módulo inexistente quebraria o build |

Não implementados (fora do recorte autorizado): UI-005, UI-006, UI-007, UI-008, UI-012/012A/012B,
UI-013/014/015, UI-017–021, UI-026–030, UI-034–042, UI-045/046/046A, P50-UX12, P50-VIS*,
P50-ACC1–ACC5, P50-COR3, P50-IC1/IC2/IC4, fixtures P50-F3/F4/F5/F7/F8/F9/F10.

---

## 8 · Mutation testing — 11/11 (M11 acrescentado na correção cirúrgica · §16.2)

Cada mutante foi aplicado ao source, o HTML reconstruído, o gate esperado executado e exigido
**FAIL com motivo compatível**. Detecção incidental ou por manifesto **não** foi aceita. Após cada
mutante o source foi restaurado e o SHA-256 conferido byte a byte.

| # | mutação | gate esperado | motivo observado | veredito |
|---|---|---|---|---|
| M1 | remover a chamada do predecessor em `window.__uxDecor` | P50-UX13 | `predecessor não foi invocado: decoração congelada não restaurou #ux-execrow` | DETECTADO |
| M2 | remover a chamada do predecessor no wrapper de `render` | UX 4.1 (regressão) | `FAIL UX1 … Cannot read properties of null` | DETECTADO |
| M3 | trocar o mapeamento de dois answer cards | P50-UX1 | `ordem/valores ["0","2","1","3","NA"] em k=0` | DETECTADO |
| M4 | escrita direta em `ans[k]` no lugar do handler congelado | P50-UX2 | `caminho congelado invocado 0 vez(es), esperado 1` | DETECTADO |
| M5 | dessincronizar a descrição canônica `d` de uma opção | P50-UX1 | `descrição canônica dessincronizada k=0 i=0` | DETECTADO |
| M6 | renderizar `0.0` para domínio sem confirmadas | P50-SUF2 | `P50-F1 dom 0: visível '0.0'` | DETECTADO |
| M7 | derivação local de suficiência no renderer novo | P50-SUF0 | `compara confirmedCount() diretamente` | DETECTADO |
| M8 | hexadecimal de cor de domínio na camada nova | P50-COR1 | `ui_p50_v32.css declara hex de domínio #307FE2` | DETECTADO |
| M9 | remover a proteção de idempotência do shell | P50-UX13 | `shell duplicado: 6 -> 8` | DETECTADO |
| M10 | dessincronizar o estado acessível do card | P50-ACC6 | `data-p50-selected=false em value=2 · value=0` | DETECTADO |

```text
MUTATION TESTING (5.0.1): 11/11 detectados pelo gate e motivo esperados
restauração: shell OK · css OK · html OK  (byte-idênticos ao pré-mutação)
```

### 8.1 Achado relevante — M1 inicialmente NÃO detectado

Na primeira rodada, **M1 (mutante obrigatório da §25.3) passou despercebido**. Causa raiz: o gate
observava um *marcador de ordem* posicionado imediatamente antes do predecessor, e não a execução
efetiva dele; suprimir a chamada deixava o marcador intacto.

Ao investigar, verificou-se um fato do runtime congelado que não estava registrado em lugar algum:
**`window.__uxDecor` é redundante com o wrapper de `render` da UX 4.1 na tela de resultados** —
`uxAfterRender()` (`ui_ux_v32.js:12`) já chama `uxSessionControls()` e `uxResultsDecor(app)` a cada
render. O predecessor de `__uxDecor` só é observável isoladamente quando `__uxDecor` é invocado
**sem** um render completo, que é o caso dos sítios `ui_v32.js:248` e `:474`.

O gate foi então fortalecido para observar o **efeito real**: remove-se `#ux-execrow`, invoca-se
`window.__uxDecor(app)` e exige-se que a decoração congelada o restaure. Com o predecessor
suprimido, não é restaurado. M1 passou a ser detectado com motivo semântico correto.

O gate fortalecido foi reverificado verde no produto não mutado antes da remutação.

---

## 9 · Regressão congelada — contagens integrais

```text
npm run test:all                                                     (exit 0)
  MATRIZ (M1–M40 ENGINE + M42–M86 + P2.1)  105 PASS ·  0 FAIL de 105
  UI M3.1                                   19 PASS ·  0 FAIL de  19
  UI 3.2                                    25 PASS ·  0 FAIL de  25
  UI 3.3.1                                  11 PASS ·  0 FAIL de  11
  UI 3.3.2 (PDF)                            23 PASS ·  0 FAIL de  23
  UI 3.3.3                                  26 PASS ·  0 FAIL de  26
  UX 4.1                                    56 PASS ·  0 FAIL de  56
  TARGET 4.3.1                              30 PASS ·  0 FAIL de  30
  REF 4.4                                   28 PASS ·  0 FAIL de  28
  JOURNEY 4.5                               31 PASS ·  0 FAIL de  31
  ICONS 4.6                                 12 PASS ·  0 FAIL de  12
  SESSION 4.8                               97 PASS ·  0 FAIL de  97
  UNSET GEOMETRY (UG)                       13 PASS ·  0 FAIL de  13   ← UG13 PASS em Chromium real
  P50 CORE (5.0.1)                          15 PASS ·  0 FAIL de  15
  P50 CHROMIUM (5.0.1)                       1 PASS ·  0 FAIL de   1
  M41                                       COMPARAÇÃO PASS
  M41 payload                               9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b

npm run test:visual                         67 passed · 0 failed · 37 skipped
```

Todas as contagens coincidem com o baseline 4.8.0.7. **Regressão de print integral:** UI 3.3.2
23/23, `print.spec` e gates `V*` dentro dos 67, UG4/UG6/UG9 dentro dos 13 — nenhuma redução.
Nenhum gate foi enfraquecido, reescrito ou removido; a suíte P50 é puramente aditiva.

Engine byte-idêntico (`9a4a2e67…2b5d247a`) e payload M41 byte-idêntico (`9794b267…3ed4365b`).

## 10 · Build determinístico

```text
python3 build_v32_html.py (execução A) → 61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d
python3 build_v32_html.py (execução B) → 61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d
A == B · 603.016 bytes · Linux 6.18.33.2-microsoft-standard-WSL2 (WSL, invariante B3)
```

Verificação das injeções no HTML produzido:

```text
V32_P50_SHELL_BEGIN  1     V32_P50_SHELL_END  1
V32_P50CSS_BEGIN     1     V32_P50CSS_END     1
ui_p50_suff_v32      0     ui_p50_results_v32 0     ← nenhum módulo inexistente incluído
```

## 11 · Manifesto da microfase

`docs_phase5/MANIFEST_PHASE5_P50.sha256` é regenerado **por último** e cobre todos os artefatos da
microfase, exceto ele próprio (§16.6).

**Estado do `MANIFEST.sha256` do core 4.8.0.7 — correção da auditoria §5.3/§5.4.** Permanece
**imutável** e acusa, pós-5.0.1:

```text
68/74 OK · 6 divergências esperadas
  quickscan_secops_soccmm_v3_1_3.html      delta da micro-fase UNSET
  ui_v32.js                                delta da micro-fase UNSET
  ui_target_v32.js                         delta da micro-fase UNSET
  quickscan_secops_soccmm_v3_2_dev.html    saída de build · UNSET + 5.0.1
  build_v32_html.py                        delta da microfase 5.0.1 · injeção
  package.json                             delta UNSET + 5.0.1 · scripts
```

As seis são deltas conhecidos e autorizados das microfases UNSET e 5.0.1. **Não são blocker.**
O relatório anterior citava `69/74 · 5 divergências`, que era o estado **pré-5.0.1**; corrigido aqui.

---

## 12 · Desvios e decisões declarados

**D1 · Contagem de linhas da spec.** Corrigida de 1.795 para **1.871** (§1.1). Erro de relatório do
preflight; identidade normativa nunca afetada.

**D2 · Versão do Chromium.** §25.6 nomeia 141.0.7390.37; o ambiente resolveu 151.0.7922.34 pela rota
congelada (Chromium gerenciado, já que `CHROME_PATH` não está definido e `/opt/google/chrome/chrome`
não existe nesta máquina). Playwright 1.62.1 conforme. **DECIDIDO (reauditoria estreita, §16.5):
Chromium 151.0.7922.34 foi ACEITO como ressalva não bloqueante da microfase 5.0.1.** Não está mais
aguardando decisão. O 141 não foi instalado, a spec não foi alterada e não se afirma equivalência
byte a byte. A eventual atualização do ambiente canônico será decidida antes do freeze da Phase 5.0.
Registrado como `PHV-20`.

**D3 · Quatro defeitos de teste corrigidos no ciclo red → green** (§5.1). Nenhum deles indicou
divergência de governança: as identidades de SHA de P50-GOV2 sempre conferiram.

**D4 · M1 inicialmente não detectado; gate fortalecido** (§8.1). Registrado por inteiro, incluindo o
fato de runtime descoberto (redundância entre `__uxDecor` e o wrapper de render da UX 4.1).

**D5 · Arquivo novo `tests_p50_mutants.js`** — harness de mutação separado, previsto na §4 da errata
e declarado aqui. Não integra `test:all`.

**D6 · `test:p50vis` incluído em `test:all`**, conforme a letra da §29.3. O script sai com código 0
quando não há browser resolvível (imprimindo `NÃO EXECUTADO`), preservando o invariante congelado de
que `test:all` passa sem browser instalado. SKIP nunca conta como PASS.

**D7 · Decisões de desenho D-A a D-D** (§7.3), tomadas dentro da boundary e registradas para
ratificação.

**D8 · `package.json` deixa de ser byte-idêntico ao baseline da §0.A** (`8654fc09…` → `fc0bf13b…`).
Trata-se de arquivo com edição nominal permitida pela §29.3; o novo hash está no manifesto da
microfase.

## 13 · Blockers abertos

```text
NENHUM.
```

Registro exigido pela §3.8 da errata: durante o preflight **não foi encontrada nenhuma
inviabilidade técnica**; foram identificadas **seis decisões de proprietário necessárias**
(AMB-1..AMB-6), todas **resolvidas** pela errata; após a aplicação da errata restaram **zero
blockers abertos** para iniciar e concluir a implementação.

## 14 · Estado final

```text
microfase 5.0.1     IMPLEMENTADA E VERIFICADA
engine              INTOCADO (9a4a2e67…)
M41                 PRESERVADO (9794b267…)
Camada 1 e módulos 4.x  INTOCADOS
print/PDF           INTOCADO · regressão integral verde
novo HTML de trabalho  61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d
gates novos         16 (15 core + 1 Chromium) · 16 PASS · 0 FAIL
mutantes            11/11 detectados pelo gate e motivo esperados
regressão           test:all 0 FAIL · test:visual 67/0/37
commit / push / tag / merge / freeze / release / deployment   NENHUM
microfase 5.0.2     NÃO INICIADA
declaração de freeze  NENHUMA — cabe ao auditor/proprietário
```

---

## 15 · Aplicação da diretriz de prioridade funcional e risco local (2026-08-20)

A *Diretriz do proprietário — prioridade funcional e aceitação de risco local* foi recebida **após**
a conclusão da implementação. Sua aplicação à 5.0.1 é de **conferência e classificação**, não de
novo trabalho: o recorte exigido pela §9 da diretriz é exatamente o que já havia sido entregue.

### 15.1 Checklist da §9 · o que devia ser implementado primeiro

| item da §9 | estado | evidência |
|---|---|---|
| shell | ENTREGUE | §7.2 · `#p50-shell` só na tela de pergunta |
| navegação | ENTREGUE | P50-UX6 · proxies de `#back`/`#next` |
| answer semantics | ENTREGUE | P50-UX1 (15 perguntas × 5 valores, pares `t/d`) |
| estados `null` / `"NA"` / `0` | ENTREGUE | P50-UX10 · DOM, rótulo e nome acessível distintos |
| uso dos handlers congelados | ENTREGUE | P50-UX2 · invocação observada; mutante M4 |
| sidebar mínima | ENTREGUE | P50-SUF2 · `n/d` + "Não avaliado", zero score |
| preservação do estado | ENTREGUE | P50-UX9 · `captureCanonicalInputs()` antes == depois |
| acessibilidade funcional mínima | ENTREGUE | P50-ACC6 em Chromium real |
| regressão e determinismo | ENTREGUE | §9 e §10 deste relatório |

### 15.2 Não reintroduzido nesta microfase (§9 da diretriz)

`P50-UX12` completo · fixtures adversariais de rich notes (`P50-F8`, `P50-F10`) · autenticação ·
persistência remota · backend · hardening de deployment · security assurance não necessária ao
resultado funcional. **Nenhum destes foi implementado, iniciado ou parcialmente introduzido.**

### 15.3 Salvaguardas funcionais da §4 — verificação aplicável a 5.0.1

| salvaguarda | estado em 5.0.1 |
|---|---|
| respostas canônicas preservadas | P50-UX1 · nada criado, removido ou reordenado |
| distinção `null` / `"NA"` / `0` | P50-UX10 · três estados distintos; nível 0 exibido, nunca omitido |
| ausência de scores fabricados | P50-SUF2 e P50-SUF0 · a sidebar não exibe score algum |
| suficiência calculada corretamente | `dataSufficiency()` intocada; shell não deriva (P50-SUF0, mutante M7) |
| recomendações rastreáveis · isolamento entre assessments · import/export sem corrupção · rollback | fora do escopo de 5.0.1; **preservados por regressão** — SESSION 97/97, JOURNEY 31/31, REF 28/28, M41 byte-idêntico |
| ausência de mutação canônica por navegação/apresentação | P50-UX6 e P50-UX9 · núcleo desta microfase |
| relatórios HTML/PDF materialmente completos | print intocado · UI 3.3.2 23/23 · visual 67/0/37 · UG4/UG6/UG9 |
| Unicode, pontuação, aspas, `&`, `<`, `>` | satisfeito **por construção** no conteúdo que 5.0.1 renderiza: apenas texto canônico, exclusivamente via `textContent`/`setAttribute`; **zero `innerHTML` em código executável** (verificado). O gate normativo P50-UX12 permanece adiado — ver PHV-19 |
| determinismo do build | A == B · `61e8877e…7506c69d` |
| engine e M41 preservados | `9a4a2e67…` e `9794b267…` byte-idênticos |
| regressões congeladas aplicáveis | todas integrais (§9) |
| ausência de afirmação falsa de salvamento/persistência | P50-SESUX1A · source e superfície renderizada |
| nenhum acesso público ou publicação automática | verificado: zero `fetch`/`XMLHttpRequest`/`WebSocket`/`localStorage`/`sessionStorage`/`indexedDB`/`cookie`/URL remota nos módulos novos |
| nenhuma operação destrutiva silenciosa | shell não escreve `ans`, `notes`, `arq`, `businessPriority`, `TARGET_PROFILE` nem `OPERATIONAL_REFINEMENT` (verificado por varredura) |

### 15.4 Reclassificação de achados sob a §5 da diretriz

Nenhum achado desta microfase afeta correção do assessment, integridade de dados, geração de
relatório, estabilidade da aplicação ou o boundary local/private. Em consequência:

```text
D2 (versão do Chromium)          → backlog PHV-20 · ressalva não bloqueante
P50-UX12 / UI-049 / F8 / F10     → backlog PHV-19 · adiado para 5.0.2 (campos reais de evidência)
```

Ambos registrados em `docs_phase5/BACKLOG_PRODUCTION_HARDENING_VAULT.md`, junto com os 18 itens de
risco aceito da §3 da diretriz (PHV-01..PHV-18). **Nenhum item é representado como resolvido:** o
estado registrado é *risco aceito* ou *adiado*, conforme a §5.7 da diretriz.

### 15.5 Condições de STOP da §6 — nenhuma presente

```text
resultado metodologicamente incorreto              não
score ou recomendação fabricados                   não
relatório/PDF incompleto ou divergente             não · regressão de print integral
perda/corrupção/contaminação de dados de cliente   não · nenhum dado de cliente tocado
regressão de engine, M41, Session ou contrato      não · todas integrais
alteração necessária fora da change boundary       não
necessidade de modificar print                     não
exposição pública não autorizada                   não
operação destrutiva ou publicação não autorizada   não
impossibilidade de cumprir a DoD funcional         não
```

Conforme a §7 da diretriz, **nenhuma rodada adicional de lint, mutação textual ou revisão
documental sem impacto material** foi iniciada.

---

**(estado antes da correção cirúrgica — ver §16.)** Aguardando auditoria independente da microfase 5.0.1, focada em risco material e
funcionalidade.


---

# 16 · Correção cirúrgica pós-auditoria independente (2026-08-20)

Auditoria: **implementação substancialmente aprovada; commit/push não autorizados.** Foram corrigidos
**somente** os itens da lista da auditoria. Nenhum replanejamento, nenhuma alteração de spec, nenhuma
reestruturação de arquitetura.

## 16.1 · Blocker — reentrância causada por decorador (CORRIGIDO)

### Confirmação empírica do defeito (antes de corrigir)

O guard `p50Depth` entrava apenas em `p50AfterRender()`, **depois** que `p50PrevRender()` retornava.
Um decorador registrado por `registerDecor()` executa dentro de `window.__uxDecor`, que por sua vez é
invocado **de dentro** de `p50PrevRender`. Se esse decorador chamar `render()`, a lista de decoradores
era reexecutada antes de `p50Depth` existir na pilha.

Prova executada no build pré-correção, com CAP de 200 para não travar:

```text
execuções do decorador: 201 · esperado normativamente: 1
VEREDITO: BLOCKER CONFIRMADO — reentrância não contida
```

Sem o CAP, a recursão prossegue até estourar a pilha. **A auditoria estava correta.**

### O guard implementado

Guard **material** no nível da composição, em `ui_p50_shell_v32.js`, dentro de `window.__uxDecor`:

```text
p50DecorDepth            profundidade corrente da execução da lista de decoradores P50
p50DecorReentriesBlocked contador de reentrâncias efetivamente contidas

window.__uxDecor(app):
  1. observador (hook de teste), se houver
  2. predecessor congelado — SEMPRE, inclusive no fluxo aninhado
  3. se p50DecorDepth > 0  ->  p50DecorReentriesBlocked++ e RETORNA   (guard)
  4. p50DecorDepth++
  5. lista de decoradores P50, com try/catch POR callback
  6. finally: p50DecorDepth--
```

Contrato da auditoria, item a item:

| # | exigência | como é cumprida |
|---|---|---|
| 1 | invocação externa preserva e executa o predecessor congelado | passo 2, incondicional |
| 2 | lista de decoradores executa uma vez | passos 3–6; teste exige `calls === 1` |
| 3 | `render()` de um decorador não reexecuta a lista | passo 3 retorna cedo no fluxo aninhado |
| 4 | predecessor preservado também no fluxo aninhado | passo 2 ocorre **antes** do guard |
| 5 | não ocorre loop | profundidade limitada a 1; aninhamento não realimenta |
| 6 | a execução termina | comprovado: `calls === 1`, `decorDepth` volta a 0 |
| 7 | DOM final estável | `#ux-execrow` único; shell ausente fora da tela de pergunta |
| 8 | estado canônico inalterado pela proteção | `captureCanonicalInputs()` antes == depois |
| 9 | isolamento de falha por callback preservado | `try/catch` por callback mantido dentro do guard |
| 10 | owner único permanece `ui_p50_shell_v32.js` | lint de source: exatamente uma atribuição `=(?!=)` |

**Nenhum booleano fixo.** O antigo `diag().reentrancyGuard: true` foi **removido**. `diag()` passa a
expor estado material: `decorDepth`, `decorReentriesBlocked`, `shellDepth`, `shellMaxDepth`,
`predecessorInvocations`, `shellErrors`.

### Teste positivo real (subasserção (g) de P50-UX13)

Não depende mais de `__probeReentrancy()` disparando `render()` com `p50Depth` já ativo:

```text
1. instância isolada (boot próprio)
2. registerDecor(fn) onde fn incrementa `calls` e chama __DEV.showResults()
3. aciona o caminho REAL: __DEV.showResults() -> render -> renderResults -> __uxDecor
4. CAP = 8 torna a detecção determinística e limitada — nunca um travamento
5. exige calls === 1
6. exige diag().decorDepth === 0 e decorReentriesBlocked >= 1
7. exige predecessorInvocations crescente (predecessor preservado no aninhamento)
8. exige DOM estável: #ux-execrow único, #p50-shell ausente em resultados
9. exige captureCanonicalInputs() antes == depois
```

`__probeReentrancy()` permanece apenas como **probe secundário** do guard do shell
(`p50AfterRender`), que é um guard distinto e continua válido.

## 16.2 · Mutante obrigatório M11

```text
M11 · neutralizar o guard de reentrância da composição de __uxDecor
      mutação : `if (p50DecorDepth > 0) {...}` -> `if (false) {...}`
      gate    : P50-UX13
      motivo  : "lista de decoradores P50 reexecutada por reentrância: 9 execuções (esperado 1)"
      veredito: DETECTADO
```

Detecção por **contador determinístico**, não por timeout: o harness não fica pendurado e o
diagnóstico é explícito. Nenhum mutante anterior foi substituído.

```text
MUTATION TESTING (5.0.1): 11/11 detectados pelo gate e motivo esperados
restauração: shell OK · css OK · html OK
```

## 16.3 · Evidência visual mínima

Produzidos na **mesma execução Chromium** do P50-ACC6:

```text
docs_phase5/evidence_p50/P50-ACC6-P50-F2-1440.png    1440×900 · fixture P50-F2
docs_phase5/evidence_p50/P50-ACC6-P50-F6-1440.png    1440×900 · fixture P50-F6
docs_phase5/evidence_p50/P50-smoke-P50-F6-390.png     390×844 · smoke NÃO normativo
```

**Determinismo da evidência visual.** A primeira versão do harness capturava a tela antes do fim de
`.screen{animation:fade .35s ease}` (Camada 1, congelado), produzindo PNG **não reproduzível** entre
execuções — detectado ao reverificar o manifesto. O harness passou a aguardar o repouso e a capturar
com `animations:"disabled"`. Duas execuções consecutivas produzem agora screenshots byte-idênticos:

```text
P50-ACC6-P50-F2-1440.png  5800f07f9491288fb18fb3be710320ed15b28064b6589b1d56270305cf53f1d1
P50-ACC6-P50-F6-1440.png  4da8299c171bb445820635116ddb3b7c1454a4fdcadc1f79b2f67b3a3a63edb0
P50-smoke-P50-F6-390.png  c69f1100b7c137d47c9d41adfaa8019fdd6f5a6bf295d7e699063d65eefd0d63
```

**Estes screenshots são evidência visual mínima da 5.0.1. NÃO encerram P50-VIS1..P50-VIS10**, que
permanecem reservados às microfases previstas (5.0.5). Nenhuma alegação de assurance visual completa
é feita aqui.

### Observações visuais registradas

Medições programáticas (Chromium real, ambos os viewports):

```text
overflow horizontal do documento      NÃO
sobreposição sticky × primeiro card   NÃO
clipping de rótulos da sidebar        NÃO (0 rótulos com scrollWidth > clientWidth)
erros de página                       [] (nenhum)
```

**Achado visível registrado — posição inicial do conteúdo (não corrigido nesta rodada).**
A inspeção do screenshot revelou o que a medição isolada não capturava:

```text
1440×900 : #p50-shell tem 788 px de altura · a pergunta começa em y=949  (fold = 900)
 390×844 : #p50-shell tem 1047 px de altura · a pergunta começa em y=1232 (fold = 844)
```

Em ambos os viewports o card da pergunta fica **abaixo da primeira dobra** no carregamento: o shell
ocupa um bloco de altura cheia acima de `#app`, e a coluna da orientação deixa um vazio grande ao
lado da sidebar, que é mais alta.

**Não é violação do critério de aceite de UI-001**, que exige identificar domínio e posição *sem
rolagem para o topo*: a faixa de orientação é `position:sticky` e foi verificada visível enquanto a
pergunta está no viewport, em ambos os tamanhos (`orientVisivelAoVerPergunta: true`). É, ainda assim,
um defeito de usabilidade real.

**Deliberadamente NÃO corrigido nesta rodada**, porque a auditoria determinou "corrija somente os
itens abaixo" e este item pede **registro**, não correção; e porque a solução envolve uma decisão de
desenho (como conciliar a sidebar de 5 domínios com o card da pergunta) que cabe ao proprietário.
Correção sugerida, confinada a `ui_p50_v32.css` — já dentro da boundary: limitar a altura da sidebar
com rolagem interna, ou torná-la um rail lateral, de modo que o shell não empurre `#app` para baixo.
Registrado para decisão; candidato natural à microfase 5.0.5 (refinamento visual).

**Nota de leitura dos screenshots:** o conteúdo de `#app` aparece esmaecido nas capturas por causa de
`.screen{animation:fade .35s ease}` da Camada 1 (congelado) — a captura ocorre durante a animação de
entrada. `getComputedStyle(...).opacity` medido em repouso é **1**. É artefato de captura, não defeito.

## 16.4 · JSON de evidência do P50-ACC6

`docs_phase5/evidence_p50/P50-ACC6-selection-1440.json` passa a registrar, além do verdict:
versão real do Chromium · origem do executável · versão do Playwright · viewport · fixtures ·
`pageErrors` · nomes dos screenshots produzidos · medições do smoke · nota de não-encerramento de
P50-VIS.

## 16.5 · Decisão sobre Chromium (auditoria §3)

```text
Chromium 151.0.7922.34        ACEITO como ressalva não bloqueante da microfase 5.0.1
origem do executável          Chromium gerenciado pelo Playwright
                              (CHROME_PATH indefinido; /opt/google/chrome/chrome ausente)
Playwright                    1.62.1
rota de resolução             CONGELADA e respeitada
execução                      Chromium REAL · sem SKIP
Chromium 141 NÃO foi instalado para esta correção
spec normativa NÃO foi modificada
NÃO se declara que 151 é byte-identicamente o ambiente 141 — o desvio é nominal e está aceito
atualização do ambiente canônico: a decidir antes do freeze completo da Phase 5.0
```

Registrado também como `PHV-20` no backlog `Production Hardening / Assessment Vault`.

## 16.6 · Manifesto final

`docs_phase5/MANIFEST_PHASE5_P50.sha256` foi regenerado **por último**, cobrindo todos os artefatos da
microfase e **excluindo apenas ele próprio**: os 6 módulos/testes, `build_v32_html.py`,
`package.json`, o HTML construído, este relatório, o backlog, os 2 JSONs de evidência e os 3
screenshots. Verificação a partir do conjunto entregue: reportada na §16.8.

## 16.7 · Decisões de desenho ratificadas (auditoria §6)

```text
D-A  navegação anterior/próxima sem escrita direta em `step`                     RATIFICADA
D-B  uso explícito da moeda "respostas confirmadas"                              RATIFICADA
D-C  sidebar sem score executivo                                                 RATIFICADA
D-D  DOM por APIs seguras, sem declarar P50-UX12 encerrado                       RATIFICADA
D5   harness de mutação separado                                                 RATIFICADA
D6   test:p50vis em test:all · SKIP diagnóstico != PASS canônico                 RATIFICADA
D8   alteração nominal e autorizada de package.json                              RATIFICADA
```

Nenhuma reabre a spec nem expande a boundary.

## 16.8 · Reexecução completa após a correção

```text
P50 CORE                                  15 PASS · 0 FAIL de 15
P50-ACC6 (Chromium real 151.0.7922.34)     1 PASS · 0 FAIL de  1 · sem SKIP
Mutantes (11, inclui M11 de reentrância)  11/11 detectados · restauração byte-idêntica

npm run test:all                          exit 0
  MATRIZ 105/105 · UI 19+25+11+23+26 · UX 4.1 56/56 · TARGET 30/30 · REF 28/28
  JOURNEY 31/31 · ICONS 12/12 · SESSION 97/97 · UG 13/13 (UG13 PASS real)
  M41 COMPARAÇÃO PASS · payload 9794b267…3ed4365b (byte-idêntico)
  engine 9a4a2e67…2b5d247a (byte-idêntico)
npm run test:visual                       67 passed · 0 failed · 37 skipped · exit 0
  regressão de print INTEGRAL: UI 3.3.2 23/23 · print.spec · V* · UG4/UG6/UG9

build A                                   61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d
build B                                   61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d
A == B · 603.016 bytes
```

**Anomalia de execução registrada.** Uma execução de `npm run test:visual` reportou `66 passed` em vez
de 67. Essa invocação estava embrulhada em `timeout 500 ... | tail -3`, que envia SIGTERM ao pipeline;
o código de saída observado era o do `tail`. Três execuções seguintes, sem embrulho, retornaram
`67 passed · 0 failed · 37 skipped` com `exit 0`. A contagem congelada está confirmada em 3
execuções consecutivas; a observação anômala fica registrada em vez de omitida.

## 16.9 · Arquivos alterados NESTA correção

| arquivo | pré | pós |
|---|---|---|
| `ui_p50_shell_v32.js` | `e3b13a71…44ff0b84` | `0d2d357c…592b725b` |
| `tests_p50_core.js` | `edaecf48…c225a14f` | `cc3a63fc…c92fdecb` |
| `tests_p50_chromium.js` | `127d0cfc…601a4ca5` | `372911ec…8203625f` |
| `tests_p50_mutants.js` | `6307fbd8…4c4715fe` | `009a879f…43b51bf5` |
| `quickscan_secops_soccmm_v3_2_dev.html` | `e526aff6…c062e15a` | `61e8877e…7506c69d` |
| `docs_phase5/MICROFASE_5_0_1_REPORT.md` | — | atualizado |
| `docs_phase5/MANIFEST_PHASE5_P50.sha256` | — | regenerado por último |

**Inalterados nesta correção:** `ui_p50_v32.css`, `fixtures_p50.js`, `build_v32_html.py`,
`package.json`, `package-lock.json` e todos os 20 arquivos protegidos/normativos.

## 16.10 · Blockers abertos

```text
NENHUM.
```

O blocker de reentrância está corrigido, coberto por teste positivo real e por mutante
discriminante. O achado visual da §16.3 é **ressalva não bloqueante** registrada para decisão.

---

**(estado antes da correção final de UX — ver §17.)**


---

# 17 · Correção final de UX pós-reauditoria estreita (2026-08-20)

Reauditoria: correção do blocker de reentrância **aprovada**. Arquitetura, spec, segurança e ambiente
Chromium **não** foram reabertos. Corrigido apenas o blocker material de usabilidade apontado.

## 17.1 · Decisão aplicada

O mapa do assessment passa a **iniciar recolhido**. Alteração mínima, confinada a
`ui_p50_shell_v32.js`:

```text
var p50Collapsed = false;   ->   var p50Collapsed = true;
```

**Nenhum ajuste de CSS foi necessário** — a regra `#p50-shell[data-p50-collapsed="true"]
.p50-sidebar{display:none}` e o atributo `hidden` já existiam. `ui_p50_v32.css`,
`build_v32_html.py`, `package.json` e `package-lock.json` permanecem **inalterados nesta rodada**.

Não foram implementados: rail flutuante · reestruturação do `.wrap` · mudança da Camada 1 · novo
layout de results · P50-VIS completo · dependências · nova arquitetura.

O estado permanece **efêmero, presentation-only, não serializado, ausente de
`captureCanonicalInputs()`**, controlado pelo botão existente e coberto por P50-UX9 (UI-010A).

## 17.2 · Medidas antes × depois (Chromium real, fixture P50-F6)

| viewport | métrica | antes | depois | critério |
|---|---|---|---|---|
| 1440×900 | altura de `#p50-shell` | 788 px | **193 px** | — |
| 1440×900 | topo da pergunta | 949 px | **364 px** | `< 900` ✔ |
| 1440×900 | topo do 1º answer card | — | **517 px** | `< 900` ✔ |
| 390×844 | altura de `#p50-shell` | 1047 px | **245 px** | — |
| 390×844 | topo da pergunta | 1232 px | **440 px** | `< 844` ✔ |
| 390×844 | topo do 1º answer card | — | **618 px** | `< 844` ✔ |

Em ambos os viewports, no estado inicial: `#p50-shell` presente · `data-p50-collapsed="true"` ·
mapa oculto · botão **"Mostrar mapa do assessment"** visível · `document.scrollWidth <= viewport.width`
· zero clipping · zero sobreposição do sticky · `pageErrors: []`.

## 17.3 · Verificação programática (screenshot não é suficiente)

Bloco `ACEITE-UX-5.0.1` em `tests_p50_chromium.js`, com falha bloqueante, exercitando 1440×900 e
390×844:

```text
questionTop        < viewport.height
firstAnswerCardTop < viewport.height
document.scrollWidth <= viewport.width
collapsed === "true" · sidebar não visível · toggle visível com o rótulo correto
clipping = 0 · sobreposição sticky = false
```

**Nota de nomenclatura:** `ACEITE-UX-5.0.1` **não é** um ID do namespace de gates `P50-<ÁREA><N>` —
é uma verificação de aceite desta correção, deliberadamente fora do namespace para **não** insinuar
abertura de `P50-VIS`. Nenhum ID novo de gate foi criado (reauditoria §4).

## 17.4 · Evidência visual

```text
P50-5.0.1-default-collapsed-1440.png   estado inicial recolhido · 1440×900
P50-5.0.1-default-collapsed-390.png    estado inicial recolhido ·  390×844
P50-5.0.1-map-expanded-1440.png        mapa aberto pelo botão   · 1440×900
P50-ACC6-P50-F2-1440.png               evidência do gate P50-ACC6 · fixture P50-F2
P50-ACC6-P50-F6-1440.png               evidência do gate P50-ACC6 · fixture P50-F6
```

Screenshots byte-idênticos em duas execuções consecutivas.

Prova do estado expandido (medida, não apenas visual):

```text
collapsed  "false"      sidebarVisible true       domains 5      questions 15
estados    unset 13 · na 1 · confirmed 1   (exatamente o vetor de P50-F6)
```

O botão realmente abre o mapa, os cinco domínios continuam presentes, os três estados continuam
corretos e nenhuma informação foi removida. **P50-VIS1..P50-VIS10 permanecem NÃO encerrados** — esta
é assurance visual mínima da 5.0.1.

## 17.5 · P50-UX9 — regressão funcional do toggle

Sem novo ID de gate. Subasserções acrescentadas:

```text
1. estado inicial recolhido (data-p50-collapsed="true", sidebar com [hidden],
   botão rotulado "Mostrar mapa do assessment")
2. clique -> expandido; rótulo passa a "Ocultar mapa do assessment"; 5 domínios presentes
3. clique -> recolhido novamente
4. captureCanonicalInputs() idêntico antes/depois
5. veredito canônico inalterado (o shell não emite score; P50-SUF0 permanece verde)
6. nenhum handler duplicado: 4 cliques -> ["false","true","false","true"]; #p50-shell único
7. estado coerente após "Próxima pergunta" e "Pergunta anterior"; 5 domínios preservados
```

## 17.6 · Distinção dos dois guards (correção factual §5.3)

```text
p50DecorDepth  guard REAL de reentrância da COMPOSIÇÃO: protege a execução da lista de
               decoradores P50 dentro de window.__uxDecor. É o guard que corrige o blocker
               da auditoria; o predecessor congelado fica FORA dele e é sempre invocado.
               Mutante discriminante: M11.

p50Depth       guard do PÓS-RENDER do shell: protege p50AfterRender() (reconstrução do shell
               e decoração dos cards) contra reentrada por render(). Guard distinto,
               anterior, que permanece válido. Probe secundário: __probeReentrancy().
```

## 17.7 · Estado do achado "pergunta abaixo da dobra"

```text
CORRIGIDO — mapa recolhido por padrão; pergunta e primeiro card dentro da primeira dobra
```

Deixa de ser ressalva aberta (§16.3) e passa a corrigido e verificado programaticamente em ambos os
viewports canônicos desta correção.

## 17.8 · Arquivos alterados NESTA rodada

| arquivo | pré | pós |
|---|---|---|
| `ui_p50_shell_v32.js` | `0d2d357c…592b725b` | `f3580683…35a7d3c4` |
| `tests_p50_core.js` | `cc3a63fc…c92fdecb` | `f495c508…5fbeb5b6` |
| `tests_p50_chromium.js` | `372911ec…8203625f` | `465ff268…950e5396` |
| `quickscan_secops_soccmm_v3_2_dev.html` | `c4578d0b…a5aec2db` | `61e8877e…7506c69d` |
| `docs_phase5/MICROFASE_5_0_1_REPORT.md` | — | atualizado |
| `docs_phase5/MANIFEST_PHASE5_P50.sha256` | — | regenerado por último |
| evidências | — | 5 PNG + 2 JSON regenerados |

**Inalterados nesta rodada:** `ui_p50_v32.css` · `fixtures_p50.js` · `tests_p50_mutants.js` ·
`build_v32_html.py` · `package.json` · `package-lock.json` · os 20 protegidos/normativos.

## 17.9 · Reexecução completa

```text
P50 CORE                                   15 PASS · 0 FAIL de 15
P50 CHROMIUM (P50-ACC6 + ACEITE-UX-5.0.1)   2 PASS · 0 FAIL de  2 · Chromium real, sem SKIP
Mutantes                                   11/11 detectados · restauração byte-idêntica

MATRIZ 105/105 · UI 19+25+11+23+26 · UX 4.1 56/56 · TARGET 30/30 · REF 28/28
JOURNEY 31/31 · ICONS 12/12 · SESSION 97/97 · UG 13/13 (UG13 PASS real)
M41 COMPARAÇÃO PASS · payload 9794b267…3ed4365b · engine 9a4a2e67…2b5d247a byte-idênticos
npm run test:visual  67 passed · 0 failed · 37 skipped · exit 0  (print INTEGRAL)

build A == build B = 61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d
603.016 bytes · screenshots byte-idênticos em 2 execuções
```

### Nota de execução — obrigatória e inequívoca

```text
A última invocação monolítica de npm run test:all foi interrompida
por timeout no estágio P50, após todas as suítes congeladas anteriores
terem passado. P50 CORE, P50 Chromium e M41 foram executados
separadamente após a interrupção e passaram. A cobertura cumulativa
de todos os estágios é PASS, com zero FAIL observado.
```

**Nenhum `exit 0` é atribuído a essa última invocação monolítica** — ela não chegou a concluir e,
portanto, não produziu código de saída próprio. As contagens individuais acima permanecem válidas
porque foram observadas nas execuções componentes efetivamente concluídas. `grep -c "^FAIL"` sobre a
saída capturada = 0.

## 17.10 · Blockers abertos

```text
NENHUM.
```

---

**PARADA.** Aguardando a última reauditoria independente estreita da microfase 5.0.1.
