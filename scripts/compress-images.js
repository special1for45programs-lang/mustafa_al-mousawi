import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIRS = [
  path.join(__dirname, '../src/imagesOfMyWorks'),
  path.join(__dirname, '../public/Images')
];

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      // Process jpg, jpeg, png over 500KB
      if (['.jpg', '.jpeg', '.png'].includes(ext) && stat.size > 500 * 1024) {
        console.log(`Compressing ${fullPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);
        const newPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        try {
          await sharp(fullPath)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toFile(newPath);
            
          console.log(`✅ Saved ${newPath}`);
          fs.unlinkSync(fullPath); // delete original
          console.log(`🗑️ Deleted ${fullPath}`);
        } catch (err) {
          console.error(`❌ Failed to compress ${fullPath}:`, err);
        }
      }
    }
  }
}

async function run() {
  for (const dir of TARGET_DIRS) {
    await processDirectory(path.resolve(dir));
  }
  console.log('🎉 Compression complete!');
}

run();
