
import React, { useState } from 'react';
import { ThreatReport } from '../../types';

const ReportTab: React.FC = () => {
  const [reports, setReports] = useState<ThreatReport[]>([
    { id: '1', type: 'Malware', severity: 'Critical', description: 'NEW RANSOMWARE VARIANT TARGETING HEALTHCARE DATABASES IN APAC REGION. ENCRYPTS ASSETS WITH .SENTINEL EXTENSION.', timestamp: '2M_AGO', reporter: '0X882...12A', status: 'Verified' },
    { id: '2', type: 'Phishing', severity: 'High', description: 'DECENTRALIZED DEX SPOOFING CAMPAIGN DETECTED. REDIRECTS TO MALICIOUS ETH_WRAPPER.', timestamp: '15M_AGO', reporter: '0X4F1...A92', status: 'Pending' },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter">THREAT_INTEL_STREAM</h2>
          <p className="text-gray-600 text-[9px] font-bold tracking-widest uppercase mt-1">Live consensus verified data ledger</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-neon text-black px-6 py-3 font-black text-[10px] tracking-widest uppercase flex items-center gap-3"
        >
          [ TRANSMIT_INTEL ]
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:pr-24 relative">
        {/* Sample Visualization (Image 3 right side) */}
        <div className="hidden lg:block absolute right-0 top-0 w-32 h-64 border-l border-gray-900 overflow-hidden">
          <svg className="w-full h-full text-neon opacity-50" viewBox="0 0 100 200">
             <polyline points="0,100 10,90 20,110 30,50 40,50 50,20 60,30 70,10 80,10 90,0" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {reports.map((report) => (
          <div key={report.id} className="bg-[#050505] border border-gray-900 p-8 group relative">
            <div className="absolute top-0 right-0 p-4 flex gap-4">
              <div className="border border-green-500/30 px-4 py-1 flex items-center gap-2">
                 <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                 <span className="text-[8px] font-bold text-green-500 tracking-widest">MESH_CONSENSUS</span>
              </div>
            </div>

            <div className="flex gap-10">
              <div className="w-20 h-20 border border-red-500/50 flex items-center justify-center bg-red-500/5 relative">
                <div className="absolute inset-0 border border-red-500/10 m-2"></div>
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{report.type}_VECTOR</h3>
                  <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 tracking-widest uppercase">CRITICAL</span>
                </div>

                <div className="flex gap-6 text-[9px] font-bold text-gray-500 tracking-widest">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {report.timestamp}
                  </div>
                  <div className="flex items-center gap-2">
                    NODE_ID: <span className="text-gray-400">{report.reporter}</span>
                  </div>
                </div>

                <div className="bg-[#080808] p-6 border-l-2 border-gray-800">
                  <p className="text-xs text-gray-400 font-bold leading-relaxed tracking-widest">
                    {report.description}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-[#080808] border border-gray-900 py-3 px-6 flex items-center justify-between">
                     <span className="text-neon text-[10px] font-bold tracking-widest">F82B2E8C20188701897E06A74B1F413C</span>
                     <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-gray-900">
                   <div className="flex gap-10">
                      <button className="text-[9px] font-bold text-gray-600 tracking-[0.2em] hover:text-white">[ VERIFY_SIGNAL ]</button>
                      <button className="text-[9px] font-bold text-gray-600 tracking-[0.2em] hover:text-white">[ FLAG_ERROR ]</button>
                   </div>
                   <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-neon" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      <span className="text-neon text-xs font-black tracking-widest">+45.00_STN_SETTLED</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#080808] border border-gray-800 w-full max-w-xl p-10 relative">
            <div className="corner-tl"></div>
            <div className="corner-br"></div>
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-white tracking-tighter">EMIT_SIGNAL_UPLINK</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-600 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <form className="space-y-8">
              <div>
                <label className="block text-[9px] font-black text-gray-600 tracking-widest uppercase mb-3">Transmission_Title</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-gray-800 p-4 text-xs font-bold text-white outline-none focus:border-neon transition-all"
                  placeholder="Summarize threat vector..."
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[9px] font-black text-gray-600 tracking-widest uppercase mb-3">Vector_Category</label>
                  <select className="w-full bg-black border border-gray-800 p-4 text-xs font-bold text-white outline-none focus:border-neon">
                    <option>MALWARE</option>
                    <option>PHISHING</option>
                    <option>DDOS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-600 tracking-widest uppercase mb-3">Criticality_Lvl</label>
                  <select className="w-full bg-black border border-gray-800 p-4 text-xs font-bold text-white outline-none focus:border-neon">
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                    <option>CRITICAL</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-600 tracking-widest uppercase mb-3">Technical_Data_Stream</label>
                <textarea 
                  className="w-full h-40 bg-black border border-gray-800 p-4 text-xs font-bold text-white outline-none focus:border-neon resize-none"
                  placeholder="Enter IOCs, patterns, or encrypted data..."
                ></textarea>
              </div>
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-full bg-neon text-black font-black py-6 text-sm tracking-[0.4em]"
              >
                EXECUTE_TRANSMISSION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTab;
