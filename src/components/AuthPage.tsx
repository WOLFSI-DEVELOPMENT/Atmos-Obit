import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthPageProps {
  onNavigate: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth' | 'articles') => void;
  onLoginSuccess?: (user: any) => void;
}

export function AuthPage({ onNavigate, onLoginSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin ? { email, password } : { email, password, name };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }
      

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      
      if (!isLogin) {
        setShowOnboarding(true);
      } else {
        onNavigate('app');
      }
    } catch (err: any) {

      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col selection:bg-neutral-800 relative overflow-hidden">
      {/* Background Images Overlay mimicking the screenshot - Now full screen width */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]">
        <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094724/NEON_DRIFT_X_game_cover_202605241419_fjybae.jpg" className="absolute top-[8%] left-[4%] w-48 h-32 object-cover rounded-xl -rotate-6 shadow-2xl" alt="NEON DRIFT X" />
        <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094715/Blocky_Crossing_game_cover_202605241419_czbolu.jpg" className="absolute top-[10%] right-[6%] w-48 h-32 object-cover rounded-xl rotate-3 shadow-2xl" alt="Blocky Crossing" />
        <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094715/Titan_Offroad_game_cover_202605241419_big2ck.jpg" className="absolute top-[6%] left-[38%] w-48 h-32 object-cover rounded-xl -rotate-3 shadow-2xl" alt="Titan Offroad" />
        <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094701/Armored_muscle_cars_crashing_hig__202605241419_yqugg9.jpg" className="absolute bottom-[8%] left-[5%] w-48 h-32 object-cover rounded-xl rotate-6 shadow-2xl" alt="Armored muscle cars" />
        <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094698/Cube_Clash.io_game_cover_202605241420_d4eaeg.jpg" className="absolute bottom-[10%] right-[5%] w-48 h-32 object-cover rounded-xl -rotate-2 shadow-2xl" alt="Cube Clash.io" />
        <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094698/Shadow_Protocol_cover_art_202605241419_orggay.jpg" className="absolute bottom-[6%] left-[35%] w-48 h-32 object-cover rounded-xl rotate-3 shadow-2xl" alt="Shadow Protocol" />
        <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094681/Flappy_Sky_game_cover_202605241419_to1erv.jpg" className="absolute top-[42%] left-[2%] w-48 h-32 object-cover rounded-xl -rotate-12 shadow-2xl" alt="Flappy Sky" />
        <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094680/Frozen_Survival_game_cover_art_202605241420_ryf9df.jpg" className="absolute top-[45%] right-[2%] w-48 h-32 object-cover rounded-xl rotate-6 shadow-2xl" alt="Frozen Survival" />
        <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094676/Zombie_District_game_cover_202605241419_iyozmx.jpg" className="absolute top-[40%] left-[65%] w-48 h-32 object-cover rounded-xl -rotate-6 shadow-2xl" alt="Zombie District" />
      </motion.div>

      {/* Navbar Minimal */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-[32px] [corner-shape:squircle] flex items-center justify-center relative overflow-hidden bg-transparent">
            <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="App Icon" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-[18px] text-white tracking-tight whitespace-nowrap">Atmos orbit</span>
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 mt-16 md:mt-0 relative z-10">
        
        {showOnboarding ? (
          <div className="w-full max-w-[440px] bg-transparent rounded-[32px] [corner-shape:squircle] p-10 flex flex-col relative">
            {onboardingStep === 1 && (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📦</span>
                </div>
                <h2 className="text-[28px] font-semibold text-[#f5f5f5] mb-4 tracking-tight">Download Plugin</h2>
                <p className="text-[#a0a0a0] text-[15px] mb-8 leading-relaxed">
                  Get the VibeCoder plugin from the Creator Store to enable Live Sync directly with your Roblox Studio environment.
                </p>
                <a 
                  href="https://create.roblox.com/store/asset/115974186525830"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-14 mb-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-[32px] [corner-shape:squircle] font-semibold text-[15px] transition-colors flex items-center justify-center gap-2"
                >
                  Open Creator Store
                </a>
                <button 
                  onClick={() => setOnboardingStep(2)}
                  className="w-full h-14 bg-white hover:bg-neutral-200 text-black rounded-[32px] [corner-shape:squircle] font-semibold text-[15px] transition-colors flex items-center justify-center gap-2"
                >
                  I've installed it <ArrowRight size={18} />
                </button>
              </div>
            )}
            
            {onboardingStep === 2 && (
              <div className="text-center animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🔑</span>
                </div>
                <h2 className="text-[28px] font-semibold text-[#f5f5f5] mb-4 tracking-tight">Enter PIN</h2>
                <p className="text-[#a0a0a0] text-[15px] mb-8 leading-relaxed">
                  Open Roblox Studio, click the VibeCoder plugin, and generate a 6-digit PIN to securely connect this web dashboard to your game.
                </p>
                <button 
                  onClick={() => setOnboardingStep(3)}
                  className="w-full h-14 bg-white hover:bg-neutral-200 text-black rounded-[32px] [corner-shape:squircle] font-semibold text-[15px] transition-colors flex items-center justify-center gap-2"
                >
                  Understood <ArrowRight size={18} />
                </button>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="text-center animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">✨</span>
                </div>
                <h2 className="text-[28px] font-semibold text-[#f5f5f5] mb-4 tracking-tight">Start Generating</h2>
                <p className="text-[#a0a0a0] text-[15px] mb-8 leading-relaxed">
                  Describe the systems you want to build and let the AI Orchestrator write, insert, and test Luau scripts directly in your workspace.
                </p>
                <button 
                  onClick={() => onNavigate('app')}
                  className="w-full h-14 bg-[#0a84ff] hover:bg-[#007aff] text-white rounded-[32px] [corner-shape:squircle] font-semibold text-[15px] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(10,132,255,0.4)]"
                >
                  Start Building <ArrowRight size={18} />
                </button>
              </div>
            )}
            
                                    {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-8">
              <div className={`w-2 h-2 rounded-full transition-colors ${onboardingStep === 1 ? 'bg-white' : 'bg-white/20'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors ${onboardingStep === 2 ? 'bg-white' : 'bg-white/20'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors ${onboardingStep === 3 ? 'bg-white' : 'bg-white/20'}`} />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[440px] bg-transparent rounded-[32px] [corner-shape:squircle] p-10 flex flex-col relative">
          
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-semibold text-[#f5f5f5] mb-2 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-[#a0a0a0] text-[15px]">
              {isLogin 
                ? 'Enter your credentials to access your workspace.' 
                : 'Sign up to start building your next project.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-[16px] text-[14px]">
                {error}
              </div>
            )}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-[#c0c0c0] ml-2">Name</label>
                <input 
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full h-14 bg-white/5 backdrop-blur-md rounded-[24px] [corner-shape:squircle] px-5 text-[15px] text-white border-none outline-none focus:outline-none focus:ring-0 focus:bg-white/10 transition-colors placeholder-[#6a6a6a]"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#c0c0c0] ml-2">Email</label>
              <input 
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 bg-white/5 backdrop-blur-md rounded-[24px] [corner-shape:squircle] px-5 text-[15px] text-white border-none outline-none focus:outline-none focus:ring-0 focus:bg-white/10 transition-colors placeholder-[#6a6a6a]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-2 mr-2">
                <label className="text-[13px] font-medium text-[#c0c0c0]">Password</label>
                {isLogin && (
                  <button type="button" className="text-[13px] text-[#8a8a8a] hover:text-white transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 bg-white/5 backdrop-blur-md rounded-[24px] [corner-shape:squircle] px-5 text-[15px] text-white border-none outline-none focus:outline-none focus:ring-0 focus:bg-white/10 transition-colors placeholder-[#6a6a6a]"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-[#c0c0c0] ml-2">Confirm Password</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  className="w-full h-14 bg-white/5 backdrop-blur-md rounded-[24px] [corner-shape:squircle] px-5 text-[15px] text-white border-none outline-none focus:outline-none focus:ring-0 focus:bg-white/10 transition-colors placeholder-[#6a6a6a]"
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-6 bg-white hover:bg-neutral-200 text-black rounded-[32px] [corner-shape:squircle] font-semibold text-[15px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Log in' : 'Sign up')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-[14px] text-[#8a8a8a]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-white font-medium hover:underline focus:outline-none"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
