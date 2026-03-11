import React, { useState, useEffect } from 'react';
import { getUserStats } from "../../services/Apiservice";
import { getBalance } from "../../utils/Web3";

const Profiletab = ({ userAddress, onLogout }) => {
  const [stats, setStats] = useState({
    totalReports: 0,
    maliciousDetected: 0,
    lastActivity: 'N/A'
  });
  const [ethBalance, setEthBalance] = useState('0.00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [userStats, balance] = await Promise.all([
          getUserStats(userAddress),
          getBalance(userAddress)
        ]);
        setStats(userStats);
        setEthBalance(parseFloat(balance).toFixed(4));
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userAddress]);

  return (
    <div className="space-y-8 md:space-y-12 max-w-5xl mx-auto">
      <div className="bg-[#080808] border border-gray-900 p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-neon/5 blur-[80px] md:blur-[100px] rounded-full -mr-16 -mt-16 md:-mr-32 md:-mt-32"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative">
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-neon p-1 flex items-center justify-center bg-black">
              <div className="w-full h-full bg-[#111] flex items-center justify-center text-3xl md:text-4xl grayscale opacity-80">
                👤
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-neon w-5 h-5 md:w-6 md:h-6 flex items-center justify-center border-4 border-black">
              <div className="w-1 h-1 bg-black"></div>
            </div>
          </div>

          <div className="text-center md:text-left space-y-4 flex-1">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase whitespace-normal break-words">
                {userAddress === "0xDEV_USER_ANONYMOUS" ? "OPERATOR_ROOT_DEV" : "OPERATOR_AUTH_NODE"}
              </h2>
              <p className="text-neon font-bold tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs mt-1">DESCRIPTOR_{userAddress ? userAddress.slice(0, 10) : '0X...'}...</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 pt-2">
              <div className="bg-[#111] border border-gray-800 px-3 md:px-4 py-2 text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest group hover:border-neon transition-all">
                {userAddress === "0xDEV_USER_ANONYMOUS" ? "SYSTEM_ADMIN" : "ELITE_RESEARCHER"}
              </div>
              <div className="bg-[#111] border border-gray-800 px-3 md:px-4 py-2 text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest group hover:border-neon transition-all">
                CONSENSUS_AUTHORITY_V3
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto md:ml-auto">
            <button
              onClick={onLogout}
              className="w-full md:w-auto px-8 py-3 bg-red-500/10 border border-red-500/30 text-red-500 text-[9px] md:text-[10px] font-black tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              [ TERMINATE_UPLINK ]
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-6 md:space-y-8">
          <h3 className="text-[12px] md:text-sm font-black text-white tracking-[0.3em] md:tracking-[0.4em] uppercase border-l border-neon/50 pl-4">CORE_UPLINK_CONFIG</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[7px] md:text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase mb-3">NODE_BALANCE (ETH)</label>
              <div className="w-full bg-black border border-gray-800 p-4 text-[10px] md:text-xs font-bold text-neon outline-none">
                {ethBalance} ETH
              </div>
            </div>
            <div>
              <label className="block text-[7px] md:text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase mb-3">EARNED_RWT_TOKENS</label>
              <div className="w-full bg-black border border-gray-800 p-4 text-[10px] md:text-xs font-bold text-neon outline-none">
                {stats.tokensEarned || 0} RWT
              </div>
            </div>
            <div>
              <label className="block text-[7px] md:text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase mb-3">Recovery_Encryption_Link</label>
              <div className="w-full bg-black border border-gray-800 p-4 text-[10px] md:text-xs font-bold text-gray-500 truncate">
                anonymous@sentinel-net.io
              </div>
            </div>
            <div>
              <label className="block text-[7px] md:text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase mb-3">Neural_Alert_Matrix</label>
              <div className="space-y-3">
                {[
                  { label: 'CRITICAL_VECTOR_INTERCEPT', status: true },
                  { label: 'TREASURY_SETTLEMENT_SIGNAL', status: true },
                  { label: 'GOVERNANCE_POLLING_UPLINK', status: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between p-4 bg-[#080808] border border-gray-800 cursor-pointer hover:border-neon/30 transition-all">
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-500 tracking-widest uppercase">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.status} className="w-4 h-4 md:w-5 md:h-5 accent-neon" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <h3 className="text-[12px] md:text-sm font-black text-white tracking-[0.3em] md:tracking-[0.4em] uppercase border-l border-neon/50 pl-4">REPUTATION_MESH_STATS</h3>
          <div className="bg-[#080808] border border-gray-900 p-6 md:p-8 space-y-8 md:space-y-10">
            <div>
              <div className="flex justify-between text-[9px] md:text-[10px] font-black tracking-widest mb-4">
                <span className="text-gray-600">TRUST_INDEX</span>
                <span className="text-neon">98.42%</span>
              </div>
              <div className="w-full bg-[#111] h-1 overflow-hidden">
                <div className="bg-neon h-full w-[98.42%] shadow-[0_0_100px_#DFFF00]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 md:p-6 bg-black border border-gray-900 text-center relative overflow-hidden">
                <div className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tighter">{stats.totalReports}</div>
                <div className="text-[6px] md:text-[7px] text-gray-600 uppercase tracking-widest font-black">Transmissions</div>
                <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t border-r border-gray-800"></div>
              </div>
              <div className="p-4 md:p-6 bg-black border border-gray-900 text-center relative overflow-hidden">
                <div className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tighter">{stats.maliciousDetected}</div>
                <div className="text-[6px] md:text-[7px] text-gray-600 uppercase tracking-widest font-black">Malicious_Ported</div>
                <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t border-r border-gray-800"></div>
              </div>
            </div>

            <div className="p-5 md:p-6 border border-neon/20 bg-neon/5 relative">
              <div className="corner-tl w-2 h-2"></div>
              <h4 className="text-[8px] md:text-[9px] font-black text-neon mb-3 flex items-center gap-3 tracking-[0.2em] uppercase">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                NETWORK_AUTHORITY
              </h4>
              <p className="text-[8px] md:text-[9px] text-gray-500 font-bold leading-relaxed tracking-widest uppercase">
                Tier-1 operator: 5,000 voting units for protocol consensus parameters and incentive settlement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiletab;
