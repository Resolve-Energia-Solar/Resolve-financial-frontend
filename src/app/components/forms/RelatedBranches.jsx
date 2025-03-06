import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import branchService from '@/services/branchService';

export default function RelatedBranchesSelect({ value = [], onChange, fullWidth = true }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        async function fetchBranches() {
            try {
                // Busca as branches com um limite maior para garantir todas as opções
                const data = await branchService.getBranches({ limit: 100 });
                // Caso a API retorne um objeto paginado, use data.results, senão, use data
                setOptions(data.results || data);
            } catch (error) {
                console.error('Erro ao carregar branches:', error);
            }
        }
        fetchBranches();
    }, []);

    // Converte o valor (array de ids) para os objetos correspondentes das opções
    const selectedOptions = options.filter(option => value.includes(option.id.toString()));

    return (
        <Autocomplete
            multiple
            options={options}
            getOptionLabel={(option) => option.name}
            value={selectedOptions}
            onChange={(event, newValue) => {
                const newIds = newValue.map(option => option.id.toString());
                onChange(newIds);
            }}
            fullWidth={fullWidth}
                    size="small"
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    placeholder="Selecione as unidades"
                />
            )}
        />
    );
}
