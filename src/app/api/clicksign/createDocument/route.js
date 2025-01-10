import ClickSignService from '@/services/ClickSign'

export async function POST (req) {
  try {
    const { path, content_base64 } = await req.json()

    const response = await ClickSignService.v1.createDocument(path, content_base64)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error('Erro ao criar documento:', error.message)
    return new Response(JSON.stringify({ error: 'Erro ao criar documento' }), { status: 500 })
  }
}
