import { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Eye, Code2, Columns, Menu, SquareStack, ChevronDown, Download, Check, Play, Square, Image as ImageIcon, Monitor, Tablet, Smartphone } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { RobloxEnginePreview } from './RobloxEnginePreview';
import { Project } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ArtifactsPanelProps {
  project: Project;
  onClose: () => void;
  onFilesUpdate?: (files: { path: string; type: string; content: string }[]) => void;
}

export function ArtifactsPanel({ project, onClose, onFilesUpdate }: ArtifactsPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'assets'>('preview');
  const [files, setFiles] = useState<{ path: string; type: string; content: string }[]>(project.files || []);
  const [selectedFile, setSelectedFile] = useState<{ path: string; type: string; content: string } | null>(project.files?.[0] || null);
  const selectedFileRef = useRef(selectedFile);
  
  useEffect(() => {
    selectedFileRef.current = selectedFile;
  }, [selectedFile]);

  useEffect(() => {
    if (project.files && project.files.length > 0) {
      setFiles(project.files);
      if (!selectedFileRef.current) {
        setSelectedFile(project.files[0]);
      }
    }
  }, [project.files]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isPlayMode, setIsPlayMode] = useState(false);
  const [devicePreset, setDevicePreset] = useState<'pc' | 'mobile' | 'tablet'>('pc');
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);

  const fetchFiles = async () => {
    if (!project.pin) return;
    try {
      const res = await fetch(`/api/sync/state/${project.pin}`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        if (data.files && onFilesUpdate) {
           // only update if different length to avoid infinite loop
           if (project.files?.length !== data.files.length) {
              onFilesUpdate(data.files);
           }
        }
        if (!selectedFileRef.current && data.files && data.files.length > 0) {
          setSelectedFile(data.files[0]);
        }
      }
    } catch (e) {
      console.error("Failed to fetch files", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!project.pin) {
      setIsLoading(false);
      return;
    }
    
    fetchFiles();
    const interval = setInterval(fetchFiles, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [project.pin]);

  const handleZipExport = async () => {
    setIsExportDropdownOpen(false);
    if (files.length === 0) return;
    
    const zip = new JSZip();
    
    files.forEach(file => {
      // In Rojo projects, sometimes paths have leading slashes or src/ prefixes.
      // We'll just use the path as provided.
      zip.file(file.path, file.content);
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    const safeName = (project.name || 'RobloxProject').replace(/[^a-zA-Z0-9]/g, '_');
    saveAs(content, `${safeName}_export.zip`);
  };

  const handleSyncChanges = () => {
    setIsExportDropdownOpen(false);
    if (project.status !== 'connected') {
      setIsSyncModalOpen(true);
    } else {
      setSyncStatusMsg('Changes are being synced automatically to Roblox Studio.');
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }
  };

  // Try to determine language based on extension
  const getLanguage = (path: string) => {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
    if (path.endsWith('.json') || path.endsWith('.project.json')) return 'json';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.lua') || path.endsWith('.luau')) return 'lua';
    return 'plaintext';
  };

  return (
    <div className="w-[600px] xl:flex-1 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-right-4 duration-300 ease-out h-[calc(100%-14px)] my-[7px] mx-[7px] shadow-2xl">
      {/* Top Header */}
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-3 bg-[#111111] shrink-0">
        <div className="flex items-center gap-1">
          {/* Browser-like controls */}
          <div className="flex items-center gap-1.5 mr-4 opacity-50 px-2">
            <button onClick={() => window.dispatchEvent(new CustomEvent('regenerate-code'))} className="hover:text-white transition-colors" title="Regenerate Code">
              <RefreshCw size={14} className="ml-1 cursor-pointer" />
            </button>
          </div>
          
          <button 
            onClick={() => setActiveTab('preview')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'preview' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            title="Preview"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'code' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            title="Code"
          >
            <Code2 size={16} />
          </button>
          <button 
            onClick={() => setActiveTab('assets')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'assets' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            title="Assets"
          >
            <ImageIcon size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-neutral-400">
           {/* PLAY BUTTON */}
           <button
             onClick={() => setIsPlayMode(!isPlayMode)}
             className={`flex items-center justify-center p-1.5 rounded-lg text-sm font-medium transition-colors ${isPlayMode ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'}`}
             title={isPlayMode ? "Stop Playtest" : "Play (First Person)"}
           >
             {isPlayMode ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
           </button>
           {/* EXPORT BUTTON */}
           <div className="relative">
             <button 
               onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
             >
               Export <ChevronDown size={14} />
             </button>
             
             {isExportDropdownOpen && (
               <>
                 <div 
                   className="fixed inset-0 z-40" 
                   onClick={() => setIsExportDropdownOpen(false)}
                 />
                 <div className="absolute top-full right-0 mt-2 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                   <button onClick={handleZipExport} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
                     <Download size={14} /> ZIP File Export
                   </button>
                   <button onClick={handleSyncChanges} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
                     <RefreshCw size={14} /> Sync Changes
                   </button>
                   <button onClick={() => { setIsExportDropdownOpen(false); window.dispatchEvent(new CustomEvent('regenerate-code')); }} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
                     <RefreshCw size={14} /> Regenerate Code
                   </button>
                 </div>
               </>
             )}
           </div>

                       {/* DEVICE PRESET DROPDOWN */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
                className="p-2 bg-[#1e1e22] hover:bg-white/10 text-neutral-300 hover:text-white rounded-lg transition-colors flex items-center justify-center border border-white/5"
                title="Viewport Device Preset"
              >
                {devicePreset === 'pc' && <Monitor size={16} />}
                {devicePreset === 'tablet' && <Tablet size={16} />}
                {devicePreset === 'mobile' && <Smartphone size={16} />}
              </button>

              {isDeviceDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDeviceDropdownOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    <button
                      onClick={() => { setDevicePreset('pc'); setIsDeviceDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-2.5 transition-colors ${devicePreset === 'pc' ? 'bg-white/15 text-white font-medium' : 'text-neutral-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      <Monitor size={14} /> PC Desktop
                    </button>
                    <button
                      onClick={() => { setDevicePreset('tablet'); setIsDeviceDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-2.5 transition-colors ${devicePreset === 'tablet' ? 'bg-white/15 text-white font-medium' : 'text-neutral-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      <Tablet size={14} /> Tablet (iPad)
                    </button>
                    <button
                      onClick={() => { setDevicePreset('mobile'); setIsDeviceDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-2.5 transition-colors ${devicePreset === 'mobile' ? 'bg-white/15 text-white font-medium' : 'text-neutral-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      <Smartphone size={14} /> Mobile (Phone)
                    </button>
                  </div>
                </>
              )}
            </div>

            <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors ml-2" onClick={onClose} title="Close Panel">
              <Columns size={16} />
           </button>
        </div>
      </div>

      {/* Toast Notification */}
      {syncStatusMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#2a2a2a] text-white text-sm px-4 py-2 rounded-lg shadow-xl border border-white/10 flex items-center gap-2 z-[60] animate-in fade-in slide-in-from-top-4">
          <Check size={14} className="text-green-400" />
          {syncStatusMsg}
        </div>
      )}

      {/* Sync Modal for Disconnected State */}
      {isSyncModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-[400px] shadow-2xl relative animate-in fade-in zoom-in-95">
            <button onClick={() => setIsSyncModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold text-white mb-2">Connect to Roblox Studio</h3>
            <p className="text-sm text-neutral-400 mb-6">You are currently disconnected. To sync changes directly to Roblox Studio, please install the VibeCoder plugin.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsSyncModalOpen(false)} 
                className="px-4 py-2 bg-transparent text-neutral-300 font-medium rounded-lg text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => window.open('https://create.roblox.com/store/asset/115974186525830', '_blank')} 
                className="px-4 py-2 bg-white text-black font-medium rounded-lg text-sm hover:bg-neutral-200 transition-colors"
              >
                Install Plugin
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'preview' ? (
          <div className="flex-1 flex bg-black overflow-hidden relative">
             <RobloxEnginePreview 
               code={selectedFile?.content || ''} 
               files={files} 
               isPlayMode={isPlayMode} 
               devicePreset={devicePreset}
             />
          </div>
        ) : activeTab === 'assets' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No assets yet</h3>
              <p className="text-neutral-400 text-sm max-w-sm">
                Any images, decals, meshes, or textures you generate will appear here in a moodboard grid.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* File Sidebar */}
            {isSidebarOpen && (
              <div className="w-[220px] bg-[#0c0c0c] border-r border-white/5 flex flex-col shrink-0">
                <div className="p-3 border-b border-white/5 flex justify-between items-center bg-[#111111]">
                   <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                     <Menu size={14} /> Files
                   </span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
                  {files.length === 0 ? (
                    <div className="text-xs text-neutral-600 text-center mt-10">No files generated yet.</div>
                  ) : (
                    files.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left truncate transition-colors ${selectedFile?.path === file.path ? 'bg-blue-600/20 text-blue-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        <SquareStack size={14} className="shrink-0 opacity-70" />
                        <span className="truncate">{file.path}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* Monaco Editor */}
            <div className="flex-1 bg-[#1e1e1e] flex flex-col relative min-w-0">
               {/* Quick file path header */}
               <div className="h-9 border-b border-white/5 bg-[#1e1e1e] flex items-center px-3 text-xs text-neutral-400 gap-2 shrink-0">
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-white/10 rounded">
                     <Menu size={14} />
                  </button>
                  {selectedFile ? selectedFile.path : 'No file selected'}
               </div>
               
               {selectedFile ? (
                 <Editor
                   height="100%"
                   language={getLanguage(selectedFile.path)}
                   theme="vs-dark"
                   value={selectedFile.content}
                   options={{
                     minimap: { enabled: true },
                     fontSize: 13,
                     wordWrap: 'on',
                     scrollBeyondLastLine: false,
                     readOnly: true,
                     smoothScrolling: true,
                     cursorBlinking: 'smooth',
                     padding: { top: 16 }
                   }}
                 />
               ) : (
                 <div className="flex-1 flex items-center justify-center text-neutral-600 text-sm">
                   Select a file to view code
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
