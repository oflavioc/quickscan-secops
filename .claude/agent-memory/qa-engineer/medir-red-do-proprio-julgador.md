---
name: medir-red-do-proprio-julgador
description: O stage mutation recusa árvore suja, então o red de uma mudança no próprio check_mutation.py só se mede em worktree efêmera com o gate commitado LÁ
metadata:
  type: project
---

`check_mutation.py` aborta com `[FAIL] árvore suja` antes de qualquer asserção
(pré-condição de árvore limpa). Enquanto se **escreve** a seção de integridade, a
árvore está suja por construção — o gate nunca chega a rodar, e não há red para
commitar.

Rito que funcionou (T002 da 013, 2026-08-29):

1. `git worktree add --detach <efêmera> HEAD`;
2. copiar o gate modificado para lá e **commitar na efêmera** (árvore limpa);
3. rodar e capturar a saída — é ela que entra no artefato de red;
4. escrever o artefato na árvore real, commitar red + artefato juntos;
5. **reconferir em árvore limpa depois do commit** e exigir saída **idêntica** à
   registrada. Se divergir, o artefato está mentindo.

A mesma efêmera serve para a falsificação (levar cada asserção ao verde e
devolvê-la ao vermelho pelo mutante) sem tocar a árvore real — `git reset --hard`
+ `git clean -fd` entre sondas, `git worktree remove --force` no fim.

**Why:** a serialização é estrutural, não disciplina pedida (plan.md §Disciplina
2 da 013): quem mede enquanto alguém escreve recebe `árvore suja`, nunca um
número errado. E red não commitado é red inauditável (R3 §4).

**How to apply:** vale para qualquer edição em `.claude/verify/check_*.py` que
precise de red medido — T004 (green de IC-2) e as medições de T008/T013/T016 caem
no mesmo padrão. Cuidado com o PATH restrito em Git Bash: reduzir o `PATH` na
shell inteira mata `tail`/`timeout`; passe o PATH só ao filho
(`env PATH=... node …`). Ver [[trilha-e-ambiente-quickscan]].
