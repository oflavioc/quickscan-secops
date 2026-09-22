/* ============================================================================
   CURADORIA DO RELATÓRIO — OWNER DO ESTADO · demanda 019
   Dono: core-engineer. Bridge único: `__CURATION` (R9 §2, registrado em
   .claude/verify/bridges.json).

   ==========================================================================
   A FRONTEIRA QUE ESTE MÓDULO EXISTE PARA SUSTENTAR
   ==========================================================================
   O operador ESCOLHE entre o que o motor ofereceu. Ele NUNCA escreve o que o
   motor deveria ter dito.

   Disso dependem as duas invariantes que a demanda tangencia:

     · INV-7 — determinismo é propriedade de (entradas) → saída, não proibição
       de entrada humana. A curadoria é ENTRADA, como já são as respostas, as
       prioridades e o contexto tecnológico.
     · INV-8 — derivado nunca é serializado como fonte de verdade. SELEÇÃO é
       entrada; TEXTO escrito pelo operador seria derivado, e por isso este
       módulo **não aceita texto**: `set()` recusa id fora do catálogo e valor
       fora do enum fechado.

   O gate `D019-CUR1` mede exatamente isso, e o mutante `D019-M1` ataca-o
   abrindo o estado para texto livre.

   ==========================================================================
   POR QUE ESTE MÓDULO NÃO LÊ O DOM
   ==========================================================================
   R9 §3: contrato inter-módulo só por API de bridge; é proibido ler atributo
   escrito por outro módulo como canal de decisão. O conjunto ofertado é
   derivado do MOTOR (`computeFindings()` + `MAP`), nunca da tela — senão o
   estado dependeria de quem renderizou primeiro, e a ordem de instalação
   viraria regra de negócio.

   ==========================================================================
   POR QUE `decisions` E NÃO `offerings`
   ==========================================================================
   A primeira versão deste módulo chamava o mapa de `offerings`. O gate `S4-S5`
   (`tests_session_m48.js`, §29.4) proíbe **treze nomes de campo derivado** no
   documento de sessão, e `"offerings"` é um deles — o engine usa essa palavra
   para o CATÁLOGO derivado (`V32.OFFERINGS`).

   Medido por sonda antes de qualquer commit: com o nome antigo, o documento
   serializado continha `"offerings"` e o `S4-S5` reprovava — corretamente.

   A saída NÃO foi afrouxar o banimento: ele existe para pegar catálogo
   derivado vazando para a sessão, e continuaria valendo. A saída foi corrigir
   o nome. O mapa guarda DECISÕES do operador, não ofertas do motor, e
   `decisions` é o que ele sempre deveria ter dito.

   `decisions` sem a chave  → o motor decide (comportamento de hoje)
   `decisions[id] = "include"` → publica, mesmo que o motor não tenha ofertado
   `decisions[id] = "exclude"` → não publica, mesmo que o motor tenha ofertado

   `missing` nunca é convertido em `"exclude"` na leitura. O mutante
   `D019-M2` ataca justamente essa conversão.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (window.__CURATION && window.__CURATION.__installed) return;   /* R9 §1 */

  var ENUM = ["include", "exclude"];

  /* estado canônico — só ids e enum fechado, nunca prosa */
  var estado = { decisions: {}, architectureNote: undefined };

  function catalogo() {
    if (typeof PRODUCTS === "undefined" || !PRODUCTS) return [];
    return Object.keys(PRODUCTS);
  }

  /* O que o MOTOR ofereceu nesta sessão: união dos candidatos de cada gap
     observado, na ordem em que o motor os produz. Derivado do engine, nunca
     do DOM. */
  function ofertados() {
    var out = [], vistos = {};
    if (typeof computeFindings !== "function" || typeof MAP === "undefined") return out;
    var fs;
    try { fs = (computeFindings() || {}).findings || []; } catch (e) { return out; }
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i], m = MAP[f.id];
      if (!m || !m.lv || !m.lv[f.lvl]) continue;
      var cands = m.lv[f.lvl].c || [];
      for (var j = 0; j < cands.length; j++) {
        var p = cands[j].p;
        if (p && !vistos[p]) { vistos[p] = true; out.push(p); }
      }
    }
    return out;
  }

  function valido(id, valor) {
    if (typeof id !== "string" || !id) return "id ausente";
    if (catalogo().indexOf(id) < 0) return "id fora do catálogo: " + id;
    if (ENUM.indexOf(valor) < 0) return "valor fora do enum fechado: " + String(valor);
    return null;
  }

  /* decisão EFETIVA para um id, sem converter ausência em exclusão */
  function decidir(id) {
    if (Object.prototype.hasOwnProperty.call(estado.decisions, id)) return estado.decisions[id];
    return ofertados().indexOf(id) >= 0 ? "include" : "exclude";
  }

  /* o que vai ao relatório: ofertados que não foram excluídos, mais os que o
     operador incluiu por conta própria — estes últimos, e só estes, carregam
     proveniência. */
  function publicados() {
    var base = ofertados(), out = [], i, id;
    for (i = 0; i < base.length; i++) if (decidir(base[i]) === "include") out.push(base[i]);
    var chaves = Object.keys(estado.decisions);
    for (i = 0; i < chaves.length; i++) {
      id = chaves[i];
      if (estado.decisions[id] === "include" && out.indexOf(id) < 0 && catalogo().indexOf(id) >= 0) out.push(id);
    }
    return out;
  }

  /* verdadeiro só quando a presença do item É decisão do operador — o motor
     não o ofereceu. É o que o rótulo de proveniência anuncia (C4). */
  function escolhaDoOperador(id) {
    return estado.decisions[id] === "include" && ofertados().indexOf(id) < 0;
  }

  /* inclusão que a avaliação já não sustenta — mantida e SINALIZADA, nunca
     descartada nem ressuscitada em silêncio (caso de borda 4/5 do refinamento) */
  function inclusoesSemLastro() {
    return Object.keys(estado.decisions).filter(function (id) {
      return estado.decisions[id] === "include" && ofertados().indexOf(id) < 0;
    });
  }

  function copia(o) { return JSON.parse(JSON.stringify(o)); }

  /* snapshot para SERIALIZAÇÃO: só o que é entrada. Chave ausente quando nada
     foi declarado — é o que mantém `missing ≠ {}` (INV-8). */
  function paraSessao() {
    var out = {};
    if (Object.keys(estado.decisions).length) out.decisions = copia(estado.decisions);
    if (estado.architectureNote !== undefined) out.architectureNote = estado.architectureNote;
    return Object.keys(out).length ? out : undefined;
  }

  /* restauro na importação: valida item a item e RECUSA com mensagem, nunca
     ignora em silêncio (gate `D019-INV8`, alínea de recusa) */
  function daSessao(obj) {
    estado = { decisions: {}, architectureNote: undefined };
    if (obj === undefined || obj === null) return [];
    if (typeof obj !== "object" || Array.isArray(obj)) return ["reportCuration não é objeto"];
    var erros = [], off = obj.decisions;
    if (off !== undefined) {
      if (typeof off !== "object" || off === null || Array.isArray(off)) erros.push("decisions não é objeto");
      else Object.keys(off).forEach(function (id) {
        var e = valido(id, off[id]);
        if (e) erros.push("decisions: " + e); else estado.decisions[id] = off[id];
      });
    }
    if (obj.architectureNote !== undefined) {
      if (ENUM.indexOf(obj.architectureNote) < 0) erros.push("architectureNote fora do enum: " + String(obj.architectureNote));
      else estado.architectureNote = obj.architectureNote;
    }
    return erros;
  }

  window.__CURATION = {
    __installed: true,
    /* leitura */
    state: function () { return copia({ decisions: estado.decisions, architectureNote: estado.architectureNote }); },
    offered: ofertados,
    catalog: catalogo,
    decide: decidir,
    published: publicados,
    isOperatorChoice: escolhaDoOperador,
    unsupported: inclusoesSemLastro,
    /* escrita — a ÚNICA porta; renderização nunca escreve (R9 §5) */
    set: function (id, valor) {
      var e = valido(id, valor);
      if (e) throw new Error("curadoria: " + e);
      estado.decisions[id] = valor;
      return true;
    },
    setArchitectureNote: function (valor) {
      if (ENUM.indexOf(valor) < 0) throw new Error("curadoria: valor fora do enum fechado: " + String(valor));
      estado.architectureNote = valor;
      return true;
    },
    clear: function () { estado = { decisions: {}, architectureNote: undefined }; },
    /* sessão (consumido por ui_session_v32.js) */
    toSession: paraSessao,
    fromSession: daSessao,
    /* contrato de leitura para os módulos de apresentação */
    contract: function () {
      return {
        published: publicados(),
        offered: ofertados(),
        architectureNote: estado.architectureNote === undefined ? "include" : estado.architectureNote,
        operatorChoices: Object.keys(estado.decisions).filter(escolhaDoOperador),
        suppressed: ofertados().filter(function (id) { return decidir(id) === "exclude"; })
      };
    }
  };
})();
