# MICROFASE_5_0_2_REPORT.md — Evidence Capture & Progress UX

**Data:** 2026-08-20 · **Workspace:** `/mnt/c/Projetos/QuickScan-SOC-CMM/phase5`
**Autorização:** instrução do proprietário de 2026-08-20, sob a spec normativa
`specs/PHASE_5_0_REV_B.md` · SHA-256 `4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b`.
**Status:** candidata implementada e verificada. **Nada é declarado congelado.**
A microfase 5.0.3 NÃO foi iniciada. Sem commit, push, PR, merge, tag, release ou deployment.

---

## 1 · Preflight (executado antes de qualquer edição)

```text
branch de origem      main
branch de trabalho    feat/phase5-5-0-2
HEAD de partida       701db0c8d9bf9d93a3632fb94fa0403267c21807   CONFERE
origin/main           701db0c8d9bf9d93a3632fb94fa0403267c21807   local == remoto · 0/0
commit 5.0.1 auditado 70154a1bf331ac616ddec0df0430ef2625a45850   ancestral de HEAD: SIM
worktree inicial      limpo · 0 alterações · nenhum arquivo inesperado
HTML de entrada       61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d
engine                9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
payload M41           9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
manifesto Phase 5     19/19 OK
tags                  nenhuma
```

Leitura integral prévia: `CLAUDE.md` · `specs/PHASE_5_0_REV_B.md` ·
`REV_B_PHASE_OPENING_RECORD.md` · `MICROFASE_5_0_1_REPORT.md` ·
`AUDITORIA_INDEPENDENTE_MICROFASE_5_0_1.md` · `BACKLOG_PRODUCTION_HARDENING_VAULT.md` ·
`MANIFEST_PHASE5_P50.sha256`.

### 1.1 Inventário de requisitos e gates da 5.0.2

| requisito | entregue como | gate |
|---|---|---|
| UI-005 · cue de interpretação | cue = descrição canônica da opção **selecionada**, lida do runtime (Caminho A); `NA` usa o descritor canônico já renderizado pela Camada 1 | P50-UX3 |
| UI-006 · evidência inline | atalho para o campo canônico congelado + preview inerte; owner exclusivo `notes[k]` | P50-UX4 |
| UI-007 · indicador de evidência | chip `presente`/`ausente` na pergunta, reconciliado no evento real de digitação. **A sidebar exibe estado da resposta, não presença de nota** — nenhum indicador de nota foi implementado nela | P50-UX4 · P50-UX5 · P50-SESUX2 |
| UI-008 · metadata chips | Question ID · Domain ID · presença de nota | P50-UX5 |
| UI-010A · estado efêmero | dirty flag + resultado da última operação de sessão | P50-SESUX5 |
| UI-011 · status honesto | componente de status em home, pergunta e resultados | P50-SESUX1A/1B/2/3 |
| UI-049 · safe rendering | texto livre exclusivamente por `textContent`; zero `innerHTML` | P50-UX12 |

## 2 · Arquivos alterados e adicionados

### 2.1 Alterados — inventário completo (correção M-502-1)

O inventário anterior citava 7 alterados; o diff real tem **15 rastreados modificados e 5 novos**:

```text
7   funcionais/testes/HTML   ui_p50_shell_v32.js · ui_p50_v32.css · fixtures_p50.js
                             tests_p50_core.js · tests_p50_chromium.js · tests_p50_mutants.js
                             quickscan_secops_soccmm_v3_2_dev.html
1   manifesto                docs_phase5/MANIFEST_PHASE5_P50.sha256
7   evidências cumulativas   5 PNG + 2 JSON da 5.0.1, regeneradas contra o build corrente
--------------------------------------------------------------------------------
15  rastreados modificados
5   novos                    relatório da 5.0.2 + 4 screenshots da 5.0.2
```


| arquivo | pré (5.0.1 integrada) | pós (candidata 5.0.2) |
|---|---|---|
| `ui_p50_shell_v32.js` | `f3580683d55d73837116060d7be099b47d63c491bb3a0633496fe6df35a7d3c4` | `1f9c7a5a8ad10b724f9caab86eead66eeb5ad6df1f397c4b41b0b75380577b09` |
| `ui_p50_v32.css` | `8a274b4e04167d33289b41958c7d8c363467e6c12bb2a5c83f6dcf4c3c925cd8` | `e873d90d22f0460592003c27d08e38ff26eafbf44c9b3d9f0ea661e05bef35fb` |
| `fixtures_p50.js` | `fde1e9868e1dddc294c4f66464dd031b65a5bcd0fea15ca850e3651696d48eac` | `b7f5b31039f6da4864510b458da5e899bca29dc482cc8abe0d2ff5d25caa82d7` |
| `tests_p50_core.js` | `f495c5081cf62c9ede2352a8d7edf42785505fd065e78c43a49f93375fbeb5b6` | `9817c46e09fe39cf9a874821772ce1e00a15283eee4c21305a5b5e358aa65242` |
| `tests_p50_chromium.js` | `465ff2686bc36ad47fcf20a436509a01ec0ab4673b89d9914f14c6dc950e5396` | `2c99e932dc4ac167714916c4ca2ae480c6a2e51afae93d01ea895a4ac9c6efdd` |
| `tests_p50_mutants.js` | `009a879f30ae31355f0c86511e432497fac0b7a85118b73442e1078d43b51bf5` | `774f9325ad3cc58a7247c58fe5c92231fc2ec3a422f923d31bdb3c4c979326fc` |
| `quickscan_secops_soccmm_v3_2_dev.html` | `61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d` | `5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd` |

**Evidências `P50-5.0.1-*` são CUMULATIVAS (correção L-502-2).** Foram regeneradas contra o
build corrente da 5.0.2: os arquivos com prefixo `P50-5.0.1-` retratam o build 5.0.2, não o build
auditado da 5.0.1. A trilha histórica não foi apagada — os bytes auditados da 5.0.1 permanecem no
commit `70154a1b…` em `main`. Os critérios de aceite da 5.0.1 continuam válidos
(`ACEITE-UX-5.0.1` PASS). Microfases futuras devem versionar os nomes por candidata.

### 2.2 Adicionados

```text
docs_phase5/MICROFASE_5_0_2_REPORT.md                       este relatório
docs_phase5/evidence_p50/P50-5.0.2-evidence-P50-F8-1440.png  superfície de evidência · rich notes
docs_phase5/evidence_p50/P50-5.0.2-evidence-P50-F10-1440.png superfície de evidência · adversarial
docs_phase5/evidence_p50/P50-5.0.2-session-exported-1440.png    status após export (screenshot do elemento)
docs_phase5/evidence_p50/P50-5.0.2-session-dirty-after-edit-1440.png  estado pós-edição: default + dirty
```

### 2.3 NÃO alterados — confirmação de boundary

```text
build_v32_html.py    f2295a42…16456a9e   INTOCADO   (a 5.0.2 não precisou de nova injeção)
package.json         fc0bf13b…c924746f   INTOCADO
package-lock.json    22203244…d058b68a   INTOCADO   · nenhuma dependência instalada
```

Verificação programática dos **20** arquivos protegidos/normativos (engine, Camada 1,
`ui_v32.js`, `ui_ux_v32.js`, `ui_target_v32.js`, `ui_refinement_v32.js`, `ui_journey_v32.js`,
`ui_session_v32.js`, `ui_icons_v32.js`, CSS congelados, `harness_m41_v313.js`, snapshot M41,
`tests_unset_ug.js`, `MANIFEST.sha256` do core, lockfile, builder, `package.json`, spec,
`CLAUDE.md`): **20/20 intactos**.

Nenhum módulo novo foi criado. `ui_p50_suff_v32.js` e `ui_p50_results_v32.js` **não existem** e
**não foram injetados** — verificado no HTML construído (0 ocorrências).

## 3 · AMB-2.1 — RATIFICADA pelo proprietário (2026-08-20)

A direção arquitetural foi **ratificada** sob 12 condições, todas agora demonstradas
materialmente por `P50-SESUX4` e por mutantes discriminantes (§7.1). Registro original abaixo.

### 3.0 · Decisão de arquitetura (registro original)

**AMB-2.1 · observadores de `downloadSession` e `importSessionDocument`.**

`P50-SESUX2` exige "wording de export somente após export bem-sucedido" e `P50-SESUX3` exige
wording de import correto. Sucesso e falha só são conhecidos pelo **valor de retorno** dessas
funções; não há efeito colateral observável equivalente.

`ui_session_v32.js` **não é IIFE**: `downloadSession`, `importSessionDocument` e
`captureCanonicalInputs` são declarações no escopo compartilhado do bloco injetado. A 5.0.2
envolve as duas primeiras a partir de `ui_p50_shell_v32.js`, aplicando as **mesmas 12 condições
aprovadas em AMB-1** para o wrapper de `render`:

```text
captura única · predecessor SEMPRE invocado · comportamento canônico inalterado
retorno repassado intacto · falha do observador isolada (try/catch)
nenhuma escrita direta em estado canônico · nenhum arquivo protegido editado
```

Não duplica nem substitui a lógica de Session Portability: apenas **lê** o resultado que ela já
produziu. `ui_session_v32.js` permanece byte-idêntico. Registro para ratificação do proprietário,
no mesmo formato de AMB-1 — não é STOP, porque não há caminho alternativo dentro da boundary e o
mecanismo já foi aprovado.

## 4 · Cumprimento do split obrigatório

```text
ui_p50_suff_v32.js         NÃO criado · NÃO injetado
ui_p50_results_v32.js      NÃO criado · NÃO injetado
UI-009A · progresso de suficiência        NÃO antecipado
UI-012 / UI-012A / UI-012B                NÃO antecipados
```

`P50-SUF0` (lint prospectivo) continua verde: o renderer novo não referencia
`dataSufficiency`, não deriva suficiência e não contém comparações com os limiares `10`/`2`.
"Progress UX" foi lido como **experiência de captura e status**, jamais como contrato de
suficiência ou de resultados.

## 5 · Gates novos da 5.0.2

```text
P50-UX3      cue == descrição canônica da opção selecionada; sem cue sem resposta;
             sem cue stale ao trocar de opção; NA usa o descritor canônico do runtime
P50-UX4      evidência binda somente a notes[k]; chega a inputs.assessment.notes[qid];
             nota NÃO confirma resposta; nenhum store paralelo; sem escrita direta
P50-UX5      3 chips exatamente, todos com provenance e nome acessível;
             importance/weight/framework/NIST/CIS ausentes
P50-UX12     12 payloads adversariais, isolados e combinados: zero execução,
             zero nó criado, zero atributo de evento, zero escape de contexto
P50-SESUX1A  lint de claims + exigência das frases canônicas de UI-011
P50-SESUX1B  (Chromium) 6 fixtures obrigatórias: fresh · modified-not-exported ·
             export-success · post-export-modification · import-success · export-failure
P50-SESUX2   wording de export só após sucesso; volta ao padrão após modificação posterior
P50-SESUX3   wording de import não implica persistência automática
P50-SESUX4   roundtrip permanece canônico com a superfície nova ativa
P50-SESUX5   estado efêmero jamais serializado (varredura recursiva de chaves) +
             recusa adversarial no import (raiz, inputs e assessment)
```

Nenhum ID fora da tabela normativa de reserva foi criado.

## 6 · Contagens integrais

```text
P50 CORE (5.0.1+5.0.2)                     23 PASS · 0 FAIL de 23
P50 CHROMIUM (5.0.1+5.0.2)                  3 PASS · 0 FAIL de  3   Chromium real, sem SKIP
Mutantes                                   24/24 detectados pelo gate e motivo esperados

MATRIZ (engine)                            105 PASS · 0 FAIL de 105
UI 3.1 · 3.2 · 3.3.1 · 3.3.2 (PDF) · 3.3.3  19 · 25 · 11 · 23 · 26   todos 0 FAIL
UX 4.1                                      56 PASS · 0 FAIL de  56
TARGET 4.3.1 · REF 4.4 · JOURNEY 4.5        30 · 28 · 31            todos 0 FAIL
ICONS 4.6                                   12 PASS · 0 FAIL de  12
SESSION 4.8                                 97 PASS · 0 FAIL de  97
UNSET GEOMETRY (UG)                         13 PASS · 0 FAIL de  13  UG13 PASS em Chromium real
M41                                         COMPARAÇÃO PASS · 9794b267…3ed4365b byte-idêntico
engine                                      9a4a2e67…2b5d247a byte-idêntico
npm run test:visual                         67 passed · 0 failed · 37 skipped · exit 0
```

**Regressão de print integral e sem mudança:** UI 3.3.2 (PDF) 23/23, `print.spec` e gates `V*`
dentro dos 67, UG4/UG6/UG9 dentro dos 13. Nenhuma superfície de print/PDF foi tocada; a nova
camada é ocultada em `@media print`.

**Nota de execução honesta:** as suítes foram executadas de forma controlada, **uma a uma**, por
causa do limite de tempo do ambiente. Cada contagem acima provém de uma invocação que concluiu
com código de saída próprio. Nenhum comando interrompido ou expirado recebeu PASS.

## 7 · Mutation testing — 24/24

| # | mutação | gate | veredito |
|---|---|---|---|
| M1..M11 | mutantes herdados da 5.0.1 | P50-UX13/UX1/UX2/SUF0/SUF2/COR1/ACC6/UX 4.1 | 11/11 DETECTADOS |
| M12 | cue exibe a descrição de outra opção | P50-UX3 | DETECTADO |
| M13 | evidência escrita direto em `notes[k]` | P50-UX4 | DETECTADO |
| M14 | chip fabricado (`Importance: alta`) | P50-UX5 | DETECTADO |
| M15 | evidência renderizada como marcação (`innerHTML`) | P50-UX12 | DETECTADO |
| M16 | wording de export mantido apesar de modificação | P50-SESUX2 | DETECTADO |
| M17 | estado efêmero serializado nos inputs canônicos | P50-SESUX5 | DETECTADO |

```text
MUTATION TESTING (5.0.1+5.0.2): 24/24 · restauração: shell OK · css OK · html OK
```

## 8 · Defeitos encontrados no próprio harness

Registrados por exigência do protocolo — todos eram do harness, não do produto:

| # | defeito | como apareceu | correção |
|---|---|---|---|
| H-1 | `P50-SESUX1A` acusava a palavra `autosave` em **comentários meus que a negavam** | FAIL do lint | comentários reescritos; o gate **não** foi enfraquecido |
| H-2 | `P50-SESUX1A` ainda exigia a **ausência** do componente de status (regra de 5.0.1) | FAIL após implementar UI-011 | transição de escopo: agora exige o componente **e** as frases canônicas |
| H-3 | `P50-UX9` proibia `buildSessionDocument()` no **arquivo inteiro**, não no seu próprio corpo | FAIL ao usar o documento em P50-UX4/SESUX5 | proibição passou a incidir só sobre o corpo de `P50-UX9`, como manda a §25.3 |
| H-4 | jsdom não implementa `URL.createObjectURL`; o export real lançava | FAIL de `P50-SESUX2` | mesmo polyfill da SESSION 4.8 congelada (`tests_session_m48.js:247`) |
| H-5 | dirty flag nunca ficava verdadeiro antes do primeiro export | FAIL de `P50-SESUX1B` | ponto limpo inicial ancorado no primeiro render |
| H-6 | **M12 nunca chegou a mutar**: a âncora perdeu os escapes `\"` no template literal | "NÃO DETECTADO" enganoso | reancorado em linha sem escapes ambíguos |
| H-7 | **`P50-SESUX5` era fraco**: lista literal de chaves não pegava `p50SessionState` | M17 NÃO DETECTADO | varredura **recursiva** por padrão de nome + validação do documento + igualdade com os owners canônicos |
| H-8 | `applyFixture` do Chromium **não aplicava as notas** | screenshot "de evidência" sem evidência | passou a aplicar `fx.notes` |

H-6 e H-7 são os mais relevantes: sem eles, dois mutantes teriam sido reportados como
"não detectados" por motivos opostos — um por âncora inválida, outro por gate genuinamente fraco.

## 9 · Evidência visual

```text
P50-5.0.2-evidence-P50-F8-1440.png    chips + cue + preview de evidência (rich notes/Unicode)
P50-5.0.2-evidence-P50-F10-1440.png   payloads adversariais renderizados como TEXTO LITERAL inerte
P50-5.0.2-session-exported-1440.png   status de sessão após export bem-sucedido
P50-5.0.1-*.png                       evidências da 5.0.1 regeneradas sobre o build atual
```

**Não encerram P50-VIS1..P50-VIS10**, que permanecem reservados às microfases previstas.
É assurance visual mínima, como na 5.0.1.

## 10 · Limitações conhecidas

1. **P50-VIS1..P50-VIS10 e P50-ACC1..ACC5** continuam fora de escopo (microfase 5.0.5).
2. **Chromium 151.0.7922.34** contra o 141 nominal da §25.6 — ressalva `PHV-20`, já aceita.
3. **Nota de 1 MiB sem pontos de quebra** (fixture de falha de export) alarga a página congelada
   a ponto de inviabilizar um screenshot `fullPage`; a evidência desse estado é capturada por
   viewport. A superfície nova não contribui para o problema: o preview é truncado em 160
   caracteres e usa `overflow-wrap:anywhere`. O export é corretamente recusado no limite de 1 MiB.
   Registrado como observação sobre superfície congelada, fora do escopo desta microfase.
4. **`P50-SESUX1B` cobre as 6 fixtures da §25.5**; estados compostos adicionais (por exemplo
   import com aviso de compatibilidade) não são exercitados.
5. O componente de status é montado em **home, pergunta e resultados**. Não existe em telas
   intermediárias (arquétipo, prioridades), onde não há ação de sessão.

## 11 · Build determinístico

```text
python3 build_v32_html.py (A) → 5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd
python3 build_v32_html.py (B) → 5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd
A == B · 621.138 bytes · Linux/WSL
```

## 12 · Blockers

### Estado da candidata ANTES da correção (parecer `b8296a11…49671800`)

```text
RESULTADO DA AUDITORIA INDEPENDENTE: FAIL
B-502-1  status visível falso ao digitar evidência após export    BLOCKER
B-502-2  P50-SESUX1B fora da matriz normativa + texto acessível   BLOCKER
H-502-1  contrato dos wrappers AMB-2.1 não demonstrado            ALTO
M-502-1  inventário factual incompleto                            MÉDIO
M-502-2  alegação de indicador na sidebar sem implementação       MÉDIO
M-502-3  screenshot de export não mostra o status                 MÉDIO
L-502-1  redação de dirty antes do primeiro export                BAIXO
L-502-2  nomes de evidência da 5.0.1 regenerados                  BAIXO
```

A afirmação anterior de "NENHUM blocker" estava **incorreta** e fica retificada: a candidata
tinha dois blockers reais, ambos confirmados por reprodução independente antes da correção.

### Estado APÓS a correção

```text
B-502-1  CORRIGIDO e provado (§7.2)          B-502-2  CORRIGIDO e provado (§7.3)
H-502-1  FECHADO — 12 condições demonstradas (§7.1)
M-502-1  M-502-2  M-502-3  L-502-1  L-502-2   CORRIGIDOS
blockers abertos: NENHUM · aguardando REAUDITORIA ESTREITA
```

## 13 · Estado final

```text
microfase 5.0.2       CANDIDATA implementada e verificada
branch                feat/phase5-5-0-2  (HEAD 701db0c8…, 0 commits)
engine                INTOCADO      M41  PRESERVADO
Camada 1 e módulos 4.x INTOCADOS    print/PDF INTOCADO
builder / package / lockfile         INTOCADOS
novo HTML de trabalho 5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd
gates                 26 (23 core + 3 Chromium) · 26 PASS · 0 FAIL
mutantes              24/24
microfase 5.0.3       NÃO INICIADA
commit/push/PR/merge/tag/freeze/release/deployment   NENHUM
```

**(estado antes da correção pós-parecer — ver §14.)**

---

# 14 · Correção estreita pós-auditoria independente (2026-08-20)

Parecer aplicado: `AUDITORIA_INDEPENDENTE_MICROFASE_5_0_2.md` · SHA-256
`b8296a110b78fd66b8605f38c5885a73d9f5a0298471085692eefc5849671800` · 14.613 bytes · 375 linhas ·
UTF-8 · sem CRLF · resultado **FAIL — CORREÇÃO ESTREITA E REAUDITORIA OBRIGATÓRIAS**.
Identidade verificada antes de qualquer edição. Corrigidos **somente** os itens do parecer.

## 14.1 · H-502-1 — contrato dos wrappers, agora demonstrado

Instrumentação mínima em `ui_p50_shell_v32.js`: `p50SesInvoke(kind, fallback, ctx, args)` chama o
predecessor **exatamente uma vez**, preservando `this`, argumentos, retorno e exceções; contadores
`sessionCalls`/`sessionPredCalls` em `diag()`; hook de teste
`__substituteSessionPredecessor(kind, fn)` — nunca instalado em produção.

`P50-SESUX4` (gate existente; **nenhum namespace novo**) passou a provar, materialmente:

```text
(1) exatamente 2 wrappers instalados          (2) captura única por função
(3) 1 invocação do predecessor por chamada    (4) ordem predecessor -> observador
(5) `this` e argumentos preservados           (6) identidade do objeto retornado
(7) exceção do predecessor propaga intacta    (8) wrapper não escreve owner canônico
(9) sem dupla instalação                     (10) sucesso/falha lidos do retorno REAL
(11) falha do observador isolada — não contamina o retorno da operação
(12) lint: nenhuma duplicação de validate/normalize/commit/build/prepare/filename
```

Cobertura de ok/falha: export `ok=true` marca `exported`+clean · export `ok=false` nunca marca
`exported` nem clean · import `ok=true` marca `imported`+clean · import `ok=false` não altera o
estado.

## 14.2 · B-502-1 — status stale ao digitar evidência

**Reproduzido antes de corrigir**, no build candidato, pelo caminho congelado
`#ses-export → #ux-modal-ok → #review → botão P50 → #notetxt → evento `input``:

```text
DOM   : state=exported · dirty=false · "Sessão exportada."
DIAG  : sessionState=exported · sessionEffectiveState=default · sessionDirty=true
```

A interface afirmava algo falso ao usuário. **Correção — observação aditiva:**

```text
addEventListener("input"|"change", p50OnNoteInput) em #notetxt
  · NÃO substitui o handler congelado (t.oninput continua o único escritor de notes[k])
  · registrado DEPOIS dele -> executa DEPOIS dele -> owner já atualizado
  · idempotente (dataset.p50NoteBound)
  · NÃO chama render() · NÃO cria owner paralelo · falha isolada em try/catch
  · reconcilia o status E o indicador de evidência (UI-007), ambos sem re-render
```

Resultado medido, nos dois fluxos:

```text
export success -> digitar evidência -> state=default · dirty=true · wording de export removido
import success -> digitar evidência -> state=default · dirty=true · wording imported removido
owner canônico gravado pelo handler CONGELADO (verificado em inputs.assessment.notes)
```

Provado por `P50-SESUX2` (fluxo de export) e `P50-SESUX3` (fluxo de import), ambos disparando o
evento real do campo — não `setAnswerById` + `__uxDecor`.

## 14.3 · B-502-2 — matriz normativa e texto acessível

**Matriz literal da §25.5 agora executada, na ordem normativa:**

```text
1 fresh assessment           default   dirty=false
2 modified but not exported  default   dirty=true
3 export success             exported  dirty=false
4 (extra) post-export modification     default   dirty=true
5 import success             imported  dirty=false
6 post-import modification   default   dirty=true   <- fixture normativa restaurada
7 export failure             export-failed dirty=true
```

`post-import modification` usa o **evento real** de digitação de evidência e verifica que a nota
chegou ao owner canônico. `post-export modification` foi preservado como cobertura adicional.

**Texto acessível:** a sobrescrita por `aria-label` foi **removida**. Numa live region
`role="status"` o texto anunciado é o conteúdo; o `aria-label` suprimia justamente as linhas de
dirty e de falha. O gate agora exige `aria-label === null` e que o texto acessível (o conteúdo)
contenha `Há alterações ainda não exportadas.` quando `dirty=true` e
`A última exportação não foi concluída` quando `export-failed` — além de rejeitar wording stale de
qualquer outro estado.

## 14.4 · Correções menores do parecer

```text
M-502-1  inventário completo: 15 rastreados modificados + 5 novos (§2.1)
M-502-2  alegação de indicador na sidebar REMOVIDA — a sidebar mostra estado da resposta (§1.1)
M-502-3  P50-5.0.2-session-exported-1440.png recapturado como screenshot DO ELEMENTO
L-502-1  "Há alterações desde a última exportação." -> "Há alterações ainda não exportadas."
L-502-2  evidências P50-5.0.1-* declaradas CUMULATIVAS; trilha histórica preservada em 70154a1b…
```

## 14.5 · Mutantes novos — M18 a M24

| # | mutação | gate | motivo observado | veredito |
|---|---|---|---|---|
| M18 | remover a reconciliação no evento real de evidência | P50-SESUX2 | `status stale após digitar evidência` | DETECTADO |
| M19 | manter `imported` após edição | P50-SESUX3 | `estado imported persistiu após edição` | DETECTADO |
| M20 | `aria-label` sobrescrevendo a live region | P50-SESUX1B | `aria-label sobrescreve o conteúdo` | DETECTADO |
| M21 | remover o wrapper de export | P50-SESUX4 | `predecessor invocado 0 vez(es), esperado 1` | DETECTADO |
| M22 | remover o wrapper de import | P50-SESUX4 | `import ok=true não marcou imported` | DETECTADO |
| M23 | inverter `r.ok` no observador de export | P50-SESUX4 | `ok=true não marcou exported` | DETECTADO |
| M24 | duplicar a invocação do predecessor | P50-SESUX4 | `predecessor invocado 2 vez(es)` | DETECTADO |

```text
MUTATION TESTING (5.0.1+5.0.2): 24/24 detectados pelo gate e motivo esperados
restauração: shell OK · css OK · html OK
```

## 14.6 · Defeito NOVO do harness descoberto nesta correção

| # | defeito | como apareceu | correção |
|---|---|---|---|
| H-9 | `P50-SESUX4` detectava M21 **incidentalmente**, por `URL.createObjectURL` inexistente no jsdom, e não pela asserção semântica | M21 "NÃO DETECTADO · motivo INCOMPATÍVEL" | polyfill de Object URL no bloco de contrato (mesmo da SESSION 4.8 congelada); M21 passou a falhar por `predecessor invocado 0 vez(es)` |
| H-10 | asserção de pré-condição usava um índice que **já valia** o valor alvo na fixture (no-op) | `ok=false marcou clean` | índice trocado por um `null` em P50-F2 |
| H-11 | asserção exigia que import `ok=false` **mudasse** o estado, quando o correto é **não alterá-lo** | `import ok=false marcou imported` | verificação passou a partir de um boot limpo, exigindo estado inalterado |

Somam-se aos 8 defeitos de harness já registrados na §8 (H-1..H-8). Nenhum gate foi enfraquecido.

## 14.7 · Reexecução após a correção

Cada linha vem de uma invocação que concluiu com **código de saída próprio**. Nenhum PASS foi
atribuído a timeout, interrupção ou comando sem exit code.

```text
npm run test:p50      23 PASS · 0 FAIL de 23                       exit 0
npm run test:p50vis    3 PASS · 0 FAIL de  3  Chromium real, sem SKIP  exit 0
mutation testing      24/24 detectados                              exit 0
npm run test:session  SESSION 4.8: 97 PASS · 0 FAIL de 97           exit 0
npm run test:unset    UG: 13 PASS · 0 FAIL de 13  (UG13 Chromium real) exit 0
npm run test:m41      COMPARAÇÃO PASS · 9794b267…3ed4365b            exit 0
npm run test:visual   67 passed · 0 failed · 37 skipped              exit 0
build A == build B    5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd
                      621.138 bytes
engine                9a4a2e67…2b5d247a byte-idêntico
protegidos/normativos 20/20 intactos
```

As demais contagens congeladas (MATRIZ 105 · UI 19+25+11+23+26 · UX 56 · TARGET 30 · REF 28 ·
JOURNEY 31 · ICONS 12) são referenciadas da execução integral já concluída nesta microfase, uma vez
que os arquivos protegidos permanecem byte-idênticos — conforme §8 do parecer.

## 14.8 · Estado final da candidata corrigida

```text
branch                feat/phase5-5-0-2 · HEAD 701db0c8… · 0 commits
HTML candidato        5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd
gates                 26 (23 core + 3 Chromium) · 26 PASS · 0 FAIL
mutantes              24/24
blockers abertos      NENHUM
microfase 5.0.3       NÃO INICIADA
commit/push/PR/merge/tag/freeze/release/deployment   NENHUM
```

**PARADA.** Aguardando reauditoria independente estreita sobre B-502-1, B-502-2, H-502-1,
mutantes novos, relatório, evidências, manifesto e hashes. Não realizei auditoria de mim mesmo.
