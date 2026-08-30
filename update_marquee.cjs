const fs = require('fs');

let content = fs.readFileSync('src/components/TestimonialsMarquee.tsx', 'utf8');

// Replace array duplication logic
const oldDuplication = "const displayReviews = [...reviews, ...reviews];";
const newDuplication = `// Dynamically calculate repetitions to ensure the track is always wider than the viewport
  const minItemsPerHalf = 6;
  const repeatCount = Math.max(1, Math.ceil(minItemsPerHalf / reviews.length));
  const baseReviews = Array(repeatCount).fill(reviews).flat();
  
  // Duplicated array for seamless 0 to 50% translation loop
  const displayReviews = [...baseReviews, ...baseReviews];`;

content = content.replace(oldDuplication, newDuplication);

// Replace flex w-max gap-6 to include justify-start
content = content.replace(
  'className={`flex w-max gap-6 animate-marquee-rtl ${(isDragging || isHovered.current) ? \'[animation-play-state:paused]\' : \'hover:[animation-play-state:paused]\'}`}',
  'className={`flex justify-start w-max gap-6 animate-marquee-rtl ${(isDragging || isHovered.current) ? \'[animation-play-state:paused]\' : \'hover:[animation-play-state:paused]\'}`}'
);

fs.writeFileSync('src/components/TestimonialsMarquee.tsx', content, 'utf8');
