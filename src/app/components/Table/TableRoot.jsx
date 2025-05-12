import React, { createContext } from 'react';
import { TableContainer, Table as MuiTable, Grid, Box } from '@mui/material';
import { Table } from './index';

export const TableCtxt = createContext({});

export function TableRoot({ children, noWrap, ...ctx }) {
  return (
    <TableCtxt.Provider value={ctx}>
      <Grid
        container
        xs={12}
        sx={{
          border: '1px solid rgba(126, 131, 136, 0.17)',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          px: 3,
        }}
      >
        <TableContainer sx={{
          overflow: 'auto',
          width: '100%',
          '&::-webkit-scrollbar': {
            height: 6,
            width: 6,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 3,
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.3) transparent'
        }}
        >
          <MuiTable sx={{
            borderCollapse: 'separate', borderSpacing: '0px 8px',
            ...(noWrap && { '& th, & td': { whiteSpace: 'nowrap' } })
          }}>
            {children.filter(child => child.type !== Table.Pagination)}
          </MuiTable>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', pt: 1 }}>
          {children.find(child => child.type === Table.Pagination)}
        </Box>
      </Grid>
    </TableCtxt.Provider>
  );
}

