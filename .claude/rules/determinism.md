# R7 — Determinismo por construção

Severidade: **bloqueante** (stages `build`/`icons-check` + `.gitattributes`).

"Determinismo comprovado apenas em Linux" era determinismo por plataforma — frágil
(E9: 56/74 hashes falsos no Windows; build inutilizável; geradores corrompendo a
árvore em CRLF). Desde a Onda 0, determinismo é **por construção**:

1. **LF em todo texto** — `.gitattributes` com `* text=auto eol=lf`; SVGs `-text`
   (hash pinado byte a byte, incluindo o CRLF interno do FortiNDR.svg).
2. **Geradores escrevem com `newline="\n"` e stdout UTF-8 explícitos** — mesmo
   byte em qualquer SO. Prova viva: build `fb906462…` idêntico em Windows, Linux
   e no blob commitado.
3. **Verificação nunca escreve na árvore**: o stage `build` constrói em diretório
   efêmero e compara; `generate --check` verifica sem gravar; todo stage prova
   `git status` inalterado ao final. Gerador testado escreve em tmp, nunca sobre
   arquivo versionado.
4. **Dependência de ambiente é declarada, nunca implícita** — o `env-doctor`
   (stage 0) valida node/python/git/Chromium ANTES das suítes; ausência vira WARN
   nomeado ou FAIL, jamais SKIP silencioso (E6). Oráculo que invoca processo usa
   caminhos **entre aspas** (a família P2.1-16/I11/S64 falhava em path com espaço).
5. **A plataforma canônica é o CI Linux** (`.github/workflows/verify.yml`) — prova
   contínua em cada PR; o desenvolvimento local em Windows tem paridade real.
6. **Aleatoriedade e relógio não entram em artefato verificado** — saída de builder
   e de gerador é função pura dos fontes.
