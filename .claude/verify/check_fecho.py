#!/usr/bin/env python3
"""Stage `fecho` (pós-merge) e check `fecho` (pré-merge, `--pr`) — o GATE.

Demanda 016-registro-contra-execucao · P16.a · gates D016-FEC1, D016-FEC2,
D016-FEC3, D016-FEC4 (stage `fecho` do pipeline.yaml) e D016-PR1 (job `fecho`
do CI), mais a alínea comum C7 (o julgador não pode ficar mudo). Spec:
specs/016-registro-contra-execucao/spec.md §Critérios; desenho gate ×
instrumento: plan.md §Módulos. Dono: qa-engineer. R3 §2: quem implementa o
instrumento NÃO edita este arquivo — mudança necessária volta por DEPENDÊNCIAS.

ESTE ARQUIVO NÃO DECIDE. Todo veredito nasce em `fecho.py` (o INSTRUMENTO, do
core-engineer): julgadores PUROS + leitores. Aqui vivem só a CLI, a sonda pinada
(C7), a ordem fixa sonda → leitura → julgamento → relato, o relato no
vocabulário T10, a GUARDA DE CENSO da leitura (§abaixo) e o exit. Um `if` que produza
veredito aqui é FAIL de revisão — a guarda de censo não produz veredito: compara
uma contagem lida a uma pinada, exatamente como a sonda faz com `total`.

USO
  python .claude/verify/check_fecho.py           # stage: sonda + árvore real (pós-merge)
  python .claude/verify/check_fecho.py --pr      # job: sonda + PR (GITHUB_HEAD_REF/GITHUB_BASE_REF)
  python .claude/verify/check_fecho.py --sonda   # só a sonda; JSON em stdout, prosa em stderr
  python .claude/verify/check_fecho.py [--pr] --json   # objeto completo em stdout, prosa em stderr
  Ao vivo NÃO existem --head/--base (T5, spec §CLI): argumento desconhecido ⇒ exit 2.

SEM REDE, por construção: nenhum import de biblioteca de rede aqui nem no
instrumento (plan §Camada). A lista nominal das bibliotecas vive SÓ na varredura
que a cobra — tasks.md T032(v), errata ET4 —, fora dos dois arquivos varridos:
nomeá-la aqui fazia a varredura acusar o próprio gate (R10 §10). A auto-exclusão
é NÃO NOMEAR, e o scanner segue de arquivo inteiro — restringi-lo a linhas de
import deixaria vivos import no meio da linha, `__import__`, `importlib` e `exec`
(medido, ET4). Nada escreve (R7 §3). git só no instrumento, por
lista de argumentos (R10 §7). Exit 1 sse há problema; SKIP silencioso não existe:
instrumento ausente, fixture ausente, leitura que estoura — tudo sai nomeado.

RED (Fase 4): o instrumento não existe ⇒ cada caso da sonda sai
`obtido: INSTRUMENTO AUSENTE` ≠ esperado ⇒ divergências nomeadas, exit 1, em
todo modo — e a árvore não é julgada por julgador que reprovou na sonda.

GUARDA DE CENSO DA LEITURA (Fase 6 · iteração de correção do spec-validate, J1,
2026-09-04): a sonda prova o JULGADOR puro; o LEITOR de histórico não tem sonda.
Medido em clone efêmero de HEAD 76fd9dc: um `ler_merges` que devolva lista vazia
com metadados sãos (origin/develop presente, piso na cadeia) deixava a árvore
VERDE — exit 0, 0 problema(s), as `done` CONFORME por ancestralidade, "até o
piso, inclusive: 0" impresso e não comparado — e D016-M19 sobrevivia sob esse
leitor. Por isso `fecho.json → piso.merges_ate_piso` pina o censo IMUTÁVEL de
merges first-parent até o piso, inclusive (39 para 921977c — a história até o
piso não muda; medido por `git rev-list --count --merges --first-parent <piso>` e
pelo instrumento, iguais), e este gate o compara a `contagens.merges_ate_piso` da
árvore real: divergência ⇒ FAIL nomeado, exit 1, mesmo com 0 problema(s) de
julgamento. Não é veredito (nenhuma demanda é julgada por ele): é `total_pinado`
aplicado à leitura. Aplica-se só quando o leitor reporta origin/develop presente
E piso na cadeia — fora disso o global do julgador já nomeia a causa; pin ausente
ou inválido é FAIL, nunca guarda que some em silêncio. Os registros das fixtures
não trazem a chave: a guarda vive só em `vivo_pos`. Carrasco: D016-M33. O que
ela NÃO cobre, declarado: leitor que perde merges POSTERIORES ao piso (censo
variável por natureza) — carrasco só na campanha (D016-M18/M19).

============================ CONTRATO DO INSTRUMENTO (fecho.py) ==============
Importado por caminho (.claude/verify/fecho.py, ao lado deste arquivo). Símbolos
exigidos — a falta de qualquer um é INSTRUMENTO INCOMPLETO e a sonda reprova:

  VEREDITOS   conjunto FECHADO (set/frozenset/tuple, ou dict cujos VALORES são os
              textos) com EXATAMENTE os 10 textos de T10:
              "CONFORME" · "MESCLADA SEM FECHO" · "FECHO PENDENTE DECLARADO" ·
              "EM VOO" · "ANTERIOR AO PISO" · "FORA DA POPULAÇÃO" ·
              "NÃO DETERMINÁVEL" · "LIBERADO" · "FECHO PENDENTE" · "NÃO JULGADO"
  CODIGOS     conjunto FECHADO com EXATAMENTE os códigos de
              fecho.json → _meta.contrato_da_sonda.codigos (16).

  julgar_pos_merge(estados, merges, ancestralidade, artefatos, data_do_commit,
                   registro, origin_develop) -> dict     PURO: sem git, disco, rede, relógio
    estados        {slug: planning-state}
    merges         [{sha, data, msg, posicao_relativa_ao_piso: "anterior"|"piso"|"posterior"}],
                   first-parent de origin/develop, mais recente primeiro; SÓ os merges
                   (≥ 2 pais), já anotados pelo leitor
    ancestralidade {slug: {resposta: true|false|null, causa, anterior_ao_piso: bool}}
                   (T1 secundário, pré-resolvido; null = "oráculo não responde" — borda 8;
                   anterior_ao_piso = red.commit é ancestral do piso)
    artefatos      set de paths relativos EXISTENTES (specs/<slug>/relatorio-final.md,
                   specs/<slug>/spec-validate.md)
    data_do_commit "AAAA-MM-DD" (T4 — %cI de HEAD, o dia)
    registro       fecho.json (piso {sha, merges_ate_piso, descricao}, excluidas_por_r13, populacao)
                   — `merges_ate_piso` é lido SÓ pela guarda de censo do gate, nunca pelo julgador
    origin_develop {presente: bool, sha: str|null, causa: str|null, piso_na_cadeia: bool}
    devolve {
      "sujeitos": [{"id": slug | sha do merge, "tipo": "demanda"|"merge",
                    "veredito": <VEREDITOS>, "oraculo": "mensagem"|"ancestralidade"|null,
                    "oraculo_detalhe": "#34" | "<sha12>" | null, "fase": str|null,
                    "codigo": <CODIGOS>|null, "detalhe": str, "falha": bool}],
      "globais":  [{"codigo": <CODIGOS>, "detalhe": str}],
                  # duas classes (ET3): IMPEDITIVOS piso-invalido | origin-develop-ausente
                  # (no máximo UM por execução, por precedência — sob ele todo sujeito-
                  # demanda sai NÃO DETERMINÁVEL); NÃO IMPEDITIVO exclusao-malformada (uma
                  # entrada por exclusão inválida; os sujeitos seguem julgados). Fica em
                  # globais porque o relato só imprime globais e sujeitos: problema fora
                  # dos dois seria contado e não dito — julgador mudo (C7; carrasco D016-M27)
      "problemas": [str],   # UMA linha por sujeito com falha + UMA por global; sujeito
                            # abortado por um global NÃO acrescenta linha
      "contagens": {"demandas", "valvulas", "problemas", "merges_apos_piso",
                    "merges_ate_piso", "em_voo", "anteriores_ao_piso", "fora_da_populacao"}
    }
    O que a sonda pina (a letra completa está na spec §Critérios C1–C4):
      · um sujeito "demanda" por estado; sujeito "merge" só para merge POSTERIOR ao piso
        que não casa estado algum pela chave `branch` EXATA (fora da população, fora da
        máquina, fora de PR) — o merge de uma demanda com estado cai no sujeito dela (C2 b);
      · MESCLADA SEM FECHO e NÃO DETERMINÁVEL são falha por si; nos outros vereditos a
        falha vem do `codigo` (F9 CONFORME + fecho_pendente-obsoleta; F10 EM VOO +
        fecho_pendente-prematura; F13 FORA DA POPULAÇÃO + merge-fora-de-pr; F17 CONFORME +
        exclusao-obsoleta). Válvula inválida (campo ausente/vazio, prazo fora de
        AAAA-MM-DD) ou vencida (prazo < data_do_commit) deixa a demanda MESCLADA SEM FECHO
        com o código que diz por quê. Done sem artefato e sem exclusão válida:
        MESCLADA SEM FECHO + artefato-ausente se mesclada, EM VOO + artefato-ausente se
        não. Exclusão sem `fonte` ou com artefatos_ausentes vazio/curinga NÃO exclui e
        acrescenta problema próprio (exclusao-malformada — global NÃO impeditivo: a demanda
        segue julgada; F23 pina artefato-ausente no sujeito e 2 problemas). Merge de
        feature/NNN posterior ao piso sem estado: MESCLADA SEM FECHO + demanda-fora-da-maquina;
      · o piso NÃO é julgado (posição "piso" conta como anterior); posição "anterior" ⇒
        ANTERIOR AO PISO; ancestralidade com anterior_ao_piso ⇒ ANTERIOR AO PISO; a
        ancestralidade só é consultada quando a mensagem cala (T1);
      · estado sem `branch` ⇒ NÃO DETERMINÁVEL + registro-sem-branch (só esse sujeito);
        piso fora de ^[0-9a-f]{40}$ ou origin_develop.piso_na_cadeia false ⇒ global
        piso-invalido; origin_develop.presente false ⇒ global origin-develop-ausente; sob
        um global IMPEDITIVO (esses dois), TODO sujeito-demanda sai NÃO DETERMINÁVEL com o
        código do global — exclusao-malformada é global e NÃO impede (F23);
      · NÃO DETERMINÁVEL sempre com `detalhe` não vazio (T10).

  julgar_pre_merge(head_ref, base_ref, estados, artefatos, registro) -> dict    PURO
    devolve {"veredito": "LIBERADO"|"FECHO PENDENTE"|"NÃO JULGADO", "codigo": <CODIGOS>|null,
             "motivo": str (não vazio em NÃO JULGADO), "demanda": slug|null,
             "fase": str|null, "falha": bool}
    Ordem: sem head ou sem base ⇒ NÃO JULGADO evento-sem-base · base ≠ "develop" ⇒
    NÃO JULGADO base-nao-develop · head fora de populacao.padrao_branch ⇒ NÃO JULGADO
    fora-da-populacao · nenhum estado com `branch` == head ⇒ FECHO PENDENTE
    demanda-fora-da-maquina · fecho_pendente presente ⇒ FECHO PENDENTE
    (fecho_pendente-obsoleta se done, senão fecho_pendente-prematura — T5: pré-merge não
    honra válvula) · phase ≠ done ⇒ FECHO PENDENTE fase-nao-done · done sem artefato e
    sem exclusão válida ⇒ FECHO PENDENTE artefato-ausente · senão LIBERADO.

  Leitores (I/O; git por lista de argumentos; nada escreve; nunca rede):
    ler_estados() -> {slug: dict}        .claude/project-memory/planning-state/*.json
    ler_merges(piso) -> {"merges": [...], "origin_develop": {...}}
        percorre `git log --first-parent --format=%H%x00%P%x00%cI%x00%s
        refs/remotes/origin/develop` — a cadeia INTEIRA, não --merges: o piso pode ser
        commit não-merge (o piso zero da prova de carga é a raiz e5ccd429) —, localiza o
        piso e anota cada merge; piso ausente da cadeia ⇒ piso_na_cadeia false; ref
        ausente ou git ausente ⇒ presente false + causa (nunca exceção silenciosa)
    ler_ancestralidade(estados, piso) -> {slug: {...}}
        só para estados com red.commit: `git rev-parse --verify --quiet <sha>^{commit}`
        (ambíguo/inexistente ⇒ resposta null + causa) → `git merge-base --is-ancestor`
        contra refs/remotes/origin/develop e contra o piso
    ler_artefatos(estados) -> iterável de paths existentes (os dois arquivos por spec_dir)
    ler_data_commit() -> "AAAA-MM-DD"    `git log -1 --format=%cI HEAD`[:10]

  Onde plan.md/tasks.md divergirem deste contrato, vale ESTE texto: as erratas
  ET1–ET4 de tasks.md §Errata (2026-09-04) registram cada divergência com a razão
  medida (assinatura de ler_ancestralidade, cadeia inteira em ler_merges, classes
  de globais, varredura sem-rede).
==============================================================================
"""
import importlib.util
import json
import os
import sys
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

AQUI = Path(__file__).resolve().parent
INSTRUMENTO = AQUI / "fecho.py"
REGISTRO = Path(".claude/verify/fecho.json")
GATES = "D016-FEC1 D016-FEC2 D016-FEC3 D016-FEC4 D016-PR1"

# T10 — vocabulário fechado. Vive aqui SÓ para exigir que o enum do instrumento seja
# exatamente ele (C7); nenhum veredito é produzido a partir destas strings.
VOCABULARIO_T10 = frozenset({
    "CONFORME", "MESCLADA SEM FECHO", "FECHO PENDENTE DECLARADO", "EM VOO",
    "ANTERIOR AO PISO", "FORA DA POPULAÇÃO", "NÃO DETERMINÁVEL",
    "LIBERADO", "FECHO PENDENTE", "NÃO JULGADO",
})
API_EXIGIDA = ("VEREDITOS", "CODIGOS", "julgar_pos_merge", "julgar_pre_merge",
               "ler_estados", "ler_merges", "ler_ancestralidade", "ler_artefatos",
               "ler_data_commit")
INSTRUMENTO_AUSENTE = "INSTRUMENTO AUSENTE"
CAMPOS = {"pos": ("veredito", "oraculo", "codigo", "problemas"), "pre": ("veredito", "codigo")}
ARGS_ACEITOS = {"--pr", "--sonda", "--json"}
TAG = {"FAIL": "[FAIL] ", "VALV": "[VÁLV] ", "OK": "[OK]   "}


# ---------------------------------------------------------------- instrumento
def carrega_instrumento():
    """Importa fecho.py por caminho. Ausente, quebrado ou incompleto ⇒ (None, causa)."""
    if not INSTRUMENTO.is_file():
        return None, f"{INSTRUMENTO_AUSENTE}: {INSTRUMENTO.name} não existe em .claude/verify/"
    try:
        spec = importlib.util.spec_from_file_location("fecho", INSTRUMENTO)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
    except Exception as e:  # instrumento que não importa é instrumento ausente, com causa
        return None, f"{INSTRUMENTO_AUSENTE}: import falhou ({type(e).__name__}: {e})"
    faltam = [n for n in API_EXIGIDA if not hasattr(mod, n)]
    if faltam:
        return None, f"INSTRUMENTO INCOMPLETO: sem {', '.join(faltam)}"
    return mod, None


def _conjunto(enum):
    return set(enum.values()) if isinstance(enum, dict) else set(enum)


def carrega_registro():
    with open(REGISTRO, encoding="utf-8") as fh:
        return json.load(fh)


# ---------------------------------------------------------------------- sonda
def pinado(caso):
    d = {"veredito": caso.get("esperado")}
    for k in CAMPOS.get(caso.get("modo"), ())[1:]:
        d[k] = caso.get(k)
    return d


def coerencia_pos(res, suj, instr):
    """Contrato de saída (não veredito): enum fechado, T10 exige detalhe, contagens batem."""
    extras = []
    voc, cods = _conjunto(instr.VEREDITOS), _conjunto(instr.CODIGOS)
    if suj is not None:
        if suj.get("veredito") not in voc:
            extras.append(f"veredito fora de VEREDITOS: {suj.get('veredito')!r}")
        if suj.get("codigo") is not None and suj.get("codigo") not in cods:
            extras.append(f"codigo fora de CODIGOS: {suj.get('codigo')!r}")
        if suj.get("veredito") == "NÃO DETERMINÁVEL" and not (suj.get("detalhe") or "").strip():
            extras.append("NÃO DETERMINÁVEL sem detalhe (T10)")
    problemas = res.get("problemas") or []
    cont = (res.get("contagens") or {}).get("problemas")
    if cont != len(problemas):
        extras.append(f"contagens.problemas={cont!r} ≠ len(problemas)={len(problemas)}")
    for g in res.get("globais") or []:
        if not (g.get("detalhe") or "").strip():
            extras.append(f"global {g.get('codigo')!r} sem detalhe")
    return extras


def coerencia_pre(res, instr):
    extras = []
    voc, cods = _conjunto(instr.VEREDITOS), _conjunto(instr.CODIGOS)
    if res.get("veredito") not in voc:
        extras.append(f"veredito fora de VEREDITOS: {res.get('veredito')!r}")
    if res.get("codigo") is not None and res.get("codigo") not in cods:
        extras.append(f"codigo fora de CODIGOS: {res.get('codigo')!r}")
    if res.get("veredito") == "NÃO JULGADO" and not (res.get("motivo") or "").strip():
        extras.append("NÃO JULGADO sem motivo (T10)")
    return extras


def executa_caso(instr, causa_instr, caso, pasta):
    cid, modo = caso.get("id"), caso.get("modo")
    r = {"id": cid, "modo": modo, "esperado": pinado(caso), "obtido": None, "ok": False,
         "divergencias": []}
    try:
        with open(pasta / f"{cid}.json", encoding="utf-8") as fh:
            fx = json.load(fh)
    except FileNotFoundError:
        r["obtido"], r["divergencias"] = "FIXTURE AUSENTE", [f"fixture {cid}.json ausente"]
        return r
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        r["obtido"], r["divergencias"] = "FIXTURE ILEGÍVEL", [f"{type(e).__name__}: {e}"]
        return r
    if fx.get("id") != cid or fx.get("modo") != modo:
        r["obtido"] = "FIXTURE INCOERENTE"
        r["divergencias"] = [f"fixture declara id={fx.get('id')!r} modo={fx.get('modo')!r}"]
        return r
    if instr is None:
        r["obtido"], r["divergencias"] = INSTRUMENTO_AUSENTE, [causa_instr]
        return r
    try:
        if modo == "pos":
            res = instr.julgar_pos_merge(fx["estados"], fx["merges"], fx["ancestralidade"],
                                         set(fx["artefatos"]), fx["data_do_commit"],
                                         fx["registro"], fx["origin_develop"])
            suj = next((s for s in (res.get("sujeitos") or []) if s.get("id") == fx["sujeito"]), None)
            obtido = {"veredito": suj.get("veredito") if suj else "SUJEITO AUSENTE",
                      "oraculo": suj.get("oraculo") if suj else None,
                      "codigo": suj.get("codigo") if suj else None,
                      "problemas": len(res.get("problemas") or [])}
            extras = coerencia_pos(res, suj, instr)
        else:
            res = instr.julgar_pre_merge(fx.get("head_ref"), fx.get("base_ref"), fx["estados"],
                                         set(fx["artefatos"]), fx["registro"])
            obtido = {"veredito": res.get("veredito"), "codigo": res.get("codigo")}
            extras = coerencia_pre(res, instr)
    except Exception as e:  # julgador que estoura não é "sem veredito": é divergência nomeada
        r["obtido"] = f"EXCEÇÃO {type(e).__name__}: {e}"
        r["divergencias"] = [r["obtido"]]
        return r
    r["obtido"] = obtido
    difs = [f"{k}: esperado {r['esperado'][k]!r} · obtido {obtido.get(k)!r}"
            for k in r["esperado"] if r["esperado"][k] != obtido.get(k)]
    r["divergencias"] = difs + extras
    r["ok"] = not r["divergencias"]
    return r


def sonda(instr, causa_instr, registro):
    cfg = registro["sonda"]
    pasta, casos, pin = Path(cfg["fixtures"]), cfg["casos"], cfg["total"]
    guarda = []
    # Guarda 2 (plan §Sonda): arquivos na pasta == len(casos) == total, e arquivo ↔ caso.
    arquivos = sorted(p.name for p in pasta.glob("*.json")) if pasta.is_dir() else []
    ids = [c.get("id") for c in casos]
    dup = sorted({i for i in ids if ids.count(i) > 1})
    if dup:
        guarda.append(f"id duplicado na sonda: {', '.join(map(str, dup))}")
    for c in casos:
        if c.get("modo") not in CAMPOS:
            guarda.append(f"caso {c.get('id')}: modo inválido {c.get('modo')!r}")
    esperados = {f"{i}.json" for i in ids}
    guarda += [f"fixture sem caso no registro: {a}" for a in arquivos if a not in esperados]
    guarda += [f"caso sem fixture: {i}" for i in ids if f"{i}.json" not in arquivos]
    if not (len(arquivos) == len(casos) == pin):
        guarda.append(f"contagem: {len(arquivos)} fixture(s) · {len(casos)} caso(s) · total pinado {pin}")
    # Vocabulários fechados: o registro só cita o que T10 e o contrato declaram, e o
    # instrumento exporta exatamente isso (conjunto fechado + escape nomeado).
    declarados = set((registro.get("_meta") or {}).get("contrato_da_sonda", {}).get("codigos") or [])
    fora_v = sorted({str(c.get("esperado")) for c in casos} - VOCABULARIO_T10)
    if fora_v:
        guarda.append(f"registro cita veredito fora de T10: {fora_v}")
    fora_c = sorted({str(c.get("codigo")) for c in casos if c.get("codigo")} - declarados)
    if fora_c:
        guarda.append(f"registro cita código fora de _meta.contrato_da_sonda.codigos: {fora_c}")
    if instr is not None:
        voc = _conjunto(instr.VEREDITOS)
        if voc != VOCABULARIO_T10:
            guarda.append("VEREDITOS do instrumento ≠ T10 — a mais: %s · a menos: %s"
                          % (sorted(voc - VOCABULARIO_T10), sorted(VOCABULARIO_T10 - voc)))
        cods = _conjunto(instr.CODIGOS)
        if cods != declarados:
            guarda.append("CODIGOS do instrumento ≠ fecho.json → _meta.contrato_da_sonda.codigos — "
                          "a mais: %s · a menos: %s" % (sorted(cods - declarados), sorted(declarados - cods)))
    resultados = [executa_caso(instr, causa_instr, c, pasta) for c in casos]
    if len(resultados) != pin:   # sonda muda (D016-M16): o censo executado é que se compara ao pin
        guarda.append(f"executados {len(resultados)} ≠ total pinado {pin} — a sonda não rodou inteira (C7)")
    falhas = [r["id"] for r in resultados if not r["ok"]]
    return {"gate": GATES, "casos": resultados, "total": len(resultados), "total_pinado": pin,
            "falhas": len(falhas), "divergentes": falhas, "guarda": guarda,
            "ok": not falhas and not guarda and len(resultados) == pin,
            "instrumento": {"presente": instr is not None, "causa": causa_instr}}


def relata_sonda(s, out):
    p = lambda t: print(t, file=out)
    p(f"[SONDA] fecho: {s['total']} caso(s) · {s['falhas']} divergência(s) (total pinado: {s['total_pinado']})")
    if s["instrumento"]["causa"]:
        p(f"[FAIL]  {s['instrumento']['causa']}")
    for g in s["guarda"]:
        p(f"[FAIL]  sonda/guarda: {g}")
    for r in s["casos"]:
        if not r["ok"]:
            p(f"        ✗ {r['id']} ({r['modo']}): " + " · ".join(r["divergencias"]))


# ---------------------------------------------------------------- pós-merge
def protegido(fn):
    """Leitura que estoura vira FAIL nomeado, nunca traceback mudo nem SKIP."""
    try:
        return fn()
    except Exception as e:
        return {"erro_de_leitura": f"{type(e).__name__}: {e}"}


def censo_da_leitura(res, registro, origin_develop):
    """Guarda de censo (docstring §GUARDA DE CENSO): compara a leitura ao pin. NÃO decide veredito."""
    pin = ((registro or {}).get("piso") or {}).get("merges_ate_piso")
    od = origin_develop or {}
    lido = (res.get("contagens") or {}).get("merges_ate_piso")
    c = {"pinado": pin, "lido": lido, "estado": None, "detalhe": ""}
    if isinstance(pin, bool) or not isinstance(pin, int) or pin < 0:
        c["estado"] = "nao_pinado"
        c["detalhe"] = (f"fecho.json → piso.merges_ate_piso ausente ou inválido ({pin!r}) — o censo da leitura "
                        "não está pinado; sem ele um leitor mudo deixa a árvore verde por vácuo")
    elif od.get("presente") is not True or od.get("piso_na_cadeia") is not True:
        c["estado"] = "nao_aplicado"
        c["detalhe"] = "não aplicado — origin/develop ausente ou piso fora da cadeia: o global do julgador nomeia a causa"
    elif lido == pin:
        c["estado"] = "ok"
        c["detalhe"] = f"merges first-parent até o piso, inclusive: lidos {lido} = censo pinado {pin}"
    else:
        c["estado"] = "divergente"
        c["detalhe"] = (f"merges first-parent até o piso, inclusive: lidos {lido!r} ≠ censo pinado {pin} "
                        "(fecho.json → piso.merges_ate_piso) — leitor mudo ou histórico incompleto; "
                        "a árvore não pode ser declarada conforme por vácuo")
    c["falha"] = c["estado"] in ("divergente", "nao_pinado")
    return c


def vivo_pos(instr, registro):
    piso = registro["piso"]["sha"]
    estados = instr.ler_estados()
    lidos = instr.ler_merges(piso)
    anc = instr.ler_ancestralidade(estados, piso)
    arte = set(instr.ler_artefatos(estados))
    data = instr.ler_data_commit()
    res = instr.julgar_pos_merge(estados, lidos["merges"], anc, arte, data, registro,
                                 lidos["origin_develop"])
    res["_leitura"] = {"origin_develop": lidos["origin_develop"], "data_do_commit": data, "piso": piso,
                       "censo": censo_da_leitura(res, registro, lidos["origin_develop"])}
    return res


def relata_pos(res, registro, out):
    p = lambda t: print(t, file=out)
    if "erro_de_leitura" in res:
        p(f"[FAIL]  NÃO DETERMINÁVEL (leitura do mundo falhou: {res['erro_de_leitura']})")
        p("----")
        p("fecho: leitura falhou · 1 problema(s)")
        return 1
    lt, piso = res["_leitura"], registro["piso"]
    od = lt["origin_develop"] or {}
    p(f"[INFO]  população: {registro['populacao']['padrao_branch']} ∩ planning-state (junção por `branch`)"
      f" · piso {piso['sha'][:8]} ({piso['descricao'].split(' — ')[0]})"
      f" · origin/develop julgado: {(od.get('sha') or 'ausente')[:12]}"
      f" · data do commit julgado: {lt['data_do_commit']}")
    c = res.get("contagens") or {}
    censo = lt.get("censo") or {}
    p(f"[INFO]  merges first-parent após o piso: {c.get('merges_apos_piso', '?')}"
      f" · até o piso, inclusive: {c.get('merges_ate_piso', '?')} (não julgados)"
      f" · censo pinado: {censo.get('pinado')!r} ({censo.get('estado')})")
    if censo.get("falha"):
        p(f"{TAG['FAIL']} guarda de censo da leitura: {censo.get('detalhe')}")
    for g in res.get("globais") or []:
        p(f"{TAG['FAIL']} {g.get('detalhe')}")
    sujeitos = sorted(res.get("sujeitos") or [], key=lambda s: (s.get("tipo") != "demanda", str(s.get("id"))))
    for s in sujeitos:
        tag = TAG["FAIL"] if s.get("falha") else (TAG["VALV"] if s.get("veredito") == "FECHO PENDENTE DECLARADO" else TAG["OK"])
        partes = [f"{s.get('id')}: {s.get('veredito')}" + (f" (fase {s['fase']})" if s.get("fase") else "")]
        if s.get("oraculo"):
            partes.append(f"oráculo: {s['oraculo']}" + (f" {s['oraculo_detalhe']}" if s.get("oraculo_detalhe") else ""))
        if s.get("detalhe"):
            partes.append(str(s["detalhe"]))
        p(f"{tag} {' · '.join(partes)}")
    problemas = res.get("problemas") or []
    incoerente = c.get("problemas") != len(problemas)
    if incoerente:
        p(f"{TAG['FAIL']} contagens incoerentes: contagens.problemas={c.get('problemas')!r} · len(problemas)={len(problemas)}")
    p("----")
    p(f"fecho: {c.get('demandas', '?')} demanda(s) · {c.get('valvulas', '?')} válvula(s) · {len(problemas)} problema(s)"
      + (" · guarda de censo da leitura: FAIL" if censo.get("falha") else ""))
    return 1 if problemas or incoerente or censo.get("falha") else 0


# ---------------------------------------------------------------- pré-merge
def vivo_pre(instr, registro):
    head = os.environ.get("GITHUB_HEAD_REF") or None
    base = os.environ.get("GITHUB_BASE_REF") or None
    estados = instr.ler_estados()
    arte = set(instr.ler_artefatos(estados))
    res = instr.julgar_pre_merge(head, base, estados, arte, registro)
    res["_leitura"] = {"head_ref": head, "base_ref": base, "evento": os.environ.get("GITHUB_EVENT_NAME")}
    return res


def relata_pre(res, out):
    p = lambda t: print(t, file=out)
    if "erro_de_leitura" in res:
        p(f"[FAIL]  NÃO DETERMINÁVEL (leitura do mundo falhou: {res['erro_de_leitura']})")
        p("----")
        p("fecho --pr: leitura falhou")
        return 1
    v, lt = res.get("veredito"), res["_leitura"]
    if v == "LIBERADO":
        texto = f"LIBERADO · {lt['head_ref']} → {lt['base_ref']} · {res.get('demanda')} em done · {res.get('motivo')}"
    elif v == "FECHO PENDENTE":
        texto = (f"FECHO PENDENTE da demanda {res.get('demanda') or lt['head_ref']}"
                 f" (fase {res.get('fase') or '—'}) — {res.get('motivo')}")
    else:
        texto = f"{v} ({res.get('motivo')})"
    p(f"{TAG['FAIL'] if res.get('falha') else TAG['OK']} {texto}")
    p("----")
    p(f"fecho --pr: {v}" + (f" · {res.get('codigo')}" if res.get("codigo") else ""))
    return 1 if res.get("falha") else 0


# ----------------------------------------------------------------------- CLI
def main(argv):
    args = set(argv[1:])
    desconhecidos = sorted(args - ARGS_ACEITOS)
    if desconhecidos:
        print(f"check_fecho: argumento não aceito ao vivo: {' '.join(desconhecidos)} — "
              "--head/--base só existem dentro das fixtures da sonda (T5, spec §CLI). "
              "Uso: [--pr] [--sonda] [--json]", file=sys.stderr)
        return 2
    so_sonda, em_json, pr = "--sonda" in args, "--json" in args, "--pr" in args
    out = sys.stderr if (so_sonda or em_json) else sys.stdout
    modo = "pre" if pr else "pos"

    def emite(obj):
        if so_sonda or em_json:
            print(json.dumps(obj, ensure_ascii=False, indent=2, default=str))

    try:
        registro = carrega_registro()
    except (FileNotFoundError, json.JSONDecodeError, UnicodeDecodeError) as e:
        print(f"[FAIL]  registro {REGISTRO} ausente ou ilegível: {e}", file=out)
        emite({"gate": GATES, "modo": modo, "sonda": None, "vivo": None, "exit": 1,
               "erro": f"registro ausente ou ilegível: {e}"})
        return 1

    instr, causa = carrega_instrumento()
    s = sonda(instr, causa, registro)            # 1. sonda — SEMPRE, em todo modo (C7)
    relata_sonda(s, out)
    if so_sonda:
        emite(s)
        return 0 if s["ok"] else 1
    if not s["ok"]:
        print("[FAIL]  árvore não julgada: o julgador reprovou na própria sonda (C7) — "
              "instrumento ausente/incompleto ou registro divergente", file=out)
        print("----", file=out)
        print(f"fecho{' --pr' if pr else ''}: sonda com {s['falhas']} divergência(s) e "
              f"{len(s['guarda'])} falha(s) de guarda · árvore não julgada", file=out)
        emite({"gate": GATES, "modo": modo, "sonda": s, "vivo": None, "exit": 1})
        return 1
    if pr:                                       # 2. leitura → 3. julgamento → 4. relato
        res = protegido(lambda: vivo_pre(instr, registro))
        rc = relata_pre(res, out)
    else:
        res = protegido(lambda: vivo_pos(instr, registro))
        rc = relata_pos(res, registro, out)
    emite({"gate": GATES, "modo": modo, "sonda": s, "vivo": res, "exit": rc})
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv))
