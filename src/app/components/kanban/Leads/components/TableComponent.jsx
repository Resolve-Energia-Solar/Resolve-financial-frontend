"use-client";

import React, { useState, useMemo, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { IconEye, IconPencil } from "@tabler/icons-react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

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
    const [filters, setFilters] = useState([]); 
    const isFiltering = useRef(false);

    const filteredData = useMemo(() => {
        if (filters.length === 0) return data; 

        return data.filter((row) => {
            return filters.every((filter) =>
                filter.value
                    ? row[filter.field]?.toString().toLowerCase().includes(filter.value.toLowerCase())
                    : true
            );
        });
    }, [filters, data]);

    
    const handleFilterChange = (newModel) => {
        console.log("🔄 Applying Filter Change:", JSON.stringify(newModel, null, 2));

        if (isFiltering.current) return; 
        isFiltering.current = true; 
        setFilters(newModel.items.filter(item => item.value)); 

        setTimeout(() => { isFiltering.current = false; }, 100); 
    };

    const gridColumns = [
        ...columns.map((col) => ({
            field: col.field,
            headerName: col.headerName,
            flex: 1,
            filterable: true,
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
        <DataGrid
            rows={filteredData} 
            columns={gridColumns}
            loading={loading}
            filterModel={{ items: filters }}
            onFilterModelChange={handleFilterChange}
            paginationMode="server"
            rowCount={totalRows}
            pageSizeOptions={[5, 10, 25, 100]} 
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
    );
};

export default TableComponent;
