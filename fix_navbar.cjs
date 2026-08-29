const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Add isKeyboardOpen state
if (!content.includes('isKeyboardOpen')) {
  content = content.replace(
    /const \[isScrollingDown, setIsScrollingDown\] = useState\(false\);/,
    `const [isScrollingDown, setIsScrollingDown] = useState(false);\n  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);`
  );
}

// Add Keyboard Event Listeners inside a new useEffect
if (!content.includes('focusin')) {
  const keyboardEffect = `
  // Mobile Keyboard Detection
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsKeyboardOpen(true);
      }
    };
    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);
`;
  
  // Insert before the scroll useEffect
  content = content.replace(
    '  // OOO"O1 O U,OU.OUSO U,OO-O_USO_ O U,U,O3U. O U,U+O\'O',
    keyboardEffect + '\n  // OOO"O1 O U,OU.OUSO U,OO-O_USO_ O U,U,O3U. O U,U+O\'O'
  );
}

// Replace Scroll Logic with Delta Thresholding
const oldScrollLogic = `      // Smart Scroll Logic
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsScrollingDown(prev => prev !== true ? true : prev);
      } else if (currentScrollY < lastScrollY.current) {
        setIsScrollingDown(prev => prev !== false ? false : prev);
      }
      lastScrollY.current = currentScrollY;`;

const newScrollLogic = `      // Smart Scroll Logic with Delta Threshold (50px)
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) > 50) {
        if (delta > 0 && currentScrollY > 100) {
          setIsScrollingDown(prev => prev !== true ? true : prev);
        } else if (delta < 0) {
          setIsScrollingDown(prev => prev !== false ? false : prev);
        }
        lastScrollY.current = currentScrollY;
      }`;

content = content.replace(oldScrollLogic, newScrollLogic);

// Replace Bottom Nav ClassName
const oldNavClassRegex = /<div className=\{`lg:hidden fixed bottom-0 left-0 right-0 z-\[60\] flex justify-around items-center glass-pill px-2 py-3 mx-4 mb-4 rounded-full transition-transform duration-300 \$\{isScrollingDown \? 'translate-y-\[150%\]' : 'translate-y-0'\}`\} dir="rtl">/g;
const newNavClass = `<div className={\`lg:hidden fixed bottom-0 left-0 right-0 z-[60] flex justify-around items-center glass-pill px-2 py-3 mx-4 mb-4 rounded-full transition-all duration-300 \${isKeyboardOpen ? 'translate-y-[150%] opacity-0 pointer-events-none' : (isScrollingDown ? 'translate-y-[150%]' : 'translate-y-0 opacity-100')}\`} dir="rtl">`;

content = content.replace(oldNavClassRegex, newNavClass);

fs.writeFileSync('src/components/Navbar.tsx', content);
