# Microfase 5.0.3 — Sufficiency-Aware Results

**Relatório de entrega da candidata.** Documento factual de implementação; **não** é auditoria.
A microfase **não** está concluída nem congelada: só o auditor declara. Nenhuma autoauditoria foi
realizada.

---

## 1 · Baseline de entrada

```text
core                 quickscan_v32_audit_package_4807.zip
engine_v32.js        9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
M41 (payload)        9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
HTML de entrada      5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd  (621.138 bytes)
MANIFEST_PHASE5_P50  26/26 OK na entrada
spec normativa       specs/PHASE_5_0_REV_B.md · 4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b
diretriz de execução DIRETRIZ_COMPLETA_MICROFASE_5_0_3.md
                     94bf81def50524412a3f19ba71eba6ae18f1db18846169ef56ba20e85224b11d
                     22.254 bytes · 679 linhas · UTF-8 · 0 CRLF  (identidade conferida antes de agir)
```

## 2 · Branch e HEAD-base

```text
branch          feat/phase5-5-0-3
HEAD-base       fe4a536a508ed592bf62d1545a90e399036bb43d   (merge da 5.0.2 em main)
commits         0 (nenhum commit criado nesta rodada)
tags/release    nenhuma
```

Preflight completo aceito pelo proprietário na rodada anterior; nesta rodada foi feita apenas a
reconfirmação curta determinada no início da diretriz (branch, HEAD, 0 commits, worktree limpo,
`ui_p50_suff_v32.js` e `ui_p50_results_v32.js` inexistentes) — todas verdadeiras.

## 3 · RED observado (antes de qualquer código de produção)

Fixtures e gates foram escritos primeiro e executados contra a árvore **sem** os módulos novos:

```text
P50 CORE (antes da implementação): 20 PASS · 10 FAIL de 30 · exit 1

FAIL  P50-UX13   [ui_p50_suff_v32.js ausente]
FAIL  P50-SUF0   [renderer ausente: ui_p50_results_v32.js]
FAIL  P50-SUF1   [P50-F2: superfície nova de resultados ausente]
FAIL  P50-SUF2   [P50-F2: linha de domínio 0 ausente na superfície nova]
FAIL  P50-SUF3   [camada derivada de suficiência ausente (window.__P50SUFF.contract)]
FAIL  P50-SUF4   [Cannot read properties of null (reading 'getAttribute')]
FAIL  P50-SUF5   [Cannot read properties of null (reading 'getAttribute')]
FAIL  P50-SUF6   [composição do domínio 0 ausente na superfície nova]
FAIL  P50-SUF7   [camada derivada de suficiência ausente (window.__P50SUFF.contract)]
FAIL  P50-SUF8   [camada derivada de suficiência ausente (window.__P50SUFF.contract)]
```

O RED alcançou **asserções semânticas**: a suíte inicializou integralmente, as 20 asserções
anteriores permaneceram verdes, não houve erro de sintaxe, fixture inválida, import quebrado,
browser ausente nem timeout. As duas falhas por `null.getAttribute` (SUF4/SUF5) foram consideradas
diagnóstico insuficiente e receberam guarda explícita **ainda na fase vermelha**, antes de existir
qualquer código de produção. Registro bruto preservado durante a execução.

## 4 · Arquivos adicionados, modificados e protegidos

### 4.1 Adicionados (2 módulos + 13 evidências)

```text
ui_p50_suff_v32.js                     camada derivada de suficiência (UI-012A)
ui_p50_results_v32.js                  renderer do gate executivo (UI-012/013/014/020)
docs_phase5/MICROFASE_5_0_3_REPORT.md  este relatório
docs_phase5/evidence_p50/P50-5.0.3-partial-insufficient-1440.png
docs_phase5/evidence_p50/P50-5.0.3-near-threshold-1440.png
docs_phase5/evidence_p50/P50-5.0.3-exactly-sufficient-1440.png
docs_phase5/evidence_p50/P50-5.0.3-fully-sufficient-1440.png
docs_phase5/evidence_p50/P50-5.0.3-relocked-1440.png
docs_phase5/evidence_p50/P50-5.0.3-insufficient-390.png
docs_phase5/evidence_p50/P50-5.0.3-sufficient-390.png
docs_phase5/evidence_p50/P50-5.0.3-panel-blocked-1440.png     (captura do elemento)
docs_phase5/evidence_p50/P50-5.0.3-gate-blocked-1440.png      (captura do elemento)
docs_phase5/evidence_p50/P50-5.0.3-panel-released-1440.png    (captura do elemento)
docs_phase5/evidence_p50/P50-5.0.3-gate-released-1440.png     (captura do elemento)
docs_phase5/evidence_p50/P50-5.0.3-sufficiency-surface.json
docs_phase5/evidence_p50/P50-5.0.3-mutation.json
```

### 4.2 Modificados

```text
fixtures_p50.js                        + P50-F3, P50-F4, P50-F5 e p50ApplyResults
tests_p50_core.js                      P50-SUF0 reestruturado; + SUF1, SUF3..SUF8; SUF2 e UX13 ampliados
tests_p50_chromium.js                  + ACEITE-UX-5.0.3 e evidência própria
tests_p50_mutants.js                   + M25..M43; baseline por caminho; evidência nova
ui_p50_v32.css                         estilos da superfície da 5.0.3 (tokens congelados, zero hex)
build_v32_html.py                      + 2 injeções, na ordem normativa
quickscan_secops_soccmm_v3_2_dev.html  output determinístico do builder
docs_phase5/MANIFEST_PHASE5_P50.sha256 regenerado por último
```

### 4.3 Não modificados (verificação programática)

`ui_p50_shell_v32.js` **não foi tocado**: `1f9c7a5a…80577b09` antes e depois. Os módulos novos se
integraram exclusivamente por `window.__P50.registerDecor`, sem exigir uma linha sequer no owner de
composição.

Permanecem byte-idênticos, conferidos por `git status` nominal e por `P50-GOV1`:
`engine_v32.js` · Camada 1 · `ui_v32.js` · `ui_ux_v32.js` · `ui_target_v32.js` ·
`ui_refinement_v32.js` · `ui_journey_v32.js` · `ui_session_v32.js` · `ui_icons_v32.js` ·
`ui_v32.css` · `ui_ux_v32.css` · `generate_icons_v32.py` · `harness_m41_v313.js` ·
`v3_1_3_functional_snapshot.json` · `MANIFEST.sha256` do core · `SESSION_SCHEMA_V32.md` ·
as 13 suítes congeladas · `tests_visual/` · `specs/` · `CLAUDE.md` · registros normativos ·
**`package.json` e `package-lock.json` intocados**.

> **AFIRMAÇÃO SUPERADA (errata pós-auditoria FAIL · §31.5).** A frase original — de que as
> evidências históricas permaneciam byte-idênticas ao **HEAD** — não descreve o estado entregue e
> **não deve ser lida como verdadeira**. Sete artefatos da 5.0.1
> (`P50-5.0.1-default-collapsed-1440.png`, `P50-5.0.1-default-collapsed-390.png`,
> `P50-5.0.1-map-expanded-1440.png`, `P50-ACC6-P50-F2-1440.png`, `P50-ACC6-P50-F6-1440.png`,
> `P50-ACC6-selection-1440.json`, `P50-mutation-5.0.1.json`) foram **restaurados ao commit auditado
> `70154a1bf331ac616ddec0df0430ef2625a45850`** e, por isso, **divergem deliberadamente do HEAD**
> desta branch — o HEAD já contém o merge da 5.0.2, que os havia regravado. A divergência é
> **intencional e correta**: evidência é retrato do momento em que foi produzida.
>
> As **quatro** evidências da 5.0.2 (`P50-5.0.2-*`) permanecem, essas sim, byte-idênticas ao commit
> auditado `e520c05dbc68a3652710fa0704ac09bbbeef9b65`.

## 5 · Hashes por estado — baseline, candidata de entrada da errata e candidata final

> **RECONCILIADA PELA ERRATA DOCUMENTAL PÓS-REAUDITORIA (`RQ-REAUD-1`).** A versão anterior desta
> tabela tinha uma única coluna `pós` que misturava dois estados distintos: o resultado da
> implementação inicial (entrada da errata pós-auditoria FAIL) e o estado final entregue. Cinco das
> onze linhas exibiam, como se fossem correntes, valores superados — `ui_p50_v32.css`
> `766f579b…`, `tests_p50_core.js` `2be4e45c…`, `tests_p50_chromium.js` `53c07a90…`,
> `tests_p50_mutants.js` `6b272799…` e o HTML `56b9bb5c…` (657.178 B). A tabela abaixo separa os
> três estados e **todos** os seus hashes foram **recalculados diretamente dos bytes** nesta rodada,
> não copiados de outra seção. Os valores da coluna final coincidem com §35.1 e com
> `MANIFEST_PHASE5_P50.sha256`.

| arquivo | baseline · `HEAD fe4a536a` | candidata de ENTRADA da errata pós-auditoria (superada) | candidata FINAL corrente |
|---|---|---|---|
| `ui_p50_suff_v32.js` | (inexistente) | idem à final | `cdb4a6edcc8eee64c33d7410301ddcf059e725ffa588ca009b16fc7afd6e5a32` (inalterado pela errata) |
| `ui_p50_results_v32.js` | (inexistente) | idem à final | `9694ef05c518e2ad11100f2ce0b3c15a7e9be2587c5a2a59de51d6768d30e670` (inalterado pela errata) |
| `ui_p50_shell_v32.js` | `1f9c7a5a8ad10b724f9caab86eead66eeb5ad6df1f397c4b41b0b75380577b09` | idem (igual nos três estados) | `1f9c7a5a8ad10b724f9caab86eead66eeb5ad6df1f397c4b41b0b75380577b09` (**intocado**) |
| `ui_p50_v32.css` | `e873d90d22f0460592003c27d08e38ff26eafbf44c9b3d9f0ea661e05bef35fb` (8.104 B) | `766f579baed9c1aebd79d550f56293d731efa2076f04600ecf7467ea69b5ac9e` | `9fe665be8e29af25a2e86ed2beda2e5774cbebb4feb6b6ce35c469ba5b02f44a` (13.440 B) |
| `fixtures_p50.js` | `b7f5b31039f6da4864510b458da5e899bca29dc482cc8abe0d2ff5d25caa82d7` | idem à final | `90b2a7d2a3044094a3bafb48b6954a28d171e307733f451e4495b445023bc9b5` (inalterado pela errata) |
| `tests_p50_core.js` | `9817c46e09fe39cf9a874821772ce1e00a15283eee4c21305a5b5e358aa65242` | `2be4e45cbb5a2ac23d99fda828c4fe9f8819a3e03a71fcfc65389d5811d01846` | `ff6e26469c7ee41109e33068477d991c983d4d495969b5625ecadeb4a88927bc` |
| `tests_p50_chromium.js` | `2c99e932dc4ac167714916c4ca2ae480c6a2e51afae93d01ea895a4ac9c6efdd` | `53c07a90366ca09440d08e7bd804df763bfb8e6867cfe064344174f40f7c6ed9` | `8d3996b855abbc3e510cdbe63cceff46255230f300c24fe0734d7d32de308316` |
| `tests_p50_mutants.js` | `774f9325ad3cc58a7247c58fe5c92231fc2ec3a422f923d31bdb3c4c979326fc` | `6b2727997b1d42a136e4beab0f62b6abad138e387e4511b53d6e4cd6c71003ae` | `245337cb7c43ff0c0ea61f4e9561f653eae80c657bc92c177c50ecfd6c05fedb` |
| `build_v32_html.py` | `f2295a421e59e77825530d77069a6d0350e9a01af8fdf506a6d1482416456a9e` | idem à final | `bce37fef5e4722e6e6215186f33c9f0af030bb03e706504a30ca80fededc07bc` (inalterado pela errata) |
| `quickscan_secops_soccmm_v3_2_dev.html` | `5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd` (621.138 B) | `56b9bb5c3cd892a333d7f3c562c43e3e50fd96aab04846b4075f6f68eca9fac3` (657.178 B) | `4c7f678b53202b4f540cb3694fec32c382303c42246d427a2615c4c462d4dd29` (651.513 B) |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | idem (igual nos três estados) | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` (**inalterado**) |

Os cinco arquivos cuja coluna final difere da coluna de entrada — `ui_p50_v32.css`,
`tests_p50_core.js`, `tests_p50_chromium.js`, `tests_p50_mutants.js` e o HTML — mudaram pelas
correções documentadas em §32 (`@media screen`), §34.1 (remoção de CSS duplicado + `P50-DUP1`),
§32.3 (`P50-PR1`) e §34.2 (`M50`, `P50-SUF0` fortalecido). Os hashes da coluna de ENTRADA
permanecem registrados **apenas** como trilha histórica; nenhum deles descreve a árvore corrente.

## 6 · Arquitetura do contrato derivado

`dataSufficiency()` permanece a **fonte funcional canônica**: booleana, byte-idêntica, sem alteração
de assinatura, retorno, posição ou comportamento. A Camada 5 introduz uma **projeção estruturada** do
mesmo estado, lendo as funções reais `confirmedCount()` e `domStat(i).n` no escopo compartilhado.

```text
{
  confirmedGlobal,   requiredGlobal,   missingGlobal,
  domains: [ { domainId, confirmed, required, missing } × 5, na ordem canônica de DOMS ],
  sufficient
}
```

- `domainId` é o **índice canônico** de `DOMS` (a mesma identidade usada por `q.dom` no runtime);
- `missing` nunca é negativo — há um único ponto de aritmética de déficit (`p50Deficit`);
- `sufficient` só é verdadeiro com `missingGlobal === 0` **e** todos os déficits de domínio zerados;
- o contrato **não** é serializado, não entra na sessão, não vai para storage e é sempre derivado
  do estado canônico no momento da leitura;
- a camada derivada **não chama** `dataSufficiency()`: se delegasse, a equivalência deixaria de ser
  provada e passaria a ser tautológica. `P50-SUF0` lint proíbe explicitamente essa delegação.

**Moeda canônica (UI-009A):** confirmada é exatamente `v !== null && v !== "NA"`. Não se usa
truthiness em ponto algum: `0` (NONE) confirma; `null` (UNSET) e `"NA"` não confirmam.

## 7 · Declaração única de limiares

```js
var P50_SUFF_REQUIRED = { global: 10, domain: 2 };   /* ui_p50_suff_v32.js */
```

Única declaração nova de limiares na Camada 5, documentada como **espelho** dos literais da
Camada 1 — espelho **provado**, não presumido (P50-SUF7, 1024 vetores). `P50-SUF0` exige
programaticamente que exista **exatamente uma** ocorrência dessa declaração, que ela contenha
`global: 10` e `domain: 2`, e que nenhum outro limiar seja declarado fora dela.

Nos renderers (`ui_p50_shell_v32.js`, `ui_p50_results_v32.js`, `ui_p50_v32.css`) o lint recusa:
qualquer comparação de ordem contra `10` ou `2`, `=== 10`/`== 10`, `confirmedCount() <op>`,
`domStat(...).n <op>`, referência a `dataSufficiency` e recálculo de déficit a partir de literal.
`=== 2` **não** é banido: é a severidade que o motor congelado já define (`MAP[...].lv[a].s`), nunca
um limiar de suficiência.

## 8 · Responsabilidade dos módulos

**`ui_p50_suff_v32.js`** — declaração única dos limiares; produção do contrato; painel visual de
suficiência (`#p50-suff`); linha global; lista de déficits por domínio; composição dos três estados
por domínio; funções exportadas (`contract`, `pending`, `axis`, `globalLine`, `deficitLine`);
decorator registrado no agregador.

**`ui_p50_results_v32.js`** — gate executivo (`#p50-results`): bloqueio, liberação, rebloqueio,
`n/d` + "Não avaliado · evidência insuficiente" por domínio, executive cards estritamente gated.
Consome **exclusivamente** o contrato. O único dado canônico lido diretamente é `domStat(i).score`
(score já computado, exibido apenas com o gate aberto) e a classificação de severidade já produzida
por `computeFindings()`.

**Não implementado, deliberadamente (5.0.4):** heat map domínio→pergunta, drill-down, Current ×
Target, gap de target, P50-VIS9. `P50-SUF0` faz lint dos símbolos correspondentes no **código**
executável dos módulos novos.

**Nada é fabricado.** Os cards refletem a classificação que o motor congelado já produziu, na ordem
que ele já produziu: *Pontos fortes* = respostas confirmadas cuja severidade canônica é 0;
*Prioridades de evolução* = `computeFindings().findings` de severidade alta, na ordem do motor.
Onde não há dado canônico, o card **declara a ausência** (ex.: "Nenhum gap alto foi identificado
entre as respostas confirmadas desta sessão.") em vez de inventar conteúdo. O card *Gap to Target*
**não** foi criado: não há dado canônico de target dentro do escopo desta microfase.

## 9 · Fixtures

| fixture | contagens por domínio | total | veredito | papel |
|---|---|---|---|---|
| **P50-F3** Near threshold | `[1, 3, 2, 2, 2]` | 10 | insuficiente | requisito **global satisfeito** e ainda assim bloqueado: Negócio com 1 de 2 |
| **P50-F4** Exactly sufficient | `[2, 2, 2, 2, 2]` | 10 | suficiente | boundary mínimo exato |
| **P50-F5** Fully sufficient | `[3, 3, 3, 3, 3]` | 15 | suficiente | cobertura completa |

Aplicadas pelos owners/setters canônicos; determinísticas; nomes e IDs canônicos preservados;
P50-F1/F2/F6/F8/F10 intactas; **P50-F7 e P50-F9 não foram criadas**, nem como placeholder; nenhuma
antecipação de target ou de presença geométrica.

Validação **estrutural** das contagens declaradas: `p50AssertFixtureCounts()` recalcula as contagens
de cada fixture pelo oracle independente e falha explicitamente se divergirem — executada como
pré-condição de `P50-SUF0`.

## 10 · Gates P50-SUF0 a P50-SUF8

```text
PASS  P50-SUF0  nenhum renderer é dono de lógica de suficiência; limiar declarado uma única vez
PASS  P50-SUF1  estado insuficiente não expõe overall, estágio nem executive card na superfície nova
PASS  P50-SUF2  domínio sem resposta confirmada exibe n/d + 'Não avaliado', nunca 0.0
PASS  P50-SUF3  mensagem do gate provém campo a campo do contrato derivado
PASS  P50-SUF4  transição real insuficiente → suficiente desbloqueia sem conteúdo stale
PASS  P50-SUF5  transição real suficiente → insuficiente rebloqueia e limpa o executivo
PASS  P50-SUF6  UNSET, NA e NONE distintos em tela, texto e nome acessível na superfície nova
PASS  P50-SUF7  gate exaustivo do contrato derivado — 1024 vetores, campo a campo
PASS  P50-SUF8  equivalência tripla sobre o MESMO estado — 1024 vetores, sem leak
```

`P50-SUF0` prova, além do lint: Camada 1 e `dataSufficiency()` byte-idênticas no build;
`ui_target_v32.js` intacto; e — materialmente — que em seis estados distintos o atributo
`data-p50-gate` da UI coincide com o veredito de `dataSufficiency()` real.

`P50-SUF4` e `P50-SUF5` percorrem o **caminho real**: `#review` congelado → navegação para trás por
`ArrowLeft` → clique nos botões canônicos `.opt[data-i]` / `.opt[data-i="NA"]`, que acionam o setter
congelado e `render()`. Nenhuma escrita direta em `ans[k]` nas transições. Em `P50-SUF5` o número de
remoções não é presumido: remove-se até o **veredito canônico** rebloquear.

`P50-SUF6` prova os três estados na superfície nova (`1 confirmada · 1 a validar · 1 não respondida`,
com o mesmo conteúdo no texto acessível, sem `aria-label` sobrescrevendo) **e** na superfície de
perguntas (`unset` / `na` / `confirmed` com nomes acessíveis distintos).

> `new print/PDF assertion for P50-SUF6: BLOCKED by normative boundary; not counted as PASS`
>
> `frozen print regression: executed and passed`  (UI 3.3.2 · 23/23 · exit 0)

## 11 · P50-SUF7 — 1024/1024

Espaço completo `(n₁..n₅) ∈ {0,1,2,3}⁵` = **1024 vetores**, todos executados. Para cada vetor foram
exigidas todas as igualdades do contrato (`confirmedGlobal`, `requiredGlobal`, `missingGlobal`,
`domains[i].confirmed/required/missing`, ausência de déficit negativo, `sufficient`) contra o oracle
independente de soma/max, **mais** `derived.sufficient === dataSufficiency(stats)` com a função real,
**mais** a correção das razões emitidas: nenhum domínio satisfeito emitido, todo domínio deficitário
emitido, nenhum déficit incorreto.

Cada vetor realiza os slots não confirmados alternando `null` e `"NA"`, e os confirmados percorrendo
`0..3` — de modo que `0` (NONE) é exercitado como confirmação em larga escala. O gate exige
explicitamente que `0` tenha sido exercitado e que `null`/`"NA"` tenham aparecido.

Prova adicional de moeda no limiar: a partir de `[2,2,2,2,2]` (suficiente), substituir **uma**
confirmação por `null` ou por `"NA"` fecha o gate e leva `confirmedGlobal` a 9; substituir por `0`
mantém 10 e o gate aberto. Nos três casos o veredito derivado é comparado com o canônico real.

Diagnóstico de divergência inclui vetor, campo, esperado, observado e o estado aplicado completo.

**Oracle:** as funções reais (`dataSufficiency`, `confirmedCount`, `domStat`) são os **objetos
submetidos à comparação**; as equações independentes são o **oracle de correção**. Nenhuma cópia da
fórmula de `dataSufficiency()` foi criada no teste — o oracle é aritmética de soma/max sobre o vetor
da fixture, calculada em `expectedContract()`.

## 12 · P50-SUF8 — 1024/1024

Para cada um dos mesmos 1024 vetores: aplicação ao owner canônico `ans` pelos setters permitidos;
`stats` pela via canônica; `eff` construído **independentemente** a partir do vetor aplicado; leitura
da camada derivada sobre o mesmo estado; chamada das funções **reais**; e a exigência

```text
computeTargetProfile(eff).suff === dataSufficiency(stats) === derived.sufficient
```

Nenhum stub substituiu função real e nenhuma fórmula canônica foi copiada como segundo oracle.
`ui_target_v32.js` conferido byte-idêntico ao fim do gate.

## 13 · Isolamento e restauração de estado

Passo 8 do protocolo: após cada vetor o owner `ans` é restaurado a `null` em todas as 15 posições e
a restauração é **verificada** (`ans.some(v => v !== null)` deve ser falso) antes do vetor seguinte —
falha aponta o vetor exato. Ao fim dos 1024 vetores, o documento canônico completo
(`captureCanonicalInputs()`) é comparado com o snapshot inicial: **ausência de leak acumulado**
provada por igualdade estrita, não por amostragem.

## 14 · Chromium e evidência visual

Chromium **real** 151.0.7922.34 · Playwright 1.62.1 · zero SKIP.

**Estado CORRENTE da suíte Chromium** (reconciliado pela errata documental pós-reauditoria,
`RQ-REAUD-1`):

```text
PASS  P50-ACC6            estado programático da seleção coerente com o estado canônico
PASS  P50-SESUX1B         status de sessão renderizado corresponde ao estado real
PASS  ACEITE-UX-5.0.1     mapa recolhido por padrão; pergunta e 1º card na primeira dobra
PASS  ACEITE-UX-5.0.3     gate de suficiência, déficits, n/d e layout da superfície nova
PASS  P50-PR1             print legado preservado sob gate fechado (guard ADICIONAL e ESTREITO)
P50 CHROMIUM: 5 PASS · 0 FAIL · 0 SKIP · Chromium real · código de saída próprio: exit 0
```

`P50-PR1` foi acrescentado pela errata pós-auditoria FAIL (§32.3) e é **guard adicional e
estreito** sobre um blind spot específico do print legado: **não encerra, não redefine e não
substitui `P50-VIS10`**, que continua aberto e integral como a regressão congelada prevista na
REV B.

> **REGISTRO HISTÓRICO — SUPERADO PELA ERRATA PÓS-AUDITORIA.** Antes de `P50-PR1` esta seção
> declarava `P50 CHROMIUM: 4 PASS · 0 FAIL de 4 · exit 0`, com os quatro gates acima e sem o guard
> de print. Aquele número descreve a rodada **pré-`P50-PR1`** e **não** é o estado corrente; o
> estado vigente é o bloco de 5 PASS logo acima, confirmado em §35 (linha 5) e §35.1.

`ACEITE-UX-5.0.3` é **verificação de aceite**, não gate do namespace `P50-VIS`/`P50-ACC`: os IDs
`P50-VIS1..P50-VIS10` e `P50-ACC1..P50-ACC5` permanecem reservados às microfases previstas e **não**
são declarados encerrados. Falha nela bloqueia a execução.

Cada screenshot corresponde a asserções executáveis sobre o mesmo estado: `data-p50-gate` esperado,
`data-p50-sufficient`, conjunto exato de déficits (domínio + número), número presente no texto
acessível, ausência de executive cards / overall / estágio sob bloqueio, `n/d` + "Não avaliado" +
"evidência insuficiente" em todos os cinco domínios, score canônico com o gate aberto, composição
textual dos três estados, **zero overflow horizontal**, **zero nó clipado** e ausência de
sobreposição entre o painel e a superfície de resultados. Estados observados:

| evidência | fixture | viewport | gate | déficits |
|---|---|---|---|---|
| `P50-5.0.3-partial-insufficient-1440.png` | P50-F2 | 1440×900 | blocked | 1:1 · 2:2 · 3:1 · 4:2 |
| `P50-5.0.3-near-threshold-1440.png` | P50-F3 | 1440×900 | blocked | 0:1 |
| `P50-5.0.3-exactly-sufficient-1440.png` | P50-F4 | 1440×900 | released | — |
| `P50-5.0.3-fully-sufficient-1440.png` | P50-F5 | 1440×900 | released | — |
| `P50-5.0.3-relocked-1440.png` | P50-F4 → "Não sei" (caminho real) | 1440×900 | blocked | 0:1 |
| `P50-5.0.3-insufficient-390.png` | P50-F3 | 390×844 | blocked | 0:1 |
| `P50-5.0.3-sufficient-390.png` | P50-F4 | 390×844 | released | — |

Quatro capturas **do elemento** foram acrescentadas (`P50-5.0.3-panel-blocked/released-1440.png`,
`P50-5.0.3-gate-blocked/released-1440.png`): em `fullPage` a superfície nova fica no rodapé de uma
página muito alta e a evidência não é materialmente legível — mesma correção adotada em 5.0.2
(M-502-3). JSON de evidência: `P50-5.0.3-sufficiency-surface.json` (fixture, viewport, browser,
seletores, contrato observado, bloqueio, elementos presentes/ausentes, nomes acessíveis, layout e
veredito).

Nenhuma visualização de heat map ou target foi implementada; `P50-VIS9` não foi criado.

## 15 · Mutation testing

Numeração continuada em **M25**; total derivado do inventário real de `MUTANT_IDS`, não presumido.

| id | mutação | gate esperado |
|---|---|---|
| M25 | limiar global alterado | P50-SUF7 |
| M26 | limiar por domínio alterado | P50-SUF7 |
| M27 | `null` conta como confirmado | P50-SUF7 |
| M28 | `"NA"` conta como confirmado | P50-SUF7 |
| M29 | `0` deixa de confirmar na composição por domínio | P50-SUF6 |
| M30 | `missingGlobal` incorreto e negativo | P50-SUF7 |
| M31 | déficit de domínio incorreto e negativo | P50-SUF7 |
| M32 | domínio satisfeito listado como pendente | P50-SUF7 |
| M33 | domínio deficitário omitido | P50-SUF3 |
| M34 | `sufficient` considera somente o requisito global | P50-SUF7 |
| M35 | renderer do gate contém limiar literal | P50-SUF0 |
| M36 | renderer do gate reimplementa a comparação | P50-SUF0 |
| M37 | estágio executivo exposto com gate fechado | P50-SUF1 |
| M38 | executive cards expostos com gate fechado | P50-SUF1 |
| M39 | desbloqueio não ocorre | P50-SUF4 |
| M40 | limpeza de stale não ocorre | P50-SUF5 |
| M41 | `0` deixa de confirmar no **contrato** (distinto de M29) | P50-SUF7 |
| M42 | ordem canônica de `DOMS` quebrada no contrato | P50-SUF7 |
| M43 | score parcial promovido a veredito sob gate fechado | P50-SUF2 |

M41–M43 (e, pela errata, M44–M49) são IDs adicionais criados porque atacam defeitos **materialmente distintos** dos da matriz
mínima (contrato × composição; ordem canônica; promoção de score parcial).

> **REGISTRO HISTÓRICO — SUPERADO PELA ERRATA PÓS-AUDITORIA.** O bloco abaixo é o resultado da
> campanha **antes** de `M50` e `M51`. O inventário corrente é de **51 mutantes** e o resultado
> corrente é **51/51**, com acervo de evidência **29/29** byte-idêntico e zero escrita — ver §33 e
> §35 (linha 1). O `49/49` abaixo **não** é o estado corrente.

```text
MUTATION TESTING (5.0.1+5.0.2+5.0.3): 49/49 mutantes detectados pelo gate e motivo esperados
restauração: ui_p50_shell_v32.js OK · ui_p50_v32.css OK · ui_p50_suff_v32.js OK ·
             ui_p50_results_v32.js OK · html OK
exit 0
```

Cada mutante altera materialmente o alvo (verificado: nenhuma âncora ausente, nenhuma substituição
no-op), é detectado pelo gate semanticamente correspondente com motivo compatível — nunca apenas por
manifesto ou erro ambiental — e a restauração é conferida **byte a byte** por caminho. Evidência:
`P50-5.0.3-mutation.json`. Nenhum gate foi enfraquecido para acomodar mutante.

## 16 · Defeitos do próprio harness — registrados

**Detectados pela campanha de mutação (perda real de poder discriminante):**

- **H-12 · P50-SUF0 deixou de detectar M7.** Ao reestruturar o lint para acomodar a camada derivada,
  a regra passou a exigir o identificador imediatamente antes do operador, e
  `confirmedCount() >= 10` (M7, da 5.0.1) escapou. Corrigido com regras precisas — comparação de
  ordem contra `10`/`2`, `confirmedCount() <op>` e `domStat(...).n <op>` — sem falso positivo sobre
  `sev === 2`. M7 voltou a ser detectado.
- **H-13 · M40 era no-op.** O render congelado recria `#app` a cada passagem, de modo que a não
  remoção da superfície anterior nunca era observável por aquele caminho. A resposta foi
  **fortalecer o gate**, não trocar o mutante: `P50-SUF5` passa a decorar novamente **sem render**
  (caminho congelado real de `ui_v32.js`, botão de limpar landscape) e a exigir superfície única e
  ausência de card stale. M40 passou a ser detectado.

**Detectados durante a fase vermelha/verde (corrigidos antes de qualquer PASS):**

- **H-14** · `P50-SUF4` navegava com `ArrowRight`, que não é rota congelada quando há pergunta sem
  resposta; substituído por navegação exclusivamente para trás a partir de `#review`.
- **H-15** · `P50-SUF5` presumia que **uma** remoção bastaria para rebloquear; falso para P50-F5.
  Passou a remover até o veredito canônico virar, sem presumir a quantidade.
- **H-16** · `answersOf()` não retornava array; substituído por leitura direta do owner real.
- **H-17** · `P50-SUF6` usava seletores inexistentes (`data-p50="qstate"`); reancorado nos seletores
  reais já usados por `P50-UX10`.
- **H-18** · O array compartilhado de screenshots fez a evidência histórica
  `P50-ACC6-selection-1440.json` absorver nomes de arquivo da 5.0.3. Corrigido com recorte por
  prefixo; o arquivo histórico voltou a ser byte-idêntico ao HEAD.

**Defeito de contaminação de evidência (grave, corrigido estruturalmente):**

- **H-19 · a campanha de mutação sobrescrevia o acervo de evidência com render MUTADO.** O mutante
  M10 executa `tests_p50_chromium.js` com o produto deliberadamente defeituoso; aquela execução
  regravava **todos** os PNGs e JSONs de evidência — inclusive `P50-5.0.1-*`, `P50-5.0.2-*` e
  `P50-ACC6-*` — com a saída do produto mutado, e a restauração do harness cobria apenas os sources.

  **RETIFICAÇÃO (errata estreita · B-503-EVIDENCE).** A conclusão que eu registrei aqui — de que um
  `git checkout` das evidências seguido de execução limpa provava a descontaminação — **estava
  errada**. O `HEAD` desta branch já contém o merge da 5.0.2, e a 5.0.2 havia regravado os sete
  artefatos históricos da 5.0.1. Restaurar a partir do `HEAD` devolvia os bytes do baseline auditado
  da **5.0.2**, não os snapshots originais da **5.0.1** — portanto não provava restauração histórica
  coisa nenhuma. Conferência independente reproduzida por mim: comparando os blobs de
  `70154a1bf331ac616ddec0df0430ef2625a45850` (commit auditado da 5.0.1) com
  `e520c05dbc68a3652710fa0704ac09bbbeef9b65` (commit auditado da 5.0.2), a divergência é **7/7**, e a
  árvore de trabalho carregava exatamente os bytes da 5.0.2.

  A correção correta está registrada em §25 (B-503-EVIDENCE).

  **SEGUNDA RETIFICAÇÃO (errata pós-auditoria FAIL · B-AUD-503-1).** O registro acima nomeava
  apenas **M10** como o mutante que executava a suíte Chromium. Estava **incompleto**: a suíte é
  invocada por **M10 e M20**, e apenas M10 carregava `P50_NO_EVIDENCE=1` na sua string `cmd`. M20
  executava o produto mutado e regravava todo o prefixo `P50-5.0.3-*` — exatamente o prefixo que a
  guarda daquela versão **excluía** do escopo. A evidência entregue da candidata estava, portanto,
  contaminada (`verdict: FAIL`, string mutante `Estado da sessão: ` em sete fixtures).

  A correção final **não** foi aplicada mutante a mutante: foi **centralizada no runner**, no
  ambiente de toda execução disparada por `run()`. Nenhum mutante presente ou futuro depende de
  lembrar da flag — `M10` inclusive deixou de carregá-la, para que a centralização fique provada.
Nenhum desses defeitos foi ocultado; nenhum gate foi enfraquecido para contorná-los.

## 17 · Regressão congelada

Todas as suítes executadas individualmente, cada uma com o seu próprio código de saída:

```text
engine   (M1–M40 + M42–M86 + P2.1)   105 PASS · 0 FAIL   exit 0
UI 3.1                                19 PASS · 0 FAIL   exit 0
UI 3.2                                25 PASS · 0 FAIL   exit 0
UI 3.3.1                              11 PASS · 0 FAIL   exit 0
UI 3.3.2 (PDF/print)                  23 PASS · 0 FAIL   exit 0
UI 3.3.3                              26 PASS · 0 FAIL   exit 0
UX 4.1                                56 PASS · 0 FAIL   exit 0
TARGET 4.3.1                          30 PASS · 0 FAIL   exit 0
REF 4.4                               28 PASS · 0 FAIL   exit 0
JOURNEY 4.5                           31 PASS · 0 FAIL   exit 0
ICONS 4.6                             12 PASS · 0 FAIL   exit 0
SESSION 4.8                           97 PASS · 0 FAIL   exit 0
UNSET UG                              13 PASS · 0 FAIL   exit 0   (UG13 em Chromium real)
M41                                   COMPARAÇÃO PASS    exit 0
P50 CORE                              31 PASS · 0 FAIL   exit 0
P50 CHROMIUM                           5 PASS · 0 FAIL · 0 SKIP   exit 0
  dos quais P50-PR1                    PASS adicional     (guard estreito; NÃO encerra P50-VIS10)
test:visual                  67 passed · 0 failed · 37 skipped   exit 0
```

> **RECONCILIADO PELA ERRATA DOCUMENTAL PÓS-REAUDITORIA (`RQ-REAUD-1`).** As duas linhas P50 deste
> quadro exibiam `P50 CORE 30` e `P50 CHROMIUM 4`, contagens da rodada **anterior** a `P50-DUP1` e
> a `P50-PR1`. O estado corrente é `31` e `5 · 0 SKIP`, conforme §35 (linhas 4 e 5). As demais
> contagens congeladas **não** foram alteradas: permanecem exatamente como observadas na rodada
> executável.

As contagens congeladas (não P50) coincidem exatamente com o baseline. As duas contagens P50 que
diferem do baseline histórico o fazem por **inclusão nominal de guard novo**, sem que nenhum gate
anterior tenha sido removido, renomeado ou enfraquecido: `P50 CORE 30 → 31` (`+1` = `P50-DUP1`,
§34.1) e `P50 CHROMIUM 4 → 5` (`+1` = `P50-PR1`, §32.3). A regressão de print — **23/23, exit 0** —
**prova preservação**; não autoriza semântica nova de print.

## 18 · Builds A/B

**Estado CORRENTE** (reconciliado pela errata documental pós-reauditoria, `RQ-REAUD-1`; hashes
recalculados dos bytes nesta rodada):

```text
Build A     4c7f678b53202b4f540cb3694fec32c382303c42246d427a2615c4c462d4dd29   exit 0
Build B     4c7f678b53202b4f540cb3694fec32c382303c42246d427a2615c4c462d4dd29   exit 0
candidato   4c7f678b53202b4f540cb3694fec32c382303c42246d427a2615c4c462d4dd29   651.513 bytes
A == B == candidato ✔   temporários removidos; nenhum output promovido como release
```

> **REGISTRO HISTÓRICO — SUPERADO PELA ERRATA PÓS-AUDITORIA.** A versão anterior deste bloco
> declarava `Build A == Build B == candidato = 56b9bb5c…eca9fac3 · 657.178 bytes`. Esse SHA é o
> **HTML de ENTRADA da errata pós-auditoria**, não o candidato final: o build determinístico da
> candidata final é `4c7f678b…62d4dd29`, 651.513 bytes, como no bloco corrente acima e em §35.1.
> A diferença de 5.665 bytes é explicada em §35.1.

Ordem JS obtida no builder, conforme §15 da diretriz:
`ui_session_v32.js` → `ui_p50_shell_v32.js` → `ui_p50_suff_v32.js` → `ui_p50_results_v32.js`.
A posição normativa do CSS P50 foi preservada; leitura, encoding, base HTML, output e substituições
não foram reestruturados. O SHA novo do HTML é esperado; engine e baseline externa permanecem
intocados.

## 19 · Engine e M41

```text
engine_v32.js   9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a   inalterado
M41 payload     9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b   inalterado
```

## 20 · Print preservado

> **OVERCLAIM RETIRADO (errata pós-auditoria FAIL · §32).** A afirmação original de que a 5.0.3
> não introduzia **nenhuma** semântica nova de impressão **estava errada** e é retirada. As regras
> de neutralização `.p50-legacy-gone` / `.p50-legacy-veiled` foram declaradas **sem escopo de
> mídia** e, no modo legado — em que `preparePrint()` devolve `{legacy:true}` e `.wrap`/`#app` é a
> superfície impressa —, vazavam para o papel e mutilavam o relatório legado: os cinco valores de
> domínio, os cinco `.conf`, os cinco fills, o radar e a legenda desapareciam. Esse foi o blocker
> **B-AUD-503-2**.
>
> **Correção:** as duas regras passaram a viver dentro de `@media screen`. `ui_v32.js`,
> `ui_v32.css`, `preparePrint()` e `buildPrintReport()` permanecem byte-idênticos.
>
> **Prova:** guard executável novo **`P50-PR1`** (§32.3) mais o mutante **`M51`**, que remove o
> escopo `@media screen` e faz `P50-PR1` falhar pelo motivo correto.

`UI 3.3.2 (PDF)` 23/23 exit 0 — comportamento de print/PDF byte-compatível, agora **também** sob
gate de suficiência fechado, o que a suíte congelada não exercitava. O substituto P50 permanece
oculto no print (`#app .p50-legacy-note`, `#p50-suff`, `#p50-results`, `#p50-shell` e demais
componentes P50 são `display:none !important` em `@media print`): a Phase 5 **não** está autorizada
a criar semântica nova de impressão, e a regra correta no papel é **não agir**, não agir de outro
modo. A asserção nova de print/PDF associada a `P50-SUF6` permanece **BLOCKED** pela boundary
normativa e **não** conta como PASS.

## 21 · Limitações declaradas

1. ~~A tela congelada de resultados continua exibindo score parcial por domínio sob gate fechado.~~
   **RESOLVIDO pela errata estreita** — ver §26 (B-503-COHERENCE). A superfície legada passa a ser
   neutralizada por decoração Layer 5, sem tocar em `ui_v32.js`.
2. **A superfície nova não exibe overall nem estágio, mesmo com o gate aberto** — deliberado: o
   consolidado já é produzido pelo runtime congelado, e recomputá-lo na Camada 5 duplicaria
   matemática de motor sem necessidade.
3. **O card `Gap to Target` não foi criado** — não há dado canônico de target dentro do escopo desta
   microfase; pertence à 5.0.4.
4. **`P50-VIS1..P50-VIS10` e `P50-ACC1..P50-ACC5` continuam abertos**; a verificação de aceite
   Chromium desta microfase não os encerra.
5. **Filtro opcional de execução** (`P50_ONLY`, `MUT_ONLY`) foi introduzido para a campanha de
   mutação. Sem a variável, tudo executa; quando ativo, a saída declara `[FILTRADO]` / `[PARCIAL]`.
   Todas as execuções de entrega registradas neste relatório foram **sem filtro**.

## 22 · Blockers e ressalvas

**Blockers abertos: nenhum conhecido.** A candidata **não** foi auto-auditada; a inexistência de
blocker aqui é a observação do implementador, não um veredito de auditoria.

Ressalvas não bloqueantes herdadas e mantidas:

- **RQ-502-1** — a revisão do browser (151.0.7922.34) difere da revisão nominal histórica da spec
  (141.0.7390.37); todos os gates canônicos de browser passaram sem SKIP.
- **RQ-502-2** — o fechamento amplo de acessibilidade com axe-core permanece previsto para 5.0.5.
- **RQ-503-1 — RESOLVIDA NA TELA E ISOLADA DE PRINT** (qualificação obrigatória da errata
  pós-auditoria FAIL; a palavra `resolvida` sem qualificação **não** era sustentável antes da prova,
  porque a correção de tela vazava para o print legado — ver §32). O score parcial na superfície
  congelada sob gate fechado foi eliminado por decoração Layer 5 (§26), e o confinamento da
  neutralização à mídia de tela está provado pelo guard **`P50-PR1`** verde e pelo mutante `M51`. A alegação anterior de que a única solução
  exigiria editar `ui_v32.js` estava **errada**: a arquitetura da Phase 5 autoriza módulos P50 a
  decorar o DOM congelado pós-render sem alterar os seus bytes — e foi assim que se corrigiu.
  `ui_v32.js` e `ui_v32.css` permanecem byte-idênticos.

## 23 · Atos NÃO realizados

Nenhum commit · nenhum push · nenhum PR · nenhum merge · nenhuma tag · nenhum freeze · nenhuma
release · nenhum deployment · microfase 5.0.4 não iniciada · nenhuma autoauditoria ·
`package.json` e `package-lock.json` intocados · nenhuma dependência instalada · nenhum arquivo
protegido alterado · nenhum símbolo da 5.0.4 introduzido no código.

## 24 · Inventário do delta (final, após a errata estreita)

```text
modificados (15)
  build_v32_html.py                       fixtures_p50.js
  quickscan_secops_soccmm_v3_2_dev.html   tests_p50_chromium.js
  tests_p50_core.js                       tests_p50_mutants.js
  ui_p50_v32.css                          docs_phase5/MANIFEST_PHASE5_P50.sha256
  + os 7 artefatos históricos RESTAURADOS ao commit auditado da 5.0.1
    (aparecem como modificados contra o HEAD porque o HEAD carrega os bytes
     reescritos pela 5.0.2 — a correção é retrospectiva e restaurativa, §25)

novos (21)
  ui_p50_suff_v32.js · ui_p50_results_v32.js
  docs_phase5/MICROFASE_5_0_3_REPORT.md
  docs_phase5/evidence_p50/P50-5.0.3-partial-insufficient-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-near-threshold-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-exactly-sufficient-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-fully-sufficient-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-relocked-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-insufficient-390.png
  docs_phase5/evidence_p50/P50-5.0.3-sufficient-390.png
  docs_phase5/evidence_p50/P50-5.0.3-panel-blocked-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-panel-released-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-gate-blocked-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-gate-released-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-legacy-head-blocked-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-legacy-head-released-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-legacy-domains-blocked-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-legacy-domains-released-1440.png
  docs_phase5/evidence_p50/P50-5.0.3-sufficiency-surface.json
  docs_phase5/evidence_p50/P50-5.0.3-acc6-selection-1440.json
  docs_phase5/evidence_p50/P50-5.0.3-mutation.json

não modificado, apesar de estar na boundary
  ui_p50_shell_v32.js   (1f9c7a5a…80577b09 antes e depois)
```


---

# ERRATA ESTREITA — correção pré-auditoria

Diretriz vinculante: `ERRATA_ESTREITA_MICROFASE_5_0_3.md` · SHA-256
`37192722f9dad526beef870c19c30cc1a3a2bd89b7e52b6b0ca07c4018719374` · 12.240 bytes · 267 linhas ·
UTF-8 · 0 CRLF (identidade conferida antes de qualquer edição).

Preflight estreito **de ENTRADA desta rodada** (valores da errata estreita, todos verdadeiros
*naquele* momento — **não** descrevem o estado corrente da árvore; para o estado corrente ver §35.1,
§28 e o manifesto): branch `feat/phase5-5-0-3` · HEAD `fe4a536a…` · 0 commits ·
HTML de entrada `76d365a74ea7e2307e972a22ac645bb12d4a5a5a20357dab31c1a8a56dc16b7e` ·
engine `9a4a2e67…` · M41 `9794b267…` · manifesto **então** com 42/42 ·
8 modificados + 16 novos = 24 caminhos · os dois módulos presentes · protegidos intactos.
O delta já verde **não** foi descartado nem reimplementado.

## 25 · B-503-EVIDENCE — restauração histórica incompleta

### 25.1 Fato reproduzido

```text
divergência entre 70154a1b (5.0.1 auditada) e e520c05d (5.0.2 auditada):  7/7
árvore de trabalho antes da correção: idêntica à 5.0.2, NÃO à 5.0.1
```

Minha conclusão anterior (“igualdade com o `HEAD` prova descontaminação”) era inválida: o `HEAD`
desta branch já contém o merge da 5.0.2. H-19 está retificado em §16.

### 25.2 Restauração a partir do commit auditado da 5.0.1

Sete caminhos restaurados de `70154a1bf331ac616ddec0df0430ef2625a45850` — nunca do `HEAD`.
Identidade conferida contra os hashes da errata **e** contra o blob `70154a1b:path`:

| artefato | SHA-256 original (5.0.1) |
|---|---|
| `P50-5.0.1-default-collapsed-1440.png` | `c989ee1fd12be7a0652f6fccd0d8d236f1dbddcf9dab893009e48c896188b1fb` |
| `P50-5.0.1-default-collapsed-390.png` | `799dbd5656a9280e3838373381a253f0747949ed1b8acc03161030913d57f88a` |
| `P50-5.0.1-map-expanded-1440.png` | `4da8299c171bb445820635116ddb3b7c1454a4fdcadc1f79b2f67b3a3a63edb0` |
| `P50-ACC6-P50-F2-1440.png` | `81fdbac91593a0e61931cc24afd8f4ea778fe336715b6d4fc35fc4b433f21748` |
| `P50-ACC6-P50-F6-1440.png` | `c989ee1fd12be7a0652f6fccd0d8d236f1dbddcf9dab893009e48c896188b1fb` |
| `P50-ACC6-selection-1440.json` | `59bbb13565351b75314c886c9e9001ed0040de24ff13cd6840a4c7bea66943af` |
| `P50-mutation-5.0.1.json` | `f749d27365d1168df57b15419ab891c87fd794ef1ec7b60c42255aeb2f362963` |

**7/7 restaurados, igualdade exata com os hashes exigidos e com os blobs de `70154a1b`.**

Como a correção é **retrospectiva e restaurativa**, estes sete caminhos aparecem como *modificados*
contra o `HEAD` da branch — é o efeito esperado: o `HEAD` carrega os bytes reescritos pela 5.0.2.

As quatro evidências próprias da 5.0.2 permanecem byte-idênticas ao commit auditado `e520c05d…`.
Os relatórios históricos da 5.0.1 e da 5.0.2 **não** foram reescritos.

### 25.3 Barreira preventiva

`tests_p50_chromium.js` passa a gravar **exclusivamente** artefatos da microfase corrente
(`EVIDENCE_PREFIX = "P50-5.0.3-"`). Nomes de microfases anteriores continuam sendo aferidos pelas
asserções, mas nunca são regravados — evidência é retrato do momento em que foi produzida, não
arquivo vivo. A evidência de execução corrente do ACC6 passou a ter nome próprio
(`P50-5.0.3-acc6-selection-1440.json`); a histórica `P50-ACC6-selection-1440.json` fica congelada.
`P50_NO_EVIDENCE=1` suprime **somente escrita**; nenhuma asserção é suprimida.

> **COMPLEMENTO OBRIGATÓRIO (errata pós-auditoria FAIL · §31).** A barreira descrita acima era
> necessária mas **não suficiente**: ela dependia de cada mutante incluir a flag na sua própria
> string `cmd`, e **M20 não a incluía**. Duas correções estruturais:
>
> 1. **prefixo corrente protegido** — a guarda detectiva passou a fotografar **todo** o diretório
>    `docs_phase5/evidence_p50/`, `P50-5.0.3-*` **incluído**, detectando artefato ALTERADO,
>    REMOVIDO e ADICIONADO;
> 2. **ordem de geração fixada** — campanha de mutação com escrita suprimida **primeiro**,
>    conferência de acervo byte-idêntico **em seguida**, e só então build limpo e execução Chromium
>    limpa para produzir a evidência real da candidata. Nenhum artefato `P50-5.0.3-*` entregue vem
>    de execução sob mutação.

### 25.4 Guarda detectiva pre/post

`tests_p50_mutants.js` fotografa os bytes de **todo** artefato histórico antes da campanha e confere
após **cada** mutante. Divergência ⇒ restauração imediata dos bytes + falha da campanha, nomeando os
artefatos violados.

**Prova de não-vacuidade** (as duas barreiras suspensas deliberadamente, e depois restauradas
byte-idênticas):

```text
Error: M10: artefato histórico de evidência alterado durante o mutante —
  P50-5.0.1-default-collapsed-1440.png (e72008466e8bb209 != c989ee1fd12be7a0) ·
  P50-5.0.1-default-collapsed-390.png · P50-5.0.1-map-expanded-1440.png ·
  P50-5.0.2-evidence-P50-F10-1440.png · P50-5.0.2-evidence-P50-F8-1440.png ·
  P50-ACC6-P50-F2-1440.png · P50-ACC6-P50-F6-1440.png
  (bytes restaurados; campanha abortada)
```

Após a prova, os 11 artefatos históricos voltaram à identidade auditada, conferidos um a um.

## 26 · B-503-COHERENCE — duas verdades na mesma tela

### 26.1 Fato reproduzido

Com o gate global fechado, a mesma página exibia, na superfície congelada, `Negócio 2.5 — Defined`,
`Tecnologia 5.0 — Optimizing`, rulers preenchidos, radar parcial e a legenda de maturidade; e, na
superfície P50, todos os domínios em `n/d · Não avaliado · evidência insuficiente` com o resultado
executivo bloqueado. Materialmente contraditório para quem lê.

### 26.2 Correção — decoração Layer 5, zero byte protegido alterado

Feita **exclusivamente** em `ui_p50_results_v32.js` (+ regras novas em `ui_p50_v32.css` e testes
P50). `ui_v32.js`, `ui_v32.css`, engine, Camada 1 e print permanecem byte-idênticos — verificado por
`git status` nominal e por `P50-GOV1`. A alegação anterior de que a correção exigiria editar
`ui_v32.js` está **retirada**.

**Disciplina descoberta ao errar.** A primeira implementação reescrevia o texto do nó congelado
(`n/d` no lugar de `2.5 — Defined`) e removia o `.fill` do DOM. Isso **quebrou a suíte congelada
UG** — 10/13, com UG3, UG9 e UG13 vermelhos —, porque o contrato congelado de geometria UNSET assere
justamente o texto e a estrutura desses nós, inclusive sob gate fechado. A resposta correta não era
enfraquecer a suíte congelada nem desistir da correção, e sim mudar o mecanismo:

> nenhum nó congelado é mutado, reescrito ou removido; os nós contraditórios são apenas retirados da
> **tela** e da **árvore acessível**, e a informação honesta entra em elementos **novos**, da fase.

Duas formas de ocultar, cada uma pela razão certa:

```text
.p50-legacy-gone     display:none        onde nenhuma suíte congelada mede caixa
.p50-legacy-veiled   visibility:hidden   nos filhos do radar, cuja CAIXA é medida pelo
                                         gate congelado UG13 (bbox disjuntos)
```

Em ambos os casos o nó recebe `aria-hidden="true"`: sai da tela **e** da árvore acessível. Como nada
é guardado para ser reinstalado, também deixou de existir a possibilidade de restaurar um valor
obsoleto — problema real que a primeira implementação tinha (ver §27, H-23).

Com o veredito fechado, na tela **e** na árvore acessível:

- o valor de domínio congelado sai de cena; ao lado entra `n/d`, elemento novo da fase (deliberadamente
  **não** um `<span>`, para não alterar a coleção `.lbl > span` que o gate congelado UG9 percorre);
- a linha de confiança legada sai de cena; entra `N de 3 respostas confirmadas · diagnóstico parcial,
  não é veredito de maturidade` — contagem, explicitamente rotulada, nunca maturidade;
- o preenchimento parcial do ruler sai de cena e da árvore acessível, mas **permanece no DOM**, com o
  seu `style` intacto, porque UG3 assere a sua presença e a sua largura;
- o radar parcial sai de cena e da árvore acessível preservando a **caixa** (UG13), e é substituído
  por “Perfil de maturidade por domínio indisponível — evidência insuficiente.”;
- a legenda de escala `0 Non-existent … 5 Optimizing` sai junto: existe para interpretar os rulers e,
  mantida, deixaria rótulos de estágio na árvore acessível;
- o painel ganha a declaração “Evidência insuficiente: nenhum score de maturidade por domínio é
  apresentado até o gate canônico abrir.”;
- completion, contagens, gaps observados e navegação continuam visíveis, rotulados como diagnóstico
  parcial.

Esconder à vista mantendo texto contraditório acessível **não** satisfaz o requisito. Os gates medem
as duas propriedades **separadamente** — “permanece visível na tela” e “permanece na árvore
acessível” — e um mutante dedicado (M45) faz exatamente isso: esconde à vista e mantém acessível.

### 26.3 Reversibilidade

Estado efêmero **no próprio DOM** (`data-p50-legacy`, classes de ocultação): nenhum owner canônico
paralelo, nada serializado, nada persistido. Restaurar é reexibir o nó congelado e remover os
elementos novos — o texto congelado é sempre o que o renderer congelado deixou lá, nunca algo que a
Camada 5 tenha reescrito.

### 26.4 Gates fortalecidos — página inteira

`P50-SUF1`, `P50-SUF2`, `P50-SUF4` e `P50-SUF5` deixaram de olhar apenas `#p50-results`. Sob gate
fechado provam, na página inteira: zero score numérico de maturidade por domínio, zero estágio
visível ou acessível, zero ruler preenchido, zero radar parcial, `n/d` + `Não avaliado` coerentes,
resultado executivo bloqueado e **nenhuma contradição** entre a superfície legada e a P50. Sob gate
aberto provam a restauração completa, com os valores conferidos contra `domStat(i).score` real.
Depois, o relock sem stale.

Foi acrescentado o **caminho sem render**, exigido pela errata §3.4: toda transição por controle
congelado passa por `render()`, que reconstrói o `#app` inteiro — nesse caminho a restauração nunca
seria exercitada. `P50-SUF4` e `P50-SUF5` agora mudam o estado canônico e redecoram o **mesmo** nó
`#app`, conferindo que ele não foi reconstruído. `P50-SUF5` executa o ciclo completo
bloqueado → liberado → bloqueado, incluindo liberar e rebloquear sem render.

### 26.5 Mutantes novos

| id | mutação | gate |
|---|---|---|
| M44 | score parcial legado permanece exposto sob insuficiência | P50-SUF1 |
| M45 | esconde à vista mas mantém o estágio legado na árvore acessível | P50-SUF1 |
| M46 | preenchimento parcial do ruler permanece exposto | P50-SUF1 |
| M47 | radar parcial permanece exposto | P50-SUF1 |
| M48 | falha em restaurar a superfície legada no unlock | P50-SUF4 |
| M49 | perde a capacidade de neutralizar de novo depois de restaurar (relock) | P50-SUF5 |

### 26.6 Evidência visual

Regeradas somente evidências `P50-5.0.3-*`. Acrescentadas as capturas do elemento legado
(`P50-5.0.3-legacy-head-blocked/released-1440.png`,
`P50-5.0.3-legacy-domains-blocked/released-1440.png`), que mostram o painel legado neutralizado de
forma legível. A evidência full-page insuficiente demonstra que painel superior e seção P50 inferior
comunicam o mesmo estado. Nenhum arquivo `P50-5.0.1-*`, `P50-5.0.2-*`, `P50-ACC6-*` ou
`P50-mutation-5.0.1.json` foi alterado durante a geração.

## 27 · Defeitos do harness encontrados na errata

- **H-20 · seletor errado na decoração legada.** `.lbl span` capturava `· Business` (dentro do `<b>`),
  não o valor do domínio; corrigido para o filho direto `.lbl > span`. Foi o gate fortalecido que o
  expôs, com o estágio `Defined` ainda acessível.
- **H-21 · bloco de teste definido e nunca invocado.** O ciclo completo de `P50-SUF5` foi escrito como
  `(function fullCycle(){…});` — sem `()`. O gate passou **sem executar o ciclo**. Corrigido para
  `})();`. Registrado porque é exatamente o tipo de teste vacuosamente verde que não pode ser
  entregue.
- **H-22 · mutantes com âncora obsoleta.** M48/M49 apontavam para linhas alteradas pela própria
  correção e passaram a reportar “ÂNCORA DE MUTAÇÃO NÃO ENCONTRADA”; reancorados no source atual e
  confirmados detectados.
- **H-23 · restauração ressuscitando valor obsoleto.** Na primeira implementação, restaurar o texto
  guardado reinstalava um valor anterior à resposta que abriu o gate — observado `3.3 — Defined` com
  o canônico já em `2.5`. Corrigido primeiro por recomputação canônica e, em definitivo, pelo
  redesenho de §26.2: como nenhum texto congelado é reescrito, não há o que ressuscitar.
- **H-24 · a primeira correção de coerência quebrou a suíte congelada UG (10/13).** Registrado
  porque foi a rodada final de assurance — e não os gates da fase — que o revelou. UG3, UG9 e UG13
  falharam porque a implementação mutava e removia nós congelados que o contrato UNSET assere.
  Nenhum gate congelado foi tocado: mudou-se o mecanismo da correção (§26.2). UG voltou a 13/13.
- **H-25 · bloco de CSS duplicado.** Uma versão anterior das regras de neutralização sobreviveu mais
  abaixo no arquivo e continuava aplicando `display:none` aos filhos do radar, zerando as caixas que
  UG13 mede. Diagnosticado medindo `getComputedStyle` no browser real; bloco obsoleto removido.
- **H-26 · razões de mutante desatualizadas.** Depois do redesenho, M44–M49 passaram a falhar com
  mensagens novas e o harness recusou contá-los (“FAIL com motivo INCOMPATÍVEL”) — comportamento
  correto do harness, não defeito do produto. As razões foram reancoradas nas mensagens reais.

## 28 · Manifesto e reexecução final da errata

Reexecução única e completa, cada suíte com o seu próprio código de saída:

> **RECONCILIADA PELA ERRATA DOCUMENTAL PÓS-REAUDITORIA (`RQ-REAUD-1`).** Esta seção fechava a
> **errata estreita** e carregava os números daquela rodada (`P50 CORE 30`, `P50 CHROMIUM 4`,
> `mutação 49/49`, `Build A == B == candidato = 56b9bb5c… · 657.178 bytes`, `protegidos 20/20`).
> Todos foram superados pela errata pós-auditoria FAIL. O bloco abaixo é o estado **corrente**,
> coerente com §35 e §35.1.

```text
P50 CORE                31/31 PASS · 0 FAIL   exit 0   (inclui P50-DUP1)
P50 CHROMIUM             5/5  PASS · 0 FAIL   exit 0   (Chromium real 151.0.7922.34, ZERO SKIP)
  P50-PR1               PASS adicional                 (guard estreito; NÃO encerra P50-VIS10)
mutação P50             51/51 detectados      exit 0
acervo de evidência     29/29 byte-idêntico pre/post durante a campanha protegida · ZERO escrita
P50-SUF7                1024/1024          P50-SUF8  1024/1024
engine                  105 · UI 19+25+11+23+26 · UX 56 · Target 30 · Ref 28 · Journey 31 · Icons 12
SESSION 4.8             97/97              exit 0
UNSET UG                13/13              exit 0   (UG13 em Chromium real)
M41                     COMPARAÇÃO PASS    exit 0   · payload 9794b267… inalterado
test:visual             67 passed · 0 failed · 37 skipped   exit 0
regressão de print      UI 3.3.2 (PDF) 23/23   exit 0
Build A == Build B == candidato = 4c7f678b…62d4dd29 · 651.513 bytes
engine 9a4a2e67…2b5d247a inalterado · M41 9794b267…f3ed4365b preservado
protegidos: intactos — contagem e definição em §28.1
```

### 28.1 · `Protegidos` — definição estável antes do denominador

O relatório usou, em rodadas distintas, `20/20` e `16/16` sem que a palavra **protegidos** tivesse
lista ou definição estável. Nenhum dos dois denominadores é recuperável a partir da boundary
normativa, e por isso **nenhum dos dois é reafirmado aqui**. A contagem abaixo foi recalculada nesta
rodada a partir da lista nominal da **§29.4 da `specs/PHASE_5_0_REV_B.md`**, que combina caminhos
nominais individuais com categorias abertas — razão pela qual denominadores diferentes surgiram
conforme o recorte adotado por cada rodada.

| recorte da §29.4 | definição | contagem | verificação contra `HEAD fe4a536a` |
|---|---|---|---|
| caminhos nominais individuais | `engine_v32.js` · `quickscan_secops_soccmm_v3_1_3.html` (Camada 1) · `ui_v32.js` · `ui_ux_v32.js` · `ui_target_v32.js` · `ui_refinement_v32.js` · `ui_journey_v32.js` · `ui_session_v32.js` · `ui_icons_v32.js` · `ui_v32.css` · `ui_ux_v32.css` · `generate_icons_v32.py` · `harness_m41_v313.js` · `v3_1_3_functional_snapshot.json` | **14** | **14/14 byte-idênticos** |
| suítes congeladas | `tests_*.js` existentes, excluídos os três módulos de teste da Phase 5.0 (`tests_p50_core.js` e `tests_p50_chromium.js`, **nominais** na §29.2; `tests_p50_mutants.js`, **desvio aditivo herdado da 5.0.1** — ver §43.6) | **13** | **13/13 byte-idênticas** |
| `tests_visual/` | árvore inteira | **4** | **4/4 byte-idênticos** (zero caminho no `git status`) |
| `MANIFEST.sha256` do core 4.8.0.7 | imutável | **1** | **1/1 byte-idêntico** |
| **subtotal protegido verificável por caminho** | | **32** | **32/32 intactos** |
| `package.json` · `package-lock.json` | §29.3 — edição *permitida* e **não exercida** nesta microfase | **2** | **2/2 byte-idênticos** |

**Total conferido: 34/34 caminhos byte-idênticos ao `HEAD`** — 32 protegidos pela §29.4 mais os 2
da §29.3 cuja edição autorizada não foi usada. As demais categorias da §29.4 (question bank, schema
de sessão, conteúdo metodológico) são **categorias**, não listas fechadas de caminho, e por isso não
recebem denominador aqui: são cobertas nominalmente pelo `git status` do delta, que exibe **36**
caminhos, nenhum deles protegido.

`docs_phase5/MANIFEST_PHASE5_P50.sha256` regenerado **por último**:

```text
entradas: 47 · verificação: 47/47 OK · duplicadas: 0 · auto-referência: 0 · ausentes: 0
```

Exclui apenas a si próprio; inclui artefatos correntes, os dois módulos novos, o relatório e as
evidências novas; preserva as entradas históricas; não duplica manifests congelados
(`MANIFEST.sha256` do core e `MANIFEST_PHASE5_UNSET.sha256` permanecem fora).

**Ponto exigido pela errata:** os sete artefatos históricos da 5.0.1 constam com os hashes
**ORIGINAIS** do commit auditado `70154a1b…`, não com os bytes que a 5.0.2 havia reescrito.

## 29 · Blockers e ressalvas após a errata

**Blockers abertos: nenhum conhecido.** A candidata **não** foi auto-auditada.

- **B-503-EVIDENCE** — fechado (§25): 7/7 restaurados ao commit auditado, barreira preventiva e
  guarda detectiva provada não-vacuosa.
- **B-503-COHERENCE** — fechado (§26): uma só verdade na página, por decoração Layer 5, com
  `ui_v32.js`/`ui_v32.css` byte-idênticos e a suíte congelada UG em 13/13.
- **RQ-502-1** — mantida: o browser é `Chromium 151.0.7922.34`, diferente da revisão nominal
  histórica `141.0.7390.37`. Todos os gates canônicos de browser passaram em Chromium real, sem SKIP.
  Isto **não resolve** a divergência de ambiente; mantém-na explicitamente aceita como ressalva desta
  microfase. Nenhum browser foi instalado ou trocado nesta correção.
- **RQ-502-2** — mantida: fechamento amplo de acessibilidade com axe-core previsto para 5.0.5.
- **RQ-503-1** — **resolvida na tela e isolada de print** (qualificação da errata pós-auditoria FAIL; ver §32 e o guard `P50-PR1`).

---

# ERRATA PÓS-AUDITORIA FAIL — fechamento de B-AUD-503-1 e B-AUD-503-2

## 30 · Aceite do parecer independente

O parecer independente `AUDITORIA_INDEPENDENTE_MICROFASE_5_0_3.md` — SHA-256
`f0e207554cc0ed5d63354212baf52df88d841209f5dc48494aa334f971af7cb5`, 43.152 bytes, 660 linhas,
UTF-8, zero CRLF — foi **aceito integralmente**. Veredito aceito: **FAIL — 2 blockers**
(`B-AUD-503-1`, `B-AUD-503-2`). O parecer **não foi editado** e **não foi importado** para o
repositório nesta rodada.

A errata vinculante aplicada é `ERRATA_POS_AUDITORIA_FAIL_MICROFASE_5_0_3.md` — SHA-256
`06ec99df508d85dc8c344a02d814ba62e40e8ae4aba78bfda7d02bf7ed3f4887`, 15.399 bytes, 375 linhas,
UTF-8, zero CRLF — identidade **recalculada e conferida antes de qualquer edição**.

O delta já validado **não foi descartado nem reimplementado**: esta rodada altera apenas o que a
errata determina.

### 30.1 Preflight estreito (§1 da errata) — conferido item a item

| Item | Exigido | Observado | Veredito |
| --- | --- | --- | --- |
| Repositório | `/mnt/c/Projetos/QuickScan-SOC-CMM/phase5` | idem | OK |
| Branch | `feat/phase5-5-0-3` | idem | OK |
| HEAD-base | `fe4a536a508ed592bf62d1545a90e399036bb43d` | idem | OK |
| Commits sobre `origin/main` | 0 | 0 | OK |
| Staged | 0 | 0 | OK |
| Caminhos alterados | 36 | 36 | OK |
| HTML candidato **de ENTRADA** da errata (não é o candidato final — ver §35.1) | `56b9bb5c…eca9fac3`, 657.178 B | idem | OK |
| `engine_v32.js` | `9a4a2e67…2b5d247a` | idem | OK |
| Payload M41 | `9794b267…f3ed4365b` | idem (harness PASS) | OK |
| Manifesto | 47/47 | 47 entradas | OK |
| 7 artefatos da 5.0.1 = `70154a1b` | iguais | 7/7 iguais | OK |
| 4 evidências da 5.0.2 = `e520c05d` | iguais | 4/4 sem diff | OK |
| Protegidos | intactos | intactos | OK |
| 5.0.4 | não iniciada | não iniciada | OK |

Nenhuma identidade material divergiu; a errata foi aplicada sobre a candidata existente.

> **Nota de rótulo (errata documental pós-reauditoria, `RQ-REAUD-1`).** Todo `56b9bb5c…eca9fac3`
> (657.178 B) que aparece nesta seção descreve o **HTML de ENTRADA** desta errata — o estado da
> candidata *antes* das correções de §31–§34. O HTML da candidata **final** é
> `4c7f678b…62d4dd29` (651.513 B), registrado em §35.1 e no manifesto. Esta seção é preflight de
> rodada e permanece intacta como tal; nenhum valor dela descreve o estado corrente da árvore.

## 31 · B-AUD-503-1 — proveniência mutada da evidência corrente · FECHADO

### 31.1 Fato aceito e reproduzido por mim

`tests_p50_mutants.js` invocava a suíte Chromium em **M10 e M20**, e apenas **M10** carregava
`P50_NO_EVIDENCE=1` dentro da sua própria string `cmd`. M20 executava o produto deliberadamente
mutado e regravava todo o prefixo `P50-5.0.3-*` — precisamente o prefixo que a guarda anterior
**excluía** do seu escopo. A barreira preventiva dependia de cada mutante lembrar de si mesma, e a
guarda detectiva era cega para o único caso que precisava enxergar.

Reprodução na candidata de entrada, antes de qualquer correção:

```text
P50-5.0.3-acc6-selection-1440.json
  SHA entregue : f77771d6b770091de1fe29b754d98df06028da577a65b0d8383a42db70fceb2d
  verdict      : FAIL                              <- render MUTADO
P50-5.0.3-sufficiency-surface.json
  "Estado da sessão: "                  : 7 ocorrências   <- string do mutante M20
  "Há alterações ainda não exportadas." : 0 ocorrências   <- mensagem honesta perdida
```

O manifesto da candidata selava esses bytes contaminados. Confirmo o fato **integralmente**.

### 31.2 Correção central (§2.2) — a supressão deixou de ser opcional

A flag saiu das strings `cmd` e passou a ser aplicada **por construção** ao ambiente de toda
execução disparada pelo runner:

```js
const SUPPRESS_EVIDENCE = { P50_NO_EVIDENCE: "1" };
function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, SUPPRESS_EVIDENCE, envOverride || {});
  ...
}
```

`M10` deixou de carregar a flag na sua `cmd` — justamente para provar que a centralização é
efetiva e que nenhum mutante presente ou futuro depende de lembrar dela. Busca literal por
`P50_NO_EVIDENCE` em `tests_p50_mutants.js` retorna **uma única atribuição**, a central.

A flag suprime **somente escrita**: as asserções continuam executando integralmente, o exit code
continua real e M20 permanece detectado pelo gate `P50-SESUX1B` com o motivo semântico
`aria-label sobrescreve o conteúdo da live region`. **ADV-2 reproduzido**: a correção é gratuita em
poder discriminante.

### 31.3 Guarda detectiva sobre o diretório inteiro (§2.3)

`HISTORICAL` (escopo parcial) foi substituído por `GUARDED`, que fotografa **todo** o conteúdo de
`docs_phase5/evidence_p50/` antes da campanha, **prefixo corrente incluído**, e confere após cada
mutante detectando as três formas de violação — **ALTERADO**, **REMOVIDO** e **ADICIONADO** —
restaurando os bytes e abortando a campanha com cada violação nomeada. Nada fora de
`evidence_p50/` é vigiado: outputs temporários permitidos não são evidência publicada.

### 31.4 Prova NÃO VACUOSA da guarda (§2.3) — executada duas vezes

A guarda foi provada contra o acervo **limpo entregue**, em mecanismo controlado
(`MUT_GUARD_PROOF=1`), seguindo exatamente o roteiro exigido:

```text
1. M20 sem supressão · exit=1
2. guarda detectou 2 violação(ões), 2 no prefixo corrente
     · ALTERADO P50-5.0.3-acc6-selection-1440.json  (f77771d6b770091d != 23e0855ef4f2b611)
     · ALTERADO P50-5.0.3-sufficiency-surface.json  (50e5165bfe76d19d != df9d970f08743641)
3. após restauração: 0 divergência(s)
4. barreira preventiva restaurada (P50_NO_EVIDENCE central em run())
5. M20 com supressão · exit=1 · violações=0
   M20 permanece DETECTADO pelo gate P50-SESUX1B (motivo semântico preservado)

PASS  MUT-GUARD-PROOF
```

O fecho do laço é exato: a execução deliberadamente desprotegida **reproduz o SHA contaminado
`f77771d6…` nomeado pelo parecer**, e a guarda o detecta e restaura para o SHA limpo `23e0855e…`.
A candidata **não** ficou em estado mutado: o source é restaurado, o HTML reconstruído e o acervo
reconferido em `finally`.

### 31.5 Ordem de geração de evidência (§2.4)

Ordem executada, nesta sequência e sem exceção:

| # | Etapa | Resultado |
| --- | --- | --- |
| 1 | Campanha de mutação completa, escrita de evidência suprimida | **51/51** detectados |
| 2 | Conferência do acervo pre/post | **29/29 byte-idênticos**, zero escrita |
| 3 | Build limpo do candidato restaurado | `4c7f678b…62d4dd29` |
| 4 | Execução Chromium limpa, **sem** `P50_NO_EVIDENCE` | **5 PASS · 0 FAIL**, zero SKIP |
| 5 | Validação dos JSONs e screenshots | ver abaixo |
| 6 | Manifesto regenerado | **por último** |

**Todos** os 18 artefatos `P50-5.0.3-*` foram regerados de build limpo — não apenas os dois JSONs:
17 pela execução Chromium limpa e `P50-5.0.3-mutation.json` pelo relatório da própria campanha,
escrito **depois** da restauração e da conferência final do acervo.

Descontaminação verificada:

```text
P50-5.0.3-acc6-selection-1440.json
  verdict : PASS      (era FAIL)
  SHA     : 23e0855ef4f2b6114c89491c4625cdd01ad3b51e7aeac44077eb938c3dea7c33
P50-5.0.3-sufficiency-surface.json
  "Estado da sessão: "                  : 0 ocorrências   (eram 7)
  "Há alterações ainda não exportadas." : 7 ocorrências   (eram 0)
  verdict : PASS
  SHA     : df9d970f0874364198367728ea8eaa4b4102195a6261187665599e489cca7fe1
```

Sobre o oracle: a errata proíbe fixar `23e0855e…` como oráculo, e eu **não** o fixei. O oráculo
aplicado é **conteúdo semântico PASS + proveniência de execução limpa + hash recalculado e
registrado**. Que o hash recalculado tenha coincidido com o valor observado pelo auditor é
resultado, não premissa — e registro a coincidência explicitamente. O
`P50-5.0.3-sufficiency-surface.json`, por outro lado, **mudou** de hash em relação ao valor limpo
anterior, porque passou a carregar o bloco `legacyPrintGuard` de `P50-PR1`: exatamente o caso que a
errata antecipou ao proibir o hash fixo.

Zero evidência histórica da 5.0.1/5.0.2 foi alterada: os 7 artefatos da 5.0.1 continuam
byte-idênticos a `70154a1b` e as 4 evidências da 5.0.2 a `e520c05d`, conferidos **após** a campanha.

## 32 · B-AUD-503-2 — neutralização de tela vazando para o print legado · FECHADO

### 32.1 Fato aceito e reproduzido por mim

`ui_p50_v32.css` declarava a neutralização **sem escopo de mídia**:

```css
#app .p50-legacy-gone{ display:none !important; }
#app .p50-legacy-veiled{ visibility:hidden !important; }
```

No modo legado, `preparePrint()` devolve `{legacy:true}`, esvazia `#v32-print-report` e **não**
adiciona `v32-print-mode` ao `body` — logo `.wrap`/`#app` **é** a superfície impressa. Sem escopo de
mídia, `display:none` e `visibility:hidden` valiam também no papel, e o relatório legado perdia os
cinco valores de domínio, os cinco `.conf`, os cinco fills, o radar e a legenda. A Phase 5 não está
autorizada a criar semântica nova de impressão; criou-a por omissão. Confirmo o fato.

Isto também **supera** a afirmação da §20 deste relatório de que a 5.0.3 não introduzia nenhuma
semântica nova de impressão — ver §34.3.

### 32.2 Correção (§3.1)

A regra correta no print **não é agir de outro modo, é não agir**:

```css
@media screen{
  #app .p50-legacy-gone{ display:none !important; }
  #app .p50-legacy-veiled{ visibility:hidden !important; }
}
```

`ui_v32.js`, `ui_v32.css`, `preparePrint()`, `buildPrintReport()` e todo símbolo protegido de print
permanecem **byte-idênticos**. **ADV-4 reproduzido** na candidata corrigida.

### 32.3 Guard executável `P50-PR1` (§3.2)

Ausência de colisão literal de `P50-PR1` verificada em todo o repositório **antes** de fixar o ID
(zero ocorrências). O guard é **adicional e estreito**: **não** encerra nem redefine `P50-VIS10`,
que continua sendo a regressão congelada integral prevista na REV B.

Oráculo **duplo**, ambos independentes da implementação da Camada 5:

- **(A) baseline de ENTRADA** `5d1a301e…0c926cd`, materializado do git e medido sob a **mesma**
  fixture e a **mesma** mídia — comparação seletor a seletor de presença, texto e visibilidade;
- **(B) invariante da Camada 1** via `__DEV.legacySnapshot()` — o score canônico que o renderer
  congelado produziu tem de continuar impresso, exigido como **prefixo** do texto do papel (o
  renderer congelado imprime `"<score> — <estágio>"`; o oráculo não presume o rótulo).

(A) é best-effort quanto à **disponibilidade**, nunca quanto ao **veredito**: indisponível é
declarado como não comparado; divergente é FAIL. (B) é sempre exigido — nenhum caminho leva a PASS
vacuoso.

O guard executa, na fixture insuficiente **P50-F3**, os doze passos exigidos:

1. fixture insuficiente P50-F3 aplicada pelos owners canônicos;
2. modo legado **real** confirmado por `V32.isLegacyModeV32() === true`;
3. gate fechado confirmado pelo veredito **canônico** da Camada 1 (`suff === false`), não pela UI;
4. superfície de **tela** capturada: neutralização ativa (5 valores, 5 `.conf`, 5 fills, radar e
   legenda invisíveis) e substituto honesto visível;
5. `beforeprint` disparado pelo **caminho real** — o listener registrado por `ui_v32.js` —, não por
   chamada direta a `preparePrint()`;
6. mídia **print real** ativada no Chromium (`emulateMedia({media:"print"})`);
7. `.wrap` e `#app` provados como a superfície impressa: `#v32-print-report` vazio, `body` sem
   `v32-print-mode` e sem `v32-print-blocked`, `.wrap` e `#app` visíveis;
8. cinco valores, cinco `.conf`, cinco fills, radar e legenda provados **renderizados no print**;
9. comparação com o baseline de entrada e com os invariantes independentes (oráculo duplo acima);
10. nenhum substituto P50 visível no print — **0 de 17** — logo nenhuma semântica nova de impressão;
11. mídia screen restaurada e neutralização provada de volta em vigor;
12. diagnóstico por seletor e propriedade (`display`, `visibility`, `opacity`, largura, altura)
    registrado em qualquer FAIL.

Medições da execução limpa entregue, gravadas em `P50-5.0.3-sufficiency-surface.json`:

```text
tela  · valores visíveis: [false,false,false,false,false] · substitutos visíveis: 17
print · valores visíveis: [true,true,true,true,true]      · .conf: [true,true,true,true,true]
print · fills 5/5 · radar: true · legenda: true · substitutos P50 visíveis: 0 de 17
baseline de entrada 5d1a301e… comparado: true · zero divergência
```

**Mutante novo `M51`** remove o escopo `@media screen` e faz `P50-PR1` falhar pelo motivo correto:

```text
DETECTADO      M51 · remover o escopo @media screen da neutralização (vazamento para o print legado)
FAIL  P50-PR1 — [print: valor do domínio 0 ausente do papel · valor do domínio 1 ausente do papel · …]
```

## 33 · Mutation testing e IDs após a errata

O inventário **continua após M49, sem reutilizar IDs**. O total **não é presumido**: `MUTANT_IDS`
deriva do inventário real de `MUTANTS`, e a campanha imprime o total derivado.

| | |
| --- | --- |
| Mutantes no inventário | **51** (M1–M51) |
| Detectados pelo gate e motivo esperados | **51/51** |
| Evidência escrita durante a campanha | **zero** |
| Acervo pre/post | **29/29 byte-idênticos**, prefixo corrente incluído |
| Restauração de sources e HTML | byte-idêntica |

Mutantes novos exigidos pela errata, ambos presentes:

- **M50** — owner paralelo da moeda de suficiência ⇒ detectado por **`P50-SUF0`** (§34.2);
- **M51** — neutralização sem `@media screen` ⇒ detectado por **`P50-PR1`** (§32.3).

Para todos os 51: âncora existente (nenhuma "ÂNCORA NÃO ENCONTRADA"), mutação materialmente
alterando o alvo, gate e motivo compatíveis, detecção incidental não contada, zero evidência
escrita, e source/HTML/acervo byte-idênticos após cada mutante.

```text
MUTATION TESTING (5.0.1+5.0.2+5.0.3): 51/51 mutantes detectados pelo gate e motivo esperados
acervo de evidência: 29/29 byte-idênticos ao início (prefixo corrente incluído); zero arquivo escrito
restauração: ui_p50_shell_v32.js OK · ui_p50_v32.css OK · ui_p50_suff_v32.js OK ·
             ui_p50_results_v32.js OK · html OK
```

## 34 · Ressalvas fechadas nesta rodada (§4 da errata)

### 34.1 RQ-AUD-1 — CSS duplicado removido

As antigas linhas **332–489** de `ui_p50_v32.css` eram cópia **byte-equivalente** das linhas
**147–304**. A equivalência foi **provada antes** da remoção, não presumida:

```text
bloco canônico  147-304 · sha256 862a8ddd2675bb6e86958ff5a3f58b76c3c0cc95eb13be2d11829f9c0e526434
bloco duplicado 332-489 · sha256 862a8ddd2675bb6e86958ff5a3f58b76c3c0cc95eb13be2d11829f9c0e526434
idênticos: True · 6.223 bytes · 158 linhas removidas (494 -> 336)
```

Preservados: a primeira ocorrência canônica de cada regra, o bloco final de `@media print` que
oculta os componentes P50, o novo `@media screen` da neutralização e toda regra não duplicada.
Nenhuma minificação, nenhuma reordenação ampla.

**Guard novo `P50-DUP1`** (ID conferido livre antes de fixar) rejeita duplicação integral em todos
os módulos da Camada 5. Oráculo estrutural independente da implementação: janela deslizante de 12
**linhas significativas** — vazias e molduras puras de comentário são ignoradas, de modo que
reindentação ou espaçamento não mascaram a repetição.

**Prova de não-vacuidade**, com restauração byte-idêntica em seguida:

```text
duplicação reintroduzida deliberadamente:
FAIL  P50-DUP1 — [ui_p50_v32.css: bloco de 12 linhas significativas repetido (linha 146 e linha 344)]
restaurado: ui_p50_v32.css 9fe665be… · html 4c7f678b… · PASS  P50-DUP1
```

### 34.2 RQ-AUD-2 — proveniência da moeda de suficiência

`P50-SUF0` foi fortalecido com **duas** provas complementares, porque nenhuma basta sozinha — a
estrutural não vê o runtime, e a de runtime não vê código morto.

**Estrutural**, sobre `ui_p50_suff_v32.js` (fonte com comentários removidos):

- exige `confirmedGlobal = confirmedCount()` — uso **real** do owner canônico global;
- exige `= domStat(i).n` — uso **real** do owner canônico por domínio;
- proíbe indexar ou iterar `ans`/`QS` para recontar respostas na camada derivada;
- proíbe reproduzir a fórmula de confirmação `v !== null && v !== "NA"` em qualquer ordem.

**Runtime por sentinela**, sem alterar nada de produção: `confirmedCount` e `domStat` são
substituídos por sentinelas controladas, o contrato é chamado, e exige-se que os valores do
contrato **reflitam as sentinelas** (`confirmedGlobal === 7`, `domains[i].confirmed === 100 + i`),
que `confirmedCount()` seja invocado exatamente uma vez e que `domStat()` seja consultado uma vez
por domínio **na ordem canônica**. As funções são restauradas em `finally` e a **ausência de estado
residual** é verificada por igualdade do contrato com o valor anterior à sentinela.

**Mutante novo `M50`** troca as leituras canônicas por recontagem paralela em `ans[]` e é detectado
por `P50-SUF0` — **não** pelo manifesto:

```text
DETECTADO      M50 · trocar as leituras canônicas da moeda por recontagem paralela em ans[]
FAIL  P50-SUF0 — [confirmedGlobal não é lido de confirmedCount() — owner paralelo da moeda global]
```

### 34.3 RQ-AUD-3, RQ-AUD-4 e RQ-AUD-5 — corpo original reconciliado

Seis afirmações do corpo original foram reconciliadas com as erratas. Nenhuma foi apagada em
silêncio: cada uma permanece no lugar, marcada como **superada** ou **complementada**, com o motivo.

| Local | Afirmação original | Tratamento |
| --- | --- | --- |
| §4.3 | evidências históricas "permanecem byte-idênticas ao HEAD" | **SUPERADA** — sete artefatos da 5.0.1 foram restaurados a `70154a1b` e **divergem deliberadamente do HEAD**; as quatro da 5.0.2 seguem idênticas a `e520c05d` |
| §16 / H-19 | registrava apenas **M10** como executor da suíte Chromium | **RETIFICADA** — M10 **e M20**; a correção final foi **centralizada no runner**, não aplicada por mutante |
| §20 | "a 5.0.3 não introduz nenhuma semântica nova de impressão" | **OVERCLAIM RETIRADO** — vazamento de CSS registrado, correção por `@media screen`, `P50-PR1` e preservação final do print legado |
| §25.3 | barreira preventiva descrita como suficiente | **COMPLEMENTADA** — proteção do prefixo corrente e ordem mutation → clean evidence |
| §22 / RQ-503-1 | "RESOLVIDA" sem qualificação | **QUALIFICADA** — `resolvida na tela e isolada de print`, só após `P50-PR1` verde |
| §29 / RQ-503-1 | "resolvida" | **QUALIFICADA** — idem |

O parecer independente FAIL está registrado por nome, SHA-256, tamanho, linhas e seus dois blockers
em §30. O parecer **não foi editado**.

### 34.4 RQ-AUD-6 — linha morta removida

A linha de `tests_p50_core.js` que avaliava uma regex e descartava o resultado
(`if (/.../.test(...) === false) { /* noop */ }`) foi **removida**, não substituída por outra
asserção textual vazia. A cobertura real permanece nos gates comportamentais e no lint efetivo.

## 35 · Rodada final única — contagens observadas

Executada **depois** de tudo estar verde no desenvolvimento, na ordem da §7 da errata. Nenhum PASS
por timeout, interrupção, comando parcial ou SKIP.

| # | Verificação | Baseline | Observado | Veredito |
| --- | --- | --- | --- | --- |
| 1 | Campanha de mutação completa, zero escrita de evidência | — | **51/51** detectados | PASS |
| 2 | Acervo pre/post idêntico | — | **29/29** byte-idênticos | PASS |
| 3 | Execução Chromium limpa (regeneração `P50-5.0.3-*`) | — | 18/18 de build limpo | PASS |
| 4 | P50 CORE (inclui `P50-DUP1`) | 30 | **31 PASS · 0 FAIL** | PASS |
| 4 | `P50-PR1` | novo | **PASS** | PASS |
| 5 | P50 Chromium real, zero SKIP | 4 | **5 PASS · 0 FAIL · 0 SKIP** | PASS |
| 6 | `P50-SUF7` exaustivo | 1024 | **1024/1024** | PASS |
| 7 | `P50-SUF8` exaustivo | 1024 | **1024/1024** | PASS |
| 8 | Engine | 105 | **105 PASS · 0 FAIL** | PASS |
| 9 | UI 3.1 / 3.2 / 3.3.1 / 3.3.2 / 3.3.3 | 19+25+11+23+26 | **19 · 25 · 11 · 23 · 26** | PASS |
| 10 | UX 4.1 | 56 | **56 PASS · 0 FAIL** | PASS |
| 11 | Target 4.3.1 | 30 | **30 PASS · 0 FAIL** | PASS |
| 12 | Refinement 4.4 | 28 | **28 PASS · 0 FAIL** | PASS |
| 13 | Journey 4.5 | 31 | **31 PASS · 0 FAIL** | PASS |
| 14 | Icons 4.6 | 12 | **12 PASS · 0 FAIL** | PASS |
| 15 | Session 4.8 | 97/97 | **97 PASS · 0 FAIL** | PASS |
| 16 | UG (UG13 real, Chromium) | 13/13 | **13 PASS · 0 FAIL** | PASS |
| 17 | M41 | PASS | **COMPARAÇÃO: PASS** · payload `9794b267…` | PASS |
| 18 | `test:visual` | 67/0/37 | **67 passed · 0 failed · 37 skipped** | PASS |
| 19 | Print | 23/23 | **23 PASS · 0 FAIL** mais `P50-PR1` | PASS |
| 20 | Builds A/B | determinístico | A == B == `4c7f678b…` | PASS |
| 21 | Engine / M41 / protegidos | byte-idênticos | intactos | PASS |
| 22 | Manifesto | por último | regenerado por último | PASS |

### 35.1 Hashes finais

```text
HTML de ENTRADA da errata : 56b9bb5c3cd892a333d7f3c562c43e3e50fd96aab04846b4075f6f68eca9fac3  (657.178 B)
HTML de SAÍDA             : 4c7f678b53202b4f540cb3694fec32c382303c42246d427a2615c4c462d4dd29  (651.513 B)
engine_v32.js             : 9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a  (intacto)
payload M41               : 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b  (intacto)
ui_p50_v32.css            : 9fe665be8e29af25a2e86ed2beda2e5774cbebb4feb6b6ce35c469ba5b02f44a
ui_p50_suff_v32.js        : cdb4a6edcc8eee64c33d7410301ddcf059e725ffa588ca009b16fc7afd6e5a32  (inalterado)
ui_p50_results_v32.js     : 9694ef05c518e2ad11100f2ce0b3c15a7e9be2587c5a2a59de51d6768d30e670  (inalterado)
ui_p50_shell_v32.js       : 1f9c7a5a8ad10b724f9caab86eead66eeb5ad6df1f397c4b41b0b75380577b09  (intocado)
```

> **RECONFIRMADO PELA ERRATA DOCUMENTAL PÓS-REAUDITORIA.** Os oito hashes acima foram
> **recalculados diretamente dos bytes** nesta rodada e conferem, um a um, sem exceção. §35 e §35.1
> permanecem a **autoridade factual corrente** do relatório; nenhuma tabela final concorrente foi
> criada. As seções §5, §14, §17, §18 e §28 foram reconciliadas *para* estes valores — não o
> contrário.

O HTML encolheu **5.665 bytes** — efeito exclusivo da remoção das 158 linhas de CSS duplicado
(RQ-AUD-1) e do `@media screen` acrescentado; nenhuma regra canônica foi perdida, o que
`P50-DUP1`, `UG 13/13`, `print 23/23`, `test:visual 67/0/37` e `P50-PR1` comprovam em conjunto.

Caminhos alterados na árvore de trabalho: **36**, o mesmo número do preflight — a errata **não**
adicionou nem removeu arquivos do delta; `P50-PR1` e `P50-DUP1` vivem em arquivos já existentes.

## 36 · Blockers e ressalvas após esta errata

**Blockers abertos: nenhum conhecido por mim.** `B-AUD-503-1` e `B-AUD-503-2` foram corrigidos,
com correção provada por gate executável e por mutante dedicado. Declarar a microfase encerrada
**não é ato meu**: a candidata segue aguardando **reauditoria independente**.

**Ressalvas mantidas explicitamente, sem tratá-las como blocker desta correção** (§5 da errata —
nenhum escopo foi aberto para elas):

- **RQ-AUD-7** — ajuste futuro da lista nominal da spec;
- **RQ-AUD-8** — fixtures `P50-F7`/`P50-F9` de microfases futuras;
- **RQ-AUD-9** — refinamento de wording near-threshold;
- **RQ-502-1** — Chromium 151 versus 141 nominal da spec;
- **RQ-502-2** — axe-core previsto para a 5.0.5;
- autenticação, vault, deployment e segurança — backlog próprio;
- qualquer item da **5.0.4**.

**`P50-VIS10` continua aberto e integral.** `P50-PR1` é guard adicional e estreito sobre um blind
spot específico; **não** encerra, **não** redefine e **não** substitui a regressão congelada
integral prevista na REV B.

## 37 · Atos NÃO realizados nesta rodada

Nenhum commit · nenhum push · nenhum PR · nenhum merge · nenhuma tag · nenhum freeze · nenhuma
release · nenhum deployment · nenhuma autoauditoria · microfase 5.0.4 **não iniciada** · o parecer
independente FAIL **não foi importado** para o repositório e **não foi editado** ·
`package.json` e `package-lock.json` **intocados** · nenhuma dependência instalada · nenhum arquivo
protegido da §29.4 modificado · nenhum dado de cliente tocado.

---

# ERRATA DOCUMENTAL PÓS-REAUDITORIA — reconciliação de `RQ-REAUD-1`

## 38 · Escopo e limite desta rodada

Diretriz vinculante: `ERRATA_DOCUMENTAL_POS_REAUDITORIA_MICROFASE_5_0_3.md` · SHA-256
`c62ca27674a2feaaa3394a9a22cebc3a8a12a5a70c273a904a1f776392593006` · 10.624 bytes · 224 linhas de
conteúdo · UTF-8 sem BOM · zero CRLF — identidade **recalculada e conferida antes de qualquer
edição**.

Esta rodada é **exclusivamente documental**. Nenhum código, gate, teste, CSS, HTML, builder,
fixture, dependência, evidência ou comportamento foi tocado. **Nenhuma suíte foi reexecutada nesta
rodada**: as contagens registradas neste relatório permanecem os fatos da **rodada executável**
anterior, e são citadas como tal. Alterados apenas dois caminhos, o segundo por último:

1. `docs_phase5/MICROFASE_5_0_3_REPORT.md`;
2. `docs_phase5/MANIFEST_PHASE5_P50.sha256`.

### 38.1 Fonte do achado — e o que ela **não** é

O achado foi localizado em `AUDITORIA_INDEPENDENTE_REAUDITORIA_MICROFASE_5_0_3.md` — SHA-256
`e72f720d925fd1e70fe5f99eb2e86f1d82b6b824531545c1068a362ba5d63e31`, 34.882 bytes, 590 linhas,
UTF-8 sem BOM, zero CRLF.

Esse documento **não é parecer independente** e **não foi importado para o repositório**: é
verificação técnica reexecutada **pela mesma sessão que implementou as correções**, com limitação
de independência declarada no próprio texto. Permanece externo ao clone até que haja auditoria por
sessão e contexto distintos. A candidata **continua aguardando auditoria formal independente**.

## 39 · `RQ-REAUD-1` — FECHADA

**Fato aceito.** O relatório reconciliara, na errata anterior, as seis afirmações **textuais**
(§34.3) e deixara passar as afirmações **numéricas** de seções anteriores, que continuavam
apresentando valores superados como se fossem o estado corrente. Documental, não bloqueante quanto
ao runtime — o `MANIFEST_PHASE5_P50.sha256` e a §35.1 sempre estiveram corretos —, mas um leitor
que consultasse §5 ou §18 em vez de §35.1 poderia conferir a árvore contra o HTML errado e concluir
divergência onde não há.

### 39.1 Seções reconciliadas

| seção | o que afirmava | tratamento aplicado |
|---|---|---|
| §5 · hashes | coluna única `pós` misturando dois estados; 5 de 11 linhas com valor superado | **REESCRITA** — três colunas explícitas (baseline `HEAD` · candidata de ENTRADA da errata · candidata FINAL); **todos** os hashes recalculados dos bytes |
| §14 · Chromium | `P50 CHROMIUM: 4 PASS · 0 FAIL de 4` como estado corrente | **ATUALIZADA** para `5 PASS · 0 FAIL · 0 SKIP`, Chromium real, exit 0, com `P50-PR1` nomeado como guard adicional e estreito que **não encerra `P50-VIS10`**; o `4/4` preservado no próprio bloco como `REGISTRO HISTÓRICO` |
| §15 · mutação | bloco `49/49` sem marcação | **MARCADO** no próprio bloco como `REGISTRO HISTÓRICO — SUPERADO`, remetendo ao `51/51` corrente de §33 |
| §17 · regressão | `P50 CORE 30` e `P50 CHROMIUM 4` | **RECONCILIADA** — `31/31` e `5/5 · 0 SKIP`, `P50-PR1` como PASS adicional, print `23/23`; contagens congeladas **não P50 preservadas como observadas** |
| §18 · builds A/B | `A == B == candidato = 56b9bb5c… · 657.178 B` | **ATUALIZADA** — `4c7f678b…62d4dd29`, 651.513 B, A == B == candidato, temporários removidos, nenhum output promovido como release; `56b9bb5c…` preservado no próprio bloco **somente** como HTML de ENTRADA |
| §28 · manifesto e reexecução | números da errata estreita; `protegidos 20/20` | **ATUALIZADA** para a rodada final; nova **§28.1** define `protegidos` por lista estável antes de atribuir denominador |
| §30 · preflight da errata | `56b9bb5c…` rotulado, mas com rótulo fraco | **RÓTULO REFORÇADO** — nota explícita de que toda ocorrência ali é HTML de ENTRADA, não candidato final |
| §35 / §35.1 | valores finais corretos | **RECONFIRMADAS contra os bytes** e preservadas como autoridade factual corrente; nenhuma tabela final concorrente criada |

Nenhum valor superado foi apagado em silêncio: cada um permanece no seu lugar, marcado na própria
unidade textual como histórico, de entrada ou pré-correção, com referência direta à seção vigente.

### 39.2 `protegidos` — por que `20/20` e `16/16` divergiam

Ambos os denominadores foram usados sem lista estável e **nenhum é reafirmado**. A §29.4 da spec
combina caminhos nominais individuais com categorias abertas, e recortes diferentes produzem
denominadores diferentes. A contagem recalculada e a definição que a sustenta estão em **§28.1**:
**14** nominais + **13** suítes congeladas + **4** de `tests_visual/` + **1** `MANIFEST.sha256` do
core = **32/32 intactos**, mais os **2** caminhos da §29.3 cuja edição autorizada não foi exercida —
**34/34 byte-idênticos ao `HEAD`**.

## 40 · Ressalvas remanescentes — backlog não bloqueante

Registradas por determinação da §4 da errata. **Nenhuma das duas foi implementada nesta rodada**;
nenhum código ou teste foi alterado para atendê-las.

- **`RQ-REAUD-2` — colisão nominal `M50`/`M51`.** Os IDs `M50` e `M51` da campanha P50 coincidem
  nominalmente com IDs da matriz de engine. **Sem ambiguidade operacional**: arquivo próprio
  (`tests_p50_mutants.js`), runner próprio, cabeçalho de saída próprio e evidência própria
  (`P50-5.0.3-mutation.json`) qualificam os resultados; os gates dos mutantes novos são `P50-SUF0` e
  `P50-PR1`, e nenhum gate `P50-*` aparece em `tests_m42_m86.js`. Observação registrada: as linhas
  individuais `DETECTADO M50 · …` não se autoqualificam — só o cabeçalho, o arquivo e a evidência as
  qualificam. **Backlog:** prefixar as linhas de mutante por suíte (p. ex. `P50::M50`).

- **`RQ-REAUD-3` — exit code enganoso em campanha parcial.** Sob `MUT_ONLY`, o harness encerra com
  `process.exit(ok === MUTANTS.length ? 0 : 1)`, comparando contra o **inventário completo**; uma
  campanha parcial 100% bem-sucedida pode, por isso, sair com **código 1**. Severidade baixa: é
  caminho de desenvolvimento dirigido. **Backlog:** comparar contra a **seleção ativa** quando o
  filtro estiver ativo.

Declarações explícitas exigidas:

- ambas são **não bloqueantes**;
- a **campanha completa de entrega `51/51` conclui com exit `0`**;
- **nenhum `PASS` deste relatório foi atribuído ao exit enganoso de campanha parcial**;
- **nenhuma das duas foi implementada** nesta errata documental.

## 41 · Atos NÃO realizados nesta errata documental

Nenhum commit · nenhum push · nenhum PR · nenhum merge · nenhuma tag · nenhum freeze · nenhuma
release · nenhum deployment · **nenhuma suíte reexecutada** · **nenhuma evidência regenerada ou
alterada** · nenhum byte de código, teste, CSS, HTML, builder, fixture ou dependência tocado ·
`RQ-REAUD-2` e `RQ-REAUD-3` **não implementadas** · o documento de verificação técnica produzido
pela sessão implementadora **não foi importado** como parecer independente · microfase 5.0.4
**não iniciada** · nenhuma autoauditoria · nenhum dado de cliente tocado.

A candidata segue aguardando **auditoria independente em sessão e contexto distintos**. Declarar a
microfase encerrada, congelada ou aprovada **não é ato meu**.

---

# ERRATA FINAL — BLOCKER DE PRINT `B-AUD-FIN-503-1`

## 42 · Escopo, fonte e limite desta rodada

Diretriz vinculante: `ERRATA_FINAL_BLOCKER_PRINT_MICROFASE_5_0_3.md` · SHA-256
`8550246cb2d0a560552d22187d3e487fbd0a8994a2beb8c0521ca0eb4652de63` · 12.819 bytes · 328 linhas de
conteúdo · UTF-8 sem BOM · zero CRLF — identidade conferida antes de qualquer edição.

**Fonte autoritativa do defeito — parecer independente final:**

```text
AUDITORIA_INDEPENDENTE_FINAL_MICROFASE_5_0_3.md
SHA-256   8d9ed98c2ec9107097a613da9c4d1cb849115ad0e77d1ac8d2ddaed50584bbea
bytes     38.883
linhas    740
encoding  UTF-8 sem BOM · zero CRLF
veredito  FAIL — B-AUD-FIN-503-1
```

O parecer foi lido integralmente. Permanece **fora** do repositório: não foi editado, não foi
copiado para o clone e não é citado como aprovação.

Escopo desta rodada, e **somente** ele: corrigir `B-AUD-FIN-503-1` e fechar `RQ-AUDFIN-1` e
`RQ-AUDFIN-2`. A microfase **não** foi reimplementada. Camada 1, engine, Session Portability, print
congelado, fixtures normativas, package files, spec REV B e governança de abertura **não** foram
tocados.

> **Nenhum `PASS` independente é alegado nesta rodada.** Os resultados abaixo são execuções da
> sessão que aplicou a correção. A candidata **aguarda reauditoria independente estreita**.

## 43 · `B-AUD-FIN-503-1` — corrigido, aguardando reauditoria

### 43.1 Fato aceito

Duas regras de neutralização da Camada 5 estavam **fora** do bloco `@media screen`:

```css
#app .radar-box.p50-legacy-off{ position:relative; }
#app .dom[data-p50-legacy="neutralized"] .ruler{ opacity:.45; }
```

O confinamento da errata anterior cobriu apenas as duas formas **binárias** de sumir (`display` e
`visibility`). `opacity` e `position` são apresentação **contínua** da mesma decisão e alcançavam o
papel legado, que no modo legado imprime `.wrap`/`#app` diretamente.

### 43.2 Reprodução ANTES da correção — em cópia temporária

Oráculo próprio em Chromium real, caminho real (`beforeprint` → mídia `print`), fixture
insuficiente `P50-F3`, comparação contra o HTML baseline de entrada da 5.0.2
`5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd`. A medição é de **estilo
computado contínuo**, não de presença.

```text
GATE BLOQUEADO (P50-F3) · candidata 4c7f678b…
  nós congelados comparados : 248
  divergências              : 6
    .radar-box    position   static → relative
    .ruler[0..4]  opacity    1      → 0.45      (cinco réguas)
  screenshot                : DIFERENTE da baseline
  pixels distintos          : 19.820 de 6.016.320 · delta máximo de canal 124
  bounding box              : x 125–624 · y 612–887
                              = união exata das cinco réguas
                              (x=125, w=500, y=612/679/746/813/880, h=8)

GATE LIBERADO (P50-F5)
  divergências              : 0
  screenshot                : IDÊNTICO à baseline
```

O contraste entre os dois estados é a prova de causalidade: a divergência aparece **exatamente**
quando a neutralização está ativa. A mera presença dos elementos **não** foi aceita como prova —
todos os nós continuavam presentes, visíveis e com o texto canônico correto.

### 43.3 Correção aplicada — CSS mínimo

Único arquivo de produção alterado: `ui_p50_v32.css`. As duas regras foram **movidas** para dentro
do bloco `@media screen` já existente. Nenhuma regra foi criada, removida ou reescrita; nenhum
arquivo congelado foi tocado para compensar.

```diff
-   regra correta é NÃO agir no print, não é "agir de outro modo". */
+   regra correta é NÃO agir no print, não é "agir de outro modo".
+
+   B-AUD-FIN-503-1 · o confinamento anterior cobria apenas `display` e
+   `visibility` — as duas formas BINÁRIAS de sumir. `opacity` e `position`
+   são apresentação CONTÍNUA da mesma decisão de neutralização e ficaram de
+   fora, alcançando o papel legado: sob gate fechado as cinco réguas saíam
+   impressas a 45% e a `.radar-box` mudava de contexto de posicionamento.
+   Toda decisão de neutralização da Camada 5 vive AQUI dentro. */
 @media screen{
   #app .p50-legacy-gone{ display:none !important; }
   #app .p50-legacy-veiled{ visibility:hidden !important; }
+  #app .radar-box.p50-legacy-off{ position:relative; }
+  #app .dom[data-p50-legacy="neutralized"] .ruler{ opacity:.45; }
 }

-#app .radar-box.p50-legacy-off{ position:relative; }
 #app .radar-box.p50-legacy-off > .p50-legacy-note{
@@
 #app .lbl > .p50-legacy-note{ margin:0; margin-left:auto; color:var(--faint); }
-#app .dom[data-p50-legacy="neutralized"] .ruler{ opacity:.45; }
```

As três regras que **permanecem** fora de `@media screen` alcançam somente
`.p50-legacy-note` — nó **novo** da fase, já suprimido por `display:none !important` no bloco
`@media print`. Nenhuma delas atinge nó congelado no papel.

### 43.4 Verificação DEPOIS da correção

```text
GATE BLOQUEADO (P50-F3) · candidata corrigida
  nós congelados comparados : 248
  divergências              : 0
  nós novos visíveis no papel: []
  screenshot                : IDÊNTICO à baseline (pixel a pixel)

GATE LIBERADO (P50-F5)
  divergências              : 0
  screenshot                : IDÊNTICO à baseline (pixel a pixel)
```

> **Nota de método.** O oráculo de pixels é o screenshot da página em mídia `print`, e é ele que
> sustenta a afirmação de identidade. O SHA-256 do PDF **não** é usado como oráculo: o gerador
> embute identificadores não determinísticos, de modo que dois PDFs visualmente idênticos podem
> ter digests diferentes. Numa das execuções os digests coincidiram; isso é acidental e **não** é
> reivindicado como propriedade.

**Apresentação de tela preservada** (mídia `screen`, gate bloqueado):

```text
.ruler × 5                          opacity 0.45          preservado
.radar-box.p50-legacy-off           position relative     preservado
nota do radar                       visível, position absolute, texto canônico
valores de domínio / fills / legenda legados   ocultos    preservado
substitutos honestos P50 visíveis   17
nós fora da árvore acessível        17 (aria-hidden)
pageErrors                          []
```

A correção do print **não** apagou a neutralização honesta da tela.

### 43.5 `RQ-AUDFIN-2` — tratada: `P50-PR1` fortalecido

`P50-PR1` continua sendo o guard **adicional e estreito**; nenhum namespace novo foi criado e
**`P50-VIS10` permanece aberto e integral**.

Acrescentado o oracle de **apresentação contínua**, contrato
`P50-PR1/continuous-presentation-v1`, que compara candidato × baseline de entrada, em mídia
`print`, por seletor e índice, com cardinalidade conferida:

| seletores | cardinalidade esperada |
|---|---|
| `#app .grid2 .panel .dom .ruler` | 5 |
| `#app .grid2 .panel .dom .ruler .fill` | 5 |
| `#app .grid2 .panel .dom .conf` | 5 |
| `#app .grid2 .panel .dom .lbl > span` | 5 |
| `#app .radar-box` | 1 |
| `#app .scale-legend` | 1 |

Propriedades comparadas: `display` · `visibility` · `opacity` · `position` · `filter` ·
`transform` · `color` · `backgroundColor`.

Regras do oracle:

- `opacity` **não** é reduzida a checagem binária `=== 0`; qualquer divergência contra a baseline
  reprova, inclusive `1 → 0.45`;
- nó ausente, cardinalidade divergente, identidade de nó divergente ou estilo divergente produzem
  `FAIL` nomeando **seletor, índice, propriedade, valor baseline e valor candidato**;
- dois estados são exercitados: **gate bloqueado** (`P50-F3`, onde as classes e atributos de
  neutralização existem) e **gate liberado** (`P50-F5`, controle positivo de ausência de
  divergência);
- na mídia `screen`, sob gate bloqueado, o guard exige que a atenuação e o contexto de
  posicionamento **continuem** valendo, e que os nós congelados sigam fora da árvore acessível.

**Determinismo.** A Camada 1 aplica `.screen{animation:fade .35s ease}`. Medir estilo computado
durante a animação devolve `transform` intermediário e tornaria a comparação instável — efeito
observado na reprodução (`matrix(1,0,0,1,0,1.41066e-08)` contra `none`). O guard passou a aguardar
o **repouso** das animações (`document.getAnimations()`, com guarda de tempo de 2 s) antes de cada
medição, nos dois lados da comparação. O estado medido é o mesmo que o papel recebe.

### 43.6 `RQ-AUDFIN-1` — corrigida documentalmente

`tests_p50_mutants.js` **não** consta da lista nominal e fechada da REV B §29.2, nem da §29.3. A
afirmação anterior da §28.1 — de que estaria "autorizado pela §29.2/§29.3" — era **incorreta** e
foi corrigida.

Classificação correta, registrada aqui: **desvio aditivo herdado da microfase 5.0.1**
(commit `70154a1b`), **divulgado**, **manifestado** (`MANIFEST_PHASE5_P50.sha256`) e **aceito** nas
auditorias independentes anteriores da 5.0.1 e da 5.0.2. É arquivo **somente de teste**, fora de
`test:all`, sem efeito de runtime e sem entrada no HTML. **Não é desvio novo da 5.0.3.**

A spec **não** foi modificada nesta errata para promovê-lo. Regularizá-lo nominalmente, se
desejado, exige revisão própria da REV B — ato do proprietário, não desta rodada.

### 43.7 `RQ-AUDFIN-3` — backlog não bloqueante

`P50-SUF0` não proíbe **estruturalmente** recontagem por DOM na camada derivada. O parecer provou
que hoje **não é explorável**: o shell não está no DOM na superfície de resultados, o que torna tal
mutante código morto, e a prova por sentinela captura qualquer override vivo. Nenhuma proibição
estrutural de DOM foi acrescentada nesta errata, conforme determinado. Permanece como
endurecimento em backlog.

## 44 · Mutação — classe nova coberta

`M51` foi **preservado** e reancorado ao bloco `@media screen` corrigido: continua cobrindo a
remoção do bloco inteiro, que produz sumiço **binário** de conteúdo. Os dois mutantes novos cobrem
a classe **distinta** que passou despercebida — regra contínua deixada **fora** do bloco, que não
faz nada sumir e apenas atenua ou reposiciona o nó congelado no papel.

```text
DETECTADO      P50::M51 · remover o escopo @media screen da neutralização
               gate P50-PR1
               FAIL … [print: valor do domínio 0 ausente do papel · …]

DETECTADO      P50::M52 · opacidade de neutralização desconfinada
               gate P50-PR1
               FAIL … [gate-bloqueado · estilo divergente em .ruler[0]
                       propriedade opacity: baseline "1", candidato "0.45"]

DETECTADO      P50::M53 · posicionamento de neutralização desconfinado
               gate P50-PR1
               FAIL … [gate-bloqueado · estilo divergente em .radar-box[0]
                       propriedade position: baseline "static", candidato "relative"]
```

Os três são detectados pelo **gate esperado** e pelo **motivo específico** exigido — não por
manifesto, não por hash e não por consequência incidental de outro gate. `P50::M52` e `P50::M53`
são invisíveis a todas as verificações anteriores de presença, texto e visibilidade: só o oracle
de apresentação contínua os enxerga, o que os torna prova **não vacuosa** do fortalecimento.

**Qualificação nominal (`RQ-REAUD-2`, mitigada).** As linhas individuais passaram a se
autoqualificar por suíte — `P50::M52` em vez de `M52` — e o cabeçalho do resultado nomeia o arquivo
e o namespace. A colisão nominal com a matriz de engine deixa de depender apenas do contexto.

A barreira central `P50_NO_EVIDENCE=1` **não** foi enfraquecida: permanece aplicada por construção
no executor comum `run()`, e nenhum mutante novo a declara individualmente.

## 44.1 · Campanha completa e regressão desta errata

Cada comando executado **até a conclusão**, com código de saída próprio. Nenhum `PASS` atribuído a
timeout, interrupção, `SKIP` indevido ou campanha parcial com exit enganoso.

| verificação | esperado | observado | exit |
|---|---|---|---|
| campanha P50 de mutação | `53/53` | **53/53 detectados** · 0 não detectados | **0** |
| acervo protegido durante a campanha | `29/29`, zero escrita | **29/29 byte-idênticos**, zero escrita | — |
| P50 CORE | `31/31` | **31 PASS · 0 FAIL de 31** (sem crescimento nominal) | **0** |
| P50 Chromium | `5/5`, zero SKIP | **5 PASS · 0 FAIL de 5** · 0 SKIP | **0** |
| `P50-SUF7` | `1024/1024` | **PASS** — 1024 vetores | **0** |
| `P50-SUF8` | `1024/1024` | **PASS** — 1024 vetores | **0** |
| engine | `105` | **105 PASS · 0 FAIL de 105** | **0** |
| UI 3.1/3.2/3.3.1/3.3.2/3.3.3 | `19+25+11+23+26` | **19 · 25 · 11 · 23 · 26** | **0** ×5 |
| UX 4.1 | `56` | **56 PASS · 0 FAIL de 56** | **0** |
| Target 4.3.1 | `30` | **30 PASS · 0 FAIL de 30** | **0** |
| Refinement 4.4 | `28` | **28 PASS · 0 FAIL de 28** | **0** |
| Journey 4.5 | `31` | **31 PASS · 0 FAIL de 31** | **0** |
| Icons 4.6 | `12` | **12 PASS · 0 FAIL de 12** | **0** |
| Session 4.8 | `97/97` | **97 PASS · 0 FAIL de 97** | **0** |
| UG (UG13 em Chromium real) | `13/13` | **13 PASS · 0 FAIL de 13** | **0** |
| M41 | `COMPARAÇÃO PASS`, payload preservado | **COMPARAÇÃO: PASS** · payload `9794b267…3bed4365b` | **0** |
| `test:visual` | `67 / 0 / 37` | **67 passed · 0 failed · 37 skipped** | **0** |
| print congelado | `23/23` | **23 PASS · 0 FAIL de 23** (UI 3.3.2 PDF) | **0** |
| builds A/B | iguais entre si e ao candidato | **A == B == `04f9d7ba…5de5639ab`** | **0** ×2 |
| engine · M41 · boundary | byte-idênticos | **intactos** | — |
| manifesto | `47/47` | **47/47**, cardinalidade inalterada | — |

Ambiente: Node `v22.23.2` · Python `3.14.4` · Playwright `1.62.1` · Chromium real
`151.0.7922.34` (`RQ-502-1` mantida) · `pageErrors: []`.

## 44.2 · Hashes pre/post desta errata

```text
CAMINHO                                 PRE (candidata FAIL)      POST (candidata corrigida)
ui_p50_v32.css                          9fe665be…5b02f44a         57a6fa72…8d77d7620    13.896 B · 351 linhas
tests_p50_chromium.js                   8d3996b8…d7d32de308316    3295c91f…324371052e   73.560 B
tests_p50_mutants.js                    245337cb…c50ecfd6c05fedb  28f2e876…8c8c067ddf5  39.698 B
quickscan_secops_soccmm_v3_2_dev.html   4c7f678b…62d4dd29         04f9d7ba…5de5639ab   651.969 B
docs_phase5/MICROFASE_5_0_3_REPORT.md   ff5d78b7…9528ac           (regravado nesta errata)
docs_phase5/MANIFEST_PHASE5_P50.sha256  b61a1532…68a5cc2f         (regerado POR ÚLTIMO)

INALTERADOS (conferidos byte a byte)
engine_v32.js                           9a4a2e67…2b5d247a         idêntico
payload funcional M41                   9794b267…3bed4365b        idêntico
ui_p50_shell_v32.js · ui_p50_suff_v32.js · ui_p50_results_v32.js · fixtures_p50.js
tests_p50_core.js · build_v32_html.py · package.json · package-lock.json
todos os 34 caminhos protegidos/§29.3 da boundary (§28.1)
```

**Evidências.** Das 29, exatamente **2** foram regeneradas por execução limpa autorizada:

```text
P50-5.0.3-mutation.json             a419cc09…d9478ce2e  →  6cd79e68…c3183da7   (53/53, IDs P50::*)
P50-5.0.3-sufficiency-surface.json  df9d970f…9cca7fe1   →  908df6d8…974a918c   (contrato do guard)
```

As outras **27 permanecem byte-idênticas** — incluindo os **15 screenshots correntes** da 5.0.3,
o que confirma que a apresentação `screen` **não** mudou, e a **totalidade** da evidência histórica
`P50-5.0.1-*`, `P50-5.0.2-*`, `P50-ACC6-*` e `P50-mutation-5.0.1.json`. A cardinalidade do acervo
segue **29**; nenhum arquivo novo foi criado.

## 45 · Atos NÃO realizados nesta errata

Nenhum commit · nenhum push · nenhum PR · nenhum merge · nenhuma tag · nenhum freeze · nenhuma
release · nenhum deployment · microfase 5.0.4 **não iniciada** · Camada 1, engine, Session
Portability, print congelado, fixtures normativas, `package.json`, `package-lock.json`, spec REV B
e governança de abertura **não tocados** · `preparePrint()`, `buildPrintReport()`, `ui_v32.js` e
`ui_v32.css` **não alterados** · evidência histórica `P50-5.0.1-*` e `P50-5.0.2-*` **não alterada**
· `P50-VIS10` **não encerrado** · nenhum namespace de gate novo criado · `RQ-AUDFIN-3` **não
implementada** · nenhuma alegação de `PASS` independente · nenhum dado de cliente tocado ·
o parecer independente **não** foi copiado para o repositório.

A candidata aguarda **reauditoria independente estreita**. Declarar a microfase encerrada,
congelada ou aprovada **não é ato meu**.
