import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\elalc\\.gemini\\antigravity\\brain\\7c61ac5a-60cb-4f8e-a697-28c952645017\\artifacts';

(async () => {
  try {
    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    const page = await context.newPage();
    
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      localStorage.setItem('subzero_auth', JSON.stringify({ name: 'Agente', email: 'test@test.com' }));
      localStorage.removeItem('subzeroCurrentStep'); 
      localStorage.removeItem('subzeroFormData');
    });
    
    await page.reload();
    console.log('Esperando mock state...');
    await page.waitForTimeout(2000); 
    await page.screenshot({ path: path.join(artifactsDir, 'lobby_mock.png'), fullPage: true });
    console.log('lobby_mock.png guardado');

    await browser.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
