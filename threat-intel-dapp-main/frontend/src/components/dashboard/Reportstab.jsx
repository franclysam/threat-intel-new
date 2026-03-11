import React, { useState, useEffect } from 'react';
import { getReports, submitReport, voteOnReport } from "../../services/Apiservice";
import { uploadToIPFS } from "../../services/Ipfsservice";

const Reportstab = ({ userAddress }) => {
  const [reports, setReports] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('MALWARE');
  const [severity, setSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleVote = async (reportId, action) => {
    try {
      const authWallet = userAddress || "0xDEV_USER_ANONYMOUS";
      await voteOnReport(reportId, authWallet, action);
      // Reload reports to get updated vote counts and status
      await loadReports();
    } catch (error) {
      alert(error?.message || `Failed to ${action}.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !title.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload to IPFS (Mocked/Simulated)
      const ipfsHash = await uploadToIPFS(description.trim());

      // 2. Submit to backend API
      await submitReport({
        wallet: userAddress || "0xDEV_USER_ANONYMOUS",
        category: category,
        data: `TITLE: ${title}\nSEVERITY: ${severity}\nDESCRIPTION: ${description}`,
        hash: ipfsHash,
      });

      setIsFormOpen(false);
      setTitle('');
      setDescription('');
      await loadReports();
    } catch (error) {
      alert(error?.message || "Failed to transmit intel signal.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return 'UNKNOWN_NODE';
    if (addr === "0xDEV_USER_ANONYMOUS") return "DEV_NODE_AUTH";
    
    // Hash the handle to an anonymous format
    let hashVal = 0;
    for (let i = 0; i < addr.length; i++) {
      hashVal = ((hashVal << 5) - hashVal) + addr.charCodeAt(i);
      hashVal = hashVal & hashVal; 
    }
    const hex1 = Math.abs(hashVal).toString(16).padStart(8, '0');
    const hex2 = Math.abs(~hashVal).toString(16).padStart(8, 'f');
    return `0x${hex1}${hex2}...`;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter">THREAT_INTEL_STREAM</h2>
          <p className="text-gray-600 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mt-1">Live consensus verified data ledger</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto bg-neon text-black px-6 py-3 font-black text-[9px] md:text-[10px] tracking-widest uppercase flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all"
        >
          [ TRANSMIT_INTEL ]
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:pr-24 relative">
        <div className="hidden lg:block absolute right-0 top-0 w-32 h-64 border-l border-gray-900 overflow-hidden">
          <svg className="w-full h-full text-neon opacity-50" viewBox="0 0 100 200">
            <polyline points="0,100 10,90 20,110 30,50 40,50 50,20 60,30 70,10 80,10 90,0" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="text-neon text-[9px] md:text-[10px] font-black tracking-[0.5em] animate-pulse">SYNCHRONIZING...</div>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-20 text-center border border-gray-900 bg-black/40">
            <div className="text-gray-600 text-[9px] md:text-[10px] font-black tracking-[0.5em]">NO_SIGNALS_DETECTED</div>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="bg-[#050505] border border-gray-900 p-5 md:p-8 group relative transition-all hover:border-neon/30">
              <div className="absolute top-0 right-0 p-3 md:p-4 flex gap-4">
                <div className="border border-green-500/30 px-3 md:px-4 py-1 flex items-center gap-2 bg-green-500/5">
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  <span className="text-[7px] md:text-[8px] font-bold text-green-500 tracking-widest uppercase">{report.status || 'VERIFIED'}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="w-12 h-12 md:w-20 md:h-20 border border-neon/20 flex items-center justify-center bg-neon/5 relative shrink-0">
                  <div className="absolute inset-0 border border-neon/10 m-1 md:m-2"></div>
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-neon/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>

                <div className="flex-1 space-y-4 md:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h3 className="text-lg md:text-2xl font-black text-white tracking-tighter uppercase truncate max-w-full md:max-w-none">{report.category}_VECTOR</h3>
                    <span className={`w-fit text-white text-[7px] md:text-[8px] font-black px-3 py-1 tracking-widest uppercase ${report.data?.includes('CRITICAL') ? 'bg-red-600' : 'bg-orange-600'}`}>
                      {report.data?.includes('CRITICAL') ? 'CRITICAL' : 'HIGH_IMPACT'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 md:gap-6 text-[8px] md:text-[9px] font-bold text-gray-500 tracking-widest">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {new Date(report.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center gap-2">
                      NODE_ID: <span className="text-neon/60">{formatAddress(report.wallet)}</span>
                    </div>
                  </div>

                  <div className="bg-[#080808] p-4 md:p-6 border-l-2 border-neon/30">
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold leading-relaxed tracking-widest理论 whitespace-pre-wrap">
                      {report.data}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-black border border-gray-900 py-2 md:py-3 px-4 md:px-6 flex items-center justify-between group/hash overflow-hidden">
                      <span className="text-gray-600 text-[9px] md:text-[10px] font-bold tracking-widest truncate mr-4">HASH: {report.hash}</span>
                      <svg className="w-4 h-4 text-gray-800 group-hover/hash:text-neon cursor-pointer transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-900/50 gap-4">
                    <div className="flex items-center gap-4 bg-black border border-gray-900 px-3 py-1 rounded-sm">
                      <button 
                        onClick={() => handleVote(report._id, 'upvote')}
                        className={`p-1 hover:text-neon transition-colors ${report.upvotes?.includes(userAddress || "0xDEV_USER_ANONYMOUS") ? 'text-neon' : 'text-gray-500'}`}
                        title="Upvote (Validate)"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
                      </button>
                      
                      <span className="text-[10px] md:text-xs font-black text-white w-6 text-center">
                        {(report.upvotes?.length || 0) - (report.downvotes?.length || 0)}
                      </span>
                      
                      <button 
                        onClick={() => handleVote(report._id, 'downvote')}
                        className={`p-1 hover:text-red-500 transition-colors ${report.downvotes?.includes(userAddress || "0xDEV_USER_ANONYMOUS") ? 'text-red-500' : 'text-gray-500'}`}
                        title="Downvote (Flag)"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                    
                    <div className="flex gap-4 items-center">
                      <div className="text-[8px] md:text-[9px] font-bold text-gray-500 tracking-widest uppercase">
                        {(report.upvotes?.length || 0) + (report.downvotes?.length || 0)} Votes
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-neon" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span className="text-neon text-[9px] md:text-[10px] font-black tracking-widest">+25.00_RWT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#080808] border border-gray-800 w-full max-w-xl p-6 md:p-10 relative shadow-[0_0_100px_rgba(223,255,0,0.1)] overflow-y-auto max-h-[90vh]">
            <div className="corner-tl -translate-x-2 -translate-y-2"></div>
            <div className="corner-br translate-x-2 translate-y-2"></div>

            <div className="flex justify-between items-center mb-8 md:mb-10 border-b border-gray-900 pb-6">
              <h3 className="text-lg md:text-xl font-black text-white tracking-tighter uppercase">EMIT_SIGNAL</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-600 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 text-left">
              <div>
                <label className="block text-[8px] md:text-[9px] font-black text-gray-600 tracking-widest uppercase mb-3">Transmission_Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-gray-800 p-4 text-[10px] md:text-xs font-bold text-white outline-none focus:border-neon transition-all"
                  placeholder="Summarize threat..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-[8px] md:text-[9px] font-black text-gray-600 tracking-widest uppercase mb-3">Vector_Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black border border-gray-800 p-4 text-[10px] md:text-xs font-bold text-white outline-none focus:border-neon appearance-none"
                  >
                    <option value="MALWARE">MALWARE</option>
                    <option value="PHISHING">PHISHING</option>
                    <option value="DDOS">DDOS</option>
                    <option value="EXPLOIT">EXPLOIT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] md:text-[9px] font-black text-gray-600 tracking-widest uppercase mb-3">Criticality_Lvl</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-black border border-gray-800 p-4 text-[10px] md:text-xs font-bold text-white outline-none focus:border-neon appearance-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[8px] md:text-[9px] font-black text-gray-600 tracking-widest uppercase mb-3">Technical_Data</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 md:h-40 bg-black border border-gray-800 p-4 text-[10px] md:text-xs font-bold text-white outline-none focus:border-neon resize-none"
                  placeholder="Enter IOCs..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-neon text-black font-black py-5 md:py-6 text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.5em] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden group uppercase"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {submitting ? 'TRANSMITTING...' : 'EXECUTE_SIGNAL_UPLINK'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportstab;
