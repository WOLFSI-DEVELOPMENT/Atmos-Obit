with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "res.clearCookie('auth_token');",
    "res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'none' });"
)

with open('server.ts', 'w') as f:
    f.write(content)
print("Fixed logout cookie clearance")
