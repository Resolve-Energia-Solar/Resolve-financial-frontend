import React, { useEffect, useState } from 'react';
import CheckListRateio from '../Checklist-list';
import projectService from '@/services/projectService';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import ProductChip from '../../product/components/ProductChip';

function ChecklistSales({ saleId }) {
  const [projectsList, setProjectsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await projectService.getProjectBySale(saleId);
        console.log(response.results);
        setProjectsList(response.results);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
      }
    };
    fetchData();
  }, []);

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

              <CheckListRateio projectId={project.id} />
            </CardContent>
          </Card>
        </Box>
      ))}
    </div>
  );
}

export default ChecklistSales;
