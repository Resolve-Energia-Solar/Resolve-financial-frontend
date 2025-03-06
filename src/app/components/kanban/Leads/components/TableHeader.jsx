import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';

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
        
        
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="new">Novo Lead</MenuItem>
                        <MenuItem value="first">1º Contato</MenuItem>
                    </Select>
                </FormControl>


                <FormControl sx={{ minWidth: 150 }} size="small">
                    <InputLabel>Responsável</InputLabel>
                    <Select
                        value={filters.responsible}
                        onChange={(e) => handleFilterChange("responsible", e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="manu">Manuela</MenuItem>
                        <MenuItem value="sandra">Sandra</MenuItem>
                    </Select>
                </FormControl>

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