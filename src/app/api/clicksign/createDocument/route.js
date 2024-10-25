import ClickSignService from '@/services/ClickSign'

export async function POST (req) {
  try {
    const { data, path, usePreTemplate } = await req.json()

    const response = await ClickSignService.v1.createDocumentModel(data, path, usePreTemplate)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error('Erro ao criar documento:', error.message)
    return new Response(JSON.stringify({ error: 'Erro ao criar documento' }), { status: 500 })
  }
}
