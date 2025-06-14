import { useEffect, useState } from "react";
import {
    Button,
    TextField,
    MenuItem,
    Grid,
    Box,
    CircularProgress,
    Tabs,
    Tab,
    Typography,
    Card,
    CardHeader,
    CardContent
} from "@mui/material";
import GenericAsyncAutocompleteInput from "@/app/components/filters/GenericAsyncAutocompleteInput";
import ticketService from "@/services/ticketService";
import { useSnackbar } from "notistack";
import StatusChip from "@/utils/status/DocumentStatusIcon";
import { useSelector } from "react-redux";
import Comment from "@/app/components/apps/comment";
import AttachmentTable from "@/app/components/apps/attachment/attachmentTable";
import projectService from "@/services/projectService";

const priorityOptions = [
    { value: 1, label: "Baixa" },
    { value: 2, label: "Média" },
    { value: 3, label: "Alta" },
];

const statusOptions = [
    { value: "A", label: "Aberto" },
    { value: "E", label: "Em Espera" },
    { value: "RE", label: "Respondido" },
    { value: "R", label: "Resolvido" },
    { value: "F", label: "Fechado" },
];

export default function TicketForm({ projectId, ticketId = null, onSave }) {
    const [formData, setFormData] = useState({
        project: projectId || null,
        subject: null,
        description: "",
        status: "",
        priority: "",
        responsible: null,
        ticket_type: null,
        created_by: null,
    });
    const { enqueueSnackbar } = useSnackbar();
    const [errors, setErrors] = useState({});
    const [projectInfo, setProjectInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0);
    const user = useSelector((state) => state.user?.user);

    useEffect(() => {
        const loadTicket = async () => {
            if (ticketId) {
                setLoading(true);
                try {
                    const data = await ticketService.find(ticketId, {
                        fields: "id,project.id,project.project_number,project.sale.customer.complete_name,subject,description,status,conclusion_date,priority,responsible,ticket_type,created_by",
                        expand: "project,project.sale.customer"
                    });
                    setProjectInfo(data.project || null);
                    setFormData({
                        project: data.project?.id || projectId || null,
                        subject: data.subject || null,
                        description: data.description || "",
                        status: data.status || "",
                        conclusion_date: data.conclusion_date || null,
                        priority: data.priority || "",
                        responsible: data.responsible || null,
                        ticket_type: data.ticket_type || null,
                        created_by: data.created_by || null,
                    });
                } catch (err) {
                    console.error("Erro ao carregar o ticket", err);
                    enqueueSnackbar("Erro ao carregar o ticket", { variant: "error" });
                } finally {
                    setLoading(false);
                }
            }
        };
        loadTicket();
    }, [ticketId]);

    useEffect(() => {
        const loadProjectInfo = async () => {
            if (projectId && !ticketId) {
                setLoading(true);
                try {
                    const data = await projectService.find(projectId, {
                        fields: "id,project_number,sale.customer.complete_name",
                        expand: "sale.customer"
                    });
                    setProjectInfo(data || null);
                } catch (err) {
                    console.error("Erro ao carregar o projeto", err);
                    enqueueSnackbar("Erro ao carregar o projeto", { variant: "error" });
                } finally {
                    setLoading(false);
                }
            }
        };
        loadProjectInfo();
    }, [projectId, ticketId]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name) => (v) => {
        setFormData((prev) => ({ ...prev, [name]: v?.value || "" }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const payload = { ...formData, created_by: ticketId ? formData.created_by : user.id };
            if (!ticketId) delete payload.status;
            if (ticketId) await ticketService.update(ticketId, payload);
            else await ticketService.create(payload);
            onSave();
        } catch (err) {
            if (err.response?.data) {
                setErrors(err.response.data);
                if (err.response.status === 403) return;
            }
            enqueueSnackbar("Erro ao salvar o ticket", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_event, newValue) => {
        setTab(newValue);
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <Box sx={{ width: '100%' }}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6">
                    {ticketId ? "Editar Ticket" : "Novo Ticket"}
                </Typography>
            </Grid>
            {ticketId && <>
                <Tabs value={tab} onChange={handleTabChange} aria-label="Tabs de ticket">
                    <Tab label="Formulário" />
                    <Tab label="Comentários" />
                    <Tab label="Anexos" />
                </Tabs>
            </>}
            <Box sx={{ mt: 2 }}>
                {tab === 0 && (
                    <Box component="form">
                        <Grid container spacing={4}>
                            <Grid item xs={12} >
                                {projectId && (
                                    <TextField
                                        fullWidth
                                        label="Projeto"
                                        value={projectInfo
                                            ? `${projectInfo.project_number} - ${projectInfo.sale?.customer?.complete_name}`
                                            : projectId}
                                        disabled
                                        sx={{ height: 56, mb: 3 }}
                                    />
                                )}
                                {!projectId && (
                                    <GenericAsyncAutocompleteInput
                                        label="Projeto"
                                        value={formData.project}
                                        onChange={handleSelectChange("project")}
                                        endpoint="/api/projects"
                                        queryParam="q"
                                        extraParams={{
                                            expand: [
                                                'sale.customer',
                                                'sale',
                                                'sale.branch',
                                                'product',
                                                'sale.homologator',
                                            ],
                                            fields: [
                                                'id',
                                                'project_number',
                                                'address',
                                                'sale.total_value',
                                                'sale.contract_number',
                                                'sale.customer.complete_name',
                                                'sale.customer.id',
                                                'sale.branch.id',
                                                'sale.branch.name',
                                                'product.id',
                                                'product.name',
                                                'product.description',
                                                'sale.signature_date',
                                                'sale.status',
                                                'sale.homologator.complete_name',
                                                'address.complete_address',
                                            ],
                                            filter: 'status__in=C,P,EA',
                                        }}
                                        mapResponse={(data) =>
                                            data.results.map((p) => ({
                                                label: `${p.project_number} - ${p.sale?.customer?.complete_name}`,
                                                value: p.id,
                                                project: p,
                                            }))
                                        }
                                        fullWidth
                                        helperText={errors.project?.[0] || ''}
                                        error={!!errors.project}
                                        renderOption={(props, option) => (
                                            <li {...props}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Card sx={{ padding: 0, maxWidth: 450 }}>
                                                        <CardHeader
                                                            title={`Projeto: ${option.project?.project_number}`}
                                                            subheader={option.project.sale?.customer?.complete_name || 'Cliente não Disponível'}
                                                        />
                                                        <CardContent>
                                                            <Typography variant="body2">
                                                                <strong>Valor total:</strong>{' '}
                                                                {option.project.sale?.total_value
                                                                    ? formatCurrency(option.project.sale.total_value)
                                                                    : 'Sem valor Total'}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Contrato:</strong>{' '}
                                                                {option.project.sale?.contract_number || 'Contrato não Disponível'}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Homologador:</strong>{' '}
                                                                {option.project.sale?.homologator?.complete_name || 'Homologador não Disponível'}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Data de Contrato:</strong>{' '}
                                                                {new Date(option.project.sale?.signature_date).toLocaleString('pt-BR') || 'Data de Contrato não Disponível'}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ textWrap: 'wrap' }}>
                                                                <strong>Endereço:</strong>{' '}
                                                                {option.project.address?.complete_address || 'Endereço não Disponível'}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Status da Venda:</strong>{' '}
                                                                {option.project.sale?.status ? (
                                                                    <StatusChip status={option.project.sale.status} />
                                                                ) : (
                                                                    'Status não Disponível'
                                                                )}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Produto:</strong>{' '}
                                                                {option.project.product?.description || 'Produto não Disponível'}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Box>
                                            </li>
                                        )}
                                        sx={{
                                            width: "100%",
                                            fontSize: "1rem",
                                            marginBottom: "1rem",
                                            "& .MuiInputBase-root": {
                                                height: "56px",
                                            },
                                        }}
                                    />)
                                }
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {/* Subject */}
                                <GenericAsyncAutocompleteInput
                                    label="Assunto"
                                    value={formData.subject}
                                    onChange={handleSelectChange("subject")}
                                    endpoint="/api/tickets-subjects"
                                    queryParam="subject__icontains"
                                    extraParams={{ fields: "id,subject,category", ordering: "category" }}
                                    mapResponse={(data) =>
                                        data.results.map((s) => ({
                                            value: s.id,
                                            label: `${s.category} - ${s.subject}`,
                                        }))
                                    }
                                    error={!!errors.subject}
                                    helperText={errors.subject?.[0]}
                                    sx={{
                                        width: "100%",
                                        fontSize: "1rem",
                                        marginBottom: "1rem",
                                        "& .MuiInputBase-root": {
                                            height: "56px",
                                        },
                                    }}
                                />
                            </Grid>


                            {/* Tipo de Ticket */}
                            <Grid item xs={12} md={6}>
                                <GenericAsyncAutocompleteInput
                                    label="Tipo de Ticket"
                                    value={formData.ticket_type}
                                    onChange={handleSelectChange("ticket_type")}
                                    endpoint="/api/ticket-types"
                                    queryParam="name__icontains"
                                    extraParams={{ fields: "id,name" }}
                                    mapResponse={(data) =>
                                        data.results.map((t) => ({
                                            value: t.id,
                                            label: t.name,
                                        }))
                                    }
                                    error={!!errors.ticket_type}
                                    helperText={errors.ticket_type?.[0]}
                                    sx={{
                                        width: "100%",
                                        fontSize: "1rem",
                                        marginBottom: "1rem",
                                        "& .MuiInputBase-root": {
                                            height: "56px",
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Description */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descrição"
                                    name="description"
                                    multiline
                                    minRows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={!!errors.description}
                                    helperText={errors.description?.[0]}
                                    sx={{
                                        width: "100%",
                                        fontSize: "1rem",
                                        marginBottom: "1rem",
                                    }}
                                />
                            </Grid>

                            {/* Status: só aparece quando ticketId for truthy */}
                            {ticketId && (
                                <Grid item xs={12} md={6} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        error={!!errors.status}
                                        helperText={errors.status?.[0]}
                                        sx={{
                                            width: "100%",
                                            fontSize: "1rem",
                                            marginBottom: "1rem",
                                            "& .MuiInputBase-root": {
                                                height: "56px",
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
                            )}

                            {/* Priority */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Prioridade"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    error={!!errors.priority}
                                    helperText={errors.priority?.[0]}
                                    sx={{
                                        width: "100%",
                                        fontSize: "1rem",
                                        marginBottom: "1rem",
                                        "& .MuiInputBase-root": {
                                            height: "56px",
                                        },
                                    }}
                                >
                                    {priorityOptions.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Responsible */}
                            <Grid item xs={12} md={6}>
                                <GenericAsyncAutocompleteInput
                                    label="Responsável"
                                    value={formData.responsible}
                                    onChange={handleSelectChange("responsible")}
                                    endpoint="/api/users"
                                    queryParam="complete_name__icontains"
                                    extraParams={{ fields: "id,complete_name" }}
                                    mapResponse={(data) =>
                                        data.results.map((u) => ({
                                            value: u.id,
                                            label: u.complete_name,
                                        }))
                                    }
                                    error={!!errors.responsible}
                                    helperText={errors.responsible?.[0]}
                                    sx={{
                                        width: "100%",
                                        fontSize: "1rem",
                                        marginTop: "-1rem",
                                        "& .MuiInputBase-root": {
                                            height: "56px",
                                        },
                                    }}
                                />
                            </Grid>

                            {formData.conclusion_date && (
                                <Grid item xs={12} md={6} sm={12}>
                                    <TextField
                                        fullWidth
                                        label="Data de Conclusão"
                                        type="datetime-local"
                                        // name="conclusion_date"
                                        value={formData.conclusion_date ? formData.conclusion_date.slice(0, 16) : ""}
                                        // onChange={handleChange}
                                        disabled={true}
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.conclusion_date}
                                        helperText={errors.conclusion_date?.[0]}
                                        sx={{
                                            width: "100%",
                                            fontSize: "1rem",
                                            marginBottom: "1rem",
                                            "& .MuiInputBase-root": {
                                                height: "56px",
                                            },
                                        }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        <Grid container spacing={4} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    fullWidth
                                    sx={{ py: 1.5 }}
                                    disabled={loading}
                                    startIcon={loading && <CircularProgress size={20} />}
                                >
                                    {ticketId ? "Atualizar" : "Salvar"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                {ticketId && <>
                    {tab === 1 && (
                        <Comment
                            appLabel="customer_service"
                            model="ticket"
                            objectId={ticketId}
                            label="Comentários"
                        />
                    )}
                    {tab === 2 && (
                        <AttachmentTable
                            appLabel="customer_service"
                            model="ticket"
                            objectId={ticketId}
                        />
                    )}
                </>}
            </Box>
        </Box>
    );
}
