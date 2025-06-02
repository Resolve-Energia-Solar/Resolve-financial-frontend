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
    key: 'construction_status__in',
    label: 'Status da Obra',
    type: 'multiselect',
    options: [
      { value: 'P', label: 'Pendente' },
      { value: 'F', label: 'Finalizada' },
      { value: 'C', label: 'Cancelada' },
      { value: 'EA', label: 'Em Andamento' },
    ],
  },
  {
    key: 'forecast_date',
    label: 'Data de Previsão',
    type: 'range',
    inputType: 'date',
  },
  {
    key: 'work_responsibility',
    label: 'Responsabilidade da Obra',
    type: 'multiselect',
    options: [
      { value: 'C', label: 'Cliente' },
      { value: 'F', label: 'Franquia' },
      { value: 'O', label: 'Centro de Operações' },
    ],
  },
  {
    key: 'is_customer_aware_of_construction',
    label: 'Cliente Ciente',
    type: 'select',
    options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' },
      { value: 'null', label: 'Todos' },
    ],
  },
  {
    key: 'inspection_status',
    label: 'Parecer Final da Vistoria',
    type: 'async-multiselect',
    endpoint: '/api/service-opinions',
    queryParam: 'name__icontains',
    extraParams: {
      is_final_opinion: true,
      limit: 20,
      fields: ['id', 'name', 'service.name'],
      expand: 'service',
      service__in: process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID,
    },
    mapResponse: (data) =>
      data.results.map((opinion) => ({
        label: `${opinion.name} - ${opinion.service?.name}`,
        value: opinion.id,
      })),
  },
  {
    key: 'project_status',
    label: 'Status do Projeto',
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
    key: 'delivery_status',
    label: 'Status de Entrega',
    type: 'multiselect',
    options: [
      { value: 'Bloqueado', label: 'Bloqueado' },
      { value: 'Liberado', label: 'Liberado' },
      { value: 'Agendado', label: 'Agendado' },
      { value: 'Entregue', label: 'Entregue' },
      { value: 'Cancelado', label: 'Cancelado' },
    ],
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
  {
    key: 'is_released_to_engineering',
    label: 'Liberado para Engenharia',
    type: 'select',
    options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' },
      { value: 'null', label: 'Todos' },
    ],
  },
  {
    key: 'product_kwp',
    label: 'Kwp',
    type: 'number',
  },
  {
    key: 'trt_status',
    label: 'Status de TRT',
    type: 'multiselect',
    options: [
      { value: 'P', label: 'Pendente' },
      { value: 'A', label: 'Aprovado' },
      { value: 'EA', label: 'Em Andamento' },
      { value: 'R', label: 'Recusado' },
    ],
  },
];
