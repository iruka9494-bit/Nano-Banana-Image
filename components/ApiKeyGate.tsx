
import React, { useEffect, useState } from 'react';
import { Lock, ExternalLink, Zap, Info, ShieldCheck, Key } from 'lucide-react';

interface ApiKeyGateProps {
  onKeySelected: () => void;
}

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onKeySelected }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [manualKey, setManualKey] = useState('');
  const [isAistudioAvailable, setIsAistudioAvailable] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      try {
        // 1. Check AI Studio Platform Availability
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
          setIsAistudioAvailable(true);
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (hasKey) {
            onKeySelected();
            return;
          }
        }
        
        // 2. Check Local Storage Fallback (BYOK)
        const savedKey = localStorage.getItem('USER_PROVIDED_API_KEY');
        if (savedKey && savedKey.length > 10) {
          (process.env as any).API_KEY = savedKey;
          onKeySelected();
          return;
        }

        // 3. Check Vercel Env Var
        if (process.env.API_KEY && process.env.API_KEY.length > 10) {
          onKeySelected();
          return;
        }

      } catch (e) {
        console.warn("API Gate check error handled:", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkKey();
  }, [onKeySelected]);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        onKeySelected();
      } else {
        alert("이 환경에서는 플랫폼 키 선택기를 사용할 수 없습니다. 수동으로 입력해 주세요.");
      }
    } catch (e) {
      console.error("Failed to select API key", e);
      alert("API 키를 연결하는 중 문제가 발생했습니다.");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualKey.length < 10) {
      alert("올바른 API 키 형식이 아닙니다.");
      return;
    }
    // Save locally for persistence
    localStorage.setItem('USER_PROVIDED_API_KEY', manualKey);
    // Inject into process.env for the current session
    (process.env as any).API_KEY = manualKey;
    onKeySelected();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-banana-500/20 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-banana-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-medium tracking-widest animate-pulse">SYSTEM INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-6">
      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-banana-500/10 rounded-2xl border border-banana-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
            <Zap className="w-10 h-10 text-banana-500" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
            Nano Banana <span className="text-banana-400">Pro</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Gemini 3 Pro Image 생성 기능을 활성화하기 위해<br />
            Google AI API 키가 필요합니다.
          </p>
        </div>

        <div className="space-y-6">
          {/* AI Studio Platform Option */}
          {isAistudioAvailable && (
            <button
              onClick={handleSelectKey}
              className="group w-full py-4 px-6 bg-gradient-to-r from-banana-500 to-orange-500 hover:from-banana-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl shadow-banana-500/20 flex items-center justify-center gap-3"
            >
              <ShieldCheck className="w-5 h-5" />
              플랫폼 키 연결하기
            </button>
          )}

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">OR (BYOK)</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          {/* Manual BYOK Input (Essential for Vercel deploy) */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
             <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password"
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  placeholder="API 키를 직접 입력하세요"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-4 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-banana-500/30 focus:border-banana-500 outline-none transition-all"
                />
             </div>
             <button
               type="submit"
               className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 active:scale-95"
             >
               수동 키 등록 및 시작
             </button>
          </form>
          
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-3 items-start">
             <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
             <p className="text-[11px] text-slate-400 leading-relaxed">
               입력하신 API 키는 브라우저의 로컬 스토리지에만 안전하게 저장되며, 서버로 전송되지 않습니다. 
               <span className="text-banana-500/80 ml-1 font-bold">결제가 활성화된 유료 프로젝트 키를 권장합니다.</span>
             </p>
          </div>

          <div className="text-center">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-banana-400 transition-colors"
            >
              Google 결제 및 할당량 관리 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
