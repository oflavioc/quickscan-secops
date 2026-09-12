#!/usr/bin/env python3
r"""Stage `mutation-coverage` — o stage `mutation` passa a saber dizer O QUE NÃO ESTÁ
CHECANDO. Demanda 018, remédio do achado EA-3. Dono: qa-engineer.

O DEFEITO QUE ISTO TRATA. `check_mutation.py` percorre os HARNESSES declarados e,
para cada um cujos gatilhos não mudaram, emite `[OK] … campanha não exigida`. Um
arquivo que não figura nos `targets` de harness NENHUM não produz linha alguma —
nem OK, nem WARN, nem FAIL. Para quem lê o pipeline, a ausência de campanha fica
indistinguível de "campanha não exigida". A formulação que o EA-3 registra:
"um [OK] que mente por omissão é pior que um [FAIL], porque ninguém investiga um
verde."

O QUE ESTE JULGADOR NÃO FAZ. Não toca `check_mutation.py` e não substitui o laço
de trigger: mede AO LADO. Não spawna suíte nem harness (R10 §6) — lê JSON e YAML,
nada mais. Não escreve na árvore (R7 §3).

VOCABULÁRIO, e é metade do remédio (a 017 separou os dois últimos; esta demanda
acrescenta o primeiro):
  POPULAÇÃO       o que DEVE estar sob campanha   → mutation_population.json
  GATILHO         o que REDISPARA a campanha      → mutation_map.json → targets
  CONJUNTO MUTADO o que os MUTANTS de fato mutam  → declarado por harness

OS SETE GATES (spec.md §Critérios de aceite):
  D018-POP1     declaração bem formada; toda exceção e dívida com motivo E prazo
  D018-POP1(b)  auto-exclusão nominal deste próprio julgador (R10 §10)
  D018-ORF1     arquivo na população e fora de todo gatilho é NOMEADO
  D018-ORF1(b)  órfão com dívida viva vira [DÍVIDA]; órfão sem dívida é [FAIL]
  D018-PRAZO1   dívida com prazo vencido é [FAIL] — a válvula não vira silêncio
  D018-COB1     gatilho sem conjunto mutado, em severidade própria
  D018-MORTO1   declaração apontando arquivo inexistente é [FAIL] (família EA-31)
"""

import io
import json
import os
import re
import sys
from datetime import date

# stdout UTF-8 EXPLÍCITO (R7 §2), na forma que `check_eol_text.py:91-92` já usa. Sem
# isto o julgador morre de UnicodeEncodeError no Windows ao imprimir `→` — cp1252 não
# tem U+2192 —, e morre SÓ sob o pipeline: quem roda o comando à mão costuma ter
# PYTHONIOENCODING no ambiente e nunca vê o defeito. Foi exatamente assim que ele
# passou despercebido até o primeiro `run.sh` completo.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

GATE = "mutation-coverage"
ESTE_GATE = ".claude/verify/check_mutation_coverage.py"

# Costura de campanha, no padrão da casa (`MUTATION_PY`, `HTML_OVERRIDE`): o harness
# `d018` aponta o julgador para uma população SINTÉTICA em tmp, e assim mede o
# julgador contra cenários que a árvore real não tem (dívida sem prazo, prazo
# vencido, declaração morta) sem nunca tocar a árvore (R7 §3). Fora da campanha a
# variável não existe e o caminho é o canônico.
POPULACAO = os.environ.get("MUTCOV_POPULACAO") or ".claude/verify/mutation_population.json"
PIPELINE = ".claude/verify/pipeline.yaml"
MAPA = ".claude/verify/mutation_map.json"

_RE_STAGE_RUN = re.compile(r"^\s*run:\s*(.+?)\s*$", re.M)


def _ler_json(caminho):
    with io.open(caminho, encoding="utf-8") as fh:
        return json.load(fh)


def _posix(p):
    return str(p).replace("\\", "/")


# ------------------------------------------------------------------ população
def populacao_declarada(decl):
    """Aplica a REGRA do arquivo de declaração sobre o pipeline. A regra é dado:
    mudá-la é diff no JSON, nunca edição deste código."""
    regra = decl.get("regra") or {}
    fonte, padrao = regra.get("fonte"), regra.get("padrao")
    raiz = regra.get("raiz", "")
    if not (fonte and padrao):
        return None, ["regra incompleta: `fonte` e `padrao` são obrigatórios"]
    if not os.path.exists(fonte):
        return None, [f"regra aponta para fonte inexistente: {fonte}"]
    with io.open(fonte, encoding="utf-8") as fh:
        texto = fh.read()
    alvo = re.compile(padrao)
    achados = set()
    for m in _RE_STAGE_RUN.finditer(texto):
        for nome in alvo.findall(m.group(1)):
            achados.add(_posix(os.path.join(raiz, nome)) if raiz else _posix(nome))
    return sorted(achados), []


def gatilhos_declarados(mapa):
    """União dos `targets` de todos os harnesses — o que REDISPARA campanha."""
    uniao = {}
    for nome, h in (mapa.get("harnesses") or {}).items():
        for t in h.get("targets", []):
            uniao.setdefault(_posix(t), []).append(nome)
    return uniao


# ------------------------------------------------------------------- julgar
def julgar(decl, pop, gatilhos, hoje):
    """Devolve (linhas, problemas). Cada linha já é o texto final; `problemas`
    conta só o que reprova — dívida viva e não-medido NÃO reprovam."""
    linhas, problemas = [], 0

    dividas = {_posix(d.get("arquivo", "")): d for d in decl.get("dividas", [])}
    excecoes = {_posix(e.get("arquivo", "")): e for e in decl.get("excecoes", [])}

    # ---- D018-POP1 · forma da declaração ---------------------------------
    for rotulo, entradas in (("exceção", excecoes), ("dívida", dividas)):
        for caminho, e in sorted(entradas.items()):
            faltando = [c for c in ("motivo", "prazo") if not str(e.get(c, "")).strip()]
            if faltando:
                linhas.append(f"[FAIL] D018-POP1 {rotulo} {caminho}: sem {' e sem '.join(faltando)} "
                              f"— {rotulo} sem prazo vira permissão permanente")
                problemas += 1

    vistos = [c for c in list(excecoes) + list(dividas)]
    for caminho in sorted(c for c in set(vistos) if vistos.count(c) > 1):
        linhas.append(f"[FAIL] D018-POP1 {caminho}: declarado mais de uma vez")
        problemas += 1

    # ---- D018-MORTO1 · declaração que aponta para o vazio -----------------
    for rotulo, entradas in (("exceção", excecoes), ("dívida", dividas)):
        for caminho in sorted(entradas):
            if not caminho:
                linhas.append(f"[FAIL] D018-MORTO1 {rotulo} sem campo `arquivo`")
                problemas += 1
            elif not os.path.exists(caminho):
                linhas.append(f"[FAIL] D018-MORTO1 {rotulo} {caminho}: não existe no disco "
                              "— registro que aponta para arquivo inexistente apodrece (EA-31)")
                problemas += 1

    # ---- D018-POP1(b) · auto-exclusão nominal (R10 §10) -------------------
    if ESTE_GATE not in pop:
        linhas.append(f"[FAIL] D018-POP1(b) {ESTE_GATE}: o próprio julgador está FORA da "
                      "população — scanner que se exclui em silêncio falha no próprio gate")
        problemas += 1
    elif ESTE_GATE in excecoes:
        linhas.append(f"[OK]   D018-POP1(b) {ESTE_GATE}: excluído por exceção NOMINAL declarada")

    # ---- D018-PRAZO1 · dívida vencida ------------------------------------
    for caminho, d in sorted(dividas.items()):
        prazo = str(d.get("prazo", "")).strip()
        if not prazo:
            continue  # já acusado por POP1
        try:
            venceu = date.fromisoformat(prazo) < hoje
        except ValueError:
            linhas.append(f"[FAIL] D018-PRAZO1 {caminho}: prazo {prazo!r} não é data ISO (AAAA-MM-DD)")
            problemas += 1
            continue
        if venceu:
            linhas.append(f"[FAIL] D018-PRAZO1 {caminho}: prazo {prazo} VENCIDO — "
                          "válvula que sobrevive ao próprio prazo é silêncio com carimbo")
            problemas += 1

    # ---- D018-ORF1 / ORF1(b) · o achado EA-3 ------------------------------
    orfaos = divida_viva = 0
    for caminho in pop:
        if caminho in excecoes:
            continue
        if caminho in gatilhos:
            continue
        d = dividas.get(caminho)
        if d and str(d.get("prazo", "")).strip():
            divida_viva += 1
            # `.get` e não `[...]`: uma dívida sem prazo já foi acusada por POP1 e
            # não pode derrubar o julgador aqui — achado do mutante D018-M3, que
            # matava por KeyError em vez de matar pelo sinal declarado.
            linhas.append(f"[DÍVIDA] D018-ORF1(b) {caminho}: órfão declarado · prazo "
                          f"{d.get('prazo', '')} · {str(d.get('motivo', ''))[:90]}")
        else:
            orfaos += 1
            problemas += 1
            linhas.append(f"[FAIL] D018-ORF1 {caminho}: na população e fora de TODO gatilho "
                          "— nenhuma campanha o alcança, e nada dizia isso")

    # ---- D018-COB1 · gatilho sem conjunto mutado --------------------------
    # NÃO MEDIDO por ausência de fonte legível por máquina; ver a nota do fecho.
    linhas.append("[NÃO MEDIDO] D018-COB1: nenhum campo estruturado diz que arquivo cada par "
                  "muta (mutation-matrix.json → pares tem `ancora` e `descricao`, prosa). "
                  "Medir por substring foi o método que produziu a premissa falsa retificada "
                  "em 2026-09-11 — credor declarado, não estimativa nova")

    return linhas, problemas


def main(argv=None):
    hoje = date.today()
    for caminho in (POPULACAO, MAPA):
        if not os.path.exists(caminho):
            print(f"[FAIL] {GATE}: arquivo obrigatório ausente: {caminho}")
            print("----")
            print(f"{GATE}: 1 problema(s)")
            return 1

    decl = _ler_json(POPULACAO)
    mapa = _ler_json(MAPA)

    pop, erros = populacao_declarada(decl)
    if erros:
        for e in erros:
            print(f"[FAIL] D018-POP1 {e}")
        print("----")
        print(f"{GATE}: {len(erros)} problema(s)")
        return 1

    gatilhos = gatilhos_declarados(mapa)
    linhas, problemas = julgar(decl, pop, gatilhos, hoje)

    print(f"[INFO] este gate ({ESTE_GATE}): na população como qualquer outro, sem auto-exclusão")
    for l in linhas:
        print(l)

    dividas_vivas = sum(1 for l in linhas if l.startswith("[DÍVIDA]"))
    orfaos = sum(1 for l in linhas if l.startswith("[FAIL] D018-ORF1 "))
    nao_medidos = sum(1 for l in linhas if l.startswith("[NÃO MEDIDO]"))
    print("----")
    print(f"{GATE}: {len(pop)} na população · {orfaos} órfão(s) · {nao_medidos} não medido(s) · "
          f"{dividas_vivas} dívida(s) · {problemas} problema(s)")
    return 1 if problemas else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
