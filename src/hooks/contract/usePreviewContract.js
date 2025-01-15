import { useEffect, useState } from 'react';
import contractService from '@/services/contractService';
import userService from '@/services/userService';
import saleService from '@/services/saleService';

export default function usePreviewContract(saleId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [contractPDF, setContractPDF] = useState(null);
  const [sale, setSale] = useState(null);
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSaleAndUser = async () => {
      setError(null);
      try {
        const saleResponse = await saleService.getSaleById(saleId);
        setSale(saleResponse);

        if (saleResponse?.customer?.id) {
          const userResponse = await userService.getUserById(saleResponse.customer.id);
          setUser(userResponse);
        } else {
          throw new Error('Cliente associado à venda não encontrado.');
        }
      } catch (err) {
        setError(`Erro ao carregar dados: ${err.message}`);
        setSnackbar({
          open: true,
          message: `Erro ao carregar dados: ${err.message}`,
          severity: 'error',
        });
      }
    };

    if (saleId) {
      fetchSaleAndUser();
    }
  }, [saleId]);

  const previewContract = async () => {
    if (!sale || !user) {
      setError('Dados de venda ou usuário não carregados.');
      setSnackbar({
        open: true,
        message: 'Dados de venda ou usuário não carregados.',
        severity: 'error',
      });
      return;
    }
  
    setError(null);
    setSuccess(false);
    setLoading(true);
  
    try {
      const today = new Date();
      const dia = today.getDate();
      const mes = today.getMonth() + 1;
      const ano = today.getFullYear();
  
      const response = await contractService.previewContract({
        sale_id: sale.id,
        contract_data: {
          id_customer: sale.customer.complete_name,
          id_first_document: sale.customer.first_document,
          id_second_document: sale.customer.second_document,
          id_customer_address: user?.addresses?.[0]?.street || 'Endereço não informado',
          id_customer_house: user?.addresses?.[0]?.number || 'S/N',
          id_customer_zip: user?.addresses?.[0]?.zip_code || 'CEP não informado',
          id_customer_city: user?.addresses?.[0]?.city || 'Cidade não informada',
          id_customer_locality: user?.addresses?.[0]?.neighborhood || 'Bairro não informado',
          id_customer_state: user?.addresses?.[0]?.state || 'Estado não informado',
          watt_pico: sale?.sale_products?.[0]?.product?.params || 'Não informado',
          project_value_format: sale.total_value,
          dia,
          mes,
          ano,
        },
      });
  
      // Converte o base64 para Blob
  
      // Cria uma URL a partir do Blob
      const blobUrl = URL.createObjectURL(response);
      
      // Define a URL do contrato
      setContractPDF(blobUrl);
  
      setSuccess(true);
      setSnackbar({
        open: true,
        message: 'Pré-visualização do contrato gerada com sucesso!',
        severity: 'success',
      });
    } catch (err) {
      setError(`Erro ao gerar pré-visualização do contrato: ${err.message}`);
      setSnackbar({
        open: true,
        message: `Erro ao gerar pré-visualização do contrato: ${err.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    loading,
    error,
    success,
    contractPDF,
    previewContract,
    snackbar,
    handleCloseSnackbar,
  };
}
