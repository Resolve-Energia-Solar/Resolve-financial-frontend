import { TableContainer, Table as MuiTable, Grid } from "@mui/material";
import React, { createContext } from "react";

export const TableCtxt = createContext({});

export function TableRoot({ data, columns, totalRows, page, rowsPerPage, onPageChange, onRowsPerPageChange, children }) {
    // return (
    //     <Grid container xs={12}>
    //         {children}
    //     </Grid>
    // );

    return (
        <TableCtxt.Provider value={{ data, columns, totalRows, page, rowsPerPage, onPageChange, onRowsPerPageChange }}>
            <Grid container xs={12}>
                <TableContainer sx={{ borderRadius: 2 , overflow: 'hidden', backgroundColor: '#F9FAFB' }}>
                    <MuiTable sx={{ borderCollapse: 'separate', borderSpacing: '0px 8px' }}>
                        {children}
                    </MuiTable>
                </TableContainer>
            </Grid>
        </TableCtxt.Provider>
    );
}