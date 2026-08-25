import sys

with open("server.ts", "r") as f:
    code = f.read()

code = code.replace(
    'DO NOT use markdown code blocks for the code. Only output the JSON.\\nCRITICAL:',
    'DO NOT use markdown code blocks for the code. Only output the JSON.\\n\\nCRITICAL:'
)
code = code.replace('\\n\\nCRITICAL:', '\n\nCRITICAL:')

with open("server.ts", "w") as f:
    f.write(code)
