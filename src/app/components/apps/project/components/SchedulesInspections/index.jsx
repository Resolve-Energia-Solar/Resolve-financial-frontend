import React, { useEffect, useState } from 'react';
import projectService from '@/services/projectService';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import ChecklistSalesSkeleton from '../../../checklist/components/ChecklistSalesSkeleton';
import ProductChip from '../../../product/components/ProductChip';
import ListInspection from './list-Inspections';

function SchedulesInspections({ saleId, userId }) {
  const [projectsList, setProjectsList] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await projectService.getProjectBySale(saleId);
        setProjectsList(response.results);
        setCustomerId(projectsList[0]?.sale?.customer?.id);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <ChecklistSalesSkeleton />;
  }

  return (
    <div>
      {projectsList.map((project) => (
        <Box key={project.id} mt={3}>
          <Card elevation={10}>
            <CardContent>
              <Stack spacing={1} mb={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">{project.product?.name}</Typography>
                  <ProductChip status={project.product?.default} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    Valor do Produto
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {Number(project.product?.product_value).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Typography>
                </Stack>
              </Stack>

              <ListInspection projectId={project.id} product={project.product.id} customerId={userId} />
            </CardContent>
          </Card>
        </Box>
      ))}
    </div>
  );
}

export default SchedulesInspections;
