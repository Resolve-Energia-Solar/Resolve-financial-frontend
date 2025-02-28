import React, { useState, useEffect, useContext } from 'react';
import {
    TablePagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography, 
    IconButton
} from '@mui/material';
import TableSkeleton from '@/app/components/apps/comercial/sale/components/TableSkeleton';
import leadService from '@/services/leadService';
import formatPhoneNumber from '@/utils/formatPhoneNumber';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import { IconEye, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const TableComponent = ({ columns, fetchData, actions }) => {
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            try {
                const result = await fetchData({
                    page: page + 1,
                    limit: rowsPerPage,
                });
                setData(result.results);
                setTotalRows(result.count);
            } catch (err) {
                setError('Erro ao carregar dados!');
            } finally {
                setLoadingData(false);
            }
        };

        loadData();

    }, [page, rowsPerPage, fetchData]);

    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.field} sx={{ fontWeight: 600, fontSize: "13px" }}>
                                {column.headerName}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {loadingData ? (
                    <TableSkeleton rows={rowsPerPage} columns={columns.length} />
                ) : error && page === 1 ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.id}
                                // onClick={() => onClick(row)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(236, 242, 255, 0.35)',
                                    },
                                }}
                            >
                                {columns.map((column) => (
                                    <TableCell key={column.field} sx={{ fontWeight: 600, fontSize: "12px" }}>
                                        {column.render ? column.render(row) : row[column.field] || "-"}
                                    </TableCell>
                                ))}

                                {actions && (
                                    <TableCell sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {actions.edit && (
                                            <IconButton
                                                size="small"
                                                onClick={() => router.push(`/apps/leads/${row.id}/edit`)}
                                            >
                                                <IconPencil fontSize="small" />
                                            </IconButton>
                                        )}
                                        {actions.view && (
                                            <IconButton
                                                size="small"
                                                onClick={() => router.push(`/apps/leads/${row.id}/view`)}
                                            >
                                                <IconEye fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                )}

                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage="Linhas por página"
            />
        </TableContainer>
    );
}
export default TableComponent;