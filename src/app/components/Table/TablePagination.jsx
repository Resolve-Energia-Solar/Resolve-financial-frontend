import React, { useContext } from "react";
import { TablePagination as MuiPag } from "@mui/material";
import { TableCtxt } from "./TableRoot";

export function TablePagination() {
    const { totalRows, page, rowsPerPage, onPageChange, onRowsPerPageChange } = useContext(TableCtxt);

    return (
        <MuiPag
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            labelRowsPerPage="Linhas por página"
            labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                '& .Mui-selected': {
                    backgroundColor: '#FFCC00 !important',
                    color: '#7E8388',
                    borderRadius: '6px',
                },
            }}
        />
    );
}
