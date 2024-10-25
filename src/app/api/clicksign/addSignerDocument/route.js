import ClickSignService from '@/services/ClickSign';

export async function POST(req, res) {
  try {
    const { signerKey, documentKey, signAs } = await req.json();

    const response = await ClickSignService.AddSignerDocument(signerKey, documentKey, signAs);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Erro ao adicionar signatário ao documento:', error.message);
    return new Response(JSON.stringify({ error: 'Erro ao adicionar signatário ao documento' }), { status: 500 });
  }
}
