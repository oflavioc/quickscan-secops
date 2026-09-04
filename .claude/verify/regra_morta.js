/* ============================================================================
   REGRA MORTA POR CASCATA · O INSTRUMENTO
   Demanda 014-gate-sem-poder-discriminante · T040 · owner: build-engineer.
   Consumido por `tests_014_regra_morta.js` (owner: qa-engineer) — o contrato de
   API vive no cabeçalho DAQUELE arquivo, porque é o gate que o cobra.

   ==========================================================================
   O QUE ESTE INSTRUMENTO RESPONDE
   ==========================================================================
   Para cada mutante de CSS declarado pelos harnesses: a declaração que a
   mutação INTRODUZ OU ALTERA ainda decide alguma coisa na cascata, ou já perde
   em todo contexto em que compete? Se perde em todos e vence em nenhum, o
   mutante é um carrasco sem faca — o gate que ele deveria exercitar não pode
   ficar vermelho, e o verde dele não significa nada.

   ==========================================================================
   TRÊS COISAS QUE ESTE ARQUIVO NÃO FAZ, DE PROPÓSITO
   ==========================================================================
   1. NÃO escreve na árvore. A folha mutada é construída EM MEMÓRIA (`find` →
      `repl`) e parseada ali; nada toca o disco (R7 §3).
   2. NÃO tem lista digitada de harnesses nem de folhas. A população vem do
      `--preflight` de todo harness que o declara em `mutation_map.json`; as
      folhas e a ORDEM vêm de `build_v32_html.py`. Digitar qualquer das duas
      seria reproduzir, dentro do instrumento, o defeito que ele mede: o
      gatilho vigiando uma lista em vez do que decide o resultado.
   3. NÃO devolve veredito antes do censo. `mortas` é `null` enquanto
      `censo_ok !== true` (errata E6). Um parser que lê pouco responde "zero
      regras mortas" com perfeita sinceridade e nenhum valor.

   ==========================================================================
   A DOENÇA DESTA DEMANDA, COMETIDA NO INSTRUMENTO DESTA DEMANDA
   ==========================================================================
   O primeiro contador desta demanda devolveu 0 a 4 regras para cinco folhas: a
   travessia parava no primeiro `CSSStyleRule` e não descia no `cssRules` dele
   (CSS aninhado). Números plausíveis, verde silencioso. Por isso a travessia
   abaixo é recursiva em TODO nó que tenha `cssRules` — inclusive dentro de
   `CSSStyleRule` — e por isso o censo é conferido contra o registro pinado
   ANTES de qualquer veredito. Se um número deste arquivo parecer estranho, o
   primeiro suspeito é este contador, não a árvore.
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const { JSDOM } = require("jsdom");
const S = require("./regra_morta_seletor.js");

const API = 1;

const NOME_CAMADA_0 = "quickscan_secops_soccmm_v3_1_3.html#style";
const CAMPOS_DO_CENSO = ["regras", "declaracoes", "media", "regras_com_importante",
                         "importante_texto", "importante_com_var"];

/* ═══════════════════════════════════════════════════════════════════════════
   1 · PARSE — CSSOM do jsdom (errata E4: dependência declarada)
   ═══════════════════════════════════════════════════════════════════════════ */

/* Uma janela só para todas as folhas: parsear 6 camadas × 50 mutantes com uma
   JSDOM nova a cada vez custa minutos. O elemento <style> é criado, lido e
   removido; nada persiste entre chamadas. */
let _janela = null;
function janela() {
  if (!_janela) _janela = new JSDOM("<!doctype html><html><head></head><body></body></html>").window;
  return _janela;
}

/* `textContent` e não `innerHTML`/template de string: um `</style>` dentro de
   um comentário CSS encerraria o elemento no parser de HTML e a folha seria
   lida pela metade — em silêncio, que é o modo de falhar que esta demanda
   combate. */
function colher(css) {
  const d = janela().document;
  const el = d.createElement("style");
  el.textContent = String(css);
  d.head.appendChild(el);

  const estilo = [], outras = {};
  let regras = 0, declaracoes = 0, media = 0, regrasComImportante = 0, ordem = 0;

  (function anda(lista, pilha) {
    for (let i = 0; i < lista.length; i++) {
      const r = lista[i];
      const tipo = (r && r.constructor && r.constructor.name) || "desconhecida";
      if (tipo === "CSSStyleRule") {
        regras++;
        const decls = [];
        let temImportante = false;
        for (let k = 0; k < r.style.length; k++) {
          const p = r.style.item(k);
          const imp = r.style.getPropertyPriority(p) === "important";
          if (imp) temImportante = true;
          decls.push({ prop: p, valor: r.style.getPropertyValue(p), important: imp });
        }
        declaracoes += r.style.length;
        if (temImportante) regrasComImportante++;
        estilo.push({ seletorTexto: r.selectorText, pilha: pilha.slice(), decls, ordem: ordem++ });
        if (r.cssRules && r.cssRules.length) anda(r.cssRules, pilha);   /* CSS aninhado */
      } else if (tipo === "CSSMediaRule") {
        media++;
        anda(r.cssRules, pilha.concat([r.media.mediaText]));
      } else {
        outras[tipo] = (outras[tipo] || 0) + 1;      /* @page, @keyframes, … */
        if (r.cssRules && r.cssRules.length) anda(r.cssRules, pilha);
      }
    }
  })(el.sheet.cssRules, []);

  d.head.removeChild(el);
  return { estilo, regras, declaracoes, media, regras_com_importante: regrasComImportante, outras };
}

/* Oráculo de `!important` INDEPENDENTE do CSSOM — é ele que sustenta a
   sentinela da limitação medida: o CSSOM do jsdom descarta a prioridade quando
   o valor usa `var(...)`. Se o texto e o CSSOM discordarem, o censo diverge e
   reprova antes do veredito, em vez de a cascata ser decidida com a vencedora
   errada, em silêncio. */
function importantesNoTexto(css) {
  const limpo = String(css).replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /(?:^|[;{])\s*([-\w]+)\s*:\s*([^;{}]*?)!\s*important/g;
  let m, total = 0, comVar = 0;
  while ((m = re.exec(limpo)) !== null) {
    total++;
    if (/var\s*\(/i.test(m[2])) comVar++;
  }
  return { importante_texto: total, importante_com_var: comVar };
}

/* Regra de contagem declarada em `regra_morta.json → _meta.regra_de_contagem_do_censo`.
   Ela vive lá, e não aqui, para que "o censo diverge" seja sempre uma pergunta
   respondível (R10 §3). */
function censo(camadas) {
  return (camadas || []).map(c => {
    const g = colher(c.css);
    const t = importantesNoTexto(c.css);
    return {
      folha: c.nome,
      regras: g.regras,
      declaracoes: g.declaracoes,
      media: g.media,
      regras_com_importante: g.regras_com_importante,
      importante_texto: t.importante_texto,
      importante_com_var: t.importante_com_var,
      outras: g.outras
    };
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   2 · DECLARAÇÕES — a pilha de inlining achatada
   ═══════════════════════════════════════════════════════════════════════════ */

/* Uma entrada por (seletor da lista separada por vírgula) × (declaração). A
   ordem canônica é (camada, regra, declaração) — a terceira e última régua de
   desempate depois de importância e especificidade. */
function declaracoesDaCamada(indice, nome, colheita) {
  const out = [];
  colheita.estilo.forEach(r => {
    const ctx = S.contextoEfetivo(r.pilha);
    const midiaBruta = r.pilha.join(" › ");
    String(r.seletorTexto || "").split(",").forEach(parte => {
      const bruto = parte.trim();
      if (!bruto) return;
      const sel = S.normalizarSeletor(bruto);
      const espec = S.especificidade(sel);
      r.decls.forEach((d, k) => {
        out.push({
          camada: indice, folha: nome, seletor: sel, espec, ctx, midiaBruta,
          prop: d.prop, valor: d.valor, important: d.important,
          ordemRegra: r.ordem, ordemDecl: k
        });
      });
    });
  });
  return out;
}

function montarPilha(camadas) {
  const porCamada = camadas.map((c, i) => declaracoesDaCamada(i, c.nome, colher(c.css)));
  return { porCamada, todas: [].concat.apply([], porCamada) };
}

/* importância → especificidade → ordem de inlining. Nessa ordem, sempre. */
function vence(D, O) {
  if (D.important !== O.important) return D.important ? 1 : -1;
  const e = S.compararEspecificidade(D.espec, O.espec);
  if (e !== 0) return e;
  if (D.camada !== O.camada) return D.camada - O.camada;
  if (D.ordemRegra !== O.ordemRegra) return D.ordemRegra - O.ordemRegra;
  return D.ordemDecl - O.ordemDecl;
}

/* ═══════════════════════════════════════════════════════════════════════════
   3 · O PREDICADO
   ═══════════════════════════════════════════════════════════════════════════

   Regra morta = a declaração perde em TODOS os contextos em que compete e em
   NENHUM é vencedora. Traduzido para o que dá para decidir:

     morta        ⟺ existe uma concorrente que vence D e cujo alcance COBRE
                    todo o alcance de D (seletor e contexto de mídia).
     viva         ⟺ há concorrente e nenhuma a domina totalmente — logo D vence
                    em algum lugar; ou não há concorrente nenhuma.
     indecidível  ⟺ não há dominadora nem concorrente decidida, e sobrou dúvida
                    nomeada.

   A ordem importa: dominância TOTAL é conclusiva mesmo havendo dúvidas — uma
   terceira declaração não faz D vencer onde a dominadora sempre a supera.

   E é aqui que mora o prefixo vácuo (errata E5): quando a vencedora é a
   perdedora PREFIXADA, ela casa um SUBCONJUNTO, e a perdedora segue decidindo
   fora dele — salvo se os compostos extras forem `html`/`body`/`:root`, caso em
   que o subconjunto é o conjunto. É a única diferença entre `M51-01` (morta) e
   `M51-08` (viva), e os dois raciocínios intuitivos erram cada um a sua metade. */
function classificarDeclaracao(D, todas) {
  if (S.gramaticaRecusada(D.seletor))
    return { veredito: "indecidivel", razao: "gramatica-de-seletor-recusada",
             detalhe: "o próprio seletor: " + D.seletor };
  if (!D.ctx)
    return { veredito: "indecidivel", razao: "contexto-de-midia-nao-relacionado",
             detalhe: "o próprio contexto: @" + D.midiaBruta };

  let dominadora = null, competidoras = 0, duvida = null;

  for (let i = 0; i < todas.length; i++) {
    const O = todas[i];
    if (O === D || O.prop !== D.prop) continue;

    const rs = S.relacaoSeletor(D.seletor, O.seletor);
    if (rs.duvida) {
      if (!duvida) duvida = { razao: rs.duvida, detalhe: O.folha + " · " + O.seletor };
      continue;
    }
    if (rs.rel === "nenhuma") continue;

    const rm = S.relacaoMidia(D.ctx, O.ctx);
    if (rm === "indecidivel") {
      if (!duvida) duvida = { razao: "contexto-de-midia-nao-relacionado",
                              detalhe: O.folha + " · " + O.seletor + " @" + (O.midiaBruta || "(sem @media)") };
      continue;
    }
    if (rm === "disjunta") continue;

    competidoras++;
    if (vence(D, O) > 0) continue;                       /* D ganha desta */

    const cobreSeletor = rs.rel === "identica" ||
                         rs.rel === "D-estende-O" ||
                         (rs.rel === "O-estende-D" && rs.extras.every(S.ehVacuo));
    const cobreMidia = rm === "identica" || rm === "O-contem-D";
    if (cobreSeletor && cobreMidia) { dominadora = { O, rs, rm }; break; }
  }

  if (dominadora) {
    const O = dominadora.O;
    return {
      veredito: "morta",
      razao: "perde em todo o alcance para " + O.folha + " · " + O.seletor +
             " (" + O.espec.join(",") + (O.important ? " !important" : "") + ")" +
             (dominadora.rs.rel === "O-estende-D"
               ? " — prefixo VÁCUO [" + dominadora.rs.extras.join(" ") + "]"
               : " — relação " + dominadora.rs.rel),
      dominadora: { folha: O.folha, seletor: O.seletor, especificidade: O.espec, important: O.important }
    };
  }
  if (competidoras > 0)
    return { veredito: "viva", razao: "vence a cascata em pelo menos um contexto (" +
             competidoras + " concorrente(s) decidida(s))" };
  if (duvida)
    return { veredito: "indecidivel", razao: duvida.razao, detalhe: duvida.detalhe };
  return { veredito: "viva", razao: "nenhuma concorrente na relação decidível" };
}

/* API pública sobre folhas SINTÉTICAS (fixtures de C1/C6). */
function classificar(caso) {
  const camadas = (caso && caso.camadas) || [];
  const alvo = (caso && caso.alvo) || {};
  const { todas } = montarPilha(camadas);
  const sel = S.normalizarSeletor(alvo.seletor);
  const cands = todas.filter(d => d.folha === alvo.camada && d.seletor === sel && d.prop === alvo.propriedade);
  if (!cands.length)
    throw new Error("alvo não encontrado na camada " + JSON.stringify(alvo.camada) + ": " +
      sel + " { " + alvo.propriedade + " } — o instrumento não inventa alvo ausente");
  const D = cands[cands.length - 1];                     /* a última da folha é a efetiva */
  return Object.assign({
    folha: D.folha, seletor: D.seletor, propriedade: D.prop,
    especificidade: D.espec, important: D.important
  }, classificarDeclaracao(D, todas));
}

/* ═══════════════════════════════════════════════════════════════════════════
   4 · COBERTURA — derivada do builder, nunca digitada (C5)
   ═══════════════════════════════════════════════════════════════════════════ */

/* Lê `build_v32_html.py` e devolve as folhas CSS na ORDEM de injeção. A
   derivação é em três saltos — constante → variável → chamada de injeção —
   justamente para que uma folha NOVA acrescentada ao builder apareça aqui sem
   que ninguém edite este arquivo (é o mutante `D014-M7`). */
function folhasInjetadas(src) {
  const texto = String(src);
  const constantes = {}, variaveis = {};
  let m;

  const reConst = /^\s*([A-Z][A-Z0-9_]*)\s*=\s*HERE\s*\/\s*"([^"]+)"/gm;
  while ((m = reConst.exec(texto)) !== null) constantes[m[1]] = m[2];

  const reVar = /^\s*([a-z_][a-z0-9_]*)\s*=\s*open\(\s*([A-Z][A-Z0-9_]*)\s*[,)]/gm;
  while ((m = reVar.exec(texto)) !== null) variaveis[m[1]] = m[2];

  const marca = 'html.replace("</style>"';
  const i = texto.indexOf(marca);
  if (i < 0)
    throw new Error("build_v32_html.py: injeção de CSS não localizada (`" + marca +
      "`) — a derivação de C5 não pode ser adivinhada");
  const fim = texto.indexOf("\n", i);
  const trecho = texto.slice(i, fim < 0 ? texto.length : fim);

  const out = [];
  const reId = /[A-Za-z_][A-Za-z0-9_]*/g;
  while ((m = reId.exec(trecho)) !== null) {
    const id = m[0];
    const arquivo = variaveis[id] ? constantes[variaveis[id]] : constantes[id];
    if (arquivo && /\.css$/i.test(arquivo) && out.indexOf(arquivo) < 0) out.push(arquivo);
  }
  return out;
}

/* Camada 0 = o CSS dentro do `<style>` da V3.1.3 congelada. Ele participa da
   cascata do artefato construído e por isso participa da varredura; não é folha
   injetada, e por isso não entra em C5 (o gate filtra por `.css`). */
function camadasDaArvore(raiz) {
  const htmlPath = path.join(raiz, "quickscan_secops_soccmm_v3_1_3.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  const ab = html.match(/<style[^>]*>/);
  const fim = html.indexOf("</style>");
  if (!ab || fim < 0)
    throw new Error("V3.1.3 congelada sem bloco <style> único — camada 0 não localizável");
  const camadas = [{ nome: NOME_CAMADA_0, css: html.slice(ab.index + ab[0].length, fim) }];
  const src = fs.readFileSync(path.join(raiz, "build_v32_html.py"), "utf8");
  folhasInjetadas(src).forEach(f => {
    camadas.push({ nome: f, css: fs.readFileSync(path.join(raiz, f), "utf8") });
  });
  return camadas;
}

/* ═══════════════════════════════════════════════════════════════════════════
   5 · POPULAÇÃO E ÂNCORA — do preflight, nunca dos pares da matriz
   ═══════════════════════════════════════════════════════════════════════════ */

/* Quantifica sobre TODO harness com `"preflight": true` em `mutation_map.json`.
   Os que não declaram saem NOMEADOS em `sem_preflight` — cegueira declarada,
   nunca silenciosa (R10 §2). `--preflight` não muta, não reconstrói e não roda
   gate: é modo declarado (contrato C1 da demanda 013). */
function lerPreflight(raiz) {
  const mm = JSON.parse(fs.readFileSync(path.join(raiz, ".claude", "verify", "mutation_map.json"), "utf8"));
  const harnesses = mm.harnesses || {};
  const com = [], sem = [];
  Object.keys(harnesses).forEach(n => (harnesses[n] && harnesses[n].preflight === true ? com : sem).push(n));
  com.sort(); sem.sort();

  const populacao = [], erros = [];
  com.forEach(nome => {
    let saida = "";
    try {
      saida = cp.execSync(harnesses[nome].cmd + " --preflight", {
        cwd: raiz, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
        timeout: 180000, maxBuffer: 64 * 1024 * 1024
      });
    } catch (e) {
      saida = (e && e.stdout) ? String(e.stdout) : "";
      if (!saida.trim()) { erros.push(nome + ": " + String((e && e.message) || e).split("\n")[0]); return; }
    }
    let obj;
    try { obj = JSON.parse(String(saida).trim()); }
    catch (e) { erros.push(nome + ": stdout não é o objeto C1 (" + (e && e.message) + ")"); return; }
    (obj.mutantes || []).forEach(mu => {
      if (!mu || typeof mu.arquivo !== "string" || !/\.css$/i.test(mu.arquivo)) return;
      populacao.push({ harness: nome, id: mu.id, arquivo: mu.arquivo, find: mu.find, repl: mu.repl });
    });
  });
  return { harnesses: com, sem_preflight: sem, populacao, erros };
}

/* ═══════════════════════════════════════════════════════════════════════════
   6 · DIFF — a cascata é medida sobre a declaração RESULTANTE
   ═══════════════════════════════════════════════════════════════════════════

   Vale para o mutante que ALTERA e para o que ACRESCENTA regra (`M52`, `M53`,
   `P52-M8`, `P52-ER5/ER6`, `P52-FC2`): olhar só a âncora erraria a classe
   inteira e sairia verde. Aqui as duas versões da folha são parseadas e o
   conjunto de declarações introduzidas ou alteradas sai da DIFERENÇA. */
function ctxChave(d) {
  return d.ctx ? (d.ctx.tipo + "|" + d.ctx.features.join("&")) : ("?" + d.midiaBruta);
}

function diferenca(decOrig, decMut) {
  const balde = new Map();
  decOrig.forEach(d => {
    const k = ctxChave(d) + "\u0000" + d.seletor + "\u0000" + d.prop;
    if (!balde.has(k)) balde.set(k, []);
    balde.get(k).push(d.valor + (d.important ? " !" : ""));
  });
  const novas = [];
  decMut.forEach(d => {
    const k = ctxChave(d) + "\u0000" + d.seletor + "\u0000" + d.prop;
    const assinatura = d.valor + (d.important ? " !" : "");
    const lista = balde.get(k);
    const i = lista ? lista.indexOf(assinatura) : -1;
    if (i >= 0) lista.splice(i, 1); else novas.push(d);
  });
  return novas;
}

/* Primeira ocorrência, por `indexOf` + fatia — exatamente a semântica de
   `src.replace(find, repl)` com padrão de STRING, que é como os harnesses
   mutam. `String.replace` interpretaria `$&` no `repl`; a fatia não. */
function aplicarAncora(css, find, repl) {
  const i = css.indexOf(find);
  if (i < 0) return null;
  return css.slice(0, i) + repl + css.slice(i + find.length);
}

/* ═══════════════════════════════════════════════════════════════════════════
   7 · A VARREDURA
   ═══════════════════════════════════════════════════════════════════════════ */

/* A suíte chama `varrerArvore` quatro vezes com os mesmos argumentos (VARR1,
   COB1, IND1, CEN1); sem memória seriam quatro rodadas de preflight sobre sete
   harnesses. O relatório sai CLONADO a cada chamada: devolver sempre o mesmo
   objeto faria um consumidor que o alterasse envenenar os seguintes — a classe
   de acoplamento silencioso que esta demanda combate. */
const _cache = new Map();
const clonar = r => JSON.parse(JSON.stringify(r));

function varrerArvore(opts) {
  const raiz = (opts && opts.raiz) || process.cwd();
  const exclusoes = (opts && opts.exclusoes) || [];
  const chaveCache = path.resolve(raiz) + "\u0000" + JSON.stringify(exclusoes);
  if (_cache.has(chaveCache)) return clonar(_cache.get(chaveCache));

  const camadas = camadasDaArvore(raiz);
  const observado = censo(camadas);

  /* ── o censo ANTES do veredito (errata E6) ───────────────────────────── */
  const registro = JSON.parse(fs.readFileSync(path.join(raiz, ".claude", "verify", "regra_morta.json"), "utf8"));
  const pinado = Array.isArray(registro.censo) ? registro.censo : [];
  const divergencias = [];
  if (observado.map(o => o.folha).join("|") !== pinado.map(p => p.folha).join("|"))
    divergencias.push("conjunto/ordem de folhas do censo diverge do pinado");
  pinado.forEach(p => {
    const o = observado.find(x => x.folha === p.folha);
    if (!o) return;
    CAMPOS_DO_CENSO.forEach(c => {
      if (Number(o[c]) !== Number(p[c])) divergencias.push(p.folha + "." + c + ": " + o[c] + " × " + p[c]);
    });
    if (JSON.stringify(o.outras || {}) !== JSON.stringify(p.outras || {}))
      divergencias.push(p.folha + ".outras: " + JSON.stringify(o.outras) + " × " + JSON.stringify(p.outras));
  });
  observado.forEach(o => { if (!(o.regras > 0)) divergencias.push(o.folha + ": ZERO regras lidas"); });
  const censo_ok = observado.length > 0 && divergencias.length === 0;

  const pref = lerPreflight(raiz);
  const base = {
    censo_ok, censo: observado, censo_divergencias: divergencias,
    populacao: pref.populacao, harnesses: pref.harnesses, sem_preflight: pref.sem_preflight,
    preflight_erros: pref.erros,
    folhas: camadas.map(c => c.nome)
  };

  /* Censo reprovado ⇒ NÃO há veredito. `mortas: null` é a diferença entre
     "medi e não achei" e "não medi" — e é asserção do gate, não convenção. */
  if (!censo_ok) {
    const r = Object.assign({}, base, { avaliados: [], excluidos: [], mortas: null,
                                        indecidiveis: [], sem_ancora: [] });
    _cache.set(chaveCache, r);
    return clonar(r);
  }

  /* ── a pilha base, parseada UMA vez ───────────────────────────────────── */
  const { porCamada } = montarPilha(camadas);
  const indicePorFolha = new Map();
  camadas.forEach((c, i) => indicePorFolha.set(c.nome, i));

  /* Exclusão nominal: par exato (harness, mutante). Curinga não exclui — quem
     julga o registro é `D014-EXC1`, e o instrumento não o contradiz por baixo. */
  const excluir = new Set();
  exclusoes.forEach(e => {
    if (e && typeof e.harness === "string" && typeof e.mutante === "string" &&
        !/[*?]/.test(e.harness) && !/[*?]/.test(e.mutante))
      excluir.add(e.harness + "/" + e.mutante);
  });

  const avaliados = [], excluidos = [], mortas = [], indecidiveis = [], semAncora = [];

  pref.populacao.forEach(mu => {
    const chave = mu.harness + "/" + mu.id;
    if (excluir.has(chave)) {
      excluidos.push({ harness: mu.harness, id: mu.id, arquivo: mu.arquivo });
      return;
    }
    const conta = { harness: mu.harness, id: mu.id, arquivo: mu.arquivo,
                    declaracoes: 0, morta: 0, viva: 0, indecidivel: 0 };

    const idx = indicePorFolha.get(mu.arquivo);
    let motivo = null;
    if (idx === undefined) motivo = "folha fora da cobertura do builder";
    else if (typeof mu.find !== "string" || !mu.find.length) motivo = "âncora `find` ausente no contrato C1";
    else if (typeof mu.repl !== "string") motivo = "âncora `repl` ausente no contrato C1";

    let mutado = null;
    if (!motivo) {
      mutado = aplicarAncora(camadas[idx].css, mu.find, mu.repl);
      if (mutado === null) motivo = "âncora `find` não encontrada na folha";
      else if (mutado === camadas[idx].css) motivo = "mutação sem efeito (repl ≡ find)";
    }
    if (motivo) {
      semAncora.push({ harness: mu.harness, id: mu.id, arquivo: mu.arquivo, motivo });
      avaliados.push(conta);                       /* zero declarações, e NOMEADO acima */
      return;
    }

    const decMut = declaracoesDaCamada(idx, mu.arquivo, colher(mutado));
    const novas = diferenca(porCamada[idx], decMut);
    const pilhaMutada = [].concat.apply([], porCamada.map((d, i) => (i === idx ? decMut : d)));

    conta.declaracoes = novas.length;
    novas.forEach(D => {
      const v = classificarDeclaracao(D, pilhaMutada);
      const ficha = { harness: mu.harness, id: mu.id, folha: D.folha, seletor: D.seletor,
                      propriedade: D.prop, razao: v.razao };
      if (v.veredito === "morta") { conta.morta++; mortas.push(Object.assign(ficha, { detalhe: v.detalhe })); }
      else if (v.veredito === "indecidivel") { conta.indecidivel++; indecidiveis.push(ficha); }
      else conta.viva++;
    });
    avaliados.push(conta);
  });

  const r = Object.assign({}, base, { avaliados, excluidos, mortas, indecidiveis, sem_ancora: semAncora });
  _cache.set(chaveCache, r);
  return clonar(r);
}

module.exports = { API, censo, classificar, folhasInjetadas, varrerArvore, camadasDaArvore };
