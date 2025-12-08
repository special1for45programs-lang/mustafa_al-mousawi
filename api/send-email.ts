import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendToTelegram(pdfBuffer: Buffer, fileName: string, caption: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ Telegram configuration missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in environment variables.');
    return;
  }

  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  formData.append('caption', caption);

  // Create a Blob from the buffer (Node.js 18+ supports Blob)
  // Create a Blob from the buffer (Node.js 18+ supports Blob)
  const blob = new Blob([pdfBuffer as any], { type: 'application/pdf' });
  formData.append('document', blob, fileName);

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Telegram API Error:', text);
    throw new Error(`Telegram API Error: ${text}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pdfBase64, projectName, clientName, clientEmail } = req.body;

    // Validate required fields
    if (!pdfBase64 || !projectName || !clientName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert base64 string to buffer for attachment
    // Remove the data URL prefix if present (e.g., "data:application/pdf;base64,")
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Briefs <onboarding@resend.dev>', // Use Resend's test domain or your verified domain
      to: ['mustafahaidar0955@gmail.com'],
      subject: `مشروع جديد: ${projectName} - ${clientName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: #1a1a1a; color: white; padding: 24px;">
              <h1 style="margin: 0; font-size: 24px;">📋 استمارة مشروع جديد</h1>
            </div>
            <div style="padding: 24px;">
              <h2 style="color: #333; margin-top: 0;">معلومات المشروع</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;">اسم العميل:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${clientName}</td>
                </tr>
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
                📎 يرجى الاطلاع على ملف PDF المرفق للحصول على التفاصيل الكاملة.
              </p>
            </div>
            <div style="background: #f9f9f9; padding: 16px 24px; text-align: center; color: #999; font-size: 12px;">
              تم إرسال هذا البريد تلقائياً من موقعك الشخصي
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Brief_${projectName}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    // Send to Telegram
    await sendToTelegram(
      pdfBuffer,
      `Brief_${projectName}.pdf`,
      `📋 *مشروع جديد*\n👤 العميل: ${clientName}\n📂 المشروع: ${projectName}\n\nتم استلام ملف التفاصيل.`
    );

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }

    return res.status(200).json({ success: true, messageId: data?.id });
  } catch (err: any) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
