---
name: precedente-de-refutado-corpo-inteiro-riscado
description: como fechar um achado do BACKLOG.md como `refutado` quando não há precedente no arquivo — e, no item 5, a disciplina de blank line de QUALQUER inserção de bloco por script
metadata:
  type: feedback
---

Quando `.claude/BACKLOG.md` ainda não tem nenhuma entrada `refutado` (só
`resolvido`/`aberto`/`transferido`), o rito do cabeçalho do arquivo diz
"título e corpo riscados, linha de status limpa" — mas não mostra a forma. A
forma que resistiu ao `compliance-audit.sh` (parser em `RE_HEAD`/`RE_CAND`/
`RE_CANON`):

1. **Heading**: `## ~~EA-N — <título original>~~` — o `~~` logo após `## `
   ainda casa `RE_HEAD` (`^## (?:~~)?(EA-\d+[a-z]?)\b`), então o parser
   continua enxergando o bloco.
2. **Linha de status**: fica **limpa**, sem `~~`, valor trocado para
   `refutado` — é a única linha que NUNCA leva risco, mesmo estando entre
   texto riscado dos dois lados.
3. **Corpo original inteiro**: cada linha não-vazia entre `~~...~~`,
   **individualmente** (não um único `~~` abraçando o parágrafo inteiro —
   isso quebra com bullets/subtítulos no meio). Linhas em branco continuam
   em branco. Precedente: é assim que `EA-1` já riscava um parágrafo antes
   deste PR (`.claude/BACKLOG.md`, achado `EA-1`, seção "Refutado no
   fix-finding").
4. **Depois do corpo riscado**: uma seção NOVA, sem risco, tipo
   `### Refutado no fix-finding (<data>), riscado e mantido (R2 §5)`, com a
   medição que sustenta o fechamento — cita gate/execução, nunca "deve
   passar".
5. **Blank line entre o fim do bloco e o próximo heading** — fácil de
   perder ao fazer a transformação por script: o corpo original terminava
   com uma blank line antes do próximo `## `; se a substituição reconstrói
   só `[heading, "", *corpo, "", *epílogo]` sem reservar essa blank final,
   o próximo heading cola direto na última linha do epílogo e ainda assim
   PASSA no parser (`RE_HEAD` só olha o início da linha) — o bug só aparece
   na leitura visual, não no `compliance-audit`. Sempre conferir com
   `grep -n "^## " arquivo` + olhar a linha anterior a cada heading depois
   de uma transformação em lote.

**Por quê**: `.claude/rules/documentation.md`/`evidence.md` R2 §5 exige que
refutação permaneça riscada, nunca apagada; o parser do `compliance-audit.sh`
(seção `backlog`) só aceita a linha de status na forma canônica exata — texto
riscado em volta dela não quebra o match, mas a própria linha de status
riscada quebraria (não bateria `RE_CANON`).

**Como aplicar**: primeira vez que fechar um achado como `refutado` neste
repositório (ou em repo irmão com o mesmo `compliance-audit.sh`), usar esta
forma; depois de existir precedente real no arquivo, copiar dele em vez de
recriar do zero. Ver também [[feedback_status-do-achado-contra-o-fonte]].

**Generalização medida em 2026-10-16 (`EA-88` + nota da 021):** o item 5 não é
específico de `refutado` — vale para **qualquer inserção de bloco por script**,
em `BACKLOG.md` ou em artefato de demanda. Inserir `lines[:n] + nota +
lines[n:]` produziu os dois defeitos de uma vez: **blank duplo** onde a âncora
já era linha vazia e **heading colado** na última linha da nota. Nenhum dos dois
quebra o `compliance-audit` (`RE_HEAD` só olha o início da linha) — só aparecem
na leitura. Receita que fechou: depois de inserir, um passe que (a) colapsa
blank duplo e (b) garante blank antes de toda linha iniciada por `#`, seguido de
`git diff --numstat` — se o passe tiver tocado texto preexistente, o contador de
**linhas removidas deixa de ser 0** e o acréscimo deixa de ser aditivo. Conferir
também os casos **preexistentes** antes de atribuí-los a si: `EA-40`
(`BACKLOG.md:3852`) e `EA-66` já estavam com heading colado em `HEAD`.
