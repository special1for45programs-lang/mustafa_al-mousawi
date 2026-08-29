const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

content = content.replace(
  '100% { transform: translateX(33.333333%); }',
  '100% { transform: translateX(50%); }'
);

content = content.replace(
  'animation: marquee-rtl 30s linear infinite;',
  'animation: marquee-rtl 40s linear infinite;'
);

// add dragging cursors if not exist
if (!content.includes('.cursor-grab')) {
  content += `\n.cursor-grab { cursor: grab; }\n.cursor-grabbing { cursor: grabbing; }\n`;
}

fs.writeFileSync('src/index.css', content);
