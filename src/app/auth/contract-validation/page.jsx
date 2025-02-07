"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Typography, Card, CardContent, Avatar, CircularProgress, Alert, Box, Chip, Grid } from "@mui/material";
import { format } from "date-fns";

const statusMap = {
    "P": <Chip label="Pendente" color="warning" size="small" />,
    "A": <Chip label="Aceito" color="success" size="small" />,
    "R": <Chip label="Recusado" color="error" size="small" />
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
                    <Typography my={2} variant="h4" gutterBottom>Validação de Contrato</Typography>
                    <Alert severity="success">{contractData?.message}</Alert>
                    <Grid container justifyContent={"space-between"}>
                        <Box>
                            <Box mt={3}>
                                <Typography my={1} variant="h6">Dados do Cliente</Typography>
                                <Typography my={1}><strong>Nome:</strong> {contractData?.contract_submission?.sale?.customer?.complete_name}</Typography>
                                <Typography my={1}><strong>Telefone:</strong> {contractData?.contract_submission?.sale?.customer?.phone_number}</Typography>
                                <Typography my={1}><strong>E-mail:</strong> {contractData?.contract_submission?.sale?.customer?.email}</Typography>
                                <Typography my={1}><strong>CPF:</strong> {contractData?.contract_submission?.sale?.customer?.first_document}</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box mt={3}>
                                <Typography my={1} variant="h6">Vendedor</Typography>
                                <Typography my={1}><strong>Nome:</strong> {contractData?.contract_submission?.sale?.seller?.complete_name}</Typography>
                            </Box>
                            <Box mt={3}>
                                <Typography my={1} variant="h6">Detalhes do Contrato</Typography>
                                <Typography my={1}><strong>Status:</strong> {statusMap[contractData?.contract_submission?.status]}</Typography>
                                <Typography my={1}><strong>Data de Envio:</strong> {format(new Date(contractData?.contract_submission?.submit_datetime), 'dd/MM/yyyy HH:mm:ss')}</Typography>
                                {contractData?.contract_submission?.status === "P" && (
                                    <>
                                        <Typography my={1}><strong>Limite para assinar:</strong> {format(new Date(contractData?.contract_submission?.due_date), 'dd/MM/yyyy HH:mm:ss')}</Typography>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ValidateContract;