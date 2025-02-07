"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Typography, Card, CardContent, Avatar, CircularProgress, Alert, Box } from "@mui/material";
import { format } from "date-fns";

const statusMap = {
    "P": "Pendente",
    "A": "Aceito",
    "R": "Recusado"
};

const ValidateContract = () => {
    const searchParams = useSearchParams();
    const envelope_id = searchParams.get("envelope_id");
    const [contractData, setContractData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!envelope_id) {
            setError("Envelope ID não encontrado na URL.");
            setLoading(false);
            return;
        }

        const fetchContractData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validate-contract/?envelope_id=${envelope_id}`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados do contrato");
                }
                const data = await response.json();
                setContractData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContractData();
    }, [envelope_id]);

    if (loading) return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>Validação de Contrato</Typography>
                    <Alert severity="success">{contractData?.message}</Alert>

                    <Box mt={3}>
                        <Typography variant="h6">Dados do Cliente</Typography>
                        <Avatar src={contractData?.contract_submission?.sale?.customer?.profile_picture} sx={{ width: 80, height: 80, mb: 2 }} />
                        <Typography><strong>Nome:</strong> {contractData?.contract_submission?.sale?.customer?.complete_name}</Typography>
                        <Typography><strong>Email:</strong> {contractData?.contract_submission?.sale?.customer?.email}</Typography>
                    </Box>

                    <Box mt={3}>
                        <Typography variant="h6">Vendedor</Typography>
                        <Typography><strong>Nome:</strong> {contractData?.contract_submission?.sale?.seller?.complete_name}</Typography>
                    </Box>

                    <Box mt={3}>
                        <Typography variant="h6">Detalhes do Contrato</Typography>
                        <Typography><strong>Status:</strong> {statusMap[contractData?.contract_submission?.status]}</Typography>
                        <Typography><strong>Data de Envio:</strong> {format(new Date(contractData?.contract_submission?.submit_datetime), 'dd/MM/yyyy HH:mm:ss')}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ValidateContract;