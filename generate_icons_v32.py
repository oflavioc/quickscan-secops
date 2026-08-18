#!/usr/bin/env python3
"""Gerador determinístico de ui_icons_v32.js a partir de icons_v32_source/ + manifest.
Falha se: source ausente · hash divergente · iconKey duplicado · mapping → asset inexistente."""
import base64, json, hashlib, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
ICON_MAP = {"fortigate": "FortiGate", "forticlient": "FortiClient", "fortimail-wss": "FortiMail-Workplace-Security", "ad-security-assessment": "FortiGuard-Labs", "compromise-assessment": "FortiGuard-Labs", "dfir": "FortiGuard-IR-Service", "fortiai-assist": "FortiAI-Assist", "fortiaigate": "FortiAIGate", "fortianalyzer": "FortiAnalyzer", "fortiauthenticator": "FortiAuthenticator", "fortideceptor": "FortiDeceptor", "fortidlp": "FortiDLP", "fortiedr": "FortiEDR", "fortiendpoint": "FortiEndpoint", "fortiguard-mdr": "FortiGuard-MDR-Service", "fortiguard-socaas": "SOCaaS", "fortimail": "FortiMail", "fortimail-cloud-saas": "FortiMail-Cloud-SaaS", "fortindr-cloud": "FortiNDR-Cloud", "fortindr-onprem": "FortiNDR", "fortipam": "FortiPAM", "fortirecon": "FortiRecon", "fortisandbox": "FortiSandbox", "fortisiem": "FortiSIEM", "fortisiem-cloud": "FortiSIEM-Cloud", "fortisoar": "FortiSOAR", "fortisoc": "FortiSOC", "fortixdr": "FortiXDR", "ir-plan-development": "FortiGuard-IR-Service", "ir-playbook-development": "FortiGuard-IR-Service", "ir-readiness-subscription": "FortiGuard-IR-Service", "ir-training": "FortiGuard-IR-Service", "ndr-family": "FortiNDR", "penetration-testing": "FortiGuard-Labs", "ransomware-readiness-assessment": "FortiGuard-Labs", "red-team-assessment": "FortiGuard-Labs", "soc-assessment": "FortiGuard-Labs", "soc-development-service": "FortiGuard-Labs", "ttx": "FortiGuard-IR-Service", "vulnerability-assessment": "FortiGuard-Labs"}
BASELINE_KEYS = ["SOCaaS"]   # servidos pelo ICONS do baseline em runtime
manifest = json.load(open(HERE/"icons_v32_manifest.json"))
keys = [m["iconKey"] for m in manifest]
assert len(keys)==len(set(keys)), "iconKey duplicado no manifest"
assets = {}
for m in manifest:
    p = HERE/"icons_v32_source"/m["filename"]
    assert p.exists(), "source ausente: "+m["filename"]
    raw = p.read_bytes()
    assert hashlib.sha256(raw).hexdigest()==m["sha256"], "hash divergente: "+m["filename"]
    assets[m["iconKey"]] = "data:image/svg+xml;base64," + base64.b64encode(raw).decode()
valid = set(keys) | set(BASELINE_KEYS)
bad = sorted(set(ICON_MAP.values()) - valid)
assert not bad, "mapping aponta para asset inexistente: "+", ".join(bad)
js  = "/* ICONS V3.2 · gerado deterministicamente por generate_icons_v32.py a partir de icons_v32_source/ */\n"
js += "/* Chaves servidas pelo baseline (ICONS legado): " + ", ".join(BASELINE_KEYS) + " */\n"
js += "const ICON_MAP_V32 = " + json.dumps(ICON_MAP, ensure_ascii=False, sort_keys=True) + ";\n"
js += "const ICONS_V32 = " + json.dumps(assets, sort_keys=True) + ";\n"
(HERE/"ui_icons_v32.js").write_text(js, encoding="utf-8")
print("ui_icons_v32.js:", len(assets), "assets · sha256:", hashlib.sha256(js.encode()).hexdigest()[:16])
