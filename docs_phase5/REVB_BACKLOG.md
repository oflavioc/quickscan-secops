# REV B · BACKLOG DE CANDIDATOS — Quickscan SecOps SOC-CMM V3.2 · Fase 5.0

**Arquivo:** `docs_phase5/REVB_BACKLOG.md`
**Propósito:** registro versionado dos itens decididos ou propostos em sessões de apoio que DEVEM ser considerados na montagem do mandato da REV B. Este arquivo não é a spec: é insumo. A REV B permanece sendo autorada pelo proprietário, com numeração final sua.
**Status:** micro-fase UNSET concluída e aprovada (parecer de par fechado em 2026-08-18, com UG13 incluído); baseline da phase5 adotado. Pronto para montagem do mandato da REV B a partir das fontes da seção 1.
**Proveniência:** decisões registradas em sessão de apoio de 2026-08-18, sobre o baseline congelado `runtimeCore 3.4.0-dev.4.8.0.7` (engine `9a4a2e67…`, HTML `8d0932e1…`). Afirmações sobre o source citadas abaixo foram verificadas contra o core extraído (arquivo:linha indicados); o restante é registro de decisão.

---

## 1 · Composição do mandato da REV B (lista de fontes)

O mandato da REV B, quando aberto, deve ser montado a partir de — e somente de:

1. **Seção 8 do `docs_phase5/AUDITORIA_REV_A.md`** — lista fechada de 11 itens de remediação (blockers B-1..B-6 e achados aceitos);
2. **Achados A/M/L aceitos** da mesma auditoria;
3. **Decision log** (seção 2 deste arquivo);
4. **Resultado da micro-fase UNSET** — `docs_phase5/MICROFASE_UNSET_REPORT.md`, ENTREGUE E APROVADO (UG1–UG13, mutation-tested; engine e payload M41 byte-idênticos; baseline phase5 = HTML `787cd3ab…`). Efeito na REV B: B-3 está RESOLVIDO na implementação → a REV B escreve cláusula de **preservação** (UNSET nunca renderiza como zero geométrico; rótulo `n/d` canônico até decisão do A-8) asserida pelos gates UG, em vez de cláusula de correção. O desvio autorizado a posteriori (package.json, §8.1 do relatório) e a dívida B-2 (`ui_target_v32.js:32`) permanecem registrados lá;
5. **Este backlog** (seções 3 e 4) — cláusulas novas candidatas.

Nada além dessas fontes entra no mandato sem decisão explícita do proprietário.

---

## 2 · Decision log (decisões já tomadas pelo proprietário, 2026-08-18)

| # | Decisão | Efeito na REV B |
|---|---|---|
| DL-1 | **B-1/D2 → opção 1a**: derivação de razões/déficit de suficiência FORA da Camada 1. `dataSufficiency()` intocado; acessores canônicos derivam razões; gate de equivalência ∀estado (`derivado.sufficient === dataSufficiency()`); SUF0 passa a ser prospectivo; espelho `ui_target_v32.js:32` registrado como dívida conhecida. | Reescrever SUF0/SUF3/UI-012 sobre a camada derivada, nunca sobre a Camada 1. |
| DL-2 | **B-3/D3 → micro-fase UNSET dedicada ANTES da REV B.** Estratégia: mudar só a geometria (radar tela, régua, radar PDF `ui_v32.js:652`, overlay/radar target `ui_target_v32.js:120/:179`), preservando o rótulo "n/d" byte-idêntico. | EXECUTADA E APROVADA — ver seção 1, item 4. O texto do anti-pattern UNSET na REV B vira cláusula de preservação. |
| DL-3 | **D1 → interação de perguntas 5.0 como superfície NOVA da Camada 5.** Mesmos setters do runtime congelado; tela congelada intacta. | Cláusulas de interação da REV B são escritas para superfície nova; proibido modificar a tela congelada. |
| DL-4 | **D5 → paleta congelada é o branding oficial.** `PR_DOM_HEX`, custom properties `--ftnt-*`, `#DA291C` como acento. BRANDING-01 encerrado. D4 (NIST) ratificado fora do escopo 5.0. | Remover BRANDING-01 como pendência; incorporar cláusula de tokens (seção 3). |

---

## 3 · Cláusula candidata · Tokens de cor — fonte única

**Categoria:** UI / identidade visual · **Status proposto:** normativa na REV B · **Origem:** decisão D5 + achado C-01 da auditoria ("color tokens não abstraídos semanticamente") · **Relação:** padrão congelado de **cor própria por domínio** (asserido em runtime pelos gates visuais V4+V5; `PR_DOM_HEX` no print).

**COR-01.1 — Consumo exclusivo de tokens congelados.** Toda superfície nova da Camada 5 que exibir cor de domínio DEVE consumi-la das custom properties `--ftnt-*` já congeladas (purple/green/teal/blue/silver, uma por domínio). É PROIBIDO declarar hex literal de cor de domínio fora da fonte única.

**COR-01.2 — Papel do acento de marca.** `#DA291C` é acento de marca, não cor de dado: progresso global, seleção ativa, marcações de cabeçalho/print. Réguas, radar, heat map e qualquer visualização em que o domínio é a dimensão usam a cor do próprio domínio.

**COR-01.3 — UNSET esmaecido na cor do domínio.** A representação visual de UNSET em superfícies novas (tracejado/lacuna) usa a cor do próprio domínio esmaecida — nunca cinza genérico, nunca o acento de marca. Nota: nas superfícies congeladas corrigidas pela micro-fase, o encoding adotado foi pontilhado neutro (`--faint`/`#999`), restrito pelo runtime congelado (tracejado+`#3CB17E` é encoding exclusivo do cenário-alvo, T14/V9); essa diferença entre superfícies congeladas e novas é deliberada e deve ser declarada na REV B.

**COR-01.4 — Gates.** Lint das superfícies novas: zero hex literal dos valores de domínio fora da declaração congelada; gates V4+V5 permanecem a autoridade e ficam intactos.

---

## 4 · Cláusula candidata · ICON-01 — Consumo de ícones oficiais em superfícies novas da Camada 5

**Categoria:** UI / identidade visual · **Status proposto:** normativa na REV B · **Dependências:** D1 (superfícies novas), D5 (branding) · **Relação:** complementar à COR-01 (mesma lógica de fonte única).

**ICON-01.1 — Fonte única congelada.** Toda superfície nova da Camada 5 que exibir ícone de produto ou serviço Fortinet DEVE resolvê-lo exclusivamente via `window.__V32UI.iconFor(itemId, name)` do runtime congelado. É PROIBIDO: declarar novo mapa de ícones, embutir SVG/base64 de produto fora de `ICONS_V32`, ou duplicar `ICON_MAP_V32` total ou parcialmente em módulo novo.

**ICON-01.2 — Semântica de fallback preservada.** O fallback determinístico de iniciais (`.v32-icon-fb`) é comportamento correto e congelado para: (a) entidades sem asset nominal oficial (ex.: `fortisat`, decisão `FALLBACK_RETAINED_NO_ASSET`); (b) abstrações de família (`endpoint-family`, `fortimail-family`, `identity-family`, `soc-platform-family`, decisão `FALLBACK_RETAINED_ABSTRACTION`). Superfícies novas DEVEM renderizar o fallback quando `iconFor()` o produzir. É PROIBIDO atribuir a uma família o ícone de um produto específico — as decisões registradas em `ICON_ASSET_DECISIONS_V32.md` (Fase 4.6) permanecem normativas e só podem ser alteradas por revisão explícita daquele documento, fora do escopo da Fase 5.0.

**ICON-01.3 — Liberdade de apresentação, não de conteúdo.** Superfícies novas PODEM dimensionar, posicionar e agrupar os ícones livremente (ex.: tamanho maior que o das listas `.v32-cand`/`.v32-svc` atuais), desde que: (a) o asset exibido seja byte-idêntico ao servido por `ICONS_V32`; (b) contraste e legibilidade respeitem o tema dark congelado; (c) nenhuma transformação altere o artwork (sem recolor, sem retracing, sem recomposição) — coerente com a proveniência "cópia byte-a-byte" da Fase 4.6.

**ICON-01.4 — Superfícies congeladas intocadas.** Esta cláusula NÃO autoriza alteração de nenhuma superfície congelada: as listas atuais do Recommendation Context, o relatório de impressão/PDF e os 12 gates da suíte ICONS 4.6 permanecem intactos. Ícones no PDF são explicitamente **fora do escopo** da Fase 5.0; qualquer proposta futura nesse sentido exige autorização própria, com regeração de evidência visual Chromium e novos baselines de print.

**ICON-01.5 — Gates propostos (namespace provisório IC5-n; conferir colisão antes de fixar — ver nota N-2).**
- *IC5-1 (positivo):* superfície nova renderiza, para um itemId com asset oficial (ex.: `fortisiem`), `<img class="v32-icon">` com `src` idêntico ao de `ICONS_V32`.
- *IC5-2 (fallback):* para itemId de família e para `fortisat`, a superfície nova renderiza `.v32-icon-fb`, nunca um asset de produto.
- *IC5-3 (fonte única / lint):* nenhum módulo novo da Camada 5 contém `data:image/svg+xml` de produto, mapa paralelo de itemId→asset, nem literal duplicado de `ICON_MAP_V32`.
- *IC5-4 (regressão):* suíte ICONS 4.6 permanece 12/12 e as superfícies congeladas ficam byte-idênticas.

### Notas de auditor (fora do texto normativo)

**N-1 · Custo verificado no source.** `iconFor` **já está exposto** em `window.__V32UI` (`ui_v32.js:827`, verificado no core extraído). Diferente do caso `ARCH_FIELDS` na 4.8.0.2, **nenhuma linha aditiva no core é necessária** — a cláusula consome ponte existente. Isso mantém a classificação de custo em baixo risco.

**N-2 · Namespace de gates.** Os IDs `IC5-n` e `COR-01.x` são provisórios. Colisão de namespace foi o blocker **B-4** da auditoria da REV A (UX1–UX9 × frozen UX1–UX56; F1–F11 × fixtures F1–F9); a REV B deve conferir todos os IDs novos contra as suítes congeladas antes de fixá-los — incluindo agora o namespace **UG1–UG13**, ocupado pela micro-fase UNSET.

**N-3 · Estado atual dos ícones (para evitar reabertura indevida).** Os ícones **já renderizam** hoje nas listas de candidatos (`.v32-cand`) e serviços (`.v32-svc`) do Recommendation Context via `iconFor()` (`ui_v32.js:482–511`): 26 SVGs oficiais em `icons_v32_source/`, ~40 itemIds em `ICON_MAP_V32`, serviços IR/Labs compartilhando `FortiGuard-IR-Service`/`FortiGuard-Labs`. A percepção de "falta de ícone" em itens específicos decorre, em parte, de decisões congeladas corretas (famílias/abstrações e `fortisat` usam fallback by design). ICON-01 trata de **consumo em superfícies novas**, não de correção do estado atual.

---

## 5 · Explicitamente fora deste backlog

- **D4 / NIST CSF panel** — ratificado fora do escopo 5.0 (sem dataset; feature bloqueada).
- **Ícones no PDF / print** — fora do escopo 5.0 (ICON-01.4).
- **Revisão de `ICON_ASSET_DECISIONS_V32.md`** — exigiria reabrir decisões da Fase 4.6; não proposta.
- **Qualquer alteração de engine, scoring ou metodologia** — invariante do projeto; nenhum item deste backlog toca o engine.

---

*Fim do backlog. Próxima ação prevista: montagem do mandato da REV B a partir das fontes da seção 1 (micro-fase UNSET já entregue e aprovada — item 4).*
