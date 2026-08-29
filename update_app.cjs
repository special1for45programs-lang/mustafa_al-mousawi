const fs = require('fs');
let content = fs.readFileSync('src/admin/AdminApp.tsx', 'utf8');

if (!content.includes('path="reviews"')) {
  const lines = content.split('\n');
  const newLines = [];
  for (let line of lines) {
    newLines.push(line);
    if (line.includes('path="requests/:id"')) {
      newLines.push('            <Route path="reviews" element={<AdminReviews />} />');
    }
  }
  fs.writeFileSync('src/admin/AdminApp.tsx', newLines.join('\n'), 'utf8');
}
