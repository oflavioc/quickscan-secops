# Changelog · Quickscan V3.2
## Phase 3.2.1 · Recommendation UI Conformance Patch
- **Registry fix (autorizado):** `soc-governance.landscapeEnabled` corrigido de `true` para `false`,
  aderindo à matriz aprovada (governança é avaliada pelo SOC-CMM; não é camada de tecnologia declarável).
- **Decisão explícita — `knowledge-management.landscapeEnabled=true` MANTIDO:** a especificação
  posterior da UI (Milestone 3.1, grupos do editor) lista Knowledge Management no grupo
  SOC & Operations do Landscape; plataformas de gestão de conhecimento/runbooks são tecnologia
  declarável. Divergência da matriz original registrada aqui, não silenciada.
- **Ajuste de fixture (consequência do registry fix):** os testes M76/M83 usavam
  `TECH_LANDSCAPE["soc-governance"]=NONE` apenas como gatilho de saída do legacyMode; o gatilho
  migrou para `knowledge-management` com asserções idênticas. Nenhuma expectativa alterada.
- UI: VALIDATE sempre renderiza card; CONTEXT_NOT_INFORMED com gap/prioridade renderiza
  "Leitura base"; "Por que apareceu" determinístico por card; ofertas × serviços separados;
  enums/IDs internos localizados PT-BR (valores internos intactos).

## Phase 3.2.2 · Recommendation UI Final Conformance
- **Extensão machine-readable (autorizada):** `capabilityRelations[].gapTrigger:boolean` em SERVICES —
  relation não-primary com `gapTrigger:true` dispara por gap de maturidade (managed-service contextual).
  Aplicada a FortiGuard SOCaaS ↔ soc-staffing. Validador exige boolean. Sem hardcode de UI por nome de produto.
- Priority-first universal (todas as apresentações); prioridade excluída das seções subsequentes.
- Capabilities sem Landscape: apresentação "Apoio baseado na maturidade" (nunca pedem contexto), com serviços renderizados.
- serviceHTML exibe "Elegibilidade técnica: …" quando a nota do engine contém ressalva ("validar"); separada do FortiPoints (comercial).
- "Por que apareceu" com rótulos humanos de QS (IDs mantidos apenas internamente) e presente também em cards base/maturidade.
- Ajustes declarados em testes da própria 3.2 (contratos evoluídos por esta fase): V10 (prioridade agora vive em #v32prio), V14 (label humano).

## Phase 3.2.3 · Recommendation Semantics Closure
- **[A]** FortiGuard MDR: relations `continuous-monitoring` e `soc-staffing` como supporting+`gapTrigger:true`.
  Elegibilidade (base EDR compatível/deployment) permanece EXCLUSIVAMENTE em `serviceEligibility()` — sem duplicação no gapTrigger.
- **[B]** Priority-first sem exceção: capability priorizada com `presentationOf()===null` renderiza card neutro
  no bloco de prioridades (classificação + prioridade + "Por que apareceu" + declaração explícita de ausência de oferta direta; zero produto).
- **[C] IMPLEMENTADO** (não pendente): marcador machine-readable `capabilityRelations[].contextTrigger:boolean` em OFFERINGS,
  aplicado somente às mappings CTX congeladas: FortiSOAR↔knowledge-management; FortiSIEM e FortiAI-Assist↔detection-engineering.
  Semântica: itemKind `contextual-support`, nunca DIRECT, nunca "aquisição candidata", nunca aplicado genericamente a supporting,
  nunca em capability suprimida por plataforma. Validador exige boolean.
- **[D]** package: version/description 3.2.3; `engines.node >=20` (compatível com jsdom pinado).

## Phase 3.2.4 · Final CTX Routing Fix
- **[1]** Roteamento CTX: capability TECHNOLOGY_WHITESPACE sem candidato DIRECT real (offering/family)
  e apenas `contextual-support` → supportMode CONTEXTUAL (classification preservada). Com candidato DIRECT
  real, permanece DIRECT. Supporting genérico jamais promovido. P3.2.3-C ampliado; V23/V24/V25 adicionados.
- **[2] Correção do registro anterior:** `engines.node ">=20"` estava INCORRETO — jsdom@30.0.1 declara
  `^22.22.2 || ^24.15.0 || >=26.0.0`. Campo corrigido para a faixa real do jsdom pinado; clean-room
  executado com Node v22.22.2 (satisfaz a faixa) e `npm ci --engine-strict`.

## Phase 3.3.1 · Fortinet Card Iconography (UI-only)
- Registry explícito `ICON_MAP_V32` (itemId→iconKey) separado do engine; assets embutidos de
  `fortinet_icons/` por NOME EXATO (zero fuzzy). Sem asset inequívoco → fallback tipográfico determinístico
  (iniciais, borda, não dependente de cor): endpoint-family, fortimail-wss, fortisat.
- Serviços: IR-family → FortiGuard-IR-Service; MDR → FortiGuard-MDR-Service; advisory/assessments
  (umbrella Labs) → FortiGuard-Labs; SOCaaS → FortiGuard (asset da família de serviços; específico inexistente).
- `contextual-support` usa o ícone do item real mantendo o rótulo contextual; famílias não resolvidas
  usam family icon confirmado (FortiNDR) ou fallback (endpoint-family). Ícones nunca alteram
  ordering/prioridade/supportMode/kind/“Por que apareceu”; payload do RECOMMENDATION_CONTEXT intacto (testado).

## Phase 3.3.1.1 · Icon Provenance & Package Hardening
- **[A] Correção do registro da 3.3.1:** existe SIM asset específico de SOCaaS — `ICONS["SOCaaS"]` do baseline
  congelado. `fortiguard-socaas → SOCaaS`; `iconFor()` resolve `ICONS_V32[key] || ICONS[key]`.
  A afirmação anterior ("específico inexistente") fica retificada.
- **[B]** Proveniência reproduzível: `icons_v32_source/` (somente os 23 SVGs usados), `icons_v32_manifest.json`
  (iconKey/filename/SHA-256) e `generate_icons_v32.py` determinístico com falhas duras
  (source ausente, hash divergente, iconKey duplicado, mapping órfão). Build regenera `ui_icons_v32.js` antes da injeção.
- **[C]** Allowlist explícita de fallbacks (testada; novo fallback = mudança declarada):
  endpoint-family, fortimail-family, identity-family, soc-platform-family, forticlient, fortigate, fortimail-wss, fortisat.
- **[D]** package-lock regenerado refletindo version 3.3.0-dev.3.3.1 e engines.node atual.

## Phase 3.3.2 · V3.2 Print/PDF Report
- Renderer dedicado `#v32-print-report` (invisível em screen): consome SOMENTE dados read-only
  (Camada 1, prioridades, 4 camadas V3.2, buildRecommendationContext recomputado — sem cache, sem scraping).
- Duas rotas: legacy imprime V3.1.3 intocado (container vazio); V3.2 gera relatório completo A–J
  (cabeçalho/disclaimer, resumo com n/d honesto + radar SVG próprio, prioridades na ordem global,
  findings, Landscape declarado com 6 campos escapados, interpretação PT, apoio com semântica congelada
  e "Por que apareceu" SEMPRE visível, Architecture Note só se show=true, tags comerciais existentes, anexo
  das 15 respostas em nova página).
- beforeprint/afterprint com invariante de estado (fullStateJSON byte a byte) e restauração integral;
  draft não salvo BLOQUEIA com a mensagem especificada, sem autosave.
- Print CSS A4 portrait, fundo branco, acento Fortinet, break-inside/break-after controlados, ícones legíveis.
- **Smoke de PDF real — nota de ambiente:** Chromium indisponível no container (pacote snap-only; download
  de browser bloqueado por política de rede). Smoke executado com o report SERIALIZADO via jsdom (mesmo
  renderer/beforeprint) → WeasyPrint → PDFs válidos (%PDF, 3 páginas, conteúdo verificado por pdftotext,
  página 1 inspecionada visualmente: paginação, radar, ícones, sem editor). PDFs publicados junto ao pacote.

## Phase 3.3.2.1 · Print Integration & Evidence Fix
- **[A]** Labels corrigidos: `stageOf(overall).pt` e `DOMS[i].pt` (tabela e radar) — o `.t` anterior era propriedade inexistente.
- **[B]** Anexo restaura `notes[k]` (observações do facilitador) coexistindo com a descrição da alternativa; escapadas como texto.
- **[C]** `v32-print-mode` esconde a `.wrap` inteira — `.top`, `#annex` legado e footer não vazam; legacyMode não aplica a regra.
- **[D]** Botão "Imprimir / salvar em PDF" religado a `safePrint()`: com draft, mensagem e NENHUM print nativo;
  Ctrl+P com draft imprime apenas a página de aviso (`.wrap` oculta) — nunca resultado stale.
- **[E]** Invariante de print inclui `arq` e `notes.slice()`.
- **[F]** Smokes regenerados a partir do DOCUMENTO COMPLETO serializado em estado de print (media print),
  provando ausência de duplicação de header/anexo/footer.

## Phase 3.3.2.2 · Report Content & Radar Closure
- **[A]** Anexo usa a semântica real: `qq.opts[a].t/.d`; NA → "Não sei / precisa validar"; null → "— sem resposta";
  índices internos nunca impressos. (O `qq.lv` anterior não existe em QS — MAP é que usa `lv`.)
- **[B]** Findings completos no PDF: severidade rotulada, `q.lbl`, domínio PT, Evidência declarada
  (`opts[f.lvl].t + d`), Capability a desenvolver (`MAP[id].cap`) e `notes[f.k]`. `f.why` removido (não existe).
- **[C]** Radar sem clipping: viewBox 270×244, anchors start/end/middle por lado e ajuste vertical;
  page 1 do smoke re-inspecionada em PNG.

## Phase 3.3.3 · Entitlements & Commercial Detail (UI/PDF; engine byte-idêntico)
- **[1]** Subscriptions à la carte lidas do registry (SECURITY_SUBSCRIPTIONS/BUNDLES); badge "incluído pelo bundle"
  é somente leitura e NUNCA grava em subscriptions[]; explícitas sobrevivem a troca/remoção de bundle; fg-ot-security
  jamais marcado como incluído em ATP/UTP/ENT (não pertence às composições).
- **[3]** Todos os 22 SESSION_SIGNALS em 4 subgrupos recolhíveis; unchecked = unset; microcopy explicita que sinal ≠ gap.
- **[4]** declaredDriver: campo "Motivo declarado para aprofundamento · opcional"; schema null|{note}; habilitado só com
  presença declarada; presence=UNSET zera o driver (nunca estado órfão invisível ao legacyMode); escapado em screen/PDF.
  *Ajuste declarado de teste:* U18 passou a pré-declarar presence=PRESENT — a regra 4 (desta fase) invalida o cenário
  antigo de driver órfão em UNSET.
- **[5/6]** Bloco terminal "Opções de consumo/licenciamento" nos itens já justificados (programa, elegibilidade PT,
  terminologia FortiPoints/FortiFlex oficial, note); visualmente separado da elegibilidade técnica; sem preço/pontos/SKU;
  FortiMarketplace nunca vira card.
- **[7/8/9]** Resultado e PDF: resumo neutro de entitlements ("não prova implementação/cobertura/maturidade"),
  resumo de sinais true, driver no card; defaults/unset não ocupam espaço; legacy intacto.
### Retificações editoriais (item 11)
- O radar final usa **viewBox 300×244** (o registro anterior de 270×244 refere-se à versão intermediária corrigida na própria 3.3.2.2).
- Contagem de páginas dos smokes NÃO é contrato: registrar "PDF válido A4, conteúdo integral" — paginação é resultado de layout.

## Phase 3.3.3.1 · Final State & Commercial Closure
- **[A]** Editor lê o FortiGate por `declaredPlatforms.find(p=>p.platform==="fortigate")` (antes: `[0]`, que
  confundia a entrada quando outra plataforma vinha primeiro). Escrita já preservava não-editadas.
- **[B]** `commercialHTML` exibe SEPARADAMENTE: programa · elegibilidade · mecanismo (`COMMERCIAL_PROGRAMS[..].mechanism`,
  sempre) · explicação `PROGRAM_EXPLAIN` (quando existir) · note do item — o `||` anterior ocultava o mecanismo.
- **[C]** package-lock regenerado (root 3.3.0-dev.3.3.3.1); description reflete Phase 3 concluída.

## Phase 4.1 · Journey & Layout Foundation (camada UX; engine byte-idêntico)
- **[A]** Home com duas dimensões: CTA primário "Começar o quickscan" intacto + CTA secundário
  "Adicionar contexto tecnológico · opcional" com a microcopy obrigatória. Editor V3.2 REUTILIZADO
  (mesmo controller/schema/estado) com `origin=home|results`; Salvar/Cancelar retornam à origem.
  Após salvar na home: resumo compacto ("Contexto tecnológico adicionado ✓" + capabilities/FortiGate/SaaS/sinais)
  com Editar/Limpar; os três caminhos convergem para o MESMO RECOMMENDATION_CONTEXT (UX3).
- **[B]** Tokens de largura (--content-narrow/medium/wide 860/1120/1320 + --page-gutter clamp) aplicados
  por tela via body[data-uxscreen]; perguntas permanecem narrow; priority medium (wide ≥1500px); results wide;
  mobile ≤720px em uma coluna.
- **[C/D/E]** Prioridades agrupadas pelos 5 DOMS derivados de QS[f.k].dom (sem hardcode), nós ORIGINAIS
  movidos (handlers/aria/teclado intactos); grid 2 colunas em desktop; badges "Prioridade 1/2/3" pela ordem
  global de seleção + resumo persistente (sticky em desktop, acima do continuar em mobile); limite global de 3
  e businessPriority como única fonte de verdade; desmarcação renumera deterministicamente; shortcuts 1–9
  continuam na ordem global de findings.
- **[F]** Inventário silencioso: nenhum produto/candidate durante arq/perguntas mesmo com contexto prévio (UX5).
- **[G]** Revisar respostas e retorno à home preservam o Landscape; Limpar é ação explícita.
  **Decisão registrada para 4.2:** "Reiniciar Quickscan" hoje preserva o Technology Landscape (semântica
  legada intocada); definir na 4.2 se deve também limpá-lo.
- **[H/I]** Camada separada ui_ux_v32.{js,css} + ponte mínima `__V32UI` (openEditor/esc32); suíte UX1–UX16.
  Correção declarada durante a rodada: asserção do UX2 capturava #ux-editctx após sair da home (bug do teste).
- **[J] Nota de ambiente:** Chromium indisponível (snap-only; download de browsers bloqueado). Os 20
  screenshots (5 telas × 1920/1440/1366/390) foram gerados via WeasyPrint como APROXIMAÇÃO ESTÁTICA e
  publicados; a inspeção confirmou grupos/badges/resumo corretos, porém WeasyPrint não avalia media queries
  de viewport nem o flex dos cards legados com fidelidade (sobreposições no render estático). A validação
  final dos critérios visuais do item J requer navegador real — abrir quickscan_secops_soccmm_v3_2_dev.html
  nas quatro resoluções.

## Phase 4.1.1 · Priority Width Closure
- Override screen-specific: `body[data-uxscreen="priority"] .opts{max-width:none;width:100%}` — a Priority
  Screen passa a ocupar a área útil (grid+summary); perguntas permanecem no layout de leitura legado (820px).
- Microcopy: "Limpar contexto" → "Limpar contexto tecnológico" (evita confusão com reiniciar o Quickscan).
- UX17/UX18 provam que o override é específico da priority e não vaza para as perguntas.

## Phase 4.2 · Navigation, Session Semantics & Responsive Controls
- **[A]** Semântica de sessão explícita (resolve a decisão registrada na 4.1): Revisar respostas preserva tudo;
  **Reiniciar avaliação** (botão legado renomeado/religado na camada UX) limpa arq/ans/notes/prioridades, volta à
  home e PRESERVA Landscape/arquitetura/plataformas/sinais; **Nova sessão** (novo, com modal acessível próprio —
  sem confirm() nativo; foco entra no diálogo, Escape cancela, foco retorna à origem) limpa avaliação + todo o
  contexto V3.2, com a microcopy literal exigida.
- **[B]** Home reflete os dois caminhos: resumo permanece após Reiniciar avaliação; home limpa após Nova sessão.
- **[C]** Progress responsivo: desktop intacto (#ptext/#segs); mobile ≤720px usa 'Etapa N de 16'/'Etapa final'
  compacto + barra própria abaixo do header, com aria-label e sem depender de cor.
- **[D/E/F]** Navegação mobile em grid (Continuar dominante em linha própria, Voltar/Pular 44px+, hint de teclado
  oculto, CTAs 100%, anti-overflow); espaçamento da priority ampliado; CTAs da home com toque adequado.
- **[G]** Tab/Enter/Space/atalhos preservados (UX28); foco previsível no modal (UX22).
- **[H]** UX19–UX31: 13 novos testes, 31/31 na suíte UX.
- **[K]** package.json e package-lock sincronizados em 3.4.0-dev.4.2 (corrigida a divergência 4.1.1×3.3.3.1).
- **[I] Nota de ambiente:** o item citava Chromium disponível no ambiente de auditoria — no container de build ele
  segue INDISPONÍVEL (verificado nesta rodada). Publicados: 20 aproximações WeasyPrint (estrutura/modal/microcopy
  confirmadas; media queries de viewport não avaliadas pelo renderizador) + roteiro screenshot_audit_42.md para
  captura real no host de auditoria.

## Phase 4.3 · Brand Color System & Results Visual Hierarchy
- **Cores oficiais Fortinet** (Brand Guidelines Oct/2024 v3.0) como tokens explícitos; o mapeamento específico
  domínio→cor (Negócio roxo · Pessoas verde · Processos teal · Tecnologia azul · Serviços prata) é uma
  **convenção UX do Quickscan** construída apenas com cores oficiais — não uma associação do guideline.
  **Nenhuma regra metodológica mudou** (engine byte-idêntico; UX49 prova contexto == recompute).
- Mapa único domínio→token em 5 regras CSS `[data-dom]` (fonte única); red reservado a identidade/CTA/seleção/
  gaps altos/DIRECT; base dark neutra preservada.
- Perguntas com accent do domínio (borda+eyebrow, sem pintar o card); priority groups com identidade + estado
  global vermelho combinados; radar com labels de eixo identificados por match textual determinístico (cor é reforço,
  nunca única codificação).
- Results: strip executivo (prioridades 1/2/3 com accent do domínio, ordem global preservada; mensagem neutra sem
  seleção) + resumo compacto do contexto (só declarados; UNSET nunca aparece); regiões DIRECT/CONTEXTUAL/VALIDATE/
  ARCH com badges TEXTUAIS + accents (red/blue/silver/purple); serviços com filete teal; commercial detail em
  terceiro nível; "Não priorizados" segue details (legado já era progressive disclosure).
- PDF: apenas identidade cromática alinhada (swatch de domínio na tabela; shade oficial p/ gap moderado); zero
  seção/cálculo novo; legível sem background graphics.
- Ícones oficiais intocados (UX50): cor de domínio pertence ao container.
- **Rodada declarou e corrigiu:** hook `__uxDecor` pós-renderBlocks (decor de resultados agora refaz após save/clear);
  regex do UX32 tolerante a espaçamento; cenário rico com DIRECT/VALIDATE fora das prioridades (VALIDATE requer NA).
- Current×Target NÃO implementado (reservado à 4.3.1), conforme instrução.

## Phase 4.3.0.1 · Progress & Radar Closure
- Progress: 15 segmentos herdam cor do domínio via QS[k].dom + mapa único da 4.3 (zero hardcode); 16º segmento
  "Prioridade do negócio" em Fortinet Red; estados concluído/atual/futuro com ênfases distintas; mobile "Etapa N de 16 · Domínio".
- Radar como elemento principal: 380px base, 420px ≥1200, 460px ≥1500, 100% mobile, overflow:visible —
  geometria/viewBox intactos (labels escalam proporcionalmente; sem clipping novo).
- Preparação Current×Target: perfil ATUAL em Fortinet Blue no screen (Green reservado ao futuro target);
  eixos mantêm as 5 cores de domínio; pontos/matemática idênticos. PDF inalterado nesta rodada.

## Phase 4.3.0.2 · Actual Radar Size Closure
- Sizing real do radar via CONTAINER: `.radar-box` recebe width responsivo (380/420≥1200/460≥1500/100% mobile,
  `flex:0 0 auto`, centrado) e o SVG passa a `width:100%; max-width:none` — o teto legado de 340px deixa de limitar.
  Matemática/viewBox/points intocados: ampliação por escala do SVG (labels proporcionais).
- **Retificação editorial (item E):** o progress tem **17 segmentos visuais** — 1 de Ponto de partida + 15 de
  perguntas + 1 final de Prioridade; o contador do assessment segue "16/16" (partida+perguntas) e a Prioridade é
  etapa final separada. Corrigidas as frases anteriores que chamavam a Prioridade de "16º segmento" (changelog e
  nome do UX53). Nenhuma mudança funcional no progress.
- Gate visual REAL transferido ao Chromium do host: medir `svg.radar.getBoundingClientRect().width`
  (~460px em 1920 · ~420px em 1440/1366 · largura útil em 390, sem overflow). CSS sozinho não é prova.

## Phase 4.3.1 · Current vs Target Maturity Scenario (camada prospectiva; engine byte-idêntico)
- **REGRA FUNDAMENTAL preservada:** tecnologia recomendada nunca aumenta maturidade — fluxo current practice →
  explicit target practice → target scenario → habilitadores JÁ identificados (T8/T16/T17/T18 provam ctx
  byte-idêntico, subconjunto estrito, zero candidate novo, modos intocados).
- TARGET_PROFILE esparso fora do engine (overrides explícitos; nunca escreve em ans; NA proibido como alvo);
  effective = override ?? atual; comparação só com ≥1 override.
- Target confirmado nunca inferior ao atual (selects filtrados + guard); NA/null permitem alvo com
  "Baseline atual não validado" e delta local n/d.
- computeTargetProfile PURO espelhando exatamente SCORES/DOMS/média/arredondamento/suficiência(≥10 && n≥2)/stageOf
  — gate crítico T5: effective==current ⇒ perfil idêntico ao atual (sem refatorar o cálculo legado).
- Editor agrupado por prioridades → oportunidades → demais (details), nos 5 domínios/cores congelados;
  opções exclusivamente de QS[k].opts; nível máximo atual sinalizado.
- Resultado: KPIs atual×alvo (n/d honesto), radar comparativo Blue sólido × Green tracejado com GEOMETRIA
  EXTRAÍDA DOS EIXOS LEGADOS (pontos atuais intocados — T12), legenda textual + aria; deltas por domínio;
  disclaimer metodológico obrigatório em screen e PDF (T25).
- Sessão: Reiniciar avaliação e Nova sessão limpam TARGET_PROFILE (Landscape preservado conforme 4.2);
  revisão de resposta ≥ alvo remove só o override conflitante com aviso persistente até ação do usuário
  (correção declarada: a dupla decoração apagava o aviso — agora acumulado em tgtNotices).
- "Limpar cenário-alvo" com confirmação, tocando somente TARGET_PROFILE (T19).
- PDF: seção "Perfil atual × Cenário-alvo" via hook opcional antes do anexo — ausente sem target (T23/T24);
  legacy print intacto.

## Phase 4.3.1.1 · Target Session State Closure
- `clearTargetProfile()` agora limpa overrides + `tgtNotices` numa rota ÚNICA — Reiniciar avaliação, Nova sessão
  e Limpar cenário-alvo herdam a limpeza pelo mesmo helper (nenhuma rota divergente). Uma Nova sessão jamais
  exibe mensagem originada na sessão anterior (T27/T28); revisão na mesma avaliação preserva o aviso até ação
  explícita (T30), como deliberado na 4.3.1.

## Phase 4.4 · Time Expectations & Operational Refinement
- **Operational Refinement is qualitative and does not affect maturity scoring or Recommendation Context.**
- Camada qualitativa separada: OPERATIONAL_REFINEMENT (0..3|null por tema; null ≠ 0; nunca escreve em ans) +
  registry próprio de 3 perguntas (Métricas/Processos, Aprendizado pós-incidente/Processos, Threat hunting/Tecnologia)
  com textos literais da spec; QS permanece com 15; sem conversão para SCORES, sem média, sem refinementScore.
- Gate absoluto R6–R12: mudar refinement deixa byte-idênticos maturity/domínios/suficiência/estágio/findings/
  businessPriority/Landscape/Recommendation Context/TARGET/Current×Target.
- Fluxo: após a 15ª pergunta, branch "Seu perfil-base está pronto" com Refinar diagnóstico (+3 perguntas · ~2–4 min)
  vs Continuar sem aprofundamento — interceptação SOMENTE na transição natural (showPriority programático intocado);
  telas dedicadas com progress próprio 1..3, accent de domínio congelado, Pular/Continuar para o resultado,
  teclado 1–4 e guard que impede dígitos de vazarem ao togglePriority (bloqueio por TELA renderizada, nunca na priority real).
- Resultado: bloco "Aprofundamento operacional" (N de 3 temas; omite null; Editar aprofundamento preservando
  respostas; CTA discreto quando vazio) — separado de score/findings/ctx/target, preparando a Phase 4.5.
- Home: "Tempo estimado: ~8–12 min · 15 perguntas" + supporting + microcopy do refinement; contexto tecnológico
  "~5–10 min · preencha apenas o que souber" + "Você não precisa preencher tudo..." (UNSET ≠ NONE preservado
  textualmente). Sem cronômetro, sem medição, sem timestamps.
- Sessão: Reiniciar/Nova sessão limpam via clearOperationalRefinement() (helper único); Limpar target e Limpar
  contexto NÃO tocam refinement. PDF: seção pequena só quando informado (tema+resposta+interpretação), rota
  não-legacy; legacy print intocado. getOperationalRefinementSnapshot() read-only exposto para a Phase 4.5.
- Correções declaradas na rodada: avanço de pergunta é via #next (toBranch dos testes); wrapper trata refStage
  numérico como estado dominante (edição a partir do resultado); R24/R30 exigem cenário não-legacy; helpers de
  progress chamados nas telas novas (17º segmento); guard de teclado por tela renderizada (regressão UX28 corrigida).

## Phase 4.4.0.1 · Flow & Copy Semantics Closure
- Home com terminologia única: "15 perguntas de maturidade em conversa guiada, além de um ponto de partida
  inicial"; KPI "15 + 1 · perguntas + ponto de partida"; eyebrow "~10 minutos" removido (estimativa única
  "~8–12 min · 15 perguntas"); retexto via decor UX — baseline M41 intocado.
- Branch não é Priority: label próprio "Core concluído · aprofundamento opcional" (desktop e mobile);
  segmento de Prioridade permanece futuro (ativo somente na priority REAL, por tela renderizada).
- Refinement usa apenas o progress próprio 1/3–3/3 (principal oculto via CSS na tela).
- CTA de saída com destino honesto: "Continuar para a etapa final →" no fluxo (rota 15→branch→refinement→
  Priority→Results inalterada) e "Voltar ao resultado →" na edição pós-resultado.

## Phase 4.5 · Maturity Journey & Executive Narrative
- **Executive Narrative is deterministic, evidence-derived and does not affect maturity scoring or Recommendation Context.**
- Estágios derivados DA PRÓPRIA stageOf() por varredura da escala (representação read-only; zero thresholds
  duplicados); journeyModel com CURRENT ≠ NEXT ≠ TARGET independentes; top stage sem sexto nível ("Foco de
  evolução"); insufficient com "Posicionamento atual: n/d" e sem seta/estágio fabricado.
- Journey visual original do Quickscan (não reprodução do SOC-CMM): trilha horizontal/ladder vertical mobile,
  shapes+labels textuais (● ATUAL blue · ◎ PRÓXIMO silver · ◆ ALVO green) — nunca só cor; microcopy obrigatória
  de não-promessa (próximo estágio e cenário-alvo).
- "Para avançar": máx 3 temas determinísticos priority-first (prioridade∩finding → altos → moderados), frases
  orientadas à prática via mapa fixo — sem produtos.
- buildExecutiveNarrative(snapshot) puro: mesmos inputs → bytes idênticos; snapshot read-only só com dados já
  calculados; 3 parágrafos (posição/implicação/direção); insufficient nunca afirma estágio e SEMPRE inclui
  completar/validar evidências; prioridades na ordem declarada ou frase de ausência; refinement só quando
  informado e nunca como score; Landscape UNSET com frase de não-inferência; target condicional com permanência
  de estágio explicitada; enablers genéricos (itens nominais ⊆ ctx); trace de auditoria por parágrafo (item X).
- Ordem no resultado: summary → Jornada → Leitura executiva → prioridades/contexto → aprofundamento → apoio →
  Current×Target (radar não duplicado). PDF: seção Journey+narrativa idêntica ao screen na rota V3.2; legacy intocado.
- Correções declaradas: insufficient com gaps suprimia a frase obrigatória de validação (agora sempre presente,
  temas em paralelo); cenários de PDF exigem rota não-legacy.
- Nota registrada: passa a haver duas seções "Leitura executiva" (painel legado congelado + narrativa 4.5) —
  título mandatório da spec; consolidação, se desejada, em fase futura.


## Phase 4.5.0.1 · Narrative Semantics, Order & Print Closure
- P1 evidence-derived de verdade: conclusão condicional ao spread (≥0.5: "evolução não uniforme"; <0.5: "perfil
  relativamente equilibrado dentro do estágio atual") — perfis 5.0/5 não recebem mais "estrutura inicial".
- P2 sem impacto não configurado: zero gaps → declaração explícita de ausência; com gaps → contagens que
  "concentram os principais pontos de evolução", sem inferir consistência/previsibilidade da contagem.
- Journey ancorado no .grid2 (resumo → Jornada → narrativa → prioridades); título único na tela ("Leitura
  executiva" só na narrativa; painel legado renomeado via decor para "Síntese do resultado", conteúdo intocado);
  títulos únicos no PDF (section-title suprimido em forPrint).
- Journey print-safe: nodes flex 0 1 110px, nomes com quebra controlada — gate de PIXELS executado via WeasyPrint.
- Refinement em "Para avançar": fallback determinístico (nível ≤1) preenchendo apenas slots livres após
  priorities/altos/moderados; nível alto não gera tema. Changelog: bloco 4.5 duplicado removido.

## Phase 4.5.0.2 · Icon Consistency Closure
- **Target enablers reuse the frozen Recommendation Context icon resolver; iconography does not alter candidate
  membership, order or recommendation semantics.**
- tgtEnablersHTML preserva o id canônico (itemId/serviceId) apenas para apresentação e renderiza cada habilitador
  com o MESMO iconFor() dos cards (oficial → SVG; fallback aprovado → iniciais determinísticas; nenhuma lógica
  paralela, zero fuzzy matching, zero asset novo — hashes do registry travados no N47).
- Hierarquia secundária: ícones 18px (14px no print) via CSS contextual, wrap natural, sem tocar .v32-icon global.
- Invariante provada (N48): ids/nomes/modos/ordem byte-equivalentes ao membership do ctx; ctx byte-idêntico.
- Journey/narrativa/temas/landscape/priorities seguem deliberadamente sem iconografia de produto (item G).

## Phase 4.6 · Official Asset Completeness & Icon Governance
- **Official product assets replace fallbacks only when provenance and semantic identity are unambiguous;
  conceptual family fallbacks remain intentional.**
- Classificação antes de busca (B): 4 entidades concretas avaliadas, 4 famílias presumidas retained.
- Fonte única: biblioteca oficial Fortinet já no projeto (prioridade 1; 1.571 SVGs) — zero fontes externas.
- **8 → 5 fallbacks**: fortigate (FortiGate.svg, nominal exato — não logo corporativo/Fabric), forticlient
  (FortiClient.svg — EMS/EDR têm assets próprios, ambiguidade eliminada) e fortimail-wss
  (FortiMail-Workplace- Security.svg, sic — grafia do pack oficial documentada; FortiMail tradicional/Cloud/SaaS
  NÃO usados) aceitos via pipeline existente (cópia byte-a-byte, manifest com provenance completa, generator
  determinístico regenerado 2× byte-idêntico). fortisat: FALLBACK_RETAINED_NO_ASSET (nenhum asset nominal;
  ícones genéricos de awareness/phishing recusados por G). 4 famílias: FALLBACK_RETAINED_ABSTRACTION.
- Justificativa formal da allowlist publicada em ICON_ASSET_DECISIONS_V32.md; allowlist congelada da suíte I10
  atualizada 8→5 com referência ao documento (mudança declarada — é o entregável da fase).
- Auditoria: mapped 37→40 · fallback 5 · orphan 0 · missing 0; 23 sources pré-existentes com hashes imutáveis
  (A9); iconFor inalterado (mesmo renderer em todas as superfícies); runtime self-contained com 26 data-URIs.
- Painel de consistência óptica (dark/light × 28/18/14px) validado em pixels na rodada.

## Phase 4.6.0.1 · Audit Reproducibility & Provenance Closure
- **Clean-room verdadeiramente self-contained**: fixture versionada `icons_v32_baseline_4502.json` (23 hashes da
  4.5.0.2) substitui o /tmp externo; A9 agora prova baseline imutável + delta autorizado EXATO (=3 assets, total 26).
- A6/A7/A29: o gate EXECUTA o generator duas vezes em mkdtemp (cópia isolada de generator+manifest+sources) e
  exige gen1==gen2==publicado; python3 ausente falha explicitamente. Temp removido ao final.
- Provenance semanticamente exata (E): FortiGate/FortiClient `contentTransformation: none; copied byte-for-byte`
  + `packagingRename: none` (não havia espaço a remover — imprecisão corrigida); FortiMail WSS documenta o rename
  de empacotamento separado do conteúdo (artwork intocado). Campos publishedFilename/publishedSha256 adicionados.
- Trace do archive-fonte (F): Fortinet-Icon-Library.zip SHA-256 real + paths exatos registrados no manifest e no
  ICON_ASSET_DECISIONS_V32.md; nota de nomenclatura Workspace(produto)×Workplace(asset, sic) preservada (H).
- N47 re-travado apenas para o novo hash do manifest (mudança autorizada desta rodada). Decisões semânticas,
  mappings, artwork, allowlist, renderer, CSS e runtime: intocados (G) — HTML idêntico à 4.6 exceto metadados.
- A26–A31 adicionados. Clean-room gate J: extração do audit package publicado em diretório novo →
  `npm ci --engine-strict && npm run test:all` → resultado registrado abaixo.
- Clean-room J executado: diretório novo ← somente o audit package publicado → `npm ci --engine-strict && npm run test:all` → 12 suítes verdes (Node v22.22.2), zero fixture manual, zero estado herdado.

## Phase 4.6.0.2 · Final Package Sync Closure
- Bloqueio único corrigido: o changelog INTERNO do audit package agora é byte-idêntico ao externo — a linha de
  resultado do clean-room da 4.6.0.1 está presente nos dois (o repack anterior fechou o zip antes do append).
  Ordem de empacotamento corrigida: changelog finalizado → MANIFEST → zip.
- Sync gate (C) executado no workspace de staging sobre os quatro arquivos então duplicados. [Retificado na
  4.6.0.3: na distribuição final, somente CHANGELOG_v32.md é duplicado wrapper↔package; ICON_ASSET_DECISIONS_V32.md,
  icons_v32_manifest.json e icons_v32_baseline_4502.json são canônicos SOMENTE dentro do audit package.]
- Runtime, decisões, provenance, generator, testes e engine intocados (D/E) — apenas metadados de release
  candidate (version/lock) e archives.
- Clean-room FINAL (F): diretório novo ← somente o audit package final → `npm ci --engine-strict &&
  npm run test:all` → 12 suítes verdes (Node v22.22.2); o changelog dentro do próprio package contém este
  resultado — verificado por extração.

## Phase 4.6.0.3 · Wrapper Manifest & Package-Boundary Closure
- Duas fronteiras de integridade separadas corretamente: o wrapper contém um MANIFEST PRÓPRIO que valida somente
  seus payloads (quickscan_v32_audit_package.zip + CHANGELOG_v32.md; não lista a si próprio) — `sha256sum -c`
  passa imediatamente após extrair o wrapper, sem extração adicional. O audit package mantém seu MANIFEST interno
  independente validando todo o payload de auditoria (59 arquivos).
- Wrapper/package sync: CHANGELOG_v32.md externo e interno byte-idênticos — único duplicado de conveniência.
  ICON_ASSET_DECISIONS_V32.md, icons_v32_manifest.json e icons_v32_baseline_4502.json permanecem canônicos
  somente dentro do audit package (uma única fonte de verdade, sem duplicatas desnecessárias).
- Cadeia de verificação em duas etapas: WRAPPER MANIFEST → AUDIT PACKAGE ZIP → INNER MANIFEST → SELF-CONTAINED
  TEST SUITE. Two-layer gate F1–F4 executado em diretórios virgens: wrapper OK(2/2) · inner OK(59/59) ·
  changelog externo==interno · clean-room `npm ci --engine-strict && npm run test:all` 12 suítes verdes.
- Runtime/decisões/provenance byte-idênticos à 4.6.0.2; mudanças restritas a changelog (retificação E),
  MANIFEST interno (hash do changelog), version/lock (metadata) e archives.

## Phase 4.7 · Chromium Visual & Print Automation
- Suíte Playwright real substitui os roteiros manuais: 11 gates de tela × 4 breakpoints congelados + 7 gates de
  impressão. Chromium 141 encontrado no ambiente (/opt/google/chrome/chrome) — sem necessidade de download; o gate
  canônico permanece o host do mantenedor (QS_CANONICAL_HOST=1 ativa page count rígido).
- Isolamento de packaging: test:all segue com as 12 suítes e passa SEM browser; test:visual e test:full separados.
- PDF canônico = Chromium print real (preferCSSPageSize + printBackground, A4 595x842pt validado), abordagem híbrida
  (assertions DOM/bbox antes da geração + raster como evidência); printBackground:false como gate adicional.
  pdftoppm/pdftotext/pdfinfo no preflight, sem fallback silencioso para outro motor.
- Fixtures preenchem SOMENTE inputs canônicos; todo derivado passa pelo recompute/render. V12 percorre o fluxo real
  por interação sem __DEV. Journey obtém nomes/estágios de journeyModel/stageOf congelados — o teste não reimplementa.
- Novos gates desta fase: zero requisição de rede externa em runtime e zero console/pageerror com allowlist vazia.
- Correções DECLARADAS, todas na suíte (nenhuma no runtime): #restart existe só nos resultados; guard de skip por
  projeto; media restaurada para screen após page.pdf (print media esconde a UI); setNote recebe índice, não id;
  âncoras do P11 são as do relatório de impressão, não as do DOM de tela.
- Nenhum defeito de runtime encontrado: 51 passed / 0 failed. screenshot_audit_43.md passa a ser histórico.

## Phase 4.7.0.1 · Host Portability & Gate Fidelity Closure
- **Portabilidade corrigida (A):** resolução de browser em 3 níveis (CHROME_PATH → /opt/google/chrome/chrome se
  existir → Chromium gerenciado pelo Playwright, com executablePath omitido); preflight falha com instrução
  explícita quando não há binário. Ambos os caminhos exercitados; download do CDN bloqueado neste container
  (403, host fora da allowlist) — declarado, sem investigação adicional.
- **Fidelidade dos gates:** V2 cobre `arq` e `branch` por navegação real (B); V4 asserta a cor de cada domínio
  contra os custom properties congelados lidos do runtime, sem hex duplicado no teste (C); V6 exige
  `:focus-visible` após Tab e **restauração do foco ao trigger** após Escape (D); V7 inclui **ARCH /
  LEITURA ARQUITETURAL** — quatro regiões, também sem cor (E); V8 valida **PRÓXIMO ESTÁGIO**, top stage sem
  próximo fabricado e ladder mobile com ordem vertical + bboxes disjuntas (F); P5 exige a **string integral** do
  disclaimer metodológico (G).
- Fixture F3/F7 passou a satisfazer as condições canônicas da architecture note (soc-platform NONE + preferência
  unificada) via editor real — necessário para o gate ARCH. Consequência declarada: baseline de page count do P8
  redeclarado de 8 → **12 páginas**.
- Evidência da execução canônica empacotada no audit package (`visual_print_evidence_47.zip`, item H);
  `screenshot_audit_43.md` marcado como HISTÓRICO no próprio arquivo (I); description do package atualizada (J).
- Runtime, decisões e provenance byte-idênticos à 4.7 — só testes, documentação e packaging mudaram.
- Reexecução canônica: `QS_CANONICAL_HOST=1 npm run test:visual` → **51 passed · 0 failed · 21 skipped**.

## Phase 4.7.0.2 · Audit Package Synchronization Closure
- O audit package da 4.7.0.1 foi reconstruído a partir do workspace final porque o handoff anterior continha cópias
  externas atualizadas, mas preservava internamente o package 4.7 stale. Nenhuma lógica, gate ou runtime foi alterado.
- Nota factual da rodada: o zip publicado ao fim da 4.7.0.1 já continha o estado final (version 4.7.0.1, config com
  resolução por existsSync, marcador HISTÓRICO, changelog da fase e a evidência canônica) — a divergência estava na
  montagem do handoff. A correção estrutural adotada elimina a causa: **o audit package passa a ser a única fonte
  canônica** e as cópias externas de playwright.config.js / VISUAL_GATES_V32.md / visual_print_evidence_47.zip
  deixam de ser publicadas soltas (item I, alternativa de menor duplicação). O handoff externo mantém apenas o
  audit package + CHANGELOG_v32.md de conveniência, este exigido byte-idêntico ao interno.
- Manifest interno regenerado somente após todos os arquivos finais estarem no staging; cobre playwright.config.js,
  VISUAL_GATES_V32.md, CHANGELOG_v32.md, screenshot_audit_43.md, package/lock, tests_visual/* e
  visual_print_evidence_47.zip (evidência do run canônico declarado PASS).
- Reprodução a partir do artefato publicado, em diretório virgem, executando SOMENTE o código de dentro do package.

## Phase 4.8 · Session Portability & Evidence Archive
- Session Portability permite exportar e importar snapshots concluídos usando apenas inputs canônicos. O arquivo
  inclui schemaVersion, toolVersion e engine SHA; resultados derivados são sempre recalculados após a importação.
  Não há autosave, browser persistence, cloud sync ou cross-engine migration.
- Módulo isolado ui_session_v32.js com fronteira explícita (captureCanonicalInputs → validate → compatibility →
  applyCanonicalInputsAtomic → recompute) e hooks estruturais por ID — nenhum decorador por texto.
- Build metadata gerada pelo builder (window.__QS_BUILD_META): toolVersion do package.json e engineSha256 dos bytes
  reais de engine_v32.js; nenhuma constante digitada na UI.
- Import atômico: nada muda antes do commit; engine diferente é bloqueado sem opção de forçar; campos derivados,
  chaves desconhecidas e __proto__/prototype/constructor são recusados explicitamente.
- Suíte S1–S40 (28 execuções) + E2E Chromium real de export/import; gates de persistência zero, rede zero e
  ausência dos controles no PDF. Documentação: SESSION_SCHEMA_V32.md e session_roundtrip_report.md; exemplos
  sintéticos publicados (nenhum dado real de cliente).
- Correção declarada na própria implementação 4.8: o uxModal fecha antes de onConfirm, então o label do export era
  perdido — passou a ser capturado ao vivo pelo listener de input.
- Engine byte-idêntico; runtime muda apenas pela UI nova de sessão. Novo HTML SHA registrado no relatório.

## Phase 4.8.0.1 · Strict Schema, Canonical Fidelity & Atomic Import Closure
- Validação do Technology Landscape passa a ser **estrita e aninhada**, com enums derivados em runtime das fontes
  canônicas (V32.ENUMS, CAPABILITIES, ARCHITECTURE_CONTEXT, SIGNAL_IDS, BUNDLES, SECURITY_SUBSCRIPTIONS) — nenhum
  enum redigitado. Chaves extras proibidas em todos os níveis; status/deployment/coverage/coveredCapabilities/
  architectureContext/signals/declaredPlatforms validados por allowlist.
- Fidelidade de campos opcionais corrigida: a captura preservava `?? null`, fabricando valores onde o editor faz
  `delete`. Ausência agora permanece ausência no export e no import (S42).
- Importação realmente atômica: normalização para **candidato isolado completo** antes de qualquer escrita; o
  commit contém apenas atribuições triviais a owners existentes, tornando rollback desnecessário (justificado).
- Invariante de target aplicada na importação: alvo nunca inferior ao nível atual confirmado do documento.
- Gates novos: S41–S52 (U2 real, optional fields, enums estritos, coveredCapabilities, arquitetura, signals,
  plataformas, target invariant, atomicidade, normalização isolada, capability fantasma, object URL assíncrono) e
  Chromium SE4 (oversize real > 1 MiB) e SE5 (XSS real em label/nota/vendor/product/notes/driver, tela e print).
- Harness da suíte de sessão passou a suportar testes assíncronos — o gate de revoke antes passava sem observar.
- Runtime alterado somente dentro da boundary do item 32 (ui_session_v32.js); engine byte-idêntico.
  Novo HTML SHA-256: b17c73adf11bfec5ab37df868fb12db8241620b0efd7d797080c75cee94d81b1

## Phase 4.8.0.2 · Canonical Contract Fidelity & True Atomic Commit Closure
- architectureContext validado a partir de **ARCH_FIELDS** (fonte real da UI, exposta pela ponte __V32UI); enum
  manual divergente eliminado. S53 percorre exaustivamente os 22 valores canônicos; S54 recusa best-of-breed, it,
  ot, local-only, no-restriction. A fixture de teste que usava no-restriction foi corrigida.
- declaredPlatforms alinhado ao owner canônico real: fortigate e **fortisoc**, com **notes** como optional field
  preservado (S55, S56); a normalização passou a copiar todos os PLATFORM_KEYS.
- **Commit verdadeiramente atômico**: uxNewSession removido do commit (resetava e renderizava antes do fim);
  snapshot + try/rollback completo; render somente após o commit. Gates S62 (falha injetada durante o commit,
  rollback provado) e S63 (nenhum render/uxNewSession na janela de commit).
- Reachable-state: solutions só com PRESENT/PARTIAL, solution exige vendor OU product, UNSET proíbe declaredDriver
  (S58–S60). Target passa a exigir nível **estritamente superior** ao current confirmado (S61), em paridade com
  revalidateTargets.
- Self-import property (S57) sobre nove fixtures canônicos. Evidência SE4/SE5 agora produz screenshots reais e o
  claim é verificado pelo próprio gate S64.
- Alteração fora do módulo de sessão: **uma linha aditiva** em ui_v32.js expondo ARCH_FIELDS na ponte já existente
  — indispensável para derivar o contrato sem duplicar enum (justificada no SESSION_SCHEMA_V32.md §11).
  Engine byte-idêntico. Novo HTML SHA-256: 200768ebfea726d9e6d73be4457ca8d68a423881aadf1e5ca1ed434f42588997

## Phase 4.8.0.3 · Canonical Self-Containment, Platform Compatibility & Rollback Proof Closure
- platform × bundle: invariante derivada de BUNDLES[b].appliesTo (a mesma de validateConfigV32) — fortisoc+atp/utp/
  ent agora recusado; matriz table-driven em S65.
- Documento autossuficiente: normalizeSessionDocument não lê mais ARCHITECTURE_CONTEXT global; schema v1 exige o
  bloco de arquitetura COMPLETO (S67 recusa parcial/ausente) e S66/S72 provam que o mesmo arquivo sobre sessões
  prévias diferentes produz estado canônico idêntico.
- Hook de fault injection REMOVIDO do runtime; rollback provado após ESCRITA PARCIAL via monkey-patch do harness
  (S62+S68), com captura do estado parcial; S69 cobre snapshot/restore de todos os owners.
- declaredPlatforms[].notes com tipo estrito (S70) e declaredDriver com shape canônico (S71).
- Evidência SE4 corrigida: screenshot com o modal de oversize ABERTO; capturas pós-fechamento renomeadas para
  SE4-oversize-state-preserved-*; S74/S75 valida existência, tamanho e nomenclatura.
- Self-import expandido (S73). ui_v32.js NÃO foi alterado nesta rodada. Engine byte-idêntico.
  Novo HTML SHA-256: e64e92537a37118ce1e1b8987347ea97c003455552b28862cd0837febbdf53dc

## Phase 4.8.0.4 · Declared Driver Canonical Fidelity & Documentation Consistency Closure
- declaredDriver passa a ser propriedade OBRIGATÓRIA de cada capability; ausência é recusada na validação e a
  normalização não a converte mais em null (missing ≠ null). Gates S76/S77/S78; S71 corrigido — ele próprio
  aceitava ausência como válida.
- Documentação alinhada ao runtime por gates executáveis: S79 valida os exemplos JSON do schema pelo import real
  (o exemplo inline parcial foi substituído pelo exemplo-minimo íntegro), S80 exige 'target estritamente superior'
  + referência a S61, S81 exige o escopo real de atomicidade (recompute/render fora da transação), S82 garante
  tabelas estruturalmente consistentes. A §8.1 duplicada foi unificada na §11.
- Runtime alterado apenas em ui_session_v32.js; engine e demais módulos byte-idênticos.
  Novo HTML SHA-256: ed1f383dfc11a88224482e0f138be0a8b2c68b4046fd59791b1907bc8d9e4eaa

## Phase 4.8.0.5 · Landscape Owner Domain & Plain-Object Strictness Closure
- Dois domínios canônicos separados: keys de technologyLandscape.capabilities derivam de V32.TECH_LANDSCAPE (22),
  enquanto solutions[].coveredCapabilities mantém V32.CAPABILITIES (25). soc-governance/soc-staffing/soc-skills
  (landscapeEnabled:false) passam a ser recusados como entries de Landscape — mesma invariante do engine (L789).
  Gates S83 (positivo exaustivo nos 22 IDs), S84+S89 (recusa com sessão intacta) e S85 (separação provada).
- Containers de mapa: assessment.answers e assessment.notes passam a exigir !Array.isArray — typeof [] === 'object'
  permitia array vazio atravessar o shape gate. S86/S87 cobrem array, primitivos e null; S88 audita oito
  containers do documento e o próprio source (walkers recursivos são exceção declarada).
- Nenhuma mudança de optionalidade: notes segue sparse, overrides seguem sparse, optional fields preservados.
- Runtime alterado apenas em ui_session_v32.js. Novo HTML SHA-256: 7aea50f227d839dce7088be8a1335b7f57d2433470cf0617d22ac15357a364c5

## Phase 4.8.0.6 · Canonical Owner Completeness, Covered-Capability Semantics & Editor Parity Closure
- coveredCapabilities passa a ser validado pelo CONTEXTO canônico, não só pelo domínio do ID: aceito apenas em
  capabilities["soc-platform"] e em solution não-FortiSOC (/fortisoc/i sobre product), com domínio
  Object.keys(V32.CAPABILITIES) menos o sentinel soc-platform — a mesma expressão que monta a grade de checkboxes
  em solRow(). Array vazio, duplicatas, auto-cobertura e IDs inexistentes recusados; "nenhuma cobertura declarada"
  é a AUSÊNCIA do campo. Gates S90/S91/S92; S93 observa a supressão derivada em suppressedByPlatform().
- Falso positivo corrigido e registrado: o fixture rico e os gates S41/S85 — e também S44, não citado na spec —
  declaravam coveredCapabilities numa solution de network-detection, estado que a UI nunca produz. A falha de S57
  (self-import property) confirmou empiricamente o defeito no fixture. S103 trava a regressão da posição inválida.
- Owners completos deixam de ser aceitos como sparse: assessment.answers, technologyLandscape.capabilities,
  architectureContext, declaredPlatforms, signals e operationalRefinement.answers exigem o conjunto integral;
  ausência é recusada em vez de preenchida com null/UNSET/"unset"/[]. normalizeSessionDocument() não fabrica mais
  default algum (requireComplete lança e o import devolve erro sem tocar em owner global). Gates S94–S98, S104.
  Owners genuinamente sparse (assessment.notes, targetProfile.overrides, optional fields de solution,
  declaredPlatforms[].notes) permanecem sparse — S99.
- Paridade de strings com readDraftFromDom(): vendor/product devem ser iguais ao próprio trim (vazio segue válido
  em um dos dois, S58 preservado); coverage/notes trimados e não vazios, com ausência como "não informado";
  status perde "" do domínio do import (STATUS_LABELS da UI intocado); declaredDriver.note exige igualdade com o
  trim, sem trim silencioso na importação. Gates S100/S101/S102.
- Sensibilidade dos gates verificada por mutation testing (posição de coveredCapabilities → S90/S103;
  default fabricado na normalização → S104; status "" reintroduzido → S101), com source restaurado byte-idêntico.
- Runtime alterado apenas em ui_session_v32.js; engine_v32.js e demais módulos byte-idênticos.
  Novo HTML SHA-256: ae425added18006552375e24f1b5412f93b04e597b4c2637d93af3813580c4c3

## Phase 4.8.0.7 · Self-Import Closure, Unicode Scalar Limits & Release Evidence Consistency
- Preflight de exportação (prepareSessionExport): antes de qualquer Object URL, o export monta o documento exato,
  valida com o MESMO validateSessionDocument() do import, serializa e mede o tamanho UTF-8 dos bytes emitidos.
  Documento inválido ou serialização > 1.048.576 bytes NÃO geram arquivo: erro local explícito, nenhum Object URL,
  sessão preservada e nada truncado. Fecha a propriedade normativa de self-import, que era falsa: estados reais de
  UI produziam .json recusado pelo próprio build (campo de 10.001 escalares; serialização de 1.263.070 bytes).
  Gates S106/S107/S112 e Chromium SE6/SE7/SE8.
- Limite de 10.000 passa a contar VALORES ESCALARES Unicode (code points), não code units UTF-16. Fonte única:
  scalarLen() + isWellFormedUnicode() via strFieldError(), aplicada a toda string importada — incluindo metadata
  de raiz (toolVersion, engineSha256, createdAt). Emoji astral conta 1; sequências combinantes contam pelos
  escalares constituintes; surrogate desemparelhado é recusado como Unicode não canônico; sem normalização nem
  truncamento silencioso. label recebeu bound estrito de 200 escalares provado pelo exporter. Gates S105/S108.
- Defeito adicional corrigido: buildSessionDocument() truncava o label com String.slice(0,200) (code units) e
  podia partir um par surrogate, emitindo label malformado que o próprio import recusaria. sesLabel() trunca por
  escalares.
- Unicidade em declaredPlatforms: platform repetida e subscriptions repetidas são recusadas antes do commit. A UI
  monta subscriptions por Object.keys(...).filter (únicas por construção) e reconstrói a lista com no máximo uma
  entrada por plataforma; deriveLicensedContext() deduplica via Set, logo nenhum contrato depende de repetição.
  Gate S111, com ui_v32.js/engine_v32.js como oracle.
- Coerência de release/evidência: package description, toolVersion dos exemplos sintéticos, linha de runtime do
  schema e topo do relatório sincronizados com 3.4.0-dev.4.8.0.7; o bloco JSON inline do schema passou a ser
  derivado do arquivo publicado exemplo-minimo.json com igualdade profunda exigida (S110); a proveniência falsa
  "gerado pelo próprio build" foi substituída pelo mecanismo real (o builder não emite esses arquivos). S109/S110.
- Novo arquivo de evidência visual_print_evidence_487.zip (SE6/SE7/SE8 nos dois breakpoints + PDFs SE3),
  verificado por S113.
- Infraestrutura: test:session passou a usar --max-old-space-size=3072 (acúmulo de janelas jsdom estourava o heap).
  Nenhum gate foi enfraquecido.
- Runtime alterado apenas em ui_session_v32.js; engine_v32.js e demais módulos byte-idênticos.
  Novo HTML SHA-256: 8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb
