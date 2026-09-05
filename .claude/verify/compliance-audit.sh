#!/usr/bin/env bash
# Auditoria de conformidade: a PRÓPRIA configuração agêntica está íntegra?
#
#   bash .claude/verify/compliance-audit.sh            # todas as seções
#   bash .claude/verify/compliance-audit.sh --rule=X   # uma seção
#
# Seções: hooks, deny, invariantes, suites, paths, known-issues, waivers, backlog
#
# Diferente do run.sh (que verifica artefatos), isto audita o CUMPRIMENTO das
# regras — inclusive da própria configuração: a referência que inspirou esta
# estrutura tinha 3 hooks soltos no disco, desligados, e ninguém percebeu.
# A seção `hooks` existe para isso não acontecer aqui.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
PYBIN=python3; command -v python3 >/dev/null 2>&1 || PYBIN=python

FILTRO=""
for arg in "$@"; do case "$arg" in --rule=*) FILTRO="${arg#--rule=}";; esac; done

PASS=0; FAIL=0
secao() { [ -z "$FILTRO" ] || [ "$FILTRO" = "$1" ]; }
ok()    { PASS=$((PASS+1)); echo "[PASS] $1"; }
falha() { FAIL=$((FAIL+1)); echo "[FAIL] $1"; shift; printf '%s\n' "$@" | sed 's/^/       /'; }

# ---------------------------------------------------------------- hooks
if secao hooks; then
  for h in guard-boundary guard-tdd guard-data guard-add state-eval post-turn-verify; do
    F=".claude/hooks/$h.sh"
    if [ ! -f "$F" ]; then falha "hook ausente no disco: $F"; continue; fi
    if ! grep -q "$h.sh" .claude/settings.json 2>/dev/null; then
      falha "hook existe mas NÃO está registrado em settings.json: $h"
    elif ! grep -q 'PAYLOAD="\$(cat)"' "$F"; then
      falha "hook fora do contrato stdin-uma-vez (lib/common.sh): $h"
    else
      ok "hook registrado e no contrato: $h"
    fi
  done
  grep -q 'lib/common.sh' .claude/hooks/guard-boundary.sh && ok "hooks usam a lib comum" \
    || falha "guard-boundary não usa lib/common.sh"
fi

# ----------------------------------------------------------------- deny
if secao deny; then
  MISS=$("$PYBIN" - <<'PY'
import json
b = json.load(open(".claude/verify/boundary.json", encoding="utf-8"))
deny = json.load(open(".claude/settings.json", encoding="utf-8"))["permissions"]["deny"]
falta = []
for classe, spec in b["classes"].items():
    for p in spec["paths"]:
        for tool in ("Edit", "Write"):
            if f"{tool}({p})" not in deny:
                falta.append(f"{tool}({p})")
print("\n".join(falta))
PY
)
  if [ -z "$MISS" ]; then ok "permissions.deny cobre TODOS os paths do boundary.json (Edit+Write)"
  else falha "boundary sem deny correspondente:" "$MISS"; fi
fi

# ----------------------------------------------------------- invariantes
if secao invariantes; then
  MISS=$("$PYBIN" - <<'PY'
import json, os
inv = json.load(open(".claude/verify/invariants.json", encoding="utf-8"))["invariantes"]
falta = []
for i in inv:
    if not i.get("gates"):
        falta.append(f"{i['id']} sem gate associado")
    for g in i.get("gates", []):
        if not os.path.exists(g):
            falta.append(f"{i['id']}: gate inexistente: {g}")
print("\n".join(falta))
PY
)
  if [ -z "$MISS" ]; then ok "10/10 invariantes de produto com gate executável existente"
  else falha "invariante sem gate real:" "$MISS"; fi
fi

# ---------------------------------------------------------------- suites
if secao suites; then
  MISS=$("$PYBIN" - <<'PY'
import json
from pathlib import Path
reg = json.load(open(".claude/verify/expected_suites.json", encoding="utf-8"))
known = set()
for issue in json.load(open(".claude/verify/known_issues.json", encoding="utf-8"))["issues"]:
    if issue.get("lint") == "suites-no-agregado":
        known |= set(issue["excecao"]["arquivos"])
registered = {s["cmd"].split()[-1] for b in ("suites", "heavy", "visual") if b in reg for s in reg[b].values()}
mm = json.load(open(".claude/verify/mutation_map.json", encoding="utf-8"))["harnesses"]
registered |= {h["cmd"].split()[-1] for h in mm.values()}
falta = [str(f) for f in Path(".").glob("tests_*.js")
         if str(f) not in registered and str(f) not in known]
print("\n".join(falta))
PY
)
  if [ -z "$MISS" ]; then ok "toda suíte tests_*.js está no registro canônico ou em exceção nominal"
  else falha "suíte fora do registro e das exceções:" "$MISS"; fi
fi

# ----------------------------------------------------------------- paths
if secao paths; then
  HITS=$(grep -rlE '[A-Z]:\\\\|[A-Z]:/Users/|/home/[a-z]' .claude/hooks .claude/verify --include="*.sh" --include="*.py" --include="*.json" --include="*.yaml" 2>/dev/null | grep -v pins.json || true)
  if [ -z "$HITS" ]; then ok "nenhum caminho absoluto em arquivos de governança (.claude/)"
  else falha "caminho absoluto em governança:" "$HITS"; fi
fi

# ----------------------------------------------------------- known-issues
if secao known-issues; then
  MISS=$("$PYBIN" - <<'PY'
import json
issues = json.load(open(".claude/verify/known_issues.json", encoding="utf-8"))["issues"]
falta = [i["id"] for i in issues if not i.get("remocao_prevista")]
print("\n".join(falta))
PY
)
  N=$("$PYBIN" -c "import json;print(len(json.load(open('.claude/verify/known_issues.json',encoding='utf-8'))['issues']))")
  if [ -z "$MISS" ]; then ok "known-issues: $N exceção(ões) nominal(is), todas com remoção prevista"
  else falha "exceção nominal SEM remoção prevista:" "$MISS"; fi

  # Segunda FONTE de exceção nominal: `regra_morta.json` (demanda 014). A seção
  # existe para que ninguém precise saber ONDE procurar — exceção fora do lugar
  # em que a casa lê exceções é permissão permanente por omissão.
  # OS SHAPES DIFEREM, e não se reescreve nenhum: known_issues identifica por `id`
  # e carrega o achado na PROSA do motivo; regra_morta identifica pelo par
  # (harness, mutante), tem motivo de VOCABULÁRIO FECHADO e campos próprios de dono
  # (`achado_id`/`achado_id_alocado`/`achado_id_pendencia`) e de prazo estruturado
  # (`evento_de_remocao`). O mínimo que as unifica é o CRITÉRIO, não o formato:
  # toda exceção TEMPORÁRIA tem dono e remoção prevista escritos. A aderência do
  # `evento_de_remocao` ao prazo auto-executável é de C3(e) (tests_014_regra_morta.js)
  # — a auditoria LISTA e cobra dono+prazo; não duplica o gate.
  RM=$("$PYBIN" - <<'PY'
import json, sys
sys.stdout.reconfigure(encoding="utf-8")  # R7 §2
P = ".claude/verify/regra_morta.json"
# Fail-closed: só estes motivos são ESTRUTURAIS (exclusão por desenho, sem prazo —
# obrigatória neles é a `cegueira`, cobrada por C3(d)). QUALQUER outro motivo,
# inclusive um que o vocabulário ganhe amanhã, é tratado como TEMPORÁRIO e cobrado.
ESTRUTURAIS = {"oraculo-de-fonte", "fallback-declarado"}

def corta(s, n):
    s = " ".join((s or "").split())
    return s if len(s) <= n else s[:n - 1] + "…"

try:
    d = json.load(open(P, encoding="utf-8"))
except FileNotFoundError:
    print("AUSENTE " + P)          # não-execução NOMEADA, nunca SKIP silencioso (R10 §2)
    raise SystemExit
except Exception as e:
    print("FALHA %s ilegível para o parser de exceções: %s" % (P, type(e).__name__))
    raise SystemExit

entradas = []
for e in (d.get("exclusoes") or []):
    if not isinstance(e, dict):
        print("FALHA entrada de `exclusoes` que não é objeto")
        continue
    entradas.append(("exclusão %s/%s → %s" % (e.get("harness", "?"), e.get("mutante", "?"),
                                              e.get("gate", "?")), e))
arv = ((d.get("indecidiveis") or {}).get("arvore") or {})
if isinstance(arv, dict) and arv.get("motivo"):
    entradas.append(("pin adiado `indecidiveis.arvore`", arv))

if not entradas:
    print("FALHA %s não declara exceção alguma — leitura sem sujeito não mede nada" % P)

for rot, e in entradas:
    motivo = (e.get("motivo") or "").strip()
    prazo = (e.get("remocao_prevista") or "").strip()
    aid = (e.get("achado_id") or "").strip()
    alocado = e.get("achado_id_alocado")
    pend = (e.get("achado_id_pendencia") or "").strip()
    if not motivo:
        print("FALHA %s: sem `motivo`" % rot)
        continue
    if motivo in ESTRUTURAIS:
        print("LISTA %s · motivo `%s` (estrutural, sem prazo por desenho)" % (rot, motivo))
        continue
    faltam = []
    if not aid:
        faltam.append("achado_id (exceção sem dono)")
    if alocado is False and not pend:
        faltam.append("achado_id_pendencia — marcador silencioso")
    if not prazo:
        faltam.append("remocao_prevista")
    if faltam:
        print("FALHA %s · motivo `%s`: %s" % (rot, motivo, "; ".join(faltam)))
        continue
    dono = aid
    if alocado is False:   # ausente != False — sem o `is`, entrada sem a chave
                           # imprimia "PENDENTE:" vazio, que é dado inventado
        dono = "%s (id de backlog PENDENTE: %s)" % (aid, corta(pend, 90))
    print("LISTA %s · motivo `%s` · achado %s · remoção: %s"
          % (rot, motivo, dono, corta(prazo, 110)))
PY
)
  RM_FALHA=$(printf '%s\n' "$RM" | sed -n 's/^FALHA //p')
  RM_LISTA=$(printf '%s\n' "$RM" | sed -n 's/^LISTA //p')
  RM_AUSENTE=$(printf '%s\n' "$RM" | sed -n 's/^AUSENTE //p')
  if [ -z "$RM_LISTA" ]; then RM_N=0; else RM_N=$(printf '%s\n' "$RM_LISTA" | grep -c ''); fi
  if [ -n "$RM_FALHA" ]; then
    falha "regra-morta: exceção nominal SEM dono ou SEM remoção prevista:" "$RM_FALHA"
  elif [ -n "$RM_AUSENTE" ]; then
    falha "regra-morta: registro de exceções ausente — a auditoria ficaria cega:" "$RM_AUSENTE"
  else
    ok "regra-morta: $RM_N exceção(ões) nominal(is), todas com dono e remoção prevista:"
    printf '%s\n' "$RM_LISTA" | sed 's/^/       /'
  fi
fi

# ---------------------------------------------------------------- waivers
if secao waivers; then
  if [ -d ".claude/project-memory/planning-state" ]; then
    # EA-2: casar a CHAVE JSON estruturada, nunca substring em prosa (grep -l
    # listava planning-state cujo brief apenas mencionava "tdd_waivers")
    W=$("$PYBIN" - <<'PY'
import glob, json, os, sys
sys.stdout.reconfigure(encoding="utf-8")  # R7 §2
for p in sorted(glob.glob(".claude/project-memory/planning-state/*.json")):
    try:
        d = json.load(open(p, encoding="utf-8"))
        if isinstance(d, dict) and "tdd_waiver" in d:
            print(p.replace(os.sep, "/"))
    except Exception as e:  # ilegível não é pulado em silêncio (R10 §2) — entra na lista de revisão
        print(p.replace(os.sep, "/") + f" (ilegível para o parser de waivers: {type(e).__name__})")
PY
)
    if [ -z "$W" ]; then ok "waivers TDD: nenhum ativo"
    else ok "waivers TDD ativos (listados para revisão):"; printf '%s\n' "$W" | sed 's/^/       /'; fi
  else
    ok "waivers TDD: máquina SDD ainda não instalada (Onda 2) — nada a listar"
  fi
fi

# ---------------------------------------------------------------- backlog
# Gramática da linha de status dos achados (spec 012-status-backlog, T1-T9):
# lista os achados `aberto` com ok; FAIL só por violação de forma (decisão 1.3).
# Auto-exclusão nominal (R10 §10 / T6): o parser lê EXCLUSIVAMENTE o path
# literal .claude/BACKLOG.md — este script, specs, regras e templates citam
# exemplos livremente; dentro do arquivo, candidatas só contam em bloco de
# achado, e os exemplos do rito vivem no cabeçalho, em código indentado.
if secao backlog; then
  OUT=$("$PYBIN" - <<'PY'
import os, re, sys
sys.stdout.reconfigure(encoding="utf-8")  # R7 §2: stdout UTF-8 explícito, mesmo byte em qualquer SO
path = ".claude/BACKLOG.md"
if not os.path.exists(path):
    print("FAIL")
    print("BACKLOG.md ausente — arquivo pinado, pré-condição da R12")
    sys.exit(0)
# T3: linha a linha, removendo só o \n (espaço à direita reprova; newline="" não traduz CRLF)
linhas = open(path, encoding="utf-8", newline="").read().split("\n")
RE_HEAD  = re.compile(r"^## (?:~~)?(EA-\d+[a-z]?)\b")   # heading de achado (tolera refutado riscado)
RE_CAND  = re.compile(r"^\*\*Status")                     # candidata a status
RE_CANON = re.compile(r"^\*\*Status\*\*: `(aberto|resolvido|refutado|transferido)`$")  # canônica (fullmatch)
# T4: bloco = heading de achado até o próximo ^## (qualquer nível 2) ou EOF; ### não fecha
blocos, atual = [], None
for ln in linhas:
    m = RE_HEAD.match(ln)
    if m:
        atual = {"id": m.group(1), "titulo": (m.group(1) + ln[m.end(1):]).rstrip(), "corpo": []}
        blocos.append(atual)
        continue
    if ln.startswith("## "):
        atual = None
        continue
    if atual is not None:
        atual["corpo"].append(ln)
falhas, abertos = [], []
VOC = "vocabulário: `aberto`|`resolvido`|`refutado`|`transferido`"
for b in blocos:
    corpo = b["corpo"]
    cand = [i for i, ln in enumerate(corpo) if RE_CAND.match(ln)]
    primeira = next((i for i, ln in enumerate(corpo) if ln.strip() != ""), None)
    if len(cand) >= 2:  # T5-(c)
        falhas.append(b["id"] + ": linha de status duplicada — **Status em coluna 0 dentro de bloco é reservado; mova a prosa ou indente o exemplo (rito no cabeçalho)")
    elif primeira is None or primeira not in cand:  # T5-(a): zero candidatas OU deslocada
        falhas.append(b["id"] + ": sem linha de status na posição canônica (primeira linha não vazia após o heading)")
    else:
        ln = corpo[primeira]
        m = RE_CANON.fullmatch(ln)
        if not m:  # T5-(b)
            falhas.append(b["id"] + ': linha de status fora da forma/vocabulário: "' + ln + '" — ' + VOC + "; dentro de bloco de achado, linha iniciando com **Status é reservada à gramática (rito no cabeçalho do BACKLOG.md)")
        elif m.group(1) == "aberto":  # T9: só abertos listam; demais só validados na forma
            abertos.append(b["titulo"])
if falhas:
    print("FAIL")
    print("\n".join(falhas))
elif abertos:
    print("OPEN")
    print("\n".join(abertos))
else:
    print("NONE")
PY
)
  ST=$(printf '%s\n' "$OUT" | head -n1)
  CORPO=$(printf '%s\n' "$OUT" | tail -n +2)
  case "$ST" in
    FAIL) falha "violação de forma no BACKLOG.md:" "$CORPO";;
    OPEN) N=$(printf '%s\n' "$CORPO" | grep -c .)
          ok "achados abertos ($N), listados para revisão:"
          printf '%s\n' "$CORPO" | sed 's/^/       /';;
    NONE) ok "achados abertos: nenhum";;
    *)    falha "seção backlog: saída inesperada do parser" "$OUT";;
  esac
fi

echo "----"
echo "compliance: $PASS PASS · $FAIL FAIL"
exit "$FAIL"
