with open('server.ts', 'r') as f:
    code = f.read()

code = "import { createServer as createViteServer } from 'vite';\n" + code

with open('server.ts', 'w') as f:
    f.write(code)
