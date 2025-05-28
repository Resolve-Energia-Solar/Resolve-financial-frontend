export default [
    // Status
    {
        key: 'is_active', label: 'Ativo?', type: 'select',
        options: [
            { label: 'Sim', value: 'true' },
            { label: 'Não', value: 'false' },
            { label: 'Todos', value: '' }
        ]
    },
    {
        key: 'is_staff', label: 'Funcionário?', type: 'select',
        options: [
            { label: 'Sim', value: 'true' },
            { label: 'Não', value: 'false' },
            { label: 'Todos', value: '' }
        ]
    },
    {
        key: 'is_superuser', label: 'Superusuário?', type: 'select',
        options: [
            { label: 'Sim', value: 'true' },
            { label: 'Não', value: 'false' },
            { label: 'Todos', value: '' }
        ]
    },

    // Datas
    { key: 'last_login__range', label: 'Último Login', type: 'range', inputType: 'datetime-local', },
    { key: 'date_joined__range', label: 'Data de Admissão', type: 'range', inputType: 'datetime-local', },
    { key: 'birth_date__range', label: 'Data de Nascimento', type: 'range', inputType: 'date', },

    // Informações Pessoais
    { key: 'complete_name__icontains', label: 'Nome Completo', type: 'string' },
    {
        key: 'gender__in', label: 'Gênero', type: 'select',
        options: [
            { label: 'Masculino', value: 'M' },
            { label: 'Feminino', value: 'F' },
            { label: 'Todos', value: '' }
        ]
    },
    {
        key: 'person_type__in', label: 'Tipo de Pessoa', type: 'select',
        options: [
            { label: 'Pessoa Física', value: 'PF' },
            { label: 'Pessoa Jurídica', value: 'PJ' },
            { label: 'Todos', value: '' }
        ]
    },

    // Documentos
    { key: 'first_document__icontains', label: 'CPF/CNPJ', type: 'string' },
    { key: 'second_document__icontains', label: 'RG/Inscrição Estadual', type: 'string' },

    // Credenciais
    { key: 'username__icontains', label: 'Nome de Usuário', type: 'string' },
    { key: 'email__icontains', label: 'E-mail', type: 'string' },

    // Associações
    {
        key: 'groups__in', label: 'Grupos', type: 'async-multiselect',
        endpoint: '/api/groups', queryParam: 'name__icontains',
        extraParams: { fields: ['id', 'name'], limit: 10 },
        mapResponse: data => data.results.map(u => ({ label: u.name, value: u.id }))
    },
    {
        key: 'user_types__in', label: 'Tipos de Usuário', type: 'async-multiselect',
        endpoint: '/api/users-types', queryParam: 'name__icontains',
        extraParams: { fields: ['id', 'name'], limit: 10 },
        mapResponse: data => data.results.map(u => ({ label: u.name, value: u.id }))
    },
    {
        key: 'user_permissions__in', label: 'Permissões', type: 'async-multiselect',
        endpoint: '/api/permissions', queryParam: 'codename__icontains',
        extraParams: { fields: ['id', 'codename'], limit: 10 },
        mapResponse: data => data.results.map(u => ({ label: u.codename, value: u.id }))
    },

    // Emprego
    {
        key: 'employee__role__in', label: 'Cargos', type: 'async-multiselect',
        endpoint: '/api/roles', queryParam: 'name__icontains',
        extraParams: { fields: ['id', 'name'], limit: 10 },
        mapResponse: data => data.results.map(u => ({ label: u.name, value: u.id }))
    },
    {
        key: 'employee__branch__in', label: 'Filiais', type: 'async-multiselect',
        endpoint: '/api/branches', queryParam: 'name__icontains',
        extraParams: { fields: ['id', 'name'], limit: 10 },
        mapResponse: data => data.results.map(u => ({ label: u.name, value: u.id }))
    },

    // Endereços
    {
        key: 'addresses__in', label: 'Endereços', type: 'async-multiselect',
        endpoint: '/api/addresses', queryParam: 'q',
        extraParams: { fields: ['id', 'complete_address'], limit: 10 },
        mapResponse: data => data.results.map(u => ({ label: u.complete_address, value: u.id }))
    },
];
