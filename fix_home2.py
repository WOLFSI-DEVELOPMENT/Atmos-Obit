import re

with open('src/components/HomeLayout.tsx', 'r') as f:
    content = f.read()

old_pill = """        {/* Project Selector Tab (Pill) */}
        <div className="absolute -top-10 left-2 z-20">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#262626] hover:bg-[#333] text-white/90 px-4 py-1.5 rounded-full flex items-center gap-2 text-[13px] font-medium transition-colors shadow-md border border-[#333]"
          >
            <Folder size={14} className="text-white/60" />
            {selectedProject ? selectedProject.name : 'Choose project'}
            <ChevronDown size={14} className="text-[#888] ml-1" />
          </button>"""

new_pill = """        {/* Project Selector Tab (Wide Background) */}
        <div className="absolute -top-9 left-2 right-2 bg-[#262626] rounded-t-2xl pt-2.5 px-4 pb-4 flex items-start gap-6 z-0">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-[13px] font-medium text-white/80 hover:text-white transition-colors"
          >
            <Folder size={14} className="text-white/60" />
            {selectedProject ? selectedProject.name : 'Choose project'}
          </button>
          <div className="flex items-center gap-2 text-[13px] font-medium text-white/60">
            <Monitor size={14} />
            Local
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-white/60">
            <GitBranch size={14} />
            master
          </div>"""

content = content.replace(old_pill, new_pill)

# Remove borders from dropdown
content = content.replace(
    'className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#262626] border border-[#333] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-2 fade-in duration-200"',
    'className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#262626] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-2 fade-in duration-200"'
)

content = content.replace(
    'className="p-2 border-b border-white/10 flex items-center gap-2 px-3"',
    'className="p-2 flex items-center gap-2 px-3 pb-1"'
)

content = content.replace(
    'className="border-t border-white/10 p-1"',
    'className="p-1 pt-0"'
)

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(content)
