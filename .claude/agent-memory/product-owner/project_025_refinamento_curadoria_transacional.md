---
name: 025-refinamento-curadoria-transacional
description: Fase 0 da 025 (2026-10-25) — por que a 019 falhou por omissão (INV-8 lida como "não recusar", não como "substituir"), as seis decisões P1–P6 recomendadas e o que o aceite de Fase 6 tem de conferir nelas
metadata:
  type: project
---

A 025 corrige a 019 **contra a própria spec aprovada da 019**: `refinement.md:173`
(caso 7), `spec.md:41-42` (C2/C3), `tasks.md:31-32` (T010/T011) pediam import que
recomputa; o código pôs o "restauro" dentro do validador (`ui_session_v32.js:240`),
deixou a curadoria fora do `cand` e do commit, e o snapshot fotografa o arquivo. O
comentário `:235-236` cita a INV-8 e a lê como **proibição de recusar**, não como
**obrigação de substituir** — essa é a forma exata da omissão.

**Decisões que recomendei (o usuário decide no portão):** P1 recusar `{}`,
`{decisions:{}}` e `null` (doutrina do próprio validador `:327-329`; exportador
nunca os produz); P2 "Reiniciar" **limpa** a curadoria e o diálogo `:55` a nomeia
(texto NÃO pinado — grep = 0; `:61` de Nova sessão É pinado por UX21, não muda);
P3 toggle-back volta a *ausente* via `unset(id)` (proveniência que mente é o
oposto de C4); P4 prévia ganha "Curadoria do relatório: sim/não"; P5 `prioLimitHit`
e `draft` entram (draft em wave própria de `ui_v32.js`, severável); P6 `D025-INV8`
novo + errata de **título** do `D019-INV8` + errata de C10 ("o editor não lê").

**Why:** (1) a correção mínima **reprova um gate PROTECTED** (S50 pina a lista de
10 chaves do candidato) — foi isso, mais §29.4 em três módulos, que fez virar
demanda e não fix-finding; (2) descobri por leitura que `daSessao :189` aceita
`null` — quarta grafia que a síntese (N2) não listou; (3) a 019 prometeu
*Curadoria do relatório* e *Operador* para a Fase 1 do glossário e nunca gravou —
o filho (*Supressão pela curadoria*) existia sem o pai. Gravei o pai e
*Importação substitutiva* na Fase 0 desta (pedido do orquestrador), com remissiva
bilateral a *Substituto* (mesma raiz, família 023/024).

**Fase 1 (revisão de intenção, 2026-10-27, HEAD `2c47545`):** não encontrei
objeção à spec do TL; editei-a em 12 pontos marcados `[PO 2026-10-27]` e abri
duas erratas no refinement. (a) Confirmei a queda da guarda `&& snap.curadoria`
(`restoreCanonicalOwners`): R13 proíbe *reportar* e *corrigir de passagem*, não
mudar por spec quando o contrato muda; meu "não se removem" era mais largo que a
R13 (ERR-1). **Achado meu**: um mutante que REINTRODUZA a guarda sobrevivia a
TRX2(b) e S69(b) — snapshot sempre truthy nas duas; acrescentei TRX2(b′) (janela
"nada declarado" + falha após a escrita) e M22. (c) Chave desconhecida DENTRO de
`reportCuration` **entrou** como sub-caso de C3 (`F-extra`, M23; ERR-2) — minha
tabela da INV-8 tratou grafias do estado e esqueceu as chaves do bloco. (d)
EA-110 fecha `corrigido pela 025 (P3)`, nunca em `design-decisions.md`. (h)
*validação pura* é vocabulário interno (R9 §3), não verbete. USER_GUIDE tem **0**
`curadoria`/`Nova sessão`/`Reiniciar avaliação` — E6 tem de definir antes de citar.

**How to apply (Fase 6 da 025):** conferir que (a) `fromSession` = 0 chamadas no
picker, na prévia, no Cancelar **e** no export (EA-105 é o terceiro chamador que
todo mundo esquece); (b) o oráculo compara **entre janelas**, nunca uma janela
contra si; (c) o rollback devolve a curadoria da **sessão**, não do arquivo;
(d) o `D019-INV8` teve o título reduzido e a spec 019 ganhou errata de C3/C10;
(e) `CONTEXT.md` foi repinado no mesmo PR; (f) os literais de S30 (`:297-298`) e
UX21 (`tests_ux_m41.js:203`) não mudaram. O conflito facilitador/operador/
engenheiro (três nomes para o mesmo papel: `CONTEXT.md:59`, `:211`,
`ui_p52_support_v32.js:152/:608`) ficou **fora**, declarado — passe próprio do PO.
Ver [[checklist-fase0-owner-de-estado-novo]] e [[context-md-e-pinado]].
