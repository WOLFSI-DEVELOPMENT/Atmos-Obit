import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

# The user might have OpenAI (Coming Soon) as well as Anthropic (Coming Soon).
# We can search for the start of these blocks and strip them out.
# They both start with `<div className="space-y-4 opacity-50 cursor-not-allowed mt-6">`

# OpenAI
content = re.sub(
    r'<div className="space-y-4 opacity-50 cursor-not-allowed mt-6">\s*<div className="flex items-center gap-3 ml-2">\s*<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1280px-ChatGPT-Logo.svg.png" className="w-5 h-5 object-contain invert opacity-80" alt="ChatGPT" />\s*<h3 className="text-\[13px\] text-\[#8e8e93\] uppercase font-medium">OpenAI \(Coming Soon\)</h3>.*?</div>\s*</div>\s*</div>',
    '',
    content, flags=re.DOTALL
)

# Anthropic
content = re.sub(
    r'<div className="space-y-4 opacity-50 cursor-not-allowed mt-6">\s*<div className="flex items-center gap-3 ml-2">\s*<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/960px-Claude_AI_symbol.svg.png" className="w-5 h-5 object-contain" alt="Claude" />\s*<h3 className="text-\[13px\] text-\[#8e8e93\] uppercase font-medium">Anthropic \(Coming Soon\)</h3>.*?</div>\s*</div>\s*</div>',
    '',
    content, flags=re.DOTALL
)

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content)

print("Stripped 'Coming Soon' sections")
