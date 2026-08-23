const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure Legal pages are imported
if (!code.includes('import { PrivacyPolicy }')) {
  code = code.replace(
    "import { LandingPage } from './components/LandingPage';",
    "import { LandingPage } from './components/LandingPage';\nimport { PrivacyPolicy } from './components/PrivacyPolicy';\nimport { TermsOfService } from './components/TermsOfService';"
  );
}

// Update state definition
code = code.replace(
  "const [view, setView] = useState<'landing' | 'app'>('landing');",
  "const [view, setView] = useState<'landing' | 'app' | 'privacy' | 'terms'>('landing');"
);

// Update LandingPage usage
code = code.replace(
  '<LandingPage onEnterApp={() => setView(\'app\')} />',
  '<LandingPage onNavigate={setView} onEnterApp={() => setView(\'app\')} />'
);

// Add the rendering logic for the new pages
const viewLogic = `
  if (view === 'privacy') {
    return <PrivacyPolicy onNavigate={setView} />;
  }

  if (view === 'terms') {
    return <TermsOfService onNavigate={setView} />;
  }

  if (view === 'landing') {`;

if (!code.includes('if (view === \'privacy\')')) {
  code = code.replace("if (view === 'landing') {", viewLogic);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx routing");
