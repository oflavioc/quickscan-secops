---
name: byte-de-controle-em-fonte-versionado
description: Separador não-imprimível que eu escrevo em código (NUL, U+0001) roda perfeitamente e faz o git tratar o arquivo como binário — defeito meu de R7
metadata:
  type: project
---

Duas vezes na mesma sessão (014, wave 4) escrevi um caractere de controle
**literal** dentro de string de código — `"\x00"` como separador de chave e
`"\u0001"` como marca de reserva. O código **funciona**: NUL é caractere válido
em string JS e até é um separador melhor que espaço. O estrago é fora do
runtime: `grep` responde *"Binary file matches"*, o git passa a tratar o arquivo
como binário, o diff some, e a normalização LF de `.gitattributes` deixa de se
aplicar.

**Why:** é defeito de determinismo (R7), e é meu — arquivo versionado que o git
não sabe diffar quebra revisão, pins e trilha. Não aparece em nenhum teste
verde.

**How to apply:** separador não-imprimível se escreve como **escape**
(`"\u0000"`) ou por construção (`String.fromCharCode(1)`), nunca como byte
literal. E antes de dar por pronto qualquer arquivo que eu tenha escrito,
conferir os bytes, não só o comportamento:
`[b for b in open(f,'rb').read() if b<9 or (10<b<32 and b!=13)]` mais contagem
de CRLF. `grep` acusando "Binary file matches" num `.js` é o sintoma barato.
