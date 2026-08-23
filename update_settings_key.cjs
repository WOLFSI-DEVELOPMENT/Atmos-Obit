const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

const saveFn = `  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('vibecoder_api_key', key);
  };`;

const newSaveFn = `  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('vibecoder_api_key', key);
  };
  const handleSaveOpenaiApiKey = (key: string) => {
    setOpenaiApiKey(key);
    localStorage.setItem('vibecoder_openai_api_key', key);
  };
  const handleSaveAnthropicApiKey = (key: string) => {
    setAnthropicApiKey(key);
    localStorage.setItem('vibecoder_anthropic_api_key', key);
  };`;

content = content.replace(saveFn, newSaveFn);
fs.writeFileSync('src/components/SettingsModal.tsx', content);
