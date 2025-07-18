export default [
    // Status da Venda
    {
        key: 'status__in',
        label: 'Status da Venda',
        type: 'multiselect',
        options: [
            { value: 'F', label: 'Finalizado' },
            { value: 'EA', label: 'Em Andamento' },
            { value: 'P', label: 'Pendente' },
            { value: 'C', label: 'Cancelado' },
            { value: 'D', label: 'Distrato' },
            { value: 'ED', label: 'Em Processo de Distrato' },
        ],
    },
    // Status da Nota Fiscal
    {
        key: 'invoice_status',
        label: 'Status da Nota Fiscal',
        type: 'multiselect',
        options: [
            { value: 'E', label: 'Emitida' },
            { value: 'L', label: 'Liberada' },
            { value: 'P', label: 'Pendente' },
            { value: 'C', label: 'Cancelada' },
        ],
    },
    // Status do Financeiro
    {
        key: 'payment_status__in',
        label: 'Status do Financeiro',
        type: 'multiselect',
        options: [
            { value: 'P', label: 'Pendente' },
            { value: 'L', label: 'Liberado' },
            { value: 'C', label: 'Concluído' },
            { value: 'CA', label: 'Cancelado' },
        ],
    },
    // Tag única
    {
        key: 'tag_name__exact',
        label: 'Tag',
        type: 'select',
        options: [
            { value: 'Documentação Parcial', label: 'Documentação Parcial' }
        ],
    },
    // Documentos em Análise
    {
        key: 'documents_under_analysis',
        label: 'Documentos em Análise',
        type: 'select',
        options: [
            { value: '', label: 'Todos' },
            { value: 'true', label: 'Em Análise' },
            { value: 'false', label: 'Sem documento em análise' },
        ],
    },
    // Parecer Final Vistoria
    {
        key: 'final_service_options',
        label: 'Parecer Final da Vistoria',
        type: 'async-multiselect',
        endpoint: '/api/service-opinions/',
        queryParam: 'search',
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
    // Tipo de Venda
    {
        key: 'is_pre_sale',
        label: 'Tipo de Venda',
        type: 'multiselect',
        options: [
            { value: 'true', label: 'Pré-Venda' },
            { value: 'false', label: 'Venda' },
        ],
    },
    // Assinatura
    {
        key: 'is_signed',
        label: 'Assinatura',
        type: 'multiselect',
        options: [
            { value: true, label: 'Assinado' },
            { value: false, label: 'Não Assinado' },
        ],
    },
    // Intervalos de datas
    {
        key: 'signature_date__range',
        label: 'Data de Contrato',
        type: 'range',
        inputType: 'date',
    },
    {
        key: 'document_completion_date__range',
        label: 'Data de Conclusão',
        type: 'range',
        inputType: 'date',
    },
    {
        key: 'billing_date__range',
        label: 'Data de Competência',
        type: 'range',
        inputType: 'date',
    },
    {
        key: 'created_at__range',
        label: 'Data de Criação',
        type: 'range',
        inputType: 'date',
    },
    {
        key: 'branch__in',
        label: 'Unidade',
        type: 'async-multiselect',
        endpoint: '/api/branches/',
        queryParam: 'name__icontains',
        extraParams: { limit: 50, fields: ['id', 'name'] },
        mapResponse: (data) =>
            data.results.map((branch) => ({
                label: branch.name,
                value: branch.id,
            })),
    },
    {
        key: 'marketing_campaign__in',
        label: 'Campanha',
        type: 'async-multiselect',
        endpoint: '/api/marketing-campaigns/',
        queryParam: 'name__icontains',
        extraParams: { limit: 20, fields: ['id', 'name'] },
        mapResponse: (data) =>
            data.results.map((campaign) => ({
                label: campaign.name,
                value: campaign.id,
            })),
    },
    {
        key: 'customer__in',
        label: 'Cliente',
        type: 'async-multiselect',
        endpoint: '/api/users/',
        queryParam: 'complete_name__icontains',
        extraParams: {
            limit: 10,
            fields: ['id', 'complete_name'],
        },
        mapResponse: (data) =>
            data.results.map((customer) => ({
                label: customer.complete_name,
                value: customer.id,
            })),
    },
    {
        key: 'seller__in',
        label: 'Vendedor',
        type: 'async-multiselect',
        endpoint: '/api/users/',
        queryParam: 'complete_name__icontains',
        extraParams: {
            limit: 10,
            fields: ['id', 'complete_name'],
        },
        mapResponse: (data) =>
            data.results.map((seller) => ({
                label: seller.complete_name,
                value: seller.id,
            })),
    },
    {
        key: 'borrower__in',
        label: 'Tomador',
        type: 'async-multiselect',
        endpoint: '/api/users/',
        queryParam: 'complete_name__icontains',
        extraParams: {
            limit: 10,
            fields: ['id', 'complete_name'],
        },
        mapResponse: (data) =>
            data.results.map((borrower) => ({
                label: borrower.complete_name,
                value: borrower.id,
            })),
    },
];