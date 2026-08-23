const fs = require('fs');
let code = fs.readFileSync('src/components/ChatPanel.tsx', 'utf8');

const targetStr = `<MoreVertical size={16} />`;
const replacementStr = `<ChevronDown size={16} strokeWidth={2.5} />`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/components/ChatPanel.tsx', code);
    console.log("Patched correctly");
} else {
    console.log("Could not find target string.");
}
