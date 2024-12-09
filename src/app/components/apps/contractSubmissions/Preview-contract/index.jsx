import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import useDocxTemplate from '@/hooks/modelTemplate/useDocxTemplate';
import useUser from '@/hooks/users/useUser';

export default function PreviewContractDialog({ open, onClose, userId }) {
  const [previewText, setPreviewText] = useState('');
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(false);

  const { loading: userLoading, error: userError, userData , reload} = useUser(userId);

  const cpf_format = userData?.first_document?.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4',
  );

  const { handleFileUpload, generatePreview, loading, error } = useDocxTemplate({
    cpf: cpf_format,
    rg: userData?.second_document,
    cliente_nome: userData?.complete_name,
    cliente_endereco: userData?.addresses[0]?.street + ', ' + userData?.addresses[0]?.number,
    mes_ano: new Date().toLocaleString('pt-BR', { month: 'numeric', year: 'numeric' }),
  });

  const handleGeneratePreview = async () => {
    await reload();
    const html = await generatePreview();
    setPreviewText(html);
    setIsPreviewGenerated(true);
  };

  const handleRegeneratePreview = async () => {
    setIsPreviewGenerated(false);
    setPreviewText('');
    await handleGeneratePreview();
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Visualizar Contrato</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Carregando preview...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : isPreviewGenerated ? (
          <Box
            sx={{
              maxHeight: 300,
              overflowY: 'auto',
              border: '1px solid #ddd',
              padding: 2,
              borderRadius: 2,
              backgroundColor: '#f9f9f9',
            }}
            dangerouslySetInnerHTML={{ __html: previewText }}
          />
        ) : (
          <Typography>
            O preview ainda não foi gerado. Clique no botão abaixo para gerar.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Fechar
        </Button>
        {!isPreviewGenerated && (
          <Button variant="outlined" onClick={handleGeneratePreview}>
            Gerar Preview
          </Button>
        )}
        {isPreviewGenerated && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRegeneratePreview}
            sx={{ ml: 2 }}
          >
            Gerar Novamente
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleFileUpload}
          sx={{ ml: 2 }}
        >
          Baixar Contrato
        </Button>
      </DialogActions>
    </Dialog>
  );
}
