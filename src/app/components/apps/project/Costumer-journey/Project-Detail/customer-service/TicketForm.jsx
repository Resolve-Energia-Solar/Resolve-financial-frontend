import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Grid, Box, CircularProgress } from "@mui/material";
import GenericAsyncAutocompleteInput from "@/app/components/filters/GenericAsyncAutocompleteInput";
import ticketService from "@/services/ticketService";

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
        subject: "",
        description: "",
        status: "",
        // conclusion_date: null,
        priority: "",
        responsible_user: null,
        ticket_type: null,
    });

    console.log("TicketForm mounted with projectId:", projectId, "and ticketId:", ticketId);

    const [errors, setErrors] = useState({});
    const [projectInfo, setProjectInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadTicket = async () => {
            if (ticketId) {
                setLoading(true);
                try {
                    const data = await ticketService.find(ticketId, {
                        expand: "project",
                        fields:
                            "id,project.id,project.project_number,project.sale.customer,subject,description,status,conclusion_date,priority,responsible_user,ticket_type",
                    });
                    setProjectInfo(data.project || null);
                    setFormData({
                        project: data.project?.id || null,
                        subject: data.subject || "",
                        description: data.description || "",
                        status: data.status || "",
                        conclusion_date: data.conclusion_date || "",
                        priority: data.priority || "",
                        responsible_user: data.responsible_user || null,
                        ticket_type: data.ticket_type || null,
                    });
                } catch (err) {
                    console.error("Erro ao carregar o ticket", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadTicket();
    }, [ticketId]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name) => (v) => {
        setFormData((prev) => ({ ...prev, [name]: v?.value || "" }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const payload = { ...formData };
            if (!ticketId) {
                delete payload.status;
            }
            if (ticketId) {
                await ticketService.update(ticketId, payload);
            } else {
                await ticketService.create(payload);
            }

            onSave();
        } catch (err) {
            if (err.response?.data) {
                setErrors(err.response.data);
                if (err.response.status === 403) {
                    console.error("Você não tem permissão para realizar esta ação.");
                    return;
                }
                console.error("Erro ao salvar o ticket. Verifique os campos e tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form">
            <Grid container spacing={4} sx={{ marginBottom: "2rem" }}>
                <Grid item xs={12}>
                    <h2>{ticketId ? "Editar Ticket" : "Novo Ticket"}</h2>
                </Grid>
                {/* Mostrar informação do projeto, se aplicável */}
                {projectId && projectInfo && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Projeto"
                            value={`${projectInfo.project_number} - ${projectInfo.sale?.customer?.complete_name}`}
                            disabled
                            sx={{
                                width: "100%",
                                fontSize: "1rem",
                                marginBottom: "1.5rem",
                                "& .MuiInputBase-root": {
                                    height: "56px",
                                },
                            }}
                        />
                    </Grid>
                )}
            </Grid>

            <Grid container spacing={4}>
                {/* Subject */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Assunto"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
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

                {/* Tipo de Ticket */}
                <Grid item xs={12}>
                    <GenericAsyncAutocompleteInput
                        label="Tipo de Ticket"
                        value={formData.ticket_type}
                        onChange={handleSelectChange("ticket_type")}
                        endpoint="/api/ticket-types"
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

                {/* Status: só aparece quando ticketId for truthy */}
                {ticketId && (
                    <Grid item xs={12} sm={6}>
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


                {/* Responsible (usuário) */}
                <Grid item xs={12} sm={12}>
                    <GenericAsyncAutocompleteInput
                        label="Responsável"
                        value={formData.responsible_user}
                        onChange={handleSelectChange("responsible_user")}
                        endpoint="/api/users"
                        extraParams={{ user_types: 3, fields: "id,complete_name,email" }}
                        mapResponse={(data) =>
                            data.results.map((u) => ({
                                value: u.id,
                                label: u.complete_name || u.email,
                            }))
                        }
                        error={!!errors.responsible_user}
                        helperText={errors.responsible_user?.[0]}
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

                {/* Priority */}
                <Grid item xs={12} sm={12}>
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

                {formData.conclusion_date && (
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            label="Data de Conclusão"
                            type="date"
                            name="conclusion_date"
                            value={formData.conclusion_date || ""}
                            onChange={handleChange}
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

                {/* Botão Salvar */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{ padding: "10px" }}
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {ticketId ? "Atualizar" : "Salvar"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
