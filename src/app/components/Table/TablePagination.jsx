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
            onPageChange={(_, newPage) => onPageChange(newPage)}
            onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            labelRowsPerPage="Linhas por página"
            sx={{
                '& .Mui-selected': {
                    backgroundColor: '#FFCC00 !important',
                    color: '#7E8388',
                    borderRadius: '6px',
                },
            }}
        />
    );
}