import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

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
    const { pdfBase64, projectName, clientName, companyName, clientEmail } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ error: 'Missing pdfBase64 data' });
    }

    // 🔍 Step 1 & 2: Debug & Clean Base64
    console.log("[API] Raw Base64 length:", pdfBase64.length);
    console.log("[API] Base64 starts with:", pdfBase64.slice(0, 30));

    // Remove data URI prefix if present (common cause of corruption)
    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");

    // Convert to Buffer to check size
    const pdfBuffer = Buffer.from(cleanBase64, 'base64');
    console.log("[API] PDF Size (bytes):", pdfBuffer.length);

    // 🔍 Step 6: Size Check
    if (pdfBuffer.length > 3000000) {
      console.warn("[API] ⚠️ PDF size exceeds 3MB, Resend might reject it.");
    }

    const pdfFileName = `Brief_${projectName || 'Project'}.pdf`;

    // 1. Send Email via Resend
    try {
      console.log('[API] Sending email via Resend...');
      await resend.emails.send({
        from: 'onboarding@resend.dev', // 🔍 Step 4: Use simple "from"
        to: ['mustafahaidar0955@gmail.com', clientEmail].filter(Boolean),
        subject: `New Project Brief: ${projectName}`,
        html: `
            <h1>New Project Brief Received!</h1>
            <p><strong>Client:</strong> ${clientName}</p>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Project:</strong> ${projectName}</p>
            <p>See the attached PDF for full details.</p>
            `,
        attachments: [
          {
            filename: pdfFileName,
            content: cleanBase64, // 🔍 Step 3: Use Clean Base64 String
            contentType: 'application/pdf', // 🔍 Step 3: Explicit Type (correction: using contentType)
          },
        ],
      });
      console.log('[API] Email sent successfully.');
    } catch (emailError: any) {
      // 🔍 Step 5: Full Error Log
      console.error('[API] Resend full error:', JSON.stringify(emailError, null, 2));
    }

    // 2. Send via Telegram (Optional)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        console.log('[API] Sending to Telegram...');
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('caption', `🚀 New Brief: ${projectName}\n👤 ${clientName}`);

        // Telegram expects a Blob for files in FormData
        const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
        formData.append('document', blob, pdfFileName);

        const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: formData
        });

        if (!telegramRes.ok) {
          console.error('[API] Telegram Error:', await telegramRes.text());
        } else {
          console.log('[API] Telegram sent successfully.');
        }
      } catch (tgError) {
        console.error('[API] Failed to send to Telegram:', tgError);
      }
    }

    // Return success
    return res.status(200).json({ success: true, message: 'PDF processed and sent' });

  } catch (error: any) {
    console.error('[API] Error processing request:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
