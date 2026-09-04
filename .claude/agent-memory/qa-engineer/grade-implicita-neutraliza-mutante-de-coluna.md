---
name: grade-implicita-neutraliza-mutante-de-coluna
description: D014-M10 (014) — tirar o 2º track de grid-template-columns NÃO tira a 2ª coluna quando há colocação explícita (grid-column:2 → track implícito) ou grid-template-areas vivo de outra camada; P52-LAY2 só mede esquerda/sobreposição/topo e passa. Como separar "gate cego" de "mutante que não toca a propriedade" com três variantes e Chrome local
metadata:
  type: project
---

Diagnóstico de 2026-09-04 (014, T081 vermelho no job `visual`, run 33516136516):
o par `D014-M10`/`P52-LAY2` **nunca pôde matar** — e não por regra morta.

## O mecanismo (CSS Grid, não cascata)

`ui_p52_workspace_v32.css:77` perde o 2º track, mas a 2ª coluna sobrevive por
dois caminhos independentes, qualquer um basta:

1. **`grid-template-areas:"main side"` da 5.1** (`ui_p50_v32.css:697`, mesmo
   breakpoint 1180px) segue VIVO — a própria 014 o mediu como "viva por
   ausência de concorrente" e não ligou o fato à morte raciocinada. Área
   define grade explícita de 2 colunas; a não dimensionada cai em
   `grid-auto-columns: auto`. Medido: `gridTemplateColumns` resolvido continua
   com 2 tracks, `gta` = `"main side"`, rodapé `1 / -1` segue largo → PASS.
2. Mesmo sem as áreas (variante V1, `grid-template-areas:none`), a colocação
   explícita `#p50-shell { grid-column: 2 }` cria **track implícito**: app e
   shell continuam lado a lado; só o rodapé encolhe para a coluna 1 (`-1` conta
   a grade EXPLÍCITA) → FAIL por "rodapé com Npx de Mpx úteis", que não é
   nenhum dos três motivos do `reason` → SOBREVIVENTE do mesmo jeito.

A "morte raciocinada" da spec (§Não mensurável item 2: "com uma coluna #app e
#p50-shell empilham") era CSS errado: **colocação explícita nunca empilha**.

## O que o instrumento da 014 responde — e o que não vê

`regra_morta.js` (`varrerArvore`) devolve a forma `:77` = 1 declaração, VIVA,
`censo_ok`. Correto e irrelevante: ele é por declaração e por cascata; não
enxerga interação entre propriedades (`areas` × `columns`) nem layout.
"Declaração viva" ≠ "mutação observável pelo gate". E a forma reancorada
(`:86`, seletor com `>`) sai **indecidível** — `gramatica-de-seletor-recusada`
—, nomeada e contada (árvore 20→21 indecidíveis, não pinada): a vida da
declaração é provada pelo kill, não pela varredura. Cheque SEMPRE o que o
instrumento responde para a forma nova antes de escrever "viva" em qualquer
registro — eu escrevi e tive de corrigir três lugares.

## O protocolo que fechou em uma sessão, sem Chromium do Playwright

- Worktree efêmera no head do CI + `CHROME_PATH` para o Chrome estável local
  (ver [[trilha-e-ambiente-quickscan]]); harness reproduziu o SOBREVIVENTE
  com a linha `PASS P52-LAY2` que o log do CI não mostra (check_mutation ecoa
  só as 2 últimas linhas + bloco não-KILL).
- Três variantes separam as hipóteses: **M10 literal** (PASS → mutação chegou
  ao artefato, sha diferente do base: hipótese "ciclo" cai) · **V1** (FAIL só
  por rodapé → prova o track implícito) · **V2** = shell em `grid-column:1`
  (FAIL com "a pergunta não está à esquerda do mapa · as colunas se
  sobrepõem" → o gate TEM poder sobre "lado a lado"; o M10 é que não a viola).
- Medidor próprio imprime `getComputedStyle(.wrap).gridTemplateColumns`
  (tracks resolvidos, inclusive implícitos), `gridTemplateAreas`, caixas e os
  4 predicados do gate — é a instrumentação que o harness deveria carregar.

**Why:** a demanda 014 removeu a KI-4 e aposentou M51-01 em troca de um
carrasco que, medido, não mede — a patologia que a própria demanda existe
para expor. O erro nasceu de pinar na spec um kill "raciocinado" sobre layout.

**How to apply:** mutante de layout só entra na matriz depois de medir o
observável que o gate afirma, sob a mutação, num navegador — nem que seja o
Chrome local, declarado não-canônico. Antes de escrever `desc` como "perde a
coluna", procure `grid-template-areas` e colocações explícitas em TODAS as
camadas (`grep grid-area\|grid-column ui_*.css`). Se o gate mede ordem/
sobreposição/topo, o mutante tem de violar ordem/sobreposição/topo — a forma
V2 é a que viola. Ver [[cenario-sem-mutante-e-cenario-nao-medido]] e
[[ancora-viva-em-regra-morta]] (a irmã por cascata).
