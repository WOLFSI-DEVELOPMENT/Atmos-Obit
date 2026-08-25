import re

with open('src/components/HomeLayout.tsx', 'r') as f:
    content = f.read()

# 1. Update the tab button to include ChevronDown
old_button = """          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-[13px] font-medium text-white/80 hover:text-white transition-colors"
          >
            <Folder size={14} className="text-white/60" />
            {selectedProject ? selectedProject.name : 'Choose project'}
          </button>"""

new_button = """          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white transition-colors"
          >
            <Folder size={14} className="text-white/60 mr-0.5" />
            {selectedProject ? selectedProject.name : 'Choose project'}
            <ChevronDown size={14} className="text-white/40 ml-0.5" />
          </button>"""

content = content.replace(old_button, new_button)

# 2. Update the dropdown container
old_dropdown = """        {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-12 left-0 w-full bg-[#262626] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-2 fade-in duration-200">"""

new_dropdown = """        {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute -top-1 left-4 w-[260px] bg-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-2 fade-in duration-200 border border-white/5">"""

content = content.replace(old_dropdown, new_dropdown)

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(content)
