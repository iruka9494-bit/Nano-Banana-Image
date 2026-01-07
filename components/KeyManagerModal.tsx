
import React, { useState } from 'react';
import { X, ShieldCheck, Zap, RefreshCw, ExternalLink, ShieldAlert, CheckCircle2, ChevronRight, HardDrive, Lock, Activity } from 'lucide-react';
import { testApiKeyConnection } from '../services/geminiService';

interface KeyManagerModalProps {
  onClose: () => void;
  onKeyChange: () => void;
}

export const KeyManagerModal: React.FC<KeyManagerModalProps> = ({ onClose, onKeyChange }) => {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: string; latency?: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showDiagnosticPopup, setShowDiagnosticPopup] = useState(false);

  const handleOpenSelect = async () => {
    // Rely on platform-native window.aistudio.openSelectKey as per guidelines
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      try {
        await window.aistudio.openSelectKey();
        // Notify app of potential change - race condition handled by service layer initialization
        onKeyChange();
        setTestResult(null); 
      } catch (e) {
        console.error(e);
      }
    }
  };

  const runDiagnostic = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testApiKeyConnection();
      setTestResult(result);
      setShowDiagnosticPopup(true);
    } catch (e) {
      setTestResult({ success: false, message: "진단 중 예상치 못한 오류 발생", details: "네트워크 연결 상태를 확인해 주세요." });
      setShowDiagnosticPopup(true);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in">
      {!showDiagnosticPopup ? (
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-banana-500/10 rounded-xl border border-banana-500/20">
                <ShieldCheck className="w-6 h-6 text-banana-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">보안 관리 센터</h2>
                <p className="text-xs text-slate-500 font-medium uppercase">API Security Dashboard</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Storage Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-banana-400">
                  <HardDrive className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">로컬 보안 저장소</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  API 키는 플랫폼 표준 또는 로컬 암호화 저장소에 저장됩니다. 앱 서버에는 절대로 저장되지 않습니다.
                </p>
              </div>
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">데이터 보호</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  로컬 환경에 격리되어 관리되며, API 호출 시에만 안전한 채널을 통해 전달됩니다.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleOpenSelect}
                className="w-full group flex items-center justify-between p-5 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-banana-500/10 rounded-lg group-hover:scale-110 transition-transform">
                    <RefreshCw className="w-5 h-5 text-banana-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">API 키 연결 및 갱신</p>
                    <p className="text-xs text-slate-500">플랫폼 키 선택기 실행</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={runDiagnostic}
                disabled={isTesting}
                className={`w-full flex items-center justify-center p-5 rounded-2xl font-bold transition-all gap-3 shadow-xl ${
                  isTesting 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-banana-500 to-orange-500 text-slate-950 hover:shadow-banana-500/20 active:scale-[0.98]'
                }`}
              >
                {isTesting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                연결 테스트 및 실시간 진단
              </button>
            </div>

            {/* Footer */}
            <div className="pt-2 text-center">
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-banana-400 transition-colors"
              >
                Google API 결제 및 할당량 관리 <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Diagnostic Popup */
        <div className="w-full max-w-md bg-slate-900 border border-banana-500/50 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-banana-500" /> 실시간 진단 결과
            </h3>
            <button onClick={() => setShowDiagnosticPopup(false)} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className={`p-5 rounded-full ${testResult?.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {testResult?.success ? <CheckCircle2 className="w-16 h-16" /> : <ShieldAlert className="w-16 h-16" />}
            </div>
            
            <div className="space-y-2">
              <h4 className={`text-xl font-black ${testResult?.success ? 'text-green-400' : 'text-red-400'}`}>
                {testResult?.success ? "연결 상태 양호" : "연결 오류 감지"}
              </h4>
              <p className="text-sm text-slate-300 px-4">{testResult?.message}</p>
            </div>

            {testResult?.success && testResult.latency && (
              <div className="w-full grid grid-cols-2 gap-3">
                 <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">응답 속도</p>
                    <p className="text-sm font-mono text-banana-400">{testResult.latency}ms</p>
                 </div>
                 <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">인증 방식</p>
                    <p className="text-sm font-mono text-banana-400">Secure Vault</p>
                 </div>
              </div>
            )}

            {testResult?.details && (
              <div className="w-full p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 text-red-400/80">문제 해결 가이드</p>
                <p className="text-xs text-slate-400 leading-relaxed">{testResult.details}</p>
              </div>
            )}

            <button 
              onClick={() => setShowDiagnosticPopup(false)}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
            >
              확인 및 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
