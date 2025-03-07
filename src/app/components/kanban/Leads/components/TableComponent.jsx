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
import TableSkeleton from '@/app/components/apps/comercial/sale/components/TableSkeleton';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import { IconEye, IconPencil } from '@tabler/icons-react';

const TableComponent = ({
    columns,
    data,
    totalRows,
    loading,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    actions,
    filters
}) => {

    const filteredData = data.filter((row) => {
        const activeFilters = filters || {};

        return Object.keys(activeFilters).every((key) => {
            if (!filters[key]) return true;
            return row[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
        });
    });

    return (
        <TableContainer sx={{ borderRadius: '12px' }}>
            <Table sx={{ borderCollapse: 'separate', borderSpacing: '0px 8px' }}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.field} sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>
                                {column.headerName}
                            </TableCell>
                        ))}
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>
                            Editar
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>
                            Ver
                        </TableCell>
                    </TableRow>
                </TableHead>

                {loading ? (
                    <TableSkeleton rows={rowsPerPage} columns={columns.length} />
                ) : (
                    <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} align="center">
                                Carregando...
                            </TableCell>
                        </TableRow>
                    ) : filteredData.length > 0 ? (
                        filteredData.map((row) => (
                            <TableRow key={row.id}>
                                {columns.map((column) => (
                                    <TableCell key={column.field}>
                                        {column.render ? column.render(row) : row[column.field] || '-'}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    {actions.edit && (
                                        <IconButton onClick={() => actions.edit(row)}>
                                            <IconPencil />
                                        </IconButton>
                                    )}
                                    {actions.view && (
                                        <IconButton onClick={() => actions.view(row)}>
                                            <IconEye />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} align="center">
                                <Typography variant="body2" color="textSecondary">
                                    Nenhum lead encontrado.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                )}
            </Table>


            <TablePagination
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
        </TableContainer>
    );
};

export default TableComponent;