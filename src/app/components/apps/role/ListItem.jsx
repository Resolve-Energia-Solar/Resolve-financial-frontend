'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconTrash, IconHash, IconUsers } from '@tabler/icons-react';
import { Slide, Switch, Zoom } from '@mui/material';

const ListItem = ({ roles = [], onDelete }) => {
  if (!roles || roles.length === 0) {
    return <div>Nenhuma filial encontrada.</div>;
  }

  return (
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
                <TableCell align="right">
                  <Typography variant="subtitle1">Ação</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role, index) => (
                <Zoom key={role.id} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <TableRow hover>
                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        {role.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {role?.name}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Deletar Filial">
                        <Switch
                          onClick={() => onDelete(role.id)}
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 0, 0, 0.1)',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <IconTrash size="24" />
                        </Switch>
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
};

export default ListItem;
