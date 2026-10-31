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
  /* ====================================================================
     [EA-68] A OFERTA VEM DO MOTOR, e não do que a tela conseguiu mostrar.

     O renderer congelado emite `.apoio-block` apenas para `sev 2`; achado de
     gap moderado vira entrada na lista "pode fazer sentido — após validação".
     Colher só `.apoio-block` fazia a consolidação nascer quase vazia na sessão
     COMUM — medido no relato do proprietário: 2 produtos na visão por solução
     contra 9 na lista, e nenhum dos nove na visão. Dois de onze.

     E havia incoerência dentro do próprio trabalho: `__CURATION.offered()` já
     devolvia os onze. O editor oferecia para curar produtos que a vista nunca
     mostrava — excluir nove deles não fazia efeito visível nenhum.

     A fonte passa a ser a mesma do `offered()` e a mesma que o `D019-SOL1` usa
     como oráculo: `computeFindings()` + `MAP`. O TIER sai da mesma regra do
     `buildTiers` congelado — `sev 2` ⇒ prioritária, senão após validação, e o
     menor vence quando o produto aparece nos dois.

     A lista "pode fazer sentido" fica INTACTA. Removê-la cegaria o
     `P52-ICON3`, que afirma que os ícones ali são materialmente pintados e só
     roda no Chromium do CI; e o pedido do proprietário era que os produtos
     aparecessem TAMBÉM na visão por solução, não que a lista sumisse. A
     redundância que sobra é decisão dele, com o custo daquele gate na mesa.
     ==================================================================== */
  var TIER = { 1: "prioritaria", 2: "validacao" };
  function aplicarCopy(s) {
    try {
      return (window.__P52 && typeof window.__P52.applyCopy === "function")
        ? window.__P52.applyCopy(s) : s;
    } catch (e) { return s; }
  }
  /* ====================================================================
     [026] A OFERTA NASCE UMA VEZ, e não é aqui.

     Até a 025 este módulo era a SEGUNDA fonte da oferta (EA-76): derivava
     de `computeFindings()+MAP`, somava o habilitado por sinal lido direto de
     `buildRecommendationContext()` e fundia os dois POR NOME EXIBIDO — raiz
     de C6 (variante do motor virando card próprio) e do colapso que o laço
     por sinal tentava remendar. Medido nos cenários do anexo: C2 e C4
     publicavam card onde o motor dizia "nunca substituição"; C7 publicava
     "FortiGuard MDR · indicação prioritária" com `serviceEligibility`
     inelegível.

     Agora a reconciliação MAP × motor é UMA função pura no dono do estado
     (`__CURATION.reconcile`, exposta por `oferta()`/`vetos()`), e este
     módulo só LÊ: nome, título, tier, ação, origem, condição, variante,
     elegibilidade, capabilities, sinais e escopo chegam prontos (R9 §5 —
     renderização consome, nunca decide). O que esta função faz é traduzir o
     registro para a forma que `cardDoProduto` sempre consumiu: `prod: null`
     para `prodLegadoDe` preencher, `caps` já com `__P52.applyCopy` (o
     registro guarda o texto CANÔNICO; a apresentação aplica a mesma
     transformação que o resto da tela — contrato do `D019-SOL1`), e os
     sinais traduzidos por `sigPT`, como antes (`D022-PROD1`).

     Sem o bridge instalado devolve lista vazia e a seção fica como ficava:
     nenhuma hipótese é inventada aqui. Falha de leitura NUNCA é silêncio
     (R10 §2): o console nomeia o que se perdeu.
     ==================================================================== */
  /* Rótulos de apresentação para os enums do registro (spec §Contratos,
     "regra de ouro": só rótulos nascem aqui; o valor é sempre dado que já
     existe). Conferidos contra `P52_COPY` e contra `grep` em `tests_*.js`
     antes de nascer. O atributo carrega o enum; o texto carrega a palavra. */
  var ACAO_TXT = {
    "avaliar-aquisicao":    "Ação sugerida: avaliar a aquisição no aprofundamento.",
    "modalidade-a-definir": "Ação sugerida: definir a modalidade de entrega no aprofundamento.",
    "servico":              "Ação sugerida: avaliar a contratação do serviço gerenciado.",
    "apoio-contextual":     "Ação sugerida: apoio sobre a base já instalada, sem nova aquisição.",
    "conversa-por-sinal":   "Ação sugerida: conversa a partir do sinal declarado, sem gap medido.",
    "hipotese":             "Ação sugerida: validar a hipótese do mapa no aprofundamento."
  };
  var CONDICAO_TXT = {
    "sem-contexto":                "Hipótese do mapa: contexto tecnológico não informado nesta sessão.",
    "capability-nao-informada":    "Hipótese do mapa: esta capability não foi informada no contexto tecnológico.",
    "contexto-a-validar":          "Hipótese do mapa: respostas insuficientes para a leitura contextual; validar no aprofundamento.",
    "fora-do-catalogo-contextual": "Hipótese do mapa: capability fora do catálogo contextual do motor.",
    "plataforma-declarada-cobre":  "Hipótese do mapa: a plataforma declarada cobre esta capability; validar no aprofundamento."
  };
  var VETO_TXT = {
    titulo:     "Não indicado nesta leitura",
    lead:       "Linhas do mapa que o contexto declarado afasta desta leitura. A razão é a do motor, literal.",
    tecnologia: "Tecnologia declarada: ",
    extensao:   "Extensão contextual sobre a base declarada: ",
    servico:    "Serviço elegível nesta capability: ",
    caps:       "Capabilities afetadas: ",
    elegivel:   "Elegível: ",
    validar:    "A validar no aprofundamento: "
  };
  function sinalPT(sg) { return (typeof sigPT === "function") ? sigPT(sg) : sg; }
  function listaUnica(src, f) {
    var out = [], i, t;
    for (i = 0; i < (src || []).length; i++) { t = f(src[i]); if (t && out.indexOf(t) < 0) out.push(t); }
    return out;
  }
  function ofertaDoMotor() {
    var out = [], b = curadoria();
    if (!b || typeof b.oferta !== "function") return out;
    var regs;
    try { regs = b.oferta() || []; }
    catch (e) {
      if (typeof console !== "undefined" && console.error)
        console.error("[026] oferta da curadoria não lida:", e && e.message);
      return out;
    }
    for (var i = 0; i < regs.length; i++) {
      var r = regs[i];
      if (!r || !r.nome) continue;
      var caps = r.capabilities && r.capabilities.length
        ? listaUnica(r.capabilities, function (c) { return (c && c.texto) ? aplicarCopy(c.texto) : ""; })
        : listaUnica(r.caps, function (t) { return t ? aplicarCopy(t) : ""; });
      out.push({
        id: r.chave || r.itemId || null,
        chave: r.chave || null,
        nome: r.nome,
        titulo: r.titulo || r.nome,
        tier: r.tier === 1 ? 1 : 2,
        prod: null,
        caps: caps,
        sinais: listaUnica(r.sinais, sinalPT),
        itemId: r.itemId || null,
        itemIds: (r.itemIds || []).slice(),
        variante: r.variante || null,
        acao: r.acao || "hipotese",
        origem: r.origem || "gap",
        condicao: (r.condicao == null) ? null : String(r.condicao),
        elegibilidade: r.elegibilidade || null,
        escopo: listaUnica(r.escopo, function (t) { return t ? String(t) : ""; })
      });
    }
    return out;
  }
  /* Os vetos, pela mesma porta. Um por linha × capability; a apresentação
     agrupa por linha. Sem bridge, sem veto — e sem card, pela função acima. */
  function vetosDoMotor() {
    var b = curadoria();
    if (!b || typeof b.vetos !== "function") return [];
    try { return (b.vetos() || []).filter(function (v) { return v && v.nome; }); }
    catch (e) {
      if (typeof console !== "undefined" && console.error)
        console.error("[026] vetos da curadoria não lidos:", e && e.message);
      return [];
    }
  }

  /* Encontra, no que o renderer congelado emitiu, o `.prod` completo daquele
     produto — ícone, descrição e link. Só existe para os de `sev 2`; os demais
     nunca tiveram bloco, e o card deles é montado do catálogo. */
  function prodLegadoDe(ws, nome) {
    var prods = ws.querySelectorAll(".apoio-block .prod"), i;
    for (i = 0; i < prods.length; i++) {
      /* [EA-65] Nó OCULTO nunca é movido. A arbitragem da 010 escondeu aquela
         região porque existe substituto V3.2; arrancar um `.prod` de dentro
         dela o traria de volta à tela por uma porta lateral, que é o oposto do
         que a arbitragem decidiu. O produto continua no card — montado do
         catálogo, como o de `sev 1` que nunca teve bloco. */
      if (oculto(prods[i])) continue;
      if (txt(prods[i].querySelector(".pt-name")) === nome) return prods[i];
    }
    return null;
  }


  /* ===================== construção do card por produto =====================
     O selo de grupo nasce em UM lugar só. Ele estava duplicado — card colhido
     e card acrescentado emitiam o mesmo atributo cada um por si — e a campanha
     cobrou na hora: o `D019-M7` saiu `ocorrencias=2`, NÃO EXECUTADO. Âncora
     ambígua é sintoma; a causa era código duplicado, e a correção é a óbvia. */
  function chipDoGrupo(grupo, tier) {
    var linha = el("div", { "class": "p53-sol-chiprow" });
    linha.appendChild(el("span", { "class": "p53-sol-chip", "data-p53-sol-grupo-nome": grupo },
      nomeDoGrupo(grupo)));
    /* [EA-68] O qualificador VISÍVEL. O atributo serve ao gate; o leitor
       precisa da palavra. "Após validação" é o que o próprio screening diz de
       si mesmo naquela lista: não tem profundidade para priorizar. Esconder
       essa diferença deixaria o relatório afirmando mais do que mediu. */
    if (tier) linha.appendChild(el("span", { "class": "p53-sol-tierlabel" },
      tier === 1 ? "indicação prioritária" : "após validação"));
    return linha;
  }
  function cardDoProduto(p) {
    var grupo = grupoDoNome(p.nome);
    var card = el("div", {
      "class": "apoio-block p53-sol-card",
      "data-p53-sol-produto": p.nome,
      "data-p53-sol-grupo": grupo,
      /* [EA-68] O QUALIFICADOR. Sem ele os dois tiers viram um só e o leitor
         perde a distinção que o motor fez: indicação prioritária vem de gap
         ALTO; "após validação" vem de gap moderado, e o screening não tem
         profundidade para priorizá-la. Apagar essa diferença seria a curadoria
         alcançando a DECLARAÇÃO, que é o que a C5 proíbe. */
      "data-p53-sol-tier": TIER[p.tier] || TIER[2],
      /* [022 · E2] os sinais que habilitaram o produto, UNIDOS. Sem eles o card
         diria "apos validacao" sem dizer validar o que — e o `D022-PROD1` exige
         que o habilitado por sinal seja distinguivel do puxado por gap. */
      "data-qs22-sinais": (p.sinais && p.sinais.length) ? p.sinais.join(", ") : ""
    });
    /* [026] A IDENTIDADE E A DECISÃO VIAJAM NO CARD, em vocabulário fechado.
       `data-p53-sol-produto` continua a LINHA (é o que a curadoria decide e o
       que os gates da 019/023/025 comparam); a chave, o item resolvido pelo
       motor, as variantes fundidas, a ação, a origem e a condição são
       atributos novos — enum do registro, nunca prosa (lição "campo de
       vocabulário fechado"). A condição só existe quando NÃO é nula: atributo
       presente com valor vazio diria "há condição" sem dizer qual. */
    card.setAttribute("data-p53-sol-chave", p.chave || "");
    if (p.itemId) card.setAttribute("data-p53-sol-item-id", p.itemId);
    if (p.itemIds && p.itemIds.length > 1) card.setAttribute("data-p53-sol-variantes", p.itemIds.join(", "));
    card.setAttribute("data-p53-sol-acao", p.acao || "hipotese");
    card.setAttribute("data-p53-sol-origem", p.origem || "gap");
    if (p.condicao !== null && p.condicao !== undefined) card.setAttribute("data-p53-sol-condicao", p.condicao);
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
    card.appendChild(chipDoGrupo(grupo, p.tier));
    /* [026] O TÍTULO É O ITEM RESOLVIDO (D-7): "FortiEDR" sob a linha
       FortiEndpoint em C1, "FortiNDR (On-Premises)" sob FortiNDR em C6. A linha
       continua no atributo e na frase de variante abaixo — numa frase, nunca
       numa folha com o texto igual ao nome, porque o `D019-CARD1 (a)` conta
       folhas cujo texto É o nome e exige uma só. */
    card.appendChild(el("h4", null, p.titulo || p.nome));
    var variante = fraseDeVariante(p);
    if (variante) card.appendChild(el("div", { "class": "p53-sol-variante" }, variante));
    if (p.acao) card.appendChild(el("div", { "class": "p53-sol-acao" }, ACAO_TXT[p.acao] || p.acao));
    if (p.condicao !== null && p.condicao !== undefined)
      card.appendChild(el("div", { "class": "p53-sol-condicao" }, CONDICAO_TXT[p.condicao] || p.condicao));
    if (p.elegibilidade && p.elegibilidade.motivo)
      card.appendChild(el("div", { "class": "p53-sol-elig", "data-p53-sol-elig": p.elegibilidade.estado || "" },
        (p.elegibilidade.estado === "validar" ? VETO_TXT.validar : VETO_TXT.elegivel) + p.elegibilidade.motivo));
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
    if (p.prod) {
      /* ==================================================================
         O NOME SAÍA DUAS VEZES, e foi o proprietário quem viu.

         Na visão por GAP o `.pt-name` era o título do produto dentro do
         bloco da capability. Aqui o título do card JÁ é o produto, no `h4`
         acima — então o `.pt-name` repete a mesma palavra duas linhas
         abaixo. Consolidar mudou o papel daquele nó, e eu movi o nó sem
         reavaliar o papel dele.

         Removido, não escondido: nó invisível continua no DOM, entra em
         contagem e reaparece no dia em que alguém mudar uma regra de CSS.
         Conferido antes: nenhum gate lê `.pt-name` — a única menção em
         `tests_*.js` é um comentário meu contando esta história.
         ================================================================== */
      var nomeDuplicado = p.prod.querySelector(".pt-name");
      if (nomeDuplicado && txt(nomeDuplicado) === p.nome && nomeDuplicado.parentNode)
        nomeDuplicado.parentNode.removeChild(nomeDuplicado);
      corpo.appendChild(p.prod);
      /* [026] O escopo que o registro conhece e o `.prod` movido não traz —
         medido em C5: o FortiRecon nasce no bloco de exposição externa e a
         nota de escopo da gestão de vulnerabilidades ficava na menção curta
         que o renderer congelado emite e esta consolidação descarta. */
      complementarEscopo(p.prod, p.escopo);
    } else {
      /* [EA-68] Produto de `sev 2` tem `.prod` para mover; o de `sev 1` nunca
         teve bloco nenhum — a indicação dele vive na lista "pode fazer
         sentido". O card é montado do CATÁLOGO, com a mesma marcação e o mesmo
         `productIcon` do renderer congelado, porque o que distingue os dois
         tiers é o QUALIFICADOR, nunca o acabamento (é a lição do EA-67). */
      corpo.appendChild(corpoDoCatalogo(p.id, p.nome, p.escopo));
    }
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
  /* ====================================================================
     [EA-67] O DISCLOSURE VAZIO SAI DE CENA — e sair é mais honesto que ficar.

     Na W4 eu deixei o `<details>` "Possíveis formas de apoio aos demais gaps
     altos" no lugar, com um ponteiro dizendo que o conteúdo foi consolidado.
     O proprietário leu na tela e foi direto ao ponto: *"essa informação ali
     polui a tela e é desnecessária"*. Ele tem razão — o quadro anuncia um
     conteúdo que não está mais ali e custa uma leitura para dizer "olhe em
     outro lugar".

     POR QUE REMOVER, E NÃO OCULTAR. Esse `<details>` é âncora nomeada do
     `D010-ARB3 (b)`, entre as que "nunca podem ser ocultadas" — e eu poderia
     escondê-lo com classe própria, que o censo daquele gate não enxerga. Seria
     contornar pela letra: a regra existe para impedir que conteúdo da Camada 1
     desapareça sem substituto, e o teste dela é o DOM.

     Aqui há substituto, e ele é integral: os blocos MIGRARAM para a seção de
     apoio, consolidados por produto. O que sobra é uma casca cujo rótulo
     promete o que ela não tem. Casca vazia removida é subtração honesta;
     casca vazia escondida é a mesma subtração fingindo não ter acontecido.

     A remoção é CONDICIONAL e medida: só quando não sobrou `.apoio-block` nem
     `.t-item` dentro. Disclosure com conteúdo próprio nunca é tocado.
     ==================================================================== */
  function ponteiro(det) {
    if (!det) return;
    if (det.querySelector(".apoio-block") || det.querySelector(".t-item")) return;
    if (det.parentNode) det.parentNode.removeChild(det);
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
      "data-p53-sol-grupo": grupo,
      /* [026] D-8: o acréscimo declara a origem e a ação no mesmo vocabulário
         dos cards do motor — sem tier e sem condição, porque a presença dele
         não é leitura da avaliação e o estado da curadoria não guarda condição. */
      "data-p53-sol-origem": "operador",
      "data-p53-sol-acao": "hipotese"
    });
    card.appendChild(chipDoGrupo(grupo));
    card.appendChild(el("h4", null, p.n));
    card.appendChild(el("div", { "class": "p53-sol-prov", "data-p53-prov": "operador" }, PROV_TXT));
    var corpo = el("div", { "class": "prods" });
    /* ====================================================================
       O ÍCONE FALTAVA, e a ausência tinha explicação — não desculpa.

       O card colhido traz o `.prod` do renderer congelado, que já vem com o
       `.icon-tile`. O acrescentado eu montava do catálogo e simplesmente não
       montei o ícone: na tela do proprietário, só `Serviços FortiGuard`
       aparecia ilustrado, porque era o único card colhido entre os quatro.

       A fonte é a MESMA do renderer congelado — `productIcon(id)`, com a
       mesma estrutura `.icon-tile > img`. Copiar a marcação garante que o
       acrescentado e o colhido sejam indistinguíveis ao olho, que é o ponto:
       o que distingue os dois é o selo de proveniência, nunca o acabamento.
       ==================================================================== */
    corpo.appendChild(corpoDoCatalogo(id, p.n));
    card.appendChild(corpo);
    return card;
  }

  /* Um `.prod` montado do catálogo, com a MESMA marcação do renderer
     congelado. Usado pelo card acrescentado pelo operador e pelo card de
     `sev 1`, que nunca teve bloco para mover. Um só lugar constrói isso: o
     `D019-M14` já provou que duplicar a construção do ícone é como ele some
     de um dos caminhos sem ninguém ver. */
  function corpoDoCatalogo(id, nome, escopo) {
    var p = (typeof PRODUCTS !== "undefined" && PRODUCTS) ? PRODUCTS[id] : null;
    /* [026] Linha sem par na Camada 1 (`chave: null`, status quo incurável):
       descrição não existe no catálogo do motor; o link oficial existe. */
    var of = (!p && typeof V32 !== "undefined" && V32 && V32.OFFERINGS) ? V32.OFFERINGS[id] : null;
    var linha = el("div", { "class": "prod" });
    if (typeof productIcon === "function") {
      var tile = el("span", { "class": "icon-tile" });
      tile.appendChild(el("img", { src: productIcon(id), alt: nome }));
      linha.appendChild(tile);
    }
    var texto = el("span", null);
    if (p && p.d) texto.appendChild(el("div", { "class": "pt-desc" }, p.d));
    /* [026] O escopo entra com a MESMA marcação do renderer congelado
       (`div.scope`, "Escopo: …", v3_1_3 :874) — é a nota que hoje só chega
       ao leitor quando o produto teve bloco próprio de `sev 2`. */
    (escopo || []).forEach(function (t) { texto.appendChild(noDeEscopo(t)); });
    var url = (p && p.u) || (of && of.url) || null;
    if (url) {
      var a = el("a", { "class": "pt-link", href: url, target: "_blank", rel: "noopener" }, "Página oficial ↗");
      texto.appendChild(a);
    }
    linha.appendChild(texto);
    return linha;
  }
  function noDeEscopo(t) { return el("div", { "class": "scope p53-sol-escopo" }, "Escopo: " + t + "."); }
  /* No `.prod` MOVIDO, acrescenta só o escopo que ele ainda não diz. */
  function complementarEscopo(prod, escopo) {
    if (!prod || !escopo || !escopo.length) return;
    var existentes = prod.querySelectorAll(".scope"), ja = [], i;
    for (i = 0; i < existentes.length; i++) ja.push(txt(existentes[i]));
    var link = prod.querySelector(".pt-link");
    var alvo = link ? link.parentNode : (prod.querySelector(".pt-desc") ? prod.querySelector(".pt-desc").parentNode : prod);
    escopo.forEach(function (t) {
      var dito = ja.some(function (s) { return s.indexOf(t) >= 0; });
      if (dito) return;
      var no = noDeEscopo(t);
      if (link && link.parentNode === alvo) alvo.insertBefore(no, link); else alvo.appendChild(no);
    });
  }
  /* A frase de variante, uma por card, e só quando há o que dizer:
     título ≠ linha (C1/C6), modalidade a definir (placeholder de família,
     E9) ou mais de uma variante fundida sob a mesma linha (C10). */
  function fraseDeVariante(p) {
    var v = p.variante, nomes = (v && v.nomes) ? v.nomes.filter(Boolean) : [];
    if (v && v.modalidade === "a definir" && nomes.length)
      return "Modalidade a definir no aprofundamento: " + nomes.join(" ou ");
    if (p.titulo && p.titulo !== p.nome)
      return "Variante resolvida pelo contexto declarado — linha de produto: " + p.nome;
    var outras = nomes.filter(function (n) { return n !== p.titulo && n !== p.nome; });
    if (outras.length) return "Disponível também como " + outras.join(", ");
    return "";
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

  /* ===================== o veto que se declara (026) =====================
     Onde o motor tem voz e diz "nunca substituição", "plataforma cobre" ou
     "serviço inelegível", a linha do MAP NÃO vira card — e também não some em
     silêncio: o bloco nomeia a linha, a razão LITERAL do motor e a tecnologia
     declarada que a sustenta. É a leitura que o cliente vê (QS-01 casos 2 e 4).

     INVARIANTES DE DOM, cada uma medida por um gate que já existe (E17):
       · entra DEPOIS dos cards e antes do botão do editor — o censo da Camada
         1 para no primeiro nó estranho, e aqui ele já contou todos;
       · classe própria, fora de `CLASSES_CONTIGUAS` (`tests_010_vao.js:168`)
         e NUNCA `.apoio-block` — não é card, não entra em
         `data-p52-support-cards` nem nos censos de `P52-REC1g`/`tests_023`;
       · NUNCA `data-p53-suprimido`: veto é decisão do motor, supressão é
         decisão do operador; o `D025-AUS1 (b)` mede a ausência deste
         atributo sem curadoria, e o `D026-M4` ataca exatamente a troca;
       · idempotente: removido e reemitido a cada passagem, nos dois ramos de
         `decorar()`, como o aviso de supressão.
     Um `li` por LINHA (agrupando as capabilities vetadas); `data-p53-vetos`
     conta linhas distintas. `data-p53-sol-item-id` no `li` quando o veto
     nomeia um item do motor — o `D026-REC1 (g)` procura o portador em card OU
     em veto e confere a linha contra o pareamento reimplementado. */
  function declararVetos(sec, vetos) {
    var velho = sec.querySelector(":scope > [data-p53-vetos]");
    if (velho && velho.parentNode) velho.parentNode.removeChild(velho);
    if (!vetos || !vetos.length) return;
    var porLinha = {}, ordem = [], i, v;
    for (i = 0; i < vetos.length; i++) {
      v = vetos[i];
      if (!porLinha[v.nome]) { porLinha[v.nome] = []; ordem.push(v.nome); }
      porLinha[v.nome].push(v);
    }
    var bloco = el("div", { "class": "p53-sol-vetos", "data-p53-vetos": String(ordem.length), role: "note" });
    bloco.appendChild(el("div", { "class": "p53-sol-vetos-t" }, VETO_TXT.titulo));
    bloco.appendChild(el("p", { "class": "p53-sol-vetos-lead" }, VETO_TXT.lead));
    var ul = el("ul", { "class": "p53-sol-vetos-lista" });
    ordem.forEach(function (nome) {
      var grupo = porLinha[nome], primeiro = grupo[0];
      var li = el("li", { "class": "p53-sol-veto", "data-p53-veto-item": nome,
        "data-p53-veto-classe": primeiro.classe || "" });
      var itemId = null;
      grupo.forEach(function (x) { if (!itemId && x.itemId) itemId = x.itemId; });
      if (itemId) li.setAttribute("data-p53-sol-item-id", itemId);
      li.appendChild(el("div", { "class": "p53-sol-veto-nome" }, nome));
      /* a razão: TODAS as notas do motor (é assim que o "M75" de C3b chega),
         com o `motivo` como fallback quando o engine veta sem nota */
      var razoes = [];
      grupo.forEach(function (x) {
        (x.notas && x.notas.length ? x.notas : [x.motivo]).forEach(function (n) {
          if (n && razoes.indexOf(n) < 0) razoes.push(n);
        });
      });
      razoes.forEach(function (n) { li.appendChild(el("div", { "class": "p53-sol-veto-motivo" }, n)); });
      var caps = listaUnica(grupo, function (x) { return x.cap ? aplicarCopy(x.cap) : ""; });
      if (caps.length) li.appendChild(el("div", { "class": "p53-sol-veto-caps" }, VETO_TXT.caps + caps.join("; ")));
      var tecs = [];
      grupo.forEach(function (x) {
        (x.existente || []).forEach(function (s) {
          if (!s || !s.product) return;
          var t = VETO_TXT.tecnologia + s.product + " (" + (s.status || "") + (s.deployment ? ", " + s.deployment : "") + ")";
          if (tecs.indexOf(t) < 0) tecs.push(t);
        });
      });
      tecs.forEach(function (t) { li.appendChild(el("div", { "class": "p53-sol-veto-tec" }, t)); });
      var extVistas = [];
      grupo.forEach(function (x) {
        (x.extensoes || []).forEach(function (e) {
          if (!e || !e.itemId || extVistas.indexOf(e.itemId) >= 0) return;
          extVistas.push(e.itemId);
          var d = el("div", { "class": "p53-sol-veto-ext" }, VETO_TXT.extensao);
          d.appendChild(el("span", { "data-p53-sol-extensao": e.itemId },
            (e.nome || e.itemId) + (e.scopeNote ? " — " + e.scopeNote : "")));
          li.appendChild(d);
        });
      });
      var svcVistos = [];
      grupo.forEach(function (x) {
        (x.servicos || []).forEach(function (s) {
          if (!s || !s.serviceId || svcVistos.indexOf(s.serviceId) >= 0) return;
          svcVistos.push(s.serviceId);
          li.appendChild(el("div", { "class": "p53-sol-veto-svc", "data-p53-sol-servico": s.serviceId },
            VETO_TXT.servico + (s.nome || s.serviceId) + (s.note ? " — " + s.note : "")));
        });
      });
      ul.appendChild(li);
    });
    bloco.appendChild(ul);
    sec.appendChild(bloco);
  }

  /* ===================== colocação e agrupamento ===================== */
  /* ====================================================================
     [EA-65] A FRONTEIRA DECLARADA, e ela só existe quando precisa existir.

     Com a arbitragem da 010 ativa, o título congelado fica OCULTO e os meus
     cards ficam VISÍVEIS. Se um encostar no outro, o censo da Camada 1 os
     conta no MESMO grupo contíguo e o `D010-ARB3` reprova por "arbitragem
     parcial" — medido: 3 ocultos de 9. E ele está certo: um grupo meio oculto
     e meio visível é exatamente o estado misto que a regra tudo-ou-nada
     proíbe.

     O separador é um nó VISÍVEL, de classe própria e fora de
     `CLASSES_CONTIGUAS`, que encerra a contagem antes dos cards. Não é
     artifício: ele diz ao leitor o que começa ali, que é informação que a
     seção passou a precisar quando ganhou duas origens.

     E ele NÃO entra em modo legado, de propósito. Ali o título congelado está
     visível e os cards são justamente os "blocos contíguos visíveis" que o
     `D010-ARB1 (c)` mede; interpor o separador tiraria o sujeito da alínea e
     ela falharia por vacuidade. A mesma peça, nos dois modos, teria efeitos
     opostos — por isso a condição.
     ==================================================================== */
  function fronteira() {
    return el("p", { "class": "p53-sol-lead", "data-p53-sol-lead": "1" },
      "Apoio por produto, derivado dos gaps observados nesta sessão.");
  }

  function colocar(sec, cards, arbitrando) {
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
    var velhaFronteira = sec.querySelector(":scope > [data-p53-sol-lead]");
    if (velhaFronteira && velhaFronteira.parentNode) velhaFronteira.parentNode.removeChild(velhaFronteira);
    if (arbitrando && cards.length) sec.appendChild(fronteira());
    /* ANCORA NO TITULO CONGELADO, nao no primeiro filho. Inserir em
       `sec.firstChild` parecia obvio e nao sobrevive: a passagem do workspace
       recria o `<h2>` da secao no topo numa passagem seguinte e leva o no
       junto — medido, o `<p>` entrava e sumia. Antes do primeiro
       `.section-title` e a posicao que a regra exige (o `hiding` de
       `hideLegacyRecommendation` so liga A PARTIR do titulo) e que o layout
       respeita. No sem titulo congelado na secao, nada a ligar. */

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
    /* [EA-65] A ABSTENÇÃO DEIXA DE SER DA SEÇÃO INTEIRA.

       Na W4 eu me abstinha de tudo quando QUALQUER nó do escopo estivesse
       oculto, para não ressuscitar região que a arbitragem da 010 escondeu. A
       decisão foi grossa: medido, o que a arbitragem esconde com contexto
       declarado são os títulos congelados e a lista secundária — e a visão por
       solução, que é superfície V3.2 e deriva do MOTOR, ficava fora do ar
       inteira. Quem declara contexto, que é o caso mais cuidadoso, recebia o
       produto sem a funcionalidade.

       Agora a abstenção é POR NÓ: `blocosLegados()` e `prodLegadoDe()` recusam
       o que está oculto, e nada que a arbitragem escondeu é movido ou
       ressuscitado. O que muda é que os cards passam a existir nos dois modos,
       porque a oferta do motor não depende do contexto declarado. */
    var arbitrando = arbitragemEmCurso();

    var legados = blocosLegados(ws);
    /* [EA-65] A construção deixa de depender de haver bloco legado VISÍVEL.
       Com contexto declarado a arbitragem esconde a região congelada e sobram
       poucos blocos — ou nenhum. A oferta do motor não muda por isso, então o
       gatilho passa a ser: há legado a consumir OU ainda não há cards. */
    var jaConsolidado = sec.querySelectorAll(":scope > .apoio-block[data-p53-sol-produto]").length;
    if (legados.length || !jaConsolidado) {
      /* [EA-68] A LISTA DE PRODUTOS VEM DO MOTOR, não da colheita do DOM. O
         Quem decide QUEM entra é `ofertaDoMotor()` — a mesma fonte do
         `__CURATION.offered()`, que já oferecia os onze enquanto a vista
         mostrava dois. O `.prod` completo, quando existe, é localizado por
         `prodLegadoDe()`.

         A colheita por DOM saiu inteira: com a fonte no motor, ela deixou de
         decidir qualquer coisa e virou código morto. Código morto que sobrevive
         porque "um mutante aponta para ele" é dívida disfarçada de cobertura —
         o mutante foi reancorado e a função, removida. */
      var produtos = ofertaDoMotor();
      /* [026] Os vetos vêm pela mesma porta e não dependem de haver card:
         C2/C4 têm ZERO produto e um bloco de vetos — a seção precisa dizer
         por que não há card, senão o leitor acha que o motor nada viu. */
      var vetos = vetosDoMotor();
      if (!produtos.length) { declararVetos(sec, vetos); return; }
      for (var k = 0; k < produtos.length; k++)
        produtos[k].prod = prodLegadoDe(ws, produtos[k].nome);
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
      colocar(sec, cards, arbitrando);
      declararSupressao(sec, cards.length, suprimidos);
      declararVetos(sec, vetos);
      ultimoCenso = { produtos: produtos.length, publicados: cards.length,
        suprimidos: suprimidos, blocos: legados.length, vetos: vetos.length };
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
      colocar(sec, atuais, arbitrando);
      declararSupressao(sec, atuais.length, removidos);
      declararVetos(sec, vetosDoMotor());
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
    /* [026] C2/C4: a seção existe no papel SÓ com o bloco de vetos — o PDF
       precisa dizer por que não há card tanto quanto a tela. */
    var vetos = sec.querySelector(":scope > [data-p53-vetos]");
    if (!cards.length && !aviso && !vetos) return "";
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
      var sinais = c.getAttribute("data-qs22-sinais") || "";
      h += '<div class="pr-card" data-p53-sol-produto="' + escHtml(nome) + '" data-p53-sol-grupo="' + escHtml(gid) +
           '"' + (sinais ? ' data-qs22-sinais="' + escHtml(sinais) + '"' : "") + atributosCopiados(c) + '>';
      /* [026] QS-02: o qualificador viaja — era o ÚNICO `data-*` do card que o
         papel descartava (C5: 0 de 9 com qualificador). Texto copiado do
         `.p53-sol-tierlabel`, nunca recalculado (`D019-PAR1`). */
      var tierLabel = c.querySelector(".p53-sol-tierlabel");
      if (c.getAttribute("data-p53-sol-tier") && tierLabel)
        h += '<div class="pr-mut p53-pr-tier">' + escHtml(txt(tierLabel)) + "</div>";
      if (sinais) h += '<div class="pr-mut">habilitado por sinal declarado: ' + escHtml(sinais) + "</div>";
      /* o <b> é o TÍTULO do card (item resolvido, D-7); a linha vai no atributo */
      var h4 = c.querySelector("h4");
      h += "<b>" + escHtml(h4 ? txt(h4) : nome) + "</b>";
      h += linhaCopiada(c, ".p53-sol-variante", "p53-pr-variante") + linhaCopiada(c, ".p53-sol-acao", "p53-pr-acao") +
           linhaCopiada(c, ".p53-sol-condicao", "p53-pr-condicao") + linhaCopiada(c, ".p53-sol-elig", "p53-pr-elig");
      /* MESMO marcador da tela. O `D019-M4` remove só aqui, porque é aqui que
         a divergência costuma nascer sem ninguém ver (EA-58). */
      if (c.querySelector("[data-p53-prov]"))
        h += '<div class="pr-mut" data-p53-prov="operador">' + escHtml(PROV_TXT) + "</div>";
      var desc = c.querySelector(".pt-desc");
      if (desc) h += '<div class="pr-mut">' + escHtml(txt(desc)) + "</div>";
      /* [026] "Escopo: …" — do `.scope` movido ou do montado do registro;
         hoje nunca chegava ao papel (QS-02, "camada endpoint"). */
      var escopos = c.querySelectorAll(".scope"), textoEscopo = [];
      for (j = 0; j < escopos.length; j++) if (txt(escopos[j])) textoEscopo.push(txt(escopos[j]));
      if (textoEscopo.length) h += '<div class="pr-mut p53-pr-escopo">' + escHtml(textoEscopo.join(" ")) + "</div>";
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
    /* [026] O bloco de vetos, copiado da tela: mesma contagem, mesmos itens.
       NÃO é `.pr-card` e não carrega `data-p53-sol-produto` — as contagens de
       `D023-PAP1`/`D010-PAPEL1` continuam a contar só cards. */
    if (vetos) {
      h += '<div class="pr-mut p53-pr-vetos" data-p53-vetos="' + escHtml(vetos.getAttribute("data-p53-vetos")) + '">';
      var tit = vetos.querySelector(".p53-sol-vetos-t");
      if (tit) h += '<div class="p53-pr-vetos-t">' + escHtml(txt(tit)) + "</div>";
      h += "<ul>";
      var itens = vetos.querySelectorAll("li[data-p53-veto-item]");
      for (i = 0; i < itens.length; i++) {
        var li = itens[i];
        h += '<li data-p53-veto-item="' + escHtml(li.getAttribute("data-p53-veto-item")) + '" data-p53-veto-classe="' +
             escHtml(li.getAttribute("data-p53-veto-classe") || "") + '"' +
             (li.getAttribute("data-p53-sol-item-id") ? ' data-p53-sol-item-id="' + escHtml(li.getAttribute("data-p53-sol-item-id")) + '"' : "") + ">";
        var partes = li.children;
        for (j = 0; j < partes.length; j++) if (txt(partes[j])) h += "<div>" + escHtml(txt(partes[j])) + "</div>";
        h += "</li>";
      }
      h += "</ul></div>";
    }
    return h + "</div>";
  }
  /* Os atributos do card que o papel copia (spec §Papel): a chave, o item, as
     variantes, a ação, a origem e a condição — presentes no papel sse
     presentes na tela, para que `D026-PAP1` compare `null` com `null`. */
  var ATTRS_DO_PAPEL = ["data-p53-sol-tier", "data-p53-sol-chave", "data-p53-sol-item-id", "data-p53-sol-variantes",
    "data-p53-sol-acao", "data-p53-sol-origem", "data-p53-sol-condicao"];
  function atributosCopiados(c) {
    var s = "", i, v;
    for (i = 0; i < ATTRS_DO_PAPEL.length; i++) {
      v = c.getAttribute(ATTRS_DO_PAPEL[i]);
      if (v !== null) s += " " + ATTRS_DO_PAPEL[i] + '="' + escHtml(v) + '"';
    }
    return s;
  }
  function linhaCopiada(c, seletor, classe) {
    var n = c.querySelector(seletor);
    return (n && txt(n)) ? '<div class="pr-mut ' + classe + '">' + escHtml(txt(n)) + "</div>" : "";
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
