---
name: checklist-fase0-owner-de-estado-novo
description: Lição da 019→025 — todo owner canônico novo tem de responder a SEIS perguntas de ciclo de vida na tabela de casos de borda da Fase 0; a 019 respondeu duas e os outros quatro viraram EA-91/92/105/107
metadata:
  type: project
---

Quando uma demanda cria **estado canônico novo** (sexta chave da sessão, novo
owner por bridge, novo transiente de UI), a tabela de casos de borda do
`refinement.md` tem de ter **uma linha para cada uma** destas seis perguntas:

1. **Exportar** — o que sai, e exportar escreve no owner? (EA-105: `validate`
   que aplica, chamado pelo export)
2. **Importar com a chave presente** — substitui ou mescla? (mutD da refutação)
3. **Importar com a chave AUSENTE** — o owner vai a "nada declarado" ou herda a
   janela aberta? (EA-91: a metade da INV-8 que ninguém implementou)
4. **Cancelar / recusar / falhar no meio** — o estado é byte-igual ao anterior,
   inclusive no papel? O snapshot foi tirado ANTES de qualquer escrita?
5. **Nova sessão** — o owner é limpo? Cada owner anterior tinha o seu gate
   "Nova sessão limpa X" (T21, R21); o novo não tinha (EA-92)
6. **Reiniciar avaliação** — o owner é "sobre a avaliação" (limpa) ou "sobre o
   ambiente" (preserva, como o landscape da 4.2)? Decidir e nomear no diálogo.

Mais um transiente que não é owner mas acompanha: **o que mais sobrevive à
fronteira da sessão** (`draft` do editor, `prioLimitHit`) — inventariar.

Duas perguntas que a Fase 1 da 025 (2026-10-27) mostrou faltarem:

7. **Chaves desconhecidas DENTRO do bloco novo** — recusadas nomeando-as, como
   toda outra estrutura do schema v1 (`extraKeys`)? A tabela da INV-8 que eu
   escrevi tratou as grafias do *estado* (`null`/`{}`/ausente) e esqueceu as
   chaves do *bloco*; o TL achou (ERR-2 da 025).
8. **Guarda que cai por mudança de contrato** — qual gate mata o mutante que a
   REINTRODUZ? Na 025 a guarda `&& snap.curadoria` caía e nenhum gate a cobria:
   os dois gates de rollback tinham snapshot sempre truthy. Quando uma linha
   sai, perguntar "em que janela a sua volta faria estrago?" e pôr essa janela
   num gate (TRX2(b′)/M22).

**Why:** a 019 (2026-09-17) tinha nove casos de borda e cobria só o 2 (caso 3,
"sessão exportada, importada noutro dia") e metade do 3 (caso 7, "ausência ≠
vazio" — lido como "não recusar"). Os outros quatro não estavam na tabela, o
`plan.md` não listou `ui_ux_v32.js`, e nenhum gate clicava `#ux-newsession` nem
importava. Resultado: contaminação entre clientes no relatório impresso, achada
por auditoria externa um mês depois (Codex, 2026-10-20) e corrigida pela 025.
Omissão de Fase 0, não decisão de ninguém — e o checklist é o remédio barato.

**How to apply:** em toda Fase 0 que crie owner/estado novo, escrever as seis
linhas na tabela mesmo que a resposta seja "não se aplica" — a ausência da linha
é o que esconde a omissão. Em Fase 6, grep da suíte da demanda por
`uxNewSession|uxResetAssessment|importSessionDocument`: zero hits em demanda de
estado novo é achado. Ver [[025-refinamento-curadoria-transacional]] e
[[checklist-de-fase-6-do-po]].
