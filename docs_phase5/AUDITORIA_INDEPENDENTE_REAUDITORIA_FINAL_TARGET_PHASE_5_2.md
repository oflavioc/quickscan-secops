# REAUDITORIA INDEPENDENTE FINAL E ESTREITA DA PHASE 5.2 — PARECER

**Objeto:** errata final de publicação *Perfil atual × Cenário-alvo* (`ALTO-1`) e contraste do link
de apoio (`MÉDIO-2`), candidata não comitada no branch `feat/phase5-5-2-desktop-workspace`.

**Auditor:** sessão independente, nova, sem `resume` e sem reuso de contexto de qualquer sessão
implementadora. **Data:** 2026-08-24.

---

## 1 · Declaração de independência e elegibilidade

Declaro, de forma honesta e verificável:

- Esta é uma **sessão nova**. Não usei `resume`, não carreguei transcrição, não herdei contexto e não
  consultei estado de sessão alguma anterior. Todo conhecimento sobre a candidata nesta sessão veio de
  leitura direta dos arquivos e de execução própria.
- **Não participei** da implementação da Phase 5.2, de nenhuma de suas erratas, da redação do
  relatório auditado, dos gates, das fixtures, dos mutantes, dos PDFs ou das evidências desta
  candidata.
- **Não emiti** o parecer `70904c11…` que reprovou a candidata anterior. Li-o como documento de
  entrada, não como trabalho meu.
- **Não implementei correção alguma** nesta rodada e **não alterei a árvore original**. Toda execução
  capaz de escrever ocorreu exclusivamente em cópia temporária completa.
- Não fiz commit, push, PR, merge, tag, freeze, release, deployment, substituição de preview ou
  promoção a produção, e **não iniciei fase posterior**.
- Nenhuma requisição foi feita à produção em `127.0.0.1:1337`.

Sou, portanto, **elegível** para emitir este parecer.

---

## 2 · Identidade do prompt desta reauditoria

Recalculada **antes** de qualquer trabalho, sobre os bytes do arquivo:

```text
arquivo  : …/outputs/PROMPT_REAUDITORIA_INDEPENDENTE_FINAL_TARGET_PHASE_5_2.md
SHA-256  : 68666ab9a085427c4ef963f26d3100d60ac20d0cc482859adac16dc7a4cad2e3   ✔ confere
bytes    : 14352                                                             ✔ confere
linhas   : 442                                                               ✔ confere
encoding : UTF-8                                                             ✔ confere
BOM      : ausente (primeiros bytes 23 20 52 = "# R")                        ✔ confere
bytes CR : 0                                                                 ✔ confere
```

Os seis atributos conferem. O prompt foi lido integralmente até EOF antes de qualquer ação.

---

## 3 · Identidades de entrada — todas recalculadas

| Artefato | Esperado | Observado | Veredito |
|---|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` | `fb906462484ff3d3…79a79` · 963.373 B | idem · 963.373 B | ✔ |
| `engine_v32.js` | `9a4a2e674389a115…d247a` | idem · 57.261 B · **byte-idêntico ao HEAD** | ✔ |
| payload funcional M41 | `9794b267e4225d8f…d4365b` | idem · PASS · sanidade OK · 9 cenários | ✔ |
| `docs_phase5/MANIFEST_PHASE5_P52.sha256` | `22334a2bfec6903e…5801` | idem · 50.219 B · 423 linhas | ✔ |
| `…/PHASE_5_2_FINAL_TARGET_PUBLICATION_ERRATA_REPORT.md` | `f465afac35c5b161…238b49` · 48.021 B · 787 linhas | idem · UTF-8 · sem BOM · 0 CR | ✔ |
| parecer anterior `AUDITORIA_INDEPENDENTE_REAUDITORIA_ERRATA_PHASE_5_2.md` | `70904c113096d9a9…b04120` · 55.571 B · 886 linhas | idem · UTF-8 · 0 CR · **sidecar válido** | ✔ |

Nenhum atributo divergiu. Prossegui.

---

## 4 · Preflight de Git e de processos ativos

```text
branch        : feat/phase5-5-2-desktop-workspace          ✔ esperado
HEAD          : d3886812718e7ad9c5024880067133fbddf2fc4d   ✔ esperado
staged        : 0                                          ✔
delta -uall   : 376 caminhos (candidata NÃO comitada)      ✔
tags          : 1 · v3.2-phase5.1 (preexistente, da 5.1)   ✔ nenhuma tag nova
upstream      : nenhum · ahead/behind 0/0
commit/push/PR/merge/release/deployment da candidata : ZERO
```

### 4.1 · O “1 shell still running” do handoff — caracterizado e inofensivo

O handoff da sessão implementadora terminou anunciando um shell ativo. **Localizei-o e caracterizei-o
antes de tocar em qualquer coisa**, como o §4 exige:

```text
PID 133726 · iniciado 2026-08-21 13:27:58 · estado Ss (do_wait)
  bash -c 'until grep -q ALLDONE /tmp/outE.txt && grep -q DONE /tmp/mutE/_mut.txt; do sleep 20; done'
```

- É um laço **de espera**: apenas `grep` + `sleep`. **Não gera, não muta, não constrói e não escreve
  nada** — nem na árvore original, nem em lugar algum.
- `/tmp/outE.txt` **já contém `ALLDONE`**, com mtime de 2026-08-21 13:35: a bateria que ele observava
  terminou há três dias.
- `/tmp/mutE/` **nunca existiu** (a campanha daquela rodada usou `/tmp/mutF` e `/tmp/p50mut*`). Por
  isso a segunda condição jamais se satisfaz e o laço gira indefinidamente. É um **waiter órfão**,
  não um job vivo.

Conforme a instrução, **não o matei e não alterei a árvore**; registro-o aqui.

**Varredura de processos ativos, imediatamente antes de iniciar:**

| Classe exigida pelo §4 | Observado |
|---|---|
| testes P50/P52 | **nenhum** |
| campanha de mutação | **nenhum** |
| Playwright/Chromium da suíte | **nenhum** |
| build (`build_v32_html.py`) | **nenhum** |
| geração de PDF · `pdftoppm` | **nenhum** |
| M41 | **nenhum** |

Os únicos processos com `cwd` no repositório são sessões do próprio agente, shells `bash` ociosos, um
`tr` residual de 2026-08-21 e o waiter órfão acima. **O estado da candidata não é móvel.** A auditoria
começou sobre estado estável.

---

## 5 · Preservação da árvore original

```text
inventário PRE  · 2.713 arquivos (exclui .git) · SHA-256 do inventário
                  add5a37788253a220963bcb582d0dd49fc55d9703c7f33c1b01e5ef0275f1e00
cópia temporária completa : /tmp/p52final/repo  (inclui .git e node_modules)
inventário da cópia       : IDÊNTICO ao PRE, byte a byte
```

**Inventário nominal de `docs_phase5/evidence_p50/` (exigido pelo §5.4):**

```text
82 arquivos · SHA-256 do inventário
  ed6e7bbe427f80912d56edd845cad50366489a8374ef45b26261d5d4946d197c
subconjunto dos 44 modificados vs HEAD · SHA-256 do inventário
  b7765491df179242f340f599ccbadedade6395412840fe0eeea918cfebba5022
```

Os **dois valores reproduzem exatamente** os declarados no §11.3 do relatório, calculados por mim de
forma independente. Toda execução capaz de escrever rodou em `/tmp/p52final/repo`,
`/tmp/p52final/own` e diretórios temporários — **nunca** na árvore original.

---
## 6 · Manifesto — enumerado por oráculo independente

Não aceitei o comando de verificação do próprio manifesto. Enumerei o escopo por conta própria
(`git status --porcelain -uall`, com diretórios expandidos) e comparei conjunto a conjunto.

| Verificação | Alegado | Observado | Veredito |
|---|---|---|---|
| entradas de dados | 374 | **374** | ✔ |
| linhas malformadas | 0 | **0** (todas `64hex` + 2 espaços + caminho) | ✔ |
| `sha256sum` recalculado por mim, entrada a entrada | 374/374 | **374 OK · 0 divergentes · 0 ausentes** | ✔ |
| duplicatas de caminho | 0 | **0** | ✔ |
| duplicatas de linha | 0 | **0** | ✔ |
| autorreferência | 0 | **0** | ✔ |
| oráculo do delta (`-uall`) | — | **376 caminhos** | — |
| **ORÁCULO − MANIFESTO** | `AGENTS.md` + o próprio manifesto | **exatamente esses 2** | ✔ |
| **MANIFESTO − ORÁCULO** (excedentes) | 0 | **0** | ✔ |
| sete entradas novas sobre as 367 de entrada | 7 nominais | **as 7 presentes; 374 − 7 = 367** | ✔ |

O manifesto **sela integralmente o delta da candidata**, sem excedente, sem ausente e sem
autorreferência. As quatro provas em PDF (`P52-TGT4-{A,B,C,D}.pdf`) existem, estão seladas e são A4
reais (`595,92 × 842,88 pts`).

---

## 7 · Verificação central — a comparação é indivisível

### 7.1 · Método e independência do oráculo

Extraí do **HTML construído**, por conta própria, o banco congelado (15 `qid` com seu domínio,
`SCORES = [0, 1.7, 3.3, 5]`, as faixas de `stageOf`) e implementei **meu próprio oráculo**
aritmético. Não importei `fixtures_p52.js`, não chamei `p52ComparisonOracle()`, `computeTargetProfile()`,
`tgtPublishable()` nem `publishableStats()`. **Meus vetores e alvos são próprios**, distintos das
fixtures entregues (`P52-F1..F5`).

Estado aplicado **pelos owners canônicos** (`__DEV.setAnswerById`, `__DEV.setTarget`) e, no caso
decisivo, **pela UI real** (§7.4). Quatro canais independentes de observação: **tela** (estilos
computados e caixas), **DOM projetado para impressão**, **árvore acessível** (`Accessibility.getFullAXTree`
via CDP do Chromium, não reconstrução própria) e **PDF A4 real** (texto por `pdftotext -layout`; tinta
por `pdftoppm -r 110` com censo pixel a pixel do PPM P6, 1.173.368 pixels por página).

### 7.2 · Os quatro quadrantes — meus vetores, meu oráculo

| | **A** insuf. × insuf. | **B** insuf. × **SUF.** | **C** suf. × suf. | **D** suf. sem alvo |
|---|---|---|---|---|
| oráculo `cur.suff` / `tgt.suff` | false / false | **false / true** | true / true | true / — |
| confirmadas atuais · efetivas do alvo | 5 · 7 | **5 · 10** | 15 · 15 | 15 · 15 |
| alvo BRUTO que o defeito publicaria | — | **2.8 / 5 · “Definido”** | 2.3 / 5 · “Gerenciado” | — |
| TELA · KPI atual / KPI alvo | `n/d` `n/d` / `n/d` `n/d` | **`n/d` `n/d` / `n/d` `n/d`** | `1.3 / 5` “Inicial” / `2.3 / 5 +1.0` “Gerenciado” | seção de comparação inexistente |
| TELA · valores por domínio (atual · alvo) | 0 · 0 | **0 · 0** | 5 · 5 corretos | — |
| TELA · setas de comparação | 0 | **0** | 5 | — |
| TELA · overlay do alvo | **não criado** | **não criado** | 5 vértices, visível | não criado |
| A11Y · `X.X / 5` na árvore acessível | 0 | **0** | `1.3 / 5`, `2.3 / 5` presentes | — |
| A11Y · `alvo X.X` | 0 | **0** | `1.7`, `2.2`, `2.8` presentes | — |
| A11Y · nome acessível do radar | “perfil atual” | **“perfil atual”** | “perfil atual … e cenário-alvo” | — |
| JORNADA · marcador de estágio do alvo | 0 | **0** | 1, no estágio **correto** | 0 |
| CAMADA 5 · `alvo X.X` · `data-p50-target` · `data-p50-gap` | 0 · 0 · 0 | **0 · 0 · 0** | 5 · 5 · 5 | 0 · 0 · 0 |
| PAPEL · valores por domínio · setas | 0 · 0 | **0 · 0** | 5 · 5 | `#pr-target` **ausente** |
| PAPEL · polígono do alvo / do atual | 0 / 0 vértices | **0 / 0 vértices** | 5 / 5 vértices, tracejado | ausente |
| PDF · texto do bloco | só `n/d` | **só `n/d`, zero estágio, zero número** | números corretos | bloco ausente |
| **PDF · tinta `#3CB17E` na página do bloco** | **0 px** | **0 px** | **119 px puros / 141 ±28** | 0 px em **todas** as páginas |
| PDF · tinta `#3CB17E` na página da jornada | **0 px** | **0 px** | pintada (marcador ◆) | 0 px |
| mensagem neutra presente e **visível** | sim | **sim** | ausente (correto) | — |
| práticas-alvo salvas e listadas | 2/2 | **5/5** | 5/5 | — |
| estado canônico antes × depois da impressão | idêntico | **idêntico** | idêntico | idêntico |
| erros de página | 0 | **0** | 0 | 0 |

**O caso B é decisivo e foi construído para sê-lo.** Meu oráculo prova que o vetor efetivo do alvo
alcança 10 confirmadas com `n ≥ 2` em todos os cinco domínios — `tgt.suff = true` — e que a
aritmética canônica produziria **2.8 / 5 · “Definido”**. Este é exatamente o número que a candidata
reprovada publicava. **Nada disso aparece**, em nenhum dos quatro canais.

### 7.3 · Caso C — controle positivo conferido célula a célula

Contra o **meu** cálculo independente, e não contra o do produto:

```text
domínio      atual  →  alvo   gap        oráculo do auditor   produto (tela)   produto (papel)
Negócio       1.7   →  2.8   +1.1              1.7 2.8 +1.1     1.7 2.8 +1.1     1.7 2.8 +1.1
Pessoas       1.1   →  1.7   +0.6              1.1 1.7 +0.6     1.1 1.7 +0.6     1.1 1.7 +0.6
Processos     1.1   →  2.2   +1.1              1.1 2.2 +1.1     1.1 2.2 +1.1     1.1 2.2 +1.1
Tecnologia    1.1   →  2.2   +1.1              1.1 2.2 +1.1     1.1 2.2 +1.1     1.1 2.2 +1.1
Serviços      1.7   →  2.8   +1.1              1.7 2.8 +1.1     1.7 2.8 +1.1     1.7 2.8 +1.1
KPI           1.3   →  2.3   Δ +1.0            Inicial→Gerenciado   idem            idem
```

**Cinco valores atuais, cinco valores de alvo, cinco gaps, KPI e estágio: todos corretos.**
Tela = papel, domínio a domínio, **zero divergência**. Polígono do alvo **materialmente pintado**
(119 px puros de `#3CB17E`, encoding tracejado exclusivo preservado).

**Tecnologia altera zero score.** Repeti o caso C com o **contexto tecnológico declarado pelo editor
real** (`Ctec`): os cinco valores atuais, os cinco do alvo, os cinco gaps, o KPI e os dois estágios
são **idênticos** ao caso C sem contexto. A invariante metodológica #4 é observada.

### 7.4 · Caso B alcançado pela **UI real**, não por `__DEV`

O §6.1 exige que o caso B seja produzido definindo alvos **pela UI real**. Fiz isso:

```text
1. respostas aplicadas pelo owner canônico (5 confirmadas, uma por domínio)
2. clique real em "Definir cenário-alvo"  →  editor abre com 15 <select data-qid>
3. cinco alvos declarados por `selectOption` REAL do Playwright, em práticas NUNCA respondidas
4. clique real em "Salvar cenário-alvo"
```

Resultado medido no estado assim alcançado:

```text
overrides salvos : {mandate:3, team-capacity:2, incident-response:3, logs:2, monitoring-coverage:3}
cur.suff         : false          tgt.suff : true
alvo BRUTO       : 2.8 / 5 · "Definido"        ← o que o defeito publicaria
TELA   KPIs      : Atual n/d n/d · Cenário-alvo n/d n/d · 5 práticas explícitas
TELA   linhas    : 5 × (n/d , sem seta , n/d , n/d)      overlay: NÃO CRIADO
PAPEL  KPIs      : n/d "Atual · n/d" · n/d "Cenário-alvo · n/d"     polígono do alvo: 0 vértices
PDF    texto     : só n/d, zero estágio, zero número      PDF tinta #3CB17E: 0 px em TODAS as páginas
JORNADA: 0 marcadores   CAMADA 5: 0 marcadores   nota neutra: presente e visível
práticas-alvo declaradas: 5/5 preservadas e recuperáveis     erros de página: 0
```

O estado é **alcançável em uso normal de workshop** — o editor oferece os 15 selects — e **nada
publica**. A regra `comparisonPublishable = current.suff === true` vale também no caminho real.

### 7.5 · Caso B adversarial próprio (`B2`) — alvos sobre práticas **respondidas**

Construí um quadrante que nenhuma fixture entregue exercita: perfil atual insuficiente por
**contagem** (9 confirmadas, `Serviços` com `n = 1`), com alvos declarados sobre práticas **já
respondidas**, de modo que o vetor efetivo abra (`tgt.suff = true`, alvo bruto `3.2 / 5`):

```text
TELA: KPI atual n/d · KPI alvo n/d · 5 linhas n/d · 0 setas · overlay NÃO criado
      JORNADA 0 marcadores · CAMADA 5 0 marcadores · nota neutra presente
```

A correção **também** se sustenta neste quadrante. Registro uma observação de escopo em §11 (R-3).

### 7.6 · Caso D — sem seção vazia e sem mensagem enganosa

No papel, `#pr-target` **não existe** (`__uxTargetPrintHTML()` retorna `""` sem overrides) e nenhuma
página do PDF tem tinta do alvo. Na tela, `#ux-target` existe mas **não é uma comparação**: é o convite
de edição — *“Nenhum cenário-alvo foi definido. Defina níveis de prática desejados…”* com o botão
`Definir cenário-alvo`. **Não há seção de comparação vazia nem mensagem enganosa.**

### 7.7 · Nota sobre o escopo do censo de tinta

Declaro, para que a medida não seja lida como mais forte do que é: a página de **capa** contém
4.857 px de `#3CB17E` puro em **todos** os casos — inclusive no caso **D, que tem zero alvos
declarados**. É elemento gráfico da capa, **invariante aos alvos** e, por definição, não é tinta do
cenário-alvo. Por isso o censo foi restrito às páginas do bloco de comparação e da jornada, onde a
medida é significativa — e ali o controle positivo (caso C) prova que o sensor **enxerga** a tinta
quando ela existe.

---

## 8 · As duas superfícies adicionais (§7 da instrução)

### 8.1 · Régua da jornada de maturidade

Medido no **PDF real**, texto extraído:

```text
CASO B (gate FECHADO, alvo suficiente):
    Posicionamento atual: n/d
    Não há evidência suficiente neste Quickscan para posicionar a operação…
       0            1            2            3            4              5
  Inexistente    Inicial    Gerenciado    Definido    Gerenciado    Em otimização
                                                   quantitativamente
  → nenhum ◆ · nenhum rótulo "CENÁRIO-ALVO" · 0 px de #3CB17E na página

CASO C (gate ABERTO — CONTROLE POSITIVO):
       0            1             2◆              3            4            5
  Inexistente    Inicial     Gerenciado       Definido    Gerenciado   Em otimização
              PERFIL ATUAL  PRÓXIMO ESTÁGIO ·                quantitativamente
                              CENÁRIO-ALVO
```

Sob gate fechado: **nenhum marcador sobre estágio nomeado, nenhuma posição inferível visualmente ou
pela árvore acessível** (o `aria-label` da régua deixa de mencionar cenário-alvo), **alvo salvo
intacto**. Sob gate aberto o marcador aparece **no estágio correto** — índice 2 “Gerenciado”, que é
exatamente o que meu oráculo calcula para o alvo (2.3). ✔

### 8.2 · Camada 5 — eixo por domínio

| Estado | `alvo X.X` | `data-p50-target` | `data-p50-gap` |
|---|---|---|---|
| gate FECHADO com alvo suficiente (casos A, B, B2, UI real) | **0** | **0** | **0** |
| gate ABERTO (caso C, controle positivo) | 5 (`2.8 1.7 2.2 2.2 2.8`) | 5 | 5 |

Os nós **não são criados** — não há texto “apenas oculto visualmente, mas acessível”. Os valores do
controle positivo conferem com meu oráculo. ✔

O alvo declarado **por pergunta** (eixo UI-015/UI-016a) permanece listado, o que é o comportamento
normativo preservado (“as práticas-alvo declaradas continuam listadas, uma a uma”), e **não** é score
de domínio publicado.

---
## 9 · Contraste do link de apoio — recalculado, não aceito do handoff

Contexto tecnológico declarado **pelo editor real** (`#v32cta` → `presence = NONE` → `#v32save`), com
os cards de apoio **efetivamente renderizados**. Aritmética WCAG 2.x **minha**, sobre o primeiro
ancestral **opaco**. Sete viewports, quatro nós `a.p52-sup-link` por viewport.

| Viewport | nós | `color` | fundo efetivo | px / peso | razão | veredito |
|---|---|---|---|---|---|---|
| 390×844 | 4 | `#F54133` | `#151517` (`DIV.v32-card`) | 13,5 / 400 | **4,938:1** | ✔ |
| 768×1024 | 4 | `#F54133` | `#151517` | 13,5 / 400 | **4,938:1** | ✔ |
| 1024×768 | 4 | `#F54133` | `#151517` | 13,5 / 400 | **4,938:1** | ✔ |
| 1440×900 | 4 | `#F54133` | `#151517` | 13,5 / 400 | **4,938:1** | ✔ |
| 1920×1080 | 4 | `#F54133` | `#151517` | 13,5 / 400 | **4,938:1** | ✔ |
| 2560×1440 | 4 | `#F54133` | `#151517` | 13,5 / 400 | **4,938:1** | ✔ |
| 3440×1392 | 4 | `#F54133` | `#151517` | 13,5 / 400 | **4,938:1** | ✔ |

**28 nós medidos · 0 reprovações.** O valor `4,938:1` declarado pela candidata **reproduz-se
exatamente** no meu cálculo independente. O antigo `3,747:1` (`#DA291C`) desapareceu.

| Exigência do §9 | Observado |
|---|---|
| foreground = `var(--red-text)` / token canônico | `#F54133`, do token `:root { --red-text }` — **sem hex novo** ✔ |
| razão mínima 4,5:1 sobre o fundo efetivo | **4,938:1** em 28/28 ✔ |
| estado **normal** conforme | `rgb(245,65,51)` ✔ |
| estado **hover** conforme | mesma cor; sublinhado com espessura **2px** ✔ |
| estado **focus-visible** conforme | foco real por **Tab**: `:focus-visible` casa; `outline 2px solid #F5F5F4`, offset 2px; cor do texto inalterada; **contraste do foco 16,717:1** (WCAG 1.4.11 exige ≥ 3:1) ✔ |
| estado **visited** conforme | regra `.p52-sup-link:visited { color: var(--red-text) }` presente no HTML construído — **mesmo token, mesma razão** ✔ |
| pista **não cromática** | `text-decoration: underline` **permanente** (não só no hover) + glifo `↗` — WCAG 1.4.1 ✔ |
| foco visível | sim, medido acima ✔ |
| `href` · `target` · `rel` preservados | `https://www.fortinet.com/…` · `_blank` · `noopener` ✔ |
| abertura automática / requisição externa | **zero** requisições fora de `file://` em todos os 7 viewports; zero erros de página ✔ |
| alvo de toque (L-01) | `min-height: 24px`, caixa medida **30 px** ✔ |

---

## 10 · Gates e mutantes — não vacuidade

### 10.1 · Auditoria do gate novo `P52-TGT4`

| Exigência do §8 | Observado |
|---|---|
| caso **B** explicitamente presente | sim — quadrante nominal, com guarda que **reprova** se `tgt.suff` deixar de ser `true` (“o gate seria vacuoso”) ✔ |
| tela **e** PDF cobertos | tela, árvore acessível, papel, **PDF-TEXTO** e **PDF-TINTA** ✔ |
| controle positivo **C** presente | exige score, nome de estágio, overlay com **5** vértices, os dois polígonos com **5** vértices, encoding tracejado, tinta `> 0` e ausência da nota de gate fechado ✔ |
| **não** depende da mesma função como oráculo | usa `p52ComparisonOracle()`, que recalcula os dois perfis a partir do vetor e **não chama** `computeTargetProfile()`, `tgtPublishable()` nem `publishableStats()` — li o código e confirmei ✔ |
| **não** passa por ausência de seção/fixture | no caso B, `#pr-target` ausente é **FALHA**; bloco não encontrado no PDF é “sensor cego” = FALHA; ausência de poppler é **FALHA**, nunca silêncio ✔ |
| **não** substitui asserções anteriores válidas | gate **novo**; nenhuma asserção anterior removida ✔ |

### 10.2 · Os dez mutantes dedicados — reexecutados por mim

Campanha filtrada aos dez, na cópia: **10/10 detectados**, exit 0.

| Mutante | Alteração material | Gate esperado | Gate observado · motivo | Erro incidental | Restauração |
|---|---|---|---|---|---|
| `P52-FT1` | TELA: coluna Alvo volta a `tgt.suff` | `P52-TGT4` | **FAIL** `P52-TGT4` · `TELA: domínio N publica alvo` | não | byte-idêntica |
| `P52-FT2` | TELA: KPI e **nome de estágio** do alvo | `P52-TGT4` | **FAIL** · `TELA: KPI do alvo publica score/estágio` | não | byte-idêntica |
| `P52-FT3` | PAPEL: **polígono** do alvo pintado | `P52-TGT4` | **FAIL** · `PAPEL: polígono…` / `PDF-TINTA` | não | byte-idêntica |
| `P52-FT4` | PAPEL: coluna Alvo publicada | `P52-TGT4` | **FAIL** · `PAPEL: domínio N publica alvo` / `PDF-TEXTO` | não | byte-idêntica |
| `P52-FT5` | nota neutra → alegação contraditória | `P52-TGT4` | **FAIL** · `PAPEL: mensagem neutra ausente` | não | byte-idêntica |
| `P52-FT6` | régua da jornada marca o alvo | `P52-TGT4` | **FAIL** · `JORNADA: marcador de estágio…` | não | byte-idêntica |
| `P52-FT7` | Camada 5 pinta `alvo X.X` | `P52-TGT4` | **FAIL** · `CAMADA 5: N marcador(es)` | não | byte-idêntica |
| `P52-FC1` | `#DA291C` direto no link | `P52-ACC3` | **FAIL** · `p52-sup-link … 3.747:1 (exigido 4.5:1)` | não | byte-idêntica |
| `P52-FC2` | cor acessível só no hover | `P52-ACC3` | **FAIL** · `p52-sup-link … 3.747:1` | não | byte-idêntica |
| `P52-FC3` | remove o contexto → gate vacuoso | `P52-ACC3` | **FAIL** · `fixture não montou 'a.p52-sup-link' — gate vacuoso` | não | byte-idêntica |

**Restauração conferida por mim**, não pelo harness: os seis arquivos sensíveis e o HTML voltaram
**byte-idênticos** ao baseline (`sha256sum` PRE = POS).

**Campanha completa reexecutada:** `72/72 mutantes detectados pelo gate e motivo esperados`, exit 0,
`restauração … OK`, `acervo de evidência: 265 arquivo(s) byte-idênticos ao início`. Reconfere o
número do §12.2 do relatório.

### 10.3 · Meus mutantes próprios — distintos da campanha entregue

Aplicados por mim, com rebuild determinístico, execução do gate e **restauração em `finally`** com
conferência de hash.

| # | Alteração (arquivo · caminho **distinto** dos entregues) | HTML mutado | Gate | Resultado |
|---|---|---|---|---|
| **RA-M1** | `ui_target_v32.js` — reabre **somente** o nome de estágio do alvo no **KPI do PAPEL** (sítio diferente de `FT2`, que ataca `pubO`/`pubS` da tela) | `0d1f4bf86e33f95f` ≠ candidata → **vivo** | `P52-TGT4` | **DETECTADO** · `caso B PAPEL: KPI do alvo publica estágio · 'n/dCenário-alvo · Definido'` + `caso B PDF-TEXTO: nome de estágio publicado no bloco` · **0 erros de página** |
| **RA-M2b** | `ui_journey_v32.js` — reabre o marcador da jornada **no render**, não em `journeyModel()` (caminho diferente de `FT6`) | `94aa9472c491ceaa` ≠ candidata → **vivo** | `P52-TGT4` | **DETECTADO** · `caso B JORNADA: marcador de estágio do cenário-alvo na régua` + `caso B PDF-TINTA: 18px de #3CB17E na página do bloco` · **0 erros de página** |
| **RA-M3** | `ui_p52_workspace_v32.css` — degrada **somente** `:visited` para `#DA291C` (estado **não coberto** por `FC1`/`FC2`) | `014d202bde612116` ≠ candidata → **vivo** | `P52-ACC3` | **SOBREVIVE** — gate **PASS** · ver achado **R-1** |
| **RA-M3b** | `ui_p52_workspace_v32.css` — degrada **somente** `:focus-visible` para `#DA291C` | `39df0964418b13a4` ≠ candidata → **vivo** | `P52-ACC3` | **SOBREVIVE** — gate **PASS** · ver achado **R-1** |

Nenhum foi no-op: cada um produziu HTML com hash distinto do da candidata. Todos restaurados
**byte-idênticos**. Registro, por honestidade metodológica, que uma **primeira** versão do meu
segundo mutante (`RA-M2`) foi detectada em parte por **erro incidental** — meu patch referenciava uma
variável fora de escopo. **Descartei-a** e refiz o mutante corretamente (`RA-M2b`), que é o que consta
acima: detecção semântica limpa, zero erros de página. O resultado defeituoso não foi contado como
prova.

### 10.4 · Detecção coincidente de `18 px`

Meu censo próprio de tinta na página da jornada do caso `Ctec` mediu **13 px puros / 18 px ±28** para
o marcador `◆`. O gate `P52-TGT4`, ao pegar `RA-M2b`, reportou **`18px de #3CB17E`**. Duas
implementações independentes de censo de pixel convergindo no mesmo número é evidência forte de que
**ambos os sensores medem a mesma coisa e ambos funcionam**.

---

## 11 · Repin dos gates protegidos

A primeira rodada integral reprovou `P50-GOV1`, `P50-SUF0` e `P50-SUF8` pelos pins de identidade das
superfícies §29.4 — e o relatório **registra esse FAIL** em vez de escondê-lo (§10.1), o que é o
comportamento evidence-first exigido.

| Exigência do §10 | Observado |
|---|---|
| identidade anterior preservada documentalmente | sim — transcrita no `PROTECTED` para `ui_target_v32.js` (`77b7b699…`), `ui_journey_v32.js` (`a30db1ce…`) e `tests_unset_ug.js` (`81bb577c…`) ✔ |
| identidade nova calculada dos bytes corretos | os três pins conferem com o `sha256sum` dos arquivos entregues; `P50-GOV1` passa na reexecução ✔ |
| autorização e razão explícitas | cita **nominalmente** o parecer `70904c11…` §10 e o prompt de errata `1882a6b3…` §5, com descrição item a item do que mudou ✔ |
| nenhuma asserção funcional removida | `tests_p50_core.js` mantém 35 gates `P50-*`; UNSET Geometry segue **13 PASS**; `P50-GOV1` continua fixando **byte a byte**, apenas no valor autorizado ✔ |
| nenhum pin atualizado para mascarar alteração fora do escopo | **provado byte a byte** — ver abaixo ✔ |
| mudanças em `ui_journey_v32.js` e `ui_p50_results_v32.js` restritas à publicação condicionada | **provado byte a byte** ✔ |
| `computeTargetProfile()`, `dataSufficiency()`, engine e fórmulas intactos | ✔ |

**Prova de boundary por reconstrução (a mais forte que este parecer produz).** Revertendo em
`ui_journey_v32.js` **apenas** a linha declarada de `journeyModel()` e seu bloco de comentário, e nada
mais, os bytes resultantes produzem:

```text
reconstruído : a30db1ce94bf06b14a46ab1d41881f2fe2561c8c85a531862843eabe6bc2c15d   (16.713 B)
declarado    : a30db1ce94bf06b1…                                    ← IDÊNTICO
```

O mesmo procedimento em `ui_p50_results_v32.js`, revertendo **só** a linha de `p50Matrix()`:

```text
reconstruído : 4c2965f7befdf2f907d6502d28f94ef8f8603cbf4a9cd3fdecc802d6e4a8b66e   (40.714 B)
declarado    : 4c2965f7befdf2f9…                                    ← IDÊNTICO
```

Isto **prova**, e não apenas indica, que nesses dois arquivos a errata alterou **exatamente uma
linha** cada — nada foi contrabandeado sob o repin.

Para `ui_target_v32.js` a prova é de granularidade de função, e é completa no que o §10 exige: o diff
toca **apenas** `tgtSection()`, `tgtRadarOverlay()`, `__uxTargetPrintHTML()` e as duas funções novas
(`tgtPublishable`, `tgtComparisonPublishable`). **`computeTargetProfile()` e `setTarget()` não
aparecem em nenhuma linha adicionada ou removida** e permanecem com o corpo congelado
(`suff = confirmed>=10 && stats.every(s=>s.n>=2)` — a moeda canônica intacta). A identidade anterior
`77b7b699…` é corroborada de forma independente pelo **relatório da errata anterior**, documento que
precede esta rodada e que foi objeto do parecer `70904c11…`.

`tgtComparisonPublishable(cur)` **não reimplementa** a regra: retorna `cur.suff === true`, consumindo
o `suff` produzido pela aritmética canônica. Não há contagem, limiar ou fórmula duplicada.

---

## 12 · Evidências históricas

| Exigência do §11 | Observado |
|---|---|
| inventário `evidence_p50`: 82/82 | **82** arquivos · inventário `ed6e7bbe…d197c` — **reproduz o valor declarado** ✔ |
| subconjunto regenerado: 44/44 | **44** · inventário `b7765491…5022` — **reproduz o declarado** ✔ |
| PRE = POST durante esta errata | árvore original: **PRE = POST**, byte a byte ✔ |
| nenhuma execução da auditoria escreve na árvore original | inventário PRE = MID = POST · **2.713 arquivos idênticos** ✔ |
| blobs históricos recuperáveis no HEAD | **44/44** recuperáveis por `git cat-file`; 82 em HEAD × 82 no disco; **zero apagados** ✔ |
| novas evidências P52 com identidade própria | `P52-TGT4-comparacao-indivisivel.json` `f1a64e5a…a0a1f9` e `P52-ACC3-contraste.json` `f1580050…e06f32` — **conferem com o §17.2** ✔ |
| o relatório declara a supersessão e cita `70904c11…` | sim, §11.1, nominalmente, com 4 citações do parecer ✔ |

### 12.1 · `P50_NO_EVIDENCE` — suprime escrita **sem** suprimir asserção (verificado por contraprova)

Não aceitei a alegação; medi:

```text
test:p50vis COM  P50_NO_EVIDENCE=1 : 27 PASS · 0 FAIL   ·  evidence_p50 82/82 BYTE-IDÊNTICOS
test:p50vis SEM  a variável        : 27 PASS · 0 FAIL   ·  15 arquivos REESCRITOS
```

A supressão é **do arquivo**, não da asserção: a contagem de asserções é **idêntica** nas duas
execuções. Isto encerra a dúvida do §11 e, ao mesmo tempo, **confirma de forma independente** que a
causa estrutural da `RESSALVA-3` (a suíte grava no próprio acervo) **permanece** — corretamente
declarada como dívida no §15.2 do relatório.

### 12.2 · Ressalva de proveniência anterior — **encerrada**

A `RESSALVA-3` do parecer `70904c11…` exigia declaração explícita antes de qualquer selagem. Os bytes
sustentam o encerramento: a declaração existe, é nominal, cita o parecer, os 44 arquivos permanecem
recuperáveis, nada foi apagado, e **esta errata não ampliou o dano** (82/82 idênticos, PRE = POST).
Encerro-a **pelos bytes observados**, não pelo texto do relatório.

---

## 13 · Assurance executada — e o que **não** foi executado

Tudo abaixo rodou **na cópia temporária**, cada linha com **exit code próprio**. Zero timeouts, zero
interrupções, zero SKIP contado como PASS, zero browser ausente.

| Suíte | Comando | Observado | Baseline | Exit |
|---|---|---|---|---|
| Build determinístico **A** | `python3 build_v32_html.py` | `fb906462484ff3d3…` — **reproduz a candidata byte a byte** | — | 0 |
| Engine | `npm run test:engine` | **105 PASS · 0 FAIL** | 105 | 0 |
| UI 3.1 | `npm run test:ui31` | **19 PASS · 0 FAIL** | 19 | 0 |
| UI 3.2 | `npm run test:ui32` | **25 PASS · 0 FAIL** | 25 | 0 |
| UI 3.3.1 | `npm run test:ui33` | **11 PASS · 0 FAIL** | 11 | 0 |
| UI 3.3.2 (PDF) | `npm run test:ui332` | **23 PASS · 0 FAIL** | 23 | 0 |
| UI 3.3.3 | `npm run test:ui333` | **26 PASS · 0 FAIL** | 26 | 0 |
| UX 4.1 | `npm run test:ux41` | **56 PASS · 0 FAIL** | 56 | 0 |
| Target 4.3.1 | `npm run test:target` | **30 PASS · 0 FAIL** | 30 | 0 |
| Refinement 4.4 | `npm run test:ref` | **28 PASS · 0 FAIL** | 28 | 0 |
| Journey 4.5 | `npm run test:journey` | **31 PASS · 0 FAIL** | 31 | 0 |
| Icons 4.6 | `npm run test:icons46` | **12 PASS · 0 FAIL** | 12 | 0 |
| Session 4.8 | `npm run test:session` | **97 PASS · 0 FAIL** | 97 | 0 |
| UNSET Geometry | `npm run test:unset` | **13 PASS · 0 FAIL** | 13 | 0 |
| P50 core + P51 | `npm run test:p50` | **64 PASS · 0 FAIL** | 64 | 0 |
| P50 Chromium + P51 | `npm run test:p50vis` | **27 PASS · 0 FAIL** | 27 | 0 |
| P52 layout | `npm run test:p52` | **35 PASS · 0 FAIL** | 35 | 0 |
| P52 Chromium (inclui `P52-TGT4` e `P52-ACC3`) | `npm run test:p52vis` | **44 PASS · 0 FAIL** | 44 | 0 |
| M41 (V3.1.3) | `npm run test:m41` | payload `9794b267…d4365b` · sanidade OK · 9 cenários | idem | 0 |
| Visual (Playwright) | `npm run test:visual` | **67 passed · 0 failed · 37 skipped** | 67/0/37 | 0 |
| Mutação P52 (10 dedicados) | `P52_MUT_ONLY=…` | **10/10 detectados** | 10 | 0 |
| Mutação P52 (campanha completa) | `node tests_p52_mutants.js` | **72/72 detectados pelo gate e motivo esperados** | 72 | 0 |
| Meus mutantes próprios | harness próprio | 2 detectados semanticamente · 2 sobreviventes (achado **R-1**) | — | — |
| Build determinístico **B** | `python3 build_v32_html.py` | `fb906462484ff3d3…` — **A = B = candidata** | — | 0 |
| Manifesto | oráculo independente | **374/374** · 0 dup · 0 ausente · 0 excedente · 0 autorref. | 374 | 0 |

**Todas as contagens congeladas do baseline 4.8.0.7 foram conferidas uma a uma. Nenhuma foi
reduzida.** As variações em relação ao parecer anterior são **para mais** e nominadas: P52 Chromium
43 → **44** (gate novo `P52-TGT4`); mutação 62 → **72** (dez mutantes da errata final).

### 13.1 · Declarado como **NÃO executado** — nada disto recebe PASS

1. **Browser canônico nominal.** `/opt/google/chrome/chrome` **não existe** nesta máquina. Usei o
   Chromium gerenciado pelo Playwright (`chromium-1234`), o mesmo motor da evidência da candidata e
   do parecer anterior — a comparação é homogênea, mas **Chrome estável, Firefox e Safari não foram
   exercitados**.
2. **Leitor de tela real** (NVDA/JAWS/VoiceOver): **não executado**. A árvore acessível foi obtida do
   `Accessibility.getFullAXTree` do Chromium — que é a árvore real do motor, não uma reconstrução —
   mas nenhum AT real foi acionado.
3. **Zoom real de navegador** (110/125/200%): não executado nesta reauditoria.
4. **Diálogo nativo de impressão** com interação humana: não executável em headless.
5. **Produção em `127.0.0.1:1337`**: **não exercitada, por decisão**; zero requisições.
6. **Percurso comercial completo clique a clique**: não percorrido integralmente. O editor de
   cenário-alvo e o editor de contexto tecnológico **foram** exercitados por interação real.
7. **Estado `:visited` navegado de verdade**: não exercitado (não há navegação externa sob `file://`).
   Verifiquei-o pela **regra CSS** presente no HTML construído, que fixa o **mesmo token** do estado
   normal — logo a mesma razão de 4,938:1.

---

## 14 · Achados e severidades

Nenhum achado atinge o limiar de FAIL do §13. Registro três ressalvas e nenhum blocker.

### R-1 · BAIXA (cobertura de gate) — `P52-ACC3` não mede estados de pseudo-classe

**O que os bytes dizem.** O gate mede o `getComputedStyle` **do estado padrão** de cada nó. Não
exercita `:hover`, `:focus-visible` nem `:visited`. Comprovei-o com dois mutantes próprios, ambos
materialmente vivos:

```text
RA-M3   .p52-sup-link:visited        → #DA291C (3,747:1)   →  P52-ACC3  PASS   (SOBREVIVE)
RA-M3b  .p52-sup-link:focus-visible  → #DA291C (3,747:1)   →  P52-ACC3  PASS   (SOBREVIVE)
```

**Por que não é blocker.** (a) O **produto entregue está conforme** nos estados que medi de verdade:
normal 4,938:1, hover 4,938:1, focus-visible com texto inalterado e contorno a 16,717:1, e `:visited`
fixado no **mesmo token** do normal pela regra do HTML construído. (b) `P52-ACC3` **não é vacuoso**:
tem guarda nominal de cobertura, mínimo declarado de nós, mede 38 nós no caso novo — 4 deles
`sup-link` — e o mutante entregue `P52-FC3` prova que a guarda dispara. O que falta é **profundidade
de estado**, não substância.

**Impacto real.** Uma regressão futura que degrade **apenas** `:visited` ou **apenas**
`:focus-visible` não seria detectada pela suíte. Recomendo, como item de backlog e **não** como
condição de selagem, estender `P52-ACC3` a medir os três estados.

### R-2 · BAIXA (documental) — o §8.2 do relatório erra sobre os bytes da própria evidência

O relatório afirma: *“`grep p52-sup-link` na evidência do gate: **4 ocorrências** (antes: zero)”*.
A evidência real, `docs_phase5/evidence_p52/P52-ACC3-contraste.json`, contém **zero** ocorrências
dessa literal — o bloco `supLinks` identifica os nós pelo **texto** (`"Página oficial ↗"`), não pelo
seletor.

**A substância da alegação é verdadeira e eu a verifiquei:** o caso `resultados-contexto` registra
**4** entradas `supLinks`, todas com `fg [245,65,51]`, `bg [21,21,23]`, `13.5px`, `underline` e
`razao 4.938`; os outros três casos registram `0`. O ponto cego **foi** fechado. O erro é de
**redação sobre os bytes**, da mesma classe das contagens que o próprio relatório corrigiu no §12 —
corrigível sem tocar código.

### R-3 · BAIXA (observação de escopo, comportamento **pré-existente**) — deltas por prática na tela

Sob gate **fechado**, a lista *“Práticas-alvo definidas”* da **tela** continua exibindo, para cada
prática cujo baseline **está** confirmado, o nível numérico dos dois lados e um delta local:

```text
TELA  (gate FECHADO, caso B2)
   Direcionamento e objetivos   Direcionamento informal · 1.7 → Objetivos medidos e revisados · 5.0  +3.3
   Capacidade do time           Dependência de poucas pessoas · 1.7 → Capacidade planejada · 5.0     +3.3
   Superfície externa           Baseline atual não validado — delta local n/d. → Monitoramento · 3.3

PAPEL (mesmo estado)  — apenas o texto da opção, ZERO números, ZERO deltas
   Direcionamento e objetivos   Direcionamento informal → Objetivos medidos e revisados
```

**Como classifico.** Isto **não** é publicação de score por domínio, agregado ou nome de estágio — é
a **declaração explícita do proprietário sobre uma prática**, no eixo UI-015/UI-016a, que a regra
normativa **manda preservar** (“as práticas-alvo declaradas continuam listadas, uma a uma”), e que a
própria mensagem neutra anuncia. Quando não há baseline confirmado, o produto imprime honestamente
`delta local n/d`. O código que a produz (`ovList`) **não foi tocado por esta errata** e não foi
apontado pelo parecer anterior.

Registro-a mesmo assim porque o §6.2 da instrução lista “zero gaps, setas ou deltas” entre os canais
a confirmar, e a leitura estrita alcança este item. **Não é blocker**: nenhum valor de domínio,
agregado ou estágio é publicado, o papel está limpo, e o rótulo é local e verdadeiro. É matéria de
**decisão do proprietário** sobre a redação da regra, não defeito de implementação.

### Achados NÃO confirmados (verificados e descartados)

- **`ALTO-1` residual em qualquer superfície** — procurei em quatro canais, em cinco estados
  distintos (A, B, B2, C, D), incluindo o caminho da UI real: **zero**.
- **Jornada / Camada 5** — zero marcadores sob gate fechado, corretos sob gate aberto. **Não é achado.**
- **Estado canônico contaminado** — respostas, `suff`, scores por domínio, `overall` e findings
  **idênticos** antes e depois de declarar alvos e antes e depois de imprimir. **Não é achado.**
- **Derivados serializados** — `captureCanonicalInputs()` traz **apenas** `assessment`, `priorities`,
  `technologyLandscape`, `targetProfile`, `operationalRefinement`; zero campos derivados. **Não é achado.**
- **Tecnologia alterando score** — caso C com e sem contexto declarado: valores **idênticos**. **Não é achado.**
- **Repin mascarando mudança fora do escopo** — refutado por reconstrução byte-exata em dois arquivos
  e por granularidade de função no terceiro. **Não é achado.**
- **Evidência histórica sobrescrita por esta errata** — 82/82 idênticos, PRE = POST. **Não é achado.**

---

## 15 · Vereditos

### 15.1 · Funcional do produto — **PASS**

`ALTO-1` está **fechado e provado**. A propriedade auditada —
*Current × Target só publica valores se o perfil atual é publicável* — sustenta-se em cinco estados
independentes, produzidos com **meus** vetores e **meu** oráculo, inclusive um construído
adversarialmente (`B2`) e um alcançado **pela UI real de workshop**. No caso decisivo B, com
`tgt.suff = true` e um alvo bruto de `2.8 / 5 · “Definido”` disponível para vazar, a candidata publica
**zero** score, **zero** estágio, **zero** valor por domínio, **zero** delta, **zero** seta, **zero**
vértice de polígono, **zero** texto correspondente na árvore acessível e **zero pixel** de `#3CB17E`
— em tela, em papel e no PDF A4 real. As duas superfícies adicionais (régua da jornada e Camada 5)
estão igualmente fechadas, com controle positivo confirmando que voltam **corretas** com o gate
aberto. O cenário-alvo permanece **salvo, editável e recuperável**, e o estado canônico é
**intocado**.

### 15.2 · Contraste e acessibilidade — **PASS**

`MÉDIO-2` está **fechado e provado**. 28 nós em 7 viewports a **4,938:1**, reproduzindo com
aritmética própria o valor declarado; pista **não cromática permanente**; foco por teclado real com
`:focus-visible` e contorno a **16,717:1**; `href`, `target` e `rel` intactos; **zero** requisição
externa; **zero** abertura automática; alvo de toque de 24 px preservado.

### 15.3 · Gates e mutantes — **PASS COM RESSALVA NÃO BLOQUEANTE**

`P52-TGT4` é novo, não vacuoso, cobre os quatro quadrantes em quatro canais, usa oráculo independente
da implementação, **falha** por ausência de seção, por sensor cego e por ausência de poppler, e traz
controle positivo exigente. Os dez mutantes dedicados foram **10/10 detectados** pelo gate e pelo
motivo semanticamente correspondentes, sem erro incidental, com restauração byte-idêntica conferida
por mim; a campanha completa fecha **72/72**. Dois dos meus quatro mutantes próprios foram detectados
semanticamente; **dois sobreviveram** e revelam o achado **R-1** — limitação de **profundidade de
estado** do `P52-ACC3`, não vacuidade, e sem defeito correspondente no produto entregue.

### 15.4 · Proveniência — **PASS**

Inventário `evidence_p50` **82/82**, com o hash do inventário reproduzindo exatamente o declarado;
subconjunto dos **44** idem; **PRE = POST**; **44/44** blobs históricos recuperáveis no HEAD; zero
arquivos apagados; evidência nova da P52 com identidade própria conferida. A supressão de escrita foi
verificada por **contraprova** e não enfraquece asserção alguma. A `RESSALVA-3` do parecer anterior
está **encerrada pelos bytes**; a causa estrutural que a originou permanece corretamente declarada
como dívida de backlog.

### 15.5 · Elegibilidade para selagem — **ELEGÍVEL**, quanto ao escopo desta errata

Nenhum dos gatilhos de FAIL do §13 se verifica: o caso B não publica metade alguma; o alvo não
aparece na jornada nem por domínio sob gate fechado; nada permanece na árvore acessível ou na tinta
do PDF; tela e papel **não** divergem; o contraste não fica abaixo de 4,5:1; a fixture de contraste
**monta** os links; nenhum gate ou mutante passa por vacuidade; o repin **não** mascara mudança fora
do escopo; nenhuma evidência histórica foi novamente sobrescrita; engine, M41, build e manifesto
**não** divergem; e o estado canônico **não** é alterado pela neutralização.

As três ressalvas (**R-1**, **R-2**, **R-3**) são **não bloqueantes** e nenhuma exige tocar código de
produção: R-1 é extensão de gate (backlog), R-2 é uma frase a corrigir no relatório, R-3 é uma
decisão de redação da regra pelo proprietário.

**Veredito consolidado: PASS COM RESSALVAS NÃO BLOQUEANTES.**

Registro com a mesma ênfase, por justiça com o trabalho auditado: a errata **corrigiu o que foi
mandado corrigir**, encontrou e fechou **duas superfícies da mesma classe que o parecer anterior não
exercitou**, registrou seu próprio FAIL de primeira execução, documentou o repin com identidade
anterior transcrita, declarou a supersessão de proveniência que lhe fora exigida, e não reduziu
**nenhuma** contagem congelada.

**Não declaro fase concluída, congelada, liberada, selada ou promovida.** Essa declaração é ato
exclusivo do proprietário.

---

## 16 · Inventário pós e prova de preservação

```text
inventário PRE  : 2.713 arquivos · add5a37788253a220963bcb582d0dd49fc55d9703c7f33c1b01e5ef0275f1e00
inventário MID  : 2.713 arquivos · add5a37788253a220963bcb582d0dd49fc55d9703c7f33c1b01e5ef0275f1e00
inventário POST : 2.713 arquivos · add5a37788253a220963bcb582d0dd49fc55d9703c7f33c1b01e5ef0275f1e00
diff PRE × POST : VAZIO  —  ÁRVORE ORIGINAL PRESERVADA BYTE A BYTE
```

Estado Git ao final, idêntico ao do preflight:

```text
HEAD        : d3886812718e7ad9c5024880067133fbddf2fc4d   (inalterado)
branch      : feat/phase5-5-2-desktop-workspace                            (inalterado)
staged      : 0        delta -uall : 376        tags : 1 (v3.2-phase5.1, preexistente)
commit : zero   push : zero   PR : zero   merge : zero   tag nova : zero
freeze : zero   release : zero   deployment : zero   fase seguinte : NÃO iniciada
preview/produção substituídos : zero   requisições a 127.0.0.1:1337 : zero
```

Toda execução capaz de escrever ocorreu em `/tmp/p52final/repo`, `/tmp/p52final/own` e diretórios
temporários. Nenhuma restauração da árvore original foi necessária, porque **nenhuma escrita ocorreu
ali**. O parecer e o sidecar foram gravados **fora** do repositório.

O waiter órfão `PID 133726` **permanece exatamente como estava**: não foi morto, não foi alterado e
não escreveu nada durante esta auditoria.

---

## 17 · Identidade deste parecer

Um arquivo não pode conter o próprio SHA-256. Ele está no sidecar
`AUDITORIA_INDEPENDENTE_REAUDITORIA_FINAL_TARGET_PHASE_5_2.md.sha256`, gravado ao lado deste arquivo
e conferível por `sha256sum -c`. Os demais atributos:

```text
SHA-256  : ver sidecar
Bytes    : 47218
Linhas   : 766
Encoding : UTF-8
BOM      : ausente
Bytes CR : 0
```

FIM DO PARECER.
