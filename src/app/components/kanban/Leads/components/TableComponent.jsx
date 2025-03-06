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
                        {data.length > 0 ? (
                            data.map((row) => (
                                <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' }, borderBottom: 'none' }}>
                                    {columns.map((column) => (
                                        <TableCell key={column.field} sx={{ fontWeight: column.field === 'name' ? 600 : 400, fontSize: '14px', color: '#7E8388' }}>
                                            {column.render ? column.render(row) : row[column.field] || '-'}
                                        </TableCell>
                                    ))}

                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {actions?.edit && (
                                            <IconButton
                                                size="small"
                                                onClick={() => actions.edit(row)}
                                                sx={{ color: '#7E8388' }}
                                            >
                                                <IconPencil fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {actions?.view && (
                                            <IconButton
                                                size="small"
                                                onClick={() => actions.view(row)}
                                                sx={{ color: '#7E8388' }}
                                            >
                                                <IconEye fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
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