
import React, { useState } from 'react';
import { ExternalLink, Zap, Info, ShieldCheck, Key } from 'lucide-react';

interface ApiKeyGateProps {
  onKeySelected: () => void;
}

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onKeySelected }) => {
  const [manualKey, setManualKey] = useState('');
  const [isAistudioAvailable] = useState(() => {
    return !!(window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function');
  });

  const handleSelectKey = async () => {
    try {
      if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
        onKeySelected();
      }
    } catch (e) {
      alert("플랫폼 키 연결에 실패했습니다. 수동 입력을 이용해 주세요.");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualKey.trim().length < 10) {
      alert("올바른 API 키를 입력해 주세요.");
      return;
    }
    // 로컬 스토리지 저장
    localStorage.setItem('USER_PROVIDED_API_KEY', manualKey.trim());
    // 즉시 주입
    (process.env as any).API_KEY = manualKey.trim();
    onKeySelected();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#eab3081a_0%,_transparent_50%)]"></div>
      
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-banana-500/10 rounded-2xl border border-banana-500/20">
            <Zap className="w-10 h-10 text-banana-500" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
            Nano Banana <span className="text-banana-400">Pro</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Gemini 3 Pro Image 생성을 시작하기 위해<br />
            API 키를 등록해 주세요.
          </p>
        </div>

        <div className="space-y-6">
          {/* AI Studio Platform Option (Only if available) */}
          {isAistudioAvailable && (
            <button
              onClick={handleSelectKey}
              className="group w-full py-4 px-6 bg-gradient-to-r from-banana-500 to-orange-500 text-slate-950 font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            >
              <ShieldCheck className="w-5 h-5" />
              플랫폼 키 선택하기
            </button>
          )}

          {isAistudioAvailable && (
            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-slate-800"></div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">OR (수동 입력)</span>
              <div className="flex-1 h-px bg-slate-800"></div>
            </div>
          )}

          {/* Manual BYOK Input */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
             <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password"
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  placeholder="구글 Gemini API 키 입력"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-4 text-sm text-white focus:ring-2 focus:ring-banana-500/40 focus:border-banana-500 outline-none transition-all"
                  required
                />
             </div>
             <button
               type="submit"
               className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 active:scale-95 shadow-lg"
             >
               키 등록 및 시작
             </button>
          </form>
          
          <div className="p-4 bg-banana-500/5 border border-banana-500/10 rounded-2xl flex gap-3 items-start">
             <Info className="w-4 h-4 text-banana-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-slate-400 leading-relaxed">
               등록된 키는 브라우저의 <span className="text-slate-200">로컬 스토리지</span>에만 암호화되어 저장됩니다. 
               외부 서버로 전송되지 않으니 안심하고 사용하세요.
             </p>
          </div>

          <div className="text-center">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-banana-400 transition-colors"
            >
              구글 API 설정/결제 관리 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
