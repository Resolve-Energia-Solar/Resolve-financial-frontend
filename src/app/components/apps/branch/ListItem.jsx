'use client';

import React from 'react';
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
import { IconTrash, IconHash, IconMapPin, IconUsers } from '@tabler/icons-react';
import { Slide, Zoom } from '@mui/material';

const ListItem = ({ branches = [], onDelete }) => {
  if (!branches || branches.length === 0) {
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
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconHash size={20} style={{ marginRight: '8px' }} />
                    Id
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconUsers size={20} style={{ marginRight: '8px' }} />
                    Nome
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconMapPin size={20} style={{ marginRight: '8px' }} />
                    Endereço
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconUsers size={20} style={{ marginRight: '8px' }} />
                    Proprietários
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Ação</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((branch, index) => (
                <Zoom key={branch.id} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <TableRow hover>
                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        {branch.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {branch.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1">
                        {branch.address.street}, {branch.address.number},{' '}
                        {branch.address.neighborhood}, {branch.address.city} -{' '}
                        {branch.address.state}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        CEP: {branch.address.zip_code}, {branch.address.country}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {Array.isArray(branch.owners) && branch.owners.length > 0 ? (
                        branch.owners.map((owner) => (
                          <Typography key={owner.id} variant="body1">
                            {owner.complete_name} ({owner.email})
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Nenhum proprietário
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Deletar Filial">
                        <IconButton
                          onClick={() => onDelete(branch.id)}
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
};

export default ListItem;
