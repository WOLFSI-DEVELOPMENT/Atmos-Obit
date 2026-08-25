import { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Image as ImageIcon, 
  X, 
  Link, 
  CheckCircle, 
  Wifi, 
  Play, 
  HelpCircle, 
  Pin, 
  Copy, 
  Check,
  Plus, 
  Sparkles, 
  ChevronDown, 
  Mic, 
  MicOff,
  Download,
  BookOpen,
  Trash2,
  ArrowUpRight,
  CornerDownRight,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Project, Message, GEMINI_MODELS, OPENAI_MODELS, ANTHROPIC_MODELS } from '../types';

interface ChatPanelProps {
  project: Project;
  onMessagesChange: (messages: Message[]) => void;
  onFilesUpdate?: (files: { path: string; type: string; content: string }[]) => void;
  onPinUpdate?: (pin: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  artifactsEnabled?: boolean;
  isArtifactsPanelOpen?: boolean;
  setIsArtifactsPanelOpen?: (open: boolean) => void;
}

// Preset Roblox Luau Quick Prompt Chips
const QUICK_PROMPT_PRESETS = [
  { label: 'Leaderstats & Coins', prompt: 'Create a ServerScript in ServerScriptService that creates leaderstats with Leaderboard Coins and Gems for each joining player.' },
  { label: 'DataStore Manager', prompt: 'Write a Roblox DataStore script that saves player leaderstats and inventory items safely when they leave.' },
  { label: 'Kill Touch Part', prompt: 'Create a script that makes a Part deal 50 damage or kill any player character that touches it.' },
  { label: 'Speed & Jump Pad', prompt: 'Create a pad script that gives the player a 3-second speed boost and launch velocity when stepped on.' },
  { label: 'Tween UI Animation', prompt: 'Write a LocalScript using TweenService to smoothly fade in and scale up a ScreenGui Frame.' }
];

// Custom Code Block component with Copy, Download .luau, and Luau badge
function CodeBlock({ children, className }: { children: any; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'luau';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VibeCoder_Script.${lang === 'json' ? 'json' : 'luau'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-3 rounded-2xl border border-neutral-800 bg-[#0d0d0d] overflow-hidden shadow-xl">
      <div className="px-3.5 py-2 bg-[#141414] border-b border-neutral-800/80 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neutral-600" />
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
            {lang === 'lua' || lang === 'luau' ? 'Luau Script' : lang}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-white px-2 py-1 rounded-md hover:bg-neutral-800/60 transition-colors"
            title="Download script file"
          >
            <Download size={12} />
            <span>.luau</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-white px-2 py-1 rounded-md hover:bg-neutral-800/60 transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? <Check size={12} className="text-white" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed select-text">
        <code>{codeString}</code>
      </pre>
    </div>
  );
}

export default function ChatPanel({ 
  project, 
  onMessagesChange,
  onFilesUpdate,
  onPinUpdate,
  selectedModel,
  setSelectedModel,
  artifactsEnabled,
  isArtifactsPanelOpen,
  setIsArtifactsPanelOpen
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pinDropdownRef = useRef<HTMLDivElement>(null);

  const [isPinDropdownOpen, setIsPinDropdownOpen] = useState(false);
  const [isPinCopied, setIsPinCopied] = useState(false);

  const [sendBtnColor, setSendBtnColor] = useState('#b0b0b0');
  const [sendBtn3D, setSendBtn3D] = useState(false);
  const [aiFont, setAiFont] = useState('default');
  const [runningDuration, setRunningDuration] = useState<number>(0);
  const runningIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isLoading) {
      setRunningDuration(0);
      runningIntervalRef.current = setInterval(() => {
        setRunningDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (runningIntervalRef.current) {
        clearInterval(runningIntervalRef.current);
      }
    }
    return () => {
      if (runningIntervalRef.current) clearInterval(runningIntervalRef.current);
    };
  }, [isLoading]);
  const [suggestedPrompts, setSuggestedPrompts] = useState<{label: string, prompt: string}[] | null>(null);

  useEffect(() => {
    setSuggestedPrompts(null);
    const timer = setTimeout(() => {
      setSuggestedPrompts(QUICK_PROMPT_PRESETS);
    }, 1200);

    const initialPrompt = localStorage.getItem('vibecoder_initial_prompt');
    if (initialPrompt) {
      localStorage.removeItem('vibecoder_initial_prompt');
      const lastMsg = project.messages[project.messages.length - 1];
      if (!lastMsg || lastMsg.content !== initialPrompt) {
        handleSend(initialPrompt);
      }
    }

    return () => clearTimeout(timer);
  }, [project.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSendBtnColor(localStorage.getItem('vibecoder_send_btn_color') || '#b0b0b0');
      setSendBtn3D(localStorage.getItem('vibecoder_send_btn_3d') === 'true');
      setAiFont(localStorage.getItem('vibecoder_ai_font') || 'default');
    }, 500);
    
    setSendBtnColor(localStorage.getItem('vibecoder_send_btn_color') || '#b0b0b0');
    setSendBtn3D(localStorage.getItem('vibecoder_send_btn_3d') === 'true');
    setAiFont(localStorage.getItem('vibecoder_ai_font') || 'default');
    
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom of conversation when messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [project.messages, isLoading]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pinDropdownRef.current && !pinDropdownRef.current.contains(event.target as Node)) {
        setIsPinDropdownOpen(false);
      }
    }
    if (isPinDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPinDropdownOpen]);

  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const chatModelDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatModelDropdownRef.current && !chatModelDropdownRef.current.contains(event.target as Node)) {
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

  const copyPinToClipboard = () => {
    navigator.clipboard.writeText(project.pin);
    setIsPinCopied(true);
    setTimeout(() => setIsPinCopied(false), 2000);
  };

  // Speech-to-Text Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type your request directly.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      ...(selectedImage ? { image: selectedImage } : {})
    };

    const updatedWithUser = [...project.messages, userMessage];
    onMessagesChange(updatedWithUser);

    abortControllerRef.current = new AbortController();
    const startTime = Date.now();

    try {
      // const globalApiKey = localStorage.getItem('vibecoder_api_key') || '';
      const savedLevels = JSON.parse(localStorage.getItem('vibecoder_thinking_levels') || '{}');
      const defaultLevels: Record<string, string> = {
        'gemini-3.7-flash': 'MEDIUM',
        'gemini-3.6-flash': 'MEDIUM',
        'gemini-3.5-flash': 'MEDIUM',
        'gemini-3.5-flash-lite': 'MINIMAL',
        'gemini-3.1-pro-preview': 'HIGH',
        'gemini-3-flash-preview': 'HIGH',
        'gemini-3.1-flash-lite': 'MINIMAL',
        'gemini-3.1-flash-lite-image': 'MINIMAL'
      };
      const thinkingLevel = savedLevels[selectedModel] || defaultLevels[selectedModel] || 'MEDIUM';
      
      const customModels = JSON.parse(localStorage.getItem('vibecoder_custom_models') || '[]');
      const customModelConfig = customModels.find((m: any) => (typeof m === 'string' ? m : m.id) === selectedModel);
      
      let globalApiKey = localStorage.getItem('vibecoder_api_key') || '';
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
      }

      const allowToolbox = localStorage.getItem('vibecoder_allow_toolbox') !== 'false';
      const allowIconGen = localStorage.getItem('vibecoder_allow_icongen') !== 'false';
      const assetPreference = localStorage.getItem('vibecoder_asset_preference') || 'toolbox';
      const responseTone = localStorage.getItem('vibecoder_response_tone') || 'default';
      const guiStyle = localStorage.getItem('vibecoder_gui_style') || 'default';
      const orchestratorEnabled = localStorage.getItem('vibecoder_orchestrator_enabled') !== 'false';
      const guiCreationEnabled = localStorage.getItem('vibecoder_exp_gui_creation') === 'true';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend, 
          pin: project.pin, 
          image: selectedImage,
          model: selectedModel,
          apiKey,
          baseUrl,
          thinkingConfig: { thinkingLevel },
          allowToolbox,
          allowIconGen,
          assetPreference,
          responseTone,
          guiStyle,
          orchestratorEnabled,
          guiCreationEnabled
        }),
        signal: abortControllerRef.current?.signal
      });

      if (!res.ok) {
        throw new Error('AI Server responded with an error');
      }

      const data = await res.json();
      const aiMessage: Message = {
        role: 'model',
        content: data.reply || 'No response returned from assistant.',
        diffs: data.diffs,
        model: selectedModel,
        duration: (Date.now() - startTime) / 1000
      };

      onMessagesChange([...updatedWithUser, aiMessage]);
      if (data.files && onFilesUpdate) {
        onFilesUpdate(data.files);
      }
    } catch (e: any) {
      console.error(e);
      if (e.name === 'AbortError') {
        const aiMessage: Message = {
           role: 'model',
           content: `⚠️ **Request Cancelled by User**`,
           model: selectedModel,
           duration: (Date.now() - startTime) / 1000
        };
        onMessagesChange([...updatedWithUser, aiMessage]);
      } else {
        const errorMessage: Message = {
          role: 'model',
          content: `⚠️ **Connection Error**: Failed to communicate with VibeCoder AI. Please check your network or verify server status.`
        };
        onMessagesChange([...updatedWithUser, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const downloadPluginLuaScript = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const pluginScriptContent = `-- VibeCoder Roblox Studio Sync Plugin
-- Place this inside Roblox Studio as a Script or run in Command Bar

local HttpService = game:GetService("HttpService")
local ServerScriptService = game:GetService("ServerScriptService")
local StarterPlayer = game:GetService("StarterPlayer")
local StarterPlayerScripts = StarterPlayer:WaitForChild("StarterPlayerScripts")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local StarterGui = game:GetService("StarterGui")

local PIN = "${project.pin}"
local API_URL = "${origin}"

print("[VibeCoder Plugin] Connecting to session PIN: " .. PIN .. " at " .. API_URL)

local isRunning = true

local function postJson(endpoint, data)
    local ok, res = pcall(function()
        return HttpService:RequestAsync({
            Url = API_URL .. endpoint,
            Method = "POST",
            Headers = { ["Content-Type"] = "application/json" },
            Body = HttpService:JSONEncode(data)
        })
    end)
    return ok, res
end

local function disconnect()
    if not isRunning then return end
    isRunning = false
    pcall(function()
        HttpService:RequestAsync({
            Url = API_URL .. "/api/plugin/disconnect",
            Method = "POST",
            Headers = { ["Content-Type"] = "application/json" },
            Body = HttpService:JSONEncode({ pin = PIN })
        })
    end)
    print("[VibeCoder Plugin] Disconnected session " .. PIN)
end

-- Helper to resolve service and nested folders from path
local function resolveParentAndName(pathStr, defaultType)
    if not pathStr or pathStr == "" then
        local defaultParent = ServerScriptService
        if defaultType == "LocalScript" then
            defaultParent = StarterPlayerScripts
        elseif defaultType == "ModuleScript" then
            defaultParent = ReplicatedStorage
        end
        return defaultParent, "VibeCoder_" .. tostring(os.time())
    end

    -- Normalize slashes to dots
    local cleanPath = string.gsub(pathStr, "/", ".")
    local parts = {}
    for part in string.gmatch(cleanPath, "[^%.]+") do
        table.insert(parts, part)
    end

    if #parts == 1 then
        local defaultParent = ServerScriptService
        if defaultType == "LocalScript" then
            defaultParent = StarterPlayerScripts
        elseif defaultType == "ModuleScript" then
            defaultParent = ReplicatedStorage
        end
        return defaultParent, parts[1]
    end

    -- Determine root service
    local rootName = parts[1]
    local currentParent = ServerScriptService
    local startIndex = 2

    if rootName == "ServerScriptService" or rootName == "src" and parts[2] == "server" then
        currentParent = ServerScriptService
        if rootName == "src" then startIndex = 3 end
    elseif rootName == "StarterPlayer" or rootName == "StarterPlayerScripts" or (rootName == "src" and parts[2] == "client") then
        currentParent = StarterPlayerScripts
        if rootName == "StarterPlayer" and parts[2] == "StarterPlayerScripts" then startIndex = 3 end
        if rootName == "src" then startIndex = 3 end
    elseif rootName == "ReplicatedStorage" or (rootName == "src" and parts[2] == "shared") then
        currentParent = ReplicatedStorage
        if rootName == "src" then startIndex = 3 end
    elseif rootName == "StarterGui" or (rootName == "src" and parts[2] == "starter-gui") then
        currentParent = StarterGui
        if rootName == "src" then startIndex = 3 end
    end

    -- Traverse intermediate folders
    for i = startIndex, #parts - 1 do
        local folderName = parts[i]
        local folder = currentParent:FindFirstChild(folderName)
        if not folder then
            folder = Instance.new("Folder")
            folder.Name = folderName
            folder.Parent = currentParent
        end
        currentParent = folder
    end

    local scriptName = parts[#parts]
    -- Strip .luau or .lua extension if present in the name
    scriptName = string.gsub(scriptName, "%.server$", "")
    scriptName = string.gsub(scriptName, "%.client$", "")
    scriptName = string.gsub(scriptName, "%.luau$", "")
    scriptName = string.gsub(scriptName, "%.lua$", "")

    return currentParent, scriptName
end

-- Connect initial session
local ok, res = postJson("/api/plugin/connect", { pin = PIN })
if not ok or (res and res.StatusCode ~= 200) then
    warn("[VibeCoder Plugin] Failed to connect. Ensure 'Allow HTTP Requests' is enabled in Game Settings -> Security.")
    return
end

print("[VibeCoder Plugin] Connected successfully! Live code sync active.")

-- Handle unload / close events
if typeof(plugin) == "Instance" and plugin:IsA("Plugin") then
    plugin.Unloading:Connect(disconnect)
end
game:BindToClose(disconnect)

-- Heartbeat loop
task.spawn(function()
    while isRunning do
        task.wait(4)
        postJson("/api/plugin/heartbeat", { pin = PIN })
    end
end)

-- Main code sync loop
task.spawn(function()
    while isRunning do
        task.wait(1.5)
        
        local pollOk, pollRes = pcall(function()
            return HttpService:RequestAsync({
                Url = API_URL .. "/api/plugin/poll/" .. PIN,
                Method = "GET",
                Headers = { ["Content-Type"] = "application/json" }
            })
        end)

        if pollOk and pollRes and pollRes.StatusCode == 200 then
            local data = HttpService:JSONDecode(pollRes.Body)
            if data and data.pending and #data.pending > 0 then
                for _, item in ipairs(data.pending) do
                    local scriptType = item.type or "Script"
                    local parent, scriptName = resolveParentAndName(item.path, scriptType)
                    
                    -- Check if script already exists to update in-place
                    local targetScript = parent:FindFirstChild(scriptName)
                    if targetScript and (targetScript:IsA("Script") or targetScript:IsA("LocalScript") or targetScript:IsA("ModuleScript")) then
                        targetScript.Source = item.code or ""
                        print("[VibeCoder Plugin] Updated " .. scriptName .. " (" .. targetScript.ClassName .. ") in " .. parent:GetFullName())
                    else
                        local newScript = Instance.new(scriptType)
                        newScript.Name = scriptName
                        newScript.Source = item.code or ""
                        newScript.Parent = parent
                        print("[VibeCoder Plugin] Created " .. scriptName .. " (" .. scriptType .. ") in " .. parent:GetFullName())
                    end
                end
            end
        elseif not pollOk then
            -- Silent retry on transient network drops
        end
    end
end)
`;
    const blob = new Blob([pluginScriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VibeCoder_Studio_Plugin_${project.pin}.lua`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  
  useEffect(() => {
    const handleRegenerate = async () => {
      try {
        const res = await fetch('/api/sync/create', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          const newPin = data.pin;
          if (onPinUpdate) {
            onPinUpdate(newPin);
          }
          const newMsg = {
            role: 'model' as const,
            content: `🔄 **Connection Code Regenerated!**\n\nYour new session PIN is \`${newPin}\`.\n\nTo connect this workspace directly to Roblox Studio:\n1. Open your game in Roblox Studio.\n2. Open the **VibeCoder plugin**.\n3. Enter the new PIN \`${newPin}\` and click Connect.`
          };
          onMessagesChange([...project.messages, newMsg]);
        }
      } catch (e) {
        handleSend("Regenerate the connection code and session PIN instructions for Roblox Studio");
      }
    };
    window.addEventListener('regenerate-code', handleRegenerate);
    return () => window.removeEventListener('regenerate-code', handleRegenerate);
  }, [project.messages, onMessagesChange, onPinUpdate]);

  return (
    <div className="flex-1 bg-[#181818] flex flex-col h-full rounded-none relative">
      
      {/* Top Gradient Fade for Messages */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#181818] via-[#181818]/90 to-transparent pointer-events-none z-10" />

      {/* Top Workspace Header */}
      <div className="absolute top-0 left-0 right-0 py-2.5 pr-4 pl-8 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto relative" ref={pinDropdownRef}>
          <h2 className="text-[17px] font-medium tracking-wide text-white">{project.name}</h2>
          <button 
            onClick={() => setIsPinDropdownOpen(!isPinDropdownOpen)}
            className={`p-1 transition-colors rounded-full ${
              isPinDropdownOpen 
                ? 'bg-white text-black' 
                : 'text-neutral-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <ChevronDown size={16} strokeWidth={2.5} />
          </button>

          {isPinDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#2a2a2a]/95 backdrop-blur-xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl border border-white/5">
              <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-2 flex items-center justify-between">
                <span>Roblox PIN</span>
                <button
                  onClick={() => {
                    setIsPinDropdownOpen(false);
                    window.dispatchEvent(new CustomEvent('regenerate-code'));
                  }}
                  className="flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md transition-colors"
                  title="Regenerate Connection Code & PIN"
                >
                  <RefreshCw size={11} /> Regenerate Code
                </button>
              </div>
              <div className="flex items-center justify-between bg-[#1a1a1a] p-2.5 rounded-xl">
                <span className="font-mono font-bold text-base tracking-[0.1em] text-white select-all pl-1">
                  {project.pin}
                </span>
                <button
                  onClick={copyPinToClipboard}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
                  title="Copy PIN"
                >
                  {isPinCopied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 mt-2.5 leading-normal">
                Enter this PIN in the VibeCoder Roblox Studio plugin to sync.
              </p>
              <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                <a
                  href="https://create.roblox.com/store/asset/115974186525830"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsPinDropdownOpen(false)}
                  className="w-full py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowUpRight size={14} /> Install Plugin
                </a>
                <button
                  onClick={() => {
                    setIsPinDropdownOpen(false);
                    downloadPluginLuaScript();
                  }}
                  className="w-full py-1.5 bg-transparent hover:bg-white/5 text-neutral-400 hover:text-neutral-200 text-[11px] font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download size={12} /> Download .lua Script
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Top Header Controls: Sync Badge, Artifacts Toggle */}
        <div className="flex items-center gap-2 relative pointer-events-auto">

          {/* Sync Status Badge */}
          {project.status === 'connected' ? (
            <span className="text-[10px] bg-neutral-900 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Connected
            </span>
          ) : (
            <span className="text-[10px] bg-neutral-900 text-neutral-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Offline
            </span>
          )}

          {/* Artifacts Toggle Button */}
          {artifactsEnabled && (
            <button 
              onClick={() => setIsArtifactsPanelOpen && setIsArtifactsPanelOpen(!isArtifactsPanelOpen)}
              className="text-neutral-500 hover:text-white transition-colors p-1.5 rounded-lg flex items-center justify-center"
              title="Toggle Artifacts Code View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                <line x1="16" y1="7" x2="16" y2="17" className="transition-all duration-300 ease-in-out"></line>
              </svg>
            </button>
          )}

        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 pt-16 pb-48 flex flex-col gap-6 scrollbar-thin">
        {project.messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              
              {isUser ? (
                /* User Message Bubble */
                <div className="max-w-[80%] flex flex-col items-end gap-1.5">
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="Uploaded reference" 
                      className="max-h-48 rounded-lg object-cover" 
                    />
                  )}
                  <div className="p-3.5 rounded-2xl rounded-tr-sm bg-[#2a2a2a] text-sm text-neutral-100 leading-relaxed" style={{ border: 'none', outline: 'none' }}>
                    {msg.content}
                  </div>
                </div>
              ) : (
                /* AI Response Block */
                <div className="w-full flex max-w-3xl">
                  <div className="flex-1 space-y-1 overflow-x-auto">
                    <div className="text-[11px] font-medium text-neutral-500 tracking-wider flex items-center gap-1.5">
                      <span>{msg.model || 'VibeCoder AI'}</span>
                      {msg.duration !== undefined && (
                        <>
                          <span className="opacity-50">•</span>
                          <span>Took {Math.round(msg.duration)}s</span>
                        </>
                      )}
                    </div>
                    <div 
                      className="notion-prose max-w-none" 
                      style={aiFont !== 'default' ? { fontFamily: aiFont } : undefined}
                    >
                      <Markdown
                        components={{
                          pre({ children }) {
                            // Don't wrap code blocks in an extra <pre> to avoid invalid HTML nesting
                            return <>{children}</>;
                          },
                          code(props) {
                            const { children, className, node, ...rest } = props;
                            const match = /language-(\w+)/.exec(className || '');
                            if (!match && !className?.includes('language-')) {
                              // Inline code
                              return (
                                <code {...rest} className="bg-neutral-800/80 px-1.5 py-0.5 rounded text-neutral-200 font-mono text-[13px]">
                                  {children}
                                </code>
                              );
                            }
                            // Block code
                            return <CodeBlock className={className}>{children}</CodeBlock>;
                          }
                        }}
                      >
                        {msg.content}
                      </Markdown>
                    </div>

                    {/* Diffs Section */}
                    {msg.diffs && msg.diffs.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#2a2a2a]/50">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle size={12} className="text-emerald-500" />
                          <span className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">Synced Updates</span>
                        </div>
                        <div className="space-y-1">
                          {msg.diffs.map((diff, idx) => (
                            <div key={idx} className="flex items-center justify-between px-1 py-1">
                              <span className="text-xs font-mono text-neutral-400 truncate pr-4">{diff.path}</span>
                              <div className="flex items-center gap-3 shrink-0">
                                {diff.linesAdded > 0 && (
                                  <span className="text-[11px] font-mono text-emerald-500/80">+{diff.linesAdded} lines</span>
                                )}
                                {diff.linesRemoved > 0 && (
                                  <span className="text-[11px] font-mono text-rose-500/80">-{diff.linesRemoved} lines</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* GUI Advice Callout */}
                        {msg.diffs.some(d => /startergui|gui|hud|ui|screengui/i.test(d.path)) && (
                          <div className="mt-3 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-[12px] text-neutral-300">
                            <Play size={13} className="shrink-0 text-white" fill="currentColor" />
                            <span>
                              Press the <strong className="text-white">Play</strong> button (<kbd className="bg-neutral-800 text-neutral-200 px-1.5 py-0.5 rounded text-[11px] font-mono border border-neutral-700">F5</kbd>) in Roblox Studio to test and view your game GUI.
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          );
        })}
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className="w-full flex max-w-3xl">
            <div className="flex-1 space-y-1">
              <div className="text-[11px] font-medium text-neutral-500 tracking-wider flex items-center gap-1.5">
                <span>{selectedModel || 'VibeCoder AI'}</span>
                <span className="opacity-50">•</span>
                <span>Running for {runningDuration}s</span>
              </div>
              <div className="flex items-center gap-1.5 h-6">
                <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Gradient Fade for Messages */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none z-10" />

      {/* Floating Input Box Area with Preset Chips above */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-3xl flex flex-col gap-2 z-20">
        
        {/* Horizontal Quick Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1 scrollbar-none no-scrollbar">
          {suggestedPrompts === null ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div 
                key={`skeleton-${idx}`} 
                className="h-[32px] w-[140px] rounded-xl bg-[#2a2a2a]/50 backdrop-blur-xl animate-pulse shrink-0" 
              />
            ))
          ) : (
            suggestedPrompts.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(preset.prompt)}
                disabled={isLoading}
                className="text-[12px] font-medium bg-[#2a2a2a]/50 backdrop-blur-xl hover:bg-[#3a3a3a]/60 text-white px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors shrink-0 flex items-center gap-1.5"
              >
                <CornerDownRight size={13} className="text-white opacity-70" strokeWidth={2.5} /> {preset.label}
              </button>
            ))
          )}
        </div>

        {/* Input Prompt Box - Sleek styling matching home page */}
        <div data-squircle data-squircle-radius="24" data-squircle-smoothing="1" className="w-full bg-[#2a2a2a]/50 backdrop-blur-xl rounded-2xl relative p-4 flex flex-col min-h-[100px]">
          
          {/* Image Attachment Indicator */}
          {selectedImage && (
            <div className="relative mb-1 ml-2 inline-block self-start">
              <img src={selectedImage} alt="Preview" className="h-14 w-14 object-cover rounded-lg border border-[#333]" />
              <button 
                onClick={() => setSelectedImage(null)} 
                className="absolute -top-1.5 -right-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full p-1 border border-neutral-700 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          )}

          {/* Text Input Row */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening... Speak your prompt" : "Ask AI to generate Luau scripts..."}
            className={`w-full flex-1 min-h-[32px] bg-transparent text-[#9e9e9e] px-2 py-1 text-[15px] focus:outline-none placeholder-neutral-400 resize-none font-medium flex items-center transition-colors ${
              isListening ? 'text-white placeholder-white/70 animate-pulse' : ''
            }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />

          {/* Action Controls Row */}
          <div className="flex items-center justify-between">
            {/* Left Buttons Group */}
            <div className="flex items-center gap-2">
              {/* File Upload Trigger as Plus Icon */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-md bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#e0e0e0] hover:text-white transition-colors flex items-center justify-center shrink-0"
                title="Attach image (PNG/JPG)"
              >
                <Plus size={15} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            {/* Right Buttons Group */}
            <div className="flex items-center gap-2.5">
              {/* Microphone Voice Button */}
              <button 
                type="button"
                onClick={toggleSpeechRecognition}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center shrink-0 ${
                  isListening 
                    ? 'bg-white text-black animate-bounce shadow-md' 
                    : 'text-[#e0e0e0] hover:text-white'
                }`}
                title={isListening ? "Listening... Click to stop" : "Voice Input (Speech to Text)"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {/* Send / Stop Button */}
              {isLoading ? (
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  className={`w-9 h-9 text-black rounded-lg flex items-center justify-center shrink-0 ${sendBtn3D ? 'shadow-[0_4px_0_#000000,inset_0_1px_1px_rgba(255,255,255,0.4)] active:shadow-[0_0px_0_#000000,inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-[4px] transition-transform duration-75' : 'shadow-sm transition-all'}`}
                  style={{ backgroundColor: sendBtnColor }}
                  title="Stop generation"
                >
                  <div className="w-3 h-3 bg-black rounded-[2px]" />
                </button>
              ) : (
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={`w-9 h-9 disabled:opacity-50 text-black rounded-lg flex items-center justify-center shrink-0 ${sendBtn3D ? 'shadow-[0_4px_0_#000000,inset_0_1px_1px_rgba(255,255,255,0.4)] active:shadow-[0_0px_0_#000000,inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-[4px] transition-transform duration-75' : 'shadow-sm transition-all'}`}
                  style={{ backgroundColor: sendBtnColor }}
                  title="Send message"
                >
                  <ArrowUpRight className="w-5 h-5 text-black" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

