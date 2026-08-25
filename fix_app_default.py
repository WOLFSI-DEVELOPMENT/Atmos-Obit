import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "return localStorage.getItem('vibecoder_beta_home_layout') === 'true';",
    "const stored = localStorage.getItem('vibecoder_beta_home_layout');\n    return stored === null ? true : stored === 'true';"
)

content = content.replace(
    "setBetaHomeLayout(localStorage.getItem('vibecoder_beta_home_layout') === 'true');",
    "const b = localStorage.getItem('vibecoder_beta_home_layout');\n      setBetaHomeLayout(b === null ? true : b === 'true');"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
