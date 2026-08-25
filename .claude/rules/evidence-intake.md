# R11 — Entrada de evidência

Severidade: **bloqueante** (hook `guard-data`).

O repositório carrega ~103 MB de evidência binária herdada (E10) — o legado fica
onde está até a migração desenhada da Onda 4 (os manifestos de fase pinam cada
PNG; sair do git sem quebrar a verificabilidade exige projeto, não `rm`).
Para evidência NOVA, a regra é:

1. **Toda geração de evidência escreve em diretório ignorado** (`visual_evidence/`,
   `print_evidence/`, tmp) — nunca em diretório rastreado como efeito colateral de
   rodar uma ferramenta.
2. **A entrada no repositório é um passo explícito de promoção**: `qa-engineer`
   aprova o conteúdo → `build-engineer` publica no evidence store → `doc-writer`
   registra o manifesto de hashes. O repo versiona o manifesto, não os bytes.
3. **`guard-data` bloqueia no commit**: `*.session.json` real (sintéticos publicados
   são exceção nominal), **PDF novo**, padrão de segredo, **binário novo >200 KB** —
   inclusive dentro de `.claude/**`.
4. **Dados de assessments vivem fora deste clone** (`D:\QuickscanData\clients`).
   Nome de parte, CPF, número de processo, teor de documento de cliente: nunca em
   arquivo versionado, memória de agente, log ou mensagem.
5. Se um segredo aparecer em texto no chat: avisar que ficou no transcript e
   sugerir rotação.
