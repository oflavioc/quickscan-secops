---
name: conforme-por-deferimento-tem-prazo
description: "Conforme por deferimento declarado" é veredito com prazo — expira quando a execução deferida chega; num spec-validate retroativo, separe o que a execução de então sustenta do que foi remedido e nomeie o item cujo verde mudou de prova (014/T082 × E13)
metadata:
  type: project
---

Um item de `spec-validate` marcado **conforme porque a spec permite deferir** a
prova ao job `visual` (par `NÃO EXECUTADO` com causa nomeada) é um veredito
**com prazo**: ele vale até o run deferido terminar, e tem de ser relido quando
ele terminar. Na 014, a T082 (2026-09-01, 14:13Z) deu C4 como conforme com
`D014-M10`×`P52-LAY2` deferido; o run 33516136516 já estava **em voo** (criado
13:53Z) e trouxe `SOBREVIVENTE` às 14:52Z — a forma `:77` era CSS raciocinado,
não medido. Nada no 19/19 registrava a expiração, porque **não havia
artefato** (EA-33): a conformidade vivia numa linha do planning-state.

**Why:** o verde de 2026-09-01 e o de 2026-09-04 têm a mesma cor e provas
diferentes (deferimento declarado × KILL canônico da forma `:86`, run
33834890154). Um spec-validate escrito depois que reproduzisse o "conforme" sem
dizer isso seria falso — e é exatamente o carimbo retroativo que a 014 combate.

**How to apply:**
1. Todo item conforme "por deferimento" leva o **id do run** que o fechará e a
   frase *reler quando terminar*; ao escrever o artefato, confira `gh run view
   <id> --json status,conclusion` — se já terminou, o item é medido, não
   deferido.
2. Num spec-validate **retroativo** (pós-merge), o cabeçalho diz a data de
   escrita, o HEAD medido e **por que nasce agora**; uma seção "o que a
   validação de então deixou, e o que não deixou" separa o que sobrevive
   (commits, linha do planning-state) do que não existe (lista item a item);
   a tabela é a **medição de hoje**, com numeração própria, sem reconstituir a
   partição antiga.
3. O item cuja prova mudou recebe veredito na forma *"conforme — por E13, não
   pela forma de então"*, com os dois logs lidos (o que falsificou e o que
   fechou).
4. Precedente de forma: `specs/013-integridade-da-campanha/spec-validate.md`
   e `specs/014-gate-sem-poder-discriminante/spec-validate.md`.
   Ver [[grade-implicita-neutraliza-mutante-de-coluna]] (a causa do
   SOBREVIVENTE) e [[bateria-efemera-nao-e-registro]] (prova sem artefato
   evapora).
