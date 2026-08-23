# PHASE 5.1 — REGISTRO DE ACEITE E SELAGEM PARA INTEGRAÇÃO

Registro único de aceite da **Phase 5.1 — UAT, Relatório Executivo, Adendo Documental e Errata**,
por ato do proprietário. Este documento **não reescreve a história**: o relatório da candidata, os
pareceres independentes e a errata permanecem exatamente como estão, e nada aqui altera bytes de
runtime.

Data do ato: 2026-08-22 · Proprietário/auditor do projeto: Flávio Costa

---

## 1 · Identidades seladas

### Governança normativa

```text
spec normativa            specs/PHASE_5_0_REV_B.md
spec SHA-256              4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b
promovida em              2026-08-19 · docs_phase5/REV_B_PROMOTION_RECORD.md
Phase 5.0 aberta em       2026-08-19 · docs_phase5/REV_B_PHASE_OPENING_RECORD.md
Phase 5.0 encerrada em    2026-08-21 · docs_phase5/PHASE_5_0_CLOSURE_ACCEPTANCE.md
```

### Candidata da Phase 5.1

```text
baseline de ENTRADA da 5.1 (HTML)     c40d97358beaf52f286209b93143f74f4665011a1229f65015c2e6561efce09f
                                      698.613 bytes
HTML candidato pós-adendo             e8857a9da789367b6a20c4c0aa848cc3db550f99d243f052d12ccd1aa55b8513
                                      743.908 bytes  (superado pela errata)
HTML candidato FINAL (pós-errata)     12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9
HTML candidato FINAL (bytes)          744.179
engine_v32.js                         9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
payload funcional M41                 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
build_v32_html.py                     bce37fef5e4722e6e6215186f33c9f0af030bb03e706504a30ca80fededc07bc
package.json                          1c8d844d972ccb4a691d8c5b3c3d544d5b514bef68eb5187dbe60121164304c7
package-lock.json                     abe535af33ccd636a022c014af038cb5aa20294a23328595722246b1ca24f75f
relatório da candidata                e0608b0ba95a4acabbf9d7aebf11e1fdccfcc21fe8287c7370c4691529c54851
USER_GUIDE.md                         98d97a2a3bf5f928a5f4a8e6995cb1b51e77e1a77897ec23aaabad01ccbd181d
README.md                             b7924ce0f142ad773e7159f0dd726a26aec1122214c87039ff31b3a5a6322a64
```

O **engine** e o **payload funcional M41** permanecem byte-idênticos ao core congelado 4.8.0.7:
a Phase 5.0 e a Phase 5.1 inteiras transcorreram sem tocá-los.

### Pareceres independentes importados

```text
docs_phase5/AUDITORIA_INDEPENDENTE_PHASE_5_1_UAT_REPORT.md
SHA-256   6320eac04eae61d6078b2d59404e17423eea133456a89d855bdae73b32c1ff82
52.613 bytes · 880 linhas · UTF-8 sem BOM · zero CRLF
veredito  FAIL — 1 blocker (B1) · ressalvas R1 a R6

docs_phase5/AUDITORIA_INDEPENDENTE_REAUDITORIA_PHASE_5_1_ERRATA.md
SHA-256   5deced7ce81fa3af5cc87fda70e65e4630fee15434e4eb5bc97e56d43643da5f
48.721 bytes · 812 linhas · UTF-8 sem BOM · zero CRLF
veredito  PASS COM RESSALVAS NÃO BLOQUEANTES — B1 FECHADO · R1, R2 e R3 FECHADAS
```

Ambos os pareceres foram importados **byte a byte**, sem edição, e conferidos por `cmp` contra a
origem externa.

**B1 — FECHADO.** O blocker do primeiro parecer (`buildPrintReport()` exibia o score arredondado mas
nomeava o estágio a partir da média bruta, produzindo contradição intradocumento) foi corrigido pela
errata e o fechamento foi confirmado por **reauditoria independente**, com oráculo próprio de tabela
de estágios literal, estados alcançáveis pelo produto nas cinco fronteiras, os dois casos do parecer
e um **PDF A4 real** do build pós-errata.

**R1, R2 e R3 — FECHADAS.** Gate de sinal do gap (`P51-VIS3`), correção factual da fórmula do score
(`USER_GUIDE.md` §8) e da ordem do relatório (`USER_GUIDE.md` §12), com gate factual `P51-DOC13`.

---

## 2 · Decisão do proprietário

> Aprovo formalmente a integração da Quickscan Phase 5.1 com base no parecer independente original e
> na reauditoria independente da errata. Aceito como não bloqueantes as ressalvas RS-1 a RS-6
> registradas em `AUDITORIA_INDEPENDENTE_REAUDITORIA_PHASE_5_1_ERRATA.md`. Autorizo preparar e
> executar, em fluxo único, a selagem documental, a importação dos pareceres, o registro externo de
> aceite, a atualização do manifesto, o staging nominal, o commit, o push da branch, a abertura do
> Pull Request, o merge controlado e o smoke pós-merge. Não autorizo ainda a promoção para produção,
> substituição do serviço em `127.0.0.1:1337`, alteração do Tailscale Serve, criação de tag, criação
> de GitHub Release ou deployment. `AGENTS.md` deve permanecer fora da entrega e não pode ser
> incluído no staging. A produção V3.2 atual deve permanecer intacta até minha autorização explícita
> posterior.

---

## 3 · Ressalvas aceitas

Aceitas como **não bloqueantes**. Nenhuma exige correção nesta integração; nenhuma altera runtime.

| # | ressalva | classificação |
|---|---|---|
| **RS-1** | `§0.7` e `§12` de `PHASE_5_1_UAT_REPORT.md` enumeram os scores dos cenários de PDF pré-errata como `n/d, 1.0, 1.2, 0.0, 5.0`; os artefatos registram `n/d`, `0.0` e `3.3` (×4), e são **seis** cenários, não cinco. A conclusão sustentada pelo parágrafo permanece verdadeira: a reauditoria provou, por enumeração de 537.824 combinações, que **só** scores exibidos em `0.5 · 1.5 · 2.5 · 3.5 · 4.5` podem mudar de estágio com a errata | imprecisão documental, sem impacto material |
| **RS-2** | `§9.2` de `PHASE_5_1_UAT_REPORT.md` mantém a narração de N4 que `§13.1` corrige. Verificado materialmente que o preflight de export recusa antes de gerar arquivo (`Blob=0`, `ObjectURL=0`, `anchor.click=0`) | coerência interna de redação |
| **RS-3** | `USER_GUIDE.md` §12 não lista três seções condicionais que o produto emite (`#pr-entitlements`, `#pr-signals`, `#pr-arch`). A ordem relativa das dez seções documentadas foi medida em cenário maximal e é **idêntica** à do manual — não há inversão factual | editorial, sem inversão factual |
| **RS-4** | consulta somente-leitura ao **Tailscale Serve/Funnel** não pôde ser executada: binário, socket e serviço ausentes do ambiente da reauditoria. Declarada **não executada**, não reprovada | ambiental · ver §5 |
| **RS-5** | versão nominal de Chromium **151.0.7922.34** contra o `141.0.7390.37` histórico, sem regressão observada (Chromium 27/27, visual 67/0/37). É a **R6** do parecer original, já aceita | ambiental, já aceita |
| **RS-6** | nota metodológica: o oráculo de nome de estágio de `P51-RPT6` vem do runtime, provando coerência entre superfícies e não a correção dos limiares — adequado ao escopo do B1; a correção dos limiares é coberta por `P51-RPT3` e pela tabela literal independente da reauditoria, conferida em 501/501 pontos | observação de método |

Permanecem também as ressalvas já aceitas em fases anteriores e fora do escopo da Phase 5.1
(**N4** da camada de Target congelada, com a orientação operacional de
`PHASE_5_0_CLOSURE_ACCEPTANCE.md` §4; dependência de Git do `P50-PR1`; comparação por prefixo do
`UG8`), não reabertas.

---

## 4 · Proveniência da reauditoria e separação de papéis

A reauditoria da errata foi conduzida por **sessão distinta** da que implementou a Phase 5.1 e a
errata, com declaração explícita de independência registrada em `§1` do parecer. Os oráculos foram
próprios — tabela de estágios e tabela de scores declaradas como literais e conferidas contra o
runtime —, e o handoff do implementador não foi aceito como evidência autossuficiente.

Fica registrado, por transparência, que **a execução desta integração foi conduzida pela mesma
sessão que produziu a reauditoria**, por autorização explícita do proprietário. A integração é um
ato de selagem e versionamento: não altera byte executável algum, não reabre gate e não produz
julgamento técnico novo. O julgamento técnico permanece o dos dois pareceres importados.

---

## 5 · Verificação não executada

`RS-4` — a conferência somente-leitura de **Tailscale Serve/Funnel** não foi possível no ambiente da
reauditoria. A afirmação da candidata (Serve exclusivamente para `127.0.0.1:1337`, Funnel ausente)
permanece **não verificada por auditoria independente**. Como nenhuma alteração de Tailscale foi
autorizada nem executada nesta integração, a pendência não a bloqueia; fica registrada para a
decisão de promoção para produção.

---

## 6 · Estado

```text
Phase 5.1 implementation complete:            true
Phase 5.1 independently audited:              true
Phase 5.1 blocker B1 closed and re-audited:   true
Phase 5.1 candidate sealed for integration:   true
Phase 5.1 merged:                             pending até o ato do GitHub
production promotion authorized:              false
service on 127.0.0.1:1337 replaced:           false
Tailscale Serve modified:                     false
tag created:                                  false
GitHub Release created:                       false
deployment performed:                         false
runtime modified after audit:                 false
```

Este registro **não** declara Final Release, **não** declara freeze de release, **não** declara
promoção para produção e **não** declara deployment. Nenhum desses atos foi autorizado ou executado.

---

## 7 · Escopo desta selagem

Os únicos conteúdos acrescentados à candidata auditada antes do commit são:

```text
docs_phase5/AUDITORIA_INDEPENDENTE_PHASE_5_1_UAT_REPORT.md            (cópia byte-idêntica)
docs_phase5/AUDITORIA_INDEPENDENTE_REAUDITORIA_PHASE_5_1_ERRATA.md    (cópia byte-idêntica)
docs_phase5/PHASE_5_1_INTEGRATION_ACCEPTANCE.md                       (este registro)
docs_phase5/MANIFEST_PHASE5_P50.sha256                                (regenerado por último)
```

Nenhum byte executável mudou: HTML, engine, os módulos da Camada 5, `ui_v32.js`, `ui_journey_v32.js`,
o CSS, as suítes, o `package.json` e o `package-lock.json` permanecem exatamente como auditados. O
HTML **não** foi reconstruído; as evidências, os screenshots e os PDFs **não** foram regenerados.

`AGENTS.md` permanece **não rastreado**, fora do manifesto por exclusão nominal declarada e **fora do
staging** — não foi editado, apagado nem incluído em qualquer entrega.
