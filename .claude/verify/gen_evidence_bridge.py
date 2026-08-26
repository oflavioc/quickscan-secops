#!/usr/bin/env python3
"""Gera o manifesto-ponte da migração de evidência (demanda 007 — R11 §2, R8).

Os quatro acervos legados (`docs_phase5/evidence_{p50,p51,p52,unset}`) saem do
índice e passam a viver como assets de releases nominais. O que preserva a
verificabilidade é ESTE manifesto: SHA-256 de cada blob do **commit-âncora** e
SHA-256 de cada pacote publicado. Os hashes saem dos BLOBS do commit-âncora —
à prova de CRLF e de plataforma, por construção (R2 §2).

Roda **uma única vez** na migração e NUNCA entra no `pipeline.yaml`: a
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
  --pacotes DIR  destino dos `.tar` (padrão: <tmp>/quickscan_evidence_bridge).
                 Diretório efêmero FORA da árvore rastreada: nenhum binário novo
                 entra no repo (R11 §1, R7 §3) — os pacotes existem para virar
                 asset de release, nunca commit.
  --manifesto P  destino do manifesto (padrão: .claude/verify/evidence_bridge.json).
                 Apontar para tmp permite prova de execução sem sujar a árvore.

Empacotamento: NÃO há requisito de tar determinístico/reproduzível (Observação 5
do parecer). O que o manifesto congela são os bytes do pacote efetivamente
publicado, reconferidos pós-upload; regeneração byte-idêntica não é oráculo de
nenhum EB-*. Os campos fixos do TarInfo abaixo reduzem ruído — não são promessa.
"""
import hashlib, io, json, os, re, subprocess, sys, tarfile, tempfile
from datetime import date

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

REPO = "oflavioc/quickscan-secops"
MANIFESTO_PADRAO = ".claude/verify/evidence_bridge.json"
PACOTES_PADRAO = os.path.join(tempfile.gettempdir(), "quickscan_evidence_bridge")
SHA40 = re.compile(r"^[0-9a-f]{40}$")

# (release_tag, diretório rastreado no commit-âncora, nome do asset)
ACERVOS = (
    ("evidence-p50", "docs_phase5/evidence_p50", "evidence_p50.tar"),
    ("evidence-p51", "docs_phase5/evidence_p51", "evidence_p51.tar"),
    ("evidence-p52", "docs_phase5/evidence_p52", "evidence_p52.tar"),
    ("evidence-unset", "docs_phase5/evidence_unset", "evidence_unset.tar"),
)

DESCRICAO = (
    "Manifesto-ponte da migração de evidência (demanda 007). Os acervos "
    "docs_phase5/evidence_{p50,p51,p52,unset} saíram do índice git e vivem como assets "
    "dos releases nominais deste repositório; a verificabilidade é preservada por este "
    "manifesto — SHA-256 de cada blob do commit-âncora e de cada pacote — e pelo stage "
    "evidence-bridge. Complementa os manifestos históricos de fase (classe legacy), não "
    "os substitui. Gerado por .claude/verify/gen_evidence_bridge.py; nunca editado à mão "
    "(R12) e alterado só com repin e trilha (R8)."
)


def git(*args):
    """Executa git e devolve stdout em bytes; erro de git é erro da ferramenta."""
    r = subprocess.run(["git", *args], capture_output=True)
    if r.returncode != 0:
        raise SystemExit(f"[FAIL] git {' '.join(args)}: "
                         f"{r.stderr.decode('utf-8', 'replace').strip()}")
    return r.stdout


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


def empacota(ancora, destino):
    """Monta um .tar por acervo em `destino` e devolve o bloco `acervos` do manifesto."""
    os.makedirs(destino, exist_ok=True)
    acervos = {}
    for tag, diretorio, pacote in ACERVOS:
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
        acervos[tag] = {
            "release_tag": tag,
            "pacote": pacote,
            "sha256_pacote": sha256_arquivo(caminho_tar),
            "arquivos": arquivos,
        }
        print(f"  {tag}: {len(paths)} arquivo(s) -> {pacote} "
              f"({os.path.getsize(caminho_tar)} bytes)")
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
    print(f"{manifesto}: {len(reg['acervos'])} acervo(s) · {total} arquivo(s) "
          f"do commit-âncora {ancora[:12]}")
