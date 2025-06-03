export default [
    {
        key: 'schedule_date__range',
        label: 'Data do Agendamento (Entre)',
        type: 'range',
        inputType: 'date',
    },
    {
        key: 'status__in',
        label: 'Status do Agendamento',
        type: 'multiselect',
        options: [
            { value: 'Pendente', label: 'Pendente' },
            { value: 'Confirmado', label: 'Confirmado' },
            { value: 'Cancelado', label: 'Cancelado' },
        ],
    },
    {
        key: 'service_opinion__in',
        label: 'Parecer do Serviço',
        type: 'async-multiselect',
        endpoint: '/api/service-opinions/',
        queryParam: 'name__icontains',
        extraParams: {
            is_final_opinion: false,
            limit: 10,
            fields: ['id', 'name', 'service.name'],
            expand: 'service'
        },
        mapResponse: (data) =>
            data.results.map((opinion) => ({
                label: `${opinion.name} - ${opinion.service?.name}`,
                value: opinion.id,
            })),
    },
    {
        key: 'final_service_opinion__in',
        label: 'Parecer Final do Serviço',
        type: 'async-multiselect',
        endpoint: '/api/service-opinions/',
        queryParam: 'name__icontains',
        extraParams: {
            is_final_opinion: true,
            limit: 10,
            fields: ['id', 'name', 'service.name'],
            expand: 'service'
        },
        mapResponse: (data) =>
            data.results.map((opinion) => ({
                label: `${opinion.name} - ${opinion.service?.name}`,
                value: opinion.id,
            })),
    },
    {
        key: 'final_service_is_null',
        label: 'Parecer Final do Serviço Pendente',
        type: 'select',
        options: [
            { value: 'null', label: 'Todos' },
            { value: true, label: 'Pendente' },
            { value: 'false', label: 'Concluído' },
        ],
    },
    {
        key: 'service_opnion_is_null',
        label: 'Parecer do Serviço Pendente',
        type: 'select',
        options: [
            { value: 'null', label: 'Todos' },
            { value: true, label: 'Pendente' },
            { value: 'false', label: 'Concluído' },
        ],
    },
    {
        key: 'schedule_agent__in',
        label: 'Agente de Campo',
        type: 'async-multiselect',
        endpoint: '/api/users/',
        queryParam: 'complete_name__icontains',
        extraParams: { fields: ['id', 'complete_name'], limit: 10 },
        mapResponse: (data) =>
            data.results.map((user) => ({
                label: user.complete_name,
                value: user.id,
            })),
    },
    {
        key: 'customer',
        label: 'Cliente',
        type: 'async-autocomplete',
        endpoint: '/api/users/',
        queryParam: 'complete_name__icontains',
        extraParams: { fields: ['id', 'complete_name'], limit: 10 },
        mapResponse: (data) =>
            data.results.map((customer) => ({
                label: customer.complete_name,
                value: customer.id,
            })),
    },
    {
        key: 'branch__in',
        label: 'Unidade',
        type: 'async-multiselect',
        endpoint: '/api/branches/',
        queryParam: 'name__icontains',
        extraParams: { limit: 10, fields: ['id', 'name'] },
        mapResponse: (data) =>
            data.results.map((branch) => ({
                label: branch.name,
                value: branch.id,
            })),
    },
];