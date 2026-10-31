---
name: trilha-e-ambiente-quickscan
description: Chromium do Playwright não existe, mas Chrome/Edge estáveis existem e CHROME_PATH é honrado (reprodução não-canônica); worktrees de feature podem não ter node_modules (NODE_PATH em forma C:/); heredoc longo e print cp1252 falham no Bash tool; Read truncado (cap) não registra o arquivo para Edit — pagine com offset/limit; grep -c $'\r' dentro de $(...) mente (devolve o nº de linhas) — use git ls-files --eol; python -c inline com não-ASCII/barra quebra — censo por hex em script de arquivo; /c/… não vale dentro do Python (use C:/…)
metadata:
  type: project
---

Dois fatos de ambiente que se repetem a cada fase e precisam ser **declarados**,
nunca presumidos nem inventados:

1. **Chromium ausente.** `playwright.chromium.executablePath()` resolve para o
   cache local do Playwright e o binário **não existe** (conferido por
   `fs.existsSync` em 2026-08-28); `CHROME_PATH` vazio. Reconfirmado em
   2026-08-30 na worktree `phase5-010`, e desta vez **pela via barata**:
   `python .claude/verify/env_doctor.py` já emite
   "[WARN] Chromium indisponível (sem CHROME_PATH e sem cache ms-playwright)" —
   é o env-doctor que nomeia o ambiente ausente, não uma sonda minha.
   *Descreva o caminho, nunca o cole:* em 2026-08-28 o `compliance-audit`
   reprovou o PR #24 com "caminho absoluto em governança" porque o literal
   dessa resolução — com nome de usuário — tinha ficado em
   `mutation-matrix.json`. Arquivo de governança versionado não aceita caminho
   de máquina; e o scanner (`compliance-audit.sh`) varre apenas
   `*.sh|*.py|*.json|*.yaml` sob `.claude/hooks` e `.claude/verify` — `*.md` é
   **ponto cego**, então aqui a disciplina é minha, não do gate.
   Logo `p52chromium` (55/0), `p50chromium` (27/0) e `playwright` (67/37) são
   **não executados, declarados com motivo** — o resultado vem do job `visual`
   no CI. `known_issues.json` está com `issues: []`: é agendamento, não dispensa.
   **Rota de reprodução NÃO-canônica (2026-09-04):** a máquina tem Chrome e
   Edge estáveis (`C:\Program Files\Google\Chrome\Application\chrome.exe`,
   `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`), e
   `tests_p52_chromium.js` (`resolveBrowser`), `tests_014_mutants_visual.js`
   (`temChromium`) e `check_mutation.have("chromium")` honram `CHROME_PATH`.
   Chrome 152 sob Playwright 1.62.1 reproduziu o veredito do CI (Chrome for
   Testing 151) — serve para DIAGNOSTICAR um não-KILL visual em minutos, em
   worktree efêmera; nunca substitui a contagem canônica. `NODE_PATH` em forma
   `C:/…/node_modules` (Node não resolve `/c/…`). Caso de uso:
   [[grade-implicita-neutraliza-mutante-de-coluna]].
2. **`node_modules` pode não existir na worktree de feature — confira, não
   presuma.** Em 2026-08-29 (T019 da 013) `phase5-013` estava sem instalação e
   `require("jsdom")` estourava `MODULE_NOT_FOUND`, deixando **toda** suíte
   `node tests_*.js` inexecutável ali; na E3 do mesmo dia a worktree **já
   tinha** `node_modules` (inclusive `playwright` e `@bramus/specificity`) e as
   suítes rodavam. O estado muda entre waves; `ls <worktree>/node_modules` antes
   de concluir qualquer coisa. Quando faltar, o provisionamento que funciona sem
   tocar a árvore é exportar
   `NODE_PATH=<…>/phase5-009/node_modules` (o `run()` dos harnesses herda
   `process.env`, então propaga ao filho). Confira antes que o `jsdom` da origem
   bate o `package-lock` do destino — em 2026-08-29 os dois pinavam `30.0.1`.
   Isso **não** é dispensa de declarar: um `MODULE_NOT_FOUND` lido às pressas
   vira "gate não pôde ser executado" e se confunde com ambiente de verdade
   ausente (foi o que aconteceu na primeira sonda de `M51-03`).
   **Receita confirmada em 2026-09-04 (fecho da 014):** worktree efêmera
   **no scratchpad** (`git worktree add --detach <scratchpad>/wt HEAD`), sem
   `node_modules`, com `export NODE_PATH=/c/Projetos/…/phase5-009/node_modules`
   no Git Bash — a forma `/c/…` funcionou (o MSYS converte a variável ao
   lançar o `node`; a forma `C:/…` continua sendo a segura fora do Git Bash).
   Ali rodaram a suíte `d014`, a campanha `d014` (25 s, 9/9) e
   `check_mutation.py` (recusa árvore suja — sabotagens vão por commit
   efêmero + `reset --hard`). Ao fim: `git worktree remove` + `prune`, e
   conferir `git worktree list` no clone.
3. **Desvio de trilha.** As definições dos agentes pinam `model: fable`/`max`;
   as execuções vêm ocorrendo em **Opus** por indisponibilidade de créditos —
   confirmado de novo em 2026-08-29 (T002 da demanda 013, worktree
   `phase5-013`), com o orquestrador pedindo explicitamente o registro. O desvio
   vai em `DEPENDÊNCIAS` de cada relatório; não vale a pena repetir a pergunta a
   cada wave. Em 2026-09-04 (diagnóstico do T081 da 014) a sessão rodou no
   modelo pinado (Fable 5.1) — o desvio não é permanente: confira o modelo da
   sessão antes de registrá-lo como desvio.

**Why:** R2 §1 e R10 §2 — SKIP silencioso é FAIL e PASS não executado é
alegação, não evidência. Já houve um incidente (E6) com 23 gates visuais
"passando" com exit 0 sem executar nada.

**How to apply:** ao fechar qualquer fase, separe o relatório em EXECUTADO
(com contagem) e NÃO EXECUTADO (com motivo nomeado). Nunca escreva a contagem
canônica de uma suíte Chromium a partir do registro — cite o registro como
*esperado*, não como *medido*. Ver [[armadilha-oraculo-de-texto-copymap]].

4. **Heredoc que não é heredoc.** Em 2026-09-04 o Bash tool desta máquina
   recusou dois scripts longos passados por `<<PYEOF` com aspas
   (`unexpected EOF while looking for matching quote`, apontando a primeira
   aspa simples do corpo) — o delimitador não foi reconhecido e o corpo foi
   parseado como shell. Heredocs curtos `<<EOF` funcionaram; e uma barra invertida DUPLA no
   corpo já chegou colapsada em barra simples (esta própria nota sofreu isso
   ao ser gravada). Regra prática:
   script multi-linha (python/node/sh) vai para o scratchpad pela ferramenta
   de escrita e roda por caminho; no shell, só one-liners com aspas simples
   e sem apóstrofo no texto. Custo evitado: uma rodada inteira perdida por
   quoting, não por conteúdo. Reincidiu em 2026-09-04 (Fase 4 da 016) na
   forma `VAR='…corpo com "0"*40 e KeyError('piso')…'`: a aspa simples do
   corpo fecha a string e o erro só aparece no fim (`line 45: unexpected
   EOF`). Mesma regra: bateria com stubs vai para um `.py` no scratchpad.
   Reincidiu em 2026-09-05 (EA-41) na forma mais traiçoeira: `python -c
   "…b.replace(b'\x00', b'\\x00')…"` E o heredoc `<<'PY'` com o mesmo corpo
   chegaram ao Python com a barra dupla colapsada — replacement igual ao
   pattern, `replace` no-op, **sem erro nenhum** (só o tamanho igual
   antes/depois denunciou; `git ls-files --eol` seguiu `i/-text`). Quando a
   barra invertida É o dado, monte-a sem escrevê-la (`bytes([92]) + b'x00'`)
   ou grave o script pela ferramenta de escrita — e assira o EFEITO (contagem
   antes/depois), nunca a ausência de erro. **A ferramenta de escrita também
   cai nisso, de outro jeito** (2026-09-05, campanha ea41): a sequência
   aspas-barra-u-0000-aspas num `.js` e num `.md` gravados por ela chegou ao
   disco como o BYTE 0x00 (a forma de barra DUPLA sobreviveu como seis
   caracteres) — o harness e a fixture nasceram com o mesmo defeito que o gate
   vigia, e só o censo de bytes (`count(bytes([0]))`) antes de rodar pegou.
   Regra: o byte proibido nasce de `String.fromCharCode(0)`/`bytes([0])`,
   nunca de escape no fonte; todo arquivo escrito pela ferramenta que cite um
   escape passa por contagem de NUL/CR antes de qualquer uso; e a correção se
   faz por `replace` de bytes montados, não reescrevendo o arquivo.
   **Medido com arquivo-sonda em 2026-09-06 (red da 017):** a ferramenta de
   escrita decodifica SÓ a forma barra-u-XXXX — e já no eco do próprio
   parâmetro (`E` + barra-u-0041 + `F` virou `EAF` antes de tocar o disco);
   `\n`, `\v`, `\t`, `\r` e `\\` chegam literais, byte a byte (censo
   `{0: 0, 13: 0, 92: n, 11: 0}` confirmou). Regra que funcionou de ponta a
   ponta: scripts sem NENHUMA barra invertida (`chr(92)`, `chr(10)`,
   `bytes([13])`), e o registro `.md` GERADO por script a partir dos
   artefatos medidos — a barra do dado (o `.claude\verify\…` do kill de M9)
   nasce no arquivo de saída do stage, nunca no parâmetro da ferramenta; censo
   de bytes antes de copiar qualquer coisa para a árvore.
5. **`print` ad hoc estoura em `cp1252`.** O stdout do `python -` neste Git
   Bash é cp1252: um `print` com "⊆", "≠" ou "·" lança `UnicodeEncodeError`
   e o script morre DEPOIS das asserções — em 2026-09-04 a validação dos
   registros da 016 passou e o traceback pareceu falha de validação. Regra:
   `export PYTHONIOENCODING=utf-8` antes de qualquer python ad hoc (os gates
   da casa já fazem `sys.stdout.reconfigure`; scripts de sessão não). E
   nunca encadear validação e `git commit` por newline — só por `&&`, senão
   o commit acontece mesmo com a validação morta (aconteceu; os asserts
   tinham passado, mas foi sorte, não desenho).
6. **Read truncado não registra o arquivo para o Edit.** Em 2026-09-04 (A1 da
   016) o Read inteiro de `tests_016_mutants.js` (859 linhas) e de `spec.md`
   (761) veio com "PARTIAL view … cap 25000" e os Edits seguintes falharam com
   "File has not been read yet" — três rodadas perdidas. Leitura por `sed`
   também não conta. O que registra é Read **paginado** (`offset`/`limit`)
   sobre as regiões que serão editadas; `check_mutation.py` (1370 linhas)
   entrou assim de primeira. Para anexar ao fim de um arquivo grande sem
   registrá-lo, `cat arquivo_do_scratchpad >> alvo` (foi o §10 do
   `prova-de-carga.md`) — e conferir `grep -c $'\r'` depois.
7. **`grep -c $'\r'` mente dentro de `$(…)`.** Em 2026-09-05, logo após um
   splice byte a byte em `tests_p50_core.js`, `echo "… $(grep -c $'\r' arquivo)"`
   devolveu **4008 — o número de linhas** — num arquivo 100% LF (o próprio
   splice tinha asserido `b"\r\n" not in src` antes de gravar). O mesmo grep
   fora do `$(…)`, na linha seguinte, devolveu 0. O instrumento definitivo é
   `git ls-files --eol <arquivo>` (espera-se `i/lf w/lf`) ou Python
   `d.count(b'\r')`; isto corrige a recomendação do item 6. Regra: um número
   que contradiz uma asserção já executada é suspeito do instrumento antes de
   ser suspeito do arquivo — meça com um segundo instrumento antes de reverter
   qualquer coisa. Ver [[repin-inline-tres-confirmacoes]].
8. **`.claude/BACKLOG.md` é "binário" para o `grep` e para o `git`.** Em
   2026-09-05 `grep -n "EA-40" .claude/BACKLOG.md` devolveu "Binary file
   matches" e quebrou o `cut -d:` seguinte: a linha 2029 (commit `5729961`,
   EA-34) carrega dois bytes NUL literais dentro de código inline (`"\x00"`
   gravado como byte). Consequências: `grep -a` sempre nesse arquivo;
   `git ls-files --eol` mostra `i/-text w/-text` (a normalização
   `text=auto eol=lf` da R7 está desligada para ele — candidato a achado,
   reportado em DEPENDÊNCIAS do EA-40, não consertado de passagem); o
   `git diff` continua textual (heurística dos 8000 primeiros bytes). E no
   Git Bash `git show origin/develop:.claude/BACKLOG.md` sofre conversão de
   caminho do MSYS ("origin\develop;…") — prefixe `MSYS_NO_PATHCONV=1`.
   Ver [[doc-only-em-suite-pinada]].
9. **`python -c` inline com não-ASCII ou barra invertida quebra neste Bash
   tool; `/c/…` não é caminho dentro do Python.** Em 2026-09-09 (iteração 3
   da 017) um `python -c "… '✓°'.encode() … b'\\\\' …"` chegou ao Python com
   os caracteres trocados por `�` e a string desfechada (`SyntaxError:
   unterminated string literal`); em seguida `open('/c/Users/…')` deu
   `FileNotFoundError` — o MSYS converte caminhos em ARGUMENTOS de linha de
   comando, não dentro de strings Python. Regra: censo de bytes por **hex**
   num script de arquivo (`bytes.fromhex('e29c93c2b0') in b` para `✓°`,
   `bytes.fromhex('e28094')` para `—`, `bytes([92])` para a barra, `bytes([13])`
   para CR) e caminhos `C:/…` dentro do Python. Confirmado no mesmo dia: a
   ferramenta de escrita preservou `✓°`/`—` em UTF-8 e LF num `.md` de 259
   linhas (conferido por hex antes de anexar à árvore); só a barra invertida
   segue sendo o problema do item 4. Ver [[posicao-do-conteudo-minimo]].
