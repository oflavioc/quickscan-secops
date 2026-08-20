# REV_B_PROMOTION_RECORD.md
## Registro de promoção normativa · PHASE 5.0 REV B

**Natureza:** registro documental externo do ato de promoção. É a âncora não autorreferencial de
SHA-256 exigida por **P50-GOV2** (§25.2 da spec) e pela interpretação executável fixada na §3.4 do
parecer independente. Não é especificação, não introduz requisito e não abre a Phase 5.0.

**Data da promoção:** 2026-08-19
**Ato:** promoção normativa documental da candidata auditada. **Não** constitui abertura da fase,
autorização de implementação, início da Wave 1A, commit, push, tag, release ou alteração de runtime.

---

## 1. Identidade canônica

```text
arquivo canônico da especificação normativa:
specs/PHASE_5_0_REV_B.md

candidateAuditedSha256:
0f31900e8ad608c8a5825d9d5fa9e2d7a4fd3d68f8efbf23c7fc937a16950925

normativePromotedSha256:
4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b
```

Os dois hashes têm papéis distintos e ambos são obrigatórios:

- `candidateAuditedSha256` prova **qual conteúdo recebeu o PASS independente**. É identidade
  histórica; nenhum arquivo em disco precisa reproduzi-lo após a promoção.
- `normativePromotedSha256` identifica os **bytes finais da spec promovida**. É o valor que
  `P50-GOV2` recalcula e compara.

**Fechamento mecânico de P50-GOV2:**

```text
SHA-256 observado de specs/PHASE_5_0_REV_B.md
  == SHA-256 declarado neste registro
  == SHA-256 declarado em CLAUDE.md
```

O SHA pós-promoção **não** é gravado dentro da própria spec: seria autorreferência criptográfica
insolúvel (parecer independente, §3.4).

---

## 2. Cadeia de precondições — cumprida nesta ordem

```text
1. AUTORIA DA CANDIDATA                                              ✔
2. AUDITORIA INDEPENDENTE — PASS, zero blockers abertos              ✔  2026-08-19
3. ACEITE DO PROPRIETÁRIO + APROVAÇÃO FORMAL DA CHANGE BOUNDARY §29  ✔  2026-08-19
4. REGISTRO DE PROMOÇÃO (data + SHA-256 + CLAUDE.md simultâneo)      ✔  este documento
5. ABERTURA FORMAL DA PHASE 5.0                          ← PENDENTE · ato exclusivo do proprietário
6. IMPLEMENTAÇÃO (por microfases, §5/§33)                ← NÃO AUTORIZADA
```

### 2.1 Auditoria independente

```text
arquivo:    docs_phase5/AUDITORIA_INDEPENDENTE_PHASE_5_0_REV_B.md
SHA-256:    dfa8001844085ad1da09db1c858581e7b1bcb3283ed0c5dbf4155b1188c237c6
tamanho:    6.091 bytes
data:       2026-08-19
auditor:    Codex / OpenAI — independente do autor da candidata
resultado:  PASS — PHASE 5.0 REV B CANDIDATA APROVADA EM AUDITORIA INDEPENDENTE
blockers:   0
```

Importado byte-idêntico; SHA-256 recalculado antes e depois da cópia. Evidência externa —
proibido editar, normalizar ou reformatar.

Artefatos cobertos pelo parecer (todos recalculados nesta sessão e conferidos):

```text
PHASE_5_0_REV_B.md            0f31900e8ad608c8a5825d9d5fa9e2d7a4fd3d68f8efbf23c7fc937a16950925
REV_B_MANDATE_TRACEABILITY.md e4037522d3d855bf175f5cb53079aed7c6e5f4212757628ac597fabf7b8af822
REV_B_REANCHOR_MAP.md         586867ee321c5b3ac136a029955c2981089017f1fd6274f08b7c2d01ca03bb90
```

### 2.2 Aceite do proprietário e change boundary

Declarado formalmente pelo proprietário (Flávio Costa) em 2026-08-19:

```text
Aceito formalmente a PHASE 5.0 REV B candidata auditada.
Aprovo formalmente a change boundary definida na §29.
Autorizo somente a preparação da promoção normativa documental.
Não autorizo abertura da Phase 5.0, implementação, commit ou push.
```

---

## 3. Estado declarado após a promoção

```text
Phase 5.0        NÃO ABERTA
Implementação    NÃO AUTORIZADA
Wave 1A          NÃO INICIADA
spec REV B       NORMATIVA desde 2026-08-19
spec REV A       histórica (REPROVADA em auditoria independente, 2026-08-18) · não normativa
```

---

## 4. Delta aplicado à spec (escopo do ato)

Conforme §4 do parecer, **apenas campos e declarações de status, identidade, auditoria, aceite e
promoção** foram alterados. Onze sítios, todos no cabeçalho, na §0.A, na §1 e na §35:

```text
S1    título                    CANDIDATE SPEC        → NORMATIVE SPEC
S2    subtítulo                 candidata/NÃO AUTORIZADA ATÉ PROMOÇÃO → normativa/promovida
S3    bloco de cabeçalho        NÃO NORMATIVA ATÉ…    → NORMATIVA DESDE 2026-08-19
S4    parágrafo **Status:**     CANDIDATA             → NORMATIVA + identidade da auditoria
S5    **Implementação:**        proibida até promoção → NÃO AUTORIZADA até abertura formal (§1)
S6    §0.A histórico de revisão + linha de PASS/aceite/boundary/promoção da REV B
S7    §0.A estado corrente      esta spec é CANDIDATA → esta spec é NORMATIVA
S8    §0.A localização/promoção "enquanto candidata"  → cadeia normativa ativa + regra de SHA
S9    §1 gate de entrada        "não pode tornar-se normativa" → etapas cumpridas; falta abertura
S10   §35 cabeçalho do bloco    CANDIDATE SPEC        → NORMATIVE SPEC
S10b  §35 pendências            4 pendências          → 3 cumpridas + 1 pendente (abertura)
```

### 4.1 Preservações deliberadas

Não foram tocados — e a sua preservação é intencional:

- **§36, linha RB-14.1** (`spec em specs/ com cabeçalho candidato; sem cadeia normativa ativa`).
  É critério de fechamento de uma **tabela normativa de rastreabilidade**, auditada linha a linha
  contra o artefato de assurance `REV_B_MANDATE_TRACEABILITY.md`, que é byte-congelado. Alterá-la
  romperia a correspondência §36 ↔ assurance verificada pelo parecer. Lê-se como o critério vigente
  no estado candidato, agora satisfeito e consumado por este registro.
- **§1, diagrama de fluxo** (`AUTORIA DA CANDIDATA → … → IMPLEMENTAÇÃO`): descrição normativa de
  processo, não campo de status.
- **§31 DoD**, linha `auditoria independente pendente de execução`: refere-se à auditoria da
  **implementação** da Phase 5.0, não à desta spec. Permanece pendente e correta.
- Todo o restante: requisitos UI-*, gates P50-*, fixtures, §29 change boundary, §36 e demais
  tabelas normativas — **intactos**.

### 4.2 Artefatos de assurance byte-congelados

`REV_B_MANDATE_TRACEABILITY.md` e `REV_B_REANCHOR_MAP.md` permanecem byte-idênticos aos artefatos
auditados. Os blocos de identidade que ambos carregam (`SHA-256 0f31900e…950925`, `status: CANDIDATA
· NÃO NORMATIVA`) descrevem o **conteúdo auditado no momento do parecer** e são, por construção,
históricos. O estado corrente é o declarado neste registro e no `CLAUDE.md`.

---

## 5. Integridade não afetada por este ato

```text
engine_v32.js            9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
Camada 1 (v3_1_3.html)   d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82
ui_v32.js                094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038
ui_target_v32.js         cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0
```

Nenhum runtime, teste, builder, pacote, lockfile, baseline ou manifesto foi lido para escrita nem
alterado. A promoção é estritamente documental.

**Mapa de reancoragem:** 33 entradas · 33 verificadas (28 contra o baseline de trabalho + 5 por
identidade) · 0 pendentes · `P50-GOV3` materialmente satisfazível. Reconferido nesta sessão.

---

## 6. Próximo ato exigido

```text
AUDITORIA INDEPENDENTE ESTREITA DO DELTA DE PROMOÇÃO
```

O parecer (§4) condiciona o commit deste delta a uma auditoria estreita. Até lá: sem commit, sem
push, sem abertura de fase, sem implementação. **O agente nunca declara promoção, abertura ou
freeze por conta própria** — este registro documenta atos do proprietário.
