with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "<button onClick={() => onNavigate?.('blog')} className=\"text-white/70 hover:text-white font-medium transition-colors\">Blog</button>",
    "<button onClick={() => onNavigate?.('blog')} className=\"text-white/70 hover:text-white font-medium transition-colors\">Blog</button>\n            <button onClick={() => onNavigate?.('articles')} className=\"text-white/70 hover:text-white font-medium transition-colors\">Articles</button>"
)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
