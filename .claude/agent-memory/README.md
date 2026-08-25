# Memória dos agentes

Um diretório por agente. Cada arquivo guarda **um** aprendizado não-óbvio, com o porquê.

## O que entra

Armadilha que custou uma conclusão errada; decisão de projeto e sua razão;
comportamento de ferramenta que a documentação não deixa claro; contexto tácito.
Exemplos reais deste projeto: hash medido em CRLF é falso; suíte que regrava
arquivo versionado envenena as seguintes; `execSync` sem aspas quebra em path
com espaço.

## O que NÃO entra

Nada que se recupere lendo o repositório: estrutura de módulo, contagem de gate,
contrato de bridge, correção já aplicada. Isso é papel das rules, dos manifestos
em `.claude/verify/` e dos relatórios — versionados e verificados por máquina.

> Memória inflada deixa de ser lida. A referência que inspirou esta estrutura
> tinha dezenas de arquivos por agente repetindo fato de código — e drifteou.

## Formato

```markdown
---
name: <slug-em-kebab-case>
description: <uma linha — é por ela que se decide relevância>
---

O fato.

**Why:** por que isso importa / o que custou descobrir.
**How to apply:** o que fazer com isso na prática.
```

Alegação checável lida de uma memória se verifica por hash/execução antes de agir
(R2 §4) — memória registra experiência, não autoridade.
