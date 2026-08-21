/* ============================================================================
   PHASE 5.0 · microfase 5.0.3 — SUFFICIENCY-AWARE RESULTS
   Camada 5 · RENDERER DO GATE EXECUTIVO (UI-012 · UI-013 · UI-014 · UI-020)

   Inclui a correção B-503-COHERENCE: neutralização da superfície LEGADA de
   resultados sob gate fechado, por decoração pós-render, sem tocar em
   `ui_v32.js`, `ui_v32.css`, engine ou print.

   Escopo desta microfase (subconjunto da responsabilidade final do módulo
   descrita na REV B §29.2): bloqueio do resultado executivo enquanto a
   evidência for insuficiente, liberação quando o veredito canônico permitir,
   rebloqueio ao voltar a ser insuficiente, `n/d` + "Não avaliado" nas
   superfícies novas aplicáveis e executive cards estritamente gated.

   NÃO implementa (5.0.4, deliberadamente ausente): heat map domínio→pergunta,
   drill-down analítico, visual Current × Target, gap de target, P50-VIS9.

   Disciplina de consumo (UI-012A §regras de consumo · §5.4 da diretriz):
   este renderer consome EXCLUSIVAMENTE o contrato derivado estruturado. Ele
   não contém os limiares, não compara contagens, não recalcula déficits, não
   chama a contagem canônica para reconstruir mensagem e não cria veredito
   próprio. O único dado canônico que lê diretamente é o score já computado
   por domStat(i).score e a classificação de severidade já produzida pelo
   motor congelado (computeFindings) — nenhuma matemática nova.

   Nada aqui fabrica score, ranking, strength, priority, stage ou target: os
   cards refletem a classificação que o motor congelado já produziu, na ordem
   que ele já produziu. Onde não há dado canônico seguro, o card declara a
   ausência em vez de inventar conteúdo.

   Disciplina: zero innerHTML. Todo texto por textContent, todo atributo por
   setAttribute.
   ========================================================================== */
(function () {
  "use strict";
  if (window.__P50RESULTS && window.__P50RESULTS.__installed) return;

  var p50ResErrors = 0;
  var p50ResForceFailure = false;

  /* ---------------- helpers de DOM seguros (sem innerHTML) ---------------- */
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) { for (var k in attrs) { if (attrs[k] !== null) n.setAttribute(k, String(attrs[k])); } }
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  }

  /* ==========================================================================
     Linhas de domínio.
     UI-014: com o veredito global BLOQUEADO, o resumo executivo do domínio na
     superfície nova é sempre `n/d` + "Não avaliado · evidência insuficiente" —
     nunca um zero fabricado e nunca um score parcial promovido a veredito.
     Com o veredito ABERTO, exibe o score canônico já computado pelo runtime.
     ========================================================================== */
  function p50DomainRow(i, released) {
    var row = el("li", {
      "class": "p50-res-domain",
      "data-p50": "results-domain",
      "data-dom": i,
      "data-p50-state": released ? "scored" : "unavailable"
    });
    row.appendChild(el("span", { "class": "p50-res-domain-name", "data-p50": "results-domain-name" },
      DOMS[i].pt));
    if (released) {
      var canonical = domStat(i).score;               /* score canônico, já computado */
      row.appendChild(el("span", { "class": "p50-res-domain-value", "data-p50": "results-domain-value" },
        canonical === null ? "n/d" : canonical.toFixed(1)));
      row.appendChild(el("span", { "class": "p50-res-domain-label", "data-p50": "results-domain-label" },
        canonical === null ? "Não avaliado · evidência insuficiente" : "maturidade indicativa do domínio"));
    } else {
      row.appendChild(el("span", { "class": "p50-res-domain-value", "data-p50": "results-domain-value" },
        "n/d"));
      row.appendChild(el("span", { "class": "p50-res-domain-label", "data-p50": "results-domain-label" },
        "Não avaliado · evidência insuficiente"));
    }
    return row;
  }

  /* ==========================================================================
     Executive cards (UI-020) — construídos SOMENTE com gate aberto e SOMENTE
     a partir da classificação que o motor congelado já produziu.
     ========================================================================== */
  function p50ConfirmedStrengths() {
    var out = [];
    for (var k = 0; k < QS.length; k++) {
      var a = ans[k];
      if (a === null || a === "NA") continue;          /* não confirmada: fora */
      var m = MAP[QS[k].id].lv[a];
      if (m && m.s > 0) continue;                      /* o motor já classificou como gap */
      out.push({ k: k, cap: MAP[QS[k].id].cap, lbl: QS[k].lbl, dom: QS[k].dom });
    }
    return out;                                        /* ordem canônica de QS; sem ranking novo */
  }

  function p50HighGaps() {
    var f = computeFindings().findings;                /* ordem produzida pelo motor congelado */
    var out = [];
    for (var i = 0; i < f.length; i++) {
      if (f[i].sev === 2) out.push({                   /* severidade alta, tal como o motor define */
        cap: MAP[f[i].id].cap, lbl: QS[f[i].k].lbl, dom: QS[f[i].k].dom
      });
    }
    return out;
  }

  function p50Card(kind, title, note, items) {
    var card = el("div", { "class": "p50-res-card", "data-p50": "exec-card", "data-card": kind });
    card.appendChild(el("h4", { "class": "p50-res-card-title" }, title));
    if (items.length) {
      var ul = el("ul", { "class": "p50-res-card-list" });
      for (var i = 0; i < items.length; i++) {
        var li = el("li", { "class": "p50-res-card-item", "data-p50": "exec-item", "data-dom": items[i].dom });
        li.appendChild(el("span", { "class": "p50-res-card-cap" }, items[i].cap));
        li.appendChild(el("span", { "class": "p50-res-card-q" }, items[i].lbl));
        ul.appendChild(li);
      }
      card.appendChild(ul);
    } else {
      card.appendChild(el("p", { "class": "p50-res-card-empty", "data-p50": "exec-empty" }, note));
    }
    return card;
  }

  function p50ExecCards() {
    var box = el("div", { "class": "p50-res-cards", "data-p50": "exec-cards" });
    box.appendChild(p50Card("strengths", "Pontos fortes observados",
      "Nenhuma prática sem gap foi registrada entre as respostas confirmadas desta sessão.",
      p50ConfirmedStrengths()));
    box.appendChild(p50Card("priorities", "Prioridades de evolução",
      "Nenhum gap alto foi identificado entre as respostas confirmadas desta sessão.",
      p50HighGaps()));
    return box;
  }

  /* ==========================================================================
     B-503-COHERENCE · neutralização da superfície LEGADA sob gate fechado.

     Fato corrigido: com o veredito canônico fechado, a mesma página exibia
     duas verdades contraditórias — scores parciais por domínio, estágios
     (`Defined`, `Optimizing`), rulers preenchidos e radar parcial na superfície
     congelada, e `n/d · Não avaliado · evidência insuficiente` na superfície
     P50. Para o usuário isso é materialmente contraditório.

     Feito EXCLUSIVAMENTE por decoração pós-render: `ui_v32.js`, `ui_v32.css`,
     engine e print permanecem byte-idênticos.

     DISCIPLINA (aprendida ao quebrar a suíte congelada UG na primeira tentativa):
     nenhum nó congelado é mutado, reescrito ou removido. O contrato congelado de
     geometria UNSET (13 gates da suíte UG) assere o texto e a estrutura desses
     mesmos nós — inclusive sob gate fechado. Portanto os nós contraditórios são
     apenas RETIRADOS DA TELA E DA ÁRVORE ACESSÍVEL (`aria-hidden` + ocultação
     por CSS da Camada 5), e a informação honesta entra em elementos NOVOS,
     próprios da fase. Restaurar é reexibir e remover os elementos novos: não há
     texto guardado que possa ressuscitar um valor obsoleto.

     Duas formas de ocultar, pela razão certa:
       `p50-legacy-gone`   display:none    — onde nenhuma suíte mede caixa;
       `p50-legacy-veiled` visibility:hidden — nos filhos do radar, cuja CAIXA é
                           medida pelo gate congelado UG13 (bbox disjuntos).
     Em ambos os casos o conteúdo sai da árvore acessível.
     ========================================================================== */
  var P50_LEG_STATE = "Não avaliado · evidência insuficiente";

  function legHide(node, mode) {
    if (!node || node.getAttribute("data-p50-legacy") === "hidden") return;
    node.setAttribute("aria-hidden", "true");
    node.classList.add(mode === "veiled" ? "p50-legacy-veiled" : "p50-legacy-gone");
    node.setAttribute("data-p50-legacy", "hidden");
  }
  function legShow(node) {
    if (!node || node.getAttribute("data-p50-legacy") !== "hidden") return;
    node.removeAttribute("aria-hidden");
    node.classList.remove("p50-legacy-gone");
    node.classList.remove("p50-legacy-veiled");
    node.removeAttribute("data-p50-legacy");
  }
  function legNote(host, kind, text, tag) {
    if (!host || host.querySelector("[data-p50=\"" + kind + "\"]")) return;
    host.appendChild(el(tag || "p", { "class": "p50-legacy-note", "data-p50": kind }, text));
  }
  function legDropNote(root, kind) {
    if (!root) return;
    var n = root.querySelector("[data-p50=\"" + kind + "\"]");
    if (n && n.parentNode) n.parentNode.removeChild(n);
  }

  function p50NeutralizeLegacy(contract) {
    var head = document.querySelector("#app .res-head");
    var rows = document.querySelectorAll("#app .grid2 .panel .dom");
    var panel = rows.length ? rows[0].parentNode : null;
    var radar = head ? head.querySelector(".radar-box") : null;
    var legend = panel ? panel.querySelector(".scale-legend") : null;
    var blocked = contract.sufficient !== true;
    var i, k;

    if (blocked) {
      if (radar) {
        for (i = 0; i < radar.children.length; i++) {
          if (!radar.children[i].classList.contains("p50-legacy-note")) legHide(radar.children[i], "veiled");
        }
        radar.classList.add("p50-legacy-off");
        radar.setAttribute("data-p50-legacy", "neutralized");
        legNote(radar, "legacy-radar-note",
          "Perfil de maturidade por domínio indisponível — evidência insuficiente.");
      }
      legHide(legend, "gone");
      legNote(panel, "legacy-domain-banner",
        "Evidência insuficiente: nenhum score de maturidade por domínio é apresentado até o gate canônico abrir.");
    } else {
      if (radar) {
        legDropNote(radar, "legacy-radar-note");
        for (i = 0; i < radar.children.length; i++) legShow(radar.children[i]);
        radar.classList.remove("p50-legacy-off");
        radar.removeAttribute("data-p50-legacy");
      }
      legShow(legend);
      legDropNote(panel, "legacy-domain-banner");
    }

    for (i = 0; i < rows.length; i++) {
      var row = rows[i];
      var lbl = row.querySelector(".lbl");
      var value = row.querySelector(".lbl > span");
      var conf = row.querySelector(".conf");
      var ruler = row.querySelector(".ruler");
      var fill = ruler ? ruler.querySelector(".fill") : null;
      if (blocked) {
        legHide(value, "gone");
        legHide(conf, "gone");
        legHide(fill, "gone");
        if (ruler) ruler.setAttribute("data-p50-legacy", "neutralized");
        row.setAttribute("data-p50-legacy", "neutralized");
        /* elementos NOVOS: o `n/d` do valor não é um <span> para não alterar a
           coleção `.lbl > span` que a suíte congelada UG9 percorre. */
        legNote(lbl, "legacy-domain-value", "n/d", "b");
        var total = 0;
        for (k = 0; k < QS.length; k++) if (QS[k].dom === i) total++;
        var d = contract.domains[i];
        legNote(row, "legacy-domain-conf",
          (d ? d.confirmed : 0) + " de " + total +
          " respostas confirmadas · diagnóstico parcial, não é veredito de maturidade", "div");
        legNote(row, "legacy-domain-state-" + i, P50_LEG_STATE, "div");
      } else {
        legShow(value);
        legShow(conf);
        legShow(fill);
        if (ruler) ruler.removeAttribute("data-p50-legacy");
        row.removeAttribute("data-p50-legacy");
        legDropNote(lbl, "legacy-domain-value");
        legDropNote(row, "legacy-domain-conf");
        legDropNote(row, "legacy-domain-state-" + i);
      }
    }
  }

  /* ==========================================================================
     Superfície do gate executivo.
     ========================================================================== */
  function p50BuildResults(contract) {
    var released = contract.sufficient === true;
    var sec = el("section", {
      id: "p50-results",
      "class": "p50-res",
      "data-p50": "results",
      "data-p50-gate": released ? "released" : "blocked"
    });
    sec.appendChild(el("h3", { "class": "p50-res-title", "data-p50": "results-title" },
      "Resultado executivo"));
    sec.appendChild(el("p", { "class": "p50-res-verdict", "data-p50": "results-verdict" },
      released ? "Resultado executivo: liberado pelo veredito canônico."
               : "Resultado executivo: BLOQUEADO."));
    sec.appendChild(el("p", { "class": "p50-res-lead", "data-p50": "results-lead" },
      released
        ? "A evidência registrada atende ao requisito canônico; os itens abaixo refletem somente as respostas confirmadas."
        : "Resultado ainda indisponível — as condições pendentes estão listadas no painel de suficiência acima."));

    var list = el("ul", { "class": "p50-res-domains", "data-p50": "results-domains" });
    for (var i = 0; i < DOMS.length; i++) list.appendChild(p50DomainRow(i, released));
    sec.appendChild(list);

    if (released) sec.appendChild(p50ExecCards());
    return sec;
  }

  /* Decorator registrado no agregador ÚNICO da 5.0.1 (não reatribui nada).
     Reconstrução total a cada passagem: nenhum veredito, score, estágio ou
     card sobrevive a uma transição de estado. */
  function p50ResultsDecor(app) {
    if (p50ResForceFailure) throw new Error("P50 results failure (test hook)");
    var host = app || document.getElementById("app");
    if (!host) return;
    var old = document.getElementById("p50-results");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    if (!window.__P50SUFF || typeof window.__P50SUFF.contract !== "function") return;
    var contract = window.__P50SUFF.contract();
    p50NeutralizeLegacy(contract);      /* B-503-COHERENCE: uma só verdade na tela */
    host.appendChild(p50BuildResults(contract));
  }

  if (window.__P50 && typeof window.__P50.registerDecor === "function") {
    window.__P50.registerDecor(function (app) {
      try { p50ResultsDecor(app); }
      catch (e) { p50ResErrors++; console.error("P50 results:", e.message); }
    });
  }

  window.__P50RESULTS = {
    __installed: true,
    diag: function () { return { errors: p50ResErrors }; },
    __forceFailure: function (on) { p50ResForceFailure = !!on; }
  };
})();
