#!/usr/bin/env python3
"""Gera o manifesto-ponte da migração de evidência (demandas 007 e 008 — R11 §2, R8).

Dois tipos de acervo convivem no mesmo manifesto:

  - `tipo: "diretorio"` (implícito — as 4 entradas da 007): os acervos legados
    `docs_phase5/evidence_{p50,p51,p52,unset}` saem do índice e viram um `.tar`
    por acervo, asset de um release nominal próprio;
  - `tipo: "arquivo"` (008, decisão T3): um único blob rastreado — os 3 ZIPs de
    auditoria da raiz `visual_print_evidence_{47,48,487}.zip` — publicado
    DIRETAMENTE, sem tar, como asset do release compartilhado `evidence-v32`
    (decisão T1). O "pacote" é o próprio blob, extraído do commit-âncora para o
    diretório efêmero; `path` é explícito e `pacote` == basename(`path`).

O que preserva a verificabilidade em ambos é ESTE manifesto: SHA-256 de cada blob
do **commit-âncora** e SHA-256 de cada pacote publicado. Os hashes saem dos BLOBS
do commit-âncora — à prova de CRLF e de plataforma, por construção (R2 §2).

Conferência TRIPLA (observação O2 do parecer do PO, demanda 008) — obrigatória e
sem escape: antes de qualquer acervo-arquivo entrar no manifesto, a ferramenta
prova que os três retratos do mesmo byte coincidem,

    SHA-256(blob <âncora>:<path>) == SHA-256(blob HEAD:<path>) == MANIFEST.sha256

e PARA com FAIL nomeando o ZIP e os três hashes na menor divergência — identidade
em disputa é achado, não algo a contornar (R2 §3). O `MANIFEST.sha256` é classe
`legacy`: **lido, nunca editado** (R6). A conferência exige que o path ainda esteja
rastreado em HEAD (pré-desindexação) — é essa a janela em que a migração ocorre.

Roda **uma única vez** por migração e NUNCA entra no `pipeline.yaml`: a
verificação contínua é do `check_evidence_bridge.py`, leitor independente que
confere o conteúdo contra os blobs do commit-âncora — jamais re-executando a
geração (Observação 1 do parecer do PO). Por isso `_meta.gerado_em` (relógio) é
aceitável aqui: o manifesto congela por pin, não é artefato reproduzido em gate.

Uso:
  python .claude/verify/gen_evidence_bridge.py <sha-ancora>
  python .claude/verify/gen_evidence_bridge.py <sha-ancora> --pacotes DIR --manifesto PATH

  <sha-ancora>   SHA-1 do commit-âncora, 40 hex minúsculos e obrigatório.
                 `HEAD`, nome de branch e SHA curto são RECUSADOS — âncora de
                 regressão é commit imutável + SHA (R10 §5), por construção.
  --pacotes DIR  destino dos pacotes (padrão: <tmp>/quickscan_evidence_bridge).
                 Diretório efêmero FORA da árvore rastreada: nenhum binário novo
                 entra no repo (R11 §1, R7 §3) — os pacotes existem para virar
                 asset de release, nunca commit.
  --manifesto P  destino do manifesto (padrão: .claude/verify/evidence_bridge.json).
                 Apontar para tmp permite prova de execução sem sujar a árvore.

Empacotamento: NÃO há requisito de tar determinístico/reproduzível (Observação 5
do parecer). O que o manifesto congela são os bytes do pacote efetivamente
publicado, reconferidos pós-upload; regeneração byte-idêntica não é oráculo de
nenhum EB-*. Os campos fixos do TarInfo abaixo reduzem ruído — não são promessa.
Para o acervo-arquivo a questão nem se coloca: o pacote É o blob, byte a byte.
"""
import hashlib, io, json, os, re, subprocess, sys, tarfile, tempfile
from datetime import date

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

REPO = "oflavioc/quickscan-secops"
MANIFESTO_PADRAO = ".claude/verify/evidence_bridge.json"
MANIFESTO_LEGADO = "MANIFEST.sha256"
PACOTES_PADRAO = os.path.join(tempfile.gettempdir(), "quickscan_evidence_bridge")
SHA40 = re.compile(r"^[0-9a-f]{40}$")
SHA64 = re.compile(r"^[0-9a-f]{64}$")

RELEASE_V32 = "evidence-v32"

# (release_tag, diretório rastreado no commit-âncora, nome do asset) — demanda 007.
# Emitidos SEM campo `tipo`: ausente ⇒ "diretorio" (T3), e as 4 entradas da 007
# permanecem textualmente inalteradas no manifesto.
ACERVOS = (
    ("evidence-p50", "docs_phase5/evidence_p50", "evidence_p50.tar"),
    ("evidence-p51", "docs_phase5/evidence_p51", "evidence_p51.tar"),
    ("evidence-p52", "docs_phase5/evidence_p52", "evidence_p52.tar"),
    ("evidence-unset", "docs_phase5/evidence_unset", "evidence_unset.tar"),
)

# (chave do acervo, path rastreado no commit-âncora, release_tag) — demanda 008.
# Release compartilhado (T1): `release_tag` difere da chave por desenho.
ACERVOS_ARQUIVO = (
    ("evidence-47", "visual_print_evidence_47.zip", RELEASE_V32),
    ("evidence-48", "visual_print_evidence_48.zip", RELEASE_V32),
    ("evidence-487", "visual_print_evidence_487.zip", RELEASE_V32),
)

DESCRICAO = (
    "Manifesto-ponte da migração de evidência (demandas 007 e 008). Os acervos "
    "docs_phase5/evidence_{p50,p51,p52,unset} (007) e os ZIPs de auditoria da raiz "
    "visual_print_evidence_{47,48,487}.zip (008) saíram do índice git e vivem como assets "
    "de releases deste repositório — nominais por acervo na 007, release único evidence-v32 "
    "na 008; a verificabilidade é preservada por este manifesto — SHA-256 de cada blob do "
    "commit-âncora e de cada pacote — e pelo stage evidence-bridge. Acervo sem campo `tipo` "
    "é `diretorio` e é publicado como .tar; `tipo: \"arquivo\"` publica o próprio blob, com "
    "`path` explícito e `pacote` == basename(path). Complementa os manifestos históricos de "
    "fase (classe legacy), não os substitui. Gerado por .claude/verify/gen_evidence_bridge.py; "
    "nunca editado à mão (R12) e alterado só com repin e trilha (R8)."
)


def git(*args):
    """Executa git e devolve stdout em bytes; erro de git é erro da ferramenta."""
    r = subprocess.run(["git", *args], capture_output=True)
    if r.returncode != 0:
        raise SystemExit(f"[FAIL] git {' '.join(args)}: "
                         f"{r.stderr.decode('utf-8', 'replace').strip()}")
    return r.stdout


def git_opcional(*args):
    """git de leitura tolerante: devolve (stdout bytes | None, stderr texto)."""
    r = subprocess.run(["git", *args], capture_output=True)
    if r.returncode != 0:
        return None, r.stderr.decode("utf-8", "replace").strip()
    return r.stdout, ""


def valida_ancora(sha):
    """Âncora é commit imutável + SHA (R10 §5) — nada de HEAD, branch ou SHA curto."""
    if not SHA40.match(sha):
        raise SystemExit(
            f"[FAIL] âncora inválida: {sha!r}. Exigido o SHA-1 completo do commit-âncora "
            "(40 hex minúsculos). 'HEAD', nome de branch e SHA curto são recusados: âncora "
            "de regressão é commit imutável + SHA (R10 §5)."
        )
    tipo = git("cat-file", "-t", sha).decode("utf-8", "replace").strip()
    if tipo != "commit":
        raise SystemExit(f"[FAIL] âncora {sha} não é um commit (git diz: {tipo!r}).")
    return sha


def arquivos_do_acervo(ancora, diretorio):
    """Lista autoritativa dos paths rastreados do acervo NO commit-âncora."""
    out = git("ls-tree", "-r", "--name-only", "-z", ancora, "--", diretorio)
    return sorted(p for p in out.decode("utf-8").split("\0") if p)


def blob(ancora, path):
    return git("cat-file", "blob", f"{ancora}:{path}")


def sha256_arquivo(caminho):
    h = hashlib.sha256()
    with open(caminho, "rb") as fh:
        for pedaco in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(pedaco)
    return h.hexdigest()


# ----------------------------------------------------- conferência TRIPLA (O2)
def le_manifest_legado(caminho=MANIFESTO_LEGADO):
    """Lê o `MANIFEST.sha256` — classe `legacy`: LEITURA, jamais escrita (R6).

    Devolve {nome_de_arquivo: [(sha256, nº da linha), ...]}. A multiplicidade é
    preservada de propósito: nome com duas entradas é ambiguidade, e a conferência
    recusa ambiguidade em vez de escolher uma delas por conta própria.
    """
    entradas = {}
    try:
        with open(caminho, encoding="utf-8", errors="replace") as fh:
            for numero, linha in enumerate(fh, 1):
                partes = linha.split()
                if len(partes) < 2 or not SHA64.match(partes[0].lower()):
                    continue
                nome = os.path.basename(partes[-1].replace("\\", "/").lstrip("*"))
                entradas.setdefault(nome, []).append((partes[0].lower(), numero))
    except OSError as e:
        raise SystemExit(
            f"[FAIL] conferência TRIPLA impossível: {caminho} ilegível ({e}). "
            "O manifesto legado é uma das três testemunhas da identidade (O2) — "
            "sem ele a migração PARA."
        )
    return entradas


def confere_tripla(ancora, path, legado):
    """O2 — os três retratos do mesmo byte têm de coincidir, ou a migração PARA.

        SHA-256(blob <âncora>:<path>) == SHA-256(blob HEAD:<path>) == MANIFEST.sha256

    Devolve (bytes do blob da ÂNCORA, sha256). A âncora é a fonte canônica do que
    será publicado; HEAD e o manifesto legado são testemunhas independentes.
    """
    nome = os.path.basename(path)

    dados_ancora, erro = git_opcional("cat-file", "blob", f"{ancora}:{path}")
    if dados_ancora is None:
        raise SystemExit(
            f"[FAIL] conferência TRIPLA de `{path}`: blob `{ancora}:{path}` inacessível "
            f"({erro}). Clone raso? A âncora precisa conter o path (R10 §5)."
        )
    sha_ancora = hashlib.sha256(dados_ancora).hexdigest()

    dados_head, erro = git_opcional("cat-file", "blob", f"HEAD:{path}")
    if dados_head is None:
        raise SystemExit(
            f"[FAIL] conferência TRIPLA de `{path}`: blob `HEAD:{path}` inacessível "
            f"({erro}). A conferência é PRÉ-remoção: o path tem de estar rastreado em "
            "HEAD no momento da geração — se já foi desindexado, regenerar o manifesto "
            "exige voltar à janela da migração, não afrouxar a conferência (R10 §1)."
        )
    sha_head = hashlib.sha256(dados_head).hexdigest()

    ocorrencias = legado.get(nome, [])
    if len(ocorrencias) != 1:
        onde = ", ".join(f"linha {n}" for _, n in ocorrencias) or "nenhuma linha"
        raise SystemExit(
            f"[FAIL] conferência TRIPLA de `{path}`: {MANIFESTO_LEGADO} tem "
            f"{len(ocorrencias)} entrada(s) para `{nome}` ({onde}). É exigida exatamente "
            "uma — ausência ou ambiguidade no manifesto legado PARA a migração."
        )
    sha_legado, linha = ocorrencias[0]

    if not (sha_ancora == sha_head == sha_legado):
        raise SystemExit(
            f"[FAIL] conferência TRIPLA DIVERGENTE para `{path}` — migração ABORTADA.\n"
            f"  blob {ancora}:{path}\n"
            f"    = {sha_ancora}\n"
            f"  blob HEAD:{path}\n"
            f"    = {sha_head}\n"
            f"  {MANIFESTO_LEGADO} linha {linha}\n"
            f"    = {sha_legado}\n"
            "Não se migra byte cuja identidade não é provada: identidade em disputa é "
            "achado a reportar ao proprietário, não algo a resolver por conta (R2 §3)."
        )

    print(f"  [tripla] {nome}: blob {ancora[:12]} == blob HEAD == "
          f"{MANIFESTO_LEGADO} (linha {linha}) = {sha_ancora}")
    return dados_ancora, sha_ancora


# ------------------------------------------------------------- empacotamento
def empacota_diretorio(ancora, destino, tag, diretorio, pacote):
    """Monta o `.tar` do acervo-diretório (007) e devolve a entrada do manifesto."""
    paths = arquivos_do_acervo(ancora, diretorio)
    if not paths:
        raise SystemExit(f"[FAIL] acervo sem arquivo rastreado no commit-âncora "
                         f"{ancora[:12]}: {diretorio}")
    caminho_tar = os.path.join(destino, pacote)
    arquivos = {}
    with tarfile.open(caminho_tar, "w", format=tarfile.PAX_FORMAT) as tar:
        for path in paths:
            dados = blob(ancora, path)
            arquivos[path] = hashlib.sha256(dados).hexdigest()
            info = tarfile.TarInfo(path)  # path original: untar na raiz restaura o acervo
            info.size = len(dados)
            info.mtime = 0
            info.mode = 0o644
            info.uid = info.gid = 0
            info.uname = info.gname = ""
            tar.addfile(info, io.BytesIO(dados))
    entrada = {
        "release_tag": tag,
        "pacote": pacote,
        "sha256_pacote": sha256_arquivo(caminho_tar),
        "arquivos": arquivos,
    }
    print(f"  {tag}: {len(paths)} arquivo(s) -> {pacote} "
          f"({os.path.getsize(caminho_tar)} bytes)")
    return entrada


def empacota_arquivo(ancora, destino, tag, path, release, legado):
    """Acervo-arquivo (008/T3): o pacote É o blob — sem tar, sem renomeio.

    A conferência TRIPLA (O2) roda ANTES de a entrada existir; só bytes com
    identidade provada pelas três testemunhas viram pacote.
    """
    dados, sha = confere_tripla(ancora, path, legado)
    pacote = os.path.basename(path)
    caminho = os.path.join(destino, pacote)
    with open(caminho, "wb") as fh:
        fh.write(dados)
    # o hash publicado é lido de volta do arquivo escrito: prova que o byte que vira
    # asset é o mesmo byte conferido (a mesma leitura que a conferência pós-upload fará)
    sha_pacote = sha256_arquivo(caminho)
    if sha_pacote != sha:
        raise SystemExit(
            f"[FAIL] {tag}: pacote escrito em {caminho} diverge do blob conferido "
            f"(escrito {sha_pacote} ≠ blob {sha}) — E/S não confiável, migração ABORTADA."
        )
    entrada = {
        "tipo": "arquivo",
        "path": path,
        "release_tag": release,
        "pacote": pacote,
        "sha256_pacote": sha_pacote,
        "arquivos": {path: sha},
    }
    print(f"  {tag}: 1 arquivo -> {pacote} @ release {release} "
          f"({os.path.getsize(caminho)} bytes)")
    return entrada


def empacota(ancora, destino):
    """Devolve o bloco `acervos` do manifesto: os 4 diretórios, depois os 3 arquivos."""
    os.makedirs(destino, exist_ok=True)
    acervos = {}
    for tag, diretorio, pacote in ACERVOS:
        acervos[tag] = empacota_diretorio(ancora, destino, tag, diretorio, pacote)
    if ACERVOS_ARQUIVO:
        legado = le_manifest_legado()
        print(f"conferência TRIPLA (O2) contra {MANIFESTO_LEGADO} — "
              f"{len(ACERVOS_ARQUIVO)} acervo(s)-arquivo:")
        for tag, path, release in ACERVOS_ARQUIVO:
            acervos[tag] = empacota_arquivo(ancora, destino, tag, path, release, legado)
    return acervos


def build(ancora, destino):
    return {
        "_meta": {
            "descricao": DESCRICAO,
            "commit_ancora": ancora,
            "repo": REPO,
            "gerado_em": str(date.today()),
        },
        "acervos": empacota(ancora, destino),
    }


def opcao(argv, nome, padrao):
    if nome in argv:
        i = argv.index(nome)
        if i + 1 >= len(argv):
            raise SystemExit(f"[FAIL] {nome} exige um valor.")
        return argv[i + 1]
    return padrao


if __name__ == "__main__":
    argv = sys.argv[1:]
    destino = opcao(argv, "--pacotes", PACOTES_PADRAO)
    manifesto = opcao(argv, "--manifesto", MANIFESTO_PADRAO)
    consumidos = {"--pacotes", "--manifesto", destino, manifesto}
    posicionais = [a for a in argv if a not in consumidos]
    if len(posicionais) != 1:
        raise SystemExit("[FAIL] uso: gen_evidence_bridge.py <sha-ancora-40-hex> "
                         "[--pacotes DIR] [--manifesto PATH]")

    ancora = valida_ancora(posicionais[0])
    print(f"commit-âncora: {ancora}")
    print(f"pacotes em:    {destino}")
    reg = build(ancora, destino)

    texto = json.dumps(reg, ensure_ascii=False, indent=2, sort_keys=False) + "\n"
    os.makedirs(os.path.dirname(os.path.abspath(manifesto)), exist_ok=True)
    with open(manifesto, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(texto)

    total = sum(len(a["arquivos"]) for a in reg["acervos"].values())
    diretorios = sum(1 for a in reg["acervos"].values() if a.get("tipo", "diretorio") == "diretorio")
    arquivos = len(reg["acervos"]) - diretorios
    print(f"{manifesto}: {len(reg['acervos'])} acervo(s) "
          f"({diretorios} diretório · {arquivos} arquivo) · {total} arquivo(s) "
          f"do commit-âncora {ancora[:12]}")
