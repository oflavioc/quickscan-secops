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

   ==========================================================================
   [025 · T020] VALIDAR NÃO É APLICAR
   ==========================================================================
   `validate(obj)` é PURO: não lê nem escreve `estado`. É a única verdade
   sobre o que é curadoria válida (R9 §8) — `fromSession` passou a ser só a
   aplicação sobre entrada que `validate` aceitou; `set`/`unset` continuam
   em `valido()`.

   `fromSession` inválido devolve os erros SEM tocar o estado (sub-caso E do
   EA-91: antes zerava e só depois recusava — a seleção do operador morria
   pela simples tentativa de importar um arquivo ruim). Gate `D025-VAL2`,
   mutante `D025-M2`.

   Forma canônica de "sem curadoria" é a AUSÊNCIA da chave (P1): `null`,
   `{}`, `{decisions:{}}` e chave desconhecida são recusados com mensagem —
   uma grafia por estado, nenhuma grafia que o produto não lê. Gate
   `D025-CAN1`, mutantes `D025-M3`/`D025-M23`.

   `unset(id)`/`unsetArchitectureNote()` devolvem a declaração a AUSENTE
   (P3): o editor escreve só a divergência. Gate `D025-UNS1` (e).
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
    /* [022 · errata E2 — EA-75] O HABILITADO POR SINAL TAMBEM FOI OFERECIDO.

       Este laco deriva de `computeFindings() + MAP`: so o puxado por GAP. Mas a
       curadoria e o PORTEIRO — `decide()` devolve "exclude" para o que nao esta
       aqui —, e por isso um produto habilitado por sinal declarado nunca chegava
       a visao por produto, mesmo depois de o coletor dela passar a encontra-lo.
       Medido: `offered()` com 11 itens, `decide("FortiDLP")` = "exclude", e o
       card morria no filtro sem que nada acusasse.

       O que o motor oferece por sinal e oferta igual: o operador tem de poder
       decidir sobre ela como decide sobre o resto. Nao inclui-la aqui era a
       curadoria opinando por omissao. */
    try {
      if (typeof V32 !== "undefined" && typeof V32.buildRecommendationContext === "function") {
        var ctxs = (V32.buildRecommendationContext() || {}).contexts || {};
        Object.keys(ctxs).forEach(function (capId) {
          ((ctxs[capId] || {}).candidates || []).forEach(function (cd) {
            if (!cd || cd.itemKind !== "offering") return;
            if (!(cd.signals && cd.signals.length)) return;
            var pr = (V32.OFFERINGS && V32.OFFERINGS[cd.itemId]) || null;
            var nome = pr && (pr.n || pr.name);
            if (!nome) return;
            /* a chave da curadoria e a do catalogo da Camada 1, quando existe —
               e `catalogo()` valida contra ela; sem isso `set()` recusaria a
               decisao do operador sobre este produto. */
            var chave = null, k2;
            if (typeof PRODUCTS !== "undefined" && PRODUCTS) {
              for (k2 in PRODUCTS) {
                if (!Object.prototype.hasOwnProperty.call(PRODUCTS, k2)) continue;
                if (PRODUCTS[k2] && PRODUCTS[k2].n === nome) { chave = k2; break; }
              }
            }
            if (!chave) return;              /* fora do catalogo curavel: nao se inventa id */
            if (!vistos[chave]) { vistos[chave] = true; out.push(chave); }
          });
        });
      }
    } catch (e) {
      if (typeof console !== "undefined" && console.error)
        console.error("[022] oferta por sinal nao entrou em offered():", e && e.message);
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

  var CHAVES = ["decisions", "architectureNote"];

  /* [025 · T020] validação PURA do bloco `reportCuration` — não lê nem
     escreve `estado`; [] = válido. Recusa com mensagem, nunca ignora em
     silêncio (gate `D019-INV8`, alínea de recusa; `D025-VAL2`/`D025-CAN1`).
     Precedência (plan.md §Contratos, 1→6): estrutural termina cedo; de campo
     acumula, como `daSessao` já fazia para ids e enum.

     Decisão de interpretação (aceita pelo orquestrador na T020): `undefined`
     devolve []. A spec não fixa este caso; a ausência da chave é a forma
     canônica de "sem curadoria" (P1), e assim `fromSession(x)` e `validate(x)`
     devolvem as mesmas mensagens para todo `x` (`D025-VAL2` (b)). */
  function validar(obj) {
    if (obj === undefined) return [];
    /* 1 */
    if (obj === null) return ["reportCuration é null — represente 'sem curadoria' pela ausência da chave"];
    /* 2 */
    if (typeof obj !== "object" || Array.isArray(obj)) return ["reportCuration não é objeto"];
    var erros = [];
    /* 3 — a mesma estritez que o schema v1 aplica à raiz e a `inputs` */
    var extra = Object.keys(obj).filter(function (k) { return CHAVES.indexOf(k) < 0; });
    if (extra.length) erros.push("reportCuration: campos não reconhecidos: " + extra.join(", "));
    /* 4 */
    if (obj.decisions === undefined && obj.architectureNote === undefined) {
      erros.push("reportCuration sem decisão declarada — represente 'sem curadoria' pela ausência da chave");
      return erros;
    }
    /* 5 */
    var off = obj.decisions;
    if (off !== undefined) {
      if (typeof off !== "object" || off === null || Array.isArray(off)) erros.push("decisions não é objeto");
      else if (!Object.keys(off).length) erros.push("decisions sem chaves — represente 'nenhuma decisão por produto' pela ausência do campo");
      else Object.keys(off).forEach(function (id) {
        var e = valido(id, off[id]);
        if (e) erros.push("decisions: " + e);
      });
    }
    /* 6 */
    if (obj.architectureNote !== undefined && ENUM.indexOf(obj.architectureNote) < 0)
      erros.push("architectureNote fora do enum: " + String(obj.architectureNote));
    return erros;
  }

  /* restauro na importação — APLICAÇÃO sobre entrada que `validar` aceitou.
     `undefined` limpa (a ausência substitui). Inválido devolve os erros SEM
     tocar o estado (sub-caso E do EA-91; `D025-M2`). Válido substitui o estado
     inteiro, nunca merge (`D025-M9`). */
  function daSessao(obj) {
    if (obj === undefined) { estado = { decisions: {}, architectureNote: undefined }; return []; }
    var erros = validar(obj);
    if (erros.length) return erros;
    var novo = { decisions: {}, architectureNote: undefined };
    if (obj.decisions !== undefined)
      Object.keys(obj.decisions).forEach(function (id) { novo.decisions[id] = obj.decisions[id]; });
    if (obj.architectureNote !== undefined) novo.architectureNote = obj.architectureNote;
    estado = novo;
    return [];
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
    /* [025 · T020] volta a AUSENTE (P3). O id passa pela mesma checagem de
       `set` — `valido()` com um valor do enum, para que só o id possa
       reprovar: uma verdade só sobre o catálogo (R9 §8). */
    unset: function (id) {
      var e = valido(id, ENUM[0]);
      if (e) throw new Error("curadoria: " + e);
      delete estado.decisions[id];
      return true;
    },
    unsetArchitectureNote: function () {
      estado.architectureNote = undefined;
      return true;
    },
    clear: function () { estado = { decisions: {}, architectureNote: undefined }; },
    /* sessão (consumido por ui_session_v32.js) */
    validate: validar,
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
