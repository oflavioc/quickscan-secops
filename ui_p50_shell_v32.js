/* ============================================================================
   PHASE 5.0 · microfase 5.0.1 — ASSESSMENT SHELL & ANSWER SEMANTICS
   Camada 5 (superfície nova). Engine, Camada 1 e todos os módulos 4.x
   permanecem byte-idênticos: este módulo APENAS decora pós-render e aciona
   os handlers/setters congelados.

   Contratos implementados:
     UI-001   hierarquia assessment -> domínio -> pergunta, posição e conclusão
     UI-002   sidebar contextual (parcial: sem suficiência, sem overall/estágio)
     UI-003   preservação do mapeamento das 4 opções canônicas + NA
     UI-004   grupo de resposta acessível por teclado, sem reescrever a Camada 1
     UI-004A  owner ÚNICO de composição de window.__uxDecor
     UI-016a  três estados do eixo de respostas (null · "NA" · 0..3)
     UI-033A  PT-BR no chrome novo; denominações de domínio em PT/EN congeladas
     §12.2(d) superfície nova NÃO geométrica: n/d + "Não avaliado" + acessível
     COR-01   cor exclusivamente por token congelado (var(--dom-accent))

   Fora do escopo desta microfase (microfases 5.0.2-5.0.5): evidência/notas,
   chips de metadata, componente de status de sessão, dirty flag, camada
   derivada de suficiência, results, heat map, target, assurance visual.

   Disciplina de implementação (errata 5.0.1 §3.4): este módulo NÃO usa
   innerHTML. Todo texto entra por textContent e todo atributo por
   setAttribute. Nenhum conteúdo de texto livre novo é renderizado aqui.
   ========================================================================== */
(function () {
  "use strict";
  if (window.__P50 && window.__P50.__installed) return;

  /* ---------------- estado de módulo (nunca canônico, nunca serializado) --- */
  /* Estado inicial RECOLHIDO (decisão do proprietário, reauditoria estreita 5.0.1):
     com o mapa aberto por padrão o shell empurrava a pergunta para fora da
     primeira dobra. Estado efêmero UX-derived (UI-010A): presentation-only,
     nunca serializado, ausente de captureCanonicalInputs(), controlado pelo
     botão existente e coberto por P50-UX9. */
  var p50Collapsed = true;           /* UX-derived ephemeral state (UI-010A) */
  var p50Depth = 0, p50MaxDepth = 0;
  var p50ProbeReentry = false;
  var p50ForceFailure = false;
  var p50ShellErrors = 0;
  var p50PrevInvocations = 0;
  var p50Observer = null;
  var p50Decorators = [];

  /* ============================================================
     UI-004A · owner ÚNICO de composição de window.__uxDecor
     Captura do predecessor: EXATAMENTE uma vez, na carga do módulo.
     ============================================================ */
  var p50CaptureCount = 0;
  var p50PrevDecor = null;
  (function captureOnce() {
    p50PrevDecor = (typeof window.__uxDecor === "function") ? window.__uxDecor : null;
    p50CaptureCount++;
  })();

  /* Guard de reentrância da COMPOSIÇÃO (blocker da auditoria independente).
     Um decorador P50 pode chamar render(); render() reentra em __uxDecor por
     dentro de p50PrevRender, ANTES de p50AfterRender existir na pilha. Sem
     este guard a lista de decoradores reexecuta recursivamente até estourar
     a pilha. O guard protege SOMENTE a lista P50: o predecessor congelado
     continua sendo invocado também no fluxo aninhado. */
  var p50DecorDepth = 0;
  var p50DecorReentriesBlocked = 0;

  window.__uxDecor = function (app) {
    if (p50Observer) { try { p50Observer(app); } catch (e) { /* observador é hook de teste */ } }
    if (p50PrevDecor) {                                   /* congelada SEMPRE, e ANTES */
      p50PrevInvocations++;
      try { p50PrevDecor(app); }
      catch (e) { console.error("P50 predecessor:", e.message); }
    }
    if (p50DecorDepth > 0) { p50DecorReentriesBlocked++; return; }   /* reentrância contida */
    p50DecorDepth++;
    try {
      for (var i = 0; i < p50Decorators.length; i++) {    /* isolamento POR callback */
        try { p50Decorators[i](app); }
        catch (e) { p50ShellErrors++; console.error("P50 decor:", e.message); }
      }
    } finally { p50DecorDepth--; }
  };

  /* ============================================================
     Wrapper do binding global render (AMB-1, aprovado pelo proprietário)
     Mesmo padrão do precedente congelado da camada UX 4.1.
     ============================================================ */
  var p50RenderInstallCount = 0;
  var p50PrevRender = render;
  render = function () {
    var r = p50PrevRender.apply(this, arguments);          /* predecessor SEMPRE, e antes */
    p50AfterRender();
    return r;
  };
  p50RenderInstallCount++;

  function p50AfterRender() {
    if (p50Depth > 0) return;                              /* guard de reentrância */
    p50Depth++;
    if (p50Depth > p50MaxDepth) p50MaxDepth = p50Depth;
    try {
      p50BuildShell();
      p50DecorateAnswers();
      if (p50ProbeReentry) { p50ProbeReentry = false; render(); }
    } catch (e) {
      p50ShellErrors++;
      console.error("P50 shell:", e.message);              /* falha isolada: render congelado intacto */
    } finally {
      p50Depth--;
    }
  }

  /* ---------------- helpers de DOM seguros (sem innerHTML) ---------------- */
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) { for (var k in attrs) { if (attrs[k] !== null) n.setAttribute(k, String(attrs[k])); } }
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  }
  function isQuestionScreen() { return step >= 1 && step <= QS.length; }
  function domIndexes(i) {
    var out = [];
    for (var k = 0; k < QS.length; k++) { if (QS[k].dom === i) out.push(k); }
    return out;
  }
  function scoreText(v) { return SCORES[v].toFixed(1).replace(".", ","); }

  /* Três estados do eixo de respostas (UI-016a). DOM, rótulo visível e nome
     acessível DISTINTOS. `null` jamais produz zero; nível 0 jamais é omitido. */
  function answerState(v) {
    if (v === null || v === undefined) {
      return { key: "unset", visible: "n/d", acc: "Não avaliado" };
    }
    if (v === "NA") {
      return { key: "na", visible: "Não sei", acc: "Não sei · precisa validar · não pontua" };
    }
    return { key: "confirmed", visible: "Confirmado · " + scoreText(v),
             acc: "Resposta confirmada · " + scoreText(v) + " de 5" };
  }

  /* ============================================================
     Shell: orientação (UI-001) + sidebar contextual (UI-002 parcial)
     ============================================================ */
  function p50BuildShell() {
    var old = document.getElementById("p50-shell");
    if (old) old.remove();
    if (p50ForceFailure) throw new Error("P50 shell failure (test hook)");
    if (!isQuestionScreen()) return;

    var wrap = document.querySelector(".wrap");
    var app = document.getElementById("app");
    if (!wrap || !app) return;

    var k = step - 1;
    var qq = QS[k];
    var domIdx = qq.dom;
    var idxs = domIndexes(domIdx);
    var posInDom = idxs.indexOf(k) + 1;

    var shell = el("aside", {
      id: "p50-shell",
      "data-p50": "shell",
      "data-p50-collapsed": p50Collapsed ? "true" : "false",
      "aria-label": "Mapa do assessment"
    });

    /* ---- orientação: domínio, posição, moeda canônica do domínio, conclusão ---- */
    var orient = el("div", { "class": "p50-orient", "data-p50": "orient" });
    orient.appendChild(el("p", {
      "class": "p50-domcur", "data-p50": "domain-current", "data-dom": domIdx
    }, DOMS[domIdx].pt + " · " + DOMS[domIdx].en));
    orient.appendChild(el("p", { "class": "p50-pos", "data-p50": "position" },
      "Pergunta " + posInDom + " de " + idxs.length + " neste domínio"));
    orient.appendChild(el("p", { "class": "p50-domprog", "data-p50": "domain-progress" },
      domStat(domIdx).n + " de " + idxs.length + " respostas confirmadas neste domínio"));

    var answered = 0;
    for (var a = 0; a < ans.length; a++) { if (ans[a] !== null) answered++; }
    orient.appendChild(el("p", { "class": "p50-completion", "data-p50": "completion" },
      "Conclusão: " + answered + " de " + QS.length + " respostas"));

    /* ---- navegação: proxies dos controles congelados #back / #next ---- */
    var nav = el("nav", { "class": "p50-nav", "aria-label": "Navegação entre perguntas" });
    var back = document.getElementById("back");
    var next = document.getElementById("next");
    var bPrev = el("button", { type: "button", "class": "p50-btn", "data-p50": "prev" },
      "← Pergunta anterior");
    bPrev.disabled = !back;
    bPrev.addEventListener("click", function () {
      var b = document.getElementById("back");                    /* setter congelado */
      if (b) b.click();
    });
    var bNext = el("button", { type: "button", "class": "p50-btn", "data-p50": "next" },
      "Próxima pergunta →");
    bNext.disabled = !next || next.disabled;
    bNext.addEventListener("click", function () {
      var n = document.getElementById("next");                    /* setter congelado */
      if (n && !n.disabled) n.click();
    });
    var bTgl = el("button", {
      type: "button", "class": "p50-btn p50-btn-ghost", "data-p50": "sidebar-toggle",
      "aria-controls": "p50-sidebar", "aria-expanded": p50Collapsed ? "false" : "true"
    }, p50Collapsed ? "Mostrar mapa do assessment" : "Ocultar mapa do assessment");
    bTgl.addEventListener("click", function () {
      p50Collapsed = !p50Collapsed;                                /* apresentação apenas */
      p50BuildShell();
    });
    nav.appendChild(bPrev); nav.appendChild(bNext); nav.appendChild(bTgl);
    orient.appendChild(nav);
    shell.appendChild(orient);

    /* ---- sidebar: 5 domínios -> 3 perguntas, com os três estados ---- */
    var side = el("div", { "class": "p50-sidebar", id: "p50-sidebar", "data-p50": "sidebar" });
    side.hidden = p50Collapsed;
    for (var i = 0; i < DOMS.length; i++) {
      var sec = el("section", { "class": "p50-dom", "data-p50": "domain", "data-dom": i });
      if (i === domIdx) sec.setAttribute("aria-current", "true");
      sec.appendChild(el("h2", { "class": "p50-domname", "data-p50": "domain-name" },
        DOMS[i].pt + " · " + DOMS[i].en));

      var n = domStat(i).n;
      if (n === 0) {
        /* §12.2(a)/(d) e UI-002/UI-014: nunca 0.0 fabricado; token canônico n/d
           acrescido, de forma aditiva, do rótulo textual e do nome acessível. */
        sec.appendChild(el("p", {
          "class": "p50-domstate", "data-p50": "domain-state", "data-p50-state": "unset",
          "aria-label": "Domínio não avaliado"
        }, "n/d"));
        sec.appendChild(el("p", {
          "class": "p50-domstate-label", "data-p50": "domain-state-label"
        }, "Não avaliado"));
      } else {
        sec.appendChild(el("p", {
          "class": "p50-domstate", "data-p50": "domain-state", "data-p50-state": "answered"
        }, n + " de " + domIndexes(i).length + " respostas confirmadas"));
      }

      var ul = el("ul", { "class": "p50-qlist" });
      var list = domIndexes(i);
      for (var j = 0; j < list.length; j++) {
        var kk = list[j];
        var st = answerState(ans[kk]);
        var li = el("li", {
          "class": "p50-q", "data-p50": "q", "data-qid": QS[kk].id, "data-p50-ans": st.key
        });
        if (kk === k) li.setAttribute("aria-current", "step");
        li.appendChild(el("span", { "class": "p50-qlabel", "data-p50": "q-label" }, QS[kk].lbl));
        li.appendChild(el("span", {
          "class": "p50-qstate", "data-p50": "q-state", "aria-label": st.acc
        }, st.visible));
        ul.appendChild(li);
      }
      sec.appendChild(ul);
      side.appendChild(sec);
    }
    shell.appendChild(side);
    wrap.insertBefore(shell, app);
  }

  /* ============================================================
     UI-003 / UI-004 · decoração dos answer cards congelados
     Nenhum markup da Camada 1 é reescrito: somente atributos aditivos
     e um grupo semântico com navegação por teclado.
     ============================================================ */
  function p50DecorateAnswers() {
    if (!isQuestionScreen()) return;
    var group = document.querySelector("#app .opts");
    if (!group) return;
    var k = step - 1;
    var opts = QS[k].opts;

    group.setAttribute("data-p50", "answers");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Opções de resposta desta pergunta");

    var cards = group.querySelectorAll("button.opt");
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var raw = c.getAttribute("data-i");
      var val = (raw === "NA") ? "NA" : String(parseInt(raw, 10));
      c.setAttribute("data-p50-value", val);
      var isSel = (val === "NA") ? (ans[k] === "NA") : (ans[k] === parseInt(val, 10));
      c.setAttribute("data-p50-selected", isSel ? "true" : "false");
      if (val !== "NA") {
        /* provenance do par canônico t/d desta pergunta, na ordem canônica */
        var o = opts[parseInt(val, 10)];
        if (o) {
          c.setAttribute("data-p50-opt", o.t);
          c.setAttribute("data-p50-optd", o.d);
        }
      }
    }

    if (group.dataset.p50Bound === "1") return;              /* idempotência de handler */
    group.dataset.p50Bound = "1";
    group.addEventListener("keydown", p50GroupKeydown);
  }

  function p50GroupKeydown(e) {
    var card = e.target && e.target.closest ? e.target.closest("button.opt") : null;
    if (!card) return;
    var group = card.parentNode;
    var cards = Array.prototype.slice.call(group.querySelectorAll("button.opt"));
    var at = cards.indexOf(card);
    if (at < 0) return;
    var to = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") to = (at + 1) % cards.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") to = (at - 1 + cards.length) % cards.length;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = cards.length - 1;
    else if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      /* Ativação determinística e ÚNICA: previne a ativação nativa do <button>
         e aciona o handler congelado do próprio card (nunca escreve em ans). */
      e.preventDefault();
      e.stopPropagation();
      card.click();
      return;
    } else return;
    e.preventDefault();
    e.stopPropagation();
    if (to >= 0 && cards[to]) cards[to].focus();
  }

  /* ============================================================
     API do módulo: consumo pelas microfases seguintes + diagnóstico
     ============================================================ */
  window.__P50 = {
    __installed: true,
    registerDecor: function (fn) { if (typeof fn === "function") p50Decorators.push(fn); },
    decorate: function () { p50BuildShell(); p50DecorateAnswers(); },
    diag: function () {
      return {
        predecessorCaptured: p50PrevDecor !== null,
        recaptured: p50CaptureCount > 1,
        predecessorInvocations: p50PrevInvocations,
        renderInstalled: typeof render === "function" && p50PrevRender !== render,
        renderInstallCount: p50RenderInstallCount,
        decorDepth: p50DecorDepth,                    /* estado material, não booleano fixo */
        decorReentriesBlocked: p50DecorReentriesBlocked,
        shellDepth: p50Depth,
        shellMaxDepth: p50MaxDepth,
        shellErrors: p50ShellErrors
      };
    },
    __spyPredecessor: function (fn) { p50Observer = fn; },
    __forceShellFailure: function (on) { p50ForceFailure = !!on; },
    __probeReentrancy: function () { p50MaxDepth = 0; p50ProbeReentry = true; render(); return p50MaxDepth; }
  };
})();
