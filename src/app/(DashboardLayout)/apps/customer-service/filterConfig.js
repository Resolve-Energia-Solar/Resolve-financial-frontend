export default [
  {
    key: 'customer',
    label: 'Cliente',
    type: 'async-autocomplete',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({
        label: user.complete_name,
        value: user.id,
      })),
  },
  {
    key: 'borrower',
    label: 'Tomador',
    type: 'async-autocomplete',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({
        label: user.complete_name,
        value: user.id,
      })),
  },
  {
    key: 'homologator',
    label: 'Homologador',
    type: 'async-autocomplete',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({
        label: user.complete_name,
        value: user.id,
      })),
  },
  {
    key: 'seller',
    label: 'Vendedor',
    type: 'async-autocomplete',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({
        label: user.complete_name,
        value: user.id,
      })),
  },
  {
    key: 'sale_status',
    label: 'Status da Venda',
    type: 'multiselect',
    options: [
      { value: 'P', label: 'Pendente' },
      { value: 'CO', label: 'Concluído' },
      { value: 'EA', label: 'Em Andamento' },
      { value: 'C', label: 'Cancelado' },
      { value: 'D', label: 'Distrato' },
    ],
  },
  {
    key: 'sale_branches',
    label: 'Unidade',
    type: 'async-autocomplete',
    endpoint: '/api/branches',
    queryParam: 'name__icontains',
    mapResponse: (data) =>
      data.results.map((branch) => ({
        label: branch.name,
        value: branch.id,
      })),
  },
  {
    key: 'signature_date',
    label: 'Data de Contrato',
    type: 'range',
    inputType: 'date',
  },
  {
    key: 'payment_types',
    label: 'Tipo de Pagamentos',
    type: 'multiselect',
    options: [
      { value: 'C', label: 'Crédito' },
      { value: 'D', label: 'Débito' },
      { value: 'B', label: 'Boleto' },
      { value: 'F', label: 'Financiamento' },
      { value: 'PI', label: 'Parcelamento interno' },
      { value: 'P', label: 'Pix' },
      { value: 'T', label: 'Transferência Bancária' },
      { value: 'DI', label: 'Dinheiro' },
      { value: 'PA', label: 'Poste auxiliar' },
      { value: 'RO', label: 'Repasse de Obra' },
      { value: 'ND', label: 'Nota de Débito' },
    ],
  },
  {
    key: 'financiers',
    label: 'Financiadora',
    type: 'async-autocomplete',
    endpoint: '/api/financiers',
    queryParam: 'name__icontains',
    mapResponse: (data) =>
      data.results.map((financier) => ({
        label: financier.name,
        value: financier.id,
      })),
  },
  {
    key: 'invoice_status',
    label: 'Tipo da Nota Fiscal',
    type: 'multiselect',
    options: [
      { value: 'E', label: 'Emitida' },
      { value: 'L', label: 'Liberada' },
      { value: 'P', label: 'Pendente' },
      { value: 'C', label: 'Cancelada' },
    ],
  },
];
