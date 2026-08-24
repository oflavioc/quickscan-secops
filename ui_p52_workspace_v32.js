/* ============================================================================
   PHASE 5.2 · DESKTOP WORKSPACE & RESULTS INFORMATION ARCHITECTURE
   Owner de LAYOUT da Camada 5. Este módulo não possui estado canônico algum:
   ele reorganiza, agrupa e rotula superfícies que JÁ foram renderizadas pelos
   owners existentes, e lê estado somente onde ele já é público no runtime
   congelado (`TARGET_PROFILE.overrides`, `data-p50-gate`, `aria-expanded`).

   O que este módulo NÃO faz — e não pode passar a fazer:
     · não calcula score, estágio, suficiência, target, gap ou recomendação;
     · não cria, remove ou reescreve recomendação, capability ou produto;
     · não declara limiar de suficiência (moeda canônica: UI-009A / P50-SUF0);
     · não duplica owner de estado: cada nó movido é o NÓ ORIGINAL, com os
       handlers e os atributos ARIA que o owner lhe deu;
     · não usa innerHTML em nó vivo (mesma disciplina da 5.0).

   Contrato de reentrância: `render()` reconstrói `#app` do zero a cada
   passagem, e este decorador é o ÚLTIMO da cadeia `window.__uxDecor`. Logo
   cada passagem encontra a árvore plana recém-criada pelos owners e a
   reagrupa de novo — não há estado acumulado entre passagens.
   ========================================================================== */
(function () {
  "use strict";

  var p52Errors = 0;
  var p52ObserverInstalled = false;
  var p52Passes = 0;          /* diagnóstico: quantas vezes o decorador rodou */
  var p52LastScreen = null;   /* diagnóstico: tela vista na última passagem */

  /* --------------------------------------------------------------------------
     Utilitários locais (mesma disciplina "zero innerHTML" da Camada 5.0).
     -------------------------------------------------------------------------- */
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.appendChild(document.createTextNode(String(text)));
    return n;
  }
  function txt(n) { return n ? (n.textContent || "").replace(/\s+/g, " ").trim() : ""; }
  function has(n, c) { return !!(n && n.classList && n.classList.contains(c)); }
  /* Fonte canônica da tela corrente: a MESMA função do owner congelado da
     camada 4.1 (`uxScreenOf()`), e não o atributo `body[data-uxscreen]` — o
     atributo é ESCRITO por `uxAfterRender()`, que roda DEPOIS de
     `window.__uxDecor`, e por isso está uma transição atrasado quando esta
     camada é invocada pela cadeia de decoradores. */
  function p52Screen() {
    try { if (typeof uxScreenOf === "function") return uxScreenOf(); }
    catch (e) { /* fora do escopo do runtime: cai no atributo */ }
    return document.body ? document.body.getAttribute("data-uxscreen") : null;
  }
  function reducedMotion() {
    try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch (e) { return false; }
  }

  /* ==========================================================================
     REV B · COPY-B — linguagem de negócio na APRESENTAÇÃO
     §5.1: "mandato" e "charter" saem do que o usuário e o cliente leem.
     §5.2: o travessão deixa de ser separador padrão em frases de sistema.

     Isto é substituição de TEXTO APRESENTADO, não de identidade: `QS[k].id`,
     `MAP[qid]`, os IDs de sessão e o schema permanecem exatamente como estão —
     e o payload M41, que deriva do runtime e não do DOM, continua byte-idêntico.

     O mapa é FECHADO e ordenado do mais longo para o mais curto, para que uma
     frase inteira nunca seja quebrada por uma substituição parcial. Nada aqui
     toca texto digitado pelo usuário: `p52CopyGuard()` recusa qualquer nó
     dentro de campo de formulário, de nota da sessão ou do anexo.
     ========================================================================== */
  var P52_COPY = [
    ["A operação de segurança tem objetivos e mandato claros, conectados ao negócio?",
     "A operação de segurança tem direcionamento, responsabilidades e objetivos claros, conectados ao negócio?"],
    ["Existe um direcionamento formal (charter, metas) — ou segurança acontece por demanda?",
     "Existe um direcionamento formal, com metas definidas, ou a segurança acontece por demanda?"],
    ["assessment de postura e formalização de charter",
     "assessment de postura e formalização do documento de direcionamento"],
    ["Direcionamento e mandato de segurança", "Direcionamento e responsabilidades de segurança"],
    ["Mandato e objetivos formalizados", "Direcionamento e objetivos formalizados"],
    ["Mandato e objetivos", "Direcionamento e objetivos"],
    ["mandato formal", "direcionamento formal e responsabilidades definidas"],
    ["charter", "documento de direcionamento da operação"],
    ["Mandato", "Direcionamento"],
    ["mandato", "direcionamento"],
    /* §5.2 · travessões de sistema que viraram separador padrão */
    ["Evidência / contexto da resposta — opcional", "Evidência / contexto da resposta · opcional"],
    ["Screening indicativo de alto nível — não substitui assessment formal.",
     "Screening indicativo de alto nível. Não substitui um assessment formal."],
    ["Não avaliado — evidência insuficiente", "Não avaliado: evidência insuficiente"],
    ["Estágio não determinado — dados insuficientes", "Estágio não determinado: dados insuficientes"],
    ["Não pontua — entra como item de validação no resultado.",
     "Não pontua. Entra como item de validação no resultado."]
  ];
  /* Nós cujo texto é do USUÁRIO ou é citação literal: nunca reescritos. */
  /* O bloqueio é sobre o TEXTO DO USUÁRIO e sobre citações literais — não
     sobre o contêiner que os hospeda: o anexo de respostas também imprime a
     PERGUNTA, que é apresentação e precisa acompanhar a linguagem nova. */
  var P52_COPY_BLOCK = "textarea, input, select, option, .fnote, .anote, .aitem .anote, " +
    ".pr-obs, .v32-techs, [data-p50=\"note\"], [data-p52=\"cap-help-text\"], footer";
  function p52CopyGuard(node, root) {
    for (var e = node.parentElement; e && e !== root.parentElement; e = e.parentElement) {
      if (e.matches && e.matches(P52_COPY_BLOCK)) return false;
    }
    return true;
  }
  function p52Copy(root) {
    if (!root || typeof document.createTreeWalker !== "function") return 0;
    var walker = document.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */, null, false);
    var pend = [], n;
    while ((n = walker.nextNode())) pend.push(n);
    var trocas = 0;
    for (var i = 0; i < pend.length; i++) {
      var t = pend[i], v = t.nodeValue;
      if (!v || v.indexOf("\u0000") >= 0) continue;
      if (!/[Mm]andato|charter|—/.test(v)) continue;
      if (!p52CopyGuard(t, root)) continue;
      var out = v;
      for (var k = 0; k < P52_COPY.length; k++) {
        if (out.indexOf(P52_COPY[k][0]) < 0) continue;
        out = out.split(P52_COPY[k][0]).join(P52_COPY[k][1]);
      }
      if (out !== v) { t.nodeValue = out; trocas++; }
    }
    /* atributos apresentados: placeholder, aria-label e title de superfícies próprias */
    var attrs = root.querySelectorAll("[aria-label], [placeholder]");
    for (var a = 0; a < attrs.length; a++) {
      ["aria-label", "placeholder"].forEach(function (name) {
        var val = attrs[a].getAttribute(name);
        if (!val || !/[Mm]andato|charter/.test(val)) return;
        var o = val;
        for (var k2 = 0; k2 < P52_COPY.length; k2++) o = o.split(P52_COPY[k2][0]).join(P52_COPY[k2][1]);
        if (o !== val) { attrs[a].setAttribute(name, o); trocas++; }
      });
    }
    return trocas;
  }

  /* ==========================================================================
     REV A · GLOSSÁRIO DE CAPABILITIES (CTX-REV-A §2.2)
     Texto curto, neutro e SEM produto. Cada verbete responde a três coisas:
     o que a capability significa numa operação de segurança, o que o
     facilitador deve declarar e o que a declaração NÃO prova. Nenhuma
     definição comercial, nenhuma associação automática a fabricante.
     A chave é o `capId` canônico do runtime congelado; capability sem verbete
     simplesmente não ganha controle de ajuda — nada é inventado.
     ========================================================================== */
  var P52_CAP_HELP = {
    "knowledge-management":
      "Como procedimentos, lições aprendidas, playbooks e conhecimento operacional são registrados, " +
      "mantidos e compartilhados no SOC. Informe ferramentas e práticas já utilizadas. A simples " +
      "existência de uma ferramenta não prova que o conhecimento esteja atualizado ou incorporado à rotina.",
    "incident-management":
      "Como incidentes são registrados, triados, escalados e encerrados, com dono e prazo. Informe a " +
      "ferramenta de registro e o fluxo praticado. Ter uma ferramenta de tickets não prova que o " +
      "processo de resposta esteja definido nem que seja seguido sob pressão.",
    "detection-engineering":
      "Como regras e casos de uso de detecção são criados, versionados, testados e aposentados. Informe " +
      "onde as regras vivem e quem as mantém. Possuir regras não prova cobertura de ameaça nem que " +
      "falsos positivos estejam sob controle.",
    "security-analytics":
      "Onde eventos e logs são centralizados, correlacionados e consultados — SIEM, data lake ou " +
      "equivalente. Informe a plataforma e o escopo de ingestão. Ingerir logs não prova que existam " +
      "detecções úteis nem que alguém os analise.",
    "security-automation":
      "Automação de tarefas de resposta e enriquecimento — playbooks automatizados, SOAR ou scripts. " +
      "Informe o que já está automatizado. Ter a plataforma não prova que os playbooks estejam em " +
      "produção nem que reduzam tempo de resposta.",
    "continuous-monitoring":
      "Cobertura de monitoramento ao longo do tempo, incluindo janela de operação e quem observa. " +
      "Informe o regime praticado e quem o executa. Monitorar não prova que os alertas sejam " +
      "triados dentro de um prazo acordado.",
    "soc-platform":
      "Existência de uma plataforma que unifica detecção, investigação e resposta num só lugar. " +
      "Informe se há consolidação ou ferramentas separadas. Consolidação de tela não prova " +
      "consolidação de processo nem de dado.",
    "threat-intelligence":
      "Uso operacional de inteligência de ameaças para priorizar detecção e resposta. Informe fontes " +
      "e como são consumidas. Assinar um feed não prova que a inteligência chegue à operação nem " +
      "que mude alguma decisão.",
    "soc-ai-assistance":
      "Apoio de IA a triagem, investigação, sumarização ou redação no SOC. Informe onde já é usado. " +
      "Usar IA não prova ganho de qualidade nem substitui o julgamento do analista.",
    "endpoint-detection":
      "Detecção e resposta no endpoint — visibilidade de processo, contenção e investigação. Informe " +
      "a solução e a cobertura de parque. Ter agente instalado não prova cobertura completa nem " +
      "que a resposta esteja habilitada.",
    "network-detection":
      "Visibilidade e detecção no tráfego de rede, incluindo movimentação lateral. Informe onde há " +
      "coleta e análise. Ter sensores não prova cobertura dos segmentos que importam.",
    "external-exposure":
      "Conhecimento e gestão do que está exposto para fora — superfície externa, domínios, " +
      "credenciais vazadas. Informe se há inventário e com que frequência é revisto. Um " +
      "levantamento pontual não prova acompanhamento contínuo.",
    "vulnerability-management":
      "Ciclo de identificação, priorização, correção e verificação de vulnerabilidades. Informe " +
      "ferramenta, escopo e cadência. Escanear não prova que a correção aconteça nem que o risco " +
      "seja priorizado por contexto.",
    "deception":
      "Uso deliberado de iscas e ativos falsos para detectar movimentação adversária. Informe se " +
      "existe e onde. Ter deception não prova cobertura nem que os alertas sejam tratados.",
    "malware-analysis":
      "Capacidade de detonar, analisar e extrair indicadores de artefatos suspeitos. Informe se há " +
      "sandbox ou análise manual. Ter sandbox não prova que o resultado alimente detecção ou resposta.",
    "email-threat-protection":
      "Proteção do e-mail e do ambiente de colaboração contra phishing, fraude e malware. Informe as " +
      "camadas em uso. Filtrar mensagens não prova que o usuário final esteja protegido do golpe.",
    "insider-risk":
      "Tratamento de risco originado de pessoas com acesso legítimo. Informe se há monitoramento e " +
      "processo. Coletar sinal não prova que exista processo de tratamento com RH e jurídico.",
    "data-loss-prevention":
      "Controle sobre saída indevida de dados sensíveis. Informe onde há política e enforcement. " +
      "Ter DLP não prova classificação de dado adequada nem baixa taxa de falso positivo.",
    "identity-access":
      "Gestão de identidades, autenticação e autorização, incluindo múltiplo fator. Informe as " +
      "soluções e a cobertura. Ter MFA não prova cobertura de todos os acessos críticos.",
    "privileged-access":
      "Controle, cofre e auditoria de credenciais e sessões privilegiadas. Informe se há PAM e o " +
      "escopo. Ter cofre não prova que todo acesso privilegiado passe por ele.",
    "human-risk":
      "Trabalho sobre o comportamento das pessoas — conscientização, simulação e medição. Informe " +
      "o programa praticado. Realizar treinamento não prova mudança de comportamento.",
    "ai-runtime-security":
      "Proteção de aplicações e agentes de IA em execução — entrada, saída e uso indevido. Informe " +
      "se há controle específico. Usar IA com política não prova que abusos sejam detectados."
  };

  /* ==========================================================================
     REV B · HELP-B §4 — glossário de arquitetura, dados e IA.
     Mesmo contrato de acessibilidade da ajuda por capability. Os textos de
     "Processamento local obrigatório" e "Residência/localidade de dados" são
     os exigidos pela §4.2: um trata do LOCAL e do modelo operacional do
     processamento, o outro da JURISDIÇÃO em que os dados podem estar.
     ========================================================================== */
  var P52_ARCH_HELP = {
    "saasAllowed":
      "Indica se a organização aceita consumir capacidades como serviço em nuvem pública. " +
      "Informe a política vigente, não a preferência pessoal. Aceitar SaaS não dispensa " +
      "requisitos de residência de dados nem de contrato.",
    "localProcessingRequired":
      "Indica se a organização exige que o processamento ocorra em infraestrutura sob seu controle, " +
      "como datacenter próprio, appliance ou ambiente privado. Trata do local e do modelo " +
      "operacional do processamento.",
    "otIsolated":
      "Indica se existe ambiente industrial ou segmento isolado com regras próprias de conectividade " +
      "e manutenção. Informe se há OT relevante no escopo. A existência de OT não define, sozinha, " +
      "qual solução cabe.",
    "unifiedPlatformPreference":
      "Indica se a organização prefere consolidar capacidades numa plataforma única ou manter o stack " +
      "atual. Informe a direção já decidida. Preferência declarada não é compromisso de compra.",
    "environmentProfile":
      "Descreve onde a carga de trabalho predominante roda: nuvem, híbrido ou on-premises. Informe o " +
      "perfil real do ambiente. O perfil orienta a leitura arquitetural e não altera a pontuação.",
    "dataResidency":
      "Indica em quais países, regiões ou jurisdições os dados podem ser armazenados ou processados. " +
      "Trata de localização geográfica e requisitos regulatórios. Um serviço pode ser cloud e ainda " +
      "cumprir residência local; também pode ser privado e estar em região não permitida."
  };
  /* ERRATA DA AUDITORIA EXTERNA · §6.1 · a ajuda `i` passa a cobrir TODA
     família de capabilities e o grupo de arquitetura, não apenas plataformas
     e requisitos. Mesmo componente, mesmo contrato, mesmo tom. */
  var P52_GROUP_HELP = {
    "g1": "Capacidades do núcleo da operação de segurança: governança do serviço, conhecimento, " +
          "resposta a incidentes, engenharia de detecção, analytics, automação, monitoração contínua, " +
          "plataforma de SOC, inteligência de ameaças e assistência de IA ao analista. " +
          "Declarar situação aqui não altera a pontuação do assessment.",
    "g2": "Capacidades que produzem e tratam telemetria de detecção: endpoint, rede, exposição externa, " +
          "gestão de vulnerabilidades, deception e análise de malware. " +
          "São a matéria-prima da detecção; possuir a ferramenta não eleva a maturidade.",
    "g3": "Controles adjacentes ao SOC que influenciam a leitura do contexto: proteção de e-mail, " +
          "risco de insider, prevenção de perda de dados, identidade e acesso, acesso privilegiado, " +
          "risco humano e segurança de runtime de IA. Adjacente não significa menos importante.",
    "arch": "Restrições e preferências que condicionam QUAIS caminhos são viáveis — não o que a " +
            "organização já tem. Nenhum campo aqui altera score, estágio, suficiência ou gaps; " +
            "todos entram apenas na leitura arquitetural e na priorização das recomendações.",
    "plat": "Registre plataformas e licenciamento que a organização já possui. Serve para evitar " +
            "recompra e orientar adoção. Entitlement declarado não prova implantação, cobertura nem maturidade.",
    "sig": "Registre requisitos, preocupações e gatilhos trazidos na conversa. São contexto de sessão: " +
           "marcar um sinal não cria gap, não altera score e não define solução."
  };
  /* Subgrupos de "Requisitos ou preocupações específicas" — indexados pela
     ordem de `SIGNAL_GROUPS` no owner congelado (`data-gid="sig-N"`). */
  var P52_SIGGROUP_HELP = {
    "sig-0": "Situação e intenção em torno de incidentes e do próprio SOC: há incidente em curso, " +
             "suspeita, preocupação com ransomware, ou interesse declarado em prontidão de resposta, " +
             "avaliação e desenvolvimento de SOC. Marcar aqui registra urgência e intenção, não maturidade.",
    "sig-1": "Preocupações com o canal de e-mail e com a proteção do dado: fraude por comprometimento " +
             "de e-mail corporativo, segurança de e-mail, vazamento, risco de pessoas internas e " +
             "obrigações de conformidade sobre dados pessoais ou regulados.",
    "sig-2": "Uso e governança de inteligência artificial na organização — tanto o consumo de IA por " +
             "pessoas quanto a construção de aplicações e agentes. Estes sinais descrevem o AMBIENTE de " +
             "IA declarado; nenhum deles é pergunta do assessment e nenhum altera a pontuação.",
    "sig-3": "Requisitos ligados a quem acessa e a partir de quê: risco de identidade, necessidade de " +
             "gestão de acesso privilegiado e exigência específica de detecção e resposta em endpoint."
  };
  /* Plataformas, bundles e subscriptions: o nome do serviço é do fabricante, a
     explicação descreve a FUNÇÃO — sem afirmar aderência, cobertura, sizing ou
     recomendação de compra. */
  var P52_PLAT_HELP = {
    /* As legendas são endereçadas por SELETOR, nunca pelo texto: o owner de
       layout não pode embutir nome de fabricante (gate P52-REC1), e o texto da
       legenda pertence ao owner congelado. */
    "legend:.v32-plat": "Plataforma de firewall de rede declarada no ambiente. Marque apenas se já existe " +
      "em produção. A existência do equipamento não implica que os serviços de segurança dele estejam " +
      "licenciados ou ativos.",
    "legend:.v32-bundles":
      "Pacote comercial que já inclui um conjunto de serviços de segurança do firewall. Informe apenas se " +
      "o pacote contratado for conhecido. Pacote declarado indica direito de uso, não implantação.",
    "legend:.v32-subs":
      "Serviços de segurança contratados individualmente para o firewall. Marque somente o que foi " +
      "explicitamente declarado; não marcar não significa ausência, significa não informado.",
    "plat:fgt": "Marque quando o firewall já estiver em produção no ambiente avaliado. " +
      "É declaração de base instalada; não altera score, estágio nem gaps.",
    "bundle:": "Nenhum pacote informado. Use quando o bundle não é conhecido na sessão — é diferente de " +
      "afirmar que não existe bundle contratado.",
    "bundle:atp": "Pacote de proteção avançada contra ameaças: inclui prevenção de intrusão, antivírus, " +
      "sandbox como serviço, controle de aplicação e CASB inline. Direito de uso declarado, não implantação.",
    "bundle:utp": "Pacote unificado: tudo do pacote avançado mais filtragem de DNS, de URL e de vídeo e " +
      "bloqueio de botnet e canais de comando e controle.",
    "bundle:ent": "Pacote empresarial: tudo do pacote unificado mais serviço de prevenção de perda de dados, " +
      "segurança de superfície de ataque, prevenção de malware inline assistida por IA e correlação de " +
      "vulnerabilidades de dispositivos IoT.",
    "sub:fg-ips": "Prevenção de intrusão: inspeciona o tráfego em busca de exploração de vulnerabilidades conhecidas.",
    "sub:fg-antivirus": "Inspeção antimalware do tráfego que atravessa o firewall, por assinatura e heurística.",
    "sub:fg-sandbox-saas": "Detonação de arquivos suspeitos em ambiente isolado, entregue como serviço. " +
      "Apoia parcialmente a análise de malware; não substitui uma capacidade de análise própria.",
    "sub:fg-appcontrol": "Identificação e controle de aplicações no tráfego, independentemente de porta ou protocolo.",
    "sub:fg-inline-casb": "Visibilidade e controle sobre o uso de aplicações em nuvem no caminho do tráfego.",
    "sub:fg-dns-filtering": "Bloqueio e inspeção de resoluções de nome para domínios maliciosos ou indesejados.",
    "sub:fg-url-filtering": "Classificação e controle de acesso a endereços web por categoria e reputação.",
    "sub:fg-video-filtering": "Controle de acesso a plataformas de vídeo por canal ou categoria.",
    "sub:fg-antibotnet-c2": "Detecção e bloqueio de comunicação com infraestrutura de comando e controle.",
    "sub:fg-dlp-service": "Identificação de dado sensível em trânsito, com enforcement na rede. " +
      "Cobre parcialmente a prevenção de perda de dados; não cobre endpoint nem repositórios.",
    "sub:fg-attack-surface-security": "Verificação de configuração e exposição do próprio ambiente contra " +
      "boas práticas. Apoia a leitura de exposição externa, sem substituí-la.",
    "sub:fg-iot-detection-vuln-correlation": "Identificação de dispositivos IoT/OT e correlação com " +
      "vulnerabilidades conhecidas. Apoia a gestão de vulnerabilidades nesses ativos.",
    "sub:fg-inline-malware-prevention": "Bloqueio de malware no caminho do tráfego com apoio de modelos " +
      "treinados, sem esperar por análise posterior.",
    "sub:fg-ot-security": "Assinaturas e regras específicas para protocolos e ativos industriais.",
    "presence": "Situação DECLARADA da capacidade nesta organização: não informado, ausência confirmada, " +
      "parcialmente atendida ou atendida. É declaração de contexto, não avaliação: nenhuma opção aqui " +
      "altera score, estágio, suficiência ou gaps. \"Não informado\" é diferente de \"ausência confirmada\"."
  };
  var P52_SIGNAL_HELP = {
    "shadowAIConcern": "Uso de ferramentas de IA fora do controle da organização, geralmente por " +
      "iniciativa individual. Informe se já foi observado. Suspeita não é evidência de vazamento.",
    "organizationBuildsAIApps": "Interfaces de assistência usadas por pessoas, como copilots e " +
      "chatbots corporativos. Informe se já existem em produção. Existir não significa estar governado.",
    "usesAgenticAI": "Sistemas que planejam e executam ações com ferramentas, com pouca ou nenhuma " +
      "confirmação humana por passo. Informe se já operam. É categoria diferente de copilot.",
    "promptInjection": "",
    "promptInjectionConcern": "Manipulação da entrada de um modelo para desviar seu comportamento ou " +
      "extrair dados. Informe se é preocupação declarada. Preocupação não implica incidente ocorrido.",
    "aiUsageRisk": "Governança do uso de IA: política, aprovação, registro e responsabilidade. " +
      "Informe o que já está definido. Ter política não prova aderência.",
    "usesPrivateLLMs": "Modelos executados em infraestrutura da própria organização ou em tenant " +
      "dedicado. Informe se já há uso. Ser privado não elimina risco de vazamento por uso indevido.",
    "aiRuntimeSecurityConcern": "Proteção do modelo e da aplicação em execução: entrada, saída e abuso. " +
      "Informe se há controle específico. Controlar acesso não é o mesmo que inspecionar runtime.",
    "llmDataLeakageConcern": "Saída indevida de dado sensível por meio de um modelo de linguagem. " +
      "Informe se é preocupação declarada. Não pressupõe que o vazamento já tenha acontecido.",
    /* ERRATA DA AUDITORIA EXTERNA · §6.1 · os 14 sinais restantes passam a ter
       o MESMO controle de ajuda dos sinais de IA. Texto curto, factual e neutro
       de fabricante; nenhum deles cria gap, altera score ou define solução. */
    "activeIncident": "Há um incidente de segurança em curso agora, com resposta em andamento. " +
      "Marque apenas quando confirmado na conversa. Muda a urgência da leitura, nunca a pontuação.",
    "suspectedCompromise": "Há indício não confirmado de que o ambiente já tenha sido comprometido. " +
      "Suspeita não é confirmação: registrar aqui não afirma que o incidente existe.",
    "ransomwareConcern": "Preocupação declarada com sequestro de dados por criptografia e extorsão. " +
      "Registra prioridade percebida; não indica que exista exposição comprovada.",
    "wantsIRReadiness": "Interesse declarado em preparar-se para responder a incidentes — plano, papéis, " +
      "exercícios e retentores. Interesse declarado não é diagnóstico de prontidão.",
    "wantsSOCAssessment": "Interesse declarado em uma avaliação formal e aprofundada da operação de " +
      "segurança. Este screening é indicativo e não substitui esse trabalho.",
    "wantsSOCDevelopment": "Interesse declarado em construir ou evoluir a própria operação de segurança, " +
      "com pessoas, processos e tecnologia. Registra intenção, não capacidade atual.",
    "becConcern": "Preocupação com fraude conduzida por comprometimento ou imitação de e-mail corporativo, " +
      "normalmente com objetivo financeiro. É contexto de conversa, não achado do assessment.",
    "emailSecurityConcern": "Preocupação declarada com o canal de e-mail como via de entrada de ameaça — " +
      "phishing, anexo e link maliciosos. Marcar não implica que o controle atual seja insuficiente.",
    "dataLeakageConcern": "Preocupação com saída não autorizada de informação da organização, por qualquer " +
      "via. Registra a preocupação; não afirma que o vazamento tenha ocorrido.",
    "insiderRiskConcern": "Preocupação com risco originado por pessoas com acesso legítimo, por erro ou " +
      "por intenção. Registrar não atribui suspeita a pessoa alguma.",
    "complianceDataProtection": "Existem obrigações regulatórias ou contratuais sobre dados pessoais ou " +
      "regulados que condicionam as escolhas. Informe a existência da obrigação, não o grau de aderência.",
    "identityRiskConcern": "Preocupação com abuso de credenciais, contas e permissões como caminho de " +
      "ataque. Registra o tema; não avalia a maturidade da gestão de identidade.",
    "pamRequirement": "Existe requisito declarado de controlar, isolar e auditar o uso de contas " +
      "privilegiadas. Requisito declarado não indica que já exista solução implantada.",
    "edrSpecificNeed": "Existe necessidade declarada de detecção e resposta no endpoint como tema " +
      "específico da conversa. Registrar a necessidade não substitui a resposta do assessment sobre endpoint."
  };

  /* ==========================================================================
     REV A · REGIÕES DO CONTEXTO TECNOLÓGICO (CTX-REV-A §2.1)
     Os `data-gid` são os do owner congelado (`landscapeGroups()` + os três
     grupos fixos do editor). Esta camada apenas os separa em duas regiões de
     primeiro nível; não cria, remove nem renomeia grupo algum.
     ========================================================================== */
  var P52_CTX_REGIONS = [
    { key: "caps", title: "Capabilities de segurança",
      lead: "O que a operação já faz e com o quê. Declare a situação por capacidade — qualquer fabricante, qualquer produto.",
      gids: ["g1", "g2", "g3"] },
    { key: "env", title: "Ambiente e condicionantes",
      lead: "O que cerca e limita a operação: arquitetura, licenciamento já existente e requisitos específicos da conversa.",
      gids: ["arch", "plat", "sig"] }
  ];

  /* ==========================================================================
     REV A · EMBLEMA DOS CINCO DOMÍNIOS (HOME-REV-A §3.2)
     SVG inline, determinístico e ESTÁTICO: geometria própria (anel pentagonal
     de cinco nós), rótulos textuais sempre presentes, nome acessível e
     descrição curta. Nenhum score, preenchimento derivado, estágio ou estado
     de avaliação entra aqui — é identidade gráfica, não visualização de
     resultado. Zero asset externo, zero base64, zero requisição de rede.
     A cor NÃO é declarada em JavaScript: cada nó carrega `data-dom` canônico e
     o CSS resolve pelo mapa congelado [data-dom="N"] -> --dom-accent.
     ========================================================================== */
  var SVGNS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    return n;
  }
  /* REV B · HOME-B §2.2 — explicação curta por domínio. Texto explicativo:
     não altera score e não recomenda produto algum. */
  var P52_DOMAIN_HELP = [
    "Direcionamento, governança, objetivos, risco e alinhamento da operação de segurança às prioridades da organização.",
    "Capacidade, competências, papéis, treinamento, continuidade e conhecimento do time.",
    "Repetibilidade e disciplina operacional, incluindo resposta a incidentes, engenharia de detecção, melhoria contínua e automação.",
    "Telemetria, ferramentas e cobertura técnica para endpoints, rede, logs e análise.",
    "Cobertura operacional e serviços que sustentam monitoramento, exposição externa e gestão contínua de vulnerabilidades."
  ];

  function p52DomainEmblem() {
    if (typeof DOMS === "undefined" || !DOMS || DOMS.length !== 5) return null;
    /* O viewBox é MAIS LARGO que alto de propósito: os rótulos laterais
       ("Serviços" à esquerda, "Pessoas" à direita) saem do raio dos nós e
       precisam de calha própria — com um quadrado, eles eram clipados pela
       borda do SVG. Medido em `P52-HOME1`: nenhum rótulo pode encostar. */
    var W = 580, H = 440, cx = 290, cy = 212, R = 130, node = 27, labelR = R + 48;
    var root = svg("svg", {
      "class": "p52-emblem", viewBox: "0 0 " + W + " " + H,
      role: "img", "data-p52": "home-emblem",
      "aria-labelledby": "p52-emblem-title p52-emblem-desc", focusable: "false"
    });
    var t = svg("title", { id: "p52-emblem-title" });
    t.appendChild(document.createTextNode("Os cinco domínios do SOC-CMM"));
    root.appendChild(t);
    var dsc = svg("desc", { id: "p52-emblem-desc" });
    dsc.appendChild(document.createTextNode(
      "Emblema de identidade: cinco nós nomeados — " +
      DOMS.map(function (x) { return x.pt; }).join(", ") +
      " — dispostos em anel. Não representa score, estágio nem estado da avaliação."));
    root.appendChild(dsc);

    var pts = [], i, ang;
    for (i = 0; i < 5; i++) {
      ang = -Math.PI / 2 + i * 2 * Math.PI / 5;
      pts.push({ x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang), ang: ang });
    }
    /* anel de ligação — geometria própria, sem preenchimento de dado */
    var ring = svg("polygon", {
      "class": "p52-emblem-ring",
      points: pts.map(function (p) { return p.x.toFixed(1) + "," + p.y.toFixed(1); }).join(" ")
    });
    root.appendChild(ring);
    root.appendChild(svg("circle", { "class": "p52-emblem-core", cx: cx, cy: cy, r: 46 }));
    var ct = svg("text", { "class": "p52-emblem-coretext", x: cx, y: cy + 5, "text-anchor": "middle" });
    ct.appendChild(document.createTextNode("SOC-CMM"));
    root.appendChild(ct);

    for (i = 0; i < 5; i++) {
      var g = svg("g", {
        "class": "p52-emblem-node", "data-dom": String(i),
        tabindex: "0", role: "button", "aria-expanded": "false",
        "aria-describedby": "p52-domhelp-" + i,
        "aria-label": "O que é " + DOMS[i].pt + "? Explicação do domínio"
      });
      g.appendChild(svg("line", {
        "class": "p52-emblem-spoke", x1: cx, y1: cy,
        x2: pts[i].x.toFixed(1), y2: pts[i].y.toFixed(1)
      }));
      g.appendChild(svg("circle", {
        "class": "p52-emblem-disc", cx: pts[i].x.toFixed(1), cy: pts[i].y.toFixed(1), r: node
      }));
      var num = svg("text", {
        "class": "p52-emblem-num", x: pts[i].x.toFixed(1), y: (pts[i].y + 5).toFixed(1),
        "text-anchor": "middle", "aria-hidden": "true"
      });
      num.appendChild(document.createTextNode(String(i + 1)));
      g.appendChild(num);
      var lx = cx + labelR * Math.cos(pts[i].ang), ly = cy + labelR * Math.sin(pts[i].ang);
      var anchorAt = Math.abs(Math.cos(pts[i].ang)) < 0.25 ? "middle" : (Math.cos(pts[i].ang) > 0 ? "start" : "end");
      var lb = svg("text", {
        "class": "p52-emblem-label", x: lx.toFixed(1), y: (ly + 4).toFixed(1), "text-anchor": anchorAt
      });
      lb.appendChild(document.createTextNode(DOMS[i].pt));
      g.appendChild(lb);
      root.appendChild(g);
    }
    return root;
  }

  /* ==========================================================================
     P52-RES2 · ORDEM CANÔNICA DE LEITURA DA TELA DE RESULTADOS
     A ordem abaixo É a ordem do DOM: nenhuma seção é reposicionada por `order`
     ou por `grid-row` (P52-ACC2). Alterar esta lista altera simultaneamente a
     ordem visual, a ordem de foco e a ordem do trilho lateral.
     "Gaps observados" é UM item de navegação com DOIS grupos estruturais
     internos (P52-GAP1): altos e moderados nunca se misturam.
     ========================================================================== */
  var P52_SECTIONS = [
    { key: "exec",       title: "Visão executiva" },
    { key: "target",     title: "Cenário-alvo" },
    { key: "context",    title: "Contexto tecnológico" },
    { key: "evidence",   title: "Evidência e suficiência" },
    { key: "detail",     title: "Domínios e heat map" },
    { key: "priorities", title: "Prioridades do negócio" },
    { key: "gaps",       title: "Gaps observados" },
    { key: "support",    title: "Formas de apoio" },
    { key: "actions",    title: "Relatório e sessão" }
  ];
  function secId(key) { return "p52-sec-" + key; }

  /* --------------------------------------------------------------------------
     Exceção declarada do gate FECHADO (§7 · P52-RES2, última cláusula):
       "Se o gate de suficiência estiver fechado, a visão executiva deve mostrar
        o bloqueio de modo honesto e o painel de suficiência deve ganhar
        destaque no primeiro viewport. A ordem não pode fazer resultado
        bloqueado parecer liberado."

     Medido na candidata, com a ordem canônica pura o painel de suficiência
     caía a cerca de três viewports do topo em 1440x900 — longe de "primeiro
     viewport". Com o gate FECHADO, portanto, "Evidência e suficiência" sobe
     para logo depois da visão executiva. Duas propriedades que a diretriz
     trata como duras continuam valendo nas DUAS ordens:
       · o cenário-alvo continua ANTES do contexto tecnológico (P52-TGT1);
       · a ordem relativa de todo o resto é a canônica.
     Com o gate ABERTO nada muda: vale a ordem canônica da §7, e o alvo é
     imediatamente posterior à visão executiva.

     Esta é uma leitura de duas cláusulas que se tensionam no caso bloqueado.
     Está registrada no relatório da fase para decisão explícita do
     proprietário na UAT: reverter é trocar `p52OrderFor()` por `P52_SECTIONS`.
     -------------------------------------------------------------------------- */
  function p52OrderFor(gate) {
    if (gate !== "blocked") return P52_SECTIONS;
    var out = [], ev = null, i;
    for (i = 0; i < P52_SECTIONS.length; i++) {
      if (P52_SECTIONS[i].key === "evidence") { ev = P52_SECTIONS[i]; continue; }
      out.push(P52_SECTIONS[i]);
    }
    if (ev) out.splice(1, 0, ev);
    return out;
  }

  /* ==========================================================================
     Classificação das superfícies legadas em seções.

     A varredura é SEQUENCIAL sobre os filhos diretos de `section.screen`, no
     mesmo espírito do precedente congelado `hideLegacyRecommendation()`: um
     `.section-title` troca o balde corrente e todo nó subsequente sem regra
     própria pertence ao balde corrente. Isso preserva a adjacência original
     entre título e conteúdo — inclusive a de "Possíveis formas de apoio aos
     demais gaps altos", que no baseline pertence ao bloco de gaps e NÃO ao
     bloco de recomendação ocultável.
     ========================================================================== */
  var RE_PRIORIDADES = /Prioridades declaradas pelo neg[óo]cio/i;
  var RE_GAPS = /gaps observados/i;

  function p52Classify(list) {
    var buckets = {}, i;
    for (i = 0; i < P52_SECTIONS.length; i++) buckets[P52_SECTIONS[i].key] = [];
    var bucket = "exec";
    for (i = 0; i < list.length; i++) {
      var n = list[i];
      if (has(n, "next")) { if (n.parentNode) n.parentNode.removeChild(n); continue; }  /* P52-RES4 */
      if (has(n, "res-head") || has(n, "grid2") || n.id === "ux-journey") { buckets.exec.push(n); bucket = "exec"; continue; }
      if (n.id === "ux-target") { buckets.target.push(n); continue; }
      if (n.id === "v32panel") { buckets.context.push(n); continue; }
      if (n.id === "p50-suff" || n.id === "ux-refsum") { buckets.evidence.push(n); continue; }
      if (n.id === "p50-results") { buckets.detail.push(n); continue; }
      if (n.id === "ux-execrow") { buckets.priorities.push(n); continue; }
      if (has(n, "actions")) { buckets.actions.push(n); continue; }
      if (has(n, "finding")) { buckets.gaps.push(n); continue; }
      if (has(n, "prio-decl")) { buckets.priorities.push(n); continue; }
      if (has(n, "section-title")) {
        var ey = n.querySelector(".eyebrow");
        var t = txt(ey || n);
        bucket = RE_PRIORIDADES.test(t) ? "priorities" : (RE_GAPS.test(t) ? "gaps" : "support");
        buckets[bucket].push(n);
        continue;
      }
      buckets[bucket].push(n);
    }
    /* a suficiência abre a seção de evidência; o refinamento a acompanha */
    buckets.evidence.sort(function (a, b) {
      return (a.id === "p50-suff" ? 0 : 1) - (b.id === "p50-suff" ? 0 : 1);
    });
    return buckets;
  }

  /* ==========================================================================
     Idempotência: desmontagem antes de remontar.
     Uma passagem anterior pode ter deixado o workspace montado — e o owner
     congelado `uxResultsDecor()` recria `#ux-execrow` DEPOIS desta camada,
     a partir de `uxAfterRender()`. Cada passagem, portanto, desmonta o que
     montou, devolve os nós LEGADOS a uma lista ordenada e reconstrói. Nenhum
     nó legado é descartado: só os invólucros criados aqui desaparecem.
     ========================================================================== */
  function p52Harvest(node, out) {
    var kids = Array.prototype.slice.call(node.children), i;
    for (i = 0; i < kids.length; i++) {
      var c = kids[i];
      /* invólucros e nós criados por esta camada não voltam para a lista:
         eles são reconstruídos do zero a cada passagem */
      if (has(c, "p52-sec-title") || has(c, "p52-sec-lead") || has(c, "p52-gate-jump")) continue;
      if (has(c, "p52-gapgrp")) { p52Harvest(c.querySelector(".p52-gapgrp-cards") || c, out); continue; }
      /* o disclosure "Base de evidência" é invólucro DESTA camada: o painel
         canônico que ele guarda volta para a lista, o invólucro não */
      if (c.id === "p52-evbase") { var inner = c.querySelector("#p50-suff"); if (inner) out.push(inner); continue; }
      out.push(c);
    }
  }
  function p52LegacyNodes(screen) {
    var list = [], i;
    var ws = document.getElementById("p52-workspace");
    if (ws) {
      var secs = ws.querySelectorAll(".p52-sec");
      for (i = 0; i < secs.length; i++) p52Harvest(secs[i], list);
      if (ws.parentNode) ws.parentNode.removeChild(ws);
    }
    var kids = Array.prototype.slice.call(screen.children);
    for (i = 0; i < kids.length; i++) if (kids[i].id !== "p52-workspace") list.push(kids[i]);
    var tail = ["ux-target", "p50-suff", "p50-results"];
    for (i = 0; i < tail.length; i++) {
      var n = document.getElementById(tail[i]);
      if (n && list.indexOf(n) < 0) list.push(n);
    }
    return list;
  }

  /* ==========================================================================
     P52-GAP1 · separação estrutural entre severidades.
     A severidade NÃO é recalculada aqui: ela é lida do rótulo que o renderer
     congelado já imprimiu no card (`.f-tag.sev-a` / `.f-tag.sev-m`). Cada
     grupo tem heading próprio, contador próprio e tratamento visual próprio;
     a distinção sobrevive em escala de cinza (borda, ícone textual e texto) e
     para leitor de tela (heading + contagem no nome acessível).
     ========================================================================== */
  var P52_SEV = [
    { key: "high", cls: "sev-a", title: "Gaps altos de maturidade" },
    { key: "moderate", cls: "sev-m", title: "Gaps moderados de maturidade" }
  ];
  function p52SeverityOf(card) {
    var tag = card.querySelector(".f-tag");
    if (!tag) return null;
    if (has(tag, "sev-a")) return "high";
    if (has(tag, "sev-m")) return "moderate";
    return null;
  }
  function p52BuildGaps(sec, nodes) {
    var lead = [], cards = { high: [], moderate: [] }, i;
    for (i = 0; i < nodes.length; i++) {
      if (has(nodes[i], "finding")) {
        var sev = p52SeverityOf(nodes[i]);
        if (sev) { cards[sev].push(nodes[i]); continue; }
      }
      lead.push(nodes[i]);
    }
    /* o que não é card de gap (título legado, parágrafo de contexto, banner de
       ausência de gap, details de apoio) permanece na ordem original */
    var tailStart = -1;
    for (i = 0; i < lead.length; i++) if (has(lead[i], "t-details")) { tailStart = i; break; }
    var head = tailStart < 0 ? lead : lead.slice(0, tailStart);
    var tail = tailStart < 0 ? [] : lead.slice(tailStart);
    for (i = 0; i < head.length; i++) sec.appendChild(head[i]);
    for (var s = 0; s < P52_SEV.length; s++) {
      var d = P52_SEV[s], list = cards[d.key];
      if (!list.length) continue;
      var grp = el("div", {
        "class": "p52-gapgrp",
        id: "p52-grp-gaps-" + d.key,
        "data-p52-gapgrp": d.key,
        "data-p52-gapcount": String(list.length),
        role: "group",
        "aria-labelledby": "p52-grp-gaps-" + d.key + "-h"
      });
      var h = el("h3", { "class": "p52-gapgrp-title", id: "p52-grp-gaps-" + d.key + "-h" });
      h.appendChild(el("span", { "class": "p52-gapgrp-mark", "aria-hidden": "true" }, d.key === "high" ? "▲" : "▪"));
      h.appendChild(el("span", { "class": "p52-gapgrp-name" }, d.title));
      h.appendChild(el("span", { "class": "p52-gapgrp-count" },
        list.length + (list.length === 1 ? " item" : " itens")));
      grp.appendChild(h);
      var box = el("div", { "class": "p52-gapgrp-cards" });
      for (i = 0; i < list.length; i++) box.appendChild(list[i]);
      grp.appendChild(box);
      sec.appendChild(grp);
    }
    for (i = 0; i < tail.length; i++) sec.appendChild(tail[i]);
  }

  /* ==========================================================================
     ICON-REV-A · identidade do asset em cada tile.
     A escala óptica por artwork mora no CSS; aqui só se descobre QUAL artwork
     está no tile. A descoberta é por identidade de bytes do `src` contra o
     mapa congelado `ICONS` do runtime — nenhum mapa produto→asset é duplicado
     nesta camada, nenhum nome de produto é escrito aqui.
     ========================================================================== */
  var p52IconKeys = null;
  function p52IconIndex() {
    if (p52IconKeys) return p52IconKeys;
    p52IconKeys = {};
    try {
      if (typeof ICONS === "undefined" || !ICONS) return p52IconKeys;
      for (var k in ICONS) if (Object.prototype.hasOwnProperty.call(ICONS, k)) p52IconKeys[ICONS[k]] = k;
    } catch (e) { /* fora do escopo do runtime: nenhum tile é marcado */ }
    return p52IconKeys;
  }
  function p52MarkIcons(root) {
    var idx = p52IconIndex();
    var imgs = root.querySelectorAll(".icon-tile img");
    for (var i = 0; i < imgs.length; i++) {
      var src = imgs[i].getAttribute("src");
      var key = src ? idx[src] : null;
      if (key) imgs[i].setAttribute("data-p52-icon", key);
      else imgs[i].removeAttribute("data-p52-icon");
    }
  }

  /* ==========================================================================
     P52-DOM1 · cor canônica de domínio nas tags.
     O `data-dom` é atribuído por correspondência EXATA com o nome PT do
     domínio publicado pelo runtime congelado (`DOMS[i].pt`). Nenhum hex é
     declarado aqui: o índice resolve, no CSS, o mapa congelado
     [data-dom="N"] -> --dom-accent -> --ftnt-* (ui_ux_v32.css §4.3-B).
     O nome textual do domínio permanece como pista não cromática.
     ========================================================================== */
  function p52DomainIndex(name) {
    if (typeof DOMS === "undefined" || !DOMS) return -1;
    var n = String(name || "").trim().toLowerCase();
    for (var i = 0; i < DOMS.length; i++) if (String(DOMS[i].pt).trim().toLowerCase() === n) return i;
    return -1;
  }
  function p52TagDomains(root) {
    var chips = root.querySelectorAll(".dom-chip");
    for (var i = 0; i < chips.length; i++) {
      var ix = p52DomainIndex(txt(chips[i]));
      if (ix >= 0) {
        chips[i].setAttribute("data-dom", String(ix));
        chips[i].setAttribute("data-p52-domtag", "canonical");
      } else {
        chips[i].removeAttribute("data-dom");
        chips[i].setAttribute("data-p52-domtag", "unmapped");
      }
    }
  }

  /* ==========================================================================
     P52-TGT1 · explicação estável do cenário-alvo.
     Texto fixo, sem derivar número algum e sem tocar em `#ux-target`, cujo
     owner continua sendo `tgtSection()`.
     ========================================================================== */
  var P52_TARGET_LEAD = "Defina níveis desejados por prática para comparar o perfil atual com uma " +
    "trajetória indicativa. O cenário-alvo não altera as respostas nem o score atual; ele apenas " +
    "projeta a comparação Current × Target.";

  function p52TargetOverrides() {
    try {
      if (typeof TARGET_PROFILE === "undefined" || !TARGET_PROFILE || !TARGET_PROFILE.overrides) return 0;
      return Object.keys(TARGET_PROFILE.overrides).length;
    } catch (e) { return 0; }
  }

  /* ==========================================================================
     P52-CTX1/CTX2/CTX3 · contexto tecnológico opcional.
     O acionador canônico continua sendo `#v32cta`, com o handler que
     `renderBlocks()` lhe atribuiu. Este módulo apenas o embrulha num card de
     ação com título, badge "Opcional" e explicação — e mantém o estado
     aberto/fechado dos grupos do editor legível por forma e por TEXTO, não só
     por cor.
     ========================================================================== */
  var P52_CTX_TITLE = "Adicionar contexto tecnológico";
  var P52_CTX_TITLE_EDIT = "Editar contexto tecnológico";
  var P52_CTX_EXPLAIN = "Refina e contextualiza recomendações; não altera perguntas, respostas ou pontuação.";

  function p52DecorateContextCta(panel) {
    var box = panel.querySelector(".v32-cta-box");
    if (!box || box.querySelector(".p52-ctxcard-head")) return;
    var cta = box.querySelector("#v32cta");
    var head = el("div", { "class": "p52-ctxcard-head" });
    var h = el("h3", { "class": "p52-ctxcard-title" },
      cta && /editar/i.test(txt(cta)) ? P52_CTX_TITLE_EDIT : P52_CTX_TITLE);
    head.appendChild(h);
    head.appendChild(el("span", { "class": "p52-badge", "data-p52-badge": "optional" }, "Opcional"));
    box.insertBefore(head, box.firstChild);
    var explain = el("p", { "class": "p52-ctxcard-explain" }, P52_CTX_EXPLAIN);
    box.insertBefore(explain, head.nextSibling);
    box.classList.add("p52-ctxcard");
    if (cta) cta.classList.add("p52-btn-strong");
  }

  /* Resumo de completude quando já houver contexto declarado: consome os
     blocos que o owner legado já imprimiu (`#v32decl .v32-decl-row`), sem
     recontar capability alguma a partir do modelo. */
  function p52ContextSummary(panel) {
    var old = panel.querySelector('[data-p52="ctx-summary"]');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var decl = panel.querySelector("#v32decl");
    if (!decl) return;
    var rows = decl.querySelectorAll(".v32-decl-row");
    var p = el("p", { "class": "p52-ctxsum", "data-p52": "ctx-summary" },
      rows.length
        ? rows.length + (rows.length === 1 ? " capability declarada nesta sessão." : " capabilities declaradas nesta sessão.")
        : "Nenhuma capability declarada nesta sessão.");
    decl.parentNode.insertBefore(p, decl);
  }

  /* Estado aberto/fechado dos grupos do editor.
     REV A · CTX-REV-A §2.4: o pill textual ABERTO/FECHADO foi REMOVIDO. O
     estado passa a ser comunicado por caret, por `aria-expanded` explícito no
     summary, pela borda/fundo do grupo aberto e pelo conteúdo visível — quatro
     canais, nenhum deles exclusivamente cromático. O destaque do grupo ativo
     permanece; some apenas a etiqueta redundante. */
  function p52DecorateContextGroups(root) {
    var groups = root.querySelectorAll("details.v32-group, details.v32-siggroup");
    for (var i = 0; i < groups.length; i++) {
      var dt = groups[i], sum = dt.querySelector("summary");
      if (!sum) continue;
      dt.setAttribute("data-p52-grp", dt.open ? "open" : "closed");
      sum.setAttribute("aria-expanded", dt.open ? "true" : "false");
      var stale = sum.querySelector('[data-p52="grp-state"]');
      if (stale && stale.parentNode) stale.parentNode.removeChild(stale);
      /* capabilities do grupo ativo agrupadas visualmente */
      var body = dt.querySelector('[data-p52="grp-body"]');
      if (!body) {
        var moved = [], c = sum.nextSibling;
        while (c) { var nx = c.nextSibling; moved.push(c); c = nx; }
        if (moved.length) {
          body = el("div", { "class": "p52-grp-body", "data-p52": "grp-body" });
          for (var m = 0; m < moved.length; m++) body.appendChild(moved[m]);
          dt.appendChild(body);
        }
      }
    }
  }

  /* ==========================================================================
     CTX-REV-A §2.1 · duas regiões de primeiro nível.
     Capabilities de segurança e Ambiente/condicionantes deixam de ser uma
     lista contínua. Os grupos são os MESMOS nós do owner congelado, apenas
     agrupados sob dois cabeçalhos com uma linha de orientação cada. A ordem de
     leitura, o teclado e o mobile são preservados: são dois painéis
     sequenciais, não abas que escondem conteúdo.
     ========================================================================== */
  function p52ContextRegions(ed) {
    if (!ed) return;
    /* Convergência obrigatória: este decorador roda também sob MutationObserver.
       Se as regiões já estão montadas e cobrem os mesmos grupos, NÃO tocar no
       DOM — caso contrário cada passagem geraria uma mutação que dispararia a
       passagem seguinte, indefinidamente. */
    var mounted = ed.querySelectorAll(":scope > .p52-ctxregion");
    var loose = ed.querySelectorAll(":scope > details[data-gid]");
    if (mounted.length && !loose.length) return;
    if (!loose.length) return;

    p52Unwrap(ed, ".p52-ctxregion-body");
    p52DropOwn(ed, ":scope > .p52-ctxregion");

    var byGid = {}, i;
    var groups = ed.querySelectorAll(":scope > details[data-gid]");
    for (i = 0; i < groups.length; i++) byGid[groups[i].getAttribute("data-gid")] = groups[i];

    var errs = ed.querySelector(".v32-errors");
    var acts = ed.querySelector(".v32-actions");
    var stop = errs || acts || null;

    for (var r = 0; r < P52_CTX_REGIONS.length; r++) {
      var def = P52_CTX_REGIONS[r], found = [];
      for (i = 0; i < def.gids.length; i++) if (byGid[def.gids[i]]) found.push(byGid[def.gids[i]]);
      if (!found.length) continue;
      var reg = el("section", {
        "class": "p52-ctxregion", "data-p52": "ctx-region", "data-p52-region": def.key,
        "aria-labelledby": "p52-ctxreg-" + def.key + "-h"
      });
      var h = el("h4", { "class": "p52-ctxregion-title", id: "p52-ctxreg-" + def.key + "-h" });
      h.appendChild(el("span", { "class": "p52-ctxregion-num", "aria-hidden": "true" }, String(r + 1)));
      h.appendChild(el("span", { "class": "p52-ctxregion-name" }, def.title));
      reg.appendChild(h);
      reg.appendChild(el("p", { "class": "p52-ctxregion-lead" }, def.lead));
      var body = el("div", { "class": "p52-ctxregion-body" });
      for (i = 0; i < found.length; i++) body.appendChild(found[i]);
      reg.appendChild(body);
      if (stop) ed.insertBefore(reg, stop); else ed.appendChild(reg);
    }
  }

  /* ==========================================================================
     CTX-REV-A §2.2/§2.3 · ajuda por capability.
     Controle `i` ao lado do nome, com nome acessível próprio, associado ao
     texto por `aria-describedby`. Funciona por mouse (hover), teclado (foco),
     clique/toque e fecha com `Esc`. Um popover aberto por vez. O texto vem do
     glossário fechado desta camada; capability sem verbete não ganha controle.
     Nada aqui associa produto a capability.
     ========================================================================== */
  var p52OpenHelp = null;
  /* ERRATA DA AUDITORIA EXTERNA · §6.1 · `Esc` devolve o foco ao controle (é o
     comportamento correto de retorno de foco), e o controle abre no `focus`.
     As duas regras corretas, juntas, reabriam o popover que o usuário acabara
     de fechar — o `Esc` não fechava nada de fato. A supressão dura apenas o
     ciclo de eventos do retorno de foco. */
  var p52NoReopen = false;
  function p52CloseHelp() {
    if (!p52OpenHelp) return;
    p52OpenHelp.btn.setAttribute("aria-expanded", "false");
    p52OpenHelp.pop.hidden = true;
    p52OpenHelp = null;
  }
  function p52ShowHelp(btn, pop) {
    if (p52NoReopen) return;
    if (p52OpenHelp && p52OpenHelp.btn === btn) return;
    p52CloseHelp();
    btn.setAttribute("aria-expanded", "true");
    pop.hidden = false;
    /* o instante da abertura é o que separa "o toque abriu agora" de "o
       usuário tocou de novo para fechar" — ver o tratamento de toque em
       `p52WireEmblem`. */
    p52OpenHelp = { btn: btn, pop: pop, t: Date.now() };
  }
  /* Constrói um controle de ajuda `i` e o seu popover, associados por
     `aria-describedby`, com o mesmo contrato de teclado/mouse/toque/Esc. */
  function p52HelpControl(popId, label, text) {
    var btn = el("button", {
      type: "button", "class": "p52-caphelp-btn", "data-p52": "cap-help",
      "aria-expanded": "false", "aria-describedby": popId,
      "aria-label": "O que é " + label + "? Explicação do campo"
    }, "i");
    var pop = el("div", { id: popId, "class": "p52-caphelp-pop", "data-p52": "cap-help-text", role: "note" }, text);
    pop.hidden = true;
    btn.addEventListener("click", function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      var p = document.getElementById(this.getAttribute("aria-describedby"));
      if (!p) return;
      if (p.hidden) p52ShowHelp(this, p); else p52CloseHelp();
    });
    btn.addEventListener("focus", function () {
      var p = document.getElementById(this.getAttribute("aria-describedby"));
      if (p) p52ShowHelp(this, p);
    });
    btn.addEventListener("blur", function () { p52CloseHelp(); });
    btn.addEventListener("mouseenter", function () {
      var p = document.getElementById(this.getAttribute("aria-describedby"));
      if (p) p52ShowHelp(this, p);
    });
    btn.addEventListener("mouseleave", function () { if (document.activeElement !== this) p52CloseHelp(); });
    return { btn: btn, pop: pop };
  }

  /* REV B §4.1 · ajuda nos campos de arquitetura, nas famílias de ambiente e
     em cada sinal de IA — não só nas capabilities. */
  function p52FieldHelp(ed) {
    if (!ed) return;
    var k, host, made;
    for (k in P52_ARCH_HELP) {
      if (!Object.prototype.hasOwnProperty.call(P52_ARCH_HELP, k)) continue;
      var sel = ed.querySelector("#v32-arch-" + k);
      host = sel ? sel.closest("label") : null;
      if (!host || host.querySelector('[data-p52="cap-help"]')) continue;
      host.classList.add("p52-fieldhelp");
      made = p52HelpControl("p52-archhelp-" + k, txt(host).split("\n")[0].slice(0, 60), P52_ARCH_HELP[k]);
      host.insertBefore(made.btn, sel);
      host.appendChild(made.pop);
    }
    for (k in P52_GROUP_HELP) {
      if (!Object.prototype.hasOwnProperty.call(P52_GROUP_HELP, k)) continue;
      var grp = ed.querySelector('details[data-gid="' + k + '"] > summary');
      if (!grp || grp.querySelector('[data-p52="cap-help"]')) continue;
      made = p52HelpControl("p52-grphelp-" + k, txt(grp).slice(0, 60), P52_GROUP_HELP[k]);
      grp.appendChild(made.btn);
      grp.appendChild(made.pop);
    }
    for (k in P52_SIGNAL_HELP) {
      if (!Object.prototype.hasOwnProperty.call(P52_SIGNAL_HELP, k)) continue;
      if (!P52_SIGNAL_HELP[k]) continue;
      var chk = ed.querySelector("#v32-sig-" + k);
      host = chk ? chk.closest("label") : null;
      if (!host || host.querySelector('[data-p52="cap-help"]')) continue;
      host.classList.add("p52-fieldhelp");
      made = p52HelpControl("p52-sighelp-" + k, txt(host).slice(0, 60), P52_SIGNAL_HELP[k]);
      host.appendChild(made.btn);
      host.appendChild(made.pop);
    }
    /* ======================================================================
       ERRATA DA AUDITORIA EXTERNA · §6.1
       O controle `i` existia em capabilities, campos de arquitetura, dois
       grupos e nove sinais de IA. Faltava em todo o resto: as três famílias
       de capabilities, o grupo de arquitetura, os quatro subgrupos de
       requisitos, catorze sinais, a situação declarada por capability e a
       seção inteira de plataformas e licenciamento — bundles, subscriptions
       e legendas. Tudo passa a usar O MESMO componente: mesmo ícone, mesma
       caixa, mesma tipografia, hover + foco + clique/toque, `Esc` para
       fechar, nome acessível próprio e associação por `aria-describedby`.
       Nenhum `title` nativo é usado como solução.
       ====================================================================== */
    /* subgrupos de requisitos (`data-gid="sig-N"`) */
    for (k in P52_SIGGROUP_HELP) {
      if (!Object.prototype.hasOwnProperty.call(P52_SIGGROUP_HELP, k)) continue;
      var sgrp = ed.querySelector('details.v32-siggroup[data-gid="' + k + '"] > summary');
      if (!sgrp || sgrp.querySelector('[data-p52="cap-help"]')) continue;
      made = p52HelpControl("p52-sggrphelp-" + k, txt(sgrp).slice(0, 60), P52_SIGGROUP_HELP[k]);
      sgrp.appendChild(made.btn);
      sgrp.appendChild(made.pop);
    }
    /* situação declarada, por capability — a opção mais ambígua do editor */
    var press = ed.querySelectorAll('select[id^="v32-pres-"]');
    for (var pi = 0; pi < press.length; pi++) {
      var sel2 = press[pi];
      var lab = sel2.closest ? sel2.closest("label") : null;
      if (!lab || lab.querySelector('[data-p52="cap-help"]')) continue;
      lab.classList.add("p52-fieldhelp");
      made = p52HelpControl("p52-preshelp-" + sel2.id.replace(/^v32-pres-/, ""),
        "Situação declarada", P52_PLAT_HELP["presence"]);
      lab.insertBefore(made.btn, sel2);
      lab.appendChild(made.pop);
    }
    /* plataformas e licenciamento: legendas, plataforma, pacotes e subscriptions */
    [".v32-plat", ".v32-bundles", ".v32-subs"].forEach(function (sel, li) {
      var leg = ed.querySelector(sel + " > legend");
      var chave = "legend:" + sel;
      if (!leg || !P52_PLAT_HELP[chave] || leg.querySelector('[data-p52="cap-help"]')) return;
      var feito = p52HelpControl("p52-leghelp-" + li, txt(leg).trim().slice(0, 60), P52_PLAT_HELP[chave]);
      leg.appendChild(feito.btn);
      leg.appendChild(feito.pop);
    });
    var alvos = [];
    var fgt = ed.querySelector("#v32-plat-fgt");
    if (fgt) alvos.push({ el: fgt, id: "p52-plathelp-fgt", chave: "plat:fgt" });
    var buns = ed.querySelectorAll('input[name="v32-bundle"]');
    for (var bi = 0; bi < buns.length; bi++)
      alvos.push({ el: buns[bi], id: "p52-bundlehelp-" + (buns[bi].value || "none"),
                   chave: "bundle:" + buns[bi].value });
    var subs = ed.querySelectorAll('input[id^="v32-sub-"]');
    for (var si = 0; si < subs.length; si++)
      alvos.push({ el: subs[si], id: "p52-subhelp-" + subs[si].id.replace(/^v32-sub-/, ""),
                   chave: "sub:" + subs[si].id.replace(/^v32-sub-/, "") });
    for (var ai = 0; ai < alvos.length; ai++) {
      var alvo = alvos[ai];
      var lb = alvo.el.closest ? alvo.el.closest("label") : null;
      if (!lb || !P52_PLAT_HELP[alvo.chave] || lb.querySelector('[data-p52="cap-help"]')) continue;
      lb.classList.add("p52-fieldhelp");
      made = p52HelpControl(alvo.id, txt(lb).trim().slice(0, 60), P52_PLAT_HELP[alvo.chave]);
      lb.appendChild(made.btn);
      lb.appendChild(made.pop);
    }
    p52InstallHelpEscape();
  }

  function p52CapHelp(ed) {
    if (!ed) return;
    p52FieldHelp(ed);
    var caps = ed.querySelectorAll(".v32-cap[id^='v32-cap-']");
    for (var i = 0; i < caps.length; i++) {
      var cap = caps[i];
      var capId = cap.id.replace(/^v32-cap-/, "");
      var text = P52_CAP_HELP[capId];
      if (!text) continue;
      var head = cap.querySelector(".v32-cap-head");
      var name = cap.querySelector(".v32-cap-name");
      /* ERRATA DA AUDITORIA EXTERNA · a guarda de idempotência tem de ser do
         controle DA CAPABILITY. Depois que a §6.1 passou a decorar também a
         "Situação declarada" — que vive no MESMO cabeçalho —, uma guarda
         genérica por `[data-p52="cap-help"]` encontrava o controle vizinho e
         impedia a criação do controle da capability. `[data-cap]` é o que
         distingue um do outro. */
      if (!head || !name || head.querySelector('[data-p52="cap-help"][data-cap]')) continue;

      var popId = "p52-caphelp-" + capId;
      var btn = el("button", {
        type: "button", "class": "p52-caphelp-btn", "data-p52": "cap-help",
        "data-cap": capId, "aria-expanded": "false", "aria-describedby": popId,
        "aria-label": "O que é " + txt(name) + "? Explicação da capability"
      }, "i");
      var pop = el("div", { id: popId, "class": "p52-caphelp-pop", "data-p52": "cap-help-text", role: "note" }, text);
      pop.hidden = true;

      btn.addEventListener("click", function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        var p = document.getElementById(this.getAttribute("aria-describedby"));
        if (!p) return;
        if (p.hidden) p52ShowHelp(this, p); else p52CloseHelp();
      });
      btn.addEventListener("focus", function () {
        var p = document.getElementById(this.getAttribute("aria-describedby"));
        if (p) p52ShowHelp(this, p);
      });
      btn.addEventListener("blur", function () { p52CloseHelp(); });
      btn.addEventListener("mouseenter", function () {
        var p = document.getElementById(this.getAttribute("aria-describedby"));
        if (p) p52ShowHelp(this, p);
      });
      btn.addEventListener("mouseleave", function () {
        if (document.activeElement !== this) p52CloseHelp();
      });
      /* o controle entra DENTRO do nome: com nomes longos, um irmão solto no
         cabeçalho empurrava o seletor de situação para a linha seguinte e a
         grade do editor perdia o alinhamento. O popover fica no cabeçalho,
         que é o contexto de posicionamento. */
      name.appendChild(btn);
      head.appendChild(pop);

      /* REV B §3.5 · a distinção entre a nota DO ITEM e o contexto DA
         capability precisa estar explícita ao lado do campo geral. */
      var drv = cap.querySelector(".v32-driver-lab");
      if (drv && !drv.querySelector('[data-p52="cap-help"]')) {
        drv.classList.add("p52-fieldhelp");
        var dh = p52HelpControl("p52-drvhelp-" + capId, "Contexto complementar da capability",
          "Use para registrar motivação, exceção ou restrição que se aplique à capability como um todo. " +
          "Observações específicas de um produto devem ficar no campo Notas daquele item.");
        var input = drv.querySelector("input");
        if (input) drv.insertBefore(dh.btn, input); else drv.appendChild(dh.btn);
        drv.appendChild(dh.pop);
      }
    }
    p52InstallHelpEscape();
  }
  var p52HelpKeyInstalled = false;
  function p52InstallHelpEscape() {
    if (p52HelpKeyInstalled) return;
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && p52OpenHelp) {
        var b = p52OpenHelp.btn;
        p52CloseHelp();
        p52NoReopen = true;
        try { if (b && typeof b.focus === "function") b.focus(); }
        finally { p52NoReopen = false; }
      }
    });
    p52HelpKeyInstalled = true;
  }

  /* O editor é repintado por `paintEditor()` sem passar por `render()`; um  /* O editor é repintado por `paintEditor()` sem passar por `render()`; um
     observador estreito reaplica a decoração de estado quando isso acontece.
     Ele NÃO reordena, NÃO cria campo e NÃO toca em valor algum. */
  function p52InstallContextObserver() {
    if (p52ObserverInstalled || typeof MutationObserver !== "function") return;
    var busy = false;
    var obs = new MutationObserver(function () {
      if (busy) return;
      busy = true;
      try {
        var ed = document.getElementById("v32editor");
        if (ed) { p52ContextRegions(ed); p52DecorateContextGroups(ed); p52CapHelp(ed); }
        var panel = document.getElementById("v32panel");
        if (panel) p52DecorateContextCta(panel);
      } catch (e) { p52Errors++; console.error("P52 ctx observer:", e.message); }
      finally { busy = false; }
    });
    /* O editor é pintado SÍNCRONAMENTE pelo handler congelado de `#v32cta`.
       O MutationObserver só entrega no checkpoint de microtarefas, o que
       deixaria o estado dos grupos indecorado durante todo o clique. Um
       listener delegado na fase de BOLHA roda logo após o handler do owner —
       sem substituí-lo, sem cancelar o evento e sem tocar em valor algum. */
    document.addEventListener("click", function (ev) {
      var t = ev && ev.target;
      if (!t || typeof t.closest !== "function" || !t.closest("#v32cta, #v32editor summary")) return;
      try {
        var ed = document.getElementById("v32editor");
        if (ed) { p52ContextRegions(ed); p52DecorateContextGroups(ed); p52CapHelp(ed); }
        var panel = document.getElementById("v32panel");
        if (panel) p52DecorateContextCta(panel);
      } catch (e) { p52Errors++; console.error("P52 ctx click:", e.message); }
    }, false);
    document.addEventListener("toggle", function (ev) {
      var t = ev && ev.target;
      if (!t || t.tagName !== "DETAILS") return;
      if (!has(t, "v32-group") && !has(t, "v32-siggroup")) return;
      try { p52DecorateContextGroups(t.parentNode || t); }
      catch (e) { p52Errors++; console.error("P52 ctx toggle:", e.message); }
    }, true);
    obs.observe(document.body, { childList: true, subtree: true });
    p52ObserverInstalled = true;
  }

  /* ==========================================================================
     P52-RES1 · trilho lateral de navegação.
     Âncoras reais para seções reais da MESMA página. Nenhum conteúdo é
     escondido: o trilho não é um SPA, é um sumário. O item ativo é
     distinguível por forma (marcador), borda, peso e TEXTO ("seção atual"),
     nunca só por cor, e carrega `aria-current="true"`.
     ========================================================================== */
  function p52RailMeta(key) {
    if (key === "target") {
      var n = p52TargetOverrides();
      return n ? (n + (n === 1 ? " prática com alvo" : " práticas com alvo")) : "sem cenário-alvo";
    }
    if (key === "context") {
      var panel = document.getElementById("v32panel");
      var rows = panel ? panel.querySelectorAll("#v32decl .v32-decl-row").length : 0;
      return rows ? (rows + (rows === 1 ? " capability" : " capabilities")) : "opcional";
    }
    if (key === "gaps") {
      var gsec = document.getElementById("p52-sec-gaps");
      var hi = gsec ? gsec.querySelectorAll(".f-tag.sev-a").length : 0;
      var mo = gsec ? gsec.querySelectorAll(".f-tag.sev-m").length : 0;
      if (!hi && !mo) return "";
      return hi + " altos · " + mo + " moderados";
    }
    if (key === "evidence") {
      var res = document.getElementById("p50-results");
      var gate = res ? res.getAttribute("data-p50-gate") : null;
      if (gate === "blocked") return "pendente";
      if (gate === "released") return "suficiente";
      return "";
    }
    return "";
  }

  function p52BuildRail(present, order) {
    var nav = el("nav", { id: "p52-rail", "class": "p52-rail", "aria-label": "Seções do resultado" });
    var list = el("ol", { "class": "p52-rail-list" });
    var seq = order || P52_SECTIONS;
    for (var i = 0; i < seq.length; i++) {
      var s = seq[i];
      if (!present[s.key]) continue;
      var li = el("li", { "class": "p52-rail-item" });
      var a = el("a", {
        id: "p52-railto-" + s.key,      /* identidade estável por seção: o item do
                                           trilho é distinguível no DOM, nas
                                           ferramentas de acessibilidade e nos gates */
        "class": "p52-rail-link",
        href: "#" + secId(s.key),
        "data-p52-rail": s.key
      });
      a.appendChild(el("span", { "class": "p52-rail-mark", "aria-hidden": "true" }, "▸"));
      a.appendChild(el("span", { "class": "p52-rail-label" }, s.title));
      var meta = p52RailMeta(s.key);
      if (meta) a.appendChild(el("span", { "class": "p52-rail-meta" }, meta));
      li.appendChild(a);
      list.appendChild(li);
    }
    nav.appendChild(list);
    return nav;
  }

  function p52SetActive(nav, key) {
    var links = nav.querySelectorAll(".p52-rail-link");
    for (var i = 0; i < links.length; i++) {
      var on = links[i].getAttribute("data-p52-rail") === key;
      var here = links[i].querySelector(".p52-rail-here");
      if (on) {
        links[i].setAttribute("aria-current", "true");
        if (!here) links[i].appendChild(el("span", { "class": "p52-rail-here" }, "seção atual"));
      } else {
        links[i].removeAttribute("aria-current");
        if (here && here.parentNode) here.parentNode.removeChild(here);
      }
      links[i].setAttribute("data-p52-active", on ? "true" : "false");
    }
  }

  function p52WireRail(nav, flow) {
    var links = nav.querySelectorAll(".p52-rail-link");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function (ev) {
        var key = this.getAttribute("data-p52-rail");
        var sec = document.getElementById(secId(key));
        if (!sec) return;
        ev.preventDefault();
        /* foco ANTES da rolagem: mover o foco depois de iniciar um scroll
           suave cancela a rolagem no Chromium e a seção nunca sobe. */
        sec.focus({ preventScroll: true });
        try { sec.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" }); }
        catch (e2) { sec.scrollIntoView(); }
        p52SetActive(nav, key);
      });
    }
    /* scroll manual atualiza o item ativo quando a plataforma oferece
       IntersectionObserver; sem ele, o trilho continua navegável e o estado
       ativo é definido pelo clique — nunca fica mentindo. */
    if (typeof IntersectionObserver !== "function") {
      var f0 = flow.querySelector(".p52-sec");
      p52SetActive(nav, f0 ? f0.getAttribute("data-p52-sec") : P52_SECTIONS[0].key);
      return;
    }
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        var k = entries[e].target.getAttribute("data-p52-sec");
        visible[k] = entries[e].isIntersecting ? entries[e].intersectionRatio : 0;
      }
      var best = null, bestV = 0;
      for (var s = 0; s < P52_SECTIONS.length; s++) {
        var kk = P52_SECTIONS[s].key;
        if (visible[kk] > bestV) { bestV = visible[kk]; best = kk; }
      }
      if (best) p52SetActive(nav, best);
    }, { rootMargin: "-12% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] });
    var secs = flow.querySelectorAll(".p52-sec");
    for (var j = 0; j < secs.length; j++) io.observe(secs[j]);
    var first = flow.querySelector(".p52-sec");
    p52SetActive(nav, first ? first.getAttribute("data-p52-sec") : P52_SECTIONS[0].key);
  }

  /* ==========================================================================
     REV A · desmontagem genérica de invólucro próprio.
     Mesma disciplina do workspace: cada passagem devolve os nós LEGADOS ao pai
     e remove só o que esta camada criou. Sem isto, um render seguinte
     encontraria os nós já embrulhados e duplicaria invólucros.
     ========================================================================== */
  function p52Unwrap(host, wrapperSel) {
    if (!host) return;
    var wraps = host.querySelectorAll(wrapperSel);
    for (var i = 0; i < wraps.length; i++) {
      var w = wraps[i];
      if (!w.parentNode) continue;
      while (w.firstChild) w.parentNode.insertBefore(w.firstChild, w);
      w.parentNode.removeChild(w);
    }
  }
  function p52DropOwn(host, sel) {
    if (!host) return;
    var n = host.querySelectorAll(sel);
    for (var i = 0; i < n.length; i++) if (n[i].parentNode) n[i].parentNode.removeChild(n[i]);
  }

  /* ==========================================================================
     HOME-REV-A · composição de abertura.
     O hero é 7+5: conteúdo, métricas e CTA à esquerda; o emblema dos cinco
     domínios à direita. Ações secundárias (aviso metodológico e CTA de
     contexto) descem para uma faixa organizada abaixo do hero. Nenhum nó
     legado é criado ou removido — só reposicionado.
     ========================================================================== */
  function p52Home(app) {
    var scr = app.querySelector("section.screen");
    if (!scr) return;
    p52Unwrap(scr, ".p52-hero-main, .p52-hero-art, .p52-hero, .p52-home-secondary, .p52-cta-row, .p52-cta-sub");
    p52DropOwn(scr, '[data-p52="home-emblem"], [data-p52="emblem-pop"], [data-p52="home-neutral"]');

    /* REV B · HOME-B §2.3 — o card intermediário repetia o que o rodapé já
       diz. Ele sai do hero; a única informação que só existia nele (o
       framework ser aberto e neutro de fabricante) é preservada no rodapé. */
    var disc = scr.querySelector(".disclaimer");
    if (disc && disc.parentNode) disc.parentNode.removeChild(disc);
    p52FooterNeutrality();

    /* As referências são capturadas ANTES da distribuição: assim que um nó
       entra num contêiner ainda não anexado, `getElementById` deixa de
       encontrá-lo. */
    var start0 = scr.querySelector("#start");
    var ctx0 = scr.querySelector("#ux-addctx") || scr.querySelector("#ux-editctx");
    var imp0 = scr.querySelector("#ses-import-home") || scr.querySelector("#ses-import");

    var kids = Array.prototype.slice.call(scr.children);
    var main = el("div", { "class": "p52-hero-main" });
    var secondary = el("div", { "class": "p52-home-secondary", "data-p52": "home-secondary" });
    var i, n;
    for (i = 0; i < kids.length; i++) {
      n = kids[i];
      (n.id === "ux-home" ? secondary : main).appendChild(n);
    }

    /* REV B · HOME-B §2.4 — os dois caminhos de entrada lado a lado, com a
       MESMA geometria: quickscan em vermelho preenchido, contexto em azul
       preenchido e marcado como opcional. `Importar sessão` logo abaixo. */
    var start = start0, ctxBtn = ctx0, imp = imp0;
    if (start) {
      var row = el("div", { "class": "p52-cta-row", "data-p52": "cta-row" });
      start.parentNode.insertBefore(row, start);
      row.appendChild(start);
      if (ctxBtn) { ctxBtn.classList.add("p52-cta-ctx"); row.appendChild(ctxBtn); }
      if (imp) {
        var sub = el("div", { "class": "p52-cta-sub", "data-p52": "cta-sub" });
        sub.appendChild(imp);
        row.parentNode.insertBefore(sub, row.nextSibling);
      }
    }

    var art = el("div", { "class": "p52-hero-art" });
    var emblem = p52DomainEmblem();
    if (emblem) {
      art.appendChild(emblem);
      /* REV B §2.2 · um popover por domínio, ao lado do emblema */
      for (i = 0; i < 5; i++) {
        var pop = el("div", {
          id: "p52-domhelp-" + i, "class": "p52-emblem-pop",
          "data-p52": "emblem-pop", "data-dom": String(i), role: "note"
        }, P52_DOMAIN_HELP[i]);
        pop.hidden = true;                 /* nasce fechado: ajuda é sob demanda */
        art.appendChild(pop);
      }
    }
    var hero = el("div", { id: "p52-hero", "class": "p52-hero", "data-p52": "hero" });
    hero.appendChild(main);
    hero.appendChild(art);
    scr.appendChild(hero);
    if (secondary.children.length) scr.appendChild(secondary);
    p52WireEmblem(art);
  }

  /* REV B · HOME-B §2.3 — a nota de neutralidade do framework, que só existia
     no card removido, passa a viver uma única vez, no rodapé. */
  function p52FooterNeutrality() {
    var wrap = document.querySelector(".wrap");
    var legal = wrap ? wrap.querySelector("footer .p52-foot-legal") : null;
    var host = legal || (wrap ? wrap.querySelector(":scope > footer") : null);
    if (!host || host.querySelector('[data-p52="home-neutral"]')) return;
    host.appendChild(el("span", { "class": "p52-foot-neutral", "data-p52": "home-neutral" },
      " O SOC-CMM é um framework aberto e neutro de fabricante."));
  }

  /* REV B · HOME-B §2.2 — popover por domínio: hover, foco e clique/toque,
     `Esc` fecha e devolve o foco, um aberto por vez. Nada de `title` nativo. */
  /* ERRATA §3 · ALVO DE ACIONAMENTO UNIFORME.
     Um `<g>` de SVG só responde ao ponteiro onde existe geometria PINTADA: o
     vão entre o disco e o rótulo é buraco. Medido no produto: apontar o rótulo
     "Processos" não abria a ajuda, apontar o mesmo lugar em "Pessoas" abria —
     cinco áreas sensíveis diferentes para cinco nós que deveriam ser iguais.
     Um retângulo transparente sobre a caixa do nó torna a área idêntica para
     os cinco. É alvo de ponteiro, não desenho: não pinta nada. */
  function p52HitArea(g) {
    if (g.querySelector('[data-p52="node-hit"]')) return true;
    var bb;
    try { bb = g.getBBox(); } catch (e) { return false; }   /* sem layout (jsdom): não há o que medir */
    if (!bb || !(bb.width > 0) || !(bb.height > 0)) return false;
    var pad = 5;
    g.insertBefore(svg("rect", {
      "class": "p52-emblem-hit", "data-p52": "node-hit",
      x: (bb.x - pad).toFixed(1), y: (bb.y - pad).toFixed(1),
      width: (bb.width + 2 * pad).toFixed(1), height: (bb.height + 2 * pad).toFixed(1)
    }), g.firstChild);
    return true;
  }

  function p52WireEmblem(art) {
    if (!art) return;
    var nodes = art.querySelectorAll(".p52-emblem-node");
    for (var i = 0; i < nodes.length; i++) {
      var g = nodes[i];
      p52HitArea(g);
      if (g.getAttribute("data-p52-wired") === "true") continue;
      g.setAttribute("data-p52-wired", "true");
      var open = function () {
        var pop = document.getElementById(this.getAttribute("aria-describedby"));
        if (pop) p52ShowHelp(this, pop);
      };
      /* TOQUE: o navegador sintetiza `mouseenter` ANTES do `click` do mesmo
         gesto. Com alternância cega, um toque abria e fechava na sequência —
         medido em contexto com toque: nenhum dos cinco domínios abria no
         celular. O clique vindo de toque, dentro da janela do próprio gesto,
         só ABRE; um segundo toque deliberado fecha. Mouse continua alternando
         como sempre. */
      g.addEventListener("click", function (ev) {
        ev.preventDefault();
        var pop = document.getElementById(this.getAttribute("aria-describedby"));
        if (!pop) return;
        if (pop.hidden) { p52ShowHelp(this, pop); return; }
        var porToque = !!(ev && ev.pointerType === "touch");
        var recente = p52OpenHelp && p52OpenHelp.btn === this &&
                      (Date.now() - (p52OpenHelp.t || 0)) < 500;
        if (porToque && recente) return;
        p52CloseHelp();
      });
      g.addEventListener("mouseenter", open);
      g.addEventListener("focus", open);
      /* o ponteiro que entra no PRÓPRIO popover não é saída: fechar ali era o
         que produzia o pisca-fecha nos nós de baixo. */
      g.addEventListener("mouseleave", function (ev) {
        if (document.activeElement === this) return;
        var pop = document.getElementById(this.getAttribute("aria-describedby"));
        if (pop && ev && ev.relatedTarget && pop.contains(ev.relatedTarget)) return;
        p52CloseHelp();
      });
      g.addEventListener("blur", function () { p52CloseHelp(); });
      g.addEventListener("keydown", function (ev) {
        if (ev.key !== "Enter" && ev.key !== " ") return;
        ev.preventDefault();
        var pop = document.getElementById(this.getAttribute("aria-describedby"));
        if (!pop) return;
        if (pop.hidden) p52ShowHelp(this, pop); else p52CloseHelp();
      });
    }
    var pops = art.querySelectorAll('[data-p52="emblem-pop"]');
    for (i = 0; i < pops.length; i++) {
      if (pops[i].getAttribute("data-p52-wired") === "true") continue;
      pops[i].setAttribute("data-p52-wired", "true");
      pops[i].addEventListener("mouseleave", function (ev) {
        if (p52OpenHelp && document.activeElement === p52OpenHelp.btn) return;
        if (ev && ev.relatedTarget && p52OpenHelp && p52OpenHelp.btn &&
            p52OpenHelp.btn.contains(ev.relatedTarget)) return;
        p52CloseHelp();
      });
    }
    p52InstallHelpEscape();
  }

  /* ==========================================================================
     MAP-REV-A §9.3/§9.4 · área inferior da pergunta.
     Faixa de utilidades em duas colunas — evidência à esquerda, status de
     sessão à direita — e navegação em botões claros logo abaixo. O status é o
     NÓ ORIGINAL do owner de sessão (`#p50-session-status`), apenas movido: não
     existe segundo estado de sessão e export/import não são tocados.
     ========================================================================== */
  function p52QuestionLayout(app) {
    var scr = app.querySelector("section.screen");
    if (!scr) return;
    p52Unwrap(scr, "#p52-qutil");
    var bar = scr.querySelector(".notebar");
    var nav = scr.querySelector(".navrow");
    if (!bar) return;
    var util = el("div", { id: "p52-qutil", "class": "p52-qutil", "data-p52": "question-utilities" });
    bar.parentNode.insertBefore(util, bar);
    util.appendChild(bar);
    var ses = document.getElementById("p50-session-status");
    if (ses) util.appendChild(ses);          /* nó original do owner canônico */
    if (nav) nav.classList.add("p52-qnav");
  }

  /* ==========================================================================
     EXEC-REV-A §5.4 · jornada em faixa e, abaixo, "Para avançar" × "Leitura
     executiva" em 6+6. `.jn-themes` sai de dentro da régua e passa a ser um
     card irmão; a leitura executiva ganha o seu próprio card. Nós originais.
     ========================================================================== */
  function p52ExecPair(sec) {
    var jn = sec.querySelector("#ux-journey");
    if (!jn) return;
    p52Unwrap(jn, ".p52-exec-advance, .p52-exec-reading, .p52-exec-pair");
    var themes = jn.querySelector(".jn-themes");
    var narrative = jn.querySelector(".jn-narrative");
    if (!themes && !narrative) return;
    var pair = el("div", { "class": "p52-exec-pair", "data-p52": "exec-pair" });
    if (themes) {
      var a = el("div", { "class": "p52-exec-advance", "data-p52": "exec-advance" });
      a.appendChild(themes);
      pair.appendChild(a);
    }
    if (narrative) {
      var r = el("div", { "class": "p52-exec-reading", "data-p52": "exec-reading" });
      var prev = narrative.previousElementSibling;
      if (prev && has(prev, "section-title")) r.appendChild(prev);
      r.appendChild(narrative);
      pair.appendChild(r);
    }
    jn.appendChild(pair);
  }

  /* ==========================================================================
     SUFF-REV-A · hierarquia da suficiência por público.
     Gate FECHADO  → painel completo, proeminente, na segunda seção.
     Gate ABERTO   → status compacto na narrativa principal e o painel técnico
                     atrás de um disclosure "Base de evidência".
     O status compacto NÃO é um segundo owner: ele lê os atributos que o painel
     canônico já publica (`data-p50-sufficient`, `data-p50-confirmed`) e a
     presença de déficits que o próprio painel imprime. Nada é recalculado,
     nenhum limiar é declarado aqui e a insuficiência real nunca é escondida.
     ========================================================================== */
  function p52EvidenceBase(suff) {
    if (!suff) return null;
    var box = el("details", {
      id: "p52-evbase", "class": "p52-evbase", "data-p52": "evidence-base",
      "data-p52-suff": "true"
    });
    var sum = el("summary", { "class": "p52-evbase-sum" });
    /* REV B §9 · com o resultado liberado, "suficiência adequada" deixa de ser
       um card de RESULTADO para o cliente. O que fica é a base de evidência da
       sessão, na área interna de relatório, com a contagem que já é publicada
       pelo owner canônico. O gate canônico não muda. */
    sum.appendChild(el("span", { "class": "p52-evbase-k" }, "Base de evidência da sessão"));
    var g = suff.querySelector('[data-p50="suff-global"]');
    var n = g ? g.getAttribute("data-p50-confirmed") : null;
    var deficits = suff.querySelectorAll('[data-p50="suff-deficit"]').length;
    var bits = [];
    if (n !== null && n !== "") bits.push(n + " de " + (typeof QS !== "undefined" && QS ? QS.length : n) + " respostas confirmadas");
    if (!deficits) bits.push("todos os domínios atendem ao mínimo");
    if (bits.length) sum.appendChild(el("span", { "class": "p52-evbase-d", "data-p52": "evidence-detail" }, bits.join(" · ")));
    sum.appendChild(el("span", { "class": "p52-evbase-more", "aria-hidden": "true" }, "detalhes"));
    box.appendChild(sum);
    box.appendChild(suff);                    /* painel canônico, íntegro */
    return box;
  }

  /* ==========================================================================
     DOM-REV-A §7 · barras de maturidade no tab Resumo.
     O comprimento deriva ESTRITAMENTE do score canônico que a linha de domínio
     já publica; `n/d` não vira zero geométrico (barra ausente + rótulo), e um
     zero CONFIRMADO recebe marcador explícito na origem. O alvo, quando
     existe, é lido do atributo que o painel Análise já publicou — nunca
     recalculado aqui.
     ========================================================================== */
  function p52DomainBars(root) {
    var rows = root.querySelectorAll('#p50-panel-resumo [data-p50="results-domain"]');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var old = row.querySelector('[data-p52="dom-bar"]');
      if (old && old.parentNode) old.parentNode.removeChild(old);
      var valueNode = row.querySelector('[data-p50="results-domain-value"]');
      var raw = txt(valueNode);
      var score = /^\d+(\.\d+)?$/.test(raw) ? parseFloat(raw) : null;
      var dom = row.getAttribute("data-dom");

      var wrap = el("span", { "class": "p52-dombar", "data-p52": "dom-bar",
        "data-p52-plotted": score === null ? "false" : "true" });
      var track = el("span", { "class": "p52-dombar-track", "aria-hidden": "true" });
      var ticks = el("span", { "class": "p52-dombar-ticks", "aria-hidden": "true" });
      for (var t = 0; t < 4; t++) ticks.appendChild(el("i", null, null));
      track.appendChild(ticks);
      if (score !== null) {
        var fill = el("span", { "class": "p52-dombar-fill" });
        fill.style.setProperty("--p52-bar-w", (score / 5 * 100).toFixed(2) + "%");
        if (score === 0) fill.setAttribute("data-p52-zero", "true");
        track.appendChild(fill);
        if (score === 0) track.appendChild(el("span", { "class": "p52-dombar-zero" }, "0.0 confirmado"));
      } else {
        wrap.setAttribute("data-p52-unset", "true");
      }
      /* alvo declarado: valor já publicado pelo painel Análise, nunca derivado aqui */
      var ct = dom === null ? null : root.querySelector('[data-p50="ct-row"][data-dom="' + dom + '"]');
      var tv = ct ? ct.getAttribute("data-p50-target") : null;
      if (tv !== null && tv !== "" && score !== null) {
        var mark = el("span", { "class": "p52-dombar-target", "data-p52": "dom-target", "aria-hidden": "true" });
        mark.style.setProperty("--p52-bar-t", (parseFloat(tv) / 5 * 100).toFixed(2) + "%");
        track.appendChild(mark);
        wrap.appendChild(track);
        wrap.appendChild(el("span", { "class": "p52-dombar-tlabel" }, "alvo " + tv));
      } else {
        wrap.appendChild(track);
      }
      if (valueNode && valueNode.parentNode) row.insertBefore(wrap, valueNode);
      else row.appendChild(wrap);
    }
  }

  /* ==========================================================================
     P52-Q2 · rodapé de atribuição como faixa inferior da largura útil.
     O `footer` congelado é um bloco de texto único: atribuição/licença e, após
     um `<br>`, o contato. Para que a faixa possa distribuir os dois lados sem
     tocar em byte algum do texto, o conteúdo é EMBRULHADO — nenhum caractere é
     adicionado, removido ou reordenado, e `textContent` do rodapé permanece
     idêntico. A decoração é idempotente e acontece uma única vez.
     ========================================================================== */
  function p52DecorateFooter() {
    var wrap = document.querySelector(".wrap");
    var foot = wrap ? wrap.querySelector(":scope > footer") : null;
    if (!foot || foot.getAttribute("data-p52-footer")) return;
    var kids = Array.prototype.slice.call(foot.childNodes);
    var br = -1, i;
    for (i = kids.length - 1; i >= 0; i--) if (kids[i].nodeType === 1 && kids[i].tagName === "BR") { br = i; break; }
    if (br < 0) { foot.setAttribute("data-p52-footer", "plain"); return; }
    var legal = el("div", { "class": "p52-foot-legal" });
    var contact = el("div", { "class": "p52-foot-contact" });
    for (i = 0; i < br; i++) legal.appendChild(kids[i]);
    if (kids[br].parentNode) kids[br].parentNode.removeChild(kids[br]);   /* o <br> vira a quebra de coluna */
    for (i = br + 1; i < kids.length; i++) contact.appendChild(kids[i]);
    foot.appendChild(legal);
    foot.appendChild(contact);
    foot.setAttribute("data-p52-footer", "split");
  }

  /* ==========================================================================
     Construção do workspace.
     ========================================================================== */
  function p52BuildWorkspace(app) {
    var screen = app.querySelector("section.screen");
    if (!screen) return;
    var buckets = p52Classify(p52LegacyNodes(screen));

    var ws = el("div", { id: "p52-workspace", "class": "p52-workspace", "data-p52": "workspace" });
    var res = buckets.detail.length ? buckets.detail[0] : null;
    var gate = res ? res.getAttribute("data-p50-gate") : null;

    /* SUFF-REV-A · com o gate ABERTO o painel técnico sai da narrativa
       principal: vira status compacto + disclosure dentro da visão executiva,
       e a seção "Evidência e suficiência" deixa de existir como seção
       independente (o refinamento operacional acompanha o resultado
       detalhado). Com o gate FECHADO nada disso acontece: o painel completo
       permanece proeminente, na segunda seção. */
    var evbase = null;
    if (gate === "released") {
      var keep = [], k2;
      for (k2 = 0; k2 < buckets.evidence.length; k2++) {
        if (buckets.evidence[k2].id === "p50-suff") evbase = p52EvidenceBase(buckets.evidence[k2]);
        else keep.push(buckets.evidence[k2]);
      }
      buckets.evidence = [];
      for (k2 = 0; k2 < keep.length; k2++) buckets.detail.push(keep[k2]);
    }
    if (gate) ws.setAttribute("data-p52-gate", gate);

    var flow = el("div", { id: "p52-flow", "class": "p52-flow" });
    var present = {}, i, k;
    var ordem = p52OrderFor(gate);
    ws.setAttribute("data-p52-order", gate === "blocked" ? "gate-blocked" : "canonical");

    for (i = 0; i < ordem.length; i++) {
      var d = ordem[i], nodes = buckets[d.key];
      if (!nodes || !nodes.length) continue;
      present[d.key] = true;
      var sec = el("section", {
        id: secId(d.key),
        "class": "p52-sec",
        "data-p52-sec": d.key,
        "data-p52-order": String(i + 1),
        tabindex: "-1",
        "aria-labelledby": secId(d.key) + "-h"
      });
      var h2 = el("h2", { "class": "p52-sec-title", id: secId(d.key) + "-h" });
      h2.appendChild(el("span", { "class": "p52-sec-num", "aria-hidden": "true" }, String(i + 1)));
      h2.appendChild(el("span", { "class": "p52-sec-name" }, d.title));
      sec.appendChild(h2);

      if (d.key === "target") sec.appendChild(el("p", { "class": "p52-sec-lead", "data-p52": "target-lead" }, P52_TARGET_LEAD));

      /* Gate FECHADO · ponteiro de navegação para a suficiência, dentro do
         primeiro viewport. É NAVEGAÇÃO, não veredito: não repete a contagem,
         o limiar nem o estado — quem os declara continua sendo o painel de
         suficiência (UI-009A) e o renderer do gate. A visão executiva já diz a
         verdade sozinha ("n/d" + "Cobertura insuficiente"); este link apenas
         encurta o caminho até o que falta. Só existe com o gate fechado. */
      if (d.key === "exec" && gate === "blocked") {
        var jump = el("a", { "class": "p52-gate-jump", "data-p52": "gate-jump", href: "#" + secId("evidence") });
        jump.appendChild(el("span", { "class": "p52-gate-jump-mark", "aria-hidden": "true" }, "▾"));
        jump.appendChild(el("span", null, "Ver o que falta para liberar o resultado"));
        sec.appendChild(jump);
      }

      if (d.key === "gaps") p52BuildGaps(sec, nodes);
      else for (k = 0; k < nodes.length; k++) sec.appendChild(nodes[k]);
      if (d.key === "actions" && evbase) sec.appendChild(evbase);

      /* o título legado que apenas repete o nome da seção vira ruído: some da
         TELA, permanece no DOM e no papel (o print legado imprime `.wrap`). */
      var dup = sec.querySelectorAll(":scope > .section-title");
      for (k = 0; k < dup.length; k++) {
        var e2 = dup[k].querySelector(".eyebrow");
        if (txt(e2 || dup[k]).toLowerCase() === d.title.toLowerCase()) dup[k].classList.add("p52-dup-title");
      }
      if (d.key === "support") {
        sec.setAttribute("data-p52-legacy-scope", "support");
        sec.setAttribute("data-p52-support-cards", String(sec.querySelectorAll(":scope > .apoio-block").length));
      }
      if (d.key === "priorities")
        sec.setAttribute("data-p52-prio-cards", String(sec.querySelectorAll(":scope > .prio-decl").length));
      flow.appendChild(sec);
    }

    ws.appendChild(flow);
    screen.appendChild(ws);
    var nav = p52BuildRail(present, ordem);
    ws.insertBefore(nav, flow);

    var secExec = document.getElementById(secId("exec"));
    if (secExec) p52ExecPair(secExec);
    p52DomainBars(flow);
    p52MarkIcons(flow);

    var ctx = document.getElementById("v32panel");
    if (ctx) {
      p52DecorateContextCta(ctx); p52ContextSummary(ctx);
      p52ContextRegions(document.getElementById("v32editor"));
      p52DecorateContextGroups(ctx); p52CapHelp(ctx);
    }
    p52InstallContextObserver();
    p52TagDomains(flow);
    p52WireRail(nav, flow);
  }

  /* ==========================================================================
     P52-Q3 · evidência como botão secundário evidente.
     O controle canônico continua sendo `#notetgl`, com o rótulo que a Camada
     5.1 já lhe deu. Este módulo só publica o ESTADO em atributo, para que a
     forma (símbolo + / − / ✎) venha do CSS e o nome acessível permaneça
     exatamente o texto do botão — sem segundo controle e sem duplicar rótulo.
     ========================================================================== */
  function p52DecorateEvidence() {
    var t = document.getElementById("notetgl");
    if (!t) return;
    var label = txt(t);
    var state = t.getAttribute("aria-expanded") === "true" ? "open"
      : (/^Editar/i.test(label) ? "filled" : "closed");
    t.setAttribute("data-p52-evidence", state);
    t.classList.add("p52-evidence-btn");
  }

  /* ==========================================================================
     Decorador único registrado no agregador da 5.0.1.
     ========================================================================== */
  /* ==========================================================================
     ERRATA DA AUDITORIA EXTERNA · §6.6 · ÍCONES NAS LISTAS SECUNDÁRIAS

     "Pode fazer sentido — após validação" (`.t-list`) e "Não priorizados
     neste screening" (`.t-details`) listavam soluções SEM o ícone que as
     recomendações principais exibem. O leitor executivo perde a âncora
     visual exatamente onde precisa comparar.

     Fonte do ícone: `productIcon()`, do runtime CONGELADO — a MESMA função
     que monta o tile das recomendações principais. Esta camada não declara
     mapa de produto para asset, não embute base64 e não escolhe artwork:
     apenas consome. Quando o catálogo não tem asset canônico, `productIcon()`
     já devolve o fallback determinístico de iniciais — nunca um ícone
     genérico no lugar de um canônico existente.

     O texto que explica por que o item não foi priorizado e os links oficiais
     permanecem intocados: o nó de texto original é apenas MOVIDO para dentro
     de um corpo, sem reescrita.
     ========================================================================== */
  function p52TItemIcons(root) {
    if (typeof productIcon !== "function" || typeof PRODUCTS !== "object" || !PRODUCTS) return;
    var itens = root.querySelectorAll(".t-list .t-item, .t-details .t-item");
    for (var i = 0; i < itens.length; i++) {
      var it = itens[i];
      if (it.getAttribute("data-p52-titem")) continue;      /* idempotente */
      var b = it.querySelector("b");
      var nome = b ? txt(b).trim() : "";
      /* o id canônico do catálogo congelado: chave direta, ou a chave cujo
         nome de exibição é exatamente este. Nada é adivinhado por similaridade. */
      var id = null, k;
      if (Object.prototype.hasOwnProperty.call(PRODUCTS, nome)) id = nome;
      else for (k in PRODUCTS) {
        if (!Object.prototype.hasOwnProperty.call(PRODUCTS, k)) continue;
        if (PRODUCTS[k] && PRODUCTS[k].n === nome) { id = k; break; }
      }
      if (!id) { it.setAttribute("data-p52-titem", "no-icon"); continue; }
      var body = el("div", { "class": "p52-titem-body" });
      var c = it.firstChild, movidos = [];
      while (c) { movidos.push(c); c = c.nextSibling; }
      for (var m = 0; m < movidos.length; m++) body.appendChild(movidos[m]);
      var tile = el("span", { "class": "icon-tile sm" });
      var img = el("img", { alt: "", src: productIcon(id), "data-p52-icon-src": id });
      tile.appendChild(img);
      it.appendChild(tile);
      it.appendChild(body);
      it.setAttribute("data-p52-titem", id);
    }
  }

  /* ==========================================================================
     ERRATA DA AUDITORIA EXTERNA · M-01/M-03 · HIERARQUIA DE CABEÇALHOS

     O parecer mediu `#app h1 === 0` nas duas telas principais e a pergunta em
     curso renderizada como `<div class="question">`: quem navega por
     cabeçalhos não alcança o conteúdo principal da aplicação. Também mediu um
     salto `h2 → h4` nos cartões de gap.

     Correção mínima e não destrutiva: o nó de título de cada tela recebe
     `role="heading"` com `aria-level="1"`, e os cartões de gap que estavam em
     `h4` sob um `h2` passam a anunciar nível 3. Nenhum seletor é quebrado —
     nenhuma classe, id ou tag é trocada, nenhum atalho é tocado e a aparência
     não muda: só a árvore acessível passa a existir.
     ========================================================================== */
  function p52Headings(host) {
    var tela = p52Screen();
    var h1 = null;
    if (tela === "question") h1 = host.querySelector(".question");
    else if (tela === "results") h1 = host.querySelector(".res-head .score-big, .res-head h2, .res-head .eyebrow");
    else if (tela === "home") h1 = host.querySelector("h1, .hero h2, .hero .eyebrow");
    /* um `h1` por tela: qualquer marcação anterior desta camada é retirada
       antes de marcar o nó corrente (idempotência sob renders repetidos). */
    var antigos = host.querySelectorAll('[data-p52-h="1"]');
    for (var a = 0; a < antigos.length; a++) {
      if (antigos[a] === h1) continue;
      antigos[a].removeAttribute("data-p52-h");
      antigos[a].removeAttribute("role");
      antigos[a].removeAttribute("aria-level");
    }
    if (h1 && h1.tagName !== "H1") {
      h1.setAttribute("role", "heading");
      h1.setAttribute("aria-level", "1");
      h1.setAttribute("data-p52-h", "1");
    }
    /* M-03 · nenhum salto de nível: `h4` de cartão de gap sob `h2` de seção
       anuncia nível 3. A tag permanece `h4` — trocá-la reescreveria a
       superfície congelada e quebraria seletores de gate. */
    var h4s = host.querySelectorAll(".finding h4, .prio-decl h4, .apoio-block h4");
    for (var j = 0; j < h4s.length; j++) {
      if (h4s[j].getAttribute("aria-level") === "3") continue;
      h4s[j].setAttribute("role", "heading");
      h4s[j].setAttribute("aria-level", "3");
      h4s[j].setAttribute("data-p52-h", "3");
    }
  }

  function p52Decor(app) {
    var host = app || document.getElementById("app");
    if (!host) return;
    p52DecorateFooter();
    p52Copy(host);                       /* COPY-B · linguagem de apresentação */
    var screen = p52Screen();
    p52Passes++; p52LastScreen = screen;
    /* ERRATA EXTERNA · §6.6 e M-01/M-03 · aplicados em TODA passagem, antes de
       qualquer retorno antecipado por tela. Ambos são idempotentes. */
    p52TItemIcons(host);
    p52Headings(host);
    if (screen === "results") { p52BuildWorkspace(host); return; }
    var stale = document.getElementById("p52-workspace");
    if (stale && stale.parentNode) stale.parentNode.removeChild(stale);
    if (screen === "home") { p52Home(host); return; }
    if (screen === "question") { p52DecorateEvidence(); p52QuestionLayout(host); return; }
    if (screen === "ctxeditor") {
      var ed = document.getElementById("v32editor");
      if (ed) { p52ContextRegions(ed); p52DecorateContextGroups(ed); p52CapHelp(ed); }
      p52InstallContextObserver();
    }
  }

  function p52Safe(app) {
    try { p52Decor(app); }
    catch (e) { p52Errors++; console.error("P52 workspace:", e.message); }
  }

  if (window.__P50 && typeof window.__P50.registerDecor === "function") {
    window.__P50.registerDecor(p52Safe);
  }

  /* Segunda entrada, DEPOIS de `uxAfterRender()`.
     `window.__uxDecor` é invocado por `renderResults()` — ANTES de
     `uxAfterRender()` gravar `body[data-uxscreen]` e ANTES de o owner
     congelado recriar `#ux-execrow`. Um layout montado só ali ficaria uma
     passagem atrasado a cada transição de tela. O wrapper de `render` segue o
     padrão já estabelecido pelas camadas 4.1 e 5.0: o predecessor é chamado
     SEMPRE e ANTES, e nada do fluxo congelado é substituído. As duas entradas
     chamam o MESMO decorador idempotente. */
  var p52PrevRender = (typeof render === "function") ? render : null;
  if (p52PrevRender) {
    render = function () {
      var r = p52PrevRender.apply(this, arguments);
      p52Safe(document.getElementById("app"));
      return r;
    };
  }

  /* COPY-B no relatório do cliente, na FONTE.
     `buildPrintReport()` é consumido por dois caminhos: `preparePrint()`, no
     `beforeprint`, e diretamente por gates e por `__DEV`. Transformar apenas o
     DOM impresso deixava o segundo caminho com a linguagem antiga — e a
     narrativa da tela e a do papel passariam a divergir. O wrapper aplica a
     MESMA transformação ao HTML devolvido, num nó DESANEXADO: a disciplina de
     não usar `innerHTML` em nó vivo continua valendo, e a guarda de notas do
     usuário continua ativa porque a estrutura está toda ali. */
  var p52PrevBuildPrint = (typeof buildPrintReport === "function") ? buildPrintReport : null;
  if (p52PrevBuildPrint) {
    buildPrintReport = function () {
      var r = p52PrevBuildPrint.apply(this, arguments);
      try {
        if (r && typeof r.html === "string" && /[Mm]andato|charter/.test(r.html)) {
          /* parser INERTE, como a Camada 5.0 já faz para o resolvedor de
             ícones: não executa script, não busca recurso e não escreve em nó
             vivo. A disciplina "zero `innerHTML =` nesta camada" é preservada. */
          var doc = new DOMParser().parseFromString(r.html, "text/html");
          if (doc && doc.body) {
            p52Copy(doc.body);
            r.html = doc.body.innerHTML;
          }
        }
      } catch (e) { p52Errors++; console.error("P52 copy report:", e.message); }
      return r;
    };
  }

  /* O relatório do cliente é montado por `preparePrint()` em `beforeprint`.
     Este listener é registrado DEPOIS e reescreve a mesma linguagem de
     apresentação no papel — sem tocar no anexo de respostas, que é conteúdo
     da sessão. */
  window.addEventListener("beforeprint", function () {
    try { p52Copy(document.getElementById("v32-print-report")); }
    catch (e) { p52Errors++; console.error("P52 copy print:", e.message); }
  });

  window.__P52 = {
    __installed: true,
    sections: function () { return P52_SECTIONS.map(function (s) { return s.key; }); },
    diag: function () {
      return { errors: p52Errors, observer: p52ObserverInstalled, passes: p52Passes, lastScreen: p52LastScreen };
    },
    targetOverrides: p52TargetOverrides,
    copy: p52Copy,
    /* O mapa de apresentação é PÚBLICO e auditável: um gate que compara texto
       canônico com texto exibido aplica a MESMA transformação declarada, em
       vez de aceitar qualquer divergência. */
    copyMap: function () { return P52_COPY.map(function (r) { return [r[0], r[1]]; }); },
    applyCopy: function (v) {
      var o = String(v == null ? "" : v);
      for (var i = 0; i < P52_COPY.length; i++) o = o.split(P52_COPY[i][0]).join(P52_COPY[i][1]);
      return o;
    }
  };
})();
