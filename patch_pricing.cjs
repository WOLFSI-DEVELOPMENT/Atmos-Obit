const fs = require('fs');

const pricingCode = `import React, { useEffect } from 'react';
import { ChevronRight, CheckCircle2, Gift, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingPageProps {
  onNavigate: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing') => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
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
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden bg-transparent">
            <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="App Icon" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-[16px] text-white tracking-tight">Atmos orbit</span>
        </button>
        
        <button 
          onClick={() => onNavigate('app')}
          className="text-[14px] font-medium text-white/70 hover:text-white transition-colors"
        >
          Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1100px] mx-auto px-6 pt-32">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] text-[#606060] mb-8 font-medium">
          <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Home</button>
          <ChevronRight size={12} />
          <span className="text-white/70">Pricing</span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-[#f5f5f5] mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-[18px] text-[#a0a0a0] max-w-[650px] mx-auto leading-relaxed">
            Currently, Atmos Orbit is in Beta. The Free plan is the only active plan and operates on a Bring Your Own Key (BYOK) model. Premium and Enterprise plans are coming soon.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          
          {/* Free Tier */}
          <div className="bg-[#111111] rounded-[32px] p-8 flex flex-col min-h-[580px] border border-white/5">
            <div className="flex items-center gap-3 mb-8 text-white">
              <Gift size={20} />
              <h3 className="text-[20px] font-semibold">Free</h3>
            </div>
            
            <div className="mb-10">
              <span className="text-[64px] font-bold text-white tracking-tighter leading-none block mb-2">$0</span>
              <span className="text-[#8a8a8a] text-[15px] font-medium">Per month</span>
            </div>
            
            <ul className="space-y-4 flex-1 mb-8">
              {[
                'Bring Your Own Key (BYOK)',
                'Unlimited Luau code generations',
                'Live Roblox Studio Sync',
                'Basic UI scaffolding',
                'Access to standard models',
                'Community support'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-[15px] text-[#d0d0d0]">
                  <CheckCircle2 size={20} className="text-white fill-white/10 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onNavigate('app')}
              className="w-full py-4 bg-white text-black rounded-full font-bold text-[16px] transition-transform hover:scale-[1.02]"
            >
              Start building
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-gradient-to-br from-[#ff9a3d] to-[#ff512f] rounded-[32px] p-8 flex flex-col min-h-[580px] relative overflow-hidden">
            {/* Soft inner glow/overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 text-white relative z-10">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="fill-white" />
                <h3 className="text-[20px] font-semibold">Premium</h3>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase backdrop-blur-sm">Coming Soon</span>
            </div>
            
            <div className="mb-10 relative z-10">
              <span className="text-[64px] font-bold text-white tracking-tighter leading-none block mb-2">$29</span>
              <span className="text-white/80 text-[15px] font-medium">Per month</span>
            </div>
            
            <ul className="space-y-4 flex-1 mb-8 relative z-10">
              {[
                'No API key required',
                'Access to Crucible Pro 2.1',
                'Unlimited AI generation',
                'Full project context awareness',
                'Priority execution queue',
                'Direct email support'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-[15px] text-white">
                  <CheckCircle2 size={20} className="text-white fill-white/20 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              disabled
              className="w-full py-4 bg-white/20 text-white backdrop-blur-sm rounded-full font-bold text-[16px] cursor-not-allowed relative z-10"
            >
              Coming Soon
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-gradient-to-br from-[#3b8d99] to-[#204ce5] rounded-[32px] p-8 flex flex-col min-h-[580px] relative overflow-hidden">
             {/* Soft inner glow/overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 text-white relative z-10">
              <div className="flex items-center gap-3">
                <Building2 size={20} />
                <h3 className="text-[20px] font-semibold">Enterprise</h3>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase backdrop-blur-sm">Coming Soon</span>
            </div>
            
            <div className="mb-10 relative z-10">
              <span className="text-[48px] md:text-[56px] font-bold text-white tracking-tighter leading-tight block mb-2">Custom</span>
              <span className="text-white/80 text-[15px] font-medium">Per month</span>
            </div>
            
            <p className="text-white/90 text-[14px] mb-4 relative z-10 font-medium">Everything in Premium, plus</p>

            <ul className="space-y-4 flex-1 mb-8 relative z-10">
              {[
                'Custom model fine-tuning',
                'Private VPC deployment',
                'Unlimited custom scripts',
                'Dedicated success manager',
                'SLA guarantees',
                'Team collaboration'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-[15px] text-white">
                  <CheckCircle2 size={20} className="text-white fill-white/20 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              disabled
              className="w-full py-4 bg-white/20 text-white backdrop-blur-sm rounded-full font-bold text-[16px] cursor-not-allowed relative z-10"
            >
              Contact sales
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
`;
fs.writeFileSync('src/components/PricingPage.tsx', pricingCode);
