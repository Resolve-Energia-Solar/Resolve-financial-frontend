import axios from 'axios';

const API_DOCUMENT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_CLICKSIGN_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_CLICKSIGN_TOKEN;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_API_BASE_CLICKSIGN_TEMPLATE_ID;
const TEMPLATE_PRE_ID = process.env.NEXT_PUBLIC_API_BASE_CLICKSIGN_TEMPLATE_PRE_ID;

const ClickSignService = {
    v1: {
        createDocumentModel: async (data, path, usePreTemplate = false) => {
            try {
                const templateKey = usePreTemplate ? TEMPLATE_PRE_ID : TEMPLATE_ID;
                
                const response = await axios.post(
                    `${API_DOCUMENT_BASE_URL}/api/v1/templates/${templateKey}/documents`,
                    {
                        document: {
                            path: path,
                            template: {
                                ...data,
                            },
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                return response.data;
            } catch (error) {
                console.error(`Erro ao criar documento: ${error.response?.data?.message || error.message}`);
                throw error;
            }
        },

        createSigner: async (documentation = null, birthday = null, phone_number, email, name, auth, methods) => {
            try {
                const response = await axios.post(
                    `${API_DOCUMENT_BASE_URL}/api/v1/signers`,
                    {
                        signer: {
                            email: email,
                            phone_number: phone_number,
                            auths: [auth],
                            name: name,
                            documentation: documentation,
                            birthday: birthday,
                            ...methods,
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                return response.data;
            } catch (error) {
                console.error(`Erro ao criar signatário: ${error.response?.data?.message || error.message}`);
                throw error;
            }
        },
    },

    AddSignerDocument: async (signer_key, document_key, message = '', sign_as, refusable = true) => {
        try {
            const response = await axios.post(
                `${API_DOCUMENT_BASE_URL}/api/v1/signers`,
                {
                    list: {
                        document_key: document_key,
                        signer_key: signer_key,
                        sign_as: sign_as,
                        refusable: refusable,
                        group: 1,
                        message: message,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${API_TOKEN}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error(`Erro ao adicionar signatário ${signer_key} ao documento: ${error.response?.data?.message || error.message}`);
            throw error;
        }
    },

    notification: {
        email: async (request_signature_key, message = '') => {
            try {
                const response = await axios.post(
                    `${API_DOCUMENT_BASE_URL}/api/v1/notifications`,
                    {
                        request_signature_key: request_signature_key,
                        message: message,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                return response.data;
            } catch (error) {
                console.error(`Erro ao enviar notificação por email: ${error.response?.data?.message || error.message}`);
                throw error;
            }
        },

        whatsapp: async (request_signature_key) => {
            try {
                const response = await axios.post(
                    `${API_DOCUMENT_BASE_URL}/api/v1/notify_by_whatsapp`,
                    {
                        request_signature_key: request_signature_key,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                return response.data;
            } catch (error) {
                console.error(`Erro ao enviar notificação por WhatsApp: ${error.response?.data?.message || error.message}`);
                throw error;
            }
        },

        sms: async (request_signature_key, message = '') => {
            try {
                const response = await axios.post(
                    `${API_DOCUMENT_BASE_URL}/api/v1/notify_by_sms`,
                    {
                        request_signature_key: request_signature_key,
                        message: message,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                return response.data;
            } catch (error) {
                console.error(`Erro ao enviar notificação por SMS: ${error.response?.data?.message || error.message}`);
                throw error;
            }
        },
    },
};

export default ClickSignService;
