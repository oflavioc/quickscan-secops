# Quickscan SecOps · SOC-CMM — Guia de utilização e interpretação

Manual de uso da ferramenta. Escrito para quem conhece operações de segurança e vai conduzir ou ler
um Quickscan — não para quem mantém o código.

---

## 1 · Visão geral

O **Quickscan SecOps · SOC-CMM** é um instrumento de **screening indicativo de alto nível** da
maturidade de uma operação de segurança. Em 15 perguntas distribuídas por cinco domínios, ele produz
uma leitura rápida, rastreável e defensável do estado atual — e a conecta a caminhos de evolução.

**O que ele não é.** Não substitui assessment formal, auditoria, desenho de arquitetura nem proposta
comercial. Não certifica conformidade. O resultado é uma fotografia declarada, boa para orientar
conversa e priorização; não para fundamentar contrato ou decisão de compra sozinho.

**Para quem é.** Arquitetos e engenheiros de segurança, líderes de SOC, consultores e times de
pré-venda que precisam de um diagnóstico inicial estruturado em uma reunião.

**O que ele entrega:** score de 0 a 5 (geral e por domínio), estágio de maturidade, gaps com
severidade, prioridades declaradas pelo negócio, cenário-alvo, recomendações contextuais e um
relatório em PDF pronto para leitura executiva.

**Domínios canônicos, nesta ordem:** Negócio · Pessoas · Processos · Tecnologia · Serviços.

---

## 2 · Guia rápido — dez passos

1. **Inicie ou importe uma sessão.** Comece do zero ou use *Importar sessão* para retomar um JSON.
2. **Identifique o cliente/sessão.** Ao exportar, dê um rótulo claro. Sem rótulo, o relatório mostra
   `Sem rótulo` — nunca um nome inventado.
3. **Responda com base em evidência observável.** O que existe e é verificável, não o que se pretende.
4. **Use `Não sei · precisa validar`** sempre que a resposta honesta for "não sabemos".
5. **Registre evidências e observações** em *Adicionar evidência ou observação*, usando o exemplo
   contextual da própria pergunta como referência.
6. **Declare as prioridades do negócio** (até três).
7. **Informe o contexto tecnológico** — é ele que transforma diagnóstico em prescrição útil.
8. **Revise resultados e gaps** no painel de resultados.
9. **Configure e revise o cenário-alvo**, conferindo se o alvo faz sentido.
10. **Exporte a sessão e gere o relatório.** Sempre nesta ordem, antes de trocar de cliente.

---

## 3 · Semântica das respostas

Cada pergunta admite quatro níveis confirmados mais a opção de validação. Os quatro níveis mapeiam
para os valores `0 · 1.7 · 3.3 · 5.0`.

| Estado | O que significa | Efeito no score |
|---|---|---|
| **não respondida** | ainda sem decisão; a pergunta não foi avaliada | não entra no cálculo; aparece como `n/d` |
| **`Não sei · precisa validar`** | a operação não sabe responder com segurança | **não pontua**; vira item de validação pendente |
| **nível mínimo confirmado** | a prática foi avaliada e o estado real é o mais baixo | **pontua `0.0`** e entra no cálculo normalmente |
| **níveis intermediários** | prática existe com lacunas de formalização, cobertura ou consistência | pontuam `1.7` ou `3.3` |
| **nível maduro** | prática estabelecida, medida e sustentada | pontua `5.0` |

**A distinção que mais importa.** *Ausência de evidência* (não respondida, ou `Não sei · precisa
validar`) é diferente de *evidência de ausência* (nível mínimo confirmado). A primeira significa que
não olhamos; a segunda, que olhamos e não há. Por isso:

> **`n/d` nunca significa zero.** Um domínio sem respostas confirmadas aparece como `n/d` e
> "Não avaliado" — jamais como `0.0`. Já um `0.0` confirmado é um dado: é plotado, entra na média e
> recebe marcador próprio no Atual × Alvo.

**Tecnologia não eleva maturidade.** Ter a ferramenta instalada não aumenta o score. O score vem da
prática declarada; a tecnologia entra na interpretação.

---

## 4 · Evidências e observações

**O que registrar.** Números, ferramentas, exceções, responsáveis, frequências e lacunas conhecidas —
o que permita reconstruir o raciocínio meses depois. Cada pergunta traz um bloco **O que registrar**
com um exemplo realista daquela prática específica.

**Quando registrar.** No momento da resposta, enquanto o contexto está fresco. É mais barato do que
reconstruir depois.

**Distinga quatro coisas:**

- **evidência** — o fato observável que sustenta a resposta;
- **contexto** — a circunstância que explica o fato;
- **exceção** — o que está fora da regra, com prazo e dono;
- **pendência de validação** — o que ainda não foi verificado.

> **Não registre segredos, credenciais ou dados pessoais desnecessários.** A ferramenta mostra esse
> aviso junto ao campo de evidência.

As observações entram no **anexo de respostas** do relatório e no drill-down por domínio, ajudando o
leitor a interpretar a nota. **A nota não altera o score da resposta escolhida** — ela documenta.

---

## 5 · Prioridades declaradas pelo negócio

Você pode declarar **até três (3)** prioridades.

- **Prioridade não altera o score.** Nenhum número muda por marcá-la.
- Ela muda **ordenação, ênfase e leitura consultiva**: o relatório abre uma seção própria e o apoio
  passa a ser lido primeiro sob a ótica do que o negócio elegeu.
- Escolha o que o **negócio** considera crítico, não o que tem o pior número.

**Prioridade × gap alto × recomendação** são coisas distintas: a prioridade é uma decisão do cliente;
o gap alto é uma consequência aritmética da resposta; a recomendação é uma possibilidade de apoio
condicionada ao contexto declarado.

---

## 6 · Contexto tecnológico — influência sobre o resultado

Esta é a seção que mais evita mal-entendido.

> **O contexto tecnológico tem influência zero sobre o score de maturidade, mas influência alta
> sobre a interpretação, as recomendações e a utilidade prática do relatório.**

| Componente | Influência do contexto tecnológico |
|---|---|
| Score geral e por domínio | Nenhuma |
| Estágio de maturidade | Nenhuma |
| Suficiência | Nenhuma |
| Gap e severidade derivados das respostas | Nenhuma |
| Classificação operacional do gap | Alta |
| Produto/serviço sugerido | Muito alta |
| Comprar × adotar × expandir × otimizar | Muito alta |
| Supressão de recomendação redundante | Muito alta |
| Rota arquitetural | Alta |
| Conteúdo do relatório | Alta |

> **O assessment informa o diagnóstico; o contexto tecnológico informa a prescrição.**

### 6.1 Estados de presença de uma capability

| Estado na ferramenta | Leitura |
|---|---|
| **Não informado** | não foi declarado. Não é ausência — é desconhecimento |
| **Não existe / não utilizamos** | ausência **confirmada** pelo cliente |
| **Existe parcialmente** | há tecnologia, com cobertura ou escopo incompletos |
| **Existe** | tecnologia presente |
| **Precisa ser validado** | há indício, mas o estado real não foi confirmado |

E, para cada solução declarada, um **status operacional**: `Não informado` · `Em avaliação` ·
`Contratado` · `Em implantação` · `Produção parcial` · `Produção` · `Produção ampla`.

### 6.2 O mesmo gap, cinco leituras

Considere um **gap de centralização de logs** — a resposta foi a mesma, o score é o mesmo em todos os
casos. O que muda é a leitura:

| Contexto declarado | Classificação | Conversa que faz sentido |
|---|---|---|
| Não informado | *Contexto tecnológico não informado* | levantar o que existe antes de recomendar |
| Não existe / não utilizamos | *Ausência confirmada de tecnologia (whitespace)* | lacuna tecnológica: avaliar adoção |
| Contratado ou Em implantação | *Gap de adoção (tecnologia contratada/em implantação)* | acelerar e concluir a adoção em curso |
| Existe parcialmente | *Gap de cobertura (tecnologia parcial/segmentada)* | estender cobertura às fontes que faltam |
| Existe, mas prática imatura | *Gap operacional com tecnologia existente* | operacionalizar o que já foi comprado |
| Precisa ser validado | *Requer validação* | confirmar o estado antes de qualquer proposta |

**Nenhuma dessas classificações altera o score original.** Todas descrevem o mesmo número por ângulos
diferentes.

---

## 7 · Como preencher o contexto tecnológico

| Campo | Para que serve |
|---|---|
| **Presença da capability** | separa desconhecimento de ausência confirmada |
| **Fornecedor e produto** | identifica o que já existe e evita recomendação redundante |
| **Status operacional** | distingue comprado, em implantação e efetivamente operando |
| **Deployment** | on-premises, SaaS ou híbrido — muda a rota viável |
| **Cobertura** | escopo real: total, parcial, por segmento |
| **Capabilities cobertas pela plataforma** | permite suprimir sugestões já atendidas |
| **Arquitetura e restrições** | SaaS permitido, processamento local, ambientes OT, residência de dados e preferência por plataforma unificada |
| **Plataformas, bundles e subscriptions** | o que já está licenciado e pode ser aproveitado |
| **Sinais e preocupações específicas** | requisitos que mudam a leitura consultiva |

> **Contexto desconhecido corretamente marcado é melhor do que contexto detalhado por suposição.**

Marcar `Não informado` é uma resposta legítima e produz um relatório honesto. Preencher por palpite
produz recomendação errada com aparência de precisão.

---

## 8 · Leitura dos resultados

**Score 0–5.** O score **por domínio** é a média das respostas confirmadas daquele domínio,
arredondada a uma casa. O score **geral** é a média dos **cinco scores de domínio** — não a média
direta das respostas. Os dois números diferem quando os domínios têm quantidades distintas de
respostas confirmadas: cada domínio pesa o mesmo no geral, independentemente de quantas perguntas
foram respondidas nele.

**Seis estágios canônicos:** `Inexistente` · `Inicial` · `Gerenciado` · `Definido` ·
`Gerenciado quantitativamente` · `Em otimização`. A régua 0–5 do relatório mostra a posição exata.

**Score geral × por domínio.** O geral resume; o de domínio explica. Um geral confortável pode
esconder um domínio crítico — leia sempre os dois.

**Suficiência.** Antes de emitir veredito executivo, a ferramenta exige evidência mínima. Enquanto
não houver, o resultado executivo aparece **BLOQUEADO**, o painel de suficiência lista exatamente o
que falta e nenhum score de domínio é publicado — todos ficam `n/d`. Isso é intencional: é preferível
não responder a responder mal.

**Confiança / base da leitura.** Cada domínio informa em quantas respostas confirmadas a leitura se
apoia e se elas divergem entre si.

**Radar.** Plota os domínios com score. Domínio `n/d` **não vira vértice em zero** — o ponto é
omitido e a ausência é declarada em texto.

**Heat map.** Visão domínio → pergunta, com os três estados de resposta distinguíveis sem depender de
cor, mais uma tabela equivalente para leitura acessível.

**Jornada de maturidade.** Régua de seis nós numerados de 0 a 5, marcando **Perfil atual**,
**Próximo estágio** e, quando houver, **Cenário-alvo**.

**Gaps.** `Gap alto de maturidade` e `Gap moderado de maturidade`, derivados da resposta. Cada gap
mostra a evidência declarada e a **capability a desenvolver**.

**Finding × recomendação × serviço de apoio:** o *finding* é o gap observado; a *recomendação* é a
possibilidade de tecnologia condicionada ao contexto; o *serviço de apoio* é ajuda para operar.

---

## 9 · Cenário-alvo

- O Target é **cenário desejado**, não promessa nem previsão.
- Definir um alvo **não altera as respostas atuais**, o score atual nem a suficiência.
- O **score-alvo é derivado** das respostas e dos overrides declarados — **não** do contexto
  tecnológico.
- O contexto influencia os **habilitadores** mostrados para alcançar o alvo, não o número.
- **Revise antes de entregar.** Confira se o alvo agregado faz sentido e se não há gap negativo não
  intencional; ajuste a seleção antes de exportar o relatório.
- **Perfil atual** é onde a operação está; **Próximo estágio** é o passo imediatamente seguinte;
  **Cenário-alvo** é aonde se quer chegar — os três podem coincidir ou não.

---

## 10 · Recomendações Fortinet

- Produto exibido é **possibilidade de apoio**, não requisito automático.
- A recomendação depende **do gap e do contexto declarado** — muda quando qualquer um dos dois muda.
- Formas de apresentação: **apoio direto** (ausência confirmada de tecnologia), **apoio contextual**
  (operacionalização e serviços) e **a validar em aprofundamento** (falta contexto para afirmar).
- **"Por que apareceu"** explica a origem da sugestão a partir do que foi declarado. Se essa frase
  não fizer sentido para o cliente, o contexto provavelmente está incompleto.
- Uma **solução existente pode suprimir** nova aquisição: se a capability já é coberta, a ferramenta
  não insiste em comprar.
- Uma **plataforma unificada declarada** pode mudar a recomendação, favorecendo consolidação.
- **Sem contexto, a assertividade cai** — e a ferramenta diz "validar aderência" em vez de recomendar.

Exemplos, com as limitações honestas:

| Solução | Onde faz sentido | Limite explícito |
|---|---|---|
| **FortiAnalyzer** | logging e analytics no ecossistema Fortinet | escopo de logging/analytics, conforme fontes declaradas |
| **FortiSIEM** | SIEM amplo de TI/OT, múltiplas fontes, correlação em escala | depende das fontes e da escala reais |
| **FortiSOAR** | orquestração, automação e resposta | exige processos definidos para automatizar |
| **FortiSOC** | alternativa de plataforma integrada | **condicionada à arquitetura**; nunca obrigatória |
| **FortiClient administrado por EMS** | descoberta, inventário, varredura e patching **de endpoint** | **não é** plataforma universal de gestão de vulnerabilidades |
| **FortiRecon** | exposição externa, EASM e DRPS | **não** cobre vulnerabilidade interna |

Este manual e o relatório **não** trazem preço, SKU, dimensionamento, licenciamento presumido nem
promessa de cobertura. Isso é trabalho de validação técnica e comercial posterior.

---

## 11 · Sessões, continuidade e isolamento entre clientes

> **A aplicação não salva automaticamente.** Se você fechar a aba sem exportar, o trabalho se perde.

- **Exportar sessão** grava um JSON com os dados canônicos; **Importar sessão** os recarrega.
- O documento carrega **rótulo**, **data** e **versão da ferramenta**.
- **Data da sessão × data de geração do relatório são diferentes.** Numa sessão nova, "Data da
  sessão" é o início do trabalho. Num documento importado, o carimbo original é o instante em que
  aquele arquivo foi **exportado** — por isso o relatório o rotula como **"Sessão registrada em"**, e
  não como início da avaliação. Se o documento não trouxer data, o relatório diz
  **"Data original não informada"** em vez de inventar uma.
- **Compatibilidade por engine:** a importação confere a identidade do engine. Documento de engine
  diferente é recusado, não adaptado em silêncio.
- **Importar substitui a sessão ativa por inteiro.** Exporte antes.

**Checklist de isolamento A → B → A:**

1. exporte o JSON do cliente A e confirme que o arquivo existe;
2. recarregue a aplicação para começar limpo;
3. confirme que as respostas estão vazias e o contexto tecnológico voltou a `Não informado`;
4. trabalhe o cliente B e exporte;
5. recarregue de novo antes de reabrir o A;
6. importe o JSON do A e confira rótulo e data antes de continuar.

**Armazenamento.** O JSON e o PDF contêm informação do cliente. Guarde-os no repositório de dados do
cliente, com o mesmo cuidado de qualquer documento de assessment. **Eles não pertencem ao Git.**

---

## 12 · Relatório / PDF

Estrutura, na ordem em que o documento realmente sai:

1. **Capa e metadados** — título, subtítulo, disclaimer, emblema dos cinco domínios, sessão, data da
   sessão, data de geração, versão da ferramenta e a **legenda dos domínios** (nomes completos,
   numerados, na ordem canônica) — a legenda está na capa, não em seção própria;
2. **Resumo de maturidade** — score geral, estágio, suficiência, arquétipo declarado e a **régua
   0–5** com a posição do score entre os seis estágios — a régua está dentro do resumo, antes da
   caixa interpretativa;
3. **Como interpretar este relatório** — caixa curta com as regras de leitura;
4. **Prioridades declaradas pelo negócio**;
5. **Gaps de maturidade observados** — com evidência, capability e caminhos de apoio;
6. **Contexto tecnológico declarado**;
7. **Interpretação do contexto** e **Como a Fortinet pode apoiar**;
8. **Jornada de maturidade** e **leitura executiva**;
9. **Perfil atual × Cenário-alvo de maturidade**;
10. **Anexo — respostas da sessão**, com as observações registradas.

As seções 4 a 9 são condicionais: cada uma só aparece quando a sessão tem o dado correspondente
(prioridade declarada, gap observado, contexto tecnológico informado, alvo declarado).

> O **emblema pentagonal** e a **faixa de cinco segmentos** são identidade visual estática. Não são
> gráfico de score: não mudam com os dados da sessão.

**Checklist pré-entrega:**

- [ ] cliente/sessão corretos no cabeçalho;
- [ ] contexto tecnológico revisado;
- [ ] prioridades corretas;
- [ ] suficiência adequada — ou limitação declarada explicitamente;
- [ ] cenário-alvo coerente, sem gap negativo não intencional;
- [ ] gaps e recomendações revisados um a um;
- [ ] nenhuma informação sensível desnecessária nas observações;
- [ ] PDF aberto e conferido visualmente, página a página;
- [ ] sessão JSON exportada e armazenada no lugar certo.

---

## 13 · Limitações e interpretação responsável

- É **screening**, não assessment formal.
- O resultado **depende da qualidade das respostas**: entrevista apressada produz número frágil.
- **Ausência de contexto reduz a especificidade** das recomendações.
- Recomendação **não substitui validação** técnica e comercial.
- Score **não é certificação** nem comparação de mercado.
- **Não compare clientes** sem controlar escopo, qualidade da evidência e momento da coleta.
- **Não use produto instalado como proxy de maturidade** — é exatamente o que a ferramenta recusa a
  fazer.

---

## 14 · Glossário

| Termo | Significado |
|---|---|
| **assessment** | avaliação estruturada de maturidade; aqui, em formato de screening |
| **evidência** | fato observável que sustenta a resposta |
| **capability** | capacidade operacional avaliada (ex.: centralização de logs) |
| **domínio** | um dos cinco eixos: Negócio, Pessoas, Processos, Tecnologia, Serviços |
| **score** | nota de 0 a 5 derivada das respostas confirmadas |
| **estágio** | faixa qualitativa do score, entre os seis estágios canônicos |
| **suficiência** | evidência mínima exigida antes de publicar veredito executivo |
| **gap** | distância entre a prática declarada e a prática madura |
| **finding** | gap registrado no relatório, com severidade |
| **prioridade** | item que o negócio elegeu como crítico; não altera score |
| **contexto tecnológico** | o que existe de tecnologia, como está e o quanto cobre |
| **Target** | cenário-alvo desejado, declarado por pergunta |
| **mandato formal** | autorização, patrocínio, responsabilidade e autoridade concedidos à operação de segurança para executar sua missão, priorizar ações e responder perante o negócio |
| **recomendação direta** | apoio proposto diante de ausência confirmada de tecnologia |
| **recomendação contextual** | apoio voltado a operacionalizar o que já existe |
| **`n/d`** | não avaliado; **nunca** significa zero |
| **`Não sei · precisa validar`** | resposta honesta de desconhecimento; não pontua e vira item de validação |
