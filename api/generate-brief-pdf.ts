import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Telegram Config
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Type for form data
interface BriefFormData {
  clientStatus: 'new' | 'current';
  date: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  projectName: string;
  projectDescription: string;
  projectType: string;
  favoriteColors: string;
  logoType: string;
  moodboard: string[];
  applications: Record<string, boolean>;
  otherApplication: string;
  paperSizes: {
    dl: boolean;
    a5: boolean;
    a4: boolean;
    a3: boolean;
  };
  startDate: string;
  deadline: string;
  budget: string;
  notes: string;
}

// Application labels mapping
const APP_LABELS: Record<string, string> = {
  businessCard: 'بطاقة عمل',
  letterHead: 'ورق المراسلات',
  envelope: 'الظرف',
  folder: 'ملف الأوراق',
  socialMedia: 'قوالب السوشيال ميديا',
  profilePic: 'صور البروفايل',
  packaging: 'علب وتغليف',
  bag: 'أكياس التسوق',
  signage: 'لافتات',
  uniform: 'زي موحد',
  stamp: 'ختم',
  sticker: 'ستيكر',
  website: 'موقع إلكتروني',
  vehicle: 'مركبة',
  menu: 'قائمة طعام'
};

// Generate HTML template for PDF
function generatePdfHTML(formData: BriefFormData): string {
  const selectedApps = Object.entries(formData.applications)
    .filter(([_, v]) => v)
    .map(([k, _]) => APP_LABELS[k] || k);

  if (formData.otherApplication) {
    selectedApps.push(formData.otherApplication);
  }

  const logoTypeLabels: Record<string, string> = {
    'text': 'شعار نصي',
    'icon': 'شعار أيقوني',
    'combined': 'شعار مدمج'
  };

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Cairo', sans-serif;
      background: #ffffff;
      color: #1a1a1a;
      font-size: 12px;
      line-height: 1.6;
      direction: rtl;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      display: flex;
      flex-direction: column;
    }
    
    /* Header */
    .header {
      background: #000000;
      padding: 30px 40px;
      display: flex;
      align-items: center;
      gap: 20px;
      border-bottom: 4px solid #d4ff00;
      direction: ltr;
    }
    
    .logo {
      width: 60px;
      height: 60px;
    }
    
    .header-text h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    
    .header-text p {
      color: rgba(255,255,255,0.8);
      font-size: 11px;
      letter-spacing: 1px;
    }
    
    /* Content */
    .content {
      flex: 1;
      padding: 30px 40px;
    }
    
    /* Section */
    .section {
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .section:last-child {
      border-bottom: none;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .section-indicator {
      width: 4px;
      height: 22px;
      background: #d4ff00;
      border-radius: 10px;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
    }
    
    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .grid-full {
      grid-column: span 2;
    }
    
    /* Field */
    .field {
      margin-bottom: 10px;
    }
    
    .field-label {
      font-size: 10px;
      font-weight: 700;
      color: #9ca3af;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    
    .field-value {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 10px 12px;
      font-weight: 600;
      color: #1a1a1a;
      min-height: 20px;
    }
    
    .field-value.large {
      font-size: 16px;
      padding: 12px 15px;
    }
    
    .field-value.multiline {
      min-height: 60px;
      line-height: 1.8;
      font-weight: 500;
      color: #374151;
    }
    
    .field-value.budget {
      background: rgba(212, 255, 0, 0.15);
      border: 1px solid #d4ff00;
      text-align: center;
      font-size: 14px;
      color: #000;
    }
    
    .field-value.ltr {
      direction: ltr;
      text-align: left;
    }
    
    /* Tags */
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 12px;
    }
    
    .tag {
      background: #ffffff;
      border: 1px solid #d1d5db;
      color: #374151;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .empty-tag {
      color: #9ca3af;
      font-style: italic;
    }
    
    /* Notes */
    .notes-box {
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 10px;
      padding: 15px;
      color: #78350f;
      font-weight: 500;
      line-height: 1.8;
    }
    
    /* Footer */
    .footer {
      background: #000000;
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      direction: ltr;
    }
    
    .instagram-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .instagram-icon svg {
      width: 20px;
      height: 20px;
      fill: #d4ff00;
    }
    
    .instagram-handle {
      color: #d4ff00;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <img src="https://mustafa-kappa.vercel.app/Images/logoS1.png" alt="Logo" class="logo">
      <div class="header-text">
        <h1>MUSTAFA</h1>
        <p>Ali Moossawi</p>
      </div>
    </div>
    
    <!-- Content -->
    <div class="content">
      
      <!-- معلومات العميل -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">معلومات العميل</div>
        </div>
        <div class="grid">
          <div class="field">
            <div class="field-label">اسم العميل</div>
            <div class="field-value">${formData.clientName || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">اسم الشركة</div>
            <div class="field-value">${formData.companyName || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">رقم الهاتف</div>
            <div class="field-value ltr">${formData.phone || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">البريد الإلكتروني</div>
            <div class="field-value ltr">${formData.email || '-'}</div>
          </div>
        </div>
      </div>
      
      <!-- تفاصيل المشروع -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">تفاصيل المشروع</div>
        </div>
        <div class="field">
          <div class="field-label">اسم المشروع</div>
          <div class="field-value large">${formData.projectName || '-'}</div>
        </div>
        <div class="field" style="margin-top: 15px;">
          <div class="field-label">نبذة عن المشروع</div>
          <div class="field-value multiline">${formData.projectDescription || 'لا يوجد وصف'}</div>
        </div>
        <div class="grid" style="margin-top: 15px;">
          <div class="field">
            <div class="field-label">المجال</div>
            <div class="field-value">${formData.projectType || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">الألوان المفضلة</div>
            <div class="field-value">${formData.favoriteColors || '-'}</div>
          </div>
        </div>
      </div>
      
      <!-- المواصفات والجدول -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">المواصفات والجدول</div>
        </div>
        <div class="grid">
          <div class="field">
            <div class="field-label">نوع الشعار</div>
            <div class="field-value">${logoTypeLabels[formData.logoType] || formData.logoType || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">الميزانية</div>
            <div class="field-value budget">${formData.budget}$</div>
          </div>
        </div>
        <div class="field" style="margin-top: 15px;">
          <div class="field-label">التطبيقات المطلوبة</div>
          <div class="tags">
            ${selectedApps.length > 0
      ? selectedApps.map(app => `<span class="tag">${app}</span>`).join('')
      : '<span class="empty-tag">لم يتم اختيار تطبيقات</span>'
    }
          </div>
        </div>
        <div class="grid" style="margin-top: 15px;">
          <div class="field">
            <div class="field-label">تاريخ البدء</div>
            <div class="field-value">${formData.startDate || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">تاريخ التسليم</div>
            <div class="field-value">${formData.deadline || '-'}</div>
          </div>
        </div>
      </div>
      
      ${formData.notes ? `
      <!-- ملاحظات -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">ملاحظات إضافية</div>
        </div>
        <div class="notes-box">${formData.notes}</div>
      </div>
      ` : ''}
      
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="instagram-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>
      <span class="instagram-handle">@mustafa.al_moossawi</span>
    </div>
  </div>
</body>
</html>
`;
}

// Generate PDF using Puppeteer
async function generatePdfWithPuppeteer(html: string): Promise<Buffer> {
  console.log('[API] 🎨 Launching browser...');

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1200, height: 1600 },
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Set content
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    console.log('[API] 📄 Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
    console.log('[API] ✅ Browser closed');
  }
}

// Send PDF to Telegram
async function sendPdfToTelegram(
  pdfBuffer: Buffer,
  fileName: string,
  caption: string
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[API] ⚠️ Telegram not configured');
    return false;
  }

  try {
    console.log('[API] 📱 Sending PDF to Telegram...');

    // Create form data for Telegram
    const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);

    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="document"; filename="${fileName}"\r\n`;
    body += `Content-Type: application/pdf\r\n\r\n`;

    const textEncoder = new TextEncoder();
    const bodyStart = textEncoder.encode(body);
    const bodyEnd = textEncoder.encode(`\r\n--${boundary}--\r\n`);

    const fullBody = new Uint8Array(bodyStart.length + pdfBuffer.length + bodyEnd.length);
    fullBody.set(bodyStart, 0);
    fullBody.set(pdfBuffer, bodyStart.length);
    fullBody.set(bodyEnd, bodyStart.length + pdfBuffer.length);

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: fullBody
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[API] ❌ Telegram Error:', error);
      return false;
    }

    console.log('[API] ✅ PDF sent to Telegram successfully!');
    return true;
  } catch (error) {
    console.error('[API] ❌ Telegram Error:', error);
    return false;
  }
}

// Generate email HTML
function generateEmailHTML(formData: BriefFormData): string {
  const selectedApps = Object.entries(formData.applications)
    .filter(([_, v]) => v)
    .map(([k, _]) => APP_LABELS[k] || k)
    .join('، ');

  return `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: #000000; padding: 25px 30px; text-align: center; border-bottom: 3px solid #d4ff00;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🚀 مشروع جديد!</h1>
      </div>

      <!-- Content -->
      <div style="padding: 30px;">
        
        <div style="background: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #d4ff00; background: #000; padding: 10px 15px; border-radius: 8px; margin: -20px -20px 15px -20px; font-size: 16px;">📋 ${formData.projectName}</h2>
          <table width="100%" style="border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>العميل:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${formData.clientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>الشركة:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${formData.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>الهاتف:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;" dir="ltr">${formData.phone || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>البريد:</strong></td>
              <td style="padding: 8px 0;" dir="ltr">${formData.email || '-'}</td>
            </tr>
          </table>
        </div>

        <div style="background: rgba(212, 255, 0, 0.1); border: 1px solid #d4ff00; border-radius: 10px; padding: 15px; text-align: center; margin-bottom: 20px;">
          <span style="font-size: 24px; font-weight: bold;">${formData.budget}$</span>
          <br>
          <span style="color: #666; font-size: 12px;">الميزانية</span>
        </div>

        <p style="color: #666; line-height: 1.8;">${formData.projectDescription || 'لا يوجد وصف'}</p>

        ${selectedApps ? `<p style="margin-top: 15px;"><strong>التطبيقات:</strong> ${selectedApps}</p>` : ''}
        ${formData.notes ? `<div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-top: 15px;"><strong>ملاحظات:</strong> ${formData.notes}</div>` : ''}

      </div>

      <!-- Footer -->
      <div style="background: #000000; padding: 15px; text-align: center;">
        <span style="color: #d4ff00; font-weight: bold;">📎 ملف PDF مرفق</span>
      </div>

    </div>
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body as { formData: BriefFormData };

    if (!formData) {
      return res.status(400).json({ error: 'Missing formData' });
    }

    const { projectName, clientName, companyName } = formData;

    console.log('[API] 🚀 Processing project:', projectName);

    // Step 1: Generate PDF
    console.log('[API] 📄 Generating PDF with Puppeteer...');
    const html = generatePdfHTML(formData);
    const pdfBuffer = await generatePdfWithPuppeteer(html);
    const pdfFileName = `Brief_${projectName || 'Project'}.pdf`;

    console.log('[API] ✅ PDF generated, size:', pdfBuffer.length, 'bytes');

    // Step 2: Send to Telegram
    const telegramCaption = `🚀 مشروع جديد!\n\n📋 ${projectName}\n👤 العميل: ${clientName}\n🏢 الشركة: ${companyName}\n💰 الميزانية: ${formData.budget}$`;
    await sendPdfToTelegram(pdfBuffer, pdfFileName, telegramCaption);

    // Step 3: Send Email (only to designer, not client)
    if (process.env.RESEND_API_KEY) {
      try {
        console.log('[API] 📧 Sending email to designer...');

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: ['mustafahaidar0955@gmail.com'], // Only designer email
          subject: `📋 مشروع جديد: ${projectName}`,
          html: generateEmailHTML(formData),
          attachments: [{
            filename: pdfFileName,
            content: pdfBuffer.toString('base64'),
          }],
        });

        console.log('[API] ✅ Email sent successfully!');
      } catch (emailError: any) {
        console.error('[API] ❌ Email Error:', emailError.message);
        // Don't fail if email fails
      }
    }

    // Step 4: Return PDF to client for download
    return res.status(200).json({
      success: true,
      message: 'تم إنشاء وإرسال الملف بنجاح!',
      pdf: pdfBuffer.toString('base64'),
      fileName: pdfFileName
    });

  } catch (error: any) {
    console.error('[API] ❌ Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
