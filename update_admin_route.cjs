const fs = require('fs');

let adminApp = fs.readFileSync('src/admin/AdminApp.tsx', 'utf8');

if (!adminApp.includes('path="reviews"')) {
  adminApp = adminApp.replace(
    '<Route path="resources" element={<ResourcesEditor />} />',
    '<Route path="resources" element={<ResourcesEditor />} />\n            <Route path="reviews" element={<AdminReviews />} />'
  );
  fs.writeFileSync('src/admin/AdminApp.tsx', adminApp, 'utf8');
}
