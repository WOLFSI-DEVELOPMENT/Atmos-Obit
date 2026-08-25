with open('src/components/ArticlesPage.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "<span className=\"font-bold text-[16px] text-white tracking-tight\">VibeCoder</span>",
    "<span className=\"font-bold text-[16px] text-white tracking-tight\">Atmos orbit</span>"
)

with open('src/components/ArticlesPage.tsx', 'w') as f:
    f.write(content)
