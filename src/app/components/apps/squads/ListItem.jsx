'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Typography,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  IconTrash,
  IconUsers,
  IconBuilding,
  IconMail,
  IconUser,
  IconMapPin,
} from '@tabler/icons-react';
import squadService from '@/services/squadService';
import { Slide, Zoom } from '@mui/material';

function SquadList() {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSquads = async () => {
      try {
        const data = await squadService.index();
        if (data && data.results) {
          setSquads(data.results);
        } else {
          throw new Error('Estrutura de dados inesperada');
        }
      } catch (err) {
        setError('Erro ao carregar os squads');
      } finally {
        setLoading(false);
      }
    };

    fetchSquads();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box mt={2}>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <TableContainer
          sx={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'auto',
            backgroundColor: '#f9f9f9',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="h6"
                    sx={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}
                  >
                    <IconUsers size={20} style={{ marginRight: '8px' }} />
                    Nome do Squad
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="h6"
                    sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}
                  >
                    <IconBuilding size={20} style={{ marginRight: '8px' }} />
                    Filial
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="h6"
                    sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}
                  >
                    <IconUser size={20} style={{ marginRight: '8px' }} />
                    Gerente
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="h6"
                    sx={{ display: 'flex', alignItems: 'center', minWidth: '250px' }}
                  >
                    <IconMapPin size={20} style={{ marginRight: '8px' }} />
                    Endereço da Filial
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" sx={{ minWidth: '100px' }}>
                    Ação
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {squads.map((squad, index) => (
                <Zoom key={squad.id} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <TableRow hover>
                    <TableCell>
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {squad.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1" noWrap>
                        {squad.branch.name || '—'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1" noWrap>
                        {squad.manager.complete_name || '—'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {squad.manager.email}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1">
                        {squad.branch.address.street}, {squad.branch.address.number},{' '}
                        {squad.branch.address.neighborhood}, {squad.branch.address.city} -{' '}
                        {squad.branch.address.state}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        CEP: {squad.branch.address.zip_code}, {squad.branch.address.country}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Deletar Squad">
                        <IconButton
                          onClick={() => console.log(`Deletar squad ${squad.id}`)}
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
  );
}

export default SquadList;
