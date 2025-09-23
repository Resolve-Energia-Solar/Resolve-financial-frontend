import AutoCompleteBeneficiary from '@/app/components/apps/financial-record/beneficiaryInput';
import AutoCompleteCategory from '@/app/components/apps/financial-record/categoryInput';
import AutoCompleteDepartment from '@/app/components/apps/financial-record/departmentInput';
import AutoCompleteProject from '@/app/components/apps/inspections/auto-complete/Auto-input-Project';

export default [
  // **Informações Gerais**
  {
    key: 'client_supplier_code',
    label: 'Beneficiário (Omie)',
    type: 'custom',
    customComponent: AutoCompleteBeneficiary,
    customTransform: (value) => (value && typeof value === 'object' ? value.codigo_cliente : value),
  },
  {
    key: 'category_code__icontains',
    label: 'Categoria (Omie)',
    type: 'custom',
    customComponent: AutoCompleteCategory,
    customTransform: (value) => (value && typeof value === 'object' ? value.codigo : value),
  },

  // **Protocolos e Fatura**
  {
    key: 'protocol__in',
    label: 'Protocolo(s)',
    type: 'async-multiselect',
    endpoint: '/api/financial-records/',
    queryParam: 'protocol__icontains',
    extraParams: { fields: 'protocol,client_supplier_name' },
    mapResponse: (data) =>
      data.results.map((financialRecord) => ({
        label: `${financialRecord.protocol} - ${financialRecord.client_supplier_name}`,
        value: financialRecord.protocol,
      })),
  },
  { key: 'invoice_number__icontains', label: 'Número da Fatura (Contém)', type: 'text' },

  // **Status e Situação**
  {
    key: 'bug',
    label: 'Com Erro?',
    type: 'checkbox',
    inputType: 'checkbox',
    trueLabel: 'Com erro',
    falseLabel: 'Sem erro',
  },
  {
    key: 'status__in',
    label: 'Status',
    type: 'multiselect',
    options: [
      { label: 'Solicitada', value: 'S' },
      { label: 'Em Andamento', value: 'E' },
      { label: 'Paga', value: 'P' },
      { label: 'Cancelada', value: 'C' },
    ],
  },
  {
    key: 'payment_status__in',
    label: 'Status de Pagamento',
    type: 'multiselect',
    options: [
      { label: 'Paga', value: 'PG' },
      { label: 'Pendente', value: 'P' },
      { label: 'Cancelada', value: 'C' },
    ],
  },
  {
    key: 'responsible_status__in',
    label: 'Status do Responsável',
    type: 'multiselect',
    options: [
      { label: 'Aprovada', value: 'A' },
      { label: 'Pendente', value: 'P' },
      { label: 'Reprovada', value: 'R' },
    ],
  },
  {
    key: 'audit_status__in',
    label: 'Status de Auditoria',
    type: 'multiselect',
    options: [
      { label: 'Aprovado', value: 'A' },
      { label: 'Reprovado', value: 'R' },
      { label: 'Aguardando Aprovação', value: 'AA' },
      { label: 'Em Análise', value: 'EA' },
      { label: 'Cancelado', value: 'C' },
    ],
  },

  // **Datas**
  {
    key: 'service_date__range',
    label: 'Serviço realizado entre',
    type: 'range',
    inputType: 'date',
  },
  { key: 'due_date__range', label: 'Vencimento entre', type: 'range', inputType: 'date' },
  { key: 'created_at__range', label: 'Criado entre', type: 'range', inputType: 'date' },
  {
    key: 'responsible_response_date__range',
    label: 'Aprovada entre',
    type: 'range',
    inputType: 'date',
  },
  { key: 'paid_at__range', label: 'Paga entre', type: 'range', inputType: 'date' },

  // **Valores**
  {
    key: 'value_range',
    label: 'Valor',
    type: 'number-range',
    subkeys: { min: 'value__gte', max: 'value__lte' },
  },

  // **Outros**
  { key: 'notes__icontains', label: 'Observação (Contém)', type: 'text' },
  {
    key: 'requester',
    label: 'Solicitante',
    type: 'async-autocomplete',
    endpoint: '/api/users/',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({ label: user.complete_name, value: user.id })),
  },
  {
    key: 'responsible',
    label: 'Gestor',
    type: 'async-autocomplete',
    endpoint: '/api/users/',
    queryParam: 'complete_name__icontains',
    extraParams: { fields: ['id', 'complete_name'], limit: 10 },
    mapResponse: (data) =>
      data.results.map((user) => ({ label: user.complete_name, value: user.id })),
  },
  { key: 'responsible_notes__icontains', label: 'Observação do Gestor (Contém)', type: 'text' },
  {
    key: 'project',
    label: 'Projeto (Cliente)',
    type: 'custom',
    customComponent: AutoCompleteProject,
    customTransform: (value) => (value && typeof value === 'object' ? value.id : value),
  },

  // **Departamentos**
  { key: 'requesting_department', label: 'Departamento Solicitante', type: 'text' },
  {
    key: 'department_code__icontains',
    label: 'Departamento Causador (Omie)',
    type: 'custom',
    customComponent: AutoCompleteDepartment,
    customTransform: (value) =>
      value && typeof value === 'object'
        ? { codigo: value.codigo, descricao: value.descricao }
        : value,
  },
];
