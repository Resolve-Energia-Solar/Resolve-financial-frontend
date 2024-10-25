import ClickSignService from '@/services/ClickSign';

export async function POST(req) {
  try {
    const { request_signature_key, message } = await req.json();

    const response = await ClickSignService.notification.sms(request_signature_key, message);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Erro ao enviar notificação por SMS:', error.message);
    return new Response(JSON.stringify({ error: 'Erro ao enviar notificação por SMS' }), { status: 500 });
  }
}
