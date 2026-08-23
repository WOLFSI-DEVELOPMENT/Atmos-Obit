import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Terminal, 
  Settings, 
  Play, 
  Copy, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  ChevronDown, 
  RefreshCw, 
  ChevronRight,
  Database,
  ArrowRight,
  User,
  FolderDot,
  Pin,
  X,
  Link,
  Mic,
  CornerDownLeft,
  Gamepad2,
  Sun,
  Target,
  Wrench,
  Shield,
  Code,
  MessageCircle,
  PanelRight,
  ArrowUpRight,
  LogOut
} from 'lucide-react';
import ChatPanel from './components/ChatPanel';
import { LandingPage } from './components/LandingPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { BlogPage } from './components/BlogPage';
import { PricingPage } from './components/PricingPage';
import { AuthPage } from './components/AuthPage';
import { SettingsModal } from './components/SettingsModal';
import { Project, Message, GEMINI_MODELS } from './types';

// Random project name generator for starting a new project smoothly
const PROJECT_NAMES = [
  'Procedural Spawner',
  'Obby Simulator v1',
  'Day-Night Cycle',
  'Laser Tag Arena',
  'Dynamic UI System',
  'Pet Simulator Mechanics',
  'Tycoon Base',
  'Gravity Controller'
];

export default function App() {
  const [session, setSession] = useState<{ user: any } | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setSession({ user: data.user });
          if (data.data) {
            for (const [key, val] of Object.entries(data.data)) {
              localStorage.setItem(key, val as string);
            }
            // Update states from newly hydrated localStorage
            if (data.data['vibecoder_projects']) setProjects(JSON.parse(data.data['vibecoder_projects']));
            if (data.data['vibecoder_active_project_id']) setActiveProjectId(data.data['vibecoder_active_project_id']);
            if (data.data['vibecoder_selected_model']) setSelectedModel(data.data['vibecoder_selected_model']);
            if (data.data['vibecoder_send_btn_color']) setSendBtnColor(data.data['vibecoder_send_btn_color']);
            if (data.data['vibecoder_send_btn_3d']) setSendBtn3D(data.data['vibecoder_send_btn_3d'] === 'true');
          }
          setView('app');
        } else {
          setSession(null);
        }
      })
      .catch(() => setSession(null))
      .finally(() => setIsPending(false));
  }, []);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('vibecoder_projects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [view, setView] = useState<'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth'>('landing');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    return localStorage.getItem('vibecoder_active_project_id') || null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [connectPin, setConnectPin] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem('vibecoder_selected_model') || 'gemini-3.5-flash';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isHomeListening, setIsHomeListening] = useState(false);
  const [sendBtnColor, setSendBtnColor] = useState('#b0b0b0');
  const [sendBtn3D, setSendBtn3D] = useState(false);
  const homeModelDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastSyncData = '';
    const interval = setInterval(() => {
      setSendBtnColor(localStorage.getItem('vibecoder_send_btn_color') || '#b0b0b0');
      setSendBtn3D(localStorage.getItem('vibecoder_send_btn_3d') === 'true');
      
      // Auto-sync to database if authenticated
      if (session?.user) {
        const payload = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('vibecoder_')) {
            payload[key] = localStorage.getItem(key) || '';
          }
        }
        const currentSyncData = JSON.stringify(payload);
        if (currentSyncData !== lastSyncData && lastSyncData !== '') {
          // Changed! Sync to server
          fetch('/api/user/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: currentSyncData
          }).catch(console.error);
        }
        lastSyncData = currentSyncData;
      }
    }, 1500);
    setSendBtnColor(localStorage.getItem('vibecoder_send_btn_color') || '#b0b0b0');
    setSendBtn3D(localStorage.getItem('vibecoder_send_btn_3d') === 'true');
    return () => clearInterval(interval);
  }, [session]);

  const toggleHomeSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isHomeListening) {
      setIsHomeListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsHomeListening(true);
      recognition.onend = () => setIsHomeListening(false);
      recognition.onerror = () => setIsHomeListening(false);

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setNewProjectName(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsHomeListening(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('vibecoder_selected_model', selectedModel);
  }, [selectedModel]);

  // Click outside model dropdown on home screen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (homeModelDropdownRef.current && !homeModelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    }
    if (isModelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModelDropdownOpen]);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Sync projects and active ID to localStorage
  useEffect(() => {
    localStorage.setItem('vibecoder_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem('vibecoder_active_project_id', activeProjectId);
    } else {
      localStorage.removeItem('vibecoder_active_project_id');
    }
  }, [activeProjectId]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  // Restore/Sync project history with the backend on load or selection change
  useEffect(() => {
    if (activeProject) {
      // Rehydrate the server in-memory state with this project's history
      const formattedHistory = activeProject.messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      fetch('/api/sync/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: activeProject.pin,
          history: formattedHistory
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'connected' && activeProject.status !== 'connected') {
          updateProjectStatus(activeProject.id, 'connected');
        }
      })
      .catch(err => console.error('Error syncing history with server', err));
    }
  }, [activeProjectId]);

  const updateProjectStatus = (id: string, status: 'waiting' | 'connected') => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    }));
  };

  const startPolling = (pin: string, projectId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/sync/status/${pin}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'connected') {
            updateProjectStatus(projectId, 'connected');
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 2000);
  };

  const handleCreateProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setConnectError(null);

    const name = newProjectName.trim() || PROJECT_NAMES[Math.floor(Math.random() * PROJECT_NAMES.length)];

    try {
      const res = await fetch('/api/sync/create', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate session on server');
      const data = await res.json();

      const newProj: Project = {
        id: data.pin, // use PIN as project ID for simpler mapping
        name,
        pin: data.pin,
        createdAt: Date.now(),
        status: 'waiting',
        messages: [
          { role: 'model', content: `Welcome to **${name}**! Your session PIN is \`${data.pin}\`.\n\nTo connect this workspace directly to Roblox Studio:\n1. Open your game in Roblox Studio.\n2. Open the **VibeCoder plugin**.\n3. Enter the PIN \`${data.pin}\` and click Connect.\n\nOnce synced, any scripts generated here will automatically load in Roblox Studio in real-time!` }
        ]
      };

      setProjects(prev => [newProj, ...prev]);
      setActiveProjectId(newProj.id);
      setGeneratedPin(data.pin);
      setNewProjectName('');
      startPolling(data.pin, newProj.id);
    } catch (err: any) {
      console.error(err);
      setConnectError(err.message || 'Error generating project session.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConnectExisting = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = connectPin.trim().toUpperCase();
    if (!pin || pin.length !== 6) {
      setConnectError('Please enter a valid 6-character PIN');
      return;
    }

    setIsConnecting(true);
    setConnectError(null);

    try {
      // First, check status of this PIN
      const statusRes = await fetch(`/api/sync/status/${pin}`);
      if (!statusRes.ok) {
        throw new Error('PIN session not found on server. Start a new project instead.');
      }
      const statusData = await statusRes.json();

      const name = `Connected Project (${pin})`;
      const newProj: Project = {
        id: pin,
        name,
        pin,
        createdAt: Date.now(),
        status: statusData.status || 'connected',
        messages: [
          { role: 'model', content: `Successfully reconnected to workspace **${name}** with PIN \`${pin}\`. Start chatting to write code!` }
        ]
      };

      setProjects(prev => [newProj, ...prev]);
      setActiveProjectId(newProj.id);
      setConnectPin('');
      setIsConnectModalOpen(false);
      if (statusData.status === 'waiting') {
        startPolling(pin, newProj.id);
      }
    } catch (err: any) {
      console.error(err);
      setConnectError(err.message || 'Could not connect to existing session.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendMessage = (newMessageList: Message[]) => {
    if (!activeProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return { ...p, messages: newMessageList };
      }
      return p;
    }));
  };

  const copyPin = () => {
    if (!generatedPin) return;
    navigator.clipboard.writeText(generatedPin);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSelectProject = (projId: string) => {
    setActiveProjectId(projId);
    setGeneratedPin(null);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    const selected = projects.find(p => p.id === projId);
    if (selected && selected.status === 'waiting') {
      startPolling(selected.pin, selected.id);
    }
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(null);
      setGeneratedPin(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.pin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPending) {
    return (
      <div className="h-screen w-full bg-[#111111] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }
  
  if (view === 'auth') {
    return <AuthPage onNavigate={setView} onLoginSuccess={(user) => setSession({ user })} />;
  }

  if (view === 'pricing') {
    return <PricingPage onNavigate={setView} />;
  }

  if (view === 'blog') {
    return <BlogPage onNavigate={setView} />;
  }

  if (view === 'privacy') {
    return <PrivacyPolicy onNavigate={setView} />;
  }

  if (view === 'terms') {
    return <TermsOfService onNavigate={setView} />;
  }

  if (view === 'landing') {
    return <LandingPage onNavigate={setView} onEnterApp={() => setView('auth')} />;
  }

  return (
    <div className="h-screen w-full bg-[#1c1c1c] flex font-sans overflow-hidden text-white selection:bg-neutral-800">
      
      {/* Sidebar - Wide minimalist design styled perfectly like the image */}
      <div 
        className={`${
          isSidebarOpen ? 'w-[280px] border-r border-[#2a2a2a]/50' : 'w-0 border-r-0'
        } bg-[#1c1c1c] flex flex-col justify-between select-none transition-all duration-300 ease-in-out shrink-0 overflow-hidden relative z-40`}
      >
        <div className="flex flex-col flex-1 overflow-hidden min-w-[280px]">
          {/* Logo Brand Header */}
          <div className="py-2.5 px-4 flex items-center justify-between border-b border-transparent">
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] rounded-xl flex items-center justify-center relative overflow-hidden bg-transparent">
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="App Icon" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-[18px] text-white tracking-tight whitespace-nowrap">Atmos orbit</span>
            </div>
            
            {/* Minimal layout settings/indicator */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-white hover:text-neutral-300 transition-colors p-1.5 hover:bg-[#2a2a2a] rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                <line x1="8" y1="7" x2="8" y2="17" className="transition-all duration-300 ease-in-out"></line>
              </svg>
            </button>
          </div>

          {/* New Project Pill Button */}
          <div className="px-4 pt-2">
            <button 
              onClick={() => {
                setActiveProjectId(null);
                setGeneratedPin(null);
              }}
              className="w-full py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Plus size={18} strokeWidth={2.5} />
              New Project
            </button>
          </div>

          {/* Recents List Header */}
          <div className="px-5 pt-8 pb-3 z-20 relative">
            <span className="text-[13px] font-medium text-[#7a7a7a]">Recent Projects</span>
          </div>

          {/* Project Search Box */}
          <div className="hidden">
            {/* Kept hidden to match screenshot but keep logic intact if needed */}
          </div>

          {/* Project List Items - Scrollable area with fog */}
          <div className="relative flex-1 overflow-hidden min-h-0 flex flex-col">
            {/* Top dark grey fog shadow */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#1c1c1c] to-transparent z-10 pointer-events-none" />
            
            {/* Bottom dark grey fog shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#1c1c1c] to-transparent z-10 pointer-events-none" />

            <div className="flex-1 overflow-y-auto px-3 pt-2 pb-6 space-y-1 scrollbar-none">
              {filteredProjects.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-600">
                No projects saved.
              </div>
            ) : (
              filteredProjects.map((p) => {
                const isActive = p.id === activeProjectId;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProject(p.id)}
                    className={`group w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-[#2a2a2a]/50 text-white' 
                        : 'text-[#a0a0a0] hover:bg-[#2a2a2a]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#252525]">
                        <Code size={14} className="text-[#808080]" />
                      </div>
                      <div className="truncate flex flex-col items-start gap-0.5 mt-0.5">
                        <div className="text-[14px] font-bold text-[#f0f0f0] truncate leading-tight">{p.name}</div>
                        <div className="text-[12px] text-[#606060] leading-tight">
                          {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Delete button displayed on hover */}
                    <button
                      onClick={(e) => deleteProject(p.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-all shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          </div>
        </div>

        {/* Auth Footer Container in Sidebar */}
        <div className="p-4 border-t border-[#2a2a2a]/50 min-w-[280px] shrink-0">
          {!isPending && !session ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView('auth')}
                className="flex-1 py-2 text-[13px] font-semibold text-white bg-transparent hover:bg-white/10 rounded-xl transition-colors border border-white/10"
              >
                Sign In
              </button>
              <button 
                onClick={() => setView('auth')}
                className="flex-1 py-2 text-[13px] font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-colors"
              >
                Sign Up
              </button>
            </div>
          ) : null}
          
          {session ? (
            <div 
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center justify-between gap-3 cursor-pointer hover:bg-white/5 p-2 -ml-2 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700 group-hover:border-neutral-500 transition-colors">
                  <span className="text-[14px] font-medium text-white">
                    {(session.user.name || session.user.email || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[13px] text-white font-medium truncate group-hover:text-neutral-200 transition-colors">
                    {session.user.name || 'User'}
                  </span>
                  <span className="text-[11px] text-neutral-400 truncate group-hover:text-neutral-300 transition-colors">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <Settings size={16} className="text-neutral-500 group-hover:text-white transition-colors shrink-0" />
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Page Area - Full bleed, no padding/curves */}
      <div className="flex-1 bg-[#1a1a1a] h-full flex flex-col relative overflow-hidden">

          {/* Floating Open Sidebar Button (visible when sidebar is closed) */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-1.5 left-3 z-50 text-white hover:text-neutral-300 transition-colors p-1.5 bg-[#1c1c1c] hover:bg-[#2a2a2a] rounded-lg border border-[#2a2a2a]/50 shadow-md animate-in fade-in duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                <line x1="8" y1="7" x2="8" y2="17" className="transition-all duration-300 ease-in-out"></line>
              </svg>
            </button>
          )}

          {activeProject ? (
            /* ACTIVE CHAT WORKSPACE (Takes up full 100% of pure black panel - no files) */
            <ChatPanel 
              key={activeProject.id}
              project={activeProject}
              onMessagesChange={handleSendMessage}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          ) : (
            /* EXQUISITE COMPACT HOME VIEW FOR CREATING NEW PROJECTS */
            <div className="h-full w-full relative overflow-hidden flex flex-col justify-center items-center">
              {/* Background Images Overlay mimicking the screenshot - Now full screen width */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]">
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094724/NEON_DRIFT_X_game_cover_202605241419_fjybae.jpg" className="absolute top-[8%] left-[4%] w-48 h-32 object-cover rounded-xl -rotate-6 shadow-2xl" alt="NEON DRIFT X" />
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094715/Blocky_Crossing_game_cover_202605241419_czbolu.jpg" className="absolute top-[10%] right-[6%] w-48 h-32 object-cover rounded-xl rotate-3 shadow-2xl" alt="Blocky Crossing" />
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094715/Titan_Offroad_game_cover_202605241419_big2ck.jpg" className="absolute top-[6%] left-[38%] w-48 h-32 object-cover rounded-xl -rotate-3 shadow-2xl" alt="Titan Offroad" />
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094701/Armored_muscle_cars_crashing_hig__202605241419_yqugg9.jpg" className="absolute bottom-[8%] left-[5%] w-48 h-32 object-cover rounded-xl rotate-6 shadow-2xl" alt="Armored muscle cars" />
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094698/Cube_Clash.io_game_cover_202605241420_d4eaeg.jpg" className="absolute bottom-[10%] right-[5%] w-48 h-32 object-cover rounded-xl -rotate-2 shadow-2xl" alt="Cube Clash.io" />
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094698/Shadow_Protocol_cover_art_202605241419_orggay.jpg" className="absolute bottom-[6%] left-[35%] w-48 h-32 object-cover rounded-xl rotate-3 shadow-2xl" alt="Shadow Protocol" />
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094681/Flappy_Sky_game_cover_202605241419_to1erv.jpg" className="absolute top-[42%] left-[2%] w-48 h-32 object-cover rounded-xl -rotate-12 shadow-2xl" alt="Flappy Sky" />
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094680/Frozen_Survival_game_cover_art_202605241420_ryf9df.jpg" className="absolute top-[45%] right-[2%] w-48 h-32 object-cover rounded-xl rotate-6 shadow-2xl" alt="Frozen Survival" />
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094676/Zombie_District_game_cover_202605241419_iyozmx.jpg" className="absolute top-[40%] left-[65%] w-48 h-32 object-cover rounded-xl -rotate-6 shadow-2xl" alt="Zombie District" />
              </div>

              <div className="w-full max-w-3xl p-8 space-y-8 flex flex-col items-center relative z-10">
                
                {/* Centered Text on Top */}
                <h1 className="text-[28px] font-bold tracking-tight text-white mb-2">
                  Describe a <span className="italic font-serif">Roblox system...</span>
                </h1>

                {/* Main Compact Input Container */}
                <form 
                  onSubmit={handleCreateProject}
                  className="w-full max-w-[680px] bg-[#2a2a2a]/50 backdrop-blur-xl rounded-2xl relative p-4 flex flex-col"
                >
                  <textarea
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Add double-jump with particles"
                    className="w-full h-[80px] bg-transparent text-[#9e9e9e] px-2 py-2 text-[15px] focus:outline-none placeholder-neutral-400 resize-none font-medium flex items-center"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (newProjectName.trim()) {
                          handleCreateProject(e);
                        }
                      }
                    }}
                    disabled={isGenerating}
                  />

                  {/* Action Controls Row */}
                  <div className="absolute right-4 bottom-4 flex items-center justify-end">
                    <button 
                      type="submit"
                      disabled={isGenerating || !newProjectName.trim()}
                      className={`w-9 h-9 disabled:opacity-50 text-black rounded-lg flex items-center justify-center shrink-0 ${sendBtn3D ? 'shadow-[0_4px_0_#000000,inset_0_1px_1px_rgba(255,255,255,0.4)] active:shadow-[0_0px_0_#000000,inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-[4px] transition-transform duration-75' : 'shadow-sm hover:brightness-125 transition-all'}`}
                      style={{ backgroundColor: sendBtnColor }}
                      title="Create project"
                    >
                      <ArrowUpRight className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </form>

                {/* Suggestion Prompts */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setNewProjectName('Make a combat system')}
                    className="flex items-center gap-2.5 px-3 py-1.5 bg-[#2a2a2a]/50 backdrop-blur-xl hover:bg-[#3a3a3a]/60 rounded-xl text-[13px] font-semibold text-[#e0e0e0] transition-colors"
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-white/5 border border-white/10 text-xs">⚔️</div>
                    Make a combat system
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProjectName('Make a plot system')}
                    className="flex items-center gap-2.5 px-3 py-1.5 bg-[#2a2a2a]/50 backdrop-blur-xl hover:bg-[#3a3a3a]/60 rounded-xl text-[13px] font-semibold text-[#e0e0e0] transition-colors"
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-white/5 border border-white/10 text-xs">🍍</div>
                    Make a plot system
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProjectName('Make a round system')}
                    className="flex items-center gap-2.5 px-3 py-1.5 bg-[#2a2a2a]/50 backdrop-blur-xl hover:bg-[#3a3a3a]/60 rounded-xl text-[13px] font-semibold text-[#e0e0e0] transition-colors"
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-white/5 border border-white/10 text-xs">🥊</div>
                    Make a round system
                  </button>
                </div>

                {/* Active PIN waiting dialog (when just generated) */}
                {generatedPin && (
                  <div className="w-full max-w-xl bg-neutral-950 border border-neutral-800 p-6 rounded-3xl text-center space-y-4 animate-in fade-in-50 duration-300 mt-4 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Active Session Generated</span>
                      <h3 className="text-xs text-neutral-400">Copy this PIN and paste it inside the Roblox Studio plugin:</h3>
                    </div>

                    <div className="flex items-center justify-center gap-2 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 max-w-xs mx-auto">
                      <span className="text-2xl font-mono font-bold tracking-[0.3em] text-white pl-3 select-all">
                        {generatedPin}
                      </span>
                      <button 
                        onClick={copyPin}
                        type="button"
                        className="p-2 text-neutral-400 hover:text-white bg-white/5 rounded-full transition-colors border border-neutral-800"
                        title="Copy PIN"
                      >
                        {isCopied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                      <span>Waiting for your Roblox Studio to connect...</span>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const proj = projects.find(p => p.pin === generatedPin);
                          if (proj) {
                            setActiveProjectId(proj.id);
                            setGeneratedPin(null);
                          }
                        }}
                        className="text-[11px] text-neutral-400 hover:text-white underline transition-colors"
                      >
                        Skip waiting and open chat workspace
                      </button>
                    </div>
                  </div>
                )}

                {/* Error handling */}
                {connectError && !isConnectModalOpen && (
                  <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 text-xs text-center rounded-full max-w-xl w-full">
                    {connectError}
                  </div>
                )}
              </div>

              {/* Connect PIN Dialog (Modal popup) */}
              {isConnectModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                  <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 p-6 rounded-3xl relative shadow-2xl space-y-6">
                    <button 
                      onClick={() => {
                        setIsConnectModalOpen(false);
                        setConnectError(null);
                      }}
                      type="button"
                      className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <X size={16} />
                    </button>

                    <div className="space-y-1.5 text-center">
                      <h3 className="text-sm font-bold text-white">Connect Roblox Studio PIN</h3>
                      <p className="text-xs text-neutral-400">Enter the 6-character PIN from the Roblox VibeCoder plugin.</p>
                    </div>

                    <form onSubmit={handleConnectExisting} className="space-y-4">
                      <input 
                        type="text"
                        placeholder="ENTER PIN"
                        value={connectPin}
                        onChange={(e) => setConnectPin(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="w-full h-12 px-5 text-center tracking-[0.2em] bg-neutral-900 border border-neutral-800 rounded-full text-sm font-mono text-white focus:outline-none focus:border-neutral-700 transition-colors placeholder:text-neutral-500 placeholder:tracking-normal"
                        autoFocus
                      />

                      {connectError && (
                        <div className="p-2.5 bg-red-950/20 border border-red-900/20 text-red-400 text-xs text-center rounded-xl">
                          {connectError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isConnecting}
                        className="w-full h-11 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 text-black font-semibold text-xs rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        {isConnecting ? 'CONNECTING...' : 'CONNECT TO SESSION'}
                        <ArrowRight size={14} />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          user={session?.user}
          onLogout={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            setSession(null);
            setIsSettingsModalOpen(false);
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('vibecoder_')) {
                keysToRemove.push(key);
              }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
            setProjects([]);
            setActiveProjectId(null);
            setView('auth');
          }}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
    </div>
  );
}
