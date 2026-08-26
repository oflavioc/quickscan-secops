# Parecer do Product Owner — cross-check da Fase 1 · demanda 007-migracao-evidencia

> Registro de processo (orquestrador). Parecer emitido pelo `product-owner` em
> 2026-08-25, segunda perna da Fase 1 (R4). O PO verificou a spec **contra o
> sistema real por leitura** (o PO não executa comandos); todo dado que exigiria
> execução está declarado como tal, com a mitigação que a própria spec prevê.

## Veredito

**Nenhum bloqueante. Nenhuma objeção de invariante (R1 — nenhum byte de produto
muda) nem conflito com decisão registrada (R13 — a demanda é o cumprimento da
migração prevista; a linha correspondente é atualizada no mesmo PR, padrão já
usado na 003).** Aprovação é do usuário; recomendação do PO: aprovar com o
ajuste A2 (redação do `_meta.commit_ancora`). A divergência de contagem apontada
pelo tech-lead (43×54 em `evidence_v322`) era **erro meu no refinement** — causa
confirmada por leitura e corrigida (A1).

## Fidelidade ao refinement aprovado

- **Rodadas 1.1–1.5, todas refletidas**: `evidence_unset` no inventário (4
  arquivos, release `evidence-unset`); 4 releases nominais, um por acervo;
  manifesto-ponte em `.claude/verify/evidence_bridge.json`; repositório-alvo
  `oflavioc/quickscan-secops` com token como robustez (repo público); política
  WARN local / FAIL CI virou o gate EB-5 com mutante M5 que mata o SKIP
  silencioso — a tradução mais forte possível da decisão.
- **Casos de borda 10/10 rastreados** na tabela "Casos de borda do refinamento —
  tratamento nesta spec", conferida item a item; EB-6 inclui a **contraprova**
  de que `evidence_v322` permanece rastreado — proteção executável da borda 1,
  que o refinement só tinha em prosa.
- **Afirmações da spec sobre o sistema real, verificadas por leitura**:
  `fetch-depth: 0` nos dois jobs do CI (`.github/workflows/verify.yml:29,54` —
  sustenta o oráculo EB-1 por commit-âncora no CI); a linha
  `git checkout -- docs_phase5/` (`verify.yml:78`) e o comentário do achado E9
  (`verify.yml:75–77`) conferem com o tratamento da borda 4 (torna-se inócua
  para paths não rastreados, permanece válida para `evidence_v322`); o mecanismo
  `heavy` existe no `pipeline.yaml` (l.10; usos em l.76,88); as exclusões
  `docs_phase5/**` e `*.zip` de `pins.json → _meta.exclusoes` (conferidas na
  Fase 0) sustentam a decisão de o manifesto viver em `.claude/verify/`.
- **Shape do manifesto-ponte** sustenta os três oráculos: `arquivos`
  (path→sha256) para EB-1, `sha256_pacote` para EB-2/EB-4, `release_tag`/`pacote`
  para EB-3. Nome com underscore segue o padrão vigente em `.claude/verify/`
  (`expected_suites.json`, `mutation_map.json`).
- **Contagens do inventário**: `evidence_p51` = 20 e `evidence_unset` = 4
  conferem com listagem por leitura. `evidence_p50` = 82 e `evidence_p52` = 300
  **não verificados por mim** (exigem `git ls-files`; minhas ferramentas de
  listagem se mostraram não confiáveis nesses diretórios — ver A1). A spec
  mitiga bem: as contagens são re-medidas no commit-âncora e o oráculo EB-1 é
  independente do manifesto — um número errado hoje não sobrevive ao gate.
- **Âncora por commit imutável + SHA** (R10 §5), nunca HEAD/branch — a spec
  aprende explicitamente com o P52-PR1. HEAD `107e2c2` citado: não verificado
  por mim (declaro); irrelevante para o portão, pois o dado canônico será o
  commit-âncora real registrado no manifesto.

## Achados

| Classe | Achado | Encaminhamento |
|---|---|---|
| **A1 — corrigido (erro do PO)** | Refinement dizia `evidence_v322` = "43 arquivos"; o git rastreia 54 (dado do TL). Causa confirmada por leitura: minha contagem da Fase 0 listou só o primeiro nível do diretório e omitiu o subdiretório `rev_c/` (contém ao menos `V322C-mutacao-dirigida.json` e `V322C-SMOKE-invariantes.json`; os binários do subdiretório não são enumeráveis pelas minhas ferramentas). Refinement corrigido para 54, com a explicação registrada. Sem efeito no escopo: v322 está fora do inventário migrado. | Corrigido no `refinement.md` por este parecer |
| **A2 — ajuste de redação** | O shape declara `commit_ancora: "<SHA-256 do commit...>"`. Hash de commit git neste repositório é **SHA-1** (40 hex — os commits citados nas regras seguem esse formato, ex.: `b7a10f6`); chamá-lo de SHA-256 num artefato cuja disciplina é exatamente precisão de hash convida a confusão com os SHA-256 reais de blobs e pacotes. Trocar para "SHA do commit (40 hex)". | Emenda do tech-lead antes do portão |
| Observação 1 | `_meta.gerado_em` torna a ferramenta de geração dependente de relógio (R7 §6). Aceitável: o manifesto é gerado uma vez e congelado por pin, e EB-1 confere o **conteúdo** contra os blobs, não os bytes do manifesto. O `plan.md` deve deixar claro que a ferramenta de geração não é re-executada como verificação de identidade. | `tech-lead` no plan.md |
| Observação 2 | Não expandir `boundary.json` — **sem objeção**: pin com trilha é o mesmo regime mecanizado que protege o resto de `.claude/verify/` (fora `pins.json`, classe própria); o stage `baseline` torna alteração silenciosa impossível. Se o proprietário quiser rito de negação por hook, o caminho é expansão por spec dedicada (R6 §3) — que a própria spec nomeia. | Registro histórico |
| Observação 3 | Imutabilidade dos releases é **convenção + gate**, não propriedade da plataforma (o GitHub permite substituir asset). A garantia real é EB-2/EB-4 (hash pinado no manifesto); a spec acerta ao não confiar na plataforma. O relatório final da demanda deve explicitar isso ao proprietário, junto do aviso de que o pack não emagrece. | `doc-writer` no relatório final (Fase 6 confere) |
| Observação 4 | Stage único `heavy: true` faz a parte offline (EB-1/EB-6) não rodar no post-turn `--light`; a cobertura contínua fica no pipeline completo e no CI. Sem objeção (ler ~103 MB de blobs justifica `heavy`); granularidade fina, se desejada, é decisão do TL no plan.md. | `tech-lead` avalia no plan.md |
| Observação 5 | Empacotamento `.tar` determinístico **não é exigido nem necessário**: o hash congela os bytes do pacote publicado (medido pós-upload), e regeneração byte-idêntica nunca é oráculo de nenhum EB-*. O plan.md não deve inventar esse requisito. | `tech-lead` no plan.md |
