const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The previous patches didn't inject the logic because the exact string didn't match. Let's do a hard replace.
const lines = code.split('\n');
const insertIdx = lines.findIndex(l => l.includes("const response = await ai.models.generateContent({"));

if (insertIdx !== -1) {
    const logic = `
      // Orchestrator: Determine thinking config based on model selection strategy
      let thinkingConfig = undefined;
      if (selectedModelName.startsWith('gemini-3')) {
        let level = 'MEDIUM'; // Default for flash (standard code gen, agent loops)
        if (selectedModelName.includes('flash-lite')) level = 'MINIMAL'; // Lightweight / router
        if (selectedModelName.includes('pro')) level = 'HIGH'; // Deep reasoning
        thinkingConfig = { thinkingLevel: level };
      } else if (selectedModelName.startsWith('gemini-2.5')) {
        if (selectedModelName.includes('flash')) thinkingConfig = { thinkingBudget: 0 }; // Disable thinking
        if (selectedModelName.includes('pro')) thinkingConfig = { thinkingBudget: 4096 }; // Deep reasoning cap
      }`;
      
    lines.splice(insertIdx, 0, logic);
    fs.writeFileSync('server.ts', lines.join('\n'));
    console.log("Patched 4!");
} else {
    console.log("Could not find insert index.");
}
