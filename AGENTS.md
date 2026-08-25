# AGENTS.md

Instruções para agentes de IA neste repositório — **versionadas e pinadas**
(achado E4: a versão anterior deste arquivo era deliberadamente mantida fora do
git, tornando as instruções que dirigem os agentes invisíveis à auditoria; a
Onda 4 fecha isso).

**A fonte canônica é [`CLAUDE.md`](CLAUDE.md)** — índice de regras (R1–R14 em
`.claude/rules/`), agentes, skills, hooks e limites de autonomia. Este arquivo
não duplica nada dali (duplicação é como o CLAUDE.md antigo drifteou).

O mínimo que qualquer agente precisa saber antes de agir:

1. **Leia `CLAUDE.md`** e as regras que ele aponta; precedência é delas.
2. **Estado real**: `bash .claude/verify/run.sh --light` (baseline/boundary/
   build) antes de trabalhar; o estado de fase de produto vive em
   `.claude/verify/current_phase.json`, o de demandas em
   `.claude/project-memory/planning-state/`.
3. **Nada de editar**: engine, Camada 1, gerados, MANIFEST legado, pins —
   os ritos estão em `.claude/verify/boundary.json` (o hook nega e explica).
4. **Comportamento novo** = skill `new-demand` (7 fases, aprovação do usuário
   por portão). Correção de achado = skill `fix-finding`. Red antes de green
   em módulo de produto (o hook `guard-tdd` bloqueia sem isso).
5. **Evidência**: todo PASS cita execução com contagem; o não executado é
   declarado. Só o auditor humano declara fase concluída/selada.
