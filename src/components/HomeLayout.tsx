import React, { useState, useRef, useEffect } from 'react';
import { Cloud, Search, Plus, Mic, MicOff, Folder, Code, Terminal, Upload, X, RefreshCw, Bug, Check, ChevronDown, Monitor, GitBranch, ArrowUp, Zap, Sparkles, BrainCircuit, Gamepad2, Trophy, Coins, Sword } from 'lucide-react';
import { Project, GEMINI_MODELS, OPENAI_MODELS, ANTHROPIC_MODELS } from '../types';

interface HomeLayoutProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, file?: File | null) => Promise<string> | string;
  onSendMessage: (prompt: string, projectId: string | null) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  isListening: boolean;
  toggleSpeechRecognition: () => void;
  input: string;
  setInput: (val: string) => void;
  sendBtnColor: string;
}

export function HomeLayout({
  projects,
  onSelectProject,
  onCreateProject,
  onSendMessage,
  selectedModel,
  onModelChange,
  isListening,
  toggleSpeechRecognition,
  input,
  setInput,
  sendBtnColor
}: HomeLayoutProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHomeProjectId, setSelectedHomeProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [newProjName, setNewProjName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProject = projects.find(p => p.id === selectedHomeProjectId);

  const handleCreate = async () => {
    const newId = await onCreateProject(newProjName, selectedFile);
    if (newId) {
      setSelectedHomeProjectId(newId);
    }
    setIsCreateModalOpen(false);
    setNewProjName('');
    setSelectedFile(null);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input, selectedHomeProjectId);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 h-full w-full bg-[#181818]">
      
      {/* Hero Icon */}
      <div className="mb-6 relative">
        <img 
          src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787631653/Create_black_background_icon_202608242212_cmumn6.png" 
          alt="App Icon" 
          className="w-20 h-20 rounded-2xl object-cover shadow-lg"
          referrerPolicy="no-referrer"
        />
      </div>

      <h1 className="text-3xl font-semibold text-white mb-6 tracking-tight">
        {selectedProject ? (
          <>
            What should we build in{' '}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="underline decoration-dotted underline-offset-4 hover:text-blue-400 transition-colors"
            >
              {selectedProject.name}
            </button>
            ?
          </>
        ) : (
          'What should we build?'
        )}
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full max-w-4xl mb-12">
        <button onClick={() => setInput("Build an obby obstacle course with checkpoints")} className="bg-transparent border border-[#2a2a2a] hover:border-white/20 transition-colors p-3 rounded-2xl flex flex-col items-start gap-3 text-left group">
          <Trophy size={16} className="text-[#ff9f0a]" />
          <span className="text-[13px] font-medium text-white/90 group-hover:text-white">Build an obby course<br/>with checkpoints</span>
        </button>
        <button onClick={() => setInput("Create an idle tycoon game with custom plots")} className="bg-transparent border border-[#2a2a2a] hover:border-white/20 transition-colors p-3 rounded-2xl flex flex-col items-start gap-3 text-left group">
          <Coins size={16} className="text-[#30d158]" />
          <span className="text-[13px] font-medium text-white/90 group-hover:text-white">Create an idle tycoon<br/>game with plots</span>
        </button>
        <button onClick={() => setInput("Make a simulator game with pet hatching and eggs")} className="bg-transparent border border-[#2a2a2a] hover:border-white/20 transition-colors p-3 rounded-2xl flex flex-col items-start gap-3 text-left group">
          <Sparkles size={16} className="text-[#bf5af2]" />
          <span className="text-[13px] font-medium text-white/90 group-hover:text-white">Make a simulator with<br/>pet hatching</span>
        </button>
        <button onClick={() => setInput("Design a PvP sword fighting arena with leaderstats")} className="bg-transparent border border-[#2a2a2a] hover:border-white/20 transition-colors p-3 rounded-2xl flex flex-col items-start gap-3 text-left group">
          <Sword size={16} className="text-[#0a84ff]" />
          <span className="text-[13px] font-medium text-white/90 group-hover:text-white">Design a PvP sword<br/>fighting arena</span>
        </button>
      </div>

      {/* Input Box Area */}
      <div className="w-full max-w-4xl relative mt-12" ref={dropdownRef}>
        
        {/* Project Selector Tab (Wide Background) */}
        <div className="absolute -top-[51px] left-2 right-2 bg-[#1f1f1f] rounded-t-2xl pt-3.5 px-4 pb-5 flex items-center justify-between z-0 shadow-lg">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white transition-colors"
          >
            <Folder size={14} className="text-white/60 mr-0.5" />
            {selectedProject ? `Change project | ${selectedProject.name}` : 'Choose project'}
            <ChevronDown size={14} className="text-white/40 ml-0.5" />
          </button>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-connect-modal'));
            }}
            className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg"
          >
            <Cloud size={14} className="text-white/60" />
            Connect
          </button>
        </div>

        {/* The Input Box */}
        <div data-squircle data-squircle-radius="24" data-squircle-smoothing="1" className="w-full bg-[#2a2a2a] rounded-2xl p-4 flex flex-col min-h-[120px] shadow-lg relative z-10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Do anything"
            className="w-full flex-1 min-h-[40px] bg-transparent text-white px-2 py-1 text-[15px] focus:outline-none placeholder-neutral-400 resize-none font-medium flex items-center transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 px-2 text-[#888]">
              <button className="hover:text-white transition-colors" title="Add attachment">
                <Plus size={18} />
              </button>

            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative" ref={modelDropdownRef}>
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
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Google_Gemini_icon_2025.svg/960px-Google_Gemini_icon_2025.svg.png" className="w-4 h-4 object-contain" alt="Google Gemini" />
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
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/960px-Claude_AI_symbol.svg.png" className="w-4 h-4 object-contain" alt="Claude" />
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
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1280px-ChatGPT-Logo.svg.png" className="w-4 h-4 object-contain invert opacity-80" alt="ChatGPT" />
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
              </div>
              <button 
                type="button"
                onClick={toggleSpeechRecognition}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${isListening ? 'bg-white text-black animate-bounce' : 'text-[#888] hover:text-white'}`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-white hover:scale-105' : 'bg-[#3a3a3c] opacity-50'}`}
              >
                <ArrowUp size={16} className={input.trim() ? 'text-black' : 'text-white'} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute -top-1 left-4 w-[220px] bg-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-2 fade-in duration-200 border border-white/10">
              <div className="p-1.5 flex items-center gap-2 px-2.5 pb-1">
                <Search size={14} className="text-[#888]" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects" 
                  className="bg-transparent border-none outline-none text-[13px] text-white placeholder-[#888] flex-1 py-1"
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto px-1.5 pb-1.5">
                {filteredProjects.length === 0 ? (
                  <div className="px-2.5 py-2 text-[13px] text-[#888] text-center">No projects found</div>
                ) : (
                  filteredProjects.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => {
                        setSelectedHomeProjectId(p.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 hover:bg-[#333] text-white/90 text-[13px] transition-colors rounded-lg my-0.5"
                    >
                      <Folder size={14} className="text-white/50" />
                      {p.name}
                    </button>
                  ))
                )}
              </div>
              <div className="p-1.5 pt-0">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 hover:bg-[#333] text-white/90 text-[13px] transition-colors rounded-lg"
                >
                  <Plus size={14} className="text-white/50" />
                  New project
                </button>
              </div>
            </div>
          )}

      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1c1c1c] w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
              <h2 className="text-[18px] font-semibold text-white">Create project</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#888] hover:text-white transition-colors p-1 rounded-md">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-xl px-4 py-3">
                <Folder size={18} className="text-[#888]" />
                <input 
                  type="text" 
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="Project name"
                  autoFocus
                  className="bg-transparent border-none outline-none flex-1 text-[15px] text-white placeholder-[#666]"
                />
              </div>

              <div className="space-y-3">
                <span className="text-[14px] font-medium text-white">Source folders</span>
                <div 
                  className="w-full border border-dashed border-white/20 rounded-xl bg-[#111] hover:bg-[#161616] hover:border-white/40 transition-colors cursor-pointer flex flex-col items-center justify-center py-10 gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={24} className="text-[#888]" />
                  <span className="text-[14px] font-medium text-white/70">Add folders AI can read and edit</span>
                  {selectedFile && <span className="text-[12px] text-[#0a84ff] mt-2 font-medium">{selectedFile.name}</span>}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
                    className="hidden" 
                    accept=".zip"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3 bg-[#111]">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-lg text-[14px] font-medium text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={!newProjName.trim()}
                className="px-4 py-2 rounded-lg text-[14px] font-medium bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                Create project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
