const fs = require('fs');
let content = fs.readFileSync('src/components/ChatPanel.tsx', 'utf8');

const target = `const apiKey = customModelConfig?.apiKey || globalApiKey;
      const baseUrl = customModelConfig?.baseUrl || undefined;`;

const replacement = `let globalApiKey = localStorage.getItem('vibecoder_api_key') || '';
      let apiKey = customModelConfig?.apiKey || globalApiKey;
      let baseUrl = customModelConfig?.baseUrl || undefined;
      
      if (!customModelConfig) {
          if (selectedModel.startsWith('gpt-')) {
              apiKey = localStorage.getItem('vibecoder_openai_api_key') || '';
              baseUrl = "https://api.openai.com/v1";
          } else if (selectedModel.startsWith('claude-')) {
              apiKey = localStorage.getItem('vibecoder_anthropic_api_key') || '';
              baseUrl = "https://api.anthropic.com";
          }
      }`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/components/ChatPanel.tsx', content);
    console.log("patched chat panel");
} else {
    console.log("target not found");
}
