# PHASE_5_KICKOFF.md — Quickscan SecOps V3.2 · Fase 5.0 (Assessment Experience)

**Data do bootstrap:** 2026-08-18 · **Workspace:** `C:\Projetos\QuickScan SOC-CMM\phase5`
**Uso:** primeiro documento a ler em qualquer sessão do Claude Code desta fase, junto com CLAUDE.md.

---

## 1 · Estado consolidado do projeto (linha do tempo verificada)

```text
Phase 4.8.0.7 (core):              FROZEN · audit package 625079c4…0ee5b89d · MANIFEST 74/74
Phase 4.9.0-docs.2 (wrapper):      FROZEN WITH NON-BLOCKING CAVEATS · a67b0886…9050e245f
V3.2 RC1 HTML:                     FROZEN · 8d0932e1…1fd85ddb · 578152 bytes
control revision 4:                FROZEN WITH ACCEPTED CAVEATS · 70238769…25636df
Auditoria independente final:      APPROVE WITH ACCEPTED CAVEATS · open blockers: 0
V3.2 Final Release:                aprovada (registro externo) · NÃO publicada
  HTML final:                      quickscan_secops_soccmm_v3_2.html == RC1 byte a byte
  pacote final:                    quickscan_v32_final_release_package.zip · 4203c43a…a7190362
GitHub (release, privado):         oflavioc/quickscan-secops-soc-cmm-v32 · commit 1b9bc63 ·
                                   tag v3.2.0 · workflows Verify frozen V3.2 release: SUCCESS
Deployment:                        NOT PERFORMED · plano: localhost 127.0.0.1:1337 + Tailscale
                                   Serve · readiness: READY WITH PREREQUISITES (autostart Docker
                                   Desktop; BitLocker do D:)
control.5:                         SUPERADO — nunca implementar; ciclo de lint textual encerrado
Riscos aceitos:                    RQ6–RQ8 + ressalvas de RISK_ACCEPTANCE.md
Backlog vivo (não abandonado):     B1 (screenshots SE7/SE8 com modal), B2 (byte-boundary S107/
                                   S112), B3 (formalizar Linux como build canônico)
```

**A Fase 5 NÃO reabre nada disso.** Ela é uma nova linha de desenvolvimento a partir do core
4.8.0.7, com identidade e ciclo de auditoria próprios.

## 2 · Estado da Fase 5.0

- **Especificação:** PHASE 5.0 Assessment Experience Candidate Specification **REV A** — produzida,
  incorporando os achados da auditoria técnica em três níveis de severidade (todos aceitos pelo
  proprietário). **Status: AGUARDANDO AUDITORIA INDEPENDENTE. A fase não está aberta.**
- **Cláusulas-chave introduzidas pela REV A** (referência rápida; o texto normativo é a spec):
  - **UI-009A** — moeda canônica de suficiência (a UI consome, nunca calcula suficiência);
  - **UI-010A** — categoria de estado efêmero derivado de UX (nunca canônico, nunca serializado);
  - **GOV1 / SUF0** — governança da fronteira print/render: render nunca é dono de decisão de
    suficiência; superfícies 4.x congeladas fora do alcance do trabalho 5.0;
  - **UI-033A** — declaração de baseline PT-BR da experiência;
  - **UI-046A** — política de impressão em sessão insuficiente (sem score fabricado no papel);
  - **SESUX1 dividido** — 1A lint estático · 1B texto renderizado/acessível.

## 3 · Decisões de design EM ABERTO (resolver antes ou durante a auditoria da REV A)

```text
D1 · Modelo de interação das perguntas       (pendente — protótipos de UI precedem revisão formal)
D2 · Abordagem de visualização dos gates     (pendente)
D3 · Representação visual de UNSET           (pendente — jamais renderizar como L0/zero)
D4 · Posicionamento do painel NIST CSF       (pendente)
D5 · BRANDING-01                             (pendente)
```

Regra do projeto: prototipagem de UI precede revisão formal de especificação quando há decisão de
design não resolvida. Protótipos não tocam superfícies congeladas e não entram no runtime.

## 4 · Setup do workspace (executar uma vez, no Git Bash)

**Atenção:** o caminho contém espaço — sempre entre aspas. O workspace Git é a subpasta `phase5\`;
os artefatos congelados (core, wrapper, control.4, RC1, handoffs) permanecem na pasta-mãe, FORA do
repositório de dev.

```bash
mkdir -p "/c/Projetos/QuickScan SOC-CMM/phase5"
cd "/c/Projetos/QuickScan SOC-CMM/phase5"

# 1. Verificar identidade do core na pasta-mãe ANTES de extrair
sha256sum "../quickscan_v32_audit_package_4807.zip"
#   → 625079c462be7d44ffd69b1cd85f256382322bd0555ae4b548f21bf30ee5b89d
unzip -q "../quickscan_v32_audit_package_4807.zip" -d .
sha256sum -c MANIFEST.sha256        # 74/74 OK obrigatório

# 2. Baseline verde (no Windows, defina CHROME_PATH para a suíte visual;
#    builds oficiais e clean-rooms permanecem em Linux/WSL — invariante B3)
npm ci --engine-strict
npm run test:all
CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe" npm run test:visual

# 3. Estrutura da fase
mkdir -p specs prototypes docs_phase5
#   → colocar a spec como specs/PHASE_5_0_REV_A.md
#   → colocar CLAUDE.md e este arquivo na raiz

# 4. Git (repo de DEV, separado do repo de release)
git init -b main
git add -A && git commit -m "Phase 5 workspace: pristine core 4.8.0.7 baseline + governance"
# criar repo privado ex.: oflavioc/quickscan-secops-v32-phase5-dev e fazer push
```

Regras de vizinhança: o Git da fase vive SOMENTE em `phase5\` (a pasta-mãe `QuickScan SOC-CMM\`
com os zips congelados fica fora do repo — nunca rodar `git init` na pasta-mãe); repositório irmão
do Aurora (nunca aninhado); nenhum CLAUDE.md genérico na raiz `C:\Projetos`; Aurora usa
8000/8001/5432/6379 — sem interseção; dados de clientes permanecem em `D:\QuickscanData\clients`,
fora deste clone.

## 5 · Primeira sessão do Claude Code

```bash
cd "/c/Projetos/QuickScan SOC-CMM/phase5"
claude
```

Prompt de abertura sugerido:

> Leia CLAUDE.md, PHASE_5_KICKOFF.md e specs/PHASE_5_0_REV_A.md integralmente. Valide o baseline
> (MANIFEST 74/74, engine SHA 9a4a2e67…, suítes congeladas verdes) e reporte com evidência.
> NÃO implemente nada da Fase 5.0 — a REV A aguarda auditoria independente. Tarefa autorizada:
> conduzir a auditoria independente da REV A contra o runtime congelado, classificando achados por
> severidade, verificando consistência das cláusulas UI-009A/UI-010A/GOV1/SUF0/UI-033A/UI-046A/
> SESUX1 com o source real, e listando o que bloqueia a abertura da fase — incluindo as decisões
> D1–D5. Ao terminar, PARE e entregue o relatório.

Dicas de operação no CLI: usar **plan mode** (Shift+Tab) para auditoria/especificação — propõe sem
editar, que é o modo "auditor" do protocolo; uma microfase por sessão, com commit ao final, para o
histórico Git espelhar o faseamento; `/clear` entre tarefas não relacionadas.

## 6 · Sequência canônica quando a fase abrir (após aprovação da REV A)

```text
baseline validation (SHA engine/HTML/M41/MANIFEST) → inspeção de contratos do runtime congelado →
implementação DENTRO da change boundary → mutation testing dos gates novos → regressão completa
incluindo Chromium → clean-room a partir do pacote publicado (Linux) → relatório final citando
evidência de gate para cada PASS → PARAR para auditoria independente
```

## 7 · Critérios de parada imediata (BLOCKERS da fase)

- qualquer necessidade de alterar `engine_v32.js`, scoring, perguntas, domínios, estágios,
  suficiência, findings, Recommendation Context, Target, Refinement, Journey ou Narrative;
- qualquer alteração em superfície 4.x congelada não autorizada pela spec;
- regressão em qualquer suíte congelada;
- UNSET renderizado como zero em qualquer protótipo ou tela;
- score exibido/impresso sem suficiência;
- necessidade de rede, persistência ou autosave.

Em qualquer um: parar, reportar com evidência, aguardar decisão do proprietário.
