'use client';
import { Grid, Button, Stack, Box, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import { useParams } from 'next/navigation';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteSale from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Sales';
import FormDate from '@/app/components/forms/form-custom/FormDate';

import useProject from '@/hooks/projects/useProject';
import useProjectForm from '@/hooks/projects/useProjectForm';
import FormPageSkeleton from '../../../comercial/sale/components/FormPageSkeleton';
import ProductChip from '../../../product/components/ProductChip';

export default function EditProjectTab({ projectId = null, detail = false }) {
  const params = useParams();
  let id = projectId;
  if (!projectId) id = params.id;

  const { loading, error, projectData } = useProject(id);

  console.log('produtos/materiais', projectData?.product?.materials);

  const { formData, handleChange, handleSave, formErrors, success } = useProjectForm(
    projectData,
    id,
  );

  const status_options = [
    { value: 'P', label: 'Pendente' },
    { value: 'CO', label: 'Concluído' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  if (loading) return <FormPageSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Box mt={3}>
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



            <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
              <Table>
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
                  {projectData?.product?.materials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        <Typography variant="body2">Nenhuma vistoria agendada</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    projectData?.product?.materials.map((material) => (
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
            </TableContainer>


          </CardContent>
        </Card>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Venda</CustomFormLabel>
          <AutoCompleteSale
            onChange={(id) => handleChange('sale_id', id)}
            value={formData.sale_id}
            disabled={detail}
            {...(formErrors.sale_id && { error: true, helperText: formErrors.sale_id })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Projetista</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('designer_id', id)}
            value={formData.designer_id}
            disabled={detail}
            {...(formErrors.designer_id && { error: true, helperText: formErrors.designer_id })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Homologador</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('homologator_id', id)}
            value={formData.homologator_id}
            disabled={detail}
            {...(formErrors.homologator_id && {
              error: true,
              helperText: formErrors.homologator_id,
            })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status"
            options={status_options}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={detail}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status Projetista"
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
        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            {!detail && (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Salvar alterações
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
