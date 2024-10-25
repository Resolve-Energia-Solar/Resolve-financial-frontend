import ClickSignService from '@/services/ClickSign';

export async function POST(req) {
  try {
    const { request_signature_key } = await req.json();

    const response = await ClickSignService.notification.whatsapp(request_signature_key);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Erro ao enviar notificação por WhatsApp:', error.message);
    return new Response(JSON.stringify({ error: 'Erro ao enviar notificação por WhatsApp' }), { status: 500 });
  }
}
