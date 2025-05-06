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
        if (purchaseId) {
            await purchaseService.update(purchaseId, formData);
        } else {
            await purchaseService.create(formData);
        }
        onSave();
    };

    return (
        <Box component="form">
            <Grid container spacing={4}>
                {/* Projeto */}
                <Grid item xs={12} sm={6}>
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
                        />
                    ) : (
                        <TextField
                            fullWidth
                            label="Projeto"
                            value={`${project?.project_number} - ${project?.sale?.customer?.complete_name}`}
                            disabled
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
                    <Button variant="contained" onClick={handleSubmit} fullWidth>
                        Salvar
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}