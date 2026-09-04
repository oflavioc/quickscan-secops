---
name: reproducao-nao-canonica-por-shim
description: Suíte Chromium que chama `chromium.launch()` sem `executablePath` (tests_011_chromium.js) roda com o Chrome estável local via shim de preload (`node -r shim.js`), sem editar a suíte; o controle tem de reproduzir o número do CI antes de o FAIL do mutante valer alguma coisa
metadata:
  type: project
---

Como matar um mutante visual **deferido** sem Chromium gerenciado, sem tocar o
oráculo e sem fingir que é canônico (D011-M9, 2026-09-04).

- `tests_011_chromium.js` chama `require("@playwright/test").chromium.launch()`
  sem opções — **não** honra `CHROME_PATH` (ao contrário de
  `tests_p52_chromium.js`/`tests_p50_chromium.js`). Editar a suíte para isso
  seria mexer no oráculo. O caminho limpo: um **shim de preload** no scratchpad
  que faz `pw.chromium.launch = opts => orig({executablePath: CHROME_PATH, ...opts})`
  e a suíte lançada com `node -r <shim> tests_011_chromium.js`. A suíte fica
  byte-idêntica; só o binário muda (Chrome estável 152 sob Playwright 1.62.1).
- **Controle antes do mutante**: sem mutação, o shim devolveu `8.82:1` — o
  mesmo número do job `visual` (run 33426062475). Sem essa igualdade o FAIL do
  mutante não provaria nada (poderia ser o navegador, não a cor).
- O mutante é **calculado**, não chutado: gray para 3,9:1 sobre o fundo efetivo
  resolvido (`rgb(11,11,12)`, `--bg` da Camada 1) = `#6F6F6F`, previsto 3,92,
  medido 3,92. O gate imprime o fundo efetivo na linha de FAIL — se a primeira
  tentativa errar o fundo, a saída dá o número certo para a segunda.
- Tudo em worktree efêmera (mutar CSS → `python build_v32_html.py` → suíte →
  `git checkout -f`), árvore real intacta.
- No registro (matriz), o resultado entra como **"DETECTADO em reprodução
  NÃO-canônica · canônico PENDENTE"** com `prova_anterior` preservada e dono do
  kill canônico nomeado. Nunca substitui a contagem canônica (KI-3).

**Why:** o par `D011-M9` ficou três dias com "DEFERIDO AO JOB VISUAL" enquanto
nenhum runner do job aplicava o mutante — deferimento sem veículo. A reprodução
em minutos separa "não há como medir" de "ninguém mediu".

**How to apply:** sempre que um mutante visual estiver deferido e a máquina tiver
Chrome/Edge estável, faça controle + mutante pelo shim antes de escrever
"deferido" de novo; declare o não-canônico como tal. Ver
[[trilha-e-ambiente-quickscan]] (rota `CHROME_PATH`) e
[[arbitragem-de-desvio-declarado]].
