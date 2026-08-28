const fs = require('fs');
let content = fs.readFileSync('api/generate-brief-pdf.ts', 'utf8');

const regex1 = /\$\{isSocial && formData\.postsLanguage \? `[\s\S]*?` : ''\}/g;
content = content.replace(regex1, '');

const regex2 = /\$\{formData\.competitors \? `[\s\S]*?` : ''\}/g;
content = content.replace(regex2, '');

content = content.replace(/competitors:\s*z\.string\(\)\.optional\(\),?/g, '');
content = content.replace(/postsLanguage:\s*z\.string\(\)\.optional\(\),?/g, '');

fs.writeFileSync('api/generate-brief-pdf.ts', content);
