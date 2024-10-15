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
                    `${API_DOCUMENT_BASE_URL}/api/v1/templates/${templateKey}/documents?access_token=${API_TOKEN}`,
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
                    `${API_DOCUMENT_BASE_URL}/api/v1/signers?access_token=${API_TOKEN}`,
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

    AddSignerDocument: async (signerKey, documentKey, signAs = 'sign') => {
        try {
            const response = await axios.post(
                `${API_DOCUMENT_BASE_URL}/api/v1/lists?access_token=${API_TOKEN}`,
                {
                    list: {
                        document_key: documentKey,
                        signer_key: signerKey,
                        sign_as: signAs
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Erro ao adicionar signatário ao documento:", JSON.stringify(error.response.data, null, 2));
            } else if (error.request) {
                console.error("Erro na requisição:", error.request);
            } else {
                console.error("Erro:", error.message);
            }
            throw error;
        }
    },

    notification: {
        email: async (request_signature_key, message = '') => {
            try {
                const response = await axios.post(
                    `${API_DOCUMENT_BASE_URL}/api/v1/notifications?access_token=${API_TOKEN}`,
                    {
                        request_signature_key: request_signature_key,
                        message: message,
                    },
                    {
                        headers: {
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
                    `${API_DOCUMENT_BASE_URL}/api/v1/notify_by_whatsapp?access_token=${API_TOKEN}`,
                    {
                        request_signature_key: request_signature_key,
                    },
                    {
                        headers: {
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
                    `${API_DOCUMENT_BASE_URL}/api/v1/notify_by_sms?access_token=${API_TOKEN}`,
                    {
                        request_signature_key: request_signature_key,
                        message: message,
                    },
                    {
                        headers: {
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
