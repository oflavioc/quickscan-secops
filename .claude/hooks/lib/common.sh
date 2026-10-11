#!/usr/bin/env bash
# Biblioteca comum dos hooks (Onda 0 da Estrutura Agêntica).
#
# Contrato — herdado da referência, que elimina uma classe inteira de bugs:
#   1. O payload JSON do hook é lido do stdin UMA única vez, pelo hook,
#      para a variável PAYLOAD:   PAYLOAD="$(cat)"
#   2. Campos são consultados via payload_get '.a.b' — em Python (dependência
#      que o projeto já tem), nunca jq (incerto no Git Bash do Windows).
#   3. Matching de caminho: use match_path, que aceita / e \ (edge case win32).
#
# Hooks bloqueantes saem com exit 2; hooks informativos SEMPRE exit 0.

PYBIN=python3; command -v python3 >/dev/null 2>&1 || PYBIN=python

project_root() { git rev-parse --show-toplevel 2>/dev/null; }

# payload_get '.tool_input.file_path'  — lê de $PAYLOAD, nunca do stdin
payload_get() {
  PAYLOAD="${PAYLOAD:-}" "$PYBIN" - "$1" <<'PY'
import json, os, sys
try:
    d = json.loads(os.environ.get("PAYLOAD") or "{}")
except Exception:
    d = {}
cur = d
for part in sys.argv[1].lstrip(".").split("."):
    cur = cur.get(part) if isinstance(cur, dict) else None
    if cur is None:
        break
sys.stdout.write(cur if isinstance(cur, str) else ("" if cur is None else json.dumps(cur)))
PY
}

# match_path "<caminho>" "<padrão glob>"  — normaliza \ para / antes do case
match_path() {
  local p="${1//\\//}"
  case "$p" in $2) return 0;; *) return 1;; esac
}

# log_dispatch <nome-do-guarda>  — EA-83: evidência POSITIVA de invocação.
#
# A pergunta do EA-83 não é "o script bloqueia?" (isso o EA-37 mediu, por stdin)
# e sim "o harness INVOCA o grupo PreToolUse/matcher Bash?". Ausência de bloqueio
# não distingue "despachou e aprovou" de "não despachou" — medir o defeito com o
# instrumento que ele acusa é circular. Então o guarda registra a si mesmo: a
# linha existir é prova de despacho; não existir (com o caminho gravável) é prova
# do contrário.
#
# Desenho — três exigências, e como cada uma é atendida:
#   1. NÃO VIRA RUÍDO: uma linha por (guarda, sessão). A pergunta é sim/não, logo
#      a resolução certa é uma linha por sessão — não uma por chamada de Bash.
#      Teto duro de 400 linhas (rotaciona para as últimas 200) para o caso de a
#      deduplicação falhar: o arquivo não cresce sem limite nem assim.
#   2. FALHA DO REGISTRO NÃO SILENCIA O GUARDA: tudo roda em subshell, com stdout
#      e stderr em /dev/null e `|| true` no fim. Log impossível de escrever,
#      `date` ausente, disco cheio, raiz não gravável → o guarda segue guardando.
#      Nenhum `exit` escapa do subshell; nenhum `cd` vaza para o chamador.
#   3. CUSTO: zero processo novo (sem python, sem jq) — só `date` e `grep` sobre
#      um arquivo de poucas linhas. Roda em TODA chamada de Bash, por desenho:
#      registrar só em `git commit` tornaria "log vazio" ambíguo.
#
# O arquivo é IGNORADO pelo git (`*.log` no .gitignore) — R7 §3: verificação
# nunca escreve na árvore versionada.
#
# O QUE ISTO NÃO PROVA: que o `exit 2` do guarda chega ao usuário e aborta a
# chamada (despacho ≠ enforcement); que a decisão do guarda está correta; que o
# matcher cobre toda forma de chamada de Bash (só as que ocorreram). Corrida
# entre chamadas paralelas pode duplicar a linha — inofensivo: a prova é a
# existência, não a contagem.
log_dispatch() {
  (
    nome="${1:-desconhecido}"
    raiz="$(project_root)"
    [ -n "$raiz" ] || raiz="."
    log="$raiz/.claude/hooks/dispatch.log"
    sid="${CLAUDE_CODE_SESSION_ID:-}"
    [ -n "$sid" ] || sid="${CLAUDE_SESSION_ID:-}"
    [ -n "$sid" ] || sid="sem-sid-$(date -u +%Y-%m-%d)"
    chave="	$nome	$sid	"
    if [ -f "$log" ]; then
      grep -qF "$chave" "$log" && exit 0
      if [ "$(wc -l < "$log")" -gt 400 ]; then
        tail -n 200 "$log" > "$log.rot" && mv -f "$log.rot" "$log"
      fi
    fi
    printf '%s\t%s\t%s\t%s\t%s\n' \
      "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$nome" "$sid" "$0" "$PWD" >> "$log"
  ) >/dev/null 2>&1 || true
}
