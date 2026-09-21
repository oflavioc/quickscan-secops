/* ============================================================================
   APOIO POR SOLUÇÃO — CAMADA 5.2 · demanda 019 (W4)
   Dono: ui-engineer. Bridge único: `__P53SOL` (R9 §2), shape fechado
   `{ __installed, diag() }` — no precedente do `__D011`: nenhuma porta que
   permita a um gate chamar a decoração à mão e medir o efeito com o mecanismo
   morto.

   ==========================================================================
   O QUE ESTE MÓDULO FAZ, E POR QUE NÃO PODE SER "OCULTAR E RECONSTRUIR"
   ==========================================================================
   A seção de apoio deixa de agrupar por CAPABILITY e passa a agrupar por
   PRODUTO. Medido na sessão de referência: 15 blocos → 9 cards, com
   `Serviços FortiGuard` deixando de aparecer 5 vezes.

   O caminho óbvio — construir cards novos e ocultar os legados — derruba o
   `P52-REC1g`: `getBoundingClientRect()` de elemento oculto zera e o gate lê
   "cards de apoio em coluna única no desktop". Pior: o `D010-INV7` compara o
   censo VISÍVEL da Camada 1 contra o mesmo estado em modo legado, e ocultar
   bloco contíguo a título congelado é exatamente o que ele proíbe.

   Por isso o desenho é **movimento de nós**: o `.prod` completo de cada
   produto — o que tem ícone, descrição e link — MIGRA do bloco de capability
   para o card do produto. Nada é reescrito, nada é ocultado, e o que sobra
   das cascas é removido do DOM, não escondido.

   ==========================================================================
   ONDE OS BLOCOS ESTAVAM, E POR QUE ISSO IMPORTA
   ==========================================================================
   Medido antes de escrever uma linha: com prioridades declaradas, os 15
   blocos NÃO estão todos na seção de apoio.

     · 3  em `#p52-sec-support`  — apoio às prioridades declaradas
     · 12 dentro do `<details class="t-details">` da seção de gaps

   A consolidação recolhe os dois lugares (decisão do proprietário em
   2026-09-18). O `<details>` **permanece no DOM e visível**: ele é âncora
   nomeada do `D010-ARB3 (b)`, que o lista entre as que NUNCA podem ser
   ocultadas. Ele perde os blocos e ganha um ponteiro para onde o apoio foi
   consolidado — sumir com ele seria trocar um gate por uma conveniência.

   ==========================================================================
   AGRUPAMENTO: A DIVISÃO OFICIAL DO PORTFÓLIO
   ==========================================================================
   Decisão do proprietário (refinement P5): a separação segue
   https://www.fortinet.com/products. As três regras de borda da spec:

     1. produto fora de *Security Operations* usa a categoria de topo;
     2. **serviços** (MDR, SOCaaS, bundles) têm grupo próprio — eles não estão
        em *Products*, e sem isso sumiriam;
     3. produto sem categoria conhecida vai para grupo EXPLÍCITO e é LISTADO.

   A regra 3 não é decorativa: o catálogo é do motor e pode crescer sem que
   este mapa saiba. Descarte silencioso é o que o `D019-SOL2` proíbe.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__P53SOL && window.__P53SOL.__installed) return;              /* R9 §1 */

  var erros = [], passes = 0, ultimoCenso = null;

  /* ====================== o mapa do portfólio ======================
     Chaveado pelo ID DE CATÁLOGO, nunca pelo nome exibido: o nome é texto de
     apresentação e pode mudar sem aviso (`SOCaaS` já se chama
     `FortiGuard SOCaaS` na tela). O nome exibido é resolvido em tempo de
     execução a partir de `PRODUCTS`, que é a mesma fonte que o renderer
     congelado usa — assim o card e o bloco de origem não podem divergir. */
  var GRUPOS = [
    { id: "siem-analytics",    nome: "SIEM, analytics e retenção" },
    { id: "soar-automacao",    nome: "SOAR, automação e IA" },
    { id: "endpoint",          nome: "Segurança de endpoint" },
    { id: "rede-deception",    nome: "Detecção e resposta em rede" },
    { id: "exposicao",         nome: "Exposição e risco digital" },
    { id: "dados",             nome: "Proteção de dados" },
    { id: "servicos",          nome: "Serviços gerenciados e de resposta" },
    { id: "nao-classificado",  nome: "Sem categoria declarada no portfólio" }
  ];
  var PORTFOLIO = {
    "FortiSIEM": "siem-analytics",
    "FortiAnalyzer": "siem-analytics",
    "FortiSOAR": "soar-automacao",
    "FortiAI-Assist": "soar-automacao",
    "FortiEndpoint": "endpoint",
    "FortiXDR": "endpoint",
    "FortiNDR": "rede-deception",
    "FortiDeceptor": "rede-deception",
    "FortiRecon": "exposicao",
    "FortiDLP": "dados",
    "SOCaaS": "servicos",
    "FortiGuard-MDR-Service": "servicos",
    "FortiGuard-Service-Bundle": "servicos"
  };
  var NAO_CLASSIFICADO = "nao-classificado";

  /* ============================ utilidades ============================ */
  function el(tag, attrs, texto) {
    var n = document.createElement(tag), k;
    if (attrs) for (k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (texto != null) n.appendChild(document.createTextNode(String(texto)));
    return n;
  }
  function txt(n) { return n ? String(n.textContent || "").replace(/\s+/g, " ").trim() : ""; }
  function has(n, c) { return !!(n && n.classList && n.classList.contains(c)); }

  /* nome exibido → id de catálogo, derivado de PRODUCTS em tempo de execução.
     O DOM carrega o NOME (é o que `.pt-name` e `.prod-mini b` mostram, e é o
     que o `D019-SOL1` compara); o mapa do portfólio carrega o ID. Este é o
     único ponto de tradução, e ele falha para o lado seguro: nome que não
     existe no catálogo cai em `nao-classificado`. */
  function nomeDoGrupo(id) {
    for (var i = 0; i < GRUPOS.length; i++) if (GRUPOS[i].id === id) return GRUPOS[i].nome;
    return id;
  }
  function idDoNome(nome) {
    if (typeof PRODUCTS === "undefined" || !PRODUCTS) return null;
    for (var id in PRODUCTS) {
      if (!Object.prototype.hasOwnProperty.call(PRODUCTS, id)) continue;
      if (PRODUCTS[id] && PRODUCTS[id].n === nome) return id;
    }
    return null;
  }
  function grupoDoNome(nome) {
    var id = idDoNome(nome);
    return (id && PORTFOLIO[id]) || NAO_CLASSIFICADO;
  }

  /* =================== a curadoria, quando existe ===================
     R9 §3: o contrato vem da API do bridge, nunca de atributo que outro módulo
     escreveu no DOM. Sob guarda de `typeof`: este módulo continua funcionando
     inteiro se o owner do estado não estiver instalado — a visão por solução
     não depende da curadoria para existir, é a curadoria que age sobre ela. */
  function curadoria() {
    return (typeof window !== "undefined" && window.__CURATION && window.__CURATION.__installed)
      ? window.__CURATION : null;
  }
  function decisaoDe(nome) {
    var b = curadoria(); if (!b) return "include";
    var id = idDoNome(nome);
    if (!id) return "include";
    try { return b.decide(id); } catch (e) { return "include"; }
  }
  /* Verdadeiro só quando a PRESENÇA do item é decisão do operador — o motor não
     o ofereceu. É literalmente o que a C4 manda rotular, e a distinção importa:
     confirmar um item que o motor já ofereceu NÃO é decisão de presença, e
     rotular isso encheria o relatório de selos que não informam nada. */
  function ehEscolhaDoOperador(nome) {
    var b = curadoria(); if (!b) return false;
    var id = idDoNome(nome);
    if (!id) return false;
    try { return !!b.isOperatorChoice(id); } catch (e) { return false; }
  }
  var PROV_TXT = "Incluído por decisão do engenheiro — não derivado da avaliação.";

  /* ===================== coleta: de onde vêm os nós =====================
     Escopo é o WORKSPACE inteiro, não a seção de apoio: medido que 12 dos 15
     blocos vivem no `<details>` da seção de gaps. Restringir à seção deixaria
     6 produtos fora da visão por solução — e o `D019-SOL1` nomearia cada um
     deles como "produto SUMIU". */
  /* ====================================================================
     BLOCO OCULTO NÃO É MATÉRIA-PRIMA. Medido: sem esta guarda o `D010-ARB3`
     reprovou sob a fixture F2 — "arbitragem parcial: 1 ocultos de 7 nós da
     Camada 1 (esperado 0 ou 7)".

     A arbitragem da 010 é TUDO-OU-NADA: quando existe substituto V3.2, a
     leitura congelada inteira fica oculta. Consumir um bloco oculto para
     produzir um card visível RESSUSCITA o conteúdo que a arbitragem tinha
     decidido esconder — e a decisão de esconder não é minha, é de outro
     módulo, tomada por uma regra que este aqui não conhece.

     Regra: o que está oculto fica onde está, intocado. A visão por solução
     consolida o que está VISÍVEL, e só.
     ==================================================================== */
  function oculto(n) {
    for (var p = n; p && p.classList; p = p.parentElement)
      if (p.classList.contains("v32-hidden")) return true;
    return false;
  }

  /* ====================================================================
     ABSTENÇÃO QUANDO A ARBITRAGEM DA 010 ESTÁ EM CURSO.

     Medido em duas rodadas, e a segunda corrigiu a primeira. Pular só os
     blocos ocultos não bastou: o `D010-ARB3` continuou acusando "arbitragem
     parcial — 3 ocultos de 7". A arbitragem da demanda 010 é TUDO-OU-NADA
     sobre o escopo de apoio inteiro; mexer em parte dele, mesmo só na parte
     visível, produz exatamente o estado misto que ela proíbe.

     Então a regra é simétrica: se HÁ substituto V3.2 em cena — sinalizado
     por qualquer nó oculto no escopo — esta camada não consolida nada. Não é
     o caso dela decidir; quem decide é a arbitragem, e a decisão dela vale
     para a região toda.
     ==================================================================== */
  function escopoApoio() {
    var tela = document.querySelector("section.screen");
    if (!tela) return null;
    return tela.querySelector('[data-p52-legacy-scope="support"]') || tela;
  }
  function arbitragemEmCurso() {
    var esc = escopoApoio();
    if (!esc) return false;
    var filhos = esc.children, i;
    for (i = 0; i < filhos.length; i++)
      if (filhos[i].classList && filhos[i].classList.contains("v32-hidden")) return true;
    return false;
  }
  function blocosLegados(ws) {
    var todos = ws.querySelectorAll(".apoio-block"), out = [], i;
    for (i = 0; i < todos.length; i++)
      if (!todos[i].hasAttribute("data-p53-sol-produto") && !oculto(todos[i])) out.push(todos[i]);
    return out;
  }

  /* Um produto por chave, na ordem de PRIMEIRA aparição — que é a ordem em que
     o motor os produziu. Ordenar por outra coisa (alfabética, por exemplo)
     inventaria precedência que o motor não declarou. */
  function colher(blocos) {
    var ordem = [], porNome = {}, i, j;
    function reg(nome) {
      if (!nome) return null;
      if (!porNome[nome]) { porNome[nome] = { nome: nome, prod: null, caps: [], contextos: [] }; ordem.push(nome); }
      return porNome[nome];
    }
    for (i = 0; i < blocos.length; i++) {
      var bloco = blocos[i];
      var cap = txt(bloco.querySelector("h4"));
      var why = bloco.querySelector(".why");
      var prods = bloco.querySelectorAll(".prod");
      var minis = bloco.querySelectorAll(".prod-mini");
      for (j = 0; j < prods.length; j++) {
        var nomeP = txt(prods[j].querySelector(".pt-name"));
        var regP = reg(nomeP);
        if (!regP) continue;
        /* o `.prod` COMPLETO existe uma vez por produto em toda a leitura — é
           o dedup com precedência do renderer congelado. Guardamos o primeiro
           e movemos o nó; nunca copiamos, para não duplicar ícone e link. */
        if (!regP.prod) regP.prod = prods[j];
        if (cap && regP.caps.indexOf(cap) < 0) regP.caps.push(cap);
        if (why && regP.contextos.indexOf(txt(why)) < 0) regP.contextos.push(txt(why));
      }
      for (j = 0; j < minis.length; j++) {
        /* MENÇÃO CURTA. É por aqui que um produto desapareceria sem ninguém
           ver, porque é o que o olho não procura — o mutante `D019-M6` ataca
           exatamente este laço. */
        var nomeM = txt(minis[j].querySelector("b"));
        var regM = reg(nomeM);
        if (!regM) continue;
        if (cap && regM.caps.indexOf(cap) < 0) regM.caps.push(cap);
      }
    }
    return ordem.map(function (n) { return porNome[n]; });
  }

  /* ===================== construção do card por produto =====================
     O selo de grupo nasce em UM lugar só. Ele estava duplicado — card colhido
     e card acrescentado emitiam o mesmo atributo cada um por si — e a campanha
     cobrou na hora: o `D019-M7` saiu `ocorrencias=2`, NÃO EXECUTADO. Âncora
     ambígua é sintoma; a causa era código duplicado, e a correção é a óbvia. */
  function chipDoGrupo(grupo) {
    return el("div", { "class": "p53-sol-chip", "data-p53-sol-grupo-nome": grupo }, nomeDoGrupo(grupo));
  }
  function cardDoProduto(p) {
    var grupo = grupoDoNome(p.nome);
    var card = el("div", {
      "class": "apoio-block p53-sol-card",
      "data-p53-sol-produto": p.nome,
      "data-p53-sol-grupo": grupo
    });
    /* ====================================================================
       O GRUPO SE NOMEIA DENTRO DO CARD, e não numa faixa entre os cards.

       A primeira versão usava faixa irmã, atravessando a grade. Medido: o
       `D010-ARB1 (c)` reprovou com VACUIDADE — "nenhum `.apoio-block`
       contíguo aos títulos presentes". O censo da Camada 1 varre os filhos
       DIRETOS do escopo de apoio, marca o título congelado e conta os blocos
       CONTÍGUOS a ele; qualquer nó estranho no meio encerra a contagem. A
       faixa, sendo o primeiro filho depois do título, zerava o censo — e o
       gate falhou por não ter medido nada, que é exatamente o que ele promete
       fazer.

       O gate estava certo e o desenho estava errado: eu tinha partido uma
       região congelada para acomodar um rótulo meu. O selo entra DENTRO do
       card, os 9 blocos ficam contíguos ao título, e o agrupamento continua
       visível porque os cards são ordenados por grupo. Nada foi afrouxado no
       `D010` para isso caber.
       ==================================================================== */
    card.appendChild(chipDoGrupo(grupo));
    card.appendChild(el("h4", null, p.nome));
    /* C4 · PROVENIÊNCIA NA TELA. O mesmo marcador nasce no papel, em
       `printHTML()`. Foi o EA-58 que ensinou o modo real de as duas superfícies
       divergirem: o rótulo existe em uma e some na outra — e o mutante
       `D019-M4` ataca exatamente isso, removendo SÓ no papel. */
    if (ehEscolhaDoOperador(p.nome))
      card.appendChild(el("div", { "class": "p53-sol-prov", "data-p53-prov": "operador" }, PROV_TXT));
    card.appendChild(el("div", { "class": "why p53-sol-why" },
      p.caps.length === 1 ? "Atende 1 capability desta leitura."
                          : "Atende " + p.caps.length + " capabilities desta leitura."));
    var corpo = el("div", { "class": "prods" });
    /* O `.prod` é MOVIDO, não clonado: descrição, ícone e link oficial são os
       mesmos nós que o renderer congelado emitiu. Produto que só apareceu como
       menção curta não tem `.prod` — e mesmo assim entra, com o nome que a
       menção carregava. Descartá-lo aqui é o que o `D019-SOL1` reprova. */
    if (p.prod) corpo.appendChild(p.prod);
    card.appendChild(corpo);
    if (p.caps.length) {
      var lista = el("ul", { "class": "p53-sol-caps" });
      /* O atributo é CONTRATO com o gate; a classe é estilo. O `D019-SOL1`
         compara o par (produto × capability) contra o que o MOTOR produziu, e
         precisa de um seletor que não seja um detalhe de CSS meu. */
      for (var i = 0; i < p.caps.length; i++)
        lista.appendChild(el("li", { "class": "p53-sol-cap", "data-p53-sol-cap": p.caps[i] }, p.caps[i]));
      card.appendChild(lista);
    }
    return card;
  }

  /* ===================== o ponteiro que fica no lugar =====================
     O `<details class="t-details">` é âncora nomeada do `D010-ARB3 (b)`, entre
     as que NUNCA podem ser ocultadas. Ele perde os blocos e recebe uma linha
     dizendo para onde eles foram. Sem isso ele ficaria visível, vazio e
     mentindo — pior que a redundância que a demanda veio resolver. */
  function ponteiro(det) {
    if (!det || det.querySelector(".p53-sol-ptr")) return;
    var corpo = det.querySelector("div") || det;
    corpo.appendChild(el("p", { "class": "p53-sol-ptr" },
      "As formas de apoio desta leitura estão consolidadas por produto na seção “Formas de apoio”."));
  }

  /* ============== o produto que o engenheiro ACRESCENTOU ==============
     Ele não tem `.prod` para migrar: o motor nunca o renderizou, porque nunca
     o ofereceu. O card é montado a partir do CATÁLOGO (`PRODUCTS`) — nome,
     descrição e link oficial —, que é dado do produto, não texto inventado
     aqui. Nenhuma capability é listada, e isso é deliberado: associá-lo a uma
     capability seria afirmar uma relação que a avaliação não estabeleceu. O
     que o card diz é o que se sabe: o produto, e que a presença dele é escolha
     de quem conduziu a sessão. */
  function cardAcrescentado(id) {
    var p = (typeof PRODUCTS !== "undefined" && PRODUCTS) ? PRODUCTS[id] : null;
    if (!p) return null;
    var grupo = (PORTFOLIO[id] || NAO_CLASSIFICADO);
    var card = el("div", {
      "class": "apoio-block p53-sol-card p53-sol-card-add",
      "data-p53-sol-produto": p.n,
      "data-p53-sol-grupo": grupo
    });
    card.appendChild(chipDoGrupo(grupo));
    card.appendChild(el("h4", null, p.n));
    card.appendChild(el("div", { "class": "p53-sol-prov", "data-p53-prov": "operador" }, PROV_TXT));
    var corpo = el("div", { "class": "prods" });
    var linha = el("div", { "class": "prod" });
    var texto = el("span", null);
    texto.appendChild(el("div", { "class": "pt-name" }, p.n));
    if (p.d) texto.appendChild(el("div", { "class": "pt-desc" }, p.d));
    if (p.u) {
      var a = el("a", { "class": "pt-link", href: p.u, target: "_blank", rel: "noopener" }, "Página oficial ↗");
      texto.appendChild(a);
    }
    linha.appendChild(texto);
    corpo.appendChild(linha);
    card.appendChild(corpo);
    return card;
  }
  function acrescimos(jaPresentes) {
    var b = curadoria(); if (!b) return [];
    var ids;
    try { ids = b.state().decisions || {}; } catch (e) { return []; }
    var out = [];
    Object.keys(ids).forEach(function (id) {
      if (ids[id] !== "include" || !ehEscolhaDoOperadorId(b, id)) return;
      var p = (typeof PRODUCTS !== "undefined" && PRODUCTS) ? PRODUCTS[id] : null;
      if (!p || jaPresentes.indexOf(p.n) >= 0) return;
      var c = cardAcrescentado(id);
      if (c) out.push(c);
    });
    return out;
  }
  function ehEscolhaDoOperadorId(b, id) {
    try { return !!b.isOperatorChoice(id); } catch (e) { return false; }
  }

  /* ===================== a supressão que se declara =====================
     T018. Curadoria que exclui tudo NÃO some com a seção nem a deixa vazia e
     muda: ela DIZ que houve supressão, e quantos itens. As duas alternativas
     que este nó existe para impedir são simétricas e igualmente ruins — seção
     ausente faz o leitor achar que o motor nada encontrou; seção vazia faz
     parecer defeito. O `D019-VAZ1` mede a presença deste nó.

     Publicação PARCIAL também se declara. Não estava no gate, e é a mesma
     regra: quem lê um relatório curado precisa saber que houve curadoria, não
     só quando ela apagou tudo. */
  function declararSupressao(sec, publicados, suprimidos) {
    var velho = sec.querySelector(":scope > [data-p53-suprimido]");
    if (velho && velho.parentNode) velho.parentNode.removeChild(velho);
    if (!suprimidos) return;
    var aviso = el("div", {
      "class": "p53-sol-suprimido",
      "data-p53-suprimido": String(suprimidos),
      role: "status"
    });
    aviso.appendChild(el("strong", null,
      publicados ? "Seleção do engenheiro aplicada." : "Nenhuma forma de apoio foi publicada nesta leitura."));
    aviso.appendChild(el("span", null, publicados
      ? " " + suprimidos + (suprimidos === 1 ? " item foi retirado" : " itens foram retirados") +
        " da apresentação; " + publicados + (publicados === 1 ? " permanece." : " permanecem.")
      : " Os " + suprimidos + (suprimidos === 1 ? " item oferecido foi retirado" : " itens oferecidos foram retirados") +
        " da apresentação por decisão do engenheiro. A avaliação e os gaps observados não mudaram."));
    sec.appendChild(aviso);
  }

  /* ===================== colocação e agrupamento ===================== */
  function colocar(sec, cards) {
    var porGrupo = {}, i, g;
    for (i = 0; i < cards.length; i++) {
      g = cards[i].getAttribute("data-p53-sol-grupo");
      (porGrupo[g] = porGrupo[g] || []).push(cards[i]);
    }
    /* Os cards entram DIRETOS na seção, na ordem dos grupos — nunca dentro de
       um invólucro por grupo, e nunca separados por faixa.

       Invólucro derrubaria o `P52-REC1g`, que mede `:scope > .apoio-block`:
       com container, `cards.length` vira 0, TODA a cláusula de geometria fica
       guardada por `cards.length > 1`, e o gate passa sem medir nada. Cegar um
       gate de geometria para satisfazer um de agrupamento é a troca que o
       EA-62 já custou uma vez neste projeto.

       Faixa irmã derrubaria o `D010-ARB1 (c)` — medido, não suposto — porque
       ela quebra a contiguidade entre o título congelado e os blocos.

       Sobra a ordenação, que é o que o agrupamento precisa para existir na
       tela, com o selo de cada card dizendo a que grupo ele pertence. */
    for (i = 0; i < GRUPOS.length; i++) {
      var lista = porGrupo[GRUPOS[i].id];
      if (!lista || !lista.length) continue;
      for (var j = 0; j < lista.length; j++) sec.appendChild(lista[j]);
    }
  }

  /* ===================== a passagem ===================== */
  function decorar() {
    var ws = document.getElementById("p52-workspace");
    if (!ws) return;
    var sec = document.getElementById("p52-sec-support");
    if (!sec) return;
    if (arbitragemEmCurso()) return;

    var legados = blocosLegados(ws);
    if (legados.length) {
      var produtos = colher(legados);
      if (!produtos.length) return;
      var cards = [], i;
      /* ==================================================================
         A CURADORIA AGE AQUI, E SÓ AQUI — sobre o que vai à APRESENTAÇÃO.
         Os blocos legados já foram lidos: o conjunto ofertado pelo motor não
         muda por decisão do operador, e é isso que o `D019-MED1` mede. O que
         a decisão dele alcança é o que se PUBLICA.
         ================================================================== */
      for (i = 0; i < produtos.length; i++)
        if (decisaoDe(produtos[i].nome) !== "exclude") cards.push(cardDoProduto(produtos[i]));
      var suprimidos = produtos.length - cards.length;
      cards = cards.concat(acrescimos(cards.map(function (c) { return c.getAttribute("data-p53-sol-produto"); })));
      /* as cascas saem do DOM DEPOIS de os `.prod` terem migrado: remover
         antes levaria o nó movido junto. */
      for (i = 0; i < legados.length; i++)
        if (legados[i].parentNode) legados[i].parentNode.removeChild(legados[i]);
      colocar(sec, cards);
      declararSupressao(sec, cards.length, suprimidos);
      ultimoCenso = { produtos: produtos.length, publicados: cards.length,
        suprimidos: suprimidos, blocos: legados.length };
    } else {
      /* IDEMPOTÊNCIA. A camada 5.2 roda também sob MutationObserver, e esta
         função é chamada a cada passagem. Sem os legados não há o que
         consolidar — mas os cards podem ter sido reordenados pela passagem do
         workspace, então o agrupamento é refeito sobre o que já existe. */
      var existentes = sec.querySelectorAll(":scope > .apoio-block[data-p53-sol-produto]");
      if (!existentes.length) return;
      var atuais = [], removidos = 0;
      for (var k = 0; k < existentes.length; k++) {
        var no = existentes[k];
        if (decisaoDe(no.getAttribute("data-p53-sol-produto")) === "exclude") {
          if (no.parentNode) no.parentNode.removeChild(no);
          removidos++;
        } else atuais.push(no);
      }
      atuais = atuais.concat(acrescimos(atuais.map(function (c) { return c.getAttribute("data-p53-sol-produto"); })));
      colocar(sec, atuais);
      declararSupressao(sec, atuais.length, removidos);
    }

    /* O contador é lido pelo `P52-REC1g` e comparado com os cards MEDIDOS na
       tela. Ele é escrito pelo workspace na passagem anterior, quando os
       blocos ainda eram 15 capabilities; sem reescrevê-lo aqui o gate reprova
       por divergência de contagem — e reprovaria com razão. */
    sec.setAttribute("data-p52-support-cards",
      String(sec.querySelectorAll(":scope > .apoio-block").length));

    ponteiro(document.querySelector("#p52-workspace details.t-details"));
    passes++;
  }

  /* ======================================================================
     O PAPEL — T020 e T021.

     A seção do papel é derivada dos CARDS DA TELA, e não recalculada do zero.
     Recalcular criaria dois caminhos para a mesma decisão, e o `D019-PAR1`
     existe porque é exatamente assim que as duas superfícies divergem: cada
     uma com a sua conta, uma delas envelhecendo. Derivando, a igualdade
     tela×papel é propriedade de construção, não coincidência a verificar.

     Sai como STRING porque `buildPrintReport()` monta o relatório por
     concatenação — é o contrato dos três hooks de impressão que já existem
     (`__uxJourneyPrintHTML` e irmãos), e este entra no mesmo padrão em vez de
     inventar um quarto mecanismo (R9 §4).
     ====================================================================== */
  function escHtml(s) {
    return String(s == null ? "" : s)
      .split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;")
      .split('"').join("&quot;").split("'").join("&#39;");
  }
  function papelHTML() {
    var sec = document.getElementById("p52-sec-support");
    if (!sec) return "";
    var cards = sec.querySelectorAll(":scope > .apoio-block[data-p53-sol-produto]");
    var aviso = sec.querySelector(":scope > [data-p53-suprimido]");
    if (!cards.length && !aviso) return "";
    var h = '<div class="pr-sec" id="pr-sup-solucao"><h2>Formas de apoio, por produto</h2>';
    if (aviso) h += '<div class="pr-mut" data-p53-suprimido="' +
      escHtml(aviso.getAttribute("data-p53-suprimido")) + '">' + escHtml(txt(aviso)) + "</div>";
    var grupoAtual = null, i, j;
    for (i = 0; i < cards.length; i++) {
      var c = cards[i];
      var nome = c.getAttribute("data-p53-sol-produto");
      var gid = c.getAttribute("data-p53-sol-grupo");
      if (gid !== grupoAtual) {
        grupoAtual = gid;
        h += '<h3 data-p53-sol-grupo-nome="' + escHtml(gid) + '">' + escHtml(nomeDoGrupo(gid)) + "</h3>";
      }
      h += '<div class="pr-card" data-p53-sol-produto="' + escHtml(nome) + '" data-p53-sol-grupo="' + escHtml(gid) + '">';
      h += "<b>" + escHtml(nome) + "</b>";
      /* MESMO marcador da tela. O `D019-M4` remove só aqui, porque é aqui que
         a divergência costuma nascer sem ninguém ver (EA-58). */
      if (c.querySelector("[data-p53-prov]"))
        h += '<div class="pr-mut" data-p53-prov="operador">' + escHtml(PROV_TXT) + "</div>";
      var desc = c.querySelector(".pt-desc");
      if (desc) h += '<div class="pr-mut">' + escHtml(txt(desc)) + "</div>";
      var caps = c.querySelectorAll("[data-p53-sol-cap]");
      if (caps.length) {
        h += "<ul>";
        for (j = 0; j < caps.length; j++)
          h += '<li data-p53-sol-cap="' + escHtml(caps[j].getAttribute("data-p53-sol-cap")) + '">' +
               escHtml(caps[j].getAttribute("data-p53-sol-cap")) + "</li>";
        h += "</ul>";
      }
      h += "</div>";
    }
    return h + "</div>";
  }

  function seguro() {
    try { decorar(); }
    catch (e) { erros.push(String((e && e.message) || e)); if (window.console) console.error("P53 apoio por solução:", e); }
  }

  /* Registra DEPOIS do workspace 5.2: o builder injeta este arquivo em seguida,
     e `registerDecor` preserva a ordem de registro. Rodar antes significaria
     consolidar blocos que a passagem seguinte ainda vai mover. */
  if (window.__P50 && typeof window.__P50.registerDecor === "function") {
    window.__P50.registerDecor(seguro);
  }

  window.__P53SOL = {
    __installed: true,
    /* Leitura do PORTFÓLIO, consumida pelo editor de curadoria (R9 §3: contrato
       por API de bridge). Continua sem `decorate()`, no precedente do `__D011`:
       gate que chamasse a decoração à mão mediria o efeito com o mecanismo
       morto. O mapa vive aqui porque aqui está o dono da apresentação por
       solução; duplicá-lo no editor criaria duas verdades sobre a mesma
       classificação, e uma delas envelheceria. */
    grupos: function () { return GRUPOS.map(function (g) { return { id: g.id, nome: g.nome }; }); },
    grupoDe: function (nome) { return grupoDoNome(nome); },
    /* Hook de impressão. Os três hooks de PDF que já existem neste produto são
       globais soltos (`__uxJourneyPrintHTML` e irmãos), herança das camadas
       4.x; um QUARTO global seria um segundo bridge deste módulo, e a R9 §2
       proíbe. Entra aqui, no bridge único, e `buildPrintReport()` o consome sob
       a mesma guarda `typeof` dos outros. */
    printHTML: function () {
      try { return papelHTML(); }
      catch (e) { erros.push(String((e && e.message) || e)); return ""; }
    },
    diag: function () {
      return { errors: erros.slice(0), passes: passes, censo: ultimoCenso,
        grupos: GRUPOS.map(function (g) { return g.id; }) };
    }
  };
})();
