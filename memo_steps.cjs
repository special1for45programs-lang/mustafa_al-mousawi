const fs = require('fs');
const path = require('path');

const dir = 'src/components/brief-steps';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('import React')) {
    if (content.includes("import {") && content.includes("'react'")) {
       content = content.replace(/import\s*\{/, "import React, {");
    } else {
       content = "import React from 'react';\n" + content;
    }
  }
  
  // replace export default ComponentName;
  content = content.replace(/export default\s+([A-Za-z0-9_]+);/, (match, p1) => {
    if (content.includes(`React.memo(${p1})`)) {
      return match; // already memoized
    }
    return `export default React.memo(${p1});`;
  });
  
  fs.writeFileSync(filePath, content);
});
console.log("Memoization script finished.");
