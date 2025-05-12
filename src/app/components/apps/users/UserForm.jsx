import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Grid, Box } from "@mui/material";
import GenericAsyncAutocompleteInput from "@/app/components/filters/GenericAsyncAutocompleteInput";
import userService from "@/services/userService";

export default function UserForm({ userId = null, onSave }) {
    const [formData, setFormData] = useState({
        id: null,
        groups: [],
        distance: null,
        daily_schedules_count: null,
        is_superuser: false,
        first_name: "",
        last_name: "",
        is_staff: false,
        is_active: true,
        date_joined: "",
        complete_name: "",
        birth_date: null,
        gender: "",
        first_document: "",
        second_document: null,
        profile_picture: null,
        username: "",
        email: "",
        person_type: "",
        addresses: [],
        user_types: [],
        user_permissions: [],
        phone_numbers: [],
    });
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            if (userId) {
                const data = await userService.find(userId, {});
                setUser(data);
            }
        };
        loadUser();
    }, [userId]);

    const handleChange = (e) => {
        setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name) => (v) => {
        setFormData((f) => ({ ...f, [name]: v?.value || "" }));
    };

    const handleSubmit = async () => {
        try {
            if (userId) {
                await userService.update(userId, formData);
            } else {
                await userService.create(formData);
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
            <Grid container spacing={4}>
                {/* Nome Completo */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Nome Completo"
                        name="complete_name"
                        value={formData.complete_name}
                        onChange={handleChange}
                        error={!!errors.complete_name}
                        helperText={errors.complete_name ? errors.complete_name[0] : ""}
                    />
                </Grid>

                {/* Nome de Usuário */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Nome de Usuário"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        helperText={errors.username ? errors.username[0] : ""}
                    />
                </Grid>

                {/* E-mail */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="E-mail"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email[0] : ""}
                    />
                </Grid>

                {/* Tipo de Pessoa */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Tipo de Pessoa"
                        name="person_type"
                        select
                        value={formData.person_type}
                        onChange={handleSelectChange("person_type")}
                    >
                        <MenuItem value="PF">Pessoa Física</MenuItem>
                        <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
                    </TextField>
                </Grid>

                {/* Gênero */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Gênero"
                        name="gender"
                        select
                        value={formData.gender}
                        onChange={handleSelectChange("gender")}
                    >
                        <MenuItem value="M">Masculino</MenuItem>
                        <MenuItem value="F">Feminino</MenuItem>
                        <MenuItem value="O">Outro</MenuItem>
                    </TextField>
                </Grid>

                {/* Data de Nascimento */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Data de Nascimento"
                        name="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Telefone */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Telefone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone ? errors.phone[0] : ""}
                    />
                </Grid>

                {/* Endereço */}
                <Grid item xs={12} md={6}>
                    <GenericAsyncAutocompleteInput
                        label="Endereço"
                        value={formData.addresses}
                        onChange={(newValue) => setFormData({ ...formData, addresses: newValue })}
                        endpoint="/api/addresses"
                        queryParam="q"
                        extraParams={{
                            fields: ['id', 'complete_address'],
                            customer_id: formData.customer?.value || '',
                        }}
                        mapResponse={(data) =>
                            data.results.map((a) => ({ label: a.complete_address, value: a.id }))
                        }
                        multiselect
                        fullWidth
                        helperText={errors.addresses?.[0] || ''}
                        error={!!errors.addresses}
                        required
                    />
                </Grid>

                {/* Tipos de Usuário */}
                <Grid item xs={12} md={6}>
                    <GenericAsyncAutocompleteInput
                        label="Tipos de Usuário"
                        name="user_types"
                        value={formData.user_types}
                        onChange={handleSelectChange("user_types")}
                        endpoint="/api/user_types"
                        queryParam="name__icontains"
                        mapResponse={(data) =>
                            data.results.map((ut) => ({ label: ut.name, value: ut.id }))
                        }
                        multiselect
                        error={!!errors.user_types}
                        helperText={errors.user_types ? errors.user_types[0] : ""}
                    />
                </Grid>

                {/* Permissões do Usuário */}
                <Grid item xs={12} md={6}>
                    <GenericAsyncAutocompleteInput
                        label="Permissões do Usuário"
                        name="user_permissions"
                        value={formData.user_permissions}
                        onChange={handleSelectChange("user_permissions")}
                        error={!!errors.user_permissions}
                        helperText={errors.user_permissions ? errors.user_permissions[0] : ""}
                    />
                </Grid>

                {/* Grupos */}
                <Grid item xs={12} md={6}>
                    <GenericAsyncAutocompleteInput
                        label="Grupos"
                        name="groups"
                        value={formData.groups}
                        onChange={handleSelectChange("groups")}
                        error={!!errors.groups}
                        helperText={errors.groups ? errors.groups[0] : ""}
                    />
                </Grid>

                {/* Foto de Perfil */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Foto de Perfil"
                        name="profile_picture"
                        type="file"
                        onChange={(e) => setFormData({ ...formData, profile_picture: e.target.files[0] })}
                        error={!!errors.profile_picture}
                        helperText={errors.profile_picture ? errors.profile_picture[0] : ""}
                    />
                </Grid>

                {/* Senha */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Senha"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password[0] : ""}
                    />
                </Grid>

                {/* Confirmar Senha */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Confirmar Senha"
                        name="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        error={!!errors.confirm_password}
                        helperText={errors.confirm_password ? errors.confirm_password[0] : ""}
                    />
                </Grid>

                {/* Ativo/Inativo */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Ativo/Inativo"
                        name="is_active"
                        select
                        value={formData.is_active}
                        onChange={handleSelectChange("is_active")}
                    >
                        <MenuItem value={true}>Ativo</MenuItem>
                        <MenuItem value={false}>Inativo</MenuItem>
                    </TextField>
                </Grid>

                {/* Superusuário */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Superusuário"
                        name="is_superuser"
                        select
                        value={formData.is_superuser}
                        onChange={handleSelectChange("is_superuser")}
                    >
                        <MenuItem value={true}>Sim</MenuItem>
                        <MenuItem value={false}>Não</MenuItem>
                    </TextField>
                </Grid>

                {/* Administrador */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Administrador"
                        name="is_staff"
                        select
                        value={formData.is_staff}
                        onChange={handleSelectChange("is_staff")}
                    >
                        <MenuItem value={true}>Sim</MenuItem>
                        <MenuItem value={false}>Não</MenuItem>
                    </TextField>
                </Grid>

                {/* Data de Criação */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Data de Criação"
                        name="date_joined"
                        type="date"
                        value={formData.date_joined}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Documentos */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Primeiro Documento"
                        name="first_document"
                        value={formData.first_document}
                        onChange={handleChange}
                        error={!!errors.first_document}
                        helperText={errors.first_document ? errors.first_document[0] : ""}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Segundo Documento"
                        name="second_document"
                        value={formData.second_document}
                        onChange={handleChange}
                        error={!!errors.second_document}
                        helperText={errors.second_document ? errors.second_document[0] : ""}
                    />
                </Grid>

                {/* Telefone */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Telefone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone ? errors.phone[0] : ""}
                    />
                </Grid>

                {/* Celular */}
                <Grid item xs={12} md={6}>
                    <GenericAsyncAutocompleteInput
                        label="Celular"
                        name="cellphone"
                        value={formData.cellphone}
                        onChange={handleSelectChange("cellphone")}
                        error={!!errors.cellphone}
                        helperText={errors.cellphone ? errors.cellphone[0] : ""}
                    />
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