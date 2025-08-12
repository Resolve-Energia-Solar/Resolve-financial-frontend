export default [
  {
    key: 'customer__in',
    label: 'Cliente',
    type: 'async-multiselect',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 20 },
    mapResponse: (data) =>
      data.results.map((customer) => ({
        label: customer.complete_name,
        value: customer.id,
      })),
  },
  {
    key: 'supplier__in',
    label: 'Fornecedor',
    type: 'async-multiselect',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 20, user_type__in: 1 },
    mapResponse: (data) =>
      data.results.map((supplier) => ({
        label: supplier.complete_name,
        value: supplier.id,
      })),
  },
  {
    key: 'purchase_date__range',
    label: 'Data da Compra',
    type: 'range',
    inputType: 'date',
  },
  {
    key: 'status__in',
    label: 'Status da Compra',
    type: 'multiselect',
    options: [
      { value: 'R', label: 'Compra realizada' },
      { value: 'C', label: 'Cancelada' },
      { value: 'D', label: 'Distrato' },
      { value: 'A', label: 'Aguardando pagamento' },
      { value: 'P', label: 'Pendente' },
      { value: 'F', label: 'Aguardando Previsão de Entrega' },
    ],
  },
  {
    key: 'purchase_value',
    label: 'Valor da Compra',
    type: 'number',
  },
  {
    key: 'purchase_value__gte',
    label: 'Valor da Compra (Mínimo)',
    type: 'number',
  },
  {
    key: 'purchase_value__lte',
    label: 'Valor da Compra (Máximo)',
    type: 'number',
  },
  {
    key: 'delivery_forecast__range',
    label: 'Previsão de Entrega',
    type: 'range',
    inputType: 'date',
  },
  {
    key: 'delivery_number__icontains',
    label: 'Número de Entrega',
    type: 'text',
  },
];
