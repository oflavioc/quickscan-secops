/* ============================================================================
   PHASE 5.0 · microfases 5.0.1 + 5.0.2
   5.0.1 — ASSESSMENT SHELL & ANSWER SEMANTICS
   5.0.2 — EVIDENCE CAPTURE & PROGRESS UX
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

   Acrescentado pela 5.0.2:
     UI-005   cue de interpretação pelo Caminho A (descrição canônica da opção)
     UI-006   evidência inline ligada EXCLUSIVAMENTE ao owner canônico notes[k],
              gravada apenas pelo setter congelado (nunca por escrita direta)
     UI-007   indicador de presença de nota (nunca confirma resposta)
     UI-008   chips com provenance: Question ID, Domain ID, presença de nota
     UI-010A  estado efêmero de sessão (dirty flag e resultado da última operação)
     UI-011   mensagens honestas de portabilidade de sessão
     UI-049   renderização inerte de texto livre (sem innerHTML em lugar algum)

   Fora do escopo (microfases 5.0.3-5.0.5): camada derivada de suficiência,
   UI-009A, UI-012/012A/012B, results, heat map, target, assurance visual completa.

   Acrescentado pela 5.0.5:
     UI-031A  renderer REUTILIZÁVEL de ícone oficial (ICON-01.1/01.2), que
              resolve exclusivamente por window.__V32UI.iconFor() e não
              declara mapa, asset ou SVG paralelo. Nenhuma superfície P50
              atual possui itemId canônico, logo nenhuma superfície visível
              renderiza ícone: o renderer existe para consumo futuro e é
              provado por fixture controlada (P50-IC1/P50-IC2), sem inventar
              produto, recomendação ou seção decorativa.
     UI-048   orientação curta junto ao campo de evidência.

   Disciplina de implementação: este módulo NÃO usa innerHTML. Todo texto entra
   por textContent e todo atributo por setAttribute — inclusive o texto livre de
   evidência, que é conteúdo do cliente.
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
     5.0.2 · estado efêmero de sessão (UI-010A)
     Vive SOMENTE aqui, na Camada 5. Nunca entra no documento de sessão,
     nunca entra em `inputs`, nunca vira derivado exportado, nunca altera o
     schema nem o comportamento canônico de import/export. Não grava nada por
     conta própria e não cria persistência local ou remota.
     ============================================================ */
  var p50SesState = "default";       /* default | exported | imported | export-failed */
  var p50CleanSnapshot = null;       /* serialização canônica no último ponto "limpo" */

  function p50Canon() {
    try { return JSON.stringify(captureCanonicalInputs()); }
    catch (e) { return null; }
  }
  function p50MarkClean() { p50CleanSnapshot = p50Canon(); }
  function p50IsDirty() {
    var now = p50Canon();
    if (now === null || p50CleanSnapshot === null) return false;
    return now !== p50CleanSnapshot;
  }

  /* Observadores de export/import — mesmo padrão aprovado em AMB-1:
     captura única, predecessor SEMPRE invocado e inalterado, retorno repassado
     intacto, falha isolada. Nao duplicam nem substituem a logica de Session
     Portability: apenas leem o resultado ja produzido por ela. */
  var p50SesWrapCount = 0;
  var p50SesSub = { download: null, "import": null };     /* substituto SOMENTE de teste */
  var p50SesCalls = { download: 0, "import": 0 };
  var p50SesPredCalls = { download: 0, "import": 0 };
  /* Chama o predecessor EXATAMENTE uma vez, preservando `this`, argumentos,
     retorno e exceções. O substituto existe apenas para que os gates possam
     provar o contrato; em produção nunca é instalado. */
  function p50SesInvoke(kind, fallback, ctx, args) {
    p50SesCalls[kind]++;
    var pred = p50SesSub[kind] || fallback;
    p50SesPredCalls[kind]++;
    return pred.apply(ctx, args);
  }

  var p50PrevDownloadSession = (typeof downloadSession === "function") ? downloadSession : null;
  if (p50PrevDownloadSession) {
    downloadSession = function () {
      var r = p50SesInvoke("download", p50PrevDownloadSession, this, arguments);
      try {
        if (r && r.ok) { p50SesState = "exported"; p50MarkClean(); }
        else { p50SesState = "export-failed"; }
        p50UpdateSessionStatus();
      } catch (e) { console.error("P50 session status:", e.message); }
      return r;
    };
    p50SesWrapCount++;
  }
  var p50PrevImportSessionDocument = (typeof importSessionDocument === "function") ? importSessionDocument : null;
  if (p50PrevImportSessionDocument) {
    importSessionDocument = function () {
      var r = p50SesInvoke("import", p50PrevImportSessionDocument, this, arguments);
      try {
        if (r && r.ok) { p50SesState = "imported"; p50MarkClean(); }
        p50UpdateSessionStatus();
      } catch (e) { console.error("P50 session status:", e.message); }
      return r;
    };
    p50SesWrapCount++;
  }

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
      /* Ponto limpo inicial: o primeiro render ocorre na home, com o assessment
         vazio. Sem esta âncora, "modificado desde o último export" nunca seria
         verdadeiro antes da primeira exportação. */
      if (p50CleanSnapshot === null) p50MarkClean();
      p50BuildShell();
      p50DecorateAnswers();
      p50QuestionExtras();
      p50HomeSessionStatus();
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
    orient.appendChild(p50BuildSessionStatus());      /* UI-011 · status honesto */
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
     5.0.2 · UI-011 / UI-010A — componente de status de sessão
     Mensagens honestas, sem qualquer afirmação de gravação, persistência ou
     retomada que o runtime não sustente. Enquanto houver alteração desde o último ponto
     limpo, o estado exibido volta ao padrão: dizer "Sessão exportada" com
     modificações pendentes seria desonesto (P50-SESUX2).
     ============================================================ */
  var P50_SES_MSG = {
    "default":       ["Sessão não salva automaticamente.",
                      "Exporte o arquivo da sessão para continuar depois."],
    "exported":      ["Sessão exportada.",
                      "Guarde o arquivo JSON para retomar posteriormente."],
    "imported":      ["Sessão carregada do arquivo.",
                      "Novas alterações não são salvas automaticamente."],
    "export-failed": ["Sessão não salva automaticamente.",
                      "Exporte o arquivo da sessão para continuar depois."]
  };

  function p50EffectiveSesState() {
    if (p50SesState === "export-failed") return "export-failed";
    if (p50IsDirty()) return "default";          /* honestidade tem precedência */
    return p50SesState;
  }

  function p50BuildSessionStatus() {
    var st = p50EffectiveSesState();
    var dirty = p50IsDirty();
    var msg = P50_SES_MSG[st] || P50_SES_MSG["default"];
    var box = el("div", {
      id: "p50-session-status", "class": "p50-ses", "data-p50": "session-status",
      "data-p50-ses-state": st, "data-p50-ses-dirty": dirty ? "true" : "false",
      role: "status", "aria-live": "polite"
      /* Sem aria-label: numa live region o texto ANUNCIADO é o conteúdo. Um
         aria-label aqui suprimiria justamente as linhas de dirty e de falha
         (B-502-2). O nome/descrição acessível passa a ser o conteúdo completo. */
    });
    box.appendChild(el("p", { "class": "p50-ses-l1", "data-p50": "ses-line1" }, msg[0]));
    box.appendChild(el("p", { "class": "p50-ses-l2", "data-p50": "ses-line2" }, msg[1]));
    if (st === "export-failed") {
      box.appendChild(el("p", { "class": "p50-ses-note", "data-p50": "ses-failure" },
        "A última exportação não foi concluída — nenhum arquivo foi gerado."));
    }
    if (dirty) {
      box.appendChild(el("p", { "class": "p50-ses-note", "data-p50": "ses-dirty" },
        "Há alterações ainda não exportadas."));
    }
    return box;
  }

  /* Atualiza em todos os hosts onde o componente já exista, sem render(). */
  function p50UpdateSessionStatus() {
    var nodes = document.querySelectorAll("#p50-session-status");
    for (var i = 0; i < nodes.length; i++) {
      var fresh = p50BuildSessionStatus();
      nodes[i].parentNode.replaceChild(fresh, nodes[i]);
    }
  }
  function p50MountSessionStatus(host, where) {
    if (!host) return;
    var old = document.getElementById("p50-session-status");
    if (old) old.remove();
    var node = p50BuildSessionStatus();
    if (where === "prepend" && host.firstChild) host.insertBefore(node, host.firstChild);
    else host.appendChild(node);
  }

  /* ============================================================
     B-502-1 · reconciliação no evento REAL de evidência
     O handler congelado de #notetxt atualiza notes[k] SEM chamar render(),
     de modo que o status ficava materialmente stale ("Sessão exportada" com o
     owner já sujo). A observação é ADITIVA: addEventListener não substitui o
     handler congelado (t.oninput), que continua sendo o único escritor de
     notes[k]. Como é registrada DEPOIS dele, executa DEPOIS dele — o owner já
     está atualizado quando reconciliamos. Não chama render().
     ============================================================ */
  function p50OnNoteInput() {
    try {
      p50UpdateEvidenceIndicators();
      p50UpdateSessionStatus();
    } catch (e) {
      p50ShellErrors++;
      console.error("P50 note observer:", e.message);      /* falha isolada */
    }
  }
  /* UI-048 · id único da orientação, referenciado por aria-describedby. */
  var P50_EV_GUIDE_ID = "p50-ev-guide";
  function p50BindNoteObserver() {
    var ta = document.getElementById("notetxt");
    if (!ta) return;
    /* A orientação vive na Camada 5 e o textarea é congelado: a ligação é
       feita por atributo aditivo, reaplicada a cada render porque o textarea
       é recriado pelo runtime congelado sempre que o painel de nota abre. */
    if (document.getElementById(P50_EV_GUIDE_ID)) ta.setAttribute("aria-describedby", P50_EV_GUIDE_ID);
    if (ta.dataset.p50NoteBound === "1") return;            /* idempotente */
    ta.dataset.p50NoteBound = "1";
    ta.addEventListener("input", p50OnNoteInput);
    ta.addEventListener("change", p50OnNoteInput);
  }
  /* Indicador de presença de nota (UI-007) reconciliado sem re-render. */
  function p50UpdateEvidenceIndicators() {
    if (!isQuestionScreen()) return;
    var k = step - 1;
    var has = String(notes[k] || "").trim().length > 0;
    var chip = document.querySelector("#app [data-p50-chip=\"evidence\"]");
    if (!chip) return;
    chip.setAttribute("data-p50-evidence", has ? "present" : "none");
    chip.setAttribute("aria-label", has ? "Evidência registrada para esta pergunta"
                                        : "Sem evidência registrada para esta pergunta");
    chip.textContent = has ? "Evidência registrada" : "Sem evidência";
  }

  /* ============================================================
     5.0.2 · UI-005 (cue) · UI-007 (indicador) · UI-008 (chips)
     Toda informação exibida tem provenance observável no runtime.
     Nenhuma taxonomia nova, nenhum weight/importance, nenhum framework.
     ============================================================ */
  function p50QuestionExtras() {
    var scr = document.querySelector("#app section.screen");
    if (!scr) return;
    var stale = scr.querySelector("#p50-q"); if (stale) stale.remove();
    var staleCue = scr.querySelector("#p50-cue"); if (staleCue) staleCue.remove();
    if (!isQuestionScreen()) return;               /* extras só na tela de pergunta */
    var k = step - 1;
    var qq = QS[k];
    if (!qq) return;
    var hasNote = String(notes[k] || "").trim().length > 0;

    /* --- chips (UI-008): apenas Question ID, Domain ID e presença de nota --- */
    var chips = el("div", { id: "p50-q", "class": "p50-chips", "data-p50": "chips", role: "list" });
    chips.appendChild(el("span", {
      "class": "p50-chip", "data-p50": "chip", "data-p50-chip": "qid", role: "listitem",
      "aria-label": "Identificador da pergunta: " + qq.id
    }, "ID · " + qq.id));
    chips.appendChild(el("span", {
      "class": "p50-chip", "data-p50": "chip", "data-p50-chip": "dom", role: "listitem",
      "data-dom": qq.dom,
      "aria-label": "Domínio: " + DOMS[qq.dom].pt + " · " + DOMS[qq.dom].en
    }, DOMS[qq.dom].pt + " · " + DOMS[qq.dom].en));
    chips.appendChild(el("span", {
      "class": "p50-chip p50-chip-ev", "data-p50": "chip", "data-p50-chip": "evidence",
      "data-p50-evidence": hasNote ? "present" : "none", role: "listitem",
      "aria-label": hasNote ? "Evidência registrada para esta pergunta"
                            : "Sem evidência registrada para esta pergunta"
    }, hasNote ? "Evidência registrada" : "Sem evidência"));
    var hint = scr.querySelector("p.hint");
    if (hint) hint.insertAdjacentElement("afterend", chips); else scr.appendChild(chips);

    /* --- cue (UI-005, Caminho A) + evidência (UI-006/UI-007) --- */
    var block = el("div", { id: "p50-cue", "class": "p50-cueblock" });
    var v = ans[k];
    if (v !== null && v !== undefined) {
      /* A cue é a descrição canônica da opção SELECIONADA, lida do próprio
         runtime. Para 0..3 equivale a QS[k].opts[v].d; para "NA" é o descritor
         canônico já renderizado pela Camada 1. Nenhum texto é inventado. */
      var sel = document.querySelector("#app .opts .opt[data-p50-selected=\"true\"]");
      var dEl = sel ? sel.querySelector(".d") : null;
      var cueText = dEl ? (dEl.textContent || "").trim() : "";
      if (cueText) {
        block.appendChild(el("p", {
          "class": "p50-cue", "data-p50": "cue",
          "data-p50-cue-for": (v === "NA" ? "NA" : String(v)),
          "aria-label": "Interpretação da resposta selecionada: " + cueText
        }, cueText));
      }
    }

    /* Preview inerte da evidência registrada. O conteúdo é texto livre do
       cliente: entra EXCLUSIVAMENTE por textContent (UI-049). */
    if (hasNote) {
      var raw = String(notes[k]);
      var flat = raw.replace(/\s+/g, " ").trim();
      var preview = flat.length > 160 ? flat.slice(0, 160) + "…" : flat;
      var ev = el("div", { "class": "p50-ev", "data-p50": "evidence", "data-p50-evidence": "present" });
      ev.appendChild(el("span", { "class": "p50-ev-lab", "data-p50": "evidence-label" }, "Evidência registrada"));
      ev.appendChild(el("p", { "class": "p50-ev-txt", "data-p50": "evidence-preview" }, preview));
      block.appendChild(ev);
    }

    /* Atalho para o campo canônico congelado. NÃO escreve em notes[k]:
       delega ao controle congelado, que é o único setter da nota. */
    var tglBtn = el("button", {
      type: "button", "class": "p50-btn p50-btn-ghost", "data-p50": "evidence-open"
    }, hasNote ? "Editar evidência ou observação" : "Registrar evidência ou observação");
    tglBtn.addEventListener("click", function () {
      var t = document.getElementById("notetgl");        /* setter congelado */
      if (t) t.click();
    });
    block.appendChild(tglBtn);

    /* UI-048 · o campo de evidência pode receber informação sensível do
       cliente. A orientação é CURTA, factual e não alarmista, fica junto do
       controle que abre o campo e é ligada ao próprio textarea congelado por
       `aria-describedby` (atributo ADITIVO; o markup da Camada 1 permanece
       intocado). Não é claim de persistência, de segurança ou de conformidade:
       o produto continua local-first e sem gravação automática de sessão
       (UI-011/UI-047). */
    block.appendChild(el("p", {
      id: P50_EV_GUIDE_ID, "class": "p50-ev-guide", "data-p50": "evidence-guidance"
    }, "Evite registrar segredos, credenciais ou dados pessoais desnecessários."));

    var opts = scr.querySelector(".opts");
    if (opts) opts.insertAdjacentElement("afterend", block); else scr.appendChild(block);

    p50BindNoteObserver();
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
  /* Status de sessão na home, onde vive o controle congelado #ses-import-home.
     Cobre o estado "fresh assessment" antes de qualquer interação. */
  function p50HomeSessionStatus() {
    if (step !== -1) return;
    var host = document.getElementById("ux-home") ||
               document.querySelector("#app section.screen");
    p50MountSessionStatus(host, "append");
  }

  /* Status de sessão também na tela de resultados, onde vivem os controles
     congelados #ses-export / #ses-import. Consome o agregador da 5.0.1 via
     registerDecor — NÃO reatribui window.__uxDecor. */
  function p50ResultsSessionDecor(app) {
    var host = document.getElementById("ses-actions");
    if (host && host.parentNode) {
      var old = document.getElementById("p50-session-status");
      if (old) old.remove();
      host.insertAdjacentElement("afterend", p50BuildSessionStatus());
      return;
    }
    p50MountSessionStatus(app || document.getElementById("app"), "append");
  }
  p50Decorators.push(p50ResultsSessionDecor);

  /* ============================================================
     UI-031A · ICON-01 — renderer reutilizável de ícone oficial
     ICON-01.1 · fonte ÚNICA: window.__V32UI.iconFor(itemId, name), do runtime
                 congelado. Este módulo NÃO declara mapa itemId→asset, NÃO
                 embute SVG/base64 de produto e NÃO duplica o mapa congelado
                 de itemId para asset.
     ICON-01.2 · o fallback determinístico de iniciais (.v32-icon-fb) é
                 comportamento CORRETO e congelado para entidades sem asset
                 (fortisat) e para abstrações de família; este renderer o
                 devolve tal como veio e jamais o substitui pelo ícone de um
                 produto específico.
     ICON-01.3 · artwork intocado: o nó é adotado sem recolor, retrace ou
                 recomposição; o `src` é byte-idêntico ao servido por ICONS_V32.

     `iconFor()` devolve STRING de HTML — contrato do runtime congelado, que
     não pode ser alterado. Para preservar a disciplina "zero innerHTML" desta
     camada, a string é materializada por DOMParser (parser INERTE: não
     executa script e não busca recurso enquanto o documento não é adotado) e
     só então validada estruturalmente. Só dois formatos são aceitos —
     `img.v32-icon` e `span.v32-icon-fb` —, sem filhos, sem atributo de
     evento e em nó único; qualquer outra coisa devolve null em vez de entrar
     na árvore viva. A validação é do CONSUMIDOR: ela não reimplementa a
     resolução e não decide qual asset é o certo.

     Nenhuma superfície P50 atual possui itemId canônico; portanto nenhuma
     chama este renderer. Ele é exposto para consumo futuro e provado por
     fixture controlada (P50-IC1/P50-IC2) — criar uma seção decorativa apenas
     para exibi-lo fabricaria recomendação e é proibido.
     ============================================================ */
  function p50IconNode(itemId, name) {
    var bridge = window.__V32UI;
    if (!bridge || typeof bridge.iconFor !== "function") return null;
    var markup;
    try { markup = bridge.iconFor(itemId, name); }
    catch (e) { p50ShellErrors++; console.error("P50 icon:", e.message); return null; }
    if (typeof markup !== "string" || !markup) return null;
    var doc;
    try { doc = new DOMParser().parseFromString(markup, "text/html"); }
    catch (e2) { p50ShellErrors++; console.error("P50 icon parse:", e2.message); return null; }
    var body = doc && doc.body;
    if (!body || body.childElementCount !== 1) return null;
    if ((body.textContent || "").length && body.firstElementChild &&
        (body.textContent || "") !== (body.firstElementChild.textContent || "")) return null;
    var n = body.firstElementChild;
    var cls = n.getAttribute("class");
    var isAsset = (n.tagName === "IMG" && cls === "v32-icon");
    var isFallback = (n.tagName === "SPAN" && cls === "v32-icon-fb");
    if (!isAsset && !isFallback) return null;
    if (n.firstElementChild) return null;
    for (var i = 0; i < n.attributes.length; i++)
      if (/^on/i.test(n.attributes[i].name)) return null;
    return document.importNode(n, true);
  }

  window.__P50 = {
    __installed: true,
    /* UI-031A · exposto para consumo por superfície que venha a possuir itemId
       canônico. Devolve NÓ pronto ou null; nunca string, nunca HTML. */
    iconNode: p50IconNode,
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
        shellErrors: p50ShellErrors,
        sessionWrapCount: p50SesWrapCount,
        sessionCalls: { download: p50SesCalls.download, "import": p50SesCalls["import"] },
        sessionPredCalls: { download: p50SesPredCalls.download, "import": p50SesPredCalls["import"] },
        sessionState: p50SesState,
        sessionEffectiveState: p50EffectiveSesState(),
        sessionDirty: p50IsDirty()
      };
    },
    __spyPredecessor: function (fn) { p50Observer = fn; },
    __forceShellFailure: function (on) { p50ForceFailure = !!on; },
    __substituteSessionPredecessor: function (kind, fn) { p50SesSub[kind] = fn || null; },
    __resetSessionCounters: function () {
      p50SesCalls.download = 0; p50SesCalls["import"] = 0;
      p50SesPredCalls.download = 0; p50SesPredCalls["import"] = 0;
    },
    __probeReentrancy: function () { p50MaxDepth = 0; p50ProbeReentry = true; render(); return p50MaxDepth; }
  };
})();
