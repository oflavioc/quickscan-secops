> HISTÓRICO — substituído como gate canônico pela automação Playwright da Phase 4.7.
> Mantido somente para rastreabilidade dos roteiros manuais que originaram os testes automatizados.

# Auditoria visual Chromium · Phase 4.3 (host de auditoria)
Resoluções: 1920x1080 · 1440x900 · 1366x768 · 390x844 — abrir quickscan_secops_soccmm_v3_2_dev.html
## Cenários
V1 Questions — uma pergunta de cada domínio (steps 1/5/8/11/15 via __DEV.gotoStep(n) após responder arq):
   verificar eyebrow + borda lateral na cor do domínio (Negócio roxo · Pessoas verde · Processos teal · Tecnologia azul · Serviços prata).
V2 Priority — responder tudo baixo, 3 seleções: painéis com barra superior/ título na cor do domínio; card selecionado
   mantém identidade do grupo + badge vermelho "Prioridade N"; summary sticky ≥1200px.
V3 Rich results — DIRECT+CONTEXTUAL+VALIDATE+serviços+architecture note+contexto:
   strip executivo (chips de prioridade com accent do domínio + resumo de contexto), badges textuais
   APOIO DIRETO (red) / APOIO CONTEXTUAL (blue) / VALIDAR NO APROFUNDAMENTO (silver) / LEITURA ARQUITETURAL (purple),
   serviços com filete teal, radar com labels dos eixos coloridos.
V4 Legacy/no-context — resultado V3.1.3 + "Não priorizados" em details fechado.
V5 Insufficient — sem score/estágio fabricados.
## Critérios
domínio reconhecível sem dominar conteúdo · red não excessivo · hierarquia em ~5s · zero overflow ·
cards não estreitos · mobile linear · DIRECT/CONTEXTUAL/VALIDATE inequívocos · só paleta oficial/tints · logo intocado.

## Adendo 4.3.0.1 (validar no Chromium)
- Progress nas perguntas: 17 segmentos visuais — 1 Ponto de partida + 5 blocos de 3 na cor do domínio + segmento final vermelho (Prioridade); atual com ênfase,
  futuros esmaecidos. (Invisível nos renders estáticos: o CSS de print legado oculta a progressbox.)
- Radar nos resultados: 460px em ≥1500 / 420px em ≥1200 / 100% mobile; perfil atual em AZUL; labels sem clipping.
- Mobile: "Etapa N de 16 · Domínio".

## Adendo 4.3.0.2 · GATE REAL DO RADAR (obrigatório no Chromium)
No console, na tela de resultados:
  document.querySelector('svg.radar').getBoundingClientRect().width
Esperado: ~460 em 1920 · ~420 em 1440/1366 · ≈ largura útil em 390. Sem overflow horizontal; labels sem clipping.

## Adendo 4.3.1 · Current × Target (Chromium, 4 resoluções)
Cenários: T-V1 current baixo + targets altos nos 5 domínios · T-V2 targets só nas prioridades ·
T-V3 current insuficiente + targets parciais (n/d, sem estágio) · T-V4 targets com habilitadores DIRECT+CONTEXTUAL+VALIDATE.
Critérios: Blue×Green distinguíveis; tracejado perceptível; radar sem poluição; deltas compreensíveis;
disclaimer visível; nenhuma linguagem de garantia; mobile sem overflow.
Preparo rápido no console: __DEV.setTarget('logs',3); __DEV.setTarget('mandate',3); ... e usar os botões da seção.

## Adendo 4.4 · Time Expectations & Operational Refinement (Chromium, 4 resoluções)
Cenários: R-V1 home com os dois tempos · R-V2 conclusão do core com Refinar vs Continuar ·
R-V3 pergunta 1/3 · R-V4 pergunta 3/3 · R-V5 resultado com 3/3 · R-V6 resultado com apenas 1/3.
Critérios: duração perceptível sem dominar; refinement claramente opcional; usuário entende que o score já está
pronto; mobile linear; zero overflow; cores consistentes; nenhuma linguagem sugere que responder mais aumenta maturidade.

## Adendo 4.4.0.1 (Chromium)
Confirmar: home sem ambiguidade 15 vs 16 (KPI "15 + 1 · perguntas + ponto de partida"; lead diferencia ponto de
partida; sem "~10 minutos"); branch com "Core concluído · aprofundamento opcional" e segmento de Prioridade FUTURO;
refinement exclusivamente com 1/3–3/3 (progress principal oculto); "ETAPA FINAL · PRIORIDADE DO NEGÓCIO" aparece
somente na Priority real; CTA "Continuar para a etapa final →"; zero overflow.

## Adendo 4.5 · Maturity Journey & Executive Narrative (Chromium, 4 resoluções)
Cenários narrativos: N-V1 low/no-landscape/no-target · N-V2 mid+priorities+contexto rico · N-V3 target no mesmo
stage (permanência explícita) · N-V4 target em stage superior (condicional) · N-V5 insufficient (sem stage) ·
N-V6 refinement informativo · N-V7 top stage (sem sexto nível).
Critérios: Journey compreensível ≤5s; Current/Next/Target separados (shapes+labels, sem depender de cor);
nenhum stage truncado; narrativa confortável, sem parede de texto nem tom genérico; mobile ladder vertical;
zero overflow; Recommendation Context subordinado à análise, mas acessível.

## Adendo 4.5 · Maturity Journey & Executive Narrative (Chromium, 4 resoluções)
Cenários narrativos: N-V1 low/no-landscape/no-target · N-V2 mid+priorities+contexto rico · N-V3 target no mesmo
stage (permanência explícita) · N-V4 target em stage superior (condicional) · N-V5 insufficient (sem stage) ·
N-V6 refinement informativo · N-V7 top stage (sem sexto nível).
Critérios: Journey compreensível ≤5s; Current/Next/Target separados (shapes+labels, sem depender de cor);
nenhum stage truncado; narrativa confortável, sem parede de texto nem tom genérico; mobile ladder vertical;
zero overflow; Recommendation Context subordinado à análise, mas acessível.

## Adendo 4.6 (Chromium): cenários com FortiGate/FortiClient/FortiMail WSS renderizados onde o ctx os produz
(ex.: plataforma FortiGate declarada; sinais de e-mail → fortimail-wss); conferir novos SVGs ao lado de fallbacks
retidos, wrapping, contraste dark, zero overflow, nenhuma imagem cortada — cards, enablers 18px e PDF 14px.
