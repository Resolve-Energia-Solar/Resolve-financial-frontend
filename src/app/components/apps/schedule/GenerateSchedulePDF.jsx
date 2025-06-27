import scheduleService from "@/services/scheduleService";
import { Button, CircularProgress } from "@mui/material";
import { IconFileTypePdf } from "@tabler/icons-react";
import { useSnackbar } from "notistack";
import { useState } from "react";

export const GenerateSchedulePDF = ({ scheduleId }) => {
    const [loadingPDF, setLoadingPDF] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handlePDFGeneration = (id) => () => {
        setLoadingPDF(true);
        if (!id) {
            enqueueSnackbar('ID do agendamento não encontrado', { variant: 'error' });
            return;
        }
        scheduleService
            .generatePDF(id)
            .then((response) => {
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `agendamento-${id}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                enqueueSnackbar('PDF gerado com sucesso', { variant: 'success' });
            })
            .catch((error) => {
                console.error('Erro ao gerar PDF:', error);
                enqueueSnackbar('Erro ao gerar PDF', { variant: 'error' });
            })
            .finally(() => {
                setLoadingPDF(false);
            });
    };

    return (

        <Button onClick={handlePDFGeneration(scheduleId)} variant="outlined" sx={{ mt: 1, ml: 1 }} disabled={loadingPDF} startIcon={loadingPDF && <CircularProgress size={20} />} title='Baixar Agendamento em PDF'>
            <IconFileTypePdf />
        </Button>
    )
}