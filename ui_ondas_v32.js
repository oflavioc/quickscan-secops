/* ============================================================================
   ONDAS DE INVESTIMENTO · demanda 022-escalonamento-do-investimento

   O motor (`engine_v32.js`) responde "o que serve aqui?" — por capability, uma
   a uma, quinze vezes isoladas. Este módulo responde a OUTRA pergunta, que o
   cliente faz uma vez só: "por onde eu começo?".

   As duas perguntas têm fontes de verdade diferentes. A primeira vem do
   catálogo; a segunda vem da capacidade de investimento da organização, que o
   motor não conhece e não deveria fingir conhecer. Por isso o escalonamento
   vive AQUI, acima do motor, no precedente declarado do `ui_target_v32.js`
   ("camada prospectiva; engine intocado") — e nenhum arquivo `frozen` é tocado.

   FUNÇÃO PURA (spec §Contratos): sem I/O, sem efeito, sem escrita de estado,
   sem leitura de DOM. É isso que torna o `D022-INV1` mensurável — uma função
   sem efeito não pode mover o estado canônico, e o gate PROVA em vez de supor.
   A única dependência externa é `__QS_STAGE_RULER`, que é bridge registrado e
   cujas funções são elas mesmas puras.

   O TETO NÃO É CALCULADO AQUI. Ele é o índice da banda de `__QS_STAGE_RULER`
   que contém o `overall` — a MESMA régua que o relatório desenha com o marcador
   "Você está aqui". Um `Math.round` próprio seria mais curto e seria a quarta
   cópia literal de um valor com dono nesta semana: o heap do `SESSION 4.8`, os
   dois pré-filtros do caminhador da copy e a âncora do `P52-RB6` custaram
   exatamente essa economia.
   ============================================================================ */
(function () {
  "use strict";
  if (typeof window === "undefined" || window.__QS22__installed) return;
  window.__QS22__installed = true;

  var MOTIVO_ALVO = "cenário-alvo declarado, e esta prática ficou de fora — a organização não a elegeu para subir";

  /* A régua, lida do bridge. Devolve `null` quando ela não existe, e quem chama
     trata a ausência NOMEANDO — nunca inventando um teto (R10 §2). */
  function regua() {
    var r = window.__QS_STAGE_RULER;
    return (r && typeof r.bands === "function" && typeof r.stageAt === "function") ? r : null;
  }

  /* Índice da banda que contém `v`. O piso 1 é da spec (D1): mesmo no estágio
     mais baixo a organização ataca UMA frente — teto zero não é escalonamento,
     é paralisia. */
  function tetoDe(overall) {
    var r = regua();
    if (!r) return null;
    var bands = r.bands(), i;
    for (i = 0; i < bands.length; i++) {
      if (overall >= bands[i].from && overall < bands[i].to) return Math.max(1, i);
    }
    return Math.max(1, bands.length - 1);          /* borda superior: overall == 5 */
  }

  function estagioDe(overall) {
    var r = regua();
    if (!r) return null;
    var s = r.stageAt(overall);
    return (s && s.pt) ? s.pt : null;
  }

  /* ==========================================================================
     `ondas(entrada) -> veredito`

     entrada = { findings, prioridades, alvos, overall, suff }
       findings    · [{ id, sev, lvl }] — do motor, nunca do DOM
       prioridades · [qid] declaradas pelo negócio
       alvos       · { qid: nível-alvo } — overrides declarados
       overall     · number | null      · suff · boolean

     veredito = { teto, estagio, primeira, seguintes, excluidas, tensao }
     ========================================================================== */
  function ondas(entrada) {
    var e = entrada || {};
    var findings = Array.isArray(e.findings) ? e.findings : [];
    var prioridades = Array.isArray(e.prioridades) ? e.prioridades : [];
    var alvos = (e.alvos && typeof e.alvos === "object") ? e.alvos : {};
    var suff = e.suff === true;
    var overall = (typeof e.overall === "number") ? e.overall : null;

    var nivelDe = {}, ordem = [];
    findings.forEach(function (f) {
      if (!f || !f.id) return;
      nivelDe[f.id] = f.lvl;
      ordem.push(f);
    });

    /* (1) EXCLUSÃO PELA AUSÊNCIA DECLARADA — errata E1 da spec, 2026-09-28.
       A redação original excluía a prática cujo alvo fosse IGUAL ao atual. Esse
       estado não existe depois de um render: `setTarget` o aceita e
       `revalidateTargets` o apaga (medido na W1; é a candidata registrada em
       design-decisions.md). O critério se apoiava em estado que o produto
       descarta por desenho.

       O sinal que PERSISTE é o inverso: cenário-alvo declarado e prática deixada
       DE FORA dele. A organização elegeu o que vai subir; o que não elegeu, não
       sobe — e isso é declaração dela, não omissão do produto, por isso o motivo
       é nomeado.

       Sem alvo algum, ninguém é excluído: ausência de cenário não é declaração
       de nada. */
    var excluidas = [];
    var fora = {};
    var haCenario = Object.keys(alvos).length > 0;
    if (haCenario) {
      ordem.forEach(function (f) {
        if (f.id in alvos) return;                    /* eleita para subir */
        fora[f.id] = true;
        excluidas.push({ qid: f.id, motivo: MOTIVO_ALVO });
      });
    }

    /* A exclusão governa só o que o MOTOR acrescenta. Prioridade declarada e
       ausência de alvo são duas declarações do mesmo cliente apontando para
       lados opostos: a prioridade vence (C2/D2), e por isso ela é retirada da
       exclusão em vez de a contradição virar narrativa. */
    prioridades.forEach(function (qid) {
      if (!fora[qid]) return;
      delete fora[qid];
      excluidas = excluidas.filter(function (x) { return x.qid !== qid; });
    });

    var elegiveis = ordem.filter(function (f) { return !fora[f.id]; });
    var ehGap = {};
    elegiveis.forEach(function (f) { ehGap[f.id] = true; });

    /* (2) AS PRIORIDADES DECLARADAS ABREM FRENTE, SEM TETO (C2).
       O cliente declarou o que quer atacar; o produto não tem autoridade para
       desfazer isso. Prioridade sem gap correspondente não vira frente — não há
       o que investir —, e isso não é "corte pelo teto". */
    var primeira = [];
    prioridades.forEach(function (qid) {
      if (ehGap[qid] && primeira.indexOf(qid) < 0) primeira.push(qid);
    });

    /* (3) SEM SUFICIÊNCIA NÃO HÁ ESCALONAMENTO (C4).
       `overall` é null, logo não existe estágio, logo não existe teto. O motor
       não acrescenta nada, e quem apresenta DIZ por quê. Teto derivado de número
       inexistente seria pior que teto nenhum. */
    if (!suff || overall === null) {
      return {
        teto: null, estagio: null,
        primeira: primeira,
        seguintes: elegiveis.map(function (f) { return f.id; })
          .filter(function (q) { return primeira.indexOf(q) < 0; }),
        excluidas: excluidas,
        tensao: null
      };
    }

    var teto = tetoDe(overall);
    var estagio = estagioDe(overall);
    if (teto === null) {
      /* régua ausente: NÃO se inventa teto. O veredito sai sem escalonamento e
         quem apresenta trata como o caso sem suficiência. */
      return {
        teto: null, estagio: null,
        primeira: primeira,
        seguintes: elegiveis.map(function (f) { return f.id; })
          .filter(function (q) { return primeira.indexOf(q) < 0; }),
        excluidas: excluidas,
        tensao: null
      };
    }

    /* (4) O MOTOR ACRESCENTA ATÉ O TETO — nunca abaixo de zero.
       `sev 2` antes de `sev 1` (B3/B4). A ordem dentro de cada severidade é a
       que o motor já produziu: reordenar aqui seria inventar critério. */
    var vagas = Math.max(0, teto - primeira.length);
    if (vagas > 0) {
      [2, 1].forEach(function (sev) {
        elegiveis.forEach(function (f) {
          if (vagas <= 0) return;
          if (f.sev !== sev) return;
          if (primeira.indexOf(f.id) >= 0) return;
          primeira.push(f.id);
          vagas--;
        });
      });
    }

    /* (5) O RESTO NÃO SOME (C5/D5) — vira onda seguinte declarada. */
    var seguintes = elegiveis.map(function (f) { return f.id; })
      .filter(function (q) { return primeira.indexOf(q) < 0; });

    /* (6) TENSÃO: prioridades declaradas acima do teto. Nomear, nunca podar
       (C3). O produto entrega a leitura que um consultor daria, e não a poda
       que fingiria que o cliente não pediu três. */
    var tensao = (prioridades.length > teto)
      ? { declaradas: prioridades.length, teto: teto }
      : null;

    return {
      teto: teto, estagio: estagio,
      primeira: primeira, seguintes: seguintes,
      excluidas: excluidas, tensao: tensao
    };
  }

  window.__QS22 = { ondas: ondas };
})();
