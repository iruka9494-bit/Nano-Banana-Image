
import React from 'react';
import { ExternalLink, Zap, ShieldCheck, Info } from 'lucide-react';

interface ApiKeyGateProps {
  onKeySelected: () => void;
}

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    try {
      if (window.aistudio?.openSelectKey) {
        // 플랫폼의 API 키 선택 창을 엽니다.
        await window.aistudio.openSelectKey();
        // 키 선택 창이 닫히면 성공으로 간주하고 앱으로 진입합니다 (지침 준수).
        onKeySelected();
      } else {
        alert("API 키 선택 기능을 사용할 수 없는 환경입니다.");
      }
    } catch (e) {
      console.error("Failed to open key selection dialog", e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* 장식용 배경 광원 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_#eab30815_0%,_transparent_60%)]"></div>
      
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-banana-500/10 rounded-2xl border border-banana-500/20 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
            <Zap className="w-12 h-12 text-banana-500" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
            Nano Banana <span className="text-banana-400">Pro</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Gemini 3 Pro Image 생성 기능을 활성화하려면<br />
            유료 프로젝트의 API 키 선택이 필요합니다.
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleSelectKey}
            className="group w-full py-4 px-6 bg-gradient-to-r from-banana-500 to-orange-500 hover:from-banana-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-banana-500/20 flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-6 h-6" />
            API 키 선택하고 시작하기
          </button>
          
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-3 items-start">
             <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
             <p className="text-[11px] text-slate-400 leading-relaxed">
               Gemini 3 Pro 모델은 <span className="text-banana-500 font-bold">결제가 설정된 프로젝트의 API 키</span>가 필요합니다. 
               키를 선택한 후에도 화면이 바뀌지 않으면 페이지를 새로고침 해주세요.
             </p>
          </div>

          <div className="text-center">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-banana-400 transition-colors"
            >
              Google Cloud 결제 및 문서 확인 <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
