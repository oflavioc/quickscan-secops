---
name: retomada-apos-interrupcao
description: Sessão interrompida (limite semanal) com arquivos escritos e nada commitado — na retomada o orquestrador exige reconferir identidades por hash-object e REEXECUTAR as suítes antes de commitar; as contagens do dia entram no registro ao lado das antigas
metadata:
  type: feedback
---

Regra: ao retomar uma delegação interrompida com arquivos no disco e nenhum commit, não
confie na memória da sessão: (1) `git status --porcelain` + `git log -1` (HEAD mudou?);
(2) `git hash-object` de cada arquivo deixado, comparado com o que o próprio registro
(red-NNN.md) anotou; (3) censo CR/NUL + `node --check`; (4) `git ls-remote origin develop`
(a base moveu? então rebase é tarefa alheia ANTES do red — PARADA, não sua); (5) reexecute
as suítes e registre as contagens DO DIA ao lado das antigas, com `diff` das linhas de
veredito; só então commit.

**Why:** a W1 da 025 foi interrompida em 2026-10-27 depois de medir e escrever suíte, m48
reancorada e red-025.md, sem commit; retomada em 2026-10-30 por pedido explícito do
orquestrador ("não confie na memória da sessão interrompida — reexecute"). Os hashes
conferiram (`aa12a539`, `63025a3c`), a `develop` não tinha movido, e as duas suítes
reproduziram os vereditos byte a byte (`1 PASS · 15 FAIL de 16`; `94 PASS · 3 FAIL de 97`).
Teria sido fácil — e errado — commitar os números de três dias antes como se fossem de hoje.

**How to apply:** o registro ganha um bloco "Retomada em <data>" no cabeçalho e uma linha
"Reexecução em <data>" em cada seção de suíte; a mensagem de commit cita as duas datas.
Ferramenta de edição: numa sessão nova o Edit exige Read prévio do arquivo — pagine com
offset/limit nas regiões a editar, não leia o arquivo inteiro.
