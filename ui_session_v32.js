/* ============ PHASE 4.8 · SESSION PORTABILITY & EVIDENCE ARCHIVE ============
   O arquivo preserva EVIDÊNCIA DE ENTRADA, nunca resultados calculados.
   Import: parse → validate → normalize → compat → confirm → commit atômico → recompute. */
const SESSION_FORMAT = "quickscan-secops-session";
const SESSION_SCHEMA_VERSION = 1;
const SESSION_MAX_BYTES = 1024 * 1024;              /* [Q] 1 MiB */
const SESSION_MAX_FIELD = 10000;                    /* [P4] valores escalares Unicode (code points) */
const SESSION_MAX_LABEL = 200;                      /* [4.8.0.7-B] bound canônico do exporter (ver sesLabel) */
/* [4.8.0.7-B] O limite normativo conta VALORES ESCALARES Unicode, não code units UTF-16.
   "😀".repeat(6000).length === 12000, mas [..."😀".repeat(6000)].length === 6000: com .length um campo
   de 6.000 emojis era recusado apesar de estar abaixo do limite de 10.000. Fonte única: scalarLen(). */
function scalarLen(s){ let n = 0; for (const _ of s) n++; return n; }
/* Surrogate desemparelhado não é texto Unicode canônico: JSON.stringify o emite como \udXXX e o byte-stream
   UTF-8 correspondente é inválido. Recusado explicitamente, sem normalizar nem truncar. */
function isWellFormedUnicode(s){
  for (let i = 0; i < s.length; i++){
    const c = s.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF){
      const n = s.charCodeAt(i + 1);
      if (!(n >= 0xDC00 && n <= 0xDFFF)) return false;    /* high sem low */
      i++;
    } else if (c >= 0xDC00 && c <= 0xDFFF) return false;  /* low sem high */
  }
  return true;
}
/* contrato textual único do schema v1: tipo → Unicode bem formado → limite em escalares */
function strFieldError(v, what, max){
  const lim = (max === undefined) ? SESSION_MAX_FIELD : max;
  if (typeof v !== "string") return what + " deve ser texto.";
  if (!isWellFormedUnicode(v)) return what + " contém Unicode malformado (surrogate desemparelhado).";
  if (scalarLen(v) > lim) return what + " excede o limite de " + lim + " caracteres.";
  return null;
}
const RESERVED_DERIVED = ["score","domainScores","stage","confidence","sufficiency","findings","severity","gaps",
  "recommendations","recommendationContext","supportMode","offerings","services","commercial",
  "contextClassification","journey","nextStage","narrative","executiveNarrative","targetScore","targetStage",
  "targetEnablers","refinementScore","html","renderedHtml","pdf"];
const FORBIDDEN_KEYS = ["__proto__","prototype","constructor"];
const buildMeta = () => (typeof window!=="undefined" && window.__QS_BUILD_META) || { toolVersion:"unknown", engineSha256:"unknown" };

/* ---------- [AF] captura de inputs canônicos (derivados NUNCA entram) ---------- */
function captureCanonicalInputs(){
  const answers = {};
  QS.forEach((q,k)=>{ answers[q.id] = (ans[k]===undefined ? null : ans[k]); });
  const notesOut = {};
  QS.forEach((q,k)=>{ const n = (notes && notes[k]) || ""; if (n) notesOut[q.id] = String(n); });
  const land = {};
  Object.keys(V32.TECH_LANDSCAPE).forEach(id=>{
    const L = V32.TECH_LANDSCAPE[id];
    land[id] = { presence: L.presence,
      solutions: (L.solutions||[]).map(sol=>{                 /* [4.8.0.1-5] ausência permanece ausência */
        const out = {};
        SOLUTION_KEYS.forEach(k=>{ if (sol[k] !== undefined) out[k] = (k === "coveredCapabilities" && Array.isArray(sol[k]))
          ? sol[k].slice() : sol[k]; });
        return out; }),
      declaredDriver: L.declaredDriver ? JSON.parse(JSON.stringify(L.declaredDriver)) : null };
  });
  const signals = {}; V32.SIGNAL_IDS.forEach(s=>{ signals[s] = V32.SESSION_SIGNALS[s]; });
  return {
    assessment: { archetype: (arq===undefined?null:arq), answers, notes: notesOut },
    priorities: [...businessPriority],
    technologyLandscape: { capabilities: land,
      architectureContext: JSON.parse(JSON.stringify(V32.ARCHITECTURE_CONTEXT)),
      declaredPlatforms: JSON.parse(JSON.stringify(V32.PLATFORM_CONTEXT.declaredPlatforms||[])),
      signals },
    targetProfile: { overrides: JSON.parse(JSON.stringify(TARGET_PROFILE.overrides)) },
    operationalRefinement: { answers: JSON.parse(JSON.stringify(OPERATIONAL_REFINEMENT.answers)) }
  };
}
/* [4.8.0.7-B] truncamento do label por ESCALARES: String.slice(0,200) corta code units e podia partir um
   par surrogate ao meio, emitindo um label malformado que o próprio import recusaria (defeito real desta
   classe, encontrado pelo preflight). Aqui o corte nunca quebra um code point. */
function sesLabel(label){
  if (label === undefined || label === null) return null;
  const arr = [...String(label)];
  const out = arr.slice(0, SESSION_MAX_LABEL).join("");
  return out || null;
}
function buildSessionDocument(label){
  const m = buildMeta();
  return { format: SESSION_FORMAT, schemaVersion: SESSION_SCHEMA_VERSION,
    toolVersion: m.toolVersion, engineSha256: m.engineSha256,
    createdAt: new Date().toISOString(),
    label: sesLabel(label),
    inputs: captureCanonicalInputs() };
}
/* ---------- [J] filename seguro ---------- */
function sessionFilename(label){
  const d = new Date(), p = n => String(n).padStart(2,"0");
  const ts = `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
  let slug = String(label||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^A-Za-z0-9 _-]/g,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-").slice(0,48).replace(/^-|-$/g,"");
  if (!slug) slug = "session";
  return `quickscan-secops_${slug}_${ts}.json`;
}
/* ---------- [K] download local, sem rede ---------- */
/* ---------- [4.8.0.7-A] PREFLIGHT DE EXPORT · fechamento da propriedade de self-import ----------
   Invariante normativa: nenhum JSON emitido pela UI pode ser recusado pelo MESMO build por causa de um
   limite que o exporter deixou de aplicar. Portanto o export monta o documento exato, valida com o MESMO
   validador do import, serializa os bytes exatos e mede o tamanho UTF-8 dessa serialização — antes de
   qualquer Object URL. Nada é truncado silenciosamente: evidência canônica não é mutilada para caber. */
function utf8ByteLength(text){
  if (typeof TextEncoder === "function") return new TextEncoder().encode(text).length;
  return unescape(encodeURIComponent(text)).length;      /* fallback determinístico, mesmo resultado */
}
function prepareSessionExport(label){
  const doc = buildSessionDocument(label);
  const v = validateSessionDocument(doc);
  if (!v.ok) return { ok:false, reason:"invalid", error:
    "Esta sessão contém um valor que o próprio Quickscan não conseguiria reimportar: " + v.error +
    " Ajuste o texto no editor e exporte novamente — nada foi truncado nem baixado." };
  const text = JSON.stringify(doc, null, 2);
  const bytes = utf8ByteLength(text);
  if (bytes > SESSION_MAX_BYTES) return { ok:false, reason:"oversize", bytes,
    error: "A sessão gerada tem " + bytes.toLocaleString("pt-BR") + " bytes e excede o limite de 1 MiB (" +
      SESSION_MAX_BYTES.toLocaleString("pt-BR") + " bytes) que a própria importação aplica. " +
      "Nenhum arquivo foi gerado; reduza o volume de texto declarado e exporte novamente." };
  return { ok:true, doc, text, bytes };
}
function downloadSession(label){
  const pre = prepareSessionExport(label);
  if (!pre.ok) return pre;                    /* nenhum Blob, nenhum Object URL, nenhum anchor, estado intacto */
  const blob = new Blob([pre.text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = sessionFilename(label); a.style.display = "none";
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
  return { ok:true, filename: a.download, bytes: blob.size };
}
/* ---------- [O/P] validação pura: nunca toca em estado ---------- */
function hasForbiddenKeys(o, depth){
  if (depth > 8 || o === null || typeof o !== "object") return false;
  for (const k of Object.keys(o)){
    if (FORBIDDEN_KEYS.includes(k)) return true;
    if (hasForbiddenKeys(o[k], depth+1)) return true;
  }
  return false;
}
function hasReservedDerived(o, depth){
  if (depth > 8 || o === null || typeof o !== "object") return false;
  for (const k of Object.keys(o)){
    if (RESERVED_DERIVED.includes(k)) return true;
    if (hasReservedDerived(o[k], depth+1)) return true;
  }
  return false;
}
/* [4.8.0.1-3] contratos derivados das fontes canônicas do runtime — nenhum enum redigitado */
const SES = {
  presence:   () => V32.ENUMS.presence,                      /* engine ENUMS */
  /* [4.8.0.6-C4] "" NÃO pertence ao domínio do import: é apenas a opção visual do select (STATUS_LABELS).
     O editor faz `if (st) s.status = st; else delete s.status` — "não informado" é PROPRIEDADE AUSENTE. */
  status:     () => V32.ENUMS.solutionStatus,
  deployment: () => V32.ENUMS.deployment,
  /* [4.8.0.5-4] DOIS domínios distintos — a existência em CAPABILITIES não habilita entrada no Landscape */
  landscapeIds: () => Object.keys(V32.TECH_LANDSCAPE),   /* owner canônico (22) · keys de capabilities */
  capabilityIds: () => Object.keys(V32.CAPABILITIES),    /* domínio de assessment/recommendation (25) */
  /* [4.8.0.6-A] domínio REAL de solutions[].coveredCapabilities: a MESMA expressão que monta a grade de
     checkboxes em solRow() — Object.keys(V32.CAPABILITIES).filter(c => c !== "soc-platform").
     Nenhum ID individual é redigitado; apenas o sentinel soc-platform, que já é a capability específica
     usada por suppressedByPlatform()/solRow() como âncora da declaração de cobertura. */
  coveredIds: () => Object.keys(V32.CAPABILITIES).filter(id => id !== COVERAGE_HOST_CAP),
  qIds:       () => QS.map(q => q.id),
  refIds:     () => OPERATIONAL_REFINEMENT_QUESTIONS.map(q => q.id),
  archKeys:   () => Object.keys(V32.ARCHITECTURE_CONTEXT),
  signalIds:  () => V32.SIGNAL_IDS,
  bundles:    () => Object.keys(V32.BUNDLES),
  /* [4.8.0.2-5/6] platform IDs canônicos do owner real: os que a UI declara (fortigate) e os que o runtime
     congelado preserva no PLATFORM_CONTEXT — fortisoc aparece em estado canônico coberto pelas suítes 3.3.3 */
  platforms:  () => ["fortigate","fortisoc"],
  subs:       () => Object.keys(V32.SECURITY_SUBSCRIPTIONS),
  /* [4.8.0.2-3] derivado de ARCH_FIELDS — a MESMA fonte que a UI usa para montar os selects */
  archValues: () => { const out = {};
    window.__V32UI.ARCH_FIELDS.forEach(f => { out[f.k] = f.opts.map(o => o[0]); }); return out; },
  signalValues: () => [true, "unset"]                        /* SESSION_SIGNALS: true | "unset" */
};
const SOLUTION_KEYS = ["vendor","product","status","deployment","coverage","notes","coveredCapabilities"];
/* [4.8.0.6-A] contexto canônico de coveredCapabilities — derivado do runtime congelado, não inventado:
   - suppressedByPlatform() lê a cobertura explícita SOMENTE em TECH_LANDSCAPE["soc-platform"];
   - solRow() só renderiza os checkboxes quando capId==="soc-platform" && !/fortisoc/i.test(s.product||"");
   - readDraftFromDom() só grava/apaga o campo sob a MESMA condição.
   FORTISOC_RE é literalmente o predicado usado nas três posições (regra por PRODUTO, nunca por vendor). */
const COVERAGE_HOST_CAP = "soc-platform";
const FORTISOC_RE = /fortisoc/i;
const isFortiSOCSolution = sol => FORTISOC_RE.test((sol && sol.product) || "");
/* [4.8.0.6-C] paridade com readDraftFromDom(): o editor grava apenas valores já trimados */
const isTrimmed = v => typeof v === "string" && v === v.trim();
const PLATFORM_KEYS = ["platform","bundle","subscriptions","notes"];   /* [4.8.0.2-6] notes é preservado pelo runtime */
const CAP_KEYS = ["presence","solutions","declaredDriver"];
const LAND_KEYS = ["capabilities","architectureContext","declaredPlatforms","signals"];
/* [4.8.0.7-B] toda checagem textual passa por strFieldError: tipo + Unicode bem formado + escalares */
const strKeyErr = (o,k,what) => o[k] === undefined ? null : strFieldError(o[k], what);
const extraKeys = (o, allow) => Object.keys(o).filter(k => !allow.includes(k));
function validateSessionDocument(doc){
  const err = m => ({ ok:false, error:m });
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return err("Arquivo não é um documento de sessão válido.");
  if (doc.format !== SESSION_FORMAT) return err("Este arquivo não é uma sessão do Quickscan SecOps.");
  if (doc.schemaVersion !== SESSION_SCHEMA_VERSION)
    return err("Este arquivo usa uma versão de schema que esta versão do Quickscan não suporta.");
  if (typeof doc.toolVersion !== "string" || typeof doc.engineSha256 !== "string")
    return err("Metadados de build ausentes ou inválidos.");
  /* [4.8.0.7-B] metadata de raiz também é string importada: mesmo contrato escalar/Unicode */
  for (const k of ["toolVersion","engineSha256"]){
    const e = strFieldError(doc[k], k); if (e) return err(e);
  }
  if (doc.createdAt !== undefined && doc.createdAt !== null){
    const e = strFieldError(doc.createdAt, "createdAt"); if (e) return err(e);
  }
  if (doc.label !== undefined && doc.label !== null){
    /* bound canônico ESTRITO e provado: buildSessionDocument() trunca o label em SESSION_MAX_LABEL
       escalares (sesLabel), e o input do modal de export nunca produz mais que isso. */
    const e = strFieldError(doc.label, "label", SESSION_MAX_LABEL); if (e) return err(e);
  }
  const extraRoot = Object.keys(doc).filter(k=>!["format","schemaVersion","toolVersion","engineSha256","createdAt","label","inputs"].includes(k));
  if (extraRoot.length) return err("Campos não reconhecidos no documento: " + extraRoot.join(", "));
  if (hasForbiddenKeys(doc,0)) return err("Documento contém chaves proibidas.");
  const I = doc.inputs;
  if (!I || typeof I !== "object" || Array.isArray(I)) return err("Bloco de entradas ausente.");
  const extraIn = Object.keys(I).filter(k=>!["assessment","priorities","technologyLandscape","targetProfile","operationalRefinement"].includes(k));
  if (extraIn.length) return err("Entradas não reconhecidas: " + extraIn.join(", "));
  if (hasReservedDerived(I,0)) return err("O arquivo contém resultados derivados; sessões transportam apenas entradas.");
  /* assessment */
  const A = I.assessment;
  if (!A || typeof A !== "object" || Array.isArray(A)) return err("Assessment ausente.");
  const eAs = extraKeys(A, ["archetype","answers","notes"]);
  if (eAs.length) return err("Campos extras no assessment: " + eAs.join(", "));
  if (!(A.archetype === null || (Number.isInteger(A.archetype) && A.archetype >= 0 && A.archetype < ARQ.length)))
    return err("Ponto de partida inválido.");
  if (!A.answers || typeof A.answers !== "object" || Array.isArray(A.answers))
    return err("Respostas devem ser um objeto de mapa (não lista).");   /* [4.8.0.5-9] */
  const canonIds = SES.qIds();
  for (const k of Object.keys(A.answers)){
    if (!canonIds.includes(k)) return err("Prática desconhecida no arquivo: " + k);
    const v = A.answers[k];
    const okv = v === null || v === "NA" || (Number.isInteger(v) && v >= 0 && v <= 3);
    if (!okv) return err("Resposta inválida em: " + k);
  }
  {                                        /* [4.8.0.6-B1] owner COMPLETO: o exporter grava os 15 IDs sempre */
    const missQ = canonIds.filter(k => !(k in A.answers));
    if (missQ.length)
      return err("Respostas incompletas — práticas ausentes: " + missQ.join(", ") +
                 ". O schema v1 exige todas as práticas; 'não respondida' é representada por null, " +
                 "não pela ausência da propriedade.");
  }
  if (A.notes !== undefined){
    if (!A.notes || typeof A.notes !== "object" || Array.isArray(A.notes))
      return err("Notas devem ser um objeto de mapa (não lista).");     /* [4.8.0.5-10] */
    for (const k of Object.keys(A.notes)){
      if (!canonIds.includes(k)) return err("Nota para prática desconhecida: " + k);
      { const e = strFieldError(A.notes[k], "Nota de " + k); if (e) return err(e); }
    }
  }
  /* priorities */
  const P = I.priorities;
  if (!Array.isArray(P)) return err("Prioridades inválidas.");
  if (P.length > 3) return err("Máximo de 3 prioridades.");
  if (new Set(P).size !== P.length) return err("Prioridades duplicadas.");
  for (const id of P) if (!canonIds.includes(id)) return err("Prioridade desconhecida: " + id);
  /* landscape — [4.8.0.1-3/4/6/7/8/9] estrito e aninhado */
  const L = I.technologyLandscape;
  if (!L || typeof L !== "object" || Array.isArray(L)) return err("Contexto tecnológico ausente.");
  const eL = extraKeys(L, LAND_KEYS); if (eL.length) return err("Campos não reconhecidos no contexto: " + eL.join(", "));
  if (!L.capabilities || typeof L.capabilities !== "object" || Array.isArray(L.capabilities))
    return err("Capabilities ausentes.");
  const landIds = SES.landscapeIds(), capIds = SES.capabilityIds();
  {                              /* [4.8.0.6-B2] owner COMPLETO: o exporter grava as 22 capabilities sempre */
    const missCap = landIds.filter(id => !(id in L.capabilities));
    if (missCap.length)
      return err("Technology Landscape incompleto — capabilities ausentes: " + missCap.join(", ") +
                 ". Uma capability não informada é representada explicitamente por " +
                 '{"presence":"UNSET","solutions":[],"declaredDriver":null}, não pela ausência da chave.');
  }
  for (const id of Object.keys(L.capabilities)){
    if (!landIds.includes(id))
      return err("Capability " + id + " não pertence ao Technology Landscape canônico" +
                 (capIds.includes(id) ? " (não é habilitada para Landscape)." : "."));
    const c = L.capabilities[id];
    if (!c || typeof c !== "object" || Array.isArray(c)) return err("Capability inválida: " + id);
    const eC = extraKeys(c, CAP_KEYS); if (eC.length) return err("Campos extras em " + id + ": " + eC.join(", "));
    if (!SES.presence().includes(c.presence)) return err("Presence inválida em " + id + ": " + String(c.presence));
    if (!Array.isArray(c.solutions)) return err("Solutions deve ser lista em " + id);
    if (c.solutions.length && !["PRESENT","PARTIAL"].includes(c.presence))      /* [4.8.0.2-14] invariante do editor */
      return err("Estado impossível em " + id + ": presence " + c.presence + " não admite soluções declaradas.");
    for (const sol of c.solutions){
      if (!sol || typeof sol !== "object" || Array.isArray(sol)) return err("Solution inválida em " + id);
      const hasIdent = (typeof sol.vendor === "string" && sol.vendor.trim() !== "") ||
                       (typeof sol.product === "string" && sol.product.trim() !== "");
      if (!hasIdent) return err("Solution sem fornecedor nem produto em " + id + " — estado que o editor não mantém.");
      const eS = extraKeys(sol, SOLUTION_KEYS);
      if (eS.length) return err("Campos extras em solution de " + id + ": " + eS.join(", "));
      for (const f of ["vendor","product","coverage","notes"])
        { const e = strKeyErr(sol, f, "Campo " + f + " em solution de " + id); if (e) return err(e); }
      /* [4.8.0.6-C1] vendor/product: o editor grava value.trim(). Vazio segue válido em UM dos dois campos
         (hasIdent acima preserva S58); padded NÃO é representação canônica. */
      for (const f of ["vendor","product"])
        if (sol[f] !== undefined && !isTrimmed(sol[f]))
          return err("Campo " + f + " em solution de " + id + " tem espaços nas bordas — o editor grava " +
                     "o valor trimado (" + JSON.stringify(sol[f].trim()) + ").");
      /* [4.8.0.6-C2] coverage/notes: o editor faz trim() e DELETA quando vazio → ausência é a única
         representação de "não informado"; "" e "   " não são estados produzíveis. */
      for (const f of ["coverage","notes"]){
        if (sol[f] === undefined) continue;
        if (!isTrimmed(sol[f]))
          return err("Campo " + f + " em solution de " + id + " tem espaços nas bordas — o editor grava " +
                     "o valor trimado.");
        if (sol[f] === "")
          return err("Campo " + f + " vazio em solution de " + id + " — o editor remove a propriedade; " +
                     "represente 'não informado' pela ausência do campo.");
      }
      /* [4.8.0.6-C4] status: "" era aceito só pela opção visual do select; o editor remove a propriedade */
      if (sol.status !== undefined && !SES.status().includes(sol.status))
        return err("Status inválido em " + id + ": " + JSON.stringify(sol.status) +
                   (sol.status === "" ? " — 'não informado' é representado pela ausência da propriedade." : ""));
      if (sol.deployment !== undefined && !SES.deployment().includes(sol.deployment))
        return err("Deployment inválido em " + id + ": " + String(sol.deployment));
      if (sol.coveredCapabilities !== undefined){
        /* [4.8.0.6-A] CONTEXTO CANÔNICO primeiro: o campo só existe onde o runtime o lê e a UI o produz. */
        if (id !== COVERAGE_HOST_CAP)
          return err("coveredCapabilities declarado em " + id + " — a cobertura explícita só existe em " +
                     COVERAGE_HOST_CAP + ", única posição lida por suppressedByPlatform() e renderizada pelo editor.");
        if (isFortiSOCSolution(sol))
          return err("coveredCapabilities declarado em uma solution FortiSOC de " + id + " — a cobertura do " +
                     "FortiSOC vem das capabilityRelations do catálogo; o editor não oferece os checkboxes.");
        if (!Array.isArray(sol.coveredCapabilities)) return err("coveredCapabilities deve ser lista em " + id);
        if (!sol.coveredCapabilities.length)
          return err("coveredCapabilities vazio em " + id + " — o editor remove a propriedade quando nenhum " +
                     "checkbox está marcado; represente 'nenhuma cobertura declarada' pela ausência do campo.");
        const covered = SES.coveredIds(), seen = new Set();
        for (const cc of sol.coveredCapabilities){
          if (typeof cc !== "string") return err("coveredCapabilities aceita apenas texto em " + id);
          if (cc === COVERAGE_HOST_CAP)
            return err("coveredCapabilities inclui " + COVERAGE_HOST_CAP + " em " + id + " — a plataforma não " +
                       "cobre a si própria; o editor exclui esse ID da grade de checkboxes.");
          if (!covered.includes(cc))
            return err("Capability desconhecida em coveredCapabilities de " + id + ": " + cc);
          if (seen.has(cc))
            return err("coveredCapabilities duplicado em " + id + ": " + cc +
                       " — checkboxes não produzem repetição.");
          seen.add(cc);
        }
      }
    }
    if (!("declaredDriver" in c))                            /* [4.8.0.4-3] missing ≠ null */
      return err("Capability " + id + " sem declaredDriver — o owner canônico sempre declara esse campo " +
                 "(use null quando não houver motivo declarado).");
    if (c.presence === "UNSET" && c.declaredDriver !== undefined && c.declaredDriver !== null)
      return err("Estado impossível em " + id + ": presence UNSET com driver declarado.");   /* [4.8.0.2-15] */
    if (c.declaredDriver !== null){
      if (typeof c.declaredDriver !== "object" || Array.isArray(c.declaredDriver))
        return err("declaredDriver deve ser null ou objeto em " + id);
      if (typeof c.declaredDriver !== "object" || Array.isArray(c.declaredDriver))
        return err("declaredDriver inválido em " + id);
      const eD = extraKeys(c.declaredDriver, ["note"]);
      if (eD.length) return err("Campos extras em declaredDriver de " + id + ": " + eD.join(", "));
      if (!("note" in c.declaredDriver)) return err("declaredDriver sem nota em " + id + " — shape não canônico.");
      if (typeof c.declaredDriver.note !== "string") return err("Nota de driver deve ser texto em " + id);
      if (c.declaredDriver.note.trim() === "")                 /* [4.8.0.3-20] editor converte vazio em null */
        return err("Nota de driver vazia em " + id + " — o editor representa esse estado como null.");
      /* [4.8.0.6-C5] o editor grava drv.value.trim(): " motivo " não é representação canônica */
      if (!isTrimmed(c.declaredDriver.note))
        return err("Nota de driver em " + id + " tem espaços nas bordas — o editor grava " +
                   JSON.stringify(c.declaredDriver.note.trim()) + ".");
      { const e = strFieldError(c.declaredDriver.note, "Nota de driver em " + id); if (e) return err(e); }
    }
  }
  {                                                          /* [4.8.0.3-8] contrato COMPLETO no schema v1 */
    const A2 = L.architectureContext;
    if (!A2 || typeof A2 !== "object" || Array.isArray(A2)) return err("Architecture context ausente ou inválido.");
    const eA = extraKeys(A2, SES.archKeys());
    if (eA.length) return err("Campo de arquitetura desconhecido: " + eA.join(", "));
    const missing = SES.archKeys().filter(k => !(k in A2));
    if (missing.length)
      return err("Architecture context incompleto — campos ausentes: " + missing.join(", ") +
                 ". O schema v1 exige o conjunto completo para que a importação não herde o contexto anterior.");
    const AV = SES.archValues();
    for (const k of Object.keys(A2))
      if (!(AV[k] || []).includes(A2[k]))
        return err("Valor de arquitetura inválido em " + k + ": " + String(A2[k]));
  }
  {
    /* [4.8.0.6-B3] o exporter SEMPRE grava declaredPlatforms (vazia quando nada foi declarado):
       propriedade ausente não é equivalente a [] */
    if (L.declaredPlatforms === undefined)
      return err("declaredPlatforms ausente — o schema v1 exige a propriedade; " +
                 "'nenhuma plataforma declarada' é representada pela lista vazia [].");
    if (!Array.isArray(L.declaredPlatforms)) return err("Plataformas devem ser uma lista.");
    /* [4.8.0.7-D] duplicatas de platform NÃO são estado canônico: readDraftFromDom() reconstrói a lista como
       others.filter(p => p.platform!=="fortigate").concat([entry]) — no máximo UMA entrada por plataforma —
       e nenhum caminho do runtime cria uma segunda entrada da mesma plataforma. Além disso duas entradas
       iguais duplicariam os sids empilhados por deriveLicensedContext(). Recusado antes do commit. */
    const seenPlat = new Set();
    for (const p of L.declaredPlatforms){
      if (p && typeof p === "object" && !Array.isArray(p)){
        if (seenPlat.has(p.platform))
          return err("Plataforma declarada em duplicidade: " + String(p.platform) +
                     " — o editor mantém no máximo uma entrada por plataforma.");
        seenPlat.add(p.platform);
      }
    }
    for (const p of L.declaredPlatforms){
      if (!p || typeof p !== "object" || Array.isArray(p)) return err("Entrada de plataforma inválida.");
      const eP = extraKeys(p, PLATFORM_KEYS);
      if (eP.length) return err("Campos extras em plataforma: " + eP.join(", "));
      if (!SES.platforms().includes(p.platform)) return err("Plataforma desconhecida: " + String(p.platform));
      if (!(p.bundle === null || p.bundle === undefined || SES.bundles().includes(p.bundle)))
        return err("Bundle desconhecido: " + String(p.bundle));
      if (p.bundle !== null && p.bundle !== undefined){        /* [4.8.0.3-3] mesma invariante de validateConfigV32 */
        const ap = V32.BUNDLES[p.bundle].appliesTo;
        if (ap !== p.platform)
          return err("Bundle " + p.bundle + " não se aplica à plataforma " + String(p.platform) +
                     " (appliesTo: " + ap + ").");
      }
      /* [4.8.0.3-17] notes: string opcional; o owner nunca guarda outro tipo */
      if (p.notes !== undefined){
        { const e = strFieldError(p.notes, "Notas de plataforma"); if (e) return err(e); }
      }
      if (p.subscriptions !== undefined){
        if (!Array.isArray(p.subscriptions)) return err("Subscriptions deve ser lista.");
        /* [4.8.0.7-D] a UI monta subs por Object.keys(SECURITY_SUBSCRIPTIONS).filter(checkbox) — chaves de
           objeto são únicas por construção, logo repetição não é produzível; deriveLicensedContext() ainda
           deduplica via Set, portanto nenhum contrato de runtime depende de preservá-la. */
        const seenSub = new Set();
        for (const sid of p.subscriptions){
          if (typeof sid !== "string") return err("Subscription inválida (tipo).");
          if (!SES.subs().includes(sid)) return err("Subscription desconhecida: " + sid);
          if (seenSub.has(sid))
            return err("Subscription declarada em duplicidade: " + sid +
                       " — os checkboxes do editor não produzem repetição.");
          seenSub.add(sid);
        }
      }
    }
  }
  {
    /* [4.8.0.6-B4] SESSION_SIGNALS é inicializado para TODOS os SIGNAL_IDS e o exporter grava todos:
       sinal não declarado é "unset" explícito, nunca propriedade ausente */
    if (L.signals === undefined) return err("Sinais ausentes — o schema v1 exige o bloco completo de sinais.");
    if (!L.signals || typeof L.signals !== "object" || Array.isArray(L.signals)) return err("Sinais inválidos.");
    const eSg = extraKeys(L.signals, SES.signalIds());
    if (eSg.length) return err("Sinal desconhecido: " + eSg.join(", "));
    const missSg = SES.signalIds().filter(s => !(s in L.signals));
    if (missSg.length)
      return err("Sinais incompletos — ausentes: " + missSg.join(", ") +
                 '. Sinal não declarado é representado por "unset".');
    for (const k of Object.keys(L.signals))
      if (!SES.signalValues().includes(L.signals[k]))
        return err("Valor de sinal inválido em " + k + ": " + JSON.stringify(L.signals[k]));
  }
  /* target */
  const T = I.targetProfile;
  if (!T || typeof T !== "object" || Array.isArray(T) || !T.overrides ||
      typeof T.overrides !== "object" || Array.isArray(T.overrides)) return err("Cenário-alvo inválido.");
  const eT = extraKeys(T, ["overrides"]); if (eT.length) return err("Campos extras no cenário-alvo: " + eT.join(", "));
  for (const k of Object.keys(T.overrides)){
    if (!canonIds.includes(k)) return err("Alvo para prática desconhecida: " + k);
    const v = T.overrides[k];
    if (!(Number.isInteger(v) && v >= 0 && v <= 3)) return err("Nível-alvo inválido em: " + k);
    const cur = A.answers[k];      /* [4.8.0.2-17] paridade: a UI só oferece níveis SUPERIORES ao confirmado e
                                       revalidateTargets remove o override quando current >= target */
    if (cur !== undefined && cur !== null && cur !== "NA" && v <= cur)
      return err("Nível-alvo deve ser superior ao nível atual confirmado em: " + k);
  }
  /* refinement */
  const R = I.operationalRefinement;
  if (!R || typeof R !== "object" || Array.isArray(R) || !R.answers ||
      typeof R.answers !== "object" || Array.isArray(R.answers)) return err("Aprofundamento inválido.");
  const eR = extraKeys(R, ["answers"]); if (eR.length) return err("Campos extras no aprofundamento: " + eR.join(", "));
  const refIds = SES.refIds();
  for (const k of Object.keys(R.answers)){
    if (!refIds.includes(k)) return err("Tema de aprofundamento desconhecido: " + k);
    const v = R.answers[k];
    if (!(v === null || (Number.isInteger(v) && v >= 0 && v <= 3))) return err("Valor de aprofundamento inválido: " + k);
  }
  {                                    /* [4.8.0.6-B5] owner COMPLETO: todos os refinement IDs, null explícito */
    const missR = refIds.filter(k => !(k in R.answers));
    if (missR.length)
      return err("Aprofundamento incompleto — temas ausentes: " + missR.join(", ") +
                 ". 'Não respondido' é representado por null, não pela ausência da propriedade.");
  }
  return { ok:true };
}
/* ---------- [O] compatibilidade pura ---------- */
function sessionCompatibility(doc){
  const m = buildMeta();
  if (doc.engineSha256 !== m.engineSha256)
    return { compatible:false, reason:"engine",
      message:"Esta sessão foi criada com outro engine de maturidade. Para preservar a fidelidade histórica, a importação foi bloqueada nesta versão.",
      sourceEngine: doc.engineSha256, currentEngine: m.engineSha256,
      sourceTool: doc.toolVersion, currentTool: m.toolVersion };
  if (doc.toolVersion !== m.toolVersion)
    return { compatible:true, notice:"A sessão foi criada em outra versão da ferramenta, mas usa o mesmo engine de maturidade. Os resultados serão recalculados nesta versão." };
  return { compatible:true, notice:null };
}
/* ---------- [N] commit atômico por allowlist ---------- */
/* [4.8.0.1-11] normalização para candidato ISOLADO — nenhum owner global é tocado aqui */
/* [4.8.0.6-B6] a normalization NÃO fabrica default para propriedade ausente de owner completo.
   Ausência morre na validation; aqui ela vira exceção (importSessionDocument devolve erro sem tocar
   em nenhum owner global), jamais null/UNSET/"unset"/[] inventados. */
function requireComplete(obj, ids, what){
  const miss = ids.filter(k => !(k in obj));
  if (miss.length) throw new Error("owner canônico incompleto em " + what + ": " + miss.join(", "));
  return obj;
}
function normalizeSessionDocument(doc){
  const I = doc.inputs, A = I.assessment, L = I.technologyLandscape;
  requireComplete(A.answers, SES.qIds(), "assessment.answers");
  requireComplete(L.capabilities, SES.landscapeIds(), "technologyLandscape.capabilities");
  if (!Array.isArray(L.declaredPlatforms))
    throw new Error("owner canônico incompleto em technologyLandscape.declaredPlatforms: propriedade ausente");
  requireComplete(L.signals, SES.signalIds(), "technologyLandscape.signals");
  requireComplete(I.operationalRefinement.answers, SES.refIds(), "operationalRefinement.answers");
  const cand = {
    arq: (A.archetype === null ? null : A.archetype),
    ans: QS.map(q => A.answers[q.id]),
    /* notes/targetOverrides permanecem SPARSE por contrato — ausência é semântica declarada, não default */
    notes: QS.map(q => (A.notes && typeof A.notes[q.id] === "string") ? A.notes[q.id] : ""),
    priorities: (I.priorities || []).slice(),
    landscape: {}, arch: {}, platforms: [], signals: {},
    targetOverrides: {}, refinement: {}
  };
  Object.keys(L.capabilities).forEach(id => {
    const c = L.capabilities[id];
    cand.landscape[id] = {
      presence: c.presence,
      solutions: (c.solutions || []).map(sol => {
        const out = {};
        SOLUTION_KEYS.forEach(k => { if (sol[k] !== undefined)
          out[k] = (k === "coveredCapabilities") ? sol[k].slice() : sol[k]; });
        return out; }),
      declaredDriver: (c.declaredDriver === null) ? null : { note: c.declaredDriver.note } };
  });
  /* [4.8.0.3-7/8] candidato autossuficiente: NENHUM valor vem da sessão aberta */
  SES.archKeys().forEach(k => { cand.arch[k] = L.architectureContext[k]; });
  cand.platforms = L.declaredPlatforms.map(p => {              /* [4.8.0.2-6] optional fields do owner canônico */
    const out = {};
    PLATFORM_KEYS.forEach(k => { if (p[k] !== undefined)
      out[k] = (k === "subscriptions") ? p[k].slice() : p[k]; });
    return out; });
  Object.keys(L.signals).forEach(sig => { cand.signals[sig] = L.signals[sig]; });
  Object.keys(I.targetProfile.overrides).forEach(k => { cand.targetOverrides[k] = I.targetProfile.overrides[k]; });
  Object.keys(I.operationalRefinement.answers).forEach(k => { cand.refinement[k] = I.operationalRefinement.answers[k]; });
  return cand;
}
/* [4.8.0.2-8/9/10/12] COMMIT VERDADEIRAMENTE ATÔMICO
   - não usa uxNewSession (que resetava e renderizava ANTES do commit terminar);
   - snapshot dos owners é tirado antes de qualquer escrita;
   - nenhum render/modal/helper com efeito colateral dentro da janela de commit;
   - qualquer exceção durante as escritas dispara rollback completo do snapshot. */
function snapshotCanonicalOwners(){
  return {
    arq: arq,
    ans: ans.slice(),
    notes: notes.slice(),
    priorities: [...businessPriority],
    landscape: JSON.parse(JSON.stringify(V32.TECH_LANDSCAPE)),
    arch: JSON.parse(JSON.stringify(V32.ARCHITECTURE_CONTEXT)),
    platforms: JSON.parse(JSON.stringify(V32.PLATFORM_CONTEXT.declaredPlatforms)),
    signals: JSON.parse(JSON.stringify(V32.SESSION_SIGNALS)),
    target: JSON.parse(JSON.stringify(TARGET_PROFILE.overrides)),
    refinement: JSON.parse(JSON.stringify(OPERATIONAL_REFINEMENT.answers)),
    step: step
  };
}
function restoreCanonicalOwners(snap){
  arq = snap.arq;
  for (let k = 0; k < ans.length; k++){ ans[k] = snap.ans[k]; notes[k] = snap.notes[k]; }
  businessPriority.clear(); snap.priorities.forEach(id => businessPriority.add(id));
  Object.keys(V32.TECH_LANDSCAPE).forEach(id => { delete V32.TECH_LANDSCAPE[id]; });
  Object.keys(snap.landscape).forEach(id => { V32.TECH_LANDSCAPE[id] = snap.landscape[id]; });
  Object.keys(snap.arch).forEach(k => { V32.ARCHITECTURE_CONTEXT[k] = snap.arch[k]; });
  V32.PLATFORM_CONTEXT.declaredPlatforms = snap.platforms;
  Object.keys(snap.signals).forEach(k => { V32.SESSION_SIGNALS[k] = snap.signals[k]; });
  Object.keys(TARGET_PROFILE.overrides).forEach(k => { delete TARGET_PROFILE.overrides[k]; });
  Object.keys(snap.target).forEach(k => { TARGET_PROFILE.overrides[k] = snap.target[k]; });
  Object.keys(snap.refinement).forEach(k => { OPERATIONAL_REFINEMENT.answers[k] = snap.refinement[k]; });
  step = snap.step;
}
function commitCanonicalOwners(cand){
  const snap = snapshotCanonicalOwners();
  try {
    arq = cand.arq;
    for (let k = 0; k < QS.length; k++){ ans[k] = cand.ans[k]; notes[k] = cand.notes[k]; }
    businessPriority.clear(); cand.priorities.forEach(id => businessPriority.add(id));
    Object.keys(V32.TECH_LANDSCAPE).forEach(id => { delete V32.TECH_LANDSCAPE[id]; });
    Object.keys(cand.landscape).forEach(id => { V32.TECH_LANDSCAPE[id] = cand.landscape[id]; });
    Object.keys(cand.arch).forEach(k => { V32.ARCHITECTURE_CONTEXT[k] = cand.arch[k]; });
    V32.PLATFORM_CONTEXT.declaredPlatforms = cand.platforms;
    Object.keys(cand.signals).forEach(k => { V32.SESSION_SIGNALS[k] = cand.signals[k]; });
    Object.keys(TARGET_PROFILE.overrides).forEach(k => { delete TARGET_PROFILE.overrides[k]; });
    Object.keys(cand.targetOverrides).forEach(k => { TARGET_PROFILE.overrides[k] = cand.targetOverrides[k]; });
    Object.keys(cand.refinement).forEach(k => { OPERATIONAL_REFINEMENT.answers[k] = cand.refinement[k]; });
    tgtNotices = [];                                  /* metadata transitória não atravessa a importação */
    refStage = "done"; refReturn = null;
    return { ok:true };
  } catch(e){
    restoreCanonicalOwners(snap);                     /* [4.8.0.2-10] rollback completo */
    return { ok:false, error:"Falha durante a aplicação da sessão; a sessão anterior foi restaurada.",
             rolledBack:true, cause:e.message };
  }
}
/* [S/Y] recompute integral pelos caminhos congelados → Results */
function recomputeAfterImport(){ step = RESULTS_STEP; render(); }
function importSessionDocument(doc){
  const v = validateSessionDocument(doc);        if (!v.ok) return v;
  const c = sessionCompatibility(doc);           if (!c.compatible) return { ok:false, error:c.message, compat:c };
  let cand;                                      /* candidato completo ANTES de qualquer escrita */
  try { cand = normalizeSessionDocument(doc); }
  catch(e){ return { ok:false, error:"Falha ao normalizar o documento: " + e.message }; }
  const commit = commitCanonicalOwners(cand);    /* sem render, sem uxNewSession, com rollback */
  if (!commit.ok) return commit;
  recomputeAfterImport();                        /* render SOMENTE após o commit completo */
  return { ok:true, notice:c.notice };
}
function sessionPreview(doc){
  const A = doc.inputs.assessment, L = doc.inputs.technologyLandscape;
  const answered = Object.values(A.answers||{}).filter(v=>v!==null).length;
  const hasLand = Object.values(L.capabilities||{}).some(c=>c.presence!=="UNSET") ||
    Object.values(L.architectureContext||{}).some(v=>!["unknown","undefined","uninformed"].includes(v));
  return { label: doc.label || null, createdAt: doc.createdAt || null, toolVersion: doc.toolVersion,
    answered, landscape: hasLand,
    target: Object.keys(doc.inputs.targetProfile.overrides).length > 0,
    refinement: Object.values(doc.inputs.operationalRefinement.answers).some(v=>v!==null) };
}
function sessionHasContent(){
  return ans.some(v=>v!==null) || businessPriority.size>0 || !V32.isLegacyModeV32() ||
    Object.keys(TARGET_PROFILE.overrides).length>0 ||
    Object.values(OPERATIONAL_REFINEMENT.answers).some(v=>v!==null);
}
if (window.__DEV) Object.assign(window.__DEV, {
  captureCanonicalInputs, buildSessionDocument, sessionFilename, validateSessionDocument, normalizeSessionDocument,
  commitCanonicalOwners, snapshotCanonicalOwners, restoreCanonicalOwners,
  sessionCompatibility, importSessionDocument, sessionPreview,
  downloadSession, prepareSessionExport, sessionHasContent, scalarLen, isWellFormedUnicode, utf8ByteLength,
  SESSION_MAX_BYTES, SESSION_MAX_FIELD, SESSION_MAX_LABEL, SESSION_SCHEMA_VERSION
});

/* ---------- [H/L/M/AD] UI ---------- */
function sesModal(opts){ return uxModal(opts); }
function openExportModal(origin){
  uxModal({ title:"Exportar sessão",
    bodyHTML:`<label class="ses-lab" for="ses-label">Nome da sessão/conta · opcional</label>
      <input id="ses-label" type="text" maxlength="200" class="ses-input" autocomplete="off">
      <p class="ux-micro ses-warn">O arquivo pode conter informações sobre tecnologias, fornecedores, observações e
      contexto do ambiente do cliente. Armazene-o de acordo com a política aplicável.</p>`,
    confirmLabel:"Baixar sessão (.json)", origin,
    onConfirm:()=>{ const r = downloadSession(labelBuf);   /* [4.8] valor capturado ao vivo */
      if (!r.ok) sesExportError(r.error, origin); return r; },
    focusSelector:"#ses-label" });
  let labelBuf = "";
  const el = document.getElementById("ses-label");
  if (el) el.addEventListener("input", ()=>{ labelBuf = el.value; });
}
function openImportPicker(origin){
  const input = document.createElement("input");
  input.type = "file"; input.accept = "application/json,.json"; input.style.display = "none";
  input.setAttribute("aria-label","Selecionar arquivo de sessão");
  document.body.appendChild(input);
  input.onchange = async ()=>{
    const f = input.files && input.files[0]; input.remove();
    if (!f) return;
    if (f.size > SESSION_MAX_BYTES) return sesError("Arquivo maior que o limite de 1 MiB.", origin);
    let doc;
    try { doc = JSON.parse(await f.text()); }
    catch { return sesError("Arquivo não é um JSON válido.", origin); }
    const v = validateSessionDocument(doc);
    if (!v.ok) return sesError(v.error, origin);
    const c = sessionCompatibility(doc);
    if (!c.compatible) return sesEngineMismatch(c, origin);
    showImportPreview(doc, c, origin);
  };
  input.click();
}
function sesError(msg, origin){
  uxModal({ title:"Não foi possível importar", bodyHTML:`<p class="ses-err" role="alert">${esc32(msg)}</p>`,
    confirmLabel:"Entendi", origin, onConfirm:()=>{} });
}
/* [4.8.0.7-A] o export recusado é um erro LOCAL explícito: nenhum arquivo foi gerado e a sessão continua ativa */
function sesExportError(msg, origin){
  uxModal({ title:"Não foi possível exportar", bodyHTML:`<p class="ses-err" role="alert">${esc32(msg)}</p>`,
    confirmLabel:"Entendi", origin, onConfirm:()=>{} });
}
function sesEngineMismatch(c, origin){
  uxModal({ title:"Importação bloqueada", origin, confirmLabel:"Entendi", onConfirm:()=>{},
    bodyHTML:`<p role="alert">${esc32(c.message)}</p>
      <ul class="ses-meta"><li>Engine do arquivo: <code>${esc32(String(c.sourceEngine).slice(0,16))}…</code></li>
      <li>Engine atual: <code>${esc32(String(c.currentEngine).slice(0,16))}…</code></li>
      <li>Versão do arquivo: ${esc32(c.sourceTool)}</li>
      <li>Versão atual: ${esc32(c.currentTool)}</li></ul>` });
}
function showImportPreview(doc, compat, origin){
  const p = sessionPreview(doc);
  const yn = b => b ? "sim" : "não";
  const replace = sessionHasContent()
    ? `<p class="ses-warn" role="alert">Importar esta sessão substituirá a sessão atual nesta janela.</p>` : "";
  uxModal({ title:"Importar sessão", origin,
    confirmLabel: sessionHasContent() ? "Importar e substituir" : "Importar",
    bodyHTML:`<ul class="ses-meta">
      ${p.label?`<li>Sessão: <b>${esc32(p.label)}</b></li>`:""}
      ${p.createdAt?`<li>Criada em: ${esc32(p.createdAt)}</li>`:""}
      <li>Versão da ferramenta: ${esc32(p.toolVersion)}</li>
      <li>Engine: compatível</li>
      <li>Respostas core: ${p.answered} de ${QS.length}</li>
      <li>Contexto tecnológico informado: ${yn(p.landscape)}</li>
      <li>Cenário-alvo: ${yn(p.target)}</li>
      <li>Aprofundamento: ${yn(p.refinement)}</li></ul>
      ${compat.notice?`<p class="ux-micro">${esc32(compat.notice)}</p>`:""}${replace}`,
    onConfirm:()=>{ const r = importSessionDocument(doc); if (!r.ok) sesError(r.error, origin); } });
}
/* [AE] hooks estruturais explícitos — sem match por texto */
function sesResultsControls(app){
  if (document.getElementById("ses-actions")) return;
  const anchor = document.getElementById("ux-sessioncontrols") || app.querySelector(".actions") || app;
  const box = document.createElement("div"); box.id = "ses-actions"; box.className = "ses-actions";
  box.innerHTML = `<button class="btn2" id="ses-export" type="button">Exportar sessão</button>
    <button class="btn2" id="ses-import" type="button">Importar sessão</button>`;
  anchor.appendChild(box);
  box.querySelector("#ses-export").onclick = e => openExportModal(e.currentTarget);
  box.querySelector("#ses-import").onclick = e => openImportPicker(e.currentTarget);
}
function sesHomeControls(app){
  if (document.getElementById("ses-import-home")) return;
  const host = document.getElementById("ux-home") || app.querySelector("section.screen"); if (!host) return;
  const b = document.createElement("button");
  b.className = "btn2"; b.id = "ses-import-home"; b.type = "button"; b.textContent = "Importar sessão";
  host.appendChild(b);
  b.onclick = e => openImportPicker(e.currentTarget);
}
window.__sesDecor = function(app, screen){
  try { if (screen === "results") sesResultsControls(app); if (screen === "home") sesHomeControls(app); }
  catch(e){ console.error("Session UI:", e.message); }
};
if (window.__DEV) Object.assign(window.__DEV, { openExportModal, openImportPicker, showImportPreview });
