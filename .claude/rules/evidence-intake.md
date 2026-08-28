# R11 — Entrada de evidência

Severidade: **bloqueante** (hook `guard-data`).

O repositório carregava ~103 MB de evidência binária herdada (E10) — a migração
desenhada na Onda 4 foi **executada pela demanda 007** (PR #20, mesclado 2026-08-25)
(`specs/007-migracao-evidencia/`): os 4 acervos (`evidence_p50`, `evidence_p51`,
`evidence_p52`, `evidence_unset`, 406 arquivos) saíram do índice para Releases
nominais em `oflavioc/quickscan-secops`, com verificabilidade preservada por
manifesto-ponte pinado (`.claude/verify/evidence_bridge.json`) e pelo gate
`check_evidence_bridge.py`/stage `evidence-bridge` no pipeline. Fica
versionado: `evidence_v322` (gate V322-DOC3, decisão distinta). Os 3 ZIPs da
raiz (gates S64/S74/S113) — que a 007 registrou como "migração de escopo
posterior, fora desta demanda" — **foram migrados pela demanda 008**
(`specs/008-migracao-zips/`): o manifesto-ponte foi estendido para
acervo-arquivo (`evidence-47`/`evidence-48`/`evidence-487`, mesma âncora
`62590b5927496a61ab31dd476d46b03624546560`, commits `314f466`/`fcbe5e5`) e o
gate `evidence-bridge` generalizado; o release **`evidence-v32`** foi
publicado em `oflavioc/quickscan-secops` em 2026-08-27 com os 3 assets
diretos, conferido pós-download ×3 + digest da API do GitHub
(https://github.com/oflavioc/quickscan-secops/releases/tag/evidence-v32); os
3 ZIPs **saíram do índice** com contraprova (`4bd22c1`); os gates
**S64/S74+S75/S113 leem da âncora** (`git show <âncora>:<path>` → tmp →
`unzip`, asserções intactas — `7cd3182`); repin único fechou o PR (`1465258`).
O histórico git não emagrece com isso — emagrecimento é rewrite, decisão
separada do proprietário. A consumação da 007 está registrada no relatório
final da demanda 007 (`specs/007-migracao-evidencia/relatorio-final.md`); a
consumação da 008 está registrada no relatório final próprio dela
(`specs/008-migracao-zips/relatorio-final.md`).
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
