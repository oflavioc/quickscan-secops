# Fix-finding anexo — exclusão do planning-state do registry de pins

> Registro previsto pelo parecer de aceite do product-owner (recomendação A2):
> a expansão nasceu DENTRO da demanda 003 e é registrada como fix-finding
> independente anexo — nunca como emenda pós-fato da spec aprovada.

## O gap (item 13 do spec-validate, 1ª iteração)

O stage `baseline` falhou no head porque o commit de processo `6bfbbb4`
(avanço de fase do orquestrador) alterou
`.claude/project-memory/planning-state/003-marcador-duplicado.json` — arquivo
então pinado — após o `gen_pins` único de T007. Achado pelo `qa-engineer`,
que também nomeou a causa estrutural: **o planning-state muda a cada fase por
desenho; pinar estado vivo condena o baseline a vermelho recorrente** (gate
que falha pelo motivo errado vira gate morto — o próprio achado E5 que o
stage existe para combater).

## A correção (commit `b7a10f6`)

- `gen_pins.py`: `.claude/project-memory/` entra em `EXCLUDE_PREFIXES`, com a
  exclusão anotada em `_meta.exclusoes` do registry;
- `check_baseline.py`: ajuste mínimo de parse (a anotação entre parênteses
  quebrava a derivação de prefixos — detectado pelo build-engineer na
  conferência, não presumido);
- Repin de fechamento em `05f6bc3`.

Justificativa de categoria: **identidade é para artefatos; estado de processo
é validado pelo stage `state` e tem o git como trilha.** Alternativa rejeitada:
repinar a cada transição de fase — transformaria o registry em ruído.

## Prova

2ª iteração do spec-validate (qa-engineer): pipeline 11/11 PASS, baseline
166/166; o commit `d016058` alterou o planning-state SEM repin e o baseline
permaneceu verde — a causa está eliminada por desenho, não por curativo.

## Governança

- A spec da demanda **não** previa mudança nesses dois arquivos; sua lista
  "não mudam" (check_markers, expected_suites, pipeline.yaml, pin declarado
  m41) permaneceu integralmente respeitada.
- Parecer do PO: correção estrutural legítima; não compromete a intenção.
- **Ratificação nominal do usuário no portão final: 2026-08-25** ("ratifico a
  expansão b7a10f6").
- Registro correspondente na tabela Confirmadas de
  `.claude/rules/design-decisions.md` (mesmo commit deste arquivo).

## Follow-ups abertos neste parecer (fora desta demanda)

| Id | Achado | Rota |
|---|---|---|
| A1 | `check_baseline.py:45` — fragmento `f.endswith(tuple(".zip",))` é tupla de caracteres (`.`,`z`,`i`,`p`), não sufixo: arquivos com esses finais escapam da checagem "sem pin". Pré-existente (introduzido na Onda 0, commit `f71eb8b`), redundante com `excl_suffixes`. | fix-finding com red próprio (arquivo rastreado terminando em `p` sem pin deve FALHAR) |
| A3 | Docstring de `check_markers.py` cita a KI-1 órfã (o congelamento do arquivo pela spec foi respeitado, corretamente). | fix posterior, junto com A1 |
