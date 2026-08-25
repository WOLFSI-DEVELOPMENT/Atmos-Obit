import React, { useEffect, useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articles, Article } from '../data/articles';

interface ArticlesPageProps {
  onNavigate: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth' | 'articles') => void;
}

export function ArticlesPage({ onNavigate }: ArticlesPageProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedArticle]);

  return (
    <div className="w-full min-h-screen bg-[#000000] text-white font-sans selection:bg-neutral-800">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#000000]/80 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden bg-transparent">
            <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="App Icon" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-[16px] text-white tracking-tight">Atmos orbit</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto px-6 pt-32 pb-32">
        {selectedArticle ? (
          /* Article Detail View */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button 
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-[14px] text-[#a0a0a0] hover:text-white transition-colors mb-8 font-medium"
            >
              <ArrowLeft size={16} /> Back to Articles
            </button>

            <h1 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-[#f5f5f5] leading-[1.15] mb-6">
              {selectedArticle.title}
            </h1>

            <div className="flex flex-col gap-3 mb-10">
              <span className="text-[13px] text-[#8a8a8a] font-medium tracking-wide">
                {selectedArticle.date} • {selectedArticle.readTime}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-[#222]">
                  <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="Author" className="w-full h-full object-cover" />
                </div>
                <span className="text-[14px] text-[#a0a0a0] font-medium">{selectedArticle.author}</span>
              </div>
            </div>

            <div className="w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-12 border border-white/5 bg-[#111]">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title}
                className="w-full h-full object-cover opacity-90"
              />
            </div>

            <article className="prose prose-invert prose-lg max-w-[800px] mx-auto 
              prose-p:text-[#d4d4d4] prose-p:leading-relaxed 
              prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white/80 prose-a:transition-colors
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:text-[#d4d4d4] prose-ol:text-[#d4d4d4]
              prose-li:my-1
              prose-blockquote:border-l-[3px] prose-blockquote:border-white/20 prose-blockquote:pl-4 prose-blockquote:not-italic prose-blockquote:before:content-none prose-blockquote:after:content-none prose-blockquote:text-[#d4d4d4] prose-blockquote:bg-white/[0.03] prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
              prose-pre:bg-[#161616] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4
              prose-pre:shadow-sm
              marker:text-white/40 prose-code:before:content-none prose-code:after:content-none
              ">
              <div className="markdown-body">
                <Markdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, className, children, ...props}: any) {
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
                </Markdown>
              </div>
            </article>
          </motion.div>
        ) : (
          /* Article List View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-16">
              <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight text-[#f5f5f5] mb-4">
                Articles & Tutorials
              </h1>
              <p className="text-[18px] text-[#a0a0a0] font-medium">
                In-depth guides and engineering deep-dives for Roblox developers and VibeCoder power users.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, idx) => (
                <motion.button
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => setSelectedArticle(article)}
                  className="group text-left flex flex-col bg-[#111111] border border-white/5 hover:border-white/20 hover:bg-[#161616] transition-all rounded-2xl overflow-hidden"
                >
                  <div className="w-full h-48 bg-[#1a1a1a] relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-[12px] text-[#8a8a8a] font-medium mb-3 uppercase tracking-wider">
                      {article.date}
                    </div>
                    <h2 className="text-[20px] font-semibold text-[#f5f5f5] leading-tight mb-3 group-hover:text-white transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-[14px] text-[#a0a0a0] leading-relaxed line-clamp-3 mb-6 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex items-center text-[#0a84ff] text-[13px] font-medium gap-1 group-hover:gap-2 transition-all">
                      Read full article <ChevronRight size={14} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
