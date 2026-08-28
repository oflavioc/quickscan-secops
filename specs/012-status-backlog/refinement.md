# Refinamento — 012-status-backlog

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interrogação do sistema real por Read/Grep (arquivo:linha abaixo); nada suposto
> de memória. Origem: ao conferir o PR #23 (que criou `.claude/BACKLOG.md`), o
> orquestrador tentou listar achados abertos por `grep` e não conseguiu — o
> status do EA-1 é prosa.

## Necessidade

Para o **orquestrador e o proprietário/auditor**: `bash
.claude/verify/compliance-audit.sh` passa a listar os achados abertos do backlog
a cada execução, como já lista os `tdd_waiver` (seção `waivers`,
`compliance-audit.sh:123-132`) — achado esquecido fica impossível de silenciar,
que é o espírito da R3 §waiver ("waiver é rastro, não obstáculo… a conversa
acontece sobre o dado"). Para o **doc-writer** (mantenedor do arquivo,
`BACKLOG.md:3`): um vocabulário fechado de status em vez de prosa inventada a
cada achado. Hoje o status do único achado é `**Status: aberto.**`
(`BACKLOG.md:52`) — legível por humano, por nenhuma máquina; nada no repositório
o parseia (Grep confirmou: só citações documentais). Por que agora: o backlog
nasceu anteontem com **um** achado — fechar o formato custa uma linha migrada;
depois de dez achados em dez prosas diferentes, custa uma arqueologia.

## Enquadramento de produto

- **Invariantes de produto (R1)**: nenhum byte de produto muda. Tangência única:
  `compliance-audit.sh` é o gate declarado da **INV-10**
  (`invariants.json:55`) — a seção nova vive no mesmo arquivo; o mapa
  invariante→gate não muda, mas editar o arquivo exige o cuidado da R10 §1
  (nunca enfraquecer o que já verifica).
- **Regras de processo tangenciadas**: R12 (achado com id permanente; refutado
  riscado; decisão confirmada migra para `design-decisions.md`; "índices são
  gerados" — discutido na rodada 1.1), R2 §5 (refutação permanece), R3 §waiver
  (o precedente de listagem), R10 §§1-3 e R3 §5 (a seção nova é **gate novo**:
  red provado, mutante que ela mata, sem SKIP silencioso), R8 §1 (os três
  arquivos tocados são pinados: `.claude/BACKLOG.md` em `pins.json:18`,
  `compliance-audit.sh` em `pins.json:73`, `CONTEXT.md` em `pins.json:91` →
  `gen_pins.py` no mesmo PR), R7 §3 (a auditoria só lê, nada escreve).
- **Conflito com decisão registrada?** Não. O racional do PR #23 —
  `.claude/BACKLOG.md` como **registro durável**, pinado, sob `.claude/`
  (`BACKLOG.md:23-31`) — é reafirmado: a demanda não muda local nem natureza do
  arquivo, só torna o status **dado conferido por máquina** (o princípio do
  CLAUDE.md: "dado que apodrece não mora em prosa"). A rodada 1.1 desafia
  honestamente até o formato Markdown, mas a recomendação o preserva.
- **Alternativa mais simples considerada**: conserto de passagem — editar a
  linha do EA-1 e fazer o audit dar `grep "Status: aberto"`. Rejeitada duas
  vezes: (i) R5 §anti-patterns proíbe exatamente o "corrigir de passagem" (foi
  por isso que o proprietário abriu demanda); (ii) grep sem **vocabulário
  fechado nem parse que falhe** reproduz a doença — um typo (`abertto`) ou uma
  variação de prosa silencia o achado tão bem quanto hoje. O valor não está em
  achar `aberto`; está em **reprovar o que não parseia**.

## Sistema real

Verificado por leitura e Grep (não executei nada — fora do meu domínio):

- **`.claude/BACKLOG.md`** (159 linhas, criado no PR #23, mesclado): cabeçalho
  declara mantenedor (`doc-writer`, linha 3), id permanente com sufixo de letra
  para inserção tardia (linhas 3-5), refutado riscado com a razão (linhas 6-7),
  decisão confirmada vai para `design-decisions.md` (linhas 7-9). Um único
  achado: **EA-1** (linha 50), status em prosa na linha 52
  (`**Status: aberto.**` — negrito, dois-pontos dentro do negrito, ponto
  final). O EA-1 tem ~110 linhas de análise (cadeia, duas faces, tensão,
  precedente, encaminhamento) — o valor do registro é a **prosa longa**, não
  cabe num campo JSON.
- **`compliance-audit.sh`**: cabeçalho na linha 7 **enumera as seções**
  (`hooks, deny, invariantes, suites, paths, known-issues, waivers`) — seção
  nova precisa entrar nessa enumeração e no filtro `--rule=X` (linha 18-21,
  automático via `secao()`). Precedente **waivers** (linhas 123-132):
  `grep -l "tdd_waiver"` sobre os planning-states; nenhum → `ok "nenhum
  ativo"`; algum → **`ok` listando** (nunca `falha`), com ramo gracioso se a
  máquina SDD não existir (linha 130). Precedente **known-issues** (linhas
  109-121): lê `known_issues.json` estruturadamente e **`falha`** para exceção
  sem `remocao_prevista` (R10 §2). Exit code = contagem de FAIL (linha 136).
- **`known_issues.json`**: `issues: []` — são **exceções nominais de lint com
  prazo de remoção**, outra natureza (permissão temporariamente suspensa ≠
  registro de dívida). O próprio `BACKLOG.md:19-20` já distingue os dois.
- **Consumidor do status**: a skill `fix-finding` — §1 "se não reproduz:
  **risque com a razão**" (→ refutado) e §4 "no registro do achado: **o que
  foi feito**" (→ resolvido). São os dois eventos que mudam status, além da
  migração para `design-decisions.md` (R12/R13). Nenhum outro código lê o
  backlog.
- **Identidades**: os três arquivos a tocar são pinados (`pins.json:18,73,91`);
  nenhum pertence a classe do `boundary.json` — edição livre com repin no mesmo
  PR (R8 §1), sem rito de boundary.
- **Divergência doc×código que a demanda encerra**: R12 promete backlog com
  status auditável em espírito ("achado… ao backlog com id permanente";
  refutado riscado) e o CLAUDE.md promete "dado… conferido por máquina" — hoje
  o status não é conferido por nada.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | Achado (`## EA-*`) sem linha de status reconhecível | **FAIL** da seção — o parse é fechado; achado sem status é exatamente o silêncio que a demanda elimina. |
| 2 | Status fora do vocabulário (typo `abertto`, invenção `pendente`) | **FAIL** nomeando o id e o valor encontrado. |
| 3 | Nenhum achado aberto | `ok "achados abertos: nenhum"` — simetria com waivers (linha 127). |
| 4 | Achado **refutado** | Título/corpo riscados (R2 §5), mas a **linha de status não é riscada** — parse limpo; a razão da refutação fica na prosa (obrigatória por R12, cobrada por revisão humana, não por regex — R10 §6 desaconselha oráculo por regex sobre prosa PT-BR). |
| 5 | Id com sufixo de letra (`EA-1a`, inserção tardia — R12) | Reconhecido pelo parse como achado normal. |
| 6 | `BACKLOG.md` ausente | **FAIL** — diferente do ramo gracioso dos waivers (linha 130): o arquivo existe, é pinado e é pré-condição da R12; sumir é violação, não estado pré-instalação. |
| 7 | Duas linhas de status no mesmo achado | **FAIL** (ambiguidade — qual vale?). |
| 8 | Achado **transferido** (confirmado como desenho) | Entrada permanece (id nunca some), status `transferido`, ponteiro para a linha de `design-decisions.md` na prosa. |
| 9 | O EA-1 de hoje (`**Status: aberto.**`, linha 52) | Não casa com a gramática canônica → é o **red natural da Fase 4**: a seção nova reprova o backlog atual; a migração do EA-1 é o green. |
| 10 | Série histórica `E1–E12` (documento fundador, externo) | Fora do arquivo, fora do parse — nada muda (R13: registros selados valem como selados). |

## Vocabulário

Registrados no `CONTEXT.md` nesta Fase 0 (formato R12):

- **Achado** — o conceito central da demanda usado por 6 regras e nunca
  definido no glossário.
- **Status de achado** — o campo novo, com o vocabulário fechado
  (`aberto` · `resolvido` · `refutado` · `transferido`). A rodada 1.2
  **confirmou a enumeração como registrada** (usuário, 2026-08-28) — o
  `CONTEXT.md` já está correto, nenhuma atualização adicional necessária (R12).

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1.1 | **O backlog continua Markdown?** Três caminhos: (A) **Markdown canônico + linha de status em gramática fechada**, e a seção nova do audit parseia e reprova o que não casa; (B) **JSON canônico** (à la `known_issues.json`) com render Markdown gerado; (C) **sidecar** (status em JSON separado, prosa no .md). **Recomendo: (A)** — o valor do backlog é a prosa longa (EA-1 tem ~110 linhas de cadeia/tensão/precedente; JSON é hostil a isso), o arquivo foi escolhido como registro durável há dois dias com racional próprio (`BACKLOG.md:23-31`, reabrir agora seria retrabalho sem achado novo), e (B) custaria gerador novo + pin + mutante para n=1 achado. (C) é split-brain: dois arquivos para o mesmo dado, drift garantido. "Índices são **gerados**" (R12) não é violado: o backlog é **registro**, não índice — nenhum índice nasce aqui. Gatilho registrado para reabrir: se o backlog passar de ~20 achados ou o parse quebrar em uso real, a geração (B) vira demanda própria. | **(A) — Markdown canônico com gramática fechada** ("Aceito as 4 recomendações", usuário no chat, 2026-08-28). JSON canônico e sidecar rejeitados; gatilho de reabertura (~20 achados ou parse quebrado em uso real) permanece registrado. |
| 1.2 | **Que estados existem?** Das regras: `aberto` (hoje), `refutado` (R2 §5/R12 — riscado com a razão, nunca apagado), `resolvido` (fix-finding §4 — "o que foi feito", com referência de PR/commit na prosa) e `transferido` (R12 — decisão confirmada migra para `design-decisions.md`; a entrada fica, com ponteiro, porque id permanente proíbe apagar). **Recomendo: exatamente esses 4.** Achado com fix-finding **em curso** NÃO ganha estado próprio: "em correção" é estado de processo que vive na branch/conversa e apodrece no registro durável (a doença que a demanda cura) — o achado fica `aberto` até o merge da correção. | **Exatamente 4 estados** — `aberto` · `resolvido` · `refutado` · `transferido`; fix-finding em curso não ganha estado (usuário, 2026-08-28). Enumeração do `CONTEXT.md` confirmada sem mudança. |
| 1.3 | **O que o audit faz com achado aberto: `ok` (lista) ou `fail`?** **Recomendo: `ok` listando (id + título), como os waivers — `fail` só para violação de forma** (bordas 1, 2, 6, 7). Achado aberto é **dívida registrada e visível**, não permissão: deixá-lo aberto não suspende regra nenhuma. A R10 §2 ("exceção sem prazo vira permissão permanente") governa `known_issues.json` porque exceção nominal SUSPENDE um lint — o análogo não se aplica; impor `remocao_prevista` a achado fabricaria datas fictícias (o EA-1, p.ex., espera legitimamente a demanda 009 fechar). Sem fail-by-age pela mesma razão. Recomendo **data de abertura** na prosa de cada achado (o EA-1 não tem) — para a revisão humana, não como asserção do gate. | **`ok` listando abertos; `fail` só por violação de forma** (sem status, fora do vocabulário, duplicado, arquivo ausente) — sem prazo obrigatório nem fail-by-age (usuário, 2026-08-28). Data de abertura na prosa: recomendada, não exigida pelo gate. |
| 1.4 | **Escopo**: só formato+audit, ou também migrar o EA-1 e criar o rito de atualização? **Recomendo o pacote completo, que é pequeno**: (i) gramática de status no `BACKLOG.md` (cabeçalho do próprio arquivo documenta o vocabulário e quem escreve — `doc-writer`, nos eventos nomeados da 1.2; **nenhum arquivo de regra novo**); (ii) migração da linha 52 do EA-1 para a gramática (é o green da Fase 4 — sem ela a demanda entrega um gate permanentemente vermelho); (iii) seção `backlog` no `compliance-audit.sh` + enumeração da linha 7. **Fora**: corrigir o EA-1 em si (fix-finding já encomendado; o conteúdo das 110 linhas fica byte-intacto — só a linha de status muda). | **Pacote completo** — gramática + migração do EA-1 + seção `backlog` no audit (incl. enumeração da linha 7) + rito no cabeçalho do próprio `BACKLOG.md`; correção do EA-1 em si fora de escopo (usuário, 2026-08-28). |

**Consolidação (2026-08-28)**: o usuário aceitou as 4 recomendações no chat
("Aceito as 4 recomendações") — a rodada 1 fecha **sem abrir pergunta nova**.
O desenho consolidado: Markdown canônico com linha de status em gramática
fechada; 4 estados (`aberto` · `resolvido` · `refutado` · `transferido`);
audit lista abertos com `ok` e reprova só violação de forma; pacote completo
incluindo migração do EA-1 e rito no cabeçalho do próprio `BACKLOG.md`. A
gramática exata da linha (regex, posição no achado) é decisão técnica da
Fase 1/2 (spec/plan), não do proprietário. Deste lado, o refinamento está
pronto para o portão; **quem aprova a fase é o usuário, no chat** (D3).

## Fora de escopo (explícito)

- **A correção do EA-1** (as três listas de proteção) — fix-finding próprio, já
  encomendado pelo proprietário, a abrir depois da 009; as ~110 linhas de
  análise permanecem byte-intactas, só a linha de status migra de gramática.
- **`known_issues.json` e a seção `known-issues`** — natureza distinta (exceção
  com prazo ≠ achado); nada muda.
- **`docs_phase5/REVB_BACKLOG.md`** — artefato histórico selado (R13).
- **Série `E1–E12`** — pertence ao documento fundador, externo; não entra no
  parse nem no arquivo.
- **Geração de índice/render a partir do backlog** — só se a resposta da 1.1
  escolher (B), ou pelo gatilho registrado lá.
- **Qualquer byte de produto** — engine, Camada 1, HTML, módulos de UI, suítes
  `tests_*.js`.
