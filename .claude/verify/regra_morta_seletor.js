/* ============================================================================
   REGRA MORTA · NORMALIZADOR DE SELETOR, ESPECIFICIDADE E CONTEXTO DE MÍDIA
   Demanda 014-gate-sem-poder-discriminante · T040 · owner: build-engineer.

   Metade do instrumento, separada por ORÇAMENTO (R9 §7): o gatilho declarado no
   plan.md era "passando de 600 linhas, dividir em `regra_morta_seletor.js`
   (normalizador + especificidade) + `regra_morta.js` (cascata + relatório)". A
   soma passou; a divisão é a prevista, não uma invenção.

   Aqui NÃO se decide cascata. Aqui só se responde três perguntas do DADO:
     · como este seletor se escreve de forma canônica;
     · qual a sua especificidade;
     · que relação (decidível ou não) ele tem com outro seletor / outro contexto
       de mídia.

   O QUE ESTE ARQUIVO RECUSA, E POR QUÊ
   ------------------------------------
   Recusar é a operação mais importante daqui. Um normalizador que "dá um jeito"
   em `:is(...)` ou em `@media (min-width:900px)` × `@media (min-width:1200px)`
   devolve um veredito que ninguém pode auditar. Toda recusa sai com uma razão do
   VOCABULÁRIO FECHADO que vive em `.claude/verify/regra_morta.json`
   (`_meta.vocabulario_fechado_de_razao_indecidivel`) — nunca com silêncio, nunca
   com "provavelmente viva".
   ========================================================================== */
"use strict";

/* Gramática recusada (plan §Normalização de seletor, item 6). Um seletor que
   case qualquer destes padrões não é comparável por esta relação estreita. */
const GRAMATICA_RECUSADA = [
  /:is\s*\(/i, /:where\s*\(/i, /:not\s*\(/i, /:has\s*\(/i,
  /::part\b/i, /::slotted\b/i,
  /:nth-[a-z-]+\s*\([^)]*\bof\b/i
];

/* Compostos VÁCUOS — os únicos que casam TODO elemento do documento. É a peça
   que inverte o veredito (errata E5): prefixar restringe, salvo quando o extra
   é vácuo. `html`, `body`, `:root`, e SÓ. Qualquer id, classe, atributo ou
   outro pseudo restringe por construção. */
const COMPOSTOS_VACUOS = ["html", "body", ":root"];

const TIPOS_DE_MIDIA = ["all", "screen", "print", "speech"];

/* Marca de reserva para seletor de atributo. Sem espaço, de propósito: o
   atributo pertence ao MESMO composto do que vem antes (`body[data-x]` é um
   composto, não dois), e um placeholder cercado de espaços partiria o composto
   ao meio — erro silencioso que só apareceria no veredito final. */
const RESERVA = String.fromCharCode(1);   /* U+0001: impossível num seletor CSS */

/* ── normalização de seletor ────────────────────────────────────────────────
   Os seletores de atributo saem de cena antes do colapso de espaço em branco e
   voltam depois: colapsar dentro de `[data-x="a  b"]` alteraria o VALOR, que o
   plan manda preservar byte a byte. */
function normalizarSeletor(bruto) {
  const guardados = [];
  let s = String(bruto).replace(/\[[^\]]*\]/g, m => {
    guardados.push(m.replace(/'([^']*)'/g, '"$1"'));   /* aspas → `"`, valor intacto */
    return RESERVA + (guardados.length - 1) + RESERVA;
  });
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/\s*([>+~])\s*/g, " $1 ");
  return s.replace(new RegExp(RESERVA + "(\\d+)" + RESERVA, "g"), (m, i) => guardados[Number(i)]);
}

function gramaticaRecusada(seletor) {
  return GRAMATICA_RECUSADA.some(re => re.test(seletor));
}

/* ── especificidade (a, b, c) — calculada INTERNAMENTE (errata E4) ──────────
   a = #id · b = .classe, [atributo], :pseudo-classe · c = tipo, ::pseudo-elemento.
   `*` e combinadores não contam. O scanner consome `.foo` inteiro, então todo
   identificador nu que sobra é seletor de TIPO — que é exatamente o que separa
   `(0,2,2)` de `(0,2,1)` no caso real `M51-01`. */
const TOKEN = new RegExp([
  "(#[-\\w\\u00a0-\\uffff]+)",                 /* 1 · id                       */
  "(\\.[-\\w\\u00a0-\\uffff]+)",               /* 2 · classe                   */
  "(\\[[^\\]]*\\])",                           /* 3 · atributo                 */
  "(::[-\\w]+(?:\\([^)]*\\))?)",               /* 4 · pseudo-elemento          */
  "(:[-\\w]+(?:\\([^)]*\\))?)",                /* 5 · pseudo-classe            */
  "(\\*)",                                     /* 6 · universal (não conta)    */
  "([-\\w\\u00a0-\\uffff]+)",                  /* 7 · tipo                     */
  "([>+~,\\s]+)"                               /* 8 · combinador (não conta)   */
].join("|"), "g");

function especificidade(seletor) {
  let a = 0, b = 0, c = 0, m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(seletor)) !== null) {
    if (m[0] === "") { TOKEN.lastIndex++; continue; }
    if (m[1]) a++;
    else if (m[2] || m[3] || m[5]) b++;
    else if (m[4] || m[7]) c++;
  }
  return [a, b, c];
}

function compararEspecificidade(x, y) {
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

/* ── compostos ──────────────────────────────────────────────────────────────
   Só há tokenização em compostos quando TODOS os combinadores são descendentes.
   `a > b` prefixado muda de semântica (plan §6), então a relação de prefixação
   não se aplica e sobra apenas a identidade. */
function compostos(seletorNormalizado) {
  if (/[>+~]/.test(seletorNormalizado)) return null;
  return seletorNormalizado.split(" ").filter(Boolean);
}

function ehVacuo(composto) {
  return COMPOSTOS_VACUOS.indexOf(composto) >= 0;
}

function terminaCom(longa, curta) {
  if (!longa || !curta || longa.length <= curta.length) return false;
  return longa.slice(longa.length - curta.length).join(" ") === curta.join(" ");
}

/* ── relação entre dois seletores ───────────────────────────────────────────
   Devolve UM de:
     {rel:"identica"}                     — o mesmo conjunto de elementos
     {rel:"O-estende-D", extras:[...]}    — O = prefixo + D  ⇒  O ⊆ D
     {rel:"D-estende-O", extras:[...]}    — D = prefixo + O  ⇒  D ⊆ O
     {rel:"nenhuma"}                      — não competem, e isto NÃO é dúvida
     {duvida:"<razao do vocabulário>"}    — pode competir e não sabemos

   A distinção entre "nenhuma" e "dúvida" é o coração de C6: dois seletores
   sem parentesco nenhum (`.a` × `.b`) não competem — dizer "indecidível" ali
   afogaria a lista nomeada e a tornaria inútil. Dúvida é só onde há indício
   de competição e a relação declarada não alcança. */
function relacaoSeletor(D, O) {
  if (D === O) return { rel: "identica" };
  if (gramaticaRecusada(D) || gramaticaRecusada(O))
    return { duvida: "gramatica-de-seletor-recusada" };
  if (D.toLowerCase() === O.toLowerCase())
    return { duvida: "caixa-de-seletor-divergente" };

  const cD = compostos(D), cO = compostos(O);
  if (!cD || !cO) {
    /* combinador não-descendente em cena: sobra a identidade, já testada. Se
       ainda assim um TERMINA com o outro, há indício de competição que esta
       relação não decide — sai nomeado, nunca engolido. */
    const tD = D.split(" ").filter(Boolean), tO = O.split(" ").filter(Boolean);
    if (terminaCom(tO, tD) || terminaCom(tD, tO))
      return { duvida: "combinador-nao-descendente-no-prefixo" };
    return { rel: "nenhuma" };
  }
  if (terminaCom(cO, cD)) return { rel: "O-estende-D", extras: cO.slice(0, cO.length - cD.length) };
  if (terminaCom(cD, cO)) return { rel: "D-estende-O", extras: cD.slice(0, cD.length - cO.length) };
  return { rel: "nenhuma" };
}

/* ── contexto de mídia — SEMÂNTICO, nunca textual (errata E5) ───────────────
   A condição efetiva é a CONJUNÇÃO das condições ancestrais, comparada por
   valor. É o que faz `@media screen and (min-width:1180px)` (bloco único, sem
   espaço) e `@media screen` › `@media (min-width: 1180px)` (aninhado, com
   espaço) serem a MESMA condição — e é o que impede o único caso morto do
   repositório de sair como "viva" por diferença de digitação. */
function parseCondicaoDeMidia(texto) {
  const t = String(texto || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (!t) return { tipo: "all", features: [] };
  if (t.indexOf(",") >= 0 || /\bnot\b/.test(t) || /\bor\b/.test(t)) return null;
  const partes = t.split(/\s+and\s+/);
  let tipo = "all";
  const features = [];
  for (const cru of partes) {
    const p = cru.replace(/^only\s+/, "").trim();
    if (!p) continue;
    if (p.charAt(0) === "(") {
      features.push(p.replace(/\s*:\s*/g, ":").replace(/\s+/g, ""));
    } else if (TIPOS_DE_MIDIA.indexOf(p) >= 0) {
      if (tipo !== "all" && tipo !== p) return null;   /* screen ∧ print = vazio */
      tipo = p;
    } else {
      return null;                                     /* gramática fora do contrato */
    }
  }
  features.sort();
  return { tipo, features };
}

/* pilha = condições dos @media ancestrais, da mais externa para a mais interna */
function contextoEfetivo(pilha) {
  let tipo = "all";
  const features = [];
  for (const texto of (pilha || [])) {
    const c = parseCondicaoDeMidia(texto);
    if (!c) return null;
    if (c.tipo !== "all") {
      if (tipo !== "all" && tipo !== c.tipo) return null;
      tipo = c.tipo;
    }
    c.features.forEach(f => { if (features.indexOf(f) < 0) features.push(f); });
  }
  features.sort();
  return { tipo, features };
}

/* Relação entre dois contextos. Só duas são decidíveis por contrato (plan §4):
   identidade e contenção por TIPO. Faixas sobrepostas — `(min-width:900px)` ×
   `(min-width:1200px)` — são indecidíveis POR CONTRATO, não por impossibilidade
   matemática: implementar contenção por faixa seria divergir do contrato
   ratificado, e divergência sobe, não se acomoda (R10 §1). */
function relacaoMidia(cD, cO) {
  if (!cD || !cO) return "indecidivel";
  const mesmasFeatures = cD.features.join("&") === cO.features.join("&");
  if (!mesmasFeatures) return "indecidivel";
  if (cD.tipo === cO.tipo) return "identica";
  if (cO.tipo === "all") return "O-contem-D";
  if (cD.tipo === "all") return "D-contem-O";
  return "disjunta";                                   /* screen × print */
}

module.exports = {
  GRAMATICA_RECUSADA, COMPOSTOS_VACUOS,
  normalizarSeletor, gramaticaRecusada,
  especificidade, compararEspecificidade,
  compostos, ehVacuo, terminaCom, relacaoSeletor,
  parseCondicaoDeMidia, contextoEfetivo, relacaoMidia
};
