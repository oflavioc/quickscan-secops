---
name: vocabulario-fechado-nao-distingue-fails
description: Sonda que pina só o veredito de um enum fechado (T10-like) deixa vivo o julgador que reprova pela razão errada; pine um segundo vocabulário fechado de códigos de problema e o TOTAL de problemas da fixture como par de controle
metadata:
  type: feedback
---

Um vocabulário fechado de vereditos (spec 016 T10: CONFORME · MESCLADA SEM
FECHO · … · NÃO DETERMINÁVEL) é bom contra rótulo ambíguo, mas colapsa razões
distintas no mesmo valor: "válvula vencida", "válvula sem dono", "artefato
ausente", "exclusão sem fonte" eram todos "FAIL" na spec, e um julgador que
reprovasse F7 por "sem válvula" em vez de "vencida" passaria numa sonda que só
compara o veredito — é o sobrevivente disfarçado da 014, agora no lado do
esperado. Resposta que funcionou na 016: (a) segundo enum fechado `CODIGOS`
exportado pelo instrumento e conferido pelo gate contra a lista do registro
(conjunto fechado + escape nomeado, como T10); (b) cada caso pina veredito +
oráculo + código; (c) cada caso pina também o TOTAL de problemas da fixture —
sem isso, o julgador que acusa sujeito a mais (o piso, uma integração de main)
passa com o sujeito certo.

**Why:** ao mapear os 26 casos da spec para fixtures, 12 deles tinham
`esperado: FAIL` sem nome; pinar só o enum deixava M7/M8/M10 e qualquer
"reprova pela razão errada" sem carrasco. E o total de problemas foi o que deu
sentido a T2 ("o piso não é julgado"): sob o piso 6dad53d, a posição do piso é
o merge #15 sem planning-state — só o total pega um julgador que o acuse.

**How to apply:** ao desenhar sonda pinada para julgador com enum fechado,
pergunte por alínea: "dois defeitos diferentes produzem o mesmo veredito neste
caso?" Se sim, o pin precisa do código. E declare TODOS os campos pinados em
TODOS os casos (null explícito), nunca opcionais — declaração opcional some em
silêncio.
