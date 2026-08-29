#!/usr/bin/env python3
"""Stage mutation — campanhas re-executadas por trigger de path (Onda 3, E7).

A prova de mutação deixa de ser one-shot: sempre que um módulo-alvo (ou o
próprio harness) muda em relação à base, a campanha correspondente re-executa.
Base do diff: origin/develop (merge-base) quando existe; senão, o pin do
último verde (.last_green); senão, executa tudo.

Harness cujo `requires` não está disponível no ambiente é reportado POR NOME
como NÃO EXECUTADO e conta como FAIL do stage apenas se seus alvos mudaram —
nunca silêncio (R10 §2). Pré-condição: árvore limpa (os harnesses da casa
mutam in-place com restauração provada; crash no meio deixa rastro no
porcelain e o stage seguinte acusa).

Uso: check_mutation.py [--all]  (--all ignora o trigger e roda tudo que der)
"""
import json, os, shutil, subprocess, sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

MAP = json.load(open(".claude/verify/mutation_map.json", encoding="utf-8"))["harnesses"]

def sh(args):
    return subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")

def have(req):
    if req == "node":
        return shutil.which("node") is not None
    if req == "python":
        return True
    if req == "chromium":
        if os.environ.get("CHROME_PATH") and os.path.exists(os.environ["CHROME_PATH"]):
            return True
        cache = os.path.join(os.environ.get("LOCALAPPDATA", os.path.expanduser("~/.cache")), "ms-playwright")
        return os.path.isdir(cache) and any("chromium" in d for d in os.listdir(cache))
    return False

# árvore limpa é pré-condição (harnesses mutam in-place com restauração)
dirty = sh(["git", "status", "--porcelain"]).stdout.strip()
if dirty:
    print("[FAIL] árvore suja — campanhas de mutação exigem working tree limpo:")
    print("       " + dirty.splitlines()[0] + (" …" if len(dirty.splitlines()) > 1 else ""))
    sys.exit(1)

# ═══════════════════════════════════════════════════════════════════════════
# SEÇÃO DE INTEGRIDADE DA CAMPANHA — demanda 013 (IC-1 · IC-2 · IC-4 · IC-5 · IC-6)
#
# Definição normativa de cada asserção: specs/013-integridade-da-campanha/spec.md
# §"Critérios de aceite → gates" (IC-1…IC-8) e §Contratos (C1…C4). Aqui mora só
# a execução — nenhum critério nasce neste arquivo.
#
# Onde roda (T7): DEPOIS da pré-condição de árvore limpa (acima) e ANTES do laço
# de trigger, INDEPENDENTE de `requires` e de qualquer alvo ter mudado. Âncora
# podre e harness Linux-only reprovam o stage mesmo quando nenhuma campanha é
# exigida — é a semântica pretendida ("a campanha diz a verdade"), consequência
# declarada em T7, não efeito colateral. Nenhum stage novo, nenhuma linha nova
# em pipeline.yaml.
#
# Como relata (D2): POR ASSERÇÃO — `[OK] IC-n: …` / `[FAIL] IC-n: <alvo> · <causa>`,
# nunca um agregado. Entre a W3 e a W6 o stage fica legitimamente vermelho por
# IC-4; sem relato por asserção esse vermelho esconderia o verde das outras — o
# colapso de estados que esta demanda existe para matar, um nível acima.
#
# O que NÃO faz: não escreve nada (R7 §3), não muta, não reconstrói, não executa
# suíte de gate (R10 §6). O único processo externo que invoca é `<cmd> --preflight`
# do próprio harness — e só quando o mapa declara `"preflight": true` (C2), porque
# nos harnesses de hoje o argv é ignorado e `--preflight` dispararia a CAMPANHA.
# O oráculo é o JSON do contrato C1, nunca regex sobre stdout PT-BR (R10 §6).
# ═══════════════════════════════════════════════════════════════════════════
import re

# R10 §10 — auto-exclusão NOMINAL por path. O julgador e os artefatos da demanda
# carregam os literais proibidos (`python3`, `P50_ONLY=`) por necessidade de
# descrevê-los. A exclusão cobre `specs/013-integridade-da-campanha/` INTEIRO e
# não só a spec.md: plan.md, tasks.md e a matriz-gate-mutante.md também os
# carregam — excluir só a spec faria o gate reprovar a si mesmo. Exclusão é
# sempre IMPRESSA, nunca silenciosa (R10 §2).
IC_EXCLUSOES = (".claude/verify/check_mutation.py",
                "specs/013-integridade-da-campanha/")

# Classe NORMATIVA do prefixo POSIX (spec, IC-1): inclui DÍGITO. `[A-Z_]*=` não
# casa o `5` de `P50_ONLY=` — foi esse erro de classe que produziu a medição
# zerada corrigida na §"Correção de fato" da spec. Um instrumento que reporta
# zero sem ter medido é a doença desta demanda.
RE_IC_PREFIXO = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*=")
# Literal de comando com interpretador por nome fixo (T1): aspa + python[3] + espaço.
# Não casa a referência da casa (`? "python" : "python3";`, tests_core_mutants.js:22),
# que é resolução por plataforma e não literal de comando.
RE_IC_PY = re.compile(r"""["'`]python3?[ \t]""")
RE_IC_CMD = re.compile(r"""\bcmd\s*:\s*(["'`])(.*?)\1""", re.S)
RE_IC_ID = re.compile(r"""\bid\s*:\s*(["'`])(.*?)\1""")

# Conjunto fechado de causas de NÃO EXECUTADO (T4) — vale para o `causa` de C1.
IC_CAUSAS_FECHADAS = ("interpretador ausente", "âncora não encontrada",
                      "âncora ambígua", "rebuild falhou",
                      "gate não pôde ser executado")
# Vocabulário fechado da classificação de par não-KILL (E3).
IC_CLASSIFICACOES = ("rot semântica", "propriedade aposentada")
# T8: `core` é a REFERÊNCIA do interpretador e fica fora das edições desta
# demanda; a ausência de preflight nele é dívida declarada, não FAIL.
IC_SEM_PREFLIGHT = ("core",)
IC_PY_FANTASMA = "mutation-py-inexistente-013"

IC_FAILS = 0


def ic_ok(gate, msg):
    print(f"[OK]   {gate}: {msg}")


def ic_fail(gate, alvo, causa):
    global IC_FAILS
    IC_FAILS += 1
    print(f"[FAIL] {gate}: {alvo} · {causa}")


def ic_nota(gate, msg):
    print(f"[NOTA] {gate}: {msg}")


def ic_path(p):
    p = str(p).replace("\\", "/")
    return p[2:] if p.startswith("./") else p


def ic_excluido(p):
    p = ic_path(p)
    return any(p == e or p.startswith(e) for e in IC_EXCLUSOES)


def ic_fontes(h):
    """Arquivos-fonte do harness, derivados do PRÓPRIO `cmd` do mapa.

    A varredura é por PROPRIEDADE sobre todo harness declarado — hoje e depois —
    nunca uma lista nominal de harnesses, que apodreceria exatamente como as
    âncoras que esta demanda conserta.
    """
    out = []
    for tok in str(h.get("cmd", "")).split():
        t = tok.strip("\"'")
        if t.lower().endswith((".js", ".py", ".mjs", ".cjs")):
            out.append(t)
    return out


def ic_estatico(caminho):
    """Ids e arquivos mutados lidos do FONTE do harness — oráculo de RESERVA.

    O oráculo do contrato é o preflight (C1). Enquanto nenhum harness responde a
    C1, IC-5 e IC-6 ficariam 'não medidos' — e não medir em silêncio é FAIL
    (R10 §2). A reserva mede e o relatório NOMEIA qual oráculo respondeu.
    """
    src = open(caminho, encoding="utf-8", errors="replace").read()
    fmap = dict(re.findall(r'(\w+)\s*:\s*path\.join\(HERE,\s*"([^"]+)"\s*\)', src))
    usados = set(re.findall(r"\bfile\s*:\s*F\.(\w+)", src))
    return ([m.group(2) for m in RE_IC_ID.finditer(src)],
            sorted({fmap[k] for k in usados if k in fmap}))


print("---- integridade da campanha (013) ----")

# ── IC-1 · portabilidade estrutural, por propriedade e não por lista ─────────
ic1_pref_total = 0
ic1_lit_total = 0
ic1_arquivos_com_lit = set()
for _nome, _h in sorted(MAP.items()):
    _cmd_mapa = str(_h.get("cmd", ""))
    if RE_IC_PREFIXO.match(_cmd_mapa):
        ic_fail("IC-1", f"mutation_map.json → harnesses.{_nome}.cmd",
                f"o próprio cmd do harness começa com prefixo POSIX de variável "
                f"({RE_IC_PREFIXO.match(_cmd_mapa).group(0)}) — não portável")
    if re.match(r"\s*python3?[ \t]", _cmd_mapa):
        ic_fail("IC-1", f"mutation_map.json → harnesses.{_nome}.cmd",
                "interpretador por nome fixo no cmd do harness — T1 exige MUTATION_PY "
                "ou o padrão por plataforma")
    _fontes = ic_fontes(_h)
    if not _fontes:
        ic_fail("IC-1", _nome, f"cmd do mapa não referencia arquivo-fonte varrível: {_cmd_mapa!r}")
    for _f in _fontes:
        _rel = ic_path(_f)
        if ic_excluido(_rel):
            print(f"[EXCLUÍDO] IC-1: {_rel} — auto-exclusão nominal por path (R10 §10)")
            continue
        if not os.path.exists(_f):
            ic_fail("IC-1", f"{_nome}/{_rel}", "fonte declarada no mapa não existe no disco")
            continue
        _src = open(_f, encoding="utf-8", errors="replace").read()
        _ids = [(m.start(), m.group(2)) for m in RE_IC_ID.finditer(_src)]
        _cmds = list(RE_IC_CMD.finditer(_src))
        _maus = []
        for _m in _cmds:
            _pfx = RE_IC_PREFIXO.match(_m.group(2))
            if not _pfx:
                continue
            _mid = "?"
            for _pos, _val in _ids:
                if _pos < _m.start():
                    _mid = _val
                else:
                    break
            _maus.append((_mid, _pfx.group(0)))
        # Um FAIL por harness/eixo, com TODOS os mutantes nomeados na linha: o
        # relato continua por asserção (D2) e nenhum mutante fica anônimo, sem
        # despejar 46 linhas num stage que roda em todo PR.
        if _maus:
            ic_fail("IC-1", f"{_nome}/{_rel}",
                    f"{len(_maus)} de {len(_cmds)} cmd de mutante começam com prefixo POSIX de "
                    f"variável (classe ^[A-Za-z_][A-Za-z0-9_]*=; prefixos: "
                    f"{', '.join(sorted({p for _, p in _maus}))}) — as variáveis têm de passar "
                    f"pela opção env do runner (T3) · mutantes: {', '.join(m for m, _ in _maus)}")
            ic1_pref_total += len(_maus)
        else:
            ic_ok("IC-1", f"{_nome}/{_rel}: {len(_cmds)} cmd, nenhum com prefixo POSIX de variável")
        _lits = [(i + 1, l) for i, l in enumerate(_src.splitlines()) if RE_IC_PY.search(l)]
        for _ln, _linha in _lits:
            ic_fail("IC-1", f"{_nome}/{_rel}:{_ln}",
                    "interpretador por nome fixo em literal de comando — T1 exige MUTATION_PY "
                    "ou o padrão por plataforma (win32 ? python : python3), com o caminho do "
                    f"script entre aspas (R10 §7) · {_linha.strip()[:100]}")
        if _lits:
            ic1_lit_total += len(_lits)
            ic1_arquivos_com_lit.add(_rel)
        else:
            ic_ok("IC-1", f"{_nome}/{_rel}: nenhum literal de interpretador em comando")
if ic1_pref_total or ic1_lit_total:
    ic_nota("IC-1", f"total medido: {ic1_pref_total} cmd com prefixo POSIX e {ic1_lit_total} "
                    f"literal(is) de interpretador em {len(ic1_arquivos_com_lit)} arquivo(s), "
                    f"sobre {len(MAP)} harness(es) do mapa")

# ── IC-2 · requisito declarado que reprova (adversarial, em processo) ────────
# Mede a propriedade que dá dentes ao requisito: com MUTATION_PY apontando para
# um binário que não existe, `have("python")` tem de dizer NÃO. O cenário
# ponta-a-ponta (`--all` com interpretador ausente ⇒ FAIL/DEFER nomeado) é o
# mesmo requisito visto de fora e está na spec, IC-2.
_ic2_antes = os.environ.get("MUTATION_PY")
os.environ["MUTATION_PY"] = IC_PY_FANTASMA
try:
    _ic2_resolveu = have("python")
finally:
    if _ic2_antes is None:
        os.environ.pop("MUTATION_PY", None)
    else:
        os.environ["MUTATION_PY"] = _ic2_antes
if _ic2_resolveu:
    ic_fail("IC-2", 'M-IC3 · have("python")',
            f"com MUTATION_PY={IC_PY_FANTASMA} (binário inexistente) o requisito \"python\" "
            "ainda foi dado por presente — requisito declarado que nunca reprova; a campanha "
            "exigida seguiria adiante com o interpretador ausente, e o DEFER/FAIL nomeado de "
            "check_mutation.py:69-75 é inalcançável para `python`")
else:
    ic_ok("IC-2", f'requisito "python" reprova com interpretador ausente '
                  f'(MUTATION_PY={IC_PY_FANTASMA} ⇒ have("python") = False)')

# ── consumidor de C1 + IC-4 · âncora única, provada antes de mutar ───────────
IC_PREFLIGHT = {}


def ic_preflight(nome, h):
    """Consome o contrato C1 do harness. Devolve (dados, causa_do_fracasso)."""
    if not h.get("preflight"):
        return None, ('não declara "preflight": true no mutation_map.json (C2) — o contrato C1 '
                      "não pode ser consumido e nenhuma âncora é provada antes de mutar")
    if not have("node"):
        return None, "preflight não executado — ambiente sem node (nomeado, nunca pulado: R10 §2)"
    # Guarda medida em falsificação (worktree efêmera): nos harnesses de hoje o argv
    # é ignorado, então invocar `--preflight` num harness que só declarou o flag
    # dispara a CAMPANHA INTEIRA de dentro do stage. O flag e o modo têm de nascer
    # no MESMO commit (D4) — aqui isso vira pré-condição verificada, não confiança.
    _fontes = [f for f in ic_fontes(h) if os.path.exists(f) and not ic_excluido(f)]
    if not any("--preflight" in open(f, encoding="utf-8", errors="replace").read()
               for f in _fontes):
        return None, ('declara "preflight": true (C2) mas nenhum fonte do harness lê '
                      "`--preflight` — invocá-lo dispararia a campanha inteira dentro do "
                      "stage; flag e modo nascem no mesmo commit (D4)")
    # cmd vem do mapa e é relativo ao cwd do stage, como na invocação de campanha
    # abaixo — nenhum caminho absoluto é interpolado aqui (R10 §7).
    try:
        r = subprocess.run(h["cmd"] + " --preflight", shell=True, capture_output=True,
                           text=True, encoding="utf-8", errors="replace", timeout=180)
    except subprocess.TimeoutExpired:
        return None, "preflight não respondeu em 180s"
    except Exception as e:  # falha fora do conjunto fechado: reprova nomeada (T4)
        return None, f"falha não classificada ao invocar o preflight: {type(e).__name__}: {e}"
    _saida = (r.stdout or "").strip()
    if not _saida:
        return None, ("preflight não emitiu nada em stdout — C1 exige UM objeto JSON em stdout "
                      "(texto humano vai para stderr)")
    try:
        dados = json.loads(_saida)
    except Exception as e:
        return None, (f"stdout não é o objeto JSON único de C1 ({type(e).__name__}) — "
                      f"primeira linha: {_saida.splitlines()[0][:120]!r}")
    if not isinstance(dados, dict):
        return None, "stdout do preflight não é objeto JSON (C1 exige objeto único)"
    _faltam = [k for k in ("harness", "arquivo", "interpretador", "arquivos_mutados", "mutantes")
               if k not in dados]
    if _faltam:
        return None, "JSON do preflight sem chave(s) de C1: " + ", ".join(_faltam)
    if not isinstance(dados.get("mutantes"), list) or not isinstance(dados.get("arquivos_mutados"), list):
        return None, "C1: `mutantes` e `arquivos_mutados` têm de ser listas"
    dados["_returncode"] = r.returncode
    return dados, None


for _nome, _h in sorted(MAP.items()):
    if _nome in IC_SEM_PREFLIGHT:
        ic_nota("IC-4", f"{_nome} · sem preflight por decisão da spec (T8: é a referência do "
                        "interpretador e fica fora das edições) — dívida declarada, não FAIL")
        continue
    _dados, _causa = ic_preflight(_nome, _h)
    IC_PREFLIGHT[_nome] = _dados
    if _causa:
        ic_fail("IC-4", _nome, _causa)
        continue
    _interp = _dados.get("interpretador") or {}
    if not isinstance(_interp, dict) or "resolvido" not in _interp or "nome" not in _interp:
        ic_fail("IC-4", _nome, "C1: `interpretador` tem de trazer {nome, origem, resolvido}")
    if not _interp.get("resolvido"):
        ic_fail("IC-4", _nome, f"preflight não resolveu o interpretador "
                               f"({_interp.get('nome')!r}, origem {_interp.get('origem')!r})")
    _muts = _dados["mutantes"]
    _esperado_zero = bool(_interp.get("resolvido")) and all(
        m.get("estado") == "ok" for m in _muts)
    if (_dados["_returncode"] == 0) != _esperado_zero:
        ic_fail("IC-4", _nome, f"C1: exit {_dados['_returncode']} incoerente com o conteúdo — "
                               f"exit 0 sse interpretador resolvido e todo estado == 'ok'")
    _ruins = []
    for _m in _muts:
        _mid = _m.get("id", "?")
        _est = _m.get("estado")
        if _est not in ("ok", "nao_executavel"):
            ic_fail("IC-4", f"{_nome}/{_mid}", f"estado fora de C1: {_est!r}")
        elif _est == "nao_executavel" and _m.get("causa") not in IC_CAUSAS_FECHADAS:
            ic_fail("IC-4", f"{_nome}/{_mid}",
                    f"causa fora do conjunto fechado de T4: {_m.get('causa')!r}")
        _n = _m.get("ocorrencias")
        if _n != 1:
            _ruins.append((_mid, _m.get("arquivo", "?"), _n))
    for _mid, _arq, _n in _ruins:
        ic_fail("IC-4", f"{_nome}/{_mid}",
                ("âncora não encontrada" if _n == 0 else "âncora ambígua") +
                f" — ocorrencias={_n} em {_arq} (C1 exige exatamente 1 antes de mutar)")
    if not _ruins:
        ic_ok("IC-4", f"{_nome}: {len(_muts)} âncora(s) com ocorrencias == 1 (preflight, C1)")

# ── IC-5 e IC-6 · nominais à p51 (T11/borda 10: sem laço genérico) ───────────
# A checagem GENÉRICA de alvo órfão é do EA-3, que vive em branch que este
# worktree não enxerga; escrever o laço genérico aqui seria conflito de merge no
# pior arquivo possível.
_h51 = MAP.get("p51")
if _h51 is None:
    ic_fail("IC-5/IC-6", "p51", "harness p51 ausente do mutation_map.json — as asserções "
                                "nominais à p51 ficam sem objeto")
else:
    _d51 = IC_PREFLIGHT.get("p51")
    if _d51:
        _ids51 = [m.get("id", "?") for m in _d51["mutantes"]]
        _arqs51 = [str(a) for a in _d51.get("arquivos_mutados") or []]
        _oraculo = "preflight (C1)"
    else:
        _f51 = [f for f in ic_fontes(_h51) if os.path.exists(f)]
        _ids51, _arqs51 = ic_estatico(_f51[0]) if _f51 else ([], [])
        _oraculo = "leitura estática do fonte (reserva — p51 não responde a C1)"

    # IC-6 · alvo declarado verdadeiro
    if not _arqs51:
        ic_fail("IC-6", "p51.targets", "arquivos mutados não puderam ser determinados por "
                                       "oráculo nenhum (nem preflight, nem leitura do fonte)")
    else:
        _esperado = set(_arqs51) | {os.path.basename(f) for f in ic_fontes(_h51)}
        _declarado = set(_h51.get("targets") or [])
        _excedente = sorted(_declarado - _esperado)
        _faltante = sorted(_esperado - _declarado)
        if _excedente:
            ic_fail("IC-6", "p51.targets", "alvo declarado que o harness não muta: " +
                    ", ".join(_excedente) + f" [oráculo: {_oraculo}]")
        if _faltante:
            ic_fail("IC-6", "p51.targets", "alvo mutado ausente de targets: " +
                    ", ".join(_faltante) + f" [oráculo: {_oraculo}]")
        if not _excedente and not _faltante:
            ic_ok("IC-6", f"p51.targets ≡ arquivos mutados ∪ {{harness}} "
                          f"({len(_esperado)} caminhos) [oráculo: {_oraculo}]")

    # IC-5 · matriz da P51 verdadeira
    try:
        _matriz = json.load(open(".claude/verify/mutation-matrix.json", encoding="utf-8"))
    except Exception as e:
        _matriz = None
        ic_fail("IC-5", "mutation-matrix.json", f"não pôde ser lido: {type(e).__name__}: {e}")
    if _matriz is not None:
        _pares51 = [p for p in _matriz.get("pares", [])
                    if re.match(r"\s*p51\b", str(p.get("harness", "")))]
        _nomes51 = [str(p.get("mutante", "?")) for p in _pares51]
        _dividas = "\n".join(str(d) for d in _matriz.get("dividas_declaradas", []))
        if not _ids51:
            ic_fail("IC-5", "p51", "conjunto de mutantes declarados não pôde ser obtido — "
                                   "cobertura da matriz NÃO MEDIDA (R10 §2: não é SKIP, é FAIL)")
        else:
            _aposentados = [i for i in _ids51 if i not in _nomes51 and i in _dividas]
            _sem_par = [i for i in _ids51 if i not in _nomes51 and i not in _aposentados]
            _sobrando = [n for n in _nomes51 if n not in _ids51]
            if _sem_par:
                ic_fail("IC-5", "p51", f"{len(_sem_par)} mutante(s) do harness sem par na matriz "
                                       f"(nem aposentado em dividas_declaradas): "
                                       f"{', '.join(_sem_par)} [oráculo dos ids: {_oraculo}]")
            if _sobrando:
                ic_fail("IC-5", "p51", "par na matriz que não corresponde a mutante declarado "
                                       "pelo harness: " + ", ".join(repr(s) for s in _sobrando))
            if _aposentados:
                ic_nota("IC-5", "mutante(s) fora dos pares e declarado(s) em dividas_declaradas: "
                                + ", ".join(_aposentados))
            if not _sem_par and not _sobrando:
                ic_ok("IC-5", f"os {len(_ids51)} mutantes da p51 têm um par cada na matriz "
                              f"[oráculo dos ids: {_oraculo}]")
        _reg_ruins = 0
        for _p in _pares51:
            _up = _p.get("ultima_prova") or {}
            if _up.get("resultado") != "KILL":
                _cls = _p.get("classificacao")
                if not (isinstance(_cls, str) and (_cls in IC_CLASSIFICACOES or
                                                   _cls.startswith("gate sem poder discriminante"))):
                    ic_fail("IC-5", f"p51/{_p.get('mutante', '?')}",
                            f"ultima_prova.resultado = {_up.get('resultado')!r} exige "
                            f"`classificacao` do vocabulário fechado; veio {_cls!r}")
            _reg = _up.get("registro")
            if not (isinstance(_reg, str) and os.path.exists(_reg)):
                _reg_ruins += 1
                ic_fail("IC-5", f"p51/{_p.get('mutante', '?')}",
                        f"ultima_prova.registro não resolve no disco: {_reg!r}")
        if _pares51 and not _reg_ruins:
            ic_ok("IC-5", f"registro de {len(_pares51)} par(es) p51 resolve no disco")

print(f"---- integridade: {IC_FAILS} problema(s) nomeado(s) ----")

# arquivos mudados em relação à base
changed = None
if "--all" not in sys.argv:
    mb = sh(["git", "merge-base", "HEAD", "origin/develop"])
    base = mb.stdout.strip() if mb.returncode == 0 else None
    if base:
        changed = set(sh(["git", "diff", "--name-only", base, "HEAD"]).stdout.split())
    else:
        print("[WARN] sem origin/develop para diff — executando todas as campanhas disponíveis")

fails = IC_FAILS  # [013] a seção de integridade acima já contou seus FAIL nomeados
ran = 0
for name, h in MAP.items():
    due = changed is None or any(t in changed for t in h["targets"])
    if not due:
        print(f"[OK]   {name}: nenhum alvo mudou desde a base — campanha não exigida")
        continue
    missing = [r for r in h["requires"] if not have(r)]
    if missing:
        # [Onda-4] MUTATION_DEFER_MISSING=1 (job verify do CI): a campanha exigida
        # sem ambiente é DELEGADA por nome ao job visual, que roda check_mutation
        # com Chromium presente. Sem a env (execução local): FAIL nomeado — o
        # operador decide conscientemente onde rodar. Nunca silêncio (R10 §2).
        if os.environ.get("MUTATION_DEFER_MISSING") == "1":
            print(f"[DEFER] {name}: exigida (alvo mudou) — delegada ao job com {'/'.join(missing)} (job visual)")
            continue
        print(f"[FAIL] {name}: campanha EXIGIDA (alvo mudou) mas ambiente sem {'/'.join(missing)} — "
              "execute onde o requisito exista (job visual do CI / rito do proprietário) e registre")
        fails += 1
        continue
    print(f"[RUN]  {name}: {h['cmd']}")
    r = subprocess.run(h["cmd"], shell=True, capture_output=True, text=True, encoding="utf-8", errors="replace")
    tail = [l for l in (r.stdout or "").splitlines() if l.strip()][-2:]
    for l in tail:
        print("       " + l)
    ran += 1
    if r.returncode != 0:
        fails += 1
    # recibos declarados: o harness legado grava seu registro em arquivo rastreado
    # por design — restauramos após capturar (o registro vivo é a matriz)
    for rec in h.get("receipts", []):
        st = sh(["git", "status", "--porcelain", "--", rec]).stdout.strip()
        if st:
            sh(["git", "checkout", "--", rec])
            print(f"       recibo restaurado (declarado em mutation_map): {rec}")

after = sh(["git", "status", "--porcelain"]).stdout.strip()
if after:
    print("[FAIL] campanha sujou a árvore (restauração incompleta):")
    print("       " + after.splitlines()[0])
    fails += 1

print("----")
print(f"mutation: {ran} campanha(s) executada(s) · {fails} problema(s)")
sys.exit(1 if fails else 0)
