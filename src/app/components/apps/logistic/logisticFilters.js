const states = [
    { value: 'AC', label: 'AC' },
    { value: 'AL', label: 'AL' },
    { value: 'AP', label: 'AP' },
    { value: 'AM', label: 'AM' },
    { value: 'BA', label: 'BA' },
    { value: 'CE', label: 'CE' },
    { value: 'DF', label: 'DF' },
    { value: 'ES', label: 'ES' },
    { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' },
    { value: 'MT', label: 'MT' },
    { value: 'MS', label: 'MS' },
    { value: 'MG', label: 'MG' },
    { value: 'PA', label: 'PA' },
    { value: 'PB', label: 'PB' },
    { value: 'PR', label: 'PR' },
    { value: 'PE', label: 'PE' },
    { value: 'PI', label: 'PI' },
    { value: 'RJ', label: 'RJ' },
    { value: 'RN', label: 'RN' },
    { value: 'RS', label: 'RS' },
    { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' },
    { value: 'SC', label: 'SC' },
    { value: 'SP', label: 'SP' },
    { value: 'SE', label: 'SE' },
    { value: 'TO', label: 'TO' },
  ];

const projectFilterConfig = [
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
      key: 'state',
      label: 'Estado',
      type: 'select',
      options: states,
    },
    {
      key: 'city',
      label: 'Cidade',
      type: 'text',
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
        { value: '', label: 'Repasse de Obra' },
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
      key: 'attachments_status',
      label: 'Status do Anexo',
      type: 'multiselect',
      options: [
        { value: 'EA', label: 'Em Análise' },
        { value: 'A', label: 'Aprovado' },
        { value: 'R', label: 'Recusado' },
        { value: 'P', label: 'Parcial' },
      ],
    },
  ];
