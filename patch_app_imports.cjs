const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = `import ChatPanel from './components/ChatPanel';`;
const newImport = `import ChatPanel from './components/ChatPanel';\nimport { LandingPage } from './components/LandingPage';`;

if (code.includes(targetImport)) {
    code = code.replace(targetImport, newImport);
} else {
    console.log("Could not find target import");
}

fs.writeFileSync('src/App.tsx', code);
