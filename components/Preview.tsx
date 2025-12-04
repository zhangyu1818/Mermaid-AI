import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useDebounce } from '../hooks/useDebounce';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface PreviewProps {
  code: string;
  onError: (error: string | null) => void;
}

// Initialize mermaid with a hand-drawn, clean theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  look: 'handDrawn', // Enable the sketchy hand-drawn look
  securityLevel: 'loose',
  fontFamily: '"Architects Daughter", "Inter", sans-serif',
  themeVariables: {
    primaryColor: '#ffffff',
    primaryTextColor: '#1a1a1a',
    primaryBorderColor: '#1a1a1a',
    lineColor: '#1a1a1a',
    secondaryColor: '#ffffff',
    tertiaryColor: '#ffffff',
    mainBkg: '#ffffff',
    nodeBorder: '#1a1a1a',
    clusterBkg: '#ffffff',
    clusterBorder: '#1a1a1a',
    titleColor: '#1a1a1a',
    edgeLabelBackground: '#ffffff',
    fontSize: '16px',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 20
  }
});

export const Preview: React.FC<PreviewProps> = ({ code, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [scale, setScale] = useState(1);
  const debouncedCode = useDebounce(code, 600); 

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      if (!debouncedCode.trim()) {
        setSvgContent('');
        onError(null);
        return;
      }

      try {
        await mermaid.parse(debouncedCode);
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, debouncedCode);
        
        if (isMounted) {
          setSvgContent(svg);
          onError(null);
        }
      } catch (error) {
        if (isMounted) {
            let message = "Syntax Error";
            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === 'string') {
                message = error;
            }
            const shortMessage = message.split('\n')[0];
            onError(shortMessage);
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [debouncedCode, onError]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleReset = () => setScale(1);

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
         backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
         backgroundSize: '24px 24px'
      }}></div>

      {/* View Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white p-1.5 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-200 z-20">
        <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Zoom Out">
          <ZoomOut size={16} />
        </button>
        <span className="w-10 text-center text-xs font-mono text-gray-500 font-medium">{Math.round(scale * 100)}%</span>
        <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Zoom In">
          <ZoomIn size={16} />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1"></div>
        <button onClick={handleReset} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Reset View">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Render Area */}
      <div 
        className="flex-1 overflow-auto flex items-center justify-center p-12 custom-scrollbar"
      >
        <div 
          id="mermaid-container"
          ref={containerRef}
          className="transition-transform duration-200 ease-out origin-center font-hand"
          style={{ transform: `scale(${scale})` }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        {!svgContent && debouncedCode && (
           <div className="text-gray-400 text-sm font-hand animate-pulse">Sketching...</div>
        )}
        {!debouncedCode && (
            <div className="text-gray-400 text-sm font-hand opacity-50">Start typing on the left to sketch a diagram</div>
        )}
      </div>
      
      {/* Hand-drawn CSS overrides to ensure text fits */}
      <style>{`
        #mermaid-container svg {
          max-width: none !important; /* Allow diagram to grow */
          font-family: "Architects Daughter", cursive !important;
        }
        /* Ensure labels wrap or fit better */
        .node foreignObject div {
          text-align: center;
        }
        .label {
            font-family: "Architects Daughter", cursive !important;
        }
      `}</style>
    </div>
  );
};