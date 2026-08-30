const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');
content = content.replace(
  '100% { transform: translateX(50%); }',
  '100% { transform: translateX(calc(50% + 12px)); } /* Perfect math loop accounting for flex gap-6 */'
);
fs.writeFileSync('src/index.css', content, 'utf8');
