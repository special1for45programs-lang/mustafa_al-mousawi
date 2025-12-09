import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import * as React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import BriefPdfDocument from '../src/components/BriefPdfDocument';
import { BriefFormData } from '../src/types';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Telegram Config
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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

    // Validate API Key
    if (!process.env.RESEND_API_KEY) {
      console.error('[API] ❌ RESEND_API_KEY is missing!');
      return res.status(500).json({
        error: 'Server configuration error',
        details: 'RESEND_API_KEY environment variable is not set'
      });
    }

    if (!formData) {
      return res.status(400).json({ error: 'Missing formData' });
    }

    const { projectName, clientName, companyName, email: clientEmail } = formData;

    console.log('[API] 📄 Generating PDF for project:', projectName);

    // Generate PDF using @react-pdf/renderer
    const pdfBuffer = await renderToBuffer(React.createElement(BriefPdfDocument, { formData }));

    console.log('[API] ✅ PDF generated successfully. Size:', pdfBuffer.length, 'bytes');

    // Size Check
    if (pdfBuffer.length > 3000000) {
      console.warn('[API] ⚠️ PDF size exceeds 3MB, Resend might reject it.');
    }

    const pdfFileName = `Brief_${projectName || 'Project'}.pdf`;

    // Send via Email
    try {
      console.log('[API] 📧 Sending email with PDF attachment...');
      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['mustafahaidar0955@gmail.com', clientEmail].filter(Boolean) as string[],
        subject: `مشروع جديد: ${projectName}`,
        html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #111827; border-bottom: 3px solid #d4ff00; padding-bottom: 15px;">📋 مشروع جديد: ${projectName}</h1>
                
                <div style="margin: 25px 0; padding: 20px; background: #f3f4f6; border-radius: 8px;">
                  <p style="margin: 8px 0; color: #374151;"><strong>👤 العميل:</strong> ${clientName}</p>
                  <p style="margin: 8px 0; color: #374151;"><strong>🏢 الشركة:</strong> ${companyName}</p>
                  <p style="margin: 8px 0; color: #374151;"><strong>📧 البريد:</strong> ${clientEmail}</p>
                </div>

                <p style="color: #6b7280; margin: 20px 0;">📎 تجد في المرفقات ملف PDF الكامل بتفاصيل المشروع.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
                  Mustafa Ali Moossawi - Graphic Designer
                </div>
              </div>
            </div>
            `,
        attachments: [
          {
            filename: pdfFileName,
            content: pdfBuffer,
          },
        ],
      });
      console.log('[API] ✅ Email sent successfully. ID:', emailResult.data?.id);
    } catch (emailError: any) {
      const errorDetails = JSON.stringify(emailError, null, 2);
      console.error('[API] ❌ Email Error:', errorDetails);
      return res.status(500).json({
        error: 'Failed to send email',
        details: emailError.message || errorDetails
      });
    }

    // Send via Telegram (Optional)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        console.log('[API] 📱 Sending to Telegram...');
        const formDataTelegram = new FormData();
        formDataTelegram.append('chat_id', TELEGRAM_CHAT_ID);
        formDataTelegram.append('caption', `🚀 مشروع جديد: ${projectName}\n👤 ${clientName}\n🏢 ${companyName}`);

        // Convert Buffer to Uint8Array for Blob compatibility
        const pdfBlobData = new Uint8Array(pdfBuffer);
        const blob = new Blob([pdfBlobData], { type: 'application/pdf' });
        formDataTelegram.append('document', blob, pdfFileName);

        const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: formDataTelegram
        });

        if (!telegramRes.ok) {
          console.error('[API] ❌ Telegram Error:', await telegramRes.text());
        } else {
          console.log('[API] ✅ Telegram sent successfully.');
        }
      } catch (tgError) {
        console.error('[API] ⚠️ Failed to send to Telegram:', tgError);
        // Don't fail the request if Telegram fails
      }
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: 'تم إنشاء وإرسال ملف PDF بنجاح!'
    });

  } catch (error: any) {
    console.error('[API] ❌ Error processing request:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
