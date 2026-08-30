const fs = require('fs');
let content = fs.readFileSync('src/admin/components/AdminReviews.tsx', 'utf8');

if (!content.includes('ReviewAvatar')) {
  content = content.replace(
    "import { Loader2, Trash2, Eye, EyeOff, Star } from 'lucide-react';",
    "import { Loader2, Trash2, Eye, EyeOff, Star } from 'lucide-react';\nimport ReviewAvatar from '../../components/ReviewAvatar';"
  );
  
  content = content.replace(
    `                <div>\n                  <h3 className="text-lg font-bold text-white">{review.clientName || 'عميل مميز'}</h3>`,
    `                <div className="flex gap-4 items-center">\n                  <ReviewAvatar name={review.clientName} />\n                  <div>\n                    <h3 className="text-lg font-bold text-white">{review.clientName || 'عميل مميز'}</h3>`
  );
  
  content = content.replace(
    `                  </div>\n                </div>\n                <div className="flex gap-2">`,
    `                  </div>\n                </div>\n                </div>\n                <div className="flex gap-2">`
  );

  fs.writeFileSync('src/admin/components/AdminReviews.tsx', content, 'utf8');
}
