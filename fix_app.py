import re

with open('api/_app.ts', 'r') as f:
    code = f.read()

# Remove vite import
code = re.sub(r"import \{ createServer as createViteServer \} from 'vite';\n?", "", code)

# Remove the vite middleware block at the bottom
vite_block_pattern = r"// --- Vite Middleware ---[\s\S]*"
code = re.sub(vite_block_pattern, "", code)

with open('api/_app.ts', 'w') as f:
    f.write(code)

