import React, { useState, useEffect } from 'react';
import { X, User, Palette, Sparkles, Search, ChevronLeft, ChevronRight, LogOut, ChevronDown, Key, Shield, MessageSquare , FlaskConical} from 'lucide-react';
import { GEMINI_MODELS, OPENAI_MODELS, ANTHROPIC_MODELS, ThinkingLevel } from '../types';
import { AnimatePresence, motion } from 'framer-motion';


const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  className = ""
}: { 
  value: string, 
  onChange: (v: string) => void, 
  options: { label: string, value: string }[], 
  className?: string
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-[#1c1c1e]/60 backdrop-blur-xl border border-[#2a2a2a] text-white text-xs rounded-full px-3 py-1.5 focus:outline-none transition-colors hover:bg-[#2c2c2e]/80"
      >
        <span className="truncate mr-3">{selectedOption?.label}</span>
        <ChevronDown size={14} className={`text-[#8e8e93] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 min-w-full sm:min-w-[160px] bg-[#1a1a1c]/80 backdrop-blur-xl border border-[#2a2a2a] p-1.5 rounded-2xl shadow-2xl flex flex-col gap-1"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`text-left px-3 py-2 text-xs rounded-xl transition-all ${value === opt.value ? 'bg-[#3a3a3c] text-white font-medium shadow-sm' : 'text-[#8e8e93] hover:bg-[#2c2c2e] hover:text-white'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function SettingsModal({ isOpen, onClose, user, onLogout, selectedModel, onModelChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'personalize' | 'behavior' | 'ai' | 'permissions' | 'experiments'>('account');
  const [activeSubView, setActiveSubView] = useState<'main' | 'models'>('main');

  const [apiKey, setApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [anthropicApiKey, setAnthropicApiKey] = useState('');
  const [thinkingLevels, setThinkingLevels] = useState<Record<string, ThinkingLevel>>({});
  
  const [allowToolbox, setAllowToolbox] = useState(true);
  const [allowIconGen, setAllowIconGen] = useState(true);
  const [assetPreference, setAssetPreference] = useState<'custom' | 'toolbox'>('toolbox');

  const [responseTone, setResponseTone] = useState('default');
  const [guiStyle, setGuiStyle] = useState('default');
  
  const [sendButtonColor, setSendButtonColor] = useState('#ffffff');
  const [sendButton3D, setSendButton3D] = useState(false);
  const [aiFontFamily, setAiFontFamily] = useState('default');
  const [useAstPatching, setUseAstPatching] = useState(false);
  const [enableWikimediaExperiment, setEnableWikimediaExperiment] = useState(false);
  const [allowWikimedia, setAllowWikimedia] = useState(false);
  const [customModels, setCustomModels] = useState<any[]>([]);
  const [newCustomModel, setNewCustomModel] = useState('');
  const [newCustomModelBaseUrl, setNewCustomModelBaseUrl] = useState('');
  const [newCustomModelApiKey, setNewCustomModelApiKey] = useState('');
  const [orchestratorEnabled, setOrchestratorEnabled] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('vibecoder_api_key') || '');
      setOpenaiApiKey(localStorage.getItem('vibecoder_openai_api_key') || '');
      setAnthropicApiKey(localStorage.getItem('vibecoder_anthropic_api_key') || '');
      setAllowToolbox(localStorage.getItem('vibecoder_allow_toolbox') !== 'false');
      setAllowIconGen(localStorage.getItem('vibecoder_allow_icongen') !== 'false');
      setAssetPreference((localStorage.getItem('vibecoder_asset_preference') as 'custom' | 'toolbox') || 'toolbox');
      setResponseTone(localStorage.getItem('vibecoder_response_tone') || 'default');
      setGuiStyle(localStorage.getItem('vibecoder_gui_style') || 'default');
      setSendButtonColor(localStorage.getItem('vibecoder_send_btn_color') || '#ffffff');
      setSendButton3D(localStorage.getItem('vibecoder_send_btn_3d') === 'true');
      setAiFontFamily(localStorage.getItem('vibecoder_ai_font') || 'default');
      setOrchestratorEnabled(localStorage.getItem('vibecoder_orchestrator_enabled') !== 'false');
      try {
        const levels = JSON.parse(localStorage.getItem('vibecoder_thinking_levels') || '{}');
        setThinkingLevels(levels);
      } catch (e) {
        setThinkingLevels({});
      }
      try {
        const models = JSON.parse(localStorage.getItem('vibecoder_custom_models') || '[]');
        setCustomModels(models);
      } catch (e) {
        setCustomModels([]);
      }
    }
  }, [isOpen]);

  const handleAddCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomModel.trim()) return;
    const modelId = newCustomModel.trim();
    if (customModels.find(m => (typeof m === 'string' ? m : m.id) === modelId)) return;
    
    const newModel = {
      id: modelId,
      baseUrl: newCustomModelBaseUrl.trim() || undefined,
      apiKey: newCustomModelApiKey.trim() || undefined
    };
    
    const updated = [...customModels, newModel];
    setCustomModels(updated);
    localStorage.setItem('vibecoder_custom_models', JSON.stringify(updated));
    setNewCustomModel('');
    setNewCustomModelBaseUrl('');
    setNewCustomModelApiKey('');
  };

  const handleRemoveCustomModel = (modelId: string) => {
    const updated = customModels.filter(m => (typeof m === 'string' ? m : m.id) !== modelId);
    setCustomModels(updated);
    localStorage.setItem('vibecoder_custom_models', JSON.stringify(updated));
    if (selectedModel === modelId) {
      onModelChange(GEMINI_MODELS[0].id);
    }
  };

  const handleToggleOrchestrator = () => {
    const newVal = !orchestratorEnabled;
    setOrchestratorEnabled(newVal);
    localStorage.setItem('vibecoder_orchestrator_enabled', newVal.toString());
  };

  const handleSaveApiKey = (key: string) => {
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
  };

  const handleSelectModel = (modelId: string) => {
    onModelChange(modelId);
    localStorage.setItem('vibecoder_selected_model', modelId);
  };

  const handleSetThinkingLevel = (modelId: string, level: ThinkingLevel) => {
    const newLevels = { ...thinkingLevels, [modelId]: level };
    setThinkingLevels(newLevels);
    localStorage.setItem('vibecoder_thinking_levels', JSON.stringify(newLevels));
  };

  const handleToggleToolbox = () => {
    const newVal = !allowToolbox;
    setAllowToolbox(newVal);
    localStorage.setItem('vibecoder_allow_toolbox', newVal.toString());
  };

  const handleToggleIconGen = () => {
    const newVal = !allowIconGen;
    setAllowIconGen(newVal);
    localStorage.setItem('vibecoder_allow_icongen', newVal.toString());
  };

  const handleSetAssetPreference = (pref: 'custom' | 'toolbox') => {
    setAssetPreference(pref);
    localStorage.setItem('vibecoder_asset_preference', pref);
  };

  const handleSetTone = (val: string) => {
    setResponseTone(val);
    localStorage.setItem('vibecoder_response_tone', val);
  };

  const handleSetGuiStyle = (val: string) => {
    setGuiStyle(val);
    localStorage.setItem('vibecoder_gui_style', val);
  };

  const handleSetSendButtonColor = (val: string) => {
    setSendButtonColor(val);
    localStorage.setItem('vibecoder_send_btn_color', val);
  };

  const handleSetSendButton3D = (val: boolean) => {
    setSendButton3D(val);
    localStorage.setItem('vibecoder_send_btn_3d', val.toString());
  };

  
  const handleToggleAstPatching = () => {
    const newVal = !useAstPatching;
    setUseAstPatching(newVal);
    localStorage.setItem('vibecoder_use_ast_patching', newVal.toString());
  };

  const handleToggleWikimediaExperiment = () => {
    const newVal = !enableWikimediaExperiment;
    setEnableWikimediaExperiment(newVal);
    localStorage.setItem('vibecoder_exp_wikimedia', newVal.toString());
  };

  const handleToggleWikimedia = () => {
    const newVal = !allowWikimedia;
    setAllowWikimedia(newVal);
    localStorage.setItem('vibecoder_allow_wikimedia', newVal.toString());
  };

  const handleSetAiFontFamily = (val: string) => {
    setAiFontFamily(val);
    localStorage.setItem('vibecoder_ai_font', val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="w-[800px] h-[550px] bg-[#1c1c1e] rounded-3xl [corner-shape:superellipse(1.82)] flex overflow-hidden shadow-2xl border border-white/10">
        
        {/* Sidebar */}
        <div className="w-[240px] bg-[#1c1c1e]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col pt-3 pb-3 relative z-10">
          <div className="px-4 mb-4 flex items-center gap-2">
            <div className="flex gap-2 mb-4 mt-1">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center group">
                 <X size={8} className="text-black opacity-0 group-hover:opacity-100" />
              </button>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
          </div>
          
          <div className="px-3 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1.5 w-4 h-4 text-[#8e8e93]" />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-[#2c2c2e] text-white text-sm rounded-full pl-8 pr-3 py-1.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="px-2 flex-1 overflow-y-auto">
            <div 
              onClick={() => { setActiveTab('account'); setActiveSubView('main'); }}
              className={`flex items-center gap-3 px-2 py-2 mb-4 rounded-lg cursor-pointer ${activeTab === 'account' ? 'bg-[#2c2c2e] text-white' : 'hover:bg-[#2c2c2e] text-white'}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#3a3a3c] flex items-center justify-center shrink-0">
                <span className="text-lg font-medium text-white">
                  {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium truncate">{user?.name || 'User'}</span>
                <span className={`text-xs truncate ${activeTab === 'account' ? 'text-white/80' : 'text-[#8e8e93]'}`}>Account</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <button 
                onClick={() => { setActiveTab('personalize'); setActiveSubView('main'); }}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  activeTab === 'personalize' 
                    ? 'bg-[#2c2c2e] text-white' 
                    : 'text-white hover:bg-[#2c2c2e]'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${activeTab === 'personalize' ? 'bg-white/20' : 'bg-[#3a3a3c]'}`}>
                  <Palette size={14} className="text-white" />
                </div>
                Appearance
              </button>
              
              <button 
                onClick={() => { setActiveTab('behavior'); setActiveSubView('main'); }}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  activeTab === 'behavior' 
                    ? 'bg-[#2c2c2e] text-white' 
                    : 'text-white hover:bg-[#2c2c2e]'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${activeTab === 'behavior' ? 'bg-white/20' : 'bg-[#3a3a3c]'}`}>
                  <MessageSquare size={14} className="text-white" />
                </div>
                Personalize
              </button>

              <button 
                onClick={() => { setActiveTab('ai'); setActiveSubView('main'); }}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  activeTab === 'ai' 
                    ? 'bg-[#2c2c2e] text-white' 
                    : 'text-white hover:bg-[#2c2c2e]'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${activeTab === 'ai' ? 'bg-white/20' : 'bg-[#3a3a3c]'}`}>
                  <Sparkles size={14} className="text-white" />
                </div>
                AI Settings
              </button>

              <button 
                onClick={() => { setActiveTab('permissions'); setActiveSubView('main'); }}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  activeTab === 'permissions' 
                    ? 'bg-[#2c2c2e] text-white' 
                    : 'text-white hover:bg-[#2c2c2e]'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${activeTab === 'permissions' ? 'bg-white/20' : 'bg-[#3a3a3c]'}`}>
                  <Shield size={14} className="text-white" />
                </div>
                Permissions
              </button>
              <button 
                onClick={() => { setActiveTab('experiments'); setActiveSubView('main'); }}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  activeTab === 'experiments' 
                    ? 'bg-[#2c2c2e] text-white' 
                    : 'text-white hover:bg-[#2c2c2e]'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${activeTab === 'experiments' ? 'bg-white/20' : 'bg-[#3a3a3c]'}`}>
                  <FlaskConical size={14} className="text-white" />
                </div>
                Experiments
              </button>

            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-[#1c1c1e] relative overflow-hidden">
          {/* Header */}
          <div className="h-[52px] border-b border-white/5 flex items-center px-4 shrink-0 relative z-10 bg-[#1c1c1e]">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (activeSubView === 'models') setActiveSubView('main');
                }}
                disabled={activeSubView === 'main'}
                className={`p-1 rounded ${activeSubView === 'models' ? 'text-white hover:bg-white/10' : 'text-[#48484a]'}`}
              >
                <ChevronLeft size={20} />
              </button>
              <button className="p-1 rounded text-[#48484a]" disabled>
                <ChevronRight size={20} />
              </button>
            </div>
            <h2 className="ml-4 font-semibold text-white">
              {activeTab === 'account' && 'Account'}
              {activeTab === 'personalize' && 'Appearance'}
              {activeTab === 'ai' && activeSubView === 'main' && 'AI Settings'}
              {activeTab === 'ai' && activeSubView === 'models' && 'Default Model'}
              {activeTab === 'permissions' && 'Permissions'}
              {activeTab === 'experiments' && 'Experiments'}
            </h2>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto relative">
            <AnimatePresence initial={false} mode="wait">
              {activeTab === 'account' && (
                <motion.div 
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 max-w-xl mx-auto space-y-6"
                >
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#3a3a3c] flex items-center justify-center mb-4 relative group cursor-pointer">
                      <span className="text-4xl font-medium text-white">
                        {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                      </span>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-xs text-white font-medium">Edit</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-medium text-white">{user?.name || 'User'}</h3>
                    <p className="text-[#8e8e93]">{user?.email}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium pl-1">Profile Information</h3>
                      <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-[#8e8e93]">Display Name</label>
                          <input 
                            type="text" 
                            defaultValue={user?.name || 'User'} 
                            className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-[#8e8e93]">Email Address</label>
                          <input 
                            type="email" 
                            defaultValue={user?.email || ''}
                            className="w-full bg-[#1c1c1e] text-[#8e8e93] text-sm rounded-full px-4 py-2.5 focus:outline-none cursor-not-allowed"
                            disabled
                          />
                          <p className="text-[10px] text-[#8e8e93]">Email cannot be changed directly.</p>
                        </div>
                        <button className="w-fit bg-[#0a84ff] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#007aff] transition-colors mt-2">
                          Save Changes
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium pl-1">Security</h3>
                      <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-[#8e8e93]">New Password</label>
                          <input 
                            type="password" 
                            placeholder="Enter new password"
                            className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-[#8e8e93]">Confirm Password</label>
                          <input 
                            type="password" 
                            placeholder="Confirm new password"
                            className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                          />
                        </div>
                        <button className="w-fit bg-[#3a3a3c] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#48484a] transition-colors mt-2">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium pl-1">Danger Zone</h3>
                      <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">Delete Account</span>
                          <span className="text-[#8e8e93] text-xs">Permanently remove your account and all data.</span>
                        </div>
                        <button className="bg-[#ff3b30]/10 text-[#ff3b30] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ff3b30]/20 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-white/5">
                    <button 
                      onClick={onLogout}
                      className="w-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#ff453a] font-medium py-3 rounded-xl transition-colors text-center"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'personalize' && (
                <motion.div 
                  key="personalize"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 max-w-xl mx-auto space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium pl-1">Appearance</h3>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-6 flex justify-center gap-10">
                      <div className="flex flex-col items-center gap-2 cursor-pointer">
                        <div className="w-[88px] h-[64px] rounded-lg border border-white/10 bg-[#2c2c2e] relative overflow-hidden flex flex-col">
                          <div className="h-6 w-full bg-[#3c3c3e]/50 border-b border-white/10" />
                          <div className="flex-1 flex gap-1 p-2">
                            <div className="w-1/3 bg-white/20 rounded-sm" />
                            <div className="w-2/3 bg-white/10 rounded-sm" />
                          </div>
                        </div>
                        <span className="text-xs text-white">Auto</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 cursor-pointer opacity-50">
                        <div className="w-[88px] h-[64px] rounded-lg border border-white/10 bg-[#f0f0f0] relative overflow-hidden flex flex-col">
                          <div className="h-6 w-full bg-black/5 border-b border-black/10" />
                          <div className="flex-1 flex gap-1 p-2">
                            <div className="w-1/3 bg-black/20 rounded-sm" />
                            <div className="w-2/3 bg-black/10 rounded-sm" />
                          </div>
                        </div>
                        <span className="text-xs text-white">Light</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 cursor-pointer">
                        <div className="w-[88px] h-[64px] rounded-lg border-2 border-[#0a84ff] bg-[#0a0a0a] relative overflow-hidden flex flex-col">
                          <div className="h-6 w-full bg-[#2c2c2e]/50 border-b border-white/10" />
                          <div className="flex-1 flex gap-1 p-2">
                            <div className="w-1/3 bg-[#3a3a3c] rounded-sm" />
                            <div className="w-2/3 bg-[#2c2c2e] rounded-sm" />
                          </div>
                        </div>
                        <span className="text-xs text-white font-medium">Dark</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium pl-1">Theme</h3>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-white text-sm font-medium">Send Button Color</span>
                        <div className="flex flex-wrap gap-3">
                          {['#ffffff', '#b0b0b0', '#0a84ff', '#5e5ce6', '#ff375f', '#ff9f0a', '#32ade6', '#30d158'].map(color => (
                            <button
                              key={color}
                              onClick={() => handleSetSendButtonColor(color)}
                              className={`w-6 h-6 rounded-full transition-all ${sendButtonColor === color ? 'ring-2 ring-white scale-110 ring-offset-2 ring-offset-[#2c2c2e]' : 'hover:scale-110'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">3D Send Button</span>
                          <span className="text-[#8e8e93] text-xs">Add a playful 3D pop effect</span>
                        </div>
                        <button
                          onClick={() => handleSetSendButton3D(!sendButton3D)}
                          className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${sendButton3D ? 'bg-[#30d158]' : 'bg-[#3a3a3c]'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${sendButton3D ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                        <span className="text-white text-sm font-medium">AI Response Font</span>
                        <CustomSelect 
                          value={aiFontFamily}
                          onChange={handleSetAiFontFamily}
                          className="w-full mt-2"
                          options={[
                            { value: 'default', label: 'Default (System Sans)' },
                            { value: 'mono', label: 'Monospace (Code)' },
                            { value: 'serif', label: 'Serif (Elegant)' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'behavior' && (
                <motion.div 
                  key="behavior"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 max-w-xl mx-auto space-y-6"
                >
                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4">
                    <h3 className="text-white font-medium mb-1">Response Tone</h3>
                    <p className="text-[#8e8e93] text-xs mb-4">How should VibeCoder talk to you?</p>
                    
                    <CustomSelect 
                      value={responseTone}
                      onChange={handleSetTone}
                      className="w-full"
                      options={[
                        { value: 'default', label: 'Let AI Decide (Default)' },
                        { value: 'concise', label: 'Ultra Concise' },
                        { value: 'friendly', label: 'Friendly & Explanatory' },
                        { value: 'professional', label: 'Strictly Professional' },
                        { value: 'pirate', label: 'Pirate (Yarrr)' }
                      ]}
                    />
                  </div>

                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4">
                    <h3 className="text-white font-medium mb-1">GUI Style Preference</h3>
                    <p className="text-[#8e8e93] text-xs mb-4">When VibeCoder generates UI, what style should it use?</p>
                    
                    <CustomSelect 
                      value={guiStyle}
                      onChange={handleSetGuiStyle}
                      className="w-full"
                      options={[
                        { value: 'default', label: 'Let AI Decide (Based on prompt)' },
                        { value: 'flat', label: 'Flat / Minimalist' },
                        { value: 'cartoon', label: 'Cartoon / Simulator' },
                        { value: 'scifi', label: 'Sci-Fi / Futuristic' },
                        { value: 'retro', label: 'Retro / Pixel Art' }
                      ]}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'ai' && activeSubView === 'main' && (
                <motion.div 
                  key="ai-main"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 max-w-xl mx-auto space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium pl-1">Configuration</h3>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)]">
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
                      <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">AI Orchestrator</span>
                          <span className="text-[#8e8e93] text-xs mt-0.5">Auto-select the best AI model based on the request</span>
                        </div>
                        <button
                          onClick={handleToggleOrchestrator}
                          className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${orchestratorEnabled ? 'bg-[#30d158]' : 'bg-[#3a3a3c]'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${orchestratorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      <div 
                        onClick={() => setActiveSubView('models')}
                        className="px-4 py-4 flex justify-between items-center cursor-pointer hover:bg-[#3a3a3c]"
                      >
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">Default Model</span>
                          <span className="text-[#8e8e93] text-xs mt-0.5">Select model and thinking levels</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8e8e93]">
                          <span className="text-sm">{GEMINI_MODELS.find(m => m.id === selectedModel)?.label || selectedModel}</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ai' && activeSubView === 'models' && (
                <motion.div 
                  key="ai-models"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 max-w-2xl mx-auto space-y-6"
                >
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 ml-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Google_Gemini_icon_2025.svg/960px-Google_Gemini_icon_2025.svg.png" className="w-5 h-5 object-contain" alt="Google Gemini" />
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium">Google Gemini</h3>
                    </div>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)]">
                      {GEMINI_MODELS.map((model, idx) => {
                        const isSelected = model.id === selectedModel;
                        const currentLevel = thinkingLevels[model.id] || model.defaultLevel;

                        return (
                          <div key={model.id} className={`p-4 ${idx !== GEMINI_MODELS.length - 1 ? 'border-b border-white/5' : ''} ${isSelected ? 'bg-white/5' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 cursor-pointer" onClick={() => handleSelectModel(model.id)}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#0a84ff]' : 'border-[#8e8e93]'}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#0a84ff]" />}
                                  </div>
                                  <span className="text-white text-sm font-medium">{model.label}</span>
                                </div>
                                <p className="text-[#8e8e93] text-xs mt-1 ml-7">{model.desc}</p>
                              </div>
                              
                              <div className="shrink-0 pt-1">
                                <CustomSelect 
                                  value={currentLevel}
                                  onChange={(val) => handleSetThinkingLevel(model.id, val as ThinkingLevel)}
                                  options={model.supportedLevels.map(level => ({ value: level, label: level }))}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                                    <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 ml-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1280px-ChatGPT-Logo.svg.png" className="w-5 h-5 object-contain invert opacity-80" alt="ChatGPT" />
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium">OpenAI</h3>
                    </div>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)]">
                      {OPENAI_MODELS.map((model, idx) => {
                        const isSelected = model.id === selectedModel;
                        const currentLevel = thinkingLevels[model.id] || model.defaultLevel;

                        return (
                          <div key={model.id} className={`p-4 ${idx !== OPENAI_MODELS.length - 1 ? 'border-b border-white/5' : ''} ${isSelected ? 'bg-white/5' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 cursor-pointer" onClick={() => handleSelectModel(model.id)}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#0a84ff]' : 'border-[#8e8e93]'}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#0a84ff]" />}
                                  </div>
                                  <span className="text-white text-sm font-medium">{model.label}</span>
                                </div>
                                <p className="text-[#8e8e93] text-xs mt-1 ml-7">{model.desc}</p>
                              </div>
                              
                              <div className="shrink-0 pt-1">
                                <CustomSelect 
                                  value={currentLevel}
                                  onChange={(val) => handleSetThinkingLevel(model.id, val as ThinkingLevel)}
                                  options={model.supportedLevels.map(level => ({ value: level, label: level }))}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 ml-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/960px-Claude_AI_symbol.svg.png" className="w-5 h-5 object-contain" alt="Claude" />
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium">Anthropic</h3>
                    </div>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)]">
                      {ANTHROPIC_MODELS.map((model, idx) => {
                        const isSelected = model.id === selectedModel;
                        const currentLevel = thinkingLevels[model.id] || model.defaultLevel;

                        return (
                          <div key={model.id} className={`p-4 ${idx !== ANTHROPIC_MODELS.length - 1 ? 'border-b border-white/5' : ''} ${isSelected ? 'bg-white/5' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 cursor-pointer" onClick={() => handleSelectModel(model.id)}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#0a84ff]' : 'border-[#8e8e93]'}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#0a84ff]" />}
                                  </div>
                                  <span className="text-white text-sm font-medium">{model.label}</span>
                                </div>
                                <p className="text-[#8e8e93] text-xs mt-1 ml-7">{model.desc}</p>
                              </div>
                              
                              <div className="shrink-0 pt-1">
                                <CustomSelect 
                                  value={currentLevel}
                                  onChange={(val) => handleSetThinkingLevel(model.id, val as ThinkingLevel)}
                                  options={model.supportedLevels.map(level => ({ value: level, label: level }))}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] mt-6">
                    <div className="p-4 border-b border-white/5">
                      <h3 className="text-white text-sm font-medium mb-1">Custom Models</h3>
                      <p className="text-[#8e8e93] text-xs">Add custom endpoints, tuned models, or other Gemini models.</p>
                      
                      <form onSubmit={handleAddCustomModel} className="flex flex-col gap-3 mt-4">
                        <div className="space-y-1">
                          <label className="text-xs text-[#8e8e93]">Model ID (Required)</label>
                          <input 
                            type="text"
                            value={newCustomModel}
                            onChange={(e) => setNewCustomModel(e.target.value)}
                            placeholder="e.g. tunedModels/my-model-123 or gemini-1.5-pro"
                            className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-[#8e8e93]">Base URL (Optional)</label>
                          <input 
                            type="text"
                            value={newCustomModelBaseUrl}
                            onChange={(e) => setNewCustomModelBaseUrl(e.target.value)}
                            placeholder="e.g. https://api.openai.com/v1"
                            className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-[#8e8e93]">API Key (Optional override)</label>
                          <input 
                            type="password"
                            value={newCustomModelApiKey}
                            onChange={(e) => setNewCustomModelApiKey(e.target.value)}
                            placeholder="sk-..."
                            className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={!newCustomModel.trim()}
                          className="bg-[#0a84ff] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#007aff] transition-colors mt-2"
                        >
                          Add Custom Model
                        </button>
                      </form>
                    </div>

                    {customModels.map((modelObj, idx) => {
                      const id = typeof modelObj === 'string' ? modelObj : modelObj.id;
                      const baseUrl = typeof modelObj === 'string' ? undefined : modelObj.baseUrl;
                      const isSelected = id === selectedModel;
                      const currentLevel = thinkingLevels[id] || 'MEDIUM';
                      
                      return (
                        <div key={id} className={`p-4 ${idx !== customModels.length - 1 ? 'border-b border-white/5' : ''} ${isSelected ? 'bg-white/5' : ''}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 cursor-pointer" onClick={() => handleSelectModel(id)}>
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#0a84ff]' : 'border-[#8e8e93]'}`}>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#0a84ff]" />}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-white text-sm font-medium">{id}</span>
                                  {baseUrl && <span className="text-[#8e8e93] text-[10px] mt-0.5 max-w-[200px] truncate">{baseUrl}</span>}
                                </div>
                              </div>
                            </div>
                            
                            <div className="shrink-0 flex items-center gap-4 pt-1">
                              <CustomSelect 
                                value={currentLevel}
                                onChange={(val) => handleSetThinkingLevel(id, val as ThinkingLevel)}
                                options={['NONE', 'MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'].map(level => ({ value: level, label: level }))}
                              />
                              <button 
                                onClick={() => handleRemoveCustomModel(id)}
                                className="text-[#ff375f] hover:text-[#ff2d55] text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'permissions' && (
                <motion.div 
                  key="permissions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 max-w-2xl mx-auto space-y-6"
                >
                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4">
                    <h3 className="text-white font-medium mb-1">Asset Generation Preference</h3>
                    <p className="text-[#8e8e93] text-xs mb-4">Choose how VibeCoder should create objects in your world.</p>
                    
                    <div className="flex bg-[#1c1c1e] rounded-lg p-1 gap-1">
                      <button 
                        onClick={() => handleSetAssetPreference('toolbox')}
                        className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${assetPreference === 'toolbox' ? 'bg-[#3a3a3c] text-white shadow' : 'text-[#8e8e93] hover:text-white'}`}
                      >
                        Roblox Toolbox
                      </button>
                      <button 
                        onClick={() => handleSetAssetPreference('custom')}
                        className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${assetPreference === 'custom' ? 'bg-[#3a3a3c] text-white shadow' : 'text-[#8e8e93] hover:text-white'}`}
                      >
                        Custom Parts (AI Generated)
                      </button>
                    </div>
                    {assetPreference === 'custom' && (
                      <p className="text-[#8e8e93] text-xs mt-3">
                        VibeCoder will attempt to build structures using primitive parts and CSG instead of fetching pre-made models.
                      </p>
                    )}
                  </div>

                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-medium mb-1">Allow Toolbox Fetching</h3>
                        <p className="text-[#8e8e93] text-xs">If disabled, VibeCoder cannot use InsertService to fetch assets.</p>
                      </div>
                      <button 
                        onClick={handleToggleToolbox}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${allowToolbox ? 'bg-[#32d74b]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${allowToolbox ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div>
                        <h3 className="text-white font-medium mb-1">Allow Icon Generation</h3>
                        <p className="text-[#8e8e93] text-xs">If disabled, VibeCoder will not use AI to generate 2D UI icons.</p>
                      </div>
                      <button 
                        onClick={handleToggleIconGen}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${allowIconGen ? 'bg-[#32d74b]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${allowIconGen ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  {enableWikimediaExperiment && (
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 flex items-center justify-between mt-6">
                      <div>
                        <h3 className="text-white font-medium mb-1">Wikimedia API Access</h3>
                        <p className="text-[#8e8e93] text-xs">Allow VibeCoder to query and download public domain assets from Wikimedia.</p>
                      </div>
                      <button 
                        onClick={handleToggleWikimedia}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${allowWikimedia ? 'bg-[#32d74b]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${allowWikimedia ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  )}

                </motion.div>
              )}

              {activeTab === 'experiments' && (
                <motion.div 
                  key="experiments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 max-w-xl mx-auto space-y-6"
                >
                  
                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-medium mb-1">Wikimedia Asset Fetching</h3>
                        <p className="text-[#8e8e93] text-xs">Allow VibeCoder to fetch creative commons images, icons, and audio from Wikimedia.</p>
                      </div>
                      <button 
                        onClick={handleToggleWikimediaExperiment}
                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${enableWikimediaExperiment ? 'bg-[#0a84ff]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${enableWikimediaExperiment ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-medium mb-1">AST Patching (Fast Diffs)</h3>
                        <p className="text-[#8e8e93] text-xs">Instead of rewriting an entire file to change one variable, instruct the LLM to output small diffs or Abstract Syntax Tree mutations. Reduces generation time from 15 seconds to 2 seconds.</p>
                      </div>
                      <button 
                        onClick={handleToggleAstPatching}
                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${useAstPatching ? 'bg-[#0a84ff]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${useAstPatching ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">Multi-Agent Parallelism (Swarm Architecture)</h3>
                        <span className="bg-[#0a84ff]/20 text-[#0a84ff] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Coming Soon</span>
                    </div>
                    <p className="text-[#8e8e93] text-xs">Manager Agent spawns parallel Worker Agents to execute tasks (e.g., frontend and backend) simultaneously, cutting complex task time in half.</p>
                    <div className="flex items-start justify-between gap-4 pt-2">
                      <span className="text-xs text-[#8e8e93]">Disabled</span>
                      <button 
                        disabled
                        className="w-11 h-6 rounded-full transition-colors relative shrink-0 bg-[#3a3a3c]"
                      >
                        <div className="absolute top-1 left-1 bg-white/50 w-4 h-4 rounded-full transition-transform translate-x-0" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">Context Caching & RAG</h3>
                        <span className="bg-[#0a84ff]/20 text-[#0a84ff] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Coming Soon</span>
                    </div>
                    <p className="text-[#8e8e93] text-xs">Right now, sending an entire codebase on every turn is slow and expensive. We can implement a vector database (like Chroma or Pinecone) to index the user's codebase. When the user asks for a change, VibeCoder would perform a semantic search to only pull the 2-3 relevant files into the LLM context, massively reducing token usage and latency. For Gemini specifically, we can integrate the new Context Caching API for instant recalls on large projects.</p>
                    <div className="flex items-start justify-between gap-4 pt-2">
                      <span className="text-xs text-[#8e8e93]">Disabled</span>
                      <button 
                        disabled
                        className="w-11 h-6 rounded-full transition-colors relative shrink-0 bg-[#3a3a3c]"
                      >
                        <div className="absolute top-1 left-1 bg-white/50 w-4 h-4 rounded-full transition-transform translate-x-0" />
                      </button>
                    </div>
                  </div>


                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
