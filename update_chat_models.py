import re

with open('src/components/ChatPanel.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
old_imports = "import { Project, Message, GEMINI_MODELS } from '../types';"
new_imports = "import { Project, Message, GEMINI_MODELS, OPENAI_MODELS, ANTHROPIC_MODELS } from '../types';"
content = content.replace(old_imports, new_imports)

content = content.replace(
    "import { X, Mic, MicOff, Folder, FileCode, Search, MessageSquare, Terminal, Eye, Code, Map, Settings, Trash2, ArrowUpRight, Copy, Check, Plus, Paperclip, ChevronDown, Download, Layers, Play, Bug, Wrench, Package, Cpu, Wand2, ArrowRight, Server, Cloud, Zap, BrainCircuit, Activity, Clock, FileJson, CornerDownRight } from 'lucide-react';",
    "import { X, Mic, MicOff, Folder, FileCode, Search, MessageSquare, Terminal, Eye, Code, Map, Settings, Trash2, ArrowUpRight, Copy, Check, Plus, Paperclip, ChevronDown, Download, Layers, Play, Bug, Wrench, Package, Cpu, Wand2, ArrowRight, Server, Cloud, Zap, BrainCircuit, Activity, Clock, FileJson, CornerDownRight, Sparkles } from 'lucide-react';"
)

# 2. Update the model dropdown logic
# We need to find the existing chat model dropdown in the top bar
old_dropdown_ui = """                {/* Active Model Select Dropdown */}
                {isModelDropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-[200px] bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-1 flex flex-col">
                      {GEMINI_MODELS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedModel(m.id);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-colors flex items-center justify-between ${
                            selectedModel === m.id
                              ? 'bg-white/10 text-white'
                              : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {m.name}
                          {selectedModel === m.id && <Check size={12} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}"""

new_dropdown_ui = """                {/* Active Model Select Dropdown */}
                {isModelDropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-[280px] bg-[#222]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-2 fade-in duration-200">
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
                            setSelectedModel(m.id);
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
                            setSelectedModel(m.id);
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
                            setSelectedModel(m.id);
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
                )}"""

content = content.replace(old_dropdown_ui, new_dropdown_ui)

# Update model button text rendering
old_model_btn_text = """<span className="max-w-[80px] truncate text-left font-medium">
                  {GEMINI_MODELS.find((m) => m.id === selectedModel)?.name || selectedModel || 'Select Model'}
                </span>"""

new_model_btn_text = """<span className="max-w-[120px] truncate text-left font-medium">
                  {(() => {
                    const allModels = [...GEMINI_MODELS, ...OPENAI_MODELS, ...ANTHROPIC_MODELS];
                    const customModels = JSON.parse(localStorage.getItem('vibecoder_custom_models') || '[]');
                    const combined = [...allModels, ...customModels.map((m: any) => typeof m === 'string' ? { id: m, label: m } : m)];
                    const found = combined.find(m => m.id === selectedModel);
                    return found?.label || found?.name || selectedModel || 'Select Model';
                  })()}
                </span>"""

content = content.replace(old_model_btn_text, new_model_btn_text)

with open('src/components/ChatPanel.tsx', 'w') as f:
    f.write(content)
