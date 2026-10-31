---
name: cutover-conferir-anterior-contra-docker-ps
description: O comando de cutover impresso por preparar_release.py é pouco confiável — o "anterior" vem de sorted() lexicográfico (v3.2.9 > v3.2.12); conferir sempre contra docker ps, e parar o antigo antes do up (EA-121)
metadata:
  type: project
---

`preparar_release.py` escolhe o "release anterior" por `sorted()` de strings `vN.N.N`:
lexicográfico, logo `v3.2.9` > `v3.2.12` > `v3.2.11` > `v3.2.10`. A partir da v3.2.11 o
cabeçalho do `compose.yaml` ("herdada de v3.2.9") e o `docker stop quickscan-v329`
impresso estão errados. Não afetou o artefato porque `default.conf` e o digest da
imagem são idênticos desde a v3.2.9. Registrado como `EA-121` (2026-10-31).

**How to apply:**
- Conferir o container no ar com `docker ps` antes de escrever o comando de cutover no
  registro de deploy; o nome é `quickscan-v<versão sem pontos>`.
- O container novo disputa a porta 1337: o `docker stop` do antigo vem **antes** do `up`.
- O compose anterior foi subido do Windows; no WSL a pasta é `/mnt/c/...`, não o
  workspace de outro drive.
- Heredoc do Bash tool com texto PT-BR longo pode falhar: usar Write e só então `sha256sum`.

(Nota parqueada em 2026-10-31 pelo orquestrador; materializada no mesmo dia.)
