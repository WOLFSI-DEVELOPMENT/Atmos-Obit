const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Update Props
code = code.replace(
  'interface LandingPageProps {\n  onEnterApp: () => void;\n}',
  'interface LandingPageProps {\n  onEnterApp: () => void;\n  onNavigate?: (view: \'landing\' | \'app\' | \'privacy\' | \'terms\') => void;\n}'
);

code = code.replace(
  'export function LandingPage({ onEnterApp }: LandingPageProps) {',
  'export function LandingPage({ onEnterApp, onNavigate }: LandingPageProps) {'
);

// Update Footer Links
code = code.replace(
  '<a href="#" className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px]">Privacy Policy</a>',
  '<button onClick={() => onNavigate?.(\'privacy\')} className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px] text-left">Privacy Policy</button>'
);

code = code.replace(
  '<a href="#" className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px]">Terms of Service</a>',
  '<button onClick={() => onNavigate?.(\'terms\')} className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px] text-left">Terms of Service</button>'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched LandingPage routing");
