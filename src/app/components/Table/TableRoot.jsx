import { TableContainer, Table as MuiTable, Grid } from "@mui/material";
import React, { createContext } from "react";

export const TableCtxt = createContext({});

export function TableRoot({ data, columns, totalRows, page, rowsPerPage, onPageChange, onRowsPerPageChange, onRowClick, children }) {
    // return (
    //     <Grid container xs={12}>
    //         {children}
    //     </Grid>
    // );

    return (
        <TableCtxt.Provider value={{
            data, columns, totalRows, page, rowsPerPage, onPageChange, onRowsPerPageChange, onRowClick
        }}>
            <Grid container xs={12} sx={{ border: '1px solid rgba(126, 131, 136, 0.17)', boxShadow: 2, px: 3, borderRadius: 2, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <TableContainer>
                    <MuiTable sx={{ borderCollapse: 'separate', borderSpacing: '0px 8px' }}>
                        {children}
                    </MuiTable>
                </TableContainer>
            </Grid>
        </TableCtxt.Provider>
    );
}