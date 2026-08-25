import re

with open('src/components/SettingsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "onModelChange: (modelId: string) => void;",
    "onModelChange: (modelId: string) => void;\n  betaHomeLayout?: boolean;\n  onBetaHomeLayoutChange?: (val: boolean) => void;"
)

content = content.replace(
    "onLogout, selectedModel, onModelChange }: SettingsModalProps) {",
    "onLogout, selectedModel, onModelChange, betaHomeLayout = false, onBetaHomeLayoutChange }: SettingsModalProps) {"
)

with open('src/components/SettingsModal.tsx', 'w') as f:
    f.write(content)
