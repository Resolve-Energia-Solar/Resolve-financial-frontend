'use client';
import {
    Grid, Typography, Chip, Divider, Box, Rating, useTheme, IconButton, Card,
    MenuItem, InputAdornment, TextField, Checkbox, Radio, Button, CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CardContent,
    CardActions,
} from '@mui/material';

import { Email, Person, Search } from '@mui/icons-material';
import { DeleteOutlined as DeleteOutlinedIcon, AddOutlined as AddOutlinedIcon, WarningAmber as WarningAmberIcon } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import BlankCard from '@/app/components/shared/BlankCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import leadService from '@/services/leadService';
import ProductService from '@/services/productsService';
import { addProduct, removeProductsByIds, associateProductWithLead, selectProductsByLead } from '@/store/products/customProducts';

import useUser from '@/hooks/users/useUser';
import useUserForm from '@/hooks/users/useUserForm';

import CreateProduct from '@/app/components/apps/product/Add-product';
import ListProducts from '../../components/ListProducts';
import { useSnackbar } from 'notistack';
import { AttachFile, Delete, Visibility, Add } from '@mui/icons-material';
import UnitiesCardComponent from '../../components/Projects/UnitiesCard';

const initialBeneficiary = {
    zip_code: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    documents: [],
}

function ApportionmentChecklist({ leadId = null }) {
    const dispatch = useDispatch();
    const theme = useTheme();
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


    const handleSaveForm = async () => {
        const response = await handleSave();
        if (response) {
            enqueueSnackbar('Proposta salva com sucesso', { variant: 'success' });
            if (onRefresh) onRefresh();
            if (onClose) onClose();
        } else {
            enqueueSnackbar('Erro ao salvar proposta', { variant: 'error' });
            console.log('Form Errors:', formErrors);
        }
    }

    const associateCustomerToLead = async (customerId) => {
        try {
            await leadService.patchLead(leadId, { customer: customerId });
        } catch (err) {
            enqueueSnackbar('Não foi possível associar o cliente ao lead', { variant: 'error' });
        }
    }

    const [documents, setDocuments] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newDoc = {
                name: file.name,
                size: (file.size / 1024).toFixed(2) + " KB",
                type: file.type,
            };
            setDocuments([...documents, newDoc]);
        }
    };

    const handleRemoveDocument = (index) => {
        const updatedDocs = documents.filter((_, i) => i !== index);
        setDocuments(updatedDocs);
    };

    const [isVisible, setIsVisible] = useState(true);
    const discard_proposal = () => {
        setIsVisible(false);
    };


    return (
        <Grid container >
            <Grid item xs={12}>

                <Grid container sx={{ mt: 1 }}>

                    {isVisible && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <UnitiesCardComponent
                                    title={"Unidade Geradora"}
                                    formData={formData}
                                    onChange={handleChange}
                                    documents={documents}
                                    handleFileUpload={handleFileUpload}
                                    handleRemoveDocument={handleRemoveDocument}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <UnitiesCardComponent
                                    title={"Unidade Beneficiária"}
                                    formData={formData}
                                    onChange={handleChange}
                                    documents={documents}
                                    handleFileUpload={handleFileUpload}
                                    handleRemoveDocument={handleRemoveDocument}
                                    discardCard={handleDeleteClick}
                                />
                            </Grid>
                        </Grid>
                    )}

                </Grid>


                <Grid
                    container
                    sx={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 4,
                        gap: 2,
                        p: 1
                    }}
                >

                    <Grid item sx={{ flexGrow: 1 }}>
                        <Button
                            startIcon={<Add />}
                            component="span"
                            sx={{
                                backgroundColor: "transparent",
                                p: 0,
                                color: '#7E8388',
                                fontSize: 14,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: "flex-start",
                                gap: 0.5,
                                transition: '0.3s',
                                width: '210px',
                                '&:hover': {
                                    backgroundColor: "transparent",
                                    color: "black"
                                },
                            }}
                        >
                            Adicionar novo beneficiário
                        </Button>
                    </Grid>


                    <Grid item sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                color: "black",
                                borderColor: "black",
                                '&:hover': { backgroundColor: '#333', borderColor: "black" },
                                px: 3,
                            }}
                        >
                            <Typography variant="body1">Voltar</Typography>
                        </Button>

                        <Button
                            variant="contained"
                            sx={{ backgroundColor: theme.palette.primary.Button, color: '#303030', px: 3 }}
                            onClick={handleSaveForm}
                            disabled={formLoading}
                            endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            <Typography variant="body1" color="white">
                                {formLoading ? 'Salvando...' : 'Salvar'}
                            </Typography>
                        </Button>
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
                                Tem certeza de que deseja excluir esta unidade?{' '}
                                <strong>Esta ação não pode ser desfeita.</strong>
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

        </Grid>
    );
}

export default ApportionmentChecklist;