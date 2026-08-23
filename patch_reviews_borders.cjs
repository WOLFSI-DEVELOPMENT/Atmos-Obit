const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// The reviews section currently has border-t border-white/5. Let's remove it for consistency if needed, but the user image didn't have borders.
// Actually, earlier we removed borders between FAQ and CTA, let's make sure it blends perfectly.
// Let's remove the top border on reviews.
code = code.replace(
  'className="relative w-full bg-[#0a0a0a] py-32 flex flex-col items-center z-20 overflow-hidden border-t border-white/5"',
  'className="relative w-full bg-[#0a0a0a] py-32 flex flex-col items-center z-20 overflow-hidden"'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched reviews top border");
