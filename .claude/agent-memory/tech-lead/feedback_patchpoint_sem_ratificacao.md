---
name: patchpoint-que-nao-pede-ratificacao
description: Quando nenhuma API de registro alcança a superfície, o patch-point a aprovar é o observador estreito — o 5º wrapper de `render` é proibido pela R9 §4 e seu precedente exigiu autorização nominal; tocar módulo de fase selada custa campanhas chromium
metadata:
  type: feedback
---

Superfície sem API de registro que a alcance (na 011: `__P50.registerDecor` só
roda em resultados, porque `window.__uxDecor` é invocado apenas de `ui_v32.js`,
que é protegido) **não é motivo para parar nem para monkey-patch**. A ordem de
preferência, medida na Fase 2 da 011:

1. **Observador de mutação estreito**, registrado como patch-point no `plan.md`
   (R9 §4 exige o registro; o artefato é do TL). Não reatribui binding global,
   não captura evento, e roda depois de toda a cadeia congelada. Custa **um tick
   de microtarefa** no gate.
2. Wrapper do binding global `render` — **recusar**. A R9 §4 proíbe monkey-patch
   de função global e é bloqueante para módulo NOVO; os quatro wrappers vivos são
   o custo do achado E12, não licença para o quinto; e o precedente mais próximo
   (AMB-1, `ui_p50_shell_v32.js`) foi **aprovado nominalmente pelo proprietário**
   — repeti-lo sob delegação consome autorização que não foi dada.
3. Estender a API de registro existente dentro do módulo da fase selada —
   **recusar pelo custo, não pela classe**: `ui_p50_shell_v32.js` não é
   protegido (editá-lo é repin), mas é alvo declarado das campanhas `p50`, `p51`
   e `p52`, **as três com `requires: chromium`**. Tocá-lo joga o fechamento da
   demanda para o job visual do CI.

**Why:** sob a delegação de 2026-08-29 ([[autoridade-delegada-2026-08-29]]) a
rota certa é a que não pede ratificação, e "o gancho não existe" costuma ser lido
como "logo, precisamos editar o protegido". Na 011 isso teria parado a demanda
sem necessidade.

**How to apply:** antes de declarar PARADA por falta de gancho, **prove a
disponibilidade do observador com protótipo descartável** — vale a pena: sob
jsdom o `MutationObserver` entrega 0 vezes de forma síncrona e 1 vez após um
`await Promise.resolve()`, e o nó âncora sobrevive aos renders quando a camada
congelada repinta por `innerHTML`. Escreva no plano as três guardas sem as quais
o observador vira defeito: `attributes:false`, flag `busy` de reentrância e
**write-if-different** (estado estável tem de produzir zero mutação, senão o
laço não fecha). E feche a porta do gate falso: **não exponha `decorate()` no
bridge** — se nenhum gate puder disparar a decoração à mão, o mutante "não
instalar o observador" mata a suíte inteira. Ver
[[vacuidade-medida-antes-do-gate-nascer]].
