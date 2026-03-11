import React, { useState, useRef } from 'react';

const ScannerTab = () => {
  const [scanType, setScanType] = useState('file');
  const [file, setFile] = useState(null);
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleScan = async () => {
    if (scanType === 'file' && !file) return;
    if (scanType === 'link' && !input.trim()) return;

    setIsScanning(true);
    setResult(null);

    try {
      if (scanType === 'file') {
        const formData = new FormData();
        // Create a blob from the current input content (which might be edited)
        const blob = new Blob([input], { type: 'text/plain' });
        formData.append('file', blob, file?.name || 'manual_stream.txt');

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_URL}/scan`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Scan failed');
        const data = await response.json();

        // Map backend response to UI format
        setResult({
          verdict: data.riskScore >= 80 ? 'MALICIOUS_DETECTED' : data.riskScore >= 40 ? 'SUSPICIOUS_BEHAVIOR' : 'CLEAN_SIGNAL',
          riskScore: data.riskScore,
          summary: data.explanation || 'No malicious patterns detected in the provided binary stream.',
          threatsDetected: data.threatsDetected && data.threatsDetected.length > 0 ? data.threatsDetected : ['None'],
          fileName: data.fileName,
          hash: data.hash
        });
      } else {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_URL}/scan/link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: input }),
        });

        if (!response.ok) throw new Error('Link Scan failed');
        const data = await response.json();

        setResult({
          verdict: data.riskScore >= 80 ? 'MALICIOUS_DETECTED' : data.riskScore >= 40 ? 'SUSPICIOUS_BEHAVIOR' : 'CLEAN_SIGNAL',
          riskScore: data.riskScore,
          summary: data.explanation || 'The provided URL target has been validated. No active threats detected.',
          threatsDetected: data.threatsDetected && data.threatsDetected.length > 0 ? data.threatsDetected : ['None'],
          fileName: data.fileName,
          hash: data.hash
        });
      }
    } catch (e) {
      console.error(e);
      alert('Scanning failed. Connectivity issues with neural mesh.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result);
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tighter">AI_DIAGNOSTIC_MESH</h2>
        <p className="text-gray-600 text-[9px] font-bold tracking-widest uppercase mt-1">Direct Neural analysis of external vectors</p>
      </div>

      <div className="max-w-4xl space-y-6 md:space-y-10">
        <div className="flex bg-[#050505] p-1 border border-gray-900 w-full md:w-fit">
          <button
            onClick={() => { setScanType('link'); setInput(''); setFile(null); setResult(null); }}
            className={`flex-1 md:flex-none px-4 md:px-8 py-3 text-[9px] md:text-[10px] font-black tracking-widest transition-all ${scanType === 'link' ? 'bg-neon text-black' : 'text-gray-600 hover:text-gray-400'}`}
          >
            URL_UPLINK
          </button>
          <button
            onClick={() => { setScanType('file'); setInput(''); setFile(null); setResult(null); }}
            className={`flex-1 md:flex-none px-4 md:px-8 py-3 text-[9px] md:text-[10px] font-black tracking-widest transition-all ${scanType === 'file' ? 'bg-neon text-black' : 'text-gray-600 hover:text-gray-400'}`}
          >
            RAW_STREAM
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
                placeholder="PROMPT://ENTER_URL"
                className="w-full bg-transparent p-8 md:p-12 text-neon text-[10px] md:text-xs font-bold tracking-widest outline-none"
              />
            ) : (
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="PROMPT://LOAD_LOCAL_FILE"
                  className="w-full h-48 md:h-64 bg-transparent p-8 md:p-12 text-neon text-[10px] md:text-xs font-bold tracking-widest outline-none resize-none"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {!input && <span className="text-gray-800 text-[8px] md:text-[10px] font-black tracking-[0.5em]">AWAITING_UPLINK</span>}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4 md:bottom-6 md:right-6 border border-gray-800 text-gray-500 hover:text-white px-4 md:px-6 py-2 text-[7px] md:text-[8px] font-bold tracking-widest uppercase flex items-center gap-2 bg-black/50 backdrop-blur-sm"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {file ? `[ ${file.name.slice(0, 10)}... ]` : '[ LOAD_FILE ]'}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning || (scanType === 'file' ? !file : !input.trim())}
            className="w-full bg-neon text-black font-black py-6 md:py-8 tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-sm disabled:brightness-50 flex items-center justify-center gap-4 transition-all active:scale-95"
          >
            {isScanning ? (
              <>
                <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                PROCESSING...
              </>
            ) : 'INITIATE_DIAGNOSTIC'}
          </button>
        </div>

        {result && (
          <div className="bg-[#050505] border border-gray-900 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-10 pb-6 md:pb-8 border-b border-gray-900 gap-6 md:gap-0">
              <div>
                <div className="text-[8px] font-bold text-gray-600 tracking-widest uppercase mb-1">Diagnosis_Result</div>
                <h3 className={`text-xl md:text-3xl font-black tracking-tighter uppercase ${result.riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                  {result.verdict}
                </h3>
              </div>
              <div className="md:text-right">
                <div className="text-[8px] font-bold text-gray-600 tracking-widest uppercase mb-1">Threat_Impact</div>
                <div className={`text-3xl md:text-4xl font-black tracking-tighter ${result.riskScore > 50 ? 'text-red-500' : 'text-neon'}`}>
                  {result.riskScore}/100
                </div>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className={`p-4 md:p-6 border-l-2 ${result.riskScore > 50 ? 'bg-red-950/10 border-red-500' : 'bg-neon/5 border-neon/50'}`}>
                <h4 className={`text-[7px] md:text-[8px] font-black tracking-widest uppercase mb-4 ${result.riskScore > 50 ? 'text-red-500' : 'text-neon'}`}>
                  Neural_Analysis_Summary
                </h4>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold leading-relaxed tracking-widest">{result.summary}</p>
              </div>

              {result.hash && (
                <div className="bg-black border border-gray-900 p-4">
                  <div className="text-[7px] text-gray-700 font-bold uppercase tracking-widest mb-1">Block_Hash</div>
                  <div className="text-[9px] font-mono text-gray-500 break-all">{result.hash}</div>
                </div>
              )}

              <div>
                <h4 className="text-[7px] md:text-[8px] font-black text-gray-600 tracking-widest uppercase mb-4">Malicious_Indicators</h4>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {result.threatsDetected.map((t, i) => (
                    <div key={i} className={`border px-3 md:px-4 py-1.5 md:py-2 text-[8px] md:text-[9px] font-bold tracking-widest ${result.riskScore > 50 ? 'bg-red-950/20 border-red-500/20 text-red-500' : 'bg-neon/10 border-neon/20 text-neon'}`}>
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