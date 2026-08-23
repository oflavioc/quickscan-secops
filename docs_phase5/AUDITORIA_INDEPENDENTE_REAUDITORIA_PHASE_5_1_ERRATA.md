# REAUDITORIA INDEPENDENTE ESTREITA — ERRATA DA QUICKSCAN PHASE 5.1

**Data:** 2026-08-22 · **Escopo:** exclusivamente a errata pós-auditoria (fechamento do B1, gate de
sinal do gap, correções factuais do manual e do relatório, boundary, build/manifesto/regressão
dirigida e veredito da errata). A auditoria integral anterior **não** foi repetida.

---

## 0 · Identidade deste parecer

| atributo | valor |
|---|---|
| caminho | `C:\Users\usuario\Documents\Codex\2026-08-18\referenced-chatgpt-conversation-this-is-an-3\outputs\AUDITORIA_INDEPENDENTE_REAUDITORIA_PHASE_5_1_ERRATA.md` |
| encoding | **UTF-8 sem BOM** (primeiros bytes `23 20 52`) |
| CRLF | **zero** — terminações LF exclusivamente |
| SHA-256 · tamanho · linhas | informados na mensagem de entrega desta reauditoria; não podem constar do próprio arquivo sem autorreferência circular. Confira com `sha256sum`, `wc -c` e `wc -l` sobre este arquivo. |

---

## 1 · Independência e identidade dos insumos

**Declaração de independência.** Esta sessão **não participou** de nenhuma das atividades vedadas
pela §0 do prompt de reauditoria: não implementou a Phase 5.1; não corrigiu `buildPrintReport()`;
não criou nem alterou `P51-RPT6`, `P51-VIS3` ou `P51-DOC13`; não criou os mutantes `M51-17` a
`M51-20`; não corrigiu `USER_GUIDE.md`; não corrigiu `PHASE_5_1_UAT_REPORT.md`; não regenerou o
manifesto pós-errata. A sessão iniciou-se com a árvore já no estado entregue por outra sessão, e
todo o trabalho aqui registrado é de leitura, instrumentação própria e execução em cópia temporária.

O handoff do implementador **não** foi aceito como evidência autossuficiente: as propriedades
centrais foram reproduzidas com oráculos próprios, com tabelas de estágio e de scores declaradas
como literais nesta reauditoria, e não derivadas do produto.

### 1.1 Prompt de reauditoria

| atributo | exigido | observado | veredito |
|---|---|---|---|
| SHA-256 | `10d91c65c361d06940e2cf6da0a49933df06ddf91fe8aa1640901d8baa6494e0` | idêntico | **OK** |
| tamanho | 17.643 B | 17.643 B | **OK** |
| linhas | 629 | 629 | **OK** |
| encoding | UTF-8 sem BOM | UTF-8; primeiros bytes `23 20 52` | **OK** |
| CRLF | zero | zero | **OK** |

### 1.2 Parecer original (§1 do prompt)

`AUDITORIA_INDEPENDENTE_PHASE_5_1_UAT_REPORT.md`

| atributo | exigido | observado | veredito |
|---|---|---|---|
| SHA-256 | `6320eac04eae61d6078b2d59404e17423eea133456a89d855bdae73b32c1ff82` | idêntico | **OK** |
| tamanho | 52.613 B | 52.613 B | **OK** |
| linhas | 880 | 880 | **OK** |
| encoding / CRLF | UTF-8 sem BOM / zero | UTF-8 sem BOM / zero | **OK** |

Lido integralmente até EOF. Blocker **B1** e ressalvas **R1**–**R6** conferidos na fonte.

---

## 2 · Preflight da candidata pós-errata

Repositório: `/mnt/c/Projetos/QuickScan-SOC-CMM/phase5`

| item | exigido | observado | veredito |
|---|---|---|---|
| branch | `feat/phase5-5-1-uat-report` | idem | **OK** |
| HEAD | `af279a685eacffb8c85c60976cf4c6a059b967d0` | idem | **OK** |
| commits sobre `origin/main` | 0 | 0 (`0 0` em `--left-right`) | **OK** |
| staged | 0 | 0 | **OK** |
| branch publicada | não | sem upstream; ausente de `git branch -r` | **OK** |
| `AGENTS.md` | não rastreado, não editado, fora da entrega | `??` no status; ausente das entradas do manifesto (só citado em comentário) | **OK** |

### 2.1 Identidades conferidas

| arquivo | SHA-256 observado | tamanho | veredito |
|---|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` | `12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9` | 744.179 | **OK** |
| `ui_v32.js` | `61e71dcc191aabb2a74a7061173ede8a5d75fa5dda81bb03e7ad02360677d766` | 76.718 | **OK** |
| `tests_p50_core.js` | `7481b674869a114d44f3c00c2db3d0ee418e659ebe2b852c956c3418f49d1794` | 210.261 | **OK** |
| `tests_p51_mutants.js` | `3e3a66ab048ef7c1bb7d77d0f2e7c50ee83a90dc33269763f0f78b17eede7839` | 13.205 | **OK** |
| `USER_GUIDE.md` | `98d97a2a3bf5f928a5f4a8e6995cb1b51e77e1a77897ec23aaabad01ccbd181d` | 20.163 | **OK** |
| `docs_phase5/PHASE_5_1_UAT_REPORT.md` | `e0608b0ba95a4acabbf9d7aebf11e1fdccfcc21fe8287c7370c4691529c54851` | 47.550 | **OK** |
| `docs_phase5/MANIFEST_PHASE5_P50.sha256` | `2b7f77f5742c5754c01bdecc6cb1c7bcad4956851411d404e412ced47c78f42b` | 19.502 · 144 entradas | **OK** |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | 57.261 | **OK** |
| `ui_p50_results_v32.js` | `4c2965f7befdf2f907d6502d28f94ef8f8603cbf4a9cd3fdecc802d6e4a8b66e` | 40.714 | **OK** |
| payload funcional M41 | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | — | **OK** |
| produção V3.2 (1337) | `8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb` | 578.152 | **OK** |

Nenhuma divergência de preflight. Trabalho autorizado a prosseguir.

---

## 3 · Preservação da árvore original

Inventário byte-level de **338** arquivos (excluídos `.git` e `node_modules`), calculado antes e
depois da reauditoria. Toda execução com escrita — testes, builds, mutações, PDF, screenshots —
ocorreu em **cópias temporárias completas** sob
`…/scratchpad/work` (regressão, oráculos, PDF) e `…/scratchpad/work2` (campanha de mutação e
reprodução do build pré-errata). Nenhum container foi reiniciado, parado ou modificado.

O resultado da comparação pré/pós está em §12.

---

## 4 · Fechamento independente do blocker B1

### 4.1 Inspeção estrutural — **PASS**

`ui_v32.js:959`, dentro de `buildPrintReport()`:

```js
const overall = suff && scored.length
  ? Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10
  : null;
```

- é a média dos scores de domínio (`scored` = `DOMS.map(domStat).filter(score!==null)`);
- é **arredondada a uma casa antes** de ser armazenada em `overall`;
- `stageOf()` recebe **esse mesmo** `overall` (`ui_v32.js:974`, KPI `Estágio indicativo`);
- régua (`qsStageRulerHTML(overall, suff)` → `ui_v32.js:783` e o `aria-label` da linha 786),
  KPI de score e marcador consomem o mesmo valor;
- **não existe segundo cálculo paralelo nem ajuste apenas visual.** O repositório inteiro tem
  exatamente **cinco** sítios com essa expressão, todos na forma canônica idêntica:
  `ui_v32.js:126` (`legacySnapshot`), `ui_v32.js:959` (`buildPrintReport`),
  `ui_journey_v32.js:34`, `ui_target_v32.js:34` e `harness_m41_v313.js:98`;
- `stageOf()` e seus limiares estão **byte-idênticos** ao congelado: o corpo da função no build
  candidato é literalmente igual ao de `quickscan_secops_soccmm_v3_1_3.html:485`
  (`0.5 · 1.5 · 2.5 · 3.5 · 4.5`, seis estágios, mesmos rótulos PT/EN).

Confirmação do defeito original na origem: em `git show HEAD:ui_v32.js`, a linha 691 do baseline da
Phase 5.0 usava `(scored.reduce(...)/scored.length)` **sem** arredondamento — exatamente o B1. A
errata trocou essa expressão pela forma canônica.

### 4.2 Oráculo independente das cinco fronteiras — **PASS**

Instrumento próprio (`oracle_b1.js`), sem `P51-RPT6`, sem `fixtures_p50.js` e **sem usar `stageOf()`
como oráculo**: a tabela de estágios foi declarada aqui como literal
(`[0.5, 1.5, 2.5, 3.5, 4.5]` → `Inexistente · Inicial · Gerenciado · Definido ·
Gerenciado quantitativamente · Em otimização`) e conferida ponto a ponto contra o runtime em 501
pontos (0 divergências); a tabela `SCORES = [0, 1.7, 3.3, 5]`, a ordem dos 15 `qid` e o mapeamento
de domínio também foram declarados como literais e conferidos contra o runtime.

O oráculo enumerou por conta própria as **14** pontuações de domínio alcançáveis
(`0 · 0.6 · 0.9 · 1.1 · 1.7 · 2.2 · 2.5 · 2.8 · 3.3 · 3.4 · 3.9 · 4.2 · 4.4 · 5`) com `n=2` e `n=3`
confirmadas, e selecionou, para cada fronteira, um vetor **dentro da janela do defeito**
(`faixa(média bruta) ≠ faixa(média arredondada)`), aplicado ao produto pelos setters canônicos —
**estados alcançáveis**, não valores injetados em `stageOf()`.

| fronteira | domínios | média bruta → faixa bruta | canônico → faixa canônica | tela | KPI | régua | `aria-label` | jornada tela | jornada relatório | leitura executiva |
|---|---|---|---|---|---|---|---|---|---|---|
| 0.5 | 0 / 0 / 0 / 0.6 / 1.7 | 0,4599… → Inexistente | 0.5 → **Inicial** | 0.5 | Inicial | `0.5 / 5 · Inicial` | “estágio Inicial” | Inicial | Inicial | Inicial (0.5/5) |
| 1.5 | 0 / 0 / 0 / 3.4 / 3.9 | 1,46 → Inicial | 1.5 → **Gerenciado** | 1.5 | Gerenciado | `1.5 / 5 · Gerenciado` | “estágio Gerenciado” | Gerenciado | Gerenciado | Gerenciado (1.5/5) |
| 2.5 | 0 / 0 / 3.4 / 3.9 / 5 | 2,46 → Gerenciado | 2.5 → **Definido** | 2.5 | Definido | `2.5 / 5 · Definido` | “estágio Definido” | Definido | Definido | Definido (2.5/5) |
| 3.5 | 0 / 3.4 / 3.9 / 5 / 5 | 3,46 → Definido | 3.5 → **Ger. quantitativamente** | 3.5 | Ger. quant. | `3.5 / 5 · Gerenciado quantitativamente` | idem | idem | idem | idem (3.5/5) |
| 4.5 | 3.4 / 3.9 / 5 / 5 / 5 | 4,46 → Ger. quant. | 4.5 → **Em otimização** | 4.5 | Em otimização | `4.5 / 5 · Em otimização` | idem | idem | idem | idem (4.5/5) |

Em todas as cinco fronteiras:

```text
score canônico da tela (legacySnapshot().overall) == score usado pelo relatório
KPI do estágio == leitura da régua == nó “Perfil atual” da jornada (tela e relatório)
              == leitura executiva == estágio da MINHA tabela para o score canônico
```

**79 asserções · 0 falhas.**

### 4.3 Casos A e B do parecer — **PASS**

| caso | scores por domínio | média interna | score canônico | estágio esperado | KPI | régua | jornada (tela/relatório) | leitura executiva |
|---|---|---|---|---|---|---|---|---|
| **A** | `[0, 3.3, 3.9, 4.2, 1.1]` | `2.4999999999999996` (IEEE-754) → faixa **Gerenciado** | `2.5` | **Definido** | Definido | `2.5 / 5 · Definido` | Definido / Definido | Definido (2.5/5) |
| **B** | `[0, 0.6, 3.4, 3.4, 5]` | `2.48` → faixa **Gerenciado** | `2.5` | **Definido** | Definido | `2.5 / 5 · Definido` | Definido / Definido | Definido (2.5/5) |

Ambos os vetores são alcançáveis pelo produto (aplicados por `setAnswerById`) e ambos exibem
**uma única** identificação de estágio em todas as superfícies. O Caso A é notável por ser um caso
de fronteira produzido por ponto flutuante: a soma exata é 12,5, mas em IEEE-754 a média fica
imediatamente **abaixo** de 2,5 — exatamente a janela do defeito.

### 4.4 Não vacuidade — o oráculo reproduz o blocker quando o arredondamento é removido

Em cópia temporária, revertendo **apenas** a expressão de `buildPrintReport()` e reconstruindo o
HTML, o meu oráculo passou de **0** para **21 falhas**, com a autocontradição intradocumento do
parecer original reaparecendo íntegra:

```text
FAIL  CASO A: KPI estagio 'Gerenciado' != 'Definido'
FAIL  CASO A: regua '2.5 / 5 · Gerenciado'
FAIL  CASO A: aria da regua '… Score geral 2.5, estágio Gerenciado.'
   (jornada e leitura executiva continuavam dizendo 'Definido' — a contradição)
```

Fonte restaurada byte a byte (`ui_v32.js` = `61e71dcc…0677d766`; HTML = `12bb950f…eebbf9d9`).

### 4.5 PDF A4 real do build pós-errata — **PASS**

Gerado em cópia temporária, com Chromium real e `emulateMedia({media:"print"})`, no caso de
fronteira **2.5** (domínios `0 / 0 / 3.4 / 3.9 / 5`, média bruta 2,46):

- arquivo: `REAUDIT-fronteira-2.5.pdf` · **162.565 bytes** · **8 páginas** ·
  **595,92 × 842,88 pt (A4)** — permanece somente na área temporária, **não** foi adicionado à
  candidata;
- `preparePrint()` retornou `{"blocked":false,"legacy":false}`; `legacySnapshot().overall = 2.5`,
  `suff = true`.

Texto extraído (`pdftotext -layout`):

| exigência | observado |
|---|---|
| score `2.5 / 5` | `2.5 / 5` (KPI **Score geral indicativo**) |
| KPI `Definido` | `Definido` (KPI **Estágio indicativo**) |
| régua `Definido` | `2.5 / 5 · Definido` |
| jornada `Definido · Perfil atual` | `3   Definido  PERFIL ATUAL` |
| leitura executiva `Definido` | “O Quickscan **posiciona a operação em Definido (2.5/5)**…” |
| nenhuma ocorrência identificando o estágio corrente como `Gerenciado` | **nenhuma** |

As três ocorrências da palavra `Gerenciado` no PDF são legítimas e não identificam o estágio
corrente: (i) o rótulo da faixa 2 da régua, que lista os **seis** estágios; (ii) o nó 2 da jornada;
(iii) o nó 4, `Gerenciado quantitativamente`, marcado como `PRÓXIMO ESTÁGIO`.

**Layout no modo print** — medido nas quatro variantes de comprimento de rótulo de estágio, com o
KPI mais longo do modelo (`Gerenciado quantitativamente`, 226,7 px):

| caso | colisão entre KPIs | overflow horizontal | texto cortado |
|---|---|---|---|
| `0.9 / Inicial` | nenhuma | não (1440/1440) | nenhum |
| `2.5 / Definido` | nenhuma | não (1440/1440) | nenhum |
| `3.5 / Gerenciado quantitativamente` | nenhuma | não (1440/1440) | nenhum |
| `4.5 / Em otimização` | nenhuma | não (1440/1440) | nenhum |

A linha de KPIs reflui; a leitura da régua ocupa a largura total sem corte; o marcador posiciona-se
em `18% / 50% / 70% / 90%`, coerente com o score. **Nenhuma colisão, corte ou mudança visual
material** decorrente da correção.

**Veredito do B1: FECHADO.**

---

## 5 · Auditoria de `P51-RPT6`

Auditado como artefato, sem tratá-lo como prova autossuficiente.

| exigência do §5 | observado | veredito |
|---|---|---|
| usa valores alcançáveis | monta vetores de resposta e aplica por `FX.p50ApplyVec` / `setAnswerById`; confere suficiência canônica (`≥10` e `≥2` por domínio) por oráculo próprio | **OK** |
| cobre as cinco fronteiras | exige vetor para cada um de `0.5 · 1.5 · 2.5 · 3.5 · 4.5`; falha se alguma janela não for encontrada | **OK** |
| compara agregado canônico da tela com o do relatório | referência é `legacySnapshot().overall`; o KPI de score do relatório é conferido contra o mesmo número | **OK** |
| compara KPI, régua, jornada e leitura executiva | cinco superfícies, incluindo a jornada **na tela** e **no relatório** | **OK** |
| falha se o arredondamento for removido | **verificado por reversão** (abaixo) | **OK** |
| não valida uma tabela contra ela mesma | o oráculo de faixas é varrido de 0 a 5 e conferido ponto a ponto; a régua é derivada, não comparada consigo | **OK** |
| não depende de strings fabricadas dentro do teste | lê `textContent` do DOM real de `buildPrintReport()` e do `#ux-journey` renderizado | **OK** |
| não substitui `stageOf()` por cópia idêntica como oráculo único | não há cópia de limiares no gate; os literais `0.5…4.5` aparecem só como **alvos de cobertura**, e a exigência real é a **igualdade entre superfícies** | **OK** |

Ressalva metodológica anotada, **não bloqueante**: o nome de estágio de referência do gate é obtido
do próprio runtime (`R.w.eval("stageOf(...)")`), de modo que o gate prova *coerência entre
superfícies*, não a *correção dos limiares*. Isso é adequado ao que o B1 exigia — a correção dos
limiares é coberta por `P51-RPT3` e, nesta reauditoria, pela minha tabela literal independente
(§4.2), que confere com o runtime em 501/501 pontos.

**Reversão do arredondamento em cópia temporária** (build reconstruído):

```text
FAIL  P51-RPT6 — estágio coerente entre KPI, régua, jornada, leitura executiva e tela nas fronteiras
      [0.5: KPI diz 'Inexistente' e o canônico é 'Inicial']
```

Diagnóstico **semântico** — nomeia a fronteira, a superfície divergente e os dois nomes de estágio.
Não houve detecção por manifesto, hash, sintaxe ou crash. Restaurada a fonte, o gate volta a
`PASS` e os SHA conferem byte a byte.

---

## 6 · Sinal do gap Current × Target

`ui_p50_results_v32.js` permanece no SHA fixado no preflight (`4c2965f7…e4a8b66e`, 40.714 B) —
nenhuma lógica de produto foi alterada por R1, como o relatório declara.

### 6.1 Oráculo próprio — **PASS**

Sessão construída por mim, com os quatro estados exigidos, aplicada pelos setters canônicos:

| prática | current | target declarado | gap esperado (meu cálculo) | `data-p50-gap` | texto visual (coluna Gap) | `aria-label` | linha da tabela acessível |
|---|---|---|---|---|---|---|---|
| `mandate` | 1.7 | **5.0** | **+3.3** | `3.3` | `+3.3` | `gap +3.3` | `3.3` |
| `governance` | 3.3 | 5.0 | **+1.7** | `1.7` | `+1.7` | `gap +1.7` | `1.7` |
| `training` | 0.0 | 3.3 | **+3.3** | `3.3` | `+3.3` | `gap +3.3` | `3.3` |
| `policies` (e outras 11) | 1.7 | **sem alvo** | `n/d` | ausente | `n/d` | sem menção a gap | ausente |

Matriz **Current × Target** (eixo por domínio), mesmo estado:

| domínio | current | target | `data-p50-gap` | texto visual |
|---|---|---|---|---|
| Negócio | 2.2 | 3.9 | `1.7` | `+1.7` |
| Pessoas | 1.7 | 2.8 | `1.1` | `+1.1` |
| Processos / Tecnologia / Serviços | 1.1 / 1.7 / 2.2 | sem alvo | ausente | (sem gap) |

Propriedades provadas:

```text
gap === round1(target - current)     em todas as células e em todos os domínios
target > current  =>  gap > 0        em todas as práticas com alvo
```

Varredura final: **zero** `data-p50-gap` negativo em qualquer superfície dos resultados e **zero**
ocorrência textual de gap negativo. **69 asserções · 0 falhas** (ver a nota de §6.2 sobre o caso
condicional).

### 6.2 Estado com `target == current` — **não alcançável** pela regra congelada

O setter `setTarget()` aceita `v === cur` (recusa apenas `v < cur`), mas o render aciona
`revalidateTargets()`, que **remove** todo override com `cur >= target`. Medido:

```text
setTarget('team-capacity', 1) com atual em nível 1  ->  true
overrides ANTES de showResults()   =  {"team-capacity":1}
overrides DEPOIS de showResults()  =  {}
```

Logo o estado com gap `0.0` **não é alcançável de forma persistente** sem alterar a regra congelada,
e o §6 do prompt o condicionava exatamente a isso. Registrado como observação, não como defeito: o
comportamento é o da invariante “alvo declarado, estritamente superior ao current confirmado”.

### 6.3 Inversão do sinal e detecção por `P51-VIS3` — **PASS**

Duas inversões independentes, cada uma em cópia temporária com o HTML reconstruído — a segunda vai
**além** do mutante `M51-17`, que só ataca o eixo por célula:

**A · eixo por célula** (`p50Round1(tScore - score)` → `p50Round1(score - tScore)`):

```text
FAIL  P51-VIS3 — gap Current × Target com sinal correto em célula, rótulo acessível, tabela e domínio
      [P50-F9 (alvos declarados na fixture) · mandate: gap -3.3 != alvo−atual 3.3]
```

**B · eixo por domínio** (`p50Round1(domTarget - current)` → `p50Round1(current - domTarget)`):

```text
FAIL  P51-VIS3 — gap Current × Target com sinal correto em célula, rótulo acessível, tabela e domínio
      [P50-F9 (alvos declarados na fixture) · domínio 0: gap -1.6 != 1.6]
```

Em ambos os casos o motivo é **semântico** e nomeia a prática (`mandate`) ou o eixo (`domínio 0`) e
os **valores divergentes**. O meu oráculo próprio também reprovou nas duas inversões, nomeando
prática, atributo, texto visual e `aria-label`.

Restauração conferida: `ui_p50_results_v32.js` = `4c2965f7…e4a8b66e`; HTML = `12bb950f…eebbf9d9`;
**zero** marcador residual (`grep` por `score - tScore` / `current - domTarget` → 0 ocorrências).

---

## 7 · Correções do `USER_GUIDE.md`

Conferidas factualmente com oráculo próprio, sem depender de `P51-DOC13`.

### 7.1 Fórmula do score — **PASS**

Sessão própria com quantidades diferentes de respostas por domínio (3/2/2/2/2, 11 confirmadas):

| grandeza | valor |
|---|---|
| scores de domínio | `[5, 0, 0, 0, 0]` |
| **média direta das respostas** | **1.4** |
| **média dos cinco scores de domínio** | **1.0** |
| produto (`legacySnapshot().overall`) | **1.0** |

`média direta ≠ média dos domínios`, e o produto usa a **segunda**. As quatro afirmações do manual
foram conferidas uma a uma contra esse estado, todas presentes e corretas:

- o score por domínio é derivado das respostas confirmadas **daquele** domínio; **OK**
- o score geral é a média dos **cinco** scores de domínio; **OK**
- o geral **não** é a média direta das respostas; **OK**
- cada domínio pesa o mesmo no geral, independentemente de quantas perguntas foram respondidas.
  **OK**

A redação antiga (“*Score 0–5. Média das respostas confirmadas. Por domínio e geral.*”) não está
mais presente.

### 7.2 Ordem do relatório — **PASS**

Ordem realmente emitida no DOM de impressão, medida por mim, contra a lista de §12 do manual:

| # | manual (§12) | DOM real |
|---|---|---|
| 1 | Capa e metadados, **com a legenda dos domínios** | `#pr-cover` (contém `#pr-domlegend`) |
| 2 | Resumo de maturidade, **com a régua 0–5** | `#pr-maturity` (contém `#pr-stage-ruler`) |
| 3 | Como interpretar este relatório | `#pr-howto` |
| 4 | Prioridades declaradas pelo negócio | `#pr-prios` |
| 5 | Gaps de maturidade observados | `#pr-findings` |
| 6 | Contexto tecnológico declarado | `#pr-landscape` |
| 7 | Interpretação do contexto **e** Como a Fortinet pode apoiar | `#pr-interp` + `#pr-support` |
| 8 | Jornada de maturidade e leitura executiva | `#pr-journey` |
| 9 | Perfil atual × Cenário-alvo de maturidade | `#pr-target` |
| 10 | Anexo — respostas da sessão | `#pr-annex` |

Correspondência item a item **exata**; legenda **na capa** e régua **dentro do resumo**, como o
manual passou a dizer. Ver a ressalva **RS-3** em §11 quanto às seções condicionais não listadas.

### 7.3 Gate `P51-DOC13` — **PASS**

| exigência do §8.3 | observado |
|---|---|
| prova com estado real que a média direta pode divergir da média dos domínios | monta `vec` com 3/2/2/2/2 confirmadas; calcula as duas contas por oráculo próprio (`2.9` × `3.0`) e **falha explicitamente** se coincidirem (“gate vazio”) |
| prova que o produto usa a média dos domínios | compara `legacySnapshot().overall` com a média dos domínios calculada fora do produto |
| compara a ordem documentada com a emitida no DOM | reconstrói o relatório, extrai `Array.from(host.children).map(n=>n.id)` e compara com a lista numerada de §12, item a item, mais legenda-na-capa e régua-no-resumo |
| falha quando uma das duas afirmações factuais é revertida | `M51-19` (fórmula) e `M51-20` (ordem) — ambos detectados (§8) |

Reproduzi os números do gate: `média das respostas = 2.9`, `média dos domínios = 3.0`. Confere.

---

## 8 · Campanha de mutação

Campanha `tests_p51_mutants.js` executada **integralmente** em cópia temporária dedicada
(`…/scratchpad/work2`), independente da cópia usada na regressão.

**Resultado: `20/20` mutantes detectados pelo gate e pelo motivo esperados.** Zero `NÃO DETECTADO`,
zero `ERRO`, zero mutante restaurado com divergência.

Os quatro mutantes da errata, com a linha de falha literal observada por mim:

| mutante | alvo | gate | motivo observado |
|---|---|---|---|
| `M51-17` | sinal do gap invertido na matriz única (= AUD-02) | `P51-VIS3` | `[P50-F9 (alvos declarados na fixture) · mandate: gap -3.3 != alvo−atual 3.3]` |
| `M51-18` | agregado do relatório sem arredondamento (= regresso do B1) | `P51-RPT6` | `[0.5: KPI diz 'Inexistente' e o canônico é 'Inicial']` |
| `M51-19` | manual volta à fórmula antiga do score geral (R2) | `P51-DOC13` | `[§8 não descreve o score geral como média dos cinco scores de domínio]` |
| `M51-20` | manual volta a listar régua/legenda como seções (R3) | `P51-DOC13` | `[§12 lista 12 seções para 10 emitidas]` |

Verificações exigidas pelo §7 do prompt:

- **mutantes do B1 e do sinal do gap detectados pelos gates correspondentes** — `M51-18` → `P51-RPT6`
  e `M51-17` → `P51-VIS3`; **OK**;
- **motivo compatível** — as 20 linhas de falha são do gate esperado e casam com o `reason` declarado;
  **OK**;
- **nenhuma detecção apenas por manifesto** — as 20 detecções vêm de linhas `FAIL  P5…` do gate
  esperado, com diagnóstico semântico; nenhuma por hash, sintaxe ou crash; **OK**;
- **restauração byte a byte** — os seis arquivos mutados voltaram aos SHA entregues:
  `ui_v32.js` `61e71dcc…`, `ui_p50_results_v32.js` `4c2965f7…`, `USER_GUIDE.md` `98d97a2a…`,
  `ui_journey_v32.js` `4758148a…`, `ui_p50_shell_v32.js` `f8302d68…`, `ui_p50_v32.css` `749cbb98…`,
  e o HTML reconstruído em `12bb950f…`; **OK**;
- **zero escrita na árvore original** — a campanha rodou somente em `work2`; ver §13; **OK**;
- **zero marcador residual** — busca por `score - tScore`, `current - domTarget` e demais textos de
  mutação nas fontes: **0** ocorrências; **OK**;
- **zero alteração das evidências históricas** — na cópia, a campanha reescreveu apenas
  `docs_phase5/evidence_p51/P51-mutation.json` (saída própria da campanha) e onze artefatos de
  `print_evidence/` (efeito colateral de gravação da suíte Chromium). Na **árvore original**,
  `print_evidence/` está **byte-idêntico ao `HEAD`** e as evidências `evidence_p50/` não têm
  qualquer modificação — ou seja, o entregador restaurou corretamente esse efeito colateral; **OK**.

**Reprodução do artefato entregue.** Comparei o `P51-mutation.json` gerado pela minha campanha com o
entregue na candidata: os **20** registros de mutante são **idênticos campo a campo** (`id`, `desc`,
`gate`, `detected`, `restored`, `failLine`) e ambos declaram `20/20`. A única diferença é o mapa
`baseline`, cujas chaves são caminhos absolutos — apontam para a minha cópia temporária. A evidência
entregue reproduz.

As campanhas históricas de mutação da Phase 5.0 não foram repetidas, conforme o §7 do prompt.

---

## 9 · Reconciliação do relatório da candidata

`docs_phase5/PHASE_5_1_UAT_REPORT.md` (`e0608b0b…29c54851`, 47.550 B):

| exigência do §9 | observado | veredito |
|---|---|---|
| B1 registrado como errata, sem apagar o histórico | §0 inteira é declarada como acrescentada **depois** do parecer `6320eac0…`, cujo veredito `FAIL` é citado; §0.1 preserva a reprodução do FAIL original e a tabela “antes × depois” | **OK** |
| R1, R2 e R3 declaradas fechadas | §0.2, §0.3 — com a nota correta de que **R1 não alterou linha de produto** | **OK** |
| contagem de evidências baseada no conjunto realmente observado | §12 declara 6 PDFs, 5+5 PNGs, 4 JSON/TXT; o diretório contém exatamente isso; a contagem “36/36” foi **retirada** e substituída pelo observado (29 do auditor, 30 da errata) | **OK** |
| definição clara de quais arquivos entram na contagem | escopo declarado no cabeçalho do manifesto: prefixo `P50-5.0.5-` ou artefatos exigidos **por nome** | **OK** |
| N4: preflight recusa o export | **verificado materialmente** (abaixo) | **OK** (ver **RS-2**) |
| N4: nenhum documento inválido é gerado ou baixado | **verificado materialmente**: `Blob = 0`, `createObjectURL = 0`, `anchor.click = 0` | **OK** |
| N4: não se afirma que o documento exportado só é recusado no import | §13.1 corrige explicitamente; §9.2 mantém a narração antiga | **RS-2** |
| R6 permanece ressalva ambiental | §13.3 | **OK** |
| nenhuma afirmação de aprovação, freeze, integração ou release | varredura do documento: nenhuma; §14 declara os atos **não** realizados e §15 para para auditoria independente | **OK** |

**Verificação material do N4** (instrumentando `Blob`, `URL.createObjectURL` e `anchor.click`):

```text
setTarget('logs', 3) com o atual já em nível 3      -> true      (a lacuna da camada congelada)
prepareSessionExport(...) -> { ok:false, reason:"invalid",
   error:"… Nível-alvo deve ser superior ao nível atual confirmado em: logs …" }
downloadSession(...)      -> { ok:false, reason:"invalid" }
ARTEFATOS GERADOS: Blob=0   ObjectURL=0   anchor.click=0
```

O preflight de export usa o **mesmo** validador do import (`validateSessionDocument`) e recusa
**antes** de qualquer `Blob`/Object URL/âncora. A descrição de §13.1 é factualmente correta.

### 9.1 Evidências P51 pré-errata — avaliação material

Os artefatos `P51-report-*.pdf`, `P51-question-*.png`, `P51-results-*.png`,
`P51-layout-measures.json` e `P51-pdf-evidence.json` carregam o carimbo do build pré-errata
`e8857a9d…a55b8513`. Conforme o §9.1 do prompt, essa referência **não** foi tratada como
contaminação, falha de manifesto, divergência de build, blocker ou prova de preview antigo.

Avaliação material, com prova independente:

1. **Cenários realmente registrados.** Li `P51-pdf-evidence.json` e extraí o texto dos seis PDFs. As
   leituras de régua são: `3.3 / 5 · Definido` (quatro cenários), `0.0 / 5 · Inexistente` (um) e
   `Estágio não determinado — dados insuficientes` (um). **Não** são `n/d, 1.0, 1.2, 0.0 e 5.0`,
   como afirmam o §0.7 do relatório e o próprio §9.1 do prompt — ver a ressalva **RS-1**.
2. **Nenhum é score de fronteira.** Enumerei por conta própria as 537.824 combinações de scores de
   domínio alcançáveis e identifiquei **exatamente** quais scores exibidos podem mudar de estágio
   com a errata: `0.5 · 1.5 · 2.5 · 3.5 · 4.5` — **e nenhum outro** (21.436 combinações divergentes,
   **3,99%**, reproduzindo os números do relatório). Os valores `3.3`, `0.0` e `n/d` **não** estão
   afetados. Idem para `1.0`, `1.2` e `5.0`, caso a lista do relatório estivesse certa.
3. **Nenhuma conclusão materialmente incorreta.** Os seis PDFs pré-errata continuam corretos após a
   errata: o texto extraído mostra estágio coerente com o score em cada um deles.
4. **Não são usados como prova do B1.** O relatório declara isso explicitamente em §0.7 e §12; o
   fechamento do B1 é ancorado em `P51-RPT6` e, nesta reauditoria, no **PDF independente** de §4.5.
5. **Proveniência declarada.** §0.7 e §12 declaram a origem pré-errata e a qualificam como
   *limitação de evidência*, não como equivalência provada.

Nenhuma das três condições de bloqueio do §9.1 se verifica. **A não regeneração não é blocker.**

### 9.2 Builds não confundidos — **PASS**

| build | SHA-256 | onde |
|---|---|---|
| pré-errata (nas evidências P51) | `e8857a9da789367b6a20c4c0aa848cc3db550f99d243f052d12ccd1aa55b8513` | carimbo dos artefatos antigos |
| **candidato pós-errata (auditado)** | `12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9` | árvore, manifesto e **preview em 1338** |

O preview em `127.0.0.1:1338` serve o **segundo**, confirmado por download e hash (§10).

### 9.3 Prova independente do escopo da errata

Verificação decisiva, feita em cópia temporária: revertendo **apenas** (a) a expressão de
arredondamento de `buildPrintReport()` e (b) o comentário `/* ERRATA B1 … */` de 255 bytes que a
acompanha, e reconstruindo pelo builder, o resultado é

```text
sha256 = e8857a9da789367b6a20c4c0aa848cc3db550f99d243f052d12ccd1aa55b8513
bytes  = 743.908
```

— **exatamente** o build pré-errata declarado. Isso prova, sem depender do handoff, que:

- a mudança da errata em fontes injetadas é **apenas** o fecho do B1 mais um comentário;
- **nenhuma** outra fonte injetada (`ui_journey_v32.js`, `ui_p50_results_v32.js`,
  `ui_p50_shell_v32.js`, `ui_v32.css`, `ui_p50_v32.css`, `engine_v32.js`, …) mudou entre pré e
  pós-errata;
- as identidades pré-errata declaradas em §0.6 e no cabeçalho do manifesto são genuínas.

---

## 10 · Regressão dirigida

Toda execução em cópia temporária, com o HTML reconstruído pelo builder. Nenhum comando
interrompido, expirado ou incompleto foi registrado como `PASS`.

| # | item | baseline | observado | veredito |
|---|---|---|---|---|
| 1 | `P51-RPT6` · `P51-VIS3` · `P51-DOC13` isolados | — | 3 `PASS` · 0 `FAIL` | **PASS** |
| 2 | P50 CORE + P51 | 61 | **64 PASS · 0 FAIL de 64** | **PASS** |
| 3 | P50 Chromium + P51 (Chromium real, **zero SKIP**) | 27 | **27 PASS · 0 FAIL de 27** | **PASS** |
| 4 | JOURNEY 4.5 | 31 | **31 PASS · 0 FAIL** | **PASS** |
| 5 | SESSION 4.8 | 97 | **97 PASS · 0 FAIL** | **PASS** |
| 6 | M41 | PASS + payload | **PASS** · payload `9794b267…f3ed4365b` idêntico ao baseline | **PASS** |
| 7 | `test:visual` (print/visual afetado) | 67 / 0 / 37 | **67 passed · 0 failed · 37 skipped** | **PASS** |
| 8 | build determinístico A/B | mesmo SHA | 2 × `12bb950f…eebbf9d9` · 744.179 B, **idêntico ao entregue** | **PASS** |
| 9 | manifesto | 144 | **144 OK / 0 falhas** | **PASS** |
| 10 | `git diff --check` | limpo | limpo (worktree e index, exit 0) | **PASS** |
| 11 | campanha de mutação | 20/20 | **20/20** detectados, motivo e gate esperados | **PASS** |

Demais suítes executadas na mesma rodada, todas na contagem do baseline:
ENGINE/MATRIZ **105**, UI 3.1 **19**, UI 3.2 **25**, UI 3.3.1 **11**, UI 3.3.2 **23**,
UI 3.3.3 **26**, UX 4.1 **56**, TARGET 4.3.1 **30**, REF 4.4 **28**, ICONS 4.6 **12**,
UNSET (UG) **13** — **0 FAIL** em todas.

**Nota de execução, sem impacto no veredito.** Na primeira passagem de `npm run test:all` a cópia
temporária estava **sem** `.git`, e `P50-PR1` — que resolve seu baseline de entrada por
`git show fe4a536a…` — falhou por indisponibilidade do baseline, arrastando `P50-VIS10`. Reposto o
`.git` na cópia, `npm run test:p50vis` devolveu **27 PASS · 0 FAIL**, e `npm run test:m41` `PASS`.
Foi um artefato do meu isolamento, não da candidata; fica registrado por transparência.

**Confirmação independente do comportamento de evidência descrito em §12 do relatório.** A suíte
Chromium regrava evidência quando `P50_NO_EVIDENCE` não está definido: na minha cópia com `.git`,
`git status --porcelain docs_phase5/evidence_p50/` acusou exatamente **30** arquivos regravados,
**nenhum** deles de 5.0.1–5.0.4. Reproduz a correção de metadado declarada em §0.8/§12 (29 no
parecer original, 30 na errata) e desqualifica de vez o número “36/36”.

Nenhum dos sinais de expansão do §10 apareceu: sem nova divergência de cálculo, sem diferença entre
tela e relatório, sem alteração de owner, sem mudança fora da boundary, sem regressão de Session ou
Journey, sem contaminação de evidência, sem falha determinística e sem enfraquecimento de gates.

---

## 11 · Manifesto e boundary

| exigência | observado | veredito |
|---|---|---|
| manifesto 144/144 | `sha256sum -c` → **144 OK · 0 falhas** | **PASS** |
| zero duplicatas | nenhum caminho repetido entre as 144 entradas | **PASS** |
| zero autorreferência | `MANIFEST_PHASE5_P50.sha256` aparece **só** em comentário | **PASS** |
| zero ausentes | todos os 144 caminhos existem no worktree | **PASS** |
| zero excedentes | nenhuma entrada sem arquivo correspondente | **PASS** |
| delta integralmente coberto | delta de `git status` (37 arquivos, diretórios expandidos) menos o próprio manifesto e `AGENTS.md` → **totalmente coberto** | **PASS** |
| `AGENTS.md` excluído e não rastreado | `??` no status; exclusão **nominal** declarada no cabeçalho; fora das entradas | **PASS** |
| engine byte-idêntico | `9a4a2e67…2b5d247a`, idêntico ao `HEAD` e ao baseline congelado | **PASS** |
| M41 inalterado | payload `9794b267…f3ed4365b`, `COMPARAÇÃO: PASS` | **PASS** |
| `ui_p50_results_v32.js` no SHA completo | `4c2965f7befdf2f907d6502d28f94ef8f8603cbf4a9cd3fdecc802d6e4a8b66e` · 40.714 B | **PASS** |
| `README.md` inalterado | `b7924ce0…a6322a64`, igual ao declarado | **PASS** |
| `tests_p50_chromium.js` inalterado pela errata | `39f932c6…fb7cf029`; nenhum gate `P51-RPT6/VIS3/DOC13` reside nele | **PASS** |
| builder e package files inalterados | `build_v32_html.py`, `package.json`, `package-lock.json` **idênticos ao `HEAD`** | **PASS** |
| evidências 5.0.1–5.0.5 intactas | `git status` da árvore original: **nenhum** arquivo de `evidence_p50/` modificado | **PASS** |
| produção em 1337 inalterada | `8d0932e1…76001fd85ddb` · 578.152 B · HTTP 200 | **PASS** |

**Arquivos materialmente alterados pela errata** — conferidos contra o escopo informado e contra a
prova independente de §9.3:

`ui_v32.js` · `tests_p50_core.js` · `tests_p51_mutants.js` · `USER_GUIDE.md` ·
`docs_phase5/PHASE_5_1_UAT_REPORT.md` · HTML determinístico · manifesto
(+ as duas evidências da própria errata, `P51-mutation.json` regenerado e `P51-ERRATA-suites.txt`
novo, declaradas em §0.7 e cobertas pelo manifesto).

Os arquivos já alterados pela Phase 5.1 **antes** da errata não receberam mudança adicional: todos
os SHA declarados em §2 do relatório conferem com a árvore, e §9.3 prova, por reconstrução do build,
que nenhuma outra fonte injetada mudou.

---

## 12 · Produção, preview e rede privada

Observação somente leitura; nenhum container foi reiniciado, parado ou modificado.

| alvo | exigido | observado | veredito |
|---|---|---|---|
| produção `127.0.0.1:1337` | HTTP 200 · 578.152 B · `8d0932e1…76001fd85ddb` | HTTP **200** · **578.152 B** · `8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb` | **PASS** |
| preview `127.0.0.1:1338` | HTTP 200 · 744.179 B · `12bb950f…3eebbf9d9` | HTTP **200** · **744.179 B** · `12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9` | **PASS** |
| Tailscale Serve / Funnel | Serve só para 1337; Funnel ausente | **NÃO EXECUTADO** — ver **RS-4** | — |

---

## 13 · Preservação da árvore original — resultado

| verificação | resultado |
|---|---|
| inventário byte-level pré/pós | **338 arquivos · zero diferença**; o próprio inventário tem o mesmo SHA nas duas medições: `f1abea40d6176689982412f29dd56534726903fe166887da261f13f86a542c8d` |
| `git status --porcelain` pré/pós | **idêntico** (12 modificados + 6 não rastreados, exatamente como no preflight) |
| HEAD | `af279a685eacffb8c85c60976cf4c6a059b967d0` — **inalterado** |
| staged | **0** |
| arquivos novos no clone | **nenhum** |
| processos geradores residuais | **nenhum** (`node tests_*`, Playwright, Chrome, builder: 0) |
| containers | **não** reiniciados, parados ou modificados |

Todas as operações com escrita — `npm run test:all`, `npm run test:visual`, campanha de mutação,
reversões adversariais, builds A/B, reconstrução do build pré-errata, geração de PDF e captura de
layout — ocorreram exclusivamente em `…/scratchpad/work` e `…/scratchpad/work2`. O PDF A4 gerado
nesta reauditoria permanece em `…/scratchpad/pdf/` e **não** foi adicionado à candidata.

---

## 14 · Blockers

**Nenhum.**

Nenhum defeito material foi reproduzido que mantenha ou recrie contradição de estágio, produza
cálculo ou gap incorreto, gere relatório enganoso, altere superfície protegida, invalide
integridade/build/manifesto ou impeça a integração segura da candidata.

---

## 15 · Ressalvas não bloqueantes

### RS-1 · `§0.7` e `§12` do relatório enumeram scores que não são os das evidências P51

- **Esperado.** A lista de scores dos cenários de PDF pré-errata deve corresponder ao que os
  artefatos realmente registram.
- **Observado.** O relatório afirma “*os cinco cenários de PDF pontuam `n/d`, `1.0`, `1.2`, `0.0` e
  `5.0`*”. Os **seis** PDFs e o `P51-pdf-evidence.json` registram, na leitura da régua:
  `3.3 / 5 · Definido` (`suficiente-com-label`, `importada-com-createdAt`, `suficiente-sem-label`,
  `unicode`), `0.0 / 5 · Inexistente` (`zero-confirmado`) e `Estágio não determinado — dados
  insuficientes` (`insuficiente`). Também há discordância de contagem entre “cinco cenários” (§0.7)
  e “seis cenários” (§12) — seis é o correto.
- **Impacto material: nenhum.** A conclusão que o parágrafo sustenta continua verdadeira e foi
  provada por mim de forma independente: só scores exibidos exatamente em `0.5 · 1.5 · 2.5 · 3.5 ·
  4.5` podem mudar de estágio com a errata, e nem `3.3`, nem `0.0`, nem `n/d` estão nesse conjunto
  (§9.1). Os PDFs pré-errata permanecem corretos.
- **Superfície.** `docs_phase5/PHASE_5_1_UAT_REPORT.md` §0.7 e §12.
- **Correção mínima sugerida (não implementada).** Substituir a lista por
  “`n/d`, `0.0` e `3.3`” e uniformizar a contagem em **seis** cenários, mantendo o argumento — que
  não muda.
- **Nota.** O §9.1 do próprio prompt de reauditoria repete a mesma lista; ela também não confere com
  os artefatos.

### RS-2 · `§9.2` do relatório mantém a narração de N4 que o `§13.1` corrige

- **Esperado.** Coerência interna: a limitação N4 deve ser narrada como recusa **no export**.
- **Observado.** `§13.1` traz a correção (“*o export é recusado antes de gerar qualquer arquivo — não
  é o import do documento resultante que falha*”), mas `§9.2` conserva a redação original
  (“*o `importSessionDocument` do mesmo documento foi recusado*”), sem remissão à correção.
- **Impacto material: nenhum.** Verifiquei materialmente que o preflight de export recusa com
  `Blob = 0`, `ObjectURL = 0`, `anchor.click = 0` (§9). A afirmação de §13.1 é a correta.
- **Superfície.** `docs_phase5/PHASE_5_1_UAT_REPORT.md` §9.2.
- **Correção mínima sugerida (não implementada).** Acrescentar em §9.2 a remissão a §13.1/§0.8,
  esclarecendo que o documento em questão foi montado pelo harness e que a rota de usuário é
  recusada antes de gerar arquivo.

### RS-3 · `USER_GUIDE.md` §12 não lista três seções condicionais que o produto emite

- **Esperado.** A lista de §12 descreve materialmente a ordem do relatório.
- **Observado.** Em uma sessão *maximal* (plataforma FortiGate declarada, sinal de sessão ativo e
  gaps core suficientes para a leitura arquitetural), o relatório emite também
  `#pr-entitlements` (“Plataformas e licenciamento declarados”), `#pr-signals` (“Requisitos e
  preocupações específicas”) e `#pr-arch` (“Leitura arquitetural”), que a lista de §12 não menciona.
- **Impacto material: nenhum, e não é inversão factual.** Medi a ordem relativa das dez seções
  documentadas nesse mesmo cenário maximal: **idêntica** à do manual. O §8.2 do prompt qualifica
  diferença de redação sem inversão factual como não bloqueante.
- **Superfície.** `USER_GUIDE.md` §12.
- **Correção mínima sugerida (não implementada).** Acrescentar as três seções condicionais à lista,
  ou uma frase declarando que outras seções condicionais podem aparecer entre 6 e 8.

### RS-4 · Tailscale Serve/Funnel não verificável neste ambiente

- **Observado.** Não há binário `tailscale`/`tailscaled`, nem socket em `/var/run/tailscale/`, nem
  serviço ativo neste WSL. A consulta somente leitura prevista no §12 do prompt **não pôde ser
  executada**.
- **Consequência.** A afirmação do relatório (Serve exclusivamente para `127.0.0.1:1337`, Funnel
  ausente) fica **não verificada** nesta reauditoria — declarada como **não executada**, não como
  reprovada.

### RS-5 · Ressalva ambiental de browser (R6 do parecer original), mantida

- Chromium observado: **Google Chrome for Testing 151.0.7922.34**, contra o `141.0.7390.37`
  histórico. Zero regressão observada nas suítes Chromium (27/27) e visual (67/0/37). Não
  bloqueante por decisão explícita do §13 do prompt.

### RS-6 · Nota metodológica sobre o oráculo de estágio de `P51-RPT6`

- O gate obtém o nome de estágio de referência do próprio runtime, provando **coerência entre
  superfícies**, não a **correção dos limiares**. Adequado ao escopo do B1; a correção dos limiares
  é coberta por `P51-RPT3` e, aqui, pela minha tabela literal independente, conferida em 501/501
  pontos (§4.2). Registrado como observação, não como fraqueza a corrigir.

---

## 16 · Testes executados e não executados

**Executados nesta reauditoria** (todos em cópia temporária, salvo as leituras somente-leitura):

- oráculo próprio do B1 nas cinco fronteiras + Casos A e B — **79 asserções · 0 falhas**;
- oráculo próprio do B1 sob reversão do arredondamento — **21 falhas**, reproduzindo o blocker;
- `P51-RPT6` isolado, íntegro (**PASS**) e sob reversão (**FAIL semântico**);
- oráculo próprio do sinal do gap — **69 asserções · 0 falhas** + o caso condicional de §6.2;
- `P51-VIS3` sob **duas** inversões independentes (célula e domínio) — **FAIL semântico** nas duas;
- oráculo próprio documental (fórmula do score e ordem do relatório, inclusive cenário maximal) —
  **25 asserções · 0 falhas**;
- enumeração própria de 537.824 combinações para delimitar a janela do defeito;
- verificação material da limitação N4 com instrumentação de `Blob`/`ObjectURL`/`anchor.click`;
- PDF A4 real do build pós-errata + extração de texto + medição de layout em modo print;
- `npm run test:all` (build + ENGINE + UI + UX + TARGET + REF + JOURNEY + ICONS + SESSION + UNSET +
  P50 CORE/P51 + P50 Chromium/P51 + M41);
- `npm run test:visual`;
- campanha `tests_p51_mutants.js` completa;
- build determinístico A/B + reconstrução do build **pré-errata** a partir das fontes;
- `sha256sum -c` do manifesto, oráculo próprio de completude/duplicidade/autorreferência;
- `git diff --check` (worktree e index), inventário byte-level pré/pós;
- HTTP + SHA de `127.0.0.1:1337` e `127.0.0.1:1338`.

**Não executados, declarados como tais:**

- consulta a **Tailscale Serve/Funnel** — ferramenta ausente do ambiente (**RS-4**);
- **regeneração** dos artefatos P51 pré-errata — fora do escopo e não exigida (§9.1);
- auditoria integral da Phase 5.1 (cálculo, suficiência, isolamento entre clientes, recomendações
  Fortinet, UAT, responsividade, produção) — **explicitamente vedada** pelo §0 do prompt;
- campanhas históricas de mutação da Phase 5.0 — dispensadas pelo §7.

---

## 17 · Veredito

# **PASS COM RESSALVAS NÃO BLOQUEANTES**

A errata **fecha o blocker B1** e **fecha as ressalvas R1, R2 e R3** do parecer original, sem abrir
defeito novo, sem tocar superfície protegida e sem alterar nada fora do escopo declarado.

Fundamentos do veredito:

1. **B1 fechado**, provado por oráculo independente com tabela de estágios própria, em estados
   alcançáveis pelo produto, nas **cinco** fronteiras e nos **dois** casos do parecer — **79
   asserções, 0 falhas** — e confirmado por **PDF A4 real** do build pós-errata, em que score, KPI,
   régua, jornada e leitura executiva dizem `Definido (2.5/5)` e **nenhuma** ocorrência identifica o
   estágio corrente como `Gerenciado`. A correção não produziu colisão, corte nem mudança visual
   material.
2. **Sinal do gap protegido.** O produto publica `gap = round1(target − current)` com sinal correto
   em atributo, texto, `aria-label`, coluna Gap, tabela acessível e matriz Current × Target — **69
   asserções, 0 falhas** — e `P51-VIS3` detecta as **duas** inversões possíveis (célula e domínio)
   com motivo semântico que nomeia a prática e os valores. `ui_p50_results_v32.js` permanece no SHA
   fixado.
3. **Correções documentais corretas de fato**, não de redação: o manual descreve a conta que o
   produto executa (média dos cinco scores de domínio, ≠ média direta das respostas) e a ordem que o
   relatório realmente emite — **25 asserções, 0 falhas**.
4. **Poder discriminante provado**: `20/20` mutantes detectados pelo gate e motivo esperados, com
   restauração byte a byte e reprodução campo a campo do artefato entregue.
5. **Integridade preservada**: build determinístico A/B reproduzindo o HTML entregue; manifesto
   144/144 sem duplicata, autorreferência, ausente ou excedente; engine e payload M41 byte-idênticos;
   produção em 1337 intocada; preview em 1338 servindo o build pós-errata; `git diff --check` limpo.
6. **Escopo da errata provado independentemente**: revertendo apenas o fecho do B1 e seu comentário,
   o builder reproduz exatamente o build pré-errata `e8857a9d…a55b8513` / 743.908 B.

As ressalvas **RS-1** a **RS-6** são de documentação, de ambiente ou de método, sem defeito material
reproduzido, e nenhuma delas satisfaz qualquer critério de blocker do §13 do prompt. A candidata
está apta a seguir para a decisão do proprietário.

**Esta reauditoria não declara a fase concluída, não aprova freeze, integração ou release, e não
inicia fase nova.** Essas decisões são do auditor/proprietário.

---

## 18 · Atos não realizados

Nenhuma correção foi implementada. Nenhum arquivo da árvore original foi criado, alterado ou
removido. Não houve `commit`, `push`, PR, `merge`, `tag`, freeze, release, deployment ou promoção.
Nenhuma fase nova foi iniciada. Nenhum container foi reiniciado, parado ou modificado.

A execução **para aqui**.
