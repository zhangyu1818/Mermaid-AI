import React from 'react';

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const Editor: React.FC<EditorProps> = ({ code, onChange, disabled }) => {
  return (
    <div className="flex-1 flex flex-col relative group">
      <div className="absolute top-0 right-0 left-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
        className="flex-1 w-full h-full p-6 resize-none outline-none font-mono text-[13px] leading-6 text-slate-700 bg-white placeholder-gray-300 selection:bg-indigo-100 selection:text-indigo-900 transition-colors focus:bg-slate-50/50"
        placeholder="graph TD&#10;  A[Start] --> B{Check?}"
      />
    </div>
  );
};