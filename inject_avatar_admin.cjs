const fs = require('fs');

let content = fs.readFileSync('src/admin/components/AdminReviews.tsx', 'utf8');

if (!content.includes('ReviewAvatar')) {
  content = content.replace(
    "import { Loader2, Trash2, Eye, EyeOff, Star } from 'lucide-react';",
    "import { Loader2, Trash2, Eye, EyeOff, Star } from 'lucide-react';\nimport ReviewAvatar from '../../components/ReviewAvatar';"
  );
  
  content = content.replace(
    /<div className="flex justify-between items-start mb-4">\s*<div>\s*<h3 className="text-lg font-bold text-white">\{review\.clientName \|\| '.*?'\}<\/h3>\s*<div className="flex items-center gap-1 mt-2" dir="ltr">/,
    `<div className="flex justify-between items-start mb-4">\n                <div className="flex gap-4 items-center">\n                  <ReviewAvatar name={review.clientName} />\n                  <div>\n                    <h3 className="text-lg font-bold text-white">{review.clientName || 'عميل مميز'}</h3>\n                    <div className="flex items-center gap-1 mt-2" dir="ltr">`
  );

  fs.writeFileSync('src/admin/components/AdminReviews.tsx', content, 'utf8');
}
