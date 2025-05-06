import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Grid, Box } from "@mui/material";
import purchaseService from "@/services/purchaseService";
import GenericAsyncAutocompleteInput from "@/app/components/filters/GenericAsyncAutocompleteInput";
import projectService from "@/services/projectService";

const statusOptions = [
    { value: "R", label: "Compra realizada" },
    { value: "C", label: "Cancelada" },
    { value: "D", label: "Distrato" },
    { value: "A", label: "Aguardando pagamento" },
    { value: "P", label: "Pendente" },
    { value: "F", label: "Aguardando Previsão de Entrega" },
];

const deliveryTypeOptions = [
    { value: "D", label: "Entrega Direta" },
    { value: "C", label: "Entrega CD" },
];

export default function PurchaseForm({ projectId, purchaseId = null, onSave }) {
    const [formData, setFormData] = useState({
        project: projectId || null,
        supplier: null,
        delivery_type: "C",
        status: "P",
        delivery_number: null,
        purchase_date: new Date().toISOString().split("T")[0],
        delivery_forecast: null,
        purchase_value: null,
    });
    const [errors, setErrors] = useState({});
    const [project, setProject] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            if (projectId) {
                const data = await projectService.find(projectId, {
                    expand: "sale.customer",
                    fields: "id,project_number,sale.customer"
                });
                setProject(data);
            }
        };
        loadProject();
    }, [projectId]);

    useEffect(() => {
        const loadPurchase = async () => {
            if (purchaseId) {
                const data = await purchaseService.find(purchaseId);
                setFormData({
                    ...data,
                    project: data.project || null,
                    supplier: data.supplier || null,
                });
            }
        };
        loadPurchase();
    }, [purchaseId]);

    const handleChange = (e) => {
        setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name) => (v) => {
        setFormData((f) => ({ ...f, [name]: v?.value || "" }));
    };

    const handleSubmit = async () => {
        try {
            if (purchaseId) {
                await purchaseService.update(purchaseId, formData);
            } else {
                await purchaseService.create(formData);
            }
            onSave();
        } catch (err) {
            if (err.response?.data) {
                setErrors(err.response.data);
            }
        }
    };

    return (
        <Box component="form">
            <Grid container spacing={4} sx={{ marginBottom: '2rem' }}>
                <Grid item xs={12}>
                    <h2>Dados da Compra</h2>
                </Grid>
            </Grid>
            <Grid container spacing={4}>
                {/* Projeto */}
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', marginBottom: '-6.5px' }}>
                    {!projectId ? (
                        <GenericAsyncAutocompleteInput
                            label="Projeto"
                            value={formData.project?.id}
                            onChange={handleSelectChange("project")}
                            endpoint="/api/projects"
                            mapResponse={(data) =>
                                data.results.map((p) => ({
                                    value: p.id,
                                    label: p.name || p.product?.description || `Projeto ${p.id}`,
                                }))
                            }
                            error={!!errors?.project}
                            helperText={errors?.project?.[0]}
                            sx={{
                                width: '100%',
                                fontSize: '1rem',
                                marginBottom: '1.5rem',
                                '& .MuiInputBase-root': {
                                    height: '56px',
                                },
                            }}
                        />
                    ) : (
                        <TextField
                            fullWidth
                            label="Projeto"
                            value={`${project?.project_number} - ${project?.sale?.customer?.complete_name}`}
                            error={!!errors?.project}
                            helperText={errors?.project?.[0]}
                            disabled
                            sx={{
                                width: '100%',
                                fontSize: '1rem',
                                marginBottom: '1.5rem',
                                '& .MuiInputBase-root': {
                                    height: '56px',
                                },
                            }}
                        />
                    )}
                </Grid>

                {/* Fornecedor */}
                <Grid item xs={12} sm={6}>
                    <GenericAsyncAutocompleteInput
                        label="Fornecedor"
                        value={formData.supplier}
                        onChange={handleSelectChange("supplier")}
                        endpoint="/api/users"
                        extraParams={{ user_types: 1 }}
                        mapResponse={(data) =>
                            data.results.map((u) => ({ value: u.id, label: u.complete_name || u.name }))
                        }
                        error={!!errors?.supplier}
                        helperText={errors?.supplier?.[0]}
                        sx={{
                            width: '100%',
                            fontSize: '1rem',
                            marginBottom: '1.5rem',
                            '& .MuiInputBase-root': {
                                height: '56px',
                            },
                        }}
                    />
                </Grid>

                {/* Data de Compra */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Data de Compra"
                        type="date"
                        name="purchase_date"
                        value={formData.purchase_date || ""}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors?.purchase_date}
                        helperText={errors?.purchase_date?.[0]}
                        sx={{
                            width: '100%',
                            fontSize: '1rem',
                            marginBottom: '1.5rem',
                            '& .MuiInputBase-root': {
                                height: '56px',
                            },
                        }}
                    />
                </Grid>

                {/* Data de Previsão de Entrega */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Previsão de Entrega"
                        type="date"
                        name="delivery_forecast"
                        value={formData.delivery_forecast || ""}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors?.delivery_forecast}
                        helperText={errors?.delivery_forecast?.[0]}
                        sx={{
                            width: '100%',
                            fontSize: '1rem',
                            marginBottom: '1.5rem',
                            '& .MuiInputBase-root': {
                                height: '56px',
                            },
                        }}
                    />
                </Grid>

                {/* Número de Entrega */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Número de Entrega"
                        name="delivery_number"
                        value={formData.delivery_number || ""}
                        onChange={handleChange}
                        error={!!errors?.delivery_number}
                        helperText={errors?.delivery_number?.[0]}
                        sx={{
                            width: '100%',
                            fontSize: '1rem',
                            marginBottom: '1.5rem',
                            '& .MuiInputBase-root': {
                                height: '56px',
                            },
                        }}
                    />
                </Grid>

                {/* Valor da Compra */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Valor da Compra"
                        type="number"
                        name="purchase_value"
                        value={formData.purchase_value || ""}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            startAdornment: <span>R$</span>,
                            inputProps: { step: 0.01, min: 0 },
                        }}
                        error={!!errors?.purchase_value}
                        helperText={errors?.purchase_value?.[0]}
                        sx={{
                            width: '100%',
                            fontSize: '1rem',
                            marginBottom: '1.5rem',
                            '& .MuiInputBase-root': {
                                height: '56px',
                            },
                        }}
                    />
                </Grid>

                {/* Tipo de Entrega */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        fullWidth
                        label="Tipo de Entrega"
                        name="delivery_type"
                        value={formData.delivery_type}
                        onChange={handleChange}
                        error={!!errors?.delivery_type}
                        helperText={errors?.delivery_type?.[0]}
                        sx={{
                            width: '100%',
                            fontSize: '1rem',
                            marginBottom: '1.5rem',
                            '& .MuiInputBase-root': {
                                height: '56px',
                            },
                        }}
                    >
                        {deliveryTypeOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        error={!!errors?.status}
                        helperText={errors?.status?.[0]}
                        sx={{
                            width: '100%',
                            fontSize: '1rem',
                            marginBottom: '1.5rem',
                            '& .MuiInputBase-root': {
                                height: '56px',
                            },
                        }}
                    >
                        {statusOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Botão Salvar */}
                <Grid item xs={12}>
                    <Button variant="contained" onClick={handleSubmit} fullWidth sx={{ padding: '10px' }}>
                        Salvar
                    </Button>
                </Grid>
            </Grid>
        </Box>

    );
}