import ClickSignService from '@/services/ClickSign'

export async function POST(req) {
  try {
    const { documentation, birthday, phone_number, email, name, auth, methods } = await req.json();

    const response = await ClickSignService.v1.createSigner(
      documentation,
      birthday,
      phone_number,
      email,
      name,
      auth,
      methods,
    );

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Erro ao criar signatário:', error.message);
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
