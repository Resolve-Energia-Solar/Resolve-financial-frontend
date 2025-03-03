"use-client";

import React, { useState, useEffect, useContext } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Typography,
    Chip,
    IconButton,
    TablePagination,
    Box,
} from "@mui/material";
import { IconEye, IconPencil } from '@tabler/icons-react';
import { DataGrid, GridToolbar, GridLogicOperator } from '@mui/x-data-grid';

const TableComponent = ({
    columns,
    data,
    totalRows,
    loading,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    actions
}) => {

    const gridColumns = [
        ...columns.map((col) => ({
            field: col.field,
            headerName: col.headerName,
            flex: 1,
            renderCell: (params) =>
                col.render ? col.render(params.row) : params.value || "-",
        })),
        {
            field: "actions",
            headerName: "Editar / Ver",
            sortable: false,
            filterable: false,
            width: 120,
            renderCell: (params) => (
                <Box sx={{ display: "flex", gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {actions?.edit && (
                        <IconButton
                            size="small"
                            onClick={() => actions.edit(params.row)}
                            sx={{ color: "#7E8388", mt: 1 }}
                        >
                            <IconPencil fontSize="small" />
                        </IconButton>
                    )}
                    {actions?.view && (
                        <IconButton
                            size="small"
                            onClick={() => actions.view(params.row)}
                            sx={{ color: "#7E8388", mt: 1 }}
                        >
                            <IconEye fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ minHeight: 750, width: "100%" }}>
            <DataGrid
                rows={data}
                columns={gridColumns}
                loading={loading}
                paginationMode="server"
                rowCount={totalRows}
                pageSizeOptions={[5, 10, 25]}
                pageSize={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onPageSizeChange={onRowsPerPageChange}
                disableSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                sx={{
                    borderRadius: "12px",
                    border: "none",
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#303030",
                    },
                    "& .MuiDataGrid-row": {
                        "&:hover": {
                            backgroundColor: "rgba(236, 242, 255, 0.35)",
                        },
                        fontSize: '14px',
                        color: '#7E8388'
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                    },
                    "& .Mui-selected": {
                        backgroundColor: "#FFCC00 !important",
                        color: "#7E8388",
                        borderRadius: "6px",
                    },
                    "& .MuiDataGrid-cell[data-field='name']": {
                        fontWeight: 600,
                    },
                }}
            />
        </Box>
    );
};

export default TableComponent;