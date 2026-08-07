const sharp = require('sharp');
const fs = require('fs');

async function convert() {
  try {
    await sharp('public/Images/mustafaAlMussawi.jpg')
      .webp({ quality: 80 })
      .toFile('public/Images/mustafaAlMussawi.webp');
    console.log('Successfully converted mustafaAlMussawi.jpg to mustafaAlMussawi.webp');
  } catch (err) {
    console.error('Error converting image:', err);
  }
}
convert();
