import projectService from '@/services/projectService';
import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    Alert,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip
} from '@mui/material';
import { useSnackbar } from 'notistack';
import UserPhoneNumbersTable from '@/app/components/apps/users/phone_numbers/UserPhoneNumbersTable';
import UserAddressesTable from '@/app/components/apps/users/addresses/UserAddressesTable';
import { IconGenderMale, IconGenderFemale, IconUser, IconBuilding } from '@tabler/icons-react';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import userService from '@/services/userService';

export default function CustomerTab({ projectId, viewOnly = false }) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({ customer: null, homologator: null });
    const [form, setForm] = useState({
        customer: { complete_name: '', email: '', first_document: '', gender: '', person_type: '' },
        homologator: { complete_name: '', email: '', first_document: '', gender: '', person_type: '' }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newHomologatorId, setNewHomologatorId] = useState(null);

    const fetchData = useCallback(async () => {
        if (!projectId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await projectService.find(projectId, {
                fields: 'sale.customer.id,sale.customer.complete_name,sale.customer.email,sale.customer.first_document,sale.customer.gender,sale.customer.person_type,homologator.id,homologator.complete_name,homologator.email,homologator.first_document,homologator.gender,homologator.person_type',
                expand: 'sale.customer,homologator'
            });
            const customer = res.sale?.customer || null;
            const homologator = res.homologator || null;
            setData({ customer, homologator });
            setForm({
                customer: customer ? {
                    id: customer.id,
                    complete_name: customer.complete_name || '',
                    email: customer.email || '',
                    first_document: customer.first_document || '',
                    gender: customer.gender || '',
                    person_type: customer.person_type || ''
                } : form.customer,
                homologator: homologator ? {
                    id: homologator.id,
                    complete_name: homologator.complete_name || '',
                    email: homologator.email || '',
                    first_document: homologator.first_document || '',
                    gender: homologator.gender || '',
                    person_type: homologator.person_type || ''
                } : form.homologator
            });
        } catch (err) {
            console.error(err);
            setError('Falha ao carregar dados.');
            enqueueSnackbar('Falha ao carregar dados.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [projectId, enqueueSnackbar]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatDocument = (rawValue, type) => {
        const raw = rawValue.replace(/\D/g, '');
        if (type === 'PF') {
            const t = raw.slice(0, 11);
            return t.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/, (_, a, b, c, d) => {
                let out = a;
                if (b) out += '.' + b;
                if (c) out += '.' + c;
                if (d) out += '-' + d;
                return out;
            });
        }
        if (type === 'PJ') {
            const t = raw.slice(0, 14);
            return t.replace(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/, (_, a, b, c, d, e) => {
                let out = a;
                if (b) out += '.' + b;
                if (c) out += '.' + c;
                if (d) out += '/' + d;
                if (e) out += '-' + e;
                return out;
            });
        }
        return rawValue;
    };

    const handleInputChange = (role, field, value) => {
        setForm(f => ({
            ...f,
            [role]: { ...f[role], [field]: value }
        }));
    };

    const handleDocumentChange = (role, value) => {
        const rawLen = value.replace(/\D/g, '').length;
        if (form[role].person_type === 'PF' && rawLen > 11) enqueueSnackbar('CPF deve ter até 11 dígitos', { variant: 'warning' });
        if (form[role].person_type === 'PJ' && rawLen > 14) enqueueSnackbar('CNPJ deve ter até 14 dígitos', { variant: 'warning' });
        handleInputChange(role, 'first_document', formatDocument(value, form[role].person_type));
    };

    const handleEdit = () => {
        setForm({
            customer: data.customer ? {
                id: data.customer.id,
                complete_name: data.customer.complete_name || '',
                email: data.customer.email || '',
                first_document: formatDocument(data.customer.first_document, data.customer.person_type) || '',
                gender: data.customer.gender || '',
                person_type: data.customer.person_type || ''
            } : form.customer,
            homologator: data.homologator ? {
                id: data.homologator.id,
                complete_name: data.homologator.complete_name || '',
                email: data.homologator.email || '',
                first_document: formatDocument(data.homologator.first_document, data.homologator.person_type) || '',
                gender: data.homologator.gender || '',
                person_type: data.homologator.person_type || ''
            } : form.homologator
        });
        setIsEditing(true);
    };
    const handleCancel = () => {
        setForm({
            customer: data.customer ? {
                id: data.customer.id,
                complete_name: data.customer.complete_name || '',
                email: data.customer.email || '',
                first_document: data.customer.first_document || '',
                gender: data.customer.gender || '',
                person_type: data.customer.person_type || ''
            } : form.customer,
            homologator: data.homologator ? {
                id: data.homologator.id,
                complete_name: data.homologator.complete_name || '',
                email: data.homologator.email || '',
                first_document: data.homologator.first_document || '',
                gender: data.homologator.gender || '',
                person_type: data.homologator.person_type || ''
            } : form.homologator
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const custPayload = { ...form.customer, first_document: form.customer.first_document.replace(/\D/g, '') };
            await userService.update(form.customer.id, custPayload);
            if (form.homologator.id) {
                const homPayload = { ...form.homologator, first_document: form.homologator.first_document.replace(/\D/g, '') };
                await userService.update(form.homologator.id, homPayload);
            }
            enqueueSnackbar('Dados salvos com sucesso.', { variant: 'success' });
            setTimeout(() => {
                fetchData();
            }, 1000);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Falha ao salvar dados.', { variant: 'error' });
        }
    };

    const handleSelectHomologator = (user) => {
        setNewHomologatorId(user.value);
    };

    const handleAddHomologator = async () => {
        try {
            await projectService.update(projectId, { homologator: newHomologatorId });
            setTimeout(() => {
                fetchData();
            }, 1000);
            enqueueSnackbar('Homologador adicionado com sucesso.', { variant: 'success' });
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Falha ao salvar dados.', { variant: 'error' });
        }
    };

    const handlePhoneNumbersChange = (phoneNumbers) => {
        setForm(f => ({
            ...f,
            customer: { ...f.customer, phone_numbers: phoneNumbers }
        }));
    };

    const handleAddressesChange = (addresses) => {
        setForm(f => ({
            ...f,
            customer: { ...f.customer, addresses }
        }));
    };

    const renderSection = (role, title) => {
        const entity = data[role];
        const formEntity = form[role];
        const editable = !viewOnly && isEditing;
        return (
            <Paper key={role} elevation={3} sx={{ p: 3, mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Chip label={title} />
                    {!viewOnly && entity && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {!isEditing
                                ? <Button variant="contained" onClick={handleEdit}>Modo de Edição</Button>
                                : <>
                                    <Button variant="outlined" onClick={handleCancel}>Cancelar</Button>
                                    <Button variant="contained" onClick={handleSave}>Salvar</Button>
                                </>
                            }
                        </Box>
                    )}
                </Box>
                {entity || editable ? (
                    <>
                        {editable ? (
                            <TextField
                                fullWidth
                                label="Nome Completo"
                                value={formEntity.complete_name}
                                onChange={e => handleInputChange(role, 'complete_name', e.target.value)}
                                sx={{ mb: 3 }}
                            />
                        ) : (
                            <Typography variant="h5" mb={3}>{entity.complete_name || 'SEM NOME'}</Typography>
                        )}

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                {editable ? (
                                    <TextField
                                        fullWidth
                                        label="E-mail"
                                        value={formEntity.email}
                                        onChange={e => handleInputChange(role, 'email', e.target.value)}
                                    />
                                ) : (
                                    <>
                                        <Typography variant="subtitle1"><strong>E-mail:</strong></Typography>
                                        <Typography variant="body1">{entity.email || 'N/A'}</Typography>
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {editable ? (
                                    <FormControl fullWidth>
                                        <InputLabel id={`${role}-gender-label`}>Gênero</InputLabel>
                                        <Select
                                            labelId={`${role}-gender-label`}
                                            label="Gênero"
                                            value={formEntity.gender}
                                            onChange={e => handleInputChange(role, 'gender', e.target.value)}
                                        >
                                            <MenuItem value="M">Masculino</MenuItem>
                                            <MenuItem value="F">Feminino</MenuItem>
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <>
                                        <Typography variant="subtitle1"><strong>Gênero:</strong></Typography>
                                        <Typography variant="body1">
                                            {entity.gender === 'M'
                                                ? <><IconGenderMale size={16} style={{ marginRight: 4 }} />Masculino</>
                                                : <><IconGenderFemale size={16} style={{ marginRight: 4 }} />Feminino</>}
                                        </Typography>
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {editable ? (
                                    <FormControl fullWidth>
                                        <InputLabel id={`${role}-person-type-label`}>Tipo de Pessoa</InputLabel>
                                        <Select
                                            labelId={`${role}-person-type-label`}
                                            label="Tipo de Pessoa"
                                            value={formEntity.person_type}
                                            onChange={e => handleInputChange(role, 'person_type', e.target.value)}
                                        >
                                            <MenuItem value="PF">Pessoa Física</MenuItem>
                                            <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <>
                                        <Typography variant="subtitle1"><strong>Tipo de Pessoa:</strong></Typography>
                                        <Typography variant="body1">
                                            {entity.person_type === 'PF'
                                                ? <><IconUser size={16} style={{ marginRight: 4 }} />Pessoa Física</>
                                                : <><IconBuilding size={16} style={{ marginRight: 4 }} />Pessoa Jurídica</>}
                                        </Typography>
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {editable ? (
                                    <TextField
                                        fullWidth
                                        label={formEntity.person_type === 'PJ' ? 'CNPJ' : 'CPF'}
                                        value={formEntity.first_document}
                                        onChange={e => handleDocumentChange(role, e.target.value)}
                                    />
                                ) : (
                                    <>
                                        <Typography variant="subtitle1"><strong>{entity.first_document.length > 11 ? 'CNPJ:' : 'CPF:'}</strong></Typography>
                                        <Typography variant="body1">
                                            {entity.first_document
                                                ? (entity.first_document.length > 11
                                                    ? entity.first_document.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
                                                    : entity.first_document.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4"))
                                                : 'N/A'}
                                        </Typography>
                                    </>
                                )}
                            </Grid>
                        </Grid>

                        <Box mt={2}>
                            <UserPhoneNumbersTable userId={entity.id} onChange={handlePhoneNumbersChange} viewOnly={viewOnly} />
                        </Box>
                        <Box mt={2}>
                            <UserAddressesTable userId={entity.id} onChange={handleAddressesChange} viewOnly={viewOnly} />
                        </Box>
                    </>
                ) : (
                    <Box>
                        <GenericAsyncAutocompleteInput
                            label="Homologador"
                            value={formEntity.homologator}
                            onChange={user => handleSelectHomologator(user)}
                            endpoint="/api/users/"
                            queryParam="complete_name__icontains"
                            extraParams={{ fields: ['id', 'complete_name'], limit: 10 }}
                            mapResponse={(data) =>
                                data.results.map((u) => ({ label: u.complete_name, value: u.id }))
                            }
                        />
                        <Button variant="contained" onClick={handleAddHomologator} sx={{ mt: 2 }}>
                            Adicionar Homologador
                        </Button>
                    </Box>
                )}
            </Paper>
        );
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
        </Box>
    );

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            {renderSection('customer', 'Cliente')}
            {renderSection('homologator', 'Homologador')}
        </Box>
    );
}
