const fs = require('fs');

// 1. Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

if (!appCode.includes('import { PricingPage }')) {
  appCode = appCode.replace(
    "import { BlogPage } from './components/BlogPage';",
    "import { BlogPage } from './components/BlogPage';\nimport { PricingPage } from './components/PricingPage';"
  );
}

appCode = appCode.replace(
  "const [view, setView] = useState<'landing' | 'app' | 'privacy' | 'terms' | 'blog'>('landing');",
  "const [view, setView] = useState<'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing'>('landing');"
);

const pricingLogic = `
  if (view === 'pricing') {
    return <PricingPage onNavigate={setView} />;
  }

  if (view === 'blog') {`;

if (!appCode.includes("if (view === 'pricing')")) {
  appCode = appCode.replace("if (view === 'blog') {", pricingLogic);
}

fs.writeFileSync('src/App.tsx', appCode);

// 2. Patch LandingPage.tsx
let landingCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

landingCode = landingCode.replace(
  "'landing' | 'app' | 'privacy' | 'terms' | 'blog'",
  "'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing'"
);

landingCode = landingCode.replace(
  '<a href="#" className="text-white/70 hover:text-white font-medium transition-colors">Pricing</a>',
  '<button onClick={() => onNavigate?.(\'pricing\')} className="text-white/70 hover:text-white font-medium transition-colors">Pricing</button>'
);

fs.writeFileSync('src/components/LandingPage.tsx', landingCode);

console.log("Patched full routing for Pricing");
