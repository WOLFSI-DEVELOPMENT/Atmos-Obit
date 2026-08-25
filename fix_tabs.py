import re

with open('src/components/HomeLayout.tsx', 'r') as f:
    content = f.read()

old_content = """          <div className="flex items-center gap-2 text-[13px] font-medium text-white/60">
            <Monitor size={14} />
            Local
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-white/60">
            <GitBranch size={14} />
            master
          </div>"""

content = content.replace(old_content, "")

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(content)
