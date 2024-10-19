'use client';
import { useState, useEffect } from 'react';
import clickSignService from '@/services/ClickSign';

const useSendContract = () => {
    const [sale, setSale] = useState(null);
    const [isSendingContract, setIsSendingContract] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    useEffect(() => {
        const sendContract = async () => {
            if (!sale) return;
            setIsSendingContract(true);
            setLoading(true);
            try {
                const documentData = {
                    'Company Name': 'Henrique Marques',
                    Address: 'Endereço Fictício',
                    Phone: '91984751123',
                };
                const path = `/Contratos/Contrato-${sale.contract_number}.pdf`;

                const documentoCriado = await clickSignService.v1.createDocumentModel(documentData, path);

                if (!documentoCriado || !documentoCriado.document || !documentoCriado.document.key) {
                    throw new Error('Falha na criação do documento');
                }

                const documentKey = documentoCriado.document.key;
                console.log('Documento criado com sucesso:', documentKey);

                const signer = await clickSignService.v1.createSigner(
                    sale?.customer.first_document,
                    new Date(sale?.customer.birth_date).toLocaleDateString(),
                    sale?.customer?.phone_numbers[0]?.phone_number,
                    sale?.customer.email,
                    sale?.customer.complete_name,
                    'whatsapp',
                    { selfie_enabled: false, handwritten_enabled: false },
                );
                console.log('Signatário criado:', signer);

                const signerKey = signer.signer.key;

                const listaAdicionada = await clickSignService.AddSignerDocument(
                    signerKey,
                    documentKey,
                    'contractor',
                    'Por favor, assine o contrato.',
                );
                console.log('Signatário adicionado ao documento:', listaAdicionada);

                const emailNotificacao = await clickSignService.notification.email(
                    listaAdicionada.list.request_signature_key,
                    'Por favor, assine o contrato.',
                );
                console.log('Notificação por e-mail enviada:', emailNotificacao);

                const whatsappNotificacao = await clickSignService.notification.whatsapp(
                    listaAdicionada.list.request_signature_key,
                );
                console.log('Notificação por WhatsApp enviada:', whatsappNotificacao);

                setSuccess('Contrato enviado com sucesso');

            } catch (error) {
                if (error?.response?.data?.errors) {
                    setError(JSON.stringify(error?.response.data.errors, null, 2));
                }
            } finally {
                setLoading(false);
                setIsSendingContract(false);
                setSale(null);
            }
        };

        if (sale) {
            sendContract();
        }
    }, [sale]);

    return { 
        isSendingContract, 
        loading, 
        error, 
        setError: setError,
        success,
        setSuccess: setSuccess,
        sendContract: setSale, 
    };
};

export default useSendContract;
