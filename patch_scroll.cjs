const fs = require('fs');
let code = fs.readFileSync('src/components/LegalPage.tsx', 'utf8');

if (!code.includes('window.scrollTo(0, 0)')) {
  code = code.replace(
    "export function LegalPage({ title, lastUpdated, readingTime, intro, sections, onNavigate }: LegalPageProps) {",
    "export function LegalPage({ title, lastUpdated, readingTime, intro, sections, onNavigate }: LegalPageProps) {\n  useEffect(() => {\n    window.scrollTo(0, 0);\n  }, [title]);\n"
  );
  fs.writeFileSync('src/components/LegalPage.tsx', code);
  console.log('Patched scroll to top');
} else {
  console.log('Already patched');
}
