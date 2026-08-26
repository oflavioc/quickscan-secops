# R11 — Entrada de evidência

Severidade: **bloqueante** (hook `guard-data`).

O repositório carregava ~103 MB de evidência binária herdada (E10) — a migração
desenhada na Onda 4 foi **executada pela demanda 007** (PR #20, mesclado 2026-08-25)
(`specs/007-migracao-evidencia/`): os 4 acervos (`evidence_p50`, `evidence_p51`,
`evidence_p52`, `evidence_unset`, 406 arquivos) saíram do índice para Releases
nominais em `oflavioc/quickscan-secops`, com verificabilidade preservada por
manifesto-ponte pinado (`.claude/verify/evidence_bridge.json`) e pelo gate
`check_evidence_bridge.py`/stage `evidence-bridge` no pipeline. Ficam
versionados: `evidence_v322` (gate V322-DOC3) e os 3 ZIPs da raiz (gates
S64/S74/S113 — migração de escopo posterior, fora desta demanda). O histórico
git não emagrece com isso — emagrecimento é rewrite, decisão separada do
proprietário. A consumação está registrada no relatório final
da demanda 007 (`specs/007-migracao-evidencia/relatorio-final.md`).
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
