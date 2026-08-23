import { useState, useEffect } from 'react';
import { Folder, FileCode, ChevronRight, ChevronDown, Package } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'Folder' | 'Script' | 'LocalScript' | 'ModuleScript' | 'Part' | 'Model';
  children?: FileNode[];
}

function TreeNode({ node }: { node: FileNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-2">
      <div 
        className="flex items-center gap-2 py-1 cursor-pointer hover:bg-[#222] rounded-none px-1 text-sm text-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasChildren && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        {!hasChildren && <span className="w-[14px]"></span>}
        {node.type === 'Folder' || node.type === 'Model' ? <Folder size={16} className="text-yellow-500" /> : <FileCode size={16} className="text-blue-400" />}
        {node.name}
      </div>
      {isOpen && hasChildren && (
        <div className="ml-2 border-l border-[#333]">
          {node.children!.map((child, i) => (
            <TreeNode key={i} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer({ pin }: { pin: string }) {
  const [data, setData] = useState<FileNode | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<{ path: string; type: string; content: string; }[]>([]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(`/api/sync/state/${pin}`);
        if (res.ok) {
          const { state, files } = await res.json();
          setData(state);
          setGeneratedFiles(files || []);
        }
      } catch (e) {
        console.error('Error fetching game state', e);
      }
    };
    
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, [pin]);

  if (!data) return <div className="p-4 text-gray-500 text-sm">Loading workspace...</div>;

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-4 flex items-center gap-2 bg-black">
        <Package size={18} className="text-blue-400" />
        <h3 className="text-white font-semibold text-base">Workspace Explorer</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <h4 className="text-gray-400 text-xs font-bold uppercase p-2">Game Objects</h4>
        <TreeNode node={data} />
        
        <h4 className="text-gray-400 text-xs font-bold uppercase p-2 mt-4 border-t border-[#333]">Generated Scripts</h4>
        {generatedFiles.map((file, i) => (
            <div key={i} className="flex items-center gap-2 py-1 px-4 text-sm text-gray-300 hover:bg-[#222] rounded-none">
                <FileCode size={14} className="text-blue-400" />
                {file.path.split('.').pop()} ({file.type})
            </div>
        ))}
      </div>
    </div>
  );
}
