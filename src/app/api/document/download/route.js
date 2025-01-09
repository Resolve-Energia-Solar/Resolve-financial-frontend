import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import puppeteer from 'puppeteer'

export async function POST (req) {
  try {
    const data = await req.json()

    const templatePath = path.join(
      process.cwd(),
      'src',
      'app',
      'templates',
      'contract',
      'index.hbs',
    )
    const templateContent = fs.readFileSync(templatePath, 'utf8')
    const template = handlebars.compile(templateContent)

    const html = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    })

    await browser.close()

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=contrato.pdf',
      },
      status: 200,
    })
  } catch (error) {
    console.error('Erro ao gerar o PDF:', error.message)
    return new Response(JSON.stringify({ error: 'Erro ao gerar o PDF' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}
