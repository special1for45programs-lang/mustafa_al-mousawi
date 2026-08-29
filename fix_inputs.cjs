const fs = require('fs');

let content = fs.readFileSync('src/components/brief-steps/StepInfo.tsx', 'utf8');

const regex1 = /className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"/g;
content = content.replace(regex1, 'className="form-input-clean"');

const regex2 = /className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400 resize-none leading-relaxed"/g;
content = content.replace(regex2, 'className="form-input-clean h-32 resize-none leading-relaxed"');

const regex3 = /className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400 resize-none leading-relaxed"/g;
content = content.replace(regex3, 'className="form-input-clean h-24 resize-none leading-relaxed"');

const regex4 = /className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all font-semibold text-base sm:text-sm"/g;
content = content.replace(regex4, 'className="form-input-clean bg-white font-semibold appearance-none focus:border-brand-lime"');

fs.writeFileSync('src/components/brief-steps/StepInfo.tsx', content);

// Let's do the same for StepDetails.tsx
let content2 = fs.readFileSync('src/components/brief-steps/StepDetails.tsx', 'utf8');
content2 = content2.replace(regex1, 'className="form-input-clean"');
const regex5 = /className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400 resize-none"/g;
content2 = content2.replace(regex5, 'className="form-input-clean h-24 resize-none"');
fs.writeFileSync('src/components/brief-steps/StepDetails.tsx', content2);
