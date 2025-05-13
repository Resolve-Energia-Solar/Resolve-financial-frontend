import saleService from '@/services/saleService';
import { useState, useEffect } from 'react';
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
    Button
} from '@mui/material';
import { useSnackbar } from 'notistack';
import UserPhoneNumbersTable from '@/app/components/apps/users/phone_numbers/UserPhoneNumbersTable';
import UserAddressesTable from '@/app/components/apps/users/addresses/UserAddressesTable';
import { IconGenderMale, IconGenderFemale, IconUser, IconBuilding } from '@tabler/icons-react';
import userService from '@/services/userService';

export default function CustomerTab({ saleId, viewOnly = false }) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        complete_name: '',
        email: '',
        first_document: '',
        gender: '',
        person_type: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (saleId) {
            const fetchCustomer = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await saleService.find(saleId, {
                        fields: 'customer.complete_name,customer.email,customer.first_document,customer.gender,customer.person_type,customer.id',
                        expand: 'customer,customer.phone_numbers',
                    });
                    if (data && data.customer) {
                        setCustomer(data.customer);
                        setForm({
                            complete_name: data.customer.complete_name || '',
                            email: data.customer.email || '',
                            first_document: data.customer.first_document || '',
                            gender: data.customer.gender || '',
                            person_type: data.customer.person_type || ''
                        });
                    } else {
                        setCustomer(null);
                    }
                } catch (err) {
                    console.error(err);
                    setError('Falha ao carregar dados do cliente.');
                    enqueueSnackbar('Falha ao carregar dados do cliente.', { variant: 'error' });
                    setCustomer(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchCustomer();
        } else {
            setLoading(false);
            setCustomer(null);
        }
    }, [saleId]);

    const formatDocument = (rawValue, type) => {
        const raw = rawValue.replace(/\D/g, '');
        if (type === 'PF') {
            const truncated = raw.slice(0, 11);
            return truncated.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/, (_, p1, p2, p3, p4) => {
                let out = p1;
                if (p2) out += '.' + p2;
                if (p3) out += '.' + p3;
                if (p4) out += '-' + p4;
                return out;
            });
        } else if (type === 'PJ') {
            const truncated = raw.slice(0, 14);
            return truncated.replace(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/, (_, p1, p2, p3, p4, p5) => {
                let out = p1;
                if (p2) out += '.' + p2;
                if (p3) out += '.' + p3;
                if (p4) out += '/' + p4;
                if (p5) out += '-' + p5;
                return out;
            });
        }
        return rawValue;
    };

    const handleEdit = () => {
        if (customer) {
            const formatted = formatDocument(customer.first_document || '', customer.person_type);
            setForm({
                complete_name: customer.complete_name || '',
                email: customer.email || '',
                first_document: formatted,
                gender: customer.gender || '',
                person_type: customer.person_type || ''
            });
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (customer) {
            setForm({
                complete_name: customer.complete_name || '',
                email: customer.email || '',
                first_document: customer.first_document || '',
                gender: customer.gender || '',
                person_type: customer.person_type || ''
            });
        }
        setIsEditing(false);
    };

    const handleSave = async () => {
        const sanitizedDocument = form.first_document.replace(/\D/g, '');
        const payload = { ...form, first_document: sanitizedDocument };
        try {
            await userService.update(customer.id, { payload });
            setCustomer({ ...customer, ...payload });
            enqueueSnackbar('Cliente salvo com sucesso.', { variant: 'success' });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Falha ao salvar cliente.', { variant: 'error' });
        }
    };

    const handleDocumentChange = (value) => {
        if (form.person_type === 'PF' && value.replace(/\D/g, '').length > 11) {
            enqueueSnackbar('CPF deve ter até 11 dígitos', { variant: 'warning' });
        }
        if (form.person_type === 'PJ' && value.replace(/\D/g, '').length > 14) {
            enqueueSnackbar('CNPJ deve ter até 14 dígitos', { variant: 'warning' });
        }
        const formatted = formatDocument(value, form.person_type);
        setForm({ ...form, first_document: formatted });
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
        </Box>
    );

    if (error) return <Alert severity="error">{error}</Alert>;

    const isEditable = !viewOnly && isEditing;

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            {customer ? (
                <>
                    {isEditable ? (
                        <TextField
                            fullWidth
                            label="Nome Completo"
                            value={form.complete_name}
                            onChange={e => setForm({ ...form, complete_name: e.target.value })}
                            sx={{ mb: 3 }}
                        />
                    ) : (
                        <Typography variant="h3" marginBottom={3}>
                            {customer.complete_name || 'SEM NOME'}
                        </Typography>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            {isEditable ? (
                                <TextField
                                    fullWidth
                                    label="E-mail"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            ) : (
                                <>
                                    <Typography variant="subtitle1"><strong>E-mail:</strong></Typography>
                                    <Typography variant="body1">{customer.email || 'N/A'}</Typography>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {isEditable ? (
                                <FormControl fullWidth>
                                    <InputLabel id="gender-label">Gênero</InputLabel>
                                    <Select
                                        labelId="gender-label"
                                        label="Gênero"
                                        value={form.gender}
                                        onChange={e => setForm({ ...form, gender: e.target.value })}
                                    >
                                        <MenuItem value="M">Masculino</MenuItem>
                                        <MenuItem value="F">Feminino</MenuItem>
                                    </Select>
                                </FormControl>
                            ) : (
                                <>
                                    <Typography variant="subtitle1"><strong>Gênero:</strong></Typography>
                                    <Typography variant="body1">
                                        {customer.gender === 'M' ? (
                                            <><IconGenderMale size={16} style={{ marginRight: 4 }} />Masculino</>
                                        ) : (
                                            <><IconGenderFemale size={16} style={{ marginRight: 4 }} />Feminino</>
                                        )}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {isEditable ? (
                                <FormControl fullWidth>
                                    <InputLabel id="person-type-label">Tipo de Pessoa</InputLabel>
                                    <Select
                                        labelId="person-type-label"
                                        label="Tipo de Pessoa"
                                        value={form.person_type}
                                        onChange={e => setForm({ ...form, person_type: e.target.value })}
                                    >
                                        <MenuItem value="PF">Pessoa Física</MenuItem>
                                        <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
                                    </Select>
                                </FormControl>
                            ) : (
                                <>
                                    <Typography variant="subtitle1"><strong>Tipo de Pessoa:</strong></Typography>
                                    <Typography variant="body1">
                                        {customer.person_type === 'PF' ? (
                                            <><IconUser size={16} style={{ marginRight: 4 }} />Pessoa Física</>
                                        ) : (
                                            <><IconBuilding size={16} style={{ marginRight: 4 }} />Pessoa Jurídica</>
                                        )}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {isEditable ? (
                                <TextField
                                    fullWidth
                                    label={form.person_type === 'PJ' ? 'CNPJ' : 'CPF'}
                                    value={form.first_document}
                                    onChange={e => handleDocumentChange(e.target.value)}
                                />
                            ) : (
                                <>
                                    <Typography variant="subtitle1">
                                        <strong>{customer.first_document.length > 11 ? 'CNPJ:' : 'CPF:'}</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {customer.first_document ? (
                                            customer.first_document.length > 11
                                                ? customer.first_document.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
                                                : customer.first_document.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
                                        ) : 'N/A'}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {!viewOnly && (
                                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                                    {!isEditing ? (
                                        <Button variant="contained" onClick={handleEdit}>Editar</Button>
                                    ) : (
                                        <>
                                            <Button variant="outlined" onClick={handleCancel}>Cancelar</Button>
                                            <Button variant="contained" onClick={handleSave}>Salvar</Button>
                                        </>
                                    )}
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    <Box mt={2}>
                        <UserPhoneNumbersTable userId={customer.id} editMode={isEditable} />
                    </Box>

                    <Box mt={2}>
                        <UserAddressesTable userId={customer.id} editMode={isEditable} />
                    </Box>
                </>
            ) : (
                <Typography variant="body1">Nenhum cliente encontrado.</Typography>
            )}
        </Paper>
    );
}
