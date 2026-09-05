#!/usr/bin/env python3
"""Instrumento do stage `fecho` e do check `fecho --pr` — quem DECIDE e quem LÊ.

Demanda 016-registro-contra-execucao · P16.a · T030 · dono: core-engineer.
O contrato deste arquivo é o docstring de `.claude/verify/check_fecho.py`
(§CONTRATO DO INSTRUMENTO) somado a `fecho.json → _meta.contrato_da_sonda`;
spec: `specs/016-registro-contra-execucao/spec.md` §Critérios C1–C5 e §Contratos.

ESTE ARQUIVO NÃO RELATA: sem `print`, sem `sys.exit`, sem `if __name__`. Devolve
dados; quem imprime, ordena e sai é o gate (R3 §2 — o implementador não edita o
gate; mudança necessária volta por DEPENDÊNCIAS ao `qa-engineer`).

SEM REDE, por construção: nenhum import de biblioteca de rede — a lista nominal
está no docstring do gate, e não se repete aqui porque a varredura de T032(v) é
um grep por esses próprios nomes (menção em prosa vira falso positivo; R10 §10).
Só `subprocess` chamando `git`, sempre por lista de argumentos, sem shell
(R10 §7). Nada escreve na árvore (R7 §3).
SEM RELÓGIO: "vencida" compara o prazo com `data_do_commit` (T4), nunca com
`date.today()`; `datetime.date` entra só como validador de dia ISO.

Duas metades, separadas de propósito (plan §Contratos, T3):
  · julgadores PUROS — `julgar_pos_merge` / `julgar_pre_merge`: recebem TUDO por
    parâmetro. A sonda e a árvore real chamam a mesma função.
  · leitores — `ler_estados`, `ler_merges`, `ler_ancestralidade`,
    `ler_artefatos`, `ler_data_commit`: só I/O, sem juízo.

Decisões que o contrato deixou ao instrumento (nenhuma é pinada pela sonda; cada
uma está escrita aqui porque a próxima leitura vai perguntar "por quê"):

 1. `exclusao-malformada` sai em `globais`, não numa linha solta de `problemas`.
    O relato do gate só imprime `globais` e `sujeitos`: um problema fora dos dois
    seria contado e não seria dito — julgador mudo (C7). É global NÃO abortante:
    só os impeditivos da decisão 2 derrubam os sujeitos.
 2. Impedimento global é UM, por cadeia de precedência: piso fora de 40 hex →
    `origin/develop` ausente → cadeia truncada por clone raso (`historico-raso`,
    E016-8) → piso fora da cadeia. Cada elo é consequência do anterior (não se
    localiza piso em cadeia ilegível, nem se afirma "fora da cadeia" sobre cadeia
    que o clone não tem inteira), e o código do global é o que cada sujeito-demanda
    herda — dois globais deixariam essa herança ambígua.
 3. Um `codigo` por sujeito, na precedência `artefato-ausente` >
    `fecho_pendente-*` > `exclusao-obsoleta`; o que perde a vaga continua dito em
    `detalhe`, e reaparece como `codigo` assim que o primeiro for corrigido.
 4. `done` é julgado por C3 (artefatos) INDEPENDENTE do piso — é o que dá dentes
    à prova de carga das exclusões, já que as dez demandas `done` de hoje foram
    mescladas antes do piso vigente. `ANTERIOR AO PISO` é veredito só de demanda
    não-`done`: o piso silencia a cobrança do fecho (C1/C2), não a dos artefatos.
 5. `EM VOO` é "não mesclada" — inclusive para `done` (o pós-merge da própria
    demanda, antes do merge). Quando falta artefato, o veredito continua sendo o
    da posição (`MESCLADA SEM FECHO` / `EM VOO`) e quem acusa é o `codigo`.
 6. Obsolescência de exclusão só é julgada para slug com planning-state: sem
    `spec_dir` não há caminho de artefato para conferir. A malformação, essa, é
    estrutural e vale para toda entrada.

Divergências plan/tasks × docstring do gate, resolvidas pelo docstring (que é
mais específico, e explica o porquê no próprio texto):
  · `ler_ancestralidade(estados, piso)` — dois parâmetros; o `piso` é o que
    permite devolver `anterior_ao_piso`, campo que o julgador consome.
  · `ler_merges` percorre a cadeia first-parent INTEIRA (`%P`, sem `--merges`):
    o piso pode ser commit não-merge — o piso zero da prova de carga é a raiz
    `e5ccd429`. `--merges` nunca o encontraria, e "piso ausente da cadeia" viraria
    um falso `piso-invalido`.
"""
import json
import re
import subprocess
from datetime import date
from pathlib import Path

# ------------------------------------------------------------------ constantes
RAIZ = Path(__file__).resolve().parent.parent.parent          # .claude/verify → raiz
PLANNING = RAIZ / ".claude" / "project-memory" / "planning-state"
REF_DEVELOP = "refs/remotes/origin/develop"
ARTEFATOS_EXIGIDOS = ("relatorio-final.md", "spec-validate.md")
CAMPOS_VALVULA = ("motivo", "dono", "prazo")
SHA40 = re.compile(r"^[0-9a-f]{40}$")
DIA_ISO = re.compile(r"^\d{4}-\d{2}-\d{2}$")

# T10 — vocabulário fechado (o gate exige igualdade exata com o dele).
CONFORME = "CONFORME"
MESCLADA_SEM_FECHO = "MESCLADA SEM FECHO"
FECHO_PENDENTE_DECLARADO = "FECHO PENDENTE DECLARADO"
EM_VOO = "EM VOO"
ANTERIOR_AO_PISO = "ANTERIOR AO PISO"
FORA_DA_POPULACAO = "FORA DA POPULAÇÃO"
NAO_DETERMINAVEL = "NÃO DETERMINÁVEL"
LIBERADO = "LIBERADO"
FECHO_PENDENTE = "FECHO PENDENTE"
NAO_JULGADO = "NÃO JULGADO"
VEREDITOS = frozenset({
    CONFORME, MESCLADA_SEM_FECHO, FECHO_PENDENTE_DECLARADO, EM_VOO,
    ANTERIOR_AO_PISO, FORA_DA_POPULACAO, NAO_DETERMINAVEL,
    LIBERADO, FECHO_PENDENTE, NAO_JULGADO,
})

# Códigos — iguais a fecho.json → _meta.contrato_da_sonda.codigos (17, fechado).
C_VALVULA_INVALIDA = "fecho_pendente-invalida"
C_VALVULA_VENCIDA = "fecho_pendente-vencida"
C_VALVULA_OBSOLETA = "fecho_pendente-obsoleta"
C_VALVULA_PREMATURA = "fecho_pendente-prematura"
C_FORA_DA_MAQUINA = "demanda-fora-da-maquina"
C_MERGE_FORA_DE_PR = "merge-fora-de-pr"
C_ARTEFATO_AUSENTE = "artefato-ausente"
C_EXCLUSAO_OBSOLETA = "exclusao-obsoleta"
C_EXCLUSAO_MALFORMADA = "exclusao-malformada"
C_REGISTRO_SEM_BRANCH = "registro-sem-branch"
C_PISO_INVALIDO = "piso-invalido"
C_ORIGIN_DEVELOP_AUSENTE = "origin-develop-ausente"
C_FASE_NAO_DONE = "fase-nao-done"
C_FORA_DA_POPULACAO = "fora-da-populacao"
C_BASE_NAO_DEVELOP = "base-nao-develop"
C_EVENTO_SEM_BASE = "evento-sem-base"
# (E016-8) o 17º — impeditivo emitido SÓ quando o leitor afirma cadeia truncada por clone raso.
C_HISTORICO_RASO = "historico-raso"
CODIGOS = frozenset({
    C_VALVULA_INVALIDA, C_VALVULA_VENCIDA, C_VALVULA_OBSOLETA, C_VALVULA_PREMATURA,
    C_FORA_DA_MAQUINA, C_MERGE_FORA_DE_PR, C_ARTEFATO_AUSENTE, C_EXCLUSAO_OBSOLETA,
    C_EXCLUSAO_MALFORMADA, C_REGISTRO_SEM_BRANCH, C_PISO_INVALIDO,
    C_ORIGIN_DEVELOP_AUSENTE, C_FASE_NAO_DONE, C_FORA_DA_POPULACAO,
    C_BASE_NAO_DEVELOP, C_EVENTO_SEM_BASE, C_HISTORICO_RASO,
})


# -------------------------------------------------------------------- utilidades
def _txt(valor):
    return str(valor).strip() if isinstance(valor, str) else ("" if valor is None else str(valor).strip())


def _dia_valido(valor):
    """Dia ISO AAAA-MM-DD que existe no calendário (sem tocar o relógio)."""
    s = _txt(valor)
    if not DIA_ISO.match(s):
        return False
    try:
        date(int(s[0:4]), int(s[5:7]), int(s[8:10]))
    except ValueError:
        return False
    return True


def _spec_dir(estado, slug):
    bruto = _txt((estado or {}).get("spec_dir")) or f"specs/{slug}"
    return bruto.replace("\\", "/").rstrip("/")


class _Populacao:
    """Padrões de `registro.populacao`, compilados UMA vez por julgamento (R9 §8)."""

    def __init__(self, bloco):
        bloco = bloco or {}
        self.branch = self._compila(bloco.get("padrao_branch"))
        self.pr = self._compila(bloco.get("formato_merge_pr"))
        self.integracoes = [c for c in (self._compila(p) for p in (bloco.get("integracoes_de_main") or [])) if c]

    @staticmethod
    def _compila(padrao):
        padrao = _txt(padrao)
        if not padrao:
            return None
        try:
            return re.compile(padrao)
        except re.error:
            return None      # padrão quebrado no registro não casa nada — nunca perdoa em silêncio

    def do_merge(self, msg):
        """(branch, numero_do_pr) quando a mensagem é do GitHub; (None, None) senão."""
        m = self.pr.search(_txt(msg)) if self.pr else None
        if not m or m.lastindex is None or m.lastindex < 3:
            return None, None
        return _txt(m.group(3)), _txt(m.group(1))

    def e_de_demanda(self, branch):
        return bool(self.branch and branch and self.branch.search(branch))

    def e_integracao_de_main(self, msg):
        texto = _txt(msg)
        return any(c.search(texto) for c in self.integracoes)


def _impedimento(registro, origin_develop):
    """Global abortante, por precedência (decisão 2 do cabeçalho). (codigo, detalhe) | None."""
    piso = _txt(((registro or {}).get("piso") or {}).get("sha"))
    od = origin_develop or {}
    if not SHA40.match(piso):
        return C_PISO_INVALIDO, (f"{NAO_DETERMINAVEL} (piso de fecho.json não é SHA de 40 hex: "
                                 f"{piso!r} — sem piso não há posição a julgar)")
    if od.get("presente") is not True:
        causa = _txt(od.get("causa")) or f"{REF_DEVELOP} ausente — git fetch origin develop"
        return C_ORIGIN_DEVELOP_AUSENTE, f"{NAO_DETERMINAVEL} ({causa})"
    if od.get("cadeia_integra") is False:
        fim = (_txt(od.get("fim_da_cadeia")) or "?")[:12]
        pos = od.get("posicao_do_piso")
        onde = f"na posição {pos}" if pos is not None else "fora do trecho lido"
        return C_HISTORICO_RASO, (
            f"{NAO_DETERMINAVEL} (histórico raso: a cadeia first-parent de {REF_DEVELOP} termina "
            f"em {fim}, commit cujo objeto tem pais que o clone não tem; piso {piso[:12]} {onde} "
            f"— git fetch --unshallow origin; git fetch origin develop NÃO repara)")
    if od.get("piso_na_cadeia") is not True:
        return C_PISO_INVALIDO, (f"{NAO_DETERMINAVEL} (piso {piso[:12]} ausente da cadeia first-parent de "
                                 f"{REF_DEVELOP} — um SHA de outra branch não é piso)")
    return None


def _classifica_exclusoes(registro):
    """(validas: {slug: entrada}, malformadas: [(slug, motivo)]) — C3(c)."""
    validas, malformadas = {}, []
    for slug, entrada in sorted(((registro or {}).get("excluidas_por_r13") or {}).items()):
        if not isinstance(entrada, dict):
            malformadas.append((slug, "entrada não é um objeto"))
            continue
        nomes = entrada.get("artefatos_ausentes")
        motivos = []
        if not _txt(entrada.get("fonte")):
            motivos.append("sem `fonte`")
        if not isinstance(nomes, list) or not [n for n in nomes if _txt(n)]:
            motivos.append("`artefatos_ausentes` vazio ou ausente")
        elif any("*" in _txt(n) or "?" in _txt(n) for n in nomes):
            motivos.append("`artefatos_ausentes` com curinga")
        if motivos:
            malformadas.append((slug, " e ".join(motivos)))
        else:
            validas[slug] = {"artefatos_ausentes": [_txt(n) for n in nomes],
                             "fonte": _txt(entrada.get("fonte"))}
    return validas, malformadas


def _valvula(valvula, data_do_commit):
    """(codigo, detalhe) do defeito da válvula, ou (None, detalhe) se válida — C4."""
    if not isinstance(valvula, dict):
        return C_VALVULA_INVALIDA, "fecho_pendente não é um objeto {motivo, dono, prazo}"
    faltam = [c for c in CAMPOS_VALVULA if not _txt(valvula.get(c))]
    if faltam:
        return C_VALVULA_INVALIDA, "fecho_pendente sem " + ", ".join(faltam)
    prazo = _txt(valvula.get("prazo"))
    if not _dia_valido(prazo):
        return C_VALVULA_INVALIDA, f"prazo {prazo!r} fora de AAAA-MM-DD — não é data, não é válvula"
    dia = _txt(data_do_commit)
    if _dia_valido(dia) and prazo < dia:
        return C_VALVULA_VENCIDA, f"fecho_pendente vencida: prazo {prazo} anterior à data do commit julgado ({dia})"
    return None, (f"dono {_txt(valvula.get('dono'))} · prazo {prazo} · motivo: {_txt(valvula.get('motivo'))}")


def _faltas_de_artefato(estado, slug, artefatos, exclusao):
    """(nao_cobertos, cobertos_por_exclusao, nomeados_que_existem) — C3(a)/(b)."""
    base = _spec_dir(estado, slug)
    ausentes = [n for n in ARTEFATOS_EXIGIDOS if f"{base}/{n}" not in artefatos]
    nomeados = list((exclusao or {}).get("artefatos_ausentes") or [])
    nao_cobertos = [n for n in ausentes if n not in nomeados]
    obsoletos = [n for n in nomeados if n not in ausentes]
    return nao_cobertos, [n for n in nomeados if n in ausentes], obsoletos


# ------------------------------------------------------------------- pós-merge
def julgar_pos_merge(estados, merges, ancestralidade, artefatos, data_do_commit,
                     registro, origin_develop):
    """PURO: sem git, disco, rede ou relógio. Contrato em check_fecho.py §CONTRATO."""
    estados = estados or {}
    merges = list(merges or ())
    ancestralidade = ancestralidade or {}
    artefatos = set(artefatos or ())
    pop = _Populacao((registro or {}).get("populacao"))
    validas, malformadas = _classifica_exclusoes(registro)

    globais, sujeitos, problemas = [], [], []
    impedimento = _impedimento(registro, origin_develop)
    if impedimento:
        globais.append({"codigo": impedimento[0], "detalhe": impedimento[1]})
    for slug, motivo in malformadas:
        globais.append({"codigo": C_EXCLUSAO_MALFORMADA,
                        "detalhe": f"exclusão R13 de {slug} NÃO exclui ({motivo}) — corrija ou remova a entrada"})
    problemas.extend(f"{g['codigo']}: {g['detalhe']}" for g in globais)

    for slug in sorted(estados):
        sujeitos.append(_julga_demanda(slug, estados[slug] or {}, merges, ancestralidade, artefatos,
                                       data_do_commit, validas, pop, impedimento))
    if not impedimento:
        sujeitos.extend(_julga_merges(merges, estados, pop))

    # Sujeito abortado por um global NÃO acrescenta linha: o global já a acrescentou.
    abortados = {s["id"] for s in sujeitos if s.get("_abortado")}
    for s in sujeitos:
        s.pop("_abortado", None)
        if s["falha"] and s["id"] not in abortados:
            problemas.append(f"{s['id']}: {s['veredito']}" + (f" [{s['codigo']}]" if s["codigo"] else "")
                             + (f" — {s['detalhe']}" if s["detalhe"] else ""))

    posicoes = [_txt(m.get("posicao_relativa_ao_piso")) for m in merges]
    contagens = {
        "demandas": sum(1 for s in sujeitos if s["tipo"] == "demanda"),
        "valvulas": sum(1 for s in sujeitos if s["veredito"] == FECHO_PENDENTE_DECLARADO),
        "problemas": len(problemas),
        "merges_apos_piso": posicoes.count("posterior"),
        "merges_ate_piso": posicoes.count("anterior") + posicoes.count("piso"),
        "em_voo": sum(1 for s in sujeitos if s["veredito"] == EM_VOO),
        "anteriores_ao_piso": sum(1 for s in sujeitos if s["veredito"] == ANTERIOR_AO_PISO),
        "fora_da_populacao": sum(1 for s in sujeitos if s["veredito"] == FORA_DA_POPULACAO),
    }
    return {"sujeitos": sujeitos, "globais": globais, "problemas": problemas, "contagens": contagens}


def _sujeito(sid, tipo, veredito, *, oraculo=None, oraculo_detalhe=None, fase=None,
             codigo=None, detalhe="", abortado=False):
    return {"id": sid, "tipo": tipo, "veredito": veredito, "oraculo": oraculo,
            "oraculo_detalhe": oraculo_detalhe, "fase": fase, "codigo": codigo,
            "detalhe": detalhe,
            # MESCLADA SEM FECHO e NÃO DETERMINÁVEL são falha por si; nos demais, a falha vem do código.
            "falha": veredito in (MESCLADA_SEM_FECHO, NAO_DETERMINAVEL) or codigo is not None,
            "_abortado": abortado}


def _oraculo_da_demanda(branch, estado, merges, ancestralidade, slug, pop):
    """(mesclada, anterior_ao_piso, oraculo, detalhe) — T1: a mensagem primeiro; a ancestralidade só se ela calar."""
    for m in merges:
        nome, numero = pop.do_merge(m.get("msg"))
        if nome and nome == branch:
            return True, _txt(m.get("posicao_relativa_ao_piso")) in ("anterior", "piso"), "mensagem", f"#{numero}"
    resposta = (ancestralidade.get(slug) or {})
    if resposta.get("resposta") is True:
        sha = _txt(((estado or {}).get("red") or {}).get("commit"))
        return True, bool(resposta.get("anterior_ao_piso")), "ancestralidade", (sha[:12] or None)
    return False, False, None, None


def _julga_demanda(slug, estado, merges, ancestralidade, artefatos, data_do_commit, validas, pop, impedimento):
    fase = estado.get("phase")
    if impedimento:
        return _sujeito(slug, "demanda", NAO_DETERMINAVEL, fase=fase, codigo=impedimento[0],
                        detalhe=f"não julgada — {impedimento[1]}", abortado=True)

    branch = _txt(estado.get("branch"))
    if not branch:
        return _sujeito(slug, "demanda", NAO_DETERMINAVEL, fase=fase, codigo=C_REGISTRO_SEM_BRANCH,
                        detalhe="planning-state sem a chave `branch` — junção registro↔git impossível (C1 f)")

    mesclada, anterior, oraculo, detalhe_oraculo = _oraculo_da_demanda(
        branch, estado, merges, ancestralidade, slug, pop)
    valvula = estado.get("fecho_pendente")
    exclusao = validas.get(slug)
    nao_cobertos, cobertos, obsoletos = _faltas_de_artefato(estado, slug, artefatos, exclusao)
    notas, codigo = [], None
    if cobertos:
        notas.append(f"EXCLUÍDA R13 ({', '.join(cobertos)}) — fonte: {exclusao['fonte']}")

    if fase == "done":
        veredito = MESCLADA_SEM_FECHO if mesclada else EM_VOO
        if nao_cobertos:
            codigo = C_ARTEFATO_AUSENTE
            notas.append("done sem " + ", ".join(nao_cobertos) + " em disco, sem exclusão R13 válida")
        else:
            veredito = CONFORME if mesclada else EM_VOO
        if valvula is not None:
            codigo = codigo or C_VALVULA_OBSOLETA
            notas.append("fecho_pendente em demanda done — válvula obsoleta, remova a entrada (C4 c)")
        if obsoletos:
            codigo = codigo or C_EXCLUSAO_OBSOLETA
            notas.append(f"exclusão R13 obsoleta: {', '.join(obsoletos)} existe(m) em disco — remova a entrada (C3 b)")
    elif not mesclada:
        veredito = EM_VOO
        if valvula is not None:
            codigo = C_VALVULA_PREMATURA
            notas.append("fecho_pendente em demanda não mesclada — a válvula é pós-merge (C4 d, T5)")
        else:
            notas.append("não mesclada por nenhum oráculo — não julgada")
    elif anterior:
        veredito = ANTERIOR_AO_PISO
        notas.append("mesclada até o piso, inclusive — fora do alcance do julgamento (R13)")
    elif valvula is None:
        veredito = MESCLADA_SEM_FECHO
        notas.append(f"mesclada em develop com fase {fase!r} e sem fecho_pendente")
    else:
        defeito, texto = _valvula(valvula, data_do_commit)
        veredito = MESCLADA_SEM_FECHO if defeito else FECHO_PENDENTE_DECLARADO
        codigo = defeito
        notas.append(texto)

    return _sujeito(slug, "demanda", veredito, oraculo=oraculo, oraculo_detalhe=detalhe_oraculo,
                    fase=fase, codigo=codigo, detalhe=" · ".join(n for n in notas if n))


def _julga_merges(merges, estados, pop):
    """Sujeito `merge` só para merge POSTERIOR ao piso que não casa estado algum pela chave `branch` EXATA."""
    com_estado = {_txt((e or {}).get("branch")) for e in estados.values() if _txt((e or {}).get("branch"))}
    sujeitos = []
    for m in merges:
        if _txt(m.get("posicao_relativa_ao_piso")) != "posterior":
            continue
        branch, numero = pop.do_merge(m.get("msg"))
        if branch and branch in com_estado:
            continue                       # o merge da demanda cai no sujeito dela (C2 b)
        sid, msg = _txt(m.get("sha")), _txt(m.get("msg"))
        if branch:
            if pop.e_de_demanda(branch):
                sujeitos.append(_sujeito(sid, "merge", MESCLADA_SEM_FECHO, oraculo="mensagem",
                                         oraculo_detalhe=f"#{numero}", codigo=C_FORA_DA_MAQUINA,
                                         detalhe=f"{branch} mesclada após o piso sem planning-state — "
                                                 f"demanda fora da máquina (R4 §Violação)"))
            else:
                sujeitos.append(_sujeito(sid, "merge", FORA_DA_POPULACAO, oraculo="mensagem",
                                         oraculo_detalhe=f"#{numero}",
                                         detalhe=f"{branch} fora do padrão de demanda"))
        elif pop.e_integracao_de_main(msg):
            sujeitos.append(_sujeito(sid, "merge", FORA_DA_POPULACAO, detalhe=f"integração de main: {msg}"))
        else:
            sujeitos.append(_sujeito(sid, "merge", FORA_DA_POPULACAO, codigo=C_MERGE_FORA_DE_PR,
                                     detalhe=f"merge em develop fora de PR após o piso (R14): {msg}"))
    return sujeitos


# ------------------------------------------------------------------- pré-merge
def julgar_pre_merge(head_ref, base_ref, estados, artefatos, registro):
    """PURO. Ordem do contrato: evento → base → população → estado → válvula → fase → artefatos."""
    estados = estados or {}
    artefatos = set(artefatos or ())
    pop = _Populacao((registro or {}).get("populacao"))
    validas, _ = _classifica_exclusoes(registro)
    head, base = _txt(head_ref), _txt(base_ref)

    def r(veredito, codigo, motivo, demanda=None, fase=None):
        return {"veredito": veredito, "codigo": codigo, "motivo": motivo, "demanda": demanda,
                "fase": fase, "falha": veredito == FECHO_PENDENTE}

    if not head or not base:
        return r(NAO_JULGADO, C_EVENTO_SEM_BASE,
                 "evento sem base (push, workflow_dispatch ou re-run fora de pull_request)")
    if base != "develop":
        return r(NAO_JULGADO, C_BASE_NAO_DEVELOP, f"base {base} ≠ develop (release/main, R14)")
    if not pop.e_de_demanda(head):
        return r(NAO_JULGADO, C_FORA_DA_POPULACAO, f"fora da população: {head} não é branch de demanda")

    slug = next((s for s in sorted(estados) if _txt((estados[s] or {}).get("branch")) == head), None)
    if slug is None:
        return r(FECHO_PENDENTE, C_FORA_DA_MAQUINA,
                 f"nenhum planning-state casa a branch {head} — demanda fora da máquina (R4 §Violação)")

    estado = estados[slug] or {}
    fase = estado.get("phase")
    if estado.get("fecho_pendente") is not None:
        obsoleta = fase == "done"
        return r(FECHO_PENDENTE,
                 C_VALVULA_OBSOLETA if obsoleta else C_VALVULA_PREMATURA,
                 ("fecho_pendente em demanda done — válvula obsoleta" if obsoleta else
                  "fecho_pendente não libera merge — a válvula é pós-merge (T5)"), slug, fase)
    if fase != "done":
        return r(FECHO_PENDENTE, C_FASE_NAO_DONE, "merge bloqueado até done", slug, fase)

    nao_cobertos, cobertos, _ = _faltas_de_artefato(estado, slug, artefatos, validas.get(slug))
    if nao_cobertos:
        return r(FECHO_PENDENTE, C_ARTEFATO_AUSENTE,
                 "done sem " + ", ".join(nao_cobertos) + " em disco, sem exclusão R13 válida", slug, fase)
    razao = f"EXCLUÍDA R13 ({', '.join(cobertos)})" if cobertos else "com " + " e ".join(ARTEFATOS_EXIGIDOS)
    return r(LIBERADO, None, f"Fase 6 fechada — {razao}", slug, fase)


# --------------------------------------------------------------------- leitores
def _git(args):
    """git por lista de argumentos, sem shell, sempre a partir da raiz do repositório."""
    return subprocess.run(["git", *args], cwd=str(RAIZ), capture_output=True,
                          text=True, encoding="utf-8", errors="replace")


def ler_estados():
    """{slug: planning-state}. JSON quebrado estoura — o gate o nomeia, nunca vira SKIP."""
    estados = {}
    for caminho in sorted(PLANNING.glob("*.json")):
        with open(caminho, encoding="utf-8") as fh:
            conteudo = json.load(fh)
        estados[_txt(conteudo.get("demanda")) or caminho.stem] = conteudo
    return estados


def _cadeia_integra(fim):
    """(E016-8) `cadeia_integra`: True · False (clone raso truncou a cadeia) · None.

    CONJUNÇÃO (medido — ea39-desenho.md §1): o flag é necessário e é o portão barato
    (`false` ⇒ íntegra, sem mais processo); só se `true`, o objeto do fim da
    caminhada decide. O flag sozinho acusaria falso um clone completo que fez `fetch
    --depth=1` de commit alheio; a comparação sozinha confundiria graft/`refs/replace`.
    """
    raso = _git(["rev-parse", "--is-shallow-repository"])
    if raso.returncode != 0:
        return None                                   # git não respondeu: nada afirmado
    if _txt(raso.stdout) != "true" or fim is None or fim["pais"]:
        return True
    obj = _git(["cat-file", "-p", fim["sha"]])
    if obj.returncode != 0:
        return None
    cabecalho = obj.stdout.split("\n\n", 1)[0]     # só o cabeçalho: "parent " no corpo é texto
    return not any(l.startswith("parent ") for l in cabecalho.splitlines())


def ler_merges(piso):
    """{merges, origin_develop} — cadeia first-parent INTEIRA (o piso pode ser não-merge)."""
    od = {"presente": False, "sha": None, "causa": None, "piso_na_cadeia": False,
          "cadeia_integra": None, "fim_da_cadeia": None, "posicao_do_piso": None}
    piso = _txt(piso)
    try:
        ref = _git(["rev-parse", "--verify", "--quiet", REF_DEVELOP])
    except FileNotFoundError:
        od["causa"] = "git ausente no PATH — não há como ler " + REF_DEVELOP
        return {"merges": [], "origin_develop": od}
    if ref.returncode != 0 or not _txt(ref.stdout):
        od["causa"] = f"{REF_DEVELOP} ausente — git fetch origin develop"
        return {"merges": [], "origin_develop": od}
    od["presente"], od["sha"] = True, _txt(ref.stdout)

    log = _git(["log", "--first-parent", "--format=%H%x00%P%x00%cI%x00%s", REF_DEVELOP])
    if log.returncode != 0:
        od["presente"] = False
        od["causa"] = f"git log falhou em {REF_DEVELOP}: {_txt(log.stderr)[:200]}"
        return {"merges": [], "origin_develop": od}

    cadeia = []
    for linha in log.stdout.splitlines():
        if not linha.strip():
            continue
        campos = linha.split("\x00")
        if len(campos) < 4:
            continue
        cadeia.append({"sha": campos[0].strip(), "pais": campos[1].split(),
                       "data": campos[2].strip(), "msg": campos[3]})
    indice = next((i for i, c in enumerate(cadeia) if c["sha"] == piso), None)
    od["piso_na_cadeia"] = indice is not None
    # (E016-8) a caminhada só para onde o git não vê pai: raiz OU commit raso (`%P` vazio).
    fim = cadeia[-1] if cadeia else None
    od["fim_da_cadeia"] = fim["sha"] if fim else None
    od["posicao_do_piso"] = indice
    od["cadeia_integra"] = _cadeia_integra(fim)

    merges = []
    for i, c in enumerate(cadeia):
        if len(c["pais"]) < 2:
            continue
        if indice is None or i < indice:
            posicao = "posterior"      # piso fora da cadeia ⇒ o julgador aborta por piso-invalido
        elif i == indice:
            posicao = "piso"
        else:
            posicao = "anterior"
        merges.append({"sha": c["sha"], "data": c["data"], "msg": c["msg"],
                       "posicao_relativa_ao_piso": posicao})
    return {"merges": merges, "origin_develop": od}


def _e_ancestral(sha, alvo):
    """True/False/None — None quando o git não consegue responder (objeto inválido)."""
    r = _git(["merge-base", "--is-ancestor", sha, alvo])
    if r.returncode == 0:
        return True
    if r.returncode == 1:
        return False
    return None


def ler_ancestralidade(estados, piso):
    """{slug: {resposta, causa, anterior_ao_piso}} — T1 secundário, pré-resolvido (borda 8)."""
    piso = _txt(piso)
    resultado = {}
    for slug, estado in sorted((estados or {}).items()):
        sha = _txt(((estado or {}).get("red") or {}).get("commit"))
        if not sha:
            resultado[slug] = {"resposta": None, "causa": "sem red.commit", "anterior_ao_piso": False}
            continue
        try:
            resolvido = _git(["rev-parse", "--verify", "--quiet", f"{sha}^{{commit}}"])
        except FileNotFoundError:
            resultado[slug] = {"resposta": None, "causa": "git ausente no PATH", "anterior_ao_piso": False}
            continue
        if resolvido.returncode != 0 or not _txt(resolvido.stdout):
            resultado[slug] = {"resposta": None, "anterior_ao_piso": False,
                               "causa": f"red.commit {sha} não resolve sem ambiguidade "
                                        f"(git rev-parse --verify {sha}^{{commit}})"}
            continue
        objeto = _txt(resolvido.stdout).splitlines()[0]
        resposta = _e_ancestral(objeto, REF_DEVELOP)
        anterior = _e_ancestral(objeto, piso) if SHA40.match(piso) else None
        resultado[slug] = {
            "resposta": resposta,
            "causa": None if resposta is not None else f"git merge-base não respondeu por {sha}",
            "anterior_ao_piso": anterior is True,
        }
    return resultado


def ler_artefatos(estados):
    """Paths relativos EXISTENTES dos dois artefatos de fecho, por spec_dir."""
    existentes = []
    for slug, estado in sorted((estados or {}).items()):
        base = _spec_dir(estado, slug)
        for nome in ARTEFATOS_EXIGIDOS:
            if (RAIZ / base / nome).is_file():
                existentes.append(f"{base}/{nome}")
    return existentes


def ler_data_commit():
    """Dia do commit julgado (T4) — %cI de HEAD. Sem relógio."""
    r = _git(["log", "-1", "--format=%cI", "HEAD"])
    if r.returncode != 0 or not _txt(r.stdout):
        raise RuntimeError(f"git log -1 --format=%cI HEAD falhou: {_txt(r.stderr)[:200]}")
    return _txt(r.stdout).splitlines()[0][:10]
