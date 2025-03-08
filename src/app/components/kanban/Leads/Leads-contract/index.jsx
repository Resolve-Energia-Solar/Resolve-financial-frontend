import {
    TablePagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Grid,
    IconButton,
    Chip
} from '@mui/material';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import leadService from '@/services/leadService';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import { IconEye, IconPencil } from '@tabler/icons-react';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';

const LeadsContractPage = ({ leadId = null }) => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loadingContracts, setLoadingContracts] = useState(true);
    const [selected, setSelected] = useState([]);

    const proposalStatus = {
        "A": { label: "Aceita", color: "#E9F9E6" },
        "R": { label: "Recusada", color: "#FEEFEE" },
        "P": { label: "Pendente", color: "#FFF7E5" },
    };


    useEffect(() => {
        const fetchLeads = async () => {
            setLoadingContracts(true);
            try {
                const response = await leadService.getLeadById(leadId, {
                    params: {
                        expand: 'proposals',
                        fields: 'id,proposals',
                    },
                });
                setData(response.proposals || []);
            } catch (err) {
                console.error('Erro ao buscar contratos');
            } finally {
                setLoadingContracts(false);
            }
        };

        fetchLeads();
    }, [leadId]);

    const handleSelect = (id) => {
        setSelected(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(item => item !== id)
                : [...prevSelected, id]
        );
    };

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} sx={{ overflow: 'scroll' }}>
                <Box sx={{ borderRadius: '20px', boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Grid item spacing={2} alignItems="center" xs={12}>
                        <LeadInfoHeader leadId={leadId} />
                    </Grid>
                    <Grid container spacing={4} sx={{ mt: 2, mb: 1, ml: 1.5 }}>
                        <Typography variant="h5" fontWeight={"bold"}>Contratos</Typography>
                    </Grid>
                    <TableContainer sx={{ borderRadius: '12px' }}>
                        <Table sx={{ borderCollapse: 'separate', borderSpacing: '0px 8px' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <CustomCheckbox checked={selected.length === data.length} onChange={() => setSelected(selected.length === data.length ? [] : data.map(item => item.id))} />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>Nome</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>Proposta</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>Valor</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>Responsável</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>Data</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>
                                        Editar/Ver
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.length > 0 ? (
                                    data.map((contract) => (
                                        <TableRow key={contract.id}>
                                            <TableCell>
                                                <CustomCheckbox checked={selected.includes(contract.id)} onChange={() => handleSelect(contract.id)} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ whiteSpace: 'pre-line' }}>
                                                    {contract?.products.map(product => product.name).join('\n')}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>#{contract.id}</TableCell>
                                            <TableCell>{contract.value}</TableCell>
                                            <TableCell>{contract.created_by?.first_name} {contract.created_by?.last_name}</TableCell>
                                            <TableCell>{contract.due_date}</TableCell>
                                            <TableCell>
                                                <Chip label={proposalStatus[contract.status]?.label} sx={{ backgroundColor: proposalStatus[contract.status]?.color }} />
                                            </TableCell>
                                            <TableCell align="center" display="flex">
                                                <IconButton onClick={() => actions.edit(row)}>
                                                    <IconPencil />
                                                </IconButton>
                                                <IconButton onClick={() => actions.view(row)}>
                                                    <IconEye />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography variant="body2" color="textSecondary">
                                                Nenhum contrato encontrado.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body2" color="textSecondary">
                                            + Adicionar proposta
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Grid>
        </Grid>
    );
}

export default LeadsContractPage;