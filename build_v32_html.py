#!/usr/bin/env python3
"""Build determinístico: injeta engine_v32.js na V3.1.3 congelada com marcadores
de sincronização. O gate na suíte de testes compara o bloco extraído do HTML com
o arquivo-fonte byte a byte — qualquer divergência = FAIL."""
import sys, hashlib, subprocess
from pathlib import Path
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")   # [Onda-0] Windows cp1252 nunca corrompe stdout
HERE = Path(__file__).resolve().parent
BASE = HERE / "quickscan_secops_soccmm_v3_1_3.html"
ENGINE = HERE / "engine_v32.js"
UIJS = HERE / "ui_v32.js"
ICONSJS = HERE / "ui_icons_v32.js"
UXJS = HERE / "ui_ux_v32.js"
TGTJS = HERE / "ui_target_v32.js"
REFJS = HERE / "ui_refinement_v32.js"
JNJS = HERE / "ui_journey_v32.js"
SESJS = HERE / "ui_session_v32.js"
P50SHELLJS = HERE / "ui_p50_shell_v32.js"
P50SUFFJS = HERE / "ui_p50_suff_v32.js"
P50RESULTSJS = HERE / "ui_p50_results_v32.js"
P52WSJS = HERE / "ui_p52_workspace_v32.js"
UXCSS = HERE / "ui_ux_v32.css"
P50CSS = HERE / "ui_p50_v32.css"
P52CSS = HERE / "ui_p52_workspace_v32.css"
UICSS = HERE / "ui_v32.css"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "quickscan_secops_soccmm_v3_2_dev.html"
subprocess.run([sys.executable, str(HERE/"generate_icons_v32.py")], check=True, capture_output=True)
html = open(BASE, encoding="utf-8").read()
engine = open(ENGINE, encoding="utf-8").read()
anchor = "const CONFIG_ERRORS = validateConfig();"
assert html.count(anchor) == 1, "âncora de injeção não única"
adapter = """
/* ===== V32_ADAPTER (Camada 1 — somente leitura; bindings p/ harness E11) ===== */
const TECH_LANDSCAPE = V32.TECH_LANDSCAPE;
const ARCHITECTURE_CONTEXT = V32.ARCHITECTURE_CONTEXT;
const PLATFORM_CONTEXT = V32.PLATFORM_CONTEXT;
const SESSION_SIGNALS = V32.SESSION_SIGNALS;
function resetLandscapeToUnset(){ V32.resetLandscapeToUnset(); }
V32.configure({
  answerOf: qid => { const k = QS.findIndex(q=>q.id===qid); return k>=0 ? ans[k] : null; },
  sevOf: (qid, a) => { const m = MAP[qid] && MAP[qid].lv[a]; return m ? (m.s||0) : 0; },
  priorityIds: () => Array.from(businessPriority),
  assessmentSufficient: () => dataSufficiency(DOMS.map((_,i)=>domStat(i)))
});
const V32_CONFIG_ERRORS = V32.validateConfigV32();
if (V32_CONFIG_ERRORS.length) console.error("Quickscan V3.2 · erros de configuração:", V32_CONFIG_ERRORS);
"""
uijs = open(UIJS, encoding="utf-8").read()
iconsjs = open(ICONSJS, encoding="utf-8").read()
uxjs = open(UXJS, encoding="utf-8").read()
tgtjs = open(TGTJS, encoding="utf-8").read()
refjs = open(REFJS, encoding="utf-8").read()
jnjs = open(JNJS, encoding="utf-8").read()
sesjs = open(SESJS, encoding="utf-8").read()
p50shelljs = open(P50SHELLJS, encoding="utf-8").read()
p50suffjs = open(P50SUFFJS, encoding="utf-8").read()
p50resultsjs = open(P50RESULTSJS, encoding="utf-8").read()
p52wsjs = open(P52WSJS, encoding="utf-8").read()
# [4.8-E] metadata determinística: versão do package + SHA real do engine (nunca digitados à mão)
import hashlib, json as _json
_pkg = _json.load(open(HERE / "package.json", encoding="utf-8"))
_eng_sha = hashlib.sha256(open(HERE / "engine_v32.js", "rb").read()).hexdigest()
build_meta = ("\n/* V32_BUILD_META_BEGIN */\nwindow.__QS_BUILD_META = " +
    _json.dumps({"toolVersion": _pkg["version"], "engineSha256": _eng_sha}, ensure_ascii=False) +
    ";\n/* V32_BUILD_META_END */\n")
uxcss = open(UXCSS, encoding="utf-8").read()
inject = ("/* V32_ENGINE_BEGIN */\n" + engine + "\n/* V32_ENGINE_END */\n" + adapter +
          "\n/* V32_ICONS_BEGIN */\n" + iconsjs + "\n/* V32_ICONS_END */\n" +
          "\n/* V32_UI_BEGIN */\n" + uijs + "\n/* V32_UI_END */\n" + "\n/* V32_UX_BEGIN */\n" + uxjs + "\n/* V32_UX_END */\n" + "\n/* V32_TARGET_BEGIN */\n" + tgtjs + "\n/* V32_TARGET_END */\n" + "\n/* V32_REF_BEGIN */\n" + refjs + "\n/* V32_REF_END */\n" + build_meta + "\n/* V32_JOURNEY_BEGIN */\n" + jnjs + "\n/* V32_JOURNEY_END */\n" + "\n/* V32_SESSION_BEGIN */\n" + sesjs + "\n/* V32_SESSION_END */\n" + "\n/* V32_P50_SHELL_BEGIN */\n" + p50shelljs + "\n/* V32_P50_SHELL_END */\n" + "\n/* V32_P50_SUFF_BEGIN */\n" + p50suffjs + "\n/* V32_P50_SUFF_END */\n" + "\n/* V32_P50_RESULTS_BEGIN */\n" + p50resultsjs + "\n/* V32_P50_RESULTS_END */\n" + "\n/* V32_P52_WORKSPACE_BEGIN */\n" + p52wsjs + "\n/* V32_P52_WORKSPACE_END */\n" + "\n/* V32_UI_END */\n" + anchor)
html = html.replace(anchor, inject)
uicss = open(UICSS, encoding="utf-8").read()
assert html.count("</style>") == 1, "style tag não único"
p50css = open(P50CSS, encoding="utf-8").read()
p52css = open(P52CSS, encoding="utf-8").read()
html = html.replace("</style>", "\n/* V32_CSS_BEGIN */\n" + uicss + "\n/* V32_CSS_END */\n/* V32_UXCSS_BEGIN */\n" + uxcss + "\n/* V32_UXCSS_END */\n/* V32_P50CSS_BEGIN */\n" + p50css + "\n/* V32_P50CSS_END */\n/* V32_P52CSS_BEGIN */\n" + p52css + "\n/* V32_P52CSS_END */\n</style>")
html = html.replace("Quickscan SecOps · SOC-CMM · v3.1.3", "Quickscan SecOps · SOC-CMM · v3.2-dev (engine)")
open(OUT, "w", encoding="utf-8", newline="\n").write(html)   # [Onda-0] LF por construção em qualquer SO
print("build ok →", OUT, "| sha256(engine):", hashlib.sha256(engine.encode()).hexdigest()[:16])
