const fs = require('fs');
let content = fs.readFileSync('src/components/brief-steps/ColorWheelTab.tsx', 'utf8');

content = content.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 w-full">',
  '<div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:pb-0 w-full">'
);

content = content.replace(
  "className={`flex flex-col p-4 sm:p-5 rounded-2xl transition-all shadow-lg group text-right relative ${isActive ? 'border-2 border-[#ccff00] bg-brand-dark' : 'border border-white/10 bg-brand-black hover:border-brand-lime'}`}",
  "className={`min-w-[85%] snap-center md:min-w-full flex flex-col p-4 sm:p-5 rounded-2xl transition-colors shadow-lg group text-right relative ${isActive ? 'border-2 border-[#ccff00] bg-brand-dark' : 'border border-white/10 bg-brand-black hover:border-brand-lime'}`}"
);

fs.writeFileSync('src/components/brief-steps/ColorWheelTab.tsx', content);
