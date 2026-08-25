# R9 — Modularização (pré-condição da equipe multi-agente)

Severidade: **bloqueante** para módulo NOVO (stage `lint-arch`); o estado herdado
das camadas 4.x é legado documentado, não licença.

"Um módulo por delegação" só funciona com "um dono por símbolo". O achado E12
mostra o custo do contrário: 115 declarações top-level em escopo compartilhado,
`render` monkey-patcheado 4×, CSS estilizando 178 seletores alheios, 14 bridges
sem registro, módulos se falando por regex sobre texto renderizado.

Para todo módulo novo:

1. **IIFE obrigatório** + guarda de instalação única (`__installed`).
2. **Um bridge por módulo**, registrado em `.claude/verify/bridges.json` (nome,
   owner, nota). `window.__*` fora do registro = FAIL no `lint-arch`.
3. **Contrato inter-módulo só por API de bridge** (o bom exemplo é
   `__P50SUFF.contract()`). Proibido: regex sobre texto renderizado; ler atributo
   DOM escrito por outro módulo como canal de decisão.
4. **Proibido monkey-patch de função global.** Extensão só via API de registro
   (padrão `__P50.registerDecor`). Patch-point novo = entrada aprovada pelo TL no
   registro de patch-points (artefato do `plan.md`).
5. **Estado canônico nunca nasce em módulo decorador.** Dono do estado é tarefa do
   `core-engineer`, exposto por getters/setters de bridge; renderização só consome.
   Campo obrigatório "owner do estado" na spec para todo dado novo.
6. **CSS com prefixo do próprio módulo**; seletor alheio exige allowlist de exceções
   revisada (FE propõe, TL aprova) com o pipeline visual como regressão.
7. **Orçamento de tamanho: ~600 linhas** ou justificativa registrada no plan.md;
   uma responsabilidade por módulo (contraexemplo: `ui_p52_workspace` com 1.986).
8. **Helper único por semântica de invariante** — a tri-state de resposta
   (`null` · `"NA"` · `0..3`) e afins vivem num helper exposto por bridge;
   comparação literal duplicada fora do dono é candidata a FAIL de lint.
9. **Zero `innerHTML =` em módulo 5.x+** — texto por `textContent`, atributo por
   `setAttribute` (o `lint-arch` verifica).
