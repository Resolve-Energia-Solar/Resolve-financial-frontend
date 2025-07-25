import projectService from "@/services/projectService"; // 1. Importe o serviço do projeto
import { Button, CircularProgress } from "@mui/material";
import { IconFileTypePdf } from "@tabler/icons-react";
import { useSnackbar } from "notistack";
import { useState } from "react";

export const GenerateMaterialsPDF = ({ projectId }) => { // 2. Receba o projectId
    const [loadingPDF, setLoadingPDF] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    // A lógica é a mesma, apenas adaptamos os nomes e o serviço
    const handlePDFGeneration = (id) => () => {
        setLoadingPDF(true);
        if (!id) {
            enqueueSnackbar('ID do projeto não encontrado', { variant: 'error' });
            setLoadingPDF(false);
            return;
        }

        projectService
            .generateMaterialPdf(id)
            .then((blobData) => {
                const blob = new Blob([blobData], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `materiais-projeto-${id}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                enqueueSnackbar('PDF dos materiais gerado com sucesso', { variant: 'success' });
            })
            .catch((error) => {
                console.error('Erro ao gerar PDF dos materiais:', error);
                enqueueSnackbar('Erro ao gerar PDF dos materiais', { variant: 'error' });
            })
            .finally(() => {
                setLoadingPDF(false);
            });
    };

    return (
        <Button
            onClick={handlePDFGeneration(projectId)}
            variant="outlined"
            sx={{ mt: 0, ml: 1 }}
            disabled={loadingPDF}
            startIcon={loadingPDF && <CircularProgress size={20} />}
            title='Baixar Lista de Materiais em PDF'
        >
            <IconFileTypePdf />
        </Button>
    )
}