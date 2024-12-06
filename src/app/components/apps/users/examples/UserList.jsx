'use client';

import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton, Typography, CircularProgress, Avatar, Switch } from '@mui/material';
import { IconTrash, IconUser, IconBriefcase, IconCalendar, IconHash, IconMail } from '@tabler/icons-react';
import userService from '@/services/userService';
import { Slide, Zoom } from '@mui/material';

function UserList({ showrightSidebar }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUser();
        if (data && data.results) {
          setUsers(data.results);
        } else {
          throw new Error('Estrutura de dados inesperada');
        }
      } catch (err) {
        setError('Erro ao carregar os usuários');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                    <IconUser size={20} style={{ marginRight: '8px' }} />
                    Foto
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
                    <IconHash size={20} style={{ marginRight: '8px' }} />
                    Nome de Usuário
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
                    <IconUser size={20} style={{ marginRight: '8px' }} />
                    Nome Completo
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', minWidth: '250px' }}>
                    <IconMail size={20} style={{ marginRight: '8px' }} />
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                    <IconBriefcase size={20} style={{ marginRight: '8px' }} />
                    Setor
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                    <IconBriefcase size={20} style={{ marginRight: '8px' }} />
                    Cargo
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}>
                    <IconCalendar size={20} style={{ marginRight: '8px' }} />
                    Admissão
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', minWidth: '100px' }}>
                    Ativo
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" sx={{ minWidth: '100px' }}>Ação</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <Zoom
                  key={user.id}
                  in={true}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <TableRow hover >
                    <TableCell>
                      <Avatar
                        src={user.profile_picture}
                        alt={`${user.first_name} ${user.last_name}`}
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {user.username || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {user.first_name} {user.last_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {user.email || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {user.department || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {user.cargo || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.is_active}
                        inputProps={{ 'aria-label': 'Ativo/Inativo' }}
                        disabled
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Deletar Usuário">
                        <IconButton
                          onClick={() => console.log(`Deletar usuário ${user.id}`)}
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

export default UserList;

