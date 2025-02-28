'use client';
import {
    Grid,
    Typography,
    Box,
    useTheme,
} from '@mui/material';

import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import TableComponent from '@/app/components/kanban/Leads/components/TableComponent'

function LeadsContractPage({ leadId = null }) {
    const router = useRouter();
    const theme = useTheme();
    const [lead, setLead] = useState(null);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        proposal_name: '',
        amount: '',
        ref_amount: '',
        entry_amount: '',
        payment_method: '',
        financing_type: '',
        seller_id: '',
        proposal_validity: '',
        proposal_status: '',
        description: '',
        created_at: '',
        installments_num: '',
    });

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await leadService.getLeadById(leadId);
                setFormData(response);
            } catch (error) {
                console.error(error);
            }
        };

        if (leadId) fetchLead();
    }, [leadId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        const fetchLead = async () => {
            setLoadingLeads(true);
            try {
                const data = await leadService.getLeadById(leadId);
                setLead(data);
                console.log(data);
            } catch (err) {
                enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
            } finally {
                setLoadingLeads(false);
            }
        };
        fetchLead();
    }, []);

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} sx={{ overflow: 'scroll' }}>
                <Box
                    sx={{
                        borderRadius: '20px',
                        boxShadow: 3,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >

                    <Grid item spacing={2} alignItems="center" xs={12}>
                        <LeadInfoHeader leadId={leadId} />
                    </Grid>

                    <Grid container spacing={4} sx={{px: 7, mt: 2, mb: 1}}>
                        <Typography variant="h5" fontWeight={"bold"}>
                            Contratos
                        </Typography>
                        
                    </Grid>

                    <TableComponent/>                    

                </Box>
            </Grid>
        </Grid>
    );
}

export default LeadsContractPage;
