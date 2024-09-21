import apiDocumentSign from './apiDocumentSign';

const ClickSignService = {
    v1: {
        createDocumentModel: async (templateKey, access_token, data, path) => {
            try {
                const response = await apiDocumentSign.post(`/api/v1/templates/${templateKey}/documents?access_token=${access_token}`,
                    {
                        body: {
                            "document": {
                                "path": path,
                                "template": {
                                    ...data
                                }
                            }
                        }
                    })

                return response.data

            } catch (error) {
                console.error(`Erro ao criar documento:`, error);
                throw error;
            }

        },
        createSigner: async (access_token, documentation = null, birthday = null, phone_number, email, name, auth, methods) => {

            try {
                const response = await apiDocumentSign.post(`/api/v1/signers?access_token=${access_token}`, {
                    body: {
                        "signer": {
                            "email": email,
                            "phone_number": phone_number,
                            "auths": [
                                auth
                            ],
                            "name": name,
                            "documentation": documentation,
                            "birthday": birthday,
                            ...methods
                        }
                    }
                })

                return response.data;

            } catch (error) {
                console.error(`Erro ao criar signatário:`, error);
                throw error;
            }
        },
    },
    AddSignerDocument: async (access_token, signer_key, document_key, message = '', sign_as, refusable = true) => {
        try {
            const response = await apiDocumentSign.post(`/api/v1/signers?access_token=${access_token}`, {
                body: {
                    list: {
                        "document_key": document_key,
                        "signer_key": signer_key,
                        "sign_as": sign_as,
                        "refusable": refusable,
                        "group": 1,
                        "message": message
                    }
                }
            })

            return response.data;

        } catch (error) {
            console.error(`Erro ao adicionar signatário ${signer_key} ao documento:`, error);
            throw error;
        }
    },
    notification: {
        email: async (request_signature_key, access_token, message = '') => {
            try {
                const response = await apiDocumentSign.post(`/api/v1/notifications?access_token=${access_token}`,
                    {
                        body: {
                            "request_signature_key": request_signature_key,
                            "message": message,
                        }
                    }
                )

                return response.data

            } catch (error) {
                console.error(`Erro ao enviar por email:`, error);
                throw error;
            }
        },
        whatsapp: async (request_signature_key, access_token) => {
            try {
                const response = await apiDocumentSign.post(`/api/v1/notify_by_whatsapp?access_token=${access_token}`,
                    {
                        body: {
                            "request_signature_key": request_signature_key
                        }

                    }
                )

                return response.data

            } catch (error) {
                console.error(`Erro ao enviar por whatsapp:`, error);
                throw error;
            }
        },
        sms: async (request_signature_key, access_token, message = '') => {

            try {
                const response = await apiDocumentSign.post(`/api/v1/notify_by_sms?access_token=${access_token}`,
                    {
                        body: {
                            "request_signature_key": request_signature_key,
                            "message": message,
                        }
                    }
                )

                return response.data
            } catch (error) {
                console.error(`Erro ao enviar por sms:`, error);
                throw error;
            }
        },

    }
}


export default ClickSignService;
