import { useEffect, useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import purchaseService from "@/services/purchaseService";
import GenericAsyncAutocompleteInput from "@/app/components/filters/GenericAsyncAutocompleteInput";
import projectService from "@/services/projectService";

const statusOptions = [
    { value: "R", label: "Compra realizada" },
    { value: "C", label: "Cancelada" },
    { value: "D", label: "Distrato" },
    { value: "A", label: "Aguardando pagamento" },
    { value: "P", label: "Pendente" },
];

const deliveryTypeOptions = [
    { value: "D", label: "Entrega Direta" },
    { value: "C", label: "Entrega CD" },
];

export default function PurchaseForm({ projectId, purchaseId = null, onSave }) {
    const [formData, setFormData] = useState({
        project: projectId || null,
        supplier: "",
        delivery_type: "",
        status: "P",
        delivery_number: "",
    });
    const [project, setProject] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            if (projectId) {
                const data = await projectService.find(projectId, {expand: "sale.customer", fields: "id,project_number,sale.customer"});
                setProject(data);
            }
        };
        loadProject();
    }
    , [projectId]);

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
        <form>
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
                />) :
                <TextField
                    fullWidth
                    label="Projeto"
                    value={`${project?.project_number} - ${project?.sale?.customer?.complete_name}`}
                    onChange={handleChange}
                    name="project"
                    margin="normal"
                    disabled
                />
            }

            <GenericAsyncAutocompleteInput
                label="Fornecedor"
                value={formData.supplier}
                onChange={handleSelectChange("supplier")}
                endpoint="/api/users"
                extraParams={{ user_types: 1 }}
                mapResponse={(data) =>
                    data.results.map((u) => ({
                        value: u.id,
                        label: u.complete_name || u.name,
                    }))
                }
            />

            <TextField
                select
                fullWidth
                label="Tipo de Entrega"
                name="delivery_type"
                value={formData.delivery_type}
                onChange={handleChange}
                margin="normal"
            >
                {deliveryTypeOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                margin="normal"
            >
                {statusOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                fullWidth
                margin="normal"
                label="Número de Entrega"
                name="delivery_number"
                value={formData.delivery_number || ""}
                onChange={handleChange}
            />

            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                Salvar
            </Button>
        </form>
    );
}
