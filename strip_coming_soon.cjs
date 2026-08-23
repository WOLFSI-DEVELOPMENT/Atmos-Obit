const fs = require('fs');

let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

const openaiStart = '<h3 className="text-[13px] text-[#8e8e93] uppercase font-medium">OpenAI (Coming Soon)</h3>';
if (content.includes(openaiStart)) {
    console.log("Still has OpenAI coming soon");
    // Find the enclosing div: <div className="space-y-4 opacity-50 cursor-not-allowed mt-6">
    const idx = content.lastIndexOf('<div className="space-y-4 opacity-50 cursor-not-allowed mt-6">', content.indexOf(openaiStart));
    // Find the end of this block. It is right before: <div className="space-y-4 opacity-50 cursor-not-allowed mt-6"> (for anthropic)
    // Or before the custom models block. Let's just find where it ends cleanly.
}

const anthropicStart = '<h3 className="text-[13px] text-[#8e8e93] uppercase font-medium">Anthropic (Coming Soon)</h3>';
if (content.includes(anthropicStart)) {
    console.log("Still has Anthropic coming soon");
    const idx = content.lastIndexOf('<div className="space-y-4 opacity-50 cursor-not-allowed mt-6">', content.indexOf(anthropicStart));
    // The next thing is `<div className="space-y-4 opacity-50 cursor-not-allowed mt-6">` or `<form `
    // It is easier to just slice out from `<div className="space-y-4 opacity-50 cursor-not-allowed mt-6">` that contains "(Coming Soon)" until the next sibling or end of list.
}

