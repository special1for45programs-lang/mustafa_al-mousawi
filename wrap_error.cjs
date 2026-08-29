const fs = require('fs');

let adminApp = fs.readFileSync('src/admin/AdminApp.tsx', 'utf8');

if (!adminApp.includes('ErrorBoundary')) {
  adminApp = adminApp.replace(
    "import AdminHome from './AdminHome';",
    "import AdminHome from './AdminHome';\nimport ErrorBoundary from '../components/ErrorBoundary';"
  );
  
  adminApp = adminApp.replace(
    '<AuthProvider>',
    '<ErrorBoundary>\n    <AuthProvider>'
  );
  
  adminApp = adminApp.replace(
    '</AuthProvider>',
    '</AuthProvider>\n    </ErrorBoundary>'
  );
  
  fs.writeFileSync('src/admin/AdminApp.tsx', adminApp, 'utf8');
}
