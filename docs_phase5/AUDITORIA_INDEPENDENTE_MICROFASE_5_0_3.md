# AUDITORIA INDEPENDENTE — MICROFASE 5.0.3

## Sufficiency-Aware Results · candidata não commitada, pós-errata estreita

**Resultado: `FAIL` — 2 blockers abertos.**

Auditor independente: agente Claude Opus 5, atuando exclusivamente como auditor.
Data: 2026-08-20. Nenhuma correção foi implementada; a candidata não foi editada;
nenhum commit, push, PR, merge, tag, freeze, release ou deployment foi realizado;
a microfase 5.0.4 não foi iniciada.

Instrução de auditoria conferida antes de qualquer ação:
`PROMPT_AUDITORIA_INDEPENDENTE_MICROFASE_5_0_3.md` · SHA-256
`3f8a11a71864240b111b53d038ae795e5ffee75d05e8a6faa418cc4bccc35335` ·
11.574 bytes · 341 linhas · UTF-8 · 0 CRLF · lida integralmente até EOF.

---

## 1 · Identidade da candidata

```text
repositório      /mnt/c/Projetos/QuickScan-SOC-CMM/phase5
branch           feat/phase5-5-0-3                              CONFERE
HEAD-base        fe4a536a508ed592bf62d1545a90e399036bb43d       CONFERE
origin/main      fe4a536a508ed592bf62d1545a90e399036bb43d
commits sobre origin/main                       0               CONFERE
staged                                          0               CONFERE
tags · releases · deployments                   0               CONFERE
caminhos alterados            14 modificados + 22 novos = 36
```

Identidades exigidas pela §1 da instrução:

| item | exigido | observado | veredito |
|---|---|---|---|
| HTML candidato | `56b9bb5c…eca9fac3` · 657.178 B | `56b9bb5c3cd892a333d7f3c562c43e3e50fd96aab04846b4075f6f68eca9fac3` · 657.178 B | **PASS** |
| `engine_v32.js` | `9a4a2e67…2b5d247a` | idêntico | **PASS** |
| payload M41 | `9794b267…3bed4365b` | idêntico, por harness real (`harness_m41_v313.js`, COMPARAÇÃO PASS) | **PASS** |
| `MANIFEST_PHASE5_P50.sha256` | 47/47 · 0 dup · 0 auto-ref · 0 ausentes | 47 entradas · `sha256sum -c` 47/47 OK · 0 duplicatas · 0 auto-referência · 0 ausentes | **PASS** |

**Completude do manifesto verificada por oracle independente.** O delta real das microfases
5.0.1→5.0.3 (`git diff --name-only b2888f1 HEAD` ∪ `git status`) contém **48 caminhos**; o
manifesto contém exatamente esses 48 menos ele próprio = **47**. Zero ausentes, zero excedentes.
`package-lock.json` corretamente ausente (não pertence ao delta). `package.json` presente
(desvio divulgado da 5.0.1, não reclassificado aqui).

Hashes preflight dos 36 caminhos da candidata: registrados integralmente e reconferidos ao fim.

---

## 2 · Escopo e método

Auditoria dos **bytes da árvore de trabalho**, não do HEAD.

- Cópia temporária integral (`tar` de toda a árvore, excluindo `.git`, `node_modules`,
  `test-results`), com `node_modules` provido pelo caminho canônico já instalado. Identidade da
  cópia conferida arquivo a arquivo contra a candidata **antes** de qualquer execução.
- **Nenhum teste, build, mutante ou probe foi executado na árvore original.** Todas as
  reexecuções, mutações adversariais e probes ocorreram na cópia temporária e em duas cópias
  auxiliares (`base502` = build do HEAD 5.0.2, para prova de regressão; `probe2` = HTMLs isolados).
- Leitura integral: `CLAUDE.md`; `specs/PHASE_5_0_REV_B.md` (SHA conferido `4f1583c7…f004619b`);
  `REV_B_PHASE_OPENING_RECORD.md`; pareceres 5.0.1, 5.0.2 e reauditoria 5.0.2;
  `MICROFASE_5_0_3_REPORT.md`; `ui_p50_suff_v32.js`; `ui_p50_results_v32.js`;
  `tests_p50_core.js`; `tests_p50_chromium.js`; `tests_p50_mutants.js`; `fixtures_p50.js`;
  `build_v32_html.py`; manifesto e evidências.

Ambiente observado (registro explícito, §10 da instrução):

```text
Node        v22.23.2          npm 10.9.8          Python 3.14.4
jsdom       30.0.1            @playwright/test    1.62.1
Chromium    Google Chrome for Testing 151.0.7922.34
            (gerenciado pelo Playwright; /opt/google/chrome/chrome ausente;
             CHROME_PATH não definido — mesma rota de resolução da suíte UG)
revisão nominal histórica da spec: 141.0.7390.37  → divergência MANTIDA EXPLÍCITA (RQ-502-1)
```

---

## 3 · Pre/post da árvore original

```text
inventário PRE   246 arquivos   sha256(inventário) 8fe88b16cb1f73c7dc6e8626b7f3f89d8a0f3012e8b1b6b754f1f9c6fb87bf39
inventário POST  246 arquivos   sha256(inventário) 8fe88b16cb1f73c7dc6e8626b7f3f89d8a0f3012e8b1b6b754f1f9c6fb87bf39

IDENTIDADE PRE/POST: EXATA — 246/246 arquivos byte-idênticos
```

Estado git ao fim: branch `feat/phase5-5-0-3` · HEAD `fe4a536a…` · 0 commits sobre `origin/main` ·
36 caminhos alterados (os mesmos do preflight) · 0 staged · 0 tags.
**A auditoria não deixou rastro na árvore original.**

---

## 4 · Boundary e arquitetura — **PASS**

| verificação (§3 da instrução) | resultado |
|---|---|
| `dataSufficiency()` byte-idêntica e canônica | **PASS** — `return confirmedCount() >= 10 && stats.every(s=>s.n>=2);` idêntica entre a Camada 1 congelada e o build candidato; asserido também por `P50-SUF0(e)` |
| `confirmedCount()` e `domStat()` intactas | **PASS** — byte-idênticas entre `quickscan_secops_soccmm_v3_1_3.html` e o HTML candidato |
| `computeTargetProfile()` / `ui_target_v32.js` intactos | **PASS** — `cfd85cbb…f94bb4a0`, conferido por `P50-GOV1`, `P50-SUF0(e)` e `P50-SUF8` |
| engine · Camada 1 · session · refinement · journey · icons · print · suítes congeladas | **PASS** — 16/16 protegidos byte-idênticos (`P50-GOV1`), confirmado independentemente por `git status` nominal |
| `package.json` / `package-lock.json` | **PASS** — intactos nesta microfase |
| builder alterado só para injetar suff/results | **PASS** — diff de 3 hunks, exclusivamente 2 constantes de caminho, 2 leituras e as 2 entradas de injeção |
| ordem JS session → shell → suff → results | **PASS** — verificada no `inject` e no HTML emitido |
| CSS P50 na posição normativa | **PASS** — após `ui_ux_v32.css`, dentro do `<style>` único |
| `ui_p50_shell_v32.js` owner único de composição | **PASS** — não modificado (`1f9c7a5a…80577b09`); captura única do predecessor; predecessor sempre invocado e antes |
| módulos novos usam `window.__P50.registerDecor` | **PASS** |
| nenhum módulo novo reatribui `window.__uxDecor` | **PASS** — grep no source: zero atribuição em `ui_p50_suff_v32.js` e `ui_p50_results_v32.js` |
| nenhuma segunda composição/owner/persistência/serialização | **PASS** com ressalva de poder discriminante (ver RQ-AUD-2) |
| ausência de símbolos da 5.0.4 (heatmap, drill-down, Current×Target, P50-VIS9) | **PASS** — `P50-SUF0(f)` + inspeção; as únicas ocorrências são prosa de comentário declarando o que **não** foi implementado |

Nenhuma edição em arquivo protegido. **Nenhum blocker de boundary por bytes.**
(A ressalva de comportamento sobre superfície protegida está no blocker **B-AUD-503-2**, §14.)

---

## 5 · Contrato de suficiência — **PASS**

Auditado campo a campo em `ui_p50_suff_v32.js` e provado em execução:

| exigência | resultado |
|---|---|
| exatamente 5 domínios, ordem canônica de `DOMS` | **PASS** — laço sobre `DOMS`, `domainId = i` |
| `confirmedGlobal` correto | **PASS** — lê a função real `confirmedCount()` |
| `requiredGlobal` correto | **PASS** — `10`, da declaração única |
| `missingGlobal` sem negativo | **PASS** — `p50Deficit` clampa em 0 |
| `domainId` · `confirmed` · `required` · `missing` corretos | **PASS** — 1024/1024 vetores |
| `sufficient` só com todos os déficits zero | **PASS** — `missingGlobal===0 && allDomainsMet` |
| `null` e `"NA"` não confirmam | **PASS** — moeda UI-009A herdada de `confirmedCount()`/`domStat().n` |
| `0,1,2,3` confirmam (inclusive `0`/NONE) | **PASS** — exercitado e asserido explicitamente |
| limiares em **uma única** declaração autorizada | **PASS** — `var P50_SUFF_REQUIRED = { global: 10, domain: 2 };` — 1 ocorrência, com comentário normativo de espelho |
| renderer sem limiares e sem fórmula independente | **PASS** — `ui_p50_results_v32.js` não contém `10`; a única ocorrência de `2` é `f[i].sev === 2` (severidade do motor congelado, não limiar) |
| renderer consome exclusivamente o contrato | **PASS** — único acesso canônico direto é `domStat(i).score` já computado, e apenas com gate aberto |
| nenhum domínio satisfeito listado como pendente | **PASS** — `p50Pending` filtra `missing > 0`; asserido nos 1024 vetores |
| todo domínio deficitário listado | **PASS** — idem |
| nenhuma mensagem ou déficit fabricado | **PASS** — todo texto derivado do contrato; `plural()` sem estado |

Comportamento real inspecionado, não apenas lint textual: o contrato foi lido do runtime
(`window.__P50SUFF.contract()`) sobre estado aplicado pelos setters congelados.

---

## 6 · SUF0–SUF8 — **PASS** (reexecutados)

```text
P50-GOV1 · GOV2 · GOV3                                   PASS
P50-UX1 · UX2 · UX3 · UX4 · UX5 · UX6 · UX9 · UX10 · UX12 · UX13   PASS
P50-SUF0 · SUF1 · SUF2 · SUF3 · SUF4 · SUF5 · SUF6        PASS
P50-SUF7 · SUF8                                           PASS
P50-SESUX1A · SESUX2 · SESUX3 · SESUX4 · SESUX5           PASS
P50-COR1 · COR2 · IC3                                     PASS

P50 CORE: 30 PASS · 0 FAIL de 30 · exit 0
P50-SUF6 · asserção nova de print/PDF: BLOCKED pela boundary; NÃO contada como PASS  (linha emitida e conferida)
```

`P50-SUF0` foi auditado em detalhe: proíbe `dataSufficiency` nos renderers e na camada derivada;
proíbe comparação contra `10`/`2` sob qualquer forma; exige exatamente uma declaração nomeada de
limiares; prova equivalência material em 6 vetores; prova que o shell não emite juízo de
suficiência; confere `ui_target_v32.js` e a identidade byte-a-byte de `dataSufficiency()` no build.
Não é lint vacuoso.

---

## 7 · P50-SUF7 e P50-SUF8 — **PASS** (reexecutados, 1024/1024 cada)

**Reexecução independente:** ambos executados nesta auditoria sobre a cópia temporária, com
`P50_ONLY` e sem filtro. `checked === 1024` asserido dentro de cada gate.

| exigência (§5 da instrução) | resultado |
|---|---|
| funções reais do runtime exercitadas | **PASS** — `w.dataSufficiency(…)`, `w.computeTargetProfile(eff)`, `w.__P50SUFF.contract()`; nenhuma reimplementação chamada no lugar |
| equações independentes de soma/max como oracle | **PASS** — `expectedContract()` usa `deficitOracle(req,have)=max(0,req−have)` e as constantes normativas isoladas em `REQ_GLOBAL_ORACLE`/`REQ_DOMAIN_ORACLE` |
| o teste não copia a fórmula de `dataSufficiency()` | **PASS** — o oracle é a aritmética de déficit do contrato (§25.4), não `confirmedCount() >= 10 && every(n>=2)` |
| `ans`, `stats`, `eff` e contrato no mesmo estado semântico | **PASS** — vetor aplicado por `__DEV.setAnswerById` (setter congelado); `stats` por `DOMS.map((_,i)=>domStat(i))`; `eff = vec.slice()` |
| `computeTargetProfile(eff).suff === dataSufficiency(stats) === derived.sufficient` | **PASS** — 1024/1024 |
| estado restaurado após cada vetor | **PASS** — SUF8 zera `ans` e assere `ans.some(v=>v!==null) === false` a cada vetor |
| sem leak acumulado | **PASS** — SUF8 compara `captureCanonicalInputs()` final com o inicial |
| diagnósticos com vetor/campo/esperado/observado | **PASS** — `fail(field, esperado, observado, estado aplicado)` |

**Teste adversarial de tautologia (exigido).** Triangulação verificada: além de comparar o produto
com `expectedContract()` (derivado de `FX.p50ConfirmedByDomain`), SUF7 compara **diretamente**
`got.confirmedGlobal` e `got.domains[i].confirmed` contra as contagens construídas `ns`, que são a
especificação do vetor e não passam por nenhuma função de contagem. Um oracle copiado por
construção seria detectado por essa terceira via. Um gate tautológico **não** passaria nesta forma.

**Gap de poder discriminante encontrado** (não tautologia, mas ausência de prova de proveniência):
ver **RQ-AUD-2** (§15) — os gates provam equivalência numérica, não que a camada derivada de fato
consome `confirmedCount()`/`domStat().n`.

---

## 8 · Coerência integral da tela — **PASS** (foco prioritário)

Medida em Chromium real (151.0.7922.34), na **página inteira**, com `getComputedStyle` + caixa
real + árvore acessível calculada ignorando `aria-hidden` e subárvores não renderizadas.

### 8.1 · Evidência insuficiente (P50-F3 · [1,3,2,2,2] · global satisfeito, Negócio deficitário)

| exigência | observado | veredito |
|---|---|---|
| overall executivo indisponível | `.score-big` = `"n/d / 5.0"` (o runtime congelado já produz `overall=null` sob insuficiência) | **PASS** |
| stages executivos indisponíveis | `.stage-tag` = `"Cobertura insuficiente"` | **PASS** |
| executive cards ausentes | `[data-p50="exec-cards"]` ausente; zero card | **PASS** |
| resumo legado por domínio sem scores parciais visíveis | 5/5 `.lbl > span` (`"3.3 — Defined"`, `"4.2 — Quantitatively Managed"`, …) com `display:none` | **PASS** |
| zero stage legado visível ou acessível | varredura por `/(Non-existent\|Initial\|Managed\|Defined\|Quantitatively Managed\|Optimizing)/` no texto acessível de `#app`: **nenhuma ocorrência** | **PASS** |
| rulers parciais não sugerem score | 5 `.fill` permanecem no DOM (contrato congelado UG3/UG13) e 0/5 visíveis | **PASS** |
| radar parcial ausente da tela e da árvore acessível | `svg` com `visibility:hidden` + `aria-hidden="true"`; nota substituta visível | **PASS** |
| `n/d` + `Não avaliado · evidência insuficiente` coerentes | 5/5 linhas P50 e 5/5 substitutos legados | **PASS** |
| mensagem do painel corresponde ao contrato | `"10 de 10 respostas confirmadas no total."` + `"Negócio: +1 resposta confirmada necessária (1 de 2)."` — exatamente `missingGlobal=0`, `domains[0].missing=1` | **PASS** |
| não existem duas verdades na mesma página | confirmado no texto acessível completo | **PASS** |
| completion e gaps parciais rotulados como diagnóstico | `"1 de 3 respostas confirmadas · diagnóstico parcial, não é veredito de maturidade"`; leitura legada: `"Dados insuficientes para uma leitura consolidada."`; jornada: `"Posicionamento atual: n/d"` | **PASS** |
| erros de página | `pageErrors: []` | **PASS** |

### 8.2 · Estado suficiente (P50-F4 · [2,2,2,2,2] · boundary exato)

Desbloqueio **sem reload** e sem `render()` reconstruindo `#app` (caminho exigido pela errata §3.4,
coberto por `P50-SUF4`/`P50-SUF5` no modo "sem render"): superfície legada integralmente
restaurada (5/5 valores, 5/5 `.conf`, 5/5 fills, radar, legenda), marcadores de neutralização
removidos, substitutos removidos, cards autorizados presentes (`strengths,priorities`), zero
duplicação, zero stale. **PASS**

### 8.3 · Relock (P50-F4 → `"NA"` pelo caminho congelado `#review` → `ArrowLeft` → card "Não sei")

Neutralização reaplicada; zero score/stage/radar/ruler residual; DOM e árvore acessível coerentes;
`#p50-results` reconstruído do zero; owner canônico intacto (`P50-UX9` verde). **PASS**

### 8.4 · Revisão visual das evidências full-page

As 16 capturas `P50-5.0.3-*.png` foram regeradas nesta auditoria a partir do build candidato limpo
e são **byte-idênticas** às entregues — confirmam materialmente o que as medições asseveram.
(A proveniência dessas capturas, contudo, é objeto do blocker **B-AUD-503-1**.)

---

## 9 · UNSET versus NONE e print — **PASS na tela · BLOCKER no print legado**

| exigência (§7 da instrução) | resultado |
|---|---|
| UNSET/`null` não confirma e exibe `n/d`/Não avaliado | **PASS** |
| `"NA"` não confirma | **PASS** (`P50-SUF7`, moeda; `P50-UX10`/`P50-SUF6`) |
| NONE/`0` confirma e nunca é tratado como unanswered | **PASS** — asserido explicitamente em SUF7 (`c0.confirmedGlobal === 10 && sufficient === true`) |
| distinção textual e acessível, não só cromática | **PASS** — `"n confirmadas · n a validar · n não respondidas"` por domínio, no texto acessível |
| UG1–UG13 integrais, UG13 em Chromium real | **PASS** — 13/13, exit 0, UG13 PASS real, **zero SKIP** |
| nós congelados exigidos pelos gates UG estruturalmente intactos | **PASS** — nenhum nó congelado é mutado ou removido; `.fill` permanece no DOM; a ocultação do radar usa `visibility:hidden` justamente para preservar a caixa medida por UG13 |
| a decoração P50 não enfraquece UG | **PASS** |
| `P50-SUF6` de print permanece BLOCKED e não conta como PASS | **PASS** — linha explícita emitida |
| regressão congelada de print passa integralmente | **PASS por contagem** — UI 3.3.2 (PDF) 23/23; `test:visual` 67/0/37 |
| **nenhum byte/símbolo de print alterado** | **PASS em bytes** — `ui_v32.js`/`ui_v32.css` byte-idênticos |
| **comportamento da superfície de print preservado** | **FAIL** — ver blocker **B-AUD-503-2** |

---

## 10 · Integridade histórica e H-19

### 10.1 · Sete artefatos da 5.0.1 — **PASS 7/7**

Conferidos contra os SHA-256 exigidos **e** contra os blobs de
`70154a1bf331ac616ddec0df0430ef2625a45850`:

```text
P50-5.0.1-default-collapsed-1440.png   c989ee1f…6188b1fb   worktree == 70154a1b   OK
P50-5.0.1-default-collapsed-390.png    799dbd56…3d57f88a   worktree == 70154a1b   OK
P50-5.0.1-map-expanded-1440.png        4da8299c…3a63edb0   worktree == 70154a1b   OK
P50-ACC6-P50-F2-1440.png               81fdbac9…4433f21748 worktree == 70154a1b   OK
P50-ACC6-P50-F6-1440.png               c989ee1f…6188b1fb   worktree == 70154a1b   OK
P50-ACC6-selection-1440.json           59bbb135…4bea66943af worktree == 70154a1b  OK
P50-mutation-5.0.1.json                f749d273…2ef362963  worktree == 70154a1b   OK
```

Confirmado independentemente que **os 7 divergem do HEAD** (`fe4a536a`), o que valida a retificação
da errata: o HEAD carrega os bytes reescritos pela 5.0.2, e a restauração correta é retrospectiva.

### 10.2 · Quatro evidências próprias da 5.0.2 — **PASS 4/4**

Byte-idênticas a `e520c05dbc68a3652710fa0704ac09bbbeef9b65`.

### 10.3 · Barreira preventiva — **PARCIAL (raiz do blocker B-AUD-503-1)**

`tests_p50_chromium.js` grava **exclusivamente** nomes com prefixo `P50-5.0.3-`
(`EVIDENCE_PREFIX`), e `P50_NO_EVIDENCE=1` suprime toda escrita.

**Prova executada de que `P50_NO_EVIDENCE=1` suprime SOMENTE escrita e NUNCA asserção:**

```text
build limpo, com a flag     : 4 PASS · 0 FAIL   ·  diff -rq evidence_p50 → NENHUM arquivo escrito
build limpo, sem a flag     : 4 PASS · 0 FAIL   ·  mesmos gates, mesmos vereditos
build MUTADO (M20), com a flag : 3 PASS · 1 FAIL · exit 1
        FAIL P50-SESUX1B [aria-label sobrescreve o conteúdo da live region · 7 estados]
        diff -rq evidence_p50 → NENHUM arquivo escrito
        source restaurado byte-idêntico (1f9c7a5a…80577b09) · HTML restaurado (56b9bb5c…)
```

A supressão é **não-vacuosa e correta**: sob mutação, a asserção executa integralmente, o gate
falha com o motivo semântico certo e nada é gravado.

**Falha da barreira:** ela **não é aplicada a todos os mutantes que invocam a suíte Chromium**.
`tests_p50_mutants.js` invoca `tests_p50_chromium.js` em dois mutantes — M10, com
`P50_NO_EVIDENCE=1`, e **M20, sem a flag**. Ver §14.

### 10.4 · Guarda detectiva — **PASS no escopo declarado, insuficiente no escopo necessário**

`checkHistorical()` fotografa os bytes de todo artefato **histórico** antes da campanha, confere
após **cada** mutante, restaura e aborta nomeando os violados. Reexecutada nesta auditoria com a
campanha completa: **acervo histórico 11/11 byte-idênticos ao início**, tanto na parcial (M20) como
na completa (49 mutantes).

Tentativa de invalidação: nenhuma. A guarda funciona **para o que cobre**.
O problema é o que ela **deliberadamente não cobre**: `HISTORICAL` é definido como
`readdirSync(EVIDENCE_DIR).filter(n => n.indexOf("P50-5.0.3-") !== 0)`, de modo que a evidência da
**microfase corrente** — exatamente a que está sendo entregue como prova — fica sem guarda
preventiva (M20) e sem guarda detectiva.

---

## 11 · Mutação — **PASS 49/49 (reexecutada integralmente)**

Campanha completa reexecutada nesta auditoria, sem filtro:

```text
acervo histórico sob guarda: 11 artefato(s)
MUTATION TESTING (5.0.1+5.0.2+5.0.3): 49/49 mutantes detectados pelo gate e motivo esperados
acervo histórico: 11/11 byte-idênticos ao início
restauração: ui_p50_shell_v32.js OK · ui_p50_v32.css OK · ui_p50_suff_v32.js OK ·
             ui_p50_results_v32.js OK · html OK
```

Para cada mutante foi confirmado: âncora existente (zero `ÂNCORA DE MUTAÇÃO NÃO ENCONTRADA`);
mutação materialmente alteradora (zero no-op); FAIL do gate **esperado**; motivo semanticamente
compatível (o harness recusa `FAIL com motivo INCOMPATÍVEL` — comportamento correto, registrado
pelo implementador em H-26); detecção não dependente de manifesto, erro de browser, fixture
quebrada ou exceção incidental; restauração byte-a-byte por caminho; baseline verde antes e depois;
total derivado de `MUTANT_IDS`, não presumido.

Foco M25–M49 conferido individualmente. Amostras de motivo, verificadas:

```text
M44  P50-SUF1  [legado dom 0: score parcial '3.3 — Defined' permanece visível na tela]
M45  P50-SUF1  [estágio de maturidade acessível na página: 'Defined']
M46  P50-SUF1  [ruler(s) preenchido(s) exposto(s)]
M47  P50-SUF1  [radar parcial não neutralizado]
M48  P50-SUF4  [unlock-sem-render/2-liberado: marcador de neutralização stale após o desbloqueio]
M49  P50-SUF5  [ciclo/5-rebloqueado-sem-render legado dom 0: score parcial '3.3 — Defined' permanece visível]
```

**Mutações adversariais próprias** (executadas na cópia temporária, todas restauradas
byte-idênticas):

| id | mutação adversarial | resultado |
|---|---|---|
| ADV-1 | suíte Chromium com e sem `P50_NO_EVIDENCE=1`, build limpo | gates idênticos; zero escrita sob a flag — **barreira correta** |
| ADV-2 | M20 **com** `P50_NO_EVIDENCE=1` | detectado (FAIL, exit 1) e **zero escrita** — prova de que a correção mínima é gratuita em poder discriminante |
| ADV-3 | camada derivada trocada por **owner paralelo** da moeda (recomputa de `ans`/`QS`; não chama `confirmedCount()` nem `domStat().n`) | **NÃO DETECTADO** — 30/30 core e 4/4 chromium continuam verdes → **RQ-AUD-2** |
| ADV-4 | correção recomendada de B-AUD-503-2 (`@media screen` nas duas regras de neutralização) | UG 13/13 · P50 CHROMIUM 4/4 · UI 3.3.2 23/23; print legado restaurado; tela inalterada — **correção viável e não regressiva** |

Nenhum gate foi enfraquecido por esta auditoria; todas as fontes mutadas foram restauradas com
SHA-256 conferido.

---

## 12 · Regressão e build — **PASS integral**

Reexecução na cópia temporária, cada suíte com o seu próprio código de saída:

```text
engine (MATRIZ M1–M40 + M42–M86 + P2.1)   105 PASS · 0 FAIL     exit 0
UI M3.1                                     19 PASS · 0 FAIL     exit 0
UI 3.2                                      25 PASS · 0 FAIL     exit 0
UI 3.3.1                                    11 PASS · 0 FAIL     exit 0
UI 3.3.2 (PDF/print)                        23 PASS · 0 FAIL     exit 0
UI 3.3.3                                    26 PASS · 0 FAIL     exit 0
UX 4.1                                      56 PASS · 0 FAIL     exit 0
TARGET 4.3.1                                30 PASS · 0 FAIL     exit 0
REF 4.4                                     28 PASS · 0 FAIL     exit 0
JOURNEY 4.5                                 31 PASS · 0 FAIL     exit 0
ICONS 4.6                                   12 PASS · 0 FAIL     exit 0
SESSION 4.8                                 97 PASS · 0 FAIL     exit 0
UNSET UG                                    13 PASS · 0 FAIL     exit 0   (UG13 Chromium real)
P50 CORE                                    30 PASS · 0 FAIL     exit 0
P50 CHROMIUM                                 4 PASS · 0 FAIL     exit 0   (browser real)
P50-SUF7 1024/1024 · P50-SUF8 1024/1024
M41                                COMPARAÇÃO PASS               exit 0   payload 9794b267…
mutação completa                   49/49 detectados              exit 0
test:visual                        67 passed · 0 failed · 37 skipped      exit 0
```

**Zero SKIP** em toda a execução (`grep -i skip` no log de `test:all`: nenhuma ocorrência).
Nenhum PASS foi atribuído a timeout, interrupção, comando parcial ou SKIP.
Todas as contagens coincidem **exatamente** com o baseline declarado no `CLAUDE.md`.

Builds independentes:

```text
Build A     56b9bb5c3cd892a333d7f3c562c43e3e50fd96aab04846b4075f6f68eca9fac3
Build B     56b9bb5c3cd892a333d7f3c562c43e3e50fd96aab04846b4075f6f68eca9fac3
candidato   56b9bb5c3cd892a333d7f3c562c43e3e50fd96aab04846b4075f6f68eca9fac3   657.178 bytes
A == B == candidato ✔
```

Manifesto: **47/47 OK**, 0 duplicatas, 0 auto-referência, 0 ausentes, completude conferida por
oracle independente (§1).

Divergência de browser **Chromium 151.0.7922.34 vs. 141.0.7390.37**: mantida **explícita** e
**não bloqueante** — todos os gates reais passaram em browser real, sem SKIP (RQ-502-1).

---

## 13 · Revisão do relatório e evidências

| alegação material de `MICROFASE_5_0_3_REPORT.md` | verificação |
|---|---|
| inventário completo do delta (§24: 15 modificados + 21 novos) | **CONFERE** com `git status` e com o manifesto |
| hashes pré/pós (§5) | **CONFERE** em todos os itens verificáveis |
| RED real (§3: 20 PASS · 10 FAIL, asserções semânticas) | **PLAUSÍVEL e consistente**; não reproduzível a posteriori (a árvore já contém os módulos) — registrado como não reexecutado |
| contratos e gates (§6–§13) | **CONFERE** |
| contagens (§17, §28) | **CONFERE** integralmente com a minha reexecução |
| mutantes 49/49 (§15) | **CONFERE** — reproduzido |
| H-12..H-18, H-20..H-26 | **CONFERE** — declarados, não escondidos; H-21 (bloco de teste nunca invocado) e H-24 (quebra da suíte UG) são exatamente o tipo de defeito cuja divulgação eu esperaria; crédito devido |
| retificação de H-19 (§16) | **PARCIAL** — a retificação histórica está correta, mas atribui o defeito **apenas a M10**; **M20 ficou sem correção** → blocker B-AUD-503-1 e ressalva RQ-AUD-5 |
| fechamento de B-503-EVIDENCE (§25) | **NÃO FECHADO** — restauração histórica 7/7 correta, porém a classe de defeito permanece aberta para a microfase corrente (B-AUD-503-1) |
| fechamento de B-503-COHERENCE (§26) | **FECHADO NA TELA** (excelente qualidade de engenharia); a correção, porém, **introduziu** regressão na superfície de print legada (B-AUD-503-2) |
| RQ-503-1 realmente resolvida | **RESOLVIDA NA TELA**; o mecanismo escolhido criou o problema de print. Reclassificação recomendada: "resolvida na tela · pendente de escopo de mídia" |
| RQ-502-1 / RQ-502-2 mantidas | **CONFERE** |
| screenshots correspondem ao build candidato e não a mutantes | **PARCIAL/FALSO** — 16 PNGs conferem byte a byte com regeração limpa; os **2 artefatos JSON são provadamente saída de execução mutada** → B-AUD-503-1 |
| nenhum overclaim de print, browser, freeze ou release | **FALSO em um ponto** — §20 afirma que "a 5.0.3 não introduz **nenhuma** semântica nova de impressão"; refutado empiricamente (B-AUD-503-2). Sobre freeze/release/browser não há overclaim: o relatório é correto e contido |
| §4.3 "evidências históricas permanecem byte-idênticas ao HEAD" | **FALSO após a errata** — 7/7 diferem do HEAD por decisão deliberada da própria errata (§25.2). Texto do corpo original não marcado como superado → RQ-AUD-3 |

O relatório é, no conjunto, honesto, autocrítico e de alta qualidade documental; as duas
afirmações falsas acima são consequência de (a) o corpo original não ter sido reconciliado com a
errata e (b) um efeito colateral não percebido da correção de coerência.

---

## 14 · Achados

### **B-AUD-503-1 — BLOCKER — evidência da microfase corrente é saída de execução MUTADA (H-19 não retificado para o prefixo `P50-5.0.3-`)**

- **Severidade:** BLOCKER.
- **Arquivo/símbolo:** `tests_p50_mutants.js` (mutante `M20`, campo `cmd`); `tests_p50_mutants.js`
  (`HISTORICAL` / `checkHistorical`); artefatos entregues
  `docs_phase5/evidence_p50/P50-5.0.3-acc6-selection-1440.json` e
  `docs_phase5/evidence_p50/P50-5.0.3-sufficiency-surface.json`;
  `docs_phase5/MANIFEST_PHASE5_P50.sha256` (registra os bytes contaminados).
- **Fato:** `M20` invoca `cmd: "node tests_p50_chromium.js"` **sem** `P50_NO_EVIDENCE=1` (M10, o
  único mutante corrigido pela errata, tem a flag). Sob M20 o produto está deliberadamente
  defeituoso e a suíte **grava normalmente** toda a evidência `P50-5.0.3-*`. A guarda detectiva
  exclui por construção o prefixo corrente, logo não detecta nem restaura.
- **Reprodução (executada, determinística):**
  1. cópia temporária no estado exato da candidata;
  2. `node tests_p50_chromium.js` limpo →
     `P50-5.0.3-acc6-selection-1440.json` = `23e0855ef4f2b6114c89491c4625cdd01ad3b51e7aeac44077eb938c3dea7c33`, `"verdict": "PASS"`;
  3. `MUT_ONLY=M20 node tests_p50_mutants.js` →
     o mesmo arquivo passa a `f77771d6b770091de1fe29b754d98df06028da577a65b0d8383a42db70fceb2d`,
     **exatamente o hash do artefato entregue na candidata**;
  4. campanha completa (49 mutantes): **18/18** artefatos `P50-5.0.3-*` da cópia ficam
     byte-idênticos aos entregues, com `"verdict": "FAIL"`.
- **Conteúdo mutado congelado na evidência entregue:**
  - `P50-5.0.3-acc6-selection-1440.json` → `"verdict": "FAIL"` (o build candidato limpo produz `"PASS"`);
  - `P50-5.0.3-sufficiency-surface.json` → nas **7** fixturas observadas, o texto acessível contém a
    string injetada pelo mutante `"Estado da sessão: "` e **perde** a linha honesta
    `"Há alterações ainda não exportadas."` produzida pelo build limpo.
  - Os 16 PNGs coincidem byte a byte entre execução limpa e M20 (a mutação de M20 não altera
    pixels), logo **não estão contaminados no conteúdo**, mas têm a mesma proveniência mutada.
- **Impacto:** o pacote de evidência entregue não é retrato do build candidato; um artefato de
  evidência declara `verdict: FAIL` enquanto o relatório declara `P50 CHROMIUM 4 PASS · 0 FAIL`;
  o manifesto sela os bytes contaminados como prova de entrega. É a recorrência exata da classe
  H-19 que a errata se propôs a fechar, deslocada do acervo histórico para o acervo corrente.
- **Requisito violado:** §30.3/§30.7 da REV B (evidência por gate/fixture e relatório com evidência
  fiel); princípio **evidence-first** do `CLAUDE.md` ("todo PASS cita teste/gate/hash executado");
  §8 e §11 da instrução de auditoria ("screenshots correspondem ao build candidato e não a
  mutantes"; "guarda vacuosa … é blocker").
- **Correção mínima recomendada (NÃO aplicada):**
  1. em `tests_p50_mutants.js`, forçar `P50_NO_EVIDENCE=1` no ambiente de **toda** execução de
     `run(cmd)` — não por string em cada mutante, para que nenhum mutante futuro possa escapar
     (provado em ADV-2 que isso mantém a detecção: M20 continua DETECTADO, exit 1, zero escrita);
  2. estender `HISTORICAL` para **todo** `evidence_p50/`, inclusive o prefixo corrente, mantendo a
     restauração + abort;
  3. regerar a evidência `P50-5.0.3-*` a partir do build candidato limpo, **após** a campanha;
  4. regerar `MANIFEST_PHASE5_P50.sha256` por último;
  5. corrigir §16 (H-19) e §25.3 do relatório para registrar que M20 também gravava.

### **B-AUD-503-2 — BLOCKER — a neutralização legada altera a superfície de PRINT no modo legado (regressão em superfície congelada)**

- **Severidade:** BLOCKER.
- **Arquivo/símbolo:** `ui_p50_v32.css`, regras
  `#app .p50-legacy-gone{ display:none !important; }` e
  `#app .p50-legacy-veiled{ visibility:hidden !important; }` (bloco B-503-COHERENCE), declaradas
  **fora** de qualquer `@media`, portanto aplicáveis também a `@media print`; em conjunto com
  `@media print{ … #app .p50-legacy-note{ display:none !important; } }`, que oculta o substituto
  honesto no print.
- **Fato:** `isLegacyModeV32()` é o estado **padrão** do produto (landscape UNSET, arquitetura
  default, sinais vazios, zero plataformas — exatamente o estado de todas as fixturas P50). Nesse
  modo, `preparePrint()` (registrado em `beforeprint`) **não** ativa `v32-print-mode`: a superfície
  impressa é o próprio `#app` dentro de `.wrap`, comportamento congelado da V3.1.3. Sob gate
  fechado, a decoração da 5.0.3 oculta nós congelados também no print.
- **Reprodução (executada, Chromium real, `emulateMedia({media:"print"})` após `beforeprint`):**

  ```text
  fixture P50-F3 (insuficiente) · legacy=true · body=""            .wrap VISÍVEL · #app VISÍVEL
    candidato 56b9bb5c…  valores de domínio  display:none ×5
                          .conf               display:none ×5
                          ruler .fill         display:none ×5
                          radar svg           visibility:hidden
                          .scale-legend       display:none
                          substituto P50      display:none   ← nenhum texto honesto no lugar
    baseline  5d1a301e…  valores de domínio  VISÍVEL ×5
                          .conf               VISÍVEL ×5
                          ruler .fill         VISÍVEL ×5
                          radar svg           VISÍVEL
                          .scale-legend       VISÍVEL
  ```

  `5d1a301e…0c926cd` é o build do HEAD `fe4a536a` (baseline de entrada declarado pela própria
  candidata), reconstruído nesta auditoria. Modo **não** legado: sem impacto (`.wrap` é
  `display:none` e imprime-se `#v32-print-report`) — verificado.
- **Impacto:** um usuário no estado padrão, com evidência insuficiente, que use o botão congelado
  "Imprimir / salvar em PDF" da tela de resultados, passa a receber um PDF com o painel
  "Maturidade indicativa por domínio" **mutilado** — sem valor, sem confiança, sem preenchimento de
  régua, com um radar invisível ocupando espaço — e **sem qualquer substituto textual**. Isto é
  pior que a incoerência que a errata corrigiu: no print não há a verdade P50 para compensar.
- **Por que os gates não pegaram (blind spot):** UI 3.3.2/P1–P11 asseveram o DOM do
  `#v32-print-report` em jsdom, sem CSS; `test:visual` não exercita "modo legado + gate fechado +
  mídia print"; os gates novos de coerência medem apenas mídia de tela. A regressão de print
  permanece **verde por vacuidade** para este cenário.
- **Requisito violado:** REV B §29.6 (Print/Render Boundary — "A Phase 5.0 não recebe autorização
  implícita"); §23/UI-045 (semântica de print **BLOCKED**); §29.1 (superfície print/render
  protegida); §31 DoD (regressão de print integral, sem redução); `CLAUDE.md` invariante 9
  (superfícies 4.x congeladas não são modificadas sem autorização explícita); UI-014/decisão M-1
  ("Esta decisão não autoriza alteração de print na Phase 5.0").
- **Correção mínima recomendada (NÃO aplicada) — verificada viável em ADV-4:**

  ```css
  @media screen{
    #app .p50-legacy-gone{ display:none !important; }
    #app .p50-legacy-veiled{ visibility:hidden !important; }
  }
  ```

  Resultado medido com a correção: print legado **integralmente restaurado** ao baseline; print não
  legado inalterado; **tela inalterada** (neutralização preservada, substituto visível); gates
  `UG 13/13`, `P50 CHROMIUM 4/4`, `UI 3.3.2 23/23`.
  Adicionalmente: criar gate novo (namespace `P50-*`) que, sob gate fechado, em `@media print` e em
  **modo legado**, compare a renderização dos nós congelados com o baseline — fechando o blind
  spot, e não apenas o sintoma.

---

## 15 · Ressalvas não bloqueantes

- **RQ-AUD-1 · `ui_p50_v32.css` contém 162 linhas duplicadas (~33% do arquivo).**
  As linhas 336–489 são cópia verbatim dos blocos "MICROFASE 5.0.2" (151–222) e "5.0.3
  SUFFICIENCY-AWARE RESULTS" (223–304); as linhas 332–334 duplicam o `@media print{ #p50-shell }`
  de 147–149. Verificado por `diff`: blocos byte-idênticos. **Sem efeito funcional ou visual**
  (mesmos seletores, mesma especificidade, mesmos valores), mas infla o HTML entregue em ~5,5 KB e
  compõe o SHA `56b9bb5c…`. Relacionado a H-25, que removeu **outra** duplicação; esta permaneceu.
  Correção mínima: remover as linhas 332–489 (preservando o `@media print` final, 490–493), rodar
  build A/B e regerar o manifesto. Recomenda-se ainda um lint de bloco duplicado nos módulos novos.

- **RQ-AUD-2 · nenhum gate detecta um owner paralelo da moeda de suficiência.**
  Provado em ADV-3: substituindo, em `ui_p50_suff_v32.js`, as leituras de `confirmedCount()` e
  `domStat(i).n` por uma recontagem própria a partir de `ans`/`QS`, **as 34 asserções continuam
  verdes** (30 core + 4 chromium). Os gates provam equivalência **numérica**, não **proveniência**.
  O código entregue **está correto** (lê as funções reais — `ui_p50_suff_v32.js:54` e `:58`), por
  isso a ressalva não é bloqueante; mas viola o espírito de UI-012A §2 deixar isso sem gate.
  Correção mínima: em `P50-SUF0`, lint positivo exigindo `confirmedCount()` e `domStat(...).n` na
  camada derivada e proibindo iteração de `ans`/`QS` para contagem; e, melhor, prova em runtime —
  substituir `confirmedCount`/`domStat` por sentinelas e exigir que o contrato reflita a
  substituição.

- **RQ-AUD-3 · §4.3 do relatório é factualmente falsa após a errata.** Afirma que as evidências
  históricas "permanecem byte-idênticas ao HEAD"; a errata §25.2 estabelece o oposto (restauradas
  de `70154a1b`, logo divergentes do HEAD em 7/7). Correção mínima: marcar §4.3 como superada por
  §25.2.

- **RQ-AUD-4 · §20 do relatório contém overclaim de print.** "a 5.0.3 não introduz **nenhuma**
  semântica nova de impressão" — refutado por B-AUD-503-2. Correção mínima: reescrever após a
  correção de escopo de mídia.

- **RQ-AUD-5 · §16 (H-19) atribui o defeito de contaminação apenas a M10.** M20 invoca a mesma
  suíte e ficou sem a barreira. Correção mínima: reescrever o registro do defeito.

- **RQ-AUD-6 · linha morta em `P50-SUF0`.**
  `if (/\b(?:10|2)\b/.test(…) === false) { /* noop */ }` (`tests_p50_core.js:~582`) não assere
  nada. Inofensiva; remover por higiene, para não ser lida como cobertura existente.

- **RQ-AUD-7 (herdada) · `tests_p50_mutants.js` não consta da lista fechada da §29.2.** É exigido
  como evidência pela §30.8 e foi aceito nos pareceres independentes da 5.0.1 e da 5.0.2. **Não
  reaberto aqui**; registrado para que a spec seja ajustada em revisão futura, e não por acúmulo
  silencioso de precedente.

- **RQ-AUD-8 · fixturas `P50-F7` e `P50-F9` não existem.** A §26 da REV B exige `P50-F1..P50-F10`
  ao fim da fase. Item de fase, não de microfase; deliberado e declarado.

- **RQ-AUD-9 (observação de UX, não defeito) · linha global do painel no caso near-threshold.**
  Com P50-F3, o painel abre com `"10 de 10 respostas confirmadas no total."` estando o gate
  **fechado**. Está correto pelo contrato (`missingGlobal === 0`) e é imediatamente qualificado
  pela linha de déficit, pela orientação e pelo `Resultado executivo: BLOQUEADO` logo abaixo.
  Considerar, em microfase futura, um marcador textual de estado na própria linha global.

- **RQ-502-1 (mantida) ·** Chromium `151.0.7922.34` ≠ revisão nominal `141.0.7390.37`. Todos os
  gates reais passaram em browser real, **sem SKIP**. Não bloqueante; permanece **explícita**.

- **RQ-502-2 (mantida) ·** fechamento amplo de acessibilidade com `@axe-core/playwright@4.13.0`
  previsto para 5.0.5; a dependência **não** foi adicionada nesta microfase (correto).

- **RQ-503-1 · reclassificação recomendada.** Declarada "resolvida" pelo relatório. Está resolvida
  **na tela**, com qualidade — mas o mecanismo escolhido produziu B-AUD-503-2. Reclassificar para
  "resolvida na tela · pendente de escopo de mídia" até a correção.

---

## 16 · Veredito

```text
identidade da candidata ................................ PASS
preservação da árvore original (246/246 pre == post) ... PASS
boundary e arquitetura (bytes) ......................... PASS
contrato de suficiência (campo a campo) ................ PASS
P50-SUF0..SUF8 ......................................... PASS   30/30 core
P50-SUF7 · P50-SUF8 .................................... PASS   1024/1024 · 1024/1024
coerência integral da tela ............................. PASS
UNSET × NONE (tela e acessibilidade) ................... PASS
UG1–UG13 (UG13 Chromium real, zero SKIP) ............... PASS   13/13
integridade histórica (7/7 + 4/4) ...................... PASS
barreira preventiva H-19 ............................... FAIL   parcial (M20 sem a flag)
guarda detectiva H-19 .................................. PASS no escopo declarado · insuficiente
mutação (49/49, restauração byte-idêntica) ............. PASS
regressão congelada (contagens integrais, zero SKIP) ... PASS
determinismo de build (A == B == candidato) ............ PASS
manifesto 47/47 (completude por oracle independente) ... PASS
proveniência da evidência entregue ..................... FAIL   BLOCKER B-AUD-503-1
preservação de comportamento da superfície de print .... FAIL   BLOCKER B-AUD-503-2

RESULTADO FINAL: FAIL — 2 blockers abertos, 11 ressalvas não bloqueantes
```

**Qualificação do veredito.** A engenharia central desta microfase é sólida: o contrato derivado,
a disciplina de consumo, a prova exaustiva 1024×2, a correção de coerência full-page por decoração
da Camada 5 sem tocar um byte protegido, a preservação integral de UG e das treze suítes
congeladas, o determinismo de build e a honestidade do registro de defeitos do próprio harness
(H-12 a H-26) estão acima do padrão. **Nenhum dos dois blockers está na lógica de suficiência.**

Ambos, porém, se enquadram nos critérios de `FAIL` da §12 da instrução:
`B-AUD-503-1` **contamina evidência** e faz um artefato entregue apresentar conclusão contraditória
com o relatório; `B-AUD-503-2` **altera o comportamento de uma superfície protegida** e permanece
**vacuamente verde** na regressão de print. Ambos são reprodutíveis de forma determinística e
ambos têm correção mínima já verificada como viável e não regressiva nesta auditoria.

A microfase 5.0.3 **não** está apta a commit, push, PR, merge, tag, freeze, release ou deployment,
e a microfase 5.0.4 **não** está autorizada. Recomenda-se corrigir os dois blockers, reexecutar a
campanha e a regressão integral, regerar a evidência `P50-5.0.3-*` a partir de build limpo e o
manifesto por último, e submeter a nova reauditoria independente.

---

Corrigidos os dois blockers e reexecutada a evidência a partir de build limpo, esta candidata reúne
condições de obter PASS; no estado auditado, o veredito é **FAIL**.

**PARE.**
