---
name: prova-de-carga-de-excecao-e-piso
description: Toda exclusão nominal, piso temporal ou válvula que faz um gate nascer verde tem de vir com a medição "retire-a e a varredura acusa N" — exigida no portão da 014 e de novo no da 016; gate de processo sobre árvore conforme só tem dentes por isso, pela sonda e pelo red ao vivo
metadata:
  type: feedback
---

Quando um gate novo só nasce verde porque existe exclusão nominal, piso (âncora
temporal) ou válvula, a spec **declara a prova de carga**: o número exato de
sujeitos que a varredura acusaria sem a exceção, lido na Fase 1 e **fixado por
execução na Fase 4** (gravado em `_meta.prova_de_carga` do registro da exceção).
"Uma exclusão que não é carga é afrouxamento" — frase literal do orquestrador
no portão da 016.

**Why:** o `EA-5` (MANIFEST sempre vermelho, nunca rodado) proíbe nascer
vermelho crônico, e R10 §1 proíbe afrouxar para passar — a única forma de
satisfazer os dois é exceção **medida como carga**. A 014 provou o padrão
(`_trilha` do `d014`: "retirada a exceção `achado-aberto`, a varredura volta a
acusar 1 morta"; errata E14 `prova_de_carga_e_red`), e a 016 o reaplicou ao piso
(sem ele, 6 merges de Onda) e às exclusões R13 (003 ×2, 009, 010).

**How to apply:** em gate de **processo** sobre árvore que hoje está conforme
(planning-states todos `done`, `develop` sem violação), escreva de onde vêm os
dentes, gate a gate, numa tabela "hoje × dentes": (i) exclusão/piso como carga
medida; (ii) sonda sintética com **contagem pinada** (julgador puro, fixtures em
arquivo, veredito esperado por caso — IC-9.4/D014-DISC1); (iii) o red **ao vivo**
quando existir (na 016: `D016-PROT1` sobre a `develop` desprotegida e o
pré-merge sobre o próprio PR). Alínea que só a sonda sustenta é declarada
"verde por vácuo na árvore" — nunca disfarçada. Prefira meter você mesmo o
sistema real por leitura (`gh api` GET, `git log --merges --first-parent`) antes
de fixar a asserção: na 016 a resposta real `protected: true` +
`protection.enabled: false` virou o mutante mais valioso. Ver
[[vacuidade-medida-antes-do-gate-nascer]] e [[erratas-de-spec-forma-e-precedente]].
