/* TESTES UI · PHASE 3.3.1 — Fortinet Card Iconography (jsdom) */
const path=require("path"),fs=require("fs");
const {JSDOM}=require("jsdom");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});return{w:dom.window,d:dom.window.document};}
function answerAll(w,v,o){IDS.forEach(id=>w.__DEV.setAnswerById(id,(o&&id in o)?o[id]:v));w.__DEV.setArq(0);}
function save(w,d,edits){d.querySelector("#v32cta").click();Object.entries(edits).forEach(([cap,s])=>{
  const g3=d.querySelector('details[data-gid="g3"]');if(g3)g3.open=true;
  const p=d.querySelector("#v32-pres-"+cap);p.value=s.presence;p.dispatchEvent(new w.Event("change"));
  (s.solutions||[]).forEach((sol,i)=>{d.querySelector("#v32-add-"+cap).click();
    Object.entries(sol).forEach(([f,val])=>{const el=d.querySelector(`#v32-sol-${cap}-${i}-${f}`);if(el)el.value=val;});});});
  d.querySelector("#v32save").click();}
const results=[];function T(id,l,fn){let ok=false,e="";try{ok=!!fn()}catch(x){e=" ["+x.message+"]"}results.push({id,ok});console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
const q=(d,s)=>d.querySelector(s),txt=el=>el?el.textContent:"";
const cardOf=(d,cap)=>Array.from(d.querySelectorAll(".v32-card")).find(c=>c.getAttribute("data-cap")===cap);

T("I1","mapping conhecido → asset esperado (FortiSIEM em analytics whitespace)",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  save(w,d,{"security-analytics":{presence:"NONE"}});
  const img=cardOf(d,"security-analytics").querySelector('img.v32-icon[data-icon="FortiSIEM"]');
  return img && img.getAttribute("alt")==="" && img.getAttribute("src").startsWith("data:image/svg+xml");
});
T("I2","item sem mapping → fallback tipográfico, sem broken image (endpoint-family)",()=>{
  const {w,d}=boot();answerAll(w,1,{endpoint:0});w.__DEV.showResults();
  save(w,d,{"endpoint-detection":{presence:"NONE"}});
  const card=cardOf(d,"endpoint-detection");
  const fb=card.querySelector('.v32-icon-fb[data-icon="fallback"]');
  const imgs=Array.from(card.querySelectorAll("img.v32-icon"));
  return fb && txt(fb).trim().length>0 && imgs.every(i=>i.getAttribute("src").startsWith("data:"));
});
T("I3","family unresolved não usa ícone de variante (nem FortiEndpoint nem FortiEDR)",()=>{
  const {w,d}=boot();answerAll(w,1,{endpoint:0});w.__DEV.showResults();
  save(w,d,{"endpoint-detection":{presence:"NONE"}});
  const card=cardOf(d,"endpoint-detection");
  return !card.querySelector('[data-icon="FortiEndpoint"]') && !card.querySelector('[data-icon="FortiEDR"]') &&
    txt(card).includes("oferta a definir");
});
T("I4","contextual-support recebe ícone real mantendo rótulo contextual (FortiSOAR/knowledge)",()=>{
  const {w,d}=boot();answerAll(w,1,{knowledge:0});w.__DEV.showResults();
  save(w,d,{"knowledge-management":{presence:"NONE"}});
  const card=cardOf(d,"knowledge-management");
  return card.querySelector('[data-icon="FortiSOAR"]') &&
    txt(card).includes("apoio contextual (relação de suporte)") && !txt(card).includes("aquisição candidata");
});
T("I5","offering × service no mesmo card: ícones e subtítulos distintos (incident-management)",()=>{
  const {w,d}=boot();answerAll(w,1,{"incident-response":0});w.__DEV.showResults();
  save(w,d,{"incident-management":{presence:"NONE"}});
  const card=cardOf(d,"incident-management");
  const subs=Array.from(card.querySelectorAll(".v32-subhead")).map(s=>txt(s));
  return card.querySelector('.v32-cand [data-icon="FortiSOAR"]') &&
    card.querySelector('.v32-svc [data-icon="FortiGuard-IR-Service"]') &&
    subs.some(s=>/ofertas/i.test(s)) && subs.some(s=>/serviços/i.test(s));
});
T("I6","registry sem itemId órfão (todo id do ICON_MAP existe em OFFERINGS/SERVICES)",()=>{
  const {w}=boot();const ic=(new Function("return null"),null);
  const {map}=(()=>{const o=boot();return o.w.__DEV.icons();})();
  const V=(new JSDOM(HTML,{runScripts:"dangerously",url:"https://l.test/"})).window.__DEV.V32;
  const orphans=Object.keys(map).filter(id=>!V.OFFERINGS[id] && !V.SERVICES[id]);
  return orphans.length===0;
});
T("I7","todo iconKey declarado existe em ICONS + auditoria mapped/fallback/orphan/missing",()=>{
  const {w,d}=boot();const {map,assets}=w.__DEV.icons();const V=w.__DEV.V32;
  const missing=Object.values(map).filter(k=>!assets.includes(k));
  const orphan=Object.keys(map).filter(id=>!V.OFFERINGS[id]&&!V.SERVICES[id]);
  const all=Object.keys(V.OFFERINGS).concat(Object.keys(V.SERVICES));
  const mapped=all.filter(id=>map[id]).length, fallback=all.length-mapped;
  console.log(`   AUDITORIA ICONOGRAFIA: mapped=${mapped} · fallback=${fallback} · orphan=${orphan.length} · missingIconKey=${missing.length} (universo=${all.length})`);
  return missing.length===0 && orphan.length===0;
});
T("I8","payload do RECOMMENDATION_CONTEXT inalterado pela iconografia",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  save(w,d,{"security-analytics":{presence:"NONE"}});
  const rendered=JSON.stringify(w.__DEV.ctx());
  const fresh=JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  return rendered===fresh && !/"icon/i.test(rendered);
});

T("I9 (A)","SOCaaS usa o asset específico do baseline (data-icon='SOCaaS'), nunca FortiGuard genérico",()=>{
  const {w,d}=boot();answerAll(w,1,{"team-capacity":0});w.__DEV.showResults();
  save(w,d,{"deception":{presence:"NONE"}});
  const card=cardOf(d,"soc-staffing");
  return card.querySelector('.v32-svc [data-icon="SOCaaS"]') &&
    !card.querySelector('.v32-svc [data-icon="FortiGuard"]');
});
T("I10 (C)","allowlist de fallbacks: exatamente a lista declarada, nada além",()=>{
  const {w}=boot();const {map}=w.__DEV.icons();const V=w.__DEV.V32;
  /* [4.6] allowlist reduzida por assets oficiais aceitos (fortigate/forticlient/fortimail-wss) — ICON_ASSET_DECISIONS_V32.md */
const ALLOW=["endpoint-family","fortimail-family","fortisat","identity-family","soc-platform-family"];
  const all=Object.keys(V.OFFERINGS).concat(Object.keys(V.SERVICES));
  const fb=all.filter(id=>!map[id]).sort();
  return JSON.stringify(fb)===JSON.stringify(ALLOW);
});
T("I11 (E)","todos os data URIs decodificam para SVG válido; gerador é reproduzível byte a byte",()=>{
  const {w}=boot();
  const html=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  const m=html.match(/const ICONS_V32 = (\{.*?\});\n/s);
  const assets=JSON.parse(m[1]);
  const allSvg=Object.values(assets).every(v=>{
    const raw=Buffer.from(v.split(",")[1],"base64").toString("utf8");
    return /<svg[\s>]/.test(raw);
  });
  const {execSync}=require("child_process");
  const crypto=require("crypto");
  const h1=crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,"ui_icons_v32.js"))).digest("hex");
  execSync("python3 "+path.join(__dirname,"generate_icons_v32.py"));
  const h2=crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,"ui_icons_v32.js"))).digest("hex");
  return allSvg && h1===h2;
});

const fail=results.filter(r=>!r.ok);
console.log("\nUI 3.3.1: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
