const fs = require('fs');
let code = fs.readFileSync('src/components/ChatPanel.tsx', 'utf8');

const targetStr = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="12" viewBox="0 0 52 22" fill="none" className="text-current">`;
const replacementStr = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="15" viewBox="0 0 52 22" fill="none" className="text-current">`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/components/ChatPanel.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Could not find target string.");
}
