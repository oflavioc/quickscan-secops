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

   MICROFASE 5.0.4 · TARGET & HEAT MAP VISUALIZATIONS (UI-015 · UI-016 ·
   UI-017 · UI-018 · UI-019 · UI-028 · UI-030): tabs de Results sem framework
   mapping, heat map domínio→pergunta, eixo de presence UNSET × NONE,
   drill-down explicável e Current × Target derivado SOMENTE do alvo canônico.

   Fontes canônicas consumidas, nenhuma delas reimplementada:
     respostas          ans[k]                       (owner congelado)
     score de domínio   domStat(i).score
     perfis             tgtCurrentProfile() / computeTargetProfile(tgtEffectiveVector())
     alvo               TARGET_PROFILE.overrides     (nunca fixo, nunca inferido)
     presence           V32.TECH_LANDSCAPE[cap].presence
     suficiência        window.__P50SUFF.contract()  (UI-012A)
   O estado de tab é apresentação pura: vive em variável de módulo, não entra
   em owner canônico algum, não é serializado e não dispara render congelado.

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
     5.0.4 · MODELO DE DADOS ÚNICO (UI-015 · UI-017 · UI-030)
     O heat map, o drill-down, o Current × Target e a alternativa acessível
     consomem ESTA função e mais nada. Uma única derivação garante que a
     tabela acessível não possa divergir do gráfico (P50-ACC5).
     Nada aqui recalcula suficiência: o déficit vem pronto do contrato.
     ========================================================================== */
  var P50_ANS_LABEL = {
    unset: { visible: "n/d", acc: "Não avaliado", cue: "tracejado" },
    na: { visible: "Não sei", acc: "Não sei · precisa validar", cue: "italico" },
    confirmed: { visible: null, acc: "confirmado", cue: "solido" }
  };

  function p50Overrides() {
    return (typeof TARGET_PROFILE !== "undefined" && TARGET_PROFILE) ? TARGET_PROFILE.overrides : {};
  }
  function p50HasOverrides() {
    var ov = p50Overrides();
    for (var k in ov) { if (Object.prototype.hasOwnProperty.call(ov, k)) return true; }
    return false;
  }
  function p50Round1(v) { return Math.round(v * 10) / 10; }

  function p50Matrix(contract) {
    var ov = p50Overrides();
    var hasOv = p50HasOverrides();
    /* UI-013/UI-014 · B-503-COHERENCE: o AGREGADO por domínio só existe quando
       o veredito canônico abre. O eixo por PERGUNTA (UI-015/UI-016a) continua
       honesto em qualquer estado — inclusive o nível 0 confirmado, que é
       plotado normalmente (UG7). Não confundir os dois eixos foi exatamente o
       defeito que a 5.0.3 corrigiu na superfície legada. */
    var released = contract.sufficient === true;
    /* perfil-alvo canônico: calculado pelo runtime congelado, nunca por nós */
    var tgtStats = hasOv ? computeTargetProfile(tgtEffectiveVector()).stats : null;
    var out = { domains: [], hasOverrides: hasOv, released: released };
    for (var i = 0; i < DOMS.length; i++) {
      var d = contract.domains[i];
      var current = released ? domStat(i).score : null;   /* agregado: só com gate aberto */
      var cells = [], domHasTarget = false;
      for (var k = 0; k < QS.length; k++) {
        if (QS[k].dom !== i) continue;
        var a = ans[k];
        var state = (a === null) ? "unset" : (a === "NA" ? "na" : "confirmed");
        var level = (state === "confirmed") ? a : null;
        var score = (level === null) ? null : SCORES[level];
        var qid = QS[k].id;
        var tLevel = Object.prototype.hasOwnProperty.call(ov, qid) ? ov[qid] : null;
        if (tLevel !== null) domHasTarget = true;
        var tScore = (tLevel === null) ? null : SCORES[tLevel];
        cells.push({
          k: k, qid: qid, lbl: QS[k].lbl, dom: i,
          state: state, level: level, score: score,
          targetLevel: tLevel, targetScore: tScore,
          gap: (score !== null && tScore !== null) ? p50Round1(tScore - score) : null,
          note: (typeof notes !== "undefined" && notes[k]) ? String(notes[k]) : ""
        });
      }
      var domTarget = (domHasTarget && tgtStats) ? tgtStats[i].score : null;
      out.domains.push({
        dom: i, name: DOMS[i].pt, released: released,
        deficit: d.missing, confirmed: d.confirmed, required: d.required,
        current: current, hasTarget: domHasTarget, target: domTarget,
        gap: (current !== null && domTarget !== null) ? p50Round1(domTarget - current) : null,
        cells: cells
      });
    }
    return out;
  }

  /* Texto de estado por célula — sempre presente, nunca só cor (UX-P7). */
  function p50CellState(c) {
    if (c.state === "confirmed") return c.score.toFixed(1);
    return P50_ANS_LABEL[c.state].visible;
  }
  function p50CellAcc(c, domName, sufficient) {
    var base = domName + " · " + c.lbl + ": ";
    if (c.state === "confirmed") base += "confirmado · " + c.score.toFixed(1) + " de 5";
    else base += P50_ANS_LABEL[c.state].acc + " · sem score";
    if (c.targetScore !== null) {
      base += " · alvo declarado " + c.targetScore.toFixed(1);
      if (c.gap !== null) base += " · gap " + (c.gap >= 0 ? "+" : "") + c.gap.toFixed(1);
    }
    if (!sufficient) base += " · domínio com evidência insuficiente";
    return base;
  }

  /* Aplica os atributos de dado a um nó — o MESMO conjunto no gráfico e na
     alternativa acessível, de modo que a comparação campo a campo seja
     estruturalmente impossível de divergir. */
  function p50CellAttrs(node, c, dm) {
    node.setAttribute("data-dom", String(c.dom));
    node.setAttribute("data-qid", c.qid);
    node.setAttribute("data-k", String(c.k));
    node.setAttribute("data-p50-ans", c.state);
    node.setAttribute("data-p50-domain-sufficient", dm.deficit === 0 ? "true" : "false");
    node.setAttribute("data-p50-cue", P50_ANS_LABEL[c.state].cue);
    if (c.level !== null) node.setAttribute("data-p50-level", String(c.level));
    if (c.score !== null) node.setAttribute("data-p50-score", c.score.toFixed(1));
    if (c.targetScore !== null) node.setAttribute("data-p50-target", c.targetScore.toFixed(1));
    if (c.gap !== null) node.setAttribute("data-p50-gap", c.gap.toFixed(1));
    return node;
  }

  /* ---------------- heat map domínio → pergunta (UI-015) ---------------- */
  function p50HeatMap(mx, contract) {
    var box = el("div", { "class": "p50-hm", "data-p50": "heatmap",
      "role": "group", "aria-label": "Heat map de maturidade por domínio e pergunta" });
    for (var i = 0; i < mx.domains.length; i++) {
      var dm = mx.domains[i];
      var row = el("div", { "class": "p50-hm-row", "data-p50": "hm-row", "data-dom": String(dm.dom),
        "data-p50-domain-sufficient": dm.deficit === 0 ? "true" : "false" });
      var head = el("div", { "class": "p50-hm-dom", "data-p50": "hm-dom" });
      head.appendChild(el("span", { "class": "p50-hm-dom-name" }, dm.name));
      head.appendChild(el("span", { "class": "p50-hm-dom-state", "data-p50": "hm-dom-state" },
        dm.deficit === 0 ? "evidência suficiente"
                         : "faltam " + dm.deficit + " · evidência insuficiente"));
      row.appendChild(head);
      var cellbox = el("div", { "class": "p50-hm-cells" });
      for (var j = 0; j < dm.cells.length; j++) {
        var c = dm.cells[j];
        var cell = el("div", { "class": "p50-hm-cell", "data-p50": "hm-cell",
          "data-p50-fill": c.state === "confirmed" ? "level" : "none" });
        p50CellAttrs(cell, c, dm);
        cell.setAttribute("aria-label", p50CellAcc(c, dm.name, dm.deficit === 0));
        cell.appendChild(el("span", { "class": "p50-hm-q", "data-p50": "hm-q" }, c.lbl));
        cell.appendChild(el("span", { "class": "p50-hm-state", "data-p50": "hm-state" }, p50CellState(c)));
        if (c.targetScore !== null)
          cell.appendChild(el("span", { "class": "p50-hm-target", "data-p50": "hm-target" },
            "alvo " + c.targetScore.toFixed(1)));
        cellbox.appendChild(cell);
      }
      row.appendChild(cellbox);
      box.appendChild(row);
    }
    return box;
  }

  /* ------------- alternativa acessível do heat map (P50-ACC5) ------------- */
  function p50AltTable(mx) {
    var wrap = el("div", { "class": "p50-alt" });
    var table = el("table", { "class": "p50-alt-table", "data-p50": "alt-table" });
    table.appendChild(el("caption", { "class": "p50-alt-caption" },
      "Alternativa acessível do heat map — mesmos dados, em tabela"));
    var thead = el("thead"), htr = el("tr");
    var HEADS = ["Domínio", "Pergunta", "Estado", "Atual", "Alvo", "Gap", "Suficiência"];
    for (var h = 0; h < HEADS.length; h++) htr.appendChild(el("th", { "scope": "col" }, HEADS[h]));
    thead.appendChild(htr); table.appendChild(thead);
    var tbody = el("tbody");
    for (var i = 0; i < mx.domains.length; i++) {
      var dm = mx.domains[i];
      for (var j = 0; j < dm.cells.length; j++) {
        var c = dm.cells[j];
        var tr = el("tr", { "class": "p50-alt-row", "data-p50": "alt-row" });
        p50CellAttrs(tr, c, dm);
        tr.appendChild(el("th", { "scope": "row" }, dm.name));
        tr.appendChild(el("td", null, c.lbl));
        tr.appendChild(el("td", null, c.state === "confirmed"
          ? "Confirmado" : P50_ANS_LABEL[c.state].acc));
        tr.appendChild(el("td", null, c.score === null ? "n/d" : c.score.toFixed(1)));
        tr.appendChild(el("td", null, c.targetScore === null ? "sem alvo declarado" : c.targetScore.toFixed(1)));
        tr.appendChild(el("td", null, c.gap === null ? "n/d" : (c.gap >= 0 ? "+" : "") + c.gap.toFixed(1)));
        tr.appendChild(el("td", null, dm.deficit === 0
          ? "suficiente" : "faltam " + dm.deficit));
        tbody.appendChild(tr);
      }
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  /* ---------------- eixo de presence (UI-016b · §12.2) ---------------- */
  /* Rótulo VISÍVEL do eixo de presence. O runtime congelado mantém o seu mapa
     dentro do IIFE de `ui_v32.js` e não o expõe à Camada 5; o VALOR canônico
     (`V32.TECH_LANDSCAPE[cap].presence`) continua sendo o único owner, e este
     mapa é apenas texto de apresentação PT-BR (UI-033A). P50-UX11 exige que a
     cobertura seja total contra `V32.ENUMS.presence`: se o engine acrescentar
     um estado, o gate falha em vez de vazar o enum cru para a tela. */
  var P50_PRESENCE_LABEL = {
    UNSET: "Não informado",
    NONE: "Não existe / não utilizamos",
    PARTIAL: "Existe parcialmente",
    PRESENT: "Existe",
    UNKNOWN: "Precisa ser validado"
  };
  var P50_PRESENCE_CUE = { UNSET: "tracejado", NONE: "barrado", PARTIAL: "meio",
                           PRESENT: "solido", UNKNOWN: "interrogacao" };
  var P50_PRESENCE_ACC = {
    UNSET: "não informado · não avaliado, nunca ausência",
    NONE: "ausência confirmada · estado declarado",
    PARTIAL: "existe parcialmente · estado declarado",
    PRESENT: "existe · estado declarado",
    UNKNOWN: "precisa ser validado · estado declarado"
  };
  function p50CapDomain(cap) {
    var ids = cap.questionIds || [];
    for (var i = 0; i < ids.length; i++) {
      for (var k = 0; k < QS.length; k++) if (QS[k].id === ids[i]) return QS[k].dom;
    }
    return null;
  }
  function p50PresenceStrip() {
    var V = window.__DEV && window.__DEV.V32 ? window.__DEV.V32 : null;
    if (!V || !V.TECH_LANDSCAPE || !V.CAPABILITIES) return null;
    var box = el("div", { "class": "p50-presence", "data-p50": "presence",
      "role": "group", "aria-label": "Contexto tecnológico declarado por capability" });
    box.appendChild(el("h4", { "class": "p50-presence-title" }, "Contexto tecnológico declarado"));
    box.appendChild(el("p", { "class": "p50-presence-lead" },
      "Não informado e ausência confirmada são estados distintos: nenhum dos dois vira zero."));
    var list = el("ul", { "class": "p50-presence-list" });
    var ids = Object.keys(V.CAPABILITIES);
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i], cap = V.CAPABILITIES[id], L = V.TECH_LANDSCAPE[id];
      if (!L) continue;
      var pres = L.presence;
      var dom = p50CapDomain(cap);
      var chip = el("li", { "class": "p50-presence-chip", "data-p50": "presence-chip",
        "data-cap": id, "data-p50-presence": pres,
        "data-p50-cue": P50_PRESENCE_CUE[pres] || "solido",
        "data-p50-confirmed": pres === "UNSET" ? "false" : "true" });
      if (dom === null) chip.setAttribute("data-p50-nodomain", "true");
      else chip.setAttribute("data-dom", String(dom));
      chip.setAttribute("aria-label", cap.name + ": " + (P50_PRESENCE_LABEL[pres] || pres) +
        " · " + (P50_PRESENCE_ACC[pres] || ""));
      chip.appendChild(el("span", { "class": "p50-presence-cap" }, cap.name));
      chip.appendChild(el("span", { "class": "p50-presence-state", "data-p50": "presence-state" },
        P50_PRESENCE_LABEL[pres] || pres));
      list.appendChild(chip);
    }
    box.appendChild(list);
    return box;
  }

  /* ---------------- drill-down domínio → pergunta (UI-030) ---------------- */
  function p50DrillDown(mx) {
    var box = el("div", { "class": "p50-drill", "data-p50": "drilldown" });
    box.appendChild(el("p", { "class": "p50-drill-lead" },
      "Cada score de domínio decompõe-se nas suas três perguntas. Notas são exibidas em somente leitura, tal como registradas."));
    for (var i = 0; i < mx.domains.length; i++) {
      var dm = mx.domains[i];
      var sec = el("section", { "class": "p50-drill-dom", "data-p50": "drill-dom", "data-dom": String(dm.dom),
        "data-p50-domain-sufficient": dm.deficit === 0 ? "true" : "false" });
      var h = el("h4", { "class": "p50-drill-name" }, dm.name);
      h.appendChild(el("span", { "class": "p50-drill-score", "data-p50": "drill-score" },
        dm.current === null ? " · n/d" : " · " + dm.current.toFixed(1)));
      sec.appendChild(h);
      sec.appendChild(el("p", { "class": "p50-drill-state", "data-p50": "drill-state" },
        !dm.released
          ? "Não avaliado · evidência insuficiente — " + dm.confirmed + " de " + dm.required +
            " respostas confirmadas; a decomposição abaixo é diagnóstico parcial, não veredito de maturidade"
          : (dm.deficit === 0
              ? dm.confirmed + " de " + dm.required + " respostas confirmadas · evidência suficiente"
              : dm.confirmed + " de " + dm.required + " respostas confirmadas · faltam " + dm.deficit)));
      var ul = el("ul", { "class": "p50-drill-qs" });
      for (var j = 0; j < dm.cells.length; j++) {
        var c = dm.cells[j];
        var li = el("li", { "class": "p50-drill-q", "data-p50": "drill-q" });
        p50CellAttrs(li, c, dm);
        li.appendChild(el("span", { "class": "p50-drill-q-label" }, c.lbl));
        li.appendChild(el("span", { "class": "p50-drill-q-state", "data-p50": "drill-q-state" },
          c.state === "confirmed"
            ? "confirmado · " + c.score.toFixed(1)
            : P50_ANS_LABEL[c.state].acc));
        if (c.note)
          li.appendChild(el("p", { "class": "p50-drill-q-note", "data-p50": "drill-q-note" }, c.note));
        else
          li.appendChild(el("p", { "class": "p50-drill-q-nonote", "data-p50": "drill-q-nonote" },
            "sem nota registrada"));
        ul.appendChild(li);
      }
      sec.appendChild(ul);
      box.appendChild(sec);
    }
    return box;
  }

  /* ---------------- Current × Target (UI-017 · UI-018 · UI-019) ----------- */
  function p50CurrentTarget(mx) {
    var box = el("div", { "class": "p50-ct", "data-p50": "current-target",
      "role": "group", "aria-label": "Perfil atual e cenário-alvo por domínio" });
    box.appendChild(el("h4", { "class": "p50-ct-title" }, "Atual × Alvo por domínio"));
    if (!mx.released) {
      /* UI-019 · sem base atual não há comparação: o alvo declarado pode ser
         listado, mas nenhum delta é apresentado contra um current inexistente. */
      box.appendChild(el("p", { "class": "p50-ct-blocked", "data-p50": "ct-blocked" },
        "Perfil atual indisponível — evidência insuficiente. Nenhum valor atual, delta ou gap é apresentado até o gate canônico abrir."));
    }
    if (!mx.hasOverrides) {
      box.appendChild(el("p", { "class": "p50-ct-empty", "data-p50": "ct-empty" },
        "Nenhum cenário-alvo foi declarado nesta sessão. Sem alvo declarado, nenhum alvo é exibido — a superfície não arbitra um valor de referência."));
    } else {
      box.appendChild(el("p", { "class": "p50-ct-lead" },
        "O alvo aparece somente nos domínios em que existe alvo declarado por pergunta. Visualizar o alvo não altera o resultado atual."));
    }
    var list = el("ul", { "class": "p50-ct-rows" });
    for (var i = 0; i < mx.domains.length; i++) {
      var dm = mx.domains[i];
      var plotted = dm.current !== null;
      var row = el("li", { "class": "p50-ct-row", "data-p50": "ct-row", "data-dom": String(dm.dom),
        "data-p50-has-target": dm.hasTarget ? "true" : "false" });
      if (dm.current !== null) row.setAttribute("data-p50-current", dm.current.toFixed(1));
      if (dm.hasTarget && dm.target !== null) row.setAttribute("data-p50-target", dm.target.toFixed(1));
      if (dm.hasTarget && dm.gap !== null) row.setAttribute("data-p50-gap", dm.gap.toFixed(1));
      row.appendChild(el("span", { "class": "p50-ct-name", "data-p50": "ct-name" }, dm.name));

      var track = el("span", { "class": "p50-ct-track", "data-p50": "ct-track" });
      var bar = el("span", { "class": "p50-ct-bar", "data-p50": "ct-current",
        "data-p50-plotted": plotted ? "true" : "false" });
      /* UI-019: current ausente NÃO é desenhado como zero — a barra não é plotada. */
      if (plotted) bar.style.setProperty("--p50-ct-w", (dm.current / 5 * 100).toFixed(2) + "%");
      track.appendChild(bar);
      if (dm.hasTarget && dm.target !== null) {
        var mark = el("span", { "class": "p50-ct-mark", "data-p50": "ct-target" },
          "alvo " + dm.target.toFixed(1));
        mark.style.setProperty("--p50-ct-t", (dm.target / 5 * 100).toFixed(2) + "%");
        track.appendChild(mark);
      }
      row.appendChild(track);
      row.appendChild(el("span", { "class": "p50-ct-value", "data-p50": "ct-current-value" },
        dm.current === null ? "n/d" : dm.current.toFixed(1)));
      if (dm.hasTarget && dm.gap !== null)
        row.appendChild(el("span", { "class": "p50-ct-gap", "data-p50": "ct-gap" },
          (dm.gap >= 0 ? "+" : "") + dm.gap.toFixed(1)));
      else if (dm.current === null && dm.hasTarget)
        row.appendChild(el("span", { "class": "p50-ct-nogap", "data-p50": "ct-nogap" },
          "sem base atual para comparar"));
      list.appendChild(row);
    }
    box.appendChild(list);
    return box;
  }

  /* ==========================================================================
     5.0.4 · TABS DE RESULTS (UI-028) — estado APENAS de apresentação.
     Trocar de tab não chama setter canônico, não dispara render() congelado e
     não toca owner algum: apenas alterna `hidden` e o estado ARIA. O valor
     corrente vive em variável de módulo para sobreviver a re-renders.
     ========================================================================== */
  var P50_TABS = [
    { id: "resumo", label: "Resumo" },
    { id: "dominios", label: "Domínios" },
    { id: "heatmap", label: "Heat Map" },
    { id: "analise", label: "Análise" }
  ];
  var p50ActiveTab = "resumo";

  function p50ApplyTab(sec, id) {
    var tabs = sec.querySelectorAll("[data-p50=\"tab\"]");
    var panels = sec.querySelectorAll("[data-p50=\"panel\"]");
    var i;
    for (i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute("data-p50-tab") === id;
      tabs[i].setAttribute("aria-selected", on ? "true" : "false");
      tabs[i].setAttribute("tabindex", on ? "0" : "-1");
    }
    for (i = 0; i < panels.length; i++) {
      if (panels[i].getAttribute("data-p50-tab") === id) panels[i].removeAttribute("hidden");
      else panels[i].setAttribute("hidden", "");
    }
  }

  function p50WireTabs(sec) {
    var tabs = sec.querySelectorAll("[data-p50=\"tab\"]");
    function focusAt(n) {
      var t = tabs[(n + tabs.length) % tabs.length];
      p50ActiveTab = t.getAttribute("data-p50-tab");
      p50ApplyTab(sec, p50ActiveTab);
      t.focus();
    }
    for (var i = 0; i < tabs.length; i++) {
      (function (btn, idx) {
        btn.onclick = function () {
          p50ActiveTab = btn.getAttribute("data-p50-tab");
          p50ApplyTab(sec, p50ActiveTab);
        };
        btn.onkeydown = function (ev) {
          var kk = ev.key;
          if (kk === "ArrowRight") { ev.preventDefault(); focusAt(idx + 1); }
          else if (kk === "ArrowLeft") { ev.preventDefault(); focusAt(idx - 1); }
          else if (kk === "Home") { ev.preventDefault(); focusAt(0); }
          else if (kk === "End") { ev.preventDefault(); focusAt(tabs.length - 1); }
        };
      })(tabs[i], i);
    }
  }

  function p50TabBar() {
    var bar = el("div", { "class": "p50-tabs", "data-p50": "tabs",
      "role": "tablist", "aria-label": "Visões de resultados" });
    for (var i = 0; i < P50_TABS.length; i++) {
      var t = P50_TABS[i];
      bar.appendChild(el("button", {
        "type": "button", "class": "p50-tab", "data-p50": "tab", "data-p50-tab": t.id,
        "id": "p50-tab-" + t.id, "role": "tab",
        "aria-controls": "p50-panel-" + t.id, "aria-selected": "false", "tabindex": "-1"
      }, t.label));
    }
    return bar;
  }
  function p50Panel(id) {
    return el("div", { "class": "p50-panel", "data-p50": "panel", "data-p50-tab": id,
      "id": "p50-panel-" + id, "role": "tabpanel", "aria-labelledby": "p50-tab-" + id,
      "tabindex": "0" });
  }

  /* ==========================================================================
     Painel RESUMO (UI-029) — dono da decisão de publicar conteúdo executivo.
     UI-020: os executive cards só existem com o veredito canônico aberto.
     Esta função é a ÂNCORA dos mutantes congelados M37 (estágio executivo sob
     gate fechado) e M38 (cards sob gate fechado): o harness de mutação é
     byte-idêntico nesta microfase, portanto a sequência literal abaixo é
     contrato de teste e não pode ser dissolvida por refactor de apresentação.
     ========================================================================== */
  function p50BuildResumo(released) {
    var sec = p50Panel("resumo");
    var list = el("ul", { "class": "p50-res-domains", "data-p50": "results-domains" });
    for (var i = 0; i < DOMS.length; i++) list.appendChild(p50DomainRow(i, released));
    sec.appendChild(list);
    if (released) sec.appendChild(p50ExecCards());
    return sec;
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

    sec.appendChild(p50TabBar());

    /* --- Resumo (UI-029): veredito, domínios e cards estritamente gated --- */
    sec.appendChild(p50BuildResumo(released));

    /* --- as três visões novas da 5.0.4, sobre o modelo de dados único --- */
    var mx = p50Matrix(contract);

    var pDom = p50Panel("dominios");
    pDom.appendChild(p50DrillDown(mx));
    sec.appendChild(pDom);

    var pHeat = p50Panel("heatmap");
    pHeat.appendChild(p50HeatMap(mx, contract));
    var strip = p50PresenceStrip();
    if (strip) pHeat.appendChild(strip);
    pHeat.appendChild(p50AltTable(mx));
    sec.appendChild(pHeat);

    var pAna = p50Panel("analise");
    pAna.appendChild(p50CurrentTarget(mx));
    sec.appendChild(pAna);

    p50ApplyTab(sec, p50ActiveTab);
    p50WireTabs(sec);
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
