import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export async function POST(req) {
  try {
    // Receber os dados da requisição
    const {
      id_customer,
      id_first_document,
      id_second_document,
      id_customer_address,
      id_customer_house,
      id_customer_zip,
      id_customer_city,
      id_customer_locality,
      id_customer_state,
      quantity_material_3,
      id_material_3,
      id_material_1,
      id_material_2,
      watt_pico,
      project_value_format,
      id_payment_method,
      id_payment_detail,
      observation_payment,
      dia,
      mes,
      ano,
    } = await req.json();

    const templatePath = path.join(process.cwd(), 'src', 'app', 'templates', 'contract', 'index.hbs');
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    const template = handlebars.compile(templateContent);

    const html = template({
      id_customer,
      id_first_document,
      id_second_document,
      id_customer_address,
      id_customer_house,
      id_customer_zip,
      id_customer_city,
      id_customer_locality,
      id_customer_state,
      quantity_material_3,
      id_material_3,
      id_material_1,
      id_material_2,
      watt_pico,
      project_value_format,
      id_payment_method,
      id_payment_detail,
      observation_payment,
      dia,
      mes,
      ano,
    });

    // Retornar o HTML gerado
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
      status: 200,
    });
  } catch (error) {
    console.error('Erro ao gerar o contrato:', error.message);
    return new Response(JSON.stringify({ error: 'Erro ao gerar o contrato' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
