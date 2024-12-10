
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Autocomplete, Box, Button, MenuItem, TextField, Typography } from "@mui/material";
const LateralForm = ({ isEditing, formData, due_date, handleInputChange, options, handleChangeSituation, multiSelectValues, handleSave, handleEditToggle }) => {

    return (

        <div style={{ width: 400, padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
                {isEditing ? "Editar Item" : "Detalhes do Item"}
            </Typography>

            <TextField
                label="Endereço"
                value={`${formData.unit?.address?.zip_code}, ${formData.unit?.address.street}, ${formData.unit?.address.neighborhood}, ${formData.unit?.address?.city} - ${formData.unit?.address?.state},  ${formData.unit?.address.number}`}
                fullWidth
                margin="normal"
                disabled
            >

            </TextField>
            <TextField
                label="Projeto"
                name="project"
                value={`${formData.project.project_number} | ${formData.project.sale?.customer?.complete_name}`}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled
            />

            <TextField
                select
                label="Tipo da Solicitação"
                name="type_id"
                value={formData.type.id}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled
            >
                <MenuItem value={formData.type.id}>{formData.type.name}</MenuItem>
            </TextField>

            <TextField
                label="Data de Solicitação"
                name="request_date"
                type="date"
                value={formData.request_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
            />
            <TextField
                label="Data de Vencimento"
                value={due_date(formData.request_date, formData.type.dea)}
                type="date"
                fullWidth
                margin="normal"
                disabled
            />
            <TextField
                label="Data de Conclusão"
                name="conclusion_date"
                type="date"
                value={formData.conclusion_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
            />
            <TextField
                label="Protocolo Provisório"
                name="interim_protocol"
                type="text"
                value={formData.interim_protocol}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
            />
            <TextField
                label="Protocolo Permanente"
                name="final_protocol"
                type="text"
                value={formData.final_protocol}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
            />
            <TextField
                label="Status"
                select
                name="status"
                type="text"
                value={formData.status}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing || formData.status != 'S'}
            >
                <MenuItem value="D">Deferido</MenuItem>
                <MenuItem value="I">Indeferido</MenuItem>
                <MenuItem value="S">Solicitado</MenuItem>
            </TextField>
            <Autocomplete
                multiple
                options={options}
                getOptionLabel={(option) => option.name}
                value={multiSelectValues}
                onChange={handleChangeSituation}
                disabled={!isEditing}
                renderInput={(params) => (
                    <TextField {...params} label="Selecione opções" variant="outlined" />
                )}
            />
            <TextField
                label="Solicitante"
                type="text"
                value={formData?.requested_by?.complete_name}
                fullWidth
                margin="normal"
                disabled
            />
            <Box mt={4} >
                <Button
                    variant="contained"
                    color={isEditing ? "primary" : "secondary"}
                    onClick={isEditing ? handleSave : handleEditToggle}
                    startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                    fullWidth
                >
                    {isEditing ? "Salvar" : "Editar"}
                </Button>
            </Box>
        </div>
    )
}

export default LateralForm