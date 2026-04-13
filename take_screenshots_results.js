import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\elalc\\.gemini\\antigravity\\brain\\7c61ac5a-60cb-4f8e-a697-28c952645017\\artifacts';

(async () => {
  try {
    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    const page = await context.newPage();
    
    // Fill mock image data for Results
    await page.goto('http://localhost:5173');
    await page.evaluate(() => { 
        localStorage.setItem('subzero_auth', JSON.stringify({ name: 'Agente', email: 'x@x.com' }));
        localStorage.setItem('subzeroCurrentStep', '9'); 
        localStorage.setItem('subzeroFormData', JSON.stringify({
            tipoPropiedad: 'Departamento', operacion: 'Venta', pais: 'Argentina', ciudad: 'CABA',
            precio: '200000', moneda: 'USD', tipoVideo: 'Reel/TikTok',
            portadaUrl: 'https://placehold.co/1080x1080/1a1a2e/00c4d4?text=Portada+Propiedad'
        }));
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Results PDF exists already, let's just do POST
    const buttons = await page.locator('button').all();
    for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('POST')) await btn.click();
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_post.png'), fullPage: true });

    for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('STORY')) await btn.click();
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_story.png'), fullPage: true });

    for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('CARRUSEL')) await btn.click();
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_carrusel.png'), fullPage: true });

    for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('EMAIL')) await btn.click();
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_email.png'), fullPage: true });

    for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('VIDEO')) await btn.click();
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, 'res_video.png'), fullPage: true });

    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
