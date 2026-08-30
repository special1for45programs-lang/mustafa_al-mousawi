const fs = require('fs');

let content = fs.readFileSync('src/components/TestimonialsMarquee.tsx', 'utf8');

// Add import
if (!content.includes('ReviewAvatar')) {
  content = content.replace(
    "import { Star, X } from 'lucide-react';",
    "import { Star, X } from 'lucide-react';\nimport ReviewAvatar from './ReviewAvatar';"
  );
  
  // Replace first instance (Marquee Card)
  content = content.replace(
    /<div className="mt-auto border-t border-white\/10 pt-4">\s*<p className="text-white font-bold text-base">\s*\{review\.clientName \|\| '.*?'\}\s*<\/p>\s*<\/div>/,
    `<div className="mt-auto border-t border-white/10 pt-4 flex items-center gap-3">\n                    <ReviewAvatar name={review.clientName} />\n                    <p className="text-white font-bold text-base">\n                      {review.clientName || 'عميل مميز'}\n                    </p>\n                  </div>`
  );

  // Replace second instance (Modal)
  content = content.replace(
    /<div className="border-t border-white\/10 pt-6">\s*<p className="text-brand-lime font-bold text-xl">\s*\{selectedReview\.clientName \|\| '.*?'\}\s*<\/p>\s*<\/div>/,
    `<div className="border-t border-white/10 pt-6 flex items-center gap-4">\n              <ReviewAvatar name={selectedReview.clientName} className="w-12 h-12 text-xl" />\n              <p className="text-brand-lime font-bold text-xl">\n                {selectedReview.clientName || 'عميل مميز'}\n              </p>\n            </div>`
  );

  fs.writeFileSync('src/components/TestimonialsMarquee.tsx', content, 'utf8');
}
