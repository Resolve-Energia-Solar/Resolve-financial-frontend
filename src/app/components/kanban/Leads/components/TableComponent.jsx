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
import { Edit, Visibility } from "@mui/icons-material";
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
                const result = await fetchData(page, rowsPerPage);
                setData(result.results);
                setTotalRows(result.count);
            } catch (err) {
                setError('Erro ao carregar dados!');
            } finally {
                setLoadingData(false);
            }
        };

        loadData();

    }, [page, rowsPerPage]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage)
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <TableContainer sx={{ borderRadius: '12px' }}>
            <Table sx={{ borderCollapse: 'separate', borderSpacing: '0px 8px' }}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.field} sx={{ fontWeight: 600, fontSize: "13px", color: "#303030" }}>
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
                                    borderBottom: "none",
                                }}
                            >
                                {/* <TableCell>
                                    <Checkbox sx={{ color: "#7E8388" }} />
                                </TableCell> */}
                                {columns.map((column) => (
                                    <TableCell key={column.field} sx={{ fontWeight: column.field === "name" ? 600 : 400, fontSize: "12px", color: "#7E8388" }}>
                                        {column.render ? column.render(row) : row[column.field] || "-"}
                                    </TableCell>
                                ))}

                                {actions && (
                                    <TableCell sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {actions.edit && (
                                            <IconButton
                                                size="small"
                                                onClick={() => router.push(`/apps/leads/${row.id}/edit`)}
                                                sx={{ color: "#7E8388" }}
                                            >
                                                <IconPencil fontSize="small" />
                                            </IconButton>
                                        )}
                                        {actions.view && (
                                            <IconButton
                                                size="small"
                                                onClick={() => router.push(`/apps/leads/${row.id}/view`)}
                                                sx={{ color: "#7E8388" }}
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
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}

                labelRowsPerPage="Linhas por página"
                sx={{
                    '& .Mui-selected': {
                        backgroundColor: "#FFCC00 !important",
                        color: '#7E8388',
                        borderRadius: "6px",
                    },
                }}
            />

        </TableContainer>
    );
}
export default TableComponent;