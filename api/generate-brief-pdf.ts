import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

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

// Helper function to send text message to Telegram
async function sendTelegramTextMessage(
  botToken: string,
  chatId: string,
  projectName: string,
  clientName: string,
  companyName: string,
  clientEmail: string | undefined,
  formData: BriefFormData
) {
  const telegramMessage = `
🚀 *مشروع جديد!*

📋 *${projectName}*
👤 العميل: ${clientName}
🏢 الشركة: ${companyName}
📧 البريد: ${clientEmail || 'غير محدد'}
📞 الهاتف: ${formData.phone || 'غير محدد'}

💰 الميزانية: ${formData.budget}$
📅 موعد التسليم: ${formData.deadline || 'غير محدد'}

📝 الوصف:
${formData.projectDescription || 'لا يوجد وصف'}

${formData.notes ? `💡 ملاحظات:\n${formData.notes}` : ''}
  `.trim();

  const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: telegramMessage,
      parse_mode: 'Markdown'
    })
  });

  if (!telegramRes.ok) {
    console.error('[API] ❌ Telegram Text Error:', await telegramRes.text());
  } else {
    console.log('[API] ✅ Telegram text message sent successfully.');
  }
}

// Helper function to generate HTML email with all project details
function generateEmailHTML(formData: BriefFormData): string {
  const selectedApps = Object.entries(formData.applications)
    .filter(([_, v]) => v)
    .map(([k, _]) => k)
    .join('، ');

  return `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff;">
      
      <!-- Header -->
      <div style="background: #000000; padding: 30px 40px; border-bottom: 4px solid #d4ff00;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: left;">
              <img src="https://mustafa-kappa.vercel.app/Images/logoS1.png" alt="Logo" style="width: 60px; height: 60px;" />
            </td>
            <td style="text-align: left; padding-left: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">MUSTAFA</h1>
              <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Ali Moossawi</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Content -->
      <div style="padding: 40px;">
        
        <!-- Section 1: Client Info -->
        <div style="margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 4px; height: 24px; background: #d4ff00; border-radius: 10px; margin-left: 10px; display: inline-block;"></div>
            <h2 style="color: #111827; margin: 0; font-size: 18px; display: inline-block;">معلومات العميل</h2>
          </div>
          <table width="100%" cellpadding="10" cellspacing="0" style="background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
            <tr>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">اسم العميل</p>
                <p style="color: #000000; font-size: 14px; margin: 0; font-weight: bold;">${formData.clientName || '-'}</p>
              </td>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">اسم الشركة</p>
                <p style="color: #000000; font-size: 14px; margin: 0; font-weight: bold;">${formData.companyName || '-'}</p>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">رقم الهاتف</p>
                <p style="color: #000000; font-size: 14px; margin: 0; font-weight: bold; direction: ltr; text-align: right;">${formData.phone || '-'}</p>
              </td>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">البريد الإلكتروني</p>
                <p style="color: #000000; font-size: 14px; margin: 0; font-weight: bold; direction: ltr; text-align: right;">${formData.email || '-'}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Section 2: Project Details -->
        <div style="margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 4px; height: 24px; background: #d4ff00; border-radius: 10px; margin-left: 10px; display: inline-block;"></div>
            <h2 style="color: #111827; margin: 0; font-size: 18px; display: inline-block;">تفاصيل المشروع</h2>
          </div>
          
          <div style="background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 15px;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">اسم المشروع</p>
            <p style="color: #000000; font-size: 18px; margin: 0; font-weight: bold;">${formData.projectName || '-'}</p>
          </div>
          
          <div style="background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 15px;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">نبذة عن المشروع</p>
            <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.8;">${formData.projectDescription || '-'}</p>
          </div>
          
          <table width="100%" cellpadding="10" cellspacing="0" style="background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
            <tr>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">المجال</p>
                <p style="color: #000000; font-size: 14px; margin: 0; font-weight: bold;">${formData.projectType || '-'}</p>
              </td>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">الألوان المفضلة</p>
                <p style="color: #000000; font-size: 14px; margin: 0; font-weight: bold;">${formData.favoriteColors || '-'}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Section 3: Specs & Timeline -->
        <div style="margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 4px; height: 24px; background: #d4ff00; border-radius: 10px; margin-left: 10px; display: inline-block;"></div>
            <h2 style="color: #111827; margin: 0; font-size: 18px; display: inline-block;">المواصفات والجدول</h2>
          </div>
          
          <table width="100%" cellpadding="10" cellspacing="0" style="background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 15px;">
            <tr>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">نوع الشعار</p>
                <p style="color: #000000; font-size: 14px; margin: 0; font-weight: bold;">${formData.logoType || '-'}</p>
              </td>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">الميزانية</p>
                <p style="color: #000000; font-size: 16px; margin: 0; font-weight: bold; background: rgba(212,255,0,0.2); padding: 8px 15px; border-radius: 8px; border: 1px solid #d4ff00; display: inline-block;">${formData.budget}$</p>
              </td>
            </tr>
          </table>

          <div style="background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 15px;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0 0 10px 0; font-weight: bold;">التطبيقات المطلوبة</p>
            <p style="color: #374151; font-size: 14px; margin: 0;">${selectedApps || 'لم يتم اختيار تطبيقات'}</p>
            ${formData.otherApplication ? `<p style="color: #374151; font-size: 14px; margin: 10px 0 0 0;">أخرى: ${formData.otherApplication}</p>` : ''}
          </div>
          
          <table width="100%" cellpadding="10" cellspacing="0" style="background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
            <tr>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">تاريخ البدء</p>
                <p style="color: #000000; font-size: 14px; margin: 0; font-weight: bold;">${formData.startDate || '-'}</p>
              </td>
              <td width="50%" style="padding: 15px;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0 0 5px 0; font-weight: bold;">تاريخ التسليم</p>
                <p style="color: #000000; font-size: 14px; margin: 0; font-weight: bold;">${formData.deadline || '-'}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Section 4: Notes -->
        ${formData.notes ? `
        <div style="margin-bottom: 30px;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 4px; height: 24px; background: #d4ff00; border-radius: 10px; margin-left: 10px; display: inline-block;"></div>
            <h2 style="color: #111827; margin: 0; font-size: 18px; display: inline-block;">ملاحظات إضافية</h2>
          </div>
          <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 20px;">
            <p style="color: #78350f; font-size: 14px; margin: 0; line-height: 1.8;">${formData.notes}</p>
          </div>
        </div>
        ` : ''}

        <!-- Attachments Notice -->
        ${formData.moodboard && formData.moodboard.length > 0 ? `
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 15px; text-align: center;">
          <p style="color: #166534; font-size: 14px; margin: 0;">📎 يوجد ${formData.moodboard.length} صورة مرفقة في الأسفل</p>
        </div>
        ` : ''}

      </div>

      <!-- Footer -->
      <div style="background: #000000; padding: 25px 40px; text-align: center;">
        <p style="color: #d4ff00; margin: 0; font-size: 14px; font-weight: bold;">@mustafa.al_moossawi</p>
        <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">Mustafa Ali Moossawi - Graphic Designer</p>
      </div>

    </div>
  `;
}

// Helper to convert base64 to attachment format
function processAttachments(moodboard: string[], projectName: string) {
  return moodboard.slice(0, 5).map((base64Image, index) => {
    // Extract the actual base64 content (remove data:image/xxx;base64, prefix)
    const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (matches) {
      const extension = matches[1];
      const content = matches[2];
      return {
        filename: `${projectName}_attachment_${index + 1}.${extension}`,
        content: content,
      };
    }
    return null;
  }).filter(Boolean);
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

    console.log('[API] 📧 Preparing email for project:', projectName);

    // Generate HTML email content
    const emailHTML = generateEmailHTML(formData);

    // Process image attachments (if any)
    const attachments = processAttachments(formData.moodboard || [], projectName || 'Project');

    // Send via Email
    try {
      console.log('[API] 📧 Sending email...');
      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['mustafahaidar0955@gmail.com', clientEmail].filter(Boolean) as string[],
        subject: `📋 مشروع جديد: ${projectName}`,
        html: emailHTML,
        attachments: attachments as any,
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

        // Check if PDF was sent
        const { pdfBase64, pdfFileName } = req.body;

        if (pdfBase64 && pdfFileName) {
          // Send PDF as document using multipart/form-data
          console.log('[API] 📄 Sending PDF document to Telegram...');

          // Convert base64 to Buffer
          const pdfBuffer = Buffer.from(pdfBase64, 'base64');

          // Create form data manually for Telegram
          const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);

          // Create caption with project summary
          const caption = `🚀 مشروع جديد!\n\n📋 ${projectName}\n👤 العميل: ${clientName}\n🏢 الشركة: ${companyName}\n💰 الميزانية: ${formData.budget}$`;

          // Build multipart body
          let body = '';
          body += `--${boundary}\r\n`;
          body += `Content-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}\r\n`;
          body += `--${boundary}\r\n`;
          body += `Content-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`;
          body += `--${boundary}\r\n`;
          body += `Content-Disposition: form-data; name="document"; filename="${pdfFileName}"\r\n`;
          body += `Content-Type: application/pdf\r\n\r\n`;

          // Combine text parts with binary PDF
          const textEncoder = new TextEncoder();
          const bodyStart = textEncoder.encode(body);
          const bodyEnd = textEncoder.encode(`\r\n--${boundary}--\r\n`);

          // Combine all parts
          const fullBody = new Uint8Array(bodyStart.length + pdfBuffer.length + bodyEnd.length);
          fullBody.set(bodyStart, 0);
          fullBody.set(pdfBuffer, bodyStart.length);
          fullBody.set(bodyEnd, bodyStart.length + pdfBuffer.length);

          const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            headers: {
              'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
            body: fullBody
          });

          if (!telegramRes.ok) {
            const errorText = await telegramRes.text();
            console.error('[API] ❌ Telegram Document Error:', errorText);
            // Fallback to text message if document fails
            console.log('[API] 📱 Falling back to text message...');
            await sendTelegramTextMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, projectName, clientName, companyName, clientEmail, formData);
          } else {
            console.log('[API] ✅ Telegram document sent successfully.');
          }
        } else {
          // No PDF, send text message
          await sendTelegramTextMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, projectName, clientName, companyName, clientEmail, formData);
        }
      } catch (tgError) {
        console.error('[API] ⚠️ Failed to send to Telegram:', tgError);
        // Don't fail the request if Telegram fails
      }
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: 'تم إرسال البريد الإلكتروني بنجاح!'
    });

  } catch (error: any) {
    console.error('[API] ❌ Error processing request:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
