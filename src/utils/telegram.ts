export async function sendToTelegram(pdfBuffer: Buffer, fileName: string, caption: string) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('❌ Telegram configuration missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in environment variables.');
        return;
    }

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', caption);

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
