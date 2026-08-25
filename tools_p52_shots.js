/* ============================================================================
   GERADOR DE EVIDÊNCIA VISUAL · PHASE 5.2 · Etapa A
   Produz o acervo de screenshots da UAT em `docs_phase5/evidence_p52/` e o
   índice `INDEX.md`. Não é gate: não afirma PASS nem FAIL, apenas fotografa a
   candidata nas viewports obrigatórias (§14.2) e nas cenas exigidas (§15).
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs");
const { chromium } = require("@playwright/test");
const FX50 = require("./fixtures_p50.js");
const FX52 = require("./fixtures_p52.js");

const HERE = __dirname;
const URL = "file://" + path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const OUT = path.join(HERE, "docs_phase5", "evidence_p52");
fs.mkdirSync(OUT, { recursive: true });

/* ERRATA DA AUDITORIA EXTERNA · §8.3 · a lista obrigatória passa a incluir
   768×1024 e 1024×768 (tablets), que faltavam ao acervo. */
const VIEWPORTS = [
  { w: 1440, h: 900 }, { w: 1920, h: 1080 }, { w: 2560, h: 1440 },
  { w: 3440, h: 1440 }, { w: 390, h: 844 },
  { w: 768, h: 1024 }, { w: 1024, h: 768 }
];

function resolveBrowser() {
  const explicit = process.env.CHROME_PATH;
  const local = "/opt/google/chrome/chrome";
  if (explicit) return { executablePath: explicit };
  if (fs.existsSync(local)) return { executablePath: local };
  return {};
}
async function results(pg, fx) {
  await pg.evaluate(([qids, vec, prios, targets]) => {
    window.__DEV.setArq(0);
    qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
    if (targets) Object.keys(targets).forEach(k => window.__DEV.setTarget(k, targets[k]));
    if (prios) window.__DEV.setPriorities(prios);
    window.__DEV.showResults();
  }, [FX50.P50_QIDS, fx.vec, fx.priorities || null, fx.targets || null]);
  await pg.waitForTimeout(280);
}
async function question(pg, k, opts) {
  await pg.evaluate(([qids, kk]) => {
    window.__DEV.setArq(0);
    qids.forEach(id => window.__DEV.setAnswerById(id, 1));
    window.__DEV.gotoStep(kk);
  }, [FX50.P50_QIDS, k]);
  await pg.waitForTimeout(220);
  if (opts && opts.map !== undefined) {
    const want = opts.map ? "false" : "true";
    await pg.evaluate(w => {
      const sh = document.getElementById("p50-shell");
      const t = document.querySelector('#p50-shell button[data-p50="sidebar-toggle"]');
      if (sh && t && sh.getAttribute("data-p50-collapsed") !== w) t.click();
    }, want);
    await pg.waitForTimeout(180);
  }
}
async function refbranch(pg) {
  await pg.evaluate(qids => {
    window.__DEV.setArq(0);
    qids.forEach(id => window.__DEV.setAnswerById(id, 1));
    window.__DEV.gotoStep(qids.length);
    document.getElementById("next").click();
  }, FX50.P50_QIDS);
  await pg.waitForTimeout(250);
}
async function ctxEditor(pg, region) {
  await results(pg, FX52.P52_F1);
  await pg.click("#v32cta");
  await pg.waitForTimeout(320);
  await pg.evaluate(k => {
    const r = document.querySelector('[data-p52="ctx-region"][data-p52-region="' + k + '"]');
    if (r) window.scrollTo(0, r.getBoundingClientRect().top + window.scrollY - 24);
  }, region);
  await pg.waitForTimeout(220);
}
async function scrollTo(pg, sel, off) {
  await pg.evaluate(([s, o]) => {
    const e = document.querySelector(s);
    if (e) window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - (o || 24));
  }, [sel, off || 24]);
  await pg.waitForTimeout(220);
}

const CENAS = [
  { id: "01-home", desc: "Home — hero 7+5 com o emblema dos cinco domínios",
    go: async pg => { await pg.waitForTimeout(250); } },
  { id: "02-refinamento", desc: "Seu perfil-base está pronto — dois CTAs com a mesma geometria",
    go: refbranch },
  { id: "03-pergunta-mapa-aberto", desc: "Pergunta com o mapa do assessment expandido",
    go: pg => question(pg, 3, { map: true }) },
  { id: "04-pergunta-mapa-recolhido", desc: "Pergunta com o mapa recolhido",
    go: pg => question(pg, 3, { map: false }) },
  { id: "05-contexto-capabilities", desc: "Contexto tecnológico — região Capabilities de segurança",
    go: pg => ctxEditor(pg, "caps"), viewport: true },
  { id: "06-contexto-ambiente", desc: "Contexto tecnológico — região Ambiente e condicionantes",
    go: pg => ctxEditor(pg, "env"), viewport: true },
  { id: "07-contexto-ajuda", desc: "Ajuda de capability aberta (Gestão de conhecimento)",
    go: async pg => {
      await ctxEditor(pg, "caps");
      await pg.evaluate(() => {
        const b = document.querySelector('[data-p52="cap-help"][data-cap="knowledge-management"]');
        if (b) { b.scrollIntoView({ block: "center" }); b.click(); }
      });
      await pg.waitForTimeout(260);
    }, viewport: true },
  { id: "08-visao-executiva", desc: "Visão executiva — score, radar, terceira coluna e 6+6",
    go: pg => results(pg, FX52.P52_F1) },
  { id: "09-suficiencia-bloqueada", desc: "Suficiência insuficiente — painel completo e resultado bloqueado",
    go: pg => results(pg, FX52.P52_F3) },
  { id: "10-suficiencia-atendida", desc: "Suficiência atendida — status compacto e Base de evidência",
    go: async pg => {
      await results(pg, FX52.P52_F1);
      await pg.evaluate(() => { const b = document.getElementById("p52-evbase"); if (b) b.open = true; });
      await scrollToEvbase(pg);
    }, viewport: true },
  { id: "11-resumo-barras", desc: "Resumo com as cinco barras de maturidade",
    go: async pg => { await results(pg, FX52.P52_F1); await scrollTo(pg, "#p50-panel-resumo", 40); }, viewport: true },
  { id: "12-recomendacoes-icones", desc: "Formas de apoio — ícones lado a lado",
    go: async pg => { await results(pg, { vec: new Array(15).fill(0) }); await scrollTo(pg, "#p52-sec-support", 40); }, viewport: true },
  { id: "13-cenario-alvo", desc: "Cenário-alvo declarado",
    go: pg => results(pg, FX52.P52_F2) },
  /* REV B */
  { id: "17-home-emblema-ajuda", desc: "REV B · home com explicação de domínio aberta",
    go: async pg => {
      await pg.waitForTimeout(250);
      await pg.evaluate(() => {
        const g = document.querySelector('.p52-emblem-node[data-dom="0"]');
        if (g) g.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      });
      await pg.waitForTimeout(250);
    } },
  { id: "18-contexto-editor-revb", desc: "REV B · editor com só SOC & Operations aberto",
    go: async pg => { await ctxEditor(pg, "caps"); }, viewport: true },
  { id: "19-contexto-ajuda-arquitetura", desc: "REV B · ajuda de arquitetura e residência de dados",
    go: async pg => {
      await ctxEditor(pg, "env");
      await pg.evaluate(() => {
        const g = document.querySelector('details[data-gid="arch"]');
        if (g) g.open = true;
      });
      await pg.waitForTimeout(200);
      await pg.evaluate(() => {
        const b = document.querySelector('[aria-describedby="p52-archhelp-dataResidency"]');
        if (b) { b.scrollIntoView({ block: "center" }); b.click(); }
      });
      await pg.waitForTimeout(250);
    }, viewport: true },
  { id: "20-dominios-largura", desc: "REV B · painel de domínios ocupando a largura da seção",
    go: async pg => { await results(pg, FX52.P52_F1); await scrollTo(pg, "#p52-sec-detail", 40); }, viewport: true },
  { id: "21-apoio-links", desc: "REV B · cards de apoio unificados com link oficial",
    go: async pg => {
      await results(pg, FX52.P52_F1);
      await pg.click("#v32cta");
      await pg.evaluate(() => {
        const g = document.querySelector('details[data-gid="g3"]'); if (g) g.open = true;
        ["security-analytics", "endpoint-detection", "soc-platform"].forEach(c => {
          const s = document.getElementById("v32-pres-" + c);
          if (s) { s.value = "NONE"; s.dispatchEvent(new Event("change")); }
        });
      });
      await pg.click("#v32save");
      await pg.waitForTimeout(400);
      await scrollTo(pg, "#v32support", 40);
    }, viewport: true },
  { id: "22-pergunta-evidencia-revb", desc: "REV B · 'O que registrar' antes do campo e exemplo como placeholder",
    go: async pg => { await question(pg, 1, { map: false });
      await pg.evaluate(() => { const t = document.getElementById("notetgl"); if (t) t.click(); });
      await pg.waitForTimeout(220); }, viewport: true },

  /* ======================================================================
     ERRATA DA AUDITORIA EXTERNA SÊNIOR DE FRONTEND · cenas nominais da §8.3
     ====================================================================== */
  { id: "EX01-contexto-todos-os-grupos", desc: "ERRATA · contexto tecnológico com TODOS os grupos abertos e ajuda (i) em todo campo",
    go: async pg => {
      await ctxEditor(pg, "caps");
      await pg.evaluate(() => { document.querySelectorAll("#v32editor details").forEach(d => { d.open = true; }); });
      await pg.waitForTimeout(420);
    } },
  { id: "EX02-requisitos-especificos", desc: "ERRATA §6.2 · requisitos específicos na grade única, quatro grupos",
    go: async pg => {
      await ctxEditor(pg, "env");
      await pg.evaluate(() => {
        document.querySelectorAll('#v32editor details[data-gid^="sig"]').forEach(d => { d.open = true; });
        const g = document.querySelector('details[data-gid="sig"]');
        if (g) window.scrollTo(0, g.getBoundingClientRect().top + window.scrollY - 24);
      });
      await pg.waitForTimeout(360);
    } },
  { id: "EX03-plataformas-licenciamento", desc: "ERRATA §6.1 · plataformas, bundles e subscriptions com ajuda (i)",
    go: async pg => {
      await ctxEditor(pg, "env");
      await pg.evaluate(() => {
        const g = document.querySelector('details[data-gid="plat"]');
        if (g) { g.open = true; window.scrollTo(0, g.getBoundingClientRect().top + window.scrollY - 24); }
      });
      await pg.waitForTimeout(340);
    } },
  { id: "EX04-alvo-vazio", desc: "ERRATA §6.4 · cenário-alvo no estado VAZIO, ocupando a seção",
    go: async pg => { await results(pg, { vec: FX52.P52_F2.vec }); await scrollTo(pg, "#ux-target", 40); }, viewport: true },
  { id: "EX05-alvo-editado", desc: "ERRATA §6.4 · cenário-alvo editado, tabela Atual × Alvo em largura plena",
    go: async pg => { await results(pg, FX52.P52_F2); await scrollTo(pg, "#ux-target", 40); }, viewport: true },
  { id: "EX06-para-avancar", desc: "ERRATA §6.3 · 'Para avançar' com tipografia de achado e marcador gráfico",
    go: async pg => { await results(pg, FX52.P52_F1); await scrollTo(pg, ".p52-exec-advance", 40); }, viewport: true },
  { id: "EX07-recomendacoes-principais", desc: "ERRATA §6.5 · cards de apoio V3.2 com ícones normalizados",
    go: async pg => {
      await results(pg, FX52.P52_F1);
      await pg.click("#v32cta");
      await pg.evaluate(() => {
        const g = document.querySelector('details[data-gid="g3"]'); if (g) g.open = true;
        ["security-analytics", "endpoint-detection", "soc-platform"].forEach(c => {
          const s = document.getElementById("v32-pres-" + c);
          if (s) { s.value = "NONE"; s.dispatchEvent(new Event("change")); }
        });
      });
      await pg.click("#v32save");
      await pg.waitForTimeout(420);
      await scrollTo(pg, "#v32support", 40);
    }, viewport: true },
  { id: "EX08-pode-fazer-sentido", desc: "ERRATA §6.6 · 'Pode fazer sentido — após validação' com ícone das soluções",
    go: async pg => {
      await results(pg, { vec: FX52.P52_F1.vec, priorities: FX52.P52_F1.priorities });
      await scrollTo(pg, ".t-list", 40);
    }, viewport: true },
  { id: "EX09-nao-priorizados", desc: "ERRATA §6.6 · 'Não priorizados neste screening' com ícone das soluções",
    go: async pg => {
      await results(pg, { vec: new Array(15).fill(2) });
      await pg.evaluate(() => { document.querySelectorAll("details.t-details").forEach(d => { d.open = true; }); });
      await pg.waitForTimeout(240);
      await scrollTo(pg, "details.t-details", 40);
    }, viewport: true },
  { id: "EX10-icones-lado-a-lado", desc: "ERRATA §6.5 · ícones comparados lado a lado, mesma ocupação óptica",
    go: async pg => { await results(pg, { vec: new Array(15).fill(0) }); await scrollTo(pg, "#p52-sec-support", 40); }, viewport: true },
  { id: "EX11-resultado-bloqueado", desc: "ERRATA §4.1 · resultado bloqueado: nenhum score por domínio publicado",
    go: pg => results(pg, FX52.P52_F3) }
];
async function scrollToEvbase(pg) {
  await pg.evaluate(() => {
    const e = document.getElementById("p52-evbase");
    if (e) window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 40);
  });
  await pg.waitForTimeout(240);
}

/* ============================================================================
   PATCH V3.2.2 · ACERVO PRÓPRIO DA RODADA (§9)
   Acionado por `V322_SHOTS=1` e escrito EXCLUSIVAMENTE em
   `docs_phase5/evidence_v322/`. Sem a variável, este arquivo se comporta byte a
   byte como antes e o acervo histórico da Phase 5.2 não é tocado.
   As capturas acompanham medidas em JSON: screenshot nunca é o único oracle.
   ========================================================================== */
const OUT322 = path.join(HERE, "docs_phase5", "evidence_v322");

const V322_MEASURE_FOOTER = function () {
  var b = function (e) { if (!e) return null; var r = e.getBoundingClientRect();
    return { l: +r.left.toFixed(1), r: +r.right.toFixed(1), t: +r.top.toFixed(1),
             b: +r.bottom.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
  var foot = document.querySelector(".wrap > footer");
  var legal = foot ? foot.querySelector(".p52-foot-legal") : null;
  var contact = foot ? foot.querySelector(".p52-foot-contact") : null;
  var wrap = document.querySelector(".wrap"), cs = getComputedStyle(wrap), wr = wrap.getBoundingClientRect();
  var inner = wr.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  var lb = b(legal), cb = b(contact);
  return {
    mode: foot ? foot.getAttribute("data-p52-footer") : null,
    larguraUtil: +inner.toFixed(1), rodape: b(foot), legal: lb, autoria: cb,
    fracaoDaLarguraUtil: (lb && inner) ? +(lb.w / inner).toFixed(3) : null,
    maxWidthLegal: legal ? getComputedStyle(legal).maxWidth : null,
    fonteLegalPx: legal ? parseFloat(getComputedStyle(legal).fontSize) : null,
    fonteAutoriaPx: contact ? parseFloat(getComputedStyle(contact).fontSize) : null,
    sobreposicao: (lb && cb) ? !(lb.r <= cb.l + 0.5 || cb.r <= lb.l + 0.5 ||
                                 lb.b <= cb.t + 0.5 || cb.b <= lb.t + 0.5) : null,
    empilhado: (lb && cb) ? lb.b <= cb.t + 0.5 : null,
    overflowHorizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth
  };
};

const V322_MEASURE_EDITOR = function () {
  var ed = document.getElementById("v32editor");
  if (!ed) return { ausente: true };
  var n = function (s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); };
  var regs = Array.prototype.slice.call(ed.querySelectorAll(":scope > .p52-ctxregion"));
  return {
    tela: document.body.getAttribute("data-uxscreen"),
    regioes: regs.map(function (r) {
      var body = r.querySelector(":scope > .p52-ctxregion-body");
      return { chave: r.getAttribute("data-p52-region"),
        titulo: n((r.querySelector(".p52-ctxregion-name") || {}).textContent),
        linhaDeOrientacao: n((r.querySelector(".p52-ctxregion-lead") || {}).textContent),
        grupos: body ? Array.prototype.slice.call(body.querySelectorAll(":scope > details[data-gid]"))
          .map(function (d) { return { gid: d.getAttribute("data-gid"), aberto: !!d.open }; }) : [] };
    }),
    gruposForaDeRegiao: ed.querySelectorAll(":scope > details[data-gid]").length,
    ajudasTotais: ed.querySelectorAll('[data-p52="cap-help"]').length,
    ajudasDeCapability: ed.querySelectorAll('[data-p52="cap-help"][data-cap]').length,
    campos: ed.querySelectorAll("input, select, textarea").length
  };
};

const V322_MEASURE_PENDING = function () {
  var n = function (s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); };
  var btn = null, bs = document.querySelectorAll("button"), i;
  for (i = 0; i < bs.length; i++) if (/Imprimir \/ salvar em PDF/.test(bs[i].textContent || "")) { btn = bs[i]; break; }
  var msg = document.querySelector('[data-p52="print-pending"]');
  var rail = document.getElementById("p52-railto-context");
  var railP = rail ? rail.querySelector('[data-p52="rail-pending"]') : null;
  var edBox = document.querySelector('#v32editor .v32-errors:not(.v32-hidden)');
  var grupo = btn ? btn.closest(".actions") : null;
  var b = function (e) { if (!e) return null; var r = e.getBoundingClientRect();
    return { t: +r.top.toFixed(1), b: +r.bottom.toFixed(1), l: +r.left.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
  var gb = b(grupo), mb = b(msg);
  return {
    mensagensJuntoAoPdf: document.querySelectorAll('[data-p52="print-pending"]').length,
    textoJuntoAoPdf: msg ? n(msg.textContent) : null,
    roleJuntoAoPdf: msg ? msg.getAttribute("role") : null,
    ariaLiveJuntoAoPdf: msg ? msg.getAttribute("aria-live") : null,
    distanciaDoGrupoDeAcoesPx: (gb && mb) ? Math.round(mb.t - gb.b) : null,
    ariaDescribedbyDoBotao: btn ? btn.getAttribute("aria-describedby") : null,
    atalhoIrParaContexto: document.querySelectorAll('[data-p52="goto-context"]').length,
    indicadoresNoTrilho: rail ? rail.querySelectorAll('[data-p52="rail-pending"]').length : 0,
    textoDoIndicador: railP ? n(railP.textContent) : null,
    estadoDoItemDoTrilho: rail ? rail.getAttribute("data-p52-pending") : null,
    textoAcessivelDoItem: rail ? n(rail.textContent) : null,
    mensagensNoEditor: document.querySelectorAll('#v32editor .v32-errors:not(.v32-hidden)').length,
    textoNoEditor: edBox ? n(edBox.textContent) : null,
    pendenciaSegundoOOwner: (window.__V32UI && typeof window.__V32UI.hasDraft === "function") ? window.__V32UI.hasDraft() : null,
    printChamado: window.__v322Print || 0
  };
};

/* ERRATA V3.2.2 · censo de ajuda `(i)` do editor, por família de alvo. Não é
   gate: é a medida que sustenta as capturas — quantos controles existem, onde
   existem e, sobretudo, onde deliberadamente NÃO existem mais. */
const V322_MEASURE_HELP = function () {
  var ed = document.getElementById("v32editor");
  if (!ed) return { ausente: true };
  var lab = function (e) { return e && e.closest ? e.closest("label") : null; };
  var temAjuda = function (e) { return !!(e && e.querySelector('[data-p52="cap-help"]')); };
  var conta = function (lista, alvo) {
    var com = 0, i;
    for (i = 0; i < lista.length; i++) if (alvo(lista[i])) com++;
    return { alvos: lista.length, comAjuda: com };
  };
  var A = function (sel) { return Array.prototype.slice.call(ed.querySelectorAll(sel)); };
  var plat = ed.querySelector('details[data-gid="plat"]');
  var platHead = plat && plat.parentElement && plat.parentElement.classList.contains("p52-grphead")
    ? plat.parentElement : plat;
  return {
    tela: document.body.getAttribute("data-uxscreen"),
    preservadas: {
      capabilities: conta(A(".v32-cap[id^='v32-cap-']"), function (c) {
        return !!c.querySelector('[data-p52="cap-help"][data-cap]'); }),
      camposDeArquitetura: conta(A('select[id^="v32-arch-"]'), function (x) { return temAjuda(lab(x)); }),
      familias: conta(A("details.v32-group[data-gid]"), function (d) {
        var h = d.parentElement && d.parentElement.classList.contains("p52-grphead") ? d.parentElement : d;
        return !!h.querySelector(':scope > [data-p52="cap-help"]'); }),
      subgruposDeRequisitos: conta(A("details.v32-siggroup[data-gid]"), function (d) {
        var h = d.parentElement && d.parentElement.classList.contains("p52-grphead") ? d.parentElement : d;
        return !!h.querySelector(':scope > [data-p52="cap-help"]'); }),
      sinais: conta(A('input[id^="v32-sig-"]'), function (x) { return temAjuda(lab(x)); })
    },
    removidas: {
      situacaoDeclarada: conta(A('select[id^="v32-pres-"]'), function (x) { return temAjuda(lab(x)); }),
      plataformaDeclarada: conta(A("#v32-plat-fgt"), function (x) { return temAjuda(lab(x)); }),
      bundles: conta(A('input[name="v32-bundle"]'), function (x) { return temAjuda(lab(x)); }),
      subscriptions: conta(A('input[id^="v32-sub-"]'), function (x) { return temAjuda(lab(x)); }),
      legendasInternas: conta(plat ? Array.prototype.slice.call(plat.querySelectorAll("fieldset > legend")) : [],
        function (x) { return temAjuda(x); })
    },
    ajudaUnicaDePlataformas: {
      noCabecalho: !!(platHead && platHead.querySelector(':scope > [data-p52="cap-help"]')),
      dentroDoGrupo: plat ? plat.querySelectorAll('[data-p52="cap-help"]').length : null,
      texto: (function () {
        var b = platHead && platHead.querySelector(':scope > [data-p52="cap-help"]');
        var pop = b ? document.getElementById(b.getAttribute("aria-describedby") || "") : null;
        return pop ? String(pop.textContent || "").replace(/\s+/g, " ").trim() : null;
      })()
    },
    totais: {
      ajudas: ed.querySelectorAll('[data-p52="cap-help"]').length,
      popovers: ed.querySelectorAll('[data-p52="cap-help-text"]').length,
      describedbyOrfaos: (function () {
        var n = 0, bs = ed.querySelectorAll('[data-p52="cap-help"]'), i;
        for (i = 0; i < bs.length; i++)
          if (!document.getElementById(bs[i].getAttribute("aria-describedby") || "")) n++;
        return n;
      })()
    },
    gruposAbertos: Array.prototype.slice.call(ed.querySelectorAll("details.v32-group[data-gid]"))
      .filter(function (d) { return d.open; }).map(function (d) { return d.getAttribute("data-gid"); })
  };
};

/* ERRATA V3.2.2 · medição do movimento. Executada no navegador, sobre a tela de
   pergunta real: troca de resposta na MESMA pergunta, avanço e retorno. Devolve
   o `animation-name` computado e a amostragem quadro a quadro — a opacidade
   mínima e os `transform` distintos observados em cada ação. */
const V322_MEASURE_MOTION = async function () {
  var sec = function () { return document.querySelector("#app section.screen"); };
  var leia = function () {
    var s = sec();
    if (!s) return { ausente: true };
    var cs = getComputedStyle(s);
    return { marcacao: s.getAttribute("data-p52-nav"), animacao: cs.animationName,
             duracao: cs.animationDuration, opacidade: parseFloat(cs.opacity), transform: cs.transform };
  };
  var amostrar = function (ms) {
    return new Promise(function (resolve) {
      var out = [], t0 = performance.now();
      (function passo() {
        var s = sec();
        if (s) { var cs = getComputedStyle(s); out.push([+(+cs.opacity).toFixed(3), cs.transform]); }
        if (performance.now() - t0 >= ms) {
          resolve({ quadros: out.length,
                    opacidadeMinima: out.length ? Math.min.apply(null, out.map(function (x) { return x[0]; })) : null,
                    transformsObservados: Array.from(new Set(out.map(function (x) { return x[1]; }))) });
          return;
        }
        requestAnimationFrame(passo);
      })();
    });
  };
  var R = { repouso: leia(), scrollAntes: window.scrollY };
  document.querySelectorAll("#app .opt")[2].click();
  R.trocaDeResposta = leia();
  R.trocaDeRespostaAmostra = await amostrar(420);
  R.scrollDepois = window.scrollY;
  document.getElementById("next").click();
  R.avanco = leia();
  R.avancoAmostra = await amostrar(420);
  document.getElementById("back").click();
  R.retorno = leia();
  R.retornoAmostra = await amostrar(420);
  return R;
};

async function v322Shots() {
  fs.mkdirSync(OUT322, { recursive: true });
  const browser = await chromium.launch(Object.assign({ args: ["--no-sandbox", "--disable-dev-shm-usage"] }, resolveBrowser()));
  const index = [], medidas = {};
  const shot = async (pg, nome, full) => {
    const f = "V322-" + nome + ".png";
    await pg.screenshot({ path: path.join(OUT322, f), fullPage: full !== false });
    return f;
  };
  try {
    /* --- CORREÇÃO A · editor nas duas entradas, mesma geometria ------------- */
    for (const entrada of ["home", "resultados"]) {
      const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      try {
        await pg.goto(URL);
        if (entrada === "home") { await pg.click("#ux-addctx"); }
        else { await results(pg, FX52.P52_F1); await pg.click("#v32cta"); }
        await pg.waitForTimeout(420);
        const f = await shot(pg, "01-contexto-" + entrada);
        medidas["editor-" + entrada] = await pg.evaluate(V322_MEASURE_EDITOR);
        index.push({ cena: "01-contexto-" + entrada, vp: "1440x900", file: f,
          desc: "Contexto tecnológico aberto pela entrada da " + entrada + " — duas regiões" });
        medidas["ajuda-" + entrada] = await pg.evaluate(V322_MEASURE_HELP);
        /* ERRATA V3.2.2 · primeira abertura limpa: os SEIS grupos recolhidos */
        if (entrada === "home") {
          await pg.evaluate(() => {
            const r = document.querySelector('[data-p52="ctx-region"][data-p52-region="caps"]');
            if (r) window.scrollTo(0, r.getBoundingClientRect().top + window.scrollY - 24);
          });
          await pg.waitForTimeout(220);
          const f2 = await shot(pg, "02-primeira-abertura-seis-recolhidos", false);
          index.push({ cena: "02-primeira-abertura-seis-recolhidos", vp: "1440x900", file: f2,
            desc: "Primeira abertura limpa — os seis grupos principais recolhidos, inclusive SOC & Operations" });

          /* uma capability aberta: a ajuda útil fica no NOME da capability, e
             'Situação declarada' já não carrega controle algum */
          await pg.click('#v32editor details[data-gid="g1"] > summary');
          await pg.waitForTimeout(360);
          await pg.evaluate(() => {
            const c = document.getElementById("v32-cap-knowledge-management");
            if (c) window.scrollTo(0, c.getBoundingClientRect().top + window.scrollY - 120);
          });
          await pg.waitForTimeout(200);
          await pg.hover('[data-p52="cap-help"][data-cap="knowledge-management"]');
          await pg.waitForTimeout(260);
          index.push({ cena: "10-capability-ajuda-no-nome", vp: "1440x900",
            file: await shot(pg, "10-capability-ajuda-no-nome", false),
            desc: "Capability aberta — ajuda (i) só no nome da capability; 'Situação declarada' sem controle" });

          /* plataformas e licenciamento: uma ajuda no cabeçalho, nenhuma por item */
          await pg.evaluate(() => {
            const s = document.querySelector('#v32editor details[data-gid="plat"] > summary');
            if (s) s.click();
          });
          await pg.waitForTimeout(400);
          await pg.evaluate(() => {
            const d = document.querySelector('#v32editor details[data-gid="plat"]');
            const h = d && d.parentElement;
            if (h) window.scrollTo(0, h.getBoundingClientRect().top + window.scrollY - 40);
          });
          await pg.waitForTimeout(220);
          index.push({ cena: "11-plataformas-sem-ajuda-por-item", vp: "1440x900",
            file: await shot(pg, "11-plataformas-sem-ajuda-por-item", false),
            desc: "Plataformas e licenciamento aberto — ajuda única no cabeçalho, zero controles por item" });
          medidas["ajuda-plataformas-aberto"] = await pg.evaluate(V322_MEASURE_HELP);
        }
      } finally { await pg.close(); }
    }

    /* --- CORREÇÃO B · rodapé nas seis larguras ----------------------------- */
    for (const w of [390, 768, 1440, 1920, 2560, 3440]) {
      const pg = await browser.newPage({ viewport: { width: w, height: 900 } });
      try {
        await pg.goto(URL);
        await pg.waitForTimeout(300);
        await pg.evaluate(() => {
          const f = document.querySelector(".wrap > footer");
          if (f) f.scrollIntoView({ block: "end" });
        });
        await pg.waitForTimeout(220);
        const f = await shot(pg, "03-rodape-" + w, false);
        medidas["rodape-" + w] = await pg.evaluate(V322_MEASURE_FOOTER);
        index.push({ cena: "03-rodape-" + w, vp: w + "x900", file: f,
          desc: "Rodapé da home em " + w + "px — bloco legal na largura útil, autoria à direita" });
      } finally { await pg.close(); }
    }

    /* --- CORREÇÃO C · pendência no ponto de ação --------------------------- */
    const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await pg.goto(URL);
      await results(pg, FX52.P52_F1);
      await pg.evaluate(() => { window.__v322Print = 0; window.print = function () { window.__v322Print++; }; });
      await pg.click("#v32cta");
      await pg.waitForTimeout(360);
      await pg.evaluate(() => {
        const s = document.querySelector("#v32editor select[id^='v32-arch-']");
        if (s && s.options.length > 1) { s.value = s.options[s.options.length - 1].value; s.dispatchEvent(new Event("change", { bubbles: true })); }
      });
      await pg.waitForTimeout(280);
      await pg.evaluate(() => { const a = document.getElementById("p52-railto-context"); if (a) a.scrollIntoView({ block: "center" }); });
      await pg.waitForTimeout(220);
      medidas["pendente-antes-da-tentativa"] = await pg.evaluate(V322_MEASURE_PENDING);
      index.push({ cena: "04-trilho-alteracoes-pendentes", vp: "1440x900",
        file: await shot(pg, "04-trilho-alteracoes-pendentes", false),
        desc: "Trilho lateral com 'alterações pendentes' ANTES de qualquer tentativa de impressão" });

      await pg.evaluate(() => {
        const b = Array.prototype.slice.call(document.querySelectorAll("button"))
          .filter(x => /Imprimir \/ salvar em PDF/.test(x.textContent || ""))[0];
        if (b) b.click();
      });
      await pg.waitForTimeout(480);
      await pg.evaluate(() => { const m = document.querySelector('[data-p52="print-pending"]'); if (m) m.scrollIntoView({ block: "center" }); });
      await pg.waitForTimeout(240);
      medidas["pendente-apos-bloqueio"] = await pg.evaluate(V322_MEASURE_PENDING);
      index.push({ cena: "05-mensagem-abaixo-do-pdf", vp: "1440x900",
        file: await shot(pg, "05-mensagem-abaixo-do-pdf", false),
        desc: "Mensagem exata logo abaixo do grupo de ações que contém Imprimir / salvar em PDF" });
      await pg.evaluate(() => { const a = document.querySelector("#v32editor .v32-actions"); if (a) a.scrollIntoView({ block: "center" }); });
      await pg.waitForTimeout(240);
      index.push({ cena: "06-mensagem-junto-a-salvar-cancelar", vp: "1440x900",
        file: await shot(pg, "06-mensagem-junto-a-salvar-cancelar", false),
        desc: "Mensagem preservada junto a Salvar contexto / Cancelar" });
      await pg.evaluate(() => { const a = document.getElementById("p52-railto-context"); if (a) a.scrollIntoView({ block: "center" }); });
      await pg.waitForTimeout(240);
      index.push({ cena: "07-trilho-apos-bloqueio", vp: "1440x900",
        file: await shot(pg, "07-trilho-apos-bloqueio", false),
        desc: "Item Contexto tecnológico com ênfase de erro — o texto continua explicando a ação" });

      await pg.evaluate(() => { const b = document.getElementById("v32save"); if (b) b.click(); });
      await pg.waitForTimeout(560);
      medidas["limpo-apos-salvar"] = await pg.evaluate(V322_MEASURE_PENDING);
      index.push({ cena: "08-limpo-apos-salvar", vp: "1440x900",
        file: await shot(pg, "08-limpo-apos-salvar"),
        desc: "Estado limpo após Salvar contexto — nenhum dos três indicadores permanece" });

      await pg.click("#v32cta");
      await pg.waitForTimeout(360);
      await pg.evaluate(() => {
        const s = document.querySelector("#v32editor select[id^='v32-arch-']");
        if (s && s.options.length > 1) { s.value = s.options[0].value; s.dispatchEvent(new Event("change", { bubbles: true })); }
      });
      await pg.waitForTimeout(220);
      await pg.evaluate(() => {
        const b = Array.prototype.slice.call(document.querySelectorAll("button"))
          .filter(x => /Imprimir \/ salvar em PDF/.test(x.textContent || ""))[0];
        if (b) b.click();
      });
      await pg.waitForTimeout(420);
      await pg.evaluate(() => { const b = document.getElementById("v32cancel"); if (b) b.click(); });
      await pg.waitForTimeout(560);
      medidas["limpo-apos-cancelar"] = await pg.evaluate(V322_MEASURE_PENDING);
      index.push({ cena: "09-limpo-apos-cancelar", vp: "1440x900",
        file: await shot(pg, "09-limpo-apos-cancelar"),
        desc: "Estado limpo após Cancelar — nenhum dos três indicadores permanece" });
    } finally { await pg.close(); }

    /* --- ERRATA V3.2.2 · movimento: a medição, e não só a foto -------------
       Screenshot não fotografa ausência de animação. O que prova a correção é
       a MEDIÇÃO: `animation-name` computado e a amostragem quadro a quadro da
       opacidade e do `transform` logo depois de cada ação. As duas capturas
       de navegação existem para o olho; os números existem para a auditoria. */
    for (const reduzido of [false, true]) {
      const chave = reduzido ? "movimento-reduced-motion" : "movimento-normal";
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: reduzido ? "reduce" : "no-preference"
      });
      const mp = await ctx.newPage();
      try {
        await mp.goto(URL);
        await question(mp, 3);
        await mp.waitForTimeout(420);
        medidas[chave] = await mp.evaluate(V322_MEASURE_MOTION);
        if (!reduzido) {
          index.push({ cena: "12-avanco-entre-perguntas", vp: "1440x900",
            file: await shot(mp, "12-avanco-entre-perguntas", false),
            desc: "Pergunta seguinte logo após avançar — transição horizontal curta em curso" });
          await mp.evaluate(() => document.getElementById("back").click());
          await mp.waitForTimeout(40);
          index.push({ cena: "13-retorno-entre-perguntas", vp: "1440x900",
            file: await shot(mp, "13-retorno-entre-perguntas", false),
            desc: "Pergunta anterior logo após voltar — mesma transição, no sentido inverso" });
        }
      } finally { await mp.close().catch(() => { }); await ctx.close().catch(() => { }); }
    }

    /* --- capturas de referência a partir dos bytes FINAIS da candidata -----
       A imagem de abertura do README e as capturas do pacote externo têm de
       sair DESTA candidata, não de um acervo anterior: o rodapé da home mudou
       na v3.2.2 e uma captura antiga mostraria estado visual superado. */
    const cenasFinais = [
      { nome: "14-home-1920x1080", desc: "Tela de abertura da candidata V3.2.2 — imagem usada pelo README",
        ir: async () => { } },
      { nome: "15-questionario-1920x1080", desc: "Pergunta com o mapa do assessment, na candidata V3.2.2",
        ir: async (pg) => { await question(pg, 3); } },
      { nome: "16-resultados-1920x1080", desc: "Workspace de resultados da candidata V3.2.2",
        ir: async (pg) => { await results(pg, FX52.P52_F1); } }
    ];
    for (const cena of cenasFinais) {
      const hp = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
      try {
        await hp.goto(URL);
        await hp.waitForTimeout(300);
        await cena.ir(hp);
        await hp.waitForTimeout(420);
        /* espera ATIVA pelo repouso: nada de número mágico, e o PNG deixa de
           depender do instante em que a transição de navegação terminou. */
        await hp.evaluate(() => Promise.race([
          Promise.all(document.getAnimations().map(a => a.finished.catch(() => null))),
          new Promise(r => setTimeout(r, 1500))
        ]));
        const f = await shot(hp, cena.nome, true);
        index.push({ cena: cena.nome, vp: "1920x1080", file: f, desc: cena.desc });
      } finally { await hp.close(); }
    }
  } finally { await browser.close(); }

  fs.writeFileSync(path.join(OUT322, "V322-medidas.json"), JSON.stringify(medidas, null, 2) + "\n", "utf8");
  let md = "# Evidência visual · Patch V3.2.2 — contexto, rodapé e pendência de impressão\n\n" +
    "Acervo gerado por `tools_p52_shots.js` com `V322_SHOTS=1` sobre a candidata local.\n" +
    "Não é gate: não afirma PASS nem FAIL. As medidas que sustentam as asserções estão em\n" +
    "`V322-medidas.json` — bounding boxes, largura útil, fração ocupada, sobreposição,\n" +
    "overflow, estados `open`, contagem de mensagens por local e nomes acessíveis.\n" +
    "Screenshot não é o único oracle: os gates `V322-*` medem geometria e DOM.\n\n" +
    "| cena | viewport | arquivo | descrição |\n|---|---|---|---|\n";
  index.forEach(i => { md += "| " + i.cena + " | " + i.vp + " | `" + i.file + "` | " + i.desc + " |\n"; });
  md += "\n## Medidas\n\n| arquivo | conteúdo |\n|---|---|\n" +
    "| `V322-medidas.json` | geometria do rodapé nas seis larguras; estrutura do editor nas duas entradas; as três apresentações da pendência em cada etapa do ciclo; o censo de ajuda `(i)` por família de alvo (preservadas × removidas); e a medição de movimento com e sem `prefers-reduced-motion` |\n";
  fs.writeFileSync(path.join(OUT322, "INDEX.md"), md, "utf8");
  console.log("evidência V3.2.2: " + index.length + " capturas em " + OUT322);
}

(async () => {
  if (process.env.V322_SHOTS === "1") { await v322Shots(); return; }
  const browser = await chromium.launch(Object.assign({ args: ["--no-sandbox", "--disable-dev-shm-usage"] }, resolveBrowser()));
  const index = [];
  try {
    for (const cena of CENAS) {
      for (const vp of VIEWPORTS) {
        const pg = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
        try {
          await pg.goto(URL);
          await cena.go(pg);
          const name = "P52-" + cena.id + "-" + vp.w + "x" + vp.h + ".png";
          await pg.screenshot({ path: path.join(OUT, name), fullPage: !cena.viewport });
          index.push({ cena: cena.id, desc: cena.desc, vp: vp.w + "x" + vp.h, file: name });
        } catch (e) {
          index.push({ cena: cena.id, desc: cena.desc, vp: vp.w + "x" + vp.h, file: null, erro: String(e.message).split("\n")[0] });
        } finally { await pg.close(); }
      }
    }
    /* ERRATA UAT ESTREITA · cenas próprias da rodada: os cinco popovers de
       domínio, um a um, e a faixa ultrawide exata da §2.4 (3440x1392). */
    for (let d = 0; d < 5; d++) {
      const pg = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
      try {
        await pg.goto(URL);
        await pg.waitForSelector('.p52-emblem-node[data-dom="' + d + '"]', { state: "attached" });
        await pg.locator('.p52-emblem-node[data-dom="' + d + '"]').hover({ force: true });
        await pg.waitForTimeout(240);
        const nome = "P52-ER-popover-dominio-" + d + "-1920x1080.png";
        await pg.screenshot({ path: path.join(OUT, nome), fullPage: false });
        index.push({ cena: "ER-popover", desc: "Popover do domínio " + (d + 1) + " aberto por ponteiro",
                     vp: "1920x1080", file: nome });
      } catch (e) {
        index.push({ cena: "ER-popover", desc: "Popover do domínio " + (d + 1), vp: "1920x1080",
                     file: null, erro: String(e.message).split("\n")[0] });
      } finally { await pg.close(); }
    }
    for (const uw of [
      { id: "ER-ultrawide-home", desc: "Home na faixa ultrawide (escala ~1,22)", go: async pg => { await pg.waitForTimeout(260); } },
      { id: "ER-ultrawide-pergunta", desc: "Questionário na faixa ultrawide (escala ~1,10)", go: pg => question(pg, 3, { map: true }) }
    ]) {
      const pg = await browser.newPage({ viewport: { width: 3440, height: 1392 } });
      try {
        await pg.goto(URL);
        await uw.go(pg);
        const nome = "P52-" + uw.id + "-3440x1392.png";
        await pg.screenshot({ path: path.join(OUT, nome), fullPage: false });
        index.push({ cena: uw.id, desc: uw.desc, vp: "3440x1392", file: nome });
      } catch (e) {
        index.push({ cena: uw.id, desc: uw.desc, vp: "3440x1392", file: null, erro: String(e.message).split("\n")[0] });
      } finally { await pg.close(); }
    }
    /* ERRATA DA AUDITORIA EXTERNA · §8.3 · zoom de 110% e 125% em 1440x900,
       emulados pela viewport CSS equivalente (1309x818 e 1152x720). */
    for (const z of [
      { id: "EXzoom110-resultado", vp: { width: 1309, height: 818 }, dsf: 1.1, desc: "ERRATA · zoom 110% em 1440x900 — resultado" },
      { id: "EXzoom125-resultado", vp: { width: 1152, height: 720 }, dsf: 1.25, desc: "ERRATA · zoom 125% em 1440x900 — resultado" },
      { id: "EXzoom110-contexto", vp: { width: 1309, height: 818 }, dsf: 1.1, desc: "ERRATA · zoom 110% em 1440x900 — contexto tecnológico" },
      { id: "EXzoom125-contexto", vp: { width: 1152, height: 720 }, dsf: 1.25, desc: "ERRATA · zoom 125% em 1440x900 — contexto tecnológico" }
    ]) {
      const zp = await browser.newPage({ viewport: z.vp, deviceScaleFactor: z.dsf });
      try {
        await zp.goto(URL);
        if (/contexto/.test(z.id)) { await ctxEditor(zp, "caps"); }
        else { await results(zp, FX52.P52_F1); }
        const nome = "P52-" + z.id + ".png";
        await zp.screenshot({ path: path.join(OUT, nome), fullPage: false });
        index.push({ cena: z.id, desc: z.desc, vp: z.vp.width + "x" + z.vp.height, file: nome });
      } catch (e) {
        index.push({ cena: z.id, desc: z.desc, vp: z.vp.width + "x" + z.vp.height, file: null, erro: String(e.message).split("\n")[0] });
      } finally { await zp.close(); }
    }
    /* zoom de 200% em 1440x900 (viewport CSS equivalente de 720x450) */
    for (const z of [
      { id: "14-zoom200-home", desc: "Zoom 200% em 1440x900 — home", go: async pg => { await pg.waitForTimeout(220); } },
      { id: "15-zoom200-pergunta", desc: "Zoom 200% em 1440x900 — pergunta", go: pg => question(pg, 3, { map: false }) },
      { id: "16-zoom200-resultado", desc: "Zoom 200% em 1440x900 — resultado", go: pg => results(pg, FX52.P52_F1) }
    ]) {
      const zp = await browser.newPage({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
      try {
        await zp.goto(URL);
        await z.go(zp);
        const name = "P52-" + z.id + ".png";
        await zp.screenshot({ path: path.join(OUT, name), fullPage: true });
        index.push({ cena: z.id, desc: z.desc, vp: "720x450@2x (=1440x900 a 200%)", file: name });
      } finally { await zp.close(); }
    }
  } finally { await browser.close(); }

  const byCena = {};
  index.forEach(i => (byCena[i.cena] = byCena[i.cena] || { desc: i.desc, files: [] }).files.push(i));
  let md = "# Evidência visual · Phase 5.2 — Etapa A\n\n" +
    "Acervo gerado por `tools_p52_shots.js` sobre a candidata local. Cada cena é\n" +
    "fotografada nas oito viewports obrigatórias da §14.2 da diretriz; salvo indicação\n" +
    "em contrário, a captura é de página inteira.\n\n";
  Object.keys(byCena).sort().forEach(k => {
    md += "## " + k + " — " + byCena[k].desc + "\n\n";
    md += "| viewport | arquivo |\n|---|---|\n";
    byCena[k].files.forEach(f => { md += "| " + f.vp + " | " + (f.file ? "`" + f.file + "`" : "**FALHOU** — " + f.erro) + " |\n"; });
    md += "\n";
  });
  md += "## Medições e diagnósticos\n\n" +
    "| arquivo | conteúdo |\n|---|---|\n" +
    "| `P52-LAY1-widths.json` | largura de borda e de conteúdo de `.wrap` por viewport |\n" +
    "| `P52-LAY2-question.json` | geometria da tela de pergunta e do rodapé |\n" +
    "| `P52-LAY3-sections.json` | ordem e geometria das seções do workspace |\n" +
    "| `P52-NAV1-rail.json` | trilho: teclado, ativação, scroll spy e comportamento mobile |\n" +
    "| `P52-ICON1-optics.json` | bounding box de pixels do artwork de cada tile |\n" +
    "| `P52-DOM1-tags.json` | cor, borda e contraste de cada tag de domínio |\n" +
    "| `P52-GAP1-groups.json` | geometria dos grupos de severidade |\n" +
    "| `P52-REC1-grid.json` | grade das formas de apoio |\n" +
    "| `P52-CTX1-context.json` | card de contexto e estado dos grupos do editor |\n" +
    "| `P52-PR1-print.json` | isolamento de print (PDF executivo e papel legado) |\n" +
    "| `P52-ACC1-axe.json` | violações de axe: superfícies novas e comparação com o baseline |\n" +
    "| `P52-ACC2-zoom200.json` | controles e seções sob zoom de 200% |\n" +
    "| `P52-mutation.json` | campanha de mutação: mutantes e gates que os detectaram |\n";

  /* provas de PDF REAL (REV B §11): os arquivos são gerados pelo gate de
     Chromium; aqui apenas indexamos o que estiver no acervo, sem afirmar
     PASS. As páginas rasterizadas acompanham cada PDF quando presentes. */
  const PDFDIR = path.join(OUT, "pdf");
  if (fs.existsSync(PDFDIR)) {
    const arqs = fs.readdirSync(PDFDIR).sort();
    if (arqs.length) {
      md += "\n## Provas de PDF real\n\n" +
        "Impressão real em A4 com margens de 12 mm, pelo mesmo Chromium dos gates. As páginas\n" +
        "rasterizadas (`-pagina-*.png`) existem para leitura direta do papel, sem visualizador.\n\n" +
        "| arquivo | bytes |\n|---|---|\n";
      for (const a of arqs) md += "| `pdf/" + a + "` | " + fs.statSync(path.join(PDFDIR, a)).size + " |\n";
    }
  }
  fs.writeFileSync(path.join(OUT, "INDEX.md"), md, "utf8");
  const falhas = index.filter(i => !i.file);
  console.log("evidência visual: " + (index.length - falhas.length) + "/" + index.length + " capturas em " + OUT);
  if (falhas.length) { falhas.forEach(f => console.log("  FALHOU " + f.cena + " " + f.vp + ": " + f.erro)); process.exit(1); }
})().catch(e => { console.error("SHOTS P52: falha fatal —", e && e.stack || e); process.exit(1); });
