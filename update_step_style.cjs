const fs = require('fs');
let content = fs.readFileSync('src/components/brief-steps/StepStyle.tsx', 'utf8');

// The grid parent
content = content.replace(
  'className="w-full sm:flex-1 grid grid-cols-4 sm:flex sm:flex-row sm:flex-nowrap items-center sm:justify-center gap-1.5 sm:gap-2 md:gap-3 overflow-hidden mt-1 sm:mt-0" dir="ltr"',
  'className="w-full sm:flex-1 grid grid-cols-4 sm:flex sm:flex-row sm:flex-wrap items-center sm:justify-center gap-1.5 sm:gap-2 md:gap-3 py-4 mt-1 sm:mt-0" dir="ltr"'
);

// The image container
content = content.replace(
  `bg-white rounded-lg sm:rounded-xl overflow-hidden border shrink-0
                                                    transition-all duration-200
                                                    aspect-square sm:aspect-auto sm:w-20 sm:h-20 md:w-24 md:h-24`,
  `bg-white rounded-lg sm:rounded-xl border shrink-0
                                                    transition-all duration-200
                                                    aspect-square sm:aspect-auto w-full sm:w-20 md:w-24 h-auto min-h-[5rem]`
);

fs.writeFileSync('src/components/brief-steps/StepStyle.tsx', content, 'utf8');
