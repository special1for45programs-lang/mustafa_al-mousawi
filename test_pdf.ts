import fs from 'fs';
import puppeteer from 'puppeteer';

async function run() {
  const apiCode = fs.readFileSync('api/generate-brief-pdf.ts', 'utf-8');
  const exportedApiCode = apiCode.replace('function generatePdfHTML(', 'export function generatePdfHTML(');
  fs.writeFileSync('api/temp-pdf.ts', exportedApiCode);
  
  const { generatePdfHTML } = await import('./api/temp-pdf.ts');
  
  const formData = {
    clientName: 'مصطفى الموسوي',
    clientPhone: '+9647712345678',
    projectName: 'شعار مطعم جديد',
    projectDescription: 'نريد تصميم شعار لمطعم يقدم أكلات سريعة في بغداد.',
    projectType: 'مطاعم',
    briefType: 'logo',
    briefCategory: 'logo',
    logoDetails: {
      logoType: 'text',
      favoriteColors: '#EA580C، #000000',
      designStyle: 'minimalist',
      startDate: 'فوراً',
      apps: {
        website: true,
        socialMedia: true,
        print: true
      }
    },
    logoTypeName: 'شعار نصي',
    logoTypeDesc: 'شعار يعتمد بشكل أساسي على الخطوط.',
    logoTypeImagesBase64: [
      'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg'
    ],
    designStyleName: 'مبسط (Minimalist)',
    designStyleImageBase64: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f'
  };

  const html = generatePdfHTML(formData, 'http://localhost:3000');
  
  // Write HTML out just in case
  fs.writeFileSync('test.html', html);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: 'test.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  
  await browser.close();
  console.log('PDF generated at test.pdf');
}

run().catch(console.error);
