# REGISTRO DE ACEITAÇÃO — MICROFASE 5.0.4 · Target & Heat Map Visualizations

**Data da decisão:** 2026-08-21
**Decisor:** Flávio Costa — proprietário e auditor do projeto
**Ato:** aceitação da candidata da microfase 5.0.4 sob veredito `PASS COM RESSALVAS NÃO
BLOQUEANTES`, e autorização de selagem documental, commit, push, PR e merge por merge commit na
branch `feat/phase5-5-0-4`.

Este documento **não é auditoria** e **não altera byte executável algum**. Ele registra a decisão
do proprietário, a aceitação nominal das sete ressalvas como backlog não bloqueante e a regra de
identidade canônica do parecer importado.

---

## 1 · Identidade da microfase

```text
microfase          5.0.4 · Target & Heat Map Visualizations
fase               Phase 5.0 (Assessment Experience) — ABERTA, NÃO congelada
spec normativa     specs/PHASE_5_0_REV_B.md
                   4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b
branch             feat/phase5-5-0-4
HEAD preexistente  ae03c04fd6eee124777ec8d57f29cd8cb8f2a04a
                   (merge do fix P50-PR1 em main; zero commit da 5.0.4 sobre ele)
```

## 2 · Identidades materiais aceitas

```text
HTML final         quickscan_secops_soccmm_v3_2_dev.html
                   d7c532097ac00548212085579c434e4dab69d14b7ed51ad86ab68377fd6cdb8c
                   685.519 bytes

engine             engine_v32.js
                   9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a   inalterado

payload M41        9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b   inalterado
                   (COMPARAÇÃO PASS pelo harness real)

módulo de results  ui_p50_results_v32.js
                   b52f5c3b3ef2975ac9906f31f8001c21a3311cbfc156f2aeed8780eaa567eb5d

CSS da Camada 5    ui_p50_v32.css
                   81b32002a8fe4d891d4d7ce3704ee98c6c43ddefba9d8bd5f966cfdb6f2d9a30

suíte P50 CORE     tests_p50_core.js
                   4a6b526d873e485249eaf02a25b06029c4d289ce55a12afc8e05fa763426b324

suíte Chromium     tests_p50_chromium.js
                   c0ead18e2be76fb7ef8c219b1f30ac876c2ae543d04007a415c687968fdf0d0e

suíte UNSET UG     tests_unset_ug.js
                   af129900d1c5e2b8f02a9582f4fc8ab26fecc617cc595c9f2a7508000cabcb91
                   (exceção test-only nominal em UG8 · reancorada em P50-GOV1)

fixtures           fixtures_p50.js
                   08610c8f92238eefb82a07ec57cb1ab9cdbb626cad1c9483d278e26ed572443f

harness de mutação tests_p50_mutants.js
                   28f2e876d4f614baf83b02d0c23bbbf19a983d4b0a943e1b42d1f8c8c067ddf5   byte-idêntico ao HEAD

relatório          docs_phase5/MICROFASE_5_0_4_REPORT.md
                   8bc9db6dcf9d026e081d24cc6a89ec7bdc9e7fcaaa8147e9efa97cae933e3e37
                   37.080 bytes · 664 linhas — PRESERVADO nos bytes auditados
```

## 3 · Parecer independente autorizador

| parecer (importado em `docs_phase5/`) | SHA-256 | bytes | linhas | veredito |
|---|---|---:|---:|---|
| `AUDITORIA_INDEPENDENTE_MICROFASE_5_0_4.md` | `8aaa751334b5ee8e34e390d9ed5049bad670ec46666aafba47f6bbf9a5e34107` | 25.553 | 445 | **PASS COM RESSALVAS NÃO BLOQUEANTES** |

Importado **byte a byte**, sem normalização, reformatação ou edição — `cmp` origem/destino
idêntico, UTF-8 sem BOM, zero CRLF. Norma da auditoria:
`AUDITORIA_INDEPENDENTE_RISCO_MICROFASE_5_0_4.md`
(`5d1dad7862ffb8078de339c65967a50942f0111d89424dae19ffb39ceb611147`, 8.225 bytes, 172 linhas),
identidade conferida pelo próprio auditor.

Auditoria executada por sessão independente, sem participação na implementação nem nas correções.
**Nenhum dos nove riscos bloqueantes da §0 do parecer se materializou.**

## 4 · Veredito autorizador

```text
PASS COM RESSALVAS NÃO BLOQUEANTES
```

`B-504-UNSET-LABEL` está **FECHADO** pela ERRATA AUTORIZADA UG8 (§20 do relatório), por decisão
explícita do proprietário (Opção 1). **Blockers abertos: nenhum.**

## 5 · `RQ-AUD504-ID` — divergência de identidade interna do parecer, aceita

**Aceito expressamente**, como ressalva **documental não bloqueante**, o descompasso entre a
identidade declarada no §12 do próprio parecer e a identidade externa final verificada.

```text
identidade declarada no §12 do parecer (preliminar, anterior à gravação final)
    SHA-256   6395421586a4782ec8e511a269a142597e68c58d6998fca8a1a4aa74a6625827
    bytes     25.020
    linhas    429

identidade externa final VERIFICADA — CANÔNICA para o arquivo importado
    SHA-256   8aaa751334b5ee8e34e390d9ed5049bad670ec46666aafba47f6bbf9a5e34107
    bytes     25.553
    linhas    445
    encoding  UTF-8 sem BOM · zero CRLF
```

**Regra fixada.** A identidade canônica do parecer, para todo efeito de manifesto, rastreabilidade
e conferência material, é `8aaa7513…5a34107` — a identidade externa final verificada na fonte e
reproduzida byte a byte no destino. O bloco `§12` é tratado como **carimbo preliminar superado**,
sem valor descritivo do arquivo entregue.

**Decisão de não reabrir ciclo.** O parecer **não é editado**: permanece exatamente nos bytes
entregues pelo auditor. Nenhuma correção é solicitada e nenhuma rodada adicional de auditoria é
aberta por este motivo.

## 6 · Sete ressalvas não bloqueantes — aceitas nominalmente como backlog

Todas as ressalvas da §8 do parecer são **aceitas como não bloqueantes**. Nenhuma altera cálculo,
estado canônico ou veredito. Nenhuma é convertida em blocker. Nenhuma é corrigida nesta rodada.

| # | ressalva | natureza | decisão |
|---|---|---|---|
| `R1` | barra de `0.0` confirmado é graficamente igual a `n/d` no Atual × Alvo; marcador gráfico explícito de zero pode ser melhorado futuramente — o texto (`"0.0"` peso 700 × `"n/d"` peso normal) já desambigua e a distinção não é cromática | hardening de legibilidade | **backlog** |
| `R2` | redação `"3 de 2 respostas confirmadas"` no drill-down: aritmeticamente honesta (contagem real × limiar canônico), mas editorialmente ruim | editorial | **backlog** |
| `R3` | mensagem de diagnóstico do lint de fronteira em `tests_p50_core.js` menciona `5.0.4` embora a lista `forbidden` já guarde a fronteira 5.0.5/§15; o gate está correto e ativo | texto de diagnóstico | **backlog** |
| `R4` | `aria-label` do eixo de presence para `UNSET` é redundante, sem perda semântica; UI-016 (b) continua satisfeita | editorial | **backlog** |
| `R5` | desvio nominal de versão de browser — Chromium `151.0.7922.34` contra o nominal `141.0.7390.37`, com `nominalDeviationAccepted: true` declarado; reproduzido pelo auditor sem regressão | ambiente de reprodução | **backlog** |
| `R6` | `P50-PR1` exige base de objetos git alcançável a partir do diretório de execução; falha com diagnóstico explícito em vez de SKIP silencioso — nota de reprodutibilidade, não defeito | reprodutibilidade | **backlog** |
| `R7` | `UG8` compara por prefixo (`indexOf(...) !== 0`); risco nulo na prática por `sc.every(s => s === expected)` a partir do oráculo independente do harness | hardening cosmético | **backlog** |

Registra-se ainda, sem status de ressalva da 5.0.4, a **observação §8.1** do parecer: `setTarget()`
aceita alvo em pergunta não respondida — comportamento da **camada congelada 4.3.1**, reproduzido
com fidelidade pela 5.0.4 e cuja correção estaria **fora da change boundary autorizada**.

## 7 · Exceção test-only `UG8` — aceita e confinada

```text
escopo do diff        uma única hunk (@@ -138,35 +138,58 @@), integralmente dentro do bloco UG8
UG1–UG7, UG9–UG13     semanticamente intactos · contagem segue 13 · zero asserção removida
natureza              test-only · nominal · delimitada — nenhum byte de produção envolvido
P50-GOV1              reancorado: d2a3f804…1bae2e9 (coincide com HEAD) → af129900…0cabcb91
                      16 entradas PROTECTED antes · 16 depois (uma única entrada atualizada)
não vacuidade         4 mutantes adversariais (ND, DROPROW, DROPRADAR, ZERO) mortos com
                      diagnóstico exato; NDGONE separa corretamente UG8 de UG9
```

O gate **não foi enfraquecido**: a asserção nova exige cardinalidade 5, radar presente, polígono
presente e os cinco valores iguais ao score esperado, contra a expressão antiga que verificava uma
ocorrência solta de `"3.3"`. `UG9` permanece a regressão canônica de `n/d`, íntegra e não absorvida.

## 8 · Estado final observado e aceito

```text
build determinístico                 A == B == candidato d7c53209…fd6cdb8c            exit 0
P50 CORE                             33/33 PASS · 0 FAIL                              exit 0
P50 Chromium                          9/9  PASS · 0 FAIL · ZERO SKIP · Chromium real  exit 0
UNSET UG (UG13 em Chromium real)     13/13 PASS · 0 FAIL                              exit 0
Engine (M1–M40, M42–M86, P2.1)      105/105 PASS · 0 FAIL                             exit 0
UI M3.1 · 3.2 · 3.3.1 · 3.3.3        19 · 25 · 11 · 26 PASS · 0 FAIL                  exit 0
UI 3.3.2 (print/PDF congelado)       23/23 PASS · 0 FAIL, mais o guard P50-PR1        exit 0
UX 4.1 · Target 4.3.1 · Ref 4.4      56 · 30 · 28 PASS · 0 FAIL                       exit 0
Journey 4.5 · Icons 4.6              31 · 12 PASS · 0 FAIL                            exit 0
Session 4.8                          97/97 PASS · 0 FAIL                              exit 0
M41                                  COMPARAÇÃO PASS · payload 9794b267…3bed4365b     exit 0
test:visual                          67 passed · 0 failed · 37 skipped                exit 0
boundary                             P50-GOV1 PASS (16 protegidos) · P50-GOV2 PASS
inventário da árvore PRE/POST        1d7d6582…9f49944 == 1d7d6582…9f49944 (259 arquivos)
manifesto pre-selagem                61/61 · 0 ausentes · 0 excedentes · 0 duplicatas · 0 autorreferência
```

Contagens conferidas por execução real do auditor independente; nenhum PASS é reivindicado para
comando não executado.

## 9 · Declarações

1. **Esta aceitação não altera bytes executáveis.** Nenhum arquivo de produção, teste, builder,
   fixture, evidência ou HTML é modificado por este ato. O único arquivo preexistente alterado pela
   selagem é `docs_phase5/MANIFEST_PHASE5_P50.sha256`, regenerado por último; o parecer importado e
   este registro são **adições documentais**.
2. **O runtime permanece congelado.** `engine_v32.js` byte-idêntico ao baseline e M41 com payload
   exato; o HTML é injeção pura dos módulos autorizados, comprovada por build determinístico.
3. **A microfase 5.0.4 fica aceita para commit, push, PR e merge por merge commit** na branch
   `feat/phase5-5-0-4`, preservando a árvore auditada byte a byte.
4. **A Phase 5.0 permanece ABERTA e NÃO congelada.** Nenhum freeze é declarado por este registro.
5. **Nenhuma tag, release ou deployment é autorizado** nesta rodada.
6. **A microfase 5.0.5 NÃO foi iniciada.** Nenhum módulo, gate, fixture, símbolo ou artefato da
   5.0.5 existe na árvore.
7. **Não há autorização automática para atos futuros.** Cada ato posterior exige autorização
   própria e explícita do proprietário.
