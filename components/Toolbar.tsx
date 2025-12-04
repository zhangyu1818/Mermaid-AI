import React from 'react';
import { Sparkles, Download, Wand2 } from 'lucide-react';

interface ToolbarProps {
  onFix: () => void;
  isFixing: boolean;
  onDownload: () => void;
  hasError: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onFix, isFixing, onDownload, hasError }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDownload}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
      >
        <Download size={16} />
        <span>Export SVG</span>
      </button>
      
      <button
        onClick={onFix}
        disabled={isFixing}
        className={`
          flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
          ${hasError 
            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 animate-pulse' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent'
          }
          ${isFixing ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        {isFixing ? (
          <Wand2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} className={hasError ? "text-amber-600" : "text-indigo-200"} />
        )}
        <span>{isFixing ? 'Fixing...' : 'AI Fix & Format'}</span>
      </button>
    </div>
  );
};