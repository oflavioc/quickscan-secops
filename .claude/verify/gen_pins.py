#!/usr/bin/env python3
"""Gera/atualiza o registry único de pins (Onda 0 — R8 da Estrutura Agêntica).

Fonte ÚNICA de identidade dos artefatos versionados: os hashes saem daqui,
nunca de literais espalhados (achado E8: pins duplicados em 6+ lugares, com
repin manual que já falhou duas vezes). Os hashes são computados dos BLOBS
de HEAD — à prova de CRLF e de plataforma, por construção.

Uso:
  python .claude/verify/gen_pins.py            # grava .claude/verify/pins.json
  python .claude/verify/gen_pins.py --stdout   # imprime sem gravar

Exclusões (registradas no próprio registry):
  docs_phase5/**   relatórios e evidência de fase — alta rotatividade; os
                   manifestos históricos de fase seguem sendo a trilha deles
  *.zip            evidência binária (sai do git na migração da Onda 4/R11)
  .claude/project-memory/**
                   estado de processo — muda a cada fase por desenho; validação
                   é do stage state, trilha é o git (piná-lo = baseline vermelho
                   recorrente)
  pins.json        o registry não pina a si mesmo
"""
import hashlib, json, subprocess, sys
from datetime import date

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

EXCLUDE_PREFIXES = ("docs_phase5/", ".claude/project-memory/")
EXCLUDE_SUFFIXES = (".zip",)
SELF = ".claude/verify/pins.json"

def head_sha():
    return subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()

def tracked():
    out = subprocess.run(["git", "ls-files"], capture_output=True, text=True).stdout
    return [f for f in out.splitlines() if f]

def blob(path):
    r = subprocess.run(["git", "show", f"HEAD:{path}"], capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(f"blob ausente em HEAD: {path}")
    return r.stdout

def build():
    files = {}
    for f in sorted(tracked()):
        if f == SELF or f.startswith(EXCLUDE_PREFIXES) or f.endswith(EXCLUDE_SUFFIXES):
            continue
        files[f] = hashlib.sha256(blob(f)).hexdigest()
    return {
        "_meta": {
            "descricao": "Registry único de pins — fonte de identidade dos artefatos (R8). "
                         "Hashes = SHA-256 dos blobs de HEAD. Alterar arquivo pinado exige "
                         "regenerar este registry no MESMO PR, com motivo no commit.",
            "gerado_de_head": head_sha(),
            "gerado_em": str(date.today()),
            "exclusoes": ["docs_phase5/**",
                          ".claude/project-memory/** (estado de processo — muda por fase; validado pelo stage state, não por pin)",
                          "*.zip", SELF],
        },
        "declared": {
            "m41_payload_sha256": "9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b",
            "baseline_core_zip_sha256": "625079c462be7d44ffd69b1cd85f256382322bd0555ae4b548f21bf30ee5b89d",
        },
        "files": files,
    }

if __name__ == "__main__":
    # [guarda 2026-08-25] gen_pins lê blobs de HEAD: rodar com mudanças pendentes
    # em arquivos pináveis gera pins do estado ANTERIOR — erro cometido 2x (demanda
    # 003 e sync v3.2.2, ambos pegos pelo stage baseline). Pré-condição mecânica:
    dirty = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True).stdout
    pendentes = [l for l in dirty.splitlines()
                 if l[3:].strip() and not l[3:].startswith((".claude/verify/pins.json",))]
    if pendentes and "--force" not in sys.argv:
        print("[FAIL] gen_pins exige árvore limpa (HEAD é a fonte dos blobs). Pendências:")
        for l in pendentes[:5]:
            print("   ", l)
        print("Commite o conteúdo PRIMEIRO; pins vêm em commit próprio na sequência.")
        sys.exit(1)
    reg = build()
    text = json.dumps(reg, ensure_ascii=False, indent=2, sort_keys=False) + "\n"
    if "--stdout" in sys.argv:
        sys.stdout.write(text)
    else:
        with open(SELF, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(text)
        print(f"pins.json: {len(reg['files'])} arquivos pinados de HEAD {reg['_meta']['gerado_de_head'][:12]}")
