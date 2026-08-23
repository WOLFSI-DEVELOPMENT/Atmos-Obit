const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// 1. Update imports
content = content.replace(
  "import { GEMINI_MODELS, ThinkingLevel } from '../types';",
  "import { GEMINI_MODELS, OPENAI_MODELS, ANTHROPIC_MODELS, ThinkingLevel } from '../types';"
);

// 2. Add state
const stateMarker = "const [apiKey, setApiKey] = useState('');";
content = content.replace(
  stateMarker,
  `const [apiKey, setApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [anthropicApiKey, setAnthropicApiKey] = useState('');`
);

// 3. Load from localStorage
const loadMarker = "setApiKey(localStorage.getItem('vibecoder_api_key') || '');";
content = content.replace(
  loadMarker,
  `setApiKey(localStorage.getItem('vibecoder_api_key') || '');
      setOpenaiApiKey(localStorage.getItem('vibecoder_openai_api_key') || '');
      setAnthropicApiKey(localStorage.getItem('vibecoder_anthropic_api_key') || '');`
);

// 4. Update handleSaveApiKey to handle others
const saveFn = `  const handleSaveApiKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem('vibecoder_api_key', val);
  };`;

const newSaveFn = `  const handleSaveApiKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem('vibecoder_api_key', val);
  };
  const handleSaveOpenaiApiKey = (val: string) => {
    setOpenaiApiKey(val);
    localStorage.setItem('vibecoder_openai_api_key', val);
  };
  const handleSaveAnthropicApiKey = (val: string) => {
    setAnthropicApiKey(val);
    localStorage.setItem('vibecoder_anthropic_api_key', val);
  };`;

if (content.includes(saveFn)) {
  content = content.replace(saveFn, newSaveFn);
} else {
    console.log("Could not find handleSaveApiKey");
}

// 5. Replace API key UI
const apiKeyUIStart = '<div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] overflow-hidden">\n                      <div className="p-4 border-b border-white/5">';
const apiKeyUIEnd = `                      <div className="p-4 border-b border-white/5 flex items-center justify-between">`;
const newApiKeyUI = `<div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] overflow-hidden">
                      <div className="p-4 border-b border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Google_Gemini_icon_2025.svg/960px-Google_Gemini_icon_2025.svg.png" className="w-4 h-4 object-contain" alt="Google Gemini" />
                            <span className="text-white text-sm font-medium">Gemini API Key</span>
                          </div>
                        </div>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => handleSaveApiKey(e.target.value)}
                          placeholder="AI Studio API Key"
                          className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                        />
                      </div>
                      
                      <div className="p-4 border-b border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1280px-ChatGPT-Logo.svg.png" className="w-4 h-4 object-contain invert opacity-80" alt="ChatGPT" />
                            <span className="text-white text-sm font-medium">OpenAI API Key</span>
                          </div>
                        </div>
                        <input
                          type="password"
                          value={openaiApiKey}
                          onChange={(e) => handleSaveOpenaiApiKey(e.target.value)}
                          placeholder="sk-..."
                          className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                        />
                      </div>

                      <div className="p-4 border-b border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/960px-Claude_AI_symbol.svg.png" className="w-4 h-4 object-contain" alt="Claude" />
                            <span className="text-white text-sm font-medium">Anthropic API Key</span>
                          </div>
                        </div>
                        <input
                          type="password"
                          value={anthropicApiKey}
                          onChange={(e) => handleSaveAnthropicApiKey(e.target.value)}
                          placeholder="sk-ant-..."
                          className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                        />
                      </div>

                      <div className="p-4 border-b border-white/5">
                        <p className="text-[#8e8e93] text-xs">
                          If provided, these keys will be used instead of the server default for their respective models.
                        </p>
                      </div>
`;
content = content.replace(apiKeyUIStart + '\n' + content.substring(content.indexOf(apiKeyUIStart) + apiKeyUIStart.length + 1, content.indexOf(apiKeyUIEnd)) , newApiKeyUI);

// Check if we replaced correctly
if (content.includes("Gemini API Key")) {
    console.log("Replaced API keys UI");
} else {
    console.log("Failed replacing API Keys UI");
}


fs.writeFileSync('src/components/SettingsModal.tsx', content);
