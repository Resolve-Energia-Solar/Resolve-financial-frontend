export default [
  // Informações básicas do cliente e venda
  {
    key: 'customer',
    label: 'Cliente',
    type: 'async-autocomplete',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
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

  // Informações de pagamento e financeiras
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

  // Informações técnicas/produto
  {
    key: 'product_kwp',
    label: 'Kwp',
    type: 'number',
  },
  {
    key: 'material_list_is_completed',
    label: 'Lista de Material',
    type: 'select',
    options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' },
      { value: 'null', label: 'Todos' },
    ],
  },

  // Status de projeto e engenharia
  {
    key: 'designer_status',
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
    key: 'homologator',
    label: 'Homologador',
    type: 'async-autocomplete',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    mapResponse: (data) =>
      data.results.map((user) => ({
        label: user.complete_name,
        value: user.id,
      })),
  },
  {
    key: 'status',
    label: 'Status de Homologação',
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
  {
    key: 'is_released_to_engineering',
    label: 'Liberado para Engenharia',
    type: 'select',
    options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' },
      { value: 'null', label: 'Todos' }
    ],
  },

  // Informações de fornecimento e instalação
  {
    key: 'supply_adquance',
    label: 'Adequação de Fornecimento',
    type: 'async-autocomplete',
    endpoint: '/api/supply-adequances',
    queryParam: 'name__icontains',
    mapResponse: (data) =>
      data.results.map((supply) => ({
        label: supply.name,
        value: supply.id,
      })),
  },
  {
    key: 'new_contract_number',
    label: 'Nova UC',
    type: 'select',
    options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' },
      { value: 'null', label: 'Todos' },
    ],
  },
  {
    key: 'access_opnion',
    label: 'Parecer de Acesso',
    type: 'select',
    options: [
      { value: 'liberado', label: 'Liberado' },
      { value: 'bloqueado', label: 'Bloqueado' },
      { value: 'null', label: 'Todos' },
    ],
  },
  {
    key: 'is_released_to_installation',
    label: 'Liberado para Instalação',
    type: 'select',
    options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' },
      { value: 'null', label: 'Todos' }
    ],
  },
  {
    key: 'delivery_status',
    label: 'Status de Entrega',
    type: 'select',
    options: [
      { value: 'Bloqueado', label: 'Bloqueado' },
      { value: 'Liberado', label: 'Liberado' },
      { value: 'Agendado', label: 'Agendado' },
      { value: 'Entregue', label: 'Entregue' },
      { value: 'Cancelado', label: 'Cancelado' },
    ],
  },
];