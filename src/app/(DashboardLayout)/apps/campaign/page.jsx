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
import { Slide, Zoom, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ChildCard from '@/app/components/shared/ChildCard';
import campaignService from '@/services/campaignService';
import { useRouter } from 'next/navigation';

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Campanhas",
  },
];

function Page() {
  const [campaign, setCampaign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await campaignService.getCampaigns();
        setCampaign(data.results);
      } catch (err) {
        setError('Erro ao carregar campanhas');
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

  const handleEditClick = (id) => {
      router.push(`/apps/campaign/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setCampaignToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCampaignToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      // Uncomment the following line when you have the delete function ready
      // await campaignService.deleteCampaign(campaignToDelete);
      setCampaign(campaign.filter((item) => item.id !== campaignToDelete));
      console.log('Campanha excluída com sucesso');
    } catch (err) {
      setError('Erro ao excluir a campanha');
      console.error('Erro ao excluir a campanha:', err);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <PageContainer title="Filiais" description="Lista de filiais">
      <Breadcrumb title="Filiais" items={BCrumb} />
      <ChildCard>
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
                                onClick={() => handleEditClick(campaignItem.id)}
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
                                onClick={() => handleDeleteClick(campaignItem.id)}
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
          <Typography variant="body1" color="textSecondary" align="center">Nenhuma campanha encontrada.</Typography>
        )}
      </ChildCard>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir esta campanha? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

export default Page;
