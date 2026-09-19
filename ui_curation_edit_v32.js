/* ============================================================================
   EDITOR DE CURADORIA — CAMADA 5.2 · demanda 019 (W5)
   Dono: ui-engineer. Bridge único: `__P53CUR` (R9 §2), shape fechado
   `{ __installed, diag() }` — sem `decorate()`, no precedente do `__D011`.

   ==========================================================================
   O QUE ESTE MÓDULO É, E O QUE ELE NÃO PODE SER
   ==========================================================================
   É a superfície onde o engenheiro decide o que de fato será apresentado como
   recomendação. O motor escolhe automaticamente; o engenheiro mantém, remove
   ou acrescenta, pelo critério e pela experiência dele.

   O que ele NÃO é: um campo de texto. A fronteira da demanda é SELEÇÃO, nunca
   REDAÇÃO — o operador escolhe entre o que existe no catálogo, e não escreve o
   que o motor deveria ter dito. Por isso toda escrita passa por
   `__CURATION.set()`, que recusa id fora do catálogo e valor fora do enum
   fechado, e por isso aqui não há `<input type="text">` nem `<textarea>`.

   ==========================================================================
   ESTE MÓDULO NÃO É DONO DE ESTADO (R9 §5)
   ==========================================================================
   Ele lê e escreve pelo bridge `__CURATION`, que é do `core-engineer`. Um
   editor que guardasse a seleção em variável própria teria duas verdades: a
   dele e a da sessão, e a divergência apareceria só na exportação.

   ==========================================================================
   POR QUE `v32-hidden` ESTÁ PROIBIDO AQUI
   ==========================================================================
   Medido na W4, e custou duas rodadas: o `D010-ARB3` varre os filhos diretos
   do escopo de apoio e reprova com "nó OCULTO fora da Camada 1 (transbordo da
   varredura)" qualquer elemento meu que carregue aquela classe. O painel
   fechado usa o atributo `hidden` e classe própria — nunca a classe da
   arbitragem, que pertence a outro módulo e significa outra coisa.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__P53CUR && window.__P53CUR.__installed) return;              /* R9 §1 */

  var erros = [], passes = 0, aberto = false;

  function el(tag, attrs, texto) {
    var n = document.createElement(tag), k;
    if (attrs) for (k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (texto != null) n.appendChild(document.createTextNode(String(texto)));
    return n;
  }
  function bridge() {
    return (window.__CURATION && window.__CURATION.__installed) ? window.__CURATION : null;
  }
  function portfolio() {
    return (window.__P53SOL && window.__P53SOL.__installed) ? window.__P53SOL : null;
  }

  /* ==================== o gate de suficiência ====================
     T017. Resultado BLOQUEADO ⇒ não há resultado publicado para curar: o
     controle não existe e o estado não é lido. "Não é lido" é a metade que
     costuma escapar — oferecer o controle desabilitado ainda seria oferecer, e
     ler o estado para desenhar um painel que ninguém pode usar já seria deixar
     a curadoria alcançar uma tela onde ela não tem o que curar.
     O `D019-SUF1` mede a AUSÊNCIA do controle. */
  function gateFechado() {
    var res = document.getElementById("p50-results");
    return !res || res.getAttribute("data-p50-gate") !== "released";
  }

  function nomeDe(id) {
    var p = (typeof PRODUCTS !== "undefined" && PRODUCTS) ? PRODUCTS[id] : null;
    return (p && p.n) || id;
  }

  /* ==================== o corpo do painel ==================== */
  function linhaProduto(b, id, ofertado) {
    var nome = nomeDe(id);
    var linha = el("label", { "class": "p53-cur-item", "data-p53-cur-item": nome });
    var cx = el("input", { type: "checkbox", "class": "p53-cur-check" });
    var incluido;
    try { incluido = b.decide(id) === "include"; } catch (e) { incluido = ofertado; }
    if (incluido) cx.setAttribute("checked", "checked");
    cx.checked = incluido;
    cx.addEventListener("change", function () {
      try { b.set(id, cx.checked ? "include" : "exclude"); }
      catch (e) { erros.push(String((e && e.message) || e)); cx.checked = !cx.checked; return; }
      redesenhar();
    });
    linha.appendChild(cx);
    var texto = el("span", { "class": "p53-cur-item-txt" });
    texto.appendChild(el("span", { "class": "p53-cur-item-nome" }, nome));
    var ps = portfolio();
    texto.appendChild(el("span", { "class": "p53-cur-item-grp" },
      ps ? rotuloGrupo(ps, nome) : ""));
    if (!ofertado)
      texto.appendChild(el("span", { "class": "p53-cur-item-add" }, "acréscimo do engenheiro"));
    linha.appendChild(texto);
    return linha;
  }
  function rotuloGrupo(ps, nome) {
    var gid = ps.grupoDe(nome), gs = ps.grupos(), i;
    for (i = 0; i < gs.length; i++) if (gs[i].id === gid) return gs[i].nome;
    return gid;
  }

  /* ==================== inclusão que a avaliação não oferece ====================
     T019 e o caso de borda 4/5 do refinamento. As duas saídas fáceis estão
     erradas: descartar apaga uma decisão humana sem avisar; ressuscitar em
     silêncio publica algo que ninguém reconfirmou. A inclusão é MANTIDA e
     SINALIZADA — quem decide é o engenheiro, com a informação na frente.

     A REDAÇÃO DIZ MENOS DO QUE A PRIMEIRA VERSÃO DIZIA, e de propósito. Eu
     havia escrito "não é MAIS sustentada pela avaliação", que afirma que a
     sessão mudou DEPOIS da escolha. O estado não sabe disso: ele guarda
     `id → include|exclude`, sem registro de quando a escolha foi feita nem do
     que estava ofertado então. `unsupported()` é, por construção, o mesmo
     conjunto de `escolhaDoOperador()` — acréscimo deliberado e inclusão que
     envelheceu são indistinguíveis aqui.

     Distingui-los exigiria proveniência temporal no estado, e isso o desenho
     recusa: só ids e enum fechado é o que sustenta a C1 e a INV-8. Então o
     aviso afirma o que É observável — a avaliação atual não oferece estes
     itens — e isso serve aos dois casos, que é o que o engenheiro precisa
     saber nos dois. */
  function avisoSemLastro(b, painel) {
    var sem;
    try { sem = b.unsupported() || []; } catch (e) { sem = []; }
    if (!sem.length) return;
    var box = el("div", { "class": "p53-cur-alerta", "data-p53-cur-sem-lastro": String(sem.length), role: "status" });
    box.appendChild(el("strong", null, sem.length === 1
      ? "1 item publicado não é oferecido pela avaliação atual."
      : sem.length + " itens publicados não são oferecidos pela avaliação atual."));
    box.appendChild(el("span", null, " A presença deles é decisão sua, e o relatório dirá isso: "
      + sem.map(nomeDe).join(", ") + ". Nada foi retirado nem acrescentado sem você."));
    painel.appendChild(box);
  }

  function montarPainel(b) {
    var painel = el("div", {
      "class": "p53-cur-panel",
      id: "p53-cur-panel",
      "data-p53-cur-panel": "1",
      role: "group",
      "aria-label": "Curadoria do relatório"
    });
    painel.appendChild(el("p", { "class": "p53-cur-lead" },
      "O motor ofereceu o que está marcado. Mantenha, remova ou acrescente — a escolha " +
      "muda o que é APRESENTADO, nunca a avaliação, o estágio ou os gaps observados."));
    avisoSemLastro(b, painel);

    var ofertados = [], catalogo = [];
    try { ofertados = b.offered() || []; } catch (e) { ofertados = []; }
    try { catalogo = b.catalog() || []; } catch (e) { catalogo = []; }

    var listaOf = el("div", { "class": "p53-cur-lista", "data-p53-cur-lista": "ofertados" });
    listaOf.appendChild(el("h4", { "class": "p53-cur-lista-t" }, "Oferecidos pela avaliação"));
    ofertados.forEach(function (id) { listaOf.appendChild(linhaProduto(b, id, true)); });
    painel.appendChild(listaOf);

    var extras = catalogo.filter(function (id) { return ofertados.indexOf(id) < 0; });
    if (extras.length) {
      var listaEx = el("div", { "class": "p53-cur-lista", "data-p53-cur-lista": "acrescimos" });
      listaEx.appendChild(el("h4", { "class": "p53-cur-lista-t" }, "Acrescentar por decisão sua"));
      listaEx.appendChild(el("p", { "class": "p53-cur-lista-nota" },
        "Não foram oferecidos por esta avaliação. Se incluir, o relatório dirá que a presença é escolha sua."));
      extras.forEach(function (id) { listaEx.appendChild(linhaProduto(b, id, false)); });
      painel.appendChild(listaEx);
    }
    return painel;
  }

  /* ==================== montagem e desmontagem ==================== */
  function limpar(sec) {
    var velhos = sec.querySelectorAll(":scope > [data-p53-abrir-curadoria], :scope > [data-p53-cur-panel]"), i;
    for (i = 0; i < velhos.length; i++) if (velhos[i].parentNode) velhos[i].parentNode.removeChild(velhos[i]);
  }

  function decorar() {
    var sec = document.getElementById("p52-sec-support");
    if (!sec) return;
    limpar(sec);
    /* T017: gate fechado ⇒ nem controle, nem leitura do estado. O `return` vem
       ANTES de qualquer chamada ao bridge, de propósito. */
    if (gateFechado()) { aberto = false; return; }
    var b = bridge();
    if (!b) return;

    /* O controle e o painel entram DEPOIS dos cards. O censo da Camada 1 conta
       os blocos contíguos ao título congelado e para no primeiro nó estranho —
       entrando aqui, ele já contou todos. Entrar antes repetiria o erro que o
       `D010-ARB1` cobrou na W4. */
    var btn = el("button", {
      type: "button",
      "class": "p53-cur-abrir",
      "data-p53-abrir-curadoria": "1",
      "aria-expanded": aberto ? "true" : "false",
      "aria-controls": "p53-cur-panel"
    }, aberto ? "Fechar curadoria" : "Curar o que será apresentado");
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      aberto = !aberto;
      redesenhar();
    });
    sec.appendChild(btn);
    if (aberto) sec.appendChild(montarPainel(b));
    passes++;
  }

  /* Redesenha pelo MESMO caminho que o editor de contexto tecnológico usa
     (`renderBlocks` + `__uxDecor`), para que a seleção atravesse todas as
     camadas de decoração na ordem normal. Chamar só a própria montagem deixaria
     a visão por solução desatualizada — ela é quem aplica a curadoria. */
  function redesenhar() {
    var app = document.getElementById("app");
    try {
      if (typeof renderBlocks === "function" && app) renderBlocks(app);
      if (window.__uxDecor && app) window.__uxDecor(app);
      else decorar();
    } catch (e) {
      erros.push(String((e && e.message) || e));
      if (window.console) console.error("P53 curadoria (redesenho):", e);
    }
  }

  function seguro() {
    try { decorar(); }
    catch (e) { erros.push(String((e && e.message) || e)); if (window.console) console.error("P53 curadoria:", e); }
  }

  if (window.__P50 && typeof window.__P50.registerDecor === "function") {
    window.__P50.registerDecor(seguro);
  }

  window.__P53CUR = {
    __installed: true,
    diag: function () { return { errors: erros.slice(0), passes: passes, aberto: aberto }; }
  };
})();
