import { useEffect, useState } from "react";
import {
    Tabs, Tab, Box, Button, TextField, MenuItem, Grid, Switch, FormControlLabel, FormGroup
} from "@mui/material";
import GenericAsyncAutocompleteInput from "@/app/components/filters/GenericAsyncAutocompleteInput";
import userService from "@/services/userService";
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import { Add } from "@mui/icons-material";
import UserPhoneNumbersTable from "./phone_numbers/UserPhoneNumbersTable";
import UserAddressesTable from "./addresses/UserAddressesTable";

function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

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
        complete_name: "",
        birth_date: null,
        gender: "",
        first_document: "",
        second_document: null,
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
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (e, newValue) => setTabIndex(newValue);

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

    const handleSelectChange = (name) => (e) => {
        setFormData((f) => ({ ...f, [name]: e.target.value }));
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
        <Box
            component="form"
            sx={{ height: '100vh', overflowY: 'auto' }}
        >
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
            >
                <Tab label="Usuário" />
                <Tab label="Informações Pessoais" />
                <Tab label="Permissões" />
                <Tab label="Endereços" />
                <Tab label="Números de Telefone" />
            </Tabs>

            {/* Usuário */}
            <TabPanel value={tabIndex} index={0}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nome de Usuário"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="E-mail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Senha"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GenericAsyncAutocompleteInput
                            label="Tipos de Usuário"
                            name="api/users-types"
                            value={formData.user_types}
                            onChange={(newValue) => setFormData(f => ({ 
                                ...f, 
                                user_types: (newValue || []).map(item => item.value) 
                            }))}
                            endpoint="api/users-types"
                            queryParam="name__icontains"
                            extraParams={{ fields: ['id', 'name'] }}
                            mapResponse={(data) =>
                                data.results.map((ut) => ({ label: ut.name, value: ut.id }))
                            }
                            multiselect
                            error={!!errors.user_types}
                            helperText={errors.user_types ? errors.user_types[0] : ""}
                        />
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Informações Pessoais */}
            <TabPanel value={tabIndex} index={1}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nome Completo"
                            name="complete_name"
                            value={formData.complete_name}
                            onChange={handleChange}
                        />
                    </Grid>
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
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Tipo de Pessoa"
                            name="person_type"
                            select
                            value={formData.person_type}
                            onChange={handleChange}
                        >
                            <MenuItem value="PF">Pessoa Física</MenuItem>
                            <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Gênero"
                            name="gender"
                            select
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <MenuItem value="M">Masculino</MenuItem>
                            <MenuItem value="F">Feminino</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="CPF/CNPJ"
                            name="first_document"
                            value={formData.first_document}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="RG/Inscrição Estadual"
                            name="second_document"
                            value={formData.second_document}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Permissões */}
            <TabPanel value={tabIndex} index={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData(f => ({ ...f, is_active: e.target.checked }))}
                                    name="is_active"
                                    color="primary"
                                />
                            }
                            label="Ativo"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.is_staff}
                                    onChange={(e) => setFormData(f => ({ ...f, is_staff: e.target.checked }))}
                                    name="is_staff"
                                    color="primary"
                                />
                            }
                            label="Staff"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.is_superuser}
                                    onChange={(e) => setFormData(f => ({ ...f, is_superuser: e.target.checked }))}
                                    name="is_superuser"
                                    color="primary"
                                />
                            }
                            label="Superusuário"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GenericAsyncAutocompleteInput
                            label="Grupos"
                            name="groups"
                            value={formData.groups}
                            onChange={(newValue) => setFormData(f => ({ ...f, groups: newValue || [] }))}
                            endpoint="api/groups"
                            queryParam="name__icontains"
                            mapResponse={(data) =>
                                data.results.map((g) => ({ label: g.name, value: g.id }))
                            }
                            multiselect
                            fullWidth
                            extraParams={{ fields: ['id', 'name'] }}
                            error={!!errors.groups}
                            helperText={errors.groups ? errors.groups[0] : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GenericAsyncAutocompleteInput
                            label="Permissões do Usuário"
                            name="user_permissions"
                            value={formData.user_permissions}
                            onChange={(newValue) => setFormData(f => ({ ...f, user_permissions: newValue || [] }))}
                            endpoint="api/permissions"
                            queryParam="codename__icontains"
                            extraParams={{ fields: ['id', 'content_type.app_label', 'codename'], expand: 'content_type' }}
                            mapResponse={(data) =>
                                data.results.map((p) => ({ label: `${p.content_type.app_label}.${p.codename}`, value: p.id }))
                            }
                            multiselect
                            fullWidth
                            error={!!errors.user_permissions}
                            helperText={errors.user_permissions ? errors.user_permissions[0] : ""}
                        />
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Endereços */}
            <TabPanel value={tabIndex} index={3}>
                <UserAddressesTable userId={userId} onChange={(addresses) => setFormData(f => ({ ...f, addresses }))} />
            </TabPanel>

            {/* Números de Telefone */}
            <TabPanel value={tabIndex} index={4}>
                <UserPhoneNumbersTable userId={userId} onChange={(phones) => setFormData(f => ({ ...f, phone_numbers: phones }))} />
            </TabPanel>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, p: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Salvar
                </Button>
            </Box>
        </Box>
    );
}