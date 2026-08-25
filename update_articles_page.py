import re

with open('src/components/ArticlesPage.tsx', 'r') as f:
    content = f.read()

# Add remarkGfm import
if 'remarkGfm' not in content:
    content = content.replace("import Markdown from 'react-markdown';", "import Markdown from 'react-markdown';\nimport remarkGfm from 'remark-gfm';")

# Update article class
old_article_class = 'className="prose prose-invert prose-lg max-w-none prose-pre:bg-[#161616] prose-pre:border prose-pre:border-white/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[#0a84ff]"'

new_article_class = '''className="prose prose-invert prose-lg max-w-[800px] mx-auto 
              prose-p:text-[#d4d4d4] prose-p:leading-relaxed 
              prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white/80 prose-a:transition-colors
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:text-[#d4d4d4] prose-ol:text-[#d4d4d4]
              prose-li:my-1
              prose-blockquote:border-l-[3px] prose-blockquote:border-white/20 prose-blockquote:pl-4 prose-blockquote:not-italic prose-blockquote:text-[#d4d4d4] prose-blockquote:bg-white/[0.03] prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
              prose-pre:bg-[#161616] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4
              prose-pre:shadow-sm
              marker:text-white/40
              "'''

content = content.replace(old_article_class, new_article_class)

# Update Markdown tag
old_markdown_tag = '<Markdown>{selectedArticle.content}</Markdown>'

new_markdown_tag = '''<Markdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match;
                      if (!isInline) {
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className="text-[#eb5757] bg-white/10 px-[0.3em] py-[0.2em] rounded-[3px] font-mono text-[0.85em] before:content-none after:content-none" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {selectedArticle.content}
                </Markdown>'''

content = content.replace(old_markdown_tag, new_markdown_tag)

# Fix quotes added by tailwind typography on blockquotes (if any) and code
# Actually Tailwind typography adds quotes to blockquote. We can disable it via tailwind classes:
content = content.replace('prose-blockquote:not-italic', 'prose-blockquote:not-italic prose-blockquote:quotes-none')

with open('src/components/ArticlesPage.tsx', 'w') as f:
    f.write(content)
print("Updated ArticlesPage.tsx")
