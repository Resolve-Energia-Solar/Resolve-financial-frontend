import { Box, Button, CircularProgress, Grid } from '@mui/material';
import FormDate from '../../forms/form-custom/FormDate';
import FormSelect from '../../forms/form-custom/FormSelect';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import userService from '@/services/userService';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
export default function Customer({ data, onRefresh = () => {} }) {
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSave = async (id) => {
    setLoading(true);
    try {
      const response = await userService.update(id, {
        complete_name: formData.complete_name,
        email: formData.email,
        gender: formData.gender,
        birth_date: formData.birth_date,
        first_document: formData.first_document,
        person_type: formData.person_type,
      });

      setFormData(response);
      onRefresh();
      setDisabled(true);
      enqueueSnackbar('Salvo com sucesso!', { variant: 'success' });
    } catch (error) {
      setFormData(data);
      setDisabled(false);
      console.log(error);
      enqueueSnackbar(`Erro ao salvar contate o suporte: ${error.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  let formErrors;
  return (
    <>
      {formData && (
        <Box sx={{ marginBottom: 4 }}>
          <Grid container spacing={3} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="email">Nome Contratante</CustomFormLabel>
              <CustomTextField
                disabled={disabled}
                name="complete_name"
                variant="outlined"
                fullWidth
                value={formData.complete_name}
                onChange={handleChange}
                {...(formErrors?.complete_name && { error: true, helperText: formErrors?.email })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
              <CustomTextField
                disabled={disabled}
                name="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                {...(formErrors?.email && { error: true, helperText: formErrors?.email })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="email">CPF / CNPJ</CustomFormLabel>
              <CustomTextField
                disabled={disabled}
                name="first_document"
                variant="outlined"
                fullWidth
                value={formData.first_document}
                onChange={handleChange}
                {...(formErrors?.first_document && {
                  error: true,
                  helperText: formErrors?.first_document,
                })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <FormSelect
                disabled={disabled}
                name="gender"
                label="Gênero"
                options={[
                  { value: 'M', label: 'Masculino' },
                  { value: 'F', label: 'Feminino' },
                ]}
                value={formData.gender}
                onChange={handleChange}
                {...(formErrors?.gender && { error: true, helperText: formErrors?.gender })}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={4}>
              <FormDate
                disabled={disabled}
                label="Data de Nascimento"
                name="birth_date"
                value={formData.birth_date}
                onChange={(newValue) =>
                  handleChange({ target: { value: newValue, name: 'birth_date' } })
                }
                {...(formErrors?.birth_date && { error: true, helperText: formErrors?.birth_date })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <FormSelect
                disabled={disabled}
                name="person_type"
                label="Natureza"
                options={[
                  { value: 'PF', label: 'PF' },
                  { value: 'PJ', label: 'PJ' },
                ]}
                value={formData.person_type}
                onChange={handleChange}
                {...(formErrors?.gender && { error: true, helperText: formErrors?.gender })}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', marginBottom: 2, justifyContent: 'end' }}>
            {!disabled ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSave(data.id)}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon size={20} />
                }
              >
                {loading ? 'Salvando' : 'Salvar'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setDisabled(false)}
                disabled={loading}
                startIcon={<EditIcon size={20} />}
              >
                Editar
              </Button>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
