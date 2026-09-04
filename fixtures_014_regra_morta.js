/* ============================================================================
   FIXTURES D014 · REGRA MORTA POR CASCATA — demanda 014-gate-sem-poder-discriminante
   Namespace exclusivo D014-*. Consumidas por `tests_014_regra_morta.js`.

   ==========================================================================
   POR QUE SÃO STRINGS, E NUNCA ARQUIVOS `.css`
   ==========================================================================
   Uma folha sintética gravada como `.css` na raiz entraria em DOIS lugares
   onde não pode entrar: na varredura da árvore real (C2 acusaria as regras
   mortas que estas fixtures PRECISAM ter) e no alcance do builder (C5 exige
   que a lista de folhas seja derivada de `build_v32_html.py`). Logo: strings,
   sempre, e nenhum `fs.writeFileSync` neste arquivo (R7 §3).

   ==========================================================================
   O QUE ESTE ARQUIVO NÃO CARREGA — E A RAZÃO
   ==========================================================================
   **Não há campo `esperado`.** O veredito canônico de cada caso vive na
   tabela DECLARADA de `tests_014_regra_morta.js` (§VEREDITO_CANONICO),
   copiada da célula C1 da spec. Se o veredito morasse aqui, o julgador
   compararia o runtime contra o objeto da própria fixture e ficaria cego a
   toda edição desta fixture — o gate concordaria com o que fosse escrito.
   Aqui mora só a ENTRADA; o gabarito mora no juiz.

   ==========================================================================
   A ORDEM DAS CAMADAS É A ORDEM DE INLINING
   ==========================================================================
   `camadas[0]` é injetada ANTES de `camadas[1]`, como `build_v32_html.py`
   injeta `ui_v32.css` antes de `ui_p52_workspace_v32.css`. É a terceira e
   última régua de desempate (importância → especificidade → ordem).

   ==========================================================================
   O PAR (a)/(e) — UMA VARIÁVEL, DOIS VEREDITOS
   ==========================================================================
   (a) e (e) têm a MESMA estrutura: camada anterior com especificidade maior,
   alvo na camada posterior, prefixação de compostos entre os seletores. A
   única variável é a VACUIDADE do composto prefixado — `html` (casa todo
   elemento) em (a), `#ux-target` (restringe) em (e). Os dois raciocínios
   intuitivos erram cada um a sua metade:

     · "prefixou e venceu ⇒ matou"      → daria MORTA em (e). Errado.
     · "prefixar restringe ⇒ nunca mata" → daria VIVA em (a). Errado.

   É o par que separa os dois casos reais do repositório, e por isso é o par que
   não pode ser colapsado num caso só.

   ONDE CADA CASO ENCOSTA NA ÁRVORE REAL — conferido no fonte em 2026-09-01,
   e escrito com precisão porque comentário normativo impreciso apodrece:

     (a) é a forma de `M51-01`. `ui_p50_v32.css:692-697`
         `body[data-uxscreen="question"] .wrap` (0,2,1) × `ui_p52_workspace_v32.css:74-77`
         `html body[data-uxscreen="question"] .wrap` (0,2,2), mídia efetiva
         idêntica (`screen and (min-width:1180px)`) escrita de dois jeitos.
     (c) é a forma de `M51-08` COMO A SPEC O CLASSIFICA: a declaração mutada
         (`ui_p50_v32.css:792`, `#ux-target .ux-tgt-row select option`, (1,1,2))
         é a VENCEDORA sobre `ui_p52_workspace_v32.css:578`
         (`.ux-tgt-row select option`, (0,1,2)) — viva porque vence.
     (e) NÃO é `M51-08`: é o DUAL de (a) e, na árvore, é o OUTRO lado daquela
         mesma competição — a declaração de `ui_p52_workspace_v32.css:578`,
         que perde dentro de `#ux-target` e continua decidindo fora dele.
         Nenhum mutante a ataca hoje; a alínea existe porque a errata E5
         mostrou que sem ela um classificador passa em (a)–(d) e ainda erra.
   ========================================================================== */
"use strict";

/* ── (a) MORTA · prefixo VÁCUO ───────────────────────────────────────────────
   L1 (0,2,2) vence L2 (0,2,1) por especificidade, apesar de vir ANTES. O
   composto extra de L1 sobre L2 é `html`, que casa todo elemento do documento
   → o subconjunto é o conjunto → o alvo não decide em lugar nenhum.
   Erram aqui: quem decide só por ordem (L2 é a última → "viva"); quem não
   soma o seletor de TIPO na especificidade (empate → ordem → "viva"); e quem
   trata todo prefixo como restritivo ("viva"). */
const A = {
  id: "a",
  titulo: "morta por especificidade — o prefixo extra da vencedora é VÁCUO (html)",
  camadas: [
    { nome: "L1-anterior", css:
`@media screen and (min-width:1180px){
  html body[data-uxscreen="question"] .wrap{ grid-template-columns:minmax(0,1fr) clamp(320px,23vw,440px); }
}
` },
    { nome: "L2-posterior", css:
`@media screen and (min-width:1180px){
  body[data-uxscreen="question"] .wrap{ grid-template-columns:minmax(0,1fr) 340px; }
}
` }
  ],
  alvo: { camada: "L2-posterior", seletor: `body[data-uxscreen="question"] .wrap`,
          propriedade: "grid-template-columns" }
};

/* ── (b) MORTA · empate de especificidade, ordem decide ──────────────────────
   Seletores IDÊNTICOS → especificidade empatada → a ordem de inlining decide,
   e a posterior vence. A armadilha está no CONTEXTO DE MÍDIA: a mesma condição
   escrita de dois jeitos — bloco único e sem espaço em L1; ANINHADA e com
   espaço em L2. Um normalizador TEXTUAL responde "contextos distintos, não
   competem" e devolve "viva". É a forma exata dos dois sítios reais
   (`ui_p50_v32.css:692` × `ui_p52_workspace_v32.css:16`+`:74`). */
const B = {
  id: "b",
  titulo: "morta por ordem com especificidade empatada — mídia SEMÂNTICA, não textual",
  camadas: [
    { nome: "L1-anterior", css:
`@media screen and (min-width:1180px){
  .p52-sec p{ max-width:78ch; }
}
` },
    { nome: "L2-posterior", css:
`@media screen {

  @media (min-width: 1180px) {
    .p52-sec p { max-width: 96ch; }
  }

}
` }
  ],
  alvo: { camada: "L1-anterior", seletor: ".p52-sec p", propriedade: "max-width" }
};

/* ── (c) VIVA · o alvo É a vencedora ────────────────────────────────────────
   Camada posterior declara a mesma propriedade no mesmo elemento com
   especificidade MENOR: L1 (1,1,0) vence L2 (0,1,0). O alvo é a declaração de
   L1 — ela vence, logo está viva pela segunda metade da definição ("e em
   NENHUM contexto ela é a vencedora" é falso).
   Erra aqui quem decide só por ordem: diria que L2, a última, mata L1. */
const C = {
  id: "c",
  titulo: "viva — a camada posterior declara a mesma propriedade com especificidade MENOR",
  camadas: [
    { nome: "L1-anterior", css:
`#p50-shell .p50-qlabel{ color:var(--text); }
` },
    { nome: "L2-posterior", css:
`.p50-qlabel{ color:var(--muted); }
` }
  ],
  alvo: { camada: "L1-anterior", seletor: "#p50-shell .p50-qlabel", propriedade: "color" }
};

/* ── (d) VIVA · `!important` em camada ANTERIOR vence normal posterior ───────
   Seletores idênticos, especificidade empatada, L2 é a última — e mesmo assim
   L1 vence, porque importância é a PRIMEIRA régua, antes de especificidade e
   de ordem. Erra aqui quem ignora `!important` e quem trata ordem antes de
   importância: os dois entregam "morta".
   Medido no repositório: 41 declarações `!important` nas cinco folhas — não é
   forma exótica.

   POR QUE O VALOR É LITERAL, E NÃO `var(--token)`: medido em 2026-09-01, o
   CSSOM do jsdom (o parser que a errata E4 declarou) DESCARTA a prioridade
   quando o valor usa `var(...)` — `background:var(--accent) !important` volta
   com `getPropertyPriority() === ""`. Uma fixture escrita com token seria
   vacuosa: o instrumento não veria importância nenhuma e (d) passaria a medir
   ordem, não importância. A limitação está registrada no censo
   (`.claude/verify/regra_morta.json → _meta.limitacao_parser`) com sentinela
   própria. */
const D = {
  id: "d",
  titulo: "viva — !important em camada anterior vence declaração normal posterior",
  camadas: [
    { nome: "L1-anterior", css:
`.p50-badge{ font-weight:700 !important; }
` },
    { nome: "L2-posterior", css:
`.p50-badge{ font-weight:400; }
` }
  ],
  alvo: { camada: "L1-anterior", seletor: ".p50-badge", propriedade: "font-weight" }
};

/* ── (e) VIVA · prefixo NÃO-VÁCUO ───────────────────────────────────────────
   Espelho de (a) com UMA variável trocada. L1 (1,1,2) vence L2 (0,1,2) dentro
   de `#ux-target`; fora dele L1 não casa nada e L2 é a única que decide → o
   alvo continua governando um pedaço do documento → VIVA.
   Erra aqui, e SÓ aqui, quem trata todo prefixo como vácuo (`D014-M9`). Quem
   decide só por ordem NÃO erra este caso — o isolamento é de propósito, para
   que a alínea (e) meça a vacuidade e nada mais. */
const E = {
  id: "e",
  titulo: "viva por prefixo NÃO-vácuo — a vencedora restringe, e o alvo decide fora do subconjunto",
  camadas: [
    { nome: "L1-anterior", css:
`#ux-target .ux-tgt-row select option{ background:var(--surface); }
` },
    { nome: "L2-posterior", css:
`.ux-tgt-row select option{ background:var(--surface2); }
` }
  ],
  alvo: { camada: "L2-posterior", seletor: ".ux-tgt-row select option", propriedade: "background" }
};

/* ── (f) INDECIDÍVEL · guarda de não-vacuidade de C6 ─────────────────────────
   Seletores IDÊNTICOS e mesma propriedade — a relação de seletor é decidível
   e não sobra dúvida sobre "competem?". O que não se decide é o CONTEXTO: as
   duas condições se sobrepõem (≥1200 ⊂ ≥900) mas a relação não é identidade
   nem contenção por TIPO, que são as duas únicas relações que o contrato
   declara decidíveis (plan §4). Logo: indecidível, nomeado e contado.

   REGISTRO EXPLÍCITO, para que ninguém o leia como bug do gate: este caso é
   indecidível **por contrato**, não por impossibilidade matemática. Um
   instrumento que implemente contenção por FAIXA e devolva "viva" aqui não é
   melhor — é DIVERGENTE do contrato ratificado, e a divergência sobe (o gate
   não afrouxa para acomodá-la, R10 §1).

   Este caso é o único portador do critério C6 que não depende do número da
   árvore real: se a árvore não tiver indecidível nenhum hoje, (f) sustenta a
   alínea sozinho. */
const F = {
  id: "f",
  titulo: "indecidível — faixas de mídia sobrepostas: nem identidade nem contenção por tipo",
  camadas: [
    { nome: "L1-anterior", css:
`@media screen and (min-width:900px){
  .p52-card{ padding:12px; }
}
` },
    { nome: "L2-posterior", css:
`@media screen and (min-width:1200px){
  .p52-card{ padding:20px; }
}
` }
  ],
  alvo: { camada: "L1-anterior", seletor: ".p52-card", propriedade: "padding" }
};

const CASOS = { a: A, b: B, c: C, d: D, e: E, f: F };

/* Ordem canônica de execução e relato. `CASCATA` são os cinco cenários de C1;
   `INDECIDIVEL` é a guarda de C6. A partição vive aqui porque é ENTRADA
   (que caso vai a qual gate), nunca gabarito (qual o veredito). */
const CASCATA = ["a", "b", "c", "d", "e"];
const INDECIDIVEL = ["f"];

module.exports = { CASOS, CASCATA, INDECIDIVEL, ORDEM: CASCATA.concat(INDECIDIVEL) };
