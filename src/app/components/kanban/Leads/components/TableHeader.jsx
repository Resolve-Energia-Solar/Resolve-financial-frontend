import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import FilterSelect from "./FiltersSelection";

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
        squad: '',
    });

    const handleFilterChange = (field, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value
        }));
        onFilterChange(field, value);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <Typography sx={{ fontSize: '16px', color: "#092C4C" }}>
                <span style={{ fontWeight: 'bold' }}>{title}: </span> {totalItems} {objNameNumberReference}
            </Typography>

            {/* finters@@@ and create button!!!@*/}
            <Box sx={{ display: 'flex', gap: 2 }}>


                <FilterSelect
                    label="Status"
                    value={filters.status || ""}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    options={[
                        { label: "Novo Lead", value: "new" },
                        { label: "1º Contato", value: "first" },
                    ]}
                />

                <FilterSelect
                    label="Responsável"
                    value={filters.responsavel || ""}
                    onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
                    options={[
                        { label: "Manuela", value: "manu" },
                        { label: "Sandra", value: "sandra" },
                    ]}
                />

                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel>Squad</InputLabel>
                    <Select
                        value={filters.squad}
                        onChange={(e) => handleFilterChange("squad", e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="squad1">Squad 1</MenuItem>
                        <MenuItem value="squad2">Squad 2</MenuItem>
                    </Select>
                </FormControl>

                {onButtonClick && (
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
                )}
            </Box>

            {/* {onButtonClick && (
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
            )} */}

        </Box>



    );
};

export default TableHeader;