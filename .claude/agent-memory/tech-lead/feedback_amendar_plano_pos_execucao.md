---
name: amendar-plano-pos-execucao
description: Depois das waves e antes do spec-validate, o plan.md recebe uma edição de REGISTRO (notas datadas, aditivas, com prova mecânica de aditividade) — e o que mais vale nela é nomear a decisão do plano que a execução desmentiu, não a defasagem corrigida
metadata:
  type: feedback
---

**Regra:** quando o orquestrador autoriza tocar o `plan.md` depois das waves,
corrija **registro**, nunca desenho: notas `*(Execução, <data> — …)*` anexadas
à célula/parágrafo original (texto antigo intacto), toda linha citada re-medida
no HEAD do momento, e um cabeçalho datado dizendo o que a edição toca e o que
foi **confirmado sem nota**. Separe explicitamente (a) *defasagem de registro*
(PP novo, série de repins, entradas a mais na matriz) de (b) *decisão de desenho
desmentida* (P-n que não se confirmou) — e diga (b) primeiro.

**Why:** pedido literal do orquestrador na 017 (2026-09-06), com a frase "se
alguma decisão do plano não se confirmou na execução, isso é mais valioso que a
correção". Na 017 a lista foi: `[P]` na W3 com "três repins em sequência depois
dos três conteúdos" (mecanicamente errado — `gen_pins` pina HEAD, o primeiro
repin cobriria os três); P1 "exatamente um commit no julgador" (veio uma segunda
edição comentário-only, PP-12); P5 "PR abre ao fim da W2" (não abriu — branch
nunca enviada, PR movido à Fase 6); orçamento "+~200 linhas" (+352); série de
dez repins (onze + R9, dois de classes não previstas); matriz com duas famílias
(três); mutantes M1–M18 (M19–M21 por errata). Nada disso estava no `tasks.md`
consolidado — só o PP-12 — e o `spec-validate` leria o plano como estava.

**How to apply:** (1) prove aditividade por máquina antes de reportar — script no
scratchpad que compara `git show HEAD:<plan>` com o working tree e exige que
toda linha original reapareça verbatim ou com um trecho `*(Execução …)*`
removido (na 017: 362/362, 90 inserções, 12 linhas com nota; `grep '^-[^-]'=0`
é inatingível para nota em célula — ver [[prova-mecanica-testada-contra-negativo]]);
(2) notas curtas em célula levam o **mesmo prefixo** `*(Execução: …)*`, senão a
prova mecânica não as reconhece; (3) itens que tipicamente derivam e devem ser
conferidos por `git log` + planning-state + `gh pr list`: patch-points fora do
red, série de repins pelo par (commit → chaves de `pins.json`), `[P]` que caiu na
Fase 3, momento do push/PR, crescimento em linhas do instrumento, mutantes e
famílias acrescentados por errata; (4) prova de terceiro citada na linha (ex.:
`so_docstring.py`) **re-executa-se** — reextraia o script do `tasks.md` e
confira o `git hash-object` declarado antes de citar o resultado.
