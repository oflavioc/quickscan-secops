# REGISTRO DE ACEITE E SELAGEM DA PHASE 5.2 — ATO DO PROPRIETÁRIO

**Objeto:** Phase 5.2 (Desktop Workspace & Results IA), incluindo a errata final de publicação
*Perfil atual × Cenário-alvo* (`ALTO-1`) e o contraste do link de apoio (`MÉDIO-2`).

**Proprietário e auditor do projeto:** Flávio Costa.
**Data do ato:** 2026-08-24.
**Branch da candidata:** `feat/phase5-5-2-desktop-workspace`.
**HEAD sobre o qual a candidata foi auditada:** `d3886812718e7ad9c5024880067133fbddf2fc4d`.

Este documento registra um **ato do proprietário**. Não é um parecer de auditoria, não substitui o
parecer independente e não reescreve nenhum byte dele.

---

## 1 · Veredito independente aceito

A reauditoria independente final e estreita da Phase 5.2 emitiu:

```text
Veredito consolidado: PASS COM RESSALVAS NÃO BLOQUEANTES
```

Vereditos parciais do parecer:

| Eixo | Veredito |
|---|---|
| Funcional do produto (§15.1) | **PASS** |
| Contraste e acessibilidade (§15.2) | **PASS** |
| Gates e mutantes (§15.3) | **PASS COM RESSALVA NÃO BLOQUEANTE** |
| Proveniência (§15.4) | **PASS** |
| Elegibilidade para selagem (§15.5) | **ELEGÍVEL**, quanto ao escopo desta errata |

Zero blockers. Nenhum achado atingiu o limiar de FAIL.

O parecer declara expressamente, em §15.5: *“Não declaro fase concluída, congelada, liberada, selada
ou promovida. Essa declaração é ato exclusivo do proprietário.”* O presente documento é esse ato,
restrito a **aceite e selagem**, sem freeze de fase, sem tag, sem release e sem deployment.

---

## 2 · Identidade dos bytes auditados

### 2.1 · Parecer independente

```text
arquivo  : docs_phase5/AUDITORIA_INDEPENDENTE_REAUDITORIA_FINAL_TARGET_PHASE_5_2.md
SHA-256  : bcddf0b102b5df39c4f339bef30a219e55acff28f45cf9576ef70e85afd66cc2
bytes    : 47218
linhas   : 766
encoding : UTF-8 · BOM ausente · 0 bytes CR
sidecar  : AUDITORIA_INDEPENDENTE_REAUDITORIA_FINAL_TARGET_PHASE_5_2.md.sha256
           SHA-256 4bae6cf92ef3d4024c1947de943587c7653f96f68fe4e14ec12f5366992716f3
```

Importado para `docs_phase5/` por **cópia byte-idêntica** verificada com `cmp` contra a origem, e
reconferido por `sha256sum -c` do próprio sidecar no diretório de destino: **OK**.

### 2.2 · Artefatos auditados — identidades reconfirmadas em disco antes da selagem

| Artefato | SHA-256 | Bytes | Veredito |
|---|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` | `fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79` | 963.373 | ✔ confere |
| `engine_v32.js` | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | 57.261 | ✔ confere · **byte-idêntico ao baseline congelado** |
| payload funcional M41 | `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` | — | ✔ canônico |
| `docs_phase5/MANIFEST_PHASE5_P52.sha256` (auditado) | `22334a2bfec6903eda16e12cd2e9e2f441468fed04e2bd124ebcf43321b95801` | 50.219 | ✔ confere · 423 linhas |
| `docs_phase5/PHASE_5_2_FINAL_TARGET_PUBLICATION_ERRATA_REPORT.md` | `f465afac35c5b161cd4475e4ef99f00de814c1f957a12237c568052638238b49` | 48.021 | ✔ confere · 787 linhas |
| parecer anterior (referenciado, não importado) | `70904c113096d9a95617a80daf9eb7df28d27c1a0e0837f510fbffaa53b04120` | 55.571 | referência de proveniência |

O manifesto auditado (`22334a2b…`) foi verificado integralmente a partir dos arquivos em disco antes
de qualquer alteração: **374/374 OK, 0 FAILED**. Ele é **superseded** pelo manifesto regenerado nesta
selagem, que passa a incluir os documentos de governança autorizados descritos no §5.

**Invariante 1 preservada:** o engine permanece byte-idêntico ao baseline congelado. Nenhum byte
executável da candidata foi alterado durante a integração.

---

## 3 · Aceitação formal das ressalvas

O proprietário **aceita formalmente** as três ressalvas **R-1**, **R-2** e **R-3**, todas de
severidade BAIXA e todas classificadas pelo parecer como **não bloqueantes**.

### 3.1 · R-1 — `P52-ACC3` não mede estados de pseudo-classe

**Declaração vinculante do proprietário:** R-1 permanece registrada como **dívida de endurecimento
de gates**, e **não** como defeito do produto.

Fundamento, conforme apurado pelo parecer:

- O produto entregue **está conforme** nos estados efetivamente medidos: normal 4,938:1, hover
  4,938:1, `focus-visible` com texto inalterado e contorno a 16,717:1, e `:visited` fixado no
  **mesmo token** do estado normal pela regra do HTML construído.
- `P52-ACC3` **não é vacuoso**: possui guarda nominal de cobertura, mínimo declarado de nós, mede 38
  nós no caso novo (4 deles `sup-link`), e o mutante entregue `P52-FC3` prova que a guarda dispara.
- O que falta é **profundidade de estado**, não substância.

**Item de backlog aceito, não condição de selagem:** estender `P52-ACC3` a medir os três estados
(`:hover`, `:focus-visible`, `:visited`), de modo que uma regressão futura que degrade apenas um
estado seja detectada pela suíte. Os mutantes `RA-M3` e `RA-M3b` do parecer ficam registrados como
casos-alvo dessa extensão.

### 3.2 · R-2 — correção factual (sem reescrever o parecer)

**Aceita.** O erro é de **redação sobre os bytes**, no §8.2 do relatório de implementação, e não
afeta a substância da alegação nem o comportamento do produto.

**Correção factual registrada aqui, apurada de forma independente pelo proprietário a partir dos
bytes em disco:**

```text
AFIRMAÇÃO ERRADA  (PHASE_5_2_FINAL_TARGET_PUBLICATION_ERRATA_REPORT.md, linha 384)
  "grep p52-sup-link na evidência do gate: 4 ocorrências (antes: zero)."

FATO APURADO  (docs_phase5/evidence_p52/P52-ACC3-contraste.json · 1.402 bytes)
  ocorrências da literal "p52-sup-link" no arquivo ....... 0   (não 4)
  entradas no bloco supLinks, caso "resultados-contexto" .. 4
  entradas nos casos "resultados", "resultados-bloqueado"
    e "pergunta" ........................................... 0 cada
  identificação dos nós ................ pelo TEXTO ("Página oficial ↗"),
                                         não pelo seletor CSS
  cada uma das 4 entradas ..... fg [245,65,51] · bg [21,21,23] · 13.5px
                                deco "underline" · razão 4.938
```

**Substância confirmada:** o ponto cego **foi** fechado — o gate registra 4 nós de link de apoio no
caso com contexto declarado, todos acima de 4,5:1, com afordância não-cromática. A frase do relatório
descreve corretamente o **efeito** e incorretamente o **método de contagem**.

**Nenhum byte do parecer independente foi alterado.** Nenhum byte do relatório de implementação foi
alterado. A correção vive **exclusivamente** neste registro, que supersede a frase da linha 384 do
relatório sem apagá-la — mesma técnica de errata documental que o próprio relatório aplicou em seu
§12.

### 3.3 · R-3 — interpretação vinculante do proprietário

**Aceita**, com a seguinte **interpretação vinculante**, que passa a ser a leitura normativa da regra
para a Phase 5.2 e subsequentes:

> O gate fechado impede a publicação de **scores consolidados**, **scores por domínio** e
> **comparações Current × Target** em superfícies executivas e no relatório/PDF.
>
> A **lista detalhada de práticas respondidas** pode manter o **nível local de cada resposta**, para
> rastreabilidade do operador, **sem que esse nível seja apresentado ou interpretado como maturidade
> consolidada do domínio**.

**Consequências normativas desta interpretação:**

1. O comportamento observado pelo parecer em §14/R-3 — a lista *“Práticas-alvo definidas”* exibindo,
   sob gate fechado, o nível local de cada prática cujo baseline **está** confirmado, com delta
   local — é **conforme**, e não constitui desvio.
2. O código que a produz (`ovList`) **não foi tocado** por esta errata e **não deve ser alterado**
   em razão de R-3.
3. Permanecem **vedados** sob gate fechado, em tela, árvore acessível, papel e PDF: score agregado,
   score por domínio, nome de estágio, polígono, régua da jornada com marcadores e qualquer
   comparação Current × Target — exatamente como `ALTO-1` estabeleceu e o parecer verificou em cinco
   estados independentes (A, B, B2, C, D).
4. A honestidade do rótulo local permanece obrigatória: sem baseline confirmado, o produto imprime
   `delta local n/d`, nunca um número.
5. O papel/PDF permanece **sem números e sem deltas** na lista de práticas-alvo — a preservação do
   nível local é uma afordância **de tela**, para o operador.

Esta interpretação resolve, por decisão do proprietário, a tensão de redação que o parecer apontou
entre a regra normativa (“as práticas-alvo declaradas continuam listadas, uma a uma”, eixo
UI-015/UI-016a) e a leitura estrita do §6.2 da instrução de errata (“zero gaps, setas ou deltas”).
Prevalece a distinção entre **nível local declarado de uma prática** e **maturidade consolidada de
domínio**: apenas a segunda é matéria do gate de suficiência.

**Invariante 3 preservada:** a UI continua não sendo dona da decisão de suficiência; a moeda canônica
permanece UI-009A.

---

## 4 · Higienização de processos antes da integração

O *waiter* órfão registrado no §4.1 do parecer foi caracterizado materialmente e encerrado **antes**
da integração, por autorização expressa do proprietário:

```text
PID 133726 · PPID 364 (/init — órfão) · PGID 133726 · estado Ss
  exe : /usr/bin/bash
  cwd : /mnt/c/Projetos/QuickScan-SOC-CMM/phase5
  cmd : bash -c 'until grep -q ALLDONE /tmp/outE.txt && grep -q DONE /tmp/mutE/_mut.txt;
                 do sleep 20; done'
  descendente único : sleep 20 (PID 1054349, reciclado a cada 20 s)

Confirmado: laço residual de espera — apenas grep + sleep. Não gera, não muta,
não constrói e não escreve nada.

SIGTERM enviado ao laço e ao descendente → encerrado em ~2 s.
SIGKILL : NÃO EXECUTADO (desnecessário — SIGTERM bastou).
```

**Varredura pós-encerramento:** nenhum processo de testes P50/P52, campanha de mutação, build
(`build_v32_html.py`), Playwright, Chromium, M41, Poppler (`pdftoppm`/`pdftotext`) ou geração de
evidências permanece ativo. Os únicos processos remanescentes são sessões do próprio agente e
serviços do sistema operacional.

---

## 5 · Documentos de governança incorporados nesta selagem

| Documento | Natureza |
|---|---|
| `docs_phase5/AUDITORIA_INDEPENDENTE_REAUDITORIA_FINAL_TARGET_PHASE_5_2.md` | parecer independente, importado byte-idêntico |
| `docs_phase5/AUDITORIA_INDEPENDENTE_REAUDITORIA_FINAL_TARGET_PHASE_5_2.md.sha256` | sidecar de identidade do parecer |
| `docs_phase5/PHASE_5_2_ACCEPTANCE_AND_SEALING_RECORD.md` | este registro de aceite e selagem |

O manifesto `docs_phase5/MANIFEST_PHASE5_P52.sha256` é **regenerado por último**, incorporando estes
documentos e mantendo as exclusões nominais já declaradas: **ele próprio** (auto-referência) e
**`AGENTS.md`** (não rastreado, preexistente no worktree, alheio a esta fase).

---

## 6 · Limites explícitos deste ato

O proprietário autoriza **selagem e integração controlada**. Nesta rodada **NÃO** são realizados:

```text
tag                      : NÃO
GitHub Release           : NÃO
pacote final             : NÃO
deployment               : NÃO
freeze de fase           : NÃO
início da fase seguinte  : NÃO
alteração de produção 127.0.0.1:1337 · preview 1338 · Tailscale Serve · Funnel : NÃO
alteração de código, CSS, engine, regras de negócio, fixtures ou gates          : NÃO
```

A integração é **estritamente documental e de versionamento**: nenhum byte executável da candidata
auditada é modificado. Qualquer divergência de byte executável em relação à candidata auditada é
condição de PARADA.

FIM DO REGISTRO.
