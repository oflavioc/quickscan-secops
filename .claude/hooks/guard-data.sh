#!/usr/bin/env bash
# Hook PreToolUse (matcher: Bash) — BLOQUEANTE (exit 2) em `git commit`.
#
# A proibição de commitar dado sensível deixa de ser prosa (E10): sessões
# reais, PDFs novos, segredos e binários grandes são barrados NO COMMIT,
# inclusive em .claude/** (a referência já viu senha versionada em SKILL.md).
set -uo pipefail
. "$(dirname "$0")/lib/common.sh"

# EA-83 — evidência positiva de invocação, ANTES de qualquer saída
# antecipada: o log existir prova que o harness despachou este grupo.
# Nunca bloqueia nem silencia o guarda (ver log_dispatch em lib/common.sh).
log_dispatch "guard-data"

PAYLOAD="$(cat)"
CMD="$(payload_get '.tool_input.command')"
# Pré-filtro BARATO (evita o processo de análise na esmagadora maioria das
# chamadas). Mais largo que o antigo `*"git commit"*` de propósito: aquele
# deixava `git -C <dir> commit -am …` passar inteiro — a substring não existe
# ali. Quem decide de verdade é a tokenização abaixo, não este `case`.
case "$CMD" in *git*commit*) ;; *) exit 0;; esac

# EA-82 — formas de `git commit` que NÃO passam pelo índice são recusadas.
#
# O defeito era de ordem de execução, não de desenho: `PreToolUse` roda ANTES do
# comando, e `git commit -a`/`-am` estagia no momento do commit. Logo o índice
# está vazio quando este hook mede, ele sai no `[ -z "$STAGED" ]` abaixo, e as
# quatro checagens (sessão real, PDF novo, segredo, binário > 200 KB) não rodam
# sobre arquivo algum. Medido: mesmo arquivo, mesmo hook, mesmo repositório —
# estagiado → exit 2; via `-am` → exit 0 silencioso, e o commit carrega o arquivo.
#
# Rota escolhida com medição, não por gosto: RECUSAR. Os motivos:
#   1. um hook que roda antes do comando não tem como inspecionar conteúdo que o
#      comando ainda vai estagiar — ler a árvore em vez do índice ampliaria o que
#      o guarda lê e abriria falso negativo novo (deleções, renomeações, fonte do
#      conteúdo divergindo de `:0:<f>`);
#   2. `commit -a` É staging de escopo amplo pela porta dos fundos, e o guarda
#      irmão (guard-add.sh, EA-37) já barra `git add -A`/`.`/`--all`
#      INCONDICIONALMENTE. Inspecionar `-a` seria o mesmo repositório proibindo
#      uma porta e endossando a outra;
#   3. custo medido: `git grep` na árvore inteira não acha NENHUM script ou
#      pipeline usando `git commit -a`/`--all`. O caminho nominal
#      (`git add <p1> <p2> && git commit -m …`) cobre 100% do caso legítimo e é o
#      que a R11 §3 já manda fazer.
#
# Auto-exclusão nominal (R10 §10): a detecção tokeniza com shlex e remove corpo
# de heredoc ANTES de analisar — prosa, mensagem de commit e documentação que
# CITAM `git commit -am` não acionam o guarda (este arquivo e o BACKLOG citam).
# Clusters de flag curta param na primeira letra que consome valor, para
# `-mabc`/`-Sabc` não lerem como `-a`.
#
# Residual medido e declarado (NÃO coberto): pathspec posicional sem `--`
# (`git commit arquivo -m x`; e `git commit -ma x`, que o git lê como `-m a` mais
# o pathspec `x`), além de `-i`/`-o` com caminho posicional. Mesma causa raiz,
# input diferente; distinguir pathspec de valor de opção exigiria a tabela
# completa de opções do git, e errar ali é falso POSITIVO em commit legítimo.
#
# A análise devolve DUAS coisas, e a primeira importa tanto quanto a segunda:
#   linha 1  — `commit` ou `nao-commit`: há mesmo um `git … commit` no comando?
#              Isto substitui o antigo pré-filtro por substring como decisor, e
#              corta um falso POSITIVO antigo: prosa que só MENCIONA "git commit"
#              não faz mais o guarda inspecionar o índice.
#   linhas 2+ — as formas recusadas.
# Tokenização impossível (aspas que não fecham) devolve `commit` sem achado: o
# comportamento conservador de hoje é preservado — inspeciona o índice, não
# recusa às cegas.
ANALISE=$(CMD="$CMD" "$PYBIN" - <<'PY'
import os, re, shlex

cmd = os.environ.get("CMD", "")

# 1) remove corpo de heredocs — texto ali é dado, não comando (mesma técnica do
#    guard-add.sh; evita autoacusação por prosa escrita via heredoc).
HEREDOC = re.compile(r"<<-?\s*(['\"]?)(\w+)\1")
linhas = cmd.split("\n")
saida, i, n = [], 0, len(linhas)
while i < n:
    m = HEREDOC.search(linhas[i])
    if m:
        delim = m.group(2)
        saida.append(linhas[i][:m.start()])
        i += 1
        while i < n and linhas[i].rstrip() != delim:
            i += 1
        i += 1
        continue
    saida.append(linhas[i])
    i += 1

try:
    tokens = shlex.split("\n".join(saida), posix=True)
except ValueError:
    # aspas não fecham: não há como tokenizar com segurança. Não recusa às
    # cegas, mas também não libera — segue para a inspeção do índice.
    print("commit")
    raise SystemExit

statements, atual = [], []
for t in tokens:
    if t in ("&&", "||", ";", "|"):
        statements.append(atual)
        atual = []
    else:
        atual.append(t)
statements.append(atual)

CONSOME_VALOR = set("mFCctSu")   # -m msg, -F arq, -C/-c commit, -t arq, -S[id], -u[modo]


def tem_a(tok):
    """'-a' presente num cluster de flags curtas. Para na primeira letra que
    consome valor: em '-mabc' e '-Sabc' o 'a' é VALOR, não a flag -a."""
    if not tok.startswith("-") or tok.startswith("--"):
        return False
    for letra in tok[1:]:
        if letra == "a":
            return True
        if letra in CONSOME_VALOR:
            return False
    return False


GLOBAIS_COM_VALOR = {"-C", "-c", "--git-dir", "--work-tree", "--namespace",
                     "--exec-path", "--super-prefix", "--config-env"}


def subcomando(resto):
    """Subcomando real, pela gramática do git: o primeiro token que não é opção
    global nem valor de opção global. Sem isto, `git log --grep commit` leria
    como commit (o 'commit' ali é VALOR de --grep) — falso positivo."""
    i = 0
    while i < len(resto):
        t = resto[i]
        if t in GLOBAIS_COM_VALOR:
            i += 2
            continue
        if t.startswith("-"):
            i += 1
            continue
        return t, resto[i + 1:]
    return None, []


def motivo(args):
    for a in args:
        if a == "--all" or tem_a(a):
            return "-a/--all (estagia no momento do commit)"
        if a == "--":
            return "pathspec após '--' (commita a árvore, ignorando o índice)"
    return None


achados, tem_commit = [], False
for s in statements:
    for idx, t in enumerate(s):
        if t == "git" or t.endswith("/git"):
            sub, args = subcomando(s[idx + 1:])
            if sub == "commit":
                tem_commit = True
                m = motivo(args)
                if m:
                    achados.append("%s\t%s" % (m, " ".join(s)))
            break
print("commit" if tem_commit else "nao-commit")
print("\n".join(achados))
PY
)

case "$(printf '%s\n' "$ANALISE" | head -1)" in
  commit) ;;
  *) exit 0;;
esac
BYPASS=$(printf '%s\n' "$ANALISE" | tail -n +2)

if [ -n "$BYPASS" ]; then
  {
    echo "guard-data: commit RECUSADO — forma que não passa pelo índice (EA-82)."
    printf '%s\n' "$BYPASS" | sed 's/^/  · /'
    echo "Motivo: este hook é PreToolUse — roda ANTES do comando. Em '-a'/'-am' (e"
    echo "em pathspec após '--') o conteúdo é estagiado pelo próprio commit, depois"
    echo "do hook: o índice está VAZIO na hora da medição e as checagens da R11"
    echo "(sessão real, PDF novo, segredo, binário > 200 KB) não rodam sobre nada."
    echo "Faça staging NOMINAL, que é o que a R11 §3 e o EA-37 já pedem:"
    echo "  git add <caminho1> <caminho2> …  &&  git commit -m \"…\""
  } >&2
  exit 2
fi

cd "$(project_root)" 2>/dev/null || exit 0
STAGED=$(git diff --cached --name-only 2>/dev/null) || exit 0
[ -z "$STAGED" ] && exit 0

FALHAS=$(STAGED="$STAGED" "$PYBIN" - <<'PY'
import os, re, subprocess, sys
staged = [s for s in os.environ["STAGED"].splitlines() if s]
falhas = []
SECRET = re.compile(r"eyJ[A-Za-z0-9_-]{15,}\.|sk-[A-Za-z0-9]{20,}|xox[baprs]-|-----BEGIN [A-Z ]*PRIVATE KEY-----|sshpass -p")

def in_head(f):
    return subprocess.run(["git", "cat-file", "-e", f"HEAD:{f}"], capture_output=True).returncode == 0

for f in staged:
    low = f.lower().replace("\\", "/")
    # 1 · sessão real (exemplos sintéticos publicados são permitidos)
    if low.endswith(".session.json") and not low.startswith("synthetic_session_examples/"):
        falhas.append(f"sessão real: {f}")
    # 2 · PDF novo (dado de cliente potencial) — evidência entra só por promoção (R11)
    if low.endswith(".pdf") and not in_head(f):
        falhas.append(f"PDF novo: {f} (evidência entra por promoção curada, nunca por commit direto)")
    # 3 · segredos em texto
    blob = subprocess.run(["git", "show", f":0:{f}"], capture_output=True).stdout
    if b"\x00" not in blob[:8000] and SECRET.search(blob.decode("utf-8", errors="ignore")):
        falhas.append(f"padrão de segredo em: {f}")
    # 4 · binário novo > 200 KB
    if b"\x00" in blob[:8000] and len(blob) > 200 * 1024 and not in_head(f):
        falhas.append(f"binário novo de {len(blob)//1024} KB: {f} (>200 KB — use o evidence store, R11)")
print("\n".join(falhas))
PY
)

[ -z "$FALHAS" ] && exit 0
{
  echo "guard-data: commit BLOQUEADO —"
  printf '%s\n' "$FALHAS" | sed 's/^/  · /'
  echo "Regra: dados de assessments vivem fora deste clone; evidência entra por promoção (R11)."
} >&2
exit 2
