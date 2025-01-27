import ClickSignService from '@/services/ClickSign'

export async function GET (req, { params }) {
  const { envelopID, key } = params

  if (!key || !envelopID) {
    return new Response(
      JSON.stringify({ error: 'Chave do documento ou envelopID não fornecido.' }),
      { status: 400 },
    )
  }

  try {
    console.log(`Buscando documento com chave: ${key} e envelopID: ${envelopID}`)
    const response = await ClickSignService.v1.getDocument(envelopID, key)
    console.log('Resposta da API ClickSign:', response)

    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error(
      `Erro ao buscar documento com chave ${key} e envelopID ${envelopID}:`,
      error.message,
    )
    return new Response(
      JSON.stringify({ error: 'Erro ao visualizar documento', details: error.message }),
      { status: 500 },
    )
  }
}
