const fs = require('fs');
const base64 = fs.readFileSync('public/Images/pdf-header.webp').toString('base64');
fs.writeFileSync('api/pdfHeaderBase64.ts', 'export const pdfHeaderBase64 = "data:image/webp;base64,' + base64 + '";\n');
console.log('Success');
