# Briefing de geração e decisões

O pedido original foi o enunciado do desafio DIO, acompanhado da planilha. Abaixo está a especificação consolidada usada para orientar esta implementação. É uma documentação do briefing, não uma transcrição de chamadas a outro agente.

> Crie uma dashboard em um único index.html, em português, usando apenas HTML, CSS e JavaScript e os campos sanitizados da planilha Porsche. Incorpore os dados no HTML para funcionar offline e no GitHub Pages, sem bibliotecas ou fontes externas. Responda: quais modelos concentram o maior valor em pedidos; quais estados concentram esse valor; quais métodos de pagamento são mais frequentes. Inclua indicadores de valor total, quantidade, ticket médio e estados, além de filtros combináveis por modelo, estado, cidade, ano da venda, ano do modelo e pagamento. Use preto, branco quente, vermelho e dourado discreto, tipografia de sistema e layout responsivo. Mostre os valores em USD. Remova nomes de clientes e vendedores. Preserve datas INVALID como nulas, sem inventar datas. Exclua cancelados por padrão, oferecendo opção para incluí-los. Explique que valor de pedidos não equivale a receita contábil ou recebida. Inclua tabela, exportação CSV e estado vazio claro.

## Refinamentos definidos após inspecionar a base

- A base contém 24 datas INVALID: elas viraram nulas, com opção “Data inválida” no filtro de ano.
- Existem 7 pedidos cancelados: foram excluídos por padrão, sem apagar registros.
- A coluna monetária de origem usa dólares: foi mantida em USD, sem conversão cambial.
- Ano do modelo e ano da venda são conceitos diferentes: receberam filtros separados.
- Há 40 modelos: os gráficos financeiros exibem top 8 mais “Demais”, evitando uma lista excessiva e preservando o total.
- Há status ainda não entregues: o indicador foi chamado de “Valor dos pedidos”, sem alegar receita reconhecida.
- A data futura de parte da base foi explicitada como característica dos dados de estudo.

## Ferramenta utilizada

Projeto desenvolvido com assistência do ChatGPT/Codex, usando instruções de habilidades para Sites e leitura de Planilhas. Não houve uso de Canvas nem criação de um GPT/agente personalizado. Não foi feita comparação entre os dois caminhos; isso permanece como evolução opcional.

## Refinamento solicitado pelo usuário

O usuário esclareceu que se referia ao Canvas do ChatGPT e pediu fotografias reais do site Porsche. A versão seguinte ganhou hero editorial com foto oficial do 911 Carrera, galeria expansível de movimento e interior e créditos visíveis. As fotografias foram incorporadas ao HTML para manter funcionamento offline. A edição foi feita no ambiente ChatGPT/Codex; não foi aberta a interface Canvas.

## Revisão com planilha tratada

A pedido do usuário, comparados os registros pelo sale_id. Nenhuma diferença nos campos compartilhados; a planilha tratada acrescenta family e status_group e exclui quilometragem. Esses campos derivados foram incorporados como filtros e colunas, e a quilometragem foi removida. A planilha tratada tornou-se a fonte de referência.
