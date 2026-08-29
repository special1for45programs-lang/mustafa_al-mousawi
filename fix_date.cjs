const fs = require('fs');
let content = fs.readFileSync('src/admin/components/AdminReviews.tsx', 'utf8');

const newHelper = `const formatDate = (date: any) => {
  if (!date) return 'تاريخ غير معروف';
  if (typeof date === 'string') {
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'تاريخ غير معروف' : d.toLocaleDateString('ar-SA');
  }
  if (typeof date.toDate === 'function') return date.toDate().toLocaleDateString('ar-SA');
  if (date instanceof Date) return date.toLocaleDateString('ar-SA');
  return 'تاريخ غير معروف';
};

const AdminReviews: React.FC = () => {`;

content = content.replace("const AdminReviews: React.FC = () => {", newHelper);

content = content.replace(
  /\{typeof review\.createdAt === 'string' \? new Date\(review\.createdAt\)\.toLocaleDateString\('ar-SA'\) :[\s\S]*?\?\s*review\.createdAt\.toDate\(\)\.toLocaleDateString\('ar-SA'\)\s*:\s*'.*?'\}/,
  "{formatDate(review.createdAt)}"
);

fs.writeFileSync('src/admin/components/AdminReviews.tsx', content, 'utf8');
