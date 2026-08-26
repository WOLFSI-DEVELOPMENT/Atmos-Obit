import { useState, useEffect, useRef } from 'react';
import { QrCode, MonitorPlay, KeyRound, CheckCircle2, ArrowUpRight, ShieldAlert } from 'lucide-react';

export default function ConnectPanel({ onConnect }: { onConnect: (pin: string) => void }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = (pin: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/sync/status/${pin}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'connected') {
            setStatus('connected');
            if (pollingRef.current) clearInterval(pollingRef.current);
            onConnect(pin);
          }
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 2000);
  };

  const handleConnect = async () => {
    setStatus('connecting');
    try {
      if (code.trim()) {
        // Just start polling for the provided code
        startPolling(code.trim());
      } else {
        // Generate a new PIN
        const res = await fetch('/api/sync/create', { method: 'POST' });
        const data = await res.json();
        setCode(data.pin);
        startPolling(data.pin);
      }
    } catch (e) {
      console.error(e);
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return (
    <div className="flex-1 bg-black flex flex-col h-full rounded-none relative">
      <div className="p-4 border-b border-[#222] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MonitorPlay className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-medium tracking-wide text-white">Studio Sync</h2>
        </div>
        {status === 'connected' && (
          <span className="flex items-center gap-2 text-[#4ade80] text-sm uppercase tracking-wide font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Connected
          </span>
        )}
      </div>

      <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center gap-6 overflow-y-auto">
        {/* Notice alert */}
        <div className="w-full max-w-sm bg-[#161616] border border-[#2a2a2a] rounded-xl p-3.5 flex items-start gap-2.5 text-left">
          <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#a0a0a0] leading-snug">
            <span className="text-neutral-200 font-medium">Plugin Appeal in Progress:</span> Roblox temporarily flagged the plugin under "Misusing Roblox Systems." We are appealing and anticipate full reinstatement by <span className="text-white font-medium">Aug 25–26</span>. In the meantime, use <span className="text-neutral-200">Settings → Experiments</span> for browser preview.
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium text-white tracking-wide">Connect Roblox Studio</h3>
          <p className="text-[#888] text-xs max-w-sm leading-relaxed">
            Scan this QR code with the VibeCoder plugin in Roblox Studio.
          </p>
        </div>

        {/* QR Code Mockup */}
        <div className="p-5 bg-white border-4 border-[#333] rounded-none flex items-center justify-center shadow-none">
           <QrCode className="w-36 h-36 text-black" />
        </div>
      </div>

      <div className="p-4 bg-black flex flex-col items-center gap-4 border-t border-[#222]">
        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
             <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
             <input 
               type="text" 
               placeholder="OR ENTER PIN CODE"
               value={code}
               onChange={(e) => setCode(e.target.value.toUpperCase())}
               maxLength={6}
               className="w-full h-[60px] bg-[#0a0a0a] border border-[#333] text-white text-center text-xl tracking-[0.5em] focus:outline-none focus:border-[#555] rounded-none pl-8"
             />
          </div>
          <button 
            onClick={handleConnect}
            className={`w-full h-[60px] rounded-none transition-colors flex items-center justify-center gap-2 font-medium tracking-[0.1em] text-sm uppercase ${status === 'connected' ? 'bg-[#1a3622] text-[#4ade80] border border-[#234b2f]' : 'bg-[#222] hover:bg-[#333] text-white border border-transparent'}`}
          >
            {status === 'connecting' ? 'WAITING FOR PLUGIN...' : status === 'connected' ? 'SYNCED' : 'GENERATE PIN'}
          </button>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-[#222] text-xs text-[#888] flex items-center justify-between">
        <span className="uppercase tracking-[0.15em] text-[11px] text-[#666]">VibeCoder Plugin</span>
        <a 
          href="https://create.roblox.com/store/asset/115974186525830"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-neutral-300 flex items-center gap-1 text-[11px] font-medium bg-[#1e1e1e] hover:bg-[#282828] px-2.5 py-1 rounded transition-colors"
        >
          Install from Creator Store <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
  );
}
