import re

with open('src/components/HomeLayout.tsx', 'r') as f:
    content = f.read()

old_tab = """        {/* Project Selector Tab (Wide Background) */}
        <div className="absolute -top-9 left-2 right-2 bg-[#262626] rounded-t-2xl pt-2.5 px-4 pb-4 flex items-start gap-6 z-0">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white transition-colors"
          >
            <Folder size={14} className="text-white/60 mr-0.5" />
            {selectedProject ? selectedProject.name : 'Choose project'}
            <ChevronDown size={14} className="text-white/40 ml-0.5" />
          </button>


                  </div>"""

new_tab = """        {/* Project Selector Tab (Wide Background) */}
        <div className="absolute -top-9 left-2 right-2 bg-[#262626] rounded-t-2xl pt-2.5 px-4 pb-4 flex items-start gap-6 z-0">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white transition-colors"
          >
            <Folder size={14} className="text-white/60 mr-0.5" />
            {selectedProject ? selectedProject.name : 'Choose project'}
            <ChevronDown size={14} className="text-white/40 ml-0.5" />
          </button>
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-white/60 cursor-pointer hover:text-white/80 transition-colors">
            <Monitor size={14} />
            Local
            <ChevronDown size={14} className="text-white/40 ml-0.5" />
          </div>
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-white/60 cursor-pointer hover:text-white/80 transition-colors">
            <GitBranch size={14} />
            master
            <ChevronDown size={14} className="text-white/40 ml-0.5" />
          </div>
        </div>"""

content = content.replace(old_tab, new_tab)

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(content)
