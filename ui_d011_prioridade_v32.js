/* ============================================================================
   DEMANDA 011 · NUMERAÇÃO DAS PRIORIDADES — decoração de atalhos da tela de
   prioridade. Módulo NOVO de demanda (não de fase 5.x): prefixo `d011` em
   arquivo, classe CSS (`.d011-*`), bridge (`__D011`) e namespace de gate.

   O QUE ESTE MÓDULO RESOLVE
   O glifo do botão de prioridade é a TECLA DE ATALHO, nunca a posição do item
   na lista. A Camada 1 desenha `·` a partir do décimo item (`:728`) — a
   ausência de atalho virou glifo, e glifo lê como índice faltando. Aqui a
   ausência de atalho deixa de ser desenhada (o `.key` fica textualmente vazio,
   mas PERMANECE no DOM pelo alinhamento) e passa a ser dita pela legenda.
   A ordem da lista é severidade calculada pelo produto; numerá-la ancoraria a
   escolha do negócio nela. A numeração legítima desta tela é `Prioridade 1..3`,
   por ordem de DECLARAÇÃO, e este módulo não a toca.

   O QUE ESTE MÓDULO NÃO FAZ — E NÃO PODE PASSAR A FAZER
     · não possui estado canônico algum (R9 §5). Ordem e identidade dos
       findings são de `computeFindings()`; a seleção é de `businessPriority` /
       `togglePriority()`; a tela é `step === PRIORITY_STEP`; o limite de 9
       atalhos é do handler de teclado da Camada 1 — todos `frozen`, só lidos;
     · não reordena, não cria botão, não move nó, não chama `render()`, não
       escreve em `ans`, `businessPriority` ou `step`;
     · não decide nada a partir de texto renderizado (R9 §3): LER O GLIFO PARA
       DECIDIR SOBRE O GLIFO funcionaria, e é exatamente o anti-pattern que a
       regra nomeia. A decisão deriva de `computeFindings()` + `businessPriority`
       + a constante 9; a IDENTIDADE do nó vem de `data-id`, nunca do rótulo;
     · não usa `innerHTML` (texto por `textContent`, atributo por
       `setAttribute` / `removeAttribute`);
     · não estiliza seletor alheio: cada nó decorado recebe classe do próprio
       módulo antes de existir regra que o alcance. A allowlist de exceções da
       R9 §6 fica VAZIA por desenho, e não por acaso.

   EXCEÇÃO DECLARADA À REGRA DE "NÃO LER O DOM"
   O módulo lê o valor atual do PRÓPRIO marcador (`data-d011`), o próprio texto
   e o próprio nó de legenda — apenas para NÃO reescrever o que já está certo
   (write-if-different). Isso é comparação, não decisão: o valor-alvo já foi
   calculado do canônico ANTES da leitura. E é obrigatório: sem ele o pintor
   entra em laço infinito de microtarefa, porque o observador vê a própria
   escrita (medido pelo QA na Fase 4).

   PP-011-1 · PATCH-POINT (registro no plan.md da demanda)
   `MutationObserver` estreito sobre `#app`, `{childList:true, subtree:true,
   attributes:false}`. NÃO é monkey-patch: nenhum binding global é lido e
   reatribuído, nenhuma função alheia é substituída, nenhum evento é capturado
   ou cancelado. O wrapper do binding global `render` foi RECUSADO pelo
   tech-lead: a R9 §4 o proíbe para módulo novo, e o precedente mais próximo
   (AMB-1) foi autorizado NOMINALMENTE pelo proprietário — repetir a rota sob
   delegação consumiria autorização que não foi dada.
   `attributes:false` é o que impede as escritas de atributo deste módulo de
   reentrarem; o write-if-different no `textContent` é o que fecha o laço de
   `childList`. Estado estável ⇒ zero mutação na segunda passada.

   BRIDGE `__D011` — SHAPE FECHADO: `{ __installed, diag() }`, e nada além.
   `decorar()` NÃO é exposto por desenho: um gate que chamasse a decoração à
   mão mediria o EFEITO com o observador MORTO, passando sem medir o
   mecanismo. Nenhum gate `D011-*` alcança a decoração senão por um `render()`
   real seguido de um tick de microtarefa.
   ========================================================================== */
(function () {
  "use strict";

  /* Guarda de instalação única (R9 §1): dupla injeção é inofensiva e
     observável — `diag().decoracoes` continuaria a contar de uma só fonte. */
  if (window.__D011 && window.__D011.__installed) return;

  /* ------------------------------------------------------------------ */
  /* Constantes declaradas — nenhuma delas duplicada fora deste bloco.   */
  /* ------------------------------------------------------------------ */

  /* Limite de atalhos do handler de teclado congelado (`:1056-1060`).
     Vive AQUI e em nenhum outro ponto do módulo (R9 §8). */
  var LIMITE_ATALHOS = 9;

  /* Texto canônico da legenda (C4), literal e sem normalização.
     CUIDADO AO EDITAR: `p52Copy()` percorre os nós de texto da tela e entra no
     laço de substituição quando o texto casa `/[Mm]andato|charter|—/`. Esta
     frase TEM travessão, portanto entra no laço — e sai intacta porque nenhuma
     entrada de `P52_COPY` é substring dela. Conferido em 2026-08-31. Mudar a
     frase exige refazer essa conferência. */
  var TEXTO_LEGENDA = "Os números são atalhos de teclado — não a ordem de prioridade.";

  var CLASSE_KEY = "d011-key";
  var CLASSE_LEGENDA = "d011-legenda";
  var ATRIB_MARCADOR = "data-d011";

  /* Ponto de montagem da legenda: usado como SELETOR EM JS, jamais como
     seletor de regra CSS — a regra pende de `.d011-legenda`. */
  var SEL_MONTAGEM = ".ux-priolayout";

  /* ------------------------------------------------------------------ */
  /* Diagnóstico do próprio módulo — não é estado de produto, não entra  */
  /* em sessão (INV-8 intocada).                                         */
  /* ------------------------------------------------------------------ */
  var diagnostico = {
    decoracoes: 0,
    reentranciasBloqueadas: 0,
    erros: 0,
    observadorInstalado: false,
    montagemAusente: 0
  };

  /* ------------------------------------------------------------------ */
  /* HELPER ÚNICO DE INVARIANTE (R9 §8) — a tabela de decisão do glifo.  */
  /* Três consumidores (texto, marcador de print, atributo de atalho),   */
  /* uma só função pura. Nenhuma comparação literal a 9 ou a "·" existe  */
  /* fora daqui.                                                         */
  /*                                                                     */
  /*   i < 9 , não selecionado → "N"  · "atalho" · aria-keyshortcuts "N" */
  /*   i < 9 , selecionado     → "✓"  · "estado" · aria-keyshortcuts "N" */
  /*   i ≥ 9 , não selecionado → ""   · "mudo"   · atributo AUSENTE      */
  /*   i ≥ 9 , selecionado     → "✓"  · "estado" · atributo AUSENTE      */
  /*                                                                     */
  /* O `✓` do selecionado é ESTADO, não índice, e permanece inalterado — */
  /* a spec selada já o entrega programaticamente por `aria-pressed`     */
  /* (UI-004). O atalho PERMANECE declarado sob `✓`: a tecla continua    */
  /* alternando o item (C3).                                             */
  /* ------------------------------------------------------------------ */
  function estadoDoGlifo(i, selecionado) {
    var temAtalho = i < LIMITE_ATALHOS;
    var digito = temAtalho ? String(i + 1) : null;
    if (selecionado) return { texto: "✓", marcador: "estado", atalho: digito };
    if (temAtalho) return { texto: digito, marcador: "atalho", atalho: digito };
    return { texto: "", marcador: "mudo", atalho: null };
  }

  /* ------------------------------------------------------------------ */
  /* Escrita idempotente — write-if-different em toda superfície.        */
  /* ------------------------------------------------------------------ */
  function porTexto(el, valor) {
    if (el.textContent !== valor) el.textContent = valor;
  }
  function porAtributo(el, nome, valor) {
    if (valor === null) {
      if (el.hasAttribute(nome)) el.removeAttribute(nome);
      return;
    }
    if (el.getAttribute(nome) !== valor) el.setAttribute(nome, valor);
  }
  function porClasse(el, classe) {
    if (!el.classList.contains(classe)) el.classList.add(classe);
  }

  /* ------------------------------------------------------------------ */
  /* Leitura do canônico — sempre por `typeof`, nunca supondo o binding. */
  /* Todos são declarações de topo do MESMO script (o builder inlina os  */
  /* módulos num único `<script>`), logo alcançáveis por escopo léxico.  */
  /* ------------------------------------------------------------------ */
  function naTelaDePrioridade() {
    return typeof step !== "undefined" &&
           typeof PRIORITY_STEP !== "undefined" &&
           step === PRIORITY_STEP;
  }
  function ordemCanonica() {
    if (typeof computeFindings !== "function") return null;
    var r = computeFindings();
    return (r && r.findings) ? r.findings : null;
  }
  function estaSelecionado(id) {
    return typeof businessPriority !== "undefined" &&
           !!businessPriority && businessPriority.has(id);
  }

  /* ------------------------------------------------------------------ */
  /* Legenda (C4) — existe se e somente se há ao menos um botão na grade.*/
  /* Reconstrução idempotente no padrão do decorador de resultados:      */
  /* localizar o próprio nó e só criar/remover quando o alvo diverge.    */
  /* PROIBIDA guarda global `__done` — é literalmente o mutante M4.      */
  /* ------------------------------------------------------------------ */
  function legendasExistentes(app) {
    return app.querySelectorAll("." + CLASSE_LEGENDA);
  }

  function sincronizarLegenda(app, precisa) {
    var atuais = legendasExistentes(app);

    if (!precisa) {
      for (var j = 0; j < atuais.length; j++) {
        if (atuais[j].parentNode) atuais[j].parentNode.removeChild(atuais[j]);
      }
      return;
    }

    var montagem = app.querySelector(SEL_MONTAGEM);
    if (!montagem) {
      /* Sem ponto de montagem o módulo NÃO inventa um: no-op, com o motivo
         no diagnóstico. Inventar container mexeria no layout de outro dono. */
      diagnostico.montagemAusente++;
      return;
    }

    /* Excedentes primeiro: "exatamente uma" é asserção de C4. */
    for (var k = atuais.length - 1; k >= 1; k--) {
      if (atuais[k].parentNode) atuais[k].parentNode.removeChild(atuais[k]);
    }

    var legenda = atuais.length ? atuais[0] : null;
    if (!legenda) {
      legenda = document.createElement("p");
      legenda.className = CLASSE_LEGENDA;
      legenda.textContent = TEXTO_LEGENDA;
      montagem.insertBefore(legenda, montagem.firstChild);
      return;
    }
    porTexto(legenda, TEXTO_LEGENDA);
    /* Só remonta se o lugar divergir — remontar sempre seria uma mutação de
       `childList` por passada, e o observador nunca chegaria ao repouso. */
    if (legenda.parentNode !== montagem || montagem.firstChild !== legenda) {
      montagem.insertBefore(legenda, montagem.firstChild);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Passada de decoração — função pura do canônico: mesma entrada,      */
  /* mesmo DOM. Duas passadas seguidas produzem ZERO mutação na segunda. */
  /* ------------------------------------------------------------------ */
  function decorar() {
    var app = document.getElementById("app");
    if (!app) return;

    /* Canal de decisão da tela é o global canônico, nunca o `dataset` que
       outro módulo escreve no `body` (esse é observável de gate, não de
       módulo). Fora da tela de prioridade, `render()` já reconstruiu `#app`
       do zero e nada deste módulo sobreviveu: no-op. */
    if (!naTelaDePrioridade()) return;

    var findings = ordemCanonica();
    if (!findings) return;

    for (var i = 0; i < findings.length; i++) {
      var id = findings[i].id;
      var botao = app.querySelector('.opt[data-id="' + id + '"]');
      if (!botao) continue;
      var key = botao.querySelector(".key");
      if (!key) continue;   /* o `.key` é do owner congelado; não se cria aqui */

      var alvo = estadoDoGlifo(i, estaSelecionado(id));

      porClasse(key, CLASSE_KEY);
      porTexto(key, alvo.texto);
      porAtributo(key, ATRIB_MARCADOR, alvo.marcador);
      /* C3 · o glifo sai do nome acessível: quem não vê a tela recebe o
         rótulo da pergunta, não o número da tecla. */
      porAtributo(key, "aria-hidden", "true");
      /* C3 · e o atalho passa a ser DECLARADO onde ele existe de fato. */
      porAtributo(botao, "aria-keyshortcuts", alvo.atalho);
    }

    sincronizarLegenda(app, findings.length > 0);
  }

  /* ------------------------------------------------------------------ */
  /* Observador (PP-011-1). `busy` é a guarda de reentrância síncrona;   */
  /* o `try/catch` por passada garante que uma falha deste módulo nunca  */
  /* derrube o render congelado.                                         */
  /* ------------------------------------------------------------------ */
  var busy = false;
  function passada() {
    if (busy) { diagnostico.reentranciasBloqueadas++; return; }
    busy = true;
    try {
      decorar();
      diagnostico.decoracoes++;
    } catch (e) {
      diagnostico.erros++;
      if (window.console && console.error) console.error("D011 prioridade:", e && e.message);
    } finally {
      busy = false;
    }
  }

  function instalarObservador() {
    if (typeof MutationObserver !== "function") return;
    var app = document.getElementById("app");
    if (!app) return;
    var obs = new MutationObserver(passada);
    obs.observe(app, { childList: true, subtree: true, attributes: false });
    diagnostico.observadorInstalado = true;
  }

  instalarObservador();

  /* Bridge registrado em `.claude/verify/bridges.json` (R9 §2). Shape
     fechado: guarda de instalação e diagnóstico. Sem setter, sem estado de
     produto, sem `decorar()`. */
  window.__D011 = {
    __installed: true,
    diag: function () {
      return {
        decoracoes: diagnostico.decoracoes,
        reentranciasBloqueadas: diagnostico.reentranciasBloqueadas,
        erros: diagnostico.erros,
        observadorInstalado: diagnostico.observadorInstalado,
        montagemAusente: diagnostico.montagemAusente
      };
    }
  };
})();
