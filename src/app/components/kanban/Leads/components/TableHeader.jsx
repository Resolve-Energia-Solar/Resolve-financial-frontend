import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import FilterSelect from "./FiltersSelection";
import SortingFilter from "./SortingComponent";

const TableHeader = ({
    title,
    totalItems,
    objNameNumberReference,
    buttonLabel,
    onButtonClick,
    onFilterChange //now passing filterd data to tablevomponent
}) => {
    const [filters, setFilters] = useState({
        status: '',
        responsavel: '',
        client: '',
    });

    const handleFilterChange = (field, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value
        }));
        onFilterChange(field, value);
    };

    return (
        <Grid container xs={12} sx={{ display: 'flex', flexDirection: "row", justifyContent: 'flex-end', width: '100%', alignItems: 'center', p: 2 }}>
            {title && (
                <Grid item xs={5}>
                    <Typography sx={{ fontSize: '16px', color: "#092C4C" }}>
                        <span style={{ fontWeight: 'bold' }}>{title}: </span> {totalItems} {objNameNumberReference}
                    </Typography>
                </Grid>
            )}

            {/* finters@@@ and create button!!!@*/}
            {onFilterChange && (
                <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row", justifyContent: "flex-end", width: '100%', alignItems: 'center' }}>
                    <Grid item xs={1.5} sx={{ display: 'flex', justifyContent: "flex-end",}}>
                        <FilterSelect
                            label="Status"
                            value={filters.status || ""}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            options={[
                                { label: "Novo Lead", value: "new" },
                                { label: "1º Contato", value: "first" },
                            ]}
                        />
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: "flex-end",}}>
                        <FilterSelect
                            label="Responsável"
                            value={filters.responsavel || ""}
                            onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
                            options={[
                                { label: "Manuela", value: "manu" },
                                { label: "Sandra", value: "sandra" },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={2} sx={{ display: 'flex', justifyContent: "flex-end",}}>
                        <FilterSelect
                            label="Cliente"
                            value={filters.client || ""}
                            onChange={(e) => setFilters({ ...filters, client: e.target.value })}
                            options={[
                                { label: "Cliente 1", value: "client1" },
                                { label: "Cliente 2", value: "client2" },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={3.5} sx={{ display: 'flex', justifyContent: "flex-end",}}>
                        <SortingFilter
                            label="Ordenar por data"
                            onSortChanges={(order) => console.log("sorting:", order)}
                        />
                    </Grid>
                </Grid>
            )}


            {onButtonClick && (
                <Grid item xs={1} sx={{display: 'flex', flexDirection: "row", justifyContent: 'flex-end'}}>
                    <Button
                        startIcon={<Add />}
                        onClick={onButtonClick}
                        sx={{
                            width: 74,
                            height: 28,
                            fontSize: '0.75rem',
                            p: '4px 8px',
                            minWidth: 'unset',
                            borderRadius: '4px',
                            color: '#000',
                            '&:hover': { backgroundColor: '#FFB800', color: '#000' },
                        }}
                    >
                        {buttonLabel}

                    </Button>
                </Grid>
            )}



        </Grid>



    );
};

export default TableHeader;