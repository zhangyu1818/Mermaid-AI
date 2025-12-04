import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { fixMermaidCode } from './services/geminiService';
import { saveToStorage, loadFromStorage } from './utils/storage';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const DEFAULT_CODE = `graph TD
    A[Idea] --> B{Feasible?}
    B -- Yes --> C[Prototype]
    B -- No --> D[Research]
    D --> B
    C --> E[Launch]`;

export default function App() {
  const [code, setCode] = useState<string>('');
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load from storage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    setCode(saved || DEFAULT_CODE);
  }, []);

  // Save to storage on change
  useEffect(() => {
    saveToStorage(code);
  }, [code]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setSyntaxError(null); // Clear specific syntax error when user types
  };

  const handleAiFix = async () => {
    if (!code.trim()) return;
    
    setIsFixing(true);
    try {
      const fixedCode = await fixMermaidCode(code, syntaxError || "General syntax error");
      setCode(fixedCode);
      showToast("Code repaired by AI!", 'success');
      setSyntaxError(null);
    } catch (error) {
      console.error(error);
      showToast("Failed to fix code with AI.", 'error');
    } finally {
      setIsFixing(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadSvg = () => {
    const svgElement = document.querySelector('#mermaid-container svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `diagram-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showToast("No diagram to download", 'error');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="flex-none bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold shadow-sm font-hand text-lg">
            M
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Mermaid AI</h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Architect</p>
          </div>
        </div>
        
        <Toolbar 
          onFix={handleAiFix} 
          isFixing={isFixing} 
          onDownload={handleDownloadSvg}
          hasError={!!syntaxError}
        />
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Editor (Smaller width) */}
        <div className="w-[35%] min-w-[320px] max-w-[500px] flex flex-col border-r border-gray-200 bg-white relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
           <Editor 
             code={code} 
             onChange={handleCodeChange} 
             disabled={isFixing}
           />
           {syntaxError && (
             <div className="bg-red-50 border-t border-red-100 p-3 text-sm text-red-600 flex items-start gap-2 animate-in slide-in-from-bottom-2">
                <AlertCircle size={16} className="mt-0.5 flex-none" />
                <span className="font-mono text-xs">{syntaxError}</span>
             </div>
           )}
        </div>

        {/* Right: Preview (Larger width) */}
        <div className="flex-1 bg-[#f8fafc] flex flex-col relative overflow-hidden">
          <Preview 
            code={code} 
            onError={(err) => setSyntaxError(err)}
          />
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
}