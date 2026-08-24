import re
with open('server.ts', 'r') as f:
    code = f.read()

code = code.replace("import { createServer as createViteServer } from 'vite';\nimport path from 'path';\n", "")
code = "import { createServer as createViteServer } from 'vite';\nimport path from 'path';\n" + code
with open('server.ts', 'w') as f:
    f.write(code)
