# REV_B_REANCHOR_MAP.md
## Mapa de reancoragem de citações · PHASE 5.0 REV B → baseline de trabalho — FECHADO

**Spec de origem:** `PHASE_5_0_REV_B.md` · SHA-256
`0f31900e8ad608c8a5825d9d5fa9e2d7a4fd3d68f8efbf23c7fc937a16950925`.
**Regra (spec §0.A):** a âncora normativa é o par **(arquivo, símbolo)**; este mapa é a fonte
normativa de posições. Nenhum gate novo dependente de posição executa antes de a entrada
correspondente estar **VERIFICADA** (P50-GOV3).

**Verificação desta edição (2026-08-19):** os três arquivos alterados pela micro-fase foram
recebidos, seus SHA-256 foram **recalculados nesta sessão** e conferem exatamente com os hashes do
baseline de trabalho (§0.A da spec); em seguida, **cada posição foi confrontada individualmente
contra os símbolos e bytes reais** (nenhuma posição transcrita sem verificação; nenhuma estimada).

```text
quickscan_secops_soccmm_v3_1_3.html  1.098 linhas
d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82   CONFERE

ui_v32.js                              856 linhas
094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038   CONFERE

ui_target_v32.js                       210 linhas
cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0   CONFERE
```

**Estados de verificação:**
- `VERIFICADA (baseline de trabalho)` — posição confrontada nesta edição contra os bytes reais do
  arquivo, com SHA recalculado e conferido.
- `VERIFICADA (identidade)` — arquivo não alterado pela micro-fase (byte-idêntico ao core 4.8.0.7,
  MANIFEST 74/74); as posições da auditoria da REV A permanecem válidas por identidade de bytes.

**Nota de precisão:** onde a posição observada divergiu por 1 linha da fornecida pela reauditoria
(linha da chave de fechamento) ou por 1 linha no início de um subtrecho, este mapa registra a
**posição observada**; as divergências estão marcadas com `†` e listadas ao final.

| arquivo | símbolo | posição pré-microfase (auditoria REV A) | posição no baseline atual | SHA do arquivo verificado |
|---|---|---|---|---|
| Camada 1 (`quickscan_secops_soccmm_v3_1_3.html`) | `DOMS` ({en,pt}) | fonte:275 | 286–292 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | `QS` / `opts:[{t,d}×4]` | fonte:285–… | 296–417 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | `esc` (escaper legado; escapa apenas `&` e `<`) | fonte:472 | 483 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | `stageOf` | fonte:474 | 485–492† — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | `confirmedCount()` (`v!==null && v!=="NA"`) | fonte:483 | 494 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | `domStat()` | fonte:485 | 496–510 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | rótulos `domStat().basis` ("N de 3 respostas confirmadas…") | fonte:493–497 | 504–508 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | `dataSufficiency()` (literais `>= 10` e `s.n>=2`) | fonte:501–503 | 512–514 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | grupo `<button aria-pressed>` (arquétipo) | fonte:636 | 647–650 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | grupo `<button class="opt" data-i aria-pressed>` (opções 0..3 + `NA`) | fonte:664–668 | 675–682 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | grupo de prioridades (`renderPriority`) | fonte:716 | 715–747† (botão `aria-pressed` 727–730) — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | radar de tela / UNSET (`radarSVG` + `radarUnsetNote`) | fonte:760 | 750–790† (correção `[UNSET-GEOM]` 764–780; nota textual 783–790) — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | oferta "Assessment de Maturidade NIST CSF 2.0" (trilha Fundação) | fonte:810 | 837–840 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | moeda "respostas confirmadas" (render de resultado) | fonte:855 · fonte:926 | 883 · 927 · 930–931 · 953 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | render bilíngue "EN · PT" (estágio e domínios) | fonte:924 | 951 · 965 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| Camada 1 | régua UNSET (`.ruler.unset` + render `ruler-na`) | fonte:939 | CSS 134–137 · render 966–970 — VERIFICADA (baseline de trabalho) | `d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82` |
| `ui_v32.js` | `escAttr` / `esc32` (escapa `& " ' < >`) | :255–257 | 255–257 — VERIFICADA (baseline de trabalho) | `094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038` |
| `ui_v32.js` | `PR_DOM_HEX` | :643 | 643 — VERIFICADA (baseline de trabalho) | `094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038` |
| `ui_v32.js` | `prRadarSVG` / geometria UNSET do PDF | :652 | 644–672† (correção `[UNSET-GEOM]` 651–671) — VERIFICADA (baseline de trabalho) | `094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038` |
| `ui_v32.js` | marca "Fortinet · Quickscan SecOps · SOC-CMM" (cabeçalho do print) | :682 | 694–695 — VERIFICADA (baseline de trabalho) | `094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038` |
| `ui_v32.js` | `buildPrintReport` / COLLECTION_REPORT de fato | :687–689/:693 | 685–706 (suficiência: `suff=dataSufficiency(stats)` 689† · KPIs `n/d`/estágio/suficiência 698–701) — VERIFICADA (baseline de trabalho) | `094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038` |
| `ui_v32.js` | wrapper aditivo de `renderResults` / chamada `window.__uxDecor` | :820–824 (:823) | 832–835 (chamada `__uxDecor` em 835) — VERIFICADA (baseline de trabalho) | `094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038` |
| `ui_v32.js` | ponte `window.__V32UI` (`openEditor, esc32, iconFor, ARCH_FIELDS`) | :827 | 839 — VERIFICADA (baseline de trabalho) | `094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038` |
| `ui_target_v32.js` | `computeTargetProfile` (dívida UI-012B) | :32 | 24–36† — VERIFICADA (baseline de trabalho) | `cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0` |
| `ui_target_v32.js` | `tgtSection` | :50 | 50–98 — VERIFICADA (baseline de trabalho) | `cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0` |
| `ui_target_v32.js` | `tgtRadarOverlay` / omissão UNSET | :120 | 110–134† (correção `[UNSET-GEOM]` 117–130) — VERIFICADA (baseline de trabalho) | `cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0` |
| `ui_target_v32.js` | `window.__uxTargetPrintHTML` / radar atual×alvo do PDF | :179 | 176–206 (correção `[UNSET-GEOM]` 182–203) — VERIFICADA (baseline de trabalho) | `cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0` |
| `ui_target_v32.js` | `pr-target` | :188 | 195–205 — VERIFICADA (baseline de trabalho) | `cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0` |
| `ui_session_v32.js` | `captureCanonicalInputs()` | :42 | :42 — VERIFICADA (identidade) | byte-idêntico ao core `625079c462be7d44ffd69b1cd85f256382322bd0555ae4b548f21bf30ee5b89d` (MANIFEST 74/74) |
| `ui_session_v32.js` | serialização de notas por pergunta | :45–46 | :45–46 — VERIFICADA (identidade) | byte-idêntico ao core `625079c4…0ee5b89d` |
| `ui_session_v32.js` | strictness de chaves (raiz/`inputs`/derivados) | :214 · :220 · :222 | :214 · :220 · :222 — VERIFICADA (identidade) | byte-idêntico ao core `625079c4…0ee5b89d` |
| `harness_m41_v313.js` | marcador `function dataSufficiency` | :26 | :26 — VERIFICADA (identidade) | byte-idêntico ao core `625079c4…0ee5b89d` |
| `engine_v32.js` | (referências gerais) | — | VERIFICADA (identidade) | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` (byte-idêntico desde a 4.7) |

**† Divergências de borda entre a posição fornecida pela reauditoria e a posição observada**
(registrada a observada; todas de 1 linha, na chave de fechamento ou no início de subtrecho):
`stageOf` fecha em **492** (fornecido 485–491) · `renderPriority` fecha em **747** (fornecido
715–746) · bloco do radar de tela fecha em **790**, com `radarSVG` 750–782 e nota 783–790 (fornecido
750–789) · `prRadarSVG` fecha em **672** (fornecido 644–671) · `suff = dataSufficiency(stats)` em
buildPrintReport está em **689** (fornecido a partir de 688) · `computeTargetProfile` fecha em **36**
(fornecido 24–35) · `tgtRadarOverlay` fecha em **134** (fornecido 110–133).

---

## Fechamento

```text
33/33 âncoras verificadas
0 pendentes
P50-GOV3 materialmente satisfazível
```

Verificação desta edição: 28 entradas confrontadas contra os bytes reais dos três arquivos do
baseline de trabalho (SHAs recalculados e conferidos acima) + 5 entradas verificadas por identidade
(arquivos byte-idênticos ao core 4.8.0.7). Nenhuma posição estimada ou fabricada. A identidade da
spec de origem permanece inalterada.
