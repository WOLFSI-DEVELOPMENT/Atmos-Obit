const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Replace card outer container styles
code = code.replaceAll(
  'className="bg-[#111111] border border-[#222] hover:border-[#333] transition-colors rounded-[24px] p-4 flex flex-col group"',
  'className="bg-[#141414] hover:bg-[#181818] transition-colors rounded-[24px] p-4 flex flex-col group"'
);

// Remove the inner graphic area border to be completely outline-free
code = code.replace(
  'className="w-full h-56 bg-gradient-to-br from-[#1c1410] to-[#111111] rounded-xl mb-6 relative overflow-hidden border border-white/5"',
  'className="w-full h-56 bg-gradient-to-br from-[#1c1410] to-[#111111] rounded-xl mb-6 relative overflow-hidden"'
);

code = code.replace(
  'className="w-full h-56 bg-gradient-to-br from-[#1a1224] to-[#111111] rounded-xl mb-6 relative overflow-hidden border border-white/5"',
  'className="w-full h-56 bg-gradient-to-br from-[#1a1224] to-[#111111] rounded-xl mb-6 relative overflow-hidden"'
);

code = code.replace(
  'className="w-full h-56 bg-gradient-to-br from-[#241216] to-[#111111] rounded-xl mb-6 relative overflow-hidden border border-white/5"',
  'className="w-full h-56 bg-gradient-to-br from-[#241216] to-[#111111] rounded-xl mb-6 relative overflow-hidden"'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched feature cards to remove outlines");
