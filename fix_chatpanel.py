import re

with open('src/components/ChatPanel.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"const orchestratorEnabled = localStorage.getItem\('vibecoder_orchestrator_enabled'\) !== 'false';",
    "const orchestratorEnabled = localStorage.getItem('vibecoder_orchestrator_enabled') !== 'false';\n      const guiCreationEnabled = localStorage.getItem('vibecoder_exp_gui_creation') === 'true';",
    content
)

content = re.sub(
    r"guiStyle,\n\s*orchestratorEnabled\n\s*}\),",
    "guiStyle,\n          orchestratorEnabled,\n          guiCreationEnabled\n        }),",
    content
)

with open('src/components/ChatPanel.tsx', 'w') as f:
    f.write(content)
