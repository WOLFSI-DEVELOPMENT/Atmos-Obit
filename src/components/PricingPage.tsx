import React, { useEffect, useState } from 'react';
import { ChevronRight, Check, Tag, Zap } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth') => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#000000] text-white font-sans selection:bg-neutral-800 pb-32">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#000000]/80 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-[32px] [corner-shape:squircle] flex items-center justify-center relative overflow-hidden bg-transparent">
            <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="App Icon" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-[16px] text-white tracking-tight">Atmos orbit</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 pt-32">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[32px] [corner-shape:squircle] bg-[#020617] text-indigo-400 text-[14px] font-medium mb-6 border border-[#1e1b4b]">
            <Tag size={14} />
            <span>Pricing</span>
          </div>
          <h1 className="text-[40px] md:text-[56px] font-medium tracking-tight text-[#f5f5f5] mb-6">
            Curated Pricing Structure
          </h1>
          <p className="text-[18px] text-[#a0a0a0] max-w-[650px] mx-auto leading-relaxed mb-10">
            Currently, Atmos Orbit is in Beta. The Free plan is the only active plan and operates on a Bring Your Own Key (BYOK) model. Premium and Enterprise plans are coming soon.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center p-1 bg-[#111111] border border-white/10 rounded-[32px] [corner-shape:squircle]">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-[32px] [corner-shape:squircle] text-[15px] font-medium transition-all ${!isYearly ? 'bg-[#222222] text-white shadow-lg border border-white/5' : 'text-[#8a8a8a] hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-[32px] [corner-shape:squircle] text-[15px] font-medium transition-all flex items-center gap-2 ${isYearly ? 'bg-[#222222] text-white shadow-lg border border-white/5' : 'text-[#8a8a8a] hover:text-white'}`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded-[32px] [corner-shape:squircle] bg-indigo-500/20 text-indigo-400 text-[11px] font-bold uppercase tracking-wide">Save 16%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-[1200px] mx-auto items-start">
          
          {/* Starter / Free Tier */}
          <div className="bg-[#111111] rounded-[32px] [corner-shape:squircle] p-10 flex flex-col mt-0 md:mt-12">
            <h3 className="text-[24px] font-medium text-white mb-4">Free</h3>
            <div className="mb-4 flex items-end gap-1">
              <span className="text-[56px] font-medium text-white tracking-tighter leading-none">$0</span>
              <span className="text-[#8a8a8a] text-[18px] mb-2 font-medium">/mo</span>
            </div>
            <p className="text-[#8a8a8a] text-[15px] mb-8 leading-relaxed h-[68px]">
              Ideal for developers starting out and exploring Atmos Orbit basics. (BYOK)
            </p>
            <button 
              onClick={() => onNavigate('app')}
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-[32px] [corner-shape:squircle] font-medium text-[16px] transition-colors mb-10 border border-white/5"
            >
              Try for free
            </button>
            <ul className="space-y-4">
              {[
                'Bring Your Own Key (BYOK)',
                'Unlimited Luau generations',
                'Live Roblox Studio Sync',
                'Basic UI scaffolding',
                'Community support'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-[15px] text-[#c0c0c0]">
                  <div className="w-5 h-5 rounded-[32px] [corner-shape:squircle] border border-[#444] flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[#888]" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional / Premium Tier */}
          <div className="bg-[#151525] border border-indigo-500/30 rounded-[32px] [corner-shape:squircle] flex flex-col p-2 relative shadow-[0_0_40px_rgba(99,102,241,0.08)]">
            <div className="flex items-center justify-center gap-2 py-4 text-indigo-400 font-medium text-[15px]">
              <Zap size={16} className="fill-indigo-400" />
              Most Recommended
            </div>
            <div className="bg-[#0a0a0a] rounded-[48px] [corner-shape:squircle] p-8 flex flex-col flex-1 border border-white/5 shadow-2xl">
              <h3 className="text-[24px] font-medium text-white mb-4">Premium</h3>
              <div className="mb-4 flex items-end gap-1">
                <span className="text-[56px] font-medium text-white tracking-tighter leading-none">{isYearly ? '$24' : '$29'}</span>
                <span className="text-[#8a8a8a] text-[18px] mb-2 font-medium">/mo</span>
              </div>
              <p className="text-[#8a8a8a] text-[15px] mb-8 leading-relaxed h-[68px]">
                Built for teams that need speed, structure, and advanced AI reasoning.
              </p>
              <button 
                disabled
                className="w-full py-3.5 bg-indigo-600 text-white rounded-[32px] [corner-shape:squircle] font-medium text-[16px] transition-colors mb-10 opacity-50 cursor-not-allowed shadow-[0_8px_20px_rgba(79,70,229,0.3)]"
              >
                Coming soon
              </button>
              <ul className="space-y-4">
                {[
                  'No API key required',
                  'Access to Crucible Pro 2.1',
                  'Unlimited AI generation',
                  'Full project context awareness',
                  'Priority execution queue',
                  'Direct email support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-[15px] text-[#c0c0c0]">
                    <div className="w-5 h-5 rounded-[32px] [corner-shape:squircle] border border-indigo-500/40 flex items-center justify-center shrink-0 bg-indigo-500/10">
                      <Check size={12} className="text-indigo-400" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-[#0a0a0a] rounded-[32px] [corner-shape:squircle] p-10 flex flex-col border border-white/10 mt-0 md:mt-12">
            <h3 className="text-[24px] font-medium text-white mb-4">Enterprise</h3>
            <div className="mb-4 flex items-end gap-1">
              <span className="text-[56px] font-medium text-white tracking-tighter leading-none">Custom</span>
            </div>
            <p className="text-[#8a8a8a] text-[15px] mb-8 leading-relaxed h-[68px]">
              At the power, customization, and support your organization needs.
            </p>
            <button 
              disabled
              className="w-full py-3.5 bg-white/5 text-white rounded-[32px] [corner-shape:squircle] font-medium text-[16px] transition-colors mb-10 border border-white/5 opacity-50 cursor-not-allowed"
            >
              Coming soon
            </button>
            <ul className="space-y-4">
              {[
                'Custom model fine-tuning',
                'Private VPC deployment',
                'Unlimited custom scripts',
                'Dedicated success manager',
                'SLA guarantees'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-[15px] text-[#c0c0c0]">
                  <div className="w-5 h-5 rounded-[32px] [corner-shape:squircle] border border-[#444] flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[#888]" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>
    </div>
  );
}
