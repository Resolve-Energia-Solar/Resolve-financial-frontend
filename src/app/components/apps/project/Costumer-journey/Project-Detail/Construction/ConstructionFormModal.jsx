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
    FormLabel
} from '@mui/material';
import civilConstructionService from '@/services/constructionService';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import { useSnackbar } from 'notistack';

const statusOptions = [
    { value: 'P', label: 'Pendente' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'F', label: 'Finalizada' },
    { value: 'C', label: 'Cancelada' }
];
const responsibilityOptions = [
    { value: 'C', label: 'Cliente' },
    { value: 'F', label: 'Franquia' },
    { value: 'O', label: 'Centro de Operações' },
];

export default function ConstructionFormModal({
    open,
    onClose,
    projectId,
    constructionId = null,
    onSave
}) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [form, setForm] = useState({
        status: 'P',
        start_date: null,
        end_date: null,
        work_responsibility: 'C',
        is_customer_aware: false,
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
                    start_date: data.start_date,
                    end_date: data.end_date,
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
        }
        catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    enqueueSnackbar('Você não tem permissão para realizar esta ação.', { variant: 'error' });
                    return;
                }
                setFormErrors(error.response.data.error || error.response.data);
                if (error.response.data.error) {
                    enqueueSnackbar(error.response.data.error, { variant: 'error' });
                } else {
                    enqueueSnackbar('Erro ao salvar a obra. Verifique os campos e tente novamente.', { variant: 'error' });
                }
            } else {
                console.error('Error saving construction:', error);
            }
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
                            error={!!formErrors.status}
                        >
                            {statusOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormDate
                        label="Data de Previsão de Início"
                        value={form.start_date}
                        onChange={date => handleChange('start_date', date)}
                        error={!!formErrors.start_date}
                        helperText={formErrors.start_date?.[0]}
                    />

                     <FormDate
                        label="Data de Previsão de Fim"
                        value={form.end_date}
                        onChange={date => handleChange('end_date', date)}
                        error={!!formErrors.end_date}
                        helperText={formErrors.end_date?.[0]}
                    />

                    <FormControl component="fieldset">
                        <FormLabel sx={{ fontWeight: 'bold' }}>Responsabilidade da Obra</FormLabel>
                        <RadioGroup
                            row
                            value={form.work_responsibility}
                            onChange={e => handleChange('work_responsibility', e.target.value)}
                            error={!!formErrors.work_responsibility}
                            helperText={formErrors.work_responsibility?.[0]}
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

                    <FormControl component="fieldset">
                        <FormLabel sx={{ fontWeight: 'bold' }}>Cliente ciente da obra?</FormLabel>
                        <RadioGroup
                            row
                            value={form.is_customer_aware ? 'true' : 'false'}
                            onChange={e => handleChange('is_customer_aware', e.target.value === 'true')}
                            error={!!formErrors.is_customer_aware}
                            helperText={formErrors.is_customer_aware?.[0]}
                        >
                            <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label="Sim"
                            />
                            <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label="Não"
                            />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        label="Valor de Repasse"
                        type="number"
                        fullWidth
                        value={form.repass_value}
                        onChange={e => handleChange('repass_value', e.target.value)}
                        error={!!formErrors.value}
                        helperText={formErrors.value?.[0]}
                    />

                    <TextField
                        label="Valor de Orçamento"
                        type="number"
                        fullWidth
                        value={form.budget_value}
                        onChange={e => handleChange('budget_value', e.target.value)}
                        error={!!formErrors.budget_value}
                        helperText={formErrors.budget_value?.[0]}
                    />

                    <TextField
                        label="Descrição do Serviço"
                        multiline
                        rows={3}
                        fullWidth
                        value={form.service_description}
                        onChange={e => handleChange('service_description', e.target.value)}
                        error={!!formErrors.service_description}
                        helperText={formErrors.service_description?.[0]}
                    />

                    <TextField
                        label="% de Sombreamento"
                        type="number"
                        fullWidth
                        value={form.shading_percentage}
                        onChange={e => handleChange('shading_percentage', e.target.value)}
                        error={!!formErrors.shading_percentage}
                        helperText={formErrors.shading_percentage?.[0]}
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
