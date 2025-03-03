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
                <Box sx={{ display: "flex", gap: 1 }}>
                    {actions?.edit && (
                        <IconButton
                            size="small"
                            onClick={() => actions.edit(params.row)}
                            sx={{ color: "#7E8388" }}
                        >
                            <IconPencil fontSize="small" />
                        </IconButton>
                    )}
                    {actions?.view && (
                        <IconButton
                            size="small"
                            onClick={() => actions.view(params.row)}
                            sx={{ color: "#7E8388" }}
                        >
                            <IconEye fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            ),
        },
    ];

    return (
        // <TableContainer sx={{ borderRadius: '12px' }}>
        //     <Table sx={{ borderCollapse: 'separate', borderSpacing: '0px 8px' }}>
        //         <TableHead>
        //             <TableRow>
        //                 {columns.map((column) => (
        //                     <TableCell key={column.field} sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>
        //                         {column.headerName}
        //                     </TableCell>
        //                 ))}
        //             </TableRow>
        //         </TableHead>

        //         {loading ? (
        //             <TableSkeleton rows={rowsPerPage} columns={columns.length} />
        //         ) : (
        //             <TableBody>
        //                 {data.length > 0 ? (
        //                     data.map((row) => (
        //                         <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' }, borderBottom: 'none' }}>
        //                             {columns.map((column) => (
        //                                 <TableCell key={column.field} sx={{ fontWeight: column.field === 'name' ? 600 : 400, fontSize: '14px', color: '#7E8388' }}>
        //                                     {column.render ? column.render(row) : row[column.field] || '-'}
        //                                 </TableCell>
        //                             ))}
        //                             {actions && (
        //                                 <TableCell sx={{ display: 'flex', justifyContent: 'space-between' }}>
        //                                     {actions.edit && (
        //                                         <IconButton size="small" onClick={() => actions.edit(row)} sx={{ color: '#7E8388' }}>
        //                                             <IconPencil fontSize="small" />
        //                                         </IconButton>
        //                                     )}
        //                                     {actions.view && (
        //                                         <IconButton size="small" onClick={() => actions.view(row)} sx={{ color: '#7E8388' }}>
        //                                             <IconEye fontSize="small" />
        //                                         </IconButton>
        //                                     )}
        //                                 </TableCell>
        //                             )}
        //                         </TableRow>
        //                     ))
        //                 ) : (
        //                     <TableRow>
        //                         <TableCell colSpan={columns.length} align="center">
        //                             <Typography variant="body2" color="textSecondary">
        //                                 Nenhum lead encontrado.
        //                             </Typography>
        //                         </TableCell>
        //                     </TableRow>
        //                 )}
        //             </TableBody>
        //         )}
        //     </Table>


        //     <TablePagination
        //         rowsPerPageOptions={[5, 10, 25]}
        //         component="div"
        //         count={totalRows}
        //         rowsPerPage={rowsPerPage}
        //         page={page}
        //         onPageChange={(_, newPage) => onPageChange(newPage)}
        //         onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        //         labelRowsPerPage="Linhas por página"
        //         sx={{
        //             '& .Mui-selected': {
        //                 backgroundColor: '#FFCC00 !important',
        //                 color: '#7E8388',
        //                 borderRadius: '6px',
        //             },
        //         }}
        //     />
        // </TableContainer>
        <Box sx={{ height: 500, width: "100%" }}>
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