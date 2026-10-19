# Comparação com a planilha tratada

Referência da revisão: `dados/vendas_porsche_tratadas.xlsx`, aba “Vendas tratadas”, com as orientações da aba “Notas do tratamento”. A planilha tratada prevalece nesta versão.

## Conciliação por código de venda

A comparação usou `sale_id` como chave, sem depender da ordem das linhas. Foram verificados 100 IDs distintos, sem registros ausentes nem adicionais. Nenhuma divergência foi encontrada nos campos comuns após converter preço e ano para número.

| Campo original sanitizado | Campo tratado | Diferenças |
|---|---|---:|
| SaleDateSanitized | sale_date | 0 |
| PorscheModelSanitized | model | 0 |
| ModelYearSanitized | model_year | 0 |
| SalesPriceSanitized | sale_price | 0 |
| PayMethodSanitized | payment_method | 0 |
| CitySanitized | city | 0 |
| StateSanitized | state | 0 |
| DeliveryStatusSanitized | delivery_status | 0 |

## Alterações aplicadas à dashboard

- Quilometragem removida de JSON, CSV e exportação, conforme as notas da planilha tratada, que classificam esses valores como duvidosos.
- Coluna `family` incorporada como família do modelo: 718 (12), 911 (23), Cayenne (18), Macan (17), Taycan (16) e Panamera (14), incluindo todos os registros.
- Coluna `status_group` incorporada: Entregue (41), Em andamento (52), Cancelada (7).
- Acrescentados filtros de família e grupo de status e as respectivas colunas na tabela e na exportação.
- Script de preparação atualizado para ler a estrutura da planilha tratada, agora incluída no pacote para reprodução.
- Mantidas as três fotografias oficiais incorporadas ao HTML.

As 24 datas INVALID permanecem nulas. A dashboard não faz análises de tendência temporal; o filtro de ano da venda permite somente recortar as datas válidas e identificar as inválidas. O ano do modelo tem filtro independente.

## Totais conciliados

| Recorte | Pedidos | Valor em USD |
|---|---:|---:|
| Base completa, incluindo cancelados | 100 | 12.827.800,50 |
| Sem cancelados, padrão inicial | 93 | 12.202.550,50 |
| CA, incluindo cancelados | 16 | 1.973.350,00 |

O filtro de grupo de status respeita a regra global: para visualizar “Cancelada”, é necessário marcar “Incluir pedidos cancelados”. Caso contrário, o resultado vazio é esperado.

As verificações da lógica real do HTML passaram com as oito dimensões de filtro, agregações, recorte vazio e limpeza. A inspeção visual em navegador permanece pendente.
