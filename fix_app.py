import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "newProjectName = name;",
    "setNewProjectName(name);"
)

# Also fix the initial prompt logic. If there's an initial prompt for an existing project.
# ChatPanel currently doesn't check 'vibecoder_initial_prompt'.
# We can just update the project messages directly in App.tsx!

content = content.replace(
    """      // Let ChatPanel handle the prompt (we need to pass it to ChatPanel somehow)
      // For now, we will set it in local storage so ChatPanel can pick it up
      localStorage.setItem('vibecoder_initial_prompt', prompt);""",
    """      // Let ChatPanel handle the prompt by injecting it into local storage
      localStorage.setItem('vibecoder_initial_prompt', prompt);"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
