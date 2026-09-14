#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prepara um diretorio de release em ../deploy/<tag>/ a partir do build atual.

NASCEU DO `EA-53`: por tres semanas o servico em 127.0.0.1:1337 serviu um
artefato de 25/08 enquanto o repositorio acumulava sete correcoes de produto.
A causa nao era codigo — era um caminho de entrega MANUAL, fora do git, que
ninguem lembrava de percorrer. Este script torna o caminho uma linha so.

O QUE ELE **NAO** FAZ, DE PROPOSITO: nao sobe container, nao para container e
nao mexe no que esta no ar. Publicar e ato do proprietario; o script prepara e
IMPRIME os comandos. Automatizar o cutover trocaria um esquecimento silencioso
por uma publicacao silenciosa, que e pior.

Uso:  python preparar_release.py v3.2.4
"""
import hashlib, io, json, os, re, subprocess, sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")   # R7 §2

RAIZ = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(RAIZ, "quickscan_secops_soccmm_v3_2_dev.html")
ENGINE = os.path.join(RAIZ, "engine_v32.js")
DEPLOY = os.path.abspath(os.path.join(RAIZ, os.pardir, "deploy"))


def sha(p):
    return hashlib.sha256(io.open(p, "rb").read()).hexdigest()


def git(*a):
    return subprocess.run(["git"] + list(a), cwd=RAIZ, capture_output=True,
                          text=True, encoding="utf-8", errors="replace").stdout.strip()


def falhar(msg):
    print("[FAIL] " + msg)
    sys.exit(1)


def main(tag):
    if not re.match(r"^v\d+\.\d+\.\d+$", tag):
        falhar("tag fora da forma vN.N.N: " + tag)
    slug = "v" + tag[1:].replace(".", "_")                     # v3.2.4 -> v3_2_4
    destino = os.path.join(DEPLOY, tag)
    if os.path.exists(destino):
        falhar("ja existe: " + destino + " — release nunca e sobrescrito")

    # --- preflight: a arvore precisa estar limpa e o build, em dia -----------
    sujo = git("status", "--porcelain")
    if sujo:
        falhar("arvore suja — o release carrega um commit, e commit exige arvore limpa:\n" + sujo)
    antes = sha(BUILD)
    r = subprocess.run([sys.executable, os.path.join(RAIZ, "build_v32_html.py")],
                       cwd=RAIZ, capture_output=True)
    if r.returncode != 0:
        falhar("build_v32_html.py falhou")
    if sha(BUILD) != antes:
        falhar("o build no disco estava DESATUALIZADO em relacao as fontes — "
               "rebuild mudou o artefato; commite o build antes de preparar release")

    commit = git("rev-parse", "HEAD")
    versao = json.load(io.open(os.path.join(RAIZ, "package.json"), encoding="utf-8"))["version"]
    anterior = sorted(d for d in os.listdir(DEPLOY)
                      if re.match(r"^v\d+\.\d+\.\d+$", d)) if os.path.isdir(DEPLOY) else []
    base = os.path.join(DEPLOY, anterior[-1]) if anterior else None
    if not base:
        falhar("nenhum release anterior em " + DEPLOY + " — o default.conf vem de la")

    os.makedirs(destino)
    artefato = "quickscan_secops_soccmm_" + slug + ".html"
    io.open(os.path.join(destino, artefato), "wb").write(io.open(BUILD, "rb").read())
    conf_src = os.path.join(base, "default.conf")
    io.open(os.path.join(destino, "default.conf"), "wb").write(io.open(conf_src, "rb").read())

    nome_stack = "quickscan-" + tag.replace(".", "")            # v3.2.4 -> quickscan-v324
    compose_base = io.open(os.path.join(base, "compose.yaml"), encoding="utf-8").read()
    img = re.search(r"image: (\S+)", compose_base).group(1)
    compose = COMPOSE.format(tag=tag, artefato=artefato, stack=nome_stack, img=img,
                             sha=sha(os.path.join(destino, artefato)),
                             bytes=os.path.getsize(os.path.join(destino, artefato)),
                             engine=sha(ENGINE), versao=versao, commit=commit,
                             anterior=os.path.basename(base))
    io.open(os.path.join(destino, "compose.yaml"), "w", encoding="utf-8", newline="\n").write(compose)

    linhas = []
    for f in (artefato, "default.conf", "compose.yaml"):
        linhas.append(sha(os.path.join(destino, f)) + " *" + f)
    io.open(os.path.join(destino, "RELEASE_" + slug + "_DEPLOY.sha256"), "w",
            encoding="utf-8", newline="\n").write("\n".join(linhas) + "\n")

    print("[OK]   release preparado em " + destino)
    print("       artefato " + artefato + " · " + str(os.path.getsize(os.path.join(destino, artefato))) + " bytes")
    print("       commit   " + commit)
    print("")
    print("FALTA O QUE E SEU, e este script nao faz:")
    print("  1. escrever o registro de deploy (" + slug.upper() + "_PRODUCTION_DEPLOYMENT_RECORD.md),")
    print("     com o payload M41 medido e o smoke das correcoes que entram")
    print("  2. o cutover, quando voce decidir:")
    print("       docker stop quickscan-" + os.path.basename(base).replace(".", ""))
    print("       docker compose -f deploy/" + tag + "/compose.yaml up -d")
    print("  3. conferir byte a byte o que a porta devolve contra o artefato")
    return 0


COMPOSE = """# Stack da Quickscan {tag} para o servico local em 127.0.0.1:1337.
# Gerado por preparar_release.py — postura de seguranca herdada de {anterior},
# com o MESMO digest de imagem e o MESMO default.conf (copia byte-identica).
#
# artefato servido : {artefato}
# SHA-256          : {sha}
# bytes            : {bytes}
# engine           : {engine}
# toolVersion      : {versao}
# tag              : {tag}
# commit           : {commit}

name: {stack}

services:
  web:
    container_name: {stack}
    image: {img}
    restart: unless-stopped
    ports:
      - "127.0.0.1:1337:8080"
    volumes:
      - type: bind
        source: ./{artefato}
        target: /usr/share/nginx/html/index.html
        read_only: true
      - type: bind
        source: ./default.conf
        target: /etc/nginx/conf.d/default.conf
        read_only: true
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache/nginx
      - /var/run
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 5s
"""

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
