import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Sparkles, X, ArrowRight, ShieldAlert, Sliders, CheckCircle2, Box } from 'lucide-react';

interface PluginNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExperiments?: () => void;
  onEnablePreview?: () => void;
}

export function PluginNoticeModal({
  isOpen,
  onClose,
  onOpenExperiments,
  onEnablePreview
}: PluginNoticeModalProps) {
  if (!isOpen) return null;

  const handleDismiss = () => {
    localStorage.setItem('atmos_plugin_notice_dismissed_v1', 'true');
    onClose();
  };

  const handleActivateExperiments = () => {
    localStorage.setItem('atmos_plugin_notice_dismissed_v1', 'true');
    // Enable the experimental artifacts preview directly
    localStorage.setItem('vibecoder_exp_artifacts', 'true');
    localStorage.setItem('vibecoder_exp_gui_creation', 'true');
    if (onEnablePreview) {
      onEnablePreview();
    }
    if (onOpenExperiments) {
      onOpenExperiments();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Frosted Glass Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#121214]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-left overflow-hidden z-10"
        >
          {/* Top header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400">
                  Studio Plugin Status Update
                </span>
                <h3 className="text-white text-base font-semibold leading-tight mt-0.5">
                  Roblox Plugin Under Review
                </h3>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Flat Body Content - No separate inner cards */}
          <div className="py-5 space-y-4 text-sm text-neutral-300 leading-relaxed">
            <p className="text-[13px]">
              Roblox has temporarily removed our Studio plugin after it was automated-flagged for{' '}
              <span className="text-amber-300 font-medium font-mono text-[12px] bg-amber-400/10 px-1.5 py-0.5 rounded">
                "Misusing Roblox Systems."
              </span>
            </p>

            <p className="text-[13px]">
              We have already submitted an appeal with Roblox Moderation to clarify our local HTTP sync workflow. We expect the plugin to be reinstated around <strong className="text-white font-semibold">August 25–26</strong>.
            </p>

            <div className="pt-1 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-medium text-xs uppercase tracking-wider">
                <Sparkles size={14} className="text-blue-400" />
                <span>In the meantime</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Build and script freely:</strong> All AI Luau code generation, systems, and game architecture are fully operational.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Box size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Try Experimental In-Browser Preview:</strong> Enable the 3D Engine & GUI preview under <strong className="text-white">Settings → Experiments</strong> to inspect and test models & GUIs live in your browser.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 justify-end">
            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Continue to App
            </button>
            <button
              onClick={handleActivateExperiments}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-medium text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Sliders size={14} />
              <span>Enable Preview in Experiments</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
