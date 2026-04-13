import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\elalc\\.gemini\\antigravity\\brain\\afda87b5-60bb-4c10-a8de-4cd75acd7aa5\\artifacts';
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

async function ensureWizard(page) {
    try {
        const btn = page.getByRole('button', { name: /Nuevo listado/i });
        await btn.waitFor({ state: 'visible', timeout: 5000 });
        await btn.click();
        await page.waitForTimeout(1000);
    } catch (e) {
        console.log('Wizard might already be active or Lobby not found');
    }
}

(async () => {
  try {
    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    const page = await context.newPage();
    
    // Inject mock auth and go straight to Wizard step 3
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      localStorage.setItem('subzero_auth', JSON.stringify({ name: 'Agente', email: 'x@x.com' }));
      localStorage.setItem('subzeroCurrentStep', '3'); 
      localStorage.setItem('subzeroFormData', JSON.stringify({
         tipoPropiedad: 'Departamento', operacion: 'Venta', pais: 'Argentina', ciudad: 'CABA',
         precio: '200000', moneda: 'USD', amenidades: ['Alberca'], tipoVideo: '',
         voz: '', tono: '', voiceover: false, escenas: [], fotosRecorrido: [], formatosExtras: {}
      }));
    });
    
    await page.reload();
    await ensureWizard(page);
    await page.screenshot({ path: path.join(artifactsDir, 'fix_step03.png'), fullPage: true });

    // Go to step 4
    await page.evaluate(() => { localStorage.setItem('subzeroCurrentStep', '4'); });
    await page.reload();
    await ensureWizard(page);
    await page.screenshot({ path: path.join(artifactsDir, 'fix_step04.png'), fullPage: true });

    // Go to step 6
    await page.evaluate(() => { localStorage.setItem('subzeroCurrentStep', '6'); });
    await page.reload();
    await ensureWizard(page);
    await page.screenshot({ path: path.join(artifactsDir, 'fix_step06.png'), fullPage: true });

    // Fill mock image data for Results
    await page.evaluate(() => { 
        localStorage.setItem('subzeroCurrentStep', '9'); 
        localStorage.setItem('subzeroFormData', JSON.stringify({
            tipoPropiedad: 'Departamento', operacion: 'Venta', pais: 'Argentina', ciudad: 'CABA',
            precio: '200000', moneda: 'USD', tipoVideo: 'reel',
            portadaUrl: 'https://placehold.co/1080x1080/1a1a2e/00c4d4?text=Portada+Propiedad'
        }));
    });
    await page.reload();
    await ensureWizard(page);
    await page.waitForTimeout(500);

    // Results PDF
    await page.screenshot({ path: path.join(artifactsDir, 'res_pdf.png'), fullPage: true });
    
    // Results POST
    await page.getByRole('button', { name: 'POST', exact: true }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_post.png'), fullPage: true });

    // Results STORY
    await page.getByRole('button', { name: 'STORY', exact: true }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_story.png'), fullPage: true });

    // Results CARRUSEL
    await page.getByRole('button', { name: 'CARRUSEL', exact: true }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_carrusel.png'), fullPage: true });

    // Results EMAIL
    await page.getByRole('button', { name: 'EMAIL', exact: true }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_email.png'), fullPage: true });

    // Results VIDEO
    await page.getByRole('button', { name: 'VIDEO', exact: true }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_video.png'), fullPage: true });

    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
