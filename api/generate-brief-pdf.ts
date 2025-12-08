import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { sendToTelegram } from '../src/utils/telegram';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let browser = null;

  try {
    const { html, projectName, clientName, companyName, clientEmail } = req.body;

    if (!html || !projectName || !clientName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Launch Puppeteer
    const isLocal = process.env.VERCEL_ENV === 'development' || !process.env.VERCEL_ENV;
    console.log(`[PDF] Environment: ${isLocal ? 'Local' : 'Production'}`);

    try {
      if (isLocal) {
        console.log('[PDF] Launching local puppeteer...');
        browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          defaultViewport: { width: 1920, height: 1080 },
          executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          headless: true,
        });
      } else {
        console.log('[PDF] Launching production chromium...');

        const executablePath = await chromium.executablePath();
        console.log('[PDF] Chromium executable path:', executablePath);

        browser = await puppeteer.launch({
          args: [
            ...chromium.args,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process', // Often helps in serverless
            '--no-zygote'
          ],
          defaultViewport: chromium.defaultViewport,
          executablePath: executablePath,
          headless: true, // Force boolean true
          ignoreHTTPSErrors: true,
        });
      }
    } catch (launchError: any) {
      console.error('[PDF] Browser launch failed:', launchError);
      return res.status(500).json({ error: 'Failed to launch browser', details: launchError.message });
    }

    const page = await browser.newPage();

    // Set content
    await page.setContent(html, {
      waitUntil: 'domcontentloaded', // Faster than networkidle0, sufficient for static content
      timeout: 30000
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    await browser.close();
    browser = null;
    console.log('[PDF] Generated successfully, size:', pdfBuffer.length);

    // Send Email (Resend)
    console.log('[PDF] Sending email...');
    const { data, error: resendError } = await resend.emails.send({
      from: 'Portfolio Briefs <onboarding@resend.dev>',
      to: ['mustafahaidar0955@gmail.com'],
      subject: `مشروع جديد: ${projectName}${companyName ? ` - ${companyName}` : ''} - ${clientName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: #1a1a1a; color: white; padding: 24px;">
              <h1 style="margin: 0; font-size: 24px;">📋 استمارة مشروع جديد (PDF Generated)</h1>
            </div>
            <div style="padding: 24px;">
              <h2 style="color: #333; margin-top: 0;">معلومات المشروع</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;">اسم العميل:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${clientName}</td>
                </tr>
                ${companyName ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">اسم الشركة:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${companyName}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #666;">اسم المشروع:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${projectName}</td>
                </tr>
                 ${clientEmail ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">البريد الإلكتروني:</td>
                  <td style="padding: 8px 0; font-weight: bold;" dir="ltr">${clientEmail}</td>
                </tr>
                ` : ''}
              </table>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #666; font-size: 14px;">
                📎 تم إرفاق ملف PDF عالي الجودة يحتوي على التفاصيل الكاملة.
              </p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Brief_${projectName}.pdf`,
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    if (resendError) {
      console.error('[PDF] Resend Error:', resendError);
    } else {
      console.log('[PDF] Email sent successfully:', data?.id);
    }

    // Send to Telegram
    try {
      console.log('[PDF] Sending to Telegram...');
      await sendToTelegram(
        Buffer.from(pdfBuffer),
        `Brief_${projectName}.pdf`,
        `📋 *مشروع جديد (HQ PDF)*\n👤 العميل: ${clientName}${companyName ? `\n🏢 الشركة: ${companyName}` : ''}\n📂 المشروع: ${projectName}\n\nتم استلام ملف التفاصيل.`
      );
      console.log('[PDF] Telegram sent successfully.');
    } catch (telegramError) {
      console.error('[PDF] Telegram Error:', telegramError);
      // Continue
    }

    // Return the PDF to the client for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Brief_${projectName}.pdf`);
    return res.status(200).send(pdfBuffer);

  } catch (error: any) {
    console.error('[PDF] Critical Endpoint Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
