import re

with open('src/components/HomeLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace('w-[260px]', 'w-[220px]')

# Make search input text slightly smaller and more compact
content = content.replace(
    'className="p-2 flex items-center gap-2 px-3 pb-1"',
    'className="p-1.5 flex items-center gap-2 px-2.5 pb-1"'
)

content = content.replace(
    'className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-white/5 text-white/90 text-[13px] transition-colors"',
    'className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 hover:bg-[#333] text-white/90 text-[13px] transition-colors rounded-lg my-0.5"'
)

content = content.replace(
    'className="px-3 py-2 text-[13px] text-[#888]"',
    'className="px-2.5 py-2 text-[13px] text-[#888] text-center"'
)

content = content.replace(
    'className="max-h-[200px] overflow-y-auto py-1"',
    'className="max-h-[200px] overflow-y-auto px-1.5 pb-1.5"'
)

content = content.replace(
    'className="p-1 pt-0"',
    'className="p-1.5 pt-0 border-t border-white/10"'
)

content = content.replace(
    'className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-white/5 text-white/90 text-[13px] transition-colors rounded-md"',
    'className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 hover:bg-[#333] text-white/90 text-[13px] transition-colors rounded-lg"'
)

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(content)
