---
name: verify
description: Roda o pipeline de verificação e o compliance-audit, e roteia cada falha para o dono certo com a correção certa. Use depois de qualquer alteração e antes de considerar trabalho pronto.
---

# Verificar o repositório

```bash
bash .claude/verify/run.sh                # pipeline completo (grava .last_green)
bash .claude/verify/run.sh --light       # sem stages heavy (uso do hook Stop)
bash .claude/verify/compliance-audit.sh  # a configuração agêntica está íntegra?
```

## Roteamento de falha — stage → dono → correção certa → saída PROIBIDA

| Stage | Dono | Correção certa | Nunca |
|---|---|---|---|
| env-doctor | build-engineer | instalar/declarar a dependência | mascarar com SKIP |
| baseline | build-engineer | mudança legítima → `gen_pins.py` no mesmo PR; ilegítima → reverter | editar pins.json à mão |
| boundary | orquestrador | seguir o RITO nomeado na mensagem | contornar o hook |
| marker-lint | build-engineer | corrigir o builder (demanda, se muda o HTML) | ampliar exceção sem prazo |
| icons-check / build | build-engineer | decidir a DIREÇÃO: fonte mudou (rebuild consciente) ou gerado foi editado (reverter) | commitar o gerado editado |
| lint-arch | dono do módulo | adequar à R9 (bridge no registro, IIFE, sem innerHTML) | registrar bridge "só para passar" sem owner real |
| m41 | core-engineer + usuário | payload mudou = Porta B (R1) — parar e reportar | repinar o payload sem rito |
| suites / suites-heavy | qa-engineer roteia ao dono | diagnóstico de causa (R2 §3) antes de qualquer mudança | **enfraquecer o gate para passar** |
| state | orquestrador | corrigir o planning-state para refletir o real | editar para "ficar verde" sem refletir o real |
| compliance | build-engineer | corrigir a configuração apontada | remover a seção que acusa |

Falha que é decisão documentada (design-decisions/known-issues) → vira registro,
não correção. Falha nova sem dono claro → achado com id, nunca conserto "de
passagem".
