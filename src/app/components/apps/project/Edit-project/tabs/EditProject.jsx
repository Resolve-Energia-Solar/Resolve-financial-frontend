'use client';
import {
  Grid,
  Button,
  Stack,
  Box,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  Tooltip,
  Divider,
} from '@mui/material';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteSale from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Sales';
import FormDate from '@/app/components/forms/form-custom/FormDate';

import useProject from '@/hooks/projects/useProject';
import useProjectForm from '@/hooks/projects/useProjectForm';
import FormPageSkeleton from '../../../comercial/sale/components/FormPageSkeleton';
import ProductChip from '../../../product/components/ProductChip';
import { CheckCircle, Error } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import projectMaterialsService from '@/services/projectMaterialService';
import { useSelector } from 'react-redux';

export default function EditProjectTab({ projectId = null, detail = false }) {
  const id = projectId;

  const [materials, setMaterials] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const displayedMaterials = showAllMaterials ? materials : materials.slice(0, 7);

  const userPermissions = useSelector((state) => state.user.permissions);
  const { loading, error, projectData } = useProject(id, {
    fields:
      'id,product.id,product.product_value,product.default,product.name,sale.id,sale.customer.id,sale.customer.complete_name,designer.id,designer.name,homologator.id,homologator.name,status,designer_status,start_date,end_date,material_list_is_completed',
    expand: 'product,sale,designer,homologator,sale.customer',
  });
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading: formLoading,
  } = useProjectForm(projectData, id);

  console.log('projectData', projectData);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const status_options = [
    { value: 'P', label: 'Pendente' },
    { value: 'CO', label: 'Concluído' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  const fetchMaterials = async () => {
    try {
      const response = await projectMaterialsService.index({
        project: projectId,
        expand: 'material',
        fields: 'id,material.name,amount',
      });
      setMaterials(response.results);
    } catch (error) {
      console.log('Erro ao buscar materiais do projeto:', error);
    }
  };

  useEffect(() => {
    if (projectData) {
      fetchMaterials();
    }
  }, [projectData]);

  if (loading) return <FormPageSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Box mt={3}>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Venda</CustomFormLabel>
            <AutoCompleteSale
              onChange={(id) => handleChange('sale', id)}
              value={formData.sale}
              disabled={detail}
              {...(formErrors.sale && { error: true, helperText: formErrors.sale })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Projetista</CustomFormLabel>
            <AutoCompleteUser
              onChange={(id) => handleChange('designer', id)}
              value={formData.designer}
              disabled={detail}
              {...(formErrors.designer && { error: true, helperText: formErrors.designer })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Homologador</CustomFormLabel>
            <AutoCompleteUser
              onChange={(id) => handleChange('homologator', id)}
              value={formData.homologator}
              disabled={detail}
              {...(formErrors.homologator && {
                error: true,
                helperText: formErrors.homologator,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormSelect
              label="Status de Homologação"
              options={status_options}
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={detail}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormSelect
              label="Status Desenho Executivo"
              options={status_options}
              value={formData.designer_status}
              onChange={(e) => handleChange('designer_status', e.target.value)}
              disabled={detail}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormDate
              label="Data de Início"
              name="start_date"
              value={formData.start_date}
              onChange={(newValue) => handleChange('start_date', newValue)}
              disabled={detail}
              {...(formErrors.start_date && { error: true, helperText: formErrors.start_date })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormDate
              label="Data de Término"
              name="end_date"
              value={formData.end_date}
              onChange={(newValue) => handleChange('end_date', newValue)}
              disabled={detail}
              {...(formErrors.end_date && { error: true, helperText: formErrors.end_date })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CustomFormLabel
                htmlFor="lista-material"
                sx={{
                  margin: 0,
                  padding: 0,
                  lineHeight: 4,
                }}
              >
                Lista de Material
              </CustomFormLabel>
              <Tooltip title="Status necessário para o cliente prosseguir na esteira">
                <HelpOutlineIcon />
              </Tooltip>
            </Box>
            <FormControl fullWidth>
              <Select
                id="lista-material"
                value={formData.material_list_is_completed ? 'true' : 'false'}
                disabled={detail}
                onChange={(e) => {
                  const novoStatus = e.target.value === 'true';
                  handleChange('material_list_is_completed', novoStatus);
                }}
              >
                <MenuItem value="false">Pendente</MenuItem>
                <MenuItem value="true">Finalizada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              {!detail && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    await handleSave();
                    setSnackbarOpen(true);
                  }}
                  disabled={formLoading}
                  endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {formLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {projectData?.product && (
          <Card elevation={10}>
            <CardContent>
              <Stack spacing={1} mb={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">{projectData.product?.name}</Typography>
                  <ProductChip status={projectData.product?.default} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    Valor do Produto
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {Number(projectData.product?.product_value).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Typography>
                </Stack>
              </Stack>

              <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' }, height: '100%' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Typography variant="h6" fontSize="14px">
                          Material
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h6" fontSize="14px">
                          Quantidade
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {materials.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          <Typography variant="body2">Nenhum material cadastrado</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedMaterials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell align="center">
                            <Typography variant="body2">{material?.material?.name}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">{Math.trunc(material?.amount)}</Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {materials.length > 7 && (
                  <Button
                    variant="text"
                    onClick={() => setShowAllMaterials(!showAllMaterials)}
                    sx={{ mt: 2, mb: 1 }}
                  >
                    {showAllMaterials ? 'Ver menos' : 'Ver todos'}
                  </Button>
                )}
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            formErrors && typeof formErrors === 'object' && Object.keys(formErrors).length > 0
              ? 'error'
              : 'success'
          }
          sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
          iconMapping={{
            error: <Error style={{ verticalAlign: 'middle' }} />,
            success: <CheckCircle style={{ verticalAlign: 'middle' }} />,
          }}
        >
          {formErrors && typeof formErrors === 'object' && Object.keys(formErrors).length > 0 ? (
            <ul
              style={{
                margin: '10px 0',
                paddingLeft: '20px',
                listStyleType: 'disc',
              }}
            >
              {Object.entries(formErrors).map(([field, messages]) => (
                <li
                  key={field}
                  style={{
                    marginBottom: '8px',
                  }}
                >
                  {`${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`}
                </li>
              ))}
            </ul>
          ) : formErrors ? (
            'Ocorreu um erro ao salvar as alterações.'
          ) : (
            'Alterações salvas com sucesso!'
          )}
        </Alert>
      </Snackbar>
    </>
  );
}
