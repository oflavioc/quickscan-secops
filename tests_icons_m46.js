/* TESTES · PHASE 4.6 — Official Asset Completeness & Icon Governance */
const path=require("path"),fs=require("fs"),crypto=require("crypto");const {JSDOM}=require("jsdom");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const MAN=JSON.parse(fs.readFileSync(path.join(__dirname,"icons_v32_manifest.json"),"utf8"));
const GEN=fs.readFileSync(path.join(__dirname,"generate_icons_v32.py"),"utf8");
const DEC=fs.readFileSync(path.join(__dirname,"ICON_ASSET_DECISIONS_V32.md"),"utf8");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});return{w:dom.window,d:dom.window.document};}
const results=[];function T(id,l,fn){let ok=false,e="";try{ok=!!fn()}catch(x){e=" ["+x.message+"]"}results.push({id,ok});console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
const sha=f=>crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,f))).digest("hex");
const BASE8=["endpoint-family","forticlient","fortigate","fortimail-family","fortimail-wss","fortisat","identity-family","soc-platform-family"];

T("A1+A2","baseline de 8 fallbacks com decision explícita para cada um no decisions doc",()=>{
  return BASE8.every(id=>DEC.includes("## "+id)||DEC.includes(id)) &&
    (DEC.match(/OFFICIAL_ASSET_ACCEPTED/g)||[]).length===3 &&
    DEC.includes("FALLBACK_RETAINED_NO_ASSET") &&
    (DEC.match(/FALLBACK_RETAINED_ABSTRACTION/g)||[]).length>=1;
});
T("A3+A4+A5","cada fallback removido tem asset oficial com provenance; source SHA confere",()=>{
  const news=MAN.filter(m=>m.provenance);
  const ids=news.map(m=>m.provenance.canonicalItem).sort();
  return JSON.stringify(ids)===JSON.stringify(["forticlient","fortigate","fortimail-wss"]) &&
    news.every(m=>m.provenance.officialSource && m.provenance.originalFilename && m.provenance.retrievalReference &&
      m.provenance.sourceSha256===m.sha256 &&
      crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,"icons_v32_source",m.filename))).digest("hex")===m.sha256);
});
T("A6+A7+A8+A29","generator EXECUTADO 2x em temp: gen1==gen2==publicado; manifest↔registry sync",()=>{
  const os=require("os"), cp=require("child_process");
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"icons46-"));
  try{
    fs.copyFileSync(path.join(__dirname,"generate_icons_v32.py"), path.join(tmp,"generate_icons_v32.py"));
    fs.copyFileSync(path.join(__dirname,"icons_v32_manifest.json"), path.join(tmp,"icons_v32_manifest.json"));
    fs.mkdirSync(path.join(tmp,"icons_v32_source"));
    fs.readdirSync(path.join(__dirname,"icons_v32_source")).forEach(f=>
      fs.copyFileSync(path.join(__dirname,"icons_v32_source",f), path.join(tmp,"icons_v32_source",f)));
    const run=()=>{ const r=cp.spawnSync("python3",["generate_icons_v32.py"],{cwd:tmp});
      if(r.status!==0) throw new Error("python3 indisponível ou generator falhou: "+r.stderr);
      return crypto.createHash("sha256").update(fs.readFileSync(path.join(tmp,"ui_icons_v32.js"))).digest("hex"); };
    const g1=run(), g2=run();
    const pub=crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,"ui_icons_v32.js"))).digest("hex");
    const {w}=boot();const reg=w.eval("Object.keys(ICONS_V32).sort()");
    const keys=MAN.map(m=>m.iconKey).sort();
    return g1===g2 && g2===pub && JSON.stringify(reg)===JSON.stringify(keys) && MAN.length===26;
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
});
T("A9+A27+A28","fixture local 4.5.0.2: 23 imutáveis + delta autorizado exato = 26",()=>{
  const fx=JSON.parse(fs.readFileSync(path.join(__dirname,"icons_v32_baseline_4502.json"),"utf8"));
  const names=Object.keys(fx.files);
  const cur=fs.readdirSync(path.join(__dirname,"icons_v32_source")).filter(f=>f.endsWith(".svg"));
  const extra=cur.filter(f=>!names.includes(f)).sort();
  return fx.baseline==="3.4.0-dev.4.5.0.2" && fx.sourceCount===23 && names.length===23 &&
    names.every(f=>cur.includes(f) && sha("icons_v32_source/"+f)===fx.files[f]) &&
    JSON.stringify(extra)===JSON.stringify(["FortiClient.svg","FortiGate.svg","FortiMail-Workplace-Security.svg"]) &&
    cur.length===26;
});
T("A10-A14","famílias/abstrações seguem fallback: nenhum produto específico atribuído",()=>{
  const {w}=boot();const map=w.eval("ICON_MAP_V32");
  return ["endpoint-family","fortimail-family","identity-family","soc-platform-family"].every(id=>!(id in map)) &&
    !GEN.includes('"endpoint-family"') && !GEN.includes('"identity-family"') &&
    !GEN.includes('"soc-platform-family"') && !GEN.match(/"fortimail-family"\s*:/);
});
T("A15+A16","novos mappings usam IDs existentes do registry; portfolio inalterado",()=>{
  const {w}=boot();const V=w.__DEV.V32;
  const all=Object.keys(V.OFFERINGS).concat(Object.keys(V.SERVICES)).concat(["fortigate"]);
  const map=w.eval("ICON_MAP_V32");
  return ["fortigate","forticlient","fortimail-wss"].every(id=>all.includes(id) && map[id]) &&
    Object.keys(V.OFFERINGS).length+Object.keys(V.SERVICES).length===45-1+1;  /* universo auditado estável */
});
T("A17-A19","ctx/target/journey/narrative byte-idênticos semanticamente",()=>{
  const {w,d}=boot();IDS.forEach(id=>w.__DEV.setAnswerById(id,id==="logs"?0:1));w.__DEV.setArq(0);
  w.__DEV.setPriorities(["logs"]);w.__DEV.showResults();
  const ctx=JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  w.__DEV.setTarget("logs",3);w.__DEV.showResults();
  const en=Array.from(d.querySelectorAll(".ux-tgt-enabler")).map(e=>e.dataset.eid).join(",");
  const nar=JSON.stringify(w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot()));
  w.__DEV.showResults();
  return JSON.stringify(w.__DEV.V32.buildRecommendationContext())===ctx &&
    Array.from(d.querySelectorAll(".ux-tgt-enabler")).map(e=>e.dataset.eid).join(",")===en &&
    JSON.stringify(w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot()))===nar;
});
T("A20+A21","mesma entidade → mesmo output em qualquer superfície; fallback restante determinístico",()=>{
  const {w}=boot();
  const f=id=>w.eval(`(window.__V32UI.iconFor("${id}","X"))`);
  return f("fortigate")===f("fortigate") && /data-icon="FortiGate"/.test(f("fortigate")) &&
    /data-icon="FortiClient"/.test(f("forticlient")) &&
    /FortiMail-Workplace-Security/.test(f("fortimail-wss")) &&
    /v32-icon-fb/.test(f("fortisat")) && f("fortisat")===f("fortisat") &&
    /v32-icon-fb/.test(f("endpoint-family"));
});
T("A22-A25","zero fuzzy matching; runtime self-contained (nenhuma URL externa, nenhum SVG via rede)",()=>{
  const iconforSrc=HTML.match(/function iconFor\(itemId, name\)\{[\s\S]*?\n\}/)[0];
  const icons=HTML.match(/const ICONS_V32 = \{.*?\};\n/s)[0];
  return !/includes\(|startsWith\(|indexOf\(|toLowerCase\(\)\.match/.test(iconforSrc.split("const base")[0]) &&
    (icons.match(/data:image\/svg\+xml;base64,/g)||[]).length===26 &&
    !/https?:\/\//.test(icons);
});
T("A26","suíte self-contained: sem paths absolutos externos, sem dependência fora do package",()=>{
  const self=fs.readFileSync(__filename,"utf8");
  const bad=["/tm"+"p/","/ho"+"me/","C:"+"\\\\"];
  return bad.every(b=>!self.includes(b)) && !self.includes("old_"+"hashes");
});
T("A30","provenance semanticamente exata: content none nos 3; rename só no WSS; hashes conferem",()=>{
  const P=Object.fromEntries(MAN.filter(m=>m.provenance).map(m=>[m.provenance.canonicalItem,m]));
  const ok1=["fortigate","forticlient"].every(id=>
    P[id].provenance.contentTransformation.startsWith("none") && P[id].provenance.packagingRename==="none");
  const wss=P["fortimail-wss"].provenance;
  return ok1 && wss.contentTransformation.startsWith("none") && wss.packagingRename!=="none" &&
    wss.packagingRename.includes("artwork/content unchanged") &&
    Object.values(P).every(m=>m.provenance.publishedSha256===m.provenance.sourceSha256 &&
      sha("icons_v32_source/"+m.filename)===m.provenance.sourceSha256);
});
T("A31","source archive trace: SHA-256 válido e consistente entre os 3 assets",()=>{
  const shas=[...new Set(MAN.filter(m=>m.provenance).map(m=>m.provenance.sourceArchiveSha256))];
  return shas.length===1 && /^[a-f0-9]{64}$/.test(shas[0]) &&
    fs.readFileSync(path.join(__dirname,"ICON_ASSET_DECISIONS_V32.md"),"utf8").includes(shas[0]);
});
const fail=results.filter(r=>!r.ok);
console.log("\nICONS 4.6: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
