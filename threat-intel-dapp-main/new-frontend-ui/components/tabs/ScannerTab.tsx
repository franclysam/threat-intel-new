
import React, { useState, useRef } from 'react';
import { analyzeThreat } from '../../services/geminiService';

const ScannerTab: React.FC = () => {
  const [scanType, setScanType] = useState<'link' | 'file'>('link');
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    if (!input.trim()) return;
    setIsScanning(true);
    setResult(null);
    
    try {
      const data = await analyzeThreat(input, scanType === 'file');
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tighter">AI_DIAGNOSTIC_MESH</h2>
        <p className="text-gray-600 text-[9px] font-bold tracking-widest uppercase mt-1">Direct Neural analysis of external vectors</p>
      </div>

      <div className="max-w-4xl space-y-10">
        <div className="flex bg-[#050505] p-1 border border-gray-900 w-fit">
          <button 
            onClick={() => { setScanType('link'); setInput(''); setResult(null); }}
            className={`px-8 py-3 text-[10px] font-black tracking-widest transition-all ${scanType === 'link' ? 'bg-neon text-black' : 'text-gray-600 hover:text-gray-400'}`}
          >
            URL_UPLINK
          </button>
          <button 
            onClick={() => { setScanType('file'); setInput(''); setResult(null); }}
            className={`px-8 py-3 text-[10px] font-black tracking-widest transition-all ${scanType === 'file' ? 'bg-neon text-black' : 'text-gray-600 hover:text-gray-400'}`}
          >
            RAW_FILE_STREAM
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[#080808] border border-gray-900 relative">
            <div className="absolute top-4 left-4 flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-800"></div>
              <div className="w-1.5 h-1.5 bg-gray-800"></div>
              <div className="w-1.5 h-1.5 bg-gray-800"></div>
            </div>
            
            {scanType === 'link' ? (
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="PROMPT://ENTER_SUSPICIOUS_URL_TARGET"
                className="w-full bg-transparent p-12 text-neon text-xs font-bold tracking-widest outline-none"
              />
            ) : (
              <div className="relative">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="PROMPT://PASTE_BINARY_HEX_OR_CODE_STREAM"
                  className="w-full h-64 bg-transparent p-12 text-neon text-xs font-bold tracking-widest outline-none resize-none"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-6 right-6 border border-gray-800 text-gray-500 hover:text-white px-6 py-2 text-[8px] font-bold tracking-widest uppercase flex items-center gap-2"
                >
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="3"/></svg>
                   [ LOCAL_FILE_LOAD ]
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>
            )}
          </div>

          <button 
            onClick={handleScan}
            disabled={isScanning || !input.trim()}
            className="w-full bg-neon text-black font-black py-8 tracking-[0.5em] text-sm disabled:brightness-50 flex items-center justify-center gap-4"
          >
            {isScanning ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                NEURAL_PROCESSING_ACTIVE...
              </>
            ) : 'INITIATE_DIAGNOSTIC'}
          </button>
        </div>

        {result && (
          <div className="bg-[#050505] border border-gray-900 p-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-10 pb-8 border-b border-gray-900">
              <div>
                <div className="text-[9px] font-bold text-gray-600 tracking-widest uppercase mb-1">Diagnosis_Result</div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{result.verdict}</h3>
              </div>
              <div className="text-right">
                 <div className="text-[9px] font-bold text-gray-600 tracking-widest uppercase mb-1">Threat_Impact</div>
                 <div className="text-4xl font-black text-neon tracking-tighter">{result.riskScore}/100</div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#080808] p-6 border-l-2 border-neon/50">
                 <h4 className="text-[8px] font-black text-neon tracking-widest uppercase mb-4">Neural_Analysis_Summary</h4>
                 <p className="text-xs text-gray-400 font-bold leading-relaxed tracking-widest">{result.summary}</p>
              </div>

              <div>
                <h4 className="text-[8px] font-black text-gray-600 tracking-widest uppercase mb-4">Malicious_Indicators</h4>
                <div className="flex flex-wrap gap-3">
                  {result.threatsDetected.map((t: string, i: number) => (
                    <div key={i} className="bg-red-950/20 border border-red-500/20 text-red-500 px-4 py-2 text-[9px] font-bold tracking-widest">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerTab;
