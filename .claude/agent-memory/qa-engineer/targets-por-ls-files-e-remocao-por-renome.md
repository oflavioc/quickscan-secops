---
name: targets-por-ls-files-e-remocao-por-renome
description: Contagem de targets/fixtures no tasks.md apodrece entre fases (35 → 42 na 016); gere a lista por `git ls-files` e reporte a divergência em vez de digitar o número. E "retirar as exclusões" de um registro JSON se implementa RENOMEANDO a chave (âncora de uma linha, imune a edição das entradas), nunca apagando o bloco
metadata:
  type: feedback
---

Duas formas pequenas que evitaram retrabalho na wave 5 da 016 (2026-09-04):

1. **Targets saem de `git ls-files`, e o número do plano é conferido, não
   copiado.** O `tasks.md` dizia "35 fixtures / 42 entradas"; a Fase 4 tinha
   acrescentado sete casos (F20–F23, P8–P10) e ninguém reescreveu o número.
   `git ls-files .claude/verify/fixtures_016/` → 42; a entrada ficou com 51
   (mais 4 scripts, 2 registros, o harness e os 2 planning-states que a
   campanha muta — desvio declarado que endurece o trigger). O script de
   splice **assere** a contagem medida e a `_trilha` registra a divergência
   com a causa; o `tasks.md` fica como prosa histórica.
2. **Mutante "exclusões retiradas" por renome de chave.** Em vez de apagar as
   três entradas de `excluidas_por_r13` (âncora multi-linha que apodrece a cada
   edição de `fonte`), o mutante renomeia a chave
   (`"excluidas_por_r13": {` → `"excluidas_por_r13_retiradas_D016_M20": {`): o
   instrumento lê `registro.get("excluidas_por_r13") or {}` e vê vazio; o
   JSON continua válido; a âncora tem UMA linha e sobrevive a qualquer mudança
   nas entradas. Efeito idêntico, custo de manutenção zero.

**Why:** número de plano copiado para o mapa vira "42 entradas" que o
`check_mutation.py:1287` casa por pertinência exata — sete fixtures fora do
trigger em silêncio. E âncora de bloco inteiro é a forma que o preflight acusa
como podre no primeiro ajuste de texto ([[reason-podre-e-a-re-derivacao]]).

**How to apply:** todo `targets` de harness novo nasce de um script que roda
`git ls-files` e assere o total; todo mutante que "remove" um bloco de
registro JSON pergunta primeiro se um renome de chave produz o mesmo estado
para o leitor.
