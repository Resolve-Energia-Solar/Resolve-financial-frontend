'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconTrash, IconHash, IconMapPin, IconUsers, IconEdit } from '@tabler/icons-react';
import { Slide, Zoom } from '@mui/material';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ChildCard from '@/app/components/shared/ChildCard';
import campaignService from '@/services/campaignService';

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Filiais",
  },
];

function Page() {
  const [campaign, setCampaign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await campaignService.getCampaigns();
        setLoading(false);
        console.log(data);
        setCampaign(data.results);
      } catch (err) {
        setError('Erro ao carregar campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <PageContainer title="Filiais" description="Lista de filiais">
        {campaign.length > 0 ? (
          <Box mt={4}>
            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
              <TableContainer
                sx={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconHash size={20} style={{ marginRight: '8px' }} />
                          Id
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconUsers size={20} style={{ marginRight: '8px' }} />
                          Nome
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconMapPin size={20} style={{ marginRight: '8px' }} />
                          Descrição
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconUsers size={20} style={{ marginRight: '8px' }} />
                          Data inicial
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconUsers size={20} style={{ marginRight: '8px' }} />
                          Data final
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1">Ação</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaign.map((campaignItem, index) => (
                      <Zoom key={campaignItem.id} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                        <TableRow hover>
                          <TableCell>
                            <Typography variant="body1" color="textSecondary">
                              {campaignItem.id}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle1" fontWeight={600} noWrap>
                              {campaignItem.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1" fontWeight={600} noWrap>
                              {campaignItem.description}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle1" fontWeight={600} noWrap>
                              {new Date(campaignItem.start_datetime).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1" fontWeight={600} noWrap>
                              {new Date(campaignItem.end_datetime).toLocaleDateString()}
                            </Typography>
                          </TableCell>

                          <TableCell align="right">
                            <Tooltip title="Editar Filial">
                              <IconButton
                                onClick={() => console.log(`Editar filial ${campaignItem.id}`)}
                                sx={{
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <IconEdit size="24" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Deletar Filial">
                              <IconButton
                                onClick={() => console.log(`Deletar filial ${campaignItem.id}`)}
                                sx={{
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <IconTrash size="24" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      </Zoom>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Slide>
          </Box>
        ) : (
          <div>Nenhuma filial encontrada</div>
        )}
    </PageContainer>
  );
}

export default Page;
