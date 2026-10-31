---
name: status-do-achado-contra-o-fonte
description: Antes de transcrever um achado devolvido por outra demanda, conferir o fonte/commits — relatório final mesclado pode listar como aberto o que a própria demanda corrigiu antes de fechar
metadata:
  type: feedback
---

Achado devolvido por uma demanda **não** entra no `.claude/BACKLOG.md` pelo texto
do relatório: antes de escrever o status, ler o **fonte de hoje** e o `git log` do
arquivo. Se a correção existir, o registro vira **histórico com a correção
citada** (`resolvido`, com commit e linhas), nunca pendência — e a divergência
com o relatório fica escrita na própria entrada, não silenciada.

**Why:** na 010 dois ids reservados como `aberto` no `relatorio-final.md` já
estavam fechados quando ele foi escrito: `EA-10` (as duas metades do recorte do
`P52-TGT4`) e `EA-11` (a guarda de não-vacuidade do `D010-INV7`, corrigida em
`cf6dd21`/T019, commit **ancestral** do que escreveu o relatório). Transcrever o
relatório teria criado pendência inexistente e mandado alguém desfazer correção
boa — o próprio gate avisa disso em comentário (`tests_p52_chromium.js:4061-4066`).

**How to apply:** para cada achado a registrar — `git log -S <símbolo> -- <arquivo>`
e leitura do trecho; `git merge-base --is-ancestor <fix> <commit do relatório>`
decide quem é mais novo. O limite continua: **eu não declaro PASS/FAIL** — a
entrada registra o fato citável em git/código e diz, nomeando, que a confirmação
por execução é do `qa-engineer`. Ver [[alocacao-ids-ea]].

**Extensão (2026-09-04, EA-35):** o mesmo cuidado vale para **linha citada**,
não só para status. A delegação do achado do `qa-engineer` (altura aparente
`scale²` no `P52-ICON2`) apontava `tests_p52_chromium.js:1131-1132` como o
sítio da duplicação de `scale`; a leitura do arquivo em HEAD mostrou que essas
duas linhas eram o laço de varredura alfa do canvas, e a duplicação real
estava em `:1123`/`:1138`/`:1146-1147`, com a mensagem impressa em `:1171`.
Cadeia `arquivo:linha → efeito` errada vira "palpite com aparência de fato"
(R12) exatamente como status errado vira pendência fantasma — **ler o arquivo
e recontar as linhas antes de transcrever qualquer citação recebida**, e
registrar a divergência na própria entrada em vez de silenciá-la ou corrigi-la
sem nota.

**Extensão (2026-10-10, EA-83):** vale também para **achado que o orquestrador
cita como argumento**, não só para o que se vai registrar. Ele descreveu "o
`EA-5` inteiro sobre o custo de um número que não distingue executei de não
executei" — o heading do `EA-5` diz exatamente isso, mas o status dele é
**`refutado`** (`BACKLOG.md:764`, corpo inteiro riscado). Citar como vivo o que
está refutado ressuscitaria o achado que a R2 §5 manda manter morto. A saída
foi citar a **família viva** (`EA-31`, `aberto`; `EA-39`, `resolvido`, que já se
declara "família do `EA-5`") e dizer do `EA-5` que *sobrevive a família, não o
achado*. Conferir o `**Status**` da linha canônica de todo id citado, inclusive
os que entram só como analogia.

**Terceira extensão (2026-10-16, `EA-88`):** vale também para o **rótulo
qualitativo** que outro agente dá a um estado, não só para o status de um id. O
orquestrador descreveu o campo de aceite da 021 como *"vazio por ~3 semanas"*;
lido no blob (`git show 7d5aef2:…/021-cobertura-do-apoio.json`), o campo estava
**ocupado por um não-veredito** — `"Pendente do proprietario. O produto entrega
o que a Fase 0 pediu…"`, escrito no fecho de 2026-09-26 (`45ecb33`). O número
(~3 semanas → 20 dias) reproduzia; a palavra, não. A diferença é o achado: campo
vazio seria ausência; campo com não-veredito **passa em tudo** e é mais grave.
Registrar a forma medida e dizer no relatório que o rótulo foi ajustado — não
parar (nenhum número falhou), não repetir o rótulo.
