---
name: gate-verde-nao-e-protecao
description: Três demandas seguidas acharam gate constante (P51-VIS1/EA-7, CARD2/E17 da 010, UX14) — nunca apoiar critério novo num gate existente só porque está verde
metadata:
  type: project
---

Não escrever critério de spec que dependa de um gate **existente** como prova, sem
antes conferir que ele pode reprovar. A régua é a mesma da R3 §5: gate sem mutante
que ele mate é hipótese, não proteção — e isso vale também para os gates herdados,
inclusive os de **suíte congelada de outra fase**.

Série medida, três demandas seguidas: `EA-7` (`P51-VIS1`, a mutação não consegue
mais violá-lo) → errata **E17** da 010 (`CARD2`, verdadeiro por construção) →
`UX14` (`tests_ux_m41.js:127-134`, 2026-08-31): `(a===b)===c` compara booleano com
string, sempre falso, e o ramo verdadeiro é `X || true` — **as duas arestas do
ternário retornam `true`**. Ficou verde desde sempre, então nenhuma revisão o pegou.

**Why:** na spec da 011 eu escrevi "o mutante D011-M8 tem de morrer no UX14" e
apontei a única prova do mapeamento tecla→finding para um gate que não afirma nada.
Custo evitado: um mutante sobrevivente descoberto na campanha, na Fase 5.

**Quarto mecanismo, achado na 015 (2026-08-31) — o gate lê a PRÓPRIA cópia do
dado, não a do produto.** Eu escrevi na spec que o mutante `M18` (pôr um título em
`HIDE_EYEBROWS`) mataria `U15` junto. **Falso**: `U15` tem uma cópia *hardcoded*
da lista (`tests_ui_m31.js:279-280`) e computa `inHideRendered`/`noOverreach`
contra ela — mutar o array de `ui_v32.js` não tem como alcançá-lo. Além disso a
varredura nunca visita o nó (`ui_v32.js:181`, retorna em `#v32panel`). Um dado
duplicado entre produto e oráculo **não é higiene**: é a razão pela qual um
mutante parece ter dois carrascos e tem um só — ou nenhum.

**Cheque irmão, da mesma demanda:** gate de unicidade cujo seletor é `#app ...`
**não alcança o relatório impresso**, que é filho de `body`. Antes de citar um
gate como cobertura do papel, ler o seletor.

**How to apply:** ao citar gate herdado como carrasco de mutante ou como guarda de
regressão, ler a expressão de retorno **e a origem do dado que ele compara** — não
o nome nem a descrição. Sinais de alarme baratos de ver: `|| true` no retorno,
`===` encadeado, ternário cujas duas arestas dão o mesmo valor, `/* noop */` no
corpo, **lista/constante redeclarada dentro do teste** e **seletor preso a `#app`
num gate que se quer de papel**. Se o gate for de suíte
congelada, o achado **não se conserta de passagem**: registra-se a cadeia
(arquivo:linha → condição → retorno constante) e reaponta-se o critério para gate
próprio da demanda. Ids `EA-*` não se alocam na hora — ver [[ids-ea-entre-branches]].
