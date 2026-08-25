import re

with open('src/components/HomeLayout.tsx', 'r') as f:
    content = f.read()

# 1. Update the "Approve for me" removal
approve_section = """              <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                  <Check size={10} />
                </div>
                <span className="text-[13px] font-medium">Approve for me</span>
              </div>"""
content = content.replace(approve_section, "")

# 2. Update the input box container color and roundedness
content = content.replace(
    'className="w-full bg-[#2a2a2a] rounded-2xl rounded-tl-none p-4 flex flex-col min-h-[120px] shadow-lg"',
    'className="w-full bg-[#303030] rounded-2xl p-4 flex flex-col min-h-[120px] shadow-lg relative z-10"'
)

# 3. Update the Project Selector Button (Pill)
old_pill = """        {/* Project Selector Tab (Pill) */}
        <div className="absolute -top-10 left-0">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#2a2a2a] hover:bg-[#333] text-white/90 px-4 py-2 rounded-t-xl rounded-b-none flex items-center gap-2 text-[13px] font-medium transition-colors border-b border-white/5"
          >
            <Folder size={14} className="text-white/60" />
            {selectedProject ? selectedProject.name : 'Choose project'}
          </button>"""

new_pill = """        {/* Project Selector Tab (Pill) */}
        <div className="absolute -top-10 left-2 z-20">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#262626] hover:bg-[#333] text-white/90 px-4 py-1.5 rounded-full flex items-center gap-2 text-[13px] font-medium transition-colors shadow-md border border-[#333]"
          >
            <Folder size={14} className="text-white/60" />
            {selectedProject ? selectedProject.name : 'Choose project'}
            <ChevronDown size={14} className="text-[#888] ml-1" />
          </button>"""

content = content.replace(old_pill, new_pill)

# 4. Update Dropdown Menu styling and positioning
old_dropdown = """          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-[320px] bg-[#222] border border-white/10 rounded-xl rounded-tl-none shadow-2xl z-50 overflow-hidden flex flex-col">"""

new_dropdown = """          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#262626] border border-[#333] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-2 fade-in duration-200">"""

content = content.replace(old_dropdown, new_dropdown)

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(content)
