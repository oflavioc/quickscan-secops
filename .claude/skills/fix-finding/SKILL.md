---
name: fix-finding
description: Leva um achado registrado até a correção aplicada e verificada, sem spec. Use para defeito de backlog/PR — no máximo 1 módulo, sem mudança de contrato nem de superfície protegida.
---

# Do achado à correção verificada

## 1. Reconfirmar antes de tocar

Leia o achado e **reproduza-o no estado atual** (achado antigo pode não ser mais
verdade — e a causa pode ser ambiente: R2 §3, a família "path com espaço" parecia
produto e era oráculo). Se não reproduz: risque com a razão, não corrija.

## 2. Classificar o risco

| Classe | Exemplo | Cuidado |
|---|---|---|
| Oráculo/ambiente | aspas em execSync, dependência não declarada | baixo — não muda comportamento medido |
| Estrutura/pipeline | stage, hook, manifesto | médio — rodar compliance-audit depois |
| Módulo de produto | lógica/render de camada nova | alto — exige red provado (R3: é `fix`) |
| Superfície protegida | engine, Camada 1, gerados | **PARAR** — rito da boundary (R6), não é fix-finding |

## 3. Aplicar

Delegar ao dono do módulo (R5). Diff mínimo; **nada de "limpar de passagem"**.
Arquivo pinado → `gen_pins.py` no mesmo PR; pin inline legado → trilha
"Identidade anterior" (R8).

## 4. Fechar

- Pipeline relevante verde (contagem em EVIDÊNCIA); classe produto → red→green.
- No registro do achado: **o que foi feito**, não só "corrigido".
- Correção revelou outro problema → novo achado com id próprio, nunca no mesmo diff.
