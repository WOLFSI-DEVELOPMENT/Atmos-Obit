const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// CTA section: remove border-t border-white/5
code = code.replace(
  'className="relative w-full bg-black py-32 md:py-48 flex flex-col items-start justify-center overflow-hidden z-20 border-t border-white/5"',
  'className="relative w-full bg-black py-32 md:py-48 flex flex-col items-start justify-center overflow-hidden z-20"'
);

// CTA section gradient: change from-black via-transparent to-black to to-[#0a0a0a]
code = code.replace(
  '<div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90"></div>',
  '<div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-[#0a0a0a] opacity-90"></div>'
);

// Footer: remove border-t border-white/5
code = code.replace(
  'className="w-full bg-[#0a0a0a] pt-16 pb-12 px-8 flex flex-col z-40 relative border-t border-white/5"',
  'className="w-full bg-[#0a0a0a] pt-16 pb-12 px-8 flex flex-col z-40 relative"'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched blending");
