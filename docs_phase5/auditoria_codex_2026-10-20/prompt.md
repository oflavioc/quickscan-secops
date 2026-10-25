Você é um auditor independente e adversarial. Faça uma REVISÃO GERAL DE AUDITORIA deste repositório
(QuickScan SecOps SOC-CMM V3.2 — ferramenta de assessment de maturidade de security operations:
HTML único autocontido construído deterministicamente por build_v32_html.py; engine_v32.js congelado;
módulos ui_*.js; pipeline de verificação em .claude/verify/; regras em .claude/rules/; backlog em
.claude/BACKLOG.md). O repositório está no HEAD ba77134 (branch chore/selagem-v3.2.11), candidato à
selagem/release v3.2.11; o registro de selagem é docs_phase5/SELAGEM_V3_2_11.md. Responda em PT-BR.

Você NÃO tem autoridade para alterar nada (sandbox somente-leitura). Não execute comandos que escrevam
na árvore. Pode rodar leituras (git log/show/diff, grep, node --check, python -c de leitura).

Cubra, com evidência arquivo:linha para cada apontamento (apontamento sem cadeia é palpite e deve ser
marcado como tal):
1. PRODUTO — engine_v32.js, build_v32_html.py, ui_*.js/ui_*.css, HTML dev: defeitos funcionais, erros de
   lógica, XSS/innerHTML, dados sensíveis, telemetria/rede (o produto declara zero rede, zero persistência
   de navegador), determinismo do build, acessibilidade/print quando o defeito for objetivo.
2. INVARIANTES (.claude/rules/product-invariants.md, INV-1..10) — procure violações reais no código.
3. GOVERNANÇA — regras R1–R14 em .claude/rules/ vs. o que o código, hooks (.claude/hooks/), pipeline
   (.claude/verify/run.sh, pipeline.yaml, check_*.py) e gates (tests_*.js) de fato fazem: gates
   tautológicos, SKIP silencioso, asserções fracas, contagens pinadas defasadas, hooks contornáveis.
4. REGISTRO DE SELAGEM (docs_phase5/SELAGEM_V3_2_11.md) e README.md — afirmações que o repositório
   não sustenta; números que não batem com `git diff --numstat c1e3649 0bd677c -- engine_v32.js
   build_v32_html.py quickscan_secops_soccmm_v3_2_dev.html 'ui_*.js' 'ui_*.css'`.
5. BACKLOG (.claude/BACKLOG.md) — achados marcados `resolvido` cujo defeito ainda existe no código;
   achados `aberto` já corrigidos; o que falta registrar. NÃO reporte como defeito o que
   .claude/rules/design-decisions.md lista como decisão confirmada.
6. SEGURANÇA DO REPO — segredos, dados de cliente, binários indevidos, dependências (package.json),
   workflows do GitHub (.github/workflows/).

Formato da resposta final (markdown):
- Sumário executivo (10 linhas): o produto está pronto para selar? Riscos em ordem de severidade.
- Tabela de achados: id (CX-nn) · severidade (bloqueante/alta/média/baixa) · arquivo:linha · descrição ·
  como reproduzir/verificar · recomendação. Separe "confirmado por execução" de "lido, não executado".
- O que você NÃO conseguiu verificar e por quê.
- Pontos fortes objetivos (curto).
Seja exaustivo mas não invente: prefira menos achados com cadeia a muitos sem.
