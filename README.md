# Porsche Sales Intelligence

Dashboard educacional desenvolvida com assistência de IA para o desafio DIO. HTML único, dados e fotografias oficiais incorporados, filtros combináveis e visual em preto, branco quente, vermelho e dourado, com Arial/Helvetica do sistema. As fotos do 911 Carrera vêm do Porsche Newsroom; consulte [IMAGENS.md](IMAGENS.md) para créditos e URLs de origem.

**Status:** implementação preparada e verificações de lógica concluídas. Publicação no GitHub Pages e evidências visuais ainda pendentes. Não existe um endereço publicado confirmado nesta entrega.

## Perguntas de negócio

| Pergunta | Visual | Por que analisar |
|---|---|---|
| Quais modelos geram mais valor em pedidos? | Barras de valor por modelo, top 8 + demais | Identificar a contribuição comercial do portfólio. |
| Em quais estados o valor dos pedidos se concentra? | Barras de valor por estado, top 8 + demais | Orientar a análise de concentração geográfica. |
| Quais métodos de pagamento predominam? | Barras de quantidade e participação por método | Entender o perfil de pagamento dos pedidos. |

O painel não tem dados de custos, margem, metas ou valores recebidos; portanto, não infere rentabilidade nem liquidação financeira.

## Como abrir

Baixe e abra `index.html` em um navegador moderno. Não é necessário servidor, instalação, internet ou chave de API. Todos os filtros afetam indicadores, gráficos, insights e tabela. A exportação CSV usa o recorte atual.

Filtros: família, grupo de status, modelo, estado, cidade, ano da venda, ano do modelo e pagamento. O botão “Limpar filtros” restaura a visão inicial, que exclui cancelados. Combinações sem registros exibem um aviso e ticket médio indefinido, sem divisão por zero.

## Preparação dos dados

Fonte original: [planilha sanitizada fornecida pela DIO](https://hermes.dio.me/files/assets/8683bed0-cc33-4e06-bca9-04db9c31f9e2.xlsx). A cópia anexada e o download da fonte têm o mesmo SHA-256: `f874650657ca4e1a99fd4462b297bfc5fd9915e8e693956d9cec47eda2cb2e2d`.

- Fonte de referência desta versão: `dados/vendas_porsche_tratadas.xlsx`, enviada pelo usuário. Usados `sale_date`, `model`, `model_year`, `sale_price`, `payment_method`, `city`, `state`, `delivery_status`, `family` e `status_group`. O `sale_id` foi usado para comparar as bases e não é incorporado ao HTML/CSV/JSON.
- A quilometragem foi removida conforme as notas da planilha tratada. Os campos `family` e `status_group` foram preservados e adicionados como filtros, colunas da tabela e campos do CSV exportado.
- A comparação por `sale_id` encontrou os mesmos 100 registros e nenhuma divergência nos oito campos compartilhados. Veja [COMPARACAO.md](COMPARACAO.md).
- Preço convertido para número; ano do modelo convertido para inteiro. Cálculos monetários somam centavos inteiros para evitar erros usuais de ponto flutuante.
- As 24 datas `INVALID` foram convertidas em nulas. Nenhum registro foi removido por data inválida e nenhuma data foi inferida. Esses registros ficam fora de um ano específico, mas aparecem em “Todos” e “Data inválida”.
- As datas válidas abrangem 2024–2027, enquanto anos de modelo abrangem 2020–2026. Datas futuras pertencem à base didática e não são prova de vendas realizadas.
- Foram mantidos os status sanitizados. Os 7 cancelados ficam fora da visão inicial e podem ser incluídos pela caixa de seleção.
- Nomes de clientes e vendedores, identificadores e campos crus foram excluídos dos arquivos publicáveis. A planilha original não acompanha o pacote para evitar publicar essas colunas. A planilha tratada acompanha o pacote; ela não contém nomes de clientes ou vendedores.
- Não há fórmulas Excel nem dependência de células na dashboard. JSON e CSV contêm valores.
- Valores mantidos em USD, conforme a origem. Nenhuma conversão para reais foi aplicada. “Valor dos pedidos” representa soma de preços, não receita contábil reconhecida.

Reprodução do tratamento, com Python 3 e biblioteca padrão:

```bash
python scripts/preparar_base.py dados/vendas_porsche_tratadas.xlsx
```

O script recria `dados/vendas.json` e `dados/vendas.csv` e atualiza o bloco incorporado em `index.html`. Ele foi feito para esta estrutura e exige os 100 registros do desafio. Não deduplicamos registros por semelhança: vendas distintas podem ter os mesmos atributos.

## Validação

```bash
node scripts/verificar.cjs
```

Verificações executadas sobre a lógica real do HTML com DOM simulado:

- 100 registros; soma completa de **US$ 12.827.800,50**, incluindo cancelados.
- 24 datas inválidas; 7 cancelados; visão inicial com 93 pedidos.
- Valor inicial sem cancelados: **US$ 12.202.550,50**. Recorte CA incluindo cancelados: **US$ 1.973.350,00** em 16 pedidos.
- Todas as opções dos oito filtros, somatórios, gráficos conciliados, limpeza e combinação sem resultados.
- Exemplo reproduzível: marque “Incluir pedidos cancelados” e selecione estado **CA**. O painel deve mostrar **16 pedidos**. Limpe os filtros para voltar aos 93 não cancelados.

Limites da validação: não foi executada inspeção visual em navegador neste ambiente. Layout responsivo, download CSV, screenshots e link online precisam de conferência antes da submissão. Não foram incluídos prints fictícios nem imagens simuladas como prova de execução.

## Prompt e uso de IA

Veja [PROMPTS.md](PROMPTS.md), com a especificação consolidada e os refinamentos motivados pelos dados. A implementação usou ChatGPT/Codex com instruções de habilidades. Não foi feita no Canvas nem em um GPT personalizado; não houve comparação entre esses dois caminhos.

## Publicar no GitHub Pages

1. Crie na sua conta um repositório público chamado `dashboard-porsche-sales`.
2. Envie o conteúdo desta pasta para a raiz do repositório: `index.html` deve ficar na raiz.
3. No repositório, abra **Settings → Pages**, selecione publicação por branch e escolha **main / (root)**. Os rótulos podem variar conforme a interface.
4. Aguarde a publicação e copie o endereço fornecido pelo GitHub.
5. Teste os oito filtros, cancelados, limpeza, ausência de resultados, CSV e visual no celular.
6. Atualize a linha de status deste README com o endereço real e tire dois prints: visão inicial e recorte de CA incluindo cancelados. Acrescente os prints ao repositório e só então referencie-os no README.
7. Envie à DIO o link do **repositório público**, e não apenas o link da dashboard.

Não há link inventado nesta documentação. A publicação na conta do usuário depende de conexão e acesso ao GitHub.

Referência de publicação: [documentação oficial do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Arquivos

| Arquivo | Finalidade |
|---|---|
| `index.html` | Dashboard autossuficiente |
| `dados/vendas_porsche_tratadas.xlsx` | Planilha tratada enviada pelo usuário, usada como referência |
| `dados/vendas.csv` | Base preparada, sem nomes |
| `dados/vendas.json` | Mesma base em JSON |
| `scripts/preparar_base.py` | Tratamento reproduzível |
| `scripts/verificar.cjs` | Verificações de lógica |
| `PROMPTS.md` | Briefing consolidado e decisões |
| `COMPARACAO.md` | Comparação da base original com a planilha tratada |
| `IMAGENS.md` | Créditos e fontes das fotografias oficiais |
| `README.md` | Perguntas, metodologia e publicação |

Projeto de portfólio independente. Não afiliado à Porsche.
