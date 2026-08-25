import re

with open('src/components/HomeLayout.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
old_imports = "import { Project, GEMINI_MODELS } from '../types';"
new_imports = "import { Project, GEMINI_MODELS, OPENAI_MODELS, ANTHROPIC_MODELS } from '../types';"
content = content.replace(old_imports, new_imports)
content = content.replace(
    "import { Cloud, Search, Plus, Mic, MicOff, Folder, Code, Terminal, Upload, X, RefreshCw, Bug, Check, ChevronDown, Monitor, GitBranch, ArrowUp } from 'lucide-react';",
    "import { Cloud, Search, Plus, Mic, MicOff, Folder, Code, Terminal, Upload, X, RefreshCw, Bug, Check, ChevronDown, Monitor, GitBranch, ArrowUp, Zap, Sparkles, BrainCircuit } from 'lucide-react';"
)

# 2. Add state and refs for model dropdown
old_state = "  const [searchQuery, setSearchQuery] = useState('');"
new_state = """  const [searchQuery, setSearchQuery] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
"""
content = content.replace(old_state, new_state)

# 3. Add click outside handler for model dropdown
old_effect = """  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };"""
new_effect = """  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };"""
content = content.replace(old_effect, new_effect)

# 4. Find all models combined for name lookups
combined_models = "const allModels = [...GEMINI_MODELS, ...OPENAI_MODELS, ...ANTHROPIC_MODELS];"

# 5. Update the button and add dropdown UI
old_model_btn = """              <button className="flex items-center gap-1 text-[13px] text-[#888] hover:text-white transition-colors">
                {GEMINI_MODELS.find(m => m.id === selectedModel)?.name || '5.6 Luna Light'} <ChevronDown size={14} />
              </button>"""

new_model_btn = """              <div className="relative" ref={modelDropdownRef}>
                <button 
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-[#888] hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                >
                  {(() => {
                    const allModels = [...GEMINI_MODELS, ...OPENAI_MODELS, ...ANTHROPIC_MODELS];
                    const customModels = JSON.parse(localStorage.getItem('vibecoder_custom_models') || '[]');
                    const combined = [...allModels, ...customModels.map((m: any) => typeof m === 'string' ? { id: m, label: m } : m)];
                    const found = combined.find(m => m.id === selectedModel);
                    return found?.label || found?.name || 'Select Model';
                  })()}
                  <ChevronDown size={14} />
                </button>

                {isModelDropdownOpen && (
                  <div className="absolute bottom-[calc(100%+8px)] right-0 w-[280px] bg-[#222]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
                      
                      {/* Gemini Section */}
                      <div className="px-2 py-1.5 flex items-center gap-2">
                        <Zap size={14} className="text-blue-400" />
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Google Gemini</span>
                      </div>
                      {GEMINI_MODELS.map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            if (!localStorage.getItem('vibecoder_api_key')) {
                              alert("Please add your Gemini API Key in Settings first.");
                              return;
                            }
                            onModelChange(m.id);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-colors flex items-center justify-between ${selectedModel === m.id ? 'bg-[#333] text-white font-medium' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          {m.label}
                          {selectedModel === m.id && <Check size={14} className="text-white" />}
                        </button>
                      ))}
                      
                      <div className="my-1 border-t border-white/5"></div>

                      {/* Anthropic Section */}
                      <div className="px-2 py-1.5 flex items-center gap-2">
                        <Sparkles size={14} className="text-orange-400" />
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Anthropic Claude</span>
                      </div>
                      {ANTHROPIC_MODELS.map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            if (!localStorage.getItem('vibecoder_anthropic_api_key')) {
                              alert("Please add your Anthropic API Key in Settings first.");
                              return;
                            }
                            onModelChange(m.id);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-colors flex items-center justify-between ${selectedModel === m.id ? 'bg-[#333] text-white font-medium' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          {m.label}
                          {selectedModel === m.id && <Check size={14} className="text-white" />}
                        </button>
                      ))}

                      <div className="my-1 border-t border-white/5"></div>

                      {/* OpenAI Section */}
                      <div className="px-2 py-1.5 flex items-center gap-2">
                        <BrainCircuit size={14} className="text-green-400" />
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">OpenAI GPT</span>
                      </div>
                      {OPENAI_MODELS.map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            if (!localStorage.getItem('vibecoder_openai_api_key')) {
                              alert("Please add your OpenAI API Key in Settings first.");
                              return;
                            }
                            onModelChange(m.id);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-colors flex items-center justify-between ${selectedModel === m.id ? 'bg-[#333] text-white font-medium' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          {m.label}
                          {selectedModel === m.id && <Check size={14} className="text-white" />}
                        </button>
                      ))}

                    </div>
                  </div>
                )}
              </div>"""

content = content.replace(old_model_btn, new_model_btn)

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(content)
