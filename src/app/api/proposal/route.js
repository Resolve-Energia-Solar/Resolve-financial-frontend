// src/app/api/proposal/route.js
import { promises as fs } from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export async function POST(req) {
  const body = await req.json();

  const filePath = path.join(process.cwd(), 'public', 'proposal/index.html');

  const htmlTemplate = await fs.readFile(filePath, 'utf8');

  const template = handlebars.compile(htmlTemplate);

  const htmlOutput = template(body);

  return new Response(htmlOutput, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
