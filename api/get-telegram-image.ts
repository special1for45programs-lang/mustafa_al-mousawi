import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const ALLOWED_ORIGINS = new Set([
  'https://mustafa-al-mousawi.web.app',
  'https://www.mustafa-al-mousawi.web.app',
  'https://mustafa-kappa.vercel.app',
  'https://mustafa-al-moussaw.vercel.app',
  'https://mustafa-al-moussawi.vercel.app',
  'https://mustafa-al-mousawi.vercel.app',
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — restrict to known origins
  const origin = (req.headers['origin'] ?? '') as string;
  const allowedOrigin = ALLOWED_ORIGINS.has(origin)
    ? origin
    : (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null);
  if (allowedOrigin) res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  const fileId = req.query.file_id as string;

  if (!fileId || typeof fileId !== 'string' || !/^[A-Za-z0-9_-]{10,150}$/.test(fileId)) {
    return res.status(400).json({ error: 'Invalid file_id format' });
  }

  if (!TELEGRAM_BOT_TOKEN) {
    return res.status(500).json({ error: 'Telegram bot token not configured' });
  }

  try {
    // 1. Get file path from Telegram API
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Telegram getFile error:', errorText);
      return res.status(response.status).json({ error: 'Failed to fetch file from Telegram' });
    }

    const json = await response.json();
    const filePath = json.result?.file_path;

    if (!filePath) {
      return res.status(404).json({ error: 'File path not found' });
    }

    // 2. Proxy the actual file URL to avoid exposing BOT_TOKEN
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
    
    const imageResponse = await fetch(fileUrl);
    
    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({ error: 'Failed to download image' });
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour since Telegram URLs expire
    
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('[API] Error proxying Telegram image:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
