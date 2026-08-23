const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Update Props
if (code.includes("'landing' | 'app' | 'privacy' | 'terms'")) {
  code = code.replace(
    "'landing' | 'app' | 'privacy' | 'terms'",
    "'landing' | 'app' | 'privacy' | 'terms' | 'blog'"
  );
}

// Update the top nav link
code = code.replace(
  '<a href="#" className="text-white/70 hover:text-white font-medium transition-colors">Blog</a>',
  '<button onClick={() => onNavigate?.(\'blog\')} className="text-white/70 hover:text-white font-medium transition-colors">Blog</button>'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched LandingPage.tsx with blog routing");
