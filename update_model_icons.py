import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace Gemini header
    content = content.replace(
        '<Zap size={14} className="text-blue-400" />',
        '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Google_Gemini_icon_2025.svg/960px-Google_Gemini_icon_2025.svg.png" className="w-4 h-4 object-contain" alt="Google Gemini" />'
    )
    # Replace Anthropic header
    content = content.replace(
        '<Sparkles size={14} className="text-orange-400" />',
        '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/960px-Claude_AI_symbol.svg.png" className="w-4 h-4 object-contain" alt="Claude" />'
    )
    # Replace OpenAI header
    content = content.replace(
        '<BrainCircuit size={14} className="text-green-400" />',
        '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1280px-ChatGPT-Logo.svg.png" className="w-4 h-4 object-contain invert opacity-80" alt="ChatGPT" />'
    )

    with open(filepath, 'w') as f:
        f.write(content)

update_file('src/components/HomeLayout.tsx')
update_file('src/components/ChatPanel.tsx')
print("Model icons updated successfully!")
