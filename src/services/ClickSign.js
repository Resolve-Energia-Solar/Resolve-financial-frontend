import apiDocumentSign from './apiDocumentSign';

const ClickSignService = {
    v1: {
        createDocumentModel: async (templateKey, access_token, data, path) => {
            apiDocumentSign.post(`/api/v1/templates/${templateKey}/documents?access_token=${access_token}`),
            {
                body: {
                    "document": {
                        "path": path,
                        "template": {
                            ...data
                        }
                    }
                }
            }

        },
        createSigner: async (access_token, documentation = null, birthday = null, phone_number, email, name, auth, methods) => {
            apiDocumentSign.post(`/api/v1/signers?access_token=${access_token}`), {
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
            }
        },
        AddSignerDocument: async (access_token, signer_key, document_key, message = '', sign_as, refusable = true) => {
            apiDocumentSign.post(`/api/v1/signers?access_token=${access_token}`), {
                list: {
                    "document_key": document_key,
                    "signer_key": signer_key,
                    "sign_as": sign_as,
                    "refusable": refusable,
                    "group": 1,
                    "message": message
                }
            }
        },
        notification: {
            email: async (request_signature_key, access_token, message = '') => {
                apiDocumentSign.post(`/api/v1/notifications?access_token=${access_token}`,
                    {
                        "request_signature_key": request_signature_key,
                        "message": message,
                    }
                )
            },
            whatsapp: async (request_signature_key, access_token) => {
                apiDocumentSign.post(`/api/v1/notify_by_whatsapp?access_token=${access_token}`,
                    {
                        "request_signature_key": request_signature_key,

                    }
                )
            },
            sms: async (request_signature_key, access_token, message = '') => {
                apiDocumentSign.post(`/api/v1/notify_by_sms?access_token=${access_token}`,
                    {
                        "request_signature_key": request_signature_key,
                        "message": message,
                    }
                )
            },

        }
    }

};

export default ClickSignService;
