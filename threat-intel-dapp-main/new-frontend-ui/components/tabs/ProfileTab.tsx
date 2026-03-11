
import React from 'react';

const ProfileTab: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="bg-[#080808] border border-gray-900 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative">
          <div className="relative">
            <div className="w-40 h-40 border-2 border-neon p-1 flex items-center justify-center bg-black">
              <img 
                src="https://picsum.photos/seed/sentinel-01/400/400" 
                alt="Identity" 
                className="w-full h-full object-cover grayscale opacity-80"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-neon w-6 h-6 flex items-center justify-center border-4 border-black">
               <div className="w-1 h-1 bg-black"></div>
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-4">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">OPERATOR_ALEX_T</h2>
              <p className="text-neon font-bold tracking-[0.3em] text-xs mt-1">DESCRIPTOR_0X71C...4F92</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="bg-[#111] border border-gray-800 px-4 py-2 text-[8px] font-black text-gray-500 uppercase tracking-widest group hover:border-neon transition-all">
                ELITE_RESEARCHER
              </div>
              <div className="bg-[#111] border border-gray-800 px-4 py-2 text-[8px] font-black text-gray-500 uppercase tracking-widest group hover:border-neon transition-all">
                CONSENSUS_AUTHORITY_V3
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-sm font-black text-white tracking-[0.4em] uppercase">CORE_UPLINK_CONFIG</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase mb-3">Public_Identifier</label>
              <input type="text" defaultValue="Alex Thompson" className="w-full bg-black border border-gray-800 p-4 text-xs font-bold text-white outline-none focus:border-neon transition-all" />
            </div>
            <div>
              <label className="block text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase mb-3">Recovery_Encryption_Link</label>
              <input type="email" defaultValue="alex@tactical-mesh.io" className="w-full bg-black border border-gray-800 p-4 text-xs font-bold text-white outline-none focus:border-neon transition-all" />
            </div>
            <div>
              <label className="block text-[8px] font-black text-gray-600 tracking-[0.3em] uppercase mb-3">Neural_Alert_Matrix</label>
              <div className="space-y-3">
                {[
                  { label: 'CRITICAL_VECTOR_INTERCEPT', status: true },
                  { label: 'TREASURY_SETTLEMENT_SIGNAL', status: true },
                  { label: 'GOVERNANCE_POLLING_UPLINK', status: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between p-4 bg-[#080808] border border-gray-800 cursor-pointer hover:border-neon/30 transition-all">
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.status} className="w-5 h-5 accent-neon" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-sm font-black text-white tracking-[0.4em] uppercase">REPUTATION_MESH_STATS</h3>
          <div className="bg-[#080808] border border-gray-900 p-8 space-y-10">
            <div>
              <div className="flex justify-between text-[10px] font-black tracking-widest mb-4">
                <span className="text-gray-600">TRUST_INDEX</span>
                <span className="text-neon">98.42%</span>
              </div>
              <div className="w-full bg-[#111] h-1 overflow-hidden">
                <div className="bg-neon h-full w-[98.42%] shadow-[0_0_10px_#DFFF00]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-black border border-gray-900 text-center relative overflow-hidden">
                <div className="text-4xl font-black text-white mb-2 tracking-tighter">142</div>
                <div className="text-[7px] text-gray-600 uppercase tracking-widest font-black">Verified_Transmissions</div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gray-800"></div>
              </div>
              <div className="p-6 bg-black border border-gray-900 text-center relative overflow-hidden">
                <div className="text-4xl font-black text-white mb-2 tracking-tighter">0</div>
                <div className="text-[7px] text-gray-600 uppercase tracking-widest font-black">Signal_Rejections</div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gray-800"></div>
              </div>
            </div>

            <div className="p-6 border border-neon/20 bg-neon/5 relative">
              <div className="corner-tl w-2 h-2"></div>
              <h4 className="text-[9px] font-black text-neon mb-3 flex items-center gap-3 tracking-[0.2em]">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                NETWORK_AUTHORITY_ROLE
              </h4>
              <p className="text-[9px] text-gray-500 font-bold leading-relaxed tracking-widest">
                As a Tier-1 validated operator, your node holds 5,000 voting units for protocol consensus parameters and incentive settlement rounds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
