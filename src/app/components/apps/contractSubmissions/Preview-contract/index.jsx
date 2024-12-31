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
import useSale from '@/hooks/sales/useSale';
import paymentService from '@/services/paymentService';
import { useEffect } from 'react';

export default function PreviewContractDialog({ open, onClose, userId, saleId }) {
  const [previewText, setPreviewText] = useState('');
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(false);
  const [payments, setPayments] = useState([]);

  const { loading: userLoading, error: userError, userData, reload: reloadUser } = useUser(userId);
  const { loading: saleLoading, error: saleError, saleData, reload: reloadSale } = useSale(saleId);
  console.log('userData', userData);
  console.log('saleData', saleData);

  const cpf_format = userData?.first_document?.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4',
  );

// Exemplo seguro para não quebrar caso saleData ou sale_products estejam ausentes:
  const modules = saleData?.sale_products?.flatMap(sp =>
    sp?.product?.materials?.filter(item =>
      item?.material?.attributes?.some(attr => attr.key === 'Modulo' && attr.value === 'True')
    ) || []
  ) || []; // se não houver sale_products, retorna array vazio

  const inversors = saleData?.sale_products?.flatMap(sp =>
    sp?.product?.materials?.filter(item =>
      item?.material?.attributes?.some(attr => attr.key === 'Inversor' && attr.value === 'True')
    ) || []
  ) || []; // se não houver sale_products, retorna array vazio

  console.log('modules', modules);
  console.log('inversors', inversors);

  const paymentTypes = [
    { code: "C", label: "Crédito" },
    { code: "D", label: "Débito" },
    { code: "B", label: "Boleto" },
    { code: "F", label: "Financiamento" },
    { code: "PI", label: "Parcelamento interno" },
    { code: "P", label: "Pix" },
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentData = await paymentService.getPaymentsBySale(saleId, 'payment_type');
        setPayments(paymentData);
      } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
      }
    };

    if (saleId) {
      fetchPayments();
    }
  }, [saleId]);

  console.log('payments', payments);

  const paymentMethods = Array.isArray(payments) ? payments.map((pm) => getPaymentLabel(pm.payment_type)).join(', ') : '';


  const { handleFileUpload, generatePreview, loading, error } = useDocxTemplate({
    cpf: cpf_format,
    rg: userData?.second_document,
    cliente_nome: userData?.complete_name,
    cliente_endereco: userData?.addresses[0]?.street + ', ' + userData?.addresses[0]?.number,
    mes_ano: new Date().toLocaleString('pt-BR', { month: 'numeric', year: 'numeric' }),

    data_atual: new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    //Infomacoes do produto
    total_paid: saleData?.total_paid?.toFixed(2),

    //Modulos
    modules: modules.map((m) => m.material.name.toUpperCase()).join(', '),
    modules_quantity: modules.map((m) => Math.floor(m.amount)).join(', '),
    //Inversores
    inversors: inversors.map((m) => m.material.name.toUpperCase()).join(', '),
    inversors_quantity: inversors.map((m) => Math.floor(m.amount)).join(', '),
    inversors_kwp: inversors.map((m) => m.material.attributes.find(attr => attr.key === 'kwp').value).join(', '),

    //Informacoes da venda
    payments_methods: paymentMethods,

    // payment_methods: saleData?.payment_methods?.map((pm) => pm.name).join(', '),
  });

  const handleGeneratePreview = async () => {
    await reloadUser();
    await reloadSale();
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
