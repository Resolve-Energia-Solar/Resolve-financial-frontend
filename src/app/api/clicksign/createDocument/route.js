import ClickSignService from '@/services/ClickSign'

export async function POST (req) {
  try {
    const contentType = req.headers.get('Content-Type')

    if (contentType.includes('application/json')) {
      return await handleModelCreation(req)
    } else if (contentType.includes('multipart/form-data')) {
      return await handleFileUpload(req)
    } else {
      return new Response(JSON.stringify({ error: 'Tipo de requisição não suportado.' }), {
        status: 400,
      })
    }
  } catch (error) {
    console.error('Erro na criação do documento:', error.message)
    return new Response(JSON.stringify({ error: 'Erro na criação do documento' }), { status: 500 })
  }
}

async function handleModelCreation (req) {
  try {
    const { data, path, usePreTemplate } = await req.json()

    const response = await ClickSignService.v1.createDocumentModel(data, path, usePreTemplate)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error('Erro ao criar documento via modelo:', error.message)
    return new Response(JSON.stringify({ error: 'Erro ao criar documento via modelo' }), {
      status: 500,
    })
  }
}

async function handleFileUpload (req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const path = formData.get('path')

    if (!file || !file.name) {
      return new Response(JSON.stringify({ error: 'Nenhum arquivo foi enviado.' }), { status: 400 })
    }

    const fileBuffer = await file.arrayBuffer()
    const fileBase64 = Buffer.from(fileBuffer).toString('base64')

    const response = await ClickSignService.v1.createDocument(file.name, fileBase64, path)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error('Erro ao criar documento via upload:', error.message)
    return new Response(JSON.stringify({ error: 'Erro ao criar documento via upload' }), {
      status: 500,
    })
  }
}
