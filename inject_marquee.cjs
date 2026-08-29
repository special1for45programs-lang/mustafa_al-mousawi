const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add lazy import for TestimonialsMarquee
if (!content.includes('TestimonialsMarquee')) {
  content = content.replace(
    "const Portfolio = lazy(() => import('./components/Portfolio'));",
    "const Portfolio = lazy(() => import('./components/Portfolio'));\nconst TestimonialsMarquee = lazy(() => import('./components/TestimonialsMarquee'));"
  );

  // Inject between Portfolio and Packages
  content = content.replace(
    '            <section id="portfolio">\n              <Portfolio />\n            </section>',
    '            <section id="portfolio">\n              <Portfolio />\n            </section>\n\n            {/* Testimonials Marquee */}\n            <section id="testimonials">\n              <TestimonialsMarquee />\n            </section>'
  );

  fs.writeFileSync('src/App.tsx', content);
}
