with open('server.ts', 'r') as f:
    lines = f.readlines()
    
# Remove lines 1 and 2
lines = lines[2:]

with open('server.ts', 'w') as f:
    f.writelines(lines)
