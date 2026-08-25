import re

with open('src/components/HomeLayout.tsx', 'r') as f:
    content = f.read()

# 1. Import ArrowUp
content = content.replace(
    "import { Cloud, Search, Plus, Mic, MicOff, Folder, Code, Terminal, Upload, X, RefreshCw, Bug, Check, ChevronDown, Monitor, GitBranch } from 'lucide-react';",
    "import { Cloud, Search, Plus, Mic, MicOff, Folder, Code, Terminal, Upload, X, RefreshCw, Bug, Check, ChevronDown, Monitor, GitBranch, ArrowUp } from 'lucide-react';"
)

# 2. Replace button
old_button = """              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{ backgroundColor: sendBtnColor }}
              >
                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-[6px] border-l-white border-b-4 border-b-transparent ml-0.5" />
              </button>"""

new_button = """              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-white hover:scale-105' : 'bg-[#3a3a3c] opacity-50'}`}
              >
                <ArrowUp size={16} className={input.trim() ? 'text-black' : 'text-white'} strokeWidth={3} />
              </button>"""

content = content.replace(old_button, new_button)

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(content)
