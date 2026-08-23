const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Replace Feature 1 floating window
code = code.replace(
  'className="w-36 h-40 bg-[#161616] rounded-xl border border-white/10 shadow-2xl flex flex-col p-4 gap-3 relative -left-4"',
  'className="w-36 h-40 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-xl flex flex-col p-4 gap-3 relative -left-4"'
);

// Replace Feature 1 orange circle (remove outline/border)
code = code.replace(
  'className="absolute right-10 bottom-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-[4px] border-[#161616] flex items-center justify-center shadow-2xl shadow-orange-500/20"',
  'className="absolute right-10 bottom-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-orange-500/20"'
);

// Replace Feature 2 floating pill
code = code.replace(
  'className="w-48 h-14 bg-[#161616] rounded-full border border-white/10 shadow-2xl flex items-center px-4 gap-4"',
  'className="w-48 h-14 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full flex items-center px-4 gap-4"'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched glass effects on 1 and 2");
