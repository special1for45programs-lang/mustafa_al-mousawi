const fs = require('fs');

let content = fs.readFileSync('src/admin/components/AdminReviews.tsx', 'utf8');

// I will just use standard regex to fix it
// The structure currently is:
// <div className="flex justify-between items-start mb-4">
//   <div className="flex gap-4 items-center">
//     <ReviewAvatar name={review.clientName} />
//     <div>
//       <h3 ...>
//       <div ...> [stars] </div>
//     </div>
//   <div className="flex gap-2"> ... </div>
// </div>

content = content.replace(
  '                  </div>\n                  <div className="flex gap-2">',
  '                  </div>\n                </div>\n                <div className="flex gap-2">'
);

fs.writeFileSync('src/admin/components/AdminReviews.tsx', content, 'utf8');
