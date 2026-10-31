---
name: escape-de-byte-em-prosa-nao-o-byte
description: Ao citar em prosa um separador de string do source (ex. "\x00"), escrever o escape de duas letras — nunca deixar o editor gravar o byte literal; conferir com git ls-files --eol depois de tocar arquivo pinado
metadata:
  type: feedback
---

Prosa que cita um literal de string do código-fonte contendo um byte de
controle (`"\x00"`, separador interno de chave em `regra_morta.js:399/:405`)
precisa terminar com o **escape de duas letras** no texto — nunca com o byte
em si. Um editor/terminal pode gravar o byte real sem aviso visual nenhum: a
linha parece idêntica na tela e só se distingue por hexdump.

**Why:** o `EA-34` (commit `5729961`) gravou dois bytes `0x00` literais em
`.claude/BACKLOG.md` ao citar `ctxChave(d) + "\x00" + d.seletor + "\x00" +
d.prop`. Efeito: `git ls-files --eol` classifica o arquivo inteiro como
**binário** (`-text`), o que **desliga** a normalização `eol=lf` do
`.gitattributes` para ele — exatamente o vetor do achado E9 (CRLF não
normalizado → hashes falsos), agora dormente dentro de um arquivo **pinado**.
Efeito colateral: `grep` sem `-a` sobre o arquivo passa a responder "Binary
file matches" e não imprime nada — silencioso, custou dias a vários agentes
(`EA-41`).

**How to apply:** depois de escrever/editar prosa que contém um escape técnico
tipo `\x00`, `\n` literal-como-texto, ou qualquer sequência de controle citada
do source — rodar `git ls-files --eol <arquivo>` no arquivo tocado e conferir
que continua `text=auto eol=lf` (não `-text`). Se o arquivo é pinado
(`pins.json`), o custo do erro é maior: o registry de identidade passa a
vigiar um arquivo com normalização desligada sem ninguém perceber. Ver
[[status-do-achado-contra-o-fonte]] (mesma disciplina de conferir bytes, não
supor).
