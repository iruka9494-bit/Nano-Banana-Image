
import React from 'react';
import { ExternalLink, Zap, Info, ShieldCheck } from 'lucide-react';

interface ApiKeyGateProps {
  onKeySelected: () => void;
}

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onKeySelected }) => {
  // 플랫폼 기능 가용성 확인 - window.aistudio assumes to be present as per guidelines
  const handleSelectKey = async () => {
    try {
      // Create a new GoogleGenAI instance right before making an API call 
      // is handled in the service, but key selection is mandatory here.
      if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Race condition mitigation: assume success after triggering the dialog as per guidelines.
        onKeySelected();
      }
    } catch (e) {
      alert("플랫폼 연결 실패. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#eab3081a_0%,_transparent_50%)]"></div>
      
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl relative z-10">
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
            API 키를 선택해 주세요.
          </p>
        </div>

        <div className="space-y-6">
          {/* AI Studio Platform Option - Mandatory for gemini-3-pro-image-preview as per high-quality image generation guidelines */}
          <button
            onClick={handleSelectKey}
            className="group w-full py-4 px-6 bg-gradient-to-r from-banana-500 to-orange-500 text-slate-950 font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-5 h-5" />
            API 키 선택하기
          </button>
          
          <div className="p-4 bg-banana-500/5 border border-banana-500/10 rounded-2xl flex gap-3 items-start">
             <Info className="w-4 h-4 text-banana-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-slate-400 leading-relaxed">
               선택한 API 키는 <span className="text-slate-200">결제 계정이 활성화된 유료 프로젝트</span>여야 합니다. 
               Gemini 3 Pro 모델은 유료 요금제에서 안정적으로 작동합니다.
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
