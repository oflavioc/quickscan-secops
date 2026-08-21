# CORREÇÃO PÓS-MERGE — RESOLUÇÃO IMUTÁVEL DA BASELINE DE `P50-PR1`

**Data:** 2026-08-21 · **Branch:** `fix/phase5-5-0-3-pr1-baseline` (a partir de `main` em `e0cde76f…`)
**Natureza:** correção **estrita de infraestrutura de teste**. Nenhum byte de runtime alterado.

---

## 1 · Descoberta — somente após a integração

A pendência não era observável enquanto a microfase 5.0.3 vivia na sua branch. Ela apareceu na
verificação pós-merge determinada pelo proprietário, ao executar
`P50_NO_EVIDENCE=1 npm run test:p50vis` sobre a `main` já integrada:

```text
FAIL  P50-PR1 — Legacy print surface preserved under insufficient gate
  [baseline de entrada NÃO comparado (baseline de entrada com SHA 04f9d7ba9c5534af
   != 5d1a301e472dd145) — oráculo (B) permanece exigido
 · oracle de apresentação contínua NÃO executado (…)]

P50 CHROMIUM: 4 PASS · 1 FAIL de 5      exit 1
```

## 2 · Por que NÃO é regressão de produto

- a árvore de `main` é **byte-idêntica** à árvore do commit auditado `4e30c8e…` — `cc028271…`;
- HTML `04f9d7ba…5de5639ab`, engine `9a4a2e67…2b5d247a` e payload M41 `9794b267…3bed4365b` intactos;
- `P50 CORE` permaneceu `31 PASS · 0 FAIL`, exit 0, na mesma árvore;
- as 29 evidências permaneceram byte-idênticas;
- a boundary protegida permaneceu 34/34.

O guard **fez o que devia**: recusou comparar o candidato consigo mesmo e falhou, em vez de emitir
um `PASS` vácuo. Essa é exatamente a propriedade de não-vacuidade verificada pela reauditoria
independente final (`ebdf69e6…f87c752d`, §8). O defeito está na **forma de resolver a referência**,
não no que o gate mede.

## 3 · Reprodução RED antes de qualquer edição

Na branch de correção, criada a partir de `main` em `e0cde76f…`, **antes** de editar:

```text
P50_NO_EVIDENCE=1 npm run test:p50vis
  4 PASS · 1 FAIL de 5 · gate P50-PR1 · exit 1
  diagnóstico: HEAD: produziu 04f9d7ba9c5534af, diferente da baseline 5d1a301e472dd145
  oracle de apresentação contínua NÃO executado (baseline recusada)
  worktree 0 caminhos · evidências 29/29 byte-idênticas
```

## 4 · Causa-raiz

`pr1Baseline()` materializava a baseline por `git show HEAD:quickscan_secops_soccmm_v3_2_dev.html`.
Na branch da microfase, `HEAD` era `fe4a536a…` e a expressão resolvia corretamente para a baseline
de entrada. Depois do merge, `HEAD` passou a ser o merge commit, cujo HTML **é o próprio candidato**.
A referência era, portanto, **dependente do contexto de branch**.

## 5 · Correção aplicada — localizada, só em `tests_p50_chromium.js`

Referência ancorada no **commit imutável de entrada**, independente de branch, `HEAD`, pai corrente
ou merge-base:

```js
const PR1_BASELINE_COMMIT = "fe4a536a508ed592bf62d1545a90e399036bb43d";
const PR1_BASELINE_SHA    = "5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd";
// pr1Baseline(): git show <PR1_BASELINE_COMMIT>:quickscan_secops_soccmm_v3_2_dev.html
```

Preservados: o recálculo do SHA-256 dos bytes materializados e a exigência de igualdade exata com
`PR1_BASELINE_SHA`; a falha **não vacuosa**; e toda a semântica do `P50-PR1` — medições, seletores,
propriedades, fixtures, estados e oráculo duplo **inalterados**. Nenhuma cópia do HTML da baseline
foi incorporada ao repositório. Diagnóstico melhorado para nomear o commit esperado e o SHA observado.

**Não-vacuidade reprovada por prova dirigida** (somente em cópia temporária, restaurada byte a byte):

```text
A) commit inexistente  -> FAIL P50-PR1 [baseline de entrada indisponível no commit 0000000000000000: …]  exit 1
B) commit existente com HTML divergente (o merge commit e0cde76f…)
                       -> FAIL P50-PR1 [… commit e0cde76f6440ff3c com SHA 04f9d7ba9c5534af
                                          != 5d1a301e472dd145 (esperado)]                                exit 1
```

## 6 · Hashes pre/post de `tests_p50_chromium.js`

```text
PRE   3295c91f2d12d932699a87bba85657c62127175f39cf028001580c324371052e   73.560 bytes · 1.293 linhas
POST  52c5e1357dbb53b19bcff483e9521356b0b48063bdb6610df90114fc3bdf8847   74375 bytes · 1305 linhas
```

## 7 · Assurance GREEN, na mesma árvore

```text
npm run test:p50                        31 PASS · 0 FAIL de 31                 exit 0
P50_NO_EVIDENCE=1 npm run test:p50vis    5 PASS · 0 FAIL de 5 · ZERO SKIP      exit 0
                                         Chromium real 151.0.7922.34
```

Resultado detalhado do `P50-PR1` (extraído de execução limpa em cópia temporária, para não regravar
evidência no clone):

```text
baseline comparada        true
commit de origem          fe4a536a508ed592bf62d1545a90e399036bb43d
SHA da baseline           5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd
candidato                 04f9d7ba9c5534aff69fec5193ab7fd8548dae304eddf29fad1378c5de5639ab
contrato                  P50-PR1/continuous-presentation-v1  (compared: true)
gate-bloqueado (P50-F3)   divergências: 0
gate-liberado  (P50-F5)   divergências: 0
tela · .ruler opacity     ["0.45","0.45","0.45","0.45","0.45"]
tela · .radar-box         p50-legacy-off, position relative · nota absolute · 17 nós fora da árvore acessível
tela · valores legados    [false,false,false,false,false] · 17 substitutos visíveis
print · substitutos P50   0 de 17 visíveis · 5/5 fills · radar e legenda presentes no papel
```

## 8 · Prova de zero alteração fora da infraestrutura de teste

```text
quickscan_secops_soccmm_v3_2_dev.html   04f9d7ba…5de5639ab   INALTERADO
engine_v32.js                           9a4a2e67…2b5d247a    INALTERADO
payload funcional M41                   9794b267…3bed4365b   INALTERADO
ui_p50_suff_v32.js · ui_p50_results_v32.js · ui_p50_shell_v32.js · ui_p50_v32.css   INALTERADOS
fixtures_p50.js · tests_p50_core.js · build_v32_html.py                             INALTERADOS
evidências                              29/29 byte-idênticas · nada regravado
boundary protegida                      34/34 byte-idêntica
package.json · package-lock.json · spec REV B · CLAUDE.md                           INTOCADOS
relatório, aceitação e os três pareceres da 5.0.3                                   INTOCADOS
```

## 9 · Declarações

1. Esta correção é **infraestrutura de teste** e **não reabre o conteúdo funcional da 5.0.3**:
   nenhum byte de runtime, nenhuma evidência, nenhum documento selado foi alterado. O veredito
   independente `PASS COM RESSALVAS NÃO BLOQUEANTES` e a aceitação do proprietário permanecem
   válidos e inalterados.
2. `P50-VIS10` continua **aberto e integral**; `P50-PR1` segue guard adicional e estreito.
3. `RQ-REAUD-FIN-1` permanece aceita e não bloqueante, nos termos de `MICROFASE_5_0_3_ACCEPTANCE.md`.
4. A **Phase 5.0 continua aberta e não congelada**; nenhuma tag, freeze, release ou deployment.
5. A **microfase 5.0.4 não foi iniciada**.
