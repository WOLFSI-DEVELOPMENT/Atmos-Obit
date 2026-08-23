const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if(code.includes("      const selectedModelName = model || 'gemini-3.5-flash';\n      const response = await ai.models.generateContent({")) {
    code = code.replace("      const selectedModelName = model || 'gemini-3.5-flash';\n      const response = await ai.models.generateContent({",
`      const selectedModelName = model || 'gemini-3.5-flash';

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
      }

      const response = await ai.models.generateContent({`);
      
    code = code.replace("        config: {\n          systemInstruction: `You are VibeCoder", "        config: {\n          thinkingConfig,\n          systemInstruction: `You are VibeCoder");
    
    fs.writeFileSync('server.ts', code);
    console.log("Patched successfully");
} else {
    console.log("Could not find exact string. Showing file contents around line 160:");
    console.log(code.split('\n').slice(155, 170).join('\n'));
}
