const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `      const selectedModelName = model || 'gemini-3.5-flash';
      const response = await ai.models.generateContent({
        model: selectedModelName,
        contents: session ? session.history : [{ role: 'user', parts: newParts }],
        config: {
          systemInstruction: \`You are VibeCoder, an expert Roblox Luau AI coding assistant.`;

const replStr = `      const selectedModelName = model || 'gemini-3.5-flash';

      // Orchestrator: Determine thinking config based on model selection strategy
      let thinkingConfig: any = undefined;
      if (selectedModelName.startsWith('gemini-3')) {
        let level = 'MEDIUM'; // Default for flash (standard code gen, agent loops)
        if (selectedModelName.includes('flash-lite')) level = 'MINIMAL'; // Lightweight / router
        if (selectedModelName.includes('pro')) level = 'HIGH'; // Deep reasoning
        thinkingConfig = { thinkingLevel: level };
      } else if (selectedModelName.startsWith('gemini-2.5')) {
        if (selectedModelName.includes('flash')) thinkingConfig = { thinkingBudget: 0 }; // Disable thinking
        if (selectedModelName.includes('pro')) thinkingConfig = { thinkingBudget: 4096 }; // Deep reasoning cap
      }

      const response = await ai.models.generateContent({
        model: selectedModelName,
        contents: session ? session.history : [{ role: 'user', parts: newParts }],
        config: {
          thinkingConfig,
          systemInstruction: \`You are VibeCoder, an expert Roblox Luau AI coding assistant.`;

if(code.includes("      const selectedModelName = model || 'gemini-3.5-flash';\n      const response = await ai.models.generateContent({")) {
    code = code.replace("      const selectedModelName = model || 'gemini-3.5-flash';\n      const response = await ai.models.generateContent({",
`      const selectedModelName = model || 'gemini-3.5-flash';

      // Orchestrator: Determine thinking config based on model selection strategy
      let thinkingConfig: any = undefined;
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
    console.log("Could not find string");
}
