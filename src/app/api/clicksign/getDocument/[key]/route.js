import ClickSignService from '@/services/ClickSign';

export async function GET(req, { params }) {
  const { key } = params;  // 'params' contém a chave da URL

  if (!key) {
    return new Response(JSON.stringify({ error: 'Chave do documento não fornecida.' }), { status: 400 });
  }

  try {
    console.log(`Buscando documento com chave: ${key}`);
    const response = await ClickSignService.v1.getDocument(key);
    console.log('Resposta da API ClickSign:', response);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error(`Erro ao buscar documento com chave ${key}:`, error.message);
    return new Response(
      JSON.stringify({ error: 'Erro ao visualizar documento', details: error.message }),
      { status: 500 }
    );
  }
}
