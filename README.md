# Quickscan SecOps · SOC-CMM

Instrumento de **screening indicativo de alto nível** da maturidade de operações de segurança.
Em 15 perguntas distribuídas por cinco domínios — Negócio, Pessoas, Processos, Tecnologia e
Serviços — produz score de 0 a 5, estágio de maturidade, gaps, cenário-alvo, recomendações
contextuais e um relatório em PDF pronto para leitura executiva.

> **Screening indicativo.** Não substitui assessment formal, auditoria, desenho de arquitetura ou
> proposta comercial. O resultado orienta conversa e priorização — não fundamenta contrato sozinho.

## Como usar localmente

A aplicação é um **único arquivo HTML autocontido**: sem servidor obrigatório, sem rede externa, sem
dependência de runtime.

```text
quickscan_secops_soccmm_v3_2_dev.html
```

Abra o arquivo no navegador, ou sirva o diretório por qualquer servidor estático local. Não é
necessária conexão com a internet: a ferramenta não faz requisição externa, não usa CDN, fonte
remota, analytics nem telemetria, e não grava nada no navegador.

Para reconstruir o HTML a partir das camadas do projeto:

```text
python3 build_v32_html.py
```

O build é determinístico: duas execuções sobre as mesmas fontes produzem o mesmo SHA-256.

## Fluxo resumido

1. inicie uma sessão nova ou **importe** um JSON existente;
2. responda com base em evidência observável, usando `Não sei · precisa validar` quando for o caso;
3. registre evidências e observações por pergunta;
4. declare até três prioridades do negócio;
5. informe o contexto tecnológico — **opcional**: ele não muda a nota, mas muda a recomendação;
6. revise resultados, gaps e cenário-alvo;
7. **exporte a sessão** e gere o relatório/PDF.

## Tela de abertura

Os dois caminhos de entrada ficam lado a lado: **Começar o quickscan** e **Adicionar contexto
tecnológico · opcional**, com **Importar sessão** logo abaixo. O emblema dos cinco domínios é
identidade gráfica e traz uma explicação curta por domínio; ele não representa score nem estágio.

## Tela de resultados

Em desktop, o resultado é um workspace com trilho de navegação lateral e nove seções na mesma página,
nesta ordem: **visão executiva · cenário-alvo · contexto tecnológico (opcional) · evidência e
suficiência · domínios e heat map · prioridades do negócio · gaps observados · formas de apoio ·
relatório e sessão**. Nada fica escondido atrás do trilho: ele é um sumário, não um menu de abas.

Quando a evidência é **suficiente**, a tela mostra só a linha *“Qualidade da evidência · Suficiente”*
e guarda o painel técnico no disclosure **“Base de evidência”**; quando é **insuficiente**, o painel
completo sobe para logo depois da visão executiva e o resultado aparece **bloqueado**.

O **cenário-alvo** vem antes do contexto tecnológico porque é decisão de negócio, não de produto:
ele projeta a comparação Current × Target e **não altera as respostas nem o score atual**. Os gaps
aparecem em dois grupos separados — **altos** e **moderados**. Em telas estreitas, o trilho vira uma
barra de seções e o conteúdo passa a uma coluna.

A aplicação **não salva automaticamente**. Exportar o JSON é o que preserva o trabalho — e é o passo
obrigatório antes de trocar de cliente.

## Documentação

O manual completo de utilização e interpretação está em **[`USER_GUIDE.md`](USER_GUIDE.md)**, e cobre
a semântica das respostas, a diferença entre `n/d` e zero, a influência do contexto tecnológico sobre
o resultado, a leitura do relatório, o cenário-alvo, as recomendações e o checklist pré-entrega.

## Identidade da versão

A versão do runtime é publicada pela própria aplicação em `window.__QS_BUILD_META.toolVersion` e
aparece no rodapé de metadados do relatório, junto da identidade do engine. Consulte sempre esses
valores — em vez de anotá-los aqui, onde envelheceriam.

## Dados de cliente

Sessões (`*.session.json`), relatórios em PDF e qualquer evidência de assessment **não pertencem a
este repositório**. Guarde-os no repositório de dados do cliente, com o mesmo cuidado dado a qualquer
documento de avaliação. Não registre segredos, credenciais ou dados pessoais desnecessários nos
campos de evidência.
