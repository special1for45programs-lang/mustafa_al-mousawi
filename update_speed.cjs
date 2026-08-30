const fs = require('fs');

let content = fs.readFileSync('src/index.css', 'utf8');
content = content.replace('animation: marquee-rtl 20s linear infinite;', 'animation: marquee-rtl 30s linear infinite;');

fs.writeFileSync('src/index.css', content, 'utf8');
