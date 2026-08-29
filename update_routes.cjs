const fs = require('fs');

let adminApp = fs.readFileSync('src/admin/AdminApp.tsx', 'utf8');

if (!adminApp.includes('AdminReviews')) {
  adminApp = adminApp.replace(
    "import ResourcesEditor from './components/ResourcesEditor';",
    "import ResourcesEditor from './components/ResourcesEditor';\nimport AdminReviews from './components/AdminReviews';"
  );
  
  adminApp = adminApp.replace(
    '<Route path="requests/:id" element={<BriefDetail />} />',
    '<Route path="requests/:id" element={<BriefDetail />} />\n            <Route path="reviews" element={<AdminReviews />} />'
  );
  
  fs.writeFileSync('src/admin/AdminApp.tsx', adminApp, 'utf8');
}

let adminDashboard = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');
if (!adminDashboard.includes('/admin/reviews')) {
  adminDashboard = adminDashboard.replace(
    "import { Home, Package, FileText, Inbox, LogOut, ExternalLink, Menu, X, Phone, FolderDown } from 'lucide-react';",
    "import { Home, Package, FileText, Inbox, LogOut, ExternalLink, Menu, X, Phone, FolderDown, Star } from 'lucide-react';"
  );
  
  adminDashboard = adminDashboard.replace(
    "{ to: '/admin/requests', icon: Inbox, label: 'O U,OU,O\"O O O U,U^O OO_Oc' },",
    "{ to: '/admin/requests', icon: Inbox, label: 'O U,OU,O\"O O O U,U^O OO_Oc' },\n    { to: '/admin/reviews', icon: Star, label: 'إدارة التقييمات' },"
  );
  
  fs.writeFileSync('src/admin/AdminDashboard.tsx', adminDashboard, 'utf8');
}
