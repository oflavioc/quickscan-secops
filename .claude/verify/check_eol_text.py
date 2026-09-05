#!/usr/bin/env python3
r"""Stage `eol-text` — a normalização de texto que o .gitattributes DECLARA está EM VIGOR
(R7 §1 executável). Achado EA-41 · fix-finding, classe estrutura/pipeline · 2026-09-05.
Dono: qa-engineer. R3 §2: a correção dos bytes acusados NÃO é deste arquivo nem deste agente.

O QUE MEDE. `git ls-files --eol` responde, por arquivo rastreado, três colunas:
  i/<x>   classificação do blob do ÍNDICE      (lf · crlf · mixed · none · -text · vazio)
  w/<x>   classificação do arquivo do WORKTREE (idem; vazio se ausente ou não regular)
  attr/…  o que o .gitattributes declara — vocabulário FECHADO do git (get_convert_attr_ascii):
            ""                                    sem declaração (`!text !eol`)
            -text                                 exclusão declarada (também `binary`)
            text · text=auto · text eol=lf · text=auto eol=lf · text eol=crlf · text=auto eol=crlf
                                                  normalização de texto declarada
`-text` em i/ ou w/ significa que o git classificou o CONTEÚDO como binário — byte NUL, CR
solitário, ou não-imprimíveis acima de 1/128 dos imprimíveis (convert.c: gather_stats /
convert_is_binary) — e por isso DESLIGOU a normalização de fim de linha para o arquivo, mesmo
com ela declarada. É a R7 §1 furada em silêncio: o `.gitattributes` continua dizendo `eol=lf`,
o git deixou de obedecer, e nenhum stage via (o `baseline` confere hash, não classificação).

REGRA — o gate FALHA sse existe arquivo rastreado com:
  EA41-EOL1(a)  normalização declarada (attr/text…) E classificado binário (i/-text ou w/-text).
                É o EA-41: `.claude/BACKLOG.md`, pinado, com dois bytes 0x00 gravados no lugar
                do escape de duas letras.
  EA41-EOL1(b)  normalização declarada E blob do ÍNDICE com CR (i/crlf ou i/mixed).
                É o E9 consumado — o CRLF que a alínea (a) existe para impedir já está no blob
                (entra por índice gravado sem filtro, ou por blob anterior à regra). Hoje 0 casos
                na árvore, MEDIDO (521 lf · 3 none · 1 -text nos 525 em escopo), não vazio: o
                carrasco vive na sonda (S10). `w/crlf` e `w/mixed` NÃO reprovam — o worktree não
                é o repositório e o `git add` seguinte normaliza (medido em git 2.55: removido o
                NUL de um arquivo CRLF, o add seguinte devolve i/lf) — são contados e nomeados.
FORA DO ESCOPO, POR DESENHO (dito aqui, não deixado implícito):
  attr/-text   exclusão que o REPOSITÓRIO declara: `*.svg -text` (hash pinado byte a byte, e
               `FortiNDR.svg` carrega CRLF interno de propósito), `*.png/*.zip/*.pdf binary`.
               O gate CONTA e imprime quantos são; não os julga. Hoje: 53.
  attr/ vazio  sem declaração — não há normalização a desligar. Contado; não julgado. Hoje: 0.
  Mudar uma declaração é mexer no `.gitattributes` (pinado): decisão de R7, não deste gate.

ORÁCULO. O próprio git: é ele quem decide normalizar ou não, logo a classificação dele é o fato,
não uma aproximação dele. O censo independente de bytes (NUL, CR solitário, CRLF, 1ª linha com
NUL) só DIAGNOSTICA a causa de cada arquivo acusado — para quem corrige — e denuncia quando a
reprodução em Python discorda do git (código `causa-nao-reproduzida`; o veredito não muda).

SONDA (EA41-EOL0) — roda ANTES da árvore, sempre. Repositório git EFÊMERO (tempfile.mkdtemp,
fora de qualquer árvore rastreada — R7 §3) e HERMÉTICO (GIT_CONFIG_NOSYSTEM, GIT_CONFIG_GLOBAL
vazio, GIT_ATTR_NOSYSTEM, HOME/XDG no tmp: o `core.autocrlf=true` do Git para Windows não entra),
com um `.gitattributes` da mesma forma do real. Cada caso pina attr, i/, w/, ALÍNEA e CÓDIGO DE
CAUSA — vocabulário fechado, não só o veredito: reprovar pela razão errada é sobrevivente
disfarçado. Controles que ALCANÇAM O VERDE provam que o gate não é constante-vermelho: S2 (o
remédio: mesmo texto com o escape `\x00` no lugar do byte), S6 (CRLF sem NUL: normalizado no
add), S8 (`text` sem `eol`), S3/S4/S12 (NUL sob exclusão declarada ou sem declaração — não
reprovam). S1 é o achado em miniatura; S5/S11 são as outras duas causas de `-text`; S7 é NUL com
CRLF; S9 prova que `text` sem `eol` também é julgado; S10 é o único carrasco de (b). As duas
guardas de contagem (TOTAL_SONDA, PROBLEMAS_SONDA) provam que a sonda rodou inteira e que o
julgador não acusa sujeito a mais. Instrumento que reprova na sonda NÃO julga a árvore: imprime
"árvore NÃO JULGADA" e sai 1 — veredito de instrumento quebrado não vale nem para o bem.

R10 §10 — AUTO-EXCLUSÃO: NÃO HÁ, de propósito. Este arquivo é varrido como qualquer outro e
passa porque cita o byte proibido pelo ESCAPE (duas letras), nunca pelo byte; as fixtures nascem
em runtime, dentro do repositório efêmero, e morrem com ele — nunca são rastreadas aqui. Excluir
o próprio caminho abriria exatamente o furo que o gate fecha: um NUL neste arquivo desligaria a
normalização DELE. O gate imprime a própria linha do censo quando rastreado — prova de que se
enxergou (antes do commit do red ela diz "não rastreado", e isso é verdade, não exceção).

R10 §2 — SKIP SILENCIOSO NÃO EXISTE: git ausente, `--eol` indisponível, registro fora do
formato, valor fora dos vocabulários fechados, `.gitattributes` não rastreado, censo vazio,
sonda incompleta — tudo sai como [FAIL] nomeado, exit 1. R10 §7: git por lista de argumentos,
sem shell; dependência declarada no env-doctor (git ausente = FAIL lá). R7 §3: nada é escrito na
árvore. Sem rede. NÃO é suíte contada: não há entrada em expected_suites.json (padrão check_*).

USO
  python .claude/verify/check_eol_text.py            stage: sonda + árvore do repositório corrente
  python .claude/verify/check_eol_text.py --sonda    só a sonda
  python .claude/verify/check_eol_text.py --repo D   sonda + árvore do repositório em D (controle
                                                     negativo: cópia da árvore com os bytes corrigidos)
  Argumento desconhecido ⇒ exit 2. Exit 1 sse há problema; 0 só com sonda íntegra E árvore limpa.
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

GATE = "eol-text"
ESTE_GATE = ".claude/verify/check_eol_text.py"
DECLARACAO = ".gitattributes"

# Vocabulários fechados (o que o git emite; qualquer outro valor é FAIL nomeado, nunca "ignorado").
ATTR_TEXTO = ("text", "text=auto", "text eol=lf", "text=auto eol=lf", "text eol=crlf", "text=auto eol=crlf")
ATTR_EXCLUIDO = "-text"
EOLINFO = {"", "none", "lf", "crlf", "mixed", "-text"}
CLASSES = ("normalizacao-declarada", "excluido-por-declaracao", "sem-declaracao")
CODIGOS = ("nul", "cr-solitario", "nao-imprimiveis", "cr-no-indice", "causa-nao-reproduzida")

_RE_CABECALHO = re.compile(rb"^i/(\S*)\s+w/(\S*)\s+attr/(.*?)\s*$")


# ------------------------------------------------------------------ leitura
def git(args, cwd, env=None, entrada=None):
    return subprocess.run(["git", *args], cwd=cwd, env=env, input=entrada, capture_output=True)


def classe_do_attr(attr):
    if attr == ATTR_EXCLUIDO:
        return "excluido-por-declaracao"
    if attr in ATTR_TEXTO:
        return "normalizacao-declarada"
    if attr == "":
        return "sem-declaracao"
    return None


def ler_censo(cwd, env=None):
    """`git ls-files --eol -z` → (registros, erros). Registro: path · i · w · attr · classe.
    Todo desvio de formato ou de vocabulário vira erro NOMEADO; nada é descartado em silêncio."""
    r = git(["ls-files", "--eol", "-z"], cwd, env)
    if r.returncode != 0:
        err = r.stderr.decode("utf-8", "replace").strip().splitlines()
        return [], [f"instrumento: `git ls-files --eol -z` falhou (rc={r.returncode}): "
                    f"{err[-1] if err else 'sem stderr'}"]
    regs, erros = [], []
    for rec in r.stdout.split(b"\0"):
        if not rec:
            continue
        if b"\t" not in rec:
            erros.append(f"registro sem TAB (formato inesperado do ls-files --eol): {rec[:60]!r}")
            continue
        cab, path = rec.split(b"\t", 1)
        m = _RE_CABECALHO.match(cab)
        if not m:
            erros.append(f"cabeçalho fora do formato i/ w/ attr/: {cab[:60]!r}")
            continue
        i, w, attr = (x.decode("ascii", "replace") for x in m.groups())
        p = path.decode("utf-8", "surrogateescape")
        if i not in EOLINFO or w not in EOLINFO:
            erros.append(f"{p}: eolinfo fora do vocabulário do git (i/{i!r} w/{w!r})")
            continue
        classe = classe_do_attr(attr)
        if classe is None:
            erros.append(f"{p}: atributo fora do vocabulário do git: attr/{attr!r}")
            continue
        regs.append({"path": p, "i": i, "w": w, "attr": attr, "classe": classe})
    return regs, erros


# ---------------------------------------------------- censo independente
def censo_bytes(b):
    """Reprodução de convert.c:gather_stats/convert_is_binary — só para DIAGNÓSTICO."""
    nul = b.count(b"\x00")
    crlf = b.count(b"\r\n")
    cr_solitario = b.count(b"\r") - crlf
    imprimiveis = nao_imprimiveis = 0
    for c in b:
        if c in (10, 13):
            continue
        if c == 127:
            nao_imprimiveis += 1
        elif c < 32:
            if c in (8, 9, 12, 27):
                imprimiveis += 1
            else:
                nao_imprimiveis += 1
        else:
            imprimiveis += 1
    if b and b[-1] == 0x1A:
        nao_imprimiveis -= 1
    linha_nul = (b[: b.index(b"\x00")].count(b"\n") + 1) if nul else None
    return {"nul": nul, "cr_solitario": cr_solitario, "crlf": crlf,
            "razao_binaria": (imprimiveis >> 7) < nao_imprimiveis, "linha_nul": linha_nul}


def codigo_do_censo(c):
    """Ordem do próprio git (convert_is_binary): CR solitário → NUL → razão de não-imprimíveis."""
    if c is None:
        return "causa-nao-reproduzida"
    if c["cr_solitario"]:
        return "cr-solitario"
    if c["nul"]:
        return "nul"
    if c["razao_binaria"]:
        return "nao-imprimiveis"
    return "causa-nao-reproduzida"


def bytes_do_registro(cwd, env, reg, origem):
    if origem == "índice":
        r = git(["cat-file", "blob", f":{reg['path']}"], cwd, env)
        return r.stdout if r.returncode == 0 else None
    try:
        with open(os.path.join(cwd, reg["path"]), "rb") as fh:
            return fh.read()
    except OSError:
        return None


# ------------------------------------------------------------------ julgar
def julgar(regs, cwd, env=None):
    """Aplica EOL1(a)/(b) aos registros. Devolve (problemas, censo_por_classe, info)."""
    censo = {c: 0 for c in CLASSES}
    info = {"cr_so_no_worktree": []}
    problemas = []
    for reg in regs:
        censo[reg["classe"]] += 1
        if reg["classe"] != "normalizacao-declarada":
            continue
        if reg["i"] == "-text" or reg["w"] == "-text":
            origem = "índice" if reg["i"] == "-text" else "worktree"
            c = censo_bytes(bytes_do_registro(cwd, env, reg, origem) or b"")
            if not (c["nul"] or c["cr_solitario"] or c["razao_binaria"]):
                c = None   # o git achou binário e a reprodução não achou causa: dito, não escondido
            problemas.append({"alinea": "a", "codigo": codigo_do_censo(c), "origem": origem,
                              "censo": c, **reg})
        elif reg["i"] in ("crlf", "mixed"):
            c = censo_bytes(bytes_do_registro(cwd, env, reg, "índice") or b"")
            problemas.append({"alinea": "b", "codigo": "cr-no-indice", "origem": "índice",
                              "censo": c, **reg})
        if reg["w"] in ("crlf", "mixed") and reg["i"] not in ("-text", "crlf", "mixed"):
            info["cr_so_no_worktree"].append(f"{reg['path']} (w/{reg['w']})")
    return problemas, censo, info


def linha_do_problema(p):
    if p["alinea"] == "a":
        texto = (f"[FAIL] EA41-EOL1(a) {p['path']} — attr/{p['attr']} · i/{p['i']} w/{p['w']}: "
                 f"classificado binário; a normalização de fim de linha que o {DECLARACAO} declara "
                 f"está DESLIGADA para este arquivo")
    else:
        texto = (f"[FAIL] EA41-EOL1(b) {p['path']} — attr/{p['attr']} · i/{p['i']} w/{p['w']}: "
                 f"o blob do índice carrega CR sob normalização declarada (E9 consumado)")
    c = p["censo"]
    if c is None:
        return texto + f" · causa ({p['origem']}): {p['codigo']} — o censo em Python não achou NUL, CR solitário nem razão binária; o git achou (versão do git?)"
    primeira = f" (1ª ocorrência: linha {c['linha_nul']})" if c["nul"] else ""
    return (texto + f" · causa ({p['origem']}): {p['codigo']} — NUL={c['nul']}{primeira} · "
            f"CR solitário={c['cr_solitario']} · CRLF={c['crlf']}")


# ------------------------------------------------------------------- sonda
# id · arquivo · bytes · via · attr esperado · i · w · alínea · código
SONDA = [
    ("S0", DECLARACAO, None, "add", "text=auto eol=lf", "lf", "lf", None, None),
    ("S1", "achado.md", b'chave = ctxChave(d) + "\x00" + d.seletor + "\x00" + d.prop\n',
     "add", "text=auto eol=lf", "-text", "-text", "a", "nul"),
    ("S2", "remedio.md", b'chave = ctxChave(d) + "\\x00" + d.seletor + "\\x00" + d.prop\n',
     "add", "text=auto eol=lf", "lf", "lf", None, None),
    ("S3", "icone.svg", b"<svg>\x00</svg>\n", "add", "-text", "-text", "-text", None, None),
    ("S4", "imagem.png", b"\x89PNG\r\n\x1a\n\x00", "add", "-text", "-text", "-text", None, None),
    ("S5", "cr_solitario.md", b"a\rb\n", "add", "text=auto eol=lf", "-text", "-text", "a", "cr-solitario"),
    ("S6", "crlf.md", b"a\r\nb\r\n", "add", "text=auto eol=lf", "lf", "crlf", None, None),
    ("S7", "nul_crlf.md", b"linha1\r\nlinha \x00 nula\r\n", "add", "text=auto eol=lf", "-text", "-text", "a", "nul"),
    ("S8", "texto.txt", b"x\n", "add", "text eol=lf", "lf", "lf", None, None),
    ("S9", "texto_nul.txt", b"x\x00\n", "add", "text eol=lf", "-text", "-text", "a", "nul"),
    ("S10", "cr_no_indice.md", b"q\r\nw\r\n", "cacheinfo", "text=auto eol=lf", "crlf", "crlf", "b", "cr-no-indice"),
    ("S11", "nao_imprimiveis.md", b"\x01" * 200 + b"a\n", "add", "text=auto eol=lf", "-text", "-text", "a", "nao-imprimiveis"),
    ("S12", "sem_declaracao.md", b"x\x00\n", "add", "", "-text", "-text", None, None),
]
GITATTRIBUTES_DA_SONDA = (b"* text=auto eol=lf\n*.svg -text\n*.png binary\n*.txt text\n"
                          b"sem_declaracao.md !text !eol\n")
TOTAL_SONDA = 13       # registros esperados no repositório efêmero (S0..S12)
PROBLEMAS_SONDA = 6    # S1 S5 S7 S9 S10 S11 — o julgador não pode acusar nem mais nem menos


def ambiente_hermetico(tmp):
    env = {k: v for k, v in os.environ.items()
           if k not in ("GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_COMMON_DIR")}
    vazio = os.path.join(tmp, "gitconfig-vazio")
    open(vazio, "wb").close()
    env.update(GIT_CONFIG_NOSYSTEM="1", GIT_ATTR_NOSYSTEM="1", GIT_CONFIG_GLOBAL=vazio,
               HOME=tmp, XDG_CONFIG_HOME=tmp)
    return env


def sonda():
    """Constrói o repositório efêmero, lê e julga com o MESMO código da árvore; compara caso a caso."""
    tmp = tempfile.mkdtemp(prefix="eol-text-sonda-")
    divergencias, guarda = [], []
    try:
        env = ambiente_hermetico(tmp)
        cfg = ["-c", "core.autocrlf=false", "-c", "core.safecrlf=false", "-c", "init.defaultBranch=main"]
        r = git([*cfg, "init", "-q"], tmp, env)
        if r.returncode != 0:
            return {"ok": False, "guarda": [f"git init falhou no efêmero (rc={r.returncode})"],
                    "divergencias": [], "total": 0, "problemas": None}
        with open(os.path.join(tmp, DECLARACAO), "wb") as fh:
            fh.write(GITATTRIBUTES_DA_SONDA)
        por_add = [DECLARACAO]
        for cid, nome, conteudo, via, *_ in SONDA:
            if conteudo is None:
                continue
            with open(os.path.join(tmp, nome), "wb") as fh:
                fh.write(conteudo)
            if via == "add":
                por_add.append(nome)
            else:  # cacheinfo: blob gravado no índice SEM filtro — CR sob normalização declarada
                h = git([*cfg, "hash-object", "-w", "--no-filters", "--stdin"], tmp, env, conteudo)
                sha = h.stdout.decode().strip()
                u = git([*cfg, "update-index", "--add", "--cacheinfo", f"100644,{sha},{nome}"], tmp, env)
                if h.returncode or u.returncode or not sha:
                    guarda.append(f"{cid}: update-index --cacheinfo falhou (rc {h.returncode}/{u.returncode})")
        r = git([*cfg, "add", "--", *por_add], tmp, env)   # caminhos nominais, nunca -A/./--all
        if r.returncode != 0:
            guarda.append(f"git add falhou no efêmero (rc={r.returncode}): "
                          f"{r.stderr.decode('utf-8', 'replace').strip()[:160]}")
        regs, erros = ler_censo(tmp, env)
        guarda += [f"leitura do efêmero: {e}" for e in erros]
        problemas, _, _ = julgar(regs, tmp, env)
        por_path = {x["path"]: x for x in regs}
        prob_por_path = {p["path"]: p for p in problemas}
        for cid, nome, _c, _v, attr, i, w, alinea, codigo in SONDA:
            reg = por_path.get(nome)
            if reg is None:
                divergencias.append(f"{cid} ({nome}): ausente do censo do efêmero")
                continue
            prob = prob_por_path.get(nome)
            obtido = {"attr": reg["attr"], "i": reg["i"], "w": reg["w"],
                      "alinea": prob["alinea"] if prob else None,
                      "codigo": prob["codigo"] if prob else None}
            esperado = {"attr": attr, "i": i, "w": w, "alinea": alinea, "codigo": codigo}
            dif = [f"{k}: esperado {esperado[k]!r}, obtido {obtido[k]!r}" for k in esperado if esperado[k] != obtido[k]]
            if dif:
                divergencias.append(f"{cid} ({nome}): " + " · ".join(dif))
        if len(regs) != TOTAL_SONDA:
            guarda.append(f"executados {len(regs)} registro(s) ≠ total pinado {TOTAL_SONDA} — a sonda não rodou inteira")
        if len(problemas) != PROBLEMAS_SONDA:
            guarda.append(f"julgador acusou {len(problemas)} problema(s) ≠ {PROBLEMAS_SONDA} pinado(s) — sujeito a mais ou a menos")
        return {"ok": not divergencias and not guarda, "guarda": guarda, "divergencias": divergencias,
                "total": len(regs), "problemas": len(problemas)}
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def relata_sonda(s):
    print(f"[SONDA] {GATE}: {s['total']} registro(s) · {len(s['divergencias'])} divergência(s) "
          f"(total pinado: {TOTAL_SONDA}) · problemas esperados {PROBLEMAS_SONDA} · obtidos {s['problemas']}")
    for g in s["guarda"]:
        print(f"[FAIL] EA41-EOL0 sonda/guarda: {g}")
    for d in s["divergencias"]:
        print(f"[FAIL] EA41-EOL0 sonda: {d}")


# -------------------------------------------------------------------- main
def main(argv):
    args = list(argv[1:])
    so_sonda, repo = False, None
    while args:
        a = args.pop(0)
        if a == "--sonda":
            so_sonda = True
        elif a == "--repo" and args:
            repo = args.pop(0)
        else:
            print(f"argumento desconhecido: {a!r} · uso: [--sonda] [--repo DIR]", file=sys.stderr)
            return 2

    s = sonda()
    relata_sonda(s)
    if so_sonda:
        return 0 if s["ok"] else 1
    if not s["ok"]:
        print(f"[FAIL] árvore NÃO JULGADA: o instrumento reprovou na própria sonda (EA41-EOL0)")
        print("----")
        print(f"{GATE}: árvore não julgada · sonda {s['total'] - len(s['divergencias'])}/{TOTAL_SONDA}")
        return 1

    raiz = git(["rev-parse", "--show-toplevel"], repo or os.getcwd())
    if raiz.returncode != 0:
        print(f"[FAIL] instrumento: {repo or os.getcwd()} não é um repositório git (rev-parse rc={raiz.returncode})")
        return 1
    cwd = raiz.stdout.decode("utf-8", "replace").strip()
    regs, erros = ler_censo(cwd)
    fails = list(erros)
    for e in erros:
        print(f"[FAIL] instrumento: {e}")
    if not regs:
        print("[FAIL] instrumento: censo vazio — `git ls-files --eol` não devolveu nenhum arquivo rastreado")
        fails.append("censo vazio")

    problemas, censo, info = julgar(regs, cwd)
    for p in problemas:
        print(linha_do_problema(p))

    decl = next((x for x in regs if x["path"] == DECLARACAO), None)
    if decl is None:
        print(f"[FAIL] EA41-EOL2 {DECLARACAO} não está rastreado — não há declaração de normalização a fazer valer")
        fails.append("sem .gitattributes")
    elif decl["classe"] != "normalizacao-declarada" or decl["i"] != "lf" or decl["w"] != "lf":
        print(f"[FAIL] EA41-EOL2 {DECLARACAO} — attr/{decl['attr']} · i/{decl['i']} w/{decl['w']}: a própria declaração tem de ser texto LF em escopo")
        fails.append(".gitattributes fora do escopo")
    else:
        print(f"[OK]   EA41-EOL2 {DECLARACAO} rastreado, em escopo, i/lf w/lf — a declaração que o gate faz valer existe")

    eu = next((x for x in regs if x["path"] == ESTE_GATE), None)
    if eu:
        print(f"[INFO] este gate ({ESTE_GATE}): attr/{eu['attr']} · i/{eu['i']} w/{eu['w']} — varrido como qualquer arquivo, sem auto-exclusão")
    else:
        print(f"[INFO] este gate ({ESTE_GATE}): não rastreado neste repositório (estado pré-commit ou --repo)")
    if info["cr_so_no_worktree"]:
        print("[INFO] CR só no worktree (o índice está LF; o próximo add normaliza): " + ", ".join(info["cr_so_no_worktree"]))

    na = sum(1 for p in problemas if p["alinea"] == "a")
    nb = len(problemas) - na
    print("----")
    print(f"{GATE}: {len(regs)} rastreado(s) · {censo['normalizacao-declarada']} com normalização declarada · "
          f"{censo['excluido-por-declaracao']} excluído(s) por declaração (-text) · {censo['sem-declaracao']} sem declaração · "
          f"{len(info['cr_so_no_worktree'])} com CR só no worktree · {len(problemas)} problema(s) "
          f"[EOL1(a)={na} · EOL1(b)={nb}] · {len(fails)} falha(s) de instrumento · sonda {TOTAL_SONDA}/{TOTAL_SONDA}")
    return 1 if (problemas or fails) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
