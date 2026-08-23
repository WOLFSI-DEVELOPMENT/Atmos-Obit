const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure BlogPage is imported
if (!code.includes('import { BlogPage }')) {
  code = code.replace(
    "import { TermsOfService } from './components/TermsOfService';",
    "import { TermsOfService } from './components/TermsOfService';\nimport { BlogPage } from './components/BlogPage';"
  );
}

// Update state definition for view
code = code.replace(
  "const [view, setView] = useState<'landing' | 'app' | 'privacy' | 'terms'>('landing');",
  "const [view, setView] = useState<'landing' | 'app' | 'privacy' | 'terms' | 'blog'>('landing');"
);

// Add the rendering logic for the new pages
const blogLogic = `
  if (view === 'blog') {
    return <BlogPage onNavigate={setView} />;
  }

  if (view === 'privacy') {`;

if (!code.includes("if (view === 'blog')")) {
  code = code.replace("if (view === 'privacy') {", blogLogic);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx with blog routing");
