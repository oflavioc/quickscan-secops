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

def mutation_py_bin():
    """Nome (ou caminho) do interpretador Python — fonte ÚNICA de T1/C4.

    `MUTATION_PY` é o override explícito do operador; sem ele vale o padrão da
    referência da casa (`tests_core_mutants.js:22`): win32 ? "python" : "python3".
    A MESMA regra vale nas três harnesses (T1) — aqui e lá, sem divergência; é a
    divergência entre o que se declara e o que se invoca que esta demanda mata.
    Precedente de forma para o seam: `CHROME_PATH`, logo abaixo.
    """
    return os.environ.get("MUTATION_PY") or ("python" if sys.platform == "win32" else "python3")


def have(req):
    if req == "node":
        return shutil.which("node") is not None
    if req == "python":
        # [013/T2] o requisito RESOLVE — era `return True` incondicional (M-IC3), e
        # por isso o DEFER/FAIL nomeado do laço de trigger era inalcançável para
        # `python`. `shutil.which` aceita nome ou caminho com diretório, então
        # MUTATION_PY serve aos dois. Nada abaixo muda: quem NOMEIA o ausente
        # continua sendo o laço, com o vocabulário de sempre (R10 §2).
        return shutil.which(mutation_py_bin()) is not None
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


def ic_divida(alvo, msg):
    """Dívida declarada (T8) — nem OK nem FAIL: o que esta demanda NÃO cobre,
    dito em voz alta. Assimetria silenciosa seria a mesma doença um nível acima
    (R10 §2); é esta dívida que a matriz declara em `dividas_declaradas` (C3)."""
    print(f"[DÍVIDA] {alvo}: {msg}")


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
        # Literal normativo de T8 (spec §Decisões técnicas fixadas). O harness vem de
        # IC_SEM_PREFLIGHT e não escrito à mão — por propriedade, para não apodrecer
        # como as âncoras que esta demanda conserta. Substitui o [NOTA] do red: o
        # mesmo fato dito duas vezes com prefixos diferentes é ruído, e o literal
        # normativo é o de T8.
        ic_divida(_nome, "sem preflight declarado — âncora podre só aparece "
                         "na execução da campanha")
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

# ═══════════════════════════════════════════════════════════════════════════
# RELATO DOS MUTANTES NÃO-KILL (013, E3 passo 0)
#
# O que muda: o que o stage RELATA. O que NÃO muda: o veredito. `fails` continua
# nascendo de um só lugar — o EXIT CODE da campanha, `r.returncode != 0`, abaixo.
# Nada aqui incrementa `fails`, nada aqui decide PASS/FAIL.
#
# Por que ler a saída PT-BR do harness não fere R10 §6: a proibição é usar regex
# sobre stdout como ORÁCULO. Aqui o regex é RELATO — se ele errar, o veredito é
# idêntico e a leitura falha em VOZ ALTA (a linha "NÃO NOMEADOS" abaixo), nunca
# em silêncio (R10 §2). Quem responde "quantos mutantes deveriam aparecer" é o
# JSON do contrato C1 (preflight), já consumido em IC_PREFLIGHT — esse sim um
# oráculo, e um oráculo estruturado.
#
# Formato lido — o MESMO nas três harnesses, no `emitir()` de cada uma
# (tests_p50_mutants.js:944, tests_p51_mutants.js:344, tests_p52_mutants.js:1526):
#     <ESTADO>␣␣<id>␣·␣<desc>
#     ␣×14      gate esperado: <gate>[ · causa: <causa>][ · <nota>]
# ESTADO vem do vocabulário FECHADO de T4/T5 (DETECTADO · SOBREVIVENTE ·
# NÃO EXECUTADO); é ele, e não a razão D/T, que distingue sobrevivente de não
# executado — a distinção que esta demanda existe para não deixar colapsar.
RE_MUT_LINHA = re.compile(r"^(DETECTADO|SOBREVIVENTE|NÃO EXECUTADO)  (\S+) · (.*)$")
RE_MUT_GATE = re.compile(r"^ {14}gate esperado: (.*)$")
# Teto de linhas detalhadas: campanha de 107 mutantes não despeja 107 linhas num
# stage que roda em todo PR. Acima do teto NADA fica anônimo — os ids restantes
# saem nomeados numa linha só, pelo precedente do próprio IC-1 acima.
MUT_TETO_DETALHE = 15

# [016 · A1 do spec-validate, 2026-09-04] CONTROLES do harness — mesmo canal, mesma
# forma de bloco, emitido por `emitirControle()` (tests_016_mutants.js):
#     CONTROLE␣␣<id>␣·␣<desc>
#     ␣×14      resultado: OK|FALHOU[ · <nota>]
# Um controle de baseline que FALHA torna uma família inteira de mutantes
# `NÃO EXECUTADO` (run 33927191969, job visual: 13 de 33), e a linha que diz POR QUÊ
# é esta — que o `tail` de 2 linhas nunca alcança (o fecho lista os não executados
# por cima dela). Relato, nunca veredito: o exit do harness já carrega a falha do
# controle, e nada aqui move `fails`. Quem diz quantos controles deveriam aparecer é
# o JSON do preflight (`controles`, quando o harness o declara) — nunca esta leitura.
RE_CTRL_LINHA = re.compile(r"^CONTROLE  (\S+) · (.*)$")
RE_CTRL_RES = re.compile(r"^ {14}resultado: (OK|FALHOU)(?: · (.*))?$")


def mut_controles(saida):
    """Blocos CONTROLE da saída da campanha: [{id, desc, resultado, nota}]. Pura."""
    linhas = (saida or "").splitlines()
    out = []
    for i, l in enumerate(linhas):
        m = RE_CTRL_LINHA.match(l)
        if not m:
            continue
        g = RE_CTRL_RES.match(linhas[i + 1]) if i + 1 < len(linhas) else None
        out.append({"id": m.group(1), "desc": m.group(2),
                    "resultado": g.group(1) if g else "SEM LINHA `resultado:`",
                    "nota": (g.group(2) or "").strip() if g else ""})
    return out


def mut_relata_controles(name, saida):
    """Ecoa os controles POR NOME, com o resultado nas palavras do harness. Não altera contagem."""
    ctrls = mut_controles(saida)
    pf = IC_PREFLIGHT.get(name)
    declarados = pf.get("controles") if isinstance(pf, dict) and isinstance(pf.get("controles"), list) else None
    if not ctrls and not declarados:
        return  # harness sem controles declarados nem emitidos (p50/p51/p52/d009…): nada a ecoar
    if declarados is not None and len(ctrls) != len(declarados):
        print(f"       controles: LEITURA PARCIAL em `{name}` — {len(ctrls)} bloco(s) `CONTROLE` na saída "
              f"contra {len(declarados)} declarado(s) pelo preflight (C1): {', '.join(map(str, declarados))}")
    for c in ctrls[:MUT_TETO_DETALHE]:
        print(f"       controle: {c['id']} · {c['resultado']}" + (f" · {c['nota']}" if c["nota"] else ""))
    sobra = ctrls[MUT_TETO_DETALHE:]
    if sobra:
        print(f"       + {len(sobra)} controle(s) além do teto de {MUT_TETO_DETALHE} linhas, nomeado(s) aqui: "
              + ", ".join(f"{c['id']}={c['resultado']}" for c in sobra))


def mut_ler(saida):
    """Blocos por mutante da saída da campanha. Devolve (todos, não-KILL)."""
    linhas = (saida or "").splitlines()
    todos = []
    for i, l in enumerate(linhas):
        m = RE_MUT_LINHA.match(l)
        if not m:
            continue
        gate, resto = "?", ""
        g = RE_MUT_GATE.match(linhas[i + 1]) if i + 1 < len(linhas) else None
        if g:
            # `gate esperado: <gate>[ · causa: …][ · <nota>]` — o gate vai até o
            # primeiro " · "; o resto sai VERBATIM, nas palavras do harness, para
            # não inventar classificação, que é ato da E3 e não do julgador.
            gate, _, resto = g.group(1).partition(" · ")
        todos.append({"estado": m.group(1), "id": m.group(2), "desc": m.group(3),
                      "gate": gate.strip(), "resto": resto.strip()})
    return todos, [t for t in todos if t["estado"] != "DETECTADO"]


def mut_relata(name, saida, returncode):
    """Imprime os não-KILL POR NOME. Não devolve nada e não altera contagem."""
    todos, nao_kill = mut_ler(saida)
    if not todos:
        # Vale para o harness que morreu antes de emitir mutante nenhum E para o
        # harness cujo fecho tem formato próprio (`core`, sem o `emitir()` de
        # T4/T5, logo sem estado por mutante para relatar — dívida de T8). Nos
        # dois casos a ausência é DITA, nunca omitida (R10 §2).
        print(f"       não-KILL: NÃO NOMEADOS em `{name}` — nenhuma linha "
              f"`<ESTADO>  <id> · <desc>` na saída (exit {returncode}); o veredito vale e a "
              f"identidade, se existir, está no fecho do harness acima")
        return
    esperados = IC_PREFLIGHT.get(name)
    esperados = len(esperados["mutantes"]) if esperados else None
    if esperados is not None and len(todos) != esperados:
        print(f"       não-KILL: LEITURA PARCIAL em `{name}` — {len(todos)} mutante(s) lido(s) "
              f"na saída contra {esperados} declarado(s) pelo preflight (C1); a lista abaixo "
              f"pode estar incompleta, e a divergência é do relato, não do veredito")
    if not nao_kill:
        print(f"       não-KILL: nenhum — os {len(todos)} mutante(s) lidos estão DETECTADO")
        return
    print(f"       não-KILL: {len(nao_kill)} de {len(todos)} mutante(s) lido(s) · "
          f"{len(todos) - len(nao_kill)} KILL ficam na contagem")
    for t in nao_kill[:MUT_TETO_DETALHE]:
        print(f"         {t['estado']:<14} {t['id']} · gate {t['gate']}"
              + (f" · {t['resto']}" if t["resto"] else ""))
    sobra = nao_kill[MUT_TETO_DETALHE:]
    if sobra:
        print(f"         + {len(sobra)} não-KILL além do teto de {MUT_TETO_DETALHE} linhas, "
              f"nomeado(s) aqui: " + ", ".join(t["id"] for t in sobra))


# ═══════════════════════════════════════════════════════════════════════════
# IC-9 · EXCEÇÃO NOMINAL DE MUTANTE SOBREVIVENTE (013 · addendum de 2026-08-30)
#
# Autorização: o proprietário autorizou NOMINALMENTE, no chat de 2026-08-30, que
# o stage `mutation` passe a honrar exceção nominal do `known_issues.json` — até
# aqui só `check_markers.py`, `check_suites.py` e o `compliance-audit` o
# consultavam. Não é delegação genérica: muda o que o gate EXIGE, e por isso foi
# ratificado nominalmente.
#
# Bloco ADITIVO: roda DEPOIS do fecho da seção de integridade (IC-1…IC-6, que
# não é tocada) e ANTES do laço de trigger, com contador PRÓPRIO — a linha
# canônica `---- integridade: N problema(s) ----` continua contando só o que
# sempre contou. Independe de `requires` e de qualquer alvo ter mudado, pela
# mesma razão de T7: exceção podre reprova mesmo quando nenhuma campanha é
# exigida.
#
# As quatro cláusulas duras, na ordem em que o proprietário as fixou:
#   1. NOMINAL, nunca abrangente — a exceção nomeia harness + id do mutante +
#      gate, um de cada. Curinga, campo vazio ou coleção reprovam (IC-9.1).
#   2. PRAZO obrigatório (`remocao_prevista`) — o `_meta` do próprio
#      known_issues diz que exceção sem prazo vira permissão permanente (IC-9.1).
#   3. IMPRESSA, nunca silenciosa — o veredito do perdão carrega a LINHA que o
#      stage imprime, com id da exceção, mutante e prazo (IC-9.4, cenário i).
#      Verde que não conta que houve exceção é a doença desta demanda.
#   4. EXCEÇÃO OBSOLETA REPROVA — se o mutante nomeado deixar de sobreviver, a
#      exceção perdeu o motivo. DUAS direções, medidas em lugares diferentes:
#      IC-9.3 pelo REGISTRO (`mutation-matrix.json` volta a dizer `KILL`) e
#      IC-9.4 cenário ii pela EXECUÇÃO (o bloco do mutante volta a `DETECTADO`).
#      Exceção que sobrevive à própria razão apodrece como as âncoras que a
#      demanda 013 acabou de consertar.
#
# Contrato C5 — o seam que o laço de campanha tem de expor, e que esta asserção
# sonda EM PROCESSO (mesma forma de IC-2, que sonda `have("python")` com env
# adversarial). A sonda usa dados SINTÉTICOS, nunca a entrada real: o mecanismo
# tem de ser medido também depois que a última exceção for removida.
#
#   mut_perdao(harness, blocos, excecoes) -> dict          FUNÇÃO PURA (sem I/O)
#     harness  — nome do harness no mutation_map.json
#     blocos   — a lista `todos` de mut_ler(): {estado, id, desc, gate, resto}
#     excecoes — as entradas `lint == "mutation-sobrevivente"` do known_issues
#     devolve  {"perdoados":     [id…],  # SOBREVIVENTE coberto por exceção viva
#               "obsoletas":     [id…],  # nomeado pela exceção e DETECTADO agora
#               "remanescentes": [id…],  # não-KILL que exceção nenhuma cobre
#               "aplicadas":     [linha…],  # o que o stage IMPRIME (cláusula 3)
#               "perdoa_o_exit": bool}      # o veredito único que o laço consome
#     `perdoa_o_exit` é True SSE houve ao menos um perdão, nenhuma obsoleta e
#     nenhum remanescente. Campanha que morreu antes de emitir mutante nenhum
#     (`blocos == []`) NUNCA é perdoada — borda medida no cenário vi.
#
# O que este bloco NÃO faz: não escreve (R7 §3), não muta, não invoca processo
# externo, não decide veredito de campanha. Só mede.
# ═══════════════════════════════════════════════════════════════════════════
IC9_LINT = "mutation-sobrevivente"
IC9_CAMPOS = ("harness", "mutante", "gate")
IC9_CURINGA = re.compile(r"[*?%]|^\s*(todos|todas|qualquer|all|any)\s*$", re.I)
# [013/IC-9 · green] Teto do `motivo` na linha impressa. A razão da KI-4 tem ~700
# caracteres (a cascata inteira do EA-7) e não cabe num stage que roda em todo PR.
# Trunca-se com marca EXPLÍCITA e ponteiro para o registro integral — precedente do
# teto de IC-1/mut_relata: nada fica anônimo, nada fica implícito.
IC9_TETO_MOTIVO = 180


def mut_perdao(harness, blocos, excecoes):
    """Perdão nominal de mutante sobrevivente — contrato C5. FUNÇÃO PURA.

    Sem I/O, sem efeito, sem leitura de arquivo: `excecoes` entra por PARÂMETRO
    para que o poder discriminante siga medido com dados SINTÉTICOS depois que a
    última exceção real for cumprida — o dia em que ninguém olha (IC-9.4).

      harness  — nome do harness no mutation_map.json
      blocos   — a lista `todos` de mut_ler(): {estado, id, desc, gate, resto}
      excecoes — entradas `lint == "mutation-sobrevivente"` do known_issues

    Devolve {"perdoados", "obsoletas", "remanescentes", "aplicadas",
             "perdoa_o_exit"} — forma declarada no cabeçalho desta seção.

    Depende só do vocabulário acima (IC9_LINT/IC9_CAMPOS/IC9_CURINGA), nunca das
    asserções abaixo: o gate depende do mecanismo, e não o contrário.
    """
    perdoados, obsoletas, aplicadas = [], [], []
    porid = {}
    for b in (blocos or []):
        if isinstance(b, dict):
            porid.setdefault(str(b.get("id", "")).strip(), b)
    for e in (excecoes or []):
        if not isinstance(e, dict):
            continue
        # O lint é reconferido DE PROPÓSITO: a função é pública e recebe a lista
        # já filtrada, mas não pode perdoar uma exceção de outro lint que caia
        # nela por descuido de quem chama.
        if e.get("lint") not in (None, IC9_LINT):
            continue
        exc = e.get("excecao")
        if not isinstance(exc, dict):
            continue
        campos = {c: exc.get(c) for c in IC9_CAMPOS}
        # Exceção MALFORMADA nunca perdoa. Campo ausente, vazio, não-texto ou com
        # curinga é abrangente por omissão; IC-9.1 já a reprova no registro, e aqui
        # ela simplesmente não tem efeito. A direção segura é NÃO perdoar.
        if any(not isinstance(v, str) or not v.strip() or IC9_CURINGA.search(v)
               for v in campos.values()):
            continue
        if not all(isinstance(e.get(c), str) and e.get(c, "").strip()
                   for c in ("motivo", "remocao_prevista")):
            continue   # sem prazo/motivo não é exceção: é permissão permanente
        if campos["harness"].strip() != str(harness).strip():
            continue   # NOMINAL ao harness: exceção da p51 não cobre a p50
        mid = campos["mutante"].strip()
        alvo = porid.get(mid)
        if alvo is None:
            continue   # esta campanha não emitiu o mutante — nada a perdoar aqui
        kid = str(e.get("id") or "?")
        estado = str(alvo.get("estado", "")).strip()
        motivo = " ".join(e["motivo"].split())
        if len(motivo) > IC9_TETO_MOTIVO:
            motivo = (motivo[:IC9_TETO_MOTIVO].rstrip()
                      + f"\u2026 [integral em known_issues.json \u2192 {kid}]")
        if estado == "DETECTADO":
            obsoletas.append(mid)
            aplicadas.append(
                f"       [EXCEÇÃO OBSOLETA] {kid}: {harness}/{mid} voltou a DETECTADO nesta "
                f"campanha — o mutante morreu e a exceção perdeu o motivo; REMOVA a entrada")
            aplicadas.append(
                f"                          prazo declarado: {e['remocao_prevista']}")
        elif estado == "SOBREVIVENTE":
            perdoados.append(mid)
            aplicadas.append(
                f"       [EXCEÇÃO] {kid}: {harness}/{mid} SOBREVIVENTE perdoado · gate "
                f"{campos['gate'].strip()}")
            aplicadas.append(f"                 prazo: {e['remocao_prevista']}")
            aplicadas.append(f"                 motivo: {motivo}")
        # `NÃO EXECUTADO` cai fora dos dois ramos DE PROPÓSITO: não executar não é
        # sobreviver, e perdoar o que não rodou é o SKIP silencioso da R10 §2
        # entrando pela porta dos fundos. Ele desce inteiro para `remanescentes`.
    remanescentes = [str(b.get("id", "")).strip() for b in (blocos or [])
                     if isinstance(b, dict)
                     and str(b.get("estado", "")).strip() != "DETECTADO"
                     and str(b.get("id", "")).strip() not in perdoados]
    return {"perdoados": perdoados, "obsoletas": obsoletas,
            "remanescentes": remanescentes, "aplicadas": aplicadas,
            # Campanha vazia NUNCA é perdoada: sem `perdoados` não há perdão, e um
            # harness que morreu antes de emitir mutante nenhum não vira verde.
            "perdoa_o_exit": bool(perdoados) and not obsoletas and not remanescentes}


# ═══════════════════════════════════════════════════════════════════════════
# Contrato C6 · GUARDA DE LEITURA PARCIAL NO PERDÃO (013 · IC-10)
#
# O DEFEITO que este contrato fecha — medido em 8b5be3e, worktree efêmera, com
# harness sintético (preflight declara 3 mutantes; a campanha emite 1, o
# SOBREVIVENTE coberto pela exceção, e morre com exit 1):
#
#     [RUN]  sonda013: node tests_sonda013_mutants.js
#            não-KILL: LEITURA PARCIAL em `sonda013` — 1 mutante(s) lido(s) … contra 3 …
#            [EXCEÇÃO] KI-…: sonda013/MUT-… SOBREVIVENTE perdoado · gate …
#     mutation: 1 campanha(s) executada(s) · 0 problema(s)          ← exit 0
#
# Campanha que NÃO TERMINOU sai verde. Antes do green do IC-9 essa mesma campanha
# reprovava — o perdão é que passou a engolir o vermelho.
#
# CLASSIFICAÇÃO (decisão do proprietário no chat de 2026-08-30, CONTRA a
# classificação do `qa-engineer`, que havia proposto tratar isto como cláusula
# nova a ratificar): não é cláusula nova, é DEFEITO DO MECANISMO contra a PRIMEIRA
# cláusula já ratificada — "nominal, nunca abrangente". Um perdão aplicado sobre
# leitura parcial NÃO É NOMINAL: ele perdoa o que leu e, sem querer, tudo o que
# não leu. Não se pode afirmar que o perdoado é o único não-KILL sem ter lido
# TODOS. O mecanismo não cumpre a cláusula que já foi ratificada.
#
#   mut_guarda_leitura(harness, blocos, esperados, perdao) -> dict  FUNÇÃO PURA
#     harness   — nome do harness no mutation_map.json
#     blocos    — a lista `todos` de mut_ler(): o que a campanha DE FATO emitiu
#     esperados — quantos mutantes o preflight (C1) declara para o harness, ou
#                 None quando oráculo nenhum respondeu (harness sem preflight)
#     perdao    — o dicionário devolvido por mut_perdao() (contrato C5)
#     devolve  {"parcial": bool,        # len(blocos) != esperados, OU esperados None
#               "recusa":  bool,        # havia perdão aplicável e ele foi ANULADO
#               "linhas":  [linha…],    # o que o stage IMPRIME — não vazia SSE `recusa`
#               "perdoa_o_exit": bool}  # perdao["perdoa_o_exit"] AND NOT parcial
#
# O ponto de conserto é o LAÇO (que tem `IC_PREFLIGHT`), não `mut_perdao`: a
# função pura de C5 não sabe — e não pode saber — quantos mutantes deveriam ter
# aparecido. C5 fica INTACTA, e com ela as quatro cláusulas verdes do IC-9.
#
# As duas exigências que o proprietário fixou, e onde cada uma é medida:
#   1. RECUSA IMPRESSA E NOMEADA, COM OS NÚMEROS — `linhas` traz IC10_MARCA, o
#      harness, o(s) id(s) cujo perdão foi anulado e as duas contagens (IC-10.3,
#      cenários i/iii/iv/vii). Recusa silenciosa trocaria um engolimento por outro.
#   2. A `LEITURA PARCIAL` de `mut_relata` NÃO É ENFRAQUECIDA — ela é RELATO, a
#      guarda é VEREDITO, e as duas COEXISTEM (IC-10.4, regressão executada, que
#      também exige que a marca da guarda não vaze para dentro do relato).
#
# `esperados is None` conta como PARCIAL de propósito: sem oráculo de contagem
# ninguém pode afirmar que leu tudo, e a direção segura é NÃO perdoar — com a
# ausência do oráculo DITA na linha (IC10_SEM_ORACULO), nunca em silêncio (R10 §2).
#
# O que a guarda NÃO faz: não inventa problema onde perdão nenhum foi aplicado (o
# relato já fala — cenários v/vi/viii), não mexe em `obsoletas` (que já reprova
# por conta própria), não lê arquivo e não escreve nada (R7 §3).
# ═══════════════════════════════════════════════════════════════════════════
IC10_MARCA = "[EXCEÇÃO NÃO APLICADA]"
IC10_SEM_ORACULO = "sem oráculo de contagem (C1)"
# Chaves que a guarda LÊ do dicionário de C5: o acordo de forma entre os dois
# contratos é MEDIDO (IC-10.1), não presumido.
IC10_LIDAS = ("perdoados", "perdoa_o_exit")


def mut_guarda_leitura(harness, blocos, esperados, perdao):
    """Guarda de leitura parcial no perdão — contrato C6. FUNÇÃO PURA.

    Chamada pelo LAÇO, entre `mut_perdao` (C5) e o veredito. Vive aqui e não
    dentro de C5 por uma razão de conhecimento, não de arrumação: `mut_perdao`
    não sabe — e não pode saber — quantos mutantes DEVERIAM ter aparecido; quem
    tem o oráculo de contagem (`IC_PREFLIGHT`, contrato C1) é o laço.

      harness   — nome do harness no mutation_map.json
      blocos    — a lista `todos` de mut_ler(): o que a campanha DE FATO emitiu
      esperados — quantos mutantes o preflight (C1) declara, ou None quando
                  oráculo nenhum respondeu (harness sem preflight, ou preflight
                  que fracassou — IC-4 já nomeia o fracasso lá em cima)
      perdao    — o dicionário devolvido por `mut_perdao()` (contrato C5)

    Devolve {"parcial", "recusa", "linhas", "perdoa_o_exit"} — forma declarada no
    cabeçalho desta seção. NÃO mexe em `obsoletas` (que reprova por conta
    própria), não inventa problema onde perdão nenhum foi aplicado, não lê
    arquivo e não escreve nada (R7 §3).
    """
    lidos = len(blocos or [])
    perdao = perdao if isinstance(perdao, dict) else {}
    perdoados = [str(m).strip() for m in (perdao.get("perdoados") or [])]
    # `bool` é subclasse de `int` e entraria numa comparação com sentido nenhum:
    # excluído de propósito, junto com qualquer outro tipo — oráculo malformado
    # cai no MESMO ramo do oráculo ausente, que é a direção segura.
    tem_oraculo = isinstance(esperados, int) and not isinstance(esperados, bool)
    # Sem oráculo, PARCIAL por decisão: ninguém pode afirmar que leu tudo, e a
    # ausência sai DITA na linha (IC10_SEM_ORACULO), nunca em silêncio (R10 §2).
    parcial = (not tem_oraculo) or lidos != esperados
    # A recusa exige que houvesse perdão A APLICAR. Note que ela NÃO olha
    # `perdoa_o_exit`: no cenário vii o perdão já não perdoava o exit (havia
    # remanescente) e mesmo assim foi anulado e DITO — o que se anula é o ato de
    # perdoar, não o seu efeito aritmético.
    recusa = parcial and bool(perdoados)
    linhas = []
    if recusa:
        if not tem_oraculo:
            causa = (f"NÃO PÔDE ser conferida ({lidos} mutante(s) lido(s) e "
                     f"{IC10_SEM_ORACULO}: o harness não declara preflight, ou o "
                     f"preflight fracassou e IC-4 já o nomeou)")
        elif lidos < esperados:
            causa = (f"lida PARCIALMENTE ({lidos} mutante(s) lido(s) contra "
                     f"{esperados} declarado(s) pelo preflight (C1))")
        else:
            causa = (f"lida em DIVERGÊNCIA com o preflight ({lidos} mutante(s) "
                     f"lido(s) contra {esperados} declarado(s) pelo preflight (C1))")
        linhas.append(f"       {IC10_MARCA} {harness}: perdão de "
                      f"{', '.join(perdoados)} ANULADO — a campanha foi {causa}")
        linhas.append("                        o perdão do IC-9 é NOMINAL: aplicado "
                      "sobre leitura parcial ele perdoaria o que leu e, sem saber, "
                      "tudo o que não leu")
    return {"parcial": parcial, "recusa": recusa, "linhas": linhas,
            "perdoa_o_exit": bool(perdao.get("perdoa_o_exit")) and not parcial}


EX_FAILS = 0


def ex_ok(msg):
    print(f"[OK]   IC-9: {msg}")


def ex_fail(alvo, causa):
    global EX_FAILS
    EX_FAILS += 1
    print(f"[FAIL] IC-9: {alvo} · {causa}")


def ex_ids_do_harness(nome):
    """(ids declarados pelo harness, oráculo que respondeu).

    Mesma escada de IC-5/IC-6: preflight (C1) primeiro, leitura estática do
    fonte como reserva. Quem responde nunca fica implícito — o oráculo sai
    impresso junto do veredito.
    """
    d = IC_PREFLIGHT.get(nome)
    if d:
        return [m.get("id", "?") for m in d["mutantes"]], "preflight (C1)"
    h = MAP.get(nome) or {}
    fontes = [f for f in ic_fontes(h) if os.path.exists(f)]
    if not fontes:
        return [], "nenhum (harness sem preflight e sem fonte varrível)"
    return ic_estatico(fontes[0])[0], "leitura estática do fonte (reserva)"


print("---- exceção nominal de mutante sobrevivente (013 · IC-9) ----")

try:
    EX_ENTRADAS = [i for i in json.load(open(".claude/verify/known_issues.json",
                                             encoding="utf-8"))["issues"]
                   if i.get("lint") == IC9_LINT]
except Exception as _e_ki:
    EX_ENTRADAS = []
    ex_fail("known_issues.json", f"não pôde ser lido para IC-9: "
                                 f"{type(_e_ki).__name__}: {_e_ki}")
try:
    EX_MATRIZ = json.load(open(".claude/verify/mutation-matrix.json", encoding="utf-8"))
except Exception:
    EX_MATRIZ = None   # IC-5 acima já nomeia a falha de leitura; não se duplica FAIL

# ── IC-9.1/9.2/9.3 · a entrada: nominal, com prazo, com objeto vivo e não obsoleta
if not EX_ENTRADAS:
    ex_ok(f"nenhuma exceção `{IC9_LINT}` declarada em known_issues.json — nada a "
          "honrar (o mecanismo continua medido abaixo, com dados sintéticos)")
for _e in EX_ENTRADAS:
    _kid = str(_e.get("id") or "?")
    _exc = _e.get("excecao")
    if not isinstance(_exc, dict):
        ex_fail(f"known_issues/{_kid}", "sem objeto `excecao` — exceção que não nomeia "
                                        "harness, mutante e gate é abrangente por omissão")
        continue
    _ruim = False
    for _c in IC9_CAMPOS:
        _v = _exc.get(_c)
        if not isinstance(_v, str) or not _v.strip():
            ex_fail(f"known_issues/{_kid}", f"`excecao.{_c}` ausente, vazio ou não-texto "
                                            f"({_v!r}) — a exceção é NOMINAL: harness + id do "
                                            f"mutante + gate, um de cada, nunca coleção")
            _ruim = True
        elif IC9_CURINGA.search(_v):
            ex_fail(f"known_issues/{_kid}", f"`excecao.{_c}` = {_v!r} carrega curinga — nada "
                                            "de 'tolerar sobreviventes do harness inteiro'")
            _ruim = True
    for _c in ("motivo", "remocao_prevista"):
        if not isinstance(_e.get(_c), str) or not _e[_c].strip():
            ex_fail(f"known_issues/{_kid}", f"`{_c}` ausente ou vazio — o `_meta` do próprio "
                                            "known_issues diz que exceção sem prazo vira "
                                            "permissão permanente")
            _ruim = True
    if _ruim:
        continue
    _hn, _mn, _gn = (_exc["harness"].strip(), _exc["mutante"].strip(), _exc["gate"].strip())
    # IC-9.2 · o objeto da exceção existe (exceção a fantasma é permissão eterna)
    if _hn not in MAP:
        ex_fail(f"known_issues/{_kid}", f"harness {_hn!r} não existe em mutation_map.json — "
                                        "exceção que nomeia fantasma nunca pode ser cumprida")
        continue
    _ids, _orc = ex_ids_do_harness(_hn)
    if not _ids:
        ex_fail(f"known_issues/{_kid}", f"os mutantes de {_hn} não puderam ser obtidos por "
                                        f"oráculo nenhum — existência do mutante nomeado NÃO "
                                        f"MEDIDA (R10 §2: não é SKIP, é FAIL)")
        continue
    if _mn not in _ids:
        ex_fail(f"known_issues/{_kid}", f"o harness {_hn} não declara o mutante {_mn!r} "
                                        f"[oráculo: {_orc}] — a exceção nomeia um fantasma")
        continue
    ex_ok(f"{_kid}: {_hn}/{_mn} existe no harness [oráculo: {_orc}] · prazo: "
          f"{_e['remocao_prevista']}")
    # IC-9.3 · não obsoleta, pelo REGISTRO (a direção medível sem Chromium)
    if EX_MATRIZ is None:
        ex_fail(f"known_issues/{_kid}", "mutation-matrix.json ilegível — a exceção fica sem "
                                        "prova registrada que a sustente; NÃO MEDIDA (R10 §2)")
        continue
    _par = next((p for p in EX_MATRIZ.get("pares", [])
                 if str(p.get("mutante", "")).strip() == _mn
                 and re.match(r"\s*" + re.escape(_hn) + r"\b", str(p.get("harness", "")))), None)
    if _par is None:
        ex_fail(f"known_issues/{_kid}", f"nenhum par {_hn}/{_mn} em mutation-matrix.json — "
                                        "exceção sem par não tem última prova, e sem última "
                                        "prova não há como saber se ela ficou obsoleta")
        continue
    _up = _par.get("ultima_prova") or {}
    _res, _data = _up.get("resultado"), _up.get("data")
    if _res is None:
        ex_fail(f"known_issues/{_kid}", f"o par {_hn}/{_mn} não tem `ultima_prova.resultado` — "
                                        "a obsolescência da exceção fica NÃO MEDIDA (R10 §2)")
    elif _res == "KILL":
        ex_fail(f"known_issues/{_kid}",
                f"EXCEÇÃO OBSOLETA — mutation-matrix.json registra ultima_prova.resultado = "
                f"'KILL' para {_hn}/{_mn} ({_data}): o mutante voltou a morrer e a exceção "
                f"perdeu o motivo. Remova a entrada (prazo declarado: "
                f"{_e['remocao_prevista']!r}) — exceção que sobrevive à própria razão apodrece "
                "exatamente como âncora podre")
    else:
        _gp = str(_par.get("gate", "")).strip()
        if not _gp.startswith(_gn):
            ex_fail(f"known_issues/{_kid}", f"gate declarado {_gn!r} diverge do par na matriz "
                                            f"({_gp!r}) — a exceção tem de nomear o gate que de "
                                            "fato deixou de reprovar")
        else:
            ex_ok(f"{_kid}: {_hn}/{_mn} segue não-KILL no registro (ultima_prova.resultado = "
                  f"{_res!r}, {_data}) · gate {_gn} · classificação: "
                  f"{_par.get('classificacao')!r}")

# ── IC-9.4 · o mecanismo tem dentes (sonda em processo, contrato C5) ─────────
# Dados SINTÉTICOS por construção: o poder discriminante do perdão não pode
# depender de existir uma exceção real, senão ele deixa de ser medido no dia em
# que a última for cumprida — que é justamente o dia em que ninguém olha.
IC9_SONDA_H = "harness-sonda-013"
IC9_SONDA_A = "MUT-SONDA-A-013"
IC9_SONDA_B = "MUT-SONDA-B-013"
IC9_SONDA_G = "GATE-SONDA-013"
IC9_SONDA_KI = "KI-SONDA-013"
IC9_SONDA_PRAZO = "sonda em processo — não é exceção real"
IC9_SONDA_EXC = [{"id": IC9_SONDA_KI, "lint": IC9_LINT,
                  "excecao": {"harness": IC9_SONDA_H, "mutante": IC9_SONDA_A,
                              "gate": IC9_SONDA_G},
                  "motivo": "sonda de IC-9 — não vem do known_issues.json",
                  "remocao_prevista": IC9_SONDA_PRAZO}]


def ic9_bloco(estado, mid):
    return {"estado": estado, "id": mid, "desc": "sonda IC-9 (sintética)",
            "gate": IC9_SONDA_G, "resto": ""}


IC9_CENARIOS = [
    ("i · positivo canônico (o nomeado sobrevive, o vizinho morre)", IC9_SONDA_H, True,
     [ic9_bloco("SOBREVIVENTE", IC9_SONDA_A), ic9_bloco("DETECTADO", IC9_SONDA_B)],
     {"perdoados": [IC9_SONDA_A], "obsoletas": [], "remanescentes": [], "perdoa_o_exit": True}),
    ("ii · EXCEÇÃO OBSOLETA (o nomeado voltou a KILL)", IC9_SONDA_H, True,
     [ic9_bloco("DETECTADO", IC9_SONDA_A), ic9_bloco("DETECTADO", IC9_SONDA_B)],
     {"perdoados": [], "obsoletas": [IC9_SONDA_A], "remanescentes": [], "perdoa_o_exit": False}),
    ("iii · sobrevivente NOVO ao lado do perdoado", IC9_SONDA_H, True,
     [ic9_bloco("SOBREVIVENTE", IC9_SONDA_A), ic9_bloco("SOBREVIVENTE", IC9_SONDA_B)],
     {"perdoados": [IC9_SONDA_A], "obsoletas": [], "remanescentes": [IC9_SONDA_B],
      "perdoa_o_exit": False}),
    ("iv · a exceção é nominal ao HARNESS, não só ao id", "outro-harness-013", True,
     [ic9_bloco("SOBREVIVENTE", IC9_SONDA_A)],
     {"perdoados": [], "obsoletas": [], "remanescentes": [IC9_SONDA_A], "perdoa_o_exit": False}),
    ("v · NÃO EXECUTADO não é sobrevivência perdoável", IC9_SONDA_H, True,
     [ic9_bloco("NÃO EXECUTADO", IC9_SONDA_A)],
     {"perdoados": [], "obsoletas": [], "remanescentes": [IC9_SONDA_A], "perdoa_o_exit": False}),
    ("vi · campanha que não emitiu mutante nenhum", IC9_SONDA_H, True, [],
     {"perdoados": [], "obsoletas": [], "remanescentes": [], "perdoa_o_exit": False}),
    ("vii · regressão: sem exceção declarada, nada muda", IC9_SONDA_H, False,
     [ic9_bloco("SOBREVIVENTE", IC9_SONDA_A)],
     {"perdoados": [], "obsoletas": [], "remanescentes": [IC9_SONDA_A], "perdoa_o_exit": False}),
]

_ic9_perdao = globals().get("mut_perdao")
if not callable(_ic9_perdao):
    ex_fail("check_mutation.py",
            "o julgador não expõe `mut_perdao(harness, blocos, excecoes)` (contrato C5) — a "
            "exceção nominal do known_issues.json não é honrada por mecanismo nenhum: um "
            "SOBREVIVENTE conhecido e classificado segue indistinguível de um novo, e uma "
            "exceção que já perdeu a razão não tem por onde reprovar")
else:
    _ic9_maus = 0
    for _rot, _h, _com_exc, _blocos, _quer in IC9_CENARIOS:
        _exc_in = IC9_SONDA_EXC if _com_exc else []
        try:
            _got = _ic9_perdao(_h, _blocos, _exc_in)
        except Exception as _err:
            ex_fail(f"mut_perdao · cenário {_rot}",
                    f"levantou {type(_err).__name__}: {_err}")
            _ic9_maus += 1
            continue
        if not isinstance(_got, dict):
            ex_fail(f"mut_perdao · cenário {_rot}",
                    f"C5 exige dict; veio {type(_got).__name__}")
            _ic9_maus += 1
            continue
        for _k, _v in _quer.items():
            _r = _got.get(_k)
            if isinstance(_v, list):
                _r = sorted(_r) if isinstance(_r, (list, tuple)) else _r
                _v = sorted(_v)
            if _r != _v:
                ex_fail(f"mut_perdao · cenário {_rot}", f"`{_k}` = {_r!r}, esperado {_v!r}")
                _ic9_maus += 1
        if _quer["perdoa_o_exit"]:
            _linhas = _got.get("aplicadas")
            if not isinstance(_linhas, list) or not _linhas:
                ex_fail(f"mut_perdao · cenário {_rot}",
                        "perdoou sem `aplicadas` — verde que não conta que houve exceção é a "
                        "doença desta demanda: a exceção é IMPRESSA, nunca silenciosa")
                _ic9_maus += 1
            else:
                _txt = " ".join(str(x) for x in _linhas)
                _faltam = [t for t in (IC9_SONDA_KI, IC9_SONDA_A, IC9_SONDA_PRAZO)
                           if t not in _txt]
                if _faltam:
                    ex_fail(f"mut_perdao · cenário {_rot}",
                            "a linha de aplicação não nomeia " +
                            ", ".join(repr(t) for t in _faltam) +
                            " — id da exceção, mutante e prazo saem impressos, ou o perdão "
                            "é silencioso")
                    _ic9_maus += 1
    if not _ic9_maus:
        ex_ok(f"mut_perdao discrimina nos {len(IC9_CENARIOS)} cenários da sonda: perdão · "
              "OBSOLETA · sobrevivente novo · harness alheio · não executado · campanha "
              "vazia · sem exceção")

print(f"---- exceção nominal: {EX_FAILS} problema(s) nomeado(s) ----")

# ═══════════════════════════════════════════════════════════════════════════
# IC-10 · A GUARDA DE LEITURA PARCIAL TEM DENTES (contrato C6)
#
# Bloco ADITIVO, com contador PRÓPRIO e fecho próprio, exatamente como o do IC-9:
# `---- integridade: N ----` e `---- exceção nominal: N ----` continuam contando
# só o que sempre contaram. A seção de integridade (IC-1…IC-6) e as quatro
# cláusulas verdes do IC-9 não são tocadas.
#
# Sonda EM PROCESSO com dados SINTÉTICOS, pela mesma razão do IC-9.4: o poder
# discriminante da guarda tem de seguir medido no dia em que não houver exceção
# nenhuma declarada — que é o dia em que ninguém olha.
#
# LIMITE ESTRUTURAL, declarado em vez de fingido: esta sonda mede a FUNÇÃO, não a
# FIAÇÃO. Passam por IC-10 tanto a guarda impecável que o laço nunca chama
# (M-IC29) quanto a que o laço chama alimentando `esperados` com o próprio número
# lido (M-IC31, o erro mais provável do green) — os dois registrados com o job
# onde morrem. Asserção por `grep` no próprio fonte foi considerada e RECUSADA
# pelo mesmo motivo do IC-9: comentário ou chamada morta a satisfazem, e verde
# que não mede é a doença desta demanda.
# ═══════════════════════════════════════════════════════════════════════════
import contextlib, io

print("---- guarda de leitura parcial no perdão (013 · IC-10) ----")

GP_FAILS = 0


def gp_ok(msg):
    print(f"[OK]   IC-10: {msg}")


def gp_fail(alvo, causa):
    global GP_FAILS
    GP_FAILS += 1
    print(f"[FAIL] IC-10: {alvo} · {causa}")


IC10_SONDA_H = "harness-sonda-C6-013"
IC10_SONDA_A = "MUT-C6-A-013"
IC10_SONDA_B = "MUT-C6-B-013"
IC10_SONDA_G = "GATE-SONDA-C6-013"
IC10_SONDA_KI = "KI-SONDA-C6-013"


def ic10_bloco(estado, mid):
    return {"estado": estado, "id": mid, "desc": "sonda IC-10 (sintética)",
            "gate": IC10_SONDA_G, "resto": ""}


def ic10_perdao(perdoados=(), obsoletas=(), remanescentes=()):
    """Dicionário de C5 SINTÉTICO, construído à mão — a guarda é medida SOZINHA.

    Deliberado: assim um mutante de `mut_perdao` não derruba a sonda da guarda
    por tabela (morte incidental polui a matriz gate↔mutante). O acordo de FORMA
    com o C5 real é medido à parte, em IC-10.1, e é lá que a divergência aparece.
    """
    return {"perdoados": list(perdoados), "obsoletas": list(obsoletas),
            "remanescentes": list(remanescentes),
            "aplicadas": [f"       [EXCEÇÃO] {IC10_SONDA_KI}: {m} perdoado"
                          for m in perdoados],
            "perdoa_o_exit": bool(perdoados) and not obsoletas and not remanescentes}


# (rótulo, blocos emitidos, esperados pelo preflight, perdão de C5, veredito exigido)
IC10_CENARIOS = [
    ("i · positivo canônico — o DEFEITO: campanha truncada cujo único não-KILL "
     "emitido é justamente o perdoado",
     [ic10_bloco("SOBREVIVENTE", IC10_SONDA_A)], 3, ic10_perdao([IC10_SONDA_A]),
     {"parcial": True, "recusa": True, "perdoa_o_exit": False}),
    ("ii · negativo canônico — leitura COMPLETA: o perdão do IC-9 segue valendo",
     [ic10_bloco("SOBREVIVENTE", IC10_SONDA_A), ic10_bloco("DETECTADO", IC10_SONDA_B)],
     2, ic10_perdao([IC10_SONDA_A]),
     {"parcial": False, "recusa": False, "perdoa_o_exit": True}),
    ("iii · adversarial — divergência para MAIS (leu mais do que o preflight declara)",
     [ic10_bloco("SOBREVIVENTE", IC10_SONDA_A), ic10_bloco("DETECTADO", IC10_SONDA_B)],
     1, ic10_perdao([IC10_SONDA_A]),
     {"parcial": True, "recusa": True, "perdoa_o_exit": False}),
    ("iv · adversarial — oráculo de contagem AUSENTE (harness sem preflight)",
     [ic10_bloco("SOBREVIVENTE", IC10_SONDA_A)], None, ic10_perdao([IC10_SONDA_A]),
     {"parcial": True, "recusa": True, "perdoa_o_exit": False}),
    ("v · leitura parcial SEM perdão aplicável — a guarda não inventa problema",
     [ic10_bloco("SOBREVIVENTE", IC10_SONDA_B)], 3, ic10_perdao([]),
     {"parcial": True, "recusa": False, "perdoa_o_exit": False}),
    ("vi · OBSOLETA sob leitura parcial — a guarda não mexe em `obsoletas`",
     [ic10_bloco("DETECTADO", IC10_SONDA_A)], 3,
     ic10_perdao([], obsoletas=[IC10_SONDA_A]),
     {"parcial": True, "recusa": False, "perdoa_o_exit": False}),
    ("vii · perdão aplicado sobre leitura parcial COM remanescente — anulado E dito",
     [ic10_bloco("SOBREVIVENTE", IC10_SONDA_A), ic10_bloco("SOBREVIVENTE", IC10_SONDA_B)],
     3, ic10_perdao([IC10_SONDA_A], remanescentes=[IC10_SONDA_B]),
     {"parcial": True, "recusa": True, "perdoa_o_exit": False}),
    ("viii · regressão — campanha que não emitiu mutante nenhum",
     [], 3, ic10_perdao([]),
     {"parcial": True, "recusa": False, "perdoa_o_exit": False}),
]

# ── IC-10.1 · acordo de forma C5 → C6 (o oráculo da forma é o C5 real) ───────
_ic10_c5 = globals().get("mut_perdao")
if not callable(_ic10_c5):
    print("[NOTA] IC-10: acordo de forma C5→C6 NÃO MEDIDO — `mut_perdao` não existe; "
          "IC-9 já nomeia esse FAIL e não se duplica. A sonda abaixo segue medindo a "
          "guarda com dicionários sintéticos da forma declarada em C6")
else:
    _ic10_exc = [{"id": IC10_SONDA_KI, "lint": IC9_LINT,
                  "excecao": {"harness": IC10_SONDA_H, "mutante": IC10_SONDA_A,
                              "gate": IC10_SONDA_G},
                  "motivo": "sonda de IC-10 — não vem do known_issues.json",
                  "remocao_prevista": "sonda em processo — não é exceção real"}]
    try:
        _ic10_ref = _ic10_c5(IC10_SONDA_H, [ic10_bloco("SOBREVIVENTE", IC10_SONDA_A)],
                             _ic10_exc)
    except Exception as _e_c5:
        _ic10_ref = None
        gp_fail("C5 → C6", f"`mut_perdao` levantou {type(_e_c5).__name__} ao produzir a "
                           f"forma de referência da sonda: {_e_c5}")
    if isinstance(_ic10_ref, dict):
        _ic10_faltam = [k for k in IC10_LIDAS if k not in _ic10_ref]
        if _ic10_faltam:
            gp_fail("C5 → C6", "o dicionário de `mut_perdao` não traz " +
                    ", ".join(repr(k) for k in _ic10_faltam) + " — a guarda lê essas chaves "
                    "e, sem elas, C6 mediria uma forma que nunca ocorre na execução real")
        else:
            gp_ok("acordo de forma C5→C6: `mut_perdao` devolve as chaves que a guarda lê "
                  f"({', '.join(IC10_LIDAS)}) — a sonda sintética abaixo não mede forma "
                  "inventada")
    elif _ic10_ref is not None:
        gp_fail("C5 → C6", f"`mut_perdao` devolveu {type(_ic10_ref).__name__}, não dict")

# ── IC-10.2/10.3 · o seam existe e discrimina (contrato C6) ──────────────────
_ic10_guarda = globals().get("mut_guarda_leitura")
if not callable(_ic10_guarda):
    gp_fail("check_mutation.py",
            "o laço não expõe `mut_guarda_leitura(harness, blocos, esperados, perdao)` "
            "(contrato C6) — o perdão nominal do IC-9 é aplicado SEM conferir se a campanha "
            "foi lida inteira: campanha TRUNCADA cujo único não-KILL emitido é justamente o "
            "perdoado fecha `0 problema(s)` e sai 0, com a `LEITURA PARCIAL` impressa e "
            "ignorada pelo veredito. Perdão sobre leitura parcial não é NOMINAL — perdoa o "
            "que leu e, sem querer, tudo o que não leu; e um verde que esconde campanha que "
            "não terminou é a doença desta demanda inteira")
else:
    _ic10_maus = 0
    for _rot, _blocos, _esp, _perdao, _quer in IC10_CENARIOS:
        try:
            _got = _ic10_guarda(IC10_SONDA_H, _blocos, _esp, _perdao)
        except Exception as _err10:
            gp_fail(f"mut_guarda_leitura · cenário {_rot}",
                    f"levantou {type(_err10).__name__}: {_err10}")
            _ic10_maus += 1
            continue
        if not isinstance(_got, dict):
            gp_fail(f"mut_guarda_leitura · cenário {_rot}",
                    f"C6 exige dict; veio {type(_got).__name__}")
            _ic10_maus += 1
            continue
        for _k, _v in _quer.items():
            if _got.get(_k) != _v:
                gp_fail(f"mut_guarda_leitura · cenário {_rot}",
                        f"`{_k}` = {_got.get(_k)!r}, esperado {_v!r}")
                _ic10_maus += 1
        _linhas10 = _got.get("linhas")
        if not isinstance(_linhas10, list):
            gp_fail(f"mut_guarda_leitura · cenário {_rot}",
                    f"`linhas` tem de ser lista; veio {type(_linhas10).__name__}")
            _ic10_maus += 1
            continue
        _txt10 = " ".join(str(x) for x in _linhas10)
        if _quer["recusa"]:
            # Exigência 1 do proprietário: recusa IMPRESSA e NOMEADA, com os números.
            _exig10 = [IC10_MARCA, IC10_SONDA_H, str(len(_blocos))]
            _exig10 += list(_perdao["perdoados"])
            _exig10.append(str(_esp) if _esp is not None else IC10_SEM_ORACULO)
            _falta10 = [t for t in _exig10 if t not in _txt10]
            if _falta10:
                gp_fail(f"mut_guarda_leitura · cenário {_rot}",
                        "a recusa não nomeia " + ", ".join(repr(t) for t in _falta10) +
                        " — recusa silenciosa troca um engolimento por outro: o stage tem de "
                        "dizer que havia exceção aplicável, que ela NÃO foi aplicada por "
                        "leitura parcial, e os números")
                _ic10_maus += 1
        elif _linhas10:
            gp_fail(f"mut_guarda_leitura · cenário {_rot}",
                    f"recusou nada e mesmo assim imprimiu {len(_linhas10)} linha(s) "
                    f"({_txt10[:90]!r}…) — sem perdão anulado a guarda cala; quem relata o "
                    "que faltou ler é `mut_relata`, e o ruído aqui mataria a distinção")
            _ic10_maus += 1
    if not _ic10_maus:
        gp_ok(f"mut_guarda_leitura discrimina nos {len(IC10_CENARIOS)} cenários da sonda: "
              "truncada perdoada · leitura completa · divergência para mais · oráculo "
              "ausente · parcial sem perdão · obsoleta · remanescente · campanha vazia")

# ── IC-10.4 · regressão executada: o RELATO `LEITURA PARCIAL` não é enfraquecido
# A guarda é VEREDITO; `mut_relata` é RELATO. As duas coexistem — trocar uma pela
# outra seria enfraquecer um gate para acomodar o outro (R10 §1).
_ic10_relata = globals().get("mut_relata")
if not callable(_ic10_relata):
    gp_fail("check_mutation.py", "`mut_relata` desapareceu — o relato `LEITURA PARCIAL` é "
                                 "quem NOMEIA o que se deixou de ler; a guarda é veredito e "
                                 "não substitui o relato")
else:
    _ic10_nome_rel = "harness-relato-C6-013"
    _ic10_saida_rel = "".join(
        f"{e}  {i} · sonda IC-10 (sintética)\n" + " " * 14 + f"gate esperado: {IC10_SONDA_G}\n"
        for e, i in (("SOBREVIVENTE", IC10_SONDA_A), ("DETECTADO", IC10_SONDA_B)))
    # 2 blocos lidos contra 5 declarados: os dois números são discriminantes na
    # saída (nenhum outro `2` ou `5` aparece nela), o que impede casamento por acaso.
    IC_PREFLIGHT[_ic10_nome_rel] = {"mutantes": [{"id": f"MUT-C6-{n}-013"}
                                                 for n in "ABCDE"]}
    _buf10 = io.StringIO()
    try:
        with contextlib.redirect_stdout(_buf10):
            _ic10_relata(_ic10_nome_rel, _ic10_saida_rel, 1)
    except Exception as _e_rel:
        gp_fail("mut_relata · regressão", f"levantou {type(_e_rel).__name__}: {_e_rel}")
    finally:
        IC_PREFLIGHT.pop(_ic10_nome_rel, None)   # estado global devolvido intacto
    _rel10 = _buf10.getvalue()
    _falta_rel = [t for t in ("LEITURA PARCIAL", _ic10_nome_rel, "2", "5") if t not in _rel10]
    if _falta_rel:
        gp_fail("mut_relata · regressão", "o relato de leitura parcial deixou de nomear " +
                ", ".join(repr(t) for t in _falta_rel) + " — ele é a metade que diz O QUE se "
                "deixou de ler, e a guarda (veredito) não o substitui")
    elif IC10_MARCA in _rel10:
        gp_fail("mut_relata · regressão", f"o relato passou a imprimir {IC10_MARCA!r} — "
                "relato e veredito colapsaram num só; `mut_relata` não altera contagem e "
                "não decide perdão, e é essa separação que deixa as duas coexistirem")
    else:
        gp_ok("regressão: `mut_relata` segue emitindo `LEITURA PARCIAL` com as duas "
              "contagens (2 lidos × 5 declarados) e sem a marca da guarda — relato e "
              "veredito coexistem, cada um no seu papel")

print(f"---- guarda de leitura parcial: {GP_FAILS} problema(s) nomeado(s) ----")

fails = IC_FAILS + EX_FAILS + GP_FAILS  # [013] integridade (IC-1…IC-6) + exceção
                             # nominal (IC-9) + guarda de leitura parcial (IC-10),
                             # cada bloco com o seu contador e o seu fecho nomeado
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
    # As duas últimas linhas do harness continuam saindo LITERAIS: é o fecho dele
    # (razão histórica D/T ou `CAMPANHA NÃO CONCLUÍDA`, R13) e o único diagnóstico
    # que sobra quando o harness morre antes de emitir mutante nenhum. O relato
    # dos não-KILL é ADITIVO a isso — nada foi trocado por nada.
    tail = [l for l in (r.stdout or "").splitlines() if l.strip()][-2:]
    for l in tail:
        print("       " + l)
    # [016 · A1] os CONTROLES saem POR NOME com o `resultado:` do harness — é a única
    # linha que diz por que uma família inteira saiu NÃO EXECUTADO por baseline
    # vermelho; o tail acima nunca a alcança, e a nota dos não-KILL abaixo só a
    # repete se o harness a tiver posto lá (T060-b). Relato: nada aqui move `fails`.
    mut_relata_controles(name, r.stdout)
    # [013/E3 passo 0] os não-KILL param de ser descartados: identidade, gate
    # esperado, estado e a causa nas palavras do harness. Um `[FAIL]` que diz
    # "2 problemas" sem dizer QUAIS é a doença desta demanda cometida no próprio
    # julgador. Só relata — o veredito é a linha abaixo, e só ela.
    mut_relata(name, r.stdout, r.returncode)
    ran += 1
    # [013/IC-9 · green] O perdão nominal entra ENTRE o relato e o veredito. Só ele
    # pode transformar um `returncode != 0` em não-problema, e só quando uma exceção
    # VIVA cobre todos os não-KILL da campanha (`perdoa_o_exit`, contrato C5).
    #
    # Roda mesmo com `returncode == 0`, e essa é a metade da cláusula ⚠️ que só aqui
    # existe: a obsolescência pela EXECUÇÃO (o mutante nomeado voltou a DETECTADO)
    # tem de reprovar campanha VERDE — senão a exceção sobrevive à própria razão e
    # ninguém percebe. A outra metade, pelo REGISTRO, é IC-9.3 lá em cima.
    #
    # `mut_ler` é chamada de novo (pura, mesma entrada): `mut_relata` fica intacta.
    blocos = mut_ler(r.stdout)[0]
    perdao = mut_perdao(name, blocos, EX_ENTRADAS)
    # [013/IC-10 · green] `esperados` vem do PREFLIGHT (C1) e de mais lugar nenhum.
    # Derivá-lo de `blocos` (`len(blocos)`) faria a guarda comparar a leitura consigo
    # mesma: `parcial` seria False por construção, o IC-10 ficaria verde e a campanha
    # truncada voltaria a sair 0 — o buraco intacto sob um gate satisfeito (M-IC31).
    # Chave ausente (harness de IC_SEM_PREFLIGHT) e valor None (preflight que
    # fracassou, já nomeado por IC-4) caem os dois em `esperados = None`, que a guarda
    # trata como PARCIAL — sem oráculo não se afirma leitura completa.
    pf = IC_PREFLIGHT.get(name)
    esperados = len(pf["mutantes"]) if isinstance(pf, dict) else None
    guarda = mut_guarda_leitura(name, blocos, esperados, perdao)
    for linha in perdao["aplicadas"]:
        print(linha)          # IMPRESSA, nunca silenciosa (cláusula 3)
    # A linha `[EXCEÇÃO] … perdoado` NÃO é suprimida quando há recusa, e a escolha é
    # deliberada: ela é a única que nomeia a KI, o prazo e o motivo, e apagá-la faria
    # o stage esconder QUAL exceção esteve em jogo — o oposto da cláusula 3 do IC-9. A
    # anulação sai logo abaixo, com marca própria e mais alta, e é ela que vale.
    for linha in guarda["linhas"]:
        print(linha)          # recusa IMPRESSA e NOMEADA, com os números (C6)
    # O veredito passa a consumir `guarda["perdoa_o_exit"]`, nunca mais o de C5: só o
    # laço sabe se a campanha foi lida inteira, e perdão sobre leitura parcial não
    # perdoa o exit. `obsoletas` segue intocada — reprova por conta própria.
    if (r.returncode != 0 and not guarda["perdoa_o_exit"]) or perdao["obsoletas"]:
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
