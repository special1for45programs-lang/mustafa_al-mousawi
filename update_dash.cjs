const fs = require('fs');
let content = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');

if (!content.includes('/admin/reviews')) {
  content = content.replace(
    "import { Home, Package, FileText, Inbox, LogOut, ExternalLink, Menu, X, Phone, FolderDown } from 'lucide-react';",
    "import { Home, Package, FileText, Inbox, LogOut, ExternalLink, Menu, X, Phone, FolderDown, Star } from 'lucide-react';"
  );
  
  const lines = content.split('\n');
  const newLines = [];
  for (let line of lines) {
    newLines.push(line);
    if (line.includes("to: '/admin/requests'")) {
      newLines.push("    { to: '/admin/reviews', icon: Star, label: 'إدارة التقييمات' },");
    }
  }
  fs.writeFileSync('src/admin/AdminDashboard.tsx', newLines.join('\n'), 'utf8');
}
