# R6 — Change boundary

Severidade: **bloqueante** (hook `guard-boundary` + stage `boundary` + `permissions.deny`).

A boundary é **dado, não prosa**: `.claude/verify/boundary.json` declara as classes
de proteção e o rito que autoriza mudança em cada uma. Nasceu do achado E2: a §29.4
da spec (prosa) não impediu edição de protegidos nas fases 5.1/5.2.

| Classe | Conteúdo | Rito de mudança |
|---|---|---|
| `frozen` | engine, Camada 1 (V3.1.3), harness M41, snapshot funcional | D2 — Porta A ou Porta B (R1) |
| `generated` | HTML dev, ui_icons | só via builder/gerador; stage `build` prova identidade |
| `legacy` | MANIFEST.sha256, spec REV A | congelado até a reconciliação da Onda 4 |
| `registry` | pins.json | só via `gen_pins.py`, no mesmo PR, com motivo no commit |

## Regras

1. Edição direta de path protegido é **negada pelo hook** com o rito nomeado.
2. `permissions.deny` espelha o boundary (Edit+Write) — o `compliance-audit`
   (seção `deny`) falha se divergirem.
3. **Expansão de boundary só por spec commitada ANTES do código** — nunca por
   autorização registrada só em prosa de relatório.
4. Quando uma fase é **selada**, sua boundary fecha para sempre: os módulos da fase
   entram no conjunto protegido da fase seguinte (freeze acumulativo).
5. Correção que exigir arquivo protegido: **PARAR, explicar o rito, aguardar** a
   autorização do usuário no chat.
