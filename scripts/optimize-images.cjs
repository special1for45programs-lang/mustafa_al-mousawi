/**
 * Image optimization script
 */
const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const root = path.resolve(__dirname, '..');

async function convert(src, dest, options = {}) {
  const optsFinal = { quality: 82, ...options };
  // Read as raw buffer — bypasses JPEG header validation
  const buf = fs.readFileSync(src);
  await sharp(buf, { failOnError: false }).webp(optsFinal).toFile(dest);
  const before = (fs.statSync(src).size / 1024).toFixed(1);
  const after  = (fs.statSync(dest).size / 1024).toFixed(1);
  console.log(`✅  ${path.basename(src)} (${before} kB) → ${path.basename(dest)} (${after} kB)`);
}

async function tryConvert(src, dest, options = {}) {
  try {
    await convert(src, dest, options);
    return true;
  } catch (err) {
    console.warn(`⚠️  Skipping ${path.basename(src)}: ${err.message}`);
    return false;
  }
}

async function run() {
  // 1. Convert the 3 MB MyDrawings JPG
  const drawSrc  = path.join(root, 'src/imagesOfMyWorks/MyDrawings/٢٠٢٢٠٢١٣_٠٨٣٨١٩.jpg');
  const drawDest = path.join(root, 'src/imagesOfMyWorks/MyDrawings/٢٠٢٢٠٢١٣_٠٨٣٨١٩.webp');
  if (fs.existsSync(drawSrc)) {
    const ok = await tryConvert(drawSrc, drawDest, { quality: 78 });
    if (ok) console.log('   ↳ 3MB JPG successfully compressed to WebP');
  } else {
    console.warn('⚠️  Source not found:', drawSrc);
  }

  // 2. Convert pdf-header.png → webp
  const pdfSrc  = path.join(root, 'public/Images/pdf-header.png');
  const pdfDest = path.join(root, 'public/Images/pdf-header.webp');
  if (fs.existsSync(pdfSrc)) {
    await tryConvert(pdfSrc, pdfDest, { quality: 90 });
  } else {
    console.warn('⚠️  pdf-header.png not found:', pdfSrc);
  }

  // 3. Convert src/assets/images/styles/*.jpg → *.webp
  const stylesDir = path.join(root, 'src/assets/images/styles');
  const jpgs = fs.readdirSync(stylesDir).filter(f => f.endsWith('.jpg'));
  for (const jpg of jpgs) {
    const src  = path.join(stylesDir, jpg);
    const dest = path.join(stylesDir, jpg.replace('.jpg', '.webp'));
    if (!fs.existsSync(dest)) {
      await tryConvert(src, dest, { quality: 85 });
    } else {
      console.log(`⏭️  Already exists, skipping: ${jpg.replace('.jpg', '.webp')}`);
    }
  }

  // 4. Delete the duplicate /public/Images/styles/*.jpg (unreferenced)
  const pubStyles = path.join(root, 'public/Images/styles');
  if (fs.existsSync(pubStyles)) {
    const pubJpgs = fs.readdirSync(pubStyles).filter(f => f.endsWith('.jpg'));
    for (const jpg of pubJpgs) {
      fs.unlinkSync(path.join(pubStyles, jpg));
      console.log(`🗑️   Deleted public duplicate: ${jpg}`);
    }
  }

  console.log('\n🎉  Conversions done!');
}

run().catch(err => { console.error('❌ Fatal Error:', err); process.exit(1); });
