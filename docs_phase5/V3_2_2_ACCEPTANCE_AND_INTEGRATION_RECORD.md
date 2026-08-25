# REGISTRO DE ACEITE E INTEGRAÇÃO DA v3.2.2 — ATO DO PROPRIETÁRIO

**Objeto:** candidata **v3.2.2** — *context keyboard and transition UX*: fechamento do BLOCKER
**B-01** (sequestro do `Enter` global sobre o editor de contexto tecnológico), do **A-01**
(paridade clique × teclado), do **A-02** (preservação de foco e rolagem) e das melhorias
oportunistas **M-01** (reflow do editor), **M-02** (`id="v32errors"` único, junto das ações
Salvar/Cancelar) e **M-05** (contraste WCAG dos dois controles apontados).

**Proprietário e auditor do projeto:** Flávio Costa.
**Data do ato:** 2026-08-25.
**Branch da candidata:** `fix/v3.2.2-context-footer-print-ux`.
**HEAD sobre o qual a candidata foi auditada:** `07bc90b3fbf6f033a56c490f3bff1951c58316b7` (tag `v3.2.1`).

Este documento registra um **ato do proprietário**. Não é um parecer de auditoria, não substitui o
parecer independente e não reescreve nenhum byte dele.

---

## 1 · Veredito independente aceito

A reauditoria independente estreita da candidata v3.2.2 sobre o pacote **REV C** emitiu:

```text
PASS COM RESSALVAS NÃO BLOQUEANTES — elegível para integração
```

| Eixo do parecer | Veredito |
|---|---|
| §1 · Preflight de identidade | **CONFORME** |
| §2 · B-01 e A-01 · semântica de `Enter` | **CONFORME (12/12)** |
| §2.1 · Prova por mutante independente | **B-01 reproduzido no mutante, ausente na candidata** |
| §3 · A-02 · preservação de foco | **CONFORME (5/5)** |
| §4 · Melhorias oportunistas M-01/M-02/M-05 | **CONFORME (3/3)** |
| §5 · Smoke dos invariantes canônicos | **CONFORME (5/5)** |
| §6 · Ausência de bloqueio órfão do relatório/PDF | **CONFORME** |
| §7 · Ressalvas R1–R4 | **não bloqueantes · backlog aceito** |

Zero blockers. Nenhum achado atingiu o limiar de FAIL.

O parecer declara expressamente, em §9: *“Este parecer não promove, não congela e não declara fase
concluída. Essa decisão é do proprietário.”* O presente documento é esse ato, restrito a **aceite e
integração**, **sem** freeze de fase, **sem** tag, **sem** release publicada e **sem** deployment.

---

## 2 · Identidade dos bytes aceitos

### 2.1 · Parecer independente importado

```text
arquivo destino : docs_phase5/PARECER_REAUDITORIA_INDEPENDENTE_V3_2_2_REV_C_2026-08-25.md
SHA-256         : 8071a7acdca388609116740c46cb406552e667ee873da03d668711a5f76f1a4c
tamanho         : 18.933 bytes
linhas          : 271
encoding        : UTF-8 sem BOM · terminadores LF · último byte 0x0A
importação      : cópia byte a byte, sem normalização, sem reformatação, sem edição
verificação     : SHA-256 recalculado no destino + `cmp` origem × destino → idênticos
```

### 2.2 · Artefato candidato

```text
HTML autocontido : quickscan_secops_soccmm_v3_2_dev.html
SHA-256          : 913440adc157e850e100c98a706ad6e6793e3556981bb78a4736500cd1c02879
tamanho          : 1.014.061 bytes
engine           : 9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a  (inalterado)
payload M41      : 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b  (inalterado)
runtimeToolVersion : 3.4.0-dev.4.8.0.7  (inalterado)
```

O HTML da candidata é **byte-idêntico** ao `quickscan_secops_soccmm_v3_2_2_candidate.html`
distribuído no pacote externo REV C e sobre o qual as suítes congeladas foram executadas —
comprovado por `cmp` na presente rodada de integração. A cadeia de evidência está fechada.

### 2.3 · Pacote externo de revisão independente (fora do repositório)

```text
QUICKSCAN_V3_2_2_INDEPENDENT_ANALYST_REVIEW_PACKAGE_2026-08-25_REV_C.zip
SHA-256   : 1c02aafc3cb5e6091c84c5b4d75d96918d5deecf96178de3a296cdfff7a1419e
tamanho   : 1.000.634 bytes
entradas  : 24 arquivos
sidecar   : .zip.sha256 confere
manifesto interno : MANIFEST_SHA256.txt · 23 entradas · sha256sum -c → 23 OK, 0 falhas
```

### 2.4 · Superfícies de produção **não** alteradas

Verificadas byte a byte contra a identidade da v3.2.1 nesta rodada — **17/17 OK**:
`engine_v32.js`, `ui_v32.js`, `ui_ux_v32.js`, `ui_session_v32.js`, `ui_target_v32.js`,
`ui_journey_v32.js`, `ui_icons_v32.js`, `ui_refinement_v32.js`, `ui_p50_shell_v32.js`,
`ui_p50_suff_v32.js`, `ui_p50_results_v32.js`, `ui_v32.css`, `ui_ux_v32.css`, `ui_p50_v32.css`,
`build_v32_html.py`, `package.json`, `quickscan_secops_soccmm_v3_1_3.html`.

O motor de pontuação, recomendações, suficiência e Target **não foi tocado**.

---

## 3 · Assurance já executada (atribuída à candidata)

Executada na rodada da errata final REV C, sobre o HTML de SHA-256
`913440adc157e850e100c98a706ad6e6793e3556981bb78a4736500cd1c02879`.

| suíte | contagem | baseline congelado |
|---|---|---|
| engine (`tests_m42_m86.js`) | **105 PASS · 0 FAIL** | 105 |
| UI 3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | **19 · 25 · 11 · 23 · 26** | 19+25+11+23+26 |
| UX 4.1 | **56 PASS · 0 FAIL** | 56 |
| Target 4.3.1 | **30 PASS · 0 FAIL** | 30 |
| Refinement 4.4 | **28 PASS · 0 FAIL** | 28 |
| Journey 4.5 | **31 PASS · 0 FAIL** | 31 |
| Icons 4.6 | **12 PASS · 0 FAIL** | 12 |
| Session 4.8 | **97 PASS · 0 FAIL** | 97/97 |
| UNSET geometry (UG) | **13 PASS · 0 FAIL** | 13 |
| P50 core + P51 | **64 PASS · 0 FAIL** | 64 |
| P50 chromium + P51 | **27 PASS · 0 FAIL** | 27 |
| P52 layout | **45 PASS · 0 FAIL** | 45 |
| P52 chromium | **55 PASS · 0 FAIL** | 55 |
| M41 | **PASS** · payload `9794b267…` idêntico ao baseline | PASS |
| `npm run test:visual` | **67 passed · 0 failed · 37 skipped** | 67/0/37 |
| campanha mutante dirigida (§8) | **29/29** detectados pelo gate e pelo motivo esperados | — |

`TESTALL_EXIT=0` · `VISUAL_EXIT=0`.

**Declarado como NÃO executado:** a campanha integral de **96 mutantes** não foi executada nesta
linha; a campanha dirigida de 29 mutantes cobre os caminhos modificados. A primeira execução da
campanha dirigida foi **27/29**, com dois mutantes classificados como **no-op**; a remediação
**fortaleceu** o gate (passou a medir qual cláusula está em vigor por classe de controle T1–T12)
em vez de enfraquecê-lo. Registro honesto, conforme disciplina evidence-first.

---

## 4 · Verificações independentes K1–K12 (§2 do parecer)

Oráculo por **estado canônico e tela resultante** (`__DEV.captureCanonicalInputs()`,
`__DEV._stateJSON()`, `body[data-uxscreen]`, número da pergunta, vivacidade do editor e do `draft`),
nunca por texto ou presença de nó. Duas execuções por caso, em contextos de navegador independentes:
uma por `element.click()`, outra por `element.focus()` + `Enter` real. Chromium do Playwright,
`file://`, sem rede.

| caso | verificação | resultado |
|---|---|---|
| K1 | `Enter` em **Adicionar contexto tecnológico** abre o editor e não inicia o questionário | **PASS** |
| K2 | `Enter` no select **Situação declarada**: editor permanece; tela e estado inalterados | **PASS** |
| K3 | `Enter` em **Salvar contexto** (HOME): grava, draft limpo, sem bloqueio órfão | **PASS** |
| K4 | `Enter` em **Cancelar**: draft limpo, canônico salvo preservado | **PASS** |
| K5 | `Enter` em **Importar sessão**: executa a ação, não inicia o questionário | **PASS** |
| K6 | `Enter` em **← Voltar**: volta exatamente uma pergunta, nunca avança | **PASS** |
| K7 | `Enter` em **Adicionar evidência ou observação**: alterna a caixa, não muda de pergunta | **PASS** |
| K8 | idem K3 pela entrada dos **RESULTADOS**: paridade com a home | **PASS** |
| K9 | `Enter` num card de resposta: seleciona | **PASS** |
| K10 | `Enter` com foco fora de controle, numa pergunta: atalho global permanece vivo | **PASS** |
| K11 | `Enter` em **← Voltar** nas prioridades: volta ao questionário, nunca publica | **PASS** |
| K12 | `Enter` com foco fora de controle no editor aberto pela home: não inicia o scan, sem draft órfão | **PASS** |

**Prova de causalidade (§2.1).** Mutante independente neutralizando
`KeyboardEvent.prototype.stopPropagation` reproduz **B-01 integralmente** — contexto descartado,
`draft` vivo e órfão, `safePrint()` → `false`, `window.print` nativo nunca chamado. A candidata
intacta não o reproduz. O guard é *load-bearing* e o BLOCKER está fechado.

**Bateria adversarial (§2.3), 7 casos, todos limpos.** `Espaço` em card `.opt` seleciona · `Escape`
ainda fecha modal · `Ctrl+Enter` corretamente blindado · 10× `Enter` em `<summary>` sem degradação
e sem draft órfão · `Enter` em `<textarea>` insere quebra de linha sem trocar de pergunta.

---

## 5 · Ressalvas R1–R4 — aceitas como backlog

Nenhuma impede a integração. Nenhuma reabre o ciclo. **Nenhuma foi corrigida nesta rodada**, por
decisão expressa do proprietário.

| id | ressalva | destino |
|---|---|---|
| **R1** | Ergonomia de teclado após Salvar/Cancelar na home: o foco vai para `<body>`, não para um controle significativo. Não é violação de A-02 (o exigido era **não** restaurar foco em tela já fechada) e não é regressão — o clique se comporta igual. | **backlog** |
| **R2** | Dívida arquitetural: `stopPropagation()` no guard de `<html>` deixará silenciosamente morto qualquer ouvinte futuro de `Enter` em `document` (bolha) ou `window`. Hoje é seguro — confirmado por enumeração exaustiva; risco é de manutenção futura. Recomendado gate de regressão que falhe ao introduzir tal ouvinte. | **backlog** |
| **R3** | Acoplamento de `p52RealHome()` ao id literal `#start` da camada congelada. | **backlog** |
| **R4** | Cobertura de campanha mutante: a campanha integral de 96 mutantes não foi executada; a dirigida (29/29) é adequada ao escopo estreito. | **registrado, não bloqueia** |

Backlog preexistente permanece intocado (M-03, M-04, L-01…L-08, refatoração do monólito,
modularização estrutural, arquitetura do editor).

---

## 6 · O que este ato **não** faz

1. **Não promove a v3.2.2 a produção.** A produção ativa continua sendo a **v3.2.1**
   (`quickscan_secops_soccmm_v3_2_1.html` · SHA-256
   `fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79` · 963.373 bytes ·
   release `v3.2.1`, commit `07bc90b3fbf6f033a56c490f3bff1951c58316b7`).
2. **Não cria tag, GitHub Release nem deployment.**
3. **Não declara fase concluída, congelada ou selada.**
4. **Não introduz melhoria funcional nova** durante a integração.
5. **Não corrige** R1–R4 nem qualquer item de backlog.
6. **Não reexecuta** a regressão histórica integral nem a campanha de 96 mutantes.
7. **Não toca** `AGENTS.md` — arquivo não rastreado, preexistente, excluído nominalmente do
   manifesto e fora do escopo da entrega.

---

## 7 · Manifesto

O manifesto final da rodada é `docs_phase5/MANIFEST_V3_2_2.sha256`. Ele exclui a si próprio e exclui
nominalmente `AGENTS.md`, e inclui o parecer independente importado e este registro de aceite.
Verificação exigida: `sha256sum -c` integralmente verde.
