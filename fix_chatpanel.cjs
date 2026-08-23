const fs = require('fs');
let content = fs.readFileSync('src/components/ChatPanel.tsx', 'utf8');

// Find the first declaration of globalApiKey
const firstDecl = "const globalApiKey = localStorage.getItem('vibecoder_api_key') || '';";

if (content.includes(firstDecl)) {
    content = content.replace(firstDecl, "// " + firstDecl);
}

fs.writeFileSync('src/components/ChatPanel.tsx', content);
console.log("fixed chat panel");
