
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Autocomplete, Box, Button, Grid, MenuItem } from "@mui/material";
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../forms/theme-elements/CustomFormLabel";
const SendingForm = ({ formData, due_date, handleInputChange, options, handleChangeSituation, multiSelectValues, handleSave }) => {

    console.log('Sending', formData);
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Projeto</CustomFormLabel>
                    <CustomTextField
                        name="project"
                        value={`${formData?.project_number} | ${formData?.sale?.customer?.complete_name}`}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
                    <Autocomplete
                        multiple
                        options={formData?.units}
                        getOptionLabel={(option) => option.name}
                        value={multiSelectValues}
                        onChange={handleChangeSituation}
                        renderInput={(params) => (
                            <CustomTextField {...params} label="Selecione opções" variant="outlined" />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Tipo da Solicitação</CustomFormLabel>
                    <CustomTextField
                        select
                        label="Tipo da Solicitação"
                        name="type_id"
                        value={formData?.type?.id}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    >
                        <MenuItem value={formData?.type?.id}>{formData?.type?.name}</MenuItem>
                    </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Data de Solicitação</CustomFormLabel>
                    <CustomTextField
                        name="request_date"
                        type="date"
                        value={formData?.request_date}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Data de vencimento</CustomFormLabel>
                    <CustomTextField
                        value={due_date(formData?.request_date, formData?.type?.dea)}
                        type="date"
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Data de Conclusão</CustomFormLabel>
                    <CustomTextField
                        name="conclusion_date"
                        type="date"
                        value={formData?.conclusion_date}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Protocolo Provisório</CustomFormLabel>
                    <CustomTextField
                        name="interim_protocol"
                        type="text"
                        value={formData?.interim_protocol}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Protocolo Provisório</CustomFormLabel>
                    <CustomTextField
                        name="final_protocol"
                        type="text"
                        value={formData?.final_protocol}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Protocolo Provisório</CustomFormLabel>
                    <CustomTextField
                        select
                        name="status"
                        type="text"
                        value={formData?.status}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"

                    >
                        <MenuItem value="D">Deferido</MenuItem>
                        <MenuItem value="I">Indeferido</MenuItem>
                        <MenuItem value="S">Solicitado</MenuItem>
                    </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Situações</CustomFormLabel>
                    <Autocomplete
                        multiple
                        options={options}
                        getOptionLabel={(option) => option.name}
                        value={multiSelectValues}
                        onChange={handleChangeSituation}
                        renderInput={(params) => (
                            <CustomTextField {...params} label="Selecione opções" variant="outlined" />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="address">Usuário</CustomFormLabel>
                    <CustomTextField
                        type="text"
                        value={formData?.requested_by?.complete_name}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
            </Grid>
            <Box mt={4}  >
                <Button
                    variant="contained"
                    color={"primary"}
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    fullWidth
                >
                    Salvar
                </Button>
            </Box>
        </>
    )
}

export default SendingForm