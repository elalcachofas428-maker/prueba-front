import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\elalc\\.gemini\\antigravity\\brain\\afda87b5-60bb-4c10-a8de-4cd75acd7aa5\\artifacts';
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    const page = await context.newPage();

    console.log("Mocking Step 4 localStorage");
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      localStorage.setItem('subzero_auth', JSON.stringify({ name: 'Agente', email: 'x@x.com' }));
      localStorage.setItem('subzeroCurrentStep', '4'); 
      localStorage.setItem('subzeroFormData', JSON.stringify({
         tipoPropiedad: 'Departamento', operacion: 'Venta', pais: 'Argentina', ciudad: 'CABA',
         precio: '200000', moneda: 'USD', amenidades: ['Alberca', 'Gym'], tipoVideo: 'reel',
         voz: 'femenina', tono: 'profesional', voiceover: true, escenas: [], fotosRecorrido: [], formatosExtras: {}
      }));
    });
    
    await page.reload();
    await page.waitForTimeout(1500);
    try {
        const btn = page.getByRole('button', { name: /Nuevo listado/i });
        await btn.waitFor({ state: 'visible', timeout: 5000 });
        await btn.click();
        await page.waitForTimeout(1000);
    } catch (e) {}

    console.log("In Step 4, clicking Next...");
    await page.getByRole('button', { name: /Siguiente/i }).click();
    
    await page.waitForTimeout(200);
    console.log("Taking Step 05 skeleton screenshot...");
    await page.screenshot({ path: path.join(artifactsDir, 'step05_skeleton.png'), fullPage: true });

    console.log("Waiting for AI response in Step 05...");
    await page.waitForSelector('.scene-card', { timeout: 30000 });
    await page.waitForTimeout(1000);
    console.log("Taking Step 05 Done screenshot...");
    await page.screenshot({ path: path.join(artifactsDir, 'step05_done.png'), fullPage: true });

    // Jump to Step 7
    await page.evaluate(() => {
        const bd = JSON.parse(localStorage.getItem('subzeroFormData'));
        bd.agenteNombre = "María García";
        bd.agenteTelefono = "+54 11 1234 5678";
        localStorage.setItem('subzeroFormData', JSON.stringify(bd));
        localStorage.setItem('subzeroCurrentStep', '7');
    });
    await page.reload();
    await page.waitForTimeout(1500);
    try {
        const btn = page.getByRole('button', { name: /Nuevo listado/i });
        await btn.waitFor({ state: 'visible', timeout: 5000 });
        await btn.click();
        await page.waitForTimeout(1000);
    } catch (e) {}

    console.log("Clicking Generate Listado...");
    // Wait for generate button
    const generateBtn = page.getByRole('button', { name: /Generar Listado/i });
    await generateBtn.waitFor({ state: 'visible' });
    await generateBtn.click();
    
    await page.waitForTimeout(1000);
    console.log("Taking Loading Screen screenshot...");
    await page.screenshot({ path: path.join(artifactsDir, 'loading_screen.png'), fullPage: true });

    console.log("Waiting for Results...");
    await page.waitForSelector('text="Tu Listado Está Listo"', { timeout: 45000 });
    await page.waitForTimeout(1500);
    console.log("Taking Results screenshot...");
    await page.screenshot({ path: path.join(artifactsDir, 'results_real.png'), fullPage: true });

    await browser.close();
    console.log("Done!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
