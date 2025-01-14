import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';

function findChromiumPath() {
  const isWindows = process.platform === 'win32';
  const isLinux = process.platform === 'linux';
  const isMac = process.platform === 'darwin';

  const possiblePaths = [
    ...(isLinux ? [
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium',
      '/usr/local/bin/chromium',
    ] : []),
    ...(isMac ? [
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/usr/local/bin/chrome',
    ] : []),
    ...(isWindows ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ] : []),
  ];

  for (const chromiumPath of possiblePaths) {
    if (fs.existsSync(chromiumPath)) {
      return chromiumPath;
    }
  }

  if (!isWindows) {
    try {
      const chromiumPath = execSync('which chromium', { encoding: 'utf8' }).trim();
      if (chromiumPath) {
        return chromiumPath;
      }
    } catch (error) {
      console.error('Chromium não encontrado via "which chromium".');
    }
  }

  throw new Error('Chromium/Google Chrome não foi encontrado no sistema. Verifique a instalação.');
}

export async function POST(req) {
  try {
    const data = await req.json();

    const chromiumPath = process.env.CHROMIUM_PATH || findChromiumPath();

    const templatePath = path.join(
      process.cwd(),
      'src',
      'app',
      'templates',
      'contract',
      'index.hbs'
    );

    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);

    const html = template(data);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromiumPath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-zygote',
        '--single-process',
        '--disable-background-timer-throttling', 
        '--disable-renderer-backgrounding', 
      ],
      timeout: 60000, 
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 60000, 
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    });

    await browser.close();

    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    return new Response(
      JSON.stringify({ pdfBase64 }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erro ao gerar o PDF:', {
      message: error.message,
      stack: error.stack,
    });

    return new Response(
      JSON.stringify({
        error: 'Erro ao gerar o PDF',
        details: error.message,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}
