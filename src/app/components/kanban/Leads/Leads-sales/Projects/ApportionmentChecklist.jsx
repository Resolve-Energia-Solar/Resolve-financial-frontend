'use client';
import {
    Grid, Typography, Chip, Divider, Box, Rating, useTheme, IconButton, Card,
    MenuItem, InputAdornment, TextField, Checkbox, Radio, Button, CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

import { Email, Person, Search } from '@mui/icons-material';
import { DeleteOutlined as DeleteOutlinedIcon, AddOutlined as AddOutlinedIcon, WarningAmber as WarningAmberIcon } from '@mui/icons-material';

import BlankCard from '@/app/components/shared/BlankCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import leadService from '@/services/leadService';
import ProductService from '@/services/productsService';
import { addProduct, removeProductsByIds, associateProductWithLead, selectProductsByLead } from '@/store/products/customProducts';

import useUser from '@/hooks/users/useUser';
import useUserForm from '@/hooks/users/useUserForm';

import CreateProduct from '@/app/components/apps/product/Add-product';
import ListProducts from '../../components/ListProducts';
import { useSnackbar } from 'notistack';



function ApportionmentChecklist({ leadId = null }) {
    const dispatch = useDispatch();
    const [dialogProductOpen, setDialogProductOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [dialogExistingProductOpen, setDialogExistingProductOpen] = useState(false);


    const customProducts = useSelector(selectProductsByLead(leadId));

    const addCustomProduct = (product) => {
        dispatch(addProduct(product));
        dispatch(associateProductWithLead({ leadId: leadId, productId: product.id }));
    };

    const confirmDelete = async () => {
        try {
            const productToDelete = customProducts.find(product => product.id === selectedProduct);
            if (productToDelete && productToDelete.default === "N") {
                await ProductService.deleteProduct(selectedProduct);
            }
            dispatch(removeProductsByIds([selectedProduct]));
            setDeleteModalOpen(false);
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteModalOpen(true);
        setSelectedProduct(id);
    };
    const [lead, setLead] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const data = await leadService.getLeadById(leadId, {
                    params: {
                        fields: 'id,customer,name,first_document,contact_email',
                    },
                })
                setLead(data);
                setCustomerId(data?.customer?.id);
            } catch (err) {
                enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
            }
        };
        fetchLead();
    }, [leadId]);


    const { loading, error, userData } = useUser(customerId);

    const {
        formData,
        handleChange,
        handleSave,
        formErrors,
        loading: formLoading,
        dataReceived,
        success,
    } = useUserForm(userData, customerId);

    formData.complete_name ? (formData.complete_name = formData.complete_name) : (formData.complete_name = lead?.name);
    formData.first_document ? (formData.first_document = formData.first_document) : (formData.first_document = lead?.first_document);
    formData.email ? (formData.email = formData.email) : (formData.email = lead?.contact_email);
    formData.phone_numbers_ids = []


    const handleSaveCustomer = async () => {
        const response = await handleSave(formData);
        if (response) {
            associateCustomerToLead(dataReceived.id);
            enqueueSnackbar('Cliente salvo com sucesso', { variant: 'success' });
        }
    };

    const associateCustomerToLead = async (customerId) => {
        try {
            await leadService.patchLead(leadId, { customer: customerId });
        } catch (err) {
            enqueueSnackbar('Não foi possível associar o cliente ao lead', { variant: 'error' });
        }
    }

    return (
        <Grid container >
            <Grid item xs={12}>
                <BlankCard sx={{ borderRadius: '20px', boxShadow: 3, px: 4 }}>

                    <Grid container sx={{ mt: 1 }}>

                        <Grid
                            container
                            alignItems={'center'}
                            spacing={0}
                            justifyContent={'space-between'}
                            sx={{ minHeight: 300, p: 3 }}
                        >
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                }}
                            >
                                <Grid item xs={0.5}>
                                    <img
                                        src={'/images/svgs/solar-panel-icon-with-circle.png'}
                                        alt={'solar panel icon'}
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 0,
                                            mr: 1,
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={11.5} >
                                    <Typography sx={{ fontWeight: '700', fontSize: "14px" }}>Unidade Geradora</Typography>
                                </Grid>
                            </Grid>

                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={2}>
                                    <CustomFormLabel htmlFor="cep" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>CEP</CustomFormLabel>
                                    <TextField
                                        name="cep"
                                        value={formData.cep}
                                        onChange={(e) => handleChange('cep', e.target.value)}
                                        fullWidth
                                       
                                    />
                                </Grid>

                                <Grid item xs={8}>
                                    <CustomFormLabel htmlFor="address" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Logradouro</CustomFormLabel>
                                    <TextField
                                        name="address"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <CustomFormLabel htmlFor="address_number" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Nº</CustomFormLabel>
                                    <TextField
                                        name="address_number"
                                        value={formData.address_number}
                                        onChange={(e) => handleChange('address_number', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                            </Grid>

                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={4}>
                                    <CustomFormLabel htmlFor="cep" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Complemento</CustomFormLabel>
                                    <TextField
                                        name="cep"
                                        value={formData.cep}
                                        onChange={(e) => handleChange('cep', e.target.value)}
                                        fullWidth
                                       
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <CustomFormLabel htmlFor="address" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Bairro</CustomFormLabel>
                                    <TextField
                                        name="address"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <CustomFormLabel htmlFor="address_number" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Cidade</CustomFormLabel>
                                    <TextField
                                        name="address_number"
                                        value={formData.address_number}
                                        onChange={(e) => handleChange('address_number', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={1}>
                                    <CustomFormLabel htmlFor="address_number" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Estado</CustomFormLabel>
                                    <TextField
                                        name="address_number"
                                        value={formData.address_number}
                                        onChange={(e) => handleChange('address_number', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                            </Grid>


                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 2 }}>
                                <IconButton
                                    sx={{
                                        p: 0,
                                        color: '#7E8388',
                                        fontSize: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        transition: '0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            backgroundColor: 'rgba(0, 0, 0, 0.00)',
                                        },
                                    }}
                                    onClick={() => setDialogProductOpen(true)}
                                >
                                    <AddOutlinedIcon sx={{ fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: '600', fontSize: "12px" }}>Adicionar novo</Typography>
                                </IconButton>

                                <IconButton
                                    sx={{
                                        p: 0,
                                        color: '#7E8388',
                                        fontSize: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        transition: '0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            backgroundColor: 'rgba(0, 0, 0, 0.00)',
                                        },
                                    }}
                                    onClick={() => { setDialogExistingProductOpen(true) }}
                                >
                                    <Search sx={{ fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: '600', fontSize: "12px" }}>Adicionar existente</Typography>
                                </IconButton>
                            </Grid>

                        </Grid>


                        <Dialog
                            open={dialogExistingProductOpen}
                            onClose={() => setDialogExistingProductOpen(false)}
                            maxWidth="lg"
                            fullWidth
                        >
                            <DialogContent>
                                <ListProducts onAddProduct={addCustomProduct} onClosedModal={() => setDialogExistingProductOpen(false)} />
                            </DialogContent>
                        </Dialog>

                        <Dialog
                            open={dialogProductOpen}
                            onClose={() => setDialogProductOpen(false)}
                            maxWidth="md"
                            fullWidth
                        >
                            <DialogContent>
                                <CreateProduct
                                    onAddProduct={addCustomProduct}
                                    onClosedModal={() => setDialogProductOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>

                        <Dialog
                            open={deleteModalOpen}
                            onClose={() => setDeleteModalOpen(false)}
                            maxWidth="sm"
                            fullWidth
                            sx={{
                                '& .MuiPaper-root': {
                                    borderRadius: '12px',
                                    padding: '16px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                },
                            }}
                        >
                            <DialogTitle
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: '#FA896B',
                                    fontWeight: '700',
                                    fontSize: '18px',
                                }}
                            >
                                <WarningAmberIcon sx={{ color: '#FA896B', fontSize: '26px' }} />
                                Confirmar Exclusão
                            </DialogTitle>

                            <DialogContent>
                                <Box
                                    sx={{
                                        backgroundColor: '#FFF7F7',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #FFCDD2',
                                    }}
                                >
                                    <Typography sx={{ fontSize: '14px', color: '#333' }}>
                                        Tem certeza de que deseja excluir este produto?{' '}
                                        <strong>Esta ação não pode ser desfeita em produtos personalizados.</strong>
                                    </Typography>
                                </Box>
                            </DialogContent>

                            <DialogActions sx={{ padding: '16px' }}>
                                <Button
                                    onClick={() => setDeleteModalOpen(false)}
                                    variant="outlined"
                                    sx={{
                                        // borderColor: 'secondary',
                                        color: 'secondary',
                                        // '&:hover': {
                                        //   backgroundColor: '#F0F0F0',
                                        //   borderColor: '#7E8388',
                                        // },
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={confirmDelete}
                                    color="error"
                                    variant="contained"
                                // sx={{
                                //   backgroundColor: '#FF5A5F',
                                //   '&:hover': {
                                //     backgroundColor: '#E0484C',
                                //   },
                                // }}
                                >
                                    Excluir
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>

                </BlankCard>
            </Grid>
        </Grid>
    );
}

export default ApportionmentChecklist;