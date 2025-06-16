export default [
  {
    key: 'protocol__icontains',
    label: 'Protocolo',
    type: 'text',
  },
  {
    key: 'project__in',
    label: 'Projeto',
    type: 'async-multiselect',
    endpoint: '/api/projects',
    queryParam: 'q',
    extraParams: { fields: ['id', 'project_number', 'sale.customer.complete_name'], expand: 'sale.customer', limit: 10 },
    mapResponse: (data) =>
      data.results.map((item) => ({ label: `${item.project_number} - ${item.sale.customer.complete_name}`, value: item.id }))
  },
  {
    key: 'responsible__in',
    label: 'Responsável',
    type: 'async-multiselect',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({ label: user.complete_name, value: user.id }))
  },
  {
    key: 'subject__in',
    label: 'Assunto',
    type: 'async-multiselect',
    endpoint: '/api/tickets-subjects',
    queryParam: 'name__icontains',
    extraParams: { fields: ['id', 'subject'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((item) => ({ label: item.subject, value: item.id }))
  },
  {
    key: 'description__icontains',
    label: 'Descrição',
    type: 'text',
  },
  {
    key: 'ticket_type__in',
    label: 'Tipo de chamado',
    type: 'async-multiselect',
    endpoint: '/api/ticket-types',
    queryParam: 'name__icontains',
    extraParams: { fields: ['id', 'name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((item) => ({ label: item.name, value: item.id }))
  },
  {
    key: 'priority',
    label: 'Prioridade',
    type: 'multiselect',
    options: [
      { value: 1, label: 'Baixa' },
      { value: 2, label: 'Média' },
      { value: 3, label: 'Alta' },
    ],
  },
  {
    key: 'responsible_department__in',
    label: 'Departamento responsável',
    type: 'async-multiselect',
    endpoint: '/api/departments',
    queryParam: 'name__icontains',
    extraParams: { fields: ['id', 'name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((item) => ({ label: item.name, value: item.id }))
  },
  {
    key: 'status__in',
    label: 'Status',
    type: 'multiselect',
    options: [
      { value: 'A', label: 'Aberto' },
      { value: 'E', label: 'Em Espera' },
      { value: 'RE', label: 'Respondido' },
      { value: 'R', label: 'Resolvido' },
      { value: 'F', label: 'Fechado' },
    ],
  },
  {
    key: 'conclusion_date__range',
    label: 'Data de conclusão',
    type: 'range',
    inputType: 'date',
  },
  {
    key: 'observer__in',
    label: 'Observador',
    type: 'async-multiselect',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({ label: user.complete_name, value: user.id }))
  },
  {
    key: 'answered_at__range',
    label: 'Respondido em',
    type: 'range',
    inputType: 'date',
  },
  {
    key: 'answered_by__in',
    label: 'Respondido por',
    type: 'async-multiselect',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({ label: user.complete_name, value: user.id }))
  },
  {
    key: 'closed_at__range',
    label: 'Encerrado em',
    type: 'range',
    inputType: 'date',
  },
  {
    key: 'closed_by__in',
    label: 'Encerrado por',
    type: 'async-multiselect',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({ label: user.complete_name, value: user.id }))
  },
  {
    key: 'resolved_at__range',
    label: 'Resolvido em',
    type: 'range',
    inputType: 'date',
  },
  {
    key: 'resolved_by__in',
    label: 'Resolvido por',
    type: 'async-multiselect',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({ label: user.complete_name, value: user.id }))
  },
  {
    key: 'created_by__in',
    label: 'Criado por',
    type: 'async-multiselect',
    endpoint: '/api/users',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({ label: user.complete_name, value: user.id }))
  },
  {
    key: 'created_at__range',
    label: 'Criado em',
    type: 'range',
    inputType: 'date',
  },
  {
    key: 'updated_at__range',
    label: 'Atualizado em',
    type: 'range',
    inputType: 'date',
  },
];