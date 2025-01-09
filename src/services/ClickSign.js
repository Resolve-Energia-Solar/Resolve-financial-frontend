import axios from 'axios'

const API_DOCUMENT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_CLICKSIGN_URL
const API_TOKEN = process.env.NEXT_PUBLIC_CLICKSIGN_TOKEN
const TEMPLATE_ID = process.env.NEXT_PUBLIC_API_BASE_CLICKSIGN_TEMPLATE_ID
const TEMPLATE_PRE_ID = process.env.NEXT_PUBLIC_API_BASE_CLICKSIGN_TEMPLATE_PRE_ID

const ClickSignService = {
  v1: {
    createDocument: async (path, content_base64) => {
      console.log('gege', path, content_base64, API_TOKEN)
      try {
        const response = await axios.post(
          `${API_DOCUMENT_BASE_URL}/api/v1/documents?access_token=b6c16e80-4442-4a0f-8aad-f5e976b51023`,
          {
            document: {
              path: path,
              content_base64: `data:application/pdf;base64,${content_base64}`,
              auto_close: true,
              locale: 'pt-BR',
              sequence_enabled: false,
              block_after_refusal: true,
            },
          },

          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          },
        )

        return response.data
      } catch (error) {
        console.error(
          `Erro ao criar documento via upload: ${error.response?.data?.message || error.message}`,
        )
        throw error
      }
    },

    getDocument: async key => {
      try {
        const response = await axios.get(
          `${API_DOCUMENT_BASE_URL}/api/v1/documents/${key}?access_token=${API_TOKEN}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )

        return response.data
      } catch (error) {
        console.error(`Erro ao buscar documento com chave ${key}:`)
        if (error.response) {
          console.error('Status:', error.response.status)
          console.error('Headers:', error.response.headers)
          console.error('Data:', error.response.data)
        } else if (error.request) {
          console.error('Request:', error.request)
        } else {
          console.error('Erro:', error.message)
        }
        throw error
      }
    },

    createSigner: async (
      documentation = null,
      birthday = null,
      phone_number,
      email,
      name,
      auth,
      methods,
    ) => {
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
          },
        )

        return response.data
      } catch (error) {
        if (error.response) {
          console.error(
            `Erro ao criar signatário: ${error.response?.status} - ${error.response?.statusText}`,
          )
          console.error('Detalhes do erro:', JSON.stringify(error.response.data, null, 2))
        } else if (error.request) {
          console.error('Erro na requisição:', error.request)
        } else {
          console.error('Erro:', error.message)
        }
        throw error
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
            sign_as: signAs,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )

      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          'Erro ao adicionar signatário ao documento:',
          JSON.stringify(error.response.data, null, 2),
        )
      } else if (error.request) {
        console.error('Erro na requisição:', error.request)
      } else {
        console.error('Erro:', error.message)
      }
      throw error
    }
  },

  notification: {
    email: async (request_signature_key, message = 'Contrato Resolve') => {
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
          },
        )

        return response.data
      } catch (error) {
        console.error('Erro ao enviar notificação por email:')
        if (error.response) {
          console.error('Status:', error.response.status)
          console.error('Headers:', error.response.headers)
          console.error('Data:', JSON.stringify(error.response.data))
        } else if (error.request) {
          console.error('Request:', error.request)
        } else {
          console.error('Erro:', error.message)
        }
        throw error
      }
    },

    whatsapp: async request_signature_key => {
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
          },
        )

        return response.data
      } catch (error) {
        console.error('Erro ao enviar notificação por WhatsApp:')
        if (error.response) {
          console.error('Status:', error.response.status)
          console.error('Headers:', error.response.headers)
          console.error('Data:', error.response.data)
        } else if (error.request) {
          console.error('Request:', error.request)
        } else {
          console.error('Erro:', error.message)
        }
        throw error
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
          },
        )

        return response.data
      } catch (error) {
        console.error('Erro ao enviar notificação por SMS:')
        if (error.response) {
          console.error('Status:', error.response.status)
          console.error('Headers:', error.response.headers)
          console.error('Data:', error.response.data)
        } else if (error.request) {
          console.error('Request:', error.request)
        } else {
          console.error('Erro:', error.message)
        }
        throw error
      }
    },
  },
}

export default ClickSignService
