import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    RadioGroup,
    Radio,
    Stack,
    CircularProgress,
    Box,
    Typography
} from '@mui/material';
import civilConstructionService from '@/services/constructionService';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import FormDate from '@/app/components/forms/form-custom/FormDate';
const statusOptions = [
    { value: 'P', label: 'Pendente' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'F', label: 'Finalizada' },
    { value: 'C', label: 'Cancelado' }
];
const responsibilityOptions = [
    { value: 'C', label: 'Cliente' },
    { value: 'F', label: 'Franquia' }
];

export default function ConstructionFormModal({
    open,
    onClose,
    projectId,
    constructionId = null,
    onSave
}) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        status: 'P',
        deadline: null,
        work_responsibility: 'C',
        repass_value: '',
        budget_value: '',
        service_description: '',
        shading_percentage: '',
    });

    useEffect(() => {
        if (constructionId) {
            setLoading(true);
            civilConstructionService.find(constructionId).then(data => {
                setForm({
                    status: data.status,
                    deadline: data.deadline,
                    work_responsibility: data.work_responsibility,
                    repass_value: data.repass_value || '',
                    budget_value: data.budget_value || '',
                    service_description: data.service_description,
                    shading_percentage: data.shading_percentage,
                });
            }).finally(() => setLoading(false));
        } else {
            setForm(prev => ({ ...prev, status: 'P' }));
        }
    }, [constructionId]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            ...form,
            project: projectId
        };
        try {
            const res = constructionId
                ? await civilConstructionService.update(constructionId, payload)
                : await civilConstructionService.create(payload);
            onSave(res);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{constructionId ? 'Editar Obra' : 'Adicionar Obra'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={form.status}
                            label="Status"
                            onChange={e => handleChange('status', e.target.value)}
                        >
                            {statusOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormDate
                        label="Prazo"
                        value={form.deadline}
                        onChange={date => handleChange('deadline', date)}
                    />

                    <FormControl component="fieldset">
                        <RadioGroup
                            row
                            value={form.work_responsibility}
                            onChange={e => handleChange('work_responsibility', e.target.value)}
                        >
                            {responsibilityOptions.map(opt => (
                                <FormControlLabel
                                    key={opt.value}
                                    value={opt.value}
                                    control={<Radio />}
                                    label={opt.label}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        label="Valor de Repasse"
                        type="number"
                        fullWidth
                        value={form.repass_value}
                        onChange={e => handleChange('repass_value', e.target.value)}
                    />

                    <TextField
                        label="Valor de Orçamento"
                        type="number"
                        fullWidth
                        value={form.budget_value}
                        onChange={e => handleChange('budget_value', e.target.value)}
                    />

                    <TextField
                        label="Descrição do Serviço"
                        multiline
                        rows={3}
                        fullWidth
                        value={form.service_description}
                        onChange={e => handleChange('service_description', e.target.value)}
                    />

                    <TextField
                        label="% de Sombreamento"
                        type="number"
                        fullWidth
                        value={form.shading_percentage}
                        onChange={e => handleChange('shading_percentage', e.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading} endIcon={loading && <CircularProgress size={20} />}>
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
