/* ============================================================================
   PHASE 5.0 · microfase 5.0.3 — SUFFICIENCY-AWARE RESULTS
   Camada 5 · CAMADA DERIVADA DE SUFICIÊNCIA (UI-012A)

   Este módulo NÃO é dono do veredito canônico. A fonte funcional canônica
   continua sendo `dataSufficiency()` na Camada 1 — booleana, byte-idêntica,
   com assinatura, retorno e posição inalterados. Aqui existe apenas uma
   projeção ESTRUTURADA do mesmo estado, para que o renderer possa explicar o
   déficit sem reimplementar o gate.

   Contratos implementados:
     UI-009A  moeda canônica: respostas confirmadas (v !== null && v !== "NA")
     UI-012A  contrato derivado estruturado + declaração ÚNICA dos limiares
     UI-012   mensagem construtiva consumida exclusivamente do contrato
     UI-016a  os três estados do eixo de respostas permanecem distintos

   Arquitetura (§4 da diretriz · REV B §29.2):
     - exporta funções; registra decorator por window.__P50.registerDecor;
     - NÃO atribui window.__uxDecor; não recaptura predecessor; não cria
       segunda lista de decoradores nem segundo agregador;
     - idempotente; falha de apresentação isolada;
     - não cria owner paralelo de respostas, estatísticas, target ou sessão;
     - não serializa o contrato: ele é sempre derivado do estado canônico.

   Disciplina: zero innerHTML. Todo texto por textContent, todo atributo por
   setAttribute.
   ========================================================================== */
(function () {
  "use strict";
  if (window.__P50SUFF && window.__P50SUFF.__installed) return;

  /* ==========================================================================
     DECLARAÇÃO ÚNICA DOS LIMIARES (UI-012A §3)
     Esta é a única declaração nova de limiares autorizada na Camada 5. Ela
     ESPELHA os literais da Camada 1 — não os substitui e não os importa. A
     equivalência não é presumida: é provada exaustivamente pelo gate
     P50-SUF7 sobre os 4^5 = 1024 vetores de contagem confirmada por domínio,
     e a equivalência de estado por P50-SUF8.
     ========================================================================== */
  var P50_SUFF_REQUIRED = { global: 10, domain: 2 };

  /* Déficit nunca negativo. Único ponto de aritmética de déficit da fase. */
  function p50Deficit(required, have) {
    var d = required - have;
    return d > 0 ? d : 0;
  }

  /* ==========================================================================
     CONTRATO DERIVADO ESTRUTURADO
     Lê as funções REAIS do runtime congelado — confirmedCount() e domStat().n
     — no escopo compartilhado do bloco injetado. Nenhum owner paralelo.
     ========================================================================== */
  function p50SuffContract() {
    var confirmedGlobal = confirmedCount();
    var domains = [];
    var allDomainsMet = true;
    for (var i = 0; i < DOMS.length; i++) {          /* ordem canônica de DOMS */
      var have = domStat(i).n;
      var miss = p50Deficit(P50_SUFF_REQUIRED.domain, have);
      if (miss !== 0) allDomainsMet = false;
      domains.push({
        domainId: i,                                  /* identidade canônica = índice de DOMS */
        confirmed: have,
        required: P50_SUFF_REQUIRED.domain,
        missing: miss
      });
    }
    var missingGlobal = p50Deficit(P50_SUFF_REQUIRED.global, confirmedGlobal);
    return {
      confirmedGlobal: confirmedGlobal,
      requiredGlobal: P50_SUFF_REQUIRED.global,
      missingGlobal: missingGlobal,
      domains: domains,
      sufficient: missingGlobal === 0 && allDomainsMet
    };
  }

  /* Condições pendentes = EXATAMENTE os déficits do contrato.
     Nenhum domínio satisfeito é emitido; nenhum domínio deficitário é omitido;
     nenhum déficit é recalculado aqui. */
  function p50Pending(contract) {
    var out = [];
    for (var i = 0; i < contract.domains.length; i++) {
      var dd = contract.domains[i];
      if (dd.missing > 0) out.push(dd);
    }
    return out;
  }

  /* ==========================================================================
     Composição dos três estados do eixo de respostas por domínio (UI-016a).
     Apresentação apenas: NÃO faz parte do contrato e não influencia o veredito.
     ========================================================================== */
  function p50DomainAxis(i) {
    var st = domStat(i);
    var total = st.idx.length;
    return { confirmed: st.n, toValidate: st.nNA, unanswered: total - st.n - st.nNA, total: total };
  }

  /* ---------------- helpers de DOM seguros (sem innerHTML) ---------------- */
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) { for (var k in attrs) { if (attrs[k] !== null) n.setAttribute(k, String(attrs[k])); } }
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  }
  function plural(n, one, many) { return n === 1 ? one : many; }

  /* ---------------- textos, todos derivados do contrato ------------------- */
  function p50GlobalLine(contract) {
    if (contract.missingGlobal > 0) {
      return plural(contract.missingGlobal, "Falta ", "Faltam ") + contract.missingGlobal + " " +
             plural(contract.missingGlobal, "resposta confirmada", "respostas confirmadas") +
             " no total (" + contract.confirmedGlobal + " de " + contract.requiredGlobal + ").";
    }
    /* R2 (auditoria 5.0.4) · com o gate aberto, `confirmedGlobal` pode superar
       `requiredGlobal` e a forma "15 de 10" lia-se como erro. Contagem e
       limiar passam a ser grandezas declaradas separadamente. Os dois números
       continuam vindo do contrato (UI-012A); nenhum literal 10/2 aqui. As
       linhas de DÉFICIT preservam a forma "(N de M)", correta quando N < M. */
    return contract.confirmedGlobal + " " +
           plural(contract.confirmedGlobal, "resposta confirmada", "respostas confirmadas") +
           " no total · mínimo requerido: " + contract.requiredGlobal + ".";
  }
  function p50DeficitLine(entry) {
    return DOMS[entry.domainId].pt + ": +" + entry.missing + " " +
           plural(entry.missing, "resposta confirmada necessária", "respostas confirmadas necessárias") +
           " (" + entry.confirmed + " de " + entry.required + ").";
  }
  function p50AxisLine(i, axis) {
    return DOMS[i].pt + " · " +
      axis.confirmed + " " + plural(axis.confirmed, "confirmada", "confirmadas") + " · " +
      axis.toValidate + " a validar · " +
      axis.unanswered + " " + plural(axis.unanswered, "não respondida", "não respondidas");
  }

  /* ==========================================================================
     Painel de suficiência (superfície nova da 5.0.3)
     ========================================================================== */
  var p50SuffErrors = 0;
  var p50SuffForceFailure = false;

  function p50BuildSuffPanel(contract) {
    var sec = el("section", {
      id: "p50-suff",
      "class": "p50-suff",
      "data-p50": "sufficiency",
      "data-p50-sufficient": contract.sufficient ? "true" : "false"
    });
    sec.appendChild(el("h3", { "class": "p50-suff-title", "data-p50": "suff-title" },
      "Suficiência de evidência"));

    sec.appendChild(el("p", {
      "class": "p50-suff-global",
      "data-p50": "suff-global",
      "data-p50-confirmed": contract.confirmedGlobal,
      "data-p50-required": contract.requiredGlobal,
      "data-p50-missing": contract.missingGlobal
    }, p50GlobalLine(contract)));

    var pend = p50Pending(contract);
    if (pend.length) {
      var ul = el("ul", { "class": "p50-suff-deficits", "data-p50": "suff-deficits" });
      for (var i = 0; i < pend.length; i++) {
        ul.appendChild(el("li", {
          "class": "p50-suff-deficit",
          "data-p50": "suff-deficit",
          "data-dom": pend[i].domainId,
          "data-missing": pend[i].missing
        }, p50DeficitLine(pend[i])));
      }
      sec.appendChild(ul);
    }

    /* composição dos três estados por domínio — UNSET ≠ NA ≠ NONE */
    var comp = el("ul", { "class": "p50-suff-domains", "data-p50": "suff-domains" });
    for (var j = 0; j < DOMS.length; j++) {
      var axis = p50DomainAxis(j);
      comp.appendChild(el("li", {
        "class": "p50-suff-domain",
        "data-p50": "suff-domain",
        "data-dom": j,
        "data-p50-confirmed": axis.confirmed,
        "data-p50-tovalidate": axis.toValidate,
        "data-p50-unanswered": axis.unanswered
      }, p50AxisLine(j, axis)));
    }
    sec.appendChild(comp);

    if (!contract.sufficient) {
      sec.appendChild(el("p", { "class": "p50-suff-guidance", "data-p50": "suff-guidance" },
        "Continue o assessment para atingir evidência suficiente."));
    }
    return sec;
  }

  /* Decorator registrado no agregador ÚNICO da 5.0.1 (não reatribui nada). */
  function p50SuffDecor(app) {
    if (p50SuffForceFailure) throw new Error("P50 suff failure (test hook)");
    var host = app || document.getElementById("app");
    if (!host) return;
    var old = document.getElementById("p50-suff");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    host.appendChild(p50BuildSuffPanel(p50SuffContract()));
  }

  if (window.__P50 && typeof window.__P50.registerDecor === "function") {
    window.__P50.registerDecor(function (app) {
      try { p50SuffDecor(app); }
      catch (e) { p50SuffErrors++; console.error("P50 suff:", e.message); }
    });
  }

  /* ==========================================================================
     API do módulo — consumo pelo renderer da 5.0.3 e pelos gates.
     Somente leitura derivada; nada aqui grava estado canônico.
     ========================================================================== */
  window.__P50SUFF = {
    __installed: true,
    contract: p50SuffContract,
    pending: p50Pending,
    axis: p50DomainAxis,
    globalLine: p50GlobalLine,
    deficitLine: p50DeficitLine,
    diag: function () { return { errors: p50SuffErrors, required: { global: P50_SUFF_REQUIRED.global, domain: P50_SUFF_REQUIRED.domain } }; },
    __forceFailure: function (on) { p50SuffForceFailure = !!on; }
  };
})();
