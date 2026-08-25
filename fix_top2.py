import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "messages: initialPrompt ? [{role: 'user', content: initialPrompt}, {role: 'model', content: `Project created! Processing: ${initialPrompt}`}] : [\n          { role: 'model', content: `Successfully reconnected to workspace **${name}** with PIN \\`${pin}\\`. Start chatting to write code!` }",
    "messages: [\n          { role: 'model', content: `Successfully reconnected to workspace **${name}** with PIN \\`${pin}\\`. Start chatting to write code!` }"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
