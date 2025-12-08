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

    // ✅ CRITICAL FIX: Validate API Key First
    if (!process.env.RESEND_API_KEY) {
      console.error('[API] ❌ RESEND_API_KEY is missing!');
      return res.status(500).json({
        error: 'Server configuration error',
        details: 'RESEND_API_KEY environment variable is not set'
      });
    }

    if (!pdfBase64) {
      return res.status(400).json({ error: 'Missing pdfBase64 data' });
    }

    // Debug & Clean Base64
    console.log("[API] Raw Base64 length:", pdfBase64.length);
    console.log("[API] Base64 starts with:", pdfBase64.slice(0, 30));

    // Remove data URI prefix if present
    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");

    // ✅ CRITICAL FIX: Convert to Buffer (Resend prefers Buffer over raw Base64)
    const pdfBuffer = Buffer.from(cleanBase64, 'base64');
    console.log("[API] PDF Size (bytes):", pdfBuffer.length);

    // Size Check
    if (pdfBuffer.length > 3000000) {
      console.warn("[API] ⚠️ PDF size exceeds 3MB, Resend might reject it.");
    }

    const pdfFileName = `Brief_${projectName || 'Project'}.pdf`;

    // 🧪 DIAGNOSTIC: Try sending WITHOUT attachment first
    try {
      console.log('[API] 🧪 TEST 1: Sending email WITHOUT attachment...');
      const testResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['mustafahaidar0955@gmail.com'],
        subject: `[TEST] Email System Check - ${projectName}`,
        html: `
            <h1>✅ Email System is Working!</h1>
            <p>This is a test email to confirm Resend API is functioning.</p>
            <p><strong>Client:</strong> ${clientName}</p>
            <p><strong>Project:</strong> ${projectName}</p>
            <p>If you received this, the next email will contain the PDF attachment.</p>
            `,
      });
      console.log('[API] ✅ TEST 1 PASSED: Email sent successfully without attachment. ID:', testResult.data?.id);
    } catch (testError: any) {
      console.error('[API] ❌ TEST 1 FAILED:', JSON.stringify(testError, null, 2));
      return res.status(500).json({
        error: 'Email system test failed (without attachment)',
        details: testError.message || JSON.stringify(testError)
      });
    }

    // 🧪 DIAGNOSTIC: Now try WITH attachment using Buffer (recommended by Resend docs)
    try {
      console.log('[API] 🧪 TEST 2: Sending email WITH attachment (Buffer format)...');
      const attachmentResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
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
            content: pdfBuffer, // ✅ Using Buffer directly (Resend SDK handles conversion)
          },
        ],
      });
      console.log('[API] ✅ TEST 2 PASSED: Email with attachment sent successfully. ID:', attachmentResult.data?.id);
    } catch (emailError: any) {
      const errorDetails = JSON.stringify(emailError, null, 2);
      console.error('[API] ❌ TEST 2 FAILED (Attachment):', errorDetails);
      return res.status(500).json({
        error: 'Failed to send email with attachment',
        details: emailError.message || errorDetails
      });
    }

    // 2. Send via Telegram (Optional)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        console.log('[API] Sending to Telegram...');
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('caption', `🚀 New Brief: ${projectName}\n👤 ${clientName}`);

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
    return res.status(200).json({
      success: true,
      message: 'Both test emails sent successfully! Check your inbox.'
    });

  } catch (error: any) {
    console.error('[API] Error processing request:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
