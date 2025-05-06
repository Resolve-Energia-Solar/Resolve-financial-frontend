import { Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography, Tabs, Tab, Box, Grid } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import purchaseService from "@/services/purchaseService";
import { formatDate } from "@/utils/dateUtils";
import { CheckCircle, Error, HourglassEmpty, PendingActions, Assignment } from '@mui/icons-material';
import UserCard from "../../users/userCard";
import Comment from "../../comment";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`purchase-details-tabpanel-${index}`}
            aria-labelledby={`purchase-details-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `purchase-details-tab-${index}`,
        'aria-controls': `purchase-details-tabpanel-${index}`,
    };
}


export default function PurchaseDetailsModal({ open, onClose, purchaseId }) {
    const [purchase, setPurchase] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchPurchaseDetails = async () => {
            if (purchaseId) {
                try {
                    const response = await purchaseService.find(purchaseId, { expand: ['project', 'project.sale.customer', 'project.product', 'project.address'], fields: ['purchase_date', 'purchase_value', 'delivery_forecast', 'delivery_number', 'status', 'supplier', 'project.project_number', 'project.sale.customer.complete_name', 'project.product.description', 'project.address.complete_address', 'observations'] }); // Added 'observations' field
                    setPurchase(response);
                } catch (error) {
                    console.error(`Erro ao carregar detalhes da compra: ${error.message}`);
                }
            } else {
                setPurchase(null);
            }
        };
        if (open) {
            fetchPurchaseDetails();
        } else {
            setTabValue(0);
            setPurchase(null);
        }
    }, [purchaseId, open]);

    const handleClose = () => {
        onClose();
    };


    if (!purchase && open) return null;

    const statusIcons = {
        'R': <CheckCircle color="success" />,
        'C': <Error color="error" />,
        'D': <Error color="error" />,
        'A': <HourglassEmpty color="primary" />,
        'P': <PendingActions color="warning" />,
        'F': <HourglassEmpty color="primary" />,
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" sx={{ '& .MuiDialog-paper': { height: '60vh' } }}>
            <DialogTitle>
                Detalhes da Compra | Projeto nº {purchase?.project?.project_number} - {purchase?.project?.sale?.customer?.complete_name}
                <IconButton color="inherit" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="abas de detalhes da compra" centered>
                        <Tab label="Detalhes" {...a11yProps(0)} sx={{ width: '50%' }} />
                        <Tab label="Observações" {...a11yProps(1)} sx={{ width: '50%' }} />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5"><strong>Produto:</strong></Typography>
                            <Typography variant="h6">{purchase?.project?.product?.description || '-'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5"><strong>Endereço:</strong></Typography>
                            <Typography variant="h6">{purchase?.project?.address?.complete_address || '-'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5"><strong>Data da Compra:</strong></Typography>
                            <Typography variant="h6">{formatDate(purchase?.purchase_date)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5"><strong>Status:</strong></Typography>
                            <Chip icon={statusIcons[purchase?.status]} label={(() => {
                                const statusMap = {
                                    'R': 'Compra realizada',
                                    'C': 'Cancelada',
                                    'D': 'Distrato',
                                    'A': 'Aguardando pagamento',
                                    'P': 'Pendente',
                                    'F': 'Aguardando Previsão de Entrega',
                                };
                                return statusMap[purchase?.status] || 'Desconhecido';
                            })()} color="primary" size="large" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5"><strong>Valor da Compra:</strong></Typography>
                            <Typography variant="h6">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase?.purchase_value)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5"><strong>Previsão de Entrega:</strong></Typography>
                            <Typography variant="h6">{formatDate(purchase?.delivery_forecast) || '-'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5"><strong>Nº de Entrega:</strong></Typography>
                            <Typography variant="h6">{purchase?.delivery_number || '-'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5"><strong>Fornecedor:</strong></Typography>
                            <UserCard userId={purchase?.supplier} />
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Comment appLabel={'logistics'} model={'purchase'} objectId={purchaseId} />
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
}