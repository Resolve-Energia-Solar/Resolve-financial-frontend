import saleService from '@/services/saleService';
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    Alert
} from '@mui/material';
import { useSnackbar } from 'notistack';
import UserPhoneNumbersTable from '@/app/components/apps/users/phone_numbers/UserPhoneNumbersTable';
import UserAddressesTable from '@/app/components/apps/users/addresses/UserAddressesTable';
import { IconGenderMale, IconGenderFemale, IconUser, IconBuilding } from '@tabler/icons-react';

export default function CustomerTab({ saleId, canEdit }) {
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

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
                    } else {
                        setCustomer(null);
                    }
                } catch (err) {
                    console.error(err);
                    setError('Falha ao carregar dados do cliente.');
                    enqueueSnackbar('Falha ao carregar dados do cliente.', {
                        variant: 'error',
                    });
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            {customer ? (<>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1"><strong>Nome:</strong></Typography>
                        <Typography variant="body1">{customer.complete_name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1"><strong>E-mail:</strong></Typography>
                        <Typography variant="body1">{customer.email || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">
                            <strong>
                                {customer.first_document && customer.first_document.length > 11 ? 'CNPJ:' : 'CPF:'}
                            </strong>
                        </Typography>
                        <Typography variant="body1">
                            {customer.first_document ? (
                                customer.first_document.length > 11
                                    ? customer.first_document.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
                                    : customer.first_document.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
                            ) : 'N/A'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1"><strong>Gênero:</strong></Typography>
                        <Typography variant="body1">
                            {customer.gender === 'M' ? (
                                <Typography>
                                    <IconGenderMale size={16} style={{ marginRight: 4 }} />
                                    Masculino
                                </Typography>
                            ) : (
                                <Typography>
                                    <IconGenderFemale size={16} style={{ marginRight: 4 }} />
                                    Feminino
                                </Typography>
                            )}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1"><strong>Tipo de Pessoa:</strong></Typography>
                    <Typography variant="body1">
                        {customer.person_type === 'PF' ? (
                            <Typography>
                                <IconUser size={16} style={{ marginRight: 4 }} />
                                Pessoa Física
                            </Typography>
                        ) : (
                            <Typography>
                                <IconBuilding size={16} style={{ marginRight: 4 }} />
                                Pessoa Jurídica
                            </Typography>
                        )}
                    </Typography>
                </Grid>

                <Box mt={2}>
                    <UserPhoneNumbersTable userId={customer.id} />
                </Box>

                <Box mt={2}>
                    <UserAddressesTable userId={customer.id} />
                    </Box>
            </>) : (
                <Typography variant="body1">Nenhum cliente encontrado.</Typography>
            )
            }
        </Paper >
    );
}