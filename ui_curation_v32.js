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

   ==========================================================================
   [026 · T020] A OFERTA NASCE UMA VEZ, AQUI
   ==========================================================================
   "O que o motor ofereceu" existia duas vezes (EA-76; QS-01), nenhuma
   reconciliando veto, variante, elegibilidade ou nota do motor. Agora
   `reconciliar()` — PURA (dado → dado), sem DOM, sem estado, sem cache —
   deriva de `entradaViva()` os REGISTROS de decisão de apoio e os VETOS com a
   razão literal do motor; tela, editor e papel consomem pelo bridge
   (`oferta()`, `vetos()`, `reconcile()`) e nunca escrevem (R9 §5). Nada disto
   é serializado (INV-8); `decidir`/`publicados`/sessão não mudaram uma letra.
   Regras: specs/026-decisao-unica-do-apoio/spec.md §Comportamento; pareamento
   itemId → chave: anexos/pareamento.md. Gates `D026-REC1`/`D026-LEG1`.
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

  /* [026] constantes da derivação — vocabulário fechado; rótulo de apresentação
     NÃO mora aqui (ui_p52_support_v32.js). D-3 (spec §C3): chave de reversão —
     com `true` a regra NUNCA veta (hipótese `plataforma-declarada-cobre`, tier
     2); nasce desligada porque retirar o card devolveria a Camada 1
     (`hasSubstituteV32`, ui_v32.js:751). */
  var CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = false;
  var LINHA_DA_FAMILIA_DE_SERVICO = { "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" };   /* regra 4 do pareamento */
  /* precedências da fusão (plan.md §Contratos): índice menor = mais forte */
  var FORCA_ACAO = ["avaliar-aquisicao", "modalidade-a-definir", "servico", "apoio-contextual", "conversa-por-sinal", "hipotese"];
  var FORCA_CONDICAO = ["sem-contexto", "capability-nao-informada", "contexto-a-validar", "fora-do-catalogo-contextual", "plataforma-declarada-cobre"];
  var CLASSE_DO_GAP = { OPERATIONAL_GAP: "operacional", COVERAGE_GAP: "expansao", ADOPTION_GAP: "enablement" };
  /* únicos literais do dono do estado: vetos que o engine emite SEM nota (spec §2.2) */
  var SEM_NOTA_VALIDAR = "presença declarada como desconhecida — validar antes de qualquer leitura de gap";
  var SEM_CANDIDATO = "o motor não resolveu candidato para esta linha nesta capability";
  var ARQ_VIOLADA = "oferta incompatível com a arquitetura declarada (archSatisfied: violated)";

  /* [026] "O MOTOR TEM VOZ nesta capability" — helper único (R9 §8); espelha a
     cláusula de `hasSubstituteV32` (ui_v32.js:750-752). Veto só nasce onde isto é
     verdadeiro — por isso um veto nunca devolve a Camada 1 (`D026-LEG1 (e)`). */
  function temVoz(ctx) {
    if (!ctx || ctx.classification === "CONTEXT_NOT_INFORMED") return false;
    return ((ctx.candidates || []).length + (ctx.services || []).length + (ctx.notes || []).length) > 0;
  }

  /* [026] PAREAMENTO itemId → chave por critério (spec §Pareamento, regras 1→5
     na ordem escrita; anexos/pareamento.md PAR-1..PAR-9). Total sobre
     OFFERINGS ∪ SERVICES; devolve a CHAVE de PRODUCTS (PAR-6). */
  function pareamento(catalogo, produtos) {
    var OFF = catalogo.ofertas || {}, SRV = catalogo.servicos || {}, SF = catalogo.familiasServico || {};
    var porNome = {}, imagem = {};
    Object.keys(produtos).forEach(function (k) { if (produtos[k] && produtos[k].n) porNome[produtos[k].n] = k; });
    function regra1(nome) { return (nome && Object.prototype.hasOwnProperty.call(porNome, nome)) ? porNome[nome] : null; }
    function chaveDe(id) {
      var o = OFF[id], s = SRV[id], k, cur, vis, fam, reps, fams, i;
      if (o) {
        k = regra1(o.name); if (k) return k;                                   /* 1 · nome exato */
        cur = o.variantOf; vis = [id];                                          /* 2 · cadeia variantOf até (1) */
        while (cur && OFF[cur] && vis.indexOf(cur) < 0) {
          vis.push(cur); k = regra1(OFF[cur].name); if (k) return k; cur = OFF[cur].variantOf;
        }
        /* 3 · representante ÚNICO da família (PAR-4: cadeia esgotada cai aqui; PAR-5: fam null → não se aplica) */
        fam = o.entityType === "family" ? id : (o.family || null);
        if (fam) {
          reps = Object.keys(OFF).filter(function (x) {
            return OFF[x].family === fam && !OFF[x].variantOf && OFF[x].entityType !== "family" && !!regra1(OFF[x].name);
          });
          if (reps.length === 1) return regra1(OFF[reps[0]].name);
        }
        return null;                                                            /* 5 · incurável */
      }
      if (s) {
        k = regra1(s.name); if (k) return k;                                   /* 1 */
        fams = Object.keys(SF).filter(function (f) { return ((SF[f] || {}).members || []).indexOf(id) >= 0; });
        for (i = 0; i < fams.length; i++) if (LINHA_DA_FAMILIA_DE_SERVICO[fams[i]]) return LINHA_DA_FAMILIA_DE_SERVICO[fams[i]];   /* 4 */
        return null;
      }
      return null;
    }
    Object.keys(OFF).concat(Object.keys(SRV)).forEach(function (id) { var k = chaveDe(id); if (k) (imagem[k] = imagem[k] || []).push(id); });
    function idsDaLinha(chave) { return (imagem[chave] || []).slice(); }
    function tipoDaLinha(chave) { return idsDaLinha(chave).some(function (id) { return !!SRV[id]; }) ? "servico" : "produto"; }
    return { chaveDe: chaveDe, idsDaLinha: idsDaLinha, tipoDaLinha: tipoDaLinha };
  }

  /* [026] COLETOR — só leitura, sob `typeof`; `soMapa` monta só a Camada 1
     (hipótese do mapa, porta de saída quando o motor falta). `null` quando o
     necessário falta ou lança; quem chama nomeia no console (R10 §2). */
  function coletar(soMapa) {
    var temC1 = typeof computeFindings === "function" && typeof MAP !== "undefined" && typeof PRODUCTS !== "undefined" && !!PRODUCTS;
    var temMotor = typeof V32 !== "undefined" && !!V32 && typeof V32.buildRecommendationContext === "function";
    if (!temC1 || (!soMapa && !temMotor)) return null;
    try {
      var e = { legado: true, suficiente: false, findings: (computeFindings() || {}).findings || [], mapa: MAP, produtos: PRODUCTS,
        contextos: {}, catalogo: { ofertas: {}, servicos: {}, familiasServico: {}, capabilities: {} }, landscape: {},
        supressao: { caps: [], plataforma: null }, arquitetura: {}, elegibilidade: {}, solucoes: {} };
      if (soMapa) return e;
      var r = V32.buildRecommendationContext() || {};
      var sup = (typeof V32.suppressedByPlatform === "function") ? (V32.suppressedByPlatform() || {}) : {};
      (sup.caps || []).forEach(function (c) { e.supressao.caps.push(c); });
      e.supressao.plataforma = sup.plat || null;
      e.legado = (typeof V32.isLegacyModeV32 === "function") ? !!V32.isLegacyModeV32() : !!r.legacyMode;
      e.contextos = r.contexts || {};
      e.catalogo = { ofertas: V32.OFFERINGS || {}, servicos: V32.SERVICES || {}, familiasServico: V32.SERVICE_FAMILIES || {}, capabilities: V32.CAPABILITIES || {} };
      Object.keys(e.catalogo.ofertas).forEach(function (id) { e.arquitetura[id] = V32.archSatisfied(e.catalogo.ofertas[id].architectureRequires); });
      Object.keys(e.catalogo.servicos).forEach(function (sid) { e.elegibilidade[sid] = V32.serviceEligibility(sid); });
      Object.keys(V32.TECH_LANDSCAPE || {}).forEach(function (c) {   /* `solucoes`: acréscimo declarado ao shape da spec, para `existente[]` do veto */
        var L = V32.TECH_LANDSCAPE[c] || {};
        e.landscape[c] = L.presence;
        e.solucoes[c] = (L.solutions || []).map(function (s) { return { product: s.product || "", status: s.status || "", deployment: s.deployment || null }; });
      });
      /* INV-3: a suficiência vem do dono (`__P50SUFF`); desconhecida ⇒ não publicável */
      var suf = (window.__P50SUFF && typeof window.__P50SUFF.contract === "function") ? window.__P50SUFF.contract().sufficient : null;
      e.suficiente = suf === true;
      return e;
    } catch (ex) { if (typeof console !== "undefined" && console.error) console.error("[026] coletor da oferta lançou:", ex && ex.message); return null; }
  }
  function entradaViva() { return coletar(false); }

  /* [026] RECONCILIAR — pura: dado → { registros[], vetos[] }. Não lê DOM,
     estado nem globais; não muta `entrada`. Regras: spec §Portas de saída,
     §Veredito por linha, §Serviço (exceção D-6), §Tier/título, §Fusão (E4/E5). */
  function reconciliar(entrada) {
    var P = entrada.produtos || {}, MAPA = entrada.mapa || {}, ctxs = entrada.contextos || {};
    var cat = entrada.catalogo || {}, OFF = cat.ofertas || {}, SRV = cat.servicos || {}, CAPS = cat.capabilities || {};
    var supCaps = (entrada.supressao && entrada.supressao.caps) || [], plat = (entrada.supressao && entrada.supressao.plataforma) || null;
    var landscape = entrada.landscape || {}, solucoes = entrada.solucoes || {}, arq = entrada.arquitetura || {}, eleg = entrada.elegibilidade || {};
    var par = pareamento(cat, P), acc = {}, ordem = [], vetosEmitidos = [];

    function capOnde(teste) { var ids = Object.keys(CAPS), i; for (i = 0; i < ids.length; i++) if (teste(CAPS[ids[i]] || {})) return ids[i]; return null; }
    function capDaPergunta(qid) { return capOnde(function (c) { return (c.questionIds || []).indexOf(qid) >= 0; }); }
    function capIdPorNome(nome) { return capOnde(function (c) { return c.name === nome; }); }
    function nomeDe(id) { return (OFF[id] && OFF[id].name) || (SRV[id] && SRV[id].name) || id; }
    function unico(arr, v) { if (v && arr.indexOf(v) < 0) arr.push(v); }
    /* acumulador por chave || itemId — nunca por nome exibido (§2.5) */
    function entradaDe(chave, itemId) {
      var key = chave || itemId;
      if (!acc[key]) { ordem.push(key); acc[key] = { chave: chave, nome: chave ? P[chave].n : nomeDe(itemId), motor: [], hipoteses: [], vetos: [], caps: [], sinais: [] }; }
      return acc[key];
    }
    function hipotese(l, condicao, tier) {
      entradaDe(l.chave, null).hipoteses.push({ capId: l.capId, qid: l.qid, texto: l.cap, sev: l.sev, lvl: l.lvl, sn: l.sn, condicao: condicao, tier: tier || (l.sev === 2 ? 1 : 2) });
    }
    function motor(l, f) {
      f.capId = l.capId; f.qid = l.qid; f.texto = l.cap; f.sev = l.sev; f.lvl = l.lvl; f.sn = l.sn; entradaDe(l.chave, f.itemId || f.serviceId).motor.push(f);
    }
    function veto(l, classe, motivo, ctx, chavesH, itemId) {
      var ext = [], svc = [], existente = (solucoes[l.capId] || []).map(function (s) { return { product: s.product, status: s.status, deployment: s.deployment || null }; });
      ((ctx && ctx.candidates) || []).forEach(function (cd) {
        if (cd && cd.itemKind === "contextual-extension") ext.push({ itemId: cd.itemId, nome: nomeDe(cd.itemId), scopeNote: cd.scopeNote || null });
      });
      ((ctx && ctx.services) || []).forEach(function (s) {       /* serviços do motor SEM linha no MAP da pergunta (D-5): informativo */
        if (chavesH.indexOf(par.chaveDe(s.serviceId)) < 0) svc.push({ serviceId: s.serviceId, nome: nomeDe(s.serviceId), note: s.note || null });
      });
      if (!existente.length && classe === "plataforma" && plat && plat.solution)
        existente.push({ product: plat.solution.product || "", status: plat.solution.status || "", deployment: plat.solution.deployment || null });
      var v = { chave: l.chave, nome: P[l.chave].n, itemId: itemId || null, capId: l.capId, cap: l.cap, classe: classe, motivo: motivo,
        notas: ((ctx && ctx.notes) || []).slice(), existente: existente, extensoes: ext, servicos: svc };
      entradaDe(l.chave, null).vetos.push(v); vetosEmitidos.push(v);
    }
    function apoio(cd, ctx) { return { via: "gap", acao: "apoio-contextual", itemId: cd.itemId, tier: 2, escopo: cd.scopeNote || null, notas: ctx.notes || [] }; }

    /* §2.2 — linha de PRODUTO × capability */
    function veredictoDeProduto(l, ctx, chavesH) {
      var ids = par.idsDaLinha(l.chave);
      var relacionados = ids.filter(function (id) { return !!OFF[id] && (OFF[id].capabilityRelations || []).some(function (r) { return r.capability === l.capId; }); });
      if (!ctx || ctx.classification === "CONTEXT_NOT_INFORMED") {
        if (CONTEXTO_SUPRIMIDO_POR_PLATAFORMA && supCaps.indexOf(l.capId) >= 0) return hipotese(l, "plataforma-declarada-cobre", 2);
        return hipotese(l, "capability-nao-informada");
      }
      if (!temVoz(ctx)) return hipotese(l, "contexto-a-validar");
      var cls = ctx.classification, cands = ctx.candidates || [], notas = ctx.notes || [];
      var gapAlto = !!(ctx.maturity && ctx.maturity.state === "gap-high");
      var alvo = relacionados.filter(function (id) { return OFF[id].entityType !== "family"; })[0] || relacionados[0] || null;
      var daLinha = function (kinds) { return cands.filter(function (cd) {
        return cd && kinds.indexOf(cd.itemKind) >= 0 && (ids.indexOf(cd.itemId) >= 0 || (cd.variants || []).some(function (v) { return ids.indexOf(v) >= 0; }));
      }); };
      var ctxSup = daLinha(["contextual-support"]);
      if (cls === "TECHNOLOGY_WHITESPACE") {
        if (ctx.supportMode === "DIRECT") {
          var diretos = daLinha(["offering"]), fams = daLinha(["family", "family-of-variants"]);
          if (diretos.length) return diretos.forEach(function (cd) {
            motor(l, { via: "gap", acao: "avaliar-aquisicao", itemId: cd.itemId, tier: gapAlto ? 1 : 2,
              escopo: cd.scopeNote || null, resolucao: cd.variantResolution || "atende", notas: notas });
          });
          if (fams.length) return motor(l, { via: "gap", acao: "modalidade-a-definir", itemId: fams[0].itemId, tier: 2,
            resolucao: fams[0].variantResolution || null, variantes: (fams[0].variants || []).slice(), notas: notas });
          if (ctxSup.length) return motor(l, apoio(ctxSup[0], ctx));
          if (!relacionados.length) return hipotese(l, "fora-do-catalogo-contextual");
          var violada = relacionados.some(function (id) { return arq[id] === "violated"; });
          return veto(l, violada ? "arquitetura" : "motor-sem-candidato", violada ? ARQ_VIOLADA : SEM_CANDIDATO, ctx, chavesH, alvo);
        }
        if (supCaps.indexOf(l.capId) >= 0) return veto(l, "plataforma", notas[0] || "", ctx, chavesH, alvo);
        if (ctxSup.length) return motor(l, apoio(ctxSup[0], ctx));
        return veto(l, "motor-sem-candidato", SEM_CANDIDATO, ctx, chavesH, alvo);
      }
      if (CLASSE_DO_GAP[cls]) {
        if (ctxSup.length) return motor(l, apoio(ctxSup[0], ctx));
        return veto(l, CLASSE_DO_GAP[cls], notas[0] || "", ctx, chavesH, alvo);
      }
      if (cls === "EVALUATION_IN_PROGRESS") return veto(l, "avaliacao", notas[0] || "", ctx, chavesH, alvo);
      if (cls === "TECH_STATUS_UNVERIFIED" || cls === "NEEDS_VALIDATION" || cls === "POSSIBLE_CONTEXT_DIVERGENCE")
        return veto(l, "validar", notas[0] || SEM_NOTA_VALIDAR, ctx, chavesH, alvo);
      return hipotese(l, "contexto-a-validar");                                 /* defensivo */
    }

    /* §2.4 — linha de SERVIÇO × capability (fora do legado e do gate fechado) */
    function veredictoDeServico(l, ctx, chavesH) {
      var sids = par.idsDaLinha(l.chave).filter(function (sid) {
        return !!SRV[sid] && (SRV[sid].capabilityRelations || []).some(function (r) { return r.capability === l.capId; });
      });
      var gapAlto = !!(ctx && ctx.maturity && ctx.maturity.state === "gap-high");
      var disparados = ((ctx && ctx.services) || []).filter(function (s) { return sids.indexOf(s.serviceId) >= 0; });
      if (disparados.length) return disparados.forEach(function (s) {
        var porGap = (s.triggeredBy || []).indexOf("capability-gap") >= 0, validar = /^elegível — validar/.test(s.note || "");
        motor(l, { via: porGap ? "servico-gap" : "servico-sinal", acao: "servico", serviceId: s.serviceId, itemId: null,
          tier: (porGap && gapAlto && !validar) ? 1 : 2, elegibilidade: { estado: validar ? "validar" : "elegivel", motivo: s.note || "" },
          entregavel: nomeDe(s.serviceId), sinais: porGap ? [] : (s.triggeredBy || []).slice(), notas: ctx.notes || [] });
      });
      var vetoR = null, hip = false, naoInformada = !ctx || ctx.classification === "CONTEXT_NOT_INFORMED";
      var base = landscape["endpoint-detection"];
      sids.forEach(function (sid) {
        var el = eleg[sid] || { eligible: true, reason: "" }, r = el.reason || "";
        /* D-6 / INV-2: base "ausente" sobre presença UNSET/UNKNOWN é não-informado, não ausência */
        if (!el.eligible && /^base requerida ausente/.test(r) && (base === "UNSET" || base === "UNKNOWN")) { hip = true; return; }
        /* sinal é entrada de sessão, não landscape declarado: abstenção, nunca veto da linha guarda-chuva */
        if (!el.eligible && /^sinal requerido ausente/.test(r)) { hip = true; return; }
        if (!el.eligible) { vetoR = vetoR || { classe: "elegibilidade", motivo: r, sid: sid }; return; }
        if (naoInformada) hip = true; else vetoR = vetoR || { classe: "motor-sem-candidato", motivo: SEM_CANDIDATO, sid: sid };
      });
      if (vetoR) return veto(l, vetoR.classe, vetoR.motivo, ctx, chavesH, vetoR.sid);
      if (hip || !sids.length) return hipotese(l, "capability-nao-informada");
    }

    /* 1 · achados da Camada 1 × linhas do MAP, na ordem de `computeFindings()` */
    (entrada.findings || []).forEach(function (f) {
      var m = MAPA[f.id];
      if (!m || !m.lv || !m.lv[f.lvl]) return;
      var capId = capDaPergunta(f.id), ctx = capId ? ctxs[capId] : undefined;
      var H = (m.lv[f.lvl].c || []).filter(function (c) { return c && c.p && P[c.p]; });
      var chavesH = H.map(function (c) { return c.p; });
      H.forEach(function (c) {
        var l = { chave: c.p, capId: capId, qid: f.id, cap: m.cap || "", sev: f.sev, lvl: f.lvl, sn: c.sn || null };
        if (entrada.legado) return hipotese(l, "sem-contexto");                                   /* 023 E1 */
        if (entrada.suficiente === false)                                                           /* INV-3 (023 E4) */
          return hipotese(l, temVoz(ctx) ? "contexto-a-validar" : ((!ctx || ctx.classification === "CONTEXT_NOT_INFORMED") ? "capability-nao-informada" : "contexto-a-validar"));
        if (par.tipoDaLinha(l.chave) === "servico") veredictoDeServico(l, ctx, chavesH);
        else veredictoDeProduto(l, ctx, chavesH);
      });
    });

    /* 2 · [022 · E2 — EA-75] o habilitado por SINAL também foi oferecido:
       conversa-por-sinal, tier 2 (sinal não é gap medido); chave `null` fica
       publicável e incurável, como hoje. Capabilities e sinais UNIDOS por chave
       (`D022-PROD1`; âncora `D022-M10` transportada verbatim). */
    if (!entrada.legado) {
      Object.keys(ctxs).forEach(function (capId) {
        ((ctxs[capId] || {}).candidates || []).forEach(function (cd) {
          if (!cd || cd.itemKind !== "offering" || !(cd.signals && cd.signals.length)) return;
          var pr = OFF[cd.itemId];
          if (pr && pr.name) {
            var reg2 = entradaDe(par.chaveDe(cd.itemId), cd.itemId);
            var capNome = (CAPS[capId] && CAPS[capId].name) ? CAPS[capId].name : "";
            if (capNome && reg2.caps.indexOf(capNome) < 0) reg2.caps.push(capNome);
            cd.signals.forEach(function (sg) { unico(reg2.sinais, sg); });
            reg2.motor.push({ via: "sinal", acao: "conversa-por-sinal", itemId: cd.itemId, capId: capId, qid: null, texto: null,
              sev: null, lvl: null, sn: null, tier: 2, escopo: cd.scopeNote || null, notas: (ctxs[capId].notes || []) });
          }
        });
      });
    }

    /* 3 · fusão por chave (§2.5): motor > veto > hipótese; E5 para o veto arquitetural */
    function registroDe(e, modo, fontes) {
      var reg = { chave: e.chave, nome: e.nome, titulo: e.nome, tipo: "produto", modo: modo, itemId: null, itemIds: [], variante: null,
        acao: "hipotese", tier: 2, origem: "gap", condicao: null, capabilities: [], caps: [], sinais: e.sinais.slice(), escopo: [],
        elegibilidade: null, entregaveis: [], fontes: [], notas: [], vetosDaLinha: [] };
      var vias = {}, resolucao = null;
      function addCap(capId, qid, texto) {
        if (texto && reg.caps.indexOf(texto) < 0) { reg.caps.push(texto); reg.capabilities.push({ capId: capId, qid: qid, texto: texto }); }
      }
      fontes.forEach(function (f) {
        if (f.tier < reg.tier) reg.tier = f.tier;
        addCap(f.capId, f.qid || null, f.texto);
        unico(reg.escopo, f.sn); unico(reg.escopo, f.escopo);
        (f.notas || []).forEach(function (n) { unico(reg.notas, n); });
        reg.fontes.push({ via: f.via || "gap", capId: f.capId, qid: f.qid || null, sev: f.sev == null ? null : f.sev,
          lvl: f.lvl == null ? null : f.lvl, itemId: f.itemId || null, serviceId: f.serviceId || null });
        if (f.acao) {
          vias[/sinal/.test(f.via) ? "sinal" : "gap"] = true;
          if (FORCA_ACAO.indexOf(f.acao) < FORCA_ACAO.indexOf(reg.acao)) reg.acao = f.acao;
          if (f.itemId) unico(reg.itemIds, f.itemId);
          if (f.resolucao && !resolucao) resolucao = f.resolucao;
          if (f.variantes) reg.variante = { nomes: f.variantes.map(nomeDe), modalidade: "a definir", resolucao: f.resolucao || null };
          unico(reg.entregaveis, f.entregavel);
          if (f.elegibilidade && !reg.elegibilidade) reg.elegibilidade = f.elegibilidade;
          (f.sinais || []).forEach(function (s) { unico(reg.sinais, s); });
        } else if (modo === "hipotese" && f.condicao &&
                   (reg.condicao === null || FORCA_CONDICAO.indexOf(f.condicao) < FORCA_CONDICAO.indexOf(reg.condicao))) reg.condicao = f.condicao;
      });
      e.caps.forEach(function (t) { addCap(capIdPorNome(t), null, t); });        /* capabilities do caminho por sinal */
      if (modo === "motor") reg.origem = (vias.gap && vias.sinal) ? "gap+sinal" : (vias.sinal ? "sinal" : "gap");
      reg.itemId = reg.itemIds[0] || null;
      var ofs = reg.itemIds.filter(function (id) { return OFF[id] && OFF[id].entityType !== "family"; });
      if (reg.acao === "avaliar-aquisicao") {
        if (ofs.length === 1 && OFF[ofs[0]].name !== reg.nome) reg.titulo = OFF[ofs[0]].name;       /* §2.3: C1 "FortiEDR", C6 */
        if (!reg.variante) reg.variante = { nomes: ofs.map(nomeDe), modalidade: null, resolucao: resolucao };
      }
      if (reg.itemIds.some(function (id) { return OFF[id] && OFF[id].entityType === "family"; })) reg.tipo = "familia";
      else if (e.chave !== null) reg.tipo = par.tipoDaLinha(e.chave);
      return reg;
    }
    var registros = [];
    ordem.forEach(function (key) {
      var e = acc[key], capsVetadas = e.vetos.map(function (v) { return v.capId; });
      if (e.motor.length) {
        var reg = registroDe(e, "motor", e.motor.concat(e.hipoteses.filter(function (h) { return capsVetadas.indexOf(h.capId) < 0; })));
        reg.vetosDaLinha = e.vetos.filter(function (v) { return v.classe !== "arquitetura"; });     /* E5 */
        registros.push(reg);
      } else if (!e.vetos.length && e.hipoteses.length) registros.push(registroDe(e, "hipotese", e.hipoteses));
      /* vetos.length > 0 sem fonte do motor: sem card — as hipóteses da chave caem (E4) */
    });
    var vetos = vetosEmitidos.filter(function (v) { return !(acc[v.chave].motor.length && v.classe === "arquitetura"); });
    return { registros: registros, vetos: vetos };
  }

  /* derivação viva: entrada do motor, ou hipótese do mapa quando ele falta — nunca silêncio */
  function derivar() {
    var e = entradaViva();
    if (e === null && typeof console !== "undefined" && console.error)
      console.error("[026] entrada do motor indisponível (computeFindings/MAP/PRODUCTS/V32): a oferta segue como hipótese do mapa");
    if (e === null) e = coletar(true);
    return e === null ? { registros: [], vetos: [] } : reconciliar(e);
  }

  /* O que o MOTOR ofereceu nesta sessão — leitor de `reconciliar()`: chaves dos
     registros curáveis (chave ≠ null), deduplicadas, na ordem de primeira aparição. */
  function ofertados() {
    var regs = derivar().registros, out = [];
    for (var i = 0; i < regs.length; i++) if (regs[i].chave !== null && out.indexOf(regs[i].chave) < 0) out.push(regs[i].chave);
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
    /* [026] a oferta nasce aqui — derivada por chamada, nunca serializada */
    oferta: function () { return derivar().registros; },
    vetos: function () { return derivar().vetos; },
    reconcile: reconciliar,
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
      var derivado = derivar();
      return {
        published: publicados(),
        offered: ofertados(),
        architectureNote: estado.architectureNote === undefined ? "include" : estado.architectureNote,
        operatorChoices: Object.keys(estado.decisions).filter(escolhaDoOperador),
        suppressed: ofertados().filter(function (id) { return decidir(id) === "exclude"; }),
        oferta: derivado.registros,
        vetos: derivado.vetos
      };
    }
  };
})();
