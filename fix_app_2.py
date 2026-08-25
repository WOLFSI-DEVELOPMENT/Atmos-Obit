import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Change handleCreateProject to accept the name directly as an argument, so it doesn't rely on state
content = content.replace(
    "const handleCreateProject = async (e?: React.FormEvent, initialPrompt?: string, file?: File | null) => {",
    "const handleCreateProject = async (e?: React.FormEvent, initialPrompt?: string, file?: File | null, directName?: string) => {"
)

content = content.replace(
    "const name = newProjectName.trim() || PROJECT_NAMES[Math.floor(Math.random() * PROJECT_NAMES.length)];",
    "const name = (directName || newProjectName).trim() || PROJECT_NAMES[Math.floor(Math.random() * PROJECT_NAMES.length)];"
)

content = content.replace(
    "handleCreateProject(undefined, undefined, file);",
    "handleCreateProject(undefined, undefined, file, name);"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
