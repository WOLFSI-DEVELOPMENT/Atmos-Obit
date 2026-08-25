import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "  if (view === 'blog') {\n    return <BlogPage onNavigate={handleNavigate} />;\n  }",
    "  if (view === 'blog') {\n    return <BlogPage onNavigate={handleNavigate} />;\n  }\n\n  if (view === 'articles') {\n    return <ArticlesPage onNavigate={handleNavigate} />;\n  }"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
