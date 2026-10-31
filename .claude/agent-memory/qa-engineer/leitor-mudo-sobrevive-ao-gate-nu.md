---
name: leitor-mudo-sobrevive-ao-gate-nu
description: Leitor de histórico não tem sonda — `ler_merges` devolvendo [] com metadados sãos deixava o stage fecho VERDE (done CONFORME por ancestralidade; "até o piso: 0" impresso, não comparado) e M19 sobrevivia; FECHADO em 2026-09-04 com o pin imutável `piso.merges_ate_piso = 39` + guarda de censo no gate (D016-M33, kill exige 0 problemas de julgamento); EA-39 (2026-09-05) mostrou o limite da guarda — ela prova o leitor errado sem corrigir os sujeitos (G: 7 ≠ 39 com sete done "EM VOO") — e o instrumento passou a nomear a causa (`historico-raso`) com a guarda cedendo a vez; o que sobra, declarado: leitor que perde merges POSTERIORES ao piso — carrasco só na campanha
metadata:
  type: project
---

Sonda F da Fase 6 da 016 (2026-09-04, clone efêmero, piso vigente 921977c):
trocar o `return` final de `fecho.py:ler_merges` por `{"merges": [],
"origin_develop": od}` (od intacto, `piso_na_cadeia: true`) e rodar
`check_fecho.py` nu ⇒ **exit 0, 0 problema(s)**. As dez `done` saem `CONFORME ·
oráculo: ancestralidade <red.commit>` (T1 secundário cobre quem tem
`red.commit`; a decisão 4 do instrumento julga `done` por C3 sem olhar o piso),
a 016 `EM VOO`, e a única marca é `merges … até o piso, inclusive: 0` — texto,
não asserção. Sob o mesmo leitor mudo, `D016_MUT_ONLY=D016-M19` ⇒
**SOBREVIVENTE** (`problemas: esperado 6 · obtido 0`). Leitura: o gate nu prova
o julgador (sonda) e o estado; a não-vacuidade do **leitor de merges** é
provada pela campanha `d016` — que roda por trigger de path (`check_mutation`),
não a cada execução do stage.

O que mitiga, medido: ref ausente ⇒ `origin-develop-ausente` (FAIL); piso fora
da cadeia (clone raso) ⇒ `piso-invalido` (FAIL); demanda com `red.commit`
mesclada ⇒ a ancestralidade ainda acusa (cenário E de
[[simulacao-de-merge-em-clone-efemero]]). Quem fica cego: FEC2 inteiro
(merges sem estado) e demanda com `tdd_waiver` sem `red.commit` (F19).

**Why:** um leitor não se quebra sem editar `fecho.py` (alvo da campanha), mas
o gate que se apresenta como "P16.a pós-merge" é verde por texto onde deveria
ser verde por número; e `merges_ate_piso` é **imutável por construção** (a
história até o piso não muda), o pin mais barato e mais estável que existe.

**How to apply:** ao validar gate que lê histórico, rode a sonda "leitor devolve
vazio com metadados sãos" ANTES de aceitar "verde por vácuo declarado" como
conforme; registre quem mata (gate × campanha × job) e, se o censo for
imutável, proponha o pin como candidata ao PO/TL — nunca fortaleça por conta
própria ([[sobrevivente-por-lacuna-x-equivalente-por-spec]]). Família de
[[oraculo-independente-do-instrumento]] e [[vacuidade-com-folga-no-limiar]].

## 2026-09-04 (Fase 6, iteração G3/J1) — o pin foi executado; o que ele fecha e o que não

Autorizado pelo orquestrador ("se fecha e é barato, faça"). Forma que funcionou:
`fecho.json → piso.merges_ate_piso = 39` (dois oráculos: `git rev-list --count
--merges --first-parent <piso>` = `ler_merges`; pinado, não calibrado) e uma
**guarda de censo** em `check_fecho.py:vivo_pos` — não é veredito (o docstring
proíbe `if` que decida): é o `total_pinado` da sonda aplicado ao leitor. Só se
aplica com `origin/develop` presente e piso na cadeia; pin ausente é FAIL.
Quatro consequências que quase escaparam:

1. **Todo mutante que move o piso tem de mover o censo** (`pisoPara(sha, censo)`:
   6dad53d = 15, raiz = 0) — senão M18/M19/M24 morrem pela guarda e o controle
   positivo (que exige exit 0) FALHA. Mesma lição de
   [[divergencia-de-censo-tem-causa-isolavel]]: pine a regra junto do número.
2. O carrasco da guarda (D016-M33, leitor mudo) só prova a guarda se o kill
   **exigir `contagens.problemas === 0`** e nenhum sujeito com falha — é a
   forma isolante de [[mutante-que-morre-em-dois-lugares]] para guardas.
3. O controle de baseline passa a exigir `censo.estado === "ok"`: a guarda tem
   de alcançar o verde ([[controle-verde-na-bateria-negativa]]).
4. O que a guarda **não** cobre é o leitor que devolve os anteriores e perde os
   **posteriores**: censo variável, e na árvore de hoje indistinguível de "0
   após o piso" (uma done não achada nos merges cai em CONFORME por
   ancestralidade). Ficou como dívida nomeada, carrasco = M18/M19 na campanha.
   Não invente sonda de leitor com repositório git sintético "de passagem".

## 2026-09-05 (fix-finding EA-39, T096) — o que a guarda prova e o que ela não corrige

Sob `.git/shallow` (o Playwright no CI, `prova-de-carga.md` §11) o leitor
devolvia 0 e a guarda acusava `0 ≠ 39` — mas com **0 problema(s) de
julgamento** e as dez `done` mescladas ditas `EM VOO`. O caso **G** da §12.2
(`--depth=10`, raso ABAIXO do piso: piso na cadeia, contagem parcial) é o mais
nítido: pré-fix a guarda pegava `7 ≠ 39` e sete demandas mescladas saíam `EM
VOO` (falso — a mensagem não acha o merge e `merge-base --is-ancestor`
responde `false` sobre cadeia truncada), quatro `CONFORME`. Um oráculo
independente de censo **prova o leitor errado sem corrigir um sujeito
sequer**; quem tem de nomear a causa e abortar é o instrumento. O fix fez o
leitor afirmar `cadeia_integra: false` (+ `fim_da_cadeia`, `posicao_do_piso`),
o julgador emitir o 17º código `historico-raso` no terceiro elo da
precedência e a guarda **ceder a vez** (`nao_aplicado`, `lido 7` ainda
visível) — um FAIL por causa, conferido em A, B, G, E.1. `D016-M33` não mudou:
sob ele o `od` sai íntegro (árvore completa) e a guarda continua sendo o
carrasco (`0 × 39 · 0 problema(s)`). Os pares novos `D016-M34`/`M35` são a
metade PURA (julgador, sonda F25/F26); a metade de I/O segue sem mutante de
árvore, com a bateria §12 como carrasco declarado
([[clone-raso-do-github-em-segundos]],
[[mutante-de-precedencia-e-a-fixture-que-o-justifica]]).
