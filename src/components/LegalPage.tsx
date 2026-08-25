import React, { useEffect, useState, useRef } from 'react';
import { Download, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  readingTime: string;
  intro: React.ReactNode;
  sections: LegalSection[];
  onNavigate: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth' | 'articles') => void;
}

export function LegalPage({ title, lastUpdated, readingTime, intro, sections, onNavigate }: LegalPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  
  // Update active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      
      let currentActive = sections[0]?.id;
      for (const el of sectionElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActive = el.id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-neutral-800">
      
      {/* Navbar (Simple) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden bg-transparent">
            <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787673321/squircle-n4_abdl5u.png" alt="App Icon" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-[16px] text-white tracking-tight">Atmos orbit</span>
        </button>
      </nav>

      {/* Main Content Layout */}
      <div className="max-w-[1100px] mx-auto px-6 pt-32 pb-24 flex flex-col md:flex-row gap-16 relative">
        
        {/* Left Sidebar - Sticky Navigation */}
        <aside className="w-full md:w-[240px] shrink-0">
          <div className="sticky top-32">
            <h3 className="text-[13px] font-bold text-white/40 uppercase tracking-wider mb-4 px-3">Contents</h3>
            <nav className="flex flex-col">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                    activeSection === section.id 
                      ? 'bg-[#1a1a1a] text-white font-medium' 
                      : 'text-[#8a8a8a] hover:text-[#d0d0d0] hover:bg-[#111]'
                  }`}
                >
                  <span className="opacity-50 mr-2">{index + 1}.</span> {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 max-w-[700px]">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[13px] text-[#606060] mb-6 font-medium">
            <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Home</button>
            <ChevronRight size={12} />
            <span>Legal</span>
            <ChevronRight size={12} />
            <span className="text-white/70">{title}</span>
          </div>

          <h1 className="text-[40px] md:text-[48px] font-semibold tracking-tight text-white mb-6">
            {title}
          </h1>
          
          <div className="text-[#a0a0a0] text-[16px] leading-relaxed mb-8">
            {intro}
          </div>

          {/* Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-y border-white/10 mb-16 gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] border border-white/5 rounded-lg text-[13px] font-medium text-white transition-colors w-fit">
              <Download size={14} />
              Download PDF
            </button>
            <div className="flex items-center gap-6 text-[13px] text-[#606060] font-medium">
              <span>Last Updated: {lastUpdated}</span>
              <span>Reading time: {readingTime}</span>
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-12">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="text-[24px] font-semibold text-white mb-6">
                  {index + 1}. {section.title}
                </h2>
                <div className="text-[#8a8a8a] text-[15px] leading-relaxed space-y-4">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
